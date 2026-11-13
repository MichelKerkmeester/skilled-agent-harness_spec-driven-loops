# Iteration 1: The model-visible brief — what it emits, what it withholds, what the harness can see

## Focus

What the hook brief actually puts in front of a model today, measured from the real hook, and whether a model on any of the six CLIs can act on it without guessing. The iteration also asks what the harness can observe about an offer, because every later cross-CLI claim depends on that signal. Chosen because it is the first unchecked key question and because phases 005 and 006 change exactly this text.

## Actions Taken

1. Spawned the real Claude `UserPromptSubmit` hook six times with the public probe prompts from `005/scratch/brief-heads.mjs` plus one greeting, and measured the emitted `additionalContext`: characters, lines, head line. No corpus row was read.
2. Read the renderer's head, cap and directive constants, and the hook's diagnostic emission path.
3. Read the closed-schema diagnostic record and its validator.
4. Read the phase 006 Gate 2 bullet draft and the phase 005 golden head.
5. Reproduced the transcript scorer's document lookup for argued doctor routes with a synthetic read event.

## Findings

1. **The brief is a 3-line, 240-296 character payload (about 60-74 tokens at 4 chars per token), and most of it is prompt-independent.** Probes 1 to 6 measured 258 to 296 characters; the greeting probe measured 240 characters with `Advisor: prompt skipped.` as its head. The static `Directives:` block plus the comment-hygiene line is 233 characters of every payload, so 79 to 90 percent of a short brief is identical on every prompt. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:162] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:168]

2. **The head uses at most 96 of its 320 available characters.** The head is capped at 80 tokens (`DEFAULT_TOKEN_CAP = 80`, 4 chars per token, so 320 characters), and the longest measured head was the ambiguous line at 96 characters. The command-bearing head phase 005 plans is about 72 characters. There is roughly 225 characters of unused head budget on every prompt. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:97] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:557] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md:71]

3. **The brief names a command but never the document that starts it, and on Claude the document is the only route for the 13 `create:*` commands.** Phase 006's bullet tells the model to "read its document in full" but gives only the convention `.skilled/commands/<group>/<name>.md`; the head carries no path. Meanwhile `g5/result.txt` records that with `.claude/commands/create/skill.md` present the Skill tool lists one entry, `create`, and `create:readme` is absent, so the skill-load route is closed for that whole folder. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/scratch/bullet-draft.txt:1] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt:2]

4. **The harness cannot see an offer.** The hook diagnostic record is a closed, prompt-free schema with `skillLabel`, `emittedBytes` and `directivesSuppressed`, and no field for the command or its policy. `skillLabelFor` returns the metadata label or the top recommendation's skill id, so even a command-bearing brief records only its skill. The only offer evidence today is the model's own `COMMAND:` narration, which was 0 of 24 on five runtimes and 1 of 8 on dsh in the before arm. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:50] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:189] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:415]

5. **A doctor sub-route's start can never be scored from its document read.** `commandParts('/doctor:git hooks')` keeps `git hooks` as the name, and `documentTails` then looks for `/commands/doctor/git hooks.md`, which cannot exist. Reproduced with a synthetic read of `.skilled/commands/doctor/git.md`: `startState` says `started: false` for `/doctor:git hooks` and `started: true` for `/doctor:git`. 28 of the 35 doctor command strings in the renderer carry an argument. The current behaviour corpus uses base commands, so the before arm is unaffected; any future doctor row or a model that prints the argued string is affected. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:449] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:468] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:140]

## Recommendations

Every item names the file, the gain and the check. None repeats a phase 005 to 008 task.

1. **Carry the document path in the head, inside the unused budget.** Change `renderAdvisorBrief` in `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` to append ` → <path>` after the command for any recommendation whose `command` resolves in `COMMAND_ROWS`, for example `use sk-doc → /create:readme (start) .skilled/commands/create/readme.md 0.95/0.12 pass.` Gain: removes one inference per start and gives the 13 `create:*` commands a route that does not depend on the collapsed Skill-tool listing; measured head stays under 140 of 320 characters. Verify: extend `005/scratch/brief-heads.mjs` and assert the six golden heads carry a path that exists (`test -f`), and `npm test` in `ADV` reports 0 failed.
2. **Record the offer in the diagnostic schema.** Add `offeredCommand?: string` and `offeredPolicy?: 'run' | 'start' | 'ask'` to `AdvisorHookDiagnosticRecord` in `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts`, allow them in the validator and serializer, and populate them in the `emitDiagnostic` call at `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:415` from the top recommendation when its `kind` is `command`. Gain: the offer side of the funnel becomes countable in the row that is already written, so decline can be separated from never-offered; no extra write, no extra latency. Verify: a fixture row with both fields passes `serializeAdvisorHookDiagnosticRecord`, and `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --format json` reports the per-command offer count for a session with three prompts.
3. **Make the once-per-command clause unconditional.** Phase 007 adds "Print it once per command per session, and ignore a brief that names a command already started or declined" only if phase 006's bullet lacks it. Make it part of the bullet regardless, in `AGENTS.md` Gate 2. Gain: a re-phrased prompt cannot re-offer a command already started, which is the `repeated` count the scorer already prints; today the pre-arm cannot show the failure because no command is offered. Verify: `rg -c "once per command" AGENTS.md` prints 1, `agents-md-check.cjs --json | jq -r .status` prints `OK`, and the post arm prints `repeated 0` per runtime.
4. **Fix the argued-route document lookup.** In `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`, make `commandParts` split the route from its argument at the first space before `documentTails` runs, so `/doctor:git hooks` looks up `doctor/git.md`. Gain: 28 of 35 doctor command strings become scorable from a document read, and the post arm cannot report a false decline on a doctor row. Verify: a built-session case for `/doctor:git hooks` reading `doctor/git.md` returns `started: true`, and `npx vitest run tests/command-transcript-score.vitest.ts` reports 0 failed.

## Ruled Out

- **Trimming the directive block to reduce tokens.** It carries the repo's comment-hygiene hard block, which is deliberately injected beside every brief; a research pass may not remove it. Recorded as a cost, not a recommendation.
- **Renaming `.skilled/commands/create/skill.md`.** It would restore the 12 hidden siblings, but operator answer Q025 explicitly leaves the create ids as a recorded limitation, so the rename is out of scope for this lineage. The document-path and discovery-check recommendations reach the same commands without the rename.

## Dead Ends

- Searching for a per-offer ledger outside the diagnostic record: none exists. `advisor_status` aggregates the existing diagnostics only, and `AdvisorHookOutcomeRecord` is an accepted/corrected/ignored skill signal with no command field. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:85]
- Measuring a cold-daemon first prompt: would require stopping the running daemon, which the lineage rules forbid. Recorded as a gap for iteration 5.

## Edge Cases

- Ambiguous input: none. The lineage angle and the parent packet both point at the brief.
- Contradictory evidence: the 005 golden heads were measured as `live` on 2026-11-12, while the same probe today prints `stale`; the difference is graph freshness, not a renderer change. Both readings are preserved; no claim depends on the freshness word.
- Missing dependencies: `resource-map.md` is absent, so the coverage gate is skipped as informational.
- Partial success: the hook probe measured a greeting and six matching prompts; it did not measure a child session (`AI_SESSION_CHILD=1`) or a non-Claude runtime, which iteration 2 covers from transcripts instead.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:97,140,162,168,557`
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:50,85`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:189,415`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:449,468`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/006-gate-2-binding-and-runtime-pointers/scratch/bullet-draft.txt:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/g5/result.txt:2`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/005-recommendation-contract-and-brief/plan.md:71`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/ux/steer.md`
- Live hook probe: 7 prompts through `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js`
- Synthetic scorer probe: `startState` with a `.skilled/commands/doctor/git.md` read

## Assessment

- New information ratio: 0.90
- Questions addressed: KQ1 (what the brief says and whether a model can act on it)
- Questions answered: none fully; KQ1 is now half answered (the brief side is measured, the model side needs the post arm)

## Reflection

- What worked and why: measuring the real hook rather than reading the renderer produced the character and line counts, and the greeting probe exposed the unconditional directive cost that no document states. The synthetic scorer call turned a reading of `commandParts` into a reproduced false negative.
- What did not work and why: looking for an existing offer ledger assumed the diagnostics schema had evolved with phase 005; it has not, because 005 only adds recommendation fields.
- What I would do differently: measure the child-session brief and one non-Claude transport in the same pass, so the "brief is self-contained" question is answered per runtime rather than per renderer.

## Recommended Next Focus

The per-runtime start behaviour and the risk split: why claude started 3 of 12 and codex, pi 0 of 12 while pi wrote unsafely 3 times; whether the run-or-ask policy reaches the skill path or only the command path; and what the before-arm transcripts say about which pressure (brief, typed command, skill context) produced each start.
