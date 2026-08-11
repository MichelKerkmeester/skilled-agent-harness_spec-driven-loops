---
title: "Portable CLI communication projection"
description: "Phase parent for a provider-neutral communication rewrite layer that preserves canonical CLI output while presenting claudish-to-english quality prose."
trigger_phrases:
  - "portable CLI communication"
  - "claudish to english across CLIs"
  - "improved communication"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication"
    last_updated_at: "2026-08-11T19:25:48Z"
    last_updated_by: "codex"
    recent_action: "Completed and verified Phase 004."
    next_safe_action: "Approve the Phase 005 privacy-first decision, then execute its boundary preflight."
    blockers:
      - "Phase 005 architecture decision remains Proposed until owner approval."
    key_files:
      - "spec.md"
      - "001-research-strategy/spec.md"
      - "001-research-strategy/plan.md"
      - "002-contracts-and-fixtures/spec.md"
      - "003-core-normalization-and-assembly/spec.md"
      - "003-core-normalization-and-assembly/handover.md"
      - "004-protected-spans-fidelity-render/spec.md"
      - "004-protected-spans-fidelity-render/handover.md"
      - "005-provider-adapters-and-privacy/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-improved-communication-20260811"
      parent_session_id: null
    completion_pct: 50
    open_questions:
      - "Which runtimes prove atomic replacement under pinned fixtures?"
    answered_questions:
      - "The epic is phased and phase 001 owns the research strategy."
      - "The implementation sequence is contracts, assembly, fidelity, providers, runtimes, evaluation, and release hardening."
      - "Phase 002 delivered the standalone v1 contract package and verified fixture corpus."
      - "Phase 003 delivered the verified normalization, assembly, context, and evidence core."
      - "Phase 004 delivered the verified protected-span, fidelity, render, and content-free evidence boundary."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Portable CLI communication projection

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase parent |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-08-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None |
| **Parent Packet** | `cli-external-orchestration/035-improved-communication` |
| **Predecessor** | None |
| **Successor** | `001-research-strategy/` through `004-protected-spans-fidelity-render/` complete. `005-provider-adapters-and-privacy/` is next. |
| **Handoff Criteria** | Each child passes its own implementation gates and strict validation before the next phase consumes its output |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The reference implementation makes Claude Code output easier to read, but its design is bound to Claude-specific hooks, local Ollama, disk-buffered shell processes, and prompt-only fidelity. It does not offer one safe presentation contract across Claude CLI, Codex CLI, Pi CLI, OpenCode CLI, Devin CLI, and Cursor CLI, nor does it support arbitrary hosted providers and local models behind the same policy boundary.

### Purpose

Deliver a portable projection layer that makes supported CLI communication feel indistinguishable from the reference's best plain-English output while leaving canonical events, transcripts, model context, and tool behavior unchanged. Hosted and local inference remain interchangeable only through explicit provider, privacy, capability, and fallback policy.

The root invariant is:

```text
canonical event stream/transcript ──> unchanged persistence and model context
                              └─────> validated display projection
```

Detailed research, architecture, implementation, and verification belong to child phases. This parent records only the epic contract and phase map.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Presentation-safe adapters for Claude CLI, Codex CLI, Pi CLI, OpenCode CLI, Devin CLI, and Cursor CLI.
- A provider-neutral rewrite core supporting OpenCode Go with DeepSeek V4 Flash, other hosted providers, Ollama, llama.cpp, and compatible local endpoints.
- Whole-message assembly, bounded conversational context, versioned prompt profiles, protected-span preservation, semantic/factual validation, atomic render decisions, and original-output fallback.
- Explicit privacy, cost, capability, latency, and fallback policies per provider and model.
- A conformance corpus and human evaluation that test whether communication feels 1:1 with the reference rather than merely sounding simpler.
- Two explicit presentation tiers: full projection parity for client-owned or headless rendering and safe native integration for constrained in-product surfaces.

### Out of Scope

- Rewriting canonical transcripts or model-visible context as a default behavior.
- Silently sending locally classified content to a hosted fallback.
- Treating a shared wire protocol as proof of model capability, privacy, retention, or semantic fidelity.
- Rewriting durable Markdown files. That behavior changes canonical bytes and requires a separate opt-in product contract.
- Detailed child-phase plans in this parent document.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-research-strategy/` | Create | 001 | Reverse engineering, current-source research, architecture framing, evaluation design, and downstream phase recommendation |
| `002-contracts-and-fixtures/` through `008-packaging-and-release-hardening/` | Create | 002-008 | Level 3 implementation workstreams derived from the completed research synthesis |
| `context/claudish-to-english-main/` | Read only | All | Reference behavior and evidence. Never modified by this epic. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-research-strategy/` | Establish the evidence base, portable architecture, provider policy, fidelity evaluation, and recommended implementation sequence | Complete |
| 2 | `002-contracts-and-fixtures/` | Bootstrap the standalone package and version event, context, prompt, provider, privacy, projection, telemetry, evaluation, benchmark, error, and exact-original fixture contracts | Complete |
| 3 | `003-core-normalization-and-assembly/` | Implement immutable normalization, canonical-byte storage, bounded context selection, ordering, deduplication, bounds, cancellation, retry generations, and content-free event emission | Complete |
| 4 | `004-protected-spans-fidelity-render/` | Implement protected spans, deterministic validators, semantic vetoes, compare-and-swap, and render decisions | Complete |
| 5 | `005-provider-adapters-and-privacy/` | Implement OpenCode Go, Ollama, llama.cpp, generic hosted adapters, discovery, and privacy-first routing | Draft, next; owner approval required |
| 6 | `006-runtime-adapters-and-clients/` | Implement Claude, Codex, Pi, OpenCode, Devin, and Cursor adapters with explicit full-projection and safe-native presentation tiers | Draft |
| 7 | `007-evaluation-and-observability/` | Execute the powered blind parity protocol, aggregate redacted telemetry, and produce operational reports | Draft |
| 8 | `008-packaging-and-release-hardening/` | Package supported configurations, compatibility doctor, rollback, and release gates | Draft |

All seven implementation children exist as Level 3 packets. Phases 002 through 004 have verified code, fixtures and tests. Phases 005 through 008 remain unimplemented.
### Phase Transition Rules

- Each phase must pass `validate.sh` independently before its handoff.
- A runtime adapter may not mutate canonical content to simulate a display-only integration.
- Unknown capabilities remain `unknown`. They are not silently promoted to supported.
- Human-adjudicated semantic regressions block release even when automated style metrics improve.
- Run recursive strict validation on this parent after every child-phase status change.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 research strategy | 002 contracts and fixtures | Six-runtime matrix, provider matrix, reference inventory, 7+3 deep-research evidence, fidelity rubric, and phase recommendation are complete | Phase 001 checklist and recursive strict validation |
| 002 contracts and fixtures | 003 core normalization and assembly | The standalone package builds and tests. Versioned event, context, prompt, provider, privacy, projection, telemetry, evaluation, benchmark and error schemas validate. All six fixture families and exact-original byte goldens pass. | Package smoke, schema validation, fixture matrix, prompt/context privacy cases and byte-for-byte replay |
| 003 core normalization and assembly | 004 protected spans, fidelity, and render | Generation-keyed assembly and bounded context selection pass reorder, duplicate, concurrency, timeout, cancellation, corruption, privacy, truncation, and overflow cases | Deterministic replay, lifecycle matrix, context-policy matrix, content-free event assertions, and immutable-original assertions |
| 004 protected spans, fidelity and render | 005 provider adapters and privacy | Protected-span bijection and deterministic vetoes pass. Every rejection returns exact original bytes. | Property tests, corruption negative controls and render-decision fixtures |
| 005 provider adapters and privacy | 006 runtime adapters and clients | OpenCode Go DeepSeek V4 Flash, Ollama, llama.cpp and generic routes pass contracts. Privacy runs before ranking. | Provider stubs, egress negative controls and no implicit local-to-hosted fallback |
| 006 runtime adapters and clients | 007 evaluation and observability | All six adapters declare a presentation tier and pass pinned fixture replay plus explicit degraded-mode smokes without canonical writes. | Conformance suite, tiered six-runtime smokes and state snapshots |
| 007 evaluation and observability | 008 packaging and release hardening | Pilot variance, powered blind comparisons, predeclared non-inferiority margins, operational metrics, and redaction canaries produce a conclusive passing report | Versioned report hashes, reviewer randomization checks, confidence-interval gates, and zero-leak telemetry scan |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which pinned runtime versions qualify for full projection parity rather than safe native integration?
- Which model and prompt version becomes the reference baseline after blind comparison against the original plugin?
- Which version-pinned live captures should supplement the synthetic Phase 002 matrix during adapter work?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Active child**: `005-provider-adapters-and-privacy/spec.md`
- **Completed predecessor handover**: `004-protected-spans-fidelity-render/handover.md`
- **Reference implementation**: `context/claudish-to-english-main/`
- **Graph metadata**: `graph-metadata.json`
