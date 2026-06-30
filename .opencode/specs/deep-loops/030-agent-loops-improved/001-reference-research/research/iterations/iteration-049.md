# Iteration 49: S6-10 Unified Observability Schema

## Focus

Dimension D4 synthesis. Investigated the single telemetry/event schema that would let `fanout-pool.cjs`'s ledger, a single-loop heartbeat, `convergence.cjs` trace output, and council `round-state-jsonl.cjs` feed one dashboard stream.

## Actions Taken

- Checked prior S4-04 and S5-12 outputs to avoid re-answering producer-level heartbeat and convergence-trace work.
- Read reference repo event/dashboard shapes: kasper's generic JSONL logger and loop-cli-main's status/run-history row model plus board consumers.
- Read OUR current producer shapes: fan-out status ledger, fan-out progress heartbeat, convergence output, and council round-state JSONL.
- Mapped a ranked backlog that preserves existing payloads under one envelope rather than flattening every domain into one oversized record.

## Findings

1. **Rank 1 - Add a canonical deep-loop observability envelope helper.**
   - Reference mechanism: kasper's logger defines a generic JSONL record with `ts`, `event`, and arbitrary data fields, then appends one JSON object per line [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/logging.ts:4`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/logging.ts:27`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/logging.ts:33`]. OUR council writer already supplies the stricter envelope pieces: `schema_version`, `event_id`, and `written_at_iso` before spreading the caller record [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:229`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:230`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs:232`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs`.
   - Backlog item: create `normalizeObservabilityEvent()` and `appendObservabilityEvent()` with this envelope: `schema_version`, `event_id`, `written_at_iso`, `protocol: "deep-loop"`, `producer`, `stream`, `loop_type`, `spec_folder`, `session_id`, optional `run_id`/`iteration`/`round_id`, `subject`, `event`, `level`, `status`, and `payload`.
   - Why it helps: producers keep their native payloads, while dashboards can index one stable envelope. Port difficulty: med. Tag: quick-win.

2. **Rank 2 - Wrap fan-out lifecycle and progress events at the append boundary.**
   - Reference mechanism: loop-cli-main models dashboardable loop state as status plus run-history rows (`LoopStatus`, `RunRecord`, `LoopMeta.runHistory`, `remainingDelayMs`, `skippedCount`) [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:46`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:50`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:85`]. OUR fan-out producer already emits `started`, `completed`, `failed`, `progress`, and `stopped` rows, but as raw ledger entries [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:245`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs:253`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:305`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs:563`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`.
   - Backlog item: change fan-out's `appendStatusLedger()` call sites to append canonical events with `subject.kind: "lineage"`, `subject.label`, `subject.index`, `event: "lineage.started|lineage.progress|lineage.completed|lineage.failed|lineage.stopped"`, and the existing fan-out row under `payload`.
   - Why it helps: fan-out becomes the first producer for the shared stream without breaking its current summary and retry math. Port difficulty: easy. Tag: quick-win.

3. **Rank 3 - Make the single-loop heartbeat use the same envelope, not a parallel YAML-only ledger shape.**
   - Reference mechanism: loop-cli-main's board renders every loop row from the same status/timing/run-count/skipped-count fields [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/board/components/Navigator.tsx:160`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/board/components/Navigator.tsx:161`]. S4-04 already identified the single-loop dispatch boundary, so this iteration narrows the schema decision.
   - Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`.
   - Backlog item: have `step_dispatch_iteration` emit `loop.dispatch.started`, cadence `loop.dispatch.progress`, and terminal `loop.dispatch.completed|failed` through the runtime helper, with `subject.kind: "loop"`, `subject.id: sessionId`, `iteration`, and fan-out-compatible gauges in `payload`.
   - Why it helps: a lone native executor and a CLI fan-out lineage become dashboard rows in the same stream. Port difficulty: med. Tag: quick-win.

4. **Rank 4 - Stream convergence evaluations as first-class observability events.**
   - Reference mechanism: kasper's event logger keeps the event discriminator separate from arbitrary data [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/logging.ts:27`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/logging.ts:28`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/kasper/src/logging.ts:31`]. OUR convergence script already assembles `decision`, `reason`, `score`, `signals`, `blockers`, `trace`, and `momentum` into a single output object [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:493`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:497`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:500`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs`.
   - Backlog item: add an opt-in `--event-log <path>` or workflow-provided sink so each convergence run appends `event: "convergence.evaluated"` with `subject.kind: "convergence"` and the existing `data` object under `payload`.
   - Why it helps: S5-12's trace/momentum/blocker visibility becomes live dashboard input instead of another script output to scrape. Port difficulty: med. Tag: quick-win.

5. **Rank 5 - Bridge council round-state records into the same event stream without replacing round-state JSONL.**
   - Reference mechanism: loop-cli-main keeps run history separate from current loop status but renders both in one board [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/board/components/RunHistory.tsx:72`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/board/components/RunHistory.tsx:86`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/board/components/RunHistory.tsx:101`]. OUR council round completion already has a compact payload with `topic_id`, `round_id`, seats, dispatch summary, verdict, delta, stability, and stop reason [TARGET-CONTEXT: `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:200`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:280`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-workflows/deep-ai-council/scripts/orchestrate-topic.cjs:290`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/council/round-state-jsonl.cjs`.
   - Backlog item: let `appendRoundStateRecord()` optionally mirror normalized records to the shared stream as `event: "council.round.completed|council.session.completed|council.rollback"` with `subject.kind: "council_round"` and the original round record as `payload`.
   - Why it helps: council keeps packet-local round state as source of truth, while the dashboard no longer needs a council-specific file reader. Port difficulty: med. Tag: quick-win.

6. **Rank 6 - Add one shared timeline/dashboard reader beside the graph status CLI.**
   - Reference mechanism: loop-cli-main's navigator consumes one loop collection and renders status, timing, exit, run count, and skipped count as a single operator view [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/board/components/Navigator.tsx:160`] [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/board/components/Navigator.tsx:161`]. OUR `status.cjs` is already the shared runtime status entrypoint for research, review, council, and context [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/status.cjs:89`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/status.cjs:94`] [TARGET-CONTEXT: `.opencode/skills/deep-loop-runtime/scripts/status.cjs:140`].
   - Exact OUR target file: `.opencode/skills/deep-loop-runtime/scripts/status.cjs`.
   - Backlog item: extend `status.cjs` or add a sibling `observability.cjs` that reads the canonical event stream and returns a timeline plus rollups: active subjects, latest status per subject, lag/duration gauges, last convergence decision, current blockers, and council round outcomes.
   - Why it helps: one dashboard can answer "what is the loop doing now?" across fan-out, single-loop, convergence, and council without parsing mode-specific logs. Port difficulty: hard. Tag: deep-rewrite if replacing dashboards; med/quick-win if added as a runtime timeline beside existing dashboards.

## Questions Answered

- S6-10 answer: use a small canonical envelope plus domain payloads. The envelope should standardize identity, time, producer, subject, event, status, and routing fields; the payload should preserve fan-out gauges, convergence signals, and council verdict details without premature flattening.
- The best schema source is a combination: kasper's `event + data` flexibility, council's `schema_version/event_id/written_at_iso` discipline, and loop-cli-main's boardable status/run-history model.
- The unified stream should be additive. Existing ledgers and round-state files remain valid source artifacts while producers begin mirroring or writing canonical observability rows.

## Questions Remaining

- Decide whether the stream path is packet-local (`{artifact_dir}/observability.jsonl`) or spec-level (`{spec_folder}/deep-loop-observability.jsonl`) with per-session filters.
- Decide whether fan-out writes both legacy `orchestration-status.log` rows and canonical rows during a compatibility window, or writes canonical rows and derives the legacy summary from them.
- Decide whether confirm-mode YAMLs get observability parity in the same backlog item or a follow-up patch.

## Next Focus

S6-11: Rank the lowest-risk implementation sequence for the unified observability backlog: helper first, fan-out adapter first, or dashboard reader first.
