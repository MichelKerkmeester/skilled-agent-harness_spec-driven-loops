---
title: "Spec 147 Changelog Index"
description: "Index of packet-local changelogs for the completed deep-loop-workflows consolidation."
trigger_phrases:
  - "147 changelog index"
  - "deep-loop workflows changelog"
  - "nested changelog index"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 147 Changelog Index

Spec 147 consolidated the five public deep-loop workflow skills into one `deep-loop-workflows` hub backed by the frozen `deep-loop-runtime` backend. This changelog mirrors the phase tree so a reader can start from the root outcome, then drill into the phase that changed a specific surface.

## Phases

| Phase | Status | Changelog |
|-------|--------|-----------|
| 001-parity-baseline-and-runtime-ownership-adr | Complete | [changelog-147-001-parity-baseline-and-runtime-ownership-adr.md](./changelog-147-001-parity-baseline-and-runtime-ownership-adr.md) |
| 002-runtime-backend-promotions | Complete | [changelog-147-002-runtime-backend-promotions.md](./changelog-147-002-runtime-backend-promotions.md) |
| 003-merged-hub-and-mode-packets | Complete | [changelog-147-003-merged-hub-and-mode-packets.md](./changelog-147-003-merged-hub-and-mode-packets.md) |
| 004-command-surface-repoint | Complete | [changelog-147-004-command-surface-repoint.md](./changelog-147-004-command-surface-repoint.md) |
| 005-agent-mirror-repoint | Complete | [changelog-147-005-agent-mirror-repoint.md](./changelog-147-005-agent-mirror-repoint.md) |
| 006-advisor-graph-mode-routing | Complete | [changelog-147-006-advisor-graph-mode-routing.md](./changelog-147-006-advisor-graph-mode-routing.md) |
| 007-governance-consolidation | Complete | [changelog-147-007-governance-consolidation.md](./changelog-147-007-governance-consolidation.md) |
| 008-framework-docs-sweep | Complete | [changelog-147-008-framework-docs-sweep.md](./changelog-147-008-framework-docs-sweep.md) |
| 009-old-skill-deletion-and-validation | Complete | [changelog-147-009-old-skill-deletion-and-validation.md](./changelog-147-009-old-skill-deletion-and-validation.md) |
| 010-deep-loop-skill-system-review | Conditional pass | [changelog-147-010-deep-loop-skill-system-review.md](./changelog-147-010-deep-loop-skill-system-review.md) |

## How to read these

Read `changelog-147-root.md` first for the packet outcome and phase map. Use the phase changelogs when you need the local scope, verification notes and follow-ups for a specific migration step.

## Conventions

- One changelog per shipped phase. The `-root.md` rollup carries the cross-phase summary.
- Voice rules are non-negotiable: no em-dashes, no semicolons in narrative, no Oxford commas.
