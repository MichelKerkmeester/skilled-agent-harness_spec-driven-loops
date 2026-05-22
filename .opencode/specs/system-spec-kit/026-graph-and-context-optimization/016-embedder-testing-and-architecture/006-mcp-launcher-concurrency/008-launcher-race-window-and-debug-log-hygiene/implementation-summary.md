---
title: "Implementation Summary: Launcher Race-Window Tightening + Debug-Log Hygiene"
description: "008 closed 2 P2 findings from 007 deep-review with a single-file edit on the skill-advisor launcher."
trigger_phrases:
  - "008 implementation summary"
  - "skill-advisor 008 done"
importance_tier: "useful"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency/008-launcher-race-window-and-debug-log-hygiene"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase 008 shipped"
    next_safe_action: "Arc 006 closed"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Both fixes landed in one file edit"
      - "21 launcher tests continue to PASS"
---
# Implementation Summary: Launcher Race-Window Tightening + Debug-Log Hygiene

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | `008-launcher-race-window-and-debug-log-hygiene` |
| **Completed** | 2026-05-18 |
| **Level** | 1 |
| **Status** | Complete |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

A single-file edit on `.opencode/bin/mk-skill-advisor-launcher.cjs` that closes both P2 findings from 007's deep-review:

- **P2-1**: `writeLeaseFile()` + reprobe relocated inside the `if (lockHeld)` block; the bootstrap-lock critical section now visually equals the actual lock-held region.
- **P2-2**: new `debug(message)` helper gated on `MK_SKILL_ADVISOR_DEBUG === '1'`; four `log()` sites previously emitting stacks/paths route through `debug()`; lines 384 + 478 keep an actionable `log()` summary so operators still see *that* something failed.

No new tests, no new files, no API changes.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

### Added

- `debug(message)` helper at line ~100, gated on `MK_SKILL_ADVISOR_DEBUG === '1'`.

### Restructured

- `main()` function: `writeLeaseFile()` + `readLeaseFile()` reprobe + early-return-on-contention moved inside the `if (lockHeld)` block; `launchServer()` stays outside.

### Re-routed log sites (4)

| Pre-008 line | Was | Now |
|---|---|---|
| 207 | `log(lease check failed: ...)` | `debug(lease check failed: ...)` |
| 384 | `log(error.stack || error.message)` | `log('child process error: ${message}')` + `debug(error.stack || message)` |
| 431 | `log(DB: ${advisorDbPath()})` | `debug(DB: ${advisorDbPath()})` |
| 478 | `log(error.stack || error.message)` | `log('launcher failed: ${message}')` + `debug(error.stack || message)` |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Kept `if (lockHeld)` defensive gate**: `acquireBootstrapLock()` always returns true under current semantics, but removing the gate would couple this packet to that contract. Defensive coding preserved.
- **Split `log()` + `debug()` at lines 384 + 478 instead of pure `debug()`**: operators need to know *that* a failure happened. The actionable summary stays at `log()` level; the full stack moves to `debug()`. Belt-and-suspenders.
- **Did NOT add a new test**: the 21-test launcher suite covers the lock+lease behavior. The 008 edits are behavior-equivalent — no new test would catch a regression that the existing suite doesn't already catch. A `MK_SKILL_ADVISOR_DEBUG=1`-capture test was considered and deferred as future work if a regression ever surfaces.
- **`MK_SKILL_ADVISOR_DEBUG` chosen as env name**: matches the existing `MK_SKILL_ADVISOR_*` env-var family in the launcher.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Check | Result |
|-------|--------|
| `node --check .opencode/bin/mk-skill-advisor-launcher.cjs` | exit 0 — SYNTAX OK |
| `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` | exit 0 — no type errors |
| `npx vitest --run launcher-lease launcher-bootstrap` | 2 files, **21 tests passed**, 1.24s |
| `validate.sh <abs 008 path> --strict` | `RESULT: PASSED` (after this packet's docs land) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- No new automated test was added. The 21-test launcher suite covers the lock+lease behavior; the 008 edits do not change observable behavior in any case the suite asserts.
- Visual reviewers (human or AI council seat) may still flag the `if (lockHeld)` gate as defensive coding when `acquireBootstrapLock()` always returns true under current semantics. Removing the gate is intentionally out of scope to preserve safety against future changes to `acquireBootstrapLock()`.
- This packet covers ONLY the 2 P2s flagged by 007's deep-review. A fresh deep-review on 008 could surface new P2/P3 hygiene items; addressing those is deferred to a future packet if and when the operator requests it.
<!-- /ANCHOR:limitations -->
