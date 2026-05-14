---
title: "Phase Parent: Extract skill advisor into dedicated `system-skill-advisor` skill folder"
description: "Migrate the skill advisor subsystem out of system-spec-kit's MCP server into a dedicated `.opencode/skills/system-skill-advisor/` package with its own SKILL.md, references, manual_testing_playbook, feature_catalog, and a clear MCP server integration story."
trigger_phrases:
  - "system skill advisor extraction"
  - "skill advisor package move"
  - "skill advisor own skill folder"
  - "advisor mcp server separation"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-system-skill-advisor-extraction"
    last_updated_at: "2026-05-14T02:00:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded phase parent + child 001"
    next_safe_action: "Dispatch codex on child 001 design"
    blockers: []
    key_files:
      - "spec.md"
      - "description.json"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000016"
      session_id: "016-system-skill-advisor-extraction"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the extracted advisor ship its own MCP server process, OR stay in-process with the system-spec-kit MCP server but be referenced from the new skill folder?"
      - "How do existing tool ids (`advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`) get preserved during migration?"
      - "Backwards-compat path: do consumers continue to call the same MCP tools by name, or do they migrate to a new `system_skill_advisor.*` namespace?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 phase-parent -->
# Phase Parent: Extract skill advisor into dedicated `system-skill-advisor` skill folder

<!-- SPECKIT_LEVEL: phase -->

---

## Root Purpose

The skill advisor today lives at `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/`. It is a sizeable subsystem — handlers, scorer fusion, lane registry, scorer lanes, daemon lifecycle, projection, ablation, schemas, tests, feature_catalog, manual_testing_playbook, plus a `references/` tree — buried 5 levels deep inside `system-spec-kit`. That coupling makes it harder to:

- Discover the advisor as a first-class skill via the standard `.opencode/skills/<id>/` convention.
- Reason about its scope, since it shares the umbrella `system-spec-kit` SKILL.md and graph-metadata.json with the memory MCP server, code graph, doctor commands, etc.
- Iterate on its public surface (tool ids, scoring lanes, lifecycle) independently from the broader `system-spec-kit` package.
- Author advisor-specific documentation (catalog, playbook, README, references) without entangling with `system-spec-kit/feature_catalog/` or `system-spec-kit/manual_testing_playbook/` content that covers memory, code graph, doctor, etc.

This phase migrates the advisor into `.opencode/skills/system-skill-advisor/` with its own first-class SKILL.md, graph-metadata.json, references/, manual_testing_playbook/, feature_catalog/, and a clean MCP server integration story.

The 015 line proved the advisor is empirically stable and well-instrumented; this is a structural cleanup, not a functional change.

## Sub-Phase Control File

This is the phase parent. The lean trio (`spec.md`, `description.json`, `graph-metadata.json`) lives at this level. Heavy authoring lives in the children.

## What Needs Done

- Child **001-design-and-decision-record** *(scaffolded; runs first)*: read the current advisor's full surface area, enumerate 3-4 architectural shapes for the extracted skill, evaluate against a fixed set of criteria (developer ergonomics, MCP server topology, tool-id stability, backwards-compat path, test isolation), pick a winner, write the ADR. NO code moves in this phase. Output: `001-design-and-decision-record/decision-record.md` with ADR-001 locking the migration shape.

- Child **002-scaffold-new-skill-folder** *(NOT YET scaffolded; depends on 001 ADR)*: create `.opencode/skills/system-skill-advisor/` with SKILL.md, graph-metadata.json, references/, manual_testing_playbook/, feature_catalog/, README.md. Author from existing system-spec-kit advisor docs.

- Child **003-move-source-and-tests** *(NOT YET scaffolded; depends on 001+002)*: physically move `mcp_server/skill_advisor/` to its new location. Update imports. Decide whether the advisor ships its own MCP server or stays in-process per ADR-001.

- Child **004-update-consumers-and-tool-registration** *(NOT YET scaffolded; depends on 003)*: every caller of advisor tools and Vitest references; update tool registrations in tool-schemas.ts and context-server.ts.

- Child **005-validation-and-cleanup** *(NOT YET scaffolded; depends on 004)*: full Vitest run, advisor_recommend live probes, delete old paths, update install_guides/READMEs.

The decomposition into 5 phases is provisional. The exact child set is finalized by 001's ADR.

## Out of Scope (for this phase parent)

- Changing advisor scoring math, lane weights, or any 015-line work.
- Migrating other subsystems (memory MCP server, code graph, doctor) out of `system-spec-kit`.
- Changing public tool IDs without backwards-compat — preserved unless ADR-001 chooses otherwise.

## Dependencies

- `015-skill-advisor-semantic-lane` shipped (commit `48d5470bc` and earlier on main). The 015 line stabilized advisor behavior so a structural migration is safe.
- `010-template-levels` shipped (template foundations for the new skill's documentation).
