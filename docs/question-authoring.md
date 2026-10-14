# Daily question authoring

These rules include the generator refinements accepted on 11 October 2026 and apply from the next session, 12 October. Previously published sessions remain in the archive. Research and author locally on the Mac; GitHub Actions validates and publishes generated content without AI credentials.

## Experience and candidate selection

- Keep the experience a fun, phone-friendly quiz of about ten minutes: think, reveal, and move on. Improve selection and wording rather than adding required writing, scoring, revision tasks, or timed practice to the app.
- Research around forty-five candidate questions before selecting the strongest thirty. Do not treat the first thirty structurally valid questions as the finished set. Use the surplus to replace weak questions without filling quotas with arbitrary facts.
- Follow this sequence: inspect the archive and rolling coverage; plan a varied mix; research candidates; verify answers; inspect clues and images; select and order thirty; validate and publish.
- Reject candidates with weak evidence, ambiguous answers, poor images, excessive reading, arbitrary detail, or a task overused in the current set or recent sessions. Media availability must not decide the whole mix.
- Prefer one answer per question, sometimes two, and three only occasionally. Keep prompts short and career summaries to two or three concise sentences. A challenging answer should not require a long question.
- Vary the actual recall task, not just the named player or league. Avoid consecutive questions that ask for the same kind of recall. Rotate career gaps, shared clubs, shared coaches, kits, crest fragments, text riddles, transfers, lineups, lists, and comparisons across sessions instead of repeating the same daily template.

## Daily selection

- Write thirty original questions in Polish, identical and in the same order for everyone. Mental recall precedes answer reveal. Do not add answer inputs, scores, or required explanations. Keep sources and image credits after reveal.
- Inspect previous sessions before drafting. Never recycle a question or merely reword its fact. Minimum main-subject cooldown: thirty days, preferably sixty; explain a thirty-to-fifty-nine-day exception. Background clues may recur.
- Limit questions whose main task is naming a match's scorers to three per session, including historical and current matches combined. Changing the match does not create a different task. Also vary assist, country, transfer, and identification patterns; interleave formats.
- Retain roughly six Polish-football questions and six current/recent questions; categories may overlap. Use these and the transfer target as anchors while varying the rest of the set. Mix portraits, stadiums, kits, crests, badge careers, career gaps, starting XIs, text riddles, shared clubs, coaches, transfers, short lists, comparisons, records, competition history, and unusual football connections.
- Aim for four transfer questions per daily session. Show a prominent year and two genuine club badges joined by an arrow in selling-to-buying order, without redundant “Z klubu” / “Do klubu” labels, with optional sourced month, loan status, or fee. Keep the club names hidden until answer reveal; vary leagues, eras, domestic/cross-border moves, loans, and permanent transfers. These replace other questions within the thirty-question set.
- Include a short text career riddle and a shared-coach question regularly, normally one of each per session when distinct, well-supported subjects are available. Do not let media availability determine the whole curriculum.

## Career riddles and shared coaches

- `career-riddle`: identify a player from a short written career summary, usually two or three concise sentences. Combine meaningful clues such as career turns, loans, injuries, achievements, or an unusual international path. Do not reveal the player's name. This format does not require images or a badge timeline.
- `coach-link`: identify the coach who coached the named players. Check the coach's employment and each player's actual spell together; merely belonging to the same club in different years is insufficient. They may have worked together in different teams and at different times unless the question requires simultaneous overlap. Make the clue combination identify a single intended answer; add dates or clubs if several coaches fit.
- Use `prompt` for the short text and optional `clues` for separate clues, plus the ordinary answers, subjects, and sources. Track the identified player or coach as the main subject. Named clue players are background subjects unless their identities or attributes are also tested.
- Badge-based `career` and `career-gap` remain separate formats: show logos and dates before reveal and club names afterward. Every missing club also needs its real badge stored with credits: hide it behind the question mark, then reveal the badge in the timeline with its name underneath. Clearly mark loans and state whether the path is complete, selected, or omits loans/reserve teams. Keep the chronology and treatment of loan spells consistent; omitted stages should create a fair puzzle rather than confusion.
- `transfer`: store `transfer.year`, optional Polish `transfer.detail`, and `transfer.from` / `transfer.to`, each with `club` and attributed `media`. The prompt can add a useful player clue, but the primary club clues should be the two badges rather than written club names. Badges identify the clubs; they need not reproduce each historical crest version unless that is explicitly tested. Preserve the source's actual reuse terms; do not label a non-free club mark as public domain.
- Use exact transfer fees and statistical totals only when well-supported precision makes the question interesting. Clearly label approximate or reported fees in Polish, preserve the currency and distinguish guaranteed amounts from possible add-ons. Omit fragile numerical clues when the question works better without them.

## Current-season selection

- Research the latest completed matches and developments available at authoring time. Balance memorable incidents with standings, managerial changes, transfers, debuts, milestones, and records; do not fill the quota with obscure scorers from an arbitrary round.
- The preferred authoring start is around 08:00 Europe/Warsaw, followed by publication when the set is ready. Include overnight games that have actually finished by the run; this is a manual morning workflow until unattended authoring is configured, and does not promise that every worldwide game has finished or that new content is live at 07:00.
- Apply an editorial filter: choose surprising results, meaningful transfers, managerial changes, European breakthroughs, debuts, and milestones worth remembering. Six available match reports do not automatically deserve six questions. Include the season's bigger picture alongside the latest games; source availability alone is not a reason to select a fact.
- Prefer events within the quiz-event window. If that window is quiet, use useful ongoing-season knowledge and label it as current-season rather than falsely recent.
- State the match date or the season and the snapshot date for changing facts. Check results, scorers, assists, and incidents against the exact official report. Do not assume a readable URL establishes the date or season.
- A `season` question needs `season` and a completed `eventDate`; for a standings or record snapshot, use its as-of date. A `recent` question's date must fall within the session's event window.

## Difficulty and visuals

- Use the earlier six approachable / eighteen challenging / six very hard balance as loose editorial guidance, not a quota that forces arbitrary detail or a tiring set. Keep approachable questions and occasional very hard ones within a short, enjoyable session.
- Build difficulty through identities, meaningful clue combinations, and connections. A famous answer can still be hard when its clues are subtle.
- Prefer a recognizable player's forgotten loan, an unexpected coaching connection, or another useful clue over an obscure scorer from an ordinary match. Give enough information for a satisfying deduction without making the answer obvious; obscurity alone does not make a good question.
- Balance recognizable names with discoveries: include familiar players with surprising connections and a few lesser-known subjects. Avoid both a set dominated by obvious stars and a set that becomes a guessing exercise about obscure identities.
- Calibrate Polish-player identification against the user's 13 October feedback: questions 1 (Jacek Bąk portrait), 7 (Arkadiusz Milik badge career), 13 (Tymoteusz Puchacz with Lech/Union clues), and 23 (Karol Świderski's Panathinaikos-to-Widzew move) were too easy. These are examples of clues that give this audience too much help, not evidence that every question or Polish-football topic is too easy.
- Keep Polish football challenging through forgotten spells, career gaps, club or coach connections, less obvious portraits, and meaningful historical details. Avoid a cluster of familiar internationals identified from their signature clubs or a current transfer plus position/nationality hints. Remove unnecessary biographical hints only when the remaining clues still identify a fair, unambiguous answer; otherwise choose a stronger candidate. Familiar players can remain when the tested connection is less obvious. Keep the short phone-friendly interaction.
- Use clear, genuine photos of less obvious players. Crop identifying kit, crests, and stadium signage, while keeping the face or stadium recognizable; reject blurry, tiny, or excessively tight crops. Do not fabricate or retouch identities.
- Inspect the whole question as the player sees it before reveal, including images and surrounding clues, for accidental spoilers such as sponsors, stadium signs or crest lettering. Remove clues that give away the tested identity while preserving intentional club logos in badge careers and transfers. Crest-identification questions may omit club-name text.

## Coverage across sessions

- Use a rolling seven-session coverage ledger, separate from subject cooldown. Track leagues, competitions, eras, formats, and repeated tasks while selecting questions.
- The scope is broader than a fixed top-ten list. Regularly rotate the major European leagues, including England, Spain, Italy, Germany, France, Portugal, Netherlands, Belgium, and Turkey, retain Polish football, and include Greece, Austria, and other European leagues. Do not treat this working pool as a UEFA ranking or a closed list.
- Occasionally include South American clubs and other international contexts, as in the Canva references. Keep major leagues and Polish football recurring, but do not make every day a geographical checklist or restrict all questions to Europe.
- Aim to cover at least ten distinct domestic league contexts during each full seven-session cycle, with regular coverage beyond the biggest leagues, specifically including Greek and Austrian clubs over the rotation. A club appearing only as a background badge does not satisfy coverage. Aim for at least four domestic league contexts per daily set, and avoid any one league dominating the week.
- Include at least three questions per seven-session cycle focused on leagues beyond the regular core, rotating countries instead of repeating the same fringe clubs. Crest, career, coach, and club-history questions are useful routes into this broader coverage.
- Include Champions League, Europa League, and Conference League throughout the week, aiming for at least two questions focused on each competition per seven sessions. European questions can cover current matches, history, records, lineups, or club connections. Do not substitute Champions League alone for all European coverage.
- Rotate eras within the mostly twenty-first-century curriculum, and retain national-team and domestic-cup material. The targets describe an editorial review; the build does not automatically infer factual league coverage from player names.

## Before publication

Confirm all thirty answers against sources that support the exact claims, inspect subject cooldown and semantic reuse, review the daily mix and rolling coverage, and visually inspect media. Explicitly review repeated tasks, prompt length, answer count, meaningful difficulty, and phone readability. Run `npm test` and `npm run build`, then check the phone layout and reveal/navigation behavior. Structural checks cannot establish factual accuracy or editorial quality. Replace uncertain questions rather than inventing an answer.

Review Polish-player identification separately against the four user-flagged examples above. Judge difficulty from the complete visible clue set and this audience's knowledge; a famous face, signature career path, or heavily narrowed transfer should not receive a hard label merely because the format looks challenging.

Finish with the editorial question: “Would I enjoy answering these thirty on my phone?” Meeting every quota is insufficient if the complete set feels repetitive, confusing or tiring. Replace weak questions and adjust their order before publication.

The task-variety, prompt-length, and answer-count reviews above are authoring requirements. Dedicated automatic checks for them remain a future implementation improvement; the current build must not be described as enforcing them.
