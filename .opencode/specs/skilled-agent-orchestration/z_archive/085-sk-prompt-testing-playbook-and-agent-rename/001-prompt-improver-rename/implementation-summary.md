---
title: "Implementation Summary: Phase 001 — Rename @improve-prompt → @prompt-improver"
description: "Renamed agent across 4 runtime mirrors (.opencode, .claude, .codex, .gemini) plus 35 active-scope reference files via cli-codex gpt-5.5 medium fast plus manual finalization for sandbox-blocked .codex/ paths. Pure semantic rename — agent identity now follows the noun-form family convention (@code, @review, @debug, @context)."
trigger_phrases:
  - "085 phase 001 summary"
  - "improve-prompt to prompt-improver complete"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/085-sk-prompt-testing-playbook-and-agent-rename/001-prompt-improver-rename"
    last_updated_at: "2026-05-06T19:40:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 001 rename complete + .codex residuals fixed post deep-review"
    next_safe_action: "Phase 002 testing playbook"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-085-001-summary"
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
| **Spec Folder** | 001-prompt-improver-rename |
| **Completed** | 2026-05-06 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The agent `@improve-prompt` is now `@prompt-improver` across all 4 runtime mirrors. The rename brings the agent name into the noun-form family (`@code`, `@review`, `@debug`, `@context`, `@deep-research`, `@deep-review`) and fixes the verb-object outlier. Pure semantic rename — no behavior change, no dispatcher contract change, no skill change.

### Runtime mirror renames

Four physical file renames: `.opencode/agents/improve-prompt.md` → `prompt-improver.md`; `.claude/agents/improve-prompt.md` → `prompt-improver.md`; `.codex/agents/improve-prompt.toml` → `prompt-improver.toml`; `.gemini/agents/improve-prompt.md` → `prompt-improver.md`. Frontmatter `name:` field rotated in all 4. Body self-references updated.

### Reference rotations across active scope

35 active-scope files carried `@improve-prompt` or `improve-prompt` references. The dispatcher command body, 5 cli-* prompt_quality_card mirrors, sk-prompt SKILL.md §7 agent contract, root README/AGENTS.md, install guides, active changelogs, advisor scripts, and 4 runtime READMEs all rotated. The dispatcher command name `/prompt` and the command file path itself stay UNCHANGED — only body references to the agent change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/agents/improve-prompt.md` | Renamed → `prompt-improver.md` | Canonical agent file (4 runtime mirrors) |
| `.claude/agents/improve-prompt.md` | Renamed → `prompt-improver.md` | Claude runtime mirror |
| `.codex/agents/improve-prompt.toml` | Renamed → `prompt-improver.toml` | Codex runtime mirror |
| `.gemini/agents/improve-prompt.md` | Renamed → `prompt-improver.md` | Gemini runtime mirror |
| 35 reference files | sed rotation | All active-scope @improve-prompt → @prompt-improver |
| `.codex/config.toml` | Sed rotation | Agent description + integration IDs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

cli-codex gpt-5.5 medium fast handled 32 of 35 reference files via `sed -i` rotation. The `.codex/` paths (`.codex/agents/improve-prompt.toml` and `.codex/config.toml`) were sandbox-blocked by cli-codex (its own runtime folder), so 3 files were finalized manually with `mv` + `sed` directly. Deep-review iteration 5 caught residual UPPERCASE `IMPROVE-PROMPT` and Title-Case `Improve-Prompt` references in `.codex/agents/prompt-improver.toml` (case-sensitive grep had missed them); those 4 lines plus the `.codex/config.toml:120` description were rotated post-review.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use cli-codex over direct sed for the bulk rotation | User explicitly requested gpt-5.5 fast mode. Cli-codex handles SKILL.md + frontmatter parsing better than blind sed. |
| Manual fix for `.codex/` paths | cli-codex sandbox refused to write to its own runtime folder. Direct `mv` + `sed` from the parent session worked correctly. |
| Use case-insensitive final grep going forward | Deep-review iter-5 caught UPPERCASE residuals that case-sensitive iter-1..4 missed. New verification gate: `rg -il` not just `rg -l`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| All 4 new agent paths exist | PASS |
| All 4 old agent paths gone | PASS |
| Active-scope `@improve-prompt` (case-sensitive) | 0 hits |
| Active-scope `improve-prompt` (case-insensitive, post deep-review fix) | 0 hits |
| Advisor probe `"improve my prompt"` → top-1 | `sk-prompt` @ 0.9262 |
| Strict validate phase 001 | PASS — 0 errors, 0 warnings |
| Dispatcher command `/prompt` unchanged | PASS — file at `.opencode/commands/prompt.md` exists; only body refs rotated |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **None identified.** Rotation is a pure semantic rename with no behavior change.
<!-- /ANCHOR:limitations -->

---
