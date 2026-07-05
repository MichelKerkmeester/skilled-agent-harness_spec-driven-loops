# Iteration 6: S1-06 Byte-Offset Log Regions

## Focus

Dimension: D1 source-mining.

Focus area: [S1-06] How does `loop-cli-main` slice one append-only log into per-run regions via byte offsets (`log-parser.ts`, `runHistory[].logOffset`)? Target mapping: deep-loop-workflows iteration logging.

## Actions Taken

- Read the deep-research skill quick reference and output references for iteration file and JSONL expectations.
- Checked prior state and iteration 5 to keep this pass scoped to S1-06 rather than repeating cadence, run-now, or lifecycle findings.
- Source-mined `loop-cli-main/src/types.ts`, `src/core/loop-controller.ts`, `src/core/log-parser.ts`, and `src/daemon/server.ts`.
- Mapped the mechanism onto OUR deep-research state paths, reducer, and post-dispatch output validator.

## Findings

### Finding S1-06A: Log Boundaries Are Persisted As Sidecar State, Not Rediscovered From Text

Reference mechanism: `loop-cli-main` makes `logOffset` a required `RunRecord` field and carries `runHistory` in `LoopMeta` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:50`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/types.ts:85`]. The controller restores missing legacy offsets to `0`, exposes `runHistory` via `getMeta()`, captures the current append-only log size before command execution, stores that size as `logOffset`, and later derives `logSize` from the current file size minus the captured offset [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:81`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:203`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:345`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:375`].

Exact OUR target file: `.opencode/commands/deep/assets/deep_research_auto.yaml`. This helps because the workflow already defines canonical append-only state, per-iteration narrative, and per-iteration delta paths [TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:99`; TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:107`; TARGET: `.opencode/commands/deep/assets/deep_research_auto.yaml:114`], but it does not yet model an executor transcript byte range for each iteration. A backlog item is to add optional `logOffset`, `logSize`, and `logPath` metadata to iteration records or companion events so later tooling can jump to the exact raw transcript region.

Port difficulty: med.

Tag: quick-win.

### Finding S1-06B: Historical Reads Use Adjacent Offsets As The End Boundary

Reference mechanism: when `loop-cli-main` handles a historical run-log request, it filters `runHistory` to the requested `runNumber`, sorts records by `logOffset`, reads the whole append-only log buffer, sorts all records by `logOffset`, then slices each selected record from its start offset to the next record's offset, or EOF for the last record [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:282`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:291`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:294`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:297`]. This avoids trusting textual headers as hard boundaries.

Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`. This helps because the reducer currently parses full JSONL records, full iteration markdown files, and full delta files [TARGET: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:984`; TARGET: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:990`; TARGET: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:1036`]. A portable backlog item is an offset resolver helper that can reconstruct `iteration -> transcript slice` by sorting iteration log offsets, without rewriting existing markdown or JSONL history.

Port difficulty: med.

Tag: quick-win.

### Finding S1-06C: `log-parser.ts` Is A Content Parser, Not The Durable Boundary Source

Reference mechanism: `splitLogByRuns()` scans text for `[Run #N...]` headers and `[exit ...]` markers, starts a new parsed run on a header, and stops the current run on an exit marker [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/log-parser.ts:6`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/log-parser.ts:14`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/log-parser.ts:24`]. The byte-offset path is stronger: it can isolate a run even if command output contains run-looking text or if a header is missing from a partial write.

Exact OUR target file: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts`. This helps because `validateIterationOutputs()` already repairs the JSONL tail, verifies the state log was appended, checks the iteration file exists and is non-empty, and enforces canonical iteration type and required fields [TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:575`; TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:577`; TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:609`; TARGET: `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts:617`]. The backlog item is to add an optional offset-integrity advisory: if an iteration record reports a transcript range, validate that the range is readable and contains the canonical focus or iteration marker.

Port difficulty: easy.

Tag: quick-win.

### Finding S1-06D: One Logical Run Can Assemble Multiple Offset Records

Reference mechanism: follow-up chain tasks reuse the same `runNumber` but push additional `RunRecord` entries with their own `chainGroupId`, `chainName`, and `logOffset` [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:409`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:411`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/core/loop-controller.ts:418`]. The historical reader then joins all selected slices for the same run number after sorting by offset [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:282`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:301`]. The live stream path differs: it starts at the first selected offset, emits existing content from that point, and tails subsequent file growth until all selected records are completed [SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:328`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:331`; SOURCE: `.opencode/specs/deep-loops/030-agent-loops-improved/external/loop-cli-main/src/daemon/server.ts:343`].

Exact OUR target file: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs`. This helps because deep-research already treats state rows and delta rows as separate reducer inputs [TARGET: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:985`; TARGET: `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs:1036`]. A deeper backlog item is to let one iteration own multiple ordered transcript segments such as dispatch output, validation output, reducer output, and recovery output, then render them as one logical iteration view.

Port difficulty: hard.

Tag: deep-rewrite.

## Questions Answered

- Answered S1-06. `loop-cli-main` records byte offsets in `runHistory` before each command or chained command writes to the append-only log, then slices historical log views from each record's `logOffset` to the next sorted offset or EOF.
- Confirmed `log-parser.ts` exists, but the durable per-run slicing mechanism is the `runHistory[].logOffset` sidecar plus daemon server slicing, not parser-only header reconstruction.

## Questions Remaining

- S1-07 remains open: conditional follow-up task chaining and infinite-chain prevention.
- S1-08 through S1-12 remain open for later Segment S1 iterations.

## Next Focus

[S1-07] Mine how `loop-cli-main` chains conditional follow-up tasks (`onSuccessTaskId` / `onFailureTaskId`, `chainGroupId`) and stops infinite chains, then map it to `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`.
