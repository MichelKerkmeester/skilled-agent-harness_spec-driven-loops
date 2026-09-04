---
title: "Implementation Plan: Phase 1: baseline-and-instrumentation"
description: "How the starting numbers get captured: read coverage from the active vector table, re-run the baseline capture script, sweep latency over the frozen corpus, and surface the lane's own health record read-only."
trigger_phrases:
  - "baseline capture plan"
  - "coverage query"
  - "advisor status fields"
  - "latency sweep"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/001-baseline-and-instrumentation"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the implementation plan"
    next_safe_action: "Run the coverage query and record it"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-001-baseline-and-instrumentation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: baseline-and-instrumentation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node, compiled to `mcp-server/dist/` |
| **Framework** | The advisor daemon, reached through `.opencode/bin/skill-advisor.cjs` |
| **Storage** | SQLite at `mcp-server/database/skill-graph.sqlite`, with `vec_768` as the active vector table |
| **Testing** | Vitest, including the accuracy ratchet under `tests/parity/` |

### Overview

Read the numbers from where the runtime reads them. Coverage comes from the active `vec_<dim>`
table rather than the retired column, the accuracy metrics come from re-running the capture
script, and latency comes from a sweep over the frozen corpus. The one code change is additive
and read-only: the lane already keeps a health record with a `disabledReason`, and the status
handler learns to report it alongside the resolved weight and the vector count.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The daemon answers `advisor_status` and reports freshness `live`
- [ ] The three corpus files exist at the paths the predecessor packet recorded
- [ ] The compiled server under `dist/` is current, so the capture script imports what the source says

### Definition of Done
- [ ] Every acceptance criterion is met or waived against a decision record
- [ ] The status additions are covered by a test that fails without them
- [ ] `research/baseline.md` carries every number this phase measured, each beside the command that produced it
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Read-only observation over a running service. Nothing in this phase writes to the graph database
or changes a score.

### Key Components

- **`lib/skill-graph/skill-graph-db.ts`**: owns `loadSkillEmbeddings`, which prefers the active `vec_<dim>` table when the pointer is set and returns nothing when that table is absent. This is the authority on what coverage means.
- **`lib/scorer/lanes/semantic-shadow.ts`**: keeps `runtimeHealth`, including `activeEmbedder`, `dimMismatch` and `disabledReason`, and already exports a getter for it.
- **`lib/scorer/lane-registry.ts`**: resolves lane weights, with `semantic_shadow` at 0.05 and `live: true`.
- **`handlers/advisor-status.ts`**: the surface a caller can read without scoring a prompt.
- **`scripts/routing-accuracy/capture-scorer-eval-baseline.mjs`**: the only sanctioned way to produce the baseline file.

### Data Flow

A status call reads the active pointer and the vector table through a read-only handle, asks the
lane for its health record, and returns both beside the resolved weights. A recommendation call is
untouched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `handlers/advisor-status.ts` | Reports freshness, skill count and lane weights | update | `tests/handlers/advisor-status.vitest.ts` fails without the new fields |
| `lib/scorer/lanes/semantic-shadow.ts` | Owns the runtime health record | update, export only | `getSemanticShadowRuntimeHealth` is called from the status path and nowhere in scoring |
| `lib/scorer/fusion.ts` | Fuses lane scores | unchanged | No diff. A diff here voids the baseline this phase captures |
| `schemas/advisor-tool-schemas.ts` | Declares the status response shape | update | The response validates against the schema in the same test |
| `references/scoring/advisor-scorer.md` | Documents the lane weights and state | update | The document stops saying the lane is shadow-only |

Required inventories:
- Same-class producers: `rg -n 'semantic_shadow|shadowOnly' .opencode/skills/system-skill-advisor/mcp-server --glob '*.ts'`.
- Consumers of changed symbols: `rg -n 'getSemanticShadowRuntimeHealth|laneWeights' . --glob '*.ts' --glob '*.md'`.
- Matrix axes: pointer present or absent, active table present or absent, backend reachable or not. Nine rows before completion is claimed.
- Algorithm invariant: a node counts as covered when the active vector table holds a row for its id under the active model. Any other definition disagrees with `loadSkillEmbeddings`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The coverage count against a fixture database with a partly filled vector table | Vitest |
| Integration | `advisor_status` through the CLI front door against the live daemon | The advisor CLI |
| Manual | Twenty corpus prompts timed end to end, output and exit status written per row | A background shell script |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor daemon | Internal | Green | No live measurement, and the phase cannot close |
| Local embedding backend | External | Yellow | The prompt side of the lane goes quiet, which the report records rather than hides |
| Frozen corpora in packet 052 | Internal | Green | Without them there is no gate to measure against |
| Compiled `dist/` output | Internal | Yellow | A stale build makes the capture script measure last week's scorer |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The status additions change a recommendation, or the re-captured baseline disagrees with the committed one by more than rounding.
- **Procedure**: Revert the handler and schema changes, restore the committed baseline file, and re-run the ratchet to confirm the numbers returned.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (daemon live, corpora hashed) ──► Measure (coverage, metrics, latency)
                                            │
                                            └──► Instrument (status fields) ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Measure |
| Measure | Setup | Instrument, Verify |
| Instrument | Measure | Verify |
| Verify | Instrument | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour |
| Core Implementation | Medium | Three to five hours, most of it the latency sweep |
| Verification | Low | One to two hours |
| **Total** | | **Five to eight hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The committed baseline file is copied into `scratch/` before re-capture
- [ ] No lane weight override is set in the environment during measurement
- [ ] The daemon generation is recorded before and after the sweep

### Rollback Procedure
1. Restore the committed baseline file from `scratch/`
2. Revert the handler and schema diff
3. Re-run the accuracy ratchet and confirm every metric matches the restored file
4. Record the reversal in the phase log, because a discarded measurement is still evidence

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. Every database access in this phase is read-only
<!-- /ANCHOR:enhanced-rollback -->

---
