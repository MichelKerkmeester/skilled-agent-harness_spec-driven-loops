---
title: "Implementation Summary"
description: "prompt-improver model choice moved to the dispatcher; TEST, caller names and Integration IDs fixed"
trigger_phrases:
  - "prompt improver model eligibility implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/014-prompt-improver-model-eligibility"
    last_updated_at: "2026-11-15T00:26:27Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the phase"
    next_safe_action: "Run the session-relaunch complete command"
    packet_purpose: "Purpose: The agent states only what it can do: the dispatcher owns the model choice or the rule is gone, `TEST` reads `NOT RUN` and every caller it names is one the registry names."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:8757343d61e90a7508302ec29fd004781687f9149b0ee8e738ee75699a240ad6"
      session_id: "scaffold-014-prompt-improver-model-eligibility"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "a84f4eed-26f9-49ac-91eb-e2375c207e96"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-15T00:26:27Z"
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
| **Spec Folder** | 014-prompt-improver-model-eligibility |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The dispatcher now chooses the @prompt-improver model. The `/prompt:improve` workflows pass `model=sonnet`, and the Claude Code copy pins `model: sonnet`. The eligibility table lives in `sk-prompt` only. The agent keeps a backstop that returns the blocked package with a `REFUSE:` line. Its `TEST` field always reads `NOT RUN`, it names the registry's callers, and the Integration ID table is gone.

### Phase 14: prompt-improver-model-eligibility

| Finding | Outcome | Evidence (`scratch/after.txt`, `scratch/opus-probe.txt`) |
|---------|---------|-------------------------------|
| prompt-improver-1 | Fixed, outcome A. The T007 probe reproduced the refusal on Opus with no model. Section 0.1 is one backstop paragraph, the skill holds the table and the cli-jev sentence, both workflows pass `model=sonnet`, and the fork pins `model: sonnet` | deny rows: agent exit 1, skill 2; `5:model: sonnet`; 1 per workflow, both parse; explicit-Sonnet re-probe returns `FRAMEWORK: default skeleton ...` |
| prompt-improver-2 | Fixed. `TEST: NOT RUN` in the agent and the skill's output block; VALIDATE records `TEST` as `NOT RUN`; the thorough branch drops the quick test | `194:TEST: NOT RUN`, `quick test` exit 1, `ran: summary` in the skill exit 1, `Quick test: NOT RUN` 1 |
| prompt-improver-3 | Fixed. `@orchestrate` and `/prompt:improve` replace the old names; the Integration Touchpoint table, the three ID columns and the three citing lines are gone; ANALYZE now names `sk-prompt/SKILL.md` | old names exit 1, `/prompt:improve` 4, `INT-` and `Integration ID` exit 1 |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/agents/prompt-improver.md` | Modify | The three findings, 400 to 361 lines |
| `.claude/agents/prompt-improver.md` | Regenerate | Canonical body from the H1, its own path line kept, and `model: sonnet` |
| `.pi`, `.codex`, `.dsh` copies | Regenerate | The three sync scripts, one file each |
| `.skilled/skills/sk-prompt/SKILL.md` | Modify | Canonical home of the table, the cli-jev sentence, `TEST: NOT RUN`, version 4.0.5.0 |
| `.skilled/skills/sk-prompt/changelog/v4.0.5.0.md` | Create | The entry, shape check `pass=1 fail=0` |
| `.skilled/commands/prompt/assets/prompt_improve_{auto,confirm}.yaml` | Modify | `model=sonnet` on the AGENT dispatch |
| `.skilled/agents/README.txt`, `.skilled/bin/agent-mirror-crosswalk.md` | Modify | Name the Claude pins, `prompt-improver` among them |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The T007 probe ran first, before any edit. DeepSeek V4.1 Flash at `--thinking max` through cli-pi then made four serial single-task edits to the agent. The conductor read the diff and restored one dropped "and". It then did the skill, workflows, pin lists, changelog, fork and syncs. The fork regen matched HEAD except the fork's own `.skilled/agents/*.md` path line, which was kept.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The backstop returns the blocked package with `REFUSE:` at the start of `ESCALATION_NOTES` | Both workflows capture the seven fields, so a bare refusal string would leave them nothing to read |
| The cli-jev sentence moved into the skill | It explained the table's route list and would otherwise have been lost with section 0.1 |
| ANALYZE names `.skilled/skills/sk-prompt/SKILL.md` | The deleted `INT-SKILL-PROMPT-IMPROVER` row said "read before composing", and the backstop points at the skill's table |
| T013 (outcome B) skipped | The operator answered A on 2026-11-14 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Every acceptance command | Each prints its stated value, `scratch/after.txt` |
| T007 probe, Opus, no model | `FRAMEWORK: BLOCKED`, quoting the Opus deny row |
| T015 probe, `model=sonnet` | A package whose first line starts `FRAMEWORK:` |
| Roster and mirrors | `agent-roster: OK`, mirror check exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fork pin is not probed.** This session resolves agents from the primary checkout, so both probes read the pre-build file. T015 proves the workflow's explicit `model=sonnet` path. A bare dispatch against the new `model: sonnet` fork needs a fresh session after merge. SC-002 is partly met.
2. **OpenCode and Pi pin no model.** A session on Opus there still reaches the backstop, which names an eligible pair.
3. **The quality card keeps the old `TEST` form.** `cli-prompt-quality-card.md:104` still shows `ran: summary of old vs new`. The file is outside this phase's file list.
4. **The crosswalk's manual-only claim is stale.** It says only a manual invocation reads a pin. The T007 probe shows a dispatch with no model also falls through to the file or parent. The line predates this phase.
<!-- /ANCHOR:limitations -->

---


