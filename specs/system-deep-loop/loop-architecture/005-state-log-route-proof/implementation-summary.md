---
title: "Implementation Summary"
description: "A correct deep-research run now passes the route-proof check, and a relative state-log path lands in the caller's directory."
trigger_phrases:
  - "state log route proof implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/005-state-log-route-proof"
    last_updated_at: "2026-11-17T21:56:04Z"
    last_updated_by: "markdown-agent"
    recent_action: "Filled the Level 1 packet and verified the route-proof and run-directory fixes"
    next_safe_action: "Review the diff, then commit when approved"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-state-log-route-proof"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-state-log-route-proof |
| **Completed** | 2026-11-17 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A correct deep-research run no longer fails the command's route-proof check. A relative state-log path now lands in the caller's directory, not inside the Skilled checkout. A project that vendors Skilled reported both problems.

### Keep route-proof fields in the deep-research state log and keep the pre-dispatch audit path inside the packet

The deep-research state log now keeps `target_agent`, `agent_definition_loaded` and `resolved_route` for each completed iteration. Before this change, it kept only `mode`, so the route-proof check failed a correct run. Older ledgers that lack the three fields project as before, so no migration step is needed.

A relative state-log path now resolves against your working directory. Before, the append gateway ran from the Skilled checkout, so a relative path wrote there when `.skilled` was a symlink. A path you give now lands where you point it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` | Modified | Adds the optional route-proof fields to the `iteration_completed` record |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Modified | Copies the three fields from a legacy record when their types are valid |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | Modified | Writes the fields to the state log as snake_case keys when present |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | Exports `gatewayRunDirectory` and uses it before the gateway spawn |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-ledger-schema.vitest.ts` | Modified | Adds the route-proof test |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-run-directory.vitest.ts` | Created | Tests the run directory for a relative path and for an absolute path |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work record shows that the three new tests failed before the fix and pass after it. This packet did not rerun the failing state. In this packet, the verification runs were the run-directory suite, the ledger suite, the three executor-audit suites, the typecheck and the whole deep-loop suite. Each printed its expected output and exited 0. The code changes are uncommitted in the worktree at the time of writing.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add the three fields as optional schema fields | Older ledgers lack them, and optional fields let those ledgers project as before. |
| Copy and write the fields only when their types are valid | The type checks keep a malformed value out of the state log. |
| Write the projection keys as `target_agent`, `agent_definition_loaded` and `resolved_route` | The post-dispatch validator reads those keys for the route-proof check. |
| Fix the run directory in `gatewayRunDirectory` before the spawn | The spawn runs from the Skilled checkout, so a relative path must become absolute before the spawn. |
| Keep the spawn's working directory at the repository root | The gateway binds each append to the checkout's identity, as the comment above `REPOSITORY_ROOT` states. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run tests/unit/deep-research-ledger-schema.vitest.ts` in the runtime folder | PASS. `Tests  58 passed (58)`, exit 0. |
| `npx vitest run tests/unit/executor-audit-run-directory.vitest.ts` in the runtime folder | PASS. `Tests  2 passed (2)`, exit 0. |
| The three executor-audit files in the runtime folder | PASS. `Tests  101 passed (101)`, exit 0. |
| `npm run typecheck` in the runtime folder | PASS. Exit 0. |
| `npm test` in the runtime folder, the whole deep-loop suite | PASS. `Test Files  186 passed (186)` and `Tests  3098 passed` with 9 skipped, exit 0. |
| `validate.sh` on this packet with `--strict` | PASS. `RESULT: PASSED`, 0 errors, 0 warnings, exit 0. |
| Fail-first runs of the three new tests | Recorded in the work record. Not rerun for this packet. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No baseline for the whole suite.** The whole-suite run shows zero failures. It does not show a measured change, because no run was captured before the change. To get a baseline, run `npm test` in the runtime folder on the base commit `9cda2018330` in a separate worktree and compare the two results.
2. **The fail-first runs are not repeated.** The work record says the three new tests failed before the fix. To check that again, revert the five modified files in a scratch worktree, copy in the new test file, and run the two focused test files.
<!-- /ANCHOR:limitations -->

---

