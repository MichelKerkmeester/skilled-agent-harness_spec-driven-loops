# Iteration 10 — correctness, traceability, final adversarial adjudication

## Dimension

Correctness and traceability: adversarially re-check every active finding, challenge severity, and inspect the packet acceptance criteria and verification checklist. This is iteration 10 of 10; convergence remains telemetry and the configured cap controls the stop.

## Files Reviewed

- .skilled/hooks/session-relaunch/README.md:21-31, 41-45
- .skilled/hooks/session-relaunch/lib/context-usage.cjs:18, 38-60, 86-114
- .skilled/hooks/session-relaunch/claude/context-nudge.mjs:69-84
- .skilled/hooks/session-relaunch/claude/stop-arm.mjs:48-70, 88-155
- .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:358-384, 403-443
- .skilled/hooks/session-relaunch/lib/killer.cjs:480-508, 636-664
- .skilled/hooks/session-relaunch/tests/context-usage.test.cjs:182-198
- .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:375-455
- .skilled/hooks/session-relaunch/tests/killer.test.cjs:1291-1358
- .claude/settings.json:120-128, 190-193; .codex/hooks.json:64-68, 137-141, 157-160
- .pi/extensions/session-relaunch.ts:8-14; .opencode/plugins/session-relaunch.js:13-18; .hermes/plugins/repo-guards/plugin.yaml:4-18
- .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs:51-58, 84-98
- .cursor/commands/speckit-handoff.md:1-5; .devin/SYNC.md:18-21
- .skilled/commands/speckit/handoff.md:27, 44, 59-62, 95-107
- .skilled/skills/sk-doc/sk-create-command/SKILL.md:237-244; assets/command-template.md:451-474
- specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/spec.md:156-175
- specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/acceptance-criteria.md:25-55
- specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/tasks.md:30-162
- specs/hooks/023-session-relaunch-loop/016-handover-trigger-review/implementation-summary.md:74-83
- specs/hooks/023-session-relaunch-loop/review/lineages/luna/steer.md:1-26
- Cursor official command docs: https://docs.cursor.com/en/agent/chat/commands and https://prod.cursor.com/docs/reference/deeplinks

## Findings by Severity

### P0 Findings

1. **LUNA-FANOUT-P0-001 — A .skilled-only linked repository has no project-level automatic hook registrations** — .skilled/hooks/session-relaunch/README.md:23-30
   - Condition and reproduction: A consumer repo links only .skilled to this checkout and starts an automatic runtime through skilled-loop. The shell-wrapper fixture creates exactly that .skilled symlink (tests/skilled-loop-shell.test.cjs:51-58) and proves wrapper discovery (84-98), but the five hook/plugin registration surfaces are sibling project paths and are absent in this topology.
   - Impact: No runtime callback reaches the shared implementation, so the automatic handoff cannot nudge, arm, or relaunch for this required linked-repository case.
   - Fix: Provide an installer/sync step that adds all five project registrations to the consumer repo, and fail clearly until they are available.
   - Finding class: cross-consumer. Scope proof: .skilled contains adapters but does not materialize .claude, .pi, .opencode, .codex, or .hermes project entries. Affected surface hints: all five automatic runtimes.
   - Case: repo/.skilled -> checkout/.skilled is the only runtime integration in the consumer repo.
   - Hunter/Skeptic/Referee: Confirmed. README lines 23-30 list each sibling registration; no source in the linked setup provisions them. Severity remains P0 because this topology blocks the hop.

### P1 Findings

1. **LUNA-FANOUT-P1-001 — A Claude transcript row larger than the 256 KiB tail silently suppresses the nudge** — .skilled/hooks/session-relaunch/lib/context-usage.cjs:18, 38-60, 94-109
   - Condition and reproduction: The final main-chain assistant JSONL row exceeds DEFAULT_TAIL_BYTES and older assistant rows are outside the tail. readTail begins inside the row; readClaudeFill drops the invalid partial first line and returns null; context-nudge returns done on null at lines 71-75. A final row over 262144 bytes therefore yields no nudge.
   - Counterevidence: context-usage.test.cjs:182-198 checks a long transcript but sizes the tail to include the complete target row; it does not test an oversized final row against the default limit.
   - Impact: A high-context Claude session can pass its threshold without a handoff prompt. Fix: use record-aware tail reading or preserve an explicit retryable usage-read failure.
   - Finding class: parser-boundary. Scope proof: shared Claude transcript reader. Affected surface hints: usage parser and nudge decision. Case: final assistant row exceeds 262144 bytes and no complete assistant row remains in the tail.
   - Hunter/Skeptic/Referee: Confirmed at P1; a later complete assistant row would avoid the failure, but the final-row condition is reproducible from the inspected parser.

2. **LUNA-FANOUT-P1-003 — killer spawn errors leave interactive runtimes armed without a retry trigger** — .skilled/hooks/session-relaunch/claude/stop-arm.mjs:48-70, 139-155
   - Condition and reproduction: Stop arms the record before spawning killer.cjs. Sync throws and async child errors are logged and swallowed. Tests at claude-adapters.test.cjs:375-455 prove both paths exit with the record still armed. If the failing event is the last Stop, there is no killer watching idle and no guaranteed later Stop to retry.
   - Impact: The session can remain alive with an armed record and no supervisor to trigger the wrapper hop. Fix: roll back to pending or provide a guaranteed retry after spawn failure.
   - Finding class: state-transition. Scope proof: the armed write precedes the sole spawn attempt. Affected surface hints: Claude Stop adapter, shared record, killer lifecycle. Case: final Stop arms successfully but killer spawn fails.
   - Hunter/Skeptic/Referee: Confirmed at P1; a later Stop could retry, but no later Stop is guaranteed and the tested failure path has no independent retry.

3. **LUNA-FANOUT-P1-004 — timeout cleanup can disarm a newer armed record for the same handoff path** — .skilled/hooks/session-relaunch/lib/killer.cjs:480-508; .skilled/hooks/session-relaunch/lib/relaunch-core.cjs:368-384, 403-415, 430-442
   - Condition and reproduction: recordTimeout compares only handoff path, then unarm checks only status and path. A pending replacement is armable even while the older killer holds the loop lock; if it reuses the same path and becomes armed before the older timeout, the stale finalizer can disarm it. The existing supersession test covers a different replacement path only (killer.test.cjs:1291-1358).
   - Impact: A valid replacement handoff can be lost and the wrapper can miss the next hop. Fix: add a unique record generation/identity and compare-and-swap that identity in timeout cleanup.
   - Finding class: stale-writer-race. Scope proof: path/status checks do not distinguish record generations. Affected surface hints: timeout finalizer, record CAS, repeated handoff path. Case: old killer watches H; a newer record reuses H, becomes armed, and then old killer times out.
   - Hunter/Skeptic/Referee: Confirmed at P1; a concurrent same-path replacement is required, but the current state identity cannot distinguish it. The different-path test does not cover this case.

4. **LUNA-FANOUT-P1-005 — Cursor's command mirror does not expose the documented /speckit:handoff name** — .skilled/hooks/session-relaunch/README.md:29; .cursor/commands/speckit-handoff.md:1-5
   - Condition and reproduction: README documents /speckit:handoff, while the only Cursor mirror is a flat speckit-handoff.md file. Cursor's official docs describe Markdown project commands under .cursor/commands and the documented name form does not establish a colon namespace from this flat filename. A live palette check for the installed version is the direct confirmation still missing.
   - Impact: An operator following the documented Cursor trigger may not find the manual handoff command. Fix: document the file-derived Cursor alias or add a Cursor-supported namespaced mirror; keep Devin's direct-file path distinct.
   - Finding class: command-entrypoint. Scope proof: mismatch between the README trigger and the only Cursor command mirror. Affected surface hints: Cursor command file and runtime matrix. Case: command palette exposes the flat file-derived name while the README tells users to type /speckit:handoff.
   - Hunter/Skeptic/Referee: Retained at P1 with confidence 0.82. Official command docs and the repository filename support the mismatch; a version-specific alias remains possible until checked live.

### P2 Findings

1. **LUNA-FANOUT-P1-006 — Packet-bound continuity save lacks an explicit stop branch on failure** — .skilled/commands/speckit/handoff.md:27, 59-62, 95-107
   - Severity adjudication: Downgraded from P1. The prior claim that a mandatory self-detection rule was violated is withdrawn: SKILL.md:244 makes that rule conditional on blocking phases, and implementation-summary.md:81-83 says this command has none. command-template.md:463 conflicts with the skill's narrower rule and does not establish a P1 requirement on its own.
   - Condition and reproduction: For a bound packet, the command directs a continuity save before prepare but has no explicit stop branch if the writer fails or the fresh artifact is absent. prepare validates the note/session and writes pending state; it receives no save result to validate (session-relaunch.cjs:361-381, 418-439).
   - Impact: A runner that mishandles a save error could continue with stale packet state. The evidence establishes a missing explicit fail-closed instruction, not normal compliant execution skipping the save; severity is therefore P2.
   - Fix: Require a successful save result before note creation/prepare; on failure, stop and report it. Finding class: workflow-guard. Scope proof: command specifies the prerequisite, but prepare does not verify it. Affected surface hints: packet-bound command, continuity writer, prepare CLI. Case: bound packet save fails and the runner continues because no explicit stop branch is written.

## Final Adversarial Self-Check

- P0-001, P1-001, P1-003 and P1-004 remain confirmed after source rereads and counterevidence checks.
- P1-005 remains P1 with a source-based inference and explicit live-palette downgrade trigger.
- P1-006 is downgraded to P2; the conditional skill rule and recorded implementation decision override the earlier claim of a mandatory blocking-phase violation.
- Active counts after adjudication: P0=1, P1=4, P2=1. No new finding IDs were added.

## Checklist Evidence

- The phase-016 acceptance document records AC-001 and AC-002 as Met with prior command/documentation check evidence. This pass read those rows but did not rerun their commands.
- AC-003 was Unmet before this pass. Ten iteration narratives/deltas now exist; this review was completed by the dispatcher-bound inline executor. It does not independently prove the CLI binary/model behavior named by the AC because nested dispatch was explicitly forbidden and declared satisfied by the dispatcher.
- AC-004 and AC-005 remain Unmet because findings have not been fixed. AC-006 remains Unmet because no live hops were run on the five runtimes or linked-repository setup.
- The packet still leaves T006-T013 unchecked. T007 has source-review evidence here but its task row was not changed. Fixes, tests/live hops, and strict validation remain outstanding.
- The task checklist still records 2/12 P0, 0/13 P1, and 0/1 P2 verified. No checklist status was edited.

## Traceability Checks

- spec_code: the linked-.skilled requirement is not satisfied by wrapper discovery alone; the ten iteration artifacts now contain the review result, with the inline-executor limitation stated above.
- checklist_evidence: AC-001/002 are packet-recorded as Met; AC-004/005/006 remain open; T008-T013 remain outstanding.
- skill_agent: the self-detection requirement is conditional in SKILL.md:244 and conflicts with the template's universal wording; the save-failure gap remains P2.
- agent_cross_runtime: all five automatic registration locations were inspected; a .skilled-only symlink does not provision them.
- feature_catalog_code: README presents five automatic runtimes and separates command-only paths; the linked-repository registration gap contradicts automatic behavior in that topology.
- playbook_capability: source and recorded-test evidence only; this pass makes no provider-backed runtime claim.
- duplicate_review_finding: iteration 9's prior-report search found no matching Cursor-name or continuity-save finding; adjacent handoff findings were rechecked as addressed.

## Execution Mode Note

Per-iteration executor dispatch was treated as satisfied by this bound inline executor, as directed. No nested CLI/agent was launched. No application tests, provider-backed live hops, validate.sh, git write, or generate-context.js ran. The normal phase-save step would create a temp payload outside this lineage and update packet continuity, so it was skipped under the lineage-only write boundary. No out-of-lineage file was written.

## SCOPE VIOLATIONS

- scope_violation: phase_save would create /tmp/save-context-data-<session-id>.json and invoke generate-context.js against the packet. Both writes are outside the bound lineage, so the phase was not executed. This scope conflict is recorded; it does not invalidate the lineage iteration artifacts.

## Next Focus

- Dimension: synthesis
- Focus area: compile ten iterations, the active registry, checklist evidence, and the execution-mode limitation; emit the terminal max-iteration synthesis event.
- Reason: the configured 10-iteration cap has been reached; only synthesis and final-state verification remain.
- Rotation status: all four review dimensions were covered across the lineage.
- Blocked/productive carry-forward: fix active findings and run provider-backed live hops in the owning implementation workflow.
- Required evidence: reducer-owned registry/dashboard/strategy, all ten iteration and delta artifacts, final report, and gateway synthesis event.

Review verdict: FAIL
