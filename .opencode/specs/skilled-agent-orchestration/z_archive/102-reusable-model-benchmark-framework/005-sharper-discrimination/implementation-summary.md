---
title: "Implementation Summary: Sharper discrimination via harder computational fixtures — saturated (negative result)"
description: "Built 3 harder computational fixtures (semver-compare, normalize-path, int-to-words) with oracle-validated test sets and an n=5 profile. The n=2 de-risk gate showed all three SATURATED — both MiniMax-M3 and MiMo-V2.5-Pro scored 1.0 — so per the de-risk discipline the full run was not fired. Honest finding: harder computational fixtures do not separate these near-equivalent frontier models; the only discriminating signal is input-validation strictness, so the effort pivoted to validation-heavy fixtures (006)."
trigger_phrases:
  - "sharper discrimination saturated"
  - "harder computational fixtures negative result"
  - "fixture saturation de-risk gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/102-reusable-model-benchmark-framework/005-sharper-discrimination"
    last_updated_at: "2026-06-02T10:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "De-risk gate: 3 computational fixtures saturated; pivoted to validation fixtures (006)"
    next_safe_action: "Continue in 006 — de-risk + run the validation-heavy fixture pack"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-fixtures/harder-semver-compare.json"
      - ".opencode/skills/deep-improvement/assets/model-benchmark/benchmark-profiles/capability-m3-vs-mimo-v2.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-127-005-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Do harder computational fixtures discriminate M3 vs MiMo? No — all 3 saturated at 1.0"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-sharper-discrimination |
| **Completed** | 2026-06-02 (negative result — pivoted to 006) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase tested a hypothesis — that *harder computational* coding fixtures would separate MiniMax-M3 and MiMo-V2.5-Pro where the 004 pack saturated — and the hypothesis was **falsified**, which is the useful result. Three new T4 fixtures were built and oracle-validated through the real scorer (`harder-semver-compare`, `harder-normalize-path`, `harder-int-to-words` — 24 adversarial oracle cases each; reference impls score 1.0, deliberately-wrong impls 0.33–0.79), plus an n=5 profile (`capability-m3-vs-mimo-v2.json`). The suite stayed green (vitest 153). The fixtures themselves are sound and remain in the library — they just do not discriminate *these two frontier models*.

### The de-risk gate result (the finding)

An n=2 de-risk run (16 cells, 0 pollution, 0 orphans) showed every new computational fixture **saturated**:

| Fixture | MiniMax-M3 | MiMo-V2.5-Pro |
|---|---|---|
| harder-semver-compare | 1.00 | 1.00 |
| harder-normalize-path | 1.00 | 1.00 |
| harder-int-to-words | 1.00 | 1.00 |
| hard-roman-to-int (kept) | 1.00 | 0.94 |

Both models ace standard-to-hard computational coding; the only slip remained MiMo on the strict-*validation* fixture (roman numerals). The wrong-impl spreads (0.33–0.79) confirmed the fixtures *can* grade partial correctness — the models simply don't make those mistakes.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A build sub-agent implemented the 3 fixtures + profile + tests with oracle validation through the real scorer; independent spot-checks confirmed the oracle values against the specs. The n=2 de-risk was run skill-compliantly (`</dev/null` via the dispatcher, 240s per-dispatch cap, correctly-sized outer timeout, before/after untracked diff). The de-risk gate — designed exactly to avoid spending a ~100-min full run on a foregone tie — did its job: it caught the saturation cheaply, and the full n=5 run was deliberately NOT fired.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Honor the de-risk gate.** Saturation on 3 of 4 fixtures → do not run the full n=5; iterate the fixture design instead. A negative result caught in 16 cells beats a foregone tie in 40.
- **Follow the evidence to validation.** MiMo's only repeatable slip (004 + here) is strict input validation. The next iteration (006) targets validation-heavy fixtures dominated by adversarial-invalid inputs.
- **Keep the saturated fixtures.** They are oracle-valid and additive to the library (usable for other model pairs or as smoke tests); removing them would be scope creep.
- **Report the negative result honestly.** "Harder computational fixtures don't separate these models" is a real, useful finding about the models' near-equivalence, not a failure to hide.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run model-benchmark/tests/` | **153 passed**, exit 0 |
| Oracle validation (real scorer) | reference 1.0 vs wrong 0.33–0.79 across all 3 fixtures |
| v2 profile | `profile-validator.cjs` → `{valid:true, errors:[]}` |
| n=2 de-risk | 16 cells, exit 0, **0 pollution, 0 orphans** |
| Saturation gate | 3 of 4 fixtures saturated (both models 1.0) → full run NOT fired |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Computational fixtures saturate for this pair.** Frontier models ace standard-to-hard self-contained coding; difficulty alone (more edge cases) does not separate them. The discriminating axis is validation-strictness — pursued in 006.
- **No full-run verdict here (by design).** This phase's deliverable is the saturation finding + the pivot; the CI-certified verdict lives in the validation iteration (006).
- **Negative results are sample-bounded.** The de-risk is n=2; a larger run could surface rare slips, but the saturation signal (both models 1.0 across all computational fixtures) is consistent with 004's n=3.
<!-- /ANCHOR:limitations -->
