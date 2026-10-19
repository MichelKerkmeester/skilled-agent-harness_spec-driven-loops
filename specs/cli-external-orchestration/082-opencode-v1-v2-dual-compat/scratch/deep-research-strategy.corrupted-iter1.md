---
title: Deep Research Strategy - OpenCode v1 and v2 dual compatibility
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
How to make the Skilled repo perfectly compatible with both OpenCode v1 (1.19.x) and OpenCode v2 (2.0.x) at the same time: every agent, command, plugin, skill, hook and config file, plus the cli-opencode skill dispatching to both versions and documenting side-by-side and single-version installs

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which plugin shape and API surface loads and behaves correctly on both OpenCode v1 (1.19.x) and v2 (2.0.x), and how do the 16 repo plugins port to it?
- [ ] Can one set of agent, command, skill and opencode.json files serve both versions, and where must they diverge?
- [ ] How must hooks, guards and plugin dependencies become version-aware so neither version breaks?
- [ ] How should cli-opencode detect the installed version and dispatch to v1 and v2, with a full flag and subcommand matrix?
- [ ] What install, verification and pinning guidance supports side-by-side and single-version setups, and which gaps stay irreducible?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any change: no skill, command, agent, plugin or config file outside this packet is edited during the run.
- Choosing between v1 and v2: the goal is both at once, not a migration off one.
- OpenCode internals beyond what the repo's surfaces depend on.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: the run continues to iteration 20; convergence is telemetry only (convergenceMode off).
- A credential or quota failure on the executor pauses the run via the pause sentinel until the operator fixes it.
- Operator pause via research/.deep-research-pause.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

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
- Does v1 tolerate the `plugins` (plural) config key, and does v2 tolerate `plugin` (singular)? Does v1 load `.opencode/plugins/` or only `.opencode/plugin/`? (iteration 1)
- Is `sk-vision.js` a symlink, and does a flat glob follow symlinks on both hosts? (iteration 1)
- Does the 2.0.32 `@opencode/plugin` `.d.ts` match the preview bundled in 1.18.34, and what is the real `PluginContext` domain list? (blocking, P1) (iteration 1)
- Can one module default-export satisfy both contracts (function + `{id, setup}`), or is a two-file split mandatory? (iteration 1)
- Which of the 16 repo plugins touch `"shell.env"`, `"chat.*"`, `experimental.*`, or `PluginInput.---
title: Deep Research Strategy - OpenCode v1 and v2 dual compatibility
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
How to make the Skilled repo perfectly compatible with both OpenCode v1 (1.19.x) and OpenCode v2 (2.0.x) at the same time: every agent, command, plugin, skill, hook and config file, plus the cli-opencode skill dispatching to both versions and documenting side-by-side and single-version installs

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which plugin shape and API surface loads and behaves correctly on both OpenCode v1 (1.19.x) and v2 (2.0.x), and how do the 16 repo plugins port to it?
- [ ] Can one set of agent, command, skill and opencode.json files serve both versions, and where must they diverge?
- [ ] How must hooks, guards and plugin dependencies become version-aware so neither version breaks?
- [ ] How should cli-opencode detect the installed version and dispatch to v1 and v2, with a full flag and subcommand matrix?
- [ ] What install, verification and pinning guidance supports side-by-side and single-version setups, and which gaps stay irreducible?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any change: no skill, command, agent, plugin or config file outside this packet is edited during the run.
- Choosing between v1 and v2: the goal is both at once, not a migration off one.
- OpenCode internals beyond what the repo's surfaces depend on.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: the run continues to iteration 20; convergence is telemetry only (convergenceMode off).
- A credential or quota failure on the executor pauses the run via the pause sentinel until the operator fixes it.
- Operator pause via research/.deep-research-pause.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

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

 — i.e. which hit irreducible gaps? (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Which of the 16 repo plugins touch `"shell.env"`, `"chat.*"`, `experimental.*`, or `PluginInput.---
title: Deep Research Strategy - OpenCode v1 and v2 dual compatibility
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
How to make the Skilled repo perfectly compatible with both OpenCode v1 (1.19.x) and OpenCode v2 (2.0.x) at the same time: every agent, command, plugin, skill, hook and config file, plus the cli-opencode skill dispatching to both versions and documenting side-by-side and single-version installs

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which plugin shape and API surface loads and behaves correctly on both OpenCode v1 (1.19.x) and v2 (2.0.x), and how do the 16 repo plugins port to it?
- [ ] Can one set of agent, command, skill and opencode.json files serve both versions, and where must they diverge?
- [ ] How must hooks, guards and plugin dependencies become version-aware so neither version breaks?
- [ ] How should cli-opencode detect the installed version and dispatch to v1 and v2, with a full flag and subcommand matrix?
- [ ] What install, verification and pinning guidance supports side-by-side and single-version setups, and which gaps stay irreducible?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any change: no skill, command, agent, plugin or config file outside this packet is edited during the run.
- Choosing between v1 and v2: the goal is both at once, not a migration off one.
- OpenCode internals beyond what the repo's surfaces depend on.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: the run continues to iteration 20; convergence is telemetry only (convergenceMode off).
- A credential or quota failure on the executor pauses the run via the pause sentinel until the operator fixes it.
- Operator pause via research/.deep-research-pause.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

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
- Does v1 tolerate the `plugins` (plural) config key, and does v2 tolerate `plugin` (singular)? Does v1 load `.opencode/plugins/` or only `.opencode/plugin/`? (iteration 1)
- Is `sk-vision.js` a symlink, and does a flat glob follow symlinks on both hosts? (iteration 1)
- Does the 2.0.32 `@opencode/plugin` `.d.ts` match the preview bundled in 1.18.34, and what is the real `PluginContext` domain list? (blocking, P1) (iteration 1)
- Can one module default-export satisfy both contracts (function + `{id, setup}`), or is a two-file split mandatory? (iteration 1)
- Which of the 16 repo plugins touch `"shell.env"`, `"chat.*"`, `experimental.*`, or `PluginInput.---
title: Deep Research Strategy - OpenCode v1 and v2 dual compatibility
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
How to make the Skilled repo perfectly compatible with both OpenCode v1 (1.19.x) and OpenCode v2 (2.0.x) at the same time: every agent, command, plugin, skill, hook and config file, plus the cli-opencode skill dispatching to both versions and documenting side-by-side and single-version installs

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which plugin shape and API surface loads and behaves correctly on both OpenCode v1 (1.19.x) and v2 (2.0.x), and how do the 16 repo plugins port to it?
- [ ] Can one set of agent, command, skill and opencode.json files serve both versions, and where must they diverge?
- [ ] How must hooks, guards and plugin dependencies become version-aware so neither version breaks?
- [ ] How should cli-opencode detect the installed version and dispatch to v1 and v2, with a full flag and subcommand matrix?
- [ ] What install, verification and pinning guidance supports side-by-side and single-version setups, and which gaps stay irreducible?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any change: no skill, command, agent, plugin or config file outside this packet is edited during the run.
- Choosing between v1 and v2: the goal is both at once, not a migration off one.
- OpenCode internals beyond what the repo's surfaces depend on.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: the run continues to iteration 20; convergence is telemetry only (convergenceMode off).
- A credential or quota failure on the executor pauses the run via the pause sentinel until the operator fixes it.
- Operator pause via research/.deep-research-pause.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

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

 — i.e. which hit irreducible gaps? (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

---

 — i.e. which hit irreducible gaps?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
No prior context: the continuity ladder found no handover.md, implementation-summary.md or decision-record.md (spec.md is a fresh scaffold), and the ripgrep recipe over specs and .skilled returned a clean no-hit (exit 1).

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 20
- Convergence threshold: 0
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
- Started: 2026-10-18T09:23:10.373Z
