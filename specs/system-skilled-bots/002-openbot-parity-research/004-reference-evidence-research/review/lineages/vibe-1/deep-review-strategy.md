# Deep Review Strategy - vibe-1 Lineage

## 1. OVERVIEW

### Purpose

Persistent brain for the `vibe-1` fan-out lineage of the reference-evidence review. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next.

### Usage

- **Init:** populated from `deep-review-config.json` and the pre-bound scope file.
- **Per iteration:** read Next Focus, review the assigned dimension/files, update findings, mark dimensions complete, set new Next Focus.
- **Mutability:** mutable, updated by the iteration agent throughout the session.

---

## 2. TOPIC

Review the finished reference evidence research in `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/`: the synthesis `research.md`, its `regrade-log.md` and the 40 iteration records under `research/lineages/`. Check that each recommendation is backed by the reference and plan lines it cites, that grades are right, that rejected findings were rightly rejected, that no well-supported finding was missed, and that recommendations do not contradict each other, the packet decisions or the licence rules. Read-only against the research, the 003 build plan and the reference repos.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-running the reference research itself, or adding new reference findings.
- Editing `research.md`, `regrade-log.md`, the iteration records, the 003 build plan, or any reference repo.
- Judging the 003 build plan's own quality except where a research recommendation depends on it.
- Re-litigating the packet's frozen decisions D1-D6.

---

## 5. STOP CONDITIONS

- `config.maxIterations` (10) reached: the run stops with `maxIterationsReached` regardless of convergence.
- Convergence below `0.10` is telemetry only; the loop broadens review angles instead of synthesizing early.
- Three consecutive failed iterations would stop the loop with `error`.

---

<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 17
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Counting by script over the artifacts the document names, instead of trusting its prose: the 90/31 grade split, the 332 outcome rows and every section 8 column reconciled exactly, which let the two real defects stand out from a background of correct numbers (iteration 1).
- Running the document's own named checker (`scratch/synthesis-inputs/cite-check.cjs`) read-only to reproduce section 9's table: it reproduced all four lineage rows and the 688/30 total, and surfaced the third bucket the table has no column for (iteration 1).
- Resolving every origin id against the record it names, by counting the findings each record actually holds. This is what surfaced the nine unresolvable ids; a content read of the same rows would not have (iteration 2).
- Opening the record a citation names rather than trusting the id: the four lifts, the licence lines and the 003/013/014 plan-side citations all held, which kept the iteration from reporting a content defect that was not there (iteration 2).
- Re-deriving a regrade verdict from the lines it cites instead of reading its reason text. Four `wrong` verdicts were re-derived independently and all four held, which is what let the iteration report the document's self-description rather than a rejection error (iteration 3).
- Opening the whole reference function a row cites, not the line range it names. The 008 pitfall 2 row cites `patterns.rs:248-249` for "four base64 forms", which is accurate; reading to `:280` showed the function returns eight forms, which is what surfaced the guard's two unnamed additions (iteration 4).
- Checking each `confirmed` security row's load-bearing sentence against the line it cites, rather than checking only that the citation resolves. That is what separated the hex addition (right) from its justification (uncited) (iteration 4).
- Scripting a census over the whole document instead of sampling sections: the table-heading census, the absence-claim census and the bare-form citation resolution together proved the structure clean in one pass, which let the two real self-description defects stand out (iteration 5).
- Reading a row's own hedge against the rest of the document. The 010 paste row calls its mechanism an inference while the 003 row carries the crossterm citations, which is a defect no single-section read would show (iteration 5).
- Counting against the store a summary sentence summarises, not against the sentence's own table. The four lineage `frontier-nodes.jsonl` files settled the depth-2 count at ten where section 11 says nine (iteration 6).
- Reading the earlier synthesis a section 7 bullet cites, to see which of its two offered resolutions the plan took. That is what separated two genuine closures from one accepted residual (iteration 6).
- Summing a table's own columns against the total its prose states. Section 4's 21 crates, 16 nested copies and 4,379,258 lines all reconciled, which proved the block clean and left only the two annotation defects (iteration 7).
- Running the command an evidence parenthetical names. The tinychannels row's `diff -rq` claim failed on the first run, and the row's conclusion survived, which is what made it a P2 rather than a P1 (iteration 7).
- Reading the plan line a summary sentence compresses. The licence paragraph gives MIT and Apache-2.0 the same single obligation, and the plan's §14 gives Apache-2.0 three; the comparison is what turned a plausible sentence into a finding (iteration 8).
- Counting a claim's scope instead of reading it. "Every row names the licence" holds for the lift tables and fails for the document, and only counting every numbered row showed which (iteration 8).
- Opening the artifact a summary sentence reports. The resource map's `MISSING` column is a mechanical resolution result, and reading all 28 rows showed 22 are citation forms rather than absent files (iteration 9).
- Probing the paths a summary calls missing against the document's own citations. The six genuinely absent paths are the short crate forms and `research.md` cites the long forms, which resolve, so the defect is the sentence and not the citations (iteration 9).
- Reading a summary's selection rule against the list beside it. The guards list states "The order is judgment" and the lift list does not, which is what showed four of twenty lift rows presented as a complete set (iteration 10).
- Checking a summary's counts against the tables they summarise, one count at a time. The six contradictions, five corrections, sixteen candidates and top three all held, which left the one unlabelled list as the only defect (iteration 10).

---

## 9. WHAT FAILED

- Counting findings with a single regex for the numbered-list form. `vibe-1` iterations 6-9 use `### F-<iteration>-<n> —` headings, so the first pass reported 0 findings for four records that hold 7 each. Caught by opening the records; the count was discarded, not reported (iteration 1).
- Treating the 303 figure as a narrative count before checking where section 2 attributes it. The registry holds exactly 303, so the direction was ruled out rather than reported (iteration 1).
- Reading the origin column as prose. The ids look plausible and sit beside valid ones, so a content read passes them; only counting the findings in each named record shows that nine of them point past the end (iteration 2).
- Treating the regrade log's outcome column as a partition of the findings. It is not: an origin can be marked `wrong` and still be credited on a surviving row for the part that held, so the first cross-reference count looked like a defect in the log until the reason text was read (iteration 3).
- Reading a guard as complete because its citation is accurate. The 008 pitfall 2 row's "four base64 forms" is exactly right about the reference, and the guard built on it still leaves two of the eight forms unnamed; a citation check alone passes the row (iteration 4).
- Accepting a `confirmed` grade as proof that every sentence in the row is line-supported. The hex addition's justification rests on a line about 0600 value files, and the row's own grade rule would put that sentence at `weak` (iteration 4).
- Trusting a summary sentence's count without a census. Section 2's "Three claims rest on inference" reads as complete and four more rows say a claim is inferred; only grepping every `infer` hit showed it (iteration 5).
- Reading a section in isolation. The 010 paste row's "Inferred" label looks honest until the 003 row's crossterm citations are read, and then it looks like an understatement (iteration 5).
- Trusting a summary sentence's count against its own table. Section 11 says nine depth-2 nodes and the table beneath it names ten; the sentence and the table were read in the same pass and still disagreed (iteration 6).
- Reading "closed" as "eliminated". Section 7's "The plan closed all three" is true only in the sense of "resolved", and the third finding was resolved by accepting the residual (iteration 6).
- Reading a ranked list's annotations as complete. Two of the four `weak` candidates carry a "Weak" flag in the ranked order and two do not, so the order reads as claiming the unflagged two are confirmed (iteration 7).
- Trusting an evidence parenthetical without running the command. The tinychannels row says `diff -rq` prints only `wiki/` lines and it prints 34 (iteration 7).
- Reading a licence summary as a pointer to the governing rule. "May be lifted with its notice" reads as complete until the plan's §14 is opened, and then it is missing two of Apache-2.0's three obligations (iteration 8).
- Reading "every row" as "every lift-table row". The sentence sits in the licence paragraph, which is about the document's discipline, and 49 of 101 numbered rows name no licence (iteration 8).
- Reading a resource-map status column as a statement about files. "28 missing on disk" is 28 rows the extractor could not resolve to one path, and 22 of them are line lists, globs, directory listings, a range and an annotated path (iteration 9).
- Reading a reading guide's exclusion sentence as complete. It names two of the six regrade outcomes, and the two it omits that are exclusions cover 144 findings (iteration 9).
- Reading a summary list as a complete set because it is numbered. The lift list is four items with no selection label, and section 3 carries twenty lift rows (iteration 10).
- Treating a summary's own counts as the thing to check and its lists as already checked. The counts all held and the unlabelled list did not (iteration 10).

---

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### **"Every one is GPL-3.0" as imprecise.** The table's licence column is precise, and section 9 states the 18/2/1 split independently. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **"Every one is GPL-3.0" as imprecise.** The table's licence column is precise, and section 9 states the 18/2/1 split independently.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **"The build is MIT" as wrong.** The repository `LICENSE` is MIT. -- RULED OUT (iteration 8, 1 attempt)
- What was tried: **"The build is MIT" as wrong.** The repository `LICENSE` is MIT.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **`tinytools`' licence as mis-stated.** Both its `LICENSE` and its manifest say GPL-3.0-only. -- RULED OUT (iteration 8, 1 attempt)
- What was tried: **`tinytools`' licence as mis-stated.** Both its `LICENSE` and its manifest say GPL-3.0-only.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A broken internal cross-reference.** All `section N` references name an existing section. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **A broken internal cross-reference.** All `section N` references name an existing section.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A candidate missing from or duplicated in the ranked order.** All 16 appear once. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **A candidate missing from or duplicated in the ranked order.** All 16 appear once.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A contradiction between section 2's lift list and section 10's eliminated alternatives.** They name different rakazo files. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **A contradiction between section 2's lift list and section 10's eliminated alternatives.** They name different rakazo files.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A correction in section 2 that section 7 does not carry.** All five appear. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **A correction in section 2 that section 7 does not carry.** All five appear.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A depends-on value naming a non-existent phase.** All resolve. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **A depends-on value naming a non-existent phase.** All resolve.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A licence error in the map.** Every licence line was read; the GPL/MIT/Apache split is right, and the "copy no code" rule is applied wherever a GPL source appears. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **A licence error in the map.** Every licence line was read; the GPL/MIT/Apache split is right, and the "copy no code" rule is applied wherever a GPL source appears.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A licence error in the map.** Re-confirmed: every repo's licence line is right. -- RULED OUT (iteration 8, 1 attempt)
- What was tried: **A licence error in the map.** Re-confirmed: every repo's licence line is right.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A missing or truncated section 8.** The table was suspected of being a summary that dropped rows. It is not: its seven group rows cover all fourteen phases plus the net-new group, and every column reconciles. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **A missing or truncated section 8.** The table was suspected of being a summary that dropped rows. It is not: its seven group rows cover all fourteen phases plus the net-new group, and every column reconciles.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A missing path in section 14.** Every one resolves. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **A missing path in section 14.** Every one resolves.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A missing seed in section 11.** All six appear. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **A missing seed in section 11.** All six appear.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A row telling a builder to lift GPL code.** No "Lift" row cites a GPL source. -- RULED OUT (iteration 8, 1 attempt)
- What was tried: **A row telling a builder to lift GPL code.** No "Lift" row cites a GPL source.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A section citing GPL without stating the rule.** All ten sections that cite a GPL source state it. -- RULED OUT (iteration 8, 1 attempt)
- What was tried: **A section citing GPL without stating the rule.** All ten sections that cite a GPL source state it.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **D4's citation rule as unmet.** 100 of 101 numbered rows carry a resolving tag, and the exception is a count row. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **D4's citation rule as unmet.** 100 of 101 numbered rows carry a resolving tag, and the exception is a count row.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **D5 as unmet.** Section 7 covers all 14 phases and the sampled entries split carried from new correctly; the 005 reversal cites S3 and says so. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **D5 as unmet.** Section 7 covers all 14 phases and the sampled entries split carried from new correctly; the 005 reversal cites S3 and says so.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **D6's premise as false.** `.gitignore:423` ignores the context folder. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **D6's premise as false.** `.gitignore:423` ignores the context folder.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 10's eliminated alternatives as unsupported.** Each row names the section 3 row or section 6 item that carries the evidence. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **Section 10's eliminated alternatives as unsupported.** Each row names the section 3 row or section 6 item that carries the evidence.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 11's per-lineage end states as wrong.** Both the vibe-2 and pi-2 rows match section 12's table. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **Section 11's per-lineage end states as wrong.** Both the vibe-2 and pi-2 rows match section 12's table.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 12's 12-row table as an arithmetic error.** The 4 registry-resolved questions are deliberately absent; the table states where the open and pruned questions stand after verification. The wording defect is already carried as `R2-P2-001`. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **Section 12's 12-row table as an arithmetic error.** The 4 registry-resolved questions are deliberately absent; the table states where the open and pruned questions stand after verification. The wording defect is already carried as `R2-P2-001`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 13's question arithmetic as wrong.** 4 + 4 + 3 + 5 = 16 and 13 + 3 = 16 both hold. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **Section 13's question arithmetic as wrong.** 4 + 4 + 3 + 5 = 16 and 13 + 3 = 16 both hold.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 2's "five corrections" as a miscount.** Five, and section 7 carries exactly five. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **Section 2's "five corrections" as a miscount.** Five, and section 7 carries exactly five.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 2's "six contradictions" as a miscount.** Six items. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **Section 2's "six contradictions" as a miscount.** Six items.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 2's "sixteen candidates" as a miscount.** Sixteen rows and sixteen ranked items. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **Section 2's "sixteen candidates" as a miscount.** Sixteen rows and sixteen ranked items.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 2's `FIRING_FRAME` claim as false.** No plan file carries the framing. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **Section 2's `FIRING_FRAME` claim as false.** No plan file carries the framing.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 4's crate counts as wrong.** 21 crates, 16 nested, and the line total reconciles exactly. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **Section 4's crate counts as wrong.** 21 crates, 16 nested, and the line total reconciles exactly.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 5's dependency column as decorative.** Each entry names the phases the candidate needs, and the two "None" entries are the two that need none. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **Section 5's dependency column as decorative.** Each entry names the phases the candidate needs, and the two "None" entries are the two that need none.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 5's sizes as inflated.** Eight spot-checked sizes are exact. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **Section 5's sizes as inflated.** Eight spot-checked sizes are exact.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 6 as a partial skip-list check.** S1's list holds seven rows and section 6 checks all seven. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **Section 6 as a partial skip-list check.** S1's list holds seven rows and section 6 checks all seven.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 7 as a D5 violation.** The sampled entries cite the earlier synthesis and put only the new part in section 3. The split holds for 002, 004 and 006. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **Section 7 as a D5 violation.** The sampled entries cite the earlier synthesis and put only the new part in section 3. The split holds for 002, 004 and 006.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 9's hand-check count as inflated.** The list holds exactly the 20 it claims. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **Section 9's hand-check count as inflated.** The list holds exactly the 20 it claims.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The "21 crates, not five" correction as wrong.** The table holds 21 and the run brief names five. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **The "21 crates, not five" correction as wrong.** The table holds 21 and the run brief names five.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The "seven drafts" count as wrong.** Exactly seven. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **The "seven drafts" count as wrong.** Exactly seven.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The `out of scope` verdicts as hiding a phase gap.** The sampled ones either belong to a phase outside the fourteen or survive as a net-new candidate; none names a phase requirement left uncovered. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **The `out of scope` verdicts as hiding a phase gap.** The sampled ones either belong to a phase outside the fourteen or survive as a net-new candidate; none names a phase requirement left uncovered.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The `tool-name.ts` correction as wrong.** The file is a display namer. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **The `tool-name.ts` correction as wrong.** The file is a display namer.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The `wrong` verdicts as a pattern of over-rejection.** Four were re-derived from their cited lines and all four hold; the rejections are grounded, not dismissive. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **The `wrong` verdicts as a pattern of over-rejection.** Four were re-derived from their cited lines and all four hold; the rejections are grounded, not dismissive.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 003 sanitizer row as a false accusation.** Both cited sources were read and neither replaces a control character with `?`. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **The 003 sanitizer row as a false accusation.** Both cited sources were read and neither replaces a control character with `?`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 004 and 010 "No row" entries as unsearched gaps.** Both sections state the absence as a search, and the 004 section names the one change it does recommend. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **The 004 and 010 "No row" entries as unsearched gaps.** Both sections state the absence as a search, and the 004 section names the one change it does recommend.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 006 deny-resume sentence as unsupported.** `approval-outcomes.ts:18-23` states it, and the row's guard is a rewording rather than a lift. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **The 006 deny-resume sentence as unsupported.** `approval-outcomes.ts:18-23` states it, and the row's guard is a rewording rather than a lift.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 006 kind-order correction as wrong.** `docs/approvals.md:5` lists a different order. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **The 006 kind-order correction as wrong.** `docs/approvals.md:5` lists a different order.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 008 pitfall 1 guard as over-broad.** Naming eight constants and lifting no environment gate is exactly what AC-010 needs, and the plan's own tests run under Vitest, which is the gate the guard removes. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **The 008 pitfall 1 guard as over-broad.** Naming eight constants and lifting no environment gate is exactly what AC-010 needs, and the plan's own tests run under Vitest, which is the gate the guard removes.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 008 pitfall 2 hex addition as unnecessary.** The vault stores the value's lowercase hex as the keychain password, so the hex form is a real representation of the value. The addition stands; only its justification is uncited. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **The 008 pitfall 2 hex addition as unnecessary.** The vault stores the value's lowercase hex as the keychain password, so the hex form is a real representation of the value. The addition stands; only its justification is uncited.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 008 pitfall 2 row as a false claim.** The reference does build the four base64 forms and the plan does miss them. The row's citation is accurate; only the guard's completeness fails. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **The 008 pitfall 2 row as a false claim.** The reference does build the four base64 forms and the plan does miss them. The row's citation is accurate; only the guard's completeness fails.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 009 symlink pitfall as hypothetical.** The symlink exists on disk today. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **The 009 symlink pitfall as hypothetical.** The symlink exists on disk today.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 011 clean-room pitfall as a rule violation.** Wave 0 reads and wave 1 writes, so the 003 rule is not broken; the row claims only that the rule is not carried, which the lines support. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **The 011 clean-room pitfall as a rule violation.** Wave 0 reads and wave 1 writes, so the 003 rule is not broken; the row claims only that the rule is not carried, which the lines support.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 011 lift table as unguarded.** Its opening paragraph carries the rule for all five rows. -- RULED OUT (iteration 8, 1 attempt)
- What was tried: **The 011 lift table as unguarded.** Its opening paragraph carries the rule for all five rows.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 014 and 013 plan-side citations as stale.** Both were read at the cited lines and both say what the rows claim. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **The 014 and 013 plan-side citations as stale.** Both were read at the cited lines and both say what the rows claim.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 14 phase pointers as ambiguous.** All point at this document's section 7, which is the overlap section. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **The 14 phase pointers as ambiguous.** All point at this document's section 7, which is the overlap section.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 303 figure as a narrative finding count.** The 40 records do not hold 303 numbered findings; they hold 241 numbered plus 28 heading-style, and the deltas hold 270 `type:"finding"` rows. Ruled out as a defect because section 2 attributes 303 to "the merged registry", and `research/findings-registry.json` holds exactly 303 `keyFindings`. The three populations differ, but the document claims only the one it can point at. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **The 303 figure as a narrative finding count.** The 40 records do not hold 303 numbered findings; they hold 241 numbered plus 28 heading-style, and the deltas hold 270 `type:"finding"` rows. Ruled out as a defect because section 2 attributes 303 to "the merged registry", and `research/findings-registry.json` holds exactly 303 `keyFindings`. The three populations differ, but the document claims only the one it can point at.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 40 iteration records as fewer than claimed.** Ten per lineage. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **The 40 iteration records as fewer than claimed.** Ten per lineage.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 59 dual-status origins as a defect in the regrade log itself.** The log's reason text usually says which part survived ("The narrow part, a refusal that names no repair, is kept as weak in 005 pitfall 1"), so the log is internally honest. The defect is in section 1's absolute rule, not in the log. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **The 59 dual-status origins as a defect in the regrade log itself.** The log's reason text usually says which part survived ("The narrow part, a refusal that names no repair, is kept as weak in 005 pitfall 1"), so the log is internally honest. The defect is in section 1's absolute rule, not in the log.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The bare `S1:133` form as a broken citation.** All 11 resolve in range, and section 1's prefix table makes the form readable. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **The bare `S1:133` form as a broken citation.** All 11 resolve in range, and section 1's prefix table makes the form readable.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The four lifts as unsupported or mis-cited.** All four were opened line by line and each says what the row claims, including the two OpenGhost lines and the rakazo constant set. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **The four lifts as unsupported or mis-cited.** All four were opened line by line and each says what the row claims, including the two OpenGhost lines and the rakazo constant set.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The notice requirement as unstated.** Every lifting row names it, and the three that copy no code say so. -- RULED OUT (iteration 8, 1 attempt)
- What was tried: **The notice requirement as unstated.** Every lifting row names it, and the three that copy no code say so.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The phase sections as structurally uneven.** All 14 carry all three headings, and the "No row" entries are honest. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **The phase sections as structurally uneven.** All 14 carry all three headings, and the "No row" entries are honest.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The ranked order's stated reasons as unsupported.** Both hold against the rows. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **The ranked order's stated reasons as unsupported.** Both hold against the rows.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The regrade log's outcome counts as inflated.** Counted independently by script over all 332 data rows; the six outcome values match section 2 and section 8 to the row. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **The regrade log's outcome counts as inflated.** Counted independently by script over all 332 data rows; the six outcome values match section 2 and section 8 to the row.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The resource map's 263 as wrong.** Both splits reconcile exactly. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **The resource map's 263 as wrong.** Both splits reconcile exactly.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The six absent resource-map paths as `research.md` citations.** The document cites the long forms, and all six resolve. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **The six absent resource-map paths as `research.md` citations.** The document cites the long forms, and all six resolve.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The topic's observed/inferred rule as dropped.** Section 1's `weak` grade definition covers "the claim is an inference the lines do not state", so the axis is encoded; the defect is the rows graded `confirmed` that carry an inference, which is `R4-P2-002` and finding 3 here. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **The topic's observed/inferred rule as dropped.** Section 1's `weak` grade definition covers "the claim is an inference the lines do not state", so the axis is encoded; the defect is the rows graded `confirmed` that carry an inference, which is `R4-P2-002` and finding 3 here.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- The 303 figure as a narrative finding count: section 2 attributes it to the merged registry, and `research/findings-registry.json` holds exactly 303 `keyFindings` (iteration 1, evidence: `research/findings-registry.json`).
- A missing or truncated section 8 reconciliation table: all seven group rows sum to the stated total in all ten columns (iteration 1, evidence: `research/research.md:640-658`).
- Inflated regrade-log outcome counts: counted independently by script over all 332 data rows, and the six outcome values match section 2 and section 8 (iteration 1, evidence: `research/regrade-log.md`).
- The four lifts section 2 names as unsupported or mis-cited: all four were opened line by line and each says what the row claims (iteration 2, evidence: `C/OpenBot-main/shared/routine-firing.ts:9-13`, `C/OpenGhost-main/skills.js:81-96`, `C/rakazo-main/packages/core/src/node/secrets-guard.ts:1-12`, `C/buzz-main/crates/buzz-acp/src/pool.rs:2284-2289`).
- A licence error in the section 2 and section 4 map: every licence line was read and the GPL/MIT/Apache split is right (iteration 2, evidence: `C/openhuman-full/Cargo.toml:35`, `C/tinychannels-main/LICENSE:1-2`, `C/buzz-main/Cargo.toml:46`, `C/OpenMausBot-main/LICENSING.md:6-9`).
- The 003 sanitizer row as a false accusation: both cited sources were read and neither replaces a control character with a question mark (iteration 2, evidence: `C/openhuman-full/crates/openhuman-tui/src/theme.rs:87-93`, `C/turnstone-main/turnstone/ui/colors.py:76-89`).
- The 014 and 013 plan-side citations as stale: both were read at the cited lines and both say what the rows claim (iteration 2, evidence: `B/014-deep-review/tasks.md:231`, `B/013-skilled-and-doc-alignment/tasks.md:254`).
- The `wrong` verdicts as a pattern of over-rejection: four were re-derived from their cited lines and all four hold (iteration 3, evidence: `B/contracts/prompt-sections.md:212`, `C/OpenBot-main/docs/automatic-learning.md:79`, `C/OpenGhost-main/memory.js:28-30`, `B/005-memory/design/module-contract.md:98`).
- The 59 dual-status origins as a defect in the regrade log itself: the log's reason text usually says which part survived, so the log is internally honest and the defect is in section 1's absolute rule (iteration 3).
- The `out of scope` verdicts as hiding a phase gap: the sampled ones either belong to a phase outside the fourteen or survive as a net-new candidate (iteration 3).
- The 008 pitfall 2 row as a false claim: the reference does build the four base64 forms and the plan does miss them, so the citation is accurate and only the guard's completeness fails (iteration 4, evidence: `C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/patterns.rs:248-280`, `B/008-vault/design/leak-checks.md:73`).
- The 011 clean-room pitfall as a rule violation: wave 0 reads the tinychannels source and wave 1 writes the module, so the 003 rule is not literally broken; the row claims only that the rule is not carried, which the lines support (iteration 4, evidence: `B/011-messaging-channels/005-polling-transports/plan.md:150`, `B/003-terminal-screen/001-ux-and-component-map/plan.md:168`).
- The 004 and 010 no-row entries as unsearched gaps: both sections state the absence as a search, and the 004 section names the one change it does recommend (iteration 4, evidence: `research/research.md:170`, `research/research.md:322`).
- Section 7 as a D5 violation: the sampled entries for 002, 004 and 006 cite the earlier synthesis and put only the new part in section 3 (iteration 5, evidence: `research/research.md:529-578`).
- Section 9's hand-check count as inflated: the list holds exactly the 20 citations the sentence claims (iteration 5, evidence: `research/research.md:661`).
- Section 13's question arithmetic as wrong: 4 registry-resolved plus 4 answered plus 3 partly plus 5 open is 16, and 13 registry questions plus 3 pruned nodes is 16 (iteration 5, evidence: `research/research.md:733-737`, `research/research.md:705-730`).
- The bare `S1:133` citation form as a broken citation: all 11 bare-form citations resolve inside the target file line count (iteration 5).
- The phase sections as structurally uneven: all 14 carry all three table headings, seven tables say "No row" and hold none, and no table is empty without saying so (iteration 5).
- D4's citation rule as unmet: 100 of 101 numbered rows carry a resolving `[SOURCE: path:line]`, and the exception is a section 8 count row rather than a finding (iteration 6).
- D5 as unmet: section 7 covers all 14 phases and the sampled entries split carried from new correctly, and the 005 positional-index reversal cites S3 and says it reverses it (iteration 6).
- D6's premise as false: `.gitignore:423` ignores `specs/**/context/`, so section 14's "gitignored" claim holds (iteration 6).
- Section 6 as a partial skip-list check: S1's skip list holds exactly seven rows and section 6 checks all seven in order, plus one eliminated alternative (iteration 6).
- Section 10's eliminated alternatives as unsupported: each of the fourteen rows names the section 3 row or section 6 item that carries the evidence (iteration 6).
- Section 11's per-lineage end states as wrong: vibe-2's three left open plus three pruned and pi-2's four left open both match section 12's table (iteration 6).
- Section 4's crate counts as wrong: 21 crates, 16 with a nested copy, and own plus nested lines equal the stated 4,379,258 exactly (iteration 7).
- Section 5's sizes as inflated: eight spot-checked sizes are exact to the line, including the two crate-level counts (iteration 7, evidence: `C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs`, `C/buzz-main/crates/ifc-core/src/lib.rs`, `C/OpenBot-main/shared/what-if.ts`, `C/hermes-muse-main/plugin.yaml`).
- The ranked order's stated reasons as unsupported: both stated changes hold against the rows they cite (iteration 7).
- "Every one is GPL-3.0" as imprecise: the table's licence column is precise and section 9 states the 18/2/1 split independently (iteration 7).
- The "21 crates, not five" correction as wrong: the table holds 21 rows and the run brief names five (iteration 7).

---

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- Dimension: none — the iteration budget is spent.
- Focus area: the synthesis phase, which reads the 17 open findings and the ten iteration records and writes the review report.
- Reason: `config.maxIterations` is 10 and this is iteration 10. The run did not converge: the last four iterations each produced two new P2s, and the novelty ratio stayed at 1.0 because every finding was new to the run.
- Rotation status: correctness three times (iterations 1, 3, 7), traceability twice (iterations 2, 6), security twice (iterations 4, 8), maintainability twice (iterations 5, 9), cross-reference synthesis once (iteration 10).
- Blocked/productive carry-forward: nothing blocked. Productive: reading a summary's selection rule against the list beside it, which is what showed the guards list states its rule and the lift list does not.
- Required evidence: the ten iteration records, the findings registry and the strategy file, all inside the lineage directory.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `research/research.md` (749 lines), `research/regrade-log.md` (372 lines), 40 iteration records under `research/lineages/{pi-1,pi-2,vibe-1,vibe-2}/iterations/`.
- Behavior claims: 303 raw findings, 121 surviving rows (90 confirmed, 31 weak), 332 regrade rows (106 wrong, 112 out of scope, 43 downgraded, 38 corrected citation, 32 already carried, 1 not verified).
- Reuse and conventions: path prefixes `C/`, `B/`, `L/`, `S1/`, `S2/`, `S3/`; origin ids `V1-3-2` style; grades `confirmed` / `weak`; licence rule MIT build, GPL-3.0 design-only.
- Review risks and gaps: the reference repos under `specs/system-skilled-bots/context/` are gitignored and may be absent; citations into them then cannot be re-opened and must be recorded as blocked rather than passed.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | - | - |
| `checklist_evidence` | core | pending | - | - |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pending | - | - |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| research/research.md | - | - | - | pending |
| research/regrade-log.md | - | - | - | pending |
| research/lineages/*/iterations/iteration-*.md (40) | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-27T09:14:53.505Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-27T09:15:46.018Z
<!-- MACHINE-OWNED: END -->
