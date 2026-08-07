---
title: "Investigation P1 Fixes for Sidecar Process Ownership Lifecycle"
description: "Closed F79 and F88 by simplifying the terminateChild dual-promise lifecycle to a single Promise and making processLiveness explicit about unknown error codes."
trigger_phrases:
  - "sidecar process ownership lifecycle"
  - "F79 F88 remediation"
  - "terminateChild dual-promise fix"
  - "processLiveness explicit error handling"
  - "sidecar P1 lifecycle findings"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/003-fix-investigation-p1s-for-sidecar-process-ownership-lifecycle` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle`

### Summary

The sidecar lifecycle had two P1 findings from arc 010 deep-research: F79, where `terminateChild` used a convoluted dual-promise pattern with an IIFE, an immediate `await` plus `try/finally` block and a `sleep(0)` event-loop yield hack; and F88, where `processLiveness` silently defaulted unknown `process.kill` error codes to `alive=true` with no operator visibility. Both findings were closed in commit `134efa11e4`. F79 collapses the lifecycle to a single Promise gated on `child.once('exit', ...)` with internal SIGTERM-sent and SIGKILL-sent state, removing the `sleep(0)` hack and the unused `sleep()` helper while preserving the full SIGTERM, grace window, SIGKILL, process-group kill sequence. F88 adds explicit `ESRCH` and `EPERM` case handling, changes the return type to a structured `{ alive, reason, errorCode? }` object and logs unexpected error codes to stderr so operators see them. Together these two fixes make sidecar reuse and termination semantics unambiguous and fully tested.

### Added

- New test in `sidecar-hardening.vitest.ts`: single-promise termination lifecycle with a SIGTERM-ignoring child that verifies SIGKILL escalation and child cleanup (F79 coverage)
- New `processLiveness` test suite in `ensure-rerank-sidecar.vitest.ts` with 4 cases covering successful kill, ESRCH dead process, EPERM other-owner plus unknown error with stderr logging (F88 coverage)
- `processLiveness` exported from `ensure-rerank-sidecar.cjs` for direct test access

### Changed

- `terminateChild` in `sidecar-client.ts` collapsed from dual-promise lifecycle to a single Promise with `.finally()` for state cleanup. The `sleep(0)` event-loop yield and the unused `sleep()` helper removed.
- `processLiveness` in `ensure-rerank-sidecar.cjs` return type changed from `string` to `{ alive: boolean, reason: string, errorCode?: string }`. `findReusableSidecar` updated to check `.alive` boolean. Unknown error codes are now logged to stderr.

### Fixed

- F79: `terminateChild` over-engineering closed. The dual-promise IIFE pattern with overlapping lifecycles replaced by a single linear async sequence. Callers see identical observable behavior.
- F88: `processLiveness` silent default-alive fallthrough closed. Unknown error codes now surface via stderr and carry an explicit `reason='unknown-default-alive'` tag in the return value rather than silently reusing a potentially dead PID.

### Verification

| Command | Status | Evidence |
|---------|--------|----------|
| `vitest run mcp_server/tests/embedders/sidecar-hardening.vitest.ts --config mcp_server/vitest.config.ts` | PASSED | 10 tests passed including new F79 case |
| `npx vitest run bin/lib/ensure-rerank-sidecar.vitest.ts --config vitest.config.bin.ts` | PASSED | 8 tests passed including new F88 suite |
| `npm run typecheck` | PASSED | No TypeScript errors |
| `validate.sh --strict` | PASSED | 0 errors. 0 warnings |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Modified | Collapsed `terminateChild` dual-promise lifecycle to single Promise. Removed `sleep(0)` and unused `sleep()` helper. |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modified | Explicit `ESRCH` and `EPERM` cases in `processLiveness`. Structured return type. Stderr logging for unknown codes. Exported for test access. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | Modified | Added F79 test: single-promise termination with SIGTERM-ignoring child. |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Modified | Added F88 test suite: 4 cases covering all `processLiveness` error paths. |

### Follow-Ups

- Python implementation in `sidecar_ledger.py` still uses a string-based `process_liveness` return type and silent default-alive behavior. This parity gap is tracked for phase 004.
- Monitor operator stderr output for unexpected `processLiveness` error codes to confirm the fail-open default-alive policy is appropriate in production.
