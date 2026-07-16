# 014 Deep Review v4

**Commit reviewed:** 42aa114e3
**Iterations:** 10 (iter-040..049)
**Comparison to v3:** 012 resolved the launcher, dtype filename, q8 default, CocoIndex search-only, tcpdump interface, and most Qwen-era doc drift. The live PAT remains unresolved and several 012/cross-packet docs now lag behind the final commit.

## Resolved since v3

- `P0-V3-LAUNCHER-001` - RESOLVED. `.codex/config.toml:9-11` now launches `.opencode/bin/spec-kit-memory-launcher.cjs`; the launcher loads `.env.local`/`.env` and spawns `mcp_server/dist/context-server.js`.
- `P1-V3-LAUNCHER-001` - RESOLVED. Claude/Gemini also route through the launcher; no active runtime config still launches `context-server.js` directly for Spec Kit Memory.
- `P1-V3-005-001` - RESOLVED. `EmbeddingProfile` includes dtype in slug/JSON/equality/display and q8 derives a separate `__q8.sqlite` filename.
- `P1-V3-007-001` - PARTIALLY RESOLVED. The early shadow-warning helper exists, but v4 found a remaining startup path where warning order is still late (`P1-V4-VOYAGE-001`).
- `P1-V3-007-002` - RESOLVED. `tcpdump-verify.sh` uses `pktap` with `TCPDUMP_IFACE` override.
- `P1-V3-009-001` / `P1-V3-009-002` - RESOLVED. CocoIndex validates `project_root` before sqlite access and can read unloaded `target_sqlite.db` status when sqlite-vec loads.
- `P1-V3-PARENT-001`, `P1-V3-DOC-001`, `P1-V3-DOC-002`, `P1-V3-DOC-003`, `P1-V3-DIM-001` - MOSTLY RESOLVED. Parent phase map includes 001-012, recipe/default model docs are updated, 006/009 now say EmbeddingGemma, and 002 no longer claims 2560-dim EmbeddingGemma.

## Still-valid v3 findings (re-confirmed)

- `P0-V3-SEC-001` - STILL_VALID. `.env:12` still contains a full GitHub personal access token. Token value intentionally omitted.
- `P2-V3-009-001` - STILL_VALID. `SearchResult.rankingSignals` still uses a mutable list default at `protocol.py:104`.

## New v4 findings

- `P1-V4-DTYPE-001`: `memory_health` cannot report dtype even though the recipe tells operators to verify `dtype=q8` there.
- `P1-V4-012-001`: 012 docs still say Codex config was sandbox-blocked, but the committed `.codex/config.toml` now routes through the launcher.
- `P1-V4-012-002`: 012 q8 filename examples use the wrong sanitized basename.
- `P1-V4-DOC-001`: parent handover still says 11 packets shipped and 012 is in progress.
- `P1-V4-VOYAGE-001`: Voyage auto-shadow warning still fires after provider resolution/API validation in one startup config path, and `getStartupEmbeddingProfile()` lacks the pre-resolution guard.
- `P2-V4-CONFIG-001`: Codex config notes still show old non-q8/non-sanitized DB path.
- `P2-V4-DTYPE-002`: public factory options do not expose/pass `dtype` for programmatic hf-local construction.
- `P2-V4-DOC-002`: Setup A recipe q8 filename examples do not match emitted slug.
- `P2-V4-DOC-003`: tcpdump script comment still says Qwen3 cocoindex.

## Top-priority remediation recommendations

1. Rotate the GitHub PAT and remove/replace the local secret without copying it into docs, review artifacts, or chat.
2. Fix the remaining Voyage guard ordering by warning before startup/profile `resolveProvider()` calls and before API validation.
3. Refresh 012 + handover docs to the actual post-commit state: Codex launcher parity resolved, 12 packets shipped, commit `42aa114e3`.
4. Add dtype to `memory_health.embeddingProvider` and align the handler type with the extended profile shape.
5. Correct all hard-coded q8 filename examples, or replace them with "derived from provider/model/dim/dtype" wording.
6. Clean up low-risk residue: factory dtype option, CocoIndex mutable default, and the stale tcpdump comment.

## Overall verdict

FAIL

The post-012 source/runtime remediation mostly landed cleanly. The verdict is still FAIL because the live PAT remains a P0 and because `P1-V4-VOYAGE-001` leaves a real guard-ordering concern around accidental Voyage egress. If the PAT is treated as an explicitly manual/out-of-agent exception, the code/doc state is otherwise CONDITIONAL on the v4 P1 cleanup list.
