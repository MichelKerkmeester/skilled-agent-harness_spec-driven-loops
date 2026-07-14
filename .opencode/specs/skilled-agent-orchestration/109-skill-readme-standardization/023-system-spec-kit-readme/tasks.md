---
title: "Tasks: system-spec-kit README"
description: "Task list for the system-spec-kit README depth-preserving narrative restyle."
trigger_phrases:
  - "system-spec-kit readme tasks"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/023-system-spec-kit-readme"
    last_updated_at: "2026-06-07T17:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All phase-023 tasks complete"
    next_safe_action: "Begin phase 024 (skills index README)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-023"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: system-spec-kit README

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Seed the deep-context packet and seat prompts (depth-inventory focus)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Iteration 1 seats: DeepSeek + MiMo inventory the full reference depth and section map
- [x] T003 [P] Iteration 2 seats: verify 37 tools against tool-schemas.ts, env vars, levels, stale facts
- [x] T004 Synthesize context-report.md; resolve the 37-tool count and the stale-fact list against source
- [x] T005 [P] Dual-draft the reframed top matter (DeepSeek base, MiMo cross-check)
- [x] T006 Splice the top, renumber sections, sweep HVR (26 double-hyphen, prose semicolons, Oxford-comma lists), drop the version footer, fix the changelog link, soften drift-prone counts; preserve the reference body
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `validate_document.py --type readme` passes (0 issues)
- [x] T008 HVR prose scan clean (em dash, double-hyphen, semicolon, Oxford-comma list); depth spot-check passes
- [x] T009 `validate.sh --strict` on the phase; all cited paths resolve
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] README validated, depth preserved
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
