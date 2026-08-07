---
title: "Implementation Plan: deep-context loop"
description: "Build deep-context as the 3rd deep-loop-runtime consumer: an inward, iterative, heterogeneous-parallel codebase-context loop with a loop_type='context' coverage-graph extension and cross-executor-agreement convergence that ships a reuse-first Context Report."
trigger_phrases:
  - "deep-context plan"
  - "context loop plan"
  - "coverage graph context"
  - "heterogeneous parallel sweep"
  - "reuse catalog report"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/010-deep-context-gathering/001-context-loop-foundation"
    last_updated_at: "2026-06-06T19:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added alignment + catalog/playbook + Barter phase to plan"
    next_safe_action: "3 sonnet agents align skill, build catalog/playbook, integrate Barter"
    blockers: []
    key_files:
      - "specs/system-deep-loop/z_archive/010-deep-context-gathering/001-context-loop-foundation/research/research.md"
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts"
    session_dedup:
      fingerprint: "sha256:1aecb6c05c8afddbea2821d951fa97eec42d3241a133b2c0cd0c60677edc6667"
      session_id: "dc-134-20260606"
      parent_session_id: null
    completion_pct: 80
    open_questions:
      - "Final slice granularity + convergence thresholds (calibration)"
      - "Native-parallel backport to research/review fan-out (follow-up)"
    answered_questions:
      - "Reuse deep-loop-runtime as the 3rd consumer"
      - "loop_type='context' additive schema at SCHEMA_VERSION 3"
---
# Implementation Plan: deep-context loop

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (coverage-graph libs), Node CJS (scripts), Markdown (skill/command/agent) |
| **Framework** | deep-loop-runtime (shared executor pool, prompt-pack, atomic-state, coverage-graph) |
| **Storage** | SQLite coverage graph (regenerable per-session cache), JSONL lineage state |
| **Testing** | vitest (coverage-graph + executor-config + convergence), e2e convergence smoke |

### Overview
deep-context is the 4th deep loop and 3rd consumer of `deep-loop-runtime`: an inward, iterative codebase-context-gathering loop that runs a heterogeneous executor pool (native + cli-opencode + cli-codex) in parallel over a shared scope by-model, and synthesizes a reuse-first Context Report. Convergence is driven by cross-executor agreement plus a relevance gate, layered on a `loop_type='context'` extension of the coverage graph (SCHEMA_VERSION 2 to 3) with no new MCP tools.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md, research.md)
- [x] Success criteria measurable (SC-001..SC-003 in spec.md)
- [x] Dependencies identified (deep-loop-runtime, Code Graph)

### Definition of Done
- [x] All acceptance criteria met (REQ-001..REQ-005 implemented)
- [x] Tests passing (99/99 coverage-graph, 36/36 executor-config, e2e convergence smoke green)
- [ ] Docs updated (spec/plan/tasks/checklist/decision-record/implementation-summary synchronized)
- [ ] Alignment + catalog/playbook + Barter integration phase complete (see Section 8)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared-runtime consumer with reducer-owned-files: read-only analyzer seats fan out, the host writes all merged state.

### Key Components
- **Coverage-graph context layer**: `coverage-graph-db.ts` (`loop_type='context'`, `ContextNodeKind`/`ContextRelation`, `CONTEXT_WEIGHTS`, SCHEMA_VERSION 3), `coverage-graph-signals.ts` (`computeContextSignals`/`computeContextSignalsFromData`), `coverage-graph-query.ts` (gap branch).
- **Convergence**: `convergence.cjs` `evaluateContext` — five signals, 0.10 threshold, agreement + relevance guards.
- **Heterogeneous parallel dispatch**: native Task seats via the council scaffold `dispatchCouncilSeats`, concurrent with the cli-opencode/cli-codex pool.
- **Per-model framing**: `promptFramework` lineage field (`n` key) in `executor-config.ts`.
- **deep-context skill/command/agent**: `.opencode/skills/deep-context/**`, `/deep:start-context-loop` (+ auto/confirm YAML), `@deep-context` LEAF read-only agent.

### Data Flow
Anchors are seeded from the code graph into slices; the host dispatches the heterogeneous pool over the shared scope by-model; read-only seats emit schema-bound findings into their artifact dirs; the host merges, deduplicates, resolves refs against the code graph, upserts the coverage graph, evaluates convergence, and writes the Context Report.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `coverage-graph-db.ts` | Owns coverage schema for research/review | update (add `'context'`, SCHEMA_VERSION 3) | `rg -n "'context'" coverage-graph-db.ts`; 99/99 tests |
| `coverage-graph-signals.ts` | Computes per-loop convergence signals | update (add context signals) | signal unit math confirmed |
| `coverage-graph-query.ts` | Serves gap/coverage queries | update (context gap branch) | query test green |
| `convergence.cjs` | Evaluates research/review convergence | update (`evaluateContext` branch) | e2e convergence smoke green |
| `executor-config.ts` | Validates lineage/executor config | update (`promptFramework`/`n` field) | 36/36 executor-config tests |
| research/review loop paths | Existing consumers of the runtime | unchanged (dispatch on `loop_type`) | research/review tests unaffected |

Required inventories:
- Same-class producers: `rg -n "LoopType|VALID_KINDS|VALID_RELATIONS|SCHEMA_VERSION" .opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-db.ts`.
- Consumers of changed symbols: `rg -n "computeContextSignals|evaluateContext|promptFramework|loop_type" .opencode/skills/deep-loop-runtime --glob '*.ts' --glob '*.cjs'`.
- Matrix axes: loop_type (research|review|context) x signal path (db|signals|query|convergence) — context rows added, research/review rows unchanged.
- Algorithm invariant: the schema change is additive (CHECK gains `'context'`); the drop/recreate migration is lossless because the coverage graph is a regenerable per-session cache.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Ownership ADR authored (decision-record.md, ADR-001..ADR-008)
- [x] Reuse map confirmed (10 runtime libs as-is; 3 graph modules + convergence to extend)
- [x] Code Graph readiness confirmed for frontier seeding

### Phase 2: Core Implementation
- [x] Coverage-graph `loop_type='context'` + SCHEMA_VERSION 3 (`coverage-graph-db.ts`)
- [x] `computeContextSignals`/`computeContextSignalsFromData` (`coverage-graph-signals.ts`)
- [x] `evaluateContext` + context branch (`convergence.cjs`); context gap branch (`coverage-graph-query.ts`)
- [x] `promptFramework` lineage field (`executor-config.ts`)
- [x] deep-context skill (SKILL.md DQI 88, references, assets), `/deep:start-context-loop` (+ auto/confirm YAML), `@deep-context` agent
- [x] Native-parallel via `dispatchCouncilSeats` concurrent with the CLI pool

### Phase 3: Verification
- [x] 99/99 coverage-graph tests pass; signal unit math confirmed
- [x] 36/36 executor-config tests pass
- [x] e2e convergence smoke green
- [ ] Heterogeneous smoke run on a real target + validate.sh strict on docs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Coverage-graph context kinds/relations/weights; context signal math; executor-config `promptFramework` | vitest |
| Integration | `evaluateContext` composite-score + agreement/relevance guards; gap query branch | vitest, e2e convergence smoke |
| Manual | `/deep:start-context-loop` heterogeneous run producing a code-graph-verified Context Report | CLI run + Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| deep-loop-runtime (10 libs + fanout/upsert/query/status) | Internal | Green | No executor pool, prompt-pack, atomic-state, or graph |
| Code Graph (frontier seeding + ref resolution) | Internal | Green | Degraded seeding; Glob+Grep fallback |
| Council scaffold `dispatchCouncilSeats` | Internal | Green | No native-parallel batch dispatch |
| Ownership ADR sign-off | Internal | Green (Accepted) | Blocks shared schema change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Context-branch change regresses research/review tests, or the schema bump corrupts an existing graph.
- **Procedure**: Revert `SCHEMA_VERSION` to 2 and remove `'context'` CHECK values; remove the context signal/convergence branches; delete the deep-context skill/command/agent. The coverage graph recreates clean on next open (regenerable cache, no durable loss).
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: ADR + reuse map) ──────┐
                                        ├──► Phase 2 (Core: graph + convergence + skill) ──► Phase 3 (Verify)
Phase 1.5 (Code Graph readiness) ───────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (ADR) | None | Core, Verify |
| Code Graph readiness | None | Core |
| Core | Setup, Code Graph readiness | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (ADR + reuse map) | Med | 2-3 hours |
| Core Implementation (graph + convergence + skill/command/agent) | High | 10-16 hours |
| Verification (tests + smoke + docs) | Med | 2-4 hours |
| **Total** | | **14-23 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Coverage graph confirmed regenerable (no backup needed for the cache)
- [x] Context logic gated behind `loop_type='context'` branches
- [x] Runtime test suite green before merge

### Rollback Procedure
1. Remove the context branches from `convergence.cjs` and the context signal functions.
2. Revert `SCHEMA_VERSION` to 2 and drop `'context'` from the CHECK values in `coverage-graph-db.ts`.
3. Delete `.opencode/skills/deep-context/**`, the command, and the agent.
4. Smoke-test research/review convergence to confirm the runtime is unchanged.

### Data Reversal
- **Has data migrations?** Yes (additive CHECK + SCHEMA_VERSION 2 to 3, drop/recreate).
- **Reversal procedure**: None required for data; the coverage graph is a per-session cache and recreates from lineage JSONL on the next open.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│  ADR/setup  │     │ graph+conv  │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │ skill/cmd │
                    │  /agent   │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Ownership ADR | None | Schema-change authorization | Coverage-graph extension |
| Coverage-graph context layer | ADR | Context kinds/relations/signals | Convergence, report |
| Convergence (`evaluateContext`) | Coverage-graph context layer | Stop decision | Loop completion |
| deep-context skill/command/agent | ADR, executor-config field | Runnable loop | Heterogeneous smoke run |
| Context Report | All above | Reuse-first briefing | `/speckit:plan` Step-5 consumption |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Ownership ADR (ADR-001/ADR-002)** - 2-3 hours - CRITICAL
2. **Coverage-graph context layer + SCHEMA_VERSION 3** - 4-6 hours - CRITICAL
3. **Convergence `evaluateContext` + signals** - 3-5 hours - CRITICAL

**Total Critical Path**: 9-14 hours

**Parallel Opportunities**:
- deep-context skill/command/agent authoring runs alongside the convergence work once the ADR fixes node-kind names.
- `promptFramework` lineage field and the cli-* hardening run independent of the coverage-graph edits.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Ownership ADR accepted | ADR-001..ADR-008 record consumer, schema, convergence, dispatch, contract | Phase 1 |
| M2 | Coverage-graph context layer + convergence done | 99/99 graph tests + signal math + e2e convergence smoke green | Phase 2 |
| M3 | Loop runnable + report verified | `/deep:start-context-loop` emits a code-graph-verified Context Report | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: deep-context as 3rd deep-loop-runtime consumer

**Status**: Accepted

**Context**: An inward codebase-context loop was needed before plan/implement; the runtime mandates an ownership ADR for a 3rd consumer.

**Decision**: Register deep-context as the 3rd consumer, reusing 10 libs as-is and extending only the coverage-graph layer plus `convergence.cjs`. Full detail and the other seven decisions live in `decision-record.md`.

**Consequences**:
- One executor pool, prompt-pack, and coverage-graph contract serve three loop types.
- The runtime gains a third dependent, so schema/convergence changes need wider regression coverage (gated by the full test suite).

**Alternatives Rejected**:
- Standalone context tool: duplicates the executor pool, atomic-state, and graph machinery.

---


---

<!-- ANCHOR:phase-alignment -->
## 8. PHASE: ALIGNMENT, CATALOG/PLAYBOOK & BARTER INTEGRATION

The core build (runtime `loop_type='context'`, skill/command/agent, ADR, Level-3 docs) is verified. This phase brings the shipped deep-context skill up to the same documentation and code conventions the sibling deep skills follow, packages its operator-facing docs, and propagates it into Barter. It does not change loop behavior or the coverage-graph schema; it is convention alignment, packaging, and integration.

### P1: Align deep-context to sk-doc + sk-code :opencode conventions

Bring the skill in line with how `deep-research`, `deep-review`, and `deep-improvement` are structured.

- **SKILL.md smart-router**: add the smart-router preamble/section so the skill matches the sk-doc skill layout and routes correctly.
- **references/ + assets/ frontmatter**: add the sk-doc-required frontmatter to every `references/` and `assets/` markdown file so they validate like the sibling skills.
- **README.md + scripts/README.md**: author a skill-root `README.md` and a `scripts/README.md` per sk-doc README conventions.
- **reduce-state.cjs header + config**: align the `reduce-state.cjs` file header and the skill `config` to sk-code `:opencode` conventions (header banner, no ephemeral tracking labels in comments).

### P2: Feature Catalog + Manual Testing Playbook packages

Produce the two operator-facing document packages the sibling deep skills ship, using their templates/structure as the reference.

- **feature_catalog**: a Feature Catalog package describing deep-context's capabilities, mirroring the sibling deep skills' catalog package shape.
- **manual_testing_playbook**: a Manual Testing Playbook package giving operators a repeatable manual test procedure, mirroring the sibling playbook package shape.

### P3: Barter integration

Make deep-context available inside the Barter repo and offered as an optional add-on by Barter's speckit commands.

- **Barter agent/command refresh**: refresh Barter's `@deep-context` agent and `/deep:start-context-loop` command to match the finalized Public versions.
- **speckit optional add-on**: wire deep-context as an AI-offered optional add-on step into Barter's `/speckit:complete` and `/speckit:plan` so planning/completion can opt into a context loop.

### P4: Public → Barter sync + verification

- **sync**: sync the finalized Public `deep-context` skill and `deep-loop-runtime` runtime into Barter.
- **verify**: confirm Barter's runtime accepts `loop_type='context'` and Barter's speckit commands contain the optional deep-context step.

### Affected surfaces (this phase)

| Surface | Action | Verification |
|---------|--------|--------------|
| `.opencode/skills/deep-context/SKILL.md` | update (smart-router) | sk-doc DQI good; smart-router present |
| `.opencode/skills/deep-context/references/**`, `assets/**` | update (frontmatter) | references/assets/README structure pass |
| `.opencode/skills/deep-context/README.md`, `scripts/README.md` | create | files present + validate |
| `.opencode/skills/deep-context/scripts/reduce-state.cjs` | update (header) | `node --check` passes |
| deep-context `feature_catalog` package | create | matches sibling template |
| deep-context `manual_testing_playbook` package | create | matches sibling template |
| Barter `@deep-context` agent + `/deep:start-context-loop` command | update | match finalized Public |
| Barter `/speckit:complete`, `/speckit:plan` | update (optional step) | commands contain the optional deep-context step |
| Barter `deep-loop-runtime` | sync | runtime accepts `loop_type=context` |

### Verification for this phase

- deep-loop-runtime vitest stays green at 544/544 after any runtime sync.
- `node --check` passes on `reduce-state.cjs`; the skill `config` parses.
- Packet `validate.sh --strict` stays PASSED.
- Barter speckit commands and runtime checks pass as above.
<!-- /ANCHOR:phase-alignment -->

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records (full set in decision-record.md)
-->
