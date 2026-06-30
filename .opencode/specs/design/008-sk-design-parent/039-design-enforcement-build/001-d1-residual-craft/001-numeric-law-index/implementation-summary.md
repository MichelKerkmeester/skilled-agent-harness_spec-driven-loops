---
title: "Implementation Summary: Numeric Design Laws Index"
description: "A shared numeric_design_laws.md index gives every cross-mode design value one row, and a stdlib gate fails the moment a row is under-populated."
trigger_phrases:
  - "numeric design laws summary"
  - "numeric law index implementation"
  - "numeric_law_check completeness gate"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/001-numeric-law-index"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Shipped numeric laws index and stdlib completeness gate; verified pass/fail/usage exits"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/numeric_design_laws.md"
      - ".opencode/skills/sk-design/shared/scripts/numeric_law_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Standalone shared reference vs on-demand asset card resolved to a standalone shared reference"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-numeric-law-index |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The numeric design laws that recur across sk-design modes used to live only as scattered restatements: contrast ratios in foundations, timing bands in motion, spacing and type and chroma in token starters, with no canonical home and no way to see drift. You can now open one shared index, `sk-design/shared/numeric_design_laws.md`, and read every cross-mode numeric law as a single row that names its value, its owner mode, what enforces it, where the canonical value lives, and the one caveat that keeps it honest. A companion stdlib checker fails the instant a row is under-populated, so the index cannot quietly rot into half-filled rows.

This is additive and reference-only. The index points at the owner docs that already hold each value; it copies no logic out of them and edits no existing craft file.

### Numeric Design Laws Index

`numeric_design_laws.md` carries one markdown table with a fixed six-column order: `law_id | value/range | owner mode | enforcement target | source | caveat`. Twelve laws are seeded from the live owner values:

| Group | Rows | Values |
|-------|------|--------|
| Contrast trio | `contrast-body-aa`, `contrast-large-ui-aa`, `contrast-apca-lc` | 4.5:1 AA body, 3:1 large text / non-text UI / focus, APCA absolute Lc >= 60 |
| Motion timing bands | `motion-feedback`, `motion-state-change`, `motion-layout-transition`, `motion-earned-entrance` | 100-150ms, 200-300ms, 300-500ms, 500-800ms |
| Register motion budget | `register-product-motion-budget` | 150-250ms Product budget, with a drift caveat that motion bands remain the owner |
| Spacing / type / color | `spacing-scale`, `type-modular-ratio`, `type-body-size`, `neutral-chroma` | 4px scale + section clamp, 1.2 / 1.25-1.333 ratio, body >= 16px, neutral chroma C 0.005-0.015 |

Only the three contrast rows name a real script (`design-foundations/scripts/contrast_check.py`) in the enforcement-target column. Every other row is labeled `advisory (no script)`. That label is deliberate: it makes the absence of a calculator visible in the column rather than implying enforcement that does not exist.

### Completeness Gate

`sk-design/shared/scripts/numeric_law_check.py` is a stdlib-only checker that mirrors the existing `proof_check.py` convention. It locates the `## 1. Law Index` heading, reads the first markdown table beneath it, extracts six-cell rows in fixed order, and reports any cell that is empty, whitespace-only, or a placeholder (`__________`, `TBD`, `TODO`, `-`). Zero data rows is also a failure. It does not check that a value was applied well anywhere; it checks only that the index itself is complete.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/shared/numeric_design_laws.md` | Created | Six-column index of 12 cross-mode numeric laws with owner, enforcement, source, and caveat |
| `.opencode/skills/sk-design/shared/scripts/numeric_law_check.py` | Created | Stdlib completeness gate that fails on any under-populated law row |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh) authored both files additively, populating each row from the live owner values rather than inventing numbers. The orchestrator then verified acceptance independently, reading exit codes without pipe-masking: the populated index passes at exit 0, a scratch copy with one blanked cell fails at exit 1 naming the offending `law_id` and column, and a no-argument invocation returns a usage error at exit 2. `py_compile` is clean. Value provenance was spot-checked against the cited owner docs, and both files were grepped for spec or packet identifiers to keep them evergreen.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Standalone shared reference at `shared/numeric_design_laws.md`, not an on-demand asset card | A central registry is what makes cross-mode drift visible; an asset card stays mode-local |
| Index points at owners instead of copying their logic | Copying values would create a second source of truth and reintroduce the drift the index is meant to expose |
| Every non-contrast row labeled `advisory (no script)` | Only contrast has a real calculator today; honest labeling beats a false enforcement signal |
| Completeness gate checks population, not correctness | The docs benchmark bites on under-filled rows; value correctness is verified by diff against owners, not by the gate |
| Stdlib-only checker mirroring `proof_check.py` | Reuses the existing shared-script convention with no new dependency to unwind |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `numeric_law_check.py numeric_design_laws.md` on the populated index | PASS, exit 0, "rows: 12, all numeric law rows are fully populated" |
| Tamper: blank one required cell on a scratch copy | FAIL, exit 1, "FAIL - contrast-body-aa: blank value/range" |
| Usage: no argument | Usage error, exit 2, "usage: numeric_law_check.py [--json] <numeric_design_laws.md>" |
| `python3 -m py_compile numeric_law_check.py` | PASS, compile OK |
| Value provenance: contrast 4.5:1 / 3:1 / APCA Lc >= 60 and the four motion bands | Match the cited owner docs (`contrast_pair_inventory.md`, `oklch_workflow.md`, `motion_strategy.md`) |
| Evergreen + scope audit | Both new files carry stable skill-relative paths and law slugs, no spec or packet IDs; change set is the two named files only |
| `validate.sh <folder> --strict` | Spec-doc rules clean; only the expected generated-metadata fingerprint residual remains for orchestrator regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Completeness, not correctness.** The gate proves every row is populated and that each value is cited consistently; it cannot prove a value was applied well in any live build.
2. **Only contrast is script-enforced.** `contrast_check.py` is the single real calculator. Every other row is `advisory (no script)`, so motion, spacing, type, and chroma values rely on author discipline.
3. **Register-vs-motion drift is a caveat, not a contradiction.** `register-product-motion-budget` (150-250ms) is recorded with a drift caveat that the detailed timing bands remain owned by `motion_strategy.md`.
4. **Generated metadata regenerates downstream.** `description.json` still reads Level 1 and `graph-metadata.json` carries a stale source fingerprint; the orchestrator regenerates both. They are not hand-written here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
