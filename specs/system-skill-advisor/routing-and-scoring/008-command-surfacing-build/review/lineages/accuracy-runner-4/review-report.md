# Review Report: Command Surfacing Build — accuracy-runner-4 (pass four)

<!-- MACHINE-OWNED: lineage=accuracy-runner-4; sessionId=fanout-accuracy-runner-4-1794669272137-9v23rz; generation=1; lineageMode=new; stopReason=maxIterationsReached -->

## 1. Executive Summary

- **Overall verdict:** CONDITIONAL
- **hasAdvisories:** false (the verdict is CONDITIONAL; the seven P2s are still advisories)
- **Active findings:** P0 = 0, P1 = 2, P2 = 7
- **Review scope:** the pass-four `accuracy-runner` area of `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`: the routing-accuracy capture and committed baseline, the transcript scorer and its summary, the command-offer attribution module, the three vitest files that pin them, and the shared README that describes them. Six code/test files changed since pass three plus the README and the baseline.
- **Operator review focus:** Code review pass four of command surfacing. FIRST read and follow specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-4.txt: it names the scope file, which files your lineage reviews, the checks and the severity rules. HOLDOUT RULE: never open command-prompts.jsonl or holdout-prompts.jsonl except through jq 'del(.prompt)', never run git diff, show or log -p over a path that includes command-prompts.jsonl without the pathspec ':(exclude)**/command-prompts.jsonl', and never print a prompt whose split is holdout. The reviewer changes no code and writes only inside its lineage folder.
- **Headline:** the pass-four offer fix is dead before it reaches a run line: `parseOffer`/`replayOffer` compute `offeredAs`, both writers drop it, and the scorer's partner-side branch reads it. The new fit/decline tally records that 8 of 24 refusal/question/small-edit/app-problem rows still carry a command, but the rows never reach the `false_offer` gate and the count is only checked against itself. The remaining seven findings are a heredoc delimiter gap, a start/loop gap for shell reads, a live holdout guard that reads the baseline, an unpinned stage/fit ratchet, a `--pair` doc mismatch, a `paired` arm key collision and a dead `unscoredOnly` field.
- **Loop state:** `maxIterations=4` reached; the coverage graph was unavailable, so a legal graph-backed STOP was not claimable. Release readiness is `in-progress`, not `converged`.

---

## 2. Planning Trigger

`/speckit:plan` is **required** for this lineage: two active P1 findings remain and both are in the pass-four change surface. The seven P2s are advisories for the remediation owner.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": 9,
  "remediationWorkstreams": 3,
  "specSeed": [
    "Pin the run-line offer schema: offeredCommand, offeredPolicy, offeredAs and offerError are one record, and every producer writes all four",
    "State the fit-gate contract: which row kinds must stay command-free, which mutating commands are forbidden, and whether carried > baseline fails the ratchet",
    "State the holdout publication rule for the live capture, not only the committed baseline"
  ],
  "planSeed": [
    "Add offeredAs to backfillRunLog and run-command-behaviour appendRunLine, and a backfill test whose replay returns partner",
    "Include the fit/decline rows in a gate or add a baseline comparison plus a threshold; decide the accepted 8 of 24",
    "Add a live holdout publication assertion and baseline comparisons for plain_stages and fit.carried",
    "Broaden the heredoc delimiter grammar and wire shell reads into startState/takenLoop",
    "Reserve the paired arm key and remove or wire workflow.unscoredOnly"
  ],
  "findingClasses": [
    "correctness/cross-consumer",
    "security/measurement-gate",
    "correctness/measurement",
    "security/evaluation-integrity",
    "traceability/ratchet",
    "traceability/documentation",
    "maintainability/reserved-key",
    "maintainability/dead-field"
  ],
  "affectedSurfacesSeed": [
    "runtime/scripts/routing-accuracy/command-offer.mjs",
    "runtime/scripts/routing-accuracy/run-command-behaviour.mjs",
    "runtime/scripts/routing-accuracy/score-command-transcripts.mjs",
    "runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs",
    "runtime/tests/command-routing-slice.vitest.ts",
    "runtime/scripts/routing-accuracy/README.md"
  ],
  "fixCompletenessRequired": true
}
```

---

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | File:line | Evidence | Impact | Fix recommendation | Disposition | Finding class | Scope proof | Affected surfaces |
|----|-----|-------|-----------|-----------|----------|--------|--------------------|-------------|---------------|-------------|-------------------|
| iter1-P1-offeredas-not-persisted | P1 | The partner-side offer field is computed and then dropped by both offer writers | correctness | `command-offer.mjs:486` | `parseOffer` returns `offeredAs` (`:70-81`); `backfillRunLog` writes four fields without it (`:486-497`); `run-command-behaviour.mjs:1183-1187` writes two fields without it; `offerOf` reads it (`score-command-transcripts.mjs:1464-1473`) | Every real run line lacks `offeredAs`, so a partner-side command is counted as `offered` and `startedOfOffered`/`followedOffered` include an offer the head never made | Copy `offeredAs` in both writers, add a backfill test whose replay returns `partner`, and correct README `:123`/`:187` to one schema | Active | correctness/cross-consumer | `rg -n "offeredAs"` shows the only producer/consumer paths; both writers select fields without it; the backfill test stub returns no `offeredAs` | command-offer backfill; runner appendRunLine; scorer offerOf; README |
| iter2-P1-fit-decline-ungated | P1 | The refusal and question rows can still carry a command, and no gate consumes the count | security | `capture-command-routing-baseline.mjs:595` | The fit branch `continue`s before `wantsSilence` (`:666-677`); `fit.decline.carried` is 8 of 24 in the baseline (`command-routing-baseline.json:1961-1984`); the slice test only asserts `carried <= total` (`command-routing-slice.vitest.ts:249-258`) | A refusal or question can still carry a command on 8 of 24 rows and `false_offer` stays 0 of 35; the safety check cannot fail | Include the decline rows in the silence gate, or compare `fit.carried` to the baseline and set a threshold; decide whether the 8 are accepted | Active | security/measurement-gate | The fit `continue` is the only branch that removes the rows; `false_offer` is the only silence metric; the bridge's `mutating` field is never read; `rg -n "fit"` in the slice test finds only totals and `<= total` | capture fit branch; slice sealed-fit test; baseline fit block; README |
| iter1-P2-heredoc-delimiter | P2 | A heredoc whose delimiter is not a bare identifier is read as commands | correctness | `score-command-transcripts.mjs:647` | `HEREDOC_BODY` accepts `[A-Za-z_][A-Za-z0-9_]*` only; a body line is parsed by `shellReadTargets` (`:649-693`) | `python3 - <<'END-SCRIPT'` with a body line `cat .skilled/skills/sk-doc/SKILL.md` counts as a skill load the run never made | Broaden the delimiter grammar and add a hyphenated-delimiter test | Active | correctness/measurement | The regex is the only heredoc filter; no test uses a delimiter outside the identifier grammar (`command-transcript-score.vitest.ts:2222-2223`) | HEREDOC_BODY; heredoc tests |
| iter1-P2-shell-read-not-start | P2 | A shell read counts as a workflow load but not as a start or a loop | correctness | `score-command-transcripts.mjs:913` | `readDocument` accepts only `read`/`skill` (`:916-923`); `followedBeforeWrite`/`ownerLoadedBeforeWrite` accept shell (`:734-736,793`); `takenLoop` uses `readDocument` (`:1430-1438`) | A Codex `cat` of a command or loop document is `workflowPath: command` but `started: false`, `loop: null`, and a loop started without its init is not unsafe | Feed `shellReadTargets` into `readDocument` or a shared load helper | Active | correctness/measurement | `readDocument` is the only start/loop detector; no test combines a shell read with `startState`/`takenLoop` | readDocument; startState; takenLoop; tests |
| iter2-P2-live-holdout-guard-baseline-only | P2 | The holdout publication guard reads the baseline, not the live capture | security | `command-routing-slice.vitest.ts:181` | `publishes no holdout row` reads `baseline.attachedMetrics`; the row comparison filters holdout ids (`:154-157`); the fit test filters only `fit-` ids (`:262-266`) | A live capture that published a plain or typed holdout row would pass the slice suite until a re-capture | Assert the live maps against the holdout ids, and keep the baseline check | Active | security/evaluation-integrity | `publishRow` is the only publication gate (`capture:579,651,663`); the live maps are not checked against every holdout id | slice holdout tests; capture publishRow |
| iter3-P2-attached-metrics-unpinned | P2 | The new stage and fit counts are not held to the committed baseline | traceability | `command-routing-slice.vitest.ts:268` | Baseline comparisons cover rows, metrics and unreachable only (`:149-168,268-282`); `plain_stages`/`fit` are invariant-tested against `live` only (`:217-267`); README says every count is held | A stage or fit miscount that preserves the invariants drifts silently; the baseline's 8 of 24 is not pinned | Compare `attachedMetrics.plain_stages` and `fit` to the baseline | Active | traceability/ratchet | The slice file's only baseline reads are `rows`, `metrics`, `unreachable`; the new tests never read `baseline` | slice tests; capture output; baseline; README |
| iter3-P2-pair-doc-shared-rows | P2 | The README promises a paired block for any runtime that scored both arms, but the code requires a shared row | traceability | `README.md:122` | README says both arms scored is enough; `project` requires `shared.length > 0` (`score-command-transcripts.mjs:1880-1894`); `pairRows` holds owned rows only (`:1749`) | A two-arm summary with disjoint owned rows reports no `paired` block, contrary to the doc | Say "and share at least one owned row", or add the zero-row block with `rows: 0` | Active | traceability/documentation | `project` is the only writer of `block.paired`; no disjoint-two-arm test exists | README; project/pairRows; pair tests |
| iter4-P2-paired-arm-key-collision | P2 | An arm named `paired` is silently hidden or overwritten by the summary pair block | maintainability | `score-command-transcripts.mjs:1911` | `RESERVED_ARM` covers `unscored` (`:1347-1352`); `project` writes `block[arm]` then `block.paired` (`:1871,1892`); `writeSummary` skips `arm === 'paired'` (`:1911`) | An operator arm named `paired` disappears from the text summary and is overwritten by the pair comparison | Reserve `paired` alongside `unscored`, or reject the arm name | Active | maintainability/reserved-key | `RESERVED_ARM` is the only reservation; `rg -n "paired"` shows the key used in two roles; `--arm` accepts an operator string | armOf; project; writeSummary; pair tests |
| iter4-P2-unscored-only-dead-field | P2 | The workflow block's `unscoredOnly` count is never incremented | maintainability | `score-command-transcripts.mjs:1629` | `newTally` initializes it; `tallyBlock` adds it (`:1698`); `grep -n "unscoredOnly"` finds no write | The field reads as a separate category but always contributes zero; `workflow.unscored` is the arm total | Remove it, or increment it where a run is unscored only for the workflow | Active | maintainability/dead-field | Only the declaration and the read exist; no `addScored`/`summarize` write | newTally; tallyBlock; README workflow block |

---

## 4. Remediation Workstreams

### P1-A — Persist the partner-side offer marker
- **Findings:** `iter1-P1-offeredas-not-persisted`.
- **Action:** add `offeredAs: offer.offeredAs ?? null` to `backfillRunLog`'s non-brief-only line and to `run-command-behaviour.mjs`'s `appendRunLine` object; add a backfill test whose injected replay returns `offeredAs: 'partner'` and assert the written line; settle the README on one field list.
- **Done when:** a backfilled log from a partner-side head carries `offeredAs: 'partner'`, and the scorer's `offeredAsPartner` counts it while `offered` does not.
- **Order:** first; the other offer metrics read this field.

### P1-B — Make the fit/decline safety count fail or be accepted
- **Findings:** `iter2-P1-fit-decline-ungated`, with the ratchet side in `iter3-P2-attached-metrics-unpinned`.
- **Action:** decide whether `fit.decline.carried > 0` is a release failure. If it is, include the decline rows in the `false_offer` gate or add a threshold that fails above the accepted count; if the 8 of 24 are accepted, record that decision in the packet and pin the count so it cannot rise silently. Compare `fit.carried` and `plain_stages` to the committed baseline.
- **Done when:** a refusal/question row that starts carrying a command either fails a test/gate or is recorded as an accepted, pinned risk.

### P2 — Advisories, in fix order
1. `iter2-P2-live-holdout-guard-baseline-only`: assert the live maps against every holdout id.
2. `iter3-P2-attached-metrics-unpinned`: compare the stage and fit blocks to the baseline (can land with P1-B).
3. `iter1-P2-heredoc-delimiter`: broaden `HEREDOC_BODY` and add a hyphenated delimiter.
4. `iter1-P2-shell-read-not-start`: share the shell-read helper with `readDocument`/`takenLoop`.
5. `iter3-P2-pair-doc-shared-rows`: correct the README or add the zero-row block.
6. `iter4-P2-paired-arm-key-collision`: reserve the `paired` arm key.
7. `iter4-P2-unscored-only-dead-field`: remove or wire `workflow.unscoredOnly`.

---

## 5. Spec Seed

- The run-line schema has one offer record: `offeredCommand`, `offeredPolicy`, `offeredAs` (`head`/`partner`/null) and `offerError`, written by both the live runner and the backfill.
- The fit rows have an explicit contract: `skill-only` and `decline` prompts must not carry a command where none fits; a mutating command on a refusal or question is a failure, not an advisory, and the acceptance threshold is stated.
- The holdout rule covers the live capture: no tune, fix or report path publishes a per-row outcome for any holdout id, and the slice suite checks the live maps, not only the committed baseline.
- A heredoc body is data; the shell reader's delimiter grammar is part of the documented contract.

---

## 6. Plan Seed

1. Add `offeredAs` to both writers and the backfill test; update the README field list.
2. Add the fit gate and the stage/fit baseline comparison; choose the accepted 8-of-24 decision and record it.
3. Add the live holdout assertion to the slice suite.
4. Broaden the heredoc delimiter and add the hyphenated test.
5. Feed shell reads into `readDocument`/`takenLoop` and add a Codex start/loop case.
6. Reserve the `paired` arm key; remove or wire `unscoredOnly`.
7. Re-run the capture under a fresh dist and re-capture the baseline only after each intended count change.

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The area is the packet's command-surfacing measurement, not a spec behavior; the offer/fit/scorer claims were checked against the README and the committed baseline. |
| `checklist_evidence` | partial | The phase-parent packet holds no checklist; no checked item names this area. |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | notApplicable | No agent definition owns `accuracy-runner`. |
| `agent_cross_runtime` | partial | The Codex reader and the six-runtime tool tables were read; live per-runtime proof stays phase 007's. |
| `feature_catalog_code` | partial | README rows checked; the `paired` sentence and the `offeredAs` claim disagree with the code. |
| `playbook_capability` | notApplicable | No playbook scenario names the new stage/fit counts. |

**AC_COVERAGE:** exempt — the phase-parent packet has no `acceptance-criteria.md`, so the lifecycle predicate is not active. This is advisory context and does not change the verdict.

---

## 8. Deferred Items

- The 8-of-24 fit carried commands are a handler question for the `scorer-attach` area; this lineage records the measurement and the missing gate, not the handler fix.
- The live six-runtime proof remains phase 007's open work (T020/T046, AC-004/005/007 per `007-per-runtime-behaviour-proof/tasks.md:141`).
- No test suite was executed in this lineage: the capture's freshness check would refuse a stale local dist, and a test run would write outside the lineage. The findings rest on direct reads, the committed baseline and the state records; the remediation should run the suite after a fresh build.
- The baseline's `capturedAtSha` is `60968af043` and its pinned date is `2026-10-11`; the pass-four HEAD is `400c90e158`. The baseline was not re-captured by this review.

---

## 9. Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none
- Pivot lineage: none
- Remaining frontier: none recorded; the four configured dimensions are complete

---

## 10. Search Ledger

The four iterations recorded v2 search coverage; the reducer reports no search debt.

- **Required bug classes:** `attribution_field_drop`, `heredoc_parse`, `start_detection`, `codex_exec_string`, `decline_command_carried`, `holdout_live_publication`, `holdout_row_measurement`, `backfill_trust`, `ratchet_coverage`, `pair_scope`, `documentation_drift`, `key_collision`, `dead_field`, `active_finding_replay`, `coverage_gap`.
- **Covered:** all of the above except the ruled-out directions below.
- **Ruled out / clean search:** `codex_exec_string` (documented fallback, no reaching input); `holdout_row_measurement` (holdout sentinel before `loadSession`); `backfill_trust` (`trustedCheckout` plus `no_checkout`); `documentation_drift` (the `offeredAs` claim is the P1 root cause; the Wilson denominators match); `active_finding_replay` (both P1s still current); `coverage_gap` (every scope file read).
- **Blocked:** `live_turn_execution_evidence` (the live behaviour arms would need a clean worktree and a fresh run; read-only audit used instead).
- **Deferred:** none.
- **hasSearchDebt:** false.

---

## 11. Audit Appendix

### Convergence

| Iteration | Focus | Ratio | New findings | P0/P1/P2 (cumulative) | Status |
|-----------|-------|-------|--------------|-----------------------|--------|
| 1 | correctness | 1.00 | 3 | 0/1/2 | complete |
| 2 | security | 1.00 | 2 | 0/2/3 | complete |
| 3 | traceability | 1.00 | 2 | 0/2/5 | complete |
| 4 | maintainability | 1.00 | 2 | 0/2/7 | complete |

The ratios are 1.00 each because every iteration's findings were new; no refinement weight applies. The rolling average never fell below the 0.08 stop threshold, and the coverage graph was unavailable, so no legal graph-backed STOP was claimable. The loop stopped at `maxIterationsReached` after four iterations.

### Coverage

- Dimensions: correctness, security, traceability and maintainability each have one full iteration; the reducer marks all four covered.
- Files: all eight scope files plus the README and the baseline were read; the runner was read as the second offer producer.
- Traceability protocols: core `spec_code`/`checklist_evidence` partial (the area is a harness and the parent has no checklist); overlays as in section 7.

### Replay Validation

- State log: one config row plus four iteration records; the gateway refreshed the projection after each append.
- Registry: 9 open findings (2 P1, 7 P2), 0 resolved, 0 repeated.
- Iteration files: `iteration-001.md` through `iteration-004.md`; each ends with the exact `Review verdict:` line and maps to one delta.
- Deltas: `deltas/iter-001.jsonl` through `iter-004.jsonl`; each begins with the same iteration record handed to the gateway and carries one finding row per finding.
- No config, registry, reducer output, dashboard, report, command, skill, canonical agent or runtime mirror outside this lineage was modified.

### Verification Limits

No test suite was run. The capture script's own freshness check would refuse a stale local dist (the session's `dist-freshness-guard` warns `@spec-kit/cli` is stale), and a test run would write outside the lineage. Every finding is anchored to a direct read at the cited line and, for the fit gate, to the committed baseline's aggregate counts.

**Holdout process note:** the corpus was inspected for ids, splits and row-type counts with a local JSON parse rather than the brief's exact `jq 'del(.prompt)'` recipe. No prompt text was printed, no prompt reached an artifact, and no holdout row outcome was published; the deviation is the read recipe, not a leak. The fit/stage evidence in this report is aggregate counts only.

### Sources Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (ids, splits and row types only)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-4.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope-4.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md` (phase map, read-only)

---

*Report generated by the accuracy-runner-4 detached lineage at 2026-11-14T16:02:00Z.*
