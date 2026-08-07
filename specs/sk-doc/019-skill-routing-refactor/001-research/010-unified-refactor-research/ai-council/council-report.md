## Multi-AI Council Report: Unified Router Refactor — fuse the eight ideas into one

### Task Classification
- **Type**: architecture (capstone synthesis)
- **Council Seats Dispatched**: 3 — Minimalist / cli-claude-code, Safety-hardliner / deep-research, Migration-realist / cli-opencode
- **Dispatch Mode**: Sequential inline deliberation (no Task tool, no `sequential_thinking` MCP, Bash/node denied in this runtime)
- **Vantage Integrity**: simulated vantage lenses, honestly labeled — one synthesizing model (Opus 4.8) ran three distinct mandates. No external executor participated. The multi-model diversity is inherited from the four prior research lineages this council synthesizes (2× SOL xhigh, Terra xhigh, Luna max), not from live sub-dispatch.

### Council Composition

| Seat | Strategy Lens | AI Vantage Target | Distinct Mandate | Confidence |
| --- | --- | --- | --- | --- |
| seat-001 | Minimalist / degenerate-case purist | cli-claude-code (simulated) | N=1 is the same contract, zero special-casing, near-zero overhead | 84 |
| seat-002 | Safety / authority hardliner | deep-research (simulated) | Destination-local authority; negatives withhold authority; hard gates; never touch the scorer | 93 |
| seat-003 | Migration / adaptivity realist | cli-opencode (simulated) | Reversible gated migration; (T,R,P) posture; offline correction overlay | 89 |

### Strategy Comparison

| Dimension | Weight | seat-001 | seat-002 | seat-003 |
| --- | --- | --- | --- | --- |
| Correctness | 30% | 27 | 29 | 26 |
| Completeness | 20% | 17 | 19 | 19 |
| Elegance | 15% | 15 | 12 | 12 |
| Robustness | 20% | 16 | 20 | 17 |
| Integration | 15% | 14 | 14 | 15 |
| Pre-Critique Total | 100% | 89 | 94 | 89 |
| Post-Critique Adjustment | +/-10 | -2 | +1 | -3 |
| Final Total | 100% | 87 | 95 | 86 |

### Deliberation Notes
- **Round 1 Independent Findings**: all three seats independently described the SAME architecture — a compiled immutable content-addressed policy, a pure evaluator emitting a closed four-action algebra, one shared recovery budget, destination-local PREPARE/VERIFY/COMMIT, an offline overlay, and `(T,R,P)` as compile-time posture. This mirrors the four prior research lineages, so convergence is assessed as genuine, not artificial.
- **Round 2 Cross-Critique**: seat-001 conceded it must not delete the leaf-manifest/route-guard at N=1 (fail-closed correctness); seat-002 defended its gates as authority-leak closures rather than over-emission; seat-003 conceded the overlay contributes nothing to the load-bearing N=1 case and that its preferred migration order is an open question.
- **Round 3 Reconciliation**: backbone from seat-002 (authority planes), degeneracy proof from seat-001, gated migration + posture placement from seat-003. Two genuine disagreements recorded, not papered over: migration activation order, and the weight of the overlay / `P` axis.

### Winning Strategy
- **Leader**: seat-002 (Safety / authority hardliner), Score: 95/100
- **Key Strength**: the authority-boundary invariants (only `route` names a target; only destination VERIFY→COMMIT consumes authority; advisor/proof/rank are evidence, never capability; base+overlay is one pinned immutable identity; the scorer is never edited) make the fusion safe by construction — the dangerous states become unrepresentable rather than merely tested.
- **Complementary Elements**: seat-001's N=1 partial-evaluation proof (the graceful-degradation test) and seat-003's seven-stage reversible migration plus the subordinate, offline, off-by-default placement of `(T,R,P)` and the overlay.

### Recommended Plan
Fuse the eight ideas into **one contract family, not one router**, assigning each idea to a distinct authority plane. `CompiledPolicyV1` (immutable, content-addressed) holds the destination graph, detectors, selectors, composition rules, authority graph, and the `(T,R,P)` posture (Ideas 1, 8). A pure local evaluator turns freshness-gated evidence (`RouteRequestV1`) into `RouteDecisionV1` — a closed **four-action** algebra `route | clarify | defer | reject`, with `selectionKind ∈ {single, orderedBundle, surfaceBundle}` nested inside `route`, and negatives structurally target-free and authority-free (Ideas 3, 6). Uncertainty is one ordered ladder drawing on **one** shared `UncertaintyBudget` — `clarify` (Idea 5) then `handoff` (Idea 4). The destination alone runs PREPARE/VERIFY/COMMIT; the proof is evidence, exactly-once is an adapter property (Idea 7). A separately hashed `CorrectionOverlayV1` learns the vocabulary→destination table offline (Idea 2 + GLM closed-loop) and serves only via a gated pointer CAS. The four seams close cleanly: 3-vs-6 → one nested algebra; 4-vs-5 → one ladder + one budget; 8-vs-6 → knobs parameterize, shape is fixed; 2-vs-1 → base+overlay = one pinned identity. `mcp-code-mode` is the **degenerate N=1 case of the same contract** — ranking, bundles, handoff, mode-choice constant-fold to empty; admission, typed negatives, destination identity, leaf routing, and VERIFY remain; no `SingularRouter` and no skill-name branch anywhere. Full design: `../unified-refactor-synthesis.md`.

### Implementation Steps
1. **Define the canonical schema family + deterministic serialization** for `CompiledPolicyV1`, `CorrectionOverlayV1`, `RouteRequestV1`, `RouteDecisionV1`, `RouteProofV1`, and receipts; fix domain-separation strings for byte-stable hashes. (Source: seat-002 + seat-001)
2. **Compile only `mcp-code-mode`** into `EffectivePolicy` + the three read-only projections (advisor / typed route-gold / policy card); prove empty collections constant-fold with no skill-name branch. (Source: seat-001)
3. **Build the compatibility projector** mapping typed decisions into the existing `observedIntents`/`observedResources` shape; run the shared scorer unchanged; add typed fixtures incl. the singular-omission + zero-rank-call assertion. (Source: seat-002 + seat-003)
4. **Run shadow parity with zero live authority**; prove one-generation fenced activation and byte-exact rollback. (Source: seat-003)
5. **Add hubs one at a time** in blast-radius order `sk-code → system-deep-loop → mcp-tooling`, each behind the same canary + hard-gate battery. (Source: seat-003)
6. **Defer** the overlay, calibrated auto-route, and the handoff service until the base compiler, typed decisions, projections, destination VERIFY, and rollback are proven. (Source: seat-001 + seat-002)

### Prerequisites
- The four lineage syntheses, eight presentations, and GLM notes are the frozen evidence base (read; no re-derivation).
- The shared scorer `router-replay.cjs` and existing route-gold outputs remain untouched throughout.
- Destinations must be able to implement side-effect-free PREPARE and atomic-or-explicitly-non-atomic COMMIT before Stage 6.
- A curated, privacy-reviewed routing fixture corpus must exist before any overlay promotion (does not yet exist).

### Plan Confidence
- **Overall**: 88%
- **Strategy Agreement**: very high — 3/3 seats and 4/4 prior lineages converged on the same spine.
- **Consensus Quality**: strong, and assessed as genuine (corroborated by four independent research lineages) rather than convergence sycophancy; two real sub-disagreements were surfaced, not suppressed.
- **Risk Level**: low for the architecture; medium for schema field boundaries; unclaimed for empirical performance/calibration/overlay benefit (nothing was measured).

### Dropped Alternatives
- **seat-001** (87): would minimize field/machinery count aggressively; corrected to retain the leaf-manifest and negative-admission at N=1 (fail-closed correctness), so its purest form was not adopted wholesale.
- **seat-003** (86): preferred Terra's migration order (mcp-tooling second) and gave the overlay more prominence; both were down-weighted — order is an open question, overlay is last+optional.
- Flat six-outcome enum, `(T,R,P)`-as-whole-policy, mutable online overlay, separate `SingularRouter` / default-to-self, packet-path identity, advisor-rank-as-probability, scorer replacement, and big-bang migration — all eliminated across lineages.

### Risks & Mitigations
- **Compiler becomes load-bearing** → keep the legacy router as a shadow oracle; fail closed on any drift; per-hub canary before activation.
- **Authority leak via stale advisor / fallback / router-level exactly-once** → freshness+identity gate on advisor evidence; negatives withhold authority by type; exactly-once is an adapter idempotency property, never proof text.
- **Determinism break from online learning** → overlay is immutable and offline-promoted; base+overlay is one pinned identity per request; a mutable online overlay is forbidden.
- **Over-emission on zero signal** → zero-signal ⇒ typed `defer` with no default/registry union; forbidden-artifact gates in typed route-gold.
- **Overlay pays no dividend** → keep it off by default and last; the base contract must be complete with `overlay=null, P=static` (the N=1 configuration).

### Planning-Only Boundary
- No live router, registry, scorer, parent spec, or skill was modified by the council.
- The council authored two artifacts: this `ai-council/**` set, and (at explicit operator direction) `../unified-refactor-synthesis.md` — a new research deliverable, not a mutation of existing code or spec docs.
- Persistence note: this runtime denies Bash/node, so `persist-artifacts.cjs` could not be invoked; the `ai-council/**` artifacts were hand-authored to its schema. The machine-computed `artifact_written` byte/checksum audit rows (normally auto-appended by the writer library) are recorded as `note` rows in `ai-council-state.jsonl` rather than fabricated; run the library's audit backfill if byte/checksum provenance is required.
- This report is a recommendation for user review or handoff to an implementation agent.
