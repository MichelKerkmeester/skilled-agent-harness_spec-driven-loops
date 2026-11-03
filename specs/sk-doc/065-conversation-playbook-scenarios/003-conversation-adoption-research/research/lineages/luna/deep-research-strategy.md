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
Audit every skill and every skill mode (workflow mode packet) in the repository for where manual-testing-playbook scenarios should adopt the json conversation scenario format played by the shared conversation runner in sk-create-manual-testing-playbook. For each skill and mode: which existing playbook scenarios should be converted from single prompt to conversation, which should stay single prompt, which existing scenarios need updating, and which multi-turn, question-tool, restart, compaction or cross-runtime behaviors lack any scenario that a conversation would add. Apply the four ordered questions in .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md section Choosing the Scenario Style, cite each candidate with a SOURCE tag and its deciding question, and rank candidates by value and cost.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which of the 55 skill and mode packages and the central /doctor package have scenarios that meet Q2 or Q3, which named files merit conversion, and which stay at Q1 or Q4?
- [ ] Which existing scenario contracts exercise multiple exchanges, answer branching, restart, compaction or cross-runtime behavior while remaining manual or single-prompt, and what precise updates are needed?
- [ ] Which skill or mode behaviors involving questions, user answers, restart, compaction or runtime parity have no scenario that covers them?
- [x] Which candidates can the shared runner execute across its supported runtimes, and which are constrained by runtime support or host prerequisites?
- [ ] Which conversion, update and coverage candidates provide the highest operator or release risk reduction for their authoring and execution cost?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
This phase recommends scenario style and coverage only. It does not rewrite playbooks, add runner adapters, or execute live conversation scenarios.

---

## 5. STOP CONDITIONS
Stop after legal convergence or 10 iterations. Preserve evidence boundaries; do not alter playbook sources.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which candidates can the shared runner execute across its supported runtimes, and which are constrained by runtime support or host prerequisites?

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
- Which question-tool, restart and compaction behaviors have no scenario yet? (iteration 1)
- Which candidates rank highest by value and execution cost? (iteration 1)
- Which runtime-specific scenarios need to split because the runner lacks a matching adapter? (iteration 1)
- Which exact scenarios in each skill and mode meet Q2 or Q3, and which one-shot scenarios stay at Q1 or Q4? (iteration 1)
- Which exact scenarios in every skill and mode meet Q2 or Q3, and which remain Q1 or Q4? (iteration 2)
- Which candidates provide the best value/cost across the complete 56-package corpus? (iteration 2)
- Which question-tool and cross-runtime behaviors lack conversation coverage beyond the CLI lifecycle examples? (iteration 2)
- Which modes outside CLI lifecycle, /doctor approvals, and the sampled system-spec-kit areas meet Q2 or Q3? (iteration 3)
- What is the priority order across the full corpus once code, design, documentation, MCP, and deep-loop modes are covered? (iteration 3)
- Which exact packages have Q1 judgment surfaces, Q4 one-shot checks, or no conversation-worthy gap? (iteration 3)
- Which behaviors are missing scenario coverage in system-deep-loop and its workflow modes? (iteration 4)
- What complete per-package coverage matrix and final value/cost ranking should synthesis report? (iteration 4)
- Which remaining skill/mode roots contain Q2 or Q3 candidates outside the sampled lifecycle, approval, design, review, routing and MCP examples? (iteration 4)
- What complete per-package inventory and ranked priority order should synthesis report? (iteration 5)
- Which no-scenario gaps across all 56 packages warrant a conversation rather than a new manual shell check? (iteration 5)
- Which remaining packages outside deep-loop contain genuinely answer-dependent or user-visible restart/compaction scenarios? (iteration 5)
- Which packages from skill-advisor, MCP and the remaining workflow modes should be Q1/Q2/Q3/Q4? (iteration 6)
- Which remaining CLI lifecycle features, especially goals and hooks, need an answer or persistent state after restart? (iteration 6)
- What comprehensive package matrix and priority list should synthesis deliver? (iteration 6)
- Does the final 56-root matrix assign every package a Q1/Q2/Q3/Q4 outcome or a concrete no-scenario gap? (iteration 7)
- Which candidates remain highest after all package families are considered? (iteration 7)
- Which remaining CLI goal-hook and MCP packages contain a real second-turn injection or answer-dependent flow? (iteration 7)
- Which of the remaining noncandidate packages have Q1 judgment or Q4 one-shot contracts and should be listed in the matrix? (iteration 8)
- Which local evidence and workflow constraints must appear in final synthesis? (iteration 8)
- Which candidates should be ranked first after considering supported runtimes, runner semantics, host prerequisites, rollback and per-pass time? (iteration 8)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Which candidates should be ranked first after considering supported runtimes, runner semantics, host prerequisites, rollback and per-pass time?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
[Populated during initialization from the continuity ladder and ripgrep recipes, if any prior work exists]

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: the playbook style contract, runner schema and package census under .skilled/skills/sk-doc/sk-create-manual-testing-playbook.
- Reuse candidates: the shared JSON conversation script, runtime matrix and turn-level shell checks.
- Integration points: scenario files across 55 skill or mode packages and the central /doctor package.
- Constraints and risks: the runner supports five runtimes, requires tmux and authenticated quota, and uses a macOS-only write sandbox.

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
- Started: 2026-11-02 17:45:00 UTC
