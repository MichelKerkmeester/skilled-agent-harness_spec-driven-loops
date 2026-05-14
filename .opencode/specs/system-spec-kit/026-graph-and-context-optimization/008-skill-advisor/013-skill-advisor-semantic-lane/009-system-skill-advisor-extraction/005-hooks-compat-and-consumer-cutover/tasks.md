---
title: "Tasks: Hooks Compat And Consumer Cutover"
description: "Task breakdown for the 005 consumer cutover from spec_kit_memory advisor ownership to system_skill_advisor advisor ownership."
trigger_phrases:
  - "013 009 005 tasks"
  - "advisor consumer cutover tasks"
  - "hooks compat tasks"
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/005-hooks-compat-and-consumer-cutover"
    last_updated_at: "2026-05-14T12:45:00Z"
    last_updated_by: "codex"
    recent_action: "COMPACT authored tasks"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0130090050000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-005-hooks-compat-consumer-cutover"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Hooks Compat And Consumer Cutover

<!-- SPECKIT_LEVEL: 3 -->

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

- [ ] T001 Inventory advisor consumers with `rg` across plugins, hooks, shims, doctor assets, install guides, and MCP tool registration.
- [ ] T002 Classify inventory hits as primary consumer, legacy proxy, docs-only, test, archive, or child-006 cleanup.
- [ ] T003 Confirm child 004 provides a runnable `system_skill_advisor` MCP server and launcher/config entry.
- [ ] T004 Record legacy bridge decision from ADR-003: proxy with bounded deprecation log for one minor version.
- [ ] T005 [P] Capture backup evidence for every file that Phase 2 will edit.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [ ] T006 Update `.opencode/plugins/spec-kit-skill-advisor.js` bridge/cache assumptions to the standalone advisor path.
- [ ] T007 Update `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` to stop loading old `skill_advisor` schema/dist paths.
- [ ] T008 Convert memory MCP `advisor_*` registration in `tools/index.ts` and `tool-schemas.ts` to a temporary proxy/deprecation bridge.
- [ ] T009 Update Claude, Codex, Gemini, and OpenCode hook wrappers under `.opencode/skills/system-spec-kit/mcp_server/hooks/**`.
- [ ] T010 Update or create the legacy Python shim under system-spec-kit only as a forwarder to `system-skill-advisor`.
- [ ] T011 Update `.opencode/commands/doctor/assets/doctor_skill-advisor.yaml` to use standalone advisor package and DB paths.
- [ ] T012 Update `.opencode/commands/doctor/assets/doctor_update.yaml` advisor health and rebuild references.
- [ ] T013 [P] Update `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` with memory MCP plus advisor MCP topology.
- [ ] T014 [P] Update `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` with standalone verification and legacy bridge window.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [ ] T015 Run stale-reference grep for `spec_kit_memory.advisor_*`, `dist/skill_advisor`, and `mcp_server/skill_advisor`.
- [ ] T016 Run OpenCode skill-advisor plugin bridge smoke with stdin JSON.
- [ ] T017 Run hook test suites for Codex, Claude, Gemini, and OpenCode paths present in the repo.
- [ ] T018 Run Python shim smoke for `--force-native`, `--force-local`, and `--health` where supported.
- [ ] T019 Run doctor route validation and `/doctor:update --cleanup-legacy=false` or the nearest safe dry-run equivalent.
- [ ] T020 Run strict spec validation for this packet.
- [ ] T021 Record child 006 cleanup handoff for proxy removal and stale historical references.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` have implementation evidence.
- [ ] All Phase 3 verification tasks have command output recorded in `implementation-summary.md`.
- [ ] Legacy proxy behavior is documented with removal assigned to child 006.
- [ ] No unclassified `advisor_*` caller remains in production surfaces.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Verification Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
