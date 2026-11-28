# Iteration 10: the consolidation — coverage, one ranking, and what the corpus cannot answer

## Focus

Consolidation. Nine iterations produced fifty findings across ten reference repos. This iteration does not read a new source; it re-reads this lineage's own deltas and the licences of the ten repos, states the per-phase coverage honestly, collapses eight separate net-new lists into one ranking, and names the questions the corpus cannot answer so the next planner does not spend an iteration rediscovering that it cannot.

## Actions Taken

1. Aggregated this lineage's nine delta files by the `phase` field of every `finding` row: 50 findings, and the count per phase is in the table below.
2. Re-read the ten repos' `LICENSE` heads to fix the liftable set, because every finding in the net-new list depends on which licence it carries.
3. Cross-checked the eight net-new lists this lineage produced (iterations 2, 3, 5, 8, 9) and merged duplicates: three candidates appeared twice under different names, and one was re-sorted from medium to high once its size was known.

## Findings

1. **013-manual-testing-scenarios and the coverage table: every one of the fourteen phases now carries at least one cited finding, and four of them carry only one.** The count per phase, from the deltas: 003 eight, 012 five, 005 four, 007 four, 011 four, 006 three, 002 two, 008 two, 009 two, 010 two, 001 one, 004 one, 013 one, 014 one, plus ten net-new. The four single-finding phases are single for different reasons and only one of them is thin: 004's is negative evidence that supports the plan, 013's is a doc index, 014's is a review-note shape, and 001's is a rule about optimistic rows — none of them has an unread reference implementation behind it. That is the honest coverage statement, and it is stronger than a count: a phase with one finding and no reference implementation is *covered*, while a phase with one finding and an unread reference would not be. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-1/deltas/iter-001.jsonl:1-12] (observed; the count is over this lineage's own recorded findings)

2. **The licence wall, stated once for the whole corpus.** Seven of the ten repos carry a liftable licence — OpenBot, OpenGhost and hermes-muse are MIT; OpenMausBot, rakazo, turnstone and buzz are Apache-2.0 — and three do not: openhuman, openhuman-full and tinychannels are GPL-3.0-only, which by the parity synthesis's own eliminated-alternatives row means design reference only. Inside openhuman-full the wall is total: 4,379,258 `.rs` lines across 21 vendored crates, every one GPL-3.0-only. So every finding this lineage recorded from openhuman or tinychannels is a *rule set or a shape to reimplement*, never a lift, and each one says so. The practical consequence for the next planner is a filter, not a warning: the liftable design surface is OpenBot for the shared modules, turnstone for the terminal loop and memory model, OpenGhost for skills and bounded memory, and rakazo for the secret layer — and openhuman's contribution is judgement, not code. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/openhuman-full/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:120] (observed)

3. **The consolidated net-new ranking, one table.** Merged across iterations 2, 3, 5, 8 and 9, with sizes as T-shirt estimates from the source's own scale:

   | # | Candidate | Value | Size | Licence | Finding |
   |---|-----------|-------|------|---------|---------|
   | 1 | Per-bot `maxToolTier` with `cron` capped at `readonly`, enforced at dispatch | high | M | GPL design | f-iter009-005 |
   | 2 | `bots what-if`: run a proposed action through the real deciders, one row per rung | high | M | MIT | f-iter005-002 |
   | 3 | Work handed into a thread that returns to the conversation | high | L | MIT | f-iter005-003 |
   | 4 | An inbound disposition ledger for channels, with tombstones and redrive | high | M | GPL design | f-iter008-003 |
   | 5 | An actionable "connect this app" refusal for each of 007's and 008's refusals | medium-high | S | MIT | f-iter005-005 |
   | 6 | A document-output path (a bot that produces a report) | medium | M | GPL design | f-iter008-005 |
   | 7 | Attachment limits declared once, with a run-folder path | medium | M | MIT | f-iter005-004 |
   | 8 | One wording rule for tool names across every surface | medium | S | MIT | f-iter005-006 |
   | 9 | Channel durability negotiation (Required/BestEffort/Disabled) | medium | S | GPL design | f-iter003-003 |
   | 10 | A generated `llms.txt` doc index with a resolvable-path check | medium | S | GPL design | f-iter007-004 |
   | 11 | A per-hour command budget refused before the approval prompt | medium-high | S | GPL design | f-iter009-003 |
   | 12 | Provider breadth beyond the plan's five channels | low | S each | GPL design | f-iter003-005 |
   | 13 | Client-side-only redaction | zero (cautionary) | — | MIT | f-iter005-007 |

   Items 1, 11 and 4 are the three that a small team would feel in a week; 2 and 5 are the two that cost least and explain most. Items 6 to 10 are polish a later packet can carry. Item 13 is the one not to build. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-1/iterations/iteration-009.md:1] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-1/iterations/iteration-005.md:1] (observed; the ranking merges this lineage's findings)

4. **The three questions the reference corpus cannot answer.** Each is carried in the provenance research as an open question and none was closed here, because no reference repo holds the answer: (a) who the actor is for a scheduled run on a shared host — OpenBot's activity queries name response shapes and not the SQL, and its scheduled turns are attributed to the deployment rather than to an installing person; (b) whether a routine migrates to a `starts` list at once — no reference has more than one start per routine in its data model, so this is a product decision; (c) how large a memory file may grow before it is compacted — OpenGhost's 28-of-60 crowded mark is the only number in the corpus and it was chosen for a chat app's memory, not measured for a bot's. Recording them together is the one place this lineage can stop a later iteration from looking. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/queries.ts:90] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/memory.js:11] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:184-189] (observed; the absence is what is observed)

5. **The three failure classes that recur across every repo, and where the plan stands on each.** Every unguarded failure this lineage recorded falls into one of three classes, and naming the classes is more useful to the next planner than a list of fifty rows: **a silent no-op success** — a run that reports success while doing nothing, which OpenBot paid for once with the firing frame (f-iter003-001) and which the plan's `until_check` only partly covers, because an outcome check catches a routine's non-result and not a bad turn; **a scheduled run that acts or waits when it should refuse** — cron parking on a `pay` kind (f-iter002-001) or being allowed write tools at all (f-iter009-002), which the plan can fix with one origin rung and one ceiling; and **untrusted text reaching the model as instructions** — a skill body with invisible code points (f-iter008-001), a channel reply parsed as a decision (f-iter001-007), and a refusal that quotes a server or secret name back into the prompt (f-iter009-004). The plan is strong against the *fourth* class that is usual in this field — secret values leaking into a prompt — and thin against the first three, which is the opposite of the general expectation and the most useful single conclusion this lineage reaches. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-1/iterations/iteration-003.md:1] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-1/iterations/iteration-008.md:1] (inferred from this lineage's findings)

## Ruled Out

- **A per-phase "readiness" score.** The three earlier syntheses already produce verdict-per-phase tables and the plan-depth run downgraded and rejected findings with reasons; a fourth score would be a fourth scale. This iteration states coverage as counts plus the one qualitative fact that matters (whether a reference implementation exists behind the finding), and leaves scoring to 015-deep-review.
- **Merging the net-new ranking into the parity synthesis's ranked build order.** The two orders answer different questions — the build order ranks *planned phases*, the ranking above ranks *unplanned candidates* — and merging them would put a what-if verb ahead of the routine layer for no reason.
- **Re-opening any finding to raise its severity.** This is a reading iteration, not a re-adjudication; where a rank moved (finding 3, items 1 and 11) the iteration says which earlier finding it came from.

## Dead Ends

- Nothing new was searched, so there is no dead end from searching. The one thing that did not work was attempting to state a coverage percentage: 50 findings over fourteen phases is not a percentage of anything, because a phase's reference surface is not enumerable. The count table is what survived.
- The delta aggregation read `iter-001` to `iter-009` by name rather than by listing the directory, so a future reader adding an iteration must extend the loop; recorded because a stale script is how a coverage table silently undercounts.

## Edge Cases

- **Contradictory evidence:** none. The one tension is the licence wall against the value of the openhuman findings, resolved by classifying each as a rule set to reimplement rather than a lift.
- **Ambiguous input:** none. The topic's second half ("rank each by its value and give its size") is now answered in one table.
- **Missing dependency:** none.
- **Partial success:** finding 4 records three questions as *unanswerable from this corpus*, which is weaker than answering them. It is the honest outcome and it is stated as an absence, not as a result.

## Sources Consulted

- specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-1/deltas/iter-001.jsonl through iter-009.jsonl
- specs/system-skilled-bots/context/OpenBot-main/LICENSE:1
- specs/system-skilled-bots/context/OpenBot-main/app/src/lib/bot-lifecycle/queries.ts:90
- specs/system-skilled-bots/context/OpenGhost-main/memory.js:11
- specs/system-skilled-bots/context/openhuman-full/LICENSE:1-2
- specs/system-skilled-bots/context/tinychannels-main/LICENSE:1-2
- specs/system-skilled-bots/context/turnstone-main/LICENSE:1
- specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md:120,184-189

## Assessment

- New information ratio: 0.55
- Questions addressed: consolidation of coverage, licences, net-new candidates and the three unanswerable questions
- Questions answered: none tracked; this iteration synthesizes rather than discovers

## Reflection

- **What worked and why:** aggregating the lineage's own deltas by the `phase` field instead of trusting memory. The count table found that 001, 004, 013 and 014 each have exactly one finding, which is the fact a synthesis needs and which no amount of recall would have produced exactly. The licence re-read is the same method applied to a different column: one command turned ten repo licences into a filter.
- **What did not work and why:** trying to express coverage as a percentage. It cannot be done — a phase's reference surface is not enumerable, and a percentage would have implied a denominator that does not exist. The count table plus the "does a reference implementation exist behind it" question is the honest form.
- **What I would do differently:** keep the coverage aggregation from iteration 1 onward, one row per iteration, so the final table is a read rather than a script written at the end. A per-iteration counts row in each delta would cost nothing and would let a merge step (or the synthesis) sum across lineages.

## Recommended Next Focus

None: the run is at its iteration cap. The synthesis follows, and the two things it must carry forward are the consolidated net-new table (finding 3) and the three failure classes (finding 5), because those are the two artifacts a planner can act on without re-reading fifty findings.
