# Iteration 020 — Final design review before synthesis

## Final decision

Build a private Pi Remote PWA as a relay-owned, versioned event ledger and three-surface mobile client:

- Pi runs in RPC JSONL mode behind the loopback TypeScript relay.
- The relay redacts, persists, sequences, snapshots, and replays immutable epochs before broadcasting.
- Tailscale Serve provides tailnet-only HTTPS/WSS ingress; device pairing adds a one-time QR challenge and a registered device key.
- Home lists opaque, user-renamable sessions; Session renders rich transcript/plan/tool/diff/usage cards; Review handles exact-action approvals and bounded policy grants.
- Push is generic needs_input/finished/error attention only; authenticated pull resolves the current record.
- A host-minted run lease permits bounded background compute and away queueing, but loss of foreground authority stops new work and approvals.
- Each session has its own Pi child, epoch, queue, replay cursor, lease, and capability.

## Axis audit

1. Richness: typed text, summarized thinking, plan snapshots, tool input/output, diffs, results, and integer usage. Better proof: identical rich reducer state after interruption/replay.
2. Approval: one-tap Allow once references only opaque approval, epoch, revision, lease, digest, and mutation ID. Better proof: two-device CAS and final-boundary recomputation.
3. Attention: bounded class and opaque nonce/route push, authenticated fetch. Better proof: zero decision-bearing bytes in push and stale-link safety.
4. Accept-edits: finite operation/path/action/time grant consumed by CAS. Better proof: revocation and scope mutation deny.
5. Catalog: opaque session ID, user label, coarse state, plan/usage/attention. Better proof: metadata leak scanner and rename conflict tests.
6. Background: local process remains host-owned; away work is queued or run only under an expiring host lease. Better proof: heartbeat-loss denial and honest UI state.
7. Pairing: scan plus host confirmation over existing tailnet; no static ticket/public fallback. Better proof: QR replay/revocation/off-tailnet tests.
8. Concurrency: fair per-session multiplexer with bounded windows. Better proof: flood one child, keep other approvals and settlements responsive.

## 041 invariants retained

The design never turns the PWA into a direct Pi transport, never exposes Funnel/public ingress, never uses terminal scraping, never persists raw paths/secrets, never treats push as state, never claims exactly-once across crash, and never lets a display payload become a command. The final Pi extension boundary remains the only protected execution authority.

## Unresolved but bounded

- Exact Pi extension hooks for plan snapshots, diff derivation, and final approval records still need implementation discovery.
- Web Push support and permission behavior vary by browser/OS; fallback attention inbox and reconnect are required.
- Proposed latency, memory, and battery targets need device/tailnet measurement.
- Retention/encryption-at-rest limits for the local replay ledger need a 042 implementation decision.
- “Thinking” must remain provider-permitted summary/progress, never fabricated private chain-of-thought.

## Handoff

Implement in order: common envelope and redaction; per-session RPC/epoch/replay; catalog and sync; PWA Home/Session; approval final boundary; attention push/pull; finite grants/run lease; pairing/device revocation; concurrency/backpressure; adversarial/accessibility/performance tests. Keep every event, command, and UI assertion tied to a verification case.

## Assessment

New information ratio: 0.42. The required twenty iterations are complete. Convergence is telemetry only under max-iterations; synthesis may now consume the full lineage.
