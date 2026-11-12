---
title: "Feature Specification: Pi loads hook adapters on every version"
description: "Pi loads this repository's hook adapters on every version through one-line entry files and file-relative imports. Before, Pi 1.5.2 failed to load 16 adapters and no guarded Pi session could start."
trigger_phrases:
  - "file relative adapter imports"
  - "pi adapters import relative to their own folder"
  - "pi one-line entry files"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Pi loads hook adapters on every version

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Pi found this repository's hook adapters through 22 relative symlinks in `.pi/extensions/`. The adapters wrote their imports relative to `.pi/extensions/`, for example `../../.skilled/hooks/shared/hook-flags.mjs`. Pi 1.5.1 changed its loader from `jiti.import(extensionPath)` to `jiti.import(canonicalizePath(extensionPath))`, so it resolves a linked entry's imports from the real file. After the installed Pi moved from 1.5.0 to 1.5.2 on 2026-11-12, no Pi session in the repository could start with its guards, among them the dotenv guard, the overlay guard and the spec gate. Later that day the installed Pi went back to 1.5.0, so the fix had to load on both versions.

### Purpose
Every hook adapter loads on Pi 1.5.0 and on Pi 1.5.2, with the same files.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ pi -p "Reply with the single word READY." --mode text --offline   (Pi 1.5.2, before the change)
16 lines of: Failed to load extension ... Cannot find module '../../.skilled/hooks/shared/hook-flags.mjs'
exit 1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite every `../../.skilled/...` import in the adapters to a path relative to the adapter's own folder.
- Replace each of the 22 `*.ts` symlinks in `.pi/extensions/` with a one-line file that re-exports the adapter's default export.
- Make `sync-hook-registrations.cjs` require a one-line re-export entry and reject a symlink entry.
- Make the doctor's `git-setup-check.cjs` follow a re-export entry to the adapter file.
- Update the tests, READMEs, vitest alias comments and changelog that described symlink entries.

### Out of Scope
- `.pi/extensions/lib/claude-hook-adapter.ts` - it stays a symlink.
- `sync-runtime-mirrors.cjs` - it does not manage `.pi/extensions/`.
- The installed Pi - pinning it hides the defect until the next update.
- The vitest alias behaviour - it still serves the long fallback specifiers.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/*.ts` (22 entries) | Modify | Symlink becomes a one-line re-export file |
| 20 adapter `.ts` files under `.skilled/hooks/<name>/pi/`, `.skilled/skills/system-spec-kit/runtime/hooks/pi/`, `.skilled/skills/sk-git/scripts/hooks/pi/` and `.skilled/skills/system-skill-advisor/hooks/pi/` | Modify | Imports relative to the adapter's own folder |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modify | `as string` on four fallback imports and two comments on the real-folder base |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modify | Hand fix of the `executorSkill` import from `dispatch-audit.mjs` |
| `tsconfig.pi.json` | Modify | Real adapter paths, no `preserveSymlinks` |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs` | Modify | `verifyPiExtensions` requires a one-line re-export whose adapter exists |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modify | Follows a re-export entry to the adapter file |
| Tests: `hook-registration-sync.vitest.ts`, `hook-adapter-path-parity.vitest.ts`, `history-locator-adapters.vitest.ts`, `git-setup-check.test.cjs`, `overlay-guard.test.cjs`, `env-secret-guard.test.cjs` | Modify | Build or read entry files, or import the adapter file itself |
| READMEs under `.skilled/hooks/`, `.skilled/skills/sk-git/scripts/hooks/pi/`, `.skilled/skills/system-skill-advisor/hooks/pi/`, `.skilled/skills/system-spec-kit/runtime/hooks/` and `.pi/extensions/` | Modify | Describe one-line entry files and file-relative imports |
| Three vitest configs | Modify | Alias comments only |
| `.skilled/changelog/skilled/v4.0.2.1.md` | Modify | One fix bullet, the hook suites bullet, the doctor test count |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Pi 1.5.0 and Pi 1.5.2 both load every hook adapter in the repository. | On each version, `pi -p "Reply with the single word READY." --mode text --offline` prints `READY`, exits 0 and prints 0 `Failed to load extension` lines. |
| REQ-002 | The registration check accepts one-line entries and rejects symlink entries. | `sync-hook-registrations.cjs --check` prints `PASS` with 22 Pi extensions resolved, and its test for the symlink line passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The doctor's git setup check judges a re-export entry by its adapter file. | `git-setup-check.cjs --tool pi` prints `STATUS=OK checks=11`. |
| REQ-004 | The adapter test suites and the Pi type check pass. | The hooks vitest run, the `node --test` runs and `tsc -p tsconfig.pi.json` all pass with exit 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The load test prints `READY` and exits 0 on Pi 1.5.0 and on Pi 1.5.2, down from 16 load errors and exit 1.
- **SC-002**: The hooks vitest run still passes 491 tests in 9 files, and `node --test` over the hook test files passes 1638 with 0 failed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Pi imports a regular entry file by its own path | If that changes, the entries stop loading | The load test runs on two Pi versions and both pass. |
| Risk | An entry forwards only the default export | Med: code that imported a named export through the entry breaks | Import named exports from the adapter file itself, as `history-locator-adapters.vitest.ts` now does. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
