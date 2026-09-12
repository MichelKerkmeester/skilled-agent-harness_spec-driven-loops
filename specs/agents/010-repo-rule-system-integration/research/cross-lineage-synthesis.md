# Cross-lineage synthesis: what three families establish that one could not

Sources read in full: `research/lineages/deepseek/iterations/iteration-001.md` through `010.md` (about 234 KB, DeepSeek V4.1 Flash at max effort, ten passes), `research/lineages/luna/iterations/iteration-001.md` through `005.md` (GPT-5.6 Luna at max effort, five passes, about 7 KB total), `research/lineages/glm/iterations/iteration-001.md` through `005.md` (GLM 5.3 Flash, one pass with content and four empty), and the earlier single-family synthesis at `research/synthesis.md`. The `deprecation-audit/` lineage in the same directory was excluded on instruction.

**GLM is one pass, not five.** Only `glm/iterations/iteration-001.md` carries model output (2,800 bytes). Iterations 002 through 005 are 149 to 196 bytes each and contain nothing but the advisor hook's JSON preamble. The file times show why: iteration-001's call ran from 22:13 to 22:21 and produced a full answer, then iterations 002 through 005 each wrote their file in the same second the hook fired, at 22:21, 22:31, 22:41 and 22:51. The route returned empty after its first call. Every statement below treats GLM as a single pass.

**Order of events, from file times.** DeepSeek wrote its ten iterations between 20:40 and 21:55. The earlier synthesis was written at 22:07. Between 22:09 and 22:11 the working tree was edited: the two local-only rules were symlinked into both sibling repositories, both sibling routers and `.gitignore` blocks were extended, `REPO RULES.md` trigger rows were repaired, and three lines of `AGENTS.md` were changed. Luna then ran from 22:15 to 22:28 and GLM from 22:13 to 22:51. So **DeepSeek read the pre-repair tree and the two narrow lineages read a partly repaired one**. This also explains a line in the earlier synthesis that now looks wrong. When it said two other lineages "produced nothing", that was true at 22:07. Luna and GLM were launched after it.

**One more thing about how the narrow lineages were run.** `luna/prior-findings.md` is 85 bytes and `glm/prior-findings.md` is 68 bytes. Both contain only empty iteration headers. `deepseek/prior-findings.md` is 54,465 bytes. The narrow briefs told each pass "Earlier iterations of this lineage already found the following. Do NOT repeat them. Go deeper, test what they assumed" and then handed them an empty list. Luna's five passes are therefore five independent samples of one prompt, not five deepening ones. That is better for corroboration and worse for adversarial depth, and both halves matter below.

---

## VERDICT

**The foundation holds, and that is the whole of what the narrow lineages bought.** All seven claims the session's work rests on come back CONFIRMED from two model families that never saw DeepSeek's output, and I re-derived five of the seven from the files directly. The load-bearing one is C2, that Gate 5 fires only on the first write of a session and never on a read-only turn. That single fact is what refused roughly forty candidate rules across ten DeepSeek passes, and it is now confirmed by three families reading the same line independently. The "zero new rules" result is safe to act on. So is the refusal to relocate the Restraint Signals table and the Confidence Thresholds bands, which two families confirm are single copies rather than duplicates.

**What the verification does not do is corroborate the survey.** Luna and GLM were pointed at seven claims. DeepSeek produced thirty ranked recommendations plus a long refusal register. Twenty-seven of the thirty are untouched by any second family. The seven claims are the floor the recommendations stand on, not the recommendations themselves, and confirming a floor is not confirming a building.

**In one place the narrow verification complicates rather than confirms.** C4 asked whether `repo-rules/uncertainty-and-honesty.md` carries a second copy of the confidence bands. Both families confirm it does not. DeepSeek separately found that thirty-six command assets under `.opencode/commands/` do carry a second confidence scale, and that one of them contradicts the framework operationally. Both findings are true. The narrow brief's scope made C4 structurally unable to reach the finding that matters, so a reader who sees "C4 CONFIRMED" and concludes the single-scale sentence is safe would be wrong.

**The arithmetic weakness the earlier synthesis named turns out not to be a DeepSeek defect.** Luna split against itself on the same measurement under an identical prompt: passes 1 through 4 said `AGENTS.md` is 501 lines, pass 5 said 502. GLM said 502. Both answers are right, because `wc -l` reports 501 and `awk 'END{print NR}'` reports 502 on a file with no trailing newline. I confirmed both numbers. A second family did not catch the convention mismatch, it reproduced it. What that costs is precision about the original claim: the earlier synthesis said a second family "would probably have caught" the length-table error, and the evidence now available says the opposite is at least as likely.

**And one intra-family contradiction the earlier synthesis missed.** Iteration 4 stated that every one of the eleven router trigger rows matches its rule's `Fires when` list and listed all eleven pairings as passing. Iterations 8 and 10 found five rows dropping a whole fire each plus two dropping keywords. I checked the pre-repair `REPO RULES.md` against the rule files and iterations 8 and 10 are right. So the family did catch its own error, twice, four and six passes later, which is evidence that iteration depth inside one family does some of the work a second family is supposed to do.

---

## CONFIRMED ACROSS FAMILIES

Seven claims, three families, and my own check of the files. "Me" below means I opened the cited lines in the current tree this session.

| Claim | Luna | GLM | DeepSeek | Me | What it settles |
|---|---|---|---|---|---|
| **C1.** The router says every firing trigger loads, not just the first, and three or four firing at once is normal | CONFIRMED, 5 of 5 passes | CONFIRMED | Stated as the canonical side in iterations 4, 6, 7, 10 | Confirmed at `REPO RULES.md:15-17` and `AGENTS.md:125` | The canonical half of ranked item 4 |
| **C2.** Gate 5 fires on the first write only, never on a read-only turn | CONFIRMED, 5 of 5 | CONFIRMED, with the consequence traced to `AGENTS.md:240` | Quoted in all ten passes as the deciding constraint | Confirmed at `AGENTS.md:122` and `:240` | The test that refused about forty candidate rules |
| **C3.** The Restraint Signals table in `AGENTS.md` is the only copy | CONFIRMED, 5 of 5 | CONFIRMED, and it went further, checking that the rule file's only other table is a different two-row table | Re-verified in iterations 1, 3, 5, 7, 8, 9, 10 | Confirmed: `prevent-overengineering.md:102` defers, the 7-row table sits at `AGENTS.md:220-226` | The refusal to relocate it is safe |
| **C4.** The Confidence Thresholds bands in `AGENTS.md` are the only copy in the rule set | CONFIRMED, 5 of 5 | CONFIRMED, read in full | Re-verified in the same six passes | Confirmed: `uncertainty-and-honesty.md:48-49` carries no table, bands at `AGENTS.md:92-97` | Safe as to the rule set only, see DISAGREEMENTS |
| **C5.** Eleven rule files, eleven trigger rows, eleven index rows | CONFIRMED, 5 of 5 | CONFIRMED | Re-verified in every one of the ten passes | Confirmed: 11 files, trigger rows at lines 40 to 50, index rows at 58 to 68 | Parity is not the weak point anyone feared |
| **C6.** No trigger phrase appears in two rule files | CONFIRMED, 5 of 5, with pass 4 counting 194 phrases | CONFIRMED, counting 194 phrases and naming where each block ends | Iteration 1 counted 194, iteration 6 measured 158 for the shared nine | Confirmed: 194 phrases, zero duplicates after case folding | One row of ranked item 8 is now three-family |
| **C7.** `AGENTS.md` is about 500 lines and `CLAUDE.md` is a symlink | CONFIRMED, 501 in passes 1 to 4 and 502 in pass 5 | CONFIRMED at 502, with an honest residual on the symlink | All ten passes said 502 | Confirmed: `wc -l` 501, `awk` 502, `CLAUDE.md` is a 9-byte symlink | Both numbers are right, see DISAGREEMENTS |

**What the agreement is worth.** For C2, C3, C4 and C5 it is worth a great deal, because these are the claims every refusal and every relocation decision turns on, and they are exactly the kind of claim a single family can talk itself into. Three families reading the same lines and reaching the same verdict removes that risk. For C1, C6 and C7 the agreement is worth less than it looks, because these are countable facts that any careful reader gets right, and getting them right does not test judgement. The asymmetry cuts the other way too. One broad lineage confirming a fact ten times is one opinion repeated. Two narrow lineages confirming it once each, having never seen that opinion, is genuinely independent. On these seven claims, the narrow lineages are the stronger evidence despite being the smaller effort.

**One item of partial cross-family support beyond the seven.** GLM's closing judgement independently nominated three blocks of `AGENTS.md` as content that does not earn being written out in full: the Git Workspace Safety table at `:326-335`, the Quick Reference table at `:450-474`, and the advisor metadata and hub routing paragraphs at `:112-114`. Those are the same three blocks DeepSeek argued about internally. GLM lands on the compress side of all three. That is not confirmation of DeepSeek's conclusion, it is a second family voting against it, and it is handled under DISAGREEMENTS.

---

## STILL SINGLE-SOURCE

Of the thirty ranked recommendations in the earlier synthesis, **zero were verified end to end by a second family**. Three have a fragment touched:

- **Item 4** (four surviving singular-load statements that contradict Gate 5). Both narrow families confirm the canonical side, that `AGENTS.md:125` and `REPO RULES.md:15-17` say every trigger loads. Neither was asked about the four contradicting surfaces, and by the time they ran, three of the four had already been fixed in the working tree. The contradiction itself stays single-source. One instance survives today at `AGENTS.md:304`, which still asks "LOADED the rule file it names?" in the singular.
- **Item 8** (sweep the authoring references' measurements). One row of roughly twenty-five is now three-family: the phrase count is 194 across eleven files with zero collisions, so `creation-standards.md:74` and `rule-anatomy.md:155`, which both say 161, are stale under any scope. Every other row in that item, including the length table where the arithmetic error lives, rests on DeepSeek plus the earlier synthesis author.
- **Item 22** (compress `AGENTS.md:112` and trim `:114`). A second family now argues for compressing, which moves this from a two-two split inside one family to a three-two split across two. It does not settle it, and the item was already marked low value by both sides.

**The twenty-seven that rest on DeepSeek alone.** Each of these carries exactly the weakness the earlier synthesis named about itself, and reading a finding ten times in one family's voice does not change that.

1. Decide the federation question for the two local-only rules. **Single-source and already executed.** I verified the outcome: both siblings now carry `handoff-and-questions.md` and `presenting-decisions.md` as symlinks created at 22:09, `Mobile CLI/repo-rules/` holds 17 entries against 17 trigger and 17 index rows, `Obsidian Plugin/repo-rules/` holds 14 against 14 and 14, and both `.gitignore` shared blocks went from nine entries to eleven. The seven broken references per sibling are gone. The evidence was sound, and the decision to act on it was made on one family's reading.
2. Repair the five trigger rows. **Single-source, contested inside the family, already executed.** Iteration 4 said the rows were fine and iterations 8 and 10 said five were not. The files at HEAD back 8 and 10.
3. Fix the section 8 attribution conflict. Single-source, already executed.
5. Repair the widening canon across six surfaces. Single-source, open. I confirmed all six carriers and the internal two-versus-three split inside `agents-md-integration.md` at lines 49 and 55.
6. Fix the ten skill files pointing at the wrong `AGENTS.md` section. Single-source, already executed. Exactly ten files now read "Section 5 decision tree".
7. Repair the two dead cross-references in `code-quality-standards.md`. Single-source, already executed. I confirmed both were broken at HEAD and both are fixed in the working tree.
9. Repair the sk-doc hub roster surfaces. Single-source, open. I confirmed `description.json:3` says thirteen, `graph-metadata.json:427` says fifteen, the registry holds fourteen, and `graph-metadata.json:352` cites a key file that lives under a different hub.
10. Reconcile `AGENTS.md:182` with what the router carries. Single-source, open.
11. Reconcile Gate 2's stated bar with the advisor's pair. Single-source, open. I confirmed the pair at `skill-advisor-hook.md:37` and `:135` and zero occurrences of 0.35 in `AGENTS.md`.
12. Resolve the second confidence scale in the command assets. Single-source, open, and the one place where a confirmed narrow claim gives false comfort.
13. Settle the Gate 2 tool naming across seven surfaces. Single-source, open. `sk-git/SKILL.md:587` still names the Python scorer.
14. Align `blast-radius.md:63` with its own section 3. Single-source, open, and the only rule-file wording change anyone proposed.
15. Repair the spliced blockquote in `prevent-overengineering.md:78`. Single-source, open, still present, and still shared into both siblings.
16. Port the hardened precedence block into the router template. Single-source, open. Only the template's singular-load sentence was fixed.
17. Add the federation mechanics to the rule-authoring references. Single-source, open, and item 1 was executed without it.
18. Give the rule corpus mechanical coverage. Single-source, open. I confirmed zero repo-rule matches across eighteen workflows and that the link checker's five roots exclude the repository root.
19. Refresh the skills front door. Single-source, open. Eleven claimed, thirteen on disk, five `sk-*` claimed, seven on disk.
20. Compress `AGENTS.md:192`. Single-source, open.
21. Compress the advisor mechanics in `AGENTS.md:101`. Single-source, open, and aimed at a line that was rewritten during the run.
23. Compress the exit-code parenthetical at `AGENTS.md:266`. Single-source, open.
24. Relocate the MEMORY SAVE mechanics bullets. Single-source, open, contested inside the family.
25. Name where refusals are recorded. Single-source, open.
26. Settle the version convention. Single-source, open.
27. Decide one reproducible distribution model for the sibling `AGENTS.md`. Single-source, open. I confirmed both siblings reach it by absolute symlink into this checkout.
28. Close the Gate 5 reach question for the mirror runtimes. Single-source, open, and partly unverified inside the lineage too.
29. Register the tier divergence in `rule-anatomy.md`. Single-source, open. I confirmed `skill-hub-routing.md:22` is the only `normal` tier among eleven.
30. Give `AGENTS.md:114` its bare reference a path. Single-source, open.
31. The six weak observations. Single-source, and the earlier synthesis already marks them thin.

---

## DISAGREEMENTS

**D1. Luna against itself, and against GLM, on the length of `AGENTS.md`.** Passes 1 through 4 say 501 lines, pass 5 says 502, GLM says 502 and calls it exact. The files settle it and both sides win: the file has 501 newlines and no trailing newline, so `wc -l` returns 501 and `awk 'END{print NR}'` and `grep -c ''` return 502. Pass 5 also cited `AGENTS.md:502` for its count, which is a real line and the last one. This is the same convention that produced the arithmetic error inside DeepSeek's length-table work, reproduced here by a different family under an identical prompt, four times one way and once the other. Treat it as a property of the measurement, not of a model.

**D2. GLM against DeepSeek on the Git Workspace Safety table and the Quick Reference table.** GLM's judgement names `AGENTS.md:326-335` ("ten rows of sk-git policy that the section itself says sk-git owns") and `:450-474` ("23 rows whose flows restate gates the document already carries") as content that does not earn full writeout, and it is right about the facts. I confirmed that `:324` and `:329` do hand the mechanics to sk-git, that `:455` re-encodes Gate 5, that `:468` re-encodes the completion rule, and that `:448` warns in the document's own voice that repeating an entry point "only creates a second copy to go stale". DeepSeek iterations 3, 5 and 7 refused both relocations on a different ground: the owner carries the content but does not load at the moment the content binds, because sk-git loads only through Gate 2 routing and `commands/README.txt` is auto-loaded by nothing.

**The files do not settle this, and the asymmetry is why.** GLM was instructed not to read beyond the files each claim named, so it could not check load timing on either surface, which is the exact test the refusal turns on. Its judgement is a second family's vote cast without access to the deciding evidence. DeepSeek's refusal stands on a mechanism GLM never examined. The honest reading is that DeepSeek's keep decision is unrefuted, and that a second family given the load-timing question is still owed.

**D3. GLM against Luna on how far C7 can be taken.** GLM alone recorded that a read-only toolset cannot distinguish a symlink from a byte-identical copy, and reported that residual inside a CONFIRMED verdict. Luna asserted flatly across all five passes that filesystem metadata shows the link. The files settle it for Luna: `ls -la` shows `CLAUDE.md` as a 9-byte symlink to `AGENTS.md`. GLM was right about its own tooling and wrong about the answer, which is the better failure mode of the two.

**D4. DeepSeek iteration 4 against iterations 8 and 10 on router row coverage.** Iteration 4 listed all eleven row-to-fires pairings as matching. Iterations 8 and 10 named five rows dropping a whole fire and two dropping keywords. The pre-repair files settle it for 8 and 10: at HEAD, the blast radius row omits "any call that leaves this machine", the root cause row omits the flake temptation, the uncertainty row omits naming an unverified path or number, and so on. The operator has since applied iteration 8's fix, which is independent confirmation of a kind. The earlier synthesis did not list this as a disagreement, and it is the clearest case in the whole run of one family correcting itself.

**D5. The length-table arithmetic, carried forward unresolved by any second family.** The earlier synthesis settled it internally by measuring with `wc -l` and found seven of nine rows exact. Neither Luna nor GLM was pointed anywhere near `rule-anatomy.md`, so the correction still rests on one measurement by one author. D1 shows the convention trap is real and model-independent, which raises rather than lowers the value of a second measurement here.

**D6. Iteration 5's malformed Doctor row, refuted for the second time.** Iteration 5 claimed `AGENTS.md:474` is broken at the byte level with a backslash before whitespace rather than before the pipe. I dumped the raw bytes: the sequence is `install\|debug`, backslash immediately before pipe, correctly escaped. The row is well formed. No other iteration repeated the claim and no narrow lineage was near it. It stays refuted.

**D7. Whether `AGENTS.md:112` and `:114` should compress.** DeepSeek was two for and two against. GLM adds a third voice for compressing, citing the same reason, that the owners are named right there. All parties agree the two binding sentences stay. The live question is a few lines of mechanism text, and it remains a judgement call worth almost nothing either way.

---

## CITATION CHECK

I opened the cited lines with `sed`, `grep`, `od`, `git show` and directory listings, and for claims about counts I recomputed the count rather than trusting the number.

**Luna: 30 distinct file and line targets across the five passes, all 30 opened, 0 outright failures.** Two defects of a lesser kind. First, three passes cite a file and line for a filesystem fact: pass 3 cites `CLAUDE.md:1` and pass 4 cites `AGENTS.md:1` as evidence that `CLAUDE.md` is a symlink. The fact is true and the citation does not carry it, since line 1 of either path is the same prose. Second, passes 1 and 5 cite `AGENTS.md:212-220` for the Restraint Signals table, which spans the heading through only the first data row. The table's rows are at 220 to 226. Passes 2, 3 and 4 cite `:212-226`, which is right. Both defects are loose pointing, not false claims.

**GLM: 25 distinct targets in its single substantive pass, all 25 opened, 0 outright failures.** One looseness: it calls `AGENTS.md:326-335` "ten rows of sk-git policy". That range is ten lines, of which two are the table header and separator and eight are policy rows. Everything else in that pass is exact, including the 23-row count for the Quick Reference table, the end lines of all eleven trigger phrase blocks (21 to 25), the 7-row Restraint Signals table at 218 to 226, and the observation that the rule file's only other table is a different two-row pair at 104 to 107. This is the most precisely cited output in the whole run, which is worth saying about a lineage that only managed one pass.

**DeepSeek: 74 distinct citations sampled, at least five from every one of the ten iterations, all opened.** Results:

- **1 outright failure.** Iteration 5's byte-level claim about `AGENTS.md:474`, refuted by `od -c` as described in D6. This is the same failure the earlier synthesis found, confirmed independently here.
- **1 off-by-one.** Iteration 4 cites `skill-advisor-hook.md:136` for the 0.8 and 0.35 pair. The pair is at `:135` and also at `:37`, which the same iteration cites correctly.
- **1 falsified claim that is not a citation defect.** Iteration 4's assertion that all eleven trigger rows match their rules' fires. Its citations resolve, its conclusion does not. See D4.
- **6 citations that no longer reproduce because the repair landed.** `AGENTS.md:405` (attribution now corrected), `AGENTS.md:455` (now says "load every"), `REPO RULES.md:4-5` (now says "every rule file"), `repo-rules-router-template.md:39-40` (same), the ten "Section 6 decision tree" lines (all ten now say Section 5), and `code-quality-standards.md:53` and `:81` (both now resolve). I verified every one of these against `git show HEAD:` and each was exactly as the iteration described at the time it ran. These are not failures and should not be counted as such.
- **Everything else resolved**, including all the load-bearing evidence behind items 1, 2, 5, 6, 7, 8, 9, 11, 12, 14, 15, 16, 18, 19 and 29. Checks I specifically tried to break and could not: the six `AGENTS.md` pointer lines naming the two local-only rules are at exactly 148, 175, 407, 409, 498 and 500. The widening canon really does state four different things across six surfaces. `.github` really does contain zero repo-rule references across eighteen workflows. The link checker's `ROOTS` really is five directories that exclude the repository root. The splice at `prevent-overengineering.md:78` is still there verbatim. And the sibling repositories really did reach 17 and 14 rule files after the promotion, which is the 15 and 12 the iterations measured plus the two that were added.

**Total: 129 distinct citations checked across the three lineages. 1 outright failure, all of it DeepSeek's, all of it already known.** The failure rate on the narrow lineages is zero, which is what a narrow brief with a small citation surface should produce and is not evidence of better care.

---

## WHAT THE ASYMMETRY COSTS

**Twenty-seven of thirty recommendations have no second reader.** Two narrow verifications corroborate the claims they were pointed at and nothing else. Every item in the single-source list above carries the full weight of one model family's reading, and several of them are edit sweeps across many files where a single systematic misreading would propagate silently.

**The most consequential finding in the run was never given to either narrow lineage, and has already been executed.** The federation, the seven broken references per sibling, and the promote-versus-rescope cost asymmetry were DeepSeek's alone. The operator acted on it between the synthesis and the narrow runs. I verified the end state directly and it is correct, so nothing is broken. What is worth naming is the process: the highest blast-radius change in the packet was made on evidence one family produced and no one else checked before the fact.

**The narrow briefs made their own judgement answers un-evidenced by construction.** Both briefs said "Do not read any file not named above" and then asked, as a closing question, which parts of `AGENTS.md` do not earn being written out in full. The answer to that question depends entirely on load timing, which lives in files the brief forbade opening. Every relocation answer the narrow lineages gave is therefore a hunch with a line number attached. That is not a criticism of the models. It is a criticism of asking a survey question at the end of a verification brief.

**No adversarial deepening happened in either narrow lineage.** The prior-findings files are 85 and 68 bytes of empty headers. Five Luna passes are five samples of the same prompt, and the four extra passes bought variance information (the 501 versus 502 split) rather than depth. If the intent was five progressively harder attacks on the same seven claims, that did not run. Re-running Luna with a populated prior-findings file is the cheapest available way to get something the run has not yet produced.

**Nothing was executed by any lineage, and that has not changed.** No pass ran `validate.sh`, CI, the doctor, or the advisor. My own checks were reads, greps, byte dumps and directory listings. The claim that no CI reads the rule corpus is still a grep result. The claim that a checker would have caught the federation breakage is still untested, and now less testable, because the breakage has been repaired.

**Three questions the run still cannot answer.** The fourth federated repository named in the audit packet is still not on this machine, so federation state is known for three repositories and unknown for one. Whether Codex and Cursor natively load the root `AGENTS.md` is still asserted nowhere in the repository, which means every relocation proposal still assumes a reach nothing measures. And no lineage read git history, so every "this drifted" finding still says what the state is and not when or why it got there.

**Finally, the tree has moved again since all three lineages ran.** Items 1, 3, 6 and 7 are executed, item 2 is executed, and item 4 is executed in three of its four places with `AGENTS.md:304` still singular. Every line number in this report and in the earlier synthesis is state as of this session. Re-check before editing.
