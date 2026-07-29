<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# QA Checklist: sk-code / code-opencode Alignment for the system-deep-loop Runtime

<!-- ANCHOR:protocol -->
## Verification Protocol
Planned phase — all items open. Execution aligns only audit-identified divergences and preserves behavior at every step.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] Baseline whole-runtime vitest + tsc captured.
- [ ] code-opencode surface resolved and its conventions loaded.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] Every divergence has a source-level citation.
- [ ] Each divergence aligned to the code-opencode standard or recorded as an accepted exception.
- [ ] No public contract or behavior changed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] Whole-runtime vitest green and unchanged vs baseline.
- [ ] Whole-runtime tsc green and unchanged vs baseline.
- [ ] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] Every audit-identified divergence is resolved or documented as an accepted exception — none left open.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [ ] Alignment introduced no new capability, permission, or exposure; behavior is unchanged.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] Accepted exceptions are documented with rationale.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] Module structure conforms to the code-opencode surface layout, or the deviation is a documented exception.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
- [ ] Baseline-vs-final vitest + tsc delta and strict validation all recorded.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
- [ ] Operator review of the alignment pass.
<!-- /ANCHOR:sign-off -->
