---
title: "Tasks: Phase 6: capture-and-judgment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: capture-and-judgment

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

- [ ] T001 Confirm 005's `check-diagram-corpus.cjs` has landed on disk and read its judged-boundary block in full — this phase's graduation door has nothing to point at until that exact wording is read, not paraphrased (D4) (goal.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T002 [P] Read 002's `findings-ledger.md` F1.6, F1.10 and F3.3 rows and reconfirm the corrected fact-base numbers on disk (39 captures, 36 raw `<rect>` elements in `example-high-level.html`) before authoring any judged-column task (goal.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T003 [P] Read `manual-testing-playbook.md` in full — its existing three categories, its `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` marker, its cross-reference index — and the nine existing dated directories under `benchmark/reports/`, plus `run-manual-playbook-scenario.cjs`'s real path and CLI contract, before extending any of them (manual-testing-playbook.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Define the judged column's six checkable reads — connector overlap, fan, visible gap, behind-box, focal balance, type fit — each as a yes/no question a reader answers while looking at a capture, and name the two non-blocking taste notes (the remove test, taste) the column deliberately leaves outside a pass/fail verdict (F1.10 judged half) (manual-testing-playbook.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T005 State the graduation threshold for pairwise connector geometry — what a working 2D geometry pass must compute for connector overlap and fan specifically before either may leave the judged column and enter a named checker family, so the one-way door has a stated threshold rather than a vibe (F1.6 judged half) (manual-testing-playbook.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T006 Scope the font-substitution risk as fixed-width label-mask overflow, not a 4px grid violation, and specify the headless-browser measurement plan (page loaded, font stack disabled, comparison made, fail threshold) that settles it, naming the 7 arrow-label mask rects among `example-high-level.html`'s 36 raw `<rect>` elements as the concrete instance (F3.3) (manual-testing-playbook.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T007 Add the fourth scenario category, `CAPTURE REVIEW` (`CAP-001`), to `manual-testing-playbook.md`, defining the skin-pinned third capture requirement and the "different picture" reader test against the unpinned capture (the skin-pinned third capture item) (manual-testing-playbook.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T008 [P] Document the settled double-capture convention inside the `CAP-001` entry — what the two captures are, when each is taken, and what a reader compares between them (the settled double-capture item) (manual-testing-playbook.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T009 Extend the `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` scope note to name the capture-review scenario explicitly, and add the reason-required rule for every `SKIP` verdict (the playbook persistence contract item) (manual-testing-playbook.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T010 Renumber `manual-testing-playbook.md`'s trailing sections (`AUTOMATED TEST CROSS-REFERENCE`, `FEATURE CATALOG CROSS-REFERENCE INDEX`) to make room for the new `CAPTURE REVIEW` section, and add `CAP-001` to the cross-reference index (manual-testing-playbook.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T011 Add the one-way graduation log — a new section with a table (Item, Graduated Date, Family, Evidence, Removed From) — to `manual-testing-playbook.md`, and state plainly that nothing travels the other way (the one-way graduation rule item) (manual-testing-playbook.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T012 Run the headless-browser label-mask measurement T006 specifies against `example-high-level.html`'s 7 named mask rects and record the pass/fail read (F3.3); if Playwright is unavailable locally, record a documented `SKIP` with the missing-dependency reason, mirroring the playbook's existing `IMP-003` precedent (manual-testing-playbook.md) — executor: human review
- [ ] T013 Read all 39 captures once against the judged column's six reads (connector overlap, fan, visible gap, behind-box, focal balance, type fit), recording a per-capture verdict and, for any read that does not apply to a given file, a reason (manual-testing-playbook.md) — executor: human review
- [ ] T014 Confirm the skin-pinned third capture reads as a visibly different picture from its unpinned pair (paper and ink swatches differ by eye), and confirm both grounds of the settled double-capture read correctly on their own terms (manual-testing-playbook.md) — executor: human review
- [ ] T015 Persist T012-T014's outcomes through `run-manual-playbook-scenario.cjs` into this discipline's first dated report under `benchmark/reports/` — the phase gate; confirm every `SKIP` in the resulting `results.csv` carries a reason (benchmark/reports/) — executor: human review
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Read the first dated capture-review report by eye: confirm no hand-authored `skill-benchmark-report.md`, confirm its generation provenance names `run-manual-playbook-scenario.cjs` the way the nine existing reports already do, and confirm `results.csv` carries zero unreasoned skips (benchmark/reports/) — executor: human review
- [ ] T017 Confirm `check-diagram-corpus.cjs`'s judged-boundary block (005) and this phase's graduation log never list the same item at once, closing the phase gate (manual-testing-playbook.md, check-diagram-corpus.cjs) — executor: human review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
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

- [ ] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-011 present
- [ ] CHK-002 [P0] Technical approach defined in plan.md — Technical Context, ADR-001 through ADR-003 present
- [ ] CHK-003 [P1] Dependencies identified and available — 005's judged-boundary block, 002's findings-ledger.md, manual-testing-playbook.md's existing structure, and run-manual-playbook-scenario.cjs's real path all read and cited
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks — not applicable; this phase's deliverable is Markdown, not source code, so no lint config applies beyond the repository's standard Markdown conventions
- [ ] CHK-011 [P0] No console errors or warnings — the headless-browser measurement (T012) exits with a clear pass/fail/skip read, mirroring the runner's own contract
- [ ] CHK-012 [P1] Error handling implemented — a missing Playwright install is a documented `SKIP` with a named blocker (T012), never a silent gap or a crash
- [ ] CHK-013 [P1] Code follows project patterns — no comment inside `manual-testing-playbook.md`'s new sections embeds a task id, finding id, ADR id, or REQ id (comment-hygiene hard block); the existing `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` marker is quoted verbatim as the durable contract surface it is, not as an ephemeral label
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — AC-001 through AC-012 in acceptance-criteria.md
- [ ] CHK-021 [P0] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/006-capture-and-judgment --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
- [ ] CHK-022 [P1] Edge cases tested — the unreasoned-skip, stale-source, identical-skin-pin, deleted-family-after-graduation, self-review, hand-edited-report, and colliding-run-label cases from spec.md §8 EDGE CASES each map to a requirement or a verification task above
- [ ] CHK-023 [P1] Every finding this node owns (F1.6, F1.10, F3.3) appears literally in a task line above; the four unnumbered items this node owns (the skin-pinned third capture, the settled double-capture, the playbook persistence contract, the one-way graduation rule) each appear literally in a task line above
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This phase's `research_intent` is standing-discipline installation, not
`fix_bug` — it formalizes a permanent human-judgment process and a graduation door, it does not
repair a known-bad behavior. The finding-class/producer-inventory/adversarial-table apparatus does
not apply. Traceability is instead covered by CHK-023 above.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets — no document or task this phase touches reads a credential or an environment variable
- [ ] CHK-031 [P0] Input validation implemented — not applicable; this phase reads local files and a local headless browser, no external input is accepted
- [ ] CHK-032 [P1] Auth/authz working correctly — not applicable; this is a local review process with no network or auth surface (NFR-S01, spec.md §7)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized — REQ ids in spec.md match task citations here and AC rows in acceptance-criteria.md
- [ ] CHK-041 [P1] Code comments adequate — the judged-column definition and graduation-log section carry plain-prose explanation; no ephemeral id added anywhere (verified by CHK-013)
- [ ] CHK-042 [P2] README updated (if applicable) — not applicable this phase; `benchmark/reports/README.md` documents the existing dated-report convention and is read, not modified, by this phase's authoring pass
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only — this authoring pass created no temp files
- [ ] CHK-051 [P1] scratch/ cleaned before completion — not applicable; nothing was added to this packet's scratch/ by this authoring pass
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 16 | 0/16 |
| P2 Items | 5 | 0/5 |

**Verification Date**: 2026-09-10
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in plan.md — ADR-001 through ADR-003 present; this packet has no separate decision-record.md file (see spec.md RELATED DOCUMENTS)
- [ ] CHK-101 [P1] All ADRs have status — ADR-001, ADR-002, ADR-003 are all `Accepted`
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale — each ADR's "Alternatives Rejected" section is filled
- [ ] CHK-103 [P2] Migration path documented (if applicable) — not applicable; this phase adds a standing process, it does not migrate existing data
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

Not applicable. NFR-P01 (spec.md §7) states no runtime performance target applies beyond the
bounded, single-file headless-browser measurement. CHK-110 through CHK-113 are recorded here as not
applicable rather than left as unverifiable placeholder rows.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested — plan.md §7 ROLLBACK PLAN and §L2 ENHANCED ROLLBACK
- [ ] CHK-121 [P0] Feature flag configured (if applicable) — not applicable; no runtime feature ships from this phase
- [ ] CHK-122 [P1] Monitoring/alerting configured — not applicable; the dated `benchmark/reports/` history is the monitoring surface for this standing process
- [ ] CHK-123 [P1] Runbook created — plan.md's Implementation Phases plus this tasks.md serve as the runbook for every future release's capture-review run
- [ ] CHK-124 [P2] Deployment runbook reviewed — pending T001's judged-boundary-block confirmation (see goal.md LOG)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

Not applicable. This phase handles no third-party dependency beyond the already-vetted Playwright
install and the already-allowlisted Google Fonts link, no user data, and no OWASP-relevant surface.
CHK-130 through CHK-133 are recorded here as not applicable.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized — spec.md, plan.md, tasks.md, acceptance-criteria.md, goal.md, implementation-summary.md cross-reference consistently
- [ ] CHK-141 [P1] API documentation complete (if applicable) — not applicable; no API surface, only a Markdown playbook extension and a persisted-run convention
- [ ] CHK-142 [P2] User-facing documentation updated — the `CAPTURE REVIEW` category and graduation log inside `manual-testing-playbook.md` are the user-facing documentation this phase produces; tracked in Files to Change
- [ ] CHK-143 [P2] Knowledge transfer documented — plan.md's Architecture and ADR sections plus this tasks.md serve as the knowledge-transfer record for every future reviewer
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Human reviewer | Judged-column reads, third-capture and double-capture verification, first report read, judged-boundary/graduation-log reconciliation (T012-T017) | [ ] Approved | |
| GLM-5.3-Flash executor (cli-pi, DevPass) | Mechanical documentation build (T001-T011) | [ ] Approved | |
| Opus xhigh orchestrator | Phase-doc authorship review (D11) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
