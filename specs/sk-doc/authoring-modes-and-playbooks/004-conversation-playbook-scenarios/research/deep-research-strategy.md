---
title: "Deep Research Strategy: conversation playbook scenarios plan review"
description: "Session tracking for the deep-research run that reviews the conversation-scenario plan of sk-doc/065 before either phase is built."
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Conversation playbook scenarios plan review

Session tracking for the run bound to `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios`.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

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
Review the conversation-scenario plan before building it. (1) The existing sk-create-manual-testing-playbook skill (templates, references, validate-playbook-package.cjs and its tests, the current 'Turn | Exact user input' chain tables in cli-claude-code, cli-cursor and local-obsidian playbooks): what to improve or reuse. (2) Phase 001-scenario-contract (the json conversation block, closed key set, validator rules) and 002-conversation-runner (tmux-driven runner, per-runtime adapters for Claude Code, OpenCode, Codex, Pi and Devin, scratch-project refusal, cleanup, matrix): should anything be changed, simplified, split, re-ordered or planned differently, and is anything missing? Check the feasibility claims per runtime against the cli-* skills and each CLI's --help (read-only; do not start long interactive sessions). (3) Whether the runner contract fits its first consumer, specs/system-speckit/043-decision-capture/006-live-conversation-test (stage marks PASS/FAIL/SKIP vs its PASS/FAIL/DEVIATION/N/A, per-stage state checks, saves, restart, kill switch). Cite code and spec lines.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: What in the existing sk-create-manual-testing-playbook skill (templates, references, validate-playbook-package.cjs and its tests, the existing Turn | Exact user input chain tables) should the conversation work reuse or improve?
- [x] Q2: Should phase 001-scenario-contract (the json conversation block, its closed key set and validator rules) be changed, simplified, split or extended, and is anything missing?
- [x] Q3: Should phase 002-conversation-runner (tmux runner, scratch guard, cleanup, evidence, matrix) be changed, simplified, split or re-ordered, and is anything missing?
- [x] Q4: Are the per-runtime feasibility claims for Claude Code, OpenCode, Codex, Pi and Devin supported by the cli-* skills and each CLI's --help?
- [x] Q5: Does the runner contract fit its first consumer 043/006-live-conversation-test (stage marks, per-stage state checks, saves, restart, kill switch)?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Building or editing any code, skill file, phase plan or other packet. This run is research only.
- Writing the decision-capture conversation scenario itself (043/006 owns it).
- Starting long interactive runtime sessions or spending model quota on live probes. CLI checks are `--help`, `--version` and read-only listings only.
- Adapters for Cursor and Hermes, which the parent spec puts out of scope.

---

## 5. STOP CONDITIONS
- The run stops after 3 iterations (stopPolicy max-iterations); convergence is telemetry only.
- Stop an iteration's line of inquiry when a claim needs a live interactive session to confirm; record it as an open question with the probe that would settle it.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: What in the existing sk-create-manual-testing-playbook skill (templates, references, validate-playbook-package.cjs and its tests, the existing Turn | Exact user input chain tables) should the conversation work reuse or improve?
- Q2: Should phase 001-scenario-contract (the json conversation block, its closed key set and validator rules) be changed, simplified, split or extended, and is anything missing?
- Q3: Should phase 002-conversation-runner (tmux runner, scratch guard, cleanup, evidence, matrix) be changed, simplified, split or re-ordered, and is anything missing?
- Q4: Are the per-runtime feasibility claims for Claude Code, OpenCode, Codex, Pi and Devin supported by the cli-* skills and each CLI's --help?
- Q5: Does the runner contract fit its first consumer 043/006-live-conversation-test (stage marks, per-stage state checks, saves, restart, kill switch)?

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
- **Snapshot mechanism.** Replace `git status` with a content hash over the state subtree in both packets, or the guard tests nothing. (iteration 3)
- **Retry on DEVIATION.** 002's "first failed turn ends the run" [SOURCE: specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/002-conversation-runner/spec.md:171] has to become attempt-aware, or 006's NFR-R02 becomes unimplementable. (iteration 3)
- **Stage marks.** One of the two vocabularies has to yield. Adding DEVIATION and N/A to 002's verdict set is the smaller edit only if a stage status file is also added; otherwise 006 needs a documented derivation. (iteration 3)
- **Which doc owns S8, S9 and S12?** 006's stage content and 002's turn/scratch model disagree in three places. Either 002 gains a check-only stage, an action list per turn and a named second project, or 006 changes its stage count and its `env` mechanism. Decide before either is built, because every one of the three is a format change in 001's closed key set. (iteration 3)
- **Probe additions for T001.** Verify `devin list`, what `devin --resume` with no id does, and whether Codex needs `--dangerously-bypass-hook-trust` for hooks to fire in a fresh project. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Continuity ladder: no handover.md; the parent is a phase parent with no implementation-summary.md, so spec.md and decision-record.md carry the context. The free-text ripgrep recipe over the full topic string is a clean no-hit (exit 1); the packet docs below are the prior work.

- Parent `spec.md`: adds a conversation scenario kind and one shared tmux runner to sk-create-manual-testing-playbook. Two phases: 001-scenario-contract (format, validator checks, docs) and 002-conversation-runner (runner, five adapters, MTP-007). Handoff: both children strict-valid and MTP-007 passes on Claude Code. Open questions: Codex `default_mode_request_user_input` flag; 043/006 stage marks DEVIATION and N/A that the runner does not write.
- Parent `decision-record.md` ADR-001: the script is one fenced `json conversation` block in section 3 of the scenario file, parsed with JSON.parse against a closed key set; the validator exports `parseConversationScript` for the runner. Rejected: widening the Turn table (pipes split cells), a .json sidecar, a YAML block. Operator decisions Q001-Q004 (Q004: Luna xhigh fast workers via cli-codex, DeepSeek via cli-pi as fallback).
- `001-scenario-contract/spec.md`: REQ-001..REQ-009; `CONVERSATION_SCRIPT_INVALID` per malformed shape; first send joins prompt-sync (`PROMPT_UNSYNCED`); fleet baseline 56 packages, 1 violation, 93 warnings must not move.
- `002-conversation-runner/spec.md`: REQ-001..REQ-013; private tmux socket per runtime, 200x50, settle = ready marker + no busy marker + 1500 ms unchanged screen; check via bash -c; cleanup on every exit path; `REPO_CHANGED` snapshot of specs and .skilled/skills/.state; verdicts PASS/FAIL/SKIP only. ADR-001..003 live in its plan.md.

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/` (SKILL.md, scripts/validate-playbook-package.cjs, scripts/tests/, assets/manual-testing-playbook-snippet-template.md, references/); `.skilled/skills/cli-external-orchestration/cli-*/`; `specs/system-speckit/043-decision-capture/006-live-conversation-test/`.
- Reuse candidates: the validator's prompt-sync copies and `chainTurnOnePrompt`, the test fixture, the cli-* skills' interactive and headless flag notes.
- Integration points: the validator export consumed by the runner; the 043/006 goal and stage marks.
- Constraints and risks: research is read-only; the sibling 043 run is active in parallel and its packet must not be touched.

- resource-map.md not present; skipping coverage gate

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 3
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-01T21:41:55.986Z
