---
title: Deep Research Strategy Template
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
version: 1.14.3.0
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
- `origin`: one of `angle-bank`, `analyst-strategy`, `frontier`, `operator`, or `legacy-import`
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
What changes would make the expansive-depth deep-loop modes (research and review), and the deep-loop runtime behind them, simpler, cheaper, easier to operate and identical across CLI runtimes, ranked by value over effort?

Fan-out lineage opus (session fanout-opus-1795137583671-xybhyk) works frontier_scope F-1-001, F-1-003, F-1-005. Full topic text is in deep-research-config.json.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Restraint: what can be deleted, merged or collapsed across frontier-admit.cjs, the deep-research and deep-review reduce-state.cjs reducers, convergence.cjs, fanout-run.cjs and the two deep workflow YAMLs while every promise of the expansive-depth modes stays kept? Name concrete deletions with file:line.
- [x] Open design questions: should research count stuck passes per frontier node as review now does (deep-research.yaml:1488)? Does the lineage completion check break resume and extend for older committed research lineages that predate the closeout row, and what is the right rule? Is there a cheap design that makes pivot admission into the frontier work despite D-011-10?
- [x] Prior art: how do other agentic research and code-review systems handle frontier growth, stuck detection, stop rules and multi-executor fan-out, and which of their ideas would simplify or harden this program? Cite source URLs.

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Re-reporting findings of SPEC/review/review-report.md that fix commits a424fb6cd8a..d4420e9510d closed.
- Changing any code or doc outside this lineage directory.
- Operator UX (F-1-002), cross-CLI parity (F-1-004) and cost/latency (F-1-006) are dealt to another lineage; touch them only where they bear on this lineage nodes.

---

## 5. STOP CONDITIONS
- All three frontier nodes answered or closed, and convergence allows a stop.
- maxIterations (10) reached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Restraint: what can be deleted, merged or collapsed across frontier-admit.cjs, the deep-research and deep-review reduce-state.cjs reducers, convergence.cjs, fanout-run.cjs and the two deep workflow YAMLs while every promise of the expansive-depth modes stays kept? Name concrete deletions with file:line.
- Open design questions: should research count stuck passes per frontier node as review now does (deep-research.yaml:1488)? Does the lineage completion check break resume and extend for older committed research lineages that predate the closeout row, and what is the right rule? Is there a cheap design that makes pivot admission into the frontier work despite D-011-10?
- Prior art: how do other agentic research and code-review systems handle frontier growth, stuck detection, stop rules and multi-executor fan-out, and which of their ideas would simplify or harden this program? Cite source URLs.

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- grepping shared identifiers (the marker phrase, `applyBandBudget`, `NODE_STATUSES`) across all four scripts surfaced the duplicated rules faster than reading any file top to bottom. (iteration 1)
- measuring the completion rule over every committed lineage replaced an argument with a number, and showed the topic's sample understated the rate. (iteration 2)
- searching for named systems rather than generic terms returned primary docs (OpenHands, Inspect, Anthropic). (iteration 3)
- tracing one event name across workflow, schema and reducer found a real audit gap that a pure size or duplication scan would miss. (iteration 4)
- reading the blocker text and then the upsert's input filter turned a process obstacle into the lineage's highest-value-per-effort finding. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- `git log -S` gives only a lower bound on the migration window's age. The YAML moved and was reformatted, so the original commit is not visible this way. (iteration 1)
- the cited YAML line number had drifted, so grepping for the branch name was the reliable anchor. (iteration 2)
- the generic limits search for mini-swe-agent drifted to unrelated crates. (iteration 3)
- convergence.cjs section headers showed size but not seams. The import graph showed the seams. (iteration 4)
- iterations 1-4 relied on the contract's mandatory fields and skipped the optional graph events, which the guards actually read. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Co-STORM as a source of stop rules (user-terminated). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Co-STORM as a source of stop rules (user-terminated).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Co-STORM as a source of stop rules (user-terminated).

### Emitting `graphEvents` retroactively for iterations 1-4. Iteration records are write-once. This iteration's record carries the coverage for all three questions instead. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Emitting `graphEvents` retroactively for iterations 1-4. Iteration records are write-once. This iteration's record carries the coverage for all three questions instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Emitting `graphEvents` retroactively for iterations 1-4. Iteration records are write-once. This iteration's record carries the coverage for all three questions instead.

### Extracting the eight adapter builders (33-106 lines each, fanout-run.cjs:2533-3555) as a restraint move. Their divergence is the cross-CLI parity question (F-1-004), dealt to the other lineage, so it is only noted here. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Extracting the eight adapter builders (33-106 lines each, fanout-run.cjs:2533-3555) as a restraint move. Their divergence is the cross-CLI parity question (F-1-004), dealt to the other lineage, so it is only noted here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Extracting the eight adapter builders (33-106 lines each, fanout-run.cjs:2533-3555) as a restraint move. Their divergence is the cross-CLI parity question (F-1-004), dealt to the other lineage, so it is only noted here.

### Merging the two reducers wholesale. Their registries, dashboards and answered predicates differ (question resolution versus dimension coverage), so only the frontier projection is shared code. [INFERENCE: based on the reducer comparison above] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Merging the two reducers wholesale. Their registries, dashboards and answered predicates differ (question resolution versus dimension coverage), so only the frontier projection is shared code. [INFERENCE: based on the reducer comparison above]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Merging the two reducers wholesale. Their registries, dashboards and answered predicates differ (question resolution versus dimension coverage), so only the frontier projection is shared code. [INFERENCE: based on the reducer comparison above]

### mini-swe-agent limits: the search returned no primary source. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: mini-swe-agent limits: the search returned no primary source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: mini-swe-agent limits: the search returned no primary source.

### The mini-swe-agent `step_limit` and `cost_limit` search returned no mini-swe-agent docs. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The mini-swe-agent `step_limit` and `cost_limit` search returned no mini-swe-agent docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The mini-swe-agent `step_limit` and `cost_limit` search returned no mini-swe-agent docs.

### Widening `TERMINAL_STOP_EVENTS_BY_LOOP_TYPE.research` to legacy names such as `phase_synthesis` and `maxIterationsReached`. That would loosen the strict post-attempt check for every new run to fix a classification problem that belongs before spawn. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Widening `TERMINAL_STOP_EVENTS_BY_LOOP_TYPE.research` to legacy names such as `phase_synthesis` and `maxIterationsReached`. That would loosen the strict post-attempt check for every new run to fix a classification problem that belongs before spawn.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Widening `TERMINAL_STOP_EVENTS_BY_LOOP_TYPE.research` to legacy names such as `phase_synthesis` and `maxIterationsReached`. That would loosen the strict post-attempt check for every new run to fix a classification problem that belongs before spawn.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Merging the two reducers wholesale. Their registries, dashboards and answered predicates differ (question resolution versus dimension coverage), so only the frontier projection is shared code. [INFERENCE: based on the reducer comparison above] (iteration 1)
- Widening `TERMINAL_STOP_EVENTS_BY_LOOP_TYPE.research` to legacy names such as `phase_synthesis` and `maxIterationsReached`. That would loosen the strict post-attempt check for every new run to fix a classification problem that belongs before spawn. (iteration 2)
- Co-STORM as a source of stop rules (user-terminated). (iteration 3)
- mini-swe-agent limits: the search returned no primary source. (iteration 3)
- The mini-swe-agent `step_limit` and `cost_limit` search returned no mini-swe-agent docs. (iteration 3)
- Extracting the eight adapter builders (33-106 lines each, fanout-run.cjs:2533-3555) as a restraint move. Their divergence is the cross-CLI parity question (F-1-004), dealt to the other lineage, so it is only noted here. (iteration 4)
- Emitting `graphEvents` retroactively for iterations 1-4. Iteration records are write-once. This iteration's record carries the coverage for all three questions instead. (iteration 5)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior fan-out review: SPEC/review/review-report.md; fix commits a424fb6cd8a..d4420e9510d (HEAD d4420e9510d). resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` through `--extend=N` and `--extend-minutes=M` (live)
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-20T01:20:59.380Z
