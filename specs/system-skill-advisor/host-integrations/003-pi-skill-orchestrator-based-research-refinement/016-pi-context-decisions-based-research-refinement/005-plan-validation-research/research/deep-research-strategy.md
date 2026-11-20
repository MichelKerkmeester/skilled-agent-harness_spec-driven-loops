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
Check the planned refinement phases 002 to 004 and the cut list in the 016 phase parent against the system-skill-advisor code and the pi-context-decisions extension (source in `../context/pi-context-decisions-main/`, relative to the phase folder). The full brief, the reading lists, research questions RQ1 to RQ4 and the required answer shape are in the phase `spec.md` under the Research Brief anchor. Read that section first in every iteration.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] RQ1 Phase 002: which rule strips a pasted earlier reply before the task without touching a real task, measured against the routing corpora, and is the dual placement (recommend handler plus scorer entry) the only correct one?
- [x] RQ2 Phase 003: after commit 67782cf23f0 dropped floor-only ties, do weak follow-ups still pass on the floor, is the planned ship rule sound, and what should the guard return?
- [ ] RQ3 Phase 004: is the nested-try fallback in the shared Claude catch the smallest correct fix on all four runtimes, and what must the ENV-REFERENCE sentence say given the hook sends confidenceThreshold 0.8 per request?
- [x] RQ4 Gaps and order: does anything in the advisor or the extension make a planned phase unnecessary, larger or riskier, change the order, or bring back a cut item on new evidence?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Editing the advisor, the extension or the planned phase docs.
- Reopening cut items without new evidence.
- Re-running the first research question set from `001-deep-research`.

---

## 5. STOP CONDITIONS
- The stop policy is max-iterations: the run ends after iteration 3.
- Stop early only on an executor failure the orchestrator cannot recover.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- RQ1 Phase 002: which rule strips a pasted earlier reply before the task without touching a real task, measured against the routing corpora, and is the dual placement (recommend handler plus scorer entry) the only correct one?
- RQ2 Phase 003: after commit 67782cf23f0 dropped floor-only ties, do weak follow-ups still pass on the floor, is the planned ship rule sound, and what should the guard return?
- RQ4 Gaps and order: does anything in the advisor or the extension make a planned phase unnecessary, larger or riskier, change the order, or bring back a cut item on new evidence?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- checking the plan's exact `file:line` anchors and then reading the surrounding function showed the vitest short-circuit at `semantic-shadow.ts:145`. The plan cites the equality check but misses that its own verification steps run under vitest. (iteration 1)
- comparing the Files to Change tables across phases found the shared hook file. The line anchors one phase pins and another phase moves only show up when the phases are read side by side. (iteration 2)
- following the 011 change to its only call site and that call site's guard condition settled the ancestry question without git. The guard on `hasTaskIntent` decides it for every pair. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- `node -e` and the probes need interactive approval, and this executor runs unattended. rg with `-o` or `--glob` also needed approval, while plain `rg -c` and `rg -n` did not. (iteration 1)
- `git show` needs approval in this executor, so the commit-ancestry part of RQ4 collapsed into RQ2. (iteration 2)
- counting `C` directly. The corpus is not where I looked, and probes are blocked, so the most decision-relevant number stays inferred. (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `git show` from this unattended executor needs approval, the same as `node -e` in iteration 1. Commit-ancestry checks belong to the orchestrator, or to rg over the `011-surfacing-scorer-follow-ups` packet docs. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `git show` from this unattended executor needs approval, the same as `node -e` in iteration 1. Commit-ancestry checks belong to the orchestrator, or to rg over the `011-surfacing-scorer-follow-ups` packet docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `git show` from this unattended executor needs approval, the same as `node -e` in iteration 1. Commit-ancestry checks belong to the orchestrator, or to rg over the `011-surfacing-scorer-follow-ups` packet docs.

### Adopting the extension's single-winner benchmark for phase 003 (Finding 7). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Adopting the extension's single-winner benchmark for phase 003 (Finding 7).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adopting the extension's single-winner benchmark for phase 003 (Finding 7).

### Counting `C` from the corpus file. `runtime/bench/labeled-prompts.jsonl` is not at that path, and the remaining budget went to the scorer reads. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Counting `C` from the corpus file. `runtime/bench/labeled-prompts.jsonl` is not at that path, and the remaining budget went to the scorer reads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting `C` from the corpus file. `runtime/bench/labeled-prompts.jsonl` is not at that path, and the remaining budget went to the scorer reads.

### None new. `node -e` and `git show` stay blocked, as recorded. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None new. `node -e` and `git show` stay blocked, as recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. `node -e` and `git show` stay blocked, as recorded.

### Placing `67782cf23f0` in the probed build through git. That approach is blocked, and Finding 1 makes the answer irrelevant to the pairs. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Placing `67782cf23f0` in the probed build through git. That approach is blocked, and Finding 1 makes the answer irrelevant to the pairs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Placing `67782cf23f0` in the probed build through git. That approach is blocked, and Finding 1 makes the answer irrelevant to the pairs.

### Reviving R4 on the grounds that phase 003 already touches the strict schema. The flag has a reader and R4's fields do not (Finding 5). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reviving R4 on the grounds that phase 003 already touches the strict schema. The flag has a reader and R4's fields do not (Finding 5).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reviving R4 on the grounds that phase 003 already touches the strict schema. The flag has a reader and R4's fields do not (Finding 5).

### Running `node -e` and live CLI probes from this unattended executor. Both need approval. Later iterations should use rg and Read for evidence and leave probes to the orchestrator. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Running `node -e` and live CLI probes from this unattended executor. Both need approval. Later iterations should use rg and Read for evidence and leave probes to the orchestrator.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running `node -e` and live CLI probes from this unattended executor. Both need approval. Later iterations should use rg and Read for evidence and leave probes to the orchestrator.

### Stripping only the advisor's own output lines. The plan already rules it out, and nothing here contradicts that. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Stripping only the advisor's own output lines. The plan already rules it out, and nothing here contradicts that.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stripping only the advisor's own output lines. The plan already rules it out, and nothing here contradicts that.

### The extension's role-based separation, which has no input to work on in the advisor (Finding 6). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The extension's role-based separation, which has no input to work on in the advisor (Finding 6).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The extension's role-based separation, which has no input to work on in the advisor (Finding 6).

### Treating the OpenCode guard gap as new evidence. Phase 003 already names it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the OpenCode guard gap as new evidence. Phase 003 already names it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the OpenCode guard gap as new evidence. Phase 003 already names it.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Running `node -e` and live CLI probes from this unattended executor. Both need approval. Later iterations should use rg and Read for evidence and leave probes to the orchestrator. (iteration 1)
- Stripping only the advisor's own output lines. The plan already rules it out, and nothing here contradicts that. (iteration 1)
- The extension's role-based separation, which has no input to work on in the advisor (Finding 6). (iteration 1)
- `git show` from this unattended executor needs approval, the same as `node -e` in iteration 1. Commit-ancestry checks belong to the orchestrator, or to rg over the `011-surfacing-scorer-follow-ups` packet docs. (iteration 2)
- Reviving R4 on the grounds that phase 003 already touches the strict schema. The flag has a reader and R4's fields do not (Finding 5). (iteration 2)
- Treating the OpenCode guard gap as new evidence. Phase 003 already names it. (iteration 2)
- Adopting the extension's single-winner benchmark for phase 003 (Finding 7). (iteration 3)
- Counting `C` from the corpus file. `runtime/bench/labeled-prompts.jsonl` is not at that path, and the remaining budget went to the scorer reads. (iteration 3)
- None new. `node -e` and `git show` stay blocked, as recorded. (iteration 3)
- Placing `67782cf23f0` in the probed build through git. That approach is blocked, and Finding 1 makes the answer irrelevant to the pairs. (iteration 3)

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
- RQ3: phase 004 nested-try fallback, and the ENV-REFERENCE sentence. (iteration 1)
- RQ2: phase 003 floor-only ties after `67782cf23f0`, the ship rule, and what the guard returns. (iteration 1)
- RQ4: gaps and order. (iteration 1)
- RQ2: phase 003 floor-only ties after `67782cf23f0`, the ship rule, and what the guard returns. Finding 2 here adds one input: the guard's policy check has to see the stripped prompt. (iteration 2)
- RQ3, not covered in this run: the phase 004 nested-try fallback and the `ENV-REFERENCE.md` sentence. Iteration 2's Recommended Next Focus names the anchors: `hooks/claude/user-prompt-submit.ts:468-480`, `hooks/pi/prompt-advisor.ts:285`, `hooks/lib/skill-advisor-cli-fallback.ts:245`. The run's iteration cap is 3, so synthesis must mark RQ3 as open, not answered. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
RQ3, not covered in this run: the phase 004 nested-try fallback and the `ENV-REFERENCE.md` sentence. Iteration 2's Recommended Next Focus names the anchors: `hooks/claude/user-prompt-submit.ts:468-480`, `hooks/pi/prompt-advisor.ts:285`, `hooks/lib/skill-advisor-cli-fallback.ts:245`. The run's iteration cap is 3, so synthesis must mark RQ3 as open, not answered.

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work in this packet: `../001-deep-research/research/research.md` (ranked R1 to R8), `review-fable-5-2.md` (N1 to N8) and `review-overengineering-opus-high.md` (the cut-down plan with orchestrator verification). The plan under test is in `../002-pasted-context-stripping/`, `../003-follow-up-routing-benchmark/` and `../004-crash-path-fallback/`. Probes on 2026-11-18 at `655aa883009` after an advisor rebuild: the plain refactor prompt routes sk-code 0.82; with a pasted prose reply in front it routes sk-doc 0.9268; "fix that too" passes sk-code, sk-doc and local-webflow at 0.82. resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 3
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
- Started: 2026-11-18T12:01:37Z
