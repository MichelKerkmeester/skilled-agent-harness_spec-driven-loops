---
title: "Deep Research Strategy: Repo-rule concision — which sentences change behaviour"
trigger_phrases: []
---
# Deep Research Strategy: Repo-rule concision — which sentences change behaviour

## Research Topic

Parent question: how should this repository's repo rules (`.skilled/repo-rules/`, 13 files, ~27k tokens) be written and loaded to change model behaviour, and at what context cost? This lineage answers the CONCISION sub-question fixed by `steer.md`: **which sentences in a rule change behaviour, and what does shortening or removing each cost?**

## Known Context

- The detached lineage is bound directly to `config.fanout_lineage_artifact_dir`; the `resolveArtifactRoot` node is intentionally skipped.
- All writes are bounded to this lineage directory. Spec writeback, parent/shared telemetry, continuity/memory save, and git staging are out of scope. The repository is read-only for this run; shortened drafts land inside this directory only.
- `resource-map.md` was not present at initialization; this lineage emits its own resource map from the completed deltas.
- `steer.md` fixes the scope and the per-iteration deliverables; it is re-read before every iteration and listed among that iteration's sources.
- `prep/evidence-pack.md` is the measured baseline: byte totals per file (§1), rule-read frequencies (§2), and the compliance deltas (§3): reading `communication-prose.md` roughly halves semicolons (37.0%→17.0%); reading `communication.md` does not reduce tables (17.4%→20.3%). Only one measured prohibition shows a read-rule effect, so "which sentences carry the effect" is the operative question.
- Corpus verified by `wc -c`: 13 files, 107,092 bytes total, matching `prep/evidence-pack.md` §1 exactly (communication.md 11,458; evidence-and-proof.md 11,823; delegation-and-orchestration.md 11,712; communication-handoff.md 10,803; smallest uncertainty-and-honesty.md 6,329).

## Key Questions

- [x] Iteration 1: split each of the 13 rules into the steer parts (Fires when / rule statement / failure it prevents / examples / self-check / what-this-is-not / cross-references / rationale). Output: one row per rule with bytes per part and total, plus the counting method; totals reconcile to `prep/evidence-pack.md` §1.
- [x] Iteration 2: name the compression patterns (name, one before/after sentence, bytes saved, enforcement at risk); then per rule, a token target or "no change" with the basis.
- [x] Iteration 3: shortened drafts of `communication.md` and `evidence-and-proof.md` inside this lineage only, each with a keep/drop ledger (sentence or part, keep or drop, enforcement kept or lost, bytes).

## Answered Questions

- Part decomposition: done — `scratch/classify-parts.py` + `iterations/iteration-001.md`; every file reconciles to `wc -c`, grand total 107,092 B = evidence-pack §1 exactly.
- Compression patterns: done — 10 named patterns (P1–P10) with measured savings and per-pattern risk; card test answered per steer (card drops all operative norms; self-check is the outside-card carrier).
- Drafts: done — `drafts/communication.md` (−27.8%, 3 named edge losses ~145 B), `drafts/evidence-and-proof.md` (−11.5%, ~zero loss), both with ledgers.

## What Worked

- Byte-offset span accounting (each block owns its trailing blank lines): reconciles exactly to `wc -c`, no fudge factor.
- Explicit override map over the dominant-function classifier: three systematic mislabels caught by dumping every block before writing findings.
- Independent re-measurement of the sibling lineage's card claim (18,207 vs claimed 17,882): confirmed within ~2%, no trust-without-verify.
- Writing drafts in the corpus's own voice then grepping banned punctuation: caught five self-introduced semicolons.

## What Failed

- The uniform per-file keep-rate model (iteration-2 targets): falsified by the measured draft floor — compression floor tracks rule-statement share, not a global rate.

## Exhausted Approaches

- Cutting checklists or tables for savings: checklists are the enforcement carrier (P3-B, card test); tables are already the compressed form.

## Ruled-Out Directions

- Blanket meta-deletion (the one-lens disclosure is a required epistemic marker).
- Relocating trigger_phrases inside drafts (a loading-side change, kept for the synthesis as a separate proposal).

## Next Focus

Synthesis — `research.md` with `stopReason: "maxIterationsReached"`; convergence is telemetry only per the max-iterations stop policy.
