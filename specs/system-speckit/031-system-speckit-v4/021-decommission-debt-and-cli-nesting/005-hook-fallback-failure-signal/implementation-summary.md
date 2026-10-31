---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "hook fallback failure signal"
  - "mkHookDrift drift marker"
  - "codex devin hook fallback chains"
  - "stop cleanup || true removed"
  - "copilot wrapper scripts deleted"
  - "doctor route degraded adapters"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/021-decommission-debt-and-cli-nesting/005-hook-fallback-failure-signal"
    last_updated_at: "2026-09-05T09:20:00Z"
    last_updated_by: "implementer"
    recent_action: "Added hook drift markers, fixed Stop-cleanup reachability, removed Copilot wrappers"
    next_safe_action: "None - phase complete; proceed to 006-orphaned-types-and-dead-modules"
    blockers: []
    key_files:
      - ".codex/hooks.json"
      - ".devin/hooks.v1.json"
      - ".opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml"
      - ".opencode/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts"
    session_dedup:
      fingerprint: "sha256:189b9e9f194558ba2c5182f505d5c0fcf6683ebfb90f3dccf592edf1b4a5d550"
      session_id: "2026-09-05-054-005-hook-fallback-failure-signal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Build the Copilot adapters or remove the wrappers? Removed - no runtime host directory, no compiled or source adapter, no CI or registration reference found anywhere in the repository."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-hook-fallback-failure-signal |
| **Completed** | 2026-09-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Codex or Devin adapter crash used to look identical to success: the `|| printf` fallback returned a well-formed JSON response with no field a script could key on, and Codex's Stop-cleanup chain had a second bug (`|| true || printf`) that made its own diagnostic branch permanently unreachable. Both hook configs now carry a machine-detectable drift marker and a structured stderr line on every fallback, the Stop-cleanup branch is reachable again, the two long-dead Copilot wrapper scripts are gone, a doctor route reports degraded adapters, and a new test proves every registered hook path resolves on disk.

### Hook Fallback Failure Signal

- Every `|| printf` fallback in `.codex/hooks.json` (17 chains) and `.devin/hooks.v1.json` (4 chains) now reads `<primary command> || { printf "%s\n" "mk-hook-drift host=<host> event=<event> adapter=<name>" >&2; printf %s "<fallback JSON with mkHookDrift:true>"; }`. The host-facing exit status stays 0 in every branch.
- Codex's Stop-cleanup chain dropped the unconditional `|| true`, so a real `session-cleanup.sh` failure now reaches the diagnostic fallback instead of being swallowed before it can run.
- The Copilot decision: **removed**. No `.copilot` runtime host directory exists anywhere in this repo (unlike Claude/Codex/Cursor/Devin/Pi), no compiled or source adapter was ever built, no CI workflow or registration manifest references the wrappers, and no live Copilot CLI integration point could be found. Building adapters for an integration surface with no discoverable wiring was not worth the effort the removal comparison in `plan.md`'s Risks table called for.
- `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml` gained a `hook_adapter_fallback_health_checks` list (21 rows, one per fallback-carrying adapter) plus an execution step and output text, reusing the existing `{ path, type: file_exists }` health-check shape already established in `doctor-mcp-install.yaml`.
- A new parity test enumerates every registered hook path across Claude, Codex, Devin, Cursor, Pi and OpenCode (98 paths) and asserts each resolves on disk.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.codex/hooks.json` | Modified | Drift marker + stderr on all 17 fallback chains; Stop-cleanup unreachable-branch fix |
| `.devin/hooks.v1.json` | Modified | Drift marker + stderr on all 4 fallback chains |
| `.github/hooks/scripts/session-start.sh`, `user-prompt-submitted.sh`, `README.md` | Deleted | Copilot decision: remove (no build target ever existed) |
| `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Modified | New `hook_adapter_fallback_health_checks` list, execution step, output text |
| `.opencode/skills/system-spec-kit/runtime/hooks/codex/README.md`, `runtime/hooks/devin/README.md` | Modified | Document the new fallback shape in the CONSUMERS section |
| `.opencode/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts` | Created | Cross-runtime hook-path resolution parity test (REQ-005) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A transform script parsed both JSON hook files, added the drift marker to each fallback's embedded JSON payload and a matching stderr line, then re-serialized with `json.dumps(..., indent=2)` (verified byte-identical round-trip formatting before use). Every resulting command was `bash -n` syntax-checked, then two representative chains (a plain adapter fallback and the Stop-cleanup restructuring) were executed for real against the live repository with the target file temporarily renamed, proving the actual runtime behavior rather than just the JSON shape. `.opencode/bin/install-codex-hooks.mjs` (unmodified) reconciled the user-global `~/.codex/hooks.json` against the edited source and `--check` confirmed the sync.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Remove the Copilot wrappers rather than build adapters | No `.copilot` runtime host directory exists anywhere in this repo (unlike Claude/Codex/Cursor/Devin/Pi); no compiled handler, source adapter, CI reference, or registration manifest was found for GitHub Copilot CLI. Building a new adapter tree for an integration point with no discoverable wiring path was not worth the effort; removal deletes dead code with zero live consumers |
| Extend `doctor-runtime-mirrors.yaml` instead of adding a new doctor route | `plan.md`'s Dependencies table pointed at the existing `install-codex-hooks.mjs --check` invocation already wired into this route at `_routes.yaml:182`; reusing the route (and its existing `{ path, type: file_exists }` health-check vocabulary from `doctor-mcp-install.yaml`) avoids a second, parallel diagnostic surface |
| Health checks are declarative path-existence rows, not a live re-invocation of every hook command | `doctor-runtime-mirrors.yaml` is a read-only diagnostic (`mutation_boundaries.read_only: true`); several registered commands mutate state (`session-cleanup.sh`, `git-live-follow.sh --start`), so actually executing them from a diagnostic route would violate that contract. A `file_exists` check reproduces exactly the failure mode a synthetic rename produces without side effects |
| Parity test verifies the checker logic with a synthetic self-check rather than mutating real repository files inside the automated suite | Renaming a real adapter file inside a Vitest run would be racy against the rest of the same test run and leave residue on a crash; the manual rename/restore proof (documented in `tasks.md` T011) supplies the "fails on broken / passes on correct" evidence instead |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 -c "import json; json.load(...)"` on `.codex/hooks.json` and `.devin/hooks.v1.json` | Both parse; PASS |
| `bash -n` on every hook command in both files | 18 codex + 20 devin commands, 0 syntax errors; PASS |
| Synthetic adapter-failure run (Codex + Devin `session-start.js` renamed, real `bash -c` command executed) | exit 0, `mkHookDrift:true` in stdout JSON, `mk-hook-drift ...` line on stderr for both hosts; PASS |
| Synthetic Stop-cleanup failure run (deliberately-missing script path, real script untouched) | exit 0, drift marker + stderr fired (previously unreachable under `\|\| true`); PASS |
| `node .opencode/bin/install-codex-hooks.mjs --allow-worktree` then `--check --allow-worktree` | Both exit 0; user-global `~/.codex/hooks.json` reconciled to the new source, third-party entries (nodeterm, orca, jcode) preserved |
| `node .../hooks/claude/spec-gate-claude.test.mjs`, `.../codex/spec-gate-codex.test.mjs`, `.../devin/spec-gate-devin.test.mjs`, `.../devin/permission-request-policy.test.mjs` | 13 + 14 + 15 + 2 = 44 tests, 0 failures |
| `npx vitest run tests/hook-*.vitest.ts tests/hooks-*.vitest.ts tests/user-prompt-submit-shim.vitest.ts tests/directive-lifecycle-*.vitest.ts` | 13 files, 221 tests, 0 failures (includes the new `hook-adapter-path-parity.vitest.ts`, 100 tests) |
| Parity-test rename/restore proof (`session-start.js`) | 1 failure at the exact broken row / 99 pass while renamed; 100/100 pass restored |
| Doctor health-check simulation (`hook_adapter_fallback_health_checks` walk) | 0 degraded clean, 1 degraded (`codex:SessionStart:...session-start.js`) during the synthetic failure, 0 after restore |
| `sync-runtime-mirrors.cjs --check`, `sync-agents.cjs --check` (codex + pi), `sync-prompts.cjs --check` (codex), `agent-roster-mirror-check.cjs`, `command-catalog-mirror-check.cjs` | All exit 0 (no collateral regression from the Copilot removal or hooks.json edits) |
| `python3 .../validate_document.py` on both edited runtime-mirror READMEs | 0 issues each |
| `NODE_PRESERVE_SYMLINKS=1 bash .../validate.sh <phase folder> --strict` | RESULT: PASSED (see Known Limitations for the one unrelated pre-existing item this run does not touch) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The doctor health check is path-existence, not a live re-invocation.** It reproduces the "file missing/renamed" failure mode (SC-001's own chosen example) but not every possible mid-execution throw from a file that still exists; the parity test and the drift marker's own live behavior (proven in Verification above) cover that edge case instead.
2. **Pre-existing, unrelated drift found incidentally.** Running the doctor-runtime-mirrors checkers as a regression check surfaced `[pi-prompt-sync] MISSING .pi/prompts/create-chart.md` — this predates this phase, is unrelated to hook fallbacks or Copilot, and touches files outside this phase's scope; left unfixed and unreported elsewhere in this packet.
3. **A separate, unbuilt Copilot integration surface exists in test form.** `runtime/tests/copilot-user-prompt-submit-hook.vitest.ts` guards a different, never-implemented "managed custom-instructions block" adapter (`hooks/copilot/{user-prompt-submit,custom-instructions}.ts`), distinct from the `session-prime.js`/`user-prompt-submit.js` wrappers this phase removed. It is currently `describe.skip`'d (its guard condition is false) and out of this phase's scope; left untouched.
<!-- /ANCHOR:limitations -->

---


