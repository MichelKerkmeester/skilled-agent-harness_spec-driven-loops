---
title: "Feature Specification: sk-prompt Manual Testing Playbook + @improve-prompt → @prompt-improver Agent Rename — Phase Parent"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Phase parent for two related deliverables. Phase 001 renames the @improve-prompt agent to @prompt-improver across all 4 runtimes plus 31 active-scope reference files. Phase 002 authors a 28-scenario manual testing playbook for the sk-prompt skill conforming to sk-doc templates."
trigger_phrases:
  - "085 sk-prompt playbook and agent rename"
  - "improve-prompt to prompt-improver"
  - "sk-prompt manual testing playbook"
  - "rename improve-prompt agent"
  - "prompt-improver agent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/085-sk-prompt-testing-playbook-and-agent-rename"
    last_updated_at: "2026-05-06T15:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Both phases shipped + validated"
    next_safe_action: "Final memory save + close packet"
    blockers: []
    key_files:
      - "spec.md"
      - "001-prompt-improver-rename/spec.md"
      - "002-sk-prompt-testing-playbook/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-085"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This document is the PARENT spec for the 2-phase 085 packet.
  All planning, tasks, checklists, decisions, and continuity live in the child phase folders 001..002.
  This file declares ROOT PURPOSE, the SUB-PHASE MANIFEST, and WHAT NEEDS DONE — nothing else.
-->

# Feature Specification: sk-prompt Manual Testing Playbook + @improve-prompt → @prompt-improver Agent Rename — Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-06 |
| **Branch** | `main` |
| **Parent Spec** | `../` (skilled-agent-orchestration top-level) |
| **Parent Packet** | `skilled-agent-orchestration` |
| **Predecessor** | 084-ambiguity-window-confidence-fix |
| **Depends On** | 082-sk-improve-prompt-rename (skill rename, prerequisite for agent rename + playbook authoring) |
| **Successor** | (none yet — TBD) |
| **Handoff Criteria** | Both phases pass strict validation; agent identity rotated to `@prompt-improver` across all 4 runtimes; `manual_testing_playbook/` ships with 28 scenarios passing `validate_document.py`; final grep returns zero hits for `@improve-prompt` (agent name) outside historical scope |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two related gaps surfaced after packet 082 renamed the skill `sk-improve-prompt` → `sk-prompt`:

1. **Agent identity outlier**: `@improve-prompt` is verb-object phrasing — an outlier in the noun-form agent family (`@code`, `@review`, `@debug`, `@context`, `@deep-research`, `@deep-review`, `@orchestrate`). Renaming to `@prompt-improver` aligns with convention.

2. **Missing testing playbook**: Sibling skills with similar surface area ship `manual_testing_playbook/` directories (cli-codex 27 scenarios, sk-code 24, deep-research 41). `sk-prompt` doesn't. Operators can't run a deterministic pre-release validation battery.

### Purpose
Decompose into 2 sequential phases:

- **001-prompt-improver-rename** — Rename agent file across all 4 runtimes, rotate `@improve-prompt` → `@prompt-improver` mentions in dispatcher command body, 5 cli-* prompt_quality_card mirrors, parent SKILL.md routing tables, sk-prompt SKILL.md §7 agent contract, root README/AGENTS.md, install guides, active changelogs, advisor aliases. Direct `sed` per "CLI dispatch unreliability under heavy parallelism" memory rule.

- **002-sk-prompt-testing-playbook** — Author 28-scenario manual testing playbook at `.opencode/skills/sk-prompt/manual_testing_playbook/` via `/create:testing-playbook sk-prompt create :confirm`. 7 categories: mode-detection, smart-routing, depth-clear-loop, clear-scoring, framework-selection, escalation-tiers, format-modes.

### Why this ordering
Phase 001 (rename) executes BEFORE Phase 002 (playbook) so playbook scenarios reference the final `@prompt-improver` name throughout. Avoids double-touching the playbook surface.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level alongside the canonical lean trio (`description.json`, `graph-metadata.json`). All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders 001..002.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **Phase 001** (agent rename, ~35 active-scope files):
  - Rename 4 runtime agent files: `.opencode/agents/improve-prompt.md` → `prompt-improver.md`; `.claude/agents/improve-prompt.md` → `prompt-improver.md`; `.codex/agents/improve-prompt.toml` → `prompt-improver.toml`; `.gemini/agents/improve-prompt.md` → `prompt-improver.md`
  - Update frontmatter `name:` and `description:` fields in all 4 runtime files
  - Update body self-references inside each agent file
  - Rotate `@improve-prompt` → `@prompt-improver` mentions in: dispatcher command body `.opencode/commands/prompt.md`, 5 cli-* `prompt_quality_card.md` mirrors + parent SKILL.md routing tables, `sk-prompt/SKILL.md` §7, `sk-prompt/assets/cli_prompt_quality_card.md`, `sk-prompt/graph-metadata.json`, `sk-doc/assets/agent_template.md`, sk-code advisor probe playbook
  - Update `skill_advisor.py` if it hardcodes the agent name
  - Update root `README.md`, `AGENTS.md`, `.opencode/install_guides/`, active changelogs (`.opencode/changelog/agent-orchestration/v2.4.0.0.md`, `system-spec-kit/changelog/v3.4.0.0.md`)
  - Update agent runtime READMEs (.claude/.codex/.gemini/.opencode/agents/README.txt)
  - Update `.opencode/specs/descriptions.json` (regenerates on memory save)
  - Update `.codex/config.toml` if it references the agent

- **Phase 002** (testing playbook, ~32 new files):
  - Author `manual_testing_playbook/manual_testing_playbook.md` (root index)
  - Author 28 per-feature scenario files (SP-001..SP-028) across 7 numbered category folders
  - Conform to sk-doc contract: 5 mandatory sections per scenario, snippet template, validator-passing root
  - Add ONE `## RELATED PLAYBOOK` link to `sk-prompt/SKILL.md` Section 10 (no inline backrefs — 500 LOC cap)

### Out of Scope (at the parent level)
- Behavior changes to the agent or skill — both renames + playbook are read-only on logic
- Renaming the dispatcher command `/prompt` or its file (only body's agent ref changes)
- Renaming the skill `sk-prompt` (already done in 082)
- Updating committed git log messages (historical record)
- Updating frozen-continuity scope (z_archive, z_future, completed packets {054, 055, 061, 063, 067, 070, 079, 081, 082, 026-graph}, .git)
- Migrating `barter/coder/` mirror (out of scope per user instruction)
- Renaming sibling agent `@improve-agent` (potential follow-on packet)
- Editing `.claude/CLAUDE.md` (user global, out of repo scope)

### Files to Change (per-phase blast radius)

| Phase | Folder | Estimated active-scope file count | Risk |
|-------|--------|-----------------------------------|------|
| 001 | `001-prompt-improver-rename/` | 4 file renames + ~31 reference updates | Medium (cross-cutting agent identity) |
| 002 | `002-sk-prompt-testing-playbook/` | 1 root index + 28 scenario files + 1 SKILL.md link | Low (additive, no source rotation) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | [001-prompt-improver-rename/](./001-prompt-improver-rename/) | Rename @improve-prompt → @prompt-improver via 4 runtime renames + direct-sed reference rotation across ~31 active-scope files | Complete |
| 002 | [002-sk-prompt-testing-playbook/](./002-sk-prompt-testing-playbook/) | Author 28-scenario manual testing playbook via /create:testing-playbook command using sk-doc templates | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` before the next begins
- Phase 001 completes BEFORE Phase 002 (playbook references final agent name `@prompt-improver`)
- After Phase 001: run `mcp__spec_kit_memory__advisor_rebuild` to refresh advisor signals if any aliases changed
- Phase 002 references @prompt-improver throughout (zero @improve-prompt in new playbook content)

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | All 4 agent files renamed; frontmatter `name:` rotated; ~31 reference files updated; `rg -l '@improve-prompt' .opencode .claude .codex .gemini` (active scope) returns 0; advisor probes still resolve | `ls .opencode/agents/prompt-improver.md` succeeds; `rg -l 'improve-prompt' --glob '!historical'` returns 0 in active scope |
| 002 | (done) | 28 scenario files exist + linked from root; `validate_document.py` exit 0; forbidden-sidecar grep returns 0; sk-prompt SKILL.md has §RELATED PLAYBOOK link | Strict validate parent + 2 children PASS; advisor probe `"improve my prompt"` still routes to sk-prompt; manual probe of SP-001 against renamed `@prompt-improver` agent works end-to-end |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should sibling agent `@improve-agent` also be renamed (e.g., `@agent-improver`) for consistency? Out of scope for 085; potential follow-on packet.
- Does `skill_advisor.py` hardcode the agent name as an alias or phrase booster? Phase 001 audit will confirm.
- Are there any cocoindex-indexed entries pointing at the old agent file name? May need re-index post-rename (deferred to memory save step).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `001-prompt-improver-rename/` and `002-sk-prompt-testing-playbook/`
- **Parent Spec**: See `../` (skilled-agent-orchestration)
- **Predecessor (rename family)**: `082-sk-improve-prompt-rename/` — same shape (skill rename); 085 phase 001 mirrors its sed-based mechanical rotation pattern
- **Predecessor (rename family, broader)**: `070-sk-deep-rename/` — 6-phase decomposition for sk-deep-* family rename
- **sk-doc templates**: `.opencode/skills/sk-doc/assets/testing_playbook/` (root + snippet templates for Phase 002)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
