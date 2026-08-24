---
title: "Implementation Summary: Phase 8: spawn process-group hardening"
description: "The external-cli spawn boundary now runs the child detached and group-kills it on timeout and abort, with real-subprocess tests; a forked helper no longer survives the dispatch and the normal path is unchanged."
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/008-spawn-process-group-hardening"
    last_updated_at: "2026-08-20T21:58:00Z"
    last_updated_by: "claude"
    recent_action: "Completed the spawn process-group hardening; gate green"
    next_safe_action: "Validate the packet recursively"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/cli-communication-projection/src/transports/cli.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/test/transports/cli.test.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-008-spawn-process-group-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The teardown tests were written first and observed failing against the pre-hardening code, so they prove the fix rather than just accompany it."
      - "Detached spawn keeps stdio piped and does not unref the child, so the normal completion path is unchanged; a normal-path test guards it."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 8: spawn process-group hardening

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Phase** | 8 of 10 |
| **Completed** | 2026-08-20 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- `src/transports/cli.ts`: `defaultChildProcessSpawn` now spawns the child with `detached: true` so it leads its own process group, and a shared `killTree` helper sends a whole-group `SIGKILL` (negative pid on POSIX, direct-child fallback elsewhere). Both the timeout timer and an abort listener route through `killTree`; a shared `finish` clears the timer and removes the abort listener before resolving.
- `test/transports/cli.test.ts`: three real-subprocess tests — timeout teardown, abort teardown, and a normal stdin/stdout path — added under a new describe block, skipped on Windows.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The tests were written first and run against the current code: the timeout case hung to the 10s test limit (the orphaned helper inherited the stdout pipe and kept the parent from ever seeing `close`), and the abort case left the helper alive — both concrete demonstrations of the leak. The hardening then spawns the child detached and replaces the direct-child kill with a group `SIGKILL`, removing the `signal` option from `spawn` in favor of an explicit abort listener so an abort also tears down the group rather than only signalling the direct child. stdin is still written and closed unchanged, and the child is not unref'd, so the parent still awaits `close`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Spawn detached and signal the process group, because a rewrite tool may fork background helpers that a direct-child kill would orphan.
- Handle abort with an explicit listener rather than the `spawn` `signal` option, so an abort group-kills instead of sending a lone SIGTERM to the direct child.
- Keep a direct-child fallback for platforms without POSIX process groups.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- Fail-first: against the pre-hardening code the timeout test hit the 10s limit and the abort test asserted the helper still alive (2 failed / 14 passed).
- Typecheck: `tsc --noEmit -p tsconfig.json` exit 0.
- Build: `tsc -p tsconfig.build.json` exit 0.
- Tests: `vitest run` reports 80 files and 442 tests passing, including the 3 new subprocess tests; the group-kill file dropped from 10.76s to 1.44s once the hang was fixed.
- Import smoke: the public entry resolves `defaultChildProcessSpawn`, `createChildProcessCliRunner`, and `runExternalCliProjection`.
- Comment hygiene: the spawn comments state the durable why (process-group teardown, orphan and inherited-pipe prevention) with no artifact ids or spec paths.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The real-subprocess tests are POSIX-specific and skipped on Windows, where the direct-child fallback applies and is not exercised by these tests.
<!-- /ANCHOR:limitations -->
