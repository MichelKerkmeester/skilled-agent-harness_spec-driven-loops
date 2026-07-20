---
title: "Checklist: sk-code Alignment & Drift Guards"
description: "QA gate for the RESOURCE_MAP doc-truth fix, the qualifiedIdToLeaf bijection test, and the run-all-drift-guards.sh orchestrator (Planned; not yet verified)."
trigger_phrases:
  - "sk-code alignment checklist"
  - "drift guards QA gate"
importance_tier: "critical"
contextType: "implementation"
---
# Checklist: sk-code Alignment & Drift Guards

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim this child complete until verified |
| **[P1]** | Required | Must verify or state the deferred/gated boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Authoritative evidence (`review-v1.md` §4, `synthesis-v1.md` §2.6/§6, `verification-v1.md` CF-SC-1 row) was read before authoring this plan.
  - **Evidence**: citations in `spec.md`; ±2–10-line drift acknowledged, to be re-anchored on the symbol at build time.
- [ ] CHK-002 [P0] All planned writes stay inside this child's real target files; no edit to the frozen scorer trio is planned.
  - **Evidence**: `spec.md` Files to Change table lists only doc/test/script/additive-field targets.
- [ ] CHK-003 [P1] The `002` dependency (promoted runtime request contract) is confirmed before REQ-006 work starts.
  - **Evidence**: Definition of Ready in `plan.md`.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `run-all-drift-guards.sh` has zero new external dependencies (POSIX shell, calls existing scripts only).
- [ ] CHK-011 [P0] `--check-router`'s markdown parser is scoped to RESOURCE_MAP tables, not general markdown, and stays behind a default-off flag.
- [ ] CHK-012 [P1] `qualifiedIdToLeaf` follows `leaf-resource-contract.cjs`'s existing export conventions — no parallel or competing lookup table introduced.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] The bijection Vitest suite is bidirectional (compiled → RESOURCE_MAP AND RESOURCE_MAP → compiled), not one-directional.
- [ ] CHK-021 [P0] `run-all-drift-guards.sh` returns non-zero when any single guard is seeded to fail.
- [ ] CHK-022 [P1] `--check-router` has both a positive fixture and a drift fixture.
- [ ] CHK-023 [P1] The LUNA-high `surfaceBundle` playbook case is recorded with its `sk-code:code-opencode` result.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] `code-opencode/SKILL.md` no longer attributes RESOURCE_MAP-equality enforcement to a markdown-blind script.
- [ ] CHK-031 [P0] `alignment-verification-automation.md §5` backlinks to `sk-code-router-sync.vitest.ts`.
- [ ] CHK-032 [P0] This child's alignment-authority interface is documented as the one later 015 children (009, 010, 011) must consume.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No live routing file is functionally changed — the `SKILL.md` edit touches prose/citations only, never the SMART ROUTING decision logic.
- [ ] CHK-041 [P0] The shared benchmark scorer is untouched; digests unchanged pre/post.
- [ ] CHK-042 [P1] No network, package install, credential, or dynamic-code surface is introduced by `run-all-drift-guards.sh` or the new Vitest suite.

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

- [ ] CHK-060 [P0] All five spec docs for this child live under `008-sk-code-alignment-and-drift-guards/`; nothing was written outside it (or outside the sibling `009`/`010` folders in this same authoring pass).
- [ ] CHK-061 [P1] Real implementation targets (`SKILL.md`, `verify_alignment_drift.py`, etc.) are named by their actual repo path, not an invented path.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 (Planned) |
| P1 Items | 7 | 0/7 (Planned) |
| P2 Items | 0 | 0/0 |

**Verification Date**: Not yet started — Status: Planned.
**Verification Scope**: This checklist covers the RESOURCE_MAP doc-truth fix, the `qualifiedIdToLeaf` bidirectional bijection test, the `run-all-drift-guards.sh` orchestrator, and (P1) the markdown `--check-router` gate and the `surfaceBundle` request-context extension.
**Completion Boundary**: This checklist becomes actionable once `002-runtime-promotion-and-status-foundation` ships (REQ-006 dependency) or, for REQ-001..REQ-004, immediately. No item is claimed verified in this planning pass.

<!-- /ANCHOR:summary -->
