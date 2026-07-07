---
title: "Feature Specification: deep-context loop"
description: "No convergence-gated loop assembles implementation-ready codebase context before planning/implementation; planning and implementation rely on ad-hoc, one-shot context that misses reusable code and risks context-rot."
trigger_phrases:
  - "deep-context"
  - "context gathering"
  - "context report"
  - "reuse catalog"
  - "deep loop"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/001-context-loop-foundation"
    last_updated_at: "2026-06-06T23:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase 5: skill-advisor registered + synced to Barter v3.5 mirror"
    next_safe_action: "Operator: run a live /deep:start-context-loop on a real feature"
    blockers: []
    key_files:
      - "specs/system-deep-loop/z_archive/025-deep-context-gathering/001-context-loop-foundation/research/research.md"
    session_dedup:
      fingerprint: "sha256:8e21494a9d2c00dec751e783e9aa266a83d727dda0b4fae220947b13998cf7bd"
      session_id: "dc-134-20260606"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Packet location: {spec_folder}/context/ for per-run artifacts; skill root for merged surfaces"
      - "Convergence thresholds: saturation 0.10, relevance gate 0.55 — shipped as calibration defaults"
      - "Single report with mode-tagged sections recommended and shipped"
---
# Feature Specification: deep-context loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

`deep-context` is a new (4th) deep-loop skill: an iterative, small-model-driven loop that sweeps slices of the codebase and synthesizes an implementation/planning-ready **Context Report** (top section: a REUSE catalog of `file:symbol` pointers to extend). It is the missing "understand" loop that runs *before* `/speckit:plan` and `/speckit:implement`, built as the 3rd consumer of `deep-loop-runtime`. Design validated by a 10-iteration deep-research pass (`research/research.md`).

**Key Decisions**: reuse `deep-loop-runtime` (10 libs as-is, 3 coverage-graph modules + `convergence.cjs` extended for `loop_type='context'`); convergence on relevance-gated coverage saturation; report ships verified pointers, not source bodies (anti-context-rot).

**Critical Dependencies**: a new ownership ADR (mandated by `deep-loop-runtime/SKILL.md §4` for a 3rd consumer); the System Code Graph (frontier seeding).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-06 |
| **Branch** | `134-deep-context-gathering` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
There is no convergence-gated loop that assembles implementation-ready context from the existing codebase. `/speckit:plan` discovers context ad-hoc (4 one-shot exploration agents in Step 5) and `/speckit:implement` relies on whatever the plan captured, so reusable code is missed (violating the "reuse, avoid new code" principle), context-rot and stale references creep in, and there is no saturation signal for "enough context gathered."

### Purpose
Ship a `deep-context` deep loop that produces a relevance-gated, convergence-tested Context Report — a REUSE-catalog-first briefing that materially improves planning/implementation quality and can replace the plan-Step-5 exploration dispatch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `deep-context` skill consuming `deep-loop-runtime` (mirroring deep-research's structure).
- `loop_type='context'` extension of the coverage-graph (node kinds, relations, signals) + `convergence.cjs`.
- A new ownership ADR registering deep-context as the 3rd runtime consumer.
- `/deep:start-context-loop` command (+ auto/confirm YAML) and a read-only `@deep-context` LEAF agent.
- MVP per `research/research.md §10`: single small-model, by-slice, code-graph-seeded frontier, host-writes-state, saturation convergence, Context Report (REUSE catalog + integration points + touch list + conventions + gaps).

### Out of Scope
- By-model fan-out, embedding relevance, dashboards — deferred to v2 (council/over-engineering avoidance).
- Mutating `spec.md` from deep-context — that remains `/speckit:plan`'s job.
- New MCP tools — prohibited by the runtime isolation ADR.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts` | Modify | Add `'context'` to `LoopType`, `VALID_KINDS`/`VALID_RELATIONS`, CHECK constraints, `SCHEMA_VERSION`→3 |
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-signals.ts` | Modify | Add `ContextConvergenceSignals` + `computeContextSignals()` + dispatch branch |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modify | Add `evaluateContext()` + composite-score branch + accept `--loop-type context` |
| `.opencode/skills/deep-context/**` | Create | New skill (SKILL.md, assets, references, reduce-state.cjs) mirroring deep-research |
| `.opencode/commands/deep/start-context-loop.md` (+ `assets/*.yaml`) | Create | Command + auto/confirm workflows |
| `.opencode/agents/deep-context.md` | Create | LEAF read-only analyzer agent |
| `.opencode/specs/.../decision-record.md` (ownership ADR) | Create | 3rd-consumer ownership ADR |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ownership ADR registering deep-context as 3rd `deep-loop-runtime` consumer | `decision-record.md` records consumer registration, schema bump 2→3, convergence semantics, node-kind ownership, read-only contract, no-new-MCP |
| REQ-002 | Coverage-graph `loop_type='context'` extension | `coverage-graph-db.ts` + signals + `convergence.cjs` accept `context`; existing research/review graphs unaffected; runtime tests green |
| REQ-003 | Read-only analyzer dispatch contract carrying gather-subject | Lineage prompt includes gather_subject + slice_boundary + known_context + output_schema; missing field throws before spawn; models never write outside artifact dir |
| REQ-004 | Context Report with REUSE catalog of verified pointers | Report emits §1 REUSE catalog (file:symbol + signature + reuseStrategy + confidence + freshness); every cited ref resolved against code graph; unverified refs labeled |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Relevance-gated saturation convergence | 3-band relevance gate; stop on `newCoverageDelta` < 0.10 over K iters AND gates pass, or max-iter/deadlock |
| REQ-006 | `/speckit:plan` Step-5 integration | Plan can consume the Context Report in place of the 4-agent exploration dispatch |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A `/deep:start-context-loop` run on a real target produces a Context Report whose REUSE catalog entries are code-graph-verified (0 unlabeled stale refs).
- **SC-002**: `deep-loop-runtime` tests pass with `loop_type='context'` added; research/review behavior unchanged.
- **SC-003**: A planning run that consumes the Context Report measurably reduces exploration dispatch cost vs. the current 4-agent Step-5 path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Context rot / stale `file:line` refs | High — agent edits wrong place | Ship pointers+signatures not bodies; resolve refs vs code graph; freshness labels |
| Risk | Small-model over-collection blocks saturation | Med — loop never converges | Relevance gate (kept/marginal/pruned); only kept counts toward coverage |
| Risk | Cost blowup from many small-model calls | Med | max-iterations cap, per-slice token budget, salvage on budget hit |
| Dependency | Code Graph for frontier seeding | Med — degraded seeding | Glob+Grep fallback when graph stale/empty |
| Dependency | Ownership ADR sign-off | Blocks schema change | Author ADR first (REQ-001) before any runtime edit |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Read-only analyzer dispatches; per-slice token budget (~4k) and overall input cap to bound cost.

### Security
- **NFR-S01**: Lineages are read-only; no writes outside their artifact dir; no `--dangerously-skip-permissions` writes to the working tree.

### Reliability
- **NFR-R01**: Host-writes-state with atomic JSONL + loop-lock; partial-failure containment (emit partial report from surviving slices).

---

## 8. EDGE CASES

### Data Boundaries
- Empty/narrow scope: single-lineage path, skip fan-out.
- Feature with no reusable code: `reuseCatalogCoverage` vacuous-passes (don't penalize).

### Error Scenarios
- Code graph stale/absent: fall back to Glob+Grep seeding; flag degraded.
- Lineage subprocess non-zero exit: salvage iteration output from stdout; host emits partial report.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | New skill + command + agent + 3 runtime-lib edits + ADR |
| Risk | 15/25 | Shared-runtime schema change; backward-compat required |
| Research | 18/20 | 10-iteration design research completed |
| Multi-Agent | 8/15 | Fan-out lineages (by-slice) |
| Coordination | 8/15 | Runtime ownership ADR + downstream plan/implement integration |
| **Total** | **69/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Stale/hallucinated refs in report | H | M | Code-graph resolution + freshness labels; drop+count invalid |
| R-002 | Convergence never triggers | M | M | Dual-criterion saturation + deadlock detector + max-iter cap |
| R-003 | Schema change breaks research/review | H | L | Additive CHECK + schema version bump + runtime test gate |

---

## 11. USER STORIES

### US-001: Pre-planning context (Priority: P0)

**As a** developer about to plan a feature, **I want** a convergence-tested Context Report, **so that** planning reuses existing code and avoids missing integration points.

**Acceptance Criteria**:
1. Given a feature/scope, When I run `/deep:start-context-loop`, Then I get a REUSE-catalog-first report with verified pointers.

### US-002: Cheaper planning (Priority: P1)

**As a** planning agent, **I want** to consume the Context Report, **so that** I can skip the 4-agent Step-5 exploration dispatch.

**Acceptance Criteria**:
1. Given a Context Report, When `/speckit:plan` runs, Then it reads report sections instead of spawning exploration agents.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Packet location when no spec folder exists yet (`{spec_folder}/context/` vs standalone run dir).
- Final slice granularity (file vs symbol-cluster vs directory) + convergence thresholds — calibration task.
- Single report vs dual planning/implementing views (recommend one report, mode-tagged sections).
- Small-model selection for the analyzer (a natural `/deep:start-model-benchmark-loop` job).
- ADR authorship (deep-context owner vs runtime maintainer).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Design Research**: See `research/research.md` (10-iteration synthesis; the authoritative design source)
- **Implementation Plan**: `plan.md` — Phase 3, pending build approval
- **Task Breakdown**: `tasks.md` — Phase 3, pending build approval
- **Decision Records**: `decision-record.md` (ownership ADR) — Phase 3, pending build approval
