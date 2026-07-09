---
title: "Phase 007: Native per-iteration model schedule for deep-loop fan-out"
description: "Design (spec only) a first-class contract-compliant per-iteration model schedule for deep-loop fan-out: an operator requests a fixed-count heterogeneous schedule (e.g. nine iterations on minimax MiniMax-M2.7-highspeed then one on claude-opus-4-8) via /deep:start-review-loop, /deep:start-research-loop, and shared deep-loop-runtime, so future runs never hand-roll a worker pool like packet 122 review did. Models the schedule as ordered single-executor lineages (bands) over existing fan-out via a thin iterationPlan flag desugaring one-to-one into ordered lineages plus minimal sequencing. Produces schema, routing, audit, merge-precedence, command-surface design; implementation is this phase's future work."
trigger_phrases:
  - "123 phase 007 model schedule"
  - "per-iteration model schedule fan-out"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/009-deep-loop-parallel-fanout/007-native-per-iteration-model-schedule"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-2 lean docs for iterationPlan model-schedule design phase"
    next_safe_action: "T1 confirm sibling convention then T2 front-load fan-out API research"
    blockers: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Phase 007 — Native per-iteration model schedule for deep-loop fan-out

## Purpose
Design (spec only) a first-class, contract-compliant way for an operator to request a fixed-count heterogeneous per-iteration model schedule through the canonical `/deep:start-review-loop` and `/deep:start-research-loop` commands and the shared `deep-loop-runtime`. Motivating example: nine iterations on `minimax MiniMax-M2.7-highspeed` then one on `claude-opus-4-8`, so future runs never hand-roll a worker pool the way packet 122 review did. This phase produces the schema, routing, audit, merge-precedence, and command-surface design; implementation is this phase's own future work (no code here).

**Background — the packet 122 deviation:** packet 122 review ran a heterogeneous per-iteration model mix by hand-rolling a shell worker pool (`run_one.sh` with a `case` statement assigning per-iteration dimensions and a `xargs`-style fan-out). That bespoke machinery bypassed the shared `deep-loop-runtime` dispatch, the externalized JSONL state machine, and the consumer merge; it worked once but is unreproducible through the supported command surface and violates deep-review forbidden patterns.

**Problem statement — the contract gap:** there is no supported way to express "run band A on model X for N iterations, then band B on model Y for M iterations" through the canonical commands. Existing fan-out (phases 001-006) runs homogeneous lineages concurrently and merges once all complete; it has no ordered heterogeneous per-iteration schedule and no ordered/seeded band sequencing, forcing operators back toward the packet 122 hand-rolled path.

## Scope
**In:**
- Design a fixed-count heterogeneous per-iteration model-schedule capability expressible via the canonical `/deep:start-review-loop` and `/deep:start-research-loop` commands and the shared `deep-loop-runtime`.
- Schema/flag design: an `iterationPlan` of ordered bands (from-to or count; executor kind and model; optional focus/dimensions; optional dependsOn/order) plus the `iteration-plan` (a.k.a. `model-schedule`) flag desugaring one-to-one into the existing `executors` lineage array, integrated through `step_fanout_spawn`, `step_fanout_spawn_cli`, `fanout-pool.cjs`, `fanout-run.cjs`, `fanout-salvage.cjs`, and `executor-config.ts` (reuse-first; no parallel dispatcher).
- Ordered/sequential bands: a minimal `dependsOn`/`order` extension so a later band runs only after an earlier completes, with optional seed-context handoff, enforced inside the existing pool driver (no ad-hoc shell).
- Per-band focus/dimension assignment (generalizing the packet 122 `run_one.sh` dimensions) threaded into existing per-iteration prompt construction for both review and research.
- Per-iteration/per-band executor audit and tracing (band and model attribution) in the JSONL state log, deltas, and findings registry; plus merge-precedence as an ordered band-priority list in `fanout-merge.cjs` preserving review severity rollup and research dedup/attribution.
- Contract-compliance and backward-compat design: satisfy every deep-review forbidden pattern (no ad-hoc shell fan-out; no direct CLI loop; no `/tmp` prompt dispatch; no Task-tool agent dispatch; no skipping the JSONL state machine; state under the local review/research packet); preserve read-only, externalized-state, and per-iteration-JSONL contracts; keep single-executor and homogeneous fan-out byte-identical with opt-in absent-by-default fields.
- A Level-2 lean phase spec plus ordered tasks and risks numbered `007`, reusing the packet deep-research-before-build convention if siblings use it.

**Out:**
- Implementing the capability — design/spec only; the build is this phase's future work.
- Any code edits to fan-out scripts, `executor-config.ts`, the auto/confirm YAML, or the deep-review / deep-research / deep-loop-runtime SKILL.md files in this phase.
- Inventing a new parallel orchestration system, worker-pool runtime, or state machine that competes with `step_fanout_spawn` and `fanout-pool.cjs`.
- True intra-lineage per-iteration executor rotation inside one continuous loop with cross-lineage iteration interleaving or band-synchronization barriers (rejected in favor of ordered homogeneous lineages unless desugaring proves insufficient).
- Convergence-algorithm changes (newInfoRatio, Bayesian scoring) beyond making per-band max-iterations and ordered bands interoperate with existing convergence.
- New executor kinds/providers/models beyond those registered (minimax, codex, claude, opencode, gemini, devin, native) and changes to the single-executor default path or existing homogeneous fan-out merge semantics.
- Re-litigating or modifying packet 122 hand-rolled artifacts.

## Success
- Command surface and one-to-one desugaring into existing fan-out lineages specified; desugaring pinned to real fan-out and `executor-config` entry points.
- No parallel dispatcher introduced; existing machinery reused.
- Ordered bands, seed-handoff, per-band focus, and model attribution covered.
- Merge precedence keeps the severity-rollup invariant (any active P0 from any band forces merged FAIL).
- Every deep-review forbidden pattern mapped and opt-in byte-identical proven.
- Valid Level-2 packet 123 child numbered `007`.

## Risks
- **Sequencing gap:** existing fan-out runs lineages concurrently and jumps to synthesis once all complete; band B after band A with optional seeding needs an ordered/`dependsOn` extension to `fanout-pool.cjs` that does not yet exist, so it may be underestimated as pure sugar. Mitigation: front-load research to confirm whether ordering is sugar over concurrency caps or a genuine minimal pool-driver delta, and scope it explicitly.
- **Reuse-vs-rewrite drift:** pressure to match packet 122 per-iteration-dimension UX could tempt true intra-loop executor rotation (the hard path needing band-sync barriers and iteration interleaving). Mitigation: hold the ordered-homogeneous-lineage framing and keep intra-loop rotation out of scope unless desugaring is proven insufficient.
- **Merge-precedence regression:** generalizing the any-P0-to-FAIL rule into ordered band-priority risks weakening strongest-restriction, since a lower-priority band P0 must still escalate. Mitigation: specify precedence as conflict-resolution only, with severity rollup preserved as an invariant above band priority.
- **Contract-compliance illusion and two-consumer divergence:** a loosely specified band-priority or ordered layer could resemble the forbidden ad-hoc dispatcher, and research dedup/attribution versus review severity-rollup may fit one design unevenly. Mitigation: explicit per-forbidden-pattern mapping; require all dispatch inside `step_fanout_spawn` and the fan-out scripts; specify the band-priority and audit model for both consumers with differences called out.
- **API-assumption and scope-creep risk:** candidate files are enumerated but not re-read in this design pass, so specifying against a stale interface or drifting into code edits would mislead implementers. Mitigation: success criteria require locking the desugaring contract against actual entry points via the front-loaded research task; scope-out forbids code edits in this phase.

## Out of scope
Implementation/build of the capability; any code edits; a competing parallel orchestrator; true intra-lineage executor rotation; convergence-math changes; new executor kinds; packet 122 artifact changes (all deferred or excluded per Scope/Out above).
