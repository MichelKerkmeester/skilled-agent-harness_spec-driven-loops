---
title: "Checklist: Rollback, Audit Integrity & Non-Hub Policy"
description: "QA gate for activate-hub.cjs --rollback, the flip-serving.cjs fixes, append-only audit history, the non-hub policy, the P2 canary naming, and the routingRecommendation field fix (Planned; not yet verified)."
trigger_phrases:
  - "rollback audit integrity checklist"
  - "non-hub policy QA gate"
importance_tier: "critical"
contextType: "implementation"
---
# Checklist: Rollback, Audit Integrity & Non-Hub Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim this child complete until verified |
| **[P1]** | Required | Must verify or state the deferred/gated boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Authoritative evidence (`review-v1.md` §2-4, `synthesis-v1.md` §2.1 CF-ACT-8/9/11, `verification-v1.md`) was read before authoring this plan, and `activate-hub.cjs` + `flip-serving.cjs` were read in full this session.
  - **Evidence**: citations in `spec.md`; CF-ACT-8 upgraded from synthesis's own "INFERRED" to CONFIRMED via direct source read.
- [ ] CHK-002 [P0] All seven already-activated hubs' committed state is snapshotted before any change.
  - **Evidence**: Phase 1 / T001 in `tasks.md`.
- [ ] CHK-003 [P0] No planned write touches a sibling spec-folder packet (`009-non-hub-rollout/`, `012-default-on-decision/`, `013-create-skill-alignment/`); all references to them are cross-references only.
  - **Evidence**: `spec.md` Out of Scope section names this explicitly.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `activate-hub.cjs --rollback` reuses the existing `proveRollback()` function rather than duplicating hash-validation logic.
- [ ] CHK-011 [P0] `flip-serving.cjs`'s guard fix and `direction` field do not alter the existing forward-flip behavior for a hub's first-ever flip.
- [ ] CHK-012 [P1] `flip-history.jsonl`'s schema is documented once and shared by both drivers (no divergent per-driver formats).

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `activate-hub.cjs --rollback` is proven on a fixture/test hub before any live hub is exercised.
- [ ] CHK-021 [P0] A rollback-then-reflip fixture sequence proves `flip-serving.cjs`'s `serving-prior` fix.
- [ ] CHK-022 [P0] `fence-state.json` (or its replacement) distinguishes cutover-advance from recovery-advance for both drivers.
- [ ] CHK-023 [P0] All 5 non-hub negative fixtures (`sk-git`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit`, `mcp-code-mode`) pass.
- [ ] CHK-024 [P0] The fleet regression check (all 7 hubs, before/after byte-diff) shows zero unintended change.
- [ ] CHK-025 [P1] The `skillRouterStatus` field's shape is cross-referenced against 002's status-probe contract, not independently redefined.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] `activate-hub.cjs` has a working `--rollback` verb; `flip-serving.cjs`'s stale-prior and ambiguous-fence-advance gaps are both closed.
- [ ] CHK-031 [P0] Both drivers emit append-only `flip-history.jsonl` entries; neither overwrites prior history.
- [ ] CHK-032 [P0] The non-hub ineligibility policy correctly distinguishes the 4 real `009-non-hub-rollout/` children from `mcp-code-mode`'s zero-directory status, and no `005-mcp-code-mode` folder was created.
- [ ] CHK-033 [P1] The canary profile/owner/window/thresholds/rollback-trigger are named, with the owner honestly marked as an operator-fill placeholder.
- [ ] CHK-034 [P1] `routingRecommendation` no longer exists in `session-snapshot.ts`; `codeSearchRecommendation` and `skillRouterStatus` are both present.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No already-activated hub's `servingAuthority` or `selectedPolicy` changes except through this child's own proven `--rollback` path.
- [ ] CHK-041 [P0] The shared benchmark scorer is untouched; digests unchanged pre/post.
- [ ] CHK-042 [P1] No network, package install, credential, or dynamic-code surface is introduced by any change in this child.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] Spec, plan, tasks, checklist, and summary agree on Planned status and the P0/P1 requirement split.
- [ ] CHK-051 [P1] No file in this packet claims work is done that has not been done; every Planned item stays unchecked.
- [ ] CHK-052 [P0] Strict Level-2 packet validation passes on this phase folder.

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] All five spec docs for this child live under `010-rollback-audit-and-non-hub-policy/`; nothing was written outside it (or outside the sibling `008`/`009` folders in this same authoring pass).
- [ ] CHK-061 [P1] Real implementation targets (`activate-hub.cjs`, `flip-serving.cjs`, `session-snapshot.ts`, etc.) are named by their actual repo path, not an invented path.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 (Planned) |
| P1 Items | 6 | 0/6 (Planned) |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not yet started — Status: Planned.
**Verification Scope**: This checklist covers `activate-hub.cjs --rollback`, the `flip-serving.cjs` serving-prior and fence-direction fixes, append-only audit history, the non-hub ineligibility policy, the P2 canary naming, and the `routingRecommendation` field fix.
**Completion Boundary**: No item is claimed verified in this planning pass. The fleet regression check (CHK-024) is the highest-priority gate given this child edits two already-shipped, live drivers.

<!-- /ANCHOR:summary -->
