---
title: "Implementation Summary: cli-external-orchestration"
description: "Adds conversation-level Pi coverage for dispatch preflight authorization and records the live-run result."
trigger_phrases:
  - "cli external orchestration implementation summary"
  - "dispatch preflight authorization live run"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/004-conversation-adoption-build/013-cli-external-orchestration"
    last_updated_at: "2026-11-03T07:07:12Z"
    last_updated_by: "codex"
    recent_action: "Closed the phase from recorded live-run evidence."
    next_safe_action: "Continue with Phase 14 using its own evidence."
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "scratch/live-runs/closeout-evidence.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-cli-external-orchestration |
| **Status** | Complete |
| **Completed** | 2026-11-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Dispatch preflight now has a conversation companion that checks denial when the executor is unnamed and acceptance after a follow-up names it. The live Pi run shows both checks pass without changing the repository or leaving a run session behind.

### Dispatch Preflight Authorization

The companion covers the deny-then-allow sequence for cli-codex. The package index includes the companion so the validator checks it with the other scenarios.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization-conversation.md | Created | Adds the two-turn authorization conversation. |
| .skilled/skills/cli-external-orchestration/manual-testing-playbook/manual-testing-playbook.md | Modified | Adds the companion to the package index. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The package validator returned PASS with 0 violations and 0 warnings. The orchestrator ran the scenario through three rounds in a detached worktree. The final round passed. Existing ignored build outputs were copied from the main checkout into the worktree; nothing was installed or rebuilt.

### Live Run

| Scenario | Runtime | Verdict | Turns | repo.changed | cleanup.ok | Finished UTC |
|----------|---------|---------|-------|--------------|------------|--------------|
| plugins-and-hooks__cli-dispatch-preflight-authorization-conversation | pi | PASS | deny-unnamed-executor: PASS; allow-named-executor: PASS | false | true | 2026-11-03T06:58:30.084Z |

### Fix Rounds

1. Round 1 failed because Pi treated 2>&1 as unsupported and denied the named dispatch as ambiguous. The fix removed 2>&1, required the missing-executor denial in the first-turn check, and explained file-descriptor duplication.
2. Round 2 failed with an unexpected question. The fix added an optional answer selecting Drop.
3. Round 3 passed. Both turns passed in the recorded result.json.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Record the cli-codex redirect conflict as a finding. | The phase covers the conversation scenario. The skill recommendation is outside this phase's implementation scope. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Package validator | PASS; 0 violations and 0 warnings. |
| Recorded Pi live run | PASS; 2 of 2 turns passed, repo.changed was false, and cleanup.ok was true. |
| Phase strict validation | PASS; printed RESULT: PASSED with 0 errors and 0 warnings; exit 0. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The cli-codex redirect recommendation remains a recorded finding.** cli-codex/SKILL.md:180 recommends a command with a 2>&1 redirect. The Pi preflight tokenizer rejects that redirect as ambiguous. The skill-specific follow-up owns any correction.
<!-- /ANCHOR:limitations -->
