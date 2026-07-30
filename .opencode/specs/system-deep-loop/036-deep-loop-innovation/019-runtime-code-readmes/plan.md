<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Code README Coverage for the system-deep-loop Runtime

<!-- ANCHOR:summary -->
## 1. SUMMARY
Add a code README to every source-bearing folder in the system-deep-loop runtime, and repair the fourteen recorded defects in
the READMEs that already exist, authored to the sk-doc create-readme standard. Pure documentation: no runtime code changes.
Planned and deferred — not executed during the per-mode migration landing. Gated on the code-README standard ruling in
`sk-doc/022-code-readme-coverage/001`, because the format's Directory-Tree requirement is ambiguous until that ruling lands.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Every in-scope folder carries a README conforming to the sk-doc create-readme code-README standard.
- Every existing runtime README passes the same conformance check; the fourteen recorded defects are closed.
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
1. Re-verify the 14 recorded defects and re-run the 56-missing census; the census dates from 2026-07-29 and the 036 tree is
   under active development, so both numbers may have moved.
2. Author READMEs in batches by column (schema, reducers, sealed, certificates, resume, shadow, rollback) and shared substrate.
3. Repair the 14 recorded defects in existing runtime READMEs, sequencing `runtime/README.md` against WS1 `032`.
4. Coverage sweep: confirm no in-scope folder is left without a README, and that every existing README passes the same check;
   strict-validate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Documentation-only, so testing is a no-regression guard: run the whole-runtime vitest and tsc before and after to confirm
nothing changed, plus the sk-doc README-standard check on each authored file.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- sk-doc create-readme mode (the code-README standard and authoring workflow).
- `sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement`, hard — supplies the Directory-Tree ruling that
  makes R1 verifiable and the manifest-driven auditor that R4's coverage check uses.
- The landed runtime source (READMEs are authored from the real module surface).
- WS1 child `032-docs-drift-and-p2-batch`, coordination only — it edits `runtime/README.md` for content drift.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
READMEs are additive files; rollback is deleting the added `README.md` files. No runtime behavior can be affected.
<!-- /ANCHOR:rollback -->
