---
title: "Filesystem Durability Closure: F22 F28 F59 F66 F67 F72 F89 F103 F104"
description: "Nine deferred P2 findings in the rerank sidecar launcher closed: directory fsync after atomic rename, crypto-random temp suffixes, state-dir validation, owner-only log permissions, stable spawn stdio, normalized health payloads, consistent skipIfDisabled handling, internal DI seams plus helper extraction."
trigger_phrases:
  - "filesystem durability sidecar"
  - "ensure-rerank-sidecar durability hardening"
  - "F72 directory fsync rename"
  - "F104 crypto random temp suffix"
  - "F89 state dir validation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/003-fix-deferred-p2s-for-filesystem-durability` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes`

### Summary

The rerank sidecar launcher had nine deferred P2 findings covering crash durability, path safety, log security, health payload stability plus testability. File renames could survive process crashes without the containing directory being flushed. Temp file names were predictable. State directories were accepted without validation. Log files were opened world-readable. Spawn stdio was unstable across code paths. Health payloads exposed raw internal fields. The `skipIfDisabled` path was inconsistent across callers. Dependency injection seams were absent, blocking fixture control. The largest orchestrator function exceeded maintainable line limits.

All nine findings (F22, F28, F59, F66, F67, F72, F89, F103, F104) were closed in a single commit. The F15 atomic-write baseline was extended with a `fsyncDirOf` helper that opens the containing directory and fsyncs it after every atomic rename. Temp suffixes were standardized on `crypto.randomBytes(16).toString('hex')`. State-dir inputs are now validated as absolute, traversal-free, under `$HOME` plus writable before any launcher side effects run. Log files are opened with mode `0600`. Spawn uses `stdio: ['ignore', logFd, logFd]` when logging is active. The exported health payload is normalized to `{ status, port, ownerCount, lastReapTs }` while internal owner-token and config-hash checks continue reading raw fields. A resolved dependency bundle enables full test injection without changing the public `ensureRerankSidecar` signature. Helper extraction splits the 83-line orchestrator into focused functions of 40 lines or fewer each.

### Added

- `fsyncDirOf(path)` helper in `ensure-rerank-sidecar.cjs` that opens and fsyncs the containing directory after every atomic rename
- Internal dependency injection bundle for fs, http, os, process, spawn, log, sleep plus crypto without changing the public API shape
- Regression fixtures in `ensure-rerank-sidecar.vitest.ts` covering directory fsync, crypto-random temp suffixes, state-dir rejection, log mode, spawn stdio, health payload shape plus DI injection

### Changed

- Temp file suffix generation changed from fixed or sequential naming to `crypto.randomBytes(16).toString('hex')` (32-character hex)
- Health payload normalized to `{ status, port, ownerCount, lastReapTs }` with stable field names and types. Internal health checks still read raw sidecar fields for owner and config verification.
- Spawn call updated to `stdio: ['ignore', logFd, logFd]` when logging is enabled
- `skipIfDisabled` handling moved before state-dir, owner-token, health plus spawn side effects so all callers follow the same disabled-sidecar skip path
- Largest launcher function refactored into focused internal helpers, each 40 lines or fewer

### Fixed

- Atomic rename could leave containing directory unflushed on crash. Directory fsync after every rename closes the durability gap.
- Predictable temp file suffixes enabled name-collision and race attacks. Crypto-random 16-byte hex suffixes eliminate the predictability.
- State dirs accepted without validation allowed relative paths, traversal segments plus writes outside `$HOME`. Validation now rejects and exits non-zero with a clear stderr message.
- Log files were opened world-readable. Mode `0600` restricts access to the owning user only.
- Inconsistent `skipIfDisabled` behavior across callers could produce partial side effects. Moving the check to the entry point makes the skip unconditional.

### Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` after scaffold | PASS: errors 0, warnings 0 |
| `cd .opencode && node skills/system-spec-kit/scripts/node_modules/vitest/vitest.mjs run bin/lib/ensure-rerank-sidecar.vitest.ts --config vitest.config.bin.ts` | PASS: 1 file, 37 passed, 5 skipped, exit 0 |
| `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` | PASS: 4 files, 43 passed, exit 0 |
| `cd .opencode/skills/system-spec-kit && npm run typecheck --workspace=@spec-kit/mcp-server` | PASS: exit 0 |
| `validate.sh --strict` final | PASS: errors 0, warnings 0, exit 0 |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modified | `fsyncDirOf` helper added. Crypto-random temp suffixes. State-dir validation. Log mode `0600`. Spawn stdio stabilized. Health payload normalized. DI bundle. Helper extraction. |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Modified | Regression fixtures for all nine findings added. |

### Follow-Ups

- The canonical bin Vitest runner path in the spec prompt was absent from this checkout. The equivalent local runner under `.opencode/skills/system-spec-kit/scripts/node_modules` was used and produced the same 37-pass result. Align the runner path reference in future specs with the installed location.
