---
title: "Iteration 7: Onboarding entry point design"
trigger_phrases: []
---
# Iteration 7: Onboarding entry point design

## Focus

Answer Q6: should there be a dedicated onboarding or 'set up skilled' entry point, and how should it relate to the existing `/doctor:*` family? Ground the decision in the measured gap, the command-family conventions, and the maintenance surface a new command creates.

## Actions Taken

- Re-read the fallback renderer to confirm what a user sees when no skill matches.
- Inventoried `.skilled/commands/` and the doctor command set; read `commands/README.txt` doctor section and the catalog mirror checker.
- Read `/doctor:update` and `/doctor:mcp` routers for default-action and input-gate precedents.
- Compared four entry-point designs against the measured prompt set.

## Findings

1. The measured onboarding prompts have no owner and the fallback gives no guidance: for an unmatched prompt the hook renders only `Advisor: no skill matched.` plus the directives and hygiene block. There is no "try /doctor:..." sentence anywhere in the fallback path. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-487] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-01.json]

2. The manifest already sanctions single-route commands without positional targets: "A command that owns one route needs no positional target." A dedicated onboarding command therefore does not need to fight the target input gate that every multi-route doctor command has. [SOURCE: .skilled/commands/doctor/_routes.yaml:12]

3. A safe-default precedent exists in the family: bare `/doctor:update` runs the read-only `check` action, and bare `/doctor:env` renders a selection menu. A new umbrella command can run a read-only battery by default and still offer a menu. [SOURCE: .skilled/commands/doctor/update.md:6-13] [SOURCE: .skilled/commands/doctor/env.md:25-30]

4. No onboarding umbrella exists today: the command inventory has no `/setup`, and the doctor family is nine per-owner diagnostic commands (speckit, skill-advisor, deep-loop, runtime-mirrors, sk-code, git, mcp, update, env). Onboarding prompts currently have nowhere to land. [SOURCE: .skilled/commands/README.txt:46] [SOURCE: .skilled/commands/README.txt:158-171]

5. The batteries the umbrella would run already exist and are read-only: `sk-code-setup-check.cjs` (`--prompt`), `git-setup-check.cjs` (`--tool`), the advisor `advisor_status` probe, the runtime-mirror `--check` scripts and the trigger-index `--check`. An umbrella command composes existing checks; it does not need new diagnostics. [SOURCE: .skilled/commands/doctor/_routes.yaml:228-247] [SOURCE: .skilled/commands/doctor/_routes.yaml:204-212]

6. Option 1 (recommended): a new single-route `/doctor:setup` umbrella that runs the read-only battery across sk-code, git, advisor and runtime mirrors, prints repair commands per failing leg, and offers `list`/selection for scoped runs. It gives onboarding prompts one unambiguous target and matches how `/doctor:update` already defaults to a safe action. [SOURCE: .skilled/commands/doctor/update.md:6-13] [SOURCE: .skilled/commands/README.txt:166-171]

7. Option 2 (rejected): folding onboarding into `/doctor:skill-advisor` as another target. The ownership is wrong (the battery spans sk-git, sk-code, spec-kit and advisor), the input gate would require the user to name `onboard` anyway, and the measured phrase `help me set up skilled` would still need a bridge to bind it. [SOURCE: .skilled/commands/doctor/skill-advisor.md:13-19]

8. Option 3 (rejected as the sole answer): no new entry, only per-route bridges. Generic onboarding prompts have no single route, so the brief would have to pick arbitrarily among `/doctor:sk-code setup`, `/doctor:git setup` and others, or stay empty exactly as measured today. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-06.json]

9. Option 4 (complement): a bounded fallback sentence naming the doctor entry surface when no skill matched. It is cheap and helps on unmatched prompts, but it is static text injected on every empty result, so it must stay one short sentence and never grow into a routing table. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:110-118]

10. The two-layer relationship is: umbrella for onboarding intent, per-route bridges for specific diagnostics. The umbrella owns phrases like `help me set up skilled` and `is my repo set up right`; route-specific phrases like `check my git hooks` stay with their owner (`/doctor:git setup` or sk-git, a deliberate arbitration decision per the iteration 6 guards). [SOURCE: .skilled/commands/doctor/_routes.yaml:285-289] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-control-01.json]

11. Adding a command has a known maintenance cost: the repo-wide catalog carries the doctor group count (currently 9) and a per-command row, and `command-catalog-mirror-check.cjs` enforces catalog/mirror consistency; plus `_routes.yaml` and `route-validate.sh` for the route, plus the advisor admission. All three gates must move together. [SOURCE: .skilled/commands/README.txt:46] [SOURCE: .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs:202-220]

## Ruled Out

- Onboarding as a `/doctor:skill-advisor` target: owner mismatch and input-gate friction.
- Per-route bridges alone as the onboarding answer: no single route exists for the generic phrases.
- A full routing table in the hook fallback: static prompt-injected text must stay minimal.

## Dead Ends

- None; the design options have concrete verdicts.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/lib/render.ts
- .skilled/commands/doctor/_routes.yaml
- .skilled/commands/doctor/update.md
- .skilled/commands/doctor/env.md
- .skilled/commands/doctor/skill-advisor.md
- .skilled/commands/README.txt
- .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs
- events/measure-iter2-01.json, measure-iter2-06.json, measure-iter6-control-01.json

## Assessment

- New information ratio: 0.8
- Questions addressed: onboarding entry point design (Q6)
- Questions answered: Q6

## Reflection

- What worked and why: checking existing command conventions (single-route, default action, catalog mirroring) made the entry-point design a composition of existing patterns rather than a new invention.
- What did not work and why: nothing failed.
- What I would do differently: read the catalog checker before drafting the design so the maintenance cost lands in the first draft.

## Recommended Next Focus

Testing routing accuracy (Q8): design the golden-set harness on top of `router-reach`, `advisor_validate`, the drift guard and the measured envelopes, and specify the metrics and pass/fail gates for admitted doctor bridges.
