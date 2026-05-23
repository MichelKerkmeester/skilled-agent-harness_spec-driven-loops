# Iteration 011 — Separate Retry Controller From `/speckit:implement`

Date: 2026-04-10

## Research question
Should a Get It Right-style retry loop be embedded inside `system-spec-kit`'s existing `/speckit:implement` workflow, or does the external repo suggest a separate control surface?

## Hypothesis
The retry loop should be a separate, thin controller. Embedding it inside `/speckit:implement` would mix attempt control with packet-completion governance.

## Method
I compared Get It Right's focused four-step loop against `system-spec-kit`'s current implementation command and YAML to see whether the same surface is already overloaded with unrelated responsibilities.

## Evidence
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/workflow.yaml:7-24] The external workflow is a single-purpose retry controller: implement, objective checks, structured review, optional refactor.
- [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/004-get-it-right-main/external/docs/loop-explained.md:5-45] The external docs keep the control loop focused on attempt mechanics rather than packet completion.
- [SOURCE: .opencode/commands/speckit/implement.md:151-205] `/speckit:implement` is explicitly a 9-step implementation workflow covering plan review, checklist handling, development, completion summary, memory save, and handover.
- [SOURCE: .opencode/commands/speckit/assets/speckit_implement_auto.yaml:73-131] The current implement workflow is entangled with documentation levels, prerequisite files, and template-compliance rules.
- [SOURCE: .opencode/commands/speckit/assets/speckit_implement_auto.yaml:313-518] The same YAML also owns task breakdown, checklist verification, development, completion, and mandatory memory save.

## Analysis
Get It Right succeeds because its controller surface is small: one attempt loop, one feedback bridge, one stop condition. `/speckit:implement` is doing something materially different. It owns prerequisite enforcement, Level 1/2/3 doc expectations, checklist validation, completion summary generation, memory save, and handover. Those are durable packet-completion concerns, not attempt-scoped retry concerns. If retry logic is bolted into that same workflow, every change to attempt control inherits the branching and coupling of the full implementation lifecycle.

## Conclusion
confidence: high
finding: `system-spec-kit` should not implement Get It Right as "more logic inside `/speckit:implement`." The external repo points toward a separate retry controller with a narrower contract and a cleaner state model.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/commands/speckit/retry.md` plus dedicated YAML assets
- **Change type:** architectural shift
- **Blast radius:** large
- **Prerequisites:** define retry packet shape, branch outcomes, and the relationship to `/speckit:implement`
- **Priority:** must-have

## Refactor / Pivot Analysis

- **Current system-spec-kit approach:** `/speckit:implement` is a 9-step packet-completion workflow with doc-level selection, checklist enforcement, completion summary generation, memory save, and optional handover.
- **External repo's approach:** Get It Right isolates implement/check/review/refactor into a single-purpose retry controller with a compact config surface.
- **Why the external approach might be better:** it makes attempt control independently testable, reduces coupling between retries and packet-completion rules, and keeps the operator model legible.
- **Why system-spec-kit's approach might still be correct:** a single implementation command centralizes governance and keeps completion behavior consistent across tasks.
- **Verdict:** REFACTOR
- **If REFACTOR/PIVOT/SIMPLIFY — concrete proposal:** introduce an opt-in `/speckit:retry` workflow that can be invoked directly or called from `/speckit:implement` Step 6 when brownfield-understanding failure is detected.
- **Blast radius of the change:** large
- **Migration path:** ship `/speckit:retry` as an additive command first; reuse existing review/check infrastructure; once stable, let `/speckit:implement` delegate into it for qualifying tasks instead of absorbing the loop itself.

## Counter-evidence sought
I looked for an existing thin attempt controller separate from `/speckit:implement` and found only the full 9-step implementation workflow.

## Follow-up questions for next iteration
- What is the minimal retry packet shape if the controller is split out?
- Which existing internal checks belong to retry versus completion?
- Should `/speckit:implement` call `/speckit:retry`, or should the user choose explicitly?
