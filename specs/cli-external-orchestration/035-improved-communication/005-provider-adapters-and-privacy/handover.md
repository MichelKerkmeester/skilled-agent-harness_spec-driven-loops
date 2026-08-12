---
title: "Handover: Phase 005 Provider Adapters and Privacy"
description: "Verified provider and privacy boundary, evidence, traps, and the safe starting point for Phase 006."
trigger_phrases:
  - "phase 005 handover"
  - "provider privacy handover"
  - "start runtime adapters clients"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/005-provider-adapters-and-privacy"
    last_updated_at: "2026-08-12T04:11:59Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the provider and privacy boundary."
    next_safe_action: "Validate this packet; approve the Phase 006 architecture."
    blockers: []
    key_files:
      - "handover.md"
      - "implementation-summary.md"
      - "packages/cli-communication-projection/src/providers/index.ts"
      - "packages/cli-communication-projection/src/privacy/index.ts"
      - "specs/cli-external-orchestration/035-improved-communication/006-runtime-adapters-and-clients/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-implementation-20260811"
      parent_session_id: "phase-005-scaffold-20260811"
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Provider records, privacy order, explicit fallback, prompt controls, bounded execution, and content-free evidence are implemented and tested."
---
# Handover: Phase 005 Provider Adapters and Privacy

Phase 005 provides the privacy-approved provider attempt plan and bounded inference result that Phase 006 can place between runtime assembly and Phase 004 fidelity validation.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From session**: Phase 005 implementation completed on 2026-08-12
- **To session**: Phase 006 runtime adapters and clients
- **Phase completed**: Model records, conservative discovery, privacy-first routing, four provider families, bounded execution, and content-free evidence
- **Handover time**: 2026-08-12T04:11:59Z
- **Recent action**: Passed the 89-test package gate, 19-test focused matrix, dependency audit, package dry run, and 30-run routing benchmark.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Keep provider records model scoped | Endpoint compatibility does not prove model controls, cost, privacy, or retention | Phase 006 chooses a concrete `ProviderModelRecord`, never a provider alias |
| Route privacy before ranking | No quality or cost decision may expose content before policy and consent | Phase 006 calls `selectPrivacyRoute` before `executeProviderRoute` |
| Compile prompt controls before transport | Unknown or stale sampling/thinking behavior can change the visible result | Unsupported or stale control evidence returns exact original without request bytes |
| Allow fallback only through an approved attempt list | A local failure must not silently become hosted egress | The executor iterates only `PrivacyRoute.attempts` and revalidates the plan |
| Resolve credential values outside the package | Records and telemetry must remain safe to inspect and persist | Transport receives an opaque credential reference, not a token value |
| Carry exact original through every outcome | Provider failures cannot be allowed to reconstruct source bytes | Phase 006 sends candidates to fidelity validation and displays exact original for terminal failures |

### 2.2 Public Consumption Boundary

```text
ProtectedDocument
  -> selectPrivacyRoute(records, candidates, policy, now)
  -> executeProviderRoute(route, prompt, document, transport, credentialStatus, now)
  -> candidate for fidelity validation OR exact-original terminal result
```

| Surface | Provides |
|---------|----------|
| `src/providers/index.ts` | Presets, registry, capability merge, adapters, executor, terminal evidence, and types |
| `src/privacy/index.ts` | Policy types, privacy-first selection, deterministic eligible ranking, and route reasons |
| `test/providers/` | Deterministic reference fixtures for runtime/client integration tests |

### 2.3 Provider Facts to Preserve

| Family | Protocol and model behavior | Required runtime treatment |
|--------|-----------------------------|----------------------------|
| OpenCode Go | `deepseek-v4-flash` at the dated OpenAI-compatible Chat Completions endpoint | Supply fresh model control evidence; revalidate hosted facts before 2026-08-31 |
| Ollama | Native `/api/chat` body with nested options and `think` | Treat model capabilities and offline classification as operator/probe evidence |
| llama.cpp | OpenAI-style Chat Completions with build/template-dependent controls | Probe the exact build, model, and chat template before enabling controls |
| Generic hosted | Configured OpenAI-style endpoint | Unknown terms, privacy class, capability, or required fact fails closed |

### 2.4 Traps and Scar Tissue

| Trap | Activation condition | Guard |
|------|----------------------|-------|
| Protocol implies capability | A compatible endpoint is treated as proof of temperature, thinking, or structured output | Require fresh confirmed capability evidence and an exact model mapping |
| Localhost implies offline | A loopback endpoint may load remote models or call networked services | Declare `local-offline` only from operator policy; routing does not infer it |
| Ranked route becomes fallback | More than one eligible provider exists | Only the primary record's explicit fallback list becomes attempts |
| Stale approved route | Terms or facts expire between selection and transport | Executor reruns privacy selection at the supplied request time |
| Hanging transport | A transport ignores cancellation | The caller receives a bounded timeout result; implementations must still honor the supplied abort signal |
| Error leakage | A provider includes content or credentials in an exception or body | Adapters map only status and closed reason codes; telemetry accepts only an allowlist |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File**: `../006-runtime-adapters-and-clients/decision-record.md`
- **Next safe action**: Approve the Phase 006 client-owned presentation decision, then consume this handover in T001 and capture the 89-test baseline.
- **Cold-read order**: 1. `handover.md` 2. `src/providers/index.ts` 3. `src/privacy/index.ts` 4. `../006-runtime-adapters-and-clients/spec.md` 5. its `decision-record.md`
- **Context**: Runtime clients assemble and protect canonical output first, call the privacy/provider pipeline second, run fidelity validation third, and negotiate a display-only render mode last.

### 3.2 Priority Tasks Remaining

1. Expose a Phase 006 orchestration boundary without writing projections into canonical runtime state.
2. Map all six runtime lifecycles to the shared generation and terminal contracts.
3. Keep client-owned full projection separate from safe-native append, sidecar, and original-only paths.
4. Reuse provider terminal reason codes and exact-original outcomes without copying raw content into runtime evidence.

### 3.3 Critical Context to Load

- [x] Phase 005 behavior and receipts: `implementation-summary.md`
- [x] Provider and privacy API: package `src/providers/` and `src/privacy/`
- [x] Focused reference harness: package `test/providers/`
- [x] Phase 006 scope and acceptance boundary: `../006-runtime-adapters-and-clients/spec.md`
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

- [x] Package typecheck, build, all 89 tests, and import smoke pass.
- [x] Five focused provider files with 19 tests pass.
- [x] Warm privacy routing passes at 0.033 ms p50 and 0.094 ms p95 against the provisional 20 ms p95 budget.
- [x] Dependency audit reports 0 vulnerabilities and no dependency was added.
- [x] Privacy, fallback, exact-original, secret-canary, comment-hygiene, and scoped-output scans pass.
- [ ] Phase 005 and parent recursive strict validation pass after final metadata refresh.
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

Provider and privacy support is implemented, but six-runtime integration and 1:1 reference-quality communication are not yet complete. Phase 006 owns runtime/client behavior, and Phase 007 owns the blinded non-inferiority evaluation.
<!-- /ANCHOR:session-notes -->
