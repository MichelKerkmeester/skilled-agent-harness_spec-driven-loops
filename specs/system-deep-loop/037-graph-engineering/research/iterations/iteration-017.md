# Iteration 17: When-not-to-use validation and direct residual verification

## Focus
Validate when graphs lose more than they gain, map that rule to the seven registered modes and the deep-research workflow phases, and close the iteration-16 direct checks for the transition gateway, loop-lock partial-record window, and graph-engineering-master inventory.

## Actions Taken
1. Read the iteration prompt pack, config, state log, strategy, and findings registry before selecting the focus.
2. Read the transition authorization gateway for `identityResolver` behavior and the loop-lock implementation for fresh acquisition and atomic refresh writes.
3. Directly inventoried `graph-engineering-master/dist/` and `graph-engineering-master/graph-engineering/`.
4. Narrowly searched the supplied articles for when-not-to-use criteria and checked the mode registry and research workflow branch markers. The final bounded command returned exit 141 because its `head` pipeline closed early; the required article, registry, and workflow matches had already been emitted, so this is recorded as partial-success rather than a source failure.

## Findings
1. **[P1] Graphs are not the default for simple, linear, low-concurrency work.** The corpus decision matrix assigns simple/low-concurrency tasks to a single loop, simple/high-concurrency tasks to parallel loops, and complex/low-concurrency tasks to staged loops; it reserves graph engineering for complex/high-concurrency work with at least three independent verification steps and complex decision routing. The article set separately reports that graphs lose on simple lookups and cost, while graph harnesses add design, failure-propagation, context-routing, and distributed-runtime overhead. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-173] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/What is Graph Engineering?.md:174-182] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:174-185,215-222]
2. **[P1] In our seven-mode system, graph structure is highest-value for research, review, and ai-council, but is not a blanket fit for the four custom-backend modes.** Research/review/council expose runtime-loop types and naturally contain evidence branching, fan-out, deliberation, and convergence. Agent-improvement, model-benchmark, and skill-benchmark share the improvement host, while alignment uses a separate read-only alignment-convergence backend; for a single candidate, benchmark, or conformance pass with no material branching, graph topology would add coordination and state overhead without changing the decision. This is a fit assessment, not a claim that those modes can never use a graph for batched or branching work. [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:30-199] [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:127-159,178-223] [INFERENCE: applying the corpus decision matrix to the registered backend and concurrency boundaries]
3. **[P1] Within the deep-research workflow, graph structure earns its cost at fan-out, guarded routing, convergence, and multi-lineage synthesis—not at every sequential phase.** `step_fanout_spawn` is explicitly skipped for single-executor runs, while initialization, preflight, lock acquisition, state classification, one leaf iteration's read/research/write/verify sequence, and a no-fanout synthesis path are predominantly linear. A graph adapter should therefore wrap the fan-out/convergence seams and preserve the leaf artifact contract rather than turn every file operation into a graph node. [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:147-159,178-223] [INFERENCE: applying the article's fake-edge and overhead tests to the workflow's explicit single-executor branch]
4. **[P0 cutover residual] `identityResolver` is an optional gateway check, not an unconditional identity binding.** `TransitionAuthorizationGateway` invokes `#checkIdentity` only when `this.#options.identityResolver` is configured; the resolver may return no expectation, and only fields it pins are compared with the request. Therefore the gateway source alone does not prove deployment identity safety: production construction must provide a resolver that binds the expected identity, otherwise the F001 fail-closed precondition remains unresolved. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:523-531,718-773] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/033-identity-and-lock-ownership-hardening/implementation-summary.md:64-70]
5. **[P0 cutover residual] The fresh-acquisition partial-record window remains visible in `loop-lock.ts`.** The atomic writer uses a temporary path, fsync, and rename, but `writeLoopLockExclusive` still calls `openSync(lockPath, 'wx')` and then writes the JSON through the descriptor. A concurrent reader can observe the newly created target between those operations; the reader converts malformed/partial JSON to `null`. This is the exact implementation seam behind the handover's F005 cutover blocker, so the presence of fsync/atomic refresh code must not be reported as proof that F005 is discharged. [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:215-261] [SOURCE: specs/system-deep-loop/036-deep-loop-innovation/handover.md:59-77,116-160]
6. **[P1] The graph-engineering-master packet contains a packaged skill artifact but no executable local implementation directory.** Direct inventory found `dist/graph-engineering.skill`; `graph-engineering/` exists but is empty. This narrows, rather than reverses, the prior gap: README/WORKFLOWS guidance and a distributable skill are present, but they are not evidence of runnable modules under the expected `graph-engineering/` tree. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/dist/graph-engineering.skill (direct inventory)] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/ (direct inventory: empty)] [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/README.md:1-60] [INFERENCE: distinguishing a packaged skill artifact from an executable source-tree implementation]

## Questions Answered
- Q1 residual: direct runtime checks confirm the identity-resolver optionality and the still-visible F005 lock window.
- Q3: concrete when-not-to-use criteria are simple/linear/low-state or single-pass work, no meaningful branching, and cases where graph design, failure-isolation, and persistence overhead exceed routing value.
- Q5: graph adapters should target fan-out, guarded transitions, convergence, and multi-lineage synthesis; sequential leaf phases should remain ordinary steps.
- Q2/Q4 residual: graph-engineering-master has a packaged `dist` skill but no local executable `graph-engineering/` implementation; this does not establish a runnable reference runtime.

## Questions Remaining
- Direct runtime fixture execution and shadow-parity evidence remain unrun; static source checks do not prove production behavior under malformed or concurrent inputs.
- F001 is not cleared until an owner-approved production construction path supplies a non-optional identity resolver and its negative tests.
- F005 is not cleared until fresh acquisition no longer exposes a readable partial target (or readers fail closed with an owner-approved protocol and tests).
- Canonical owner-approved accounting for 034 and 036-046 remains unresolved.
- No prior finding was overturned in this pass, so no `CONTRADICTS` or `SUPERSEDES` graph edge is emitted; the `dist` result narrows the inventory-gap wording.

## Next Focus
Implementation-owned verification: build and execute the smallest deterministic adapter/replay fixture with graph-off and database-unavailable cases, malformed/concurrent lock acquisition, resolver absence/presence, and shuffled multi-lineage fan-in. Preserve the additive-dark, authority-preserving migration boundary. [INFERENCE: based on the residual runtime risks and the 036 rollback-window sequence]

## Sources Consulted
- specs/system-deep-loop/037-graph-engineering/context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-173
- specs/system-deep-loop/037-graph-engineering/context/What is Graph Engineering?.md:174-182
- specs/system-deep-loop/037-graph-engineering/context/Graph Engineering: After Loops, This Is How You Wire Multi-Agent Orgs.md:174-185,215-222
- .opencode/skills/system-deep-loop/mode-registry.json:30-199
- .opencode/commands/deep/assets/deep-research-auto.yaml:127-159,178-223
- .opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:523-531,718-773
- .opencode/skills/system-deep-loop/runtime/lib/deep-loop/loop-lock.ts:215-261
- specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/dist/graph-engineering.skill
- specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/graph-engineering/ (empty direct inventory)

## Assessment
- New information ratio: 0.90
- Questions addressed: when-not-to-use validation; seven-mode and workflow-phase fit; identityResolver wiring; F005 partial-record window; graph-engineering-master inventory.
- Questions answered: the requested residual checks are answered at source level; runtime fixture and owner-accounting residuals remain open.

## Reflection
- What worked and why: narrow file-scoped reads exposed the exact optional gateway branch, the unsafe fresh-lock write sequence, and the distinction between packaged and executable graph-engineering artifacts.
- What did not work and why: the final combined grep exited 141 because `head` closed the pipe; it did not erase the required matches, but it prevents treating the command as a clean validation run.
- What I would do differently: split article extraction and workflow-marker extraction into separate bounded commands, then run the implementation-owned fixture instead of relying on static evidence.

## Edge Cases
- Ambiguous input: “when-not-to-use” was interpreted as workflow-control graph selection, not knowledge-graph retrieval; the retrieval article criteria are used only as supporting overhead evidence.
- Contradictory evidence: no source contradiction was found in this pass; the packaged `dist` artifact and empty source directory are complementary, not contradictory.
- Missing dependencies: no new dependency was required; live fixture execution remains an implementation follow-up.
- Partial success: the final grep command returned 141 after emitting the needed evidence; status remains complete because all in-scope findings were captured and cited.

## Ruled Out
- Graphing every mode and every leaf file operation; the corpus and workflow branch explicitly support simpler loops for low-branching work. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/From Loops to Graphs: The Next Paradigm in AI Agent Engineering.md:160-173] [SOURCE: .opencode/commands/deep/assets/deep-research-auto.yaml:147-159]
- Treating `dist/graph-engineering.skill` as proof that `graph-engineering/` contains runnable implementation modules. [SOURCE: specs/system-deep-loop/037-graph-engineering/context/graph-engineering-master/dist/graph-engineering.skill (direct inventory)] [INFERENCE: based on the empty source-tree inventory]
