# Review Iteration 001

## Dispatcher

- Lineage: `attach-config-9` (fan-out child, session `fanout-attach-config-9-1794835877856-5ghgm4`)
- Area: `attach-config` per `review/review-scope-9.txt` (typed command matcher, advisor vitest config, child/parent session tests)
- Dimension: correctness
- Operator review focus: `review/review-brief-9.txt` was read first and governs this pass. It names `attach-config` as this lineage's area, binds the diff command `git -c core.fsmonitor=false diff 85550ee946e 05f776202e0 -- <path>` plus a whole-file read at `05f776202e0`, requires the graph and stop steps each iteration, and repeats the holdout rule (no `command-prompts.jsonl`, no `--summary`, no session-store text, no `.skilled/hooks/hook-flags.env`). This iteration addresses the focus by probing the one production change in the area -- the widened `MODE_SUFFIX` chain -- against the inputs the brief names, before any judgement about the config or the tests.
- Steer channel: `steer.md` does not exist in this lineage folder, so no lead ruling bound this pass.
- Sources read: `review/review-brief-9.txt`; `review/review-scope-9.txt`; both diffs for the four area files; the whole files at `05f776202e0`; `.skilled/commands/speckit/{plan,complete,implement}.md` and `.skilled/commands/deep/review.md` argument hints; `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:529`; `.skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:40-50`; `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:608-640`; `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:12-40`; `.skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts:40-152`.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (boundary comment 197-212, `MODE_SUFFIX` 211, `typedCommandIn` 221-244, `typedCommandForTop` 256-269, `commandOnlyMentioned` 417-470, `attachCommand` 465-536) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` (414-470, the typed-command boundary suite) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:435]
- `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` (1-35) [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:16]
- `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts` (1-100) [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:92]

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Deferred to iteration 3: the correctness pass records the behavior claims it verified, while the requirement-to-code comparison (command documents, packet goal rows) is the traceability pass. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211] |
| `checklist_evidence` | notApplicable | The phase-parent packet holds no `checklist.md`; scope is the four area files. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:1] |

## Integration Evidence

- The only production change in this area is the suffix pattern: `:unattended` and `:with-(context|phases|research)` were added and the group became repeatable, so a chain counts as one suffix. The comment above it was rewritten to say the hints do not narrow the set per command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:206] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- `hasModeSuffix` short-circuits the file-name/path continuation check, so a suffix ends the command name even where a following `.` or `/` would otherwise continue it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:231]
- `attachCommand`'s deep-loop gate compares `typedCommandIn(prompt)` with the mode's command, so a chained suffix must reduce to the bare command for a deep-loop offer to be reachable. Verified: `/deep:review:auto:with-research` offers `/deep:review`, and `do not run /deep:review:auto:with-research` offers nothing. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:514]
- `typedCommandForTop` still gates on the leading skill's row, so the widened vocabulary cannot carry a command under an unrelated skill: `/deep:review:with-research now` returns the command for `system-deep-loop` and `undefined` for `sk-doc`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:256]
- The renderer's only environment read is `options.childSession ?? process.env.AI_SESSION_CHILD === '1'`, which is the value the test config now clears before any test module loads. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529]

## Edge Cases

- Recorded limit, not re-reported: a suffix followed by a file extension still reads as the command (`/speckit:plan:with-phases.md` -> `/speckit:plan`). The packet records that trade-off, and this pass found no new input that breaks it. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/goal.md:370]
- Gateway contract versus brief instruction: the brief asks for the convergence decision, `stopReason` and `blockedBy` in an event line of the state log, but `append-mode-event.cjs` accepts a review `type:"event"` row only for `dispatch_failure`, `dispatch_receipt_write_failed`, `verification_degraded`, `containment_violation` and `containment_contested`. `deep-review.yaml` states the same limit for its own stop row: "The stop row is printed, not appended: the gateway refuses an event it has no ledger stem for." The decision is therefore printed to stdout by `convergence.cjs`, carried in the next iteration record as `priorStopDecision`, and carried again in the synthesis closeout. No row was written to the state log by hand. [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:955]
- Write-surface note: the coverage graph lives in the shared deep-loop database, which is outside this lineage. `review-brief-9.txt` names `upsert.cjs` as the persistence step for the per-iteration graph rows, so that write is the brief's own instruction, and it is the only write this lineage makes outside its folder.

## Confirmed-Clean Surfaces

- The chain resolves the command for every ordinal position and every accepted segment. Probed against the area source: `/speckit:complete:auto:with-research` -> `/speckit:complete`; `/speckit:complete:auto:with-research:with-context:with-phases` -> `/speckit:complete`; `/speckit:plan:auto:unattended` -> `/speckit:plan`; `/deep:review:auto:confirm` -> `/deep:review`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- An unknown segment refuses the whole chain at either end. `/speckit:complete:with-everything` and `/speckit:complete:auto:draft` -> `undefined`; so do the partial forms `/speckit:plan:with`, `/speckit:plan:with-phases-extra` and `/speckit:plan:auto-with-phases`, because `-` and the extra letters are continuation characters. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- Case folding happens before the test: `run /speckit:plan:With-Phases now` -> `/speckit:plan`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:222]
- The longest-key rule still wins beside a suffix: `/create:skill-parent:auto` -> `/create:skill-parent`, and `/create:skill:with-context` -> `/create:sk-skill` through the retired-name table. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:240]
- Refusal and question leads survive a chained suffix, because the leading patterns are matched against the text that ends at the command name: "do not run /deep:review:auto:with-research", "is /deep:review:with-research safe?", "what does /speckit:plan:with-phases:auto do?" and "not run /speckit:complete:with-research yet" all read as mentioned. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:417]
- Doctor commands whose tracked key carries a subcommand still take a suffix: `/doctor:agents-md check:auto:with-phases` -> `/doctor:agents-md check`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- The vitest config creates one owner-only folder with `mkdtempSync`, exports it on all three temp variables, removes it on normal exit, and clears the inherited child flag before any test module is loaded. [SOURCE: .skilled/skills/system-skill-advisor/runtime/vitest.config.ts:16]
- The changed brief test pins the parent shape explicitly (`{ childSession: false }`), and the sibling assertion still pins the child shape (`{ childSession: true }` -> `(parent-named only)`). [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:92]

## Ruled Out

- Catastrophic backtracking in the repeated group: carried forward from the prior pass and re-checked, because the group is now quantified. Each repetition consumes at least one character after a mandatory `:`, the alternatives are prefix-distinct apart from `auto`/`autopilot`, and that pair costs one backtrack per repetition, so the engine works in linear time over a prompt-length slice. No new input reopens it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- A false `:auto` match inside `:automation`: re-checked; the trailing lookahead rejects the following letter and the chain cannot back down to zero repetitions. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- Regex injection from prompt text: the pattern is a constant, the prompt is only matched against it, and `commandOnlyMentioned` still escapes the command phrase before building its own pattern. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:417]
- A stale copy of the suffix set inside this area: `MODE_SUFFIX` is the only suffix pattern in the file; no second constant drifted. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:211]
- A second environment dependency in the brief renderer that the test config forgets: `render.ts` reads only `AI_SESSION_CHILD`, and the config clears exactly that name. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529]

## Next Focus

- Dimension: security
- Focus area: `vitest.config.ts` as a trust boundary (temp folder creation, export and cleanup, the cleared child flag) plus the test files that pin child/parent shapes.
- Reason: correctness produced no finding; security is the next risk-ordered dimension and the config change touches process-wide environment and a temp folder.
- Rotation status: correctness complete; security next, then traceability and maintainability.
- Blocked/productive carry-forward: direct read plus source-imported probes stayed productive; nothing blocked.
- Required evidence: an input or environment state under which the suite's temp isolation or child-flag clearing fails to hold.
- Recovery note: not in recovery.

Review verdict: PASS
