# Review Report — Reference Evidence Research

**Verdict: CONDITIONAL.** One P1 is active and seventeen P2s are open. No P0 was found.

- Lineage: `vibe-1`, ten iterations, mode `review`, target agent `deep-review`.
- Session: `fanout-vibe-1-1795770902266-zziqbr`, generation 1, lineage mode `new`.
- Stop reason: `maxIterationsReached`. The run did not converge; the last four iterations each produced new findings.
- Review target: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/` — `research.md`, `regrade-log.md`, `resource-map.md` and the 40 iteration records under `research/lineages/`.
- Write surface: this lineage directory only. Nothing outside it was created, modified or deleted.

## What was reviewed

Ten iterations, one dimension each, in this order:

| Iteration | Dimension | Focus | New findings |
|---|---|---|---|
| 1 | correctness | Section 8's regrade table and the 332 outcome rows | 2 P2 |
| 2 | traceability | Origin-id resolution against the records they name | 1 P1, 1 P2 |
| 3 | correctness | Whether the `wrong` verdicts are grounded | 1 P2 |
| 4 | security | The 008 encoded-forms guard and its justification | 2 P2 |
| 5 | maintainability | The inference inventory and the table-heading census | 3 P2 |
| 6 | traceability | Section 11's depth-2 count and section 7's closures | 3 P2 |
| 7 | correctness | Section 4's arithmetic and the ranked order's flags | 2 P2 |
| 8 | security | The licence summary and the licence map | 2 P2 |
| 9 | maintainability | Section 14's references and the reading guide | 2 P2 |
| 10 | traceability | Whether the recommendations hold together | 1 P2 |

All four configured dimensions are covered: correctness, security, traceability and maintainability.

## The active P1

**`R2-P1-001` — nine origin ids resolve to no finding in the record they name.** `V1-2-7`, `V1-2-10`, `V1-8-8`, `V2-2-16`, `V2-2-17`, `V2-2-18`, `V2-2-19`, `P2-9-7` and `P2-10-8` are credited across 29 citations, and none of the nine exists in the iteration record its id names. Every affected row keeps at least one valid origin, so no row rests on a phantom alone, but the provenance chain the document advertises does not hold for those 29 citations. The fix is to re-point each id at the finding it means, or to drop it and let the row stand on its remaining origins.

## The seventeen P2s

Grouped by what a reader would have to do to be misled.

**Counts that do not match the thing they count (7).**
- `R1-P2-001` — section 1 says a `wrong` finding is not in the document, and 27 wrong origins are credited in it.
- `R1-P2-002` — section 9 says the checker resolved every source tag in the 40 records, and 3 tags are in neither column.
- `R2-P2-001` — section 12 says the table states where each of the 13 registry questions stands, and the table holds 12 rows.
- `R3-P2-002` — section 2 says the plan lacks about twenty guards, and the pitfall tables hold 32 rows.
- `R6-P2-001` — section 11 says nine depth-2 nodes and its own table accounts for ten.
- `R9-P2-001` — section 14 reports the resource map's 28 "missing" entries as 28 missing files, and 22 are citation forms.
- `R9-P2-002` — the reading guide names two of the six regrade outcomes, leaving 144 findings with no stated home.

**Claims that understate or mislabel their own evidence (5).**
- `R5-P2-001` — a fifth row says a claim is inferred, which section 2's inventory does not name.
- `R5-P2-002` — the 010 paste row calls its mechanism an inference when the 003 row establishes it.
- `R7-P2-001` — the ranked order flags two of the four `weak` candidates and ranks the other two in the top four without a flag.
- `R8-P2-002` — the licence paragraph says every row names the licence, and 49 of 101 numbered rows do not.
- `R10-P2-001` — the bottom line's lift list names 4 of the 20 lift rows and does not say it is a selection.

**Evidence that does not support the sentence it is attached to (3).**
- `R4-P2-001` — section 2's guard 3 repeats the incomplete encoded-forms list, so the gap appears twice.
- `R4-P2-002` — the 008 hex justification cites a value-file line for a keychain read.
- `R7-P2-002` — the tinychannels row says `diff -rq` prints only `wiki/` lines, and it prints 34.

**A licence rule stated more loosely than the plan states it (1).**
- `R8-P2-001` — the licence summary collapses Apache-2.0's three obligations into "its notice". The plan's §14 and S1:135 both state the full rule, and section 7 of the document cites S1:135 correctly, so the summary is the only place the rule is compressed.

**A closure that was an acceptance (1).**
- `R6-P2-002` — section 7 says the plan closed all three S2 vault findings, and the third was accepted as a residual.

## What held

The document's arithmetic and its structural claims survived every check that was run against them.

- **The grade split and the outcome rows.** 90 `confirmed` + 31 `weak` = 121 rows, and the regrade log's 332 outcomes partition exactly: 106 wrong, 112 out of scope, 43 downgraded, 38 citation-corrected, 32 duplicate, 1 not verified.
- **Section 8's table.** Ten columns and seven group rows, all summing, covering all fourteen phases plus the net-new group.
- **Section 9's per-lineage table.** vibe-1 216/18, vibe-2 188/6, pi-1 139/1, pi-2 145/5 = 688/30, reproduced by running the document's own checker read-only.
- **Section 4's arithmetic.** 21 crates, 16 with nested vendor, 1,709,254 own + 2,670,004 nested = 4,379,258 exactly.
- **Section 5's sizes.** Eight spot-checked sizes are exact.
- **The licence map.** All ten repos' licences are right, and no row tells a builder to lift GPL code.
- **Section 14's path list.** Every path it names exists, including all 40 iteration records and the seven verified drafts.
- **The ranked order.** All 16 candidates appear exactly once, and every "Depends on" value names a real phase.
- **The five corrections to the earlier syntheses.** All five appear in section 7 with the line they correct, and section 7 carries no sixth.
- **The six seeds.** Section 11 covers F-1-001 to F-1-006, so D2 is satisfied.
- **D4 and D5.** 100 of 101 numbered rows carry a resolving `[SOURCE: path:line]`, and the exception is a count row; the overlap section cites rather than repeats.

## What this means for the packet

The research answers its question. A builder can take the fourteen phase sections, the ranked net-new list and the licence map and start work. The defects are in how the document describes itself, not in what it recommends: every P2 is a sentence about the document's own counts, labels or evidence, and none of them changes a lift, a guard or a ranking.

The one exception is `R8-P2-001`. If a builder uses section 1's licence paragraph as the rule rather than the plan's §14, an Apache-2.0 lift ships without the license text or the statement of changes. The plan governs and states the rule correctly, so this is a P2 — but it is the P2 to fix first.

`R2-P1-001` is the only finding that touches the document's provenance claim, and it is the reason the verdict is CONDITIONAL rather than PASS.

## Registry accounting

The closeout compares the findings the ten iteration records carry against the findings the registry holds. It reports 21 emitted and 18 registered, and it names the gap `structured_state_findings_missing_from_registry`.

The three are refinements the reducer folded into an earlier finding:

| Folded id | Iteration | Folded into | Why |
|---|---|---|---|
| `R3-P2-001` | 3 | `R1-P2-001` | The same section 8 arithmetic defect, restated |
| `R5-P2-003` | 5 | `R5-P2-001` | A fifth inferred claim, added to the four already counted |
| `R6-P2-003` | 6 | `R5-P2-001` | A sixth inferred claim, added to the same count |

The reducer records each fold as a `transitions` entry with reason "Refinement of an earlier finding" — `R1-P2-001` carries one at iteration 3 and `R5-P2-001` one at iteration 6 — but it does not add the folded id to `mergedFindingIds`, which is the field the closeout reads. So the 18 registered findings are the correct count and no finding is lost; the registry simply does not name the three ids it absorbed.

This is a reducer bookkeeping gap, not a defect in the research under review. It is recorded here rather than fixed, because the registry is reducer-owned and this lineage may not write it.

## Files written

- `iterations/iteration-001.md` to `iteration-010.md`
- `deltas/iter-001.jsonl` to `iter-010.jsonl`
- `deep-review-strategy.md` (sections 8, 9 and 11 edited by hand; the reducer owns the rest)
- `deep-review-config.json`
- `review-report.md` (this file)

`deep-review-state.jsonl`, `deep-review-findings-registry.json` and `deep-review-dashboard.md` are written by the append gateway and the reducer, never by hand.

Review verdict: CONDITIONAL
