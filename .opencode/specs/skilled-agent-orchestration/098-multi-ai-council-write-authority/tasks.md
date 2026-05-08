---
title: "Tasks: Multi-AI Council write authority [skilled-agent-orchestration/098-multi-ai-council-write-authority/tasks]"
description: "Level 3 task list for council scoped write authority, persistence migration, audit/rollback support, and verification."
trigger_phrases:
  - "council write authority tasks"
  - "098 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/098-multi-ai-council-write-authority"
    last_updated_at: "2026-05-08T23:10:00Z"
    last_updated_by: "codex"
    recent_action: "Implementation in progress"
    next_safe_action: "Resolve blocked Codex TOML mirror write, then rerun parity/vitest/strict validation"
    blockers:
      - ".codex/agents/multi-ai-council.toml is not writable in current sandbox (EPERM)"
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "research.md"
      - ".opencode/agents/multi-ai-council.md"
      - ".opencode/skills/system-spec-kit/scripts/multi-ai-council/lib/persist-artifacts.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "council-write-authority-2026-05-08-codex"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions: []
---
# Tasks: Multi-AI Council write authority

<!-- SPECKIT_LEVEL: 3 -->
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
## PHASE 1: SETUP

- [x] T001 Read `spec.md` first.
- [x] T002 Read `decision-record.md` and identify ADR anchor restructuring.
- [x] T003 Read `research.md` and scoped-write precedent.
- [x] T004 Read Level 3 templates for plan/tasks/checklist/implementation-summary/decision-record/resource-map.
- [x] T005 Read existing council infrastructure and tests.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T006 Create `lib/package.json` to keep `lib/*.js` CommonJS under the scripts package.
- [x] T007 Refactor helper logic into `lib/persist-artifacts.js`.
- [x] T008 Thin `persist-artifacts.cjs` wrapper around the library.
- [x] T009 Create `lib/audit-trail.js` with checksum, v1.2 metadata, event append, and rotation.
- [x] T010 Create `lib/rollback.js` with move-to-failed and supersede markers.
- [x] T011 Update writable markdown runtime mirrors.
- [B] T012 Update `.codex/agents/multi-ai-council.toml` mirror. Blocked by EPERM.
- [x] T013 Update `state-format.md` with v1.2 audit events.
- [x] T014 Update `folder-layout.md` writer ownership and failed-round layout.
- [x] T015 Update `advise-council-completion.cjs` to count v1.2 events.
- [x] T016 Add four target Vitest files.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T017 Run direct TypeScript compile fallback.
- [ ] T018 Run four target Vitest files to pass.
- [x] T019 Run strict spec validation to pass.
- [ ] T020 Perform sandbox smoke.
- [ ] T021 Author final implementation summary after blockers close.
- [ ] T022 Update description and graph metadata to complete after validation.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 reqs REQ-001 through REQ-005 closed.
- [ ] All P1 reqs REQ-006 through REQ-012 closed.
- [ ] P2 reqs REQ-013 through REQ-015 closed or documented as deferred.
- [ ] Strict validation exits 0.
- [ ] TypeScript compile clean.
- [ ] Four target Vitest files pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision Record**: `decision-record.md`
- **Research**: `research.md`
<!-- /ANCHOR:cross-refs -->
