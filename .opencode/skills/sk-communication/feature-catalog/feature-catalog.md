---
title: "sk-communication: Feature Catalog"
description: "Current-state inventory of communication projection assembly, fidelity, privacy, providers, runtimes, evaluation, observability, compatibility, and release controls."
trigger_phrases:
  - "sk-communication feature catalog"
  - "communication projection capabilities"
  - "plain-English projection inventory"
  - "communication projection feature inventory"
last_updated: "2026-08-12"
version: 1.0.0.0
---

# sk-communication: Feature Catalog

This document is the current feature inventory for the `sk-communication` skill and the `@portable-cli/communication-projection` package it routes. The catalog follows a display-only projection from complete-message assembly through privacy-aware provider execution, fidelity validation, runtime presentation, quality evidence, and fail-closed release operations while keeping canonical bytes unchanged.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the shipped communication-projection surface. Each feature summary links to a per-feature reference with implementation and test anchors under `.opencode/skills/sk-communication/cli-communication-projection/`.

---

## 2. ASSEMBLY AND CONTEXT

### Generation-keyed message assembly

#### Description

Builds one bounded, ordered complete-message candidate per runtime generation while retaining an exact-original fallback for every terminal failure.

#### Current Reality

`MessageAssembler` isolates attempts by generation key, normalizes accepted events, rejects conflicting duplicates and invalid identity links, enforces event, byte, retry, idle, and tombstone bounds, and completes only on a successful terminal event. Cancellation, source failure, timeout, invalid input, or resource exhaustion returns an immutable exact-original assembly.

#### Source Files

See [`assembly-and-context/generation-keyed-message-assembly.md`](assembly-and-context/generation-keyed-message-assembly.md) for full implementation and test file listings.

---

### Bounded context selection

#### Description

Selects a fresh, privacy-approved slice of the latest non-meta user message under an explicit codepoint limit and no-context fallback policy.

#### Current Reality

`selectBoundedContext` validates the privacy decision and transcript view, chooses only the last eligible user message, records freshness and truncation metadata, and returns request-scoped text separately from the durable content-free contract. Missing, stale, denied, or meta-only context produces a typed absent result rather than silently widening the selection.

#### Source Files

See [`assembly-and-context/bounded-context-selection.md`](assembly-and-context/bounded-context-selection.md) for full implementation and test file listings.

---

## 3. FIDELITY AND RENDER

### Protected-span fidelity validation

#### Description

Protects literal Markdown and machine-sensitive spans during rewriting, then accepts a candidate only when restoration and semantic checks preserve the source contract.

#### Current Reality

The fidelity surface tokenizes protected spans, restores them exactly, rejects missing, reordered, duplicated, or modified tokens, and applies deterministic checks for source freshness, completeness, size, content retention, polarity, requirement strength, priority, and factual additions. An optional reject-only judge may add a semantic veto; every failed, cancelled, timed-out, truncated, or unsafe path returns the exact original.

#### Source Files

See [`fidelity-and-render/protected-span-fidelity-validation.md`](fidelity-and-render/protected-span-fidelity-validation.md) for full implementation and test file listings.

---

### Capability-aware presentation

#### Description

Chooses atomic replacement, append, sidecar, or original-only presentation from validated output and the caller-owned display boundary.

#### Current Reality

`decideRender` requires a completed, unchanged source and a digest-consistent accepted fidelity result before choosing the first supported presentation mode. Client helpers commit full projection only when the client owns complete-message atomic replacement; append and sidecar modes keep the original visible, and any unsupported mode or commit failure falls back to original-only.

#### Source Files

See [`fidelity-and-render/capability-aware-presentation.md`](fidelity-and-render/capability-aware-presentation.md) for full implementation and test file listings.

---

## 4. PROVIDER AND PRIVACY

### Privacy-first provider routing

#### Description

Filters providers by declared privacy policy, egress consent, and fresh evidence before any eligible provider is ranked or contacted.

#### Current Reality

`selectPrivacyRoute` validates the provider registry, rejects unknown or disallowed privacy classes, requires consent for hosted deployment, and checks hosted terms plus required retention and training-use facts before ranking. Fallbacks exist only when the selected provider declares an explicit ordered list; cross-class fallback obeys the configured preservation rule and never emerges implicitly from ranking.

#### Source Files

See [`provider-and-privacy/privacy-first-provider-routing.md`](provider-and-privacy/privacy-first-provider-routing.md) for full implementation and test file listings.

---

### Provider adapters and execution

#### Description

Validates provider records, compiles supported prompt controls, executes an approved route through injected transports, and returns a candidate or exact-original result.

#### Current Reality

The provider layer ships adapters for Ollama, llama.cpp, OpenCode Go, and generic hosted OpenAI-compatible chat. It requires fresh capability evidence for requested controls, passes credential references rather than secret values, applies deadlines and cancellation, parses family-specific responses, records content-free evidence, and attempts only the privacy router's approved sequence before falling back to the exact original.

#### Source Files

See [`provider-and-privacy/provider-adapters-and-execution.md`](provider-and-privacy/provider-adapters-and-execution.md) for full implementation and test file listings.

---

## 5. RUNTIME ADAPTERS

### Six-runtime adapter matrix

#### Description

Maps Claude, Codex, Pi, OpenCode, Devin, and Cursor events into shared contracts and enforces version-pinned full-projection or safe-native presentation tiers.

#### Current Reality

Each runtime adapter preserves canonical state, maps generation identity and lifecycle events, retains vendor extensions under namespaces, and fails closed on unknown paths or incompatible runtime and protocol majors. The capability matrix grants full projection only to boundaries with confirmed complete-message and atomic-render ownership; Claude interactive and Pi synchronous display paths remain safe-native, while their client-owned paths and the Codex, OpenCode, Devin, and Cursor client paths support full projection.

#### Source Files

See [`runtime-adapters/six-runtime-adapter-matrix.md`](runtime-adapters/six-runtime-adapter-matrix.md) for full implementation and test file listings.

---

## 6. EVALUATION AND OBSERVABILITY

### Blind non-inferiority evaluation

#### Description

Builds masked paired-review evidence and gates each presentation tier on fidelity vetoes plus pre-registered human non-inferiority results.

#### Current Reality

The evaluation surface freezes strata, margins, reviewer assignments, stopping rules, and powered sample plans before ratings are collected. Review packets hide candidate identity and randomized order; paired 95 percent confidence intervals are evaluated per dimension and stratum without tier pooling, absolute fidelity failures veto approval, and proxy scores remain provisional diagnostics rather than release-authorizing evidence.

#### Source Files

See [`evaluation-and-observability/blind-non-inferiority-evaluation.md`](evaluation-and-observability/blind-non-inferiority-evaluation.md) for full implementation and test file listings.

---

### Content-free observability

#### Description

Emits and aggregates reason-coded lifecycle telemetry without carrying prompts, transcript text, candidates, protected spans, credentials, or provider bodies.

#### Current Reality

Telemetry emission is schema-checked and suppresses malformed events, aggregation reports counts and rates by runtime and presentation tier, and correlation uses rotating keyed digests. Export is disabled by default, filters to an allowlisted aggregate schema when enabled, and scans nested values, binary data, errors, and field names for forbidden content shapes and redaction canaries.

#### Source Files

See [`evaluation-and-observability/content-free-observability.md`](evaluation-and-observability/content-free-observability.md) for full implementation and test file listings.

---

## 7. PACKAGING AND RELEASE

### Compatibility doctor

#### Description

Checks a proposed runtime and provider route for version, capability, reachability, credential-reference, privacy-fact, and presentation-tier readiness.

#### Current Reality

`runCompatibilityDoctor` runs six content-free checks against injected evidence and bounded reachability probes. Blocking findings force original-only route selection, provisional evidence yields a degraded report for operator review, and only a finding set without blocks or warnings reports ready; malformed input is converted into a blocked report rather than thrown to the operator.

#### Source Files

See [`packaging-and-release/compatibility-doctor.md`](packaging-and-release/compatibility-doctor.md) for full implementation and test file listings.

---

### Release readiness and rollback

#### Description

Fails a release closed unless every dated evidence lane passes, and supplies a provider-free original-only rollback plan that preserves canonical state.

#### Current Reality

`evaluateReleaseReadiness` requires a fresh support matrix, a ready compatibility doctor, all runtime smokes, provider and fidelity checks, privacy canaries, human-certifiable evaluation, and strict validation evidence before returning `release-ready`. Any missing, stale, provisional, contradictory, or failed lane blocks release; rollback disables projection, selects original-only mode, restores a caller-selected exact package version, and verifies the canonical transcript digest without allowing mutation.

#### Source Files

See [`packaging-and-release/release-readiness-and-rollback.md`](packaging-and-release/release-readiness-and-rollback.md) for full implementation and test file listings.
