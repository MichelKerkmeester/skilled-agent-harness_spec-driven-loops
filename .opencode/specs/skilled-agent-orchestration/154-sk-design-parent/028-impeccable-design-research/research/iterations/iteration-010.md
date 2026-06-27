# Iteration 10: Convergence Check And Backlog Tightening

## Focus

This iteration treated iteration 9's final adoption backlog as a hypothesis and rechecked the highest-leverage items against the live `sk-design` target files. No command-flow reference remained unread, so the useful work was convergence: tighten classifications, remove overclaimed novelty, and confirm that every remaining adoption item belongs inside the existing five-mode `sk-design` structure.

## Actions Taken

1. Read the current strategy and state tail. The reducer's next focus says no command-flow reference remains unread, and the state log shows iteration 10 had been opened after an iteration 9 synthesis record. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research/research/deep-research-strategy.md:75] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research/research/deep-research-state.jsonl]
2. Reopened the iteration 9 synthesis backlog and used it as the candidate ledger, not as proof. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/028-impeccable-design-research/research/iterations/iteration-009.md:19]
3. Rechecked impeccable source slices for the top unresolved themes: native visual direction and palette/mocks, brief shaping, onboarding, high-ambition interaction, and prose specificity. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/codex.md:7] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/shape.md:19] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/onboard.md:24] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/overdrive.md:16] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/docs/STYLE.md:5]
4. Opened current `sk-design` target files for the same themes: interface real-UI loop, product-flow floor, audit token hardening, md-generator quality, motion advanced craft, hardening edge cases, mechanical defaults, content gate, foundations typography, shared token vocabulary, and AI fingerprint tells. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real_ui_loop.md:97] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:81] [SOURCE: .opencode/skills/sk-design/design-audit/references/anti_patterns_production.md:31] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/quality_checklist.md:25] [SOURCE: .opencode/skills/sk-design/design-motion/references/advanced_craft.md:17] [SOURCE: .opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md:38] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md:63] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md:57] [SOURCE: .opencode/skills/sk-design/design-foundations/references/type/typography_system.md:60] [SOURCE: .opencode/skills/sk-design/shared/design_token_vocabulary.md:76] [SOURCE: .opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md:70]

## Findings

### Finding 1: The no-new-mode verdict is stronger after rechecking the live homes

Every remaining actionable item still maps to an existing `sk-design` owner. The hub already defines exactly five modes and says per-mode design logic stays inside those packets, while shared references provide vocabulary rather than workflow logic. [SOURCE: .opencode/skills/sk-design/SKILL.md:19] [SOURCE: .opencode/skills/sk-design/SKILL.md:79] The current candidates all fit that model:

- `design-interface`: pre-code brief/direction, native-image palette/mocks, onboarding, content specificity, feature composition.
- `design-audit`: DESIGN.md/token drift, overlay clipping, production hardening, selected AI tells.
- `design-motion`: high-ambition interaction escalation.
- `design-foundations` and `shared`: typography/token refinements.
- `design-md-generator`: remains a measured extraction source, not the owner of live UI drift.

Classification: NET-NEW refinements remain valid, but no NEW mode is justified.

### Finding 2: Native visual direction is the clearest P1, but only as a guarded branch

Impeccable's Codex-specific file requires four stop points before code: Step A answers, palette confirmation, mock approval, and final direction approval. It also says shape approval is not a substitute for the palette/atmosphere/reference questions. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/codex.md:7] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/codex.md:16] The same file requires a single palette artifact before mocks and treats that confirmed palette as the downstream contract. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/codex.md:31] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/codex.md:39]

Current `sk-design` has an optional pre-build direction gate for two or three brief-specific directions, but it does not encode image-native stop points, palette-first confirmation, mock approval, or an ingredient inventory before code. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real_ui_loop.md:97] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real_ui_loop.md:99] It also explicitly rejects reusable style/palette menus, so the adoption must be guarded by subject-grounding and native-image availability. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real_ui_loop.md:103] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/real_ui_loop.md:105]

Classification: NET-NEW, targeted to `design-interface/references/design-process/real_ui_loop.md` after Section 7. Minimal future edit: add a native-image visual-direction branch for open-ended high-fi or image-led work, with palette-first confirmation, 1-3 subject-grounded mocks, and a brief ingredient inventory before implementation.

### Finding 3: Onboarding should be partially downgraded from "absent" to "more specific than present"

Iteration 9 correctly kept onboarding in the backlog, but this pass found one overclaim: current `ux_quality_reference.md` already says first-run and empty states should guide the first useful action and expose a clear CTA. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:79] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md:81]

The net-new portion is narrower. Impeccable adds time-to-value as the outcome metric, real functionality instead of separate tutorial mode, skip/dismissal affordances, contextual teaching at point of use, and respect for prior dismissal so the same onboarding does not repeat. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/onboard.md:24] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/onboard.md:34] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/onboard.md:38] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/onboard.md:49] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/onboard.md:211]

Classification: PARTIALLY ALREADY-COVERED, PARTIALLY NET-NEW. Minimal future edit: extend the Compact Product Flow Floor with first-value onboarding specifics: shortest path to value, optional/skip path, contextual teaching, sample/template starting points when appropriate, and no repeated tips after dismissal.

### Finding 4: The audit and motion items remain small, high-confidence refinements

The DESIGN.md drift candidate is not md-generator authoring work. `quality_checklist.md` already protects extracted Style Reference fidelity and requires token-grounded prose, while audit currently reports hard-coded colors, primitive tokens, one-off spacing/radius/shadow/z-index, and related token issues. [SOURCE: .opencode/skills/sk-design/design-md-generator/references/quality_checklist.md:25] [SOURCE: .opencode/skills/sk-design/design-md-generator/references/quality_checklist.md:29] [SOURCE: .opencode/skills/sk-design/design-audit/references/anti_patterns_production.md:31] [SOURCE: .opencode/skills/sk-design/design-audit/references/anti_patterns_production.md:35] What remains missing is the live UI audit bridge: when a project has an existing `DESIGN.md` or token sidecar, flag untraced deviations as drift unless deliberately updated.

The overlay clipping candidate also remains absent. `hardening_edge_cases.md` covers long text, empty data, large lists, translation expansion, and zoom; `advanced_craft.md` covers popover motion origin. Neither says to open tooltips, menus, and popovers inside overflow/scroll containers and verify top-layer or portal behavior. [SOURCE: .opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md:38] [SOURCE: .opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md:117] [SOURCE: .opencode/skills/sk-design/design-motion/references/advanced_craft.md:17] [SOURCE: .opencode/skills/sk-design/design-motion/references/advanced_craft.md:21]

Impeccable's overdrive guidance is broader than current motion craft: propose 2-3 directions, get the user pick before code, verify through browser automation, choose one signature moment, and avoid confusing UI enhancement with product/backend feature expansion. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/overdrive.md:16] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/overdrive.md:24] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/overdrive.md:82] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/skill/reference/overdrive.md:120]

Classification: NET-NEW refinements. Minimal future edits: add a live DESIGN.md drift audit clause, one overlay/top-layer hardening probe, and one advanced-motion escalation guardrail.

### Finding 5: Copy, typography, and composition are tail refinements, not first-wave work

The current copy gate already bans common AI marketing filler and several forced voice patterns. [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md:55] [SOURCE: .opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md:57] Impeccable's STYLE document adds paragraph-level specificity, negation-pivot, triadic-list, uniform-paragraph, synthetic-balance, hollow-confidence, and hedge-stack checks. [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/docs/STYLE.md:5] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/docs/STYLE.md:92] [SOURCE: .opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/impeccable-main/docs/STYLE.md:96] These are worth adopting as selected UI-copy examples, not as a build validator or wholesale prose police.

Typography and token items are similarly narrow. `typography_system.md` already warns against reflexive letter spacing and handles localization expansion, while `ai_fingerprint_tells.md` already has the display-tracking floor. [SOURCE: .opencode/skills/sk-design/design-foundations/references/type/typography_system.md:66] [SOURCE: .opencode/skills/sk-design/design-foundations/references/type/typography_system.md:80] [SOURCE: .opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md:70] `design_token_vocabulary.md` names Layer but does not provide a semantic layer order, so a small shared-token refinement remains useful. [SOURCE: .opencode/skills/sk-design/shared/design_token_vocabulary.md:76]

Classification: mostly ALREADY-COVERED, with small NET-NEW examples. Minimal future edits should trail the first wave.

## Questions Answered

- Q1: Answer remains yes for a small backlog, but iteration 10 tightens it: onboarding is partially already-covered, while native palette/mock confirmation, DESIGN.md drift audit, overlay clipping, and overdrive escalation remain genuinely more specific than current `sk-design`.
- Q2: All net-new items map to existing homes: interface, audit, motion, foundations/shared, or md-generator-as-source/evidence. No justified new mode.
- Q3: Structural adoption stays refinement-only: no parallel register, detector engine, score system, prose validator, live mode, or document-seed workflow.
- Q4: Prioritized backlog remains: P1 native visual direction and drift/product-flow refinements; P2 overlay and advanced-motion guardrails; P3 copy, typography, token, and composition examples.

## Questions Remaining

No corpus-coverage question remains open. Remaining work is operational: reduce the research loop to final synthesis and, only if approved later, open a separate implementation packet for the adoption backlog.

## Next Focus

Recommend STOP/synthesis. The next non-research step should be a scoped implementation packet that applies the already-prioritized backlog as surgical edits to existing `sk-design` homes, with no new mode and no parallel detector/register system.
