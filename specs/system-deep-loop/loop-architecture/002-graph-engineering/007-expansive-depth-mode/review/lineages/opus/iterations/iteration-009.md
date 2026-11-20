# Iteration 009 - Frontier node F-1-001: traceability

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-1-001 (depth 1), dimension traceability
- Sources read before work: lineage steer.md (absent), frontier block for F-1-001 traceability, convergence decision for iteration 8 (CONTINUE)

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-salvage.md:60-95, 111
- .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:84-90, 112-122, 230
- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/spec.md, tasks.md, implementation-summary.md (searched for the range's features)
- Code side from iterations 1, 4 and 5: fanout-salvage.cjs:35-45, 186-275, 342-348; fanout-run.cjs:868-895, 4924; lineage-timestamp-window.ts:101, 313

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The packet every range commit cites records none of the fan-out trust, stop or blocked-stop work** -- specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/implementation-summary.md:78 -- Each commit in the range names `Spec: system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode` (for example 87223d32b92, 0e49309a701, a29a15210e7, 55e8a7c217f). The packet's root `spec.md`, `tasks.md` and `implementation-summary.md` hold no requirement, task or summary line for pass evidence, the claimed-stamp window, the runner-written lineage block, `--stop`/SIGHUP/parent death, `--status`, or the script-recorded blocked stop. A case-insensitive search for SIGHUP, pass evidence, claimedTimestamp, unexamined, lineage block, `--stop`, `--status` and blocked stop returns nothing in them. The only "blocked_stop" mention is an older research-run note (implementation-summary.md:78). None of the 15 child phase folders covers this work either: the hits are in 004 and 011, which predate it. The behavior is documented only in the runtime feature catalog, so spec_code has nothing to check the code against, and no checklist row carries evidence for it.
   Finding class: cross-consumer
   Scope proof: commit trailers in 17a9ddbcb68..555487146e2 name this packet; grep over the packet root and its child folders finds no matching requirement
   Affected surface hints: 007-expansive-depth-mode spec.md, tasks.md, implementation-summary.md; a child phase for the fan-out trust and stop round
   Case: a reviewer asks which acceptance criterion `--stop` or `passEvidence` must meet and finds none in the cited packet, only catalog prose written alongside the code.

## Traceability Checks
- spec_code: partial. The cited packet holds no requirement for the range's fan-out work (finding 1), so code cannot be checked against spec.
- checklist_evidence: notApplicable. There is no checklist or acceptance-criteria row for this work at the packet root.
- feature_catalog_code: pass. fanout-salvage.md:60-95 matches passEvidence and readLineageCommits field for field. That covers the three reasons, null counts for untimed logs, and the stamp order claimedTimestamp, then timestamp, then occurred_at (fanout-salvage.cjs:342-348). fanout-run.md:115-122 matches writeLineageValues (fanout-run.cjs:884-895), including "whatever its exit code" and the missing-root no-op (:868-874).

## Integration Evidence
- The catalog already states the untimed-attempt rule, "one untimed attempt log ... leaves every pass's call counts unknown" (fanout-salvage.md:90-92). Its example is a plain-text log from an older run, so the early-failed stream-json attempt from OPUS-F006-P2-001 is a documented consequence rather than a contradiction. The finding stands as a design weakness, not a doc drift.

## Edge Cases
- The catalog says claude calls are timed from "ISO stamps" on assistant events (fanout-salvage.md:65). That is the same unverified assumption as OPUS-F001-P2-001, so the doc and the code share it.

## Confirmed-Clean Surfaces
- fanout-run.md:230 test table names fanout-lineage-config.vitest.ts for the non-zero-exit and missing-root cases, matching the test header.

## Ruled Out
- Catalog drift on pass evidence or the lineage block: both match the code.

## Next Focus
- Dimension: traceability
- Focus area: F-1-003 traceability (stop and status docs against code)
- Reason: frontier round-robin
- Rotation status: F-1-001 has correctness, security and traceability
- Required evidence: file:line

Review verdict: PASS
