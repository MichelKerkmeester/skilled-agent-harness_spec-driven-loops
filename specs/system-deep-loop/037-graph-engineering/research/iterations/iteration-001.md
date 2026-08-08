# Iteration 1: Current system-deep-loop status and authority wiring

## Focus
Inventory the live workflow modes, runtime convergence/state/fan-out/lock subsystems, and graph-metadata/mode-registry wiring; distinguish landed runtime routing from stale 036 status labels. The narrow interpretation is the shipped hub/runtime contract plus the 036 handover's code-verified status; detailed per-phase correctness is deferred.

## Actions Taken
- Read the deep-research config, state log, strategy, and findings registry before selecting focus.
- Read the system-deep-loop hub, mode registry, and 036 spec/handover.
- Read the convergence, loop-lock, fan-out, and coverage-graph upsert runtime entrypoints.

## Findings
1. The public hub is routing-only and registry-driven: it exposes seven active workflow modes—research, review, ai-council, three improvement lanes, and alignment—and explicitly keeps per-mode convergence/state/artifact contracts in their packets. The hub's three-tier discriminator separates `workflowMode`, graph-backed `runtimeLoopType`, and `backendKind`; runtime convergence accepts research/review/council, while improvement uses a host backend and alignment uses its own convergence backend. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:1-29, .opencode/skills/system-deep-loop/SKILL.md:60-96]
2. The mode registry is the declared routing authority and records the seven modes: research→runtime/research, review→runtime/review, ai-council→runtime/council; agent/model/skill improvement→explicit null runtimeLoopType plus improvement-host; alignment→explicit null plus alignment-convergence. The three improvement variants intentionally share the `deep-improvement` packet, so mode identity is not equivalent to packet identity. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:1-33, .opencode/skills/system-deep-loop/mode-registry.json:65-190]
3. The shipped runtime has a real convergence entrypoint with validated convergence profiles, threshold/min-observation controls, default/off/sliding-window/divergent modes, observability events, and a graph novelty floor; the implementation is not merely a raw ratio despite the 036 problem statement describing the historical runtime as ad-hoc. However, the public convergence runtime still validates only `research|review|council` loop types, which confirms that improvement and alignment are intentionally outside this backend. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:1-70, .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:145-240; .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:134-152]
4. Loop locking is centralized behind a CLI adapter over the TypeScript loop-lock library, with acquire/status/refresh/release operations, PID/TTL/heartbeat state, optional nonce handling, stale-lock classification, and a shared contract for the active research/review/council YAMLs. This is landed plumbing, but the 036 handover identifies the underlying `openSync(...,'wx')` create-then-write partial-record window as still open and names it as an 014 cutover precondition; therefore “loop-lock exists” and “cutover-safe locking” are distinct claims. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:1-28, .opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:86-186; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:1-32]
5. Fan-out is a substantial runtime subsystem rather than a thin dispatcher: the entrypoint imports capped-pool execution, status ledgers, orphan/retry accounting, wave planning, orchestration summaries, salvage sweeps, observability, and budget/stop-policy helpers. This supports durable lineage-oriented orchestration, but the current implementation still has a large imperative CLI surface; the evidence does not establish graph-native node execution or graph-based conditional routing yet. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1-38, .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:146-244; INFERENCE: based on the imported pool/ledger/wave/salvage architecture and the absence of a graph-runtime node contract in the inspected entrypoint]
6. Coverage-graph storage is already wired as a graph metadata path: the upsert entrypoint accepts typed nodes and edges, validates loop namespaces, rejects self-loops, supports coverage graphs for research/review and a separate council graph, and dispatches to SQLite-backed graph modules. It also supports seed metadata for coverage graphs but explicitly rejects seed options for council. This is a graph telemetry/coverage substrate, not evidence that the workflow control plane has been migrated from imperative loops to a state graph. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:1-17, .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:95-152, .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:181-226]
7. The 036 program's architecture is additive-dark substrate→shadow parity→staged per-mode authority cutover→legacy retirement, not a big-bang rewrite. Its phase map places durable fan-in before novelty/claims and both before convergence activation; shared mode contracts precede per-mode migrations; authority cutover is phase 014 and legacy retirement phase 015. The handover says spine phases 001-013 are built/landed, but 014 remains blocked and operator-gated by unresolved identity, policy-state, and loop-lock preconditions; it also warns that many child graph-metadata status labels are stale and that docs/landing gaps make self-reported completion unreliable. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:28-45, specs/system-deep-loop/036-deep-loop-innovation/spec.md:84-144; SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:1-32, specs/system-deep-loop/036-deep-loop-innovation/handover.md:116-160]
8. The strongest current status is therefore: routing and runtime plumbing are landed; graph coverage metadata is partially landed as an auxiliary graph; the evidence-ledger architecture is landed additively/dark in the 036 program; but serving-authority cutover is not landed. In particular, the handover code-verifies blockers in 022 (deep-review parity still incomplete) and 024 (append-boundary fencing absent/fabricated evidence), so graph-engineering alignment must treat the ledger/control plane as migration target rather than assume it is authoritative. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:44-83; INFERENCE: synthesis of hub, registry, runtime, and handover evidence]

## Ruled Out
- Treating `workflowMode` as the runtime convergence key was ruled out: the hub and registry require explicit `runtimeLoopType`, including load-bearing nulls for custom backends. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:70-81; .opencode/skills/system-deep-loop/mode-registry.json:44-64]
- Treating existing coverage-graph upsert as a workflow state-graph migration was ruled out; the inspected contract is node/edge persistence and validation, while control execution remains in convergence/fan-out entrypoints. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:134-226; INFERENCE: compared with .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:1-70 and fanout-run.cjs:1-38]

## Dead Ends
No exhausted approach was retried. Broad external graph-framework comparison was deferred because this iteration's strategy focus is current-system inventory, not Q3/Q4 corpus analysis.

## Edge Cases
- Ambiguous input: selected the narrow current-status interpretation; detailed 036 phase-by-phase validation and reference-corpus comparison are deferred to Q2-Q4.
- Contradictory evidence: the 036 parent spec describes historical ad-hoc raw-ratio behavior, while the current convergence entrypoint exposes richer profiles and modes. Both are preserved; current runtime code is better evidence for landed behavior, while the spec remains evidence for the innovation rationale. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:28-45; SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:38-70]
- Missing dependencies: the state log records a better-sqlite3 NODE_MODULE_VERSION mismatch, so the coverage-graph convergence decision was treated as absent by workflow fallback; no attempt was made to repair dependencies. [SOURCE: specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:5]
- Partial success: graph metadata file inspection was not completed within the per-iteration tool budget; graph-metadata conclusions are limited to the hub's explicit one-metadata invariant and the registry/runtime evidence. [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:100-121]

## Sources Consulted
- .opencode/skills/system-deep-loop/SKILL.md:1-29, 60-121
- .opencode/skills/system-deep-loop/mode-registry.json:1-33, 65-190
- .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:1-70, 145-240
- .opencode/skills/system-deep-loop/runtime/scripts/loop-lock.cjs:1-28, 86-186
- .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1-38, 146-244
- .opencode/skills/system-deep-loop/runtime/scripts/upsert.cjs:1-17, 95-152, 181-226
- specs/system-deep-loop/036-deep-loop-innovation/spec.md:28-45, 84-144
- specs/system-deep-loop/036-deep-loop-innovation/handover.md:1-32, 44-83, 116-160
- specs/system-deep-loop/037-graph-engineering/research/deep-research-state.jsonl:5

## Assessment
- New information ratio: 0.94 (7 fully new findings, 1 partially new synthesis; the current-state inventory narrows the migration boundary).
- Questions addressed: Q1; partial context for Q2 and Q5.
- Questions answered: Q1 at status level, with authority-cutover uncertainty explicitly retained.

## Reflection
- What worked and why: reading the hub/registry alongside runtime entrypoints and the 036 handover separated current landed behavior from historical rationale and stale metadata labels.
- What did not work and why: the graph-metadata file itself was not read before the 12-call budget was exhausted; only the hub's one-file invariant could be reported.
- What I would do differently: next iteration should inspect the graph metadata JSON directly, then reconcile registry projections, mode packet contracts, and the exact graph convergence fallback in the state log before broadening to graph-engineering references.

## Recommended Next Focus
Q2: trace the 036 evidence-ledger spine and migration phases against current child statuses, especially 022/024 and the 014 authority gate; separately verify the graph-metadata JSON and stale-status reconciliation before mapping to graph primitives.
