---
title: "Decision Record: Codex Audit Remediation Closure [008-codex-audit/decision-record]"
description: "memory-crud.ts held multiple responsibilities that increased review cost and regression risk. The codex audit required improving maintainability without breaking runtime entrypo..."
trigger_phrases:
  - "decision"
  - "record"
  - "codex"
  - "audit"
  - "remediation"
  - "decision record"
  - "008"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Codex Audit Remediation Closure

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Split `memory-crud` into a stable facade plus focused modules

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | Codex audit remediation maintainers |

---

### Context

`memory-crud.ts` held multiple responsibilities that increased review cost and regression risk. The codex audit required improving maintainability without breaking runtime entrypoints that other handlers and tests already depended on.

### Constraints

- Existing MCP registration and call sites expected the same top-level `memory-crud` surface.
- Remediation had to stay focused and avoid broad unrelated cleanup in the test directory.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep `memory-crud.ts` as a thin facade and move operation logic into dedicated modules for delete, update, list, stats, health, state, types, and utilities.

**How it works**: The facade preserves the public handler contract and delegates to focused modules. Shared state and helper concerns live in `memory-crud-state.ts`, `memory-crud-types.ts`, and `memory-crud-utils.ts` so operation modules can stay cohesive and testable.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Facade + split modules (chosen)** | Preserves API stability, improves maintainability, supports targeted tests | Introduces more files to navigate | 9/10 |
| Incremental cleanup inside monolithic file | Fewer file moves, lower short-term churn | Coupling remains high and future changes stay risky | 6/10 |
| Full handler rewrite with new API | Max architectural freedom | High compatibility risk and out-of-scope blast radius | 4/10 |

**Why this one**: This option reduced complexity where the audit found risk while preserving compatibility guarantees. It delivered the best balance of maintainability and safety for a scoped remediation pass.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Handler concerns are clearly separated by operation, making debugging and review faster.
- Documentation now maps to runtime structure in `mcp_server/handlers/README.md` and `mcp_server/README.md`.

**What it costs**:
- Contributors must track multiple small files instead of one large file. Mitigation: explicit naming conventions and updated README architecture notes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Missing facade delegation path | H | Keep full-suite tests green and preserve export contract |
| Threshold tuning over-corrects | M | Restrict changes to known flaky assertions and keep functional assertions intact |
| Scope confusion with old test debt | M | Record pre-existing alignment debt as out of scope in summary docs |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Audit findings required decomposition and stability fixes |
| 2 | **Beyond Local Maxima?** | PASS | Compared split-facade approach with monolith cleanup and rewrite |
| 3 | **Sufficient?** | PASS | Facade split solved maintainability need without API break |
| 4 | **Fits Goal?** | PASS | Directly addressed codex remediation objectives |
| 5 | **Open Horizons?** | PASS | Supports future targeted handler changes with lower coupling |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Converted `mcp_server/handlers/memory-crud.ts` into facade orchestration layer.
- Added modular handler files: `memory-crud-delete.ts`, `memory-crud-update.ts`, `memory-crud-list.ts`, `memory-crud-stats.ts`, `memory-crud-health.ts`, `memory-crud-state.ts`, `memory-crud-types.ts`, `memory-crud-utils.ts`.
- Updated docs and stabilized flaky timing assertions in `envelope.vitest.ts` and `integration-138-pipeline.vitest.ts`.

**How to roll back**: Revert the modularization commit range, restore prior monolithic `memory-crud.ts`, revert threshold edits, and re-run `npm test -- --silent` in `mcp_server`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
