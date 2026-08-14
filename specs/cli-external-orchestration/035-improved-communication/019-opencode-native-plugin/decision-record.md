---
title: "Decision Record: Phase 019 OpenCode Native Plugin"
description: "Architecture decisions for Phase 019: adopt the native chat.message hook as the integration seam and hold the canonical original parts in message-id keyed plugin state for byte-exact restore."
trigger_phrases:
  - "opencode-native-plugin"
  - "architecture decision"
  - "chat.message hook seam and message-id snapshot"
  - "mk-communication-projection decisions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/019-opencode-native-plugin"
    last_updated_at: "2026-08-14T07:55:00.000Z"
    last_updated_by: "claude"
    recent_action: "Implemented and verified the OpenCode native projection plugin."
    next_safe_action: "Run the live chat.message render confirmation as the documented manual validation step."
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-019-opencode-plugin-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The plugin is built, its tests pass, and the packet validates cleanly."
---
# Decision Record: Phase 019 OpenCode Native Plugin

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Adopt the native chat.message hook as the integration seam

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Operator and runtime integrator; acceptance follows the pre-implementation display-caveat confirmation |

---

<!-- ANCHOR:adr-001-context -->
### Context

OpenCode is the only supported runtime with a native output-transform hook. The projection core exists but no runtime consumes it, so the enablement flag gates nothing end-to-end. The seam must prove the whole projection on a real runtime before the wrapper-based runtimes follow.

### Constraints

- The hook must be gated by `isProjectionEnabled()` AND the shared `isHookEnabled(concern)` kill-switch.
- Any error or disabled state must leave the original parts untouched.
- The Phase 017 `chat.message` display caveat must be confirmed before authoring the hook.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: register the native `chat.message` hook from `.opencode/plugins/mk-communication-projection.js` and gate projection behind both the enablement flag and the shared kill-switch, calling the Phase 018 `projectMessage()` entrypoint for every accepted message.

**How it works**: the plugin factory returns a hook registry. The `chat.message` hook first checks `isProjectionEnabled()` and `isHookEnabled(concern)`. When both pass, it snapshots the original `output.parts`, calls `projectMessage()`, and replaces the parts with the projection only on an accept terminal. Every other outcome restores the byte-exact original.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Native `chat.message` hook | Only native output-transform seam; proves the projection on a real runtime | Requires live confirmation of the Phase 017 display caveat | 9/10 |
| Wrapper seam (Claude/Codex/Pi/Devin/Cursor style) | No runtime-specific hook research | No native transform; does not prove the projection first | 5/10 |
| Pure overlay without snapshot | Simpler mutation | Loses the original parts and breaks byte-exact restore | 2/10 |

**Why this one**: the native hook is the only seam that proves the whole projection before the wrapper-based runtimes, and the message-id snapshot keeps the exact-original fallback honest.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- The projection core runs end-to-end on the first real runtime.
- The exact-original fallback and byte-exact restore hold because the original parts stay in plugin-side state.

**What it costs**:

- A live session is required to confirm the display caveat. Mitigation: the confirmation is an explicit pre-implementation task.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The hook throws into the session. | High | Outer fail-open guard restores the original parts and never throws. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | No runtime consumes the projection core; the native hook is the only seam that proves it first. |
| 2 | Beyond local maxima? | PASS | Native hook, wrapper seam, and pure overlay were compared. |
| 3 | Sufficient? | PASS | One plugin, one hook, a snapshot map, and the Phase 018 entrypoint are the smallest complete design. |
| 4 | Fits goal? | PASS | With the flag on the session projects; off or failed it restores byte-exact. |
| 5 | Open horizons? | PASS | The snapshot model generalizes to the wrapper-based phases. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `.opencode/plugins/mk-communication-projection.js`: plugin factory, `chat.message` hook, dual gate, message-id snapshot, and `projectMessage()` call.
- `.opencode/plugins/tests/mk-communication-projection.test.cjs`: gate matrix, restore, snapshot-lifecycle, and boundary coverage.

**How to roll back**: remove the plugin and its test file, restore any session messages touched during the attempt, and rerun the plugin suite.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Hold the canonical original parts in message-id keyed plugin state

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Operator and privacy owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

The `chat.message` hook mutates the stored session message, not a pure display overlay. Projection must be reversible byte-exactly: with the flag off or on any failure the session must show the original. Without a snapshot, the mutation would destroy the only copy of the canonical parts.

### Constraints

- The original parts must remain recoverable after the stored message is mutated.
- Snapshot state must be bounded and cleared with the message lifecycle.
- No message content may be persisted beyond in-memory plugin-side state.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We propose**: keep the canonical original `output.parts` in a plugin-side map keyed by message id, snapshot before any mutation, and restore from that map on every non-accept terminal, disable, or later re-render.

**How it works**: the hook snapshots the original parts under the message id before calling `projectMessage()`. On an accept terminal the stored session message holds the projection; on any other outcome the parts are restored from the snapshot. A missing snapshot or a double invoke resolves to the untouched original.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Message-id keyed in-memory snapshot | Byte-exact restore, bounded, no persistence | Requires snapshot lifecycle discipline | 9/10 |
| Pure overlay without mutation | No stored-message mutation | Breaks the stored-session-message contract and the exact-original fallback | 2/10 |
| Reconstruct the original from canonical transcripts | No plugin state | Couples restore to transcript replay and adds latency | 5/10 |

**Why this one**: the snapshot is the smallest design that keeps the original recoverable after the stored message is mutated, and it stays fully in memory.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- Byte-exact restore holds for every disable, error, and re-render path.
- The stored session message is mutated as OpenCode expects, not layered over.

**What it costs**:

- Plugin-side memory grows with the number of live message ids. Mitigation: snapshots are cleared with the session message lifecycle.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A snapshot leaks after the message is gone. | Low | Clear snapshots with the message lifecycle and bound the map. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | The stored message is mutated, so the original must be held elsewhere. |
| 2 | Beyond local maxima? | PASS | Snapshot, pure overlay, and transcript replay were compared. |
| 3 | Sufficient? | PASS | A message-id map with lifecycle cleanup is the smallest reversible design. |
| 4 | Fits goal? | PASS | Every disable or failure path restores the byte-exact original. |
| 5 | Open horizons? | PASS | The same snapshot model serves the wrapper-based phases. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:

- `.opencode/plugins/mk-communication-projection.js`: a message-id keyed in-memory map holding the original parts, snapshot before mutation, and restore on every non-accept path.
- `.opencode/plugins/tests/mk-communication-projection.test.cjs`: snapshot, restore, double-invoke, missing-snapshot, and lifecycle coverage.

**How to roll back**: remove the plugin file and test file; the snapshot map disappears with the module.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
