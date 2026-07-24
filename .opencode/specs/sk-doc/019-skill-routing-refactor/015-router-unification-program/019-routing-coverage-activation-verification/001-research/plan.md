---
title: "Implementation Plan: Routing Coverage — Deep Research"
description: "How the 25-iteration deep-research loop investigated enable-by-default activation and the four named coverage gaps across four models, and how the fresh-Opus synthesis, Sonnet adversarial verification, and orchestrator reconciliation turned 143 raw findings into the authoring brief for children 002-011."
trigger_phrases:
  - "routing coverage research plan"
  - "deep research loop execution plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Routing Coverage — Deep Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | The `/deep:research` state machine (`system-deep-loop`) — no manual `/tmp` state, no direct agent dispatch outside the loop |
| **Models** | `gpt-5.6-sol` (high/ultra) and `gpt-5.6-terra` (xhigh) via `cli-codex`; `minimax/MiniMax-M3` and `zai-coding-plan/glm-5.2` via `cli-opencode` |
| **State artifacts** | `research/deep-research-state.jsonl`, `research/iterations/iteration-NNN.md`, `research/findings-registry.json`, `research/progress.log`, `research/logs/*.err` |
| **Convergence policy** | No early convergence — the full 25-iteration schedule ran regardless of per-iteration new-info signal |
| **Consolidation chain** | Fresh-Opus synthesis → Sonnet adversarial verification → orchestrator reconciliation |

### Overview

Two independent dispatch queues (`cli-codex` and `cli-opencode`) ran 25 fixed-schedule iterations against the live repository with no early-convergence stop: 18 iterations via `cli-codex` (10 `gpt-5.6-sol` high, 3 `gpt-5.6-sol` ultra, 5 `gpt-5.6-terra` xhigh) and 7 via `cli-opencode` (5 `minimax/MiniMax-M3`, 2 `zai-coding-plan/glm-5.2`), confirmed by `research/progress.log` reaching `total=143` at iteration 25 with `exit_code=0` on every entry and the explicit `opencode queue drained` / `codex queue drained` / `=== harness COMPLETE ===` markers. A fresh-Opus pass then consolidated the 143 raw findings into ranked, deduplicated findings across seven workstreams plus unnamed risks (`synthesis-v1.md`); a fresh Sonnet 5 agent with no prior context adversarially re-verified the load-bearing spine against live source with exact line ranges, not grep-only (`verification-v1.md`); and an orchestrator reconciled both into the authoring brief consumed by children `002`-`011` (`review-v1.md`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All four models were authenticated and smoke-tested before the run; the MiniMax Token-Plan-vs-Direct-API slug mismatch was caught by the smoke test and corrected to `minimax/MiniMax-M3` before launch.
- [x] The 25-iteration model/effort/focus schedule was fixed in advance (no ad hoc reassignment mid-run).
- [x] The four named coverage gaps (catalogs 0/24, benchmark legacy-only, playbooks 0/39, durable results 0 outside specs) plus an explicit "dig for unnamed gaps" mandate were the iteration brief.

### Definition of Done
- [x] 25/25 iterations completed with no early-convergence stop and zero weak/0-finding iterations.
- [x] `synthesis-v1.md` consolidates the 143 raw findings into a corrected 47-count across 7 workstreams, unnamed-gaps ranking, a P0→P4 safety graph, and a 002-011 child-spec breakdown.
- [x] `verification-v1.md` re-checks all 8 must-verify spine claims plus 12 more top recommendations against live source; verdict SPEC-READY-WITH-CORRECTIONS.
- [x] `review-v1.md` reconciles both into the verified spine, corrections, omissions, and the confirmed 002-011 authoring brief.
- [x] No recommendation edits a frozen scorer file or changes a routing decision.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fan-out iterative research with adversarial re-verification. Two model-diverse dispatch queues run fixed-schedule, no-early-convergence iterations against the live repository; findings accumulate in one append-only registry; a fresh consolidation pass and an independent fresh adversarial pass each see only the accumulated artifacts, never each other's live reasoning — so the verification step is a genuine second opinion, not a rubber stamp.

### Key Components
- **`research/deep-research-state.jsonl`**: one line per iteration (`iteration`, `model`, `effort`, `focus`, `key_findings`, `newInfo`, `converged`, `exit_code`, `ts`) — the canonical per-iteration ledger.
- **`research/iterations/iteration-NNN.md`** (×25): the full per-iteration research output.
- **`research/findings-registry.json`**: the accumulated 143 raw findings, growing monotonically iteration-over-iteration.
- **`research/progress.log`**: LAUNCH/DONE pairs per iteration with running totals and the two-queue-drain markers.
- **`synthesis-v1.md` / `verification-v1.md` / `review-v1.md`**: the three consolidation documents, each read-only with respect to the raw research state.

### Data Flow

```text
fixed 25-iteration schedule (2 queues: cli-codex, cli-opencode)
              |
              v
   iteration N runs against live repo --> key_findings appended to
   findings-registry.json + iterations/iteration-NNN.md + progress.log
              |
   (repeat 25x, no early-convergence stop)
              v
        fresh-Opus synthesis (143 -> 47 consolidated, corrected from a 48 miscount)
              |
              v
        fresh Sonnet 5 adversarial verification (8 must-verify + 12 more, live re-check)
              |
              v
        orchestrator reconciliation (verified spine + corrections + omissions
        + confirmed 002-011 breakdown + authoring directives)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is read-only research; the "surfaces" are the live source files investigated, not modified.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `advisor-recommend.ts`, `mk-skill-advisor-bridge.mjs`, `mk-skill-advisor-launcher.cjs`, `subprocess.ts` | Compiled-decision attach/drop path | Read-only investigation | Cited `file:line` re-opened with exact ranges in `verification-v1.md` §1 |
| `011-runtime-engine/lib/compiled-route.cjs`, `resolve.cjs` | Runtime engine-dispatch + resolver | Read-only investigation | `HUB_CHILD` map and `ACTIVATION_ROOT` resolution independently re-confirmed |
| `010-live-activation/activation/<hub>/manifest.json` (all 7) | Per-hub serving manifest | Read-only investigation (`cat`'d all 7) | Upgraded from the synthesis's own 1/7-confirmed + 6-inferred to a full 7/7 CONFIRMED |
| `activate-hub.cjs`, `flip-serving.cjs` | Fenced-CAS activation driver | Read-only investigation | Rollback/audit-integrity citations (`CF-ACT-8`) re-verified line-exact |
| `run-skill-benchmark.cjs`, `score-skill-benchmark.cjs`, `build-report.cjs` | Lane C benchmark orchestrator + frozen scorer + renderer | Read-only investigation | Frozen-file boundary re-confirmed; the safe non-frozen fix-site for `CF-BM-4` identified |
| `verify_alignment_drift.py`, `sk-code-router-sync.vitest.ts` | RESOURCE_MAP drift guards | Read-only investigation | Markdown-blindness and cross-reference gap both re-confirmed |
| Three frozen scorer files | Frozen route-gold scorer | **Never touched — read-only citation only** | No recommendation in any of the three documents proposes an edit |

No live routing config, mode registry, hub router, manifest, or skill file was written during this phase.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Authenticate and smoke-test all four models; catch and correct the MiniMax slug mismatch before launch.
- [x] Fix the 25-iteration model/effort/focus schedule across the two dispatch queues.
- [x] Initialize `deep-research-state.jsonl`, `research/iterations/`, `findings-registry.json`, and `progress.log`.

### Phase 2: Core Implementation
- [x] Run iterations 1-25 with no early-convergence stop across the two queues (`cli-codex`: 10 SOL-high + 3 SOL-ultra + 5 TERRA-xhigh = 18; `cli-opencode`: 5 MiniMax + 2 GLM-max = 7).
- [x] Append each iteration's `key_findings`, full iteration Markdown, and progress-log LAUNCH/DONE pair; confirm monotonic findings growth (5 → 143 across the run).
- [x] Confirm zero weak/0-finding iterations and `exit_code=0` on all 25.

### Phase 3: Verification
- [x] Fresh-Opus synthesis: consolidate 143 raw findings into ranked, deduplicated findings across 7 workstreams + unnamed-gaps ranking + a P0→P4 safety graph + a 002-011 child-spec breakdown + a build sequence (`synthesis-v1.md`).
- [x] Fresh Sonnet 5 adversarial verification, no prior context: re-open every file cited by the 8 must-verify spine claims plus 12 more top recommendations with exact line ranges; cross-check all 143 raw findings programmatically; read `iteration-025.md` (the run's own completeness critic) in full (`verification-v1.md`).
- [x] Orchestrator reconciliation: fold in the corrections, add the 3 omitted requirements, confirm the 002-011 breakdown, and issue authoring directives (`review-v1.md`).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Adversarial re-verification | 8 must-verify spine claims + 12 more top recommendations | Fresh Sonnet 5 agent, no prior context, exact `sed -n`/Read line ranges (not grep-only) |
| Cross-check | All 143 raw findings vs. the synthesis's 7 workstream tables + unnamed-gaps section | Programmatic severity/area distribution + full P0 text dump comparison |
| Completeness critic | The run's own self-critique iteration | Full read of `iteration-025.md` |
| Citation spot-check | Highest-impact `file:line` citations | Direct re-open against the live repo, recorded in `synthesis-v1.md` Appendix A |
| Manual (complete) | 010-live-activation's all-7-manifests-compiled claim | `cat`'d all 7 `010-live-activation/activation/<hub>/manifest.json` directly, upgrading it from partial to full CONFIRMED |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|---------------------|
| Four models (`gpt-5.6-sol`, `gpt-5.6-terra` via `cli-codex`; `minimax/MiniMax-M3`, `zai-coding-plan/glm-5.2` via `cli-opencode`) | External | Complete | All 4 authenticated and smoke-tested before the run; the MiniMax slug issue was caught pre-launch, not mid-run |
| `/deep:research` state machine (`system-deep-loop`) | Internal | Green | Provided the JSONL/iterations/findings-registry/progress-log discipline; no manual state was hand-rolled |
| Live repository as ground truth | Internal | Available | Every CONFIRMED citation in `verification-v1.md` was re-opened against the actual on-disk source this session |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A weak or 0-finding iteration; a model authentication failure mid-run; a citation found to be fabricated rather than merely imprecise.
- **Procedure**: This phase is read-only research with no external effect to undo. The realized rollback path was a single-retry-on-transient-failure for `cli-opencode` iterations (per `spec.md` L2 Edge Cases); no iteration was discarded or re-run for weak findings because none occurred. Any future correction to a research claim is handled by amending the relevant consolidation document (`synthesis-v1.md`/`verification-v1.md`/`review-v1.md`), never by silently editing raw iteration output.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup / auth + schedule + state init) ──► Phase 2 (Core / 25 iterations, no early convergence) ──► Phase 3 (Verify / synthesis + adversarial verify + review)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Model auth + smoke-test | Core |
| Core | Setup | Verify |
| Verify | Core (full 143-finding registry) | The 015 children's authoring (002-011) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|---------------------|
| Setup (auth + schedule + state init) | Low | One-time, fixed schedule for all 25 iterations |
| Core (25 iterations, 2 queues) | High | ~1h25m wall-clock per `progress.log` timestamps (19:21:43Z → 20:45:56Z), fully automated |
| Verification (synthesis + adversarial verify + review) | High | Three sequential fresh-agent passes, each reading the full accumulated state |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-activation checklist
- [x] All 4 models authenticated and smoke-tested; slug mismatch corrected before launch.
- [x] Fixed iteration schedule recorded before the run started.
- [x] Convergence policy (no early stop) fixed in advance.

### Rollback procedure
1. Re-run policy: on a transient `cli-opencode` failure, retry once (no other retry policy was needed — realized outcome was zero retries beyond this).
2. Correction policy: a citation or claim found imprecise or wrong is corrected in the consolidation documents, never by silently rewriting a raw `iterations/iteration-NNN.md` file.
3. Escalation policy: a genuine contradiction between two consolidation documents is resolved by the next document in the chain (verification resolves synthesis contradictions; review resolves verification/synthesis contradictions) — realized once, for the ADR-003 residual-coupling contradiction (`review-v1.md` §2).

### Data reversal
- **Has runtime effect?** No — this phase is read-only research; nothing outside the `001-research/` tree was written.
- **Reversal procedure**: None required; no external state exists to undo.
<!-- /ANCHOR:enhanced-rollback -->
