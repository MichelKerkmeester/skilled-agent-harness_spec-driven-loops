---
title: "Implementation Status: Phase 004 Protected Spans, Fidelity, and Render"
description: "Phase 004 protected-span, fidelity, render and evidence implementation with observed verification receipts."
trigger_phrases:
  - "protected-spans-fidelity-render"
  - "implementation status"
  - "current state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/004-protected-spans-fidelity-render"
    last_updated_at: "2026-08-11T19:25:48Z"
    last_updated_by: "codex"
    recent_action: "Closed Phase 004 with package, document and strict packet gates."
    next_safe_action: "Begin Phase 005 after project-owner approval."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "handover.md"
      - "../003-core-normalization-and-assembly/handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-004-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "The Phase 003 candidate, exact-original, context, and content-free evidence boundaries are available."
      - "The project owner approved the deterministic-first Phase 004 architecture."
      - "The implementation passes 23 focused tests and the package passes 16 files and 70 tests."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Status: Phase 004 Protected Spans, Fidelity, and Render

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-protected-spans-fidelity-render |
| **Status** | Complete |
| **Implementation** | Complete and verified |
| **Level** | 3 |
| **Scaffolded** | 2026-08-11 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 004 adds a deterministic display-projection safety boundary without changing canonical CLI messages, transcripts, tool data or future model context.

| Area | Delivered behavior |
|------|--------------------|
| Protected spans | Pinned `portable-commonmark-safe` interpretation, conservative Markdown and technical-span selection, collision-safe opaque tokens and exact byte restoration from an immutable source table |
| Fidelity | Provider-terminal checks, placeholder bijection, structure and semantic vetoes, priority and next-step preservation, reject-only judge, exception containment and exact-original fallback |
| Render | Source-digest compare-and-swap plus atomic replace, append-after-original, sidecar and exact-original-only decisions from declared runtime capabilities |
| Evidence | Closed validation and render telemetry mapped into the shared versioned, content-free event schema |
| Tests | Adversarial codec corpus, 128 generated round trips, semantic mutations, failure injection, capability fallbacks, canary privacy checks and a one-mebibyte benchmark |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work consumed the verified Phase 003 handover and captured a 47-test baseline. Tests were written first and failed on the absent public API. The implementation then added the smallest runtime-neutral fidelity and render surfaces, repaired compile and runtime failures against the same focused checks and reran the whole package gate. No production dependency, provider transport, credential handling or CLI-specific code was added.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use deterministic-first validation with a reject-only model judge | It preserves canonical state and gives every unsupported or failed case an explicit safe outcome. |
| Protect conservatively and restore only from the original table | False positives reduce rewrite freedom, while false negatives can corrupt technical instructions. |
| Treat exact-original-only as the universal rollback | Runtime capability gaps and every veto remain safe without reconstructing content. |
| Keep providers outside this phase | Privacy classification, egress consent and local or hosted routing remain owned by Phase 005. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Phase 003 baseline | PASS: typecheck, build, 12 files and 47 tests, plus public import smoke |
| Focused Phase 004 suite | PASS: 4 files and 23 tests |
| Whole package gate | PASS: typecheck, build, 16 files and 70 tests, plus public import smoke |
| One-mebibyte warm benchmark | PASS: 5 warmups, 30 measured runs, 23.72 ms p50 and 24.83 ms p95 on Apple M5 Max, Node v25.6.1 |
| Performance repair delta | PASS: observed failing p95 92.86 ms to final 24.83 ms, a 68.03 ms or 73.3% reduction |
| Dependency and license boundary | PASS: no production dependencies and `npm audit --omit=dev` reports 0 vulnerabilities |
| Package dry run | PASS: 165 entries, 90,676 bytes packed and 465,840 bytes unpacked |
| Scoped source fingerprint | PASS: `sha256:923dcc68b3b008facb9576ff35657d645f2ac2a174b7fc60df43688f5be845d3` |
| Phase and parent recursive strict validation | PASS: final state reports 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

### Requirement Evidence

| Requirement | Direct observed evidence |
|-------------|--------------------------|
| REQ-001 | Dialect identity and parser-policy versions are asserted by the protected-span tests. |
| REQ-002 | Adversarial, generated, nested, unmatched and Unicode sources restore byte-for-byte. |
| REQ-003 | Source-shaped, missing, duplicate, reordered, changed and unexpected tokens have named outcomes. |
| REQ-004 | Placeholder failures return before the optional judge, which is asserted not to run. |
| REQ-005 | Facts, omissions, polarity, modal strength, priority, uncertainty, caveats, next steps, refusals, empty and truncated output are vetoed. |
| REQ-006 | Judge accept, reject, failure, timeout, cancellation and unavailable states are covered; it cannot override a deterministic veto. |
| REQ-007 | Fidelity and render both reject stale source digests. |
| REQ-008 | Malformed input, internal exception, provider failure, validator rejection and unsupported rendering retain the validated exact-original record. |

### Producer and Consumer Inventory

- Producers are `protectMarkdown`, `restoreProtectedSpans`, `validateProjectionCandidate`, `decideRender`, `createFidelityTelemetryEvent` and `createRenderTelemetryEvent`.
- The root package entry point exports those runtime-neutral surfaces. The built-package smoke imports all six.
- Current consumers are the Phase 004 focused tests and the future Phase 005 provider boundary. Phase 003 core outputs remain unchanged and no runtime adapter consumes projections yet.
- Canonical assembly, transcript, event and tool-data producers still speak the Phase 003 contract. Phase 004 receives a completed immutable original and returns a separate display decision.

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Safety-biased heuristics**: Deterministic semantic checks intentionally reject some acceptable rewrites and cannot prove unrestricted natural-language equivalence. Phase 007 owns corpus expansion and blinded human parity evaluation.
2. **No provider transport**: OpenCode Go with DeepSeek V4 Flash, other hosted providers, Ollama and llama.cpp remain Phase 005 work behind privacy-first routing.
3. **No runtime presentation**: Claude, Codex, Pi, OpenCode, Devin and Cursor integration remains Phase 006 work. Atomic replacement is a declared capability, not yet a proven runtime fact.
4. **Index visibility**: Canonical packet files and generated metadata are available, but immediate memory indexing may remain unavailable while the configured transport or native SQLite ABI is unhealthy.
<!-- /ANCHOR:limitations -->
