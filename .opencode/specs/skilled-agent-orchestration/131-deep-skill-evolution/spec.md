---
title: "Feature Specification: deep-skill evolution arc (consolidation of packets 115–130 — ai-council + deep-review + deep-loop + deep-research + deep-agent-improvement + cross-skill differentiation)"
description: "Phase parent unifying 17 previously-independent packets into 45 thematically-ordered phases that describe the co-evolution of the deep-* skill family — ai-council rename + shared runtime + iterative multi-topic, deep-review complexity hardening, deep-loop runtime isolation, deep-research uplift + ordering + hygiene, deep-agent-improvement uplift + correctness + evaluator + cross-runtime + mixed-executor, and deep-skills unique-value differentiation."
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
    recent_action: "merged-115-through-130-into-131-flattened-phase-parent"
    next_safe_action: "validate-recursive-strict-then-reindex"
    blockers: []
    key_files:
      - "001-ai-council-rename-preflight-and-plan/spec.md"
      - "007-ai-council-shared-runtime-deliberation/spec.md"
      - "008-ai-council-iterative-research-and-architecture/spec.md"
      - "014-deep-review-complexity-research-synthesis/spec.md"
      - "022-deep-loop-core-isolation-deliberation/spec.md"
      - "023-deep-loop-runtime-skill-scaffold/spec.md"
      - "032-deep-research-uplift-research-deep-review-changes/spec.md"
      - "038-deep-agent-improvement-research-recent-updates/spec.md"
      - "045-deep-skills-unique-value-differentiation/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000131"
      session_id: "131-phase-parent-merge"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does 45 children stay maintainable, or should differentiation move out at follow-on to bring count to 44?"
    answered_questions:
      - "Parent slot: 131-deep-skill-evolution (user-specified, no -arc suffix)"
      - "Numbering: thematic grouping (ai-council → review → loop → research → improvement → differentiation)"
      - "Structure: flatten — promote all 35 nested sub-phases to direct siblings of the 10 standalone leaves (118/009 dropped as untracked artifact dir)"
      - "Executor split: hybrid (main agent for metadata + git mv; cli-devin SWE 1.6 for skill-doc + agent-def updates)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives beyond the source-map below
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: deep-skill evolution arc

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 (phase parent) |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-23 |
| **Last Updated** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | n/a (root packet under skilled-agent-orchestration) |
| **Parent Packet** | skilled-agent-orchestration |
| **Predecessor** | 113-cli-devin-prompt-quality-arc, 114-small-ai-model-optimization |
| **Successor** | None planned |
| **Handoff Criteria** | Every phase passes `validate.sh --strict` independently; external skill/agent references rewritten to new paths; memory + skill graph + code graph + CocoIndex reindexed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Across late 2026-04 → 2026-05, the deep-* skill family co-evolved through 17 independently-created packets (115–130 plus a duplicate 124). Each packet captured an incremental decision — rename, isolate, iterate, harden, fix, validate — about one of five interrelated skills: `sk-ai-council`, `deep-review`, `deep-loop-runtime`, `deep-research`, and `deep-agent-improvement`. Read individually the packets stand alone; read together they form a single coherent arc that the skilled-agent-orchestration track lacked a unified parent for. Continuity-recovery, resume ladder, and cross-arc impact analysis all suffered from this fragmentation.

### Purpose

Consolidate the 17 packets into a single multi-phased spec folder (`131-deep-skill-evolution`) with 45 thematically-ordered child phases. Preserve every shipped artifact (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, ai-council/, scratch/, research/, logs/) intact inside the renumbered child folders. Rewrite the ~22 external references (5 skill docs + agent mirrors across 4 runtimes) so the deep-* skill suite resolves the new packet paths cleanly. Reindex memory + skill graph + code graph + CocoIndex so future resume + advisor + search calls surface the unified arc.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, decisions, and implementation summaries live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- 45 child phase folders covering the six thematic clusters (ai-council 13, deep-review 8, deep-loop 9, deep-research 6, deep-agent-improvement 8, deep-skills differentiation 1)
- All `description.json` + `graph-metadata.json` rewrites: `specFolder`, `parentChain`, `packet_id`, `spec_folder`, `parent_id`, `children_ids`
- External skill-doc updates: deep-research, deep-review, deep-agent-improvement, deep-ai-council, deep-loop-runtime SKILL.md + changelog + manual_testing_playbook + references
- External agent-def updates: deep-research, deep-review, ai-council across `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`
- Reindex: memory_index_scan, skill_graph_compiler.py, code_graph_scan, cocoindex_refresh_index
- Memory hygiene REPORT (read-only enumeration of stale path references — no auto-rewrite)

### Out of Scope

- Modifying any deep-* skill source code (this is doc/metadata reorganization only)
- Renumbering 113 or 114 or any packet outside the 115–130 in-scope range
- Auto-rewriting user's `~/.claude/.../memory/*.md` entries (historical artifacts; user decides via `/memory:save` follow-ups)
- Touching the in-flight artifact directory `118/009-deep-research-uplift-candidates/` as a packet (no spec.md; relocated to `131-deep-skill-evolution/scratch/118-009-research-workspace/`)
- Promoting or demoting any skill graph node or skill metadata beyond path rewrites

### Files Changed (cumulative across all 45 phases)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `131-deep-skill-evolution/spec.md` | Create | This file (phase parent lean trio) |
| `131-deep-skill-evolution/description.json` | Create | Auto-generated by `generate-description.js` |
| `131-deep-skill-evolution/graph-metadata.json` | Create | Auto-generated; `children_ids` populated with 45 paths |
| `131-deep-skill-evolution/scratch/118-009-research-workspace/` | Create (relocate) | Untracked deep-research iter-005 artifacts from old 118/009 |
| `131-deep-skill-evolution/NNN-*/` × 45 | Rename | `git mv` from 115–130 source paths |
| `131-deep-skill-evolution/NNN-*/description.json` × 45 | Modify | `specFolder`, `parentChain` rewritten |
| `131-deep-skill-evolution/NNN-*/graph-metadata.json` × 45 | Modify | `packet_id`, `spec_folder`, `parent_id`, optional `children_ids` rewritten |
| `.opencode/skills/deep-research/SKILL.md` + `changelog/*` | Modify | Old → new packet path rewrites |
| `.opencode/skills/deep-review/SKILL.md` + `changelog/*` + `manual_testing_playbook/*` (6 files) | Modify | Old → new packet path rewrites |
| `.opencode/skills/deep-agent-improvement/SKILL.md` + `references/*` (2 docs) | Modify | Old → new packet path rewrites |
| `.opencode/skills/deep-ai-council/SKILL.md` + `changelog/*` | Modify | Old → new packet path rewrites |
| `.opencode/skills/deep-loop-runtime/SKILL.md` + `README.md` + `changelog/*` + `graph-metadata.json` | Modify | Old → new packet path rewrites |
| `.opencode/agents/{deep-research,deep-review,ai-council}.md` + mirrors in `.claude/` `.codex/` `.gemini/` | Modify | 12 agent-def files updated for new packet paths |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

### Cluster A — AI Council (13 phases)

| Phase | Folder | Focus | Source | Status |
|-------|--------|-------|--------|--------|
| 001 | `001-ai-council-rename-preflight-and-plan/` | Rename scope-map + resource map | 115/001 | Complete |
| 002 | `002-ai-council-rename-sk-skill/` | Skill dir rename `deep-ai-council → sk-ai-council` | 115/002 | Complete |
| 003 | `003-ai-council-rename-agent-4-runtime/` | Agent rename across 4 runtime mirrors | 115/003 | Complete |
| 004 | `004-ai-council-rename-sibling-edges-typescript/` | Cross-skill edges + TS code/tests | 115/004 | Complete |
| 005 | `005-ai-council-rename-root-docs-hooks-index/` | Root docs + hooks + skills index | 115/005 | Complete |
| 006 | `006-ai-council-rename-reindex-validate/` | Reindex + validate + reconcile | 115/006 | Complete |
| 007 | `007-ai-council-shared-runtime-deliberation/` | AI-council deliberation packet (`ai-council/` + `scratch/`) | 124-sk-* | Completed |
| 008 | `008-ai-council-iterative-research-and-architecture/` | Research + architecture design | 129/001 | In-progress |
| 009 | `009-ai-council-iterative-runtime-primitive-extraction/` | Runtime primitive extraction | 129/002 | In-progress |
| 010 | `010-ai-council-iterative-per-topic-multi-round/` | Per-topic multi-round orchestration | 129/003 | In-progress |
| 011 | `011-ai-council-iterative-session-findings-registry/` | Session + findings registry | 129/004 | In-progress |
| 012 | `012-ai-council-iterative-command-and-skill-wiring/` | Command + skill wiring | 129/005 | In-progress |
| 013 | `013-ai-council-iterative-parity-cost-docs/` | Parity tests + cost guards + docs | 129/006 | Complete |

### Cluster B — Deep Review (8 phases)

| Phase | Folder | Focus | Source | Status |
|-------|--------|-------|--------|--------|
| 014 | `014-deep-review-complexity-research-synthesis/` | Research synthesis | 116/001 | Complete |
| 015 | `015-deep-review-complexity-seeded-fixture-harness/` | Seeded fixture harness | 116/002 | Complete |
| 016 | `016-deep-review-complexity-schema-prompt-contract/` | Review-depth schema + prompt contract | 116/003 | Complete |
| 017 | `017-deep-review-complexity-validator-v2-enforcement/` | Validator v2 enforcement | 116/004 | Complete |
| 018 | `018-deep-review-complexity-search-ledger-persistence/` | Search ledger persistence + reporting | 116/005 | Complete |
| 019 | `019-deep-review-complexity-candidate-saturation-gates/` | Candidate saturation + graphless gates | 116/006 | Complete |
| 020 | `020-deep-review-complexity-ledger-led-graph-vocab/` | Ledger-led graph vocabulary | 116/007 | Complete |
| 021 | `021-deep-review-complexity-playbooks-calibration/` | Playbooks + default calibration | 116/008 | Complete |

### Cluster C — Deep Loop (9 phases)

| Phase | Folder | Focus | Source | Status |
|-------|--------|-------|--------|--------|
| 022 | `022-deep-loop-core-isolation-deliberation/` | AI-council deliberation packet (`ai-council/` + `scratch/`) | 117 | Active |
| 023 | `023-deep-loop-runtime-skill-scaffold/` | Runtime skill scaffold | 118/001 | Complete |
| 024 | `024-deep-loop-lib-runtime-migration/` | Lib runtime migration | 118/002 | Complete |
| 025 | `025-deep-loop-script-shim-db-relocation/` | Script shim + DB relocation | 118/003 | Complete |
| 026 | `026-deep-loop-mcp-tool-surface-removal/` | MCP tool surface removal | 118/004 | Complete |
| 027 | `027-deep-loop-yaml-workflow-update/` | YAML workflow update (MCP → bash) | 118/005 | Complete |
| 028 | `028-deep-loop-collateral-doctor-playbook/` | /doctor + system-code-graph collateral | 118/006 | Complete |
| 029 | `029-deep-loop-test-migration/` | Test migration | 118/007 | Complete |
| 030 | `030-deep-loop-verification-changelog-closeout/` | Verification + changelog + closeout | 118/008 | Complete |

### Cluster D — Deep Research (6 phases)

| Phase | Folder | Focus | Source | Status |
|-------|--------|-------|--------|--------|
| 031 | `031-deep-research-uplift-research-deep-review-changes/` | 10-iter research dispatch on deep-review changes | 119/001 | Planned |
| 032 | `032-deep-research-uplift-applicability-analysis/` | Applicability classification table | 119/002 | Planned |
| 033 | `033-deep-research-uplift-recommendations/` | Actionable uplift recommendations | 119/003 | Planned |
| 034 | `034-deep-research-iteration-ordering-fix/` | DR-006 numeric-sort fix at reduce-state.cjs:874 | 120 | Complete |
| 035 | `035-deep-research-uncovered-questions/` | Reducer-owned uncovered-question tracking | 121 | Complete |
| 036 | `036-deep-research-hygiene-fix-pack/` | DR-005 + C-008 + DR-008 hygiene | 122 | Complete |

### Cluster E — Deep Agent Improvement (8 phases)

| Phase | Folder | Focus | Source | Status |
|-------|--------|-------|--------|--------|
| 037 | `037-deep-agent-improvement-research-recent-updates/` | 10-iter research on arcs 117–122 updates | 123/001 | Active |
| 038 | `038-deep-agent-improvement-applicability-analysis/` | Applicability classification for findings | 123/002 | Active |
| 039 | `039-deep-agent-improvement-recommendations/` | Prioritized improvement roadmap | 123/003 | Active |
| 040 | `040-deep-agent-improvement-correctness-fixes/` | P0 + P1 correctness fix-pack | 124 (DAI) | Complete |
| 041 | `041-deep-agent-improvement-doc-version-reconciliation/` | sk-doc alignment + doc-drift recon | 125 | In-progress |
| 042 | `042-deep-agent-improvement-evaluator-hardening/` | Scorer + promotion gate + dedup hardening | 126 | Complete |
| 043 | `043-deep-agent-improvement-cross-runtime-promotion/` | Four-runtime mirror verification + recovery | 127 | Implemented |
| 044 | `044-deep-agent-improvement-mixed-executor-adjudication/` | Mixed-executor + adjudication false-positive filter | 128 | Implemented |

### Cluster F — Deep-Skills Differentiation (1 phase)

| Phase | Folder | Focus | Source | Status |
|-------|--------|-------|--------|--------|
| 045 | `045-deep-skills-unique-value-differentiation/` | Audit deep-review vs deep-research vs deep-ai-council unique value | 130 | Draft |

### Phase Transition Rules

- Each phase preserves the `--strict` validation passed before consolidation (no per-phase re-validation required unless the consolidation rewrite introduced drift)
- Parent spec tracks aggregate progress via this map
- Use `/spec_kit:resume skilled-agent-orchestration/131-deep-skill-evolution/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- The 45-child count exceeds `is-phase-parent.js` warning threshold (20) but does NOT block `validate.sh --strict`; advisory only
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:source-history -->
## SOURCE-HISTORY MAP

The 17 source packets and their disposition under 131:

| Source packet | Disposition | New child(ren) |
|---------------|-------------|----------------|
| 115-deep-ai-council-rename (phase parent, 6 subphases) | Subphases flattened to 001–006; parent shell removed | 001 through 006 |
| 116-deep-review-complexity (phase parent, 8 subphases) | Subphases flattened to 014–021; parent shell removed | 014 through 021 |
| 117-deep-loop-core-isolation-deliberation (leaf) | Moved as 022 | 022 |
| 118-deep-loop-full-isolation-no-mcp (phase parent, 8 subphases + untracked 009) | Subphases 001–008 flattened to 023–030; parent shell removed; 009 artifacts → 131/scratch/ | 023 through 030 + scratch relocation |
| 119-deep-research-uplift (phase parent, 3 subphases) | Subphases flattened to 031–033; parent shell removed | 031 through 033 |
| 120-deep-research-iteration-ordering-fix (leaf) | Moved as 034 | 034 |
| 121-deep-research-uncovered-questions (leaf) | Moved as 035 | 035 |
| 122-deep-research-hygiene-fix-pack (leaf) | Moved as 036 | 036 |
| 123-deep-agent-improvement-uplift (phase parent, 3 subphases) | Subphases flattened to 037–039; parent shell removed | 037 through 039 |
| 124-deep-agent-improvement-correctness-fixes (leaf) | Moved as 040 | 040 |
| 124-sk-ai-council-shared-runtime-deliberation (leaf, ai-council artifacts) | Moved as 007 | 007 |
| 125-deep-agent-improvement-doc-version-reconciliation (leaf) | Moved as 041 | 041 |
| 126-deep-agent-improvement-evaluator-hardening (leaf) | Moved as 042 | 042 |
| 127-deep-agent-improvement-cross-runtime-promotion (leaf) | Moved as 043 | 043 |
| 128-deep-agent-improvement-mixed-executor-adjudication (leaf) | Moved as 044 | 044 |
| 129-deep-ai-council-iterative-multi-topic (phase parent, 6 subphases) | Subphases flattened to 008–013; parent shell removed | 008 through 013 |
| 130-deep-skills-unique-value-differentiation (leaf) | Moved as 045 | 045 |
<!-- /ANCHOR:source-history -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **45-child maintainability**: The new parent runs at the `is-phase-parent.js` ERROR-recommendation threshold (≥40 children). Future work may split into nested two-level structure if the manifest becomes unwieldy. Not blocking — advisory only.
- **In-flight phases**: Phases 008–013 (ai-council iterative), 022 (deep-loop core isolation deliberation), and 037–039 (deep-agent-improvement uplift) carry active continuity state. Resume via the new packet paths once Phase 6 reindex completes.
- **118/009 disposition**: Relocated to `scratch/118-009-research-workspace/` rather than promoted to a packet. If the deep-research iter-005 work resumes, a follow-on packet can adopt those artifacts.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: 45 folders enumerated in PHASE DOCUMENTATION MAP above
- **Skills modified (path rewrites only)**: `deep-research`, `deep-review`, `deep-agent-improvement`, `deep-ai-council`, `deep-loop-runtime`
- **Agents modified (path rewrites only, across 4 runtime mirrors)**: `deep-research`, `deep-review`, `ai-council`
- **Reuse patterns**: `113-cli-devin-prompt-quality-arc/spec.md` (template), `is-phase-parent.ts` (threshold helper), `generate-description.js` + `generate-context.js` (metadata refresh)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Snapshot for rollback**: `/tmp/131-consolidation/snapshot.json`
