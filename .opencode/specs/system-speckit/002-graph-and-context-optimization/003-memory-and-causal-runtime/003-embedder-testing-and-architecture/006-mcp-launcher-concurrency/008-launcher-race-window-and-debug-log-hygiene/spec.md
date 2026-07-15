---
title: "Launcher Race-Window Tightening + Debug-Log Hygiene"
description: "Closes 2 P2 findings from 007 deep-review: move skill-advisor PID guard write inside the bootstrap-lock critical section, and gate verbose error/path logging behind MK_SKILL_ADVISOR_DEBUG."
trigger_phrases:
  - "008 race window debug log hygiene"
  - "skill-advisor debug log gate"
  - "MK_SKILL_ADVISOR_DEBUG"
  - "PID guard inside bootstrap lock"
importance_tier: "useful"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/008-launcher-race-window-and-debug-log-hygiene"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented Phase 008 P2 closeout"
    next_safe_action: "Commit + push on main"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-launcher-race-window-and-debug-log-hygiene"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "P2-1 fix approach: move PID guard write inside if (lockHeld) block"
      - "P2-2 fix approach: add debug() helper gated by MK_SKILL_ADVISOR_DEBUG env"
---
# Launcher Race-Window Tightening + Debug-Log Hygiene

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-18 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Arc** | 006-mcp-launcher-concurrency |
| **Predecessor** | 007-skill-advisor-zombie-launcher-fix |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The 10-iter SWE-1.6 deep-review on 007 returned verdict PASS with 2 P2 findings on `.opencode/bin/mk-skill-advisor-launcher.cjs`. Both are polish items in the 007 fix that landed in commit `65761c8fb`:

- **P2-1 (correctness; iter-001)**: the PID guard write sits outside the `if (lockHeld)` block. The bootstrap-lock critical section visually ends at the closing brace before the PID guard write. A reviewer reading the code sees an apparent race window where two launchers could race to write their PID guards.
- **P2-2 (security; iter-002)**: four `log(...)` call sites emit error stacks, error messages, and the resolved DB path to stderr unconditionally. In operator-visible deployments this leaks implementation details that are only useful while debugging.

Neither finding is a defect that produces observable misbehavior. Both improve clarity and operational hygiene.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Files to Change

| File | Why | Change |
|------|-----|--------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Skill-advisor launcher; both P2s live here | Move PID guard write + reprobe inside `if (lockHeld)` block (P2-1); add `debug()` helper gated on `MK_SKILL_ADVISOR_DEBUG=1` and route 4 stack/path log sites through it (P2-2) |

### Out of Scope

- Code-graph and spec-memory launchers (no analogous race window — their PID guard logic already lives inside their bootstrap-lock critical section).
- Daemon SQLite lease code in `lease.ts` (untouched; 007 already verified it needs no changes).
- New tests (the 11 existing launcher-lease vitest cases continue to cover the lock+lease behavior).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### REQ-001: PID guard write under bootstrap lock

- **What**: `writeLeaseFile()` + `readLeaseFile()` reprobe + early-return on contention all execute inside the `if (lockHeld)` block, so the entire single-writer acquisition runs serialized on the bootstrap lock.
- **Acceptance**: source inspection of `mk-skill-advisor-launcher.cjs` `main()` shows `writeLeaseFile()` after the `writeState(...)` call and before the `if (lockHeld)` closing brace.
- **Verification**: 11 launcher-lease vitest cases continue to PASS unchanged.

### REQ-002: Debug-log gate

- **What**: a new `debug(message)` helper writes to stderr only when `process.env.MK_SKILL_ADVISOR_DEBUG === '1'`. Four `log()` sites previously emitting stacks or paths route through `debug()`. Operator-relevant events keep using `log()`.
- **Acceptance**: default operator stderr no longer contains the resolved DB absolute path, exception stack traces, or `lease check failed:` debug messages. Running the launcher with `MK_SKILL_ADVISOR_DEBUG=1` restores the previous verbose output.
- **Verification**: 21 launcher tests continue to PASS (existing assertions never depended on the suppressed lines).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --check .opencode/bin/mk-skill-advisor-launcher.cjs` exits 0.
- **SC-002**: `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` exits 0.
- **SC-003**: `npx vitest --run launcher-lease launcher-bootstrap` reports 21 tests PASS, 0 failures.
- **SC-004**: `validate.sh <abs 008 path> --strict` returns `RESULT: PASSED`.
- **SC-005**: a single commit lands on `main` containing only the 008 packet docs and the `mk-skill-advisor-launcher.cjs` edits (no drive-by changes to parallel-work files).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Existing tests assume stderr contains the suppressed lines | low | tests would fail | Vitest run on the changed code: 21/21 PASS, no test depended on those lines. |
| `MK_SKILL_ADVISOR_DEBUG` env name collides with an existing variable | very low | unexpected debug output during normal runs | grep across repo confirms the name is unique to this packet. |
| Moving `writeLeaseFile()` inside `if (lockHeld)` changes behavior when `acquireBootstrapLock()` returns false | none under current semantics | no observable change | `acquireBootstrapLock()` always returns true or throws; the `if (lockHeld)` gate is purely defensive. |

**Dependencies**: none new. This packet only touches files already present in arc 006.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Both P2s have clear implementations, and the predecessor packet (007) supplies the source findings with file:line evidence.
<!-- /ANCHOR:questions -->
