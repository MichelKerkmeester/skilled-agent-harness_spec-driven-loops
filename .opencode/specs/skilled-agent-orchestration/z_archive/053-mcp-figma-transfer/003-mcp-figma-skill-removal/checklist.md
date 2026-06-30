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
    packet_pointer: "skilled-agent-orchestration/z_archive/053-mcp-figma-transfer/003-mcp-figma-skill-removal"
    last_updated_at: "2026-05-05T12:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "P0 checklist evidence backfilled"
    next_safe_action: "Run strict validator"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:e67a4cf06c95d2298aace8a3e59e3a3fd017e126f97b5f1b69181ecf642fb878"
      session_id: "067-003-checklist-2026-05-05"
      parent_session_id: null
    completion_pct: 18
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase 3 — Remove mcp-figma skill

<!-- ANCHOR:protocol -->
## Verification Protocol

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

Template compliance scaffold for 003-mcp-figma-skill-removal/checklist.md; original authored content is retained below.
<!-- /ANCHOR:sign-off -->

### Original Authored Content

<!-- SPECKIT_LEVEL: 3 -->
---

### Verification Protocol

| Priority | Handling |
|----------|----------|
| **[P0]** | HARD BLOCKER |
| **[P1]** | Required OR documented user approval |
| **[P2]** | Optional |

---

### Pre-Implementation

- [x] CHK-001 [P0] Phase 1 + Phase 2 commits verified (690b498, c4f6c56, e96a3ee) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-002 [P0] D1 + D2 + D6 + D8 captured in decision-record.md — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-003 [P0] Re-grep at execution start completed; mapping drift documented — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### File Edits — Advisor Scoring Tables (P0)

- [x] CHK-010 [P0] `graph-metadata.json`: edge entry deleted (line 18); count patched (line 62) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-011 [P0] `skill-graph.json`: skill_count patched (4); 5 mcp-figma nodes deleted (17, 97, 101-108, 186, 250-255) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-012 [P0] `scorer/lanes/explicit.ts`: 4 DELETE_LINE applied (17, 23, 27, 137) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-013 [P0] `scorer/lanes/lexical.ts`: 1 DELETE_LINE applied (32) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### File Edits — Test Fixtures (P0)

- [x] CHK-020 [P0] `routing-fixtures.affordance.test.ts`: 5 DELETE_NODE applied (33, 49, 54-56) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### File Edits — skill_advisor.py (P0)

- [x] CHK-030 [P0] `skill_advisor.py` line 1396: DELETE_LINE — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-031 [P0] `skill_advisor.py` line 1444: PATCH (remove mcp-figma tuple from "export" array) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-032 [P0] `skill_advisor.py` line 1613: PATCH (remove mcp-figma tuple from "figma css" array) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-033 [P0] `skill_advisor.py` line 1937: PATCH (remove "use figma" string) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-034 [P0] `skill_advisor.py` line 1938: PATCH (remove "figma" token) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### File Edits — Documentation (P0)

- [x] CHK-040 [P0] `smart-router-measurement-report.md` line 26: DELETE_LINE — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-041 [P0] root `README.md`: 4 edits applied (DELETE subsection 825-829, DELETE line 1173, PATCH 642 + 1187) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-042 [P0] `.opencode/skills/README.md`: 6 edits applied (PATCH counts at 54+58, DELETE 4 rows at 161, 204, 258 + entry in line 58) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### File Edits — mcp-code-mode (D1 strip pattern, P0)

- [x] CHK-050 [P0] `mcp-code-mode/SKILL.md` line 476: DELETE_LINE — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-051 [P0] `mcp-code-mode/README.md` line 451: DELETE_LINE — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-052 [P0] `mcp-code-mode/references/architecture.md` line 514: DELETE_LINE — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-053 [P0] `mcp-code-mode/manual_testing_playbook/06--third-party-via-cm/001-figma-file-metadata.md` line 88: DELETE_LINE — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-054 [P0] D1 KEEP set verified: `figma-developer-mcp\|figma\.figma_\|figma_FIGMA_API_KEY` returns ≥120 hits in mcp-code-mode/ — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### Skill Folder Deletion (P0)

- [x] CHK-060 [P0] `rm -rf .opencode/skills/mcp-figma/` executed — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-061 [P0] `test ! -d .opencode/skills/mcp-figma/` returns true (folder gone) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-062 [P0] No z_archive marker, no .bak, no commented-out code (memory rule: physical delete) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### Commit 4 (P0)

- [x] CHK-070 [P0] `git status` reviewed before staging — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-071 [P0] Staged set: 14 modified files + skill folder deletion ONLY (NOT pre-existing dirty tree) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-072 [P0] Commit message: `chore: remove mcp-figma skill and patch cross-references` + Co-Authored-By — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-073 [P0] Commit SHA captured — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### Skill Advisor Regen (P0)

- [x] CHK-080 [P0] `Skill: doctor:skill-advisor :auto` invoked — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-081 [P0] Regen output: zero `mcp-figma` refs in skill-graph.json — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-082 [P0] Regen completed without errors — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### Advisor Tests (P0)

- [x] CHK-090 [P0] Advisor test runner located + executed — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-091 [P0] All advisor tests pass (exit 0) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-092 [P0] No `mcp-figma` fixtures remaining in test files — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### Commit 5 (P0)

- [x] CHK-100 [P0] `git diff` reviewed: only advisor regen output — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-101 [P0] Commit message: `chore: regenerate skill advisor graph` + Co-Authored-By — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-102 [P0] Commit SHA captured — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### Branch Hygiene (P1)

- [x] CHK-110 [P0] `git branch --show-current` returns `main` — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [ ] CHK-111 [P1] No leftover feature branches from earlier session
- [ ] CHK-112 [P1] Pre-existing 7 modified + 6 untracked files surviving (carry-over preserved)

### Opus Verification — Hook E (re-grep cleanliness, P0)

- [x] CHK-120 [P0] Hook E dispatched — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-121 [P0] Zero `mcp-figma` skill-name hits outside specs/z_archive/z_future — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-122 [P0] ≥120 `figma-developer-mcp\|figma\.figma_\|figma_FIGMA_API_KEY` refs in mcp-code-mode/ (D1 KEEP preserved) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### Opus Verification — Hook F (advisor test suite, P0)

- [x] CHK-130 [P0] Hook F dispatched — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-131 [P0] Test runner exits 0 — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-132 [P0] skill-graph.json clean (zero mcp-figma) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### Opus Verification — Hook G (branch hygiene, P0)

- [x] CHK-140 [P0] Hook G dispatched — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-141 [P0] On `main` branch — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-142 [P0] Unrelated dirty tree files surviving — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section

### Phase Handoff (P0)

- [x] CHK-150 [P0] Phase 3 implementation-summary.md authored — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
- [x] CHK-151 [P0] Final synthesis handoff: parent-level summary ready (Phase 3 → final closing) — EVIDENCE: commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d; Opus Hooks E+F+G PASS; implementation-summary.md verification section
