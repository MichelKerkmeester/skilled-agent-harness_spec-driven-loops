---
title: "Implementation Plan: Memory Retention / Forgetting + Recall-Diversity Result-Shaping (028 Wave-1)"
description: "Sequenced approach for the retention/forgetting + recall-diversity result-shaping candidates: spare-only eligibility and C7-A dominance cap first (independent, reversible), then the schema/flag-gated forget-allowlist, never-truncate and trust-gated quarantine. Erasure-surface candidates stay deferrals."
trigger_phrases:
  - "memory retention forgetting plan"
  - "c7-a dominance cap plan"
  - "spare only eligibility sequencing"
  - "trust gated quarantine plan"
  - "erasure surface deferral"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-speckit-memory/011-retention-forgetting"
    last_updated_at: "2026-07-04T17:51:08.036Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author retention/forgetting impl plan"
    next_safe_action: "Implement T101 spare-only forget eligibility"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-011-retention-forgetting"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Memory Retention / Forgetting + Recall-Diversity Result-Shaping (028 Wave-1)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node), Spec-Kit Memory MCP server |
| **Framework** | Custom MCP server (`mcp_server/`), 4-stage search pipeline + retention sweep + reconsolidation bridge |
| **Storage** | SQLite (`memory_index`, causal edges, retention rows) plus vector index |
| **Testing** | Vitest (`mcp_server/**/*.vitest.ts`) + handler test suites |

### Overview
Implement the retention/forgetting + recall-diversity result-shaping candidates from the 028/001 research, sequenced so the two independent reversible wins (spare-only forget eligibility + the C7-A dominance cap) land first, then the schema/flag-gated items (forget-allowlist, never-truncate, trust-gated quarantine). The three erasure-surface candidates (cascade-refuse-whole, namespace-authorize, writer-signing) stay deferrals, recorded in spec §6, never built here. All implement-candidates are default-OFF or order-preserving-by-default. Nothing ships an always-on destructive path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §2-3)
- [x] Success criteria measurable (spec.md §5)
- [x] Dependencies identified (spec.md §6, gates: shared-infra-dep, schema-migration, needs-benchmark)

### Definition of Done
- [ ] P0 candidates (spare-only, C7-A) implemented with research-cited acceptance criteria + tests
- [ ] Vitest passing for touched modules, primary score order unchanged where order-preserving
- [ ] Docs updated (spec/plan/tasks), per-candidate STATUS reconciled against 030 §14
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pipeline + reducer: forget eligibility is a reducer over retention rows. The dominance cap and never-truncate are result-set partition/cap stages inside the stage-4 filter and the query layer. Quarantine is a gate in the reconsolidation bridge that writes a CONTRADICTS edge consumed at read-time by edge-presence exclusion.

### Key Components
- **Feedback-retention reducer** (`feedback-retention-reducer.ts`): owns forget eligibility. Spare-only extends its AND-conjunction and finite-guards.
- **Retention sweep** (`memory-retention-sweep.ts`): owns the `unreferenced` axis. Forget-allowlist swaps the `referenced_count` cache read for a live 6-label incoming-edge read.
- **Stage-4 filter** (`stage4-filter.ts`): owns the final `slice(0, config.limit)`. C7-A inserts a dominance-cap partition immediately before it.
- **Vector-index queries** (`vector-index-queries.ts`): owns the constitutional always-surface prefix. Never-truncate caps that prefix.
- **Reconsolidation bridge** (`reconsolidation-bridge.ts`): advisory-only today. Trust-gated quarantine adds a trust gate + CONTRADICTS edge + reconcile signal behind a default-OFF flag.

### Data Flow
Save/update → reconsolidation bridge (quarantine gate) → memory_index. Retention sweep → feedback-retention reducer (spare-only) → forget decision (allowlist live-edge check). Recall → stage-1..stage-4 pipeline → stage-4 dominance cap (C7-A) + constitutional-prefix cap (never-truncate) → final slice → envelope. CONTRADICTS edges written by quarantine are excluded at read-time by edge-presence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Applies: spare-only and forget-allowlist touch retention/forget policy (persistence-adjacent). C7-A and never-truncate touch public recall responses (result-set shape). Quarantine touches a shared write/merge policy. All warrant the surface inventory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `feedback-retention-reducer.ts:15,101-114,153-162` | producer: forget eligibility (spares tier/pin only) | update: full AND + finite-guards + trust/age axes + extend `EXTENDABLE_TIERS` | grep `EXTENDABLE_TIERS`, `evaluateFeedbackRetention`, unit-test spare-on-positive-feedback + non-finite-spare |
| `memory-retention-sweep.ts:142-262` | producer: `unreferenced` axis via `referenced_count` cache | update: read live incoming edges from the 6-label allowlist (needs label column) | grep `referenced_count`, `unreferenced`, locate allowlist symbol, test allowlist-vs-ambient-edge |
| `stage4-filter.ts:305-309,170-177` | producer: final `slice(0, config.limit)` (no per-source cap) | update: insert dominance-cap partition before the slice | grep `slice(0, config.limit)`, test single-folder-dominance + spill-if-underfilled |
| `vector-index-queries.ts:435` | producer: constitutional always-surface prefix (uncapped) | update: cap the prefix | grep constitutional/always-surface query site, test constitutional-starvation case |
| `reconsolidation-bridge.ts:114-163` | policy: merge routing (advisory-only) | update: trust gate + CONTRADICTS edge + reconcile signal, default-OFF | grep `reconsolidate(`, trust threshold, test gate-only-when-either-side>=0.7 |
| `scope-governance.ts:289`, `tools/memory-tools.ts`, sign/verify (GAP) | consumers/policy: erasure surface | NOT a consumer (deferred), record only | spec §6 deferral rows, no code change |

Required inventories:
- Same-class producers: `rg -n 'slice\(0, *config\.limit\)|EXTENDABLE_TIERS|referenced_count|reconsolidate\(' .opencode/skills/system-spec-kit/mcp_server`.
- Consumers of changed symbols: `rg -n 'evaluateFeedbackRetention|stage4|always.?surface|reconsolidation' .opencode/skills/system-spec-kit/mcp_server --glob '*.ts'`.
- Matrix axes: forget eligibility (tier × pin × decayed-importance × trust × unreferenced × age), cap (per-folder count × limit-headroom), quarantine (trust-side × edge-presence).
- Algorithm invariant: forget eligibility is a strict AND where any axis can only SPARE. The cap is spill-if-underfilled (never drops below `config.limit` when fillable). Quarantine is reversible edge-presence exclusion.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the existing forget-learning double-gate (`SPECKIT_FEEDBACK_RETENTION_LEARNING` + `mode=shadow`) and register a default-OFF reconsolidation flag in `ENV_REFERENCE.md`
- [ ] Locate the forget-allowlist symbol / decide label-column vs live-edge-join (resolves the iter-016 NEEDS-BENCHMARK unknown)
- [ ] Capture a recall baseline for C7-A and never-truncate (regression-baseline rule, these are result-set changes)

### Phase 2: Core Implementation
- [ ] **P0: spare-only eligibility**: extend `EXTENDABLE_TIERS`, full AND-conjunction, finite-guards before comparison, trust/age axes, refuse both-floors-at-ceiling (ships shadow/dark)
- [ ] **P0: C7-A dominance cap**: in-place partition before the stage-4 slice, default N=3, spill-if-underfilled, cap key `spec_folder` primary / `sessionId` secondary
- [ ] **P1: forget-allowlist**: `unreferenced` axis reads live 6-label incoming edges, exclude AUDIT/provenance/scope edges (schema/label-gated)
- [ ] **P1: never-truncate-always-surface**: cap the constitutional always-surface prefix (benchmark-gated)
- [ ] **P1: trust-gated quarantine**: trust gate before merge routing, CONTRADICTS edge + reconcile signal + read-time edge-presence exclusion, default-OFF flag

### Phase 3: Verification
- [ ] Unit tests per candidate (spare-on-positive-feedback, non-finite-spare, single-folder-dominance + spill, constitutional-starvation, gate-only-when-trust>=0.7)
- [ ] Re-run touched-module vitest, confirm primary order unchanged where order-preserving, re-run the recall baseline and report the delta
- [ ] Reconcile spec §6 STATUS table against 030 §14, mark done candidates with commit hash, pending with gate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Forget-eligibility AND + finite-guards, cap partition + spill, constitutional-prefix cap, quarantine trust gate | Vitest |
| Integration | Retention sweep end-to-end (allowlist live-edge), recall pipeline (cap + never-truncate), reconsolidation bridge (quarantine → read-time exclusion) | Vitest + handler suites |
| Manual | Baseline-vs-delta recall on the live corpus for the two result-set changes (C7-A, never-truncate) | recall fixtures / corpus query |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `SPECKIT_FEEDBACK_RETENTION_LEARNING` + `mode=shadow` double-gate | Internal | Green | spare-only ships dark + audit-observable |
| forget-allowlist label column / live-edge symbol | Internal | Yellow | `forget-allowlist` blocked (schema-migration / symbol-location) |
| Recall baseline capture | Internal | Yellow | C7-A + never-truncate thresholds unvalidated until baseline exists |
| Default-OFF reconsolidation flag (`SPECKIT_RECONSOLIDATION`) | Internal | Green | quarantine cannot ship safely without the gate |
| Erasure surface (cascade / namespace / signing) | External (own packet / threat model) | Red | deferred, recorded, not built |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A forget-eligibility regression (a referenced/positive-feedback row deleted), a recall regression (the cap or never-truncate evicts the right answer) or a quarantine excluding the wrong side.
- **Procedure**: spare-only and quarantine are flag-gated, flip the flag OFF to revert. C7-A and never-truncate are config-defaulted, set the cap to the limit (no-op) or revert the partition, then git revert the touched module. No data migration is applied by the result-shaping candidates (allowlist label column, if added, is additive and reversible).
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1 (baseline) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (flags + allowlist-symbol + baseline) | None | Core, Verify |
| Core P0 (spare-only, C7-A) | Setup (flags, baseline) | Verify |
| Core P1 (allowlist, never-truncate, quarantine) | Setup (allowlist symbol, baseline, recon flag) | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | flag registration + allowlist-symbol location + baseline capture |
| Core Implementation | Med-High | 2 P0 (S each per research) + 3 P1 (allowlist M / never-truncate S+benchmark / quarantine M) |
| Verification | Med | per-candidate unit tests + baseline-vs-delta recall |
| **Total** | | **Med-High (4 implement candidates + 1 gated flag, 3 deferrals doc-only)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Recall baseline captured for C7-A + never-truncate (before/after delta)
- [ ] Default-OFF flags confirmed for spare-only (shadow) and quarantine
- [ ] Allowlist label column (if added) confirmed additive + reversible

### Rollback Procedure
1. Disable the flag: spare-only `mode=shadow`/`SPECKIT_FEEDBACK_RETENTION_LEARNING`=off, quarantine `SPECKIT_RECONSOLIDATION`=off
2. Revert config defaults: C7-A cap N = limit (no-op), never-truncate cap removed
3. `git revert` the touched module commit(s)
4. Re-run the recall baseline to confirm parity restored

### Data Reversal
- **Has data migrations?** Only `forget-allowlist` (additive label column), additive, no destructive migration.
- **Reversal procedure**: Drop/ignore the label column (read path falls back to `referenced_count`). CONTRADICTS quarantine edges are removable (edge-presence exclusion reverses on edge delete).
<!-- /ANCHOR:enhanced-rollback -->
