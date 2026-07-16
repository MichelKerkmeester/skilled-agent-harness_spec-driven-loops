# Deep Review Iteration 004 — 007-voyage-cleanup-and-egress-monitoring

**Dimension:** cross-stack
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:47:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| None | - | No P0 found in this pass. | - | - |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-007-001 | .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:377 | Active carry-forward: guard does not cover the auto-to-Voyage path. | Same evidence as iteration 001. | Same fix as iteration 001. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-007-004 | 007-voyage-cleanup-and-egress-monitoring/implementation-summary.md:153 | The guard only covers spec-kit-memory, while the docs rely on separate CocoIndex config state for no Voyage egress. | `implementation-summary.md:153` says CocoIndex has its own config layer and 007 does not touch it. | Keep the tcpdump check mandatory in 008, because the TS guard alone cannot prove zero Voyage egress across stacks. |

## Notes
Converged: deletes and dist rebuild are present, but the egress story needs one guard fix and a corrected macOS capture script.
