---
title: "Implementation Summary: Legacy-compat event vocabulary full upcaster coverage"
description: "Evidence for the six live compatibility vocabularies, real-log replay, T001 confirmation, and the scoped per-file verification matrix."
trigger_phrases:
  - "legacy compat event vocabulary implementation"
  - "deep loop 023 implementation summary"
  - "zero blocked legacy replay"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/023-legacy-compat-event-vocabulary"
    last_updated_at: "2026-08-07T03:06:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented six vocabularies; scoped matrix green"
    next_safe_action: "Orchestrator reviews and lands the uncommitted candidate; no push or commit was made"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "legacy-state-census.md"
      - "fixture-provenance.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skd036-023-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "All six live vocabularies now map, pin, or delegate every observed live stem."
      - "Captured real state logs replay with zero blocked:unknown-legacy-record outcomes."
      - "The standalone 014 unblock table is absent; the complete handoff entry is recorded below without mutating the authority-cutover packet."
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

# Implementation Summary: Legacy-compat event vocabulary full upcaster coverage

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 023-legacy-compat-event-vocabulary |
| **Level** | 3 |
| **Status** | Complete |
| **Completed** | 2026-08-07 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

Implemented full compatibility coverage for the six scoped vocabularies: deep-research, deep-review, deep-alignment, deep-ai-council, skill-benchmark, and the deep-improvement-common bridge. Every captured real-log replay produced zero `blocked:unknown-legacy-record` outcomes. Unknown, genuinely unregistered stems still block loudly in negative tests.

The candidate is intentionally uncommitted. The clean ledger-schema rollback anchor is `5c98e4654e4bcaf2c7002412d6da2b92f1793942`; no rollback was required because the gates stayed green.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->

## How It Was Delivered

### T001 confirmation-first record

T001 was completed before the first implementation edit against HEAD `9229cb8f3e281c9291e6d631237528bc755e6f4b`. The cited locations were re-read at that HEAD and classified as follows.

| Finding | Status | Confirmed evidence | Severity calibration |
|---------|--------|--------------------|----------------------|
| `F-022-02` | `CONFIRMED` | Research compatibility registered only the original lifecycle subset; the cited real state log emits additional convergence, warning, and lock records. | Operator/stale-local robustness and cutover-readiness risk; not a remote-attacker breach risk. |
| `F-022-03` | `CONFIRMED` | Review compatibility omitted the captured graph, adjudication, pause, and synthesis stems. | Operator/stale-local robustness and cutover-readiness risk; not a remote-attacker breach risk. |
| `F-023-01` | `CONFIRMED` | Alignment treated every legacy `type:"iteration"` as `lane_completed`, including a non-terminal slice. | Operator/stale-local robustness and cutover-readiness risk; not a remote-attacker breach risk. |
| `F-023-02` | `CONFIRMED` | Alignment required `runId`/`sessionId`/`authorityEpochId`, while the live config emits only `sessionId` from that identity set. | Operator/stale-local robustness and cutover-readiness risk; not a remote-attacker breach risk. |
| `F-023-03` | `CONFIRMED` | Council checked the wrong event vocabulary for the nested heartbeat and omitted terminal topic/round records. | Operator/stale-local robustness and cutover-readiness risk; not a remote-attacker breach risk. |
| `F-024-01` | `CONFIRMED` | Skill-benchmark had one specific mapping and did not delegate shared lifecycle records to common as agent/model do. | Operator/stale-local robustness and cutover-readiness risk; not a remote-attacker breach risk. |

The `F-022-02` `manualStop` sub-claim is separately `REFUTED`: the required grep returned no `manualStop` match in the cited research compatibility file. The symbol belongs to the common improvement bridge and was not carried into the research fix.

### Census and real-fixture evidence

The legacy-state census ran before mapping edits and is recorded in `legacy-state-census.md`. It enumerates 74 research logs, 35 review logs, 1 alignment log, 6 council archive logs, no dedicated skill-benchmark JSONL log, and 2 common journals. The selected source artifacts and must-survive rationale are recorded there.

`fixture-provenance.md` records the producing command, relative source path, run/session identifier, line count, byte count, and SHA-256 for every selected capture or explicit substitution. The fixtures are real command-output artifacts, not identity-complete synthetic records.

| Mode | Real source used | Lines | Bytes | SHA-256 |
|------|------------------|------:|------:|---------|
| Research | `018-drift-census-and-plan-revalidation/research/lineages/sol/deep-research-state.jsonl` | 18 | 22,277 | `1f0a00a61b3ac895097da40880baee94a9564f2bfee24d1e9779c87403cbd547` |
| Review | `024-durable-write-boundaries/review/lineages/luna/deep-review-state.jsonl` | 64 | 107,328 | `1671c5415d988750f38927ab312cfff34474ed555468b04d84f0773a4da76d13` |
| Alignment | `016-whole-system-gate/alignment/deep-alignment-state.jsonl` | 49 | 43,197 | `82f2f0bcc56d13d847d6d0ffeb72c226eba8f937e0122e30d06f59acedd37cc2` |
| Council live | `z_archive/025-deep-loop-gpt-reliability/.../ai-council/session-state.jsonl` | 4 | 2,223 | `8d284ec67de22b620827f808856aa6f4647afffbe9583e9b908f1283367c679b` |
| Council archive | `z_archive/024-deep-loop-improved/.../ai-council/ai-council-state.jsonl` | 22 | 6,312 | `2641895b309f249fb3dc48a685c6d25effe1a1cbe42df859210abfeaac943255` |
| Common | `z_archive/013-agent-deep-review-optimization/improvement/improvement-journal.jsonl` | 19 | 5,464 | `aed2cb04f71b7f5a9fac6ee0107e56b9aa8a910551b6413c35bc580c33cef5ae` |
| Skill-benchmark substitution | Real loop-host output under `fixtures/skill-benchmark-live/` | 3,043 non-empty | 82,116 | `212f05d6fea022287500b8320613a819228eff748a6906b8604ff15a031bdd0d` |

The skill-benchmark mode has no dedicated historical JSONL state log in the repository. The substitution is the real `loop-host.cjs` command output captured in the packet fixture folder; its command, verdict, report, and source topology digest are recorded in `fixture-provenance.md` and the fixture README.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

### Map, pin, and delegation dispositions

These are the dispositions checked against the census and the live producer sources. A pin is deliberate: it preserves an operational, derived, mutation, or otherwise lossy legacy fact without claiming a typed domain event that the old record cannot prove.

### Deep-research

| Legacy stem | Disposition |
|--------------|-------------|
| `type=config` | `mapped:deep_research.run_initialized` |
| `type=iteration` | `mapped:deep_research.iteration_completed` when stable identity and iteration scope are present |
| `event=resumed` | `mapped:deep_research.run_resumed` |
| `event=restarted` | `mapped:deep_research.run_restarted` |
| `event=blocked_stop` | `mapped:deep_research.convergence_blocked` |
| `type=iteration_start` | `pinned:legacy-record-has-no-lossless-mode-event` |
| `event=detached_scope_bound`, `started`, `run_now_requested`, `run_now_rejected`, `run_now_accepted`, `run_now_restored` | `pinned:legacy-event-has-no-lossless-mode-event` |
| `event=config_warning`, `graph_convergence`, `synthesis_incomplete`, `synthesis_complete`, `lock_released` | `pinned:legacy-event-has-no-lossless-mode-event` |
| `event=idea_observed`, `idea_promoted`, `idea_rejected`, `ideaRejectedRemoved`, `ideaRejectedReset`, `stuckRecovery`, `userPaused` | `pinned:legacy-event-has-no-lossless-mode-event` |
| `type=progress` | `compatible:legacy-liveness-record-is-non-authoritative` |

The captured research replay covered `config`, `detached_scope_bound`, `iteration`, `iteration_start`, `lock_released`, and `synthesis_complete`; all rows completed without an unknown-record block.

### Deep-review

| Legacy stem | Disposition |
|--------------|-------------|
| `type=config` | `mapped:deep_review.run_initialized` |
| `type=iteration` | `mapped:deep_review.dimension_pass_completed` when stable dimension identity is present |
| `event=resumed` | `mapped:deep_review.run_resumed` |
| `event=restarted` | `mapped:deep_review.run_restarted` |
| `event=blocked_stop` | `mapped:deep_review.blocked_stop_recorded` |
| `event=init_complete`, `graph_seed_skipped`, `config_warning`, `graph_convergence`, `claim_adjudication` | `pinned:legacy-event-is-an-in-place-mutation` |
| `event=synthesis_incomplete`, `synthesis_complete`, `lock_released`, `userPaused`, `stuckRecovery`, `recovery_baseline` | `pinned:legacy-event-is-an-in-place-mutation` |
| `event=finding_updated`, `finding_removed`, `report_rewritten`, `severity_changed`, `verdict_changed` | `pinned:legacy-event-is-an-in-place-mutation` |
| `type=progress` | `compatible:legacy-liveness-record-is-non-authoritative` |

The captured review replay covered `claim_adjudication`, `config`, `graph_convergence`, `graph_seed_skipped`, `init_complete`, `iteration`, and `synthesis_complete`; all rows completed without an unknown-record block.

### Deep-alignment

| Legacy stem | Disposition |
|--------------|-------------|
| `type=config` | `mapped:deep_alignment.run_initialized` with live `sessionId` identity |
| `event=resumed` | `mapped:deep_alignment.run_resumed` |
| `event=restarted` | `mapped:deep_alignment.run_restarted` |
| `event=blocked_stop` | `mapped:deep_alignment.blocked_stop_recorded` |
| `type=iteration` | `pinned:legacy-iteration-is-a-nonterminal-slice` |
| `type=finding` | `pinned:legacy-finding-lacks-typed-adjudication` |
| `event=leaf_output_unpersisted`, `recovery_baseline`, `authority_rewritten`, `finding_removed`, `finding_updated`, `observation_replaced`, `verdict_changed` | `pinned:legacy-event-is-an-in-place-mutation` |
| `type=progress` | `compatible:legacy-liveness-record-is-non-authoritative` |
| `type=partial-observation` | `degraded:legacy-observation-lacks-proof-bindings` |

The captured alignment replay covered `config`, `finding`, and `iteration`. The explicit multi-slice test proves that two iteration slices remain pins and never become `deep_alignment.lane_completed`. The live-shaped config test proves `sessionId` alone migrates; `runId` and `authorityEpochId` are not required by this bridge.

### Deep-ai-council

| Legacy stem or shape | Disposition |
|----------------------|-------------|
| `event=round_start` | `mapped:ai_council.round_started` |
| `event=seat_returned` | `mapped:ai_council.seat_returned` |
| `event=deliberation_synthesized` | `mapped:ai_council.deliberation_synthesized` |
| `event=round_end`, `topic_completed`, `round_completed` | `mapped:ai_council.round_ended` |
| `event=council_complete` | `mapped:ai_council.council_complete` |
| `event=artifact_written` | `mapped:ai_council.artifact_committed` |
| `event=rollback` | `mapped:ai_council.rollback_recorded` |
| `event=artifact_superseded` | `mapped:ai_council.artifact_superseded` |
| `{type:"progress_record",event:"session_heartbeat"}` | `compatible:legacy-liveness-record-is-non-authoritative` |
| `event=session_initialized`, `topic_started`, `workflow_failed`, `lock_released`, `seat_started`, `seat_retry` | `pinned:shared-or-lossy-legacy-event` |
| `type=audit,event=artifact_verified` | `compatible:legacy-audit-evidence-remains-non-authoritative` |

The replay combines the captured live session log and archived council rounds. The exact nested heartbeat is tested directly, and both terminal spellings are registered.

### Skill-benchmark

| Legacy stem | Disposition |
|--------------|-------------|
| `eventType=benchmark_run_planned` | `mapped:skill_benchmark.run_planned` |
| `event=benchmark_completed`, `certificate_promoted`, `leaderboard_updated`, `ranking_published`, `result_promoted`, `score_aggregated` | `pinned:legacy-derived-verdict-has-no-lossless-schema-event` |
| Any common bridge stem recognized by `deep-improvement-common` | `delegated:deep_improvement_common.*` |
| `type=progress` | `compatible:legacy-liveness-record-is-non-authoritative` |

The real common lifecycle journal is replayed through the skill-benchmark upcaster. The test asserts that the first common row is handled by the common decision/upcaster path, rather than by a skill-specific duplicate.

### Deep-improvement-common

| Legacy stem | Disposition |
|--------------|-------------|
| `eventType=session_start`, `session_initialized` | `mapped:deep_improvement_common.run_started` |
| `eventType=candidate_generated` | `mapped:deep_improvement_common.candidate_generated` |
| `eventType=candidate_scored` | `mapped:deep_improvement_common.evaluation_normalized` |
| `eventType=session_ended`, `session_end` | `mapped:deep_improvement_common.run_completed` |
| `eventType=benchmark_completed`, `blocked_stop`, `gate_evaluation`, `integration_scanned`, `legal_stop_evaluated` | `pinned:legacy-event-has-no-lossless-common-event` |
| `eventType=mutation_outcome`, `mutation_proposed`, `promotion_attempt`, `promotion_attempted`, `promotion_result` | `pinned:legacy-event-has-no-lossless-common-event` |
| `eventType=rollback`, `rollback_result`, `score_execution_recorded`, `trade_off_detected` | `pinned:legacy-event-has-no-lossless-common-event` |
| `type=progress` | `compatible:legacy-liveness-record-is-non-authoritative` |

The common upcaster already covered the selected real journal; this child proves the bridge directly and through skill-benchmark delegation.

### Implementation changes

- Research and review now pin all observed operational/convergence/synthesis/lock/mutation stems not represented by typed mode events.
- Alignment checks only `sessionId`, pins iteration slices and findings before target selection, and keeps the existing terminal target unreachable for those slices.
- Council now recognizes `record.event ?? record.type`, handles the exact heartbeat shape before the generic pin set, and maps both terminal record names.
- Skill-benchmark delegates common-compatible records to the common upcaster with the variant scope preserved.
- The six ledger-schema unit suites use real source logs through `tests/helpers/legacy-real-log.ts`; synthetic identity-complete replay fixtures were not used.

No authority, shadow-parity, alignment reducer/lane-identity, or durable-write behavior was changed.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

### Red-before / green-after evidence

The red probes replayed the captured real logs before the corresponding upcaster edits. Each failed on `blocked:unknown-legacy-record`; the failures identified the missing live stems rather than a synthetic fixture defect.

| Finding | Red-before replay test | Red symptom | Green-after evidence |
|---------|------------------------|-------------|----------------------|
| `F-022-02` | `replays the captured research state log without unknown legacy blocks` | Detached scope, iteration-start, synthesis, and lock rows blocked. | Research ledger suite `bba512f60977dabf2544bf98c605cd3442984511`, candidate upcaster `349a9c942d327d3d5f20df6a87261eec09a35824`. |
| `F-022-03` | `replays the captured review state log without unknown legacy blocks` | Init, graph seed, convergence, adjudication, and synthesis rows blocked. | Review ledger suite `e6049581f4848b25006fe4c10264c4dd792b6162`, candidate upcaster `dc879f8bf9682f1540b63f3011922846ee5da1ce`. |
| `F-023-01` | `replays the captured alignment state log without unknown legacy blocks` plus the multi-slice test | Finding rows blocked; iteration slices were eligible for the wrong terminal target. | Alignment ledger suite `82f3a30e7e14e175c9cceb337717fd8b5b0af8e3`, candidate upcaster `feec3216980b6665fe4a86156e362a69704ee6a7`. |
| `F-023-02` | `upcasts a sessionId-only legacy config and drives the real append path` | Session-only config was rejected for missing identity fields. | Same alignment suite/digests above. |
| `F-023-03` | `replays captured council state logs without unknown legacy blocks` and `accepts the live heartbeat and registers both terminal record types` | Live heartbeat and failure-cleanup rows blocked; terminal names were unregistered. | Council ledger suite `724066a76a0c007beab3ff50d761aa17e378fd2d`, candidate upcaster `1c2b258a6b8b16d2da362ce4f816515c09ebd8e3`. |
| `F-024-01` | `replays the captured common lifecycle log through the skill vocabulary` | Shared common lifecycle rows blocked through skill-benchmark. | Skill ledger suite `08242984f6795d21aae8ea74f336424f4ad63186`, candidate upcaster `c7cf1f5caae7690c60c8e9aedf50fbb861837dde`. |

The current suite hashes are content digests from `git hash-object`; no commit SHA was created because the orchestrator owns landing. The pre-fix reference is HEAD `9229cb8f3e281c9291e6d631237528bc755e6f4b`.

The independent negative guard is `blocks an unregistered legacy stem instead of dropping it`: it asserts `blocked`, `unknown-legacy-record`, a null target, and the invented stem remains visible in the decision input. Council heartbeat and alignment multi-slice tests are the two structural adversarial cases.

### Per-file verification matrix

All tests were run one file at a time with one worker. The prohibited whole-process `vitest run` was not used because the shared-graph SQLite append lock hangs that process; the matrix below is the required per-mode gate and includes every affected mode suite plus the owned substrate.

| Mode | Ledger schema | Certificates | Rollback gate | Resume | Shadow parity |
|------|---------------|--------------|---------------|--------|---------------|
| deep-research | 20/20 P | 36/36 P | 77/77 P | 21/21 P | 49/49 P |
| deep-review | 16/16 P | 64/64 P | 81/81 P | 12/12 P | 8/8 P |
| deep-alignment | 25/25 P | 90/90 P | 86/86 P | 13/13 P | 8/8 P |
| deep-ai-council | 16/16 P | 14/14 P | 31/31 P | 10/10 P | 39/39 P |
| skill-benchmark | 17/17 P | 20/20 P | 224/224 P | 22/22 P | 17/17 P |
| deep-improvement-common | 16/16 P | 18/18 P | 36/36 P | 23/23 P | 27/27 P |

Owned substrate suites also passed: `authorized-ledger` 29/29, `event-envelope` 57/57, `locks-and-fencing` 28/28, `receipts-and-effect-recovery` 58/58, `replay-fingerprint` 39/39, and `shadow-parity-harness` 31/31. The only permitted pre-existing whole-runtime failure names are render-command-contract, check-contract-drift, legacy-projections, and review-depth-convergence; none appeared in the scoped matrix.

TypeScript verification passed:

```text
../../system-spec-kit/node_modules/.bin/tsc --noEmit -p tsconfig.json
rc 0
```

The requested `git checkout -- database/` pre-test hygiene command was attempted. Git could not acquire the linked-worktree index lock (`Operation not permitted`); the database subtree was clean before and after, and no database file was changed.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

### Adversarial and rollback verification

A separate post-build verification pass re-read the six upcasters, fixture provenance, census, and the two structural tests, then reran the affected ledger-schema suites. It found no new defect. This session has no second human or independently dispatched model actor, so the pass is process-separated but not an independently staffed REQ-U04 review; that limitation is recorded rather than fabricated away.

The rollback command is:

```text
git checkout 5c98e4654e4bcaf2c7002412d6da2b92f1793942 -- \
  .opencode/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts \
  .opencode/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/legacy-compatibility.ts \
  .opencode/skills/system-deep-loop/runtime/lib/deep-alignment-ledger-schema/legacy-compatibility.ts \
  .opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema/legacy-compatibility.ts \
  .opencode/skills/system-deep-loop/runtime/lib/skill-benchmark-ledger-schema/legacy-compatibility.ts \
  .opencode/skills/system-deep-loop/runtime/lib/deep-improvement-common-ledger-schema/legacy-compatibility.ts
```

It was not rehearsed because it would overwrite the candidate and the gates were green; the affected ledger-schema suite is the post-restore check.

### 014 cutover handoff

No standalone “014 unblock table” exists in the checked-out 014 packet. The authoritative handoff entry for the orchestrator is therefore recorded here:

| Blocker | Status | Evidence |
|---------|--------|----------|
| Blocker 2 — compatibility bridge blocks ordinary live events | **DISCHARGED for this candidate** | Six real captures replay with zero `blocked:unknown-legacy-record`; per-mode ledger-schema digests and candidate upcaster hashes are in the red/green table above. |

This child does not flip authority. The orchestrator must project this entry into the 014 cutover evidence when it lands the candidate.

### Scope and landing state

Changed only the six compatibility modules, their six ledger-schema suites, the shared real-log test helper, and this packet’s census/provenance/decision/evidence documents. No commit or push was made. The worktree remains dirty with unrelated pre-existing remediation changes; the candidate hashes above isolate the files owned by this child.

Status: implementation complete; final strict validation is the post-regeneration read-only check. No commit or push was made.
<!-- /ANCHOR:limitations -->
