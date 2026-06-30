---
title: "Feature Specification: Duplicate Law Detection"
description: "The numeric-law completeness gate registered each adopted law's presence but never its uniqueness, so a second row could re-port an already-adopted value under a new law_id and drift between duplicates. This adds an additive within-index duplicate pass to numeric_law_check.py that fails when two rows share a normalized value/range, while a cross-doc prose scanner stays advisory."
trigger_phrases:
  - "d1-r13 duplicate law detection"
  - "duplicate law detection design build"
  - "numeric_law_check duplicate detection"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/013-duplicate-law-detection"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2; record within-index-enforceable vs cross-doc-advisory split"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/numeric_law_check.py"
      - ".opencode/skills/sk-design/shared/numeric_design_laws.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Within-index duplicate-row detection on the canonical registry is the deterministic, evergreen reduction of 'reference the owner, not a copy'; a cross-doc prose scanner stays advisory and out of scope"
      - "The duplicate key is the full normalized value/range string, never a single extracted numeral, so an identical restatement is the only thing that can collide"
---
# Feature Specification: Duplicate Law Detection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Completed** | 2026-06-29 |
| **Branch** | `013-duplicate-law-detection` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The numeric-law index gives each already-adopted numeric law (timing, color/contrast, layout/spacing, type) exactly one canonical row so modes cite the owner instead of re-copying the value. The completeness gate (`numeric_law_check.py`) graded presence and population but never uniqueness: nothing stopped a second row from re-porting an already-adopted law under a new `law_id`. That is the exact drift the dimension names, where timing/color/layout/type defaults diverge between duplicate restatements.

### Purpose
Keep the "exactly one row" promise honest with an additive within-index duplicate-detection pass inside the existing completeness gate. The pass normalizes each row's `value/range` cell, groups rows by that normalized full string, and fails when any value is registered by two or more rows, naming the shared value and the duplicate `law_id`s. Completeness still runs first and still bites a blank cell; the duplicate pass only ever adds a failure reason. The gate proves the canonical registry never registers the same numeric law twice; it states honestly that scanning arbitrary mode docs for restated numbers stays advisory and out of scope.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An additive `_find_duplicates(rows)` pass in `shared/scripts/numeric_law_check.py` that normalizes each row's `value/range` (`_clean_cell` + lowercase + whitespace-collapse), groups rows by the normalized full string, and returns each group of size >= 2 as `{value, law_ids, owners}`.
- Folding `duplicates` into the verdict (`ok = not errors and not missing and not incomplete and not duplicates`) and into the exit code, plus a `duplicates` array in the `--json` payload and one human `FAIL` line per group.

### Out of Scope
- Any change to `numeric_design_laws.md` (the index stays read-only), the sibling gates (`baseline_rhythm_check.py`, `contrast_check.py`), or any other mode doc, script, or asset.
- A scanner that walks arbitrary mode docs for restated numbers; it would need a non-evergreen hardcoded doc list and would false-positive on legitimate references, so cross-doc restatement detection stays advisory.
- Near-duplicate or fuzzy matching; the key is exact normalized-string equality, never a single extracted numeral.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/shared/scripts/numeric_law_check.py` | Modify | Add `_find_duplicates(rows)` + `_normalized_value`, fold `duplicates` into `ok` and the exit code, and wire the `duplicates` field into the human and `--json` output; completeness unchanged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The duplicate key is the full normalized `value/range` string, never a single extracted numeral | Grouping is full-string equality after `_clean_cell` + lowercase + whitespace-collapse; `4.5:1 WCAG AA body text` collides only with an identical restatement |
| REQ-002 | `duplicates` is folded into the verdict and the exit code | A duplicate group sets `ok=False` and exit 1 even when every required cell is fully populated |
| REQ-003 | Completeness is preserved and runs first | A blanked required cell still exits 1 on the incomplete cell; the duplicate pass only adds a failure reason, never removes one |
| REQ-004 | The gate grades the full matrix deterministically | Clean populated unique index → 0, two rows sharing one normalized value → 1, a blanked required cell → 1, no data rows → 1, usage / unreadable file → 2 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Each duplicate group names the shared value plus the member `law_id`s and owners | The human `FAIL` line and the `--json` `duplicates` entry both name the shared value and the duplicate `law_id`s |
| REQ-006 | Additive, evergreen, and scope-clean | The change set is exactly `numeric_law_check.py`; no spec/packet/phase IDs or `specs/` paths in it; the index and the sibling gates are untouched; the script stays stdlib-only and `py_compile`-clean |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `numeric_law_check.py numeric_design_laws.md` exits 0 on the clean 12-row index (populated and unique), and the register motion-budget row is not falsely grouped with any motion band.
- **SC-002**: A scratch index with two rows sharing one normalized `value/range` exits 1 naming the shared value and both `law_id`s; a scratch index with one required cell blanked still exits 1 on the incomplete cell; usage exits 2. Verified independently without pipe-masking.
- **SC-003**: The change set is `numeric_law_check.py` only, evergreen and scope-clean (the index and sibling gates untouched), and the gate names the within-index-enforceable vs cross-doc-advisory boundary.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The within-index duplicate rule is mechanically enforceable, but a cross-doc prose restatement is not | Med | State the split: the pass proves the canonical registry registers each value once (enforceable); a scanner over arbitrary mode docs stays advisory and out of scope because it would need a non-evergreen hardcoded doc list and false-positive on legitimate references. The gate certifies no cross-doc prose elimination |
| Risk | A naive numeral key would false-positive on coincidental numbers | Med | The key is the full normalized `value/range` string, never a single extracted numeral, so an identical restatement is the only thing that can collide; verified that the register-vs-motion drift row (distinct value, distinct owner) is never grouped |
| Risk | The new pass could displace the existing completeness bite | Med | Completeness runs first and still bites on its own; `duplicates` only folds an additional reason into `ok`; a blanked-cell scratch still exits 1 on the incomplete cell |
| Dependency | `numeric_law_check.py` (existing completeness gate) | Internal | The pass is a pure function over the already-parsed `rows`; no new parser, file read, or dependency |
| Dependency | Python 3 stdlib (`re`, `json`) | External | No normalization or `--json` payload possible without it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The duplicate pass reuses the existing parse and the file's own `_clean_cell` normalization, so a new law row inherits the same uniqueness rule without a checker rewrite.

### Reliability
- **NFR-R01**: The normalization and grouping are deterministic: the same index returns the same exit code and the same `FAIL` lines on every run.

### Integrity
- **NFR-I01**: The pass is read-only over the index. It adds a failure reason and never edits, reorders, or de-dupes a row; it carries no false trust signal that it eliminated every cross-doc prose mention of an owned value.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- The 12 seeded rows carry pairwise-distinct `value/range` strings, so the clean index produces zero duplicate groups and exits 0.
- A placeholder or blank `value/range` cell is skipped by the duplicate pass (it is already an incomplete-cell failure); the duplicate pass groups only populated values.

### Error Scenarios
- Two rows sharing one normalized value fail naming the shared value and both `law_id`s (`duplicate law value "<value>" shared by <a>, <b>`).
- A blanked required cell still fails on the incomplete cell; a table with no data rows fails (`rows missing`); a no-argument call or an unreadable file exits 2 with no false pass.

### State Transitions
- Completeness, then uniqueness: the gate grades populated cells first and only then groups for duplicates. A populated-but-duplicated index is still a failure; a complete, unique index is the only exit-0 state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One additive pure function plus a verdict/exit/output fold in one existing file |
| Risk | 6/25 | Additive and reversible (revert the hunk); a duplicate key could over-group, mitigated by the full-string key and the matrix tests |
| Research | 5/20 | Re-reading the existing parser, the `_clean_cell` / `_normalized_header` convention, and the 12 live rows for false-positive safety |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Where does the within-index-duplicate-enforceable vs cross-doc-restatement-advisory split land? The within-index rule is mechanically enforceable: the normalized-string grouping is deterministic, so a duplicate re-port on the canonical registry is loud and blocking. A scanner that walks arbitrary mode docs for restated numbers stays advisory and out of scope because it would need a non-evergreen hardcoded doc list and would false-positive on legitimate references and on numerals that merely coincide. The gate makes the registry uniqueness bite; it never certifies that no mode prose paraphrases an owned value. Resolved as the enforcement ceiling, recorded so a later phase can pick up a cross-doc advisory deliberately rather than as silent scope drift.
- Should the duplicate pass eventually catch near-duplicates (the same law phrased with a different value string)? Today the key is exact normalized-string equality, never a single extracted numeral, which is what keeps the pass false-positive-safe. Fuzzy or semantic matching would reintroduce false positives and is intentionally deferred; the deterministic exact-restatement guard is the in-scope core.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
