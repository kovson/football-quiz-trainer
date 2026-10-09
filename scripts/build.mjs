import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arg = name => process.argv.find(a => a.startsWith(`${name}=`))?.slice(name.length + 1);
const input = resolve(arg('--content') ?? `${root}/content/sessions`);
const output = resolve(arg('--out') ?? `${root}/dist`);
const now = new Date(arg('--now') ?? Date.now());
const preview = process.argv.includes('--preview');
const fail = message => { throw new Error(message); };
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const validDate = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
const instant = value => nonempty(value) && /(?:Z|[+-]\d{2}:\d{2})$/.test(value) && Number.isFinite(Date.parse(value));
const day = date => Date.parse(`${date}T12:00:00Z`) / 86400000;
const warsawDate = date => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Warsaw' }).format(date);
const formats = new Set(['career', 'career-gap', 'career-riddle', 'coach-link', 'photo', 'lineup', 'fact', 'result', 'coach', 'shared-club', 'transfer', 'club-riddle', 'crest', 'country', 'stadium', 'true-false', 'kit']);

async function load(directory) {
  let names;
  try { names = await readdir(directory); } catch (error) { if (error.code === 'ENOENT' && directory === `${root}/content/sessions`) return []; throw error; }
  return Promise.all(names.filter(n => n.endsWith('.json')).map(async name => JSON.parse(await readFile(resolve(directory, name), 'utf8'))));
}

function validate(sessions) {
  const sessionIds = new Set(), dates = new Set(), ids = new Set(), facts = new Set(), prompts = new Set(), subjects = new Map();
  for (const s of [...sessions].sort((a, b) => a.date.localeCompare(b.date))) {
    if (!nonempty(s.id) || !nonempty(s.title) || !validDate(s.date) || !instant(s.publishAt) || warsawDate(new Date(s.publishAt)) !== s.date || !instant(s.researchedAt) || !['sample', 'daily'].includes(s.kind)) fail(`Invalid session metadata: ${s.id}`);
    if (sessionIds.has(s.id) || dates.has(`${s.kind}:${s.date}`)) fail(`Duplicate session: ${s.id}`);
    sessionIds.add(s.id); dates.add(`${s.kind}:${s.date}`);
    if (s.kind === 'daily' && (!s.eventWindow || !validDate(s.eventWindow.start) || !validDate(s.eventWindow.end) || s.eventWindow.start > s.eventWindow.end || s.eventWindow.end > s.date)) fail(`Missing or invalid event window: ${s.id}`);
    if (!Array.isArray(s.questions) || s.questions.length !== 30) fail(`Session ${s.id} must contain exactly 30 questions`);
    const inSession = new Set();
    for (const q of s.questions) {
      if (!nonempty(q.id) || !nonempty(q.factKey) || !nonempty(q.prompt) || !formats.has(q.format) || !['łatwe', 'średnie', 'trudne', 'bardzo trudne'].includes(q.difficulty) || !Array.isArray(q.tags) || !q.tags.every(nonempty) || !Array.isArray(q.subjects) || !q.subjects.length || !q.subjects.every(nonempty) || !Array.isArray(q.answerParts) || !q.answerParts.length || !q.answerParts.every(nonempty)) fail(`Incomplete question: ${q.id}`);
      const normalized = q.prompt.toLocaleLowerCase('pl').replace(/\s+/g, ' ').trim();
      if (ids.has(q.id) || facts.has(q.factKey) || prompts.has(normalized)) fail(`Duplicate question or fact: ${q.id}`);
      ids.add(q.id); facts.add(q.factKey); prompts.add(normalized);
      if (!Array.isArray(q.sources) || !q.sources.length || !q.sources.every(source => nonempty(source.title) && /^https:\/\//.test(source.url) && instant(source.checkedAt))) fail(`Missing source: ${q.id}`);
      if (q.tags.includes('recent') && (!validDate(q.eventDate) || !s.eventWindow || q.eventDate < s.eventWindow.start || q.eventDate > s.eventWindow.end)) fail(`Recent question outside event window: ${q.id}`);
      if (q.tags.includes('season') && (!/^\d{4}\/\d{2}$/.test(q.season ?? '') || !validDate(q.eventDate) || q.eventDate > s.date)) fail(`Current-season question needs a season and completed event date: ${q.id}`);
      if (q.format === 'lineup' && !q.lineup) fail(`Lineup question needs a starting XI: ${q.id}`);
      if (['career','career-gap'].includes(q.format) && !q.career) fail(`Career question needs a badge timeline: ${q.id}`);
      if (q.lineup) {
        const players = q.lineup.rows?.flat();
        if (q.format !== 'lineup' || !players || players.length !== 11 || !players.every(p => nonempty(p.name) && (p.slot === undefined || Number.isInteger(p.slot))) || new Set(players.map(p => p.name)).size !== 11) fail(`Invalid lineup: ${q.id}`);
        const missing = players.filter(p => p.slot !== undefined).sort((a, b) => a.slot - b.slot);
        if (missing.length !== q.answerParts.length || !missing.every((p, i) => p.slot === i && p.name === q.answerParts[i])) fail(`Lineup answers do not match: ${q.id}`);
      }
      for (const subject of new Set(q.subjects)) {
        if (inSession.has(subject)) fail(`Repeated main subject in session: ${subject}`);
        inSession.add(subject);
        const previous = subjects.get(subject);
        if (previous && previous.kind === s.kind) {
          const gap = day(s.date) - day(previous.date);
          if (gap < 30) fail(`Subject cooldown under 30 days: ${subject}`);
          if (gap < 60 && !nonempty(q.cooldownReason)) fail(`Subject cooldown under 60 days needs a reason: ${subject}`);
        }
        subjects.set(subject, { date: s.date, kind: s.kind });
      }
    }
  }
}

if (!Number.isFinite(now.getTime())) fail('Invalid build time');
const daily = await load(input);
validate(daily);
if (daily.some(s => s.kind !== 'daily')) fail('Samples cannot enter the daily content directory');
const samples = preview ? (await load(`${root}/content/samples`)).sort((a,b) => b.id.localeCompare(a.id)).slice(0,1) : [];
validate(samples);
if (samples.some(s => s.kind !== 'sample')) fail('Daily content cannot enter the sample directory');
const sessions = [...daily.filter(s => Date.parse(s.publishAt) <= now.getTime()), ...samples].sort((a, b) => b.date.localeCompare(a.date));
async function embed(media) {
  if (!media || !/^assets\/[a-z0-9-]+\.(jpg|png)$/.test(media.path) || !nonempty(media.alt) || !nonempty(media.credit) || !nonempty(media.license) || !/^https:\/\//.test(media.source) || !/^https:\/\//.test(media.licenseUrl)) fail('Incomplete or unsafe image metadata');
  if (media.crop && (!Array.isArray(media.crop) || media.crop.length !== 4 || !media.crop.every(n => Number.isFinite(n) && n >= 0) || media.crop[2] === 0 || media.crop[3] === 0 || !Number.isFinite(media.width) || media.width < media.crop[0] + media.crop[2])) fail('Invalid image crop');
  const bytes = await readFile(resolve(root, media.path));
  const png = media.path.endsWith('.png');
  if (png ? !bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : bytes[0] !== 255 || bytes[1] !== 216) fail(`Invalid image file: ${media.path}`);
  media.data = `data:image/${png ? 'png' : 'jpeg'};base64,${bytes.toString('base64')}`;
}
for (const s of [...daily,...samples]) for (const q of s.questions) {
  if (q.media) await embed(q.media);
  if (['photo','crest','stadium'].includes(q.format) && !q.media) fail(`Visual question needs an image: ${q.id}`);
  if (q.career) {
    if (!['career','career-gap'].includes(q.format) || !Array.isArray(q.career) || q.career.length < 2) fail(`Invalid career: ${q.id}`);
    for (const step of q.career) {
      if (!nonempty(step.club) || !nonempty(step.years) || (step.missing !== undefined && (!Number.isInteger(step.missing) || q.answerParts[step.missing] !== step.club))) fail(`Invalid career step: ${q.id}`);
      if (step.media) await embed(step.media);
      else if (step.missing === undefined) fail(`Career step needs a badge: ${q.id}`);
    }
  }
}
const data = JSON.stringify({ preview, sessions }).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
const [template, css, js] = await Promise.all(['src/index.html', 'src/style.css', 'src/app.js'].map(p => readFile(resolve(root, p), 'utf8')));
const html = template.replace('/*__STYLE__*/', () => css).replace('/*__APP__*/', () => js).replace('__DATA__', () => data);
await mkdir(output, { recursive: true });
await writeFile(resolve(output, 'index.html'), html);
await writeFile(resolve(output, '.nojekyll'), '');
console.log(`Built ${sessions.length} session(s), ${sessions.reduce((n, s) => n + s.questions.length, 0)} questions → ${output}/index.html${preview ? ' (local sample)' : ''}`);
