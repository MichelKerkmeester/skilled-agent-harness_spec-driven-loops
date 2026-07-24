---
title: "Implementation Plan: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance"
description: "How the 7-hub compiled-routing scenario matrix, its evidence contract, the non-frozen validators/executor, and the two-plane LUNA-High acceptance stage will be built, consuming 002's status probe and 004's compiled-parity evidence without re-deriving either."
trigger_phrases:
  - "compiled routing playbook plan"
  - "luna high acceptance stage plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/005-playbooks-and-luna-acceptance"
    last_updated_at: "2026-07-21T07:50:27Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Reran 7-hub LUNA-HIGH sweep with real dispatch: 13/14 PASS, 1 FAIL, 0 SKIP"
    next_safe_action: "Use archived real evidence (luna-high-real-20260721-073315) at next cutover review"
    blockers: []
    key_files:
      - "plan.md"
      - "implementation-summary.md"
---
# Implementation Plan: Compiled-Routing Playbooks — Scenario Matrix & LUNA-High Acceptance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
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
| **Language/Stack** | Node CommonJS scripts (validators, executor, LUNA-acceptance harness) + Markdown scenario files, matching the existing playbook and skill-benchmark conventions |
| **Scenario selection** | 7 hubs, one scenario each, each chosen for a distinct route shape rather than duplicated routing semantics |
| **Live-model surface** | `openai/gpt-5.6-luna`, `variant=high`, orchestrator-owned scenario map — the only nondeterministic external dependency in this child |
| **Frozen inputs** | The frozen `load-playbook-scenarios.cjs` loader and the other two scorer files — read-only, never edited |

### Overview

This is a Planned, not-yet-implemented packet. Once built, it delivers two layers: (1) a static, deterministic layer — the 7-hub scenario matrix, its full evidence contract, and non-frozen content/topology validators plus a cutover executor that gates on captured evidence rather than manual assertion; and (2) a live layer — the two-plane LUNA-HIGH acceptance stage, which is the one place in this child where a real model call is in the loop, and is therefore built to fail closed (timeout = SKIP, never a false PASS or FAIL) and to prove generalization via a gold-bearing holdout per hub, not just fitted-prompt success.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `004`'s planned `row.compiledParity` evidence shape is reconciled with this child's evidence-contract field names (or an explicit adapter is planned) before scenario authoring starts.
- [ ] The hub activation manifest shape (`servingAuthority` at `010-live-activation/activation/<hub>/manifest.json`) is confirmed as the direct-read stopgap for serving-status evidence, independent of `002`'s wired probe.
- [ ] The existing `validate-playbook-topology.cjs` and each hub's current `manual-testing-playbook.md` structure are read before any new file is authored, so additions are additive, not duplicative.

### Definition of Done
- [x] All 7 eligible hubs have exactly one compiled-routing scenario file, each with a distinct route shape.
- [x] Every scenario carries the full 7-field evidence contract; the content validator rejects any scenario missing a field.
- [x] The topology validator recurses into per-feature files and enforces one unified verdict enum (added additively).
- [x] The cutover executor produces a gated PASS/FAIL/SKIP outcome from captured evidence — 7/7 hubs PASS in a dry run.
- [x] The LUNA-HIGH stage classifies a seeded transport timeout as `SKIP`; every hub has >= 1 gold-bearing holdout with its route withheld.
- [x] Root playbook realignment lands for `sk-doc`, `mcp-tooling`, and `sk-prompt`.
- [x] `validate.sh --strict` on this phase folder reports Errors: 0.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-gated, not assertion-gated. Every scenario and every executor run produces the same fixed evidence-contract shape; PASS/FAIL/SKIP is derived from that captured evidence, never hand-asserted. The live LUNA stage is architecturally separated from the static matrix precisely because it is the only nondeterministic piece — it gets its own orchestrator-owned scenario map and its own fail-closed timeout handling, rather than being folded into the deterministic validators.

### Key Components
- **7 hub-local compiled-routing scenario files**: one per eligible hub, each keyed to a distinct route shape.
- **`validate-compiled-routing-scenarios.cjs`** (new, non-frozen): content validator (CF-PB-1 field contract).
- **`validate-playbook-topology.cjs`** (modified, non-frozen): recursion into per-feature files + unified verdict enum.
- **`cutover-playbook-executor.cjs`** (new, non-frozen): runs each scenario's command sequence, gates on evidence.
- **`luna-acceptance.cjs`** (new, non-frozen): two-plane LUNA-HIGH live acceptance stage.

### Data Flow

Hub-local scenario file (evidence-contract fields populated) → content validator (reject if incomplete) → topology validator (recurse into per-feature files) → cutover executor (runs the command sequence, captures evidence, derives PASS/FAIL/SKIP) → [separately] LUNA-HIGH acceptance stage (orchestrator-owned scenario map, including the gold-bearing holdout) → transport timeout classified `SKIP` → results feed the P3 coverage-closure join gate that `011` reads.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds a new scenario layer and a new live-model acceptance layer over the existing playbook surface, so the inventory below is required before any file is touched.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Frozen `load-playbook-scenarios.cjs` (+ 2 other frozen files) | Sole scenario-loading authority | Read-only input, never edited | Pinned digests unchanged before and after every change |
| `validate-playbook-topology.cjs` | Existing topology validator, root-only | Modify: recurse into per-feature files; unify verdict enum | Recursion fixture test against a hub with nested per-feature files |
| 7 hub `manual-testing-playbook/` directories | Existing per-hub playbook packages | Add one compiled-routing scenario file each | Content validator passes on all 7; each scenario's route shape is distinct |
| `010-live-activation/activation/<hub>/manifest.json` (7 files) | Per-hub `servingAuthority` record | Read-only precondition input for evidence-contract fields | Evidence contract's serving-status field matches the manifest at capture time |
| `sk-doc` / `mcp-tooling` / `sk-prompt` root `manual-testing-playbook.md` | Root playbook directories | Realign to current routing sources of record (CF-PB-4) | No reference to the retired flat RESOURCE_MAP remains in `sk-doc`'s root; Figma+Refero appears as a primary row in `mcp-tooling`'s |
| `system-skill-advisor` | Existing flag/fallback/status home | Consumed, not modified, by this child's evidence contract | This child's docs cite `system-skill-advisor` as the single source for those mechanics, never re-deriving them |

Required inventories before build:
- Read every eligible hub's current `manual-testing-playbook.md` and its evidence-field conventions before adding the compiled-routing scenario, so the new file is additive and stylistically consistent.
- `rg -n "targetQualifiedIds|servingAuthority" .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/` — confirm the field names this child's evidence contract must match against `004`'s planned shape.
- Confirm `validate-playbook-topology.cjs`'s current recursion boundary (single-hub root vs. per-feature files) before modifying it.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Reconcile this child's evidence-contract field names with `004`'s planned `row.compiledParity` shape (or plan the adapter).
- [ ] Read all 7 hubs' current `manual-testing-playbook.md` structure and evidence-field conventions.
- [ ] Read `validate-playbook-topology.cjs`'s current recursion boundary and verdict-enum handling.
- [ ] Confirm the hub activation manifest shape as the direct-read stopgap for serving-status evidence.

### Phase 2: Core Implementation
- [ ] Author the 7 hub-local compiled-routing scenario files (distinct route shape per hub) with the full evidence contract.
- [ ] Author `validate-compiled-routing-scenarios.cjs` (non-frozen content validator).
- [ ] Modify `validate-playbook-topology.cjs`: recursion into per-feature files + unified verdict enum.
- [ ] Author `cutover-playbook-executor.cjs` (non-frozen; runs the command sequence, gates on captured evidence).
- [ ] Author `luna-acceptance.cjs`: orchestrator-owned scenario map, `providerModel=openai/gpt-5.6-luna`, `variant=high`, stdout/stderr captured separately, timeout → `SKIP`.
- [ ] Add >= 1 gold-bearing held-out paraphrase scenario per hub.
- [ ] Realign the `sk-doc`, `mcp-tooling`, and `sk-prompt` root playbooks (CF-PB-4).
- [ ] Move secondary-authority checks (legacy/holdout/disambiguation) to an Optional Supplemental section rather than a duplicate matrix.

### Phase 3: Verification
- [ ] Content validator fixture sweep (reject id-only, reject missing-field, accept the real 7 scenarios).
- [ ] Topology validator recursion fixture test (a per-feature-file defect must not pass because the root looked clean).
- [ ] Cutover executor dry run on >= 1 hub: gate outcome derived from captured evidence, not asserted.
- [ ] LUNA-HIGH timeout fixture: seeded transport timeout classifies `SKIP`.
- [ ] Holdout audit: every hub's holdout route is absent from its own prompt text, present in its own gold record.
- [ ] Root-playbook realignment check: no retired-RESOURCE_MAP reference remains in `sk-doc`'s root; Figma+Refero is a primary row in `mcp-tooling`'s.
- [ ] `validate.sh --strict` on this phase folder.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Content admission | Scenario field completeness | Non-frozen content validator fixture sweep |
| Topology | Per-feature-file recursion | Topology validator fixture (nested-file defect) |
| Execution gating | Evidence-derived, not asserted, verdicts | Cutover executor dry run |
| Live-model honesty | Timeout handling; holdout generalization | LUNA-HIGH acceptance stage seeded-timeout + holdout audit |
| Documentation parity | Root-playbook realignment | Manual diff against `mode-registry.json`/`hub-router.json` |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-runtime-promotion-and-status-foundation` | Internal | Planned/Not-started | Soft-coupled: evidence contract reads the hub manifest directly as a stopgap; blocked only if 002 later relocates/reshapes that file |
| `004-benchmark-compiled-lane-c` | Internal | Planned/Not-started | This child's evidence-contract field names must reconcile with `004`'s planned `row.compiledParity` shape; blocked on schema agreement, not on `004` being fully implemented first |
| Frozen `load-playbook-scenarios.cjs` (+ 2 other frozen files) | Internal | Green (shipped, pinned) | Read-only input; drift would invalidate the loader baseline, but this child never writes to it |
| `openai/gpt-5.6-luna` (external model) | External | Available (used in `010`'s T9) | LUNA-HIGH acceptance stage cannot run without it; timeout/unavailability is handled as `SKIP`, not a hard block on the rest of this child |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A content/topology validator fixture fails, the cutover executor's gating proves unreliable, or the LUNA-HIGH stage misclassifies a timeout as PASS/FAIL during implementation.
- **Procedure**: Every new file in this child is additive (new scenario files, new non-frozen validators/executor/acceptance script) except the modification to `validate-playbook-topology.cjs`, which is reverted independently if its recursion change proves unsafe. No runtime routing decision is touched by this child, so rollback has zero effect outside the playbook/benchmark surface.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup / reconcile + read + confirm) ──► Phase 2 (Core / scenarios + validators + executor + LUNA stage) ──► Phase 3 (Verify / fixtures + dry run + audit)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `004`'s evidence-shape reconciliation, hub playbook reads | Core |
| Core | Setup | Verify |
| Verify | Core | This child's completion claim; the P3 coverage-closure join gate `011` reads |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (reconcile + read + confirm) | Low-Med | Cross-child schema reconciliation with `004` is the main cost |
| Core (7 scenarios + 2 new scripts + 1 modified validator + LUNA stage + 3 root realignments) | High | The largest single-phase surface in this child |
| Verification (fixtures + dry run + audit) | Med | LUNA-HIGH fixtures are the least deterministic part to stabilize |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation checklist
- [ ] `004`'s evidence-shape reconciliation confirmed (or the adapter is planned).
- [ ] All 7 hubs' current playbook structure read.
- [ ] `validate-playbook-topology.cjs`'s current recursion boundary confirmed.

### Rollback procedure
1. Remove the 7 new scenario files and the new non-frozen scripts (`validate-compiled-routing-scenarios.cjs`, `cutover-playbook-executor.cjs`, `luna-acceptance.cjs`).
2. Revert the `validate-playbook-topology.cjs` recursion change independently if it proves unsafe on its own.
3. Revert the 3 root-playbook realignment edits independently if any breaks an existing (legacy) scenario's validation.

### Data reversal
- **Has runtime effect?** No — this child never changes what routes; it only tests and documents what already does, plus a live-model acceptance probe that is itself read-only against the routing system.
- **Reversal procedure**: Delete/revert the additive files and the two modified-file diffs; no external committed effect exists to undo.

<!-- /ANCHOR:enhanced-rollback -->
