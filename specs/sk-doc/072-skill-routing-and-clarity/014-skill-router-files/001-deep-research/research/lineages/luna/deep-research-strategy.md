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
Moving every skill's MACHINE ROUTER section out of SKILL.md into sibling ROUTER.md files.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] RQ-1: Which scripts, tests, generators, runtime adapters and other tools read a SKILL.md MACHINE ROUTER section or its markers, and what sibling ROUTER.md change does each require?
- [x] RQ-2: How do Claude Code, OpenCode, Codex, Cursor, Pi, Devin and Hermes load a skill, and do they load sibling files automatically? What does the Hermes copy step include?
- [x] RQ-3: Which machine-router facts does an agent need in context at runtime, which facts only scripts need, and what pointer must remain in SKILL.md?
- [x] RQ-4: How can a hub MACHINE ROUTER join its existing root ROUTER.md without changing the router replay mode projection?
- [x] RQ-5: What migration preserves advisor accuracy 155/195, 49/66 and 19/24, router replay and compiled-route hashes while measuring token savings per skill and tracking debt?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
This run maps readers and runtime loading behavior, separates agent context from script inputs, and recommends a migration. It does not implement the move or change any route.

---

## 5. STOP CONDITIONS
Run exactly three iterations. Stop at the configured cap. Keep all writes inside this lineage. Mark claims without a resolving source as UNKNOWN.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- RQ-1: Which scripts, tests, generators, runtime adapters and other tools read a SKILL.md MACHINE ROUTER section or its markers, and what sibling ROUTER.md change does each require?
- RQ-2: How do Claude Code, OpenCode, Codex, Cursor, Pi, Devin and Hermes load a skill, and do they load sibling files automatically? What does the Hermes copy step include?
- RQ-3: Which machine-router facts does an agent need in context at runtime, which facts only scripts need, and what pointer must remain in SKILL.md?
- RQ-4: How can a hub MACHINE ROUTER join its existing root ROUTER.md without changing the router replay mode projection?
- RQ-5: What migration preserves advisor accuracy 155/195, 49/66 and 19/24, router replay and compiled-route hashes while measuring token savings per skill and tracking debt?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- tracing parser calls from the replay and checker entry points separated direct router readers from whole-file provenance readers. (iteration 1)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the broad full-text scan drowned code paths in corpus mentions; its root cause was a content pattern applied to all markdown. (iteration 1)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Treating every root ROUTER.md parser as a current reader of the SKILL.md appendix. The root-router checks read the separate stage-two router; their merge behavior is examined in RQ-4. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating every root ROUTER.md parser as a current reader of the SKILL.md appendix. The root-router checks read the separate stage-two router; their merge behavior is examined in RQ-4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every root ROUTER.md parser as a current reader of the SKILL.md appendix. The root-router checks read the separate stage-two router; their merge behavior is examined in RQ-4.

### Treating the leaf-manifest generator as a direct MACHINE ROUTER reader. Its source walks configured leaf roots and does not parse SKILL.md. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the leaf-manifest generator as a direct MACHINE ROUTER reader. Its source walks configured leaf roots and does not parse SKILL.md.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the leaf-manifest generator as a direct MACHINE ROUTER reader. Its source walks configured leaf roots and does not parse SKILL.md.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Treating every root ROUTER.md parser as a current reader of the SKILL.md appendix. The root-router checks read the separate stage-two router; their merge behavior is examined in RQ-4. (iteration 1)
- Treating the leaf-manifest generator as a direct MACHINE ROUTER reader. Its source walks configured leaf roots and does not parse SKILL.md. (iteration 1)

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
- RQ-5: measure per-skill token savings and specify a migration that preserves the advisor baseline, router replay, and compiled hashes. (iteration 2)
- RQ-4: determine how a hub router joins root ROUTER.md without changing replay projection. (iteration 2)
- RQ-1: enumerate every MACHINE ROUTER reader, test and generator with exact file:line migration actions. (iteration 2)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
The packet spec supplies the five research questions and baseline figures. The implementation summary has scaffold-only continuity. The resource map is absent. Trigger-index and full-text retrieval found prior router-shape discussions.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 3
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
- Started: 2026-10-29T08:01:27Z
