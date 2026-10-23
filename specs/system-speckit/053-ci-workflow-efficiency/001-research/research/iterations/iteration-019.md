# Iteration 019 - Verification pass: three of five headline figures corrected, one holds, one is not a saving

## Focus

Re-check the five largest claimed savings from iterations 001-018 against the workflow files and the
measured dataset, correct every figure that does not reproduce, and turn the result into a ranked top-10
with saving, risk and effort plus the phase grouping 002+ (the last open key question). Read-only: no
workflow, script or code was modified.

## Actions Taken

1. Re-read the dataset billing rule and the 13 per-workflow medians, then re-derived the rebuild fan-out
   from the 13 rows instead of trusting the earlier product.
2. Read the four staged paths in the rebuild workflow and every one of the 13 downstream `on:` blocks, to
   test whether a `paths-ignore` edit is even expressible on each.
3. Traced which code reads the four committed generated files (tests and runtime), to test the claim that
   suppressing spec-kit-check loses index coverage.
4. Re-derived the merged-job arithmetic from the 13 recorded job seconds rather than from the earlier prose.
5. Re-read the two cache/merge estimates and checked whether they are additive.

## Findings

**F19-1 (confirmed) - the rebuild fan-out is 2,073 billed min/day and the arithmetic reproduces exactly from
the summary table, but the suppression is a `paths-ignore` key on only 9 of the 13 workflows; the other 4
already declare `paths:` and need negated entries inside that list instead.**

Summing the 13 downstream rows and weighting each by the 35 rebuild SHAs in the 73-SHA window gives
2,073 billed min/day against the dataset's 3,812 [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:5]
(spec-kit-check 895, sk-doc-script-tests 215, command-tree-parity 143, dispatch-enforcement-guard 143,
hooks-node-tests 143, opencode-plugin-tests 107, changed-packet-validation 71, gate-inputs 71,
message-contract 71, playbook-operator-contract 71, rule-canary-sync 71, advisory-checks 36,
markdown-link-integrity 36). That reproduces iteration 018's 2,074 and confirms the cost side of F18-1/F18-8.
The four staged paths are the index and three fixture sidecars
[SOURCE: .github/workflows/trigger-index-rebuild.yml:79]. Nine workflows have no push `paths:` and can take a
`paths-ignore:` block directly: sk-doc-script-tests [SOURCE: .github/workflows/sk-doc-script-tests.yml:8],
command-tree-parity [SOURCE: .github/workflows/command-tree-parity.yml:3],
dispatch-enforcement-guard [SOURCE: .github/workflows/dispatch-enforcement-guard.yml:3],
changed-packet-validation [SOURCE: .github/workflows/changed-packet-validation.yml:3],
gate-inputs [SOURCE: .github/workflows/gate-inputs.yml:2],
message-contract [SOURCE: .github/workflows/message-contract.yml:7],
playbook-operator-contract [SOURCE: .github/workflows/playbook-operator-contract.yml:2],
rule-canary-sync [SOURCE: .github/workflows/rule-canary-sync.yml:2],
advisory-checks [SOURCE: .github/workflows/advisory-checks.yml:2]. Four already filter by path:
spec-kit-check [SOURCE: .github/workflows/spec-kit-check.yml:6],
hooks-node-tests [SOURCE: .github/workflows/hooks-node-tests.yml:14],
opencode-plugin-tests [SOURCE: .github/workflows/opencode-plugin-tests.yml:14],
markdown-link-integrity [SOURCE: .github/workflows/markdown-link-integrity.yml:19]. GitHub does not allow
`paths` and `paths-ignore` on the same event (documented GitHub rule; not re-read from the docs this
iteration, so treat as documented, not confirmed from this repo). Those four need a `!` negation appended to
their existing `paths:` list; the effect is the same, the edit is not.

**F19-2 (confirmed) - no downstream CI job reads the generated index content, so suppressing spec-kit-check on
rebuild-only commits costs no index coverage; the one test that names the four paths validates the rebuild
workflow, not the files.**

The only test in the spec-kit tree that names the committed paths is
[SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts:57], and it
reads the workflow YAML [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts:35]
to assert the staged set. The index suite generates into a temporary `out/` directory rather than loading the
committed file [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index.vitest.ts:82]. The
rebuild compares every staged file byte-for-byte against a fresh generation before committing
[SOURCE: .github/workflows/trigger-index-rebuild.yml:89]. So the coverage argument that would have protected
spec-kit-check's 895 min/day does not hold, and the full 2,073 is addressable. The residual risk is the
opposite one: a future test that does load the committed index would be silently skipped on rebuild commits,
so the exclusion should ship with a test that asserts the four paths are ignored, which makes the coupling
visible to whoever adds that test.

**F19-3 (confirmed) - F18-4's derivation does not reproduce, but its figure is a floor, not a ceiling: the
merged job bills 3-8 minutes against 25 today, a saving of 17-22 min/push (1,241-1,606/day), not 10-12.**

The 13 jobs total 1,065 job-seconds and bill 25 minutes
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:47]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:48]
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:53].
Each of those job-seconds already contains that job's own checkout, measured at 50-76 s per job
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-004.md:167].
One merged job keeps one checkout, so its work is 1,065 s minus 12 checkouts = 153-465 s = 3-8 billed minutes.
F18-4 instead subtracted a floor from the 25 billed minutes and also described the 13-15 minutes as the
merged total, which cannot both be true: 25 minus eight 25-40 s floors is 20.3-21.7, not 13-15. The direction
is right and the stated range is 40-50% too low. What makes the bigger number unusable is not arithmetic:
9 check contexts collapse into 1, the merged job's wall-clock is 8-10 minutes serial against a 167 s worst
single job today (still behind spec-kit-check's 1,178 s tail, so the push tail is unchanged), and a failing
step stops the rest unless every step is guarded with `if: always()`, which destroys the per-check signal
the 9 workflows exist to give.

**F19-4 (confirmed) - iteration 001's "merging small jobs does not recover the rounding" is wrong, and it is
the exact mechanism iteration 018's F18-4 relies on. F18-4 wins; the 986 min/day is not a separate saving.**

Billing is `ceil(job seconds / 60)` per job [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:5],
so 13 jobs pay 13 ceilings and one job pays one. Iteration 001's own table shows command-tree-parity billing
4 minutes for 2.3 job-minutes [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:47],
and its conclusion that a merge "worsens wall-clock" is true while its conclusion that it "does not recover
the rounding" is false. The 986 min/day ceiling-waste figure is a property of the current job graph, not a
lever: about 7 of F19-3's 17-22 min/push is exactly that rounding, so adding 986 to any consolidation saving
double-counts it.

**F19-5 (confirmed) - the two cache recommendations are not additive: 145 + 124 counts one provision twice;
the pair is about 207/day, as iteration 003's own R1+R2 row already said.**

With the tree cache the merged hooks+plugin job is 189 s = 4 billed against 5 today, so the merge adds
about 62/day on top of the cache's 145, not 124. Iteration 003 states the dependency in F5 ("unless the cache
lands first") and its summary row prices the pair at 207
[SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/research/iterations/iteration-003.md:206].
Standalone, each number holds: 62x1 + 62x1 + 7x3 = 145 and 2 min/run x 62 = 124.

**F19-6 (documented) - playbook-operator-contract's "deliberately NOT path-filtered" comment reads as a veto
of the ignore and must be amended in the same change.**

[SOURCE: .github/workflows/playbook-operator-contract.yml:3] explains that a filtered trigger would let a
cross-tree rename land green. A `paths-ignore` on four generated files is compatible with that rationale
(any commit that renames something else still runs), but leaving the comment untouched hands a reviewer a
contradiction to resolve. The same applies to no other workflow: the remaining 8 have no such comment.

**F19-7 (inferred) - the 776 s CLI vitest project is the only lever inside spec-kit-check that crosses a
billing boundary for a small change.**

The job bills 21 minutes at 1,215 s [SOURCE: specs/system-speckit/053-ci-workflow-efficiency/001-research/scratch/ci-run-data/summary.md:45];
at 1,200 s or below it bills 20. The CLI project is 65.5% of that job, from one run's step timings
(run 39910111430, iteration 001). A 15 s trim is enough for 1 min/run (about 50/day at 50 runs); anything
smaller buys wall-clock only. Inferred because the step split comes from a single run.

## The five headline savings, re-checked

| # | Claim (iteration) | Claimed | Re-check result | Verdict |
|---|---|---|---|---|
| 1 | Rebuild-commit fan-out (018 F18-1/F18-8) | 2,074 min/day, 54% | Sum reproduces at 2,073; only 9 of 13 can take `paths-ignore`; no index coverage is lost (F19-2) | **Holds**; implementation corrected |
| 2 | Merge the nine always-run workflows (018 F18-4) | 730-876 min/day | Derivation does not reproduce; correct floor 1,241-1,606, but 9 contexts and serial wall-clock make it a phase-004 decision | **Understated; derivation wrong** |
| 3 | Tree/install cache (003 R1, 004 F7, 012 F5) | 145 min/day | Reproduces: 62+62+21; boundary crossings hold on the medians; three inputs still inferred | **Holds** |
| 4 | Merge hooks into plugin (003 R2) | 124 min/day | Holds standalone; 62 marginal if the cache lands first; not additive with #3 | **Holds, conditional** |
| 5 | Ceiling-rounding waste (001 F3) | 986 min/day (26%) | Real as a property, false as a lever: consolidation does recover it, and it is inside #2 | **Not a saving; fold into #2** |

## Top 10 recommendations (ranked by risk-adjusted saving)

| # | Change | Saving | Risk | Effort | Phase |
|---|---|---|---|---|---|
| 1 | Ignore the four generated paths on the 12 downstream workflows (9 x `paths-ignore:`, 4 x `!` in `paths:`) | 2,073 billed min/day (54% of 3,812) | Low-medium: suppressed run leaves the check absent; amend the playbook comment | Low: 12 small edits | 002 |
| 2 | Composite setup action + `actions/cache` for the 14 trees and 5 builds; replace `npm install bun` with a pinned setup | 145 min/day (3.8%), about 40 s/job wall | Medium: restore throughput, cache budget, staleness | Medium | 003 |
| 3 | Merge hooks-node-tests into opencode-plugin-tests, after #2 | 62 min/day marginal (124 standalone) | Medium: required-check name changes | Low | 003 |
| 4 | npm cache and install dedupe in the 11 multi-install workflows (largest: routing-registry-drift's 88 s install+build) | 20-40 min/day realistic outside the three provisioning workflows (ceiling 340) | Low-medium | Medium | 003 |
| 5 | Consolidate the nine always-run workflows into one job | 1,241-1,606 min/day upper bound | High: 9 contexts to 1, serial wall-clock, `if: always()` guards | Medium | 004 |
| 6 | Trim the 776 s CLI vitest project by at least 15 s | about 50 min/day + 776 s wall | Low | Medium | 006 |
| 7 | Fix deep-loop-runtime's 13/40 failure rate | about 10 min/day of re-runs + 690 s wall | Low | Medium | 006 |
| 8 | Path-filter comment-hygiene, agent-mirror-sync and prompt-card-sync to their checker inputs | One job per unaffected PR (0 in the measured window: no runs) | Low | Low | 002 |
| 9 | `concurrency: cancel-in-progress` on the PR-triggered workflows | Wall-clock only on superseded pushes; unmeasured | Low | Low | 002 |
| 10 | `sk-code-ci` standards packet, `/doctor:ci` routes and the on/off control | 0 direct; makes 1-9 repeatable and keeps new workflows compliant | Low | Medium | 005 |

## Phase grouping (answers the last key question)

- **002 - trigger surgery.** Rows 1, 8, 9. No job, check-name or ruleset change; every edit is inside an
  `on:` block. Row 1 is safe against branch protection for the same reason F18-8 gave: the rebuild pushes
  directly with a token and 35 such pushes already exist in the window, so a suppressed check on that SHA is
  already the shipped behaviour. Largest confirmed saving, lowest blast radius, so it goes first.
- **003 - caching and provision dedupe.** Rows 2, 3, 4. Must precede 004: row 5's number is computed against
  today's install and checkout costs, so landing the cache first shrinks it by about 145/day and landing 004
  first double-counts that. Row 3 depends on row 2 for the same reason (F19-5).
- **004 - job consolidation.** Row 5 only. Gated by the still-open required-check question: collapsing 9
  contexts into 1 is a ruleset edit, and whether a job skipped by `if:` satisfies a required check is
  unestablished. It is also the only row that trades wall-clock and failure isolation for billed minutes.
- **005 - governance and tooling.** Row 10. No runtime saving; it must land before any new workflow is added,
  which is the only way rows 1-9 stay true after the next workflow is written.
- **006 - slow tests and flakiness.** Rows 6, 7. Last, because both need a stable baseline and row 2 changes
  the job boundaries row 6 would be measured against.

The ordering rule is: a row moves earlier only if it has no dependency on a later row's number. That is what
puts 002 before 003 before 004 and keeps 005 parallel but ahead of new work.

## Questions Answered

- How do the ranked recommendations group into ordered implementation phases 002 and later? - answered: five
  phases, with the dependency chain above and the required-check question gating phase 004.

## Questions Remaining

- **Still blocking phase 004:** does a job skipped by `if:` satisfy a required status check? Unchanged.
- Carried: are spec-kit tests fixture-collision-safe under `fileParallelism: true`, and what are the include
  globs of `.skilled/hooks/vitest.config.ts`?
- Carried: which jobs duplicate pre-commit hooks?
- New: what is the real per-job fixed floor? Partly answered by the 50-76 s checkout table, still a model for
  the install half.
- New: F19-2's residual - a future test that loads the committed index would be silently skipped on rebuild
  commits, so row 1 should ship with a test asserting the four paths are ignored.

## Next Focus

Iteration 020 is the final one: assemble the ranked table and phases into the final report with no new
measurement, and name the single blocking unknown (the required-check question) plus the two inferred inputs
the cache saving rests on.
