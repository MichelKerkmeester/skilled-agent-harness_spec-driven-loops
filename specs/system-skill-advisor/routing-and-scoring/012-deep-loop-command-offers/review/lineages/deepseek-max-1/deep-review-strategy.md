# Deep Review Strategy - deep-loop command offers, provenance lineage

Runtime strategy for the `deepseek-max-1` fan-out lineage dispatched against
`specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`.

## 1. OVERVIEW

### Purpose

Persistent brain for this review lineage. Records dimension coverage, findings,
exhausted approaches and the next focus. Read at every iteration before any
review action and written after each iteration.

### Usage

- Init: deep-review-config.json, deep-review-findings-registry.json and this file.
- Per iteration: read Next Focus, review one dimension, write the iteration file,
  update this strategy, record state through the append gateway, write the delta,
  then run the reducer.
- Mutability: mutable. Only the sections the iteration template names are edited.

## 2. TOPIC

Review: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- No source, spec or test file is modified: the target is read-only.
- No new requirement is authored; findings are evidence for the packet owner.
- No re-litigation of decisions D1 to D10 or ADR-001 to ADR-009 unless the
  evidence in the tree contradicts them.
- Review does not judge prose style outside the tracked files.

## 5. STOP CONDITIONS

- Seven iterations, stop policy max-iterations. Convergence below the threshold
  before that is telemetry only.
- Terminal stop on three consecutive failed iterations, an operator pause
  sentinel, or the 120-minute wall-clock cap.

<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 6
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Scripted status comparison: parsing every `<AC-id> reads <status>` phrase in `tasks.md` against the status column found exactly one contradiction and proved the other 121 task rows consistent (iteration 7).
- Citation checker: `evidence-tails.py` reporting `problems=0` plus a row-level read gave both a mechanical and a semantic pass over all 67 acceptance rows (iteration 7).

## 9. WHAT FAILED

- The checklist has one stale verification phrase: T053 says AC-008 is Met, while AC-008 is Waived and T062 records the waiver (iteration 7).
- The evidence-tail checker proves path and line only; a claim that a row makes about a behavior still needs the row-level read (iteration 7).

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### "`extractSection` picks a `###` subsection instead of the `##` section": ruled out. The pattern requires `##` followed by whitespace, so `###` cannot match it. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "`extractSection` picks a `###` subsection instead of the `##` section": ruled out. The pattern requires `##` followed by whitespace, so `###` cannot match it.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "`LOOP_RUN_BY_PRONOUN` ignores a refusal": ruled out for the shapes tested, because the refusal word sits between the clause mark and the use verb, so the pattern does not match and the ordinary question branch decides. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "`LOOP_RUN_BY_PRONOUN` ignores a refusal": ruled out for the shapes tested, because the refusal word sits between the clause mark and the use verb, so the pattern does not match and the ordinary question branch decides.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "`splitRuledOutEntry` cuts a CLI flag": ruled out. The unspaced `--` branch is not a separator; only `\s+--\s+`, `\s+ -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "`splitRuledOutEntry` cuts a CLI flag": ruled out. The unspaced `--` branch is not a separator; only `\s+--\s+`, `\s+
- Why ruled out: \s+` or a bare `—` split an entry.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A child can forge a command the table does not track": ruled out. The brief strips the command when `trackedCommandForOwner` returns undefined, and the dropped fields are `command`, `policy` and `ownerSkillId`. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "A child can forge a command the table does not track": ruled out. The brief strips the command when `trackedCommandForOwner` returns undefined, and the dropped fields are `command`, `policy` and `ownerSkillId`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A long prompt with repeated refusals makes the Python gate quadratic": ruled out for the gate. The refusal leads are read through `_ends_before` on a 400-unit window, and the one unanchored clause search runs once per reading. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "A long prompt with repeated refusals makes the Python gate quadratic": ruled out for the gate. The refusal leads are read through `_ends_before` on a 400-unit window, and the one unanchored clause search runs once per reading.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A Met row lacks evidence": ruled out. The checker fails any row without a tail or with an anchor that is not on the named line, and it reports zero problems. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "A Met row lacks evidence": ruled out. The checker fails any row without a tail or with an anchor that is not on the named line, and it reports zero problems.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A typed run row on a stuck complaint is a bug": ruled out. ADR-005 makes the typed command outrank the diagnosis on the served head, and both copies keep the typed row (`.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1614`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5838`). -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "A typed run row on a stuck complaint is a bug": ruled out. ADR-005 makes the typed command outrank the diagnosis on the served head, and both copies keep the typed row (`.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1614`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5838`).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A waived row names a missing ADR": ruled out. ADR-001, ADR-002, ADR-003 and ADR-009 all exist at the lines the rows name. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "A waived row names a missing ADR": ruled out. ADR-001, ADR-002, ADR-003 and ADR-009 all exist at the lines the rows name.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "A waived row names no decision": ruled out. AC-008, AC-017, AC-020 and AC-019 each name ADR-003, ADR-002, ADR-009 and ADR-001 respectively. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "A waived row names no decision": ruled out. AC-008, AC-017, AC-020 and AC-019 each name ADR-003, ADR-002, ADR-009 and ADR-001 respectively.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "AC-014's verification command is broken by the table escaping": ruled out. The `\|` in the raw cell is Markdown table escaping; the rendered command uses plain alternation, and the cited line `deep-research.yaml:663` holds the named message. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "AC-014's verification command is broken by the table escaping": ruled out. The `\|` in the raw cell is Markdown table escaping; the rendered command uses plain alternation, and the cited line `deep-research.yaml:663` holds the named message.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "AC-040 is stale": ruled out. It records the rerun as not observed, and this generation is that rerun. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "AC-040 is stale": ruled out. It records the rerun as not observed, and this generation is that rerun.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "ADR-009 is cited but absent": ruled out. The record exists at `decision-record.md:796` and AC-020 names it. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "ADR-009 is cited but absent": ruled out. The record exists at `decision-record.md:796` and AC-020 names it.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "N9 still carries a command": ruled out. Its after row has no `command` key. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "N9 still carries a command": ruled out. Its after row has no `command` key.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "Prompt text can select a command other than the one the gate attaches": ruled out at the attach layer. `attachCommand` reads the command from the route's table and only decides whether to offer it; the prompt never supplies the string. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "Prompt text can select a command other than the one the gate attaches": ruled out at the attach layer. `attachCommand` reads the command from the route's table and only decides whether to offer it; the prompt never supplies the string.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "R7 regained a command": ruled out. The after snapshot's R7 top row has no `command` key and the route is research with policy absent. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "R7 regained a command": ruled out. The after snapshot's R7 top row has no `command` key and the route is research with policy absent.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "REQ-059 still reads Confirmed-Clean": ruled out. The parser reads `Ruled Out` and `Dead Ends` only. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "REQ-059 still reads Confirmed-Clean": ruled out. The parser reads `Ruled Out` and `Dead Ends` only.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "T084 is a defect": ruled out. The task is the review rerun itself; it stays open until the rerun reports. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "T084 is a defect": ruled out. The task is the review rerun itself; it stays open until the rerun reports.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The `doctor` row can be forced by a stuck-run phrase": ruled out. The doctor row is withheld on a refused run (`isRunRefused`) and on a no-edit request, and the gate keeps the typed row only when the prompt typed it. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "The `doctor` row can be forced by a stuck-run phrase": ruled out. The doctor row is withheld on a refused run (`isRunRefused`) and on a no-edit request, and the gate keeps the typed row only when the prompt typed it.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The corpus counts regressed": ruled out. The 35-row subset counts are 0 for both, and the one attached offer is a new near-miss row recorded on its own. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "The corpus counts regressed": ruled out. The 35-row subset counts are 0 for both, and the one attached offer is a new near-miss row recorded on its own.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The doctor name has a second declaration": ruled out. `rg "DEEP_LOOP_DOCTOR_COMMAND" lib handlers` finds the export and its uses, not a copy. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "The doctor name has a second declaration": ruled out. `rg "DEEP_LOOP_DOCTOR_COMMAND" lib handlers` finds the export and its uses, not a copy.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The duplicate-command guard withholds the command but leaves the policy behind": ruled out. The withheld branch destructures `command`, `policy`, `ownerSkillId` and `typed` before returning. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: "The duplicate-command guard withholds the command but leaves the policy behind": ruled out. The withheld branch destructures `command`, `policy`, `ownerSkillId` and `typed` before returning.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The fixture's served column can be `null`": ruled out. Both readers accept only `review`, `research` or `none`; a null is not a value either reader accepts. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "The fixture's served column can be `null`": ruled out. Both readers accept only `review`, `research` or `none`; a null is not a value either reader accepts.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The mode-free ask still keeps a run row in Python": ruled out. The `asked_mode` branch drops both run rows when the ask names no mode, and the `servedRun: "none"` rows are read by both suites. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "The mode-free ask still keeps a run row in Python": ruled out. The `asked_mode` branch drops both run rows when the ask names no mode, and the `servedRun: "none"` rows are read by both suites.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The new `then` mark swallows an `and` join": ruled out. The clause search treats only punctuation and `\bthen\b` as marks, and the `and` fixture row reads false. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: "The new `then` mark swallows an `and` join": ruled out. The clause search treats only punctuation and `\bthen\b` as marks, and the `and` fixture row reads false.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The Next Focus test masks a flattened projection": ruled out. It reads the projected section as separate lines and asserts the verdict is absent. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "The Next Focus test masks a flattened projection": ruled out. It reads the projected section as separate lines and asserts the verdict is absent.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The no-edit rule still withholds a read-only loop": ruled out. `READ_ONLY_LOOP_MODES` keeps review and research and only the doctor is withheld. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "The no-edit rule still withholds a read-only loop": ruled out. `READ_ONLY_LOOP_MODES` keeps review and research and only the doctor is withheld.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The ownership test's first case covers the field passthrough": ruled out. The first case's command is untracked, so it exercises only the strip path. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "The ownership test's first case covers the field passthrough": ruled out. The first case's command is untracked, so it exercises only the strip path.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The plural loop rows lost the hub lane": ruled out. `explicit.ts` reads `loops?` in the research and review rules and the fixture's plural rows pass in both suites. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "The plural loop rows lost the hub lane": ruled out. `explicit.ts` reads `loops?` in the research and review rules and the fixture's plural rows pass in both suites.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The presentation files lost the `--spec-folder` clause": ruled out. Both carry it at line 58/59. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "The presentation files lost the `--spec-folder` clause": ruled out. Both carry it at line 58/59.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The Python gate reads more than the native schema accepts": ruled out. `_advisor_prompt_head` counts UTF-16 units and returns the prefix at 10,000, which is the same bound the zod schema enforces. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: "The Python gate reads more than the native schema accepts": ruled out. `_advisor_prompt_head` counts UTF-16 units and returns the prefix at 10,000, which is the same bound the zod schema enforces.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The reason test accepts a stale name": ruled out after T118. The reverse test checks each excused name is still assigned in the gate slice; only the *quality* of the reason is unchecked. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "The reason test accepts a stale name": ruled out after T118. The reverse test checks each excused name is still assigned in the gate slice; only the *quality* of the reason is unchecked.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The refused loop phrase still supplies the mode cue": ruled out. `loopAskCues` blanks the refused phrase before `askedLoopMode` reads it, and the guards case at line 972 pins the served review. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: "The refused loop phrase still supplies the mode cue": ruled out. `loopAskCues` blanks the refused phrase before `askedLoopMode` reads it, and the guards case at line 972 pins the served review.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The strategy-numbering test passes over a skipped rewrite": ruled out. It asserts `strategyWarning` is null and would fail if a machine section were left untouched. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: "The strategy-numbering test passes over a skipped rewrite": ruled out. It asserts `strategyWarning` is null and would fail if a machine section were left untouched.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The two research aliases were dropped from the hub": ruled out. Both hub files carry them, and the mode packet's own list is the one ADR-007 leaves alone. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: "The two research aliases were dropped from the hub": ruled out. Both hub files carry them, and the mode packet's own list is the one ADR-007 leaves alone.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### "The Verification Summary counts do not match the boxes": ruled out. The counts are 12/13/1 and the checked boxes are 12 P0 rows with one open, 13 P1 and 1 P2. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: "The Verification Summary counts do not match the boxes": ruled out. The counts are 12/13/1 and the checked boxes are 12 P0 rows with one open, 13 P1 and 1 P2.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

- `LOOP_RUN_BY_PRONOUN` ignoring a refusal: the refusal word blocks the pronoun shape in the prompts tested, so the ordinary question branch decides and no second refusal path exists (iteration 1).
- `then` swallowing an `and` join: only punctuation and a whole-word `then` are clause marks, and the `and` fixture row reads false (iteration 1).

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- Dimension: synthesis
- Focus area: stop at the iteration cap and synthesize the lineage report from the registry, the seven iteration files and the terminal gates.
- Reason: seven of seven iterations are complete; the remaining work is the synthesis record and the report.
- Rotation status: all three traceability passes and all four dimensions are complete.
- Blocked/productive carry-forward: no blocked direction; the active P1 and the six P2s are the carried findings.
- Required evidence: the registry counts, the seven iteration files and the terminal-gate computation.
- Recovery note: none.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 77 files in `review-scope-files.txt`, led by
  `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`,
  `runtime/scripts/skill_advisor.py`, `runtime/tests/fixtures/deep-loop-offer-cases.json`,
  the two deep presentation files, the two deep command documents and the
  packet's six canonical docs.
- Behavior claims: `spec.md` REQ-001 to REQ-059, `acceptance-criteria.md` AC rows,
  `tasks.md` T115 onward and the closure rows in `implementation-summary.md`.
- Reuse and conventions: fixed severity scale P0/P1/P2; gate results are
  `pass | partial | fail | blocked | notApplicable`; findings cite file:line.
- Review risks and gaps: this is the thirteenth fix round, so closure records
  are the likeliest drift surface; the two gate copies (TypeScript and Python)
  must be read together; prior review reports in `review-archive/` list the
  twelfth-round findings and are context, never evidence that a fix landed.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 6 | REQ-001 to REQ-059 mapped; the active P1 is the one gap in REQ-015's general refusal rule |
| `checklist_evidence` | core | partial | 7 | every AC row and checked task read; AC-040 Unmet by design; T053 says AC-008 is Met while AC-008 is Waived |
| `skill_agent` | overlay | notApplicable | 6 | no agent definition is in the declared change set |
| `agent_cross_runtime` | overlay | notApplicable | 6 | no runtime mirror is in the declared change set |
| `feature_catalog_code` | overlay | pass | 5 | the advisor-recommend leaf matches the gate and command contract it describes |
| `playbook_capability` | overlay | pass | 5 | NC-012's prompts and expected signals match the guards test and the tracked table |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | D1, D2 | 2 | 0 P0, 1 P1, 0 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` | D1 | 1 | 0 P0, 1 P1, 0 P2 | partial |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | D1, D4 | 3 | 0 P0, 0 P1, 3 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts` | D4 | 3 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts` | D4 | 3 | 0 P0, 0 P1, 0 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts` | D2 | 2 | 0 P0, 0 P1, 1 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | D2 | 2 | 0 P0, 0 P1, 1 P2 | partial |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-1-1795556727682-axtzf8, parentSessionId=2026-11-24T21:45:00.000Z, generation=10, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
<!-- MACHINE-OWNED: END -->
