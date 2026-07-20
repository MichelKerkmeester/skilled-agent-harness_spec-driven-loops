---
title: "Implementation Plan: create-skill Compiled-Routing Alignment"
description: "Planned implementation sequence for adding the v4 compiled-routing directive, explicit legacy/ready onboarding, canonical manifest minting, and regression coverage to create-skill's parent-hub path."
trigger_phrases:
  - "create-skill compiled routing plan"
  - "parent hub manifest onboarding plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: create-skill Compiled-Routing Alignment

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
| **Language/Stack** | Python 3 initializer, Markdown templates, pytest contract tests |
| **Active generator** | `create-skill/scripts/init_skill.py` parent path |
| **Generated contract** | Parent hub `SKILL.md` plus registry/router/description/graph metadata and primary packet |
| **Compiled dependency** | Canonical P3 minter, manifest store, freshness predicate, and data-driven runtime discovery |
| **Compatibility posture** | Existing CLI calls default to legacy; agent workflow asks explicitly |

### Overview

The smallest viable change keeps the current generator structure and adds one parent-only state option. Both generated parent templates always receive the additive compiled-routing directive. The state option controls only the manifest lifecycle: `legacy` emits none, while `ready` calls and verifies the canonical P3 minter after router inputs are final.

The implementation must not build a second compiler or freshness rule inside create-skill. It consumes the stable shared interfaces, updates the active and copy-from templates together, and expands the existing create-skill contract tests.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] P3 exposes a stable minter, manifest-location abstraction, freshness predicate, and new-hub runtime discovery.
- [ ] The exact directive block in `spec.md` is approved.
- [ ] Legacy remains the backward-compatible CLI default.
- [ ] Existing create-skill tests pass before implementation changes.

### Definition of Done

- [ ] Active and canonical parent templates render matching directive blocks.
- [ ] Legacy and compiled-ready states are explicit and tested.
- [ ] Ready state is reported only after shared freshness verification.
- [ ] Standalone scaffolding and existing parent CLI calls remain compatible.
- [ ] create-skill validation and docs agree with generated behavior.
- [ ] No runtime router, manifest of an existing hub, or frozen scorer file is modified.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Template-plus-postcondition. Rendering establishes the hub's durable routing instruction; the selected onboarding mode establishes whether a valid manifest exists. The shared P3 predicate, not create-skill, decides whether the resulting hub is compiled-eligible.

### Key Components

- **CLI/state parser**: accepts `legacy|ready` for parent generation and rejects the option for standalone generation.
- **Directive renderer**: substitutes the hub name into the canonical block in both parent templates.
- **Manifest adapter**: invokes the shared minter and verifies the returned canonical manifest for ready mode.
- **State reporter**: emits one of two unambiguous results and never treats fallback as ready.
- **Contract tests**: create temp hubs and inspect emitted files plus minter/freshness outcomes.

### Data Flow

```text
create-skill request
      |
      v
standalone? ---- yes ----> existing standalone path unchanged
      |
      v parent
choose legacy|ready
      |
      v
render hub + exact directive
      |
      +---- legacy ----> no manifest ----> report legacy
      |
      +---- ready -----> canonical minter -> freshness predicate
                                             | pass -> report compiled-ready
                                             | fail -> non-zero, no ready claim
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Planned Action | Verification |
|---------|--------------|----------------|--------------|
| `init_skill.py` | Renders parent hub and metadata | Parse state, call minter for ready, report verified outcome | Temp-directory generator tests |
| `hub-skill-scaffold.md` | Active generated hub template | Insert exact directive | Generated `SKILL.md` text assertion |
| `parent-skill-hub-template.md` | Canonical copy-from template | Insert matching directive | Normalized block equality test |
| create-skill `SKILL.md` | Executable authoring workflow | Ask state, order mint after final routing inputs, name failure behavior | Workflow review |
| README and parent reference | Operator guidance | Add examples and dependency boundary | Documentation consistency check |
| Package validator | Completion gate | Validate directive and, when present, shared freshness state | Positive/negative fixture tests |
| Existing contract test suite | Current path/naming regression coverage | Add two-state onboarding matrix | pytest result |

Inventories before implementation:

- Confirm every initializer call site and test that relies on the existing function signature.
- Confirm both parent templates and every documentation pointer to them.
- Confirm the P3 minter and predicate API, including error taxonomy and canonical returned path.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture current generator output for standalone and parent fixtures.
- [ ] Pin the approved directive text and the P3 minter/freshness API.
- [ ] Define the state parser: parent-only `legacy|ready`, default `legacy` for existing CLI calls.

### Phase 2: Core Implementation

- [ ] Add the directive to the active parent scaffold and canonical parent template.
- [ ] Update `init_skill.py` to render the hub name in both directive positions.
- [ ] Add the ready-mode canonical mint and shared freshness verification after all router inputs are written.
- [ ] Add explicit legacy and compiled-ready output; fail non-zero without a ready claim on mint/freshness errors.
- [ ] Update create-skill workflow, README, parent reference, and package validation.

### Phase 3: Verification

- [ ] Extend create-skill contract tests for the full state matrix and template parity.
- [ ] Run standalone and parent regression suites.
- [ ] Run strict package validation on generated legacy and ready fixtures.
- [ ] Run strict spec-folder validation and record any parent-owned metadata warnings separately.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Planned Tools |
|-----------|-------|---------------|
| Unit | Option parsing and parent-only guard | pytest |
| Template | Exact directive block and hub-name substitution | Text extraction against both templates |
| Generator | Legacy parent output | Temp dir; assert no manifest and explicit legacy result |
| Generator | Compiled-ready parent output | Test minter; assert fresh canonical manifest and ready result |
| Negative | Missing minter, stale digest, malformed manifest, unknown state | pytest parameter matrix |
| Regression | Existing standalone and parent output | Existing `test_create_skill_contract.py` suite |
| Package | Validator behavior for both states | `validate_skill_package.py --strict` on fixtures |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Eligibility/fallback decision packet | Internal | Available | create-skill must not implement an alternate rule |
| P3 canonical minter and predicate | Internal | Planned | Ready mode cannot be implemented truthfully |
| P3 data-driven runtime discovery | Internal | Planned | Newly minted hubs would remain undiscoverable by the runtime |
| Existing parent templates | Internal | Available | Both must move in lockstep |
| Existing create-skill contract tests | Internal | Available | Provides the regression base |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Generated directive mismatch, broken legacy invocation, stale manifest accepted as ready, standalone regression, or validator disagreement.
- **Procedure**: Restore the prior initializer and parent templates; remove the ready-mode adapter from create-skill; keep generated hubs on the legacy path; do not delete or rewrite any existing hub manifest automatically. Re-run the pre-change generator fixtures before another attempt.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
P3 minter + predicate + discovery
              |
              v
baseline -> templates + state parser -> manifest adapter -> tests + docs
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Approved directive and P3 API | Core implementation |
| Core implementation | Setup | Verification |
| Verification | Core implementation | Adoption by new hubs |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Relative Effort |
|-------|------------|-----------------|
| Setup and interface pinning | Medium | P3 dependency review dominates |
| Templates and initializer | Medium | Surgical generator changes |
| Validation and tests | Medium | Two-state and failure matrix |
| Documentation synchronization | Low | Four related authoring surfaces |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Implementation Checklist

- [ ] Current standalone and parent outputs are captured.
- [ ] No existing hub is targeted for regeneration.
- [ ] P3 interfaces are stable and testable without writing production manifests.

### Rollback Procedure

1. Restore prior templates and initializer behavior.
2. Restore legacy as the only reported generated state.
3. Leave any pre-existing canonical manifest untouched and report it for operator reconciliation.
4. Re-run baseline create-skill contract tests.

### Data Reversal

- **Has persistent user data changes?** No.
- **Reversal procedure**: Revert generator/template changes; temp test manifests are discarded by the test harness, while real manifests require an explicit operator-owned lifecycle.
<!-- /ANCHOR:enhanced-rollback -->

