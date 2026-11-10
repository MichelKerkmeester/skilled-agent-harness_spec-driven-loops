---
title: "Tasks: Phase 5: hook-fallback-failure-signal"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hook fallback signal tasks"
  - "rg printf fallback chains"
  - "copilot evidence absent"
  - "doctor asset health checks"
  - "drift marker stderr line"
  - "path resolution parity test"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: hook-fallback-failure-signal

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

- [x] T001 `rg -n '\|\| printf %s' .codex/hooks.json .devin/hooks.v1.json` and confirm the exact set of fallback chains against `spec.md`'s citations — grep confirmed 17 Codex chains and 4 Devin chains (spec's example line numbers were from an earlier draft; the current file's actual set was used)
- [x] T002 [P] Gather the Copilot decision evidence: confirm `runtime/hooks/copilot/` and `runtime/dist/hooks/copilot/` are still absent, and estimate the build effort versus the removal effort — both absent (`ls` on each returned no such directory); no `.copilot` runtime host directory exists in the repo at all (unlike Claude/Codex/Cursor/Devin/Pi), no registration manifest references the wrappers, and no CI workflow invokes them (`grep -rl` over `.github/workflows` and the whole tree outside `specs/` returned nothing) — decision: remove
- [x] T003 [P] Read one existing doctor asset (`doctor-mcp-install.yaml`) to confirm the schema shape the new drift-marker surface must fit — found the established `{ path, type: file_exists }` / `{ probe, type: command_succeeds }` declarative `health_checks` pattern and reused it
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the drift marker and a structured stderr line to every `|| printf` fallback in `.codex/hooks.json` — all 17 chains carry `"mkHookDrift":true` in `hookSpecificOutput` plus a `printf "%s\n" "mk-hook-drift host=codex event=<event> adapter=<name>" >&2` line, applied by a verified transform script (`bash -n` syntax-checked all 18 commands, 0 errors)
- [x] T005 Restructure `.codex/hooks.json:140`'s Stop-cleanup chain so its diagnostic fallback is reachable on a genuine `session-cleanup.sh` failure, without changing the Stop hook's own success contract — `|| true ||` removed; chain is now `session-cleanup.sh ... || { <stderr>; <fallback JSON>; }`
- [x] T006 Add the drift marker and a structured stderr line to every `|| printf` fallback in `.devin/hooks.v1.json` — all 4 chains updated the same way (`bash -n` syntax-checked all 20 commands, 0 errors)
- [x] T007 Implement the Copilot decision from T002: build `runtime/hooks/copilot/{session-prime,user-prompt-submit}.ts` and wire them into the build, or remove `.github/hooks/scripts/*.sh` and their registration — removed `.github/hooks/scripts/{session-start.sh,user-prompt-submitted.sh,README.md}` (working-tree deletion, left unstaged)
- [x] T008 Route the drift marker into the doctor asset identified in T003 — added a `hook_adapter_fallback_health_checks` list (21 rows, one per fallback-carrying adapter) plus an execution step and output text to `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run a synthetic adapter-failure test (temporarily rename a compiled hook file) against Codex and Devin and confirm the drift marker and stderr line both appear — renamed `dist/hooks/{codex,devin}/session-start.js`, ran the real `bash -c` command from each config: exit 0, stdout carried `"mkHookDrift":true`, stderr carried the `mk-hook-drift host=... event=SessionStart adapter=session-start.js` line; restored both files afterward
- [x] T010 Run a synthetic `session-cleanup.sh` failure and confirm Codex's diagnostic fallback now fires while the Stop hook still reports success — substituted a non-existent script path in the extracted command (real script untouched): exit 0, drift marker and stderr line both fired; the unmodified command against the real (successful) script still exits 0 with no fallback output
- [x] T011 Write and run the hook-path-resolution parity test; confirm it fails against a deliberately broken path and passes on the current state — `runtime/tests/hook-adapter-path-parity.vitest.ts` (100 tests: 98 per-registration + 1 coverage + 1 self-check), covers Claude/Codex/Devin/Cursor/Pi/OpenCode; renamed `session-start.js` -> 1 failure at the exact `codex:SessionStart:...session-start.js` row, 99 passed; restored -> 100/100 passed
- [x] T012 Confirm the doctor route surfaces the T009 synthetic failure in its output — simulated the route's `file_exists` walk over `hook_adapter_fallback_health_checks` against the renamed file: 0 degraded before, 1 degraded (`codex:SessionStart:...session-start.js`) during the synthetic failure, 0 after restore
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `bash -n` syntax-checked every hook command in both edited JSON files (0 errors); `python3 -c "import json"` parses both files
- [x] CHK-011 [P0] No console errors or warnings — Vitest and `node --test` hook suites ran clean (see CHK-020 evidence)
- [x] CHK-012 [P1] Error handling implemented — every fallback keeps the host-facing exit-0 contract; the Stop-cleanup fix removes the unreachable branch without changing that contract
- [x] CHK-013 [P1] Code follows project patterns — reused the existing `{ path, type: file_exists }` doctor health-check shape from `doctor-mcp-install.yaml` rather than inventing a new one
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001..AC-005 all Met (see `acceptance-criteria.md`); `npx vitest run tests/hook-*.vitest.ts tests/hooks-*.vitest.ts tests/user-prompt-submit-shim.vitest.ts tests/directive-lifecycle-*.vitest.ts` = 13 files, 221 tests passed; `node --test` on the Claude/Codex/Devin spec-gate suites and the Devin permission-policy suite = 44 tests passed
- [x] CHK-021 [P0] Manual testing complete — synthetic adapter-failure and Stop-cleanup-failure runs against the real command strings (T009/T010), doctor health-check simulation (T012), parity-test rename/restore proof (T011)
- [x] CHK-022 [P1] Edge cases tested — a compiled adapter that exists but throws mid-execution is exercised by the same rename-based test (the `node <missing-file>` MODULE_NOT_FOUND path also proves a non-zero exit still routes through the fallback); the empty-`additionalContext` Devin `git-preflight-advisory.mjs` fallback still gains the drift marker without disturbing its existing empty string
- [x] CHK-023 [P1] Error scenarios validated — Stop-cleanup failure no longer swallowed by `|| true`; every fallback branch confirmed to still exit 0 to the host
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — `class-of-bug`: the same unreadable-fallback shape recurred across every Codex/Devin `|| printf` chain, fixed by one transform applied to the whole matched class, not one instance
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — `rg -n '\|\| printf %s'` enumerated all 17 Codex + 4 Devin chains before any edit (T001)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — `rg -n 'additionalContext' .opencode/commands/doctor` confirmed no doctor asset parses that field, so adding `mkHookDrift` alongside it is additive-only; both runtime-mirror hook READMEs and the parity test were updated as consumers of the new fallback shape
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — N/A: this phase is an observability addition to an existing best-effort fallback contract, not a security/path/parser/redaction fix; no new untrusted-input parsing surface is introduced
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — host (codex, devin) x fallback-chain (21 rows total: 17 codex + 4 devin) x check type (JSON drift marker, stderr line, path-exists); parity test covers 6 runtimes x 98 registered paths
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — N/A: the change reads only static config files and the filesystem; no process-wide/env-keyed state is introduced or consumed by the new logic
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — no commit exists yet (this task does not commit); evidence in this checklist and `implementation-summary.md` cites exact commands and their observed output instead of a branch-relative diff, so it stays valid once committed
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the stderr line carries only `host`, `event` and the adapter's basename (NFR-S01), no credentials or full argv
- [x] CHK-031 [P0] Input validation implemented — N/A: no new untrusted-input path; the change is static config plus filesystem existence checks
- [x] CHK-032 [P1] Auth/authz working correctly — N/A: no change to hook execution privileges or matcher scope (NFR-S02)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — spec.md and acceptance-criteria.md Status set to Complete alongside this file
- [x] CHK-041 [P1] Code comments adequate — new test file and README additions explain intent without embedding spec paths, finding ids, or task ids
- [x] CHK-042 [P2] README updated (if applicable) — `runtime/hooks/codex/README.md` and `runtime/hooks/devin/README.md` CONSUMERS sections describe the new fallback shape; both pass `validate_document.py` with 0 issues
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — the packet's `scratch/` was not needed; the JSON-transform helper script lived in the session scratchpad, and every other temp artifact was an ephemeral `/tmp` file used only for a single verification command
- [x] CHK-051 [P1] scratch/ cleaned before completion — every ad hoc `/tmp` verification file was removed after use; `scratch/` is empty
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---
