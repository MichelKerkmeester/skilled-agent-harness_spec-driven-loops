# Iteration 18: When Not to Use Graphs and Staged Adoption

## Focus

The design needs a rejection rule, not only a construction recipe. This pass converts the corpus's cautions and 036 cutover discipline into explicit boundaries.

## Findings

1. The fake-edge test is decisive: if every step genuinely depends on the prior step, there is no exploitable graph width. Small, exploratory, tightly supervised, or intrinsically sequential work should remain a loop or direct harness action. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering explained: what it is, when to use it and when not to.md:193-231]
2. A graph buys breadth, isolation, typed routing, and failure localization; it does not create better judgment or external truth. Multiple agents sharing the same weak evidence can amplify correlated error. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Graph Engineering with Claude: How to Stop Running a Line and Start Running a Fleet.md:250-330]
3. Decision: require a `GraphJustification` before dynamic/multi-node execution: at least two independent jobs or a real branch/gate/subgraph need, measurable expected benefit, bounded fan-out/cost, declared anchors, and a fallback simpler topology. Otherwise compile to a line/loop or reject graph expansion. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/Harness, Loop, or Graph? Building Reliable Agent Systems at the Right Layer.md:92-118]
4. Adoption ladder: (0) emit graph IR/trace in shadow while legacy owns execution; (1) deterministic pure nodes and reducers; (2) read-only fan-out; (3) conflict-safe isolated writes with 036 fences; (4) eval-controlled edges; (5) durable human gates/effects; (6) generated work graphs; (7) mode-by-mode authority cutover after parity certificates. [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/spec.md:123-169]
5. Each step needs a rollback to the preceding executor, zero legacy-writer ambiguity, golden-trace parity, negative-control success, cost/latency baseline, and mode-specific acceptance certificate. No stage is unlocked merely because the next schema exists. [INFERENCE: translates 036 additive/dark migration into graph-runtime cutover gates]
6. Additional boundaries: no graph-only retrieval for simple lookup; no autonomous gate for irreversible production writes; no dynamic topology that expands authority; no parallel writes with unknown conflicts; no extracted knowledge graph without entity-resolution quality; no typed subgraph for a bounded retry. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/blog-posts/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-195]

## Ruled Out

- Graph-by-default; “more agents” as quality evidence; schema-complete as cutover-ready.

## Assessment

- New information ratio: 0.64
- Novelty: produces a compile-time justification and reversible seven-stage authority ladder.
- Questions addressed/answered: explicit when-not-to-use and adoption boundary.

## Recommended Next Focus

Integrate the mechanisms into an extractable architecture and decision register.
