---
title: "Plan: Comprehensive Deep Review — sk-design"
description: "Execution plan for the 20-iteration comprehensive deep review of sk-design (parallel wave dispatch) and remediation of confirmed findings."
trigger_phrases:
  - "sk-design comprehensive review plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/027-comprehensive-deep-review"
    last_updated_at: "2026-07-09T09:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Plan executed and verified complete"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-009-027"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Comprehensive Deep Review — sk-design

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run a genuine 20-iteration `/deep:review` loop (GPT-5.5-fast, high reasoning effort, forced max-iterations) over the entire `sk-design` skill tree, dispatched in 5 waves of 3-4 parallel iterations each, then fix every confirmed P0/P1 finding with independent adversarial verification before closing out.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- All 20 iterations mechanically valid (narrative + state + delta artifacts).
- All 4 dimensions covered for the hub and each of the 6 modes.
- Every confirmed P1 finding fixed and independently re-verified (not self-certified).
- Fresh sk-doc structural re-checks pass at close-out, not trusted from an earlier session.
- No regression introduced by any fix (pre-existing vs new test failures explicitly distinguished).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Same hand-driven `/deep:review` orchestration proven twice this session (a 5-iteration sequential run and a 20-iteration sequential run against `system-deep-loop`): directly executing the `deep_review_auto.yaml` phase_loop contract (init, per-iteration dispatch via the audited `cli-opencode` executor, reducer sync, convergence check, synthesis) rather than delegating to a generic script.

**New for this pass — wave-parallel dispatch**: iterations within a wave are dispatched concurrently (multiple `deep-review` LEAF Agent calls in one message) instead of one-at-a-time. Since parallel agents in the same wave cannot see each other's live findings, each iteration's prompt is pre-scoped to a disjoint file set (no two concurrent agents review the same files). The reduce/convergence/strategy-update bridge steps run once per wave (after all agents in that wave complete and are individually mechanically verified), not once per iteration — this is the necessary adaptation since `reduce-state.cjs` and `convergence.cjs` read the full JSONL state and must see a consistent, fully-written wave before running.

Remediation of confirmed findings uses a separate Workflow-tool-style pass: one fix agent + one independent verify agent per finding (or per area group), run in parallel, so no fix is accepted on self-report alone.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Review Execution

Init the review packet (config/state/strategy/findings-registry, coverage-graph seed, loop lock) with `review_target_type=skill`, `maxIterations=20`, `stopPolicy=max-iterations`, executor `cli-opencode`/`openai/gpt-5.5-fast`/`high`. Run the planned area×dimension rotation across 5 waves:
- Iteration 1 (solo): inventory — confirms structure and sampling strategy for `design-md-generator` before parallel dispatch begins.
- Wave 1 (iters 2-5, 4 parallel): hub tier + hub-level cross-cutting dirs (`shared/`, `benchmark/`, `feature_catalog/`, `changelog/`, `manual_testing_playbook/`).
- Wave 2 (iters 6-9, 4 parallel): `design-interface` + `design-foundations`.
- Wave 3 (iters 10-13, 4 parallel): `design-audit` + `design-motion`.
- Wave 4 (iters 14-17, 4 parallel): `design-mcp-open-design` (combined, transport-exempt lighter pass) + `design-md-generator` backend (3 iterations: correctness/security, traceability/maintainability/sk-doc, non-backend docs).
- Wave 5 (iters 18-20, 3 parallel): `design-md-generator` remaining coverage + cross-hub routing consistency + final sk-doc template sweep.

Each wave: dispatch parallel `deep-review` LEAF agents → `verify-iteration.cjs` per agent → `reduce-state.cjs --create-missing-anchors` once for the wave → `convergence.cjs` once for the wave → strategy update for the next wave.

### Phase 2: Remediation

Cross-check the automated findings registry against the raw iteration log before trusting it (per this session's established practice — the reducer has twice silently dropped a registered finding and substituted a synthetic placeholder). Dispatch parallel fix agents (one per confirmed P0/P1, or grouped by area if the volume warrants), each followed by an independent verify agent. Where verification surfaces a partial fix or a residual gap, close it directly rather than accepting a partial result as done.

### Phase 3: Close-Out

Re-run every structural checker fresh (not cached) after all fixes land: `package_skill.py --check` per mode packet, `parent-skill-check.cjs` on the hub. Regenerate any hash-tracked compiled artifacts touched by the fixes. Write the final `review-report.md` with the real verdict and evidence. Update the findings registry to reflect resolved vs. still-deferred (P2) items. Release the loop lock and close the tracking packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `package_skill.py --check` on all 6 mode packets + `parent-skill-check.cjs` on the hub, run fresh at iteration 20 and again after remediation.
- Relevant vitest suites re-run per fix, with a clean-baseline comparison wherever a pre-existing-vs-regression question exists.
- Independent verify agents never trust the fix agent's self-report — every verdict is backed by real command output the verifier ran itself.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl` and the `deep_review_auto.yaml` phase_loop contract — the workflow this review hand-drives.
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` (`runAuditedExecutorCommand`) — the audited dispatch path for every iteration.
- `.opencode/skills/sk-doc/scripts/package_skill.py` and `.opencode/commands/doctor/scripts/parent-skill-check.cjs` — the structural conformance checkers.
- `.opencode/skills/sk-design/mode-registry.json` and `hub-router.json` — ground truth for the 6-mode structure this review's rotation is built around.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All fixes are uncommitted file edits inside `.opencode/skills/sk-design/`. `git checkout -- .opencode/skills/sk-design/` reverts everything from this packet's remediation in one shot if needed before any commit. No destructive operations were performed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Parent packet**: `../spec.md`
- **Precedent**: `../../../system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/` (sequential 20-iteration pattern, this packet's direct structural template, adapted for wave-parallel dispatch)
<!-- /ANCHOR:cross-refs -->
