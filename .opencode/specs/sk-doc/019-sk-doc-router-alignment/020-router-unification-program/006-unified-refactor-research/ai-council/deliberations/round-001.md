# Multi-AI Council Deliberation round-001

## Council composition

| Seat | Strategy lens | AI vantage target | Distinct mandate | Confidence |
|---|---|---|---|---|
| seat-001 | Minimalist / degenerate-case purist | cli-claude-code (simulated) | N=1 must be the same contract, zero special-casing | 84 |
| seat-002 | Safety / authority hardliner | deep-research (simulated) | Authority stays destination-local; hard gates | 93 |
| seat-003 | Migration / adaptivity realist | cli-opencode (simulated) | Reversible gated migration; offline overlay; (T,R,P) | 89 |

Dispatch mode: sequential inline deliberation (no Task tool / no `sequential_thinking` MCP / Bash+node denied in this runtime). Vantages are simulated lenses run by one synthesizing model, honestly labeled.

## Round 1 — independent findings

- **seat-001** proposed modelling the singular skill as partial evaluation of the same `CompiledPolicyV1` (empty collections constant-fold ranking/bundles/handoff), and championed the four-action nested algebra over the flat six-value enum on the grounds that it maximizes unrepresentable-bad-states.
- **seat-002** proposed separating planes by authority: only `route` names a target, only destination VERIFY→COMMIT consumes authority, advisor is freshness-gated evidence, base+overlay is one pinned immutable identity, benchmark integration is a projector (never a scorer edit), activation is a fenced CAS with un-overridable hard gates.
- **seat-003** proposed a shadow-compiler-not-rewrite migration (compile-only → dual-read → shadow → per-hub canary → offline overlay → destination transactions → cleanup), `(T,R,P)` as the explanatory coordinate system, and the overlay learning the vocab→destination table (not weights) from handoff records, off by default.

Independent verdict: all three describe the SAME architecture. This mirrors the four prior research lineages (SOL-a, SOL-b, Terra, Luna), which converged near-identically. Convergence is therefore assessed as **genuine**, not artificial — the seats disagree on emphasis and on two real sub-questions, not on the spine.

## Round 2 — adversarial cross-critique

- **HUNTER (002 → 001):** the minimalist's instinct to also delete the leaf-manifest and route guard at N=1 is unsafe — the manifest is fail-closed correctness, and the single target must be able to `defer(no-match)` on zero signal. seat-001 **conceded**; retained the manifest as a correctness cost, not overhead. Undefended weakness → −2 on seat-001.
- **HUNTER (001 → 002):** the hardliner's gates and certificates add elegance cost and could be read as over-emission of contract surface. SKEPTIC (defending 002): each gate closes a specific authority-leak that a lineage's threat model named; none add a target-bearing negative or a registry union. Judged an intentional trade-off, not a flaw → seat-002 defended cleanly (+1).
- **HUNTER (001 & 002 → 003):** the overlay contributes zero to the load-bearing N=1 case, rests on the least-validated idea (single-model GLM `(T,R,P)`), and seat-003's preferred migration order (mcp-tooling second, per Terra) conflicts with the 3-of-4 majority (mcp-tooling last). seat-003 **conceded** the overlay is last+optional and the order is an open question, not a settled call. Two undefended points → −3 on seat-003.

## Round 3 — reconciliation

Merged design = seat-002's authority-plane backbone + seat-001's N=1 partial-evaluation proof + seat-003's gated reversible migration and the (T,R,P)/overlay placement (subordinate, offline, off-by-default). The two genuine disagreements are recorded rather than papered over:

1. **Migration activation order** — majority `mcp-code-mode → sk-code → system-deep-loop → mcp-tooling` (blast-radius ascending) vs Terra/seat-003 `... → mcp-tooling → sk-code → ...` (transport simplicity). Adopted the majority; logged as open question 1.
2. **Overlay / `P` axis weight** — kept as an optional offline capability and an explanatory coordinate system, explicitly not load-bearing for the base contract, which must be complete with `overlay=null, P=static` (i.e. the N=1 configuration). This inversion resolves the minimalism-vs-adaptivity tension.

## Seat comparison (5-dimension rubric, 100 pts)

| Dimension | Weight | seat-001 | seat-002 | seat-003 |
|---|---|---|---|---|
| Correctness | 30% | 27 | 29 | 26 |
| Completeness | 20% | 17 | 19 | 19 |
| Elegance | 15% | 15 | 12 | 12 |
| Robustness | 20% | 16 | 20 | 17 |
| Integration | 15% | 14 | 14 | 15 |
| Pre-critique total | 100% | 89 | 94 | 89 |
| Post-critique adjustment | ±10 | −2 | +1 | −3 |
| Final total | 100% | 87 | 95 | 86 |

Leader: **seat-002 (95)** — the authority-boundary invariants are the backbone that makes the fusion safe by construction. Complementary elements grafted: seat-001's degeneracy proof (the graceful-degradation test) and seat-003's reversible migration + posture placement.

## Convergence decision
`two-of-three-agree`: **converged** (3/3 endorse the same spine; cross-critique produced no new high-severity finding, only two recorded open sub-questions). Convergence is genuine, corroborated by four independent prior research lineages. Round 1 is terminal.
