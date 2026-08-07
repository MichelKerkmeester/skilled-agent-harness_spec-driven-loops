---
title: "Launcher EPERM Parity Fix (mk-spec-memory + mk-code-index)"
description: "Propagated skill-advisor's EPERM branch in leaseHeldFromFile to the spec-memory and code-index launchers. Closes the -32000 MCP reconnect failure caused by unhandled EPERM from process.kill in sandbox environments."
trigger_phrases:
  - "EPERM launcher parity fix"
  - "mcp reconnect -32000 fix"
  - "launcher EPERM parity"
  - "leaseHeldFromFile EPERM"
  - "009 eperm parity"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/009-launcher-eperm-parity-fix` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency`

### Summary

The `mk-spec-memory` and `mk-code-index` launchers crashed with `Error: kill EPERM` whenever `process.kill(pid, 0)` probed a lease owner from a different Claude/Codex sandbox session. Both `leaseHeldFromFile()` implementations handled only `ESRCH` and rethrew all other errors. The unhandled `EPERM` caused the launcher to exit 1 with no MCP stdio child, which surfaced to Claude as JSON-RPC `-32000`. The skill-advisor launcher had already received an identical fix in packet 007 (`mk-skill-advisor-launcher.cjs:171-180`).

A byte-equivalent `EPERM` branch was added to both launchers, mirroring the RCA-confirmed skill-advisor pattern. The fix treats `EPERM` as a live lease held by the probed PID, which is the correct semantic when sandbox isolation blocks the `kill(0)` probe without meaning the process is dead.

### Added

- `if (error.code === 'EPERM') return { held: true, ownerPid: lease.pid, staleReclaimable: false, startedAt, legacyPath }` branch in `mk-spec-memory-launcher.cjs:141`
- Identical EPERM branch in `mk-code-index-launcher.cjs:175`
- Inline comment `// 016/006/009: mirror skill-advisor parity` in both launchers for future grep discovery
- `mcp-disconnect-rca.md` committed to the arc scratch folder for traceability

### Changed

- `leaseHeldFromFile()` in `mk-spec-memory-launcher.cjs` now handles `EPERM` as a live-lease signal rather than rethrowing
- `leaseHeldFromFile()` in `mk-code-index-launcher.cjs` now handles `EPERM` as a live-lease signal rather than rethrowing

### Fixed

- `mk-spec-memory` and `mk-code-index` launchers exited 1 with `Error: kill EPERM` when probing a sandbox-foreign lease owner. Both now return `held: true` and continue normally.
- JSON-RPC `-32000` reconnect error surfaced in Claude when either launcher crashed on EPERM probe. Resolved by the above fix.

### Verification

| Check | Result |
|-------|--------|
| `node --check .opencode/bin/mk-spec-memory-launcher.cjs` | exit 0, SYNTAX OK |
| `node --check .opencode/bin/mk-code-index-launcher.cjs` | exit 0, SYNTAX OK |
| `grep '016/006/009.*EPERM' .opencode/bin/mk-*-launcher.cjs` | 2 matches, one per launcher |
| `validate.sh 009 --strict` | RESULT: PASSED (0/0) |
| Live daemon restart with sandbox-foreign lease | `/mcp` no longer reports `-32000` for `mk_code_index` or `mk-spec-memory` |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modified | Added EPERM branch in `leaseHeldFromFile()` at line 141 with inline rationale comment |
| `.opencode/bin/mk-code-index-launcher.cjs` | Modified | Added identical EPERM branch in `leaseHeldFromFile()` at line 175 with inline rationale comment |

### Follow-Ups

- Add a dedicated EPERM-mock vitest test for cross-sandbox-PID scenarios if the cross-launcher parity surface grows. The current cross-sandbox setup is not easily reproducible in vitest.
- Track artifact freshness asymmetry: `mk-skill-advisor-launcher` checks `latestSourceMtimeMs` but the other two only check artifact existence. This leaves room for stale dist to be served.
- Track stale copied shared dist under `.opencode/skills/system-code-graph/dist/system-spec-kit/shared/embeddings/factory.js` where `ollama` is missing from `SUPPORTED_PROVIDERS`. This is a latent bug not in the active code path today.
