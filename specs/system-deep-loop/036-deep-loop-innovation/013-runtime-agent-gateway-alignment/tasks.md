---
title: "Tasks: Runtime Agent Gateway Alignment"
description: "Task breakdown for migrating the deep-loop leaf agent prompts to the append gateway across all six runtimes."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-runtime-agent-gateway-alignment"
    last_updated_at: "2026-08-25T07:26:58Z"
    last_updated_by: "claude"
    recent_action: "Executed all phases; guard 24/24 green"
    next_safe_action: "Hold for the operator's commit/push instruction"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Runtime Agent Gateway Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending · `[x]` complete · `[B]` blocked/deferred (with reason)
- `[P]` parallelizable with siblings
- Each task names its verification.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 [P0] Author the doc-level guard detecting direct `*-state.jsonl` writes and missing gateway references. Verify: `scripts/check-agent-gateway.sh` runs and iterates all 24 files (resolving `.md`/`.toml`/`AGENT.md` and following symlinks).
- [x] T-002 [P0] Run the guard and record the negative control. Verify: exit 2, all 24 affected files named.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 [P0] Migrate the four `.claude/agents` files to the gateway (per-mode `--mode`). Verify: guard `ok` for `.claude`.
- [x] T-004 [P0][P] Mirror the migration into `.opencode`, `.pi`, and `.codex` (cursor + devin follow via symlink). Verify: guard `ok` per runtime.
- [x] T-005 [P0] Remove the `deep-alignment` literal `printf >> …-state.jsonl` redirect in every runtime. Verify: grep for the redirect returns 0.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-006 [P0] Run the guard across all six runtimes (rules A–D). Verify: `checked=24 failing=0`, exit 0.
- [x] T-007 [P0] Correct the `--event-json` contract (single record, not the multi-line delta) across all files. Verify: guard rule D clean; grep for `--event-json …deltas/` returns 0.
- [x] T-008 [P0] Confirm codex TOML integrity. Verify: 2 `'''` delimiters + 6 keys per file.
- [x] T-009 [P0] Scoped-diff check and no-stray sweep. Verify: only agent files + spec folder; no runtime code / YAML / SKILL.md / sqlite / jsonl.
- [x] T-010 [P0] `validate.sh <spec-folder> --strict`; refresh `description.json` + `graph-metadata.json`. Verify: exit 0.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- All four agents record through the gateway in all six runtimes; the guard passes 24/24.
- `deep-improvement` is unchanged (proposal-only).
- The scoped diff contains only the agent files and this spec folder.
- `validate.sh --strict` exits clean.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and scope.
- `plan.md` — approach and phases.
- `decision-record.md` — the leaf-calls-the-gateway and `--event-json` single-record decisions.
- `scripts/check-agent-gateway.sh` — the doc-level guard.

<!-- /ANCHOR:cross-refs -->
