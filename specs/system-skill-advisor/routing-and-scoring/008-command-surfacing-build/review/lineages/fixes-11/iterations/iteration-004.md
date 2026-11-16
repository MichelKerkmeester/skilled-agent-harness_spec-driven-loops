# Review Iteration 004 — fixes-11

**Lineage:** `fixes-11` (detached fan-out, review pass eleven)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/fixes-11`
**Session:** `fanout-fixes-11-1794851543294-mlt3r6`

## Dispatcher

- **Operator review focus (bound):** review pass eleven, area `fixes`, per `review/review-brief-11.txt`. This iteration closed the rotation on the focus's own surfaces: the readability and drift cost of the quote fold's comment, the doctor install's accepted-answer sentence, and the contract test's duplicated count assertion.
- **Dimension this iteration:** maintainability.
- **Dimensions planned:** correctness (done), traceability (done), security (done), maintainability.
- **Steer file:** absent at iteration start.

## Files Reviewed

| File | Under |
|------|-------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | maintainability |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | maintainability |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | maintainability |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | maintainability |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | maintainability |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new; `FIX11-P1-001` and `FIX11-P1-002` remain active.

### P2 Findings

1. **The fold comment claims quote marks around a name are dropped, but only the opening single quote is** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:413` -- The paragraph says "quote marks around a name are dropped for the same reason" and then adds the single-quote rule at `:415-417`, but the single-quote rule is one-sided: the closing quote survives. That same paragraph also breaks mid-sentence at `:417` ("as \"don't\" or \"what's\". The" / `:418` "boundary before the lead…"), so the paragraph that defines the guard's fold contract is the hardest part of the file to read.
Case: a maintainer reading `:413` expects `do not run '/create:agent' or '/create:readme'` to behave like the double-quoted form; the closing quote is still present and the second command loses its refusal lead (iteration 1, `FIX11-P1-001`).
Finding class: maintainability (comment overstates the fold and is split mid-sentence).
Scope proof: the comment block at `:409-421` and the fold at `:423-429` are the reviewed file's own changed lines; the behaviour is reproduced by the compiled module.
Affected surface hints: `commandOnlyMentioned`'s fold, its comment, and every reader who extends the quote rule.

2. **The accepted-answer sentence fuses the accepted list with "the ones already there"** -- `.skilled/commands/doctor/assets/doctor-install-presentation.txt:78` -- The sentence reads "A runtime name outside claude, codex, cursor, devin, dsh, opencode, pi and vibe or the ones already there, a shape outside the three, or an instruction word outside the two is not guessed." The coordination makes "the ones already there" part of what a name is "outside" of, which is the opposite of the rule: those names are accepted. The reader has to re-parse a sentence whose only job is to say which answers are accepted.
Case: an operator answers `rust` and reads the sentence to learn whether it will be accepted; "outside … or the ones already there" can be read as "outside the eight, or outside the detected ones" rather than "the eight and the detected ones are accepted".
Finding class: maintainability (user-facing wording that obscures the acceptance rule).
Scope proof: `:78` is the changed line in the reviewed diff; the accepted set is the eight manifest runtimes confirmed at `symlink-manifest.json` and `symlink-engine.cjs:435-438`.
Affected surface hints: `/doctor:install` accepted answers, the guide's re-ask rule, and the contract test's exact-substring assertion at `doctor-install-contract.test.cjs:243`.

3. **A contract assertion is now fully subsumed by the next line** -- `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:239` -- `assert.doesNotMatch(PRESENTATION, /outside the seven/)` is implied by `:240`'s `assert.doesNotMatch(PRESENTATION, /outside the (?:seven|eight|nine)/)`: any text that fails the first line also fails the second. The line can never be the one that catches a regression, so it adds a maintenance stop without adding coverage.
Case: change the presentation to "outside the seven" and run the test; line 239 fails, but line 240 fails with the same message on the same input, so 239 carries no independent signal.
Finding class: maintainability (dead assertion duplicating the one below it).
Scope proof: both lines are in the reviewed test file; the first regex is a strict subset of the second alternation.
Affected surface hints: the runtime-count guard in `doctor-install-contract.test.cjs`.

## Traceability Checks

No new protocol was run this iteration. The maintainability pass cites the reviewed files' own comments, the manifest and engine evidence already established in iteration 2, and the compiled-module behaviour from iteration 1.

## Integration Evidence

- **Comment ↔ behaviour:** `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:413-417` ↔ `:423-429`. The comment is the only statement of the fold's contract; the closing-quote gap is what makes it worth correcting alongside the code fix.
- **Sentence ↔ engine:** `.skilled/commands/doctor/assets/doctor-install-presentation.txt:78` ↔ `symlink-engine.cjs:435-438`. The engine is the authority on which names are accepted; the sentence should read as "these eight, or the detected ones".
- **Assertion ↔ assertion:** `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:239` ↔ `:240`. The first is a strict subset of the second.
- **Test title ↔ body:** already recorded as `FIX11-P2-001`; not repeated here.

## Edge Cases

- **Two runtime-list surfaces.** The presentation names the runtimes in manifest order at `:58` and in sorted order at `:78`; the contract test checks only the sorted sentence (`test:243`). A maintainer reordering the manifest would see the test pass while the prompt list drifts. This is covered by `FIX11-P2-001`'s scope (the test does not check every surface it claims), so it is not raised as a fourth finding.
- **Comment length.** The fold paragraph is one dense block covering five rules; a full rewrite is out of scope for a review, so the finding names the two concrete repairs (correct the symmetry claim, rejoin the split sentence) instead of asking for a restructure.
- **Wording preference.** The accepted-answer sentence is understandable on a second read; the finding is scoped to the ambiguity a first-time operator hits, not to style preference.

## Confirmed-Clean Surfaces

- The test table headings and `it.each` structure remain consistent with the surrounding file; the new cases do not break the table's naming convention.
- `doctor-install.yaml:46` and `:58` remain internally consistent with each other and with the presentation's eight names.
- No comment in the reviewed files carries an ephemeral artifact label, spec path, or requirement id; the durable WHY is preserved.
- The new fold line at `command-attach.ts:427` is short, uses the file's existing chain style, and needs no helper extraction.

## Ruled Out

- **Naming inconsistency as a defect** — the presentation's two orders (manifest order in the prompt, sorted order in the accepted-answer sentence) are both complete and readable; only the test coverage differs, already recorded.
- **Over-abstraction of the fold** — the one-line fold matches the surrounding chain of `.replace` calls; extracting a helper would add indirection for a single use.
- **Test title drift as a maintainability finding** — already recorded once as `FIX11-P2-001` under traceability; repeating it here would double-count the same defect.

## Next Focus

- **Dimension:** cross-reference closure (all four dimensions covered; no new dimension remains).
- **Focus area:** reconcile the active findings with the packet evidence, confirm no reviewed surface is unreviewed, and check whether the remaining work is a code fix, a test fix or an evidence fix for each active finding.
- **Reason:** the rotation is complete; the next pass is a closure pass, not a new direction.
- **Rotation status:** correctness, traceability, security and maintainability reviewed.
- **Blocked/productive carry-forward:** maintainability is productive (three P2s, each with a concrete input); no approach is blocked.
- **Required evidence:** the active finding list from the registry, the reviewed-file coverage table, and the stop decision.

**Stop decision after iteration 3:** CONTINUE; `stopReason` none; `blockedBy` empty; the coverage gate named `maintainability` as the only missing dimension, and it is now covered.

Review verdict: CONDITIONAL
