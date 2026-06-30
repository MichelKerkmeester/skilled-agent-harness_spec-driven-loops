---
title: "Implementation Plan: Numeric Design Laws Index"
description: "Plan to add a shared sk-design/shared/numeric_design_laws.md index of cross-mode numeric laws (law_id, value/range, owner mode, enforcement target, source, caveat) plus a deterministic completeness gate that fails on any incomplete row."
trigger_phrases:
  - "numeric design laws plan"
  - "numeric law index design build"
  - "cross-mode numeric laws shared index"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/001-numeric-law-index"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked plan phases complete after the index and gate passed acceptance"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/numeric_design_laws.md"
      - ".opencode/skills/sk-design/shared/scripts/numeric_law_check.py"
      - ".opencode/skills/sk-design/shared/cognitive_laws.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Standalone shared reference vs on-demand asset card resolved to a standalone shared reference"
---
# Implementation Plan: Numeric Design Laws Index

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference + Python 3 stdlib (`re`) for the completeness gate |
| **Primary target** | `sk-design/shared/numeric_design_laws.md` (NEW, additive) |
| **Gate target** | `sk-design/shared/scripts/numeric_law_check.py` (NEW, additive — the docs-benchmark seed) |
| **Source craft values** | foundations `token_starter.md` + `contrast_pair_inventory.md` + `oklch_workflow.md`; motion `motion_strategy.md`; `shared/register.md` |
| **Verification** | `numeric_law_check.py` exits 0 on a complete index, non-zero when any row leaves a required column blank |

### Overview
The shared base is conceptual today: numeric design laws (contrast ratios, motion timing bands, spacing steps, type-scale ratios, neutral chroma) are restated per mode with no canonical home, so drift and duplication are invisible. This build adds one shared index — `sk-design/shared/numeric_design_laws.md` — that gives every recurring numeric law a single row with its **value/range, owner mode, enforcement target, source, and caveat**, and a deterministic gate that fails when any row is incomplete.

The index is **additive and reference-only**: it points at the owner docs that already hold each value, it does not copy or move logic out of them, and it touches no existing craft doc. The companion guard against re-copying owned laws into mode-local docs is a separate sibling (duplicate-detection), not this phase.

Scope is frozen to the two NEW files. No existing mode doc, script, or asset is edited.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec target confirmed: `sk-design/shared/numeric_design_laws.md` does not exist yet (clean additive create)
- [x] Required columns fixed by spec §4: `law_id, value/range, owner mode, enforcement target, source, caveat`
- [x] Real source values located across foundations/motion/interface (see §3 candidate inventory)
- [x] Acceptance is deterministic (exit 0 vs non-zero on an incomplete row)
- [x] Open decision resolved by the spec: standalone shared reference, not an on-demand asset card

### Definition of Done
- [x] `numeric_design_laws.md` exists with the 6-column table and every seeded law row fully populated — 12 rows, gate reports "rows: 12"
- [x] Each indexed value is consistent with its cited owner source (no invented numbers) — contrast + four motion bands diffed against owner docs
- [x] `numeric_law_check.py` passes on the complete index and fails on a blanked required cell — exit 0 populated, exit 1 on blanked cell
- [x] Additive only: no existing craft doc, script, or asset modified — change set is the two new files only
- [x] Evergreen: no spec/packet/phase IDs or spec paths in the index or the gate script — grep over both files finds none

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Index shape (`numeric_design_laws.md`)
A single shared reference whose core is one markdown table with a fixed 6-column order. Every recurring cross-mode numeric law gets exactly one row; the row points at the owner that holds the value rather than restating the law's logic.

```markdown
| Law ID | Value / Range | Owner Mode | Enforcement Target | Source | Caveat |
|---|---|---|---|---|---|
| NL-001-contrast-body | 4.5:1 (WCAG AA body) | foundations | design-foundations/scripts/contrast_check.py | design-foundations/assets/contrast_pair_inventory.md | APCA recorded alongside, not replacing; product may set a stricter bar |
```

| Column | Meaning | Gate action |
|---|---|---|
| `Law ID` | Stable descriptive slug for the law (e.g. `NL-004-motion-feedback`) | Must be non-empty, non-placeholder |
| `Value / Range` | The numeric value or range itself | Must be non-empty, non-placeholder |
| `Owner Mode` | The single mode that owns the canonical value (`foundations` / `interface` / `motion` / `audit`) | Must be non-empty, non-placeholder |
| `Enforcement Target` | The script or doc that enforces it; `advisory (no script)` when none exists | Must be non-empty, non-placeholder |
| `Source` | Owner file path + section/anchor name where the value lives (evergreen path, not a line number) | Must be non-empty, non-placeholder |
| `Caveat` | The one condition or drift note that keeps the value honest | Must be non-empty, non-placeholder |

### Candidate law inventory (seed rows, grounded in live values)
The implementer populates the index from these real values; finalize owner/enforcement against the live files at build time.

| Law ID | Value / Range | Owner | Enforcement Target | Source anchor |
|---|---|---|---|---|
| NL-001-contrast-body | 4.5:1 WCAG AA body | foundations | `contrast_check.py` | `design-foundations/assets/contrast_pair_inventory.md` / `shared/context_loading_contract.md` contrast gate |
| NL-002-contrast-large-ui | 3:1 large text / non-text UI / focus ring | foundations | `contrast_check.py` | `contrast_pair_inventory.md` / `design-interface/assets/interface_preflight_card.md` |
| NL-003-contrast-apca | APCA `|Lc| >= 60` normal text | foundations | `contrast_check.py` (APCA Lc) | `design-foundations/references/color/oklch_workflow.md` |
| NL-004-motion-feedback | 100-150 ms press/hover/tap feedback (≈<80 ms reads instant) | motion | advisory (no script) | `design-motion/references/motion_strategy.md` §Timing scale |
| NL-005-motion-state | 200-300 ms toggle/dropdown/tab change | motion | advisory (no script) | `motion_strategy.md` §Timing scale |
| NL-006-motion-layout | 300-500 ms modal/drawer/accordion/layout | motion | advisory (no script) | `motion_strategy.md` §Timing scale |
| NL-007-motion-hero | 500-800 ms one earned entrance | motion | advisory (no script) | `motion_strategy.md` §Timing scale |
| NL-008-motion-laggy | feedback >300 ms feels laggy; exit ≈75% of entrance | motion | advisory (no script) | `motion_strategy.md` §Timing scale |
| NL-009-motion-budget | 150-250 ms register motion budget | interface | advisory (no script) | `shared/register.md` Motion budget (defers to motion bands as owner — drift caveat) |
| NL-010-space-base | 4px base step (4/8/12/16/24/32/48 scale) | foundations | advisory (no script) | `design-foundations/assets/token_starter.md` §SPACING SCALE |
| NL-011-space-section | `clamp(48px, 8vw, 96px)`; 48px section-gap floor | foundations | advisory (no script) | `token_starter.md` §SPACING SCALE |
| NL-012-type-scale | modular ratio 1.2 (Product) / 1.25-1.333 (Brand); body ≈16px | foundations | advisory (no script) | `token_starter.md` §TYPE SCALE |
| NL-013-neutral-chroma | neutral tint `C 0.005-0.015` toward brand hue | foundations | advisory (no script) | `token_starter.md` §COLOR RAMP |

> Honest ceiling: the index proves each law's value/owner/source *exists and is cited consistently*; it cannot prove the value was *applied well* in any live build. Most rows are advisory because only contrast has a calculator (`contrast_check.py`); the index makes that absence explicit in the Enforcement Target column rather than implying enforcement that does not exist.

### `numeric_law_check.py` algorithm (the docs-benchmark seed)
There is no shared docs benchmark today; this phase introduces the first one as a small stdlib checker mirroring the existing `shared/scripts/proof_check.py` convention. A later sibling (duplicate-detection) extends this same surface.

1. **Parse** the index: locate the heading for the law table, then the first markdown table beneath it (until the next heading). Read data rows of 6 cells in fixed order `[Law ID, Value/Range, Owner Mode, Enforcement Target, Source, Caveat]`. Skip the header row and the `|---|` separator.
2. **Completeness:** a cell is *incomplete* when it is empty, whitespace-only, or a placeholder (`__________`, `TBD`, `TODO`, `-`). Any incomplete cell in any row → FAIL with the offending `law_id` + column.
3. **Presence:** zero real rows → FAIL (`numeric-law rows missing`).
4. **Exit contract:** exit 0 when every row has all six columns populated; non-zero otherwise. JSON output optional via `--json`, mirroring `proof_check.py`.

### Additive / no-regression contract
- Both files are NEW; no existing craft doc, script, asset, or registry is touched.
- The gate reads only the index file; it adds no dependency to any existing checker.
- Reverting the two files removes the feature byte-for-byte with nothing else to unwind.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Index
- [x] Create `shared/numeric_design_laws.md` with frontmatter, purpose, the 6-column table, and an Application Notes block (mirroring `cognitive_laws.md` house style) — file present with Law Index + Application Notes
- [x] Populate the seed law rows from the live source values (§3 inventory); use evergreen path+section sources, never line numbers or packet IDs — 12 rows, section-anchored sources

### Phase 2: Completeness gate
- [x] Create `shared/scripts/numeric_law_check.py` (stdlib only) that parses the law table and fails on any incomplete required cell — stdlib `re`/`json`, `py_compile` clean
- [x] Add the gate-invocation hint to the index footer (`python3 scripts/numeric_law_check.py numeric_design_laws.md`) — footer carries the run hint

### Phase 3: Verification
- [x] Complete index → checker exits 0 — verified, "PASS, rows: 12"
- [x] Tamper test: blank one required cell → checker exits non-zero naming the law_id + column — verified, "FAIL - contrast-body-aa: blank value/range", exit 1
- [x] Consistency check: every indexed value matches its cited owner source (manual diff against the live files) — contrast + four motion bands match owners
- [x] Evergreen + scope audit: grep both new files for IDs/paths; confirm only the two new files exist in the change set — clean, two new files only

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Acceptance (pass) | Fully populated index | `numeric_law_check.py numeric_design_laws.md` exits 0 |
| Acceptance (incomplete) | One required cell blanked | exits non-zero, names the offending `law_id` + column |
| Presence | Table with no data rows | exits non-zero (`rows missing`) |
| Consistency | Each row vs its owner source | manual diff: value/range equals the live owner value |
| Evergreen lint | Index + gate script | grep finds no spec/packet/phase IDs or `specs/` paths |
| Scope audit | Working tree | only `numeric_design_laws.md` + `numeric_law_check.py` added |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `design-foundations/scripts/contrast_check.py` (contrast enforcement target) | Internal | Green | Contrast rows lose their concrete enforcement reference |
| `design-motion/references/motion_strategy.md` §Timing scale (motion source) | Internal | Green | Motion rows have no canonical value source |
| `design-foundations/assets/token_starter.md` (spacing/type/chroma source) | Internal | Green | Spacing/type rows have no canonical value source |
| `shared/register.md` Motion budget (register summary) | Internal | Green | NL-009 drift caveat cannot be anchored |
| Python 3 stdlib (`re`) | External | Green | No completeness gate possible |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the gate mis-fails a complete index, or the index introduces a value that contradicts its owner source.
- **Procedure**: delete the two new files (`numeric_design_laws.md`, `numeric_law_check.py`). Both are additive and referenced by nothing else, so removal restores the prior state exactly. No data or migration to unwind.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Index) ─┐
                 ├──> Phase 3 (Verify)
Phase 2 (Gate) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Index | None | Verify (needs a populated table to grade) |
| Gate | None (can be drafted in parallel) | Verify |
| Verify | Index, Gate | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Index (table + seed rows from live values) | Medium | 1-1.5 hours |
| Gate (`numeric_law_check.py` parse + completeness) | Medium | 1-1.5 hours |
| Verification (pass/incomplete/consistency + audits) | Low | 45 minutes |
| **Total** | | **~3-3.75 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm only the two new files are staged — change set is `numeric_design_laws.md` + `numeric_law_check.py`
- [x] Confirm no existing craft doc, script, asset, or registry is in the diff — no existing sk-design file modified
- [x] Confirm each indexed value was diffed against its live owner source before commit — contrast + four motion bands diffed

### Rollback Procedure
1. `git rm` (or delete) `numeric_design_laws.md` and `numeric_law_check.py`
2. Confirm no other sk-design file references them (grep)
3. No database, migration, or downstream consumer to reconcile (markdown + stdlib only)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: File deletion only

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Index shape + candidate law inventory + numeric_law_check.py completeness algorithm + additive no-regression contract
-->
