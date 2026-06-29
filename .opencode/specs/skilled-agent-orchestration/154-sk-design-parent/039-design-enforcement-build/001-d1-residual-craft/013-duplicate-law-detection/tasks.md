---
title: "Tasks: Duplicate Law Detection"
description: "Ordered implementer items to extend numeric_law_check.py with an additive within-index duplicate-detection pass (normalize value/range, group rows, fail on a duplicate re-port), preserve the existing completeness gate, and verify clean-pass, duplicate-bite, no-regression, no-false-positive, evergreen, and scope-lock."
trigger_phrases:
  - "duplicate law detection tasks"
  - "duplicate law detection design build"
  - "numeric_law_check duplicate detection"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/013-duplicate-law-detection"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all tasks complete with evidence; keep canonical phase headers"
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
# Tasks: Duplicate Law Detection

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Duplicate pass]

- [x] T001 Re-read the existing checker to confirm the extension point: `check()` already returns `rows/errors/missing/incomplete/ok`, and `_find_law_rows` is the single parser to reuse (`.opencode/skills/sk-design/shared/scripts/numeric_law_check.py`) [10m] — extension point confirmed; the pass consumes the already-parsed `rows`
- [x] T002 Add `_find_duplicates(rows)`: normalize each row's `value/range` with `_clean_cell` + lowercase + whitespace-collapse, group rows by the normalized string, return each group of size >= 2 as `{value, law_ids[], owners[]}` (`numeric_law_check.py`) [25m] — shipped with `_normalized_value`; placeholder values skipped
- [x] T003 Call `_find_duplicates` from `check()`, add `duplicates` to the result dict, and fold it into `ok` (`ok = not errors and not missing and not incomplete and not duplicates`) (`numeric_law_check.py`) [15m] — `duplicates` returned and folded into the verdict

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Output + exit, preserve completeness]

- [x] T004 Human output: print one `FAIL` line per duplicate group naming the shared value and the duplicate `law_id`s; augment the PASS line so it asserts rows are populated AND unique (`numeric_law_check.py`) [15m] — `duplicate law value "<value>" shared by ...`; PASS reads "populated and unique"
- [x] T005 [P] `--json` output: add a `duplicates` array beside `incomplete`, same call signature and `--json` flag (`numeric_law_check.py`) [10m] — `duplicates` in the JSON payload
- [x] T006 Confirm the exit contract is preserved: exit 0 only when populated AND duplicate-free; exit 1 on incomplete OR duplicate; exit 2 on usage/read error (`numeric_law_check.py`) [10m] — verified 0/1/1/2
- [x] T007 `py_compile` the modified script to confirm it stays stdlib-only and parse-clean (`numeric_law_check.py`) [5m] — `python3 -m py_compile` OK; imports `json`/`re`/`pathlib`/`sys`/`typing`

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Acceptance
- [x] T008 Run `numeric_law_check.py numeric_design_laws.md` on the clean live index; confirm exit 0 (completeness unchanged, no duplicates among the seeded rows) [10m] — exit 0, 12 rows
- [x] T009 Duplicate-bite test: on a scratch copy, add a second row re-porting an existing `value/range` under a new `law_id`; confirm exit 1 and that the message names both `law_id`s + the shared value (owner index untouched) [15m] — exit 1 `duplicate law value "4.5:1 wcag aa body text" shared by contrast-body-aa, contrast-large-ui-aa`

### No-regression
- [x] T010 Completeness no-regression: on a scratch copy, blank one required cell; confirm the gate still exits 1 on the incomplete cell (the duplicate pass did not displace completeness) [10m] — exit 1 `contrast-body-aa: blank caveat`
- [x] T011 Presence: point the checker at a table with no data rows; confirm non-zero (`rows missing`) [5m] — presence guard fires before the duplicate scan

### No-false-positive
- [x] T012 Confirm the register motion-budget row (`150-250ms ... Product`, owner `interface`) is never grouped with any motion band; the clean index stays exit 0 [10m] — distinct normalized value; not grouped; clean index exit 0

### Audits
- [x] T013 Evergreen audit: grep the modified script for spec/packet/phase IDs and `specs/` paths; confirm none present [5m] — grep returns no hits
- [x] T014 Scope-lock audit: confirm the only modified file is `numeric_law_check.py`; the index and all other sk-design files are unchanged [5m] — `git status` shows one modified path; `numeric_design_laws.md`/`baseline_rhythm_check.py`/`contrast_check.py` untouched

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Clean live index exits 0; a two-same-value scratch index exits 1 naming the dupes
- [x] Completeness still bites a blanked cell; the register-vs-motion drift row never false-positives
- [x] Additive only — `numeric_law_check.py` is the single modified file
- [x] Evergreen + scope-lock audits pass
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Surface it extends**: `.opencode/skills/sk-design/shared/scripts/numeric_law_check.py` (the docs-benchmark completeness gate)
- **Index it reads**: `.opencode/skills/sk-design/shared/numeric_design_laws.md` (the canonical law registry)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates, explicit verification + duplicate-bite + no-regression + no-false-positive tasks)
-->
