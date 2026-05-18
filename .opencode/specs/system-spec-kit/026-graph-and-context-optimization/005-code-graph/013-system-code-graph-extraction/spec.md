---
title: "Initial Phase: code-graph extraction strategy"
description: "Migrate the code-graph subsystem out of system-spec-kit's MCP server into a dedicated `.opencode/skills/system-code-graph/` package with its own SKILL.md, references, manual_testing_playbook, feature_catalog, and a clean MCP server integration story."
trigger_phrases:
  - "system code graph extraction"
  - "code graph package move"
  - "code graph own skill folder"
  - "code graph mcp server separation"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/013-system-code-graph-extraction"
    last_updated_at: "2026-05-14T09:17:09Z"
    last_updated_by: "codex"
    recent_action: "All 7 sub-phases complete; standalone MCP topology shipped (ADR-002)"
    next_safe_action: "Restart MCP children to pick up new system_code_graph server entry"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000007140014"
      session_id: "013-system-code-graph-extraction"
      parent_session_id: null
    open_questions: []
    completion_pct: 100
    answered_questions:
      - "ADR-001 locks: co-resident MCP, stable tool-ids, moved DB with env fallback, sibling-skill imports, moved plugin bridge, 6-phase sequence (002-006), 6-risk catalog."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 phase-parent -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- RESTRUCTURED 2026-05-15: children promoted to 015-034, slot converted to initial leaf phase -->

# Initial Phase: code-graph extraction strategy

---

## 1. METADATA

| Field | Value |
|---|---|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Shipped |
| **Created** | 2026-05-14 |
| **Restructured** | 2026-05-15 (children promoted to 015-034) |

---

## 2. PROBLEM & PURPOSE

Code-graph today lives at `.opencode/skills/system-spec-kit/mcp_server/code_graph/`. It is a sizeable subsystem — 108 files (29 lib TS modules, 10 MCP handlers, 2 tool registrations, 28 vitest files plus a gold-queries asset, 16 in-package feature_catalog + manual_testing_playbook docs, 23 READMEs), 12 MCP tools (`code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`, `code_graph_verify`, `code_graph_apply`, `detect_changes`, `ccc_status`, `ccc_reindex`, `ccc_feedback`, plus 2 more dispatched through `tool-schemas.ts`), backed by `mcp_server/database/code-graph.sqlite` (55 MB live index with 7 exclusive tables: code_files / code_nodes / code_edges / code_graph_metadata / parse_diagnostics / parser_skip_list / schema_version), buried 5 levels deep inside `system-spec-kit`. It is consumed by 5 cross-subsystem handlers (memory-search, session-resume, session-bootstrap, session-health, memory-context), 6 startup-injection hooks across 4 runtimes, 7 agent files, 5 commands, a plugin bridge plus 2 `.mjs` siblings, a constitutional rule, and 4 top-level project docs.

That coupling makes it harder to:

- Discover code-graph as a first-class skill via the standard `.opencode/skills/<id>/` convention.
- Reason about its scope, since it shares the umbrella `system-spec-kit` SKILL.md and graph-metadata.json with the memory MCP server, skill-advisor, doctor commands, etc.
- Iterate on its public surface (tool ids `code_graph_*` / `ccc_*` / `detect_changes`, readiness contract, scan-scope policy, plugin bridge) independently from the broader `system-spec-kit` package.
- Author code-graph-specific documentation (catalog, playbook, README, references) without entangling with `system-spec-kit/feature_catalog/22--*/` and `manual_testing_playbook/22--*/` content that already exists at scale (33 + 30 = 63 category-22 docs).

This phase migrates code-graph into `.opencode/skills/system-code-graph/` with its own first-class SKILL.md, graph-metadata.json, references/, manual_testing_playbook/, feature_catalog/, and a clean MCP server integration story.

The 007 line — through `001-code-graph-upgrades`, `002-code-graph-context-and-scan-scope`, `005-code-graph-backend-resilience`, `010-broader-scope-excludes-and-granular-skills`, and `012-doctor-apply-mode-phase-b` — proved code-graph is empirically stable and well-instrumented; this is a structural cleanup, not a functional change.

## 8. FOLLOW-ON PHASES

All 20 children were promoted to direct `005-code-graph/` siblings on 2026-05-15 (015-034). Each has its own spec folder with full documentation.

## 3. SCOPE

All work is shipped. The extraction was executed in 6 phases (now at slots 015-020 as direct 005-code-graph siblings), followed by 14 follow-on phases (021-034).

- **001→014-design-and-decision-record** *(complete — ADR-001 accepted)*: 3-iteration deep-research loop answered all 8 questions. ADR-001 locks: co-resident MCP topology (in-process with spec_kit_memory), stable tool-ids (code_graph_*/ccc_* preserved), DB moves to new skill with SPECKIT_CODE_GRAPH_DB_DIR env fallback, cross-subsystem consumers import from sibling skill (../../system-code-graph/mcp_server/lib/), plugin bridge moves code-graph-specific files (shared message schema stays), 6-phase implementation sequence confirmed, 6-risk catalog with detection/mitigation/rollback. Full disposition catalog in resource-map.md (~280 touchpoints: ~170 move, ~90 update, ~25 stay-and-rewire, ~5 never-move).

- **002→016-scaffold-skill** *(complete)*: created `.opencode/skills/system-code-graph/` with SKILL.md, README.md, description.json, graph-metadata.json, package.json, tsconfig.json, vitest.config.ts, feature_catalog/, manual_testing_playbook/, database/, references/, lib/, handlers/, tools/, tests/.

- **003→017-physical-move-and-database** *(complete)*: moved code_graph/ tree to new skill location. Resolved DB path from new skill config with SPECKIT_CODE_GRAPH_DB_DIR env fallback.

- **004→018-rewire-consumers-and-tool-registration** *(complete)*: updated imports in live consumers: handlers, context-server, tools/index.ts, hooks, session snapshot, external tests, and skill-advisor refs.

- **005→019-doc-and-runtime-migration** *(complete)*: split category-22 docs. Updated agent files, command docs/assets, top-level docs/config, skill cross-refs, constitutional/config/memory references.

- **006→020-validation-and-cleanup** *(complete)*: full typecheck, full system-code-graph Vitest, system-spec-kit handler smoke, gold-query verifier, DB parity probe, stale-reference cleanup.

**The decomposition is locked by ADR-001.** All phases shipped on main.

## 4. OUT OF SCOPE

- Changing code-graph algorithms, parsing pipeline, scan-scope policy, query semantics, or any 007-line research/implementation work.
- Migrating other subsystems (memory MCP server, skill-advisor, doctor command surface) out of `system-spec-kit`.
- Changing public tool IDs without backwards-compat — preserved unless ADR-001 chooses otherwise.
- Retroactively modifying 002-code-graph-self-contained-package's spec metadata — its disposition is encoded in 014's graph-metadata.json `manual.supersedes` only.

## 7. DEPENDENCIES

- `005-code-graph/005-code-graph-backend-resilience` shipped on main (backend hardening before structural extraction).
- `005-code-graph/010-broader-scope-excludes-and-granular-skills` shipped on main (scan-scope policy stable).
- `008-template-levels` shipped (template foundations for the new skill's documentation).
- `015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction` precedent (in_progress; provides the design pattern this packet mirrors exactly).
- Acknowledgement: `005-code-graph/002-code-graph-self-contained-package` is superseded by 014 (scope strictly extended from intra-skill self-containment to standalone sibling-skill extraction; 002's partial work landed on disk during the 003-008 train and is reused as the starting point).

---

## Consolidation (2026-05-16, packet 107 W2.3 / M4)

Five extraction-phase packets (007/016, 007/017, 007/018, 007/019, 007/020) absorbed into this packet per resource-map.md §3.3 M4 (PROCEED). All five archived to z_archive/wave-2-merges/.
