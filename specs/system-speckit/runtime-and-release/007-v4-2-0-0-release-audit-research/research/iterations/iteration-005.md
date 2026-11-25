# Iteration 5: Q3 skill advisor, diff-first

## Focus
Q3: does the skill advisor (deep-loop loop offers, the typed-only Python fallback, the common-words floor, native versus Python parity) misroute or drift from its docs? Read the in-window hunks of `73d98332fff` (typed-only fallback), `527fc5f9d43` (distinctive-word floor) and the commit list `git log v4.1.0.0..v4.2.0.0 -- .skilled/skills/system-skill-advisor/ .skilled/bin/skill-advisor.cjs`, then ran 23 prompts through the native CLI and 4 through `skill_advisor.py --force-local`. The `mergeResearchFrontier` side lead was not reached.

## Actions Taken
1. Listed the in-window advisor commits (about 60, mostly deep-loop offer review rounds) and read the stats of `73d98332fff`, `527fc5f9d43`, `c5c97b12dfc`, `4edba5ad264` and `9f1190407eb`.
2. Read the `73d98332fff` diff and the current fallback gate (`_apply_deep_loop_offer_gate`, `_keep_deep_loop_hub_on_command_mention`, `_order_deep_loop_rows`).
3. Read the `527fc5f9d43` scorer diff (`promptHoldsDistinctiveWord`, `promptNamesIdNoun`, the `hasNamedAnchor` typed-command clause).
4. Grepped every advisor doc that names `/deep:*` or the fallback for drift. Checked `cli-shim.md`, `executor-delegation.md`, `advisor-recommend.md`, `hub-command-attachment.md`, `lib/README.md` and the fixture README.
5. Ran native probes, with scratch output only under the session scratchpad: counted asks, refusals, questions, past runs, stuck runs, two typed loops, and `loop` used as a code subject. Ran Python fallback probes on four of them.
6. Traced the fallback `typed` mark through the CLI degraded path (`degradedRecommendations`) and the brief renderer (`commandLabel`).

## Findings
1. **P3 (in window, `73d98332fff` with `777feef2920`): in degraded mode, a refused deep-loop command is printed as the reader's own choice.** The fallback keeps a `/deep:review` row whenever the command is typed and marks it `typed` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4624]. It reads no refusal, by design [SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/python-compat/cli-shim.md:33]. Reproduced: `skill_advisor.py --force-local "please do not run /deep:review, just review the parser once"` returns `deep-review` at 0.95 with `"typed": true`. The CLI degraded path turns a typed tracked entry into a command recommendation with `typed: true` [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1563]. The renderer treats a `typed` deep-loop row as "the reader's own choice" and drops the A/B/C offer [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:250]. So the brief prints `system-deep-loop → /deep:review (ask)` for a prompt that refused it. The native path withholds the command on the same prompt, so this is a parity gap the shim doc frames as harmless ("an `ask` the reader can decline"), while the renderer presents the command as a choice already made. The fallback-to-brief chain is inferred from code. The Python output is reproduced, but the degraded CLI path was not forced, because it needs an unreachable daemon. Policy stays `ask`, which limits the impact.
2. **P3 (in window, observed; the cause is inferred from `527fc5f9d43`): the native advisor leads with the deep-loop hub on a prompt that refuses the loop and asks for one pass.** `please do not run /deep:review, just review the parser once` gives `system-deep-loop` at 0.912 above `sk-code` at 0.877, with no command (reproduced). The command is withheld correctly, but at confidence ≥ 0.8 the hub is the skill a Gate 2 reader must invoke for what is a single-pass code review. `527fc5f9d43` added a typed command the skill owns as a named anchor, excluding only `commandOnlyMentioned` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1322]. A refused command still anchors the hub. Not confirmed: whether the anchor or the explicit lane alone gives the hub its lead. Confirm by scoring the prompt with that clause disabled.
3. **P3 UX, by design (partially new): a typed command beside a stuck-run complaint offers to rerun the loop instead of the doctor.** `my /deep:research run is stuck` gives `/deep:research (ask)`, while `my deep research run is stuck` gives `/doctor:deep-loop (run)` (both reproduced). The fixture pins this as intended: `typed-stuck` has `typedReviewKept:false` but `servedReviewKept:true` [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:123], via `attachTypedCommand` [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:442]. It is not drift, but a reader who names the command of a stuck run is offered a rerun of that loop and never the repair.

### Checked clean
- Native offers: a counted ask (`run 5 review iterations` gives `/deep:review`), an adverb ask (`iteratively overnight` gives `/deep:research`), a question about the command, a past run, and `loop` as a code subject (`for loop`, `while loop`, `event loop`) all route as `hub-command-attachment.md` and the fixture describe. Two typed loops lead with the first typed.
- Docs: `cli-shim.md:33`, the fixture README and the fixture `$comment` all state the typed-only fallback. `executor-delegation.md:39` matches the fallback's loop-word lift, since `iterations` is excluded as a subject word on purpose.
- Python parity loss on untyped loop asks (`run 5 review iterations on the parser` gives only `sk-code` in the fallback) is the documented outcome of `73d98332fff`, not drift.
- The `527fc5f9d43` distinctive-word floor: `promptNamesIdNoun` matches by substring (`haystack.includes(token)`), not by word. Probes such as `loop ux` and `loop ab` passed nothing, so no misroute was observed. This is a latent weakness, not a finding.

## Ruled Out
- Forcing the CLI degraded path: no env switch exists. It runs only when the daemon is unreachable [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1636], so finding 1's render step stays inferred.

## Dead Ends
- None.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: the shim doc says the fallback row is a declinable `ask`, while the renderer prints a typed row as a choice already made. Both are cited in finding 1.
- Missing dependencies: no way to force the degraded CLI path. The Python leg was reproduced directly instead.
- Partial success: the side lead (`mergeResearchFrontier` trust gate) was not reached within budget.

## Sources Consulted
- `git log v4.1.0.0..v4.2.0.0` for the advisor paths; `git show 73d98332fff`, `git show 527fc5f9d43`
- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4550-4700
- .skilled/skills/system-skill-advisor/runtime/lib/render.ts:240-253
- .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1525-1655
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1322, lexical.ts, text.ts:7-36
- .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json
- Advisor docs: cli-shim.md, executor-delegation.md, advisor-recommend.md, hub-command-attachment.md, lib/README.md
- Native CLI probes (23 prompts) and `skill_advisor.py --force-local` probes (4 prompts)

## Assessment
- New information ratio: 0.83
- Questions addressed: Q3
- Questions answered: Q3

## Q3 verdict
Answered. The advisor's in-window loop-offer gate routes the probed asks as documented, and its docs match the typed-only fallback. There are two low-severity misroutes on refusals: the degraded brief labels a refused typed command as chosen (finding 1), and the native hub leads a refused single-pass review (finding 2). There is also one by-design UX gap: a typed command beside a stuck run is offered as a rerun, not the doctor (finding 3). No P0, P1 or P2 was found.

## Reflection
- What worked and why: probing the same refusal prompt on both paths exposed the parity gap faster than reading the 60-commit gate history.
- What did not work and why: the degraded CLI path cannot be forced without stopping the daemon, so its render step stayed inferred.
- What I would do differently: score finding 2's prompt with the typed-command anchor removed in a scratch copy, to settle its cause.

## Questions Remaining
- Q4 session hooks and spec tooling; Q5 operator UX of the new commands and hooks.

## Recommended Next Focus
Q4, diff-first: the Stop decision auto-record, tail packet detection, and nested sub-tracks in create, validate and relocate, in `v4.1.0.0..v4.2.0.0`. Side leads carried: `mergeResearchFrontier` (fanout-merge.cjs:786) shows no trust gate while fanout-merge.md:50 says an untrusted lineage claims no coverage; the cause of finding 2 (fusion.ts:1322 anchor on a refused command).
