---
title: "Feature Specification: Phase 21: goal-scan-large-log"
description: "A Claude session log over the 16 MB tail cap carries no packet goal when the tail holds no goal entry, although the log may hold one earlier. Long sessions are the ones that hop, and they are the ones this rule drops."
trigger_phrases:
  - "goal scan large log"
  - "phase 21 goal scan large log"
  - "claude goal log tail cap"
  - "packet goal fallback over 16 MB"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 21: goal-scan-large-log

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | Not chosen yet. The operator picks a worktree or the current branch before the build |
| **Parent Spec** | ../spec.md |
| **Phase** | 21 of 23 |
| **Predecessor** | 020-question-guard-killer-gone |
| **Successor** | 022-stop-park-notices |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 021-goal-scan-large-log --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 21** of the hop dialog, goal and title specification, opened by the whole-epic review of 2026-11-14.

**Scope Boundary**: `latestGoalLogEntry` and one new bounded read helper in `lib/relaunch-core.cjs`, two tests in `tests/relaunch-core.test.cjs`, one comment and one sentence of `session-relaunch/README.md`. The Claude goal reader only. No other runtime, no relaunch record key and no new log event.

**Dependencies**:
- Phase 2 built the packet goal fallback and the `whole` flag this phase extends.
- Phase 10 added the ended-goal mark, which makes an old goal entry decisive rather than merely missing.
- Phase 11 bounded the fallback to the note's folder and its parent. That bound does not change.
- The table around the tail cap is pinned by `resolveGoalPacket leaves an ended or unreadable Claude goal uncarried` at `tests/relaunch-core.test.cjs:2850`.

**Deliverables**:
- A capped tail that still answers from the tail when it holds a goal entry.
- A bounded front-to-back scan of the earlier bytes when the capped tail holds none, with the newest entry found and `whole: true`.
- A big log with no goal entry at all that reaches the packet goal fallback.
- A big log whose only goal entry sits before the tail cap that still ends the goal.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`latestGoalLogEntry` widens the tail from 256 KiB up to `GOAL_LOG_MAX_TAIL_BYTES`, which is 16 MB (`lib/relaunch-core.cjs:61`), and then returns `whole: false` when the capped read holds no goal entry (`:590`). `claudeGoalPacketResult` reads `whole` as "no goal was ever set" and refuses the fallback when it is false (`:687`). A Claude log over 16 MB whose last 16 MB holds no goal entry therefore carries no packet, even when the session never set a goal and the note's packet has an unfinished one. Long sessions are the ones that reach the threshold, and the review measured 35 of 801 session logs over 16 MB on one account.

The comment above the cap says "a long session costs the same as a short one" (`:58` to `:59`). That holds for the read, and it now costs the session its goal.

### Purpose
A capped tail that holds no goal entry is followed by a front-to-back scan of the bytes before it, in fixed chunks, so the newest goal entry anywhere in the log counts and a whole read is reported as whole. A log with no goal entry anywhere reaches the packet goal fallback. An ended goal that sits before the tail cap still ends the goal.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-14 at commit `fa6a56f0fc`. The first command shows the cap and the refusal. The second shows the assertion that pins the partial read. The third shows the comment that the cap keeps a long session cheap.

```text
$ rg -n -o "if \(!whole\) return none|GOAL_LOG_MAX_TAIL_BYTES = 16 \* 1024 \* 1024" .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
61:GOAL_LOG_MAX_TAIL_BYTES = 16 * 1024 * 1024
687:if (!whole) return none
exit=0

$ rg -n -o "a log read only in part" .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs
2876:a log read only in part
2944:a log read only in part
exit=0

$ rg -n "so a long|session costs the same" .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
58:// The packet a Claude goal names is read from a bounded tail of the session log, so a long
59:// session costs the same as a short one.
exit=0
```

The cap and the refusal sit at lines 61 and 687. Two assertions in two tests pin the partial read, one for the packet fallback and one for the claimed-note mark. The comment at lines 58 and 59 states the cost rule.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one constant for the scan chunk size, 64 KiB, beside the two tail constants.
- Extract the per-line goal parse into one helper that both the tail loop and the new scan call, so a line is read the same way wherever it sits.
- Return the tail's start offset from `readLogTail` so the scan knows where the unread bytes end.
- When the capped tail holds no goal entry, read the bytes before it from offset 0 in fixed chunks, keep a remainder across chunk boundaries, parse only lines that contain `goal`, and return the newest entry found with `whole: true`.
- Keep the existing behavior when the tail holds an entry, when the log fits the cap and when the log cannot be read.
- Correct the comment above the cap and the sentence on a large log in `session-relaunch/README.md`.
- Change the assertion at `tests/relaunch-core.test.cjs:2876`, correct the comment above the assertion at `:2944`, and add the ended-goal case before the cap.

### Out of Scope
- A different tail size or cap. The 256 KiB first read and the 16 MB cap are unchanged.
- The fallback bound to the note's folder and its parent, the claimed-last mark and the ended-goal note field. Phase 11, 10 and 16 own them.
- A streaming parser or a new module. The scan is a loop over fixed buffers in the file that already owns the reader.
- Reading another runtime's log. Pi, OpenCode, Devin and Cursor read a goal record, not a log.
- A live hop.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | The scan chunk constant, the shared line parse, the tail start offset, the bounded head scan and the corrected comment |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | The partial-read assertion becomes a whole-read fallback, an old ended goal is added, and the second test's comment is corrected |
| `.skilled/hooks/session-relaunch/README.md` | Modify | The sentence on a log too large for the tail names the whole read and the entry that still counts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Given a log of 17 one-MB filler lines with no goal entry, When `resolveGoalPacket` runs for a Claude sender with an unfinished packet goal, Then it returns that packet. The changed assertion fails before the edit, when it returns an empty string, and passes after. |
| REQ-002 | Given a log whose only goal entry is an ended goal before the last 16 MB and whose tail is filler, When `resolveGoalPacketResult` runs, Then it reports `ended: true` and no packet. The new assertion fails before the edit, when the partial read reports `ended: false`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Given a log that fits the tail, or one whose tail holds a goal entry, When the reader runs, Then it reports what it reports today, including `whole: false` for a tail that was read in part and holds an entry. |
| REQ-004 | The head scan holds one fixed buffer plus the longest line that crosses a chunk boundary. It parses only lines that contain `goal`, it reads no byte twice, and a line that straddles the tail start is joined with the tail's first partial line before it is parsed. |
| REQ-005 | The relaunch and OpenCode plugin suites pass at the final state with the baseline count, because the changed test adds none. |
| REQ-006 | The comment above the cap and the README sentence describe the whole read. No module, record key or log event is added, and no added code comment names a packet, phase, task or finding number. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows both changed assertions failing before the source edit, and `scratch/green.txt` shows them passing after.
- **SC-002**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='ended or unreadable Claude goal' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with `fail 0`.
- **SC-003**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with the baseline count.
- **SC-004**: `validate.sh 021-goal-scan-large-log --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `readLogTail` returns the start offset | The scan cannot tell which bytes are unread | The offset is added to the existing return, and the one caller uses it |
| Risk | A very large log makes the scan slow on the one hop that needs it | A slow prepare at the context limit | The scan reads only the bytes before the capped tail, in 64 KiB buffers, and only after the tail holds no goal entry |
| Risk | A line longer than the chunk grows the remainder | Memory is not fixed for that line | The buffer stays fixed and the remainder is one line, which is the same bound the tail read already accepts |
| Risk | A goal entry is counted twice | The newest entry is misread | The scan ends at the tail start and the tail begins there, so no byte is read twice |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The scan runs only when a log is over 16 MB and its capped tail holds no goal entry. It reads the bytes before the tail once.
- **NFR-P02**: Memory holds one 64 KiB buffer plus the longest line that crosses a chunk boundary.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The scan reads the same session log the reader already opens. It writes nothing and prints nothing.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A log that cannot be opened still throws and is handled by the caller's existing catch.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a log under the cap is read whole on the first pass, as it is today.
- Maximum input: a log of several GB is read once in 64 KiB buffers, with no byte held beyond the buffer and one line.
- Failure path: a read that throws escapes `latestGoalLogEntry` as it does today, and the caller keeps the claimed-note mark.
- Boundary: a goal entry that starts in the last byte of a chunk is joined with its remainder before it is parsed.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One reader, one helper, one constant and two tests |
| Risk | 8/25 | The read path decides whether a goal is carried |
| Research | 5/20 | One finding with a code path and a measured rate |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- How many Claude logs exceed 16 MB? The review measured 35 of 801 on one account. The rate is not a rule and the fix does not depend on it.
- Does a goal entry ever sit before the tail in a log whose tail holds another? Then the tail answers and the scan does not run, so the newest entry in the tail is the one that counts. That matches the goal's own order.
<!-- /ANCHOR:questions -->

---
