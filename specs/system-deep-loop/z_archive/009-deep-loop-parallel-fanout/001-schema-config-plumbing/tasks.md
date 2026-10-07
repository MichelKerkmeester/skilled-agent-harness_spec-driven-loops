---
title: "Tasks: Phase 001 — Fan-out schema + config plumbing"
description: "Completed task breakdown for the fan-out schema phase: schema additions, per-entry parsing reuse, lineage expansion, audit lineageId threading and the full test run."
trigger_phrases:
  - "schema config plumbing tasks"
  - "fan-out schema task breakdown"
  - "executor config verification checklist"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks — Phase 001: Fan-out schema + config plumbing

<!-- ANCHOR:phase-1 -->

- [x] T1: Add lineageExecutorSchema + fanoutConfigSchema to executor-config.ts.
- [x] T2: Add parseFanoutConfig (per-entry reuse of parseExecutorConfig + label uniqueness).
- [x] T3: Add expandLineages (count→labels).
- [x] T4: Thread optional lineageId through executor-audit.ts (input/record/builder).
- [x] T5: Extend executor-config.vitest.ts (+9 fan-out tests).
- [x] T6: Run full unit suite — 163/163 green; parity preserved.
<!-- /ANCHOR:phase-1 -->
