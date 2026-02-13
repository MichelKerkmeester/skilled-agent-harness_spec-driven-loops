# Tasks: Copywriter AI System Audit

## Completed Tasks

### T1: System Exploration ✅
- **Status:** Complete
- **Output:** Full directory tree and content inventory of all 18 files
- **Evidence:** All files read, sizes measured, structure mapped

### T2: Cross-File Analysis ✅
- **Status:** Complete
- **Output:** 13 bugs/misalignments identified across 6 severity categories
- **Evidence:** Each finding cites specific files and conflicting values

### T3: Sequential Thinking Deep Analysis ✅
- **Status:** Complete
- **Output:** 15-step sequential analysis covering authority conflicts, token math, scoring integrity, state machines, cognitive load, and root cause pattern
- **Evidence:** Each thought builds on prior findings with specific calculations

### T4: Spec Folder Documentation ✅
- **Status:** Complete
- **Output:** spec.md, plan.md, tasks.md, decision-record.md, checklist.md

## Recommended Future Tasks (Remediation)

### T5: Processing Flow Consolidation 🔲
- **Priority:** P0 (Critical)
- **Scope:** Merge 3 competing processing flows into 1 canonical flow
- **Files Affected:** AGENTS.md, System Prompt v0.822, Interactive Mode v0.414
- **Estimated Effort:** Medium (requires architectural decision on which flow wins)

### T6: Token Budget Resolution 🔲
- **Priority:** P0 (Critical)
- **Scope:** Either increase ALWAYS-load ceiling from 130KB to 170KB, or reduce loaded files
- **Files Affected:** Token Budget v0.100, potentially all system files
- **Estimated Effort:** Low (budget doc change) to High (if files need trimming)

### T7: DEPTH Round Standardization 🔲
- **Priority:** P0 (Critical)
- **Scope:** Define standard/quick/deep round counts in ONE place, remove from others
- **Files Affected:** DEPTH Framework v0.114, System Prompt v0.822, Token Budget v0.100
- **Estimated Effort:** Low

### T8: MEQT + HVR Scoring Unification 🔲
- **Priority:** P1 (High)
- **Scope:** Single penalty calculation, wider scoring range, resolve floor vs zero-out conflict
- **Files Affected:** System Prompt v0.822, HVR Extensions v0.102, Human Voice v0.101
- **Estimated Effort:** Medium

### T9: Cognitive Load Reduction 🔲
- **Priority:** P1 (High)
- **Scope:** Reduce 200+ rules to ≤30 core + reference appendix
- **Files Affected:** All knowledge base files
- **Estimated Effort:** High (requires careful prioritization of which rules are essential)

### T10: State Machine Completion 🔲
- **Priority:** P2 (Medium)
- **Scope:** Add exit command, default state, error handling, revision loop definition
- **Files Affected:** Interactive Mode v0.414
- **Estimated Effort:** Low

### T11: Market Data Versioning 🔲
- **Priority:** P2 (Medium)
- **Scope:** Add timestamps, expiry dates, and refresh protocol to all hardcoded stats
- **Files Affected:** Market Extensions v0.102
- **Estimated Effort:** Low
