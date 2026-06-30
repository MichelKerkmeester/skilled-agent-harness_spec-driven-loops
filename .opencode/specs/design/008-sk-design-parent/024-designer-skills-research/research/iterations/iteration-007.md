# Focus

Iteration 7 checked whether `prototyping-testing`, `design-ops`, and `designer-toolkit` contain audit-adjacent material stronger than the already-expanded `sk-design` audit backlog, or whether they are mostly validation/process wrappers.

# Actions Taken

1. Re-read the deep-research strategy and recent state log to preserve the current open questions and avoid repeating the previous `interaction-design`, `ui-design`, `visual-critique`, and `design-systems` slices.
2. Inventoried the three focus plugins by filesystem: `prototyping-testing` has 8 skills, `design-ops` has 9 skills, and `designer-toolkit` has 7 skills.
3. Deep-read the strongest audit-adjacent candidates: `accessibility-test-plan`, `heuristic-evaluation`, `click-test-plan`, `a-b-test-design`, `design-qa-checklist`, `design-debt-audit`, `handoff-spec`, `design-token-audit`, `ux-writing`, and `design-rationale`.
4. Compared the candidates against current `sk-design` targets: `design-audit/references/accessibility_performance.md`, `design-audit/references/audit_contract.md`, `design-audit/references/evidence_capture.md`, `design-audit/references/anti_patterns_production.md`, `design-audit/assets/audit_report_template.md`, and `shared/design_token_vocabulary.md`.

# Findings

## F1 - Adopt a compact accessibility modality matrix into audit

`prototyping-testing/skills/accessibility-test-plan/SKILL.md` is the one clear audit-strengthening source in this slice. It explicitly separates automated checks, manual checks, assistive-technology checks, and user testing; the concrete manual/AT matrix includes keyboard-only navigation, screen-reader walkthroughs, zoom to 200% and 400%, high contrast, reduced motion, VoiceOver, NVDA, TalkBack, voice control, and switch control (`accessibility-test-plan/SKILL.md:9-32`). Current `sk-design` already has strong evidence rules and deterministic-scan honesty, but its audit references can benefit from this compact modality matrix as a pre-release coverage prompt.

Minimal adoption:
- Home: `design-audit`.
- Target: `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md`.
- Anchor: accessibility manual/automated check area.
- Edit shape: add a short "modality coverage" checklist naming automated scan, keyboard, screen reader, zoom, high contrast, reduced motion, and AT/device coverage. Keep it as an audit prompt, not a test-plan workflow.
- Leverage: high. Effort: low.

## F2 - Add a small token-tier and frequency note, but do not create a token-audit mode

`designer-toolkit/skills/design-token-audit/SKILL.md` adds practical details not fully captured by the shared token vocabulary: token coverage percentage, hard-coded visual properties, global vs semantic vs component tier misuse, redundant/deprecated token usage, missing scale steps, and frequency/impact prioritization (`design-token-audit/SKILL.md:9-40`). Existing `sk-design` already covers token roles, semantic token quality, hard-coded color findings, primitive-token misuse, one-off spacing/radius/shadow values, and owner mapping (`shared/design_token_vocabulary.md:92-97`, `anti_patterns_production.md:29-41`).

Minimal adoption:
- Home: `audit` plus a tiny shared-register cross-reference if needed.
- Target: `.opencode/skills/sk-design/design-audit/references/anti_patterns_production.md`.
- Anchor: Section 2, "Theming And Tokens".
- Edit shape: add one or two bullets for tier misuse and frequency-based prioritization. Do not adopt the full audit-report format, migration plan, adoption percentage tracking, or longitudinal token program.
- Leverage: medium. Effort: low.

## F3 - `design-ops` is mostly process/lifecycle; keep it outside sk-design

`design-ops/skills/design-qa-checklist/SKILL.md` overlaps heavily with current audit and implementation-review surfaces: visual accuracy, layout, interaction states, content states, accessibility, cross-platform checks, screenshots, severity, and fix verification (`design-qa-checklist/SKILL.md:9-57`). `handoff-spec` likewise describes handoff contents - visual specs, interaction specs, content specs, assets, edge cases, implementation notes, and walkthroughs (`handoff-spec/SKILL.md:9-46`). `design-debt-audit` is broader still: debt categories, portfolio inventory, severity/frequency/effort scoring, a debt register, remediation planning, and roadmap-facing cleanup capacity (`design-debt-audit/SKILL.md:9-72`).

These are useful organizational wrappers, but they are not stronger than the audit backlog as `sk-design` material. `sk-design` audit already owns findings-first reports, evidence labeling, owner routing, anti-pattern production checks, and next actions. The process of running a recurring design QA program, handoff workflow, or design debt register belongs outside the taste-led build/visual scope.

Minimal adoption:
- Do not add a `design-ops` or `QA` mode.
- If needed, borrow only individual probe language already covered above: states, real content, token exactness, responsive breakpoints, and accessibility coverage.
- Leverage: low for sk-design. Effort if adopted wholesale: high and scope-expanding.

## F4 - Heuristic, click, and A/B testing are validation wrappers, not build/visual guidance

`heuristic-evaluation` provides Nielsen-style issue documentation and a severity scale (`heuristic-evaluation/SKILL.md:9-36`). That is audit-adjacent, but current `audit_contract.md` already has severity-ordered findings and a five-dimension score, while `evidence_capture.md` requires real evidence, deterministic-scan honesty, and confirmed/inferred labels. Adding Nielsen's full heuristic list would broaden the audit vocabulary without a clear improvement to `sk-design`'s five-mode model.

`click-test-plan` and `a-b-test-design` are research/experiment design. They define test objectives, tasks, success criteria, sample size, metrics, pitfalls, and "when not to test" guidance (`click-test-plan/SKILL.md:9-38`, `a-b-test-design/SKILL.md:9-41`). These should be ruled out for `sk-design`; they can inform product research, but they are not surgical build/visual edits.

## F5 - UX writing mostly duplicates existing copy checks; rationale is out-of-scope

`designer-toolkit/skills/ux-writing/SKILL.md` has useful UI-copy categories: button labels, form labels, tooltips, placeholders, errors, empty states, confirmations, onboarding, CTAs, voice, tone, and localization (`ux-writing/SKILL.md:9-54`). Existing `anti_patterns_production.md` already checks verb-object buttons, error messages, empty states, loading states, terminology, labels, and error tone (`anti_patterns_production.md:43-52`). No new mode is justified; at most, future interface copy references can keep the "voice stable, tone contextual" distinction if not already present.

`design-rationale` is a documentation/lifecycle skill: decision, context, options, evidence, reasoning, trade-offs, validation plan, and storage alongside design files (`design-rationale/SKILL.md:9-41`). That is valuable for design teams, but it exceeds `sk-design`'s scope unless a future build phase adds a tiny "state the design rationale in one sentence" prompt inside interface outputs.

# Questions Answered

Q1: These three plugins contain one genuinely stronger audit technique: the accessibility modality matrix from `accessibility-test-plan`. `design-token-audit` adds a small token-tier/frequency refinement. Most other material is validation, handoff, process, research, or lifecycle governance.

Q2: Adopt the accessibility matrix into `design-audit/references/accessibility_performance.md`. Adopt the token-tier/frequency refinement into `design-audit/references/anti_patterns_production.md` Section 2. Do not create a new mode.

Q3: `design-ops` deliberately exceeds `sk-design` by owning QA workflows, handoff process, debt registers, team process, and impact reporting. `prototyping-testing` exceeds scope when it becomes experiment design or user-research planning. `designer-toolkit` exceeds scope when it becomes rationale documentation, negotiation, decks, case studies, or adoption programs.

Q4: Priority backlog from this iteration:
1. P1 audit: add accessibility modality coverage to `accessibility_performance.md` from `accessibility-test-plan`.
2. P2 audit: add token-tier misuse and frequency-prioritized token findings to `anti_patterns_production.md` from `design-token-audit`.
3. P3 interface/shared: optionally preserve "voice is stable, tone is contextual" if the copy references lack it, from `ux-writing`.
4. Explicitly ruled out: design QA process, handoff specs, design-debt registers, A/B tests, click tests, heuristic methodology import, and rationale documentation as standalone sk-design capabilities.

# Questions Remaining

- Finish the remaining `design-systems` coverage question from iteration 6: which remaining skills are pure docs/lifecycle versus small build-facing checks worth keeping?
- After all remaining plugins are sampled, finalize the priority order across audit, interface, foundations, motion, and explicit ruled-out lifecycle material.
- Revisit `visual-critique` individual skills if needed to confirm whether any concrete rubric language still beats the audit backlog after this iteration's accessibility and token refinements.

# Next Focus

Finish the remaining `design-systems` coverage and then synthesize the cross-plugin priority order. The likely shape is now clear: audit gets a small accessibility coverage upgrade and a tiny token-tier refinement; lifecycle/process material stays ruled out unless it can be reduced to one compact build-facing check.
