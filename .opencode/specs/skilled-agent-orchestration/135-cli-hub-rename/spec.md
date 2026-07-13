---
title: "Feature Specification: CLI External Hub Rename"
description: "Coordinates the four workstreams that establish cli-external-orchestration as the canonical external CLI hub and verify the resulting routing contract."
trigger_phrases:
  - "135-cli-hub-rename"
  - "cli-external-orchestration hub rename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-cli-hub-rename"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "markdown-agent"
    recent_action: "Finalized canonical phased packet documentation"
    next_safe_action: "Rebuild authorized dist outputs, then rerun blocked validation gates"
    blockers:
      - "validate.sh is blocked by stale compiled mcp-server dist; rebuilding is forbidden"
      - "skill graph validation is blocked by unrelated missing graph key paths"
    key_files:
      - "spec.md"
      - "004-verify-closeout/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "135-cli-hub-rename-doc-finalization"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: CLI External Hub Rename

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Active (verification blocked) |
| **Created** | 2026-07-13 |
| **Branch** | `main` |
| **Parent Spec** | None |
| **Parent Packet** | `skilled-agent-orchestration/135-cli-hub-rename` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All four children are documented; blocked gates are rerun only after authorized dist repair |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The external CLI router needed one canonical hub identity. The work spans a directory rename, advisor projection alignment, reference updates, and verification, so each concern needs an independently auditable child phase.

### Purpose
Keep coordination at this lean parent while the four Level 3 children record implementation and verification evidence without overstating blocked checks.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `cli-external-orchestration` hub identity and its nested executor packets
- Advisor and routing projection alignment
- Live reference and prompt-quality-card synchronization
- Verification evidence and explicit environment blockers

### Out of Scope
- Detailed implementation, decisions, checklists, and closeout narratives at the parent level
- Rebuilding stale compiled distributions

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/cli-external-orchestration/**` | Rename/update | 001-003 | Canonical hub, routing metadata, and live references |
| Advisor and routing checks | Verify | 002, 004 | Confirm resolver and projection behavior |
| This packet | Author | 004 | Record evidence and unresolved blockers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-hub-dir-rename/` | Rename the hub directory with history preserved | Complete |
| 2 | `002-advisor-realign/` | Repoint advisor and routing projections | Complete |
| 3 | `003-reference-sweep/` | Update live references and prompt-quality-card state | Complete |
| 4 | `004-verify-closeout/` | Consolidate checks and record blocked gates | Active |

### Phase Transition Rules

- Completed implementation phases retain their phase-local evidence.
- Phase 4 remains active while environment-owned validation blockers exist.
- Resume at `004-verify-closeout/` after an authorized dist rebuild.
- Run recursive strict validation before changing the parent status to complete.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-hub-dir-rename | 002-advisor-realign | Canonical hub exists at the new path | Git move evidence and live path inspection |
| 002-advisor-realign | 003-reference-sweep | Resolver projects `cli-opencode` through the new hub | Local smoke: confidence 0.95, uncertainty 0.20 |
| 003-reference-sweep | 004-verify-closeout | Live references and quality card agree | Prompt-quality-card sync PASS |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- When will rebuilding the stale `@spec-kit/shared` and mcp-server distributions be authorized?
- When will the four unrelated missing graph key paths in `mcp-code-mode` and `sk-code` be repaired?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
