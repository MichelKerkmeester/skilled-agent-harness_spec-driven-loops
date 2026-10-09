# Iteration 002

## Focus
Compare Ponytail's quality-review checks and review output with the current author-quality and findings-first review modes.

## Actions Taken
- Read lineage config, projection, and strategy before the pass.
- Compared Ponytail review/audit guidance with the sk-code quality gate, review checklist, removal plan, and finding schema.
- Reconciled the older recommendations against the current files rather than assuming the archived recommendations remained open.

## Findings
1. **ALREADY-ADOPTED** — The older standard-library/native duplication checks, needed-ness removal prompt, ceiling-comment boundary, and Replacement field already exist in sk-code-review. Do not duplicate the rows. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:46-66] [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:108-153] [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md:46-54] [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:47-52]
2. **ALREADY-ADOPTED (retained rejection)** — Keep one findings-first review baseline and reject a separate ponytail-review/audit skill or LOC-based severity score. Those would split the current review contract or reward under-solving. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:11-14] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md:11-14] [SOURCE: .skilled/skills/sk-code/sk-code-review/SKILL.md:13-16] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:88-103] [SOURCE: specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md:77-79]
3. **NEW** — For a scale or performance finding, include the assumed workload in the existing evidence text. Ponytail asks reviewers to find and state expected load, while sk-code asks a 10x-volume question but its finding schema does not capture the workload assumption. A short sentence inside the current evidence field closes that gap without changing the schema. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md:26-28] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md:22-23] [SOURCE: .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md:52-63] [SOURCE: .skilled/skills/sk-code/sk-code-review/references/review-core.md:88-103]

## Questions Answered
- Which Ponytail design restraint, quality, and review checks are genuinely missing from sk-code's nested code-quality and code-review modes?

## Questions Remaining
- Which Ponytail hook, state, and cross-runtime portability mechanisms can improve sk-code surfaces without violating its read-first, scope, and verification floors?
- What do Ponytail's benchmark and correctness gates measure, and where could sk-code's benchmark and advisor tooling gain decision-useful evidence?
- Which older Ponytail recommendations are already adopted, lost, or still new in current sk-code, and which source-inspired additions should be rejected?

## Sources Consulted
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-review/SKILL.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-audit/SKILL.md
- .skilled/skills/sk-code/sk-code-quality/SKILL.md
- .skilled/skills/sk-code/sk-code-review/SKILL.md
- .skilled/skills/sk-code/sk-code-review/assets/code-quality-checklist.md
- .skilled/skills/sk-code/sk-code-review/assets/removal-plan.md
- .skilled/skills/sk-code/sk-code-review/references/review-core.md
- specs/sk-code/z_archive/015-sk-code-ponytail-based-refinement/research/research.md

## Assessment
Three findings: one new, two redundant. newInfoRatio = 0.3333. The new recommendation reuses the current finding schema's evidence field and leaves severity gates unchanged.

## Reflection
Several formerly proposed additions are now in the current checklist. Their previous status as recommendations was stale context, so checking the present files prevents duplicate work. The remaining gap is narrow: performance reasoning can be anchored to an explicit assumed load without a new output type.

## Recommended Next Focus
Compare Ponytail's hook lifecycle, state persistence, and runtime adapters with sk-code's current hooks and read-on-demand surface routing.

