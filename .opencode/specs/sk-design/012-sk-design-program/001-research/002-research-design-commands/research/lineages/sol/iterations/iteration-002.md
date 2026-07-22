# Iteration 2: Shared Brief Intake Gap

## Focus
Identify what a shared creation brief must add beyond the current minimal routing questions.

## Actions Taken
1. Read the four remaining presentation contracts and compared them with interface.
2. Classified shared versus command-specific inputs.
3. Tested whether a new standalone brief command is necessary.

## Findings
1. Current intake is optimized for dispatch: target plus axis/scope/library/output and Brand/Product register. It omits audience, user/job, content/data, constraints, preserve/change boundaries, desired fidelity, owned system, references, and acceptance evidence. [SOURCE: .opencode/commands/design/assets/design-audit-presentation.txt:11-31] [SOURCE: .opencode/commands/design/assets/design-foundations-presentation.txt:11-30] [SOURCE: .opencode/commands/design/assets/design-motion-presentation.txt:11-30] [SOURCE: .opencode/commands/design/assets/design-md-generator-presentation.txt:11-30]
2. A compact shared envelope can cover `target`, `subject`, `audience`, `job`, `register`, `content/data`, `constraints`, `preserve`, `references`, `fidelity`, and `acceptance`; each command then adds only its discriminating fields. [INFERENCE: based on the cross-contract comparison]
3. Intake should be progressive: resolve facts from arguments and context first, ask only material unknowns together, and explicitly own minor choices. Forcing every field into every invocation would turn useful scaffolding into questionnaire friction. [INFERENCE: based on current auto/confirm split and interface's existing missing-brief procedure]
4. A separate `/interface:brief` command is unnecessary for the initial set. Brief normalization is a shared internal phase in every creation command; exposing it separately creates an artifact users must manually feed into the real command. [SOURCE: .opencode/commands/design/assets/design-interface-auto.yaml:61-90]

## Questions Answered
- The common intake contract and why it should remain internal/shared.

## Questions Remaining
- How external exemplars should be selected and bounded.
- Whether audit belongs in a creation namespace despite being evaluative.

## Ruled Out
- A mandatory eleven-question interview on every run.
- A public `/interface:brief` command in the initial command set.

## Assessment
- New information ratio: 0.78
- Novelty justification: Three new intake rules plus one negative naming decision extend the baseline.

## Reflection
- What worked: cross-command field comparison exposed a stable shared envelope.
- What failed: treating minimum routing fields as a complete creative brief.
- Next adjustment: compare this envelope with Anthropic's design prompt process.

## Recommended Next Focus
Extract the reusable creation-prompt structure from Anthropic's frontend-design skill, separating durable process from taste doctrine already owned by `sk-design`.
