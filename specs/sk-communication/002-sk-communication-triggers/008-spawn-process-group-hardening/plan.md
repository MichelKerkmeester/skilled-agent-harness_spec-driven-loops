---
title: "Implementation Plan: Phase 8: spawn process-group hardening"
description: "Plan to spawn the external-cli child detached and group-kill it on timeout and abort, with real-subprocess tests for the teardown and the unchanged normal path."
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/008-spawn-process-group-hardening"
    last_updated_at: "2026-08-20T05:52:00.000Z"
    last_updated_by: "claude"
    recent_action: "Hardened the spawn boundary and added subprocess tests"
    next_safe_action: "Validate the packet recursively"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/cli-communication-projection/src/transports/cli.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-spawn-process-group-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: spawn process-group hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Change `defaultChildProcessSpawn` to run the CLI detached so it leads its own process group, and replace the direct-child kill with a whole-group SIGKILL on both timeout and abort, keeping a direct-child fallback where process groups are unavailable. Prove the teardown with real-subprocess tests that fork a background helper, and guard the normal completion path with a test that closes stdin and captures stdout. No provider, wiring, or command behavior changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The timeout and abort tests fail against the pre-hardening spawn and pass after it.
- The normal-path test (stdin close, stdout capture, exit 0) passes before and after.
- `npm run check` (typecheck, build, test, import smoke) exits 0.
- No provider, engine table, entrypoint, or command behavior changes.
- Comment hygiene is clean; the spawn comments carry the durable why, no artifact ids.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`spawn` with `detached: true` makes the child a process-group leader on POSIX, so any helper it forks joins that group. A negative-pid `process.kill(-pid, 'SIGKILL')` then signals the whole group at once; on a platform without process groups the code falls back to `child.kill('SIGKILL')` on the direct child. The timeout timer and an abort listener both route through a single `killTree` helper, and a shared `finish` clears the timer and detaches the abort listener before resolving. stdin is still written and closed exactly as before, and the child is never unref'd, so the parent continues to await `close`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Tests first

- [x] Add real-subprocess tests: a timeout and an abort case that fork a background helper and assert it does not survive, plus a normal-path case that closes stdin and captures stdout.
- [x] Run the tests against the current code and confirm the teardown cases fail.

### Phase 2: Harden the spawn

- [x] Spawn the child detached and route timeout and abort through a group-kill with a direct-child fallback.

### Phase 3: Verify

- [x] Re-run the tests (teardown cases now pass) and the full package gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Real subprocess: a `/bin/sh` script forks a background `sleep`, prints its pid, and blocks; on timeout and on abort the helper pid is no longer alive.
- Normal path: a `cat` reader receives the prompt on stdin, reaches EOF because stdin is closed, and its stdout is captured with exit code 0.
- Whole gate: `npm run check`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The phase-006 `defaultChildProcessSpawn` boundary, modified in place.
- A POSIX shell and process groups for the real-subprocess tests (skipped on Windows).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Restore the previous `defaultChildProcessSpawn` (direct-child kill, `signal` passed to `spawn`) and remove the three real-subprocess tests. The change is contained to one function and one test block, so the revert is exact.
<!-- /ANCHOR:rollback -->
