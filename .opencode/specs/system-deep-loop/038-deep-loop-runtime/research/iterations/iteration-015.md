# Iteration 15: Round G Verify — Q3-Fanout-Recovery Integration Seam

## Focus
Round G deep-dive on the best-anchored Deep Loop reliability candidate: Q3-fanout-recovery (transient/fatal classification + re-dispatch a failed branch ALONE). Pin the exact integration seam + double-count risk. Read-only.

## Assessment — REAL / CAUTION (newInfoRatio 0.45)
- **Integration seam:** `fanout-run.cjs:480` (the `if (timedOut || exitCode !== 0)` throw) — wrap the run+exit-check block (`:454-491`) in a **bounded attempt loop**: classify the failure and re-invoke `runLineageProcess` (`:454`) on transient, throw only when fatal/attempts-exhausted. The pool primitive (`fanout-pool.cjs`) stays untouched.
- **Double-count risk:** **NO** if retries stay INSIDE the worker (it settles `fulfilled` → retry-success counted as success, never masked as the original failure). **YES** if done as a second pool pass over rejected items + summed summaries (double-counts the same branch + breaks the exit-code at `:504`). Secondary: the `onEvent` ledger emits a `failed` line per attempt — tag retried attempts (`event:'retrying'`/`attempt:n`) so ledger-counting consumers don't double-count.
- **Salvage interaction:** orthogonal — `runSalvageSweep` recovers iteration-NNN.md FILES from stdout (counts files, not lineages); re-dispatch re-runs the whole branch, so salvage stays the partial fallback and should run only on the FINAL post-retry stdout.
- **Correction:** `classifyExitCode` (cli-guards.cjs:116-131) maps err.code → PROCESS exit 1/2/3, NOT branch transient/fatal — **refutes "an existing classifier to extend"**; the transient/fatal split is net-new. The only existing retry primitive is the writer-lock reclaim (no branch re-dispatch).

## Key correction
Q3-fanout-recovery is **REAL/CAUTION with a clean in-worker integration** (wrap `:454-491` in a bounded retry loop) — the cleanest Deep Loop reliability GO that does NOT depend on the absent D2 keystone. The transient/fatal classifier is net-new (classifyExitCode is process-level, not branch-level). Keep retries in-worker to avoid summary double-counting.

## Next Focus
Q3-fanout-recovery is the Deep Loop reliability lead that ships independent of D2: in-worker bounded retry at fanout-run.cjs:454-491, transient/fatal classifier net-new, retries tagged in the ledger. Feeds the roadmap addendum.
