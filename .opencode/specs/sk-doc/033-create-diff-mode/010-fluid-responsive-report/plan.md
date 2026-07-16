---
title: "Implementation Plan: Fluid-responsive HTML report layout for create-diff"
description: "Add a container-query fluid type and section-rhythm layer to the create_diff.py report stylesheet, tuned for IDE preview-pane widths, within the validate_report.py safety contract and preserving every phase-008 accessibility guarantee; lock it with a renderer regression test."
trigger_phrases:
  - "fluid responsive report plan"
  - "create diff container query plan"
  - "diff report css clamp plan"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/033-create-diff-mode/010-fluid-responsive-report"
    last_updated_at: "2026-07-16T14:27:21Z"
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
    answered_questions: []
---
# Implementation Plan: Fluid-responsive HTML report layout for create-diff

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CSS embedded in a Python 3 string constant (`_CSS`); Python `unittest` for the regression test |
| **Framework** | None — the renderer's own token-based stylesheet convention (custom properties, `calc()`, `@media`) |
| **Storage** | None touched — the report is a self-contained HTML string; no state, snapshot, or engine change |
| **Testing** | Full `test_create_diff.py` renderer suite + one new fluid-layer invariant + `validate_report.py` on generated reports + `validate.sh --strict` |

### Overview
Layer a container-query fluid type and section-rhythm scale onto the existing report stylesheet. Make `<main>` an `inline-size` query container, add a single fluid base token plus a modular type scale and semantic `code`/`rhythm`/`measure` tokens, convert the diff-table `font` shorthand to longhand so the fluid `font-size` composes cleanly, and add two `@container` refinements for the narrow and wide ends. `html`/`rem` stays fixed at 16px so all structural caps and phase-008 guarantees are byte-stable; every fluid token's maximum endpoint equals the previously shipped fixed size, so a comfortable-width report is visually identical. The change is additive within `_CSS` — no markup, no CSP, no engine change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The validator contract is confirmed: `validate_report.py` inspects only `url(`/`@import`/`expression(` substrings, tags/attrs, and the CSP
- [x] The phase-008 pinned literals and the contrast-token regex boundaries are enumerated
- [x] The IDE-width envelope and the reference fluid system are digested; container units chosen over viewport units

### Definition of Done
- [x] Fluid tokens + container established in `_CSS`; sized rules retargeted; two `@container` refinements added
- [x] No `url(`/`@import`/`expression(`, no inline `style=`, CSP byte-identical; every generated report passes `validate_report.py`
- [x] Every phase-008 accessibility literal preserved byte-for-byte
- [x] Renderer suite green including the new fluid-layer test; `validate.sh --strict` on this child = 0 errors
- [x] Follow-on increments delivered under this phase: 2rem gutter floor, Cursor light-mode design (light-only lock), heading-aware markdown sections, snapshot-manifest blob containment, and the `@supports`-gated `cqi` fallback — each locked by its own regression test (suite 48/48)
- [x] Deep review (10 iterations) synthesized to `review/review-report.md`; all active findings remediated before re-close
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A fluid presentation layer composed on top of the existing token stylesheet: container context on `<main>` → `cqi`-based `clamp()` tokens → sized rules reference the tokens. Structural sizing (caps, scroll floor, gutter) stays on fixed `rem`/`px`; only type and section rhythm flex.

### Key Components
- **Container context**: `container-type:inline-size;container-name:report` on `<main>`, plus `main>*{font-size:var(--fs-0)}` as the single fluid base.
- **Type scale**: `--fs-0` (fluid base) + modular `--fs-h1/-h2/-sm` via `calc()`; `--fs-code` and the redefined `--text-caption` as `clamp()`.
- **Rhythm + measure**: `--rhythm` (fluid section top-margin) and `--measure` (`min(72rem, 84ch)` prose cap).
- **Container refinements**: two `@container report (...)` blocks for the narrow (≤34rem) and wide (≥80rem) ends.
- **Regression lock**: one renderer test asserting the fluid context + an `@container` block are rendered.

### Data Flow
Render path unchanged: `render_report` emits the same markup with the `_CSS` block inline. At view time the browser/webview resolves `cqi` against `<main>`'s content column and each `clamp()` settles within its `px`/`rem` bounds. With no container-query support the `cqi` terms are ignored and the clamp bounds hold, degrading to the previously shipped fixed sizes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `create_diff.py` `_CSS` (stylesheet) | Fixed `rem`/`px` type sizing | modify: add container context + fluid `clamp()` tokens + two `@container` blocks | grep: `container-type:inline-size`, 4 `cqi` tokens, 2 `@container report` blocks present |
| `create_diff.py` `render_report` (markup) | Emits report HTML | none — markup byte-unchanged | grep: no new tag/attr; CSP `<meta>` byte-identical |
| `validate_report.py` (safety gate) | Allowlist validator | none — consumed as the gate | run: `validate_report.py` on both views → exit 0 |
| `test_create_diff.py` (suite) | Pins renderer invariants | modify: add one fluid-layer invariant test | run: `python3 -m unittest test_create_diff` → OK |

Required inventories:
- Validator contract: `validate_report.py` `_style_problems` (`url(`/`@import`/`expression(` only), `ALLOWED_TAGS`/`ALLOWED_ATTRS`, `REQUIRED_CSP_DIRECTIVES` (exact-set match).
- Pinned literals: `.sxs{min-width:`, `.diff-scroll:focus-visible`, `.legend mark.wd{color:var(--text)}`, `mark.wd.add/.del` decorations, first `:root{…}` + dark `@media(prefers-color-scheme:dark){:root{…}}` with `--text`/`--add-inline`/`--del-inline` as `#hex`.
- Invariant (safety): the added CSS introduces none of `url(`/`@import`/`expression(` and no inline `style=`.
- Invariant (no regression): every fluid token's max endpoint equals the previously shipped fixed size.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Tokens + container
- [x] Add the fluid tokens to the first `:root` block (`--fs-0`, `--fs-h1/-h2/-sm`, `--fs-code`, `--rhythm`, `--measure`; redefine `--text-caption`) (REQ-001, REQ-005)
- [x] Establish the `inline-size` container on `<main>` + `main>*` fluid base (REQ-001)

### Phase 2: Retarget rules + refinements
- [x] Point `h1`/`h2`/`.warn h2`/`.summary`/`.key` at the tokens; convert `table.diff` `font` shorthand to longhand (REQ-001, REQ-004)
- [x] Split the prose measure onto `--measure`; keep the summary table at `72rem` (REQ-003, REQ-004)
- [x] Add the two `@container report (...)` refinements (REQ-001)

### Phase 3: Lock + verify
- [x] Add the fluid-layer regression test (REQ-006)
- [x] Run the suite; generate both views + `validate_report.py`; confirm the safety/a11y invariants; `validate.sh --strict` (REQ-002, REQ-003, REQ-006)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Full renderer invariant suite + the new fluid-layer test | `python3 -m unittest test_create_diff` |
| Safety | Both views pass the allowlist validator | `validate_report.py <report>` (exit 0) |
| Contract | Zero `url(`/`@import`/`expression(`; CSP byte-identical; pinned literals intact | Grep of `_CSS` + rendered output |
| Regression | Byte-reproducible output under fixed `SOURCE_DATE_EPOCH` | `test_byte_reproducible` |
| Spec | Child strict validation clean (content/structure) | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `create_diff.py` renderer (phases 002–008) | Internal | Green (shipped, hardened) | None — the change is additive within `_CSS` |
| `validate_report.py` (safety gate) | Internal | Green | Reports could not be validated |
| `test_create_diff.py` (suite) | Internal | Green | The layer could not be regression-locked |
| Container-query support in the target webview | External | Green (modern Chromium webviews) | Degrades to fixed `px`/`rem` clamp bounds — no breakage |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a generated report fails the validator, a contrast/scroll test regresses, or the fluid layer renders unreadably in a real webview.
- **Procedure**: the change is a self-contained additive edit to `_CSS` plus one test. Revert the `_CSS` diff and the added test to restore the previously shipped fixed-size stylesheet. No markup, CSP, engine, data, or deployed consumer is affected; nothing is committed until operator go.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Tokens + container) ──► Phase 2 (Retarget rules + refinements) ──► Phase 3 (Lock + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Tokens + container | None | Retarget rules |
| Retarget rules + refinements | Tokens (token names) | Lock + verify |
| Lock + verify | Retarget rules | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Tokens + container | Low | ~0.5 hour |
| Retarget rules + refinements | Low | ~0.5-1 hour |
| Lock + verify | Low | ~0.5 hour |
| **Total** | | **~1.5-2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Full renderer suite green including the new fluid-layer test
- [x] Both report views pass `validate_report.py`
- [x] Zero `url(`/`@import`/`expression(`; CSP byte-identical; pinned a11y literals intact
- [x] No concurrent-session files staged

### Rollback Procedure
1. Revert the `_CSS` fluid-layer diff in `create_diff.py`
2. Remove the `test_fluid_type_layer_is_container_keyed` test

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — a presentational CSS edit + one test only; no persisted state or schema change
<!-- /ANCHOR:enhanced-rollback -->
