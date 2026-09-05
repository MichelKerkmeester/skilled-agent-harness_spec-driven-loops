---
title: "Implementation Plan: Phase 2: metadata-drift-and-rules"
description: "Prune foreign-identity children in the writer, add the child-identity rule to the registry, and add a read-only sweep over track roots."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "graph metadata child identity"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: metadata-drift-and-rules

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (writer), bash rule, Node ESM sweep |
| **Framework** | Vitest through the skill-root projects config; the compiled validation orchestrator reads the registry |
| **Storage** | Generated `graph-metadata.json` files |
| **Testing** | Writer suites, the rule against a known-drifted packet, the sweep against every track root |

### Overview
The writer's merge keeps the union of derived on-disk children but drops entries whose leading identity is not the packet's own; the CLI's prune prediction mirrors the lib's merge so report and apply agree. A shell rule reports anything the writer has not yet pruned. A sweep script walks `specs/*/graph-metadata.json` roots without `spec.md` and compares declared to actual.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Producer fix plus a reporting rule: the writer stops creating the drift, the rule catches what predates the fix, the sweep reaches the roots validation never visits.

### Key Components
- **Writer merge** in the graph-metadata parser: identity-aware pruning.
- **Rule** `check-graph-metadata-child-identity.sh`, registered as `GRAPH_METADATA_CHILD_IDENTITY`.
- **Sweep** `spec/sweep-track-roots.mjs`, read-only, exit 1 on drift.

### Data Flow
Refresh → derived children unioned → foreign-identity entries dropped → file written → rule reads the file → sweep compares track roots to disk.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Merge pruning and prediction parity | `tests/graph-metadata-refresh.vitest.ts`, `tests/backfill-prune-report-gate.vitest.ts` |
| Rule | Known-drifted packet before the refresh, clean packet after | `rules/check-graph-metadata-child-identity.sh` |
| Integration | Strict validate on packet 054 lists the rule | `spec/validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Compiled validation orchestrator reads the registry at run time | Internal | Green | New rules need only a registry entry and a rebuild |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a refresh drops a child that a packet must keep.
- **Procedure**: revert the writer commit; the rule and sweep are read-only and can stay.
<!-- /ANCHOR:rollback -->
