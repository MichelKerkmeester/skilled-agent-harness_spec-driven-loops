---
title: "Tasks: Per-Runtime Cheapest-Model Standardization of the CLI Manual-Testing Playbooks"
description: "Task breakdown for the documentation-only per-runtime playbook model standardization: confirm ids, substitute per runtime with model-under-test scenarios preserved, and verify completeness, containment, and gateway-not-direct provider selection."
trigger_phrases:
  - "playbook cheapest model tasks"
  - "cli playbook model swap tasks"
importance_tier: "supporting"
contextType: "tasks"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/010-playbook-cheapest-model"
    last_updated_at: "2026-08-08T10:47:17Z"
    last_updated_by: "claude"
    recent_action: "Completed per-runtime substitution and verification tasks"
    next_safe_action: "Port the delta to skilled/v4.0.0.0 on operator approval"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/manual-testing-playbook/"
    session_dedup:
      fingerprint: "sha256:a90f3a0c6433c12eba6fe7f0cb04327b97685d08eee615331b16255820b0d125"
      session_id: "2026-08-08-hooks-002-010"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Per-Runtime Cheapest-Model Standardization of the CLI Manual-Testing Playbooks

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete, `[ ]` pending, `[~]` deferred with rationale.
- `T-NNN` task ids are stable within this packet only.
- Each verification task names the command and its observed result.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Confirm each runtime's cheapest model id and flags against its `cli-<runtime>/SKILL.md`
- [x] T-002 Inventory real model-token references with boundary-anchored greps (avoiding the `isolated`/`console` substring false positive)
- [x] T-003 Enumerate the model-under-test paths to preserve per runtime
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-004 Codex: `gpt-5.6-sol`→`gpt-5.6-luna`, `gpt-5.5`→`gpt-5.6-luna`, bare `gpt-5.6`→`gpt-5.6-luna`; default `model_reasoning_effort="medium"`→`"high"`; preserve `reasoning-effort/`
- [x] T-005 Cursor: residual `gpt-5.2`/`gpt-5.2-high`/`composer-2.5-fast` dispatch → `composer-2.5`; preserve model-selection scenarios
- [x] T-006 Devin: residual `swe-1.6` → `SWE-1.7`
- [x] T-007 OpenCode: `deepseek/deepseek-v4-pro` and bare `deepseek-v4-pro` dispatch → `opencode-go/deepseek-v4-flash`; preserve `model-dispatch/`, `kimi-*`, `minimax-*`, `deepseek-v4-direct`
- [x] T-008 Pi: deepseek dispatch → `opencode-go/deepseek-v4-flash`; preserve `model-dispatch/`
- [x] T-009 Claude: `claude-sonnet-4-6`/`claude-opus-4-6` → `claude-sonnet-5`; preserve `reasoning-and-models/` and `default-model-selection-sonnet.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-010 Grep each runtime for target-model presence and zero residual replaced tokens outside preserved paths
- [x] T-011 Assert opencode/pi dispatch uses `opencode-go/deepseek-v4-flash` and never the direct `deepseek/deepseek-v4-flash` form
- [x] T-012 Scope + collateral sweep: only `manual-testing-playbook` markdown and this packet changed; no runtime source touched
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every vehicle-model scenario across six runtimes names the operator-chosen cheapest model
- [x] Every preserved model-under-test scenario is unchanged
- [x] The diff is documentation-only and each written model string is valid for its runtime
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — scope, per-runtime mapping, and requirements
- `plan.md` — path-scoped substitution with preservation allowlist
- `checklist.md` — verification evidence
- `implementation-summary.md` — final state and grep evidence
<!-- /ANCHOR:cross-refs -->
