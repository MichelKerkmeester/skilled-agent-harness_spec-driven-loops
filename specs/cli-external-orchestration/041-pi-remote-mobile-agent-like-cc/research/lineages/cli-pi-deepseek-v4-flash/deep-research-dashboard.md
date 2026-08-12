# Deep Research Dashboard

## Lifecycle
- Session: `fanout-cli-pi-deepseek-v4-flash-1786341668505-k2xc4h`
- Status: synthesis complete
- Stop reason: `maxIterationsReached`
- Stop policy: max-iterations

## Iterations
| Run | Focus | newInfoRatio | Findings | Status |
|---:|---|---:|---:|---|
| 1 | Pi RPC lifecycle and minimum relay architecture | 1.00 | 6 | complete |
| 2 | RPC command/event → mobile UI mapping with parity baseline | 0.85 | 6 | complete |
| 3 | Disconnect-safe state model and reconnection protocol | 0.90 | 6 | complete |
| 4 | Security and network exposure model | 0.93 | 7 | complete |
| 5 | PWA notifications, background limits, phasing | 0.88 | 6 | complete |
| 6 | Independent validation, residual risks, acceptance matrix | 0.75 | 6 | complete |

## Question Status
- Original questions answered: 5 / 5
- Validation question answered: 1 / 1
- Open research questions: 0
- Release remains gated on executable acceptance (G1-G9), not open questions.

## Convergence Trend
- Ratios: `1.00 → 0.85 → 0.90 → 0.93 → 0.88 → 0.75`
- Last-3 rolling average: 0.853 > 0.02 (CONTINUE vote).
- MAD floor: ~0.058; latest 0.75 is above noise (CONTINUE vote).
- Question coverage: 100% (STOP vote).
- Composite stop score: 0.35 ≤ 0.60.
- Hard cap: 6 / 6, therefore STOP with `maxIterationsReached` (telemetry only by policy).

## Dead Ends
| Direction | Reason | Iteration |
|---|---|---|
| Direct browser-to-Pi stdio | Browsers cannot consume child-process stdio | 1 |
| One-shot Pi process per prompt | Socket becomes lifecycle owner | 1 |
| Prompt response as completion | Contradicted by RPC contract | 1 |
| Transient events as session catalog | No replay cursor | 1 |
| TUI-only commands in mobile menu | Do not execute via prompt | 2 |
| tool_execution_start as approval | Approvals are extension-UI dialogs only | 2 |
| Remote Control mode model verbatim | Pi has no equivalent flag | 2 |
| Wall-clock replay cursors | Must be monotonic server sequence | 3 |
| Auto-resend after Pi-child crash | Duplicate risk; surface indeterminate | 3 |
| Client-side approval timers | Agent-side timeout auto-resolve is authoritative | 3 |
| Broker-side dedup alone | Bounded windows; consumer idempotency mandatory | 3 |
| Tailscale Funnel exposure | Public listeners, no per-visitor identity | 4 |
| Tailnet identity as sole authZ | Reachability only | 4 |
| Public bridge as default | More attack surface than Serve | 4 |
| Full payload retention | Metadata-only + digests is safer | 4 |
| Silent pushes / background compute (iOS) | WebKit userVisibleOnly requirement | 5 |
| Background Sync reliance | Scheduled, not real-time; broken on WebKit | 5 |
| Client cache as canonical state | Evictable under storage pressure | 5 |
| Decision-carrying push payloads | Pushes are unreliable hints | 5 |
| Unconditional session mutations | Cancellable by extension handlers | 6 |

## Validation
- Mechanical iteration gate: 6 / 6 passed.
- Acceptance matrix defined: G1-G9 (phase-mapped).
- Live gates NOT RUN in this environment: real Pi child transcript, relay crash fixture, deployed Serve + PROXY/Origin checks, iOS push on device, two-device lease contention.

## Highest Residual Risks
1. Approval argument TOCTOU/post-gate mutation (P0; mitigation: digest binding + recompute-before-execute with fail-closed mismatch).
2. Relay crash behavior: envelope persistence, ledger recovery, approval-map restore (P0; gate G3 includes relay-restart mid-stream).
