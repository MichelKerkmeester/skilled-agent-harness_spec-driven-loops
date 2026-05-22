---
title: "Plan: Owner-Lease Heartbeat-Staleness Detection"
description: "Implementation plan for Owner-Lease Heartbeat-Staleness Detection."
trigger_phrases:
  - "owner-lease-heartbeat-staleness-detection"
  - "010 follow-on 3"
  - "phase 007 owner-lease gap"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-memory-leak-follow-ons-arc/003-owner-lease-heartbeat-staleness-detection"
    last_updated_at: "2026-05-22T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded follow-on phase."
    next_safe_action: "Plan and execute this phase when ready."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0a03030303030303030303030303030303030303030303030303030303030303"
      session_id: "010-memory-leak-follow-ons-arc-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Gap discovered during arc 009 closure when mk_code_index MCP reconnect failed with -32000 against a live orphan launcher whose heartbeat was 22 minutes stale against a 60-second TTL."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Owner-Lease Heartbeat-Staleness Detection

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js process ownership |
| **Framework** | system-code-graph MCP launcher and owner lease |
| **Storage** | Owner lease file and heartbeat metadata |
| **Testing** | Targeted owner-lease Vitest and reconnect verification |

### Overview
This phase is scaffolded for follow-on planning. It will extend owner-lease classification so a live-PID owner with a stale heartbeat can be reclaimed instead of blocking legitimate MCP reconnect.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Read the phase spec and arc 009 phase 007 implementation summary.
- [ ] Read current owner-lease and launcher behavior before edits.
- [ ] Confirm heartbeat refresh expectations for healthy owners.

### Definition of Done
- [ ] `stale-heartbeat-reclaim` is represented in classification and reclaim flow.
- [ ] Healthy owners are not misclassified as stale.
- [ ] Reconnect behavior is verified or explicitly documented.
- [ ] This phase and parent arc strict validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Scaffold Contract
The implementation plan is intentionally generic at scaffold time. The executing agent should replace this section with the concrete owner-lease design after reading the current classifier, launcher, heartbeat refresh path, and relevant tests.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts` | Owner classification and lease state | Add stale-heartbeat reclaim classification | Targeted owner-lease Vitest |
| `.opencode/bin/mk-code-index-launcher.cjs` | Launcher lease consumer | Treat stale-heartbeat reclaim as eligible to proceed | Reconnect or launcher verification |
| `.opencode/skills/system-code-graph/mcp_server/tests/lib/owner-lease.vitest.ts` | Lease unit coverage | Add stale-heartbeat and healthy heartbeat fixtures | Targeted Vitest |
| `implementation-summary.md` | Phase evidence ledger | Record decisions, tests, and reconnect evidence | Strict spec validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the child spec and source phase 007 evidence.
- [ ] Read owner-lease, launcher, and heartbeat refresh code.
- [ ] Replace scaffold placeholders with a concrete execution plan.

### Phase 2: Implementation
- [ ] Add `stale-heartbeat-reclaim` classification.
- [ ] Wire reclaim eligibility through existing atomic lease replacement.
- [ ] Verify or add healthy heartbeat refresh.
- [ ] Add focused stale and healthy heartbeat tests.

### Phase 3: Verification
- [ ] Run targeted owner-lease verification.
- [ ] Run reconnect verification where available.
- [ ] Update `implementation-summary.md` and strict-validate this phase and the parent arc.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Stale heartbeat classification | `owner-lease.vitest.ts` |
| Unit | Healthy heartbeat remains live | `owner-lease.vitest.ts` |
| Integration | Launcher reclaim and reconnect path | Phase-selected command or manual operator check |
| Documentation | Phase and parent validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Arc 009 phase 007 implementation summary | Source evidence | Available | Required to recover the reconnect gap and owner-lease baseline. |
| Existing owner-lease classifier | Implementation target | Pending phase execution | Required for stale-heartbeat classification. |
| Heartbeat refresh path | Runtime behavior | Pending phase execution | Required to avoid false reclaim of healthy owners. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Healthy owners are reclaimed incorrectly, reconnect remains blocked, or owner-lease tests regress.
- **Procedure**: Revert only this phase's owner-lease, launcher, test, and documentation changes, preserve lease/reconnect evidence, and replan the classifier rule.
<!-- /ANCHOR:rollback -->
