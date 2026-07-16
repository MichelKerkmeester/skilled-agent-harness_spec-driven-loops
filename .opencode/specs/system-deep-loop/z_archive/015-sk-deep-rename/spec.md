---
title: "Feature Specification: sk-deep-* → deep-* Skill Rename — Phase Parent"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Phase parent for renaming sk-deep-review → deep-review and sk-deep-research → deep-research across the entire repo. Simple semantic rename with broad cross-file reference impact (~700-1000+ files across .opencode/, .claude/, .codex/, .gemini/, root docs, configs, skill graph)."
trigger_phrases:
  - "070 sk-deep rename"
  - "sk-deep-review to deep-review"
  - "sk-deep-research to deep-research"
  - "skill rename refactor"
  - "drop sk- prefix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/015-sk-deep-rename"
    last_updated_at: "2026-05-05T18:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Initialize phase parent + 6 child scaffolds + resource map"
    next_safe_action: "Phase 001 discovery via cli-codex"
    blockers: []
    key_files:
      - "spec.md"
      - "resource-map.md"
      - "001-discovery-impact-map/spec.md"
      - "002-skill-folder-rename/spec.md"
      - "003-opencode-internals/spec.md"
      - "004-runtime-mirrors/spec.md"
      - "005-root-and-config/spec.md"
      - "006-advisor-and-validate/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-05"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This document is the PARENT spec for the 6-phase sk-deep-* → deep-* skill rename.
  All planning, tasks, checklists, decisions, and continuity live in the child phase folders 001..006.
  This file declares ROOT PURPOSE, the SUB-PHASE MANIFEST, and WHAT NEEDS DONE — nothing else.
-->

# Feature Specification: sk-deep-* → deep-* Skill Rename — Phase Parent

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../` (skilled-agent-orchestration top-level) |
| **Parent Packet** | `skilled-agent-orchestration` |
| **Predecessor** | 069-sk-code-motion-dev-and-playbook |
| **Successor** | (none yet — TBD) |
| **Handoff Criteria** | All 6 phases validate strict; advisor probes confirm new skill names route correctly; final grep returns zero hits for `sk-deep-review` or `sk-deep-research` outside historical commit/log artifacts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The two deep-* skills currently use a `sk-` prefix (`sk-deep-review`, `sk-deep-research`) inherited from when all skills carried it. Since then, several skills have been renamed without the prefix (e.g., system-spec-kit, mcp-coco-index, cli-codex). The two `sk-deep-*` names now stand out as inconsistent. The user wants them renamed to `deep-review` and `deep-research` to match the rest of the family.

This is a SIMPLE semantic rename — no behavior change, no scope reshuffle — but it has BROAD cross-file impact:
- 704 files reference `sk-deep-review`
- 1029 files reference `sk-deep-research`
- (with significant overlap, total unique files in the high hundreds to low thousands)
- Spans: `.opencode/`, `.claude/`, `.codex/`, `.gemini/`, root docs, configs, skill graph, advisor signals, MCP server code

### Purpose
Decompose the rename into 6 sequential phases that minimize risk and parallelize where safe:

- **001-discovery-impact-map** authors a comprehensive inventory of every file that needs touching, grouped by area, with edge cases flagged (filename embeds, URL paths, code-graph node IDs, etc.).
- **002-skill-folder-rename** physically renames the two skill folders via `git mv` and updates the skill-graph.json keys + signal references; runs advisor_rebuild.
- **003-opencode-internals** updates every reference inside the `.opencode/` tree (skills, agents, commands, MCP server code, scripts, tests, test fixtures).
- **004-runtime-mirrors** updates `.claude/`, `.codex/`, `.gemini/` runtime mirror references in parallel (each is independent of the others).
- **005-root-and-config** updates root-level docs (README.md, AGENTS.md, CLAUDE.md) and config files (opencode.json, .utcp_config.json, settings.json) and any other repo-root references.
- **006-advisor-and-validate** rebuilds the skill-graph.sqlite, runs advisor probes confirming new names route correctly, validates strict, and dispatches an Opus @review sub-agent for final cross-file consistency.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level alongside `resource-map.md` and the canonical lean trio (`description.json`, `graph-metadata.json`). All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders 001..006.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Renaming `.opencode/skills/sk-deep-review/` → `.opencode/skills/deep-review/`
- Renaming `.opencode/skills/sk-deep-research/` → `.opencode/skills/deep-research/`
- Updating ALL references to the old names throughout the repo, including:
  - SKILL.md routing tables, smart router pseudocode
  - Agent definitions across 4 runtimes (.opencode, .claude, .codex, .gemini)
  - Command files referencing the deep-* skills (e.g., `/speckit:deep-review`, `/speckit:deep-research`)
  - MCP server code, scripts, test fixtures
  - skill-graph.json (keys, signals, anti-signals, families, hub_skills, adjacency)
  - graph-metadata.json files for the renamed skills
  - description.json files
  - changelog entries (latest commits referencing the old names — historical commits left as-is)
  - Root-level docs (README.md, AGENTS.md, CLAUDE.md if exists)
  - Configs (opencode.json, .utcp_config.json, settings.json/.local.json)
  - Test fixtures and snapshot files
- Rebuilding the skill-graph.sqlite via advisor_rebuild
- Verifying advisor probes route the new names correctly

### Out of Scope (at the parent level)
- Behavior changes to either skill — the rename is purely semantic
- Updating committed git log messages — historical commits keep their original wording
- Updating archived spec folders that mention the old names — they're frozen historical context
- Renaming sibling skills that already follow the new convention (system-spec-kit, mcp-coco-index, sk-code, sk-doc, etc.)

### Files to Change (per-phase blast radius)

| Phase | Folder | Estimated file count | Risk |
|-------|--------|----------------------|------|
| 001 | `001-discovery-impact-map/` | 0 (read-only inventory) | None |
| 002 | `002-skill-folder-rename/` | 2 folder renames + skill-graph.json | Medium (impacts immediate routing) |
| 003 | `003-opencode-internals/` | ~500-700 .opencode/ files | High (largest blast radius) |
| 004 | `004-runtime-mirrors/` | ~50-100 .claude/.codex/.gemini files | Low-medium |
| 005 | `005-root-and-config/` | ~10-20 root files | Low |
| 006 | `006-advisor-and-validate/` | 0 source mods (verification only) | None |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | [001-discovery-impact-map/](./001-discovery-impact-map/) | Comprehensive grep inventory of all references to old names; resource map authoring | Draft |
| 002 | [002-skill-folder-rename/](./002-skill-folder-rename/) | git mv skill folders + skill-graph.json key updates + advisor_rebuild | Draft |
| 003 | [003-opencode-internals/](./003-opencode-internals/) | Update all .opencode/ references in parallel by sub-tree | Draft |
| 004 | [004-runtime-mirrors/](./004-runtime-mirrors/) | Update .claude/, .codex/, .gemini/ in parallel | Draft |
| 005 | [005-root-and-config/](./005-root-and-config/) | Root docs (README, AGENTS, CLAUDE) + configs | Draft |
| 006 | [006-advisor-and-validate/](./006-advisor-and-validate/) | Advisor rebuild, probe verification, opus review | Draft |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` before the next begins
- Phase 001 produces the canonical inventory list that 002–005 work against
- Phase 002 MUST complete before 003 (folder rename precedes reference updates so paths exist)
- Phases 003, 004, 005 can run with cli-codex in parallel (different file subtrees, no overlap)
- Phase 006 is final verification — runs after all preceding phases pass

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | Inventory complete; resource-map.md filled; estimated counts accurate | grep counts match resource-map estimates |
| 002 | 003 | Skill folders renamed; skill-graph.json keys updated; advisor reports live | advisor_status returns generation bumped |
| 003 | 004 | All .opencode/ references updated; no regressions in advisor lookups | grep .opencode for old names returns 0 |
| 004 | 005 | All runtime mirror refs updated | grep .claude .codex .gemini for old names returns 0 |
| 005 | 006 | Root docs + configs updated | grep root for old names returns 0 |
| 006 | (done) | Advisor probes confirm new names route correctly; opus reviewer approves; full grep returns 0 hits outside historical artifacts | full validate.sh --recursive PASSED |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Are there code-graph node IDs (in `.cocoindex_code/` or similar embeddings databases) that hold the old skill names? If yes, those need a separate re-index pass — captured in Phase 001's edge-case audit.
- Do the historical changelog entries reference the old names? Yes — those stay as-is (they're historical record); only NEW changelog entries from this rename use the new names.
- Are there spec folders under `z_archive/` that mention the old names? Yes — those are frozen historical context; left untouched per CLAUDE.md `--active-only` semantics.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `001-*` through `006-*` for per-phase spec.md, plan.md, tasks.md, checklist.md
- **Parent Spec**: See `../` (skilled-agent-orchestration)
- **Resource Map**: See [resource-map.md](./resource-map.md)
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Predecessor**: `069-sk-code-motion-dev-and-playbook` (just completed)
