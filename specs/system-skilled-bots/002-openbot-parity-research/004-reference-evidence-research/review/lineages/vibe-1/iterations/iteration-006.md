# Review Iteration 6

## Dispatcher

- Lineage: `vibe-1`, iteration 6 of 10, mode `review`, target agent `deep-review`, agent definition loaded.
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
| `research/research.md` | 68-120 (001, 002), 173-199 (005), 374-437 (012, 013, 014), 468-528 (sections 5 and 6), 579-620 (section 7 tail), 665-704 (sections 10 and 11) | The phase sections not yet read, plus the skip-list check, the eliminated alternatives and the divergence map |
| `research/research.md` | whole file, scripted | D4's `[SOURCE: path:line]` census over every numbered row |
| `research/frontier-nodes.jsonl` | whole file | The six depth-1 seeds |
| `research/lineages/vibe-1/frontier-nodes.jsonl` | whole file | Depth-2 nodes raised by vibe-1 |
| `research/lineages/vibe-2/frontier-nodes.jsonl` | whole file | Depth-2 nodes raised by vibe-2 |
| `research/lineages/pi-1/frontier-nodes.jsonl` | whole file | Depth-2 nodes raised by pi-1 |
| `research/lineages/pi-2/frontier-nodes.jsonl` | whole file | Depth-2 nodes raised by pi-2 |
| `research/scratch/frontier-seed.json` | whole file | D2's six seeds |
| `research/scratch/research-topic.txt` | whole file | The topic's rules, including the observed/inferred marking |
| `goal.md` | 34-49 | The packet's frozen decisions D1-D6 |
| `research/001-openbot-parity-research/research/research.md` | 106-118 | S1's skip list, which section 6 checks row by row |
| `research/002-plan-review-research/research/research.md` | 175-206 | S2's three 008 findings, which section 7 describes |
| `.gitignore` | 419-423 | Section 14's "gitignored" claim about the reference repos |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R2-P1-001` remains active and is carried forward unchanged.

### P2 Findings

1. **Section 11 says nine depth-2 nodes and its own table accounts for ten** -- `research/research.md:690` -- The sentence reads "Six depth-1 seeds, partitioned over the lineages, and nine depth-2 nodes that the lineages raised themselves". The table directly below names `F-2-007 to F-2-012` for vibe-2, which is six nodes, and `F-2-005 to F-2-008` for pi-2, which is four [SOURCE: research/research.md:695] [SOURCE: research/research.md:697]. Six plus four is ten. The lineage frontier stores agree with the table: vibe-2's holds six depth-2 nodes and pi-2's holds four, and vibe-1 and pi-1 hold none [SOURCE: research/lineages/vibe-2/frontier-nodes.jsonl] [SOURCE: research/lineages/pi-2/frontier-nodes.jsonl]. Section 12's table also lists all ten. So the sentence contradicts the table beneath it, section 12 and the stores. The six depth-1 seeds are right.
   Finding class: `count-error`
   Scope proof: the finding is inside the declared review target (`research/research.md:690`) and cites the target's own table and the lineage frontier stores it summarises. No file outside the target was modified.
   Affected surface hints: `research/research.md:690` (the sentence), `:695` and `:697` (the table rows), `:705-730` (section 12's ten depth-2 rows).
   Case: a reader checking the run's breadth against the frontier stores counts ten depth-2 nodes and finds the summary says nine, then has to decide whether a node is missing from the table or the sentence is wrong. Nothing in the document says which.

2. **Section 7 says the plan closed all three S2 vault findings, and the third was accepted as a residual rather than closed** -- `research/research.md:583` -- The bullet reads "The value in argv, the unscanned stdout and the same-user read: S2/research.md:177, S2/research.md:181 and S2/research.md:201. New here: nothing. The plan closed all three." The first two are genuinely closed: no argv carries the value [SOURCE: B/008-vault/spec.md:151] and REQ-014 scans the captured output [SOURCE: B/008-vault/spec.md:168]. The third is not. S2's P1-008-7 offered two resolutions, "either accept it explicitly for the small-team model or isolate the store", and the plan took the acceptance branch: REQ-015 states "The residual is accepted for the small-team model, as decision D6 confirms" [SOURCE: B/008-vault/spec.md:169]. Section 3 says the same thing twice, at the 008 differences row 3 ("Every child can read every value file, by decision D6") and at pitfall 2, which uses the same-user read as the live reachability premise for the hex form [SOURCE: research/research.md:262] [SOURCE: research/research.md:278]. So "closed" is true in the sense of "resolved" and false in the sense a reader takes from it, which is that the exposure is gone. The word matters because section 7 is the appendix a reader uses to decide which earlier findings still need work.
   Finding class: `disposition-wording`
   Scope proof: the finding is inside the declared review target (`research/research.md:583`) and cites the plan line and the two section 3 rows that state the disposition. No file outside the target was modified.
   Affected surface hints: `research/research.md:583` (the bullet), `:262` (008 differences row 3), `:278` (008 pitfall 2), `B/008-vault/spec.md` REQ-015.
   Case: a builder reads section 7 to see what the plan review already raised and finds the same-user read listed as closed, so they skip the adversarial test S2 asked for. Section 3 would have told them the residual is live, but they had no reason to re-read it.

3. **A fifth row says a claim is inferred, which section 2's inventory does not name** -- `research/research.md:100` -- This refines `R5-P2-001`. The 002 lift row 1 ends "Whether a bot here would misread a schedule-speak body the way OpenBot's model did is inferred, since this runtime offers no routine tool" [SOURCE: research/research.md:100]. That is a fifth row beyond the four `R5-P2-001` names, and it is the one that matters most for the lift the document ranks first in section 2. The row is graded `confirmed`, so the inference sits inside a `confirmed` grade, which is the same defect `R4-P2-002` records for the 008 hex sentence.
   Finding class: `self-description`
   Scope proof: the finding is inside the declared review target (`research/research.md:100`) and cites a row of the same document. No file outside the target was modified.
   Affected surface hints: `research/research.md:100` (the 002 lift row), `:62` (the inventory), `:39` (section 2's first lift).
   Case: a builder takes the FIRING_FRAME lift, which section 2 ranks first, and treats the row's `confirmed` grade as covering the whole claim, including the part the row itself calls inferred.

## Traceability Checks

| # | Check | Result |
|---|---|---|
| 1 | D1: two `cli-mistral-vibe` lineages on `deepseek-flash` and two `cli-pi` on `deepseek-v4.1-flash-1017`, 10 iterations each, stop policy max iterations | Pass. Section 1 names the four lineages, their executors and models; section 13 records `maxIterationsReached` on all four; the state logs hold 10 iteration records per lineage |
| 2 | D2: the run starts from the six seeds in `scratch/frontier-seed.json` and the topic in `scratch/research-topic.txt` | Pass. `frontier-nodes.jsonl` holds exactly the six seeds, and section 11 partitions them 2/2/1/1 across the lineages |
| 3 | D3: every input is read-only | Pass. No cited input is written; the only writes the document describes are inside the packet's own `research/` and `scratch/` folders |
| 4 | D4: every finding names its 003 phase or goes under net-new, and carries a `[SOURCE: path:line]` | Pass. 100 of 101 numbered rows carry a resolving `[SOURCE: path:line]`; the one exception is a section 8 count row, not a finding. Section 3 is organised by phase and section 5 is net-new |
| 5 | D5: a finding an earlier synthesis carries is cited, not repeated | Pass for the sampled phases. Section 7 covers all 14 phases, and the sampled entries for 001, 002, 004, 005, 006, 008 and 011 split carried from new exactly as section 3 does. The 005 positional-index reversal cites S3 and says it reverses it |
| 6 | D6: the run starts on `main` in the primary checkout, where the gitignored reference repos exist | Pass. `.gitignore:423` ignores `specs/**/context/`, so section 14's "gitignored" claim holds |
| 7 | The topic's skip-list question is answered row by row | Pass. S1's skip list holds exactly seven rows and section 6 checks all seven in order, plus one eliminated alternative |
| 8 | Section 11's frontier counts match the stores | **Fail.** The sentence says nine depth-2 nodes and the table, section 12 and the stores all say ten. Reported as finding 1 |
| 9 | Section 7's disposition words match the plan's actual state | **Fail.** One of three "closed" findings was accepted as a residual. Reported as finding 2 |
| 10 | Section 2's inference inventory covers every row that says a claim is inferred | **Fail.** A fifth row at `:100`. Reported as finding 3 |

## Integration Evidence

- `research/frontier-nodes.jsonl` and the four `research/lineages/*/frontier-nodes.jsonl` stores are the surfaces section 11 summarises. Read, not modified.
- `research/scratch/frontier-seed.json` and `research/scratch/research-topic.txt` are D2's inputs and the source of the observed/inferred rule. Read, not modified.
- `goal.md:44-49` is the packet's frozen decision table. Read, not modified.
- `research/001-openbot-parity-research/research/research.md:106-118` is S1's skip list, the surface section 6 checks.
- `research/002-plan-review-research/research/research.md:175-206` is S2's 008 block, the surface section 7 describes.
- `.gitignore:423` is the surface section 14's "gitignored" claim depends on.

No command, workflow, skill, MCP tool, caller agent or runtime mirror was modified. The append gateway and the reducer were run as the workflow runs them.

## Edge Cases

- **"Nine depth-2 nodes" could count only the nodes that survived verification.** Adjudicated against that reading: section 11's sentence describes what "the lineages raised themselves", and the table's own rows name ten. Section 12's table also lists ten, three of them pruned. So no reading of the sentence makes nine right.
- **"Closed" could mean "resolved".** That is the reading that makes the sentence true, and it is why this is a P2 and not a P1: S2's own edit offered acceptance as one of two resolutions, and the plan took it. The defect is that a reader takes "closed" to mean the exposure is gone, and section 3 relies on it being live.
- **The fifth inferred claim sits inside a `confirmed` grade.** That is the same shape as `R4-P2-002`, so the two findings may be fixed by one rule: a row that says a claim is inferred is graded `weak`, or the inference is cited. Recorded as a refinement rather than a new family.
- **`steer.md` is absent.** Recorded rather than treated as a missing input.

## Confirmed-Clean Surfaces

- **D1's executor and model split** (`research.md:7`): the four lineages, their executors and models match the decision, and section 13 records the stop reason on all four.
- **D2's six seeds** (`research.md:690`): `frontier-nodes.jsonl` holds exactly six depth-1 nodes, and section 11 partitions them 2/2/1/1.
- **D4's citation rule**: 100 of 101 numbered rows carry a resolving `[SOURCE: path:line]`, and the exception is a count row.
- **D5's overlap rule**: section 7 covers all 14 phases, and the sampled entries split carried from new exactly as section 3 does.
- **D6's gitignore premise**: `.gitignore:423` ignores `specs/**/context/`, so section 14's claim holds.
- **Section 6's skip-list check**: S1's skip list holds seven rows and section 6 checks all seven in order, plus the eliminated alternative, and each row's "no new evidence" is either stated or backed by a citation.
- **Section 10's eliminated alternatives**: fourteen rows, each naming the section 3 row or section 6 item that carries the evidence, and each reason matching that row.
- **Section 11's per-lineage end states**: vibe-2's "three left open, three pruned" and pi-2's "four left open" both match section 12's table.
- **Section 5's net-new ranking**: sixteen candidates, each with a licence, a size, a dependency list and a grade, and the ranked order names the two changes it makes to the verifier's order and why.

## Ruled Out

- **D4's citation rule as unmet.** 100 of 101 numbered rows carry a resolving tag, and the exception is a count row.
- **D5 as unmet.** Section 7 covers all 14 phases and the sampled entries split carried from new correctly; the 005 reversal cites S3 and says so.
- **D6's premise as false.** `.gitignore:423` ignores the context folder.
- **Section 6 as a partial skip-list check.** S1's list holds seven rows and section 6 checks all seven.
- **Section 10's eliminated alternatives as unsupported.** Each row names the section 3 row or section 6 item that carries the evidence.
- **Section 11's per-lineage end states as wrong.** Both the vibe-2 and pi-2 rows match section 12's table.
- **The topic's observed/inferred rule as dropped.** Section 1's `weak` grade definition covers "the claim is an inference the lines do not state", so the axis is encoded; the defect is the rows graded `confirmed` that carry an inference, which is `R4-P2-002` and finding 3 here.

## Next Focus

- Dimension: correctness
- Focus area: the net-new ranking in section 5 and the crate table in section 4 — whether each candidate's size, licence and dependency list is right, and whether the ranked order's stated reasons match the rows.
- Reason: traceability against D1-D6 is now covered and produced two P2s plus a refinement. The largest unexamined block of numbers in the document is section 4's crate table and section 5's sizes, and a wrong size changes the ranking.
- Rotation status: correctness twice (iterations 1, 3), traceability twice (iterations 2, 6), security once (iteration 4), maintainability once (iteration 5).
- Blocked/productive carry-forward: nothing blocked. Productive: counting against the store a summary sentence summarises, rather than against the sentence's own table, which is what settled the depth-2 count.
- Required evidence: `research/research.md:438-467` (section 4), `:468-515` (section 5), and the crate manifests and `wc -l` counts the rows cite.

Review verdict: CONDITIONAL
