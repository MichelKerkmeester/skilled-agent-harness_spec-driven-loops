---
title: "Handover: Phase 004 Protected Spans, Fidelity, and Render"
description: "Verified Phase 004 fidelity and render boundary, evidence, traps and the safe starting point for Phase 005."
trigger_phrases:
  - "phase 004 handover"
  - "fidelity render handover"
  - "start provider adapters privacy"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/004-protected-spans-fidelity-render"
    last_updated_at: "2026-08-11T19:25:48Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the Phase 004 fidelity and render boundary."
    next_safe_action: "Approve the Phase 005 decision, then execute its predecessor and privacy-boundary preflight."
    blockers: []
    key_files:
      - "handover.md"
      - "implementation-summary.md"
      - "specs/cli-external-orchestration/035-improved-communication/005-provider-adapters-and-privacy/spec.md"
      - "specs/cli-external-orchestration/035-improved-communication/005-provider-adapters-and-privacy/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-implementation-20260811"
      parent_session_id: "phase-004-scaffold-20260811"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 004 code, focused tests, package verification and the Phase 005 input boundary are documented."
---
# Handover: Phase 004 Protected Spans, Fidelity, and Render

Phase 004 provides the protected request, fidelity outcome and capability-aware render decision that Phase 005 must preserve while adding local and hosted providers.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From session**: Phase 004 implementation on 2026-08-11
- **To session**: Phase 005 provider adapters and privacy
- **Phase completed**: Protected spans, fidelity validation, render decisions and content-free evidence
- **Handover time**: 2026-08-11T19:17:53Z
- **Recent action**: Passed the 70-test package gate, 23-test focused matrix, import smoke, dependency audit, package dry run and 1 MiB performance budget.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Protect technical and structural spans before inference | Provider output is not trusted to preserve commands, code, paths, URLs, identifiers, names, numbers or Markdown structure | Phase 005 sends only `ProtectedDocument.encodedText` and retains the original table locally |
| Run deterministic vetoes before an optional reject-only judge | A model may add a rejection but may never authorize corrupted output | Provider and judge failures always select exact original bytes |
| Compare source digests at validation and render boundaries | A projection must not display against a changed canonical message | Phase 005 carries the original digest through every request and result |
| Negotiate display mode from declared capabilities | Atomic replacement is not universal across the six runtimes | Unsupported modes fall back to append, sidecar or exact-original-only without canonical writes |
| Emit only the shared closed telemetry schema | Raw content, protected spans, credentials and provider errors must not persist in evidence | Provider work may add allowlisted identifiers and timings, never open-ended payloads |

### 2.2 Blockers Encountered

**Blockers**: None in the package implementation. Immediate memory indexing remains an external tooling limitation.

| Blocker | Status | Resolution or workaround |
|---------|--------|--------------------------|
| Memory transport or native SQLite ABI unavailable | Open outside this package | Use canonical packet files plus metadata generation. Do not infer indexed visibility. |

### 2.3 Files Modified

**Key files**: `src/fidelity/`, `src/render/`, `test/fidelity/`, root exports, package smoke and this phase packet.

| File or area | Change summary | Status |
|--------------|----------------|--------|
| `packages/cli-communication-projection/src/fidelity/` | Pinned dialect, protected-span codec, deterministic semantic and structural vetoes, reject-only judge and exact-original outcomes | Complete |
| `packages/cli-communication-projection/src/render/` | Compare-and-swap display decisions and content-free validation and render evidence | Complete |
| `packages/cli-communication-projection/test/fidelity/` | Adversarial, failure, capability, privacy and performance coverage | Complete |
| Package root exports and import smoke | Public Phase 004 API exposed and loaded from built output | Complete |
| `004-protected-spans-fidelity-render/` | Final implementation evidence and successor contract | Complete |

### 2.4 Traps and Scar Tissue

| Trap or blast site | Activation condition | Guard type | How to avoid repeating it |
|--------------------|----------------------|------------|---------------------------|
| Placeholder-shaped source text | The original already contains a string resembling an internal token | Load-bearing | Protect the entire token-shaped source range and derive a namespace absent from the original. |
| Reconstructed fallback | A rejection tries to rebuild the original from candidate text or placeholders | Load-bearing | Carry `ExactOriginalRecord` through every outcome and decode only that stored record. |
| Judge authorization | A model judge runs before deterministic checks or overrides a veto | Load-bearing | Keep the judge reject-only and call it only after every deterministic check passes. |
| Stale projection display | Canonical source changes after provider inference | Load-bearing | Compare the current SHA-256 digest at both validation and render boundaries. |
| Typed-array freezing | JavaScript attempts to freeze a non-empty byte view | Defensive | Treat detached byte views as leaves; never share them with canonical storage. |
| One-mebibyte semantic scan | An unchanged candidate runs every Unicode semantic pattern | Defensive | Use the exact-string fast path after protected-byte restoration, then retain full checks for changed prose. |
| Evidence leakage | A caller adds raw text or an open-ended metadata field | Load-bearing | Reject unknown option keys before constructing the shared telemetry event. |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File**: `../005-provider-adapters-and-privacy/decision-record.md`
- **Next safe action**: Obtain project-owner approval for the proposed privacy-first architecture, then execute T001 by consuming this handover and capturing the 70-test baseline.
- **Cold-read order**: 1. `handover.md` 2. `../005-provider-adapters-and-privacy/spec.md` 3. `../005-provider-adapters-and-privacy/decision-record.md` 4. `../005-provider-adapters-and-privacy/tasks.md`
- **Context**: Phase 005 may choose and call a provider only after privacy classification and explicit egress policy. It must preserve the Phase 004 protected document, exact original, source digest and reject-only validation semantics.

### 3.2 Priority Tasks Remaining

1. Approve the model-scoped adapter and privacy-first routing decision.
2. Freeze one provider request/result boundary around `ProtectedDocument.encodedText`, terminal state, completeness and source digest.
3. Implement privacy and egress denial before OpenCode Go, Ollama, llama.cpp or generic hosted transport selection.
4. Prove there is no implicit local-to-hosted fallback and no credential or raw-content telemetry.

### 3.3 Critical Context to Load

- [x] Phase 004 final behavior and receipts: `implementation-summary.md`
- [x] Phase 004 public surface: package `src/fidelity/`, `src/render/` and `src/index.ts`
- [x] Phase 005 scope and acceptance boundary: `../005-provider-adapters-and-privacy/spec.md`
- [x] Phase 002 provider, privacy, prompt and capability contracts: `../002-contracts-and-fixtures/handover.md`
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] Package typecheck, build, all 70 tests and public import smoke pass.
- [x] The 1 MiB warm benchmark passes at 23.72 ms p50 and 24.83 ms p95 against the 50 ms budget.
- [x] Dependency audit reports 0 vulnerabilities and no production dependency was added.
- [x] Privacy canaries, comment hygiene, unsafe-shortcut and source-format scans pass.
- [x] Workspace state is disclosed: the package and phase packets are untracked. No commit or push was requested.
- [x] Phase 004 and parent recursive strict validation pass after final metadata and changelog refresh.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

The library surface is verified, but 1:1 reference-like communication is not complete. Phase 005 still owns providers and privacy, Phase 006 owns all six CLI integrations and Phase 007 owns blinded parity evaluation. Do not claim runtime parity from Phase 004 alone.
<!-- /ANCHOR:session-notes -->
