<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Code README Coverage for the system-deep-loop Runtime

<!-- ANCHOR:summary -->
## 1. SUMMARY
Add a code README to every source-bearing folder in the system-deep-loop runtime, authored to the sk-doc create-readme
standard. Pure documentation: no runtime code changes. Planned and deferred — not executed during the per-mode migration landing.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Every in-scope folder carries a README conforming to the sk-doc create-readme code-README standard.
- Each README's claims (purpose, exports, dependencies) verified against real source, not guessed.
- Whole-runtime vitest and tsc stay green (documentation-only change, so this is a no-regression check).
- `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The runtime is `.opencode/skills/system-deep-loop/runtime`. Code lives under `lib/<module>/` (93 module folders as of the
2026-07-29 census, 56 without a README), plus `tests/` and `scripts/`. Each README is authored per module from its real
exports and dependency imports, following the sk-doc create-readme format the sk-doc/021 documentation-quality program established.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Enumerate every source-bearing folder and its current README state; resolve the tests/scripts scope open question.
2. Author READMEs in batches by column (schema, reducers, sealed, certificates, resume, shadow, rollback) and shared substrate.
3. Coverage sweep: confirm no in-scope folder is left without a README; strict-validate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Documentation-only, so testing is a no-regression guard: run the whole-runtime vitest and tsc before and after to confirm
nothing changed, plus the sk-doc README-standard check on each authored file.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- sk-doc create-readme mode (the code-README standard and authoring workflow).
- The landed runtime source (READMEs are authored from the real module surface).
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
READMEs are additive files; rollback is deleting the added `README.md` files. No runtime behavior can be affected.
<!-- /ANCHOR:rollback -->
