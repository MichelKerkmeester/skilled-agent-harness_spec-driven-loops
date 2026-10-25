# Iteration 4: Usefulness evidence (Q4)

## Focus

Assess what the repository's own benchmark reports, manual testing scenarios and changelog establish about review usefulness, effort and gaps.

## Actions Taken

1. Read the benchmark index and both July 10 report sets, including score breakdowns, scenario tables, failed-run summaries, result CSVs and source maps.
2. Read the playbook overview and scenarios for injection, large refactors, class-of-bug inventory, cross-consumer impact and review depth.
3. Read changelog entries v1.4.0.0, v1.7.0.0 and v1.7.1.0, then compared their claims with the benchmark coverage.
4. Did not execute the playbook's live scenarios. The available reports are the evidence for this iteration's benchmark claims.

## Sources Consulted

- `.skilled/skills/sk-code/sk-code-review/benchmark/reports/`, including the index and the router-mode-a and live-mode-b report folders.
- `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md` and the injection, large-refactor, same-class-producer and cross-consumer scenarios.
- `.skilled/skills/sk-code/sk-code-review/changelog/v1.4.0.0.md`, `v1.7.0.0.md` and `v1.7.1.0.md`.

## Findings

1. **DERIVED:** The July 10 report index records seven passing scenarios in both runs. The detailed reports show only routing-class scenarios, while D4 usefulness is unscored. Therefore, the 100/100 pass does not establish code-review finding accuracy. [SOURCE: `.skilled/skills/sk-code/sk-code-review/benchmark/reports/README.md:27`] `7 PASS **PASS** 100/100` [SOURCE: `.skilled/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.md:20`] `D4 usefulness | 25pts | _unscored-mode-a_` [SOURCE: `.skilled/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.md:9`] `By class — routing: 7` [SOURCE: `.skilled/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.md:52`] `D4 (ablation) need live mode`

2. **DERIVED:** D3 efficiency receives 100/100, but the reports record neither executor nor model, and the result CSV has no duration or token field. Measured runtime cost and operator effort remain unknown. [SOURCE: `.skilled/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--router-mode-a--router/skill-benchmark-report.md:19`] `D3 efficiency | 15pts | 100/100` [SOURCE: `.skilled/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--live-mode-b--live/README.md:24`] `Executor | not recorded` [SOURCE: `.skilled/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--live-mode-b--live/README.md:25`] `Model | not recorded` [SOURCE: `.skilled/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--live-mode-b--live/results.csv:2`] `tier,stage,class_kind,gold_mode`

3. **OBSERVED:** The playbook sets concrete usefulness targets: trace untrusted input to injection sinks, inventory other producers of the same bug class, identify consumers of changed contracts, and disclose limits on large diffs. [SOURCE: `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/security-and-correctness-minimums/input-validation-injection.md:19`] `Source-to-sink tracing for SQL, command, path` [SOURCE: `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/severity-and-evidence-discipline/class-of-bug-vs-instance-only.md:19`] `same-class producers must be inventoried` [SOURCE: `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/severity-and-evidence-discipline/cross-consumer-affected-surface.md:19`] `inventory every consumer of changed symbols` [SOURCE: `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/baseline-review-flow/large-refactor-pr.md:19`] `500+ LOC across multiple files`

4. **DERIVED:** The playbook is a test contract, not evidence that those review behaviors have been exercised: it requires live execution and retained outcomes, while the benchmark reports contain seven routing scenarios. The playbook also says 30 scenarios in its overview and 31 covered features in its release gate, so the complete validation denominator is inconsistent. [SOURCE: `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md:9`] `Every scenario MUST be executed against the live` [SOURCE: `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md:37`] `30 deterministic scenarios across 8 categories` [SOURCE: `.skilled/skills/sk-code/sk-code-review/manual-testing-playbook/manual-testing-playbook.md:138`] `COVERED_FEATURES == TOTAL_FEATURES == 31` [SOURCE: `.skilled/skills/sk-code/sk-code-review/benchmark/reports/2026-07-10--live-mode-b--live/skill-benchmark-report.md:42`] `CR-R01 | routing | 100/100 | passed`

5. **DERIVED:** The changelog records intended product gains, such as flagging hand-rolled native behavior and unneeded code, classifying a generic Node repository as UNKNOWN, checking both finding shapes and pinning evidence-floor labels. These entries describe changes but provide no measured review outcomes. [SOURCE: `.skilled/skills/sk-code/sk-code-review/changelog/v1.4.0.0.md:20`] `hand-rolled standard-library behavior` [SOURCE: `.skilled/skills/sk-code/sk-code-review/changelog/v1.7.0.0.md:14`] `generic Node repository is reported as UNKNOWN` [SOURCE: `.skilled/skills/sk-code/sk-code-review/changelog/v1.7.0.0.md:22`] `Both finding shapes are checked` [SOURCE: `.skilled/skills/sk-code/sk-code-review/changelog/v1.7.1.0.md:14`] `rule canary now fails when one`

## Questions Answered

- Q4 Usefulness evidence: what does review catch, cost and miss in the repository's own benchmark reports, playbook scenarios and changelog?

## Questions Remaining

- Q2 UNKNOWN-surface path remains carried forward as open despite the reducer summary separately marking it answered.
- Q3 Output contract.
- Q5 PR-state efficiency gates.
- Q6 Review and quality boundary.
- Q7 Surface packets.
- Q8 Consumers and contracts.
- Q9 User-authored modes.
- Q10 Repo-local policy and floors.

## Assessment

`newInfoRatio`: 1.0. This iteration adds evidence about the gap between routing benchmark passes and measured review usefulness, plus the playbook's intended catch cases and coverage-count inconsistency. Confidence is high for the report contents and the playbook's stated contracts. Actual catch rates, false-positive rates, runtime and human review time remain unknown because no live playbook runs or timed benchmark results were available in the reports read.

## Reflection

The three source groups complement one another: benchmark reports show what was scored, playbook scenarios define what useful behavior should look like, and changelogs explain which behaviors were added. Their limits also differ: the benchmark does not score review outcomes, the playbook is not a run result, and the changelog is not an efficacy study.

## Next Focus

Angle 5, Q5: assess the portability and configurability of content-hash deduplication, the minimum-evidence gate and the depth alias across repositories without remotes, monorepos and different file naming.
