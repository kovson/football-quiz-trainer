(() => {
  'use strict';
  const { sessions, preview } = JSON.parse(document.getElementById('training-data').textContent);
  const el = id => document.getElementById(id);
  const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const today = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Warsaw' }).format(new Date());
  const dateLabel = date => new Intl.DateTimeFormat('pl-PL', { day:'numeric', month:'long', year:'numeric', timeZone:'Europe/Warsaw' }).format(new Date(`${date}T12:00:00Z`));
  const formats = { career:'Ścieżka kariery', 'career-gap':'Luka w karierze', photo:'Kto jest na zdjęciu?', lineup:'Brakujące ogniwa', fact:'Piłkarskie fakty', result:'Wynik meczu', coach:'Na ławce', 'shared-club':'Wspólny klub', transfer:'Rynek transferowy', 'club-riddle':'Jaki to klub?', crest:'Rozpoznaj herb', country:'Piłkarska geografia', stadium:'Stadiony', 'true-false':'Prawda czy fałsz?', kit:'Barwy klubowe' };
  let session = sessions.find(s => s.kind === 'daily' && s.date === today()) ?? sessions[0];
  let state, persistent = true;
  function storageProblem() { persistent = false; el('storage-warning').hidden = false; el('local-note').textContent = 'Postęp jest teraz przechowywany tylko do zamknięcia lub odświeżenia strony.'; }
  function fresh() { return { index:0, revealed:[], complete:false }; }
  function load() {
    state = fresh();
    try {
      const raw = localStorage.getItem(`pb:${session.id}`);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (!saved || !Number.isInteger(saved.index) || !Array.isArray(saved.revealed)) return;
      const ids = new Set(session.questions.map(q => q.id));
      state = { index:Math.max(0,Math.min(saved.index,29)), revealed:[...new Set(saved.revealed.filter(id => ids.has(id)))], complete:saved.complete === true };
      state.complete = state.complete && state.revealed.length === 30;
    } catch { storageProblem(); }
  }
  function save() { if (!persistent) return; try { localStorage.setItem(`pb:${session.id}`,JSON.stringify(state)); } catch { storageProblem(); } }
  function select(s) { session=s; load(); el('restart-confirm').hidden=true; render(); }
  function navigate(index) { state.index=index; state.complete=false; save(); render(); el('question-title')?.focus({preventScroll:true}); }
  function lineup(q, revealed) {
    if (!q.lineup) return '';
    return `<div class="pitch" aria-label="Wyjściowy skład na boisku">${q.lineup.rows.map(row => `<div class="pitch-row">${row.map(p => {const missing = p.slot !== undefined; return `<div class="player${missing && !revealed ? ' missing' : ''}"><span class="shirt" aria-hidden="true">${missing ? p.slot+1 : '•'}</span><span>${missing && !revealed ? `Brak ${p.slot+1}` : escape(p.name)}</span></div>`;}).join('')}</div>`).join('')}</div><p class="pitch-caption">${escape(q.lineup.caption)}</p>`;
  }
  function picture(media, className = '') {
    const crop = media.crop;
    const style = crop ? ` style="aspect-ratio:${crop[2]}/${crop[3]};--image-width:${media.width/crop[2]*100}%;--image-left:${-crop[0]/crop[2]*100}%;--image-top:${-crop[1]/crop[3]*100}%;"` : '';
    return `<div class="question-image ${className}${crop ? ' cropped' : ''}"${style}><img src="${escape(media.data)}" alt="${escape(media.alt)}"${crop ? '' : ' loading="eager"'}></div>`;
  }
  function career(q, revealed) {
    if (!q.career) return '';
    return `<ol class="career-path" aria-label="Kolejne etapy kariery">${q.career.map((step,i) => `<li><div class="career-badge">${step.missing !== undefined ? `<span class="career-blank">${revealed ? escape(step.club) : `? ${step.missing+1}`}</span>` : picture({...step.media,alt:revealed ? step.club : `Herb klubu na etapie ${i+1}`},'badge')}</div><span class="career-years">${escape(step.years)}</span>${revealed && step.missing === undefined ? `<span class="career-name">${escape(step.club)}</span>` : ''}${step.note ? `<small>${escape(step.note)}</small>` : ''}</li>`).join('')}</ol><p class="pitch-caption">${escape(q.careerCaption ?? 'Wybrane etapy kariery seniorskiej; herby służą do rozpoznania klubów.')}</p>`;
  }
  function credits(q) {
    const media = [q.media,...(q.career ?? []).map(s => s.media)].filter(Boolean);
    if (!media.length) return '';
    return `<details class="image-credits"><summary>Źródła zdjęć i herbów</summary>${media.map(m => `<p><a href="${escape(m.source)}" target="_blank" rel="noopener noreferrer">${escape(m.credit)}</a> · <a href="${escape(m.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(m.license)}</a> · ${escape(m.changes)}</p>`).join('')}</details>`;
  }
  function render() {
    el('edition-date').textContent = dateLabel(today()).toLocaleUpperCase('pl');
    el('sample-notice').hidden = !preview;
    el('waiting').hidden = preview || sessions.some(s => s.kind === 'daily' && s.date === today());
    el('session-label').textContent = session ? `${session.kind === 'sample' ? 'Trening próbny' : dateLabel(session.date)} · ${session.title}` : 'Codzienny trening';
    el('archive-list').innerHTML = sessions.map(s => `<button data-session="${escape(s.id)}">${escape(s.title)} · ${s.kind === 'sample' ? 'Zestaw próbny' : escape(dateLabel(s.date))} · 30 pytań</button>`).join('') || '<p>Archiwum pojawi się po pierwszym treningu.</p>';
    el('training').hidden = !session;
    el('empty').hidden = Boolean(session);
    if (!session) return;
    el('reveal-count').textContent = `${state.revealed.length} / 30`;
    el('progress').value = state.revealed.length;
    el('question-nav').innerHTML = session.questions.map((q,i) => `<button data-question="${i}" class="${state.revealed.includes(q.id) ? 'seen' : ''}" aria-label="Pytanie ${i+1}${state.revealed.includes(q.id) ? ', odpowiedź odkryta' : ''}"${i === state.index && !state.complete ? ' aria-current="step"' : ''}>${i+1}</button>`).join('');
    if (state.complete) {
      el('question-card').innerHTML = '<div class="complete"><p class="eyebrow">30 PYTAŃ ZA TOBĄ</p><h2>Dobra robota na dziś.</h2><p>Wróć do dowolnego pytania, żeby utrwalić odpowiedź.<br>Kolejny trening to kolejna porcja piłkarskiej wiedzy.</p><button class="quiet" id="review">Wróć do pytań</button></div>';
      el('review').onclick = () => navigate(0);
      return;
    }
    const q = session.questions[state.index], revealed = state.revealed.includes(q.id);
    el('question-card').innerHTML = `<div class="card-top"><span class="category">${escape(formats[q.format])}</span><span>${String(state.index+1).padStart(2,'0')} / 30 · ${escape(q.difficulty)}</span></div><div class="question-body"><h2 id="question-title" tabindex="-1">${escape(q.prompt)}</h2>${q.clues ? `<ul class="clues">${q.clues.map(c => `<li>${escape(c)}</li>`).join('')}</ul>` : ''}${q.media ? picture(q.media,q.format) : ''}${career(q,revealed)}${lineup(q,revealed)}<p class="instruction">${escape(q.instruction ?? 'Najpierw spróbuj odpowiedzieć z pamięci.')}</p>${!revealed ? '<button class="reveal" id="reveal">Pokaż odpowiedź <span aria-hidden="true">↗</span></button>' : `<section class="answer" aria-label="Odpowiedź"><p class="eyebrow">ODPOWIEDŹ</p><ul>${q.answerParts.map((part,i) => `<li>${q.answerParts.length > 1 ? `${i+1}. ` : ''}${escape(part)}</li>`).join('')}</ul><div class="sources"><span>Sprawdź źródło:</span>${q.sources.map(source => `<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.title)} ↗</a>`).join('')}</div>${credits(q)}</section>`}</div><div class="card-bottom"><button class="prev" id="previous" ${state.index === 0 ? 'disabled' : ''}>← Poprzednie</button><button class="next" id="next">${state.index === 29 ? (state.revealed.length === 30 ? 'Zakończ trening ✓' : 'Wróć do nieodkrytych →') : 'Następne pytanie →'}</button></div>`;
    if (!revealed) el('reveal').onclick = () => { state.revealed.push(q.id); save(); render(); el('next').focus({preventScroll:true}); };
    el('previous').onclick = () => navigate(state.index-1);
    el('next').onclick = () => {
      if (state.index < 29) return navigate(state.index+1);
      if (state.revealed.length < 30) return navigate(session.questions.findIndex(question => !state.revealed.includes(question.id)));
      state.complete=true; save(); render(); el('question-card').scrollIntoView({block:'start'});
    };
  }
  el('archive-toggle').onclick = () => { el('archive').hidden=!el('archive').hidden; el('archive-toggle').setAttribute('aria-expanded',String(!el('archive').hidden)); };
  el('archive-list').onclick = event => { const button=event.target.closest('[data-session]'); if (!button) return; select(sessions.find(s => s.id===button.dataset.session)); el('archive').hidden=true; el('archive-toggle').setAttribute('aria-expanded','false'); };
  el('question-nav').onclick = event => { const button=event.target.closest('[data-question]'); if (button) navigate(Number(button.dataset.question)); };
  el('restart').onclick = () => { el('restart-confirm').hidden=false; el('restart-cancel').focus(); };
  el('restart-cancel').onclick = () => { el('restart-confirm').hidden=true; el('restart').focus(); };
  el('restart-yes').onclick = () => { state=fresh(); save(); el('restart-confirm').hidden=true; render(); };
  if (session) load();
  render();
  window.addEventListener('pageshow',render);
})();
