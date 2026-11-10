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
Map every reference to the sk-code-opencode surface (all spellings: sk-code-opencode, bare code-opencode, path/title/snake forms) across the repo — skill folder, sk-code hub registry/router/graph-metadata/SKILL.md mode tables, system-skill-advisor DB and compiled routes and integration code, runtime mirrors (.hermes/.claude/.codex etc.), scripts, tests, fixtures, and markdown (live docs vs history: changelogs, z_archive, research logs) — and produce an ordered, test-guarded plan for renaming it to sk-code-skilled, with exclusions for the OpenCode runtime's own names (.opencode/, cli-opencode) and a recommendation on rewriting history references

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Where is the sk-code-opencode identity load-bearing (folder paths, hub registry/router/graph-metadata/SKILL.md, advisor DB and compiled routes, integration code, scripts, tests, fixtures, runtime mirrors), with counts and path:line evidence?
- [x] Q2: Which spellings belong to the identity (sk-code-opencode, bare code-opencode, title/snake/path forms), and which match patterns must exclude the OpenCode runtime's own names (.opencode/, cli-opencode)?
- [x] Q3: How are generated artifacts (advisor DB, compiled routes, trigger index, graph metadata, runtime mirrors) rebuilt after a rename, and which tests/drift guards gate it?
- [x] Q4: What ordered, test-guarded rename plan (one verification command per step) moves the surface to sk-code-skilled without breaking routing?
- [x] Q5: How many references sit in history (changelogs, z_archive, research logs, iteration files), and should they be rewritten or excluded?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Making any rename edit (phases 002 and 003 do that)
- Renaming the OpenCode runtime itself (.opencode/, cli-opencode)
- Changing the surface's behavior beyond its name

---

## 5. STOP CONDITIONS
- stop_policy is max-iterations: run all 5 iterations
- Stop early only on executor failure that the redispatch-once rule cannot recover

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Where is the sk-code-opencode identity load-bearing (folder paths, hub registry/router/graph-metadata/SKILL.md, advisor DB and compiled routes, integration code, scripts, tests, fixtures, runtime mirrors), with counts and path:line evidence?
- Q2: Which spellings belong to the identity (sk-code-opencode, bare code-opencode, title/snake/path forms), and which match patterns must exclude the OpenCode runtime's own names (.opencode/, cli-opencode)?
- Q3: How are generated artifacts (advisor DB, compiled routes, trigger index, graph metadata, runtime mirrors) rebuilt after a rename, and which tests/drift guards gate it?
- Q4: What ordered, test-guarded rename plan (one verification command per step) moves the surface to sk-code-skilled without breaking routing?
- Q5: How many references sit in history (changelogs, z_archive, research logs, iteration files), and should they be rewritten or excluded?

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
- Q5: How many references sit in history (changelogs, z_archive, research logs, iteration files), and should they be rewritten or excluded? (iteration 1)
- Q4: What ordered, test-guarded rename plan (one verification command per step) moves the surface to sk-code-skilled without breaking routing? (iteration 1)
- Q3: How are generated artifacts (advisor DB, compiled routes, trigger index, graph metadata, runtime mirrors) rebuilt after a rename, and which tests/drift guards gate it? (iteration 1)
- Q2: Which spellings belong to the identity (sk-code-opencode, bare code-opencode, title/snake/path forms), and which match patterns must exclude the OpenCode runtime's own names (.opencode/, cli-opencode)? (iteration 1)
- Residuals carried into Q4: advisor DB reindex command; trigger-index drift guard isolation. (iteration 4)
- None. All five key questions are resolved and both residuals carried into Q4 are closed (F1, F2). Minor caveat: step 7 cites the compiled-route toolchain by committed path; its flag forms were not re-read this run, so that step's check is the guard script's exit status. (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Initial counts from the orchestrator's ripgrep (2026-10-18, worktree 144): 137 non-spec files name `sk-code-opencode` (107 markdown; 14 json, 10 cjs, 2 txt, 2 jsonl, 1 yaml, 1 sh); 1,196 markdown files under specs/; 43 non-spec files contain a bare `code-opencode`. Known paths: `.skilled/skills/sk-code/sk-code-opencode/`, `.hermes/skills/sk-code-opencode`, `.skilled/changelog/sk-code/code-opencode`. resource-map.md not present; skipping coverage gate.

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
- Started: 2026-10-18T17:35:32.240Z
