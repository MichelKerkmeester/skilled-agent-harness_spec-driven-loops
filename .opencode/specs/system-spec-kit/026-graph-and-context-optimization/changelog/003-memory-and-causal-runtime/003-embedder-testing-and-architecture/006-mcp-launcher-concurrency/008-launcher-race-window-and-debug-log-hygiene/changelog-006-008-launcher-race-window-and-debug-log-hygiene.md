---
title: "Launcher Race-Window Tightening and Debug-Log Hygiene"
description: "Closes 2 P2 findings from the 007 deep-review with a single-file edit on the skill-advisor launcher. The PID guard write now lives inside the bootstrap-lock critical section and four noisy log sites are gated behind MK_SKILL_ADVISOR_DEBUG."
trigger_phrases:
  - "launcher race window debug log hygiene"
  - "MK_SKILL_ADVISOR_DEBUG gate"
  - "skill-advisor launcher P2 closeout"
  - "PID guard bootstrap lock"
  - "debug log gating launcher"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/008-launcher-race-window-and-debug-log-hygiene` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

The skill-advisor launcher had two P2 hygiene findings from the 007 deep-review. The PID guard write and its reprobe sat outside the `if (lockHeld)` block, creating an apparent race window that reviewers had to mentally trace to confirm was benign. Four log sites emitted full error stacks, exception messages and the resolved DB path to stderr unconditionally, leaking implementation detail in operator-visible deployments.

Both findings were closed in a single-file edit to `.opencode/bin/mk-skill-advisor-launcher.cjs`. The `writeLeaseFile()` call and the `readLeaseFile()` reprobe now live inside the bootstrap-lock critical section so the visual boundary matches the actual lock-held region. A new `debug(message)` helper, gated on `MK_SKILL_ADVISOR_DEBUG === '1'`, replaces the four noisy log sites. Operator-relevant failure events retain an actionable `log()` summary so the operator still sees that something failed.

### Added

- `debug(message)` helper in `mk-skill-advisor-launcher.cjs`, gated on `process.env.MK_SKILL_ADVISOR_DEBUG === '1'`

### Changed

- `main()` in `mk-skill-advisor-launcher.cjs`: `writeLeaseFile()` and `readLeaseFile()` reprobe and early-return-on-contention moved inside the `if (lockHeld)` block so the bootstrap-lock critical section matches its visual boundary
- Four log sites re-routed: lease-check-failed debug message moved to `debug()`; child-process error and main-catch error now emit an actionable `log()` summary plus a `debug()` stack; resolved DB path moved to `debug()`

### Fixed

- Apparent race window where `writeLeaseFile()` sat outside the bootstrap-lock critical section. The change makes the code read correctly without requiring mental proof of why the window was benign.
- Unconditional emission of error stacks and the resolved DB absolute path to stderr. Default operator output is now clean. Full verbose output is available with `MK_SKILL_ADVISOR_DEBUG=1`.

### Verification

| Check | Result |
|-------|--------|
| `node --check .opencode/bin/mk-skill-advisor-launcher.cjs` | exit 0. SYNTAX OK |
| `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` | exit 0. No type errors |
| `npx vitest --run launcher-lease launcher-bootstrap` | 2 files, 21 tests passed, 1.24s |
| `validate.sh <abs 008 path> --strict` | RESULT: PASSED |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Added `debug()` helper. Moved `writeLeaseFile()` and reprobe inside `if (lockHeld)`. Re-routed 4 log sites through `debug()` with actionable `log()` summaries at lines 384 and 478. |

### Follow-Ups

- No new automated test was added. The 21-test launcher suite covers lock and lease behavior. The 008 edits are behavior-equivalent and no new test would catch a regression that the existing suite does not already catch.
- Reviewers may still flag the `if (lockHeld)` gate as defensive coding given that `acquireBootstrapLock()` always returns true under current semantics. Removing the gate is intentionally out of scope to preserve safety against future changes to `acquireBootstrapLock()`.
- A fresh deep-review on 008 could surface new P2 or P3 hygiene items. Addressing those is deferred to a future packet if the operator requests it.
