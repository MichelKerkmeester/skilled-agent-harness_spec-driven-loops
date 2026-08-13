---
title: "Implementation Plan: Spec-Kit Template & Context Optimizations"
description: "Four-phase implementation plan for the six 033 recommendations: research-template gating, template consolidation + read guard, plan-adherence validation gates, and a memory_search token budget."
trigger_phrases:
  - "spec template optimizations plan"
  - "034 implementation phases"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-template-context-optimizations"
    last_updated_at: "2026-08-13T04:01:32Z"
    last_updated_by: "claude-code"
    recent_action: "Reconciled plan to shipped state after two deep-reviews"
    next_safe_action: "Await commit go-ahead"
    blockers: []
    key_files:
      - "specs/system-speckit/034-spec-template-context-optimizations/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-12-system-speckit-034-optimizations"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Spec-Kit Template & Context Optimizations

<!-- ANCHOR:summary -->
## 1. SUMMARY

Implement the six 033 recommendations as **four independently-shippable phases**, ordered by verified value and surface cohesion. Each phase captures a regression baseline, changes one surface, proves its result with focused tests, and re-runs the authoritative gate. Phase 1 is the highest-verified win and self-contained; Phases 3 and 4 are independent and could run in parallel with the template phases.

All findings and file:line evidence trace to `research/research.md`. The refutation list there is a hard blocker: no phase may reinvent existing deep-loop reducers, the memory_context budget, or the evaluator/handoff machinery.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Check |
|------|-------|
| Regression baseline | Capture the relevant test-suite + `validate.sh --strict` result BEFORE each phase; re-run the WHOLE gate after; report the delta |
| Byte-identical render | Where a change claims "no behavior change" (REQ-002), renderer snapshot output per level is diff-clean vs baseline |
| Focused proof | Each phase reproduces the target symptom first (e.g. 944-line render; dormant AC rule; unbudgeted search), then proves the fix with the same check |
| No refuted surface | Scoped diff touches none of the §3 Out-of-Scope items |
| Observed evidence | Every completion claim carries real command output (exit code / grep / diff), read before it is claimed |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Four surfaces, four phases. The template renderer contract (`inline-gate-renderer.ts:182` — strips `<!-- IF level:N -->` blocks model-free) is the mechanism Phases 1–2 lean on; the `validate.sh` rule-loader is the seam for Phase 3; the shared token-budget helper (`enforceTokenBudget`, already used by `memory-context.ts`) is what Phase 4 reuses.

**Dependency order:** Phase 1 establishes the level-gating pattern for `research.md.tmpl`; Phase 2 applies the same shared-core/gated-addenda pattern to the other multi-level templates and adds the read guard, so it follows Phase 1. Phases 3 and 4 are independent of the template work and of each other.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1 — Research-template level-gating (REQ-001) · templates · verified, top value

- **Do:** restructure `research.md.tmpl` from its single always-true gate (`<!-- IF level:1,2,3,3+,phase -->`) into per-level sections mirroring `spec.md.tmpl` (blocks at level 1 / 2 / 3 / 3+ / phase). Add a `research.md` entry to `spec-kit-docs.json` `documents` with level contract + `absenceBehavior`. Fix the raw-file pointers in `template-guide.md`.
- **Prove:** renderer snapshot tests show L1 render collapses well below 944 lines and each level renders the intended sections; `validate.sh` still recognizes a scaffolded research.md.
- **Gate first:** confirm the consumer (Open Question 1) — if deep-research owns its own synthesis shape, savings are authoring-only; proceed anyway but scope the claim honestly.

### Phase 2 — Template consolidation & read-safety (REQ-002, REQ-003) · templates

- **Do (REQ-002):** for the four multi-level templates (`spec`, `plan`, `tasks`, `implementation-summary` — and `checklist` where applicable), replace the four embedded full-core copies with ONE shared ungated core + per-level gated addenda. Handle the renderer's `pendingInactiveGateBoundary` blank-line quirk (`inline-gate-renderer.ts:190-192`) with a non-blank separator or a one-line renderer tweak.
- **Do (REQ-003):** document an `inline-gate-renderer --level N --stdout` rendered-view read path; add an authoring-checklist item directing agents to it rather than raw `.tmpl`.
- **Prove:** renderer snapshot output per level is **byte-identical** to the Phase-2 baseline (this is the core safety proof); template source shrinks materially.

### Phase 3 — Plan-adherence validation gates (REQ-004, REQ-005) · validation

- **Do (REQ-004):** promote `AC_COVERAGE` to default-on as a **non-blocking advisory (INFO)** — flip the default in `check-ac-coverage.sh` (`RULE_STATUS` stays `pass`); keep `SPECKIT_AC_COVERAGE_FLOOR` (0.9) and the manual-infeasible escape hatch; update `validation-rules.md`. (Shipped as advisory, not warn — see decision-record ADR-003.)
- **Do (REQ-005):** add `check-scope-adherence.sh` (warn) following the `check-files.sh` pattern — verify changed-file paths fall within the plan/spec declared scope; wire it into `validate.sh`'s rule loop; resolve the changed-files contract (Open Question 3) first.
- **Prove:** covered fixture passes, under-covered fixture warns (not errors); in-scope fixture passes, out-of-scope fixture warns; no existing packet hard-fails under `--strict`.

### Phase 4 — Memory-search token budget (REQ-006) · MCP memory

- **Do:** apply the shared `enforceTokenBudget` / `getTokenBudget('memory_search')` at the end of `handleMemorySearch` in `memory-search.ts` (0 current hits vs 3 in `memory-context.ts`). Optionally consume the advisory `dynamic-token-budget` as a hard cap in `stage4-filter` after measuring recall impact.
- **Prove:** a test shows oversized results truncated lowest-score-first with enforcement metadata; a result set already under budget is a no-op; measured recall unchanged on a fixture query.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Templates (1, 2):** renderer snapshot tests (`inline-gate-renderer`) per level; byte-identical diff for REQ-002; a `validate.sh` scaffold check for a fresh research.md.
- **Validation (3):** rule-level fixtures (covered/under-covered, in-scope/out-of-scope) run through `validate.sh`; confirm no regression on the existing packet fleet under `--strict`.
- **Memory (4):** mcp-server vitest for the budget path (truncation, no-op, metadata); a recall check on a fixture query.
- **Whole gate:** after each phase, re-run `validate.sh --strict` on the touched packets + the relevant suite; report baseline→delta.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 033 research report (`research/research.md`) — evidence + refutation list.
- `inline-gate-renderer.ts` + its snapshot test harness.
- `validate.sh` rule-loader + `scripts/rules/` conventions (`check-files.sh` as the pattern for REQ-005).
- mcp-server test harness + the shared `enforceTokenBudget` / `getTokenBudget` helpers.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each phase is a self-contained, revertible change on the `system-spec-kit/0146-speckit-template-optimizations` worktree branch. Rollback = revert that phase's commit; no phase depends on a later phase's artifacts. Template changes are proven byte-identical (REQ-002) so a revert cannot silently change rendered output. No commit/push to a shared branch without explicit operator go-ahead.
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

- Phase 1 → Phase 2 (soft): Phase 2 reuses Phase 1's level-gating pattern; do 1 first.
- Phase 3 — independent (validation surface).
- Phase 4 — independent (MCP surface).
- Phases 3 and 4 may run in parallel with 1–2.

## L2: EFFORT ESTIMATION

| Phase | Rough size | Blast |
|-------|-----------|-------|
| 1 | Medium | Template + renderer tests |
| 2 | Medium | Template source + byte-identical proof |
| 3 | Small–Medium | Validation rules + fixtures |
| 4 | Small | One handler + tests |
