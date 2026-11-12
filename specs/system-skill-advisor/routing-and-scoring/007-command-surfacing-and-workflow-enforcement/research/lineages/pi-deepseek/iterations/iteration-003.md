# Iteration 3: Output contract — what the model actually receives

## Focus

Angle 3 (output contract): what `advisor_recommend` returns over JSON, what the brief renders into model context, and whether the stated 80-120 token budget bounds what is emitted. Chosen because iterations 1-2 established that the inventory and scorer know more than they emit; this iteration pins the exact boundary where the command disappears.

## Actions Taken

1. Read the public output schema (`AdvisorRecommendationSchema`, `AdvisorRecommendOutputSchema`) and checked strictness.
2. Read `renderAdvisorBrief()` end to end, including both sentence forms and the fallback.
3. Measured the emitted brief's composition against the declared token caps.

## Findings

1. The public recommendation object is a closed set of 13 fields — `skillId`, `score`, `confidence`, `uncertainty`, `dominantLane`, `laneBreakdown?`, `why_recommended?`, `matchedDocs?`, `redirectFrom?`, `redirectTo?`, `heldBelow?`, `status?`, `workflowMode?`, `compiledRoute?` — and the schema is `.strict()`, so a new `kind` or runnable field cannot appear without a schema change [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:294].

2. There is no `kind` and no runnable-command field anywhere in the public response; the only command-adjacent field is the optional `workflowMode`, which names a hub mode rather than a slash command [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:307]. The internal `AdvisorRecommendation.kind` seen in iteration 2 is dropped at this boundary because it is optional and not in the schema [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:41].

3. The brief has exactly two sentence forms and one fallback. Normal: `Advisor: {freshness}; use {label} {confidence}/{uncertainty} pass.`; ambiguous: `Advisor: {freshness}; ambiguous: {label} c/u vs {label} c/u pass.` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:567]. The operative verb is "use" in both, so the brief never instructs the model to run anything, and it never asks a question.

4. A non-doctor recommendation renders as its skill label or raw id, never as a command: `topLabel` is `doctorCommandString(top.skill)` for doctor ids and `sanitizeSkillLabel(metadataSkillLabel(result) ?? top.skill)` otherwise, and the `Also:` companion line is only emitted for a recommendation that has a doctor command string [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:507]. The brief therefore has no syntax that could express "the matching command is /speckit:plan" for the 28 non-doctor commands.

5. The declared budget is `DEFAULT_TOKEN_CAP = 80`, `AMBIGUOUS_TOKEN_CAP = 120`, `MAX_TOKEN_CAP = 120`, with `TOKEN_TO_CHAR_ESTIMATE = 4` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:99].

6. The cap does not bound the emitted brief: `capWithCompanion(head, …)` caps only the routing head, and `DIRECTIVES_LABEL + HYGIENE_DIRECTIVE` (13 + 205 = 218 characters ≈ 54 tokens) is appended after the cap [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:569]. Worst case the brief reaches 80 + 54 ≈ 134 tokens, and in the ambiguous branch 120 + 54 ≈ 174 tokens — above both the stated 80 and the maximum 120.

7. Measured composition: a typical normal brief is 268 characters ≈ 67 tokens, of which the routing head is 50 characters ≈ 13 tokens. So the routing payload — everything the model is supposed to act on — is about a fifth of the brief, and the directive block dominates it. There is room to add roughly one command line without raising the cap [INFERENCE: from the 50-character observed head and the 320-character head cap in render.ts:99].

8. The no-match fallback carries no command either: `Advisor: no skill matched.` plus, only for setup-shaped prompts, `For setup or health checks, run /doctor:setup.` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:589]. So the one place a command *is* named on a miss is hardcoded to a single doctor command.

9. Consumer side: the repository tells the model to emit `SKILL ROUTING: [result]` from whatever the brief said [SOURCE: AGENTS.md:69]. With a brief that can only say "use {label}", the model's only faithful output is a skill name — the contract itself forbids the model from reporting a command it was never told.

## Answer to the contract question

The minimum contract that lets a model act on a command, given the above, is four additions in one object: (a) `kind: 'command' | 'skill'`, already known at projection time; (b) `command`, the runnable string; (c) `policy: 'run' | 'ask'`, the run-or-ask verdict; (d) `ownerSkillId`, so the command and its mode skill can be named together. The brief format would then change from `use {label}` to `use {skill} → {command} ({policy})`. The token budget is *not* the blocker (finding 7); the schema strictness (finding 1) and the labelling branch (finding 4) are.

## Ruled Out

- "Raise the token cap to make room for commands": contradicted by the measurement — the routing head is ~13 tokens of an 80-token budget, and the one overrun comes from a directive appended outside the cap. Raising the cap would grow the directive budget, not the command payload.
- "Emit the command only when the skill is a command owner": this is what the doctor companion line already does, and it cannot express the mapping for non-doctor commands because no non-doctor id has a command string to give.

## Dead Ends

- None unresolved. The single open thread is that `workflowMode` exists publicly but is unpopulated for command bridges; whether it is the intended carrier is a question for the skill-linkage angle, not this one.

## Edge Cases

- Ambiguous input: "80 to 120 token brief" could mean the head cap or the emitted brief. Selected interpretation: both, reported separately — 80/120 is the head cap; emitted brief is up to head cap + 54.
- Contradictory evidence: the spec says the brief prints raw bridge ids "outside the doctor family"; the code shows it prints `metadataSkillLabel ?? skillId`, which is a skill label when the payload carries one and the id otherwise. Both are consistent only when the payload has no label. Resolved: the leak is conditional on a missing `skillLabel`, and the id is the fallback.
- Missing dependency: none; no CLI run was needed, which avoided writing advisor cache/database files outside this lineage.
- Partial success: none.

## Questions Answered

- What must the advisor_recommend output contract carry (kind, runnable, brief wording, token budget) for a model to act on a surfaced command instead of a raw bridge id?

## Questions Remaining

- 7 of 9 remain open.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts
- .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts
- .skilled/skills/system-skill-advisor/runtime/lib/render.ts
- AGENTS.md
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/spec.md

## Assessment

- New information ratio: 1.0
- Questions addressed: Q3 (output contract)
- Questions answered: Q3
- Findings: 9, all new

## Reflection

- What worked and why: reading the schema before the renderer showed the boundary is a closed strict object, which turns "add a kind field" from a one-line patch into a schema change plus a renderer branch. Measuring the brief's composition turned the token-budget worry into a non-issue and stopped a plausible but wrong recommendation (raise the cap).
- What did not work and why: I expected to run the advisor CLI to capture a live brief; that would write cache/database state outside this lineage's write surface, so it was replaced by reading `renderAdvisorBrief` and computing the composition. The static path gave more detail than a single sample would have.
- What I would do differently: check `metadataSkillLabel`'s producer earlier — the raw-id claim depends entirely on whether the payload carries a label, and that is one grep away.

## Recommended Next Focus

Angle 4 (run or ask): read the command definitions' side-effect surfaces (`allowed-tools` frontmatter, what each command writes) and the existing sentinel/confirmation patterns (e.g. `/deep:research:confirm`, doctor's mandatory input gate) to judge which commands are safe to start unprompted. Carry forward: the contract addition needs a `policy` value, and its vocabulary should come from that evidence rather than invention.
