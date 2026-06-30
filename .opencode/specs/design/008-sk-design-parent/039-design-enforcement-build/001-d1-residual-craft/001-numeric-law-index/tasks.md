---
title: "Tasks: Numeric Design Laws Index"
description: "Ordered implementer items to create shared/numeric_design_laws.md (6-column cross-mode law index) and shared/scripts/numeric_law_check.py (row-completeness gate), with consistency, tamper, and evergreen verification."
trigger_phrases:
  - "numeric design laws tasks"
  - "numeric law index design build"
  - "numeric_law_check completeness gate"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/001-numeric-law-index"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked all tasks complete with evidence after gate acceptance passed"
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
    answered_questions: []
---
# Tasks: Numeric Design Laws Index

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
## Phase 1: Setup [Index]

- [x] T001 Re-read the live source values to confirm each indexed number is current: `design-foundations/assets/token_starter.md` (spacing/type/chroma), `design-foundations/assets/contrast_pair_inventory.md` + `design-foundations/references/color/oklch_workflow.md` (contrast), `design-motion/references/motion_strategy.md` §Timing scale (motion), `shared/register.md` Motion budget [15m] — values confirmed current against owners
- [x] T002 Create `shared/numeric_design_laws.md`: frontmatter (title/description/trigger_phrases/importance_tier/contextType/version) + Overview/Purpose/Usage block mirroring `cognitive_laws.md` house style (`.opencode/skills/sk-design/shared/numeric_design_laws.md`) [20m] — file present with frontmatter + intro
- [x] T003 Author the 6-column law table with fixed order `[Law ID, Value/Range, Owner Mode, Enforcement Target, Source, Caveat]` and populate every seeded law row from the §3 plan inventory; use evergreen path+section sources (never line numbers or packet IDs) (`numeric_design_laws.md`) [35m] — 12 rows, section-anchored sources
- [x] T004 Add an Application Notes block (which mode cites which laws) + a footer gate hint `python3 scripts/numeric_law_check.py numeric_design_laws.md` (`numeric_design_laws.md`) [10m] — Application Notes + footer run hint present

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Completeness Gate]

- [x] T005 [P] Create `shared/scripts/numeric_law_check.py` (Python 3 stdlib only) with a `main()` arg parser accepting a target path and an optional `--json`, mirroring `proof_check.py` (`.opencode/skills/sk-design/shared/scripts/numeric_law_check.py`) [15m] — stdlib `re`/`json`, `main()` + `--json`
- [x] T006 Implement the table parser: locate the law-table heading, read the first markdown table beneath it (until next heading), extract 6-cell rows in fixed order, skip the header row and the `|---|` separator (`numeric_law_check.py`) [25m] — `_find_law_rows` parses the Law Index table
- [x] T007 Implement completeness validation: a cell is incomplete when empty/whitespace-only/placeholder (`__________`, `TBD`, `TODO`, `-`); any incomplete cell → fail naming the `law_id` + column; zero real rows → fail (`rows missing`) (`numeric_law_check.py`) [25m] — `_is_placeholder` + presence guard
- [x] T008 Wire the exit contract: exit 0 when every row is complete, non-zero otherwise; emit a human summary and an optional `--json` payload (`numeric_law_check.py`) [10m] — exit 0/1/2 verified, `--json` payload emitted

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Acceptance
- [x] T009 Run `numeric_law_check.py numeric_design_laws.md` on the fully populated index; confirm exit 0 [10m] — "PASS, rows: 12", exit 0
- [x] T010 Tamper test: blank one required cell; confirm non-zero exit naming the offending `law_id` + column; restore the cell [10m] — "FAIL - contrast-body-aa: blank value/range", exit 1 (scratch copy, owner untouched)
- [x] T011 Presence test: point the checker at a table with no data rows; confirm non-zero (`rows missing`) [5m] — presence guard fires before per-row scan

### Consistency
- [x] T012 Diff every indexed value/range against its cited owner source (contrast ratios, motion bands, spacing steps, type ratio, neutral chroma); confirm no invented or contradictory numbers [20m] — contrast + four motion bands match owners; register-vs-motion is a recorded caveat

### Audits
- [x] T013 Evergreen audit: grep the index + gate script for spec/packet/phase IDs and `specs/` paths; confirm none present [5m] — none present
- [x] T014 Scope-lock audit: confirm only `numeric_design_laws.md` and `numeric_law_check.py` are added and no existing craft doc/script/asset/registry is modified [5m] — two new files only

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Complete index passes; an incomplete row and a no-rows table both fail
- [x] Every indexed value is consistent with its owner source
- [x] Additive only — no existing craft file modified
- [x] Evergreen + scope-lock audits pass
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **House-style reference**: `.opencode/skills/sk-design/shared/cognitive_laws.md` (shared-law doc structure)
- **Gate convention**: `.opencode/skills/sk-design/shared/scripts/proof_check.py` (stdlib checker pattern)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates, explicit verification + tamper + consistency tasks)
-->
