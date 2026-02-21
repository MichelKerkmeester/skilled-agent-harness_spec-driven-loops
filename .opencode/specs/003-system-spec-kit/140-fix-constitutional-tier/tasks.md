# Tasks: Fix Constitutional Tier Misclassification

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Diagnose

- [x] T001 Identify misclassified memory count via SQL COUNT on `constitutional` tier
- [x] T002 Trace root cause to `extractImportanceTier()` regex matching HTML comment block
- [x] T003 Confirm which rows require re-tiering (SESSION SUMMARY entries, 595 rows)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Fix

- [x] T004 Add `content.replace(/<!--[\s\S]*?-->/g, '')` before tier regex in `memory-parser.ts` (line 443-467)
- [x] T005 Apply equivalent fix to compiled `memory-parser.js` in dist
- [x] T006 Execute SQL UPDATE: set `importance_tier = 'normal'` for 595 SESSION SUMMARY rows where tier was `constitutional`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Write unit tests: HTML comment content ignored
- [x] T008 Write unit tests: real YAML `importance_tier` values correctly extracted
- [x] T009 Write unit tests: `[CONSTITUTIONAL]` marker in comment ignored, in content detected
- [x] T010 Write unit test: real template pattern (exact bug scenario) returns correct tier
- [x] T011 [P] Run all 6 unit tests — confirm pass
- [x] T012 [P] Verify database tier distribution via SQL COUNT queries
- [x] T013 [P] Confirm 3071 embeddings remain in success state
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
