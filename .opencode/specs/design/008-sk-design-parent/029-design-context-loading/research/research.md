# Research Synthesis: Preventing sk-design Context Under-Loading

## 1. Executive Answer

The reliable fix is not "remind agents to read more." The fix is a small, enforceable `sk-design` context-loading contract:

1. Classify the surface register first.
2. For UI build/redesign work, auto-load a design bundle rather than a single mode.
3. Require a context manifest before dispatch or implementation.
4. Require a filled pre-flight/evidence card before any ready/release/accessibility claim.
5. For small models, embed the same manifest inside the model-specific scaffold, especially MiniMax-M3's TIDD-EC dense pre-plan.
6. Adopt lineage recommendations only after merge attribution plus gated validation.

The observed misses map cleanly to missing proof fields: no register proof, no foreground/background contrast pair inventory, no pre-flight card, and no small-model prompt profile.

## 2. Scope

This lineage researched mechanism design only. It did not modify canonical `sk-design`, `cli-opencode`, `sk-prompt-models`, or deep-loop runtime files.

## 3. Evidence Base

The strongest source cluster:

- `sk-design` parent hub: single routed skill, mode registry, smallest useful mode rule. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:41] [SOURCE: file:.opencode/skills/sk-design/SKILL.md:56]
- Shared register: first design decision, six downstream dials. [SOURCE: file:.opencode/skills/sk-design/shared/register.md:16] [SOURCE: file:.opencode/skills/sk-design/shared/register.md:49]
- Interface mode: always loads register and dials, requires pre-flight pass before delivery. [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:73] [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:247]
- Foundations mode: owns color, contrast, tokens, and static systems. [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:23] [SOURCE: file:.opencode/skills/sk-design/design-foundations/SKILL.md:270]
- Audit mode: owns evidence-backed findings, severity, five-dimension score, and evidence limits. [SOURCE: file:.opencode/skills/sk-design/design-audit/SKILL.md:267] [SOURCE: file:.opencode/skills/sk-design/design-audit/references/audit_contract.md:61]
- MiniMax-M3 profile: TIDD-EC plus dense pre-plan overrides generic CLI defaults. [SOURCE: file:.opencode/skills/sk-prompt-models/references/models/minimax-m3.md:56]
- Fan-out runtime: isolated lineages and merge attribution; promotion gates are separate. [SOURCE: file:.opencode/skills/deep-loop-runtime/SKILL.md:170] [SOURCE: file:.opencode/skills/deep-loop-runtime/feature_catalog/09--fanout/fanout-merge.md:21]

## 4. Diagnosis

The misses are not independent:

- Skipped register caused uncalibrated density, motion, color dosage, copy register, anti-slop strictness and audit severity.
- Late foundations contrast happened because color work was treated as visual taste instead of token-pair verification.
- Ad-hoc audit happened because the agent used judgment without the evidence worksheet, score contract or pre-flight card.
- Thin MiniMax context happened because the dispatch did not carry a context manifest and did not use MiniMax's profiled prompt shape.

## 5. Mode Routing Recommendation

Keep the parent hub's smallest-useful-mode rule for narrow advice, but add a higher-level bundle rule for work that produces or evaluates UI.

Recommended routing:

| Request class | Required context |
|---|---|
| Pure design direction, no build or claim | `interface + shared/register + brief_to_dials` |
| UI build, page/component generation, redesign implementation | `interface + shared/register + brief_to_dials + foundations axis refs + interface_preflight_card` |
| Any color, theme, contrast, token, layout or responsive decision | Add `foundations` matching axis refs |
| Any ready/release/accessibility/score/review claim | Add `audit_contract + accessibility_performance + evidence worksheet` |
| Small-model delegation for any of the above | Add model profile and context manifest inside the model scaffold |

This preserves hub simplicity while making build work harder to under-load.

## 6. Register and Dials

The register must be a hard first-step gate. It is not a style preference. The register file says the first design decision is Brand versus Product and that skipping it is the most common reason output drifts generic. [SOURCE: file:.opencode/skills/sk-design/shared/register.md:16]

Required proof field:

```text
REGISTER: Brand | Product
WHY: task cue | surface in focus | declared register
DIALS: VARIANCE n / MOTION n / DENSITY n
DOWNSTREAM EFFECT: density, motion budget, color dosage, copy register, anti-slop strictness, audit severity
```

The proof field should be emitted in parent sessions and delegated prompts. A child response without it is incomplete for design/UI build work.

## 7. Foundations and Contrast

Contrast should move from late audit discovery to early token-pair inventory. Foundations already provides the rule: identify actual foreground/background pairs, check APCA and WCAG where available, and adjust OKLCH lightness first. [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md:60]

Required proof field:

```text
CONTRAST PAIRS:
- foreground token/value:
  background token/value:
  surface:
  target: WCAG AA 4.5:1 body or 3:1 large/UI
  result: pass | fail | not assessed
  fix if fail:
```

This directly prevents the reported WCAG-AA P1 from surfacing only after a late audit.

## 8. Interface Pre-Flight

The interface pre-flight card is the build self-check. It is binary, and a single fail means the surface is not done. [SOURCE: file:.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md:16]

Required proof field:

```text
INTERFACE PREFLIGHT:
surface:
section count:
narrowest tested width:
hero: pass | fail
grid/bento: pass | fail | N/A
eyebrow/meta: pass | fail
button/form contrast: pass | fail
breakpoint overflow: pass | fail
real imagery: pass | fail | N/A
copy audit: pass | fail
motion/reduced-motion: pass | fail | N/A
AI-tell sweep: pass | fail
verdict: SHIP | FIX
```

This should be required before any final delivery language for UI build work.

## 9. Audit Contract

The audit contract is not the same as the interface pre-flight card. It is the evidence-backed report format: findings first, P0-P3 severity, five-dimension score, evidence labels, impact, fix and owner. [SOURCE: file:.opencode/skills/sk-design/design-audit/references/audit_contract.md:48]

Required proof field:

```text
AUDIT EVIDENCE:
target:
source code: confirmed | not-assessed
rendered UI: confirmed | inferred | not-assessed
design artifact: confirmed | inferred | not-assessed
deterministic scan: confirmed | not-assessed
dimensions:
  accessibility:
  performance:
  responsive:
  theming:
  anti-patterns:
```

No release-readiness or accessibility claim should pass without this or a compact equivalent.

## 10. Sub-Agent Prompt Contract

Every dispatched agent doing design/UI work should receive:

- Spec folder and write scope.
- Target surface and task type.
- Required mode bundle.
- Exact files to read.
- Required proof fields.
- Output shape.
- Verification expectation.
- "Do not claim ready/accessibility/release unless proof fields are complete."

This aligns with `cli-opencode` requiring the spec folder in non-interactive dispatch and the CLI prompt card requiring clear task, constraints, output and verification. [SOURCE: file:.opencode/skills/cli-opencode/SKILL.md:318] [SOURCE: file:.opencode/skills/sk-prompt-models/assets/cli_prompt_quality_card.md:70]

## 11. MiniMax-M3 Dispatch Contract

MiniMax-M3 should not receive a generic frontier-model prompt. Its profile says TIDD-EC plus dense pre-planning is the primary contract, with RCAF fallback. [SOURCE: file:.opencode/skills/sk-prompt-models/references/models/minimax-m3.md:56]

Recommended MiniMax-specific additions:

```markdown
## Task
Load and apply the sk-design context bundle for <surface>.

## Instructions
1. Write a <pre-plan> with 4-5 steps. Each step includes input, output, acceptance criterion and verification command.
2. Read the required context files before design decisions.
3. Emit the Context Loaded card before recommendations or code.
4. Emit the Proof Of Application card at the end.

## Do's
- Set REGISTER and DIALS first.
- Use foundations contrast pair inventory for all changed text/surface pairs.
- Fill interface pre-flight before any "done" claim.
- Use audit evidence labels for review claims.

## Don'ts
- Do not summarize sk-design from memory.
- Do not claim accessibility without evidence.
- Do not omit proof fields.
- Do not touch files outside the allowed scope.
```

## 12. Hard Gates

Recommended gates:

| Gate | Blocks |
|---|---|
| Context Loaded | Any design decision before required files are named as loaded |
| Register/Dials | Any palette, layout, motion or copy decision before register and dials |
| Foundations Contrast | Any UI build with changed foreground/background pairs |
| Interface Pre-Flight | Any "done", "ready", "ship", "looks good" delivery claim |
| Audit Evidence | Any audit, score, accessibility or release-readiness claim |
| Dispatch Profile | Any small-model delegation where a profile exists |
| Adoption | Any canonical skill change from lineage findings |

## 13. Verification

Verification should be layered:

1. Static proof: required context manifest exists.
2. Evidence proof: required pre-flight/audit fields are complete.
3. Render proof when a UI exists: screenshot or browser check where feasible.
4. Source proof: contrast values and tokens are cited from files or computed pairs.
5. Dispatch proof: child output echoes context loaded and proof-of-application sections.
6. Lineage proof: fan-out merge preserves attribution before synthesis.

## 14. Adopt-If-Better

Fan-out can produce better recommendations, but merge is not adoption. The runtime's fan-out merge deduplicates findings, tracks `_lineages`, aggregates iterations and averages convergence. [SOURCE: file:.opencode/skills/deep-loop-runtime/feature_catalog/09--fanout/fanout-merge.md:24]

Adoption should follow a promotion-like gate:

- Candidate rule or prompt contract is packet-local first.
- It passes deterministic checks against known miss cases.
- It beats the baseline on a small fixture set.
- It preserves the hub's architecture and mode ownership boundaries.
- Operator explicitly approves canonical mutation.

This adapts the promotion contract's five gates: scoring, benchmark status, repeatability, manifest boundary, and explicit approval. [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md:32]

## 15. Recommended Implementation Shape

Implement as a compact manifest plus router extension, not as a large prose expansion in the hub.

Proposed artifacts for a later implementation packet:

- `sk-design/shared/context_loading_contract.md`
- `sk-design/shared/assets/context_loaded_card.md`
- `sk-design/shared/assets/proof_of_application_card.md`
- Parent hub routing note: build/release tasks use bundle rules.
- CLI dispatch template snippets for design/UI tasks.
- MiniMax-M3 design-task scaffold that embeds the context manifest.
- Tests or manual playbook cases for the four observed misses.

## 16. Recommendations

1. Add a `design_context_manifest` requirement for UI build and design-audit tasks.
2. Add bundle routing: `interface` remains the primary mode, but build work auto-pairs foundations and pre-flight context.
3. Make `shared/register.md` a hard first read for all `sk-design` modes and delegated design tasks.
4. Make foreground/background contrast pair inventory mandatory when color or text/surface pairs change.
5. Require `interface_preflight_card.md` before final UI delivery.
6. Require `audit_contract.md` plus `audit_evidence_worksheet.md` for audit/release claims.
7. Require small-model profile loading before `cli-opencode` dispatch, with MiniMax-M3 receiving TIDD-EC dense scaffolding.
8. Treat fan-out recommendations as candidates. Merge and attribute first; adopt only through a gate.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Interface-only routing for UI builds | Interface itself requires register, dials, real UI loop, pre-flight and quality floor. | [SOURCE: file:.opencode/skills/sk-design/design-interface/SKILL.md:247] | 1, 5 |
| Late contrast audit | Contrast repair starts from actual foreground/background pairs and measured thresholds. | [SOURCE: file:.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md:60] | 2 |
| Ad-hoc audit prose | Audit requires evidence labels, severity, scoring, impact, fix and owner. | [SOURCE: file:.opencode/skills/sk-design/design-audit/references/audit_contract.md:61] | 3 |
| Thin MiniMax delegation | MiniMax-M3 has a profiled prompt contract that overrides generic defaults. | [SOURCE: file:.opencode/skills/sk-prompt-models/assets/cli_prompt_quality_card.md:87] | 4 |
| Automatic adoption from lineage output | Fan-out merge preserves attribution; promotion/adoption needs separate gates. | [SOURCE: file:.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md:22] | 6 |

## 17. Open Questions

No blocking research questions remain.

Two implementation details remain for a later packet:

- Whether the bundle rule should live only in `sk-design` docs or also in an executable advisor/router check.
- Whether contrast pair checking should be an authored worksheet only or backed by a small deterministic script.

## 18. Convergence Report

| Field | Value |
|---|---|
| Stop reason | converged |
| Iterations completed | 6 |
| Questions answered | 10/10 |
| Average newInfoRatio trend | `1.00 -> 0.86 -> 0.82 -> 0.74 -> 0.64 -> 0.38` |
| Final composite stop | Question coverage complete |
| Legal-stop gates | pass |
| Graph gates | not applicable |

## 19. References

- `.opencode/skills/sk-design/SKILL.md`
- `.opencode/skills/sk-design/mode-registry.json`
- `.opencode/skills/sk-design/shared/register.md`
- `.opencode/skills/sk-design/shared/design_token_vocabulary.md`
- `.opencode/skills/sk-design/shared/anti_slop_principles.md`
- `.opencode/skills/sk-design/shared/sk_code_handoff.md`
- `.opencode/skills/sk-design/design-interface/SKILL.md`
- `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md`
- `.opencode/skills/sk-design/design-interface/references/design-process/brief_to_dials.md`
- `.opencode/skills/sk-design/design-interface/references/design-process/ux_quality_reference.md`
- `.opencode/skills/sk-design/design-foundations/SKILL.md`
- `.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md`
- `.opencode/skills/sk-design/design-foundations/references/color/palette_theming.md`
- `.opencode/skills/sk-design/design-audit/SKILL.md`
- `.opencode/skills/sk-design/design-audit/references/audit_contract.md`
- `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md`
- `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md`
- `.opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md`
- `.opencode/skills/sk-prompt-models/SKILL.md`
- `.opencode/skills/sk-prompt-models/assets/cli_prompt_quality_card.md`
- `.opencode/skills/sk-prompt-models/references/models/minimax-m3.md`
- `.opencode/skills/cli-opencode/SKILL.md`
- `.opencode/skills/cli-opencode/assets/prompt_templates.md`
- `.opencode/skills/deep-loop-runtime/SKILL.md`
- `.opencode/skills/deep-loop-runtime/feature_catalog/09--fanout/fanout-merge.md`
- `.opencode/skills/deep-loop-runtime/manual_testing_playbook/09--fanout/fanout-merge-research.md`
- `.opencode/skills/deep-loop-workflows/deep-improvement/references/shared/promotion_gate_contract.md`

---

<!-- ANCHOR:sources -->
## 20. Source Index

This synthesis is grounded in inline `source:` markers throughout sections 3-14 (`[SOURCE: file:...:line]`) plus iteration-001 through iteration-006 evidence. Primary anchors:

- `.opencode/skills/sk-design/shared/register.md`
- `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md`
- `.opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md`
- `.opencode/skills/sk-design/design-audit/references/audit_contract.md`
- `.opencode/skills/sk-prompt-models/references/models/minimax-m3.md`
- `.opencode/skills/deep-loop-runtime/feature_catalog/09--fanout/fanout-merge.md`
<!-- /ANCHOR:sources -->
