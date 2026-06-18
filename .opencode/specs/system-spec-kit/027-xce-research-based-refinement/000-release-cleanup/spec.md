---
title: "Feature Specification: 027 Release Cleanup (Phase Parent)"
description: "Phase parent for aligning outward and governance surfaces to the shipped 027 reality."
trigger_phrases:
  - "027 release cleanup"
  - "shipped 027 surface alignment"
  - "schema v37 release docs"
importance_tier: "important"
contextType: "implementation"
status: "completed"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/000-release-cleanup"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "All 9 children shipped; statuses reconciled at epic close"
    next_safe_action: "Track complete; no further action"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-000-release-cleanup-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator fixed the child phase map at eight release-cleanup surfaces."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X->Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md - these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: 027 Release Cleanup (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-10 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-spec-kit/027-xce-research-based-refinement |
| **Predecessor** | None |
| **Successor** | 001-public-root-readme is authored last as capstone |
| **Handoff Criteria** | Each child phase validates strictly and documents the outward surface it owns |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped 027 reality spans schema v37, default-off feature flags, new CLI front doors, constitutional rules, memory behaviors, and doctrine from peck, gem, memclaw, and openltm. Outward and governance surfaces need one coordinated phase map so documentation, catalogs, playbooks, command content, agent mirrors, and root governance describe the same current system.

### Purpose
Align every outward and governance surface to the shipped 027 reality without changing source code, command router structure, agents, or skills in this scaffold. The child phases inventory the current claim, align the owned surface, and verify the result against schema v37, the new default-off flags, CLI front doors, constitutional rules, memory features, and doctrine.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Shipped schema alignment: v34 through v37 current-state references.
- Default-off flags: SPECKIT_SEMANTIC_TRIGGERS, SPECKIT_SEMANTIC_TRIGGERS_MODE, SPECKIT_SESSION_TRACE_CAUSAL_INFERENCE, SPECKIT_FEEDBACK_RETENTION_LEARNING, SPECKIT_FEEDBACK_RETENTION_MODE, SPECKIT_SOFT_DELETE_TOMBSTONES, SPECKIT_MEMORY_IDEMPOTENCY, SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT, and SPECKIT_COMPLETION_FRESHNESS.
- CLI front-door descriptions from phase 010.
- Constitutional rules: automated-writers-never-overwrite-manual and entity-cooccurrence-is-not-causal.
- Memory feature descriptions for semantic triggers, idempotency, provenance, tombstones, observability, continuity, reducers, freshness, stale audit, and tool ownership.
- Peck, gem, memclaw, and openltm doctrine references.

### Out of Scope
- Source-code changes in this scaffold.
- Command, agent, skill, or YAML edits in this scaffold.
- Running the Epic Phase-5 manual or stress executions during this scaffold.
- Structural router or presentation split work owned by 027/011.

### Files to Change
Planned future implementation scope for audit only. Per-phase detail lives in each child folder.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| README.md | Future Modify | 001-public-root-readme | Public root README current-state alignment |
| .opencode/skills/** | Future Review/Modify | 002-skill-docs-alignment | Skill docs, assets, references, and ENV_REFERENCE alignment |
| .opencode/skills/**/feature_catalog/** | Future Review/Modify | 003-skill-feature-catalog | Feature catalog coverage for new 027 features |
| .opencode/skills/**/manual_testing_playbook/** | Future Review/Modify | 004-skill-manual-playbook | Manual testing scenarios for features, flags, and CLI |
| daemon and CLI stress-test docs | Future Create/Modify | 005-mcp-cli-stress-tests | Stress coverage plan for three daemons and v37 front doors |
| .opencode/commands/** | Future Review/Modify | 006-command-alignment | Command content accuracy only |
| .opencode/agents/**, .claude/agents/**, .codex/agents/** | Future Review/Modify | 007-agent-alignment | Agent mirror parity and doctrine alignment |
| AGENTS.md | Future Modify | 008-agents-md-alignment | Governance references while preserving byte-stable gates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 0 | 000-spec-tree-consolidation/ | Regroup the 027 spec tree's flat top-level phase children under six themed parents (like 026) and realign the root tracking docs; `git mv` preserves content and history. | Complete |
| 1 | 001-public-root-readme/ | Rewrite the repo-root README to current shipped reality: MCP and CLI dual-stack, memory capabilities, skill, command, and agent surfaces. This is the capstone and should be authored last. | Complete |
| 2 | 002-skill-docs-alignment/ | Align every skill SKILL.md, README, assets, and references with shipped flags and behaviors while preserving the narrative house voice. Reconcile ENV_REFERENCE flag completeness, including SPECKIT_AUTHORED_CONTINUITY_SNAPSHOT. | Complete |
| 3 | 003-skill-feature-catalog/ | Add one feature_catalog entry per new 027 feature, bump hand-maintained count self-checks, and keep SOURCE-FILES paths grep-traceable. | Complete |
| 4 | 004-skill-manual-playbook/ | Add manual_testing_playbook scenarios for each 027 feature, flag, and CLI surface, then bump the drift-prone count self-check. | Complete |
| 5 | 005-mcp-cli-stress-tests/ | Plan stress coverage for the three daemons, CLI front doors under schema v37, and the new gated flags. | Complete |
| 6 | 006-command-alignment/ | Align command-doc content accuracy for flags, behavior, and CLI front doors without changing structural router or presentation ownership. | Complete |
| 7 | 007-agent-alignment/ | Reconcile .opencode, .claude, and .codex agent mirror parity with the agent-io contract and verification-discipline doctrine. | Complete |
| 8 | 008-agents-md-alignment/ | Reconcile root AGENTS.md governance so Four Laws and Gates stay byte-stable while completion-freshness, Logic-Sync, and constitutional-rule references stay coherent. | Complete |
| 9 | 009-skill-frontmatter-alignment/ | Standardize references/ and assets/ frontmatter across all 21 skills: an investigation child fixes the canonical contract, then one alignment child per skill applies it. | Complete |

### Phase Transition Rules

- Each child phase MUST pass strict validation before implementation handoff.
- 001-public-root-readme is the capstone and should be authored last.
- 006-command-alignment is content-only and coordinates with 027/011 for structural router and presentation split ownership.
- 004-skill-manual-playbook and 005-mcp-cli-stress-tests prepare coverage that Epic Phase-5 runs later.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-public-root-readme | 002-skill-docs-alignment | Prior phase validates and updates its handoff notes | strict validation for 001-public-root-readme |
| 002-skill-docs-alignment | 003-skill-feature-catalog | Prior phase validates and updates its handoff notes | strict validation for 002-skill-docs-alignment |
| 003-skill-feature-catalog | 004-skill-manual-playbook | Prior phase validates and updates its handoff notes | strict validation for 003-skill-feature-catalog |
| 004-skill-manual-playbook | 005-mcp-cli-stress-tests | Prior phase validates and updates its handoff notes | strict validation for 004-skill-manual-playbook |
| 005-mcp-cli-stress-tests | 006-command-alignment | Prior phase validates and updates its handoff notes | strict validation for 005-mcp-cli-stress-tests |
| 006-command-alignment | 007-agent-alignment | Prior phase validates and updates its handoff notes | strict validation for 006-command-alignment |
| 007-agent-alignment | 008-agents-md-alignment | Prior phase validates and updates its handoff notes | strict validation for 007-agent-alignment |
| 008-agents-md-alignment | 009-skill-frontmatter-alignment | Prior phase validates and updates its handoff notes | strict validation for 008-agents-md-alignment |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None for scaffold. Implementation phases may discover surface-specific conflicts.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `001-*` through `008-*` for per-phase spec.md, plan.md, tasks.md, and implementation-summary.md.
- **Parent Spec**: See `../spec.md`.
- **Graph Metadata**: See `graph-metadata.json` for direct child edges.
