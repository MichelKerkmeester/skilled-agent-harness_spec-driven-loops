# Review Iteration 002

## Dispatcher

- Iteration: 2 of 7
- Mode: review
- Dimension: security
- Target agent: deep-review
- Agent definition loaded: true
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Operator review focus: Decision-capture series code and docs: .skilled/hooks/decision-capture (lib, bin sweeps, claude, devin, pi adapters and tests), .opencode/plugins/decision-capture.js, system-spec-kit runtime decision-table-matcher.ts, cli/continuity/match-decision-table.ts, decision-record-writer.ts consumed-log reader, cli/core/workflow.ts operator-decision path, .skilled/commands/speckit/save.md decision step, hooks README and coverage-rationale, the operator-decision-capture feature catalog entry and the decision-capture playbook scenarios. Look for correctness bugs, security and path issues, maintainability and overengineering.
- Focus application: This security pass traced the project directory supplied by each live adapter into the shared queue, nudge and consumed-log paths, then checked save-target resolution and source-key validation. The series docs, feature catalog and manual playbook remain for the traceability pass.

## Files Reviewed

- .skilled/hooks/decision-capture/lib/capture-core.mjs:238-247, 305-327, 331-344, 361-390
- .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs:51-66
- .skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs:74-92
- .skilled/hooks/decision-capture/pi/decision-capture.ts:48-117
- .opencode/plugins/decision-capture.js:47-99
- .skilled/skills/.state/decision-capture/README.md:19-25, 31-37
- .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts:756-803, 811-838
- .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts:103-112, 255-275, 348-430
- .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-table-matcher.ts:1-220
- .skilled/skills/system-spec-kit/runtime/cli/utils/input-normalizer.ts:200-315
- .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts:624-765
- .skilled/commands/speckit/save.md:61-77
- .skilled/hooks/README.md:29-47, 51-103

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new in this iteration. The active Claude/Pi transcript identity finding from iteration 1 remains unresolved.

### P2 Findings

1. **The shared decision queue follows a symlink outside the project root** -- .skilled/hooks/decision-capture/lib/capture-core.mjs:238 -- `queueDir()` joins the caller's project directory to the state path but does not resolve or reject symlinks. `appendRecords()` and `takeNudge()` then create and write queue or nudge files through that path; the save writer and matcher use the same state directory for consumed keys. A project containing a symlink at `.skilled/skills/.state/decision-capture` can therefore redirect captured operator answers and save bookkeeping to a different writable directory, contrary to the documented project-local storage boundary.
Finding class: symlinked_queue_path_escape
Scope proof: Claude, Devin, Pi and OpenCode adapters pass their runtime project directory to the shared core; the CLI writer and matcher independently resolve the same relative state directory, and none checks its real path before file access.
Affected surface hints: .skilled/hooks/decision-capture/lib/capture-core.mjs, .skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs, .skilled/hooks/decision-capture/devin/ask-capture-posttooluse.mjs, .skilled/hooks/decision-capture/pi/decision-capture.ts, .opencode/plugins/decision-capture.js, .skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts, .skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts
Case: A checked-out project places a symlink at `.skilled/skills/.state/decision-capture` pointing to another writable directory; answering a captured question appends its verbatim question and answer outside the project, and a stop/turn-end hook can write its nudge there too.

## Traceability Checks

- Core spec_code: partial for this security pass; the runtime state README promises local storage and the queue path implementation does not enforce that boundary.
- Core checklist_evidence: pending for the dedicated traceability pass.
- Overlay feature_catalog_code: pending for the dedicated traceability pass.
- Overlay playbook_capability: pending for the dedicated traceability pass.
- Cross-runtime adapter boundary: reviewed for the project-directory handoff; no additional adapter-specific path construction was found.

## Integration Evidence

Static producer-to-consumer tracing confirmed that the live adapters and save-time writer share the same project-relative state directory. The save workflow resolves decision-record destinations from the bound target or a resolved phase child, and the normalizer restricts `sourceKey` to letters, digits, colon, period, underscore and hyphen. No test suite or live runtime was run.

## Edge Cases

- The symlink condition affects both captured-answer data and the consumed/nudge bookkeeping paths.
- Queue and nudge file modes are requested at creation, but those modes do not constrain the parent path selected by a symlink.
- The CLI `--record` path is explicitly supplied to the matcher; the ordinary save workflow selects the target record from its validated packet path.

## Confirmed-Clean Surfaces

- Decision text and source keys are data fields; source keys are constrained before the writer uses them as identifiers.
- Operator-decision grouping selects the bound target or a phase child resolved from continuity paths; it does not take a destination path from the decision text.
- Queue file names use a hex-encoded session id, so the session id itself does not introduce path separators.

## Ruled Out

- No direct text-to-path injection was found in the operator-decision payload: `sourceKey` has a restrictive character set and is used as a key, while `question`, `answer`, and `carriedBy` are serialized as record content.
- No symlink containment check exists at the shared state path, so the queue escape remains an active P2 finding.

## Next Focus

- Dimension: traceability
- Focus area: Map the parent and child acceptance criteria, feature catalog entry, hooks README and coverage rationale, runtime registry wiring, and decision-capture playbook scenarios to the implementation.
- Reason: Correctness and security passes found concrete issues; the code-to-spec and cross-runtime documentation contracts remain unverified.
- Rotation status: D2 security recorded; move to D3 traceability.
- Blocked/productive carry-forward: Preserve the producer-to-consumer tracing approach and compare every declared runtime capability with its implementation and scenario evidence.
- Required evidence: Parent/child phase maps and acceptance rows, catalog paths, README coverage cells, coverage-rationale reasoning, and the relevant playbook setup/expected-output blocks.
- Recovery note: Keep the two active findings unless source rereads establish a collision-resistant transcript identity check or a real-path queue containment guard.

Review verdict: PASS
