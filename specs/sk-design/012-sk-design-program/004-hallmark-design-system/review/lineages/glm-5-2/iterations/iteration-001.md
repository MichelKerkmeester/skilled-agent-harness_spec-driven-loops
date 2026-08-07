# Iteration 001 — Correctness + Traceability (spec_code core)

## Focus
Reconcile the phase-parent `spec.md` normative claims (status, scope, phase map) against `graph-metadata.json` `children_ids` and the shipped child lanes. Verify the highest-blast-radius correctness claims (Motion wiring, composition column, boundary guard) resolve to shipped code.

## Dimensions Covered
- D1 Correctness
- D3 Traceability (spec_code core protocol)

## Files Reviewed
- `004-hallmark-design-system/spec.md`
- `004-hallmark-design-system/graph-metadata.json`
- `004-hallmark-design-system/description.json`
- `004-hallmark-design-system/00[1-5]-*/spec.md`
- `004-hallmark-design-system/001-surgical-fixes/implementation-summary.md`
- `004-hallmark-design-system/002-evidence-envelopes/{spec.md, implementation-summary.md}`
- `design-md-generator/backend/scripts/schema-v3.ts`, `validate.ts` (002 wiring)
- `styles/lib/database/schema.mjs` (005 wiring)

## Findings

### F001 — P1 — Parent status contradicts shipped complete children (spec_code)
- **Claim:** The phase parent's status does not reconcile with its shipped children.
- **Evidence:**
  - `[SOURCE: 004-hallmark-design-system/spec.md:45]` `Status | Planned — the four adoption lanes are specced but not yet built`
  - `[SOURCE: 004-hallmark-design-system/spec.md:110]` `The four adoption lanes are specced but not yet built — surfaced in the program retrospective.md as planned-but-missed work.`
  - `[SOURCE: 004-hallmark-design-system/graph-metadata.json:40]` `"status": "planned"`
  - `[SOURCE: 004-hallmark-design-system/001-surgical-fixes/spec.md:43]` `Status | Complete` (continuity `completion_pct: 100`)
  - `[SOURCE: 004-hallmark-design-system/002-evidence-envelopes/spec.md:44]` `Status | Complete`
  - `[SOURCE: 004-hallmark-design-system/005-measured-composition-and-retrieval-facets/spec.md:51]` `Status | Complete`
  - Shipped code corroborates the children: `schema-v3.ts:146` motion emitter, `schema-v3.ts:499` durationScale gate, `schema.mjs:49` `composition_dna_json` column, `schema.mjs:98` `style_composition_facets` table.
- **Why P1:** A normative parent status claim ("not yet built") is contradicted by five verified-complete children and corroborating shipped code. This misleads any release-readiness reader and fails the `spec_code` reconciliation bar (claim contradicts shipped behavior). Not P0: no shipped-behavior correctness/security defect; the contradiction is in the documentation-status record.
- **Adjudication packet:**
  - `findingId`: F001
  - `claim`: Parent phase status is "Planned / not yet built" while all children ship Complete.
  - `evidenceRefs`: spec.md:45, spec.md:110, graph-metadata.json:40, 001/spec.md:43, 002/spec.md:44, 005/spec.md:51, schema-v3.ts:146, schema.mjs:49
  - `counterevidenceSought`: Checked whether any child is actually incomplete or whether 005 is out-of-scope; all five lanes have full spec/impl/checklist sets and 005 cites the same hallmark research basis.
  - `alternativeExplanation`: A phase-parent lean trio may intentionally freeze the parent at the planning anchor and defer status to children. Rejected: §1 METADATA Status and §4 OPEN QUESTIONS both assert a factual build state ("not yet built") that is false against shipped code.
  - `finalSeverity`: P1
  - `confidence`: 0.90
  - `downgradeTrigger`: Operator confirms the parent is intentionally a stale planning anchor and re-labels it as such (e.g. "Phase map — see children for status") rather than asserting a build state.

### F002 — P1 — Parent "four adoption lanes" omits the fifth child lane (spec_code)
- **Claim:** The parent scope/phase-map describes four lanes, but the metadata and disk carry five.
- **Evidence:**
  - `[SOURCE: 004-hallmark-design-system/spec.md:72]` `In Scope - The four hallmark-adoption lanes: surgical fixes, evidence envelopes, authored cards, brand-first lane.`
  - `[SOURCE: 004-hallmark-design-system/spec.md:92-95]` Phase Documentation Map lists only rows 1-4 (001-004).
  - `[SOURCE: 004-hallmark-design-system/graph-metadata.json:6-12]` `children_ids` has 5 entries including `005-measured-composition-and-retrieval-facets`.
  - On-disk: 5 child phase folders exist, each with a full Level-2 doc set.
- **Why P1:** The normative scope ("four lanes") and Phase Documentation Map omit a real, complete child lane that the metadata and filesystem both register. `spec_code` partial — a documented scope claim does not resolve to the shipped phase structure.
- **Adjudication packet:**
  - `findingId`: F002
  - `claim`: Parent scope says four lanes; metadata and disk have five.
  - `evidenceRefs`: spec.md:72, spec.md:92, spec.md:93, spec.md:94, spec.md:95, graph-metadata.json:6
  - `counterevidenceSought`: Checked whether 005 might belong to a different parent; 005's `Parent Spec` is `../spec.md` and it cites the same hallmark research basis.
  - `alternativeExplanation`: 005 may be a later addition the parent doc was never updated to reflect. Accepted as root cause — but the drift is the finding, not an excuse.
  - `finalSeverity`: P1
  - `confidence`: 0.90
  - `downgradeTrigger`: 005 is re-parented elsewhere, or the parent Phase Documentation Map and §3 SCOPE are updated to name all five lanes.

### F005 — P2 — Citation drift in 002 implementation-summary (checklist_evidence / spec_code)
- **Claim:** A verification citation points at the wrong line/file.
- **Evidence:**
  - `[SOURCE: 002-evidence-envelopes/implementation-summary.md:100]` `durationScale gate at line 490`
  - `[SOURCE: design-md-generator/backend/scripts/schema-v3.ts:499]` actual gate: `case 'motion': return (motion?.durationScale?.length ?? 0) > 0;` (gate logic spans 482-499).
  - `[SOURCE: design-md-generator/backend/scripts/extract.ts:490]` line 490 lives in a different file (`console.log` for motion tiers), not the schema gate.
- **Why P2:** Verification evidence is slightly mis-cited; the gate exists and is correct, so the underlying claim holds — only the pointer is off.

## Traceability Checks (spec_code core)
- `protocolId`: spec_code
- `status`: partial
- `gateClass`: hard
- `applicable`: true
- `counts`: `{ pass: 3, partial: 2, fail: 0, skipped: 0 }` (pass: Motion wiring resolves; composition column resolves; boundary guard resolves. partial: parent status claim; parent scope/phase-map claim)
- `findingRefs`: [F001, F002]
- `summary`: All load-bearing shipped-code claims resolve. The parent phase-parent documentation does not reconcile with the shipped child structure (status + lane count).

## Dimension Verdicts
- D1 Correctness: PASS — every shipped-code correctness claim (Motion detector-evidence gate, composition column/facets, boundary guard) resolves to real code at the cited files.
- D3 Traceability: CONDITIONAL — two P1 spec_code contradictions between parent spec.md and shipped phase structure.

## Summary
Iteration confirmed the shipped implementation is sound but the phase-parent documentation is stale: it claims "Planned / four lanes / not yet built" against five complete children. Two P1 spec_code findings (F001, F002) and one P2 citation drift (F005). No P0.

Review verdict: CONDITIONAL
