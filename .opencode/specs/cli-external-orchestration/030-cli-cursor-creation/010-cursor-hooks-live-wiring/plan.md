---
title: "Implementation Plan: cli-cursor committed .cursor/hooks.json registration"
description: "Plan for creating the committed, project-level .cursor/hooks.json ADR-001 originally specified, live-fire testing it against the real repo, and correcting stale registration-status doc claims."
trigger_phrases: ["cli-cursor hooks.json registration plan"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/010-cursor-hooks-live-wiring"
    last_updated_at: "2026-07-24T16:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 3 phases complete"
    next_safe_action: "None - phase complete"
    blockers: []
    key_files: ["spec.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-hooks-live-wiring", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: cli-cursor committed .cursor/hooks.json registration

<!-- ANCHOR:summary -->
## 1. SUMMARY
Create the committed, project-level `.cursor/hooks.json` that ADR-001 (phase 004) always specified but the operator deferred, wiring the 4 confirmed/reviewed hook adapters with portable relative paths, empirically proving it fires against the real repo (not just an isolated `/tmp` workspace), and correcting every doc claim that the file doesn't exist yet.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [x] `.cursor/hooks.json` exists, is valid JSON, and is trackable (not gitignored).
- [x] Live-fire proof of `sessionStart`/`preToolUse`/`sessionEnd` firing against the real repo, from both repo root and a nested subdirectory.
- [x] `spec-gate-prebind.mjs` deliberately excluded, with the reason and consequence documented.
- [x] Merge-not-shadow behavior with the pre-existing user-level `~/.cursor/hooks.json` confirmed before proceeding.
- [x] All stale "not yet registered" doc claims corrected.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
A single new config file at the repo root (`.cursor/hooks.json`), following the schema already documented in `references/hook-contract.md` §2: `{"version":1,"hooks":{"<event>":[{"command":"...","type":"command","timeout":10}]}}`. Four events map to four already-existing adapter files: `sessionStart`/`sessionEnd` point at the **compiled** `dist/hooks/cursor/*.js` output (the `.ts` sources aren't directly runnable), `preToolUse`/`beforeSubmitPrompt` point directly at the `.mjs` adapters (plain ESM, no compile step). Commands use relative paths from the project root, confirmed by empirical test to resolve correctly regardless of the invoking shell's cwd — Cursor pins hook-command execution cwd to the discovered project root. No runtime code changes; this is registration-only.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `.cursor/hooks.json` (new) | Did not exist | Create, committed | `python3 -m json.tool`, live-fire dispatch |
| `references/hook-contract.md` | Documents the hook contract | Correct stale "does not yet ship" claim | Grep sweep |
| `manual-testing-playbook.md` (`CU-013` summary) | Root playbook | Correct stale "deliberately-uncommitted" claim | Grep sweep |
| `hooks/confirmed-fires-smoke-test.md` (`CU-013`) | Feature file | Correct the same stale claim | Grep sweep |
| `feature-catalog/feature-catalog.md` | Hub catalog | State registration now exists + deny-path-inert caveat | Grep sweep |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirmed no repo-level `.cursor/` existed at all (not even uncommitted) — `find` returned "No such file or directory".
- [x] Confirmed the live user-level `~/.cursor/hooks.json` registers an unrelated third-party terminal tool's integration, zero entries referencing this repo's own adapters.
- [x] Read `references/hook-contract.md` §3 Discovery Order — confirmed project-level `.cursor/hooks.json` is real, supported, documented.
- [x] Fetched Cursor's own hooks documentation to confirm merge-not-shadow semantics across scopes before proceeding (`WebFetch` against `cursor.com/docs/agent/hooks`).
- [x] Standalone-tested all 4 target adapters with synthetic payloads (`node <file> <<< '{...}'`) to confirm each runs correctly and produces a sane response envelope before wiring them into a real config.

### Phase 2: Core Implementation
- [x] Created `.cursor/hooks.json` with absolute paths first; live-fire tested with a temporary logging-wrapper diagnostic against a real `cursor-agent -p` dispatch from repo root — confirmed `sessionStart`/`preToolUse`/`sessionEnd` all fired with real timestamps, `beforeSubmitPrompt` did not (consistent with phase 004's dormancy finding).
- [x] Reconsidered absolute vs. relative paths against ADR-001's explicit "committed to the repo" decision; rebuilt with relative paths and re-ran the same live-fire diagnostic from repo root AND a nested subdirectory — confirmed identical firing behavior (hook execution cwd is pinned to the discovered project root).
- [x] Reverted to the clean, undecorated command strings; deleted the diagnostic log and all `/tmp` test artifacts.
- [x] Corrected the 4 stale doc references identified by a targeted grep sweep.

### Phase 3: Verification
- [x] Re-confirmed `.cursor/hooks.json` is valid JSON and untracked-but-trackable (`git check-ignore` returns nothing after removing the earlier, since-reverted gitignore entry).
- [x] Full-repo `git diff --stat` swept for any unintended collateral changes — found and resolved a working-tree divergence from HEAD in 4 unrelated files caused by a concurrent session's own archive-move activity in the same shared working directory; restored those specific files from HEAD before re-applying this phase's edits, and left all other concurrent-session-owned paths untouched.
- [x] Grep sweep for stale phrasing (`deliberately uncommitted`, `does not yet ship a hook adapter layer`, `committed-but-unregistered`) — 0 hits after corrections.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Empirical live-fire testing against the real repo, not unit tests (this phase touches no application code). A temporary logging-wrapper (`bash -c 'echo <event>-fired-$(date +%s) >> /tmp/...; node <original-command>'`) was substituted for each hook's `command` field, a real `cursor-agent -p` dispatch was run, the resulting log file was inspected for unambiguous per-event proof, and the wrapper was then reverted to the clean command before commit. This is strictly more rigorous than trusting the model's own textual report of what context it received, since an agent asked "what was injected at session start" is not a reliable oracle for whether a hook fired (confirmed directly: the model reported no awareness of the injected `agent_message`, even though the fire-log proved `sessionStart` executed).
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Phase 004 (hook adapter layer) | Internal | Green (committed `433cfc17c8`-adjacent history; ADR-001 origin) | Source of the 4 adapters and the original committed-registration decision this phase executes |
| `mcp-server` dist build | Internal | Green — confirmed fresh (built after the `.ts` sources, standalone-tested) | `sessionStart`/`sessionEnd` adapters require the compiled `.js` output |
| Cursor's hooks merge-precedence behavior | External | Green — confirmed via official docs before proceeding | Determines whether registering a project-level file is safe alongside the pre-existing user-level one |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Delete `.cursor/hooks.json` (or `git rm` it once committed). Every wired adapter is fail-open by design, so even mid-flight removal cannot leave a session blocked. The doc corrections are reversible via `git checkout` of the specific paths if ever needed, though they simply restate accurate facts and have no behavioral dependency.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
Extends the completed `030-cli-cursor-creation` packet (phase 004 specifically, executing ADR-001's deferred decision); independent of phases 008/009.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|---|---|---|
| Setup (investigation + external confirmation) | Medium | 30-45 min |
| Core implementation (build + live-fire test twice + doc fixes) | Medium | 1 hour |
| Verification | Low | 20 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
One new config file (fail-open by design) + 4 small doc corrections. Low blast radius given the fail-open guarantee; the only genuine cross-surface effect is that Cursor-editor users of this repo now also receive the same session-context-priming and (currently inert) spec-gate hooks — an intentional, ADR-001-approved outcome, not an accidental one.
<!-- /ANCHOR:enhanced-rollback -->

---

## RELATED DOCUMENTS
- `spec.md`, `tasks.md`, `checklist.md`
- `../004-cursor-hook-adapter-layer/decision-record.md` (ADR-001)
