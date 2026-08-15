---
title: "Handover: Phase 003 Core Normalization and Assembly"
description: "Verified Phase 003 core boundary, evidence, traps, and the safe starting point for Phase 004."
trigger_phrases:
  - "phase 003 handover"
  - "core normalization handover"
  - "start protected spans fidelity render"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/003-core-normalization-and-assembly"
    last_updated_at: "2026-08-11T17:06:26Z"
    last_updated_by: "codex"
    recent_action: "Closed the Phase 003 and parent strict gates."
    next_safe_action: "Begin the Phase 004 boundary preflight."
    blockers: []
    key_files:
      - "handover.md"
      - "implementation-summary.md"
      - "../004-protected-spans-fidelity-render/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-implementation-20260811"
      parent_session_id: "phase-003-scaffold-20260811"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 003 implementation, verification evidence, and the Phase 004 starting point are documented."
---
# Handover: Phase 003 Core Normalization and Assembly

Phase 003 provides the runtime-neutral message candidate and exact-original fallback boundary that Phase 004 must protect and validate.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From session**: Phase 003 implementation on 2026-08-11
- **To session**: Phase 004 protected spans, fidelity and render
- **Phase completed**: Core implementation and package verification
- **Handover time**: 2026-08-11T16:51:27Z
- **Recent action**: Passed the 47-test package gate, export smoke, dependency audit, package dry run, source scans and 1 MiB performance budget.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Key mutable state by runtime, session, turn, message, generation and attempt | Concurrent work and retries must never share buffers or terminal state | Phase 004 receives one isolated completed candidate or one exact-original fallback |
| Keep source, arrival and assembly order separate | Arrival jitter must not redefine canonical ordering | Fidelity checks can inspect each order domain without guessing |
| Validate and freeze data before state mutation | Malformed external input must fail without contaminating live state | Phase 004 can trust successful assembly output as immutable |
| Keep context request-scoped and telemetry content-free | Selected user text must not enter canonical state, logs or evidence | Later provider and render work must preserve this privacy boundary |

### 2.2 Blockers Encountered

**Blockers**: None in the implementation. Memory indexing remains unavailable because the memory transport returns `Transport closed`.

| Blocker | Status | Resolution or workaround |
|---------|--------|--------------------------|
| Memory MCP transport closed | Open outside this package | Use canonical packet files and repository metadata scripts. Do not infer indexed visibility. |

### 2.3 Files Modified

**Key files**: `src/core/`, `src/context/`, `src/observability/`, `test/core/`, package entry points and this packet.

| File or area | Change summary | Status |
|--------------|----------------|--------|
| `packages/cli-communication-projection/src/core/` | Deterministic normalization, validated inputs, generation state and exact-original outputs | Complete |
| `packages/cli-communication-projection/src/context/` | Last eligible non-meta user context with freshness, privacy and codepoint bounds | Complete |
| `packages/cli-communication-projection/src/observability/` | Closed evidence allowlist with keyed correlations and typed suppression | Complete |
| `packages/cli-communication-projection/test/core/` | Runtime matrix, adversarial lifecycle, context, evidence and performance coverage | Complete |
| `003-core-normalization-and-assembly/` | Final implementation evidence and successor contract | Awaiting final recursive strict close gate |

### 2.4 Traps and Scar Tissue

| Trap or blast site | Activation condition | Guard type | How to avoid repeating it |
|--------------------|----------------------|------------|---------------------------|
| Exact-original loss | A failure path creates output before storing the validated original | Load-bearing | Carry the frozen exact-original record through every terminal result and never reconstruct it from chunks. |
| Ordering collapse | An adapter treats arrival order as source or assembly order | Load-bearing | Preserve all three order fields and sort only for the named operation. |
| Retry contamination | A retry reuses a prior generation key | Load-bearing | Include attempt and generation identifiers in every state key. |
| Late event resurrection | Data arrives after cancellation, timeout or completion | Load-bearing | Keep bounded terminal tombstones and ignore every later event for that key. |
| Context leakage | A log, error or evidence object accepts open-ended fields | Load-bearing | Validate against the closed evidence contract and never serialize request-scoped context. |
| Hidden wall-clock behavior | A timer mutates state outside deterministic replay | Defensive | Advance idle state only through the explicit `expireIdle` boundary. |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File**: `../004-protected-spans-fidelity-render/decision-record.md`
- **Next safe action**: Review and accept the Phase 004 deterministic-first validation decision, then execute its boundary preflight before code changes.
- **Cold-read order**: 1. `handover.md` 2. `../004-protected-spans-fidelity-render/spec.md` 3. `../004-protected-spans-fidelity-render/decision-record.md` 4. `../004-protected-spans-fidelity-render/tasks.md`
- **Context**: Phase 004 starts after assembly. It may accept a protected candidate for display or return exact original bytes. It may not alter transcripts, tool data or future model context.

### 3.2 Priority Tasks Remaining

1. Pin one Markdown dialect and parser version for both protection and validation.
2. Implement a collision-safe protected-span codec with byte-identical round trips.
3. Add deterministic semantic and structural vetoes before any optional reject-only judge.
4. Implement compare-and-swap render decisions with exact-original fallback.

### 3.3 Critical Context to Load

- [x] Phase 003 decision and final behavior: `decision-record.md` and `implementation-summary.md`
- [x] Phase 004 scope and acceptance boundary: `../004-protected-spans-fidelity-render/spec.md`
- [x] Phase 004 task order: `../004-protected-spans-fidelity-render/tasks.md`
- [x] Phase 002 exact-original and projection contracts: `../002-contracts-and-fixtures/handover.md`
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] Package typecheck, build, all 47 tests and public import smoke pass.
- [x] The 1 MiB warm benchmark passes at 2.63 ms p50 and 3.10 ms p95 against the 25 ms budget.
- [x] Dependency audit reports 0 vulnerabilities and no production dependency was added.
- [x] Comment-hygiene, unsafe-shortcut and task-residue scans pass.
- [x] Workspace state is disclosed: package and phase packets are untracked. No commit or push was requested.
- [x] Phase 003 and parent recursive strict validation pass after final metadata refresh.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

The package is private and remains an internal library surface. A dry-run package contains 121 entries and resolves the Phase 003 exports. Full 1:1 communication output is not complete yet. Phase 004 owns protected spans and render safety, Phase 005 owns providers, Phase 006 owns the six CLI integrations and Phase 007 owns human parity evaluation.
<!-- /ANCHOR:session-notes -->
