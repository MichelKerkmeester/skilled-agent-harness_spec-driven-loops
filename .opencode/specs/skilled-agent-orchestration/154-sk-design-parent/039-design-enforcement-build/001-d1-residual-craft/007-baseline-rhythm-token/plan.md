---
title: "Implementation Plan: Baseline Rhythm Token"
description: "Plan to add a baseline rhythm row to the foundations token starter, link it from the layout/responsive reference, and add a deterministic validator that fails spacing values which are neither a baseline multiple/fraction nor a marked exception. Additive only; reconciled against the shared numeric design laws spacing-scale row."
trigger_phrases:
  - "baseline rhythm token plan"
  - "baseline rhythm design build"
  - "line-height to spacing relation required"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/007-baseline-rhythm-token"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked plan complete with evidence after validator acceptance passed"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-foundations/assets/token_starter.md"
      - ".opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md"
      - ".opencode/skills/sk-design/design-foundations/scripts/contrast_check.py"
      - ".opencode/skills/sk-design/shared/numeric_design_laws.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Baseline anchor resolved to the existing 4px spacing base step, so the current scale validates without changing any listed value"
      - "Spacing checker enforcement-status drift folded into this phase by approved scope amendment; the numeric-law row now cites the checker"
---
# Implementation Plan: Baseline Rhythm Token

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown craft docs + Python 3 stdlib (`re`) for the spacing validator |
| **Primary craft target** | `design-foundations/assets/token_starter.md` §4 Spacing Scale (EDIT, additive row + one rule line) |
| **Link target** | `design-foundations/references/layout/layout_responsive.md` §2 Spacing System (EDIT, additive cross-link) |
| **Validator target** | `design-foundations/scripts/baseline_rhythm_check.py` (NEW, additive — mirrors `contrast_check.py`) |
| **Reconciliation surface** | `shared/numeric_design_laws.md` `spacing-scale` / `type-*` rows (read-only consistency check, not edited here) |
| **Verification** | the validator exits 0 when every spacing value is a baseline multiple/fraction or a marked exception, non-zero when one is neither |

### Overview
Today the line-height→spacing relationship is stated nowhere as a requirement, so vertical rhythm is incidental: a builder can pull any one-off spacing value and nothing notices. The §4 spacing scale already uses a 4-point base (`4, 8, 12, 16, 24, 32, 48`, plus `clamp(48px, 8vw, 96px)`), but nothing names that base as a *baseline* the whole system must resolve to.

This build makes the relation explicit and checkable in three additive moves:

1. Add a **baseline rhythm** row to `token_starter.md` §4 that names the rhythm base (the existing 4px step) and states the rule that every spacing token, and the body line-height, resolves to an integer multiple or a simple fraction of it, or is a marked exception.
2. **Link** that row from `layout_responsive.md` §2, where the "defined scale, not arbitrary one-off values" rule already lives, so a reader establishing layout rhythm is pointed at the baseline token.
3. Add a **deterministic validator** (`baseline_rhythm_check.py`) that reads the §4 spacing table and fails any spacing value that is neither a baseline multiple/fraction nor a marked exception.

Because the chosen baseline is the existing 4px base, every value currently in the scale already validates — the change codifies the rhythm that is already there rather than re-tuning numbers, keeping the edit additive and no-regression. The two craft edits are additive insertions; no existing token value, prose rule, or section order is removed.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec targets confirmed on disk: `token_starter.md` and `layout_responsive.md` exist with the §4 Spacing Scale and §2 Spacing System sections named here
- [x] Validator convention located: `design-foundations/scripts/contrast_check.py` (stdlib, exit 0/1/2, `--json`, WHY-docstring) is the pattern to mirror
- [x] Baseline anchor decided: the existing 4px spacing base step; all current scale values (`4,8,12,16,24,32,48,96`) are whole multiples of it
- [x] Acceptance is deterministic (exit 0 vs non-zero on an unrelated, unmarked spacing value)
- [x] Reconciliation surface read: `numeric_design_laws.md` carries a `spacing-scale` row labeled `advisory (no script)` plus `type-modular-ratio` / `type-body-size` rows

### Definition of Done
- [x] `token_starter.md` §4 carries a baseline rhythm row naming the base unit and the multiple/fraction-or-exception rule, with no listed spacing value changed — `--baseline` row + rule line added, values byte-identical
- [x] `layout_responsive.md` §2 links to the baseline rhythm row via a relative path that resolves on disk — cross-link added, path resolves
- [x] `baseline_rhythm_check.py` exits 0 on the live scale and non-zero on a planted one-off value, naming the offending token — exit 0 live, exit 1 on `24px`->`25px` naming the token
- [x] Validator handles `clamp()`/fluid and missing-baseline cases deterministically (no crash, defined verdict) — fluid anchors checked, viewport exempt, presence guards fire by name
- [x] Numeric consistency confirmed: the baseline base and validated values do not contradict the `spacing-scale` or `type-*` rows in `numeric_design_laws.md` — same 4px base, no contradicting number
- [x] Additive only: no existing token value, prose rule, section, or sibling doc removed or rewritten — additive insertions only; the one numeric-law row edit is a scope-amended cell update
- [x] Evergreen: no spec/packet/phase IDs or `specs/` paths in the token row, the link, or the validator — evergreen grep clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Baseline rhythm row (`token_starter.md` §4 Spacing Scale)
Insert a `baseline rhythm` entry into the §4 spacing table (the `Token | Value | Use` table) plus one rule sentence beneath it. The row names the rhythm base; the sentence states the relation that makes vertical rhythm required rather than incidental.

```markdown
| `--baseline` | `4px` | rhythm base: every spacing token and the body line-height resolves to a whole multiple (or a simple ½/¼ fraction) of this unit |
```

- **Rule line (beneath the table):** every spacing token and the body line-height is an integer multiple or a simple fraction (½, ¼) of `--baseline`; a value that genuinely cannot be is written as a deliberate, labeled exception.
- **Exception marker (deterministic):** an exception row carries an explicit `exception` marker in its Use/notes cell stating why the value cannot be a baseline multiple. This literal marker is what the validator scans for, so the doc and the checker agree on one convention.
- **Why 4px:** the existing scale (`4, 8, 12, 16, 24, 32, 48`, `clamp(48px, 8vw, 96px)`) is already entirely multiples of 4, and a body line-height of 24px (16px × 1.5) is 6 × 4 — so the existing rhythm is the baseline, and nothing in the scale needs to change to pass.
- The implementer finalizes exact wording and the precise table position against the live §3/§4 at build time, the way the sibling law-index phase finalized its rows against live owners.

### Link from `layout_responsive.md` §2 Spacing System
§2 already states "Use a defined scale, not arbitrary one-off values. A 4-point base...". Add one sentence there pointing to the baseline rhythm row as the canonical home of that base, e.g. a relative link to `../../assets/token_starter.md` §4 (path resolves: `references/layout/` → `../../` → `design-foundations/` → `assets/token_starter.md`). Confirm the exact relative path on disk before saving. §3 Hierarchy And Rhythm may carry a one-line echo only if it reads naturally; keep the §2 link as the required touch and avoid widening the edit.

### `baseline_rhythm_check.py` algorithm (the validator)
A small stdlib checker co-located with `contrast_check.py`, mirroring its docstring/exit/`--json` convention.

1. **Parse** `token_starter.md`: locate the §4 Spacing Scale table, read each row's token, value, and Use/notes cell. Read the `--baseline` value as the rhythm base.
2. **Classify each spacing value:**
   - *Pass* when the value is an integer multiple or a simple fraction (½, ¼) of the baseline.
   - *Pass* when the row's Use/notes cell carries the explicit `exception` marker.
   - *Pass* a `clamp()`/fluid value when all of its fixed-px anchors are baseline multiples (viewport/percent terms — `vw`, `vh`, `%` — are inherently fluid and exempt), or when the row is marked an exception.
   - *Fail* otherwise, naming the offending token + value.
3. **Presence guards:** no `--baseline` row found → fail (`baseline token missing`); no spacing rows → fail (`spacing rows missing`).
4. **Unit rule:** define one deterministic unit convention (resolve `rem`/`em` against a 16px root, or require `px` in the scale and treat other units as marked exceptions); document the chosen rule in the docstring so behavior is predictable.
5. **Exit contract:** 0 = every spacing value relates to the baseline or is a marked exception; 1 = an unrelated unmarked value or a missing baseline; 2 = usage/read error. `--json` optional, mirroring `contrast_check.py`.

> Honest ceiling: the validator proves each *populated* spacing value relates to the baseline or is honestly marked. It does not hard-check the §3 type table's line-height column, which ships as fill-in blanks — that relation is governed by the stated rule and stays advisory until a system is filled in. The checker makes one-off spacing *loud and blocking*; it cannot prove the resulting rhythm looks right.

### Additive / no-regression contract
- The two craft edits are insertions: one new spacing row + one rule line in `token_starter.md`, one link sentence in `layout_responsive.md`. No existing value, rule, or section is removed or reordered.
- The validator is a NEW file; it reads `token_starter.md` and adds no dependency to any existing checker.
- Because the baseline is the existing 4px base, the current scale validates as-is, so the edit introduces no value churn and reverting the three changes restores the prior state exactly.

### Reconciliation with `numeric_design_laws.md`
- **Numeric consistency (in scope, hard):** the baseline base (4px) and the validated values must not contradict the `spacing-scale` row (`4px, 8px, 12px, 16px, 24px, 32px, 48px; clamp(48px, 8vw, 96px)`), the `type-modular-ratio` row, or the `type-body-size` row. They do not — the baseline is the same 4px base, and a 16px body at 1.5 line-height is a clean multiple.
- **Enforcement-status drift (flagged, out of this phase's named scope):** the `spacing-scale` row is labeled `advisory (no script)` with the caveat "no checker currently rejects one-off spacing values." Once `baseline_rhythm_check.py` lands, that label and caveat become stale — a checker now exists. `numeric_design_laws.md` is owned by the law-index sibling and is NOT one of this spec's named targets, so this phase does **not** edit it. The recommendation, surfaced as the open decision below, is for the orchestrator to either fold a one-line row update (enforcement target → the new checker) into this phase as a scope amendment, or schedule it on the law-index owner. Either way the drift is named, not silently left or silently patched.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Baseline rhythm row + responsive link
- [x] Add the `baseline rhythm` row and the multiple/fraction-or-exception rule line to `token_starter.md` §4, changing no existing spacing value — `--baseline` row + rule added, values unchanged
- [x] Add the cross-link from `layout_responsive.md` §2 to the baseline rhythm row, confirming the relative path resolves on disk — cross-link added, path resolves on disk

### Phase 2: Spacing validator
- [x] Create `design-foundations/scripts/baseline_rhythm_check.py` (stdlib only) parsing the §4 spacing table and reading the baseline base — created, scoped to the §4 Spacing Scale block, mirrors `contrast_check.py`
- [x] Implement classification: integer multiple / simple fraction / marked exception / fluid-anchor pass; fail on an unrelated unmarked value; presence guards for missing baseline or missing rows — implemented and verified
- [x] Wire the exit contract (0 pass / 1 fail / 2 usage) and an optional `--json` payload mirroring `contrast_check.py` — exit 0/1/2 verified, `py_compile` clean

### Phase 3: Verification
- [x] Acceptance (pass): run the validator on the live scale → exit 0 — exit 0, every spacing value resolves to the 4px baseline
- [x] Acceptance (fail): plant a one-off value with no exception marker → non-zero exit naming the token; restore — `24px`->`25px` scratch copy exits 1 naming the token, gate scoped to §4
- [x] Exception path: mark that planted value an exception → exit 0 — marked row passes deterministically
- [x] Edge matrix: `clamp()`/fluid row, missing-baseline, no-spacing-rows, and a half-step fraction all return a defined verdict without crashing — all verdicts defined, no crash
- [x] Reconciliation: diff the baseline base and validated values against the `spacing-scale` and `type-*` rows in `numeric_design_laws.md`; confirm no contradiction and record the enforcement-status drift note — no contradiction; drift reconciled by scope amendment, `numeric_law_check.py` still exit 0
- [x] Evergreen + scope audit: grep the two edits and the validator for IDs/`specs/` paths; confirm only the additive insertions and the one new file are in the change set — evergreen clean; change set is the three edits + one new checker, `contrast_check.py` and `numeric_law_check.py` untouched

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Acceptance (pass) | Live §4 spacing scale | `baseline_rhythm_check.py token_starter.md` exits 0 |
| Acceptance (fail) | One planted one-off value, unmarked | exits non-zero, names the offending token + value |
| Exception path | The planted value carrying the `exception` marker | exits 0 |
| Fluid handling | `clamp(48px, 8vw, 96px)` row | passes on fixed-px anchors; `vw` term exempt |
| Presence guards | No `--baseline` row / no spacing rows | non-zero (`baseline token missing` / `spacing rows missing`) |
| Reconciliation | Baseline base + values vs `numeric_design_laws.md` | manual diff: no contradiction with `spacing-scale` / `type-*` rows |
| Link resolution | `layout_responsive.md` §2 link | the relative path resolves to `token_starter.md` on disk |
| Evergreen lint | Two edits + validator | grep finds no spec/packet/phase IDs or `specs/` paths |
| Scope audit | Working tree | only the two additive edits and `baseline_rhythm_check.py` in the diff |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `token_starter.md` §4 Spacing Scale (row host + validator input) | Internal | Green | No place to anchor the baseline or to validate |
| `layout_responsive.md` §2 Spacing System (link host) | Internal | Green | Baseline token stays unlinked from layout rhythm |
| `design-foundations/scripts/contrast_check.py` (validator convention) | Internal | Green | Lose the stdlib/exit/`--json` pattern to mirror |
| `numeric_design_laws.md` `spacing-scale` / `type-*` rows (reconciliation) | Internal | Green | Cannot prove numeric consistency or name the enforcement drift |
| Python 3 stdlib (`re`) | External | Green | No deterministic validator possible |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the validator mis-fails the live scale, the baseline base contradicts the spacing/type laws, or the additive edits disturb an existing value.
- **Procedure**: revert the two additive insertions (the §4 row + rule line and the §2 link) and delete `baseline_rhythm_check.py`. All three are additive and referenced by nothing else, so removal restores the prior state exactly. No data or migration to unwind.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Row + link) ─┐
                      ├──> Phase 3 (Verify)
Phase 2 (Validator) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Row + link | None | Verify (needs the baseline row to validate and link) |
| Validator | Phase 1 baseline row (reads it), drafts in parallel | Verify |
| Verify | Row + link, Validator | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline row + responsive link (additive edits) | Low | 45 minutes |
| Validator (`baseline_rhythm_check.py` parse + classify + fluid handling) | Medium | 1.5-2 hours |
| Verification (pass/fail/exception/edge matrix + reconciliation + audits) | Low | 45 minutes |
| **Total** | | **~3-3.5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm the diff is the two additive edits plus the one new validator file — change set is the two craft edits + the new checker, plus the one scope-amended numeric-law row
- [x] Confirm no existing spacing value, prose rule, or section order changed in either craft doc — values byte-identical, no renumber
- [x] Confirm the baseline base and validated values were diffed against the `spacing-scale` / `type-*` laws before commit — diffed, no contradiction

### Rollback Procedure
1. Revert the additive insertions in `token_starter.md` (§4 row + rule line) and `layout_responsive.md` (§2 link)
2. `git rm` (or delete) `baseline_rhythm_check.py`
3. Confirm no other sk-design file references the validator (grep); no database, migration, or downstream consumer to reconcile

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: revert two edits + delete one file

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Baseline rhythm row shape + responsive link + baseline_rhythm_check.py classification + additive no-regression contract + numeric_design_laws.md reconciliation (consistency in scope; enforcement-status drift flagged, not edited)
-->
