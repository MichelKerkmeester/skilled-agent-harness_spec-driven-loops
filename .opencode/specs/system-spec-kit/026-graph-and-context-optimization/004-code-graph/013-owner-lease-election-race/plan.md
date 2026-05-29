---
title: "Implementation Plan: owner-lease election race (OR-R-01)"
description: "Fix plan to make the launcher launch-election atomic. Two options (A: gate launch on the bootstrap lock; B: exclusive writeLeaseFile). Option B preferred — minimal, localized. Fix deferred pending an owner risk-decision; investigation complete."
trigger_phrases:
  - "OR-R-01 fix plan"
  - "atomic launch election launcher"
  - "exclusive writeLeaseFile plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/004-code-graph/013-owner-lease-election-race"
    last_updated_at: "2026-05-29T14:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Drafted fix Options A/B with affected-surfaces"
    next_safe_action: "Await owner decision on Option B before editing the launcher"
    blockers:
      - "Owner risk-decision required before touching launch-election code"
    key_files:
      - "plan.md"
      - "spec.md"
    completion_pct: 50
    open_questions:
      - "Option A vs B"
    answered_questions:
      - "Is the corruption path in scope? No — closed by OR-1-01."
---
# Implementation Plan: Owner-Lease Election Race (OR-R-01)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS launcher (`.cjs`) + TypeScript MCP server |
| **Framework** | None (raw `fs` lease/lock primitives) |
| **Storage** | SQLite (WAL); lease files on disk |
| **Testing** | Vitest (`tests/launcher-lease.vitest.ts`, spawns the real launcher) |

### Overview
Make the launcher's launch election atomic so exactly one launcher reaches `launchServer()`. Today the owner-lease reclaim (373-386) and the `writeLeaseFile`+reprobe (948-954) are read-after-write checks that only catch overlapping writes, and `writeLeaseFile` runs outside the `if (lockHeld)` block. The fix replaces the non-atomic PID-lease election with an exclusive (`O_EXCL`) claim (Option B), or gates the launch strictly on the atomic bootstrap lock (Option A).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Root cause traced with exact `file:line` evidence (implementation-summary.md)
- [ ] Owner decision recorded on Option A vs B and risk acceptance

### Definition of Done
- [ ] At most one launcher reaches `launchServer()` under concurrent reclaim
- [ ] Two-launcher regression test added; full suite green
- [ ] Launcher startup happy-path unchanged (single launcher still launches; bridge path intact)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered single-writer election. Four layers run before/at daemon start:
1. **Owner-lease reclaim** (`acquireOwnerLeaseFile`, 347-386) — non-atomic read-after-write.
2. **Bootstrap lock** (`acquireBootstrapLock`, mkdir, 714-757) — ATOMIC, but only gates build/migration.
3. **PID-lease reprobe** (`writeLeaseFile`+`readLeaseFile`, 948-954) — non-atomic; runs outside the lockHeld branch; decides who `launchServer()`s.
4. **Daemon heartbeat** (`index.ts:46-55`, refresh every `TTL/3`) — self-shutdown when the lease pid no longer matches; the only thing resolving a double-launch, hence the latency window.

### Key Components
- **`writeLeaseFile()` (602-607)**: plain tmp+rename PID-lease write (no O_EXCL) — the fix target.
- **`writeOwnerLeaseFileExclusive` (used at 361/569)**: existing O_EXCL pattern to mirror for Option B.

### Data Flow
Two concurrent launchers → both reclaim stale lease → both pass the bootstrap-lock-loser path → both `writeLeaseFile` → reprobe race can let both `launchServer` → two daemons until a heartbeat tick resolves it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Planning from a deep-review residual finding that touches persistence + concurrency. Two candidate fixes:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `writeLeaseFile()` (602) | Plain tmp+rename PID-lease write | **Option B (preferred): make it O_EXCL** — first writer wins, others get EEXIST → bridge/exit; clear a stale PID lease first (isLeaseHeld already classifies stale at 867) | Two-launcher test asserts a single `launchServer` |
| `writeLeaseFile()` call site (948) | Runs outside `if (lockHeld)` | **Option A (alt): move launch inside `if (lockHeld)`** — only the bootstrap-lock winner launches; loser bridges | Confirm the loser still bridges to the winner's socket (timing-sensitive) |
| `acquireOwnerLeaseFile` reclaim (373-386) | Non-atomic reclaim | Unchanged — redundant once the PID-lease election is atomic (OR-2-01 noted it is already redundant) | n/a |
| Daemon heartbeat (`index.ts:46-55`) | Resolves double-launch reactively | Unchanged — becomes a backstop, not the primary gate | n/a |
| `tests/launcher-lease.vitest.ts` | Lease/launcher concurrency tests | Add a two-launcher reclaim election test (probabilistic detector, like OR-1-01's) | Stable-pass on the fix |

**Recommendation:** Option B — minimal, localized to `writeLeaseFile` + the reprobe, mirrors the existing `writeOwnerLeaseFileExclusive` pattern, and preserves the bootstrap-lock-loser-takes-over behavior. Risk: medium (lease lifecycle + stale handling). Land with operator awareness; no deterministic test (accept a probabilistic detector + the O_EXCL invariant argument).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigation (COMPLETE)
- [x] Trace the 4-layer launch election with exact `file:line` evidence
- [x] Classify severity (P2 benign-transient) and draft fix Options A/B

### Phase 2: Core Implementation (DEFERRED — pending owner decision)
- [ ] Make `writeLeaseFile()` exclusive (O_EXCL), clearing a stale PID lease first (Option B)
- [ ] EEXIST path bridges/exits cleanly so a loser never `launchServer`s
- [ ] Preserve (or intentionally change) the bootstrap-lock-loser take-over behavior

### Phase 3: Verification (DEFERRED)
- [ ] Two-launcher concurrent-reclaim election test; assert a single `launchServer`
- [ ] Full suite green + `launcher-lease` stable across repeated runs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Two-launcher concurrent stale-heartbeat reclaim election | Vitest (`tests/launcher-lease.vitest.ts`, spawns the real launcher) |
| Manual | Repeated runs to gauge determinism (concurrency detectors are probabilistic, per OR-1-01) | node + spawned launchers |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Owner risk-decision (Option A vs B + accept risk) | Internal | Red | Fix cannot land |
| Operator's concurrent launcher WIP (BUG-03/04/06) | Internal | Yellow | Re-base before landing to avoid clobber |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a launcher startup regression after the election change (single launcher fails to launch, or the bridge path breaks).
- **Procedure**: `git revert` the launcher commit. The prior non-atomic election is benign-transient (P2), so reverting restores a known-acceptable state rather than re-opening a corruption risk.
<!-- /ANCHOR:rollback -->
