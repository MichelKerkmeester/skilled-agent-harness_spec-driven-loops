---
title: "Spec 150 Changelog Index"
description: "Index for the Spec 150 parent-nested-skill changelog set and before-after narrative."
trigger_phrases:
  - "150 changelog index"
  - "parent nested changelog"
  - "nested skill pattern changelog"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 150 Changelog Index

Spec 150 shipped the Parent skill with nested sub-skills pattern from repair through runtime hardening. The changelog mirrors the phase tree, with one phase-local file for each shipped child and a root rollup for the packet outcome.

## Phases

| Phase | Status | Changelog |
|-------|--------|-----------|
| 001-rename-fix-and-shared-decision | Completed | [changelog-150-001-rename-fix-and-shared-decision.md](./changelog-150-001-rename-fix-and-shared-decision.md) |
| 002-advisor-routing-drift-guard | Completed | [changelog-150-002-advisor-routing-drift-guard.md](./changelog-150-002-advisor-routing-drift-guard.md) |
| 003-formalize-pattern | Completed | [changelog-150-003-formalize-pattern.md](./changelog-150-003-formalize-pattern.md) |
| 004-improvement-implementation | Completed | [changelog-150-004-improvement-implementation.md](./changelog-150-004-improvement-implementation.md) |

## How to read these

Start with `changelog-150-root.md` for the packet-level outcome and the included phase map. Use the phase changelogs for the implementation detail, verification evidence and follow-up boundaries behind each shipped capability.

## Conventions

- One changelog per shipped phase. The `-root.md` rollup carries the cross-phase summary.
- Voice rules are non-negotiable: no em-dashes, no semicolons in narrative, no Oxford commas.
