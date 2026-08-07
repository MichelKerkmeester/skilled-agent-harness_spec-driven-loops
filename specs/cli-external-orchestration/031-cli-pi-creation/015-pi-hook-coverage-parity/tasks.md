---
title: "Tasks: Pi hook coverage parity"
description: "Task breakdown for bridging 8 buildable devin/cursor hooks into .pi/extensions/ and documenting 2 confirmed non-gaps."
trigger_phrases: ["pi hook coverage parity tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/015-pi-hook-coverage-parity"
    last_updated_at: "2026-07-27T20:30:34Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks executed with real evidence; GLM-5.2 reviewed, findings addressed"
    next_safe_action: "None -- phase complete"
    blockers: []
    key_files: [".pi/extensions/lib/claude-hook-adapter.ts"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-hook-coverage", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Pi hook coverage parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the installed `@earendil-works/pi-coding-agent` package's `dist/core/extensions/types.d.ts` directly [EVIDENCE: full Read call, confirmed 33-event `ExtensionAPI.on()` surface, `ToolCallEventResult.block`, `InputEventResult` variants]
- [x] T002 [P] Read `.devin/hooks.v1.json`, `.cursor/hooks.json`, and both READMEs [EVIDENCE: full Read calls, confirmed 13 real adapters each across 7-8 events]
- [x] T003 [P] Read every missing hook's real source: `session-start.js`/`session-prime.ts`, `session-stop.js`/`session-stop.ts`, `user-prompt-submit.js` (devin shim + skill-advisor implementation), `post-compaction.cjs`, `permission-request-policy.mjs`, `spec-gate-prebind.mjs`, `worktree-guard.sh`, `check-git-hooks.sh`, `install-codex-hooks.mjs` [EVIDENCE: full Read/Bash-cat calls on each]
- [x] T004 Classify each hook buildable or non-gap based on real logic [EVIDENCE: `spec.md` §2/§3; 8 buildable, 2 confirmed non-gaps]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Author `.pi/extensions/lib/claude-hook-adapter.ts` [EVIDENCE: `runClaudeHookAdapter()` + `extractAdditionalContext()`, mirrors devin's `hooks/devin/shared.ts` spawnSync pattern]
- [x] T006 Author `session-start-context.ts` (`session_start` -> `session-prime.js`) [EVIDENCE: file created, MODULE header + TSDoc]
- [x] T007 Author `session-start-advisories.ts` (`session_start` -> 4 CLI checks) [EVIDENCE: file created, bundles worktree-guard/check-git-hooks/check-dist-staleness/install-codex-hooks]
- [x] T008 Author `session-stop-context.ts` (`session_shutdown` reason `quit` -> `session-stop.js`) [EVIDENCE: file created]
- [x] T009 Author `prompt-advisor.ts` (`input` -> skill-advisor UserPromptSubmit) [EVIDENCE: file created]
- [x] T010 Author `session-compact-context.ts` (`session_compact` native port of `post-compaction.cjs`) [EVIDENCE: file created, reuses shared tmpdir state file + `spec-memory.cjs` CLI]
- [x] T011 Isolated spawn test of `session-prime.js` and `user-prompt-submit.js` against real stdin payloads [EVIDENCE: `session-prime.js` returned plain text, `user-prompt-submit.js` returned a `hookSpecificOutput` JSON envelope -- corrected `session-start-context.ts`'s initial wrong JSON-extraction assumption]
- [x] T012 Verify `input`-transform composition semantics via a direct read of `runner.js`'s `emitInput()` [EVIDENCE: confirmed transforms chain additively across handlers, not last-writer-wins -- `prompt-advisor.ts` composes safely with `spec-gate-classify.ts`]
- [x] T013 Update `.pi/extensions/README.md`: Directory Tree, Key Files, new §3A CONFIRMED NON-GAPS, Boundaries and Flow, Entrypoints [EVIDENCE: diff shows all 5 sections updated for 12 total files]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 `pi --offline --approve -p "list your available tools"` re-run after each structural change [EVIDENCE: exit 0, 0 extension-load errors, all 3 runs]
- [x] T015 `validate_document.py` on `.pi/extensions/README.md` + manual HVR grep (em dash, semicolon) [EVIDENCE: `VALID, 0 issues`; 1 self-introduced semicolon found by manual grep and fixed]
- [x] T016 GLM-5.2 independent review [EVIDENCE: see `implementation-summary.md`]
- [x] T017 Whole-packet spec-kit `validate.sh --recursive --strict` (parent + all 15 phases) [EVIDENCE: see `implementation-summary.md`]
- [x] T018 Author `implementation-summary.md` [EVIDENCE: this document]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` with real evidence
- [x] No `[B]` blocked tasks remaining
- [x] `validate.sh --strict` exits with `Errors: 0` for this phase folder
- [x] GLM-5.2 review completed, findings addressed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- Extends `../008-pi-hook-extension-layer/`, `../012-pi-runtime-compatibility/`
- Terminal phase of `031-cli-pi-creation` -- no successor
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
