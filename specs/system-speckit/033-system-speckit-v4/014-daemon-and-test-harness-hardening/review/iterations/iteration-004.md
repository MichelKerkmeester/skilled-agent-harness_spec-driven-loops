---
title: "Iteration 4 — Deep Review Packet 045"
trigger_phrases: []
---
# Iteration 4 — Deep Review Packet 045

Session: 2026-08-31-auto-deep-review-045 · Iteration: 4 of 4
Focus: Final adversarial adjudication of P1-001 through P1-005.

## Dimension

All four dimensions were revisited only for final adjudication: correctness, security, traceability, and maintainability. The review target is read-only; no tests or implementation changes were made.

## Files Reviewed

- .opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:20-87,195-268,302-405
- .opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:302-422
- .opencode/skills/system-spec-kit/mcp-server/tests/orphan-daemon-reaping.vitest.ts:184-370
- .opencode/plugins/session-cleanup.js:63-66,203-220
- .opencode/bin/system-spec-memory-launcher.cjs:121-125,221-237,586-616
- .opencode/skills/system-spec-kit/mcp-server/scripts/run-tests.mjs:9-120
- .opencode/skills/system-spec-kit/mcp-server/vitest.config.ts:15-42
- .opencode/bin/git-live-follow.sh:38-121,183-255
- specs/system-speckit/045-daemon-and-test-harness-hardening/003-test-hang-containment/{goal.md,plan.md,tasks.md,implementation-summary.md,spec.md}
- specs/system-speckit/045-daemon-and-test-harness-hardening/004-live-follow-log-hygiene/{goal.md,plan.md,tasks.md,implementation-summary.md,spec.md}
- .opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/manual-testing-playbook.md:36-99,136-141
- .opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:106-134,599-605
- .opencode/skills/cli-external-orchestration/SKILL.md:158-180
- specs/cli-external-orchestration/058-flag-enum-authority/{spec.md,plan.md,tasks.md,implementation-summary.md}

## Findings by Severity

### P0

None.

### P1

#### P1-001 [P1] Orphan-sweep kill switch remains bypassable through the library surface

- Status: Confirmed carry-forward; worth fixing: yes.
- File: .opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:83-87,232-252,389-395.
- Claim: `applySweep()` executes candidates when `opts.enabled` is omitted, while the documented kill switch is evaluated only by the CLI payload builder. The exported apply boundary therefore permits a direct caller to bypass the switch.
- EvidenceRefs: `process-sweep.ts:83-87,232-252,389-395`; `.opencode/plugins/session-cleanup.js:63-66,208-218`; direct-call inventory at `orphan-daemon-reaping.vitest.ts:16,218-231,247-258,279-296,306-318`.
- Counterevidence sought: a direct caller that always forwards the switch, or an explicit contract saying the exported library function is intentionally outside the switch.
- Alternative explanation: the switch may be intended as CLI-only, but that contract is not expressed at the exported function boundary.
- Final severity: P1. Confidence: high. Downgrade trigger: an explicit opt-in/fail-closed library contract with a direct API test.
- Smallest correct fix: enforce the switch at the apply API boundary, with the CLI passing an explicit decision and omitted `enabled` failing closed; add the direct-call regression case.

#### P1-002 [P1] Plan-time parent evidence leaves a newly orphaned daemon unreaped

- Status: Confirmed carry-forward; worth fixing: yes.
- File: .opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:395-407; .opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:201-216.
- Claim: a daemon with a live parent at inventory time is classified as `project-daemon`; if that parent dies before apply, the row retains the plan-time classification and `applyCandidate()` returns before the fresh parent check. The separate `row.ppid !== 1` guard is also stale evidence.
- EvidenceRefs: `process-memory-harness.ts:395-407`; `process-sweep.ts:201-216`; `orphan-daemon-reaping.vitest.ts:240-268` uses a constant live-parent callback and does not exercise the transition.
- Counterevidence sought: a transition test in which the parent dies after inventory, or a documented one-pass contract that intentionally preserves any row not orphaned at plan time.
- Alternative explanation: stale evidence may conservatively avoid false positives, but the apply path already promises fresh ownership/parent checks and the phase objective is to reclaim truly orphaned daemons.
- Final severity: P1. Confidence: high. Downgrade trigger: documented second-pass semantics with a transition test proving the intentional deferral.
- Smallest correct fix: reclassify/re-evaluate the candidate at apply time from fresh parent evidence (or add an explicit second pass) and test the parent-death transition.

#### P1-003 [P1] cli-devin still exposes contradictory permission-mode authority

- Status: Confirmed carry-forward; worth fixing: yes.
- File: .opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/manual-testing-playbook.md:42-50,91-99.
- Claim: the root playbook says its audit was against 3000.6.7 and that `smart` is accepted, but its global precondition still says `smart` must not be treated as valid; the stale DV-004 row remains reachable. The reference's environment table also omits `autonomous` and keeps an incomplete old enum.
- EvidenceRefs: `manual-testing-playbook.md:42-50,91-99,136-141`; `cli-reference.md:110-134,599-605`; `.opencode/skills/cli-external-orchestration/SKILL.md:169`.
- Counterevidence sought: a version-scoped qualifier that makes the old values historical only, or a narrower parser contract that excludes the audited runtime.
- Alternative explanation: the old baseline may be intentionally preserved, but it is not clearly scoped and conflicts with the installed-binary authority rule.
- Final severity: P1. Confidence: high. Downgrade trigger: version-scope every historical result and align the root precondition/table with the canonical probe.
- Smallest correct fix: make the root precondition and DV-004 evidence version-scoped, then update the environment table to the accepted values and aliases.

#### P1-004 [P1] Phase 3 completion evidence gap — resolved

- Status: Resolved after adversarial verification; the original claim no longer holds as an open P1.
- EvidenceRefs: `003-test-hang-containment/goal.md:61-84` now checks all criteria and records the 1200ms exit-124 bound result, the retaining `Timeout`, and the generous-bound healthy result; `tasks.md:53-65` and `implementation-summary.md:81-83` carry the same measurements. The runner implements the claimed bound and process-group termination at `run-tests.mjs:11-49,71-97`, and the reporter is configured at `mcp-server/vitest.config.ts:35`.
- Counterevidence sought: absence of a replayable fixture or captured transcript.
- Alternative explanation: the measurements were manual and are not independently replayable from a checked-in fixture; that is a residual evidence-quality limitation, not the original absence of any durable completion record.
- Final severity: P1 historical classification, resolved. Confidence: medium-high. Downgrade/reopen trigger: the goal-log measurements are removed or contradicted; a P2 follow-up may retain exact commands and output.
- Worth fixing further: no P1 fix required. A checked-in harness/transcript would be a proportional P2 traceability improvement.

#### P1-005 [P1] Phase 4 completion evidence gap — resolved

- Status: Resolved after adversarial verification; the original claim no longer holds as an open P1.
- EvidenceRefs: `004-live-follow-log-hygiene/goal.md:61-84` now checks all criteria and records held-divergence deduplication, re-entry, cap rotation, and pid-lock outcomes; `tasks.md:53-65` and `implementation-summary.md:83-87` carry the same results. The implementation exposes the matching state gate and rotation at `git-live-follow.sh:89-121,198-238`.
- Counterevidence sought: absence of a replayable synthetic-repository harness or captured transcript.
- Alternative explanation: the verification is a durable operator log rather than a checked-in executable artifact; that limits independent replay but does not leave the completion criteria unrecorded.
- Final severity: P1 historical classification, resolved. Confidence: medium-high. Downgrade/reopen trigger: the goal-log measurements are removed or contradicted; a replayable harness remains a P2 improvement.
- Worth fixing further: no P1 fix required. Retaining exact commands/output and a synthetic fixture would be a proportional P2 traceability improvement.

### P2

P2-001 through P2-008 remain advisory carry-forwards and are deferred. No new P2 was opened. The final pass did not re-enter the ruled-out ancestor, unknown-owner, bind-mount, symlink, fast-forward, process-group, or cross-CLI directions.

## Traceability Checks

- Core `spec_code`: partial. P1-001 through P1-003 still trace to implementation/consumer seams; Phase 3 and Phase 4 completion claims now have durable goal-log measurements and checked criteria.
- Core `checklist_evidence`: partial. Tasks and goal criteria are reconciled for Phases 3 and 4, but the evidence is prose-log based rather than replayable artifacts.
- Overlay `skill_agent`: partial. The parent skill's installed-binary authority is correct, but the cli-devin root precondition and table remain stale.
- Overlay `agent_cross_runtime`: partial. The authority rule is hoisted correctly, while the Devin playbook still exposes historical contradictory guidance.
- Overlay `feature_catalog_code`: not applicable.
- Overlay `playbook_capability`: fail for the stale permission guidance; pass for the newly recorded Phase 3/4 capability results.
- Graph/semantic search: unavailable; graphless fallback used direct reads, exact searches, inventory, and carry-forward adjudication. `resource-map.md` is absent.

## SCOPE VIOLATIONS

None. Reviewed files were not modified.

## Verdict

Three P1 findings remain active; two prior P1 evidence findings are resolved. No P0 is present.

## Next Dimension

None. This was iteration 4 of 4 and is the terminal pass.

Review verdict: CONDITIONAL
