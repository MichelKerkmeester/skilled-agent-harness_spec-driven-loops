---
title: Deep Review Iteration 004 - Traceability
description: Traceability review narrative for sk-design 009 Claude-parity deep review.
---

# Deep Review Iteration 004 - Traceability

## Dimension

Traceability. This pass reviewed spec-to-code alignment, checklist evidence, feature-catalog-to-code coverage, procedure-card playbook capability, command projection parity, and the remediation-sensitive Phase 010 and Phase 012 tracking claims. Code graph status was checked and remains stale, so this pass used graphless fallback with direct reads, targeted globs, and exact grep evidence.

## Files Reviewed

| Area | Evidence | Result |
|------|----------|--------|
| Review state and severity doctrine | `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md:119`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-002.md:32`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-003.md:32`, `.opencode/skills/sk-code/code-review/references/review_core.md:28` | Traceability was the planned next dimension; P1-001 through P1-003 were treated as existing findings and not re-reported. |
| Code graph readiness | `code_graph_status` result: freshness `stale`, reason `git HEAD changed`, newer mtimes, and removed tracked files | Structural graph assertions were not trusted; graphless fallback was used. |
| Phase 010 feature-catalog remediation | `.opencode/specs/sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness/implementation-summary.md:44`, `.opencode/specs/sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness/implementation-summary.md:57`, `.opencode/specs/sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness/checklist.md:60`, `.opencode/specs/sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness/checklist.md:136` | File-count, package-layout, and completion claims match the observed feature-catalog tree and sampled catalog content. No Phase 010 remediation false-completion finding. |
| Phase 011 playbook alignment | `.opencode/specs/sk-design/009-sk-design-claude-parity/011-manual-testing-playbook-alignment/implementation-summary.md:42`, `.opencode/specs/sk-design/009-sk-design-claude-parity/011-manual-testing-playbook-alignment/checklist.md:60`, `.opencode/specs/sk-design/009-sk-design-claude-parity/011-manual-testing-playbook-alignment/checklist.md:75` | Claimed 23 new scenario files and procedure-card coverage were spot-checked against live scenario files and mode SKILL contracts. No new finding. |
| Phase 012 benchmark reconciliation | `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/spec.md:31`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/spec.md:128`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:241`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:259`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/checklist.md:155` | ADR-003 holds as an accepted-risk descope: measured floors are recorded as PASS and unbuilt expanded-battery/live/advisor/procedure-card work remains visible as NOT MET or UNSCORED. No fabricated score found. |
| Feature catalog samples across all six packages | `.opencode/skills/sk-design/feature_catalog/01--manager-shell/context-first-intake-and-visible-plan.md:26`, `.opencode/skills/sk-design/SKILL.md:41`, `.opencode/skills/sk-design/design-interface/feature_catalog/01--aesthetic-direction-process/two-pass-grounding-and-critique.md:26`, `.opencode/skills/sk-design/design-interface/references/design-process/design_principles.md:66`, `.opencode/skills/sk-design/design-foundations/feature_catalog/01--token-system/oklch-color-and-token-system.md:26`, `.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md:48`, `.opencode/skills/sk-design/design-motion/feature_catalog/01--restraint-gate-and-choreography/motion-restraint-gate.md:26`, `.opencode/skills/sk-design/design-motion/references/animation_decision_framework.md:35`, `.opencode/skills/sk-design/design-audit/feature_catalog/01--findings-first-review/findings-first-report-and-scoring.md:26`, `.opencode/skills/sk-design/design-audit/references/audit_contract.md:36` | Hub/interface/foundations/motion/audit samples match live source contracts. The md-generator report/preview sample produced P1-004 below. |
| md-generator report/preview catalog and scripts | `.opencode/skills/sk-design/design-md-generator/feature_catalog/05--report-preview/report-preview.md:59`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:650`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:249`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:436` | New P1-004: the catalog promises no silent overwrite, but scripts overwrite fixed artifact names with no guard or confirmation. |
| Procedure-card playbook capability | `.opencode/skills/sk-design/design-interface/manual_testing_playbook/14--procedure-card-contract/card-selection-proof.md:33`, `.opencode/skills/sk-design/design-interface/SKILL.md:151`, `.opencode/skills/sk-design/design-foundations/manual_testing_playbook/07--procedure-card-contract/card-selection-proof.md:27`, `.opencode/skills/sk-design/design-foundations/SKILL.md:257`, `.opencode/skills/sk-design/design-motion/manual_testing_playbook/07--procedure-card-contract/direct-fallback-without-subagents.md:29`, `.opencode/skills/sk-design/design-motion/SKILL.md:288`, `.opencode/skills/sk-design/design-audit/manual_testing_playbook/05--procedure-card-contract/no-card-fallback.md:24`, `.opencode/skills/sk-design/design-audit/SKILL.md:299`, `.opencode/skills/sk-design/design-md-generator/manual_testing_playbook/16--procedure-card-contract/backend-preserving-direct-fallback.md:21`, `.opencode/skills/sk-design/design-md-generator/SKILL.md:242` | Scenario claims are exercisable against live card-selection/fallback contracts. No new playbook-capability finding. |
| Command projection parity | `.opencode/skills/sk-design/mode-registry.json:32`, `.opencode/skills/sk-design/mode-registry.json:37`, `.opencode/skills/sk-design/mode-registry.json:117`, `.opencode/commands/design/interface.md:4`, `.opencode/commands/design/foundations.md:4`, `.opencode/commands/design/motion.md:4`, `.opencode/commands/design/audit.md:4`, `.opencode/commands/design/md-generator.md:4`, `.opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor/implementation-summary.md:43` | The five command files still project the current registry behavior accurately: four read-only commands and one mutating md-generator command. Phase 013 is planning-only and does not falsely claim implementation. |

## Findings by Severity

### P0

None.

### P1

#### P1-004 [P1] Report/preview catalog promises overwrite protection the scripts do not implement

- File: `.opencode/skills/sk-design/design-md-generator/feature_catalog/05--report-preview/report-preview.md:59`
- Claim: The md-generator feature catalog says the report, preview, and proof scripts do not silently overwrite existing artifacts, but the implementation writes fixed output filenames with `fs.writeFileSync` and has no existing-file guard, `--force`, confirmation, or clean-directory check.
- Evidence: The catalog states, "They do not silently overwrite existing artifacts; specify a clean directory or accept the overwrite explicitly." The implementation writes `report.html`, `preview.html`, `proof-data.json`, and `proof.html` directly under the requested output directory. Evidence: `.opencode/skills/sk-design/design-md-generator/feature_catalog/05--report-preview/report-preview.md:59`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:53`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:650`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:651`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:249`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:252`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:436`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:441`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:442`.
- Counterevidence sought: I searched the three scripts for `existsSync`, `overwrite`, `force`, `confirm`, and `writeFileSync`. The only existence checks read optional inputs or prerequisites (`designMdPath`, `proof-data.json`, `tokensPath`, `preview.html`); none checks the output artifact path before writing. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:637`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:644`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:252`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:309`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:394`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:436`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:442`.
- Alternative explanation: The intended contract may be that a user-specified output directory implicitly accepts overwrites. That is a valid product choice, but it is not what the catalog currently says; the catalog explicitly promises no silent overwrite and an explicit accept-overwrite path.
- Final severity: P1. This is a traceability and safety-contract mismatch in the generated-artifact path. It is not P0 because filenames are fixed, the operator supplies the output directory, and no arbitrary path traversal was confirmed in this check.
- Confidence: 0.86.
- Downgrade trigger: Downgrade to P2 if the documented contract is intentionally changed to say these scripts overwrite fixed artifacts in the chosen output directory, with clear operator guidance; otherwise add an output-exists guard or explicit `--force` behavior and tests/manual-playbook coverage.
- Finding class: cross-consumer.
- Affected surface hints: `feature_catalog/05--report-preview/report-preview.md`, `report-gen.ts`, `preview-gen.ts`, `proof.ts`, report/preview/proof manual playbook scenarios, P1-002 output-boundary remediation.
- Recommendation: Align documentation and behavior. Either implement a shared `assertWritableArtifact()` guard for fixed report/preview/proof outputs with explicit force/clean-dir behavior, or amend the feature catalog and playbook to honestly state overwrite semantics.

### P2

None.

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| `spec_code` | Covered with one new defect | Phase 010, Phase 012, md-generator report/preview scripts, command projections, and playbook contracts were checked against live files. P1-004 is the only new spec/code mismatch. |
| `checklist_evidence` | Covered, no new checklist-only defect | Phase 010/011/012/013 checked evidence was spot-checked against real files and live command/registry evidence. Phase 012's NOT MET rows are explicit ADR-003 descope, not fabricated pass rows. |
| `skill_agent` | Covered, no new defect | Hub/mode SKILL contracts and command frontmatters still match registry tool surfaces. |
| `agent_cross_runtime` | Not applicable | Strategy marks this N/A for sk-design; no dedicated design agent family is in this packet. |
| `feature_catalog_code` | Covered with one new defect | Hub/interface/foundations/motion/audit samples matched source; md-generator report/preview produced P1-004. |
| `playbook_capability` | Covered, no new defect | Sampled procedure-card-contract scenarios match live SKILL card-selection and fallback contracts. |
| `command_projection_parity` | Covered, no new defect | Five `/design:*` commands still map to the current five-mode registry and tool-surface split. |

## Search Depth

Scope class is complex. This iteration used graphless fallback because `code_graph_status` reported stale readiness. Target selection prioritized the remediation-sensitive phases (010 and 012), then sampled every feature-catalog package, the new Phase 011 procedure-card-contract playbook scenarios, and all five command files against `mode-registry.json`. High-risk targets not exhaustively covered: full line-by-line validation of every feature-catalog leaf and actual live execution of every manual playbook scenario.

## SCOPE VIOLATIONS

None. No reviewed target source/spec files were modified.

## Verdict

CONDITIONAL for iteration 4 traceability: one new P1 finding is open. No P0 findings were discovered.

## Next Dimension

Iteration 5 should review maintainability: procedure-card/schema drift cost, feature-catalog maintenance burden, duplicate benchmark artifact naming, Phase 012 future-work handoff clarity, and md-generator backend/report surface maintainability around the active P1s.

Review verdict: CONDITIONAL
