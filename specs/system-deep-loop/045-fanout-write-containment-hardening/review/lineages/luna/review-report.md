---
title: Deep Review Report — fanout write containment hardening
description: Final synthesis for the detached luna fan-out review lineage.
trigger_phrases: []
---

# Deep Review Report

## 1. Executive Summary

- Verdict: CONDITIONAL
- hasAdvisories: false
- Active findings: P0=0, P1=6, P2=1
- Stop reason: maxIterationsReached after 3 of 3 iterations
- Dimension coverage: 3/4; correctness, security, and traceability were reviewed, while maintainability was deferred by the cap
- Release-readiness state: in-progress
- Scope: read-only review of the packet, containment and fan-out runtime, executor configuration, review callers, and cited evidence surfaces

The correctness pass found no release-blocking state-transition defect. The security pass found three P1 trust-boundary gaps: baseline capture/read paths are not fully symlink-contained, restore checks do not protect parent components, and quarantine validation is check-then-create rather than atomic. The traceability pass found three P1 contract/evidence failures and one P2 documentation mismatch: the auto cli-opencode caller still requires a removed worktree, the packet retains superseded worktree requirements, acceptance evidence overstates completion, and plan churn thresholds disagree with effective defaults.

No implementation, packet, workflow, or test files were changed by this lineage. The review stopped at the configured iteration cap; the conditional verdict therefore remains provisional until the active findings are remediated and maintainability coverage is run.

The target had no resource-map.md at initialization, so the Resource Map Coverage Gate does not apply.

## 2. Planning Trigger

The CONDITIONAL verdict routes to /speckit:plan. Remediation should first close the three security trust-boundary findings, then reconcile the cli-opencode caller and the canonical packet/acceptance evidence with ADR-007. The plan threshold mismatch can be corrected in the same documentation lane. After those changes, run the deferred maintainability dimension and the required verification gates before treating the packet as closeable.

## 3. Active Finding Registry

| Final ID | Iteration ID | Severity | Dimension | Status | Primary evidence | First seen | Last seen |
|---|---|---|---|---|---|---:|---:|
| F001 | LUNA-S-001 | P1 | security | active | write-containment.ts:820-835, 1048-1063 | 2 | 2 |
| F002 | LUNA-S-002 | P1 | security | active | write-containment.ts:1427-1450, 1491-1495 | 2 | 2 |
| F003 | LUNA-S-003 | P1 | security | active | write-containment.ts:1066-1137, 1145-1355 | 2 | 2 |
| F004 | LUNA-T-001 | P1 | traceability | active | deep-review-auto.yaml:1304-1321 | 3 | 3 |
| F005 | LUNA-T-002 | P1 | traceability | active | spec.md:20-26, 133-165 | 3 | 3 |
| F006 | LUNA-T-003 | P1 | traceability | active | acceptance-criteria.md:63-108 | 3 | 3 |
| F007 | LUNA-T-004 | P2 | traceability | active | plan.md:61-70 | 3 | 3 |

### F001 — Baseline capture and read paths are not symlink-contained

captureBaselineFile creates parent directories and copies baseline bytes by path without a destination refusal or no-follow guard. readBaselineContent later consumes the recorded path without revalidating ancestry. The runner passes the lineage directory as the capture root. Recommendation: validate every baseline destination and read path against the lineage root and use an atomic no-follow open strategy.

### F002 — Restore checks only the final component

Tracked restore performs an lstat check on the final path before a path-based write, while the not-in-HEAD branch recreates parents and writes without an ancestor guard. A replaced parent directory can redirect restore bytes outside the repository. Recommendation: protect every component and use an atomic directory/file-handle strategy for both restore branches.

### F003 — Quarantine refusal and creation have a replacement race

quarantineDestinationRefusal checks current ancestors before writeQuarantineFile recursively creates directories and opens the destination by path. An ancestor can be replaced between those operations. Recommendation: anchor creation to a verified directory handle, use an equivalent atomic no-follow primitive, or serialize validation and creation together.

### F004 — Auto review cli-opencode dispatch still requires a removed linked worktree

The auto workflow rejects a normal checkout when gitDir equals git-common-dir and then requires a clean primary main/master worktree. The current fan-out runner uses unique artifact directories and contains no worktree lifecycle, while ADR-007 records that worktrees were removed. Recommendation: remove or replace the stale preflight and add a caller-level test for the current preserve-and-contain topology.

### F005 — Canonical packet requirements still describe removed worktree behavior

The summary, scope, REQ-005/REQ-007 bodies, and SC-003/SC-005/SC-006 retain worktree creation, isolation, publication, and checkout-watch claims after ADR-007 accepted their removal. Recommendation: supersede or rewrite the retained normative rows and align the phase and status metadata.

### F006 — Acceptance evidence overstates completion

Multiple acceptance rows remain Met although they describe removed worktree behavior. AC-015 cites an absent worktree-lifecycle test, current fanout-run line ranges now cover unrelated metadata/index-lock code, and the packet status, closeability, and sign-off fields disagree. Recommendation: mark removed rows superseded, replace stale citations, and reconcile closure metadata.

### F007 — Plan churn thresholds disagree with effective defaults

The plan describes twelve paths per window or forty cumulative, while the current requirement/configuration and runner use three per window and twelve cumulative. Recommendation: update the plan rationale to 3/12 or record a deliberate versioned change.

## 4. Remediation Workstreams

1. Security containment — F001-F003. Harden baseline capture/read, restore ancestor handling, and quarantine creation; add regression coverage for parent symlinks, baseline links, and replacement races.
2. Caller and packet contract — F004-F005. Remove the stale linked-worktree preflight and rewrite the packet's retained worktree requirements and success criteria to the ADR-007 topology.
3. Acceptance evidence — F006. Re-anchor or supersede affected rows, restore valid test citations, and make status, closeability, task completion, and sign-off agree.
4. Planning hygiene — F007. Reconcile the plan's churn thresholds with the shipped 3/12 defaults.
5. Deferred verification — run maintainability coverage and the required full verification gates after the P1 workstreams land.

## 5. Spec Seed

- Define the shared-checkout contract: unique artifact directories provide lane isolation; worktree creation and checkout-watch are superseded by ADR-007.
- Require baseline, quarantine, and restore evidence writes to refuse symlinked ancestors and use atomic no-follow semantics.
- Define acceptance evidence as a current file and line-level proof, with superseded criteria explicitly labeled and excluded from Met counts.
- Make the effective churn thresholds 3 newly dirty paths per window and 12 cumulatively, or document a versioned alternative.
- Keep release readiness separate from iteration completion: a max-iterations terminal state with active P1 findings is incomplete for release.

## 6. Plan Seed

| Order | Task | Findings | Evidence to close |
|---:|---|---|---|
| 1 | Harden baseline capture/read and restore ancestor handling. | F001, F002 | Symlinked baseline and parent-component tests show no outside write or read. |
| 2 | Make quarantine validation and creation atomic or directory-handle anchored. | F003 | Replacement-race regression proves the quarantine boundary cannot be redirected. |
| 3 | Replace the stale cli-opencode worktree preflight. | F004 | Current-checkout caller test reaches dispatch under the preserve-and-contain contract. |
| 4 | Reconcile spec, ADR, phase, and success-criteria text. | F005 | No retained normative worktree claim conflicts with ADR-007. |
| 5 | Re-anchor acceptance and task evidence, then reconcile closure metadata. | F006 | Every Met row has an existing, matching citation and consistent status fields. |
| 6 | Update plan thresholds and run the deferred maintainability pass. | F007 | Plan and effective config agree; all four review dimensions have evidence. |

## 7. Traceability Status

| Protocol | Class | Status | Evidence |
|---|---|---|---|
| spec_code | blocking | partial | spec.md:20-26, 133-165 conflicts with ADR-007 and current fanout-run.cjs:3213-3231; see F005 |
| checklist_evidence | blocking | partial | acceptance-criteria.md:63-108 contains stale or unsupported evidence; see F006 |
| feature_catalog_code | informational | partial | fanout-run.cjs:3213-3231 was checked, but no separate feature-catalog sweep was completed |
| playbook_capability | informational | pending | Maintainability/playbook coverage was deferred by the three-iteration cap |
| skill_agent | informational | not applicable | The target is a spec folder, not a standalone skill |
| agent_cross_runtime | informational | not applicable | The target is a spec folder, not an agent definition |

The required core protocols are not complete. The traceability dimension is covered, but its contract checks remain partial because the packet and acceptance evidence have not been reconciled with the shipped topology.

## 8. Deferred Items

- Maintainability was not run. No maintainability PASS is implied.
- F001-F006 remain active P1 findings; F007 remains an active P2 advisory.
- No resource-map.md existed at initialization, so resource-map coverage was not evaluated.
- The continuity writer was not run in this detached lineage. State and synthesis artifacts remain under the lineage directory as the durable handoff.
- Tests, validators, continuity writers, and Git write commands were not run under the lineage execution constraints.

## 9. Audit Appendix

### Iteration replay

| Iteration | Focus | Verdict | New P0/P1/P2 | New-finding ratio | Stop telemetry |
|---:|---|---|---|---:|---|
| 1 | correctness | PASS | 0/0/0 | 0.00 | continue; max-iterations policy |
| 2 | security | CONDITIONAL | 0/3/0 | 1.00 | continue; convergence telemetry only |
| 3 | traceability | CONDITIONAL | 0/3/1 | 1.00 | continue; max-iterations policy |

The loop deliberately ran all three iterations even though convergence mode was off. The terminal stop reason is maxIterationsReached, not convergence.

### Coverage and evidence

- Three iteration narratives and three JSONL delta files are present under the lineage.
- The gateway state projection contains the initialization, scope, dimension, protocol, iteration, depth, and convergence records for all three passes.
- Seven active findings are represented in the registry. Each P1 finding has a typed claim-adjudication packet with evidence references, counterevidence sought, an alternative explanation, final severity, confidence, and downgrade trigger.
- Dimensions covered: correctness, security, traceability. Maintainability is deferred. Coverage is therefore 3/4.
- Graph and semantic-search status were unavailable; the review used direct reads and exact searches, recorded as graphless fallback.
- Replay of the stored iteration records agrees with the final finding counts and conditional verdict. Formal tests and validators were intentionally not executed under the detached lineage constraint.
- No implementation or target files were modified. The immutable configuration snapshot remains unchanged; terminal status and stop reason are carried by the synthesis record and gateway terminal event.

### Terminal handoff

The terminal synthesis record is synthesis.record.json. Its stopReason is maxIterationsReached and its ledger terminal status is incomplete because the cap was reached with maintainability coverage deferred and active P1 findings remaining.

Review verdict: CONDITIONAL
