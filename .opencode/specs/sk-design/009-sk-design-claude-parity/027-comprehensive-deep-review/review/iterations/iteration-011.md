# Iteration 011 - design-audit Traceability, Maintainability, sk-doc Conformance

## Dimension

- Iteration: 11 of 20
- Wave: 3
- Target: `.opencode/skills/sk-design/design-audit/**`
- Focus: traceability, maintainability, and sk-doc structural conformance for the `design-audit` mode packet
- Doctrine loaded: `.opencode/skills/sk-code/code-review/references/review_core.md:28`

## Files Reviewed

- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-findings-registry.json:9`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-strategy.md:8`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-config.json:44`
- `.opencode/specs/sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review/review/deep-review-state.jsonl:1`
- `.opencode/skills/sk-code/code-review/references/review_core.md:28`
- `.opencode/skills/system-deep-loop/deep-review/references/protocol/quick_reference.md:166`
- `.opencode/skills/sk-design/mode-registry.json:103`
- `.opencode/skills/sk-design/command-metadata.json:3`
- `.opencode/skills/sk-design/design-audit/SKILL.md:1`
- `.opencode/skills/sk-design/design-audit/README.md:79`
- `.opencode/skills/sk-design/design-audit/procedures/accessibility_audit.md:1`
- `.opencode/skills/sk-design/design-audit/procedures/ai_slop_check.md:1`
- `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:18`
- `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md:144`
- `.opencode/skills/sk-design/design-audit/references/critique_hardening.md:133`

## Findings by Severity

### P0

- None.

### P1

#### P1-011-001: `/design:audit` metadata omits the packet's procedure-card surface

- Claim: `/design:audit` command metadata does not reflect the packet's actual procedure-card surface even though the registry and packet contract make `design-audit/procedures` part of audit routing.
- Evidence: `mode-registry.json` declares the audit packet as `design-audit` and `proceduresPath: "design-audit/procedures"` at `.opencode/skills/sk-design/mode-registry.json:112` through `.opencode/skills/sk-design/mode-registry.json:114`.
- Evidence: `SKILL.md` lists internal procedure support at `.opencode/skills/sk-design/design-audit/SKILL.md:114` and states the private procedure-card selection table is part of the routing contract at `.opencode/skills/sk-design/design-audit/SKILL.md:117`.
- Evidence: `SKILL.md` requires selecting at most one procedure card and citing it by relative path at `.opencode/skills/sk-design/design-audit/SKILL.md:291` through `.opencode/skills/sk-design/design-audit/SKILL.md:299`.
- Evidence: the feature catalog independently describes the two private cards as the design-audit procedure-card surface at `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:18` through `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:28`.
- Evidence: `/design:audit` command choreography loads the packet SKILL and then only `.opencode/skills/sk-design/design-audit/references/`, with no procedure-card surface named, at `.opencode/skills/sk-design/command-metadata.json:48` through `.opencode/skills/sk-design/command-metadata.json:52`.
- Counterevidence sought: searched `.opencode/skills/sk-design/command-metadata.json` for `design-audit/procedures`, `procedures/accessibility_audit`, `procedures/ai_slop_check`, `shared/procedures`, `polish_gate_orchestration`, and `procedures/`; no matches were found.
- Alternative explanation: the command metadata may intend the `SKILL.md` load to subsume private procedures. That does not match the command projection pattern being reviewed because the metadata explicitly projects follow-on resources for commands, and this packet has a declared `proceduresPath` plus a routing-proof obligation.
- Final severity: P1.
- Confidence: 0.88.
- Downgrade trigger: downgrade to P2 if the command metadata schema is documented to intentionally omit private procedure-card surfaces for all modes, or if `/design:audit` is updated to project `design-audit/procedures/accessibility_audit.md`, `design-audit/procedures/ai_slop_check.md`, and the shared polish card.

### P2

#### P2-011-001: `package_skill.py --check` warns that `design-audit/SKILL.md` exceeds the recommended size budget

- Finding: sk-doc package validation passes, but reports a package-size warning for the design-audit packet entrypoint.
- Evidence: `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-design/design-audit --check` returned `Result: PASS` with `SKILL.md has 3281 words (recommended max: 3000)`.
- Exact violated recommendation: `SKILL.md` recommended maximum is 3000 words; observed word count is 3281.
- File: `.opencode/skills/sk-design/design-audit/SKILL.md:1`.
- Final severity: P2.
- Confidence: 0.99.
- Recommendation: move non-routing explanatory material from `SKILL.md` into packet references while preserving the routing table, procedure selection contract, and success criteria.

## Traceability Checks

- sk-doc structural conformance: PASS with warning. `package_skill.py --check` reports the packet is valid, with one warning for `SKILL.md` size.
- `packetSkillName`: PASS. `mode-registry.json` declares `packet: "design-audit"` and `packetSkillName: "design-audit"` at `.opencode/skills/sk-design/mode-registry.json:112` and `.opencode/skills/sk-design/mode-registry.json:114`; packet frontmatter declares `name: design-audit` at `.opencode/skills/sk-design/design-audit/SKILL.md:2`.
- `proceduresPath`: PASS for existence, FAIL for command projection. `mode-registry.json:113` declares `design-audit/procedures`, and the two cards exist at `.opencode/skills/sk-design/design-audit/procedures/accessibility_audit.md:1` and `.opencode/skills/sk-design/design-audit/procedures/ai_slop_check.md:1`; `/design:audit` command metadata omits them.
- `toolSurface`: PASS at coarse metadata level. `mode-registry.json:106` through `mode-registry.json:110` allows Read/Glob/Grep and forbids Write/Edit/Bash; packet frontmatter allows Read/Grep/Glob at `.opencode/skills/sk-design/design-audit/SKILL.md:4`.
- `skill_agent`: PASS. No subagents were dispatched; the packet requires direct fallback with Read/Glob/Grep only at `.opencode/skills/sk-design/design-audit/SKILL.md:305`.
- `agent_cross_runtime`: N/A. This leaf review did not dispatch agents.
- `feature_catalog_code`: PASS for the procedure-card inventory. The catalog enumerates the two procedure cards and their shared-card handoffs at `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:18` through `.opencode/skills/sk-design/design-audit/feature_catalog/03--procedure-cards/audit-procedure-card-inventory.md:40`.
- `playbook_capability`: PASS by sampled procedure-card scenario coverage. `README.md` points to the manual playbook at `.opencode/skills/sk-design/design-audit/README.md:102` through `.opencode/skills/sk-design/design-audit/README.md:109`; grep confirmed `manual_testing_playbook/05--procedure-card-contract/card-selection-proof.md` covers both cards.
- Maintainability duplication check: no new finding. The packet uses the shared register/context/handoff base by reference in `SKILL.md:99` through `SKILL.md:114`, and the only script-backed references found were discoverability aids or deterministic checks already referenced from packet docs.

## Verdict

CONDITIONAL. One new P1 requires remediation before this packet's command metadata can be considered traceable to its actual procedure-card surface. One P2 sk-doc size warning remains advisory.

## Next Dimension

Continue Wave 3 with sibling iteration outputs for correctness/security on `design-audit` and the two `design-motion` passes. Do not update the shared registry or strategy until the whole wave is merged.

Review verdict: CONDITIONAL
