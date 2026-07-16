---
title: "Tasks: RC-2 daemon ownership re-election (foundation)"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "RC-2 re-election tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/022-daemon-ownership-reelection"
    last_updated_at: "2026-06-07T17:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked implementation + verification tasks complete"
    next_safe_action: "Runtime-validate before enabling the flag"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-026-007-022-daemon-ownership-reelection"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: RC-2 daemon ownership re-election (foundation)

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Verify the root cause: `shutdownLauncherForSignal` explicitly `child.kill(signal)`s the daemon (not a process-group effect)
- [x] T002 Verify current spawn options + `clearOwnerLeaseFile` vs `clearLeaseFile` (owner lease vs daemon lease)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `daemonReelectionEnabled` + `contextServerSpawnIo` + `shouldReleaseDaemonForReelection` (pure) (`mk-spec-memory-launcher.cjs`)
- [x] T004 Gate the context-server spawn on the flag (detached + unref when on; identical when off) (`mk-spec-memory-launcher.cjs`)
- [x] T005 Add the shutdown release branch (reap model-server, keep daemon lease, drop owner lease, exit without killing the daemon); export helpers (`mk-spec-memory-launcher.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `node --check` + 12-assertion smoke (incl. flag-off spawn-io identity)
- [x] T007 Add `launcher-daemon-reelection.vitest.ts`; full launcher suite (79 tests) green
- [x] T008 gpt-5.5-fast HIGH adversarial review of the diff (flag-off identity, leak/split-brain, adoption gap)
- [x] T009 `validate.sh --strict` for this packet
- [ ] T010 [B] Runtime-validate secondary adoption + terminal idle-death on multiple live sessions before enabling the flag — owed to a dedicated validation session
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All in-session tasks marked `[x]`
- [x] No `[B]` blockers except the runtime-validation owed before enabling the flag (documented)
- [x] Tests + syntax + adversarial review passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
