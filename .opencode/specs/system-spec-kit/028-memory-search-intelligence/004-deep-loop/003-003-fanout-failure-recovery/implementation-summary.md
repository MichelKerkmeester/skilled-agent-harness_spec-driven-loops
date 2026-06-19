---
title: "Implementation Summary: Deep Loop Fan-out Failure Recovery (028/004 resilience cluster)"
description: "Planning-stage implementation summary for the deep-loop resilience GO cluster (C1-C5). Records the re-plan outcome: the 5 candidates are PENDING with a confirmed dependency chain, the prerequisite 030 infra (commit 46812f12a8) is shipped, and no candidate depends on the absent D2 reliability signal. Implementation is NOT yet done — this is the planning deliverable."
trigger_phrases:
  - "fanout failure recovery summary"
  - "deep loop resilience implementation"
  - "transient fatal retry status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/004-deep-loop/003-003-fanout-failure-recovery"
    last_updated_at: "2026-06-19T08:10:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored L2 spec-doc set for resilience cluster (PENDING)"
    next_safe_action: "Capture fanout test baseline (T004), then implement C1 failure-class taxonomy (the gate)"
    blockers: []
    completion_pct: 0
    open_questions:
      - "C4 orphan auto-redispatch needs a lease/heartbeat — detect+marker is the GO half"
      - "C5 recover-vs-fresh: explicit mode flag vs inferred-from-config (decide at impl)"
      - "max_retries=5 right for the per-lineage CLI cost profile? (config-overridable default)"
    answered_questions: []
---
# Implementation Summary: Deep Loop Fan-out Failure Recovery (028/004 resilience cluster)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/004-deep-loop/003-003-fanout-failure-recovery` |
| **Status** | PLANNED — re-plan complete, implementation PENDING |
| **Completed** | n/a (planning stage; 2026-06-19) |
| **Level** | 2 |
| **Actual Effort** | Planning only; implementation effort estimated ~6-8h (structural inference, see plan.md L2 effort) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

**Nothing yet — this is the planning deliverable.** This re-plan authored the Level 2 spec-doc set for the deep-loop **resilience GO cluster**: the cleanest reliability group still open after the 030 Wave-0 pass, and the one cluster that does NOT depend on the absent D2 reliability signal. The cluster's five candidates and their dependency structure are now specified, sequenced, and broken into tasks.

The candidates (all PENDING):

| # | Candidate | What it will do | Status |
|---|-----------|-----------------|--------|
| C1 | DL-failure-class-taxonomy | surface the upstream-computed `{timeout, exit, salvage_miss}` class as a bounded label in `settleItem` + a class rollup in `buildPoolSummary` | PENDING (gate) |
| C2 | Q3-fanout-recovery | consume the pool's `failed` ledger as resumable state + a transient/fatal verdict keyed on `timedOut`/exit-code/salvage | PENDING (needs C1) |
| C3 | Q3-fanout-transient-fatal-retry | re-dispatch the FAILED lineage ALONE with a durable bounded per-branch retry budget (count from audit) | PENDING (needs C1+C2) |
| C4 | DL-orphan-lineage-reset | on resume, detect started-without-terminal lineages and mark/requeue (GO: detect+marker; CAUTION: auto-redispatch) | PENDING |
| C5 | DL-recover-vs-fresh-gate | refuse a missing/empty/corrupt resume state instead of silently fresh-init | PENDING |

### Files Changed

No production code changed in this re-plan. The authored / refined spec-doc set:

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Refined | Level 2 spec: problem, 5-candidate scope, REQ-C1..C6, complexity, edge cases; added the failure-class Logic-Sync disambiguation note |
| `plan.md` | Refined | C1→C2→C3 chain + independent C4/C5 guards; canonical L2 anchors (phase-deps/effort/enhanced-rollback) |
| `tasks.md` | Created | T001-T025 breakdown; 030 prerequisite pre-checked `[x]` with commit `46812f12a8`; all candidate tasks `[ ]` |
| `checklist.md` | Created | Level 2 verification checklist; pre-impl verified, code/test items PENDING |
| `implementation-summary.md` | Created | This document |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The re-plan read the authoritative 028 research (`../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md`), re-confirmed every cited seam against the current `.cjs` source, and reconciled the per-candidate DONE/PENDING status against the 030 Wave-0 shipped record (`030/spec.md` §14, commit `46812f12a8`). The cluster was structured as one dependency chain (C1 gates C2 gates C3) plus two independent resume-time guards (C4, C5), then broken into sequenced tasks with a per-candidate revert/verify discipline. Strict validation (`validate.sh --strict`) gated the deliverable.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| All 5 candidates marked PENDING | 030 §14 cand 12 + commit `46812f12a8` body both state it did NOT duplicate the upstream failure class; current `fanout-pool.cjs:108-126` still flattens to `error:{name,message}` |
| D2/D3/Q2 (reliability-weighted learning) explicitly OUT OF SCOPE | D2 is a wholly-absent net-new build (every input `r=0.5`); NO-GO until built AND benchmarked [iter-13] |
| C4 scoped to detect + marker (GO); auto-redispatch deferred | auto-redispatch without a lease/heartbeat risks re-running live work [synthesis 01:96 CAUTION] |
| Default-conservative classification (unknown → fatal) | a misclassification must not cause a runaway retry loop (NFR-R02) |
| Logic-Sync note added on the failure-class shipped-or-not question | synthesis `01:95` phrasing ("sibling failure-class already shipped") is imprecise vs the authoritative code; reconciled in spec §2 |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Strict validation | Pass | This sub-phase spec-doc set | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/004-deep-loop/003-003-fanout-failure-recovery --strict` |
| Seam re-confirmation | Pass | All cited file:line in spec/plan | `settleItem` `fanout-pool.cjs:84-126`, summary `:236-250`, class computed `fanout-run.cjs:639-654`, resume status default `reduce-state.cjs:434` — all verified against current source |
| Prerequisite confirmation | Pass | 030 Wave-0 Deep-Loop trio | commit `46812f12a8` present in `git log 1ecc531431..HEAD`; gauges/merge/graceful-self-stop shipped, failure-class NOT |
| Implementation tests | PENDING | n/a | per-candidate unit + regression tests run at build time (tasks T014-T022) |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| Spec-doc markdown | N/A | N/A | N/A |
| Production code | PENDING | PENDING | PENDING (no code changed in this re-plan) |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-R01 | Durable retry budget survives crash-replay | Attempt count read from ledger/audit (designed) | PENDING (test T017) |
| NFR-R02 | Unknown failure → fatal (no retry loop) | Default-conservative classifier (designed) | PENDING (test T015) |
| NFR-C01 | `error:{name,message}` shape preserved | Failure-class is an additive field (designed) | PENDING (test T012) |
| NFR-C02 | No schema migration / no daemon | Runtime stays fire-and-exit batch | Confirmed by design (no DB/daemon touched) |
| NFR-O01 | Low-cardinality failure-class rollup | Fixed `{timeout, exit, salvage_miss}` label set | PENDING (test T014) |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No measured benefit number.** No candidate has a before/after delta — all leverage/effort is structural inference. Ship for correctness/reversibility, not a promised delta.
2. **C4 auto-redispatch is gated behind a lease/heartbeat** that does not yet exist; the GO scope is detect + marker only.
3. **The reliability-weighted-learning cluster (D2/D3/Q2) is NOT addressed here** — it is NO-GO until built and benchmarked, and lives in a sibling sub-phase.
4. **Three open questions remain for implementation time** (C4 lease, C5 mode-flag-vs-inferred, `max_retries` value) — see `spec.md` §9.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Author spec/plan/tasks | Also authored checklist.md + implementation-summary.md | Level 2 strict validation requires the full five-file set, not just spec/plan/tasks |
| Use `46812f12a8` as the failure-class commit | Confirmed `46812f12a8` is the Deep-Loop trio commit (gauges/merge/graceful-self-stop) but it did NOT ship failure-class | The 030 §14 commit cell reads "(this commit)"; resolved the literal hash via git log and confirmed the candidate-12 note's "did NOT duplicate" wording |

<!-- /ANCHOR:deviations -->
