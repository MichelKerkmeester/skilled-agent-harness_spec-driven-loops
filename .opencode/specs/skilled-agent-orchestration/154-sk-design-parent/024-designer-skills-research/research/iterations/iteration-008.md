# Focus

Iteration 8 continued the `prototyping-testing`, `design-ops`, and `designer-toolkit` audit-adjacent check by reading the skills that iteration 7 had not deeply covered. The question was whether the remaining material beats the already-expanded `sk-design` audit backlog, or whether it mostly wraps testing, critique, handoff, reporting, and stakeholder lifecycle work.

# Actions Taken

1. Re-read iteration 7 and the current strategy so this pass only covered the unread parts of the three focus plugins.
2. Read the remaining `prototyping-testing` skills: `prototype-strategy`, `test-scenario`, `user-flow-diagram`, and `wireframe-spec`.
3. Read the remaining `design-ops` skills: `design-critique`, `design-review-process`, `design-impact-reporting`, `design-sprint-plan`, `team-workflow`, and `version-control-strategy`.
4. Read the remaining `designer-toolkit` skills: `case-study`, `design-negotiation`, `design-system-adoption`, and `presentation-deck`.
5. Compared these against current `sk-design` targets: `design-audit/references/audit_contract.md`, `design-audit/references/evidence_capture.md`, `design-audit/references/accessibility_performance.md`, `design-audit/references/anti_patterns_production.md`, `design-interface/references/design-process/ux_quality_reference.md`, `design-interface/assets/interface_preflight_card.md`, and `shared/sk_code_handoff.md`.

# Findings

## F1 - Remaining prototyping-testing is useful vocabulary, not stronger audit material

`wireframe-spec` has concrete build-facing checks: content priority, behavior annotations, responsive notes, accessibility notes, heading hierarchy, text length, image ratios, required content, and multiple states including empty/loading/populated/error plus breakpoint versions. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/wireframe-spec/SKILL.md:8] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/wireframe-spec/SKILL.md:17] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/wireframe-spec/SKILL.md:42]

That is mostly already covered in `sk-design`: interface preflight checks contrast, form label/error structure, placeholder/lorem/copy quality, animation justification, and reduced motion; audit production checks missing empty/loading/error/success states; the UX quality reference owns contrast, keyboard, reduced motion, loading states, and scoped performance boundaries. [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:82] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:86] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:124] [SOURCE: .opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:138] [SOURCE: .opencode/skills/sk-design/design-audit/references/anti_patterns_production.md:78] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:42]

`user-flow-diagram` adds happy path, branch, error path, exit point, decision criteria, error handling, async/event annotations, and arrow labels. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/user-flow-diagram/SKILL.md:22] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/user-flow-diagram/SKILL.md:29] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/user-flow-diagram/SKILL.md:35] This belongs, if adopted at all, in the already-proposed compact interface flow-floor reference, not in audit. `prototype-strategy` and `test-scenario` are testing/research setup: fidelity choice, prototype methods, risk assumptions, task success criteria, and facilitation rules. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/prototype-strategy/SKILL.md:23] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/prototyping-testing/skills/test-scenario/SKILL.md:14] They do not justify audit expansion.

Minimal adoption:
- No new audit item from this remaining prototyping slice.
- Optional interface wording only: keep "happy path, branch, error path, async delay, and exit point" as a compact flow-floor phrase if the eventual interface edit has room.
- Leverage: low to medium. Effort: low.

## F2 - Design-ops confirms the scope boundary

`design-review-process` is explicitly a gate system: concept review, design review, pre-handoff review, implementation QA, approval workflow, and best practices like scaling process to project risk. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/design-review-process/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/design-review-process/SKILL.md:22] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/design-review-process/SKILL.md:40] `design-critique` is a meeting facilitation framework with notice/wonder/what-if feedback language, critique types, pitfalls, and ritual guidance. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/design-critique/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/design-critique/SKILL.md:20] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/design-critique/SKILL.md:34] `team-workflow`, `design-sprint-plan`, and `version-control-strategy` are team/process systems, not visual-build craft. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/team-workflow/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/team-workflow/SKILL.md:40] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/design-sprint-plan/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/version-control-strategy/SKILL.md:15]

Current `sk-design` audit already has the correct output contract: findings first, severity ordered, evidence-backed, owner-routed, and limited by evidence caveats. [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:16] [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:20] [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:48] [SOURCE: .opencode/skills/sk-design/design-audit/references/audit_contract.md:71] The design-ops slice is not stronger; it is wider. Adopting it would turn `sk-design` into design QA governance.

Minimal adoption:
- Do not create a `design-ops`, `design-review`, or `QA` mode.
- Preserve the existing audit contract and accepted-finding handoff model.
- Leverage for sk-design: low. Scope-creep risk: high.

## F3 - Impact reporting suggests one small evidence-honesty guard, not an impact-reporting capability

`design-impact-reporting` is sophisticated, but it is not a build/visual skill. It separates user, product, and business metrics; asks for baseline/current/target reporting; adds A/B summaries; pairs qualitative evidence with quantitative evidence; and warns against attributing metric improvements to design without acknowledging co-factors. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/design-impact-reporting/SKILL.md:14] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/design-impact-reporting/SKILL.md:37] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/design-impact-reporting/SKILL.md:64] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/design-ops/skills/design-impact-reporting/SKILL.md:70]

`sk-design` already has the right evidence discipline: it distinguishes source/rendered/deterministic evidence, labels inferred findings, forbids fabricated results, and carries evidence labels into severity and scoring. [SOURCE: .opencode/skills/sk-design/design-audit/references/evidence_capture.md:40] [SOURCE: .opencode/skills/sk-design/design-audit/references/evidence_capture.md:67] [SOURCE: .opencode/skills/sk-design/design-audit/references/evidence_capture.md:89] [SOURCE: .opencode/skills/sk-design/design-audit/references/evidence_capture.md:105]

The only adoptable bit is a negative guard: audit should not translate visual/design findings into business or user-behavior impact unless the user provided metrics, baselines, or experiment evidence. That would strengthen honesty without importing impact-reporting workflow.

Minimal adoption:
- Home: `design-audit`.
- Target: `.opencode/skills/sk-design/design-audit/references/evidence_capture.md`.
- Anchor: evidence limits / residual risks.
- Edit shape: one sentence: no business-impact or user-behavior claim without supplied metrics, baseline, or experiment evidence; otherwise label it unverified.
- Leverage: medium. Effort: low.

## F4 - Designer-toolkit remaining skills are communication and adoption, not sk-design modes

`design-negotiation` has useful risk language: define done, scope with evidence, name debt, identify the top two or three high-impact changes, bring accessibility/legal/design-system evidence, and document trade-offs. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/designer-toolkit/skills/design-negotiation/SKILL.md:16] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/designer-toolkit/skills/design-negotiation/SKILL.md:23] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/designer-toolkit/skills/design-negotiation/SKILL.md:40] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/designer-toolkit/skills/design-negotiation/SKILL.md:57]

Current `sk-design` already encodes the useful boundary through `shared/sk_code_handoff.md`: accepted audit findings become an implementation backlog with severity, owner, evidence label, fix shape, verification, residual uncertainty, and explicit audit-only routing. [SOURCE: .opencode/skills/sk-design/shared/sk_code_handoff.md:73] [SOURCE: .opencode/skills/sk-design/shared/sk_code_handoff.md:75] [SOURCE: .opencode/skills/sk-design/shared/sk_code_handoff.md:77] [SOURCE: .opencode/skills/sk-design/shared/sk_code_handoff.md:98]

`design-system-adoption`, `presentation-deck`, and `case-study` are clearly lifecycle/storytelling capabilities: adoption strategy and metrics, stakeholder presentation structure, portfolio case-study structure, and visual storytelling. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/designer-toolkit/skills/design-system-adoption/SKILL.md:9] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/designer-toolkit/skills/design-system-adoption/SKILL.md:30] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/designer-toolkit/skills/presentation-deck/SKILL.md:18] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/designer-toolkit/skills/case-study/SKILL.md:9] They should remain out of scope.

Minimal adoption:
- No new mode.
- Do not import adoption, presentation, case-study, or negotiation workflows.
- Let the optional impact-claim guard from F3 cover the only evidence-honesty gap.

## F5 - Answer to the iteration focus

The remaining skills in `prototyping-testing`, `design-ops`, and `designer-toolkit` are mostly validation, facilitation, reporting, stakeholder, and adoption wrappers. They do not beat the current audit backlog. The durable adoption backlog from this focus remains:

1. P1 audit: accessibility modality coverage from `accessibility-test-plan` into `accessibility_performance.md` (iteration 7).
2. P2 audit: token-tier misuse and frequency-prioritized token findings from `design-token-audit` into `anti_patterns_production.md` (iteration 7).
3. P3 audit: no business-impact or user-behavior claim without supplied metrics/baseline/experiment evidence, from `design-impact-reporting` into `evidence_capture.md`.

# Questions Answered

Q1: Yes, these three plugins contain a few concrete checks, but almost all high-signal audit material was already captured in iteration 7. The remaining pass adds only one small evidence-honesty guard.

Q2: Correct homes are audit for the accessibility matrix, token-tier/frequency note, and optional evidence-impact guard; interface for any compact flow-floor phrase; no justified new mode.

Q3: `design-ops` and most of `designer-toolkit` deliberately exceed `sk-design` by owning meetings, reviews, handoff rituals, reporting, adoption, decks, negotiation, and case-study storytelling. `prototyping-testing` exceeds scope when it becomes prototype planning or participant testing.

Q4: Priority from this focus is P1 accessibility modality, P2 token-tier/frequency, P3 evidence-impact guard. Everything else is duplicate or ruled out.

# Questions Remaining

- Finish the remaining `design-systems` coverage question from iteration 6.
- Revisit individual `visual-critique` skills if final synthesis still needs stronger audit rubric language.
- Finalize the cross-plugin adoption backlog order across audit, interface, foundations, motion, and ruled-out lifecycle material.

# Next Focus

Finish the remaining `design-systems` coverage, then synthesize the cross-plugin priority order. The audit-adjacent question for `prototyping-testing`, `design-ops`, and `designer-toolkit` is now closed unless the reducer asks for a final confirmation pass.
