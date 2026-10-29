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
RQ-6 only: skill advisor alignment for moving every skill's MACHINE ROUTER section out of SKILL.md into a sibling ROUTER.md. Scope is .skilled/skills/system-skill-advisor: the freshness signature, SKILL.md discovery and parsing, the skill graph and its embeddings, the leaf inventory and leaf-scopes, the scorer lanes, the hooks and plugin bridges, and the routing-accuracy baseline scripts.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] RQ-6.1: What exactly does the freshness signature in runtime/lib/freshness.ts hash, and does a router move out of SKILL.md leave a stale checkout looking fresh?
- [x] RQ-6.2: How does runtime/scripts/skill_advisor_runtime.py discover and parse a skill, and what must change for it to read a sibling ROUTER.md?
- [x] RQ-6.3: What does the skill graph compiler in runtime/lib/skill-graph/ index and embed, and does it parse SKILL.md body text, Keywords comments or router markers?
- [x] RQ-6.4: What reads the leaf inventory, leaf-manifest.config.json and leaf-scopes, and does the router move change any of them?
- [x] RQ-6.5: Does any scorer lane read SKILL.md body text, keywords comments or router markers, and does the router move change scores or accuracy?
- [x] RQ-6.6: What do the advisor hooks, the plugin bridges and the routing-accuracy baseline scripts depend on, and what is the fix for each?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
This run does not design the repository-wide migration (RQ-5), does not map non-advisor readers of the machine router (RQ-1), and does not implement any change in system-skill-advisor. It reports what the advisor must change or be checked, with file:line, and marks anything unconfirmed as unconfirmed.

---

## 5. STOP CONDITIONS
Run exactly one iteration (config.maxIterations = 1) and stop at that cap with stopReason maxIterationsReached. Convergence before the cap is telemetry only. Every write stays inside this lineage directory. Any claim without a resolving source is marked UNKNOWN or unconfirmed.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- RQ-6.1: What exactly does the freshness signature in runtime/lib/freshness.ts hash, and does a router move out of SKILL.md leave a stale checkout looking fresh?
- RQ-6.2: How does runtime/scripts/skill_advisor_runtime.py discover and parse a skill, and what must change for it to read a sibling ROUTER.md?
- RQ-6.3: What does the skill graph compiler in runtime/lib/skill-graph/ index and embed, and does it parse SKILL.md body text, Keywords comments or router markers?
- RQ-6.4: What reads the leaf inventory, leaf-manifest.config.json and leaf-scopes, and does the router move change any of them?
- RQ-6.5: Does any scorer lane read SKILL.md body text, keywords comments or router markers, and does the router move change scores or accuracy?
- RQ-6.6: What do the advisor hooks, the plugin bridges and the routing-accuracy baseline scripts depend on, and what is the fix for each?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- starting from the signature and following each hash input to its producer separated the files that are read from the files that only appear to be read. Chasing the deprecated writer outward to the fleet producer turned a would-be accuracy finding into a documented non-change. (iteration 1)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- a phrase search for the section title produced changelog and documentation hits that looked like coupling. The root cause was searching for a human heading instead of a filename or symbol. (iteration 1)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Adding `ROUTER.md` to the doc-frontmatter harvest. The harvest walks `references/` and `assets/` only and is off by default. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Adding `ROUTER.md` to the doc-frontmatter harvest. The harvest walks `references/` and `assets/` only and is off by default.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding `ROUTER.md` to the doc-frontmatter harvest. The harvest walks `references/` and `assets/` only and is off by default.

### Adding a lane for router markers. No lane has a field for them, and the projection exposes only frontmatter, keywords, metadata signals and the derived block. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Adding a lane for router markers. No lane has a field for them, and the projection exposes only frontmatter, keywords, metadata signals and the derived block.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a lane for router markers. No lane has a field for them, and the projection exposes only frontmatter, keywords, metadata signals and the derived block.

### Treating the derived lane as a live body consumer. Its writer is marked deprecated and off the serving path, and the fleet producer preserves curated trigger and topic fields while pruning only dead paths. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the derived lane as a live body consumer. Its writer is marked deprecated and off the serving path, and the fleet producer preserves curated trigger and topic fields while pruning only dead paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the derived lane as a live body consumer. Its writer is marked deprecated and off the serving path, and the fleet producer preserves curated trigger and topic fields while pruning only dead paths.

### Treating the graph compiler as a body reader. The file has no `SKILL.md` read; it copies `graph-metadata.json` as authored. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the graph compiler as a body reader. The file has no `SKILL.md` read; it copies `graph-metadata.json` as authored.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the graph compiler as a body reader. The file has no `SKILL.md` read; it copies `graph-metadata.json` as authored.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Adding `ROUTER.md` to the doc-frontmatter harvest. The harvest walks `references/` and `assets/` only and is off by default. (iteration 1)
- Adding a lane for router markers. No lane has a field for them, and the projection exposes only frontmatter, keywords, metadata signals and the derived block. (iteration 1)
- Treating the derived lane as a live body consumer. Its writer is marked deprecated and off the serving path, and the fleet producer preserves curated trigger and topic fields while pruning only dead paths. (iteration 1)
- Treating the graph compiler as a body reader. The file has no `SKILL.md` read; it copies `graph-metadata.json` as authored. (iteration 1)

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
- Whether a standalone skill may legally own a root `ROUTER.md` is a policy decision, not a code fact: the contract neither requires nor forbids it, and the replay does not enumerate it. Recorded as a decision for the migration owner. (iteration 1)
- The accuracy claim is EXPECTED, not measured. Confirming it needs a before/after capture with the recorded corpus and the same empty-database environment. (iteration 1)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior lineage research in this packet (lineages/luna) established the non-advisor reader inventory, the seven-runtime skill loading map, and the two-stage hub routing contract. This lineage takes the advisor side only.

### Bounded Context Snapshot

- Source pointers: .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts, runtime/scripts/skill_advisor_runtime.py, runtime/lib/skill-graph/, leaf-manifest.config.json, hooks/.
- Sibling contract: .skilled/repo-rules/skill-hub-routing.md states the advisor scores a hub through its graph-metadata.json, and a metadata routingClass mode has no advisor entry of its own.
- Integration points: the routing-accuracy baselines quoted in spec.md (155/195, 49/66, 19/24) and the compiled-routing projection.
- Constraints: research only, no implementation, writes confined to this lineage.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 1
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
- Started: 2026-10-29T08:44:48Z
