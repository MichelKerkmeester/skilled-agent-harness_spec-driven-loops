---
title: "Implementation Summary: drift census and plan revalidation"
description: "Running record of the two-lineage drift census over the 036 implementation program: what has been built and verified so far, and what remains before a per-phase verdict table exists."
trigger_phrases:
  - "drift census summary"
  - "036 revalidation status"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/018-drift-census-and-plan-revalidation"
    last_updated_at: "2026-07-19T18:16:02Z"
    last_updated_by: "claude-opus"
    recent_action: "Ran the census, merged both lineages, applied Tier-1 repairs"
    next_safe_action: "Decide Tier-2/Tier-3 handling"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    completion_pct: 85
    open_questions:
      - "Does the packet-033 benchmark dependency survive its renumber?"
      - "Did the routing commits change the registered-mode count phase 013 assumes?"
    answered_questions:
      - "Baseline = 0ce43ff589 (2026-07-16)"
      - "Forced depth is expressed as stop-policy max-iterations, not a lowered threshold"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Summary: Drift Census and Plan Revalidation

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | In Progress |
| **Stage** | Census done, Tier-1 repairs applied; Tier-2 and Tier-3 still open |
| **Level** | 2 |
| **Started** | 2026-07-19 |
| **Baseline** | `0ce43ff589` (2026-07-16) |
| **Range under census** | supplied as 204/22; both lineages corrected it independently — sol 211/27, glm 205/25 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Complete:**
- The census phase scaffold: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and this summary, registered as
  child 018 of the 036 phase parent.
- Baseline determination: `0ce43ff589` identified as the merge that landed the normalized 036 packet on v4, with
  204 commits since — 183 AI-co-authored by concurrent sessions, 22 inside the `system-deep-loop` runtime.
- Executor verification: both dispatch paths confirmed working before any budget was spent.

- The census loop: two independent lineages, 7 iterations each, 0 failed, merged via `fanout-merge.cjs`
  (2 lineages, 14 key findings) into `research/research.md`.
- **Tier-1 repairs applied** (operator instruction 2026-07-19, superseding this packet's census-only scope):

| Repair | Sites | Basis |
|--------|-------|-------|
| `003` dead runtime paths → kebab-case | 3 (`plan.md`, `spec.md`) | First-order drift, both lineages + prior analysis |
| `003` benchmark provenance → archive path, with a warning that the bare number now names an unrelated packet | 2 (`spec.md:57,119`) | Open question B |
| `004/002` ledger phase-ID space `000..014` → `003..017`; "15 manifest phases" → "15 implementation phases" | 6 across 4 docs | Validator targeted a phase space the manifest does not have |
| `mode_workstreams_phase_010` → `_phase_013` | 17 refs / 15 files | Manifest key did not exist; `012` P0 validators derived from it |
| `manifest/phase-tree.json` packet identity `065` → `036` | 1 | 116 docs treat this manifest as authority |

**Pending:**
- Tier-2 and Tier-3 items below — deliberately not attempted.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The loop is command-owned. `/deep:research` owns setup, per-iteration dispatch, reducer sync, convergence
telemetry, and synthesis; the census is expressed as two independent lineages so two models investigate the same
charter without one being able to stop the other. Forced depth is expressed through the stop policy rather than by
lowering the convergence threshold, so convergence data is still recorded as telemetry and remains readable
afterward.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Additive phase 018 rather than renumbering | Additive numbering cannot re-trigger the reference-corruption class that a prior renumber introduced across this packet |
| Census the full commit range, not a runtime-path subset | The one confirmed drift hit to date originated outside the runtime, in a repo-wide rename |
| Two independent lineages instead of one longer loop | Disagreement between models is itself signal; a single loop cannot produce it |
| Forced depth via stop policy, not a lowered threshold | Keeps convergence as readable telemetry instead of destroying the signal |
| Verdicts only during the census; Tier-1 repairs applied afterwards on operator instruction | Keeping them sequential preserves the guarantee that every phase was assessed against an unmodified tree before anything was edited |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Both executors dispatch | Confirmed — both returned their expected sentinel |
| Fan-out spec-gate injection present | Confirmed at `fanout-run.cjs:1789-1790` |
| Folder validates strict | PASS — errors=0 warnings=0 |
| Parent validates after registration | PASS — full-tree sweep 125/125 clean |
| Per-phase verdicts complete | PASS — 15/15, no "unknown"; both controls passed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- GLM's `--variant max` is confirmed to dispatch but its forwarding of native `reasoning_effort` is unverified
  upstream; effort should be treated as best-effort rather than guaranteed.
- The shared branch continues to move during the census, so verdicts are valid against the pinned SHA only.
- **Tier 2 — COMPLETED 2026-07-19 semantically, not mechanically.** 380 cross-phase reference repairs across
  199 files by 17 agents on disjoint file batches, every change adversarially audited by an independent agent
  (380/380 audited, 2 rejected as regressions and corrected by hand). Breakdown: C1 006/007 service
  misattribution 214, C2 leaf self-description index+3 107, C5 nav-line wrong parent 32, C7 broken `../`
  depth 27. Plus 80 `065` packet-identity fossils resolved and the 004/003 ownership matrix corrected.
  The audit caught exactly the failure mode predicted: one agent mechanically rewrote "the 006 parent spec"
  to "the 010 parent spec" when that phrase is a fossil of the DELETED 006 wrapper meaning the packet root
  (036), and another let a `phase-007` label distribute over the 006-owned transition gateway.
  Deliberately preserved: `013/006-model-benchmark/002-*/spec.md` "under the 006 parent" is CORRECT — its
  parent directory really is `006-model-benchmark`, a mode, not program phase 006. Residual by design:
  `002-deep-loop-effectiveness-and-fanout` keeps its stale refs as a frozen read-only research input.

- **Tier 3 — planning work, not adjustment.** The `016` exact-SHA gate redesign, the `007`/`010`/`011` amendments
  to start from shipped substrate, and the `012`/`013` scope extensions. These change what the phases *do*, and
  belong in a scoped planning pass with the operator, not in a repair sweep.
- Five phases (`006`, `007`, `010`, `011`, `016`) rest on an adjudicated reading rather than unanimous agreement;
  a corrected-depth GLM re-run would settle them on evidence.
<!-- /ANCHOR:limitations -->
