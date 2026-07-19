---
title: "Verification Checklist: Fleet Legacy-Read Cleanup"
description: "Level-2 evidence that cleanup readiness is bound to committed activation bytes and blocks honestly while rollout remains shadow-only."
trigger_phrases:
  - "fleet cleanup readiness checklist"
  - "committed manifest binding verification"
  - "shadow rollout cleanup block"
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist: Fleet Legacy-Read Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-level2 | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] CHK-001 [P1] Real cleanup authority comes only from committed activation selectors.
  - **Evidence**: `assertFleetReady(policySnapshots)` has no caller-manifest parameter and calls `readCommittedActivationEvidence()`.
- [x] CHK-002 [P1] Current shadow state blocks before any real deletion.
  - **Evidence**: the harness exits 0 with top-level `status:"PREFLIGHT_BLOCKED"`, `authorized:false`, and reason `not-rolled-out`.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-010 [P1] The design authority and all four committed selectors were read before edits.
  - **Evidence**: synthesis §9 and §3 Idea 1 were checked; the N=1 selector and three parent-hub selectors all read legacy/shadow-only.
- [x] CHK-011 [P1] The defective baseline was captured before implementation.
  - **Evidence**: the old harness exited 0 with `status:"GREEN"` and minted from `rolledOutManifests` despite committed legacy/shadow bytes.
- [x] CHK-012 [P1] Protected scorer baselines were captured from disk.
  - **Evidence**: hashes matched `b039b8dd...`, `d5a9cc72...`, and `249be7c1...` before edits.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-020 [P1] The implementation uses only Node built-ins and frozen local modules.
  - **Evidence**: static require scanning reports `externalDependencies:0`; no install was run.
- [x] CHK-021 [P1] CommonJS syntax is valid.
  - **Evidence**: `node --check lib/fleet-cleanup.cjs` and `node --check harness/validate-cleanup.cjs` exit 0.
- [x] CHK-022 [P1] Code comments contain durable rationale only.
  - **Evidence**: the harness source scan reports `commentViolations:0`; no spec path or artifact ID was added to code comments.
- [x] CHK-023 [P1] The cleanup surface retains no skill-name conditional.
  - **Evidence**: static source scanning reports `nameConditionalBranches:0`.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-030 [P1] The real committed manifests are read and proven shadow-only.
  - **Evidence**: four evidence rows report hash `5485c5a4...`, `servingAuthority:"legacy"`, `shadowOnly:true`, generation `0`, and null policy hash.
- [x] CHK-031 [P1] The committed shadow state blocks token minting.
  - **Evidence**: `assertFleetReady(context.snapshots)` throws `PREFLIGHT_BLOCKED` with reason `not-rolled-out`.
- [x] CHK-032 [P1] Removing the committed-reader binding revives the original defect.
  - **Evidence**: the source mutant reports `removedCommittedEvidenceBindingAcceptsSelfAttestation:true`.
- [x] CHK-033 [P1] A mismatched hypothetical manifest pin is rejected.
  - **Evidence**: incrementing the first synthetic generation throws `PREFLIGHT_POLICY_MISMATCH`.
- [x] CHK-034 [P1] A token bound to different policy snapshots is rejected.
  - **Evidence**: snapshot drift throws `PREFLIGHT_POLICY_MISMATCH`.
- [x] CHK-035 [P1] Missing cleanup authority is rejected.
  - **Evidence**: deletion with no token throws `PREFLIGHT_REQUIRED`.
- [x] CHK-036 [P1] Stale CAS remains a load-bearing negative control.
  - **Evidence**: the stale epoch throws `STALE_FENCE` and leaves target bytes unchanged.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-040 [P1] A real token binds the exact committed manifest bytes.
  - **Evidence**: token digest input includes `evidenceHash` over ordered raw-byte manifest hashes and the ordered snapshot digest.
- [x] CHK-041 [P1] Real token use detects post-mint committed-byte drift.
  - **Evidence**: `assertApprovedPreflight()` re-reads the fixed files and throws `PREFLIGHT_EVIDENCE_DRIFT` on hash change.
- [x] CHK-042 [P1] The synthetic positive control is explicitly hypothetical.
  - **Evidence**: fixture key is `hypotheticalRolledOutManifests`; report status is `HYPOTHETICAL_READY_ONLY` with a counterfactual label.
- [x] CHK-043 [P1] Hypothetical evidence cannot authorize a real path.
  - **Evidence**: its token is `HYPOTHETICAL_ONLY`; an out-of-root target throws `PREFLIGHT_HYPOTHETICAL_ONLY` and remains byte-identical.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-050 [P1] Manifest evidence locations are fixed by the library.
  - **Evidence**: the N=1 and three parent-hub paths are module constants; callers cannot supply alternate paths.
- [x] CHK-051 [P1] Hypothetical file operations are contained.
  - **Evidence**: a unique temporary simulation root is created by the library and path containment is boundary-safe.
- [x] CHK-052 [P1] Protected scorer files remain byte-identical.
  - **Evidence**: harness end-state hashes match `b039b8dd...`, `d5a9cc72...`, and `249be7c1...`.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P1] Packet status reflects the actual shadow state.
  - **Evidence**: spec, plan, tasks, and implementation summary use `blocked-shadow`; completed deletion checkboxes were reopened.
- [x] CHK-061 [P1] The implementation summary follows the Level-2 section order.
  - **Evidence**: metadata → what-was-built → how-it-was-delivered → key-decisions → verification → limitations appears in order.
- [x] CHK-062 [P1] Decisions cite the approved design authority.
  - **Evidence**: the summary cites synthesis §9 for staged authority and §3 Idea 1 for compiled policy ownership.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] Every edit is inside the designated cleanup phase.
  - **Evidence**: code, fixture, and documentation changes are confined to this folder.
- [x] CHK-071 [P1] Upstream activation manifests and protected scorers were read-only.
  - **Evidence**: the harness reads them for evidence/digests; no write path targets those files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-080 [P1] The phase harness gives the honest current-state outcome.
  - **Evidence**: `node harness/validate-cleanup.cjs` exits 0 with `status:"PREFLIGHT_BLOCKED"`, while the nested counterfactual is `HYPOTHETICAL_READY_ONLY`.
- [x] CHK-081 [P1] Strict packet validation was run after documentation reconciliation.
  - **Evidence**: strict validation exited 2; missing spec-kit runtime/build artifacts and restricted pre-existing spec/plan/tasks drift remain recorded in the implementation summary.
<!-- /ANCHOR:summary -->
