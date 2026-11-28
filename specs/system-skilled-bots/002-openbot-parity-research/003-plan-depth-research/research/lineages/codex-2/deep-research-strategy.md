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
Planning-depth review of packet specs/system-skilled-bots/003-openbot-parity-build, the OpenBot parity build for skilled bots: fourteen phases (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels, 013-manual-testing-scenarios, 014-skilled-and-doc-alignment, 015-deep-review). The operator wants to build all of it in one shot to perfection, so every phase must be planned and architected deeply enough that a builder needs no design decision while building. Phase 003-terminal-screen was just expanded into a Level 3 phase parent with six children (UX and component map with a design/ folder of mockups, key map, glyph table and component inventory; architecture and contracts; shell and navigation; panes; answer flow; hardening). Use it as the benchmark for depth. Do not review 003's children themselves. For every other phase answer: is it planned deeply enough to one-shot? What is missing: module and file design, data contracts and record schemas with every field, state machines and lifecycles, error and refusal catalogue, concurrency and restart behavior, migration and rollback, test strategy with fixtures, the interfaces it offers to and takes from other phases, security boundaries, operator prerequisites, and design artifacts (diagrams, schema files, sequence flows, mockups for anything user-facing such as chat and channel messages)? Should it become a phase parent with children like 003, and which children? What reference code in specs/system-skilled-bots/context/ (OpenBot-main, OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main, tinychannels-main) should it study first? Evidence (read-only): the phase docs; the built runtime under .skilled/skills/system-skilled-bots/runtime/lib/ and .skilled/bin/bots.cjs; the earlier research in specs/system-skilled-bots/002-openbot-parity-research/. Every finding names the phase, the gap, the evidence as [SOURCE: path:line], a severity (P0 the build cannot be one-shot without it, P1 a builder would have to decide, P2 polish) and the exact planning artifact or child phase that closes it. End with a ranked per-phase expansion plan.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Security-heavy phases 007-per-bot-apps and 008-vault: are threat model, secret lifecycle, storage, injection and leak checks architected deeply enough, and should either become a phase parent with children?
- [x] Conversations and skills (010, 009) and memory (005): are the user-facing flows designed (chat transcript format, @bot routing, mockups of terminal and chat messages, prompt assembly order and budgets, injection boundaries) deeply enough to one-shot?
- [x] Verification phases 013-manual-testing-scenarios, 014-skilled-and-doc-alignment and 015-deep-review: are their scenario lists, alignment targets, review dimensions, executor waves and stop rules concrete enough to run without decisions, and do the build phases leave them the hooks they need?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Implementation is out of scope. Review the planning depth of phases 001-014, using 003-terminal-screen as the benchmark. Do not review the six children of 003-terminal-screen.

---

## 5. STOP CONDITIONS
Run all five configured iterations. Treat early convergence as telemetry. Stop after iteration 5 with stopReason maxIterationsReached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Security-heavy phases 007-per-bot-apps and 008-vault: are threat model, secret lifecycle, storage, injection and leak checks architected deeply enough, and should either become a phase parent with children?
- Conversations and skills (010, 009) and memory (005): are the user-facing flows designed (chat transcript format, @bot routing, mockups of terminal and chat messages, prompt assembly order and budgets, injection boundaries) deeply enough to one-shot?
- Verification phases 013-manual-testing-scenarios, 014-skilled-and-doc-alignment and 015-deep-review: are their scenario lists, alignment targets, review dimensions, executor waves and stop rules concrete enough to run without decisions, and do the build phases leave them the hooks they need?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- comparing acceptance tests with the plan's declared data flow surfaced a concrete mismatch in 007, while reading 008's explicit residuals distinguished documented limits from enforced access control. (iteration 1)
- reading task matrices beside the specs separated what is already concretely decided from lifecycle edges the tests do not exercise; reference UI code clarified which user flows need design artifacts. (iteration 2)
- comparing the source phase's allowed failure outcome with the next phase's declared inputs exposed a missing handoff; reading both 014's task gate and dependency contract exposed the executor conflict. (iteration 3)
- Comparing writer surfaces against the existing tests exposed a concrete 002 race that module inventories alone would miss; inspecting the 011 file list separately distinguished detailed transport mechanics from absent message design deliverables. (iteration 4)
- Treating the run record and needs-you answer as shared boundaries made it possible to reconcile the runtime surfaces without reopening phase children that were already reviewed. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the initially assumed rakazo integrations/ source paths were wrong; repository path search located the node guard and messages matcher instead. (iteration 1)
- broad reference-file enumeration was noisy; the phase plans and named source components produced more useful anchors than a repository-wide search. (iteration 2)
- none of the verification artifacts needed were missing; the remaining issue is how the documents compose, not the availability of tools or fixtures. (iteration 3)
- The strategy no longer supplied an open question, so the focus had to broaden from the frontier to unreviewed runtime phases; the direct phase docs provided enough evidence without external web research. (iteration 4)
- The expansive graph remains empty because the iteration records did not emit graph nodes; convergence therefore cannot score graph coverage. The configured max-iteration stop policy still required iteration 5. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Do not assume 014's fallback removes its preflight gate: T003 separately requires all five executables. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Do not assume 014's fallback removes its preflight gate: T003 separately requires all five executables.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not assume 014's fallback removes its preflight gate: T003 separately requires all five executables.

### Do not assume a worktree alone enforces least privilege: 007's plan documents that config resolution differs for shared runs. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Do not assume a worktree alone enforces least privilege: 007's plan documents that config resolution differs for shared runs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not assume a worktree alone enforces least privilege: 007's plan documents that config resolution differs for shared runs.

### Do not infer chat-pane visual completeness from a render test that checks only transcript and footer drawing. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Do not infer chat-pane visual completeness from a render test that checks only transcript and footer drawing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not infer chat-pane visual completeness from a render test that checks only transcript and footer drawing.

### Do not infer that a FAIL is necessarily blocking or resolved: 012 explicitly allows it to be filed as a defect. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Do not infer that a FAIL is necessarily blocking or resolved: 012 explicitly allows it to be filed as a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not infer that a FAIL is necessarily blocking or resolved: 012 explicitly allows it to be filed as a defect.

### Do not treat 0600/0700 ownership as per-bot isolation: 008's test explicitly verifies same-user cross-read succeeds. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Do not treat 0600/0700 ownership as per-bot isolation: 008's test explicitly verifies same-user cross-read succeeds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not treat 0600/0700 ownership as per-bot isolation: 008's test explicitly verifies same-user cross-read succeeds.

### Do not treat the 009 proposal's manual checkout move as automatic skill installation; the spec explicitly excludes a runtime copy into the checkout. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Do not treat the 009 proposal's manual checkout move as automatic skill installation; the spec explicitly excludes a runtime copy into the checkout.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not treat the 009 proposal's manual checkout move as automatic skill installation; the spec explicitly excludes a runtime copy into the checkout.

### No phase 003 children were inspected; 010's design handoff remains assigned to that phase's UX artifact owner. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No phase 003 children were inspected; 010's design handoff remains assigned to that phase's UX artifact owner.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No phase 003 children were inspected; 010's design handoff remains assigned to that phase's UX artifact owner.

### No reference modules were copied or modified; the incorrect assumed rakazo integrations/ paths were replaced with the actual packages/core/src/node and packages/core/src/messages paths found by file search. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No reference modules were copied or modified; the incorrect assumed rakazo integrations/ paths were replaced with the actual packages/core/src/node and packages/core/src/messages paths found by file search.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No reference modules were copied or modified; the incorrect assumed rakazo integrations/ paths were replaced with the actual packages/core/src/node and packages/core/src/messages paths found by file search.

### No skills, memory entries or conversation data were written; reference repositories were read only. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No skills, memory entries or conversation data were written; reference repositories were read only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No skills, memory entries or conversation data were written; reference repositories were read only.

### None. The source-path correction was a local lookup adjustment, not an exhausted research approach. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None. The source-path correction was a local lookup adjustment, not an exhausted research approach.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The source-path correction was a local lookup adjustment, not an exhausted research approach.

### None. The user-facing design gap is an unowned artifact interface, not a failed search path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None. The user-facing design gap is an unowned artifact interface, not a failed search path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The user-facing design gap is an unowned artifact interface, not a failed search path.

### None. The validation plans contain useful handoff evidence; the only contradictions are specific and repairable in 012/014's phase contracts. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None. The validation plans contain useful handoff evidence; the only contradictions are specific and repairable in 012/014's phase contracts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The validation plans contain useful handoff evidence; the only contradictions are specific and repairable in 012/014's phase contracts.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Do not assume a worktree alone enforces least privilege: 007's plan documents that config resolution differs for shared runs. (iteration 1)
- Do not treat 0600/0700 ownership as per-bot isolation: 008's test explicitly verifies same-user cross-read succeeds. (iteration 1)
- No reference modules were copied or modified; the incorrect assumed rakazo integrations/ paths were replaced with the actual packages/core/src/node and packages/core/src/messages paths found by file search. (iteration 1)
- None. The source-path correction was a local lookup adjustment, not an exhausted research approach. (iteration 1)
- Do not infer chat-pane visual completeness from a render test that checks only transcript and footer drawing. (iteration 2)
- Do not treat the 009 proposal's manual checkout move as automatic skill installation; the spec explicitly excludes a runtime copy into the checkout. (iteration 2)
- No skills, memory entries or conversation data were written; reference repositories were read only. (iteration 2)
- None. The user-facing design gap is an unowned artifact interface, not a failed search path. (iteration 2)
- Do not assume 014's fallback removes its preflight gate: T003 separately requires all five executables. (iteration 3)
- Do not infer that a FAIL is necessarily blocking or resolved: 012 explicitly allows it to be filed as a defect. (iteration 3)
- No phase 003 children were inspected; 010's design handoff remains assigned to that phase's UX artifact owner. (iteration 3)
- None. The validation plans contain useful handoff evidence; the only contradictions are specific and repairable in 012/014's phase contracts. (iteration 3)

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
Bounded context: assigned frontier nodes cover phases 005, 007-010 and 012-014. Read the build runtime and prior research under specs/system-skilled-bots/002-openbot-parity-research/.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
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
- Started: 2026-11-25T21:47:18Z
