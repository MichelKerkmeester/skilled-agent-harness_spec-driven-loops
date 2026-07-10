# Iteration 013 - design-motion Traceability + Maintainability + sk-doc

## Dimension

- Iteration: 13 of 20
- Target: `.opencode/skills/sk-design/design-motion/**`
- Focus: traceability, maintainability, and sk-doc structural conformance
- Parallel wave note: correctness/security for this packet is covered by iteration 12; this pass stayed on traceability, maintainability, and sk-doc conformance.

## Files Reviewed

- `.opencode/skills/sk-design/design-motion/SKILL.md:1`
- `.opencode/skills/sk-design/design-motion/SKILL.md:110`
- `.opencode/skills/sk-design/design-motion/SKILL.md:113`
- `.opencode/skills/sk-design/design-motion/SKILL.md:281`
- `.opencode/skills/sk-design/design-motion/SKILL.md:292`
- `.opencode/skills/sk-design/design-motion/README.md:56`
- `.opencode/skills/sk-design/design-motion/README.md:88`
- `.opencode/skills/sk-design/design-motion/README.md:112`
- `.opencode/skills/sk-design/design-motion/procedures/interaction_states_pass.md:1`
- `.opencode/skills/sk-design/design-motion/procedures/interaction_states_pass.md:29`
- `.opencode/skills/sk-design/design-motion/changelog/v1.0.0.0.md:1`
- `.opencode/skills/sk-design/design-motion/feature_catalog/feature_catalog.md:77`
- `.opencode/skills/sk-design/design-motion/feature_catalog/03--procedure-cards/motion-procedure-card-inventory.md:18`
- `.opencode/skills/sk-design/design-motion/manual_testing_playbook/manual_testing_playbook.md:13`
- `.opencode/skills/sk-design/design-motion/manual_testing_playbook/07--procedure-card-contract/card-selection-proof.md:25`
- `.opencode/skills/sk-design/mode-registry.json:82`
- `.opencode/skills/sk-design/mode-registry.json:85`
- `.opencode/skills/sk-design/mode-registry.json:91`
- `.opencode/skills/sk-design/command-metadata.json:727`
- `.opencode/skills/sk-design/command-metadata.json:758`
- `.opencode/skills/sk-design/command-metadata.json:772`
- `.opencode/skills/sk-design/command-metadata.json:803`
- `.opencode/skills/sk-design/command-metadata.json:859`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:166`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:133`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:84`

## Findings by Severity

## P0

- None.

## P1

### P1-013-001 [P1] `/design:motion` command metadata omits the packet's required procedure-card surface

- Claim: The command projection for `/design:motion` does not expose the private procedure-card surface that the packet itself marks as part of the motion routing contract, so command-driven execution can load only `references/` and miss mandatory procedure selection/proof for state-feedback requests.
- Evidence: `command-metadata.json:772` through `command-metadata.json:775` points the command choreography at `.opencode/skills/sk-design/design-motion/references/` and says to load references and assets as required, but it does not name `.opencode/skills/sk-design/design-motion/procedures/`.
- Evidence: `command-metadata.json:803` through `command-metadata.json:804` leaves `taskProjections` empty, so there is no alternate command-level projection for state-feedback or procedure-card routing.
- Evidence: `SKILL.md:110` lists `procedures/interaction_states_pass.md` as conditional internal procedure support, `SKILL.md:113` states the private procedure-card selection table is part of the routing contract, and `SKILL.md:281` through `SKILL.md:284` defines the state-feedback trigger and proof to cite.
- Evidence: `README.md:56` and `README.md:112` expose `procedures/interaction_states_pass.md` as the maintainer-facing procedure card after `motion` is selected.
- Evidence: `manual_testing_playbook/07--procedure-card-contract/card-selection-proof.md:25` through `manual_testing_playbook/07--procedure-card-contract/card-selection-proof.md:35` makes exact card selection and proof a PASS/FAIL scenario.
- Counterevidence sought: Checked whether command metadata compensates through another projection; it has motion identity, proof fields, pipeline, and a generic references/assets choreography, but no procedures resource or state-feedback task projection.
- Alternative explanation: The command metadata may intentionally stay high-level and rely on SKILL.md to discover procedure cards after loading the packet. That still leaves the command projection stale relative to the packet's explicit procedure-surface contract and repeats the same omission pattern recorded for `/design:foundations` in P1-009-001.
- Final severity: P1.
- Confidence: 0.86.
- Downgrade trigger: Downgrade to P2 if the command runner is proven to always load full `SKILL.md` and recursively discover packet `procedures/` regardless of command metadata resources/task projections, making this only a documentation precision gap.

## P2

- None.

## Traceability Checks

- sk-doc structural conformance: PASS. `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-motion --check` returned `Skill is valid` and `Result: PASS` with no warnings.
- `mode-registry.json` packetSkillName parity: PASS. `mode-registry.json:91` through `mode-registry.json:93` declares packet `design-motion`, procedures path `design-motion/procedures`, and packet skill name `design-motion`; `SKILL.md:2` declares `name: design-motion`.
- `mode-registry.json` tool surface parity: PASS. `mode-registry.json:85` through `mode-registry.json:90` allows Read/Glob/Grep, forbids Write/Edit/Bash, and sets `mutatesWorkspace:false`; `SKILL.md:4` allows Read/Grep/Glob and `SKILL.md:292` says the direct fallback cannot rely on Write, Edit, Bash, or Task.
- `mode-registry.json` proceduresPath existence: PASS. `mode-registry.json:92` declares `design-motion/procedures`, and the packet contains `procedures/interaction_states_pass.md` with frontmatter at `procedures/interaction_states_pass.md:1`.
- `/design:motion` command metadata procedure surface: FAIL. The command entry identifies motion at `command-metadata.json:727` through `command-metadata.json:729`, but its choreography and task projections omit the packet's required procedure-card surface.
- Changelog frontmatter: PASS. `changelog/v1.0.0.0.md:1` through `changelog/v1.0.0.0.md:4` includes YAML frontmatter with `version: 1.0.0.0`.
- Packet self-documentation: PASS with the command-metadata exception above. The root README, feature catalog, manual playbook, and procedure-card inventory all describe the private procedure card and read-only boundary.
- Orphan/dead-file scan: PASS for sampled packet structure. The root `feature_catalog.md` indexes the three feature files, the root `manual_testing_playbook.md` indexes all 13 scenario files, and grep confirmed procedure/assets references from SKILL.md, README, catalog, and playbook files.

## Verdict

- CONDITIONAL. One new P1 traceability issue was found in command metadata for `/design:motion`.

## Next Dimension

- Continue Wave 3/4 as scheduled. The next reducer pass should merge P1-013-001 with the existing command-metadata omission pattern without changing iteration 12's correctness/security scope.

Review verdict: CONDITIONAL
