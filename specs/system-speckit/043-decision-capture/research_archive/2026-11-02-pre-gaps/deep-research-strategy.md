---
title: "Deep Research Strategy: decision capture series review"
description: "Session tracking for the deep-research run over the decision-capture series parent and its children."
trigger_phrases:
  - "decision capture series research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Decision capture series review

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
Review the decision-capture series before building its follow-ups. (1) What was built in 001-decision-capture-build (the PostToolUse capture hook, the transcript sweeps, the decision-record writer and save step, the Stop-hook nudge, the playbook scenarios): defects, weak spots, and what to improve. Known real-use gap: answers recorded by hand as table rows in another packet's decision record keep counting as pending. (2) The planned children 002-table-row-matching, 003-codex-and-pi-capture, 004-opencode-devin-live-capture, 005-chat-question-detection and 006-live-conversation-test: should any be changed, merged, split, re-ordered or planned differently? Is anything missing? (3) How 006 depends on the shared conversation runner planned in specs/sk-doc/065-conversation-playbook-scenarios, and whether the contract between them is right. Cite code and spec lines.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What defects or weak spots exist in the 001 build (capture core, Claude PostToolUse hook, transcript/OpenCode/Devin sweeps, decision-record writer and save wiring, Stop-hook nudge), and what should be improved?
- [x] Why do answers recorded by hand as table rows in another packet's decision record keep counting as pending, and is 002's planned matching the right fix?
- [x] Should any of the planned children 002 to 005 be changed, merged, split, re-ordered or planned differently, and is any follow-up missing?
- [x] How does 006 depend on the shared conversation runner in specs/sk-doc/065-conversation-playbook-scenarios, and is the contract between them right and complete?
- [x] Do the three decision-capture playbook scenarios prove what 001 claims, and what must the 006 conversation scenario assert that they do not?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Changing any code, child plan, or the sk-doc/065 packet: this run is research only and reports recommendations.
- Designing or building the shared conversation runner itself (065 owns it).
- Barter's own conversion program and goals.
- Changing the existing `open_questions` and `answered_questions` continuity fields.

---

## 5. STOP CONDITIONS
- Hard stop at 3 iterations (`--stop-policy=max-iterations`); convergence is telemetry only.
- Stop an iteration's line of inquiry when a claim cannot be grounded in a file:line; record it as inferred instead.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What defects or weak spots exist in the 001 build (capture core, Claude PostToolUse hook, transcript/OpenCode/Devin sweeps, decision-record writer and save wiring, Stop-hook nudge), and what should be improved?
- Why do answers recorded by hand as table rows in another packet's decision record keep counting as pending, and is 002's planned matching the right fix?
- Should any of the planned children 002 to 005 be changed, merged, split, re-ordered or planned differently, and is any follow-up missing?
- How does 006 depend on the shared conversation runner in specs/sk-doc/065-conversation-playbook-scenarios, and is the contract between them right and complete?
- Do the three decision-capture playbook scenarios prove what 001 claims, and what must the 006 conversation scenario assert that they do not?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the *consumer's acceptance criteria* before the provider's plan. AC-005 ("13 rows, each with PASS, FAIL, DEVIATION or N/A") plus T007's `wc -l` is a machine-checkable claim, and it failed against the provider's enumerated evidence list in one comparison. Vague prose would have hidden the same gap; a row count and a closed vocabulary did not. (iteration 2)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- my first pass assumed 006's stage table was the scenario content. It is not — 006's plan states the scenario carries "the setup block, the stage table S0 to S12, the checkpoint commands" while the runner reads only the block. Two documents are competing to be the source of truth for a checkpoint, and only the block is executed. Root cause: 006 was planned before 065's key set existed, so it described its stages in the vocabulary it had. (iteration 2)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A global (all-session) pending sweep.** No code enumerates the queue directory; the sweeps all take one session id from one transcript/db. A "the sweep already shows everything" assumption is ruled out. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:214] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A global (all-session) pending sweep.** No code enumerates the queue directory; the sweeps all take one session id from one transcript/db. A "the sweep already shows everything" assumption is ruled out. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:214]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A global (all-session) pending sweep.** No code enumerates the queue directory; the sweeps all take one session id from one transcript/db. A "the sweep already shows everything" assumption is ruled out. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:214]

### **Any assumption that S12 can be expressed in the same `json conversation` block.** Two independent constraints close it (one `env` per script; second block invalid). No variation of the stage wording reopens it. Candidate for reducer promotion to "Exhausted Approaches" so no later iteration re-searches for a per-turn env hook. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Any assumption that S12 can be expressed in the same `json conversation` block.** Two independent constraints close it (one `env` per script; second block invalid). No variation of the stage wording reopens it. Candidate for reducer promotion to "Exhausted Approaches" so no later iteration re-searches for a per-turn env hook.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Any assumption that S12 can be expressed in the same `json conversation` block.** Two independent constraints close it (one `env` per script; second block invalid). No variation of the stage wording reopens it. Candidate for reducer promotion to "Exhausted Approaches" so no later iteration re-searches for a per-turn env hook.

### **Any assumption that the runner writes per-stage rows.** The evidence list is exhaustive by enumeration and contains no stage verdict file. Same promotion candidate. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Any assumption that the runner writes per-stage rows.** The evidence list is exhaustive by enumeration and contains no stage verdict file. Same promotion candidate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Any assumption that the runner writes per-stage rows.** The evidence list is exhaustive by enumeration and contains no stage verdict file. Same promotion candidate.

### **Any assumption that the writer scenario's `git status` proves the real repository was untouched.** `--untracked-files=no` over a gitignored state directory cannot fail on the write it names (finding 8). Do not build later verification on that command. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Any assumption that the writer scenario's `git status` proves the real repository was untouched.** `--untracked-files=no` over a gitignored state directory cannot fail on the write it names (finding 8). Do not build later verification on that command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Any assumption that the writer scenario's `git status` proves the real repository was untouched.** `--untracked-files=no` over a gitignored state directory cannot fail on the write it names (finding 8). Do not build later verification on that command.

### **Any attempt to make the playbook scenarios cover the consumption loop by adding a command.** The scenarios' contract is "run these commands, observe the signals"; the loop spans a save, a queue and a nudge across turns. A single-command assertion of it would be a worse 006, so the playbook should be corrected down to what it proves (a PASS on the record write) and the loop asserted in 006. Promotion candidate for "Exhausted Approaches". -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Any attempt to make the playbook scenarios cover the consumption loop by adding a command.** The scenarios' contract is "run these commands, observe the signals"; the loop spans a save, a queue and a nudge across turns. A single-command assertion of it would be a worse 006, so the playbook should be corrected down to what it proves (a PASS on the record write) and the loop asserted in 006. Promotion candidate for "Exhausted Approaches".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Any attempt to make the playbook scenarios cover the consumption loop by adding a command.** The scenarios' contract is "run these commands, observe the signals"; the loop spans a save, a queue and a nudge across turns. A single-command assertion of it would be a worse 006, so the playbook should be corrected down to what it proves (a PASS on the record write) and the loop asserted in 006. Promotion candidate for "Exhausted Approaches".

### **Assuming a table-row match path exists behind a flag.** No flag, no branch, no regex reads a decisions-table row's text anywhere in the writer. This is a capability gap, not a misconfiguration — a candidate for reducer promotion to "Exhausted Approaches" so no later iteration re-searches for it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Assuming a table-row match path exists behind a flag.** No flag, no branch, no regex reads a decisions-table row's text anywhere in the writer. This is a capability gap, not a misconfiguration — a candidate for reducer promotion to "Exhausted Approaches" so no later iteration re-searches for it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Assuming a table-row match path exists behind a flag.** No flag, no branch, no regex reads a decisions-table row's text anywhere in the writer. This is a capability gap, not a misconfiguration — a candidate for reducer promotion to "Exhausted Approaches" so no later iteration re-searches for it.

### **Assuming the four-mark verdict vocabulary spreads across the series.** Tried: take iteration 2's inference that 002 to 005 each inherit it. Failed on one grep: the only occurrence outside 006's prose is 006's own AC-005 (finding 12). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Assuming the four-mark verdict vocabulary spreads across the series.** Tried: take iteration 2's inference that 002 to 005 each inherit it. Failed on one grep: the only occurrence outside 006's prose is 006's own AC-005 (finding 12).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Assuming the four-mark verdict vocabulary spreads across the series.** Tried: take iteration 2's inference that 002 to 005 each inherit it. Failed on one grep: the only occurrence outside 006's prose is 006's own AC-005 (finding 12).

### **Blame the hook for the 33.** The hook captured all 35 records (`sources: {"hook":30}` at 002's measurement, hook+capture for the rest); the failure is entirely downstream, at consumption. Capture is not the defective stage here. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Blame the hook for the 33.** The hook captured all 35 records (`sources: {"hook":30}` at 002's measurement, hook+capture for the rest); the failure is entirely downstream, at consumption. Capture is not the defective stage here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Blame the hook for the 33.** The hook captured all 35 records (`sources: {"hook":30}` at 002's measurement, hook+capture for the rest); the failure is entirely downstream, at consumption. Capture is not the defective stage here.

### **Blaming 006 alone for the verdict mismatch.** Tried: classify DEVIATION/N/A as 006 inventing marks. Failed: 065's parent already logged it and assigned the correction to 043/006, so it is a shared, known, unresolved seam rather than a unilateral error. It is still unowned in practice. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Blaming 006 alone for the verdict mismatch.** Tried: classify DEVIATION/N/A as 006 inventing marks. Failed: 065's parent already logged it and assigned the correction to 043/006, so it is a shared, known, unresolved seam rather than a unilateral error. It is still unowned in practice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Blaming 006 alone for the verdict mismatch.** Tried: classify DEVIATION/N/A as 006 inventing marks. Failed: 065's parent already logged it and assigned the correction to 043/006, so it is a shared, known, unresolved seam rather than a unilateral error. It is still unowned in practice.

### **Reading 065 as an implementation dependency only.** Tried: treat the runner as an opaque command and check only that 006's stages call it. Failed: the format is a closed key set, so 006's stage semantics are constrained by `turns[].check` and `env` at authoring time, not at run time. The dependency is a design-time coupling. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Reading 065 as an implementation dependency only.** Tried: treat the runner as an opaque command and check only that 006's stages call it. Failed: the format is a closed key set, so 006's stage semantics are constrained by `turns[].check` and `env` at authoring time, not at run time. The dependency is a design-time coupling.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading 065 as an implementation dependency only.** Tried: treat the runner as an opaque command and check only that 006's stages call it. Failed: the format is a closed key set, so 006's stage semantics are constrained by `turns[].check` and `env` at authoring time, not at run time. The dependency is a design-time coupling.

### **Reading pending from the decision record instead of the queue.** `pendingRecords` never opens a decision record; the only cross-check between record and log is the writer's own id-reuse during a save. Any theory that pending is computed by parsing records is ruled out by the code. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:334] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Reading pending from the decision record instead of the queue.** `pendingRecords` never opens a decision record; the only cross-check between record and log is the writer's own id-reuse during a save. Any theory that pending is computed by parsing records is ruled out by the code. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:334]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading pending from the decision record instead of the queue.** `pendingRecords` never opens a decision record; the only cross-check between record and log is the writer's own id-reuse during a save. Any theory that pending is computed by parsing records is ruled out by the code. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:334]

### **Splitting 004's cross-runtime nudge into a new child.** Tried: read REQ-006 as a separate operator-surface change with its own evidence. Failed: it is the same Stop hook 001 shipped, widened by runtime, and its evidence is still a nudge count in 006's matrix — no independent artifact, so no child (finding 18, finding 20b). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Splitting 004's cross-runtime nudge into a new child.** Tried: read REQ-006 as a separate operator-surface change with its own evidence. Failed: it is the same Stop hook 001 shipped, widened by runtime, and its evidence is still a nudge count in 006's matrix — no independent artifact, so no child (finding 18, finding 20b).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Splitting 004's cross-runtime nudge into a new child.** Tried: read REQ-006 as a separate operator-surface change with its own evidence. Failed: it is the same Stop hook 001 shipped, widened by runtime, and its evidence is still a nudge count in 006's matrix — no independent artifact, so no child (finding 18, finding 20b).

### **Treating `consumed.jsonl` as a verifiable mapping.** It stores no answer text, so it cannot be validated after the fact. Any later iteration planning verification around that file must build the evidence itself. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating `consumed.jsonl` as a verifiable mapping.** It stores no answer text, so it cannot be validated after the fact. Any later iteration planning verification around that file must build the evidence itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `consumed.jsonl` as a verifiable mapping.** It stores no answer text, so it cannot be validated after the fact. Any later iteration planning verification around that file must build the evidence itself.

### **Treating 006's results matrix and 006's stages as interchangeable carriers of sibling evidence.** Tried: read REQ-011 as licence for siblings to add stages and matrix rows together. Failed: no sibling adds a stage, and AC-005 fixes the file at 13 rows, so the two mechanisms are mutually exclusive in practice (finding 11). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Treating 006's results matrix and 006's stages as interchangeable carriers of sibling evidence.** Tried: read REQ-011 as licence for siblings to add stages and matrix rows together. Failed: no sibling adds a stage, and AC-005 fixes the file at 13 rows, so the two mechanisms are mutually exclusive in practice (finding 11).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating 006's results matrix and 006's stages as interchangeable carriers of sibling evidence.** Tried: read REQ-011 as licence for siblings to add stages and matrix rows together. Failed: no sibling adds a stage, and AC-005 fixes the file at 13 rows, so the two mechanisms are mutually exclusive in practice (finding 11).

### **Treating the missing `checkpoints.tsv` as a 065 gap.** Tried: propose 065 emit it. Failed: 065's evidence contract is complete for its own purpose (per-runtime verdicts), and a decision-capture stage table is 006's private data shape. The gap is 006 not declaring the derivation, not 065 withholding a file. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating the missing `checkpoints.tsv` as a 065 gap.** Tried: propose 065 emit it. Failed: 065's evidence contract is complete for its own purpose (per-runtime verdicts), and a decision-capture stage table is 006's private data shape. The gap is 006 not declaring the derivation, not 065 withholding a file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the missing `checkpoints.tsv` as a 065 gap.** Tried: propose 065 emit it. Failed: 065's evidence contract is complete for its own purpose (per-runtime verdicts), and a decision-capture stage table is 006's private data shape. The gap is 006 not declaring the derivation, not 065 withholding a file.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **A global (all-session) pending sweep.** No code enumerates the queue directory; the sweeps all take one session id from one transcript/db. A "the sweep already shows everything" assumption is ruled out. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:214] (iteration 1)
- **Assuming a table-row match path exists behind a flag.** No flag, no branch, no regex reads a decisions-table row's text anywhere in the writer. This is a capability gap, not a misconfiguration — a candidate for reducer promotion to "Exhausted Approaches" so no later iteration re-searches for it. (iteration 1)
- **Blame the hook for the 33.** The hook captured all 35 records (`sources: {"hook":30}` at 002's measurement, hook+capture for the rest); the failure is entirely downstream, at consumption. Capture is not the defective stage here. (iteration 1)
- **Reading pending from the decision record instead of the queue.** `pendingRecords` never opens a decision record; the only cross-check between record and log is the writer's own id-reuse during a save. Any theory that pending is computed by parsing records is ruled out by the code. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:334] (iteration 1)
- **Treating `consumed.jsonl` as a verifiable mapping.** It stores no answer text, so it cannot be validated after the fact. Any later iteration planning verification around that file must build the evidence itself. (iteration 1)
- **Any assumption that S12 can be expressed in the same `json conversation` block.** Two independent constraints close it (one `env` per script; second block invalid). No variation of the stage wording reopens it. Candidate for reducer promotion to "Exhausted Approaches" so no later iteration re-searches for a per-turn env hook. (iteration 2)
- **Any assumption that the runner writes per-stage rows.** The evidence list is exhaustive by enumeration and contains no stage verdict file. Same promotion candidate. (iteration 2)
- **Blaming 006 alone for the verdict mismatch.** Tried: classify DEVIATION/N/A as 006 inventing marks. Failed: 065's parent already logged it and assigned the correction to 043/006, so it is a shared, known, unresolved seam rather than a unilateral error. It is still unowned in practice. (iteration 2)
- **Reading 065 as an implementation dependency only.** Tried: treat the runner as an opaque command and check only that 006's stages call it. Failed: the format is a closed key set, so 006's stage semantics are constrained by `turns[].check` and `env` at authoring time, not at run time. The dependency is a design-time coupling. (iteration 2)
- **Treating the missing `checkpoints.tsv` as a 065 gap.** Tried: propose 065 emit it. Failed: 065's evidence contract is complete for its own purpose (per-runtime verdicts), and a decision-capture stage table is 006's private data shape. The gap is 006 not declaring the derivation, not 065 withholding a file. (iteration 2)
- **Any assumption that the writer scenario's `git status` proves the real repository was untouched.** `--untracked-files=no` over a gitignored state directory cannot fail on the write it names (finding 8). Do not build later verification on that command. (iteration 3)
- **Any attempt to make the playbook scenarios cover the consumption loop by adding a command.** The scenarios' contract is "run these commands, observe the signals"; the loop spans a save, a queue and a nudge across turns. A single-command assertion of it would be a worse 006, so the playbook should be corrected down to what it proves (a PASS on the record write) and the loop asserted in 006. Promotion candidate for "Exhausted Approaches". (iteration 3)
- **Assuming the four-mark verdict vocabulary spreads across the series.** Tried: take iteration 2's inference that 002 to 005 each inherit it. Failed on one grep: the only occurrence outside 006's prose is 006's own AC-005 (finding 12). (iteration 3)
- **Splitting 004's cross-runtime nudge into a new child.** Tried: read REQ-006 as a separate operator-surface change with its own evidence. Failed: it is the same Stop hook 001 shipped, widened by runtime, and its evidence is still a nudge count in 006's matrix — no independent artifact, so no child (finding 18, finding 20b). (iteration 3)
- **Treating 006's results matrix and 006's stages as interchangeable carriers of sibling evidence.** Tried: read REQ-011 as licence for siblings to add stages and matrix rows together. Failed: no sibling adds a stage, and AC-005 fixes the file at 13 rows, so the two mechanisms are mutually exclusive in practice (finding 11). (iteration 3)

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
- Carried nuance from Q2: whether 002 refuses a match when two sessions captured the same question with different answers — a table row holds one answer, so a second, different answer must not be marked consumed under it. Not stated in 002's plan. (iteration 1)
- Q3: Should any of the planned children 002 to 005 be changed, merged, split, re-ordered or planned differently, and is any follow-up missing? (iteration 2) (iteration 1)
- Q5: Do the three decision-capture playbook scenarios prove what 001 claims, and what must the 006 conversation scenario assert that they do not? (iteration 3) (iteration 1)
- Q4: How does 006 depend on the shared conversation runner in `specs/sk-doc/065-conversation-playbook-scenarios`, and is the contract between them right and complete? (iteration 3) (iteration 1)
- No question from the packet's five-key-question set remains unanswered. (iteration 3)
- **Carried nuance from Q2, still open:** whether 002 refuses a match when two sessions captured the same question with different answers. Finding 15 records the gap and the one-line fix; 002's plan does not yet state it. Not a separate question — a change to 002. (iteration 3)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Continuity ladder: no `handover.md` and no root `implementation-summary.md` (phase parent). `spec.md` and `decision-record.md` read at init.

- The series parent (`spec.md`) says 001 is Complete and lists four Known Limitations closed by 002 to 005: hand-written decision tables never matched (answers stay pending, the Stop hook keeps nudging); Codex and Pi capture nothing; OpenCode and Devin read only at save time, with no real sample of OpenCode's newest layout; a chat question counts only when it ends the assistant message. 001's playbook evidence was fixture-based single-prompt testing.
- Operator decisions Q001 to Q004 (`decision-record.md`): series parent layout; separate goals; prove capture in a live, timed, multi-turn orchestrator-vs-test-subject conversation and re-prove 002 to 005 with it; 006 runs on the shared runner that extends sk-create-manual-testing-playbook (planned in `specs/sk-doc/065-conversation-playbook-scenarios`) and builds none of its own.
- Phase transition rule: children 002 to 005 close only after the 006 scenario re-proves them; the 006 Claude Code row runs first once 065 ships the runner.
- Open question in spec.md: queue record 12 (session-relaunch child-guard answer) has no row in any decision record; 002 plans to record it in 001's decision-record.md.

### Bounded Context Snapshot

- Source pointers: `.skilled/hooks/decision-capture/lib/capture-core.mjs`, `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs`, `.skilled/hooks/decision-capture/bin/sweep-transcript.mjs`, `sweep-opencode.mjs`, `sweep-devin.mjs` (each with a `.test.mjs`), `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` (781 lines), `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` (Stop-hook nudge), `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts` (save wiring), `.skilled/commands/speckit/save.md`, `.skilled/skills/system-spec-kit/references/memory/save-workflow.md`.
- Tests: `.skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts`, `save-continuity-write.vitest.ts`, `.skilled/skills/system-spec-kit/runtime/tests/hook-session-stop.vitest.ts`.
- Playbook scenarios: `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-claude-hook.md`, `decision-capture-transcript-sweeps.md`, `decision-capture-save-writer.md`.
- Registration: `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, `.skilled/hooks/README.md`, `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/operator-decision-capture.md`.
- Packet docs: children `001-decision-capture-build/` (spec, plan, tasks, decision-record, implementation-summary, acceptance-criteria, timeline) and `002-` to `006-` (spec, plan, tasks, acceptance-criteria, goal).
- 065 packet (read-only): `specs/sk-doc/065-conversation-playbook-scenarios/` with children `001-scenario-contract/` and `002-conversation-runner/`.
- Constraints: read-only research; a sibling run researches 065 in parallel, so never write there.
- Resource map: resource-map.md not present; skipping coverage gate.
- Prior-work ripgrep recipe over the full topic string: no prior work (its only hit is this strategy file).

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 3 (stop policy: max-iterations)
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes (executor timeout 1800s)
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
- Started: 2026-11-01T21:42:07.374Z
- Executor: cli-pi, deepseek-v4.1-flash-1017 via llmgateway, --thinking max
