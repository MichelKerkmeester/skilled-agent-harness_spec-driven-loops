---
title: Deep Research Strategy - Expansive-Depth Sub-Mode
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
Design an expansive-depth sub-mode for system-deep-loop deep-research and deep-review: a mode that smartly widens and deepens its scope instead of staying narrowly focused. Example targets the mode must handle well: (1) 'research the last 100 commits and find bugs, drifts and improvement opportunities'; (2) 'analyze system-skill-advisor and find improvement opportunities for auto-utilization of skills and commands when a user is just chatting'. Diagnose why the current loops do not extend depth enough, converge early or stay narrowly focused (convergence.cjs stop decision, newInfoRatio, minIterations, focus selection, strategy Next Focus, coverage graph, divergent mode, wave_orchestration appendix). Mine the graph-engineering research in specs/system-deep-loop/loop-architecture/002-graph-engineering (children 001-006, research/, reference/, context/) for graph-loop principles (frontier expansion, node/edge discovery, coverage-driven traversal, swarm fan-out) usable here. Propose how the sub-mode integrates into the existing agents (.skilled/agents/deep-research.md, deep-review.md), commands (.skilled/commands/deep/), workflow YAMLs, mode registry and convergence logic without replacing the current deep-loop logic; it must be an additive, opt-in sub-mode. Known defect to record as a finding: dispatch-iteration.cjs honors --claude-config-dir / CLAUDE_CONFIG_DIR only for --loop-type review, so a research run with --executor=cli-claude-code --config-dir is silently not routed to that account.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Why do the current research and review loops stop early or stay narrow? Trace the stop decision in convergence.cjs (newInfoRatio, weighted vote, minIterations floor, quality guards, graph decision) and name which signals reward narrow depth.
- [x] Q2: How does focus selection (reducer-written Next Focus, least_explored, remaining questions, stuck recovery, rejected-pattern cache) choose the next iteration target, and does anything ever add new questions or scope beyond the init-time 3-5 questions?
- [x] Q3: What do the existing breadth levers actually provide and lack: divergent mode (Council pivot), the coverage graph, sliding-window mode, stop-policy=max-iterations, native fan-out, and the wave_orchestration reference-only appendix?
- [x] Q4: Which graph-loop principles in the 002-graph-engineering program (children 001-006, research/, reference/, context/) are usable for a widening sub-mode: frontier expansion, node/edge discovery, coverage-driven traversal, swarm fan-out, budgets and stop rules?
- [x] Q5: What should the expansive-depth sub-mode be (frontier data model, decomposition of a target into nodes, expansion and pruning rules, depth budget, stop rule) so it handles both example targets: last-100-commits bug/drift hunt and system-skill-advisor chat-time auto-utilization?
- [x] Q6: How does the sub-mode integrate additively and opt-in into the agents (deep-research.md, deep-review.md), commands (.skilled/commands/deep/), workflow YAMLs, mode registry and convergence.cjs without changing default behavior?
- [x] Q7: Confirm the dispatch-iteration.cjs defect: is --claude-config-dir / CLAUDE_CONFIG_DIR honored only for --loop-type review, and what is the blast radius for research runs and fan-out?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing the sub-mode. This run produces a design and findings only; no runtime, agent, command or YAML file changes.
- Replacing or retuning the default convergence logic. The sub-mode must be additive and opt-in.
- Re-running the 002-graph-engineering program or re-litigating its verdicts (036 authority plane, typed-graph migration).
- Fixing the dispatch-iteration.cjs config-dir defect; it is recorded as a finding only.

---

## 5. STOP CONDITIONS
- All seven key questions answered with file:line evidence, and a concrete integration surface list exists.
- Max iterations (10) reached.
- Two consecutive iterations add no new mechanism, integration point or graph principle.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Why do the current research and review loops stop early or stay narrow? Trace the stop decision in convergence.cjs (newInfoRatio, weighted vote, minIterations floor, quality guards, graph decision) and name which signals reward narrow depth.
- Q2: How does focus selection (reducer-written Next Focus, least_explored, remaining questions, stuck recovery, rejected-pattern cache) choose the next iteration target, and does anything ever add new questions or scope beyond the init-time 3-5 questions?
- Q3: What do the existing breadth levers actually provide and lack: divergent mode (Council pivot), the coverage graph, sliding-window mode, stop-policy=max-iterations, native fan-out, and the wave_orchestration reference-only appendix?
- Q4: Which graph-loop principles in the 002-graph-engineering program (children 001-006, research/, reference/, context/) are usable for a widening sub-mode: frontier expansion, node/edge discovery, coverage-driven traversal, swarm fan-out, budgets and stop rules?
- Q5: What should the expansive-depth sub-mode be (frontier data model, decomposition of a target into nodes, expansion and pruning rules, depth budget, stop rule) so it handles both example targets: last-100-commits bug/drift hunt and system-skill-advisor chat-time auto-utilization?
- Q6: How does the sub-mode integrate additively and opt-in into the agents (deep-research.md, deep-review.md), commands (.skilled/commands/deep/), workflow YAMLs, mode registry and convergence.cjs without changing default behavior?
- Q7: Confirm the dispatch-iteration.cjs defect: is --claude-config-dir / CLAUDE_CONFIG_DIR honored only for --loop-type review, and what is the blast radius for research runs and fan-out?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- grepping for decision symbols before reading let me read only the roughly 400 lines that decide the outcome, out of 1938. (iteration 1)
- grepping `reduce-state.cjs` for focus symbols led straight to `resolveNextFocus` and its helper module, so I read about 250 of 3402 lines. Comparing this run's own strategy §11 with the prompt pack gave live evidence of the takeover. (iteration 2)
- the pivot's mode-adapter table in `divergent-pivot.cjs` pointed straight at `divergent-research-pivot.ts`, where the seed sources and their rationale strings answer the core question directly. Checking this run's own projection rows against the seed fields exposed the projection gap. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nothing failed. The novelty guard's full graph-novelty math (`computeGraphNoveltyDelta`) was not read, so its sensitivity is unquantified. (iteration 1)
- the first two greps used `--include` globs that zsh expanded and rejected, which cost two calls. Plain recursive grep with a path filter fixed it. (iteration 2)
- the review-side pivot adapter and the merge code did not fit the 24-call budget, so the review-pivot behavior and the merge internals rest on structure and the catalog. (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A fifth `--convergence-mode` value:** it would make the mode exclusive with divergent and sliding-window (finding 1). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A fifth `--convergence-mode` value:** it would make the mode exclusive with divergent and sliding-window (finding 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A fifth `--convergence-mode` value:** it would make the mode exclusive with divergent and sliding-window (finding 1).

### **A mode-registry entry:** the loop-type enum and the one-to-one command/agent binding forbid it (finding 13). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A mode-registry entry:** the loop-type enum and the one-to-one command/agent binding forbid it (finding 13).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A mode-registry entry:** the loop-type enum and the one-to-one command/agent binding forbid it (finding 13).

### **Promoting `wave_orchestration`:** fan-out already covers parallel execution (finding 9). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Promoting `wave_orchestration`:** fan-out already covers parallel execution (finding 9).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Promoting `wave_orchestration`:** fan-out already covers parallel execution (finding 9).

### **Reordering stuck after the veto in `convergence.cjs`:** it would change default ordering (finding 6). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Reordering stuck after the veto in `convergence.cjs`:** it would change default ordering (finding 6).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reordering stuck after the veto in `convergence.cjs`:** it would change default ordering (finding 6).

### **Widening the gateway upcast:** it would change the default path (finding 14). -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Widening the gateway upcast:** it would change the default path (finding 14).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Widening the gateway upcast:** it would change the default path (finding 14).

### `convergenceMode: off` and `stopPolicy: max-iterations` as a widening fix: duration only (finding 10). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `convergenceMode: off` and `stopPolicy: max-iterations` as a widening fix: duration only (finding 10).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `convergenceMode: off` and `stopPolicy: max-iterations` as a widening fix: duration only (finding 10).

### Fixing sourceDiversity by adding `metadata.quality_class` to this run's SOURCE nodes. The prompt contract mandates exact node shapes, and doing so would alter the live stop behavior of the run under study. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Fixing sourceDiversity by adding `metadata.quality_class` to this run's SOURCE nodes. The prompt contract mandates exact node shapes, and doing so would alter the live stop behavior of the run under study.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Fixing sourceDiversity by adding `metadata.quality_class` to this run's SOURCE nodes. The prompt contract mandates exact node shapes, and doing so would alter the live stop behavior of the run under study.

### Making the sub-mode depend on 036 target-state components (graph compiler, sealing, belief projection). S6 P4 classifies them Missing. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Making the sub-mode depend on 036 target-state components (graph compiler, sealing, belief projection). S6 P4 classifies them Missing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making the sub-mode depend on 036 target-state components (graph compiler, sealing, belief projection). S6 P4 classifies them Missing.

### None new. -- BLOCKED (iteration 6, 2 attempts)
- What was tried: None new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new.

### None new. `wave`/`depends_on` scheduling remains a dead end for the sub-mode, because the program rejects approximating it (finding 6). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: None new. `wave`/`depends_on` scheduling remains a dead end for the sub-mode, because the program rejects approximating it (finding 6).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. `wave`/`depends_on` scheduling remains a dead end for the sub-mode, because the program rejects approximating it (finding 6).

### Re-reading `off` and `max-iterations`. Iteration 1 finding 10 already covers them, and they should stay out of further breadth analysis. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Re-reading `off` and `max-iterations`. Iteration 1 finding 10 already covers them, and they should stay out of further breadth analysis.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-reading `off` and `max-iterations`. Iteration 1 finding 10 already covers them, and they should stay out of further breadth analysis.

### Reading the `context/` blog and paper corpus directly. The five study syntheses already cite it, and the budget favored the syntheses. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reading the `context/` blog and paper corpus directly. The five study syntheses already cite it, and the budget favored the syntheses.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the `context/` blog and paper corpus directly. The five study syntheses already cite it, and the budget favored the syntheses.

### Storing frontier state on research iteration records. The gateway drops the fields, and `convergence.cjs` reads only those rows (finding 3, iteration 4 F12). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Storing frontier state on research iteration records. The gateway drops the fields, and `convergence.cjs` reads only those rows (finding 3, iteration 4 F12).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Storing frontier state on research iteration records. The gateway drops the fields, and `convergence.cjs` reads only those rows (finding 3, iteration 4 F12).

### Treating fan-out as scope partitioning. Every lineage gets the same topic (finding 8). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating fan-out as scope partitioning. Every lineage gets the same topic (finding 8).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating fan-out as scope partitioning. Every lineage gets the same topic (finding 8).

### Treating leaf-emitted QUESTION graph events as the frontier's source of truth. Emission is inconsistent: 17, 20, 1 and 0 node events across the 4 deltas (finding 4). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating leaf-emitted QUESTION graph events as the frontier's source of truth. Emission is inconsistent: 17, 20, 1 and 0 node events across the 4 deltas (finding 4).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating leaf-emitted QUESTION graph events as the frontier's source of truth. Emission is inconsistent: 17, 20, 1 and 0 node events across the 4 deltas (finding 4).

### Treating minIterations as the cause of early stopping: it only delays a stop, and raising it adds iterations without adding direction (finding 5). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating minIterations as the cause of early stopping: it only delays a stop, and raising it adds iterations without adding direction (finding 5).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating minIterations as the cause of early stopping: it only delays a stop, and raising it adds iterations without adding direction (finding 5).

### Treating sliding-window mode as a breadth lever. It only swaps the novelty measure (finding 7). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating sliding-window mode as a breadth lever. It only swaps the novelty measure (finding 7).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating sliding-window mode as a breadth lever. It only swaps the novelty measure (finding 7).

### Treating stuck recovery as a widening mechanism: "Widen scope" is prompt text only, and the target is still `least_explored` from the existing questions (finding 5). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating stuck recovery as a widening mechanism: "Widen scope" is prompt text only, and the target is still `least_explored` from the existing questions (finding 5).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating stuck recovery as a widening mechanism: "Widen scope" is prompt text only, and the target is still `least_explored` from the existing questions (finding 5).

### Treating the ideas backlog as a scope source during the run: a promoted idea is used only when no other focus exists (findings 1 and 5). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the ideas backlog as a scope source during the run: a promoted idea is used only when no other focus exists (findings 1 and 5).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the ideas backlog as a scope source during the run: a promoted idea is used only when no other focus exists (findings 1 and 5).

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `convergenceMode: off` and `stopPolicy: max-iterations` as a widening fix: duration only (finding 10). (iteration 1)
- Treating minIterations as the cause of early stopping: it only delays a stop, and raising it adds iterations without adding direction (finding 5). (iteration 1)
- Treating stuck recovery as a widening mechanism: "Widen scope" is prompt text only, and the target is still `least_explored` from the existing questions (finding 5). (iteration 2)
- Treating the ideas backlog as a scope source during the run: a promoted idea is used only when no other focus exists (findings 1 and 5). (iteration 2)
- Re-reading `off` and `max-iterations`. Iteration 1 finding 10 already covers them, and they should stay out of further breadth analysis. (iteration 3)
- Treating fan-out as scope partitioning. Every lineage gets the same topic (finding 8). (iteration 3)
- Treating sliding-window mode as a breadth lever. It only swaps the novelty measure (finding 7). (iteration 3)
- Making the sub-mode depend on 036 target-state components (graph compiler, sealing, belief projection). S6 P4 classifies them Missing. (iteration 4)
- None new. `wave`/`depends_on` scheduling remains a dead end for the sub-mode, because the program rejects approximating it (finding 6). (iteration 4)
- Reading the `context/` blog and paper corpus directly. The five study syntheses already cite it, and the budget favored the syntheses. (iteration 4)
- Fixing sourceDiversity by adding `metadata.quality_class` to this run's SOURCE nodes. The prompt contract mandates exact node shapes, and doing so would alter the live stop behavior of the run under study. (iteration 5)
- None new. (iteration 5)
- Storing frontier state on research iteration records. The gateway drops the fields, and `convergence.cjs` reads only those rows (finding 3, iteration 4 F12). (iteration 5)
- Treating leaf-emitted QUESTION graph events as the frontier's source of truth. Emission is inconsistent: 17, 20, 1 and 0 node events across the 4 deltas (finding 4). (iteration 5)
- **A fifth `--convergence-mode` value:** it would make the mode exclusive with divergent and sliding-window (finding 1). (iteration 6)
- **A mode-registry entry:** the loop-type enum and the one-to-one command/agent binding forbid it (finding 13). (iteration 6)
- **Promoting `wave_orchestration`:** fan-out already covers parallel execution (finding 9). (iteration 6)
- **Reordering stuck after the veto in `convergence.cjs`:** it would change default ordering (finding 6). (iteration 6)
- **Widening the gateway upcast:** it would change the default path (finding 14). (iteration 6)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Q2-Q6 untouched. Q7 partly addressed: the explicit flag is rejected; the env inheritance on the research branch is unverified. (iteration 1)
- Q4: Which graph-loop principles in the 002-graph-engineering program (children 001-006, research/, reference/, context/) are usable for a widening sub-mode: frontier expansion, node/edge discovery, coverage-driven traversal, swarm fan-out, budgets and stop rules? (iteration 2)
- Q6: How does the sub-mode integrate additively and opt-in into the agents (deep-research.md, deep-review.md), commands (.skilled/commands/deep/), workflow YAMLs, mode registry and convergence.cjs without changing default behavior? (iteration 2)
- Q3 focus: what do divergent-pivot.cjs (Council pivot and frontier), the coverage graph, sliding-window mode and the wave_orchestration appendix actually add as scope, and can any of them write new questions or nodes during a run? (iteration 2)
- Q3: What do the existing breadth levers actually provide and lack: divergent mode (Council pivot), the coverage graph, sliding-window mode, stop-policy=max-iterations, native fan-out, and the wave_orchestration reference-only appendix? (iteration 2)
- Q5: What should the expansive-depth sub-mode be (frontier data model, decomposition of a target into nodes, expansion and pruning rules, depth budget, stop rule) so it handles both example targets: last-100-commits bug/drift hunt and system-skill-advisor chat-time auto-utilization? (iteration 2)
- the review reducer's Next Focus twin (finding 12); (iteration 6)
- a read-only `convergence.cjs` run on this packet to confirm the graph blockers (iteration 5's carried check). (iteration 6)
- None of the strategy key questions remain open. Three narrow verification items are left: (iteration 6)
- whether `fanout-run.cjs` forwards the per-lineage claude config-dir on research (finding 17); (iteration 6)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Parent program: specs/system-deep-loop/loop-architecture/002-graph-engineering is a COMPLETE six-study research program (handover.md, 2026-08-14) answering how to evolve system-deep-loop into a graph-based agent-loop system over the 036 authority plane. S6 006-cross-study-integration holds the capstone design. No runtime code was changed by that program. The parent spec.md is a stale gen-1 seed; live state is handover.md + context-index.md.

### Bounded Context Snapshot

- Source pointers: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs; .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs; .skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs; .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs; .skilled/commands/deep/assets/deep-research.yaml (step_check_convergence, step_rejected_pattern_cache, reference_only_appendix.wave_orchestration); .skilled/commands/deep/assets/deep-review.yaml; .skilled/agents/deep-research.md; .skilled/agents/deep-review.md; system-deep-loop mode registry; deep-research/references/convergence/convergence.md.
- Graph research pointers: 002-graph-engineering/reference/01-05 primers (05-deep-loop-to-graph-mapping.md first), context-index.md, 001-006 research/research.md syntheses, context/ vendored corpus (agent-swarms, graphene-main, graph-arch, graph-engineering-master, blog-posts, research-paper).
- Reuse candidates: coverage graph + iteration-graph-upsert.cjs, divergent pivot Council, fan-out runner (fanout-run.cjs / fanout-merge.cjs), inbox.jsonl question injection, sliding-window and stop-policy flags.
- Integration points: --convergence-mode flag surface, config.antiConvergence, mode registry, prompt-pack templates, reducer Next Focus.
- Constraints and risks: additive opt-in only; default path must stay byte-for-byte unchanged; recorded defect in dispatch-iteration.cjs config-dir routing for research.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-17T07:52:43.000Z


resource-map.md not present; skipping coverage gate
