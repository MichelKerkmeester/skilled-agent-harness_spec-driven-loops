---
title: "Feature Specification: integration-research-remediation"
description: "Phase parent for remediating the eleven findings of the Sonnet 5 integration research: the trigger-index root regression and README rule count, phantom children and unvalidated track roots, the deferred Claude and Cursor hook drift markers and the unregistered improvement family, and a shared frontmatter parser, a shared containment primitive and post-run packet metadata refresh across four skill families."
trigger_phrases:
  - "integration research remediation"
  - "spec kit alignment findings"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/023-trigger-index-root-and-drift-fixes"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Remediate the eleven findings of the Sonnet 5 integration research under packet 054: the trigger-index repo-root regression and README rule count, phantom children in graph metadata with new validator rules and a track-root sweep, Claude and Cursor hook drift markers and the unregistered improvement artifact family, and a shared frontmatter parser and containment primitive adopted across four skill families plus post-run packet metadata refresh

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | None; findings originate in `specs/system-speckit/033-system-speckit-v4/021-decommission-debt-and-cli-nesting/research/lineages/sonnet5-high-research/research.md` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every child validates strict, each finding names its fix commit or its recorded decision, and the parent's gate set is green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A ten-iteration Sonnet 5 research pass over the repository ranked eleven things that still needed fixing or aligning with system-spec-kit: a critical trigger-index regression that dropped every skill document, systemic phantom children after packet renames, four hand-found defects with no validator rule, a README rule count off by nine, a deferred hook drift marker for two hosts, an undocumented artifact family, track roots invisible to validation, and duplicated frontmatter and containment helpers across four skill families with no shared home. Each was verified against the tree before this packet opened.

### Purpose
Land all eleven fixes in four lanes, one lane at a time, each executed by a GLM 5.3 Flash worker through OpenRouter from a prompt naming the finding, the fix and its verification command, with every claim rerun before commit.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase 1: trigger-index repo root, README rule count, runtime API boundary note.
- Phase 2: identity-aware pruning in the graph-metadata writer, the child-identity rule, the track-root sweep.
- Phase 3: Claude and Cursor hook drift fallbacks, the `improvement/` family in the folder structure and its config rule.
- Phase 4: a shared frontmatter parser and containment primitive in the spec-kit shared package adopted across spec-kit, deep-loop, sk-doc and skill-advisor, and a post-run metadata refresh in the fan-out runner.

### Out of Scope
- Bulk regeneration of the 127 drifted packets and 14 drifted track roots: an operator-run pass reported by the new sweep and rule.
- Rewriting Python parsers in sk-doc or skill-advisor: reported, not rewritten.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `runtime/cli/retrieval/generate-trigger-index.mjs`, `runtime/data/trigger-index.json`, `README.md` | Modify | 1 | Root derivation, regenerated index, rule count |
| `runtime/lib/graph/graph-metadata-parser.ts`, `runtime/cli/rules/*`, `runtime/cli/spec/sweep-track-roots.mjs` | Modify, Create | 2 | Pruning, rule, sweep |
| `.claude/settings.json`, `.cursor/hooks.json`, `references/structure/folder-structure.md`, `runtime/cli/rules/check-improvement-artifacts.sh` | Modify, Create | 3 | Drift fallbacks, family docs and rule |
| `shared/frontmatter/*`, `shared/utils/path-containment.ts`, callers in four skills, `system-deep-loop/runtime/scripts/fanout-run.cjs` | Create, Modify | 4 | Shared helpers and post-run refresh |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-index-root-and-docs/ | Trigger-index repo root by anchors, regenerated index, README rule count, API boundary note | complete |
| 2 | 002-metadata-drift-and-rules/ | Identity-aware child pruning, `GRAPH_METADATA_CHILD_IDENTITY` rule, track-root sweep | complete |
| 3 | 003-hook-markers-and-improvement-family/ | Claude and Cursor drift fallbacks, `improvement/` documented and shape-checked | complete |
| 4 | 004-shared-parsers-and-post-run-refresh/ | Shared frontmatter parser and containment primitive adopted across spec-kit and the skill advisor, blocked edges recorded; post-run packet metadata refresh | complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-index-root-and-docs | 002-metadata-drift-and-rules | Index covers all three corpus roots; count test green | `walkCorpus` root counts; `validator-registry-doc-count.vitest.ts` |
| 002-metadata-drift-and-rules | 003-hook-markers-and-improvement-family | Proof packet clean; rule listed in a strict run | `children_ids` filter prints `[]`; validate output |
| 003-hook-markers-and-improvement-family | 004-shared-parsers-and-post-run-refresh | Markers on both hosts; parity green; rule registered | `grep -c mkHookDrift`; parity 103 of 103 |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None. Phases ran in order 1 to 4, one lane at a time.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
