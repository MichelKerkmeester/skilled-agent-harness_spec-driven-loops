---
title: "Implementation Plan: Measurement & Receipts Foundation"
description: "Add lib/policy-plan.ts beside render.ts: canonical block IDs, privacy-safe content and ordered policy-set hashes, and a delivery-receipt shape, wired shadow-only into all six runtime call sites and proven with byte-stable parity fixtures."
trigger_phrases:
  - "measurement and receipts plan"
  - "shadow planner plan"
  - "policy plan module"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the implementation plan for the shadow planner and parity fixture harness"
    next_safe_action: "Author tasks.md task breakdown matching the three implementation phases"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-001"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Measurement & Receipts Foundation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`system-skill-advisor/mcp-server/lib`) |
| **Framework** | Skill-advisor MCP server + six runtime hook adapters (Claude, Codex, Devin, Cursor, OpenCode, Pi) |
| **Storage** | None persisted by default; shadow receipts are computed values, written to a shadow-only sink only when explicitly enabled |
| **Testing** | Vitest (`tests/policy-plan.vitest.ts`, `tests/parity/policy-plan-serializer-parity.vitest.ts`) |

### Overview
Add `lib/policy-plan.ts` beside `render.ts`, exporting: (1) an ordered block registry with immutable v1 IDs for every stable and dynamic block named in research.md §3 (comment-hygiene, governor, proof-over-appearance, advisor route, Gate question, Pi dispatch, SessionStart, OpenCode continuity, OpenCode compiled route); (2) a pure content-hash function over a single block's rendered text; (3) an ordered policy-set hash function over the full block sequence for one delivery; (4) a delivery-receipt builder producing the seven-field record (shadow ID, planned hash, emitted hash, byte count, lifecycle epoch, transform/message identity, host-receipt status). Wire the planner into each of the six runtime render/hook call sites in shadow-only mode: it runs after the existing path, its result is never consumed by the emitted output, and it is recorded through a dedicated shadow-delta stream (a new stream, not the existing scorer `shadow-deltas.jsonl` in `lib/shadow/shadow-sink.ts`, which serves an unrelated recommendation-scoring comparison). Prove zero output change with byte-stable parity fixtures.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (no canonical block identity/receipt exists; every later reduction needs one)
- [x] Success criteria measurable (byte-diff parity, hash purity adversarial control, receipt schema test)
- [x] Dependencies identified (`render.ts` directive constants, Gate core, Pi dispatch directive, OpenCode plugin bridges - all read, none modified in content)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-006 in `spec.md`)
- [ ] Tests passing (`policy-plan.vitest.ts`, `policy-plan-serializer-parity.vitest.ts`)
- [ ] Docs updated (spec/plan/tasks/checklist/implementation-summary reconciled to the shipped state)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shadow instrumentation: compute-and-compare, never compute-and-replace. The planner is a pure, read-only observer of the existing render/hook paths; it has no write access to the response the runtime host receives.

### Key Components
- **`policy-plan.ts` (new)**: Block registry (immutable v1 IDs), content hasher, ordered policy-set hasher, delivery-receipt builder. Imports `render.ts`'s existing directive constants rather than redefining block text.
- **Six runtime call sites (modified, additive-only)**: `render.ts` (Claude/Codex/Devin-shared path), Cursor's `beforeSubmitPrompt` prebind path, OpenCode's `mk-skill-advisor.js`/`mk-spec-memory.js` transforms, and Pi's `prompt-advisor.ts` - each gains one shadow-only call to the planner after its existing emission logic.
- **Parity fixture harness (new)**: Fixture payloads per runtime x {first, repeat, Gate, read-only, failure}, asserting emitted bytes are unchanged and the planner's receipt matches the expected shape.

### Data Flow
1. A runtime's existing render/hook path executes unchanged and returns its current output.
2. Immediately after, the shadow planner independently reconstructs the same ordered block list from the same inputs (which blocks are present, in what order, for this delivery).
3. The planner computes the content hash per block and the ordered policy-set hash for the whole delivery, and builds the seven-field delivery receipt.
4. The receipt is recorded to a shadow-only sink; it is never merged into, or read back into, the emitted response.
5. The parity harness asserts the real emitted output for each fixture case is byte-identical to the pre-change baseline, and that the receipt fields are structurally valid and free of raw prompt/path/session data.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Inventory the six existing renderer/emitter call sites named in research.md §3's canonical block ownership table
- [ ] Capture the pre-change byte-exact output for representative fixtures across all six runtimes as the negative-control baseline

### Phase 2: Core Implementation
- [ ] Author `policy-plan.ts` with the four named block IDs (`policy.comment-hygiene.v1`, `route.advisor.v1`, `gate.spec-folder-question.v1`, `runtime.pi-dispatch.v1`) plus the remaining inventoried blocks under the same ID scheme
- [ ] Implement the content hash and ordered policy-set hash functions, restricted to block ID + content + order as hash inputs
- [ ] Implement the delivery-receipt type and builder (shadow ID, planned hash, emitted hash, byte count, lifecycle epoch, transform/message identity, host-receipt status)
- [ ] Wire shadow-only planner calls into the six runtime paths without altering any emitted output

### Phase 3: Verification
- [ ] Add planner unit tests for block ID stability, hash-input purity, and receipt shape
- [ ] Add byte-stable parity fixtures per runtime x {first, repeat, Gate, read-only, failure}
- [ ] Add the raw-data-leakage adversarial negative control (prompt containing a path and a session token; assert neither appears in hashed input)
- [ ] Confirm zero output diff across the full fixture matrix against the Phase 1 baseline
- [ ] Run the whole-package typecheck and Vitest suite
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Negative control | Pre-change byte-exact baseline capture, confirmed unchanged post-change | Vitest snapshot/diff |
| Unit | Block ID stability, hash purity, receipt schema | Vitest (`policy-plan.vitest.ts`) |
| Parity | Byte-identical emitted output across six serializers x five case types | Vitest (`policy-plan-serializer-parity.vitest.ts`) |
| Adversarial | Raw prompt/path/session data never present in hashed input | Vitest (`policy-plan.vitest.ts`) |
| Type safety | Whole-package typecheck | `tsc --noEmit` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `render.ts` directive constants (`HYGIENE_DIRECTIVE`, `GOVERNOR_DIRECTIVE`, `TERMINAL_PROOF_DIRECTIVE`, route renderers) | Internal | Green | Planner cannot construct the canonical block content; blocks the whole phase |
| Gate core (`spec-gate-core.mjs::GATE_3_QUESTION`, `classifyIntent`) | Internal | Green | Cannot register `gate.spec-folder-question.v1` content/emission conditions |
| Pi dispatch directive (`prompt-advisor.ts::PI_SUBAGENT_DISPATCH_DIRECTIVE`) | Internal | Green | Cannot register `runtime.pi-dispatch.v1` |
| OpenCode plugin bridges (`mk-skill-advisor.js`, `mk-spec-memory.js`) | Internal | Green | Cannot wire the OpenCode shadow call sites or observe transform/message identity |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any output diff detected in the parity fixtures, any raw prompt/path/session data found in a recorded hash input or receipt, a latency/error regression attributable to the shadow call sites, or any evidence of shadow state leaking into the emitted response.
- **Procedure**: Remove the shadow-only call sites (additive-only, so removal is a pure revert with no downstream consumer to update) and delete any recorded shadow receipts. `render.ts` and the five other runtime paths return to their exact pre-change behavior with no further action required, since nothing in this phase is permitted to be consumed by production output.
<!-- /ANCHOR:rollback -->
