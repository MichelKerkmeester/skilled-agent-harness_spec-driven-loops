# Iteration 30: Round H Rust Reference — aionforge-consolidate → C4-C/C-G1/durable-retry

## Focus
Round H: mine `aionforge-consolidate` for the consolidation-tick + poison-pill + durable-retry + content-addressed-idempotency reference — Memory C4-A/C4-C/C-G1/durable-retry. Read-only.

## Reference patterns (newInfoRatio 0.85)
| Technique | aionforge impl | Transferable |
|---|---|---|
| Contiguous-prefix-stop tick | scheduler.rs:142-169 | process oldest-first; BREAK on first failure; cursor tracks the contiguous consolidated prefix, never advances past a held-back failure |
| Reset-in-progress-on-startup | scheduler.rs:190-204 | before the loop, flip `in_progress`→`raw` for items an interrupted run stranded; emit a recovery count |
| Cadence clock-driver (the missing C-G1 piece) | scheduler.rs:205-223; config tick=5s | a fixed-interval ticker calls the EXISTING tick; **a tick error is logged, not fatal — next tick retries**. Confirms C-G1: cursor already exists, only the driver was missing |
| Atomic flip+cursor-advance in one commit | scheduler.rs:256-333 | mark in_progress → run passes on a READ snapshot (side-effect-free) → persist derived output + flip Consolidated + write cursor in ONE commit (no double-apply) |
| Transient/Fatal + DURABLE retry budget | pass.rs:106-115; scheduler.rs:341-374; max_retries=5 | `attempts = count_failures(id)+1` from the STORE (not in-memory) so a poison-pill escalates to fatal instead of a fresh budget per crash; timeout→Transient |
| Content-addressed crash-replay ids | scheduler.rs:413-423; Id::from_content_hash | every derived/audit id = hash(stable-inputs incl. attempt#); replay re-derives the SAME id → dedup-aware write is a no-op. THE C4-A idempotency-receipt mechanism |

## Key port note
Confirms G5: C-G1's cursor + per-item state already exist internally; the only missing piece is the clock-driver — port the "interval calls existing tick; log-and-continue, never fatal" discipline. The durable-retry insight: count failures in the STORE, classify Transient/Fatal, auto-fail after N.

## Next Focus
C4-A/C4-C/C-G1/durable-retry are reference-backed (tick + reset-on-startup + durable-retry + content-addressed idempotency port directly). Feeds Round I (C-G1 clock-driver sketch) + Round J.
