---
title: "Implementation Plan: Phase 019 OpenCode Native Plugin"
description: "Wire the first working runtime by authoring an OpenCode plugin that registers the chat.message hook, gates projection behind the enablement flag and the shared kill-switch, and holds the byte-exact original for restore."
trigger_phrases:
  - "opencode-native-plugin"
  - "implementation plan"
  - "chat.message hook projection plan"
  - "mk-communication-projection plugin plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/019-opencode-native-plugin"
    last_updated_at: "2026-08-14T07:55:00.000Z"
    last_updated_by: "claude"
    recent_action: "Implemented and verified the OpenCode native projection plugin."
    next_safe_action: "Run the live chat.message render confirmation as the documented manual validation step."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 019 OpenCode Native Plugin

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CJS) OpenCode plugin plus Node built-in test runner |
| **Framework** | OpenCode plugin API with the `chat.message` hook |
| **Storage** | In-memory plugin-side map keyed by message id; no persistence |
| **Testing** | `.opencode/plugins/tests/mk-communication-projection.test.cjs` run with `node --test` |

### Overview

Author the first working runtime as an OpenCode plugin. The plugin registers the `chat.message` hook, gates projection behind `isProjectionEnabled()` and `isHookEnabled(concern)`, snapshots the original parts by message id, calls the Phase 018 `projectMessage()` entrypoint, and restores the byte-exact original on any error, disable, or non-accept terminal.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The Phase 017 `chat.message` display caveat is confirmed pre-implementation.
- [x] The Phase 018 `projectMessage()` entrypoint and the shared kill-switch surface are inventoried.
- [x] The existing plugin test pattern (`mk-*.test.cjs`) is reviewed.

### Definition of Done

- [x] All ten requirements have observed evidence.
- [x] With the flag on the session shows the projection; with it off or on any failure it shows the byte-exact original.
- [x] The plugin test suite passes and strict packet validation reports zero errors and warnings.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A fail-open OpenCode plugin that adapts the native `chat.message` hook into the Phase 018 `projectMessage()` entrypoint, with message-id keyed snapshots for byte-exact restore.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Plugin factory | Returns the hook registry that OpenCode loads as a local plugin |
| `chat.message` hook | Receives the stored session message and mutates `output.parts` only when both gates pass |
| Enablement gates | `isProjectionEnabled()` plus the shared `isHookEnabled(concern)` kill-switch |
| Message-id snapshot map | Holds the canonical original parts for byte-exact restore |
| `projectMessage()` call | The Phase 018 entrypoint that produces a projection or the exact original |

### Data Flow

Session message -> `chat.message` hook -> gates pass? -> snapshot original parts by message id -> `projectMessage()` -> accept? -> projected parts replace `output.parts` : restore the byte-exact original.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/` | Hosts OpenCode plugin entrypoints | Add `mk-communication-projection.js` | Node test runner plus directory inventory |
| `.opencode/plugins/tests/` | Hosts plugin regression suites | Add `mk-communication-projection.test.cjs` | `node --test` suite passes |
| Phase 018 `projectMessage()` | Owns the projection stage order | Called, never modified | Entrypoint tests stay green |
| Shared gates | `isProjectionEnabled()` and `isHookEnabled(concern)` | Consulted before projection | Disabled-matrix plugin tests |
| Session message store | Owns the stored message | Mutated only by the hook after snapshot | Byte-exact restore tests |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Confirm the `chat.message` display caveat pre-implementation.
- [x] Inventory the Phase 018 entrypoint, the shared kill-switch surface, and the existing plugin test pattern.

### Phase 2: Implementation

- [x] Author the plugin factory registering the `chat.message` hook.
- [x] Wire both gates and the message-id snapshot before any mutation.
- [x] Call `projectMessage()` and map every terminal to a projection or the byte-exact original.

### Phase 3: Verification

- [x] Run the plugin test suite with `node --test`.
- [x] Confirm canonical bytes stay unchanged and the disabled matrix passes.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Hook registration | `chat.message` is registered and invoked | Node test runner |
| Gate matrix | Flag on/off crossed with kill-switch on/off | `mk-communication-projection.test.cjs` |
| Restore | Error, throw, timeout, and non-accept terminals restore byte-exact originals | Node test runner |
| Snapshot lifecycle | Double invoke and missing-snapshot cases | Node test runner |
| Boundary | No stdout or stderr writes from the plugin | Console capture in tests |
| Packet integrity | Planned Level-3 packet validates cleanly | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 018 `projectMessage()` | Internal | Required by plan | The plugin cannot project without the entrypoint |
| Phase 017 runtime-wiring feasibility and contract | Internal | Required by plan | The integration contract and display caveat are unresolved |
| Phase 016 enablement gate and kill-switch | Internal | Available | The hooks cannot be gated independently |
| OpenCode plugin API `chat.message` | External | Available | The native transform hook cannot be registered |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the hook projects when disabled, loses the original parts, throws into the session, or the `chat.message` parts do not render the projection visibly.
- **Procedure**: remove `.opencode/plugins/mk-communication-projection.js` and its test file, restore any session messages touched during the attempt, rerun the plugin suite, and confirm canonical bytes and default-off behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Caveat confirmation + inventory -> Plugin authoring -> Gate and restore verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Caveat and inventory | Phase 017 and Phase 018 deliverables | Plugin authoring |
| Plugin authoring | Confirmed caveat and inventory | Verification |
| Verification | Implemented plugin | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Caveat confirmation and inventory | Medium | 0.5-1 day |
| Plugin authoring | Medium | 1-2 days |
| Verification and handoff | Medium | 1-2 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [ ] Record the current plugin-suite baseline.
- [ ] Capture the Phase 018 entrypoint and gate contract references.
- [ ] Confirm the plugin boundary (no terminal output) is preserved.

### Procedure

1. Remove the plugin entrypoint and its test file.
2. Re-run the plugin suite to confirm the baseline.
3. Confirm canonical transcripts, events, and tool results are byte-unchanged.
4. Rerun strict packet validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Remove the plugin files and restore any session messages touched during the attempt.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phase 017 contract + caveat ----+
                                +-> Gates and hook -> projectMessage() -> Restore and verification
Phase 018 entrypoint -----------+                          |
Phase 016 gates -------------------------------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Hook registration | OpenCode plugin API and Phase 017 contract | A registered `chat.message` hook | Projection path |
| Gates and snapshot | Phase 016 gates and Phase 018 entrypoint | Gated, restorable projection | Verification |
| Verification | Implemented plugin | Gate, restore, and boundary evidence | Phase handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Confirm the display caveat and inventory the entrypoint** - 0.5-1 day - critical.
2. **Author the gated, snapshot-backed hook** - 1-2 days - critical.
3. **Prove gate, restore, and boundary behavior, then close the packet** - 1-2 days - critical.

**Parallel opportunities**:

- The plugin test harness can be scaffolded while the caveat is being confirmed.
- The gate and restore fixtures can be authored after the hook shape is fixed.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Hook seam confirmed | Display caveat resolved and entrypoint inventoried | Stage 1 |
| M2 | Plugin wired | Gated hook projects and restores byte-exact originals | Stage 2 |
| M3 | Runtime proven | Plugin suite green and strict validation passes | Stage 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION SUMMARY

**Decision**: adopt the native `chat.message` hook as the integration seam and hold the canonical original parts in plugin-side state keyed by message id so the exact-original fallback and byte-exact restore hold.

**Status**: Proposed. Full rationale and alternatives are in `decision-record.md`.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the Phase 017 display caveat and the Phase 018 entrypoint before authoring the hook.
- Re-read every target file before editing and keep writes inside the plugin and packet surfaces.
- Translate each requirement into an observable check before claiming completion.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Do not author the hook before the display caveat is confirmed. |
| TASK-SCOPE | Modify only `.opencode/plugins/mk-communication-projection.js`, its test file, and this packet. |
| TASK-PROOF | Run focused checks, then rerun the authoritative plugin suite and strict validation from the final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=019 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If the display caveat cannot be resolved, the entrypoint is unavailable, or any restore check disagrees with this plan, mark the task blocked, preserve the fail-open behavior, and update the decision record before resuming.
