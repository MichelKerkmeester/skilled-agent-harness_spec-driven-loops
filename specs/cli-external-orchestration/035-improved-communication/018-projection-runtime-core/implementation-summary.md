---
title: "Implementation Summary: Phase 018 Projection Runtime Core"
description: "The projection runtime core is built: a default ProviderTransport, a top-level projectMessage() orchestration, a default reject-only meaning judge, and root-barrel client presentation exports, with exact-original behavior on every non-accept terminal."
trigger_phrases:
  - "projection-runtime-core"
  - "implementation summary"
  - "projectMessage orchestration"
  - "provider transport default"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/018-projection-runtime-core"
    last_updated_at: "2026-08-14T07:18:00.000Z"
    last_updated_by: "claude"
    recent_action: "Shipped the projection runtime core and verified the package gate."
    next_safe_action: "Proceed to phase 019 runtime wiring."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-018-projection-runtime-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The default transport, entrypoint, judge binding, and barrel exports ship and pass the package gate."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 018 Projection Runtime Core

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-projection-runtime-core |
| **Status** | Complete |
| **Completed** | 2026-08-14 |
| **Completion** | 100% |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The enablement flag now gates a genuinely working transform. One `projectMessage()` call turns a raw agent message into a validated display projection or the exact original, with every existing invariant preserved. Four completed and verified changes deliver this.

### Default Provider Transport

`src/transports/http.ts` supplies the transport the executor expects and that no production code previously provided. `createHostedHttpTransport` resolves a bearer credential through an injected resolver and fails closed with a 401 response when the credential is unavailable. `createLocalHttpTransport` issues the request against a local model endpoint and never attaches a credential. `createDefaultProviderTransport` dispatches `none:` references to the local path and everything else to the hosted path, so mixed hosted-and-local attempt plans share one seam. Both paths post JSON to the adapter-compiled endpoint and honor the caller's abort signal, which carries the executor's per-attempt deadline.

### projectMessage() Orchestration Entrypoint

`src/runtime/project-message.ts` exports `projectMessage()`, the single production entrypoint that owns the frozen stage order: `isProjectionEnabled` gate, `MessageAssembler` (`startGeneration` / `ingestEvent`), `selectBoundedContext`, `protectMarkdown`, `selectPrivacyRoute`, `executeProviderRoute`, `validateProjectionCandidate`, then `decideRender`. Privacy routing runs before any provider call, and every non-accept terminal, from a disabled gate through a rejected render decision, returns the byte-exact original with a content-free reason code. The entrypoint threads the default transport and a fail-closed default credential status unless the caller injects its own.

### Default Reject-Only Meaning Judge

`src/fidelity/reject-only-judge.ts` exports `createRejectOnlyMeaningJudge()`, a local, deterministic judge that accepts for continued processing or adds a rejection. It never ranks variants and never authorizes a candidate that deterministic checks already rejected. `projectMessage` binds it whenever `judgeMode: 'required'` runs without an injected judge, so validation now resolves to accept or reject instead of `JUDGE_UNAVAILABLE`.

### Root-Barrel Client Presentation Exports

`src/index.ts` re-exports `./clients`, `./privacy`, `./providers`, `./runtime`, and `./transports`, making `applyDisplayPresentation`, `applySidecarPresentation`, `projectMessage`, and the transport factories reachable from the package root.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `src/transports/http.ts`, `src/transports/index.ts` | Created | Default hosted, local, and combined provider transports |
| `src/runtime/project-message.ts`, `src/runtime/index.ts` | Created | Top-level `projectMessage()` orchestration entrypoint |
| `src/fidelity/reject-only-judge.ts` | Created | Default reject-only meaning judge |
| `src/fidelity/index.ts` | Modified | Export the default judge |
| `src/index.ts` | Modified | Export clients, privacy, providers, runtime, and transports |
| `test/transports/http.test.ts` | Created | Transport posting, credential, dispatch, and resolver coverage |
| `test/fidelity/reject-only-judge.test.ts` | Created | Judge accept, reject, short-source, and aborted coverage |
| `test/runtime/helpers.ts`, `test/runtime/project-message.test.ts` | Created | End-to-end projection and exact-original fallback coverage |
| `test/contracts/package-smoke.test.ts` | Modified | Assert client presentation and runtime exports from the root barrel |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The missing production pieces were supplied without changing any existing module contract. The transport implements the `ProviderTransport` type the executor already expects and injects at call time. The entrypoint composes the existing assembly, context, protection, privacy, provider, validation, and render modules in their frozen order. The judge extends the fidelity surface with a local, reject-only boundary. Verification runs the full package gate plus the strict packet validator, with new tests mirroring the existing `test/` patterns.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One default transport that dispatches hosted vs local by credential reference | Hosted and local models stay interchangeable behind one privacy-first seam, and mixed attempt plans share it |
| One `projectMessage()` entrypoint owns the frozen stage order | A single caller-facing contract freezes the safe order and prevents a wrong or missed gate |
| Default judge is local, deterministic, and reject-only | Restored plaintext never reaches a hosted judge, and the judge cannot authorize what deterministic checks vetoed |
| Re-export clients, privacy, providers, runtime, and transports from the root barrel | The entrypoint input types and the presentation functions become reachable without deep imports |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Package gate | PASS: `npm run check` passes typecheck, build, public-import smoke, and 63/63 files, 319/319 tests (310 prior plus 9 new) |
| Entrypoint end-to-end | PASS: `test/runtime/project-message.test.ts` projects through local and hosted stub transports |
| Exact-original fallback | PASS: disabled, denied-route, provider-error, incomplete-assembly, and judge-reject branches return the exact original |
| Default judge binding | PASS: `judgeMode: 'required'` resolves to accept or reject, never `JUDGE_UNAVAILABLE` |
| Privacy before hosted | PASS: denied-route test asserts the transport is never called; local transport never attaches credentials |
| Canonical immutability | PASS: exact-original bytes are byte-equal before and after the pipeline |
| Root-barrel exports | PASS: `applyDisplayPresentation`, `applySidecarPresentation`, and `projectMessage` resolve from the package root |
| Public-import smoke | PASS: built `dist/index.js` exports `projectMessage`, both client functions, the three transport factories, and the judge factory |
| Phase 018 strict validation | PASS: `validate.sh --strict` reports 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No hosted credential default beyond `env:`**: the default credential resolver reads `env:` references from the process and leaves `managed:` and `keychain:` references null, so hosted projection with those schemes requires an injected `credentialStatus` and transport resolver until a later runtime-wiring phase supplies them.
2. **The default judge is intentionally conservative**: it rejects candidates that drop more than half of the source's distinctive content tokens, which can veto an aggressive paraphrase that the deterministic checks would have allowed. Operators can inject their own `RejectOnlyJudge` through the entrypoint.
3. **Context selection is a gate, not a prompt input**: the bounded context is validated and gated but not yet threaded into the provider prompt; that belongs to the 019-025 runtime-wiring phases.

### Post-Land Continuation

After this phase lands:

1. Wire the runtime adapters and client presentation in phases 019 through 025 against the `projectMessage()` boundary.
2. Supply platform credential resolvers for `managed:` and `keychain:` references where the runtime host provides them.
3. Thread the selected bounded context into the provider prompt in a later wiring phase.
<!-- /ANCHOR:limitations -->
