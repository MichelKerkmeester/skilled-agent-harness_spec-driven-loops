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
Design a doctor-style setup path for sk-git that lets a repository user adapt sk-git to their own repository, the way /doctor:sk-code setup lets them adapt sk-code. Study the sk-code precedent first; map every customizable part of sk-git and /doctor:git; recommend setup command placement, rejected ideas, read-only proof requirements, and implementation phases.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What does the sk-code adaptation guide and `/doctor:sk-code setup` check, and how do those responsibilities divide?
- [x] Which sk-git policy inputs are repository-customizable, where are they set, and what behavior depends on them?
- [x] How do worktree naming/provisioning, Commit-Id allocation, hook trust, global hooks, and preflight advice interact?
- [x] What can a read-only sk-git setup check prove, and how does `/doctor:git` currently route and report?
- [x] Should setup be a new `/doctor:git` action or a separate command, and which proposals should be rejected?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Implementation, changes to sk-git or doctor commands, writes outside this lineage, and repository setup or Git mutation commands.

---

## 5. STOP CONDITIONS
Complete all five iterations; treat convergence as telemetry because the stop policy is max-iterations.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What does the sk-code adaptation guide and `/doctor:sk-code setup` check, and how do those responsibilities divide?
- Which sk-git policy inputs are repository-customizable, where are they set, and what behavior depends on them?
- How do worktree naming/provisioning, Commit-Id allocation, hook trust, global hooks, and preflight advice interact?
- What can a read-only sk-git setup check prove, and how does `/doctor:git` currently route and report?
- Should setup be a new `/doctor:git` action or a separate command, and which proposals should be rejected?

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
### No alternate user-facing Commit-Id format or allocator setting appeared in the inspected allocator and policy interfaces; changing the format would cross the history scanner, shared hook policy, stamper, enforcement gate, and shipped template rather than adjust one repository setting. [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:41-48; .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-40; .skilled/scripts/git-hooks/prepare-commit-msg:101-119,286-313; .skilled/scripts/git-hooks/commit-msg:63-75; .skilled/skills/sk-git/assets/commit-message-template.md:41-47] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No alternate user-facing Commit-Id format or allocator setting appeared in the inspected allocator and policy interfaces; changing the format would cross the history scanner, shared hook policy, stamper, enforcement gate, and shipped template rather than adjust one repository setting. [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:41-48; .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-40; .skilled/scripts/git-hooks/prepare-commit-msg:101-119,286-313; .skilled/scripts/git-hooks/commit-msg:63-75; .skilled/skills/sk-git/assets/commit-message-template.md:41-47]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No alternate user-facing Commit-Id format or allocator setting appeared in the inspected allocator and policy interfaces; changing the format would cross the history scanner, shared hook policy, stamper, enforcement gate, and shipped template rather than adjust one repository setting. [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:41-48; .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-40; .skilled/scripts/git-hooks/prepare-commit-msg:101-119,286-313; .skilled/scripts/git-hooks/commit-msg:63-75; .skilled/skills/sk-git/assets/commit-message-template.md:41-47]

### No single “hooks installed” bit covers this system: global Git lifecycle hooks, per-repository trust, persistent gate settings, and runtime preflight adapters have separate resolvers and failure modes. [SOURCE: .skilled/scripts/install-git-hooks.sh:112-149; .skilled/scripts/git-hooks/pre-commit:28-57; .skilled/scripts/git-hooks/lib/gate-config.sh:20-39; .skilled/skills/sk-git/scripts/hooks/README.md:71-84] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No single “hooks installed” bit covers this system: global Git lifecycle hooks, per-repository trust, persistent gate settings, and runtime preflight adapters have separate resolvers and failure modes. [SOURCE: .skilled/scripts/install-git-hooks.sh:112-149; .skilled/scripts/git-hooks/pre-commit:28-57; .skilled/scripts/git-hooks/lib/gate-config.sh:20-39; .skilled/skills/sk-git/scripts/hooks/README.md:71-84]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No single “hooks installed” bit covers this system: global Git lifecycle hooks, per-repository trust, persistent gate settings, and runtime preflight adapters have separate resolvers and failure modes. [SOURCE: .skilled/scripts/install-git-hooks.sh:112-149; .skilled/scripts/git-hooks/pre-commit:28-57; .skilled/scripts/git-hooks/lib/gate-config.sh:20-39; .skilled/skills/sk-git/scripts/hooks/README.md:71-84]

### Rejected a doctor action that applies repairs: the precedent's diagnostic boundary explicitly requires reporting a repair command and leaves it to the operator. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Rejected a doctor action that applies repairs: the precedent's diagnostic boundary explicitly requires reporting a repair command and leaves it to the operator. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rejected a doctor action that applies repairs: the precedent's diagnostic boundary explicitly requires reporting a repair command and leaves it to the operator. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28]

### Rejected a separate `/doctor:sk-git` command: `/doctor:git` already resolves git-specific targets through the canonical route manifest and is owned by `sk-git`, so a second router would split one domain without adding a new owner. [SOURCE: .skilled/commands/doctor/git.md:6-10,39-54; .skilled/commands/doctor/_routes.yaml:236-267] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Rejected a separate `/doctor:sk-git` command: `/doctor:git` already resolves git-specific targets through the canonical route manifest and is owned by `sk-git`, so a second router would split one domain without adding a new owner. [SOURCE: .skilled/commands/doctor/git.md:6-10,39-54; .skilled/commands/doctor/_routes.yaml:236-267]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rejected a separate `/doctor:sk-git` command: `/doctor:git` already resolves git-specific targets through the canonical route manifest and is owned by `sk-git`, so a second router would split one domain without adding a new owner. [SOURCE: .skilled/commands/doctor/git.md:6-10,39-54; .skilled/commands/doctor/_routes.yaml:236-267]

### Rejected making the remote allowlist a denylist replacement: the current file is additive, and removing it deliberately leaves only the built-in exemptions. [SOURCE: .skilled/skills/sk-git/references/remote-branch-policy.md:36-44] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Rejected making the remote allowlist a denylist replacement: the current file is additive, and removing it deliberately leaves only the built-in exemptions. [SOURCE: .skilled/skills/sk-git/references/remote-branch-policy.md:36-44]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rejected making the remote allowlist a denylist replacement: the current file is additive, and removing it deliberately leaves only the built-in exemptions. [SOURCE: .skilled/skills/sk-git/references/remote-branch-policy.md:36-44]

### Rejected the idea that the existing `hooks` target is already a setup diagnostic: its status read is followed by an interactive choice and approved config writes, so it does not provide the one-pass read-only result the precedent establishes. [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:78-103] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Rejected the idea that the existing `hooks` target is already a setup diagnostic: its status read is followed by an interactive choice and approved config writes, so it does not provide the one-pass read-only result the precedent establishes. [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:78-103]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rejected the idea that the existing `hooks` target is already a setup diagnostic: its status read is followed by an interactive choice and approved config writes, so it does not provide the one-pass read-only result the precedent establishes. [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:78-103]

### Rejected treating a successful `validate-message.mjs --explain` exit as proof of enforcement: the command returns 0 even when there is no contract directory or a kind has no enforced rules. [SOURCE: .skilled/skills/sk-git/scripts/validate-message.mjs:125-136] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Rejected treating a successful `validate-message.mjs --explain` exit as proof of enforcement: the command returns 0 even when there is no contract directory or a kind has no enforced rules. [SOURCE: .skilled/skills/sk-git/scripts/validate-message.mjs:125-136]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Rejected treating a successful `validate-message.mjs --explain` exit as proof of enforcement: the command returns 0 even when there is no contract directory or a kind has no enforced rules. [SOURCE: .skilled/skills/sk-git/scripts/validate-message.mjs:125-136]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Rejected a doctor action that applies repairs: the precedent's diagnostic boundary explicitly requires reporting a repair command and leaves it to the operator. [SOURCE: .skilled/commands/doctor/assets/doctor-sk-code-setup.yaml:21-28] (iteration 1)
- Rejected making the remote allowlist a denylist replacement: the current file is additive, and removing it deliberately leaves only the built-in exemptions. [SOURCE: .skilled/skills/sk-git/references/remote-branch-policy.md:36-44] (iteration 2)
- Rejected treating a successful `validate-message.mjs --explain` exit as proof of enforcement: the command returns 0 even when there is no contract directory or a kind has no enforced rules. [SOURCE: .skilled/skills/sk-git/scripts/validate-message.mjs:125-136] (iteration 2)
- No alternate user-facing Commit-Id format or allocator setting appeared in the inspected allocator and policy interfaces; changing the format would cross the history scanner, shared hook policy, stamper, enforcement gate, and shipped template rather than adjust one repository setting. [SOURCE: .skilled/skills/sk-git/scripts/commit-id-naming.sh:41-48; .skilled/scripts/git-hooks/lib/commit-id-policy.sh:17-40; .skilled/scripts/git-hooks/prepare-commit-msg:101-119,286-313; .skilled/scripts/git-hooks/commit-msg:63-75; .skilled/skills/sk-git/assets/commit-message-template.md:41-47] (iteration 3)
- No single “hooks installed” bit covers this system: global Git lifecycle hooks, per-repository trust, persistent gate settings, and runtime preflight adapters have separate resolvers and failure modes. [SOURCE: .skilled/scripts/install-git-hooks.sh:112-149; .skilled/scripts/git-hooks/pre-commit:28-57; .skilled/scripts/git-hooks/lib/gate-config.sh:20-39; .skilled/skills/sk-git/scripts/hooks/README.md:71-84] (iteration 4)
- Rejected a separate `/doctor:sk-git` command: `/doctor:git` already resolves git-specific targets through the canonical route manifest and is owned by `sk-git`, so a second router would split one domain without adding a new owner. [SOURCE: .skilled/commands/doctor/git.md:6-10,39-54; .skilled/commands/doctor/_routes.yaml:236-267] (iteration 5)
- Rejected the idea that the existing `hooks` target is already a setup diagnostic: its status read is followed by an interactive choice and approved config writes, so it does not provide the one-pass read-only result the precedent establishes. [SOURCE: .skilled/commands/doctor/assets/doctor-git-hooks.yaml:78-103] (iteration 5)

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
- Which sk-git policy inputs are repository-customizable, where are they set, and what behavior depends on them? (iteration 1)
- Should setup be a new `/doctor:git` action or a separate command, and which proposals should be rejected? (iteration 1)
- What can a read-only sk-git setup check prove, and how does `/doctor:git` currently route and report? (iteration 1)
- How do worktree naming/provisioning, Commit-Id allocation, hook trust, global hooks, and preflight advice interact? (iteration 1)
- How do hook trust, global hooks, and preflight advice interact with worktree and Commit-Id setup? (iteration 3)
- None for the requested research decision. Runtime delivery can only be reported as configured from registration files; exercising each AI runtime remains outside a read-only repository scan. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
No prior context was supplied. The spec packet has no resource-map.md; the lineage override owns all research artifacts.

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
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-10-15T05:42:26Z
