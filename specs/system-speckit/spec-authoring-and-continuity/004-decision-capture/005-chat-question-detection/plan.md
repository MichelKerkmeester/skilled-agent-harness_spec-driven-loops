---
title: "Implementation Plan: Phase 5: chat-question-detection"
description: "Extend the Claude transcript sweep so every asking paragraph in a text-only assistant message can become a chat candidate, capped at 3 per message and 20 per sweep, with a text-hashed key for each earlier paragraph. Proven with node:test cases, a redacted real-transcript fixture and the series' live-conversation harness."
trigger_phrases:
  - "chat question detection plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: chat-question-detection

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules (`.mjs`), built-in `node:crypto` for the hash |
| **Framework** | None |
| **Storage** | None new. The gitignored queue and consumed log under `.skilled/skills/.state/` are read as today. |
| **Testing** | `node:test`, run with `node --test` |

### Overview
`chatCandidate` in `sweep-transcript.mjs` becomes a function that returns a list: the closing-paragraph candidate exactly as today, plus one candidate per earlier asking paragraph. `chatSourceKey` in `capture-core.mjs` takes an optional fifth segment so the earlier candidates get their own stable keys. Unit tests, a redacted fixture built from the 7 baseline `earlier` pairs and a run in the `../006-live-conversation-test/` harness prove it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] `node --test .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs` prints `ℹ pass 10` and `ℹ fail 0` before the first edit.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs .skilled/hooks/decision-capture/lib/capture-core.test.mjs` prints `ℹ fail 0`, and `git diff` shows no change inside the ten existing sweep test bodies.
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Pure transcript scan. The sweep reads the transcript, computes candidates and prints them. The only file it writes is the existing queue append for recovered tool answers.

### Key Components
- **`chatCandidates` in `sweep-transcript.mjs`**: turns one text-only message and its typed reply into 0 to 3 candidates. The closing paragraph uses today's test and key. Each earlier paragraph uses the asking test, the options rule, the process filter and the hashed key.
- **`chatSourceKey` in `capture-core.mjs`**: builds `claude:SESSION:chat:QUESTION_TURN:ANSWER_TURN` as today, and appends a colon and the segment when a fifth argument is given.

### Data Flow
The sweep pairs each text-only assistant message with the next typed prompt, as today. It splits the message at blank lines. The closing paragraph is a candidate when it holds any `?`. An earlier paragraph is a candidate when a sentence ending in `?` survives the removal of fenced code, inline code, quoted spans, blockquote lines, table rows and headings. A following paragraph made only of lettered option lines joins it. Each candidate goes through `isProcessQuestion` with its own option labels, and consumed keys are removed. The rest are ranked (closing first, then candidates with options, then later before earlier), cut to 3 and printed in message order. After the last message, the sweep keeps the newest 20 and prints `chat_candidates_dropped`. At save time the session model reads each candidate and writes an entry only when the reply answers that question.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sweep-transcript.mjs` `chatCandidate`, `lastParagraph`, `sweepTranscript` | Producer of `chat_candidates` | update | New and existing cases in `sweep-transcript.test.mjs` |
| `capture-core.mjs` `chatSourceKey` | Key format for chat answers | update, with the four-argument form unchanged | One new case in `capture-core.test.mjs`. The existing consumed-key test passes. |
| `decision-record-writer.ts` | Reads `sourceKey` as an opaque string and checks `^[A-Za-z0-9:._-]+$` | unchanged | A test asserts every new key matches that pattern |
| `save.md` (`.skilled` and `.opencode` copies) | Tells the session model how to use `chat_candidates` | update, one sentence | `rg -c 'share one reply' .skilled/commands/speckit/save.md .opencode/commands/speckit/save.md` prints 1 for each |
| `sweep-opencode.mjs`, `sweep-devin.mjs` | Print an empty `chat_candidates` | not a consumer | Their tests pass unchanged |

Required inventories:
- Same-class producers: `rg -n 'chatSourceKey|lastParagraph|chat_candidates' .skilled --glob '*.mjs' --glob '*.md'` lists the sweep, its test, capture-core, the two other sweeps and `save.md`.
- Consumers of changed symbols: `rg -n 'chatSourceKey|chat_candidates_dropped' . --glob '*.ts' --glob '*.js' --glob '*.mjs' --glob '*.md' --glob '!specs/**'` shows only the files in the table above.
- Matrix axes: paragraph position (closing or earlier), asking signal (plain `?`, `?` only in code or quotes), options (none, in paragraph, next paragraph), process (yes or no), consumed (yes or no), answered (typed reply or end of file). Each axis value has one test row.
- Algorithm invariant: the closing candidate's key and text are byte-identical to today's, and an earlier candidate's key depends only on the session, the two turn ids and the question text.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup records the 10-pass baseline and builds the labelled fixture. Implementation adds the per-paragraph candidates, the key segment, the caps and the save-step sentence. Verification runs the tests, the fixture and baseline counts and the 006 live session.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

The gate command is `node --test .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs .skilled/hooks/decision-capture/lib/capture-core.test.mjs`, which must print `ℹ fail 0`.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `chatCandidates` and `chatSourceKey`: one row per matrix axis value, the per-message cap of 3, the session cap of 20 and two-sweep key stability | `node:test` |
| Integration | The sweep CLI on `fixtures/claude-chat-questions.jsonl` and on each baseline transcript, each run with `cwd` set to a fresh `mktemp -d` project, compared with `scratch/measure-chat-questions.mjs` | `node`, `jq` |
| Manual | A real multi-turn session where the subject asks a plain chat question in the middle of a message and the orchestrator answers as the human | `../006-live-conversation-test/` harness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node:crypto` SHA-256 | Internal (Node built-in) | Green | None. It ships with every supported Node. |
| `../006-live-conversation-test/` harness | Internal | Yellow, being created | Only the live re-proof waits. Every other criterion can be met. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a save writes a decision from a reply that did not answer its question, a key changes between two sweeps of one transcript, or a decision written before the change is offered again.
- **Procedure**: run `git revert` on the build commit. Keys with a `:p` segment that are already in the consumed log stay there and do no harm, because the old sweep never builds such a key. Decision entries already written stay valid.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation, because the fixture and its labels set the expected counts |
| Implementation | Setup | Verification |
| Verification | Implementation and the 006 harness for the live row | Closing this child |
<!-- /ANCHOR:phase-deps -->

---
