---
title: "Implementation Plan: Governance and Rollout Layer"
description: "Authors five governance documents plus a CI-checkable rollout manifest that order the eighteen build phases by the five inviolable edges, encode the four-beat migration runbook, codify INV-1 and INV-2 and freeze the eighteen-item NO-GO list. No engine or schema code ships here."
trigger_phrases:
  - "governance rollout layer plan"
  - "seventeen stage rollout sequence plan"
  - "four beat migration runbook plan"
  - "inv-1 inv-2 safety model plan"
  - "eighteen item no-go list plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/028-governance-rollout"
    last_updated_at: "2026-07-04T17:12:03.094Z"
    last_updated_by: "benchmark-test-author"
    recent_action: "Specified the conformance benchmark and flags-off test in plan 4 and 5"
    next_safe_action: "Author rollout-sequence.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-028-gov-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Ship governance documents and a manifest, never engine or schema code"
---
# Implementation Plan: Governance and Rollout Layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown governance docs plus a CI-checkable rollout manifest |
| **Framework** | system-spec-kit phase folders and the validate.sh rule registry |
| **Storage** | Five governance documents on disk under the phase folder |
| **Testing** | validate.sh strict on the phase scaffold plus a manifest topological-sort check |

### Overview
This phase authors the canonical governance layer for the data-quality program as five grounded documents plus one CI-checkable rollout manifest. `rollout-sequence.md` is the topological sort of the five inviolable edges across seventeen stages and seven phases. `migration-runbook.md` is the four-beat WARN BACKFILL REMEASURE ERROR discipline plus the Stage-0 census. `safety-model.md` makes INV-1 and INV-2 reviewable. `measurement-plan.md` fixes one reader and one metric with no cross-credit. `no-go-list.md` consolidates the eighteen NO-GO items against ten anti-patterns. No engine, detector or schema code ships here.
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
Reuse-first governance over the shipped phase-folder discipline. The rollout manifest is a read-time document and the four-beat runbook is imported by reference, never re-derived per gate.

### Key Components
- **rollout-sequence.md**: the seventeen-stage seven-phase order, each stage mapped to its sibling phase folder, with the five edges named at each stage boundary (`research/research.md:104-118`).
- **migration-runbook.md**: the four-beat runbook plus the Stage-0 census table with the known starting numbers, imported by every gate phase.
- **safety-model.md**: INV-1 and INV-2 as a reviewable checklist, the four human boundaries and the four standing drift guards (`research/research.md:110`).
- **measurement-plan.md**: one reader and one metric, the three sweep escape classes and the prod-mode completeRecall-at-3 admissibility rule.
- **no-go-list.md**: the eighteen NO-GO items keyed to ten anti-patterns, drawn from the Tier-D table (`research/research.md:55-66`) and the novel table (`research/research.md:83-85`).

### Data Flow
A contributor reads `rollout-sequence.md` to find the next safe stage, imports `migration-runbook.md` to run a gate flip in four beats, checks `safety-model.md` before classifying a fix or promoting a retrieval change, reads `measurement-plan.md` to pick the single admissible metric and reads `no-go-list.md` before proposing a new detector or lane. No document writes runtime state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase ships governance documents and a rollout manifest, not code. The table records the surfaces the documents reference without changing.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `rollout-sequence.md` and the four sibling governance docs | New governance documents | Create under the phase folder | validate.sh strict on the phase folder exits 0 |
| `legacy_grandfathered` bypass (`validate.sh`) | The A4 ERROR-beat deletion target | Reference only, not flipped here | grep shows the bypass name is cited and owned by `004-schema-warn-to-error` |
| `validator-registry.json` | The rule registry the gate phases extend | Reference only, no rule added here | grep shows no new rule registered by this phase |
| `run-eval-v2.mjs` | The prod-mode recall harness the C2 gate drives | Reference only as the measurement instrument | measurement-plan.md names it as the prod-at-3 reader with no change |
| The eighteen sibling phase specs | The phases this layer orders | Not a consumer, never edited | grep shows no sibling spec is modified by this phase |

Required inventories:
- Same-class producers: `rg -n 'rollout-sequence|migration-runbook|safety-model|measurement-plan|no-go-list' .opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/028-governance-rollout`.
- Consumers of changed symbols: `rg -n 'legacy_grandfathered|completeRecall|INV-1|INV-2' . --glob '*.md' --glob '*.sh' --glob '*.json'`.
- Matrix axes: document (sequence vs runbook vs safety vs measurement vs no-go), beat (WARN vs BACKFILL vs REMEASURE vs ERROR), reader tier (write-time vs sweep vs retrieval).
- Algorithm invariant: the rollout order is a valid topological sort of the five edges and no stage precedes a stage it depends on.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the five inviolable edges and the seventeen-stage order against `research/research.md:104-118`
- [ ] Confirm the Stage-0 census numbers against the parent research and the live spec root
- [ ] Confirm the eighteen NO-GO items split across `research/research.md:55-66` and `research/research.md:83-85`

### Phase 2: Core Implementation
- [ ] Author `rollout-sequence.md` as the topological sort with each edge named at its stage boundary
- [ ] Author `migration-runbook.md` with the four beats and the Stage-0 census table
- [ ] Author `safety-model.md` with INV-1 and INV-2 as a reviewable checklist
- [ ] Author `measurement-plan.md` with one reader and one metric and the three sweep escape classes
- [ ] Author `no-go-list.md` with the eighteen items keyed to ten anti-patterns

### Phase 3: Verification
- [ ] Confirm the rollout order violates none of the five edges
- [ ] Confirm every gate phase can import the four-beat runbook by reference
- [ ] Confirm the NO-GO list enumerates all eighteen items and marks the three rail-crossing novel rewrites

### Benchmark: rollout-manifest conformance gate
This is an INFRA governance phase so the metric is not recall. Prod search truncates to a three-result floor so completeRecall@3 does not apply here, the retrieval half routes through the prod-mode completeRecall@3 gate that `015-prodmode-recall-gate` owns through the export at `run-eval-v2.mjs:361` (`buildSearchLenses`, `meanCompleteRecallProfile`, `MEASURABILITY_CLASSES`). The write-time analog this phase earns its keep on is a conformance count driven to zero plus a planted-mismatch catch.

- **Metric**: the rollout-manifest edge-violation count from the topological-sort check, the NO-GO enumeration count and the runbook-import resolution count.
- **PASS**: the edge-violation count is 0 across all five inviolable edges, each edge appears as a named stage boundary, the NO-GO enumeration count reads 18 and every gate phase resolves its four-beat runbook import by reference.
- **REGRESS**: any edge-violation above 0, any of the five edges absent as a stage boundary, a NO-GO count below 18 or a gate phase whose runbook reference does not resolve.
- **Planted-mismatch catch**: a deliberately reordered fixture manifest, engine placed after a front door or C2 placed after a retrieval promotion, MUST be flagged at a catch-rate of 1 of 1. This is the regress proof a green corpus alone cannot give.
- **Default-safety**: this phase registers no new SPECKIT flag and adds no `validator-registry.json` rule, so there is no runtime switch to default OFF. The five documents are read-time, removing them restores byte-identical validate.sh output, and reversibility holds with no `SPECKIT_<FLAG>=false` needed because no flag is introduced. The keep-off rationale is that governance is blast-radius review, not a runtime toggle.
- **Reproduce**: `npx vitest run .opencode/skills/system-spec-kit/scripts/tests/governance-rollout-manifest.vitest.ts` for the conformance and planted-mismatch assertions plus `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/004-memory-search-intelligence/002-spec-data-quality/005-shared-engine-and-research/028-governance-rollout --strict` for the scaffold gate. SPECIFIED not run, no code lands in this phase.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The rollout manifest is a valid topological sort of the five edges | manifest sort check |
| Integration | Every gate phase imports the four-beat runbook by reference | doc cross-reference grep |
| Manual | validate.sh strict on the phase scaffold exits 0 | validate.sh |
| Benchmark | The topo-sort conformance count is 0 and a planted out-of-order fixture is caught 1 of 1 | `scripts/tests/governance-rollout-manifest.vitest.ts` (asserts edge-violations, NO-GO count of 18, runbook-import resolution) |
| Regression | ALL_SPECKIT_FLAGS gains no flag, no `validator-registry.json` rule is added and validate.sh strict output stays byte-identical with every flag default-off | `mcp_server/tests/flag-ceiling.vitest.ts` (`ALL_SPECKIT_FLAGS`, `FLAG_CHECKERS`) plus a byte-identical validate.sh corpus run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 015-prodmode-recall-gate | Internal | Green | The retrieval half of Phase VII cannot promote without the prod-at-3 gate |
| 026-shared-safe-fix-engine | Internal | Green | The rollout orders engine before front doors so the engine phase must land first |
| research/research.md census numbers | Internal | Green | A stale census number lets a gate flip before its backfill reads zero |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The rollout order violates an edge, or a governance doc drifts from the named sibling folders.
- **Procedure**: Revert the five governance documents and restore the phase folder to the scaffold trio.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1 (Census) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Medium | 5-8 hours |
| Verification | Medium | 2-3 hours |
| **Total** | | **8-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Topological-sort baseline of the five edges captured
- [ ] Stage-0 census numbers confirmed against the live spec root
- [ ] NO-GO list cross-checked against both research tables

### Rollback Procedure
1. Remove the five governance documents from the phase folder
2. Restore the scaffold trio of spec.md, description.json and graph-metadata.json
3. Re-run validate.sh strict to confirm a clean exit
4. Confirm no sibling phase spec was modified

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
