---
title: "CLI Front-Door Safety Remediation"
description: "Six CLI front-door safety findings resolved across the three daemon-backed CLIs and the code-graph bridge: five fixed (socket perimeter, exit-code parity, camelCase maintenance fold, inline trusted boolean) and one refuted-then-hardened with a prompt-time mutation block."
trigger_phrases:
  - "005/005/004 cli front-door safety changelog"
  - "cli socket perimeter exit code parity"
  - "prompt-time mutation block hardening"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-16

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation/004-cli-frontdoor-safety` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/005-fresh-regression-remediation`

### Summary

This sub-phase resolved all six CLI front-door findings across the three daemon-backed CLIs and the code-graph plugin bridge. Five were fixed and one was refuted by Round-2 then hardened anyway per operator directive. Each cited file and line was re-opened and confirmed before editing, and fixes mirror the cited server or sibling patterns.

### Added

- Client-side `assertSocketPerimeter()` checks in `spec-memory-cli.ts` and `code-index-cli.ts`, mirroring the server bind fence.
- New vitest files: `spec-memory-cli-socket-perimeter` (4), `code-index-cli-socket-perimeter` (4), `mk-code-graph-bridge-maintenance-block` (10) and `skill-advisor-cli-trusted-prompt-time` (12), plus a shell exit-code assertion that spawns the real dist process.

### Changed

- `spec-memory-cli.ts` gained an `isErrorPayload()` helper and now exits 1 on a daemon `status:error` payload inside a non-error envelope, matching its sibling CLIs.
- `skill-advisor-cli.ts` now parses `--trusted=false` and `--trusted=0` correctly so a serialized false no longer grants mutation authority.
- `mk-code-graph-bridge.mjs` normalizes the tool name before the maintenance-tools check so camelCase aliases cannot bypass the prompt-time no-maintenance block.

### Fixed

- Socket perimeter: the CLIs reject a symlinked socket dir, require current-uid ownership, reject group or world-writable dirs and reject a symlinked or foreign-owned socket node.
- Exit-code correctness on an error payload returned inside a clean envelope.
- camelCase maintenance-alias bypass at prompt time.
- A serialized `--trusted=false` wrongly granting mutation authority.

### Verification

| Check | Result |
|-------|--------|
| spec-memory CLI suite | 13 (3 files) to 23 (6 files) |
| code-index CLI suite | 19 (4 files) to 37 (8 files) |
| skill-advisor CLI suite | 13 (4 files) to 35 (8 files) |
| Shell exit-code assertion (real dist process) | PASS (status:error to exit 1, status:ok to exit 0) |
| Typecheck / comment hygiene / alignment drift | PASS on all three packages and four sources |
| Subprocess-shim suites after dist rebuild | Green for all three packages |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/spec-memory-cli.ts` | Modified | Socket perimeter check plus error-payload exit code |
| `.opencode/bin/code-index-cli.ts` | Modified | Socket perimeter check |
| `.opencode/bin/skill-advisor-cli.ts` | Modified | Inline `--trusted` boolean plus prompt-time mutation block |
| `mk-code-graph-bridge.mjs` | Modified | Normalize tool name before the maintenance block |

### Follow-Ups

- The foreign-uid socket-owner branch is not exercised by an automated test (forcing a different file owner is not portable in CI); the symlink, perms and happy-path branches are covered and the owner check mirrors the tested server fence.
- T002 was refuted by Round-2 (the trusted-mutation gate already exists); the added prompt-time block is defense-in-depth and changes no previously-passing behavior.
