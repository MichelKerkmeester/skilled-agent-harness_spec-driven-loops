# Iteration 7: Coverage Gaps per Public Surface

## Focus
Angle 7 — check whether each public CLI surface / rule carries a happy-path plus at least one edge-case test, per the P1 coverage floor.

## Findings

### F7.1 [P1] `quality-audit.sh` has no test reference
- **Code:** `runtime/cli/spec/quality-audit.sh` (standalone `# COMPONENT: Quality Audit`, documented usage + exit codes) — 0 references in `runtime/cli/tests` or `runtime/tests`; it is not sourced by `validate.sh` (grep in validate.sh for `quality-audit` returned nothing).
- **Standard:** `shared/references/universal/code-quality-standards.md` §4 P1 #2 "Test coverage at boundaries — happy path plus at least one edge case per public surface."
- **What is present:** A documented public CLI entry point (discovers spec folders, runs validate.sh, aggregates with `--json`/`--fix`/`--root`) that has no happy-path test and no error-case test. Its exit-code contract (0/1/2) is untested.
- **Severity:** P1.
- **One-line fix:** **judgment-required** — add a happy-path test (a fixture root with passing folders → exit 0) and an edge test (a fixture root with a failing folder → exit 2), mirroring the existing `validate.sh` test harness.

### F7.2 [P1] `calculate-completeness.sh` has no test reference
- **Code:** `runtime/cli/spec/calculate-completeness.sh` — 0 references in `runtime/cli/tests` or `runtime/tests`.
- **Standard:** same §4 P1 #2.
- **What is present:** A public spec-folder completeness calculator with no happy-path or edge test. Even where `validate.sh` exercises it indirectly at runtime, there is no focused test asserting the completeness percentage for a known fixture.
- **Severity:** P1.
- **One-line fix:** **judgment-required** — add a fixture-driven test (a known spec folder → expected completeness %) and a boundary case (a folder with no docs → 0%).

### F7.3 [P2] `check-links.sh`, `deploy-mcp.sh`, `quality-kpi.sh` are also un-tested public/script surfaces
- **Code:** `runtime/cli/spec/check-links.sh` (0 refs), `runtime/cli/deploy-mcp.sh` (0 refs), `runtime/cli/kpi/quality-kpi.sh` (0 refs).
- **Standard:** same §4 P1 #2 (for `check-links.sh`), but `deploy-mcp.sh` is heavily side-effect-bound and `quality-kpi.sh` is an internal KPI reporter, so a focused unit test is lower-value.
- **What is present:** The reminder of the public surface is untested. `validate.sh` itself is well covered (109 references) and `recommend-level.sh`/`progressive-validate.sh`/`upgrade-level.sh` have at least 2-3 references.
- **Severity:** P2 for the side-effect-bound scripts; P1 floor only realistically blocks `quality-audit.sh` and `calculate-completeness.sh` (pure, high-value surfaces).
- **One-line fix:** **judgment-required** — prioritize F7.1/F7.2; treat `deploy-mcp.sh`/`quality-kpi.sh` as documented deferrals.

## Sources Consulted
- `runtime/cli/spec/quality-audit.sh` (header/usage/exit codes, and absence from validate.sh)
- `runtime/cli/spec/calculate-completeness.sh`
- test-reference census across `runtime/cli/tests` + `runtime/tests`
- `shared/references/universal/code-quality-standards.md` §4 P1#2

## Assessment
- **newInfoRatio:** 0.6
- **Novelty justification:** The zero-test state of `quality-audit.sh` and `calculate-completeness.sh`, plus the P1 vs P2 distinction by side-effect weight, is new.
- **Confidence:** High — the census is mechanical (grep of `-Il` across both test roots). Caveat: a test might exercise these via indirection that a name-grep misses, which is why the finding is P1 (needs a focused test) rather than a stronger claim that they are broken.

## Reflection
- What worked: Distinguishing standalone public entry points (quality-audit, calculate-completeness) from `validate.sh` helpers that are indirectly covered gave a defensible P1/P2 split.
- What failed: The name-grep can miss indirect coverage; the claim is "no focused test" rather than "definitely uncovered at runtime."
- Ruled out: Filing `validate.sh` gaps — it has 109 test references and is the best-covered surface.

## Recommended Next Focus
Angle 8 — shell hygiene: missing `set -euo pipefail`, unquoted variables, non-portable constructs in `runtime/cli`.
