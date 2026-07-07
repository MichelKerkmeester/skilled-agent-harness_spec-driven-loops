---
title: "Feature Specification: owner-lease single-writer election race (OR-R-01)"
description: "The launcher's pre-daemon election has non-atomic gates: the owner-lease reclaim and the writeLeaseFile+reprobe both only catch overlapping writes, and writeLeaseFile runs outside the bootstrap-lock branch. Under two concurrent launchers entering the stale-heartbeat reclaim, two daemon children can briefly both launch; the PID lease flips last-writer-wins. Bounded by the daemon heartbeat self-shutdown — investigated as P2 benign-transient; fix deferred pending an owner risk-decision."
trigger_phrases:
  - "owner lease election race"
  - "OR-R-01 launcher single writer"
  - "writeLeaseFile reprobe non-atomic"
  - "026 004 013 election race"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/013-owner-lease-election-race"
    last_updated_at: "2026-05-29T14:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Investigated OR-R-01; root cause + severity (P2) + fix options documented"
    next_safe_action: "Owner decides: land Option B now (medium risk, probabilistic test) or schedule deliberately"
    blockers:
      - "Fix touches operator-sensitive launch-election + bridge fallback; no deterministic concurrency test available"
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "plan.md"
    completion_pct: 50
    open_questions:
      - "Land the election fix (Option B) now accepting medium risk + a probabilistic test, or schedule it with operator awareness of their concurrent launcher WIP?"
    answered_questions:
      - "Is OR-R-01 a corruption-grade bug? No — the corruption path (concurrent DB migration) is already closed by OR-1-01's bootstrap-lock gating; OR-R-01 is P2 benign-transient."
---
# Feature Specification: Owner-Lease Single-Writer Election Race (OR-R-01)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Investigated (fix deferred pending decision) |
| **Created** | 2026-05-29 |
| **Branch** | `013-owner-lease-election-race` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The launcher (`mk-code-index-launcher.cjs`) elects the single writer through several gates before spawning the daemon, but two of them are non-atomic: the owner-lease reclaim (`acquireOwnerLeaseFile`, lines 373-386) and the `writeLeaseFile()` + `readLeaseFile()` reprobe (lines 948-954) both detect only *overlapping* concurrent writes via a read-after-write, not *sequential* ones. Worse, `writeLeaseFile()` runs **outside** the `if (lockHeld)` bootstrap-lock branch, so both the bootstrap-lock winner and loser reach it. Under two launchers concurrently reclaiming a stale-heartbeat lease, two daemon children can briefly both `launchServer()`, and the PID lease flips last-writer-wins. The daemon does not re-elect atomically; it only refreshes on a heartbeat timer (`index.ts:46-55`, interval `TTL/3`) and self-shuts-down when it finds the lease no longer holds its pid — so the double-daemon window persists up to one heartbeat tick (Agent A's observed "~12 s both alive").

### Purpose
Decide and (if approved) make the launch election atomic so exactly one launcher ever reaches `launchServer()`, eliminating the transient double-daemon window and PID-lease flip.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Document the precise 4-layer election race and its severity (this packet).
- A recommended fix making the launch election atomic (Option B preferred).
- A concurrency regression test for the two-launcher reclaim path.

### Out of Scope
- The DB-migration concurrency hazard — already closed by OR-1-01 (bootstrap-lock gating + `COPYFILE_EXCL`).
- The server-side `owner-lease.ts` mutation lock — sound (OR-3-01 hardened it).
- Redesigning the bridge/respawn protocol - only the launch-election atomicity is in question.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/mk-code-index-launcher.cjs` | Modify (deferred) | Make `writeLeaseFile()` exclusive (O_EXCL) or gate launch strictly on the bootstrap lock |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` | Modify (deferred) | Two-launcher election regression test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document the race, severity, and fix options (this packet) | implementation-summary.md captures the 4-layer election analysis + severity P2 + Options A/B |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Make the launch election atomic (DEFERRED — pending owner decision) | At most one launcher reaches `launchServer()` under N concurrent stale-heartbeat reclaims |
| REQ-003 | Two-launcher election regression test (DEFERRED) | Test exercises the concurrent reclaim path and asserts a single launcher launches |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The race, its bounded severity (P2), and the fix options are documented with exact `file:line` evidence (this packet — DONE).
- **SC-002**: After the (deferred) fix, no interleaving of two concurrent launchers produces two live daemons or a PID-lease flip.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fix touches launch-election + bridge fallback | Med | Prefer the minimal O_EXCL change (Option B); add a regression test; land with operator awareness of their concurrent launcher WIP |
| Risk | No deterministic concurrency test (OR-1-01 showed 2-launcher tests are ~75% deterministic) | Low | Accept a probabilistic detector + a strong code-level invariant argument |
| Dependency | Operator's concurrent launcher WIP (BUG-03/04/06 territory) | Med | Coordinate / re-base before landing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Land Option B (O_EXCL `writeLeaseFile`) now accepting medium risk + a probabilistic test, or schedule it deliberately with operator coordination?
- Is the bootstrap-lock-loser-also-launches behavior intentional (take over a build done by another launcher), and must the fix preserve it?
<!-- /ANCHOR:questions -->
