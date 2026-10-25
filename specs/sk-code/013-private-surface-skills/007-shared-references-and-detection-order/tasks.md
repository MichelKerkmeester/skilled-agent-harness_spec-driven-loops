---
title: "Tasks: Phase 7: shared-references-and-detection-order"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "shared references and detection order tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 7: shared-references-and-detection-order

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`H` is `.skilled/skills/sk-code`. `G` is `.skilled/skills/sk-doc/sk-create-skill/scripts`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture both workers' baselines before any edit (worker notes). Verify: router-sync baseline 5/5 for worker one, 3/5 for worker two while worker one's moves were in flight
- [x] T002 Scaffold this phase child with `create.sh --phase --parent` at the level `recommend-level.sh` gives. Verify: `recommend-level.sh --loc 2000 --files 55 --architectural` prints `Recommended Level: 3`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Delete the two checklists and the two `universal/` files, folding their surface-neutral rules into `workflow-debug.md` and `workflow-verify.md` (`$H/shared/references/`). Verify: `git status` shows four `D` rows
- [x] T004 Move the code style guide to `$H/sk-code-quality/references/code-style-guide.md` and repoint every reader. Verify: `git status` shows the `RM` row
- [x] T005 Repoint ROUTER RESOURCE_MAP and SHARED_CONTROL_RESOURCES (`$H/ROUTER.md`). Verify: `verify-doc-claims.cjs` prints 4/4
- [x] T006 Declare `surfaceDetection` on `sk-code-skilled` with role `fallback` (`$H/mode-registry.json`). Verify: `compiled-route-surface-hint.test.cjs` 12/12
- [x] T007 Add `validateSurfaceDetection` and `routingModel.surfaceDetection` to the registry compiler, and declared-label hint resolution to the canary router, in both the served copies and the authored twins. Verify: `compiled-route-sync.cjs --check` reports all 55 copies match
- [x] T008 Replace the hard-coded regex with `declaredSurfaces` and `detectSurfaces` (`$H/sk-code-skilled/assets/scripts/router-replay-lib.cjs`). Verify: replay parity 76 of 77 identical, the one difference a `.skilled/` prompt moving UNKNOWN to SKILLED with no resource change
- [x] T009 Read the declared order in `detectWorkspaceSurface` (`.skilled/plugins/system-skill-advisor.js`). Verify: plugin vitest 97 passed
- [x] T010 Accept `surface_detection` as an optional object top-level key (`$G/ci-skill-root-metadata.cjs`) with an accept case and a reject case in `$G/tests/skill-root-metadata-contract.test.cjs`. Verify: see the Verification Summary
- [x] T011 Correct the old hint prose in `$H/ROUTER.md` Core Principle, the `--surface-hint` row of `.skilled/bin/README.md` and the allowlist comment in `$H/sk-code-skilled/assets/scripts/verify-router-sync.cjs`. Verify: `rg -n 'session.s surface leads|leads a keyword tie between surfaces the prompt matched\.' $H/ROUTER.md .skilled/bin/README.md` prints nothing
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Phase B ran after the optimizer workers finished. Outputs are in `scratch/evidence/phase-b-gates.log`.

- [x] T012 Regenerate the hub leaf manifest: `node $G/generate-leaf-manifest.cjs --write $H`. Verify: printed `leaf-manifest.json written (9452dc9c...)`, and router-sync check 3 passes
- [x] T013 Refresh the sk-code activation manifest and copy it to the authored twin. Verify: `refresh` printed `fresh: true`, policy hash `acbe381f`. Front-door 1/1 and manifest 48/48 (`scratch/evidence/phase-b-gates.log` lines 90 and 92)
- [x] T014 Run the Hermes skill sync. Verify: `Wrote 3 of 67 Hermes skill copies`, then `--check` prints `PASS: 67 Hermes skill copies in sync`
- [B] T015 Regenerate the trigger index and retrieval fixtures that still name the old paths. Blocked: the CI trigger-index job rebuilds them after the push. Verify: the `rg` search prints nothing after that rebuild
- [x] T016 Run the full gates. Verify: every block in `scratch/evidence/phase-b-gates.log` reports exit 0
- [x] T017 Recursive strict validation of the parent. Verify: `RESULT: PASSED` for all eight folders (`scratch/evidence/phase-b-gates.log` lines 111 to 127)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Router-sync prints 5/5 and parent-skill-check prints OK from the final state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, which also holds ADR-001 to ADR-003
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task blocked on the optimizer workers stays `[ ]` with its reason, never `[x]`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified: optimizer workers and phase B regeneration
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on every edited JS file (worker notes, and phase A for `ci-skill-root-metadata.cjs`)
- [x] CHK-011 [P0] The comment-hygiene checker returns 0 on all changed code (worker notes)
- [x] CHK-012 [P1] Malformed blocks fail loudly: `SURFACE_DETECTION_INVALID`, `SURFACE_FALLBACK_INVALID`, `GRAPH_METADATA_INVALID_SURFACE_DETECTION`
- [x] CHK-013 [P1] Code follows sk-code-skilled patterns, with no spec or task ids in comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met (pending phase B)
- [x] CHK-021 [P0] Replay parity checked over 77 hub playbook prompts
- [x] CHK-022 [P1] Edge cases tested: generic Node file stays UNKNOWN, symlinked `local-*` file is not SKILLED, outside fallback claim ignored
- [x] CHK-023 [P1] Compiled-route front-door and manifest suites pass after the re-mint
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each change has a class: the hard-coded order is `class-of-bug`, the moved style guide is `cross-consumer`, the fleet gate key is `instance-only`
- [x] CHK-FIX-002 [P0] Same-class producers inventoried: compiler, canary router, replay library, advisor plugin all read the declared order
- [x] CHK-FIX-003 [P0] Consumer inventory done for the moved style guide and the deleted files (worker one's reader list)
- [x] CHK-FIX-004 [P0] Path guard cases covered: outside-root TypeScript file, symlinked `local-*` file, fallback claim from an outside skill
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md`: surface kind by hint
- [x] CHK-FIX-006 [P1] Hostile env variant: N/A, no changed test reads process-wide state beyond the plugin cases' temporary symlink, removed in finally
- [ ] CHK-FIX-007 [P1] Evidence pinned to the phase commit SHA (pending phase B)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets touched
- [x] CHK-031 [P0] Declared blocks are validated on compile and in the fleet gate
- [x] CHK-032 [P1] No private `local-*` id or marker in a tracked file. The suggested blocks stay in the worker notes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same order and the same deleted files
- [x] CHK-041 [P1] The allowlist comment in `verify-router-sync.cjs` matches the shared-control routing
- [x] CHK-042 [P2] `.skilled/bin/README.md` and `ROUTER.md` describe the fallback hint
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept in the session scratchpad, none in the repo
- [x] CHK-051 [P1] scratch/ holds only `evidence/phase-b-gates.log`, kept as the evidence the acceptance rows cite
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 13/14 |
| P1 Items | 18 | 16/18 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] ADR-001 to ADR-003 recorded in the ADR section of `plan.md`
- [x] CHK-101 [P1] Every ADR has status Accepted
- [x] CHK-102 [P1] Each ADR names the rejected alternative and why
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] N/A. The packet makes no performance claim and runs no service.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented in `plan.md`, and `compiled-route-sync.cjs --check` reports all 55 copies match
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No dependency or license changed
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized with the final gate output (pending phase B)
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Merges the phase commit | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
