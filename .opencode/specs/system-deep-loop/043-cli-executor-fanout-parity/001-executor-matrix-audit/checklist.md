<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# QA Checklist: Deep-loop Executor / Provider / Model Matrix Audit

<!-- ANCHOR:protocol -->
## Verification Protocol
Read-only audit. The gate is evidence integrity, disposition coverage, and zero runtime change.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] Origin tip and capture timestamp recorded (the surface moves under concurrent executor packets).
- [ ] cli-X SKILL.md set enumerated for the seven kinds.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] No runtime file modified by this phase.
- [ ] Every matrix row cites a file:line or a live `--help` capture.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] Sample rows spot-checked back to source.
- [ ] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] Every gap in the register carries a disposition — none left "unknown".
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [ ] No provider credentials or secrets are recorded in the matrix.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] The frozen matrix and gap register are readable and cross-referenced by the wiring phases.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] The audit output lives in this phase folder.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
- [ ] Coverage, disposition, and no-runtime-change checks all recorded.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
- [ ] Operator review of the frozen matrix before wiring phases begin.
<!-- /ANCHOR:sign-off -->
