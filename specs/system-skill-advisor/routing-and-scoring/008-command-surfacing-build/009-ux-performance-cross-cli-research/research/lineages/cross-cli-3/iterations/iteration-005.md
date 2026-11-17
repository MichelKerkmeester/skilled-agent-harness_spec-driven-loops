# Iteration 5: The degraded path — what it loses, who hits it, and the smallest fix

## Focus

The carried question no other lane owns: when the hook cannot reach the advisor daemon it answers from the local fallback scorer with freshness `stale`. Which runtimes hit that path in practice, how often, and what is the smallest change that makes the fallback carry the same command as the live answer.

## Actions Taken

1. Read the CLI's fallback branch: `runLocalScorer`, `degradedRecommendations` and the catch that invokes them in `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts`.
2. Reproduced the degraded answer end to end **without a daemon**: ran the same scorer subprocess the fallback runs (`python3 .../skill_advisor.py --threshold 0.8 --uncertainty 0.35 --stdin`) and shaped its rows through the exported `degradedRecommendations`, then rendered with the shared renderer (`scratch/degraded-parity.mjs`).
3. Asked `commandRowFor` and `MODE_COMMANDS` what the shaper can see for each top skill.
4. Ran `compiled-route.cjs` for the three hub prompts to see whether the missing target is available locally.
5. Counted `Advisor: stale` in every committed transcript and store that keeps a brief.

## Findings

1. **The degraded answer is the bare scorer plus a lossy shaper, not a degraded copy of the handler's answer.** The fallback spawns `skill_advisor.py` (whose own rows say `"source":"native"`), then passes them through `degradedRecommendations`, which has no attach step at all. On the seven probe prompts the local top equals the live top on six, and every resulting head loses the command, the policy and the mode label. [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1455] [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1481] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/degraded-parity.json]

2. **The 012 note's "a typed command is kept" does not reproduce at HEAD.** For `/create:readme for the utils folder` the scorer's top is `sk-doc` with no command; `commandRowFor('sk-doc')` returns `undefined`, so the typed branch never fires and the degraded head is `Advisor: stale; use sk-doc 0.95/0.12 pass.` The typed command is lost as well. The carried question understated the loss by one class. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/degraded-parity.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch/live-heads.txt:23]

3. **The 012 note's "a plain readme request goes to another skill" no longer reproduces.** The local scorer ranks `sk-doc` 0.95/0.12 first for `write a readme for the utils folder`, the same top the live answer has. The remaining gap on that row is the command and policy, not the routing — so phase 012's aliases reached the scorer that the fallback uses. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/degraded-parity.json]

4. **Only the doctor prompt's top differs.** Live names the command row `command-doctor-setup` and prints `/doctor:setup (run)`; the local scorer names `system-skilled-doctor` with no command. That is a ranking difference in the bridge rows, not a shaping difference, so it needs an owner-to-command lookup as well as the attach step. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/degraded-parity.json]

5. **Everything the attach step needs is available with no daemon.** `compiled-route.cjs` answers locally: `sk-doc` plus the readme prompt returns `action: route, selectionKind: single, workflowMode: sk-create-readme`; `system-deep-loop` plus the deep-research prompt returns `research`; `system-deep-loop` plus "use the system-deep-loop skill" returns `defer`. `MODE_COMMANDS['sk-doc']['sk-create-readme']` is `/create:readme` and `MODE_COMMANDS['system-deep-loop']['research']` is `/deep:research`, and `typedCommandIn('/create:readme …')` already returns `/create:readme`. The fallback simply never calls any of them. [command output 2026-11-13] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:15]

6. **In the committed arms the path was taken zero times, where it could be observed.** `Advisor: stale` appears in 0 of 107 Claude transcripts (pre 25, post 62, smoke 4, fin 16), 0 of 33 Codex session files dated 2026-11-13, 0 of 36 Pi files touched on the arm date, and 0 in the DSH store. Codex's zero is uninformative because its hooks were unapproved and no brief was ever produced, and OpenCode keeps no store, so its rate is unmeasurable. [grep output 2026-11-13]

7. **The trigger conditions are narrower than "no daemon".** The CLI starts the daemon and waits, so a cold daemon alone does not reach the fallback; it takes a failed spawn, a crashed daemon, or a socket the process cannot connect to. The Claude hook imports the CLI fallback reader and the OpenCode plugin spawns the same CLI; whether the Pi, Devin and DSH adapters inherit this fallback is UNKNOWN — no import of the reader was found in their trees. [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1368] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:347]

8. **Smallest change: give the degraded branch the handler's own attach step.** In `skill-advisor-cli.ts`, before shaping, call the shared `compiledRouteForRecommendation` plus `attachCommand` for a hub top, `typedCommandIn`/`typedCommandForTop` for a typed prompt, `MODE_COMMANDS` membership for a `defer`, and an owner-to-command lookup for `system-skilled-doctor`; then let `degradedRecommendations` shape the enriched rows. Measured feasibility is finding 5; the expected effect is inference from the measured tops: five of the six non-empty prompts regain the same command and policy as live, and the doctor prompt matches once the owner lookup is added. Verify with a test that forces `invokeToolPayload` to throw the retryable exit and asserts the degraded head equals the live head for the seven probe prompts. Floor risk: none — the branch is the daemon-unreachable path and feeds no scoring input; the cost is one local `compiled-route.cjs` subprocess per degraded prompt, inside the existing five-second fallback budget. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:583] [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1572]

## Ruled Out

- Starting a daemon or a second socket directory to measure the fallback live. The reproduction above reaches the same two functions without one, and a second daemon is forbidden in this lane.
- Treating the 012 note as the current behaviour. Two of its three claims do not reproduce at HEAD, and the third (mode label and doctor hand-off lost) does.

## Dead Ends

- Looking for an OpenCode-side fallback record: the plugin's answer is in memory only, so a degraded OpenCode prompt leaves no trace at all. Its rate can only be inferred from an operator's own session, never from an arm.

## Edge Cases

- Contradictory evidence: the 012 note says a typed command is kept; the measured degraded head drops it. Resolved in favour of the measurement, because the shaper's own lookup returns `undefined` for the top skill. Recorded here rather than folded away.
- Ambiguous input: "hit this path in practice" could mean per prompt or per runtime. Answered per runtime with counts, and named the two runtimes whose zero is uninformative.
- Missing dependencies: no OpenCode store and no Codex brief, so their rates stay UNKNOWN.
- Partial success: the fallback's fix is demonstrated at the route-lookup level, not end to end; the enriched render is inference.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts`
- `.skilled/skills/system-skill-advisor/runtime/schemas/compat-contract.json`
- `.skilled/bin/compiled-route.cjs` (three route lookups, output recorded in this iteration)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch/live-heads.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/scratch/degraded-parity.json`
- Claude transcripts under `~/.claude/projects/*behaviour-arenas*`, Codex sessions under `~/.codex/sessions/2026/11/13`, the Pi and DSH stores (counts only)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/cross-cli-3/steer.md` (absent; not present at the time of this iteration)

## Assessment

- New information ratio: 0.7
- Questions addressed: What does the degraded path lose per runtime, and what is the smallest change that makes the fallback carry the same command?
- Questions answered: the same question

## Reflection

- What worked and why: calling the two functions the fallback itself calls, with the same scorer subprocess, reproduced the degraded answer without a daemon and let the loss be attributed to the shaper rather than the scorer. Running `compiled-route.cjs` beside it proved the missing target is already available offline.
- What did not work and why: the first attempt to price the compiled-route block by editing the earlier probe broke the script; a fresh file was faster. The grep for `~/.pi` initially read 523 stale files, which looked alarming until the count was scoped to the arm date and fell to zero.
- What I would do differently: reproduce the degraded shape before reading the earlier note, so the note is checked against behaviour rather than used as the baseline.

## Recommended Next Focus

All five tracked questions are answered; the loop can stop on question coverage. The synthesis should carry the ranked set, the two corrected premises about the fallback, and the per-runtime delivery table.
