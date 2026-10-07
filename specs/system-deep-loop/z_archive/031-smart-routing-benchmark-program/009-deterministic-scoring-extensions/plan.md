---
title: "Implementation Plan: Deterministic Scoring Extensions — Over-Activation Lane + Scenario-Loader Scope"
description: "Reconstructed Level 2 implementation plan for the deterministic scoring extensions phase. It restates the spec.md purpose, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "deterministic scoring extensions plan"
  - "identity-scoped contamination lint plan"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Deterministic Scoring Extensions — Over-Activation Lane + Scenario-Loader Scope

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Not recorded |
| **Framework** | Deterministic skill-benchmark harness (contamination lint, scenario loader, router-mode scoring) |
| **Storage** | Fixture metadata markers in the scenario corpus; benchmark report fields |
| **Testing** | RED/GREEN vitests for both changes; byte-identical loader rows for `10--intra-routing-recall` |

### Overview
Ship two CI-safe deterministic harness extensions: an identity-scoped contamination lint that unblocks generic-keyword over-activation negatives (the scoring path already exists; only the lint gate blocks it), and a scenario-loader relaxation that lets all playbook categories enter Type-1 scoring when they carry gold.
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
Back-compatible extension of two existing deterministic modules. The over-activation scorer already exists (`score-skill-benchmark.cjs`) and the authoring doc already blesses an identity-scoped lint (`scenario_authoring.md`); the code just never implemented it. This is a doc-to-code gap closure.

### Key Components
- `buildBannedVocab` in `contamination-lint.cjs` gains `scope: 'full' | 'identity'` (default `'full'`)
- Fixture metadata marker that opts a fixture into identity scope
- Router-mode scoring that flags an over-fire as a `negativeActivation` failure and emits `report.overActivation`
- Loader regex in `load-playbook-scenarios.cjs`

### Data Flow
A fixture prompt is checked against the banned vocabulary; identity scope bans skill-id, basename, resource-path tokens and private-gold labels but not intent keywords, so a generic-keyword over-activation negative reaches the scorer. The relaxed loader includes any gold-bearing `.md` scenario and warns on gold-less files rather than erroring.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Identity scope in the contamination lint
- [ ] Add the `scope` parameter to `buildBannedVocab`
- [ ] Implement identity scope
- [ ] Add the fixture metadata marker and opt the over-activation fixture in

### Phase 2: Deterministic over-activation scoring
- [ ] Flag an over-fire as a `negativeActivation` failure in router mode
- [ ] Emit the `report.overActivation` summary

### Phase 3: Scenario-loader scope
- [ ] Relax the loader regex to any gold-bearing `.md`
- [ ] Gate inclusion on gold presence; warn on gold-less

### Phase 4: Verification
- [ ] RED/GREEN vitests for both changes
- [ ] Existing callers unchanged; `10--intra-routing-recall` rows byte-identical
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Identity scope drops intent keywords, retains id/basename bans | vitest (RED/GREEN) |
| Unit | Over-activation fixture scores deterministically in router mode, no network | vitest (RED/GREEN) |
| Regression | Loader returns gold-bearing other-category scenarios, warns on gold-less, back-compat asserted | vitest |

The changes are deterministic and CI-safe; no operator decision is recorded as open.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing `buildBannedVocab` callers and the router-mode scorer | Internal | Available | The default `'full'` scope contract cannot be preserved |
| `scenario_authoring.md` identity-scope blessing | Internal | Available | The lint change has no authored contract |

Ships first among the harness-capability phases and is the prerequisite for phase 010; it unblocks the phase 007 over-routing becoming scorable.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was scaffolded. The spec's risk note scopes the change to preserving `loadError`/`contaminated-fixture` rows verbatim with router mode staying the default.
<!-- /ANCHOR:rollback -->
