# Review Iteration 004

## Dispatcher

- Mode: review, lineage `vibe-2`, session `fanout-vibe-2-1795770902266-zziqbr`, generation 1, lineageMode `new`.
- Target: `research/research.md`, `research/regrade-log.md` and the 40 iteration records under `research/lineages/`.
- Dimension: maintainability. Focus: structure and completeness -- the kept/confirmed/weak columns, the open-question accounting, and the fourteen phase headings.
- Iteration 4 of 10. Stop policy `max-iterations`, so convergence is telemetry only.

## Files Reviewed

- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:64-437` (section 3, all fourteen phase tables, parsed by script)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:438-467` (section 4, the 21 crate rows)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:468-515` (section 5, the 16 candidates)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:621-644` (section 8)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:686-704` (section 11, the divergence map)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:705-730` (section 12)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:731-740` (section 13)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/findings-registry.json` (`openQuestions`, `resolvedQuestions`, `frontier`)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/regrade-log.md:264-306` (the 012-013-014 group)
- `specs/system-skilled-bots/003-openbot-parity-build/` (the fourteen phase folder names)
- `specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/spec.md:40-49`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Section 12's table is described as covering the thirteen registry questions but holds twelve rows, and the four resolved questions are named only in section 11** -- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md:707` -- The intro reads "The merged registry holds 13 questions: 4 resolved and 9 open. The table states where each stands after verification." The table then has twelve rows: nine marked `open` in the Registry column and three marked `pruned on the node cap`. The three pruned nodes are not among the thirteen, and the four resolved questions appear nowhere in the table. They are named in section 11 instead, at `research.md:694-697`, as vibe-1's `F-1-001` and `F-1-005`, pi-1's `F-1-003` and pi-2's `F-1-004`. `findings-registry.json` confirms the split: nine `openQuestions` and four `resolvedQuestions`. So the document is complete across two sections, but the sentence promises one table and the table cannot be reconciled with the number beside it.
   Finding class: documentation
   Scope proof: the intro is `research.md:707`; the twelve rows are `:709-720`; the four resolved seeds are `:694-697`; the registry counts were read from `findings-registry.json`'s `openQuestions` and `resolvedQuestions` arrays, nine and four.
   Affected surface hints: `research/research.md` section 12 intro and table; `research/research.md` section 11 divergence map; `research/findings-registry.json`.
   Case: a reader who wants the four questions the run answered counts the table's twelve rows, finds nine `open` and three `pruned on the node cap`, and cannot locate the four resolved ones without knowing to read section 11.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `research.md:625-636`; `research.md:64-437`; `research.md:438-467`; `research.md:468-515`; `research.md:694-720`; `research.md:735`; `findings-registry.json`; `B/013-manual-testing-scenarios/spec.md:40-49` | Every count in section 8 and section 13 recomputes from the document's own rows, and the fourteen phase headings match the fourteen 003 folders. One sentence in section 12 over-promises what its table covers (P2 finding 1). |
| `checklist_evidence` | notApplicable | `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/` holds no `checklist.md` | The packet is Level 1 with no checklist, so there is no checklist evidence to align. |

## Integration Evidence

- **Section 8's kept/confirmed/weak columns are exact.** Section 3's fourteen tables hold 84 rows: 57 `confirmed` and 27 `weak`. Section 4 holds 21 crate rows, all `confirmed`. Section 5 holds 16 candidate rows: 12 `confirmed` and 4 `weak`. The sums are 121 rows, 90 `confirmed` and 31 `weak`, which is section 8's totals row to the cell. Every group row also matches: 001-002 is 4+8 rows and 2+5 confirmed; 003-004 is 8+3 and 4+2; 005-009-010 is 6+12+3 and 4+12+3; 006-007-008 is 12+2+8 and 7+2+6; 011 is 13 and 6; 012-013-014 is 2+2+1 and 1+2+1; openhuman-full and net-new is 21+16 and 21+12.
- **Section 13's question split is exact.** Sixteen questions stand: thirteen in the registry plus three pruned. Eight are answered, because four were resolved in the registry and four more were answered by verification; three are partly answered and five are open. The twelve-row table in section 12 gives four answered, three partly and five open, and section 11 supplies the four resolved seeds, so 4+4, 3 and 5 reconcile with section 13's 8, 3 and 5.
- **All fourteen phase headings match the 003 folders.** `001-activity-and-actor` through `015-deep-review` appear as `###` headings in section 3 in folder order, and each name is character-identical to the folder under `specs/system-skilled-bots/003-openbot-parity-build/`.
- **The 012 out-of-scope rejections rest on a real scope decision.** Eight rows in the 012-013-014 group are rejected because "012 adds no automated test". `B/013-manual-testing-scenarios/spec.md:3` describes the phase as adding "33 operator scenarios to the system-skilled-bots manual testing playbook", and `:42` bounds the scope to the playbook, its index and the run folder, so the reason holds.

## Edge Cases

- **Section 12's table mixes registry questions with pruned nodes.** The three `pruned on the node cap` rows are not among the thirteen, and the intro does not say so. Raised as P2 finding 1 rather than as a separate finding, because the same sentence causes both the missing four and the extra three.
- **Section 4's `tinyvoice` licence row is the only one that is not a single manifest line.** It reads "GPL-3.0 per `LICENSE`, and the workspace manifest has no `license` key", which is a two-part claim where every other row cites one `Cargo.toml` line. Not raised: the row states the exception explicitly and the licence conclusion is the same.
- **Section 5's candidate table has no phase column.** D4 requires every finding to name its 003 phase or go under net-new, and the candidates are all net-new by construction, so the section heading satisfies D4 without a per-row column.
- **The 014 section holds one row.** That is thin for a phase, but the 012-013-014 group's 38 log rows show 17 wrong and 19 out of scope, so the thinness reflects what the references offer rather than a missing finding.

## Confirmed-Clean Surfaces

- Section 8's kept, confirmed and weak columns are exact against sections 3, 4 and 5, in every group row and in the totals row.
- Section 13's answered, partly answered and open split reconciles with section 12's table plus section 11's four resolved seeds.
- The fourteen phase headings are complete and character-identical to the 003 folder names.
- Section 4's 21 crate rows cover all 21 folders under `openhuman-full/vendor/`, with no folder missing and none invented.
- The 012 out-of-scope rejections rest on the phase's own stated scope.

## Ruled Out

- **Section 8's kept/confirmed/weak columns are wrong.** Ruled out: 84 + 21 + 16 rows and 57 + 21 + 12 confirmed sum to the totals row exactly.
- **Section 13's question counts are wrong.** Ruled out: 4 resolved plus 4 answered is 8, and 13 plus 3 pruned is 16.
- **A phase heading is missing or misspelled.** Ruled out: all fourteen match the 003 folders character for character.
- **A well-supported 012 finding was rejected as out of scope.** Ruled out: the phase's spec bounds it to a manual playbook, so an automated test is outside it.
- **The four resolved questions are missing from the document.** Ruled out: section 11 names all four seeds and marks each answered.

## Next Focus

- Dimension: correctness
- Focus area: phases 005 to 008 -- every lift row's reference half read against the cited reference lines, and every differences row read against the plan line it names
- Reason: the first correctness pass covered 001-004 and the security pass covered the secret rows; 005 to 008 hold 34 rows that no correctness pass has read
- Rotation status: second pass of the correctness dimension
- Blocked/productive carry-forward: the reference-side reads stay productive; the `server/`-absent claims stay blocked
- Required evidence: the cited reference line for each lift row checked, plus the plan line for each differences row

Review verdict: PASS
