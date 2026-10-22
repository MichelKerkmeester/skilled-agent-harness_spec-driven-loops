---
title: "Implementation Summary"
description: "A sub-agent's tool calls no longer drive the parent's context nudge, and a sub-agent's PreCompact no longer writes the parent's compact cache."
trigger_phrases:
  - "fork nudge and precompact guards implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/021-fork-nudge-and-precompact-guards"
    last_updated_at: "2026-10-22T06:56:48Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Both sub-agent skips built by DeepSeek and verified"
    next_safe_action: "Rebuild the spec-kit runtime on main after merge"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-021-fork-nudge-and-precompact-guards"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-fork-nudge-and-precompact-guards |
| **Completed** | 2026-10-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The last two places where a fork acted as its parent are closed. A fork's tool calls no longer trigger the parent's handoff nudge, and a fork's PreCompact no longer writes the parent's compact cache or signals a boundary for it.

### Sub-agent skip in the context nudge

`context-nudge.mjs` returns with no output and no state write when the payload carries a non-empty `agent_id`. A probe on Claude Code 2.1.306 showed a fork's PostToolUse carries it, with the parent's session id and transcript path.

### Sub-agent skip in PreCompact

`compact-inject.ts` exports `isSubagentPayload` and returns before the boundary signal and cache write when it is true. A later probe settled the open question: on Claude Code 2.1.306 a fork's PreCompact, SessionStart and PostCompact payloads carry no `agent_id`, so this skip does not fire for a fork's compaction. The `agent_id: absent` clause was dropped from the log line, because a fork logs it too.

An sk-code alignment review then raised seven P2 items, all fixed. The guard now trims `agent_id` like the other two hooks, with a whitespace-only test. `HookInput` declares `agent_id` and `agent_type`. The two copies of the fork check point at each other. The relaunch hooks' unimported predicates lost their `export`. A long denial string was split, and the session-start window tests now isolate the 5-second and 10-second gates.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/claude/context-nudge.mjs` | Modified | Sub-agent skip |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modified | Two nudge tests |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` | Modified | Helper, skip, log line |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-precompact.vitest.ts` | Modified | Helper tests |
| Two READMEs | Modified | Both skips |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 Flash wrote the two test files in parallel, then the two fixes in parallel, then the README sentences. The orchestrator checked each diff and ran every check.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Key both skips on `agent_id` | It is the field the probes showed separates a sub-agent from its parent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Nudge tests before and after | Fork test failed, empty-id test passed. Then both pass |
| PreCompact helper tests before and after | "not a function", then 25 of 25 with session-start |
| Relaunch suite | 596 of 596 |
| `tsc --noEmit` | Clean |
| Built PreCompact, fork payload | Logs the skip |
| Drift guards | 4 of 4 |
| README validators | 0 issues on both |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A fork's PreCompact carries no `agent_id`.** A probe with `claude -p --autocompact 100k` made a fork compact three times, and none of its PreCompact, SessionStart or PostCompact payloads held the field. The PreCompact skip therefore never fires for a fork. The harm stays low: the hook caches the parent's own transcript, and session-prime skips the fork's SessionStart through the fork's compaction record.
2. **The live `compact-inject` needs a rebuild.** `dist` is gitignored.
<!-- /ANCHOR:limitations -->

---


