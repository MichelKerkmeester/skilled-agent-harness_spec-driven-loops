# Iteration 1: Correctness — the bottom-line counts and the grade arithmetic

## Dispatcher

- Mode: review. Target agent: `@deep-review`. Execution: single review iteration, inline in the `vibe-1` fan-out lineage.
- Artifact directory: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/review/lineages/vibe-1`.
- Review target: the finished reference evidence research — `research/research.md`, `research/regrade-log.md`, and the 40 iteration records under `research/lineages/`.
- `steer.md` does not exist in the lineage directory at the time of this iteration; it is listed among the sources as absent.
- Dimension this iteration: correctness. Focus: whether the numbers section 2 states are the numbers the document's own tables and the regrade log actually hold.

## Files Reviewed

- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:32-62` (section 2, Bottom Line)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:620-660` (section 8, the per-group reconciliation table)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:661-690` (section 9, Citation Check)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/regrade-log.md:1-372` (all 332 data rows, counted by script)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/findings-registry.json` (303 `keyFindings`, 207 `ruledOutDirections`)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/scratch/synthesis-inputs/cite-check.cjs` (the checker section 9 names, run read-only)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Section 2 calls the regrade log "the rest" of the 303 findings, and the two populations overlap by 81 rows** -- `research/research.md:34` -- The sentence reads "Of 303 raw findings, 121 rows survive verification: 90 confirmed and 31 weak. The regrade log holds 332 rows for the rest". The two numbers do not partition 303: 121 + 332 = 453. Section 8 states the opposite of "the rest" in its own words, "A finding counted 'downgraded to weak' or 'citation corrected' is also a row in sections 3 to 5, in its corrected form" (`research/research.md:658`), and its table carries 43 downgraded plus 38 citation-corrected rows, which is 81 rows that sit in both documents. A reader who adds the two figures in section 2 gets a total the document never claims, and the one paragraph a builder is most likely to quote is the one that does not reconcile.
   Finding class: documentation-accuracy
   Scope proof: both figures are in `research/research.md:34`; the reconciliation is in `research/research.md:640-658`; the 43 and 38 are the `Downgraded to weak` and `Citation corrected` columns of that table, and the regrade log's own outcome column counts 43 and 38 (`research/regrade-log.md`, counted by script over all 332 data rows).
   Affected surface hints: `research/research.md:34`; any downstream document that quotes the 121/332 pair, including the packet's `implementation-summary.md`.
   Case: a builder reads section 2 alone, adds 121 and 332, and reports that the run produced 453 findings against a stated 303, or concludes the regrade log covers findings the document also carries and so double-counts the rejection rate.

2. **Section 9 says the checker resolved every source tag in the 40 records, and 3 tags are in neither column** -- `research/research.md:663-676` -- The table reports 688 resolved and 30 not resolved, 718 in total. The 40 records hold 721 `[SOURCE: ...]` tags. Running the named checker (`scratch/synthesis-inputs/cite-check.cjs`) over each lineage reproduces the table exactly for the two columns it defines — vibe-1 216/18, vibe-2 188/6, pi-1 139/1, pi-2 145/5 — and reports a third bucket the table has no column for: `dir: 3`, all three in vibe-2, tags that point at a directory rather than a file. The sentence "resolved every source tag in the 40 records" therefore covers 718 of 721, and the 3 that are neither resolved nor listed as failures are invisible to a reader checking the claim.
   Finding class: documentation-accuracy
   Scope proof: `research/research.md:663` states the scope ("every source tag in the 40 records"); the table at `:665-671` sums to 718; the tag count of 721 is a script count over `research/lineages/*/iterations/iteration-*.md`; the `dir: 3` bucket is the checker's own output for `research/lineages/vibe-2/iterations/iteration-*.md`.
   Affected surface hints: `research/research.md:663-676`; the `cite-check.cjs` invocation a later reader would rerun.
   Case: a reader reruns the named checker to audit section 9, gets 721 tags against the table's 718, and cannot tell from the document whether 3 tags were dropped, mis-parsed or deliberately excluded.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | The document's own counts were recomputed from the artifacts it names: 90 `confirmed` and 31 `weak` cells in `research/research.md` match section 2 and the section 8 total; the regrade log's outcome column holds 106 wrong, 112 out of scope, 43 downgraded, 38 citation-corrected, 32 duplicate and 1 not verified, which is the section 8 total row exactly. |
| `checklist_evidence` | pass | Every row of the section 8 per-group table was summed against its own total: rows kept 12+11+21+22+13+5+37 = 121, confirmed 90, weak 31, log rows 332, and each outcome column sums to its stated total. No column is off by one. |

## Integration Evidence

- `research/findings-registry.json` holds exactly 303 `keyFindings` and 207 `ruledOutDirections`, which is what section 13 states as "303 key findings, 207 ruled-out directions". The 303 figure in section 2 is therefore attributable to a file a reader can open, not to a narrative count.
- `scratch/synthesis-inputs/cite-check.cjs` exists and is the checker section 9 names; it was run read-only against the 40 records and the two final files.

## Edge Cases

- The 40 iteration records use two finding formats: a numbered list in `vibe-1` iterations 1-5 and 10 and in the other three lineages, and `### F-<iteration>-<n> —` headings in `vibe-1` iterations 6-9. A count that matches only the numbered form undercounts `vibe-1` by 28 findings. Recorded because a later iteration that counts findings must handle both, and because the first pass of this iteration made exactly that error before the records were opened.
- The regrade log's 332 rows cover 247 distinct origin ids, so a row can group several origins. Section 8 says so; section 2 does not. The ambiguity is in section 2's phrasing, not in the data.
- `research/lineages/pi-2/deep-research-state.jsonl` is named in section 12 as holding one `synthesis_complete` row carrying `vibe-1`'s lineage id. That is a research-run bookkeeping defect the document already discloses; it is not a defect in the document.

## Confirmed-Clean Surfaces

- Section 2's "121 rows survive verification: 90 confirmed and 31 weak" is exact: the document holds 90 `| confirmed |` cells and 31 `| weak |` cells.
- Section 8's total row is exact in all ten columns, and each of its seven group rows sums to that total.
- Section 9's per-lineage resolve and do-not-resolve columns are exact for all four lineages and for the 688/30 total, reproduced by running the named checker.
- Section 9's "616 tags in `research/research.md` and 331 in `research/regrade-log.md`, all of which resolve" is exact: 616 and 331 tags, and the checker reports 947 resolved with 0 missing, 0 range and 0 no-line across the two files.
- Section 13's "303 key findings, 207 ruled-out directions, convergence score 0.753" matches `research/findings-registry.json` field for field.

## Ruled Out

- **The 303 figure as a narrative finding count.** The 40 records do not hold 303 numbered findings; they hold 241 numbered plus 28 heading-style, and the deltas hold 270 `type:"finding"` rows. Ruled out as a defect because section 2 attributes 303 to "the merged registry", and `research/findings-registry.json` holds exactly 303 `keyFindings`. The three populations differ, but the document claims only the one it can point at.
- **A missing or truncated section 8.** The table was suspected of being a summary that dropped rows. It is not: its seven group rows cover all fourteen phases plus the net-new group, and every column reconciles.
- **The regrade log's outcome counts as inflated.** Counted independently by script over all 332 data rows; the six outcome values match section 2 and section 8 to the row.

## Next Focus

- Dimension: traceability
- Focus area: whether the load-bearing citations resolve and say what the row claims — the licence lines first, then the four lifts section 2 names.
- Reason: iteration 1 proved the arithmetic; the next risk is a row whose citation resolves but does not support its claim, which the document itself says is the failure mode a resolving tag cannot catch.
- Rotation status: correctness reviewed once; traceability not yet started.
- Blocked/productive carry-forward: nothing blocked. Productive: counting by script over the artifacts rather than trusting the prose.
- Required evidence: `research/research.md` sections 2, 3 and 4; the licence files under `specs/system-skilled-bots/context/`.

Review verdict: PASS
