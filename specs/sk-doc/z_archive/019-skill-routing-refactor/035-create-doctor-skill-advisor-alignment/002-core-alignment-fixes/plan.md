---
title: "Implementation Plan: Create/Doctor/Skill-Advisor Core Alignment Fixes"
description: "Implement research.md Section 6 Track A (A1-A7) in dependency order: fix diagnosed defects, wire skill_graph_validate semantics, fix leaf-manifest ownership, author and wire a shared advisor-index-handoff vocabulary, add contract tests."
trigger_phrases:
  - "core alignment fixes plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/035-create-doctor-skill-advisor-alignment/002-core-alignment-fixes"
    last_updated_at: "2026-07-31T03:28:14Z"
    last_updated_by: "claude-code"
    recent_action: "All 7 phases (A1-A7) implemented and verified"
    next_safe_action: "None — packet Complete"
    blockers: []
    key_files:
      - "plan.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-002-core-alignment-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Create/Doctor/Skill-Advisor Core Alignment Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surfaces touched** | `.opencode/commands/doctor/*`, `.opencode/commands/create/*`, `.opencode/skills/sk-doc/sk-create-skill/*` |
| **Verification** | `route-validate.sh`, `parent-skill-check.cjs`, existing create/doctor test suites |
| **Design source** | `../001-research/research/research.md` Section 6, Track A — no new design decisions, implementation only |

### Overview
Seven dependency-ordered steps (A1-A7), each verified before the next begins, implementing the shared field vocabulary the research converged on: every mutation (`skill_graph_scan`, `advisor_rebuild`, `generate-leaf-manifest.cjs --write`) stays explicitly operator-owned; create/doctor report status as `NOT RUN`/`PASSED`/`FAILED`/`UNAVAILABLE (retryable)`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Design fully specified by research.md (no open architecture questions for A1-A7)
- [x] Every recommendation cites its supporting theme/finding

### Definition of Done
- [x] A1-A7 implemented and independently verified
- [x] `route-validate.sh`, `parent-skill-check.cjs`, create/doctor test suites all pass (3 pre-existing unrelated failures confirmed via baseline diff, documented in implementation-summary.md)
- [x] Docs (spec/plan/tasks/checklist/implementation-summary) reconciled to Complete
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared vocabulary, not a shared formatter (research.md Theme F) — each consumer (standalone create, parent create, doctor) keeps its own presentation asset but renders the same field names and status enum, defined once in a new shared reference doc.

### Key Components
- **`advisor-index-handoff.md`** (new, A4): canonical vocabulary — metadata ownership, refresh ownership, verification-state enum, class applicability
- **`doctor-skill-advisor.yaml`**: gains the `skill_graph_validate` call + severity derivation (A2)
- **`create-skill-parent-auto.yaml`** / **`create-skill-auto.yaml`**: gain the handoff fields per branch (A3, A5)

### Data Flow
Create scaffolds a skill -> generates its own metadata (including the now-scoped leaf-manifest) -> reports the handoff vocabulary with refresh status `NOT RUN` -> operator runs the printed refresh command -> `/doctor:skill-advisor` or `/doctor:parent-skill` reports the same vocabulary with real `PASSED`/`FAILED`/`UNAVAILABLE` status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: A1 — Fix the zero-ambiguity doctor/create defects
Fix `route-validate.py`'s stale regex, add `skill_graph_validate` to `_routes.yaml`/`speckit.md`, fix the `skill-parent.md` template cross-reference. Done first — no design questions, no dependencies.

### Phase 2: A2 — Wire skill_graph_validate into doctor's output semantics
Wire `skill_graph_validate` into `doctor-skill-advisor.yaml`'s verification phase with the researched `pass/warn/fail/unavailable` derivation; normalize `graph_scan_report` field sourcing. Depends on A1's route exposure.

### Phase 3: A3 — Fix the create-side manifest-generation gap
Point `create-skill-parent-auto.yaml`'s (and its `:confirm` mirror's) manifest generation at the scoped `generate-leaf-manifest.cjs --write <skillDir>`. Independent of A1/A2.

### Phase 4: A4 — Author the shared field-vocabulary contract
Author `advisor-index-handoff.md`. Depends on A2's validated status semantics and A3's real manifest-freshness values.

### Phase 5: A5 — Wire the handoff into every resolved create branch
Wire the handoff into standalone full-create/full-update, parent create/update, and the narrow leaf-freshness check for reference/asset-only branches. Depends on A4.

### Phase 6: A6 — Add the contract tests
Add contract tests (shared vocabulary + doctor route-contract subset), once real behavior exists to pin. Depends on A1-A5.

### Phase 7: A7 — State the guardrail
State the description.json/graph-vocabulary guardrail explicitly in the new shared doc. Folds into A4's authoring.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Re-run `route-validate.sh` after every doctor-surface edit; re-run `parent-skill-check.cjs` after every create-surface edit; add the new contract tests last (A6), once real behavior exists to pin, per research.md's own ruled-out-direction against premature test-first pinning.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`../001-research/research/research.md` Section 6 Track A is the sole design dependency. A2 depends on A1's route exposure; A4 depends on A2's validated status semantics and A3's real manifest-freshness values; A5 depends on A4; A6 depends on A1-A5 existing to pin.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is an ordinary tracked-file edit with the same revert path as any other commit; no runtime state, migration, or irreversible action is involved. `git revert` on the relevant commit(s) fully restores prior behavior.
<!-- /ANCHOR:rollback -->
