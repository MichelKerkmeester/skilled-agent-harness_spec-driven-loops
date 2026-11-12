# Iteration 2: Scoring mechanics — why commands never surface on plain chat

## Focus

Angle 2 (scoring): explain, mechanically and with numbers, why a plain planning or research prompt returns no command recommendation while a typed slash command does — and what the no-slash path and the mutating-command gate cost. Chosen after iteration 1 established that 22 of 43 commands have no TS-enabled bridge; this iteration asks whether enablement is the only gate or whether the lane design closes the door on its own.

## Actions Taken

1. Read the lane registry and its default weights.
2. Read the command projection source in two blocks (hand-authored, generated) and counted enabled/readOnly flags.
3. Read the explicit lane's `PHRASE_BOOSTS` table and counted how many rows reach command ids.
4. Read `readOnlyRouteAllowed()` and the confidence floors it switches between.

## Findings

1. The TypeScript scorer holds two command-projection sources in one file: 5 `HAND_AUTHORED_COMMAND_BRIDGES` plus a `// BEGIN GENERATED COMMAND BRIDGES` block of exactly 62 generated projections, of which 40 carry `routingEnabled: true` and 22 carry `routingEnabled: false` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:78]. Those numbers match the generated inventory's `counts` block exactly, so the projection is a build-time mirror of `command-bridges.generated.json`, not a second independent inventory [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1].

2. Refines iteration 1's finding 9: the JSON inventory carries no `kind` field, but every generated projection does (`kind: 'command'`) and the generator also stamps `routingEnabled` and `readOnly`. The information exists at build time and is dropped on the way into the JSON that humans and other runtimes read [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:81].

3. The strongest recall blocker is not enablement but vocabulary: a command projection's `keywords` and `intentSignals` are slash strings. `command-spec-kit` — the enabled id that fronts `/speckit:plan` — declares `keywords: ['/speckit:plan', '/speckit:resume', '/deep:research', '/deep:review']` and the identical `intentSignals`, so the lexical and derived lanes have nothing to match in the sentence "plan a new feature for the login page" [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:87].

4. Plain chat does reach command ids on exactly one path, and it is hand-mapped: `PHRASE_BOOSTS` in the explicit lane contains 8 phrase rows that name a command id — `create:agent`, `create:manual-testing-playbook`/`command-create-manual-testing-playbook`, and `memory:save`/`command-memory-save` — out of roughly 100 rows. So 3 of the 45 shipped commands have any chat-only path at all, and the remaining 42 have none [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:169].

5. Even a typed slash command ranks the owning *skill* above the bridge: `/deep:research` boosts `[['system-deep-loop', 1.6], ['command-spec-kit', 0.45]]`, `/deep:review` the same, and `/speckit:resume` boosts `[['system-spec-kit', 0.9], ['command-spec-kit', 0.75]]` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:97]. The typed-command path therefore *is* a skill recommendation by construction; the bridge id surfaces only as a lower-weight runner-up, which is what the spec's brief shows as a bare `command-spec-kit` [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md:34].

6. One rule actively pushes a bridge down: after `/speckit:resume`, the explicit lane emits `command-spec-kit` at -1.0 with evidence `speckit-resume-skill-disambiguation`, so the resume path deliberately removes the bridge instead of surfacing it [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:349].

7. The mutating-command gate is a 0.57 confidence cliff controlled by one boolean: `readOnlyRouteAllowed()` returns true for a command only when `kind === 'command'` and `readOnly === true` and one of its keywords matches at phrase boundary, and the comment states "A mutating command never carries the flag and stays gated" [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:688]. A gated route sits at `readOnlyExplainerFloor: 0.25`; an allowed one is lifted to `readOnlyRouteAllowedFloor: 0.82` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:183].

8. Only 15 of the 62 generated command projections carry `readOnly: true`, and all 15 are doctor routes (`command-doctor-setup`, `…-agents-md-check`, `…-ci-report`, `…-install`, `…-overlay-status`, `…-symlink-check`, `…-sk-skill-check`, `…-helper`, two `…-git/sk-code setup`, six `…-skill-advisor-*`) [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:255]. No non-doctor command is declared read-only, so the read-only lift is unreachable for 30 of the 45 commands even where a bridge exists.

9. The lane weights make command recall structurally expensive on top of that: `explicit_author 0.42`, `lexical 0.28`, `graph_causal 0.13`, `derived_generated 0.12`, `semantic_shadow 0.05` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:10]. A command that must be recognized from prose depends on lane 2 at 0.28 weight and has empty keywords; a typed command rides lane 1 at 0.42.

## Ruled Out

- "Enablement is the whole story": if the 22 disabled bridges were enabled, plain prose would still not match, because their keywords are slash strings and their only plain-phrase path is the 8-row table. Enablement widens typed-slash recall only.
- "The advisor deliberately abstains on commands": contradicted by the doctor family, which is fully enabled, read-only-flagged where appropriate, and renders runnable strings. Abstention is a property of non-doctor commands, not of commands as a class.

## Dead Ends

- Searching for a separate "no-slash penalty" constant: there is none. The effect the spec describes is produced by the *absence* of a plain-language key on command projections plus the explicit lane's slash-only boost table, not by a negative constant. Recorded so later iterations do not hunt for a penalty that does not exist.

## Edge Cases

- Ambiguous input: "no-slash penalty" in the spec could mean a negative constant or a missing positive. Selected interpretation: missing positive key, because the code has no such constant and `PHRASE_BOOSTS` is explicitly the only plain-phrase channel.
- Contradictory evidence: iteration 1 finding 9 (no source marks command kind) vs. this iteration's projection evidence. Resolved by scoping: the JSON inventory has no kind, the generated TS projection does. Both statements stand with that qualification.
- Missing dependency: none.
- Partial success: none; the scoring path was traceable end to end without running the CLI.

## Questions Answered

- Why do plain planning and research prompts return zero recommendations, and what do the no-slash penalty and the mutating-command gate cost in recall versus what they buy in precision?

## Questions Remaining

- 8 of 9 remain open.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md

## Assessment

- New information ratio: 1.0
- Questions addressed: Q2 (scoring), Q1 remainder (enablement vs. vocabulary)
- Questions answered: Q2
- Findings: 9, all new

## Reflection

- What worked and why: reading the projection file's generated block and counting flags produced exact population numbers (67/40/22/15) from static source, which let the scoring claim be quantified instead of asserted. Tracing `PHRASE_BOOSTS` for rows that name a command id converted "chat doesn't reach commands" into "8 rows reach 3 command families".
- What did not work and why: the initial hypothesis was a hidden no-slash penalty constant. Grepping for one consumed two calls and found nothing; the real mechanism is an absent key plus a slash-only table. The dead end is now recorded so it is not repeated.
- What I would do differently: read the projection's generated block before the lane registry — the population numbers frame which lane matters.

## Recommended Next Focus

Angle 3 (output contract): assemble what `advisor_recommend` actually returns and what the brief renders, and check the token budget claim (80-120 tokens) against `render.ts` constants and the CLI's JSON shape. Carry forward: the `kind` field already exists in the projection but not in the inventory, so the contract question is "what must be added to the *output*", not "what must be invented".
