# Deep Research Strategy

## Topic
Should the /interface:design command be split into several smaller single-purpose commands, and if so exactly where do the seams fall?

## Lineage
- **Session ID:** fanout-glm-1785175007816-pn5cco
- **Executor:** cli-devin (glm-5-2)
- **Stop policy:** max-iterations (10 forced; convergence is telemetry only)
- **Artifact dir:** research/lineages/glm/

## Key Questions
1. **SEAMS** — Which INTENT_SIGNALS co-occur (share resources / always load together) and which never co-occur? Non-co-occurring clusters are candidate command seams.
2. **LANES** — Which of the 5 argument lanes and 12 internal lanes are genuinely separable jobs versus sequential phases of one job?
3. **COST** — What does a split actually cost (docs, YAML assets, presentation assets, metadata, registry/router wiring, runtime mirrors, test updates)?
4. **MIDDLE** — Is there a middle path (richer argument lanes, subcommands, mode-internal routing) that separates concerns without multiplying the command surface?
5. **HARM** — What failure modes does the current single-command shape actually produce today?

## Known Context
- sk-design hub consolidated from 6 modes / 5 commands to 2 workflow modes + 1 transport / 2 commands.
- `/interface:design` carries 5 selectable argument lanes (direction, directions, redesign, preflight, handoff) plus 12 internal/hidden lanes.
- design-interface SKILL.md declares 17 INTENT_SIGNALS and was trimmed 5234 -> 4991 words to stay under a 5000-word hard cap.
- Machine constraints in design-command-surface-check.mjs bind hard: next must be non-empty (:358), preferSiblingWhen must cover exactly the derived sibling set (:916), typicallyBefore must subset next (:983), handoff.nextOptions must match next exactly (:1249).
- HARD CONSTRAINT: operator has repeatedly rejected over-engineering; any recommendation must fix a DEMONSTRATED current problem, be the smallest change, and state its cost. "Split it because it is big" is not a finding.

## Non-Goals
- Actually decomposing /interface:design or writing any new command doc/asset/registry entry — this is research-only.
- Re-litigating the just-completed mode consolidation — that is settled program history.
- Merging with the composer lineage — lineages are compared, never averaged.

## Stop Conditions
- 10 iterations completed (forced; convergence before iteration 10 is telemetry only).
- All 5 questions answered with file:line evidence AND every recommendation checked against the hard constraint.

## Next Focus
Iteration 1: Map the INTENT_SIGNALS co-occurrence graph from design-interface/SKILL.md RESOURCE_MAP — which intents share resources and which never overlap. This is the foundational evidence for the seams question.

## What Worked
(none yet)

## What Failed
(none yet)

## Exhausted Approaches
(none yet)

## Active Risks
- Free model may default to symmetry-driven reasoning ("split because it's big") rather than evidence-driven reasoning.
- The 5000-word cap pressure is real but may not be sufficient grounds for a split on its own.
