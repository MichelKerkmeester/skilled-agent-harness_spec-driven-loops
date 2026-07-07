---
title: "Feature Specification: deep-loop-runtime doc-remediation (001-doc-remediation)"
description: "Close all 36 findings from the parent packet's Phase 5 deep-research loop. 4 cli-devin SWE-1.6 RCAF batches: Batch A consolidated cleanup, Batch B description-drift sweep, Batch C council surface expansion, Batch D test coverage. Ships deep-loop-runtime at v1.2.0."
trigger_phrases:
  - "deep-loop-runtime doc remediation"
  - "001-doc-remediation"
  - "phase 5 backlog closure"
  - "council surface expansion"
  - "cross-arc citation drift fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/000-release-cleanup/002-deep-loop-runtime-doc-remediation"
    last_updated_at: "2026-05-23T22:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-spec-authored"
    next_safe_action: "author-remaining-phase-1-artifacts-then-dispatch-batch-a"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
      - "schemas/audit-finding.schema.json"
      - "schemas/changelog-entry.schema.json"
      - "schemas/validation-report.schema.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000131000601"
      session_id: "131-000-001-001-doc-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Scope: all 4 batches in one packet (operator chose Doc + test coverage)"
      - "SC-007 partial relaxation: tests/ writes permitted; lib/scripts/storage/deep-review reduce-state prohibition stays"
      - "Executor: cli-devin SWE-1.6 RCAF for all 4 batches"
      - "Documentation level: 2 (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md + extras)"
      - "Placement: child of 001-deep-loop-runtime (turns parent into phase parent under CLAUDE.md tolerant policy)"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

# Feature Specification: deep-loop-runtime doc-remediation

---

## EXECUTIVE SUMMARY

The parent packet's Phase 5 deep-research loop surfaced 36 unique findings (0 P0 / 23 P1 / 13 P2) across 7 transverse patterns. Zero overlap with the 21 Phase-2 audit findings — these are factual content drift the audit-and-validate phases missed. Three of the highest-impact findings were introduced or propagated by the Phase 3 README rewrite itself (`code-surface` fabrication, `129/001 ADR-001` mis-citation echoed into the new changelog, 22-vs-27 vitest count drift).

This packet closes all 36 findings via 4 cli-devin SWE-1.6 RCAF dispatch batches, ships `deep-loop-runtime` at v1.2.0, and lifts the SC-007 boundary partially to permit `tests/` writes for the test-coverage gaps (lib/scripts/storage/reduce-state prohibition stays hard).

**Key Decisions**: Level 2 doc set; 4-batch sequencing A→B→C→D one-at-a-time; SC-007 relaxed for tests/ only; cli-devin SWE-1.6 with RCAF + medium-density pre-planning per `cli-devin/SKILL.md` §3.

**Critical Dependencies**: Replacement-string packages from parent `research/iterations/iteration-007.md` §C + `iteration-009.md` are load-bearing for Batch A; sk-doc `feature_catalog_creation.md` + `manual_testing_playbook_creation.md` templates are load-bearing for Batch C.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-23 |
| **Last Updated** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Packet** | `skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/001-deep-loop-runtime` (turns into phase parent under tolerant policy) |
| **Sibling Packets** | `../002-deep-research`, `../003-deep-review`, `../004-deep-ai-council`, `../005-deep-agent-improvement` (peer skill cleanups) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After the parent packet's Phase 1-5 release cleanup, 36 P1/P2 documentation findings remain open in `findings/audit-findings.jsonl` extension (DR-001..DR-037, with DR-037 superseding DR-029). They cluster into 4 distinct remediation surfaces: (a) cross-doc consistency + cross-arc citations + schema-doc fabrications (~22 findings, single largest cluster), (b) description drift in 3-of-7-sampled feature_catalog entries with 43% prevalence projected to the unchecked 14, (c) council surface absent from catalog/playbook despite being mandatory per `131/001/008 ADR-001` Runtime Boundary Decision, (d) zero test coverage on 2 lib/coverage-graph modules + weak coverage on 2 lib/council modules.

### Purpose

Close all 36 findings, ship `deep-loop-runtime` v1.2.0 as a release-ready peer-runtime skill, and re-establish factual + structural conformance between SKILL.md, README.md, references/, feature_catalog/, manual_testing_playbook/, graph-metadata.json, and source code. Validate via `validate.sh --strict` exit 0 on both this packet and the parent (tolerant phase-parent policy), `pnpm vitest run` exit 0 on the 4 new/updated test files, and `git diff --stat` confirming the SC-007 boundary held everywhere except `tests/` (where Batch D writes).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- All 36 parent-packet findings (DR-001..DR-037) closed via 4 cli-devin SWE-1.6 RCAF batches
- `SKILL.md` cross-arc citation fixes + version bump 1.1.0 → 1.2.0
- `README.md` cross-doc count fixes + cross-arc citation fixes + node-kind fabrication fix
- `changelog/v1.1.0.0.md` cross-arc citation fix + NEW `changelog/v1.2.0.0.md` per `changelog-entry.schema.json`
- `graph-metadata.json` domains + key_topics + key_files + entities + related_to + causal_summary + source_docs updates
- `references/integration_points.md` 7 hidden-consumer additions
- `references/coverage_graph_schema.md:36` review-node-kind fix
- `lib/README.md:31` sub-readme link omission
- 17 feature_catalog entries reviewed against source JSDoc; minimal description fixes where drift exists
- NEW `feature_catalog/08--council/` index + 5 per-feature entries (5 council modules)
- NEW `manual_testing_playbook/08--council/` index + 5 per-scenario files
- Catalog + playbook root index updates for new domain 08
- NEW `tests/unit/coverage-graph-query.vitest.ts` + `tests/unit/coverage-graph-signals.vitest.ts`
- UPDATED `tests/council/multi-seat-dispatch.vitest.ts` + `round-state-jsonl.vitest.ts` (assertion deepening)
- Final `skill_graph_compiler.py --export-json --pretty` re-run

### Out of Scope

- Edits to `lib/`, `scripts/`, `storage/` of `deep-loop-runtime/` (SC-007 hard-prohibited)
- Edits to `deep-review/scripts/reduce-state.cjs` (DR-023 tighter SC-007 boundary stays)
- Smart Router (SKILL.md §2) — UNTOUCHED unless a finding cascade forces it (ADR-007 reservation continues from parent packet)
- `assets/` directory creation — still ABSENT_BY_DESIGN per parent ADR-003
- Cross-arc references in OTHER packets (e.g. `131/001/009/implementation-summary.md` legacy 129 ref noted in parent open question #3 — defer to cross-packet hygiene follow-on)
- README HVR-voice rewrite — Phase 3 already shipped 0-violation README; Batch A surgical edits stay HVR-compliant by construction

### Files Changed

| File Path | Change Type | Batch |
|-----------|-------------|-------|
| `001-doc-remediation/spec.md` + plan.md + tasks.md + checklist.md + decision-record.md + implementation-summary.md | Create | Phase 1 |
| `001-doc-remediation/description.json` + `graph-metadata.json` | Create | Phase 1 |
| `001-doc-remediation/schemas/*.json` | Create (copy from parent) | Phase 1 |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Modify (cross-arc citations + version bump 1.1.0→1.2.0) | A + Phase 3 |
| `.opencode/skills/deep-loop-runtime/README.md` | Modify (counts + cross-arc citations + node-kind fix + STRUCTURE tree) | A + C |
| `.opencode/skills/deep-loop-runtime/changelog/v1.1.0.0.md` | Modify (cross-arc citation L63) | A |
| `.opencode/skills/deep-loop-runtime/changelog/v1.2.0.0.md` | Create | Phase 3 |
| `.opencode/skills/deep-loop-runtime/graph-metadata.json` | Modify | A |
| `.opencode/skills/deep-loop-runtime/references/integration_points.md` | Modify | A |
| `.opencode/skills/deep-loop-runtime/references/coverage_graph_schema.md` | Modify (L36 prose) | A |
| `.opencode/skills/deep-loop-runtime/lib/README.md` | Modify (L31 sub-readme link) | A |
| `.opencode/skills/deep-loop-runtime/feature_catalog/0{1..7}--*/0{1..4}-*.md` | Modify (drift fixes only) | B |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/0{1..7}--*/0{01..17}-*.md` | Modify (OVERVIEW drift fixes only) | B |
| `.opencode/skills/deep-loop-runtime/feature_catalog/feature_catalog.md` | Modify (add §8 + coverage row) | C |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/manual_testing_playbook.md` | Modify (add §13 + coverage row + TOC) | C |
| `.opencode/skills/deep-loop-runtime/feature_catalog/08--council/` | Create (index + 5 features) | C |
| `.opencode/skills/deep-loop-runtime/manual_testing_playbook/08--council/` | Create (index + 5 scenarios) | C |
| `.opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-query.vitest.ts` | Create | D |
| `.opencode/skills/deep-loop-runtime/tests/unit/coverage-graph-signals.vitest.ts` | Create | D |
| `.opencode/skills/deep-loop-runtime/tests/council/multi-seat-dispatch.vitest.ts` | Modify (assertion deepening) | D |
| `.opencode/skills/deep-loop-runtime/tests/council/round-state-jsonl.vitest.ts` | Modify (assertion deepening) | D |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | New packet passes `validate.sh --strict` | Exit 0 after every phase |
| REQ-002 | Parent `001-deep-loop-runtime/` passes `validate.sh --strict` (tolerant phase-parent policy) | Exit 0 |
| REQ-003 | SC-007 invariant preserved EXCEPT for `tests/` (Batch D scope) | `git diff --stat -- '.opencode/skills/deep-loop-runtime/lib/' '.../scripts/' '.../storage/' '.opencode/skills/deep-review/scripts/reduce-state.cjs'` empty |
| REQ-004 | Batch D test runs exit 0 | `pnpm vitest run` on the 4 test files passes |
| REQ-005 | Smart Router (SKILL.md §2) preserved unless cascade | If touched, ADR-007 added with rationale |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | All 36 findings either resolved (`status: resolved`) or deferred with rationale in tasks.md | Per-row evidence ref or deferral_rationale |
| REQ-011 | README HVR score stays ≥85 post-Batch-A edits | `validate_document.py --type readme` exit 0; no new banned phrases |
| REQ-012 | `skill_graph_compiler.py --export-json --pretty` re-run after `graph-metadata.json` edit | Compiler exit 0 + skill-graph.json refreshed |
| REQ-013 | SKILL.md frontmatter version bumped 1.1.0 → 1.2.0 | `grep '^version:' SKILL.md` returns `1.2.0` |
| REQ-014 | `changelog/v1.2.0.0.md` authored per schema | `audit_finding_refs` cites DR-001..DR-037 + AF refs |
| REQ-015 | Pre-dispatch reads of `cli-devin/SKILL.md` + `sk-prompt-models/SKILL.md` recorded per batch | Per CLAUDE.md CLI dispatch rule + small-model dispatch rule |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict validate exits 0 on both new packet AND parent after every batch.
- **SC-002**: All 36 findings closed (or explicitly deferred with rationale).
- **SC-003**: SC-007 partial-relaxation holds: zero edits to `lib/`, `scripts/`, `storage/`, `deep-review/scripts/reduce-state.cjs`; tests/ edits limited to the 4 named files.
- **SC-004**: `pnpm vitest run` exits 0 on the 4 Batch D test files; combined test count (coverage-graph-query + coverage-graph-signals + multi-seat-dispatch + round-state-jsonl) ≥ 20 tests.
- **SC-005**: README HVR score ≥85 post-Batch-A (no regression from Phase 3 baseline of 0 issues).
- **SC-006**: `skill_advisor.py "deep-loop-runtime" --threshold 0.8` still surfaces the skill after skill-graph compile.
- **SC-007**: Council surface present in catalog (08--council/) + playbook (08--council/) + graph-metadata.json + SKILL.md + README.md per ADR-001 mandate.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-devin SWE-1.6 dispatch unreliability under repeated invocation | Medium | One-at-a-time, SIGKILL between (memory `feedback_deep_loop_iter_one_at_a_time`) |
| Risk | cli-devin bundle hallucination | Medium | Per-batch bundle gate: grep imports + smoke-run validation commands (memory `feedback_bundle_gate_smoke_run`) |
| Risk | Batch C template freelancing (12 new files) | Medium | Prompt-pack pastes sk-doc templates verbatim; per-file `validate_document.py` after Batch C |
| Risk | Batch D scope creep into `lib/` | High | Per-batch `git diff --stat` filter check that ONLY `tests/` is touched outside docs |
| Risk | Skill-graph compiler stale | Low | Phase 3 step always runs `skill_graph_compiler.py --export-json --pretty` |
| Risk | README HVR regression from Batch A | Low | `validate_document.py --type readme` in Phase 3; revert if score drops below 85 |
| Risk | Phase-parent tolerant policy edge cases | Low | Phase 1 strict validate runs on PARENT folder too |
| Dependency | Replacement-string packages in parent iter-007.md + iter-009.md | Critical | Read at Batch A composition time; verified present at plan time |
| Dependency | sk-doc templates `feature_catalog_creation.md` + `manual_testing_playbook_creation.md` | Critical for Batch C | Verified present |
| Dependency | `cli-devin` binary + license alive | Critical | Pre-flight `devin --version` (verified 2026.5.6-12) |
| Dependency | `validate_document.py` + `validate.sh --strict` + `skill_graph_compiler.py` | Critical | All verified present from parent packet |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Per-batch cli-devin dispatch wall-clock ≤ 8 min (90s baseline from Phase 5 + headroom for write-heavy batches).
- **NFR-P02**: Strict validator completes in <10s per spec-folder invocation.

### Security
- **NFR-S01**: No secrets in any spec-folder file; cli-devin prompt-packs do not embed credentials.

### Reliability
- **NFR-R01**: SC-007 invariant verified per batch (not just at packet close).
- **NFR-R02**: Every batch's stdout + stderr captured to `logs/batch-{X}-{stdout,stderr}.txt` for forensic trace.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Batch B finds zero drifts in the 14 unchecked entries**: project the prevalence estimate down; document in research follow-up rather than escalate
- **Batch D test failure**: roll back the offending test file via `git checkout`; document gap in tasks.md; do NOT touch `lib/` to "fix the test"
- **Bundle gate catches cli-devin hallucination**: reject the batch output; recompose prompt with tighter ground-truth pre-pass; re-dispatch once; escalate after second failure
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | 36 findings; ~28 doc files; 12 new files; 4 test writes |
| Risk | 8/25 | SC-007 partial relaxation; Batch C template-freelance risk; cli-devin dispatch discipline |
| Research | 2/20 | Inputs already complete from parent Phase 5 |
| Multi-Agent | 4/15 | 4 cli-devin batches; one executor; one-at-a-time discipline |
| Coordination | 4/15 | Sequential batches with per-batch SC-007 + strict-validate gates |
| **Total** | **30/100** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. USER STORIES

### US-001: Senior skill maintainer closes the Phase 5 backlog (P0)

**As a** senior skill maintainer, **I want** all 36 Phase 5 findings closed in one consolidated packet, **so that** `deep-loop-runtime` ships v1.2.0 as the release-ready substrate for downstream 131 arc work.

**Acceptance Criteria**:
1. Strict validate exits 0 on the new packet AND parent at packet close.
2. SC-007 invariant verified: only `tests/` (4 files) + doc files modified inside `deep-loop-runtime/`.
3. `skill_advisor.py` still surfaces the skill at threshold 0.8.
4. Council surface present in catalog + playbook + graph-metadata.

---

<!-- ANCHOR:questions -->
## 11. OPEN QUESTIONS

- None at Phase 1 planning. All scope decisions resolved during ExitPlanMode approval (full 4-batch scope with SC-007 partial relaxation).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Schemas**: `schemas/*.json`
- **Parent**: `../spec.md` (001-deep-loop-runtime)
- **Parent Phase 5 synthesis**: `../research/research.md` §9 + §11 + §13
- **Replacement-string source**: `../research/iterations/iteration-007.md` §C + `../research/iterations/iteration-009.md`
- **Authoritative ADR for council scope**: `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/008-iterative-research-and-architecture/decision-record.md` ADR-001
- **Executor SKILL.md**: `.opencode/skills/cli-devin/SKILL.md` (mandatory pre-read)
- **Small-model dispatch matrix**: `.opencode/skills/sk-prompt-models/SKILL.md` (mandatory pre-read)
- **sk-doc templates**: `.opencode/skills/sk-doc/references/feature_catalog_creation.md` + `manual_testing_playbook_creation.md`
- **HVR rules**: `.opencode/skills/sk-doc/references/global/hvr_rules.md`
- **Sibling pattern**: `.opencode/specs/skilled-agent-orchestration/z_archive/082-sk-doc-skill-readme-and-structure/005-deep-review-p1-p2-remediation/` (Level 2 remediation template)
