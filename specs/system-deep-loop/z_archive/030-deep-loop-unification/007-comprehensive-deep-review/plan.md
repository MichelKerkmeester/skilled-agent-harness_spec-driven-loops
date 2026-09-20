---
title: "Plan: Comprehensive Deep Review — system-deep-loop"
description: "Execution plan for the 20-iteration comprehensive deep review of system-deep-loop and remediation of confirmed findings."
trigger_phrases:
  - "deep loop comprehensive review plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/007-comprehensive-deep-review"
    last_updated_at: "2026-07-09T03:31:53.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Plan executed and verified complete"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Comprehensive Deep Review — system-deep-loop

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

Run a genuine 20-iteration `/deep:review` loop (GPT-5.5-fast, high reasoning effort, forced max-iterations) over the entire `system-deep-loop` skill tree, then fix every confirmed P0/P1 finding with independent adversarial verification before closing out.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- All 20 iterations mechanically valid (narrative + state + delta artifacts).
- All 4 dimensions covered for the hub and each of the 4 packets.
- Every confirmed P1 finding fixed and independently re-verified (not self-certified).
- Fresh sk-doc structural re-checks pass at close-out, not trusted from an earlier session.
- No regression introduced by any fix (pre-existing vs new test failures explicitly distinguished).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Same hand-driven `/deep:review` orchestration proven in this session's prior 5-iteration review: I directly execute the `deep_review_auto.yaml` phase_loop contract (init, per-iteration dispatch via the audited `cli-opencode` executor, reducer sync, convergence check, synthesis) rather than delegating to a generic script, since this IS the real, purpose-built `/deep:review` workflow — not a substitute for it.

Remediation of confirmed findings uses a separate Workflow-tool pass: one fix agent + one independent verify agent per finding, run in parallel, so no fix is accepted on self-report alone.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Review Execution

Init the review packet (config/state/strategy/findings-registry, coverage-graph seed, loop lock) with `review_target_type=skill`, `maxIterations=20`, `stopPolicy=max-iterations`, executor `cli-opencode`/`openai/gpt-5.5-fast`/`high`. Run the planned area×dimension rotation: inventory, hub (4 iterations), `deep-research` (4), `deep-review` (4), `deep-improvement` (4), `deep-ai-council` (2 combined), cross-cutting synthesis (1) = 20 total. Wrap each iteration with mechanical validation, reducer sync, and convergence check before dispatching the next.

### Phase 2: Remediation

Cross-check the automated findings registry against the raw iteration log before trusting it (this caught a real reducer bug: one P1 finding was silently dropped and replaced with a synthetic placeholder). Dispatch 7 parallel fix agents (one per confirmed P1), each followed by an independent verify agent. Where verification surfaces a partial fix or a residual gap, close it directly rather than accepting a partial result as done.

### Phase 3: Close-Out

Re-run every structural checker fresh (not cached) after all fixes land. Regenerate any hash-tracked compiled artifacts touched by the fixes. Write the final `review-report.md` with the real verdict and evidence. Update the findings registry to reflect resolved vs. still-deferred (P2) items. Release the loop lock and close the tracking packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- `package_skill.py --check` on all 4 packets + `parent-skill-check.cjs` on the hub, run fresh at iteration 20 and again after remediation.
- `check-contract-drift.vitest.ts` and `compile-command-contracts.vitest.ts` after any hash-tracked source edit.
- Per-fix: relevant vitest suites, with a `git stash`-isolated clean-HEAD comparison wherever a pre-existing-vs-regression question existed.
- Independent verify agents never trust the fix agent's self-report — every verdict is backed by real command output the verifier ran itself.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/skills/system-deep-loop/deep-review/assets/prompt_pack_iteration.md.tmpl` and the `deep_review_auto.yaml` phase_loop contract — the workflow this review hand-drives.
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` (`runAuditedExecutorCommand`) — the audited dispatch path for every iteration.
- `.opencode/skills/sk-doc/scripts/package_skill.py` and `.opencode/commands/doctor/scripts/parent-skill-check.cjs` — the structural conformance checkers.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All fixes are uncommitted file edits inside `.opencode/skills/system-deep-loop/` and `.opencode/agents/orchestrate.md`, same uncommitted state as the rest of this session's work. `git checkout -- .opencode/skills/system-deep-loop/ .opencode/agents/orchestrate.md` reverts everything from this packet's remediation in one shot if needed before any commit. No destructive operations were performed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Parent packet**: `../spec.md`
- **Precedent**: `../006-skillmd-template-conformance/`, and the earlier 5-iteration review at `../../../system-speckit/028-memory-search-intelligence/002-spec-data-quality/054-archive-renumber-010-044-to-001-023/`
<!-- /ANCHOR:cross-refs -->
