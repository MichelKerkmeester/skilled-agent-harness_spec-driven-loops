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
Close every known gap in the operator decision-capture feature and find changes that make it more maintainable and prevent overengineering. Known gaps: answers reach a decision record only when /speckit:save runs; the pending-answer nudge shows only on Claude and OpenCode, not Devin, Codex or Pi; Codex captures only at save time from its rollout, because a live hook needs hook trust; Cursor is marked unverified and Hermes is absent from the runtime matrix; chat-answer pairing depends on the saving model's judgment; process questions (Gate 3, spec folder, branch) are filtered by keyword; a Claude nudge emitted at session exit is lost; the Codex and Pi sweeps exit 0 silently on an unreadable transcript while the Claude and Devin sweeps report an error. Maintainability: five live adapters and five save-time readers each parse a storage format another tool owns (OpenCode SQLite, Codex rollout, Devin and Pi session files, Claude transcript). For each gap say whether it is worth closing, the smallest change that closes it, and what to delete or merge rather than add. Code: .skilled/hooks/decision-capture/, .opencode/plugins/decision-capture.js, .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts and decision-table-matcher.ts, runtime/cli/continuity/match-decision-table.ts, .skilled/commands/speckit/save.md. Read-only research: do not edit code.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which capture and save-time paths currently exist for each runtime, and where does each listed gap sit?
- [x] Which gaps are confirmed by executable code or live-run evidence, and which are stale or unverified claims?
- [x] What is the smallest justified change for each confirmed gap, and what code can be merged or deleted?
- [x] Which decisions can be paired or filtered deterministically without adding a new layer?
- [x] Which storage readers can be consolidated without moving format ownership or losing failure reporting?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
[What this research session is NOT trying to answer -- populated during initialization]

---

## 5. STOP CONDITIONS
Stop after two iterations and synthesize with stopReason maxIterationsReached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which capture and save-time paths currently exist for each runtime, and where does each listed gap sit?
- Which gaps are confirmed by executable code or live-run evidence, and which are stale or unverified claims?
- What is the smallest justified change for each confirmed gap, and what code can be merged or deleted?
- Which decisions can be paired or filtered deterministically without adding a new layer?
- Which storage readers can be consolidated without moving format ownership or losing failure reporting?

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
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

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
- Which decisions can be paired or filtered deterministically without adding a new layer? (iteration 1)
- Which storage readers can be consolidated without moving format ownership or losing failure reporting? (iteration 1)
- What is the smallest justified change for each confirmed gap, and what code can be merged or deleted? (iteration 1)
- None for the requested scope. The multi-question pairing behavior and Cursor/Hermes event surfaces remain implementation-time probes, not prerequisites for these recommendations. (iteration 2)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior packet context exists in handover.md, spec.md, decision-record.md, and open-questions.md. The prompt lists eight known behavior gaps and a maintainability concern. The resource map is absent. This fan-out lineage is the only write surface. The standard YAML spec seed/writeback steps are skipped because they would write outside the lineage; record that scope conflict in iteration 1.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: .skilled/hooks/decision-capture/, .opencode/plugins/decision-capture.js, the decision-record writer and table matchers, .skilled/commands/speckit/save.md, and the 006 live-run matrix.
- Reuse candidates: capture-core, shared chat-question detection, persistent pending queue, and the save-time sweeps.
- Integration points: runtime adapters, transcript readers, the save command, decision-record writer, and Claude session-stop nudge.
- Constraints and risks: hook trust varies by runtime; the saving model currently participates in pairing; every source format is owned by another runtime; writes stay inside this lineage.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 2
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
- Started: 2026-11-02T17:22:08Z
