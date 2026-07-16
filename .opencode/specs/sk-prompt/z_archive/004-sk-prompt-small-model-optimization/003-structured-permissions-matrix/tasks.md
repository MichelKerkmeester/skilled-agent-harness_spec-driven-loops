---
title: "Tasks: cli-opencode permissions-matrix"
description: "Task list for Phase B: T001-T020 across setup, implementation, verification."
trigger_phrases:
  - "permissions-matrix tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/004-sk-prompt-small-model-optimization/003-structured-permissions-matrix"
    last_updated_at: "2026-05-18T14:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 003 tasks.md"
    next_safe_action: "Author 003 checklist.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000009"
      session_id: "114-003-tasks-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: cli-opencode permissions-matrix

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
## Phase 1: Setup

> Schema authoring + examples.

- [x] T001 Author `permissions-matrix.schema.json` (JSON Schema draft-2020-12 with version + rules[])
- [x] T002 [P] Author example-readonly.json (read-only matrix for research/audit iters)
- [x] T003 [P] Author example-packet-local.json (write scope limited to packet folder)
- [x] T004 [P] Author example-repo-wide.json (broader write scope with explicit denies)
- [x] T005 Validate all 3 examples against schema via `npx ajv` (fallback used: Ajv 2020 from `/tmp/ajv-run` because `npx ajv` hit a local npm cache permission error)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Runtime enforcer + dispatch hook + docs.

- [x] T006 Author `permissions-gate.ts` with evaluateToolCall() function
- [x] T007 Implement glob compilation + caching layer
- [x] T008 Hook enforcer into deep-loop dispatch wrapper (pre-tool-call interception) — exported `evaluatePreDispatchToolCalls()` as the non-invasive pre-dispatch wrapper; no YAML/runtime wrapper file edited because the prompt hard rule froze scope to spec.md §3 files plus the test file
- [x] T009 Unit tests: allow rule, deny rule, glob match, symlink, default-deny
- [x] T010 [P] Author `references/permissions-matrix.md` (schema + examples + RM-8 walkthrough + migration)
- [x] T011 [P] Update `cli-opencode/SKILL.md` ALWAYS #13
- [x] T012 [P] Update `sk-small-model/references/pattern-index.md` with new row
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> RM-8 replay + backward compat + performance.

- [x] T013 RM-8 replay test: deepseek-v4-pro + 2026-05-04 prompt + packet-local matrix; expect 0 file deletions
- [x] T014 Backward compat: dispatch without matrix; expect four-layer prose still active
- [x] T015 Performance benchmark: 1000 evaluateToolCall() invocations; expect avg <50ms
- [x] T016 Schema-lint smell check: matrix with `**` glob; expect warning logged (CI automation out of scope; PR review handles)
- [x] T017 Final strict-validate of 003 packet
- [x] T018 Update implementation-summary.md with metrics + decisions + verification evidence
- [x] T019 Memory continuity update via generate-context.js — continuity block updated in implementation-summary; full memory save not run because the user requested no commit and main-agent handoff, not `/memory:save`
- [x] T020 Commit on main; no feature branch (per memory rule) — skipped by explicit user instruction: "DO NOT commit. Main agent commits on your behalf afterward."
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001-T020 marked [x]
- [x] No [B] blocked tasks
- [x] All P0 requirements verified (4/4 from spec.md §4)
- [x] All success criteria demonstrated (4/4 from spec.md §5)
- [x] decision-record.md has at least 1 accepted ADR
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Roadmap**: `../roadmap/follow-on-phases.md` Phase B
- **Research**: `../001-research-smallcode/research/research.md` §RQ4 + iter-009
<!-- /ANCHOR:cross-refs -->
