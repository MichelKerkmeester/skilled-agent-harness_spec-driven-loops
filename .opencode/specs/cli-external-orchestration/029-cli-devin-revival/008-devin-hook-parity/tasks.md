---
title: "Tasks: Devin hook parity"
description: "Task breakdown for building the remaining Devin hook adapters."
trigger_phrases: ["devin hook parity tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity"
    last_updated_at: "2026-07-24T18:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Corrected task outcomes after documented-schema live verification"
    next_safe_action: "Use phase 011 current-status evidence"
    blockers: []
    key_files: ["spec.md", "decision-record.md", "../../../.devin/hooks.v1.json"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Do PermissionRequest and PostCompaction fire when those events occur?", "Does run_subagent expose the expected live payload?"]
    answered_questions: ["Project-level hook config works under devin -p with the documented schema.", "SessionEnd registered directly and fired under the corrected schema."]
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
- [x] T001 **Corrected 2026-07-25.** The original no-event result used an unsupported wrapper schema. The corrected file produced live events and captured real payload fields for `exec`, `edit` and `read`.
- [x] T002 **Corrected 2026-07-25.** Project-level discovery works under `devin -p` with top-level event arrays and nested matcher groups.
- [x] T003 Resolved - see `decision-record.md` (5 ADRs, revised for this phase's real implementation).
- [x] T004 **Resolved as moot for the same reason as T001** - `run_subagent`'s payload was never observable live; `task-dispatch-guard.cjs` uses the same defensive fallback field-name matching (`subagent_type\|subagentType\|agent_type\|agentType`) the shared core already tolerates.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Guard-core adapters
- [x] T005 [P] Created `cli-opencode/scripts/hooks/devin/dispatch-preflight-lint.mjs`. Tested: non-dispatch cmd -> allow; real `opencode run` dispatch cmd -> real `stdin-redirect-required` advisory.
- [x] T006 [P] Created `cli-opencode/scripts/hooks/devin/dispatch-audit-posttooluse.mjs`. Tested happy-path + fail-open.
- [x] T007 [P] Created `sk-code/code-quality/scripts/hooks/devin/post-edit-quality.cjs`. Tested against a real file edit.
- [x] T008 [P] Created `system-code-graph/runtime/hooks/devin/code-graph-freshness.cjs`. Tested against a real file edit.
- [x] T009 [P] Created `mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs`. Registered and directly tested; no external non-`mk_` MCP family exists yet, documented and forwarded to 009.
- [x] T010 [P] Created `system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs`. Tested happy-path + fail-open.
- [x] T010b (added mid-implementation, not in original matrix) Created `system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` (PreToolUse `^exec$`\|`^edit$`, deny-capable) - real gap the original 9-file matrix missed; research §10 (C-02/C-05/G-01) had already scoped it. Tested: non-mutating tool, exec, edit-with-file_path, malformed stdin.

### Lifecycle-completion adapters
- [x] T011 [P] Created `system-spec-kit/mcp-server/hooks/devin/completion-evidence-stop.cjs`. Tested with a completion-claim payload.
- [x] T012 [P] Created `system-spec-kit/mcp-server/hooks/devin/session-stop.ts`. Typechecked 0 errors, compiled, tested.
- [x] T013 Created `system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs`. Tested with and without `summary`; 2 authoring bugs found and fixed pre-test (broken `&&`-chained `require()` leaving `createHash` undefined; literal raw control-character bytes in the sanitizer regex, replaced with `\x` escapes).

### Registration
- [x] T014 [B] Register `session-cleanup.sh` directly under `SessionEnd`. Corrected-schema testing observed the event; adverse stdout strictness was not separately exercised.
- [x] T015 Registered `worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh --all`, `install-codex-hooks.mjs --check` in `.devin/hooks.v1.json`'s `SessionStart` array.
- [x] T016 Added explicit empty `"PermissionRequest": []`.
- [x] T017 Extended `.devin/hooks.v1.json` with all T005-T013 entries (JSON-validated), preserving phase 004's `SessionStart`/`UserPromptSubmit` entries verbatim.
- [x] T018 [P] Authored `README.md` in each of the 5 new `hooks/devin/` sibling directories (`cli-opencode`, `mcp-code-mode`, `sk-code/code-quality`, `system-code-graph`, `system-deep-loop`); updated the 2 existing `hooks/devin/README.md` files (`mcp-server/`, `runtime/`) to list the new files landed in those same directories.
- [x] T019 [B, conditional] **Not built** - project-level registration works under the documented schema, so no user-global installer is needed. Evidence: no `install-devin-hooks.mjs` file exists under `.opencode/bin/`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T020 Fixture stdin-pipe smoke + fail-open check (empty/malformed input) done for all 10 new adapters (T005-T010, T010b, T011-T013). Evidence: `checklist.md` CHK-011/CHK-022, 20/20 exit=0.
- [x] T021 Live `devin -p` re-test corrected by phase 011: current file has 8 events, 11 matcher groups and 19 commands; six lifecycle events fired.
- [x] T022 `git diff --stat` on all 9 neutral cores (the original 8 plus `spec-gate-core.mjs`) confirmed empty.
- [x] T023 Cross-referenced phase 006 (manual-testing playbook) and phase 010 (feature catalog) for phase-008 hook mentions; updated as needed. Evidence: `../006-devin-manual-testing-playbook/spec.md` REQ-009/SC-007 and `../010-devin-feature-catalog/spec.md` REQ-004/005/006 revised 2026-07-24.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T024 `implementation-summary.md` written; `validate.sh --strict` run for 0 errors; parent `spec.md`'s Phase Documentation Map updated for phase 008.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Consumed by `../009-devin-mcp-host-integration/` (re-evaluates `mcp-route-guard.cjs` dormancy).
- Builds on `../004-devin-hook-adapter-layer/` (predecessor, not modified).
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`, `decision-record.md`
