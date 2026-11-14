**Verdict: one P1 and seven P2 findings, no P0.** Part 1 is sound apart from edge cases. Part 2 passes its checker but makes the advisor pull ordinary code prompts to sk-doc.

## Code Review Summary

**Files reviewed**: 8 commits plus merge 2276ba1364, about 30 files outside the regenerated index
**Overall assessment**: REQUESTED_CHANGES
**Baseline used**: sk-code (`sk-code-review`)
**Surface evidence used**: SKILLED
**Quality gate evidence**: absent
**Advisory score**: 84/100 (correctness 22/30, security 25/25, patterns 16/20, maintainability 11/15, performance 10/10)
Rule sources: default lens, SKILLED hub-surface checklist. Overrides: review.todo-tracking replace from the SKILLED hub-surface checklist. Refused: none. Ignored: none. Conflicts: none

All advisor results below come from temp copies scored in the pinned regime the repository's own ratchet uses (force-local, semantic lane off), not the live daemon.

## Findings

### P0 - Critical
None.

### P1 - High

1. bc86b64c79, `.skilled/skills/sk-doc/graph-metadata.json:329-334`: "confirm flag" and "agent definition" became advisor signals for sk-doc and capture non-doc prompts.
   - Case: "add a --confirm flag to the deploy script" moves from sk-code 0.8384 to sk-doc 0.8614, evidence `author:confirm flag`.
   - Case: "the confirm flag is ignored by the release command", "confirm the tests pass before merging" and "the agent definition files are out of sync across runtimes" go from no skill to sk-doc 0.82.
   - Impact: a code request gets sk-doc above the 0.8 must-invoke bar. A passing skill also suppresses the weak-cue doctor hand-off, by the rule stated in `doctor-helper-handoff.ts:16-21`.
   - Corpus effect: command row `cmd-doctor-agents-md-plain-tune-01` (gold system-skilled-doctor) goes from none to sk-doc.
   - Finding class: class-of-bug. Any multi-word hub phrase gives the skill its single words (`lexical.ts:68-76`, `text.ts:124-141`) and a phrase match (`explicit.ts:406-421`).
   - CONFIRMED: base tree versus the two hub files from 6d96d8f1d2, 11 of 29 probe prompts and 5 of 539 corpus rows changed, exit 0.
   - Fix: replace "confirm flag" and "agent definition" in `hub-router.json` with phrases that name command or agent authoring, then rerun the writers.
   - Self-check: the skeptic's objection is that the root cause is the phrase choice in 7af52ef940 and the regime is pinned. It stays P1 because this commit is what makes the phrases advisor signals, and a correct top-1 flips to a wrong one.

### P2 - Suggestion

**Part 2**

2. bc86b64c79, `.skilled/skills/system-deep-loop/graph-metadata.json:78-80`: the bare words stop, several, models, everything, find, out and changing now count for system-deep-loop.
   - Case: "update the data models for the user table", "my stop hook fails after the update" and "everything in the skill graph is stale" each gain system-deep-loop as a passing candidate at 0.82.
   - No top-1 flip in my probes. CONFIRMED, same run as finding 1.

3. bc86b64c79, `local-native-approved-divergences.json:719`: the hand-written reason misstates the cause.
   - It says the hub "now carries the review phrases". No phrase matches that prompt.
   - Removing phrases one at a time shows the flip needs the bare word "stop" plus "several", the latter from the AI council phrase. CONFIRMED, exit 0.
   - The holdout gain of 50 to 51 is therefore a word accident. The packet docs call the file "Recaptured" and do not mention the hand edit.

4. 6d96d8f1d2, `spec.md` Files to Change, `tasks.md` T008 and `implementation-summary.md`: all three say the archived manifest was "written by the same refresh". It was not.
   - CONFIRMED: after `compiled-route-manifest.cjs refresh` in a temp tree the runtime manifest matched the commit byte for byte and the archive copy still held the old hash.
   - The guard then printed "copy ... over ..., or commit with the hooks installed so the pre-commit gate copies it". The committed bytes are correct.

5. 6d96d8f1d2, three smaller doc mismatches.
   - `tasks.md` T019 names `tests/parity/fixtures/scorer-eval-baseline.json`, which does not exist. The file is under `scripts/routing-accuracy/`. CONFIRMED by `ls`.
   - The `implementation-summary.md` continuity block is the untouched scaffold (`completion_pct: 0`, "Initialize continuity block"), while its Metadata says Completed and `spec.md` says In Progress.
   - "The check reads only the INTENT_SIGNALS block" is too narrow. See claim 1 below.

**Part 1**

6. ffbead5bec, `relocate.mjs:482-489`: the duplicate checks compare spelled ids, so two case spellings of one folder pass on this case-insensitive APFS disk.
   - Case A: sources `nu/001-a` and `nu/001-A`. The first move runs, the second fails with ENOENT and the tree is half moved, the failure this commit set out to stop.
   - Case B: targets `nu/sub/001-a` and `nu/SUB/001-a`. Both moves run and one packet lands inside the other (`specs/nu/sub/001-a/001-a`).
   - CONFIRMED: both runs exit 2 with the tree changed. Recoverable from git, because sources must be committed.
   - Fix: key the maps on `fs.realpathSync` of the existing path.

7. bd7fe35921, `.skilled/skills/system-spec-kit/graph-metadata.json:111`: the reword swapped one substring match for another.
   - INFERRED mechanism: "find" sits inside "findings", which `lexical.ts:18` adds to every prompt containing "review", and `text.ts:136` scores as a partial hit.
   - CONFIRMED effect: the corpus scores 160 with "search", 161 with "find". The prompt gained is `rr-iter3-135`, a review prompt with no archive or sub-track content, won 0.5886 to 0.5828.

8. 17b8e6c208: a sub-track request that names a track still goes to the skill of that name.
   - Case: "suggest sub-tracks for the sk-code track" gives sk-code 0.8676 over system-spec-kit 0.82. The sk-git track behaves the same, and the sk-doc track wins 0.8769 to 0.8758.
   - Tracks under `specs/` carry skill names, so this is the natural phrasing. CONFIRMED, exit 0.

## Answers to your questions

**Part 1**
- **Duplicate-source refusal:** correct. Before the fix the map half-moved the tree (exit 2), after it nothing is written. One target named twice and a source nested in another source were already refused. The gaps are in finding 6.
- **Other substring matches:** finding 7 is the main one. "under" and "track" also raise an existing misroute ("tracking down a memory leak under load", 0.408 to 0.485).
- **117:** a real registry fact. The registry counted 116 before 9d0c5368d1 and 117 after, and the test was simply left behind.
- **Scorer recapture:** the number is real and reproduces, but the gain is the accident in finding 7.

**Part 2**
- **Claim 1:** right in its conclusion. The checker never opens a mode packet's `ROUTER.md`. It also reads the root `RESOURCE_MAP` to assign intents to modes, plus `hub-router.json`, `mode-registry.json` and each packet's `Keyword triggers:` line.
- **Claim 2:** placement is right, drift goes 9 to 0. Genericness is findings 1 and 2.
- **Claim 3:** all writer-produced except the ledger reason and the archive copy. Both hub metadata files and the runtime manifest rebuilt byte-identical, the skill graph differs only in `generated_at`, and `generate-trigger-index.mjs --check` exits 0 with 0 stale.
- **Claim 4:** no collision. Both branches raised sk-doc to 2.4.7.0, the three-way merge is clean, and the merge commit raised it to 2.4.8.0. The merge message does not mention that. The merged tree passes the vocabulary, intent-signal, route guard and graph freshness checks.
- **Claim 5:** see findings 3, 4 and 5. The rest matches the diff.

## Checked and found sound

- The four touched test files: 119 tests pass, exit 0.
- The description cache rebuild: all 29 changed entries match their packet files at ab08b3cffc. Thirteen of those files hold older or placeholder text, which predates this commit.
- The holdout reads 51 against 50 with the 008 metadata, full corpus stays 161.
- sk-doc's manifest stayed fresh and only system-deep-loop's was stale.
- Strict validation of the 008 packet: `RESULT: PASSED`, exit 0.

## Next Steps

1. Fix finding 1 at its source in `hub-router.json` before the 352 branch lands.
2. Correct the ledger reason and the three doc statements in findings 3 to 5.
3. Decide whether findings 6 to 8 need their own packet.

Not checked: the live advisor command line (missing package wiring in the temp copy). The scorer on the merged branch, including the peer fix 23e7eee17b (different advisor source, worktree 352 left alone). The claim "122 of 123" advisor tests and the "nine routing probes". The package lint claim in ffbead5bec. The mode's `review-core.md` and its checklists were not opened.

Review status: REQUESTED_CHANGES
EXIT=0
