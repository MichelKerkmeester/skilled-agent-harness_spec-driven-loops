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
Answer Q1-Q5 of the Research Brief in the bound spec.md (stored route receipts for weak follow-ups). Q0 is closed and must not be rerun: over-suppresses branch, stripped H=5, raw H=4, Hsame=2, C=19, N=9, recorded in implementation-summary.md.

The full brief, the reading lists, Q1 to Q5 and the required answer shape are in the phase `spec.md` (the phase folder that holds this `research/` folder) under the Research Brief anchor. Read that section first in every iteration. Paths in the brief are relative to `.skilled/skills/system-skill-advisor/` unless they start with a dot.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1 Receipt contents and the guard's action: what a receipt holds, which turns write one, reuse versus suppress on a weak follow-up, and the test that separates a weak follow-up from a floored topic change
- [x] Q2 The state store: reuse the directive-lifecycle store, a sibling folder beside Vibe's head receipts, or `.skilled/skills/.state/`, with atomicity and concurrency
- [x] Q3 Expiry: by turn count, by time or by a lifecycle event (startup, resume, compact, clear, shrinking transcript)
- [x] Q4 Runtime reach: Claude, Pi, DSH, Vibe, Codex and the OpenCode plugin, including Vibe head-receipt interaction
- [x] Q5 The measurement: the harness, the success threshold on the nine follow-up pairs, why C does not apply without a receipt, the scorer-isolation check and one false-carry case

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Rerunning Q0 or the follow-up bench premise: Q0 is closed (over-suppresses, stripped H=5, raw H=4, Hsame=2, C=19, N=9).
- Editing advisor code, tests, fixtures or the phase 011 docs. The research writes only inside this `research/` folder.
- Changing the phase 003 decision rule or the nine follow-up pairs.
- Feeding reply text into the scoring lanes.
- A hosted decision model like the extension's.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: the lineage runs all 3 iterations.
- Each of Q1 to Q5 closes with one recommended design and the change it makes to phase 011's Files to Change table or REQ rows.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1 Receipt contents and the guard's action: what a receipt holds, which turns write one, reuse versus suppress on a weak follow-up, and the test that separates a weak follow-up from a floored topic change
- Q2 The state store: reuse the directive-lifecycle store, a sibling folder beside Vibe's head receipts, or `.skilled/skills/.state/`, with atomicity and concurrency
- Q3 Expiry: by turn count, by time or by a lifecycle event (startup, resume, compact, clear, shrinking transcript)
- Q4 Runtime reach: Claude, Pi, DSH, Vibe, Codex and the OpenCode plugin, including Vibe head-receipt interaction
- Q5 The measurement: the harness, the success threshold on the nine follow-up pairs, why C does not apply without a receipt, the scorer-isolation check and one false-carry case

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the hook end to end, before the policy and render code, showed where the guard has to sit (between `:464` and `:480`) and that the hook's own policy result is computed on raw text. That decided the stripped-text requirement from code instead of from the brief. (iteration 1)
- reading the helper's `mutate` table before designing the store showed in one place that the record shape is fixed and that the clock is already a public op. That made the location decision and the expiry signal fall out together instead of needing a separate Q3 pass. (iteration 2)
- listing every file that calls into the lifecycle before reading any host settled boundary coverage in one pass. That list showed at once that DSH and Pi never appear as clock callers, which became findings 4 and 5. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the inline `node -e` probe hit the permission layer in this unattended run, so the separator rests on hand tokenization. (iteration 1)
- the registration search used `--include` globs that zsh expanded before `grep` saw them, and the second pass covered too few config files to say which hosts run the boundary adapter. (iteration 2)
- Codex's `compact-inject.ts` was read only at its no-input line, because the grep context stopped there. Its with-input branch is inferred. (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A raw meaningful-token cut.** It separates pair 7 (7 tokens) from the refactor task (8) by one token, too narrow to hold. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A raw meaningful-token cut.** It separates pair 7 (7 tokens) from the refactor task (8) by one token, too narrow to hold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A raw meaningful-token cut.** It separates pair 7 (7 tokens) from the refactor task (8) by one token, too narrow to hold.

### **A turn-count expiry.** It cuts off a legitimate run of weak follow-ups and needs a write on guarded turns. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A turn-count expiry.** It cuts off a legitimate run of weak follow-ups and needs a write on guarded turns.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A turn-count expiry.** It cuts off a legitimate run of weak follow-ups and needs a write on guarded turns.

### **An age limit on top of the clock.** It adds no safety on hosts where the clock rotates, and it adds a field. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **An age limit on top of the clock.** It adds no safety on hosts where the clock rotates, and it adds a field.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An age limit on top of the clock.** It adds no safety on hosts where the clock rotates, and it adds a field.

### **Clearing receipts from the boundary adapter.** Storing the clock expires them with no change to the boundary path (finding 7). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Clearing receipts from the boundary adapter.** Storing the clock expires them with no change to the boundary path (finding 7).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Clearing receipts from the boundary adapter.** Storing the clock expires them with no change to the boundary path (finding 7).

### **Floored-passing-set membership as the separator.** The refactor task's floored passing set also holds `sk-doc` (spec Measured Behavior, third block), so "receipt skill is in the follow-up's floored set" would carry a topic change. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Floored-passing-set membership as the separator.** The refactor task's floored passing set also holds `sk-doc` (spec Measured Behavior, third block), so "receipt skill is in the follow-up's floored set" would carry a topic change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Floored-passing-set membership as the separator.** The refactor task's floored passing set also holds `sk-doc` (spec Measured Behavior, third block), so "receipt skill is in the follow-up's floored set" would carry a topic change.

### **Putting OpenCode in scope.** The guard runs in the hook, and the plugin calls the CLI. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Putting OpenCode in scope.** The guard runs in the hook, and the plugin calls the CLI.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Putting OpenCode in scope.** The guard runs in the hook, and the plugin calls the CLI.

### **Reusing the hook's `skippedResult` as the guard's policy reason.** It is computed on raw text (finding 1). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Reusing the hook's `skippedResult` as the guard's policy reason.** It is computed on raw text (finding 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reusing the hook's `skippedResult` as the guard's policy reason.** It is computed on raw text (finding 1).

### **Riding the helper's `flock`.** It needs a new helper op and an extra spawn, and the guard's fail-to-deliver direction makes a lock unnecessary (findings 2, 3 and 6). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Riding the helper's `flock`.** It needs a new helper op and an extra spawn, and the guard's fail-to-deliver direction makes a lock unnecessary (findings 2, 3 and 6).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Riding the helper's `flock`.** It needs a new helper op and an extra spawn, and the guard's fail-to-deliver direction makes a lock unnecessary (findings 2, 3 and 6).

### **Storing the receipt inside the lifecycle record.** The helper rebuilds and copies only fixed keys, so an extra field would not survive a matched turn (finding 1). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Storing the receipt inside the lifecycle record.** The helper rebuilds and copies only fixed keys, so an extra field would not survive a matched turn (finding 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Storing the receipt inside the lifecycle record.** The helper rebuilds and copies only fixed keys, so an extra field would not survive a matched turn (finding 1).

### None new. The `dist/` probe from iteration 1 was not retried. This iteration needed no runtime probe. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None new. The `dist/` probe from iteration 1 was not retried. This iteration needed no runtime probe.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None new. The `dist/` probe from iteration 1 was not retried. This iteration needed no runtime probe.

### None. No runtime probe was attempted in this iteration, so the iteration 1 permission dead end was not retried. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: None. No runtime probe was attempted in this iteration, so the iteration 1 permission dead end was not retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. No runtime probe was attempted in this iteration, so the iteration 1 permission dead end was not retried.

### The in-process probe through `dist/` was refused by the permission layer in this unattended run. Not a dead end for the question, only for this iteration's tool path. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The in-process probe through `dist/` was refused by the permission layer in this unattended run. Not a dead end for the question, only for this iteration's tool path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The in-process probe through `dist/` was refused by the permission layer in this unattended run. Not a dead end for the question, only for this iteration's tool path.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **A raw meaningful-token cut.** It separates pair 7 (7 tokens) from the refactor task (8) by one token, too narrow to hold. (iteration 1)
- **Floored-passing-set membership as the separator.** The refactor task's floored passing set also holds `sk-doc` (spec Measured Behavior, third block), so "receipt skill is in the follow-up's floored set" would carry a topic change. (iteration 1)
- **Reusing the hook's `skippedResult` as the guard's policy reason.** It is computed on raw text (finding 1). (iteration 1)
- The in-process probe through `dist/` was refused by the permission layer in this unattended run. Not a dead end for the question, only for this iteration's tool path. (iteration 1)
- **Clearing receipts from the boundary adapter.** Storing the clock expires them with no change to the boundary path (finding 7). (iteration 2)
- **Riding the helper's `flock`.** It needs a new helper op and an extra spawn, and the guard's fail-to-deliver direction makes a lock unnecessary (findings 2, 3 and 6). (iteration 2)
- **Storing the receipt inside the lifecycle record.** The helper rebuilds and copies only fixed keys, so an extra field would not survive a matched turn (finding 1). (iteration 2)
- None new. The `dist/` probe from iteration 1 was not retried. This iteration needed no runtime probe. (iteration 2)
- **A turn-count expiry.** It cuts off a legitimate run of weak follow-ups and needs a write on guarded turns. (iteration 3)
- **An age limit on top of the clock.** It adds no safety on hosts where the clock rotates, and it adds a field. (iteration 3)
- **Putting OpenCode in scope.** The guard runs in the hook, and the plugin calls the CLI. (iteration 3)
- None. No runtime probe was attempted in this iteration, so the iteration 1 permission dead end was not retried. (iteration 3)

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
- Q3, Q4, Q5: not started. (iteration 1)
- Q2: partly answered (store location leaning to a sibling folder). Atomicity under concurrent writers, the bound and pruning are still open. (iteration 1)
- Q4, Q5: not started. (iteration 2)
- Q3: partly answered. A clock-bound receipt expires on every boundary that reaches the lifecycle store. Still open: which hosts deliver boundaries, whether an age limit or turn count is needed on top, and the clock-versus-age fallback if the spawn cost is too high. (iteration 2)
- None of Q1 to Q5 is open as a design question. Three claims still need checking: the floored state of the five harm-pair task tops (finding 8), Codex PreCompact's with-input branch (finding 2), and iteration 1's hand-worked separator table. The rebuilt-`dist/` probe or 011's bench row confirms all three. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Continuity ladder: no `handover.md`; `implementation-summary.md` records the Q0 rerun at `18ce562e8b3` (N=9, stripped H=5, raw H=4 with pair 9 raw reading `explicit_skill_or_governance_marker`, Hsame=2, C=19) and the branch over-suppresses, so the research proceeds. `spec.md` holds the Research Brief with the reading lists and Q1 to Q5. The free-text ripgrep recipe over specs and .skilled for the topic string returned no hits.

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
- Started: 2026-11-18T19:04:03Z

