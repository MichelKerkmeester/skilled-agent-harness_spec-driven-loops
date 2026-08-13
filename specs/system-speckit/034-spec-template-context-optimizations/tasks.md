---
title: "Tasks: Spec-Kit Template & Context Optimizations"
description: "Task list for the four-phase implementation of the six 033 recommendations."
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-template-context-optimizations"
    last_updated_at: "2026-08-13T04:01:32Z"
    last_updated_by: "claude-code"
    recent_action: "Marked shipped tasks with evidence after deep-review"
    next_safe_action: "Await commit go-ahead"
    blockers: []
    key_files:
      - "specs/system-speckit/034-spec-template-context-optimizations/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-12-system-speckit-034-optimizations"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Spec-Kit Template & Context Optimizations

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked. Evidence (exit code / grep / diff) required on completion. Task ids group by implementation phase P1–P4.

> **Phase-numbering note:** the `## Phase 1/2/3` headings below are **lifecycle stages** (Setup / Implementation / Verification) and are distinct from `plan.md`'s **value-ordered implementation phases P1–P4** (REQ-001…006). The P1–P4 work items live *inside* the Implementation stage, labelled "Impl Phase P1…P4". When a doc says "Phase 2" unqualified: in `plan.md` it means REQ-002 consolidation; in `tasks.md` it means the Implementation stage.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Author packet spec + phased plan + decision record from the 033 research shortlist.
- [x] **T002** Resolve Open Question 1 (does deep-research consume `research.md.tmpl`?) — RESOLVED: the template is workflow-owned (`spec-kit-docs.json` `owner:workflow, creationTrigger:deep-research`); deep-research writes its own synthesis, so REQ-001 savings are authoring-only.
- [x] **T003** Resolve Open Question 3 (canonical changed-files source) — RESOLVED: contract defined as `MK_SCOPE_CHANGED_FILES` (explicit list) or `MK_SCOPE_BASE` (git diff ref) in `check-scope-adherence.sh`; packet docs are implicitly in-scope.
- [x] **T004** Capture regression baselines: renderer snapshot suite, mcp-server suite, `validate.sh --strict` on the packet fleet. — Baselines captured (25 render hashes, golden suite, targeted vitest); deltas reported (0 regressions in changed surfaces).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Impl Phase P1 — research-template gating (REQ-001)**
- [x] **T010** Restructure `research.md.tmpl` into per-level gated sections (mirror `spec.md.tmpl`). — L1 render 175 lines; L3/3+/phase byte-identical; `research-template-gating.vitest.ts` 4/4.
- [x] **T011** Add a `research.md` entry to `spec-kit-docs.json`. — Entry already present (`owner:workflow, creationTrigger:deep-research, absenceBehavior:silent-skip`); verified, no change needed.
- [x] **T012** Fix raw-file pointers in `template-guide.md`. — Rendered-view read guard added.

**Impl Phase P2 — consolidation & read-safety (REQ-002, REQ-003)**
- [x] **T020** Refactor the 4 multi-level templates to per-template inline `<!-- IF level:N -->` gates (shared content ungated). — 25/25 per-level render hashes match baseline; `template-structure` 8/8.
- [x] **T021** Handle the renderer blank-line boundary quirk. — Renders clean per level (no doubled blank lines).
- [x] **T022** Add a documented rendered-view read path (STDOUT when `--out-dir` is omitted) + authoring-checklist item. — `template-guide.md` "Reading a Template (Agents)".

**Impl Phase P3 — plan-adherence gates (REQ-004, REQ-005)**
- [x] **T030** Promote `AC_COVERAGE` to default-on as a non-blocking advisory (INFO), escape hatch intact; update `validation-rules.md`. — `RULE_STATUS` stays `pass` (ADR-003); shipped as advisory, not warn.
- [x] **T031** Add `check-scope-adherence.sh` (warn) following `check-files.sh`; wire into `validate.sh`. — Registered `SCOPE_ADHERENCE`; `check-scope-adherence.vitest.ts` 4/4.

**Impl Phase P4 — memory-search budget (REQ-006)**
- [x] **T040** Apply `enforceSearchTokenBudget` / `getTokenBudget('memory_search')` in `handleMemorySearch`. — Dedicated enforcer per ADR-005; `memory-search-token-budget.vitest.ts` 5/5.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T050** Renderer snapshot tests pass; REQ-002 render output byte-identical to baseline (diff-clean). — `template-structure` 8/8, `inline-gate-renderer` 12/12, `scaffold-golden-snapshots` 6/6; 25/25 render hashes match.
- [x] **T051** AC_COVERAGE + scope-adherence fixtures pass/warn as designed; no existing packet hard-fails under `--strict`. — AC_COVERAGE advisory (`pass`); `check-scope-adherence.vitest.ts` 4/4.
- [x] **T052** memory_search budget test: truncation + no-op + metadata; recall unchanged on fixture. — `memory-search-token-budget.vitest.ts` 5/5.
- [x] **T053** Whole-gate re-run per phase; baseline→delta reported; scoped diff has no refuted-surface residue. — `validate.sh --strict` exit 0; full scripts suite changed-surfaces green.
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
