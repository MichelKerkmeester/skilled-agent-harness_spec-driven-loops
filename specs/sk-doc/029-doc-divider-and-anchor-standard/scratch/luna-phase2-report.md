# Phase 2 Validation Report

## Files changed

- `.opencode/skills/sk-doc/shared/scripts/validate_document.py`
- `.opencode/skills/sk-doc/shared/assets/template-rules.json`
- `.opencode/skills/sk-doc/scripts/tests/structure/negative/missing-divider.md`
- `.opencode/skills/sk-doc/scripts/tests/structure/positive/all-dividers.md`
- `.opencode/skills/sk-doc/scripts/tests/test_structure_validation.py`
- `.opencode/specs/sk-doc/029-doc-divider-and-anchor-standard/scratch/luna-phase2-report.md`

The code-folder validator and continuity-anchor files were not changed.

## CI-safe enforcement mechanism

The new general-path divider, README/skill-doc TOC, and README/skill-doc navigation-anchor rules are gated by `SKDOC_ENFORCE_STRUCTURE`. The default unset state disables the new findings, so the current drifting fleet does not turn the documentation gate red. Setting `SKDOC_ENFORCE_STRUCTURE=1` enables the findings as blocking errors for the enforcement test and later rollout.

## Negative and positive controls

Negative control before the implementation returned no issue:

```text
$ SKDOC_ENFORCE_STRUCTURE=1 python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/scripts/tests/structure/negative/missing-divider.md --type readme --json
exit_code=0
"total_issues": 0
```

After the implementation, the same command detected exactly one missing divider:

```text
$ SKDOC_ENFORCE_STRUCTURE=1 python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/scripts/tests/structure/negative/missing-divider.md --type readme --json
exit_code=1
{
  "valid": false,
  "document_type": "readme",
  "total_issues": 1,
  "blocking_errors": [
    {
      "type": "general_h2_separator",
      "line": "## 2. SECOND SECTION",
      "line_number": 13
    }
  ],
  "warnings": []
}
```

The positive fixture produced no divider finding:

```text
$ SKDOC_ENFORCE_STRUCTURE=1 python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/sk-doc/scripts/tests/structure/positive/all-dividers.md --type readme --json
exit_code=0
"total_issues": 0
"blocking_errors": []
```

The focused test also passed all four cases, including fence awareness, comment transparency, README/skill navigation rules, and spec exemption:

```text
$ env -u SKDOC_ENFORCE_STRUCTURE python3 -m pytest .opencode/skills/sk-doc/scripts/tests/test_structure_validation.py -q
....                                                                     [100%]
4 passed in 0.05s
```

## Regression

```text
$ env -u SKDOC_ENFORCE_STRUCTURE python3 .opencode/skills/sk-doc/scripts/tests/test_validator.py
SUMMARY: 11/11 tests passed
ALL TESTS PASSED

$ env -u SKDOC_ENFORCE_STRUCTURE python3 .opencode/skills/sk-doc/scripts/tests/test_code_folder_readme.py
SUMMARY: negatives=9 flat_table_pass=1 positive_control=1 failures=0

$ env -u SKDOC_ENFORCE_STRUCTURE python3 -m pytest .opencode/skills/sk-doc/scripts/tests -q --ignore=.opencode/skills/sk-doc/scripts/tests/test_rename_tooling_fixture_harness.py
101 passed, 1 warning in 31.38s
```

The unfiltered suite retains the pre-existing protected-fixture failure caused by the dirty worktree's deleted `docs/checkout-architecture.html` and related files:

```text
$ env -u SKDOC_ENFORCE_STRUCTURE python3 -m pytest .opencode/skills/sk-doc/scripts/tests -q
2 failed, 103 passed, 1 warning in 38.60s
FAILED ...test_rename_tooling_fixture_harness.py::RenameToolingFixtureHarnessTests::test_default_cli_is_dry_run_deterministic_and_non_mutating
FAILED ...test_rename_tooling_fixture_harness.py::RenameToolingFixtureHarnessTests::test_explicit_apply_and_rollback_remain_inside_disposable_repositories
```

The baseline before this change was `2 failed, 99 passed`; the scoped suite therefore has no new failures.

## Continuity-anchor confirmation

```text
$ SKDOC_ENFORCE_STRUCTURE=1 python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/specs/sk-doc/029-doc-divider-and-anchor-standard/spec.md --type spec --no-exclude --json
exit_code=0
"document_type": "spec",
"total_issues": 0,
"blocking_errors": [],
"warnings": []

$ git status --short -- .opencode/skills/system-spec-kit/scripts/lib/anchor-generator.ts .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/skills/system-spec-kit/scripts/test-fixtures/007-valid-anchors .opencode/skills/system-spec-kit/scripts/test-fixtures/008-invalid-anchors
exit_code=0
```

The spec-type document carrying `<!-- ANCHOR:... -->` was not flagged, and the protected continuity paths remained untouched.

## T008 divider dry-run

The unchanged census reference reported this current-worktree baseline:

```text
TOTAL              8645   3692   1016   2728    7   54
```

The enforcement-enabled validator reported:

```text
$ SKDOC_ENFORCE_STRUCTURE=1 python3 <read-only fleet scan using validate_document(..., skip_exclusions=True)>
STRUCTURED_FILES=8645
DIVIDER_FLAGGED_FILES=993
DIVIDER_GAPS=2671
FLAGGED_BY_TYPE=agent:4,asset:17,changelog:27,command:22,feature_catalog:137,install_guide:1,playbook_feature:487,readme:207,reference:89,skill:2
```

The packet research baseline was approximately `1,015` files and `2,725` gaps. The current census is `1,016` files and `2,728` gaps. The validator count is the exact ALL-CAPS subset required by Phase 2: the read-only comparison found `23` census-only files, all with mixed-case numbered headings, and `0` validator-only files. Thus `1,016 - 23 = 993` and the corresponding ALL-CAPS gap count is `2,671`.
