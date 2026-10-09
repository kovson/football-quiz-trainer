# Football quiz trainer

Static, Polish football knowledge trainer. Thirty shared questions per session, mental recall followed by answer reveal, and browser-local progress.

## Local preview

Requires Node.js 22 or newer; no package installation is needed.

```sh
npm run build:preview
npm run serve
```

Open http://127.0.0.1:4173/. The preview loads the latest sample in `content/samples/`; it does not publish samples as daily content. The current sample has thirty new questions, including four player portraits, two stadium photos, three crests, five badge-based careers (three gaps), two historical lineups, six current-season match questions, and eight Polish-football questions. Sources and image credits appear after reveal. All images are embedded in the standalone `dist/index.html`.

```sh
npm test
npm run build
```

Production builds read dated daily sessions from `content/sessions/`, validate the complete archive and future content, enforce reuse/cooldown constraints, and include only sessions whose publication instant has arrived. Structural validation does not replace factual research and visual inspection.

## Publication

Public site: https://kovson.github.io/football-quiz-trainer/

The `Publish training` workflow validates and builds the app on pushes to `main`, manual runs, and daily at 07:00 Europe/Warsaw, including daylight-saving changes. GitHub's scheduler can run late. Only released daily sessions appear on the public site; local samples are excluded. The reviewed replacement sample was promoted to the first session, dated 8 October 2026.

Follow [question-authoring rules](docs/question-authoring.md). Author new Polish content on the Mac, save a complete dated JSON file under `content/sessions/` with `publishAt` at 07:00 Warsaw time, run `npm test` and `npm run build`, then commit and push. An early push keeps tomorrow's session hidden until its release; a late push publishes eligible content immediately. Previous sessions remain in the archive.

## Project status

Local preview, validation, and GitHub Actions/Pages publication are implemented. Unattended local question authoring is not configured yet. Publication does not research or generate questions: it publishes locally authored files. AI authoring credentials must stay on the Mac. Local planning notes, authoring scratch files, and environment files are excluded from Git.

Saved requirements and rollout decisions: `.scratch/football-quiz-trainer/planning.md` and `spec.md`. Domain vocabulary: `GLOSSARY.md`. Hosting decision: `docs/adr/0001-static-daily-training-on-github-pages.md`.
