# Iteration 11: Deep Alignment of the 036 Evidence Ledger with Graph Engineering

## Focus
Map the 036 evidence-ledger spine onto graph-engineering semantics without collapsing authority, audit, or adjudication into ordinary graph state. The selected interpretation covers typed state and event mutation, guarded transition routing, replay/receipt evidence, blinded branches, and the resulting hybrid architecture. Session-specific claims were deferred because the supplied GraphARC session path was not present.

## Actions Taken
1. Read the GraphARC typed-state contract and inspected its strict field/assignment behavior.
2. Read the GraphARC OpenTelemetry adapter to establish what replay-derived observability preserves and what it does not.
3. Attempted the supplied GraphARC runtime session path; it returned `ENOENT`, so no session lifecycle claim is made from that path.
4. Reused the already-established iteration-004 LangGraph findings and the 036 specification/handover citations recorded in the packet state and registry; a bounded 036 pattern scan produced no fresh matches.

## Findings
1. **[P1] GraphARC state is a useful node-boundary contract, not an authority ledger.** `GraphARCState` is a Pydantic model configured to forbid unknown fields and validate assignment, so a node update that introduces an undeclared field or invalid assigned value fails at the state boundary. The deep-loop adapter can use this pattern for a typed normalized execution snapshot, while keeping append-only ledger writes outside mutable graph state. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18]
2. **[P1] GraphARC replay-to-OTel is an observability projection of why-relevant execution facts.** The adapter builds a root span, node-execution spans, and attributed sub-step spans from replayed trace events; it carries run, graph, node, phase, step, attempt, state-delta, token, cost, model, and termination metadata. It also documents that sub-step parentage can be inferred or fall back to the run span, and that the real SDK path is not verified in the local tree. This is valuable audit telemetry, but it is not a sealed receipt or a fail-closed transition decision. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/observe/otel.py:1-34,119-226,269-310]
3. **[P0] The 036 spine and a graph checkpointer belong to different authority planes.** The 036 design combines a versioned typed append-only event ledger, fail-closed transition authorization, replay fingerprints, receipts/effect recovery, sealed reference artifacts, fencing, and blinded/counterfactual adjudication. A graph state snapshot or checkpoint can carry the current reducer input and resume position, but must not become the sole source of truth for those append, seal, identity, or authorization invariants. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103; specs/system-deep-loop/036-deep-loop-innovation/handover.md:59-83,116-160]
4. **[P0] A conditional graph edge is only the topology slot for authorization; it is not the authorization gateway.** GraphARC's prior admission evidence shows the safe pattern: proposed topology is checked against registry, policy, budget, depth, and acyclicity before execution, while LangGraph conditional routing supplies routing mechanics. The 036 gateway must therefore precede the edge transition, bind identity/policy state, emit an allow or deny decision, and make the decision receipt available to the ledger. A node or model-generated `Command`/conditional edge must not bypass that gateway. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:69-93,95-160; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103; https://docs.langchain.com/oss/python/langgraph/graph-api]
5. **[P1] Replay fingerprints and receipts need an explicit evidence projection around graph execution.** GraphARC's OTel spans preserve timing, hierarchy, state deltas, and terminal status, but span boundaries are partly derived from recorded durations and unresolved parentage can be attached to the run. The 036 fingerprint/receipt layer should instead hash the normalized input, policy/identity binding, admitted transition, sealed references, and effect outcome; the graph trace can be cited by that receipt but cannot replace it. [INFERENCE: based on specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/observe/otel.py:15-34,140-226 and specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103]
6. **[P1] Blinded or counterfactual adjudication maps to isolated speculative branches, not ordinary shared-state fan-out.** A graph implementation can materialize separate candidate subgraphs for independent adjudication views, but each branch must receive a blinded/sealed input and write branch-local outputs. Only a gateway-mediated merge, backed by a receipt and ledger event, may affect the authoritative work graph; checkpoint persistence alone does not provide this isolation or adjudication proof. [INFERENCE: based on specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103 and https://docs.langchain.com/oss/python/langgraph/persistence]
7. **[P1] The aligned target is a stable control graph plus per-run work graphs, with the 036 ledger surrounding both.** Registry-defined mode contracts, identity/policy, and gateway transitions form the stable control graph. A run-specific work graph can express dispatch, evidence fan-out, synthesis, convergence, and blocked/retry routes using typed state and guarded edges. The append-only ledger, sealed artifacts, fingerprints, receipts, and observability traces remain adjacent authority/audit planes; this adds graph engineering where topology and state contracts are useful without claiming that the current control plane has already migrated. [INFERENCE: based on specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18, specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/observe/otel.py:140-226, and specs/system-deep-loop/036-deep-loop-innovation/handover.md:59-83,116-160]

## Questions Answered
- **Q2 (036 spine):** Answered for graph alignment: ledger, gateway, sealing, receipts, and adjudication remain authority concerns outside mutable graph/checkpoint state.
- **Q4 (practical graph model):** Answered for the inspected boundary: typed state and conditional topology are graph primitives; replay-to-OTel is an observability projection, not a ledger.
- **Q5 (target architecture):** Answered at design level: use a stable control graph and per-run work graphs behind the existing authority-preserving migration sequence.

## Questions Remaining
- Canonical owner-approved status, deprecation, or merge evidence for 034 and 036–046 remains unresolved.
- An implementation-owned first-mode adapter still needs a deterministic replay fixture, receipt/fingerprint contract, and measurable shadow-parity gates.
- The packet-local LangChain article body remains absent; official LangGraph documentation remains the source of truth for API claims.
- The supplied GraphARC session path needs a corrected path or owner confirmation before session-lifecycle mapping is claimed.

## Ruled Out
- Treating a LangGraph checkpointer, GraphARC state object, coverage graph, or OTel export as the 036 append-only authority ledger. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103; https://docs.langchain.com/oss/python/langgraph/persistence]
- Treating conditional routing or model-generated dynamic edges as permissionless transition authorization. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:69-160]
- Sharing mutable authoritative state across blinded/counterfactual branches before gateway-mediated adjudication. [INFERENCE: based on specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103]
- Reopening the already-blocked big-bang/database-first migration directions; the additive-dark, shadow-parity, and rollback-window sequence remains the supported path. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26; specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl: graph_upsert_skipped events]

## Edge Cases
- **Ambiguous input:** The prompt's `session/state.py` pointer was interpreted as a runtime session module plus the verified state module. The runtime session path was absent, so session-specific claims are deferred.
- **Contradictory evidence:** No new contradiction was introduced. Existing stale child status labels versus the dated 036 handover remain unresolved and are not used to authorize cutover.
- **Missing dependencies:** The session read returned `ENOENT`; the bounded 036 scan returned no matches. Prior packet evidence and the successful state/OTel reads were used as fallbacks.
- **Partial success:** Seven alignment findings were captured, but direct session-lifecycle evidence and a local LangChain article body remain unavailable; status is complete for the scoped alignment question, not for those residuals.

## Sources Consulted
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/state.py:1-18
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/observe/otel.py:1-34,119-226,269-310
- specs/system-deep-loop/036-deep-loop-innovation/spec.md:60-67,94-103
- specs/system-deep-loop/036-deep-loop-innovation/handover.md:59-83,116-160
- specs/system-deep-loop/036-deep-loop-innovation/execution-sequencing-strategy.md:1-26
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/README.md:69-160 (prior packet evidence)
- https://docs.langchain.com/oss/python/langgraph/graph-api (prior iteration-004 evidence)
- https://docs.langchain.com/oss/python/langgraph/persistence (prior iteration-004 evidence)
- specs/system-deep-loop/037-graph-engineering/context/GraphARC-main/grapharc/runtime/session.py (attempted; unavailable)

## Assessment
- **New information ratio:** 0.74 (two findings are fully new from the state and OTel contracts; five are partial synthesis; a 0.10 simplicity bonus reflects the clean separation of topology, authority, audit, and branch planes).
- **Questions addressed:** Q2, Q4, Q5.
- **Questions answered:** Graph-to-ledger authority boundary, gateway placement, replay/receipt separation, and branch isolation.
- **Status:** complete for this focus, with the documented partial-success residuals.

## Reflection
- **What worked and why:** Reading the state contract beside the replay-to-OTel projection made the graph/runtime boundary concrete; combining those contracts with the already-established 036 and LangGraph evidence exposed exactly where graph primitives stop.
- **What did not work and why:** The supplied session path did not exist, and the narrow 036 grep returned no matches; neither failure was retried because the redispatch budget required early artifact writes.
- **What I would do differently:** Before the implementation follow-up, resolve the session module path and define a receipt fixture that binds a normalized graph transition, policy identity, sealed artifact hash, and replay fingerprint.

## Recommended Next Focus
Implementer-owned adapter/replay fixture design and shadow-parity acceptance gates for the first mode, including gateway-only transition writes and branch-isolation tests. Do not use the absent local LangChain article as a prerequisite; retain official LangGraph findings as the API reference. Separately request an owner-approved manifest for 034 and 036–046.

## SCOPE VIOLATIONS
None. No researched source, reducer-owned file, or path outside the three allowed packet artifacts was modified.
