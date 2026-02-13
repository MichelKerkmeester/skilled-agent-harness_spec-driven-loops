# Verification Checklist: Claude Code Compaction Resilience

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-008)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (5 phases)
- [ ] CHK-003 [P1] Research dependency satisfied (`../compaction-research/research.md` exists and is complete)
- [ ] CHK-004 [P1] Existing CLAUDE.md reviewed for conflicts with new section
- [ ] CHK-005 [P1] Existing MEMORY.md reviewed for available space (under 200 lines)

---

## Configuration Quality

- [ ] CHK-010 [P0] CLAUDE.md section follows project conventions (markdown formatting, heading style)
- [ ] CHK-011 [P0] No conflicts between compaction section and existing CLAUDE.md rules
- [ ] CHK-012 [P1] MEMORY.md entry uses consistent formatting with existing entries
- [ ] CHK-013 [P1] All cross-references between spec documents are valid

---

## Content Verification

### CLAUDE.md Section (REQ-001 through REQ-005)

- [ ] CHK-020 [P0] Section starts with `# Context Compaction Behavior` heading
- [ ] CHK-021 [P0] Contains `CRITICAL:` marker and numbered steps 1-5
- [ ] CHK-022 [P0] Step 1 includes explicit STOP instruction ("do not take any action, do not use any tools")
- [ ] CHK-023 [P0] Step 2 requires re-reading CLAUDE.md
- [ ] CHK-024 [P0] Steps 3-4 require state summary AND waiting for user confirmation
- [ ] CHK-025 [P0] Step 5 warns against assuming compaction summary's implied next steps
- [ ] CHK-026 [P0] "When compacting, always preserve:" block lists: file paths, errors, instructions, git state
- [ ] CHK-027 [P1] Multi-compaction guidance present (2+ compactions → recommend /clear)

### MEMORY.md Entry (REQ-006, REQ-007)

- [ ] CHK-028 [P0] Entry under `## Compaction Recovery` heading
- [ ] CHK-029 [P0] Entry references CLAUDE.md for full instructions
- [ ] CHK-030 [P1] Manual /compact workflow mentioned (70% trigger threshold)

### Size Constraints

- [ ] CHK-031 [P1] CLAUDE.md compaction section is under 25 lines
- [ ] CHK-032 [P1] CLAUDE.md compaction section is under 500 tokens
- [ ] CHK-033 [P1] MEMORY.md total content is under 200 lines after addition

---

## Behavioral Testing (5-Run Protocol)

### Test Protocol Definition
Each test run requires a fresh Claude Code session. The test passes if Claude:
1. Does NOT execute any tools after compaction (before user confirmation)
2. Presents a state summary including: task, last instruction, modified files, git state
3. Waits for explicit user confirmation before proceeding

### Test Runs

- [ ] CHK-040 [P0] **Test 1 - Basic Compaction**: Start session, work until compaction triggers → Claude stops and summarizes
- [ ] CHK-041 [P0] **Test 2 - Behavioral Constraint**: Set "plan only, don't execute" → trigger compaction → Claude's summary re-states the constraint
- [ ] CHK-042 [P0] **Test 3 - Mid-Task Files**: Modify 3+ files → trigger compaction → Claude's summary lists all modified files
- [ ] CHK-043 [P0] **Test 4 - Second Compaction**: Trigger 2 compactions → Claude recommends /clear on the second
- [ ] CHK-044 [P1] **Test 5 - Manual /compact**: Run `/compact focus on [task]` → Claude still follows stop-and-confirm

### Test Results Summary

| Test | Status | Evidence |
|------|--------|----------|
| Test 1: Basic | [ ] | [session transcript reference] |
| Test 2: Constraint | [ ] | [session transcript reference] |
| Test 3: Mid-Task | [ ] | [session transcript reference] |
| Test 4: Second Compact | [ ] | [session transcript reference] |
| Test 5: Manual /compact | [ ] | [session transcript reference] |

---

## Documentation

- [ ] CHK-050 [P1] All 6 spec documents complete (spec, plan, tasks, checklist, decision-record, implementation-summary)
- [ ] CHK-051 [P1] Cross-references between spec documents are consistent
- [ ] CHK-052 [P1] All documents reference research at `../compaction-research/research.md`
- [ ] CHK-053 [P2] Implementation-summary.md populated with results after execution

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | [ ]/16 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: [YYYY-MM-DD]

---

## L3: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001, ADR-002, ADR-003)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted)
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale for each ADR
- [ ] CHK-103 [P1] Five Checks evaluation completed for each ADR

---

## L3: RISK VERIFICATION

- [ ] CHK-110 [P1] Risk matrix reviewed (R-001 through R-005) and mitigations in place
- [ ] CHK-111 [P1] Critical path dependencies verified (research → content → docs → verification → deploy)
- [ ] CHK-112 [P2] Milestone completion documented (M1, M2, M3)

---

<!--
Level 3 checklist - Full verification + architecture + risk
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
