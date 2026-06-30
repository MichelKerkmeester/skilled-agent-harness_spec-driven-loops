---
title: "Implementation Summary: Baseline Rhythm Token"
description: "A --baseline rhythm row plus baseline_rhythm_check.py make vertical rhythm executable: any spacing value that is neither a 4px multiple/fraction nor a marked exception now fails."
trigger_phrases:
  - "baseline rhythm token summary"
  - "baseline rhythm implementation"
  - "baseline_rhythm_check spacing validator"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/007-baseline-rhythm-token"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Shipped baseline rhythm row, link, validator; reconciled numeric-law spacing row"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-foundations/assets/token_starter.md"
      - ".opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md"
      - ".opencode/skills/sk-design/design-foundations/scripts/baseline_rhythm_check.py"
      - ".opencode/skills/sk-design/shared/numeric_design_laws.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Baseline anchor resolved to the existing 4px base, so the current scale validates with no value changed"
      - "Numeric-law spacing-scale enforcement drift resolved by approved scope amendment: the row now cites the checker"
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
| **Spec Folder** | 007-baseline-rhythm-token |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A spacing scale could previously say "use the scale" and still let a one-off value slip through, because the line-height-to-spacing relationship was required nowhere. The vertical-rhythm contract is now executable. The `token_starter.md` §4 Spacing Scale carries a `--baseline` rhythm row and a rule that every spacing token and the body line-height resolves to an integer multiple or a simple fraction of the baseline, or is a labeled exception. A new stdlib checker, `baseline_rhythm_check.py`, reads that §4 block and rejects any spacing value that is neither a baseline multiple/fraction nor a marked exception. One-off spacing went from silent to loud and blocking.

This is additive and no-regression. The baseline is anchored to the existing 4px base step, so every value already in the scale validates and no listed number changed. The two craft edits are insertions, not rewrites.

### Baseline rhythm row and resolve-to-baseline rule

`token_starter.md` §4 now names the rhythm base as `--baseline` (`4px`) and states the relation directly: every spacing token and the body line-height is a whole multiple or a simple ½/¼ fraction of the baseline, and a value that genuinely cannot be is written as a deliberate, labeled exception. That `exception` marker is a literal convention the validator scans for, so the doc and the checker agree on one word. Because the existing scale (`4, 8, 12, 16, 24, 32, 48`, `clamp(48px, 8vw, 96px)`) is already entirely multiples of 4 and a 24px body line-height is 6 × 4, the rule codifies the rhythm that was already there rather than re-tuning any number.

### Cross-link from the responsive layout reference

`layout_responsive.md` §2 Spacing System already told readers to "use a defined scale, not arbitrary one-off values" with a 4-point base. It now carries one cross-link pointing at the baseline rhythm row as the canonical home of that base, so a reader establishing layout rhythm is sent to the token that defines it. The link is the single additive touch in that file; no existing rule or section moved.

### Spacing-rhythm validator

`design-foundations/scripts/baseline_rhythm_check.py` is a stdlib-only checker co-located with `contrast_check.py` and mirroring its docstring, exit-code, and `--json` convention. It locates the §4 Spacing Scale block, reads the `--baseline` value as the rhythm base, and classifies each spacing value: a pass when it is an integer multiple or a simple ½/¼ fraction of the baseline, a pass when the row carries the `exception` marker, a pass for a `clamp()`/fluid value whose fixed-px anchors are baseline multiples (viewport terms are inherently fluid and exempt), and a fail otherwise, naming the offending token. Missing baseline or missing spacing rows fail by name. The checker is scoped to the §4 Spacing Scale block, so it bites on the spacing contract and nothing else.

### Numeric-law index reconciliation (scope amendment)

The shared `numeric_design_laws.md` spacing row was honestly labeled `advisory (no script)` with the caveat that no checker rejected one-off spacing values. That label is now stale, because such a checker exists. Under an orchestrator-approved scope amendment, this phase updated that one row's enforcement-target/caveat cell to cite `baseline_rhythm_check.py` instead of `advisory (no script)`. The edit is a single row's cells; the row still carries all six columns, so the law index's own completeness gate (`numeric_law_check.py`) stays green.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/design-foundations/assets/token_starter.md` | Modified | §4 gains a `--baseline` rhythm row and the resolve-to-baseline-or-exception rule; no listed spacing value changed |
| `.opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md` | Modified | §2 gains one cross-link to the baseline rhythm row |
| `.opencode/skills/sk-design/design-foundations/scripts/baseline_rhythm_check.py` | Created | Stdlib validator that fails spacing values that are neither a baseline multiple/fraction nor a marked exception |
| `.opencode/skills/sk-design/shared/numeric_design_laws.md` | Modified | Scope amendment: the spacing-scale row now cites `baseline_rhythm_check.py` instead of `advisory (no script)` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) authored all four changes additively: the §4 row and rule line, the §2 cross-link, the new `baseline_rhythm_check.py`, and the single reconciled row in `numeric_design_laws.md`, anchoring the baseline to the existing 4px base so no listed value moved. The orchestrator then verified acceptance independently, reading exit codes without pipe-masking and with sync: `baseline_rhythm_check.py token_starter.md` passes at exit 0 because every spacing value resolves to the 4px baseline; a scratch copy with one in-block non-baseline value (`24px`->`25px`) fails at exit 1, with the gate biting scoped to the §4 Spacing Scale block; a no-argument invocation returns a usage error at exit 2. `numeric_law_check.py numeric_design_laws.md` still passes at exit 0, confirming the reconciled row keeps all six columns. `py_compile` is clean, the two doc edits are additive with no value change and no renumber, an evergreen grep is clean, and the scope is clean: `contrast_check.py` and `numeric_law_check.py` were not touched.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Anchor the baseline to the existing 4px base step | The whole scale is already 4px multiples, so codifying the rhythm changes no number and keeps the edit no-regression |
| Make the `exception` marker a single literal word the doc and checker share | The doc and the validator must agree on one convention, or a marked row would pass for a reason the doc never stated |
| Scope the validator to the §4 Spacing Scale block | The gate should bite on the spacing contract precisely and not misfire on unrelated tables |
| Treat `clamp()`/fluid viewport terms as exempt, fixed-px anchors as checked | Viewport units are inherently fluid; only the fixed anchors can be held to the baseline |
| Fold the numeric-law row reconciliation into this phase as an approved scope amendment | A real checker now exists, so leaving the row labeled `advisory (no script)` would be a known-stale honesty gap; the amendment closes it without breaking the law-index gate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `baseline_rhythm_check.py token_starter.md` on the live scale | PASS, exit 0, every spacing value resolves to the 4px baseline |
| Tamper: in-block non-baseline value (`24px`->`25px`) on a scratch copy | FAIL, exit 1, gate bites scoped to the §4 Spacing Scale block, naming the offending token |
| Usage: no argument | Usage error, exit 2 |
| `numeric_law_check.py numeric_design_laws.md` after the row reconciliation | PASS, exit 0, the reconciled spacing-scale row keeps all six columns |
| `python3 -m py_compile baseline_rhythm_check.py` | PASS, compile OK |
| Additive audit: `token_starter.md` + `layout_responsive.md` edits | Additive only, no listed value changed, no section renumber |
| Evergreen audit over the edits and the new checker | Clean, no spec/packet/phase IDs or `specs/` paths |
| Scope audit | Clean, `contrast_check.py` and `numeric_law_check.py` untouched |
| `validate.sh <folder> --strict` | Spec-doc rules clean; only the expected generated-metadata fingerprint residual remains for orchestrator regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Spacing tokens, not the type table.** The checker proves each populated spacing value relates to the baseline or is honestly marked. It does not hard-check the §3 type table's line-height column, which ships as fill-in blanks; that relation stays governed by the stated rule and advisory until a system is filled in.
2. **Loud, not aesthetic.** The validator makes one-off spacing blocking, but it cannot prove the resulting vertical rhythm looks right; it proves the relation, not the taste.
3. **One reconciled law row, by amendment.** The numeric-law spacing row was updated under an approved scope amendment, not as an original target; the rest of `numeric_design_laws.md` is untouched and its completeness gate stays green.
4. **Generated metadata regenerates downstream.** `description.json` still reads Level 1 and `graph-metadata.json` carries a stale source fingerprint; the orchestrator regenerates both. They are not hand-written here.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
