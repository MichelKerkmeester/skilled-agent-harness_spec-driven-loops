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
What must be added to or corrected in .skilled/changelog/skilled/v4.0.0.3.md so it covers (a) the doctor command changes in specs/system-speckit/049-doctor-audit-followups phases 001-010: trigger-index freshness, release/update customization signals, doctor gates and drift, doctor script conformance, the /doctor:update research and fixes, the speckit router contract drift, the ownership split of /doctor:speckit into /doctor:skill-advisor, /doctor:deep-loop and /doctor:runtime-mirrors with /doctor:rebuild and the fable-mode target deleted, the new /doctor:git <hooks|standards> command, and the mandatory input gates added to /doctor:skill-advisor and /doctor:mcp; and (b) the git workflow and hook changes: the speckit.hooks.<key> gate settings read by .skilled/scripts/git-hooks/lib/gate-config.sh from lib/gates.tsv, .sk-git/ rule overrides edited by .skilled/commands/doctor/scripts/git-standards.cjs, and the earlier hook hardening in specs/sk-git/032-template-driven-message-enforcement and its children 001-003 (commits e5b1ea84c7, 9c99983374, d1fe481584, f7316afc6a). Compare against what the v4.0.0.3 entry already says, separate missing items from items it states wrongly or that later work made stale (for example references to /doctor:rebuild or /doctor:speckit), and cite a commit, file or spec for each item. Research only; do not edit the changelog.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Which doctor command changes in phases 001-010 of specs/system-speckit/049-doctor-audit-followups (and the 048 audit they follow) change what an operator runs or sees, and which of them does .skilled/changelog/skilled/v4.0.0.3.md already mention?
- [x] Q2: What does the entry need about the saved git hook gate settings (speckit.hooks.<key> in git config, read by .skilled/scripts/git-hooks/lib/gate-config.sh from lib/gates.tsv), the new /doctor:git hooks and standards targets, and .sk-git/ rule overrides?
- [x] Q3: Which fixes from the hook hardening in specs/sk-git/032-template-driven-message-enforcement children 001-003 (commits e5b1ea84c7, 9c99983374, d1fe481584, f7316afc6a) does the Repository Checks section already cover, and which are missing or described differently from what shipped?
- [x] Q4: Which statements in the entry did later work make wrong or stale (for example /doctor:speckit, /doctor:rebuild, the fable-mode target, hook switch names or counts), and what must Upgrade Notes add?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing the changelog. The operator asked for research only.
- Other releases than v4.0.0.3.
- Sections of the entry unrelated to doctor commands, git workflows or hooks, except where they name a doctor command or a hook.

---

## 5. STOP CONDITIONS
- Stop after 3 iterations (stop policy max-iterations).
- Every proposed item is checked against the repository before it is recorded.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Which doctor command changes in phases 001-010 of specs/system-speckit/049-doctor-audit-followups (and the 048 audit they follow) change what an operator runs or sees, and which of them does .skilled/changelog/skilled/v4.0.0.3.md already mention?
- Q2: What does the entry need about the saved git hook gate settings (speckit.hooks.<key> in git config, read by .skilled/scripts/git-hooks/lib/gate-config.sh from lib/gates.tsv), the new /doctor:git hooks and standards targets, and .sk-git/ rule overrides?
- Q3: Which fixes from the hook hardening in specs/sk-git/032-template-driven-message-enforcement children 001-003 (commits e5b1ea84c7, 9c99983374, d1fe481584, f7316afc6a) does the Repository Checks section already cover, and which are missing or described differently from what shipped?
- Q4: Which statements in the entry did later work make wrong or stale (for example /doctor:speckit, /doctor:rebuild, the fable-mode target, hook switch names or counts), and what must Upgrade Notes add?

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
- (New, self-owned) The entry's "Trigger Lookups Handle No Hits" paragraph mixes 048-era `--scoring-only` work with 049/001's doctor verdict. Iteration 2 should attribute items correctly between the 048 audit packet and 049 so the added text does not credit the wrong phase. (iteration 1)
- (New, self-owned) The precise placement and wording of the added entry sections (at-a-glance bullets, section order, Upgrade Notes list) is not yet fixed. (iteration 1)
- (New, self-owned) `ENV-REFERENCE.md` section 5 lists 14 hook switches while `gates.tsv` carries 12 gate rows; iteration 2 should confirm the two counts describe different sets (whole-hook kill switches vs switchable gates) so no count is quoted wrongly. (iteration 1)
- Whether the added text should note the `cli-jev/003/010` origin of `--scoring-only` inside the existing paragraph or leave that paragraph untouched and only add the doctor-side sentence (new, wording-level). (iteration 2)
- The precise placement and wording of the added entry sections (at-a-glance bullets, section order, Upgrade Notes list) is still not fixed (carried forward). (iteration 2)
- None. All tracked and carried-forward open questions are resolved; the remaining work is implementing the edits, which the research boundaries exclude. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- The entry `.skilled/changelog/skilled/v4.0.0.3.md` was last edited on 2026-10-02 (commits 10dd46c97a, 7877260e26, 8718f06f89). The newest tag is v4.0.0.2, so v4.0.0.3 is unreleased and still the entry to extend.
- Doctor work: `specs/system-speckit/049-doctor-audit-followups/` phases 001-010, each with an `implementation-summary.md`; the earlier audit is `specs/system-speckit/048-doctor-command-audit/`. Commands live in `.skilled/commands/doctor/` (`_routes.yaml`, `scripts/`, `assets/`).
- Hook work: `.skilled/scripts/git-hooks/` (`pre-commit`, `prepare-commit-msg`, `commit-msg`, `pre-push`, `lib/gates.tsv`, `lib/gate-config.sh`, `README.md`) and the doctor scripts `git-hook-gates.cjs` and `git-standards.cjs`.
- Hook hardening: `specs/sk-git/032-template-driven-message-enforcement/` children 001-003, commits e5b1ea84c7, 9c99983374, d1fe481584, f7316afc6a.
- Scope commits with `git log --format='%h %ad %s' --date=short --since=2026-09-29 -- <path>`.

resource-map.md not present; skipping coverage gate

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: [from config]
- Convergence threshold: [from config]
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
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
- Current generation: [from config.lineage.generation]
- Started: [timestamp]
