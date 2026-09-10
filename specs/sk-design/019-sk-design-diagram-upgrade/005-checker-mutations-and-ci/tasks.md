---
title: "Tasks: Phase 5: checker-mutations-and-ci"
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
# Tasks: Phase 5: checker-mutations-and-ci

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

- [x] T001 Confirm 004's repaint, capture re-shoot and catalog build have actually landed on disk — census grep, capture count, catalog sentinel — rather than trusting 004's own checkbox state, since a family authored against a red corpus proves nothing (D4) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: census 1,577/25, 39 captures, catalog sentinel — all confirmed on disk before any family was written
- [x] T002 [P] Read `sk-design-chart/scripts/check-corpus.cjs`, `scripts/tests/corpus-mutations.test.cjs`, `scripts/tests/apply-design-md.test.cjs`, and `.github/workflows/chart-corpus.yml` as the read-only pattern source; confirm no `sk-design-chart` file enters this phase's edit set (D12) (scripts/check-diagram-corpus.cjs, scripts/tests/corpus-mutations.test.cjs, .github/workflows/diagram-corpus.yml) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: read as the port pattern; the diagram harness requires nothing from the chart skill
- [x] T003 [P] Read 002's `findings-ledger.md` and 003's applicator/sentinel contract to confirm the exact signed scope each family asserts, without re-signing a decision 002 already made (goal.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: each family asserts the scope 002 signed; no decision re-opened
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Scaffold `check-diagram-corpus.cjs`: a family registry, per-family tally counters, and a final `RESULT: PASSED`/`RESULT: FAILED` line the CI greps, ported from the chart's shape rather than imported (F1.1; D4, D12) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `scripts/check-diagram-corpus.cjs`: registry, tallies, `RESULT:` marker, `--extra`
- [x] T005 Make the family count discoverable from the registry's own key count, not a hand-maintained document, so the diagram's family count cannot drift the way the chart's documented-42-vs-actual-47 count already has (F1.2) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: the registry is the `scripts/families/` directory; the run prints the count it loaded
- [x] T006 [P] Build the `metadata` family: a single-locus regression guard confirming the five version fields 002 T010 already collapsed stay collapsed to `SKILL.md`'s one surviving field (F4.3 regression) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `families/metadata.cjs`: anchor era across 61 documents, ownership sentence, one accessibility statement
- [x] T007 Build the `accessible-svg` family against a flattened source view (strip inter-tag whitespace/newlines before asserting) scoped title-first to the first `<svg role="img">`, not the first `<svg>` element — the 13-`<svg>` multi-icon file is why both qualifications exist (F1.3, S1.1; ADR-001, ADR-002) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `families/accessible-svg.cjs` over a flattened tag view, scoped to the first `<svg role="img">`
- [x] T008 [P] Register the judged boundary at the top of the checker: the items it does not statically hold — pairwise connector geometry until a 2D pass exists, focal balance, type fit, the remove test, taste — each named in plain prose, with a one-way graduation note that a computable item moves into a named family and leaves this list, never the reverse (F1.10) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: the judged boundary is the harness header: pairwise geometry until a 2D pass, focal balance, type fit, remove test, taste
- [x] T009 Build the `marker-vocabulary` family asserting D6's "define only what you draw, per file" scope over the repainted corpus (F1.7; D6) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `families/marker-vocabulary.cjs`; templates exempt from the unused-definition direction (a skeleton defines the trio for its copy); ten dead definitions removed from seven examples
- [x] T010 [P] Build the `unique-ids` family asserting D6's per-file id-uniqueness scope, closing the `dots` id collision the repaint fixes (F1.7; D6) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `families/unique-ids.cjs`, 181 assertions
- [x] T011 Build the `node-budget` family counting `data-diagram-node`-tagged elements, not raw `<rect>`, removing the 36-vs-29 ambiguity D7 exists to resolve (F1.8; D7) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `families/node-budget.cjs` counts tagged nodes and arrows; zero tags is advisory today
- [x] T012 Build the `no-external` family with a one-entry `fonts.googleapis.com` allowlist as net-new work — `check-corpus.cjs:934-938` is a comment-stripping rationale, not an exception precedent to port — and encode 002 T006's `assets/icons.html` scope (in-corpus for the allowlist, outside the counted 34-example/4-template sets) rather than re-deciding it (F1.4, F3.1; D2) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `families/no-external.cjs` with the one-entry fonts allowlist
- [x] T013 Build the `grid-4px` family against D5's signed exemption list (font sizes, derived label offsets), asserting the corrected violation set at `example-flowchart.html:90-112` is clean post-repaint (F1.5; D5) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `families/grid-4px.cjs`: percent extents exempt; the corpus sits off the grid in 24 files (302 values), so the family binds new files outright and ratchets legacy files against `grid-baseline.json`
- [x] T014 Build the `orthogonal-connectors` family with a type-aware allowlist excluding a radar's by-design diagonal spokes and an `aria-hidden` nested icon's diagonal stroke from the connector-layer check (F1.6) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `families/orthogonal-connectors.cjs`: a connector carries a marker or a connector class; hop arches may curve (five marked); two swimlane diagonals turned into elbows
- [x] T015 Build the `derivation-gates` family: re-derive each ground's contrast from the `DIAGRAM_PALETTE` sentinel block through 003's ported `channel`/`luminance`/`contrast`/`round2` module rather than compare the record against itself, honoring the accent's 2.863:1 as a recorded departure that must not fail (D8, D9; ADR-003) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `families/derivation-gates.cjs` re-derives every ratio from the sentinel block; terminal soft recorded as a departure (decoration)
- [x] T016 Build the `catalog-bidirectional` family: no `references/catalog.md` row without a matching `assets/examples/` file, no file without a row, header-name matched the same way the chart's own `check-corpus.cjs` already verifies (F4.1, F4.4; D12) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `families/catalog-bidirectional.cjs`, 97 assertions both ways
- [x] T017 Run the checker against the repainted corpus; the first `RESULT: PASSED` this run prints serves as both 004's own dress-run gate and this phase's own precondition that every family is internally correct against a real green corpus (D4) (scripts/check-diagram-corpus.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `RESULT: PASSED` — 38 files, 10 families, 1,070 assertions; this run is the 004 dress-run gate
- [x] T018 Build `scripts/tests/corpus-mutations.test.cjs`'s whole-corpus precondition: assert the checker prints `RESULT: PASSED` before any mutation case runs, since every case assumes a green starting point (scripts/tests/corpus-mutations.test.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: the suite's first test asserts the corpus is green before any mutation
- [x] T019 Build the four refusals as reusable guard helpers: the mutation's anchor is not present in the original; the mutation changed nothing; the base already fails the named family; the failure came from a family other than the one named — each refusing a case that would otherwise assert nothing (scripts/tests/corpus-mutations.test.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `runFileCase` and `runPackageCase` carry the four refusals
- [x] T020 Write one mutation case per registered family (metadata, accessible-svg, no-external, grid-4px, orthogonal-connectors, marker-vocabulary, unique-ids, node-budget, derivation-gates, catalog-bidirectional), each breaking one thing and asserting one named family fires with its expected message (scripts/tests/corpus-mutations.test.cjs, scripts/tests/fixtures/) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `scripts/tests/mutation-cases.cjs`: ten cases, one per family
- [x] T021 Build the completeness triple: every registered family has a case or a stated reason it cannot; nothing here names a family the checker does not register; no exemption outlives the family it excuses (scripts/tests/corpus-mutations.test.cjs) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: the completeness triple is in the suite; every family covered, no invented family, no stale exemption
- [x] T022 Build `.github/workflows/diagram-corpus.yml` from nothing: a corpus-check step piping to a log and grepping the literal `RESULT: PASSED`, plus a mutation-and-applicator-tests step, mirroring `chart-corpus.yml`'s two-step shape without touching it (D4; ADR-004) (.github/workflows/diagram-corpus.yml) — executor: GLM-5.3-Flash max via cli-pi (DevPass) — evidence: `.github/workflows/diagram-corpus.yml`: corpus marker grep, applicator byte-diff, mutation suite
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T023 Run `node --test scripts/tests/` locally and read the output line by line, confirming every case passes for its stated reason (not a hollow pass), the four refusals hold, and the completeness triple reports clean (scripts/tests/corpus-mutations.test.cjs) — executor: human review — evidence: `node --test scripts/tests/` 14/14; three cases were first mis-authored by the conductor and corrected
- [ ] T024 Push a confirming commit and read the CI run: corpus check green, mutation suite green, no backlog behind the gate — the literal 005 → 006 handoff criterion (.github/workflows/diagram-corpus.yml) — executor: human review
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

- [ ] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-016 present
- [ ] CHK-002 [P0] Technical approach defined in plan.md — Technical Context, ADR-001 through ADR-004 present
- [ ] CHK-003 [P1] Dependencies identified and available — 004's repaint state, 002's findings-ledger.md, 003's applicator/sentinel contract, and the chart's checker/mutation-suite/CI files all read and cited
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks — the checker and mutation suite follow the chart scripts' own CommonJS style; no new lint config introduced
- [ ] CHK-011 [P0] No console errors or warnings — the checker prints `RESULT: PASSED` or `RESULT: FAILED` and a matching exit code, mirroring the chart's own contract
- [ ] CHK-012 [P1] Error handling implemented — a family whose input file is missing or malformed fails closed and names the file, rather than crashing the whole run (T004-T016)
- [ ] CHK-013 [P1] Code follows project patterns — no comment in `check-diagram-corpus.cjs`, `corpus-mutations.test.cjs`, or `diagram-corpus.yml` embeds a task id, finding id, ADR id, or REQ id (comment-hygiene hard block)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — AC-001 through AC-017 in acceptance-criteria.md
- [ ] CHK-021 [P0] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
- [ ] CHK-022 [P1] Edge cases tested — the self-comparison, comment-as-code, base-already-failing, exemption-outlives-family, and dual-scoped-file cases from spec.md §8 EDGE CASES each map to a mutation case, a refusal, or a completeness-triple check
- [ ] CHK-023 [P1] Every finding this node owns (F1.1, F1.2, F1.3, F1.4, F1.5, F1.6, F1.7, F1.8, F1.10, F3.1, F4.1, F4.3, F4.4, S1.1) appears in a task line above; the judged-boundary registration is recorded in T008 and goal.md's LOG
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This phase's `research_intent` is enforcement-layer construction, not `fix_bug` —
it builds the corpus's first checker, mutation suite and CI gate, it does not repair a known-bad
behavior. The finding-class/producer-inventory/adversarial-table apparatus does not apply.
Traceability is instead covered by CHK-023 above.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets — no script or workflow file this phase touches reads a credential or an environment variable
- [ ] CHK-031 [P0] Input validation implemented — the `no-external` family rejects any remote host beyond the one-entry `fonts.googleapis.com` allowlist, failing closed rather than silently passing an unrecognized host
- [ ] CHK-032 [P1] Auth/authz working correctly — not applicable; this is local tooling plus a public-repo CI workflow with no network or auth surface (NFR-S01, spec.md §7)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized — REQ ids in spec.md match task citations here and AC rows in acceptance-criteria.md
- [ ] CHK-041 [P1] Code comments adequate — the judged-boundary block and family assert functions carry plain-prose comments; no ephemeral id added anywhere (verified by CHK-013)
- [ ] CHK-042 [P2] README updated (if applicable) — not applicable this phase; `scripts/README.md` documents the existing hand-run scripts and is unmodified by this phase's addition of the checker
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only — this authoring pass created no temp files; mutation fixtures live under `scripts/tests/fixtures/`, a committed directory, not a scratch artifact
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

- [ ] CHK-100 [P0] Architecture decisions documented in plan.md — ADR-001 through ADR-004 present; this packet has no separate decision-record.md file (see spec.md RELATED DOCUMENTS)
- [ ] CHK-101 [P1] All ADRs have status — ADR-001, ADR-002, ADR-003, ADR-004 are all `Accepted`
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale — each ADR's "Alternatives Rejected" section is filled
- [ ] CHK-103 [P2] Migration path documented (if applicable) — not applicable; this phase adds a new gate, it does not migrate existing data
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

Not applicable. NFR-P01 (spec.md §7) states no runtime performance target applies beyond
`node --test`'s own default runner behavior against a small, static corpus. CHK-110 through
CHK-113 are recorded here as not applicable rather than left as unverifiable placeholder rows.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested — plan.md §7 ROLLBACK PLAN and §L2 ENHANCED ROLLBACK
- [ ] CHK-121 [P0] Feature flag configured (if applicable) — not applicable; no runtime feature ships from this phase
- [ ] CHK-122 [P1] Monitoring/alerting configured — not applicable; GitHub Actions' own run history is the monitoring surface for the new CI workflow
- [ ] CHK-123 [P1] Runbook created — plan.md's Implementation Phases plus this tasks.md serve as the runbook for 006 to read
- [ ] CHK-124 [P2] Deployment runbook reviewed — pending T001's corpus-state confirmation (see goal.md LOG)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

Not applicable. This phase handles no third-party dependency beyond the already-vetted Node.js
test runner and the already-allowlisted Google Fonts link its own `no-external` family asserts, no
user data, and no OWASP-relevant surface. CHK-130 through CHK-133 are recorded here as not
applicable.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized — spec.md, plan.md, tasks.md, acceptance-criteria.md, goal.md, implementation-summary.md cross-reference consistently
- [ ] CHK-141 [P1] API documentation complete (if applicable) — not applicable; no API surface, only hand-run CLI tooling and a CI workflow
- [ ] CHK-142 [P2] User-facing documentation updated — the judged-boundary block inside `check-diagram-corpus.cjs` is the user-facing documentation this phase produces for 006 to read; tracked in Files to Change
- [ ] CHK-143 [P2] Knowledge transfer documented — plan.md's Architecture and ADR sections plus this tasks.md serve as the knowledge-transfer record for 006
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Human reviewer | Local mutation-suite read, CI run read, no-backlog confirmation (T023, T024) | [ ] Approved | |
| GLM-5.3-Flash executor (cli-pi, DevPass) | Mechanical build execution (T001-T022) | [ ] Approved | |
| Opus xhigh orchestrator | Phase-doc authorship review (D11) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
