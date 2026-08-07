# Iteration 7 (Round K): Q7 Daemon Re-election / Reconnect / IPC × graceful-degrade + reliability trust

## Focus
Reconcile 027's daemon re-election + advisor reconnect + mk-code-index proxy + IPC cap against 028's graceful-degrade discipline (C9) + reliability-weighted trust. Read-only.

## Findings (newInfoRatio 0.2)
**VERDICT: ALREADY-COVERED** — 027 already lives the degrade discipline; 028 even concedes it.
- 027's exit-75 is the retryable "daemon unavailable, retry don't error" signal (`before-vs-after.md:377`); the mk-code-index reconnecting proxy reattaches to a respawned backend so owner death isn't a hard "Connection closed" (`mk-code-index-launcher.cjs:176-188`). Re-election default-on with inverted contract (`mk-spec-memory-launcher.cjs:205-206`).
- 028's roadmap itself frames exit-75 as "the same discipline at the transport layer" (`roadmap.md:83,93`). C9 targets a DIFFERENT layer (Memory recall embedder-degrade), so it does not strengthen 027's reconnect/proxy. LEVERAGE L, EFFORT M.

## Most-likely-wrong (open → weak "extends")
Owner-lease adoption (`classifyOwnerLease`, `mk-code-index-launcher.cjs:427-446`) picks an owner purely on liveness/ppid/heartbeat-TTL — NOT any trust signal. A reliability prior over launchers (which owner historically stays warm vs orphans) could improve adoption-vs-respawn decisions = weak extends. The one net-new (speculative, unbuilt-signal) thread on Q7.

## Next Focus
Round L: scope the reliability-prior-on-owner-election idea (does 028's Beta posterior have a home in re-election?).
