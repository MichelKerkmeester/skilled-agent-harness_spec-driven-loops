---
title: "Level 2 Templates"
description: "Verification-focused templates for medium complexity changes."
trigger_phrases:
  - "level 2"
  - "checklist"
  - "verification"
importance_tier: "normal"
---

# Level 2 Templates

Use for medium-scope work that needs explicit validation.

## When to Use
<!-- ANCHOR:overview -->

- Typical size is 100-499 LOC.
- Quality gates and edge-case tracking are required.
- Non-functional requirements must be documented.

Escalate to Level 3 for architecture-heavy decisions.

<!-- /ANCHOR:overview -->

## Required Files
<!-- ANCHOR:files -->

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`

<!-- /ANCHOR:files -->

## Level 2 Additions
<!-- ANCHOR:additions -->

- Verification-first `checklist.md` with P0/P1/P2 priorities.
- NFR and edge-case sections in `spec.md`.
- Stronger execution and rollback detail in `plan.md`.

<!-- /ANCHOR:additions -->

## Quick Start
<!-- ANCHOR:quick-start -->

```bash
mkdir -p specs/###-feature-name
cp .opencode/skill/system-spec-kit/templates/level_2/*.md specs/###-feature-name/
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/###-feature-name/
```

<!-- /ANCHOR:quick-start -->

## Workflow Notes
<!-- ANCHOR:workflow-notes -->

- Keep checklist current during implementation.
- Completion checks run in priority order: P0, then P1, then P2.
- `implementation-summary.md` is finalized after implementation work.

<!-- /ANCHOR:workflow-notes -->

## Phase Decomposition
<!-- ANCHOR:phase -->

Consider phase decomposition for multi-sprint Level 2 tasks where work naturally divides into ordered stages. Use Gate 3 Option E to target a specific phase child and `/spec_kit:phase` to create the phase structure.

See the Phase System in the [main templates README](../README.md#phase-system) for full details.

<!-- /ANCHOR:phase -->

## Related
<!-- ANCHOR:related -->

- `../level_1/README.md`
- `../level_3/README.md`
- `../addendum/level2-verify/`
- `../../references/validation/validation_rules.md`

<!-- /ANCHOR:related -->
