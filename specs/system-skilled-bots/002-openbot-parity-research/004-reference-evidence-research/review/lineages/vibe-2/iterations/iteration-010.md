# Iteration 010 — Traceability: cross-cutting consistency, packet decisions and the licence rules

## Dispatcher

- Mode: review
- Target agent: deep-review
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Session: `fanout-vibe-2-1795770902266-zziqbr`, generation 1, lineageMode `new`
- Iteration: 10 of 10
- Dimension: traceability
- Focus: the recommendations against each other, against the packet decisions D1-D6, and against the licence rule the document states for itself

## Files Reviewed

- `research/research.md:5-64` — section 1's reading conventions, including the licence rule at `:26`, and section 2's Bottom Line
- `research/research.md:202-215` and `:257-270` — the 006 and 008 lift tables with their section openings
- `research/research.md:529-545` — section 7's opening and its first two phase groups
- `research/research.md:621-644` — section 8's table, its total row and the note on what a log row covers
- `research/research.md:731-741` — section 13's convergence report
- `research/lineages/{vibe-1,vibe-2,pi-1,pi-2}/deep-research-state.jsonl` — the four state logs, read for the raw findings count behind the Bottom Line
- `git status --short` — the working tree, read for D3 compliance
- `steer.md` — absent from the lineage directory, so no lead ruling applied to this iteration

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The Bottom Line calls 303 "raw findings" and partitions them into 121 kept plus a 332-row remainder, which cannot close** -- `research.md:34` -- The sentence reads "Of 303 raw findings, 121 rows survive verification: 90 confirmed and 31 weak. The regrade log holds 332 rows for the rest". The partition it states is 121 kept plus 182 regraded, but it then says the log holds 332 rows for that remainder. 121 + 332 is 453, not 303, and 332 is larger than the 182 the sentence implies. Section 13 identifies the same 303 as a different quantity: "Merged registry: 303 key findings, 207 ruled-out directions, convergence score 0.753" (`research.md:735`). The raw findings the four lineages actually reported sum to 271 across their state logs once pi-2's repeated iteration 7 is deduped. So the number is the merged registry's key-findings count and the label is the raw-findings label, and the two cannot be reconciled by a reader doing the arithmetic the sentence invites.
   Finding class: matrix/evidence
   Scope proof: the partition is stated at `research.md:34`; section 8's total row gives the two figures it uses, 121 kept and 332 log rows (`research.md:632`); section 13 labels 303 as the merged registry's key findings (`research.md:735`); the four state logs give 55 + 50 + 65 + 101 = 271 iteration-typed findings once pi-2's duplicate iteration 7 is removed.
   Affected surface hints: `research.md:34`, `research.md:632`, `research.md:735`; `research/lineages/vibe-1/deep-research-state.jsonl`, `research/lineages/vibe-2/deep-research-state.jsonl`, `research/lineages/pi-1/deep-research-state.jsonl`, `research/lineages/pi-2/deep-research-state.jsonl`
   Case: A reader checks the Bottom Line's arithmetic. 121 rows survive and the regrade log holds 332 rows "for the rest", so the raw total should be 453, not 303. A reader who trusts 303 concludes the log double-counts; a reader who trusts the log concludes the Bottom Line undercounts. Neither can tell which figure the rest of the document uses, and section 13 uses 303 for a third thing again.

```json
{
  "id": "V2-R10-P2-001",
  "type": "internal-inconsistency",
  "claim": "research.md:34 calls 303 raw findings and partitions them into 121 kept plus a remainder the regrade log covers with 332 rows, which cannot close; research.md:735 identifies 303 as the merged registry's key-findings count, a different quantity from the raw findings the four lineages reported.",
  "evidenceRefs": ["research.md:34", "research.md:632", "research.md:735", "research/lineages/pi-2/deep-research-state.jsonl"],
  "counterevidenceSought": "Looked for a sentence that reconciles 303 with 121 + 332. Section 8's note explains that a log row can group several origins, which makes log rows fewer than findings, not more, so it widens the gap rather than closing it. Checked whether 303 could be the raw count: the four state logs sum to 275 iteration-typed findingsCount values, 271 once pi-2's repeated iteration 7 is deduped, so 303 is not the raw count either. Checked whether 303 is a typo for 453: section 13 uses 303 independently as the merged registry's key-findings count, so the number is deliberate and the label is what is wrong.",
  "alternativeExplanation": "The sentence may intend 303 as the merged registry's key findings and 121 as the rows that survived from that merged set, with the 332 log rows covering lineage findings that never entered the merged set. That reading is available, but the sentence says 'raw findings' and 'for the rest', which is the partition reading, and it never names the merged registry.",
  "finalSeverity": "P2",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to no finding if the sentence is reworded to name the merged registry's key-findings count and to stop presenting 121 and 332 as a partition of it."
}
```

## Traceability Checks

| Protocol | Level | Result | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | The document's own stated rules were checked against its content: the licence rule at `research.md:26` against all 20 lift rows, D3 against the working tree, D4 against the phase and net-new placement of every row, D5 against section 7's citation rule, and the Bottom Line's counts against sections 8 and 13. One gap, recorded as V2-R10-P2-001. |
| `checklist_evidence` | core | notApplicable | The packet has no `checklist.md` at Level 1, so there is no checklist to trace against. |

## Integration Evidence

- `research/lineages/pi-2/deep-research-state.jsonl` holds two iteration-7 records, one with `findingsCount: 5` and one with `findingsCount: 4`, both naming the same focus. That is the surface behind the 271 figure in V2-R10-P2-001.
- `research/lineages/{vibe-1,vibe-2,pi-1}/deep-research-state.jsonl` hold 10 iteration records each, with findings counts summing to 65, 101 and 55.
- `git status --short` prints one path, the untracked `review/` directory inside this packet, which is this lineage's own output. Nothing outside the packet changed, so D3 holds.

## Edge Cases

- **pi-2's duplicate iteration 7 is outside the review target.** The target is the 40 `iteration-*.md` records, not the state logs, so the duplicate is recorded as context evidence for V2-R10-P2-001 and not as a finding of its own. It does mean the raw findings count cannot be read straight off the logs without deduping.
- **The licence rule is met at section level where it is not met per row.** Nine of the 20 lift rows carry no `[SOURCE:` tag in their licence cell. For 006 row 2 the section opening names the GPL line (`research.md:204`); for 008 row 1 the opening names the Apache-2.0 line and the NOTICE (`research.md:257`); for all five 011 rows the opening names the licence twice and states "Every row below is therefore 'mirror the design, copy no code'" (`research.md:342`). For 006 rows 3 and 4 the cell says `MIT` and the same table's row 1 carries `MIT [SOURCE: C/OpenBot-main/LICENSE:1-3]`. The rule's purpose, that every row's licence traces to a line, is met in each case, so no finding.
- **The Bottom Line's four lifts against section 3's twenty lift-or-mirror rows.** The heading is "Lifts worth taking", and "worth" is evaluative, so the list reads as a selection rather than a census. The guards list below it says "The order is judgment" for the same reason. No finding.
- **Section 8's note and the 332 figure pull in opposite directions.** The note says a log row can group several origins, so 332 rows cover more than 332 lineage findings. That is consistent with the log's own construction and is what makes the Bottom Line's "for the rest" reading impossible. The note is right; the sentence it fails to rescue is the finding.

## Confirmed-Clean Surfaces

- **D3 holds.** `git status --short` prints exactly one path, `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/review/`, which is this lineage's own output inside the packet. No file outside the packet changed.
- **D4 holds.** Every row in section 3 sits under one of the fourteen phase headings, every row in section 5 sits under net-new, and every row carries at least one `[SOURCE: path:line]` tag. Iteration 7 already proved all 947 tags resolve to an existing path and an in-file line.
- **D5 holds.** Section 7's opening states the rule in the document's own words: "A finding listed here is cited and not repeated in section 3", and it names the 32 lineage findings dropped as duplicates of an earlier synthesis, six of them for `openhuman-full` and the net-new list. The 32 matches section 8's duplicate column exactly.
- **D6 holds.** The reference repos are present in the primary checkout and the run's 40 iteration records exist, 10 per lineage.
- **The licence rule holds.** All 20 lift rows name a licence, and each licence traces to a line either in the row or in its section opening. The GPL rows all say mirror-only, five of them through the 011 opening's blanket sentence and the rest in their own cells.
- **Section 8's total row is internally exact.** 121 = 90 + 31, and the six outcome columns 106 + 112 + 43 + 38 + 32 + 1 sum to 332, which is the log-row total the row states.
- **Section 13's convergence figures hold.** 40 of 40 iterations, 10 per lineage, stop reason `maxIterationsReached` on all four, and the four last-iteration novelty ratios are stated per lineage against a 0.05 threshold.
- **Section 2's six self-contradictions are all real.** Each was verified in an earlier iteration: 005 `spec.md:96` against REQ-010 (iteration 5), 009 REQ-003 against D11 (iteration 9), 011 `conformance-rules.md:33` against child 007 (iteration 9), 011's Telegram row against its WhatsApp row (iteration 6), 003 `component-inventory.md:79` (iteration 4) and 006's kind order (iteration 6).

## Ruled Out

- **The Bottom Line's four lifts undercount section 3's twenty rows.** Ruled out: "worth taking" is evaluative and the list reads as a selection, and the guards list below it marks its own selection explicitly.
- **006 lift rows 3 and 4 break the licence rule.** Ruled out: row 1 of the same table carries `MIT [SOURCE: C/OpenBot-main/LICENSE:1-3]`, so the line is one row above in the same table.
- **011's five GPL rows break the licence rule.** Ruled out: the section opening names the licence with two SOURCE tags and states that every row below is mirror-only.
- **008 lift row 1 breaks the licence rule.** Ruled out: the section opening carries the Apache-2.0 line and the NOTICE line.
- **303 is a typo for 453.** Ruled out: section 13 uses 303 independently as the merged registry's key-findings count, so the number is deliberate and the label is what is wrong.
- **The regrade log double-counts.** Ruled out: section 8's note explains that a log row can group several origins, and the 43 downgraded and 38 corrected rows are also kept rows in sections 3 to 5.
- **Section 7 repeats findings instead of citing them.** Ruled out: its opening states the citation rule and its entries carry `S1/`, `S2/` and `S3/` line citations with a "New here" note each.
- **D3 is violated by the review directory.** Ruled out: the untracked `review/` path is this lineage's own output inside the packet, and nothing outside the packet changed.
- **Section 13's "303 key findings" contradicts section 2's "303 raw findings" as a second finding.** Ruled out as a separate finding: it is the same defect seen from the other end, and it is recorded once as V2-R10-P2-001.

## Next Focus

- Dimension: none remaining — correctness and traceability are both complete across the whole target
- Focus area: synthesis — the review report, the Planning Packet built from the nine active findings, and the final verdict
- Reason: the iteration budget is spent at 10 of 10, and every configured dimension has been swept. The remaining work is to state the verdict and hand the findings to the merge.
- Rotation status: correctness complete for 001-014 and section 5; traceability complete for the packet decisions, the licence rule and the cross-cutting counts
- Blocked/productive carry-forward: productive — the cross-cutting read found the one count that does not close, which no single-phase read could see
- Required evidence: the nine active P2 findings, the findings registry, and the reducer's convergence figures
- Recovery note: not applicable

Review verdict: PASS
