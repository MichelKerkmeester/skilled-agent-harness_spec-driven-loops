<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# QA Checklist: cli-pi Fan-out Lineage Wiring

<!-- ANCHOR:protocol -->
## Verification Protocol
Command-construction unit tests plus a live end-to-end dispatch of the builder's own output; full vitest output captured, never through `tail`.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Provider map captured from `pi --list-models`.
- [x] Clean tsc baseline in the worktree.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] `--offline` always present; prompt is the final positional arg; exit code documented as non-authoritative.
- [x] Provider prefix correct for every allowlisted model.
- [x] Invalid `--thinking` level fails closed with a typed error.
- [x] Comment hygiene: durable WHY only, no ephemeral ids.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] fanout-run, executor-config, executor-audit suites green.
- [x] Whole-runtime tsc 0.
- [x] Live dispatch returned the expected token from real pi.
- [ ] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] The stub is fully removed; no code path still throws the "unavailable" contract error.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] Read-only leaves restrict the tool allowlist to reads; no secrets in constructed args.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] The builder documents the offline requirement and the exit-code caveat.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] Changes confined to `fanout-run.cjs`, `executor-config.ts`, and their two test files.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
- [x] Unit + live evidence recorded in the implementation summary.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
- [ ] Operator review before the per-mode wiring phase (004) exposes cli-pi.
<!-- /ANCHOR:sign-off -->
