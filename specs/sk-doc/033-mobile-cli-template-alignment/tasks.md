---
title: "Tasks: sk-code-mobile-cli Template Alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mobile cli alignment tasks"
  - "template conformance task list"
  - "playbook violation burndown"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-code-mobile-cli Template Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

*Baseline — record every gate's output before changing anything, so the same command can later prove the change.*

- [x] T001 Record playbook violations against the real validator (`manual-testing-playbook/`) - `FAIL_CLOSED, violations=84, operator=7, routing_gold_excluded=0`
- [x] T002 Record per-file DQI for assets, `code-standards.md`, `quality/` - assets 74-88, code-standards 86, quality README 81
- [x] T003 Record grep counts for the two names being removed - `design-reference` 12, `dqi-baseline` 5
- [x] T004 Confirm deletion targets are tracked and capture the rollback anchor - all tracked, tree clean, anchor `856c17d5ed`
- [x] T005 Determine which playbook contract actually governs this packet - confirmed via `validate-playbook-topology.cjs`: the packet's `--skill-dir` reports `leaf-manifest.json not found`, so operator-scenario governs instead
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

*Authoring, deletion, and quality resolution — Lanes A through E.*

### Authoring (parallel lanes)

- [x] T006 [P] Align 7 asset checklists with `skill-asset-template.md` (`assets/*.md`)
- [x] T007 [P] Align the reference standard with `skill-reference-template.md` (`references/standards/code-standards.md`)
- [x] T008 [P] Convert the playbook to the operator-scenario contract (`manual-testing-playbook/*.md`) - violations 84 -> 0, `--strict` exit 0

### Deletion and reference sweep

- [x] T009 Delete the design-reference tree (`references/design-reference/`)
- [x] T010 Drop 9 design-reference leaves from the hub manifest (`sk-code/leaf-manifest.json`)
- [x] T011 Remove the folder bullet and correct the folder count from six to five (`SKILL.md`)
- [x] T012 Strip design-reference mentions from two changelog entries (`changelog/v0.1.0.0.md`, `v0.1.1.0.md`)

### Quality resolution

- [x] T013 Delete the unverifiable baseline (`references/quality/dqi-baseline.md`)
- [x] T014 Drop its manifest leaf (`sk-code/leaf-manifest.json`)
- [x] T015 Rewrite the regression check in `references/quality/doc-quality-gate.md` to measure the file's own base revision instead of a stored table
- [x] T016 Replace the duplicated document shape with a pointer to `skill-asset-template.md` and `skill-reference-template.md`
- [x] T017 Verify the scorer point values against `extract_structure.py` before publishing them - intro 4, H2 12, dividers 6, style budget 8
- [x] T018 Rename the gate doc to match its document class and repoint its manifest leaf (`doc-quality-gate.md`)

### Routing-fixture repair (operator-authorized scope amendment)

Surfaced while verifying the playbook conversion; the operator directed the fix in-session.

- [x] T025 Reproduce the drift against the real router rather than by inspection - `router-replay.cjs` replay put `token-edit` at 6/7 and `comment-convention` at 2/7
- [x] T026 Establish which side is wrong - `0/4` sibling surfaces route the workflow doctrine; the hub bundles it on surface detection, so the fixtures asserted an unroutable path
- [x] T027 Repair the four unroutable expectations - restored the displaced `scoped-style-ownership.md` in the two IMPLEMENTATION scenarios, dropped the assertion in the other two
- [x] T028 Close the zero-intent routing gap - added `presentation comment` to IMPLEMENTATION keywords so a natural comment-convention request routes; prompt left unchanged to avoid teaching to the test
- [x] T029 Add the missing invariant to the sk-code drift guard and prove it fails on the bug - 3 tests appended to `sk-code-router-sync.vitest.ts`; each bug reintroduced and caught by name, green on restore
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

*Final-state verification — re-run every Phase 1 gate from the final tree.*

- [x] T019 Re-run the playbook validator from the final tree and read the output - `PASS ... violations=0 warnings=0`, exit 0
- [x] T020 Re-run the DQI sweep and compare every file against the Phase 1 baseline - `9/9` files at or above baseline, 0 regressions, 4 improved (75->81, 77->83, 74->80, 81->89)
- [x] T021 Confirm both removed names return zero grep hits across `.opencode/skills/sk-code` - `design-reference` 12 -> 0, `dqi-baseline` 5 -> 0
- [x] T022 Confirm `leaf-manifest.json` parses and every listed leaf resolves on disk - 228 leaves across 5 modes, 0 missing
- [x] T023 Sweep for stray files and unintended changes in the scoped diff - `git status --porcelain` diff review matches the Files-to-Change table, temp files removed
- [x] T024 Run `validate.sh <spec-folder> --strict` - Errors 0
- [x] T030 Re-run the full sk-code routing suite after the amendment - 55/55 across router-sync, route-gold, routing-allowlist
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` - T008 and T019-T024 remain open
- [ ] No `[B]` blocked tasks remaining - none currently blocked
- [ ] Manual verification passed - pending Phase 3 (T019-T024)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md - REQ-001 through REQ-008 documented in spec.md §4
- [x] CHK-002 [P0] Technical approach defined in plan.md - five-lane approach + Key Decisions documented in plan.md §1/§3
- [x] CHK-003 [P1] Dependencies identified and available - `extract_structure.py` and `validate-playbook-package.cjs` confirmed present (T004)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks - mapped to template-structure conformance: all 7 assets open at `## 1. OVERVIEW` (grep confirmed 7/7), `code-standards.md` carries the reference-template OVERVIEW block, no unnumbered `## THE GATE` section survives
- [x] CHK-011 [P0] No console errors or warnings - Not applicable: no runtime/console surface exists in this documentation packet
- [x] CHK-012 [P1] Error handling implemented - Not applicable: no runtime error-handling path exists in a documentation-only change
- [x] CHK-013 [P1] Code follows project patterns - no DQI regression on Lane A (75→81, 84→84, 87→87, 84→84, 77→83, 74→80, 88→88) or Lane B (86→86); checkbox-item parity and backticked-token multiset byte-identical to HEAD on every restructured file
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met - pending: REQ-001 (Lane C playbook conversion, T008) still open
- [ ] CHK-021 [P0] Manual testing complete - pending: playbook validator has not been re-run from the final tree (T019)
- [x] CHK-022 [P1] Edge cases tested - the manifest-resolution check initially reported 194 missing leaves; investigation found the check itself resolved all 228 leaves against the wrong packet root, not a manifest defect (see Evidence Notes below)
- [x] CHK-023 [P1] Error scenarios validated - `leaf-manifest.json` leaf resolution corrected and re-verified at 228/228 across all 5 modes, 0 missing
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. - Not applicable: this is a template-conformance and deletion packet, not a classified bug-fix work item
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. - Phase 1 baseline grepped `design-reference` (12 hits) and `dqi-baseline` (5 hits) across `.opencode/skills/sk-code` before any deletion
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. - Inbound consumers identified and closed: `leaf-manifest.json` (10 leaves), `SKILL.md` folder bullet, two changelog entries (T010-T012, T014, T018)
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. - Not applicable: no security/path/parser/redaction code is touched by this packet
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. - Not applicable: no algorithmic input matrix exists; the change set is five disjoint file-lane edits, not a parsing/security matrix
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. - Not applicable: no process-wide state or environment-dependent code is touched
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. - Evidence is pinned to the rollback anchor `856c17d5ed`, confirmed clean and fully tracked before any lane edit (T004)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets - not independently scanned; NFR-S01 requires it, and all touched content is template/reference/checklist prose, but no explicit secret-scan command was run and recorded
- [x] CHK-031 [P0] Input validation implemented - Not applicable: no user input surface exists in this documentation packet
- [x] CHK-032 [P1] Auth/authz working correctly - Not applicable: no auth/authz surface exists in this documentation packet
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - spec.md, plan.md, and tasks.md now share the same five lanes, requirements, and phase structure
- [x] CHK-041 [P1] Code comments adequate - Not applicable: no source code is touched; only markdown/JSON documentation files
- [x] CHK-042 [P2] README updated (if applicable) - Not applicable: no `README.md` exists in the `sk-code-mobile-cli` packet; its entry point is `SKILL.md`, corrected in T011
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only - not confirmed; no scratch/ usage is documented in the recorded lane evidence, pending the stray-file sweep in T023
- [ ] CHK-051 [P1] scratch/ cleaned before completion - pending T023
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 11/15 |
| P1 Items | 22 | 19/22 |
| P2 Items | 9 | 8/9 |

**Verification Date**: 2026-08-28
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md - no `decision-record.md` exists for this packet (not required at this level); the two architecture decisions are documented as plan.md §3 Key Decisions and ADR-001 in plan.md's L3 Architecture Decision Record section
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) - ADR-001 status: Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale - ADR-001 documents the rejected "type as routing-gold" alternative and why the topology gate cannot reach this leaf
- [x] CHK-103 [P2] Migration path documented (if applicable) - Not applicable: no data/schema/version migration is involved; plan.md §7 documents the rollback path instead
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Response time targets met (NFR-P01) - Not applicable: this is a documentation/template-conformance change with no runtime request-serving surface (see spec.md §7 Performance)
- [x] CHK-111 [P1] Throughput targets met (NFR-P02) - Not applicable: no NFR-P02 exists; no throughput surface for a documentation packet
- [x] CHK-112 [P2] Load testing completed - Not applicable: no runtime service exists to load-test
- [x] CHK-113 [P2] Performance benchmarks documented - Not applicable: no performance benchmark applies to a documentation/template-conformance change
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested - documented in plan.md §7 with a pinned commit (`856c17d5ed`) and confirmed-tracked files (T004); the restore command itself has not been dry-run executed
- [x] CHK-121 [P0] Feature flag configured (if applicable) - Not applicable: no runtime feature flag governs a documentation packet
- [x] CHK-122 [P1] Monitoring/alerting configured - Not applicable: no runtime monitoring surface exists
- [x] CHK-123 [P1] Runbook created - satisfied via the plan.md §7 rollback procedure, which serves as this packet's runbook; no separate runbook artifact is warranted for a docs-only change
- [x] CHK-124 [P2] Deployment runbook reviewed - see CHK-123; the rollback procedure is the reviewed runbook for this packet
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Security review completed - no explicit security review is recorded in the baseline evidence beyond the NFR-S01 requirement statement
- [x] CHK-131 [P1] Dependency licenses compatible - Not applicable: no new external dependency is introduced; existing internal validator scripts are used as-is
- [x] CHK-132 [P2] OWASP Top 10 checklist completed - Not applicable: no web-facing runtime surface exists for a documentation packet
- [ ] CHK-133 [P2] Data handling compliant with requirements - NFR-S01 requires no secret/credential/customer content; not independently scanned (same gap as CHK-030)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized - spec.md, plan.md, and tasks.md share the same lanes, requirements, and phase structure
- [x] CHK-141 [P1] API documentation complete (if applicable) - Not applicable: no API is introduced or changed by this packet
- [x] CHK-142 [P2] User-facing documentation updated - Not applicable: the touched docs (assets/references/playbook) are internal skill-authoring documentation, not user-facing product documentation
- [x] CHK-143 [P2] Knowledge transfer documented - plan.md's Key Decisions and ADR-001 record the rationale (routing-gold rejection, gate-doc rename) for future maintainers
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

Not applicable — no formal named-approver sign-off process governs this internal documentation packet.

| Approver | Role | Status | Date |
|----------|------|--------|------|
| N/A | Technical Lead | Not required | |
| N/A | Product Owner | Not required | |
| N/A | QA Lead | Not required | |
<!-- /ANCHOR:sign-off -->

---

## Evidence Notes

The manifest resolution check (CHK-022, CHK-023) initially reported 194 missing leaves. That was a defect
in the check, not in the manifest: `leaf-manifest.json` carries five `modes[]` entries whose leaves
resolve against five different packet roots, and the first script resolved all 228 against the
mobile-cli root. Corrected, the result is 0 missing. Recorded here because a wrong check that reports
failure is as much a finding as one that reports success.
