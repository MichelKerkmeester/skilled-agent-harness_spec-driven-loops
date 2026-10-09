# Deep Research — Iteration 7

- Run: fanout-luna-max-fast-1791552201492-cjjo4q
- Focus: Close the surface coverage audit in the skill-advisor and compiled-routing probes
- Status: complete
- New information ratio: 1.0

## Focus

Does the existing benchmark and routing corpus cover each surface now supported by the two-axis hub?

## Actions Taken

- Re-read the full positive and negative probe lists in the skill-advisor scenario.
- Compared those surface labels with the current hub router and the compiled surface-bundle scenario.
- Rechecked Ponytail's task-tier reporting guidance as context for keeping surface classes visible in the measurement.

## Findings

1. **NEW:** The skill-advisor probe battery covers OPENCODE and WEBFLOW positive examples, but none for OBSIDIAN, even though the current hub and read-only Obsidian packet support that surface. Its 15 listed positives are all OPENCODE or WEBFLOW; the current compiled-routing test also has a Webflow surface-bundle case but no Obsidian case. Add a small Obsidian positive control, with the expected workflow-plus-surface bundle, to distinguish parent-skill accuracy from surface discovery. Ponytail reports results by task tier, which supports keeping surface classes visible rather than hiding their coverage in one total. Sources: specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:37-45; .skilled/skills/sk-code/hub-router.json:8-12,42-45; .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:27-42; .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:21-41; .skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md:29-35,44-61.

## Questions Answered

- Does the existing benchmark and routing corpus cover each surface now supported by the two-axis hub? **Answered:** The top-level advisor battery and compiled-routing scenario cover Webflow and OpenCode but lack an Obsidian surface positive; the proposed route-shape reporting should include one.

## Rejected Transfers

- Do not merge surface discovery into the advisor's top-1 identity score. Keep parent skill selection and the workflow-plus-surface route outcome as separate measurements.

## Assessment

The earlier route-matrix idea remains useful and now has a concrete missing class: Obsidian. The probe battery's negative controls still protect against unrelated doc and research tasks, while a new Obsidian positive would test a currently declared hub surface. This finding refines, rather than duplicates, iteration 4's recommendation to report internal route shapes and expected bundle sets.

## Reflection

A multi-surface router can look accurate while a supported surface never appears in its positive corpus. Reporting a total without listing positive coverage by surface would leave that hole invisible.

## Recommended Next Focus

Perform one final synthesis-oriented pass over the prior-recommendation classifications and newly found gaps. Promote no new finding unless it is independently evidenced and distinct from the route, validator, mirror, hook, benchmark, or Webflow-runtime findings already recorded.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/context/benchmarks/agentic/README.md:37-45
- .skilled/skills/sk-code/hub-router.json:8-12,42-45
- .skilled/skills/sk-code/sk-code-obsidian/SKILL.md:27-42
- .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:21-41
- .skilled/skills/sk-code/manual-testing-playbook/compiled-routing/surface-bundle-compiled-routing.md:29-35,44-61

## Assessment Notes

- This is a read-only coverage finding; no benchmark or routing source was changed.
