---
title: "Implementation Summary: Benchmark — Compiled Lane C Parity"
description: "Planned, not yet implemented. Forward-looking build record for the non-frozen compiled-routing-parity harness, its orchestrator hooks, the shape bridge, the vacuous-parity guard, and the flag-state/verdict-substate matrices."
trigger_phrases:
  - "compiled lane c parity implementation summary"
  - "benchmark parity planned build record"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Benchmark — Compiled Lane C Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned — not yet implemented. Soft-coupled to `002-runtime-promotion-and-status-foundation` (also Planned/Not-started); the vacuous-parity guard can read the hub activation manifest directly, so full implementation is not hard-blocked on 002 shipping |
| **Date** | 2026-07-20 |
| **Level** | 2 |
| **Serving authority** | Not applicable — this child never changes serving authority; it is a benchmark/CI diagnostic that reads it |
| **Strict validation** | `validate.sh --strict` reports Errors: 0 for this doc set (spec-doc structure only; the harness described below has not been built or run) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Nothing yet — this section describes what is planned, not what exists.** A non-frozen `compiled-routing-parity.cjs` sibling in the existing skill-benchmark scripts directory, plus two orchestrator hooks, will give Lane C its first real exercise of the compiled routing path (CF-BM-1). The harness will gate on the hub's actual serving authority rather than trusting the flag alone — a vacuous-parity guard reads `010-live-activation/activation/<hub>/manifest.json` and hard-fails any run where `servingAuthority !== 'compiled'` (CF-BM-2). Compiled output's `targetQualifiedIds` will be bridged to the frozen evaluator's `observedResources` vocabulary via a new `qualifiedIdToLeaf` reverse lookup added to the shared `leaf-resource-contract.cjs` (CF-BM-3). A three-way verdict sub-state will replace today's OR-collapse — implemented entirely in the non-frozen `run-skill-benchmark.cjs`, never in the frozen `score-skill-benchmark.cjs` (CF-BM-4, SAFETY). The harness will exercise the full `unset/0/1/invalid` flag-state space (F-15-3), and this packet will be the single named blocking drift-gate owner (F-25-8).

### Files To Be Delivered

| Area | Files | Purpose |
|------|-------|---------|
| Harness | `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/compiled-routing-parity.cjs` | The non-frozen parity comparison function |
| Orchestrator hooks | `.../skill-benchmark/run-skill-benchmark.cjs`, `.../skill-benchmark/build-report.cjs` | Verdict attach + sub-state; render-from-JSON |
| Shared bridge | `.opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs` | `qualifiedIdToLeaf` addition |
| CLI wiring | `.../deep-improvement/scripts/shared/loop-host.cjs` | `--compiled-routing-parity` flag (or the `auto`-mode fallback) |
| Documentation | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this doc set) | Planning record — authored now, ahead of implementation |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

**Not yet delivered — this section describes the planned delivery mechanics.** Per the plan, the harness will read the hub's activation manifest first and hard-fail `vacuous` before doing any comparison work if `servingAuthority !== 'compiled'`. Once past that guard, it translates the compiled `targetQualifiedIds` into the frozen evaluator's `observedResources` shape via `qualifiedIdToLeaf`, then calls the frozen `evaluateRouteGold` unmodified — the frozen trio's judgment is never re-implemented, only fed translated input. The new verdict sub-state classification (`compiled-serving | legacy-fallback-drifted | broken-compiled-path`) will live entirely inside `run-skill-benchmark.cjs`'s existing verdict→exit-code map, inspected by the outer switch before it decides BLOCKED/CONDITIONAL/DEGRADED. `build-report.cjs` will render the resulting `row.compiledParity` into a `compiledRouting` Markdown block from JSON — no hand-authored per-run report will be produced.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| The verdict sub-state will live in `run-skill-benchmark.cjs`, never `score-skill-benchmark.cjs` | The orchestrator review's highest-priority SAFETY correction — the frozen scorer must stay byte-identical; the non-frozen orchestrator already maps verdict → exit codes |
| `qualifiedIdToLeaf` will land in the shared `leaf-resource-contract.cjs`, not a local copy | `008-sk-code-alignment-and-drift-guards` cites the same primitive (CF-SC-2); one shared implementation avoids drift between the two children |
| The vacuous-parity guard will read the hub manifest directly rather than waiting on 002's wired probe | Keeps this child buildable without a hard dependency on 002's `advisor_status`/`session_bootstrap` wiring landing first — CF-BM-2's own precondition is only the manifest file |
| This packet will be the single named blocking drift-gate owner | F-25-8 — prevents two gates disagreeing, or neither blocking |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet executed. The verification plan (`tasks.md` Phase 3, `checklist.md` Testing) defines: a frozen-trio SHA-256 diff, a vacuous-parity fixture sweep across all 7 hub manifests, a `qualifiedIdToLeaf` bijection Vitest, a flag-state matrix Vitest, a verdict sub-state Vitest, and a rendered-report fixture test. None of these has run. This section will be replaced with real results and evidence citations once the harness is implemented — it must not be read as a completion record until then.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a planning-only packet.** Zero lines of the harness exist yet. Every CF-ID citation is grounded in `../001-research/review-v1.md` and `../001-research/synthesis-v1.md`; none has been re-verified against a running harness.
2. **Soft-coupled to 002.** The vacuous-parity guard's manifest-schema assumption (`servingAuthority`, `selectedPolicy`, `shadowOnly` at `activation/<hub>/manifest.json`) is read from the current `010-live-activation` shape. If 002's ADR-003 promotion relocates or reshapes this file, this child must re-anchor before implementation.
3. **The frozen-trio digest values this spec cites are copied from `010-live-activation/implementation-summary.md`.** Implementation must re-verify them directly rather than trusting the copy.

<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    status: planned
    current_focus: "Level-2 planning docs authored for the compiled Lane C parity harness (CF-BM-1..8, F-15-3, F-25-8); zero implementation yet"
    next_steps:
      - "Implement compiled-routing-parity.cjs + the 2 orchestrator hooks once the hub manifest surface is confirmed stable"
      - "Re-anchor all file:line citations on the named symbols before editing (review-v1 line-drift note)"
    blockers:
      - "002-runtime-promotion-and-status-foundation not yet built (soft dependency via the vacuous-parity guard's manifest read)"
-->
