---
title: Deep Review Iteration 002 - Correctness
description: Correctness review narrative for sk-design 009 Claude-parity deep review.
---

# Deep Review Iteration 002 - Correctness

## Dimension

Correctness. This pass reviewed mode-routing invariants, read-only versus mutating execution-path boundaries, md-generator TypeScript entrypoints, and the two remediation-sensitive phase records called out by the strategy: Phase 010 feature-catalog remediation and Phase 012 benchmark reconciliation.

## Files Reviewed

| Area | Evidence | Result |
|------|----------|--------|
| Prior state and severity doctrine | `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md:115`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-001.md:73`, `.opencode/skills/sk-code/code-review/references/review_core.md:28` | Iteration 1 deferred deep correctness to this pass; severity definitions loaded before final severity calls. |
| Hub and registry routing | `.opencode/skills/sk-design/SKILL.md:39`, `.opencode/skills/sk-design/mode-registry.json:32`, `.opencode/skills/sk-design/hub-router.json:27` | Five modes are declared consistently; hub prose says registry-driven routing, registry contains the same five workflow modes, and hub-router resources point at the same packet SKILL files. |
| Mode packet tool surfaces | `.opencode/skills/sk-design/design-interface/SKILL.md:1`, `.opencode/skills/sk-design/design-foundations/SKILL.md:1`, `.opencode/skills/sk-design/design-motion/SKILL.md:1`, `.opencode/skills/sk-design/design-audit/SKILL.md:1`, `.opencode/skills/sk-design/design-md-generator/SKILL.md:1` | The four guidance modes expose Read/Grep/Glob only; md-generator exposes Read/Write/Edit/Bash/Glob/Grep. This matches `mode-registry.json` tool surfaces. |
| md-generator entrypoints | `.opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts:30`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:81`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/validate.ts:414`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:53` | `extract.ts` output guard and fast/default parsing are coherent. `validate.ts` has v3 section checks and quick-start fidelity checks. `build-write-prompt.ts` has the confirmed P1 below. |
| Component data contract | `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md:157`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:461`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/cluster.ts:1291`, `.opencode/skills/sk-design/design-md-generator/backend/tests/build-write-prompt.test.ts:23` | v3 format requires exact component values; component style data exists in tokens, but current prompt-building tests do not assert component facts are exposed. |
| Phase 010 remediation | `.opencode/specs/sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness/spec.md:102`, `.opencode/specs/sk-design/009-sk-design-claude-parity/010-feature-catalog-completeness/implementation-summary.md:44` | Phase 010's file-list and remediation summary are internally consistent for this correctness pass; no new Phase 010 finding. |
| Phase 012 reconciliation | `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/decision-record.md:241`, `.opencode/specs/sk-design/009-sk-design-claude-parity/012-routing-benchmark-rigor/implementation-summary.md:121` | Phase 012 explicitly records the accepted descope and unscored dimensions instead of claiming expanded-battery completion; no new Phase 012 correctness finding. |

## Findings by Severity

### P0

None.

### P1

#### P1-001 [P1] WRITE prompt omits component facts while requiring exact component values

- File: `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:53`
- Claim: The md-generator WRITE prompt builder cannot reliably satisfy the v3 Components exact-value contract because it never emits component style facts, while later instructing the writer to include exact component values.
- Evidence: `buildWritePrompt()` only pre-renders colors, spacing/shapes, surfaces, and Quick Start, then appends `typeScaleFacts(tokens)` and `honestFacts(tokens)` as the FACTS block; neither includes `tokens.components` or component variant styles. The same prompt then requires `## Components` with exact values from component data. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:53`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:80`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:91`.
- Required contract: The v3 format requires Components prose with exact values for background, text color/size/family/weight, padding, radius, border, hover/focus states, transition, and example labels. Evidence: `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md:157`.
- Data exists but is not surfaced: `ComponentGroup` / `ComponentVariant` carry `style`, state diffs, transition, and sample texts, and `cluster.ts` populates these fields from representative elements. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:461`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/cluster.ts:1291`.
- Counterevidence sought: I checked the prompt-builder tests for coverage; they assert deterministic pre-rendering, Quick Start, FACTS presence, and focus honesty, but not component fact emission. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/tests/build-write-prompt.test.ts:23`.
- Alternative explanation: A human writer could separately read `tokens.json` and manually inspect `components`, but the feature catalog and prompt builder claim the WRITE phase writes prose only from pre-rendered sections or the FACTS block. That claimed self-contained value-provenance path does not hold for Components. Evidence: `.opencode/skills/sk-design/design-md-generator/feature_catalog/03--write-design-md/write-design-md.md:20`.
- Final severity: P1. This is a correctness/spec-contract gap in a generated artifact path, not a P0 data-loss or security issue.
- Confidence: 0.88.
- Downgrade trigger: Downgrade to P2 if a separate documented WRITE workflow always provides full `tokens.components` to the writer alongside this prompt and tests assert that handoff; no such counterevidence was found in this pass.
- Finding class: cross-consumer.
- Affected surface hints: `build-write-prompt.ts`, v3 `Components` section, `DESIGN.md` fidelity contract, md-generator write-phase tests.
- Recommendation: Add deterministic component facts or a pre-rendered Components section to `build-write-prompt.ts`, then extend `build-write-prompt.test.ts` to assert representative component styles, states, transitions, and sample labels are surfaced verbatim.

### P2

None.

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| `spec_code` | Partial | Correctness checked against routing and md-generator implementation anchors; one P1 found in the write-prompt path. |
| `checklist_evidence` | Partial, no new defect | Phase 010 and Phase 012 remediation/reconciliation records were sampled and did not produce a new correctness defect. |
| `skill_agent` | Partial, no new defect | Hub, registry, router, and five mode SKILL frontmatters agree on the five-mode routing and tool-surface split. |
| `agent_cross_runtime` | Not applicable | Strategy marks this N/A for sk-design; no dedicated design agent family is in this packet. |
| `feature_catalog_code` | Partial | The md-generator feature catalog's WRITE-phase claim was checked against code and contributed to P1-001. Full catalog traceability remains for the traceability dimension. |
| `playbook_capability` | Partial / deferred | Playbook inventory was confirmed by glob; full scenario-to-capability validation is deferred to traceability/maintainability iterations. |

## Search Depth

Scope class is complex. This iteration used graphless fallback because iteration 1 recorded the code graph as stale. Search coverage used direct reads of the routing hub, registry, router, five mode packets, md-generator backend entrypoints, component token definitions, prompt-builder tests, feature catalog write-phase docs, and the Phase 010/012 remediation records. High-risk targets deferred to later dimensions: security-specific path/command injection checks, full command-file review, and full manual-playbook scenario validation.

## SCOPE VIOLATIONS

None. No reviewed target files were modified.

## Verdict

CONDITIONAL for iteration 2 correctness: one P1 finding is open. No P0 findings were discovered.

## Next Dimension

Iteration 3 should review security: md-generator output-path guards, shell/Bash boundaries, prompt/template injection risks, generated artifact write locations, and trust-boundary differences between read-only modes and the mutating md-generator mode.

Review verdict: CONDITIONAL
