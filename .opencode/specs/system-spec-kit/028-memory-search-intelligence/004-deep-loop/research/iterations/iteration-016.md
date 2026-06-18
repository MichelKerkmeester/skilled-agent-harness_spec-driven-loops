# Iteration 16: Round H Rust Reference — aionforge-engine → Deep Loop gauges/recovery + D2-consume

## Focus
Round H: mine `aionforge-engine` for the observability + recovery + reliability-consumption reference — Deep Loop DL-pool-gauges / DL-orphan-reset / DL-failure-class / D2-consume. Read-only.

## Reference patterns (newInfoRatio 0.85)
| Technique | aionforge impl | Transferable |
|---|---|---|
| Pull-based backlog snapshot | lag.rs:13-41; consolidation.rs:114-128 | 4-field gauge: pending(raw+in_progress), failed, oldest_pending_lag(now−oldest, clamped≥0), generation. DERIVED against an INJECTED now (deterministic, no ambient clock); works whether or not a worker loop runs. .cjs port = `COUNT WHERE status IN(queued,in_progress)` + `MIN(queued_at)` |
| Reset-in-progress + CAS-claim | consolidation.rs:300-330,288 | recover = sweep all `in_progress`→`queued` (rows a worker claimed pre-crash); idempotent; pair with a guarded compare-and-set claim (re-read state under lock, refuse flip unless still expected) = exactly-once claim. "Never start fresh while orphaned-claimed rows exist" |
| Two-class failure + retry-escalation | pass.rs:107-115; scheduler.rs:341-373; max_retries=5 | Transient(retry next tick)/Fatal(mark failed); `fatal = isFatal || attempts>max` from DURABLE count; timeout→Transient; each failure writes an audit tagged kind+attempts with content-derived id |
| **Dual-gate STOP/GO via Beta posterior** (the D2→STOP template) | trust.rs:43-60; config.rs:691-728; reliability_sweep.rs:83-117 | a decision requires TWO orthogonal gates BOTH clearing: count `k`(≥2) AND posterior≥threshold; posterior asymptotes to mean reliability (anti-sybil: count alone can't buy confidence); sanitize non-finite→0.5; canonical-order sum for replay; reachability-reject unsatisfiable configs. For D2→STOP: weight each iteration/reviewer by reliability, require min-count AND posterior-floor before convergence — never let raw vote-count alone trip STOP |

## Key port note
The dual-gate STOP template is the reference for how D2 (once built per H1) feeds the convergence decision — and it directly informs the NEW gap DL-newInfoRatio-audit (the self-graded STOP input needs a count+belief gate, not raw consumption). The backlog snapshot + reset-in-progress are the references for DL-pool-gauges + DL-orphan-reset (Round C GOs).

## Next Focus
DL-pool-gauges/orphan-reset/failure-class reference-backed; D2-consume has a complete dual-gate STOP template that also informs DL-newInfoRatio-audit. Feeds Round I/J.
