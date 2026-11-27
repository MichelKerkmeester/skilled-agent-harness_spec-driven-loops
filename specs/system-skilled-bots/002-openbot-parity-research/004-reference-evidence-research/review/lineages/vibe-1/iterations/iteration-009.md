# Review Iteration 9

## Dispatcher

- Lineage: `vibe-1`, iteration 9 of 10, mode `review`, target agent `deep-review`, agent definition loaded.
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
| `research/research.md` | 5-31 (the reading guide), 741-749 (section 14) | The two places the document describes its own inputs and its own exclusions |
| `research/research.md` | whole file, scripted | Heading census and internal `section N` reference census |
| `research/resource-map.md` | whole file, scripted | The 263/28 claim section 14 reports, and the status of each of the 28 |
| `research/regrade-log.md` | 1-20 (the outcome vocabulary) and every outcome cell, scripted | The six outcomes the reading guide names two of |
| `research/lineages/{vibe-1,vibe-2,pi-1,pi-2}/iterations/` | directory listings | The 40 records section 14 names |
| `scratch/synthesis-inputs/` | directory listing | The "seven verified drafts" section 14 names |
| `specs/system-skilled-bots/context/` | directory listing and six path probes | Whether the six genuinely absent resource-map paths are cited by `research.md` |

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R2-P1-001` remains active and is carried forward unchanged.

### P2 Findings

1. **Section 14 reports the resource map's 28 "missing" entries as 28 missing files, and 22 of them are citation forms no file could satisfy** -- `research/research.md:745` -- The line reads "Resource map: `research/resource-map.md`. It lists 263 referenced paths, 28 of them missing on disk." The 263 is exact: the map's own summary splits 3 Skills + 243 Specs + 17 Meta, and its table holds 235 `OK` rows plus 28 `MISSING` rows [SOURCE: research/resource-map.md:13-16]. The 28 is not 28 missing files. Fourteen are a path with a line list appended, such as `003-terminal-screen/spec.md:104,115,229` and `buzz-main/TESTING.md:19-36,55,231-260,344-345,405,439`; two are globs, `openhuman-full/vendor/*/Cargo.toml` and `context/*/LICENSE`; four are directory listings, such as `OpenGhost-main/ (top level)` and `openhuman-main/crates/openhuman-tui/src/ (module listing)`; one is a range, `iteration-001.md through iteration-009.md`; one is an annotated path, `steer.md (absent)`. Only six are paths that name a file and do not resolve, and all six are the short form of a crate path — `vendor/tinydocs/crates/tinydocs/src/lib.rs`, `vendor/tinyeventqueues/src/lib.rs`, `vendor/tinyjuice/crates/tinyjuice/src/lib.rs`, `vendor/tinymcp/src/lib.rs`, `vendor/tinyskills/src/lib.rs` and `crates/openhuman-tui/src/activity_tests.rs`. None of the six is cited by `research.md`: the document cites the long forms, and all six of those resolve [SOURCE: research/research.md:451] [SOURCE: research/research.md:452] [SOURCE: research/research.md:456] [SOURCE: research/research.md:457]. So the six belong to lineage iterations the synthesis did not carry forward. A reader takes "28 missing on disk" as 28 broken references in the research, and the research's own citations all resolve.
   Finding class: `self-description`
   Scope proof: the finding is inside the declared review target (`research/research.md:745`) and cites the resource map it reports. No file outside the target was modified.
   Affected surface hints: `research/research.md:745` (the claim), `research/resource-map.md:13-16` (the summary it repeats), `research/resource-map.md` (the 28 rows), `research/research.md:451-457` (the long-form citations that do resolve).
   Case: a reader checking the research's citation integrity reads "28 missing on disk", concludes 28 of its references are broken, and either distrusts the document or spends a pass re-resolving citations that were never broken.

2. **The reading guide names two of the six regrade outcomes, leaving 144 findings with no stated home** -- `research/research.md:22` -- The sentence reads "A finding graded `wrong` or `not verified` is not in this document. It is in `research/regrade-log.md` with the reason." The regrade log defines six outcomes: `wrong`, `not verified`, `downgraded to weak`, `citation corrected`, `dropped as duplicate of an earlier synthesis` and `dropped as out of scope` [SOURCE: research/regrade-log.md:3]. Counting every outcome cell gives 106 `wrong`, 1 `not verified`, 43 `downgraded to weak`, 38 `citation corrected`, 32 `dropped as duplicate` and 112 `dropped as out of scope`, which is the 332 the document reports elsewhere [SOURCE: research/research.md:34]. Two of the four outcomes the guide does not name are exclusions: the 112 out-of-scope and 32 duplicate findings are not in the document either, so 144 findings sit outside it with no sentence saying so. The other two are changes rather than exclusions, and the guide's "The row is then written down to what the lines support" covers `downgraded to weak` but not `citation corrected`. A reader reconciling the document's 121 rows against the log's 332 outcomes has to infer which outcomes are exclusions from the outcome names.
   Finding class: `self-description`
   Scope proof: the finding is inside the declared review target (`research/research.md:22`) and cites the regrade log's own vocabulary. No file outside the target was modified.
   Affected surface hints: `research/research.md:22` (the guide), `research/regrade-log.md:3` (the six outcomes), `research/research.md:34` (the 332 total).
   Case: a reader asks where the 112 out-of-scope findings went, finds the guide naming only `wrong` and `not verified`, and cannot tell whether out-of-scope findings were dropped, folded into a row, or never graded.

## Traceability Checks

| # | Check | Result |
|---|---|---|
| 1 | Every path section 14 names exists | Pass. All six `research/` files, `scratch/synthesis-inputs/`, S1, S2, S3 and `specs/system-skilled-bots/context/` resolve |
| 2 | Section 14's "iteration-001.md to iteration-010.md" covers 40 records | Pass. Each of the four lineages holds exactly 10 |
| 3 | Section 14's "seven verified drafts" is right | Pass. `scratch/synthesis-inputs/` holds `section-A.md` to `section-G.md`, plus `verify-brief.md` and `cite-check.cjs` |
| 4 | The document's 14 sections are numbered 1 to 14 with no gap | Pass. Headings run `## 1.` to `## 14.` |
| 5 | Every internal `section N` reference resolves | Pass. References name sections 1 to 13, all of which exist |
| 6 | The 14 identical "in section 7" pointers name this document's section 7 | Pass. Section 7 is "Overlap With the Earlier Runs", which is what the sentence describes |
| 7 | The resource map's 263 is exact | Pass. 3 Skills + 243 Specs + 17 Meta = 263, and 235 `OK` + 28 `MISSING` = 263 |
| 8 | The resource map's 28 are 28 missing files | **Fail.** 22 are citation forms; 6 are absent paths, none cited by `research.md`. Reported as finding 1 |
| 9 | The reading guide names every outcome that keeps a finding out of the document | **Fail.** It names 2 of 6, and 144 findings sit under the two unnamed exclusions. Reported as finding 2 |

## Integration Evidence

- `research/resource-map.md` is the reducer-generated map section 14 reports. Read, not modified.
- `research/regrade-log.md` is the outcome log the reading guide points at. Read, not modified.
- `scratch/synthesis-inputs/` holds the verification brief, the citation checker and the seven drafts. Read, not modified.
- `specs/system-skilled-bots/context/` is the reference-repo root section 14 names. Read, not modified.

No command, workflow, skill, MCP tool, caller agent or runtime mirror was modified. The append gateway and the reducer were run as the workflow runs them.

## Edge Cases

- **The resource map is reducer-owned, so its "missing" column is not the research's to fix.** Adjudicated as a finding on `research.md:745` rather than on the map, because the map's status column is a mechanical resolution result and the document is what turns it into a claim about its own references.
- **"Missing on disk" could be read as "the map marks them missing".** Adjudicated against that reading: the sentence sits in a reference list a reader uses to check the document's inputs, and "missing on disk" states a property of the files, not of the map's column.
- **The six absent paths could be a citation defect in the lineages.** They are, but they are outside this review target: the target is `research/`, and `research.md` cites the long forms, which resolve. Recorded as context, not as a finding.
- **The reading guide's two named outcomes are the two that mean "the claim was false".** That is a defensible editorial choice, but the guide's sentence is about where a finding went, not about which findings were false, so the two exclusions belong in it.
- **`steer.md` is absent.** Recorded rather than treated as a missing input.

## Confirmed-Clean Surfaces

- **Section 14's path list**: every path it names exists, including all 40 iteration records, the six `research/` files, `scratch/synthesis-inputs/` with its seven drafts, S1, S2 and S3, and the context root.
- **The document's section structure**: 14 sections numbered without a gap, and every internal `section N` reference resolves.
- **The 14 phase pointers**: all fourteen say "What an earlier run already carries for this phase is in section 7", and section 7 is the overlap section.
- **The resource map's own arithmetic**: 3 + 243 + 17 = 263 and 235 + 28 = 263, both exact.
- **The "seven verified drafts" count**: exactly seven, `section-A.md` to `section-G.md`.
- **The 40 iteration records**: four lineages, ten each.
- **The context root's status**: read-only and gitignored, confirmed in iteration 6 from `.gitignore:423`.

## Ruled Out

- **A missing path in section 14.** Every one resolves.
- **A broken internal cross-reference.** All `section N` references name an existing section.
- **The resource map's 263 as wrong.** Both splits reconcile exactly.
- **The "seven drafts" count as wrong.** Exactly seven.
- **The 40 iteration records as fewer than claimed.** Ten per lineage.
- **The 14 phase pointers as ambiguous.** All point at this document's section 7, which is the overlap section.
- **The six absent resource-map paths as `research.md` citations.** The document cites the long forms, and all six resolve.

## Next Focus

- Dimension: cross-reference synthesis
- Focus area: whether the document's recommendations contradict each other, the packet decisions or the three earlier syntheses, and the overall verdict.
- Reason: nine iterations have covered the document's arithmetic, origins, guards, inference labels, depth counts, ranking, diff output, licences and references. The one thing not yet examined as a whole is whether the recommendations hold together.
- Rotation status: correctness three times (iterations 1, 3, 7), traceability twice (iterations 2, 6), security twice (iterations 4, 8), maintainability twice (iterations 5, 9).
- Blocked/productive carry-forward: nothing blocked. Productive: opening the artifact a summary sentence reports, which is what separated the map's mechanical status column from a claim about the research's references.
- Required evidence: `research/research.md` sections 2, 3, 5, 6, 7 and 10 read together, plus S1, S2 and S3 where the document cites them.

Review verdict: CONDITIONAL
