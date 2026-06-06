---
title: "Feature Specification: cross-skill propagation — cli-opencode eviction + sk-prompt budget awareness"
description: "Phase E of 114 roadmap. Propagate context-budget patterns from cli-devin (Phase C) to cli-opencode (eviction support) and sk-prompt (budget awareness guidance). Optional 2-stage routing port deferred or dropped."
trigger_phrases:
  - "cross-skill propagation"
  - "cli-opencode eviction"
  - "sk-prompt budget awareness"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/006-budget-pattern-propagation"
    last_updated_at: "2026-05-18T15:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 006 spec.md L2"
    next_safe_action: "Author 006 plan.md"
    blockers: []
    key_files:
      - "../004-cli-devin-quality/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000025"
      session_id: "114-006-spec-init"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Drop 2-stage routing packet or implement as P4 follow-on?"
    answered_questions:
      - "Propagation source is cli-devin Phase C; cli-opencode is the destination"
---

# Feature Specification: cross-skill propagation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase E of 114 roadmap. Propagate the context-budget patterns from cli-devin Phase C to cli-opencode (eviction support for larger-context models like DeepSeek-v4-pro / Kimi-k2.6) and sk-prompt (budget-awareness composition guidance in cli_prompt_quality_card.md). 2-stage tool routing port from smallcode is deferred or dropped per research iter-011 verdict (overlaps mcp-code-mode). Effort: ~6-12 hours.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P3 |
| **Status** | Implemented |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | 004-cli-devin-quality |
| **Successor** | (none planned) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase C lands the budget engine in cli-devin only. cli-opencode dispatches to larger-context models (DeepSeek-v4-pro 64k, Kimi-k2.6 200k) but has no eviction or truncation hints. sk-prompt's cli_prompt_quality_card.md doesn't mention budget awareness. These gaps reduce the value of Phase C's patterns.

### Purpose

Mirror the budget-engine reference doc + truncation-marker syntax to cli-opencode, and add a "budget awareness" subsection to sk-prompt's cross-CLI quality card.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- New reference doc `cli-opencode/references/context-budget.md` (mirrors Phase C's cli-devin doc, adapted for larger-context models)
- Update `cli-opencode/assets/prompt_templates.md` (if exists; otherwise note as not applicable) with truncation marker
- Update `sk-prompt/assets/cli_prompt_quality_card.md` §3 with "Budget Awareness" subsection
- Update `sk-small-model/references/pattern-index.md` with 2 new rows

### Out of Scope

- Full 2-stage tool routing port (deferred — research iter-011 verdict: overlaps mcp-code-mode, low ROI)
- cli-opencode agent dispatch surface changes (no recipe modifications needed)
- New model entries in per-model-budgets.json (5/8 phase covers cli-opencode-relevant models)

### Files to Change

| Path | Change |
|------|--------|
| `cli-opencode/references/context-budget.md` | Create |
| `cli-opencode/assets/prompt_templates.md` | Modify (if exists) |
| `sk-prompt/assets/cli_prompt_quality_card.md` | Modify |
| `sk-small-model/references/pattern-index.md` | Modify (2 rows) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | cli-opencode/references/context-budget.md exists with mirrored patterns from cli-devin equivalent | grep audit |
| REQ-002 | sk-prompt cli_prompt_quality_card.md §3 has "Budget Awareness" subsection | grep audit |
| REQ-003 | sk-small-model pattern-index has 2 new rows | grep audit |

### P1

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-004 | cli-opencode prompt_templates.md (if exists) includes truncation marker syntax | grep audit |
| REQ-005 | Reference doc cites cli-devin/references/context-budget.md as source-of-truth | grep audit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: cli-opencode dispatches show truncation markers in tool results when budget exceeded (manual smoke test)
- **SC-002**: sk-prompt cli_prompt_quality_card.md surfaces budget guidance to readers
- **SC-003**: Pattern index has 2 new rows discoverable via search
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Mirrored doc drifts from cli-devin source-of-truth | M | Doc says "see cli-devin/references/context-budget.md for canonical patterns" |
| Dependency | 004 shipped | High | Block until 004 merged |
| Risk | cli-opencode has no agent-config recipe surface (different from cli-devin) | M | Reference doc only; no recipe edits |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability

- **NFR-M01**: Mirrored doc references the canonical source (cli-devin) not duplicates content
- **NFR-M02**: Stays under 200 LOC (sentinel-style pointer doc)
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- cli-opencode prompt_templates.md doesn't exist or is fragmentary: note in implementation-summary and skip the prompt-template update without failing
- 2-stage routing decision (drop vs defer): documented in this packet's questions; final call made at implementation time
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 4 files; mostly docs |
| Risk | 4/25 | Pure docs change, no runtime impact |
| Research | 2/20 | Patterns already validated in Phase C |
| **Total** | **12/70** | **Level 2** (small) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- 2-stage tool routing port: drop entirely (per iter-011 verdict) or keep as P4 future-work packet?
- Should cli-opencode/references/context-budget.md include cli-opencode-specific model context windows (DeepSeek-v4-pro 64k, Kimi-k2.6 200k) or just point at the registry from Phase D?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase parent**: `../spec.md`
- **Predecessor**: `../004-cli-devin-quality/spec.md`
- **Research**: `../001-research-smallcode/research/research.md` §RQ1 + iter-011 (drops)
- **Sibling docs**: plan.md, tasks.md, checklist.md, implementation-summary.md
