---
title: "Implementation Summary: Phase 4: agent-authoring-registry-step"
description: "The agent authoring workflow now tells an author to add a registry record before the roster check runs, and quotes the error the check prints without one."
trigger_phrases:
  - "agent authoring registry step implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/007-agent-alignment-follow-ups/004-agent-authoring-registry-step"
    last_updated_at: "2026-11-14T16:33:16Z"
    last_updated_by: "generate-context"
    recent_action: "Added the registry step to the agent creation workflow"
    next_safe_action: "Review the new step and decide whether to merge the branch"
    packet_purpose: "Purpose: An author who follows the creation workflow in order adds the registry record before the check, and the check passes."
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/sk-create-agent/SKILL.md"
      - ".skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md"
    session_dedup:
      fingerprint: "sha256:aefbe247e48a9990ebc314c51b594aff810df0eb2bc89e0b686bcc9b778c15cb"
      session_id: "scaffold-004-agent-authoring-registry-step"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "3eadb8bc-945b-4a2e-8183-a55e83f9e728"
      workspace: "/Users/michelkerkmeester/worktrees/public/384-agent-alignment-follow-ups"
      savedAt: "2026-11-14T16:33:16Z"
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
| **Spec Folder** | 004-agent-authoring-registry-step |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An author who follows the ordered creation workflow in `sk-create-agent/SKILL.md` now adds the registry record before running the roster check. Before this change the workflow named the check and never named the registry, so a new agent file ended on `agent file without a registry record: <name>` with nothing in the skill to explain it.

### Phase 4: agent-authoring-registry-step

Step 13 is new. It tells the author to add a record to `.skilled/agents/agent-registry.json` by copying an existing one, names the eight fields a record carries plus `templateExceptions`, and says to run `node .skilled/bin/sync-agent-roster.cjs` so the generated rosters pick the agent up. The validation step moved to 14 and now quotes the error text. Delivery is step 15.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-agent/SKILL.md` | Modified | The new step 13, the error text in step 14, the renumbered step 15 and the version, 1.0.7.0 to 1.0.8.0 |
| `.skilled/skills/sk-doc/sk-create-agent/changelog/v1.0.8.0.md` | Created | The release entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrating session computed the expected content of both files first. DeepSeek V4.1 Flash at max, through `cli-opencode` on the LLM Gateway route with OpenCode 1.19.4, wrote each from a brief that held the literal text. Each was accepted only when the file equalled its expected file byte for byte. The changelog was accepted on the first run. The first dispatch for `SKILL.md` printed nothing for five minutes, so the session stopped that one process and dispatched the same brief again, which was accepted.

The session then followed the new step itself with a throwaway agent file and record, watched the check fail and then pass, and removed both.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A new step before validation, not a sentence in the validation step | The record has to exist before the check runs, and the order of the steps is the instruction |
| The step names `templateExceptions` as well as the eight fields | Four of the eleven records carry it, and the check fails an agent file that leaves out a required section without one |
| The roster script was not changed to create a record | A record carries a task type, a tier and dispatchers that only the author can decide |
| The packet version went to 1.0.8.0 with a changelog entry | The versioning standard anchors a mode packet's `SKILL.md` to its own newest changelog entry, and the commit gate never touches `SKILL.md` |
| The `/create:agent` workflow assets were not changed | They do not restate the skill's steps, and changing them was out of scope. The gap is reported below |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -c 'agent-registry'` on the skill file | 1, no line before |
| `rg -c 'agent file without a registry record'` on the skill file | 1 |
| Roster check with the throwaway file and no record | `agent file without a registry record: zz-probe`, exit 1 |
| Roster check with the record added and the rosters rewritten | `agent-roster: OK`, exit 0 |
| After removal | `agent-roster: OK`, the registry and `README.txt` show no diff, and a search for `zz-probe` found nothing |
| Version and newest changelog entry | `1.0.8.0` and `v1.0.8.0.md` |
| `frontmatter-version.mjs verify --skill sk-doc` | `364 files`, `ok=357`, 7 skipped for having no frontmatter, exit 0 |
| `ci-hub-vocabulary-source.cjs --hub sk-doc` | `drift=6`, `RESULT: FAILED`, exit 1. The same on the commit before the edit, so the change adds no drift |
| Each file against its expected file, `cmp` | Identical |
| Strict validation of this folder | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The hub's vocabulary check fails, and did before this phase.** Six `hub-router.json` terms have no `ROUTER.md` intent, two of them for `sk-create-agent`. This phase changed neither file. The fix belongs to the packet that owns the hub's routing vocabulary.
2. **`/create:agent` still does not add a registry record.** Its two workflow assets run their own six steps and never name the registry or run the roster check. An agent made through the command alone can still fail the check.
3. **The step lists the fields by name.** If the registry gains a field, the step goes stale. It tells the author to copy an existing record, which stays correct.
4. **The probe used a copy of `context.md`.** It shows a file with a record passes. It does not test an agent with a new outline or new skill paths.
<!-- /ANCHOR:limitations -->

---
