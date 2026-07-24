---
title: "Verification Checklist: cli-cursor hooks Claude-parity expansion"
description: "Verification checklist for the cli-cursor hooks Claude-parity expansion phase."
trigger_phrases: ["cli-cursor hooks Claude parity checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/011-cursor-hooks-claude-parity"
    last_updated_at: "2026-07-24T18:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All checklist items verified"
    next_safe_action: "Run validate.sh --strict, commit"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-claude-parity", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: cli-cursor hooks Claude-parity expansion

All items below are checked -- this phase is Complete.

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling |
|---|---|
| P0 | Must pass before this phase is Complete |
| P1 | Should pass; document any gap |
| P2 | Nice-to-have; document if skipped |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION
- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
- [x] CHK-003 [P0] Confirmed the phase-010 4-entry `.cursor/hooks.json` baseline before adding to it (direct read of the committed file)
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [x] CHK-004 [P0] `.cursor/hooks.json` adds exactly 5 Tier-0 script entries, 1 `postToolUse` array, 1 2nd `preToolUse` entry (`matcher: "Task"`), 1 2nd `beforeSubmitPrompt` entry, and 1 `preCompact` array -- no invented event names; every event name traces to `hook-contract.md` §4 or this phase's own live-fire evidence
- [x] CHK-005 [P0] `post-tool-use.mjs`'s `Shell`->`Bash` `tool_name` normalization confirmed load-bearing: `dispatch-audit-posttooluse.mjs` matches the literal string `bash`, and a synthetic `tool_name: "Shell"` payload piped through `post-tool-use.mjs` produced a real new line in `.opencode/logs/cli-dispatch-audit.log` with correct `sessionID`/`callID`/`command`/`skill` fields
- [x] CHK-006 [P0] `task-dispatch-guard.mjs` registered as a SECOND `preToolUse` array entry (`matcher: "Task"`), not replacing the existing unmatched `spec-gate-enforce.mjs` entry -- confirmed by direct read of `.cursor/hooks.json`
- [x] CHK-007 [P1] `mcp-route-guard.mjs` deliberately excluded from `.cursor/hooks.json`; the reason (no configured MCP server: `.cursor/mcp.json` absent, `~/.cursor/mcp.json` 0 bytes, `cursor-agent mcp list` reports none) and consequence (`beforeMCPExecution`'s field-name assumption stays unverified) are stated in `spec.md` and `feature-catalog.md`
- [x] CHK-008 [P1] The Tier-1c `completion-evidence-stop.cjs` analog was not built; the reason (`payload.last_assistant_message` has no Cursor-side source; only `transcript_path`, a JSONL file path) is stated in `spec.md`'s Out of Scope and `implementation-summary.md`'s Known Limitations
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## TESTING
- [x] CHK-009 [P0] Live-fire dispatch 1 (file write + shell command): marker log shows `sessionStart-fired` x1, `preToolUse-unmatched-fired` x3, `postToolUse-fired` x2 (Write + Shell), `sessionEnd-fired` x1
- [x] CHK-010 [P0] Live-fire dispatch 3 (explicit subagent-delegation prompt): marker log shows `preToolUse-Task-fired` x1 AND `preToolUse-unmatched-fired` x1 for the SAME `Task` tool call, confirming Cursor's `matcher` schema field actually routes by `tool_name`
- [x] CHK-011 [P1] Live-fire dispatch 2 (plain prompt "What is 2+2?") shows NO `beforeSubmitPrompt`-classify/advisor marker -- re-confirms the pre-existing dormancy finding rather than contradicting it
- [x] CHK-012 [P1] `user-prompt-submit.js` and `precompact.js` each standalone-tested with synthetic stdin before wiring: `user-prompt-submit.js` returned a real advisor `agent_message` (proving the explicit `prompt` field addition was load-bearing); `precompact.js` returned `{"permission":"allow"}` cleanly
- [x] CHK-013 [P0] Diagnostic marker-wrapper fully reverted; `.cursor/hooks.json` diffed byte-identical against its clean, intended content before finishing; all `/tmp` test artifacts (wrapped-hooks backup, marker log, dispatch logs, probe workdir/files) deleted
- [x] CHK-014 [P0] `python3 -m json.tool .cursor/hooks.json` confirms valid JSON on the final, committed version
- [x] CHK-015 [P0] `bash validate.sh 030-cli-cursor-creation --recursive --strict` passes across the phase-parent and all 11 phase children
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS
- [x] CHK-016 [P1] Feature-catalog `cursor-hooks-and-spec-gate.md` and `feature-catalog.md`'s hooks summary updated to describe only the adapters this phase actually wired and confirmed -- no claim beyond this phase's own evidence
- [x] CHK-017 [P1] `../010-cursor-hooks-live-wiring/spec.md`'s `Successor` field updated from `None (packet extension)` to point at this phase's `spec.md`
- [x] CHK-018 [P1] `git status --porcelain` re-run after all edits -- confirmed the only tracked-file diffs are this phase's intended files plus phase 010's Successor-field update; pre-existing concurrent-session activity (023/024/025 archive-move, mcp-tooling research, 036 metadata, sk-doc/019 research rounds) identified, left untouched, and is not part of this phase's diff
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## SECURITY
- [x] CHK-019 [P1] `grep -riE "sk-ant|sk-proj|CURSOR_(API_KEY|AUTH_TOKEN)\s*="` across `.cursor/hooks.json` and all new/modified adapter files -> 0 matches
- [x] CHK-020 [P1] No absolute, machine-specific paths added to `.cursor/hooks.json` -- every new entry uses the same relative-path convention as the phase-010 baseline (confirmed by direct read)
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## DOCUMENTATION
- [x] CHK-021 [P1] `dispatch-audit-posttooluse.mjs`'s hardcoded `runtime: 'claude'` provenance drift (confirmed live: the recorded audit line reads `runtime:"claude"` even when proxied from Cursor) is documented as a known, cosmetic limitation, not silently left unmentioned
- [x] CHK-022 [P2] No fabricated claim that `mcp-route-guard.mjs`'s `tool_name`/`workspace_roots` field-name assumption is confirmed -- every mention states it is inferred by analogy, not independently verified for `beforeMCPExecution`
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION
- [x] CHK-023 [P1] Only in-scope files touched: `.cursor/hooks.json`, `shared.ts`, 5 new adapter files (1 unwired), compiled `dist/` (gitignored), feature-catalog + playbook doc updates, and `../010-cursor-hooks-live-wiring/spec.md`'s Successor-field pointer; no packet-local `graph-metadata.json`/`description.json` added outside the spec-folder convention
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 11 | 11/11 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-24 -- live-fire proof captured across 3 real dispatches, synthetic-pipe proof for the postToolUse normalization, standalone-test proof for the registered-but-unconfirmed proxies, whole-packet `validate.sh --recursive --strict` passing.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
