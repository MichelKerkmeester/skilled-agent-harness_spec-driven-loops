---
title: "Tasks: Cursor hook adapter layer"
description: "Task breakdown for the Cursor hook adapter layer phase."
trigger_phrases: ["cursor hook adapter tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/004-cursor-hook-adapter-layer"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md for phase 004"
    next_safe_action: "Author checklist.md, decision-record.md"
    blockers: ["depends on 003 landing first"]
    key_files: ["spec.md", "plan.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cursor hook adapter layer

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Confirm phase 003 landed; read live `hooks/codex/` + `runtime/hooks/codex/` as the structural template
- [ ] T002 Live-probe which Cursor events the installed `cursor-agent` CLI actually delivers; record the confirmed-delivered list
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] T003 Author `mcp-server/hooks/cursor/shared.ts` (payload read + neutral-core spawn + Cursor `{permission,...}` envelope + fail-open)
- [ ] T004 [P] Author `mcp-server/hooks/cursor/session-start.ts`, `user-prompt-submit.ts`, `session-stop.ts`, `README.md`
- [ ] T005 [P] Author `runtime/hooks/cursor/spec-gate-classify.mjs`, `spec-gate-enforce.mjs`, `README.md` (map Cursor tool vocab → core bash/write/edit)
- [ ] T006 Author project `.cursor/hooks.json` registering only the confirmed-delivered core events (`sessionStart`/`beforeSubmitPrompt`/`stop`)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T007 Live smoke test each wired event under `cursor-agent`; capture stdin/stdout evidence
- [ ] T008 Confirm neutral cores unchanged (`git diff` empty); feed malformed stdin and assert fail-open (`{permission: allow}`)
- [ ] T009 Document any registered-but-undelivered event as an open gap (editor-only until CLI delivery confirmed)
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] T010 `validate.sh 004-cursor-hook-adapter-layer --strict` passes 0/0; SC-001..SC-004 met; write `implementation-summary.md`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Depends on `../003-cli-cursor-skill-packet/`; precedes `../005-cursor-model-registry-and-routing/`.
- Structural precedent: `.opencode/skills/system-spec-kit/mcp-server/hooks/codex/`, `.opencode/skills/system-spec-kit/runtime/hooks/codex/`.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`, `decision-record.md`
