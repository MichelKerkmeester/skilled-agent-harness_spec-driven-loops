# Changelog , , ,  006: Wire skill-advisor to the shared hf model server

**Shipped**: 2026-05-29
**Commit**: 4b2c5de6a3

## What Changed
- Created `.opencode/bin/lib/model-server-supervision.cjs` shared supervision lib with createModelServerControl(deps) factory and moved pure primitives
- Modified `.opencode/bin/mk-spec-memory-launcher.cjs` to require the lib, re-export primitives with same names, replace 4 globals with hfControl, and add shared hf-embed.pid writer/reader
- Modified `.opencode/bin/mk-skill-advisor-launcher.cjs` to add gated (SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED, default OFF) shared-socket spawn capability with reap-on-shutdown and no self-exit
- Modified `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` to document 5 new envs, move 3 dead sidecar/execution envs to Deprecated, add single-resident-model 404 contract, and health-state troubleshooting
- Created `mcp_server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts` with 6 cross-launcher tests
- Fixed P1 spawn, †’bind clobber window via no-socket pid-liveness back-off and 4 P2 review findings

## Why
The architecture only pays off if mk-spec-memory and skill-advisor consume the same resident model server. Without explicit shared-socket wiring and docs, skill-advisor could keep a separate embedding path or lack a safe way to win startup when mk-spec-memory is absent.

## Verification
- `node --check` on the lib + both launchers: PASS (3/3)
- Stale-symbol grep (4 removed globals) in mk-spec-memory-launcher.cjs: ZERO references
- `module.exports` keyset count: 23 (identical to pre-extraction HEAD)
- `vitest run` F1 launcher-watchdog + F3 ipc-bridge-probe + 004 launcher-model-server + lease + idle: PASS (34 passed / 8 skipped)
- `vitest run` new cross-launcher suite: PASS (6/6)
- `vitest run` skill-advisor launcher (bootstrap/lease/rename) + hf-local/embeddings: PASS (25 + 33)
- 4-lens opus adversarial review + per-finding verify: 5 defects (1 P1 + 4 P2) , , ,  ALL fixed, focused P1 re-review 0 new defects
- `validate.sh --strict` on this packet: PASS
