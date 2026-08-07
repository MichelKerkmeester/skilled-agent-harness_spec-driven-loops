# Deep Review Strategy — C2 Prod-Mode Recall Gate

Lineage: `review` (fan-out session `fanout-review-1782055949478-i1h3i4`)
Target: `015-prodmode-recall-gate` (spec-folder, Level 2, Status PLANNED)

## Topic

Review the C2 prod-mode recall gate planning packet (spec/plan/tasks/checklist/implementation-summary) and its single live dependency, the dual-mode harness `run-eval-v2.mjs`. The packet is a scaffold: no implementation file has landed. The review therefore audits planning correctness, dependency-claim fidelity (spec-vs-code), internal doc consistency, and design completeness rather than shipped behavior.

## Review Dimensions

- [x] D1 Correctness — design logic of the gate (prod-column read, distinct exit codes, mode semantics)
- [x] D2 Security — execution surface, untrusted input, secrets
- [x] D3 Traceability / Spec-Alignment — spec_code + checklist_evidence against current code and docs
- [x] D4 Maintainability / Completeness — reuse-surface specification, golden-set wiring, doc sync

## Files Under Review

| File | Role | Exists |
|------|------|--------|
| `spec.md` | Feature spec (Level 2, PLANNED) | yes |
| `plan.md` | Implementation plan + affected-surfaces addendum | yes |
| `tasks.md` | Task breakdown (T001–T009) | yes |
| `checklist.md` | Verification checklist (all unchecked) | yes |
| `implementation-summary.md` | Status PLANNED, no code landed | yes |
| `.../evals/run-eval-v2.mjs` | Dual-mode harness dependency | yes (361 lines) |
| `.../evals/spec-corpus-golden.json` | Planned multi-target gold set | NO (planned create) |
| `.../evals/run-spec-recall-gate.mjs` | Planned gate wrapper | NO (planned create) |
| `.../evals/spec-recall-baseline.json` | Planned stored baseline | NO (planned create) |
| `.../lib/eval/data/ground-truth.json` | Source ground truth (measurability classes present) | yes |

## Cross-Reference Status

### Core (hard)
- `spec_code` — covered (iter-003). One current-state claim FALSE (export already present); line-357 claim TRUE.
- `checklist_evidence` — covered (iter-003). All items unchecked, completion 0 — consistent with PLANNED, no false evidence.

### Overlay (advisory)
- `feature_catalog_code` — N/A (no catalog claims for this eval gate).
- `playbook_capability` — N/A (no playbook scenarios target this packet).

## Known Context

- Status is PLANNED across all docs; `completion_pct: 0`; checklist 0/26. Internally consistent and honest.
- Absent implementation files are NOT findings — they match the declared PLANNED state.
- `resource-map.md` not present in target spec folder. Skipping coverage gate.
- Harness `run-eval-v2.mjs` already exports the three "to-be-added" symbols at line 361.

## Review Boundaries (Non-Goals)

- Do not evaluate unshipped implementation files as defects for being absent.
- Do not propose ranking/truncation-floor changes (explicitly out of scope — that is C1).
- Observation-only: no edits to target docs or the harness.

## Stop Conditions

- All 4 dimensions covered with ≥1 stabilization pass and declining new-finding ratios, no new P0.
