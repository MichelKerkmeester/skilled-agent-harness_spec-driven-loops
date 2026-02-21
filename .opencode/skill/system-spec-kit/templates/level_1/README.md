---
title: "Level 1 Templates"
description: "Baseline documentation templates for low-risk, small-scope changes."
trigger_phrases:
  - "level 1"
  - "small change"
  - "baseline docs"
importance_tier: "normal"
---

# Level 1 Templates

Use for simple work where full verification/governance overhead is unnecessary.

## When to Use
<!-- ANCHOR:overview -->

- Typical size is under 100 LOC.
- Scope is clear and low risk.
- No architecture decision record needed.

Move to Level 2 when verification checklist tracking is required.

<!-- /ANCHOR:overview -->

## Required Files
<!-- ANCHOR:files -->

- `spec.md`
- `plan.md`
- `tasks.md`
- `implementation-summary.md` (required output, finalized after implementation)

<!-- /ANCHOR:files -->

## Quick Start
<!-- ANCHOR:quick-start -->

```bash
mkdir -p specs/###-short-name
cp .opencode/skill/system-spec-kit/templates/level_1/spec.md specs/###-short-name/
cp .opencode/skill/system-spec-kit/templates/level_1/plan.md specs/###-short-name/
cp .opencode/skill/system-spec-kit/templates/level_1/tasks.md specs/###-short-name/
```

At completion, add and fill:

```bash
cp .opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md specs/###-short-name/
```

<!-- /ANCHOR:quick-start -->

## Phase Decomposition
<!-- ANCHOR:phase -->

Phase decomposition is typically not needed at Level 1. Most Level 1 tasks are small enough to complete in a single pass without phased ordering.

If a task unexpectedly grows beyond Level 1 scope, consider escalating to Level 2+ with phase decomposition rather than splitting a Level 1 spec. See the Phase System in the [main templates README](../README.md#phase-system).

<!-- /ANCHOR:phase -->

## Related
<!-- ANCHOR:related -->

- `../level_2/README.md`
- `../../references/templates/level_specifications.md`
- `../../references/validation/validation_rules.md`

<!-- /ANCHOR:related -->
