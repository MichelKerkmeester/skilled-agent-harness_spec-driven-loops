# Iteration 7: Command and skill linkage

## Focus

Investigate Angle 7: how command identity connects to its parent skill, leaf workflow mode and runtime bridge, especially for plain-language matches. The reducer still recommends Q1 on source-of-truth, but the dispatched sequence places skill linkage seventh; I followed the explicit angle and used the Q1 conflict as evidence.

## Findings
1. Command metadata already carries a userIntent job and ownedSignals, an ownerMode, an argumentHint, and ordered choreography: load the parent hub, load the leaf mode contract, then load the command presentation resource. This is a concrete route from a plain-language prompt to the correct workflow. It is present in three metadata source files, so it does not yet establish complete linkage for all 45 commands. [SOURCE: .skilled/skills/system-deep-loop/command-metadata.json:3-33]

2. /deep:research and /deep:review share the system-deep-loop parent but have different owned signals, ownerMode values, leaf skill resources and presentation contracts. A route record must preserve owner mode and leaf workflow instead of surfacing only the shared parent skill. The generated bridge keeps that distinction; a single owner-skill field would erase it. [SOURCE: .skilled/skills/system-deep-loop/command-metadata.json:3-33] [SOURCE: .skilled/skills/system-deep-loop/command-metadata.json:50-79] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:319-365]

3. The generated bridge record keeps command id, command string, parent skillId, ownerMode, source and runtime scoring fields. Source metadata also carries userIntent and choreography, but the renderer presents a label and scores rather than those workflow resources. Keep the metadata source pointer or materialize a short workflow reference into the advisor result so the model can load the child contract. The current score-only brief is evidence against assuming the model already sees that choreography. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:319-340] [SOURCE: .skilled/skills/system-deep-loop/command-metadata.json:7-33] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:509-523]

4. Bridge identity and ownership are assembled from three source families: skill command-metadata, allow-list compatibility rows, and doctor routes whose skill_agent tags supply skill and mode. The deriver validates these separately. This supports normalizing to one command catalog; the three distinct authorities contradict choosing any one current source as complete coverage. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:16-29] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:54-64] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:98-108] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:125-135]

5. The generated /deep:research bridge's parent skillId is system-deep-loop and ownerMode research; its Python compatibility row instead carries id command-spec-kit-deep-research and owningSkill deep-research. The metadata choreography explains that parent-to-leaf relationship. Keep canonical command id, parent skill, leaf workflow and runtime alias as distinct fields; the existing runtime row's differing id values contradict flattening these into one owner id. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:319-340] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:557-558]

## Ruled Out

- Linking a command only to a parent skill without retaining its ownerMode and leaf workflow.
- Treating the generated bridge projection as the full execution recipe; source metadata holds the task-specific choreography and argument contract.

## Dead Ends

- None established. The current metadata gives a strong linkage pattern, but its source families and runtime identifiers remain split.

## Edge Cases

- Contradictory evidence: source metadata contains userIntent and choreography, while the generated/runtime/render surfaces expose only a subset. Preserve the richer linkage through the model-facing route.
- Contradictory evidence: bridge source families differ, and the Python deep-research id and owningSkill fields differ from the top-level bridge identity/parent owner.
- Missing dependencies: None for linkage examples.
- Ambiguous input: Strategy Next Focus remains Q1 source-of-truth; the dispatched sequence specifies Angle 7, followed as the focus.

## Sources Consulted

- .skilled/skills/system-deep-loop/command-metadata.json:3-33, 50-79
- .skilled/skills/sk-doc/command-metadata.json:122-153
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:98-108, 125-135, 557-558
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:16-29, 52-64
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json:319-365, 2088-2109
- AGENTS.md:86-89
- .skilled/skills/system-skill-advisor/runtime/lib/render.ts:509-523
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:274-275

## Assessment

- New information ratio: 0.90 (four findings define metadata-to-workflow linkage; one extends the runtime identity mismatch).
- Questions addressed: How command identity, parent skill, leaf owner mode and command resource should link.
- Questions answered: None fully. The metadata pattern is concrete, but all-command coverage and shared-source authority remain unresolved.

## Reflection

- What worked and why: Comparing command-metadata source entries with derived bridge rows showed which workflow detail survives into the scorer and which does not.
- What did not work and why: Ownership is split between three input families, and a bridge can name both a parent skill and a leaf workflow; a single id cannot express that relationship safely.
- What I would do differently: Map each of the 45 command files to a normalized record, then verify every runtime alias and child resource points to an existing workflow.

## Recommended Next Focus

Angle 8: measure command route recall, precision, confidence and ambiguity across no-slash prompts, typed slash prompts, controls for competing skills, missing arguments and runtime fallbacks; define holdout and acceptance thresholds.
