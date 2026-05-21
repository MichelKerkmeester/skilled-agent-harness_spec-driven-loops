---
title: "Plan: shared embedder logic with spec-memory [template:level_1/plan.md]"
description: "Plan to remove skill-advisor/spec-memory embedder factory drift."
trigger_phrases:
  - "shared embedder logic skill-advisor"
  - "skill-advisor spec-memory embedder parity"
importance_tier: "important"
contextType: "architecture"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory"
    last_updated_at: "2026-05-21T10:16:26Z"
    last_updated_by: "codex"
    recent_action: "Authored implementation plan stub"
    next_safe_action: "Extract shared embedder factory and add parity regression"
    blockers: []
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: shared embedder logic with spec-memory

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Extract one shared embedder factory contract and make skill-advisor use it, with a parity regression as the guardrail.

| Phase | Focus | Output |
|-------|-------|--------|
| A | Confirm predecessor evidence and target files | Implementation starts from the cited source lines and current code |
| B | Implement scoped changes | Source and tests updated only for this packet's requirements |
| C | Run focused verification | Unit/integration/perf evidence captured in the packet |
| D | Closeout | Strict-validate packet and update implementation summary |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- All P0 requirements in `spec.md` have direct test or command evidence.
- The focused test command for this packet exits 0.
- No production data, runtime DB, or operator-local config is changed without an explicit operator step.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/003-skill-advisor-stack/006-shared-embedder-logic-with-spec-memory --strict` exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The shared module should own manifest/default resolution and adapter construction. Skill-advisor should keep only skill-specific database/indexing code; it should not define a second competing default for the same embedder family. The parity test should exercise both public entrypoints, not a private helper only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A - Discovery

1. Re-read predecessor packet and source files named in `spec.md`.
2. Confirm current line numbers before editing.
3. Identify the smallest test surface that proves the change.

### Phase B - Implementation

1. Extract or expose shared factory/registry from the spec-memory embedder implementation.
2. Flip skill-advisor default selection to `sbert/nomic-ai/CodeRankEmbed`.
3. Replace skill-advisor-specific factory logic with imports/wrappers around the shared module.
4. Add cross-skill embedding parity regression.

### Phase C - Verification

1. Run spec-memory embedder registry tests.
2. Run skill-advisor embedder/scorer tests.
3. Run the new parity regression.

### Phase D - Closeout

1. Update `implementation-summary.md` from PRE-IMPLEMENTATION to the actual result.
2. Run strict validation on this packet.
3. Preserve any operator-side blockers in the summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `npm test` or targeted vitest for system-spec-kit embedder registry.
- Targeted vitest for system-skill-advisor embedders and scorer smoke.
- New parity test that compares vectors for identical input.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Current spec-memory embedder registry/factory modules.
- Skill-advisor embedders and skill-graph DB code.
- Shared package path resolution between the two skills.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

1. Restore skill-advisor default registry to its prior implementation.
2. Remove the shared-factory parity test if shared extraction is reverted.
3. Leave documented decision notes in this packet summary.
<!-- /ANCHOR:rollback -->
