# Iteration 17: Observability, Trajectory Evaluation, and Cost

## Focus

Early convergence is telemetry only, so this pass broadens across the eight angles and specifies the evidence needed to operate the graph safely.

## Findings

1. Evaluation must cover end-to-end outcome, trajectory, and component behavior; trajectory exposes loops, redundant calls, wrong parameters, and broken retrieval that a plausible final answer can hide. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:64-88]
2. Decision: every node attempt emits a normalized trace envelope with run/graph/node/attempt ids, causal parents, topology and adapter versions, input/output/evidence digests, selected edges, reducer result, budget debit, effect ids, gate verdict/certificate, timing, and terminal status. Payload bodies remain in sealed artifacts referenced by digest. [INFERENCE: gives parity, replay, evaluation, and cost accounting one observable boundary without duplicating authority]
3. Graph metrics include critical-path latency, queue and barrier wait, fan-out width, straggler tax, retry/revisit rate, branch prune ratio, reducer conflicts, judge disagreement, gate false-positive/negative results, effect ambiguity, and cost per certified output. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/How to Use Graph Engineering to Build a Multi-Factor Alpha Model.md:299-342]
4. Every promoted gate requires paired positive/negative controls, pinned evaluator/rubric versions, and shadow comparison against the current executor. A green suite remains evidence rather than proof and cannot erase blast-radius policy. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Eval Engineering: build the gate that lets your agents merge without you (full 6-step course).md:90-180]
5. Budget is hierarchical: run → subgraph → node → attempt. Reservations precede admission; actual usage is charged once; exhaustion selects a typed edge (`degrade|pause|escalate|terminate`) and may not silently change model, evidence requirements, or gate authority. [INFERENCE: applies the orientation's 036 budget authority to graph scheduling and nested loops]
6. When not to use: do not collect raw prompts, secrets, or unlimited token streams merely for observability. Capture the minimum sealed evidence required for replay/eval; use sampling only for non-authoritative telemetry, never for ledger events or gate certificates. [INFERENCE: preserves auditability while bounding privacy and storage blast radius]

## Ruled Out

- Final-answer-only evaluation; unversioned judges; opaque aggregate cost; telemetry as authority.

## Assessment

- New information ratio: 0.68
- Novelty: unifies parity, replay, eval, and cost around a normalized trace envelope.
- Questions addressed/answered: cross-cutting observability and budget contract.

## Recommended Next Focus

Stress explicit when-not-to-use boundaries and define a staged adoption ladder.
