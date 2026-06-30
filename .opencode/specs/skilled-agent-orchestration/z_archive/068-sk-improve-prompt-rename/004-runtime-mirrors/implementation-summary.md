---
title: "Implementation Summary: Phase 004 Runtime Mirrors"
description: "Rotated 31 sk-improve-prompt → sk-prompt references across 5 runtime mirror files (.claude, .codex, .gemini agent body refs and Gemini command files). Agent name @improve-prompt and command /prompt unchanged — only loaded skill name changed."
trigger_phrases:
  - "082 phase 004"
  - "runtime mirror rotation"
  - "claude codex gemini agent body refs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/068-sk-improve-prompt-rename/004-runtime-mirrors"
    last_updated_at: "2026-05-06T13:35:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 004 rotation complete (5 files)"
    next_safe_action: "Phase 005 root and config"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-082-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-runtime-mirrors |
| **Completed** | 2026-05-06 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Five runtime mirror files now reference the renamed skill `sk-prompt` instead of `sk-improve-prompt`. The agent identity `@improve-prompt` and command identity `/prompt` stay exactly the same — only the body text that loads the skill changed. Cross-runtime users (Claude, Codex, Gemini) all dispatch to a single canonical skill name.

### Runtime mirror updates

The .claude, .codex, and .gemini agent files each carried 9 references to the old skill name. Two Gemini command files added another 4 between them. After this phase a fresh `rg 'sk-improve-prompt' .claude/ .codex/ .gemini/` returns zero hits.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.claude/agents/improve-prompt.md` | Modified (9 refs) | Agent body refs to renamed skill |
| `.codex/agents/improve-prompt.toml` | Modified (9 refs) | Codex agent body refs (TOML preserved) |
| `.gemini/agents/improve-prompt.md` | Modified (9 refs) | Gemini agent body refs |
| `.gemini/commands/deep/start-agent-improvement-loop.toml` | Modified (2 refs) | Gemini command README link refs |
| `.gemini/commands/create/prompt.toml` | Modified (2 refs) | Gemini create command skill path embed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Direct `sed -i '' 's/sk-improve-prompt/sk-prompt/g'` per file under heavy parallel-orchestration constraints (per the new memory rule on CLI dispatch unreliability). TOML files validated via Python `toml` module after rotation. Final scoped grep confirmed zero residuals across the three runtime trees.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use direct sed instead of cli-codex dispatch | Memory rule "CLI dispatch unreliability under heavy parallelism" — prefer mechanical Edit/sed when 2+ codex sessions are active. Mechanical replace is deterministic. |
| Preserve agent file names + command file names | Renaming the skill does NOT rename the agent or command — those keep `@improve-prompt` and `/prompt` identity. Only the loaded skill's name changes. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `rg -c 'sk-improve-prompt'` per file | 0 across all 5 files |
| TOML syntax (`python3 -c "import toml; toml.load(...)"`) | OK for both .toml files |
| `rg -l 'sk-improve-prompt' .claude .codex .gemini` | 0 hits |
| Strict validate phase folder | PASS (run during Phase 006 batch) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **None identified.** Rotation is a pure semantic rename with no behavior change.
<!-- /ANCHOR:limitations -->

---
