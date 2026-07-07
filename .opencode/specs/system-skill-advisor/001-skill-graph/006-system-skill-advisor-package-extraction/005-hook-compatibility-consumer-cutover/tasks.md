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
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/005-hook-compatibility-consumer-cutover"
    last_updated_at: "2026-05-14T12:36:34Z"
    last_updated_by: "codex"
    recent_action: "Consumer cutover implemented"
    next_safe_action: "Continue to 006 cleanup"
    blockers:
      - "Hook Vitest suites still import removed ../skill_advisor test helpers outside the 005 edit whitelist."
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

- [x] T001 Inventory advisor consumers with `rg` across plugins, hooks, shims, doctor assets, install guides, and MCP tool registration. Evidence: required inventory greps ran; live non-doc/non-test `mcp_server/skill_advisor` count was 10 before edits.
- [x] T002 Classify inventory hits as primary consumer, legacy proxy, docs-only, test, archive, or child-006 cleanup. Evidence: plugin and bridge were PRIMARY_CONSUMER; memory advisor registration was LEGACY_PROXY; doctor/install guide refs were DOCS_ONLY; old hook-test imports were TEST_FIXTURE and blocked by whitelist.
- [x] T003 Confirm child 004 provides a runnable `system_skill_advisor` MCP server and launcher/config entry. Evidence: `.opencode/bin/skill-advisor-launcher.cjs` exists; `system_skill_advisor` is present in `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, and `.gemini/settings.json`; launcher smoke printed the standalone DB path.
- [x] T004 Record legacy bridge decision from ADR-003: proxy with bounded deprecation log for one minor version. Evidence: `tools/index.ts` logs `[advisor-deprecation] ... Removal in 013/009/006.` once per process.
- [x] T005 [P] Capture backup evidence for every file that Phase 2 will edit. Evidence: `git diff -- <whitelist>` reviewed after patch; existing unrelated dirty worktree entries were left untouched.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T006 Update `.opencode/plugins/spec-kit-skill-advisor.js` bridge/cache assumptions to the standalone advisor path. Evidence: cache signature now watches the bridge, standalone launcher, standalone source entrypoint, and standalone built server.
- [x] T007 Update `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` to stop loading old `skill_advisor` schema/dist paths. Evidence: bridge reads the standalone compat contract and calls `system_skill_advisor.advisor_recommend` over MCP stdio.
- [x] T008 Convert memory MCP `advisor_*` registration in `tools/index.ts` and `tool-schemas.ts` to a temporary proxy/deprecation bridge. Evidence: memory `advisorTools` now proxy through `skill-advisor-launcher.cjs`; descriptors are marked `[DEPRECATED proxy]`.
- [x] T009 Update Claude, Codex, Gemini, and OpenCode hook wrappers under `.opencode/skills/system-spec-kit/mcp_server/hooks/**`. Evidence: hook grep shows runtime wrappers already import from `../../../../system-skill-advisor/mcp_server/...`; no old hook import remains in hook source.
- [x] T010 Update or create the legacy Python shim under system-spec-kit only as a forwarder to `system-skill-advisor`. Evidence: no system-spec-kit shim exists or was created; canonical `system-skill-advisor/mcp_server/scripts/skill_advisor.py` path roots and native dist paths were corrected.
- [x] T011 Update `.opencode/commands/doctor/assets/doctor_skill-advisor.yaml` to use standalone advisor package and DB paths. Evidence: scorer lane and weights paths now target `.opencode/skills/system-skill-advisor/mcp_server/...`.
- [x] T012 Update `.opencode/commands/doctor/assets/doctor_update.yaml` advisor health and rebuild references. Evidence: advisor DB allowlist points to `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`; advisor phase names `system_skill_advisor.advisor_*`.
- [x] T013 [P] Update `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` with memory MCP plus advisor MCP topology. Evidence: guide documents standalone `system_skill_advisor` and deprecated memory proxy window.
- [x] T014 [P] Update `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` with standalone verification and legacy bridge window. Evidence: guide now builds/verifies the standalone package and notes `spec_kit_memory.advisor_*` proxy removal in 006.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T015 Run stale-reference grep for `spec_kit_memory.advisor_*`, `dist/skill_advisor`, and `mcp_server/skill_advisor`. Evidence: post-edit live non-doc/non-test count is 3, limited to the intentional deprecation string and historical stress config excludes.
- [x] T016 Run OpenCode skill-advisor plugin bridge smoke with stdin JSON. Evidence: direct bridge stdin smoke returned `status:"ok"`, `route:"native"`, and an advisor brief from `system_skill_advisor`.
- [B] T017 Run hook test suites for Codex, Claude, Gemini, and OpenCode paths present in the repo. Blocked: runtime/plugin source builds, but four legacy hook Vitest suites import removed `../skill_advisor/...` test helpers outside the 005 edit whitelist; OpenCode plugin Vitest passed 30/30.
- [x] T018 Run Python shim smoke for `--force-native`, `--force-local`, and `--health` where supported. Evidence: all three commands exited 0 after package-local path correction.
- [x] T019 Run doctor route validation and `/doctor:update --cleanup-legacy=false` or the nearest safe dry-run equivalent. Evidence: Ruby YAML parse passed for both doctor assets; full doctor mutation route was not run.
- [x] T020 Run strict spec validation for this packet. Evidence: `validate.sh .../005-hook-compatibility-consumer-cutover --strict` exited 0 with 0 errors and 0 warnings.
- [x] T021 Record child 006 cleanup handoff for proxy removal and stale historical references. Evidence: proxy removal is documented in `implementation-summary.md`, checklist blockers, and install-guide deprecation notes.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements in `spec.md` have implementation evidence.
- [x] All Phase 3 verification tasks have command output recorded in `implementation-summary.md`.
- [x] Legacy proxy behavior is documented with removal assigned to child 006.
- [x] No unclassified `advisor_*` caller remains in production surfaces.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Verification Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
