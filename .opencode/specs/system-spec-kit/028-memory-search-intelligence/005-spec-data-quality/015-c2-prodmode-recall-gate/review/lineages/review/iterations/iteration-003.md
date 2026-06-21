# Iteration 003 — Traceability / Spec-Alignment

Dimension: Traceability · Target: `015-c2-prodmode-recall-gate` (spec-folder, PLANNED) · Lineage: review

## Scope

Ran the two core cross-reference protocols against current code and docs: `spec_code` (normative claims vs shipped behavior) and `checklist_evidence` (checked items vs evidence). Overlay protocols `feature_catalog_code` and `playbook_capability` are N/A for this eval-gate packet.

## Protocol: spec_code

| Claim | Source | Status | Evidence |
|-------|--------|--------|----------|
| Harness crash handler lives at line 357 (`process.exitCode = 1`) | plan.md:111, spec.md:125 | **pass** | `process.exitCode = 1;` is exactly at run-eval-v2.mjs:357 |
| Harness is a ~361-line file | spec.md:178 | **pass** | File is 361 lines + trailing export line; matches |
| `MEASURABILITY_CLASSES` is the class vocabulary the gold set draws from | spec.md:110, plan.md:108 | **pass** | Frozen array `['thematic_multi_target','causal_chain','hard_negative']` at run-eval-v2.mjs:51-55; same classes present in lib/eval/data/ground-truth.json:768+ |
| Harness reports `prodMode` completeRecall@K per class | spec.md:64-68, plan.md:90 | **pass** | run-eval-v2.mjs:312-320 emits `prodMode`/`evalMode`/`evalVsProdDelta` per class |
| **`run-eval-v2.mjs` has "No symbol the gate can import"; the phase must "add an export" for `buildSearchLenses`, `meanCompleteRecallProfile`, `MEASURABILITY_CLASSES`** | plan.md:107, spec.md:95/116, tasks.md:58-59 (T001/T002) | **fail** | run-eval-v2.mjs:361 already exports `{ buildSearchLenses, meanCompleteRecallProfile, diffProfiles, MEASURABILITY_CLASSES, COMPLETE_RECALL_KS }`. All three named symbols are already importable. → **F001** |

## Protocol: checklist_evidence

All 26 checklist items are unchecked `[ ]`; `completion_pct: 0`; summary table reads 0/12 P0, 0/13 P1, 0/1 P2 [SOURCE: checklist.md:62-143]. No item is marked `[x]`, so there are zero unsupported completion claims. Status PLANNED is asserted consistently in spec.md:56, plan.md:18, tasks.md:18, implementation-summary.md:56. **pass** — internally consistent, honest scaffold. No finding.

## Findings

### F001 [P1] spec-vs-code drift: harness export already present (plan/tasks premise stale)

The plan's affected-surfaces row for the harness export surface states current role = *"No symbol the gate can import"* and action = *"add an export for `buildSearchLenses`, `meanCompleteRecallProfile`, and `MEASURABILITY_CLASSES`"* [SOURCE: plan.md:107]. Tasks T001 ("confirm reachable for export") and T002 ("add the narrow export") encode the same premise [SOURCE: tasks.md:58-59]. The current harness already exports exactly those symbols (plus `diffProfiles`, `COMPLETE_RECALL_KS`) at [SOURCE: run-eval-v2.mjs:361]. REQ-005's reuse-via-import requirement is therefore already satisfiable with zero harness change.

Impact: an implementer following the plan literally would either no-op T002 or, worse, add a second `export { ... }` for the same names and break the module. The plan's "Modify run-eval-v2.mjs" entry in Files-to-Change [SOURCE: spec.md:95] overstates the required change to the one live dependency in an otherwise-honest PLANNED packet. This is a planning-accuracy defect, not a shipped-behavior failure: nothing is broken and no false completion is claimed, so it is P1 (correct before implementation), not P0.

Category: `spec-alignment` · finding_class: `instance-only` · content_hash: `f001-export-already-present`

#### Claim-Adjudication Packet (F001)

- findingId: F001
- claim: "The phase plans to add a harness export that already exists in current code."
- evidenceRefs: ["run-eval-v2.mjs:361", "plan.md:107", "tasks.md:58", "tasks.md:59", "spec.md:95"]
- counterevidenceSought: "Checked whether the export could have been added by this phase's own work — implementation-summary.md:56 states 'No code change has landed'; the export sits in the pre-existing harness body (file mtime predates the spec date). Checked whether the plan's wording is conditional ('add if absent') — plan.md:107 states the premise unconditionally ('No symbol the gate can import')."
- alternativeExplanation: "The plan author may have inspected an earlier harness revision lacking the export. Rejected as a downgrade trigger only, not as invalidation: the review scores current code, against which the premise is false."
- finalSeverity: P1
- confidence: 0.9
- downgradeTrigger: "If git history shows the export landed AFTER this spec was authored AND the plan is later reconciled to 'verify export present', downgrade to P2 (doc-sync)."
- transitions: []

## New-Finding Ratio

findingsNew: 1 (1×P1) · newFindingsRatio: 0.34

Review verdict: CONDITIONAL
