---
title: "Implementation Plan: DB Location Skill-Local (fix #1) [system-code-graph/031-code-graph-buildout/011-source-bug-and-misalignment-audit/004-db-location-skill-local/implementation-plan]"
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
# Implementation Plan: DB Location Skill-Local

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
Relocate the code-graph DB default from `.opencode/.spec-kit/code-graph/database` to skill-local `mcp_server/database`, reverse the launcher migration, update config/docs/gitignore, migrate the existing DB, and remove `.spec-kit`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- `npm run typecheck` clean; full vitest green; `DATABASE_DIR` resolves skill-local.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Single canonical resolver (`core/config.ts` `DATABASE_DIR`) + launcher `dbDir` both point skill-local; the `.opencode/skills` symlink makes it shared across runtimes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Code: config.ts, readiness-marker.ts, launcher.cjs, opencode.json, .gitignore, socket-server comment, launcher-lease test.
2. Docs: path swaps + database_path_policy rewrite.
3. Migrate DB + remove `.spec-kit`; rebuild dist; verify; commit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Run DB-path-adjacent tests (launcher-lease, ipc, canonical-db-dir, readiness-marker, status) + full suite; confirm green.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
None blocking; reverses ADR-002/004/005.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Revert commit 69e7bf12 to restore the `.spec-kit` default.
<!-- /ANCHOR:rollback -->
