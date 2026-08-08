# Iteration 9: Runtime census and 036 phase ownership

## Focus
Runtime census + 036 phase ownership: live loop-lock/fanout/validator wiring, coverage-graph upsert and reducer boundaries, and canonical ownership/status for 034 and 036-046.

## Actions Taken
- Read the externalized config, state log, strategy, and findings registry before selecting the focus; the state log contained eight prior iteration records and the strategy explicitly carried this runtime/ownership census forward.
- Read the live `deep-research-auto.yaml` command surface and mechanically inspected the loop-lock, fanout, upsert, validator, and reducer entrypoints.
- Compared the 036 parent phase map and handover references for 034 and 036-046; no researched file was modified.

## Findings
1. **[P1] Loop locking is live command-surface plumbing, but its safety claim is narrower than cutover safety.** The live workflow invokes `loop-lock.cjs acquire` before session classification and specifies owner-scoped release on terminal paths. The CLI's acquire path supplies packet identity, owner PID, TTL (default 300000 ms), heartbeat timestamp, and runtime kind; status parses the disk record, computes stale state and process liveness, while refresh and release are owner/optional-nonce operations. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:152-215] The dated 036 handover still identifies the `openSync(..., 'wx')` create-then-write partial-record window as an unresolved 014 precondition, so “lock CLI is wired” must not be promoted to “authority cutover is safe.” [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:1-32]

2. **[P1] Fan-out is directly wired and is a lineage executor surface, not merely a graph node dispatcher.** The live workflow calls `fanout-run.cjs` with spec folder, research loop type, topic, fan-out config, artifact root, and convergence threshold. The runtime accepts only research/review fan-out, rejects deprecated context fan-out, creates isolated lineage prompts/artifact directories and session bindings, and maps executor kinds to command builders; child processes are started asynchronously so the capped pool can overlap lineages. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:336-340,1085-1184,1353-1375,1504-1660]

3. **[P1] `upsert.cjs` is a typed graph projection boundary and requires the graph database only for that projection.** It imports the coverage-graph or council database, validates loop namespaces, parses typed nodes/edges, rejects self-loops and invalid vocabularies, takes a writer lock, and calls `batchUpsert`; cleanup closes the DB and releases the writer lock. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:151-180,204-315] The packet's prior runtime events record the native `better-sqlite3` ABI mismatch and therefore skipped graph convergence/upsert. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_convergence and graph_upsert_skipped events] This blocks graph projection, not the file-first iteration narrative/state/delta contract.

4. **[P1] Validation and reduction are separate contracts, and the bounded read does not prove that the research auto workflow uses the review reducer as a loop node.** `verify-iteration.cjs` checks the iteration narrative, finds the last matching canonical `type=iteration` record, enforces research route proof (`mode`, `target_agent`, `agent_definition_loaded`, `resolved_route`), and requires an iteration row in the delta file. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:131-188] `reduce-state.cjs` parses state and delta JSONL and its exported reducer resolves a review artifact root and `deep-review-state.jsonl`, then rebuilds registry/strategy/dashboard outputs; that makes it reducer support, not evidence of research execution control. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:154-174,1044-1072,2053-2117] **Residual risk: P1** if a caller assumes the review-oriented reducer path is a direct research loop phase without the workflow's explicit artifact binding.

5. **[P1] 034 has a documented role; 036-046 do not have canonical ownership/status evidence in the parent packet.** The 036 completion path calls 034 an optional runtime-library modularization scaffold that is explicitly reorg-last, after the core landing path. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:PHASE DOCUMENTATION MAP] The parent documentation/status coverage exposes other numbered phases but no direct canonical child packet/status rows for 036-046; the handover's completion ordering proceeds through remediation, the whole-system gate, 014 cutover, 015 retirement, and 016/017 closeout rather than assigning these numbers. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:PHASE DOCUMENTATION MAP] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:181-186] This is a documentation/ownership gap, not evidence that 036-046 are complete, failed, or owned by the graph-engineering packet. **Residual risk: P1.**

6. **[P2] The runtime already has graph-shaped machinery, but it is not yet a graph-native control plane.** Canonical iteration records carry valid `graphEvents` node/edge vocabulary; `upsert.cjs` persists typed coverage/council nodes and edges; and the reducer preserves graph-convergence signals, decision, and blockers for downstream analysis. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:iterations 1-8] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:204-315] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1044-1072] The distinction remains important: current execution is still workflow/CLI plus reducer telemetry, and the unavailable DB means the persistence projection is optional/degraded rather than authority-bearing. [INFERENCE: based on the live YAML wiring, runtime entrypoints, and recorded graph-upsert skip events]

## Questions Answered
- **Q1 (current status):** The live command surface directly wires loop-lock and fan-out; validator and reducer contracts exist; upsert is a graph projection with a currently unavailable native DB; the graph machinery is auxiliary rather than authority-bearing.
- **Q2 (phase ownership/status):** 034 is optional and reorg-last; 036-046 remain unassigned/unverified in the available canonical parent documentation, so their status cannot be promoted beyond “coverage gap.”
- **Q5 (existing machinery):** graph events, typed upsert vocabulary, and reducer graph-convergence rollups are already present, but they do not establish graph-native workflow control.

## Questions Remaining
- What owner-approved manifest, deprecation record, or merge record canonically accounts for 036-046?
- Does the lower portion of the live YAML invoke `verify-iteration.cjs` and `reduce-state.cjs` through explicit research artifact bindings, or only through generic post-dispatch/reducer orchestration?
- When can the coverage graph DB be rebuilt with a compatible native module so projection parity can be tested without conflating DB availability with control-plane correctness?

## Edge Cases
- **Contradictory evidence:** lock acquisition/release is implemented and wired, while the 036 handover still records a partial-record window; both claims are retained and the cutover claim remains blocked. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:152-215] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:1-32]
- **Missing dependency:** coverage-graph convergence/upsert was skipped because of the recorded `better-sqlite3` ABI mismatch; file-first evidence remained available. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph_upsert_skipped events]
- **Partial success:** runtime mechanics were freshly censused, but canonical owner/status evidence for 036-046 was not found; the next step is an owner-approved manifest, not an inferred status.

## Sources Consulted
- `.opencode/commands/deep/assets/deep-research-auto.yaml`
- `.opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:152-215`
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:336-340,1085-1184,1353-1375,1504-1660`
- `.opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:151-180,204-315`
- `.opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs:131-188`
- `.opencode/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:154-174,1044-1072,2053-2117`
- `specs/system-deep-loop/036-deep-loop-innovation/spec.md:PHASE DOCUMENTATION MAP`
- `specs/system-deep-loop/036-deep-loop-innovation/handover.md:1-32,181-186`
- `specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:graph convergence/upsert events`

## Assessment
- **New information ratio:** 0.83 (4 fully new findings, 2 partial refreshes; no simplicity bonus because 036-046 ownership remains unresolved).
- **Questions addressed:** Q1, Q2, Q5.
- **Questions answered:** runtime wiring/dependency boundary; 034 role; graph machinery boundary.
- **Status:** complete for the in-scope census, with the phase-ownership residual explicitly carried forward.

## Reflection
- **What worked and why:** Reading the live YAML beside the exact entrypoints separated direct command wiring from helper/reducer roles; reading the handover beside the parent phase map prevented absent phase packets from being mislabeled complete.
- **What did not work and why:** The bounded tool budget stopped a lower-YAML reread and an owner-manifest search; the remaining uncertainty is therefore about canonical invocation/ownership, not the inspected runtime mechanics.
- **What I would do differently:** Start the next pass with a narrow phase-owner/deprecation manifest search, then inspect only the YAML post-dispatch block needed to prove validator/reducer bindings.

## Recommended Next Focus
Obtain the smallest owner-approved manifest or explicit deprecation/merge record for 034 and 036-046, then verify the lower `deep-research-auto.yaml` post-dispatch/reducer bindings. Keep graph DB recovery as an optional projection-parity check rather than a prerequisite for adapter/control-plane research.
