# Tasks: DEPTH Framework Redesign

## Task 1: Write DEPTH Framework v0.200
- **Status:** ✅ Complete
- **File:** `knowledge base/system/Copywriter - Thinking - DEPTH Framework - v0.200.md`
- **Changes:** Removed rounds, RICCE. Added energy levels as canonical reference. Cognitive techniques made optional. Perspectives per-brief. 246 lines (was 371, 34% reduction).

## Task 2: Write Interactive Mode v0.500
- **Status:** ✅ Complete
- **File:** `knowledge base/system/Copywriter - System - Interactive Mode - v0.500.md`
- **Changes:** All `depth_rounds: 10` → `energy: standard`. All `depth_rounds: auto_scale_1_to_5` → `energy: quick`. RICCE removed. Cognitive techniques optional. References DEPTH v0.200. 489 lines (was 490).

## Task 3: Write System Prompt v0.900
- **Status:** ✅ Complete
- **File:** `knowledge base/system/Copywriter - System - Prompt - v0.900.md`
- **Changes:** Section 1 objective updated. Rules 4/6 updated to energy levels. Section 8.1 routing paths updated. Section 8.5 workflow function uses energy instead of rounds. Section 9 DEPTH Configuration table replaced with energy level table. Phase Distribution table rewritten without round numbers. Section 10 quick reference updated. All cross-references point to DEPTH Framework v0.200. 779 lines (was 773).

## Task 4: Cross-File Verification
- **Status:** ✅ Complete
- **Results:**
  - v0.200: 0 rounds, 0 RICCE, 0 depth_rounds — CLEAN
  - v0.500: 0 DEPTH rounds (2 "question rounds" = acceptable), 0 RICCE, 0 depth_rounds — CLEAN
  - v0.900: 0 rounds, 0 RICCE, 0 depth_rounds, 0 auto_scale — CLEAN
  - Energy level terminology consistent across all three files
  - DEPTH v0.200 referenced 8 times in v0.900, 2 times in v0.500
  - MEQT rubric canonical in System Prompt Section 6, summarized only in DEPTH v0.200
