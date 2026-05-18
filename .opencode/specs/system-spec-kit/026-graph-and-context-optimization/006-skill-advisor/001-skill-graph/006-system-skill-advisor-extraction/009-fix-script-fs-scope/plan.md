---
title: "Implementation Plan: Fix advisor-script filesystem-scope resolution bugs"
description: "Three-phase Level 2 plan for proving, fixing, and verifying two advisor-script path bugs."
trigger_phrases:
  - "013/009/009 plan"
  - "fix script fs scope plan"
  - "advisor script path resolution"
importance_tier: "critical"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/009-fix-script-fs-scope"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Production fixes verified"
    next_safe_action: "013/009 line ready for close-out"
    blockers: []
    completion_pct: 100
---
# Implementation Plan: Fix advisor-script filesystem-scope resolution bugs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python scripts, Node/Vitest advisor package |
| **Package** | `.opencode/skills/system-skill-advisor/mcp_server/` |
| **Testing** | Python smoke tests, package Vitest, strict spec validation |
| **Risk Profile** | Low LOC, broad reach scripts |

### Overview

This plan treats the bugs as filesystem-depth corrections. Phase 1 proves the current bad resolutions and records the package test baseline. Phase 2 applies two surgical edits. Phase 3 reruns the path smoke, Vitest, strict validation, JSON parse checks, and a note-only grep for similar deep `..` chains.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 answered as Option B for new packet `013/009/009`.
- [x] Parent handover Tier 1 context reviewed.
- [x] Sibling 008 structure and metadata reviewed.
- [x] Level 2 template examples reviewed.
- [x] Script lines read before editing.

### Definition of Done

- [x] Both production path fixes applied as one-line changes.
- [x] Python smoke tests prove corrected paths.
- [x] Vitest pass count is at least baseline `279/287`.
- [x] Strict validation passes at packet 009, parent 013/009, and grandparent 013.
- [x] Checklist and implementation summary record evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Path Ownership

| Script | Before | Target |
|--------|--------|--------|
| `skill_graph_compiler.py` | `SCRIPT_DIR/../../../..` -> `.opencode/` | `SCRIPT_DIR/../../..` -> `.opencode/skills/` |
| `skill_advisor.py` | `scripts/../../database/skill-graph.sqlite` -> skill-root database | `scripts/../database/skill-graph.sqlite` -> `mcp_server/database/skill-graph.sqlite` |

### Non-Architecture Decision

No new helper, abstraction, variable rename, or scoring logic is introduced. The existing package topology already defines the correct owners: skill graph compiler scans `.opencode/skills/`, and advisor SQLite lives under `system-skill-advisor/mcp_server/database/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 (SETUP)

- Confirm bug reproduction from `mcp_server/scripts/`:
  - `python3 -c 'import sys; sys.path.insert(0, "."); from skill_graph_compiler import SKILLS_DIR; print(SKILLS_DIR)'`
  - Expected before-state: path ends in `/.opencode`.
- Confirm advisor DB before-state:
  - `python3 -c "import skill_advisor; print(skill_advisor.SKILL_GRAPH_SQLITE_PATH)"`
  - Expected before-state: path ends in `/system-skill-advisor/database/skill-graph.sqlite`.
- Capture baseline package Vitest count with `cd .opencode/skills/system-skill-advisor/mcp_server && npm test`.

### Phase 2 (IMPLEMENTATION)

- Replace the four-level `SKILLS_DIR` path in `skill_graph_compiler.py` with a three-level path.
- Replace the two-level DB path in `skill_advisor.py` with a one-level path.
- Re-run standalone Python path smoke tests to confirm corrected paths.

### Phase 3 (VERIFICATION)

- Run `cd .opencode/skills/system-skill-advisor/mcp_server && npm test`; final pass count must be `>=279/287`.
- Run strict validation at:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/009-fix-script-fs-scope`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction`
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/002-skill-advisor-semantic-lane`
- Parse `description.json` and `graph-metadata.json` with Node.
- Grep advisor scripts for any other `'..', '..', '..', '..'` chains as a note-only check. Do not fix unrelated chains in this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | Script path constants | `python3 -c` from `mcp_server/scripts/` |
| Regression | Advisor package tests | `npm test` |
| Documentation | Packet, parent, grandparent validation | `validate.sh --strict` |
| Metadata | JSON syntax | `node -e JSON.parse(...)` |
| Scope | Collateral script path chains | `rg` note-only grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing advisor package tests | Internal | Red baseline `279/287` | Completion relies on no regression, not full suite green. |
| System-spec-kit validator | Internal | Required | Completion claim requires strict validation evidence. |
| Parent 013/009 metadata | Internal | Existing dirty worktree | Validation must use actual current state and report anomalies. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two edit operations:

```bash
git checkout HEAD -- .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_graph_compiler.py .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py
```

After rollback, rerun both Python smoke tests and `npm test` to confirm behavior returns to the captured baseline.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Setup | Required reads | Phase 2 edits |
| Phase 2: Implementation | Baseline proofs | Phase 3 verification |
| Phase 3: Verification | Two production fixes | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Implementation | Low | 10 minutes |
| Verification | Medium | 30-45 minutes |
| Documentation | Medium | 30 minutes |
| **Total** | | **90-105 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Before paths captured.
- [x] Baseline Vitest count captured.
- [x] Edits limited to two script lines.

### Rollback Procedure

1. Revert the two production script files with the command above.
2. Keep this packet as the audit trail unless the operator explicitly removes it.
3. Re-run path smoke and package Vitest.
4. Update `implementation-summary.md` if rollback occurs.
<!-- /ANCHOR:enhanced-rollback -->
