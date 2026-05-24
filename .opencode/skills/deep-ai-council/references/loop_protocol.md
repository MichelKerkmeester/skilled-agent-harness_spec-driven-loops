---
title: "AI Council Loop Protocol"
description: "End-to-end protocol for deep-ai-council planning rounds, convergence, persistence, and recovery handoff."
trigger_phrases:
  - "ai council loop protocol"
  - "council workflow"
  - "council round protocol"
  - "council persistence flow"
---

# AI Council Loop Protocol

This reference describes the council loop from packet resolution to persisted planning handoff. It is intentionally planning-only: implementation belongs to the caller or a separate implementation workflow.

---

## 1. OVERVIEW

The council loop has four phases:

1. Resolve the packet and run boundary.
2. Dispatch or simulate distinct seats within one CLI round.
3. Critique proposals and evaluate convergence.
4. Persist packet-local artifacts from caller context.

The council may run multiple rounds, but a single round never mixes CLI executors. A CLI change starts a new round.

---

## 2. PHASE 1: RESOLVE

Before any seat work:

- Resolve the target spec folder.
- Confirm the council is being used for planning, not implementation.
- Load the relevant packet context and any prior `ai-council/**` state.
- Choose whether the run is in-CLI or external-CLI.
- Set `max_rounds`, `seats_per_round`, and the convergence signal.

Required resources:

- `references/folder_layout.md`
- `references/output_schema.md`
- `assets/deep_ai_council_config.json`

Acceptance criteria: the caller can name the packet, the run mode, and the artifact directory before deliberation starts.

---

## 3. PHASE 2: SEAT

Seats need distinct reasoning mandates. Typical lenses are Analytical, Creative, Critical, Pragmatic, Holistic, and Research.

Each seat should produce:

- Recommendation.
- Trade-offs.
- Risks.
- Evidence or assumptions.
- Conditions that would change the recommendation.

When external CLIs are not actually invoked, label the perspective as simulated. Do not imply real external participation.

Required resources:

- `references/seat_diversity_patterns.md`
- `references/scoring_rubric.md`
- `assets/prompt_pack_round.md.tmpl`

Acceptance criteria: every seat has a named lens, a distinct mandate, and enough evidence for critique.

---

## 4. PHASE 3: CRITIQUE AND CONVERGE

Run cross-seat critique before declaring agreement. Hunter looks for hidden failure modes, Skeptic challenges evidence quality, and Referee checks whether objections materially change the plan.

Convergence requires:

- Two of three seats agree on the material recommendation.
- No new high-severity blocker survives critique.
- Disagreements are either resolved or explicitly carried into the handoff.
- Max-round escape produces `non-converged`, not fake consensus.

Required resources:

- `references/convergence_signals.md`
- `references/failure_handling.md`
- `references/anti_patterns.md`

Acceptance criteria: the report can explain both the chosen plan and the strongest rejected alternative.

---

## 5. PHASE 4: PERSIST AND HAND OFF

The caller, not the council seat, persists artifacts:

```bash
node .opencode/skills/deep-ai-council/scripts/persist-artifacts.cjs <packet> \
  --input-file <report> --strict-output
```

Then verify completion:

```bash
node .opencode/skills/deep-ai-council/scripts/advise-council-completion.cjs <packet>
```

Required resources:

- `references/output_schema.md`
- `references/state_format.md`
- `references/command_wiring.md`
- `assets/deep_ai_council_dashboard.md`

Acceptance criteria: `ai-council-state.jsonl` ends with `council_complete`, the final report exists, and any failed rounds are preserved under `failed/`.

---

## 6. RECOVERY

Recovery starts from disk, not conversation memory:

1. Inspect `ai-council-state.jsonl`.
2. Check whether `council_complete` exists.
3. Compare report sections against `references/output_schema.md`.
4. Preserve incomplete or failed round artifacts.
5. Re-run advisory or replay scripts only after the state shape is understood.

If the graph projection drifts, rebuild it from artifacts. Never edit graph rows as the canonical fix.

---

## 7. RELATED RESOURCES

- `references/quick_reference.md` for the operator cheat sheet.
- `references/deep_mode.md` for session/topic/round hierarchy.
- `references/findings_registry.md` for cross-topic finding state.
- `references/graph_support.md` for derived projection boundaries.
