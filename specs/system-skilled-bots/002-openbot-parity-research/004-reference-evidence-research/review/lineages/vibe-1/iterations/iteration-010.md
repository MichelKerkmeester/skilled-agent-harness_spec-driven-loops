# Review Iteration 10

## Dispatcher

- Lineage: `vibe-1`, iteration 10 of 10, mode `review`, target agent `deep-review`, agent definition loaded.
- Resolved route: `Resolved route: mode=review target_agent=deep-review`
- Artifact directory: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/review/lineages/vibe-1`
- `steer.md`: absent at dispatch time. No lead ruling was available for this iteration.
- Review target: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/` (read-only).
- This is the final iteration. The synthesis phase follows.

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
| `research/research.md` | 32-63 (section 2), 468-515 (section 5), 516-528 (section 6), 529-620 (section 7), 665-685 (section 10), 686-704 (section 11) | Whether the recommendations hold together |
| `research/research.md` | whole file, scripted | Lift/diff/pitfall row census per phase, ranked-order coverage, depends-on values |
| `research/lineages/*/iterations/` | the 40 records, via the section 8 and 9 counts already verified | The counts section 2 reports |
| `scratch/frontier-seed.json` | whole file | Whether section 11 covers all six seeds |
| `B/002-routine-layer/spec.md` | 64, 195, 212 | Whether the plan carries a firing frame |
| `B/006-approval-grants/spec.md` | 99, 159, 161, 164, 205, 271 | The kind-order and store-keying claims |
| `C/OpenBot-main/shared/tool-name.ts` | 1-30 | Whether it is a classifier, as S3 says |
| `C/OpenBot-main/docs/approvals.md` | 5 | The kind order the plan attributes to OpenBot |
| `S1/research/research.md` | 120, 135 | The licence table and the Apache-2.0 notice rule |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R2-P1-001` remains active and is carried forward unchanged.

### P2 Findings

1. **The bottom line's lift list names 4 of the 20 lift rows section 3 carries and does not say it is a selection** -- `research/research.md:38` -- The heading reads "**Lifts worth taking.**" and four items follow, one each for 002, 009, 008 and 004 [SOURCE: research/research.md:40-43]. Section 3 carries 20 lift rows across 12 phases: 002 has 2, 003 has 1, 004 has 1, 005 has 1, 006 has 4, 007 has 1, 008 has 1, 009 has 3, 011 has 5 and 013 has 1. The four named are lift row 1 of their phase in every case, so the list is the first row of four phases rather than a ranking. The guards list immediately below it is labelled as a selection — "**Guards with the highest stakes.** The order is judgment." [SOURCE: research/research.md:45] — and names 8 of the 32 pitfall rows. The lift list carries no such label, so a builder reading section 2 takes four lifts as the complete set and never opens the other sixteen. The document's own summary sentence is looser still: "What a builder gains is a short list of lifts" [SOURCE: research/research.md:34], which does not say how short.
   Finding class: `self-description`
   Scope proof: the finding is inside the declared review target (`research/research.md:38`) and cites the row census of section 3. No file outside the target was modified.
   Affected surface hints: `research/research.md:38-43` (the list), `research/research.md:45` (the labelled guards list beside it), `research/research.md:34` (the "short list" sentence), `research/research.md:64-437` (the 20 lift rows).
   Case: a builder reads the bottom line, lifts OpenBot's `FIRING_FRAME`, the two OpenGhost directory lines, rakazo's matcher and buzz's `workspace_section`, and ships without the 16 other lift rows section 3 carries, including 011's five and 006's four.

## Traceability Checks

| # | Check | Result |
|---|---|---|
| 1 | Section 11 covers all six seeds in `scratch/frontier-seed.json` | Pass. F-1-001 to F-1-006 all appear in the table |
| 2 | Every correction section 2 lists appears in section 7 | Pass. All five: 004 at `:559`, `--forget` at `:565`, `tool-name.ts` at `:574`, 007 at `:579`, tinychannels at `:608` |
| 3 | Section 2's "five corrections" is the right count | Pass. Section 7 carries exactly five, and its 012 entry at `:612` defends S3 rather than correcting it |
| 4 | The ranked order covers all 16 candidates exactly once | Pass. The order is 1, 2, 3, 11, 4, 5, 7, 6, 8, 9, 10, 12, 13, 14, 15, 16 with no gap and no repeat |
| 5 | Every "Depends on" value names a real phase | Pass. All name phases 001 to 014, or "None", or "The runner only" |
| 6 | Section 2's "six places where the plan contradicts itself" lists six | Pass. Six items at `:56` |
| 7 | Section 2's "Sixteen candidates" matches section 5 | Pass. Sixteen table rows and sixteen ranked items |
| 8 | Section 2's "first three" matches the ranked order | Pass. Per-bot cap, inbound coalescing, stall watchdog |
| 9 | The two rakazo files section 2 recommends and section 10 eliminates are different files | Pass. `secret-matcher.ts` (lift row 1) against `secrets-guard.ts` (pitfall 1), distinguished by their described features |
| 10 | Section 2's "The plan has no such framing" for `FIRING_FRAME` holds | Pass. No plan file carries the framing |
| 11 | The bottom line's lift list is labelled as a selection | **Fail.** Four of 20, unlabelled. Reported as finding 1 |

## Integration Evidence

- `scratch/frontier-seed.json` is the six-seed input D2 names. Read, not modified.
- `B/002-routine-layer/spec.md` is the plan side of the `FIRING_FRAME` claim. Read, not modified.
- `B/006-approval-grants/spec.md` is the plan side of the kind-order and store-keying claims. Read, not modified.
- `C/OpenBot-main/shared/tool-name.ts` and `C/OpenBot-main/docs/approvals.md` are the reference lines the two 006 corrections rest on. Read, not modified.
- `S1/research/research.md:120` and `:135` are the licence table and the Apache-2.0 notice rule. Read, not modified.

No command, workflow, skill, MCP tool, caller agent or runtime mirror was modified. The append gateway and the reducer were run as the workflow runs them.

## Edge Cases

- **"Lifts worth taking" could be read as "the four best lifts".** Adjudicated against that reading: the four are lift row 1 of four phases, not a ranking, and the guards list beside them states its selection rule while this one does not.
- **Section 2 is a summary, and summaries select.** Accepted, which is why this is a P2 on the label rather than on the selection. The defect is that the reader cannot tell a selection from a complete set.
- **The 20 lift rows include rows whose instruction is "mirror", not "lift".** Counted together because section 3's heading is "Reference code to lift or mirror" and the distinction is in the row text, not the table.
- **Section 7's 012 entry could be a sixth correction.** Adjudicated against: it says two lineages called S3 wrong and S3 holds, which defends S3.
- **`steer.md` is absent.** Recorded rather than treated as a missing input.

## Confirmed-Clean Surfaces

- **The six seeds**: section 11 covers F-1-001 to F-1-006, so D2 is satisfied.
- **The five corrections**: all five appear in section 7 with the line they correct, and section 7 carries no sixth.
- **The ranked order**: all 16 candidates appear exactly once, and the top three match section 2's sentence.
- **The depends-on column**: every value names a real phase, "None" or "The runner only".
- **The two rakazo files**: `secret-matcher.ts` is recommended as a whole-file lift and `secrets-guard.ts` is eliminated as a whole-file lift, and the two are distinguished by their described features — the state cap and per-value fallback against the environment gate and the placeholder set.
- **The `FIRING_FRAME` claim**: no plan file carries the framing, so "The plan has no such framing" holds.
- **The 006 kind-order correction**: `docs/approvals.md:5` lists delete, send, share, post, pay, credentials, and the plan's order differs, so the correction holds.
- **The `tool-name.ts` correction**: the file is a 1,004-line display namer, not a classifier, so S3's description is wrong and the research's correction holds.
- **The Apache-2.0 notice rule**: section 7 cites S1:135, which states the full rule — license, NOTICE file and statement of changes. This is the rule section 1 collapses, and it is further evidence for `R8-P2-001`.

## Ruled Out

- **A contradiction between section 2's lift list and section 10's eliminated alternatives.** They name different rakazo files.
- **A missing seed in section 11.** All six appear.
- **A correction in section 2 that section 7 does not carry.** All five appear.
- **A candidate missing from or duplicated in the ranked order.** All 16 appear once.
- **A depends-on value naming a non-existent phase.** All resolve.
- **Section 2's "six contradictions" as a miscount.** Six items.
- **Section 2's "five corrections" as a miscount.** Five, and section 7 carries exactly five.
- **Section 2's "sixteen candidates" as a miscount.** Sixteen rows and sixteen ranked items.
- **Section 2's `FIRING_FRAME` claim as false.** No plan file carries the framing.
- **The 006 kind-order correction as wrong.** `docs/approvals.md:5` lists a different order.
- **The `tool-name.ts` correction as wrong.** The file is a display namer.

## Next Focus

- Dimension: none — the iteration budget is spent.
- Focus area: the synthesis phase, which reads the 17 open findings and the ten iteration records and writes the review report.
- Reason: `config.maxIterations` is 10 and this is iteration 10. The run did not converge: the last four iterations each produced two new P2s, and the novelty ratio stayed at 1.0 because every finding was new to the run.
- Rotation status: correctness three times (iterations 1, 3, 7), traceability twice (iterations 2, 6), security twice (iterations 4, 8), maintainability twice (iterations 5, 9), cross-reference synthesis once (iteration 10).
- Blocked/productive carry-forward: nothing blocked. Productive: reading a summary's selection rule against the list beside it, which is what showed the guards list states its rule and the lift list does not.
- Required evidence: the ten iteration records, the findings registry and the strategy file, all inside the lineage directory.

Review verdict: CONDITIONAL
