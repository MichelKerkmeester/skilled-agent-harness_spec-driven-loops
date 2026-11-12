---
title: "Implementation Summary"
description: "Pi loads this repository's hook adapters on every version through one-line entry files and file-relative imports. Pi 1.5.0 and Pi 1.5.2 both start with every guard loaded."
trigger_phrases:
  - "file relative adapter imports implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/pi-extensions/012-file-relative-adapter-imports"
    last_updated_at: "2026-11-12T09:07:41Z"
    last_updated_by: "template-author"
    recent_action: "Recorded the entry-file design"
    next_safe_action: "None"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-file-relative-adapter-imports"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 012-file-relative-adapter-imports |
| **Completed** | 2026-11-12 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Pi session in this repository now starts with all its guards on Pi 1.5.0 and on Pi 1.5.2. Before the change, Pi 1.5.2 failed to load 16 adapters and `pi -p` exited 1.

### Pi loads hook adapters on every version

Pi 1.5.1 imports a symlinked extension from its real path, and older Pi imports it from the link path. No static import resolves from both. So each `*.ts` entry in `.pi/extensions/` is now a regular one-line file that re-exports its adapter, for example `export { default } from '../../.skilled/hooks/overlay-guard/pi/overlay-guard.ts';`. Pi imports that file by its own path on every version. The adapter loads from its real folder, and its imports are written relative to that folder, so they resolve on every version.

The folder name still says "file-relative-adapter-imports". That half of the fix is unchanged. `scratch/real-folder-imports.patch` keeps the first pass's diff as a record.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.pi/extensions/*.ts` (22 entries) | Modified | Each symlink is now a one-line re-export file. `.pi/extensions/lib/claude-hook-adapter.ts` stays a symlink. |
| 20 adapter `.ts` files under `.skilled/hooks/<name>/pi/`, `.skilled/skills/system-spec-kit/runtime/hooks/pi/`, `.skilled/skills/sk-git/scripts/hooks/pi/`, `.skilled/skills/system-skill-advisor/hooks/pi/` | Modified | Each `../../.skilled/...` import now points from the adapter's own folder. Fallback halves of try/catch pairs were kept, so 2 of the 22 adapters needed no change. |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modified | The `executorSkill` import from `dispatch-audit.mjs` was fixed by hand, because the script had classed it as a fallback. |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modified | `as string` on the four fallback imports so the type check skips them. Two comments now describe the real-folder base. |
| `tsconfig.pi.json` | Modified | The three included adapters are named by their real paths. `preserveSymlinks` is removed. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs` | Modified | `verifyPiExtensions` requires a one-line re-export whose adapter exists. A symlink entry is reported with `a symlink, which Pi before 1.5.1 cannot load; make it a one-line re-export file`. |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts` | Modified | Fixtures build entry files. One new test covers the symlink line. |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-adapter-path-parity.vitest.ts` | Modified | Lists the entry files and reads the re-exported path. |
| `.skilled/skills/system-spec-kit/runtime/tests/history-locator-adapters.vitest.ts` | Modified | Imports `mintHistoryLocator` from `../hooks/pi/session-compact-context.js`, because an entry forwards only the default export. |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modified | A re-export entry is followed to the adapter file, and its handler and `git-rule-checks.mjs` import are judged from that folder. A symlink entry resolves from its real file. An inline entry is judged as before. New refusal line: `re-exports <path>, which does not exist`. |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modified | Three new tests (linked adapter, re-export entry, re-export of a missing file) and two repaired Pi cases. |
| `.skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs` | Modified | Writes a one-line entry file in its fixture. |
| `.skilled/hooks/env-secret-guard/lib/env-secret-guard.test.cjs` | Modified | Imports the adapter file itself. One unused constant removed. |
| READMEs: `.skilled/hooks/` root, `overlay-guard`, `overlay-guard/pi`, `post-edit-quality/pi`, `session-lifecycle/pi`, `mcp-route-guard/pi`, `dispatch`, `.skilled/skills/sk-git/scripts/hooks/pi/`, `.skilled/skills/system-skill-advisor/hooks/pi/`, `.skilled/skills/system-spec-kit/runtime/hooks/`, its `pi/` and `pi/lib/` | Modified | Say "one-line entry file" where they said symlink. |
| `.pi/extensions/README.md` | Modified | Each entry is a one-line re-export, and Pi 1.5.0 and Pi 1.5.2 both load the adapter from its real folder. |
| `.skilled/hooks/vitest.config.ts`, `.skilled/skills/system-spec-kit/vitest.config.ts`, `.skilled/skills/system-spec-kit/runtime/vitest.config.ts` | Modified | Alias comments only. The alias stays because it serves the long literal specifiers. |
| `.skilled/changelog/skilled/v4.0.2.1.md` | Modified | One fix bullet, sentences in the hook suites bullet, the doctor test count. |
| About 50 documents and five comment blocks: READMEs under `.skilled/hooks/` and `.skilled/skills/`, the root `README.md`, `.pi/extensions/README.md`, two playbook scenarios, two feature catalog entries, `hook-registry.json`, three vitest configs and `session-relaunch.ts` | Modified | An alignment round after the fix found sentences that still called an entry a symlink, and a false reason for the long fallback specifiers. Each now says one-line entry file, and the specifiers are described as left from the link-based layout. The dotenv guard's own README was changed by one agent run with the guard switched off, at the operator's choice. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A script computed each new import from the old one and the adapter's real folder, with a dry run first. That first pass loaded on Pi 1.5.2. At 10:26 the installed Pi's version file went back to 1.5.0, not by this session, and the first pass failed there with 16 load errors. One entry was then swapped for a one-line re-export as a probe. Pi 1.5.0 went from 16 failures to 15, that adapter no longer among them, and Pi 1.5.2 loaded all. Then all 22 entries were swapped and the checks, tests and docs updated. DeepSeek v4.1 flash agents wrote the document corrections through `pi`. The orchestrating session checked each step.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make each `.pi/extensions/*.ts` entry a one-line re-export file | Pi imports a regular file by its own path on every version, and the adapter it names loads from its real folder. |
| Make adapter imports relative to the adapter file | The adapter always loads from its real folder, so that is the one base that always holds. |
| Do not pin the installed Pi to 1.5.0 | It hides the defect until the next update. |
| Do not keep symlink entries with file-relative imports | It loads only on Pi 1.5.1 and newer. Tested: 16 failures on Pi 1.5.0. |
| Do not add self-referential `.skilled` directory links so the old imports resolve from the real folder | They make every tree walker loop. |
| Do not turn every static import into a try/catch dynamic pair | It restructures 20 guard files. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `pi -p "Reply with the single word READY." --mode text --offline` | PASS. Before, on Pi 1.5.2: exit 1, 16 `Failed to load extension` lines. After, on Pi 1.5.0: `READY`, exit 0, 0 lines. After, on Pi 1.5.2: `READY`, exit 0, 0 lines. |
| `.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts` | PASS. 9 files, 491 tests, before and after. |
| `node --test` over the 84 hook test files | PASS. 1638 passed, 0 failed. |
| `node --test tests/` in `.skilled/commands/doctor/scripts` | PASS. 1152 passed, 0 failed. `git-setup-check.test.cjs` alone: 80 passed. |
| `git-setup-check.cjs --tool pi` | PASS. `pi (active): registered (.pi/extensions/git-preflight-advisory.ts)` and `STATUS=OK checks=11`. |
| spec-kit `npm test` (runtime vitest) | First run on the entry files: 125 files passed, 1 failed with 3 tests (`history-locator-adapters.vitest.ts`, `mintHistoryLocator is not a function`). After the import change, that file and `history-lookup-adapters-e2e.vitest.ts` pass 21 tests. The whole suite was rerun after the document round: exit 0, 1,649 tests passed in 126 files in the runtime core project and 2,521 in 206 files in the cli project. |
| `vitest run --project cli hook-registration-sync` in `.skilled/skills/system-spec-kit` | PASS. 8 passed. |
| `tests/hook-adapter-path-parity.vitest.ts` | PASS. 149 passed. |
| advisor `prompt-advisor.vitest.ts` | PASS. 13 passed. |
| `tsc -p tsconfig.pi.json` | PASS. Exit 0. |
| `sync-hook-registrations.cjs --check` | PASS. `PASS: 4 registration files match the 35-hook registry; 22 Pi extensions resolve.` |
| `sync-runtime-mirrors.cjs --check` | PASS. `PASS: 256 mirrors across 10 trees are in sync`. It does not manage `.pi/extensions/`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live guard decision.** No guard decision was driven through a live Pi session. The proof is the load test on both versions plus the adapter suites.
2. **Default export only.** An entry forwards only the default export. Import a named export from the adapter file itself.
3. **Dead long specifiers.** The long `../../.skilled/...` specifiers left in a few adapters come from the link-based layout. Some are tried first and some second. None resolves from the adapter's own folder, so none serves a load path under Pi. A literal one resolves in tests through the vitest alias. `DISCOVERY_CORE_PATH` in `goal-context.ts` is held in a constant, which the alias does not reach, so an import of it resolves nowhere. `ADVISOR_HOOK_MODULE` in `prompt-advisor.ts` is also a constant, and one test resolves it against `.pi/extensions/prompt-advisor.ts`.
4. **Projects with their own symlinks.** A project that keeps its own symlinks in `.pi/extensions/` must convert them to one-line entry files. `sync-hook-registrations.cjs` reports each one.
5. **Spec-kit suite.** The whole `npm test` run in `.skilled/skills/system-spec-kit` was repeated on 2026-11-12, after the document round. It exited 0. The runtime core project passed 1,649 tests in 126 files and the cli project passed 2,521 in 206.
<!-- /ANCHOR:limitations -->

---
