# Iteration 3: Model-visible command contract

## Focus

Investigate Angle 3: what a command recommendation needs to show so a model can resolve the correct front door and subsequent workflow. The reducer's Next Focus remains Q1 on inventory authority, while the dispatched topic orders output contract next; I followed Angle 3 and recorded the focus conflict for later synthesis.

## Findings
1. The current brief presents Advisor status, a top label and confidence/uncertainty; it can include a doctor-command companion, and an expanded ambiguous result names two candidates. Tests confirm the concrete strings. This is useful, but it does not name route effects or whether to load, run, ask, or abstain. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:493-564] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:48-64]

2. Runnable command labels are mapped only for doctor bridge ids. Generic recommendation labels fall back to a sanitized skill label or id, and the companion search recognizes only doctor commands. To surface all 45 commands, resolve the visible label from normalized command metadata and include its exact runnable form. The existing doctor map supports this pattern, but its fixed family scope contradicts using it unchanged for all commands. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:109-149] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:218-230] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:517-523]

3. The hook contract says the brief is advisory and never replaces explicit skill loading; AGENTS Gate 2 separately says a confidence of at least 0.8 must invoke the skill and that explicit user direction can route it. The brief should distinguish “load this workflow now” from “ask which route/target” and from “recommend only.” Advisory-only behavior supports safe separation; the must-invoke rule contradicts leaving high-confidence command matches as passive suggestions. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21] [SOURCE: AGENTS.md:63-70]

4. The renderer has a two-candidate ambiguous form and sanitizes instruction-shaped labels, while its token budget can omit a companion command. A contract should preserve the unresolved alternative or explicitly mark it truncated, expose typed confidence only, and avoid free-form reasons or raw prompts. Sanitization and the ambiguity form support this; the cap-dropping companion line is evidence against assuming every alternative survives. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:474-476] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:517-526] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:529-563]

5. The no-match or outage path adds a single /doctor:setup hint only for setup and health wording. The prior packet explicitly rejected placing a full route table in every fallback. Keep fallback prompt-specific and bounded, with a clean abstention when no route passes; the targeted setup hint supports a narrow fallback, while the static-list rejection contradicts generalizing it to all 45 commands. [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:39-43] [SOURCE: specs/system-skill-advisor/routing-and-scoring/003-doctor-command-surfacing/001-doctor-command-guidance/research/research.md:178-179]

## Ruled Out

- Using bridge ids as visible labels for every command; the current renderer maps runnable strings only for doctor bridges.
- Adding a static table of all commands to every fallback; the prior packet rejected universal route guidance in the fallback.

## Dead Ends

- None established. Current output coverage beyond doctor routes remains to be traced through invocation mechanics and measured against real prompt contexts.

## Edge Cases

- Ambiguous input: The reducer's Next Focus still identifies Q1 inventory authority, while the explicit ten-angle sequence advances from scoring to output contract. Followed Angle 3 and retained Q1 for synthesis.
- Contradictory evidence: The hook calls the brief advisory and says explicit loading remains necessary; AGENTS Gate 2 requires invocation when the confidence gate passes. The output needs to state which phase the model must perform.
- Missing dependencies: None for this angle.
- Partial success: Current rendering behavior and prior recommendations are clear; the exact run-or-ask contract will be investigated in Angle 4.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/lib/render.ts:109-149, 218-230, 474-476, 493-564
- .skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts:48-64
- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:21-43
- AGENTS.md:63-70
- specs/system-skill-advisor/routing-and-scoring/003-doctor-command-surfacing/001-doctor-command-guidance/research/research.md:156-179
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:194-195

## Assessment

- New information ratio: 0.80 (three findings expand the contract beyond doctor output; two refine the prior doctor rendering guidance).
- Questions addressed: Visible command identity, runnable label, confidence, ambiguity, sanitization, and recommendation versus action.
- Questions answered: None fully. Run-or-ask policy and general command rendering mechanics are separate angles.

## Reflection

- What worked and why: Reading both the renderer and its tests exposed the exact user-visible string, token cap behavior and the special-case doctor mapping; hook and AGENTS sources revealed the advice/action tension.
- What did not work and why: The existing renderer's label abstraction makes most commands display through a generic skill label; it does not reveal a complete command contract outside doctor.
- What I would do differently: Compare the same output fields across every runtime adapter before defining the shared schema.

## Recommended Next Focus

Angle 4: distinguish explicit typed commands, high-confidence plain-chat routes, ambiguous targets and mutations; identify which should load automatically and which must ask before acting.
