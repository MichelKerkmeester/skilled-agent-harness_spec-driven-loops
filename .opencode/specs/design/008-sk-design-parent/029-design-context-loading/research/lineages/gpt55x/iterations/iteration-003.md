# Iteration 3: Audit contract versus ad-hoc audit

## Focus

Investigate which audit resources must load when an agent reviews, scores, or claims a UI is ready.

## Findings

1. Interface has a mechanical pre-flight card that says every box is binary and a single fail means the surface is not done. It explicitly covers register, dials, breakpoints, contrast, real imagery, copy, motion and AI tells. [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:16] [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:24]

2. The pre-flight card makes contrast, overflow, reduced motion and AI-tell checks operational. It requires button text contrast against the real background, no text overflow at breakpoints, reduced motion alternatives, and an AI-tell sweep. [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:82] [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:96] [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:138] [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:147]

3. Audit mode is a separate QA contract. It requires resolving the target and register, stating evidence available and missing, scoring five dimensions, producing severity-ordered findings, and mapping each fix to the owning skill. [SOURCE: file:.opencode/skills/sk-design/design-audit/SKILL.md:267] [SOURCE: file:.opencode/skills/sk-design/design-audit/SKILL.md:269] [SOURCE: file:.opencode/skills/sk-design/design-audit/SKILL.md:275]

4. The audit contract says findings must include evidence, category, impact, recommended fix, and owner. It also says inferred issues must be labeled and that agents must not claim browser inspection, overlays, or scans unless those actually ran. [SOURCE: file:.opencode/skills/sk-design/design-audit/references/audit_contract.md:48] [SOURCE: file:.opencode/skills/sk-design/design-audit/references/audit_contract.md:61]

5. The evidence worksheet provides a fill-in mechanism for target, evidence inventory, dimension coverage, probe ledger and finding handoff rows. This is the missing structure when audit becomes ad-hoc prose. [SOURCE: file:.opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md:15] [SOURCE: file:.opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md:26] [SOURCE: file:.opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md:45]

## Sources Consulted

- `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-audit/references/audit_contract.md`
- `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md`
- `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md`
- `.opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md`

## Assessment

`newInfoRatio`: 0.82

Novelty justification: separated the two necessary gates: pre-flight before delivery, formal audit for evidence-backed scoring and remediation ownership.

Confidence: high. The audit and interface files are explicit and mutually reinforcing.

## Reflection

What worked: The pre-flight card should be treated as a build self-check, while the audit contract is a review output contract.

What failed or was ruled out: A checklist-free "looks good" or "I audited it" statement cannot support release readiness.

## Recommended Next Focus

Read CLI dispatch and small-model prompt contracts to determine how this context must be handed to sub-agents and MiniMax-M3.
