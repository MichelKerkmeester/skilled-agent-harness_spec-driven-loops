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
Session relaunch loop as shipped on main through phases 024-032 (.skilled/bin/skilled-loop, .skilled/bin/skilled-loop-shell.sh, .skilled/hooks/session-relaunch/ lib, bin, claude, codex, hermes and pi adapters, .opencode/plugins session-relaunch, .hermes/plugins/repo-guards, .skilled/commands/speckit/handoff.md, their tests, README, feature catalog and playbooks). Find remaining defects and missing test coverage in four areas: (1) goal persistence across a hop on all seven runtimes (goal_packet in note and record, SESSION_RELAUNCH_GOAL_PACKET and HERMES_SPEC_FOLDER export and restore, SESSION_RELAUNCH_GOAL=0, receiver rebind); (2) model, provider and effort persistence (launch-flag capture and replay per runtime, live values from Claude log, Codex rollout, Cursor cli-config.json, Pi arm and Hermes post_api_request, precedence, validation and drop warnings, carry to later hops, OpenCode 2 and Devin limits); (3) OpenCode 2 --standalone first launch and relaunch, --server handling; (4) operator UX and edge cases: warnings and messages, manual claim command, nested runs, hop cap, cancel and withdraw, stale or racing records, odd paths and quoting, missing binaries, concurrent sessions. Every finding must cite file:line and say whether a test covers it.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] How does each of the seven runtime adapters capture, persist, export, and rebind goal_packet across a relaunch, including SESSION_RELAUNCH_GOAL=0?
- [ ] How does each runtime capture and replay model, provider, and effort, and where do precedence, validation, drop warnings, or later-hop carry-forward differ?
- [ ] Does OpenCode 2 start and relaunch with --standalone, and how are --server and unsupported replay flags handled?
- [ ] Which operator-facing and concurrency edge cases remain untested or defective across warnings, manual claim, nested runs, hop caps, cancel/withdraw, stale records, quoting, missing binaries, and concurrent sessions?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
[What this research session is NOT trying to answer -- populated during initialization]

---

## 5. STOP CONDITIONS
Run all 10 iterations; convergence is telemetry because stopPolicy is max-iterations.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- comparing the producer's early return with the note writer and test setup exposed the untested stale-field case. (iteration 1)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the phase records describe intended behavior but do not replace tracing the current receiver path. (iteration 1)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### None. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None.

### The automatic consume and claim paths do not expose a packet while SESSION_RELAUNCH_GOAL remains off; existing tests cover this receiver-side suppression. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The automatic consume and claim paths do not expose a packet while SESSION_RELAUNCH_GOAL remains off; existing tests cover this receiver-side suppression.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The automatic consume and claim paths do not expose a packet while SESSION_RELAUNCH_GOAL remains off; existing tests cover this receiver-side suppression.

### The pending loop record stores the handoff path and settings, while consume reads and validates goal_packet from the note into its output. The consumer tests cover that output shape [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:747-760; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:693-738; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2495-2516]. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The pending loop record stores the handoff path and settings, while consume reads and validates goal_packet from the note into its output. The consumer tests cover that output shape [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:747-760; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:693-738; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2495-2516].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The pending loop record stores the handoff path and settings, while consume reads and validates goal_packet from the note into its output. The consumer tests cover that output shape [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:747-760; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:693-738; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2495-2516].

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None. (iteration 1)
- The automatic consume and claim paths do not expose a packet while SESSION_RELAUNCH_GOAL remains off; existing tests cover this receiver-side suppression. (iteration 1)
- The pending loop record stores the handoff path and settings, while consume reads and validates goal_packet from the note into its output. The consumer tests cover that output shape [SOURCE: .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:747-760; .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:693-738; .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:2495-2516]. (iteration 1)

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
- Are SESSION_RELAUNCH_GOAL_PACKET and HERMES_SPEC_FOLDER cleared or restored correctly across later hops? (iteration 1)
- Do all receiver adapters bind the consumed packet, and what happens on runtimes whose printed manual command starts a new process? (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Do all receiver adapters bind the consumed packet, and what happens on runtimes whose printed manual command starts a new process?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
The packet spec assigns phases 024-028 to goal rebinding, 029 to evidence and playbook gaps, 030-031 to OpenCode 2 and model/effort, and 032 to standalone replay. Current source and tests remain authoritative.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: .skilled/hooks/session-relaunch/, .skilled/bin/skilled-loop, runtime plugins/adapters and their tests.
- Reuse candidates: shared relaunch core and adapter conformance tests.
- Integration points: handoff note, goal binding record, runtime launch arguments, and receiver rebind.
- Constraints and risks: read-only review; phase records may describe intended behavior that differs from shipped code.

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
- Started: 2026-10-25T11:36:21Z
