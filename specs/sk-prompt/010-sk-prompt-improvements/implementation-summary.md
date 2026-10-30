---
title: "Implementation Summary"
description: "sk-prompt v4.0.0.0 replaces DEPTH with a one-pass ten-row checklist, guards routing against pasted prompts, and ships router fixtures; two stale references were fixed in Skilled and AI Systems."
trigger_phrases:
  - "sk prompt improvements implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/010-sk-prompt-improvements"
    last_updated_at: "2026-10-30T05:32:33Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-sk-prompt-improvements"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 010-sk-prompt-improvements |
| **Completed** | 2026-10-30 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

sk-prompt now improves a prompt in one pass. DEPTH is gone. A ten-row checklist marks each row present, absent or not needed, a prompt that already passes comes back early, and every reply delivers the prompt first, then numbered open items and a change report. Routing reads only your own words, so a pasted prompt can no longer flip the mode.

### Fix sk-prompt drift and recommend improvements from a survey of other prompt improvers

The survey and two research lineages (SWE 2 and Luna) shaped REQ-002 to REQ-015. The build ran as single-file DeepSeek V4.1 Flash max briefs through cli-pi on llmgateway, each diff checked before the next brief. Per-model profiles were dropped, so the skill stays model-agnostic.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-prompt/SKILL.md` | Modified | Advisor path; one-pass pipeline, effort levels, presets, `TEST:` and `CHANGES:` lines, 3 repair cycles; v4.0.0.0 |
| `.skilled/skills/sk-prompt/references/improvement-checklist.md` | Renamed and rewritten | Was `depth-framework.md`; the checklist, early exit, effort levels, quick test, repair, change report |
| `.skilled/skills/sk-prompt/ROUTER.md` | Modified | `strip_source_prompt()` paste guard, whole-token `$command` matching, new default resource |
| `.skilled/skills/sk-prompt/references/patterns-evaluation.md` | Modified | Default skeleton and preset fit table replace scored framework selection |
| `.skilled/skills/sk-prompt/assets/*.md` (3 files) | Modified | Point at the checklist |
| `.skilled/skills/sk-prompt/benchmark/router/` | Created | `route_contract.py`, 12 fixtures, `run_fixtures.sh` |
| `.skilled/skills/sk-prompt/manual-testing-playbook/` | Modified | 14 scenarios rewritten (`depth-clear-loop/` became `checklist-pass/`), 12 files patched, index 3.0.0.0 |
| `.skilled/skills/sk-prompt/README.md`, `graph-metadata.json`, leaf manifests | Modified | Describe the checklist; depth and ricce keywords removed |
| `.skilled/skills/sk-prompt/changelog/v4.0.0.0.md` | Created | Release notes |
| `.skilled/agents/prompt-improver.md` and its Claude, Codex, Pi and Hermes copies | Modified | Checklist wording, `TEST:` and `CHANGES:` lines |
| `.skilled/commands/prompt/improve.md` and its three assets | Modified | Checkpoints after_checklist, after_draft, after_screen; effort and change lines |
| `AI Systems/.../sk-prompt-improver/SKILL.md`, `README.md` | Modified | Dropped the deleted `sk-prompt-small-model` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash max wrote each file from a short literal brief. Every result was checked with its brief's verify command plus a diff read; two sentences it got wrong (the checklist overview and the SKILL.md use-case line) were corrected by hand. Generators then rebuilt the agent, prompt, Hermes and manifest copies. Nothing is committed.

A fresh Opus review then found 4 P1 and 10 P2 issues, all reproduced before fixing. Nine more DeepSeek briefs fixed them: the router now returns `COMMAND_CONFLICT` for two disagreeing mode commands and sets aside single-quoted spans and lead-ins such as `improve:`; every file states one repair cap of 3 cycles that delivers the best version; SKILL.md and the command presentation ask only when there is no prompt and no task or mode commands conflict; the command workflows capture `TEST` and `CHANGES`. Two points were kept by design: a `$raw` token anywhere still means passthrough, and a lead-in still sets aside lines up to the next blank line, because a pasted prompt usually spans lines.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Drop DEPTH | The operator chose it, and no surveyed improver or vendor guide uses a scripted multi-round process |
| One default skeleton, seven frameworks kept as optional presets | Luna's lineage found no evidence that scoring frameworks picks better prompts, while named frameworks still help callers who ask for one |
| Repair up to 3 cycles everywhere | The skill, agent and command disagreed (one retry versus 3 cycles); one number removes the drift |
| No per-model profiles | The operator chose model-agnostic |
| Leave the vendored AI Systems copy of sk-prompt alone | Its sync belongs to that repo |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/skills/sk-prompt/benchmark/router/run_fixtures.sh` | PASS: `PASSED 19/19 fixtures` after the review fixes; the first 12 fixtures failed 8 of 12 against the HEAD router |
| `rg DEPTH` over sk-prompt (outside changelogs and old reports), the agent copies and `/prompt:improve` | PASS: no match |
| `rg -l -i "model profile|target_model"` outside changelogs and benchmark reports | PASS: no file |
| Runtime mirrors, Codex and Pi agent and prompt sync | PASS: 203, 11, 11, 39, 39 |
| `ci-skill-root-metadata.cjs` | PASS: 13 of 13 |
| Advisor probe "improve this prompt for me" | PASS: sk-prompt 0.94 |
| Live `@prompt-improver` run on Sonnet | PASS: default skeleton, CLEAR 43/50, `TEST: NOT RUN`, CHANGES, open items, length warning |
| `rg -n "sk-prompt-small-model"` over Prompt Improver; its `run_fixtures.sh` | PASS: no match; `PASSED 32/32 fixtures` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The AI Systems vendored copy of sk-prompt now differs from Skilled.** It still describes DEPTH until that repo resyncs.
2. **Older changelogs and benchmark reports still say DEPTH.** They are history and stay as written.
<!-- /ANCHOR:limitations -->

---
