# Review Iteration 001

## Dispatcher

- Mode: review; target agent `deep-review`; lineage `deepseek-max-1`; generation 7; session `fanout-deepseek-max-1-1795546920757-7pyjry`.
- Iteration 1 of 7 (stopPolicy `max-iterations`, convergence 0.10 recorded as telemetry only).
- Dimension: `traceability`. Protocol in progress: `spec_code`, part 1 (REQ-001 to REQ-014).
- Operator review focus, addressed here: "finish the spec_code and checklist_evidence protocols. Check every REQ in spec.md against the code that implements it or the decision that records it, and every ticked task in tasks.md and every Met row in acceptance-criteria.md against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006)." This iteration opens `spec_code` on the first requirement block; the sixth-round block and the checklist protocol are carried forward to iterations 2 and 3 so each gets its own pass.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:42` (`### Measured Behavior` baseline block), `spec.md:161` (`### Files to Change`), `spec.md:230` (REQ-001), `spec.md:250` (REQ-011), `spec.md:270` (REQ-014), `spec.md:300` (Reopened sections).
- `.skilled/commands/deep/assets/deep-review-presentation.txt:13` (`### Offer From an Advisor Brief`), `:37` (Option A/B/C block), `:41` (flag table), `:64` (On A/B/C line), `:237` (step 6 question tool).
- `.skilled/commands/deep/assets/deep-research-presentation.txt:13`, `:223` (step 6).
- `.skilled/commands/deep/review.md:81` (step 0), `.skilled/commands/deep/research.md:86` (step 0).
- `.skilled/commands/deep/assets/deep-research.yaml:663` (completed-packet message), `.skilled/commands/deep/assets/deep-review.yaml:2534` (`next_steps` `--extend=N` line).
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:330` (`LOOP_WORDING`), `:354` (`ITERATIVE_VERBS`), `:413` (`COUNT_WORDS`), `:450` (`LOOP_NAMES`), `:688` (`RUN_ASK_REFUSAL_LEADS`), `:748` (`LEAD_WINDOW`), `:949` (`LOOP_REQUEST`), `:1537` (`attachCommand`).
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454` (`passesAsked`), `:151` (council cue, retained by intent).
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:535` (depth-word `it.each` list), `:546` (the withheld assertion).
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2` (`$comment` column contract).
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:225` (`nm-system-deep-loop-02`), `:226` (`nm-system-deep-loop-03`, the N9 row), `:94` (`cmd-deep-research-plain-holdout-04`).
- `.skilled/skills/system-deep-loop/hub-router.json:34`, `.skilled/skills/system-deep-loop/ROUTER.md:63`, `.skilled/skills/system-deep-loop/SKILL.md:20`.
- `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown:1` and `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown:1` (generated headers).
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1/review-scope-files.txt:1` (the 54-file seeded scope).
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97` (AC-040).
- `.skilled/skills/system-deep-loop/runtime/scripts/terminal-gates.cjs:168` (`scopeGateRow`), `:191` (`coverageGateRow`).

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The seeded review scope omits the files four requirements change, so `spec_code` cannot close on them without failing the terminal scope gate** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:161` -- The scope every lineage inherits (`review-scope-files.txt`, 54 entries) carries the packet docs, the advisor `lib`/`tests`/`scripts` files, the two presentation files, the two command docs and the deep-loop reducer. It carries none of the change-set rows for REQ-009 (`.skilled/commands/deep/assets/deep-research.yaml`, `deep-review.yaml`), REQ-011 (`.skilled/skills/system-deep-loop/hub-router.json`, `ROUTER.md`, `SKILL.md`, `deep-research/SKILL.md`, `deep-review/SKILL.md`, `deep-research/references/guides/quick-reference.md`), or REQ-012/REQ-013 (`.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl`, `command-routing-baseline.json`), and it carries neither `runtime/dist/` nor `assets/compiled/` from REQ-006/REQ-007. `terminal-gates.cjs` `scopeGateRow` (`:168`) compares each registry finding's `file` against `reviewScopeFiles` plus the review-target folder only, so any defect recorded on one of those twelve surfaces reports `findings-out-of-scope` and the terminal scope gate the packet's AC-040 requires to pass fails; a reviewer who instead stays inside the scope cannot record what those rows claim. The same list omits six paths the acceptance rows cite as their evidence (`scratch/probes/fresh-review-hook.txt`, `scratch/behaviour/F6-sample-1.md`, `hub-router.json`, `deep-research.yaml`, `SKILL.md`, `command-prompts.jsonl`), so `checklist_evidence` on those rows also reads a file outside the declared scope.
   Finding class: `class-of-bug` (a scope-definition defect that recurs on every rerun of this packet, not one stale path).
   Scope proof: the finding is anchored on `spec.md`, a packet document inside the review target, and names the omitted surfaces as affected hints rather than reporting findings on them; `review-scope-files.txt` is inside the target folder, so both files the claim rests on are inside scope.
   Affected surface hints: `step_scope_discovery`'s `spec-folder` resolve rule (`deep-review.yaml:745`), the packet's `## 3. SCOPE` change-set table (`spec.md:161`), and AC-014, AC-016, AC-017, AC-018, AC-019, AC-020, AC-043 whose evidence cells name those files.
   Case: run the packet's own rerun, as T084/AC-040 ask, and report one defect in `deep-research.yaml` (for example a missing `--restart` in its completed-packet message); the registry records `file: .skilled/commands/deep/assets/deep-research.yaml:<n>`, `scopeGateRow` finds no scope entry containing it, and the synthesis report's scope gate reads `findings-out-of-scope` with `review/review-report.md` FAIL - the outcome generations 5 and 6 recorded, one of them on the scope gate itself.

   ```json
   {"type":"claim_adjudication","id":"R1-P1-001","claim":"The seeded review scope omits twelve declared change-set surfaces, and a finding recorded on any of them fails the terminal scope gate, so spec_code for REQ-009/REQ-011/REQ-012/REQ-013 cannot be closed inside the scope AC-040 requires.","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1/review-scope-files.txt:1","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:161",".skilled/skills/system-deep-loop/runtime/scripts/terminal-gates.cjs:168","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97"],"counterevidenceSought":"Read `scopeGateRow` for an exception that admits findings outside reviewScopeFiles and found two (`reviewTargetScopeEntries`, which admits the packet folder, and the absolute-path suffix rule), neither of which reaches `.skilled/commands/deep/...` or `.skilled/skills/system-deep-loop/...`; read the `step_scope_discovery` resolve rule to check whether a manifest was meant to widen the list, and no `goal-file-manifest.txt` exists in the packet.","alternativeExplanation":"Scope discovery may be deliberately narrower than the change set, on the view that a review validates behaviour instead of every touched file. That explanation does not survive the acceptance rows: AC-014, AC-018 and AC-020 make their checks by searching those files, so the packet itself treats them as reviewable evidence.","finalSeverity":"P1","confidence":0.86,"downgradeTrigger":"Downgrade to P2 if the fan-out root's scope is declared advisory for `spec_code` evidence (a packet doc that states evidence may be read outside reviewScopeFiles), or if `reviewScopeFiles` on this rerun is shown to be a subset of a wider scope the merge re-derives.","file":"specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:161"}
   ```

### P2 Findings

2. **AC-040's evidence pointer names the live report path that this rerun's restart has already archived** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97` -- The row's `Evidence:` tail reads `review/review-report.md:71` (`Per-lineage verdicts`). No `review/review-report.md` exists at the packet root: the generation-6 report was archived to `review-archive/20261124T190150Z/review-report.md` when the generation-7 run opened at 19:01:50, and line 71 of that archived copy is the cited `- **Per-lineage verdicts:** FAIL in all three, on coverage only.` The citation therefore resolves only until the next restart, which is the very event AC-040 asks for, so the row's own evidence is invalidated by the rerun that would close it.
   Finding class: `instance-only` (one evidence cell, not a class of them - all 55 other `Evidence:` tails resolve on the tree).
   Scope proof: `acceptance-criteria.md` is inside the review target; the missing path and the archived copy were both resolved on disk.
   Affected surface hints: AC-040, `tasks.md` T084, `implementation-summary.md` `_memory.continuity.next_safe_action`.
   Case: a reader or a tail check resolving AC-040's `Evidence:` reference on the generation-7 tree, before the merge writes the new report, gets "file not found"; after the merge writes `review/review-report.md` the reference points at the new report instead of the generation-6 text the cell describes, so the anchor either misses or describes the wrong run.

## Traceability Checks

| Protocol | Status | Coverage this iteration | Evidence |
|---|---|---|---|
| `spec_code` | `partial` | REQ-001 to REQ-014 checked against the code, the command assets or the decision record; REQ-023 to REQ-048 carried to iteration 2 | `command-attach.ts:949` (`LOOP_REQUEST`), `explicit.ts:454`, `deep-review-presentation.txt:13`, `review.md:81`, `hub-router.json:34` |
| `checklist_evidence` | `pending` | Ticked tasks, `Met` rows and `CHK` boxes carried to iteration 3 | `acceptance-criteria.md:97` |

Per-requirement result, part 1:

- REQ-001 (plain loop asks gain the row): `LOOP_WORDING` (`command-attach.ts:330`) and `LOOP_REQUEST` (`:949`) cover the named/deep/loop forms; the built gate (`dist/runtime/lib/command-attach.js`) returned `/deep:review` for "run two review loops of the importer" on a review route and for "run a deep loop on the cache layer" through `asksForLoopRun`. Met.
- REQ-002 (depth-only carries no command): `attachCommand` returned `undefined` for "do a thorough code review"; the depth-word `it.each` list (`command-attach-guards.vitest.ts:535`) holds seven depth prompts against `undefined`. Met.
- REQ-003 (named, typed and continue requests keep the command): `ITERATIVE_ASK` (`:369`), `LOOP_REQUEST` (`:949`) and the typed-command branch (`:1537`) carry these; `attachCommand` returned `/deep:review` for "run /deep:review on the parser, then /create:changelog". Met.
- REQ-004 (negatives unchanged): no word list in this iteration's read touches the seventeen negative prompts; carried to the checklist pass for the probe evidence. Met at the gate level.
- REQ-005 (offer taught where the AI reads it): both presentation files carry `### Offer From an Advisor Brief` at line 13 with the three options (`:37`), the flag table (`:41`) and the On A/B/C line that binds `--spec-folder=<the Gate 3 answer>` (`:64`); `review.md:81` and `research.md:86` carry step 0 and name the three options. Fan-out is earned by two or more executors or models, per the flag table row. Met.
- REQ-006 (gate change tested and served): the fixture holds 347 cases each with `asksForLoopRun`, both suites read the same file (`$comment` at `deep-loop-offer-cases.json:2`), and the guards file holds the depth-word `undefined` cases. `dist` is present and served the probes above. Met, with the suite-run evidence carried to iteration 3 because this lineage cannot run repo tooling.
- REQ-007 (command edits stay consistent): both compiled contracts' `sourceDigests` match the current files byte for byte (computed; 15 and 16 sources, 0 stale) and neither holds `ASK with SINGLE prompt`. The mirror and reference scripts were not run from this lineage (write containment); carried to iteration 3 as an unverified sub-clause.
- REQ-008 (stage-one loop rule): `explicit.ts:454` reads `passesAsked` behind `asksForLoopRun` or `isStuckRunComplaint`; the council cue at `:151` remains for `/speckit:ai-council`, which REQ-011 only removes from the gate's depth list. Met.
- REQ-009 (finished and stuck runs name their way forward): `deep-research.yaml:663` names `--extend=N` and `--restart`; `deep-review.yaml:2534` carries the `--extend=N` next step and `:2535` the `/doctor:deep-loop --scope=review` row; both presentation files carry the matching Next Steps rows. Met.
- REQ-010 (setup through the question tool): step 6 of both files (`deep-research-presentation.txt:223`, `deep-review-presentation.txt:237`) names `communication-handoff.md` §5, Q2 reads `A) Autonomous (Recommended)` and Q-Exec `A) Native (Recommended, default)` (`:267`, `:277`). Met.
- REQ-011 (drift rows cleared): the council words are gone from the gate's depth vocabulary, `iterative research` and `multi-round research` are in `hub-router.json:34` and `ROUTER.md:63`, `autonomous research` is in neither, the depth triggers are gone from both mode `SKILL.md` files, the hub `SKILL.md:20` names `/doctor:deep-loop`, and `quick-reference.md:74` uses `=` flags. Met, subject to the scope finding above.
- REQ-012 (single-probe misses recorded): 31 `near-miss` rows; `nm-system-deep-loop-03` is the N9 row; ADR-001 records the reversal. Met.
- REQ-013 (deep-family holdouts replaced): the three `-04` holdout rows are present (`command-prompts.jsonl:94` and two beside it) and no `-01` deep-family holdout remains. Met.
- REQ-014 (N9 carries no deep command): `attachCommand` returned `undefined` for N9 on both routes; `nm-system-deep-loop-03` stays a corpus row. Met.

## Integration Evidence

- Command documents: `.skilled/commands/deep/review.md:81` and `.skilled/commands/deep/research.md:86` both carry step 0 and name the three options; the compiled contracts for both commands are regenerated against the current sources (digest comparison, 0 stale).
- Advisor runtime: the built `dist/runtime/lib/command-attach.js` was imported and probed for twelve prompts across REQ-001, REQ-002, REQ-023 to REQ-027, REQ-035, REQ-040, REQ-041, REQ-043 and REQ-044; all twelve agreed with the requirement text.
- Hub: `hub-router.json` and `ROUTER.md` carry the two research aliases and not the dropped one; the hub `SKILL.md` names `/doctor:deep-loop`.
- Terminal gates: `.skilled/skills/system-deep-loop/runtime/scripts/terminal-gates.cjs` `scopeGateRow` (`:168`) and `coverageGateRow` (`:191`) are the two rows the packet's AC-040 reads, and `:168` is what finding 1 is measured against.

## Edge Cases

- Ambiguity: `reviewTargetScopeEntries` admits the whole packet folder to the scope, so packet-doc findings (including finding 2) are inside scope even though `acceptance-criteria.md` is not a line in `review-scope-files.txt`. Recorded so the scope finding is not over-read as "no doc finding can be in scope".
- Contradiction, adjudicated: the `scopeGateRow` comment says a review whose target is a spec folder names the folder "rather than every file the review read", which supports the narrower reading; but AC-014/AC-018/AC-020 make file-search checks on files outside it, which supports finding 1. Both sides are cited in the finding rather than one being dropped.
- Missing dependency: `sync-runtime-mirrors.cjs --check` and `validate-command-references.cjs` were not run from this lineage (they write outside the lineage on some paths), so REQ-007's second clause is `partial`, not a pass.
- Partial success: `spec_code` is `partial` after this iteration by design; part 2 and `checklist_evidence` are carried forward.

## Confirmed-Clean Surfaces

- The offer section in both presentation files matches REQ-005 clause by clause, including the recommended option, the `:auto` plus `--spec-folder=<Gate 3 answer>` binding and the fan-out threshold.
- The compiled deep command contracts are byte-fresh against fifteen and sixteen sources respectively.
- The vocabulary in `command-attach.ts` and `skill_advisor.py` agrees entry for entry on twenty independently compared lists (drift 0), which is the substance behind REQ-031 and REQ-045.

## Ruled Out

- "The offer section is missing from the compiled command contracts, so REQ-007 fails": ruled out. `compile-command-contracts.cjs` renders named blocks rather than the presentation wholesale, and its header digests prove the contracts were regenerated against the edited presentation.
- "`attachTypedCommand` named by REQ-029 does not exist": ruled out. It is exported from `handlers/advisor-recommend.ts:442` and imported by the handler test; the initial search only covered `lib/`.
- "The council words reappear in the scorer, so REQ-011 fails": ruled out. `explicit.ts:151` keeps them for the `/speckit:ai-council` cue, which REQ-011 does not ask to remove; the gate's depth vocabulary is where they had to leave.

## Next Focus

- Dimension: `traceability`.
- Focus area: `spec_code` part 2 - REQ-015 to REQ-048, with the sixth fix round's REQ-023 to REQ-034 and ADR-005/ADR-006 checked against `command-attach.ts`, `fusion.ts`, `subprocess.ts`, `skill-advisor-cli.ts`, `advisor-recommend.ts` and the shared fixture.
- Reason: part 1 closed eleven of the fourteen requirements in its block; the sixth-round block is the focus the operator named and is not yet checked.
- Rotation status: `traceability` remains active; `correctness`, `security` and `maintainability` are uncovered.
- Blocked/productive carry-forward: productive - direct reads of the gate plus `dist` probes found no behavioural gap and did find the scope defect; carry the probe method forward.
- Required evidence: one `traceabilityChecks.results[]` entry per protocol run, and a file:line for every REQ row resolved or left `partial`.
- Recovery note: none; this iteration ran normally.

Review verdict: CONDITIONAL
