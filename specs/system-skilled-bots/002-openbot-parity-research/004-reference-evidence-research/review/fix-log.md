# Fix Log for the Reference Evidence Synthesis

Files edited: `research/research.md` and `research/regrade-log.md` inside `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/`. Tag prefixes follow section 1 of research.md. `R/` below is short for that packet's `research/` folder in prose only. No other file was changed.

Outcome counts: 47 entries (27 deep-review ids and 20 independent items). 43 hold, 3 partly hold (V2-R6-P2-001, R5-P2-002 and m4), 0 do not hold, 1 skipped (S9).

## Deep review findings (27)

### R2-P1-001. Nine origin ids resolve to no finding in the record they name
- Holds.
- Evidence: a script count of findings per record and of id uses matched the finding (16 uses in research.md, 13 in the log). Each id lands on a later item of its record [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-002.md:25] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-002.md:31] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/iterations/iteration-008.md:204] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-2/iterations/iteration-002.md:53] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-2/iterations/iteration-002.md:57] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-2/iterations/iteration-002.md:58] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-2/iterations/iteration-002.md:64] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-2/iterations/iteration-009.md:26] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/pi-2/iterations/iteration-010.md:29]
- Changed: research.md section 1 "Origin ids" now says the workers numbered in their own extraction order, that the ids do not match the record's numbering, and maps the eight remaining ids to their items in a table. `V2-2-18` named a dead-end item that restates finding 1 of the same record, so section 4 now credits that correction to `V2-2-1`.
- Unresolved by number: `V2-2-16`, `V2-2-17` and `V2-2-19`. Their items were found by matching the log's claim text. No single count gives their numbers, and section 1 says so. The finding's side claim that every affected row keeps a resolving origin is not true of the log row `V1-2-7, V1-2-10`, which carries only those two.

### R1-P2-001. Counts at line 34 do not partition 303, and section 1 says a `wrong` finding is not in the document while wrong origins sit in Origin columns
- Holds, both parts. The registry entry merges vibe-1 iteration 1 finding 1 and iteration 3 finding 1.
- Evidence: 121 plus 332 is 453. My script found 29 distinct origins logged `wrong` inside Origin cells (the finding says 27, a different counting choice, same point). The old section 8 sentence "332 rows cover more than 332 lineage findings" is also false: the log names 236 distinct ids directly (script count over the log's Origin cells).
- Changed: research.md section 2 "The answer" no longer presents 121 and 332 as a split of 303. Section 1 has a new paragraph "Where each lineage finding went". Section 8's note now gives the 236 figure and says the counts are not a split.

### V2-R10-P2-001. The Bottom Line calls 303 raw findings and splits them into 121 plus 332
- Holds. Same edit as R1-P2-001 part 1. Section 2 now calls 303 the merged registry's key findings.

### R3-P2-002. "About twenty guards" against 32 pitfall rows
- Holds. A script count gives 32 pitfall rows, 32 differs rows and 20 lift rows.
- Changed: section 2 "The answer" says 32 pitfall rows. "Guards with the highest stakes" now says it is a selection of eight from 32.

### R10-P2-001. The lift list names 4 of 20 lift rows without saying it is a selection
- Holds. Script count: 20 lift rows.
- Changed: section 2 "Lifts worth taking" now says it is a selection from 20. After S2 and m7 it names two.
- Conflict: vibe-2 iteration 10 considered the same point and ruled it out, reading "worth" as a selection. Kept, because the list gave no label and a reader could not tell a selection from the full set, while the guards list beside it did say it was a selection.

### R5-P2-001. Section 2's inference inventory names three claims, more rows say "inferred"
- Holds, including the refinement for the firing-frame row (vibe-1 iteration 6 finding 3).
- Evidence: a scan of every "nfer" in sections 3 to 5 found the rows now listed in section 2.
- Changed: section 1 "Grades" now states one rule: a row whose central claim is inferred is weak, a row whose central claim is line-backed keeps its grade and labels a side inference. Section 2 "What would change this answer" lists four weak rows, three rows with a labelled side inference and one row naming a lineage inference it does not adopt.

### R5-P2-002. The 010 paste row calls its mechanism an inference when 003 establishes it
- Partly holds. See "The 010 paste conflict" below.

### R4-P2-001. 008's encoded-forms guard names three additions where the reference builds eight forms (and section 2 guard 3 repeats it)
- Holds, both locations.
- Evidence: [SOURCE: C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/patterns.rs:248-280] [SOURCE: B/008-vault/design/leak-checks.md:73]
- Changed: 008 pitfall 2 now names all eight forms and adds lowercase percent-encoding and form encoding to the guard. Section 2 guard 3 matches.

### R4-P2-002. The 008 hex reason cites a value-file line for a keychain read
- Holds.
- Evidence: [SOURCE: B/008-vault/spec.md:169] states the value-file read only. [SOURCE: B/008-vault/design/backends.md:41]
- Changed: 008 pitfall 2 now cites spec.md:169 for the value files and marks the keychain read as inferred. Grade kept, since the row's central claim (the scan misses forms) is line-backed. Listed in section 2.

### R6-P2-001. Section 11 says nine depth-2 nodes, its table names ten
- Holds. The four frontier stores hold six depth-2 nodes for vibe-2 and four for pi-2 [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-2/frontier-nodes.jsonl:1] (read with a script).
- Changed: section 11 says ten.

### R2-P2-001 and V2-R4-P2-001. Section 12 promises 13 questions and holds 12 rows
- Both hold (two lineages, one defect, counted as two entries). The registry holds 9 open and 4 resolved. The table holds the 9 open plus 3 pruned nodes.
- Changed: section 12's intro names the 4 resolved seeds and says the 3 pruned nodes are outside the registry's count. Section 13 says how 8 answered is made up.

### R9-P2-001. Section 14 reports 28 missing files
- Holds. 14 paths with a line list, 4 folder listings, 2 globs, 1 range, 1 annotated path and 6 file paths [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/resource-map.md:15]. One detail of the finding is wrong: `activity_tests.rs` is not a short crate path, it exists in neither checkout.
- Changed: section 14's resource-map line.

### R6-P2-002. Section 7 says the plan closed all three S2 vault findings
- Holds. The third was accepted as a residual by D6 [SOURCE: B/008-vault/spec.md:169] [SOURCE: S2/research.md:201].
- Changed: section 7, 008 bullet.

### R1-P2-002. Section 9 says the checker resolved every tag, 3 are in neither column
- Holds. Rerun of `cite-check.cjs` on the 40 records: vibe-1 216 ok, vibe-2 188 ok with dir 3, pi-1 139 ok, pi-2 145 ok.
- Changed: section 9 now says 721 tags, 718 in the table, 3 folder tags in vibe-2.

### V2-R1-P2-002. The 002 lift row says prompt-sections.md owns the prompt order
- Holds. [SOURCE: B/contracts/prompt-sections.md:15] gives the order to phase 005.
- Changed: 002 lift row 1 now puts the frame's text in the contract and its place in 005's order.

### V2-R1-P2-001. The 003 lift row says the checkout adds a build log
- Holds. The log is `C/openhuman-full.build.log`, a sibling of the checkout (directory listing).
- Changed: 003 lift row 1.

### V2-R5-P2-001. The 005 opening counts two checks and one test against six rows
- Holds. The section has 1 lift, 3 differs and 2 pitfall rows, and pitfall 2 is a plan contradiction [SOURCE: B/005-memory/spec.md:96] [SOURCE: B/005-memory/spec.md:162].
- Changed: 005 opening paragraph.

### V2-R6-P2-001. The 006 kind row misses that the type declares seven kinds
- Partly holds. The type declares seven [SOURCE: C/OpenBot-main/app/src/lib/approvals.ts:62-69]. The doc lists six at line 5 and folds security settings into its credentials row [SOURCE: C/OpenBot-main/docs/approvals.md:39], so the plan's "six" follows the doc, not the type.
- Changed: 006 differs row 1 adds the seven-kind type and asks spec.md:99 to say credentials covers security settings.

### V2-R2-P2-001. The 008 pitfall 1 guard does not say whether `lib/secrets-guard.ts` is still lifted
- Holds. Same edit as S3.

### V2-R9-P2-001. The 009 opening counts the name-and-description list as worth taking
- Holds. No lift row takes it, differs row 1 defers it.
- Changed: 009 opening paragraph.

### R8-P2-001. "Lifted with its notice" collapses Apache-2.0's obligations
- Holds. [SOURCE: B/spec.md:84]
- Changed: section 1 "Licences" now states the reuse rule for both licences. 003 differs row 1 and pitfall 2 now say licence, NOTICE and statement of changes.

### R8-P2-002. "Every row names the licence", and 49 of 101 numbered rows do not
- Holds. Script: 101 numbered rows, 52 name a licence. Also only 11 of 20 lift rows cite the licence line in that cell.
- Changed: section 1 "Licences" says what each table type carries.
- Conflict: vibe-2 iteration 10 ruled out a per-row licence finding because the section openings carry the licence. Kept, because counting shows the literal sentence "Every row names the licence and the line it was read from" is false, and the new wording says where to look instead.

### R7-P2-001. The ranked order flags two of four weak candidates
- Holds.
- Changed: section 5 ranked order flags every weak candidate (now six) and says the order does not weigh the grade.

### R9-P2-002. The reading guide names two of six outcomes
- Holds. The log's intro listed six outcomes and section 1 named two. The intro now defines all six [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/regrade-log.md:7].
- Changed: section 1 "Where each lineage finding went".

### V2-R3-P2-001. The log's outcome vocabulary is undefined and `wrong` covers two things
- Holds. V1-10-1 is logged `wrong` though the file is truly absent [SOURCE: B/001-activity-and-actor/spec.md:153].
- Changed: regrade-log.md intro now defines all six outcomes and says `wrong` judges the conclusion too.

### R7-P2-002. The tinychannels row says `diff -rq` prints only `wiki/` lines
- Holds. Rerun: 34 lines, 13 `wiki/`, 20 nested `tinybus`, 1 `.git` type line.
- Changed: section 4 tinychannels row.

Note on merged registry entries: `R5-P2-001` also carries vibe-1 iteration 6 finding 3 (the firing frame) and `R4-P2-001` also carries iteration 5 finding 3 (section 2 guard 3). Both refinements are worked inside their parent entries above.

## Independent review

### M1. 009 sends a live-model scenario to 012
- Holds. [SOURCE: B/012-manual-testing-scenarios/plan.md:127] [SOURCE: B/012-manual-testing-scenarios/spec.md:114] [SOURCE: B/012-manual-testing-scenarios/spec.md:204]
- Changed: 009 lift row 2 and pitfall 2 now say no planned phase can host it and point at net-new candidate 7. 009 pitfall 1 and section 12 question 2 now point at candidate 7. Grade of pitfall 2 kept confirmed, because the reading it reports (turnstone tests adherence, the plan does not) holds. Only its guard was wrong. This differs from the review's proposal. A grade measures whether the lines support the reading, and a wrong guard is fixed by rewriting the guard.

### M2. The stall watchdog is sized as one timer, the dispatch blocks
- Holds. [SOURCE: L/dispatch.ts:601] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1607-1612] [SOURCE: L/runner.ts:892-893]
- Changed: candidate 3's build need and dependency, and its rank (third to sixth).

### M3. 006 recommends a key the runtime cannot fill
- Holds. [SOURCE: B/006-approval-grants/spec.md:272] [SOURCE: B/006-approval-grants/spec.md:205]
- Changed: 006 pitfall 2 guard rewritten to say what the plan decided and to narrow the key with what an item carries. Section 2 guard 4. Grade kept for the reference reading, the fix marked as judgment.

### S1. 006 pitfall 3 widens a check-in rule to every routine
- Holds. The comment narrows it to check-in tasks and the code refuses any `task` source, neither of which is every routine [SOURCE: C/OpenBot-main/shared/standing-rule.ts:10-12] [SOURCE: C/OpenBot-main/shared/standing-rule.ts:25-29] [SOURCE: C/OpenBot-main/docs/routines.md:186-188]
- Changed: 006 pitfall 3 guard now scopes it to a `does: tell` routine and labels a wider rule as the plan's own choice.

### S2. 008 lift row 1 presents a planned lift as new
- Holds. [SOURCE: B/008-vault/plan.md:142] [SOURCE: B/008-vault/tasks.md:78] [SOURCE: B/008-vault/spec.md:119]
- Changed: section 2 lift 3 removed. 008 lift row 1 rewritten and regraded weak. 008 opening paragraph. Logged in the new regrade section of the log.

### S3. 008 pitfall 1 leaves the plan lines that cause the trap
- Holds. [SOURCE: B/008-vault/tasks.md:79] [SOURCE: B/008-vault/spec.md:102] [SOURCE: B/008-vault/plan.md:83] [SOURCE: B/008-vault/acceptance-criteria.md:71] [SOURCE: C/rakazo-main/packages/core/src/node/secrets-guard.ts:154]
- Changed: 008 pitfall 1 guard keeps the file, lifts only the constants and the compare, and names the lines to rewrite. Section 10's "Lift rakazo's placeholder guard as a file" row stays consistent with it.

### S4. 005 differs row 1 understates a stable id's cost
- Holds. [SOURCE: B/contracts/records.md:266] [SOURCE: B/005-memory/spec.md:151-152] [SOURCE: B/005-memory/design/module-contract.md:95]
- Changed: 005 differs row 1.

### S5. Net-new candidate 1 turns a per-action budget into a run cap
- Holds. [SOURCE: C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:1-7] [SOURCE: C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs:95-98]
- Changed: candidate 1 retitled, translation stated, per-conversation cap moved in from candidate 2, regraded weak. Section 2 net-new line.

### S6. Net-new candidate 12 has no surface
- Holds. [SOURCE: B/001-activity-and-actor/spec.md:167] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/regrade-log.md:32]
- Changed: candidate 12 regraded weak, moved to the bottom of the ranked order.

### S7. 002 differs row 1 offers "state the residual" though it is stated
- Holds. [SOURCE: B/002-routine-layer/spec.md:120]
- Changed: 002 differs row 1 guard now says the gap is recorded and its reason should be fixed.

### S8. 010 pitfall 1 is an inference graded confirmed
- Holds for the loop claim. See below.

### S9. The plain-language rendering
- Skipped. It lives outside the repository.

### m1. 002 pitfall 1 says no rule exists, REQ-006 chose stop
- Holds. [SOURCE: B/002-routine-layer/spec.md:173] [SOURCE: C/OpenBot-main/docs/routines.md:125-128]
- Changed: 002 pitfall 1 plan side and guard.

### m2. Section 2 guard 1 and 003 pitfall 1 misquote NFR-S03
- Holds. [SOURCE: B/003-terminal-screen/005-answer-flow/spec.md:213] [SOURCE: B/003-terminal-screen/001-ux-and-component-map/design/key-map.md:52]
- Changed: 003 pitfall 1 quotes NFR-S03 as written and adds the inbox-tab path. Section 2 guard 1 reworded.

### m3. The firing-frame lift has no caveat in section 2
- Holds. Changed: section 2 lift 1 adds the inference and section 2 lists it.

### m4. Candidate 4 misses that `bots status` exists
- Partly holds. `statusReport` joins installs with `launchctl print` and names an unreadable index [SOURCE: L/status.ts:5-8] [SOURCE: L/status.ts:368]. It does not report queue age or a writable state root, so the probe is not only delivery.
- Changed: candidate 4's plan side and build need. Ranked item 4.

### m5. The tool-name.ts correction names S3 only
- Holds. [SOURCE: S1/research.md:125] [SOURCE: S3/research.md:135]
- Changed: section 2 corrections and 006 pitfall 1.

### m6. Section 10 cites a 005 differs row 4 that does not exist
- Holds. The 005 differs table has three rows. The auto-approval default is about skills [SOURCE: C/OpenBot-main/docs/automatic-learning.md:79].
- Changed: the section 10 row now names a skill proposal and points at 009 differs row 3, with its reason rewritten to match.

### m7. Section 2 lift 4 (buzz) is a citation, not a lift
- Holds. The 004 lift row's action is to cite buzz in REQ-001.
- Changed: lift 4 removed. The corrections paragraph now says buzz is a citation for REQ-001.

### m8. Candidate 2 duplicates 011 pitfall 4
- Holds. Changed: candidate 2's build need points at 011 pitfall 4 and keeps only the folding. Ranked item 2.

## Changes of my own

- 003 pitfall 1 cited `state-machines.md:40` for the `y` transition and `:45` for Enter sending a typed line. Line 40 is the `n` transition and line 45 is blank. Corrected to [SOURCE: B/003-terminal-screen/005-answer-flow/design/state-machines.md:41] and [SOURCE: B/003-terminal-screen/005-answer-flow/design/state-machines.md:47], found while rewriting that row for m2.
- Section 5 "What would change the order" said a team with no group chat "can drop candidates 2 and 8". Candidate 8 is the what-if read, which has nothing to do with group chats. The group-chat candidates are 2 and 6 (reader-set labels, ranked 8th), so it now says 2 and 6.
- Section 1 "Licences": while fixing R8-P2-002 I counted that only 11 of 20 lift rows cite the licence line in their licence cell, and the new wording says so.
- Section 2 now says 31 of the 32 pitfall rows name a guard, because after M1 009 pitfall 2 names none in this build.

## The 010 paste conflict

The two reviews look at different surfaces. `bots chat` is a Node readline loop in `bots.cjs` [SOURCE: B/010-conversations/002-conversation-runtime-and-chat-verb/spec.md:156] [SOURCE: B/010-conversations/001-chat-ux-and-pane-map/design/loop-transcript.md:15]. The pane is part of the Rust screen and spawns the verb [SOURCE: B/010-conversations/001-chat-ux-and-pane-map/design/pane-contract.md:26]. The 003 row's crossterm evidence covers the screen, so it backs the pane half (R5-P2-002 partly holds). It says nothing about the readline loop, and the row's central claim is the three runs in `bots chat`, which no reference line or probe shows (S8 holds). Resolution: 010 pitfall 1 regraded weak, its plan side now says which half 003 covers, the 010 opening says the row is weak, section 2 guard 1 calls the three runs likely and inferred, and section 2's inventory lists it.

## Counts

- Section 8 grade columns after the regrades: 001-002 12/7/5, 003-004 11/6/5, 005-009-010 21/18/3, 006-007-008 22/14/8, 011 13/6/7, 012-014 5/4/1, net-new 37/31/6, total 121/86/35. Script count of grade cells matches the table.
- Four rows regraded confirmed to weak: 010 pitfall 1, 008 lift row 1, candidates 1 and 12. They are in a new "Regrades after review" section of the log. The log's outcome columns (332 rows) count the verification pass and were not changed, so section 8 says the four regrades are outside its 332.
- A count that cannot close: 121 kept rows plus 332 log rows do not sum to the registry's 303, because both are row counts that group or split findings. research.md sections 2 and 8 now say so in plain words.

## Checks

- `node .../scratch/synthesis-inputs/cite-check.cjs . research/research.md`: {"ok":658,"missing":0,"range":0,"noline":0,"dir":0}
- `node .../scratch/synthesis-inputs/cite-check.cjs . research/regrade-log.md`: {"ok":336,"missing":0,"range":0,"noline":0,"dir":0}
- Section 9 of research.md now states 658 and 336.
- All fourteen `### 0NN-*` headings present. `openhuman-full` present.
