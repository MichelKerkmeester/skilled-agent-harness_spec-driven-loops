# Deep Research Strategy - Session Tracking

## 2. TOPIC
Re-verify every upstream library citation and claim in the DeepSeek research against live sources, then reconcile each claimed capability with the chart corpus at commit `756a7fcd4c`.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Are all cited upstream URLs live and do they support the attributed library behavior?
- [ ] Are the cited API names, defaults, options, and behaviors current in the documented shipped versions?
- [ ] Are the Chart.js, D3, Vega-Lite, Plotly, Observable Plot, and ECharts claims correctly attributed?
- [ ] Are the standards, accessibility, browser, and color-guidance citations authoritative and correctly used?
- [ ] Which T1-T10 and C1-C3 gaps remain in the commit-pinned corpus, and which are closed?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
- Do not modify the corpus, packet documents, templates, or validator.
- Do not use or reference any reference-implementation clone under scratch, tmp, or vendor.
- Do not adopt any upstream dependency or copy upstream code into the repository.
- Do not run generate-context.js, validate.sh, or any git write operation.

## 5. STOP CONDITIONS
- Run all ten iterations because stop policy is max-iterations.
- Each upstream citation must receive VERIFIED, CORRECTED, or UNVERIFIABLE.
- Every T1-T10 and C1-C3 item must receive a commit-pinned corpus verdict with file:line evidence.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Adding a Plot transform or `ResizeObserver` runtime to the templates:** The shipped contract is a self-contained double-click HTML file with no remote dependency or runtime fetch; the static corpus already computes only auditable totals and drawing geometry. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Adding a Plot transform or `ResizeObserver` runtime to the templates:** The shipped contract is a self-contained double-click HTML file with no remote dependency or runtime fetch; the static corpus already computes only auditable totals and drawing geometry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding a Plot transform or `ResizeObserver` runtime to the templates:** The shipped contract is a self-contained double-click HTML file with no remote dependency or runtime fetch; the static corpus already computes only auditable totals and drawing geometry.

### **Adding D3 as a runtime dependency:** The corpus contract forbids remote resources and package-manager delivery; the local ladder and formatter already provide the required static behavior. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159-160]` -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Adding D3 as a runtime dependency:** The corpus contract forbids remote resources and package-manager delivery; the local ladder and formatter already provide the required static behavior. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159-160]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding D3 as a runtime dependency:** The corpus contract forbids remote resources and package-manager delivery; the local ladder and formatter already provide the required static behavior. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159-160]`

### **Adding Vega or Plotly runtime code to the templates:** Their runtime/responsive/interactive benefits conflict with the no-remote-resource, no-build single-file contract. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]` -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Adding Vega or Plotly runtime code to the templates:** Their runtime/responsive/interactive benefits conflict with the no-remote-resource, no-build single-file contract. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding Vega or Plotly runtime code to the templates:** Their runtime/responsive/interactive benefits conflict with the no-remote-resource, no-build single-file contract. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]`

### **Adding Vega-Lite as a runtime dependency:** It would conflict with the contract's no-remote-resource/no-runtime-fetch rule and the double-click, no-build delivery model. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]` -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Adding Vega-Lite as a runtime dependency:** It would conflict with the contract's no-remote-resource/no-runtime-fetch rule and the double-click, no-build delivery model. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding Vega-Lite as a runtime dependency:** It would conflict with the contract's no-remote-resource/no-runtime-fetch rule and the double-click, no-build delivery model. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]`

### **Calling fixed thinning a parity/greedy implementation:** The corpus has explicit per-form index rules, not a general bounding-box resolver; it should be described as a static approximation with budgets. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Calling fixed thinning a parity/greedy implementation:** The corpus has explicit per-form index rules, not a general bounding-box resolver; it should be described as a static approximation with budgets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Calling fixed thinning a parity/greedy implementation:** The corpus has explicit per-form index rules, not a general bounding-box resolver; it should be described as a static approximation with budgets.

### **Calling issue 16831 a cross-browser test result:** it is an open missing-data request, not a compatibility matrix. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Calling issue 16831 a cross-browser test result:** it is an open missing-data request, not a compatibility matrix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Calling issue 16831 a cross-browser test result:** it is an open missing-data request, not a compatibility matrix.

### **Calling Plot's swatch/ramp legend behavior a shipped dependency:** The corpus has local SVG/text legend code and no Plot bundle. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Calling Plot's swatch/ramp legend behavior a shipped dependency:** The corpus has local SVG/text legend code and no Plot bundle.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Calling Plot's swatch/ramp legend behavior a shipped dependency:** The corpus has local SVG/text legend code and no Plot bundle.

### **Chart.js runtime/canvas implementation:** It would violate the self-contained no-remote-dependency delivery contract and would not improve the corpus's SVG/table accessibility boundary. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159,163-167]` -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Chart.js runtime/canvas implementation:** It would violate the self-contained no-remote-dependency delivery contract and would not improve the corpus's SVG/table accessibility boundary. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159,163-167]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Chart.js runtime/canvas implementation:** It would violate the self-contained no-remote-dependency delivery contract and would not improve the corpus's SVG/table accessibility boundary. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159,163-167]`

### **Copying Plot's runtime pointer/tip implementation:** It is not needed for a double-click, static HTML artifact and would introduce runtime/dependency surface forbidden by the contract. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]` -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Copying Plot's runtime pointer/tip implementation:** It is not needed for a double-click, static HTML artifact and would introduce runtime/dependency surface forbidden by the contract. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Copying Plot's runtime pointer/tip implementation:** It is not needed for a double-click, static HTML artifact and would introduce runtime/dependency surface forbidden by the contract. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]`

### **Treating “usually displays a tooltip” as keyboard or touch coverage:** The source does not make that guarantee; visible labels and the data table remain required fallbacks. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Treating “usually displays a tooltip” as keyboard or touch coverage:** The source does not make that guarantee; visible labels and the data table remain required fallbacks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating “usually displays a tooltip” as keyboard or touch coverage:** The source does not make that guarantee; visible labels and the data table remain required fallbacks.

### **Treating discussion 2105 as a versioned API guarantee:** It has no package-version declaration and is a maintainer recommendation, so it cannot establish a universal default. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Treating discussion 2105 as a versioned API guarantee:** It has no package-version declaration and is a maintainer recommendation, so it cannot establish a universal default.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating discussion 2105 as a versioned API guarantee:** It has no package-version declaration and is a maintainer recommendation, so it cannot establish a universal default.

### **Treating ECharts' generated `aria-label` as a substitute for the corpus data table:** The generated description is runtime output, while the contract requires an auditable table in each delivered file. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Treating ECharts' generated `aria-label` as a substitute for the corpus data table:** The generated description is runtime output, while the contract requires an auditable table in each delivered file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating ECharts' generated `aria-label` as a substitute for the corpus data table:** The generated description is runtime output, while the contract requires an auditable table in each delivered file.

### **Treating the ECharts handbook's `aria.enabled` phrase as a verified option name:** It conflicts with the page's `aria.show` examples and needs target-version API confirmation. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Treating the ECharts handbook's `aria.enabled` phrase as a verified option name:** It conflicts with the page's `aria.show` examples and needs target-version API confirmation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the ECharts handbook's `aria.enabled` phrase as a verified option name:** It conflicts with the page's `aria.show` examples and needs target-version API confirmation.

### **Using an unqualified numeric default width:** The current pages expose conflicting values; it cannot support a stable corpus rule without a pinned schema/version. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Using an unqualified numeric default width:** The current pages expose conflicting values; it cannot support a stable corpus rule without a pinned schema/version.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using an unqualified numeric default width:** The current pages expose conflicting values; it cannot support a stable corpus rule without a pinned schema/version.

### **Using ColorArchive as the sole authority for Okabe-Ito or grayscale claims:** the guide is secondary and uncited; use the original CUD material and Paul Tol's technical notes for those rationales. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Using ColorArchive as the sole authority for Okabe-Ito or grayscale claims:** the guide is secondary and uncited; use the original CUD material and Paul Tol's technical notes for those rationales.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using ColorArchive as the sole authority for Okabe-Ito or grayscale claims:** the guide is secondary and uncited; use the original CUD material and Paul Tol's technical notes for those rationales.

### **Using the CSS-Tricks article as verified evidence:** its live response was 403, so its contents cannot be vouched for. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Using the CSS-Tricks article as verified evidence:** its live response was 403, so its contents cannot be vouched for.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using the CSS-Tricks article as verified evidence:** its live response was 403, so its contents cannot be vouched for.

### **Using the unavailable v5.11.0 release note as proof of a precise ARIA-bloat statement:** Current docs cover the supported behavior; the release-note body was not observable. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Using the unavailable v5.11.0 release note as proof of a precise ARIA-bloat statement:** Current docs cover the supported behavior; the release-note body was not observable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using the unavailable v5.11.0 release note as proof of a precise ARIA-bloat statement:** Current docs cover the supported behavior; the release-note body was not observable.

### **Using the v1 page as evidence for present-day defaults:** Its own banner limits it to v1. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Using the v1 page as evidence for present-day defaults:** Its own banner limits it to v1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using the v1 page as evidence for present-day defaults:** Its own banner limits it to v1.

### Claiming that ECharts globally enables tooltips or automatically resizes without host code. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Claiming that ECharts globally enables tooltips or automatically resizes without host code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming that ECharts globally enables tooltips or automatically resizes without host code.

### Counting discrete swatches as an implemented continuous gradient or treating deferred pattern fills as shipped. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Counting discrete swatches as an implemented continuous gradient or treating deferred pattern fills as shipped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting discrete swatches as an implemented continuous gradient or treating deferred pattern fills as shipped.

### Reproducing Observable Plot pointer/tip behavior or ECharts runtime interaction in a static template. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Reproducing Observable Plot pointer/tip behavior or ECharts runtime interaction in a static template.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reproducing Observable Plot pointer/tip behavior or ECharts runtime interaction in a static template.

### Treating a stylesheet narrow-width check as proof of phone-viewport legibility. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating a stylesheet narrow-width check as proof of phone-viewport legibility.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a stylesheet narrow-width check as proof of phone-viewport legibility.

### Treating the Figviz or ColorArchive articles as primary authority for normative colour guidance. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating the Figviz or ColorArchive articles as primary authority for normative colour guidance.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the Figviz or ColorArchive articles as primary authority for normative colour guidance.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Chart.js runtime/canvas implementation:** It would violate the self-contained no-remote-dependency delivery contract and would not improve the corpus's SVG/table accessibility boundary. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159,163-167]` (iteration 1)
- **Adding D3 as a runtime dependency:** The corpus contract forbids remote resources and package-manager delivery; the local ladder and formatter already provide the required static behavior. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159-160]` (iteration 2)
- **Adding Vega-Lite as a runtime dependency:** It would conflict with the contract's no-remote-resource/no-runtime-fetch rule and the double-click, no-build delivery model. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]` (iteration 3)
- **Using an unqualified numeric default width:** The current pages expose conflicting values; it cannot support a stable corpus rule without a pinned schema/version. (iteration 3)
- **Calling fixed thinning a parity/greedy implementation:** The corpus has explicit per-form index rules, not a general bounding-box resolver; it should be described as a static approximation with budgets. (iteration 4)
- **Using the v1 page as evidence for present-day defaults:** Its own banner limits it to v1. (iteration 4)
- **Adding Vega or Plotly runtime code to the templates:** Their runtime/responsive/interactive benefits conflict with the no-remote-resource, no-build single-file contract. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]` (iteration 5)
- **Using the unavailable v5.11.0 release note as proof of a precise ARIA-bloat statement:** Current docs cover the supported behavior; the release-note body was not observable. (iteration 5)
- **Calling Plot's swatch/ramp legend behavior a shipped dependency:** The corpus has local SVG/text legend code and no Plot bundle. (iteration 6)
- **Copying Plot's runtime pointer/tip implementation:** It is not needed for a double-click, static HTML artifact and would introduce runtime/dependency surface forbidden by the contract. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]` (iteration 6)
- **Adding a Plot transform or `ResizeObserver` runtime to the templates:** The shipped contract is a self-contained double-click HTML file with no remote dependency or runtime fetch; the static corpus already computes only auditable totals and drawing geometry. (iteration 7)
- **Treating discussion 2105 as a versioned API guarantee:** It has no package-version declaration and is a maintainer recommendation, so it cannot establish a universal default. (iteration 7)
- **Treating “usually displays a tooltip” as keyboard or touch coverage:** The source does not make that guarantee; visible labels and the data table remain required fallbacks. (iteration 8)
- **Treating ECharts' generated `aria-label` as a substitute for the corpus data table:** The generated description is runtime output, while the contract requires an auditable table in each delivered file. (iteration 8)
- **Treating the ECharts handbook's `aria.enabled` phrase as a verified option name:** It conflicts with the page's `aria.show` examples and needs target-version API confirmation. (iteration 8)
- **Calling issue 16831 a cross-browser test result:** it is an open missing-data request, not a compatibility matrix. (iteration 9)
- **Using ColorArchive as the sole authority for Okabe-Ito or grayscale claims:** the guide is secondary and uncited; use the original CUD material and Paul Tol's technical notes for those rationales. (iteration 9)
- **Using the CSS-Tricks article as verified evidence:** its live response was 403, so its contents cannot be vouched for. (iteration 9)
- Claiming that ECharts globally enables tooltips or automatically resizes without host code. (iteration 10)
- Counting discrete swatches as an implemented continuous gradient or treating deferred pattern fills as shipped. (iteration 10)
- Reproducing Observable Plot pointer/tip behavior or ECharts runtime interaction in a static template. (iteration 10)
- Treating a stylesheet narrow-width check as proof of phone-viewport legibility. (iteration 10)
- Treating the Figviz or ColorArchive articles as primary authority for normative colour guidance. (iteration 10)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Which D3 citation URLs and versioned API descriptions remain current? (iteration 1)
- Which Vega-Lite versioned URLs are authoritative for the cited defaults? (iteration 1)
- Which versioned Vega-Lite axis defaults changed between v1, v4, and current? (iteration 2)
- Which current Vega-Lite pages support the mark/encoding, auto-guide, sizing, legend, formatting, and transform claims? (iteration 2)
- Do Vega's schemes/configuration and the v5.11.0 ARIA release note support the baseline's accessibility and color assertions? (iteration 3)
- Which versioned Vega-Lite axis and scale pages are historical versus suitable for current claims? (iteration 3)
- Do Vega's schemes/config docs and the v5.11.0 release note support the color/accessibility assertions drawn from them? (iteration 4)
- Do Plotly's axis options remain current and materially richer than the fixed corpus viewBox? (iteration 4)
- Which ECharts and general accessibility/color citations remain current and authoritative? (iteration 5)
- Which Observable Plot pages support the marks, width/margins, invalid-value, tip/pointer, legend, text, stack, and responsive-text claims? (iteration 5)
- What does discussion 2105 actually say about responsive text? (iteration 6)
- Does the Plot stack page and the old `observablehq.github.io/plot/features/transforms` URL support the transform comparison? (iteration 6)
- Does the Plot text-mark page support direct-label guidance and measured positioning? (iteration 6)
- Which ECharts accessibility, legend, dataset, and decal claims are still current? (iteration 7)
- Which accessibility and colour-guidance citations are authoritative enough for normative recommendations? (iteration 7)
- Do the SVG title and accessible-SVG sources support the claimed tooltip and accessible-name fallbacks? (iteration 7)
- Which final un-cited ECharts interaction/renderer claims need a current official source? (iteration 8)
- Which WCAG contrast criteria and browser-tooltip caveats are supported by the cited standards and issue pages? (iteration 8)
- Are colorarchive.org and figviz.com authoritative enough for normative palette recommendations? (iteration 8)
- Does the final corpus audit show every T1-T10 and C1-C3 status consistently at commit `756a7fcd4c`? (iteration 9)
- What final verdict totals and ranked corrections should phase synthesis report? (iteration 9)
- Which uncited ECharts renderer, responsive, touch, and tooltip claims can be supported by current official documentation? (iteration 9)
- T5 needs a separate decision about how much data-derived accessible prose can remain literal while preserving the data-block contract. (iteration 10)
- Whether to implement T8, T9, T10, and C1 is a subsequent scoped change; this verification lineage does not modify corpus files. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Whether to implement T8, T9, T10, and C1 is a subsequent scoped change; this verification lineage does not modify corpus files.

<!-- /ANCHOR:next-focus -->

## 12. KNOWN CONTEXT
- Baseline source: `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/007-fidelity-and-library-research/research/lineages/deepseek-flash-max/research.md`.
- Corpus baseline: commit `756a7fcd4c228b1faeddbf10f449cfbc2409656f`.
- Required packet-local contract: `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md`, sections 3-6.
- The baseline research has 43 unique URL citations and the requested review must also cover uncited upstream assertions.
- Resource map was absent at lineage initialization, so the coverage gate is skipped.

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Per-iteration tool budget: 12 calls maximum
- Executor: cli-codex, model gpt-5.6-luna, max reasoning, fast service tier, workspace-write
- Canonical state is local to this lineage directory.
