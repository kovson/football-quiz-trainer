# Domain docs

## Layout and reading rules

This repository uses a single-context layout:

- `GLOSSARY.md` at the repository root.
- Architecture decision records under `docs/adr/`.

Before exploring the codebase, read the glossary and ADRs relevant to the
area being explored.

If these files do not exist, proceed silently. Domain-modeling creates
them lazily when terminology or decisions are resolved.

## Vocabulary

Use glossary terms when naming domain concepts in issues, proposals,
hypotheses, and tests. Follow any documented preferred terms.

If a needed concept is missing, reconsider whether it belongs to the
project's vocabulary; record genuine gaps for domain-modeling.

## ADR conflicts

Explicitly flag proposed behavior that contradicts an existing ADR.
Identify the ADR and explain why the decision may need reconsideration.
