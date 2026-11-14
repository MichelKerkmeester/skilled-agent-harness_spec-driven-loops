---
title: "Implementation Summary: Phase 3: orchestrate-task-package-agent-names"
description: "The orchestrator's task template no longer lists agent names by hand. Its Agent line points at the routing table generated from the registry, so the template cannot leave out an agent the registry schedules."
trigger_phrases:
  - "orchestrate task package agent names implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/003-orchestrate-task-package-agent-names"
    last_updated_at: "2026-11-14T16:32:47Z"
    last_updated_by: "generate-context"
    recent_action: "Replaced the hand-typed agent list with a pointer and regenerated the copies"
    next_safe_action: "Review the one-line change and decide whether to merge the branch"
    packet_purpose: "Purpose: The task template cannot disagree with the registry about which agents exist, because it no longer carries its own list."
    blockers: []
    key_files:
      - ".skilled/agents/orchestrate.md"
      - ".claude/agents/orchestrate.md"
    session_dedup:
      fingerprint: "sha256:4c5484ec7553aa0cd81d9ea57904a50760255d28c7ff56ed8cec86ed71ef8f7f"
      session_id: "scaffold-003-orchestrate-task-package-agent-names"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3eadb8bc-945b-4a2e-8183-a55e83f9e728"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-14T16:32:47Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 003-orchestrate-task-package-agent-names |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `Agent:` line of the orchestrator's task template listed eight agent names by hand while the registry schedules ten. It now reads `├─ Agent: [@<name>, exactly one agent from the Agent Selection routing table in §2]`. That table is generated from `agent-registry.json`, so a new agent reaches the template with no edit to it.

### Phase 3: orchestrate-task-package-agent-names

`@design` and `@prompt-improver` were missing from the one place the orchestrator picks an agent for a task. The roster check passed anyway, because it never read that line. One line changed in the source file, and the same line in each runtime copy.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/agents/orchestrate.md` | Modified | The `Agent:` line of the task template, line 211 |
| `.claude/agents/orchestrate.md` | Modified | The same line in the authored Claude fork, line 199. `.cursor` and `.devin` are symlinks onto this file |
| `.pi/agents/orchestrate.md`, `.codex/agents/orchestrate.toml`, `.dsh/agents/orchestrate.patch.yml` | Regenerated | Written by the three generators from the source file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrating session computed the expected content of both hand-edited files first. DeepSeek V4.1 Flash at max, through `cli-opencode` on the LLM Gateway route, made each edit from a brief that held the literal old and new text. Each edit was accepted only when the file equalled its expected file byte for byte, and both were accepted on the first run. The session then ran the three generators and every check itself.

The dispatches ran on OpenCode 1.19.4. The installed OpenCode 2 is 2.3.0, and the skill in this worktree verifies 2.1.4, so the session took the fallback the skill names.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A pointer, not a generated line | The operator chose the pointer on 2026-11-14. It changes one value and adds no code |
| The pointer names the table by its heading and section | The routing table sits under `Agent Selection` in section 2. Naming both lets the orchestrator find it without a search |
| The `.claude` copy was edited by hand in the same change | The mirror crosswalk makes it an authored fork kept in step with the source by hand |
| The acceptance search was narrowed | `'^├─ Agent: @code'` also matches an example task at line 405. `'^├─ Agent: @code . @context'` matches only the template line |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -c '^├─ Agent: @code . @context' .skilled/agents/orchestrate.md` | 1 before, no line after |
| `rg -c '^├─ Agent: \[.*routing table' .skilled/agents/orchestrate.md` | 1 |
| `rg -c '@design'` and `rg -c '@prompt-improver'` on the file | 3 and 3, unchanged |
| `node .skilled/bin/sync-agent-roster.cjs --check` | `agent-roster: OK`, exit 0 |
| `node .skilled/bin/check-agent-mirror-sync.cjs` | `all comparable mirrors in sync`, exit 0 |
| Pi, Codex and harness generators with `--check` | PASS three times, exit 0 |
| `agent-roster-mirror-check.cjs` | `STATUS=OK`, exit 0 |
| `git diff --numstat` against the commit before the edit | 1 added and 1 removed in each of the five changed files |
| Each hand-edited file against its expected file, `cmp` | Identical |
| Strict validation of this folder | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No run shows the orchestrator picks correctly from the pointer.** The change was checked by search and by the roster and mirror checks. Whether an orchestrator fills the field as reliably from a pointer as from a list on the line is untested. The generated-line alternative in `spec.md` section 7 is the fix if a run shows a wrong pick.
2. **The roster check still does not read the line.** Nothing fails if someone types a list back onto it.
3. **Other lines in the file still name agents by hand.** The example tasks near lines 397 and 405 name `@context` and `@code`. They are examples and were out of scope.
<!-- /ANCHOR:limitations -->

---
