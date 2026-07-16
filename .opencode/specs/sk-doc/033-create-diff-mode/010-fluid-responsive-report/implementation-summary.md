---
title: "Implementation Summary: Fluid-responsive HTML report layout for create-diff"
description: "Built-and-verified summary for the create-diff fluid report layer: a container-query (cqi) fluid type and section-rhythm scale added to create_diff.py _CSS, tuned for IDE preview-pane widths, within the validate_report.py safety contract and with every phase-008 accessibility guarantee preserved, locked by a renderer regression test. Status: Complete — 40/40 tests green, both report views validate PASS."
trigger_phrases:
  - "fluid responsive report summary"
  - "create diff container query status"
  - "diff report css summary"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/033-create-diff-mode/010-fluid-responsive-report"
    last_updated_at: "2026-07-16T14:52:04Z"
    last_updated_by: "claude"
    recent_action: "Remediated deep-review P0/P1/P2 and folded design increments into docs"
    next_safe_action: "Commit the remediation and re-sync to v4"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fluid-responsive-report-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The fluid layer keys off the content column via container queries (cqi), not the viewport (vw)."
      - "Structural caps stay fixed rem so every phase-008 guarantee is preserved byte-for-byte."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Fluid-responsive HTML report layout for create-diff

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-fluid-responsive-report |
| **Status** | Complete |
| **Level** | 2 |
| **Origin** | Operator asked that create-diff reports always use fluid responsive logic like a reference design system, tuned for IDE desktop views, as the foundation for further diff-design iteration |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status: Complete — a container-query fluid type and section-rhythm layer added to the report renderer's embedded stylesheet, tuned for the IDE desktop width envelope, within the safety-validator contract and preserving every phase-008 accessibility guarantee. The change is additive within `_CSS`; there is no markup, CSP, or engine change.

### Files Created / Changed

| File | Action | Result |
|------|--------|--------|
| `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py` | Modified | `_CSS` gains fluid tokens (`--fs-0` base + modular `--fs-h1/-h2/-sm`, `--fs-code`, `--rhythm`, `--measure`, `clamp()`-redefined `--text-caption`); `<main>` becomes an `inline-size` query container with a `main>*` fluid base; sized rules retargeted to the tokens; `table.diff` `font` shorthand converted to longhand; prose measure split onto a `ch` cap; two `@container report (...)` refinements added. No markup/CSP change. |
| `.opencode/skills/sk-doc/create-diff/scripts/test_create_diff.py` | Modified | Added `ReportInvariants::test_fluid_type_layer_is_container_keyed`, asserting the rendered report carries `container-type:inline-size` and an `@container report` block. |

### Follow-on increments delivered in this phase

| Increment | Result |
|-----------|--------|
| 2rem page-gutter floor | `main{...padding:2rem}`; locked by `test_page_gutter_has_two_rem_minimum`. |
| Cursor light-mode design | Parchment/ink/ember palette (add=forest, removed=crimson), bone/linen/stone surfaces, 4px geometry (no pills), weight-400 headline with Cursor tracking, CursorGothic/berkeleyMono-led stacks; light-only (dark override removed, locked by `test_report_is_light_mode_only`). Tokens consumed from `.opencode/skills/sk-design/styles/cursor/`. |
| Heading-aware document sections | Markdown diffs surface the nearest heading above each change as a divider band (including out of collapsed runs); hunk headers carry `· § <section>`; change-free heading bands emit no `@@` noise; text/HTML inputs unaffected. |
| Deep-review remediation | 10-iteration SOL review (`review/review-report.md`, verdict FAIL) → P0 snapshot-manifest containment (`_safe_blob_path` at the compare read + cleanup unlink, 4 negative tests), P1 real `@supports (font-size:1cqi)` fallback with static base tokens, P2 strengthened fluid invariant (named container + both refinements). |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The report already used token-based CSS (custom properties, `calc()`, `@media`), so the fluid layer composes on top rather than replacing the stylesheet. The key design choice is container units (`cqi`) on `<main>` instead of viewport units (`vw`): a docked IDE webview's viewport can be the pane or the whole editor, so `vw`/`@media` read the wrong width, whereas `cqi` measures the rendered content column reliably. `html`/`rem` stays fixed at 16px, so the structural caps (100rem page, 72rem summary, 60rem side-by-side scroll floor, `calc(5ch + 1rem)` gutter) and every phase-008 guarantee are byte-stable, while the fluid budget goes to type and section rhythm on descendants where `cqi` resolves cleanly. Each fluid token's maximum endpoint equals the previously shipped fixed size, so a comfortable-width report is visually identical and the change only improves the narrow-split tier. The layer was verified against the `validate_report.py` allowlist (it inspects only `url(`/`@import`/`expression(` substrings, tags/attrs, and the CSP — none of which the layer touches) and against every output-pinning renderer test.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Container queries (`cqi` on `<main>`), not `vw`/`@media` | A webview viewport can be the pane or the editor; `cqi` measures the actual content column, which is the width that matters for readability in a docked pane. |
| Keep `html`/`rem` fixed at 16px; fluidize only type + rhythm | Preserves the phase-008 structural caps and scroll floor byte-for-byte and keeps browser-zoom behaviour intact; the fluid layer adds flex without moving the guarantees. |
| Every fluid token's max endpoint equals today's fixed size | Guarantees zero regression at comfortable width and keeps `test_byte_reproducible` and the visual house style intact; the change is strictly additive at narrow widths. |
| Semantic token set (`--fs-0` + `--fs-code`/`--rhythm`/`--measure`) | Gives the future diff redesign a single place to retune the whole scale, which is the stated purpose of this foundation phase. |
| No markup, no CSP, no inline `style=` | Keeps the safety-validator contract and the self-contained/zero-JS invariant untouched; the container is established purely by CSS on the existing `<main>`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All structural gates run and green.

| Check | Result |
|-------|--------|
| Renderer test suite (REQ-006) | VERIFIED: `python3 -m unittest test_create_diff` → Ran 40 tests, OK (39 prior invariants + the new fluid-layer test). |
| Always-on container-keyed fluid layer (REQ-001) | VERIFIED: rendered output carries `container-type:inline-size`, 4 `cqi` tokens, and 2 `@container report` blocks. |
| Safety-validator contract (REQ-002) | VERIFIED: `_CSS` substring scan → `url(` 0 / `@import` 0 / `expression(` 0; no inline `style=`; CSP `<meta>` byte-identical; `validate_report.py` on unified + side-by-side reports → PASS (exit 0). |
| Phase-008 accessibility preserved (REQ-003) | VERIFIED: `.sxs{min-width:` (60rem floor), `.diff-scroll:focus-visible`, `.legend mark.wd{color:var(--text)}`, `mark.wd.add/.del` decorations, and the light/dark contrast tokens all present unchanged; `LegendContrast` + side-by-side scroll tests green. |
| IDE-width tuning, no comfortable-width regression (REQ-004) | VERIFIED: token max endpoints equal prior fixed sizes (`--fs-0`→`1rem`, `--fs-code`→`13px`); `test_byte_reproducible` holds. |
| Strict validation (this child) | VERIFIED: `validate.sh 010-fluid-responsive-report --strict` → Errors 0. |
| Follow-on increments (REQ-007–REQ-010) | VERIFIED: final suite 48/48 OK; 8/8 gallery reports (incl. three real 500–770-line documents) pass `validate_report.py`; hostile-manifest cleanup replay refused with the victim file intact; first `:root` is static with fluid tokens feature-gated. |
| Deep review (SC-004) | VERIFIED: 10/10 iterations, 4/4 dimensions, verdict FAIL with 3 findings — all remediated post-synthesis; the `/create:diff` command surface and README/hub mentions came back clean. |
| Live IDE-webview visual acceptance | DEFERRED: not reproducible from the authoring environment; rendered unified + side-by-side artifacts were delivered for operator review (CHK-008). |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **12px narrow-pane type floor.** At very narrow splits (<~700px column) the code/caption size settles at its 12px `clamp()` floor (13px at comfortable width). Desktop IDE panes are typically ≥900px so this rarely bites; if judged too small it is a single-value edit on `--fs-code`/`--text-caption`, with no structural or test impact.
2. **Live webview acceptance is operator-owned.** Automated gates confirm the CSS is safe, valid, byte-reproducible, and preserves the accessibility contract, but the subjective narrow-pane readability judgment is a user-runtime step (CHK-008); the rendered reports were delivered for that review.
3. **Outer page gutter stays fixed.** A container cannot measure itself with its own `cqi`, so the `<main>` outer padding remains fixed (now a 2rem floor per the operator's direction); fluidizing it would need a `vw` clamp (deliberately rejected) or a new wrapper element (markup change, out of scope). Flagged as the one place the fluid layer intentionally does not reach.
<!-- /ANCHOR:limitations -->
