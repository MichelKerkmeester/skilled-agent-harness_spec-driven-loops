---
title: "Plan: GPT Reliability Research Campaign"
description: "Orchestrator-hosted 30-iteration research loop: angle briefs dispatched one at a time to GPT-5.5-fast xhigh via cli-opencode, ~2-minute check cadence, quality-gated verdicts, dynamic angle rotation, findings registry, ranked synthesis."
trigger_phrases:
  - "plan"
  - "gpt reliability research plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/034-gpt-reliability-research"
    last_updated_at: "2026-07-03T00:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Plan authored"
    next_safe_action: "Iteration 001, angle A1"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "034-plan-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Plan: GPT Reliability Research Campaign

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Orchestrator-hosted research loop: up to 30 bounded GPT-5.5-fast xhigh dispatches, one at a time, each carrying an angle brief + curated 033 seed evidence + a strict evidence-cited output contract. The orchestrator checks on a ~2-minute cadence, grades every iteration, dedupes findings into a registry, rotates angles on dry streaks, and closes with a ranked synthesis mapped back to 033's measured failures.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Bar |
|---|---|
| Iteration acceptance | Output exists, cites file:line evidence, on-angle; graded productive/thin/stuck/off-target |
| Registry entry | Deduped on (surface, proposal); carries evidence + tag + expected effect + effort |
| Loop exit | 30 iterations OR all angles dry (3 consecutive dry per angle) |
| Synthesis | Every P0/P1 proposal maps to a 033 failure + names the benchmark cells that verify it |
| Closeout | validate.sh --strict clean; scoped commit; zero writes outside packet |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The 033 evidence dictates the shape: GPT cannot reliably self-host deep-loop commands (Gate-3 halts every mode/effort; structured-mode stalls), so the ORCHESTRATOR hosts the loop and GPT is a bounded per-iteration researcher. Each iteration: background `opencode run --model openai/gpt-5.5-fast --variant xhigh` with the brief piped as the prompt; output captured to `research/iterations/iter-NNN.md`; a Monitor plus ~2-minute checks watch progress; stuck dispatches (no growth ~4 min, or halt-shaped output) are killed, retried once with a tightened brief, then the angle rotates. State lives in the packet (`findings-registry.md`, `iteration-log.md`) — externalized, resumable, single-writer (the orchestrator).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work | Exit gate |
|---|---|---|
| P1 Setup | `research/` scaffold, 10 angle briefs seeded from 033, dispatch prompt template | Iteration 001 dispatchable |
| P2 Loop | ≤30 orchestrated iterations, 2-min checks, grading, registry accretion, dynamic steering | 30 iterations or all angles dry |
| P3 Synthesis | Registry → ranked P0/P1/P2 proposals with 033 linkage + verification cells | synthesis.md complete |
| P4 Closeout | Docs 100%, metadata regen, validate strict, commit+push scoped | Validation clean, pushed |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Research packet — the test surface is output quality, enforced per-iteration by the grading gate (evidence-cited, on-angle, non-vacuous) and at the end by the synthesis gate (every ranked proposal names the 033 benchmark cells that would verify it, making the 033 behavior benchmarks the acceptance harness for any future implementation packet).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- 033 scorecards (committed) as seed evidence.
- `opencode` CLI with `openai/gpt-5.5-fast` provider; xhigh variant best-effort.
- No system-file mutations; no other packets blocked on this one.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Read-only campaign writing only into this packet tree: rollback = delete or ignore the packet folder. No system state to restore. Interrupted loops resume from `iteration-log.md` + `findings-registry.md` (externalized state).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

P1 → P2 → P3 → P4, strictly sequential; no parallel phases. Within P2, iterations are sequential by design (each brief is steered by the previous verdicts).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

P1 ~30 min (briefs + template). P2 dominates: 30 iterations × 3-8 min dispatch + ~2 min orchestration ≈ 2.5-5 h wall-clock. P3 ~45 min. P4 ~20 min.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

No system mutations to roll back. Mid-campaign interruption: the loop resumes from `iteration-log.md` (last completed iteration + verdicts) and `findings-registry.md`; partially-written iteration files are truncated and re-dispatched. Abandonment: delete the packet folder; nothing else references it.
<!-- /ANCHOR:enhanced-rollback -->
