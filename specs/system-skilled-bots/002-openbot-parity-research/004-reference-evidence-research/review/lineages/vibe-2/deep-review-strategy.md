# Deep Review Strategy - Reference Evidence Research (vibe-2 lineage)

## 1. OVERVIEW

### Purpose

Persistent brain for this review lineage. It records which dimensions remain, what was found (P0/P1/P2), which review approaches worked or failed, and where to focus next. Read at every iteration.

### Usage

- **Init:** populated from `deep-review-config.json` and the bounded context snapshot below.
- **Per iteration:** the reviewer reads Next Focus, reviews the assigned dimension and phase group, updates findings, marks dimensions complete, and sets the new Next Focus.
- **Mutability:** mutable, updated by the reviewer throughout the session.

---

## 2. TOPIC

Review of the finished reference evidence research for the OpenBot parity build: `research/research.md` (the synthesis), `research/regrade-log.md` and the 40 iteration records under `research/lineages/{vibe-1,vibe-2,pi-1,pi-2}/iterations/`. The review checks that each recommendation is backed by the reference and plan lines it cites, that grades are right, that rejected findings were rightly rejected, that no well-supported finding was missed, and that recommendations do not contradict each other, the packet decisions or the licence rules. Read-only against the research, the 003 build plan and the reference repos.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Not re-running the research. The review reads the finished synthesis and its evidence; it does not collect new reference evidence.
- Not editing the research, the regrade log, the iteration records, the 003 build plan or any reference repo.
- Not judging the 003 build plan's own quality except where the synthesis makes a claim about it.
- Not re-verifying all 688 resolving source tags; the review samples load-bearing citations and checks the ones behind each recommendation.

---

## 5. STOP CONDITIONS

- `config.stopPolicy` is `max-iterations` with `maxIterations: 10`. Convergence is telemetry only; the loop runs all ten iterations and stops with `maxIterationsReached`.
- A hard stop also applies on three consecutive failed iterations, on a missing or corrupt state file, or on a pause sentinel.

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
- P1 (Required): 0
- P2 (Suggestions): 9
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading the cited reference line and the cited plan line side by side, one row at a time: it separates a row whose reference half holds from a row whose plan half holds, and both P2 findings came from that split (iteration 1).
- Checking a row against another section of the same document: the 003 build-log finding surfaced only because section 4 states the tree difference correctly while the lift row does not (iteration 1).
- Reading the plan's own contract file when a row names it as an owner: `contracts/prompt-sections.md:15` contradicts the ownership clause the row attributes to it (iteration 1).
- Reading every `LICENSE` file and both `Cargo.toml` licence lines before judging the licence map: ten files, ten matches, so the map's central claim is settled in one sweep and the iteration could spend its budget on the secret rows instead (iteration 2).
- Following a guard's instruction to its plan-side consequence: the 008 pitfall 1 guard says "name the constants, lift no gate", and the finding surfaced only by asking which plan task then creates the file (iteration 2).
- Checking a reference claim against the reference's own import list rather than its prose: `patterns.rs:248-249` imports four base64 engines, which is what makes the encoded-forms gap real (iteration 2).
- Parsing all 332 regrade rows by script and grouping them by table heading: every cell of section 8's seven group rows and its totals row matched, which settled the count claim in one action instead of sampling (iteration 3).
- Reading the origin id back to the iteration file that produced it: `V1-10-1` looked like a reused id until `iteration-010.md:18-42` showed `F-10-1` is a compound finding with three sub-points, which turned a suspected defect into a ruled-out direction (iteration 3).
- Re-reading a rejection's own citation rather than trusting the outcome label: `regrade-log.md:29` marks a true fact `wrong`, and only the plan lines showed why the rejection is still right (iteration 3).
- Parsing section 3, section 4 and section 5 by script and summing them against section 8: 84 + 21 + 16 rows and 57 + 21 + 12 confirmed matched the totals row to the cell, which closed the completeness claim in one action (iteration 4).
- Reading the registry JSON rather than the prose when a count is disputed: `findings-registry.json` gave nine `openQuestions` and four `resolvedQuestions`, which is what showed section 12's table covers only part of the thirteen (iteration 4).
- Reading a phase opening against its own row count: the 005 opening names three items and the section holds six rows, which is how the undercount surfaced (iteration 5).
- Reading the plan line a differences row names, not just the reference line: the 006 kind-order row holds only because `approvals.md:5` lists delete first while the plan tests pay first and calls its order OpenBot's (iteration 5).
- Reading the reference type declaration when a row is about a set: `approvals.ts:62-69` declares seven `ActionKind` members against the plan's six, which the row that checks the kind list never mentions (iteration 6).
- Reading the reference's catch-all arm: `slack/api.rs:189` maps an unrecognised `ok: false` code to `Unknown`, which is what showed the row's "every other code is permanent" is a simplification with no delivery consequence (iteration 6).
- Resolving every source tag by script instead of sampling: 616 in `research.md` and 331 in `regrade-log.md` all resolve, which settled section 9's largest claim in one action (iteration 7).
- Recomputing a section's own counts from the tree it describes: 21 vendor folders, 20 manifests with a `license` line, 18 `GPL-3.0-only` and 2 `GPL-3.0-or-later`, matched section 9 exactly (iteration 7).
- Reading a ranked list's bracket numbers as a permutation: the sixteen entries run 1,2,3,11,4,5,7,6,8,9,10,12,13,14,15,16, which is exactly the two changes the paragraph states (iteration 8).
- Reading a skip row's cited README rather than the crate's size: `tinybox/README.md:3`, `tinycomputer/README.md:3` and `tinyhosts/README.md:3-4` each state the mechanism the row names (iteration 8).

---

- **Iteration 9 — the phase-by-phase citation read, run to the end.** Reading each phase section against the exact lines it cites, one phase at a time, found the one summary sentence that overstates its own table (`research.md:286`) and cleared every other row in 009-014. The approach has now been applied to all fourteen phases and section 5, and it is the reason the lineage can say the citations are exact rather than plausible.
- **Recomputing section 5's size column instead of trusting it.** Nine stated sizes, nine exact: 400/296, 507, 365, 167 plus a test file, 5 files and 1,775 lines, 25 files and 4,537 lines, 15 files and 3,612 lines, 12 lines. A column of numbers is the cheapest thing in a synthesis to get wrong and the easiest to check.
- **Reading the plan line a row says is stale, not just the row.** 009 pitfall 5 claims REQ-003 still says a bot at both caps is "always refused". `B/009-skills/spec.md:162` says exactly that, and `B/contracts/prompt-sections.md:212` says the opposite. The row is right, and the check took two reads.
- **Iteration 10 — reading the document own rules as the test.** The licence rule, D3, D4 and D5 are all stated in the document. Checking its content against its own stated rules found the one count that does not close (`research.md:34`) and cleared the licence rule across all 20 lift rows. A document that states its rules can be audited without a second opinion.
- **Recomputing a headline count from the surfaces it claims to summarise.** 121 kept plus 332 log rows is 453, and the sentence says 303. Section 13 names 303 as the merged registry key findings. Three reads, one arithmetic check, one finding that no single-section read could see.
- **Reading the four lineage state logs instead of trusting the synthesis summary.** They gave the raw findings count (271 once pi-2 repeated iteration 7 is deduped) and showed that 303 is not it. The logs are outside the review target, so they served as context evidence only.
## 9. WHAT FAILED

- Sampling only the `confirmed` rows for a phase group: eleven confirmed rows held, so the two findings came from the rows' descriptive clauses rather than their evidence. A pass that reads only the evidence half would have reported the group clean (iteration 1).
- Treating a resolving `[SOURCE:]` tag as proof: `C/openhuman-full.build.log` resolves and still does not sit where the row says it does (iteration 1).
- Reading a guard as a statement about the file it names: the 008 pitfall 1 guard names `secrets-guard.ts` and its constants but never says whether the file is still lifted, so the guard and T013 only reconcile if the builder reads both (iteration 2).
- Trying to settle a reference claim whose server file is absent: `server/src/approvals/service.ts` is not in the snapshot, so the 006 predicate-scope question cannot be closed from the reference and had to be recorded as an edge case (iteration 2).
- Reading an outcome label as a statement about the fact: `wrong` is used for a false fact at `regrade-log.md:338` and for a true fact with a false implication at `:29`, and the log defines neither, so the label alone cannot be audited (iteration 3).
- Treating a repeated origin id as a defect before reading the iteration file: `V1-10-1`, `V1-10-2` and `V1-10-3` each span up to seven tables, and only `iteration-010.md` showed they are compound and per-phase findings (iteration 3).
- Reading a section intro as a description of its table: section 12 says the table states where each of the thirteen questions stands, and the table holds twelve rows of which three are not registry questions (iteration 4).
- Expecting a thin phase section to mean a missing finding: 014 holds one row, but the 012-013-014 group's 38 log rows show 17 wrong and 19 out of scope, so the thinness is what the references offer (iteration 4).
- Trusting a phase opening's count as an inventory: the 005 opening says two design checks and one test, and the section carries six rows including a confirmed plan defect (iteration 5).
- Reading a decision id without its packet: `B/008-vault/spec.md:169` cites 008's own D6, not this packet's D6, and only the 008 line settles which (iteration 5).
- Reading a row's count as a count of the reference's variants: 011 lift row 3 says "three outcomes" and the reference declares four `ApiFailure` variants, but the row then names the three send outcomes it means (iteration 6).
- Treating a `weak` row's simplification as a defect: the `ok: false` catch-all maps to `Unknown`, yet the enum doc says nothing was applied, so the send did not land either way (iteration 6).
- Reading a resolving tag as proof of the claim: section 9 says a tag that resolves proves only that the line exists, and this iteration's script tests exactly that and no more (iteration 7).
- Counting section 7's bare `S1:133` and `S3:111` citations as tags: they are not `[SOURCE:]` tags, so they fall outside the 616 and had to be spot-checked by hand (iteration 7).
- Reading a ranked order as a re-sort: the list is the verifier's order with two named moves, so a reader who expects a fresh ranking sees an anomaly that is not there (iteration 8).
- Expecting a skip row to name a search: six of the seven say no new evidence, and section 1's absence rule asks for a search only when the claim is about the plan (iteration 8).

---

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### **005's crowded-at-28 claim is wrong.** Ruled out: `memory.js:11` sets `crowded: 28` beside `records: 60`. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **005's crowded-at-28 claim is wrong.** Ruled out: `memory.js:11` sets `crowded: 28` beside `records: 60`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **005's stable-id claim misreads turnstone.** Ruled out: `docs/memory.md:38-39` states the tuple identity and the upsert that preserves the id. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **005's stable-id claim misreads turnstone.** Ruled out: `docs/memory.md:38-39` states the tuple identity and the upsert that preserves the id.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **006 differences row 4 misreads the reference's credentials hand-off.** Ruled out: `docs/approvals.md:48-49` states the hand-off and the two buttons. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **006 differences row 4 misreads the reference's credentials hand-off.** Ruled out: `docs/approvals.md:48-49` states the hand-off and the two buttons.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **006 lift rows 3 and 4 break the licence rule.** Ruled out: row 1 of the same table carries `MIT [SOURCE: C/OpenBot-main/LICENSE:1-3]`, so the line is one row above in the same table. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **006 lift rows 3 and 4 break the licence rule.** Ruled out: row 1 of the same table carries `MIT [SOURCE: C/OpenBot-main/LICENSE:1-3]`, so the line is one row above in the same table.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **006 pitfall 1 is wrong because a classifier exists.** Ruled out: `approvals.ts:62-69` is a type declaration and the file holds no classify function. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **006 pitfall 1 is wrong because a classifier exists.** Ruled out: `approvals.ts:62-69` is a type declaration and the file holds no classify function.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **006's `remove` row is wrong because both kinds ask.** Ruled out: the row says so itself and only disputes the label. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **006's `remove` row is wrong because both kinds ask.** Ruled out: the row says so itself and only disputes the label.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **006's kind-order row is wrong because the plan's order is deliberate.** Ruled out: the plan calls its order "OpenBot's order" and cites line 5, which lists a different order. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **006's kind-order row is wrong because the plan's order is deliberate.** Ruled out: the plan calls its order "OpenBot's order" and cites line 5, which lists a different order.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **008 lift row 1 breaks the licence rule.** Ruled out: the section opening carries the Apache-2.0 line and the NOTICE line. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **008 lift row 1 breaks the licence rule.** Ruled out: the section opening carries the Apache-2.0 line and the NOTICE line.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **008's "decision D6" is a mis-citation of this packet's D6.** Ruled out: `spec.md:169` is 008's own decision, cited from the 008 line. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **008's "decision D6" is a mis-citation of this packet's D6.** Ruled out: `spec.md:169` is 008's own decision, cited from the 008 line.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **008's 4,095-byte bound is invented.** Ruled out: `design/backends.md:63-65` records the measurement and the echo. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **008's 4,095-byte bound is invented.** Ruled out: `design/backends.md:63-65` records the measurement and the echo.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **009 lift row 1's citation range is too wide.** Ruled out: `:81-96` is the whole `content()` method and the two lifted lines sit inside it at `:90-91`, so the range contains what the row claims. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **009 lift row 1's citation range is too wide.** Ruled out: `:81-96` is the whole `content()` method and the two lifted lines sit inside it at `:90-91`, so the range contains what the row claims.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **009 pitfall 6's `allowed-tools` claim is wrong.** Ruled out: the row's point is that the draft template's stated reason claims an effect the prompt loader does not give, which is a plan-side observation and does not depend on the reference. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **009 pitfall 6's `allowed-tools` claim is wrong.** Ruled out: the row's point is that the draft template's stated reason claims an effect the prompt loader does not give, which is a plan-side observation and does not depend on the reference.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **010's "No row" for lift is a gap.** Ruled out: the phase's one reference rule is a paste rule, which is a pitfall and not code to lift, and the section says so. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **010's "No row" for lift is a gap.** Ruled out: the phase's one reference rule is a paste rule, which is a pitfall and not code to lift, and the section says so.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **011 differences row 3's `unknown` state does not exist in the plan.** Ruled out: `records.md:187` names it as terminal. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **011 differences row 3's `unknown` state does not exist in the plan.** Ruled out: `records.md:187` names it as terminal.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **011 lift row 3's retryable set is wrong.** Ruled out: `slack/api.rs:150-190` retries `ratelimited` and exactly four transient codes. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **011 lift row 3's retryable set is wrong.** Ruled out: `slack/api.rs:150-190` retries `ratelimited` and exactly four transient codes.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **011 lift row 5 misreads the reference's conformance rule.** Ruled out: `conformance-rules.md:30-36` confirms the plan's fake transport is a synthetic transport, and the reference's kit forbids one. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **011 lift row 5 misreads the reference's conformance rule.** Ruled out: `conformance-rules.md:30-36` confirms the plan's fake transport is a synthetic transport, and the reference's kit forbids one.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **011 pitfall 1's offset rule is wrong.** Ruled out: `channel_ops.rs:1975-1977` moves the offset before continuing. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **011 pitfall 1's offset rule is wrong.** Ruled out: `channel_ops.rs:1975-1977` moves the offset before continuing.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **011 pitfall 2's window size is wrong.** Ruled out: `channel_types.rs:12` is 4,096 and `channel_core.rs:259-264` evicts at that size. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **011 pitfall 2's window size is wrong.** Ruled out: `channel_types.rs:12` is 4,096 and `channel_core.rs:259-264` evicts at that size.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **011's five GPL rows break the licence rule.** Ruled out: the section opening names the licence with two SOURCE tags and states that every row below is mirror-only. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **011's five GPL rows break the licence rule.** Ruled out: the section opening names the licence with two SOURCE tags and states that every row below is mirror-only.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **012's "No row" for lift hides a corpus that fits.** Ruled out: every cited corpus is an automated suite or a model trial, and 012 rules out a new automated test at `B/012-manual-testing-scenarios/spec.md:112` and `:114`. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **012's "No row" for lift hides a corpus that fits.** Ruled out: every cited corpus is an automated suite or a model trial, and 012 rules out a new automated test at `B/012-manual-testing-scenarios/spec.md:112` and `:114`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **013's "No row" for pitfalls is a skipped dimension.** Ruled out: the section names the residue gap as lift row 1 and says so in the pitfalls slot. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **013's "No row" for pitfalls is a skipped dimension.** Ruled out: the section names the residue gap as lift row 1 and says so in the pitfalls slot.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **014's "No row" for lift and differences is a skipped phase.** Ruled out: the section states that no reference runs a review loop, and the one transferable criterion is carried as pitfall 1. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **014's "No row" for lift and differences is a skipped phase.** Ruled out: the section states that no reference runs a review loop, and the one transferable criterion is carried as pitfall 1.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **303 is a typo for 453.** Ruled out: section 13 uses 303 independently as the merged registry's key-findings count, so the number is deliberate and the label is what is wrong. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **303 is a typo for 453.** Ruled out: section 13 uses 303 independently as the merged registry's key-findings count, so the number is deliberate and the label is what is wrong.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A phase heading is missing or misspelled.** Ruled out: all fourteen match the 003 folders character for character. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **A phase heading is missing or misspelled.** Ruled out: all fourteen match the 003 folders character for character.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A sampled rejection is itself wrong.** Ruled out: seven rows re-read against their cited lines, all seven hold. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **A sampled rejection is itself wrong.** Ruled out: seven rows re-read against their cited lines, all seven hold.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A source tag points at a missing path.** Ruled out: all 947 resolve. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **A source tag points at a missing path.** Ruled out: all 947 resolve.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A source tag's range runs past the end of its file.** Ruled out: every range falls inside its file. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **A source tag's range runs past the end of its file.** Ruled out: every range falls inside its file.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A tag uses a prefix section 1 does not define.** Ruled out: every tag expanded through the six defined prefixes. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **A tag uses a prefix section 1 does not define.** Ruled out: every tag expanded through the six defined prefixes.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A well-supported 012 finding was rejected as out of scope.** Ruled out: the phase's spec bounds it to a manual playbook, so an automated test is outside it. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **A well-supported 012 finding was rejected as out of scope.** Ruled out: the phase's spec bounds it to a manual playbook, so an automated test is outside it.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **D3 is violated by the review directory.** Ruled out: the untracked `review/` path is this lineage's own output inside the packet, and nothing outside the packet changed. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **D3 is violated by the review directory.** Ruled out: the untracked `review/` path is this lineage's own output inside the packet, and nothing outside the packet changed.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 13's "303 key findings" contradicts section 2's "303 raw findings" as a second finding.** Ruled out as a separate finding: it is the same defect seen from the other end, and it is recorded once as V2-R10-P2-001. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **Section 13's "303 key findings" contradicts section 2's "303 raw findings" as a second finding.** Ruled out as a separate finding: it is the same defect seen from the other end, and it is recorded once as V2-R10-P2-001.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 13's question counts are wrong.** Ruled out: 4 resolved plus 4 answered is 8, and 13 plus 3 pruned is 16. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **Section 13's question counts are wrong.** Ruled out: 4 resolved plus 4 answered is 8, and 13 plus 3 pruned is 16.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 5 candidate 11's "plus a test file" is wrong.** Ruled out: `connect-prompt.test.ts` sits beside `connect-prompt.ts`. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **Section 5 candidate 11's "plus a test file" is wrong.** Ruled out: `connect-prompt.test.ts` sits beside `connect-prompt.ts`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 5 candidate 12's line counts are estimates.** Ruled out: 400 and 296 recompute exactly. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **Section 5 candidate 12's line counts are estimates.** Ruled out: 400 and 296 recompute exactly.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 5 candidate 3's runtime figure is wrong.** Ruled out: the row cites `L/definition.ts:82` for the 900 s wall-clock budget and the row's own text is what the citation supports. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **Section 5 candidate 3's runtime figure is wrong.** Ruled out: the row cites `L/definition.ts:82` for the 900 s wall-clock budget and the row's own text is what the citation supports.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 5 candidate 8's "no test file beside it" is wrong.** Ruled out: `what-if.ts` is the only `what-if` file in `shared/`. -- RULED OUT (iteration 9, 1 attempt)
- What was tried: **Section 5 candidate 8's "no test file beside it" is wrong.** Ruled out: `what-if.ts` is the only `what-if` file in `shared/`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 5's stall-watchdog row misreads the reference.** Ruled out: `configuration.md:190-194` says what the row says. -- RULED OUT (iteration 8, 1 attempt)
- What was tried: **Section 5's stall-watchdog row misreads the reference.** Ruled out: `configuration.md:190-194` says what the row says.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 6's "(regrade log)" pointer is dangling.** Ruled out: `regrade-log.md:312` carries the claim. -- RULED OUT (iteration 8, 1 attempt)
- What was tried: **Section 6's "(regrade log)" pointer is dangling.** Ruled out: `regrade-log.md:312` carries the claim.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 6's closing bullet misreads S1 or the build spec.** Ruled out: `S1/research.md:168` and `B/spec.md:99` both say the per-action policy engine is a later packet. -- RULED OUT (iteration 8, 1 attempt)
- What was tried: **Section 6's closing bullet misreads S1 or the build spec.** Ruled out: `S1/research.md:168` and `B/spec.md:99` both say the per-action policy engine is a later packet.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 6's crate READMEs do not say what the skip rows claim.** Ruled out: all three READMEs state the mechanism named. -- RULED OUT (iteration 8, 1 attempt)
- What was tried: **Section 6's crate READMEs do not say what the skip rows claim.** Ruled out: all three READMEs state the mechanism named.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 7 misquotes S3 on 004 or 012.** Ruled out: `S3/research.md:111` and `:221` say what section 7 quotes. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **Section 7 misquotes S3 on 004 or 012.** Ruled out: `S3/research.md:111` and `:221` say what section 7 quotes.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 7 repeats findings instead of citing them.** Ruled out: its opening states the citation rule and its entries carry `S1/`, `S2/` and `S3/` line citations with a "New here" note each. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **Section 7 repeats findings instead of citing them.** Ruled out: its opening states the citation rule and its entries carry `S1/`, `S2/` and `S3/` line citations with a "New here" note each.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 8's counts are wrong.** Ruled out: all 332 rows were parsed and every cell matches. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **Section 8's counts are wrong.** Ruled out: all 332 rows were parsed and every cell matches.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 8's kept/confirmed/weak columns are wrong.** Ruled out: 84 + 21 + 16 rows and 57 + 21 + 12 confirmed sum to the totals row exactly. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **Section 8's kept/confirmed/weak columns are wrong.** Ruled out: 84 + 21 + 16 rows and 57 + 21 + 12 confirmed sum to the totals row exactly.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 9's `openhuman-tui` counts are wrong.** Ruled out: 55 files, 9,601 `.rs` lines, 9,526 under `src/`, in both checkouts. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **Section 9's `openhuman-tui` counts are wrong.** Ruled out: 55 files, 9,601 `.rs` lines, 9,526 under `src/`, in both checkouts.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 9's licence count is wrong.** Ruled out: 20 manifests with a line, 18 `GPL-3.0-only` and 2 `GPL-3.0-or-later`, and `tinyvoice` with none. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **Section 9's licence count is wrong.** Ruled out: 20 manifests with a line, 18 `GPL-3.0-only` and 2 `GPL-3.0-or-later`, and `tinyvoice` with none.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Section 9's tag counts are wrong.** Ruled out: 616 and 331 by direct count. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **Section 9's tag counts are wrong.** Ruled out: 616 and 331 by direct count.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The `not verified` row hides a rejection.** Ruled out: it names the unread module and keeps the verified half as 008 pitfall 2. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **The `not verified` row hides a rejection.** Ruled out: it names the unread module and keeps the verified half as 008 pitfall 2.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The `tinyeventqueues` line count in section 8 is wrong.** Ruled out: `crates/` is exactly 15,495 `.rs` lines and the tree totals 89,431. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **The `tinyeventqueues` line count in section 8 is wrong.** Ruled out: `crates/` is exactly 15,495 `.rs` lines and the tree totals 89,431.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The `tinymcp` claim in section 8 is wrong.** Ruled out: `lib.rs:1-6` is an MCP client and only `README.md:1` is the template header. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **The `tinymcp` claim in section 8 is wrong.** Ruled out: `lib.rs:1-6` is an MCP client and only `README.md:1` is the template header.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 001 double-print window is closed by an existing dedupe.** Ruled out: `data-model.md:45-53` and `:63-92` hold no `runId` dedupe between the `needs_you` and `working` groups. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **The 001 double-print window is closed by an existing dedupe.** Ruled out: `data-model.md:45-53` and `:63-92` hold no `runId` dedupe between the `needs_you` and `working` groups.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 002 firing-frame lift is a misreading of the reference.** Ruled out: `routine-firing.ts:9-13` is the three-sentence frame verbatim, and the doc comment at `:21-34` records the live failure the row describes. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **The 002 firing-frame lift is a misreading of the reference.** Ruled out: `routine-firing.ts:9-13` is the three-sentence frame verbatim, and the doc comment at `:21-34` records the live failure the row describes.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 003 paste pitfall rests on a crossterm version the plan does not pin.** Ruled out: `003-terminal-screen/005-answer-flow/plan.md:26` pins `crossterm 0.29`, and the synthesis's `0.29.0` is inside that range. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **The 003 paste pitfall rests on a crossterm version the plan does not pin.** Ruled out: `003-terminal-screen/005-answer-flow/plan.md:26` pins `crossterm 0.29`, and the synthesis's `0.29.0` is inside that range.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 004 lift row's "no notice is needed" is wrong for an Apache-2.0 source.** Ruled out: the row says "Mirror, copy no code, so no notice is needed", and a mirror with no copied text needs no notice under Apache-2.0 section 4. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **The 004 lift row's "no notice is needed" is wrong for an Apache-2.0 source.** Ruled out: the row says "Mirror, copy no code, so no notice is needed", and a mirror with no copied text needs no notice under Apache-2.0 section 4.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 006 grant bound is weaker than the row says.** Ruled out: `module-approval-contracts.md:35-43` and `engine.rs:1640-1645` both hold. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **The 006 grant bound is weaker than the row says.** Ruled out: `module-approval-contracts.md:35-43` and `engine.rs:1640-1645` both hold.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 008 pitfall 2 encoded-forms gap is overstated.** Ruled out: `patterns.rs:248-249` imports four base64 engines and the plan scans one padded form plus `encodeURIComponent`. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **The 008 pitfall 2 encoded-forms gap is overstated.** Ruled out: `patterns.rs:248-249` imports four base64 engines and the plan scans one padded form plus `encodeURIComponent`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 009 symlink claim is stale.** Ruled out: `.skilled/skills/local-webflow` is still a symlink to a folder outside the repository. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **The 009 symlink claim is stale.** Ruled out: `.skilled/skills/local-webflow` is still a symlink to a folder outside the repository.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The 011 send-error precedence guard is wrong because the plan already orders the flags.** Ruled out: `records.md:181-184` names no order and the `error` field at `:173` carries both flags with no precedence. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **The 011 send-error precedence guard is wrong because the plan already orders the flags.** Ruled out: `records.md:181-184` names no order and the `error` field at `:173` carries both flags with no precedence.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The Bottom Line's four lifts undercount section 3's twenty rows.** Ruled out: "worth taking" is evaluative and the list reads as a selection, and the guards list below it marks its own selection explicitly. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **The Bottom Line's four lifts undercount section 3's twenty rows.** Ruled out: "worth taking" is evaluative and the list reads as a selection, and the guards list below it marks its own selection explicitly.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The four resolved questions are missing from the document.** Ruled out: section 11 names all four seeds and marks each answered. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **The four resolved questions are missing from the document.** Ruled out: section 11 names all four seeds and marks each answered.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The licence map misgrades a repo.** Ruled out: all ten `LICENSE` files and the two `Cargo.toml` licence lines were read and match the document. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **The licence map misgrades a repo.** Ruled out: all ten `LICENSE` files and the two `Cargo.toml` licence lines were read and match the document.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The ranked order applies a change it does not state.** Ruled out: only candidate 11 and candidate 7 move, which is what the paragraph says. -- RULED OUT (iteration 8, 1 attempt)
- What was tried: **The ranked order applies a change it does not state.** Ruled out: only candidate 11 and candidate 7 move, which is what the paragraph says.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The ranked order drops or duplicates a candidate.** Ruled out: the sixteen bracket numbers are a permutation of 1 to 16. -- RULED OUT (iteration 8, 1 attempt)
- What was tried: **The ranked order drops or duplicates a candidate.** Ruled out: the sixteen bracket numbers are a permutation of 1 to 16.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The regrade log double-counts.** Ruled out: section 8's note explains that a log row can group several origins, and the 43 downgraded and 38 corrected rows are also kept rows in sections 3 to 5. -- RULED OUT (iteration 10, 1 attempt)
- What was tried: **The regrade log double-counts.** Ruled out: section 8's note explains that a log row can group several origins, and the 43 downgraded and 38 corrected rows are also kept rows in sections 3 to 5.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **The repeated origin ids are a defect.** Ruled out: `F-10-1`, `F-10-2` and `F-10-3` are compound or per-phase findings, and each row's claim column names the slice it judges. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **The repeated origin ids are a defect.** Ruled out: `F-10-1`, `F-10-2` and `F-10-3` are compound or per-phase findings, and each row's claim column names the slice it judges.
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

- The 002 firing-frame lift misreads the reference: `routine-firing.ts:9-13` holds the three sentences verbatim and `:21-34` records the live failure (iteration 1, evidence: `C/OpenBot-main/shared/routine-firing.ts:9-13`).
- The 003 paste pitfall rests on a crossterm version the plan does not pin: the plan pins `crossterm 0.29` and `0.29.0` is inside that range (iteration 1, evidence: `B/003-terminal-screen/005-answer-flow/plan.md:26`).
- The 001 double-print window is closed by an existing dedupe: `data-model.md:45-53` and `:63-92` hold no `runId` dedupe between the `needs_you` and `working` groups (iteration 1, evidence: `B/001-activity-and-actor/design/data-model.md:88`).
- The 004 lift row's "no notice is needed" is wrong for an Apache-2.0 source: a mirror with no copied text needs no notice under Apache-2.0 section 4 (iteration 1, evidence: `C/buzz-main/LICENSE:1-2`).
- The licence map misgrades a repo: all ten `LICENSE` files and the two `Cargo.toml` licence lines match the document, including the OpenMausBot `enterprise/` carve-out and the two GPL-3.0-only declarations (iteration 2, evidence: `C/rakazo-main/LICENSE:1-2`, `C/tinychannels-main/Cargo.toml:55`).
- The 008 pitfall 2 encoded-forms gap is overstated: `patterns.rs:248-249` imports `STANDARD`, `STANDARD_NO_PAD`, `URL_SAFE` and `URL_SAFE_NO_PAD`, so the reference builds four base64 forms and the plan scans one (iteration 2, evidence: `C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/src/patterns.rs:248-249`).
- The 009 symlink claim is stale: `.skilled/skills/local-webflow` is still a symlink to a folder outside the repository (iteration 2, evidence: `.gitignore:233`).
- The 011 send-error precedence guard is wrong because the plan already orders the flags: `records.md:181-184` names no order and the `error` field at `:173` carries both flags with no precedence (iteration 2, evidence: `B/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:181-184`).
- The 006 grant bound is weaker than the row says: `module-approval-contracts.md:35-43` states that a grant never overrides a denial, a Cron external effect, reviewed reuse or a human-only tool, and `engine.rs:1640-1645` refuses any answer but once or deny for the three native grants (iteration 2, evidence: `C/openhuman-full/vendor/tinysecurity/docs/module-approval-contracts.md:35-43`).
- Section 8's per-group counts are wrong: all 332 rows were parsed by script and every cell of the seven group rows and the totals row matches in all six outcome columns and in the kept/confirmed/weak columns (iteration 3, evidence: `research/regrade-log.md:1-372`).
- A sampled rejection is itself wrong: seven rows were re-read against the line each cites and all seven hold, including the 21 empty `openhuman-main/vendor/` folders and the `tiny-artifacts` README (iteration 3, evidence: `C/openhuman-main/vendor/`).
- The repeated origin ids are a defect: `V1-10-1`, `V1-10-2` and `V1-10-3` map to `F-10-1`, `F-10-2` and `F-10-3` of `iteration-010.md`, a compound finding and two per-phase tables, and each row's claim column names the slice it judges (iteration 3, evidence: `research/lineages/vibe-1/iterations/iteration-010.md:18-42`).
- The `tinyeventqueues` line count in section 8 is wrong: `crates/` is exactly 15,495 `.rs` lines and the tree totals 89,431 (iteration 3, evidence: `C/openhuman-full/vendor/tinyeventqueues/crates`).
- The `tinymcp` claim in section 8 is wrong: `crates/tinymcp/src/lib.rs:1-6` is an MCP client and only `README.md:1` is the template header (iteration 3, evidence: `C/openhuman-full/vendor/tinymcp/crates/tinymcp/src/lib.rs:1-6`).
- Section 8's kept, confirmed and weak columns are wrong: section 3 holds 84 rows (57 confirmed, 27 weak), section 4 holds 21 confirmed and section 5 holds 16 rows (12 confirmed, 4 weak), which sum to the totals row exactly (iteration 4, evidence: `research/research.md:64-515`).
- Section 13's question counts are wrong: four resolved plus four answered is eight, and thirteen plus three pruned is sixteen (iteration 4, evidence: `research/findings-registry.json`).
- A phase heading is missing or misspelled: all fourteen match the 003 folders character for character (iteration 4, evidence: `specs/system-skilled-bots/003-openbot-parity-build/`).
- The four resolved questions are missing from the document: section 11 names all four seeds and marks each answered (iteration 4, evidence: `research/research.md:694-697`).
- A well-supported 012 finding was rejected as out of scope: the phase's spec bounds it to a manual playbook, so an automated test is outside it (iteration 4, evidence: `B/012-manual-testing-scenarios/spec.md:3`).
- A 005 to 008 row cites a line that does not say what it claims: twenty-eight rows were read against their cited lines and every reference half and plan half resolves (iteration 5, evidence: `C/turnstone-main/docs/memory.md:38-39`).
- A 005 to 008 differences row names a plan line that already carries the guard: the kind order, the `remove` label and the `memory: false` contradiction all hold (iteration 5, evidence: `B/005-memory/spec.md:96`).
- 005's stable-id and crowded-at-28 claims misread the reference: `docs/memory.md:38-39` states the tuple identity and `memory.js:11` sets `crowded: 28` beside `records: 60` (iteration 5, evidence: `C/OpenGhost-main/memory.js:11`).
- 008's 4,095-byte bound is invented: `design/backends.md:63-65` records the measurement and the echo (iteration 5, evidence: `B/008-vault/design/backends.md:63-65`).
- 006 pitfall 1 is wrong because a classifier exists: `approvals.ts:62-69` is a type declaration and the file holds no classify function (iteration 6, evidence: `C/OpenBot-main/app/src/lib/approvals.ts:62-69`).
- 011 pitfall 1's offset rule is wrong: `channel_ops.rs:1975-1977` moves the offset before continuing (iteration 6, evidence: `C/tinychannels-main/src/providers/telegram/channel_ops.rs:1975-1977`).
- 011 pitfall 2's window size is wrong: `channel_types.rs:12` is 4,096 and `channel_core.rs:259-264` evicts at that size (iteration 6, evidence: `C/tinychannels-main/src/providers/telegram/channel_types.rs:12`).
- 011 lift row 3's retryable set is wrong: `slack/api.rs:150-190` retries `ratelimited` and exactly four transient codes (iteration 6, evidence: `C/tinychannels-main/src/providers/slack/api.rs:150-190`).
- 011 differences row 3's `unknown` state does not exist in the plan: `records.md:187` names it as terminal (iteration 6, evidence: `B/011-messaging-channels/002-adapter-and-record-contracts/design/records.md:187`).
- A source tag points at a missing path or an out-of-range line: all 947 tags resolve (iteration 7, evidence: `research/research.md`).
- Section 9's tag, licence or `openhuman-tui` counts are wrong: 616 and 331 tags, 20 manifests with 18 `GPL-3.0-only` and 2 `GPL-3.0-or-later`, and 55 files / 9,601 lines / 9,526 under `src/` all match (iteration 7, evidence: `C/openhuman-full/vendor/`).
- Section 7 misquotes S3 on 004 or 012: `S3/research.md:111` and `:221` say what section 7 quotes (iteration 7, evidence: `S3/research.md:111`).
- The ranked order drops or duplicates a candidate: the sixteen bracket numbers are a permutation of 1 to 16 (iteration 8, evidence: `research/research.md:497-512`).
- The ranked order applies a change it does not state: only candidate 11 and candidate 7 move (iteration 8, evidence: `research/research.md:495`).
- Section 5's stall-watchdog row misreads the reference: `configuration.md:190-194` says what the row says (iteration 8, evidence: `C/OpenBot-main/docs/configuration.md:190-194`).
- Section 6's crate READMEs do not say what the skip rows claim: all three state the mechanism named (iteration 8, evidence: `C/openhuman-full/vendor/tinybox/README.md:3`).
- Section 6's regrade-log pointer is dangling: `regrade-log.md:312` carries the OpenMausBot licence claim (iteration 8, evidence: `research/regrade-log.md:312`).

---

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- Dimension: none remaining — correctness and traceability are both complete across the whole target
- Focus area: synthesis — the review report, the Planning Packet built from the nine active findings, and the final verdict
- Reason: the iteration budget is spent at 10 of 10, and every configured dimension has been swept. The remaining work is to state the verdict and hand the findings to the merge.
- Rotation status: correctness complete for 001-014 and section 5; traceability complete for the packet decisions, the licence rule and the cross-cutting counts
- Blocked/productive carry-forward: productive — the cross-cutting read found the one count that does not close, which no single-phase read could see
- Required evidence: the nine active P2 findings, the findings registry, and the reducer's convergence figures
- Recovery note: not applicable

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers:** `research/research.md` (749 lines, 14 phase sections plus net-new, skip-list, overlap, regrade summary, citation check, eliminated alternatives, divergence map, open questions, convergence report); `research/regrade-log.md` (372 lines, 7 phase-group tables); 40 iteration records under `research/lineages/*/iterations/`.
- **Behavior claims to verify:** every `confirmed` row's cited lines say what the row claims; every `weak` row is written down to what its lines support; every `wrong` / `out of scope` / `duplicate` outcome in the regrade log is right; the licence map (MIT build; MIT and Apache-2.0 liftable with notice; GPL-3.0 design-only) is applied consistently; the net-new ranking does not contradict the skip list or the packet decisions D1-D6.
- **Reuse and conventions:** path prefixes `C/`, `B/`, `L/`, `S1/`, `S2/`, `S3/` are defined in section 1 of `research.md`. Grades are `confirmed` and `weak` only. Origin ids are `V1-n-m`, `V2-n-m`, `P1-n-m`, `P2-n-m`, `S`.
- **Review risks and gaps:** the synthesis states that every row except 20 hand-checked citations rests on one verification worker. The reference repos are gitignored and exist only in the primary checkout. The crossterm citations point outside the repository. `research/resource-map.md` lists 28 paths missing on disk.

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
| research/lineages/vibe-1/iterations/iteration-001.md .. 010 | - | - | - | pending |
| research/lineages/vibe-2/iterations/iteration-001.md .. 010 | - | - | - | pending |
| research/lineages/pi-1/iterations/iteration-001.md .. 010 | - | - | - | pending |
| research/lineages/pi-2/iterations/iteration-001.md .. 010 | - | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-2-1795770902266-zziqbr, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-27T09:16:04Z
<!-- MACHINE-OWNED: END -->
