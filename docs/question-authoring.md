# Daily question authoring

These rules apply to new sessions authored after the 9 October 2026 review. Previously published sessions remain in the archive. Research and author locally on the Mac; GitHub Actions validates and publishes generated content without AI credentials.

## Daily selection

- Write thirty original questions in Polish, identical and in the same order for everyone. Mental recall precedes answer reveal. Do not add answer inputs, scores, or required explanations. Keep sources and image credits after reveal.
- Inspect previous sessions before drafting. Never recycle a question or merely reword its fact. Minimum main-subject cooldown: thirty days, preferably sixty; explain a thirty-to-fifty-nine-day exception. Background clues may recur.
- Limit questions whose main task is naming a match's scorers to three per session, including historical and current matches combined. Changing the match does not create a different task. Also vary assist, country, transfer, and identification patterns; interleave formats.
- Retain roughly six Polish-football questions and six current/recent questions; categories may overlap. Mix portraits, stadiums, crests, badge careers, career gaps, starting XIs, text riddles, coaches, transfers, records, competition history, and unusual football connections.
- Aim for four transfer questions per daily session. Show a prominent year and two genuine club badges joined by an arrow in selling-to-buying order, without redundant “Z klubu” / “Do klubu” labels, with optional sourced month, loan status, or fee. Keep the club names hidden until answer reveal; vary leagues, eras, domestic/cross-border moves, loans, and permanent transfers. These replace other questions within the thirty-question set.
- Include a short text career riddle and a shared-coach question regularly, normally one of each per session when distinct, well-supported subjects are available. Do not let media availability determine the whole curriculum.

## Career riddles and shared coaches

- `career-riddle`: identify a player from a short written career summary, usually two to four sentences. Combine meaningful clues such as career turns, loans, injuries, achievements, or an unusual international path. Do not reveal the player's name. This format does not require images or a badge timeline.
- `coach-link`: identify the coach who coached the named players. Check the coach's employment and each player's actual spell together; merely belonging to the same club in different years is insufficient. They may have worked together in different teams and at different times unless the question requires simultaneous overlap. Make the clue combination identify a single intended answer; add dates or clubs if several coaches fit.
- Use `prompt` for the short text and optional `clues` for separate clues, plus the ordinary answers, subjects, and sources. Track the identified player or coach as the main subject. Named clue players are background subjects unless their identities or attributes are also tested.
- Badge-based `career` and `career-gap` remain separate formats: show logos and dates before reveal and club names afterward. Every missing club also needs its real badge stored with credits: hide it behind the question mark, then reveal the badge in the timeline with its name underneath. State whether the path is complete, selected, or omits loans/reserve teams.
- `transfer`: store `transfer.year`, optional Polish `transfer.detail`, and `transfer.from` / `transfer.to`, each with `club` and attributed `media`. The prompt can add a useful player clue, but the primary club clues should be the two badges rather than written club names. Badges identify the clubs; they need not reproduce each historical crest version unless that is explicitly tested. Preserve the source's actual reuse terms; do not label a non-free club mark as public domain.

## Current-season selection

- Research the latest completed matches and developments available at authoring time. Balance memorable incidents with standings, managerial changes, transfers, debuts, milestones, and records; do not fill the quota with obscure scorers from an arbitrary round.
- Prefer events within the quiz-event window. If that window is quiet, use useful ongoing-season knowledge and label it as current-season rather than falsely recent.
- State the match date or the season and the snapshot date for changing facts. Check results, scorers, assists, and incidents against the exact official report. Do not assume a readable URL establishes the date or season.
- A `season` question needs `season` and a completed `eventDate`; for a standings or record snapshot, use its as-of date. A `recent` question's date must fall within the session's event window.

## Difficulty and visuals

- Target approximately six approachable questions (`średnie`, or `łatwe` when appropriate), eighteen challenging questions (`trudne`), and six very hard questions (`bardzo trudne`). Treat this as editorial calibration for football fans, not an excuse to include filler; revise from user feedback.
- Build difficulty through identities, meaningful clue combinations, and connections. A famous answer can still be hard when its clues are subtle.
- Use clear, genuine photos of less obvious players. Crop identifying kit, crests, and stadium signage, while keeping the face or stadium recognizable; reject blurry, tiny, or excessively tight crops. Do not fabricate or retouch identities.
- Inspect the displayed images and all clues before publication. Crest-identification questions may omit club-name text; badge careers intentionally retain club logos.

## Coverage across sessions

- Use a rolling seven-session coverage ledger, separate from subject cooldown. Track leagues, competitions, eras, formats, and repeated tasks while selecting questions.
- The scope is broader than a fixed top-ten list. Regularly rotate the major European leagues, including England, Spain, Italy, Germany, France, Portugal, Netherlands, Belgium, and Turkey, retain Polish football, and include Greece, Austria, and other European leagues. Do not treat this working pool as a UEFA ranking or a closed list.
- Aim to cover at least ten distinct domestic league contexts during each full seven-session cycle, with regular coverage beyond the biggest leagues, specifically including Greek and Austrian clubs over the rotation. A club appearing only as a background badge does not satisfy coverage. Aim for at least four domestic league contexts per daily set, and avoid any one league dominating the week.
- Include at least three questions per seven-session cycle focused on leagues beyond the regular core, rotating countries instead of repeating the same fringe clubs. Crest, career, coach, and club-history questions are useful routes into this broader coverage.
- Include Champions League, Europa League, and Conference League throughout the week, aiming for at least two questions focused on each competition per seven sessions. European questions can cover current matches, history, records, lineups, or club connections. Do not substitute Champions League alone for all European coverage.
- Rotate eras within the mostly twenty-first-century curriculum, and retain national-team and domestic-cup material. The targets describe an editorial review; the build does not automatically infer factual league coverage from player names.

## Before publication

Confirm all thirty answers against sources that support the exact claims, inspect subject cooldown and semantic reuse, review the daily mix and rolling coverage, and visually inspect media. Run `npm test` and `npm run build`, then check the phone layout and reveal/navigation behavior. Structural checks cannot establish factual accuracy. Replace uncertain questions rather than inventing an answer.
