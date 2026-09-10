---
title: "Tasks: Phase 2: skin-contract"
description: "Task Format: T### [P?] Description (file path) — executor: operator | GLM-5.3-Flash max via cli-pi (DevPass) | human review"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: skin-contract

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

**Task Format**: `T### [P?] Description (file path) — executor: X`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Reconciliation

- [ ] T001 Reconcile glm's 29 findings (F1.1-F4.6) against sonnet's disk verification into one fact base, with a verdict and node+task attribution for each (D10; S5.1) (findings-ledger.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Seven Contract Decisions

- [ ] T002 Adjudicate the 4px grid contradiction: `SKILL.md:403` yields to `:337`; sign the exemption list as font sizes plus a new derived-label-offset clause covering `example-flowchart.html`'s y=230/239/298/307 violations; record that font substitution cannot break the coordinate-based grid (F1.5, F1.10, S3.1) (goal.md) — executor: operator
- [ ] T003 [P] Sign the marker vocabulary ("define only what you draw," per file) and the id-uniqueness scope (unique per file), closing the 26/34 unprefixed `dots` id collision (F1.7) (goal.md) — executor: operator
- [ ] T004 [P] Sign the node markup convention (`data-diagram-node`; budgets count tagged nodes, not raw `<rect>` elements) and settle that `#eb6c36` and its `rgba(235,108,54,...)` spelling count as one coral element (F1.8) (goal.md) — executor: operator
- [ ] T005 [P] Sign token-source scope: promote `#3d4460` to a type-scoped role (used in exactly one type); record `#ffffff`'s 40-occurrence/13-file backend/API/step treatment role so it is never mistaken for a paper substitute (F1.9, F2.2, S2.1) (goal.md) — executor: operator
- [ ] T006 [P] Sign the self-contained bar: one whitelisted stylesheet host (`fonts.googleapis.com`); record that fallback chains already ship and no exception precedent exists to port; decide `assets/icons.html` is in-corpus for the allowlist but out of the counted 34-example/4-template sets (F1.4, F3.1, S3.2) (goal.md) — executor: operator
- [ ] T007 Specify the derivation record's shape: three lists (light/dark/terminal), four kinds (primary/derived/fixed, plus a new `untokenized` kind for `example-sequence-oauth-dark.html`); retire the warm `rgba(28,25,23,...)` inversion rule (0/34 on disk); record the accent's light-to-dark shift as two hand-picked verbatim values, not a formula (F2.4, F3.6, S2.3) (goal.md, plan.md ADR-003) — executor: operator
- [ ] T008 Sign the emphasis/gates mapping: the accent's 2.863:1 is a recorded departure, not a re-derivation (plan.md ADR-001); `soft` (3.48:1) may not carry sublabel/eyebrow text; connectors are structure (ungated) unless accent-painted (plan.md ADR-002) (F2.5, F3.7) (goal.md, plan.md ADR-001, ADR-002) — executor: operator
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Mechanical Fixes & Locus Collapse

- [ ] T009 [P] Record the pin-discipline inheritance: derivation record carries a reference path plus a sha256 (style-guide.md's current hash, pinned at authoring time: `e28789b22979472537d437e91fda6edd70ecb55be39e131b3e4ab4e4bece9a81`); no second carried Style Reference; the 34 examples stay the exemplar set (F3.5) (goal.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T010 [P] Collapse five disagreeing version loci (`SKILL.md:5`, `style-guide.md:14`, `manual-testing-playbook.md:4`, `README.md:7`, `feature-catalog.md:11`) to `SKILL.md`'s frontmatter field as the single surviving locus (F4.3) (.opencode/skills/sk-design/sk-design-diagram/SKILL.md, references/foundations/style-guide.md, manual-testing-playbook/manual-testing-playbook.md, README.md, feature-catalog/feature-catalog.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T011 [P] Fix `diagram.md:67`'s stale `create-diagram-auto.yaml`/`create-diagram-confirm.yaml` names to the real asset names (`diagram-auto.yaml`/`diagram-confirm.yaml`, already correct at lines 25-26 and 50-51); move ownership from `sk-doc` (SKILL.md:10, both command YAMLs) to `sk-design`, matching `mode-registry.json:89-110`'s actual registration (F4.6) (.opencode/commands/design/diagram.md, .opencode/skills/sk-design/sk-design-diagram/SKILL.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T012 Designate one canonical locus for the accessible-SVG contract statement in SKILL.md (the output-contract bullet at :406); collapse the other two restatements to cross-references (F4.5's decision slice; the 12.6% pseudocode extraction and the rest of the duplicate sweep stay 004's work) (.opencode/skills/sk-design/sk-design-diagram/SKILL.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
- [ ] T013 [P] Document the fallback chains that already ship (template.html:15-17 and its three siblings; every inline SVG font-family) in style-guide.md's typography table (§2) (F3.2) (.opencode/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md) — executor: GLM-5.3-Flash max via cli-pi (DevPass)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Every finding id in `findings-ledger.md`'s node-002 rows appears in a task line above
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

- [ ] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-013 present
- [ ] CHK-002 [P0] Technical approach defined in plan.md — Technical Context, ADR-001 through ADR-003 present
- [ ] CHK-003 [P1] Dependencies identified and available — findings-ledger.md (T001) and parent goal.md read and cited
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Document Quality

- [ ] CHK-010 [P0] No bracketed placeholder (`[word]`) remains in any of the seven authored documents
- [ ] CHK-011 [P0] Every `<!-- ANCHOR:x -->`/`<!-- /ANCHOR:x -->` pair is intact and correctly nested
- [ ] CHK-012 [P1] Every decision row in goal.md cites the parent decision id (D1-D12) it refines
- [ ] CHK-013 [P1] No code snippet in any document embeds a task id, finding id, ADR id, or REQ id in a comment (comment-hygiene hard block)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Verification Checklist (Docs)

- [ ] CHK-020 [P0] All thirteen acceptance criteria (AC-001 through AC-013) have a real Verification cell — no bracketed placeholder
- [ ] CHK-021 [P0] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
- [ ] CHK-022 [P1] Every one of the sixteen findings this node resolves (F1.4, F1.5, F1.7, F1.8, F1.9, F2.2, F2.4, F2.5, F3.1, F3.2, F3.5, F3.6, F3.7, F4.3, F4.5, F4.6) plus the sonnet additions (S2.1, S2.3, S3.1, S3.2, S5.1, S5.2) appears in a task line above
- [ ] CHK-023 [P1] The findings this node hands off (F1.1, F1.2, F1.3, F1.6, F1.10 partial, F2.1, F2.3, F2.6, F3.3, F3.4, F4.1, F4.2, F4.4, S1.1, S4.1, S4.3, IT5-MUT, IT5-CI) are named in findings-ledger.md with their destination node — not silently dropped
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This phase's `research_intent` is decision-signing, not `fix_bug`; the finding-class/producer-inventory/adversarial-table apparatus does not apply to a phase that ships no code. Traceability is instead covered by CHK-022/CHK-023 above (every finding id maps to a task or a named destination node).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

Not applicable (NFR-S01, spec.md §7). This phase has no auth, input-validation, or secrets
surface — it writes documents. CHK-030 through CHK-032 are skipped with this reason recorded,
rather than left as unverifiable placeholder rows.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized — REQ ids in spec.md match task citations in tasks.md and AC rows in acceptance-criteria.md
- [ ] CHK-041 [P1] N/A — no code comments in this phase; comment-hygiene is verified instead by CHK-013 above
- [ ] CHK-042 [P2] README updated (if applicable) — Not applicable; this phase produces no package-level README
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only — this phase created no temp files
- [ ] CHK-051 [P1] scratch/ cleaned before completion — not applicable; nothing was added to scratch/ by this authoring pass
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 0/6 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-10
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented — plan.md's `L3: ARCHITECTURE DECISION RECORD` section (ADR-001 through ADR-003); this packet has no separate decision-record.md file (see spec.md RELATED DOCUMENTS)
- [ ] CHK-101 [P1] All ADRs have status — ADR-001, ADR-002, ADR-003 are all `Accepted`
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale — each ADR's "Alternatives Rejected" section is filled
- [ ] CHK-103 [P2] Migration path documented (if applicable) — not applicable; this phase changes no shipped artifact directly
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

Not applicable. NFR-P01 (spec.md §7) states no runtime performance target applies to a
documentation phase. CHK-110 through CHK-113 are recorded here as not applicable rather than left
as unverifiable placeholder rows.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and tested — plan.md §7 ROLLBACK PLAN and §L2 ENHANCED ROLLBACK
- [ ] CHK-121 [P0] Feature flag configured (if applicable) — not applicable; no runtime feature ships from this phase
- [ ] CHK-122 [P1] Monitoring/alerting configured — not applicable
- [ ] CHK-123 [P1] Runbook created — plan.md's Implementation Phases plus this tasks.md serve as the runbook for 003-006 to read
- [ ] CHK-124 [P2] Deployment runbook reviewed — pending operator ratification of T002-T008 (see goal.md LOG)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

Not applicable. This phase handles no third-party dependencies, no user data, and no OWASP-relevant
surface — it writes documents that a later phase applies to skill files. CHK-130 through CHK-133
are recorded here as not applicable.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized — spec.md, plan.md, tasks.md, acceptance-criteria.md, goal.md, findings-ledger.md, implementation-summary.md cross-reference consistently
- [ ] CHK-141 [P1] API documentation complete (if applicable) — not applicable; no API surface
- [ ] CHK-142 [P2] User-facing documentation updated — not applicable; this is an internal skill-contract phase
- [ ] CHK-143 [P2] Knowledge transfer documented — findings-ledger.md and goal.md's LOG serve as the knowledge-transfer record for 003-006
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Decision sign-off (T002-T008) | [ ] Approved | |
| GLM-5.3-Flash executor (cli-pi, DevPass) | Mechanical fix execution (T001, T009-T013) | [ ] Approved | |
| Opus xhigh orchestrator | Phase-doc authorship review (D11) | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

