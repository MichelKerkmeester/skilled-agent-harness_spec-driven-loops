<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# QA Checklist: Combo Test Matrix + Ambient-Config Isolation

<!-- ANCHOR:protocol -->
## Verification Protocol
Per leaf: exact-arg / coverage tests (full output, never through `tail`) + whole-runtime tsc + live probes for the ambient-config isolation (hostile-config markers that must not fire for a read-only leaf).
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Confirmed read-only pi is text-analysis-only (read-only file tools; no skill invocation).
- [x] Confirmed the pi `--no-*` flags exist and are valid.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] Leaf 1: `--no-extensions --no-skills --no-prompt-templates` added only to the read-only pi branch; other kinds/paths untouched.
- [x] Comment hygiene: durable WHY (extension lifecycle can write independent of the tool allowlist), no ephemeral ids.
- [ ] Leaves 2-3 build to the same standard.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] fan-out 93/93, model-benchmark 35/35, ai-council 106/106; tsc 0.
- [x] Live pi accepts the new flags and writes nothing.
- [ ] Combo coverage matrix + ambient-config isolation probes.
- [ ] `validate.sh --strict` passes.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] The pi extension-lifecycle write vector for read-only leaves/seats is closed structurally.
- [ ] Cursor hooks / devin config / unapproved MCP isolation closed for read-only leaves.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] Read-only pi cannot load a write-capable extension/skill/template.
- [ ] No read-only executor can write or hang via ambient config (all vectors).
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] The pi read-only builder documents why extensions/skills/templates are disabled.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] Leaf 1 confined to `fanout-run.cjs` and the three exact-arg suites.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
- [x] Leaf 1 gate + live-probe evidence recorded in the implementation summary.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
- [ ] Operator review before the combo matrix + cursor/devin/MCP isolation leaves.
<!-- /ANCHOR:sign-off -->
