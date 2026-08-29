---
title: "Task Ledger: cli-external-orchestration Activation Manifest Re-Mint"
description: "The task ledger for reproducing the legacy fallback, re-minting the activation manifest, and proving the repair with the commands that showed the failure."
trigger_phrases:
  - "re-mint task ledger"
  - "activation manifest tasks"
  - "compiled routing repair tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/024-cli-external-hub-manifest-remint"
    last_updated_at: "2026-08-29T22:45:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All tasks closed with observed command evidence"
    next_safe_action: "None; repair live on main and v4 at the same commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "024-cli-external-hub-manifest-remint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Task Ledger: cli-external-orchestration Activation Manifest Re-Mint

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each closed task names the command or file that proves it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Create a detached worktree at `origin/main`. Evidence: worktree at `790c3dfc1c5`.
- [x] T-002 Read the guard's true exit status without a pipe. Evidence: `GUARD EXIT=1`, `cli-external-orchestration stale-manifest`.
- [x] T-003 Capture both hashes. Evidence: selected `84e253d5…` generation 5, current `d307e097…`.
- [x] T-004 Reproduce the user-visible failure. Evidence: `resolve.cjs` returned `{"servingAuthority":"legacy","hubId":"cli-external-orchestration"}`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-005 Identify the coupling that made the skill edit unsafe. Evidence: `build-artifacts.cjs` `sourceInputs()` reads all seven `cli-*` `SKILL.md` files into `sourceBytes`.
- [x] T-006 Separate the live manifest from the frozen rollout record. Evidence: the `009-parent-hub-rollout` copy carries `effectivePolicyHash: null`, `generation: 0`, `servingAuthority: legacy`, and its `compiled/policy.json` already held `78723d28…`.
- [x] T-007 Re-mint the promoted manifest. Evidence: `refresh` returned `fresh: true`, `refreshed: true`, current hash `d307e097…`.
- [x] T-008 Mirror the authored copy. Evidence: `cmp` reports the two files identical.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-009 Confirm compiled serving. Evidence: `resolve.cjs` returns `action: "route"` to `cli-cursor` carrying `d307e097…`.
- [x] T-010 Confirm the fleet. Evidence: `compiled-route-guard.cjs` exit 0, five hubs `fresh`.
- [x] T-011 Confirm the promoted closure. Evidence: `compiled-route-sync.cjs --verify` exit 0, `all 5 hubs resolve; 0 reads under .opencode/specs`.
- [x] T-012 Run the regression suites. Evidence: `compiled-route-manifest.test.cjs` 42 pass / 0 fail; bin vitest 34 pass, exit 0.
- [x] T-013 Negative-control the canary. Evidence: it fails identically on pristine `origin/main`, asserting rollout-frozen source digests.
- [x] T-014 Prove the final state is clean. Evidence: build residue removed; `git status` shows exactly the two manifests.
- [x] T-015 Reconcile against the branch state. Evidence: `3a61fa96ac` landed the same repair on `main` and `skilled/v4.0.0.0`; rebasing onto it left no manifest diff, and the guard exits 0 with five hubs fresh on that commit.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All fourteen tasks are closed with observed command evidence, the reproduction is paired with its
repair by the same command, and the working tree carries only the two intended files.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` - the defect and its scope.
- `plan.md` - the sequenced approach.
- `checklist.md` - the verification checklist.
- `implementation-summary.md` - the delivered state.
- `../022-legacy-hub-compiled-routing-refresh/` - the deferred plan for the same class of refresh.
<!-- /ANCHOR:cross-refs -->
