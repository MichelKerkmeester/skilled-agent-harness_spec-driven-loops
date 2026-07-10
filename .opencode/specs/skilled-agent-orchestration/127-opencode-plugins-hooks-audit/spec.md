---
title: "Feature Specification: OpenCode plugins + Claude hooks audit"
description: "Phase-parent for a read-only GPT-5.6-Sol-Fast audit of all 7 OpenCode plugins and their Claude hook versions; per-plugin findings live in child phase folders."
trigger_phrases:
  - "opencode plugins audit"
  - "plugin hooks audit"
  - "opencode plugin review"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/127-opencode-plugins-hooks-audit"
    last_updated_at: "2026-07-10T06:47:39.994Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Documented 72 audit findings across 7 plugin children"
    next_safe_action: "Triage findings; scope remediation packets per plugin"
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
      session_id: "plugin-audit-127"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: OpenCode plugins + Claude hooks audit

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | skilled-agent-orchestration |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 7 OpenCode plugins under `.opencode/plugins/` and their related Claude hook versions had never been audited as a set for bugs, silent-breakage, correctness errors, cross-runtime parity drift, and refinements.

### Purpose
Run an independent read-only audit (one GPT-5.6-Sol-Fast agent per plugin) and document the findings per plugin so remediation can be triaged. Analysis and documentation only, no code changes.

Two iterations ran per plugin/hook pair. Iteration 1 (GPT-5.6-Sol-Fast) produced 72 findings. Iteration 2 (Claude Opus 4.8, high effort, via account2) independently adjudicated every iteration-1 finding (47 confirmed, 23 severity-adjusted, 1 refuted, 1 uncertain) and added 37 new lower-severity findings. Each child holds its iteration-1 report in `review/review-report.md` and its iteration-2 cross-check in `review/iteration-002-opus-4.8.md`.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. Per-plugin findings live in the child phase folders below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 7 OpenCode plugin entrypoints under `.opencode/plugins/`
- Each plugin's related Claude hook version and shared bridges
- Cross-runtime parity between each plugin and its Claude hook counterpart

### Out of Scope
- Code changes / remediation (findings documented for a later packet)
- Non-plugin runtime and unrelated skills

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/plugins/mk-spec-memory.js` | Audit (no change) | 001-mk-spec-memory | 13 findings (0 P0 / 10 P1 / 3 P2 / 0 refinement), verdict REFINE |
| `.opencode/plugins/mk-skill-advisor.js` | Audit (no change) | 002-mk-skill-advisor | 12 findings (0 P0 / 6 P1 / 6 P2 / 0 refinement), verdict REFINE |
| `.opencode/plugins/mk-code-graph.js` | Audit (no change) | 003-mk-code-graph | 8 findings (0 P0 / 3 P1 / 4 P2 / 1 refinement), verdict REFINE |
| `.opencode/plugins/mk-goal.js` | Audit (no change) | 004-mk-goal | 13 findings (0 P0 / 10 P1 / 2 P2 / 1 refinement), verdict REFINE |
| `.opencode/plugins/mk-deep-loop-guard.js` | Audit (no change) | 005-mk-deep-loop-guard | 9 findings (0 P0 / 6 P1 / 2 P2 / 1 refinement), verdict REFINE |
| `.opencode/plugins/mk-dist-freshness-guard.js` | Audit (no change) | 006-mk-dist-freshness-guard | 7 findings (0 P0 / 5 P1 / 1 P2 / 1 refinement), verdict REFINE |
| `.opencode/plugins/session-cleanup.js` | Audit (no change) | 007-session-cleanup | 10 findings (0 P0 / 3 P1 / 6 P2 / 1 refinement), verdict REFINE |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently executable Level-1 spec folder holding one plugin's findings in `review/review-report.md`.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-mk-spec-memory/` | Spec Kit Memory continuity plugin + Claude hook parity | Complete (REFINE) |
| 002 | `002-mk-skill-advisor/` | Skill Advisor prompt-time plugin + Claude hook parity | Complete (REFINE) |
| 003 | `003-mk-code-graph/` | Code-graph context transport plugin + Claude hook parity | Complete (REFINE) |
| 004 | `004-mk-goal/` | /goal session-goal plugin + Claude hook parity | Complete (REFINE) |
| 005 | `005-mk-deep-loop-guard/` | Deep-loop Task-dispatch guard + Claude hook parity | Complete (REFINE) |
| 006 | `006-mk-dist-freshness-guard/` | Dist-freshness warn guard + Claude hook parity | Complete (REFINE) |
| 007 | `007-session-cleanup/` | Session-end MCP cleanup plugin + Claude hook parity | Complete (REFINE) |

### Phase Transition Rules

- Each child validates independently under Level 1 before roll-up.
- Run `validate.sh --recursive` on this parent to validate all children as one unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| Audit (this program) | Remediation (future) | Findings triaged; P0/P1 confirmed against real symptoms | Per-finding code verification before any fix |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which findings warrant a remediation packet vs accept-as-is?
- `mk-goal` and `mk-deep-loop-guard` have no Claude hook counterpart; is cross-runtime parity desired, or is OpenCode-only intended?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: see `[0-9][0-9][0-9]-*/` for each plugin's audit
- **mk-goal prior packet**: `system-deep-loop/032-goal-opencode-plugin`
- **Graph Metadata**: see `graph-metadata.json`
