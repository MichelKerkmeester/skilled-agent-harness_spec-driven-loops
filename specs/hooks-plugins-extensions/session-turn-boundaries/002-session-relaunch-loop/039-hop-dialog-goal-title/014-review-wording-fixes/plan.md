---
title: "Implementation Plan: Phase 14: review-wording-fixes"
description: "Correct one README sentence, three code comments and the handoff command document so they say what the relaunch code does, and record one limit of the ended-goal mark. Each text is confirmed against the code or a test before it changes."
trigger_phrases:
  - "review wording fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: review-wording-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, and comment lines in JavaScript (CommonJS and ES modules) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `rg` searches for each text, `node --check`, and the existing `node:test` suites as a no-change proof |

### Overview
Six texts change and no line that runs. Each wrong text is first confirmed against the code, and the Stop comment against five existing tests, because the orchestrator confirmed its wording and not the behavior behind it. The handoff command document is edited last, on a tree that holds `main`, because `main` changed the same paragraph. The proof is a search that no longer finds each wrong phrase, a check that the code files changed in comment lines only, and the whole relaunch and OpenCode plugin run at the baseline count.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] `rg -c "no packet in the note's lineage|an empty one for a record|stays pending for the next Stop" .skilled/hooks/session-relaunch` prints four files with five matches in total before the first edit

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `rg -n "no packet in the note's lineage|an empty one for a record|stays pending for the next Stop" .skilled/hooks/session-relaunch` prints one line, the note on the background-task path at `tests/claude-adapters.test.cjs:708`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Text follows code.

### Key Components
- **The README sentence at line 309**: tells a reader where a missing `Goal packet:` line comes from. Without the change it sends the reader to the whole lineage.
- **The comment in `readRelaunchFile` (`relaunch-core.cjs:1299`)**: explains why a record with no `handoff` string is read as absent. Without the change it names a writer that does not exist.
- **The comment in `armPendingRecord` (`stop-arm.mjs:132`) and the test note at `claude-adapters.test.cjs:959`**: explain what happens to a record Stop could not arm for lack of a transcript path. Without the change they promise a retry that a typed prompt now cancels. The note at `claude-adapters.test.cjs:708` uses the same words for the background-task path, where they are true.
- **The frontmatter paragraph of the handoff command document (lines 127 to 131)**: tells a model which note fields it must not write. Without the change it names one of the two.
- **Known Limitations in the summary of phase 10**: without the change it omits the session id.

### Data Flow
None. No value moves differently. The texts change and the code beside them stays as it is.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `README.md:309` | Troubleshooting line for a missing goal packet | update | `rg -c "neither the note's spec folder nor its parent" .skilled/hooks/session-relaunch/README.md` prints 1 |
| `README.md:182`, the Claude row of the goal table | States the bound since phase 11 | unchanged | `rg -c 'no packet further up' .skilled/hooks/session-relaunch/README.md` prints 1 before and after |
| `relaunch-core.cjs:1299` to `:1301` | Comment above the `handoff` check | update | `rg -c 'an empty one for a record' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints nothing with exit 1 |
| `relaunch-core.cjs:1302`, the check itself | Reads a record only when `handoff` is a string | unchanged | `rg -n "typeof record.handoff === 'string'" .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints one line before and after |
| `stop-arm.mjs:132` to `:134` | Comment on the missing transcript path | update | `rg -c 'stays pending for the next Stop' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` prints nothing with exit 1 |
| `stop-arm.mjs:141` to `:143` | Comment on the background-task path | unchanged | A task that reports back does not withdraw the record, shown by the test `context-nudge keeps a deferred handoff when a background task reports back` |
| `claude-adapters.test.cjs:959` | Note inside the missing-transcript-path test | update | `rg -n 'stays pending for the next Stop' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` prints one line, which starts with `708:` |
| `claude-adapters.test.cjs:708` | Note inside the background-task test (`:683`), written by `5c0b9372d9` before phase 5 | unchanged | The same search still prints it. A task that reports back does not withdraw the record, so the next Stop does retry |
| `README.md:134` | Already says a prompt withdraws a deferred record | not a consumer | Read on 2026-11-14 |
| `handoff.md:127` to `:131` | Says which note fields the commands own | update | `rg -c 'goal_ended' .skilled/commands/speckit/handoff.md` prints 1 |
| `010-goal-ending-carry/implementation-summary.md` | Known Limitations of the ended-goal mark | update | `rg -c 'matched on the session id'` on that file prints 1 |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Generated index of trigger phrases, which `main` changed | rebuild when stale | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` exits 0 |

Required inventories:
- Same-class producers: `rg -n "no packet in the note's lineage|an empty one for a record|stays pending for the next Stop" .skilled .opencode specs/hooks-plugins-extensions --glob '!**/039-hop-dialog-goal-title/01[2-4]-*/**'` lists every copy of the three wrong phrases. On 2026-11-14 the code tree held five, in four files. Four are wrong. The fifth, at `tests/claude-adapters.test.cjs:708`, is right and stays.
- Consumers of changed symbols: no symbol changes.
- Matrix axes: the six texts, each with a search for the old phrase and a search for the new one.
- Algorithm invariant: for the three code files, every changed line of the first commit of this phase is a comment line, and the second commit changes none of them.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup takes the suite baseline, confirms each wrong text and runs the five tests behind the Stop comment. Implementation corrects the README, the three comments and the phase 10 summary and commits them with this phase's packet documents as the first commit, after the document commit of children 004 to 013. It then edits the handoff command document on the merged tree. That sentence and a rebuilt trigger index form the second commit. Verification runs the searches, the comment-only check, the whole relaunch and OpenCode plugin run, the index and mirror checks and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None added. A comment or a document has no test that can fail first | Not applicable |
| Integration | Five existing tests in `claude-adapters.test.cjs` run before the Stop comment changes: three that show each path stamps the record, one that shows a prompt withdraws a stamped record and one that shows a task that reports back does not | `node:test` |
| Manual | A search for each old and new phrase, and a read of each changed comment for a packet, phase or task number | `rg` |

The five tests run with `--test-name-pattern='marks the pending record deferred|withdraws a deferred handoff when the operator sends a prompt|keeps a deferred handoff when a background task reports back'` and must show 5 of 5, saved to `scratch/withdraw-tests.txt`. The whole suites run before the first edit and after the last, and the two counts must match.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The merge of `main` into this branch, done as `be56fabc7b` | External | Green | None. The operator answered "Merge before building (Recommended)", and `git merge-base --is-ancestor main HEAD` exits 0 |
| The document commit of children 004 to 013 | Internal | Yellow | The first commit of this phase waits for it, because the summary of phase 10 must be tracked before T010 |
| `generate-trigger-index.mjs --check` and `sync-runtime-mirrors.cjs --check` | Internal | Green | A stale index or mirror would not be seen after the merge |
| Node.js test runner, `git` and `rg` | Internal | Green | No test, commit check or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a relaunch test fails after the edit, or a corrected text is shown to be wrong.
- **Procedure**: revert the two commits of this phase. The first holds the wording fixes in the relaunch tree, the limitation in the summary of phase 10 and this phase's packet documents. The summary of phase 10 is tracked before that commit, because the documents of children 004 to 013 are committed first, so the revert takes out the one limitation row and leaves the file in place. The second holds the `handoff.md` sentence and the trigger index when it was rebuilt. Only texts and one generated file change, so no record, note or log format is affected. The merge of `main`, `be56fabc7b`, and the document commit of children 004 to 013 are separate commits and are not reverted with them.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The bound of phase 11, the stamp of phase 5 and the note field of phase 10 | Implementation |
| Implementation | The five tests at 5 of 5, and for the handoff command document the merge of `main` | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
