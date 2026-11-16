# Review Iteration 004 - maintainability

## Dispatcher

- Lineage: `scorer-9` (pass nine, area `scorer`), detached fan-out lineage.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Scope: the three `scorer` files.
- Review focus addressed: the brief names the suffix list as one of this area's three behaviors; this iteration reads its shape and its test net, which is the maintainability reading of the operator focus. The holdout rule held: only the reviewed files and the spec text were read.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613` - `MODE_SUFFIX` vocabulary.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1363` - `SELF_AUTO` vocabulary.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:621` - `commandParts` comment and split.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1531` - the only chained-suffix case, and `:1540` its twin.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135` - the row that carries the contract in prose.
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/038-alignment-p1-remediation/spec.md:186` - the max-input edge case.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The advertised suffix vocabulary is duplicated in two patterns and the spec's max-input case is untested** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613` -- the seven-word alternation lives in `MODE_SUFFIX` (`:613`) and again in `SELF_AUTO`'s lookahead (`:1363`), and a third copy sits in the matcher (`command-attach.ts:211`). The two copies here serve different anchors, so a new advertised modifier has to be added to both by hand; missing one is silent: the command stops reading as itself at `commandParts` while `SELF_AUTO` still reads it, or the reverse. The test file exercises only `:auto:with-research` (`command-transcript-score.vitest.ts:1531`, `:1540`) and never `:unattended`, `:with-context`, `:with-phases` or the spec's "a chain of every advertised suffix" case (`spec.md:186`).
   Finding class: `maintainability` (duplicated closed vocabulary and an unpinned spec edge case).
   Scope proof: both patterns were read at `05f776202e0`; the test file's only `with-*` occurrences are the two lines named; the spec's max-input edge case is at `spec.md:186`.
   Affected surface hints: `commandParts`, `namesCommand`, `confirmStem`, `selfChosenAuto`, and the suffix cases owned by `command-attach-guards.vitest.ts`.
   Case: adding `:with-evidence` to the advertised hints without editing `:613` makes `speckit:complete:auto:with-evidence` read as the command name `complete:auto:with-evidence`, so the start is lost and no test fails.

## Traceability Checks

- No new protocol result this iteration; `spec_code` stays `partial` and `checklist_evidence` stays `pass` from iteration 3. The max-input edge case read here supports the `spec_code` partial rather than raising it.

## Integration Evidence

- `command-attach.ts:211` keeps the same seven words with a position guard, so the vocabulary is one contract spread across two modules with no shared constant.
- The README row (`:135`) states the guarded write rule but does not name the suffix vocabulary, so the only written definition is the two regexes and the command READMEs.

## Edge Cases

- A chain of every advertised suffix reads correctly today (probed in iteration 1), so the finding is about the cost of the next edit and the missing regression pin, not a live mis-read.
- `:with-human-voice` is a real command name, and both copies correctly keep it out, so a shared constant would still need the same anchor distinction.

## Confirmed-Clean Surfaces

- The two patterns agree on the vocabulary as of this commit; no live drift.
- Each pattern carries a comment naming why its anchor is where it is (`:610-612`, `:1359-1362`), so the intent is documented even though the words are repeated.

## Ruled Out

- Extracting one shared regex across both modules: the anchors differ (end-strip vs lookahead) and the third copy lives in another module, so a shared constant would couple them for one word list. Recorded as a trade-off, not a finding beyond the P2.
- A missing comment on the new chain: both changed patterns already carry one.

## Next Focus

- Dimension: cross-reference (no dimension remains)
- Focus: re-read the four findings against the final state and confirm no new defect before synthesis.
- Reason: all four dimensions are covered; the next pass is the convergence confirmation.
- Rotation status: D1-D4 complete.
- Required evidence: a bounded re-read of the four cited lines and the AC rows they touch.
- Blocked/productive carry-forward: four active P2s are carried to synthesis; do not re-report them.

Review verdict: PASS
