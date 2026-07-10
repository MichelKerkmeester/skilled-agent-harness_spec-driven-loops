---
title: "Feature Specification: OpenCode plugins + Claude hooks remediation"
description: "Phase-parent for fixing all 108 findings from the plugins/hooks audit (packet 127); per-plugin fix plans in child phase folders."
trigger_phrases:
  - "opencode plugins remediation"
  - "plugin hooks fixes"
  - "opencode plugin bug fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation"
    last_updated_at: "2026-07-10T09:27:08.451Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Planned 108 fixes across 7 plugin children"
    next_safe_action: "Implement per-plugin P1 fixes first"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-spec-memory.js"
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/plugins/mk-code-graph.js"
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/plugins/mk-deep-loop-guard.js"
      - ".opencode/plugins/mk-dist-freshness-guard.js"
      - ".opencode/plugins/session-cleanup.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: OpenCode plugins + Claude hooks remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | skilled-agent-orchestration |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The audit (packet 127) found 108 confirmed issues across the 7 OpenCode plugins and their Claude hook versions. None are fixed yet.

### Purpose
A per-plugin fix plan: every finding becomes an ordered, verifiable task so remediation ships plugin-by-plugin. This packet plans the fixes; implementation is a follow-up.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. Per-plugin fix plans live in the child phase folders below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fixing every confirmed finding in all 7 plugins and their Claude hook versions
- Baseline + parity verification per plugin

### Out of Scope
- Findings refuted by the iteration-2 cross-check
- Net-new plugin behavior

### Fix Rollup

108 fixes planned - 42 P1 / 40 P2 / 26 refinement. Sourced from audit packet 127 (GPT-5.6-Sol-Fast iteration 1, Opus 4.8 iteration-2 cross-check).

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/plugins/mk-spec-memory.js` | Modify | 001-mk-spec-memory | 19 fixes (9 P1 / 6 P2 / 4 ref) |
| `.opencode/plugins/mk-skill-advisor.js` | Modify | 002-mk-skill-advisor | 17 fixes (6 P1 / 8 P2 / 3 ref) |
| `.opencode/plugins/mk-code-graph.js` | Modify | 003-mk-code-graph | 13 fixes (3 P1 / 7 P2 / 3 ref) |
| `.opencode/plugins/mk-goal.js` | Modify | 004-mk-goal | 17 fixes (10 P1 / 5 P2 / 2 ref) |
| `.opencode/plugins/mk-deep-loop-guard.js` | Modify | 005-mk-deep-loop-guard | 13 fixes (6 P1 / 5 P2 / 2 ref) |
| `.opencode/plugins/mk-dist-freshness-guard.js` | Modify | 006-mk-dist-freshness-guard | 12 fixes (5 P1 / 2 P2 / 5 ref) |
| `.opencode/plugins/session-cleanup.js` | Modify | 007-session-cleanup | 17 fixes (3 P1 / 7 P2 / 7 ref) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently executable Level-1 fix plan for one plugin.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-mk-spec-memory/` | Spec Kit Memory continuity plugin fixes (19) | Draft |
| 002 | `002-mk-skill-advisor/` | Skill Advisor prompt-time plugin fixes (17) | Draft |
| 003 | `003-mk-code-graph/` | Code-graph context transport plugin fixes (13) | Draft |
| 004 | `004-mk-goal/` | /goal session-goal plugin fixes (17) | Draft |
| 005 | `005-mk-deep-loop-guard/` | Deep-loop Task-dispatch guard fixes (13) | Draft |
| 006 | `006-mk-dist-freshness-guard/` | Dist-freshness warn guard fixes (12) | Draft |
| 007 | `007-session-cleanup/` | Session-end MCP cleanup plugin fixes (17) | Draft |

### Phase Transition Rules

- Each child validates independently under Level 1.
- Implement P1 batches first; a plugin's child completes when its tests are green and findings verified.
- Run `validate.sh --recursive` on this parent to validate all children.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| Plan (this packet) | Implementation | Each finding confirmed reproducing; baseline captured | Plugin tests green pre/post per fix |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Land all severities, or P1-only first and defer P2/refinements?
- Which plugin to remediate first (highest-impact: mk-goal, mk-deep-loop-guard, mk-dist-freshness-guard)?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Audit source**: `../127-opencode-plugins-hooks-audit/`
- **Phase children**: see `[0-9][0-9][0-9]-*/`
- **Graph Metadata**: see `graph-metadata.json`
