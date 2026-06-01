---
title: "Fix 020/002: Env and Config Behavior Closure for F17 F16 F40 F46"
description: "Four deferred P2 findings closed: config-hash input validation, unified env allowlist between launcher and in-process sidecar client, env drop-with-warning migration window plus SPECKIT_* prefix precedence over RERANK_*."
trigger_phrases:
  - "020 002 env config behavior"
  - "F17 F16 F40 F46 sidecar"
  - "rerank sidecar env allowlist"
  - "config hash input validation"
  - "sidecar env allowlist alignment"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/002-fix-deferred-p2s-for-env-and-config-behavior` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes`

### Summary

Four deferred P2 findings in the rerank sidecar env/config surface were left open after the main P1 remediation arc. F17 allowed malformed config values to enter the canonical hash silently. F16 and F40 reported allowlist drift between the launcher and the in-process sidecar client, enabling disallowed env vars to leak into child processes. F46 left the `SPECKIT_*` and `RERANK_*` prefix overlap behavior undocumented and untested.

All four findings were closed in a single commit. Config-hash input validation now rejects non-string, oversize (greater than 4KB total) plus unprintable-byte values with `ConfigHashInputError` before hashing. A new shared allowlist helper unifies env filtering between launcher and in-process client so the two surfaces cannot drift again. Dropped env keys emit a stderr warning with the key name only, giving operators a migration window rather than a hard error. Prefix overlap resolution now documents and enforces `SPECKIT_*` winning over `RERANK_*` on full equality, with a stderr warning on conflict. Three ADRs record the contract changes and alternatives considered.

### Added

- `sidecar-env-allowlist.cjs` shared env allowlist helper consumed by both launcher and in-process sidecar client
- `ConfigHashInputError` class in `ensure-rerank-sidecar.cjs` with key-only error messages that omit rejected values
- Regression fixtures for F17 validation in `ensure-rerank-sidecar.vitest.ts` covering non-string, oversize, unprintable-byte plus valid-hash cases
- Regression fixtures for F16/F40 env drop-with-warning and F46 prefix precedence in `sidecar-hardening.vitest.ts`
- Three ADRs in `decision-record.md` documenting hash sanitization policy, shared allowlist contract plus prefix precedence rule

### Changed

- `ensure-rerank-sidecar.cjs` now validates config-hash inputs before hashing and routes env filtering through the shared allowlist
- `sidecar-client.ts` env filtering now uses the shared allowlist, warns on dropped keys instead of forwarding them plus documents `SPECKIT_*` over `RERANK_*` precedence

### Fixed

- F17: config-hash computation no longer accepts non-string, oversize or unprintable-byte values silently
- F16 and F40: env allowlist drift between launcher and in-process client eliminated by unifying both behind one shared helper
- F46: prefix overlap behavior is now documented, tested plus guaranteed to favor `SPECKIT_*` with a stderr conflict warning

### Verification

| Check | Result |
|-------|--------|
| `validate.sh ...002-fix-deferred-p2s-for-env-and-config-behavior --strict` (scaffold pre-impl) | PASS |
| `node node_modules/vitest/vitest.mjs run .opencode/bin/lib/ensure-rerank-sidecar.vitest.ts --config .opencode/vitest.config.bin.ts` | PASS |
| `node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/ --config mcp_server/vitest.config.ts` (4 files, 43 tests) | PASS |
| `npm run typecheck --workspace=@spec-kit/mcp-server` | PASS |
| Alignment drift scan | PASS |
| `validate.sh` final strict (packet docs) | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/bin/lib/sidecar-env-allowlist.cjs` (NEW) | Shared allowlist source consumed by launcher and in-process client |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Config-hash input validation with `ConfigHashInputError`. Env filtering routed to shared allowlist. |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | F17 fixtures: non-string, oversize, unprintable-byte plus valid-hash cases |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts` | Unified env filtering via shared allowlist. Drop-with-warning for rejected keys. Prefix precedence documentation and enforcement. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/sidecar-hardening.vitest.ts` | F16/F40 env drop-warning fixture and F46 prefix precedence fixture |

### Follow-Ups

- Files `ensure-rerank-sidecar.cjs` and `sidecar-client.ts` were later removed when the sidecar execution path was retired in a subsequent packet. Confirm the shared allowlist helper (`sidecar-env-allowlist.cjs`) is still referenced or also remove it.
- Verify that the findings (F17, F16, F40, F46) are marked closed in the parent finding registry at `../../015-deep-research-drift-and-simplification/research/findings-registry.json`.
