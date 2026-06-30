# Focus

Iteration 9 performed a confirmation pass on `prototyping-testing`, `design-ops`, and `designer-toolkit` after iteration 8 found the slice mostly exhausted. The narrow question was whether the remaining audit-adjacent edge cases add stronger material than the expanded audit backlog, or whether they are validation/process wrappers that should stay out of `sk-design`.

# Actions Taken

1. Read the current strategy and state tail to confirm the reducer was still asking for the same focus.
2. Inventoried the three focus plugins to identify the leftover edge cases: `a-b-test-design`, `click-test-plan`, `design-sprint-plan`, `version-control-strategy`, and `design-rationale`.
3. Read those five corpus skills against `design-audit`'s contract, evidence model, critique/hardening lens, and anti-pattern/production reference.
4. Compared the evidence against iteration 8's conclusion so this pass only added confirmation or genuinely net-new deltas.

# Findings

## F1 - A/B and click-test skills reinforce evidence limits, not audit scope

`a-b-test-design` is a rigorous experiment-design wrapper: one hypothesis, isolated variants, primary and secondary metrics, sample size, duration, and pitfalls like peeking, weak sample size, novelty effects, and segmentation effects. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/a-b-test-design/SKILL.md:10] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/a-b-test-design/SKILL.md:16] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/a-b-test-design/SKILL.md:24] That is useful design-research machinery, but it does not belong inside a taste-led build/visual skill.

`click-test-plan` similarly evaluates first-click behavior, click paths, navigation, five-second recall, target areas, time to click, confidence ratings, and heat maps. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/click-test-plan/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/click-test-plan/SKILL.md:21] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/click-test-plan/SKILL.md:28] It can inform an audit if the user supplies results, but `sk-design` should not become a participant-test planning suite.

Current audit already has the right home for this boundary: evidence capture says findings rest on source, rendered, or design-artifact evidence; metrics unavailable for performance claims must be labeled as static risk; and inferred findings must carry their label into severity. [SOURCE: .opencode/skills/sk-design/design-audit/references/evidence_capture.md:38] [SOURCE: .opencode/skills/sk-design/design-audit/references/evidence_capture.md:87] [SOURCE: .opencode/skills/sk-design/design-audit/references/evidence_capture.md:103] This strengthens the existing P3 evidence-impact guard from iteration 8 rather than adding a new backlog item: no conversion, confidence, findability, or behavior-impact claim unless supplied experiment/test evidence supports it.

Minimal adoption:
- Home: `design-audit`.
- Target: `.opencode/skills/sk-design/design-audit/references/evidence_capture.md`.
- Anchor: fallback labels / evidence limits.
- Edit shape: fold A/B and click-test evidence into the existing "do not claim behavior/business impact without supplied metrics, baseline, or experiment evidence" guard.
- Leverage: medium-low. Effort: low.

## F2 - Remaining design-ops files are lifecycle governance

`design-sprint-plan` is a facilitation plan from challenge framing through sketching, storyboard, prototype, and five user interviews. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/design-ops/skills/design-sprint-plan/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/design-ops/skills/design-sprint-plan/SKILL.md:25] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/design-ops/skills/design-sprint-plan/SKILL.md:39] `version-control-strategy` covers design-file branches, component-library semver, token changelogs, migrations, and communicating changes to consumers. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/design-ops/skills/version-control-strategy/SKILL.md:15] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/design-ops/skills/version-control-strategy/SKILL.md:20] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/design-ops/skills/version-control-strategy/SKILL.md:34]

These are wider than audit, not stronger than audit. Current `design-audit` already owns the build-facing surface: severity, five-dimension scoring, evidence-backed findings, report order, and owner routing. [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:18] [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:29] [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:48] [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:69]

Minimal adoption:
- No `design-ops`, `sprint`, or `version-control` mode.
- Do not import process governance into `audit`.
- Record as ruled out because it exceeds `sk-design`'s build/visual boundary.
- Leverage for `sk-design`: low. Scope-creep risk: high.

## F3 - Design rationale overlaps with audit reporting, but does not beat it

`design-rationale` asks for decision, context, options, evidence, reasoning, trade-offs, and validation plan. [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/designer-toolkit/skills/design-rationale/SKILL.md:9] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/designer-toolkit/skills/design-rationale/SKILL.md:16] [SOURCE: .opencode/specs/design/008-sk-design-parent/external/designer-skills-main/designer-toolkit/skills/design-rationale/SKILL.md:20] That structure is good communication hygiene, but it is not a separate sk-design capability.

The audit contract already leads with actionable findings, evidence, impact, recommended fix, owner, score, anti-pattern verdict, next actions, and residual risk. [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:50] [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:61] [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:71] The evidence model also already says every audit must label evidence quality honestly before severity. [SOURCE: .opencode/skills/sk-design/design-audit/references/evidence_capture.md:16] [SOURCE: .opencode/skills/sk-design/design-audit/references/evidence_capture.md:99]

Minimal adoption:
- No new `rationale` mode.
- No default rationale section in audit; that would bloat findings-first output.
- Optional future wording only: when a user explicitly asks for rationale, map it to evidence, trade-offs, and residual risk inside the existing audit report shape.
- Leverage: low. Effort: low.

## F4 - Focus answer: confirmation pass closes this slice

The three-plugin audit-adjacent slice is now sufficiently checked. The durable backlog remains the same as iteration 8:

1. P1 audit: accessibility modality coverage from `accessibility-test-plan` into `accessibility_performance.md`.
2. P2 audit: token-tier misuse and frequency-prioritized token findings from `design-token-audit` into `anti_patterns_production.md`.
3. P3 audit: no business-impact, conversion, findability, confidence, or user-behavior claim without supplied metrics, baseline, experiment, or test evidence; otherwise label the claim unverified in `evidence_capture.md`.

Everything else in this focus is duplicate vocabulary or out-of-scope lifecycle work.

# Questions Answered

Q1: For this focus, the remaining capabilities are not stronger than the existing audit backlog. They mainly add experiment design, click-test planning, sprint facilitation, design versioning, and rationale writing.

Q2: The only adoptable home is the existing `design-audit/references/evidence_capture.md` guard already identified in iteration 8. `click-test-plan` has partial interface-quality overlap, but no separate interface backlog item is justified from this pass.

Q3: `prototyping-testing` exceeds scope when it becomes participant validation; `design-ops` exceeds scope when it becomes sprint/process/version governance; `designer-toolkit` exceeds scope when it becomes rationale, persuasion, adoption, or storytelling workflow.

Q4: Priority from this focus is unchanged: P1 accessibility modality, P2 token-tier/frequency, P3 evidence-impact guard. No new mode is justified.

# Questions Remaining

- Finish the remaining `design-systems` coverage question from iteration 6.
- Revisit individual `visual-critique` skills if final synthesis still needs stronger audit rubric language.
- Finalize the cross-plugin adoption backlog order across audit, interface, foundations, motion, and explicitly ruled-out lifecycle material.

# Next Focus

Finish the remaining `design-systems` coverage, then synthesize the cross-plugin priority order. The `prototyping-testing`, `design-ops`, and `designer-toolkit` audit-adjacent question can be treated as exhausted unless the reducer needs only a final registry reconciliation.
