---
title: "Iteration 1: Advisor architecture and routing pipeline today"
trigger_phrases: []
---
# Iteration 1: Advisor architecture and routing pipeline today

## Focus

Map how the skill advisor turns a prompt into a recommendation today: the CLI front door, the hook brief surface, the scorer lanes and fusion, and the surfaces through which skills versus commands enter scoring. This is the ground truth the doctor-guidance design must extend or reuse.

## Actions Taken

- Read `.skilled/bin/skill-advisor.cjs` end to end (CLI shim contract, freshness gate, socket setup).
- Read `.skilled/skills/system-skill-advisor/SKILL.md` (routing contract, command ids, routing-vocabulary ownership).
- Read `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` (prompt-time brief flow, fail-open behavior).
- Read `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` (explicit-author lane, command phrase boosts).
- Read `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` (command bridge projections) and `lib/scorer/weights-config.ts`.
- Inspected `runtime/scripts/command-bridges/` (generator, allow-list, generated inventory) and `runtime/tests/command-bridges-drift-guard.vitest.ts`.

## Findings

1. The advisor has exactly one front door: `.skilled/bin/skill-advisor.cjs` resolves `runtime/dist/runtime/skill-advisor-cli.js` inside the `system-skill-advisor` package and spawns it with the caller's arguments; a freshness preflight refuses a stale or missing dist with exit 69 (75 for `--warm-only` retryable warmups). [SOURCE: .skilled/bin/skill-advisor.cjs:22-23] [SOURCE: .skilled/bin/skill-advisor.cjs:70-83] [SOURCE: .skilled/bin/skill-advisor.cjs:105-109]

2. The package exposes nine stable command ids (`advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`, `skill_graph_propagate_enhances`) over a resident daemon; exit taxonomy is 0/1/64/69/75, and when the daemon is unreachable the CLI answers from the local Python scorer and marks the result degraded instead of failing. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:318-336]

3. Routing vocabulary for skills lives in each skill's `graph-metadata.json` (`intent_signals` plus `derived.trigger_phrases`); a skill's `SKILL.md` frontmatter `trigger_phrases` and `intent_signals` are not read by any runtime routing reader, and reference/asset doc frontmatter `trigger_phrases` feed routing only when `SPECKIT_ADVISOR_DOC_TRIGGERS=true`. This means a doctor-routing change cannot be expressed by editing `SKILL.md` frontmatter alone. [SOURCE: .skilled/skills/system-skill-advisor/SKILL.md:338] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:36]

4. The prompt-time hook fires on every user prompt: kill-switch check, prompt gate, one bounded CLI `advisor_recommend` call, then a model-visible `Advisor:` brief; when there is no route it emits a directives fallback status line (`Advisor: no skill matched.`, `Advisor: prompt skipped.`, `Advisor: outage (<status>)`) and never blocks the prompt. Raw prompt text is not persisted. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:33-43]

5. Scoring is a five-lane fusion (`explicit_author`, `lexical`, `graph_causal`, `derived_generated`, `semantic_shadow`) with per-variant weight multipliers (e.g. `explicit_author: 1.04`, `lexical: 1.00`, `graph_causal: 0.98`, `derived_generated: 0.98` in the default variant) and bounded constants in `weights-config.ts`. Any doctor-routing design lands inside this fusion, not beside it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:169-177] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts:15-21]

6. The explicit-author lane already carries command syntax: a `PHRASE_BOOSTS` table maps exact command strings and phrases to skill ids and pseudo-command ids (for example `/speckit:save` → `memory:save` 1.6 / `command-memory-save` 1 / `system-spec-kit` 0.45; `/deep:research` → `system-deep-loop` 1.6 / `command-spec-kit` 0.45), and a `TOKEN_BOOSTS` table maps single tokens to skills. There is no `/doctor:*` entry in either table. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:117-119]

7. Commands are already first-class scoring projections with `kind: 'command'`: `projection.ts` defines hand-authored `CommandBridgeProjection` entries (`command-spec-kit`, `memory:save`, `command-memory-save`, `create:agent`, `create:manual-testing-playbook`) plus a generated block of command bridges, and both the SQLite and filesystem projection loaders append the routing-enabled bridges to the skill list. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:75-151] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1127] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1205]

8. The generated command inventory is produced by `runtime/scripts/command-bridges/derive-command-bridges.cjs` from per-skill `command-metadata.json` files plus a hand-maintained `allow-list.json`; the generated summary reports 19 command-metadata entries, 8 allow-list entries, 27 generated bridges, with TypeScript-active count 5 and Python-active count 15 — most generated bridges are `routingEnabled: false`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:28-40] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:1-10]

9. No doctor command participates in that surface today: `projection.ts` contains zero `doctor` references and zero `command-doctor-*` ids, and the only `doctor` mention in the advisor runtime source is the comment describing the tune proposal validator. `.skilled/commands/doctor/` itself carries no `command-metadata.json`, so the derive script has no input for it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:108-109] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts]

10. Command recommendations are rank-adjusted: in fusion ordering, a recommendation with `kind === 'command'` is demoted by 0.08 when the prompt does not itself contain a `/` character, so natural-language prompts do not float command bridges above skills by accident. This is the existing guard the doctor design must respect. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:776-777] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/types.ts:47]

11. A doctor-side contract for exactly this scoring surface already exists: the explicit lane's `PHRASE_BOOST_BOUND = { min: -1.0, max: 2.0 }` is documented as the same range the doctor skill-advisor proposal validator enforces via `phrase_boost_range` in `.skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml` — so `/doctor:skill-advisor` is already the sanctioned tuning surface for advisor phrase boosts and negative disambiguation. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:107-112] [SOURCE: .skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml]

12. Command bridges have a drift guard: `runtime/tests/command-bridges-drift-guard.vitest.ts` compares the generated projection, the generator dump and the allow-list, which is the natural CI seam for admitting doctor bridges and asserting they stay byte-stable. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts:1-40]

## Ruled Out

- Treating `SKILL.md` frontmatter `trigger_phrases` as a routing input for doctor commands: the runtime does not read them; only `graph-metadata.json` and gated doc frontmatter feed routing.
- Assuming commands and skills are surfaced by the same pipeline with no distinction: commands enter as `kind: 'command'` projections with per-bridge `routingEnabled` flags and a slash-presence rank adjustment.

## Dead Ends

- None this iteration; all targeted reads resolved.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none; the `.skilled/commands/doctor/assets/` inventory was readable, but its per-route contents were deferred to a later iteration.
- Partial success: none.

## Sources Consulted

- .skilled/bin/skill-advisor.cjs
- .skilled/skills/system-skill-advisor/SKILL.md
- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/weights-config.ts
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json
- .skilled/skills/system-skill-advisor/runtime/tests/command-bridges-drift-guard.vitest.ts
- .skilled/commands/doctor/assets/doctor-skill-advisor-tune.yaml (existence)

## Assessment

- New information ratio: 0.92
- Questions addressed: advisor resolution pipeline (Q1); command-vs-skill surfacing (Q4, foundational half)
- Questions answered: Q1; Q4

## Reflection

- What worked and why: reading the source seam by seam (shim → skill contract → hook → lane → projection) exposed the command-bridge mechanism that documentation alone understates; the projection's generated block answered the "how are commands surfaced" question directly.
- What did not work and why: nothing failed; the only gap is deliberate — `_routes.yaml` content, doctor command shapes and measured advisor outputs remain unread.
- What I would do differently: pull the measured advisor outputs earlier, in parallel with architecture reading, so later design analysis rests on observed behavior sooner.

## Recommended Next Focus

Run the required measurement set: at least ten plain-word setup/health prompts (including every example from the research topic) through `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"..."}' --format json`, capture the raw envelopes, and classify outcomes (route, no-match, skipped, degraded).
