---
title: "Tasks: Spec-Kit Template & Context Optimizations"
description: "Task list for the four-phase implementation of the six 033 recommendations."
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-template-context-optimizations"
    last_updated_at: "2026-08-12T12:51:40Z"
    last_updated_by: "claude-code"
    recent_action: "Authored task list grouped by implementation phase"
    next_safe_action: "Capture baselines; start Phase 1 tasks"
    blockers: []
    key_files:
      - "specs/system-speckit/034-spec-template-context-optimizations/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-12-system-speckit-034-optimizations"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Spec-Kit Template & Context Optimizations

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked. Evidence (exit code / grep / diff) required on completion. Task ids group by implementation phase P1–P4.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Author packet spec + phased plan + decision record from the 033 research shortlist.
- [ ] **T002** Resolve Open Question 1 (does deep-research consume `research.md.tmpl`?) — gates the REQ-001 savings claim.
- [ ] **T003** Resolve Open Question 3 (canonical changed-files source) — gates REQ-005.
- [ ] **T004** Capture regression baselines: renderer snapshot suite, mcp-server suite, `validate.sh --strict` on the packet fleet.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Impl Phase P1 — research-template gating (REQ-001)**
- [ ] **T010** Restructure `research.md.tmpl` into per-level gated sections (mirror `spec.md.tmpl`).
- [ ] **T011** Add a `research.md` entry to `spec-kit-docs.json` (level contract + absenceBehavior).
- [ ] **T012** Fix raw-file pointers in `template-guide.md`.

**Impl Phase P2 — consolidation & read-safety (REQ-002, REQ-003)**
- [ ] **T020** Refactor the 4 multi-level templates to shared core + per-level gated addenda.
- [ ] **T021** Handle the renderer blank-line boundary quirk (`inline-gate-renderer.ts:190-192`).
- [ ] **T022** Add a documented rendered-view read path (`--level N --stdout`) + authoring-checklist item.

**Impl Phase P3 — plan-adherence gates (REQ-004, REQ-005)**
- [ ] **T030** Promote `AC_COVERAGE` to default-on (warn) with escape hatch intact; update `validation-rules.md`.
- [ ] **T031** Add `check-scope-adherence.sh` (warn) following `check-files.sh`; wire into `validate.sh`.

**Impl Phase P4 — memory-search budget (REQ-006)**
- [ ] **T040** Apply `enforceTokenBudget` / `getTokenBudget('memory_search')` in `handleMemorySearch`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] **T050** Renderer snapshot tests pass; REQ-002 render output byte-identical to baseline (diff-clean).
- [ ] **T051** AC_COVERAGE + scope-adherence fixtures pass/warn as designed; no existing packet hard-fails under `--strict`.
- [ ] **T052** memory_search budget test: truncation + no-op + metadata; recall unchanged on fixture.
- [ ] **T053** Whole-gate re-run per phase; baseline→delta reported; scoped diff has no refuted-surface residue.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- REQ-001, REQ-002, REQ-004, REQ-006 (P0) complete with observed evidence; REQ-003, REQ-005 (P1) complete or explicitly deferred.
- Regression deltas reported for every phase; no refuted-surface change.
- Continuity saved via `generate-context.js`; `validate.sh --strict` clean on this packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Decisions: `decision-record.md` · Checklist: `checklist.md`
- Evidence source: `../033-spec-templates-and-context-reducer/research/research.md`
<!-- /ANCHOR:cross-refs -->
