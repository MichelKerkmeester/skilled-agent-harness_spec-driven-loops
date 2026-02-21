# Decision Record: Spec 140 Default-On Hardening

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-documentation/references/hvr_rules.md -->

---

## TABLE OF CONTENTS
- [1. OVERVIEW](#1--overview)

## 1. OVERVIEW

This document records key architectural and execution decisions made during Spec 140 hardening.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Default-On Runtime Policy + Shared Module Consolidation

<!-- ANCHOR:adr-001-context -->
### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-21 |
| **Deciders** | Spec 140 implementation owner |

---

### Context

Specs 136/138/139 had drift between feature intent and runtime behavior. Several features depended on opt-in behavior or partial wiring, and SGQS/chunker utilities were split across workspaces with generated source-adjacent artifacts. This caused typecheck instability, weak runtime guarantees, and test gaps for key command and handler workflows.

### Constraints

- Must preserve current feature set and avoid unrelated architecture changes.
- Must keep behavior default-on with explicit opt-out (`FLAG=false`) only.
- Must keep implementation inside `system-spec-kit` and pass full quality gates.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: enforce a strict default-on contract and consolidate SGQS/chunker runtime utilities into shared modules consumed by both scripts and MCP server.

**How it works**: feature flags now resolve through default-on semantics and explicit false opt-out. Deep-mode semantic bridge expansion is wired directly into runtime query variant generation, with dedicated runtime tests. SGQS/chunker cross-workspace imports now consume shared modules, and source-adjacent generated artifacts for migrated modules were removed.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Default-on + shared consolidation (chosen)** | Aligns behavior to spec contract, removes import boundary fragility, testable end-to-end | Requires coordinated updates across scripts, MCP, tests, and docs | 9/10 |
| Keep mixed opt-in behavior and local module duplicates | Lower immediate edit count | Leaves dead paths, recurring typecheck failures, and behavioral mismatch | 4/10 |

**Why this one**: it is the only option that closes contract mismatch, removes dead paths, and keeps all verification gates green without adding new feature surface.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Runtime behavior now matches default-on policy across covered features.
- Type boundaries are stable with shared module imports and green typecheck.

**What it costs**:
- Requires maintaining shared module contracts for SGQS/chunker. Mitigation: typecheck + dedicated tests enforce contract.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Default-on can expose behavior users previously left disabled by omission | M | Explicit `FLAG=false` opt-out preserved and documented |
| Future regressions in deep bridge wiring | M | Runtime test `deep-semantic-bridge-runtime.vitest.ts` + full MCP suite |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Directly addresses failing gates and contract drift |
| 2 | **Beyond Local Maxima?** | PASS | Compared with minimal patch alternative; rejected incomplete option |
| 3 | **Sufficient?** | PASS | No new feature scope added; hardening only |
| 4 | **Fits Goal?** | PASS | Matches Spec 140 scope and acceptance criteria |
| 5 | **Open Horizons?** | PASS | Shared-module layout reduces future boundary errors |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Enforced default-on semantics in runtime and phase scripts.
- Integrated deep semantic bridge runtime expansion and added SGQS/deep bridge runtime tests.
- Consolidated SGQS/chunker shared imports and removed source-adjacent generated artifacts for migrated modules.

**How to roll back**: revert Spec 140 change set, then rerun `npm run typecheck`, `npm run test --workspace=mcp_server`, and `npm test` to confirm pre-change baseline.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
