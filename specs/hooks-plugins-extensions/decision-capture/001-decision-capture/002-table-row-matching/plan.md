---
title: "Implementation Plan: Phase 2: table-row-matching"
description: "Add a read-only matcher that maps captured answers to rows of a hand-written decision table and records each match in the consumed log. It never edits the hand-written record and never routes a save outside specs/."
trigger_phrases:
  - "table row matching plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: table-row-matching

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, built by the system-spec-kit runtime |
| **Framework** | None. A plain module plus a CLI entry in `runtime/cli/continuity/` |
| **Storage** | The gitignored `consumed.jsonl` beside the capture queue |
| **Testing** | Vitest |

### Overview
A new module parses a hand-written decision table, scores each pending queue record against its rows and returns one Q id or a refusal. A CLI prints that mapping and, with `--apply`, appends consumed rows through the existing `recordConsumedKeys`. The proof is the pending count for the real session dropping to 0 while the Barter record's sha256 stays the same.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] The spec.md Measured Behavior command, rerun, prints the pending count the build starts from.
- [ ] The operator has answered the record 12 question in spec.md section 10.
- [ ] `sha256sum` of the Barter record is written into `goal.md` section 4 before the first matcher run.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run cli/tests/decision-table-matcher.vitest.ts cli/tests/decision-record-writer.vitest.ts` in the runtime folder exits 0 with no failed test.
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Read-only side matcher. The writer and the save stay as they are.

### Key Components
- **`decision-table-matcher.ts`**: finds any anchor holding a table whose first cell is a Q id, reads its header to locate the date, topic, question, options and answer columns, and scores records against rows.
- **`match-decision-table.ts`**: the CLI. It reads the queue with the same rules as `readQueue`, skips keys already consumed, calls the matcher and appends accepted matches with `recordConsumedKeys` (`decision-record-writer.ts:752`).

### Data Flow
Queue file for the session, minus consumed keys, goes to the matcher. The matcher reads the hand-written record and returns `{key, id, score}` or `{key, refused, reason}` per record. With `--apply` the CLI turns accepted matches into consumed rows. `pendingRecords` (`capture-core.mjs:334`) then drops them, and `takeNudge` (`capture-core.mjs:344`) reports 0.

### Why the consumed log, not a source comment
Pointing `writeDecisionRecord` at the Barter folder would append the `operator-decisions` and `operator-answers-verbatim` anchors to a hand-written record (`decision-record-writer.ts:220-229`, `:684-685`) and rewrite matched rows in the writer's five-column shape (`:231-243`). That is a write into a separate repo. A full-auto save also refuses the folder outright (`generate-context.ts:276`, `:305`). The pending count reads only Skilled's `consumed.jsonl` (`capture-core.mjs:321-337`), so a consumed row naming the foreign folder and Q id is enough to stop the nudge. The cost: a re-capture of the same exchange on another machine does not see the mapping, because the consumed log is gitignored.

### Scoring, to calibrate in Setup
A read-only comparison of the 27 known pairs gave this calibration baseline:

```text
$ node -e '
const fs=require("fs");
const q=fs.readFileSync(".skilled/skills/.state/decision-capture/66653063393939302d303664332d343534652d613865372d376337626336343962633439.jsonl","utf8").split("\n").filter(Boolean).map(JSON.parse);
const rows={};for(const l of fs.readFileSync("barter/ai-speckit/specs/barter-framework/001-coder-skilled-v4-conversion/decision-record.md","utf8").split("\n")){const m=/^\|\s*(Q\d+)\s*\|/.exec(l);if(m)rows[m[1]]=l.split(/(?<!\\)\|/).slice(1,-1).map(s=>s.trim());}
const norm=s=>String(s).replace(/^"|"$/g,"").replace(/\(Recommended\)|\(rec\.\)/gi,"").replace(/\s+/g," ").trim().toLowerCase();
const map=[67,68,69,70,71,72,73,74,75,76,77,null,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93];
let eq=0,cont=0,miss=[],optEq=0,cells=new Set();
map.forEach((n,i)=>{if(n===null)return;const r=rows["Q"+n];cells.add(r.length);const a=norm(q[i].answer),b=norm(r[6]);if(a===b)eq++;else if(b.includes(a)||a.includes(b))cont++;else miss.push(i+1);
const o1=q[i].options.map(norm).sort().join("|"),o2=r[5].split("; ").map(norm).sort().join("|");if(o1===o2)optEq++;});
console.log("Q rows in Barter table:",Object.keys(rows).length,"| cell counts seen:",[...cells].join(","));
console.log("of 27 mapped pairs: answer equal",eq,"| answer contained",cont,"| answer differs",miss.length,"records",miss.join(","));
console.log("options set equal:",optEq,"of 27");
'
Q rows in Barter table: 95 | cell counts seen: 9
of 27 mapped pairs: answer equal 26 | answer contained 0 | answer differs 1 records 2
options set equal: 25 of 27
```

Record 2 differs only because the table turned the answer's line break into ` / `. Records 20 and 25 differ because the table shortened one option ("sk-git first, then sk-code" became "sk-git first"). The proposed rule:

- Hard gate: the normalized answer equals the row's answer cell, with line breaks in the queue answer read as ` / `.
- Score: options token overlap, header-to-topic token overlap, question token overlap and same date, each weighted. Queue order against row order breaks near-ties, since both run in capture order.
- Threshold and tie margin are set in T003 from the 27 pairs plus the no-row record. A tie refuses.
- The queue has no round field, so the Round column is not scored.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `recordConsumedKeys` in `decision-record-writer.ts` | Producer of consumed rows | unchanged, called by the CLI | `rg -n 'recordConsumedKeys' .skilled/skills/system-spec-kit/runtime` lists the new caller |
| `pendingRecords` and `takeNudge` in `capture-core.mjs`, `decisionCaptureNudge` in `session-stop.ts` | Consumers of the consumed log | unchanged | The Measured Behavior command and AC-006 |
| `writeDecisionRecord` and `planOperatorDecisions` in `workflow.ts` | Save-time writer | not a consumer, the matcher never calls them | `rg -n 'writeDecisionRecord' .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts` prints nothing |

Required inventories:
- Same-class producers: `rg -n 'consumed.jsonl|CONSUMED_FILE' .skilled` lists the writer and the capture core as the only writer and reader.
- Consumers of changed symbols: `rg -n 'decision-table-matcher|matchDecisionTable' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: answer equal or not, options full or shortened, tie or no tie, key already consumed or not. Eight fixture rows cover them.
- Algorithm invariant: a key is consumed only when exactly one row passes the answer gate and clears the threshold by more than the tie margin. Adversarial cases: two rows with the same answer, a quoted answer, a line-break answer, a pipe inside a backticked cell.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup records the pending count, the Barter sha256 and the calibrated threshold. Implementation adds the matcher, the CLI, the fixture tests and the doc step. Verification runs the matcher on the real session, saves record 12 and checks the count reads 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Table parsing, normalization, scoring, ties, no-match and read-only behavior on the redacted fixture | Vitest |
| Integration | The CLI against a temp queue and temp consumed log, run twice for idempotence | Vitest with a temp project root |
| Manual | The real session: dry run, `--apply`, record 12 save, then the Measured Behavior command and a Stop-hook run | `node`, `sha256sum` and the 006 harness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `recordConsumedKeys` and `readQueue` from the 001 build | Internal | Green | No way to record a match without a new writer |
| Records 29 and 30 consumed by the orchestrator | Internal | Yellow: `consumed.jsonl` was absent when this plan was written | AC-006 ends at 2 pending, not 0 |
| `../006-live-conversation-test/` harness | Internal | Yellow: being created now | AC-009 cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a consumed row names a Q id whose row does not hold that answer, or any change to the Barter record's sha256.
- **Procedure**: delete the consumed rows whose `packet` names the Barter folder (each carries that path), then revert the build commit. The hand-written record needs no rollback because the matcher never writes it.
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
| Setup | The operator's answer on record 12 | Implementation, since the threshold comes from Setup |
| Implementation | Setup's calibrated threshold | Verification |
| Verification | Implementation and the 006 harness | Packet close |
<!-- /ANCHOR:phase-deps -->

---

