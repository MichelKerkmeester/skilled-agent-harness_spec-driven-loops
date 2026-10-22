---
title: "Implementation Summary"
description: "A fork's compaction no longer spends its parent's cached brief, and a sub-agent can no longer run the relaunch lifecycle commands against its parent's handoff note."
trigger_phrases:
  - "fork session guards implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/020-fork-session-guards"
    last_updated_at: "2026-10-22T04:44:28Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Both fork guards built by DeepSeek and verified"
    next_safe_action: "Rebuild the spec-kit runtime on main after merge"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-020-fork-session-guards"
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
| **Spec Folder** | 020-fork-session-guards |
| **Completed** | 2026-10-22 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two more places where a forked sub-agent acted as its parent are closed. A fork's compaction no longer takes the parent's cached recovery brief, and a sub-agent can no longer claim, complete, keep or prepare the parent's handoff note.

### Fork-aware compact recovery

`session-prime` now checks, before recovering a compaction, whether a fork under the session's `subagents/` folder wrote a compaction record in the last 5 seconds. If so, it prints nothing, logs the skip and leaves the cache for the parent.

### Sub-agent guard for the relaunch CLI

A Claude PreToolUse hook denies `session-relaunch.cjs` `claim`, `complete`, `keep` and `prepare` when the call carries `agent_id`. A live probe on Claude Code 2.1.306 showed that sub-agent and fork tool calls carry `agent_id` and `agent_type` with the parent's session id, and that the main session's calls carry neither. `history` stays allowed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` | Created | The guard |
| `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` | Created | 10 guard tests |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, `.claude/settings.json` | Modified | Registration and its rendered row |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts` | Modified | Pinned binding count 100 |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts`, `session-prime.ts` | Modified | Fork check and skip |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts` | Modified | 4 helper tests |
| Two READMEs | Modified | The guard and the skip |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 Flash wrote each change in its own dispatch: two test files in parallel, then both implementations in parallel, then the registry row and the READMEs. The orchestrator checked each diff, ran every check and ran the sync. It also raised the pinned binding count, the same edit earlier phases made when they added a hook.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Key the guard on `agent_id` | It is the one field the probe showed separates a sub-agent's call from the parent's |
| Port the check into `shared.ts` instead of importing the relaunch hook | The spec-kit runtime builds TypeScript into its own `dist` and should not depend on another concern's `.mjs` |
| Leave `compact-inject.ts` alone | A fork's PreCompact reads the parent's transcript, and whether its payload carries `agent_id` is unverified |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Guard tests before and after | 0 of 10, then 10 of 10 |
| Helper tests before and after | 4 failing with "not a function", then the file passes 12 of 12 |
| `hook-registration-sync.vitest.ts` | 7 of 7 after the count change |
| `sync-hook-registrations.cjs --check` | PASS, only the new Claude row written |
| Relaunch suite | 594 of 594 |
| Spec-kit hook suites run | 18 passed, 2 skipped |
| `tsc --noEmit` | Clean |
| Drift guards | 4 of 4 |
| Built `session-prime`, fresh fork boundary | No output, skip logged |
| Built guard | Denies a fork's `claim`, allows the main session's |
| README validators | 0 issues on both |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The live `session-prime` needs a rebuild.** `dist` is gitignored, so a checkout runs the old hook until `npm run build` runs in the spec-kit runtime.
2. **PreCompact is unguarded.** A fork's PreCompact still rewrites the parent-keyed cache from the parent's transcript.
3. **The context nudge can still reach a fork.** PostToolUse inside a fork reads the parent's transcript, and that path was not part of this request.
<!-- /ANCHOR:limitations -->

---


