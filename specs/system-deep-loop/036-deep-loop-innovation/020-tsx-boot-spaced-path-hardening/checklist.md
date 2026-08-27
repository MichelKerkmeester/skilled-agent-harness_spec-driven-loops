---
title: "Verification Checklist: tsx Boot + Containment-Root Hardening"
description: "Verification evidence for the tsx child-env flag strip and the DEEP_LOOP_REPO_ROOT containment override."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/020-tsx-boot-spaced-path-hardening"
    last_updated_at: "2026-08-26T16:30:00.000Z"
    last_updated_by: "claude"
    recent_action: "Verified both helpers + both gates"
    next_safe_action: "Commit"
---
# Verification Checklist: tsx Boot + Containment-Root Hardening

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

- [x] CHK-001 [P0] The crash class reproduced and the flag confirmed as trigger
  - **Evidence**: `NODE_PRESERVE_SYMLINKS=1` + spaced tsx path fails; without the flag it loads (8 exports)
- [x] CHK-002 [P0] The flag confirmed unused by the runtime
  - **Evidence**: `grep NODE_PRESERVE_SYMLINKS .opencode` = none; `realpathSafe` = `fs.realpathSync` (`write-containment.ts:253`)
- [x] CHK-003 [P1] The 10 tsx re-exec entrypoints enumerated
  - **Evidence**: `grep require.resolve('tsx') scripts/*.cjs` = 10 files

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The fix lives at one source
  - **Evidence**: `runtime-bootstrap.cjs` holds both helpers; the WHY comment is there, not duplicated
- [x] CHK-011 [P1] The unrelated spawn is untouched
  - **Evidence**: `AI_SESSION_CHILD` spawn in `codex-dispatch.cjs` unchanged

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The helper behavior is unit-tested
  - **Evidence**: `runtime-bootstrap.test.cjs` 5/5 pass; flag stripped, override resolved, blank ignored
- [x] CHK-021 [P0] All 10 entrypoints are guarded against re-leak
  - **Evidence**: `runtime-bootstrap.test.cjs` "every tsx re-exec entrypoint routes its child env through tsxChildEnv" fails on any raw-`process.env` inheritance
- [x] CHK-022 [P1] No new whole-suite regression on either gate
  - **Evidence**: `run-node-tests.mjs` 84 files, 17 fail (all pre-existing); runtime vitest delta clean

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] An entrypoint boots under the flag
  - **Evidence**: `NODE_PRESERVE_SYMLINKS=1 node loop-lock.cjs status` reaches the TS (INPUT_VALIDATION)
- [x] CHK-025 [P1] The containment override resolves and ignores blanks
  - **Evidence**: `resolveContainmentRepoRoot` unit test covers override / relative / blank / undefined

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No unrelated file changed
  - **Evidence**: `git status` = the helper, 10 entrypoints, `fanout-run.cjs`, the test, and packet docs

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The WHY is durable and hygiene-clean
  - **Evidence**: `runtime-bootstrap.cjs` comment states the failure mode; no spec/packet ids in code

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Scoped diff — boot helper + entrypoints + one test
  - **Evidence**: `git status` shows no unrelated change

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 7 | 7/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-26
**Verified By**: claude (conductor)

<!-- /ANCHOR:summary -->
