# Iteration 3 — Deep Review Packet 045

Session: 2026-08-31-auto-deep-review-045 · Iteration: 3 of 4
Focus: D1 correctness, D2 security, D3 traceability, and light D4 maintainability.

## Dimension

D1 and D2: P1-001 and P1-002 remain confirmed carry-forward findings after adversarial re-check. D3: three new P1 findings. D4: no new finding.

## Files Reviewed

- .opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:201-220,232-264,389-405
- .opencode/skills/system-spec-kit/mcp-server/tests/orphan-daemon-reaping.vitest.ts:184-268,300-370
- .opencode/plugins/session-cleanup.js:63-66,203-218
- .opencode/bin/system-spec-memory-launcher.cjs:121-125,221-237,586-616
- .opencode/skills/system-spec-kit/mcp-server/scripts/run-tests.mjs:11-120
- .opencode/skills/system-spec-kit/mcp-server/vitest.config.ts:8-43
- .opencode/skills/system-spec-kit/vitest.config.ts:5-19
- .opencode/bin/git-live-follow.sh:109-238
- .opencode/skills/system-spec-kit/mcp-server/tests/test-hang-containment.vitest.ts — absent
- .opencode/skills/system-spec-kit/mcp-server/tests/live-follow-log-hygiene.vitest.ts — absent
- Phase 3 and Phase 4 spec, plan, tasks, goal, and implementation-summary documents
- .opencode/skills/cli-external-orchestration/SKILL.md:169
- .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:331-359
- .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:106-162,604
- .opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/ and packet 058 documents

## Findings by Severity

### P0

None.

### P1

#### P1-001 [P1] Orphan-sweep kill switch remains bypassable through the library surface

File: .opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:78-87,232-252,389-405. Confirmed carry-forward. isSweepEnabled is used by the CLI payload builder, but applySweep defaults to executing candidates when opts.enabled is omitted. session-cleanup.js honors the switch through the compiled CLI path at 208-218; a direct library caller does not. Finding class: cross-consumer. Scope proof: no direct caller forwards the switch. Claim: direct applySweep can bypass the documented switch. EvidenceRefs: process-sweep.ts:83-87,232-252,389-405; session-cleanup.js:63-66,208-218. Counterevidence sought: direct caller forwarding the switch or an explicit CLI-only API contract. Alternative explanation: CLI-only scope is intended. FinalSeverity: P1. Confidence: high. DowngradeTrigger: explicit opt-in contract or fail-closed library default. Recommendation: enforce the decision at the termination API boundary.

#### P1-002 [P1] Plan-time parent-pid gate leaves freshly orphaned daemons alive

File: .opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:201-220. Confirmed carry-forward. applyCandidate rejects row.ppid !== 1 before its fresh parent check at 215, so a parent dying after inventory but before apply is skipped. orphan-daemon-reaping.vitest.ts:240-268 injects a constant live parent and does not exercise the transition; the orphan case seeds ppid=1 before apply. Finding class: instance-only. Claim: a daemon whose parent dies between planSweep and applySweep is not reaped by that apply. EvidenceRefs: process-sweep.ts:201-216; orphan-daemon-reaping.vitest.ts:203-268; system-spec-memory-launcher.cjs:121-125,233-237,586-616. Counterevidence sought: transition test or second-pass contract. Alternative explanation: stale evidence is conservatively rejected. FinalSeverity: P1. Confidence: high. DowngradeTrigger: documented second-pass semantics with evidence. Recommendation: make the apply-time check authoritative or add a second-pass protocol and transition test.

#### P1-003 [P1] cli-devin still contains a contradictory permission-mode authority

File: .opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/manual-testing-playbook.md:42-50,91-99. The audit banner says 3000.6.7 accepts smart and DV-004 inverted, but the global precondition says smart is invalid and must not be treated as valid. cli-reference.md:604 also lists only the old four values. The main glossary/probe at 113,120-134 and the DV-004 stale banner do not remove these contradictory paths. Finding class: cross-consumer. Scope proof: the root playbook is the scenario entry point and links DV-004 at 136-141; the parent rule at SKILL.md:169 makes the installed binary authoritative. Claim: a playbook reader can still conclude smart is invalid. EvidenceRefs: manual-testing-playbook.md:42-50,91-99; smart-permission-doc-runtime-mismatch.md:11-17; cli-reference.md:113,120-134,604; parent SKILL.md:169. Counterevidence sought: 3000.2.17 version qualifier or proof of a narrower environment parser. Alternative explanation: preserving the historical baseline, but it is unqualified. FinalSeverity: P1. Confidence: high. DowngradeTrigger: version-scope old-value statements and prove the environment parser is narrower. Recommendation: reconcile the root precondition and environment table with the canonical probe.

#### P1-004 [P1] Phase 3 completion claims lack a tracked negative-control artifact

File: specs/system-speckit/045-daemon-and-test-harness-hardening/003-test-hang-containment/goal.md:58-83. Goal criteria 61-64 remain unchecked, while tasks.md:34-55 and implementation-summary.md:78-83 claim the leaked-handle reproduction, bound, handle report, and healthy run are complete. The phase tree has no leaked-handle fixture, runner transcript, or linked evidence artifact; plan.md:69-83 explicitly requires the reproduction. Finding class: matrix/evidence. Scope proof: phase inventory contains only description, goal, implementation-summary, plan, spec, and tasks; exact search found no Phase 3 fixture or test name. Claim: Phase 3 is marked complete without durable proof of the same hung run terminating at the bound and naming its handle. EvidenceRefs: phase goal/tasks/summary/plan and run-tests.mjs:11-49. Counterevidence sought: checked-in fixture, captured output, or linked evidence record. Alternative explanation: a manual run happened outside the repository, but no command/output/path/link is retained and the goal disagrees. FinalSeverity: P1. Confidence: high. DowngradeTrigger: durable evidence plus reconciled completion metadata. Recommendation: retain and link repeatable hung and healthy run evidence.

#### P1-005 [P1] Phase 4 completion claims lack a tracked follower negative-control artifact

File: specs/system-speckit/045-daemon-and-test-harness-hardening/004-live-follow-log-hygiene/goal.md:58-83. Goal criteria 61-64 remain unchecked, while tasks.md:34-57 and implementation-summary.md:78-85 claim deduplication, re-entry, cap, and lock behavior were verified. No follower test, synthetic repository harness, command transcript, or durable output artifact exists; plan.md:74-83 requires that synthetic-repository run. Finding class: matrix/evidence. Scope proof: exact inventory/search found no Phase 4 fixture or test; git-live-follow.sh:109-238 has the implementation but no executable proof. Claim: Phase 4 is marked complete without durable proof for divergence, re-entry, cap, and lock preservation. EvidenceRefs: phase goal/tasks/summary/plan and git-live-follow.sh:109-238. Counterevidence sought: checked-in fixture, measured output, or linked report. Alternative explanation: an external manual run, but the plan and unchecked goal are not linked to retained evidence. FinalSeverity: P1. Confidence: high. DowngradeTrigger: retained synthetic-repository evidence plus reconciled metadata. Recommendation: add or link the follower harness and record its counts and cap/lock results.

### P2

No new P2 findings. P2-001 through P2-008 remain active carry-forward advisories and were not re-entered.

## Traceability Checks

- spec_code: partial — guards exist, but Phase 3/4 completion metadata and retained acceptance evidence do not align; packet 058 primary reference and hub rule are correct while the playbook retains stale guidance.
- checklist_evidence: fail — no checklist.md or tracked Phase 3/4 negative-control artifact; tasks and summaries are unlinked claims while both goals remain unchecked.
- skill_agent: partial — cli-devin gotcha and parent rule direct probing, but the playbook precondition and environment table remain contradictory.
- agent_cross_runtime: partial — cross-CLI authority is hoisted, but the Devin playbook exposes stale guidance.
- feature_catalog_code: not_applicable.
- playbook_capability: fail — stale enum guidance and absent retained Phase 3/4 capability evidence remain reachable.

## Search Coverage and Ruled-Out Directions

Graph and semantic search were unavailable; resource-map.md is absent. Graphless fallback used direct reads, exact searches, filesystem inventory, and prior-finding re-checks. The corrected cli-devin main glossary, gotcha, and parent rule are aligned. Runner process-group containment is correct: start_new_session=True plus killpg(child_pid) isolate the child group. The live-follow state-change implementation is present; the finding is missing proof, not a new transition-key defect. No scope violations occurred.

## Next Dimension

Iteration 4 should perform final adjudication and synthesis only. Do not re-enter saturated process-sweep or runner-safety directions unless contradictory evidence appears. Five active P1s remain.

## SCOPE VIOLATIONS

None.

## Verdict

Review verdict: CONDITIONAL
