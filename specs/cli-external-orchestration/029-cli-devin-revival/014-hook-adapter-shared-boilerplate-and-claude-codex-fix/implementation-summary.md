---
title: "Implementation Summary: Hook adapter shared boilerplate and Claude/Codex fix"
description: "Extracted the byte-identical readStdin/JSON-parse-fail-open boilerplate into a shared ESM/CJS helper pair, migrated nine adapters across four runtimes, and applied the firstNonBlankString alias-chain fix to Claude's and Codex's spec-gate-enforce.mjs."
trigger_phrases:
  - "hook adapter shared boilerplate summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/014-hook-adapter-shared-boilerplate-and-claude-codex-fix"
    last_updated_at: "2026-07-27T10:45:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented (GPT-5.6-LUNA xhigh); verified and finished."
    next_safe_action: "None; phase complete."
    blockers: []
    key_files: ["hook-adapter-shared.mjs", "hook-adapter-shared.cjs", "spec-gate-claude.test.mjs", "spec-gate-codex.test.mjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-adapter-shared-boilerplate-and-claude-codex-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Claude and Codex had no existing spec-gate test files; new ones were created mirroring the Devin/Cursor precedent."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-hook-adapter-shared-boilerplate-and-claude-codex-fix |
| **Completed** | 2026-07-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two shared helper files, `hook-adapter-shared.mjs` (ESM) and `hook-adapter-shared.cjs` (CommonJS), each exporting `readStdin()` and `parseJsonFailOpen(raw)`. Nine adapters across four runtimes migrated to import them instead of repeating the boilerplate inline: `spec-gate-enforce.mjs` for Claude, Codex, Devin, and Cursor; `task-dispatch-guard.cjs` for Claude and Devin; `mcp-route-guard.cjs` for Claude, Codex, and Devin.

Separately, Claude's and Codex's `spec-gate-enforce.mjs` gained the `firstNonBlankString()` alias-chain fix already shipped for Devin and Cursor in an earlier phase, closing the masking bug (a `||` chain picks the first truthy VALUE, not the first valid string) in the two runtimes that had never received it. Codex's `apply_patch` heredoc path-parsing (`pathsFromPatch()`) was diff-verified untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `system-spec-kit/runtime/lib/hook-adapter-shared.mjs` | Created | Shared `readStdin()`/`parseJsonFailOpen()` for ESM adapters. |
| `system-spec-kit/runtime/lib/hook-adapter-shared.cjs` | Created | CommonJS twin for `.cjs` adapters. |
| `system-spec-kit/runtime/hooks/claude/spec-gate-enforce.mjs` | Modified | `firstNonBlankString()` alias fix; migrated to shared boilerplate. |
| `system-spec-kit/runtime/hooks/codex/spec-gate-enforce.mjs` | Modified | `firstNonBlankString()` alias fix (`apply_patch` parsing untouched); migrated to shared boilerplate. |
| `system-spec-kit/runtime/hooks/devin/spec-gate-enforce.mjs` | Modified | Migrated to shared boilerplate (fix already present). |
| `system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs` | Modified | Migrated to shared boilerplate (fix already present). |
| `system-spec-kit/runtime/hooks/claude/spec-gate-claude.test.mjs` | Created | New process-level test suite (13/13) -- Claude had none before this phase. |
| `system-spec-kit/runtime/hooks/codex/spec-gate-codex.test.mjs` | Created | New process-level test suite (14/14) -- Codex had none before this phase. |
| `system-deep-loop/runtime/hooks/claude/task-dispatch-guard.cjs` | Modified | Migrated to shared boilerplate. |
| `system-deep-loop/runtime/hooks/devin/task-dispatch-guard.cjs` | Modified | Migrated to shared boilerplate. |
| `mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs` | Modified | Migrated to shared boilerplate. |
| `mcp-code-mode/runtime/hooks/codex/mcp-route-guard.cjs` | Modified | Migrated to shared boilerplate. |
| `mcp-code-mode/runtime/hooks/devin/mcp-route-guard.cjs` | Modified | Migrated to shared boilerplate. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Dispatched to a GPT-5.6-LUNA (xhigh reasoning, fast tier) agent via `codex exec` with a spec-folder-scoped prompt. The agent's first run correctly stopped and asked a clarifying question rather than guessing: the prompt assumed Claude and Codex already had spec-gate test files to add a regression row to, but neither exists in this repo (only Devin's and Cursor's do). Re-dispatched with the clarification folded in (create new test files mirroring the Devin/Cursor shape); the agent completed the code changes but was cut off by a 10-minute dispatch timeout before finishing the documentation pass. All code was verified independently afterward (syntax, diff review, full test-suite reruns, comment hygiene, live smoke invocation of every CommonJS adapter to confirm the relative `require` paths resolve) and the two new shared-helper files' headers were corrected from a double-line box style to the repo's established thin-line `MODULE:` convention before this documentation pass.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Create new `spec-gate-claude.test.mjs`/`spec-gate-codex.test.mjs` rather than skip the regression row | Claude and Codex never had process-level spec-gate tests; skipping would leave the newly-fixed masking bug unverified in exactly the two runtimes that needed the fix most. |
| Migrate only the Q6-sampled families (spec-gate-enforce, task-dispatch-guard, mcp-route-guard) | Matches the phase's scoped boundary; other adapter families were not shown to share the same boilerplate pattern in the original research sample. |
| Leave Cursor's `task-dispatch-guard.mjs`/`mcp-route-guard.mjs` unmigrated | Different module system and structure (Cursor's dispatch guard delegates to Claude's `.cjs` via `spawnSync` rather than implementing its own stdin-read loop); out of this phase's stated scope. |
| Diff-isolate the Codex `apply_patch` branch before accepting the fix | `pathsFromPatch()` has no equivalent in the other three runtimes and is the one place a careless refactor could silently break Codex-specific behavior. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Syntax (`node --check`) | PASS: all 13 created/modified JavaScript files |
| Codex `apply_patch` isolation | PASS: `git diff` on `codex/spec-gate-enforce.mjs` shows `pathsFromPatch()` with zero line changes |
| Shared-core diff | PASS: `spec-gate-core.mjs`, `dispatch-guard.cjs`, `mcp-route-guard.mjs` (shared libs) all show no diff |
| Inline-boilerplate grep | PASS: `for await (const chunk of process.stdin)` returns no matches in any of the 9 migrated adapters |
| `firstNonBlankString()` grep | PASS: present in all 4 `spec-gate-enforce.mjs` files |
| spec-gate-core suite | PASS: 67/67 (`--experimental-test-module-mocks`) |
| Devin spec-gate suite | PASS: 15/15 (unchanged) |
| Cursor prebind suite | PASS: 16/16 (unchanged) |
| New Claude spec-gate suite | PASS: 13/13, including the masking-regression row |
| New Codex spec-gate suite | PASS: 14/14, including the masking-regression row and an apply_patch-specific row |
| Phase 013 regression check | PASS: `permission-request-policy.test.mjs` 2/2 unaffected |
| CommonJS require-path smoke test | PASS: `echo '{}' \| node <file>` exits 0 for all 5 migrated `.cjs` adapters, confirming the relative `require('../../../../system-spec-kit/runtime/lib/hook-adapter-shared.cjs')` path resolves correctly |
| Comment hygiene | PASS: 0 violations across all 13 files |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Cursor's `task-dispatch-guard.mjs` and `mcp-route-guard.mjs` were not migrated to the shared helper -- they were out of scope for this phase (different structure; Cursor's dispatch guard delegates to Claude's file rather than implementing its own read loop).
2. The two new shared-helper files initially used a double-line box comment header inconsistent with the repo's established thin-line `MODULE:` convention (an artifact of the dispatched agent not having that convention in its immediate context); corrected before this documentation pass.
<!-- /ANCHOR:limitations -->
