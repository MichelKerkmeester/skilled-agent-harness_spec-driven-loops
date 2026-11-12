# Iteration 10: Failure modes — the guards the design needs

## Focus

Angle 10 (failure modes): over-triggering, command/skill ambiguity, child sessions starting commands, loops, the brief budget, dormant hooks, and dangling linkage — each with the evidence gathered across nine iterations and the cheapest test that would catch it. Last research iteration before synthesis under `stopPolicy: max-iterations`.

## Actions Taken

1. Checked whether the advisor path honours the child-session flag that the Gate-3 spec gate implements.
2. Read the ranking guard that keeps passing skills above doctor bridges and the `lead_phrases` validation.
3. Collected every latent dangling reference found in iterations 1-9 and checked which guard covers it.

## Findings

1. **Child sessions are ungated in the advisor path.** The spec gate implements `CHILD_SESSION_ENV = 'AI_SESSION_CHILD'` with `isChildSession(env)` and makes Gate 3 a no-op for a dispatched child [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs:101], but the advisor hook library contains no equivalent check — no `child`, `CHILD` or `lineage` guard exists in `hooks/lib` or the Claude adapter [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:190]. So a dispatched child (this lineage, for example) still receives advisor briefs, and a rule that says "run the command when the brief names one" would let a child start commands by itself — the exact failure the spec names.

2. **Over-triggering already has two guards.** `keepPassingSkillsAboveDoctorBridges()` demotes a doctor bridge below any passing skill unless one of its `lead_phrases` matches the prompt [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:945], and the deriver rejects a `lead_phrases` entry that is not also in `trigger_phrases` [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:328]. Both guards are doctor-only today, so generalising them is cheaper than inventing new ones.

3. **Bare-command recall is bounded by design.** `default_target` is allowed at most once per command, only on a multi-target command, and never on a mutating route, so a bare typed command never suggests a destructive target [SOURCE: .skilled/commands/doctor/_routes.yaml:52]. That is the existing precedent for "one safe entry point per command".

4. **Ambiguity is first-class but skill-shaped.** The output carries `ambiguousWith`, `heldBelow` and a 120-token ambiguous brief form (iteration 3), and the baseline scores ambiguity top-1 at 20/24 with tau 0.03 [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1]; none of that machinery mentions commands, so a command/skill tie has to be expressed as a skill tie until the contract changes.

5. **A brief-to-command rule creates a real cycle.** `/doctor:skill-advisor tune` itself runs `advisor_recommend` and `advisor_validate` [SOURCE: .skilled/commands/doctor/_routes.yaml:110]. If a brief can cause a command run, and a command can call the advisor, the graph is cyclic and nothing in the hooks counts depth or suppresses a re-entry.

6. **The budget is headroom, not cap.** The routing head is capped at 80 tokens (120 ambiguous) and the 218-character directive rides outside the cap (iteration 3), so one added `→ /command (ask)` clause fits inside the existing 320-character head budget and does not require a cap change [INFERENCE: from the measured 50-character typical head and the 320-character cap].

7. **Dormant delivery turns a rule into a dead letter.** Cursor documents its dynamic adapter as dormant under the tested build and routes from a static rule (iteration 9), so any instruction conditioned on "when the brief names a command" silently does nothing on Cursor and Devin. The rule needs an explicit no-brief branch that asks the advisor directly [SOURCE: .cursor/rules/skill-routing.md:18].

8. **Dangling linkage is checked for ids and not for owners.** The bridge-resolution guard sweeps slash ids in aliases, phrase boosts and the Python scorer for dead commands [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-bridge-resolution-guard.vitest.ts:1], yet nothing checks `ownerMode`: `sk-create-skill-parent` has no `SKILL.md` (iteration 7), `/memory:save` and `/spec_kit` have no command file (iteration 1), and 18 doctor bridges have no benchmark row (iteration 8). Three dead-reference classes, one guard.

## Answer to the failure-mode question

Seven guards, each with an existing precedent to extend rather than a new mechanism to invent: (1) gate command-starting on `isChildSession` exactly as the spec gate does; (2) generalise `keepPassingSkillsAboveDoctorBridges` and `lead_phrases` to every command, not just doctor; (3) reuse the `default_target` rule as the "one safe entry point" constraint for bare commands; (4) extend `ambiguousWith`/`heldBelow` to express command-versus-skill ties instead of skill-only ties; (5) add a depth guard so a command that calls the advisor cannot re-enter the brief, since `/doctor:skill-advisor tune` closes that loop today; (6) keep the command clause inside the existing head cap and never inside the directive; (7) make every rule carry a no-brief branch, because at least one runtime documents its dynamic path as dormant. The measurement for all seven already has a home: iteration 8's `wrong_command_rate` catches (2)-(3), `policy_precision` catches (1) and (4), and a resolver test extended to `ownerMode` catches (8's) three dead-reference classes.

## Ruled Out

- A separate "command loop breaker" subsystem: the cycle is one command calling the advisor, so a depth counter at the brief boundary is enough.
- Relying on the ambiguity brief form for command ties: it takes two skill labels and has no slot for a command string.

## Dead Ends

- Searching for an existing depth counter or re-entry guard in the hook stack: none. The only cycle protection in the tree is the fan-out lineage's own tool budget.

## Edge Cases

- Ambiguous input: "child sessions starting commands by itself" could mean a sub-agent of the main session or a CLI lineage. Selected interpretation: any process carrying `AI_SESSION_CHILD=1`, which is the flag the repository already defines.
- Contradictory evidence: iteration 5 concluded no runtime lets a model start a command, and this iteration shows a child could start one through a *rule* rather than a tool. Both stand: the capability is instruction-level, not tool-level, which is why the guard must be instruction-level too.
- Missing dependency: no runtime was executed, so the Cursor dormancy and the child-brief delivery are read from source and documentation, not observed.
- Partial success: none.

## Questions Answered

- What prior art exists for routing free text to a packaged workflow, and which failure modes (over-trigger, command/skill ambiguity, child sessions starting commands, loops, brief budget) must a design guard against? (This iteration closes the failure-mode half; iteration 9 closed the prior-art half.)

## Questions Remaining

- None of the nine key questions remains open. Two carry-forward uncertainties are recorded for synthesis: whether doctor YAML workflows load their `skill_agent` skill (iteration 7 edge case), and whether the child-session brief is delivered in practice on each runtime (this iteration's missing dependency).

## Sources Consulted

- .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs
- .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs
- .skilled/commands/doctor/_routes.yaml
- .skilled/skills/system-skill-advisor/runtime/tests/command-bridge-resolution-guard.vitest.ts
- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json

## Assessment

- New information ratio: 1.0
- Questions addressed: Q10 (failure modes)
- Questions answered: Q10
- Findings: 8, all new

## Reflection

- What worked and why: looking for the child-session flag in the spec gate and then in the advisor hook produced the packet's most consequential asymmetry — Gate 3 guards children, the advisor does not — in two greps. Reading the doctor route manifest again for the cycle case found a concrete command that calls the advisor, which turns "loops are a risk" into a named cycle.
- What did not work and why: I expected an existing depth guard or re-entry counter somewhere in the hook stack; there is none. That absence is the finding, but the search cost two calls.
- What I would do differently: check every guard that exists for Gate 3 and ask which of them the advisor shares — one comparison against the sibling hook would have produced findings 1 and 8 together.

## Recommended Next Focus

Synthesis only: no further research iteration is planned under `stopPolicy: max-iterations`. The merge should carry the four carry-forward uncertainties explicitly rather than resolving them silently.
