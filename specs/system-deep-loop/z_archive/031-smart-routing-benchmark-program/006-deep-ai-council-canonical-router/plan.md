---
title: "Implementation Plan: deep-ai-council Canonical INTENT_SIGNALS Router + Type-1 Gold"
description: "Reconstructed Level 1 implementation plan for the deep-ai-council canonical router conversion. It restates the spec.md purpose, scope and success criteria; the original plan was never written."
trigger_phrases:
  - "deep-ai-council canonical router plan"
  - "deep-ai-council intent signals conversion plan"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: deep-ai-council Canonical INTENT_SIGNALS Router + Type-1 Gold

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Not recorded |
| **Framework** | deep-ai-council skill router and the Mode-A benchmark harness |
| **Storage** | Router block in the skill's `SKILL.md`; gold scenarios under the skill's `manual_testing_playbook/intra-routing-recall/` |
| **Testing** | `d5-connectivity.cjs`; a Mode-A run over the 10-scenario corpus; a key-sync unit test |

### Overview
Convert the deep-ai-council `SKILL.md` router block from `INTENT_MODEL` with per-keyword tuple weights to canonical `INTENT_SIGNALS` with flat keyword arrays, add a 10-scenario Type-1 gold plus a key-sync test, and land the conversion the 054 program already designed and scored (Mode-A PASS 92, D1intra 100) into the working tree.
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
Canonical router block: the Mode-A harness parses only `INTENT_SIGNALS` with flat keyword arrays, so the router block is rewritten with keys identical to the 10 `RESOURCE_MAP` keys. Beyond that, the spec records no architecture decision.

### Key Components
- deep-ai-council `SKILL.md` router block (`INTENT_MODEL` to `INTENT_SIGNALS`)
- `classify_intents` pseudocode and the one prose reference to the router
- `manual_testing_playbook/intra-routing-recall/` with 10 single-intent scenarios
- Key-sync unit test (signals keys against `RESOURCE_MAP` keys)

### Data Flow
A gold prompt's routed set is compared against its `expected_resources`; `d5-connectivity.cjs` reports D5 from the parsed router block, which today parses `intentSignals` empty while `RESOURCE_MAP` parses fine.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Router conversion
- [ ] Convert the `SKILL.md` router block to canonical `INTENT_SIGNALS`
- [ ] Sync the `classify_intents` pseudocode and the one prose reference
- [ ] Record the weight-flattening decision as durable-WHY prose

### Phase 2: Gold + key-sync test
- [ ] Add the 10-scenario Type-1 gold under `manual_testing_playbook/intra-routing-recall/`
- [ ] Add the key-sync unit test

### Phase 3: Verification
- [ ] Confirm D5 = 100 with no dead intent keys
- [ ] Confirm each gold prompt routes only its targeted intent
- [ ] Run the key-sync test green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A for unit-level scope — record testing beyond the verification tasks in `tasks.md` here. The spec names `d5-connectivity.cjs` (D5 = 100, `deadIntentKeys: []`, `orphanReferences: []`), a Mode-A run over the 10-scenario corpus (~PASS 92, D1intra 100, D3 no waste), and a key-sync vitest.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The 054 ADR-006 `INTENT_SIGNALS` blob (recover for byte parity or re-derive) | Internal | Not recorded | The conversion has to be re-derived rather than landed as designed |
| Mode-A harness parsing `INTENT_SIGNALS` with flat keyword arrays (`router-replay.cjs`) | Internal | Available | The router block cannot be parsed, so D5 stays 0 |

The phase is otherwise independent of the sibling phases.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Not recorded — no rollback steps were captured when the phase was scaffolded. The spec's risk note scopes any revert to the `INTENT` block, leaving the concurrent migration edits in the same file preserved verbatim.
<!-- /ANCHOR:rollback -->
