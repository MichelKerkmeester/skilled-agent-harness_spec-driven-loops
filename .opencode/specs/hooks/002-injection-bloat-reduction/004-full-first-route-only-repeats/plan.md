---
title: "Implementation Plan: Full-First + Route-Only Repeats"
description: "Add a delivery-state machine (UNSEEN -> DELIVERED -> SUPPRESSED_SAME) with dirty-marking and epoch advancement, shadow-first behind an independent flag, gated on seven named behavioral negative controls before any activation."
trigger_phrases:
  - "full first route only repeats plan"
  - "delivery state machine implementation"
importance_tier: "critical"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/004-full-first-route-only-repeats"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the implementation plan for the delivery-state machine and negative controls"
    next_safe_action: "Author tasks.md task breakdown matching the three implementation phases"
    blockers:
      - "Blocked on phases 001-003 shipping receipts, bounding, and dedup first"
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Full-First + Route-Only Repeats

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`system-skill-advisor/mcp-server/lib`) + JavaScript (OpenCode plugin) |
| **Framework** | Skill-advisor MCP server + Claude-derived hook adapters + OpenCode plugin bridge |
| **Storage** | In-process delivery-state map keyed by confirmed session identity + block ID + epoch; no cross-process persistence in this phase |
| **Testing** | Vitest (`policy-plan.vitest.ts`, `policy-plan-negative-controls.vitest.ts`) |

### Overview
Extend phase 001's `policy-plan.ts` registry with a delivery-state machine: `UNSEEN` -> `DELIVERED(hash, epoch)` -> `SUPPRESSED_SAME`. A block moves from `UNSEEN` to `DELIVERED` on its first confirmed delivery in an epoch (per phase 001's host-receipt fields). A later request for the same block, in the same epoch, with the same content hash, is `SUPPRESSED_SAME` and eligible for route-only (~43 B) rendering. Any semantic content change immediately marks the block dirty (back to deliverable, full policy). Any lifecycle event (SessionStart source, compaction, resume), scope/policy/goal change advances the epoch, resetting every block for that session to `UNSEEN`. State is keyed by a confirmed session identity; if identity cannot be confirmed, the session is treated as unknown and always receives full delivery - no fallback to a shared or guessed key. `render.ts` gains a route-only rendering branch selected only when the state machine reports `SUPPRESSED_SAME`, but this branch runs shadow-only (computed and logged, never consumed by the emitted response) until the negative-control suite in `policy-plan-negative-controls.vitest.ts` passes for every named case. Legacy full-policy renderers remain the sole active path throughout this phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (repeat-turn full-policy cost; rank-4 candidate; shadow/eval-only until behavioral proof)
- [x] Success criteria measurable (modeled scenario reproduction in shadow, seven-case negative-control pass, dirty/epoch fixtures)
- [x] Dependencies identified (phases 001-003 are hard preconditions, named explicitly)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-007 in `spec.md`)
- [ ] Tests passing (`policy-plan.vitest.ts` state-machine extensions, `policy-plan-negative-controls.vitest.ts` full suite)
- [ ] Docs updated (spec/plan/tasks/checklist/implementation-summary reconciled to the shipped state)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Explicit finite-state machine per (session identity, block ID, epoch), consumed by a shadow-first rendering branch. The state machine and the rendering branch are decoupled: the state machine can be fully exercised and proven in shadow before any renderer consumes its output.

### Key Components
- **Delivery-state machine (`policy-plan.ts`, extended)**: `UNSEEN` / `DELIVERED(hash, epoch)` / `SUPPRESSED_SAME` per (session, blockId); transition functions for delivery confirmation, dirty-marking, and epoch advancement.
- **Epoch resolver (`policy-plan.ts`, new)**: Maps lifecycle/compaction/scope/policy/goal signals to an epoch value; any qualifying signal advances the epoch and resets state for that session.
- **Route-only renderer (`render.ts`, new, shadow-first)**: Produces the ~43 B route-only payload when the state machine reports `SUPPRESSED_SAME`; not wired into the consumed response path until activation (out of scope for this phase, owned by phase 007).
- **Negative-control suite (`policy-plan-negative-controls.vitest.ts`, new)**: Exercises long-context, advisor-failure, no-match, comment-writing, completion-proof, resume, and compaction cases against the shadow path.

### Data Flow
1. A runtime's existing render/hook path resolves (or fails to resolve) a confirmed session identity.
2. The epoch resolver checks for any qualifying lifecycle/compaction/scope/policy/goal signal since the last known epoch for that session; if found, it advances the epoch and resets state.
3. For each candidate block, the state machine looks up `(session, blockId, epoch)`: `UNSEEN` -> deliver full, transition to `DELIVERED(hash, epoch)` on confirmed receipt; `DELIVERED` with matching hash and epoch -> eligible for `SUPPRESSED_SAME`; any hash mismatch -> dirty, deliver full again.
4. The shadow route-only renderer computes what a `SUPPRESSED_SAME` response would look like and logs it; the legacy full-policy renderer is what the runtime actually receives, unchanged, throughout this phase.
5. The negative-control suite runs the shadow path against seven named adversarial cases and asserts the emitted (legacy) response is unaffected in every one.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phases 001, 002, and 003 are shipped and green (hard precondition)
- [ ] Reproduce research.md's 10-turn representative scenario (`N=10, g=3, c=0, r=1`) as a fixture baseline to validate the shadow state machine's modeled savings against

### Phase 2: Core Implementation
- [ ] Implement the delivery-state machine (`UNSEEN`/`DELIVERED`/`SUPPRESSED_SAME`) in `policy-plan.ts`
- [ ] Implement the epoch resolver mapping lifecycle/compaction/scope/policy/goal signals to epoch advancement
- [ ] Implement dirty-marking on semantic content-hash change
- [ ] Implement the confirmed-session-identity requirement; unknown sessions never share or read state
- [ ] Implement the shadow-first route-only renderer in `render.ts` (not consumed by the emitted response)
- [ ] Wire lifecycle/session-identity signals from `user-prompt-submit.ts` (Claude/Codex/Devin) and `mk-skill-advisor.js` (OpenCode component) into the state machine

### Phase 3: Verification
- [ ] Add state-machine transition tests: first delivery, same-epoch repeat, dirty content, epoch advance
- [ ] Add the unknown-session-isolation fixture
- [ ] Author and pass all seven behavioral negative controls: long-context, advisor failure, no-match, comment-writing, completion-proof, resume, compaction
- [ ] Reproduce research.md's modeled 82.2% reduction in shadow logs for the 10-turn scenario without changing any emitted response
- [ ] Confirm legacy renderers remain byte-identical to the pre-phase-004 baseline for every fixture without an explicit activation flag
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | State-machine transitions, epoch resolution, dirty-marking | Vitest (`policy-plan.vitest.ts`) |
| Negative control (behavioral) | Long-context, advisor failure, no-match, comment-writing, completion-proof, resume, compaction | Vitest (`policy-plan-negative-controls.vitest.ts`) |
| Isolation | Unknown/unresolved session identity never shares state | Vitest (`policy-plan.vitest.ts`) |
| Parity | Legacy renderer output byte-identical with no activation flag set | Vitest (`policy-plan.vitest.ts`) |
| Scenario reproduction | Shadow-computed savings match research.md's modeled formula | Vitest (`policy-plan.vitest.ts`) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase `001-measurement-and-receipts-foundation` (block IDs, hashes, receipts) | Internal | Blocked until 001 ships | No content hash or receipt to drive `DELIVERED`/dirty transitions |
| Phase `002-opencode-route-line-bounding` (`runtime.opencode-compiled-route.v1`) | Internal | Blocked until 002 ships | OpenCode component's route-only rendering has no stable block identity to key state on |
| Phase `003-opencode-transform-dedup` (stable message identity) | Internal | Blocked until 003 ships | OpenCode component's session/message identity is unstable, undermining epoch and session-isolation guarantees |
| `user-prompt-submit.ts` / `mk-skill-advisor.js` lifecycle signals | Internal | Green | Cannot resolve epoch-advancing events |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any negative-control case fails, a dirty-marking or epoch-advancement fixture shows a missed reset, an unknown session is found sharing state, or the shadow-modeled savings diverge from research.md's formula in a way that suggests a state-machine defect.
- **Procedure**: This phase's route-only path is shadow-only and never consumed by production output, so rollback is deleting the shadow computation and its call sites; the legacy renderer path requires no restoration since it was never replaced. If a later phase-007 activation is already live when a regression is found, that phase's own rollback plan (disable its activation flag, clear delivery state, return to full baseline emission per research.md §11) governs instead.
<!-- /ANCHOR:rollback -->
