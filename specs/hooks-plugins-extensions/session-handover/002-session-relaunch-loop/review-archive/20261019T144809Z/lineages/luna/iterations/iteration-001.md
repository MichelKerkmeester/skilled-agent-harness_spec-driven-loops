# Iteration 1 - Correctness

**Focus:** correctness  
**Target:** `specs/hooks/023-session-relaunch-loop`  
**Session:** `fanout-luna-1792349322065-8lohfl`  
**Timestamp:** 2026-10-18T18:59:58Z

## Focus

correctness

## Review scope

This pass followed the append-log path in `relaunch-core.cjs`, its callers across runtime adapters, and the source of the append concurrency and partial-tail tests. The 152-path packet scope is complex; this pass targeted the shared log writer, append concurrency, tail recovery, and state-directory permissions. The broad review is running one dimension per iteration. Correctness, security, and traceability fit the three-iteration cap; maintainability remains uncovered.

## Findings

Findings by severity.

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **[LUNA-001] `appendLog` accepts a short write as complete.** At `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:580`, the helper calls `fs.writeSync` once and ignores its returned byte count, then fsyncs and returns the full event at lines 581–585. If the call reports that it wrote fewer bytes than requested, the helper still reports success and the event suffix is absent. A later append can separate the partial tail from the next event, but cannot restore the lost bytes. This is a low-frequency log-integrity risk; the inspected callers use the shared helper for adapter, wrapper, and killer events. The current test source covers multi-process append uniqueness and an existing partial tail, but no source test forces a short `writeSync` result (`relaunch-core.test.cjs:749–810`). **Evidence is static:** a stubbed short-write result would confirm the failure path. Consider looping until the buffer is fully written or throwing on a non-positive/short result, with a focused test.

## Search depth

- **Scope class:** complex; strict evidence tracking for this pass.
- **Target selection:** shared producer `relaunch-core.cjs`, the runtime append call sites, and append-focused tests. The killer lock/transcript lifecycle is reserved for the security pass; packet requirement and evidence links are reserved for traceability.
- **Search mode:** graphless fallback. The YAML's graph-seed step was skipped because it writes packet-level state outside the authorized lineage directory. Semantic graph search was unavailable.
- **Append short-write handling:** found one P2 candidate at `relaunch-core.cjs:580`.
- **Append concurrency:** source inspection showed append-mode open and one append write; test source covers eight processes × 25 appends and checks 200 unique lines (`relaunch-core.test.cjs:749–779`). No defect found in the normal full-write case.
- **Partial-tail recovery:** source checks the last byte and prefixes a newline when the prior tail is unterminated (`relaunch-core.cjs:571–579`); the existing test source covers preserving line boundaries after a partial tail (`relaunch-core.test.cjs:781–810`).
- **State-directory permissions:** the helper creates and re-pins the directory to mode `0700` (`relaunch-core.cjs:42–46`); the test source asserts that mode (`killer.test.cjs:1392–1415`).

## Workflow constraints recorded

The workflow's generic review-root migration and coverage-graph seeding target shared packet state, outside the dispatcher's lineage-only write authorization, so both were skipped. The review YAML also lists four dimensions while the hard cap is three passes; maintainability is explicitly left uncovered rather than folded into a different pass.

## Next focus

Review security boundaries in stale-lock takeover, transcript handling, and runtime-specific state/log paths.

## Assessment

Dimensions addressed: correctness

Review verdict: PASS
