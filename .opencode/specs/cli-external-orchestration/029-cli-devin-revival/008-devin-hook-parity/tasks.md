---
title: "Tasks: Devin hook parity"
description: "Task breakdown for building the remaining Devin hook adapters."
trigger_phrases: ["devin hook parity tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity"
    last_updated_at: "2026-07-24T06:43:46Z"
    last_updated_by: "claude-code"
    recent_action: "Authored task breakdown; all tasks unchecked, phase Planned"
    next_safe_action: "Wait for phase 004, then start T001 contract resolution"
    blockers: ["depends on phase 004 landing first"]
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Devin hook parity

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that can run in parallel; `[B]` marks a blocked task pending a decision.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Live-verify Devin's field-level schema for `PreToolUse`, `PostToolUse`, `Stop`, `PostCompaction`, `SessionEnd`, `PermissionRequest` against an authenticated `devin` session
- [ ] T002 Confirm `.devin/hooks.v1.json` discovery/precedence order (standalone file vs. `hooks` key in `.devin/config.json`/`.devin/config.local.json`, project vs. user-global) - resolves phase 004's still-open REQ-007
- [ ] T003 [B] Resolve all 5 ADRs in `decision-record.md` before writing adapter code
- [ ] T004 Confirm whether Devin has a headless/non-interactive dispatch shape mirroring `codex exec -p`, informing `task-dispatch-guard.cjs`'s detection logic (soft dependency on phase 002's `buildDevinLineageCommand`; defer this sub-item if 002 hasn't landed)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Guard-core adapters
- [ ] T005 [P] Create `cli-opencode/scripts/hooks/devin/dispatch-preflight-lint.mjs` (PreToolUse `^exec$`, deny-capable, wraps `dispatch-rule-checks.mjs`)
- [ ] T006 [P] Create `cli-opencode/scripts/hooks/devin/dispatch-audit-posttooluse.mjs` (PostToolUse `^exec$`, observe-only, wraps `dispatch-audit.mjs`, tag `runtime:'devin'`)
- [ ] T007 [P] Create `sk-code/code-quality/scripts/hooks/devin/post-edit-quality.cjs` (PostToolUse `^edit$`, advisory, wraps `post-edit-router.cjs`)
- [ ] T008 [P] Create `system-code-graph/runtime/hooks/devin/code-graph-freshness.cjs` (PostToolUse `^edit$`, optional SessionStart, wraps `freshness-core.cjs`)
- [ ] T009 [P] Create `mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs` (PreToolUse `^mcp__.*$`, warn-only, wraps `mcp-route-guard.cjs` core; document dormancy pending phase 009)
- [ ] T010 [P] Create `system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs` (PreToolUse `^run_subagent$`, wraps `dispatch-guard.cjs`; real adapter, deliberate divergence from Codex's fold-in)

### Lifecycle-completion adapters
- [ ] T011 [P] Create `system-spec-kit/mcp-server/hooks/devin/completion-evidence-stop.cjs` (Stop, advisory, wraps `completion-evidence-sentinel.cjs`, standalone no-build-step .cjs like the Codex sibling)
- [ ] T012 [P] Create `system-spec-kit/mcp-server/hooks/devin/session-stop.ts` (Stop, delegates to compiled `../claude/session-stop.js`)
- [ ] T013 Create `system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs` (PostCompaction, bespoke 5-step recovery chain: retain summary first, rehydrate continuity, bounded `memory_context(mode=resume)` fallback, provenance filter, emit `additionalContext` directly)

### Registration
- [ ] T014 [B] Decide and wire `SessionEnd`: register `session-cleanup.sh` directly if T001 shows lenient stdout handling; else document the fallback fold-into-`Stop` decision with rationale
- [ ] T015 Register `worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh --all`, `install-codex-hooks.mjs --check` in `.devin/hooks.v1.json`'s `SessionStart` array, each anchored at `${DEVIN_PROJECT_DIR}`
- [ ] T016 Add explicit empty `"PermissionRequest": []` with a documented "no source handler to port" comment
- [ ] T017 Extend `.devin/hooks.v1.json` with all T005-T014 entries, preserving phase 004's `SessionStart`/`UserPromptSubmit` entries verbatim (merge, never replace)
- [ ] T018 [P] Author `README.md` in each new `hooks/devin/` sibling directory, mirroring the Codex siblings
- [ ] T019 [B, conditional] Only if T002 finds project-level registration inert: build `.opencode/bin/install-devin-hooks.mjs` mirroring `install-codex-hooks.mjs`'s idempotent backup-and-merge pattern
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T020 Fixture stdin-pipe smoke + fail-open check (empty/malformed input) for every new adapter
- [ ] T021 Live `devin` session matrix for the representative event set
- [ ] T022 Diff all 8 neutral cores against pre-phase state - zero diff required
- [ ] T023 Extend the cli-devin manual-testing playbook (cross-ref phase 006) with observed live output per newly wired event
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] T024 Finalize `implementation-summary.md`; `validate.sh --strict` → 0 errors; update parent `spec.md`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Consumed by `../009-devin-mcp-host-integration/` (re-evaluates `mcp-route-guard.cjs` dormancy).
- Builds on `../004-devin-hook-adapter-layer/` (predecessor, not modified).
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`, `decision-record.md`
