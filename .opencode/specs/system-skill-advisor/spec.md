---
title: "Feature Specification: System Skill Advisor"
description: "The canonical historical and active home for the skill-advisor subsystem: routing, scoring, hardening, documentation, embedder stack, CLI, and the current scorer-tuning work."
trigger_phrases:
  - "system-skill-advisor track"
  - "skill advisor subsystem"
  - "skill graph routing engine scoring"
  - "advisor scorer intelligence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Track root spec.md authored after the 026/027/028 extraction, narrating the full 001-012 history"
    next_safe_action: "Resume any child phase folder independently"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-07-07-skill-advisor-extraction"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: System Skill Advisor

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-04-21 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | none (track root) |
| **Parent Packet** | none (track root) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill-advisor subsystem's spec history was scattered across three unrelated `system-speckit` packets (026, 027, 028) for over two months, with no single folder a reader could open to understand its full history. One packet already tried this exact extraction once (`system-speckit/026/.../006-system-skill-advisor-package-extraction`, scaffolded 2026-05-14) and never finished moving the spec folders themselves.

### Purpose
One track holds every skill-advisor-scoped spec folder, numbered in true chronological order (derived from `git log --follow` archaeology, not import order), so the subsystem reads as one coherent history.

> **Phase-parent note:** This spec.md is the ONLY authored document at this parent level. All detailed planning lives in the child phase folders listed in the Phase Documentation Map below. The migration record lives in `context-index.md`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level routing for the 13 phase children.
- Chronological phase-documentation map.
- Cross-track boundary to the shared/joint infra left in `system-speckit/026` and `027` (code-graph BFS helper, daemon bridge, joint research packet).

### Out of Scope
- Rewriting child folders beyond identity metadata and path references.
- Shared infra that remained in `system-speckit` (see `context-index.md`).

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `spec.md` | Create | this | Root purpose and child map |
| `description.json`, `graph-metadata.json` | Refresh | this | Search metadata for the parent |
| `context-index.md` | Create | this | Migration bridge and left-in-place item record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child below is an independently executable phase folder owning its own plan, tasks, checklist, decisions, and continuity. Numbered in true chronological order (earliest first).

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 000 | `000-migration-from-system-speckit/` | This extraction's own tracking spec (manifest, decisions, verification) | Complete |
| 001 | `001-skill-graph/` | Skill-graph DB/tooling, incl. the 30-item package-extraction arc (originally 2026-04-21) | Phase parent |
| 002 | `002-skill-advisor-scoring-engine/` | Scoring system: hooks, semantic routing, ablation sweeps, confidence calibration | Phase parent |
| 003 | `003-skill-advisor-routing-engine/` | Intent routing, phrase boosters, hook surface integration, affordance evidence | Phase parent |
| 004 | `004-skill-advisor-production-hardening/` | Plugin hardening, standards alignment, fail-open fallback, freshness audit | Phase parent |
| 005 | `005-skill-advisor-documentation/` | Documentation-code alignment and quality refactor | Phase parent |
| 006 | `006-playbook-run-and-remediation/` | Manual testing playbook run + remediation | Phase parent |
| 007 | `007-skill-advisor-embedder-stack/` | Pluggable embedder architecture, zombie-launcher fix, compat-contract consolidation (2026-05-17) | Phase parent |
| 008 | `008-skill-advisor-cli/` | CLI-fallback workstream for `mk_skill_advisor` (2026-06-06) | Phase parent |
| 009 | `009-advisor-and-codegraph-migrated-items/` | Cross-session reconnect, suite repair, spec-folder-leak fix, 5 shared-feature-adoption items (2026-06-14) | Phase parent |
| 010 | `010-skill-advisor-frontmatter-alignment/` | Canonical model-reference contract applied to the advisor skill (2026-06-16) | Complete |
| 011 | `011-skill-advisor-phase-parent/` | Held hard-rule and dispatch-preflight hardening follow-up (2026-06-16) | In Progress |
| 012 | `012-skill-advisor-tuning/` | Scorer saturation-class root fix (WS1-6), the newest wave (2026-07-06) | In Progress |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently.
- Run `validate.sh --recursive` on this folder to validate all phases as a unit.
- Use `/speckit:resume system-skill-advisor/[NNN-phase]/` to resume a specific phase.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| `001-skill-graph` | `012-skill-advisor-tuning` | Each phase ships and validates independently | Per-phase strict validation evidence |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Two content-unconfirmed leftover items in `system-speckit/026-graph-and-context-optimization` were intentionally left there rather than moved or investigated further during this extraction: `006-operator-tooling/003-install-scripts-doctor-realignment/003-advisor-adjacent-116-realignment` (still template-scaffold prose, subject matter unconfirmed) and a content-confirmation judgment call already resolved for `007-skill-advisor-embedder-stack/005-shared-embedder-logic-with-spec-memory` (confirmed advisor-scoped, moved).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Migration record**: `context-index.md`
- **Graph metadata**: `graph-metadata.json`
