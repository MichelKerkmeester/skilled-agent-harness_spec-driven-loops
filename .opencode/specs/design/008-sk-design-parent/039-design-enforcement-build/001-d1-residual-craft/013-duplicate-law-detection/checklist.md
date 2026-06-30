---
title: "Verification Checklist: Duplicate Law Detection"
description: "Verification items for the additive within-index duplicate-detection pass in numeric_law_check.py: clean-pass, duplicate-bite naming the dupes, completeness no-regression, no-false-positive on the register-vs-motion drift row, evergreen, and scope-lock acceptance, all marked with evidence after the gate verified exit 0/1/1/2."
trigger_phrases:
  - "duplicate law detection checklist"
  - "duplicate law detection design build"
  - "numeric_law_check duplicate detection"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/013-duplicate-law-detection"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all checklist items verified; recompute counts; set verification date"
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
# Verification Checklist: Duplicate Law Detection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Extension point confirmed: `numeric_law_check.py` exists, `check()` already returns `rows/errors/missing/incomplete/ok`, and `_find_law_rows` is the single parser to reuse
  - **Evidence**: the duplicate pass consumes the already-parsed `rows`; no second parser and no new file read introduced
- [x] CHK-002 [P0] Scope frozen to one existing file; no law row added/moved and no other sk-design file edited
  - **Evidence**: `git status --porcelain` shows exactly one 013-relevant modified path: `numeric_law_check.py`; `numeric_design_laws.md` untouched

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Duplicate key is the full normalized `value/range` string (`_clean_cell` + lowercase + whitespace-collapse), never a single extracted numeral
  - **Evidence**: `_normalized_value` collapses the full cell; grouping is full-string equality, so `4.5:1 WCAG AA body text` collides only with an identical restatement
- [x] CHK-011 [P0] `duplicates` is folded into `ok`: `ok = not errors and not missing and not incomplete and not duplicates`
  - **Evidence**: the duplicate scratch sets `ok=False` and exit 1 with every cell populated
- [x] CHK-012 [P1] Each duplicate group reports the shared value plus the member `law_id`s and owners
  - **Evidence**: human `FAIL` line reads `duplicate law value "4.5:1 wcag aa body text" shared by contrast-body-aa, contrast-large-ui-aa (owners: foundations, foundations)`; `--json` carries the matching `duplicates` entry
- [x] CHK-013 [P1] Script stays stdlib-only and parse-clean
  - **Evidence**: `python3 -m py_compile scripts/numeric_law_check.py` OK; imports only `json`/`re`/`pathlib`/`sys`/`typing`

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE (pass): `numeric_law_check.py numeric_design_laws.md` exits 0 on the clean live index
  - **Evidence**: exit 0, 12 rows, populated and unique — completeness unchanged AND no duplicate among the seeded rows
- [x] CHK-021 [P0] ACCEPTANCE (duplicate): a scratch index with a second row re-porting an existing `value/range` exits non-zero
  - **Evidence**: exit 1 naming both `law_id`s and the shared value; the live index untouched (scratch copy only)
- [x] CHK-022 [P0] NO-REGRESSION (completeness): a scratch index with one required cell blanked still exits non-zero on the incomplete cell
  - **Evidence**: exit 1 `contrast-body-aa: blank caveat`; the completeness bite still fires
- [x] CHK-023 [P0] NO-FALSE-POSITIVE: the register motion-budget row (`150-250ms ... Product`, owner `interface`) is never grouped with a motion band
  - **Evidence**: distinct normalized value; the clean index stays exit 0, so the register-vs-motion drift caveat is not read as a duplicate
- [x] CHK-024 [P1] PRESENCE: a table with no data rows still exits non-zero (`rows missing`)
  - **Evidence**: the presence guard fires before the duplicate scan

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`
  - **Evidence**: algorithmic — this phase adds one deterministic duplicate-grouping rule to one existing gate and produces no code-defect findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven
  - **Evidence**: the only docs-benchmark surface over the index is `numeric_law_check.py`; no sibling checker re-implements completeness, so the rule lands in exactly one place
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, schema fields, response fields, docs, and tests
  - **Evidence**: the new `duplicates` result field is consumed only by the script's own exit logic and `--json` payload; no external caller reads `check()`'s dict
- [x] CHK-FIX-004 [P0] Parser/matching fixes include adversarial table tests for delimiter, joined-input, no-op, and fallback cases
  - **Evidence**: adversarial matrix executed — exact-duplicate value, near-but-distinct value (no false positive), blanked cell, and a clean no-op all behaved deterministically
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed
  - **Evidence**: matrix is 5 scenarios (clean-pass / duplicate-bite / completeness-no-regression / no-false-positive / no-rows) over the seeded index plus scratch copies
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when code reads process-wide state
  - **Evidence**: not applicable; the pass reads only the parsed `rows` and the target file text, no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to the delivered file, not a moving branch-relative range
  - **Evidence**: evidence pins to `_find_duplicates` and the `ok`/exit fold in `numeric_law_check.py` and the Law Index table in `numeric_design_laws.md`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Integrity: the pass is read-only over the index — it adds a failure reason, never edits, reorders, or de-dupes any row
  - **Evidence**: the checker only reports duplicates; removing a re-ported row stays a human edit
- [x] CHK-031 [P1] No false trust signal: a duplicate failure is reported as enforceable (a real registry collision), while broad cross-doc restatement scanning is honestly left advisory and out of scope
  - **Evidence**: spec and implementation-summary state the gate asserts only that the index registers each value once, never that every prose mention was eliminated

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or `specs/` paths embedded in the modified script
  - **Evidence**: an evergreen grep over `numeric_law_check.py` returns no `specs/` paths and no packet-phase IDs
- [x] CHK-041 [P1] spec/plan/tasks/checklist synchronized on the within-index duplicate mechanism and the deterministic clean-pass / duplicate-bite acceptance
  - **Evidence**: all four docs name `numeric_law_check.py` as the target, the normalized `value/range` duplicate key, and the same clean→0 / duplicate→1 contract

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only `numeric_law_check.py` is modified; no existing sk-design doc/asset/registry and no new file is added
  - **Evidence**: `git status --porcelain` lists `numeric_law_check.py` as the single 013-relevant modified path under `.opencode/skills/sk-design/`; the index and sibling gates untouched
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad
  - **Evidence**: the duplicate-bite and blanked-cell fixtures lived only in a `mktemp` scratch dir and were removed; the working tree carries only the one modified script

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: orchestrator + markdown-agent — verified independently without pipe-masking against the delivered `numeric_law_check.py`: clean live index `numeric_design_laws.md` → exit 0 (12 rows, populated and unique); a scratch with two rows sharing `4.5:1 wcag aa body text` → exit 1 naming both `law_id`s + the shared value; a scratch with a blanked required cell → exit 1 `contrast-body-aa: blank caveat` (completeness preserved); usage → exit 2; `py_compile` OK; evergreen grep clean; scope clean (`numeric_design_laws.md`/`baseline_rhythm_check.py`/`contrast_check.py` untouched).

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
