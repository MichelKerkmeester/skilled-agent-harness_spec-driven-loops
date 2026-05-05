---
title: "Verification Checklist: Phase 3 — Remove mcp-figma skill"
description: "Phase 3 gates: 14 file edits applied, skill folder deleted, advisor tests green, branch hygiene, hooks E/F/G."
trigger_phrases:
  - "phase 3 checklist"
  - "mcp-figma removal checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/067-mcp-figma-transfer/003-mcp-figma-skill-removal"
    last_updated_at: "2026-05-05T10:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "Author decision-record.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:phase3-checklist-2026-05-05"
      session_id: "067-003-checklist-2026-05-05"
      parent_session_id: null
    completion_pct: 18
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 3 — Remove mcp-figma skill

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

## Verification Protocol

| Priority | Handling |
|----------|----------|
| **[P0]** | HARD BLOCKER |
| **[P1]** | Required OR documented user approval |
| **[P2]** | Optional |

---

## Pre-Implementation

- [ ] CHK-001 [P0] Phase 1 + Phase 2 commits verified (690b498, c4f6c56, e96a3ee)
- [ ] CHK-002 [P0] D1 + D2 + D6 + D8 captured in decision-record.md
- [ ] CHK-003 [P0] Re-grep at execution start completed; mapping drift documented

## File Edits — Advisor Scoring Tables (P0)

- [ ] CHK-010 [P0] `graph-metadata.json`: edge entry deleted (line 18); count patched (line 62)
- [ ] CHK-011 [P0] `skill-graph.json`: skill_count patched (4); 5 mcp-figma nodes deleted (17, 97, 101-108, 186, 250-255)
- [ ] CHK-012 [P0] `scorer/lanes/explicit.ts`: 4 DELETE_LINE applied (17, 23, 27, 137)
- [ ] CHK-013 [P0] `scorer/lanes/lexical.ts`: 1 DELETE_LINE applied (32)

## File Edits — Test Fixtures (P0)

- [ ] CHK-020 [P0] `routing-fixtures.affordance.test.ts`: 5 DELETE_NODE applied (33, 49, 54-56)

## File Edits — skill_advisor.py (P0)

- [ ] CHK-030 [P0] `skill_advisor.py` line 1396: DELETE_LINE
- [ ] CHK-031 [P0] `skill_advisor.py` line 1444: PATCH (remove mcp-figma tuple from "export" array)
- [ ] CHK-032 [P0] `skill_advisor.py` line 1613: PATCH (remove mcp-figma tuple from "figma css" array)
- [ ] CHK-033 [P0] `skill_advisor.py` line 1937: PATCH (remove "use figma" string)
- [ ] CHK-034 [P0] `skill_advisor.py` line 1938: PATCH (remove "figma" token)

## File Edits — Documentation (P0)

- [ ] CHK-040 [P0] `smart-router-measurement-report.md` line 26: DELETE_LINE
- [ ] CHK-041 [P0] root `README.md`: 4 edits applied (DELETE subsection 825-829, DELETE line 1173, PATCH 642 + 1187)
- [ ] CHK-042 [P0] `.opencode/skill/README.md`: 6 edits applied (PATCH counts at 54+58, DELETE 4 rows at 161, 204, 258 + entry in line 58)

## File Edits — mcp-code-mode (D1 strip pattern, P0)

- [ ] CHK-050 [P0] `mcp-code-mode/SKILL.md` line 476: DELETE_LINE
- [ ] CHK-051 [P0] `mcp-code-mode/README.md` line 451: DELETE_LINE
- [ ] CHK-052 [P0] `mcp-code-mode/references/architecture.md` line 514: DELETE_LINE
- [ ] CHK-053 [P0] `mcp-code-mode/manual_testing_playbook/06--third-party-via-cm/001-figma-file-metadata.md` line 88: DELETE_LINE
- [ ] CHK-054 [P0] D1 KEEP set verified: `figma-developer-mcp\|figma\.figma_\|figma_FIGMA_API_KEY` returns ≥120 hits in mcp-code-mode/

## Skill Folder Deletion (P0)

- [ ] CHK-060 [P0] `rm -rf .opencode/skill/mcp-figma/` executed
- [ ] CHK-061 [P0] `test ! -d .opencode/skill/mcp-figma/` returns true (folder gone)
- [ ] CHK-062 [P0] No z_archive marker, no .bak, no commented-out code (memory rule: physical delete)

## Commit 4 (P0)

- [ ] CHK-070 [P0] `git status` reviewed before staging
- [ ] CHK-071 [P0] Staged set: 14 modified files + skill folder deletion ONLY (NOT pre-existing dirty tree)
- [ ] CHK-072 [P0] Commit message: `chore: remove mcp-figma skill and patch cross-references` + Co-Authored-By
- [ ] CHK-073 [P0] Commit SHA captured

## Skill Advisor Regen (P0)

- [ ] CHK-080 [P0] `Skill: doctor:skill-advisor :auto` invoked
- [ ] CHK-081 [P0] Regen output: zero `mcp-figma` refs in skill-graph.json
- [ ] CHK-082 [P0] Regen completed without errors

## Advisor Tests (P0)

- [ ] CHK-090 [P0] Advisor test runner located + executed
- [ ] CHK-091 [P0] All advisor tests pass (exit 0)
- [ ] CHK-092 [P0] No `mcp-figma` fixtures remaining in test files

## Commit 5 (P0)

- [ ] CHK-100 [P0] `git diff` reviewed: only advisor regen output
- [ ] CHK-101 [P0] Commit message: `chore: regenerate skill advisor graph` + Co-Authored-By
- [ ] CHK-102 [P0] Commit SHA captured

## Branch Hygiene (P1)

- [ ] CHK-110 [P0] `git branch --show-current` returns `main`
- [ ] CHK-111 [P1] No leftover feature branches from earlier session
- [ ] CHK-112 [P1] Pre-existing 7 modified + 6 untracked files surviving (carry-over preserved)

## Opus Verification — Hook E (re-grep cleanliness, P0)

- [ ] CHK-120 [P0] Hook E dispatched
- [ ] CHK-121 [P0] Zero `mcp-figma` skill-name hits outside specs/z_archive/z_future
- [ ] CHK-122 [P0] ≥120 `figma-developer-mcp\|figma\.figma_\|figma_FIGMA_API_KEY` refs in mcp-code-mode/ (D1 KEEP preserved)

## Opus Verification — Hook F (advisor test suite, P0)

- [ ] CHK-130 [P0] Hook F dispatched
- [ ] CHK-131 [P0] Test runner exits 0
- [ ] CHK-132 [P0] skill-graph.json clean (zero mcp-figma)

## Opus Verification — Hook G (branch hygiene, P0)

- [ ] CHK-140 [P0] Hook G dispatched
- [ ] CHK-141 [P0] On `main` branch
- [ ] CHK-142 [P0] Unrelated dirty tree files surviving

## Phase Handoff (P0)

- [ ] CHK-150 [P0] Phase 3 implementation-summary.md authored
- [ ] CHK-151 [P0] Final synthesis handoff: parent-level summary ready (Phase 3 → final closing)
