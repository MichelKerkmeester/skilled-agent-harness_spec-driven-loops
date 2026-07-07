---
title: "Decision Record: Standalone Advisor MCP With Legacy Tool Bridge"
description: "ADR-001 locks the standalone system skill advisor MCP shape, legacy advisor_* tool ids, temporary memory-side bridge, and test-only DB override policy."
trigger_phrases:
  - "standalone advisor mcp adr"
  - "system skill advisor extraction decision"
  - "advisor legacy tool bridge"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/001-extraction-design-and-adr"
    last_updated_at: "2026-05-14T07:35:00Z"
    last_updated_by: "codex"
    recent_action: "Accepted ADR-001 for standalone advisor MCP with legacy bridge"
    next_safe_action: "Scaffold child 002 system-skill-advisor package"
    blockers: []
    key_files:
      - "decision-record.md"
      - "research/extraction-survey.md"
      - "implementation-summary.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Standalone Advisor MCP With Legacy Tool Bridge

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Standalone Advisor MCP With Legacy Tool Bridge

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-14 |
| **Decider** | Codex, using packet 015/009/001 operator constraints and research discussion |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 015 skill-advisor semantic-lane line is stable enough for a structural extraction. The parent phase states that this is not a scoring change: it moves a proven advisor subsystem out of `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/` into a first-class `.opencode/skills/system-skill-advisor/` package.

Two operator constraints are locked before implementation:

- **Constraint A - DB-LOCAL**: `skill-graph.sqlite` and sidecars must live under `.opencode/skills/system-skill-advisor/`, not beside the memory MCP database.
- **Constraint B - STANDALONE-MCP**: advisor tools must run from their own MCP server process, separate from `spec_kit_memory`.

The current state couples advisor registration to `spec_kit_memory`: `tool-schemas.ts` imports advisor descriptors from `./skill_advisor/tools/index.js`, appends them to `TOOL_DEFINITIONS`, and `tools/index.ts` dispatches the four `advisor_*` handlers. Runtime configs in OpenCode, Codex, Claude, and Gemini currently register only `spec_kit_memory` through `.opencode/bin/spec-kit-memory-launcher.cjs`; none register a sibling advisor server.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: **Standalone Advisor MCP With Legacy Tool Bridge**.

The extracted package will own its MCP server, database path, launcher, tool descriptors, schemas, handlers, tests, feature catalog, playbook, and references under `.opencode/skills/system-skill-advisor/`. The runtime MCP server id will be `system_skill_advisor`. The public tool ids stay stable as `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`; server-level namespacing supplies the new boundary.

The three operator questions are answered as follows:

| Question | Decision | Rationale |
|----------|----------|-----------|
| Tool-id stability | **Keep `advisor_*` stable** | Existing hooks, Python shim, plugin bridge, doctor workflows, install guides, tests, and operator docs already name these ids. Renaming them during process extraction creates churn without adding real isolation. |
| `spec_kit_memory` cutover behavior | **Keep deprecated proxy tools during one migration window** | A short bridge avoids breaking callers still bound to the old server while runtime configs and hook wrappers move. The bridge is temporary and removed in child 006 after cutover evidence is green. |
| DB env override | **Allow `SYSTEM_SKILL_ADVISOR_DB_DIR` for tests/CI only** | Default runtime state remains DB-local under the new skill folder. Tests and disposable CI runs need temp roots to avoid mutating operator state. Production docs should treat the override as non-default. |

The standalone server owns advisor descriptors and Zod validation. The memory MCP server must stop importing advisor implementation modules after the cutover, except for the temporary bridge layer.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

Scores use 1-5 where 5 is best for the criterion.

| Shape | Developer ergonomics | MCP server topology | Tool-id stability | Backwards-compat | Test isolation | Launcher/install complexity | Accept/Reject Rationale |
|-------|----------------------|---------------------|-------------------|------------------|----------------|-----------------------------|-------------------------|
| **Standalone-MCP-legacy-bridge** | 5 | 4 | 5 | 5 | 5 | 3 | **Accepted.** Gives the advisor a real package and process boundary while keeping live callers on stable `advisor_*` ids. Complexity is the extra launcher/config entry plus one temporary proxy window. |
| **Standalone-MCP-namespaced** | 4 | 4 | 2 | 2 | 5 | 3 | Rejected for first extraction. It satisfies standalone and DB-local constraints, but `system_skill_advisor.*` or renamed ids force broad hook, shim, docs, tests, and operator-guide churn at the same time as the process move. |
| **Co-resident with `spec_kit_memory`** | 3 | 5 | 5 | 4 | 2 | 5 | Rejected. It keeps the current single-process ergonomics, but violates Constraint B because advisor tools still run inside the memory MCP server. It also keeps test and DB ownership coupled to system-spec-kit. |
| **Stub-and-reexport** | 2 | 2 | 4 | 3 | 1 | 2 | Rejected. A new folder that re-exports old paths looks migrated but preserves the old dependency direction, DB location, and runtime ownership. It is useful only as a very short compatibility tactic inside the accepted bridge, not as the target shape. |

The accepted shape is the only candidate that satisfies both hard constraints and avoids a simultaneous public tool-id migration.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- The advisor becomes discoverable as a first-class `.opencode/skills/system-skill-advisor/` skill.
- The skill-graph DB ownership moves with the package that writes and consumes it.
- Advisor tests can run package-locally without unrelated memory MCP startup.
- Runtime failures become easier to diagnose because `spec_kit_memory` and `system_skill_advisor` start independently.
- Existing callers keep the same `advisor_*` tool ids during extraction.

**What it costs**:

- Four runtime configs need a sibling `system_skill_advisor` MCP entry.
- A new launcher must duplicate the useful cold-start pattern from `spec-kit-memory-launcher.cjs`.
- The memory server needs a temporary deprecated bridge or explicit fail-fast path until callers finish moving.
- Documentation must update old claims such as "do not register a second MCP server."

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Duplicate startup/build plumbing | Medium | Model `.opencode/bin/skill-advisor-launcher.cjs` on the existing memory launcher, but scope artifact checks, lock/state files, and DB dir to `system-skill-advisor`. |
| Embedding-provider dependency leakage | Medium | Share embedding code as a library dependency in the short term; do not share runtime provider instances across MCP processes. Track neutral shared-runtime extraction as a future option if naming/coupling becomes painful. |
| Concurrent graph writers | High | Make the standalone advisor server the only writer for `skill-graph.sqlite`. Memory-side bridge tools may delegate or fail fast, but must not open the same SQLite file for writes after cutover. |

**Trigger to revisit**: a future packet may amend this ADR if child 003 proves the advisor cannot build or test package-locally without a prerequisite shared-runtime extraction.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The parent phase locks DB-local and standalone-MCP constraints; an ADR is needed before source moves. |
| 2 | **Beyond Local Maxima?** | PASS | Compared standalone legacy bridge, standalone namespaced, co-resident, and stub-and-reexport shapes. |
| 3 | **Sufficient?** | PASS | The decision answers tool ids, bridge behavior, DB override policy, runtime config strategy, and ownership boundaries. |
| 4 | **Fits Goal?** | PASS | The shape extracts advisor ownership without changing scoring math, lane weights, or public behavior. |
| 5 | **Open Horizons?** | PASS | Leaves later packets free to scaffold, move source/tests, add launcher/configs, cut over hooks, and remove temporary proxies. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

This ADR adopts the locked migration sequence already listed in the parent 015/009 `spec.md` "What Needs Done" section:

1. **002-system-skill-advisor-package-scaffold**: create `.opencode/skills/system-skill-advisor/` docs, metadata, feature catalog, playbook, references, DB-path policy, install-guide stubs, and empty MCP scaffold.
2. **003-advisor-source-db-tests-migration**: move advisor handlers, lib, tools, schemas, scripts, compat, tests, and DB path resolver into the new package.
3. **004-standalone-mcp-launcher-runtime-configs**: add `skill-advisor-launcher.cjs`, standalone MCP entrypoint, and `system_skill_advisor` entries in OpenCode, Codex, Claude, and Gemini configs.
4. **005-hook-compatibility-consumer-cutover**: move or wrap hooks, plugin bridge, Python shim, doctor workflow, install guides, and direct consumers while keeping `advisor_*` ids.
5. **006-clean-validation-and-remove-deprecated-code**: verify package-local tests, hook smoke tests, runtime configs, live probes, DB path, and docs; then remove old source paths and temporary memory-side proxies.

This packet does not move code, modify runtime configs, or create the new skill folder.
<!-- /ANCHOR:adr-001-impl -->

---

<!-- ANCHOR:adr-001-rollback -->
### Rollback

Revert this commit. The design then defers to a future amendment packet before children 002-006 proceed.
<!-- /ANCHOR:adr-001-rollback -->
<!-- /ANCHOR:adr-001 -->
