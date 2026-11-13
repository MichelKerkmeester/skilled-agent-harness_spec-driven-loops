# Iteration 1: Hub deferral as the plain-offer bottleneck

## Focus

Which plain tune rows in the chat set receive no command because a hub returns `defer` or `clarify`, or because the top skill's route lands on a mode that maps to no command — and what is the smallest rule that turns such a row into an offer without adding a false offer. Lane: `offer-reach`. Ambiguity ruling: "plain offer" means the command the brief actually renders (phase 010's `offeredCommand`), not the capture's `offered` flag; those two differ and finding 1 quantifies it.

## Actions Taken

1. Read the after-arm log `007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl` and listed every plain tune row with its delivered `offeredCommand` (144 lines, 16 distinct chat rows).
2. Read the committed capture `command-routing-baseline.json` and compared its per-row `offered`/`top`/`top1`/`top3` with the delivered offer.
3. Ran the pure `compiled-route.cjs` resolver against `sk-doc`, `sk-code`, `system-deep-loop` and `sk-prompt` on the 16 chat prompts (tune rows are readable; no holdout text was read or printed).
4. Read the hub vocabularies (`sk-doc/hub-router.json`, `system-deep-loop/hub-router.json`), the attach contract (`ADV/lib/command-attach.ts`), the meaning gate and ordering (`ADV/lib/scorer/fusion.ts`), and the brief renderer (`ADV/lib/render.ts`).
5. Read the 31 none rows (`must-not-start` 22, `near-miss` 9) to bound the false-offer risk of any vocabulary change.

## Findings

1. The chat set has 16 plain tune rows. The after arm delivered a command on 5 of them — `/create:benchmark`, `/create:changelog`, `/create:feature-catalog`, and `/doctor:helper` on the two doctor rows — and delivered nothing on the other 11. The committed capture marks 6 as `offered`, because its `offered` flag counts a command that lands anywhere in the top-3, while the renderer prints only the top recommendation plus a doctor companion line; `cmd-create-agent-plain-tune-01` is the difference (`/create:agent` is top-3, not top-1, and never reaches the brief). So capture `offered` is an upper bound, not a delivered offer, and only phase 010's `offeredCommand` is evidence. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:520] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:548]

2. Every one of the 5 delivered offers travels through a compiled hub route attached to a skill in the top slot: the three create offers are the `sk-doc` hub's single-mode route (`sk-create-benchmark`, `sk-create-changelog`, `sk-create-feature-catalog`) attached by `enrichCompiledRoutes`, and the two doctor offers are the doctor-helper handoff. No delivered offer comes from a command row outranking its owner skill on a plain prompt. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:300] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:846]

3. On the 9 create-family chat rows, the `sk-doc` hub answers `route`/`single` with a command-mapped mode on 3 (benchmark, changelog, feature-catalog), `clarify` on 1 (create-agent-01, where `audit` also lifts sk-code), `defer` on 4 (create-agent-02, create-diff, create-goal, create-manual-playbook) and `route`/`single` to `sk-create-quality-control` on 1 (create-command, which has no command row). So the hub is the actual bottleneck for 6 of 9, not the attach layer. [SOURCE: .skilled/skills/sk-doc/hub-router.json] [SOURCE: .skilled/skills/sk-doc/hub-router.json:1] [INFERENCE: route results from `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt-stdin` over the 9 readable tune prompts on 2026-11-13]

4. The hub vocabulary is paraphrase-blind: it matches the phrasing used in the corpus rows that already pass and misses ordinary rewordings of the same task. "new agent" and "agent persona" are present but "agent definition" and "persona file" are not; "before and after document" is present but "a document before and after my rewrite" is not; "front-page overview" is present but "overview page" is not; "skill hub" is present but "hub skill" is not. Each miss is a literal phrase miss, so the route falls to defer even though the intent is unambiguous to a reader. [SOURCE: .skilled/skills/sk-doc/hub-router.json]

5. The deep family has a double miss. Both plain deep prompts (`cmd-deep-research-plain-tune-01`, `cmd-deep-review-plain-tune-01`) get no command: the deep hub defers on the research prompt, and on the review prompt the top skill is sk-code, whose single-mode route lands on `sk-code-review`, a mode with no row in `MODE_COMMANDS`. The doctor-deep-loop row does route to `research`, but `attachCommand`'s depth gate then suppresses `/deep:research` because the wording list holds effort phrases and not the failure vocabulary ("stopped converging"); the expected `/doctor:deep-loop` is never a candidate because the deep hub declares no doctor mode. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:252] [SOURCE: .skilled/skills/system-deep-loop/hub-router.json]

6. The smallest rule that covers the hub-caused misses without touching the none rows is two-part: (a) widen each hub's mode vocabulary with task-shaped paraphrase aliases that no none row contains ("agent definition", "persona file", "overview page", "intent file for a spec packet", "test script package", "audit this codebase", "findings stop changing"), and (b) on a `defer`/`clarify` result, offer the leading mode's command only when that command is `ask` (or read-only `run`), never a `start` command. Part (b) is a policy gate on the existing route result, not a second router. [INFERENCE: from findings 3-5 and the 31 readable none prompts, none of which contains those phrases]

## Ruled Out

- Lowering `COMMAND_MEANING_MIN_COSINE` (0.72) to lift the create rows: the misses are explicit-lane and hub decides, and the meaning lane needs the real embedder, so a lower bar spends false-offer risk without touching a hub `defer`.
- Ranking a top-3 command row into the brief instead of the top skill: the renderer deliberately prints one top label plus a doctor companion, and phase 005 froze that head shape; a second arbitrary line is a new brief surface, not a scoring fix.
- Treating the capture's `offered` as delivered: shown false on create-agent-01 in finding 1.

## Dead Ends

- Asking the doctor helper handoff to cover doctor-deep-loop: the helper is chosen only for a "problem" prompt and the deep-loop row is a diagnostic request; extending the handoff would have to suppress the expected `/doctor:deep-loop`, which is worse.
- Making `attachCommand` ignore `selectionKind` for a multi-target route: a bundle names several modes, so any single command would be a guess; that is exactly the defer case the hub reports.

## Edge Cases

- Ambiguous input: "plain offer" is defined as the delivered `offeredCommand`; the capture flag is reported as an upper bound and not used for the rate.
- Contradictory evidence: the capture's `offered` (6) contradicts the run log's delivered offers (5); both are cited and the run log wins because the renderer can only print the top.
- Missing dependencies: the advisor dist is stale, so `capture-command-routing-baseline.mjs` refuses to run and cannot be rebuilt inside this lineage; per-row scorer facts were read from the committed baseline and the pure compiled-route resolver instead.
- Partial success: hub behaviour is measured; per-row score values are not available without a rebuild and are left to iteration 2's source reading.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (tune and none rows only)
- `.skilled/skills/sk-doc/hub-router.json`
- `.skilled/skills/system-deep-loop/hub-router.json`
- `.skilled/bin/compiled-route.cjs`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`

## Assessment

- New information ratio: 0.90
- Questions addressed: KQ1 (hub defer cause and the smallest rule), KQ2 partially (the create rows are evidence misses, not threshold placement)
- Questions answered: KQ1

## Reflection

- What worked and why: reading the delivered `offeredCommand` beside the capture's `offered` flag exposed a measurement gap that would otherwise inflate every offer-rate claim; the pure compiled-route resolver then separated hub misses from attach misses without a daemon or a rebuild.
- What did not work and why: the capture script refuses to run because the advisor dist is stale, and this lineage may not rebuild; the committed baseline plus resolver were enough for route-level facts but not for score magnitudes.
- What I would do differently: read the renderer before the capture next time, because the renderer's "top only" rule changes what counts as an offer and therefore what the 3-of-16 number means.

## Questions Answered

- KQ1: the hub's `defer`/`clarify` (plus one route to a command-less mode) is the cause on 6 of 9 create rows and both plain deep rows; the smallest safe rule is paraphrase vocabulary plus an `ask`-only defer offer.

## Questions Remaining

- How much of the remaining gap is score placement versus evidence absence on the 5 rows whose top skill is not the owner (create-command, create-goal, create-manual-playbook, deep-review, doctor-deep-loop)?
- Does a widened alias set keep false offers at 0 of 35 on the none rows, measured rather than reasoned?

## Recommended Next Focus

Iteration 2: decompose the 5 wrong-top rows — read `PHRASE_BOOSTS`, `TOKEN_BOOSTS` and the fusion ordering for each, and decide whether an explicit phrase boost or a hub route is the cheaper, safer fix; quantify the semantic-lane contribution (9/45 phrase versus 14/45 real embedder) per family.
