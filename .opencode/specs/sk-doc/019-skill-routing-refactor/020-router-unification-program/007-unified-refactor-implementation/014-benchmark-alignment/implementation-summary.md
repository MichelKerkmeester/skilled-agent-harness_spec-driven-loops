---
title: "Implementation Summary: Lane C Compiled-Routing Benchmark Alignment"
description: "Completion record reconciling the shared compiled Lane C harness and delivering the remaining public-child, normalized equality, status, report, and verification requirements."
trigger_phrases:
  - "Lane C compiled routing implementation summary"
  - "benchmark parity current status"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/014-benchmark-alignment"
    last_updated_at: "2026-07-21T08:20:00Z"
    last_updated_by: "codex-gpt-5.6"
    recent_action: "Reconciled and completed the shared Lane C parity harness"
    next_safe_action: "Run the operator-gated activation join"
    blockers:
      - "Repository default activation remains intentionally operator-gated"
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "When will the operator authorize the separate default-on cutover?"
    answered_questions:
      - "The shared benchmark harness is the sole Lane C parity implementation"
---
# Implementation Summary: Lane C Compiled-Routing Benchmark Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Implemented — satisfied by the shared benchmark harness |
| **Date** | 2026-07-21 |
| **Level** | 2 |
| **Implementation** | Shared harness reconciled and remaining acceptance gaps delivered |
| **Frozen scorer state** | Byte-identical before and after |
| **Strict validation** | Recorded after final metadata regeneration |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The existing shared implementation from `015-routing-coverage-activation-verification/004-benchmark-compiled-lane-c` already supplied the non-frozen `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs` module, orchestrator gate, report renderer, digest pinning, qualified-id bridge, status enum, distinct verdict, and focused Vitest suite. This packet does not duplicate that harness.

The shared implementation was extended only where this packet's acceptance criteria were not yet covered:

| Requirement | Shared implementation evidence |
|-------------|--------------------------------|
| Non-frozen parity ownership and distinct gate | compiledParity(), rollupCompiledParity(), and applyCompiledDriftVerdict() |
| Public flag-on serving path | defaultCompiledDecision() spawns .opencode/bin/compiled-route.cjs with a cloned child env and SPECKIT_COMPILED_ROUTING=1 |
| Shared status classification | defaultProbeStatus() consumes compiled-route-status.cjs; missing, stale, invalid, legacy-authority, and breakage stay distinct |
| Ordered routing equality | normalizeLegacyProjection(), normalizeCompiledProjection(), and firstProjectionDifference() compare action, selection kind, and ordered workflow/surface targets |
| Dual route-gold requirement | compiledParity() requires both frozen evaluator results to pass before projection equality can pass |
| Frozen before/after proof | assertFrozenScorerDigests() returns digests; run() checks start/end equality before writing a report |
| Proof-grade report | run() writes flagForcedOn, eligible rows, counts, drift rows, breakages, frozen hashes, projections, and first difference |
| JSON-to-Markdown and docs | renderReport() and the Lane C README render/document the authoritative JSON block |

The parity mode defaults to off, preserving optionless Mode-A reports, dimension applicability, verdicts, and exits. Explicit `on` exercises the selected target; explicit `auto` derives enablement from hub type. The parity path still adds its own report block and gate, and route-gold-only tests keep the two hard gates independently covered.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Requirement-by-requirement reconciliation first mapped the packet to the shared harness. Only uncovered acceptance gaps were added to that implementation and its existing test/report surfaces. The frozen scorer trio remained read-only throughout.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Extend the shared harness | One implementation avoids divergent Lane C semantics. |
| Spawn the public CLI | In-process engine calls do not prove flag gating or parent-environment isolation. |
| Require both gold checks and projection equality | Two equally wrong routes cannot pass. |
| Preserve authored order | Ordered and surface bundles are routing behavior, not set membership. |
| Consume shared eligibility/status | Lane C owns no hub allowlist, freshness algorithm, or repair path. |
| Keep D1-D5 frozen | The parity verdict is additive and never changes scorer weights or meanings. |
| Keep parity default-off | Baseline Mode A cannot enter a new gate unless the caller explicitly selects `on` or `auto`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Focused parity suite | Included in the green full-suite run |
| Full Lane C suite | Exact skill-benchmark include — 18 files, 247 tests passed |
| Baseline applicability regression | Optionless advisor-visible hub run returned exit 0, retained `excludedDimensions: []`, and emitted no compiled block |
| Projection matrix | Single, ordered workflow, surface bundle, defer, reject, first-difference, and both-wrong cases covered |
| Status matrix | Fresh parity, divergence, stale re-mint, missing legacy-only, malformed, and front-door breakage covered |
| Environment isolation | Real public child forced on while parent flag remained unchanged |
| Report schema | JSON block and Markdown rendering cover every required field |
| Manifest safety | Benchmark code has no mint/write/delete path; seven live manifest hashes unchanged |
| Frozen scorer safety | Start/end SHA-256 values identical and embedded in report evidence |
| Strict packet validation | Final result recorded after metadata regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. A real sk-code sample currently demonstrates that the strengthened gate can expose a compiled defer where legacy routes. The harness correctly reports this as drift; changing the routing decision is outside this benchmark-only packet.
2. The parity lane is deterministic Mode A coverage and performs no network or paid-model calls.
3. Default compiled serving remains a separate operator-gated repository decision.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-ups

- Route owners may use the reported first-difference evidence in a separate routing-decision change.
- The activation controller may consume this implemented sibling at the operator-gated join.
<!-- /ANCHOR:follow-up -->
