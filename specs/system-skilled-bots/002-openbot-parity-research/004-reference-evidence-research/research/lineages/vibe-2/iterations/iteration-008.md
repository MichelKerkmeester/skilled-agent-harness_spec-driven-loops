# Iteration 8: Phases 012-manual-testing-scenarios and 014-deep-review

## Focus

Phases 012-manual-testing-scenarios and 014-deep-review. Both are closing phases whose subject is proof rather than feature, and both have a reference in `buzz-main` that no iteration has read: `TESTING.md` is a 452-line operator runbook with a review-derived test standard, and `CHANGELOG.md` is a per-release record. The question for both is what the reference proves that the plan's own proof does not.

## Actions Taken

1. Read the plan's 012 Problem Statement, Measured Behavior, its root-index requirement and its NFR-R01.
2. Read the plan's 014 Problem Statement, Measured Behavior, its review-inputs paragraph, REQ-011 and its risk row.
3. Read `buzz-main/TESTING.md` headings, its Review-Proven Test Standards section, its live-relay procedure and its troubleshooting and configuration sections.
4. Read `buzz-main/CHANGELOG.md`'s head and `buzz-main/PLANS/`.
5. Compared the reference's test standard with the plan's review severity model.

## Findings

1. **014 — the reference's test standard is falsifiability and the plan's review has no such rule.** "Regression tests must bind the production seam and be falsifiable. A guard whose removal doesn't fail any test protects nothing — mutations survived the full mobile suite twice (PRs #6996, #7013)." [SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:24-27] *(observed)* The plan's 014 reviews code and docs for P0 and P1, and its only mention of a guard is the suite and the validator as a guard against a wrong fix. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:288] *(observed)* So a test that asserts nothing passes the plan's review, and the plan's own Problem Statement names the opposite failure — "a test that asserts a shape a later phase changed" — which is a test that breaks rather than a test that never could. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:75] *(observed)* This is the highest-value 014 finding: the review needs one rule that a regression test must fail when its guard is removed.

2. **014 — the reference mines its own review threads into a standing rule and the plan's review produces findings only.** The test standard is "Mined from the last 25 PRs' review threads (see Review-Proven Rules in AGENTS.md); this is the test-quality rule reviewers litigated most". [SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:21-23] *(observed)* The plan's 014 produces `review/seeded-findings.json` and a findings registry, both scoped to this run. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:188] *(observed)* Nothing turns a finding that recurs across phases into a rule the next phase inherits. The reference's practice is the missing step, and it costs one section in `AGENTS.md`.

3. **014 — the reference's test standard names its anti-patterns with the pull request that proved each, and the plan's review has no anti-pattern list.** "Don't bind a regression test to a test-only helper instead of the production code path (PR #7013). Give pure predicates a table test over the full input combination space (PR #6807). Scope Playwright locators — unscoped `getByText` in a required smoke test is a strict-mode flake (PR #6980)." [SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:27-32] *(observed)* The plan's 014 has three review inputs and a severity table and no list of known test anti-patterns. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:50] *(observed)* The plan's runtime holds 381 tests, so a test bound to a test-only helper is a live risk rather than a hypothetical one.

4. **014 — the plan's 014 already guards the failure the reference's practice implies, by seeding every review-input row before any lineage spawns.** REQ-011: "Every row of the three review inputs becomes a seeded finding before any lineage spawns, at the severity `design/records.md` section 7.4 assigns ... A missing input is recorded with its reason and does not stop the run." [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:188] *(observed)* The reference has no equivalent: its standards are mined after the fact from threads that already closed. Confirmation, and the plan's ordering is the stronger one.

5. **012 — the reference's runbook names the silent failure a skipped step produces and the plan's preconditions are index-level.** "Skip this and the agent boots to \"discovered 0 channel(s) → agent will sit idle\" and silently ignores every mention." [SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:344-345] *(observed)* The plan's root index gains "the preconditions the new scenarios need" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:194] and NFR-R01 refuses a silent pass [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:255] *(observed)* — but a precondition is a list, not a named failure mode. A scenario that runs with a missing precondition and still prints `PASS` is the gap the reference closes by writing the silent outcome beside the step.

6. **012 — the reference's runbook warns before a destructive command and the plan's corpus has no destructive-command rule.** The reference marks a reset recipe "fine for read/write smoke tests, but: `just reset` wipes Desktop's data". [SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:55] *(observed)* The plan's 012 runs "from a plain terminal" against the operator's real tree and records each verdict as `PASS` or `FAIL` with its evidence saved. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:66] *(observed)* It has no rule that a scenario must not destroy operator state, and 008's vault and 005's memory are exactly the stores a scenario would wipe. One line per scenario naming the store it may touch is the fix.

7. **012 — the reference's runbook is a numbered procedure with copy-pasteable commands and expected output, and the plan's corpus is a scenario table.** `TESTING.md`'s steps 1 to 6 each carry a shell block and the output to expect, for example `CHANNEL=$(buzz channels create --name "smoke-$$" --type stream --visibility open | jq -r '.channel_id')`. [SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:231-260] *(observed)* The plan's 012 records each verdict as `PASS` or `FAIL` with its evidence saved. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:66] *(observed)* The plan's shape is the stronger one for a corpus of 25 or more scenarios; the reference's is the stronger one for a first run by a person who has never seen the tool. Confirmation of the plan's choice, with the reference's first-run shape worth keeping for the playbook's opening section.

8. **012 — the reference's runbook carries a troubleshooting section and the plan's corpus has no place to record a failure's cause.** `TESTING.md` has `## Configuration reference` at line 405 and `## Troubleshooting` at line 439. [SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:405,439] *(observed)* The plan's 012 has a `SKIP` verdict with its blocker but no field for what a `FAIL`'s cause was, so a second run repeats the diagnosis. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:255] *(observed)* Small, and one column closes it.

9. **014 — the reference's changelog is a per-release record with a pull request and a commit hash per entry, and the plan's 014 records no version.** `CHANGELOG.md` opens `## v0.5.30` with entries such as "- feat(db): label advisory-lock metrics with the locked event kind ([#9472](...)) ([`359839f70b6`](...))". [SOURCE: specs/system-skilled-bots/context/buzz-main/CHANGELOG.md:3-7] *(observed)* The plan's 014 closes on a reviewed surface, a passing suite and a passing validator, and records no version. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:31] *(observed)* For a small team the changelog is the upgrade path: a person who pulls the repo needs to know what changed, and the plan's own out-of-scope list says "a checkout updates with `git pull`". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:88] *(observed)*

## Ruled Out

- **A numbered copy-paste runbook for 012 in place of the scenario table.** The plan's corpus is 25 or more scenarios across ten categories; a numbered procedure does not scale past the first run. Recorded as finding 7, with the reference's shape kept for the opening section.
- **A post-hoc mining pass for 014.** The plan seeds every review-input row before any lineage spawns, which is the stronger ordering. Recorded as finding 4.
- **`buzz-main/PLANS/` as a source.** It holds two files, `ANDROID_PUSH.md` and `REPLICA_FULL_READ_ROUTING_DESIGN.md`, both about a mobile and a relay design with no analogue in a local CLI. Read once, not again.

## Dead Ends

- `buzz-main/ARCHITECTURE.md` and `docs/` for 014's review method — the reference reviews through pull requests and a changelog generator, not through a review phase. The method is in `TESTING.md` and `AGENTS.md`, not in the architecture.
- `buzz-main/lefthook.yml` and `ct.yaml` as a review gate — they are pre-commit and chart-testing hooks, and the plan's gate is `validate.sh` plus the suite. No finding.

## Edge Cases

- Ambiguous input: none. Both phases had one reading.
- Contradictory evidence: none. The plan and the reference differ on where a test standard lives, and each follows from the plan having one review phase where the reference has continuous pull requests.
- Missing dependencies: `buzz-main/AGENTS.md`'s "Review-Proven Rules" section was not read, so the rule set's full size is unknown. Fallback: `TESTING.md`'s summary, which names the one rule reviewers litigated most. Confidence impact: the count of rules is inferred, not read.
- Partial success: none. Every planned read resolved.

## Sources Consulted

- specs/system-skilled-bots/context/buzz-main/TESTING.md:19-36,55,231-260,344-345,405,439
- specs/system-skilled-bots/context/buzz-main/CHANGELOG.md:1-25
- specs/system-skilled-bots/context/buzz-main/PLANS/
- specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/spec.md:63-66,194,229,255
- specs/system-skilled-bots/003-openbot-parity-build/014-deep-review/spec.md:31,41,50,75,188,226,239,288
- specs/system-skilled-bots/003-openbot-parity-build/spec.md:88

## Assessment

- New information ratio: 0.83
- Questions addressed: the topic's first question for phases 012 and 014.
- Questions answered: 014's missing falsifiability rule, the review-proven-rules practice, the anti-pattern list, the seeding confirmation and the changelog gap; 012's silent-failure precondition, the destructive-command rule, the runbook-shape confirmation and the failure-cause column.

## Reflection

- What worked and why: reading `TESTING.md` for its *standards* section rather than its procedure. The procedure is 400 lines of relay setup that has no analogue in a local CLI, and the 14-line standards section at the top is the only part that transfers — and it carries the single strongest 014 finding in the packet.
- What did not work and why: the first pass looked for a manual-testing corpus in the reference and found a runbook instead, because the reference has no operator scenario table. The value was in the runbook's *warnings* — the silent failure and the destructive command — not in its steps.
- What I would do differently: for a closing phase, read the reference's standards and warnings before its procedure, because a closing phase inherits rules and not steps.

## Recommended Next Focus

The remaining net-new sweep: `rakazo-main`, `OpenMausBot-main`, `OpenGhost-main`, `hermes-muse-main`, `turnstone-main` and `tinychannels-main`'s remaining surface, plus a licence sweep across all ten repos. No iteration has read five of those six, and the topic's second question cannot be answered without them. The open question this iteration leaves is whether 014's falsifiability rule belongs to 014 or to 013, since 013 is the phase that aligns the docs and a test standard is a doc.
