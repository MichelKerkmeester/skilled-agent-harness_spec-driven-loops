---
title: "Tasks: Completion Evidence Sentinel"
description: "Task breakdown for the shared completion-evidence core, the Claude Stop adapter, the OpenCode session.idle adapter, wiring, and the first core unit test."
trigger_phrases:
  - "completion evidence sentinel tasks"
  - "completion sentinel task breakdown"
  - "stop hook completion tasks"
  - "session idle sentinel tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/004-completion-evidence-sentinel"
    last_updated_at: "2026-07-11T14:17:40Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 task breakdown for the sentinel"
    next_safe_action: "Start T004: build the completion-evidence-sentinel.cjs core"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts"
      - ".opencode/plugins/mk-completion-sentinel.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-completion-evidence-sentinel"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Completion Evidence Sentinel

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

- [ ] T001 Confirm `COMPLETION_CLAIM_PATTERN` and the `check-completion.sh --json` status enum (`quality-loop.ts:13`, `check-completion.sh:278-282`)
- [ ] T002 Confirm the Claude Stop insertion point after the single atomic state write (`session-stop.ts:559-605`)
- [ ] T003 [P] Confirm the `session.idle` shape and `ctx.client` last-message resolution (`mk-goal.js:2868`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build the shared core with claim gate, checklist evaluation via `check-completion.sh --json`, Level 1 `implementation-summary.md` fallback, and a transport-free decision (`.opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs`)
- [ ] T005 Add dedup by packet plus message fingerprint and a bounded shared-log append, never stdout or stderr (`.opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs`)
- [ ] T006 Extend the Claude Stop owner to call the core after the atomic write and surface the advisory in the return object, then rebuild dist (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`)
- [ ] T007 [P] Add the OpenCode `session.idle` default-export plugin that resolves the last message and packet via `ctx.client`, then delegates to the core (`.opencode/plugins/mk-completion-sentinel.js`)
- [ ] T008 [P] Register the new plugin and note the reused `Stop` wiring (`.opencode/plugins/README.md`)
- [ ] T009 Ensure fail-open behavior on every error path so any internal error resolves to a silent `ok` (`.opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Write the first core unit test: fixture A advises `EVIDENCE_MISSING`, fixture B is `ok`, a no-claim message is a no-op that never spawns `check-completion.sh` (`.opencode/skills/system-spec-kit/mcp_server/tests/completion-evidence-sentinel.vitest.ts`)
- [ ] T011 Verify the dist rebuild passes the dist-freshness guard and the `validate.sh` staleness backstop
- [ ] T012 Update spec, plan, checklist, and decision-record cross-references and the changelog entry
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Core unit test passing and the no-test guarantee proven
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
