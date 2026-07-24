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
    recent_action: "All tasks complete: 10 adapters + hooks.v1.json extension built, tested, re-confirmed dormant"
    next_safe_action: "Regenerate description/graph-metadata, validate --recursive --strict, commit"
    blockers: []
    key_files: ["spec.md", "decision-record.md", "../../../.devin/hooks.v1.json"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Does true interactive devin mode (no TTY here) fire hooks where -p does not?"]
    answered_questions: ["T001/T002/T004: moot - -p never consults hook config at all, so field-schema live-capture and discovery-order both stay unconfirmed by design, not by omission.", "T014: SessionEnd registered directly (session-cleanup.sh) - Devin has a real native SessionEnd event, unlike Codex."]
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
- [x] T001 **Resolved as moot, not performed.** `devin -p` is confirmed to never consult hook config at all (phase 004 finding, re-confirmed post-extension) - there is no live-fire event to capture a field-level schema from. Adapters use the same tolerant field-name fallbacks the Claude/Codex siblings already use instead of an unconfirmed exact shape.
- [x] T002 **Resolved as moot.** Discovery/precedence order between a project-level file and a user-global installer cannot matter while `-p` never consults hook config at either location. Phase 004's REQ-007 closed on this basis. Evidence: `../004-devin-hook-adapter-layer/decision-record.md` ADR-001.
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
- [x] T009 [P] Created `mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs`. Dormant for two reasons (packet-wide -p finding + no external MCP family registered), documented, forwarded to 009.
- [x] T010 [P] Created `system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs`. Tested happy-path + fail-open.
- [x] T010b (added mid-implementation, not in original matrix) Created `system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` (PreToolUse `^exec$`\|`^edit$`, deny-capable) - real gap the original 9-file matrix missed; research §10 (C-02/C-05/G-01) had already scoped it. Tested: non-mutating tool, exec, edit-with-file_path, malformed stdin.

### Lifecycle-completion adapters
- [x] T011 [P] Created `system-spec-kit/mcp-server/hooks/devin/completion-evidence-stop.cjs`. Tested with a completion-claim payload.
- [x] T012 [P] Created `system-spec-kit/mcp-server/hooks/devin/session-stop.ts`. Typechecked 0 errors, compiled, tested.
- [x] T013 Created `system-spec-kit/mcp-server/hooks/devin/post-compaction.cjs`. Tested with and without `summary`; 2 authoring bugs found and fixed pre-test (broken `&&`-chained `require()` leaving `createHash` undefined; literal raw control-character bytes in the sanitizer regex, replaced with `\x` escapes).

### Registration
- [x] T014 [B] Decided: register `session-cleanup.sh` directly under `SessionEnd` - Devin has a real native `SessionEnd` event (Codex has none and had to fold). Live stdout-strictness evidence is unobtainable while hooks stay dormant under `-p`; decision is structural, not behavior-verified.
- [x] T015 Registered `worktree-guard.sh`, `check-git-hooks.sh`, `check-dist-staleness.sh --all`, `install-codex-hooks.mjs --check` in `.devin/hooks.v1.json`'s `SessionStart` array.
- [x] T016 Added explicit empty `"PermissionRequest": []`.
- [x] T017 Extended `.devin/hooks.v1.json` with all T005-T013 entries (JSON-validated), preserving phase 004's `SessionStart`/`UserPromptSubmit` entries verbatim.
- [x] T018 [P] Authored `README.md` in each of the 5 new `hooks/devin/` sibling directories (`cli-opencode`, `mcp-code-mode`, `sk-code/code-quality`, `system-code-graph`, `system-deep-loop`); updated the 2 existing `hooks/devin/README.md` files (`mcp-server/`, `runtime/`) to list the new files landed in those same directories.
- [x] T019 [B, conditional] **Not built** - T002 confirmed the project-level file is dormant regardless of location (never consulted under `-p` at all), so an idempotent installer would not change that. Correctly out of scope, not incomplete. Evidence: no `install-devin-hooks.mjs` file exists under `.opencode/bin/`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T020 Fixture stdin-pipe smoke + fail-open check (empty/malformed input) done for all 10 new adapters (T005-T010, T010b, T011-T013). Evidence: `checklist.md` CHK-011/CHK-022, 20/20 exit=0.
- [x] T021 Live `devin -p` re-test against the fully-extended `.devin/hooks.v1.json` (all 7 event categories, 15 command entries) - zero hook output observed, matching phase 004's finding exactly.
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
