---
title: Deep Research Strategy - Decision Capture Gaps (deepseek lineage)
description: Reducer-synchronized strategy for the fan-out research lineage investigating operator decision-capture gaps and maintainability.
trigger_phrases:
  - "decision capture strategy"
  - "deepseek lineage strategy"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - Decision Capture Gaps (deepseek lineage)

## 1. OVERVIEW

### Purpose

Persistent brain for this fan-out lineage: what to investigate, what worked, what failed, and where to focus next. The reducer rewrites the machine-owned sections after every iteration.

### Usage

- **Init:** Topic, key questions, known context and boundaries populated from the lineage config.
- **Per iteration:** the iteration file carries evidence; the reducer refreshes Sections 3, 6, 7-11A.
- **Mutability:** analyst-owned sections stay stable; machine-owned sections are projections.

### Question Injection Surface

Not used by this lineage. Questions arrive from the run-open charter and from steered iteration focus.

---

## 2. TOPIC

Close every known gap in the operator decision-capture feature and find changes that make it more maintainable and prevent overengineering. Known gaps: answers reach a decision record only at `/speckit:save`; the pending-answer nudge is Claude/OpenCode only; Codex captures at save time from its rollout; Cursor is unverified and Hermes absent from the runtime matrix; chat-answer pairing depends on the saving model's judgment; process questions are filtered by keyword; a Claude session-exit nudge is lost; Codex and Pi sweeps exit 0 on an unreadable transcript while Claude and Devin sweeps report an error. Maintainability: five live adapters and five save-time readers each parse a storage format another tool owns. For each gap: worth closing, the smallest change, and what to delete or merge rather than add. Read-only research.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which of the eight known gaps are worth closing, and what is the smallest change that closes each one?
- [x] How many independent storage-format parsers exist across the five live adapters and five save-time readers, and which can be deleted or merged rather than fixed?
- [x] Which gaps close by removing a surface (an adapter, a sweep, a runtime-matrix row) instead of adding code?
- [x] What does each runtime actually expose for live capture, and are the Cursor "unverified" and Hermes "absent" rows worth filling or deleting?
- [x] What test coverage guards the capture path today, and which single refactor collapses the most duplicated tests?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing any fix: this is read-only research; the packet records findings only.
- Re-litigating the decision-capture feature's product intent or its disable switch.
- Auditing unrelated system-spec-kit continuity surfaces beyond the save path that writes decision records.
- Benchmarking runtime hook latency.

---

## 5. STOP CONDITIONS

- `config.maxIterations` (3) reached under `stopPolicy: max-iterations`; convergence before the cap is telemetry only.
- A read that would require modifying the researched code, which is out of scope for this lineage.
- Three consecutive failures on the same tool call.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which of the eight known gaps are worth closing, and what is the smallest change that closes each one?
- How many independent storage-format parsers exist across the five live adapters and five save-time readers, and which can be deleted or merged rather than fixed?
- Which gaps close by removing a surface (an adapter, a sweep, a runtime-matrix row) instead of adding code?
- What does each runtime actually expose for live capture, and are the Cursor "unverified" and Hermes "absent" rows worth filling or deleting?
- What test coverage guards the capture path today, and which single refactor collapses the most duplicated tests?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the shared core before the adapters turned four files into one mechanism and exposed that the adapters hold only mapping code, which is what makes "add a nudge to Devin and Pi" a small change rather than an adapter rewrite. (iteration 1)
- grepping for the process filter's callers settled gap 6 in one call, because a rule stated in prose and in code shows up as exactly one executable call site plus one prose line. (iteration 2)
- reading the probe folder last was the right order — it converted two "unknown" cells into one policy question and one unscheduled experiment, which is exactly the distinction the charter asked for. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- looking for the Codex/Cursor rationale in `coverage-rationale.md` failed because the section does not exist; the failure is itself the evidence for finding 7. (iteration 1)
- expecting the writer to re-validate process questions failed because the writer trusts the payload; the absent guard is itself the finding about where enforcement lives. (iteration 2)
- no Cursor evidence could be gathered, because the repository has no Cursor probe and running one is a manual session outside a read-only research lineage. (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A model-free decision-record writer.** The record's `decided` sentence is the feature's product value; generating it from a template would fill `decision-record.md` with prose no reader can act on. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A model-free decision-record writer.** The record's `decided` sentence is the feature's product value; generating it from a template would fill `decision-record.md` with prose no reader can act on.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A model-free decision-record writer.** The record's `decided` sentence is the feature's product value; generating it from a template would fill `decision-record.md` with prose no reader can act on.

### **Adding a Hermes runtime column.** The matrix is pinned by a test constant, Hermes has no adapter and no probe, and adding the column would document an absence the repo has no plan to fill. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Adding a Hermes runtime column.** The matrix is pinned by a test constant, Hermes has no adapter and no probe, and adding the column would document an absence the repo has no plan to fill.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding a Hermes runtime column.** The matrix is pinned by a test constant, Hermes has no adapter and no probe, and adding the column would document an absence the repo has no plan to fill.

### **Counting the pause/gate hooks as capture adapters.** They share the tree but write no queue rows. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Counting the pause/gate hooks as capture adapters.** They share the tree but write no queue rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting the pause/gate hooks as capture adapters.** They share the tree but write no queue rows.

### **Making the live adapter write a decision record directly.** A capture hook runs before the session has a bound packet and before the operator has agreed the wording of a `decided` sentence; writing the record at capture time would either guess the packet or write an unbound row. The autosave path (finding 2) is the smaller change that keeps the packet binding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Making the live adapter write a decision record directly.** A capture hook runs before the session has a bound packet and before the operator has agreed the wording of a `decided` sentence; writing the record at capture time would either guess the packet or write an unbound row. The autosave path (finding 2) is the smaller change that keeps the packet binding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Making the live adapter write a decision record directly.** A capture hook runs before the session has a bound packet and before the operator has agreed the wording of a `decided` sentence; writing the record at capture time would either guess the packet or write an unbound row. The autosave path (finding 2) is the smaller change that keeps the packet binding.

### **Replacing the matcher's scoring with exact text equality.** The scorer exists because hand-written rows phrase the same decision differently; exact equality would regress the one case the matcher was built for. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Replacing the matcher's scoring with exact text equality.** The scorer exists because hand-written rows phrase the same decision differently; exact equality would regress the one case the matcher was built for.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Replacing the matcher's scoring with exact text equality.** The scorer exists because hand-written rows phrase the same decision differently; exact equality would regress the one case the matcher was built for.

### **Treating gap 3 as a missing adapter.** Codex already receives the answers; what is missing is a live read, and the README attributes that to hook trust. Building a Codex hook would either require per-user trust or duplicate the rollout read inside the runtime, so the sweep is the correct shape and the "gap" is a documentation claim, not missing behavior. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating gap 3 as a missing adapter.** Codex already receives the answers; what is missing is a live read, and the README attributes that to hook trust. Building a Codex hook would either require per-user trust or duplicate the rollout read inside the runtime, so the sweep is the correct shape and the "gap" is a documentation claim, not missing behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating gap 3 as a missing adapter.** Codex already receives the answers; what is missing is a live read, and the README attributes that to hook trust. Building a Codex hook would either require per-user trust or duplicate the rollout read inside the runtime, so the sweep is the correct shape and the "gap" is a documentation claim, not missing behavior.

### Looking for a code-level process filter on the writer side: none exists. The only executable filter is capture-side, so gap 6's save-half enforcement is prose alone. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a code-level process filter on the writer side: none exists. The only executable filter is capture-side, so gap 6's save-half enforcement is prose alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a code-level process filter on the writer side: none exists. The only executable filter is capture-side, so gap 6's save-half enforcement is prose alone.

### Reading `.skilled/hooks/coverage-rationale.md` for the Codex and Cursor rationale: the file has no `decision-capture` section, so the matrix's stated documentation contract cannot answer why those two cells are empty. Recorded as finding 7 instead of pursued. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading `.skilled/hooks/coverage-rationale.md` for the Codex and Cursor rationale: the file has no `decision-capture` section, so the matrix's stated documentation contract cannot answer why those two cells are empty. Recorded as finding 7 instead of pursued.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `.skilled/hooks/coverage-rationale.md` for the Codex and Cursor rationale: the file has no `decision-capture` section, so the matrix's stated documentation contract cannot answer why those two cells are empty. Recorded as finding 7 instead of pursued.

### Searching for a Cursor probe result: none exists, and no code path probes a runtime's question surface — the folder is populated by hand. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Searching for a Cursor probe result: none exists, and no code path probes a runtime's question surface — the folder is populated by hand.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a Cursor probe result: none exists, and no code path probes a runtime's question surface — the folder is populated by hand.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Counting the pause/gate hooks as capture adapters.** They share the tree but write no queue rows. (iteration 1)
- **Treating gap 3 as a missing adapter.** Codex already receives the answers; what is missing is a live read, and the README attributes that to hook trust. Building a Codex hook would either require per-user trust or duplicate the rollout read inside the runtime, so the sweep is the correct shape and the "gap" is a documentation claim, not missing behavior. (iteration 1)
- Reading `.skilled/hooks/coverage-rationale.md` for the Codex and Cursor rationale: the file has no `decision-capture` section, so the matrix's stated documentation contract cannot answer why those two cells are empty. Recorded as finding 7 instead of pursued. (iteration 1)
- **Making the live adapter write a decision record directly.** A capture hook runs before the session has a bound packet and before the operator has agreed the wording of a `decided` sentence; writing the record at capture time would either guess the packet or write an unbound row. The autosave path (finding 2) is the smaller change that keeps the packet binding. (iteration 2)
- **Replacing the matcher's scoring with exact text equality.** The scorer exists because hand-written rows phrase the same decision differently; exact equality would regress the one case the matcher was built for. (iteration 2)
- Looking for a code-level process filter on the writer side: none exists. The only executable filter is capture-side, so gap 6's save-half enforcement is prose alone. (iteration 2)
- **A model-free decision-record writer.** The record's `decided` sentence is the feature's product value; generating it from a template would fill `decision-record.md` with prose no reader can act on. (iteration 3)
- **Adding a Hermes runtime column.** The matrix is pinned by a test constant, Hermes has no adapter and no probe, and adding the column would document an absence the repo has no plan to fill. (iteration 3)
- Searching for a Cursor probe result: none exists, and no code path probes a runtime's question surface — the folder is populated by hand. (iteration 3)

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
- What test coverage guards the path, and which refactor collapses the most duplicated tests. (iteration 1)
- Which of the eight known gaps are worth closing, and the smallest change for each. (iteration 1)
- Which gaps close by removing a surface rather than adding one. (iteration 1)
- How many independent storage-format parsers exist, and which can be deleted or merged. (iteration 1)
- Which gaps close by deleting a surface instead of adding one. (iteration 2)
- Test coverage and the single refactor that collapses the most duplicated tests. (iteration 2)
- Worth closing versus worth documenting, per gap, with the smallest change. (iteration 2)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Capture binaries: `.skilled/hooks/decision-capture/bin/` holds `sweep-codex.mjs`, `sweep-devin.mjs`, `sweep-opencode.mjs`, `sweep-pi.mjs`, `sweep-transcript.mjs` plus per-runtime fixtures.
- Shared capture library: `.skilled/hooks/decision-capture/lib/capture-core.mjs` and `lib/chat-questions.mjs`.
- Live adapters: `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs`, `.skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs`, `.skilled/hooks/decision-capture/pi/decision-capture.ts`, `.opencode/plugins/decision-capture.js`.
- Save-time path: `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts`, `decision-table-matcher.ts`, `runtime/cli/continuity/match-decision-table.ts`, and `.skilled/commands/speckit/save.md`.
- Feature catalog page: `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md`.
- Runtime matrix rows: `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 3
- Convergence threshold: 0.05 (telemetry only under `max-iterations`)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-11-02T17:21:00Z
