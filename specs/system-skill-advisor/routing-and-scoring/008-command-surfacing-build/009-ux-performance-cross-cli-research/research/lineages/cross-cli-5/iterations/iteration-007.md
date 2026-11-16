# Iteration 7: The two remaining limit lines, tested against the files

## Focus

Iteration 6 left two of the six inherited `limit:` lines untested. Both concern what the model actually saw rather than what the runner recorded: the offer the off arm is credited with, and the Claude-only rules file. This iteration tests both from the code and the logs, and found that one of them understates its own caveat.

## Actions Taken

1. Read `replayOffer` and the point in the turn that calls it.
2. Counted offer errors and pointer events across all five run logs.
3. Read the arena's CLAUDE.md writer and the runner's pointer handling.
4. Measured the home rules file the runner does not isolate.

## Findings

1. The offer field is a replay on every run, in both arms. `replayOffer` spawns the checkout's own prompt hook with the turn's prompt after the turn has finished, and parses the head it prints; the comment states the reason plainly: "The head the reader saw is the only place the offer was named, and not every runtime keeps it, so the offer is replayed after the turn." [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1368-1372] The replay resolves the hook from the checkout, not from the working copy, so the answer is what that checkout would have offered at run time. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:85-100]

2. The inherited limit line understates the caveat by naming only the off arm. All 400 deduplicated run lines across the five logs carry an offer answer and none carries an `offerError`, so the replay succeeded on every turn of both arms. [INFERENCE: counted over the deduplicated lines of `scratch/runs/{claude,opencode,pi,devin,dsh}.jsonl`] In the on arm the replayed head should match the delivered brief, but nothing in the arm's outputs compares them.

3. `offerSeen` is the only cross-check on the replay, and it corroborates it on two runtimes only. The model's own `COMMAND:` line reports a head-named command 0 of 36 on claude, 0 of 36 on opencode, 1 on pi, 3 on devin and 2 on dsh in the off arm; in the on arm the same counts read 0, 2, 1, 3 and 7. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json] On claude, pi and devin the replay is never corroborated by the model in either arm.

4. The Claude limit line is true and its size is larger than the line suggests. `~/.claude/CLAUDE.md` is a symlink to the operator's 27,730-byte `AGENTS.md`, the runner reads `CLAUDE_CONFIG_DIR` only to locate the projects folder and never sets it for the turn [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:466], and the arena's own `CLAUDE.md` is the single line `@AGENTS.md`, written once and excluded from git so the clean-tree check never sees it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:518-526]

5. That makes the Claude arms carry roughly ninety times the brief in un-isolated rules text. The live brief measures 306 bytes at the median; the home file measures 27,730. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-4.md] So the framework is present twice on claude, once through the arena pointer and once through the operator's home file, and only the pointer is under the harness's control.

6. What would confirm either line: run one Claude arm with `CLAUDE_CONFIG_DIR` pointed at an empty directory and compare its followed and start counts with the same rows in the existing arm; and print `offerSeen` beside `offered` per row so the replay's corroboration rate becomes a number instead of a footnote. Neither is a product change. [INFERENCE: from findings 1 to 5]

## Ruled Out

- Reading the off arm's offer field as counterfactual and the on arm's as observed. Both are replays; only the model's own line distinguishes them.
- Treating the arm's five-runtime comparison as holding the framework constant. It holds the arena's pointer constant and leaves the home file in place on one runtime.

## Dead Ends

- Looking for a `pointerRestored` or `leftoverPaths` event in the logs to show a turn disturbing the pointer. No line carries either field, so no turn touched it.

## Edge Cases

- Ambiguous input: what "the framework" means per runtime. The lane reads it as the rule text the host injects before the prompt, which is the thing that differs.
- Contradictory evidence: none. The limit line is true for the off arm and incomplete for the on arm; both readings are recorded.
- Missing dependencies: no arena run is possible from here, so the Claude isolation test is proposed rather than performed.
- Partial success: two of the six limit lines are now tested from records; the other four are either already verified in iterations 1, 2 and 6 or stated as unverified.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1362-1389`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:460-470`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:85-139`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:518-526`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/{claude,opencode,pi,devin,dsh}.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-4.md`
- `/Users/michelkerkmeester/.claude/CLAUDE.md`

## Assessment

- New information ratio: 0.8
- Questions addressed: (c) follow-on, (e) follow-on
- Questions answered: none as tracked; both limit lines are now tested

## Reflection

- What worked and why: reading the call site rather than the function alone changed the limit line's scope. `replayOffer` looked like an off-arm backfill in the documentation; the call site shows it running unconditionally after every turn, which makes the on arm's offer field a replay too.
- What did not work and why: the first search for pointer or leftover events returned nothing, which briefly read as a failed query. It is a true zero: no turn disturbed the pointer, so there was nothing to find.
- What I would do differently: measure the home rules file before writing any cross-runtime comparison. A 27.7 KB un-isolated document on one runtime is a larger difference than most of the effects the arm is trying to detect.

## Recommended Next Focus

Close the lane: state the coverage of each of the five questions, the ranked recommendations with their files and confirming checks, and the two measurements that remain unrun (Claude isolation and the start-shape census). Anything still unmeasured should be named as such rather than implied by a number.
