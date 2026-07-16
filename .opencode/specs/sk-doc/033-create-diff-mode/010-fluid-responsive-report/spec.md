---
title: "Feature Specification: Fluid-responsive HTML report layout for create-diff"
description: "Give the create-diff HTML report an always-on, container-query fluid type and section-rhythm layer tuned for IDE desktop preview-pane widths, without changing markup, the CSP, the safety-validator contract, or any phase-008 accessibility guarantee — and expose clean design tokens so the diff visual design can be iterated further."
trigger_phrases:
  - "create diff fluid responsive report"
  - "diff report container query"
  - "fluid type scale diff html"
  - "create-diff report ide width"
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
    open_questions:
      - "Should the code/caption clamp floor stay at 12px for very narrow splits, or be raised to 13px?"
    answered_questions:
      - "The fluid layer keys off the content column via container queries (cqi), not the viewport (vw)."
      - "Structural caps (100rem page, 72rem summary, 60rem side-by-side floor) stay fixed rem so every phase-008 guarantee is preserved."
---
# Feature Specification: Fluid-responsive HTML report layout for create-diff

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../009-create-diff-command/spec.md` |
| **Successor** | None; new terminal child (adds the fluid-responsive report layer) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The create-diff HTML report is a self-contained document opened inside IDE preview panes and editor webviews on the desktop, whose widths vary widely (a narrow split around 480–700px, a half-screen editor around 900–1100px, a full editor up to ~1600px+). The shipped renderer sized type and section rhythm with fixed `rem`/`px` values tuned for a comfortable browser width, so in a narrow docked pane the report did not adapt: text stayed one fixed size regardless of the column it actually rendered into, and there was no fluid design system to build further visual refinement on. A viewport-based approach (`vw`/`@media`) is unreliable here because a webview's viewport can be the pane or the whole editor, so it reads the wrong width.

### Purpose
Add an always-on fluid-responsive layer to the report renderer that scales type and section rhythm to the **content column** (via CSS container queries, `cqi`), tuned for the IDE desktop width envelope, while keeping the structural caps, markup, Content-Security-Policy, and safety-validator contract byte-stable and preserving every phase-008 accessibility guarantee. The layer is expressed as a small set of semantic design tokens so the diff visual design can be iterated by editing one scale, not the whole stylesheet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A fluid type + section-rhythm layer in the report renderer's embedded stylesheet (`create_diff.py` `_CSS`): the report container becomes an `inline-size` query container; new `clamp()` tokens keyed to container units (`cqi`) with `px`/`rem` min–max bounds drive body, heading, caption, code, and rhythm sizing; two `@container` refinements adjust the summary label column and content padding at the narrow and wide ends.
- Preserving the structural caps (page `max-width`, summary table width, side-by-side scroll floor) as fixed `rem` so layout guarantees are unchanged; splitting the prose measure onto a `ch`-based cap.
- One renderer regression test that locks the fluid layer (asserts the rendered CSS carries the container context and an `@container` block).
- **Delivered follow-on increments (operator-directed iterations in this phase):** the Cursor light-mode design adoption (parchment/ink/ember palette with forest/crimson diff hues, bone/linen/stone surfaces, 4px geometry, Cursor-led font stacks, light-only lock — tokens sourced from `.opencode/skills/sk-design/styles/cursor/`), a ≥2rem page-gutter floor, heading-aware document sections for markdown diffs (nearest-heading bands + `§`-labeled hunks), and the deep-review remediation: snapshot-manifest blob containment before reads/deletes plus a real `@supports`-gated unsupported-`cqi` fallback.

### Out of Scope
- Any HTML/markup change or wrapper element (the container is established purely in CSS on the existing `<main>`).
- Any change to the Content-Security-Policy `<meta>` or the `validate_report.py` safety contract.
- Any change to diffing, extraction, snapshotting, the report structure, or fidelity tiers (owned by phases 002–008).
- The diff *visual* redesign itself — this phase delivers the fluid foundation and design tokens that redesign will build on, not the redesign.
- The 999→033 packet reference reconciliation and the parent phase-map wiring (handled alongside this phase but tracked as the renumber fix, not this feature).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py` | Modify | Add the container-query fluid type/rhythm layer to the `_CSS` constant: `container-type:inline-size` on `<main>`, `--fs-*`/`--rhythm`/`--measure` clamp tokens, longhand `table.diff` font, split prose measure, and two `@container report (...)` blocks. No markup or CSP change. |
| `.opencode/skills/sk-doc/create-diff/scripts/test_create_diff.py` | Modify | Add one invariant test asserting the rendered report carries `container-type:inline-size` and an `@container report` block, locking the fluid layer. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The fluid layer is always on and container-keyed | The rendered report establishes an `inline-size` container on `<main>` and scales type + section rhythm from `cqi`-based `clamp()` tokens; sizing responds to the content column, not the viewport. |
| REQ-002 | The safety-validator contract is unbroken | The added CSS introduces none of the substrings `url(`, `@import`, `expression(`, adds no inline `style=` attribute, no new tag/attribute, and leaves the CSP `<meta>` byte-identical; every generated report still passes `validate_report.py` (exit 0). |
| REQ-003 | Phase-008 accessibility guarantees are preserved | The side-by-side `min-width` scroll floor, the labelled scroll region, the legend full-strength-text rule, the inline add/del non-colour decorations, and the contrast gates (≥4.5:1 on inline marks) all hold after the light-only recolor. |
| REQ-007 | Snapshot-manifest paths are contained to their store | No manifest-controlled blob path may resolve outside its own snapshot directory: traversal, absolute-path, symlink-escape, and malformed-shape entries are refused before any read or unlink, with negative tests covering each variant plus legitimate-cleanup parity. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Tuned to the IDE desktop width envelope with no regression at comfortable width | The clamp tokens span roughly a 480–1600px content column; every token's maximum endpoint equals the previously shipped fixed size, so a comfortable-width report is visually unchanged. |
| REQ-005 | Clean iteration hooks | The scale is driven by a single base token plus a small set of named semantic tokens (type, code, rhythm, measure), so the visual design can be retuned by editing those values rather than individual rules. |
| REQ-006 | The layer is regression-locked | A renderer test asserts the fluid context, the named container, both `@container` refinements, and the `@supports` fallback gate, and the full renderer test suite stays green. |
| REQ-008 | The report ships the Cursor light-mode design | The palette, surfaces, geometry, font stacks, and ≥2rem page gutter derive from the extracted Cursor tokens; the report is light-only (`color-scheme:light`, no dark override), locked by test. |
| REQ-009 | Markdown diffs are navigable by document structure | The nearest heading above each change surfaces as a section band (including out of collapsed runs), change hunks carry their section name, unchanged sections stay collapsed, and plain-text/HTML inputs are unaffected. |
| REQ-010 | The unsupported-`cqi` fallback is real | Base tokens are static at the shipped fixed sizes and fluid values apply only inside `@supports (font-size:1cqi)`, so engines without container-query units render the fixed scale instead of inheriting; locked by test. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The renderer test suite passes in full, including the new fluid-layer invariant test.
- **SC-002**: Both report views (unified and side-by-side) generate end to end and pass `validate_report.py` (exit 0), with the rendered CSS carrying `container-type:inline-size` and both `@container report` refinements.
- **SC-003**: All phase-008 accessibility literals and the CSP are byte-preserved (no contrast, scroll, or safety regression), and `validate.sh --strict` on this child reports 0 content/structure errors.
- **SC-004**: A 10-iteration deep review of the skill + command surface completes with all four dimensions covered, and every active finding (P0 manifest containment, P1 fallback, P2 test lock) is remediated with passing regression tests before this phase re-closes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A CSS change silently trips the safety validator | High | The validator inspects only `url(`/`@import`/`expression(` substrings, tags/attrs, and the CSP; the layer uses none of those and keeps markup + CSP byte-identical, verified by the conformance tests. |
| Risk | The restyle regresses a contrast or scroll accessibility guarantee | High | Structural caps stay fixed `rem`; the contrast/scroll/legend literals are preserved byte-for-byte and pinned by the phase-008 tests. |
| Risk | Type becomes unreadably small on a very narrow split | Low | Every clamp token has a hard `px`/`rem` floor; the narrowest code/caption size is bounded (12px) and is a single-value tunable. |
| Dependency | `create_diff.py` renderer + `validate_report.py` (phases 002–008) | Low | Consumed as the existing renderer and gate; the change is additive within `_CSS`. |
| Dependency | Container-query support in the target webview engine | Low | Modern Chromium-based IDE webviews support `@container`; with no container support the `px`/`rem` clamp bounds degrade to the previously shipped fixed sizes. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The layer adds only static CSS; there is no script, no layout thrash, and report generation cost is unchanged (byte-reproducible output is preserved).

### Security
- **NFR-S01**: No new network, font, image, or external reference is introduced; the report stays fully self-contained under the existing CSP.

### Reliability
- **NFR-R01**: The output stays byte-reproducible under a fixed `SOURCE_DATE_EPOCH` (the CSS is static), so audits remain deterministic.
- **NFR-R02**: With no container-query support the `clamp()` `px`/`rem` bounds hold, so text never runs away and degrades to the shipped fixed sizes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Very narrow pane (~480px column): type settles at its clamp floors (12px code/caption); layout stays intact and the side-by-side view still scrolls rather than overflowing the document.
- Very wide editor (>1600px): the page `max-width` cap holds; type settles at its clamp ceilings (the previously shipped sizes), so the report reads identically to today.

### Error Scenarios
- No container-query support: `cqi` terms are ignored and each `clamp()` resolves at its bounds, so the report renders at fixed, readable sizes rather than breaking.
- Forced-colors / high-contrast mode: the existing forced-colors block is preserved, so marks and gutters keep their non-colour cues.

### State Transitions
- The change is purely presentational; no state, snapshot, or engine behaviour is affected, so an interrupted render leaves nothing to reconcile.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One embedded stylesheet layer + one regression test; no markup, CSP, or engine change. |
| Risk | 14/25 | Small surface but it edits the shipped runtime renderer; main hazards (validator, contrast, scroll) are all gated by existing tests and preserved literals. |
| Research | 6/20 | Fluid-scale approach adapted from a reference design system and verified against the validator/test contract; no open investigation. |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the code/caption clamp floor stay at 12px for the narrowest splits, or be raised to 13px at the cost of slightly larger minimum type?
- Should a future iteration also fluidize the outer page gutter (which stays fixed `px` here because a container cannot measure itself with its own `cqi`)?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md` (phase parent for the create-diff engine and mode).
- **Predecessor**: `../009-create-diff-command/spec.md` (the `/create:diff` command that invokes this renderer).
- **Renderer**: `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py` (`_CSS` and `render_report`).
- **Safety gate**: `.opencode/skills/sk-doc/create-diff/scripts/validate_report.py` (the allowlist the layer stays within).
- **Design tokens**: `.opencode/skills/sk-design/styles/cursor/` (the extracted Cursor style reference the light-mode design consumes).
- **Deep-review packet**: `review/review-report.md` (verdict FAIL → remediated; 10 iterations, findings registry, resource map).
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
