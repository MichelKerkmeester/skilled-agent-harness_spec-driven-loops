---
title: "Feature Specification: Deprecate Standalone Deep Context"
description: "Phase parent for deprecating the standalone deep-context command, agent, nested mode, and discoverability surfaces while preserving useful codebase-context behavior inside deep-research and deep-review."
trigger_phrases:
  - "deep-context deprecation"
  - "deprecate /deep:context"
  - "integrate context report into deep research"
  - "integrate context report into deep review"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-deprecate-deep-context-integrate-capabilities"
    last_updated_at: "2026-07-04T18:32:06Z"
    last_updated_by: "opencode"
    recent_action: "Validated all four child phases for standalone deep-context deprecation"
    next_safe_action: "Recover Spec Memory daemon and reindex packet metadata"
    blockers:
      - "Spec Memory daemon indexing is unavailable: socket absent."
    key_files:
      - "001-research-baseline-and-inventory/spec.md"
      - "002-public-redirect-and-replacement-contracts/spec.md"
      - "003-discoverability-docs-mirrors-and-index/spec.md"
      - "004-fixtures-benchmarks-and-runtime-cleanup/spec.md"
      - "001-research-baseline-and-inventory/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-parent-conversion"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Spec Memory reindex pending daemon recovery."
    answered_questions:
      - "User approved the phased conversion plan."
      - "Completed research evidence is owned by phase 001."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Deprecate Standalone Deep Context

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent |
| **Priority** | P1 |
| **Status** | Validated |
| **Created** | 2026-07-04 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Spec Folder** | `.opencode/specs/deep-loops/035-deprecate-deep-context-integrate-capabilities/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-loop framework still exposes a standalone `deep-context` route through command, agent, nested skill, registry, advisor, generated contract, documentation, fixture, and benchmark surfaces. That creates an overlapping codebase-analysis lane beside `deep-research`, `deep-review`, and the one-shot `@context` retrieval agent.

### Purpose

Coordinate the phased deprecation of standalone `deep-context` while preserving the valuable reuse-first context snapshot shape inside `deep-research` and `deep-review`.

> This parent is intentionally lean. Detailed plans, tasks, checklists, decisions, continuity, and research evidence live in the child phase folders listed below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Public `/deep:context` deprecation and replacement guidance.
- Context snapshot contracts for `deep-research` and `deep-review`.
- Discoverability cleanup across registry, advisor, docs, generated command contracts, and OpenCode/Claude mirrors.
- Fixture, benchmark, nested packet, and optional internal runtime cleanup after earlier phases pass.
- Preservation of historical context artifacts as records unless active fixture or index behavior requires a scoped update.

### Out of Scope

- Replacing the general `@context` retrieval agent.
- Editing historical archived specs only to remove old `deep-context` mentions.
- Changing `deep-ai-council` or `deep-improvement` behavior except where active docs enumerate supported modes.
- Creating a new standalone context loop under another name.

### Aggregate File Scope

| Surface | Change Type | Phase | Description |
|---------|-------------|-------|-------------|
| `/deep:context` command and `deep_context_*` assets | Modify/archive | 002, 004 | Stop new standalone runs, then archive old assets after replacement paths are verified. |
| `deep-research` and `deep-review` workflow docs/contracts | Modify | 002 | Add cited context snapshot expectations without importing the standalone loop. |
| Registry, advisor, generated contracts, README/AGENTS, OpenCode/Claude agents | Modify/regenerate | 003 | Remove standalone discoverability and synchronize user-facing guidance. |
| Active fixtures, behavior benchmarks, nested `deep-context` packet, runtime `context` branches | Modify/archive/delete | 004 | Remove active fixture dependencies and defer internal runtime cleanup unless tests pass. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

Each phase is an independently executable child spec folder. Run child validation before moving to the next phase and run recursive validation from this parent after metadata refresh.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-research-baseline-and-inventory/` | Own completed research, active-reference inventory, baseline probes, and phase conversion evidence. | validated |
| 2 | `002-public-redirect-and-replacement-contracts/` | Add replacement context snapshot contracts and make `/deep:context` fail closed with replacement guidance. | validated |
| 3 | `003-discoverability-docs-mirrors-and-index/` | Clean registry, advisor, generated contracts, active docs, and OpenCode/Claude mirrors. | validated |
| 4 | `004-fixtures-benchmarks-and-runtime-cleanup/` | Retire active fixtures/benchmarks, archive nested packet assets, and retain only tested historical context artifact compatibility. | validated |

### Phase Transition Rules

- Each child phase validates independently before the next child begins.
- The parent tracks aggregate progress only; child docs own implementation detail.
- `research/research.md` evidence is phase 001 material.
- Parent recursive validation must pass before runtime deprecation work is claimed ready.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-research-baseline-and-inventory` | `002-public-redirect-and-replacement-contracts` | Research evidence is anchored, inventory classes are named, and baseline probes are recorded or explicitly pending. | Phase 001 `validate.sh --strict` plus inventory evidence in phase 001 docs. |
| `002-public-redirect-and-replacement-contracts` | `003-discoverability-docs-mirrors-and-index` | Replacement contracts exist and `/deep:context` no longer loads legacy YAML. | Command contract/compiler checks and direct command behavior check. |
| `003-discoverability-docs-mirrors-and-index` | `004-fixtures-benchmarks-and-runtime-cleanup` | Registry, advisor, docs, generated contracts, and mirrors agree on supported modes. | Advisor probes, grep parity, mirror parity, and generated-contract diff. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None blocking for the phased structure. Spec Memory reindexing remains pending daemon recovery.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase 001**: `001-research-baseline-and-inventory/spec.md`
- **Phase 002**: `002-public-redirect-and-replacement-contracts/spec.md`
- **Phase 003**: `003-discoverability-docs-mirrors-and-index/spec.md`
- **Phase 004**: `004-fixtures-benchmarks-and-runtime-cleanup/spec.md`
- **Graph Metadata**: `graph-metadata.json`
