---
title: Deep Review Iteration 009 - Adversarial P1 Re-verification
description: Final adversarial re-verification of active md-generator P1 findings before synthesis.
---

# Deep Review Iteration 009 - Adversarial P1 Re-verification

## Dimension

Correctness adversarial re-verification. This pass did not search for new finding classes first; it re-read the current source citations for every active P1 finding, P1-001 through P1-008, and checked whether each finding still exists, whether the prior description is materially accurate, and whether P1 remains the right severity. The shared review severity doctrine was loaded before the final calls.

## Files Reviewed

| Area | Evidence | Result |
|------|----------|--------|
| Review state and severity doctrine | `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md:66`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-findings-registry.json:9`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-001.md:24`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-008.md:33`, `.opencode/skills/sk-code/code-review/references/review_core.md:28` | Active finding counts and prior citations were loaded; P1-001 through P1-008 are the required re-verification set. |
| P1-001 component-facts gap | `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:53`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:80`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:93`, `.opencode/skills/sk-design/design-md-generator/references/design_md_format.md:157`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:461`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/cluster.ts:1291`, `.opencode/skills/sk-design/design-md-generator/backend/tests/build-write-prompt.test.ts:23` | Still valid. Current prompt still emits pre-rendered color/spacing/surface/quick-start sections plus type/honest facts, but no component facts, while the format and prompt still require exact component values. |
| P1-002 output-boundary guard gap | `.opencode/skills/sk-design/design-md-generator/references/extraction_workflow.md:46`, `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:69`, `.opencode/skills/sk-design/manual_testing_playbook/manual_testing_playbook.md:71`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:215`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:267`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:276`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:589`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:606`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:635`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:138`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:215` | Still valid. The code still rejects only paths inside the skill/backend roots, then writes fixed extraction artifacts under the caller output path. No spec-folder or `/tmp/skd-*` allowlist exists. |
| P1-003 prompt-data isolation gap | `.opencode/skills/sk-design/design-md-generator/backend/scripts/dom-collector.ts:196`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/dom-collector.ts:215`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/cluster.ts:887`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/cluster.ts:931`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:18`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:24`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:80`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:86` | Still valid. Live-site text/font strings still flow into prose-adjacent FACTS without a structured data-only encoder or explicit non-instruction boundary. |
| P1-004 report/preview overwrite mismatch | `.opencode/skills/sk-design/design-md-generator/feature_catalog/report-preview/report-preview.md:59`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:650`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:651`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:249`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:252`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:436`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:441`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:442` | Still valid. The catalog still promises no silent overwrite, but all three scripts still write fixed artifact names directly. |
| P1-005 guided-run cwd/path inconsistency | `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:149`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:166`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:168`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:190`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:215`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/guided-run.ts:222`, `.opencode/skills/sk-design/design-md-generator/backend/README.md:46`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/cli.ts:13`, `.opencode/skills/sk-design/design-md-generator/backend/tests/guided-run.test.ts:14` | Still valid. Preflight and wrapper writes resolve from the caller cwd, but the extract command passes the original relative output and executes from `BACKEND_ROOT`; tests still only assert parsing/planning. |
| P1-006 dark-mode CSS sink | `.opencode/skills/sk-design/design-md-generator/backend/scripts/dark-mode-detect.ts:33`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/dark-mode-detect.ts:63`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:532`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:533`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:539`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:19` | Still valid and accurately subsumed by P1-008. Dark-mode CSS variable values still render raw into `background:` style declarations while only adjacent text slots use HTML escaping. |
| P1-007 transition comma-splitting | `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:222`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:224`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:230`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:238`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:241`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:263`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/motion-extract.ts:102`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/motion-extract.ts:140` | Still valid. The parser still uses `value.split(',')`, so `cubic-bezier(...)` commas remain indistinguishable from transition-list separators, and motion extraction consumes the corrupted transition facts. |
| P1-008 generalized CSS-value sink | `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:431`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:446`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:454`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:152`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:159`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:485`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:489`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:490`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:533`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:85`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:200`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:209`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:226`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:233`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/proof.ts:278` | Still valid. Typography/radius/shadow values remain string-typed and are interpolated into report/preview CSS contexts without property-specific validation. `proof.ts` still uses numeric-derived swatches/base64 images and does not expand this finding. |

## Findings by Severity

### P0

None. The P1-002 plus P1-003 compound-risk question remains ruled out as P0 after re-reading current source: live-site-derived prompt strings still do not feed `--output`, `outputDir`, or automatic write-path construction, and output paths remain operator-provided before extraction/write-prompt generation.

### P1

No new P1 findings. All eight active P1 findings are still valid in current source.

| Finding | Still valid? | Final severity | One-line reason |
|---------|--------------|----------------|-----------------|
| P1-001 | Yes | P1 | Component data exists in token structures, but the WRITE prompt still does not expose component facts while requiring exact component values. |
| P1-002 | Yes | P1 | Output validation still only rejects skill/backend containment and does not enforce documented spec-folder or `/tmp/skd-*` sandbox boundaries. |
| P1-003 | Yes | P1 | Live-site typography/text values still enter the natural-language prompt as unencoded FACTS prose. |
| P1-004 | Yes | P1 | The catalog still promises no silent overwrite while report/preview/proof still write fixed files without guards. |
| P1-005 | Yes | P1 | Guided-run still validates relative output from caller cwd but runs extraction from `BACKEND_ROOT` with the original relative path. |
| P1-006 | Yes | P1 | Dark-mode variable values still enter report `background:` declarations without CSS-value validation. |
| P1-007 | Yes | P1 | Transition shorthand parsing still splits on every comma and corrupts comma-bearing timing functions. |
| P1-008 | Yes | P1 | Report and preview still interpolate source-derived typography, radius, and shadow strings into CSS contexts without a shared sanitizer. |

### P2

No new P2 findings. Existing P2 advisories were not re-adjudicated because this prompt constrained the pass to active P1 re-verification.

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| `spec_code` | Covered, still conditional | Current source citations for P1-001 through P1-008 were re-read; all eight P1s still hold. |
| `checklist_evidence` | Not applicable this iteration | This pass was citation re-verification of backend P1 findings, not phase checklist reconciliation. Prior checklist coverage remains from iterations 4-5. |
| `skill_agent` | Not applicable this iteration | No public routing, command, or agent surface was under review. |
| `agent_cross_runtime` | Not applicable | Strategy marks this N/A for sk-design. |
| `feature_catalog_code` | Covered for active mismatch | P1-004 remains a feature-catalog/code mismatch at `.opencode/skills/sk-design/design-md-generator/feature_catalog/report-preview/report-preview.md:59`. |
| `html_output_isolation` | Covered, still conditional | P1-006 and P1-008 remain valid generated-artifact CSS-context isolation defects. |
| `compound_p0_escalation` | Ruled out again | Current source still separates live-site prompt content from output path arguments and automatic write destinations. |

## Search Depth

Scope class is complex. This iteration used graphless direct-source re-verification because the required task was to re-read exact prior P1 citations in current source. Target selection covered every active P1 and no active P1 target was omitted. High-risk work deferred: live browser execution of malicious generated report/preview fixtures, implementation of the output policy or `render-safety.ts`, and reducer/synthesis work.

## SCOPE VIOLATIONS

None. No reviewed target source/spec files were modified.

## Verdict

CONDITIONAL for iteration 9: all 8 active P1 findings remain valid, with 0 new P0, 0 new P1, and 0 new P2 findings. No P1 was downgraded, escalated, or marked resolved.

## Next Dimension

Iteration 10 should synthesize the review: produce the final CONDITIONAL verdict, group remediation into prompt-data/component facts, output/artifact policy, renderer CSS-value safety, transition parser correctness, and non-blocking P2 advisories, then preserve the explicit P1-002 plus P1-003 no-P0 adjudication.

Review verdict: CONDITIONAL
