# Review Iteration 003

## Dispatcher

- Mode: review; dimension `traceability` (iteration 3 of 7), running the core protocol `spec_code` across the whole requirement set.
- Operator review focus: finish `spec_code` and `checklist_evidence`. This iteration finished `spec_code` for the REQs the first two iterations did not reach (REQ-001..REQ-022 and REQ-035..REQ-052) and began the bulk anchor pass for `checklist_evidence`.
- How this iteration addressed the focus: it read all 52 REQ rows of `spec.md`, then resolved each one to the code that implements it, the decision that records it, or the artifact that measures it. It also ran the acceptance matrix's 119 repo-relative and packet-relative `file:line` anchors through existence and line-range checks in one pass.

## Files Reviewed

- `spec.md` REQ-001..REQ-052 (lines 220-276)
- `.skilled/commands/deep/review.md` (`:81` step 0), `.skilled/commands/deep/research.md` (`:101`)
- `.skilled/commands/deep/assets/deep-review-presentation.txt` (`:30`, `:237`, `:267`, `:277`, `:583`), `.skilled/commands/deep/assets/deep-research-presentation.txt` (`:30`, `:223`, `:236`, `:246`, `:478`)
- `.skilled/commands/deep/assets/deep-research.yaml` (`:2254`-`:2270`), `.skilled/commands/deep/assets/deep-review.yaml` (`:2534`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` (`MODE_CUE_WORDS` `:539`, `MODE_CUES` `:548`, `RERUN_PRONOUNS` `:613`, `LOOP_EFFORT_WORDS` `:1077`, `LOOP_QUESTION_AUXILIARIES` `:1200`, `lowerFolded` `:883`, `escapePhrase` `:481`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` (`_MODE_CUE_WORDS` `:4770`, `_RERUN_PRONOUN_LIST` `:4990`, `_LOOP_QUESTION_AUXILIARY_LIST` `:5030`, `_NAMED_LOOP_MODE_RE` `:5376`, whitespace fold `:5109`)
- `.skilled/skills/system-deep-loop/deep-research/SKILL.md` (`:29`-`:37`), `.skilled/skills/system-deep-loop/hub-router.json` (`:34`), `.skilled/skills/system-deep-loop/ROUTER.md` (`:63`), `.skilled/skills/system-deep-loop/SKILL.md` (`:20`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` (`:1449`-`:1475`), `lib/derived/extract.ts` (`:243`)
- `decision-record.md` ADR-007 (`:603`); `.skilled/repo-rules/skill-hub-routing.md` §4.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The research alias ADR-007 records as rejected still sits in the mode packet's keyword list** -- `decision-record.md:603` (ADR-007) and `spec.md:235` (REQ-011) against `.skilled/skills/system-deep-loop/deep-research/SKILL.md:34` -- ADR-007 says the build "added the first two and dropped the third" research alias because its out-of-domain replay under `skill-hub-routing.md` §4 "pulled a slide-deck prompt to the hub", and amends REQ-011 to "the two aliases the tree carries". Neither the ADR nor REQ-011 names a surface for the drop beyond `hub-router.json` and `ROUTER.md`, and AC-043 checks exactly those two files. `deep-research/SKILL.md` still lists `autonomous research` among its Keyword triggers at `:34`, between `deep research` (`:33`) and `research loop` (`:35`), so a reader who takes "dropped" at face value finds the alias present in a third file the decision never scoped.
   Finding class: instance-only
   Scope proof: `rg -n 'autonomous research'` over `hub-router.json` and `ROUTER.md` returns nothing, so AC-043's claim holds; the same search over `deep-research/SKILL.md` returns `:34`. The surface is not one the advisor scores: `projection.ts:1449` enumerates top-level skill directories that carry `graph-metadata.json`, and takes derived triggers from that metadata's `derived.trigger_phrases` (`:1467`), so a nested packet's `SKILL.md` keyword list does not reach the derived lane. That is why this is a documentation-scoping drift and not a live route.
   Affected surface hints: ["deep-research/SKILL.md keyword triggers", "spec.md REQ-011", "decision-record.md ADR-007", "hub-router.json research aliases"]
   Case: a maintainer re-reading ADR-007 to learn why `autonomous research` is not in the hub's alias list opens the mode packet and finds it still offered as a keyword, with no sentence anywhere saying the skill-level list was deliberately left alone.
   Alternative explanation: the packet's keyword list and the hub's alias list are different surfaces, and REQ-011 only ever governed the hub. That reading is consistent with every word of REQ-011 and ADR-007; it is the *record's* silence about the second list, not its behaviour, that is being reported.
   downgradeTrigger: none lower than P2 — the finding is already at the floor.
   confidence: medium that a reader would be misled, high that the alias is present and unscoped by the records.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | `pass` | All 52 REQs resolve. REQ-001..REQ-004, REQ-008, REQ-012, REQ-013, REQ-021, REQ-027, REQ-039 and REQ-042..REQ-047 are measured rows: each resolves to the artifact that records its measurement (the 359-case fixture, `command-routing-baseline.json` with its `capturedAtSha` and `corpusSha256`, the `scratch/probes/` captures, the stage-one and multi-typed-command suites), and those artifacts were confirmed present. REQ-005 resolves to `review.md:81` step 0 and `research.md:101`, which name the presentation contract's "Offer From an Advisor Brief" section with the three options and recommended A, and both presentation files carry that section once. REQ-007 resolves to the compiled contracts under `.skilled/commands/deep/assets/compiled/`; REQ-009 to `deep-research.yaml:2268` and `deep-review.yaml:2534` plus the `--extend=N` row and the `/doctor:deep-loop --scope=` row in both presentations (`deep-research-presentation.txt:478`, `deep-review-presentation.txt:583`); REQ-010 to step 6 in both presentations naming the question tool through `communication-handoff.md` §5, with `Autonomous (Recommended)` at `:236`/`:267` and `Native (Recommended, default)` at `:246`/`:277`. REQ-011 resolves as amended by ADR-007, with the residual keyword-list alias carried as this iteration's P2. REQ-030, REQ-045, REQ-049 and REQ-051 resolve to the symbol pairs listed in Files Reviewed. REQ-023..REQ-029 and REQ-031..REQ-038 were read in iterations 1 and 2. |
| `checklist_evidence` | `partial` | The acceptance matrix's anchors were checked in bulk: 98 repo-relative `file:line` citations and 21 packet-relative `scratch/` citations, 119 in total, every one resolving to an existing file with the cited line inside the file. Content was verified by reading the line for AC-030..AC-049 and AC-059; the remaining rows' content is unread, and the `tasks.md` ticked boxes are not yet checked. |

## Integration Evidence

- The step 0 the offer depends on lives in the command, not the skill: `review.md:81` and `research.md:101` both put the offer first and name the presentation contract's section, so the AI reads the instruction at invocation time.
- The `--extend=N` wording reaches four surfaces: both YAML `next_steps` lists and both presentation Next Steps tables, which is REQ-009's clause; the completed-packet message in `deep-research.yaml` (`:2254`) does **not** name `--extend=N` or `--restart`, and neither does `deep-review.yaml`'s completion message (`next_steps` carries them instead). REQ-009 names "the completed-packet message in `deep-research.yaml`" specifically; the message block at `:2254`-`:2262` lists artifacts and a status line only, so the requirement's first clause is carried by the `next_steps` block at `:2265`-`:2270` rather than by the message body. Read together with AC-014, the intent is the completion surface, which is satisfied; read literally against the message body, it is not. Recorded rather than filed, because the packet's own row reads the completion surface.

## Edge Cases

- **The 119-anchor pass proves location, not content.** A citation that resolves can still point at a line that does not support the claim, which is why AC-038's count survived the first pass and only fell when the array was read. The iteration records the split honestly: anchors resolve, and content was read for 21 of the 60 rows.
- **Measured rows cannot be re-measured here.** Nine REQs assert probe or suite outcomes. This lineage may not run the repository's tooling, so those resolve by artifact presence and by spot-checking recorded content, which is the strongest evidence available inside the review's write limits.
- **`deep-research.yaml`'s completion message differs from its `next_steps`.** Recorded in Integration Evidence rather than as a finding, because REQ-009's owner row (AC-014) reads the completion surface, and the surface is present one block below the message body.

## Confirmed-Clean Surfaces

- All 52 REQ ids appear in the acceptance matrix's `REQ` column, and every AC row names its owning REQ: `REQ-001` through `REQ-052` each map to at least one AC (AC-001..AC-060).
- The matrix has no unrecorded status: 55 `Met`, 3 `Waived` (each naming an ADR), 1 `Superseded` (ADR-001) and 1 `Unmet` (AC-040, with the closure statement at `acceptance-criteria.md:145` stating why).
- Whitespace inside a loop phrase is handled on both copies: `lowerFolded` (`command-attach.ts:883`) collapses `\s+` before the gate reads `LOOP_REQUEST_ALL` (`:1162`, `:1715`), and the Python fold at `skill_advisor.py:5109` does the same, which is REQ-049.
- The mode vocabulary is shared on both sides: `MODE_CUE_WORDS` (`:539`) and `MODE_CUES` (`:548`) against `_MODE_CUE_WORDS` (`:4770`) and `_MODE_CUE_PATTERNS` (`:4774`), with `NAMED_LOOP_MODE` against `_NAMED_LOOP_MODE_RE` (`:5376`), which is REQ-045's first clause.
- `autonomous research` is absent from both hub alias files (`hub-router.json:34`, `ROUTER.md:63`), so AC-043's claim holds as written.

## Ruled Out

- *A REQ with no owning acceptance row.* Every REQ-001..REQ-052 appears in the matrix's `REQ` column, several through more than one row.
- *A loop-name pattern that a doubled space or a non-breaking space defeats.* Both copies fold all whitespace before matching.
- *`autonomous research` still reaching the advisor's derived lane through `deep-research/SKILL.md`.* `projection.ts:1449` reads top-level skill directories with `graph-metadata.json` and takes derived triggers from that metadata (`:1467`), so the nested packet's keyword list is not scored.
- *A stale acceptance status.* The five non-`Met` rows each carry their record: three waivers name an ADR, the supersession names ADR-001, and the one `Unmet` row is explained in the closure statement.

## Next Focus

- Dimension: `traceability`
- Focus area: finish `checklist_evidence` — read the evidence cell of every AC row not yet read (AC-001..AC-029 and AC-050..AC-060), then check every ticked box in `tasks.md` against evidence that exists, including the Verification Checklist and the sixth-round lane boxes.
- Reason: iteration 4 of 7; `spec_code` is complete, and `checklist_evidence` is the protocol still standing between this run and REQ-033's coverage gate.
- Rotation status: `correctness`, `security` and `traceability` (once) reviewed; `maintainability` remains, and `traceability` needs a second pass for `checklist_evidence`.
- Blocked/productive carry-forward: productive — the bulk anchor pass resolved 119 of 119, so the remaining work is content reading rather than lookup.
- Required evidence: `acceptance-criteria.md` rows AC-001..AC-029 and AC-050..AC-060; `tasks.md` ticked boxes and its Verification Checklist.

Review verdict: PASS
