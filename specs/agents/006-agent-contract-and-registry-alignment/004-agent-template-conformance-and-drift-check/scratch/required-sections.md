# Required sections: what the agent template asks for, and what the check will require

## What the template says today

- Section 3 of `agent-template.md`, REQUIRED BODY STRUCTURE, opens with "Every production agent should include these body elements in this order" and marks no single section as required or optional.
- Section 8, the skeleton, opens with "Copy this skeleton for new agents and delete sections that do not apply".
- The deep-loop dialect paragraph says "Only `## 1. CORE WORKFLOW` is validator-required".
- So the template gives an order and a full skeleton, and leaves open which sections an agent may drop.

## The `0b` input and scope gate

- The template says: "Use this section when the agent is driven by a command, loop controller, stress test, or machine-validated workflow."
- Answer to the open question in `spec.md`: the gate is conditional on how an agent is driven, not on whether it writes. A check cannot read that from a file, so the gate is not in the required list.

## Compared with the full skeleton, before any edit

- 44 places where one of the eleven files lacks a skeleton heading by its exact title: the skills section name in 10, the hook section in 10, RUNTIME PARAMETERS in 10, the section 0 title in 7, OUTPUT FORMAT in 4, SUMMARY in 2, and the CORE WORKFLOW title in 1.
- After the two planned renames 24 remain.

## Operator decision, 2026-11-14: a narrow required list, written into the template

- The operator chose a short required list over about 20 registry exceptions and over adding sections with new rule text.
- The template gains a machine-readable list, and the check reads it from there and holds no copy.
- The list, in order: ILLEGAL NESTING, CORE WORKFLOW, CAPABILITY SCAN, HOOK-INJECTED CONTEXT ROUTING, OUTPUT FORMAT, OUTPUT VERIFICATION, ANTI-PATTERNS, RELATED RESOURCES.
- A heading meets a required title when its text after the number starts with that title, so `ILLEGAL NESTING (HARD BLOCK)` and `CORE WORKFLOW -- Single Review Iteration` both pass.
- RUNTIME PARAMETERS and SUMMARY stay in the skeleton as optional sections.
- This amends the phase scope: `agent-template.md` changes in this phase.

## Exceptions that remain, each a role difference

- `code`: OUTPUT FORMAT. It returns a fixed contract under RETURN CONTRACT, which the orchestrator cites by that name.
- `deep-review`: OUTPUT FORMAT. Its output is the iteration file and state rows that REVIEW CONTRACT defines.
- `orchestrate`: OUTPUT FORMAT. It delivers a synthesis under SYNTHESIS & DELIVERY and has no fixed output shape.
- `ai-council`: HOOK-INJECTED CONTEXT ROUTING sits out of order. Twelve files in the `deep-ai-council` skill cite this agent's sections by number, sections 3 to 17, so the new section goes after them and no cited number moves.
- `debug` needs none: its RESPONSE FORMAT section takes the template's name, a heading-only change.
