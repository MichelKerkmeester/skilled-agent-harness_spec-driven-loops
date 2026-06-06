---
title: "Peck-Source Adoption (Phase Parent)"
description: "Phase-parent for adopting the peck-source deep-mining recommendations (research 006) into spec-kit's verification + acceptance surfaces: a reviewer-prompt benchmark substrate, a five-rule verification-discipline bundle, and the revived acceptance-criteria coverage gate. UX and automation are top priorities; zero new infrastructure; warn-then-error rollout."
trigger_phrases:
  - "027 phase 009"
  - "peck source adoption"
  - "peck verification discipline"
  - "acceptance coverage gate"
  - "reviewer prompt benchmark"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/009-peck-source-adoption"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Consolidated 009/010/011 into one phase-parent with 3 phases (001/002/003)"
    next_safe_action: "Plan/implement phase 001 (reviewer-benchmark substrate) first"
    blockers: []
    key_files:
      - "spec.md"
      - "001-reviewer-prompt-benchmark-substrate/spec.md"
      - "002-peck-verification-discipline/spec.md"
      - "003-acceptance-coverage-gate/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-009-peck-source-adoption-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Peck-Source Adoption (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
| **Source** | research/006-peck-source-deep-mining (research.md + sub-packet-proposal.md + integration-plan.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The peck-source deep-research pass (research 006, cross-model verified) found a set of verification/acceptance mechanisms peck implements in its agent prompts and benchmark harness that spec-kit lacks. They share two anchors — the completion gate and deep-improvement Lane B — and have a strict rollout order (the benchmark substrate must exist before the rules it tests can promote to enforcing). They need a parent control document that points to child phases without duplicating implementation detail.

### Purpose
Coordinate the three phases so each can be planned, implemented, and validated independently while the parent keeps the phase map, dependency order, and high-level outcome visible. The unifying outcome: spec-kit verification becomes **content-fresh, non-softenable, and acceptance-coverage-aware** — every rule reusing an existing surface, shipping warn-first, with UX and automation as the top two priorities and zero new infrastructure.

> **Phase-parent note:** This spec.md is the only REQUIRED authored document at the parent level. All detailed planning, tasks, checklists, decisions, and continuity live inside the child phase folders in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The reviewer-prompt benchmark substrate (the regression test-bench), the five-rule verification-discipline bundle (completion-freshness, escalation, anti-softening, reviewer read-budget, numeric-severity note), and the acceptance-criteria coverage gate (AC-format normalization + traceability table + AC_COVERAGE rule).
- Phase routing, dependency visibility (phase 001 is the test substrate for 002 and 003), and the warn-then-error rollout sequencing.

### Out of Scope
- Implementation at the parent level (each phase carries its own plan/tasks).
- Any change to the 027 memory phases (002-008) — this program is orthogonal to them.
- The deferred items: literal `score>=4 blocks` (rejected), blanket cheap-model gating, and constitutional auto-deletion — tracked as anti-teachings, not phases.

### Files to Change
Aggregate file scope; per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/deep-improvement/assets/model-benchmark/**`, `scripts/model-benchmark/lib/**` | Create/Modify | 001 | Reviewer-prompt fixture type + reviewer scorer (Lane B substrate) |
| `CLAUDE.md`/`AGENTS.md` §2, `constitutional/verify-before-completion-claims.md`, `scripts/spec/validate.sh`, `scripts/validation/continuity-freshness.ts`, `mcp_server/lib/validation/spec-doc-structure.ts` | Modify | 002 | Completion-verdict freshness + anti-softening |
| `.opencode/skills/sk-code/SKILL.md`, `deep-review/SKILL.md` + YAMLs, `.opencode/agents/*` (+ `.claude/agents/*` mirrors), `sk-code-review` | Modify | 002 | Escalation gates, reviewer read-budget, numeric-severity note |
| `templates/manifest/{spec,checklist}.md.tmpl`, `references/validation/validation_rules.md`, `scripts/lib/validator-registry.json` | Modify | 003 | AC-format normalization + AC traceability table + AC_COVERAGE rule |
| `mcp_server/ENV_REFERENCE.md` | Modify | 001-003 | Feature flags (`SPECKIT_REVIEWER_BENCHMARKS`, `SPECKIT_COMPLETION_FRESHNESS(_ENFORCE)`, `SPECKIT_AC_COVERAGE(_ENFORCE/_FLOOR)`) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Level | Status |
|-------|--------|-------|-------|--------|
| 001 | `001-reviewer-prompt-benchmark-substrate/` | Reviewer-prompt fixture type + scorer in deep-improvement Lane B (T10) — the regression substrate | 2 | Spec-scaffolded |
| 002 | `002-peck-verification-discipline/` | Completion-freshness + escalation + anti-softening + reviewer read-budget + numeric-severity note (T5-T9) | 3 | Spec-scaffolded |
| 003 | `003-acceptance-coverage-gate/` | AC-format normalization + AC traceability table + AC_COVERAGE rule, warn-then-error (T1) | 3 | Spec-scaffolded |

### Phase Transition Rules
- **Phase 001 ships first** — it is the test substrate; 002 and 003 rules must pass their 001 fixtures before promoting from warn to error.
- Each phase MUST pass `validate.sh --strict` independently before the next phase implements.
- Use `/speckit:plan` or `/speckit:implement` on `[this-parent]/[NNN-phase]/` to work a specific phase.

### Phase Handoff Criteria

| From | To | Criteria |
|------|----|----------|
| 001-reviewer-prompt-benchmark-substrate | 002 / 003 | The reviewer fixture type + scorer exist with seed fixtures (stale-verdict, softened-Fail, over-read, AC-coverage); 002/003 rules are regression-tested against them before any ERROR promotion. |
| 002-peck-verification-discipline | 003-acceptance-coverage-gate | The completion-gate freshness + anti-softening land first; 003 reuses the same warn-then-error rollout convention and the deep-review verdict binding. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the three phases ship as one PR sequence or three independent PRs (phase 001 first regardless)?
- Phase 003's AC-format + checklist work shares `spec.md.tmpl`/`checklist.md.tmpl` with the pending `001-peck-teachings-adoption/002-self-check-templates`; confirm that lands first or coordinate the edit window before phase 003 implements.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Source research**: `../research/006-peck-source-deep-mining/` — `research.md` (verdict matrix + cross-model), `sub-packet-proposal.md` (packets), `integration-plan.md` (impact + UX + automation + rollout).
- **Phase children**: `001-reviewer-prompt-benchmark-substrate/`, `002-peck-verification-discipline/`, `003-acceptance-coverage-gate/`.
- **Sibling programs**: `../012-gem-team-adoption/`, `../016-memclaw-derived-memory-hardening/` (orthogonal, adopted independently).
