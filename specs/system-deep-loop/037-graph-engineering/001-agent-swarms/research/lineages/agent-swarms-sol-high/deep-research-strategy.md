# Deep Research Strategy — Graph-Based Agent Loops

## 2. TOPIC

Extract concrete graph-engineering mechanisms from AgentSwarms and all 12 supplied blog posts, test them against the current `system-deep-loop` runtime and the 036 authority plane, and produce evidence-cited design decisions with explicit when-not-to-use boundaries.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] What is the minimum versioned executable graph IR that can express current deep-loop modes without displacing 036 authority?
- [x] Which barrier, pipeline, reducer, branch, retry, and conflict-safe wave semantics are safe and deterministic?
- [x] How should eval verdicts become typed control edges backed by deterministic checks, independent judges, and certificates?
- [x] How should ledger replay, checkpoints, effects, fencing, and resumable human gates interact?
- [x] How should existing research, review, council, and improvement loops become typed subgraphs with independent convergence?
- [x] What parity tests are required across CLI, native, browser-like, headless, and fan-out execution surfaces?
- [x] How should stable organization graphs govern dynamic per-run work graphs and generated topology?
- [x] How should evidence graphs and knowledge graphs jointly route retrieval while preserving provenance and temporal supersession?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Implementing the graph runtime or changing any current runtime/036 source.
- Treating blog claims as implementation evidence when repository code or tests disagree.
- Replacing 036's typed ledger, transition gateway, receipts, fencing, or cutover discipline with graph checkpoints.
- Generalizing graphs to small, linear, exploratory, or tightly supervised tasks without a measured benefit.

## 5. STOP CONDITIONS

- Run exactly 20 iterations; convergence before iteration 20 is telemetry only.
- Stop only for unrecoverable state corruption, containment failure, or exhaustion of all evidence paths.
- Final synthesis must cover all eight angles, all 12 blog posts, AgentSwarms mechanisms, current runtime mappings, 036 authority mappings, and when-not-to-use boundaries.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- Typed IR: sealed `GraphDefinitionV1` over 036 transition authority (iterations 1–2, 19).
- Scheduler: explicit readiness, deterministic reducers, write-set/fenced waves (iterations 3–5).
- Verdicts: structural `GateVerdictV1` with deterministic-first, blinded certificate authority (iterations 6–7, 17).
- Replay: ledger authority, disposable checkpoints, effect receipts, fenced human decisions (iterations 8–9).
- Loops: mode-specific typed child graphs with independent convergence and exits (iterations 10–11).
- Parity: normalized authorized ledger-trace fixtures across all adapters (iterations 12, 17, 20).
- Organization/work: stable capability policy plus compiled per-run proposals and versioned patches (iterations 13–14).
- Hybrid routing: separate evidence/knowledge graphs with lexical/vector/graph/hybrid routing and temporal provenance (iterations 15–16).
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Comparing current backend ownership with the 036 authority plane before designing topology prevented a competing state authority (iteration 1).
- Contrasting AgentSwarms' executable semantics with 036's durable identities yielded a minimal IR seam (iteration 2).
- Converting branch/reducer behavior into typed contracts exposed deterministic replay requirements (iteration 3).
- Separating readiness from execution width yielded explicit barrier and pipeline rules (iteration 4).
- Reusing 036 write-set and fencing contracts closed the missing wave-safety substrate (iteration 5).
- Treating verdict as an edge payload separated evaluation evidence from control authority (iteration 6).
- Blinding, negative controls, blast-radius policy, and certificate binding made gate authority auditable (iteration 7).
- Assigning ledger/checkpoint/effect state distinct roles produced exact crash behavior (iteration 8).
- Distinguishing gate notification from ledger authority made human resume testable (iteration 9).
- Treating loops as child runs exposed mode-specific convergence and exit contracts (iterations 10–11).
- Using normalized ledger traces upgraded parity from source presence to behavior (iteration 12).
- Splitting organization policy from work proposals bounded dynamic topology authority (iterations 13–14).
- Separating evidence and knowledge graphs preserved provenance and control boundaries (iterations 15–16).
- Adversarial boundary and rollout passes converted concepts into an implementation order (iterations 17–20).
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Source-shape parity cannot establish runtime behavior; use normalized trace fixtures (iteration 12).
- Further document-only iteration cannot establish quality/cost/latency benefit; use shadow measurement (iteration 20).
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

- Graph checkpoints as state authority.
- Dynamic generators that can mint capabilities, budgets, or gate exemptions.
- Graph-only retrieval and fuzzy identity auto-merge.
- Graph-by-default adoption without genuine independent work or typed control need.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- Graph checkpoints as authority; big-bang mode cutover; coverage graph as scheduler (iteration 1).
- Arbitrary code or label-only edges as authoritative IR (iteration 2).
- Completion-order commits, prose routing, and control-node continue-on-error (iteration 3).
- Global barrier-only scheduling and silent partial fan-in (iteration 4).
- Metadata-only wave safety and leases without mutation-side fences (iteration 5).
- Free-form or report-only eval gates (iteration 6).
- Confidence-only authority and metadata-only certificates (iteration 7).
- Checkpoint-as-history and blind effect replay (iteration 8).
- Approval URLs, timeout-as-approval, and mutable reassignment (iteration 9).
- Textual completion as loop authority and one universal convergence metric (iterations 10–11).
- Source/import parity, byte-identical transcripts, and silent provider fallback (iteration 12).
- Organization graph as scheduler and in-place generated topology mutation (iterations 13–14).
- Combined evidence/knowledge/control graph, graph-only retrieval, and fuzzy auto-merge (iterations 15–16).
- Final-answer-only evaluation, graph-by-default, and cutover without parity/rollback evidence (iterations 17–20).
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: all eight prioritized research angles at design-decision level
- Pivot lineage: none yet
- Remaining frontier: implementation shadow prototype and measured parity/cost/latency evidence
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

No prioritized research question remains open. Concrete schema placement, compiler implementation language, and initial golden fixtures belong to implementation planning.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

Synthesis complete. Next evidence should come from a deterministic shadow prototype over 036, not additional corpus iteration.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Orientation seed: `specs/system-deep-loop/037-graph-engineering/001-agent-swarms/orientation.md`; every iteration must explicitly ground its focus in this seed.
- AgentSwarms reference: `specs/system-deep-loop/037-graph-engineering/context/agent-swarms`.
- Blog corpus: all 12 files under `specs/system-deep-loop/037-graph-engineering/context/blog-posts`.
- Current runtime: `.opencode/skills/system-deep-loop` plus the research YAML and reducer/convergence/fan-out services.
- Authority plane: `specs/system-deep-loop/036-deep-loop-innovation`, especially typed ledger, transition gateway, effects, receipts, budgets, fencing, parity, write-set conflicts, and cutover packets.
- Artifact root is pre-bound to this lineage. No resolver invocation and no writes outside this directory.
- `resource-map.md` was not present at init; the source inventory is derived directly from the specified corpus.

## 13. RESEARCH BOUNDARIES

- Max/min iterations: 20/20.
- Convergence threshold: 0.05; telemetry only until the cap.
- Per-iteration leaf budget target: 8–11 tool calls, hard max 12.
- Progressive synthesis: true.
- Config immutable; state append-only; iteration and delta files write-once.
- Current generation: 1.
- Started: 2026-08-13T18:16:49Z.
