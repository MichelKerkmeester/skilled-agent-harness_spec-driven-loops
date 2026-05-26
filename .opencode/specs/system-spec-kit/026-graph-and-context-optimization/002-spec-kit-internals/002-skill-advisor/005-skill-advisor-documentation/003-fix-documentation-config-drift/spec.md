---
title: "Feature Specification: system-skill-advisor doc + config drift fixes"
description: "Three small drift issues block clean operation of system-skill-advisor: a TS5103 build failure from an out-of-range ignoreDeprecations value, doc disagreement on the 8-vs-9 public tool count, and a stale 4-tool comment in opencode.json. Fix all three in one Level 1 packet."
trigger_phrases:
  - "skill-advisor build failure"
  - "ignoreDeprecations TS5103"
  - "skill-advisor doc drift"
  - "advisor tool count"
  - "opencode.json registration comment"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-skill-advisor-documentation/003-fix-documentation-config-drift"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffold Level 1 packet for skill-advisor drift fixes"
    next_safe_action: "Apply tsconfig fix, doc reconciliation, opencode.json update; rebuild and validate"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tsconfig.json"
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/skills/system-skill-advisor/ARCHITECTURE.md"
      - ".opencode/skills/system-skill-advisor/README.md"
      - "opencode.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: system-skill-advisor doc + config drift fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-16 |
| **Branch** | `main` (no feature branch — direct on main per project convention) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A maintenance pass on `system-skill-advisor` surfaced three drift issues that the package's own ARCHITECTURE.md already flags or implies: (1) `npm run build` fails immediately with `TS5103: Invalid value for '--ignoreDeprecations'` because `mcp_server/tsconfig.json` sets `"6.0"` while installed TS is 5.9.3 (only `"5.0"` is valid); (2) SKILL.md and ARCHITECTURE.md disagree on whether the server exposes 8 or 9 public tools; (3) the root `opencode.json` registration comment still says "four tools" — flagged stale in ARCHITECTURE.md §6 but never fixed.

### Purpose
Restore a clean `npm run build` and align the three doc/config surfaces with the tool-ids-reference, which is the authoritative count today.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix `ignoreDeprecations` value in `mcp_server/tsconfig.json`
- Reconcile tool-count phrasing in `SKILL.md` and `ARCHITECTURE.md`
- Update `opencode.json` `mk_skill_advisor` registration comment
- Update `INSTALL_GUIDE.md` only if it carries the same 4-tool phrasing
- Run `npm run build`, `npm run typecheck`, and `validate.sh --strict` to confirm

### Out of Scope
- Moving `lib/skill-graph/` — that is packet 011, not this one
- Embeddings symlink work — owned by 040 follow-on
- Regression-fixture reconciliation — already on the future-work list
- Lane-weight changes — requires measured evidence per ADR

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/tsconfig.json` | Modify | `"ignoreDeprecations": "6.0"` → `"5.0"` |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modify | Anchor §3 phrasing aligns with "8 public + 1 internal" |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Modify | §1 + §6 acknowledge 9 total (8 public + 1 internal); drop "stale opencode.json" disclaimer once §3 below lands |
| `opencode.json` | Modify | Update `mk_skill_advisor` registration comment to reflect current tool surface |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Conditional | Only if it carries the same drift phrasing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build` exits 0 | Captured exit code in implementation-summary.md verification table |
| REQ-002 | `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` exits 0 | Captured exit code in implementation-summary.md verification table |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | SKILL.md and ARCHITECTURE.md agree on "8 public + 1 internal trusted-caller" tool framing | Visual diff confirms consistent phrasing in SKILL.md §3 and ARCHITECTURE.md §1, §6 |
| REQ-004 | `opencode.json` `mk_skill_advisor` registration comment reflects current surface | Comment names the live tool families or count, not "four tools" |
| REQ-005 | ARCHITECTURE.md §6 no longer flags the stale comment | The disclaimer paragraph is updated or removed once REQ-004 lands |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exits 0 or 1 (warnings only, no errors)
- **SC-002**: `npm run build` succeeds in `mcp_server/` without TS5103
- **SC-003**: Re-reading SKILL.md, ARCHITECTURE.md, README.md, INSTALL_GUIDE.md and `opencode.json` shows one consistent tool count narrative across all surfaces
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dropping `ignoreDeprecations` entirely would re-surface TS5101 baseUrl warning (per system-code-graph v1.0.3.0 changelog) | Low | Use `"5.0"` rather than removing — preserves original intent and is the only valid value on TS 5.x |
| Risk | `opencode.json` comment edit accidentally touches a real JSON field | Low | Edit is comment-text only; verify the JSON parses by re-running any consumer or `node -e "JSON.parse(require('fs').readFileSync('opencode.json','utf8'))"` if comment is JSONC-style |
| Dependency | TS version 5.9.3 in `system-spec-kit/node_modules` | Green | No upgrade needed; `"5.0"` is the right value for this TS line |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — root causes confirmed and fixes are mechanical.
<!-- /ANCHOR:questions -->
