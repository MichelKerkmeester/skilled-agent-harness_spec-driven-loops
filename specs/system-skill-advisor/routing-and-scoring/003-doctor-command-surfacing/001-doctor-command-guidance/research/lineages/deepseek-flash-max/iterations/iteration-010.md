---
title: "Iteration 10: Ranked recommendations and implementation phases"
trigger_phrases: []
---
# Iteration 10: Ranked recommendations and implementation phases

## Focus

Answer Q10: assemble the ranked recommendation set and the phased implementation plan from the accepted mechanisms, guards, entry point and test design. This is the final research iteration before synthesis.

## Actions Taken

- Ranked the accepted design elements by user value, structural cost and risk, using the evidence from iterations 1-9.
- Sequenced them into phases with explicit gates and rollback, respecting the existing CI surfaces.

## Findings

1. R1 (highest value, lowest risk): build the doctor golden slice first. Add onboarding, diagnostics, control and ambiguity cases seeded from this lineage's measured envelopes to the existing routing-accuracy corpus and capture a fresh baseline; this turns every later phase into a measurable claim and reuses the existing capture script, pinned environment and bounded-delta gate. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json:1-16]

2. R2: ship one onboarding umbrella command (`/doctor:setup`) as a single-route, read-only battery composed from the existing checks (`sk-code-setup-check.cjs`, `git-setup-check.cjs`, advisor status, mirror `--check`, trigger-index `--check`), so the measured empty onboarding phrases have one unambiguous destination. [SOURCE: .skilled/commands/doctor/_routes.yaml:228-247] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter2-01.json]

3. R3: admit doctor routes through the supported command-bridge pipeline, generated from `_routes.yaml` so the manifest stays canonical. Per-route allow-list entries carry distinct ids (`command-doctor-git-setup`, ...) and target phrases land in `scoring-compatibility.json`; regeneration writes both TypeScript and Python projections, and the drift guard plus route-validate keep the set consistent. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:100-130] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:240-290]

4. R4: stage the phrase admission. Wave A is the measured empty phrases with zero theft risk (`disable comment hygiene gate` -> `/doctor:git hooks`, `runtime mirror drift` -> `/doctor:runtime-mirrors`, `skill budget audit` -> `/doctor:skill-advisor skill-budget`); Wave B is the contested phrases where the doctor diagnostic is the deliberate winner (`check my git hooks` family), admitted one route at a time with the ownership pin. [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-05.json] [SOURCE: specs/system-skill-advisor/034-doctor-command-guidance/research/lineages/deepseek-flash-max/events/measure-iter6-doctor-02.json]

5. R5: render fully qualified names. Each admitted bridge's rendered `name` must be the runnable `/doctor:<command> <target>` string, because the doctor routers refuse inferred targets and the brief label is what the model and user see. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:439-447] [SOURCE: .skilled/commands/doctor/git.md:13-18]

6. R6 (complement, not substitute): add exactly one bounded fallback sentence naming the doctor entry surface when no skill matched, deployed only after the umbrella exists so it points at something real; keep the directives block intact. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:476-487]

7. R7 (maintenance): refresh the stale documentation in the same change set - the `validation-baselines.md` dated numbers and the `_routes.yaml` "Consumed by" comment once a harvester or generator consumes it - so the next reader is not misled about which mechanisms are live. [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:45-59] [SOURCE: .skilled/commands/doctor/_routes.yaml:14-21]

8. Phase 1 - Measurement harness: author the doctor slice files and capture the baseline; gates are only that the capture is reproducible and the control slice records the current incumbent behavior; no runtime change, so rollback is deleting the slice. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs]

9. Phase 2 - Onboarding umbrella: author the command (router markdown, presentation asset, workflow battery, route entry, catalog row and count), then admit the `command-doctor-setup` bridge and regenerate; gates: route-validate green, drift guard green, onboarding slice 9/9 top-1 to the umbrella, controls unchanged, bounded-delta rows honored; rollback removes the route and bridge entries and regenerates. [SOURCE: .skilled/commands/doctor/scripts/route-validate.sh:1-30] [SOURCE: .skilled/commands/README.txt:46]

10. Phase 3 - Per-route diagnostics in two waves (empty phrases, then contested phrases with owner sign-off), each wave gated by the diagnostics slice and the reach probe pinning the declaredBy/phrase/wonBy triple; Phase 4 - guidance surface (fallback sentence, name formatting) plus the documentation refresh. Every phase lands with the same three structural gates and the outcome slice. [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs:24-70] [SOURCE: .skilled/skills/system-skill-advisor/references/scoring/validation-baselines.md:63-75]

## Ruled Out

- Reordering the phases to ship the umbrella before the harness: without the slice, the umbrella's admission cannot be distinguished from theft or a tie.
- Deferring the harness to the end: it is the gate for every other phase.

## Dead Ends

- None.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ (baseline and capture script)
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs
- .skilled/skills/system-skill-advisor/runtime/lib/render.ts
- .skilled/commands/doctor/_routes.yaml
- .skilled/commands/doctor/scripts/route-validate.sh
- .skilled/commands/README.txt
- events/measure-iter2-01.json, measure-iter6-doctor-02.json, measure-iter6-doctor-05.json

## Assessment

- New information ratio: 0.65
- Questions addressed: recommendations and phases (Q10)
- Questions answered: Q10

## Reflection

- What worked and why: ranking by measured gap and available seams produced an order where each phase is gated by the previous one's artifacts.
- What did not work and why: synthesis-heavy iteration; the only new material is the phase sequencing itself.
- What I would do differently: nothing material - the earlier iterations produced exactly the evidence this one needed.

## Recommended Next Focus

None remaining: every strategy key question is answered. The synthesis phase compiles the final report, resource map and ranked recommendations.
