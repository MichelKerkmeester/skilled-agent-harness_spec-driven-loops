# Deep Research Dashboard — glm-5-3-flash-ripgrep-search

Auto-generated from `deep-research-state.jsonl`, `deep-research-strategy.md`, and the per-iteration deltas.

## Iteration Table

| Run | Status | Focus | Findings | newInfoRatio |
|-----|--------|-------|----------|--------------|
| 1 | complete | Generator correctness: roots, exclusions, normalization, malformed input, idempotence, freshness | 9 | 1.0 |
| 2 | complete | Lookup correctness: tokenization, candidate gate, scoring, classes, exit codes, edge inputs | 8 | 0.9 |
| 3 | complete | /speckit:search vs contract: presentation asset, unsupported list, concept-lane contradiction | 8 | 1.0 |
| 4 | complete | Real callers vs contract: Gate 1, hooks, doctor, save-freshness, resume, deep-loop agents | 9 | 0.85 |
| 5 | complete | Doc contradictions sweep + AGENTS/CLAUDE/REPO RULES footprint quantification | 9 | 0.7 |
| 6 | complete | Consumer census (second-order), rg-wrapper rank, auxiliary tool utilization | 8 | 0.7 |
| 7 | complete | Removal/merge candidates: retrieval/ inventory, README contract executed, fixtures census | 8 | 0.8 |
| 8 | complete | Staleness impact quantification + regenerate-ownership verification | 8 | 0.55 |
| 9 | complete | Severity roll-up, P1 dedup, adversarial re-probes (F2.7/F5.3/F2.8) | 6 | 0.45 |
| 10 | complete | Final consolidation: fixture provenance, promptSetHash slot, ledger close | 5 | 0.4 |

## Question Status

| Question | Status |
|----------|--------|
| q-gen | answered (iter 1, 8) |
| q-lookup | answered (iter 2, 9) |
| q-search | answered (iter 3) |
| q-callers | answered (iter 4, refined 7) |
| q-contradiction | answered (iter 3, 5) |
| q-footprint | answered (iter 5) |
| q-consulted | answered (iter 6, 10) |
| q-removal | answered (iter 7, 10) |

## Convergence Trend

Descending 1.0 → 0.4 across 10 iterations; charter-mandated no-early-stop; cap reached; stop reason `maxIterationsReached`. See `convergence-report.json`.

## Dead Ends (ruled out)

- Dedicated `repo-rules/retrieval.md` (Gate 5 load timing)
- Stale index drops restructured docs (identical path/phrase/posting sets)
- F2.8 keyed-lane-utility framing (distinctive query returns exact 1.000 hits)
- Generator nondeterminism (two builds byte-identical)
- Presentation/router no-hit disagreement (they agree)
- Hook-executed Gate 1 (no hook references the lookup)

## Blocked Stops

None.

## Next Focus

None — loop complete; synthesis at `research.md`.
