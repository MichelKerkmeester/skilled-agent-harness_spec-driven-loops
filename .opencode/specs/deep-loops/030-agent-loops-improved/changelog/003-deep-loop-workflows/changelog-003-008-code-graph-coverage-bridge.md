---
title: "Changelog: Code-Graph to Coverage-Graph Init Bridge [003-deep-loop-workflows/008-code-graph-coverage-bridge]"
description: "Chronological changelog for the Code-Graph to Coverage-Graph Init Bridge phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-29

> Spec folder: `.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows/008-code-graph-coverage-bridge` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/030-agent-loops-improved/003-deep-loop-workflows`

### Summary

Seed coverage-graph from code-graph at loop init: seed_source/seed_confidence DB schema in coverage-graph-db.ts + --seed-source/--seed-confidence on upsert.cjs + init seed steps in deep_context_auto.yaml/deep_review_auto.yaml. Tests pass; typecheck/hygiene/drift green.

### Added

- No new additions recorded.

### Changed

- Seed coverage-graph from code-graph at loop init: seed_source/seed_confidence DB schema in coverage-graph-db.ts + --seed-source/--seed-confidence on upsert.cjs + init seed steps in deep_context_auto.yaml/deep_review_auto.yaml. Tests pass; typecheck/hygiene/drift green.

### Fixed

- No fixes recorded.

### Verification

- Unit tests (vitest) - PASS
- validate.sh --strict - PASS
- Scope - Only the files above changed

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | Modified | code-graph to coverage-graph seed bridge |
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Modified | code-graph to coverage-graph seed bridge |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | Modified | code-graph to coverage-graph seed bridge |
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | Modified | code-graph to coverage-graph seed bridge |
| `.opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-db.vitest.ts` | Modified | code-graph to coverage-graph seed bridge |
| `.opencode/skills/deep-loop-runtime/tests/integration/upsert-script.vitest.ts` | Modified | code-graph to coverage-graph seed bridge |

### Follow-Ups

- Create project structure
- Install dependencies
- [P] Configure development tools
- [Implement core feature 1]
- [Implement core feature 2]
- [Implement core feature 3]
