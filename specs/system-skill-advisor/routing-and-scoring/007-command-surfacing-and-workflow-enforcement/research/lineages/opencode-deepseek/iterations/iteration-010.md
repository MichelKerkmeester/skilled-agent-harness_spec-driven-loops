# Iteration 10: Failure modes and their controls

## Focus

Angle 10 (failure modes): over-triggering, command-versus-skill ambiguity, a dispatched child session starting commands by itself, loops, and the brief budget.

## Actions Taken

- Read the ambiguity module and the doctor-bridge ordering rule.
- Read the child-dispatch exemption in the framework rules.
- Checked the advisor self-recommendation penalty and the directive dedup.
- Reused the measured `/speckit:plan` ambiguity and the brief budget arithmetic from earlier iterations.
- Checked the no-slash penalty and the read-only gate against the over-trigger risk.

## Findings

1. Command-versus-skill ambiguity is by construction for non-doctor commands: `/speckit:plan a new feature for the login page` returns `command-spec-kit` at 0.82/0.20 and `system-spec-kit` at 0.82/0.18, which the ambiguity module treats as a tie because both gaps are within the 0.05 margins. The brief says "ambiguous" but carries no precedence rule for a command against its owner skill. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:5] [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/opencode-deepseek/iterations/iteration-003.md:17]

2. Doctor bridges have a precedence rule that non-doctor bridges lack: a typed doctor command puts its own bridge first, a passing doctor bridge is placed after passing skills, and doctor bridges are removed before skill ambiguity and abstention are computed. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:914] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1225]

3. A dispatched child session is the highest unsafe-run risk. `AI_SESSION_CHILD=1` marks a non-interactive worker whose Gate 3 pre-resolves, and Law 4, Halt Conditions, Logic-Sync, Escalation and stop-for-yes become record-and-continue. A child that receives a "run command" brief can therefore start a mutating command with no user to answer the ask. [SOURCE: AGENTS.md:84]

4. The loop risk is real but only partly controlled. Gate 2's artifact trigger fires before every code or Markdown write, and command workflows write files, so a command workflow can re-enter routing on its own writes. Directive-lifecycle dedup suppresses a repeated brief to the same session, but it does not suppress repeated routing decisions. [SOURCE: AGENTS.md:68] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:40]

5. The only anti-self-recommendation control is a -0.25 penalty against the advisor's own ids on audit or explainer prompts. It prevents the advisor from recommending itself, not a command workflow from routing back into the advisor. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:237]

6. Over-triggering is partly controlled: the no-slash penalty lowers every command candidate by 0.08 when the prompt has no slash, and the read-only gate keeps mutating commands at the explainer floor. The highest over-trigger surface is the doctor `lead_phrases` rule, which intentionally puts a passing bridge ahead of a passing skill; measured `disable comment hygiene gate` led with `/doctor:git hooks`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1197] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:48]

7. The brief budget tolerates one command line and one policy marker; a third consequence line would compete with the fixed directive block and the ambiguity head inside the 120-token cap. The priority order should be command, then policy, then consequence only when space remains. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:97] [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/opencode-deepseek/iterations/iteration-003.md:25]

8. Recommended controls: a same-owner precedence rule for command-versus-skill ties; a child authority scope in which a child may run only read-only or add-only commands and needs an explicit parent directive for mutating commands; a route-once guard per turn and command; a lead-phrase allowlist limited to diagnostic phrases; and a brief line order of command, policy, consequence. [INFERENCE: from findings 1-7]

9. Evidence against a blanket "command always wins" precedence: in the measured `/speckit:plan` case the skill has the lower uncertainty (0.18 against 0.20), so a command-first rule would override the better-calibrated candidate; the rule must be scoped to a command and its own owner skill, where the two are the same workflow wearing two names. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/opencode-deepseek/iterations/iteration-003.md:17]

## Ruled Out

- A blanket command-first tiebreak: it would override a better-calibrated skill in the measured `/speckit:plan` case.
- Relying on directive dedup as the loop guard: it suppresses repeated briefs, not repeated routing.
- Letting a child inherit the full run-or-ask policy: the child exemption removes the ask path, so mutating commands need a parent-authority rule.

## Dead Ends

- Looking for a general command loop guard in the advisor: only the self-recommendation penalty and directive dedup exist, and neither is a routing-loop guard.

## Edge Cases

- Ambiguous input: "loops" could mean a workflow re-entering itself or a model repeatedly routing; the selected interpretation is routing re-entry, and workflow self-recursion is out of scope.
- Contradictory evidence: doctor lead phrases both improve diagnostic reach and raise over-trigger risk; the resolution is to keep them diagnostic-only and verify each with the phrase-reach tool.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts:5`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:914,1197,1225`
- `AGENTS.md:68,84`
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:40`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:237`
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:48`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:97`
- Iteration 3 measurements in this lineage

## Assessment

- New information ratio: 0.85
- Questions addressed: Which failure modes matter most: over-triggering, command-versus-skill ambiguity, a dispatched child session starting commands by itself, loops, and the brief budget?
- Questions answered: Which failure modes matter most: over-triggering, command-versus-skill ambiguity, a dispatched child session starting commands by itself, loops, and the brief budget?

## Reflection

- What worked and why: combining the measured `/speckit:plan` ambiguity with the child-dispatch exemption exposed a policy hole that neither the scoring nor the run-or-ask angle saw alone.
- What did not work and why: searching for a routing-loop guard found only the advisor self-penalty; the loop risk is emergent from Gate 2 and command writes, not a named control.
- What I would do differently: run one command workflow with routing enabled to observe whether its own writes trigger a second brief; that would turn the loop risk from inference into measurement.

## Recommended Next Focus

All ten angles are covered. Synthesis should consolidate the recommendations, keep the disagreements visible, and mark the remaining uncertainty: no measured command-recall baseline, and no observed child-session command start.
