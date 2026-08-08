# Iteration 18: Migration Path and Sequencing

## Focus
This iteration investigated the staged migration path for a graph-engineering-based deep-loop architecture: the research-mode additive-dark adapter, shadow-parity gates, one-mode-at-a-time authority cutover, later convergence-graph enrichment, and ordering against the 036 epic. The selected interpretation is sequencing and operator control, not implementation. Live fixture execution and canonical ownership of 034/036-046 remain deferred.

## Actions Taken
1. Read the authoritative prompt pack, configuration, state log, strategy, and findings registry before selecting the focus; the prompt's next focus is migration path and sequencing.
2. Read the 036 handover and execution-sequencing strategy to reconcile the current blocker set, dependency DAG, rollback discipline, and pre-/post-cutover gates.
3. Read iterations 005, 006, and 012 to carry forward the hybrid graph mapping, research-mode adapter contract, measurable parity gates, and 024 fencing boundary.
4. Compared the documented sequence with the recorded graph-database failure and residual ownership/fixture gaps; no implementation or reducer-owned file was modified.

## Findings
1. **[P1] The supported transformation is a four-phase, authority-preserving path.** Phase A is a research-mode graph adapter in additive-dark shadow: typed execution state and `graphEvents` bridge into the existing JSONL narrative/state/delta artifacts, with the legacy loop and evidence ledger still authoritative and no coverage-graph database requirement. Phase B adds shadow parity over those artifacts, reducer projections, reconstructed graph topology, convergence decisions, and failure cases. Phase C is staged authority cutover one mode at a time behind the 036 gateway and rollback-window discipline; legacy writers are retired only after zero-use telemetry. Phase D adds contradiction, coverage, and source-diversity graph signals after the projection dependency is healthy, without replacing the ledger or loop-local convergence contract. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:44-83,181-186] [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md:Findings 1-6]

2. **[P1] Shadow parity is a promotion gate, not an observability suggestion.** A cutover candidate must produce exactly one narrative, one canonical state iteration record, and one delta stream; preserve valid graph vocabulary and citations; reconstruct the same findings/questions/sources/edges; and match normalized reducer outputs plus status, stop reason, blockers, and `newInfoRatio` from the legacy path. The fixture must include malformed, partial-success, contradiction, replay, and graph-database-disabled cases. Any mismatch is a blocked result, not a tolerated warning. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md:Findings 3-7] [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-012.md:Findings 3-5] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:Per-phase gate contract]

3. **[P0] 024 fencing and the whole-system clearance must precede 014 authority cutover; adapter design can proceed in parallel.** The current 036 handover identifies gateway-only append fencing and the F001/F002/F005 identity, policy-state, and fresh-lock conditions as unresolved cutover safety work. Therefore the graph adapter can be designed and exercised in shadow while WS1 remediation and the fresh 024 caller migration proceed, but it cannot authorize a write or a transition. The operational order is: finish/verify remediation, reconcile stale metadata, run the pre-014 whole-system gate on a frozen SHA, land and verify 024 fencing, then obtain an explicit 014 per-mode cutover decision. The sequencing document's `013 -> 014 -> 015 -> 016 -> 017` DAG describes the closeout path; the handover's current plan also uses a whole-system 016 clearance before 014 and a final 016 gate after 015, so those are two gate roles rather than permission to skip either. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:59-83,109-160,181-186] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26] [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-012.md:Findings 1-2,5]

4. **[P1] Each phase needs an explicit operator gate and a reversible action.** For Phase A, the operator approves the typed state/schema, packet-local scope, shadow flag, and deterministic corpus; rollback is disabling the adapter or reverting its additive commit, leaving legacy authority unchanged. For Phase B, the operator approves a frozen-baseline parity report with all artifact, reducer, convergence, and negative-fence rows passing; rollback disables shadow emission and retains the legacy path. For Phase C, the operator issues a per-mode GO only after 024/identity/policy/lock/frozen-SHA gates pass; rollback is the documented one-commit revert inside the rollback window, with the ledger remaining additive-dark until the flip is re-approved. For Phase D, the operator separately enables graph enrichment only after compatible database health and signal-correlation evidence; rollback disables enrichment and falls back to the established loop-local decision. These gates keep topology changes distinct from authority and serialization boundaries. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:44-83,109-160] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26,Per-phase gate contract] [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md:Findings 4-6] [INFERENCE: phase-by-phase gate and rollback table derived from the documented additive-dark and rollback-window rules]

5. **[P1] Convergence-graph enrichment is deliberately later, while residual safety and ownership gaps remain release risks.** Prior state records show the coverage-graph database unavailable because of the native-module mismatch, so Phase A/B correctness must remain file/JSONL-based and DB-independent; the graph database can be restored as an optional projection and later source-diversity/coverage/contradiction signal only. The current handover still calls 024 a fresh, security-critical build and retains residual fixture coverage plus owner-approved accounting for 034 and 036-046 as open work. Consequently, database restoration, live fixture execution, and phase-ownership reconciliation are follow-up evidence gates, not reasons to block adapter design or reasons to claim cutover readiness. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:109-160,181-186] [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md:Findings 5-6] [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-012.md:Questions Remaining, Dead Ends]

## Questions Answered
- **Q5 (migration slice):** The staged path is additive-dark research adapter -> exact shadow parity -> per-mode guarded cutover -> optional convergence-graph enrichment.
- **Q2 (sequencing slice):** 024 fencing and whole-system clearance are upstream of 014 authority cutover; 015 retirement and 016/017 closeout follow cutover, while adapter design and fixture work can proceed in parallel without authority.
- **Q1/Q2 residual status:** The 014 safety boundary is still not ready; phase ownership for 034 and 036-046 and live fixture proof remain unresolved.

## Questions Remaining
- Build and execute the deterministic research-mode fixture, including graph-off, malformed-event, partial-success, contradiction, and replay cases; compare the independent reducer and convergence oracles.
- Freshly build and verify 024's gateway-only fence and its broad caller migration, including negative tests for stale/superseded writers.
- Obtain an owner-approved manifest, deprecation record, or merge record for 034 and 036-046.
- Restore a compatible coverage-graph database only for later enrichment validation; do not make it a Phase A/B prerequisite.

## Ruled Out
- Big-bang graph replacement before additive-dark and rollback-window evidence. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26]
- Database-first adapter or graph-database-gated parity. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events]
- Any graph adapter write or early stop that bypasses the gateway, legacy convergence, or the 014 cutover certificate. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:77-88,153-158] [SOURCE: specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md:Findings 3,6]

## Edge Cases
- **Ambiguous input:** “Migration path” was narrowed to the explicitly requested research-mode adapter and its gates; other modes are sequenced only at the 014 per-mode cutover boundary.
- **Contradictory evidence:** The handover records that 022's six-mode divergence-detection parity is discharged while retaining REQ-005 fixture residuals and independently keeping 024 blocked; the current safety conclusion follows the dated code-verified blocker sections, not stale child status labels. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:22-32,59-83,109-160]
- **Missing dependency:** The coverage-graph DB/native module is unavailable in recorded state; file/JSONL parity is the fallback and Phase D is deferred.
- **Partial success:** The sequencing and gate design is fully evidenced, but no live fixture or production cutover was run; readiness claims remain design-level only.

## Sources Consulted
- specs/system-deep-loop/036-deep-loop-innovation/handover.md:44-83,109-160,181-186
- specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26,Per-phase gate contract
- specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-005.md:Findings 1-6
- specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-006.md:Findings 1-7
- specs/system-deep-loop/037-graph-engineering/research/iterations/iteration-012.md:Findings 1-5,Questions Remaining,Dead Ends
- specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph convergence/upsert skipped events

## Assessment
- **New information ratio:** 0.90 (four of five findings are new operational sequencing/gate guidance; one partially synthesizes existing DB and ownership residuals).
- **Questions addressed:** Q5 migration path and Q2 sequencing; residual Q1/Q2 safety and ownership status.
- **Questions answered:** phase order, parallel work, operator gates, rollback behavior, and the prerequisite relation between 024 fencing and 014 cutover.

## Reflection
- **What worked and why:** Comparing the 036 dependency DAG and handover's current completion path with the concrete adapter/parity contracts from iterations 005, 006, and 012 exposed which work can safely run in parallel and which gates must remain serial.
- **What did not work and why:** No live fixture or fence test was available in this research-only pass; static evidence cannot establish production parity under concurrent or malformed inputs.
- **What I would do differently:** The next implementation-owned pass should pin a corpus, run the independent legacy/graph oracles with the database disabled, and produce a gate dashboard before any operator cutover request.

## Next Focus
Implementation-owned verification: build the research adapter fixture and 024 red-before/green-after fence checks, then run the Phase B parity gates on a frozen baseline. Separately request owner-approved accounting for 034 and 036-046.

## SCOPE VIOLATIONS
None. Only this packet's iteration narrative, state append, and delta file are permitted outputs; no researched or reducer-owned file was modified.
