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

# Deep Research Strategy - Session Tracking

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
Independent second opinion on the DEPTH-free sk-prompt rebuild, REQ-002 through REQ-011, and caller integrations.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What one-pass checklist and component skeleton should replace DEPTH, and which elements are required versus optional?
- [x] Which REQ-002 through REQ-011 claims are supported, overclaimed, or contradicted by repository and primary-source evidence?
- [x] What exact caller and workflow couplings must change in the prompt-improver agent and prompt commands?
- [x] How should quality evaluation, interaction defaults, model profiles, and effort selection work without DEPTH?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Implementation details beyond the named requirements and callers; changes to repository files outside this lineage.

---

## 5. STOP CONDITIONS
One inline iteration, followed by synthesis. Respect maxIterations=1 and terminal stopReason=maxIterationsReached. Do not write outside this lineage.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What one-pass checklist and component skeleton should replace DEPTH, and which elements are required versus optional?
- Which REQ-002 through REQ-011 claims are supported, overclaimed, or contradicted by repository and primary-source evidence?
- What exact caller and workflow couplings must change in the prompt-improver agent and prompt commands?
- How should quality evaluation, interaction defaults, model profiles, and effort selection work without DEPTH?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Treating a universal three-times growth cap or verbatim-content rule as established by primary vendor evidence. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating a universal three-times growth cap or verbatim-content rule as established by primary vendor evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a universal three-times growth cap or verbatim-content rule as established by primary vendor evidence.

### Treating the old-vs-new route benchmark as a prompt-quality evaluation: its oracle covers route objects and copied-router parity only. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the old-vs-new route benchmark as a prompt-quality evaluation: its oracle covers route objects and copied-router parity only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the old-vs-new route benchmark as a prompt-quality evaluation: its oracle covers route objects and copied-router parity only.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Treating a universal three-times growth cap or verbatim-content rule as established by primary vendor evidence. (iteration 1)
- Treating the old-vs-new route benchmark as a prompt-quality evaluation: its oracle covers route objects and copied-router parity only. (iteration 1)

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
- The authoritative retry limit remains a build decision: source files conflict, and no end-to-end prompt command was executed in this read-only pass. (iteration 1)
- The precise model profile text should be validated against the pinned target model versions when implemented. (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior context: the three-iteration Devin SWE 2 Max synthesis is at specs/sk-prompt/010-sk-prompt-improvements/research/research.md; the requirements are in specs/sk-prompt/010-sk-prompt-improvements/spec.md; public-source claims are indexed in specs/sk-prompt/010-sk-prompt-improvements/scratch/prompt-improver-survey.md. Recheck claims independently.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 1
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
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
- Started: 2026-10-30T06:28:02Z
