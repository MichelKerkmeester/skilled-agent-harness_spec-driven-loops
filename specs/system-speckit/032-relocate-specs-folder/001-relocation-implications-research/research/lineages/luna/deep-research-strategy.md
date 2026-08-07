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
Implications of relocating the root .opencode/specs folder to a top-level specs/ directory outside .opencode: spec-kit tooling path assumptions (validate.sh, create.sh, generate-description.js, backfill-graph-metadata.js), cross-runtime mirror behavior (.claude, .codex, .cursor, .devin, .pi), git and .gitignore interactions (the existing root specs symlink, the !specs and !.opencode/ negation rules, and ~/.gitignore_global's /specs and /.opencode/ ignores for downstream symlinked repos), Spec Kit Memory MCP server path resolution, and the scale/risk of repointing in-repo path references

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which in-repo tools hard-code the current specs root, and which resolve it dynamically?
- [x] What breaks or stays stable across runtime mirrors, generated symlinks, and shared assets?
- [x] How do Git, symlinks, ignore negations, and global ignore rules affect relocation and downstream repos?
- [x] How does Spec Kit Memory resolve spec paths, and what boundary changes would it require?
- [x] What is the measured reference count and the safest migration shape under these constraints?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Move files, change symlinks, edit runtime mirrors, reconfigure ignore rules, or implement the migration. This packet only maps implications and risk.

---

## 5. STOP CONDITIONS
Stop at legal convergence after the minimum three evidence iterations or at the five-iteration cap. Do not mutate the researched tree or any path outside this lineage.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which in-repo tools hard-code the current specs root, and which resolve it dynamically?
- What breaks or stays stable across runtime mirrors, generated symlinks, and shared assets?
- How do Git, symlinks, ignore negations, and global ignore rules affect relocation and downstream repos?
- How does Spec Kit Memory resolve spec paths, and what boundary changes would it require?
- What is the measured reference count and the safest migration shape under these constraints?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- targeted line-range reads exposed the distinction between root selection, path validation, identity normalization, and caller discovery. (iteration 1)
- combining index mode, symlink resolution, local ignore lines, and the global `core.excludesfile` exposed the source/downstream split. (iteration 2)
- reading manifests alongside generator code distinguished documented intent, actual ownership, and current filesystem state. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- nested `cli-codex` dispatch was blocked by the executor recursion guard, and the graph convergence helper was blocked by a native Node ABI mismatch. (iteration 1)
- child-path ignore inspection through the symlink cannot model a real-directory migration in place. (iteration 2)
- a clean all-runtime baseline is unavailable because several independent mirror checks already fail. (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A broad “regenerate all five runtime surfaces because specs moved” requirement is ruled out by the generator contracts: the generated surfaces do not consume the specs root directly. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A broad “regenerate all five runtime surfaces because specs moved” requirement is ruled out by the generator contracts: the generated surfaces do not consume the specs root directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A broad “regenerate all five runtime surfaces because specs moved” requirement is ruled out by the generator contracts: the generated surfaces do not consume the specs root directly.

### A live database/index scan was not confirmed because the memory daemon IPC endpoint was unavailable; source-level behavior is the evidence for this iteration. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A live database/index scan was not confirmed because the memory daemon IPC endpoint was unavailable; source-level behavior is the evidence for this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A live database/index scan was not confirmed because the memory daemon IPC endpoint was unavailable; source-level behavior is the evidence for this iteration.

### A live Memory database migration result was not confirmed because the daemon IPC endpoint and coverage graph native module were unavailable. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A live Memory database migration result was not confirmed because the daemon IPC endpoint and coverage graph native module were unavailable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A live Memory database migration result was not confirmed because the daemon IPC endpoint and coverage graph native module were unavailable.

### Blindly replacing every `.opencode/specs` literal with `specs` is ruled out because references have different contracts and precedence. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Blindly replacing every `.opencode/specs` literal with `specs` is ruled out because references have different contracts and precedence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Blindly replacing every `.opencode/specs` literal with `specs` is ruled out because references have different contracts and precedence.

### Coverage-graph convergence was unavailable because the local `better-sqlite3` binary does not match the active Node ABI. Inline convergence remains the available signal. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Coverage-graph convergence was unavailable because the local `better-sqlite3` binary does not match the active Node ABI. Inline convergence remains the available signal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Coverage-graph convergence was unavailable because the local `better-sqlite3` binary does not match the active Node ABI. Inline convergence remains the available signal.

### Direct child-path ignore inspection through the tracked `specs` symlink is not available because Git treats the path as beyond a symbolic link. The root-level index and ignore evidence remain usable. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Direct child-path ignore inspection through the tracked `specs` symlink is not available because Git treats the path as beyond a symbolic link. The root-level index and ignore evidence remain usable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Direct child-path ignore inspection through the tracked `specs` symlink is not available because Git treats the path as beyond a symbolic link. The root-level index and ignore evidence remain usable.

### No complete migration direction is ruled out. The evidence rules out the assumption that all four named scripts need the same kind of patch: their failure modes differ between default selection, discovery, special cases, and caller-provided paths. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No complete migration direction is ruled out. The evidence rules out the assumption that all four named scripts need the same kind of patch: their failure modes differ between default selection, discovery, special cases, and caller-provided paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No complete migration direction is ruled out. The evidence rules out the assumption that all four named scripts need the same kind of patch: their failure modes differ between default selection, discovery, special cases, and caller-provided paths.

### Regenerating all runtime mirrors as a relocation step is ruled out by the zero source-reference result and the generator ownership audit; existing mirror drift still requires a separate baseline. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Regenerating all runtime mirrors as a relocation step is ruled out by the zero source-reference result and the generator ownership audit; existing mirror drift still requires a separate baseline.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Regenerating all runtime mirrors as a relocation step is ruled out by the zero source-reference result and the generator ownership audit; existing mirror drift still requires a separate baseline.

### The claim that the current source repository's local ignore result predicts downstream behavior is ruled out; the configured global ignore source creates a different contract for downstream symlinked repositories. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The claim that the current source repository's local ignore result predicts downstream behavior is ruled out; the configured global ignore source creates a different contract for downstream symlinked repositories.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The claim that the current source repository's local ignore result predicts downstream behavior is ruled out; the configured global ignore source creates a different contract for downstream symlinked repositories.

### The shared mirror check is not a clean migration baseline because it already reports unrelated drift. Its output is still useful as a pre-existing-state receipt. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The shared mirror check is not a clean migration baseline because it already reports unrelated drift. Its output is still useful as a pre-existing-state receipt.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The shared mirror check is not a clean migration baseline because it already reports unrelated drift. Its output is still useful as a pre-existing-state receipt.

### The YAML executor branch was attempted twice and produced no leaf artifact because `cli-codex` was already present in `SPECKIT_CLI_DISPATCH_STACK`. The direct-mode fallback is bounded to this detached lineage and is recorded in `deep-research-state.jsonl`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The YAML executor branch was attempted twice and produced no leaf artifact because `cli-codex` was already present in `SPECKIT_CLI_DISPATCH_STACK`. The direct-mode fallback is bounded to this detached lineage and is recorded in `deep-research-state.jsonl`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The YAML executor branch was attempted twice and produced no leaf artifact because `cli-codex` was already present in `SPECKIT_CLI_DISPATCH_STACK`. The direct-mode fallback is bounded to this detached lineage and is recorded in `deep-research-state.jsonl`.

### Treating Memory MCP as uniformly dual-root-aware is ruled out by the different discovery, recovery, and repair implementations. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating Memory MCP as uniformly dual-root-aware is ruled out by the different discovery, recovery, and repair implementations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Memory MCP as uniformly dual-root-aware is ruled out by the different discovery, recovery, and repair implementations.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Coverage-graph convergence was unavailable because the local `better-sqlite3` binary does not match the active Node ABI. Inline convergence remains the available signal. (iteration 1)
- No complete migration direction is ruled out. The evidence rules out the assumption that all four named scripts need the same kind of patch: their failure modes differ between default selection, discovery, special cases, and caller-provided paths. (iteration 1)
- The YAML executor branch was attempted twice and produced no leaf artifact because `cli-codex` was already present in `SPECKIT_CLI_DISPATCH_STACK`. The direct-mode fallback is bounded to this detached lineage and is recorded in `deep-research-state.jsonl`. (iteration 1)
- Direct child-path ignore inspection through the tracked `specs` symlink is not available because Git treats the path as beyond a symbolic link. The root-level index and ignore evidence remain usable. (iteration 2)
- The claim that the current source repository's local ignore result predicts downstream behavior is ruled out; the configured global ignore source creates a different contract for downstream symlinked repositories. (iteration 2)
- A broad “regenerate all five runtime surfaces because specs moved” requirement is ruled out by the generator contracts: the generated surfaces do not consume the specs root directly. (iteration 3)
- The shared mirror check is not a clean migration baseline because it already reports unrelated drift. Its output is still useful as a pre-existing-state receipt. (iteration 3)
- A live database/index scan was not confirmed because the memory daemon IPC endpoint was unavailable; source-level behavior is the evidence for this iteration. (iteration 4)
- Treating Memory MCP as uniformly dual-root-aware is ruled out by the different discovery, recovery, and repair implementations. (iteration 4)
- A live Memory database migration result was not confirmed because the daemon IPC endpoint and coverage graph native module were unavailable. (iteration 5)
- Blindly replacing every `.opencode/specs` literal with `specs` is ruled out because references have different contracts and precedence. (iteration 5)
- Regenerating all runtime mirrors as a relocation step is ruled out by the zero source-reference result and the generator ownership audit; existing mirror drift still requires a separate baseline. (iteration 5)

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
- What exact root does the Memory MCP server use for indexing, context, and graph/FTS recovery paths? (iteration 1)
- What is the measured reference count after excluding documentation, fixtures, archives, and generated output? (iteration 1)
- Which generated runtime mirrors and symlinked command surfaces copy or rewrite `.opencode/specs` references? (iteration 1)
- How do repository-local and global ignore rules interact with the existing `specs` symlink and a real top-level `specs/` directory? (iteration 1)
- Which runtime mirrors actually carry a specs link today, and which only document or generate agent/command mirrors? (iteration 2)
- Should compatibility retain a root symlink, or should downstream repositories adopt an explicit local negation before the cutover? (iteration 2)
- What root does the Memory MCP server use for indexing, context, and graph/FTS recovery paths? (iteration 2)
- Which in-repo path references remain after the tooling, Git, and mirror-specific references are classified? (iteration 3)
- What is the measured reference count and the safest migration shape under these constraints? (iteration 4)
- No key research questions remain. Implementation details, exact patch ownership, and downstream operator communication are follow-up work outside this lineage. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
[Populated during initialization from memory_context() results, if any prior work exists]

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
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.opencode/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.opencode/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-08-06T12:31:20.167Z

### Lineage Boundary
- All workflow artifacts for this detached run live under the lineage directory. Parent spec anchoring and continuity save are intentionally deferred because they would write outside that boundary.
