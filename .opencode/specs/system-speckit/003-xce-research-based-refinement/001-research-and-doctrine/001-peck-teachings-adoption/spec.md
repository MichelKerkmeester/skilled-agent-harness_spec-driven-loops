---
title: "Feature Specification: Adopt peck teachings into system-spec-kit (README-pass T1-T4 + source-pass T5-T10)"
description: "Phase parent for adopting peck-derived improvements into system-spec-kit across two research passes: the 2026-06-02 README analysis (T1-T4) and the research/006 source-mining pass (T5-T10 plus the now-adopted T1 coverage gate). Sequenced as seven independently executable child phases; UX and automation are top priorities for the source-pass phases; warn-then-error rollout."
trigger_phrases:
  - "001-peck-teachings-adoption"
  - "peck adoption"
  - "phase parent"
  - "peck verification discipline"
  - "acceptance coverage gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All seven peck-adoption child phases shipped (README T1-T4 + source-pass T5-T10)"
    next_safe_action: "Resume or validate a child phase folder if further work is needed"
    blockers: []
    key_files:
      - "spec.md"
      - "002-self-check-templates/spec.md"
      - "005-reviewer-prompt-benchmark-substrate/spec.md"
      - "006-peck-verification-discipline/spec.md"
      - "007-acceptance-coverage-gate/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-001-peck-adoption-source-phases"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Adopt peck teachings into system-spec-kit (README-pass T1-T4 + source-pass T5-T10)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-02 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | 003-xce-research-based-refinement |
| **Handoff Criteria** | Each phase ships and passes validation independently; the source-pass rules (006/007) ship warn-first and are regression-tested against phase 005 fixtures before enforcing |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two peck research passes inform this packet. The 2026-06-02 README analysis (child phase 001) found four philosophy-neutral mechanisms (T1-T4); the research/006 source-mining pass (cross-model verified) found a further set in peck's agent prompts and benchmark harness (T5-T10) and produced a concrete, now-adoptable design for the T1 coverage gate that the README pass had deferred. All of these adopt peck mechanisms into the same spec-kit verification/quality surfaces, so they belong in one phase-parent that sequences them without duplicating implementation detail.

### Purpose
Ship the peck-derived improvements as seven independently executable phases: the three lowest-risk README teachings (T3/T4/T2) and the source-pass program (a reviewer-prompt benchmark substrate, a five-rule verification-discipline bundle, and the acceptance-criteria coverage gate). The source-pass phases reuse existing surfaces with warn-first messages, treat UX and automation as the top two priorities, and add zero new infrastructure.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, decisions, and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- README-pass teachings T3 (self-check templates), T4 (current-state discipline), T2 (constitutional rule review).
- Source-pass program: reviewer-prompt benchmark substrate (T10), verification-discipline bundle (T5-T9: completion-freshness, escalation, anti-softening, reviewer read-budget, numeric-severity note), and the acceptance-criteria coverage gate (T1).
- Per-phase implementation details in child folders; phase routing, dependency visibility, and warn-then-error rollout sequencing.

### Out of Scope
- Detailed per-phase implementation plans at the parent level.
- The re-confirmed anti-teachings: literal `score>=4 blocks`, empty-commit verdict ledger, branch-per-story checkout, blanket cheap-model gating, automatic constitutional deletion.
- The 027 memory phases (002-008 at the parent track) — orthogonal to this peck program.

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `templates/manifest/{spec,plan,checklist}.md.tmpl` | Modify | 002, 007 | Self-check blocks (002); AC-format + AC traceability table (007) |
| `scripts/rules/` + `validator-registry.json` | Modify | 003, 007 | Advisory current-state rule (003); `AC_COVERAGE` rule (007) |
| `constitutional/*.md` + review diagnostic | Modify/Create | 004 | Last-confirmed metadata + review surface |
| `.opencode/skills/deep-improvement/**` | Modify/Create | 005 | Reviewer-prompt fixture type + scorer (Lane B substrate) |
| `CLAUDE.md`/`AGENTS.md`, `validate.sh`, `continuity-freshness.ts`, `spec-doc-structure.ts`, `sk-code`/`deep-review`/`@review` (+ `.claude` mirrors) | Modify | 006 | Completion-freshness + escalation + anti-softening + read-budget + numeric note |
| `deep-review/SKILL.md` + YAMLs, `mcp_server/ENV_REFERENCE.md` | Modify | 006, 007 | Verdict binding + feature flags (warn-then-error) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-peck-teachings-for-spec-kit/ | Source analysis (README pass): peck teachings vs spec-kit gaps; defines teachings T1-T4. | Complete |
| 2 | 002-self-check-templates/ | Self-check + failure-mode guidance in the spec/plan/checklist manifest templates (T3). | Complete |
| 3 | 003-current-state-discipline/ | Broaden the current-state-only content rule beyond phase parents, advisory severity (T4). | Complete |
| 4 | 004-constitutional-rule-review/ | Read-only review surface listing constitutional rules with last-confirmed metadata (T2). | Complete |
| 5 | 005-reviewer-prompt-benchmark-substrate/ | Reviewer-prompt fixture type + scorer in deep-improvement Lane B (T10) — the source-pass test substrate; lands first among 5-7. | Complete |
| 6 | 006-peck-verification-discipline/ | Completion-freshness + escalation + anti-softening + reviewer read-budget + numeric-severity note (T5-T9). | Complete |
| 7 | 007-acceptance-coverage-gate/ | Acceptance-criteria coverage gate (T1, now adopted): AC-format normalization + AC traceability table + `AC_COVERAGE` rule, warn-then-error. | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins.
- Source-pass order: phase 005 (benchmark substrate) lands first; 006 and 007 rules are regression-tested against its fixtures before any ERROR promotion.
- Phase 007's template work shares `spec.md.tmpl`/`checklist.md.tmpl` with phase 002 — land 002 first or coordinate the edit window.
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-peck-teachings-for-spec-kit | 002-self-check-templates | Analysis complete; teachings T1-T4 identified with per-teaching verdicts. | Report present + strict-validated |
| 002-self-check-templates | 003 / 007 | Self-check blocks present in the templates; a freshly scaffolded folder still passes strict validation. | `validate.sh --strict` on a throwaway scaffold |
| 005-reviewer-prompt-benchmark-substrate | 006 / 007 | Reviewer fixture type + scorer + seed fixtures (stale-verdict, softened-Fail, over-read, AC-coverage) exist; 006/007 rules are regression-tested before ERROR promotion. | Lane B reviewer fixtures green |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- RESOLVED (phase 001 research): the README-pass order T3 → T4 → T2 is risk-based and the phases are technically independent. Per-phase decisions are folded into the child specs.
- RESOLVED (research/006 + integration research 019-023): the T1 coverage gate is now adoptable as phase 007 with the prescribed two-verdict design (per-AC traceability table + a separate fresh-context deep-review reviewer), warn-only rollout, and per-level + lifecycle opt-in. Its AC-format normalization is a hard prerequisite and shares manifest templates with phase 002.
- Should the seven phases ship as one PR sequence or independent PRs (phase 005 first among the source-pass phases regardless)?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **README-pass analysis**: `001-peck-teachings-for-spec-kit/peck-teachings-analysis.md`.
- **Source-pass research**: `../research/006-peck-source-deep-mining/` — `research.md` (verdict matrix + cross-model), `sub-packet-proposal.md`, `integration-plan.md` (impact + UX + automation + rollout).
- **Graph Metadata**: See `graph-metadata.json` for the child phase pointers.
