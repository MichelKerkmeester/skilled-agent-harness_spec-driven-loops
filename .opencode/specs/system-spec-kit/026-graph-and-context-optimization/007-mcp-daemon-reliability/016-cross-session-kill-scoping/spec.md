---
title: "Feature Specification: Cross-Session Kill Scoping + Post-Crash Integrity Gate [system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/016-cross-session-kill-scoping/spec]"
description: "Stop one session's cleanup from killing sibling sessions' MCP transports, and refuse to serve a corruption-damaged index after a dirty shutdown; includes the live-DB salvage that recovered 9,888 of 9,890 rows."
trigger_phrases:
  - "cross session kill scoping"
  - "session cleanup ancestry guard"
  - "post crash integrity gate"
  - "mcp disconnect root cause"
  - "026 007 016"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/016-cross-session-kill-scoping"
    last_updated_at: "2026-06-06T17:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Both fixes shipped and drilled; live index salvaged"
    next_safe_action: "Run an embedding reconcile pass on the recovered index"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Launcher childPid lease + stale lockdir reclaim: verified already shipped by prior phases; no change needed"
---
# Feature Specification: Cross-Session Kill Scoping + Post-Crash Integrity Gate

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
MCP transports kept dying mid-session despite the front-proxy work. Forensics traced the dominant path: `session-cleanup.sh` fell back to the hook's PPID when CLAUDE_SESSION_PID was unset, so under a shared terminal ancestor one ending session's cleanup walked EVERY session's descendants and SIGTERMed sibling launchers by name-glob. The cascade — dead launcher, dirty daemon exit, stale socket, bridge ECONNREFUSED, torn WAL — also explains the recurring "database disk image is malformed" warnings; the live context-index.sqlite was confirmed structurally corrupted (invalid page numbers, double-referenced pages) with no checkpoint to restore from.

### Purpose
Make session cleanup provably session-scoped, make a dirty-shutdown boot refuse to serve a corrupted index, and salvage the live index.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F1 — `session-cleanup.sh` scoping: no PPID fallback (no identity → no-op), kill-time ancestry re-proof (bounded ppid-chain walk to SESSION_PID), attributable logging (`matched_by=`, `ancestor_ok=`). The planned lease-file guard collapsed into the ancestry guard: a sibling session's process can never carry this session's pid in its ancestor chain, and the guard re-proves that at kill time — simpler, dependency-free, equally strong
- F2 — post-crash integrity gate in `vector-index-store.ts`: when the `.unclean-shutdown` marker is still present at open, run `PRAGMA quick_check(1)`; on failure write the checkpoint `.needs-rebuild` sentinel (new corruption-variant writer, same atomic temp+rename discipline) and fail fast instead of serving a malformed database. Clean boots pay nothing (marker-gated)
- Live-DB salvage: `sqlite3 .recover` of the corrupted index into a clean candidate, verified (`quick_check` ok), swapped in with the original preserved as `.corrupt-20260606`
- Verification that launcher childPid-in-lease and stale-lockdir reclaim already shipped in prior phases (no change)

### Out of Scope
- RC-3 bridge liveness/reap (phase 007), RC-1 provider-dispose (005), RC-2 watchdog (006) — stay with their owners
- The shared-daemon-owner shutdown question (owner session's legitimate cleanup stops the daemon other sessions share) — daemon respawn/watchdog territory, phases 006/007

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/scripts/session-cleanup.sh | Modify | No-fallback identity + ancestry re-proof + logging |
| mcp_server/lib/search/vector-index-store.ts | Modify | Marker-gated quick_check + corruption sentinel writer |
| mcp_server/database/context-index.sqlite | Replace | Salvaged index swapped in; corrupted original preserved |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Cleanup never kills outside its session | Drills: no-identity no-op; foreign-session run leaves another tree's matching process alive; own-session kill works with ancestor_ok=yes logged |
| REQ-002 | Dirty-shutdown boot refuses a corrupted index | Drill: structurally corrupted scratch DB + marker → FATAL + sentinel + throw; clean DB + marker → normal init |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Live index healthy again | Post-swap quick_check returns ok; row counts within salvage tolerance |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero cross-session kills attributable in the stop-hook log going forward (new fields make this auditable)
- **SC-002**: The malformed-database class cannot silently recur: dirty boots probe, corrupted boots refuse + sentinel
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Salvage lost 2 of 9,890 index rows + parked 368 orphans in lost_and_found | Low | Index is derived from canonical spec docs; a reconcile/scan pass re-derives drift; original DB preserved |
| Risk | quick_check cost on dirty boots (~2s at 390MB) | Low | Marker-gated: only after unclean shutdown, exactly when the risk exists |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Follow-up (non-blocking): embedding reconcile + lost_and_found triage on the recovered index; vitest runner could not start in this sandbox (vite createServer failure) — suite rerun belongs to the next CI/dev session.
<!-- /ANCHOR:questions -->
