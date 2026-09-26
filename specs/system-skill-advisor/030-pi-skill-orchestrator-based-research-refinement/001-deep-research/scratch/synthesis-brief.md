You are the synthesis step of a finished two-lineage deep research. You write one file and report back. You are a leaf: never dispatch another agent.

## Pre-resolved gates (do not ask about these)

- Gate 3 is answered: A) existing spec folder `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/001-deep-research`. Nobody is at your prompt to answer a question, so a question stops the work.
- Skill routing is resolved: this is the `/deep:research` synthesis step (`step_compile_research` in `.skilled/commands/deep/assets/deep-research-auto.yaml`). `research.md` is a research artifact, not an sk-doc document. Load nothing else.
- Write scope is exactly one file: `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/001-deep-research/research/research.md`. Do not create, edit or delete any other file. Do not run git writes, `validate.sh`, `generate-context.js` or any test suite.

## The question the research answered

Which mechanisms of the pi-skill-orchestrator Pi extension (`specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/context/pi-skill-orchestrator-main/`) should `system-skill-advisor` (`.skilled/skills/system-skill-advisor/`) adopt, adapt or reject, to improve routing precision, prompt cost and robustness. The brief, research questions RQ1 to RQ7 and the required answer shape are in the `Research Brief` section of `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/001-deep-research/spec.md`. Read it first.

## Inputs (read all of them)

Base: `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/001-deep-research/research/`

1. `lineages/mimo/iterations/iteration-001.md` to `iteration-010.md`, plus `lineages/mimo/research.md`. MiMo v2.6 Pro at high thinking, run through Pi, 10 iterations.
2. `lineages/swe2max/iterations/iteration-001.md` to `iteration-005.md`, plus `lineages/swe2max/research.md` if present. SWE-2 MAX, run through Devin, 5 iterations.
3. `findings-registry.json` at the base, which is the merged registry (50 key findings across both lineages), each lineage's own `findings-registry.json`, and `fanout-attribution.md`, which records which lineage produced what.
4. `resource-map.md` at the base, emitted from 15 lineage delta files. Cite it in section 16 References.
5. The source code at every `file:line` either lineage cites for a finding you keep. Open it. Do not trust the citation.

## Facts about the run that you must account for

- The two lineages are different model families on the same brief. Agreement between them is corroboration. Agreement inside one lineage is not.
- The runner flagged all 11 MiMo state records as timestamped outside the real run window (a record claims 12:45Z, the run ended 07:17Z). Its timestamps are invented. SWE-2 MAX had 2 of 7 records flagged the same way. Do not use lineage timestamps as evidence of anything.
- MiMo's self-reported `newInfoRatio` falls in exact 0.05 steps from 1.0. Treat it as self-report, not measurement.
- SWE-2 MAX state records carry no `findings` arrays. Its findings exist only in its iteration markdown, so the merged registry undercounts it. Read its iteration files directly.
- Both lineages carry containment advisories for `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` and `specs/sk-doc/059-skill-changelog-retrofit/description.json`. The first was the orchestrator's own comment edit and the second belongs to another session. Neither was written by a lineage. Leave both out of the findings.

## What to do

1. Verify. For every finding you carry into the Recommendations, open each cited `file:line` and record it as resolved, drifted (right file, wrong lines) or failed. A finding whose load-bearing citation failed cannot be ADOPT.
2. Compare lineages. Mark each recommendation as found by both, MiMo only, SWE-2 MAX only, or disputed. Where they disagree, do not average. Say which evidence is stronger and why, or mark it unresolved.
3. Judge for yourself. You are not bound by either lineage's verdict. Where the code says otherwise, say so and cite it.
4. Keep claims honest. Mark each load-bearing claim confirmed from code or inferred, and for inferred ones name what would confirm it.

## research.md structure

Use these 17 numbered sections in this order. A table of contents is allowed in this file only.

1. Executive Summary: the verdict in five lines or fewer
2. Scope, Method and Inputs: lineages, iteration counts, what was verified and how
3. to 9. One section per research question, RQ1 to RQ7, with the merged answer and its evidence
10. Cross-Lineage Agreement: where the two model families agreed, where only one looked and where they disagreed
11. Recommendations: the ranked list (shape below)
    - then an unnumbered `## Eliminated Alternatives` section as a table `| Approach | Reason Eliminated | Evidence | Iteration(s) |`, consolidating every ruled-out entry and dead end from both lineages
    - then an unnumbered `## Divergence Map` section: saturated directions, pivots, failures and the remaining frontier. Say plainly if no divergent pivots happened
12. Open Questions
13. Proposed Refinement Phases for system-skill-advisor (shape below)
14. Citation Verification Ledger: every citation you checked, with its result
15. Evidence Quality and Caveats: including the run facts listed above
16. References
17. Convergence Report: write only the heading and one line saying the workflow appends it. The workflow fills it after you

### Recommendation shape (section 11)

Rank by value to routing precision, prompt cost and robustness, weighed against cost and risk. Each entry carries:
- Verdict: ADOPT, ADAPT or REJECT
- Orchestrator mechanism at `file:line`
- Advisor counterpart at `file:line`, or "absent"
- Proposed change, benefit, cost and risk
- Confidence: confirmed or inferred, and what would confirm an inferred claim
- Lineage agreement: both, MiMo only, SWE-2 MAX only, or disputed
- Citation check: resolved, drifted or failed

### Refinement phase shape (section 13)

Group the ADOPT and ADAPT items into two to five candidate phases. Give each a literal kebab-case slug naming the concrete subject, for example `bounded-pull-recommend-command`, never `phase-2` or `improvements`. For each phase give:
- the recommendations it carries
- the files it would likely touch
- its dependency on other phases
- a rough size
- the observable check that would prove it worked

End the section by recommending which phase to do first, and why.

## Report back

End with a short report:
- the path you wrote
- the number of recommendations per verdict
- citations checked, resolved, drifted and failed
- the top three recommendations, one line each
- anything you could not resolve

Never claim a check you did not run.
