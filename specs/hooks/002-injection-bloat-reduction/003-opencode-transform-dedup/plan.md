---
title: "Implementation Plan: OpenCode Transform Dedup"
description: "Add a shared stable-message-identity resolver consumed by mk-skill-advisor.js and mk-spec-memory.js, suppress genuine same-message duplicate blocks, and record multi-transform receipts, gated on phase 001 and an independent flag."
trigger_phrases:
  - "transform dedup plan"
  - "message identity resolver plan"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/003-opencode-transform-dedup"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the implementation plan for the message-identity resolver and dedup gate"
    next_safe_action: "Author tasks.md task breakdown matching the three implementation phases"
    blockers:
      - "Blocked on phase 001 shipping stable message identity and multi-transform receipts"
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/plugins/mk-spec-memory.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: OpenCode Transform Dedup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (OpenCode plugins, ESM) |
| **Framework** | OpenCode `experimental.chat.system.transform` plugin contract |
| **Storage** | In-process dedup state keyed by resolved message identity; no persistent database |
| **Testing** | Node test runner via `.opencode/plugins/tests/mk-skill-advisor.test.cjs` and `mk-spec-memory.test.cjs` |

### Overview
Add `.opencode/plugins/lib/opencode-message-identity.js`, a shared module exporting a resolver that builds a stable message identity from session ID, message/turn ID, and a transform-call ordinal - never from prompt text - plus an in-process dedup-state tracker keyed by that identity. `mk-skill-advisor.js` and `mk-spec-memory.js` each call the resolver before appending to `output.system`; if a block with the same phase-001 canonical ID and content hash was already recorded as delivered for this exact message identity, the second contribution is suppressed and the suppression is recorded in a multi-transform receipt. If identity cannot be resolved, dedup no-ops and both transforms deliver in full (fail-open). The dedup path itself only activates behind an independent flag that MUST stay off until phase 001's stable identity and multi-transform receipt infrastructure exists and is verified green.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (independent transforms can duplicate a block for the same message; naive content-hash dedup is an eliminated alternative)
- [x] Success criteria measurable (suppression on genuine duplicate, full delivery on distinct-identical-text, flag-off parity)
- [x] Dependencies identified (phase 001's stable message identity and multi-transform receipts are a hard precondition, not a nice-to-have)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-006 in `spec.md`)
- [ ] Tests passing (`mk-skill-advisor.test.cjs`, `mk-spec-memory.test.cjs` dedup cases)
- [ ] Docs updated (spec/plan/tasks/checklist/implementation-summary reconciled to the shipped state)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared identity-and-dedup module consumed by two independent transform handlers: neither plugin owns the dedup decision alone, so a genuine cross-plugin duplicate (advisor block delivered by both) can be detected and suppressed without either plugin knowing about the other's internals.

### Key Components
- **`opencode-message-identity.js` (new)**: `resolveMessageIdentity(input)` builds the stable identity; `checkAndRegisterDelivery(identity, blockId, contentHash)` returns whether this exact block was already delivered for this identity, and records the delivery if not.
- **`mk-skill-advisor.js` (modified)**: Calls the resolver before pushing to `output.system`; suppresses a duplicate advisor/directive block, always delivers on resolution failure.
- **`mk-spec-memory.js` (modified)**: Same pattern for the continuity brief transform (`appendContinuityBrief`).
- **Multi-transform receipt (extends phase 001's receipt shape)**: Per message identity, an ordered list of `{transform, blockId, outcome: 'delivered' | 'suppressed_duplicate'}`.

### Data Flow
1. An OpenCode transform handler (`mk-skill-advisor.js` or `mk-spec-memory.js`) fires for a user message.
2. It calls `resolveMessageIdentity` with the available session/message/turn data; on failure, dedup no-ops for this call.
3. On success, it calls `checkAndRegisterDelivery` with the block's phase-001 canonical ID and content hash.
4. If this is the first delivery for that identity+block, the block is appended and the delivery is registered; if it is a duplicate, the block is suppressed and the suppression is recorded.
5. The multi-transform receipt for that message identity accumulates every transform's outcome, available for audit and for the parity/negative-control fixtures.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 001's stable message identity and multi-transform receipt infrastructure is shipped and green (hard precondition, not schedule-only)
- [ ] Inventory both transform call sites' available session/message/turn fields to design the identity resolver

### Phase 2: Core Implementation
- [ ] Create `opencode-message-identity.js` with `resolveMessageIdentity` and `checkAndRegisterDelivery`
- [ ] Wire the resolver and dedup check into `mk-skill-advisor.js`'s system-transform path, behind the independent flag
- [ ] Wire the resolver and dedup check into `mk-spec-memory.js`'s `appendContinuityBrief` path, behind the same flag
- [ ] Extend the multi-transform receipt to record per-message-identity delivery/suppression outcomes

### Phase 3: Verification
- [ ] Add a same-message duplicate fixture (two transforms, one resolved identity) proving suppression of the second
- [ ] Add a distinct-message-identical-text fixture proving both messages receive full delivery
- [ ] Add an identity-resolution-failure fixture proving fail-open (no suppression) when identity cannot be resolved
- [ ] Add a flag-off parity fixture proving byte-identical output to the pre-change baseline
- [ ] Run both plugin test suites and confirm no regression in existing cases
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Identity resolution, dedup-state tracking, fail-open on unresolved identity | Node test runner |
| Regression | Same-message duplicate suppressed; distinct-identical-text not suppressed | Node test runner (`mk-skill-advisor.test.cjs`, `mk-spec-memory.test.cjs`) |
| Parity | Flag-off output byte-identical to pre-change baseline | Node test runner |
| Adversarial | Missing/malformed identity fields never cause suppression | Node test runner |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase `001-measurement-and-receipts-foundation` (stable message identity, multi-transform receipts) | Internal | Blocked until 001 ships | This phase cannot begin implementation; dedup with no identity/receipt infrastructure repeats the eliminated content-hash-alone approach |
| Phase `002-opencode-route-line-bounding`'s `runtime.opencode-compiled-route.v1` registry entry | Internal | Green once 002 ships | Not a hard blocker; this phase's dedup logic is block-ID-generic and works with any phase-001-registered block |
| `mk-skill-advisor.js` / `mk-spec-memory.js` transform call sites | Internal | Green | Nothing to wire the resolver into |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fixture shows a distinct repeated user message (identical text) suppressed instead of delivered, identity resolution failure causes suppression instead of fail-open delivery, or flag-off parity diverges from baseline.
- **Procedure**: Disable the independent dedup flag (default-off already covers most deployments) and revert the resolver wiring in `mk-skill-advisor.js` and `mk-spec-memory.js`; `opencode-message-identity.js` can remain unused on disk with no behavioral effect once its call sites are reverted.
<!-- /ANCHOR:rollback -->
