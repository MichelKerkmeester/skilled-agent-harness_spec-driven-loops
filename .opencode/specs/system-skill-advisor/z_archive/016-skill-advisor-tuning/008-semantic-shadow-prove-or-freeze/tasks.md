---
title: "Task Breakdown: Semantic Shadow Prove-or-Freeze"
description: "Executable task list: build the opt-in seeded 193-row paired ablation harness with a fail-on-skip guard and a runtime degradation detector, run it under a pinned provider, record the measured net-negative honestly, confirm the five scorer files stay git-clean, keep the four gates green, and record the FREEZE decision."
trigger_phrases:
  - "semantic shadow freeze tasks"
  - "semantic ablation task breakdown"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze"
    last_updated_at: "2026-07-07T09:00:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "All tasks complete and verified"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Task Breakdown: Semantic Shadow Prove-or-Freeze

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending · `[P]` parallelizable
- Each task lists its evidence (file, test, or command).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

- **M1**: Harness built (T-001..T-013).
- **M2**: Ablation run + measured + determinism-confirmed (T-020..T-022).
- **M3**: Freeze confirmed; four gates green; scorer git-clean (T-030..T-033).
- **M4**: Decision recorded; child registered; validation clean (T-040..T-042).
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Read the sweep harness, the semantic lane, the ablation engine, the fusion flag defaults, and the projection/result types. Evidence: lane-weight-sweep.vitest.ts / semantic-shadow.ts / ablation.ts / fusion.ts / types.ts read.
- [x] T-002 Confirm the five production scorer files are git-clean before authoring. Evidence: `git status --porcelain` on the scorer dir shows only the two doc-normalization READMEs, none of the five code files.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-010 Author the seeded 193-row paired ablation (full 5-lane vs `disabledLanes:['semantic_shadow']`), spying `loadSkillEmbeddings`, scoring against a fixture projection of all described skills. Evidence: semantic-shadow-ablation.vitest.ts created.
- [x] T-011 Pin `providerModelId` and assert equal; hard-fail on mismatch under the flag. Evidence: `PINNED_PROVIDER_MODEL_ID = ollama__nomic-embed-text-v1.5__768`; asserted in the guard test.
- [x] T-012 Add the fail-on-skip gating (opt-in flag) + the non-zero-semantic guardrail. Evidence: flag-off skips, flag-on throws on provider fault; the semantic probe asserts a non-zero raw score.
- [x] T-013 Add the runtime degradation detector over `getSemanticShadowRuntimeHealth()`. Evidence: stale-projection path stamps `disabledReason: 'projection_embedding_stale'`; detector asserts it is surfaced.
- [x] T-020 Run flag-off: confirm the skip-guard + degradation detector are green with no provider dependency. Evidence: 2 passed / 2 skipped in ~0.3s.
- [x] T-021 Run flag-on: produce the paired counts + flip list under the pinned provider. Evidence: full 149/193, disabled 150/193, delta +1, 6 flips, providerModelId `ollama__nomic-embed-text-v1.5__768`, RRF off, rerank off.
- [x] T-022 Re-run to confirm determinism; record the numbers exactly (never assume delta-0). Evidence: two re-runs identical (149/150/+1/6); recorded in spec.md §5.2 and implementation-summary.md.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-030 Confirm the five production scorer files stay git-clean (no weight/code change). Evidence: `git status --porcelain` on fusion/semantic-shadow/ablation/weights-config/lane-registry empty.
- [x] T-031 Reconcile the measured net-negative against the freeze verdict. Evidence: net −1 refutes raising (loss is abstain false-fires); 0.5% seeded delta does not clear the bar to drop (invariants + parity re-baseline cost).
- [x] T-032 Keep the four must-stay-green gates green. Evidence: semantic-lane-promotion 6/6, lane-weight-sweep 3/3, semantic-shadow-cosine 4/4 (via include override), python-ts-parity 2/2 (105/101/4).
- [x] T-033 Confirm the harness is green in both flag modes with the honest freeze-band assertions. Evidence: flag-on 4/4, flag-off 2 passed / 2 skipped.
- [x] T-040 Author the Level 2 spec folder with the ablation table + freeze rationale. Evidence: spec/plan/tasks/checklist/implementation-summary + description.json + graph-metadata.json.
- [x] T-041 Register the child in the parent `graph-metadata.json` `children_ids`. Evidence: `system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze` after 007, before z_archive; `last_active_child_id` repointed.
- [x] T-042 Run `validate.sh --strict` on the folder. Evidence: exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0/P1 requirements met (REQ-001..REQ-008).
- No production scorer code or weight change; the five files git-clean; comment hygiene clean.
- The 193-row ablation run and recorded exactly (149 / 150 / +1 / 6), deterministic; the four gates green; parity 105/101/4 held.
- Not touched (out of packet): the concurrent WS5 fixtures/tests and the routing-accuracy `README.md`, held dirty by another session.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Checklist: `checklist.md` · Summary: `implementation-summary.md`
- Program umbrella: `system-skill-advisor/016-skill-advisor-tuning/001-scorer-saturation-root-fix`.
<!-- /ANCHOR:cross-refs -->
