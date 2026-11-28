# Iteration 2: Traceability — the origin ids, the four lifts and the licence lines

## Dispatcher

- Mode: review. Target agent: `@deep-review`. Execution: single review iteration, inline in the `vibe-1` fan-out lineage.
- Artifact directory: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/review/lineages/vibe-1`.
- `steer.md` does not exist in the lineage directory at the time of this iteration; it is listed among the sources as absent.
- Dimension this iteration: traceability. Focus: whether the provenance the document defines in section 1 resolves, and whether the four lifts section 2 names are backed by the lines they cite.

## Files Reviewed

- `research/research.md:5-30` (section 1, the origin-id and licence rules)
- `research/research.md:38-44` (the four lifts section 2 names)
- `research/research.md:121-150` (003), `:150-173` (004), `:255-284` (008), `:284-317` (009), `:374-438` (012, 013, 014)
- `research/research.md:438-467` (section 4, the `openhuman-full` crate table)
- `research/research.md:468-514` (section 5, the sixteen net-new candidates)
- `research/research.md:690-749` (sections 11 to 14)
- `research/regrade-log.md:307-372` (the net-new group and the `openhuman-full` rows)
- The 40 iteration records under `research/lineages/*/iterations/`, opened where an origin id was checked
- Reference lines: `C/OpenBot-main/shared/routine-firing.ts:1-56`, `C/OpenGhost-main/skills.js:78-98`, `C/rakazo-main/packages/core/src/node/secrets-guard.ts:1-32`, `C/buzz-main/crates/buzz-acp/src/pool.rs:2249-2292` and `:5911-5971`, `C/openhuman-full/crates/openhuman-tui/src/theme.rs:85-95`, `C/turnstone-main/turnstone/ui/colors.py:50-90`
- Plan lines: `B/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:74-84`, `B/005-memory/spec.md:94-98` and `:160-164`, `B/014-skilled-and-doc-alignment/tasks.md:250-258`, `B/015-deep-review/tasks.md:228-234`, `B/015-deep-review/design/fixtures/fix-ledger.md:1-14`, `B/013-manual-testing-scenarios/spec.md:136-140`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Nine origin ids resolve to no finding in the record they name, and eight of the sixteen net-new candidates carry one** -- `research/research.md:24` -- Section 1 defines the scheme: "`V1-3-2` is lineage vibe-1, iteration 3, finding 2". Nine ids in the document and the regrade log point past the end of the record they name. `vibe-1` iteration 2 holds six findings, so `V1-2-7` and `V1-2-10` do not exist. `vibe-1` iteration 8 holds seven (`F-8-1` to `F-8-7`), so `V1-8-8` does not exist. `vibe-2` iteration 2 holds fifteen, so `V2-2-16`, `V2-2-17`, `V2-2-18` and `V2-2-19` do not exist. `pi-2` iteration 9 holds six, so `P2-9-7` does not exist. `pi-2` iteration 10 holds seven, so `P2-10-8` does not exist. The damage is concentrated in the most actionable section: `P2-10-8` is the origin on eight of the sixteen candidate rows (2, 4, 6, 7, 9, 13, 15, 16), `V1-8-8` on four (2, 5, 9, 13) and `P2-9-7` on three (2, 9, 13). `V2-2-18` is the sole origin section 4 gives for "the five-crate correction". Across both files the nine ids carry 29 citations, 16 in `research.md` and 13 in the regrade log. Every affected row keeps at least one origin that does resolve, so no recommendation is orphaned; what breaks is the audit path the document promises, and a reader who follows the scheme lands on nothing.
   Finding class: traceability
   Scope proof: the counts are the record's own. `research/lineages/vibe-1/iterations/iteration-002.md` numbers findings 1 to 6, `iteration-008.md` heads `F-8-1` to `F-8-7`, `research/lineages/vibe-2/iterations/iteration-002.md` numbers 1 to 15, `research/lineages/pi-2/iterations/iteration-009.md` numbers 1 to 6 and `iteration-010.md` numbers 1 to 7. The citation counts are a script count of each id in `research/research.md` and `research/regrade-log.md`. The scheme is defined at `research/research.md:24`.
   Affected surface hints: `research/research.md:24` (the definition), `:440` (`V2-2-18`), `:477-491` (the candidate table's Origin column), `research/regrade-log.md:328`, `:338`, `:339` and the rows carrying `V1-2-7`, `V1-2-10`, `P2-9-7`, `P2-10-8`.
   Case: a builder reads candidate 2, "Inbound coalescing and an ingestion budget before a run", sees `P2-10-8` in its Origin column, opens `research/lineages/pi-2/iterations/iteration-010.md`, finds seven findings and none of them about coalescing, and cannot tell whether the claim came from a finding that was dropped, a numbering slip, or a record that was rewritten after the synthesis.

```json
{
  "type": "traceability",
  "claim": "Nine origin ids cited in research.md and regrade-log.md resolve to no finding in the iteration record they name, because the record holds fewer findings than the id's index.",
  "evidenceRefs": [
    "research/research.md:24",
    "research/research.md:440",
    "research/research.md:477-491",
    "research/regrade-log.md:328",
    "research/regrade-log.md:338",
    "research/regrade-log.md:339",
    "research/lineages/vibe-1/iterations/iteration-002.md:11-21",
    "research/lineages/vibe-1/iterations/iteration-008.md:22-189",
    "research/lineages/vibe-2/iterations/iteration-002.md:17-48",
    "research/lineages/pi-2/iterations/iteration-009.md",
    "research/lineages/pi-2/iterations/iteration-010.md:15-27"
  ],
  "counterevidenceSought": "Three explanations were tested and none holds. (1) The ids might index the delta JSONL rather than the narrative: `vibe-1/deltas/iter-008.jsonl` holds seven `type:\"finding\"` rows `F-8-1` to `F-8-7`, and `vibe-2/deltas/iter-002.jsonl` holds fifteen, so the delta does not carry an eighth or a sixteenth either. (2) The ids might index every numbered item in the record rather than the Findings section: `vibe-2/iterations/iteration-002.md` holds 20 numbered items in total, but its Ruled Out and Dead Ends items are bulleted, not numbered, so no numbering reaches 16. (3) The ids might be a systematic off-by-one from a renumbering: `V1-8-8` sits beside `V1-8-2` on candidate 2 and `F-8-2` is the inbound-pipeline finding, which fits a slip, but `P2-10-8` has no counterpart at all in a seven-finding record, so a single offset does not explain the set.",
  "alternativeExplanation": "The verification workers numbered findings by their own extraction order, which included Ruled Out and Dead Ends items, and the synthesis copied those numbers without re-deriving them from the records. That explains the ids but does not make them resolvable under the scheme section 1 states.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if a mapping is produced that resolves all nine ids to a finding in the named record, or if section 1 is amended to say the ids index the verifier's extraction order rather than the record's finding number."
}
```

### P2 Findings

2. **Section 12 says the table states where each of the 13 registry questions stands, and the table holds 12 rows** -- `research/research.md:707` -- The paragraph reads "The merged registry holds 13 questions: 4 resolved and 9 open. The table states where each stands after verification." The table below it holds 12 rows: the nine open questions plus the three pruned nodes. The four registry-resolved questions are not in it. Section 13's "16 questions stand after verification as 8 answered, 3 partly answered and 5 open" only reconciles if the reader adds those four resolved questions to the four the table marks answered, which the document never says. A reader who counts the table gets 4 answered, 3 partly and 5 open against a stated 8, 3 and 5.
   Finding class: documentation-accuracy
   Scope proof: the table at `research/research.md:709-722` has 12 data rows; the four "Answered" rows are `vibe-2 F-1-002`, `vibe-2 F-1-006`, `vibe-2 F-2-008` and `vibe-2 F-2-009`; the registry's `openQuestions` holds 9 and `resolvedQuestions` 4, which is the 13 the paragraph states.
   Affected surface hints: `research/research.md:707`, `:709-722`, `:735`.
   Case: a reader auditing the open-question count counts the table's Answered column, gets four, and reports that section 13 overstates the answered questions by four.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | pass | The four lifts section 2 names were opened against their cited lines and all four hold: `FIRING_FRAME` is the three sentences at `C/OpenBot-main/shared/routine-firing.ts:9-13` with the live-failure comment at `:21-34`; the two skill-directory lines are `Skill directory: ${skill.dir}` and the relative-paths sentence at `C/OpenGhost-main/skills.js:81-96`; rakazo's matcher bounds and the eight placeholder constants at `C/rakazo-main/packages/core/src/node/secrets-guard.ts:1-12` and `:17-23`; buzz's `workspace_section` at `C/buzz-main/crates/buzz-acp/src/pool.rs:2284-2289` with the prompt-prefix-caching comment at `:2251-2258` and the exact-bytes tests at `:5913-5922` and `:5963-5969`. |
| `checklist_evidence` | pass | The plan-side citations behind the highest-stakes rows were opened and say what the rows claim: `B/003-terminal-screen/001-ux-and-component-map/design/component-inventory.md:79` does cite `theme.rs:87-93` and `colors.py` for a replace-with-`?` rule that neither implements (`safe_text` drops and keeps `\n`; `show_controls` substitutes Control Pictures symbols and keeps line feed and tab); `B/015-deep-review/tasks.md:231` does make CHK-012 count the word `regression`, and `rg -c regression` on `B/015-deep-review/design/fixtures/fix-ledger.md` exits 1; `B/014-skilled-and-doc-alignment/tasks.md:254` does grep only the eight verbs; `B/013-manual-testing-scenarios/spec.md:138` does retire `pbots check`. |

## Integration Evidence

- The licence map was checked against the files it names, and every line holds: `C/openhuman-full/Cargo.toml:35` is `GPL-3.0-only`; `C/tinychannels-main/LICENSE:1-2` is GPL v3; `C/OpenBot-main/LICENSE:1` and `C/OpenGhost-main/LICENSE:1` are MIT; `C/rakazo-main/LICENSE:1-2`, `C/turnstone-main/LICENSE:1-2` and `C/buzz-main/Cargo.toml:46` are Apache-2.0; `C/OpenMausBot-main/LICENSING.md:6-9` carves out only `enterprise/`; `C/hermes-muse-main/LICENSE:1` is MIT. The rule "GPL-3.0 is a design reference only" is applied consistently in every row that names a GPL source.
- The `openhuman-tui` counts in sections 3, 4 and 9 are all correct and mutually consistent: 55 files, 53 `.rs` files, 52 `.rs` files under `src/`, 9,526 `.rs` lines under `src/` and 9,601 `.rs` lines in total.

## Edge Cases

- The origin-id defect is a numbering defect, not a content defect. Every affected row keeps at least one origin that resolves, and the reference and plan citations in those rows were checked and hold. Recorded so a later iteration does not re-report it as a content gap.
- `vibe-1` iterations 6 to 9 use `### F-<iteration>-<n> —` headings where the other records use a numbered list. The origin scheme works for both, so the format difference is not itself a defect; it is why a naive count of numbered findings undercounts `vibe-1` by 28.
- The crossterm citations behind the paste finding point into the local cargo registry, outside the repository. The document discloses this at `research/research.md:62` and the citation checker cannot follow them; they were not re-opened here.

## Confirmed-Clean Surfaces

- All four lifts section 2 names are backed by the lines they cite, including the licence line for each.
- The licence map in section 2 and section 4 is correct for all ten reference repos and for the two GPL-3.0-or-later crates among the 21.
- The 003 sanitizer mis-citation is real: the component inventory attributes a replace-with-`?` rule to two sources that implement a drop and a symbol substitution instead.
- The 014 ledger gap is real: CHK-012 counts the word `regression`, and the golden ledger holds no such word.
- The 013 residue gap is real: CHK-013 greps only the eight new verbs, and 012 retires `pbots check`.
- Section 13's last-iteration novelty ratios are exact against the four state logs: vibe-1 0.60, vibe-2 0.94, pi-1 0.55, pi-2 0.92.

## Ruled Out

- **The four lifts as unsupported or mis-cited.** All four were opened line by line and each says what the row claims, including the two OpenGhost lines and the rakazo constant set.
- **A licence error in the map.** Every licence line was read; the GPL/MIT/Apache split is right, and the "copy no code" rule is applied wherever a GPL source appears.
- **The 003 sanitizer row as a false accusation.** Both cited sources were read and neither replaces a control character with `?`.
- **The 014 and 013 plan-side citations as stale.** Both were read at the cited lines and both say what the rows claim.

## Next Focus

- Dimension: correctness
- Focus area: whether the rejected findings were rightly rejected — the 106 `wrong` and 112 `out of scope` verdicts in the regrade log, sampled at the rows where the rejection removes a recommendation.
- Reason: iteration 2 found the provenance defect; the next risk is a finding rejected on a wrong reading, which would silently drop a real gap from the document.
- Rotation status: correctness reviewed once (iteration 1), traceability once (iteration 2); security and maintainability not yet started.
- Blocked/productive carry-forward: nothing blocked. Productive: opening the record a citation names rather than trusting the id.
- Required evidence: `research/regrade-log.md` rows with outcome `wrong` and `dropped as out of scope`; the plan and reference lines each row cites.

Review verdict: CONDITIONAL
