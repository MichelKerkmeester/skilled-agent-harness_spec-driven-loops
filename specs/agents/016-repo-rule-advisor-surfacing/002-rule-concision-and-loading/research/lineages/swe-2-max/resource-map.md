# Resource Map — swe-2-max lineage

What each source was read for and which iteration consumed it.

## Corpus under study (read-only)

| resource | used by | for |
|---|---|---|
| `.skilled/repo-rules/` — all 13 files (107,092 B) | iters 1–3 | decomposition (1), pattern extraction and card spans (2), draft sources + voice check (3) |
| `.skilled/repo-rules/communication.md` (11,458 B) | iters 1–3 | full decomposition; P1/P2/P9 evidence; shortened draft |
| `.skilled/repo-rules/evidence-and-proof.md` (11,823 B) | iters 1–3 | full decomposition; §1 triplication finding; shortened draft |

## Specification inputs

| resource | used by | for |
|---|---|---|
| `specs/agents/016-repo-rule-advisor-surfacing/002-rule-concision-and-loading/prep/evidence-pack.md` | init, iters 1–3 | measured baseline: §1 byte totals (reconciliation target), §2 read frequencies, §3 compliance deltas (the semicolon/table contrast the whole angle keys on) |
| `steer.md` (lineage dir) | before every iter | fixed CONCISION scope; per-iteration deliverables; iteration-2 card-test + n=2 steering |
| `.skilled/skills/system-deep-loop/deep-research/SKILL.md` | init | loop contract, artifact names, state/delta format, quality guards, convergence-as-telemetry rule |

## Lineage-internal artifacts (created)

| artifact | produced by | contents |
|---|---|---|
| `scratch/classify-parts.py` | iter 1 | deterministic block classifier; byte-offset spans; documented override map |
| `scratch/parts-dump.txt` | iter 1 | per-block audit dump (part, bytes, text) used for mislabel review |
| `iterations/iteration-001.md` | iter 1 | per-file part table; counting methodology; reconciliation to wc -c |
| `iterations/iteration-002.md` | iter 2 | card test; 10 compression patterns; per-rule modelled targets |
| `iterations/iteration-003.md` | iter 3 | draft outcomes; named enforcement losses; model falsification |
| `deltas/iter-001..003.jsonl` | iters 1–3 | finding/edge/ruled-out records per iteration |
| `drafts/communication.md` + `.ledger.md` | iter 3 | shortened draft (−27.8%) + per-part keep/drop ledger |
| `drafts/evidence-and-proof.md` + `.ledger.md` | iter 3 | shortened draft (−11.5%) + per-part keep/drop ledger |
| `findings-registry.json` | synthesis | consolidated findings with ids, evidence, confidence |
| `deep-research-dashboard.md` | synthesis | run ledger, headline findings, guards, containment |
| `research.md` | synthesis | terminal synthesis, stopReason maxIterationsReached |
| `deep-research-state.jsonl` | all phases | seed → binding → iteration records → synthesis event |
| `deep-research-strategy.md` | all phases | living strategy; questions/answered/worked/failed/ruled-out |
| `deep-research-config.json`, `BINDING.md`, `invocation-metadata.json` | init | lineage binding + run parameters |

## Measurements produced (reusable)

- Per-part byte table for all 13 rules (iteration-001.md) — the anatomy the loading lineage's "card" proposal needed.
- Card spans per file: 960–1,809 B, total 18,207 B (iteration-002.md §1).
- Section-level byte accounts for both drafts (the two ledger files).
- Compression floor vs rule-statement share (iteration-003.md) — the per-file predictor replacing the uniform model.
