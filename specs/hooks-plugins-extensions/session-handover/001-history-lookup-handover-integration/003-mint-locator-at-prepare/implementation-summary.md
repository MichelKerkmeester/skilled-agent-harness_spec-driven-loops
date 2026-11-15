---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "mint locator at prepare implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/003-mint-locator-at-prepare"
    last_updated_at: "2026-11-15T06:24:23Z"
    last_updated_by: "template-author"
    recent_action: "Phase built and verified"
    next_safe_action: "Build phase 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-mint-locator-at-prepare"
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
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-mint-locator-at-prepare |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`prepare` now saves a history locator for the sending session, marked with provenance source `handover`. A session that takes over can therefore be given a command that reads the sender's earlier turns, which the next phase prints.

### Phase 3: mint-locator-at-prepare

When you prepare a handover from Claude Code or Codex, the handover core finds the session's own transcript, places it at the checkout root and stores the same locator a compaction would store. Nothing else about `prepare` changes. A mint that cannot finish, for any reason, leaves the output, the exit code and the relaunch record as they were.

### Files Changed

| File | Action | Purpose |
|---|---|---|
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modified | Adds `mintHandoverLocator`, which loads the compiled history helpers lazily and never throws |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | Modified | `prepare` calls the mint once after `preparePending`, inside its own guard |
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` | Modified | Four cases: stored locator, re-derived handle, unwritable state folder, runtime with no locator kind |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts` | Modified | Provenance source enum accepts `handover` |
| `.skilled/skills/system-spec-kit/runtime/tests/history-locator.vitest.ts` | Modified | Schema accepts `handover` and rejects an unknown source |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A DeepSeek V4.1 Flash worker made the change from a literal brief. The orchestrating session read the full diff, confirmed the lookup CLI does not test the provenance source, rebuilt the runtime and reran every suite from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|---|---|
| Only Claude and Codex senders get a locator | The handover core has transcript resolvers for those two runtimes only. Pi, Devin, DSH, OpenCode and Vibe have a locator kind but no resolver here, so they return null. |
| Helpers are loaded inside the mint | A checkout without a built runtime must still load the handover core, so a missing build skips the locator and nothing else. |
| The transcript comes from the runtime's own store | A handover has no host payload that names a transcript, so the path is resolved from the session id. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|---|---|
| `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-handover/tests/*.test.cjs` | 979 tests, 979 pass, 0 fail |
| `npx vitest run tests/history-*.vitest.ts tests/hook-session-start.vitest.ts` | `Test Files 14 passed (14)`, `Tests 222 passed (222)`, one new schema test |
| `npx tsc --noEmit -p tsconfig.json` | Exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The concern suite fails inside a dispatched worker.** With `AI_SESSION_CHILD=1` in the environment, 30 nudge cases report a child session and print nothing. Unset the variable for the run, as the check above does.
2. **The SessionStart offer ignores this locator.** `session-prime.ts` offers only a `precompact` locator, so the handover locator is stored and redeemable but not printed until the claim prints it.
<!-- /ANCHOR:limitations -->

---


