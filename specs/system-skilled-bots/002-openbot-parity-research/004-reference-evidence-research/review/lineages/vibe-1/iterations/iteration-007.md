# Review Iteration 7

## Dispatcher

- Lineage: `vibe-1`, iteration 7 of 10, mode `review`, target agent `deep-review`, agent definition loaded.
- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Artifact directory: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/review/lineages/vibe-1`
- `steer.md`: absent at dispatch time. No lead ruling was available for this iteration.
- Review target: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/` (read-only).

PRE-BOUND SETUP ANSWERS, emitted as bindings:

```
BINDING: target=specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research
BINDING: maxIterations=10
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,traceability,security,maintainability
BINDING: specFolder=specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research
```

## Files Reviewed

| File | Lines read | Why |
|---|---|---|
| `research/research.md` | 438-467 (section 4), 468-515 (section 5) | The crate table and the net-new candidates with their sizes and ranking |
| `research/research.md` | whole file, scripted | Summing the crate table's own and nested line counts |
| `C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/src/host_tool.rs` | `wc -l` | Candidate 1's size |
| `C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/` | `find` and `wc -l` | Candidate 1's crate size |
| `C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-redact/` | `find` and `wc -l` | Candidate 5's size |
| `C/buzz-main/crates/ifc-core/src/lib.rs` | `wc -l` | Candidate 6's size |
| `C/OpenBot-main/shared/what-if.ts` | `wc -l` | Candidate 8's size |
| `C/OpenBot-main/shared/audit-words.ts` | `wc -l` | Candidate 12's size |
| `C/OpenBot-main/shared/tool-name-words.ts` | `wc -l` | Candidate 12's size |
| `C/hermes-muse-main/plugin.yaml` | `wc -l` | Candidate 16's size |
| `C/tinychannels-main` against `C/openhuman-full/vendor/tinychannels` | `diff -rq` | The tinychannels row's "prints only `wiki/` lines" claim |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R2-P1-001` remains active and is carried forward unchanged.

### P2 Findings

1. **The ranked order flags two of the four `weak` candidates and ranks the other two in the top four without a flag** -- `research/research.md:499` -- Four candidates are graded `weak` in the table: 3 (stall watchdog), 6 (reader-set labels), 10 (long-ask acknowledgement) and 11 (next-step text) [SOURCE: research/research.md:479] [SOURCE: research/research.md:482] [SOURCE: research/research.md:486] [SOURCE: research/research.md:487]. The ranked order flags two of them in the entry itself: "8. Reader-set labels (6). ... Weak, because the leak path is inferred" and "11. Long-ask acknowledgement ... (10). Weak, because the plan already returns the result at run end" [SOURCE: research/research.md:504] [SOURCE: research/research.md:507]. The other two carry no flag: "3. Stall watchdog (3). One timer and one cause" and "4. Next-step text on refusals (11). A table of sentences, MIT as a pattern, and wanted by three phases" [SOURCE: research/research.md:499] [SOURCE: research/research.md:500]. So the two weakest-ranked entries are annotated and the two ranked third and fourth are not, which reads as a claim that those two are `confirmed`. The order's own preamble says it weighs "who notices the absence and how soon, how small a file-backed version is and whether the reference may be lifted or only mirrored", and does not say it weighs the grade, so the flags are the only signal a reader gets.
   Finding class: `annotation-inconsistency`
   Scope proof: the finding is inside the declared review target (`research/research.md:499`) and cites the four table rows and the four ranked entries. No file outside the target was modified.
   Affected surface hints: `research/research.md:499` and `:500` (the unflagged entries), `:504` and `:507` (the flagged ones), `:479`, `:482`, `:486`, `:487` (the table grades).
   Case: a builder reads only the ranked order, which is the document's headline answer, and takes the stall watchdog and the next-step text as verified rows. Both are `weak`: the watchdog's reference has no implementation in the checkout, and the next-step text is a pattern transfer from an OAuth surface the skip list excludes.

2. **The tinychannels row says `diff -rq` prints only `wiki/` lines, and it prints 34 lines of which 13 are `wiki/`** -- `research/research.md:448` -- The row reads "It equals `C/tinychannels-main` plus 12 extra files under `wiki/` (`diff -rq` prints only `wiki/` lines), so it adds nothing to code reading". Running the diff prints 34 lines: 13 `wiki/` entries (`.git` plus twelve `.md` files), 20 `Only in .../vendor/tinybus:` entries for the nested copy, and one line reporting that `.git` is a directory in `tinychannels-main` and a regular file in the vendored copy. The conclusion still holds, because the row's own counting rule excludes the nested `vendor/` and the table's bracket column already carries tinybus's 79,755 lines [SOURCE: research/research.md:440]. What fails is the parenthetical, which is offered as the evidence for the conclusion and is false as written. The "12 extra files under `wiki/`" half is right.
   Finding class: `false-evidence`
   Scope proof: the finding is inside the declared review target (`research/research.md:448`) and was checked by running the diff the row names against the two reference trees. No file outside the target was modified.
   Affected surface hints: `research/research.md:448` (the tinychannels row), `:440` (the counting rule that excludes nested `vendor/`).
   Case: a reader runs the diff the row names to confirm the vendored copy adds nothing, gets 34 lines including a nested `tinybus` tree, and cannot tell whether the row's author ran the same command or a narrower one.

## Traceability Checks

| # | Check | Result |
|---|---|---|
| 1 | Section 4's crate count matches the table | Pass. 21 rows, and the prose says "There are 21 crates, not the five the run brief named" |
| 2 | Section 4's "16 of the 21 vendor a further copy" matches the bracket column | Pass. Exactly 16 rows carry a non-zero nested count and 5 carry zero |
| 3 | Section 4's whole-tree line total reconciles with the table | Pass. Own lines 1,709,254 plus nested 2,670,004 is 4,379,258, exactly the stated total |
| 4 | Section 4's licence column matches section 9's 18/2/1 split | Pass. 18 rows say `GPL-3.0-only`, 2 say `GPL-3.0-or-later` (`tinyflows`, `tinyhumans-sdk`), and `tinyvoice` takes its licence from its `LICENSE` file |
| 5 | Section 4's `tinyeventqueues` arithmetic | Pass. 15,495 own plus 73,936 nested is 89,431, the figure the row says is the lineages' count |
| 6 | Section 5's sizes are exact | Pass for eight spot-checked rows: `host_tool.rs` 166 lines, the policy crate 38 `.rs` files and 13,144 lines, `tinysecurity-redact` 15 `.rs` files and 4,124 lines, `ifc-core/src/lib.rs` 507 lines, `what-if.ts` 365 lines, `audit-words.ts` 400 lines, `tool-name-words.ts` 296 lines, `plugin.yaml` 12 lines |
| 7 | The ranked order's two stated changes hold against the rows | Pass. Candidate 11's promotion rests on 005 pitfall 1, 008 pitfall 4 and 007's refusals, all of which ask for next-step text; candidate 7's move above candidate 6 rests on 009 pitfall 2, which needs a live scenario |
| 8 | Every `weak` candidate is flagged in the ranked order | **Fail.** Candidates 3 and 11 are not. Reported as finding 1 |
| 9 | Every evidence parenthetical in section 4 is true of the command it names | **Fail.** The tinychannels row's diff claim is false. Reported as finding 2 |

## Integration Evidence

- `C/openhuman-full/vendor/tinysecurity/crates/tinysecurity-policy/` and `.../tinysecurity-redact/` are the crates candidates 1 and 5 size. Read with `find` and `wc -l`, not modified.
- `C/buzz-main/crates/ifc-core/src/lib.rs`, `C/OpenBot-main/shared/what-if.ts`, `C/OpenBot-main/shared/audit-words.ts`, `C/OpenBot-main/shared/tool-name-words.ts` and `C/hermes-muse-main/plugin.yaml` are the files candidates 6, 8, 12 and 16 size. Read with `wc -l`, not modified.
- `C/tinychannels-main` and `C/openhuman-full/vendor/tinychannels` are the two trees the tinychannels row compares. Read with `diff -rq`, not modified.

No command, workflow, skill, MCP tool, caller agent or runtime mirror was modified. The append gateway and the reducer were run as the workflow runs them.

## Edge Cases

- **The ranked order's flags could be read as reasons rather than grade markers.** Adjudicated against that reading: both flags use the word "Weak" and both name the reason the row is weak, and the table's grade column is the only other place the word appears. So they are grade markers, and their absence on two `weak` rows is a gap.
- **The tinychannels parenthetical could be read as scoped to the files that count.** Adjudicated against that reading: the sentence says "`diff -rq` prints only `wiki/` lines", which is a claim about the command's output, and the output has 34 lines. The row's conclusion survives either way, which is why this is a P2.
- **The `.git` type difference is a submodule artifact.** It is not evidence of a code difference, and it is counted here only because the parenthetical claims the diff prints nothing else.
- **`steer.md` is absent.** Recorded rather than treated as a missing input.

## Confirmed-Clean Surfaces

- **Section 4's arithmetic**: 21 crates, 16 with a nested copy, own plus nested lines equal to the stated 4,379,258, and the `tinyeventqueues` 15,495 + 73,936 = 89,431 example exact.
- **Section 4's licence column**: 18 `GPL-3.0-only`, 2 `GPL-3.0-or-later`, and `tinyvoice` correctly flagged as having no workspace `license` key, which matches section 9's independent count.
- **Section 4's five-crate correction**: the run brief names five vendored crates and the table holds 21, so the correction in section 2 is right.
- **Section 5's sizes**: eight spot-checked rows are exact to the line, including the two crate-level counts.
- **Section 5's ranked order reasons**: both stated changes hold against the rows they cite.
- **Section 5's dependency column**: each candidate names the phases it needs, and the two with "None" are the two that need no phase.
- **Section 5's "What would change the order"**: names the two candidates a team without a group chat can drop and the one a flat-rate team cares less about, and each matches that candidate's "Who notices its absence" cell.

## Ruled Out

- **Section 4's crate counts as wrong.** 21 crates, 16 nested, and the line total reconciles exactly.
- **Section 5's sizes as inflated.** Eight spot-checked sizes are exact.
- **The ranked order's stated reasons as unsupported.** Both hold against the rows.
- **"Every one is GPL-3.0" as imprecise.** The table's licence column is precise, and section 9 states the 18/2/1 split independently.
- **The "21 crates, not five" correction as wrong.** The table holds 21 and the run brief names five.
- **Section 5's dependency column as decorative.** Each entry names the phases the candidate needs, and the two "None" entries are the two that need none.

## Next Focus

- Dimension: security
- Focus area: the licence rule across every row — whether each GPL source is marked design-only, whether any row tells a builder to copy code from a GPL source, and whether the MIT and Apache-2.0 rows name the notice they need.
- Reason: the licence map is the document's hardest constraint and section 2 says it "rules most of the new material out as code". Iteration 2 checked the licence lines themselves; this pass checks the instruction each row gives, which is the part a builder acts on.
- Rotation status: correctness three times (iterations 1, 3, 7), traceability twice (iterations 2, 6), security once (iteration 4), maintainability once (iteration 5).
- Blocked/productive carry-forward: nothing blocked. Productive: summing a table's own columns against the total the prose states, which is what proved section 4 clean and left only the two annotation defects.
- Required evidence: `research/research.md:64-437` (every row's licence and instruction), `:438-467` (section 4), and the `LICENSE` and `Cargo.toml` lines each row cites.

Review verdict: CONDITIONAL
