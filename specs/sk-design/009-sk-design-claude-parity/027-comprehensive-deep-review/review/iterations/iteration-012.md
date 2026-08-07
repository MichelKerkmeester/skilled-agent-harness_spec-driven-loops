# Iteration 012 - Design Motion Correctness + Security

## Dimension

- Iteration: 12 of 20
- Mode: review
- Target agent: deep-review
- Focus: correctness and security for `.opencode/skills/sk-design/design-motion/**`
- Assignment boundary: reviewed only the `design-motion` packet, plus required shared doctrine and hub metadata comparison inputs.

## Files Reviewed

- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:9`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:73`
- `.opencode/skills/sk-design/mode-registry.json:81`
- `.opencode/skills/sk-design/mode-registry.json:85`
- `.opencode/skills/sk-design/mode-registry.json:91`
- `.opencode/skills/sk-design/mode-registry.json:95`
- `.opencode/skills/sk-design/command-metadata.json:727`
- `.opencode/skills/sk-design/command-metadata.json:758`
- `.opencode/skills/sk-design/command-metadata.json:772`
- `.opencode/skills/sk-design/command-metadata.json:803`
- `.opencode/skills/sk-design/design-motion/SKILL.md:4`
- `.opencode/skills/sk-design/design-motion/SKILL.md:84`
- `.opencode/skills/sk-design/design-motion/SKILL.md:110`
- `.opencode/skills/sk-design/design-motion/SKILL.md:113`
- `.opencode/skills/sk-design/design-motion/SKILL.md:264`
- `.opencode/skills/sk-design/design-motion/SKILL.md:277`
- `.opencode/skills/sk-design/design-motion/SKILL.md:283`
- `.opencode/skills/sk-design/design-motion/SKILL.md:284`
- `.opencode/skills/sk-design/design-motion/SKILL.md:292`
- `.opencode/skills/sk-design/design-motion/SKILL.md:342`
- `.opencode/skills/sk-design/design-motion/SKILL.md:357`
- `.opencode/skills/sk-design/design-motion/references/animation_decision_framework.md:35`
- `.opencode/skills/sk-design/design-motion/references/motion_strategy.md:46`
- `.opencode/skills/sk-design/design-motion/references/motion_strategy.md:57`
- `.opencode/skills/sk-design/design-motion/references/micro_interactions.md:35`
- `.opencode/skills/sk-design/design-motion/references/animate_presence_patterns.md:35`
- `.opencode/skills/sk-design/design-motion/references/performance_reduced_motion.md:43`
- `.opencode/skills/sk-design/design-motion/references/advanced_craft.md:35`
- `.opencode/skills/sk-design/design-motion/references/corpus_map.md:33`
- `.opencode/skills/sk-design/design-motion/procedures/interaction_states_pass.md:17`
- `.opencode/skills/sk-design/design-motion/procedures/interaction_states_pass.md:29`
- `.opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md:26`
- `.opencode/skills/sk-design/design-motion/assets/animate_presence_checklist.md:30`
- `.opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md:40`

## Findings By Severity

### P0

- None.

### P1

#### P1-012-001 [P1] `/design:motion` metadata omits the packet's required procedure-card surface

- File: `.opencode/skills/sk-design/command-metadata.json:758`
- Claim: `/design:motion` command metadata does not enumerate the motion packet's own `procedures/` surface even though the packet makes procedure-card selection part of the motion routing/proof contract.
- Evidence: `command-metadata.json:758` through `command-metadata.json:776` defines `/design:motion` choreography as parent hub load, `design-motion/SKILL.md`, then `design-motion/references/`, with no `design-motion/procedures/` or shared procedure resource.
- Evidence: `design-motion/SKILL.md:110` lists `procedures/interaction_states_pass.md` and `../shared/procedures/polish_gate_orchestration.md` as conditional internal procedure support.
- Evidence: `design-motion/SKILL.md:113` states the private procedure-card selection table is part of the routing contract and requires citing a procedure card or no-procedure fallback.
- Evidence: `design-motion/SKILL.md:277` through `design-motion/SKILL.md:286` defines the actual procedure-card selection table, including `procedures/interaction_states_pass.md` and `../shared/procedures/polish_gate_orchestration.md`.
- Evidence: `design-motion/procedures/interaction_states_pass.md:17` through `design-motion/procedures/interaction_states_pass.md:27` defines the required fields, trigger, output contract, proof gate, and privacy rule for the motion procedure card.
- Counterevidence sought: I checked whether `/design:motion` had a `tasks`, `taskProjections`, `proofFields`, or choreography entry for procedure selection. `command-metadata.json:803` has proof fields only, `command-metadata.json:804` has empty `taskProjections`, and the choreography stops at `references/`.
- Alternative explanation: The command metadata may intend `references/` as a broad shorthand for all packet internals, but prior Wave 2 found this same omission pattern for `/design:foundations` as P1-009-001, and the motion packet separately treats procedures as a private but load-bearing support surface rather than general references.
- Finding class: cross-consumer
- Scope proof: The motion packet has exactly one local procedure file from the packet glob, and the shared procedure path exists under `.opencode/skills/sk-design/shared/procedures/polish_gate_orchestration.md`; neither is named by the `/design:motion` choreography.
- Affected surface hints: [`/design:motion`, `command-metadata.json`, `design-motion/procedures`, `shared/procedures`, `procedure-card routing`]
- Recommendation: Add the motion procedure-card surface to `/design:motion` metadata, or add an explicit command projection/proof field that covers procedure-card selection and no-card fallback.
- Final severity: P1
- Confidence: 0.90
- Downgrade trigger: Downgrade to P2 only if command metadata is explicitly documented as intentionally excluding all private procedure cards while another generated command surface reliably loads and verifies procedure-card selection for `/design:motion`.

### P2

- None.

## Traceability Checks

- `spec_code`: PASS. Review stayed inside `.opencode/skills/sk-design/design-motion/**` for target evidence, with only required doctrine/state and hub metadata comparison inputs outside the packet.
- `checklist_evidence`: N/A. This leaf review produced evidence artifacts only and did not update checklist completion state.
- `skill_agent`: PASS. The packet frontmatter allows only `Read`, `Grep`, and `Glob` at `design-motion/SKILL.md:4`, matching `mode-registry.json:85` through `mode-registry.json:89`; no reviewed packet guidance required `Write`, `Edit`, `Bash`, or `Task` to apply motion judgment.
- `agent_cross_runtime`: PASS. No sub-agents were dispatched; direct fallback is explicitly Read/Glob/Grep-only at `design-motion/SKILL.md:292`.
- `feature_catalog_code`: PARTIAL. Feature catalog traceability is assigned to iteration 13; this correctness/security pass used packet assets/procedures/references only to validate command-surface completeness and unsafe-pattern risk.
- `playbook_capability`: PARTIAL. Manual playbook files were discovered and link-indexed during scope inspection, but detailed playbook capability review is assigned to iteration 13.

## Verdict

CONDITIONAL. One new P1 was found. No P0 or security vulnerability was found in the reviewed motion examples or tool-surface declarations.

## Next Dimension

Iteration 13 should continue with traceability, maintainability, and sk-doc conformance for the same `design-motion` packet without re-counting P1-012-001 unless it finds stronger or conflicting evidence.

Review verdict: CONDITIONAL
