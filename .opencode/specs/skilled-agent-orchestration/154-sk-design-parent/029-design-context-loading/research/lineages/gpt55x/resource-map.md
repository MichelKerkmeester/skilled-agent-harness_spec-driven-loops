# Resource Map

## READMEs

- `.opencode/skills/deep-loop-runtime/README.md` - fan-out script overview and isolated lineage behavior.

## Documents

- `.opencode/skills/sk-design/shared/register.md` - Brand-vs-Product operating register and downstream dials.
- `.opencode/skills/sk-design/shared/design_token_vocabulary.md` - shared token naming vocabulary.
- `.opencode/skills/sk-design/shared/anti_slop_principles.md` - shared anti-slop vocabulary.
- `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md` - binary interface pre-flight card.
- `.opencode/skills/sk-design/design-interface/references/design-process/brief_to_dials.md` - Design Read and dial intake.
- `.opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md` - interface quality floor.
- `.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md` - OKLCH and contrast repair workflow.
- `.opencode/skills/sk-design/design-foundations/references/color/palette_theming.md` - color roles, dosage and verification.
- `.opencode/skills/sk-design/design-audit/references/audit_contract.md` - severity, score, evidence and output contract.
- `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md` - a11y and performance thresholds.
- `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md` - checkable AI-tell catalog.
- `.opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md` - evidence label worksheet.
- `.opencode/skills/sk-prompt-small-model/references/models/minimax-m3.md` - MiniMax-M3 prompt-craft profile.
- `.opencode/skills/sk-prompt-small-model/assets/cli_prompt_quality_card.md` - CLI prompt quality and profile precedence.
- `.opencode/skills/cli-opencode/assets/prompt_templates.md` - MiniMax executor template.
- `.opencode/skills/deep-loop-runtime/feature_catalog/09--fanout/fanout-merge.md` - fan-out merge feature contract.
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md` - guarded adoption pattern.

## Commands

- Not run: `resolveArtifactRoot`; artifact directory was bound directly to the configured fan-out lineage override.

## Agents

- No sub-agents dispatched from this lineage.

## Skills

- `deep-research` - loop protocol and output/state shape.
- `sk-design` - parent router and design mode family.
- `design-interface` - direction, pre-flight and handoff.
- `design-foundations` - tokens, color, contrast and static system.
- `design-audit` - evidence-backed audit and scoring.
- `sk-prompt-small-model` - MiniMax-M3 prompt craft.
- `cli-opencode` - small-model executor mechanics.
- `deep-loop-runtime` - fan-out isolation and merge.

## Specs

- Target: `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/029-design-context-loading`
- Existing local packet files found before this lineage: `research/orchestration-status.log`

## Scripts

- `.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs` - referenced through documentation, not executed.

## Tests

- Fan-out merge validation docs cite `tests/unit/fanout-merge.vitest.ts`; not executed in this research-only lineage.

## Config

- `config.fanout_lineage_artifact_dir` bound this artifact root.

## Meta

- This map inventories evidence used by the lineage, not the entire repository.
