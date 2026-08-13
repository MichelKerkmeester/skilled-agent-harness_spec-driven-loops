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
    last_updated_at: "2026-08-13T19:13:48.000Z"
    last_updated_by: "claude"
    recent_action: "Added the completed default-off enablement gate and advisor route-exclusion (Phase 016)."
    next_safe_action: "Begin Phase 009 planning; preserve completed Phase 008/014/015/016 evidence."
    blockers: []
    key_files:
      - "spec.md"
      - "001-research-strategy/spec.md"
      - "005-provider-adapters-and-privacy/handover.md"
      - "006-runtime-adapters-and-clients/spec.md"
      - "007-evaluation-and-observability/spec.md"
      - "009-prompt-token-contract/spec.md"
      - "014-code-and-doc-conformance/spec.md"
      - "015-package-into-skill/spec.md"
      - "016-default-off-and-advisor-exclusion/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-improved-communication-20260811"
      parent_session_id: null
    completion_pct: 69
    open_questions:
      - "Which runtimes prove atomic replacement under pinned fixtures?"
    answered_questions:
      - "The epic is phased and phase 001 owns the research strategy."
      - "The implementation sequence is contracts, assembly, fidelity, providers, runtimes, evaluation, and release hardening."
      - "Phase 002 delivered the standalone v1 contract package and verified fixture corpus."
      - "Phase 003 delivered the verified normalization, assembly, context, and evidence core."
      - "Phase 004 delivered the verified protected-span, fidelity, render, and content-free evidence boundary."
      - "Phase 005 delivered verified model-scoped providers, privacy-first routing, bounded execution, and exact-original fallback."
      - "Phase 015 delivered the verified relocation of the package into the sk-communication skill."
      - "Phase 016 delivered the verified default-off enablement gate and the advisor route-exclusion for sk-communication."
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
| **Successor** | Phases `009` through `013` are planned; Phase `014` records completed code and documentation conformance, Phase `015` records the completed package relocation into its owning skill, and Phase `016` records the completed default-off enablement gate and advisor route-exclusion. |
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
| `002-contracts-and-fixtures/` through `008-packaging-and-release-hardening/` | Create | 002-008 | Completed implementation workstreams derived from the research synthesis |
| `009-prompt-token-contract/` through `013-capability-evidence-unblock/` | Create | 009-013 | Planned projection-quality workstreams for prompt tokens, marker burden, meaning judgment, no-op rejection, and capability evidence |
| `014-code-and-doc-conformance/` | Create | 014 | Completed package README coverage, operator-reference conformance, package alignment, and review evidence |
| `015-package-into-skill/` | Create | 015 | Completed rename-preserving relocation of the package into the sk-communication skill and its skill-doc reference updates |
| `016-default-off-and-advisor-exclusion/` | Create | 016 | Completed default-off enablement gate for projection and the adjustable advisor route-exclusion that holds sk-communication out of routing |
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
| 5 | `005-provider-adapters-and-privacy/` | Implement OpenCode Go, Ollama, llama.cpp, generic hosted adapters, discovery, and privacy-first routing | Complete |
| 6 | `006-runtime-adapters-and-clients/` | Implement Claude, Codex, Pi, OpenCode, Devin, and Cursor adapters with explicit full-projection and safe-native presentation tiers | Complete |
| 7 | `007-evaluation-and-observability/` | Execute the powered blind parity protocol, aggregate redacted telemetry, and produce operational reports | Complete |
| 8 | `008-packaging-and-release-hardening/` | Package supported configurations, compatibility doctor, rollback, and release gates | Complete |
| 9 | `009-prompt-token-contract/` | Make the versioned prompt profile explicitly preserve protected markers while rewriting surrounding prose | Planned |
| 10 | `010-adjacent-span-coalescing/` | Reduce model-facing marker burden through a locally resolved representation that preserves strict restoration | Planned |
| 11 | `011-meaning-judge-wiring/` | Compose a local post-restoration reject-only meaning judge into the production path | Planned |
| 12 | `012-no-op-rejection/` | Reject unchanged and threshold-defined near-echo candidates as no improvement | Planned |
| 13 | `013-capability-evidence-unblock/` | Supply dated evidence so supported provider controls reach transport while stale facts remain fail closed | Planned |
| 14 | `014-code-and-doc-conformance/` | Record complete code-folder README coverage, reference-document conformance, package-gate alignment, and zero-defect review evidence | Complete |
| 15 | `015-package-into-skill/` | Record the completed rename-preserving relocation of the package into the sk-communication skill and its 140-reference skill-doc update | Complete |
| 16 | `016-default-off-and-advisor-exclusion/` | Record the completed default-off enablement gate for projection and the adjustable advisor route-exclusion that holds sk-communication out of routing | Complete |

The first eight children, Phase 014, Phase 015, and Phase 016 are implemented and verified. Phases 009 through 013 are planned follow-on workstreams and retain zero-percent completion until their own implementation evidence exists.
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
| 008 packaging and release hardening | 009 prompt token contract | Preserve the completed release evidence while opening the versioned prompt-profile follow-on | Phase 008 handover plus Phase 009 strict planned-packet validation |
| 009 prompt token contract | 010 adjacent-span coalescing | Token contract is planned independently; combined marker-burden measurements remain available to the next phase | Fixed-corpus token-contract plan and strict packet validation |
| 010 adjacent-span coalescing | 011 meaning-judge wiring | Representation and privacy decisions are explicit before production composition consumes candidates | Decision record, fidelity plan, and strict packet validation |
| 011 meaning-judge wiring | 012 no-op rejection | Meaning-loss and no-change policies remain separate, typed production outcomes | Composition plan and strict packet validation |
| 012 no-op rejection | 013 capability-evidence unblock | No-improvement policy remains independent from provider capability reachability | Threshold plan and strict packet validation |
| 013 capability-evidence unblock | 014 code and documentation conformance | Capability work remains independent while the completed package documentation and implementation evidence are recorded | Phase 013 strict planned-packet validation plus Phase 014 conformance evidence |
| 014 code and documentation conformance | 015 package relocation into skill | Conformance evidence remains valid while the package is relocated into its owning skill | Phase 014 strict conformance evidence plus Phase 015 rename and reference-sweep evidence |
| 015 package relocation into skill | 016 default-off and advisor exclusion | Relocation evidence remains valid while projection is made default-off and the skill is excluded from advisor routing | Phase 015 strict relocation evidence plus Phase 016 gate, exclusion, and live-probe evidence |
| 016 default-off and advisor exclusion | Parent packet decision | Projection resolves to off with no opt-in, the advisor no longer recommends sk-communication, the package gate is green, and strict packet gates are complete | Package gate 296/296, advisor +10 tests with 0 new failures against the 41-failure baseline, live probe omits sk-communication, and strict validation |
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

- **Active child**: `009-prompt-token-contract/spec.md` (planned; implementation not started)
- **Completed predecessor handover**: `008-packaging-and-release-hardening/handover.md`
- **Planned follow-on range**: `009-prompt-token-contract/` through `013-capability-evidence-unblock/`
- **Completed conformance phase**: `014-code-and-doc-conformance/implementation-summary.md`
- **Completed relocation phase**: `015-package-into-skill/implementation-summary.md`
- **Completed privacy-default phase**: `016-default-off-and-advisor-exclusion/implementation-summary.md`
- **Reference implementation**: `context/claudish-to-english-main/`
- **Graph metadata**: `graph-metadata.json`
