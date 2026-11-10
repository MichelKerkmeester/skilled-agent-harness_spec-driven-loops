---
title: "Feature Specification: Phase 2: table-row-matching"
description: "Captured operator answers stay pending when their decision already sits in a hand-written table row, because the writer only matches a source comment or an appendix item. This packet plans a read-only matcher that maps such answers to the existing row and records them as consumed, so the Stop hook stops nudging."
trigger_phrases:
  - "table row matching"
  - "phase 2 table row matching"
  - "hand-written decision table match"
  - "captured answers pending nudge"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: table-row-matching

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-decision-capture-build |
| **Successor** | 003-codex-and-pi-capture |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, and the matcher's refusal count for session `fe0c9990-06d3-454e-a8e7-7c7bc649bc49` is reported, with every refused record named with its reason. A record that is neither consumed nor a counted refusal blocks the handoff. "Pending = 0" alone is not the criterion, because a refusal is the safe outcome for an ambiguous answer. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the decision-capture series. The parent, `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture`, is a series parent: each child is a separate change to the same capture feature. Its child `001-decision-capture-build` is the finished build that captures answers, writes them at save time and nudges at session end.

**Scope Boundary**: Only the path from a captured answer to an existing hand-written table row. Capture, the writer's own match paths and runtime coverage stay as 001 shipped them.

**Dependencies**:
- The 001 build: `recordConsumedKeys` in `decision-record-writer.ts` and `pendingRecords` in `capture-core.mjs`.
- The orchestrator's write of records 29 and 30 into the series parent's record and the consumed log. The Measured Behavior block shows that log absent when this plan was written.
- `../006-live-conversation-test/`, the series harness that re-proves this child in a real conversation.

**Deliverables**:
- A read-only table matcher and a CLI that records matched answers as consumed.
- Tests on a redacted fixture copy of the real table.
- The real case closed: 27 answers mapped to Barter rows Q67 to Q93 and record 12 saved as a new row in 001.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The writer reuses an id only through a `source:` HTML comment under an appendix heading or through an unkeyed appendix item with the same question and answer (`decision-record-writer.ts:279-313`, `:604-627`, `:695`). A record written by hand as one table row per answer has neither, so its answers never count as consumed and the Stop hook keeps asking you to save decisions that are already recorded (`session-stop.ts:96-107`). The real Barter record keeps its table inside an `adr-001-decision` anchor with a nine-column header, shortened questions and options joined by `; `, so neither path can fire.

### Purpose
An answer that already has a row in a hand-written table counts as consumed under that row's Q id, with no new row and no byte added to the hand-written record.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node -e '
const fs=require("fs"),p=".skilled/skills/.state/decision-capture/";
const sid="fe0c9990-06d3-454e-a8e7-7c7bc649bc49";
const q=fs.readFileSync(p+Buffer.from(sid).toString("hex")+".jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
let raw="";try{raw=fs.readFileSync(p+"consumed.jsonl","utf8")}catch{console.log("consumed.jsonl: absent")}
const c=new Set(raw.split("\n").filter(Boolean).map(l=>{try{return JSON.parse(l).key}catch{return null}}));
const pend=q.filter(r=>!c.has(r.key));
console.log("queue records:",q.length,"| consumed keys in log:",c.size,"| pending for session:",pend.length);
console.log("sources:",JSON.stringify(q.reduce((a,r)=>(a[r.source]=(a[r.source]||0)+1,a),{})));
console.log("record keys:",Object.keys(q[0]).join(","));
q.forEach((r,i)=>console.log(i+1,c.has(r.key)?"consumed":"pending",JSON.stringify(r.header||"")));
'
consumed.jsonl: absent
queue records: 30 | consumed keys in log: 0 | pending for session: 30
sources: {"hook":30}
record keys: key,kind,runtime,session_id,tool_use_id,question_index,question,header,options,multi_select,answer,source,captured_at
1 pending "Missed items"
2 pending "Variables"
3 pending "Token usage"
4 pending "Backoffice"
5 pending "Dashboard CSS"
6 pending "Fluid ranges"
7 pending "DS folder"
8 pending "UI Profile"
9 pending "Release 011"
10 pending "Unblock 011"
11 pending "Rebuild"
12 pending "Child guard"
13 pending "7-tool check"
14 pending "AGENTS.md"
15 pending "Git advisory"
16 pending "Cleanup"
17 pending "npm ci"
18 pending "Old files"
19 pending "notify"
20 pending "Build phases"
21 pending "sk-git gate"
22 pending "New mode"
23 pending "Sync trigger"
24 pending "Rename reach"
25 pending "Live-sync"
26 pending "Open where"
27 pending "Git block"
28 pending "Creators"
29 pending "042 layout"
30 pending "Goals"
exit=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Parse a hand-written decision table read-only, wherever its anchor sits, when its first column holds Q ids.
- Score each pending queue record against the rows and accept one row only above a threshold with no tie.
- Record each accepted match as a `consumed.jsonl` row that names the hand-written record's folder and the row's Q id.
- Add a CLI that prints the proposed mapping by default and appends consumed rows only with `--apply`.
- Close the real case: 27 records to Barter Q67 to Q93 through the matcher, and record 12 through a normal full-auto save into 001.

### Out of Scope
- Adding a source comment or any other text to a hand-written record - the Barter record lives in a separate git repo, and editing it from Skilled would write into a repo this session does not own.
- Routing a full-auto save at a folder outside `specs/` - the save refuses such a folder (`generate-context.ts:276`, `:305`), and the matcher needs no save to record a consumed key.
- Changing capture or the writer's two match paths beyond the appendix-label fix in REQ-015 - they already behave as 001 tested them, and the pending count drops once the consumed log names the keys. The Stop hook changes only its nudge text (REQ-014).
- The Claude adapter's `process.cwd()` fallback. It belongs to the capture adapters and is planned in `../003-codex-and-pi-capture/` (REQ-008 there).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts` | Create | Read a hand-written table, normalize cells, score queue records and return matches and refusals. Never opens the record for writing. |
| `.skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts` | Create | CLI taking `--record`, `--session` and `--apply`. Prints the mapping and appends consumed rows through `recordConsumedKeys`. |
| `.skilled/skills/system-spec-kit/runtime/api/index.ts` | Modify | Re-export the matcher beside the writer. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/decision-table-matcher.vitest.ts` | Create | Cover parsing, scoring, ties, no-match, idempotence and read-only behavior. |
| `.skilled/skills/system-spec-kit/runtime/cli/test-fixtures/decision-table/hand-written-record.md` | Create | Redacted copy of the real table's shape and rows Q67 to Q95. |
| `.skilled/commands/speckit/save.md` and `.skilled/skills/system-spec-kit/references/memory/save-workflow.md` | Modify | One step: answers that already have a hand-written row go through the matcher, not a save. |
| `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/001-decision-capture-build/decision-record.md` | Written by a full-auto save | One new row for record 12, never by hand. |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` | Modify | Nudge text names the transcript sweep and the matcher, not only the save. |
| `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` | Modify | Appendix parsing accepts a bolded or indented `Question:` label. |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-save-writer.md` | Modify | Count consumed rows, call `pendingRecords` and use `--ignored` in the repository check. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The matcher reads a hand-written record without writing it. Its sha256 is the same before and after any run, dry or `--apply`. |
| REQ-002 | A record matches a row only when its normalized answer equals the row's answer cell and its total score clears the threshold. When two rows score within the tie margin, the matcher refuses and the record stays pending. |
| REQ-003 | `--apply` appends one `{key, packet, id, at}` row per accepted match to `consumed.jsonl`, where `packet` is the hand-written record's folder relative to the project root and `id` is the row's Q id. |
| REQ-004 | A second `--apply` run adds no consumed row, and neither the hand-written record nor 001's record changes by a byte. |
| REQ-005 | An answer that matches no row stays pending and gets no consumed row. |
| REQ-006 | For session `fe0c9990-06d3-454e-a8e7-7c7bc649bc49`, records 1 to 11 and 13 to 28 map to Barter Q67 to Q93 with no row added to the Barter record. Record 12 gets one new row in 001's record through a full-auto save. Afterwards none of records 1 to 30 is pending, and the Stop hook prints no decision-capture line once no later record is pending either. Records captured after this plan belong to the child that asked them. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | Tests run on the redacted fixture copy, never on the live Barter file. |
| REQ-008 | Without `--apply` the CLI writes nothing and prints one line per record: queue number, chosen Q id or `pending`, and the score or refusal reason. |
| REQ-009 | `save.md` and `save-workflow.md` say when to run the matcher instead of a save. |
| REQ-011 | A row already consumed under one answer is never consumed again under a second, different answer. The matcher refuses such a record with the reason `row already consumed by a different answer` and counts it. |
| REQ-012 | Every run prints a summary line `consumed N, refused M, pending K`, and each refused record names its reason. The refusal count, not pending = 0, is this child's handoff criterion. |
| REQ-013 | The matcher is deterministic: rerunning `--apply` on a fresh clone, where the gitignored `consumed.jsonl` is gone, rebuilds the same consumed rows from the queue and the record. |
| REQ-014 | `--scan-orphans` lists every session queue file in the state folder with pending records and its count, and `--release <key>` removes that key's consumed rows with an atomic rewrite and prints the removed rows so they can be restored. The Stop-hook nudge text names the transcript sweep and the matcher as well as the save. |
| REQ-015 | Appendix parsing in the writer accepts a `Question:` label that is bolded (`**Question:**`) or indented, so a hand-written appendix item is matched. |
| REQ-017 | A re-save that carries a changed answer for an existing Q id rewrites that id's verbatim appendix item as well as its table row, so the row and the appendix never disagree. An unchanged answer still leaves the record byte-identical. |
| REQ-016 | The save-writer playbook scenario counts `consumed.jsonl` rows, calls `pendingRecords` and runs its repository check with `--ignored`, so a broken `recordConsumedKeys` fails it. |
| REQ-010 | The change is re-proven with the series harness in `../006-live-conversation-test/`: an orchestrator drives a real multi-turn session in a scratch project, answers its questions as the human, and the 006 results matrix records that answers matching a hand-written row are consumed under that row's Q id, no duplicate row is written and the Stop-hook nudge reads 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The Measured Behavior command, rerun after the build, shows records 1 to 30 as `consumed`.
- **SC-002**: `sha256sum` of the Barter record is identical before the matcher's first run and after its second.
- **SC-003**: A Claude session that ends after the fix prints no `operator answer(s) captured this session` line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Records 29 and 30 consumed by the orchestrator's series-parent save | Without it the session count ends at 2, not 0 | T001 reruns the Measured Behavior command and records the count before any build. AC-006 waits on it. |
| Risk | A false match consumes an answer that has no row | High: the answer is never recorded and the nudge goes quiet | Answer equality is a hard gate, ties refuse, the default run is dry and AC-008 tests a no-row answer. |
| Risk | Hand-copied cells drift from the captured text | Med: a true match scores low and stays pending | Normalization covers the drift measured in plan.md, and a record that stays pending is safe, since the nudge still reports it. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Matching 30 queue records against a 95-row table finishes in under 1 second.
- **NFR-P02**: N/A: the matcher is a one-shot CLI, not a service, so it has no throughput target.

### Security
- **NFR-S01**: The CLI writes only to `.skilled/skills/.state/decision-capture/consumed.jsonl` under the Skilled project root.
- **NFR-S02**: The matcher opens the hand-written record read-only and sends nothing outside the machine.

### Reliability
- **NFR-R01**: A torn or hand-edited consumed line is skipped, as `readConsumedKeySet` already does (`decision-record-writer.ts:722-745`).
- **NFR-R02**: A table the matcher cannot read is skipped and records nothing; its answers stay pending for the save. Amended 2026-11-02 on the operator's answer: the save step runs the matcher on every record, so a non-zero exit here would stop the save.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a session with no pending records prints `0 pending` and exits 0 without touching `consumed.jsonl`.
- Maximum input: one row matched by two records maps both only when each clears the threshold on its own. The CLI warns that a row took two keys.
- Failure path: a missing record path exits 2 and writes nothing. A record with no readable Q-id table exits 0 with `consumed 0, refused 0, pending N` and writes nothing (operator answer, 2026-11-02).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Two new source files, one export, one test, one fixture, two doc steps. |
| Risk | 13/25 | A false match silences a real answer, and the record sits in another repo. |
| Research | 8/20 | Normalization and threshold need calibration on the 27 known pairs. |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Your brief said all 28 answers resolve to existing Barter Q ids. The tables show 27 do. Record 12 ("Child guard", a Skilled question about the session-relaunch child guard fix 001 shipped) has no row in the Barter record or in 001's record. Planned disposition: one new row in `001-decision-capture-build/decision-record.md` through a full-auto save. Do you confirm that, or should it go to the series parent or be dropped?
- Answered 2026-11-02: record 12 stays in 001 as Q008.
- Record 12's options ("Fix it, same push", "Fix it, push later", "Leave it") partly ask about push timing, which the Q002 process filter covers. Is it a product decision worth a row?
- The queue records carry no round field (see the `record keys:` line above), so the Barter Round column cannot be scored. Is date plus queue order enough to stand in for it?
<!-- /ANCHOR:questions -->

---

