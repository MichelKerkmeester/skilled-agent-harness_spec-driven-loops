---
title: "Iteration 5: Feed mechanism design for doctor routing vocabulary"
trigger_phrases: []
---
# Iteration 5: Feed mechanism design for doctor routing vocabulary

## Focus

Answer Q5: should `_routes.yaml` trigger phrases feed the advisor, and through which mechanism? Weigh the four candidate mechanisms against the code evidence from iterations 1-4 and the scoring semantics a feed would land in.

## Actions Taken

- Read `lib/scorer/text.ts` phrase-specificity semantics used by the explicit lane's author-signal scoring.
- Confirmed where bridge keywords/intentSignals enter scoring (`lib/scorer/lanes/explicit.ts:358-376`).
- Read `lib/render.ts` brief rendering to determine how a command-kind recommendation reaches the user.
- Compared four admission mechanisms against the observed pipelines (harvesters, command bridges, explicit boosts).

## Findings

1. A fed phrase would score by `phraseSpecificity`: one token = 0.7, each extra token +0.18, capped at 1.0. A three-token doctor phrase like `check my git hooks setup` therefore scores 1.0 on an exact mention, the same order as the hand-written command boosts. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts:71-74]

2. Bridge `keywords` and `intentSignals` are consumed inside the explicit-author lane: for every projection skill (including command bridges), each phrase that appears with a word boundary adds `phraseSpecificity` to that id and records `author:<phrase>` evidence. Admission is therefore not a new scoring path; it reuses the strongest existing lane. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:358-376]

3. Command-kind recommendations do not ride a slash bonus: fusion demotes a `kind: 'command'` candidate by 0.08 when the prompt contains no `/`, so a doctor bridge reached from natural language starts with a small handicap. The handicap is uniform across all command bridges and does not block a strong phrase match. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:776-777]

4. Rendering carries the kind through and renders a label: the brief line is `Advisor: <freshness>; use <label> <confidence>/<uncertainty> pass.` with the label resolved from metadata or the recommendation name, and prepared commands keep `kind: 'command'`. A doctor bridge's rendered `name` is therefore what the user actually sees, so it should be the runnable command form (e.g. `/doctor:git setup`), not an internal bridge id. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:170] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:439-447]

5. Mechanism A - extend the harvesters to parse `_routes.yaml`: rejected. Both harvesters are hard-scoped to skill roots and the `references`/`assets` subdirs (Python `SKILLS_DIR` + `_DOC_HARVEST_SUBDIRS`; TS `HARVEST_SUBDIRS`), so this needs a new root, a new file type, YAML parsing in two languages, and new gate semantics, for a manifest that already documents the boundary as out of scope. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:44] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/doc-frontmatter.ts:170]

6. Mechanism B - hand-write `PHRASE_BOOSTS` entries for doctor phrases: rejected as the primary path. It is a supported code path, but it bypasses the command inventory, the generated projections, Python parity and the drift guard, and it silently changes scoring vocabulary outside the doctor tune flow; keep it for negative disambiguation only, where the tune contract (`phrase_boost_range`) already sanctions it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:107-200]

7. Mechanism C - admit doctor routes as command bridges through `allow-list.json` + `scoring-compatibility.json`: supported today. Allow-list ids are free-form (only non-empty string checks) while uniqueness is enforced per id, so `/doctor:git`'s three targets can take distinct ids such as `command-doctor-git-hooks` and `command-doctor-git-setup` without colliding; target phrases enter `keywords`/`intentSignals` and regeneration writes both TypeScript and Python projections. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:100-130] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:240-290]

8. Mechanism D - generate those admission inputs from `_routes.yaml` at build time so the manifest stays canonical: this is the recommended long-term shape. The manifest already carries `trigger_phrases` per route and the command docs carry `skill_agent` owner markers; route-validate.sh can assert the generated bridge set, and the drift guard keeps the projections byte-stable. [SOURCE: .skilled/commands/doctor/_routes.yaml:36-38] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:399-420]

9. The input gate constrains the rendered guidance: because doctor routers refuse to infer a target, the bridge entry for a routed target must render a fully qualified name (`/doctor:git setup`) and the phrase set must be target-specific; one bridge per *route*, not per command, is the correct granularity. [SOURCE: .skilled/commands/doctor/git.md:13-18]

10. Measured contrast to design against: `check my git hooks` routed to `sk-git` at 0.83 while the manifest already declares the near-identical `check my git hooks setup` phrase; the feed decision is therefore about arbitration (which id owns which phrase), not about inventing vocabulary. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-03.json] [SOURCE: .skilled/commands/doctor/_routes.yaml:285-289]

## Ruled Out

- Mechanism A (harvester extension) — new root and file type in two implementations for a manifest whose header documents the boundary.
- Mechanism B as primary (hand PHRASE_BOOSTS) — bypasses inventory, parity and drift guard; retain only for bounded negative disambiguation.
- One bridge per doctor command — target granularity is required for a runnable recommendation under the input gate.

## Dead Ends

- None; each mechanism has a concrete verdict.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/lib/scorer/text.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts
- .skilled/skills/system-skill-advisor/runtime/lib/render.ts
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs
- .skilled/commands/doctor/_routes.yaml
- events/measure-iter2-03.json

## Assessment

- New information ratio: 0.75
- Questions addressed: feed mechanism design (Q5)
- Questions answered: Q5

## Reflection

- What worked and why: scoring specifics (phrase specificity, author-signal consumption, render label) made the mechanism choice decidable on code evidence rather than preference.
- What did not work and why: nothing failed.
- What I would do differently: quantify arbitration margins with measurements before locking the phrase sets (moved to the next iteration).

## Recommended Next Focus

Collision and theft analysis: measure which skill-shaped prompts a doctor feed could steal, quantify the margins between doctor phrases and incumbent skills, and design the arbitration guards (phrase ownership, negative boosts, kind demotion, threshold policy).
