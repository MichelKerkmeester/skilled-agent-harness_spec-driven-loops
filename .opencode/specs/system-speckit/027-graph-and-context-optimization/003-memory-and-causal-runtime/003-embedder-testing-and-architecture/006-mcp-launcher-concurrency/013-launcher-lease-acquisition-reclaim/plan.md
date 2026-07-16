---
title: "Plan: launcher lease acquisition-time reclaim [template:level_1/plan.md]"
description: "Plan to close the acquisition-time stale lease race in the launcher lease table."
trigger_phrases:
  - "launcher lease acquisition reclaim"
  - "stale lease CAS"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/013-launcher-lease-acquisition-reclaim"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Authored implementation plan stub"
    next_safe_action: "Implement atomic acquisition reclaim and race regression"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: launcher lease acquisition-time reclaim

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Move the reclaim guarantee to the acquisition path, where contention actually happens, and prove it with a two-contender stale-row regression.

| Phase | Focus | Output |
|-------|-------|--------|
| A | Confirm predecessor evidence and target files | Implementation starts from the cited source lines and current code |
| B | Implement scoped changes | Source and tests updated only for this packet's requirements |
| C | Run focused verification | Unit/integration/perf evidence captured in the packet |
| D | Closeout | Strict-validate packet and update implementation summary |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- All P0 requirements in `spec.md` have direct test or command evidence.
- The focused test command for this packet exits 0.
- No production data, runtime DB, or operator-local config is changed without an explicit operator step.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/013-launcher-lease-acquisition-reclaim --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The acquisition transaction should read the incumbent row, evaluate staleness and PID liveness, then update only if the row still matches the observed incumbent fields. If process liveness cannot be embedded in SQL, the CAS predicate should include owner_id, pid, and heartbeat_at from the observed row, followed by a verification read.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A - Discovery

1. Re-read predecessor packet and source files named in `spec.md`.
2. Confirm current line numbers before editing.
3. Identify the smallest test surface that proves the change.

### Phase B - Implementation

1. Refactor `acquireSkillGraphLease()` around the reserve transaction.
2. Add CAS-style update predicate or documented fallback.
3. Add the two-contender stale lease regression.
4. Preserve EPERM/live-owner behavior.

### Phase C - Verification

1. Run daemon lease vitest suite.
2. Run launcher concurrency tests if separate.
3. Run strict-validate on the packet.

### Phase D - Closeout

1. Update `implementation-summary.md` from PRE-IMPLEMENTATION to the actual result.
2. Run strict validation on this packet.
3. Preserve any operator-side blockers in the summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Targeted vitest for lease acquisition/reclaim.
- Regression that simulates two contenders without relying on timing sleeps.
- Existing `isLeaseHeld()` tests for ESRCH/EPERM behavior.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts` current transaction shape.
- Existing daemon lease test harness.
- SQLite behavior under the repo test runner.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

1. Restore prior `acquireSkillGraphLease()` transaction.
2. Remove the new race regression.
3. Keep phase 011 operational recipe as fallback until a safer implementation lands.
<!-- /ANCHOR:rollback -->
