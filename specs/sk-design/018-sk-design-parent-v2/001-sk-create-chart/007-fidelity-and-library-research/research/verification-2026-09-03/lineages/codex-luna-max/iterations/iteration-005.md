# Iteration 5: Vega schemes/configuration and Plotly axis controls

**Run:** 5 of 10  
**Retrieved:** 2026-09-03  
**Baseline:** `research/lineages/deepseek-flash-max/research.md:67,75,82,97,104`

## Focus

Verify the Vega scheme catalog, Vega configuration description model, the cited Vega v5.11.0 ARIA release note, and Plotly's tick/hover behavior. The two GitHub Vega citations are also checked for current reachability and branch/version stability.

## Findings

### 1. Vega color schemes

- **Verdict:** VERIFIED
- **Live URL:** https://vega.github.io/vega/docs/schemes/ `[SOURCE: https://vega.github.io/vega/docs/schemes/]`
- **Resolves:** Yes; official Vega documentation.
- **Documented version:** Current Vega documentation; the page does not state a package semver, but its current scheme list includes version-introduced markers such as `≥5.0` and `≥5.15`.
- **Evidence:** Vega defines named palettes for discrete and continuous color encodings. It distinguishes discrete schemes for ordinal/quantize/quantile scales from continuous schemes for linear/log/sqrt scales, supports a `count` and `extent`, and warns that multi-hue sequential ramps can make viewers perceive false clusters. The page lists categorical `tableau10`, sequential `blues`, and multi-hue `viridis` schemes. This supports the baseline's scheme and multi-hue caveat.
- **Corpus verdict:** The corpus uses a local pasted palette and checks lightness/contrast rather than importing Vega schemes. That is compatible with the no-remote/no-runtime rule and preserves a stable declared color system. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/color-system.md:1-12,155-168; .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:157-160]`

### 2. Vega configuration page: description model

- **Verdict:** CORRECTED
- **Live URL checked:** https://github.com/vega/vega/blob/master/docs/docs/config.md `[SOURCE: https://github.com/vega/vega/blob/master/docs/docs/config.md]`
- **Resolves:** The exact `master` URL could not be fetched today (GitHub returned a rate-limit/cache failure). The repository's current branch is `main`, and the current GitHub file is available at https://github.com/vega/vega/blob/main/docs/docs/config.md; the canonical rendered page is https://vega.github.io/vega/docs/config/.
- **Documented version:** Current Vega docs; the rendered config page documents current Vega and marks the view `description` property as available in versions `≥5.10`. The current GitHub page shows the same source file on `main`.
- **What the baseline said:** Vega's config `description` model demonstrates the pattern for a text description attached to the view's ARIA label.
- **What the authoritative page says:** The current config docs say a config object supplies default visual values and that the view `description` is the default text description for visualizations; it determines the `aria-label` for the container element of a Vega view. Axis, legend, and mark descriptions are separate accessibility properties in current docs.
- **Corrected wording:** “Use the canonical current Vega config page (`https://vega.github.io/vega/docs/config/`) for the description model; the branch-sensitive GitHub `master` URL is not a stable citation target. Vega's description model demonstrates view-level and guide-level ARIA labels, but it does not generate the corpus's data table.”
- **Corpus verdict:** The pinned templates provide a resolving `aria-labelledby` figure label and a `data-chart-table`; they do not use Vega's generated per-guide description model. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:161-164]`

### 3. Vega v5.11.0 release note about ARIA

- **Verdict:** UNVERIFIABLE
- **Live URL checked:** https://github.com/vega/vega/releases/tag/v5.11.0 `[SOURCE: https://github.com/vega/vega/releases/tag/v5.11.0]`
- **Resolves:** The live fetch returned a GitHub cache miss, and alternate query forms also returned cache misses. The page's exact release-note body could not be inspected today.
- **Documented version:** The URL names Vega `v5.11.0`, but no release-note text was available from the URL during this retrieval.
- **Failure mode and nearest authoritative source:** This is a public-source availability failure, not evidence that the tag is absent. The current official Vega config page explicitly marks view descriptions as `≥5.10` and axis/legend/mark `aria` and `description` properties as `≥5.11`; the current mark docs also say Vega generates ARIA roles/role descriptions for SVG mark groups. Use those pages instead of attributing a precise ARIA-bloat statement to the unavailable release page. `[SOURCE: https://vega.github.io/vega/docs/config/, https://vega.github.io/vega/docs/marks/]`
- **Corpus verdict:** The pinned contract's figure label and data table are present; per-mark ARIA generation is intentionally not used. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:161-167]`

### 4. Plotly JavaScript tick-formatting page

- **Verdict:** VERIFIED
- **Live URL:** https://plotly.com/javascript/tick-formatting/ `[SOURCE: https://plotly.com/javascript/tick-formatting/]`
- **Resolves:** Yes; current Plotly JavaScript documentation (copyright footer 2026; no explicit plotly.js package semver on the page).
- **Documented version:** Current Plotly JavaScript docs; the page is not a version-pinned API reference.
- **Evidence:** The page documents `tickmode` (`auto`, `linear`, `array`), `tick0`, `dtick`, and `nticks`; `tickformat` uses D3 formatting mini-languages; `tickformatstops` selects formats by `dtickrange`/zoom level; and `exponentformat` accepts `none`, `e`, `E`, `power`, `SI`, or `B`. The page's linear example states that `tick0` and `dtick` determine tick placement. It does not document `tickangle`, which is covered by the Python axes page below.
- **Corpus verdict:** The fixed SVG corpus has no zoom-level state or Plotly axis object; it uses a local tick ladder and `fmt` helper, which covers deterministic static output without the interactive machinery. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-columns.html:112-160; .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:159-166]`

### 5. Plotly Python axes page and hover defaults

- **Verdict:** CORRECTED for the combined baseline attribution; the axis behaviors themselves are verified.
- **Live URL:** https://plotly.com/python/axes/ `[SOURCE: https://plotly.com/python/axes/]`
- **Resolves:** Yes; current Plotly Python axes documentation.
- **Documented version:** The page includes features marked new in Plotly `5.6`, `5.14`, `5.19`, `5.23`, and later; it is current but not a single pinned package release.
- **Evidence:** The page documents `nticks` as an approximate tick count; `tick0` and `dtick` as exact start/interval controls; `tickangle` and `autotickangles`; and says the default `tickangle` is `auto`, rotating to 30 or 90 degrees when needed. It also says cartesian-axis `automargin` is true in the Plotly template for axis-title fitting. These support the axis portion of the baseline.
- **Correction to the baseline:** The axes page does not establish that hover labels are enabled by default. The nearest authoritative Plotly page is https://plotly.com/python/hover-text-and-formatting/, which says `layout.hovermode='closest'` is the default and that a hover label appears for the point under the cursor. Corrected wording: “Plotly provides the listed axis controls and interactive hover labels; cite the dedicated hover page for the `closest` default, not the axes page.” `[SOURCE: https://plotly.com/python/hover-text-and-formatting/]`
- **Corpus verdict:** No hover state is shipped; the corpus relies on visible labels plus the accessible data table. It also avoids Plotly's auto-rotation because the templates are fixed-layout SVG with per-form label budgets. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:161-172; .opencode/skills/sk-doc/sk-create-chart/references/catalog.md:71-76]`

## Assessment

Vega's scheme and configuration behaviors are supported by current official pages. The GitHub `master` config path should be replaced with the canonical rendered page or a `main`-branch file link. The v5.11.0 release URL remained unavailable to the live fetch, so the exact release-note claim is unverified and should be replaced by current config/mark docs. Plotly's rich axis options and hover behavior are current, but hover's default belongs to the dedicated hover page, and Plotly's current `tickangle` default is `auto` with automatic rotation, not a fixed angle.

**New-information ratio:** 0.89  
**Answered:** Vega scheme families/caveat; description and ARIA model; release-note availability; Plotly tick controls, tick-angle behavior, and hover default source.  
**Correction impact:** Replace the unstable Vega GitHub citations, separate the unverified release-note claim from confirmed current docs, and cite Plotly's hover page for `hovermode:'closest'`.

## Reflection

- **What worked and why:** Official rendered Vega docs and Plotly's current examples expose the option semantics directly.
- **What did not work and why:** GitHub release/source pages were intermittently unavailable or branch-sensitive; axes documentation also does not prove a cross-component hover default.
- **What I would do differently:** Prefer canonical rendered docs and dedicated feature pages over repository branches and cross-topic inference.

## Sources Consulted

- https://vega.github.io/vega/docs/schemes/
- https://github.com/vega/vega/blob/master/docs/docs/config.md
- https://github.com/vega/vega/blob/main/docs/docs/config.md
- https://vega.github.io/vega/docs/config/
- https://github.com/vega/vega/releases/tag/v5.11.0
- https://vega.github.io/vega/docs/marks/
- https://plotly.com/javascript/tick-formatting/
- https://plotly.com/python/axes/
- https://plotly.com/python/hover-text-and-formatting/

## Ruled Out

- **Adding Vega or Plotly runtime code to the templates:** Their runtime/responsive/interactive benefits conflict with the no-remote-resource, no-build single-file contract. `[CORPUS@756a7fcd4c: .opencode/skills/sk-doc/sk-create-chart/references/template-contract.md:154-160]`
- **Using the unavailable v5.11.0 release note as proof of a precise ARIA-bloat statement:** Current docs cover the supported behavior; the release-note body was not observable.

## Questions Remaining

- Which Observable Plot pages support the marks, width/margins, invalid-value, tip/pointer, legend, text, stack, and responsive-text claims?
- Which ECharts and general accessibility/color citations remain current and authoritative?

## Recommended Next Focus

Verify the Observable Plot feature pages and discussion, splitting the nine Plot claims across two iterations.
