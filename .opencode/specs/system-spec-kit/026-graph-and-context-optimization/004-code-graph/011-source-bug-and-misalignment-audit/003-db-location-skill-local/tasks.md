---
title: "Tasks: DB Location Skill-Local (fix #1) [system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/003-db-location-skill-local/tasks]"
description: "Relocate the code-graph SQLite DB out of workspace-root .opencode/.spec-kit/code-graph/database back to the skill folder mcp_server/database (operator fix #1). Reverses ADR-002/004/005; every runtime already shares the skill via the .opencode/skills symlink."
trigger_phrases:
  - "code graph db location skill-local"
  - "fix 1 spec-kit relocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/003-db-location-skill-local"
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
# Tasks: DB Location Skill-Local

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` done.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] Map all references to the old `.spec-kit/code-graph` path.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] Code + launcher + config + docs + gitignore → skill-local.
- [x] Migrate existing DB to skill-local; remove `.opencode/.spec-kit`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] typecheck PASS; full vitest 577 passed / 0 failed; DATABASE_DIR skill-local.
- [x] Committed to main (69e7bf12).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] `.opencode/.spec-kit` no longer used; DB skill-local; suite green.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- Findings: `../review-report.md` (CG-013/CG-014/CG-038)
- Commit: 69e7bf12
<!-- /ANCHOR:cross-refs -->
