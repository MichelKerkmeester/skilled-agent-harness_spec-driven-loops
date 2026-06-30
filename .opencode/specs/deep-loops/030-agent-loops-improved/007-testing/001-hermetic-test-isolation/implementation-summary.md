---
title: "Implementation Summary: Hermetic Test Isolation"
description: "Deep-loop-runtime tests now run fully in parallel without touching the real HOME or database/ dir, via a shared createHermeticEnv() helper."
trigger_phrases:
  - "hermetic test isolation summary"
  - "createHermeticEnv"
  - "spawn-cjs hermetic helper"
  - "parallel vitest isolation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/007-testing/001-hermetic-test-isolation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented createHermeticEnv + wired fanout-run.vitest.ts; 23/23 tests pass in parallel"
    next_safe_action: "Proceed to 002-record-replay-cassette-harness"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-hermetic-test-isolation |
| **Completed** | 2026-06-28 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep-loop-runtime tests can now run fully in parallel without writing to the real `HOME` or runtime `database/` directory. Previously the lock/state/fan-out tests shared real paths and could cross-contaminate; this removes that hazard for the wired suite.

### Hermetic environment helper

`createHermeticEnv(testId)` in `spawn-cjs.ts` returns an isolated `home`, `dbPath`, `tmpDir`, a child `env`, and a `cleanup()`. Each call mints a unique `os.tmpdir()` root, so concurrent tests never overlap, and the returned `env` is injected into spawned child processes so the runtime scripts read the isolated paths.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts` | Modified | Add `createHermeticEnv()` (isolated HOME/DB/temp + child-env + cleanup) |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modified | Wire each test to a per-test hermetic env; cleanup in afterEach; parallel-safe |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by cli-codex (gpt-5.5 xhigh fast), scope-locked to the two test files. Verified with `vitest run --pool=threads` under node v25: the full fan-out test file passes in parallel.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Per-test `os.tmpdir()` root, not a committed fixture dir | Avoids repo churn and guarantees uniqueness across parallel workers |
| Cleanup via `afterEach` finally | Removes temp trees even when a test throws, without leaking orphans |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `vitest run tests/unit/fanout-run.vitest.ts --pool=threads` (node v25) | PASS — 1 file, 23 tests |
| `validate.sh <phase> --strict` | PASS — 0 errors, 0 warnings |
| Scope | Only `spawn-cjs.ts` + `fanout-run.vitest.ts` changed; no production runtime files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full DB isolation is partial.** The coverage/council graph DB directory is hard-coded in the runtime with no existing production env-override, so graph-touching tests are not yet fully isolated. The helper does set `SPEC_KIT_DB_DIR` / `SPECKIT_DB_DIR` / `MEMORY_DB_PATH` for code that honors them. Follow-up: add a runtime graph-DB-dir env override (a small production change) so graph tests can isolate fully — track as a new deep-loop-runtime rec.
<!-- /ANCHOR:limitations -->
