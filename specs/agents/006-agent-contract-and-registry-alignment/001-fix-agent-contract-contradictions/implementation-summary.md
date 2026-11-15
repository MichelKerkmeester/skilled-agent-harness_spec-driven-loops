---
title: "Implementation Summary: Phase 1: fix-agent-contract-contradictions"
description: "Eight agent files now state one contract each: the council runs no script, the orchestrator dispatches agents by name, the code agent returns PASS, FAIL or BLOCKED, and the stale wording is gone."
trigger_phrases:
  - "fix agent contract contradictions implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/006-agent-contract-and-registry-alignment/001-fix-agent-contract-contradictions"
    last_updated_at: "2026-11-14T12:24:08Z"
    last_updated_by: "generate-context"
    recent_action: "Closed phase 1 with all ten acceptance rows Met"
    next_safe_action: "Run the phase 002 tasks in order from T001"
    packet_purpose: "Purpose: Every agent file states one contract that its own permissions allow, so an agent that follows the file can finish its workflow and a caller can parse what comes back."
    blockers: []
    key_files:
      - ".skilled/agents/ai-council.md"
      - ".skilled/agents/orchestrate.md"
      - ".skilled/agents/code.md"
    session_dedup:
      fingerprint: "sha256:7572faa45f160ed832abb085311c536ee6b0bb38fce096586721b8f2ce8fd18d"
      session_id: "d26ce6f7-65fb-42c9-81e5-aae22633434d"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "d26ce6f7-65fb-42c9-81e5-aae22633434d"
      workspace: "/Users/michelkerkmeester/worktrees/public/377-agent-contract-and-registry-alignment"
      savedAt: "2026-11-14T12:24:08Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-fix-agent-contract-contradictions |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An agent that follows its own file can now finish its workflow. The council no longer has a rule that needs the Bash tool it is denied, and a `context` agent the orchestrator dispatches keeps its read-only tool list.

### One contract per agent file

The council writes its artifacts with Write and Edit, and the calling workflow runs the helper script and the append gateway. The orchestrator dispatches each agent by its own name and keeps the general wrapper only for a runtime with no named agents. The `code` agent names `PASS`, `FAIL` and `BLOCKED` everywhere, and the retired fourth value is gone from all 27 lines that used it. The review fast path keeps the standards load. The deep-research overview and its step headings list the same eleven steps in the same order. No file names the retired memory tools or a Copilot profile.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/agents/ai-council.md` | Modified | Persistence by Write and Edit, the workflow runs the scripts, report line, delegation rule, one stale phrase |
| `.skilled/agents/orchestrate.md` | Modified | Dispatch by agent name, council delegation rule, three stale phrases |
| `.skilled/agents/code.md` | Modified | One return vocabulary |
| `.skilled/agents/review.md` | Modified | Fast path keeps the standards load |
| `.skilled/agents/deep-research.md` | Modified | One step order, numbers 1 to 11 |
| `.skilled/agents/context.md`, `debug.md`, `deep-review.md` | Modified | Stale retrieval wording replaced |
| `.claude/agents/` (the same eight) | Modified | Hand-kept twins, the same lines |
| `.codex/agents/`, `.pi/agents/` (eight each) | Regenerated | Generated copies |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Six dispatches of DeepSeek V4.1 Flash at max through `cli-opencode` on the LLM Gateway route made the edits, one agent file and its Claude twin per dispatch, each from a brief holding the literal old and new text. The orchestrating session then compared each canonical diff with its twin, ran the acceptance searches, ran the Pi and Codex generators and ran `check-agent-mirror-sync.cjs --all`. The setup files under `scratch/` and the probe were produced by the orchestrating session. The `.cursor` and `.devin` trees are symlinks onto `.claude`, so neither was written. The `.dsh` patch files were regenerated with `sync-agents-dsh.cjs`, which the commit gate requires.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The detailed step headings set the deep-research order, not the overview | The delta file's first line is the record built in the record-state step, so that step has to come before the delta |
| The retired return value was replaced on every line of `code.md`, not only in the NEVER rule | Decision D2 of this phase's goal retires the value, and a caller reading any of the other 26 lines would still meet it |
| Council state events stay worded as steps, with one sentence naming who records them | Rewriting each of the ten steps would have changed text phase 5 owns, and one sentence removes the instruction the agent cannot follow |
| `scratch/after.txt` shows only the new lines | Task T015 requires the retired words to be absent from that file, and check CHK-013 asks for the replaced lines in it. The old lines are in the commit diff |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Acceptance criteria | 10 of 10 `Met`, none waived, see `acceptance-criteria.md` |
| `tasks.md` checklist | P0 10 of 10, P1 11 of 11, P2 0 of 1 deferred with its reason |
| `rg -n -e 'RETURN is .DONE.' -e 'Skip steps 3-5' -e 'all custom agents use the general subagent type' .skilled/agents` | No line |
| `rg -n -i -e 'memory tools' -e 'copilot profile' .skilled/agents` | No line, down from 10 |
| `node .skilled/bin/check-agent-mirror-sync.cjs --all` | `11 agent(s) checked — all comparable mirrors in sync — OK`, exit 0 |
| `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` | `STATUS=OK`, exit 0 |
| `context` dispatched by name on Claude Code, asked to write a file | Refused, tools were Read, Grep and Glob, `scratch/probe.txt` absent |
| Twin parity | The canonical and Claude diffs are identical for all eight files once the tree path is normalized |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The probe covers Claude Code only.** No other runtime was asked to dispatch `context` by name. On a runtime whose delegation tool rejects the name, the instruction falls back to the general wrapper and the tool limits do not hold there.
2. **No council run was executed after the change.** The council rules were checked by search and by reading the diff. A live `/deep:ai-council` run would show whether the workflow records every event the agent now only names.
3. **The orchestrator rosters still omit `design` and `prompt-improver`.** Phase 2 generates those tables.
<!-- /ANCHOR:limitations -->

---
