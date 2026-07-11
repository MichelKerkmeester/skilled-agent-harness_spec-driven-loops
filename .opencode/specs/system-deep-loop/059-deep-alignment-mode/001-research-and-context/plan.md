---
title: "Implementation Plan: Phase 1: research-and-context"
description: "Plan for a read-only research gate that confirms the deep-review packet, runtime scripts, prior-art packets, and the four parent skills' standards surfaces before the deep-alignment architecture freeze. Stops for human review before any mode-packet content is planned."
trigger_phrases:
  - "deep-alignment research plan"
  - "deep-review runtime inventory plan"
  - "parent-skill standards inventory plan"
  - "130 131 reference read plan"
  - "phase 001 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/001-research-and-context"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the read-only research-gate plan"
    next_safe_action: "Execute the four scoped research passes"
    blockers: []
    key_files:
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/spec.md"
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/plan.md"
      - ".opencode/specs/system-deep-loop/059-deep-alignment-mode/001-research-and-context/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-001-research-and-context"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: research-and-context

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec-kit documentation with read-only repository inspection |
| **Framework** | System Spec Kit Level 1 phase documentation |
| **Storage** | None for execution; findings stay inside this phase folder |
| **Testing** | `validate.sh` against this phase folder once findings are recorded |

### Overview
This phase does not implement deep-alignment. It plans a research gate: confirm the deep-review engine's real shape, the three prior-art packets, the four parent skills' standards surfaces, and the 130/131 reference implementation, so phase 002 freezes an architecture against verified facts rather than the design brief's summary alone.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only research gate followed by human review.

### Key Components
- **Runtime-engine pass**: Read `.opencode/skills/system-deep-loop/deep-review/SKILL.md` plus `.opencode/skills/system-deep-loop/runtime/scripts/{loop-lock,convergence,verify-iteration,upsert}.cjs` and the mode-local `deep-review/scripts/reduce-state.cjs`, recording which primitives are shared vs. mode-local with file:line evidence.
- **Prior-art pass**: Read `052-deep-loop-unification/spec.md`, `055-deep-loop-divergent-mode/spec.md`, and `051-deep-loop-parent-skill-alignment/spec.md` directly, recording each program's actual delivered scope.
- **Standards-surface pass**: Read `sk-doc/scripts/validate_document.py`, `sk-doc/shared/references/core_standards.md`, `sk-git/SKILL.md`, the `sk-design` DESIGN.md/token references under `sk-design/shared/`, and `sk-code/SKILL.md` section 2 (Smart Routing), recording the concrete files a future adapter would read for each authority.
- **Reference-implementation pass**: Read `.opencode/specs/skilled-agent-orchestration/130-hub-doc-conformance-fixes/001-hub-doc-conformance-review/review/deep-review-strategy.md` and `130-hub-doc-conformance-fixes/002-hub-doc-conformance-fixes/spec.md`, recording the manual scoping question, ruleset, and verify-first fix pattern those packets used.

### Data Flow
Live repository reads become phase-local research artifacts recorded directly in this phase's `spec.md`. Those artifacts feed human review and then phase 002's architecture freeze; no mode-packet files are created in this phase.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-deep-loop/deep-review/` and `runtime/scripts/` | Source facts for the reuse-boundary decision | Read-only inventory; unchanged | File reads of `SKILL.md` and each `.cjs` script with file:line evidence |
| `.opencode/specs/skilled-agent-orchestration/130-.../131-...` | Reference implementation for the alignment contract | Read-only inventory; unchanged | File reads of `deep-review-strategy.md` and `131.../spec.md` |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the phase scope, parent handoff criteria, and the no-write boundary outside `001-research-and-context/`
- [ ] List the exact files to read for each of the four research passes
- [ ] Confirm the design brief's runtime-script claims against a live directory listing before trusting them

### Phase 2: Core Implementation
- [ ] Execute the runtime-engine pass and record shared-vs-mode-local script findings
- [ ] Execute the prior-art pass over 052, 055, and 051
- [ ] Execute the standards-surface pass over `sk-doc`, `sk-git`, `sk-design`, `sk-code`
- [ ] Execute the reference-implementation pass over the 130/131 packets

### Phase 3: Verification
- [ ] Reconcile all four passes into one internally consistent research/context map in `spec.md`
- [ ] Confirm no files outside this phase folder were touched during execution
- [ ] Run phase-folder validation and stop for human review before phase 002
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Template validation | Phase 001 spec docs | `validate.sh` against this phase folder |
| Placeholder check | Authored phase docs | Text search for unresolved bracketed placeholders |
| Inventory audit | Research outputs | Manual cross-check that every required file appears with file:line evidence |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Repository read access | Internal | Green | Research cannot verify live state without reading current files |
| Human review after the research gate | Process | Green | Phase 002 must not start until the phase 001 artifacts are reviewed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase execution touches files outside `001-research-and-context/`, or research artifacts contain ungrounded facts without file or grep evidence.
- **Procedure**: Discard or correct only the phase-local research artifacts, re-run the affected read pass, and repeat validation before handoff. No mode-packet rollback is needed because this phase is read-only outside the phase folder.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
