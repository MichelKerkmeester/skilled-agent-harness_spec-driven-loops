---
title: "Implementation Summary: Devin hook adapter layer"
description: "SessionStart/UserPromptSubmit adapters built, typechecked, and directly-invocation-verified; .devin/hooks.v1.json committed per operator direction mirroring .codex/hooks.json's tracked precedent, but confirmed dormant: Devin's hook system never fires under devin -p dispatch, ruled out across every registration path tested."
trigger_phrases: ["devin hook adapter summary", "devin hook dormancy finding"]
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/004-devin-hook-adapter-layer"
    last_updated_at: "2026-07-24T17:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Committed .devin/hooks.v1.json per operator direction; re-tested, still dormant"
    next_safe_action: "Phase 008 can begin; same dormant-hooks caveat applies to its 6 remaining adapters"
    blockers: []
    key_files: [".opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md", ".opencode/skills/system-spec-kit/runtime/hooks/devin/README.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 100
    open_questions: ["Does hook firing work in true interactive mode? Untestable from this environment (no TTY)."]
    answered_questions: ["Hooks never fire under devin -p, confirmed across hooks.v1.json, config.json's hooks key, and --agent-config."]
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

Devin hook adapters for the 2 events this phase scopes (`SessionStart`, `UserPromptSubmit`), mirroring the live `cli-codex` precedent exactly -- built, typechecked, compiled, and directly-invocation-tested. **Confirmed dormant**: no registration path makes them fire under `devin -p`, the only dispatch mode any orchestrator (including this repo's own `cli-devin` executor) would ever use.

### `mcp-server/hooks/devin/` (TypeScript, compiled via the existing `mcp-server` build)
- `shared.ts`: reads/validates a bounded Devin hook payload, delegates to the existing `../claude/*.js` implementations, emits Devin's `hookSpecificOutput` envelope (the same shape Codex uses -- Devin's hook contract closely mirrors Claude Code's own).
- `session-start.ts`: `SessionStart` adapter, delegates to `session-prime.js`.
- `user-prompt-submit.ts`: `UserPromptSubmit` adapter, delegates to `user-prompt-submit.js`.
- `README.md`: full dormancy evidence table.

### `runtime/hooks/devin/` (plain `.mjs`, no build step, matching the codex precedent)
- `spec-gate-classify.mjs`: `UserPromptSubmit` hook, calls `classifyIntent()` against the shared `spec-gate-core.mjs`.
- `README.md`: documents the dormancy finding and why `spec-gate-enforce.mjs` (`PreToolUse`) is NOT built here.

### `.devin/hooks.v1.json` (project root)
- Registers both adapters (`SessionStart` → `session-start.js`, `UserPromptSubmit` → `user-prompt-submit.js` + `spec-gate-classify.mjs`), mirroring `.codex/hooks.json`'s real tracked shape. **Committed 2026-07-24 per operator direction**, after the confirmed-dormant finding below -- the file is present so the wiring exists the moment a future `devin` build honors it, not as a claim of current live coverage.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED
1. Read the live `cli-codex` precedent in full (`shared.ts`, `session-start.ts`, `user-prompt-submit.ts`, `spec-gate-classify.mjs`, both READMEs) as the structural template.
2. **Before finalizing the adapter design**, live-probed whether Devin's hooks fire at all under dispatch: created a temporary, uncommitted `.devin/hooks.v1.json` wiring `SessionStart`/`UserPromptSubmit`/`PreToolUse`/`Stop` to a logging probe script, then dispatched real `devin -p` sessions including one with an actual tool call (`ls`).
3. **Result: zero probe firings across every event.** Retested with `.devin/config.json`'s `"hooks"` key instead of the standalone file -- same result. Retested with deliberately malformed JSON in `hooks.v1.json` -- `devin -p` succeeded with zero parse errors, proving the file isn't read at all in this mode, not merely ignored once read.
4. Confirmed `.devin/hooks.v1.json` is the correct filename via `devin migrate hooks --help`'s own description ("Migrate Windsurf hooks... to Devin hooks (.devin/hooks.v1.json)"), ruling out a wrong-filename explanation.
5. Tested the one remaining headless mechanism, `--agent-config <file>`: its own strict parser rejected a `hooks` field outright (`unknown field 'hooks', expected one of system_instructions, allowed_tools, permissions, mcp_servers, extensions`), definitively ruling out that path too.
6. True interactive mode could not be tested (no TTY in this environment); flagged as the one remaining gap.
7. Escalated the finding to the operator before writing any adapter code (Logic-Sync Protocol). Operator chose: build the adapters anyway, explicitly marked dormant, ready for a future `devin` build that adds `-p` hook support.
8. Wrote the adapter code, typechecked it (`tsc --noEmit -p tsconfig.json`, 0 errors across the full project), built it (`npm run build`), and directly invoked the compiled outputs with realistic payloads (see Verification).
9. Updated `decision-record.md` ADR-001, `spec.md`, `tasks.md`, and `checklist.md` to honestly reflect the dormant status rather than leave any doc implying live coverage.
10. Cleaned up all temporary test artifacts (`.devin/hooks.v1.json`, `.devin/config.json`, `/tmp` probe scripts) -- confirmed via `git status` that nothing stray remained, and confirmed the one accidental write during testing was to the project-local `.devin/config.json`, never the user's global `~/.config/devin/config.json`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## KEY DECISIONS
- **`PreToolUse` (`spec-gate-enforce.mjs`) descoped to phase 008.** The original Files-to-Change table listed it under this phase, contradicting this phase's own explicit "starting with SessionStart/UserPromptSubmit" scope statement. Resolved in favor of the scope statement.
- **Adapters built anyway despite confirmed dormancy** (operator's explicit choice). Rationale: the code is ready the moment a future `devin` build adds `-p` hook support -- registration becomes the only remaining step, not a rewrite.
- **`.devin/hooks.v1.json` committed anyway, per operator direction.** Registering a config path proven dead under `-p` dispatch initially seemed to contradict the packet's own "verify live, never assume" discipline -- resolved by keeping the dormancy finding explicit and dated in every doc that references the file, so "committed" never gets misread as "verified live."
- **Direct invocation substitutes for live-fire testing.** Since no dispatch path can trigger these adapters, correctness is verified by piping realistic, malformed, and incomplete payloads directly into the compiled outputs -- proving the adapters behave correctly in isolation, distinct from (and not a substitute for) proving they fire in production.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## VERIFICATION
| Item | Result |
|---|---|
| `SC-001` (revised): hooks fire in a live session | **Confirmed negative** -- zero firings across `SessionStart`/`UserPromptSubmit`/`PreToolUse`/`Stop`, every registration path tested |
| `SC-002`: neutral hook cores show zero diff | PASS -- `git diff --stat` empty for `hooks/claude/**`, `runtime/lib/spec-gate/**` |
| `SC-003`: ADR-001 has a recorded status + re-evaluation trigger | PASS -- Accepted (revised); trigger covers both `read_config_from.claude` and the `-p` dormancy finding |
| `tsc --noEmit -p tsconfig.json` (full project) | PASS -- 0 errors |
| `npm run build` produces `dist/hooks/devin/*.js` | PASS -- `session-start.js`, `user-prompt-submit.js`, `shared.js` all compiled |
| Direct invocation: `session-start.js` with a real sessionStart-shaped payload | PASS -- returned a valid envelope carrying the actual Spec Kit Memory startup brief |
| Direct invocation: `user-prompt-submit.js` with a mutation-triggering prompt | PASS -- returned a valid envelope, correctly relaying whatever context the delegated Claude hook produced |
| Direct invocation: `spec-gate-classify.mjs` with a mutation-triggering prompt | PASS -- returned the Gate-3 question, correctly wrapped in Devin's envelope |
| Direct invocation: `spec-gate-classify.mjs` with a non-mutating prompt | PASS -- no output, exit 0 |
| Direct invocation: malformed stdin / missing required field (all 3 adapters) | PASS -- fail-open confirmed, exit 0, no crash |
| Live dispatch: `.devin/hooks.v1.json` (standalone, with/without `"version": 1`) | **Confirmed dead** -- zero probe firings |
| Live dispatch: `.devin/config.json`'s `"hooks"` key | **Confirmed dead** -- zero probe firings |
| Live dispatch: malformed `hooks.v1.json` JSON | `devin -p` succeeded, zero parse errors -- file isn't read in this mode |
| Live dispatch: `--agent-config` with a `hooks` field | Rejected by strict parser: `unknown field 'hooks'` |
| Final re-test with the actual committed `.devin/hooks.v1.json` in place (real compiled paths, not a temp probe) | `devin -p "list files with ls"` completed normally, no additionalContext injected, no error -- consistent with the confirmed dormancy finding |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS
1. **Zero live hook coverage today.** Every adapter built in this phase is dead code under the only dispatch mode that matters (`devin -p`). This is the central finding of the phase, not a footnote.
2. **True interactive mode is untested.** No TTY was available in this environment. Whether hooks fire there at all remains genuinely unknown -- not assumed either way.
3. **`read_config_from.claude`'s fidelity is now a moot question** until `-p` hook support exists in some form; re-evaluate it alongside the dormancy finding, not separately.
4. **Phase 008's remaining 6 hook adapters inherit this same constraint.** Building them will hit the identical dormancy unless a newer `devin` build changes this, or interactive-mode testing (by the operator) reveals a different picture.
<!-- /ANCHOR:limitations -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`
- `../001-devin-contract-pin/implementation-summary.md` (predecessor's contract, itself corrected this session for a separate permission-mode error)
- `.opencode/skills/system-spec-kit/mcp-server/hooks/devin/README.md`, `.opencode/skills/system-spec-kit/runtime/hooks/devin/README.md` (full live-verification evidence tables)
- `../008-devin-hook-parity/spec.md` (successor; inherits this phase's dormancy constraint)
