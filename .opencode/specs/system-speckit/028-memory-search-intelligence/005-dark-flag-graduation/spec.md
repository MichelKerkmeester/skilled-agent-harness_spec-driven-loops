---
title: "Spec: Dark Flag Graduation Suite"
description: "A benchmark program that puts every built-but-default-off capability in the 028 packet through the same earn-or-cut gauntlet the data-quality and search-honesty flags cleared. The cycle added 41 feature flags and reckoned most of them, but a tail of finished code ships dark behind default-off flags with no measured verdict: the track-B search tail-appends, the retrieval-class channel weights, the true-citation ledger, save-time reconsolidation, the code-graph seeded PageRank and edge-lifecycle work, the advisor RRF fusion seams, and the deep-loop finding dedup. Each gets a Level-2 benchmark phase that measures it against the real corpus or graph on the production path, diagnoses why it is not yet worthwhile, designs the refinement to make it worthwhile, and returns a graduate, refine, or cut verdict. No production default is flipped inside this program. Graduation is a separate evidence-gated decision."
trigger_phrases:
  - "dark flag graduation"
  - "benchmark the default-off features"
  - "graduate the dark flags"
  - "earn or cut the built-but-held flags"
  - "default-off capability benchmark suite"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-dark-flag-graduation"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Dark-flag graduation complete: 4 graduated, 4 cut, 1 refined"
    next_safe_action: "Run the deferred CLI test for 007-graduation-follow-ups/001-search-append-citation-probe"
    blockers: []
    key_files:
      - "spec.md"
      - "007-graduation-follow-ups/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-24-028-005-dark-flag-graduation-parent"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Eight dark-flag families were measured against the real graph and corpus; four graduated, four were cut, and the true-citation ledger was held at refine."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Dark Flag Graduation Suite

## 1. METADATA

Phase-parent for a benchmark program. The children are per-feature benchmark phases that each measure one dark flag (or one tight cluster) and return a verdict. This parent owns the shared methodology, the candidate triage, and the verdict gate. It carries no harness of its own.

| Field | Value |
|-------|-------|
| **Status** | complete |
| **Level** | phase |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../004-review-remediation/spec.md` |
| **Successor** | `../006-speckit-surface-alignment/spec.md` |

## 2. PROBLEM & PURPOSE

### Problem Statement

This cycle added 41 feature flags. The winners graduated to default-on under benchmark evidence and 16 losers were cut, but a tail of finished, working code still ships dark behind default-off flags with no measured verdict either way. These are not abandoned experiments. They are built, they pass their unit tests, and they are byte-identical when off. They have simply never been measured against the real corpus on the production path, so nobody knows whether each one is a latent win waiting for a switch, a near-miss that one refinement would rescue, or dead weight to cut like the other 16.

A specific myth needs breaking. Several search appends are documented as held off because the production route truncates to a three-result floor, so a tail-additive append never reaches the reader. The packet's own benchmark record contradicts that: `DEFAULT_MIN_RESULTS = 3` is a never-cut-below-three floor guarantee, not a cap, and the route returns up to twenty. The real prod-limiting stage is token-budget truncation, and the thing that splits eval from prod is the eval-vs-prod fidelity gap, not a hard top-three window. So the held-off reasoning is a hypothesis this suite must test on the production path, not a settled fact.

### Purpose

Give every dark flag the same rigorous, real-corpus, earn-or-cut treatment the data-quality flags got. For each, measure the current behavior on the production path, diagnose why it is not worthwhile yet, design the refinement that would make it worthwhile, and return a graduate, refine, or cut verdict backed by a reproducible benchmark. Turn a tail of unmeasured dark code into a clear roadmap of what to graduate, what to fix first, and what to delete.

## 3. SCOPE

### In Scope

The benchmark phases for these candidate clusters, each a child under this parent:

- **001 search tail-appends** — `SPECKIT_DETERMINISTIC_MULTIHOP` and `SPECKIT_LANE_CHAMPION_BACKFILL`. Both append missed candidates to the result tail with no new query. Test whether they lift multi-target recall on the production path and whether the three-result floor actually blocks them.
- **002 retrieval-class weights** — `SPECKIT_RETRIEVAL_CLASS_ROUTING`. The classifier runs always-on, this flag gates the per-class channel suppression. Test whether suppressing the graph and degree channels for narrow single-hop queries raises precision without costing recall.
- **003 true-citation ledger** — `SPECKIT_TRUE_CITATION_EMITTER`. Mines the transcript for the memory ids actually referenced after a search. Test whether the ledger reaches the density and signal separation a demote-only reranker would need.
- **004 save reconsolidation** — `SPECKIT_RECONSOLIDATION_ENABLED`. Save-time merge of near-duplicate rows. Test merge precision and recall preservation, the destructive-path safety being the central risk.
- **005 code-graph seeded PageRank** — `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING`. Test whether bounded personalized PageRank beats the flat impact walk on labeled change-impact queries.
- **006 code-graph edge lifecycle** — `SPECKIT_CODE_GRAPH_EDGE_BITEMPORAL_READS`, `SPECKIT_CODE_GRAPH_EDGE_GOVERNANCE_VOCAB`, and the edge-staleness repair path. Test feasibility, name the smallest consumer that proves value, and run the fan-in reparse benchmark the staleness work is gated on.
- **007 advisor RRF fusion** — `SPECKIT_ADVISOR_RRF_FUSION`, the conflict-rerank seam, and `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`. Test whether RRF fusion plus the guards beat the weighted-sum baseline on routing agreement and top-one correctness.
- **008 deep-loop finding dedup** — `SPECKIT_FANOUT_NEAR_DUP_DEDUP` and the lag-ceiling and progress-heartbeat gauges. Test whether near-duplicate collapse cuts finding noise without losing distinct findings.

### Out of Scope

- The graduation itself. No production default is flipped inside this program. A graduate verdict is a recommendation with evidence, and the flip is a separate decision driven sequentially after the verdicts land.
- The non-feature flags. Debug and telemetry toggles, recovery and rollback overrides, and pure tuning parameters are not candidates. They are off by design, not held pending a verdict.
- The already-decided flags. The graduated honesty suite and metadata gates, and the 16 already-cut experiments, are settled.

### Files to Change

Per child phase only: its own `007/NNN-name/` folder and a self-contained harness under that folder's `scripts/`. Harnesses read a read-only backup of the live corpus or graph and never open the source for writes. No child edits shared production code in the parallel benchmark pass.

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

- Each child measures its feature on the **production path**, not only the unforced eval path, so a recall or precision number proves a prod-path keep rather than an eval-only artifact.
- Each child's harness is reproducible from committed config and reads the corpus or graph read-only.
- Each child returns one of three verdicts with evidence: GRADUATE, REFINE, or CUT.
- Default-off byte-identity is verified for every feature still behind a flag.

### P1 - Required (complete OR user-approved deferral)

- Where a refinement is tractable and lands entirely behind the existing default-off flag, the child may implement it and re-benchmark, since byte-identical-when-off makes the change safe to ship dark. Where it is not tractable in one pass, the child designs it and leaves it for a follow-up.
- Each child files a row in the suite tracking doc.

## 5. SUCCESS CRITERIA

- Every candidate cluster has a runnable benchmark and a verdict backed by real-corpus numbers.
- The truncation-law hypothesis is tested on the production path and resolved with data, not inherited as a claim.
- The suite produces a single graduation roadmap: what to graduate now, what to refine first, and what to cut.

## 6. RISKS & DEPENDENCIES

- **Eval-vs-prod fidelity gap.** A win measured on the unforced eval path can vanish on the truncation-active prod path. Every retrieval verdict must read the prod path to count.
- **Destructive paths.** Reconsolidation merges and deprecates rows. Its benchmark runs only against a backup copy and measures merge precision before any graduate recommendation.
- **Parallel safety.** Children write only their own folders and never the shared flag readers in this pass, so the eight benchmarks build concurrently without conflict.

## L2: VERDICT GATE

A child recommends GRADUATE only when the feature beats its baseline on the declared metric on the production path, by a margin larger than the run-to-run variance, with default-off byte-identity intact. REFINE means the feature shows promise but a named code change behind the flag is required first, with the change designed and ideally implemented-and-re-benchmarked. CUT means no measured win survives the prod path and the honest move is to delete the flag and its code, the same verdict that retired the 16 cut experiments.

## PHASE DOCUMENTATION MAP

| Phase | Spec |
|-------|------|
| `001-multihop-tail-appends` | [`spec.md`](001-multihop-tail-appends/spec.md) |
| `002-retrieval-class-weights` | [`spec.md`](002-retrieval-class-weights/spec.md) |
| `003-true-citation-ledger` | [`spec.md`](003-true-citation-ledger/spec.md) |
| `004-save-reconsolidation` | [`spec.md`](004-save-reconsolidation/spec.md) |
| `005-flag-name-cleanup` | [`spec.md`](005-flag-name-cleanup/spec.md) |
| `006-dark-flag-validation` | [`spec.md`](006-dark-flag-validation/spec.md) |
| `007-graduation-follow-ups` | [`spec.md`](007-graduation-follow-ups/spec.md) |
| `008-followup-deep-review` | [`spec.md`](008-followup-deep-review/spec.md) |
| `009-cross-package-flag-governance` | [`spec.md`](009-cross-package-flag-governance/spec.md) |
| `010-flag-vocabulary-consolidation` | [`spec.md`](010-flag-vocabulary-consolidation/spec.md) |
| `011-graph-preservation-quality-benchmark` | [`spec.md`](011-graph-preservation-quality-benchmark/spec.md) |
