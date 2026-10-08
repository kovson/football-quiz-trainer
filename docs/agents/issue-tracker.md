# Issue tracker: Local Markdown

Issues and specs live as Markdown files under `.scratch/`.

## Conventions

- One feature per directory: `.scratch/<feature-slug>/`.
- Specs: `.scratch/<feature-slug>/spec.md`.
- Implementation tickets: `.scratch/<feature-slug>/issues/<NN>-<slug>.md`,
  numbered from `01`, with one file per ticket.
- Record triage state as a `Status:` line near the top of each issue.
  Use the strings in `triage-labels.md`.
- Append comments and conversation history under `## Comments`.

## Publish and fetch

To publish, create the appropriate file, creating its directory if needed.
To fetch a ticket, read the file at the referenced path. Resolve bare issue
numbers within the relevant feature directory.

## Wayfinding operations

- Map: `.scratch/<effort>/map.md`, containing Notes, Decisions-so-far,
  and Fog.
- Child tickets: `.scratch/<effort>/issues/NN-<slug>.md`, numbered from `01`.
  Put the question in the body and record `Type:` as `research`, `prototype`,
  `grilling`, or `task`.
- For wayfinding tickets, use `Status: open`, `Status: claimed`, or
  `Status: resolved`.
- Blocking: record `Blocked by: NN, NN` near the top. A ticket is unblocked
  when every listed blocker is resolved.
- Frontier: select open, unblocked, unclaimed tickets in number order.
- Claim: save `Status: claimed` before beginning work.
- Resolve: append the answer under `## Answer`, save `Status: resolved`,
  then append a summary and ticket link to the map's Decisions-so-far.
