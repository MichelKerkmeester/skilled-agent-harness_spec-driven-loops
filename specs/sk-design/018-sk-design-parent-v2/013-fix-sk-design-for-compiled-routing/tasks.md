---
title: "Tasks: Compile current sk-design for compiled routing"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-design compiled task breakdown"
  - "compiled routing verification checklist"
  - "sk-design rollout tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Compile current sk-design for compiled routing

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with observed evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Freeze the packet scope and read the current registry, hub router, root router, leaf manifest, runtime, resolver, advisor, guard, admission, and foundation surfaces (packet docs and live source).
- [x] T002 Capture the baseline: front door legacy sentinel, status `missing-manifest`, admission `no compiled engine registered`, and source-sync failure as a pre-existing blocker (focused commands).
- [x] T003 [P] Load the JavaScript, JSON, universal, and comment-hygiene authoring checklists (sk-code surface guidance).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Create the current-hub registry compiler and validate four-mode identity, root-router ownership, mode weights, tie order, and leaf closure (`009-sk-design/lib/registry-compiler.cjs`). Evidence: the built policy passes source identity over its four authored inputs, all 14 root-router resources resolve through the declared leaf manifest at build, and freshness reports the recorded policy hash equal to the current derivation, fresh true (scratch/T010-freshness.txt).
- [x] T005 Create the canary router for direct mode, explicit mode, near-tie bundle, no-match, negative, and root-router leaf decisions (`009-sk-design/lib/canary-router.cjs`, the actual shipped module). Evidence: the 8-case typed route gold is asserted at build, 7 scenarios routed and 1 rejected, including the chart and diagram orderedBundle tie and the fundamentals no-match default (scratch/T011-gold-rows.txt).
- [x] T006 Create the build harness, policy card, fixture, compiled artifacts, route gold, and shadow activation artifacts (`009-sk-design/harness`, `lib/policy-card.cjs`, `fixtures`, `compiled`, `activation`). Evidence: two consecutive builds exited 0 with status `built` and byte-identical outputs, all eight gold expectations asserted inside the build, and the shadow activation stayed inert with prior and live both legacy, shadowOnly, fencingEpoch 0.
- [x] T007 Register the new child in the runtime engine and add the hub to resolver, advisor source/dist, guard, closure, and focused cohort assertions (`.skilled/bin`, advisor runtime). Evidence: the promotion published 62 closure files, status reads 7 of 7 compiled-serving, 0 stale, 0 flag-off, the sk-code front door stayed byte-identical, and the foundation suite passed 46 of 46 at exit 0 (scratch/T010-freshness.txt).
- [x] T008 Update the live `sk-design/SKILL.md` compiled-routing contract without embedding ephemeral ids or spec paths in code comments. Evidence: the rewritten compiled block documents the front door, the legacy sentinel, and the kill flag, the readiness marker reports compiled-ready PASS, and the comment sweep found 0 identifier hits across 168 extracted comment lines (scratch/CHK-012-comment-sweep.txt).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run syntax and JSON validation over every changed implementation and generated artifact. Evidence: 19 of 19 checks green, 0 failures, exit 0 (scratch/T009-syntax-json.txt).
- [x] T010 Rebuild the child and verify policy, projection, graph, route gold, activation, source hashes, and manifest freshness are internally consistent. Evidence: the freshness check exited 0 with manifestValid true, fresh true, and the recorded policy hash equal to the current derivation (scratch/T010-freshness.txt).
- [x] T011 Replay one real request through stage one and stage two, recording the workflow mode and leaf resources. Evidence: the values request returned the fundamentals mode with its three leaf resources, the advisor trace carried compiledRoute at generation 1 with trustState moved 139 to 155, and the typed gold rows name the leaf resources for both stages (scratch/T011-route-values.txt, scratch/T011-advisor-values.json, scratch/T011-gold-rows.txt).
- [x] T012 Run `compiled-route-admission.cjs --hub sk-design --json` and classify any stale playbook gold separately from an implementation drift. Evidence: sk-design reported admitted with 3 pass, 1 drift, 0 stale-gold, and the SD-007 row was classified as stale cross-canvas playbook gold rather than an implementation defect (scratch/T012-admission.json, scratch/T012-admission-warnonly.txt).
- [x] T013 Run runtime front-door, status, flag, drift, and engine-failure probes for `sk-design`. Evidence: the flag-off, invalid, missing, stale, and engine-error states each returned the legacy sentinel, the engine error also emitted its resolver breadcrumb, and every restore returned the compiled decision, all at exit 0 (scratch/T013-engine-error.txt, scratch/T013-authority-states.txt).
- [x] T014 Run focused foundation/package checks and strict validation for this packet, then record unrelated pre-existing failures without repairing them. Evidence: the admission node test passed 29 of 29 after the pinned corpus constant moved 77 to 80, the scenarios node test passed 1 of 1, the package validator reported the pre-existing REFERENCES strict failure recorded unrepaired, and the packet-level strict validation ran at closure (the three T014 receipts).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements are Met in `acceptance-criteria.md`. Evidence: acceptance criteria AC-001 through AC-008 are all Met.
- [x] All tasks have observed evidence and are marked `[x]`, or a blocker is documented. Evidence: every T-row and CHK-row in this file cites its receipt, with the output and exit status read.
- [x] No `[B]` blocked tasks remain without an explicit operator decision. Evidence: no row is marked `[B]`, and the recorded findings are pre-existing or measured, listed in the implementation summary.
- [x] The final status, implementation summary, acceptance criteria, and derived metadata agree. Evidence: spec, summary, acceptance criteria, and derived metadata all record Complete at 100 percent on 2026-09-22.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance closure**: See `acceptance-criteria.md`
- **Implementation summary**: See `implementation-summary.md`
- **Decision records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

A command counts as evidence only after its output and exit status are read. Focused checks may prove this hub while the full repository gate remains blocked by an unrelated pre-existing failure. No check is marked passed without its output and exit status.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements and scope are documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach and rollback are defined in `plan.md`.
- [x] CHK-003 [P1] Dependencies and the source-sync baseline are identified.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Changed JavaScript passes syntax and quality checks. Evidence: 19 of 19 syntax checks green, 0 fail, exit 0 (scratch/T009-syntax-json.txt).
- [x] CHK-011 [P0] Changed JSON parses and generated artifacts are deterministic. Evidence: all changed and generated JSON parsed in the same sweep, and two consecutive builds produced byte-identical outputs (scratch/T009-syntax-json.txt).
- [x] CHK-012 [P0] No new code comment contains an ephemeral id or spec path. Evidence: 0 hits across 8 patterns over 168 extracted comment lines (scratch/CHK-012-comment-sweep.txt).
- [x] CHK-013 [P1] The implementation follows the existing shadow-child and fail-safe runtime patterns. Evidence: the child mirrors the shadow quartet with an inert genesis activation, and the fail-safe authority behavior was exercised end to end (scratch/T013-authority-states.txt).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria are Met or an approved decision record covers the exception. Evidence: acceptance criteria AC-001 through AC-008 are all Met, so no waiver is needed.
- [x] CHK-021 [P0] Both routing stages are replayed with observed mode and leaf output. Evidence: stage one named the mode in the route decision, stage two named the leaf resources in the typed gold and the advisor trace (scratch/T011-gold-rows.txt, scratch/T011-route-values.txt).
- [x] CHK-022 [P0] Admission and freshness checks are run against the final generated artifacts. Evidence: admission verdict admitted over the recorded gold, freshness fresh true over the recorded policy hash (scratch/T012-admission.json, scratch/T010-freshness.txt).
- [x] CHK-023 [P0] Legacy fallback is observed for missing, stale, invalid, and engine-error authority state. Evidence: all four states returned the legacy sentinel and each restore returned the compiled decision (scratch/T013-authority-states.txt).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The finding is classified as a cross-consumer compiled-routing change. Evidence: the change touches the engine, resolver, advisor, guard, closure, and both test suites, so the producer and consumer inventories below both applied.
- [x] CHK-FIX-002 [P0] Same-class producer inventory covers engine, resolver, advisor source/dist, guard, and closure. Evidence: the runtime engine hub map, the resolver cohort, the advisor flag source with its documented dist rebuild, the guard cohort, and the regenerated serving closure were all flipped in this rollout.
- [x] CHK-FIX-003 [P0] Consumer inventory covers front door, status, admission, foundation, and package tests. Evidence: the front door, status, admission, the foundation suite, and the scenarios test were all exercised after the flip (the T010, T012, and T014 receipts).
- [x] CHK-FIX-004 [P1] Mode, leaf, negative, defer, and authority-state matrix rows are listed and executed. Evidence: all four modes routed, leaves observed per row, the out-of-domain no-match fell to the fundamentals default, the forbidden request rejected, the four authority states failed closed, and the defer path is guarded by the fundamentals default this hub always defines (scratch/T011-gold-rows.txt, scratch/T013-authority-states.txt).
- [x] CHK-FIX-005 [P1] Evidence is pinned to the final implementation diff or commit. Evidence: the receipts under this packet's scratch plus the two closure commits, whose subjects are recorded in the implementation summary.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, credential, or external write is introduced. Evidence: the rollout adds only local code, JSON, and documentation, with no dependency or network change (see CHK-131).
- [x] CHK-031 [P0] Root-router resources stay inside the skill root and declared leaf manifest. Evidence: the 14 root-router resources resolve through the declared leaf manifest at build under closure failure codes, and the gold resources use hub-root packet-leaf paths inside the skill root (scratch/T011-gold-rows.txt).
- [x] CHK-032 [P1] Runtime failures remain fail-closed to legacy routing. Evidence: the full authority-state chain, including the moved-harness engine error, returned the legacy sentinel (the T013 receipts).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, acceptance, decision record, and summary are synchronized. Evidence: this closure pass synchronized them.
- [x] CHK-041 [P1] Code comments explain durable rationale only. Evidence: the sweep found 0 identifier hits (scratch/CHK-012-comment-sweep.txt).
- [x] CHK-042 [P2] Live `SKILL.md` describes the compiled front door and fallback. Evidence: the rewritten compiled block names the front door, the legacy sentinel, and the kill flag, and the readiness marker reports compiled-ready PASS.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Generated runtime files are inside the declared serving closure. Evidence: the promotion published exactly the 62 traced closure files, matching the serving-closure manifest.
- [x] CHK-051 [P1] Scratch outputs are outside the repository or removed before closure. Evidence: the transient drivers and logs live under /tmp, while the evidence receipts are deliberately kept under this packet's scratch directory and committed with it.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17 |
| P1 Items | 19 | 19 |
| P2 Items | 5 | 5 |

**Verification Date**: 2026-09-22
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions are recorded in `decision-record.md`. Evidence: ADR-001 and ADR-002 remained Accepted and governed this rollout, and the stale-gold classification is recorded as a measured finding rather than a decision change.
- [x] CHK-101 [P1] The current root-router contract and rejected historical alternative are documented. Evidence: ADR-001 records compiling the live four-mode contract and rejects copying the deleted historical rollout and the generic-compiler-only shortcut.
- [x] CHK-102 [P1] The promotion and rollback path are documented and observed. Evidence: the promotion published, verified, and finalized, the kill flag returned the legacy sentinel for 0 and an invalid value, and the authority-state probes showed the resolver serving exactly what the 013 manifest records (the T013 receipts).
- [x] CHK-103 [P2] Source-sync migration limits are recorded without widening this packet. Evidence: the restored authored prerequisite, the archived copy stale at five hubs, and the one-time sk-doc derivation drift are recorded as findings in the implementation summary.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Route evaluation remains local and bounded. Evidence: evaluation is an in-process deterministic scoring over the compiled routing model with no route-time network or subprocess.
- [x] CHK-111 [P1] Generated artifacts do not introduce a repeated source scan on the serving path. Evidence: the root-router leaf pairs are resolved at build into the routing model, so route time reads no skill source for them.
- [x] CHK-112 [P2] No load test is needed for this deterministic in-process route child. Evidence: the route performs fixed-size scoring and comparisons only, so the design rationale covers this row.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] The rollback flag and manifest procedure are tested. Evidence: the flag alone returned the legacy sentinel for 0 and an invalid value, and the authority-state probes proved that the serving 013 manifest alone governs authority, so restoring the prior currents reverses the hub, while the full revert command path stayed unexercised after the finalize consumed the publication state.
- [x] CHK-121 [P0] The activation manifest is fresh before authority is claimed. Evidence: freshness exited 0 with fresh true and manifestValid true, and the census read 7 of 7 compiled-serving, 0 stale (scratch/T010-freshness.txt).
- [x] CHK-122 [P1] Status and admission outputs are captured. Evidence: both are captured under this packet's scratch (the T010 and T012 receipts).
- [x] CHK-123 [P1] The operator-facing fallback is documented. Evidence: the live SKILL.md documents that SPECKIT_COMPILED_ROUTING=0 forces legacy.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No code comment contains ADR-, REQ-, CHK-, task-id, or spec-path content. Evidence: 0 hits across the eight patterns (scratch/CHK-012-comment-sweep.txt).
- [x] CHK-131 [P1] No new dependency or network call is introduced. Evidence: the modules stay standard-library only, and no dependency manifest changed.
- [x] CHK-132 [P2] No data or credential boundary is changed. Evidence: the child reads the same skill sources as the other six hubs and writes only inside the serving closure.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All packet documents are synchronized with observed implementation state. Evidence: this closure pass synchronized them, and the sign-off rows below record the final gates.
- [x] CHK-141 [P1] Generated metadata is refreshed after final document edits. Evidence: description.json and graph-metadata.json were regenerated after the final document edits, and the retrieval trigger index was published at exit 0.
- [x] CHK-142 [P2] User-facing compiled-routing text is current. Evidence: the rewritten SKILL.md block matches the shipped flag, sentinel, and front-door behavior.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | [ ] Approved | |
| Implementer | Code owner | [x] Approved | 2026-09-22 |
| Validation | Automated gate | [x] Approved | 2026-09-22 |
<!-- /ANCHOR:sign-off -->
