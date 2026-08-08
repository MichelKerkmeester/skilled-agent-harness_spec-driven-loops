# Iteration 12: Adapter/replay fixture, parity gates, and append-boundary fencing

## Focus
This iteration investigated the first-mode research graph adapter as a research-only shadow: a deterministic adapter/replay fixture, measurable shadow-parity gates, and the exact 024 append-boundary fencing contract that the adapter must not bypass. The supplied prompt's focus was selected over the strategy's stale broad next-focus because it is the narrowest remaining Q5/Q2 evidence gap.

## Actions Taken
- Read the externalized configuration, state log, strategy, and findings registry before selecting the focus.
- Reconciled the 036 epic handover and specification with the 024 packet's positive handover and its independently corrected decision record.
- Searched the runtime for direct `appendAuthorized` callers and fencing-related surfaces; no implementation change was made.

## Findings
1. **[P0] 024's current implementation status is not the positive status claimed by its stale handover.** The 036 handover says the append-boundary fence is genuinely unbuilt: `FenceCapability` and `#appendAuthorized` are absent, `appendAuthorized` remains public at the ledger implementation, and the cited landing evidence is fabricated or unrelated. The 024 decision record independently carries a correction saying its “Accepted” opaque-capability ADR is design narrative, not shipped code, because the current runtime has no `FenceCapability`, `#appendAuthorized`, or `STALE_FENCE`. The 024 handover's “all 18 findings fixed” and “gateway-only fenced mutation” text therefore conflicts with newer code-verified evidence; the safe status for adapter planning is **not discharged / P0 blocked**, not “clean.” [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md: “014 IS NOT READY — two of four named cutover blockers NOT discharged” and “Concrete remaining PATH-1 build scope” sections] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/decision-record.md:391-408] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/handover.md:11-17]
2. **[P0] The required gateway is a capability-and-identity boundary at the primitive, not a wrapper convention.** The target contract is: resolve identity and policy at the gateway; mint a coordinator-issued, current fence capability; validate the protected resource and current lease inside the ledger before event preparation, proof verification, idempotency handling, or frame commit; make the append primitive hard-private and unreachable through casts; reject a superseded writer even when its proof has not expired; and persist the fence token only as replay evidence, never serialize the capability. Every production caller must migrate atomically to this surface before authority cutover. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/decision-record.md:391-416] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md: “Concrete remaining PATH-1 build scope (grounded 2026-08-08)”]
3. **[P1] A deterministic first-mode fixture should be a fixed corpus plus a recorded node trace, not a live-directory replay.** Define a versioned corpus with at least four cases: empty input, ordinary findings with graph events, partial-success (one failed/timeout node plus one successful node), and contradiction/idempotent-replay. Freeze canonical JSON key ordering, array ordering, source digests, run/iteration IDs, clock values, and path-independent artifact names. Record each adapter node's stable node ID, input-state digest, output-patch/artifact digest, route decision, status, and event ordinal; then compare the byte sequence of the iteration narrative, state JSONL line, delta JSONL stream, and the reducer bundle. A second run over the same corpus must produce identical bytes and hashes, including the reducer's strategy, registry, dashboard, and research projection snapshots. This design follows the 036 requirement for versioned replay fingerprints, dual-read/single-write adapters, shadow parity, and deterministic replay, while making the previously open fixture requirement executable. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:64-67,99-101,153-158,171] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md: “022 … Residual: REQ-005 full-surface fixture coverage”] [INFERENCE: based on the append-only JSONL and write-once artifact contract in the iteration prompt plus the 036 replay-fingerprint and adapter requirements]
4. **[P1] Shadow parity needs an explicit pass/fail dashboard with independent derivation and no graph-database dependency.** The fixture gate should expose one row per case and gate: (G1) iteration narrative/delta/state artifact bytes and hashes; (G2) JSONL schema, field values, record order, and graph-event vocabulary; (G3) reducer outputs (registry, dashboard, strategy, and research projection) by canonical hash and semantic diff; (G4) convergence decision, new-info ratio, stop reason, and blockers from legacy and graph paths run with the graph DB disabled; and (G5) authority/safety checks proving no graph adapter append bypasses the gateway and no cutover flag changes. A row is PASS only when both independent paths match exactly; missing evidence, an unsupported graph DB, or an adapter exception is FAIL/BLOCKED rather than “not applicable.” The dashboard must show case ID, gate ID, expected hash, actual hash, diff reference, severity, and final aggregate status. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:99-101,157-173,262-271] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md: “022 … all 6 modes … genuinely different code paths” and “Residual: REQ-005 full-surface fixture coverage”] [INFERENCE: independent derivation is required to avoid a graph adapter and legacy path reproducing the same defect]
5. **[P0] Until 024 is actually rebuilt and verified, the graph adapter must remain an observation/shadow layer behind the legacy authority and the gateway boundary.** It may materialize typed graph state, node traces, deltas, and parity projections, but it must not call the direct ledger mutator, mint or persist fence capabilities, decide authority, or let graph convergence stop the legacy loop. Any durable transition or artifact write must use the already-authorized production boundary; graph outputs remain non-authoritative until the 024 fence, per-mode parity, rollback, and 014 cutover certificates pass. This preserves the additive-dark, shadow-parity, one-mode-at-a-time migration order and prevents the graph layer from turning a projection or checkpointer into the evidence-ledger authority. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:77-80,99-101,153-158] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md: “014 IS NOT READY” and “Concrete remaining PATH-1 build scope” sections] [INFERENCE: the adapter must stay behind the only safe mutation boundary while that boundary is absent]

## Questions Answered
- **Q5 (focused slice):** A concrete research-mode fixture, replay fingerprint comparison, five-row parity-gate model, and shadow-only adapter boundary are defined.
- **Q2 (focused slice):** The 024 append-boundary blocker is reconciled as an unbuilt P0 prerequisite despite conflicting stale packet prose.

## Questions Remaining
- An implementation owner must build and execute the fixture, independent reducer oracle, gate dashboard, and negative fence tests; this iteration intentionally did not modify runtime code.
- The complete ~109-file 024 caller migration and current branch-level test evidence still require a fresh build/verification pass.
- Exact canonical reducer snapshot serialization and production convergence parity remain unexecuted; the graph database remains optional telemetry and must not gate the shadow result.
- Canonical ownership/status of 034 and 036-046 remains outside this focus.

## Ruled Out
- Treating the 024 positive handover as proof of current runtime behavior; it is contradicted by the 036 code-verification section and the 024 decision-record correction. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md: “014 IS NOT READY” section] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/decision-record.md:391-408]
- Making graph-database availability a prerequisite for adapter correctness or parity; prior state records already show graph convergence/upsert skipped on the native-module mismatch. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_convergence and graph_upsert_skipped events]
- Allowing a graph adapter to call a direct append mutator or to become authoritative before the gateway and rollback gates pass. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:77-80,153-158]

## Dead Ends
The positive 024 completion narrative cannot be used as an implementation oracle until its cited SHA, export surface, and negative tests are re-established against the current runtime. The smallest productive next evidence is a fresh 024 build diff plus a red-before/green-after superseded-writer test and an export-surface grep.

## Edge Cases
- **Ambiguous input:** “first-mode” was interpreted as the research-mode adapter because the dispatch prompt explicitly names the research-mode graph adapter; other modes are deferred.
- **Contradictory evidence:** The 024 handover claims completion, while the dated 036 handover and corrected 024 decision record say the core is absent. Code-verified/current-source evidence is preferred; status remains blocked until a fresh build and tests settle it.
- **Missing dependencies:** The coverage-graph database/native binding is unavailable in prior state events; parity is specified to run without it.
- **Partial success:** Design-level fixture and gate findings are complete, but no implementation or execution evidence was produced in this research-only iteration.

## Sources Consulted
- specs/system-deep-loop/036-deep-loop-innovation/spec.md:64-67,77-80,95-101,153-173,262-271
- specs/system-deep-loop/036-deep-loop-innovation/handover.md: “014 IS NOT READY” and “Concrete remaining PATH-1 build scope” sections
- specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/decision-record.md:391-416
- specs/system-deep-loop/036-deep-loop-innovation/024-durable-write-boundaries/handover.md:11-17
- .opencode/skills/system-deep-loop/runtime/lib/voc-allocation/events.ts:338
- .opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/budget-authority.ts:1248
- .opencode/skills/system-deep-loop/runtime/lib/locks-and-fencing/lock-lifecycle-evidence.ts:251
- specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph convergence/upsert skipped events

## Assessment
- **New information ratio:** 0.80
- **Questions addressed:** Q2 focused fencing status; Q5 focused fixture, parity, and adapter boundary
- **Questions answered:** The design contract and current blocker status are answered; implementation execution remains open.

## Reflection
- **What worked and why:** Comparing the dated 036 handover, the 024 correction block, and live runtime call-site evidence separated a stale completion claim from a current safety contract.
- **What did not work and why:** A fresh end-to-end fixture or fence test could not be executed in a research-only pass and the tool budget closed before additional source reads; this limits claims to design and code-verification evidence already captured.
- **What I would do differently:** Start the next iteration with a red-before export-surface and superseded-writer check, then build the fixture against a pinned corpus and independently hash the reducer bundle before considering any authority-path experiment.

## Next Focus
Implementation-owned verification: re-establish 024's gateway-only append fence against the current runtime, then exercise the research adapter fixture and the five parity gates with graph DB disabled. Do not permit graph authority or cutover based on the stale 024 completion narrative.
