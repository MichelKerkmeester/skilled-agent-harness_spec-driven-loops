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
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

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
Hover and pointer states for the sk-create-chart corpus: what the twenty forms should do when a pointer arrives, and what logic and templates must carry it.

Prior art that bounds what counts as new: phase `009-chart-visual-overhaul/004-interaction-layer` is Complete and already shipped a hover tooltip on seven mark-dense forms (distribution strip, box plot, treemap, calendar grid, candlestick, heat matrix, scatter), an in-figure legend on four multi-series forms (parallel axes, stacked bars, stacked area, grouped bars), and a series dim on five forms. Thirteen of twenty forms still answer a pointer with nothing, and that phase left touch behaviour explicitly unresolved.

The hard constraint on every answer: these are self-contained static files. No framework, no CDN, no build step, and the figure must stay readable with scripting unavailable.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
Generated from the reducer registry. Add external or late questions through `specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/research/inbox.jsonl`; direct edits are imported as compatibility input and may be replaced on the next reduce step.

- [ ] Which of the thirteen forms with no pointer response should gain one, and which are correctly inert because the static figure already carries every value?
- [ ] What hover technique transfers to a single self-contained file, drawn from evilcharts and other named libraries inspected rather than recalled: binding a pointer to a mark, positioning a tooltip inside the figure bounds, handling dense overlap?
- [ ] Which of crosshair, nearest-point snapping, axis-value readout, focus ring, cursor affordance and hover transition earn their place here, and which are library habits that do not transfer?
- [ ] Does a hover-only affordance break the corpus's existing accessibility posture, and what is the keyboard and screen-reader equivalent?
- [ ] What do `assets/templates/` and the corpus checker need so pointer behaviour is enforced rather than hand-applied per form?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Re-deriving what `009-chart-visual-overhaul/004-interaction-layer` already shipped. A finding that restates the existing seven tooltips, four legends or five dims is not a finding.

Any technique requiring a framework, a CDN, an external runtime or a build step. Naming such a technique as non-transferable is useful; proposing it as a recommendation is not.

Implementation. This session produces ranked, cited recommendations. The build is a later phase.

---

## 5. STOP CONDITIONS
Stop policy is `max-iterations` with `maxIterations: 3`, so convergence is telemetry only and the loop runs all three iterations regardless of novelty score. This is a forced-depth run.

Halt early only on a hard failure: the cli-pi executor unavailable, the DevPass route rejecting the model, or a write-containment violation.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet -- populated as iterations answer questions]
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it worked] (iteration N)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[First iteration -- populated after iteration 1 completes]
- [Approach]: [Why it failed] (iteration N)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach has been tried from multiple angles without success]

### [Category Name] -- BLOCKED (iteration N, N attempts)
- What was tried: [specific approaches attempted]
- Why blocked: [root cause of exhaustion]
- Do NOT retry: [explicit prohibition]

### [Category Name] -- PRODUCTIVE (iteration N)
- What worked: [successful approaches in this category]
- Prefer for: [related questions where this category may help]
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[Approaches that were investigated and definitively eliminated -- consolidated from iteration dead-end data]
- [Approach]: [Why ruled out] (iteration N, evidence: [source])
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
[Self-owned open questions from iteration write-back -- populated after iteration 1 completes]
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[Recommended focus area for the next iteration -- updated at end of each iteration]
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
[Populated during initialization from the continuity ladder and ripgrep recipes, if any prior work exists]

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: [from config]
- Convergence threshold: [from config]
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/sk-doc/051-sk-create-chart/012-chart-hover-and-pointer-states/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: [from config.lineage.generation]
- Started: [timestamp]
