# Execution & Sequencing Strategy

> How the 15 implementation phases (003-017) order, what parallelizes, and the discipline that keeps the running system consistent at every commit. Research phases 001-002 are read-only inputs. Derived from the GPT-5.6-sol (ultra) design review. Mechanics live in each phase child; this is the coordinator's map.

## 1. The one rule that drives everything: additive-dark until parity

The runtime is **live and stateful**. The new spine (typed event ledger + authorization gateway + sealed artifacts) is therefore built **behind** the legacy path, recording in parallel but **never authoritative**, until its replacement for a given mode proves **shadow parity** and a **rollback drill** passes. Authority moves in exactly one phase (014), one mode at a time, behind a rollback window. Legacy writers are deleted last (015), only after zero-use telemetry. No commit in this program leaves the system unable to run an in-flight loop.

## 2. Dependency DAG

```
003 baseline/taxonomy/state census
        │
004 architecture + 178-row ledger + transition contract
        ├──────────────┬───────────────────────────────┐
005 fanout            006 ledger core (+auth gateway, dark)
live-tools unblock         │
(backward-compat,     007 shared evidence/control services
 dispatch-only)            │
        │             008 compatibility + shadow parity + rollback bridge
        │                  ├───────────────┐
        └──────────────► 009 durable fan-out/fan-in
                           │
                       010 novelty / claims / continuity / projections
                           │
                       011 convergence / termination / health
                           │
                       012 shared mode contracts + write-set conflict graph
                           │
                       013 per-mode migrations ×8 (fractal; shadow-parity only)
                           │
                       014 staged state migration + authority cutover (per mode)
                           │
                       015 legacy-writer retirement (zero-use gated)
                           │
                       016 whole-system gate (frozen SHA)
                           │
                       017 integrate-latest + rerun gate + closeout
```

## 3. What can run in parallel

- **005 vs 006/007.** The fan-out live-tools unblock (005) touches dispatch only and changes no canonical persistence, so it runs **concurrently** with the ledger core + shared services (006/007). It is the operator's most-requested capability and ships first for that reason.
- **Inside 007.** Receipts, sealed-artifact mechanism, adjudication service, budgets, gauges, locks, and continuity identities are largely independent service modules and parallelize behind the 006 envelope contract.
- **Inside 013 (the big fan-out).** The eight mode workstreams are parallel **only** to the extent the 012 write-set conflict graph allows. Hard constraints: `004-deep-improvement-common` precedes `005-agent-improvement` / `006-model-benchmark` / `007-skill-benchmark` (shared packet + scoring backend); `008-deep-alignment` and `002-deep-review` are serialized or fenced where they share the review loop. Non-conflicting modes (research, council) run concurrently. (These are the mode numbers inside phase 013, not program phases.)

## 4. The critical path

`003 → 004 → 006 → 007 → 008 → 009 → 010 → 011 → 012 → 013 → 014 → 015 → 016 → 017`.

005 is off the critical path (parallel to 006/007). The longest pole is **013** (eight fractal mode migrations); 012's conflict graph decides how much of 013 is wall-clock-parallel vs serialized.

## 5. Per-phase gate contract

Every phase, before handing off:
1. Strict-validates independently (`validate.sh --strict` Errors 0).
2. Produces a **blocking SOL verifier receipt** bound to its exact commit (the 017-depth authoring discipline).
3. For substrate/mode phases: proves **shadow parity** vs the 003 baseline — the dark path reproduces legacy behavior — before anything it feeds is allowed to consume it.
4. Emits its artifacts keyed to BASE so a later phase can prove non-regression by ID + semantics, not count.

## 6. Worktree & concurrency

Pin BASE in 003; execute on an isolated worktree (sk-git lifecycle); one writer at a time or satellite worktrees merged serially; path-scoped commits; integrate-latest + full gate rerun in a clean worktree at 017. Because other lanes commit to the shared checkout, 017 re-censuses touched contracts and **reopens any phase whose inputs drifted** before the final gate.

## 7. Open sequencing decisions (deferred, per the review)

- The parallelism model for 013 (single writer + serial SOL verify vs satellite worktrees per non-conflicting mode) is decided in **012** once the write-set conflict graph is known; default is serial-single-writer.
- The rollback window length + the evidence that authorizes each mode's authority flip is decided in **014**.
