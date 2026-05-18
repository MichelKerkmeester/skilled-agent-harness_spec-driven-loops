---
title: "Tasks: system-skill-advisor doc + config drift fixes"
description: "T001-T010 ordered by Setup → Implementation → Verification. T### [P?] Description (file path)."
trigger_phrases:
  - "skill-advisor drift fix tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/003-doc-and-config-drift-fixes"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Tasks authored"
    next_safe_action: "Begin Phase 2: T004 tsconfig edit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "025-tasks"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: system-skill-advisor doc + config drift fixes

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm installed TypeScript version is 5.9.3 (`.opencode/skills/system-spec-kit/node_modules/typescript/package.json`)
- [x] T002 Reproduce TS5103 build failure (`mcp_server/tsconfig.build.json` extends tsconfig.json line 4)
- [x] T003 Confirm only `system-skill-advisor` sets `ignoreDeprecations` across all skill tsconfigs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Edit `mcp_server/tsconfig.json` line 4: `"ignoreDeprecations": "6.0"` → `"5.0"`
- [ ] T005 Locate and read `opencode.json` `mk_skill_advisor` block; update registration comment to reflect 8 public + 1 internal tools (or current accurate phrasing)
- [ ] T006 [P] Update `SKILL.md` §3 + surrounding anchors so tool listing matches tool-ids-reference.md ("8 public + 1 internal trusted-caller")
- [ ] T007 [P] Update `ARCHITECTURE.md` §1 ("eight public tools" → mention 9 total with internal note) and §6 (drop or update the "stale opencode.json note" disclaimer once T005 lands)
- [ ] T008 [P] Scan README.md / INSTALL_GUIDE.md for matching 4-tool drift; fix if present
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build` — expect exit 0
- [ ] T010 Run `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` — expect exit 0
- [ ] T011 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/003-doc-and-config-drift-fixes --strict` — expect 0 or 1
- [ ] T012 Update implementation-summary.md Files Changed table + Verification table with actual results
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] T009 + T010 + T011 all green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
