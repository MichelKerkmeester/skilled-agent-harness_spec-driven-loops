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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction"
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
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000150009"
      session_id: "009-system-skill-advisor-extraction"
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

### Hard Operator Constraints

The operator set two constraints that narrow the candidate shapes BEFORE the ADR work begins:

- **Constraint A — DB-LOCAL**: the skill-graph database (`skill-graph.sqlite` + `-wal` + `-shm`) must live inside `.opencode/skills/system-skill-advisor/`. Today it sits at `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite` alongside the memory MCP's `context-index.sqlite`. After extraction it must be advisor-owned.
- **Constraint B — STANDALONE-MCP**: the advisor must run as its own MCP server process, separate from `spec_kit_memory`. Today its tools (`advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`) are registered on `spec_kit_memory`. After extraction they ship on a new `system_skill_advisor` MCP server.

Codex gpt-5.5 xhigh impact analysis of these constraints lives at `001-design-and-decision-record/research/standalone-mcp-discussion.md`. The discussion narrows the candidate architectural shapes from 4 down to 2 and **recommends "Standalone Advisor MCP With Legacy Tool Bridge"** — preserving the `advisor_*` tool ids on the new server, with `spec_kit_memory` either exposing deprecated proxy tools or fail-fast hints during a migration window.

### Open Questions for Operator

Codex surfaced 10 questions in the discussion artifact. Three of the most consequential, each gating a downstream packet's design choices:

1. Do `advisor_*` tool ids stay stable on the new server, or migrate to `system_skill_advisor.*` namespaced names?
2. Does `spec_kit_memory` keep deprecated proxy advisor tools during a migration window, or fail fast with a migration hint?
3. Should `SYSTEM_SKILL_ADVISOR_DB_DIR` env override be supported (tests/CI), or is the path fixed under the new skill folder?

Full list in the research artifact.

## Sub-Phase Control File

This is the phase parent. The lean trio (`spec.md`, `description.json`, `graph-metadata.json`) lives at this level. Heavy authoring lives in the children.

## What Needs Done

The codex impact discussion narrowed the shape to **Standalone Advisor MCP With Legacy Tool Bridge** and locked the constraint set. The 5-phase decomposition is now grounded in that analysis (see research artifact for full deliverable / dependency / effort detail):

- Child **001-design-and-decision-record** *(scaffolded; runs first)*: ADR-001 locks the "Standalone Advisor MCP With Legacy Tool Bridge" shape from the discussion, answers operator open questions inline, finalizes the per-runtime config update strategy. NO code moves. Output: `001-design-and-decision-record/decision-record.md`.

- Child **002-scaffold-advisor-package** *(NOT YET scaffolded; depends on 001)*: create `.opencode/skills/system-skill-advisor/` with `SKILL.md`, `README.md`, `graph-metadata.json`, `feature_catalog/`, `manual_testing_playbook/`, `references/`, and an empty `mcp_server/` scaffold. Package-local DB-path policy + install-guide stubs. **No runtime behavior moved yet.** Effort: M.

- Child **003-move-advisor-source-db-and-tests** *(NOT YET scaffolded; depends on 002)*: move advisor `handlers/`, `lib/`, `tools/`, `schemas/`, `scripts/`, `compat/`, tests into the new package. Move skill-graph DB code with it; switch the default DB dir to `.opencode/skills/system-skill-advisor/mcp_server/database/`. Give the package its own TypeScript/Vitest config. Leave memory-side proxy imports only if needed for 004. Effort: L.

- Child **004-standalone-mcp-launcher-and-runtime-configs** *(NOT YET scaffolded; depends on 003)*: add `.opencode/bin/skill-advisor-launcher.cjs`, standalone MCP server entrypoint, `system_skill_advisor` entries in `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json`, plus cold-start build/state handling. Keep `spec_kit_memory` alive for memory tools only. Effort: L.

- Child **005-hooks-compat-and-consumer-cutover** *(NOT YET scaffolded; depends on 004)*: update hook wrappers, Python shim, OpenCode plugin bridge, doctor skill-advisor workflow, install guides, and any direct `advisor_*` consumers to target the standalone package/server. Keep legacy tool ids. Add deprecation/proxy behavior in `spec_kit_memory` only if required by live consumers, with tests proving both paths. Effort: L.

- Child **006-validation-cleanup-and-deprecation-removal** *(NOT YET scaffolded; depends on 005)*: run package-local Vitest, Python parity, hook smoke tests, runtime config validation, advisor live probes, DB path verification, install guide checks. Remove old advisor source paths, stale docs that say "do not register a second MCP server", and any temporary `spec_kit_memory` proxies once consumers are cut over. Effort: M.

## Out of Scope (for this phase parent)

- Changing advisor scoring math, lane weights, or any 015-line work.
- Migrating other subsystems (memory MCP server, code graph, doctor) out of `system-spec-kit`.
- Changing public tool IDs without backwards-compat — preserved unless ADR-001 chooses otherwise.

## Dependencies

- `002-skill-advisor-semantic-lane` shipped (commit `48d5470bc` and earlier on main). The 015 line stabilized advisor behavior so a structural migration is safe.
- `008-template-levels` shipped (template foundations for the new skill's documentation).
