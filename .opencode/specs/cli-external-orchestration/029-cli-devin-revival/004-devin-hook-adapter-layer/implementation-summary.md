---
title: "Implementation Summary: Devin hook adapter layer"
description: "SessionStart and UserPromptSubmit adapters built, typechecked, directly tested and observed live under devin -p after correcting hooks.v1.json to the documented top-level event schema."
trigger_phrases: ["devin hook adapter summary", "devin hook live evidence"]
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer"
    last_updated_at: "2026-07-25T10:09:43Z"
    last_updated_by: "opencode"
    recent_action: "Corrected phase status after documented-schema live verification"
    next_safe_action: "Use hook-testing-results.md tests 10-14 as the current behavior authority"
    blockers: []
    key_files: [".opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md", ".opencode/skills/system-spec-kit/runtime/hooks/devin/README.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Do PermissionRequest and PostCompaction fire when those events occur?"]
    answered_questions: ["SessionStart and UserPromptSubmit fire under devin -p with the documented schema.", "The earlier packet-wide dormancy inference came from an unsupported wrapper schema."]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- ANCHOR:metadata -->
## METADATA
| Field | Value |
|---|---|
| **Spec Folder** | 004-devin-hook-adapter-layer |
| **Completed** | 2026-07-24 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## WHAT WAS BUILT

Devin hook adapters for the 2 events this phase scopes (`SessionStart`, `UserPromptSubmit`), mirroring the live `cli-codex` precedent: built, typechecked, compiled, directly tested and observed live under `devin -p` after correcting the registration schema.

### `mcp-server/hooks/devin/` (TypeScript, compiled via the existing `mcp-server` build)
- `shared.ts`: reads/validates a bounded Devin hook payload, delegates to the existing `../claude/*.js` implementations, emits Devin's `hookSpecificOutput` envelope (the same shape Codex uses -- Devin's hook contract closely mirrors Claude Code's own).
- `session-start.ts`: `SessionStart` adapter, delegates to `session-prime.js`.
- `user-prompt-submit.ts`: `UserPromptSubmit` adapter, delegates to `user-prompt-submit.js`.
- `README.md`: current live wiring, payload evidence and unobserved-event caveats.

### `runtime/hooks/devin/` (plain `.mjs`, no build step, matching the codex precedent)
- `spec-gate-classify.mjs`: `UserPromptSubmit` hook, calls `classifyIntent()` against the shared `spec-gate-core.mjs`.
- `README.md`: documents current live behavior and why `spec-gate-enforce.mjs` (`PreToolUse`) belongs to phase 008.

### `.devin/hooks.v1.json` (project root)
- Registers both adapters (`SessionStart` -> `session-start.js`, `UserPromptSubmit` -> `user-prompt-submit.js` plus `spec-gate-classify.mjs`). Phase 008 later extended the file, and phase 011 records the corrected nested schema that made the wiring live.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Read the live `cli-codex` precedent in full (`shared.ts`, `session-start.ts`, `user-prompt-submit.ts`, `spec-gate-classify.mjs`, both READMEs) as the structural template.
2. **Superseded experiment**: live-probed an unsupported wrapper-shaped `.devin/hooks.v1.json` and observed zero firings across the instrumented events.
3. The no-error malformed-JSON control was originally misread as proof the file was unread. Corrected-schema tests later showed the invalid structure was silently discarded.
4. Confirmed `.devin/hooks.v1.json` is the correct filename via `devin migrate hooks --help`'s own description ("Migrate Windsurf hooks... to Devin hooks (.devin/hooks.v1.json)"), ruling out a wrong-filename explanation.
5. Tested the one remaining headless mechanism, `--agent-config <file>`: its own strict parser rejected a `hooks` field outright (`unknown field 'hooks', expected one of system_instructions, allowed_tools, permissions, mcp_servers, extensions`), definitively ruling out that path too.
6. True interactive mode could not be tested, but corrected-schema `devin -p` behavior is now directly proven.
7. The operator chose to build the adapters after the negative test. That decision remained sound; only the old status label was wrong.
8. Wrote the adapter code, typechecked it (`tsc --noEmit -p tsconfig.json`, 0 errors across the full project), built it (`npm run build`), and directly invoked the compiled outputs with realistic payloads (see Verification).
9. Phase 011 corrected the phase docs and hook READMEs after live verification exposed the unsupported registration shape.
10. Temporary probe artifacts were removed; the tracked `.devin/hooks.v1.json` remains the live project registration.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **`PreToolUse` (`spec-gate-enforce.mjs`) descoped to phase 008.** The original Files-to-Change table listed it under this phase, contradicting this phase's own explicit "starting with SessionStart/UserPromptSubmit" scope statement. Resolved in favor of the scope statement.
- **Hand-built adapters retained after the contradiction surfaced.** Their translation-only design remains valid and now has live evidence.
- **`.devin/hooks.v1.json` is a live project registration.** Its nested event schema is load-bearing and must be structurally validated, not only JSON-parsed.
- **Direct invocation complements live-fire testing.** It covers malformed and incomplete payload behavior that the happy-path live session did not exercise.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| `SC-001`: hooks fire in a live session | PASS after schema correction - `SessionStart` and `UserPromptSubmit` both observed under `devin -p` |
| `SC-002`: neutral hook cores show zero diff | PASS -- `git diff --stat` empty for `hooks/claude/**`, `runtime/lib/spec-gate/**` |
| `SC-003`: ADR-001 has a recorded status + re-evaluation trigger | PASS -- Accepted (revised); trigger covers both `read_config_from.claude` and the `-p` dormancy finding |
| `tsc --noEmit -p tsconfig.json` (full project) | PASS -- 0 errors |
| `npm run build` produces `dist/hooks/devin/*.js` | PASS -- `session-start.js`, `user-prompt-submit.js`, `shared.js` all compiled |
| Direct invocation: `session-start.js` with a real sessionStart-shaped payload | PASS -- returned a valid envelope carrying the actual Spec Kit Memory startup brief |
| Direct invocation: `user-prompt-submit.js` with a mutation-triggering prompt | PASS -- returned a valid envelope, correctly relaying whatever context the delegated Claude hook produced |
| Direct invocation: `spec-gate-classify.mjs` with a mutation-triggering prompt | PASS -- returned the Gate-3 question, correctly wrapped in Devin's envelope |
| Direct invocation: `spec-gate-classify.mjs` with a non-mutating prompt | PASS -- no output, exit 0 |
| Direct invocation: malformed stdin / missing required field (all 3 adapters) | PASS -- fail-open confirmed, exit 0, no crash |
| Live dispatch: unsupported wrapper schema | Superseded negative - zero probe firings because the structure was invalid |
| Live dispatch: `.devin/config.json`'s `"hooks"` key | **Confirmed dead** -- zero probe firings |
| Live dispatch: malformed or unsupported `hooks.v1.json` | No useful diagnostic; absence of an error is not proof the file is unread |
| Live dispatch: `--agent-config` with a `hooks` field | Rejected by strict parser: `unknown field 'hooks'` |
| Final corrected-schema re-test with real compiled paths | PASS - real adapter context reached the model under `devin -p` |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. **Two lifecycle events remain unobserved.** `PermissionRequest` and `PostCompaction` did not occur in the corrected-schema session.
2. **True interactive mode is untested.** This does not weaken the proven `devin -p` support, but interactive-specific behavior remains unknown.
3. **`read_config_from.claude` fidelity remains unverified.** The hand-built registration is the proven path.
4. **Phase 008 caveats remain per surface.** `run_subagent` and the deny branch still lack end-to-end observations.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`
- `../001-devin-contract-pin/implementation-summary.md` (predecessor's contract, itself corrected this session for a separate permission-mode error)
- `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md`, `.opencode/skills/system-spec-kit/runtime/hooks/devin/README.md` (full live-verification evidence tables)
- `../008-devin-hook-parity/spec.md` (successor; extends lifecycle and guard coverage)
