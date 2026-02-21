---
title: "Level 3+ Templates"
description: "Governance-heavy templates for high-complexity or regulated work."
trigger_phrases:
  - "level 3+"
  - "governance"
  - "compliance"
importance_tier: "normal"
---

# Level 3+ Templates

Use for work that needs formal governance, compliance traceability, and coordinated execution.

## When to Use
<!-- ANCHOR:overview -->

- Formal approval workflow is required.
- Compliance checkpoints must be documented.
- Workstreams or multi-agent coordination are expected.
- Complexity is high enough that Level 3 is not sufficient.

<!-- /ANCHOR:overview -->

## Required Files
<!-- ANCHOR:files -->

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`

These are the same core files as Level 3 with governance-expanded sections.

<!-- /ANCHOR:files -->

## Governance Additions
<!-- ANCHOR:additions -->

- Approval workflow and stakeholder sign-off structure.
- Compliance checkpoints and traceability fields.
- Workstream coordination and execution protocol sections.
- Expanded checklist coverage for release-readiness validation.

<!-- /ANCHOR:additions -->

## Quick Start
<!-- ANCHOR:quick-start -->

```bash
mkdir -p specs/###-feature-name
cp .opencode/skill/system-spec-kit/templates/level_3+/*.md specs/###-feature-name/
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/###-feature-name/
```

<!-- /ANCHOR:quick-start -->

## Workflow Notes
<!-- ANCHOR:workflow-notes -->

- Keep approvals and compliance checks updated as work progresses.
- Track checklist evidence continuously; do not batch at the end.
- Finalize `implementation-summary.md` with delivered outcomes and open follow-ups.

<!-- /ANCHOR:workflow-notes -->

## Phase Decomposition
<!-- ANCHOR:phase -->

Phase decomposition is strongly recommended for Level 3+ complexity. Governance-heavy work benefits significantly from phased ordering, enabling approval checkpoints and compliance verification at each stage. Use Gate 3 Option E to target a specific phase child and `/spec_kit:phase` to create the phase structure.

See the Phase System in the [main templates README](../README.md#phase-system) for full details.

<!-- /ANCHOR:phase -->

## Related
<!-- ANCHOR:related -->

- `../level_3/README.md`
- `../addendum/level3plus-govern/`
- `../../references/templates/level_specifications.md`
- `../../references/validation/validation_rules.md`

<!-- /ANCHOR:related -->
