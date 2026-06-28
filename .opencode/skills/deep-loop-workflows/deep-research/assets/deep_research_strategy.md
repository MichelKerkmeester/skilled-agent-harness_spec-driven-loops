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

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration.
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

---

## 2. TOPIC
[Research topic from config -- set during initialization]

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] [Question 1 -- identified during initialization or iteration 1]
- [ ] [Question 2]
- [ ] [Question 3]
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
[What this research session is NOT trying to answer -- populated during initialization]

---

## 5. STOP CONDITIONS
[Explicit conditions beyond convergence that should end the session -- populated during initialization]

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
[Populated during initialization from memory_context() results, if any prior work exists]

---

## 13. RESEARCH BOUNDARIES
- Max iterations: [from config]
- Convergence threshold: [from config]
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/deep-loop-workflows/deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skills/deep-loop-workflows/deep-research/references/guides/capability_matrix.md`
- Capability resolver: `.opencode/skills/deep-loop-workflows/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: [from config.lineage.generation]
- Started: [timestamp]
