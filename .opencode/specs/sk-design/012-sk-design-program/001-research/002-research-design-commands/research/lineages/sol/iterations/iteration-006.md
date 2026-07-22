# Iteration 6: Namespace And Naming Decision

## Focus
Resolve the final public command names, including audit and DESIGN.md extraction.

## Actions Taken
1. Read the mode registry and hub vocabulary guardrails.
2. Compared names against dominant user jobs and backend behavior.
3. Tested prefix consistency against namespace redundancy.

## Findings
1. Keep five commands. The registry exposes five genuinely distinct workflow modes with different intent vocabulary and one non-command transport; merging modes would fight the smallest-useful-mode rule. [SOURCE: .opencode/skills/sk-design/mode-registry.json:39-164] [SOURCE: .opencode/skills/sk-design/SKILL.md:140-153]
2. Audit belongs under `/interface` even though it evaluates rather than creates: the namespace represents the complete interface-design lifecycle, and audit has a distinct findings/backlog handoff contract. Calling the namespace creation-only would also misdescribe foundations and extraction. [SOURCE: .opencode/skills/sk-design/SKILL.md:23-35] [SOURCE: .opencode/skills/sk-design/shared/sk-code-handoff.md:71-79]
3. Confirm `interface -> /interface:design`; `/interface:interface` is tautological, while `design` is the dominant end-to-end creation job. [SOURCE: .opencode/skills/sk-design/mode-registry.json:41-59]
4. Refine the other three proposed `design-*` prefixes to `/interface:foundations`, `/interface:motion`, and `/interface:audit`. The namespace already supplies interface context, and the short nouns exactly match stable workflowMode keys and user vocabulary. [SOURCE: .opencode/skills/sk-design/mode-registry.json:62-123]
5. Refine `md-generator -> /interface:design-reference`, not `design-md-creation`. The mode extracts measured CSS into a Style Reference `DESIGN.md`; “creation” overstates generative authorship and hides the live-source/provenance job. [SOURCE: .opencode/skills/sk-design/mode-registry.json:125-143] [SOURCE: .opencode/commands/design/md-generator.md:13-17]
6. Final set: `/interface:design`, `/interface:foundations`, `/interface:motion`, `/interface:audit`, `/interface:design-reference`. Keep internal mode keys unchanged; public command names map to registry modes. [INFERENCE: naming synthesis from findings 1-5]

## Questions Answered
- Exact smallest coherent command set and names.
- Audit namespace inclusion.

## Questions Remaining
- Exact creation template for each command.

## Ruled Out
- One `/interface:design` mega-command.
- Redundant `design-` prefix on every child.
- `/interface:design-md-creation` because it obscures extraction/provenance.

## Assessment
- New information ratio: 0.72
- Novelty justification: The iteration resolves the final five-name set and refines four proposed names.

## Reflection
- What worked: stable mode keys and backend semantics gave objective naming criteria.
- What failed: mechanical prefix consistency reduced user-job clarity.
- Next adjustment: define the shared prompt skeleton before filling mode-specific templates.

## Recommended Next Focus
Specify the shared creation-template contract all five commands inherit: stages, brief fields, grounding record, mode call, proof, status, and handoff.
