<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# QA Checklist: Code README Coverage for the system-deep-loop Runtime

<!-- ANCHOR:protocol -->
## Verification Protocol
Planned phase — all items open. Execution authors READMEs per the sk-doc create-readme standard and checks each against real source.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] Full source-folder census captured with current README state.
- [ ] tests/scripts scope decision recorded.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] Every README conforms to the sk-doc create-readme code-README format.
- [ ] Purpose, exports, dependencies, and spine role are accurate against the real module source.
- [ ] No runtime source or test file was modified.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] Whole-runtime vitest green and unchanged.
- [ ] Whole-runtime tsc green and unchanged.
- [ ] Coverage sweep confirms no in-scope folder lacks a README.
- [ ] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] The coverage gap is fully closed: no in-scope source-bearing folder lacks a README.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [ ] No secrets, credentials, or internal-only paths are exposed in any authored README.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] Each README follows the sk-doc create-readme structure and reads clearly for a first-time visitor.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] Each README sits at its module folder root as `README.md`.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
- [ ] Coverage sweep, no-regression gates, and strict validation all recorded.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
- [ ] Operator review of the README coverage pass.
<!-- /ANCHOR:sign-off -->
