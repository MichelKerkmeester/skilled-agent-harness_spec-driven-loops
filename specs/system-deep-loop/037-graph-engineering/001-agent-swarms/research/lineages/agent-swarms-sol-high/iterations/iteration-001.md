# Iteration 1: Current Control Topology and the 036 Authority Seam

## Focus

The orientation seed says the live system is a sequential outer loop with a graph-backed convergence projection, while 036 is the intended authority plane. This pass verified that boundary before proposing new topology. [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/orientation.md:126-145]

## Findings

1. The current runtime is not one uniform graph executor. Its registry explicitly divides research/review/council onto `runtime-loop-type`, improvement modes onto `improvement-host`, and alignment onto its own convergence backend. A graph IR therefore needs backend adapters and a stable mode contract; it cannot assume every mode already shares the same scheduler. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:6-25] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:30-106]
2. Current research control is still workflow-YAML orchestration around a single-iteration leaf. The graph runtime today is chiefly an evidence/coverage decision service: it can veto an inline stop, but it does not schedule the work topology. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:608-675] [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:303-335]
3. 036 already freezes the authority invariants a graph runtime must consume: append-only typed events behind fail-closed transition authorization, replay fingerprints, receipts/certificates, sealed references, and per-mode dark-to-authoritative cutover. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:35-42] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:150-160]
4. The graph must be a planner/executor projection over 036, never a competing truth store. In particular, a graph checkpoint may accelerate resume, but a transition becomes authoritative only through the 036 gateway and ledger; graph state must be reconstructible from authorized events plus sealed topology. [INFERENCE: based on the current YAML/convergence split and 036's additive-dark authority sequencing]
5. The first migration seam should be a shadow graph compiler that emits the same intended transitions as the legacy YAML, compares projected schedules/results, and leaves legacy writers authoritative until mode-specific parity and rollback gates pass. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:151-159] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:71-75]

## Ruled Out

- Replacing JSONL/YAML with an AgentSwarms-style mutable checkpoint as the source of truth: it would invert the 036 authority contract.
- A single immediate executor cutover across all modes: mode-registry backend diversity and 036 per-mode gates make this unsafe.

## Dead Ends

Treating the existing convergence coverage graph as an orchestration graph was eliminated; it models evidence sufficiency, not runnable node dependencies.

## Edge Cases

- Ambiguous input: “graph-based” could mean orchestration, knowledge, or convergence graphs; this iteration selected orchestration authority while preserving the other planes for later passes.
- Contradictory evidence: none.
- Missing dependencies: no live code graph was available; exact file evidence was used.
- Partial success: none.

## Sources Consulted

- [SOURCE: specs/system-deep-loop/037-graph-engineering/001-agent-swarms/orientation.md:126-170]
- [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:1-200]
- [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:608-675]
- [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:35-75]

## Assessment

- New information ratio: 0.82
- Novelty: establishes the non-negotiable graph/authority separation and migration seam.
- Questions addressed: executable IR authority boundary; runtime parity.
- Questions answered: the graph cannot itself be authoritative and must initially shadow existing mode backends.

## Reflection

- What worked and why: comparing the registry, YAML, convergence backend, and 036 handover exposed actual control ownership.
- What did not work and why: treating one current subsystem as “the runtime” hid backend diversity.
- What I would do differently: define the IR only after fixing its authority and adapter boundaries, which is now done.

## Recommended Next Focus

Define the minimum versioned graph IR—nodes, ports, edges, topology identity, policies, and gateway-bound transition intents.
