---
title: "Changelog: 098 — Multi-AI Council write authority"
description: "Per-packet change history for the scoped council write-authority implementation."
trigger_phrases:
  - "098 changelog"
  - "council write authority changelog"
importance_tier: "important"
contextType: "fix-history"
---
# Changelog: 098 — Multi-AI Council write authority

---

## v1.0.0 — 2026-05-08 (closed)

> Spec folder: `skilled-agent-orchestration/098-multi-ai-council-write-authority` (Level 3)
> Predecessors: `080-multi-ai-council-output-protocol/`, `089-multi-ai-council-persistence/`, `092-multi-ai-council-deferrals/`

### Summary

Closes packet 089's NO-GO blocker for council write authority. Council flips from planning-only (`write: deny / edit: deny`) to scoped-write (`write: allow / edit: allow`, path-restricted to `ai-council/**`) across all 4 runtime mirrors. Bash and patch stay denied. Audit-trail schema goes additive v1.1 → v1.2 with new `artifact_written` and `rollback` events. Round-NNN folder is the rollback unit; failed rounds preserved in `failed/round-NNN-<timestamp>/`.

### Added
- `mcp_server/scripts/multi-ai-council/lib/persist-artifacts.js` — refactored writer library exports (writeConfig, writeStrategyMd, writeStateJsonl, writeSeat, writeDeliberation, writeCritique, writeReport).
- `mcp_server/scripts/multi-ai-council/lib/audit-trail.js` — v1.2 `artifact_written` event factory + sha256 checksum + 10 MB rotating-file backup.
- `mcp_server/scripts/multi-ai-council/lib/rollback.js` — round-NNN rollback + supersede markers.
- 4 vitest files: `multi-ai-council-permission-scope.vitest.ts`, `multi-ai-council-runtime-parity.vitest.ts`, `multi-ai-council-audit-trail.vitest.ts`, `multi-ai-council-rollback.vitest.ts`.
- Packet-local `resource-map.md` and this changelog.

### Changed
- `mcp_server/scripts/multi-ai-council/persist-artifacts.cjs` — thin CLI wrapper around `lib/persist-artifacts.js`. Backward-compat preserved.
- `.opencode/agents/multi-ai-council.md` — permission YAML flipped to scoped-write `ai-council/**`; §0 + §16 body updated.
- `.claude/agents/multi-ai-council.md` — same flip, mirror parity.
- `.gemini/agents/multi-ai-council.md` — same flip, mirror parity.
- `.codex/agents/multi-ai-council.toml` — `sandbox_mode: read-only → workspace-write`; §0/§12/§16 body language updated. **Operator-applied** by Claude after cli-codex hit sandbox EPERM on the `.codex/` tree.
- `references/multi-ai-council/state-format.md` — appended §1.2 audit-trail event spec.
- `references/multi-ai-council/folder-layout.md` — flipped "Helper-written" annotations to "Council-written (helper as fallback)".
- `mcp_server/scripts/multi-ai-council/advise-council-completion.cjs` — recognizes v1.2 `artifact_written` events.

### Decisions (ADRs)
- **ADR-001 — Path-scoped write-permission model**: write/edit allow `ai-council/**`; bash/patch stay denied.
- **ADR-002 — Additive audit-trail schema (v1.1 → v1.2)**: new `artifact_written` and `rollback` event types appended to existing JSONL. v1 readers ignore unknown events.
- **ADR-003 — Round-NNN rollback semantics**: round folder is the rollback unit; on failure, move to `failed/round-NNN-<timestamp>/`, mark events as `superseded_by: "rollback"`, preserve forensic state.

### Verification
- TypeScript compile clean (via `node ../node_modules/typescript/lib/tsc.js --noEmit -p tsconfig.json`).
- Vitest: **4 files / 7 tests PASS** (after Codex TOML flip).
- Strict spec validation: PASS (0 errors, 0 warnings).
- 4-runtime mirror parity test confirms permission YAML byte-equivalent across `.opencode`, `.claude`, `.codex`, `.gemini`.

### Codex sandbox handoff caveat

cli-codex hit `EPERM` writing to `.codex/agents/multi-ai-council.toml` from within its own sandbox (codex's sandbox refuses writes to `.codex/` for self-protection). The implementation summary marked the packet 70% pending operator-applied TOML flip. Claude (different sandbox) applied the TOML flip after the cli-codex run; the runtime-parity test then passed and the packet closed. Future packets that flip self-relevant Codex YAML should plan for this handoff explicitly.

### Known limitations
1. **CommonJS lib via nested package.json**. The scripts package is `type: module`; `lib/*.js` files use a nested `package.json` to stay CommonJS so the existing `.cjs` wrapper and tests can require them synchronously.
2. **Path-scope enforcement is lib-side, not runtime-side.** The library throws `OUT_OF_SCOPE_WRITE` when callers attempt out-of-scope paths. A runtime path-resolver enforcing the same scope at the agent-runtime layer would harden the contract further; deferred to a future packet.
