# Iteration 3: Output contract of the 80 to 120 token brief

## Focus

Angle 3 (output contract): what the model must see inside the 80 to 120 token brief to act on a command, given that `advisor_recommend` has no `kind` or `runnable` field and the brief prints raw bridge ids outside the doctor family.

## Actions Taken

- Read the brief renderer, token caps, label sanitizer, and the generated doctor command map.
- Read the recommendation output schema.
- Produced the actual brief text for four prompts: a doctor-shaped prompt, a literal planning command, a plain research prompt, and a read-only doctor phrase.

## Findings

1. The brief budget is 80 tokens by default and 120 tokens when the advisor reports ambiguity, with a hard cap of 120 and a 4-characters-per-token estimate. The fixed comment-hygiene directive block is appended to every brief after the capped head, so the routing sentence itself must stay well inside the cap. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:97] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:146]

2. The actionable brief has exactly one shape: `Advisor: live; use <label> <confidence>/<uncertainty> pass.` plus an optional `Also: <doctor runnable>` line. It carries no command kind, no argument hint, no run-or-ask verdict and no undo class. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:541]

3. When the top recommendation is a doctor bridge, the label is replaced by a generated runnable string from a 35-entry id-to-command map. Measured briefs rendered `Also: /doctor:env list` for "check my environment variables" and `/doctor:git hooks` for "disable comment hygiene gate". This map is the only id-to-runnable translation in the renderer. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:109] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:219]

4. For every non-doctor command the label falls back to `metadataSkillLabel(result) ?? top.skill`, which is the raw bridge id when no skill label is supplied. Measured: `/speckit:plan a new feature for the login page` produced `Advisor: live; ambiguous: command-spec-kit 0.82/0.20 vs system-spec-kit 0.82/0.18 pass.` The model sees a bridge id, not a runnable command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:511]

5. The recommendation payload has `skillId`, `score`, `confidence`, `uncertainty`, `dominantLane` and `status`, plus optional `workflowMode` and routing diagnostics, but no `kind` field, no `runnable` field and no `argumentHint`. A renderer therefore cannot ask the payload whether a recommendation is a command or whether starting it is safe. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:295]

6. A model needs four facts to act on a command: a runnable invocation string (command plus mode and required arguments), a discriminator against the skill that also passed, a run-or-ask verdict, and a one-line consequence or undo note. The current brief supplies only the label and two scores; the doctor map proves the runnable-string part fits the budget when the data exists. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:541]

7. The budget is not the blocker: the measured ambiguous head is about 86 characters, the full directive block about 205 characters, and a generic `Also: /speckit:plan <feature>` line is under 40 characters, all inside the 480-character ambiguous budget. The missing piece is structured command data, not space. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:185]

## Ruled Out

- Raising the token cap as the fix: the current omission is a data-contract gap, and the measured briefs fit comfortably inside the existing cap.
- Reusing the doctor map shape without a source: the map is generated from the doctor route manifest; a universal map needs an authoritative command manifest rather than a hand-written table.

## Dead Ends

- Hoping `workflowMode` fills the gap: it is optional in the schema and absent from the measured `/speckit:plan` output, so it cannot be relied on as the runnable command.

## Edge Cases

- Ambiguous input: "80 to 120 token brief" describes the default and ambiguity caps; both were measured and are reported separately.
- Contradictory evidence: none. The measured briefs match the renderer branches.
- Missing dependencies: no direct CLI command renders a brief, so the brief producer had to be called through its module entry point.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:97,109-148,185,219,511,541`
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:146`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:295`
- Measured briefs from `buildSkillAdvisorBrief` for four prompts

## Assessment

- New information ratio: 0.9
- Questions addressed: What must the advisor render inside the 80 to 120 token brief for a model to act on a command, given that advisor_recommend has no kind or runnable field?
- Questions answered: What must the advisor render inside the 80 to 120 token brief for a model to act on a command, given that advisor_recommend has no kind or runnable field?

## Reflection

- What worked and why: producing the real brief text for paired doctor and non-doctor commands made the difference visible in one line; the renderer's branches alone would not have shown that the planning brief says `command-spec-kit`.
- What did not work and why: the first call passed the prompt inside the options object, which returned no result; the function signature takes the prompt as its first argument.
- What I would do differently: measure a command brief that both passes and has a strong skill competitor for several command families, so the discriminator line can be specified precisely.

## Recommended Next Focus

Angle 4 (run or ask): which commands are safe to start without asking, which need a question first, and where the policy should live.
