---
title: "Implementation Summary: Phase 002 Contracts and Fixtures"
description: "Completed Phase 002 package, versioned contracts, synthetic fixtures, negative controls, and verification evidence."
trigger_phrases:
  - "contracts-and-fixtures"
  - "implementation status"
  - "current state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/002-contracts-and-fixtures"
    last_updated_at: "2026-08-11T15:37:30Z"
    last_updated_by: "codex"
    recent_action: "Completed and verified the Phase 002 package, contracts, fixtures, and handoff."
    next_safe_action: "Begin Phase 003 normalization and assembly against the v1 public package exports."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "handover.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-scaffold-20260811"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "What human baseline variance and non-inferiority margins will Phase 007 measure?"
      - "Which version-pinned runtime and provider probes will replace synthetic capability fixtures?"
    answered_questions:
      - "Phase purpose, boundary, dependencies, and handoff are defined."
      - "The self-contained package boundary is valid and independently runnable."
      - "Pending evaluation measurements are represented explicitly instead of fabricated."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 002 Contracts and Fixtures

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-contracts-and-fixtures |
| **Status** | Complete |
| **Implementation** | Verified |
| **Level** | 3 |
| **Scaffolded** | 2026-08-11 |
| **Completed** | 2026-08-11 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Package and contracts

`packages/cli-communication-projection/` is now an independent strict TypeScript ESM package with deterministic pinned development dependencies and package-local type-check, build, test, import-smoke, and combined check commands. Its public root exports 11 versioned contract families plus compatibility helpers without importing a runtime adapter.

The contract layer covers canonical event envelopes and stream identity, bounded context, privacy, prompt controls, model-specific providers, projections, typed errors, exact-original bytes, closed telemetry, reproducible benchmarks, and blinded evaluation. Unsupported schema majors, inconsistent terminal states, contradictory controls, denied egress, stale context, raw telemetry fields, free-form telemetry reasons, and invalid digests fail closed while preserving the rejected input reference.

### Fixture and evidence corpus

Eight JSON files contain 100 declared synthetic cases. The runtime matrix has exactly 30 rows: Claude, Codex, Cursor, Devin, OpenCode, and Pi crossed with normal, streaming, error, cancellation, and extension classes. Thirty-eight exact-original cases preserve base64 bytes, byte length, SHA-256, provenance, and an explicit byte-identical expectation. Context, prompt, provider, outcome, telemetry, benchmark-policy, blind-order, and human-authored synthetic reference cases cover the remaining boundaries.

The evaluation contract does not invent human measurements. All four baseline-variance dimensions are explicitly `pending` with null values, provisional margins are zero, and inconclusive evaluation blocks release. Actual perceptual parity remains Phase 007 work; this phase proves the evaluation input contract, not 1:1 output quality.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the completed Phase 001 synthesis and its immutable display-projection recommendation. The package was absent at baseline, so the first artifact check failed as the negative control. After bootstrap, focused checks ran during each repair and the complete `npm run check` gate ran from final package state.

Fixtures are synthetic or human-authored synthetic and say so in their provenance. Provider records preserve researched facts and keep unverified controls `unknown`; they store only opaque credential references. The dedicated one-MiB benchmark used five warm-ups and 30 measurements on the recorded machine. Documentation was reconciled only after the code, fixture, security, dependency, package, and performance checks passed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use fixture-first, versioned contracts with immutable originals | It preserves canonical state and gives every unsupported or failed case an explicit safe outcome. |
| Use a self-contained package under `packages/cli-communication-projection/` | The portable product needs an independent build, test, and future distribution boundary instead of coupling to the root staging app. |
| Contract bounded context, prompt profiles, and parity evaluation in Phase 002 | Those inputs create the reference feel and must be frozen before candidate implementation can be judged. |
| Represent unavailable evaluation variance as pending | Numeric placeholders would fabricate human evidence and could weaken later margins. |
| Keep telemetry content-free and closed | Stable enums, bounded identifiers, byte counts, durations, and keyed digests prevent raw assistant or user text from becoming observability data. |
| Keep live adapters out of Phase 002 | Runtime integration, provider calls, and protected-span transformation remain in their named successor phases. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Required artifact negative control | PASS: package absent at baseline; final check reports 7/7 required artifacts |
| `npm run check` | PASS: type-check, build, 7 test files/30 tests, and built-package import smoke |
| Exact-original and negative controls | PASS: 38/38 golden bytes plus unsupported-major, digest, stream, privacy, control, telemetry, and fallback cases |
| One-MiB warm validation benchmark | PASS: Apple M5 Max, Node v25.6.1, 5 warm-ups, 30 runs, p50 1.324 ms, p95 1.680 ms; provisional budget 10 ms |
| Dependency and package review | PASS: zero audit vulnerabilities; no runtime dependencies; direct licenses MIT/Apache-2.0/MIT; dry-run package contains 81 entries |
| Static quality scans | PASS: no TypeScript line over 100 columns, explicit `any`, TODO/FIXME, source debug statement, ephemeral code-comment marker, or task-created residue |
| Phase and parent validation | PASS: child strict and parent recursive strict validators exit 0 from final state |

### Requirement Evidence

| Requirement | Observed evidence |
|-------------|-------------------|
| REQ-001, REQ-006 | Event envelope and stream validators cover identity, independent order coordinates, terminal consistency, duplicates, and missing final events. |
| REQ-002 | 38 exact-original fixtures and a two-MiB binary-looking test round-trip bytes and SHA-256 without normalization. |
| REQ-003 | Four provider cases cover OpenCode Go, generic hosted, Ollama, and llama.cpp with opaque credentials, capabilities, privacy, and fallback policy. |
| REQ-004 | Candidate, accepted, rejected-capable, and exact-original projection unions plus typed error records are public. |
| REQ-005 | The 6 x 5 runtime/class matrix contains 30 unique rows. |
| REQ-007 | Six context cases cover present, absent, stale, truncated, privacy-denied, and meta-only input without raw telemetry context. |
| REQ-008 | Two prompt profiles freeze whole-message copy-editing scope, temperature 0.3, disabled thinking, provider mappings, and exact-original behavior. |
| REQ-009 | Four reference pairs, blind ordering, three reviewers, four rubric dimensions, pending variance, sample rules, zero provisional margins, confidence rule, and blocking inconclusive policy validate. |
| REQ-010 | Pinned install metadata and package-local type-check, build, test, import, and combined commands pass. |
| REQ-011 | All 100 declared cases carry version, source, capture, sanitization, and expected-result metadata. |
| REQ-012 | Unsupported major tests retain the original object and emit the typed unsupported-schema error code. |
| REQ-013 | Closed telemetry and benchmark validators pass keyed-digest, raw-content rejection, reproducibility, and measured p50/p95 tests. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No transformation yet**: Phase 002 defines contracts and fixtures; normalization, protected spans, provider calls, and runtime presentation remain Phases 003-006.
2. **Parity is not yet proven**: The reference-like prompt and human-authored synthetic corpus are frozen, but blind human non-inferiority evaluation remains Phase 007.
3. **Synthetic runtime fixtures**: They prove portable canonical shapes, not live CLI wire compatibility. Each adapter phase must replace or supplement them with version-pinned captures.
4. **Dated hosted-provider evidence**: OpenCode Go control support remains unknown, and its researched ZDR agreement must be rechecked after the recorded 2026-08-31 boundary.
5. **Repository state**: The package and packet remain untracked in a broadly dirty worktree. No commit or push was requested; unrelated changes were not modified.
<!-- /ANCHOR:limitations -->
