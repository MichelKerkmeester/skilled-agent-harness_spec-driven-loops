---
title: "Verification Checklist: Per-command deliverable output contract for /design:*"
description: "Acceptance for outputContract presence, metadata reconciliation, surface-check drift=0, node --check, the synthetic-break proof, frontmatter parity, and evergreen cleanliness."
trigger_phrases:
  - "deliverable output contract checklist"
  - "emit deliverable acceptance"
  - "outputContract verification"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/002-d2-command-specificity/005-deliverable-output-contract"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verify all items with evidence; restructure to manifest anchors; add Fix Completeness"
    next_safe_action: "Run D2-R6 sibling-discriminator phase for the /design:* command surface"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-29-d2-r5-deliverable-output-contract"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Per-command deliverable output contract for /design:*

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase `spec.md` requirements parsed (four `outputContract` sub-fields, Emit Deliverable section, generic-name ban)
  - **Evidence**: `plan.md` §1/§3 enumerate the four sub-fields and the five concrete artifacts.
- [x] CHK-002 [P0] Baseline surface-check captured before edits
  - **Evidence**: implementer recorded the pre-edit baseline before adding the contract.
- [x] CHK-003 [P1] `proofFields` read per command for `requiredFields` reconciliation
  - **Evidence**: each record's `requiredFields` mirror its existing `proofFields`.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `outputContract{primaryArtifactName,artifactKind,requiredFields,fileOutputs}` added to all five records
  - **Evidence**: `command-metadata.json` carries five `outputContract` blocks; valid JSON.
- [x] CHK-011 [P0] Each `primaryArtifactName` names a specific deliverable (no generic name)
  - **Evidence**: report/plan/spec/reference-doc artifact names; none in the generic ban set.
- [x] CHK-012 [P1] `requiredFields` reconcile with `proofFields` per command
  - **Evidence**: equality enforced by `sameValue(proofFields, requiredFields)`; passes for all five.
- [x] CHK-013 [P1] `fileOutputs` reconcile with `toolPolicy.mutatesWorkspace`
  - **Evidence**: `md-generator` non-empty (`<output>/DESIGN.md`); the other four empty `[]`.
- [x] CHK-014 [P1] `artifactKind` within the controlled vocabulary
  - **Evidence**: each kind ∈ `report | plan | spec | reference-doc`, enforced by the enum.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `## 3. EMIT DELIVERABLE` section present in all five wrappers
  - **Evidence**: heading present in `audit/foundations/interface/md-generator/motion.md` (e.g. `audit.md:30`).
- [x] CHK-021 [P1] Each wrapper section mirrors its metadata (names the `primaryArtifactName`)
  - **Evidence**: section text names the artifact, e.g. `audit.md:32`; `md-generator.md:40` lists `<output>/DESIGN.md`.
- [x] CHK-022 [P0] Checker requires `outputContract` (`REQUIRED_FIELDS` + sub-shape validation)
  - **Evidence**: `outputContract` in `REQUIRED_FIELDS`; sub-shape validated for the four fields.
- [x] CHK-023 [P0] Checker fails on generic / unreconciled contract (synthetic break)
  - **Evidence**: a non-mutating command with non-empty `fileOutputs` → STATUS=INVALID, invalid=1; reverted.
- [x] CHK-024 [P0] Surface-check passes after build
  - **Evidence**: `STATUS=PASS`, `SUMMARY invalid=0 drift=0`.
- [x] CHK-025 [P1] `node --check` passes on the edited checker
  - **Evidence**: `node --check design-command-surface-check.mjs` exits 0.
- [x] CHK-026 [P0] Existing frontmatter drift checks still pass (additive change)
  - **Evidence**: `allowed-tools`/`argument-hint` drift remains 0; the new contract layers on with drift=0.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class is `class-of-bug`, fixed across the whole command set
  - **Evidence**: the undefined-deliverable gap was closed for all five commands in one pass; the producer inventory is the five `command-metadata.json` records.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed
  - **Evidence**: all five records gained `outputContract`; no `/design:*` command is left without a contract.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the changed surface
  - **Evidence**: the consumers are `design-command-surface-check.mjs` and each wrapper's Emit Deliverable section; both re-checked, drift=0.
- [x] CHK-FIX-004 [P1] Evidence pinned to the deterministic checker report
  - **Evidence**: STATUS=PASS / invalid=0 / drift=0 and the synthetic-break INVALID are reproduced from `design-command-surface-check.mjs`, re-runnable on demand.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Only the mutating command declares `fileOutputs`; read-only modes carry empty `[]`
  - **Evidence**: `fileOutputs` non-empty iff `mutatesWorkspace`; a read-only mode claiming a file output is rejected.
- [x] CHK-031 [P1] Wrapper frontmatter unchanged (D2-R1/R2 parity)
  - **Evidence**: `allowed-tools` + `argument-hint` preserved on all five wrappers; only the body section was appended.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist/implementation-summary synchronized
  - **Evidence**: all five describe the same `outputContract`, the Emit Deliverable section, and the surface-check extension.
- [x] CHK-041 [P1] No spec/packet/phase IDs or spec paths in the five wrappers, metadata, or checker (evergreen)
  - **Evidence**: grep for `specs/`, `154-`, `039-`, `005-`, `D2-R5` over the seven output files returns no hits.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp / negative-test files in scratch only
  - **Evidence**: the synthetic break was run and reverted; no temp files outside scratch.
- [x] CHK-051 [P2] scratch cleaned before completion
  - **Evidence**: no scratch artifacts left behind.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: Build verification (outputContract on five records; Emit Deliverable in five wrappers; surface-check STATUS=PASS invalid=0 drift=0; synthetic break proves the gate bites; frontmatter parity preserved; evergreen clean)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
