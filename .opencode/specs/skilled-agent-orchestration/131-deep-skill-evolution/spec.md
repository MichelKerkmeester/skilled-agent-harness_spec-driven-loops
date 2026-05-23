---
title: "Feature Specification: deep-skill evolution arc (consolidation of packets 115–130 — 6 thematic clusters × 45 leaf phases)"
description: "Nested phase parent unifying 17 previously-independent packets into 6 thematic phase parents (ai-council + deep-review + deep-loop-runtime + deep-research + deep-agent-improvement + deep-skills differentiation) that contain 45 leaf phases in total."
trigger_phrases:
  - "deep skill evolution arc"
  - "deep stack consolidation"
  - "ai-council rename + iterative"
  - "deep-loop runtime isolation"
  - "deep-research uplift + hygiene"
  - "deep-agent-improvement correctness + evaluator"
  - "deep-skills unique value"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "restructured-flat-45-to-nested-6-thematic"
    next_safe_action: "validate-recursive-strict-then-reindex"
    blockers: []
    key_files:
      - "001-ai-council/spec.md"
      - "002-deep-review/spec.md"
      - "003-deep-loop-runtime/spec.md"
      - "004-deep-research/spec.md"
      - "005-deep-agent-improvement/spec.md"
      - "006-deep-skills-differentiation/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000131"
      session_id: "131-phase-parent-nested"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Parent slot: 131-deep-skill-evolution"
      - "Structure: NESTED — 6 thematic phase parents at root, each containing leaf children. Reduced root fan-out from 45 to 6."
      - "Cluster mapping: ai-council (13 leaves), deep-review (8), deep-loop-runtime (9), deep-research (6), deep-agent-improvement (8), deep-skills-differentiation (1)"
      - "Executor split for restructuring: main agent (metadata + git mv + spec authoring)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: deep-skill evolution arc (nested)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (nested phase parent) |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-23 |
| **Last Updated** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | n/a (root packet under skilled-agent-orchestration) |
| **Parent Packet** | skilled-agent-orchestration |
| **Predecessor** | 113-cli-devin-prompt-quality-arc, 114-small-ai-model-optimization |
| **Successor** | None planned |
| **Handoff Criteria** | Each cluster passes `validate.sh --strict --recursive` independently; external skill/agent references rewritten to new paths; memory + skill graph + code graph + CocoIndex reindexed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Across late 2026-04 → 2026-05, the deep-* skill family co-evolved through 17 independently-created packets (115–130 plus a duplicate 124). Each packet captured an incremental decision — rename, isolate, iterate, harden, fix, validate — about one of five interrelated skills: `sk-ai-council`, `deep-review`, `deep-loop-runtime`, `deep-research`, and `deep-agent-improvement`. Read individually the packets stand alone; read together they form a single coherent arc that the skilled-agent-orchestration track lacked a unified parent for.

Initially consolidated into a flat 45-child layout, the root manifest became hard to scan (exceeded `is-phase-parent.js`'s 40-children ERROR threshold). Restructuring nests the 45 leaves under 6 thematic phase parents.

### Purpose

Wrap the 45 leaf phases under 6 thematic cluster parents so the root manifest of `131-deep-skill-evolution/` reads as 6 entries (one per skill area) rather than 45 mixed-topic siblings. Each cluster parent is itself a phase parent with its own `spec.md`/`description.json`/`graph-metadata.json` lean trio, and contains the leaf phases relevant to its theme.

> **Phase-parent note:** This spec.md is the ONLY authored document at the root parent level. Cluster-level orientation lives in each cluster's own `spec.md`. Detailed planning, task breakdowns, checklists, decisions, and implementation summaries live in the leaf phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 6 thematic cluster parents at the root (001..006), each a phase parent itself
- 45 leaf phases distributed across the clusters
- Every previously-shipped artifact (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, ai-council/, scratch/, research/, logs/) intact inside its renumbered leaf folder
- All `description.json` + `graph-metadata.json` rewrites: `specFolder`, `parentChain`, `packet_id`, `spec_folder`, `parent_id`, `children_ids`
- External skill-doc + agent-def updates: rewrite paths to the nested form (e.g. `131/001-ai-council/001-rename-preflight-and-plan/` instead of `131/001-ai-council-rename-preflight-and-plan/`)
- Reindex: memory_index_scan, skill_graph_compiler.py, code_graph_scan, cocoindex_refresh_index

### Out of Scope

- Modifying any deep-* skill source code
- Renumbering 113, 114, or any packet outside the 115–130 in-scope range
- Auto-rewriting user's `~/.claude/.../memory/*.md` entries
- Touching `131-deep-skill-evolution/scratch/*` historical artifacts

### Files Changed (cumulative across all clusters)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `131-deep-skill-evolution/spec.md` | Modify | This file (root parent lean trio) |
| `131-deep-skill-evolution/description.json` | Modify | Root parent metadata |
| `131-deep-skill-evolution/graph-metadata.json` | Modify | `children_ids` now points to 6 thematic parents instead of 45 leaves |
| `131-deep-skill-evolution/{001..006}-<cluster>/spec.md` | Create | New lean-trio at each cluster |
| `131-deep-skill-evolution/{001..006}-<cluster>/description.json` | Create | Cluster parent metadata |
| `131-deep-skill-evolution/{001..006}-<cluster>/graph-metadata.json` | Create | Cluster parent graph metadata with N leaf `children_ids` |
| `131-deep-skill-evolution/{001..006}-<cluster>/NNN-leaf/` × 45 | Rename | `git mv` from flat root to nested cluster |
| `131-deep-skill-evolution/{001..006}-<cluster>/NNN-leaf/{description,graph-metadata}.json` × 45 | Modify | `parent_id`, `parentChain`, `specFolder`, `packet_id` rewritten |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each row is a thematic cluster phase parent. Drill into the cluster's own `spec.md` to see its leaf phases.

| Cluster | Folder | Theme | Leaves | Status |
|---------|--------|-------|--------|--------|
| 001 | `001-ai-council/` | sk-ai-council rename + shared runtime + iterative multi-topic | 13 | In Progress |
| 002 | `002-deep-review/` | deep-review complexity hardening arc (research → schema → validator → ledger → saturation → graph vocab → playbooks) | 8 | Complete |
| 003 | `003-deep-loop-runtime/` | deep-loop runtime isolation (core deliberation + 8 isolation phases) | 9 | Complete |
| 004 | `004-deep-research/` | deep-research uplift + ordering + uncovered questions + hygiene | 6 | In Progress |
| 005 | `005-deep-agent-improvement/` | deep-agent-improvement uplift + correctness + doc-version + evaluator + cross-runtime + mixed-executor | 8 | Active |
| 006 | `006-deep-skills-differentiation/` | unique-value audit comparing deep-review vs deep-research vs deep-ai-council | 1 | Draft |
| 007 | `007-deep-commands-relocation/` | relocate deep-* command assets + update cross-repo references: 6 YAMLs co-located, 2 Gemini TOMLs migrated, ~25 live refs updated, ~5,267 historical refs sed | 1 | Active |

### Phase Transition Rules

- Each cluster is independently executable; clusters carry no implicit ordering dependency
- Run `validate.sh --recursive` on root or on any cluster to validate that subtree
- The root parent's 6-child count is well within `is-phase-parent.js` healthy band (<20)
- Each cluster's child count is independently within healthy band (≤13)

### Cross-Cluster Dependencies

- **001-ai-council depends on 003-deep-loop-runtime** (the rename moves `deep-ai-council` from deep-loop family to sk-util family)
- **004-deep-research/001-003 uplift depends on 002-deep-review** (uplift research investigates whether deep-review changes propagate)
- **005-deep-agent-improvement/001-003 uplift depends on 002-deep-review + 004-deep-research** (investigates whether arcs 002+004 changes propagate to deep-agent-improvement)
- **006-deep-skills-differentiation** depends on 001/002/004 having shipped (audits boundaries between them)
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:source-history -->
## SOURCE-HISTORY MAP

The 17 source packets and their final disposition under the nested 131 structure:

| Source packet | Cluster | New leaf path |
|---------------|---------|----------------|
| 115-deep-ai-council-rename (6 subphases) | 001-ai-council | 001–006 |
| 124-sk-ai-council-shared-runtime-deliberation (leaf) | 001-ai-council | 007 |
| 129-deep-ai-council-iterative-multi-topic (6 subphases) | 001-ai-council | 008–013 |
| 116-deep-review-complexity (8 subphases) | 002-deep-review | 001–008 |
| 117-deep-loop-core-isolation-deliberation (leaf) | 003-deep-loop-runtime | 001 |
| 118-deep-loop-full-isolation-no-mcp (8 subphases) | 003-deep-loop-runtime | 002–009 |
| 119-deep-research-uplift (3 subphases) | 004-deep-research | 001–003 |
| 120-deep-research-iteration-ordering-fix (leaf) | 004-deep-research | 004 |
| 121-deep-research-uncovered-questions (leaf) | 004-deep-research | 005 |
| 122-deep-research-hygiene-fix-pack (leaf) | 004-deep-research | 006 |
| 123-deep-agent-improvement-uplift (3 subphases) | 005-deep-agent-improvement | 001–003 |
| 124-deep-agent-improvement-correctness-fixes (leaf) | 005-deep-agent-improvement | 004 |
| 125-deep-agent-improvement-doc-version-reconciliation (leaf) | 005-deep-agent-improvement | 005 |
| 126-deep-agent-improvement-evaluator-hardening (leaf) | 005-deep-agent-improvement | 006 |
| 127-deep-agent-improvement-cross-runtime-promotion (leaf) | 005-deep-agent-improvement | 007 |
| 128-deep-agent-improvement-mixed-executor-adjudication (leaf) | 005-deep-agent-improvement | 008 |
| 130-deep-skills-unique-value-differentiation (leaf) | 006-deep-skills-differentiation | 001 |

Untracked artifacts from 118/009 relocated to `scratch/118-009-research-workspace/`. Arc-level deep-review and changelog dirs from 115, 116, 118 preserved at `scratch/115-arc-review/`, `scratch/115-arc-changelog/`, `scratch/116-arc-review/`, `scratch/118-arc-review/`.
<!-- /ANCHOR:source-history -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **In-flight phases**: Some leaves carry active continuity state (ai-council iterative cluster 001-ai-council/008–013, deep-loop core-isolation cluster 003-deep-loop-runtime/001, deep-agent-improvement uplift cluster 005-deep-agent-improvement/001–003). Resume via the new nested packet paths.
- **118/009 disposition**: Relocated to `scratch/118-009-research-workspace/`. If the deep-research iter-005 work resumes, a follow-on packet can adopt those artifacts.
- **Cross-cluster intent**: Should cluster 006 (deep-skills-differentiation) fold into 004-deep-research as its 7th leaf? Currently kept separate for thematic clarity (it audits ALL deep-* skills, not just deep-research).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Cluster children**: 6 thematic phase parents enumerated above
- **Leaves**: 45 leaf phases distributed across the 6 clusters (see each cluster's own `spec.md` for the leaf manifest)
- **Skills modified (path rewrites only)**: `deep-research`, `deep-review`, `deep-agent-improvement`, `deep-ai-council`, `deep-loop-runtime`
- **Agents modified (path rewrites only, across 4 runtime mirrors)**: `deep-research`, `deep-review`, `ai-council`
- **Reuse patterns**: `113-cli-devin-prompt-quality-arc/spec.md` (template), `is-phase-parent.ts` (threshold helper), `generate-description.js` + `generate-context.js` (metadata refresh)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Snapshot for rollback**: `/tmp/131-consolidation/snapshot.json`
