---
title: "Tasks: Skill Advisor Cross-Session Reconnect Hardening"
description: "Completed task ledger for launcher parity remediation, sandbox tests, and packet documentation updates."
trigger_phrases:
  - "skill advisor launcher tasks"
  - "dead socket recovery tasks"
  - "stale lease remediation tasks"
  - "advisor reconnect verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/013-advisor-and-codegraph-migrated-items/001-skill-advisor-cross-session-reconnect"
    last_updated_at: "2026-06-11T10:05:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Filled remediation task ledger."
    next_safe_action: "Use deferrals for future follow-up."
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-launcher-orphan-reaping.vitest.ts"
    session_dedup:
      fingerprint: "sha256:e4b4069a4d56b9447906685e1e7eeb67b2357e6a99cfcb7c70a86a848a56f0e0"
      session_id: "skill-advisor-cross-session-reconnect-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All code work stays within the pre-approved packet scope."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Skill Advisor Cross-Session Reconnect Hardening

<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[D]` | Deliberately deferred |

Task format: `T### [P?] Description (evidence)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the target skill-advisor launcher before editing. Evidence: `.opencode/bin/mk-skill-advisor-launcher.cjs` read in full.
- [x] T002 Read the code-index launcher reference before editing. Evidence: `.opencode/bin/mk-code-index-launcher.cjs` read in full.
- [x] T003 Read the spec-memory launcher reference for allowed model-server behavior. Evidence: `.opencode/bin/mk-spec-memory-launcher.cjs` read through the relevant respawn and lock sections.
- [x] T004 Read the existing sandbox launcher tests and session-proxy tests. Evidence: owning test files were located and read before patching.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add local pid wait and reap helpers. Evidence: `waitForPidExit` and `reapOwnerBeforeRespawn` added in `mk-skill-advisor-launcher.cjs`.
- [x] T006 Add pid-specific owner lease cleanup. Evidence: `clearOwnerLeaseFileIfOwner` added in `mk-skill-advisor-launcher.cjs`.
- [x] T007 Handle bridge respawn decisions. Evidence: `bridgeOrReportLeaseHeld` now routes `{ action: "respawn" }` into `respawnAfterDeadSocket`.
- [x] T008 Adapt respawn to advisor child pid ownership. Evidence: respawn target prefers `readLeaseFile().childPid` and starts the owner heartbeat before `launchServer()`.
- [x] T009 Add stale launcher lease adopt-or-reap behavior. Evidence: stale lease `childPid` and `socketPath` are read; live unresponsive child cleanup is deferred to the bootstrap lock.
- [x] T010 Harden bootstrap lock stale reclaim. Evidence: stale reclaim now uses a 300 second stale threshold and atomic rename claim.
- [x] T011 Kill the model-server root before pid clear. Evidence: model-server RSS breach and launcher-exit cleanup now signal the root, reap descendants, wait, and only then clear the shared pid.
- [x] T012 Harden skill-advisor replay classification. Evidence: `advisor_validate` moved to unsafe, `advisor_recommend` remains replayable with documented duplicate-shadow-delta tradeoff.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Add dead-socket respawn test. Evidence: new Vitest case asserts respawned advisor stdout contains `respawned-advisor`.
- [x] T014 Add stale wedged child cleanup test. Evidence: new Vitest case asserts the stale `childPid` is reaped before replacement child spawn.
- [x] T015 Strengthen stale owner-lease serialization test. Evidence: stale owner lease plus two concurrent reclaimers converge to a single writer.
- [x] T016 Preserve sandboxing. Evidence: tests copy launcher fixtures into temp workspaces and set `SPECKIT_IPC_SOCKET_DIR` to a temp socket dir.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Documentation and Verification

- [x] T017 Replace scaffolded `spec.md` with current shipped-state content. Evidence: problem, scope, requirements, risks, and deferrals are filled.
- [x] T018 Replace scaffolded `plan.md` with current implementation plan. Evidence: architecture, phases, affected surfaces, testing strategy, and rollback are filled.
- [x] T019 Replace scaffolded `tasks.md` with completed task ledger. Evidence: this file contains concrete implementation and test evidence.
- [x] T020 Replace scaffolded `implementation-summary.md` with exact final verification evidence. Evidence: implementation summary records typecheck, Vitest, CLI smoke, comment hygiene, and strict validation results.
- [x] T021 Run the required verification commands and update evidence. Evidence: typecheck exit 0; orphan reaping 7/7; session proxy 19/19; CLI smoke 37/8/9; strict validation passed; comment hygiene clean.
- [D] T022 Implement release-not-kill re-election behavior. Deferral: intentionally out of scope for this code-index parity phase.
- [D] T023 Implement child-exit relaunch loop. Deferral: intentionally out of scope for this code-index parity phase.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All non-deferred tasks marked `[x]`.
- [x] No blocked tasks remain.
- [x] Required verification passed and exact results are recorded.
- [x] Deferred C2/C5 choices are documented as deliberate scope decisions.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: see `spec.md`.
- Plan: see `plan.md`.
- Final delivery evidence: see `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
