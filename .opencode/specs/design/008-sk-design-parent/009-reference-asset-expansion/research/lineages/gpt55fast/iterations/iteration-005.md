# Iteration 5: Audit Expansion Leverage

## Focus

Identify the highest-leverage reference and asset additions for `design-audit`.

## Findings

- Add an evidence-capture reference. `critique` requires two independent assessments and detector/browser evidence before synthesis [SOURCE: .opencode/specs/design/008-sk-design-parent/external/critique.md:12], while current audit has score/severity references but not a dedicated evidence-capture protocol [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:312].
- Add accessibility quick-fix snippets as an asset. `fixing-accessibility` prioritizes accessible names, keyboard access, focus/dialogs, semantics, forms/errors, announcements, contrast/states, media/motion, and tool boundaries [SOURCE: .opencode/specs/design/008-sk-design-parent/external/fixing-accessibility.md:33].
- Add hardening edge-case matrix. `harden` tests long/short text, special characters, large numbers, no data, network/API/validation/permission/rate/concurrency failures, and i18n/RTL expansion [SOURCE: .opencode/specs/design/008-sk-design-parent/external/harden.md:14].
- Add transform/remediation reference that maps bolder/quieter/distill/redesign moves to existing owners. Prior gap analysis marks transform verbs and redesign/remediation as should-adds under audit/interface modes [SOURCE: .opencode/specs/design/008-sk-design-parent/001-corpus-research/research/gap-analysis.md:17].
- Do not make audit implement fixes. Current audit integration delegates direction to interface, color/type/layout to foundations, motion to motion, and implementation to sk-code [SOURCE: .opencode/skills/sk-design/design-audit/SKILL.md:337].

## Sources Consulted

- `.opencode/skills/sk-design/design-audit/SKILL.md:312`
- `.opencode/specs/design/008-sk-design-parent/external/audit.md:12`
- `.opencode/specs/design/008-sk-design-parent/external/critique.md:12`
- `.opencode/specs/design/008-sk-design-parent/external/fixing-accessibility.md:33`
- `.opencode/specs/design/008-sk-design-parent/external/harden.md:14`

## Assessment

- newInfoRatio: 0.46
- Novelty: Medium. Audit has strong foundations; additions make output more evidence-backed and actionable.
- Confidence: High.

## Reflection

What worked: separating audit evidence from remediation ownership.
What failed: importing full critique orchestration would conflict with current audit's simpler mode contract.
Ruled out: adding sub-agent orchestration to audit references.

## Recommended Next Focus

Investigate `md-generator`, where extraction maturity suggests a different expansion strategy.
