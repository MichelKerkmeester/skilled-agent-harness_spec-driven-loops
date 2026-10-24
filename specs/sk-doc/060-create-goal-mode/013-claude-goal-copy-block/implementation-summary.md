---
title: "Implementation Summary"
description: "On Claude Code the goal chat slice is now sent as one fenced code block that holds the slice and nothing else, so the operator copies it into /goal whole. The rule has one full statement and short repeats at each send point."
trigger_phrases:
  - "claude goal copy block implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/013-claude-goal-copy-block"
    last_updated_at: "2026-10-24T16:17:09Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Added the Claude Code fenced-block rule to every goal send surface and two playbook scenarios"
    next_safe_action: "Commit when asked, then re-run CC-029 against a live Claude Code session"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md"
      - "AGENTS.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-claude-goal-copy-block"
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
| **Spec Folder** | 013-claude-goal-copy-block |
| **Completed** | 2026-10-24 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

On Claude Code you now get the goal's chat slice as one fenced code block. You click the copy button and paste byte-exact text into `/goal`, and markdown rendering cannot alter it.

### Phase 13: claude-goal-copy-block

Claude Code sets a goal when you type the native `/goal` command. Before this phase the agent sent the slice as plain chat text, so you had to select it by hand. The new rule says the block holds the slice and nothing else, with no prose inside the fence. The agent picks a fence longer than any backtick run in the slice, so a slice that holds three backticks opens with four or more backticks or with `~~~`.

Everything else about the send is unchanged. The agent still sends only the `chat_slice` that `goal.cjs packet` prints, only at `packet_budget=ok`, and never frontmatter, comments, anchors, dividers, section numbers or template instructions. The fence is presentation around the slice and adds no content. Only Claude Code takes the rule. The Codex matrix row now says it does not.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | One sentence in the goal posture rule: "On Claude Code, send the slice inside one fenced code block that holds the slice and nothing else, with a fence the slice cannot break, so the operator can copy it into `/goal` whole." |
| `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md` | Modified | Full rule in section 4, Claude Code matrix row extended, Codex row says it takes no fence |
| `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md` | Modified | Resend step: "On Claude Code, send it as one fenced code block that holds the slice and nothing else." |
| `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml`, `speckit-complete.yaml` | Modified | `bind_by_runtime.claude-code` and `resend.payload` carry the rule |
| `.skilled/commands/speckit/assets/speckit-resume-auto.yaml`, `speckit-resume-confirm.yaml` | Modified | Resend reminder carries the rule |
| `.skilled/commands/create/assets/create-goal-auto.yaml`, `create-goal-confirm.yaml` | Modified | `step_print_slice` prints the slice as one fenced block on Claude Code |
| `.skilled/commands/create/assets/create-goal-presentation.txt` | Modified | The fenced block replaces the dividers on Claude Code |
| `.skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md` and `manual-testing-playbook.md` | Modified | CC-029 gains a command and a pass criterion for the rule |
| `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/top-level-goal.md` | Modified | SCG-001 gains a pass and fail criterion for the rule |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The edits are text only. The seven changed YAML files were parsed, each changed `.md` file went through `validate_document.py` and both touched playbook packages went through `validate-playbook-package.cjs`. Nothing is committed. The doc `version` lines are left alone because the commit gate raises them when the body changes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the rule to Claude Code | The operator named only Claude Code, and Codex shares the host-command handoff but was not asked for the fence |
| Point the hooks README and `goal-plugin.md` at the existing rule | They describe the host contract and already defer to `AGENTS.md` and `budget-and-handoff.md` section 4 |
| Put the full rule in `budget-and-handoff.md` section 4 | Phase 012 made that section the one home for what a sent goal contains |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| YAML parse of the seven changed files (`yaml.safe_load`) | PASS, 7 of 7 |
| `validate_document.py` on each changed `.md` file | PASS, 0 issues, `AGENTS.md` skipped by design, the CC root playbook keeps its one `document_type_fallback` warning, which HEAD also reports |
| `validate-playbook-package.cjs` on `cli-claude-code` and `sk-create-goal` | PASS, exit 0, 0 violations |
| `validate.sh` on this folder with `--strict` | PASS, `RESULT: PASSED`, Errors 0, Warnings 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fence is a rule for the agent, not a check.** No script tests it. CC-029 checks that the docs state it, and a live Claude Code session shows it, so re-run that check after a host upgrade.
2. **Codex is unchanged.** It still receives the slice as before until the operator asks for the same fence.
<!-- /ANCHOR:limitations -->

---


