# Review Iteration 001 — deepseek-max-1

**Dimension:** traceability (D3)
**Protocol:** `spec_code`
**Focus:** every REQ in `spec.md` from REQ-001 to REQ-039 mapped to the code, asset or decision that implements it, with the operator focus carried in full: the sixth, seventh and eighth fix rounds (REQ-023 to REQ-039, AC-030 to AC-047, ADR-005, ADR-006) read against the served head, not only against the shared fixture.

BINDING: target=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers
BINDING: maxIterations=7
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers

## Dispatcher

- Run: `fanout-deepseek-max-1-1795518961022-7ms9ak`, generation 1, lineage mode `new`, fan-out lineage label `deepseek-max-1`.
- Execution: `cli-pi` model `deepseek-v4.1-flash-1017`, reasoning effort `max`, full sandbox access. This process is the iteration executor; no nested dispatch ran.
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-1`.
- Config read: `maxIterations=7`, `convergenceThreshold=0.1`, `stopPolicy=max-iterations`, four canonical dimensions, `reviewScopeFiles` = 46 paths.
- Steering channel: `steer.md` is absent from the lineage directory at iteration 1.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:208-357` (REQ-001 to REQ-039, SC-001 to SC-006)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:44-133` (AC-001 to AC-047, status column)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:225-262` (limitations 1 to 8)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:295-316` (Verification Summary and file-organization checks)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:320-470,480-620,980-1060,1380-1510`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:250-290` (plural, question, effort rows)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:60-100` (vocabulary pairs)
- `.skilled/commands/deep/assets/deep-review-presentation.txt:13-60,237-280,582-583`
- `.skilled/commands/deep/assets/deep-research-presentation.txt:13-58,223-246`
- `.skilled/commands/deep/review.md:81`, `.skilled/commands/deep/research.md:86`
- `.skilled/commands/deep/assets/deep-review.yaml:736,2265-2269`, `.skilled/commands/deep/assets/deep-research.yaml:663,2265-2269`
- `.skilled/changelog/skilled/v4.2.0.0.md:470-500,759` (read as context; cited for REQ-022/REQ-034 only)
- Context-only (outside the scope file list, read to test a served claim, never cited as finding scope): `.skilled/skills/system-deep-loop/hub-router.json:34,37,40`, `.skilled/skills/system-deep-loop/ROUTER.md:63-64`, `.skilled/skills/system-deep-loop/SKILL.md:20`, `.skilled/skills/system-deep-loop/deep-research/SKILL.md`, `.skilled/skills/system-deep-loop/deep-review/SKILL.md`.
- Prior lineage record read as context, not as evidence: `review/lineages/deepseek-max-1/containment/baseline/.../review-archive/20261124T111600Z/lineages/deepseek-max-2/iterations/iteration-001.md`.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **REQ-026's deferred-route guard never runs for the prompt it was built for** -- `command-attach.ts:1408` -- `attachCommand` consults `deferredLoopCommand` only when the compiled route is `defer` or `clarify`. The served head for "run a deep loop to review the research loop config" is a compiled route `route/single/research` (measured through `node .skilled/bin/skill-advisor.cjs advisor_recommend`), so the routed branch returns `/deep:research` at `:1471` and the subject blanking at `:1480-1496` is never reached. The requirement's stated outcome (review, not research) is therefore not delivered by the product; only the synthetic deferred-route case AC-033 pins is.
   Case: an operator types "run a deep loop to review the research loop config" — the exact prompt REQ-026 names — and the advisor offers `/deep:research (ask)` because the hub router scores `research loop` as a RESEARCH keyword (`hub-router.json:34`) and never defers. AC-033 passes because its vitest case injects the deferred route by hand (`command-attach-guards.vitest.ts:963`), so the row cannot detect this outcome.
   Finding class: `spec-mismatch` (requirement outcome not observable on the served path; not a data-loss or security issue).
   Scope proof: `spec.md:293` (REQ-026) and `acceptance-criteria.md:113` (AC-033) are review-scope entries; the served result was produced by the built advisor (`dist`), and the branch condition was read at `command-attach.ts:1408`. The hub keyword is context evidence, not a scope claim.
   Affected surface hints: `command-attach.ts:1408`, `command-attach.ts:1471`, `hub-router.json:34`, `command-attach-guards.vitest.ts:963`, `acceptance-criteria.md:113` (AC-033 verification cell).

   ```json
   {
     "type": "spec_mismatch",
     "claim": "REQ-026 says 'run a deep loop to review the research loop config' gets /deep:review, not /deep:research; the served head returns /deep:research because the route is route/single/research and the guard sits on the deferred branch only.",
     "evidenceRefs": [
       "node .skilled/bin/skill-advisor.cjs advisor_recommend (prompt: run a deep loop to review the research loop config) -> system-deep-loop /deep:research ask, compiledRoute action=route targets=[research]",
       "command-attach.ts:1408",
       "command-attach.ts:1471",
       "command-attach.ts:1480",
       "acceptance-criteria.md:113"
     ],
     "counterevidenceSought": "Read the deferred-branch code and the AC-033 test line. The requirement is explicitly scoped 'on a deferred route', and the code does return /deep:review on a deferred route. The test therefore passes on its own premise; the counterevidence does not rescue the requirement's intended outcome, because the router does not produce that premise for this prompt.",
     "alternativeExplanation": "The requirement may be intended to constrain only the deferred branch, and the routed path may be accepted as out of its scope. If so, the row is honest but the guard is unreachable for the motivating prompt, and the requirement should name the route it constrains.",
     "finalSeverity": "P1",
     "confidence": 0.9,
     "downgradeTrigger": "Downgrade to P2 if the router is changed to defer on this prompt, or if the requirement is amended to state that only synthetic deferred routes are covered and the routed-path outcome is accepted."
   }
   ```

2. **REQ-035 promises a command for eight plural run prompts; two carry none anywhere** -- `spec.md:326` -- Measured through the built advisor: "run two deep loops on the cache layer" returns `cli-external-orchestration` first and a `system-deep-loop` row with `command=null`, and "run two research loops on the cache and pick the better one" returns no `system-deep-loop` row at all. `deferredLoopCommand` returns undefined when the named cues resolve to no single mode (`command-attach.ts:1489`), and the hub router's keyword lists (`hub-router.json:34,37`) carry `research loop`/`review loop`/`deep loop` only in the singular, so a plural phrase is not what makes the hub top the list. AC-044 nevertheless reads `Met`, because its verification asserts only the fixture's `asksForLoopRun` column, which is true for both prompts.
   Case: an operator types "run two deep loops on the cache layer" — one of the thirteen rows AC-044 says it covers — and no recommendation carries a `/deep:*` command, so the offer the requirement promises never appears. The same happens for "run two research loops on the cache and pick the better one".
   Finding class: `spec-mismatch` (requirement outcome not observable; the gate predicate is right and the routing layer loses it).
   Scope proof: `spec.md:326` (REQ-035), `acceptance-criteria.md:122` (AC-044) and `deep-loop-offer-cases.json:253-261` are review-scope entries; the served result was read from the built advisor and the branch at `command-attach.ts:1489`. The hub keyword lines are context evidence for the mechanism.
   Affected surface hints: `command-attach.ts:1489`, `hub-router.json:34`, `hub-router.json:37`, `deep-loop-offer-cases.json:257`, `acceptance-criteria.md:122` (AC-044 verification cell), `spec.md:326` run-row list.

   ```json
   {
     "type": "spec_mismatch",
     "claim": "REQ-035 says eight plural run prompts carry /deep:review or /deep:research; two of the eight carry no /deep:* command on any served row, while AC-044 reads Met on the fixture predicate alone.",
     "evidenceRefs": [
       "advisor_recommend('run two deep loops on the cache layer') -> top cli-external-orchestration (no command), system-deep-loop row command=null",
       "advisor_recommend('run two research loops on the cache and pick the better one') -> no system-deep-loop recommendation in top 3",
       "command-attach.ts:1489",
       "hub-router.json:34",
       "acceptance-criteria.md:122"
     ],
     "counterevidenceSought": "Checked the other six plural run prompts: 'run deep reviews...', 'do two deep reviews...', 'run two deep-reviews...', 'run two deep researches...', 'run two deep-researches...' all carry /deep:review or /deep:research, and 'run two review loops of the importer' carries /deep:review on the hub row (second). So the requirement holds for six of eight, not all eight.",
     "alternativeExplanation": "REQ-035 may be intended as a gate predicate (asksForLoopRun true) with the offer left to routing; in that reading the wording 'carry /deep:review or /deep:research' overstates what was built, and AC-044 is honest about the layer it checks.",
     "finalSeverity": "P1",
     "confidence": 0.92,
     "downgradeTrigger": "Downgrade to P2 if REQ-035 is amended to say the gate reads the plural as an ask and the offer depends on a mode cue, with the two no-command rows recorded as known limits."
   }
   ```

### P2 Findings

3. **A past-run summary carries a doctor run command** -- `command-attach.ts:563` -- "summarize the deep reviews from last week" returns `command-doctor-deep-loop` with `/doctor:deep-loop (run)` as the top recommendation. The gate reads no loop ask for it (`asksForLoopRun=false` in the fixture at `deep-loop-offer-cases.json:261`), so REQ-035's "carry no `/deep:*` command" rows are satisfied, but no row or acceptance cell records that the doctor lane still offers a run. A request to summarize past results is answered with a diagnosis command that reads the run's live state.
   Case: an operator asks "summarize the deep reviews from last week" and the head offers `/doctor:deep-loop (run)`, which inspects a current run rather than the past reports the operator asked for.
   Finding class: `false-offer` (low blast: the doctor command is read-only, policy `run`, and the user must still choose it).
   Scope proof: `deep-loop-offer-cases.json:261` and `implementation-summary.md:258-260` are review-scope entries; the served result came from the built advisor. The doctor lane lives in a file outside the scope list, so it is named as a mechanism, not as a finding location.
   Affected surface hints: `deep-loop-offer-cases.json:261`, `acceptance-criteria.md:122`, `implementation-summary.md:258`.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial | Every REQ from REQ-001 to REQ-039 names a producer that exists: the gate (`command-attach.ts`), the Python copy (`skill_advisor.py`), the shared fixture, the presentation and command assets, the YAML messages, the reducer and the drift guard. Two requirements state an outcome the served head does not produce (REQ-026, REQ-035), so the protocol is `partial` rather than pass. |
| `checklist_evidence` | not run this iteration | Scheduled for iteration 2: every ticked task and every `Met` row against the tree, including AC-030 to AC-047 and the ADR-005/ADR-006 decisions. |

What this iteration actually ran, rather than read:

1. **The served head over 50 requirement prompts.** All 41 prompts named in REQ-015 to REQ-019, REQ-023 to REQ-029, REQ-035 to REQ-037 were sent through `node .skilled/bin/skill-advisor.cjs advisor_recommend`, and the first recommendation's `skillId`, `command`, `policy` and `typed` were read. REQ-015, REQ-016, REQ-017, REQ-018, REQ-023, REQ-024, REQ-025, REQ-027, REQ-028, REQ-029, REQ-036 and REQ-037 give their stated outcomes; REQ-019 gives its stated outcomes on all eleven prompts; REQ-026 and REQ-035 do not (findings 1 and 2).
2. **REQ-005, REQ-009, REQ-010, REQ-011, REQ-012 and REQ-013 read against the tree.** Both presentation files carry `### Offer From an Advisor Brief`; both command documents carry the step 0 pointer at `review.md:81` / `research.md:86`; the deep-research YAML completes with `--extend=N` and `--restart` at `:663` and both `next_steps` lists carry `--extend=N` and `/doctor:deep-loop --scope=` at `:2268-2269`; both presentation Next Steps tables carry the extend and doctor rows at `:582-583`; step 6 names the question tool from `communication-handoff.md` §5 and Q2/Q-Exec carry `(Recommended)` in both files; the two research aliases are in `hub-router.json:34` and `ROUTER.md:63` with no `autonomous research`; the depth triggers named by REQ-011 are gone from both mode `SKILL.md` files and the hub names `/doctor:deep-loop` at `SKILL.md:20`; the corpus holds 31 `near-miss` rows and the deep-family holdout rows carry `-04` ids.
3. **REQ-006 and REQ-007 read, not run.** The suites, `npm run build` and the mirror/reference gates write outside this lineage's write surface, so this iteration did not run them and does not claim their result. The fixture rows and the guard file's case lines were read instead.

## Integration Evidence

- Served head: `.skilled/bin/skill-advisor.cjs advisor_recommend` (built `dist/runtime/lib/command-attach.js`), 50 prompts, exit 0 each.
- Hub routing table: `.skilled/skills/system-deep-loop/hub-router.json` and `.skilled/skills/system-deep-loop/ROUTER.md`, read for the keyword sets that decide the routed mode.
- Shared fixture: `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json`, rows at `:253-271` and `:273-290`.
- Command documents and presentation assets: `.skilled/commands/deep/review.md`, `research.md`, `deep-review-presentation.txt`, `deep-research-presentation.txt`, `deep-review.yaml`, `deep-research.yaml`.

## Edge Cases

- **The `dist` build is the served artifact.** The measurement reads the built file, not a fresh compile; a source edit that was never rebuilt would show the old behavior. The served output agrees with the source paths read (`command-attach.ts:1408`, `:1489`), so the build is not stale for these branches, but this iteration did not verify `dist` freshness with `npm run build` because that writes outside the lineage.
- **REQ-026's wording is conditional.** The finding records the measured outcome and the requirement's own "on a deferred route" qualifier; the ambiguity is in the requirement, not in the measurement.
- **Suites not run.** All test-run claims (AC-009, AC-010, AC-028, AC-038, AC-042 and T087) are outside this iteration's evidence. They are not treated as passes or failures.

## Confirmed-Clean Surfaces

- REQ-015, REQ-016, REQ-017, REQ-018, REQ-023, REQ-024, REQ-025, REQ-027, REQ-028, REQ-029, REQ-036, REQ-037: served outcome matches the requirement on every listed prompt.
- REQ-019: all nine subject prompts carry no `/deep:*` command and all three controls keep theirs.
- REQ-005, REQ-009, REQ-010, REQ-011, REQ-012, REQ-013: the named sections, rows, aliases and corpus entries exist at the cited lines.
- REQ-020/AC-027: the requirement and the AC row both state the gate-layer scope and name the ADR-005 served exception; the row does not overclaim the served head.

## Ruled Out

- **REQ-027's stage-one claim is stale.** Ruled out: the served head for "several passes of the linter failed, review the config" returns `sk-code` with no command and no hub row, which is what AC-034 records.
- **REQ-037's effort controls leak.** Ruled out: the four control prompts ("run a fast deep review…", "run a faster…", "run a deep review on the slow path…", "improve the parser with a deep review") all keep `/deep:review (ask)`.
- **REQ-036's how-to exception is over-broad.** Ruled out: "how do I run a deep review? then run a deep review on the parser" keeps `/deep:review`, so the question exception does not swallow a later run clause.
- **REQ-029 regressed to the diagnosis.** Ruled out: "my deep review run is stuck, /deep:review again" returns `/deep:review (ask)` with `typed: true`, matching ADR-005.

## Next Focus

- **Dimension:** traceability
- **Protocol:** `checklist_evidence`
- **Focus area:** every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` from AC-001 to AC-047 against evidence that exists in the tree, including the sixth, seventh and eighth rounds.
- **Reason:** the core protocols must both be covered in the run, and `spec_code` has now run; the checklist half is where the closure record's stale counts and imprecise citations live.
- **Rotation status:** traceability stays active for one more iteration; correctness/security/maintainability follow.
- **Required evidence:** each task and AC row's cited path:line resolved and read; counts recomputed from the tracked files.

## Assessment

Dimensions addressed: traceability

The spec-to-code map is nearly complete and honest at the gate layer. The two P1 findings are the same class of gap: a requirement states a served outcome that the shipped path does not produce, while its acceptance row checks a narrower layer (a synthetic deferred route, a fixture predicate). The P2 is a routing-lane false offer that no requirement pins. No P0.

Review verdict: CONDITIONAL
