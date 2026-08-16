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
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created package gate checklist"
    next_safe_action: "Run and record the package gates"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Verification Checklist: Phase 3 package-baseline-gates

<!-- ANCHOR:protocol -->
## Verification Protocol

- [ ] CHK-301 [P1] Record each command, exit code, and relevant output.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-302 [P1] Source and compatibility child handoffs are present.
- [ ] CHK-303 [P1] Expected package files and provenance assertions are listed.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-304 [P1] `pi.extensions` points to an existing raw `.ts` entry.
- [ ] CHK-305 [P1] Pi core packages are peers and no compiled `dist/` is required.
- [ ] CHK-318 [P1] `package.json` `pi.extensions` resolves to `./src/index.ts`.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-306 [P1] `npm run typecheck` exits 0.
- [ ] CHK-307 [P1] `npm test` exits 0.
- [ ] CHK-308 [P1] `npm pack --dry-run` shows the expected name and files.
- [ ] CHK-319 [P1] `npm pack --dry-run` output equals the enumerated file list (`package.json`, `README.md`, `LICENSE`, `tsconfig.json`, `src/*.ts`, `tests/*.ts`) with no `dist/`.
- [ ] CHK-320 [P1] Node version used is recorded (repo baseline `node >=22.19`) alongside the lockfile check.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-309 [P1] Identity/config compatibility changes are included without handoff or install changes.
- [ ] CHK-310 [P1] README and package metadata agree on the extension entry and name.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-311 [P1] LICENSE retains upstream MIT attribution.
- [ ] CHK-312 [P1] No credentials or secrets enter package metadata or evidence.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-313 [P1] README cites `pi-openai-fast-mode` commit `9b28456`.
- [ ] CHK-314 [P1] Package keywords include `pi-package` and `pi-extension`.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-315 [P1] Pack output contains raw source and intended files only.
- [ ] CHK-316 [P1] No settings, operator npm scope, or live-session files changed.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-317 [P1] Package handoff criteria are satisfied and evidence is recorded in this checklist.
<!-- /ANCHOR:summary -->
