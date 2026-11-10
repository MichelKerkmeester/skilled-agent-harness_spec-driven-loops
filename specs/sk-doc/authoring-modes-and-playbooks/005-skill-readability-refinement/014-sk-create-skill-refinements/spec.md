---
title: "Feature Specification: sk-create-skill readability refinements: render checks, strict gate, exempt map, rewrite guard and templates"
description: "Fourteen refinements to sk-create-skill and the shared sk-doc validator, so the render rules the 066 readability program enforced by hand become checks, one strict gate, one exempt loader, a shipped rewrite guard and templates that pass their own checks."
trigger_phrases:
  - "sk create skill refinements phase parent spec"
  - "render checks strict gate exempt map rewrite guard"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement/014-sk-create-skill-refinements"
    last_updated_at: "2026-11-05T08:00:00Z"
    last_updated_by: "opus-medium"
    recent_action: "Authored the phase parent spec and the three child plans from the review report"
    next_safe_action: "Start 001-render-checks-and-gate with its setup tasks"
    blockers: []
    key_files:
      - "scratch/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md: these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: sk-create-skill readability refinements: render checks, strict gate, exempt map, rewrite guard and templates

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-05 |
| **Branch** | `worktrees/315-frontend-reference-restructure` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | sk-doc/authoring-modes-and-playbooks/005-skill-readability-refinement |
| **Predecessor** | 013-system-spec-kit |
| **Successor** | None |
| **Handoff Criteria** | All three children validate strict, the sk-doc test suites pass and `package_skill.py --check --strict` passes for all 13 skills |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 066 readability program found 1,764 findings across 57 consolidated findings files, and most of them repeat a few rule classes that no check enforces. The completion gate in `sk-create-skill/SKILL.md` runs without `--strict`, so render findings stay warnings. The scan skips SKILL.md, ROUTER.md and hub `shared/` trees, and no CI workflow runs the validator. The exempt map has three copies. The rewrite guards that caught dropped content live only in a spec scratch folder, and the templates break the skeletons the checks would enforce. The evidence for each claim is in `scratch/review-report.md`.

### Purpose
Turn the 14 refinements in `scratch/review-report.md` into shipped checks, one strict gate, one exempt loader with a pinned list, a shipped rewrite guard and templates that validate clean, then clear every new finding across `.skilled/skills` with every claim kept.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- All 14 refinements in `scratch/review-report.md`: P1 items 1 to 6, P2 items 7 to 11 and P3 items 12 to 14.
- The four operator decisions recorded on 2026-11-05 at the end of the report.
- New render checks, the strict gate, a wider scan, a CI sweep and a ledger ratchet in phase 001. New codes and newly scanned scopes stay advisory under `--strict` until phase 003 clears the fleet, per the operator decision of 2026-11-05.
- One exempt loader, a pinned list and the shipped rewrite guard in phase 002.
- Template fixes, the README OVERVIEW decision and the fleet clean-up in phase 003.

### Out of Scope
- Progress-token and packed-paragraph checks. The report marks both as not worth a check.
- Any claim change in a fleet doc. Phase 003 changes form only.
- Changelogs, playbooks, feature catalogs, benchmarks and tests as rewrite targets, per the 066 parent goal D2.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/sk-doc/shared/scripts/validate_document.py` | Modify | 001, 002, 003 | New and fixed render checks, exempt labels, README inventory check |
| `.skilled/skills/sk-doc/shared/assets/template-rules.json` | Modify | 001, 003 | Overview subsections, README render checks, one REFERENCES name |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modify | 001, 002, 003 | Wider scan, fence-aware section scan, staged sets that keep new codes advisory until 003 empties them, shared exempt loader |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json` | Modify | 002 | Pinned list. Its `debt` object stays `{}` in every phase |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/render-known-debt-ratchet.test.cjs` | Create | 001 | Ledger ratchet |
| `.github/workflows/sk-doc-script-tests.yml` | Modify | 001 | Ratchet and fleet sweep steps |
| `.skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py` | Create | 002 | Shipped rewrite guard |
| `.skilled/skills/sk-doc/sk-create-skill/SKILL.md`, `README.md`, `references/skill/*.md` | Modify | 001, 002, 003 | One strict gate, guard step, one size table |
| `.skilled/skills/sk-doc/sk-create-skill/assets/**/*-template.md` | Modify | 001, 003 | Overview, intro, README and REFERENCES fixes |
| Fleet docs under `.skilled/skills` | Modify | 003 | Form-only fixes for every new finding |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-render-checks-and-gate/ | Validator checks for items 1, 7, 8, 11, 13 and 14, the strict gate (2), the wider scan and CI sweep (3) and the ledger ratchet (4) | Complete |
| 2 | 002-exempt-and-rewrite-guard/ | One exempt loader with a pinned list (5) and the shipped rewrite guard with its workflow steps (6) | Complete |
| 3 | 003-templates-and-fleet/ | Template fixes for items 1, 8, 9, 10 and 12, README render checks, then the fleet clean-up under the rewrite guard | Complete |
| 4 | 004-alignment-fixes/ | Fixes for the findings the local-skilled-alignment run over the whole program upheld, then its recheck | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-render-checks-and-gate | 002-exempt-and-rewrite-guard | New checks ship with fixtures, the ratchet runs in CI, staged findings print as `render advisory:` warnings, the ledger `debt` is `{}` and every skill passes the strict gate | `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed` and the 13-skill strict loop exits 0 |
| 002-exempt-and-rewrite-guard | 003-templates-and-fleet | One exempt loader serves all callers and `doc-rewrite-guard.py` flags the replayed 066 FIX diff | `python3 .skilled/skills/sk-doc/shared/scripts/doc-rewrite-guard.py --help` exits 0 and the guard tests pass |
| 003-templates-and-fleet | 004-alignment-fixes | The fleet passes the strict gate and the alignment run over `1af95fc818..0e88ba257b` has a report | `report.md` and `critic.json` exist in run `20261105T151115Z` |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Are the 80 references without `### Purpose` deliberate, frozen by inbound references, or missed? The review did not sample them. Phase 003 answers it per doc with the rewrite guard.
- Is leaving hub `shared/` trees out of packaging deliberate? Nothing found says so. Phase 001 scans them unless a reason turns up.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Review report**: See `scratch/review-report.md` for the 14 refinements and their evidence
