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
DeepSeek Harness (dsh, github.com/deepseek-ai/deepseek-harness, installed 0.2.2-rc.1) as a new cli-external-orchestration runtime mode that mirrors cli-pi: headless dispatch contract, providers (LLM Gateway and OpenCode Go DeepSeek V4.1 Flash), repo-local runtime folder, skills, agents, commands, plugins and hooks to port, third-party Pi plugins to migrate or drop, MCP, deep-loop fan-out executor support, every cross-repo touch point, and the phase plan.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What dispatch contract does DeepSeek Harness expose for headless execution, and how does it compare with the existing cli-pi contract?
- [ ] How should the two provider routes, repo-local runtime folder, skills, agents, commands, plugins, hooks, and MCP be represented for this mode?
- [ ] Which Pi extensions and third-party plugins should be ported, deferred, replaced by native features, or dropped?
- [ ] What fan-out executor support and cross-repository touch points are required to integrate the mode safely?
- [ ] What constraints, unknowns, and dependency-ordered phases should guide implementation?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Implementation, changes to the harness source or installed package, changes under DSH_HOME, provider-key inspection, and desktop or web UI styling.

---

## 5. STOP CONDITIONS
Run all ten research angles. Preserve UNKNOWN for claims that cannot be confirmed from local source, read-only CLI output, or live public sources. Do not read or print provider keys, modify harness or home configuration, or exceed two live smoke dispatches.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What dispatch contract does DeepSeek Harness expose for headless execution, and how does it compare with the existing cli-pi contract?

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
### Claiming a dedicated MCP toggle or live Code Mode connectivity before a credential-free handshake probe confirms it. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Claiming a dedicated MCP toggle or live Code Mode connectivity before a credential-free handshake probe confirms it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming a dedicated MCP toggle or live Code Mode connectivity before a credential-free handshake probe confirms it.

### Importing Pi-specific provider cache parameters before both DSH routes are pinned. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Importing Pi-specific provider cache parameters before both DSH routes are pinned.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Importing Pi-specific provider cache parameters before both DSH routes are pinned.

### Passing every inherited environment variable to a local MCP child; the DSH transport intentionally scrubs sensitive-name patterns and `DSH_*`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Passing every inherited environment variable to a local MCP child; the DSH transport intentionally scrubs sensitive-name patterns and `DSH_*`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Passing every inherited environment variable to a local MCP child; the DSH transport intentionally scrubs sensitive-name patterns and `DSH_*`.

### Reusing Pi event names directly; DSH exposes its own typed Cordis and Session seams. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Reusing Pi event names directly; DSH exposes its own typed Cordis and Session seams.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing Pi event names directly; DSH exposes its own typed Cordis and Session seams.

### Treating `--approval-policy never` as a confinement mechanism; it only prevents waiting for human approval. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating `--approval-policy never` as a confinement mechanism; it only prevents waiting for human approval.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `--approval-policy never` as a confinement mechanism; it only prevents waiting for human approval.

### Treating `.pi/mcp.json` as a config file DSH can load directly; DSH requires its own plugin-entry schema. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating `.pi/mcp.json` as a config file DSH can load directly; DSH requires its own plugin-entry schema.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `.pi/mcp.json` as a config file DSH can load directly; DSH requires its own plugin-entry schema.

### Treating `SPECKIT_DSH_STATE_DIR` by itself as a DSH home override; current runner comments define such markers as detection-only unless a native home environment variable is passed. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating `SPECKIT_DSH_STATE_DIR` by itself as a DSH home override; current runner comments define such markers as detection-only unless a native home environment variable is passed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `SPECKIT_DSH_STATE_DIR` by itself as a DSH home override; current runner comments define such markers as detection-only unless a native home environment variable is passed.

### Treating DSH conversation compaction as an equivalent for observational memory. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating DSH conversation compaction as an equivalent for observational memory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating DSH conversation compaction as an equivalent for observational memory.

### Treating DSH subagents as the same interaction as Pi's parallel /btw sidebar. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating DSH subagents as the same interaction as Pi's parallel /btw sidebar.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating DSH subagents as the same interaction as Pi's parallel /btw sidebar.

### Treating DSH's loop-hygiene guard group as a replacement for repository policy guards; its documented scope is repeat calls and timeouts. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating DSH's loop-hygiene guard group as a replacement for repository policy guards; its documented scope is repeat calls and timeouts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating DSH's loop-hygiene guard group as a replacement for repository policy guards; its documented scope is repeat calls and timeouts.

### Treating DSH's nonzero exit like Pi's nondeterministic exit without new counterevidence. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating DSH's nonzero exit like Pi's nondeterministic exit without new counterevidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating DSH's nonzero exit like Pi's nondeterministic exit without new counterevidence.

### Treating DSH's profile package manager or plugin catalog as project-local extension auto-discovery. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating DSH's profile package manager or plugin catalog as project-local extension auto-discovery.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating DSH's profile package manager or plugin catalog as project-local extension auto-discovery.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Reusing Pi event names directly; DSH exposes its own typed Cordis and Session seams. (iteration 6)
- Treating DSH's loop-hygiene guard group as a replacement for repository policy guards; its documented scope is repeat calls and timeouts. (iteration 6)
- Treating DSH's profile package manager or plugin catalog as project-local extension auto-discovery. (iteration 6)
- Importing Pi-specific provider cache parameters before both DSH routes are pinned. (iteration 7)
- Treating DSH conversation compaction as an equivalent for observational memory. (iteration 7)
- Treating DSH subagents as the same interaction as Pi's parallel /btw sidebar. (iteration 7)
- Claiming a dedicated MCP toggle or live Code Mode connectivity before a credential-free handshake probe confirms it. (iteration 8)
- Passing every inherited environment variable to a local MCP child; the DSH transport intentionally scrubs sensitive-name patterns and `DSH_*`. (iteration 8)
- Treating `.pi/mcp.json` as a config file DSH can load directly; DSH requires its own plugin-entry schema. (iteration 8)
- Treating `--approval-policy never` as a confinement mechanism; it only prevents waiting for human approval. (iteration 9)
- Treating `SPECKIT_DSH_STATE_DIR` by itself as a DSH home override; current runner comments define such markers as detection-only unless a native home environment variable is passed. (iteration 9)
- Treating DSH's nonzero exit like Pi's nondeterministic exit without new counterevidence. (iteration 9)

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
- Which Pi community plugins have a suitable DSH native replacement or market package? (iteration 6)
- What fan-out executor changes and complete cross-repository touch points are required? (iteration 6)
- What constraints, unknowns, and ordered phases should guide implementation? (iteration 6)
- How should the provider routes, repo-local runtime folder, skills, agents, commands, plugins, hooks, and MCP be integrated as one sync contract? (iteration 6)
- How should the provider routes, repo-local runtime folder, skills, agents, commands, plugins, hooks, and MCP form one sync contract? (iteration 7)
- Which optional MCP memory and tool packages are appropriate for this repository? (iteration 7)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Which optional MCP memory and tool packages are appropriate for this repository?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
The supplied resource map is the known context and should not be rediscovered: installed package 0.2.2-rc.1; no DSH_HOME or provider keys; LLM Gateway and OpenCode Go routes; cli-pi is the comparison model; the source clone and candidate cross-repository touch points are listed in the parent resource-map.md. The current turn is the inline executor because the operator bound it as a detached fan-out lineage. The workflow contract ordinarily delegates one iteration at a time; this explicit executor instruction controls this run.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: the source clone paths in resource-map.md, dsh CLI output, and the cli-pi packet.
- Reuse candidates: cli-pi runtime scaffolding and the Hermes repo-local runtime precedent.
- Integration points: external-orchestration hub, deep-loop executor configuration and fanout runner, hooks, advisor, command contracts, doctor manifests, root guidance.
- Constraints and risks: source and installed package are read-only; no provider keys are available; parent packet mutations are outside this lineage write authority.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
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
- Started: 2026-11-05 22:04:39 UTC
