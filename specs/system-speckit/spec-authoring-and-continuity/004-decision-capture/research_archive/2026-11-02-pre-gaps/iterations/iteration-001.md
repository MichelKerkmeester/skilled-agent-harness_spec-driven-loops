# Iteration 1: the 001 build — defects, weak spots, and the pending-row trace

## Focus

Iteration 1 of 3. Read-only audit of the shipped 001 build (capture core, Claude PostToolUse hook, transcript/OpenCode/Devin sweeps, `decision-record-writer.ts`, the save wiring, the Stop-hook nudge) and a code-level trace of the known real-use gap: answers already recorded by hand as table rows in another packet's decision record keep counting as pending.

Selected interpretation (one ambiguity deferred): the pack's focus sentence and strategy "Next Focus" agree, so no interpretation had to be chosen between them. The one narrowing decision was scope of the 002 verdict — this iteration judges only whether 002's planned mechanism addresses the traced cause; merge/split/re-order of the whole child series is iteration 2's, and the 006↔065 contract is iteration 3's.

## Actions Taken

1. Read externalized state: `deep-research-config.json` (3 iterations, `progressiveSynthesis: true`, lineage `new`, session `2026-11-01T21:42:07.374Z`), `deep-research-state.jsonl` (one `iteration_start`, no `iteration` records → iteration 1), `deep-research-strategy.md` (5 key questions, no exhausted approaches), `findings-registry.json` (empty). [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research/deep-research-state.jsonl:4]
2. Read the capture core in full: [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:1]
3. Read the Claude adapter: [SOURCE: .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs:1]
4. Read the writer in full: [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:1]
5. Read the save wiring that calls the writer: [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:624]
6. Read the Stop-hook nudge: [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:93]
7. Read the three sweeps' sweep + CLI surfaces: [SOURCE: .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:203] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:214] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-devin.mjs:153]
8. Read the documented operator path: [SOURCE: .skilled/commands/speckit/save.md:64] [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:253]
9. Read 002's problem statement and plan (read-only, same packet): [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/spec.md:47] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/plan.md:57]
10. Re-ran the pending computation by hand against the live gitignored state (read-only `node -e`, no writes): queue 35 records, consumed 2 keys, pending 33, nudge cursor `"29"`, exactly one session queue file on disk.
11. Cross-read the live packet decision record against the consumed log: 4 source-keyed appendix items, 2 consumed keys.
12. Surveyed the writer's tests for coverage of the hand-written-row class: [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts:333]

## Findings

### A. Why hand-written table rows keep counting as pending (the traced cause)

1. **Pending is defined as queue-minus-consumed, and nothing else.** `pendingRecords` returns `readQueue(sessionId)` filtered by `readConsumedKeys(projectDir)`; the consumed file is `<project>/.skilled/skills/.state/decision-capture/consumed.jsonl`. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:334] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:321] **Confirmed.**

2. **Only one producer ever writes a consumed row: the save, after the writer returns.** `writePlannedOperatorDecisions` calls `writeDecisionRecord(...)` and immediately hands `result.ids` to `recordConsumedKeys`. No other call site exists in non-test code (repository-wide grep for `recordConsumedKeys` returns the writer, the workflow call, `api/index.ts` and the compiled `.d.ts`). [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:743] **Confirmed.**

3. **`recordConsumedKeys` writes only keys the save actually wrote or matched; it never reads a decision record to discover that an answer is already recorded.** Its `ids` argument is `result.ids` from the writer, which is the list of entries the save was handed. A hand-written table row contributes no entry, therefore no id, therefore no consumed row. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:752] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:692] **Confirmed.**

4. **The writer has exactly two id-reuse paths, and both require an appendix item.** (a) `existing.keyToId` — a `<!-- source: <key> -->` comment read from under an appendix heading; (b) `unkeyed.get(exchangeKey(question, answer))` — an appendix item with no source comment whose question and answer match after case/whitespace normalization. A hand-written table row is neither: it is a line in the `operator-decisions`-shaped table and there is no code that reads a table row's text at all. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:695] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:279] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:615] **Confirmed.**

5. **Answer-text matching is structurally impossible against any table the writer itself produces.** The decisions table has five columns and no answer column (`| ID | Decided | Why | Supersedes | Carried by |`), and `formatDecisionRow` emits exactly those five cells. So even for the writer's own record the only text that can ever be matched is the appendix's. A nine-column hand-written table (answer present) is the only table where answer matching is even conceivable, and no code parses one. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:98] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:136] **Confirmed.**

6. **Live artifact proof of the gap.** The queue for session `fe0c9990-06d3-454e-a8e7-7c7bc649bc49` holds 35 records, `consumed.jsonl` holds 2 keys, so 33 are pending; the nudge cursor file reads `29`. The two consumed rows name packet `system-speckit/spec-authoring-and-continuity/004-decision-capture` and ids `Q001`/`Q002` — the only answers that ever travelled through `writeDecisionRecord`. The remaining 33 are answers whose decisions live in another packet's hand-written record, which nothing can mark. **Confirmed** (recomputed numbers).

7. **The record and the consumed log already disagree in a second way.** This packet's own `decision-record.md` carries four source-keyed appendix items (`Q001`–`Q004`, at lines 51, 71, 90 and 105) but `consumed.jsonl` holds only the two `toolu_01Gzd…` keys. The two chat-keyed items (`Q003`, `Q004`) are in the record yet unconsumed. Cause **inferred**: those two items reached the record without the writer (a hand-added appendix item reads exactly like a writer-authored one), so no `recordConsumedKeys` call ever ran for them. Consequence confirmed by code: a later sweep still prints them as chat candidates because `chatCandidate` filters on `consumed.has(key)`. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/decision-record.md:90] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:252] **Confirmed for the artifact state; inferred for the cause.**

### B. Defects and weak spots in the 001 build

8. **A session's queue is orphaned the moment its last save does not consume it.** `pendingRecords` is session-scoped, the queue file name is the hex of the session id, and no code in `.skilled/hooks/decision-capture/` enumerates the queue directory (the only `readdirSync` lists transcript directories). A later session's sweep reads the later transcript and prints pending for the later session — an empty list — while the earlier session's file stays behind. The live state is exactly that shape: one queue file, 33 pending, and no reader that can offer them again. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:226] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:334] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:306] **Confirmed at code level; the "unreachable after relaunch" consequence is inferred.**

9. **The nudge names a remedy that is not sufficient on its own, and the save it names is silent at zero entries.** The Stop hook prints "Run /speckit:save with --full-auto to record them", but `--full-auto` only writes entries the caller passes; `planOperatorDecisions` returns `null` with no log and no warning when `_operatorDecisions` is empty. The sweep that produces those entries is documented in `save.md` only, never in the nudge text. So the exact instruction an operator receives can be followed to completion while every record stays pending. [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts:107] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:646] [SOURCE: .skilled/commands/speckit/save.md:64] **Confirmed.**

10. **"The Stop hook keeps nudging" overstates the code.** `takeNudge` reports only when the pending count exceeds the cursor, and lowers the cursor silently when a save consumed part of the queue; a session whose count stops rising is nudged once, not every turn. The recurring surface in real use is therefore the sweep's `pending` list printed at every save, not a repeating Stop message. The 002 description states the symptom as a repeating Stop nudge. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:344] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/spec.md:2] **Confirmed** (contradiction with 002's framing; the fix is unaffected, the acceptance wording should be).

11. **The adapter can write outside the project, contradicting the core's stated invariant.** The core's header promises every path resolves under the caller's project directory "never the process working directory", but the Claude adapter falls back to `process.cwd()` when neither `CLAUDE_PROJECT_DIR` nor `payload.cwd` is present. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:15] [SOURCE: .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs:54] **Confirmed.**

12. **Appendix parsing accepts one style only.** `FIELD_LABEL_RE` anchors `Question:`/`Options:`/`Answer:` at column 0 with no leading marker, so a bolded or indented label parses to nothing, and `readUnkeyedExchangeIds` skips any item with an empty question or answer. A hand-written appendix that uses `**Answer:**` is invisible to the matching path that was built for hand-written appendices. The text comparison itself normalizes case and internal whitespace only — no punctuation, markdown or fuzzy handling. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:85] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:604] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:615] **Confirmed.**

13. **A re-save can leave a table row and its appendix saying different things.** `insertDecisionRow` replaces an existing row for a known id, while `insertAppendixItem` returns the lines unchanged as soon as the heading exists ("an existing appendix item is never rewritten"). A second capture of the same id (new answer, or a corrected answer) updates the row and then marks the new key consumed, so the record's scan view and its verbatim view diverge with no warning. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:231] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:258] [SOURCE: .skilled/skills/system-spec-kit/references/memory/save-workflow.md:267] **Confirmed.**

14. **Consumed rows are unauditable and irreversible.** Each row records only `{key, packet, id, at}`: nothing records the answer the id supposedly holds, so a wrong mapping cannot be detected from the log, and there is no release/un-consume path — the only remedy is hand-editing gitignored state. [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:776] **Confirmed.**

15. **Capture is silent by design, including when it drops a decision.** `normalizeAskUserQuestion` returns `[]` for any shape it does not recognize and drops process questions with no log line. Two consequences worth naming: a newer tool payload that keys `answers` by index rather than by exact question text yields zero records and no signal; and a product question whose header merely matches `worktree`/`branch`/`spec folder` is discarded as process bookkeeping. Multi-select answers are joined with `", "`, which is indistinguishable from a single option that contains a comma. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:125] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:144] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:82] [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:183] **Confirmed for the code paths; the payload-shape risk is inferred** (the only payload evidence is the recorded fixture).

16. **The hand-written-row class has no test because the capability does not exist.** The writer's suite covers keyed reuse ("replaces the row for a known source key") and unkeyed appendix reuse ("reuses the id of a hand-written item whose question and answer match") plus the negative "gives a new id when only the question matches". Nothing covers a hand-written table row, so 002 introduces a new capability and a new test surface rather than repairing a regression. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts:333] **Confirmed.**

### C. Verdict on 002's planned mechanism (first pass; series shape is iteration 2)

17. **002 targets the traced cause correctly.** Its plan is a read-only side matcher plus a CLI that appends consumed rows through the existing `recordConsumedKeys`, with a sha256 guard on the foreign record, an answer gate and a tie margin. That is the only mechanism that closes finding 6 without writing into another repository, and the plan explicitly rejects the destructive alternative (routing a save at the foreign packet would append both anchors and rewrite matched rows into the writer's five-column shape). [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/plan.md:66] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/plan.md:57] **Confirmed as design fit.**

18. **Four gaps 002 does not close, each with a cheap addition.** (a) The mapping lives in gitignored state, so it is per-machine — the plan names the cost but plans no mitigation; a committed, packet-local key→Q-id map would survive a re-clone. (b) Nothing invokes the matcher: the documented save path still runs the sweep only, so the same drift can reappear on the next captured answer unless `save.md`/`save-workflow.md` and the nudge text name the matcher. (c) Refusals must be counted and surfaced — the plan's own measurements show rows differing by shortened options and `/ `-joined line breaks, so "pending = 0" is the wrong handoff criterion; "pending = reported refusals" is honest. (d) Findings 7, 8, 13 and 14 (record/log divergence, orphan session queues, row/appendix divergence, no release path) are untouched by 002 and are not obviously owned by any other child. [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/plan.md:91] [SOURCE: specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/plan.md:154] **Confirmed from the plan text; the "cheap addition" judgments are inferred.**

## Ruled Out

- **Reading pending from the decision record instead of the queue.** `pendingRecords` never opens a decision record; the only cross-check between record and log is the writer's own id-reuse during a save. Any theory that pending is computed by parsing records is ruled out by the code. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:334]
- **A global (all-session) pending sweep.** No code enumerates the queue directory; the sweeps all take one session id from one transcript/db. A "the sweep already shows everything" assumption is ruled out. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:214]
- **Blame the hook for the 33.** The hook captured all 35 records (`sources: {"hook":30}` at 002's measurement, hook+capture for the rest); the failure is entirely downstream, at consumption. Capture is not the defective stage here.

## Dead Ends

- **Assuming a table-row match path exists behind a flag.** No flag, no branch, no regex reads a decisions-table row's text anywhere in the writer. This is a capability gap, not a misconfiguration — a candidate for reducer promotion to "Exhausted Approaches" so no later iteration re-searches for it.
- **Treating `consumed.jsonl` as a verifiable mapping.** It stores no answer text, so it cannot be validated after the fact. Any later iteration planning verification around that file must build the evidence itself.

## Edge Cases

- **Ambiguous input:** none — the pack focus and strategy "Next Focus" agree. Deferred to iteration 2: merge/split/re-order of children 003–005 and any missing follow-up beyond the four gaps in finding 18.
- **Contradictory evidence:** finding 10 — 002's spec describes a repeating Stop nudge, `takeNudge` reports once per increase. Recorded on both sides; not resolved into a single claim, and 002's fix is unaffected.
- **Missing dependencies:** none blocking. `research/research.md` was not written this iteration — see SCOPE VIOLATIONS.
- **Partial success:** none. The iteration completed its full evidence set; the only non-code claim is the inferred cause in finding 7, labelled as such.

## Sources Consulted

- `.skilled/hooks/decision-capture/lib/capture-core.mjs` (1-374, full)
- `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs` (1-75, full)
- `.skilled/hooks/decision-capture/bin/sweep-transcript.mjs` (1-60, 190-260, 300-366)
- `.skilled/hooks/decision-capture/bin/sweep-opencode.mjs` (195-240)
- `.skilled/hooks/decision-capture/bin/sweep-devin.mjs` (150-190)
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` (1-781, full)
- `.skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` (600-766)
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` (80-124)
- `.skilled/commands/speckit/save.md` (23, 63-70, 92, 101-102)
- `.skilled/skills/system-spec-kit/references/memory/save-workflow.md` (253-267)
- `.skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts` (test-name index)
- `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/spec.md` (1-120)
- `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/002-table-row-matching/plan.md` (engineering-plan sections)
- `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/decision-record.md` (37-105)
- Live gitignored state: `.skilled/skills/.state/decision-capture/` — queue (35 records), `consumed.jsonl` (2 rows), `.nudge` (`"29"`), directory listing (one session queue file)

## SCOPE VIOLATIONS

- **Would-be write, not executed:** `specs/system-speckit/spec-authoring-and-continuity/004-decision-capture/research/research.md`. `deep-research-config.json` sets `progressiveSynthesis: true` and the agent contract's Step 9 asks for a progressive update of that file, but this dispatch's ALLOWED WRITE PATHS list covers only the iteration narrative, the delta file and the gateway's own writes. The dispatch list is the more specific instruction, so the write was withheld rather than executed. Consequence: this iteration has no synthesis-table entry in `research.md`; the findings above are the complete record and the reducer can synthesise from the delta stream.

## Assessment

- **New information ratio: 0.87** — 11 of 15 findings are fully new to the packet (record/log divergence, orphan session queues, the insufficient nudge remedy, the adapter cwd fallback, the appendix-label brittleness, row/appendix divergence under re-save, unauditable consumed rows, silent drop paths, the missing test class, and two of the 002 gap judgments); 4 restate or refine something the parent `spec.md` already claims (the two match paths, the missing answer column, the nudge-once correction, and the 002 design fit).
- **Questions addressed:** Q1 (defects and weak spots in the 001 build), Q2 (why hand-written table rows stay pending, and whether 002's matching is the right fix).
- **Questions answered:** Q1, Q2. Q2's second half is answered in direction only: 002 is the right mechanism for the traced cause and carries four named gaps; the series-level verdict is iteration 2.

## Reflection

- **What worked and why:** tracing backwards from the *definition* of pending (`pendingRecords`) to its only producer, then checking the producer's two match paths against what a hand-written record actually contains. That order made the cause mechanical rather than plausible, and re-running the same computation on the live state turned a design argument into numbers (35/2/33, cursor 29).
- **What did not work and why:** the first hypothesis — "the save is handed the entries and the writer mismatches them" — was wrong. Reading `planOperatorDecisions` showed the save is never handed entries for decisions recorded elsewhere, so the mismatch happens before matching: there is no entry to match. The strategy's "which code computes pending, what it matches on" phrasing invites the first hypothesis; the productive move was to also ask what the save is *given*.
- **What I would do differently:** read the live `consumed.jsonl` before reading the writer. Two consumed keys against four record items would have surfaced finding 7 early and framed the rest of the audit around artifact disagreement rather than a single missing capability.

## Recommended Next Focus

Iteration 2: the child series. Answer Q3 and Q4 from `spec.md`'s Phase Documentation Map plus each child's `spec.md`/`plan.md`/`acceptance-criteria.md`/`goal.md`: whether 003–005 should merge, split or re-order, and where the four unowned gaps from finding 18 belong (cross-machine mapping persistence, the missing invocation in the documented save path, refused-match reporting, orphan session queues plus a release path for consumed rows). Carry finding 10 into 002's acceptance wording and finding 13 into whoever owns re-save divergence — neither is currently assigned to a child.

## Questions Answered

- What defects or weak spots exist in the 001 build (capture core, Claude PostToolUse hook, transcript/OpenCode/Devin sweeps, decision-record writer and save wiring, Stop-hook nudge), and what should be improved? — Findings 8–16, with improvements named per finding.
- Why do answers recorded by hand as table rows in another packet's decision record keep counting as pending, and is 002's planned matching the right fix? — Findings 1–7 for the cause, 17–18 for the fix.

## Questions Remaining

- Q3: Should any of the planned children 002 to 005 be changed, merged, split, re-ordered or planned differently, and is any follow-up missing? (iteration 2)
- Q4: How does 006 depend on the shared conversation runner in `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios`, and is the contract between them right and complete? (iteration 3)
- Q5: Do the three decision-capture playbook scenarios prove what 001 claims, and what must the 006 conversation scenario assert that they do not? (iteration 3)
- Carried nuance from Q2: whether 002 refuses a match when two sessions captured the same question with different answers — a table row holds one answer, so a second, different answer must not be marked consumed under it. Not stated in 002's plan.

## Next Focus

Iteration 2 as described in Recommended Next Focus.
