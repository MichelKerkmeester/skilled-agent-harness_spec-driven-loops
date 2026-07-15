---
title: "Feature Specification: DB Location Skill-Local (fix #1) [system-code-graph/031-code-graph-buildout/011-source-bug-and-misalignment-audit/004-db-location-skill-local/feature-specification]"
description: "Relocate the code-graph SQLite DB out of workspace-root .opencode/.spec-kit/code-graph/database back to the skill folder mcp_server/database (operator fix #1). Reverses ADR-002/004/005; every runtime already shares the skill via the .opencode/skills symlink."
trigger_phrases:
  - "code graph db location skill-local"
  - "fix 1 spec-kit relocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/011-source-bug-and-misalignment-audit/004-db-location-skill-local"
    last_updated_at: "2026-05-29T09:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Relocated DB to skill-local; .spec-kit removed; committed 69e7bf12"
    next_safe_action: "None; fix #1 complete and verified green"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: DB Location Skill-Local (fix #1)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete (live on main, commit 69e7bf12) |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The code-graph SQLite DB + sidecars + lease + readiness marker were created at the workspace-root `.opencode/.spec-kit/code-graph/database/`. The operator wants them inside the skill folder. The prior consolidation (ADR-002/004/005) justified `.spec-kit` by cross-runtime sharing, but that rationale was wrong: every runtime symlinks `.opencode/skills` to one physical dir, so a skill-local DB is equally shared.

### Purpose
Move the code-graph DB to `.opencode/skills/system-code-graph/mcp_server/database/` and ensure `.opencode/.spec-kit` is no longer used.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `core/config.ts` `DATABASE_DIR` default + `readiness-marker.ts` base dir → skill-local.
- Launcher `.cjs`: `dbDir` → skill-local; migration reversed (`.spec-kit` → skill-local); `legacyLeasePaths()` now probes `.spec-kit`.
- `opencode.json` `_NOTE_1_DB`, `.gitignore` (ignore skill-local DB artifacts), `socket-server.ts` comment.
- Docs: 9 path-string swaps + `database_path_policy.md` §1/§2/§3 rewrite (CG-014/CG-038) + ADR-002/004/005 reversal note; `launcher-lease.vitest.ts` legacy-path test.
- Migrate existing DB to skill-local; remove `.opencode/.spec-kit`.

### Out of Scope
- CG-013 cwd-divergence (sharing the canonical resolver in readiness-marker) — deferred; importing config at module load breaks fs-mock tests.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | DB resolves skill-local | `DATABASE_DIR` = `.../mcp_server/database`; verified |
| REQ-002 | `.spec-kit` gone | `.opencode/.spec-kit` removed; gitignored |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No regressions | typecheck PASS; full vitest 577 passed / 0 failed |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: code-graph DB lives skill-local; `.spec-kit` not recreated.
- **SC-002**: suite green; committed to main (69e7bf12).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Skill re-sync could clobber live DB in skill folder | Med | `.gitignore` + launcher migration-back treat DB as regenerable runtime state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
