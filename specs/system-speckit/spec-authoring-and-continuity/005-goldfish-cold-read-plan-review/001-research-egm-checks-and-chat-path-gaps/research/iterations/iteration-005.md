# Iteration 5: The change set as exact edits, and a correction to the fixture cost

## Focus

All five strategy questions are `[x]` and the reducer reports no open question. So this final
iteration did not re-open the analysis; it converted iterations 3–4's *recommendation* into
**insertion-ready edits** — the exact anchor lines, the exact new lines, the exact test template,
the exact doc clause — and in doing so tested the one claim iteration 4 asserted from reasoning
rather than from the suite: "the unit suites do not exercise `fanout-config-json` at all". That
claim is false, and the correction changes the change's fixture cost and supplies a better test.

**Ambiguity resolved:** the topic asks for "the smallest set of changes to existing files". Read
as the fewest *lines touched*, not the fewest *files named*, so a second line in the same script
that already hosts the change (the flag allowlist) belongs to change 1 rather than counting as a
new change. Deferred: nothing.

## Actions Taken

1. Read `fanout-run.cjs:20-60` (the `FANOUT_FLAGS` allowlist and its imports) and `100-140` (`parseArgs`, `inputError`, `assertKnownFlags`).
2. Read `fanout-run.cjs:3340-3460` — the config parse, path binding, `expandLineages`, and the existing `stopPolicy=max-iterations` pre-spawn refusal.
3. Located the anchor and the message helper by `rg` (`expandLineages` at `3396`, guard at `3397`, `findMaxIterationsPolicyViolation` at `1109`, `inputError` arg validation at `121`).
4. Read `research.md:100-135` (flag table and the fan-out policy sentence) and `rg`-ed `delegation-and-orchestration.md` for every fan-out/lineage line.
5. `rg`-ed the test tree for `INPUT_VALIDATION` and the exact `stopPolicy` refusal message, then read `tests/unit/fanout-run.vitest.ts:2440-2505` in full.

## Findings

1. **The new refusal has a line-for-line template already sitting at the exact anchor, and the anchor is before every side effect.** `const allLineages = expandLineages(fanoutConfig)` is `fanout-run.cjs:3396`; the next statement is the shipped `stopPolicy === 'max-iterations'` guard (`3397-3405`), which uses the same `(loopType === 'research' || loopType === 'review') && <predicate>` shape and the same `throw inputError(...)`. Between `3396` and the first ledger append (`appendFanoutStatusLedger` in the aggregate-budget branch, `~3440`) only `preflightFanoutCapabilities` runs, so a guard inserted at `3397` fails closed before the lineage directory, the status ledger, the summary, or any spawn. That is a *pre-run* refusal, which is stronger than every check iteration 1 mapped: all of those are reached only from inside a YAML step the incident never entered. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3396]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3397]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3404]

2. **The escape flag is a *second required line*, not just a flag at the call site: an unregistered flag is itself an `INPUT_VALIDATION` failure.** `parseArgs` camel-cases `--allow-single-lineage` to `args.allowSingleLineage` and then calls `assertKnownFlags(args, FANOUT_FLAGS, inputError)` (`:121`), so a caller who passes the escape without adding it to `FANOUT_FLAGS` (`:30-35`) gets exit 3 for the *unknown flag* instead of the run. Iteration 4 priced the escape but did not name this edit. It also fixes the naming: the file's allowlist entries are camelCase booleans or value options (`noMetadataRefresh`), so the entry is the string `'allowSingleLineage'` and the check is `!args.allowSingleLineage`. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:121]
[SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:33]

3. **CONTRA: iteration 4's fixture claim is wrong — the unit suite does pass a one-entry executor matrix to the CLI, and one of those tests currently spawns.** `fanout-run.vitest.ts:2459` builds `executors: [{ label: 'uncapped-research', kind: 'cli-opencode', ... }]` and `:2489` builds `executors: [{ label: 'capped-research', ..., iterations: 1 }]`, both with `--loop-type research --fanout-config-json`. The first is refused by the *existing* stop-policy guard; the **second passes it and reaches a spawn** — `expect(existsSync(cappedMarkerPath)).toBe(true)`. Under change 1 that second test is refused unless it passes `--allow-single-lineage`. So the cost is one failing *passing* test plus three stress fixtures, not three stress fixtures alone. The contradiction is resolved in favour of the executed code path (the test bodies), not in favour of iteration 4's `rg`-shaped prior. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2459]
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2489]
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2503]

4. **The same unit file supplies the acceptance test for change 1, including the fail-closed assertions.** The stop-policy test at `2446-2476` is the template: spawn with a stub binary, assert `exitCode === 3`, assert the message text, then assert `lineages/`, `orchestration-status.log` and `orchestration-summary.json` **do not exist**, and assert the spawn marker was never written. A negative case for change 1 is that block with the config reduced to one executor and the flag omitted; a positive case is the same block with `--allow-single-lineage` added. No new fixture machinery is needed — `spawnFanout`, `makeTempDir` and the stub-binary helper already exist in scope. [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2446]
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2472]
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2475]

5. **The repository-rules file does not restate the numeric fan-out trigger, so it drops out of the change set.** `delegation-and-orchestration.md` mentions fan-out only as a dispatch *trigger* (`:40`) and as a write-freeze obligation while a lineage runs (`:76-78`); it never says what makes a call fan-out. The trigger is stated once per mode, in the command doc and the presentation asset only. So the doc half of the change set is four one-clause edits, and `AGENTS.md` plus `.skilled/repo-rules/delegation-and-orchestration.md` are untouched. This narrows what iteration 3 and 4 implied ("command doc wording") without changing their conclusion. [SOURCE: .skilled/repo-rules/delegation-and-orchestration.md:40]
[SOURCE: .skilled/repo-rules/delegation-and-orchestration.md:76]

6. **The doc edit is one clause, and the sentence it sits in is the contradiction iteration 4 predicted, now line-exact.** `research.md:126` and `review.md:98` both read "two or more `--executor` flags, an `--executors` value, or any `--count` above 1 switches to fan-out". With change 1 landed, "an `--executors` value" promises the exact call the code refuses. Replacing that clause with "an `--executors` matrix that expands to two or more lineages" restores truth in both files and leaves the rest of the paragraph — including "one independent lineage per label" — correct, because it now only ever describes a two-or-more expansion. The two presentation assets repeat the trigger (`deep-research-presentation.txt:71`, `deep-review-presentation.txt:88`) and take the same clause. [SOURCE: .skilled/commands/deep/research.md:126]
[SOURCE: .skilled/commands/deep/review.md:98]

7. **The consolidated change set is five edits across four files, zero new files, and its own negative test proves the claim the incident needed.** (a) `fanout-run.cjs` — add `'allowSingleLineage'` to `FANOUT_FLAGS`; (b) `fanout-run.cjs` — the 6-line refusal after `:3396`, worded from the shipped `cli-deepseek-harness` sentence and naming "expanded lineages", not "labels"; (c) `tests/unit/fanout-run.vitest.ts` — add the flag to the capped spawn case at `:2477` and add one negative plus one positive case from the `2446-2476` template; (d) the three stress fixtures at `fanout.vitest.ts:165, 756, 794` — add the flag; (e) four doc lines, one clause each. Nothing here is a new command, agent, hook, schema field or document, which is the topic's stated preference. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:30]
[SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2477]

## Questions Answered

- **What would have caught the incident before or after the run?** Change 1, *before* the run: the incident's route calls `fanout-run.cjs` with a one-entry matrix and `--loop-type research`, which is exactly the predicate, and the refusal is exit 3 with no lineage directory, no ledger, no summary and no spawn (Findings 1, 4). Every check named in iteration 1 is post-hoc and step-reached; this one is neither.
- **What is the smallest change set, and at what cost?** Five edits across four files, zero new artifacts (Finding 7), with the fixture cost corrected upward from iteration 4: one currently-green unit test, three stress fixtures, and two new unit cases built from an existing template (Findings 3, 4).
- **Does the injected route survive the refusal?** No: the refusal is at the same anchor as a shipped pre-spawn refusal, on the same loop-type predicate, and `assertKnownFlags` makes a mis-passed escape fail closed too (Findings 1, 2).

## Questions Remaining

None. The only item still open is explicitly not research's: whether a legitimate fan-out lineage
should later execute packet-level `phase_init`/`phase_save` so a one-lane packet re-run stops
needing the escape flag. That is a workflow-design decision for the follow-up packet and it does
not change this change set.

## Ruled Out

- **Pricing the escape flag from the stress suite alone** (iteration 4's Finding 5). The unit suite spawns with a one-entry matrix too, so the cost estimate was low and the test template better than the one assumed. (Finding 3)
- **Touching `.skilled/repo-rules/delegation-and-orchestration.md` or `AGENTS.md` for the trigger.** The rule file never states the trigger; adding a second statement would create the drift the change exists to remove. (Finding 5)

## Dead Ends

- **Searching the rule docs for a numeric fan-out trigger.** `rg -i 'fan-out|fanout|lineage'` over `delegation-and-orchestration.md` returns three lines, none of them a trigger definition. There is no second enforcement sentence to align and none to break.

## Edge Cases

- **Ambiguous input:** "smallest" read as fewest lines touched. Under "fewest files" reading, the flag-allowlist line would be a separate change; the recommendation is unchanged either way.
- **Contradictory evidence:** found and resolved explicitly — iteration 4's "unit suites do not exercise `fanout-config-json`" vs the executed test bodies at `fanout-run.vitest.ts:2459, 2489`. The test bodies win; iteration 4's cost estimate is superseded (Finding 3).
- **Missing dependencies:** none. No network source was used; `resource-map.md` is absent by config, so no coverage gate applies.
- **Partial success:** no suite was run and `fanout-run.cjs` was not modified. Every claim about the patch is read-level: exact lines, exact shapes, and the existing test's assertions. The one executed-evidence gap is the fixture pass/fail count after the flag is added; that belongs to the implementation packet, which must run `fanout-run.vitest.ts` and `fanout.vitest.ts` before claiming the change works.

## Sources Consulted

- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:30-35, 121, 1109-1117, 3396-3405, 3440
- .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:2440-2505
- .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts:165, 756, 794
- .skilled/commands/deep/research.md:100-135
- .skilled/commands/deep/review.md:97-98
- .skilled/commands/deep/assets/deep-research-presentation.txt:71
- .skilled/commands/deep/assets/deep-review-presentation.txt:88
- .skilled/repo-rules/delegation-and-orchestration.md:40, 76-78
- .skilled/commands/deep/assets/deep-research-auto.yaml:1204-1222 (wording source, carried from iteration 4)

## Assessment

- New information ratio: 0.89
- Questions addressed: the pre-run detection answer; the exact change set and its corrected fixture cost; the scope of the doc half
- Questions answered: 3 (no open strategy questions remained)

## Reflection

- **What worked and why:** reading the *test* rather than the source changed the answer. The source told me where to insert a guard; the suite told me the guard's real price and handed me the acceptance assertions already written for the neighbouring refusal. Iteration 4 reasoned about the suite from a search whose pattern did not match how the suite builds its configs, which is exactly the failure mode iteration 1's "observed command evidence" standard warns about: a search that cannot see the thing is not evidence of absence.
- **What did not work and why:** the first `rg` for `--allow-` and `assertKnownFlags` was aimed at finding an escape-flag precedent and found none, because none exists; the useful part of that call was the allowlist itself, which is what established the second required edit. A negative search answered a different question than the one it was aimed at.
- **What I would do differently:** open the neighbouring refusal's test *before* pricing a change, not after. The test contains the cost estimate, the fail-closed proof and the template in one read.

## Recommended Next Focus

**None for research.** The loop's own answer is complete: five edits, four files, zero new
artifacts. The remaining work is implementation and belongs in the follow-up packet — apply
changes (a)–(e), then run `tests/unit/fanout-run.vitest.ts` and
`tests/stress/cli-adapter/fanout.vitest.ts` and report the observed pass/fail delta, since this
iteration's fixture claims are read-level. If a sixth research iteration were forced, the only
new-information move left is executing a throwaway patched copy of `fanout-run.cjs` in a temp
directory and recording observed exit codes; that is verification of a diff, not research about
the workflow.

## SCOPE VIOLATIONS

- **None.** No out-of-scope write was attempted. `research/research.md` was not updated although
  `progressiveSynthesis` is `true`, because this dispatch's allowlist names only this iteration
  file, the delta file and the append gateway's own writes; the narrower allowlist was followed,
  as in iterations 2–4. The synthesis phase owns that file.
