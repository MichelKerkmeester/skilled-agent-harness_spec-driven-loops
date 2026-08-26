---
title: "Verification Checklist: better-sqlite3 Version + Node-ABI Alignment"
description: "Verification evidence for the dependency alignment + Node-ABI self-healing guard."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/001-dependency-and-node-abi-alignment"
    last_updated_at: "2026-08-26T11:05:01.015Z"
    last_updated_by: "claude"
    recent_action: "Authored the dependency/Node-ABI checklist"
    next_safe_action: "Execute Phase 1"
---
# Verification Checklist: better-sqlite3 Version + Node-ABI Alignment

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

- [ ] CHK-001 [P0] Both skills' better-sqlite3 versions captured
  - **Evidence**: runtime + system-spec-kit `package.json` versions recorded
- [ ] CHK-002 [P0] Running Node ABI captured
  - **Evidence**: `process.versions.modules` recorded
- [ ] CHK-003 [P1] Canonical-version direction decided with rationale
  - **Evidence**: `decision` note in `plan.md` Phase 1

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The ABI guard is minimal and clearly-commented
  - **Evidence**: guard module reviewed; comment states the WHY, not ids
- [ ] CHK-011 [P1] Warn-and-continue when the toolchain is absent
  - **Evidence**: a missing `node-gyp` path logs a clear message, no crash

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `dependency-seams.vitest.ts` passes
  - **Evidence**: `vitest run` green on the file
- [ ] CHK-021 [P0] Forced ABI mismatch is auto-repaired
  - **Evidence**: a stale build is rebuilt by the guard; the SQLite test then passes
- [ ] CHK-022 [P1] No new whole-suite regression
  - **Evidence**: whole-suite delta vs the 017 baseline is clean

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-024 [P0] Both skills resolve the same version
  - **Evidence**: `require.resolve` version check equal across skills
- [ ] CHK-025 [P1] The pin is self-healing, not one-shot
  - **Evidence**: the guard triggers on a Node `NODE_MODULE_VERSION` change

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] No secrets or lockfile drift beyond the intended dep
  - **Evidence**: the staged diff is the `better-sqlite3` pin + the guard only

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] The ABI strategy is documented for operators
  - **Evidence**: `plan.md` §Architecture describes the self-healing guard

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Scoped diff — dependency metadata + one guard module
  - **Evidence**: `git status` shows no unrelated change

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 0/6 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: TBD
**Verified By**: TBD

<!-- /ANCHOR:summary -->
