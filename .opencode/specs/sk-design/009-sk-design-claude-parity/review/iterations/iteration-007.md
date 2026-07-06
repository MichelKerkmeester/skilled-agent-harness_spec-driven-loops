---
title: Deep Review Iteration 007 - Non-output Extraction Modules
description: Correctness/security revisit for md-generator extraction modules outside the output-path seam.
---

# Deep Review Iteration 007 - Non-output Extraction Modules

## Dimension

Correctness, security, and test-coverage revisit. This pass reviewed the md-generator extraction modules deferred by iteration 6: `a11y-extract.ts`, `css-analyzer.ts`, `design-boundary-detect.ts`, `dark-mode-detect.ts`, `icon-detect.ts`, and `motion-extract.ts`, plus available tests and downstream report/preview/write-prompt consumers for source-derived string handling.

## Files Reviewed

| Area | Evidence | Result |
|------|----------|--------|
| Prior state and severity doctrine | `.opencode/specs/sk-design/009-sk-design-claude-parity/review/deep-review-strategy.md:66`, `.opencode/specs/sk-design/009-sk-design-claude-parity/review/iterations/iteration-006.md:83`, `.opencode/skills/sk-code/code-review/references/review_core.md:28` | Loaded prior context and severity contract before adjudicating new findings. Existing P1-001 through P1-005 and P2-001 through P2-002 were treated as active prior findings and not re-reported. |
| Code graph readiness | `code_graph_status`: freshness `stale`, reason `git HEAD changed: ba890674 -> 70142c0a; 18 file(s) have newer mtime than indexed_at; 29 tracked file(s) no longer exist on disk` | Structural graph assertions remain unavailable; this pass used graphless fallback with direct file reads, glob, and exact grep. |
| Focused extraction modules | `.opencode/skills/sk-design/design-md-generator/backend/scripts/a11y-extract.ts:260`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:222`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/design-boundary-detect.ts:228`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/dark-mode-detect.ts:33`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/icon-detect.ts:130`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/motion-extract.ts:95` | Found two new P1s: dark-mode CSS variable values are later injected into `report.html` style attributes without CSS/HTML context isolation, and transition shorthand parsing corrupts comma-bearing timing functions. |
| Downstream consumers | `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:344`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:406`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:471`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:482`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:488`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:568`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:532`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:199`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:39` | Focused modules feed tokens through extraction into report/preview/prompt consumers. Boundary/icon/motion mostly feed counts or structured values; dark-mode variable values directly enter report CSS context. |
| Tests | `.opencode/skills/sk-design/design-md-generator/backend/tests/a11y-extract.test.ts:8`, glob of `.opencode/skills/sk-design/design-md-generator/backend/tests/*.test.ts`, grep import hits for focused functions | Only `a11y-extract.ts` has a focused test file, and it only covers focus-indicator absence/presence. No focused tests import `css-analyzer`, `design-boundary-detect`, `dark-mode-detect`, `icon-detect`, or `motion-extract`. |

## Findings by Severity

### P0

None.

### P1

#### P1-006 [P1] Dark-mode CSS variable values are injected into report style attributes without data isolation

- File: `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:533`
- Claim: Source-site CSS variable values collected by `dark-mode-detect.ts` can be written into generated `report.html` as raw CSS inside a `style` attribute, without validation or context-specific escaping.
- Evidence: `collectCSSVariables()` reads CSS custom property names and values from live stylesheets and stores `style.getPropertyValue(prop).trim()` as `value`. Later, `report-gen.ts` renders each dark-mode diff row with `background:${v.lightValue}` and `background:${v.darkValue}` directly inside the `style` attribute. Text copies of the same values are escaped, but the CSS sink is not. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/dark-mode-detect.ts:33`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/dark-mode-detect.ts:61`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/dark-mode-detect.ts:63`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:532`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:533`.
- Counterevidence sought: I checked adjacent report rendering and preview rendering for escaping. Report names, detection metadata, and displayed text values use `esc(...)`, and preview escapes some text-like slots, but there is no CSS-context encoder or color-value allowlist before the dark-mode variable value is placed in the `background:` declaration. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:539`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/report-gen.ts:551`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:19`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/preview-gen.ts:85`.
- Alternative explanation: Most legitimate theme variables are colors, and generated reports are usually opened by an operator. That reduces exploitability, but the reviewed trust boundary is still live-site CSS to generated HTML. CSS custom properties can contain quote/control/function-like values, so the report should not treat them as safe CSS.
- Final severity: P1. This is a generated-artifact security/data-isolation defect in the md-generator path. It is not P0 because no automatic file write or command execution from the CSS value was confirmed; user action is needed to open the report.
- Confidence: 0.84.
- Downgrade trigger: Downgrade to P2 if the report renderer validates dark-mode values through a CSS color allowlist or renders unsafe values as text-only swatches, with tests covering quoted/control/function-like custom property values.
- Finding class: cross-consumer.
- Affected surface hints: `dark-mode-detect.ts`, `report-gen.ts`, generated `report.html`, dark-mode report/manual-preview workflow, prompt-data isolation remediation pattern from P1-003.
- Recommendation: Add a context-specific renderer for CSS-derived values: validate colors before using them in style attributes, escape all text separately, and render invalid/non-color values as text-only with an explicit warning.

#### P1-007 [P1] Transition shorthand parsing splits `cubic-bezier(...)` commas into bogus transitions

- File: `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:224`
- Claim: The CSS analyzer corrupts common transition shorthands that contain comma-bearing timing functions such as `cubic-bezier(.4,0,.2,1)`, because it splits the raw shorthand string on every comma before tokenizing each part.
- Evidence: `parseTransitionShorthand()` does `value.split(',')`, then splits each part on whitespace and classifies unrecognized tokens as the transition property. `extractTransitions()` passes the generated `transition` declaration string directly into that parser. A normal declaration such as `transition: opacity .2s cubic-bezier(.4,0,.2,1)` therefore becomes multiple fragments instead of one transition, creating bogus properties/durations/timing facts. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:222`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:224`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:230`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:238`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:241`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:263`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/css-analyzer.ts:264`.
- Downstream impact: Motion extraction consumes `cssAnalysis.transitions`, turns parsed durations/timing functions into the motion system, and the WRITE prompt reports measured motion duration counts from `tokens.motionSystem`. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/scripts/motion-extract.ts:102`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/motion-extract.ts:103`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/motion-extract.ts:140`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:40`, `.opencode/skills/sk-design/design-md-generator/backend/scripts/build-write-prompt.ts:46`.
- Counterevidence sought: I checked the focused test inventory. There is no `css-analyzer` test file and grep found no tests importing `analyzeCSS` or exercising transition parsing. Evidence: glob of `.opencode/skills/sk-design/design-md-generator/backend/tests/*.test.ts`, grep import hits for `analyzeCSS`.
- Alternative explanation: `css-tree` does parse the stylesheet first, but this implementation serializes declaration values back into strings and reparses the shorthand with naive comma/whitespace splitting, losing the AST's ability to distinguish list separators from commas inside functions.
- Final severity: P1. This is a correctness defect in measured motion extraction that can fabricate or distort output facts for common production CSS. It is not P0 because it does not destroy data or expand write scope.
- Confidence: 0.82.
- Downgrade trigger: Downgrade to P2 if a test demonstrates `csstree.generate()` never emits comma-bearing timing functions in this path or a higher-level normalizer removes cubic-bezier values before `parseTransitionShorthand()`; no such counterevidence was found.
- Finding class: algorithmic.
- Affected surface hints: `css-analyzer.ts`, `motion-extract.ts`, `build-write-prompt.ts`, motion section in generated DESIGN.md, future CSS analyzer tests.
- Recommendation: Parse transition lists with CSS-aware value traversal or a comma splitter that tracks parentheses depth, then add tests for `cubic-bezier(...)`, `steps(...)`, and multiple transition lists.

### P2

#### P2-003 [P2] Focused extraction modules mostly have no real test files

- File: `.opencode/skills/sk-design/design-md-generator/backend/tests/a11y-extract.test.ts:8`
- Claim: The six-module extraction surface has only one focused test file, and that file covers only the focus-indicator absence regression, leaving CSS analysis, boundary detection, dark-mode detection, icon detection, motion extraction, contrast pairs, tab order, alt text, and source-derived report values without direct regression tests.
- Evidence: The backend test directory contains `a11y-extract.test.ts`, `formatters-v3.test.ts`, `guided-run.test.ts`, `parseargs.test.ts`, `validate.test.ts`, `cluster-classify.test.ts`, `build-write-prompt.test.ts`, and `cluster.test.ts`; only `a11y-extract.test.ts` imports one of this iteration's target modules. Its assertions cover `extractA11y([], [])` and a single `focusVisibleDiff` case. Evidence: `.opencode/skills/sk-design/design-md-generator/backend/tests/a11y-extract.test.ts:1`, `.opencode/skills/sk-design/design-md-generator/backend/tests/a11y-extract.test.ts:8`, `.opencode/skills/sk-design/design-md-generator/backend/tests/a11y-extract.test.ts:9`, `.opencode/skills/sk-design/design-md-generator/backend/tests/a11y-extract.test.ts:16`.
- Counterevidence sought: I used the full backend test glob plus exact import grep for `extractA11y`, `analyzeCSS`, `detectBoundaries`, `detectDarkMode`, `detectIcons`, `detectIconLabels`, and `extractMotion`. The only focused test import found was `extractA11y` in `a11y-extract.test.ts`.
- Alternative explanation: Some behavior may be covered indirectly by integration/manual runs. That is useful, but the specific correctness bugs found in this pass are not protected by focused unit tests.
- Final severity: P2. This is a regression-risk and maintainability gap, not a standalone release blocker.
- Confidence: 0.89.
- Downgrade trigger: Downgrade to no finding once focused tests cover the six extraction modules' real parsing/extraction paths, including the P1-006 and P1-007 cases.
- Finding class: test-isolation.
- Affected surface hints: `backend/tests`, `css-analyzer.ts`, `dark-mode-detect.ts`, `design-boundary-detect.ts`, `icon-detect.ts`, `motion-extract.ts`, `a11y-extract.ts`.
- Recommendation: Add focused unit tests for each extraction module before or alongside remediation: CSS shorthand parsing, dark-mode variable sanitization/rendering handoff, boundary similarity, icon libraries/labels, motion classification, and a11y contrast/tab/alt extraction.

## Traceability Checks

| Check | Status | Evidence |
|-------|--------|----------|
| `spec_code` | Covered with two new P1 findings | The focused extraction modules and downstream report/prompt consumers were checked against live code. P1-006 and P1-007 are new implementation defects. |
| `checklist_evidence` | Not applicable this iteration | This pass focused on backend extraction implementation, not phase checklist reconciliation. Prior checklist coverage remains covered from iterations 4-5. |
| `skill_agent` | Not applicable this iteration | No public mode-routing or command projection surface was under review. |
| `agent_cross_runtime` | Not applicable | Strategy marks this N/A for sk-design. |
| `feature_catalog_code` | Covered, no new catalog-only defect | This pass did not find a new feature-catalog mismatch beyond existing P1-004; findings are implementation/test defects. |
| `playbook_capability` | Not executed | Manual playbook live execution remains outside this focused backend revisit. |
| `html_output_isolation` | Covered with one new P1 | Dark-mode variables from live CSS enter generated report CSS context without validation or escaping. |
| `test_coverage` | Covered with one advisory | Focused test inventory found only the narrow `a11y-extract` focus regression test. |

## Search Depth

Scope class is complex. Code graph readiness remained stale, so this iteration used graphless fallback. Target selection followed the prompt exactly: full reads of the six non-output extraction modules, glob/grep test inventory, exact consumer grep for module exports, and direct reads of `report-gen.ts`, `preview-gen.ts`, and `build-write-prompt.ts` at the source-derived string sinks. High-risk targets omitted this pass: live browser execution of dark-mode toggles, proof/preview rendering, and full end-to-end md-generator execution.

## SCOPE VIOLATIONS

None. No reviewed target source/spec files were modified.

## Verdict

CONDITIONAL for iteration 7: two new P1 findings and one new P2 advisory were recorded. No P0 findings were discovered.

## Next Dimension

Iteration 8 should continue the deep revisit by checking generated HTML/CSS sinks and report/preview/proof rendering tests more broadly, especially shared CSS-context escaping and whether P1-006 generalizes beyond dark-mode variable swatches.

Review verdict: CONDITIONAL
