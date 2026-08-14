<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Deep-loop Executor / Provider / Model Matrix Audit

<!-- ANCHOR:summary -->
## 1. SUMMARY
Read-only audit that freezes the authoritative (cli × provider × model × mode) support matrix for the deep-loop fan-out and a
gap register with a disposition per gap. No runtime code changes.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- Every matrix row cites file:line or a live `--help` capture.
- Every gap has a disposition (wire / enforce-scope-out / accept).
- No runtime file changed; `validate.sh --strict` passes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Three layers are cross-read: `executor-config.ts` (kinds, flags, model rosters), `fanout-run.cjs` (lineage builders), and each
cli-X SKILL.md / cli-reference (the CLI's headless contract). Per-mode availability comes from the deep auto-YAMLs and mode contracts.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Enumerate the config surface (kinds, flags, rosters, defaults) with citations.
2. Classify each lineage builder (real / stub-throws / missing) and record exec/permission caveats.
3. Cross-map providers/models per kind and per-mode availability; assemble the matrix; assign a disposition to every gap; freeze.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
No code under test. The gate is evidence integrity: spot-check a sample of matrix rows back to their cited source, and confirm no
runtime file changed.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- `executor-config.ts` and `fanout-run.cjs` at the current origin tip.
- Each cli-X SKILL.md + cli-reference for the CLI headless contract.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Audit is read-only and produces docs only; rollback is deleting the added audit doc. No runtime impact.
<!-- /ANCHOR:rollback -->
