---
title: "Verification Checklist: authoring the operator scenarios the coverage map proves are owed"
description: "With the operator-scenario contract enforceable and the false coverage removed, this phase authors what is genuinely absent: four uncovered external executors and their fail-closed cases, two end-to-end user-boundary workflows that no scenario runs today, the destructive and asynchronous public MCP tools that appear in no executable scenario, and seven declared-but-unauthored features and mode boundaries. The derived coverage map is the worklist and the gate; the applicability rule governs every item, so absence of a file is never by itself the reason to author one."
trigger_phrases:
  - "uncovered workflow authoring verification checklist"
  - "playbook scenario coverage verification checklist"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/003-uncovered-workflow-authoring"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist"
    next_safe_action: "Run checklist items after phase execution completes"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Authoring the Operator Scenarios the Coverage Map Proves Are Owed

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Planned phase — all items open. Closure in this phase is measured by the coverage report shrinking, never by a
statement that the work is done.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Child `001` closed: the coverage map is derivable and the validator is fail-closed.
- [ ] CHK-002 [P0] The uncovered inventory was **re-derived from live registries** at phase start and recorded —
      the finding list was treated as a seed, not the worklist.
- [ ] CHK-003 [P0] Every "no scenario anywhere" claim was re-tested across all 11 playbooks, with each search recorded.
- [ ] CHK-004 [P0] Any seed finding the re-derived map did not confirm was re-examined, not authored on faith.
- [ ] CHK-005 [P1] Child `002` closed, so authoring happened against repaired scenarios and settled censuses.
- [ ] CHK-006 [P1] **OPERATOR-DECISION Q3** answered and recorded; Lane B placement follows it.
- [ ] CHK-007 [P1] Executor binary and credential availability surveyed; the honest `SKIP` set planned in advance.
- [ ] CHK-008 [P1] The Lane A bound was stated before the first Lane A scenario was written.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Every new scenario carries the five required numbered sections and the full required-content set.
- [ ] CHK-011 [P0] Every new scenario has exact prompts, exact command sequences, observable expected signals,
      captured evidence, and binary pass/fail criteria.
- [ ] CHK-012 [P1] Command snippets carry the durable WHY only — no packet numbers, finding ids, or spec paths.
- [ ] CHK-013 [P1] Scenario prose is realistic operator intent, not a bare command paraphrase.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Every new scenario passed `validate-playbook-package.cjs --strict` **on its first commit**, with
      no follow-up fix commit.
- [ ] CHK-021 [P0] Every Lane A and Lane C scenario has a real run artifact under
      `<skill>/benchmark/reports/<dated-run>/`.
- [ ] CHK-022 [P0] Lane B produced real loop artifacts (state records, deltas, synthesis) and a real spec-folder
      closeout, both cited as evidence.
- [ ] CHK-023 [P0] Every destructive Lane C step has a paired refusal assertion.
- [ ] CHK-024 [P0] No forbidden verdict appears anywhere; every `SKIP` names a concrete blocker.
- [ ] CHK-025 [P1] Each Lane A fail-closed scenario asserts the hub's declared fail-closed behavior, not a generic error.
- [ ] CHK-026 [P1] No Lane A scenario duplicates a row already covered by the automated combination matrix.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] All 13 findings are closed either by an authored scenario or by a recorded
      not-applicable-because.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed per executor and per public tool before authoring:
      `rg -n '<name>' .opencode/skills/*/manual-testing-playbook`.
- [ ] CHK-FIX-003 [P0] Cross-playbook scenario-ID uniqueness check passes — no executor behavior asserted twice.
- [ ] CHK-FIX-004 [P0] The per-hub invariant holds: declared features = covered ∪ not-applicable, no overlap,
      no remainder.
- [ ] CHK-FIX-005 [P1] The {declared executors} × {routed workflow, fail-closed} matrix rows are listed and complete.
- [ ] CHK-FIX-006 [P1] At least one Lane A scenario was exercised with the executor binary genuinely absent, to
      prove the fail-closed path rather than assume it.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a SHA, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:applicability -->
## APPLICABILITY GATE

The rule that governs whether anything here is owed at all. A missing file is never by itself the reason.

- [ ] CHK-APP-001 [P0] Every authored scenario is justified by the applicability rule: the behavior is
      operator-visible, integration-critical, release-gating, or orchestration-shaped.
- [ ] CHK-APP-002 [P0] Every residual in the uncovered inventory carries a not-applicable-because naming the limb
      of the rule it fails.
- [ ] CHK-APP-003 [P0] No scenario was authored solely because a file, directory, or registry row exists.
- [ ] CHK-APP-004 [P1] Internal-only behavior whose acceptance criteria are fully automated was left uncovered and
      recorded as such, not padded into the corpus.
<!-- /ANCHOR:applicability -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Lane C ran against a disposable memory database, never a live one.
- [ ] CHK-031 [P0] No authored scenario embeds a credential, token, or developer-absolute path.
- [ ] CHK-032 [P1] Lane A dispatches used read-only or isolated configurations where the executor supports it.
- [ ] CHK-033 [P1] The disposable database was dropped and re-provisioned as the declared cleanup.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Every new scenario is indexed in its playbook root and the derived census updated with no
      hand-typed number.
- [ ] CHK-041 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` are reconciled.
- [ ] CHK-042 [P1] The ownership ruling for cross-skill workflows is recorded in the packet, not just applied.
- [ ] CHK-043 [P2] The not-applicable register is written so a future audit reads it instead of re-asking.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] New scenario files use kebab-case slugs with no numeric prefix, in kebab-case category directories.
- [ ] CHK-051 [P0] Every feature ID maps to exactly one per-feature file.
- [ ] CHK-052 [P1] Run artifacts live under the dated-run report tree, never baked into scenario truth.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] ADR-001 (the map is the worklist and the gate) and ADR-002 (absence is a cross-playbook claim)
      recorded with status.
- [ ] CHK-101 [P1] Rejected alternatives documented with rationale.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P2] Two consecutive derivation runs on an unchanged tree diff clean (REQ-023 reproducibility).
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented: delete the scenario and its index row; the derived census self-corrects.
- [ ] CHK-121 [P1] Lane B scenarios are explicitly bounded so the battery stays runnable in one sitting.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P0] Every authored scenario passes the applicability rule; absence of a file is never by itself the reason to author one.
- [ ] CHK-131 [P1] Every cross-playbook absence search (ADR-002) is recorded, not merely asserted.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] Every newly authored scenario is indexed in its owning hub's root, not left orphaned.
- [ ] CHK-141 [P2] The uncovered-inventory report handed to this phase is linked from `decision-record.md`.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 27 | 0/27 |
| P1 Items | 22 | 0/22 |
| P2 Items | 4 | 0/4 |

**Verification Date**: not yet run
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Cross-skill workflow ownership (Q3) | [ ] Approved | |
| Operator | `sk-prompt-models` playbook obligation (Q5) | [ ] Approved | |
| Operator | The not-applicable register — the residuals this fleet will stop re-auditing | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
