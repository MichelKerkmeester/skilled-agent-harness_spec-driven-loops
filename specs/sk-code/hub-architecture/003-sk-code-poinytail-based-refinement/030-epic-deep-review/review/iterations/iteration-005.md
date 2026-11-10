# Review Iteration 5 — Correctness

## Dispatcher

- Mode: review. Target agent: @deep-review. Status: complete.
- Resolved route: mode=review target_agent=deep-review.
- Agent definition loaded from the active Codex agent contract and canonical deep-review contract.
- Run: run-001. Iteration: 5 of 5. New findings ratio: 1.0.
- Scope: the declared 479-row review list plus the v4.0.0.4 changelog. This iteration selects the create.sh unknown-option path.

## Dimension

Correctness. This pass checks the unknown-option behavior in the in-scope spec scaffolder against its phase requirement, regression test, and selected release claim.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh`: parser at lines 351-363.
- `.skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts`: option tests at lines 59-79.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options/spec.md`: REQ-001 at line 99.
- `.skilled/changelog/skilled/v4.0.0.4.md`: selected claim at lines 275-281.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/review/scope-files.txt`: target rows 204-205.
- `specs/sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review/review/deep-review-strategy.md`: prior scope boundary at lines 118-121 and 153-161.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

#### R5-P1-001 — A lone dash bypasses create.sh's unknown-option refusal

- Case: a caller runs `create.sh - Feature`.
- File: [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:351]
- Evidence: the `-?*` case pattern needs at least one character after the dash. A lone `-` therefore reaches the catch-all at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:356], is appended to `ARGS`, and is used to form `FEATURE_DESCRIPTION` at [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:363]. REQ-001 says an unmatched argument beginning with `-` must fail at [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options/spec.md:99]. The existing test checks `--goal` and `--with-goal`, but not the one-character token [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts:59].
- User impact: the malformed option is treated as feature text, so the scaffolder can continue with an unintended title and path.
- Finding class: instance-only.
- Scope proof: direct control-flow inspection proves the single-token case; the test covers only a multi-character unknown flag and a valid flag.
- Affected surface hints: create.sh CLI; spec-folder scaffolder.
- Recommendation: reject the exact token `-` as an unmatched option and add a regression case that confirms it exits 1 before creating a spec folder.
- Claim: REQ-001's unknown-option contract misses the standalone dash because the parser pattern excludes one-character tokens.
- Evidence refs: `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:351`, `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:356`, `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:363`, `.skilled/skills/system-spec-kit/runtime/cli/tests/create-unknown-options.vitest.ts:59`, `specs/sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options/spec.md:99`.
- Counterevidence sought: checked the `--goal` regression, the `--with-goal` happy path, the no-`--`-marker scope note, and parser fall-through. Those establish coverage for multi-character flags and valid options, but not a lone dash.
- Alternative explanation: `-` could be positional title text. The phase scope says no caller passes a title beginning with a dash, while REQ-001 explicitly covers unmatched dash-leading arguments and states no exception for a lone dash.
- Final severity: P1. Confidence: 0.93.
- Downgrade trigger: downgrade or resolve if the interface contract explicitly exempts a standalone `-` from option syntax and documents and tests that title behavior.
- Skeptic/referee: Iteration 1 had ruled out the broader unknown-option failure based on a multi-character flag. This direct one-character counterexample changes that result; the finding is limited to the uncovered pattern boundary and does not reopen the broader flag audit.

### P2 Findings

None new. The registry carries one active P2 from iteration 4.

## Traceability Checks

- Core `spec_code`: partial with a concrete REQ-001 mismatch, evidenced by the parser and phase spec.
- Core `checklist_evidence`: partial. The test verifies `--goal` refusal and `--with-goal` success but does not cover the standalone dash.
- Overlay `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`, and `playbook_capability`: not reassessed in this correctness pass. Earlier coverage remains partial.
- The selected create.sh changelog paragraph was compared with the phase requirement and parser. The full changelog claim-to-tree audit remains deferred.

## Integration Evidence

The direct surface is the system-spec-kit `create.sh` CLI. Its scoped vitest exercises the refusal and supported-goal paths. The changelog's selected paragraph describes the same refusal contract.

## Edge Cases

- The multi-character unknown flag `--goal` exits 1 in the parser branch and the regression test asserts an error, help pointer, empty stdout, and no new spec folder.
- The supported `--with-goal` path remains covered by a test that expects `goal.md`.
- The phase spec excludes a `--` end-of-options marker. This review did not infer support for that separate syntax.

## Confirmed-Clean Surfaces

- The existing `--goal` failure path and `--with-goal` happy path are represented by the scoped test. The checks were read, not executed.

## Ruled Out and Deferred

- Ruled out for the selected case: multi-character unknown-option refusal and valid `--with-goal` behavior, based on the parser and test evidence.
- Deferred: full changelog accuracy, Commit-Id policy validation, and Pi Fast Mode model-default review. The strategy records the latter two source paths as outside the supplied manifest; they were not read or retried.

## Verdict

Active registry before this iteration: P0=0, P1=1, P2=1. With R5-P1-001, active counts are P0=0, P1=2, P2=1. This is an iteration-level report; the full release review remains limited by the deferred targets above.

## Next Dimension

None. All four dimensions are already covered, and iteration 5 of 5 reached the configured maximum.

Review verdict: CONDITIONAL

