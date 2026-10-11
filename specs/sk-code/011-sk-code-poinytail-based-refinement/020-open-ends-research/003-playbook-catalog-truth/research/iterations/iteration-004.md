# Iteration 004 — Q5: In-place extension points, and the expected-line normalization calibration

- Run: `2026-10-11T16:24:27.869Z` | Iteration 4 of 10 | Mode: research | Route: @deep-research (native)
- Focus reconciliation: the dispatch focus named Q3, while the findings registry marks Q3 resolved at iteration 2 and the strategy's answered list already carries it; iteration 3 handled the same stale projection. The only unresolved strategy question is Q5, which is this iteration's real focus. Recorded, not halted — the run is unattended.

## Focus

Q5: Which existing scripts, validators or checks elsewhere in the repository could be extended in place instead of adding a new one?

Riding along: the exact wildcard normalization for whole-expected-line anchoring, carried forward by iteration 3 as the calibration the F2 catch depends on.

## Actions Taken

1. Re-read every extension candidate named by iterations 2–3 at its insertion point: the playbook validator's `requiredContentChecks()` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:248] and its `REQUIRED_COMMAND_SEQUENCE` marker [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:254]; the per-scenario entry `validateScenario()` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:662]; the catalog validator's suffix regex [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:552], raw-path extraction [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:561] and strip site [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:593]; the scanner's exported resolver [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:374] and citation fields [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:229]; the existing consumer's `classify()` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:282]; and the per-document scanner shell-out [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:1843].
2. Checked the catalog validator's own code-registry parity check (workflowMode inventory against `mode-registry.json`): docstring [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:23], function [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:787], registry read [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:792] and mismatch message [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:869].
3. Mapped the CI surface: which workflow runs which validator, what the test runner actually covers, and whether `.opencode/skills` and `.skilled/skills` are one tree (`ls -la`: `.opencode/skills -> ../.skilled/skills`).
4. Tested the normalization spec against the live calibration case: the exemplar's Expected lines [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:90], its Evidence block [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:119] and the producer's emitted string [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1637].

## Findings

### F1 — Q5 answer: three checks, two host validators, one reused resolver; zero new scripts

- **Scenario options** → `validate-playbook-package.cjs`, a new function beside `requiredContentChecks()` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:248], called from `validateScenario()` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:662], which already walks every scenario file with `repoRoot` in hand. The same validator is already the fleet-wide strict gate in CI [SOURCE: .github/workflows/playbook-operator-contract.yml:61] with a JSON fleet scan [SOURCE: .github/workflows/playbook-operator-contract.yml:69].
- **Scenario expected answers** → the same file and call site; the expected-line check needs only the scenario text plus the invoked script it must locate and read.
- **Catalog code anchors** → `validate_catalog_package.py`: `_extract_checkable_path` already returns the raw cell with the suffix intact [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:561], and line 593 is the only place the suffix is thrown away [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:593]. Retaining the parsed range and bounds-checking it is a local change; the full verdict taxonomy is available by resolving through `resolveCitation` [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:374].
- **Consumer template** → `check-source-tags-helper.mjs`'s `classify()` already maps resolver statuses to warning classes and passes `in_range`/`refused` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:282]; the scanner is not modified for the lightest check.
- **Ruled out**: editing `cite-drift-scan.mjs` to host the check. Its resolver and its `sentence`/`claim` fields are already exported [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:229], so adding logic there buys nothing and widens the blast radius.

### F2 — The catalog validator already contains the code-owned-registry cross-check pattern

Its workflowMode parity check requires both live sk-doc inventories to equal the key set projected by `mode-registry.json` [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:23], implemented at [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:787], reading the registry at [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:792] and reporting divergence at [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:869]. A catalog-to-code anchor check is therefore the same architecture the file already follows, and the `agent:`-step mode-name check needs no new registry — the registry and its consumer both exist.

### F3 — Calibration: exact normalization for whole-expected-line anchoring, and a strict prefix is never a pass

Live calibration case: the Expected block ends `...Provide --phase-names with literal slugs.` [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:90], the producer emits `...Provide --phase-names with literal slugs describing the concrete work.` [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1637], and the same document's Evidence block shows the full phrase [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:119]. Either the Expected line is truncated drift or a deliberate abbreviation; as written it disagrees with its own evidence, so a check that tolerates prefixes would pass a known disagreement.

Normalization spec, exact:

1. Producer side: normalize shell interpolation and format segments in emitted literals to wildcard gaps — `$var`, `${var}`, `$((…))`, `printf` `%0Nd`/`%Nd`/`%s`, `$$`, `$!`, and command substitution. The template of `create.sh:1637` is `[speckit] Warning: Falling back to generic phase name '<DYNAMIC>'. Provide --phase-names with literal slugs describing the concrete work.`
2. Expected side: normalize the materialized dynamic values to the same wildcard — quoted values whose content varies (`'phase-1-PROVIDE-DESCRIPTIVE-SLUG'`), digit runs, bracketed numbers (`[123]`), `/tmp/...` paths, timestamps.
3. Match rule: full-line template equality, not substring or token containment. Iterations 2–3 showed token presence passes the calibration case, so containment is disqualified.
4. Prefix rule: when the expected line is a strict prefix of an emitted line, emit a distinct class — `EXPECTED_TRUNCATED` — that fails (or, at minimum, never passes silently). A deliberately abbreviated line may pass only when it carries an explicit ellipsis marker the checker recognizes. This is the whole calibration decision: fail-closed catches F2's case and the doc's own evidence supports the failure.
5. Scope: only lines inside `### Expected` blocks that match an emitted fragment template; prose summaries and illustrative snippets stay out, which bounds the false-positive surface the strict rule creates.

### F4 — CI and test surfaces, measured

- `playbook-operator-contract.yml` runs on pull request, push and schedule, deliberately not path-filtered (workflow header comment), and enforces the operator-scenario contract by running `validate-playbook-package.cjs --strict` across the fleet [SOURCE: .github/workflows/playbook-operator-contract.yml:61], followed by the JSON fleet scan [SOURCE: .github/workflows/playbook-operator-contract.yml:69]. Extending that validator inherits enforcement on every PR and push for free.
- No workflow references `validate_catalog_package.py` or its fixture test. `sk-doc-script-tests.yml` runs the sk-doc script-test runner [SOURCE: .github/workflows/sk-doc-script-tests.yml:50], [SOURCE: .github/workflows/sk-doc-script-tests.yml:53], whose loop covers only its own directory's `test_*.py`; the catalog-named tests there (`test_feature_catalog_validation.py`, `test_cite_drift_advisory.py`) exercise `validate_document.py`, not the package validator. Extending the catalog validator therefore inherits no CI enforcement — wiring it is a separate decision, and one this research does not make.
- `.opencode/skills` is a symlink to `../.skilled/skills` (observed with `ls -la`), so the path CI invokes and the path an implementer edits are one tree; a single edit in `.skilled/skills/...` reaches both.
- Both host validators ship fixture-based tests beside them (`validate-playbook-package.test.cjs` importing `validatePackage`; `test_validator_fixtures.py` importing the validator's individual check functions and copying fixtures), so each new check function has a natural test home without a new harness.

### F5 — Nothing in the lightest package needs a new registry or a new executable

Every proposed check is a pure function over files the validators already read: scenario text and invoked scripts for the playbook validator; catalog cells and the tracked tree for the catalog validator. The option surface comes from the script's own `case` labels [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1637] context (iterations 2–3 mapped the class), the mode names from the existing registry consumer (F2), and the anchors from the existing resolver (F1). No runner, no service, no datastore.

## Questions Answered

- answered: Q5: Which existing scripts, validators or checks elsewhere in the repository could be extended in place instead of adding a new one?
  - `validate-playbook-package.cjs` hosts both scenario checks (function beside `requiredContentChecks()` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:248], called from `validateScenario()` [SOURCE: .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:662]) and already carries fleet-wide CI enforcement [SOURCE: .github/workflows/playbook-operator-contract.yml:61].
  - `validate_catalog_package.py` hosts the retained-suffix anchor check at the one strip site [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:593], consistent with its own code-registry parity check [SOURCE: .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:787], but has no CI runner today.
  - `cite-drift-scan.mjs` is reused, not edited (`resolveCitation` [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:374]); `check-source-tags-helper.mjs` is the strict-consumer template [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-source-tags-helper.mjs:282]; `validate_document.py` already demonstrates the per-document shell-out [SOURCE: .skilled/skills/sk-doc/scripts/validate_document.py:1843].
  - Net: two existing validators extended, one existing resolver reused, one existing registry consumed. No new script, no execution, no new registry.
- Calibration rider closed: the exact wildcard normalization (F3) — producer-side interpolation/format gaps and expected-side materialized dynamics both become wildcards; matching is full-line template equality; a strict prefix is its own failing class, never a pass.

## Questions Remaining

- None of the five strategy key questions remain open. Residue for synthesis, not new questions: the implementation-ready spec (check codes, insertion points, fixtures) and an estimate of the prefix-rule false-positive rate over the corpus.

## Next Focus

Synthesis and false-positive estimation: (a) assemble the three checks into an implementation-ready spec naming each check code, insertion point and fixture; (b) corpus-sample `### Expected` blocks to estimate how often the strict-prefix relation occurs, since F3 makes it a failing class and a high rate would reopen the tolerance decision; (c) confirm whether any generic test-discovery job (not naming the file) runs the catalog package validator's fixture tests before recommending catalog CI wiring.

## SCOPE VIOLATIONS

None — all researched files were read-only; writes were confined to this iteration's narrative, its delta file, and the gateway event temp file.
