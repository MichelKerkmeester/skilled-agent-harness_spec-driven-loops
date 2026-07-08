---
title: "AI Council Loop Protocol"
description: "End-to-end protocol for deep-ai-council planning rounds, convergence, persistence, and recovery handoff."
trigger_phrases:
  - "ai council loop protocol"
  - "council workflow"
  - "council round protocol"
  - "council persistence flow"
importance_tier: "normal"
contextType: "planning"
version: 2.3.0.5
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

- `references/structure/folder_layout.md`
- `references/structure/output_schema.md`
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

### 3.1 Per-seat stepwise liveness (GAP-32 / GAP-36)

Each seat is persisted STEPWISE as it returns — a single seat is written without
requiring the full report sections (Composition / Recommended Plan / Plan
Confidence), so one seat's dispatch never fails validation because the other
seats have not returned yet. The stepwise writer is
`persist-artifacts.cjs --seat` / `lib/persist-artifacts.cjs#persistSeatStepwise`,
which for every seat appends to `ai-council-state.jsonl` in this order:

1. `progress_record` with `status:"started"` (resets the watchdog timer).
2. The seat artifact write under `seats/{round}/{seat}.md` (emits its own
   `artifact_written` audit envelope).
3. `progress_record` with `status:"completed"`, carrying `progress_delta > 0`
   and `artifact_path` (the work-anchor required by the shared pair validator so
   a no-op heartbeat cannot mask a stall).

For **in-CLI** runs (STEP 2 simulating seats within one round), the host breaks
the round into per-seat sub-steps and calls the stepwise writer once per seat,
so the completed `progress_record` count equals `seats_per_round`. Each
sub-step is bounded by a started/completed pair, giving the watchdog a
per-seat liveness edge instead of one dark window for the whole round.

**Watchdog-only bounding (in-CLI fallback).** When the host genuinely cannot
emit a per-seat started/completed boundary in in-CLI mode (for example, a
single in-process seat pass that is indivisible), the run is bounded by the
watchdog alone: the no-progress window fires if no `progress_record` AND no
artifact `mtime` change occurs within the window. In that case the loop MUST
emit at least one work-anchored `progress_record` per round, and operators
treat the per-seat count contract as best-effort, not guaranteed. The
stepwise writer is the preferred path; watchdog-only bounding is the
documented fallback, never the default.

Required resources:

- `references/patterns/seat_diversity_patterns.md`
- `references/scoring/scoring_rubric.md`
- `assets/prompt_pack_round.md`
- `.opencode/skills/deep-loop-workflows/shared/progress/progress-record.cjs` (additive `progress_record` type + pair validator)

Acceptance criteria: every seat has a named lens, a distinct mandate, and enough evidence for critique; the completed `progress_record` count equals the number of seats persisted when the host uses the stepwise writer.

---

## 4. PHASE 3: CRITIQUE AND CONVERGE

Run cross-seat critique before declaring agreement. Hunter looks for hidden failure modes, Skeptic challenges evidence quality, and Referee checks whether objections materially change the plan.

Convergence requires:

- Two of three seats agree on the material recommendation.
- No new high-severity blocker survives critique.
- Disagreements are either resolved or explicitly carried into the handoff.
- Max-round escape produces `non-converged`, not fake consensus.

Required resources:

- `references/convergence/convergence_signals.md`
- `references/convergence/failure_handling.md`
- `references/patterns/anti_patterns.md`

Acceptance criteria: the report can explain both the chosen plan and the strongest rejected alternative.

---

## 5. PHASE 4: PERSIST AND HAND OFF

The caller, not the council seat, persists artifacts:

```bash
node .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/persist-artifacts.cjs <packet> \
  --input-file <report> --strict-output
```

Then verify completion:

```bash
node .opencode/skills/deep-loop-workflows/deep-ai-council/scripts/advise-council-completion.cjs <packet>
```

Required resources:

- `references/structure/output_schema.md`
- `references/structure/state_format.md`
- `references/patterns/command_wiring.md`
- `assets/deep_ai_council_dashboard.md`

Acceptance criteria: `ai-council-state.jsonl` ends with `council_complete`, the final report exists, and any failed rounds are preserved under `failed/`.

---

## 6. RECOVERY

Recovery starts from disk, not conversation memory:

1. Inspect `ai-council-state.jsonl`.
2. Check whether `council_complete` exists.
3. Compare report sections against `references/structure/output_schema.md`.
4. Preserve incomplete or failed round artifacts.
5. Re-run advisory or replay scripts only after the state shape is understood.

If the graph projection drifts, rebuild it from artifacts. Never edit graph rows as the canonical fix.

---

## 7. RELATED RESOURCES

- `references/integration/quick_reference.md` for the operator cheat sheet.
- `references/convergence/deep_mode.md` for session/topic/round hierarchy.
- `references/scoring/findings_registry.md` for cross-topic finding state.
- `references/integration/graph_support.md` for derived projection boundaries.
