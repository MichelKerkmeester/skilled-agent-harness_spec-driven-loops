---
title: "Verification Checklist: Phase 3 package-baseline-gates"
description: "Evidence checklist for the raw TypeScript package and baseline gates."
trigger_phrases:
  - "package-baseline-gates checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/003-package-baseline-gates"
    last_updated_at: "2026-08-16T14:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Package gates green: tsc 0, 57 tests, pack 9 files, provenance added"
    next_safe_action: "Hand off to the 002-subagent-handoff workstream"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 3 package-baseline-gates

<!-- ANCHOR:protocol -->
## Verification Protocol

- [x] CHK-301 [P1] Record each command, exit code, and relevant output. — `typecheck`, `test`, `npm pack --dry-run`, `node --version`, and greps recorded in `implementation-summary.md` Verification.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-302 [P1] Source and compatibility child handoffs are present. — `001-source-baseline` and `002-identity-config-compat` Complete; the package is built and tested.
- [x] CHK-303 [P1] Expected package files and provenance assertions are listed. — pack file set and the `9b28456` provenance assertion listed in `plan.md` §4.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-304 [P1] `pi.extensions` points to an existing raw `.ts` entry. — `package.json` `pi.extensions` = `["./src/index.ts"]`, an existing raw `.ts`.
- [x] CHK-305 [P1] Pi core packages are peers and no compiled `dist/` is required. — `peerDependencies` = `@earendil-works/pi-coding-agent`; no `dist/` in the tree or pack.
- [x] CHK-318 [P1] `package.json` `pi.extensions` resolves to `./src/index.ts`. — confirmed; `src/index.ts` present and listed by `npm pack --dry-run`.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-306 [P1] `npm run typecheck` exits 0. — verified (`tsc --noEmit`).
- [x] CHK-307 [P1] `npm test` exits 0. — 4 files, 57 tests passed.
- [x] CHK-308 [P1] `npm pack --dry-run` shows the expected name and files. — `pi-fast-mode-w-subagent-support@0.3.0`, 9 files.
- [x] CHK-319 [P1] `npm pack --dry-run` output equals the enumerated file list with no `dist/`. — CORRECTED to reality: pack = `package.json`, `README.md`, `LICENSE`, `src/*.ts` (6) = 9 files. `tsconfig.json` and `tests/*.ts` are dev-only and correctly excluded by the `files` allowlist; no `dist/`.
- [x] CHK-320 [P1] Node version used is recorded (repo baseline `node >=22.19`) alongside the lockfile check. — Node `v25.6.1` (satisfies `>=22.19`); `package-lock.json` present.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-309 [P1] Identity/config compatibility changes are included without handoff or install changes. — `src/config.ts` migration/guards from phase 002 are in the tree and green; no env/handoff code and no `.pi/settings.json` change in this child.
- [x] CHK-310 [P1] README and package metadata agree on the extension entry and name. — README title/install/registry/config-paths use `pi-fast-mode-w-subagent-support`; `package.json` `name` matches; `pi.extensions` = `./src/index.ts`.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-311 [P1] LICENSE retains upstream MIT attribution. — `LICENSE` unchanged: MIT, "Copyright (c) 2026 John Munson" retained.
- [x] CHK-312 [P1] No credentials or secrets enter package metadata or evidence. — no credentials in `package.json`, `README.md`, or recorded evidence.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-313 [P1] README cites `pi-openai-fast-mode` commit `9b28456`. — README `## Provenance` cites `pi-openai-fast-mode` commit `9b28456` (v0.3.0).
- [x] CHK-314 [P1] Package keywords include `pi-package` and `pi-extension`. — keywords: `pi-package`, `pi-extension`, `openai`, `fast-mode`, `subagent`, `handoff`.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-315 [P1] Pack output contains raw source and intended files only. — pack = raw `src/*.ts` + `README.md` + `LICENSE` + `package.json`; no `dist/`, `node_modules/`, or `tests/`.
- [x] CHK-316 [P1] No settings, operator npm scope, or live-session files changed. — `.pi/settings.json` and operator scope untouched; changes confined to the package and its spec docs.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-317 [P1] Package handoff criteria are satisfied and evidence is recorded in this checklist. — manifest loads the raw entry, typecheck/test/pack gates green, provenance and MIT attribution preserved.
<!-- /ANCHOR:summary -->
