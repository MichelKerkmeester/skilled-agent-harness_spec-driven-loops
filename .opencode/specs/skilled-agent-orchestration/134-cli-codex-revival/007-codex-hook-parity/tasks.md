---
title: "Tasks: Codex hook/plugin parity"
description: "Task breakdown across the portable guard adapters, lifecycle wiring, native equivalents, install, and verification."
trigger_phrases: ["Codex hook parity tasks"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/007-codex-hook-parity"
    last_updated_at: "2026-07-13T20:11:19Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete; fixture + live verification passed"
    next_safe_action: "Re-point installer at the primary checkout once it reconciles to v4"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Codex hook/plugin parity
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed (carries source or verification evidence) |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (core · target adapter)`. The capability spike is complete and recorded in `decision-record.md`.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capability spike: pin the Codex 0.144.2 hook contract from the binary schema + live probe (`decision-record.md`).
- [x] T002 Conform the scaffold docs to the Level 3 template; `validate.sh --strict` → Errors: 0 (spec folder).
- [x] T003 Confirm the six neutral cores are present and map each core's entry function (spec folder) {deps: T001}. Mapped in `decision-record.md` ADR-002.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Each guard adapter is a thin sibling of the existing Claude adapter under a new `runtime/hooks/codex/` (or `scripts/hooks/codex/`) directory; it reads stdin, normalizes the Codex tool name, calls the neutral core unchanged, emits the Codex envelope, and fails open.

### Portable guard adapters
- [x] T004 spec-gate-enforce Codex adapter — PreToolUse, deny-capable — over `spec-gate-core.mjs` `evaluateMutation` {deps: T003}.
- [x] T005 spec-gate-classify Codex adapter — UserPromptSubmit, advisory — over `spec-gate-core.mjs` `classifyIntent` {deps: T003}.
- [x] T006 [P] code-graph-freshness Codex adapter — PostToolUse, fire-and-forget — over `freshness-core.cjs` `evaluateEdit` {deps: T003}.
- [x] T007 [P] post-edit-quality Codex adapter — PostToolUse, advisory — over `post-edit-router.cjs` `resolveDispatch`/`runChecks` {deps: T003}.
- [x] T008 dispatch-preflight-lint Codex adapter — PreToolUse, deny-capable — over `dispatch-rule-checks.mjs` `evaluate` {deps: T003}.
- [x] T009 [P] dispatch-audit Codex adapter — PostToolUse, observe — over `dispatch-audit.mjs` `recordDispatch` (tag `runtime:'codex'`) {deps: T003}.
- [x] T010 [P] completion-evidence Codex adapter — Stop, advisory, plain `.cjs` — over `completion-evidence-sentinel.cjs` `evaluateCompletionEvidence` {deps: T003}.

### Session-lifecycle wiring
- [x] T011 Register worktree-guard, check-git-hooks, check-dist-staleness in the Codex SessionStart chain. Wired in `.codex/hooks.json` (SessionStart: 3 guards).
- [x] T012 Fold session-cleanup into the Codex Stop chain with a neutral session-pid env. `session-cleanup.sh` in the Stop chain (`||true`, no-op without an identity).

### Native equivalents
- [x] T013 Codex route-guard adapter over `mcp-route-guard.cjs` `evaluateNativeMcpCall` with a `mcp__.*` matcher; document dormancy {deps: T003}.
- [x] T014 Extend the Codex dispatch adapter to recognize `codex exec -p` command shapes (cores unchanged); correct the ADR-005 `[profiles.*]` footnote {deps: T008, T009}.

### Install and registration
- [x] T015 Extend the versioned repo `.codex/hooks.json` with all new events and matchers, preserving existing entries {deps: T004-T013}.
- [x] T016 Add `install-codex-hooks.mjs` and run it to merge into `~/.codex/hooks.json` (backup first, idempotent) {deps: T015}.
<!-- /ANCHOR:phase-2 -->
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Fixture stdin-pipe smoke plus fail-open check (empty + malformed) for every adapter {deps: T004-T013}. `fixture-smoke` matrix 33/33 PASS.
- [x] T018 Live `codex exec --dangerously-bypass-hook-trust` matrix for the representative set — timed, with a fixture + schema fallback if it hangs {deps: T016, T017}.
- [x] T019 Author cli-codex manual testing playbook entries, cross-referenced to observed output {deps: T017}. `codex_hook_parity.md` (plus a cli-codex cross-ref).
- [x] T020 Finalize implementation-summary.md; reconcile completion metadata; `validate.sh --strict` Errors: 0; note the closeout in the 134 parent {deps: T017, T018, T019}.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Every Claude hook / OpenCode plugin has a Codex adapter, a documented native equivalent, or a documented gap — all verified. 11-row coverage map in `implementation-summary.md`.
- [x] Every adapter passes fixture smoke and fails open on empty / malformed stdin. `fixture-smoke` 33/33.
- [x] The representative set is confirmed live under `codex exec` (or the gap is documented as owed).
- [x] The six neutral cores, all Claude hooks, and all OpenCode plugins remain byte-unchanged. Landed diff `cae68c0d44` adds only new `codex/` files.
- [x] `validate.sh --strict` green; `checklist.md` verified with evidence.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Decision Records**: `decision-record.md`
- **Predecessor**: `../004-codex-hook-adapter-layer/spec.md`
<!-- /ANCHOR:cross-refs -->
