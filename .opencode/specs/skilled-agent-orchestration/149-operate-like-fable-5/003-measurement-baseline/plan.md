---
title: "Implementation Plan: Measurement baseline for fable-5 efficiency: a fable-metrics script, post-dispatch behavioral advisories, and a doctor/benchmark delivery route [template:level_3/plan.md]"
description: "Implementation plan for the fable-5 measurement baseline: build a runtime-agnostic fable-metrics.cjs, capture a baseline over 002 lineage state, wire non-blocking post-dispatch advisories, and ship a read-only /doctor fable-mode route."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/003-measurement-baseline"
    last_updated_at: "2026-06-15T14:05:58Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 3 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-measurement-baseline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Measurement baseline for fable-5 efficiency: a fable-metrics script, post-dispatch behavioral advisories, and a doctor/benchmark delivery route

<!-- SPECKIT_LEVEL: 3 -->
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
| **Language/Stack** | Node.js CommonJS (`.cjs`) for the metric and diagnostic scripts; TypeScript for the `post-dispatch-validate.ts` edit |
| **Framework** | None; plain Node plus the existing deep-loop-runtime and doctor command conventions |
| **Storage** | None new; reads existing deep-loop state JSONL and iteration markdown, writes a baseline snapshot artifact |
| **Testing** | `vitest` for the runtime advisory change; manual run of `fable-metrics.cjs` over the 002 corpus; `route-validate.sh` for the doctor route |

### Overview
Build a standalone `fable-metrics.cjs` that parses deep-loop state JSONL plus iteration markdown and computes five behavioral metrics, then capture a baseline over the existing 002 lineage state files. Add non-blocking advisories to `post-dispatch-validate.ts` and ship a read-only `/doctor fable-mode` route (entry, asset, diagnostic script) that surfaces the metrics on demand. The approach is runtime-agnostic on purpose: it reads the framework's own deep-loop state rather than the Claude-coupled path that `leak_test.py` assumes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Five metric definitions fixed (tool:text ratio, median words/msg, self-opener %, unsolicited-caveat %, evidence-backed-completion ratio)
- [ ] 002 lineage state files confirmed as the baseline corpus
- [ ] Delivery surface chosen (read-only `/doctor fable-mode` primary)

### Definition of Done
- [ ] `fable-metrics.cjs` runs on the 002 corpus and reports all five metrics
- [ ] Baseline snapshot captured
- [ ] `vitest` confirms the post-dispatch advisory is non-blocking; `route-validate.sh` passes for the new route
- [ ] `validate.sh --strict` passes on this phase folder; spec/plan/tasks/checklist synchronized
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only diagnostic pipeline. A single metric library is the source of truth; the diagnostic script and the (optional) benchmark dimension call into it, and the baseline snapshot is a one-shot output of the same computation.

### Key Components
- **`fable-metrics.cjs`**: Parses deep-loop state JSONL and iteration markdown, computes the five metrics, and emits a baseline snapshot. Runtime/model-agnostic; takes a path argument.
- **`fable-mode-check.cjs`**: Read-only doctor diagnostic that invokes the metric computation and renders the metrics plus the baseline comparison. No writes.
- **`post-dispatch-validate.ts` advisory hook**: Additive, non-blocking advisory output on low tool:text ratio, self-openers, and high caveat density.
- **`/doctor fable-mode` route**: The `_routes.yaml` entry plus `doctor_fable-mode.yaml` asset that expose the diagnostic.

### Data Flow
Deep-loop state JSONL plus iteration markdown -> `fable-metrics.cjs` parser -> five computed metrics -> baseline snapshot (one-shot) and on-demand render via `fable-mode-check.cjs` through the `/doctor fable-mode` route. The advisory path consumes the same metric signals at dispatch time and emits informational output only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` | Owns post-dispatch validation and verdict shaping | Update: add additive non-blocking advisory output; do not alter the verdict logic | `vitest` fixture asserts a low-tool:text input stays non-blocking |
| `.opencode/commands/doctor/_routes.yaml` | Route manifest consumed by `route-validate.sh` and the doctor router | Update: append a `fable-mode` route with `mutating: read-only` | `route-validate.sh` passes; `grep` confirms `mutating: read-only` |
| `.opencode/commands/doctor/scripts/route-validate.sh` | Validates the route manifest schema | Unchanged (consumer only) | New route validates against existing schema |
| `.opencode/commands/deep/model-benchmark.md` | Benchmark lane documentation | Update (secondary, optional): note the behavioral-metrics dimension | `grep` confirms the doc records `/doctor fable-mode` as the primary surface |

Required inventories:
- Same-class producers: `rg -n 'mutating:|gate3_location:' .opencode/commands/doctor/_routes.yaml` to confirm the new route matches the read-only pattern of existing diagnostics.
- Consumers of changed symbols: `rg -n 'fable-mode|fable-metrics' .opencode/commands/doctor .opencode/skills --glob '*.yaml' --glob '*.cjs' --glob '*.ts' --glob '*.md'`.
- Matrix axes: lineage source (codex / opus / opus-r4 / deepseek / mimo / kimi), record completeness (full / partial / malformed), and metric type (ratio / median / percentage).
- Algorithm invariant: the metric computation must be deterministic for a fixed corpus and must never write during a `/doctor` run.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Metric script and baseline
- [ ] Create `.opencode/skills/system-spec-kit/scripts/metrics/fable-metrics.cjs` with a parser for deep-loop state JSONL plus iteration markdown. Verify: runs on one 002 lineage folder without crashing.
- [ ] Implement the five metrics (tool:text ratio, median words/msg, self-opener %, unsolicited-caveat %, evidence-backed-completion ratio) with defensive parsing. Verify: prints all five over the full 002 corpus and reports per-lineage coverage.
- [ ] Capture the baseline snapshot over the 002 lineage state files. Verify: snapshot artifact records the five metrics and which lineages contributed.

### Phase 2: Advisories and delivery route
- [ ] Edit `.opencode/skills/deep-loop-runtime/lib/deep-loop/post-dispatch-validate.ts` to emit non-blocking advisories on low tool:text ratio, self-openers, and high caveat density. Verify: `vitest` fixture confirms a tripping input stays non-blocking.
- [ ] Create `.opencode/commands/doctor/scripts/fable-mode-check.cjs` (read-only) that renders the metrics and the baseline comparison. Verify: invoking it writes no files (confirmed by a pre/post directory diff).
- [ ] Create `.opencode/commands/doctor/assets/doctor_fable-mode.yaml` and append the `fable-mode` route to `.opencode/commands/doctor/_routes.yaml`. Verify: `route-validate.sh` passes and the route is `mutating: read-only`.

### Phase 3: Verification and docs
- [ ] Optionally note the behavioral-metrics dimension in `.opencode/commands/deep/model-benchmark.md` with `/doctor fable-mode` as the primary surface. Verify: `grep` finds the note.
- [ ] Run `validate.sh --strict` on the phase folder and reconcile spec/plan/tasks/checklist. Verify: exit 0 (or warnings only).
- [ ] Confirm the advisories are non-blocking and the route is read-only end to end. Verify: `vitest` suite green; `route-validate.sh` green.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Metric functions on small fixtures; non-blocking advisory verdict in `post-dispatch-validate.ts` | `vitest` |
| Integration | Full run of `fable-metrics.cjs` over the 002 lineage corpus; route resolution | `route-validate.sh`, manual CLI run |
| Manual | `/doctor fable-mode` render and a pre/post directory diff confirming zero writes | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002 lineage deep-loop state files | Internal | Green | Baseline corpus; already committed under `002-fable-mode-efficiency-research/research/lineages/` |
| deep-loop-runtime `post-dispatch-validate.ts` | Internal | Green | Host for the advisory hook; edited in place |
| doctor command route schema (`route-validate.sh`) | Internal | Green | Validates the new read-only route |

This is the first fable-5 phase to ship. It has no dependency on the governor capsule, fail-loud provenance, or subagent-injection phases; those phases depend on this baseline, not the reverse.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The advisory edit affects a blocking verdict, or the new route fails validation.
- **Procedure**: Revert the `post-dispatch-validate.ts` diff to drop the advisory block; delete the `fable-mode` route entry from `_routes.yaml` and remove `doctor_fable-mode.yaml` and `fable-mode-check.cjs`; the standalone `fable-metrics.cjs` and the baseline snapshot are read-only artifacts and can stay in place with no runtime effect.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Metric + baseline) ──► Phase 2 (Advisories + route) ──► Phase 3 (Verify + docs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 (Metric + baseline) | None | Phase 2, Phase 3 |
| Phase 2 (Advisories + route) | Phase 1 | Phase 3 |
| Phase 3 (Verify + docs) | Phase 1, Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Metric + baseline) | Med | 4-6 hours |
| Phase 2 (Advisories + route) | Med | 3-5 hours |
| Phase 3 (Verify + docs) | Low | 1-2 hours |
| **Total** | | **8-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `vitest` confirms the advisory path is non-blocking
- [ ] `route-validate.sh` passes for the new read-only route
- [ ] Baseline snapshot committed alongside the script

### Rollback Procedure
1. Revert the `post-dispatch-validate.ts` advisory block (the only runtime behavior change).
2. Remove the `fable-mode` route entry from `_routes.yaml` and delete `doctor_fable-mode.yaml` and `fable-mode-check.cjs`.
3. Re-run `route-validate.sh` and the deep-loop-runtime `vitest` suite to confirm a clean baseline.
4. Leave `fable-metrics.cjs` and the baseline snapshot in place; they are inert read-only artifacts.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. No schema or stored data changes; the baseline snapshot is a static artifact.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Phase 1        │────►│   Phase 2        │────►│   Phase 3        │
│ fable-metrics +  │     │ advisories +     │     │ verify + docs    │
│ baseline         │     │ doctor route     │     │                  │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `fable-metrics.cjs` | None | Five metrics + baseline snapshot | `fable-mode-check.cjs`, advisory hook |
| `post-dispatch-validate.ts` advisory | `fable-metrics.cjs` signals | Non-blocking advisories | Phase 3 verification |
| `fable-mode-check.cjs` | `fable-metrics.cjs` | On-demand metric render | `/doctor fable-mode` route |
| `/doctor fable-mode` route | `fable-mode-check.cjs` | Read-only diagnostic surface | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1: `fable-metrics.cjs` + baseline** - 4-6 hours - CRITICAL
2. **Phase 2: doctor route + advisory hook** - 3-5 hours - CRITICAL
3. **Phase 3: verify + docs** - 1-2 hours - CRITICAL

**Total Critical Path**: 8-13 hours

**Parallel Opportunities**:
- The `post-dispatch-validate.ts` advisory edit and the `doctor_fable-mode.yaml` route asset can be drafted in parallel once `fable-metrics.cjs` exposes its metric API.
- The optional `model-benchmark.md` note can be written any time after the metric definitions are fixed.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Metrics computed | `fable-metrics.cjs` reports all five metrics over the 002 corpus | End of Phase 1 |
| M2 | Baseline captured | Baseline snapshot artifact recorded with contributing lineages | End of Phase 1 |
| M3 | Delivery shipped | `/doctor fable-mode` read-only route validates; advisories non-blocking | End of Phase 2 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

> Full ADRs with five-checks and risk tables live in `decision-record.md`. Summary below.

### ADR-001: Build a runtime-agnostic `fable-metrics.cjs` instead of porting `leak_test.py`

**Status**: Proposed

**Context**: The only existing behavioral metric (`leak_test.py`) reads `~/.claude/projects/`, so it cannot see the framework's runtime-agnostic deep-loop state.

**Decision**: Write a new `fable-metrics.cjs` that reads deep-loop state JSONL plus iteration markdown by path argument, so it works across Claude, Codex, and OpenCode runs.

**Consequences**:
- Portable across all three runtimes and reusable by later phases.
- Costs a from-scratch parser instead of reusing the existing script; mitigated by keeping the metric set small and the parser defensive.

**Alternatives Rejected**:
- Port `leak_test.py` as-is: rejected because it is Claude-path-coupled and would not read the framework's own state.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
