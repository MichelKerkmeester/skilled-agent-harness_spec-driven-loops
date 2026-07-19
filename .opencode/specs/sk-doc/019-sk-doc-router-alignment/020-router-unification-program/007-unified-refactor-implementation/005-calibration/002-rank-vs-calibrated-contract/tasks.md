---
title: "Tasks: Rank-vs-Calibrated Route Contract (Idea 5, step 2)"
description: "Task Format: T### [P?] Description (artifact). Ordered task list to author the rank-vs-calibrated route contract, CalibrationCertificateV1, the legality rule, the method envelope, and the projection-invisibility fixture families — design/contract only, no live routing config, registry, scorer, or skill touched."
trigger_phrases:
  - "rank vs calibrated contract tasks"
  - "calibration certificate task list"
importance_tier: "critical"
contextType: "implementation"
status: "shadow-partial"
---
# Tasks: Rank-vs-Calibrated Route Contract (Idea 5, step 2)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (artifact)`

---

## Phase 1: Evidence shape (unconditional ranking)

- [x] T001 Specify `rankScore` as an always-present, authority-free ordering field on a `route` decision (spec.md §3.1; synthesis §2.3). Maps REQ-001.
- [x] T002 Specify `scoreMargin` as an always-present separation-evidence field; state neither field can cross an auto-route threshold alone (spec.md §3.1). Maps REQ-001.
- [x] T003 [P] State explicitly that rank/margin are never a calibrated probability without a certificate (synthesis §2.3 invariant 4; §6 eliminated "advisor rank as calibrated probability").

## Phase 2: The certificate-gated calibration object

- [x] T004 Author the `calibration` discriminated sub-object with two branches: `{status:"unvalidated"}` and `{status:"validated", ...}` (spec.md §3.2). Maps REQ-002.
- [x] T005 Make `estimatedError` structurally absent in the `unvalidated` branch — no null, no sentinel (spec.md §3.2). Maps REQ-002.
- [x] T006 Author `CalibrationCertificateV1` enumerating `corpusId` + `corpusHash` (from `005/001`), `method`, `methodParams`, `policyHash`, `riskSlice`, `evaluationWindow`, held-out `metrics`, `status`, `generation`, `certHash` (spec.md §3.3). Maps REQ-003.

## Phase 3: The legality rule + method envelope

- [x] T007 Encode the four-condition admissibility test: validated status, `policyHash` match to pinned generation, `riskSlice` match, non-expired/resolvable corpus (spec.md §3.4). Maps REQ-004, REQ-005.
- [x] T008 State the mandated fallback when any condition fails: no probability language in the decision or any of the 3 projections; safe action = one-turn `clarify` else typed `defer` (spec.md §3.4; synthesis §4 rung 2 → 3). Maps REQ-005.
- [x] T009 [P] Specify the calibration-method envelope: temperature scaling (validated by ECE) and selective-classification threshold fitting (validated by selective risk at coverage), per policy/risk slice, as a contract for `005/003` (spec.md §3.5). Maps REQ-009.

## Phase 4: Authority, reversibility, and no-over-emission

- [x] T010 State that a certified route keeps `authority: WithheldUntilVerify`, commits only through destination PREPARE→VERIFY→COMMIT, and never widens the candidate set (spec.md §3.6; synthesis §7, §10). Maps REQ-006.
- [x] T011 Specify certificate lifecycle (candidate → validated → expired/revoked), generation binding, fenced-CAS activation/rotation, retained prior generation, and revocation reverting to rank-only → clarify/defer (spec.md §3.6, §7). Maps REQ-008.

## Phase 5: Projection-invisibility + fixture families

- [x] T012 State that the compatibility projector drops `calibration`/`estimatedError`, keeping route-gold replay byte-identical and the shared scorer untouched (spec.md §3.4, §6; synthesis §8.2). Maps REQ-007.
- [x] T013 Enumerate the fixture families as a test contract for `005/003` and the route-gold lane:
  - F1 licensed: validated cert, matching policyHash+riskSlice → route carries `estimatedError`.
  - F2 withheld (null-guard): `unvalidated` + `estimatedError` → contract-rejected.
  - F3 withheld (no cert): zero/absent cert → `unvalidated`, no probability, clarify/defer.
  - F4 mismatch: policyHash mismatch → `unvalidated`.
  - F5 mismatch: riskSlice mismatch → `unvalidated`.
  - F6 expired/revoked: cert expired → `unvalidated`, revert to rank-only.
  - F7 parity: same input replayed with/without cert → identical `observedIntents`/`observedResources` (Stage-3 gate).
  - F8 authority: certified route still `WithheldUntilVerify`, identical `targets` cardinality.
  - F9 no-over-emission: certified path does not union the registry or widen candidates.
- [x] T014 Cross-check each fixture family back to a REQ id; confirm no REQ is orphaned and no danger-state is uncovered.

## Phase 6: Migration-gate + closeout

- [x] T015 Write the MIGRATION GATE note naming Stage 3 (Shadow evaluate) as the gate this phase must satisfy before `005/003` activates, and note Stage 4 per-hub canary (owned by `006/*`) gates the actual calibrated auto-route flip (spec.md §7; master plan gate model).
- [x] T016 Confirm the five non-negotiable constraints each have a holding mechanism named in spec.md §6.
- [ ] T017 Run the parent packet through `validate.sh --strict`; confirm frontmatter, markers, and required sections parse for this child.
  - **Evidence:** Run locally; exit 2 because current-template structural checks fail and repository validator dependencies (`level-contract-resolver.js`, local `tsx`) are unavailable. The task remains unchecked.

---

## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every REQ-001..REQ-009 traces to a section and at least one fixture family
- [x] MIGRATION GATE names Stage 3 (Shadow evaluate); Stage 4 flip-gate noted as downstream
- [x] No live routing config, registry, scorer (`router-replay.cjs`), or skill modified

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../../006-unified-refactor-research/unified-refactor-synthesis.md`
- **Master plan**: `../../spec.md`
