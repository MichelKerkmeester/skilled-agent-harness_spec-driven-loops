# Deep Review Iteration 4: Maintainability

## Dispatcher

- Mode: review
- Dimension: maintainability
- Iteration: 4 of 5
- Review target: the declared `/doctor:git` setup program and its named traceability surfaces
- Status: complete. Three test or maintainability gaps are recorded. Serializer round-trip and duplicate-target scope conclusions remain blocked because the combined evidence output was truncated before those results could be inspected.

## Dimension

The test battery is useful for the fixture repository and for the concrete helper/config paths it asserts. Two tests can still pass without covering the full invariant their names suggest. The allowlist report also chooses and parses its displayed pattern file separately from the matcher that supplies the sample verdicts.

## Files Reviewed

- `.skilled/commands/doctor/scripts/git-setup-check.cjs:312-388` — standards validation delegates to `message-contract.mjs`; allowlist sample verdicts call `worktree-naming.sh`, while displayed patterns use separate path-selection and parsing helpers.
- `.skilled/commands/doctor/scripts/git-setup-check.cjs:556-584` — suppression and runtime registration checks.
- `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:92-113,197-209` — fixture-tree snapshot and no-write assertion.
- `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:216-254` — planted helper and fsmonitor markers; the fixture comments say the install gate stops before the validator in this setup.
- `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:454-470` — linked-worktree allowlist and base-path case.
- `.skilled/commands/doctor/scripts/git-standards.cjs:135-138` — serializer preserves the styled form only when it round-trips identically, otherwise it emits JSON.

Search was attempted for the standards template and serializer tests, duplicate-target scoping and the two additional test files named in the prompt. Their relevant output was truncated before it could be inspected. Those checks are recorded as blocked rather than treated as clean.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new in this iteration. Four prior P1 findings remain active in the review registry.

### P2 Findings

1. **The no-write test only detects writes inside the fixture repository** — `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:197-209`

   The test snapshots `f.repo` before and after the battery run, including `.git`, and separately compares local Git config. This proves the fixture tree stayed unchanged. It does not observe a write to the installed toolchain or another path outside `f.repo`.

   Finding class: matrix/evidence
   Scope proof: `snapshotTree` is called with `f.repo` at both points, while the test has no snapshot or write guard for the install root or other filesystem paths.
   Affected surface hints: ["git-setup-check.cjs", "no-write test"]
   Case: a one-line regression that writes a marker under the installed `.skilled/skills/sk-git` tree or `/tmp` leaves `f.repo` unchanged, so this test still passes although the battery wrote a file.
   Recommendation: extend the test harness to observe writes to the install root and other paths the checker can write, or run the checker under a write-denying fixture sandbox.

2. **The planted-helper test can pass without proving the helper-resolution path was exercised** — `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs:232-254`

   The test plants `validate-message.mjs`, but its own comment says the install check bails out before reaching the validator for this incomplete fixture. The assertions check the trust row and marker absence; they do not assert that the standards or validator path ran. A repository-root helper lookup regression can therefore survive if the early install path continues to bypass that lookup.

   Finding class: test-isolation
   Scope proof: the test comment at lines 232-242 identifies the early exit; the assertions at lines 250-254 check marker absence without requiring the validator check to have executed.
   Affected surface hints: ["git-setup-check.cjs helper resolution", "planted-helper test"]
   Case: change helper resolution to inspect the target checkout's planted validator, while keeping the fixture on the early install-failure path; the validator marker remains absent and the test passes.
   Recommendation: use a fixture that satisfies the install gate and assert the standards/validator result was reached before asserting the planted marker stayed absent.

3. **Allowlist verdicts and displayed patterns have separate source-selection logic** — `.skilled/commands/doctor/scripts/git-setup-check.cjs:358-388`

   Sample verdicts come from `worktree-naming.sh`, but the report independently selects an allowlist file and parses its patterns. A later change to the helper's file precedence or parsing can leave the displayed patterns out of sync with the matcher that produced the verdicts.

   Finding class: instance-only
   Scope proof: the verdict path invokes the helper at lines 358-368; the display path calls `allowlistFileFor` and `allowlistPatternsIn` at lines 369-388.
   Affected surface hints: ["worktree-naming.sh", "allowlist report details"]
   Case: if the matcher changes which of `.skilled` or `.opencode` wins when both files exist, but this duplicate selector does not change, the report can show patterns from one file while the sample verdict used the other.
   Recommendation: have the matcher expose the selected source and parsed patterns, or add a regression case with both candidate files that proves the displayed source matches the helper's source.

## Traceability Checks

- Core `spec_code`: partial. The shipped standards check uses `message-contract.mjs` directly, but the requested 034 template round-trip claim could not be adjudicated from the visible output.
- Core `checklist_evidence`: no new evidence review in this dimension; iteration 3's AC-002 evidence issue remains carry-forward.
- Overlay `feature_catalog_code` and `playbook_capability`: passed in iteration 3. Setup naming was not re-audited here, per the no-repeat constraint.
- Overlay `skill_agent` and `agent_cross_runtime`: prior partial status remains unchanged; not part of this maintainability pass.

## Integration Evidence

`git-setup-check.cjs` calls the installed `message-contract.mjs` for standards resolution and loading at lines 316-346. Allowlist sample verdicts run the installed `worktree-naming.sh` at lines 352-368. This pass did not execute the battery or run its tests.

## Edge Cases

- The combined read command exceeded the output display limit. The standards serializer round-trip, route validator duplicate-target logic, `route-validate.test.sh`, and `check-gate-inputs.test.sh` remain unverified in this iteration.
- The no-write finding is a test-coverage gap. This iteration did not observe an actual out-of-repository write by the shipped checker.
- The helper-resolution finding is likewise a test reachability gap, not evidence that the shipped checker currently executes repository code.

## Confirmed-Clean Surfaces

- The standards check delegates contract directory resolution and contract loading to the installed `message-contract.mjs` rather than parsing contract blocks itself.
- The no-write test covers all bytes beneath its fixture repository, including `.git`, and separately checks local Git config.
- The sample allowlist verdicts are computed by the actual `worktree-naming.sh` helper.

## Ruled Out

- Duplicate contract parsing inside `git-setup-check.cjs`: ruled out for the inspected standards path because `checkStandards` imports and calls `resolveContractDir` and `loadContract` from the shared module.
- Setup-name drift across the feature catalog and manual playbook: not repeated; iteration 3 recorded both surfaces as passing.

## Next Focus

- Dimension: maintainability
- Focus area: finish the blocked serializer round-trip and duplicate-target scoping checks, then inspect mutation sensitivity in `route-validate.test.sh` and `check-gate-inputs.test.sh`.
- Reason: those requested surfaces were not inspectable in the combined output, so the dimension remains partial.
- Rotation status: productive carry-forward.
- Blocked/productive carry-forward: complete the four blocked checks listed above.
- Required evidence: direct reads of `git-standards.cjs`, `message-contract.mjs`, the 034 packet claims and tests, `route-validate.py` with its test, and the gate-input script with its test.
- Recovery note: use focused reads so the evidence remains within the output budget.

## Verdict

This iteration adds three P2 findings and no new P0 or P1 findings. Four prior P1 findings remain active, so the overall review verdict stays conditional.

Review verdict: CONDITIONAL
