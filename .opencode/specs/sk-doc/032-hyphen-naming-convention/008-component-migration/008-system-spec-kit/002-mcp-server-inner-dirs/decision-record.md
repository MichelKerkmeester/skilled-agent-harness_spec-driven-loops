---
title: "Decision Record: MCP-server inner directories (032 subtree 008 phase 002)"
description: "Design decisions for semantic inner-directory targets and test-support discovery preservation."
trigger_phrases:
  - "mcp-server inner-directory decisions"
  - "semantic directory rename map"
  - "phase 002 decision record"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/002-mcp-server-inner-dirs"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/008-system-spec-kit/002-mcp-server-inner-dirs"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded inner-directory decisions"
    next_safe_action: "Execute the semantic inner-directory map on the renamed package root"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: MCP-server inner directories

<!-- ANCHOR:context -->
## Context

The MCP tree has ordinary runtime directories and test-support names containing underscores. The root policy rejects mechanical _ to - conversion because it would create invalid targets such as --fixtures--. The phase must choose readable semantic targets and prove that Vitest and TypeScript discovery contracts remain intact.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Use explicit semantic targets
Map matrix_runners -> matrix-runners, plugin_bridges -> plugin-bridges, and stress_test -> stress-test. Map tests/__helpers__ -> tests/helpers, tests/_support -> tests/support, and tests/embedders/__fixtures__ -> tests/embedders/fixtures when those names are not tool-mandated.

### DR-002 — Classify runner-sensitive names before moving
A directory is preserved only when the actual test runner or package contract requires its exact name. The evidence must cite the config or discovery rule; naming convention alone is not an exemption.

### DR-003 — Move references with each directory
TypeScript globs, Vitest setup paths, stress commands, README links, and relative imports are part of the same dependency-closed batch. No code identifier or Python import path is rewritten.

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- Semantic mapping avoids leading and doubled hyphens while keeping support paths readable.
- Test discovery becomes an explicit acceptance check rather than an assumption about directory names.
- Any preserved test-magic name is visible in the disposition ledger and can be reviewed by phase 003.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Program semantic-map policy: sk-doc/032-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md, DR-005 and DR-008.
- Discovery evidence: mcp_server/tsconfig.json, mcp_server/vitest.config.ts, and mcp_server/vitest.stress.config.ts.
- Phase specification: spec.md.
<!-- /ANCHOR:references -->

