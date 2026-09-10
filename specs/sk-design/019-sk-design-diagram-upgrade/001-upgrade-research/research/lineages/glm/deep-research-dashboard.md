# Deep Research Dashboard — lineage glm

Iteration Table

| Run | Focus | Status | Findings | newInfoRatio |
|-----|-------|--------|----------|--------------|
| 1 | The contract and its checker | complete | 10 | 1.0 |
| 2 | The token source and the repaint | complete | 6 | 0.8 |
| 3 | Style reference, design-md and fonts | complete | 7 | 0.8 |
| 4 | The corpus shape | complete | 6 | 0.9 |

Question Status

| Question | Answered | Evidence |
|----------|----------|----------|
| Q1 regex-holdable rules + today's failures | yes (run 1) | iteration-001.md findings 1-10 |
| Q2 token source + repaint | yes (run 2) | iteration-002.md findings 1-6 |
| Q3 reference / applicator / derivation / fonts | yes (run 3) | iteration-003.md findings 1-7 |
| Q4 corpus shape / catalog / SKILL.md / command | yes (run 4) | iteration-004.md findings 1-6 |
| Q5 verification loop + phases | no | — |

Convergence Trend (telemetry only; stop policy = max-iterations at 5)

- question-entropy coverage: 4/5 answered
- convergenceSignals.entropyCoverage: 0.2 -> 0.4 -> 0.6 -> 0.8
- newInfoRatio: 1.0, 0.8, 0.8, 0.9

Dead Ends

- Coral by occurrence-count (run 1) — two spellings; occurrence is not element (type-high-level.md:209).
- Foundations-only token source (run 2) — orphans `#3d4460` (comm(E1); type-high-level.md:418-419).
- The chart dual-block-per-file for diagrams (run 2) — 0/38 `prefers-color-scheme`; 27×2 grounds; export ships one svg node (SKILL.md:374-389).
- A second carried exemplar (run 3) — the 34-example corpus IS the exemplar set (check-corpus.cjs:3110-3133; palettes.json:142-143).
- A second DESIGN.md dialect as applicator input (run 3) — the run-2 token source already carries the vocabulary.
- Decoration as an example category (run 4) — count: zero; the 34 = 27+5+2 exactly.
- Canonical examples become templates (run 4) — the 4 shells ARE the templates; the canonicals are their proofs.

Blocked Stops

- (none)

Graph Convergence

- not used (no graphEvents recorded)

Next Focus

- Iteration 5 — the verification loop and the phase plan (mutation-suite contract adapted to the diagram checker; the CI gate; the fresh-reader capture review; findings 1-4 sorted [enforceable] vs [judged], ranked; the phases after this one: name, scope, gate, order).
