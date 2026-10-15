# Iteration 5: Design consolidation — mechanism choice, onboarding entry, anti-steal, tests, rejected ideas

## Focus
Answer the design question: how the advisor should point users at doctor commands — which mechanism, whether a dedicated onboarding entry is needed, how to avoid stealing prompts from skills, how to test routing accuracy, and which candidate ideas to reject with reasons.

## Actions Taken
- Confirmed doctor routers consume `_routes.yaml` at dispatch time (argv + presentation menu) — it is the single live routing manifest (git.md:65,86; deep-loop.md:31,46; runtime-mirrors.md:31,46; sk-code.md:24; skill-advisor.md gate).
- Reviewed prior-art verdict `specs/agents/016-repo-rule-advisor-surfacing/001-advisor-surfacing/research/research.md` — a two-lineage fan-out that refused teaching the advisor about repo rules, and the follow-on `010-rule-phrase-find-surface` phrase→file find surface.
- Verified `.skilled/commands` is absent from the trigger-index corpus roots (corpus.mjs:31) — commands are invisible to both retrieval channels.

## Findings
1. Prior art constrains and validates the design: spec 016's fan-out refused advisor surfacing for *repo rules* because rules are obligations with no invocation — the scorer kinds are `'skill' | 'command'` (types.ts:47) and a constant brief pointer can't action-match. Doctor commands are precisely the admissible case 016 carved out: they ARE `kind:'command'` invocables. The transferable cautions: no constant brief lines, measure before building, don't misuse the trigger index [SOURCE: specs/agents/016-repo-rule-advisor-surfacing/001-advisor-surfacing/research/research.md §1,§4; .skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts:47].
2. `.skilled/commands` is not a trigger-index corpus root (`CORPUS_ROOTS = ['specs','.skilled/skills','.skilled/hooks','.skilled/changelog/skilled']`) — command docs can't be found through Gate-1 lookup either; both retrieval channels exclude the commands tree [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:31].
3. Recommended mechanism — **extend `derive-command-bridges.cjs` with a `_routes.yaml` source**: emit one bridge per doctor command aggregating its routes' `trigger_phrases` into `keywords`/`intentSignals`, `skillId` from the command's `skill_agent` tag, `ownerMode` e.g. `doctor`, `source` = `.skilled/commands/doctor/_routes.yaml`. One entry per command (not per route) because `bridgeId()` admits a single `/cmd:sub` form and sibling routes of `/doctor:git` share the command [SOURCE: derive-command-bridges.cjs:49-58,80-120; _routes.yaml:236-302].
4. Activation lands in `scoring-compatibility.json` (per-platform keywords/domains/intentSignals + order + enable flag) — doctor entries can ship TS-active + Python-active together, unlike today's partial parity [SOURCE: scoring-compatibility.json; command-bridges.generated.json runtime blocks].
5. Anti-steal is a VOCABULARY problem, not a weight problem: keep doctor phrases diagnostic-flavored (the manifest's own are: "turn off a git hook check", "is my sk-git setup working", "skill advisor recommends the wrong skill"), rely on the existing ambiguous two-candidate render when a skill also matches, and encode sibling preference in metadata `discriminator.preferSiblingWhen` if a metadata file is added later. High-weight boosts on bare work verbs ("commit", "write") must NOT be added [SOURCE: _routes.yaml:260-301; explicit.ts:107-113 PHRASE_BOOST_BOUND; command-metadata.json discriminator shape].
6. Onboarding gap requires a NEW surface, not just wiring: "help me set up skilled" / "is my repo set up right" have no doctor target today (no generic setup/health route; `/doctor:env` is env-switches only and unmanifested). Options: a new `/doctor:setup` umbrella route aggregating the per-domain setup batteries (sk-code setup, git setup, env inspect, mcp install), or a `setup` target under an existing doctor. Without it, doctor bridges still can't answer the headline prompt [SOURCE: iteration-003 finding f-iter003-005; .skilled/commands/doctor/env.md].
7. Testing path exists and is reusable: `/doctor:skill-advisor router-reach` wraps `ci-router-vocabulary-reach.cjs`, which probes the live advisor per declared phrase — extend it (or add `doctor-route-reach`) so every `_routes.yaml` trigger phrase must surface its owning `/doctor:*` in top-k; the 17-probe baseline in this lineage is the seed of a labeled gold battery for regression [SOURCE: ci-router-vocabulary-reach.cjs:1-40; _routes.yaml:179-207; baseline-probes.jsonl].
8. Ideas to reject, with reasons: (a) fake skill nodes in sqlite for doctor — `kind:'command'` exists precisely to avoid that; pollutes graph invariants (source_path UNIQUE, family taxonomy). (b) Hardcoded "try /doctor:X" brief text — 016 refused the identical pattern: constant, unmatchable, bypasses scoring, duplicates routing in the render layer. (c) Harvesting `.skilled/commands/**/*.md` frontmatter via the doc harvester — env-gated off by default, wrong root/type, and command docs' prose would flood the lexical lane. (d) Copying doctor triggers into each owning skill's command-metadata.json — duplicates `_routes.yaml`; command-catalog-mirror-check exists precisely because copies drift. (e) An umbrella `/doctor` router command as THE fix — helps UX, does nothing for advisor visibility (same harvest boundary). (f) Scoring-logic changes — violates the doctor invariant "tune the routing surface, never the routing logic" [SOURCES: projection.ts:61-63; research.md §4(b); skill_advisor.py:988-991; command-catalog-mirror-check.cjs:7-20; doctor-skill-advisor-tune.yaml].

## Questions Answered
- Q5 — answered: mechanism = `_routes.yaml`-fed bridge generation; onboarding = new umbrella target; anti-steal = diagnostic vocabulary + ambiguous render + discriminators; tests = router-reach pattern + labeled gold battery; rejects enumerated with reasons.

## Questions Remaining
- None material. Minor implementation detail deferred: whether the bridge `id`/`name` should render as `doctor:git` (bare, matching `create:agent` convention) versus `command-doctor-git` — a labeling choice for implementation, not a design blocker.

## Ruled Out
- Constant-text brief injection, sqlite fake nodes, commands-dir doc harvest, per-skill trigger copies, umbrella router as fix, scorer logic changes — see finding 8.

## Dead Ends
- None.

## Edge Cases
- Ambiguous input: per-command vs per-route bridge granularity — chose per-command because `bridgeId()` admits `/cmd:sub` only once; sibling targets share the command id. Documented.
- Contradictory evidence: 016 refused advisor surfacing for rules — resolved: rules aren't commands; the `command` kind exists for invocables.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/agents/016-repo-rule-advisor-surfacing/001-advisor-surfacing/research/research.md:1-80
- specs/agents/016-repo-rule-advisor-surfacing/010-rule-phrase-find-surface/implementation-summary.md
- .skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs:31
- .skilled/commands/doctor/{git,deep-loop,runtime-mirrors,sk-code,skill-advisor}.md router contracts
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:49-160
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts:47
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json
- steer.md: absent this iteration

## Assessment
- New information ratio: 0.8 — the prior-art constraint (016 verdict) and corpus-root exclusion are new evidence; the design recommendations are synthesis of iterations 1-4 (+0.10 simplicity bonus applies — the mechanism is a data-source addition, not new machinery).
- Questions addressed: Q5.
- Questions answered: "What design should point users at doctor commands (feed _routes.yaml triggers into the advisor, dedicated onboarding entry, anti-steal rules versus skills, routing-accuracy tests), and which ideas should be rejected and why?"

## Reflection
- What worked: checking prior spec work before designing surfaced the 016 verdict — which both constrains (no constant brief lines) and validates (command kind is the admissible surface) the recommendation.
- What did not work: nothing notable.
- What I would do differently: none — all five key questions now carry evidence-backed answers.

## Recommended Next Focus
None — all key questions answered. Synthesis should consolidate ranked recommendations and implementation phases into research.md.
