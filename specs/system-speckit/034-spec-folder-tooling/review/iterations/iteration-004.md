# Review Iteration 004

## Dimension

Maintainability: patterns, clarity, test isolation, documentation consistency, and safe follow-on change cost.

## Files Reviewed

- .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:643
- .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:835
- .skilled/skills/system-spec-kit/runtime/cli/tests/heal-lane-modes.vitest.ts:101
- .skilled/skills/system-spec-kit/runtime/cli/tests/heal-anchor-repair.vitest.ts:382
- .skilled/skills/system-spec-kit/runtime/cli/tests/repair-derived.vitest.ts:29
- .skilled/commands/doctor/scripts/tests/doctor-update-compat.test.cjs:105
- .skilled/commands/doctor/scripts/tests/doctor-update-compat-integration.test.cjs:101
- .skilled/commands/doctor/scripts/tests/git-hook-gates.test.cjs:47
- .skilled/scripts/git-hooks/lib/gates.tsv:7
- .skilled/scripts/git-hooks/README.md:20
- .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/heal-spec-docs-lane-modes.md:38
- .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/heal-spec-docs-lane-modes.md:14
- .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:116
- .skilled/skills/system-spec-kit/runtime/cli/spec/README.md:117

The target manifest contains 229 files. This pass selected the healer, its fold-in calls, focused tests, aligned docs, and hook-gate inventory; it did not review every manifest file line by line.

## Findings by Severity

### P0

None.

### P1

No new P1 finding. The six active findings from earlier iterations were not repeated.

### P2

#### R4-P2-001 [P2] Healer CLI target selection is duplicated across three entrypoints

- File: [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:643]
- Evidence: runAnchorRepair, runLaneModesCli, and main each resolve --folder, --roots, and the default specs root in separate blocks at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:643], [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1360], and [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs:1390]. The fold-in calls shared repair helpers at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:835] and [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs:881], so the duplication is limited to CLI target selection.
- Finding class: class-of-bug.
- Scope proof: direct comparison found the same target-resolution rule in all three wrappers. The fold-in uses the shared repair helpers rather than a second implementation.
- Counterevidence sought: the repair wrappers process different document sets, and the fold-in might carry separate algorithms; source inspection showed only the downstream repair surfaces differ.
- Alternative explanation: the wrappers are short and may have been kept local intentionally.
- Confidence: 0.92.
- Downgrade trigger: if the three target-selection blocks are intentionally independent and CLI tests already pin their parity, retain this only as an optional duplication advisory.
- Recommendation: consider a shared folder/root target-selection helper with a CLI-level contract test for all three entrypoints.

No current behavior mismatch was observed. This is a follow-on maintenance cost, not a correctness defect.

## Traceability Checks

- Core spec-to-code: partial. The selected lane-mode catalog and CLI reference match the dispatcher; upgrade-legacy calls shared healer helpers.
- Core checklist evidence: deferred. Acceptance artifacts were read for context; their historical commands were not rerun.
- Overlay feature catalog: partial. The selected catalog entry agrees with the CLI.
- Overlay playbook capability: partial. The scenario contract agrees with the CLI; the manual scenario was not executed.
- Skill-agent and cross-runtime parity: deferred because they were outside this slice.

## Search Coverage

- Fold-in repair duplication: ruled out; the upgrade path calls exported healer helpers.
- Test isolation: ruled out in the inspected tests; fixtures use temporary roots or repositories and cleanup callbacks.
- Lane-mode documentation drift: ruled out in the selected catalog, playbook, CLI README, and changelog.
- Comment hygiene: no ephemeral ids or packet paths matched in the focused source/test scan; a positive control found ordinary module comments in the same files.
- Git-hook gates table: ruled out; 13 configurable entries match the doctor listing test. The README's eight count refers to blocking pre-commit checks.
- Omitted high-risk surface: other workflow and release-safety targets in the 229-file manifest were not read line by line.

## Verdict

This iteration has one P2 advisory and no new P0 or P1 findings. The iteration verdict is PASS; the six prior P1 findings remain active in the cumulative registry.

## Next Dimension

Correctness begins the next review rotation under the max-iteration policy.

Review verdict: PASS
