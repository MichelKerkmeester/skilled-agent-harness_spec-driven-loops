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
    last_updated_at: "2026-08-14T06:10:21.000Z"
    last_updated_by: "claude"
    recent_action: "Planned the 017-028 runtime-wiring phases."
    next_safe_action: "Begin Phase 017 runtime-wiring feasibility validation."
    blockers: []
    key_files:
      - "spec.md"
      - "016-default-off-and-advisor-exclusion/spec.md"
      - "017-runtime-wiring-feasibility-and-contract/spec.md"
      - "018-projection-runtime-core/spec.md"
      - "019-opencode-native-plugin/spec.md"
      - "020-cli-output-wrapper-framework/spec.md"
      - "026-capability-and-privacy-gating/spec.md"
      - "027-evaluation-and-release-gate/spec.md"
      - "028-wiring-docs-and-operator-rollout/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-improved-communication-20260811"
      parent_session_id: null
    completion_pct: 39
    open_questions:
      - "Which runtimes prove atomic replacement under pinned fixtures?"
    answered_questions:
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
| **Successor** | Phases `009` through `013` and `017` through `028` are planned; Phases `014` through `016` record the completed conformance, package-relocation, default-off, and advisor-exclusion work. |
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
| `017-runtime-wiring-feasibility-and-contract/` | Create | 017 | Planned runtime feasibility matrix and shared hook-to-projection integration contract |
| `018-projection-runtime-core/` | Create | 018 | Planned production transport, orchestration entrypoint, meaning judge, and client exports |
| `019-opencode-native-plugin/` | Create | 019 | Planned native OpenCode output-transform plugin |
| `020-cli-output-wrapper-framework/` | Create | 020 | Planned shared capture-project-render wrapper for runtimes without native output hooks |
| `021-claude-code-wrapper/` | Create | 021 | Planned Claude Code headless stream-json wrapper wiring |
| `022-codex-wrapper/` | Create | 022 | Planned Codex non-interactive JSON-stream wrapper wiring |
| `023-pi-wrapper/` | Create | 023 | Planned Pi mutation probe and validated extension-or-wrapper wiring |
| `024-devin-wrapper/` | Create | 024 | Planned Devin print-mode wrapper wiring |
| `025-cursor-wrapper/` | Create | 025 | Planned Cursor non-interactive output wrapper wiring |
| `026-capability-and-privacy-gating/` | Create | 026 | Planned compatibility-doctor capability and privacy gate at every activation seam |
| `027-evaluation-and-release-gate/` | Create | 027 | Planned reject-only evaluation consult and release-readiness gate |
| `028-wiring-docs-and-operator-rollout/` | Create | 028 | Planned enablement, rollout, and rollback operator documentation |
| `context/claudish-to-english-main/` | Read only | All | Reference behavior and evidence. Never modified by this epic. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Title / Focus | Level | Status |
|-------|--------|---------------|-------|--------|
| 1 | `001-research-strategy/` | Establish the evidence base, portable architecture, provider policy, fidelity evaluation, and recommended implementation sequence | 2 | Complete |
| 2 | `002-contracts-and-fixtures/` | Bootstrap the standalone package and version event, context, prompt, provider, privacy, projection, telemetry, evaluation, benchmark, error, and exact-original fixture contracts | 3 | Complete |
| 3 | `003-core-normalization-and-assembly/` | Implement immutable normalization, canonical-byte storage, bounded context selection, ordering, deduplication, bounds, cancellation, retry generations, and content-free event emission | 3 | Complete |
| 4 | `004-protected-spans-fidelity-render/` | Implement protected spans, deterministic validators, semantic vetoes, compare-and-swap, and render decisions | 3 | Complete |
| 5 | `005-provider-adapters-and-privacy/` | Implement OpenCode Go, Ollama, llama.cpp, generic hosted adapters, discovery, and privacy-first routing | 3 | Complete |
| 6 | `006-runtime-adapters-and-clients/` | Implement Claude, Codex, Pi, OpenCode, Devin, and Cursor adapters with explicit full-projection and safe-native presentation tiers | 3 | Complete |
| 7 | `007-evaluation-and-observability/` | Execute the powered blind parity protocol, aggregate redacted telemetry, and produce operational reports | 3 | Complete |
| 8 | `008-packaging-and-release-hardening/` | Package supported configurations, compatibility doctor, rollback, and release gates | 3 | Complete |
| 9 | `009-prompt-token-contract/` | Make the versioned prompt profile explicitly preserve protected markers while rewriting surrounding prose | 2 | Planned |
| 10 | `010-adjacent-span-coalescing/` | Reduce model-facing marker burden through a locally resolved representation that preserves strict restoration | 3 | Planned |
| 11 | `011-meaning-judge-wiring/` | Compose a local post-restoration reject-only meaning judge into the production path | 3 | Planned |
| 12 | `012-no-op-rejection/` | Reject unchanged and threshold-defined near-echo candidates as no improvement | 2 | Planned |
| 13 | `013-capability-evidence-unblock/` | Supply dated evidence so supported provider controls reach transport while stale facts remain fail closed | 2 | Planned |
| 14 | `014-code-and-doc-conformance/` | Record complete code-folder README coverage, reference-document conformance, package-gate alignment, and zero-defect review evidence | 2 | Complete |
| 15 | `015-package-into-skill/` | Record the completed rename-preserving relocation of the package into the sk-communication skill and its 140-reference skill-doc update | 2 | Complete |
| 16 | `016-default-off-and-advisor-exclusion/` | Record the completed default-off enablement gate for projection and the adjustable advisor route-exclusion that holds sk-communication out of routing | 3 | Complete |
| 17 | `017-runtime-wiring-feasibility-and-contract/` | Runtime-Wiring Feasibility and Contract | 3 | Planned |
| 18 | `018-projection-runtime-core/` | Projection Runtime Core | 3 | Planned |
| 19 | `019-opencode-native-plugin/` | OpenCode Native Plugin | 3 | Planned |
| 20 | `020-cli-output-wrapper-framework/` | CLI-Output Wrapper Framework | 3 | Planned |
| 21 | `021-claude-code-wrapper/` | Claude Code Wrapper | 2 | Planned |
| 22 | `022-codex-wrapper/` | Codex Wrapper | 2 | Planned |
| 23 | `023-pi-wrapper/` | Pi Wrapper | 2 | Planned |
| 24 | `024-devin-wrapper/` | Devin Wrapper | 2 | Planned |
| 25 | `025-cursor-wrapper/` | Cursor Output Wrapper | 2 | Planned |
| 26 | `026-capability-and-privacy-gating/` | Capability and Privacy Gating | 3 | Planned |
| 27 | `027-evaluation-and-release-gate/` | Evaluation and Release Gate | 3 | Planned |
| 28 | `028-wiring-docs-and-operator-rollout/` | Wiring Docs and Operator Rollout | 2 | Planned |

The first eight children and Phases 014 through 016 are implemented and verified. Phases 009 through 013 and 017 through 028 are planned follow-on workstreams and retain zero-percent completion until their own implementation evidence exists.
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
| 016 default-off and advisor exclusion | 017 runtime-wiring feasibility and contract | Projection remains default-off and manually routed while the runtime seams and integration contract are validated | Phase 016 gate and exclusion evidence plus Phase 017 feasibility probes and strict validation |
| 017 runtime-wiring feasibility and contract | 018 projection runtime core | Every runtime has one validated integration pattern and the shared fail-open seam contract is fixed before core orchestration is exposed | Feasibility matrix, OpenCode and Pi probes, seam contract, and strict validation |
| 018 projection runtime core | 019 OpenCode native plugin | The production transport, `projectMessage()` stage order, meaning judge, and client exports work before the first runtime consumes them | End-to-end transport tests, package gate, exact-original assertions, and strict validation |
| 019 OpenCode native plugin | 020 CLI-output wrapper framework | The native OpenCode seam proves enabled projection and exact-original fallback before the non-native wrapper pattern is generalized | OpenCode plugin tests, live display probe, gate matrix, and strict validation |
| 020 CLI-output wrapper framework | 021 Claude Code wrapper | The shared capture-normalize-project-render seam passes one wrapper-target runtime before provider-specific wrappers are added | Wrapper framework tests, package gate, canonical-byte assertions, and strict validation |
| 021 Claude Code wrapper | 022 Codex wrapper | Claude stream-json mapping proves the first wrapper consumer and preserves the shared gate and fallback contract | Claude adapter mapping, headless smoke, gate and fallback tests, and strict validation |
| 022 Codex wrapper | 023 Pi wrapper | Codex JSON-stream capture and projection pass before Pi selects its validated native-or-wrapper path | Codex envelope fixture, headless smoke, gate and fallback tests, and strict validation |
| 023 Pi wrapper | 024 Devin wrapper | The Pi mutation question has a recorded verdict and the selected path projects safely before the remaining print-mode wrappers proceed | Pi mutation probe, chosen-path tests, gate and fallback tests, and strict validation |
| 024 Devin wrapper | 025 Cursor output wrapper | Devin print-mode capture and exact-original fallback pass before the final runtime wrapper is wired | Devin CLI probe, adapter tests, gate matrix, and strict validation |
| 025 Cursor output wrapper | 026 capability and privacy gating | All six runtime seams work before the compatibility doctor becomes the common pre-projection authority | Cursor CLI probe, adapter and fallback tests, six-runtime seam evidence, and strict validation |
| 026 capability and privacy gating | 027 evaluation and release gate | Every activation path fails closed on unknown, stale, incapable, or privacy-disallowed facts before quality evidence controls rollout | Doctor-gate matrix, zero-hosted-call privacy canary, content-free diagnostics, and strict validation |
| 027 evaluation and release gate | 028 wiring docs and operator rollout | Fresh non-inferiority, six-runtime smokes, and privacy canaries gate rollout before operator instructions are finalized | Reject-only evaluation consult, dated release evidence, rollout gate, and strict validation |
| 028 wiring docs and operator rollout | Parent packet closeout | A fresh operator can enable, verify, and fully roll back every runtime without changing canonical bytes | Reference-document validation, per-runtime runbook walkthrough, rollback proof, and recursive strict validation |
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

- **Active child**: `017-runtime-wiring-feasibility-and-contract/spec.md` (planned; implementation not started)
- **Completed predecessor handover**: `008-packaging-and-release-hardening/handover.md`
- **Planned follow-on range**: `009-prompt-token-contract/` through `013-capability-evidence-unblock/`
- **Completed conformance phase**: `014-code-and-doc-conformance/implementation-summary.md`
- **Completed relocation phase**: `015-package-into-skill/implementation-summary.md`
- **Completed privacy-default phase**: `016-default-off-and-advisor-exclusion/implementation-summary.md`
- **Planned runtime-wiring range**: `017-runtime-wiring-feasibility-and-contract/` through `028-wiring-docs-and-operator-rollout/`
- **Reference implementation**: `context/claudish-to-english-main/`
- **Graph metadata**: `graph-metadata.json`
