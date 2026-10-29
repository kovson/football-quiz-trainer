import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,mkdir,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const sample=JSON.parse(await readFile(new URL('../content/samples/sample-02.json',import.meta.url),'utf8'));
const build=new URL('../scripts/build.mjs',import.meta.url).pathname;
async function run(content,{preview=false,now='2026-10-08T10:00:00Z',reviews=[]}={}){
 const dir=await mkdtemp(join(tmpdir(),'football-build-')),input=join(dir,'in'),out=join(dir,'out'),reviewInput=join(dir,'reviews');await mkdir(input);await mkdir(reviewInput);
 try{for(let i=0;i<content.length;i++)await writeFile(join(input,`${i}.json`),JSON.stringify(content[i]));for(let i=0;i<reviews.length;i++)await writeFile(join(reviewInput,`${i}.json`),JSON.stringify(reviews[i]));const result=spawnSync(process.execPath,[build,`--content=${input}`,`--reviews=${reviewInput}`,`--out=${out}`,`--now=${now}`,...(preview?['--preview']:[])],{encoding:'utf8'});const html=result.status===0?await readFile(join(out,'index.html'),'utf8'):'';return {...result,html};}finally{await rm(dir,{recursive:true,force:true});}
}
function daily(date='2026-10-08',publishAt='2026-10-08T07:00:00+02:00') {return {...structuredClone(sample),id:`daily-${date}`,kind:'daily',date,publishAt,eventWindow:{start:'2026-10-07',end:date}};}
function data(html){return JSON.parse(html.match(/<script id="training-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);}
test('new preview has exactly 30 questions, embedded visual material and current season',async()=>{const r=await run([],{preview:true});assert.equal(r.status,0,r.stderr);const s=data(r.html).sessions;assert.deepEqual(s.map(s=>s.id),['sample-02']);assert.equal(s[0].questions.length,30);assert.equal(s[0].questions.filter(q=>q.tags.includes('season')).length,6);assert.equal(s[0].questions.filter(q=>q.tags.includes('polish')).length,8);assert.ok(s[0].questions.filter(q=>q.media).every(q=>q.media.data.startsWith('data:image/')));assert.equal(s[0].questions.filter(q=>q.career).length,5);assert.ok(!r.html.includes('<textarea'));});
test('production omits local samples and all future answers until Warsaw release instant',async()=>{for(const [date,instant] of [['2026-10-08','2026-10-08T07:00:00+02:00'],['2026-12-08','2026-12-08T07:00:00+01:00'],['2026-10-09','2026-10-08T23:50:00+02:00'],['2026-12-09','2026-12-08T23:50:00+01:00']]){const s=daily(date,instant),release=Date.parse(instant);s.eventWindow={start:date,end:date};let r=await run([s],{now:new Date(release-1).toISOString()});assert.equal(r.status,0,r.stderr);assert.deepEqual(data(r.html).sessions,[]);assert.ok(!r.html.includes('Alaksandr Hleb'));r=await run([s],{now:new Date(release).toISOString()});assert.equal(r.status,0,r.stderr);assert.deepEqual(data(r.html).sessions.map(s=>s.id),[s.id]);}});
test('incomplete sessions, duplicated facts and source omissions fail publication',async()=>{for(const mutate of [s=>s.questions.pop(),s=>s.questions[1].factKey=s.questions[0].factKey,s=>s.questions[0].sources=[]]){const s=daily();mutate(s);assert.notEqual((await run([s])).status,0);}});
test('text career riddles and shared-coach questions publish without badge timelines',async()=>{const s=daily();s.questions[18].format='career-riddle';delete s.questions[18].career;s.questions[22].format='coach-link';s.questions[22].difficulty='bardzo trudne';const r=await run([s]);assert.equal(r.status,0,r.stderr);const published=data(r.html).sessions[0];assert.equal(published.questions[18].format,'career-riddle');assert.equal(published.questions[22].format,'coach-link');assert.equal(published.questions[22].difficulty,'bardzo trudne');const unsupported=daily();unsupported.questions[18].format='unknown-format';assert.notEqual((await run([unsupported])).status,0);});
test('image paths and credits are checked even in unreleased files',async()=>{for(const mutate of [s=>s.questions[0].media.path='../README.md',s=>delete s.questions[0].media.license]){const s=daily('2026-12-08','2026-12-08T07:00:00+01:00');mutate(s);assert.notEqual((await run([s])).status,0);}});
test('hidden career answers and transfer routes require attributed badges before release',async()=>{
 const valid=daily();const r=await run([valid]);assert.equal(r.status,0,r.stderr);const published=data(r.html).sessions[0];
 assert.ok(published.questions[1].career.at(-1).media.data.startsWith('data:image/png;'));
 const move=published.questions[25].transfer;assert.equal(move.year,2005);assert.ok(move.from.media.data.startsWith('data:image/png;'));assert.ok(move.to.media.data.startsWith('data:image/png;'));
 for(const mutate of [s=>delete s.questions[1].career.at(-1).media,s=>delete s.questions[25].transfer.to.media,s=>delete s.questions[25].transfer.from.media.license,s=>s.questions[25].transfer.year=2027]){
  const future=daily('2026-12-08','2026-12-08T07:00:00+01:00');mutate(future);assert.notEqual((await run([future])).status,0);
 }
});
test('club-gap answers must match the timeline and lineup must contain eleven players',async()=>{for(const mutate of [s=>s.questions[1].career.at(-1).club='Wrong club',s=>s.questions[3].lineup.rows.pop(),s=>delete s.questions[18].career]){const s=daily();mutate(s);assert.notEqual((await run([s])).status,0);}});
test('current-season facts cannot claim unplayed dates or become recent outside the window',async()=>{for(const mutate of [s=>s.questions[6].eventDate='2026-10-09',s=>s.questions[6].tags.push('recent')]){const s=daily();mutate(s);assert.notEqual((await run([s])).status,0);}});
test('30-day cooldown is enforced across sessions; 30–59 days requires an editorial reason',async()=>{const first=daily();const second=daily('2026-10-28','2026-10-28T07:00:00+01:00');second.questions.forEach((q,i)=>{q.id=`next-${i}`;q.factKey=`next-fact-${i}`;q.prompt+=' Nowa wersja.';q.subjects=[`other:${i}`];});second.questions[0].subjects=first.questions[0].subjects;let r=await run([first,second]);assert.notEqual(r.status,0);assert.match(r.stderr,/cooldown under 30/);second.date='2026-11-08';second.id='daily-2026-11-08';second.publishAt='2026-11-08T07:00:00+01:00';second.eventWindow.end=second.date;r=await run([first,second]);assert.notEqual(r.status,0);assert.match(r.stderr,/needs a reason/);second.questions[0].cooldownReason='Different verified topic, curriculum exception.';r=await run([first,second]);assert.equal(r.status,0,r.stderr);});

function reviewOf(session) {
 const review=structuredClone(session);
 review.id='review-2026-10-08';review.kind='review';review.title='Przed quizem · 8.10';review.publishAt='2026-10-08T10:00:00Z';
 review.questions.forEach((q,i)=>{q.id=`review-question-${i}`;q.tags=[...new Set([...q.tags,'recent'])];q.eventDate='2026-10-08';});
 return review;
}
test('an explicit review can revisit daily facts without replacing the daily set or leaking before release',async()=>{
 const s=daily(),review=reviewOf(s),release=Date.parse(review.publishAt);
 let r=await run([s],{reviews:[review],now:new Date(release-1).toISOString()});assert.equal(r.status,0,r.stderr);assert.deepEqual(data(r.html).sessions.map(s=>s.id),[s.id]);assert.ok(!r.html.includes('review-question-0'));
 r=await run([s],{reviews:[review],now:new Date(release).toISOString()});assert.equal(r.status,0,r.stderr);const published=data(r.html).sessions;assert.deepEqual(published.map(s=>s.id),[review.id,s.id]);assert.equal(published[0].questions[0].factKey,published[1].questions[0].factKey);assert.notEqual(published[0].questions[0].id,published[1].questions[0].id);
});
test('every pre-quiz question needs an event in its window and complete evidence, even before release',async()=>{
 for(const mutate of [s=>s.questions[0].tags=s.questions[0].tags.filter(t=>t!=='recent'),s=>s.questions[0].eventDate='2026-10-06',s=>s.eventWindow.start='2026-10-09',s=>s.questions[0].sources=[],s=>delete s.questions[0].media.license]){
  const review=reviewOf(daily());mutate(review);assert.notEqual((await run([],{reviews:[review],now:'2026-10-08T09:59:59Z'})).status,0);
 }
});
test('daily and review progress identities cannot collide',async()=>{
 const s=daily();for(const mutate of [r=>r.id=s.id,r=>r.questions[0].id=s.questions[0].id]){const review=reviewOf(s);mutate(review);const result=await run([s],{reviews:[review]});assert.notEqual(result.status,0);assert.match(result.stderr,/IDs must be unique/);}
});

test('shirt sponsor masks remain inside their visible crop and require kit questions before release',async()=>{
 function masked(){const s=daily('2026-12-08','2026-12-08T07:00:00+01:00');const q=s.questions[0];q.format='kit';q.media.height=300;q.media.mask=[150,50,100,60];return s;}
 const valid=masked();let r=await run([valid],{now:'2026-12-08T07:00:00+01:00'});assert.equal(r.status,0,r.stderr);assert.deepEqual(data(r.html).sessions[0].questions[0].media.mask,[150,50,100,60]);
 for(const mutate of [s=>s.questions[0].media.mask=[129,50,50,60],s=>s.questions[0].media.mask=[200,50,100,60],s=>s.questions[0].media.mask=[150,50,0,60],s=>s.questions[0].media.mask=[150,50,50,'60'],s=>delete s.questions[0].media.height,s=>s.questions[0].format='photo']){const invalid=masked();mutate(invalid);r=await run([invalid],{now:'2026-12-08T06:59:59+01:00'});assert.notEqual(r.status,0);assert.match(r.stderr,/mask|kit question/);}
 const uncropped=masked();delete uncropped.questions[0].media.crop;uncropped.questions[0].media.mask=[0,0,331,300];r=await run([uncropped],{now:'2026-12-08T07:00:00+01:00'});assert.equal(r.status,0,r.stderr);
});
