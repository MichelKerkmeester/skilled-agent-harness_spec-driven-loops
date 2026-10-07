---
title: "Tasks: deep-ai-council Canonical INTENT_SIGNALS Router + Type-1 Gold"
description: "Task breakdown for the deep-ai-council canonical router conversion, reconstructed from spec.md. The original tasks.md was never written."
trigger_phrases:
  - "deep-ai-council canonical router tasks"
  - "deep-ai-council intent signals conversion tasks"
importance_tier: "important"
contextType: "implementation"
---

> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: deep-ai-council Canonical INTENT_SIGNALS Router + Type-1 Gold

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the current `d5-connectivity.cjs` result (D5 = 0, 10 `dead_intent_key` findings) as the before baseline
- [ ] T002 Recover the 054 ADR-006 `INTENT_SIGNALS` blob for byte parity or re-derive the conversion
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Convert the router block `INTENT_MODEL` to canonical `INTENT_SIGNALS` with keys identical to the 10 `RESOURCE_MAP` keys (deep-ai-council `SKILL.md`)
- [ ] T004 Sync the `classify_intents` pseudocode and the one prose reference (deep-ai-council `SKILL.md`)
- [ ] T005 Add `manual_testing_playbook/intra-routing-recall/` with 10 single-intent scenarios, `expected_resources` set to the router's designed load
- [ ] T006 Add the key-sync unit test (signals keys against `RESOURCE_MAP` keys; paths exist; no orphans)
- [ ] T007 Record the weight-flattening decision as durable-WHY prose
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Run `d5-connectivity.cjs` and confirm D5 = 100, `deadIntentKeys: []`, `orphanReferences: []`
- [ ] T009 Run Mode-A over the 10-scenario corpus and confirm ~PASS 92 (D1intra 100, D3 no waste)
- [ ] T010 Run the key-sync vitest green
- [ ] T011 Confirm the concurrent migration lines in the file are preserved verbatim
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
