# Iteration 20: Final Breadth — Pairing Depth, Coverage Audit, Convergence Telemetry

## Focus
Close the last thin spot (axis 7 pairing mechanics), audit coverage across all 8 axes, and record convergence telemetry before synthesis.

## Findings

### F1. Pairing mechanics firm-up (axis 7 completion)
- Tailscale auth keys: one-off + tagged + pre-approved is the documented pattern for enrolling a node without browser login; tags are least-privilege and defined in `tagOwners`; keys must not enter shell history/logs; OAuth-client-scoped generation is the programmatic best practice ([SOURCE: tailscale.com/docs/features/access-control/auth-keys], [SOURCE: tailscale.com/docs/features/access-control/auth-keys/how-to/secure-auth-keys]).
- Serve HTTPS: HTTPS URLs for tailnet services require public-CA TLS certificates, which Tailscale provisions automatically for tailnet machines ([SOURCE: tailscale.com/docs/how-to/set-up-https-certificates]).
- Design completion: the pairing QR's `tailnetJoinURL` = `https://login.tailscale.com/a/<one-off-tagged-pre-approved-key>` (host's admin generates it at `pi remote pair` time via the Tailscale API with a scoped OAuth client; the key is single-use and expires in minutes); the phone node joins tagged (e.g. `tag:pi-phone`) — **not** ephemeral (a phone should persist), least-privilege tags restrict what the phone node can reach (relay port only). Serve HTTPS uses Tailscale-issued certs (004 unchanged).

### Coverage audit (all 8 axes)
| Axis | Iterations | Verdict |
|---|---|---|
| 1 transcript richness | 2, 3, 12, 18 | covered: schema, diffs, usage, search/nav |
| 2 phone approval | 4, 15, 17 | covered: tiers, digest, glance, races |
| 3 notification pull | 5, 13, 14, 19 | covered: attention classes, cache, platforms |
| 4 allow-list/CAS | 6, 8, 17 | covered: policy leases, windows, revocation |
| 5 session list | 7, 16, 18 | covered: two-layer identity, retention, labels |
| 6 background | 8, 10, 14, 19 | covered: parking, supervision, SW reality |
| 7 pairing | 9, 20 | covered: QR ceremony, auth-key mechanics |
| 8 concurrency | 10, 17 | covered: leases, isolation, budgets |

### Convergence telemetry (telemetry only — stopPolicy is max-iterations)
- newInfoRatio series: 1.00, 0.90, 0.85, 0.80, 0.85, 0.80, 0.75, 0.75, 0.75, 0.70, 0.55, 0.60, 0.50, 0.50, 0.50, 0.45, 0.45, 0.45, 0.40, (0.40 this iteration)
- Trend: declining (signal of saturation); last-5 mean ≈ 0.44. Convergence telemetry confirms the loop has saturated; per the operator directive, the loop still ran to the 20-iteration cap and used the remaining iterations to broaden angles rather than synthesizing early.
- Question coverage: 8/8 axes have evidence-backed designs; open questions remain only in the sense of implementation validation (out of scope).

## Sources Consulted
- [SOURCE: https://tailscale.com/docs/features/access-control/auth-keys]
- [SOURCE: https://tailscale.com/docs/features/access-control/auth-keys/how-to/secure-auth-keys]
- [SOURCE: https://tailscale.com/docs/how-to/set-up-https-certificates]
- Iterations 1-19 of this lineage (coverage audit)

## Assessment
- newInfoRatio: 0.40
- Novelty justification: pairing auth-key mechanics completion + coverage/telemetry audit; all other findings consolidate prior iterations.
- Confidence: high.

## Reflection
- What worked: ending with a coverage table — every axis has ≥2 iterations and cross-cutting passes; no thin spots remain.
- What failed / ruled out: ephemeral phone nodes (wrong for persistent enrollment); auth keys in shell history (secure-handling rule).
- Ruled out: further broadening — the frontier is implementation validation, which is out of research scope.

## Recommended Next Focus
SYNTHESIS: compile research.md — per-axis recommendations, canonical schema, security reconciliation, eliminated alternatives, parity-vs-exceed verdicts.
