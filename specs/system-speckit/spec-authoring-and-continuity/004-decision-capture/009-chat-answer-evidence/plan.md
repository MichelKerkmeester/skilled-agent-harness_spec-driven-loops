---
title: "Implementation Plan: Phase 9: chat-answer-evidence"
description: "Adds one deterministic evidence object to every chat candidate in the shared detector, so all five sweeps print it, and rewrites save.md's chat rule to read that evidence and copy it into each chat entry's why. Proof is two layers: a node test that pins the evidence on the 7-pair fixture, and three scripted saves in a scratch project that must each write one entry, for pair 6."
trigger_phrases:
  - "chat answer evidence plan"
  - "chat evidence lexicon"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: chat-answer-evidence

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`), Markdown command docs |
| **Framework** | None |
| **Storage** | None new. Candidates are printed, not stored; the decision record stores the `why` sentence |
| **Testing** | `node --test`; three scripted saves in a scratch project |

### Overview
One new function in `lib/chat-questions.mjs` computes five fields from a candidate's question and answer, and the detector attaches the result as `evidence`. Every sweep calls this detector, so Claude, OpenCode, Devin, Codex and Pi all print it with no sweep change. `save.md`'s chat rule then tells the model to read the evidence and to end each chat entry's `why` with a fixed-form `Evidence:` sentence, so the stored record shows what the judgment saw.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: 008's acceptance criteria all read Met (`rg -c '\| Unmet \|' ../008-project-scoped-state/acceptance-criteria.md` prints nothing)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/hooks/decision-capture/{lib,bin,claude,devin}/*.test.mjs` reports `fail 0` with more tests than the baseline 107, and the Pi vitest and the OpenCode plugin test report no failure
- [ ] Three scripted scratch saves each print `chat_rows=1 pair6=1`
- [ ] `validate.sh specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/009-chat-answer-evidence --strict` prints RESULT: PASSED
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Evidence, not verdict. The detector describes each reply; the save model still decides.

### Key Components
- **`answerEvidence(question, options, answer)` in `lib/chat-questions.mjs`**: a pure function that returns the five fields, or `null` when `answer` is null. `chatCandidates` calls it once per candidate it pushes, and the candidate object gains `evidence` as its last key.
- **`save.md` step 3 chat rule**: reads the evidence, keeps the judgment with the model, and writes the `Evidence:` sentence into `why`.

### Field definitions

All matching lowercases the text first. A word is a run of `[a-z0-9']`. A content word is a word of 3 or more characters, with any `'` suffix cut, that is not in STOPWORDS.

| Field | Rule |
|-------|------|
| `questionType` | `numbered_list` when the question has 2 or more lines that start with `<digits>.` or `<digits>)` and contains a `?`. Else `alternative` when it has lettered options (the existing `OPTION_LINE`) or any ask sentence (text after the last `.`, `!`, `:` or newline, up to a `?`, with inline code replaced by a placeholder word) contains the word `or`. Else `yes_no` when any ask sentence opens with a word from AUXILIARIES. Else `open_value`. |
| `optionMatch` | `not_applicable` for `numbered_list` and `open_value`. For `yes_no`: `true` when the answer opens with a word from YES_NO. For `alternative`: `true` when the answer is a lone letter `A` to `D` matching a lettered option, or shares a content word with an offered option (a lettered label, or one side of an `or` in an ask sentence taken from the raw question, inline code kept). Otherwise `false`. |
| `contentOverlap` | The number of distinct content words the answer shares with the question. |
| `imperativeOpening` | Strip a leading list marker (`<digits>` then `:`, `.` or `)`), then skip words in FILLERS. `true` when the next word matches IMPERATIVE_VERBS and the word after it is not in ANAPHORS. |
| `topicShift` | `true` when a phrase in SHIFT_PHRASES appears as whole words within the answer's first five words. |

### Lexicons

These ship as frozen constants in `lib/chat-questions.mjs`. A change to one is a change to this plan.

- **STOPWORDS**: a an the and or but if then so of to in on at by for with from as into about over this that these those it its is are was were be been being am do does did done doing have has had having will would shall should can could may might must not no yes yeah yep ok okay sure please i me my we our us you your he she they them their what which who whom when where why how all any each some more most other such only own same than too very just also there here now up out off again once one two three wasn isn aren don doesn didn won wouldn shouldn couldn. Plus the choice verbs use keep make pick choose take want need like try get go let, because they appear on both sides of a choice without carrying it ("use `Skilled`", "use the darker one").
- **IMPERATIVE_VERBS** (new-task verbs; `*` marks a stem matched as a prefix): `analy*`, `ask`, `audit`, `check`, `debug`, `do`, `explain`, `fix`, `investigat*`, `look`, `research`, `review`, `run`, `summari*`. The `analy*` stem tolerates the fixture's misspelt `Analyxe` (line 2). Verbs that usually approve the question's own action stay out: make, use, push, commit, build, start, continue.
- **FILLERS** (skipped before the opening verb): please ok okay so now then actually first just also and.
- **ANAPHORS** (an imperative followed by one of these approves, it does not start new work: "Do it", "Push it"): it that this so them.
- **SHIFT_PHRASES**: actually, instead, let's, lets, let us, by the way, btw, never mind, nevermind, forget that, forget it, unrelated. A bare `first` is not a marker, because "First, make it blue" is a valid answer.
- **AUXILIARIES**: is are was were do does did should shall can could will would may might has have had.
- **YES_NO**: yes yeah yep sure ok okay no nope correct right.

### Expected fixture values

A planning probe in the session scratchpad applied these rules to the 7-pair fixture and to the edge cases. The implementation must reproduce these values; they are the outcome test's oracle.

| Pair | Reply (fixture line) | questionType | optionMatch | contentOverlap | imperativeOpening | topicShift | Label |
|------|----------------------|--------------|-------------|----------------|-------------------|------------|-------|
| 1 | `Analyxe whay were doing in other session` (2) | yes_no | false | 0 | true | false | non-answer |
| 3 | `Do 3 iters of deep review ...` (6) | alternative | false | 0 | true | false | non-answer |
| 6 | `1: make 12 hours if idle,, 2: sure, ...` (12) | numbered_list | not_applicable | 3 (idle, recommend, building) | false | false | answer |
| 7 | `ask fresh opus high to review` (14) | numbered_list | not_applicable | 0 | true | false | non-answer |

| Question | Reply | Expected evidence |
|----------|-------|-------------------|
| Should the badge be blue or amber? | actually first fix the login bug | alternative, false, 0, true, true |
| Which colour should the badge be? | make it blue | open_value, not_applicable, 0, false, false |
| Should the badge be blue or amber? | use the darker one | alternative, false, 0, false, false |
| Should the badge be blue or amber? | First, make it blue | alternative, true, 1, false, false |
| Should I push to main? | Push it | yes_no, false, 1, false, false |
| Should I push to main? | Yes | yes_no, true, 0, false, false |

### The save rule

`save.md:72-73` is replaced by wording that says, in this order: each chat candidate carries `evidence`; read it before judging; a reply that opens with a new task or a topic shift, shares no content word with the question and names no offered option usually starts new work rather than answering; `optionMatch: not_applicable` is no evidence against an answer; the evidence informs the judgment and never replaces it, so write an entry only for a question the reply answers. Every chat entry's `why` ends with `Evidence: <questionType>, option <optionMatch>, overlap <n>, imperative <true/false>, shift <true/false>.`, after the stated reason, or after `Not stated.` when none was given. Pending tool answers carry no evidence and are unchanged.

### Data Flow
Transcript, then the sweep's turns, then `chatCandidatesFromTurns`, which now attaches `evidence`, then the sweep's printed `chat_candidates`, then the save model, then `operatorDecisions[].why`, then the decision record's Why column. Nothing new is written to the queue or the consumed log.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/chat-questions.mjs` `chatCandidates` | Sole producer of chat candidates | update: attach `evidence` | `chat-questions.test.mjs` per-field cases |
| `sweep-transcript.mjs`, `sweep-codex.mjs`, `sweep-devin.mjs`, `sweep-opencode.mjs`, `sweep-pi.mjs` | Print the detector's candidates as `chat_candidates` | unchanged; they pass the object through | Their suites pass; `rg -n chatCandidatesFromTurns .skilled/hooks/decision-capture/bin` lists the five |
| `sweep-transcript.test.mjs:183-192`, `chat-questions.test.mjs:25` | Deep-equal the whole candidate | update: add `evidence` | Both pass |
| `sweep-devin.test.mjs`, `sweep-opencode.test.mjs`, `sweep-pi.test.mjs`, `sweep-codex.test.mjs` | Assert `[]` or a length | unchanged | Their suites pass unedited |
| `save.md` step 3 | The only decision rule | update | `rg -n 'questionType\|Evidence:' .skilled/commands/speckit/save.md` |
| `decision-record-writer.ts`, input normalizer, session types | Store `why` as given | not a consumer of `evidence`; `why` is already free text | Writer vitest unchanged and passing |
| `feature-catalog/ux-hooks/operator-decision-capture.md` | Describes chat candidates | update | `rg -n evidence` on the page |
| `save-workflow.md:253` | Names the sweeps, not the candidate shape | unchanged | Read during implementation |

Inventories run for this plan:
- Same-class producers: `rg -n 'chatCandidatesFromTurns' .skilled/hooks` lists one producer and five sweep callers.
- Consumers: `rg -n 'chat_candidates|chat candidate' .skilled/commands .skilled/skills/system-spec-kit/references .skilled/skills/system-spec-kit/feature-catalog` lists `save.md:65-72`, `save-workflow.md:253` and the catalog page.
- Matrix axes: `questionType` (4 values) by reply shape (option named, yes/no word, new-task verb, anaphor after verb, shift phrase, filler before verb, empty). The unit cases in `tasks.md` T006 cover each value and each shape at least once.
- Invariant: the evidence is a pure function of question, options and answer, and adding it changes no key, count or order.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the baselines and runs three baseline scratch saves. Implementation adds the evidence, the tests, the fixture and the save wording. Verification reruns the suites and three scratch saves.

Code changes go to an implementation worker per parent goal D6: `gpt-6-luna` at reasoning `xhigh` on service tier `fast` through cli-codex, one change per brief. When Luna's quota is used up, the fallback is `llmgateway/deepseek-v4.1-flash-1017` at thinking `max` through cli-pi. Luna never runs through a gateway. The orchestrator reviews each diff and runs the suites itself.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `answerEvidence` per field and per edge case in "Expected fixture values" | `node --test .skilled/hooks/decision-capture/lib/chat-questions.test.mjs` |
| Integration | The fixture through the Claude sweep CLI: each candidate's evidence equals the table | `node --test .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs` |
| Manual | Three scripted full-auto saves of the fixture in a scratch project, before and after | `claude -p` in the scratch project; a row count on its `decision-record.md` |

### How the outcome is proven

The research asks that the three non-answers produce no entry and pair 6 produces one. Two layers prove it, and each states its limit.

1. **Deterministic, in CI.** The fixture test asserts the exact evidence above for all four candidates. It proves the save wording's named pattern (new-task opening, zero overlap, no option named) holds for pairs 1, 3 and 7 and fails for pair 6, on every run. It cannot prove a model follows the wording.
2. **Scripted save, live.** In a scratch project outside this repository, set up like 006's mirror root (parent D4), a scratch packet holds an empty `decision-record.md`. A headless Claude Code run (`claude -p`) performs `save.md` step 3 against that packet with `--full-auto`, running `sweep-transcript.mjs --transcript <fixture>` in place of the session's own transcript. A shell check then prints `chat_rows=<n> pair6=<0|1>` from the record. It runs three times on the pre-change code (baseline) and three times after. Pass is `chat_rows=1 pair6=1` on all three after-runs, with the `Evidence:` sentence in the row's Why. It proves this model, with this wording, made the right call three times out of three on this fixture. It cannot prove the call on other models, other phrasing or real sessions, and with n=3 it cannot give an error rate.

A third option, a decision function in code that the test calls, was rejected: it would be the reject filter this phase defers, under another name.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 008-project-scoped-state | Internal | Yellow (planned) | 009 waits; its scratch saves need the final queue path |
| cli-codex with `gpt-6-luna` | External | Green | Fallback `llmgateway/deepseek-v4.1-flash-1017` through cli-pi, per parent D6 |
| Claude Code CLI (`claude -p`) for the scratch saves | External | Green | REQ-005 cannot be proven; the deterministic layer still holds, and the row stays Unmet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a save drops a chat answer the operator gave, or the scratch saves write fewer entries after the change than in the baseline.
- **Procedure**: revert the phase commit. No stored format changes: decision rows written with an `Evidence:` sentence stay valid text in the Why column, and the queue and consumed log need no migration.
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
| Setup | 008 closed; baselines recorded | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close-out and 010 |
<!-- /ANCHOR:phase-deps -->

---

