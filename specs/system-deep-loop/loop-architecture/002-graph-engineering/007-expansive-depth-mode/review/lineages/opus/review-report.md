---
title: "Deep Review Report - opus lineage, 17a9ddbcb68..555487146e2"
description: "Opus fan-out lineage review of fan-out trust, stop and kill, and blocked-stop dry-run work in system-deep-loop and the deep commands. Verdict FAIL on failed terminal gates, with 2 active P1 and 10 active P2."
---

# Deep Review Report - opus lineage

<!-- MACHINE-OWNED: START -->
- Session: fanout-opus-1795201537192-sq1ivw (generation 1, lineageMode new)
- Iterations: 24 of 24; stop reason `maxIterationsReached`
- Verdict (review-verdict.cjs): FAIL; hasAdvisories false
- Active counts the verdict used: P0 0, P1 2, P2 10; resolved 1
- Failed required terminal gates: scope, coverage
<!-- MACHINE-OWNED: END -->

## 1. Executive Summary

- **Overall verdict: FAIL.** No P0 is active. The verdict is FAIL because two required terminal gates fail at the stop: `scope` and `coverage` (terminal-gates.cjs, recorded as `deep_review.terminal_gates_recorded` at iteration-25). Without the gate failures the finding counts alone would give CONDITIONAL.
  - `coverage` fails with `traceability-incomplete`. spec_code is a hard `fail`: the packet every range commit cites has no requirement for this work (OPUS-F001-P2-004).
  - `scope` fails with `findings-out-of-scope`, for one finding only: OPUS-F001-P2-004 is anchored on the packet's `implementation-summary.md`, which is outside the commit-range file list. That anchor is unavoidable for a missing-spec finding.
- **hasAdvisories:** false (the verdict is not PASS).
- **Counts the verdict used:** P0 0, P1 2, P2 10. One finding was resolved during the run: OPUS-F001-P2-001, cleared by primary evidence in iteration 20.
- **Self-check outcomes:** both P1 findings were re-read at line level and confirmed with no severity change: OPUS-F003-P1-001 in iterations 2 and 14, OPUS-F003-P1-002 in iterations 6 and 19. The Referee changed nothing, so no self-check adjudication rows were appended.
- **Review scope:** commit range `17a9ddbcb68..555487146e2`, pathspec `.skilled/skills/system-deep-loop .skilled/commands/deep`, 88 touched files. This lineage owned frontier nodes F-1-001 (fan-out trust), F-1-003 (stop and kill) and F-1-005 (blocked stop and dry run), and admitted F-2-006 (rotated attempt logs) under F-1-001. All four nodes were answered across correctness, security, traceability and maintainability by iteration 16.
- **Why 24 iterations:** the frontier was drained at iteration 16, but legal convergence was blocked: dimensionCoverageGate needs `traceabilityCovered`, which a hard spec_code fail can never satisfy. Iterations 17-24 were recovery passes inside this lineage's nodes. They resolved one finding, confirmed two findings against this lineage's own ledger, measured the stdout-cap margin and corrected one anchor.

## 2. Planning Trigger

`/speckit:plan` is required: two P1 findings are active and two required gates fail.

```json
{
  "Planning Packet": true,
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "OPUS-F003-P1-001", "severity": "P1", "file": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4418", "dimension": "correctness"},
    {"id": "OPUS-F003-P1-002", "severity": "P1", "file": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1030", "dimension": "security"},
    {"id": "OPUS-F001-P2-002", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4924", "dimension": "correctness"},
    {"id": "OPUS-F001-P2-003", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:101", "dimension": "security"},
    {"id": "OPUS-F001-P2-004", "severity": "P2", "file": "specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/implementation-summary.md:78", "dimension": "traceability"},
    {"id": "OPUS-F001-P2-005", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:101", "dimension": "maintainability"},
    {"id": "OPUS-F003-P2-003", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4418", "dimension": "maintainability"},
    {"id": "OPUS-F005-P2-001", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:2031", "dimension": "correctness"},
    {"id": "OPUS-F005-P2-002", "severity": "P2", "file": ".skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:142", "dimension": "traceability"},
    {"id": "OPUS-F005-P2-003", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1912", "dimension": "maintainability"},
    {"id": "OPUS-F006-P2-001", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:384", "dimension": "correctness"},
    {"id": "OPUS-F006-P2-002", "severity": "P2", "file": ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2686", "dimension": "security"}
  ],
  "remediationWorkstreams": [
    {"id": "WS-1", "priority": "P1", "title": "Close every lineage on a signal stop", "findings": ["OPUS-F003-P1-001", "OPUS-F003-P2-003"]},
    {"id": "WS-2", "priority": "P1", "title": "Verify lineage identity before signalling a ledger pid", "findings": ["OPUS-F003-P1-002"]},
    {"id": "WS-3", "priority": "P2", "title": "Stamp and pass-evidence trust", "findings": ["OPUS-F001-P2-003", "OPUS-F001-P2-005", "OPUS-F006-P2-001", "OPUS-F006-P2-002"]},
    {"id": "WS-4", "priority": "P2", "title": "Blocked-stop record accuracy", "findings": ["OPUS-F005-P2-001", "OPUS-F005-P2-002", "OPUS-F005-P2-003"]},
    {"id": "WS-5", "priority": "P2", "title": "Lineage identity and packet traceability", "findings": ["OPUS-F001-P2-002", "OPUS-F001-P2-004"]}
  ],
  "specSeed": [
    "Add a child phase under 007-expansive-depth-mode that states requirements for pass evidence, the claimed-stamp window, the runner-written lineage block, --stop, SIGHUP and parent-death stops, --status, and the script-recorded blocked stop",
    "Require that every stop path, in-runner signal or external --stop, leaves one labelled terminal row per started lineage",
    "Require a lineage identity check, such as process start time or command line, before any ledger pid is signalled"
  ],
  "planSeed": [
    "writeStoppedSummary: append a labelled stopped row with rerun_command for each active lineage, keep the run-level row under a distinct event name",
    "detectLiveLineages and stopLiveFanoutRun: record process start time on the spawned row and compare it before treating a pid as live",
    "Add fanout-stop tests: rerun after SIGHUP charges no retry and --status shows stopped",
    "Single claimedStampOf helper shared by lineage-timestamp-window.ts and fanout-salvage.cjs; treat a missing stamp on an iteration record as its own anomaly",
    "readLineagePassSummary: judge each attempt's log against its own commit span instead of voiding all passes",
    "convergence.cjs: adjudicated counts only P0/P1 with packets; research row reports unevaluated gates as unknown; project mode, sessionId, generation and the ledger gate statuses into the blocked_stop state row or update convergence.md"
  ],
  "findingClasses": {"cross-consumer": 8, "instance-only": 4},
  "affectedSurfacesSeed": [
    ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs",
    ".skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs",
    ".skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs",
    ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts",
    ".skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts",
    ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs",
    ".skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md",
    ".skilled/skills/system-deep-loop/runtime/tests/unit/fanout-stop.vitest.ts",
    "specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Dim | file:line | Title | Class |
|----|-----|-----|-----------|-------|-------|
| OPUS-F003-P1-001 | P1 | correctness | fanout-run.cjs:4418 | A SIGHUP, SIGTERM or parent-death stop leaves every lineage open, so the next run requeues each as an orphan and charges it a retry | cross-consumer |
| OPUS-F003-P1-002 | P1 | security | fanout-run.cjs:1030 | `--stop` signals the process group of whatever now holds a ledger pid | cross-consumer |
| OPUS-F001-P2-002 | P2 | correctness | fanout-run.cjs:4924 | Lineage block written after exit, so a resumed research lineage scopes events under a second lineage id | cross-consumer |
| OPUS-F001-P2-003 | P2 | security | lineage-timestamp-window.ts:101 | A record with no `timestamp` escapes every stamp check | cross-consumer |
| OPUS-F001-P2-004 | P2 | traceability | 007 implementation-summary.md:78 | Cited packet records none of the range's work | cross-consumer |
| OPUS-F001-P2-005 | P2 | maintainability | lineage-timestamp-window.ts:101 | Three copies of the claimed-stamp choice, two predicates | cross-consumer |
| OPUS-F003-P2-003 | P2 | maintainability | fanout-run.cjs:4418 | `stopped` carries two shapes; `--status` shows a SIGHUP-stopped run as running | cross-consumer |
| OPUS-F005-P2-001 | P2 | correctness | convergence.cjs:2031 | Blocked-stop event says every finding is adjudicated | instance-only |
| OPUS-F005-P2-002 | P2 | traceability | convergence.md:142 | Documented blocked_stop row differs from the projection; skipped-gate unknown never reaches the state log | cross-consumer |
| OPUS-F005-P2-003 | P2 | maintainability | convergence.cjs:1912 | Research row hard-codes `hotspotSaturation: {pass: true}` | instance-only |
| OPUS-F006-P2-001 | P2 | correctness | fanout-salvage.cjs:384 | One untimed attempt log voids judgement of every pass, timed attempts included | instance-only |
| OPUS-F006-P2-002 | P2 | security | fanout-run.cjs:2686 | 20 MB stdout kill cap now counts the full claude stream-json transcript | cross-consumer |

Detail per finding (evidence, impact, fix, disposition):

- **OPUS-F003-P1-001.** Evidence: writeStoppedSummary appends `{event:'stopped', signal, at, gauges}` with no label (fanout-run.cjs:4416-4422) and exits inside the handler. collectOpenLineages skips label-less rows (fanout-pool.cjs:328-331) and closes only on a labelled `stopped` (:337-343). markOrphanedLineages then requeues each lineage, and readRetryCountsFromLedger counts `orphan_requeued` as a spent attempt (:271-279). Impact: after a closed terminal or a bootstrap SIGKILL, every rerun loses a retry per lineage, and no rerun command is recorded. Fix: write one labelled terminal row per active lineage on the signal path. Disposition: active, confirmed twice. Scope proof: one handler serves all forwarded signals and the parent watch (fanout-run.cjs:505-520, 4440). Surfaces: writeStoppedSummary, collectOpenLineages, readRetryCountsFromLedger, fanout-stop.vitest.ts.
- **OPUS-F003-P1-002.** Evidence: the `spawned` row holds the bare pid (fanout-run.cjs:4801-4808). Liveness is a kill-0 probe (fanout-pool.cjs:318-321, 373-375), and `--stop` sends SIGTERM to `-pid` (fanout-run.cjs:1030). The runner pid gets a command-line check (:1008-1015) but the lineage pid does not. Since 83800c3bfa2 the ledger is committed. The run-start refusal tells the operator to stop the named pid (:4351-4359). Impact: after pid reuse, `--stop` sends SIGTERM to an unrelated process group, and reruns are refused while that process lives. Fix: record and compare process start time or the command line. Disposition: active, not escalated to P0 (conditional on reuse plus an operator stop). Surfaces: stopLiveFanoutRun, detectLiveLineages, the spawned row, the `.gitignore` exception.
- **OPUS-F001-P2-002.** Evidence: writeLineageValues runs post-exit (fanout-run.cjs:4924). lineageId derives from parentSessionId (workflow-steps.cjs:95, synthesis-closeout.cjs:302-305). A non-complete config is reused across attempts (fanout-run.cjs:839-853). Impact: the ledger of a resumed research lineage carries two lineage ids. Whether a consumer breaks on this is inferred. Fix: write the block before the first attempt's run-open, or derive lineageId from the session id only. Disposition: active, inference on consumer impact.
- **OPUS-F001-P2-003.** Evidence: claimedTimestamp is projected only when the model wrote a string stamp (deep-review-state-contract.ts:294). The checks fall back to the gateway clock (lineage-timestamp-window.ts:101-103, :313; fanout-salvage.cjs:346-348). Neither the schema nor the verifier requires the field (verify-iteration.cjs:470-625). Impact: fabricated records pass every stamp check by omission. Fix: count a missing stamp on an iteration record as an anomaly. Disposition: active, kept at P2 in iteration 21.
- **OPUS-F001-P2-004.** Evidence: no requirement, task or summary line in the packet root or its 15 children. The 011 hits (spec.md:146, acceptance-criteria.md:62, tasks.md:86) concern Next Focus. Impact: spec_code has nothing to check against, which fails the coverage gate. Fix: add a child phase with requirements and acceptance rows. Disposition: active. It is also the sole cause of the scope gate failure.
- **OPUS-F001-P2-005.** Evidence: `hasOwnProperty` at lineage-timestamp-window.ts:101 versus `typeof === 'string'` at :313 and fanout-salvage.cjs:346. Impact: a future `claimedTimestamp: null` makes the checks disagree. Fix: one shared helper. Disposition: active.
- **OPUS-F003-P2-003.** Evidence: two producers of `event:'stopped'` (fanout-run.cjs:1044, :4418). Both consumers drop label-less rows (fanout-pool.cjs:328, fanout-run.cjs:610). Impact: `--status` reports a SIGHUP-stopped run as running. Fix: give the run-level row a distinct name, or add labelled rows. Disposition: active.
- **OPUS-F005-P2-001.** Evidence: `adjudicated: p0 + p1 + p2` (convergence.cjs:2031). This lineage's own event at ledger sequence 20 shows `candidates 13, adjudicated 13` with 11 P2. Fix: count only adjudicated P0/P1. Disposition: active, confirmed live.
- **OPUS-F005-P2-002.** Evidence: convergence.md:142-171 versus the projection keys (deep-review-state-contract.ts:217-229), confirmed on this lineage's state row (deep-review-state.jsonl:20). gateResults is gateDetail with `{pass:true, skipped:true}` (convergence.cjs:998-999). Fix: align the doc or the projection, and project the ledger gate statuses. Disposition: active.
- **OPUS-F005-P2-003.** Evidence: convergence.cjs:1912, against the review rule at :1976-1978. Fix: report unevaluated as unknown once the upcast accepts it. Disposition: active.
- **OPUS-F006-P2-001.** Evidence: fanout-salvage.cjs:384-386, pinned by fanout-pass-evidence.vitest.ts:162 for the plain-text case. Impact: a quota-failed stream-json attempt with no timed event voids every later pass. Fix: judge per attempt. Disposition: active (anchor corrected from :273 in iteration 24).
- **OPUS-F006-P2-002.** Evidence: `maxBuffer: 20 MB` (fanout-run.cjs:4791) with SIGTERM at :2686-2689, and stream-json `--verbose` at :2922-2925. Measured: this lineage's own transcript was about 4.0 MB at iteration 21 of 24, roughly 5x headroom. Fix: cap only the retained copy, not the process, or raise the cap for stream-json. Disposition: active P2.

Resolved: **OPUS-F001-P2-001** (claude stream-json timing rests on an unverified `timestamp`). The installed CLI 2.1.329 builds assistant and user events with a top-level `timestamp` (iteration 20).

## 4. Remediation Workstreams

1. **P1, WS-1:** close every lineage on a signal stop (OPUS-F003-P1-001, with OPUS-F003-P2-003 as the same fix's naming half).
2. **P1, WS-2:** identity check before signalling ledger pids (OPUS-F003-P1-002). Land after WS-1, which removes most stale open rows.
3. **P2 advisories:** WS-3 stamp and pass-evidence trust; WS-4 blocked-stop record accuracy; WS-5 lineage identity and the missing packet requirements.

## 5. Spec Seed

- A child phase under `007-expansive-depth-mode` for the fan-out trust and stop round, with requirements for: per-pass evidence, the claimed-stamp window, the runner-written lineage block, `--stop`, SIGHUP and parent-death stops, `--status`, and the script-recorded blocked stop with its dry-run guard.
- Invariant: every stop path leaves exactly one labelled terminal row per started lineage.
- Invariant: no ledger pid is signalled without an identity match.

## 6. Plan Seed

- T1 writeStoppedSummary writes labelled `stopped` rows with `rerun_command`. Test: a rerun after SIGHUP and after parent death charges no retry, and `--status` shows stopped.
- T2 the spawned row records process start time. detectLiveLineages and stopLiveFanoutRun compare it. Test: a reused pid is not signalled.
- T3 a shared `claimedStampOf` helper, plus a missing-stamp anomaly.
- T4 per-attempt pass judgement in readLineagePassSummary.
- T5 convergence.cjs blocked-stop counts and research unknown-gate parity, then the convergence.md row update.
- T6 the spec child phase from section 5.

## 7. Traceability Status

**Core protocols**
- `spec_code`: **fail** (hard). Complete search of the packet root and its 15 children, iterations 9 and 17. No requirement governs the range's code (OPUS-F001-P2-004).
- `checklist_evidence`: **notApplicable**. No acceptance or checklist row exists for this work. A replay across the 001, 010 and 011 acceptance criteria confirmed it (iteration 23).

**Overlay protocols**
- `feature_catalog_code`: **pass**. fanout-salvage.md and fanout-run.md (pass evidence, lineage block, Status and Stop) and convergence-script.md match the code (iterations 9, 10, 11, 12).
- `playbook_capability`: **partial**. The playbook covers `--status` and `--stop` but no rerun after a SIGHUP stop (fanout-run-cli-lineage-spawn.md:58-80).
- `skill_agent`, `agent_cross_runtime`: not run. These nodes have no agent surface.
- `AC_COVERAGE`: exempt (files target, not spec-folder).

## 8. Deferred Items

- `--stop` builds its rerun command from its own argv, a documented requirement (fanout-run.md Status and Stop).
- `isFanoutLineage` treats any `lineages/` parent as fan-out (verify-iteration.cjs:382). This predates the range.
- The duplicated log-name regex in fanout-salvage.cjs is two instances, below the abstraction bar.
- `readOnly` uses strict `=== true` while `recordBlockedStop` uses `asBoolean` (convergence.cjs:2199-2200). This predates the range.
- On a dry run, `step_emit_blocked_stop` logs "Blocked STOP recorded" although nothing was recorded (deep-review.yaml:1286, deep-research.yaml:1183).

## Dimension Expansion Map

- Saturated directions: none recorded by the reducer. Completed, failed and audited pivots: 0. No Council artifacts.
- Frontier: F-1-001, F-1-003 and F-1-005 (seed share), plus F-2-006 (admitted at iteration 1 under F-1-001). All are answered on four dimensions. Remaining frontier: none.

## 9. Search Ledger

- searchCoverage (reducer): requiredBugClasses `doc_drift` (latest record), covered none, ruledOut `doc_drift`, graphCoverageMode `graphless_fallback`.
- candidateCoverage covered across the run: contract_ambiguity, doc_drift, duplication, frontier:F-1-001, frontier:F-1-003, frontier:F-1-005, frontier:F-2-006, inconsistency, input_validation, pid_reuse, process_lifecycle, resource_exhaustion, spec_drift, state_transition, trust_boundary.
- searchDebt: none (hasSearchDebt false).
- Ruled-out candidates (one per iteration delta): review-frame skew zero; pool failed row after signal; dry-run snapshot persistence; redaction corrupting JSON; symlink write-through; `--status` writing; shell injection on the blocked-stop spawn; crafted log line crash; catalog drift (three times); dry-run wording drift; untimed-rule drift; fanout-run.cjs split; duplicate kill helpers; gate-order drift; logs-dir walker extraction; spec_code as pass on catalog evidence; P0 escalation of OPUS-F003-P1-002; P1 escalation of OPUS-F005-P2-001; downgrade of OPUS-F001-P2-003; escalation of OPUS-F006-P2-002; stream-json timestamp absence.

## 10. Audit Appendix

**Convergence summary.** newFindingsRatio by iteration: 1, 0.71, 0.13, 0.11, 0.10, 0.33, 0, 0.06, 0.06, 0, 0.05, 0, 0.05, 0.05, 0.05, 0, then 0 for 17-24. The graph decision moved to STOP_ALLOWED once the coverage graph was backfilled. Legal stop then stayed BLOCKED or STUCK_RECOVERY on dimensionCoverageGate because of the hard spec_code fail. The final decision was STOP `maxIterationsReached`, with blockedBy `[dimensionCoverageGate]`.

**Coverage summary.** Four dimensions covered on every node. Coverage terminal gate fails on traceability.

**Recorded conflicts and deviations (lineage-internal, per the dispatch's record-and-continue rule).**
- Iteration verdict lines: iterations 3-5 and 7-16 end `Review verdict: PASS` although a P1 was active. They followed the prompt-pack template rule ("PASS if no P0 or P1 findings this iteration"), which conflicts with the agent persona rule (map over findings active at the iteration). Iterations 17-24 follow the persona rule. The iteration files are write-once. The session verdict here comes from review-verdict.cjs and does not read these lines.
- `step_graph_upsert` was skipped after iterations 1-16. It was backfilled in order at iteration 17, which cleared a 0% graph-coverage blocker. `deep_review.graph_convergence_evaluated` was not appended for iterations 1-16, and the events were not backfilled because the gateway would stamp them at backfill time. It was appended from iteration 17 on.
- `deep_review.claim_adjudication` was not appended after iterations 2 and 6. One passing event for the two P1 packets was appended after iteration 17.
- Convergence calls passed `--iteration` as the just-finished iteration rather than the upcoming one, so the blocked-stop and graph events are keyed to iteration N, not N+1. The terminal gates row uses iteration-25, as the YAML does.
- Iteration 1's strategy update damaged the strategy frontmatter through a section-matching helper. It was repaired at once. Later edits touch only the non-reducer sections.
- `step_stage_artifact_dir` was skipped as the YAML directs for a lineage. `phase_save` (generate-context.js) was skipped because the dispatch forbids it.
- The scope terminal gate fails only because OPUS-F001-P2-004 is anchored on a packet doc. The leaf contract allows packet docs as traceability context, and the terminal gate counts them as out of scope. This tension is recorded here, not raised as a finding.

**Sources reviewed.** fanout-run.cjs, fanout-salvage.cjs, fanout-pool.cjs, lineage-timestamp-window.ts, deep-review-state-contract.ts, deep-review-ledger-schema.ts, convergence.cjs, coverage-graph-db.ts, cli-guards.cjs, verify-iteration.cjs, workflow-steps.cjs, synthesis-closeout.cjs, deep-review.yaml, deep-research.yaml, the fanout and convergence feature catalogs, script-interface-contract.md, deep-review and deep-research references, the fanout manual testing playbook, fanout-pass-evidence, fanout-stop and fanout-lineage-config tests, the 007 packet docs and their children, and the installed claude CLI 2.1.329 (read-only).

**Cross-reference appendix**
- Core Protocols: spec_code fail; checklist_evidence notApplicable.
- Overlay Protocols: feature_catalog_code pass; playbook_capability partial; skill_agent and agent_cross_runtime not run.
