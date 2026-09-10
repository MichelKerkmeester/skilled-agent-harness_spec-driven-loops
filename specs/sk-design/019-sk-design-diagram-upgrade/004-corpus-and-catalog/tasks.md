---
title: "Tasks: Phase 4: corpus-and-catalog"
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
# Tasks: Phase 4: corpus-and-catalog

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

- [ ] T001 Confirm 003's phase gate: re-run `apply-diagram-tokens.cjs --default --out <scratch-dir>` and diff against `assets/templates/`; the diff must still be empty before this phase's own edits begin (scripts/apply-diagram-tokens.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T002 Extend `apply-diagram-tokens.cjs` with an examples selector so its existing token-source read, gate computation, and copy-out write model also reach the 34 files under `assets/examples/` — 003's own recorded Known Limitation #1 (F2.6) (scripts/apply-diagram-tokens.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T003 [P] Re-run T001's byte-diff over the four templates after the extension lands, confirming the extension changed no template output (scripts/apply-diagram-tokens.cjs, assets/templates/*.html) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Record the pre-repaint baseline: `grep -ohE "#[0-9a-fA-F]{6}" assets/examples/*.html | wc -l` and the distinct-value count, so the post-repaint census has a number to reproduce against (F2.1, F2.6) (assets/examples/*.html) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T005 Run the extended applicator over 33 of the 34 examples at each file's implied ground — light for the 32 cool-rgba files, terminal for `example-loop-terminal.html` — writing to a scratch directory; `example-sequence-oauth-dark.html` is excluded by name and untouched (F2.6; D1) (assets/examples/*.html) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T006 Read each of the 33 repainted files' diffs by hand against its pre-repaint version before promoting it into `assets/examples/`; a file whose diff was not read may not be promoted (F2.6; D3) (assets/examples/*.html) — executor: human review
- [ ] T007 Re-verify the census after promotion: `grep -ohE "#[0-9a-fA-F]{6}" assets/examples/*.html | wc -l` reports `1577` over 25 distinct values, matching T004's baseline (F2.1, F2.6) (assets/examples/*.html) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T008 Confirm `#ffffff`'s 40-occurrence/13-file role and `#3d4460`'s single-type role in `type-high-level.md`/`example-high-level.html` both survive the repaint unchanged in occurrence count (F2.1; D9) (assets/examples/*.html) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T009 Re-shoot all 39 captures against the repainted corpus: `node ../shared/scripts/render-screenshots.cjs ./assets ./screenshots` then `node ../shared/scripts/render-screenshots.cjs ./assets ./screenshots --check` (F4.2; D4) (screenshots/examples/*.png, screenshots/templates/*.png, screenshots/icons.png) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T010 Read the 39 fresh captures by eye against their sources; flag any figure whose repaint rendered wrong before catalog work begins — this is a fresh-render sanity read, not 006's permanent capture-review discipline (F4.2) (screenshots/examples/*.png, screenshots/templates/*.png, screenshots/icons.png) — executor: human review
- [ ] T011 Decide and record the sketchy descope: write the stated reason ("unproven — no example exercises it") into the catalog rather than adding a decoration example (F4.1; D9) (references/catalog.md) — executor: operator
- [ ] T012 [P] Build `references/catalog.md`: a `DIAGRAM_CATALOG:BEGIN … :END` sentinel pair around a table with canonical example, variant lattice, ceiling, imports, and skin columns, one row per canonical type (27 rows), header-name matched like the chart's own `catalog.md` (F4.1, F4.4; D12) (references/catalog.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T013 Normalize the ceiling column across the 7 of 27 type files with a stated ceiling (`type-data-flow.md`, `type-dp-security-matrix.md`, `type-high-level.md`, `type-it-state.md`, `type-loop.md`, `type-process.md`, `type-radar.md`), each keeping its own number and qualifier word; mark the other 20 rows "No stated ceiling" (F4.4) (references/catalog.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T014 Verify the catalog in both directions: every row resolves to a file that exists, and every canonical example under `assets/examples/` appears in exactly one row — no row without a file, no file without a row (F4.1, F4.4) (references/catalog.md) — executor: human review
- [ ] T015 Replace `SKILL.md`'s "Use Cases — selection guide" table (`SKILL.md:32-59`) with a short pointer to `references/catalog.md` (F4.4; D12) (SKILL.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T016 Relocate `SKILL.md`'s Smart Router Pseudocode block (~4.6KB, 12.6% of the file) into `references/foundations/router-pseudocode.md` verbatim, leaving a one-line pointer in `SKILL.md`; confirm 002's already-collapsed accessibility-contract statements are unchanged (F4.5; D12) (SKILL.md, references/foundations/router-pseudocode.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T017 Discharge `style-guide.md:52`'s deferred "v5.1" regeneration note now that the repaint has run; leave the version field frontmatter untouched (002 T010 owns that collapse) (F2.6) (references/foundations/style-guide.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Diff `feature-catalog/feature-catalog.md` and `manual-testing-playbook/manual-testing-playbook.md` against the post-repaint skill state; record the decision that both are independent `sk-doc` artifact families, not an `SKILL.md`-extraction target, and fix any drift the diff finds (sonnet's open question; D12) (feature-catalog/feature-catalog.md, manual-testing-playbook/manual-testing-playbook.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T019 Run the phase gate: a dress run of `check-diagram-corpus.cjs` against the repainted corpus once 005 ships it; the run must print `RESULT: PASSED` — the literal 004→005 handoff criterion (D4) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
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

- [ ] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-012 present
- [ ] CHK-002 [P0] Technical approach defined in plan.md — Technical Context, ADR-001 through ADR-003 present
- [ ] CHK-003 [P1] Dependencies identified and available — 003's plan, 002's findings ledger, the chart's `references/catalog.md`, and `render-screenshots.cjs` all read and cited
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks — the applicator extension follows the existing script's own style; no new lint config introduced
- [ ] CHK-011 [P0] No console errors or warnings — the extended applicator's run prints `RESULT: PASSED` or `RESULT: FAILED` and a matching exit code, mirroring 003's own contract
- [ ] CHK-012 [P1] Error handling implemented — an example with two candidate grounds or a missing token-source entry fails closed and names the file (T005)
- [ ] CHK-013 [P1] Code follows project patterns — no comment in `apply-diagram-tokens.cjs`, `references/catalog.md`, or `router-pseudocode.md` embeds a task id, finding id, ADR id, or REQ id (comment-hygiene hard block)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — AC-001 through AC-008 in acceptance-criteria.md
- [ ] CHK-021 [P0] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
- [ ] CHK-022 [P1] Edge cases tested — the untokenized-skip, title/comment-literal, rgba-spelling, no-ceiling, renamed-row, and stale-capture cases from spec.md §8 EDGE CASES each map to a refusal path, a grep check, or a `--check` run
- [ ] CHK-023 [P1] Every finding this node owns (F2.6, F2.1, F4.1, F4.2, F4.4, F4.5) and the sonnet open question each appear in a task line above; the feature-catalog/manual-testing-playbook decision is recorded in T018 and goal.md's LOG
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This phase's `research_intent` is corpus migration, not `fix_bug` — it repaints an
existing exemplar set and rebuilds two documentation surfaces, it does not repair a known-bad
behavior. The finding-class/producer-inventory/adversarial-table apparatus does not apply.
Traceability is instead covered by CHK-023 above.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets — no script or reference file this phase touches reads a credential, a URL beyond the already-allowlisted Google Fonts link, or an environment variable
- [ ] CHK-031 [P0] Input validation implemented — the applicator extension rejects an out-of-range ground argument the same way 003's `--scheme` validation already does
- [ ] CHK-032 [P1] Auth/authz working correctly — not applicable; this is hand-run local tooling with no network or auth surface (NFR-S01, spec.md §7)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized — REQ ids in spec.md match task citations here and AC rows in acceptance-criteria.md
- [ ] CHK-041 [P1] Code comments adequate — the relocated pseudocode block keeps its original comments verbatim; no ephemeral id added anywhere (verified by CHK-013)
- [ ] CHK-042 [P2] README updated (if applicable) — not applicable this phase; `README.md`'s screenshot-regeneration snippet already documents the capture command this phase reuses
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only — this authoring pass created no temp files; the applicator's scratch `--out` directory is a runtime artifact outside the repo, not a committed file
- [ ] CHK-051 [P1] scratch/ cleaned before completion — not applicable; nothing was added to this packet's scratch/ by this authoring pass
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
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
- [ ] CHK-103 [P2] Migration path documented (if applicable) — the corpus migration itself is this phase's own subject; plan.md's Data Flow and tasks.md's ordering serve as the migration path
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

Not applicable. NFR-P01 (spec.md §7) states no runtime performance target applies beyond the
capture tool's own already-tuned settle window and per-file timeout. CHK-110 through CHK-113 are
recorded here as not applicable rather than left as unverifiable placeholder rows.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested — plan.md §7 ROLLBACK PLAN and §L2 ENHANCED ROLLBACK
- [ ] CHK-121 [P0] Feature flag configured (if applicable) — not applicable; no runtime feature ships from this phase
- [ ] CHK-122 [P1] Monitoring/alerting configured — not applicable
- [ ] CHK-123 [P1] Runbook created — plan.md's Implementation Phases plus this tasks.md serve as the runbook for 005 to read
- [ ] CHK-124 [P2] Deployment runbook reviewed — pending T001's applicator-gate confirmation (see goal.md LOG)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

Not applicable. This phase handles no third-party dependency beyond the already-vetted Chrome
capture path and the already-allowlisted Google Fonts link, no user data, and no OWASP-relevant
surface. CHK-130 through CHK-133 are recorded here as not applicable.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized — spec.md, plan.md, tasks.md, acceptance-criteria.md, goal.md, implementation-summary.md cross-reference consistently
- [ ] CHK-141 [P1] API documentation complete (if applicable) — not applicable; no API surface, only hand-run CLI tooling
- [ ] CHK-142 [P2] User-facing documentation updated — `references/catalog.md` and `router-pseudocode.md` are the user-facing documentation this phase produces; both are tracked in Files to Change
- [ ] CHK-143 [P2] Knowledge transfer documented — plan.md's Architecture and ADR sections plus this tasks.md serve as the knowledge-transfer record for 005
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Sketchy-descope decision sign-off (T011) | [ ] Approved | |
| Human reviewer | Diff-read promotion gate, fresh-capture read, catalog bidirectional check (T006, T010, T014) | [ ] Approved | |
| GLM-5.3-Flash executor (cli-pi, DevPass) | Mechanical build execution (T001-T005, T007-T009, T012-T013, T015-T019) | [ ] Approved | |
| Opus xhigh orchestrator | Phase-doc authorship review (D11) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
