---
title: "Implementation Summary: md-generator upgrade research"
description: "Completed SOL-xhigh deep-research over how the 1,290-style library upgrades design-md-generator: 5 iterations to stall-convergence, a ranked nine-lever verdict led by a versioned v3 schema/validation contract, and an 18-27 engineer-day Phase A/B/C sequence."
trigger_phrases:
  - "md generator upgrade summary"
  - "design-md-generator research status"
  - "improve DESIGN.md status"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade"
    last_updated_at: "2026-07-18T13:20:00Z"
    last_updated_by: "claude"
    recent_action: "Research converged at 5 iters; ranked upgrade levers synthesized"
    next_safe_action: "Seed a md-generator implementation phase from the Phase A contract MVP"
    blockers: []
    key_files:
      - "spec.md"
      - "research/lineages/sol/research.md"
      - "research/lineages/sol/findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-md-gen-upgrade-011-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Upgrade md-generator first as a versioned schema/validation contract, only later as bounded prose exemplars."
      - "The corpus may teach structure and vocabulary but must never alter target-measured values or become an aesthetic majority vote."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: md-generator upgrade research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-md-generator-upgrade |
| **Status** | Complete |
| **Level** | 1 |
| **Origin** | Second child of the styles-library utilization phase parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An evidence-backed answer to how the 1,290-style library should upgrade the `design-md-generator` mode, delivered as the loop's synthesis (`research/lineages/sol/research.md`, 17 sections) plus a 268-line findings registry. No generator code was changed — this phase is research only.

### Files Created / Changed

| File | Action | Result |
|------|--------|--------|
| `002-md-generator-upgrade/{spec,plan,tasks}.md` | Create | The research charter and approach. |
| `002-md-generator-upgrade/research/lineages/sol/research.md` | Create (by the loop) | The ranked nine-lever synthesis, Phase A/B/C sequence, and concrete pipeline integration points. |
| `002-md-generator-upgrade/research/lineages/sol/{deep-research-dashboard.md,findings-registry.json,deep-research-state.jsonl}` | Create (by the loop) | Machine state: 5 iterations, convergence trace. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A single cli-opencode lineage running `openai/gpt-5.6-sol-fast --variant xhigh` was dispatched through `fanout-run.cjs --loop-type research` over one question: how the library upgrades md-generator. It read the 001 retrieval findings first so it built on the substrate. It ran **5 iterations and stopped on a legitimate stall-convergence** (`stall_detected`, `exitCode 0`), then ran `phase_synthesis`. It ran in parallel with the 003 global-modes loop.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Contract first, exemplars later | The biggest, safest lift is a versioned v3 schema manifest that drives section requiredness, capabilities, Quick Start groups, semantic roles, formatter emission, prompt text, and validation from one authority — removing formatter/prompt/validator drift. Prose-study exemplars come only after that, behind safety gates. |
| The corpus teaches shape, never values | Hard safety rule: the corpus may teach structure, relationships, semantic vocabulary, honest absences, and validation expectations; it may **not** alter target-measured values, supply source-specific literals/assets/phrases, or become an aesthetic majority vote. |
| Hard failures vs advisory strata | Target/schema/provenance violations stay hard failures; corpus shape, vocabulary, density, and rarity become stratified **warnings** — so the generator is calibrated, not majority-rejected. |
| No raw few-shot shortcut | STUDY exemplars ship only with their transformation, provenance, rights, injection, and source-leak controls together — never as an intermediate raw-prompting shortcut. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:ranked-levers -->
## Ranked Upgrade Levers (from `research.md` §9)

| Rank | Lever | Quality lift | Cost | Main integration point |
|---:|---|---|---|---|
| 1 | Versioned v3 manifest + capability Quick Start + schema-drift sentinel | Very high | 4–7 days | new schema module; `emitQuickStart`; `buildWritePrompt`; `checkSectionCompleteness` |
| 2 | Compact corpus baseline + de-literalized fixture generator | High | 2–3 days | new generator/tests; `package.json` scripts |
| 3 | Hard/advisory split in the existing validator/report | High | 2–4 days | `validateDesignMd`; `ValidationResult`; report consumer |
| 4 | Semantic typography-role normalizer | Medium-high | 2–3 days | `emitQuickStart`; new normalizer |
| 5 | Bounded STUDY selector/transformer + provenance envelope | High prose lift | 4–6 days | new study module; `buildWritePrompt`; `buildPlan` |
| 6 | Two-signal source-leak gate + no-STUDY retry | High safety | 3–5 days | new leak checker; `runGuided` |
| 7 | Counterfactual capability probes | Medium-high | 2–3 days | formatter/prompt/validator mutation tests |
| 8 | Diversity-preserving calibration watchdog | Medium | 1–2 days | baseline artifact + corpus-fixture tests |
| 9 | Fuzzy/learned ranking or prose judge | Low/unproven | 3–5+ days | advisory experiment only |

**Out-of-the-box levers (§8):** schema-drift sentinel, counterfactual capability probes, a diversity-preserving calibration watchdog, and an "honest-absence" oracle.
<!-- /ANCHOR:ranked-levers -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Loop dispatched (REQ-001) | VERIFIED: SOL-xhigh lineage ran to `exitCode 0` with `stall_detected`; job `b4bze2klj` completed. |
| Ranked synthesis (REQ-002) | VERIFIED: `research/lineages/sol/research.md` (17 sections) ranks nine levers in §9, with the Phase A/B/C sequence in §10 and per-point integration in §11. |
| Concrete integration points (REQ-003) | VERIFIED: §11 names `formatters-v3.ts::emitQuickStart`, `build-write-prompt.ts::buildWritePrompt`, `guided-run.ts::buildPlan`, `validate.ts::validateDesignMd`, and `report-gen.ts`. |
| Evidence depth | VERIFIED: 268-line `findings-registry.json` across 5 iterations. |
| Packet validity | Re-confirm with `validate.sh .opencode/specs/sk-design/011-sk-design-styles-utilization --strict --recursive` after this file lands. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Stopped at 5 of a planned 10 iterations.** A legitimate stall-convergence — the stall detector fired after the schema, exemplar-protocol, validation, and safety questions were answered. Fewer iterations means the fuzzy/learned-ranking tail (rank 9) stays low-confidence, which the ranking already flags as advisory-only.
2. **STUDY exemplars carry real risk.** Rights, injection, stale-generation, and source-leak gates are prerequisites, not add-ons; Phase A deliberately ships value with none of that risk before Phase B is attempted.
3. **This is a plan, not a build.** Nothing in the md-generator runtime changed.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:next-steps -->
## Next Steps

Seed a md-generator implementation phase from `research.md` §10:

- **Phase A — Contract and calibration MVP (10–15 eng-days):** versioned schema/capability manifest, capability-driven Quick Start emission, semantic role normalization, compact baseline + de-literalized fixtures, update/check commands + schema-drift sentinel, hard-vs-advisory validator split, Vitest/report integration, initial counterfactual tests. Improves correctness and consistency with **no** corpus-conditioned prose risk.
- **Phase B — Reversible STUDY hardening (+8–12 eng-days):** one-bundle generation-guarded hydration, de-literalized observation transformer, target-facts binding, provenance/rights/injection envelope, exact-value + normalized-span leak gate, discard-and-retry-without-STUDY, adversarial fixtures.
- **Phase C — Optional calibration (1–2 eng-days):** the diversity watchdog once real generated-output evidence exists; learned enforcement stays deferred.

Combined Phase A+B ≈ **18–27 engineer-days** (23–35 if the 001 retrieval substrate is not yet built).
<!-- /ANCHOR:next-steps -->
