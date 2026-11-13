# Iteration 4: Validated candidate set, ranked, checked against both earlier segments

## Focus

Turn the three measured iterations into a ranked candidate set that names, for each item, the file it changes, the measured gain, the verification command and its risk to the floors, and check every candidate against the segment-one and segment-two dispositions so nothing already built or declined is re-recommended.

## Actions Taken

1. Read the segment-two ranking and dispositions (`research-segment-2.md` sections 3 and 4) and the 009 `spec.md` handoff rule.
2. Read `sk-doc/hub-router.json` mode definitions, weights and alias classes for `sk-create-quality-control`, `sk-create-readme` and `sk-create-with-human-voice`.
3. Read the two tune prompts that route to `sk-create-quality-control` and the 012 route table rows for them.
4. Counted the canary exposure of the proposed alias wording across the 87 `none` rows.

## Findings

1. `cmd-create-readme-plain-tune-01` routes to `sk-create-quality-control` because its wording names a "quality bar", while `create-readme-aliases` holds `readme`, `write readme`, `folder readme`, `front-page overview` and not `overview page`; the prompt asks for an overview page per folder. [SOURCE: .skilled/skills/sk-doc/hub-router.json:240] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl]

2. `cmd-create-with-human-voice-plain-tune-01` routes to `sk-create-quality-control` from its rewrite-and-score wording; `sk-create-with-human-voice` already declares a `create-with-human-voice-aliases` class that none of this prompt's wording reaches. [SOURCE: .skilled/skills/sk-doc/hub-router.json:160] [SOURCE: .skilled/skills/sk-doc/hub-router.json:163]

3. The alias wording is floor-safe to add: across the 87 `none` rows, the only rows matching `overview|readme|rewrite|human|person wrote|quality bar` are the two typed rows for these same commands, which must start. No must-not-start, near-miss or partial-slash row can be reached by the proposed keywords. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl]

4. Ranked candidates, by expected gain in started-when-useful per unit of floor risk:

| Rank | Change | File | Measured gain | Verification | Floor risk |
|---|---|---|---|---|---|
| 1 | Add `overview page`, `folder overview` to `create-readme-aliases` and `reads like a person`, `score how human` to `create-with-human-voice-aliases`; regenerate the mirrored manifests | `.skilled/skills/sk-doc/hub-router.json`, then `sync-runtime-mirrors.cjs` | 2 rows, from no command to `/create:readme (start)` and `/create:with-human-voice (start)`; plain tune combined 28 to 30 | `compiled-route.cjs --hub sk-doc --prompt "<the two prompts>"` shows the two modes; `capture-command-routing-baseline.mjs --real-embedding` prints tune 30 and false offers 0 of 35; suite green | 0 of 87 none rows can match the new keywords |
| 2 | Add plain anchors for the five below-threshold commands (`/doctor:install`, `/doctor:setup`, `/doctor:update`, `/doctor:speckit`, `/speckit:search`) and a scorer row or alias for `/create:skill-parent` | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`, the owning `command-metadata.json`, and the bridge deriver | Up to 6 rows from no recommendation to a head command; plain tune combined 28 to at most 34 | `capture-command-routing-baseline.mjs --real-embedding` tune own count and `false_offer`; `nm-`/`slash-variant` canaries; suite | Medium: the doctor family is adjacent to the 35 must-stay-silent rows, and five of the six commands mutate |
| 3 | Give a deferring or routing hub outside `MODE_COMMANDS` a fallback label, so `sk-code` is not silent | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (`routeNeedsMode`), `lib/render.ts` only if the label text differs | 2 rows get `(needs a mode)` instead of an unqualified skill name; no new command | Unit test on `routeNeedsMode` for a hub with commands but no mode table; two live heads | Low: label only, no command, no score |
| 4 | Make the unreachable-daemon answer score in process with the TypeScript fusion and compiled-route enrichment instead of spawning `skill_advisor.py` | `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` (`runLocalScorer`) | 27 head commands plus 1 `Also:` line on the 45 tune rows whenever the daemon is down, where untyped rows carry none today; replaces a measured 644 ms Python spawn | New vitest forcing an unreachable endpoint and comparing the envelope with the daemon fixture; one sandboxed-endpoint capture | Medium: a second scoring path can drift unless it imports the same scorer; the daemon path and its floors are untouched |
| 5 | Stop withholding a hub command when the same command already ranks below the head | `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` (`alreadyOffered`) | 1 row, `cmd-create-agent-plain-tune-01`, gains `/create:agent (start)` on the head | The same capture shows tune 30 to 31; a unit test that the hub command lands on the top | Low gain, medium byte risk if the fix instead renders a second head on every prompt |
| 6 | A default subcommand or a stronger cue for `/doctor:mcp` and `/doctor:skill-advisor` | `command-metadata.json` for the doctor family, `explicit.ts` | 2 rows to a doctor command | Real capture plus the doctor slice; a policy decision for the seven-subcommand family | Medium-high: a default subcommand can run a mutating command the reader did not choose |

5. Not recommended, with the reason: rank 15 intent enrichment and re-embedding (iteration 2: 0 brief-level commands gained, and the real regime already holds the floors); the capture `offered` relabel (already built in phase 013 as a comment and field documentation, so re-recommending it would repeat a built item); a lower meaning threshold or a higher semantic lane weight (eliminated in segment two section 4, and iteration 1 shows the no-command rows are not threshold-shaped); a default command for a deferring hub (eliminated in segment two because it fires the deep-loop near-miss row). [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-2.md:56]

6. Residual not covered by the built phase 012 label: `routeNeedsMode` returns true only for a hub with a `MODE_COMMANDS` row, and `sk-code` has none, so `cmd-speckit-implement-plain-tune-01` and `cmd-doctor-sk-code-plain-tune-01` stay silent. This is a gap in the delivered label, not a repeat of rank 6, which built the label for hubs the table already knew. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:392]

7. Candidate 2 is the only one that can move more than two rows, and it is also the only one whose gain depends on new scoring evidence rather than an alias: five of its six commands already have a scorer row, so the work is anchor wording plus the 35-row silence re-measurement, not new plumbing. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:189]

## Ruled Out

- Re-recommending the capture `offered` relabel. Phase 013 already built it and the remaining risk is a reader trusting the field, which iteration 1 documented.
- Reopening rank 15 on this evidence. The measured brief-level gain is zero.
- Treating candidate 2 as one change: its six rows split into five anchor rows and one missing-scorer-row row, with different files and different risk.
- A second rendered head for candidate 5: it costs bytes on every prompt, which is the one budget the brief cannot grow.

## Dead Ends

- Proving candidate 1's gain by editing the router: out of scope for this lineage. The compiled-route probe on the current wording plus the alias-class read is the strongest available evidence.
- Proving candidate 4's gain without the code change: the daemon path cannot be forced through `runLocalScorer` without an unreachable endpoint, and the Python branch is what answers there.

## Edge Cases

- Ambiguous input: "same command as the live answer" for candidate 4 could mean byte-identical render or the same command field. The measurable claim is the command, policy and needsMode fields, which the hook already forwards.
- Contradictory evidence: the 012 summary says the three deep rows now attach their commands, while the committed capture records `offered: false` for them; iteration 1 finding 3 resolves this as a capture-field definition, and the live heads show all three carrying their commands.
- Missing dependencies: candidate 1's mirror regeneration needs `sync-runtime-mirrors.cjs`, which is a build step an implementing phase runs; this lineage only names it.
- Partial success: none.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/research-segment-2.md`
- `.skilled/skills/sk-doc/hub-router.json:160`, `:163`, `:240`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (tune and none rows)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/scratch/routes-sk-doc-after.tsv`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:189`, `:392`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:451`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1453`

## Assessment

- New information ratio: 0.45
- Questions addressed: which candidate changes remain, what each costs and gains, and whether any repeats a built or declined item
- Questions answered: none of the strategy key questions is newly answered; this iteration validates and ranks the answers from iterations 1 to 3

## Reflection

- What worked and why: reading the two winning tune prompts against the alias classes produced an exact, low-risk edit rather than a general "improve the hub vocabulary" recommendation.
- What did not work and why: ranking candidate 2 first on row count ignored that five of its rows need scoring evidence and it carries the only real floor risk; expected gain per unit of risk puts the two-row alias first.
- What I would do differently: measure the canary exposure before ranking, because a candidate that touches zero negative rows moves up regardless of its row count.

## Recommended Next Focus

Iteration 5: quantify candidate 2's floor risk directly, by measuring where the 87 `none` rows sit relative to the doctor and speckit families, and check whether candidate 1's two rows are the only tune rows whose route depends on the quality-control alias class.
