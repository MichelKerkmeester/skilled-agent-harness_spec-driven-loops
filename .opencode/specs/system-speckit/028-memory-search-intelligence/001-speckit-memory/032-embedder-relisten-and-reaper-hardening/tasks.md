---
title: "Tasks: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "embedder relisten reaper hardening"
  - "tasks core"
importance_tier: "high"
contextType: "implementation"
parent: "system-speckit/028-memory-search-intelligence/001-speckit-memory"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/032-embedder-relisten-and-reaper-hardening"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Deferred-work spec authored"
    next_safe_action: "Implement WS1 (embedder re-listen) first"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-embedder-relisten-and-reaper-hardening-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 32: Embedder Demand-Listener Relisten and Reaper Hardening

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Re-confirm the current call-site inventory for `startModelServerDemandListener` and the bridge/adopt paths against HEAD (`.opencode/bin/mk-spec-memory-launcher.cjs`)
- [ ] T002 Stand up or extend a two-launcher live-durability harness for WS1/WS5 (`.opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts`)
- [ ] T003 [P] Re-confirm the `orphan-mcp-sweeper.sh` `preserve_reason`/`terminate_candidates` line ranges against HEAD (`.opencode/scripts/orphan-mcp-sweeper.sh`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 WS1: implement the demand-listener re-arm/verify check at the bridge/adopt call sites (`.opencode/bin/mk-spec-memory-launcher.cjs:1656-1691`)
- [ ] T005 [P] WS2: implement the hf-local fail-fast branch for the socket-absent-no-owner-lease case (`.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts`)
- [ ] T006 [P] WS3(a): sweeper maintenance-marker respect in `preserve_reason` (`.opencode/scripts/orphan-mcp-sweeper.sh`)
- [ ] T007 [P] WS3(b): sweeper singleton rule against `daemon-ipc.sock` (`.opencode/scripts/orphan-mcp-sweeper.sh`)
- [ ] T008 [P] WS3(c): sweeper pid re-classification before the `terminate_candidates` SIGKILL escalation (`.opencode/scripts/orphan-mcp-sweeper.sh`)
- [ ] T009 WS5: investigate the `launcher-lease.vitest.ts` owner-reap timeout (line 344) and fix or root-cause it
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Run the WS1 live-durability test: two real launchers, adoption, confirm `hf-embed.sock` respawns on demand
- [ ] T011 Run WS2's unit tests: fail-fast vs. genuine-spawn branches
- [ ] T012 Run WS3's sweeper unit tests plus a dry-run pass that preserves the live daemon
- [ ] T013 Re-run the WS5 target test 5/5 for reliability
- [ ] T014 Write the WS4 runbook and cross-check it against the actual `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` default and the launchd plist contents
- [ ] T015 Adversarial review of WS1 and WS3 before merge or any live activation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] WS1/WS2/WS3/WS5 acceptance criteria (REQ-001 through REQ-008) verified with evidence
- [ ] WS4 runbook written and cross-checked
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../030-opencode-temp-worker-reaping/`
<!-- /ANCHOR:cross-refs -->
