---
title: Deep Review Strategy (opus lineage)
description: Session tracking for the opus fan-out lineage reviewing 17a9ddbcb68..555487146e2 across system-deep-loop and the deep commands.
trigger_phrases:
  - "deep review strategy"
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC
Review: 17a9ddbcb68..555487146e2 -- .skilled/skills/system-deep-loop .skilled/commands/deep (88 touched files, reviewTargetType=files). This lineage owns frontier nodes F-1-001 (fan-out trust), F-1-003 (stop and kill), F-1-005 (blocked stop and dry run).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Code outside the commit range pathspec. Spec-packet evidence under specs/ is context only.
- Nodes owned by the deepseek lineage (F-1-002, F-1-004, F-1-006).

---

## 5. STOP CONDITIONS
- Legal convergence per convergence.cjs, or maxIterations=24.
- All three frontier nodes answered across the four dimensions.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 10
- Resolved: 1

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the review ledger frame and the projection side by side settled the claimedTimestamp question in one pass (iteration 1)
- Tracing a ledger row from writer to every reader (collectOpenLineages, readRetryCountsFromLedger) exposed the signal-stop gap (iteration 2)
- Checking each writer flag against every write site in the script (snapshot, observability, gateway) settled the dry-run question (iteration 3)
- Following the admitted child node into the joiner of attempt logs found a separate failure mode from the parent node (iteration 4)
- Asking what each guard does when its input field is absent found the stamp-omission gap (iteration 5)
- Comparing how the code verifies one pid (the runner) against how it verifies its sibling (the lineage) exposed the reuse gap (iteration 6)
- Reading the stream-json switch against older limits in the same dispatcher found the stdout cap regression (iteration 8)
- Checking the commit trailers against the cited packet showed the spec side of spec_code is empty for this round (iteration 9)
- Comparing the documented row against the projection code line by line found the gateDetail versus gateResults split (iteration 11)
- Listing every producer and consumer of one event name exposed the overloaded stopped row and its --status symptom (iteration 14)
- Recovery replay of spec_code with a complete search closed the protocol honestly as fail (iteration 17)
- Using this lineage own ledger as a live fixture confirmed two blocked-stop findings without new code reads (iteration 18)
- Reading the installed CLI bundle settled an inference-only finding that no repo log could (iteration 20)
- Measuring this lineage own transcript replaced an inferred size claim with a number (iteration 22)

---

## 9. WHAT FAILED
- Looking for a real claude stream-json log: none on disk, every claude log predates the switch (iteration 1)
- Skipping step_graph_upsert for iterations 1-16 left the graph at 0% coverage and blocked the stop until backfilled (iteration 17)

---

## 11A. RULED OUT DIRECTIONS
- Review frame skew always zero: the frame keeps the model's record stamp (iteration 1, evidence: deep-review-state-contract.ts:290)
- Pool failed row closing lineages after a signal: process.exit runs inside the handler (iteration 2, evidence: fanout-run.cjs:509)
- Dry run persisting the research snapshot: readOnly overrides persistSnapshot (iteration 3, evidence: convergence.cjs:2361)
- Redaction corrupting rotated JSON logs (iteration 4, evidence: fanout-run.cjs:1097)
- Symlink write-through on the lineage config rewrite (iteration 5, evidence: fanout-run.cjs:1908)
- --status writing to the run directory (iteration 6, evidence: fanout-run.cjs:3957)
- Shell injection and dry-run graph side files on the blocked-stop path (iteration 7, evidence: coverage-graph-db.ts:404)
- Crafted log line crashing the pass judge (iteration 8, evidence: fanout-salvage.cjs readTimedToolEvents)
- Catalog drift on pass evidence or the lineage block (iteration 9, evidence: fanout-salvage.md:84)
- Catalog drift on --status or --stop (iteration 10, evidence: fanout-run.md Status and Stop)
- Dry-run wording drift across references (iteration 11)
- Doc or test drift on the untimed-attempt rule (iteration 12, evidence: fanout-pass-evidence.vitest.ts:162)
- File split of fanout-run.cjs as a finding (iteration 13)
- Gate-order drift between evaluation and recording (iteration 15, evidence: convergence.cjs:62)
- Shared logs-dir walker extraction (iteration 16)
- Claude stream-json events lacking a timestamp (iteration 20, evidence: installed claude 2.1.329 event builder)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### --status writing to the run directory: it returns before any write. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: --status writing to the run directory: it returns before any write.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: --status writing to the run directory: it returns before any write.

### A child acceptance row governing the range's fan-out stop or trust work: none exists. -- BLOCKED (iteration 23, 1 attempts)
- What was tried: A child acceptance row governing the range's fan-out stop or trust work: none exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A child acceptance row governing the range's fan-out stop or trust work: none exists.

### A crafted log line crashing the pass judge: each parse is guarded. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: A crafted log line crashing the pass judge: each parse is guarded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A crafted log line crashing the pass judge: each parse is guarded.

### A dry run persisting the research snapshot through `--persist-snapshot`: overridden by readOnly at convergence.cjs:2361. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A dry run persisting the research snapshot through `--persist-snapshot`: overridden by readOnly at convergence.cjs:2361.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A dry run persisting the research snapshot through `--persist-snapshot`: overridden by readOnly at convergence.cjs:2361.

### A file split of fanout-run.cjs as a finding: no concrete failure tied to size in the range. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: A file split of fanout-run.cjs as a finding: no concrete failure tied to size in the range.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A file split of fanout-run.cjs as a finding: no concrete failure tied to size in the range.

### A pool `failed` row closing the lineages after a signal: process.exit runs inside the handler, before any child close event is processed. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A pool `failed` row closing the lineages after a signal: process.exit runs inside the handler, before any child close event is processed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A pool `failed` row closing the lineages after a signal: process.exit runs inside the handler, before any child close event is processed.

### Catalog drift on `--status` or `--stop` behavior: matches code. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Catalog drift on `--status` or `--stop` behavior: matches code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Catalog drift on `--status` or `--stop` behavior: matches code.

### Catalog drift on pass evidence or the lineage block: both match the code. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Catalog drift on pass evidence or the lineage block: both match the code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Catalog drift on pass evidence or the lineage block: both match the code.

### Claude stream-json events lacking a top-level timestamp: the installed CLI emits it. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: Claude stream-json events lacking a top-level timestamp: the installed CLI emits it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claude stream-json events lacking a top-level timestamp: the installed CLI emits it.

### Doc or test drift on the untimed-attempt rule: all three agree. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Doc or test drift on the untimed-attempt rule: all three agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Doc or test drift on the untimed-attempt rule: all three agree.

### Downgrading OPUS-F001-P2-003: no gate rejects a stamp-less record. -- BLOCKED (iteration 21, 1 attempts)
- What was tried: Downgrading OPUS-F001-P2-003: no gate rejects a stamp-less record.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Downgrading OPUS-F001-P2-003: no gate rejects a stamp-less record.

### Dry-run graph side files: in-memory open. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Dry-run graph side files: in-memory open.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dry-run graph side files: in-memory open.

### Dry-run wording drift between references: consistent. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Dry-run wording drift between references: consistent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dry-run wording drift between references: consistent.

### Duplicate kill helpers as a finding: short and behaviorally equal. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Duplicate kill helpers as a finding: short and behaviorally equal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Duplicate kill helpers as a finding: short and behaviorally equal.

### Escalating OPUS-F003-P1-002 to P0: the harm needs pid reuse by a group leader plus an operator `--stop`, so it is not an unconditional immediate harm. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: Escalating OPUS-F003-P1-002 to P0: the harm needs pid reuse by a group leader plus an operator `--stop`, so it is not an unconditional immediate harm.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Escalating OPUS-F003-P1-002 to P0: the harm needs pid reuse by a group leader plus an operator `--stop`, so it is not an unconditional immediate harm.

### Escalating OPUS-F005-P2-001 to P1: the live case does not involve the claim-adjudication gate. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Escalating OPUS-F005-P2-001 to P1: the live case does not involve the claim-adjudication gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Escalating OPUS-F005-P2-001 to P1: the live case does not involve the claim-adjudication gate.

### Escalating OPUS-F006-P2-002: about 5x measured headroom on a representative run. -- BLOCKED (iteration 22, 1 attempts)
- What was tried: Escalating OPUS-F006-P2-002: about 5x measured headroom on a representative run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Escalating OPUS-F006-P2-002: about 5x measured headroom on a representative run.

### Extracting a shared logs-dir walker: two instances, no third. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Extracting a shared logs-dir walker: two instances, no third.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Extracting a shared logs-dir walker: two instances, no third.

### Gate-order drift between evaluation and recording: one constant. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Gate-order drift between evaluation and recording: one constant.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Gate-order drift between evaluation and recording: one constant.

### Generation mismatch from the runner rewrite: no consumer in fanout-merge.cjs reads config generation (grep returned no hits), so it is not raised. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Generation mismatch from the runner rewrite: no consumer in fanout-merge.cjs reads config generation (grep returned no hits), so it is not raised.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Generation mismatch from the runner rewrite: no consumer in fanout-merge.cjs reads config generation (grep returned no hits), so it is not raised.

### Recording spec_code as pass on feature-catalog evidence: that would claim a packet requirement that does not exist. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Recording spec_code as pass on feature-catalog evidence: that would claim a packet requirement that does not exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recording spec_code as pass on feature-catalog evidence: that would claim a packet requirement that does not exist.

### Redaction corrupting JSON lines so tool calls go missing: replacements stay inside string values. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Redaction corrupting JSON lines so tool calls go missing: replacements stay inside string values.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Redaction corrupting JSON lines so tool calls go missing: replacements stay inside string values.

### Shell injection through the blocked-stop gateway spawn: argv array, no shell. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Shell injection through the blocked-stop gateway spawn: argv array, no shell.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Shell injection through the blocked-stop gateway spawn: argv array, no shell.

### Skew always being zero for review frames: ruled out, because the frame keeps the model's record stamp (deep-review-state-contract.ts:290-295 projects; the frame itself holds `record.timestamp`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Skew always being zero for review frames: ruled out, because the frame keeps the model's record stamp (deep-review-state-contract.ts:290-295 projects; the frame itself holds `record.timestamp`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Skew always being zero for review frames: ruled out, because the frame keeps the model's record stamp (deep-review-state-contract.ts:290-295 projects; the frame itself holds `record.timestamp`).

### Stale anchors beyond the one corrected above. -- BLOCKED (iteration 24, 1 attempts)
- What was tried: Stale anchors beyond the one corrected above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale anchors beyond the one corrected above.

### Symlink write-through on the config rewrite: rename replaces the link. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Symlink write-through on the config rewrite: rename replaces the link.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Symlink write-through on the config rewrite: rename replaces the link.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 24
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-opus-1795201537192-sq1ivw, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-20T19:07:38Z
<!-- MACHINE-OWNED: END -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none; the iteration cap is reached - Focus area: synthesis - Reason: maxIterations 24 - Rotation status: frontier drained; legal convergence is blocked by the hard spec_code fail, so the stop is maxIterationsReached - Required evidence: terminal gates and review report Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
