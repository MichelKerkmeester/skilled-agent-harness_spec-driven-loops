---
title: "Tasks: Launcher Race-Window Tightening + Debug-Log Hygiene"
description: "Task list for closing 008 P2 findings."
trigger_phrases:
  - "008 tasks"
importance_tier: "useful"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/008-launcher-race-window-and-debug-log-hygiene"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete"
    next_safe_action: "Commit + push"
    blockers: []
---
# Tasks: Launcher Race-Window Tightening + Debug-Log Hygiene

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` complete; `[ ]` pending; `[!]` blocker
- Task ID `T###` is stable across re-runs; do not renumber.
- Tasks live in 3 phases: (1) code edits, (2) verification, (3) packet finalization.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] **T001** Add `debug(message)` helper near `log()` definition in `mk-skill-advisor-launcher.cjs`, gated on `MK_SKILL_ADVISOR_DEBUG === '1'`.
- [x] **T002** Replace `log()` at line ~207 (`lease check failed`) with `debug()`.
- [x] **T003** Replace `log()` at line ~384 (`childProcess.on('error')`) with `log()` actionable summary + `debug()` stack.
- [x] **T004** Replace `log()` at line ~431 (`DB: ${path}`) with `debug()`.
- [x] **T005** Replace `log()` at line ~478 (main catch) with `log()` actionable summary + `debug()` stack.
- [x] **T006** Restructure `main()`: move `writeLeaseFile()` + `readLeaseFile()` reprobe + early-return inside the `if (lockHeld)` block; keep `launchServer()` at outer scope.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] **T007** `node --check .opencode/bin/mk-skill-advisor-launcher.cjs` → exit 0.
- [x] **T008** `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` → exit 0.
- [x] **T009** `npx vitest --run launcher-lease launcher-bootstrap` → 21 tests PASS.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] **T010** Run `generate-description.js` on the 008 folder to emit `description.json` + `graph-metadata.json`.
- [x] **T011** `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <abs 008 path> --strict` → `RESULT: PASSED`.
- [x] **T012** Commit + push with explicit paths on `main`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

All 12 tasks complete. No deferred work. Single commit on `main` per the standard arc handoff.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- Spec: `spec.md`
- Plan: `plan.md`
- Implementation summary: `implementation-summary.md`
- Predecessor: `../007-skill-advisor-zombie-launcher-fix/`
<!-- /ANCHOR:cross-refs -->
