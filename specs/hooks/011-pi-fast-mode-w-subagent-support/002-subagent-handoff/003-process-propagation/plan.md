---
title: "Implementation Plan: Phase 3 process-propagation"
description: "Add a deterministic child-process fixture and document one-directional handoff behavior."
trigger_phrases:
  - "process-propagation plan"
  - "child process environment test"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/002-subagent-handoff/003-process-propagation"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Planned child process propagation"
    next_safe_action: "Implement fixture and isolation assertions"
    blockers: []
    key_files: ["../../research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: Phase 3 process-propagation

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and Node child process |
| **Framework** | Vitest |
| **Storage** | Copied process environment |
| **Testing** | Spawn fixture and parent/child assertions |

### Overview
Launch a child fixture via `spawnSync(process.execPath, [fixturePath], { env: { ...process.env, PI_FAST_MODE_W_SUBAGENT_SUPPORT: "1" } })` and have its stdout report the value the child observed. Assert the child reads exactly the parent-set `"1"`/`"0"`, and that a child-local env write does not change the parent process env. Use the result to document the handoff contract.


<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Precedence child defines the normalized value and timing.
- [x] Research confirms ordinary process inheritance.

### Definition of Done
- [ ] Fixture covers `1`, `0`, invalid, and unset.
- [ ] Parent isolation is asserted.
- [ ] README wording matches the final precedence decision.


<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic process boundary test.

### Key Components
- Child fixture (`tests/fixtures/handoff-child.ts`): launched via `spawnSync(process.execPath, [fixturePath], { env: { ...process.env, PI_FAST_MODE_W_SUBAGENT_SUPPORT: "1" } })`; reads the inherited `PI_FAST_MODE_W_SUBAGENT_SUPPORT`, prints the observed value to stdout, then performs a child-local env write. Authored so `003-integration-and-tests` can reuse it for the live probe.
- Test harness (`tests/propagation.test.ts`): passes a copied env, captures stdout/exit code, and asserts strict `"1"`/`"0"` observation plus parent isolation.
- README: user-facing contract and limitations.

### Data Flow
Parent env snapshot → child spawn → strict read → child-local mutation → parent remains unchanged.


<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `tests/fixtures/handoff-child.ts` (new) | Child that reads and rewrites its local env | Add spawn fixture reporting the observed value | Child stdout echoes the parent-set `"1"`/`"0"` |
| `tests/propagation.test.ts` (new) | Inheritance + isolation assertions | Add cases for `"1"`/`"0"`/invalid/unset and parent isolation | Vitest green; parent env unchanged after child write |
| README handoff section | User-facing handoff contract | Document strict values, precedence, one-directional rule | `rg` cross-check vs implementation |

<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Choose fixture location and output shape.

### Phase 2: Core Implementation
- [ ] Add the fixture and spawn helper.
- [ ] Add tests for inheritance and isolation.
- [ ] Update README handoff section.

### Phase 3: Verification
- [ ] Run child-process tests and typecheck.
- [ ] Pass the receipt to integration for the live probe.


<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Process | Exact env inheritance | Node `spawnSync` |
| Unit | Invalid/unset child behavior | Vitest |
| Static | README/code contract consistency | `rg` |


<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-session-precedence/` | Internal | Green | Child sees no defined state |
| Node child process API | Runtime | Green | No deterministic proof |


<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Fixture is nondeterministic or proves the wrong env boundary.
- **Procedure**: Remove the fixture/docs changes and rerun the lifecycle suite; defer only the live probe, not the contract test.
<!-- /ANCHOR:rollback -->
