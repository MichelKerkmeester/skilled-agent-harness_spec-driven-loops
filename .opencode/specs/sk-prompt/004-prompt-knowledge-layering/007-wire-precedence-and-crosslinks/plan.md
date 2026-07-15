---
title: "Implementation Plan: Phase 7 — Wire precedence + crosslinks"
description: "Read all 5 cli-* SKILL.md files, insert an identical 3-tier prompt-composition precedence block in each, reconcile the cli-devin mandate, replace the canonical card's stale Mirror Sync section with a duplication-guard, and repoint pattern-index.md rows to hub profiles."
trigger_phrases:
  - "wire precedence plan"
  - "crosslinks plan"
  - "3-tier precedence implementation plan"
importance_tier: "normal"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/004-prompt-knowledge-layering/007-wire-precedence-and-crosslinks"
    last_updated_at: "2026-06-02T18:04:15Z"
    last_updated_by: "agent"
    recent_action: "Plan completed — all phases done"
    next_safe_action: "Proceed to phase 008-validate-sweep-changelog-reindex"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:38fe68bc403651b05e50bebfeb0c4b0a661aede11c5927a95189818c2d58772d"
      session_id: "007-wire-precedence-and-crosslinks-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7 — Wire precedence + crosslinks

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (SKILL.md doc edits) |
| **Framework** | OpenCode skill layer |
| **Storage** | None |
| **Testing** | Manual read-back + validate.sh --strict |

### Overview
This phase inserted an identical 3-tier prompt-composition precedence block into all 5 cli-* SKILL.md files so that every dispatch context observes the same decision order: fast path, hub-profile model override, and sk-prompt deep path. The cli-devin bespoke mandate was narrowed to coexist with the hub lookup, the sk-prompt-models canonical card's dead Mirror Sync section was replaced with a duplication-guard description, and the pattern-index.md rows for MiniMax and MiMo were repointed to hub profile files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-only edit pass — no runtime code changes.

### Key Components
- **3-tier precedence block**: The shared Markdown block inserted into each cli-* SKILL.md. Defines fast path, model-override (hub), and deep-path tiers in fixed order.
- **cli-devin mandate reconciliation**: Narrowing of the "MUST compose through sk-prompt" language so it defers to the hub profile when one exists.
- **Duplication-guard description**: Replacement text in sk-prompt-models SKILL.md that states the hub profile is the single source of truth.
- **pattern-index.md hub repoint**: Row-level edits that replace fragmented framework-note references with canonical hub profile paths.

### Data Flow
Callers read a cli-* SKILL.md to determine prompt-composition rules. The 3-tier block in each file directs them to the sk-prompt-models hub at tier 2, which holds the per-model profile. The pattern-index.md serves as a quick-reference lookup that now resolves to the same hub profiles.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| cli-devin/SKILL.md | Defines dispatch rules for Devin | Insert 3-tier block, narrow compose mandate | Read-back after edit |
| cli-opencode/SKILL.md | Defines dispatch rules for OpenCode | Insert 3-tier block, update ownership cell | Read-back after edit |
| cli-claude-code/SKILL.md | Defines dispatch rules for Claude Code | Insert 3-tier block | Read-back after edit |
| cli-codex/SKILL.md | Defines dispatch rules for Codex | Insert 3-tier block | Read-back after edit |
| cli-gemini/SKILL.md | Defines dispatch rules for Gemini | Insert 3-tier block | Read-back after edit |
| cli-devin/references/prompt_templates.md | Holds bespoke compose mandate | Reconcile to 3-tier rule | Read-back after edit |
| sk-prompt-models/SKILL.md | Canonical hub card | Replace Mirror Sync with duplication-guard | Grep for "Mirror Sync" returns empty |
| sk-prompt-models/references/pattern-index.md | Quick-reference index | Repoint MiniMax/MiMo rows; update cli-opencode cell | Read-back after edit |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read all 5 cli-* SKILL.md files and prompt_templates.md to locate insertion points and existing guidance
- [x] Read sk-prompt-models SKILL.md and pattern-index.md to locate Mirror Sync section and hub-profile row targets

### Phase 2: Core Implementation
- [x] Insert identical 3-tier precedence block into cli-devin/SKILL.md and reconcile mandate
- [x] Insert identical 3-tier precedence block into cli-opencode/SKILL.md and update ownership cell
- [x] Insert identical 3-tier precedence block into cli-claude-code, cli-codex, cli-gemini SKILL.md files
- [x] Reconcile cli-devin/references/prompt_templates.md
- [x] Replace stale Mirror Sync section in sk-prompt-models SKILL.md with duplication-guard
- [x] Repoint pattern-index.md rows and update cli-opencode ownership cell

### Phase 3: Verification
- [x] Read-back each edited file to confirm changes are correct and consistent
- [x] Run validate.sh --strict on the 007 spec folder — exit 0 confirmed
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual read-back | Each edited SKILL.md and reference file | Read tool |
| Structural validation | 007 spec folder | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 — thinned cli-* cards | Internal | Green | Baseline for insertion points |
| sk-prompt-models hub profiles (references/models/) | Internal | Green | Required for valid pattern-index repoint |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any cli-* SKILL.md rendered unparseable or validate.sh returning exit 2
- **Procedure**: Revert the affected SKILL.md to the pre-edit state via git checkout; re-apply the 3-tier block edit only
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
