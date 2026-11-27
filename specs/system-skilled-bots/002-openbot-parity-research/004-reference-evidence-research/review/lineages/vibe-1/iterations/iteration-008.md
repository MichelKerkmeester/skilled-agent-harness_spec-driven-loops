# Review Iteration 8

## Dispatcher

- Lineage: `vibe-1`, iteration 8 of 10, mode `review`, target agent `deep-review`, agent definition loaded.
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
| `research/research.md` | 26 (the Licences paragraph), 64-437 (every phase section's licence statements and instructions) | The licence rule and the instruction each row gives |
| `research/research.md` | whole file, scripted | Counting rows that name a licence, and rows that use "Lift" against the licence of the source they cite |
| `B/003-openbot-parity-build/spec.md` | 80-90 | The plan's §14 reuse rule, which the research summarises |
| `B/003-openbot-parity-build/008-vault/spec.md` | 165-172 | REQ-012's notice requirement |
| `LICENSE` | 1-5 | The build's own licence |
| `C/openhuman-full/vendor/tinyagents/vendor/tinytools/LICENSE` | 1-3 | The licence 007's differences row 1 cites |
| `C/openhuman-full/vendor/tinyagents/vendor/tinytools/Cargo.toml` | 20 | The same crate's manifest licence key |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R2-P1-001` remains active and is carried forward unchanged.

### P2 Findings

1. **The licence summary collapses Apache-2.0's obligations into "its notice", erasing the distinction the plan draws** -- `research/research.md:26` -- The paragraph reads "A source under MIT or Apache-2.0 may be lifted with its notice." The plan's reuse rule separates the two: "MIT lifts keep the copyright and permission notice, Apache-2.0 lifts keep the license, any NOTICE file and a statement of changes, and one `THIRD_PARTY_NOTICES.md` entry per lifted file names its source path" [SOURCE: B/003-openbot-parity-build/spec.md:84]. So Apache-2.0 carries three obligations where MIT carries one, and the research's sentence gives both the same one. Two phase rows repeat the loose form: the 003 differences row 1 says turnstone's `show_controls` "can be lifted with a notice if distinct control symbols are wanted later" [SOURCE: research/research.md:135], and the 003 pitfall 2 row says turnstone's two lines "are Apache-2.0 and can be lifted with a notice" [SOURCE: research/research.md:143]. A builder who follows the research rather than the plan copies the NOTICE and skips the license text and the statement of changes. The 008 lift row is the counter-example inside the same document: it names the statement of changes explicitly [SOURCE: research/research.md:263], which shows the fuller form was available. This becomes a P1 if the research is used as the licence reference rather than the plan, because section 2 presents the licence map as the decision surface.
   Finding class: `licence-obligation`
   Scope proof: the finding is inside the declared review target (`research/research.md:26`) and cites the plan line the summary compresses. No file outside the target was modified.
   Affected surface hints: `research/research.md:26` (the summary), `:135` and `:143` (the two 003 rows), `:263` (the 008 row that names the statement of changes), `B/003-openbot-parity-build/spec.md:84` (the governing rule).
   Case: a builder lifts turnstone's `show_controls` under the research's rule, adds the NOTICE entry, and ships without the Apache-2.0 license text or the "changed files" notice. The plan's §14 would have required both.

2. **The licence paragraph says every row names the licence, and 49 of 101 numbered rows do not** -- `research/research.md:26` -- The paragraph ends "Every row names the licence and the line it was read from." Counting every numbered table row in the document, 52 name a licence and 49 do not. The lift tables all carry a Licence column, which is where the claim holds. The differences and pitfall tables have no such column, and most of their rows name no licence even when their guard tells a builder to take something. The 008 pitfall 1 row is the clearest: its guard says "Name the eight constants of secrets-guard.ts lines 1-12 as one fixed set in leak-checks.md section 1", and the row never says rakazo is Apache-2.0 [SOURCE: research/research.md:277]. The 003 pitfall rows are the same shape, and there the section's opening paragraph carries the rule instead [SOURCE: research/research.md:123]. So the claim is true of the lift tables and false of the document.
   Finding class: `self-description`
   Scope proof: the finding is inside the declared review target (`research/research.md:26`) and was checked by counting every numbered row. No file outside the target was modified.
   Affected surface hints: `research/research.md:26` (the claim), `:277` (008 pitfall 1), `:123` (003's section-level rule).
   Case: a builder reads the licence paragraph, trusts that every row carries its licence, and lifts the eight constants from 008 pitfall 1 without a notice entry, because that row names none.

## Traceability Checks

| # | Check | Result |
|---|---|---|
| 1 | The build's own licence is MIT, as section 1 states | Pass. The repository `LICENSE` is the MIT License |
| 2 | Every reference repo's licence in the map is right | Pass, re-confirmed from iteration 2: openhuman-full and tinychannels GPL-3.0-only, OpenBot and OpenGhost MIT, rakazo, turnstone and buzz Apache-2.0, OpenMausBot Apache-2.0 with the `enterprise/` carve-out, hermes-muse MIT |
| 3 | No row tells a builder to lift code from a GPL source | Pass. Six numbered rows use "Lift", and none cites `C/openhuman-full` or `C/tinychannels-main` |
| 4 | Every section that cites a GPL source states the design-only rule | Pass. 003, 005, 006, 008, 009, 010 and 011 state it in the opening paragraph; 002, 007 and 012 state it in the row that cites the source |
| 5 | The 011 lift table's five GPL rows carry the rule | Pass. The section's opening paragraph says "Every row below is therefore 'mirror the design, copy no code'" |
| 6 | Every row that lifts names the notice it needs | Pass. 002 lift row 1 names the notices-file entry, 009 lift row 1 names the notice entry, 008 lift row 1 names the statement of changes, and 003, 004 and 013 say no notice is needed because no code is copied |
| 7 | `tinytools` is GPL-3.0-only, as 007's differences row 1 states | Pass. `LICENSE:1-2` is GPL v3 and `Cargo.toml:20` says `GPL-3.0-only` |
| 8 | The licence summary states the plan's Apache-2.0 obligations | **Fail.** It gives Apache-2.0 the same single obligation as MIT. Reported as finding 1 |
| 9 | Every numbered row names its licence, as the paragraph claims | **Fail.** 49 of 101 do not. Reported as finding 2 |

## Integration Evidence

- `B/003-openbot-parity-build/spec.md:84` is the plan's §14 reuse rule, the governing surface the research's summary compresses. Read, not modified.
- `B/003-openbot-parity-build/008-vault/spec.md:165-172` is REQ-012, the per-file notice requirement. Read, not modified.
- `LICENSE` at the repository root is the build's own licence. Read, not modified.
- `C/openhuman-full/vendor/tinyagents/vendor/tinytools/LICENSE` and `Cargo.toml` are the licence lines 007's differences row 1 cites. Read, not modified.

No command, workflow, skill, MCP tool, caller agent or runtime mirror was modified. The append gateway and the reducer were run as the workflow runs them.

## Edge Cases

- **"With its notice" could be read as the whole notice apparatus.** Adjudicated against that reading for the summary sentence, because the plan's §14 draws an explicit MIT-versus-Apache-2.0 distinction and the research's sentence does not. The 008 lift row shows the fuller form was available in the same document.
- **"Every row" could be read as every lift-table row.** Adjudicated against that reading: the sentence sits in the licence paragraph, which is about the document's licence discipline, and the differences and pitfall rows are where a builder most often meets a source without a licence column.
- **The severity of finding 1 depends on which document a builder follows.** The plan's §14 is correct and governs, which is why this is a P2. The escalation trigger is recorded in the finding: it becomes a P1 if the research is used as the licence reference.
- **`steer.md` is absent.** Recorded rather than treated as a missing input.

## Confirmed-Clean Surfaces

- **The licence map itself**: all ten reference repos' licences are right, re-confirmed from iteration 2 and not re-derived here.
- **No GPL lift**: six numbered rows use "Lift" and none cites a GPL source, so the design-only rule is not broken anywhere in the document.
- **Section-level rule statements**: every section that cites a GPL source states the rule, either in its opening paragraph or in the row that cites the source.
- **The 011 lift table**: its five GPL rows rely on the section's opening statement, which is present and unambiguous.
- **The notice requirements**: every row that lifts names the notice it needs, and the three rows that copy no code say so.
- **`tinytools`**: GPL-3.0-only in both its `LICENSE` and its manifest, and 007's row states it and offers the MIT alternative in the same row.
- **The build's licence**: the repository `LICENSE` is MIT, so section 1's premise holds.

## Ruled Out

- **A licence error in the map.** Re-confirmed: every repo's licence line is right.
- **A row telling a builder to lift GPL code.** No "Lift" row cites a GPL source.
- **A section citing GPL without stating the rule.** All ten sections that cite a GPL source state it.
- **"The build is MIT" as wrong.** The repository `LICENSE` is MIT.
- **`tinytools`' licence as mis-stated.** Both its `LICENSE` and its manifest say GPL-3.0-only.
- **The 011 lift table as unguarded.** Its opening paragraph carries the rule for all five rows.
- **The notice requirement as unstated.** Every lifting row names it, and the three that copy no code say so.

## Next Focus

- Dimension: maintainability
- Focus area: section 14's references and the resource-map claim — whether `research/resource-map.md` lists the 263 paths and 28 missing that section 14 states, and whether every path section 14 names exists.
- Reason: the licence dimension is now covered and produced two P2s about one paragraph. The last unexamined factual claim in the document is section 14's resource-map count, which is the only place the document reports a number about its own inputs.
- Rotation status: correctness three times (iterations 1, 3, 7), traceability twice (iterations 2, 6), security twice (iterations 4, 8), maintainability once (iteration 5).
- Blocked/productive carry-forward: nothing blocked. Productive: counting a claim's scope rather than reading it, which is what showed the licence claim holds for the lift tables and fails for the document.
- Required evidence: `research/research.md:741-749` (section 14), `research/resource-map.md`, and the paths section 14 names.

Review verdict: CONDITIONAL
