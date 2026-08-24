---
title: "Phase Parent: Delete Over-Engineering — Runtime Residue Removal Program"
description: "Phase parent for removing the migration, rollback, and over-built machinery left in the deep-loop runtime after all 8 modes were finalized to new_authoritative_final. A prior wave removed the rollback ceremony and one-time scaffolding (now in scratch/); this program removes the second-order residue an evidence-backed audit surfaced, as five dependency-ordered deletion waves."
trigger_phrases:
  - "delete overengineering"
  - "runtime residue removal"
  - "overengineering removal waves"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering"
    last_updated_at: "2026-08-24T22:00:00Z"
    last_updated_by: "claude"
    recent_action: "Completed phase 005 CAS reduction plus F4 removal; all 5 waves green"
    next_safe_action: "Validate recursive strict then stop for operator ff-merge gate"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The removal set is proven by a 10-iteration audit plus a repo-wide zero-caller re-proof; findings live in research/research.md"
---

<!-- SPECKIT_PHASE_PARENT: true -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Phase Parent: Delete Over-Engineering — Runtime Residue Removal Program

## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/011-delete-overengineering |
| **Mode** | Phase parent (lean trio) |
| **Priority** | P0 |
| **Status** | Complete |
| **Owner skill** | system-deep-loop |
| **Authority posture** | No authority moves; removes dead machinery, keeps the live ledger loop and projections intact |

## 2. ROOT PURPOSE

Remove the migration, rollback, and over-built machinery that is dead weight now that all 8 deep-loop
modes are finalized to `new_authoritative_final` and the append-only ledger is the single write authority.

A **prior deletion wave** (completed; its docs preserved under `scratch/completed-deletion-mission/`)
removed the rollback ceremony and one-time scaffolding. This program removes the **second-order residue**
that survived it — converters, a conformance engine, one-time rollout/flip tooling, shadow adapters, and
dead constants — as five dependency-ordered, individually-verified deletion waves.

The removal set is not a guess. It is the output of a 10-iteration deep-research audit (two independent
executor models converged on the same findings) plus a repo-wide zero-caller re-proof. The full evidence,
per-finding import-graph proof, KEEP list, and wave plan live in **`research/research.md`**.

## 3. DELIVERY MODEL

- **Implementer / remover:** GLM-5.2-High via cli-devin (`glm-5-2`) performs each wave's file edits and deletions.
- **Verifier:** the orchestrator reads every diff and runs the gates (devin cannot run vitest) — tsc, `verify-authority.cjs`, and the runtime suite — after each wave.
- **Per wave:** re-grep zero callers → sever imports first → delete → tsc + authority + suite green → one commit under the 100-file mass-deletion ceiling (never overridden).
- The live ledger loop is out of scope and must survive every wave: append gateway, authorized-ledger, event envelopes, projections, replay-fingerprint, the 8 reducers, sealed artifacts, receipts, and the authority-registry read path.

## 4. PHASE MAP

| Phase | Findings | Removes | ~LOC | Risk | Status |
|-------|----------|---------|------|------|--------|
| `001-leaf-removals` | F5, F6, F8 | shadow-adapters, recovery manifest, dead constants | ~460 | Lowest | Complete |
| `002-legacy-compat-converters` | F1 | 7 per-mode `legacy-compatibility.ts` (keep deep-research) | ~4,306 | Low-Med | Complete |
| `003-mode-contracts-value-layer` | F2 | conformance engine value files (keep `mode-contract-types.ts` + `substrate-ports.ts`) | ~2,988 | Low-Med | Complete |
| `004-rollout-flip-tooling` | F3 | fleet-enablement stack (`enable-modes.cjs` + `lib/fleet-enablement/`) | ~869 | Low-Med | Complete |
| `005-authority-registry-cas-reduction` | F4, F7 | `flip-authority.cjs` + CAS mutators (keep read path) | ~830 | High-adjacency | Complete |

> **Phase 004 resequencing:** F4 (`flip-authority.cjs`) moved from phase 004 into phase 005. Its test
> (`authority-finalize.vitest.ts`) also exercises the phase-005 CAS mutator `compareAndSwapFinalize`, so
> F4 and F7 remove together — one whole-file test deletion instead of splitting it across two waves.

Resume follows `derived.last_active_child_id` in `graph-metadata.json`; when absent, list children by status and pick the lowest-numbered Planned wave.

## 5. NON-GOALS

- Deleting the live ledger loop or the consumer-facing `legacy-projections` surface.
- Touching authority records or fabricating any removed safety evidence.
- Pushing the branch. Integration to v4/main is a separate operator gate after all five waves land green.
