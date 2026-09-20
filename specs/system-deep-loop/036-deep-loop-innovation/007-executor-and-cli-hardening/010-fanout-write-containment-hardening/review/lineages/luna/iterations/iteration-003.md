# Review Iteration 3

## Dimension

Traceability: caller reachability, packet/ADR alignment, checklist evidence, current test citations, and threshold contract integrity.

## Files Reviewed

- specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:20-26,65-72,103-149,160-165,187-207
- specs/system-deep-loop/045-fanout-write-containment-hardening/plan.md:61-76,186-201
- specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:48-108
- specs/system-deep-loop/045-fanout-write-containment-hardening/tasks.md:85-103,301-340
- specs/system-deep-loop/045-fanout-write-containment-hardening/decision-record.md:532-553
- .opencode/commands/deep/assets/deep-review-auto.yaml:1267-1429
- .opencode/commands/deep/assets/deep-review-confirm.yaml:1138-1217
- .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3213-3231
- .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts:789-824
- .opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts:4380-4575

## Findings by Severity

### P0

None.

### P1

#### LUNA-T-001 [P1] Auto review cli-opencode dispatch still requires a removed linked worktree

- File: .opencode/commands/deep/assets/deep-review-auto.yaml:1304-1321
- Evidence: The cli-opencode branch throws when gitDir equals git-common-dir, then requires a primary main/master worktree and a clean primary checkout. The current fanout runner uses unique artifact directories and contains no worktree lifecycle; ADR-007 says the mechanism was removed.
- Finding class: cross-consumer
- Scope proof: The workflow guard and current runner dispatch path were read together; the current runner has no worktree creation/handoff while the auto YAML guard is unconditional for this executor branch.
- Claim adjudication: claim is that a supported cli-opencode auto run from the current checkout is rejected before dispatch; evidence refs are deep-review-auto.yaml:1304-1321,1379-1406, fanout-run.cjs:3213-3231 and decision-record.md:544-553; counterevidence sought is an outer runner that always supplies a linked worktree or a current caller test proving the no-worktree topology; alternative explanation is that a manually pre-created linked worktree can satisfy the guard but that is not the current default; final severity P1; confidence 0.99; downgrade trigger counterevidence.
- Recommendation: Remove the stale linked-worktree and clean-primary preflight or route it through the current preserve-and-contain contract and add a caller-level test.

#### LUNA-T-002 [P1] Canonical packet requirements still describe removed worktree behavior

- File: specs/system-deep-loop/045-fanout-write-containment-hardening/spec.md:20-26
- Evidence: Summary, scope, REQ-005/REQ-007, and SC-003/SC-005/SC-006 retain worktree creation, publication, isolation, and checkout-watch behavior, while ADR-007 accepts removal of worktrees, the cone, and worktree-only phases.
- Finding class: matrix/evidence
- Scope proof: Packet summary, scope, requirements, and success criteria were compared with ADR-007 and current runner comments identifying unique artifact directories rather than worktrees.
- Claim adjudication: claim is that the canonical packet is internally contradictory; evidence refs are spec.md:20-26,65-72,133-165, decision-record.md:544-553 and fanout-run.cjs:3213-3231; counterevidence sought is packet-wide supersession of all worktree rows or a later decision reinstating worktrees; alternative explanation is that some rows carry superseded labels but their normative bodies remain; final severity P1; confidence 0.98; downgrade trigger counterevidence.
- Recommendation: Supersede or rewrite retained worktree requirements and success criteria, then align status and phase-map metadata with ADR-007.

#### LUNA-T-003 [P1] Acceptance evidence marks removed behavior as met and cites absent or mismatched tests

- File: specs/system-deep-loop/045-fanout-write-containment-hardening/acceptance-criteria.md:63-108
- Evidence: AC-012 through AC-018 remain Met despite removed worktree behavior; AC-015 cites the absent worktree-lifecycle.vitest.ts, while cited current fanout-run lines cover metadata refresh or index-lock behavior. Packet status and closure/signoff text also conflict.
- Finding class: matrix/evidence
- Scope proof: Acceptance rows, closure text, current test inventory, and cited fanout-run ranges were compared; the named lifecycle test is absent and the current runner suite has no corresponding lifecycle block.
- Claim adjudication: claim is that the acceptance artifact overstates completion and cannot serve as a reliable closure gate; evidence refs are acceptance-criteria.md:48-50,71-80,103-108, tasks.md:301-340 and fanout-run.vitest.ts:4380-4575; counterevidence sought is the named test at the cited path, current lines asserting the claimed behavior, and reconciled closure metadata; alternative explanation is that some rows are superseded but remaining Met rows and closure fields still overclaim; final severity P1; confidence 0.97; downgrade trigger counterevidence.
- Recommendation: Mark removed rows superseded with ADR-007, replace stale citations with current evidence, and reconcile In Progress/Complete/Closeable/signoff metadata.

### P2

#### LUNA-T-004 [P2] Plan churn thresholds disagree with the shipped defaults

- File: specs/system-deep-loop/045-fanout-write-containment-hardening/plan.md:61-70
- Evidence: The plan says twelve per window or forty cumulative, while the current parser and requirement use three newly dirty paths and twelve cumulative; the runner consumes the parsed config thresholds.
- Finding class: matrix/evidence
- Scope proof: Plan, requirement, config parser, and runner threshold plumbing were compared in this pass.
- Recommendation: Update the plan rationale to the shipped 3/12 values or record a deliberate versioned change.

## Traceability Checks

- spec_code: partial. ADR-007 and current runner behavior contradict retained worktree claims, and the cli-opencode caller rejects the current topology.
- checklist_evidence: partial. Several Met rows rely on absent or mismatched worktree evidence and conflicting closure metadata.
- feature_catalog_code: partial. Current feature references were checked only at the runner boundary; no separate feature-catalog sweep was needed to establish the P1 contract drift.
- playbook_capability: pending. A maintainability/playbook deepening pass was not available after the configured cap.

## Ruled-Out Directions

- strict-config-worktree-key-rejection: current executor config explicitly rejects the removed containment.worktrees key (executor-config.ts:803-817).
- Correctness and security pivots from iterations 1 and 2 were not re-entered; this pass followed caller and evidence contracts.

## Deferred Frontier

- Maintainability was not executed because the configured maximum is three iterations. No maintainability PASS is implied; synthesis must preserve this coverage gap.

## Verdict

Review verdict: CONDITIONAL

## Next Dimension

Maintainability was not run; synthesis is required now because stopPolicy is max-iterations.
