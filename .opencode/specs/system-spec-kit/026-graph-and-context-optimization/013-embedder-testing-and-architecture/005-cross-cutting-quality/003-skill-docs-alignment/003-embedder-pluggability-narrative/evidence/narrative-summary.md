# Narrative Summary — 021/003 Embedder Pluggability

## Final LOC count

`410` LOC at `.opencode/skills/system-spec-kit/references/embedder-pluggability.md` (cap: 600).

## Sections completed (matches dispatch contract)

1. OVERVIEW — two-MCP / two-embedder / two-mechanism picture; text vs code split; "out-of-box for any embedder" scope.
2. MK-SPEC-MEMORY SIDE — jina-embeddings-v3 default; MANIFESTS registry; embedder_list/set/status MCP tools; EmbedderAdapter interface; dim-tagged `vec_<dim>` schema; rescue layer default-on; ADR-001..ADR-012 trail table.
3. COCOINDEX SIDE — `sbert/jinaai/jina-embeddings-v2-base-code` default; `registered_embedders.py` parity; `COCOINDEX_CODE_EMBEDDING_MODEL` env var + `ccc reset && ccc index` swap mechanism; MPS auto-detect (`_resolve_device`); `COCOINDEX_CODE_DEVICE=cpu` kill switch; packet 018+019 trail.
4. OPERATING MODES — first-install, swap, rollback (per MCP) + device-selection decision tree.
5. OUT-OF-BOX SUPPORT MATRIX — 13-row table covering every registered candidate in either MCP with dim, RAM, MPS, notes.
6. TRADE-OFFS — text vs code; size vs quality; latency vs recall; brief LiteLLM/API note (out-of-scope per local-only policy).
7. APPENDIX: VALIDATED AGAINST — sources + commit SHAs + cross-link block.

## Cross-links wired (R6)

- CocoIndex INSTALL_GUIDE §4 ("Choosing an embedder") — relative path
- CocoIndex `registered_embedders.py` — relative path
- 016/004 `decision-record.md` — relative path
- mk-spec-memory `registry.ts` + `adapter.ts` — relative paths

## Commit SHAs cited (R4 + R5 + §7 appendix)

| SHA | Role |
|---|---|
| `3d9e89d1f` | EmbedderAdapter interface (016/001) |
| `4a4e166ab` | MANIFESTS registry latest mutation (016/004 ADR-008) |
| `1aa46e523` | Decision-record + evidence JSONL (ADR-012 winner) |
| `8f909d229` | CocoIndex jina-code default + MPS auto-detect (018/001) |
| `49e3338ff` | CocoIndex `registered_embedders.py` + INSTALL_GUIDE/README (019) |

## Requirement check (spec.md §4)

- R1 ≤ 600 LOC — PASS (410).
- R2 both MCPs covered equally — PASS (~80 LOC §2, ~80 LOC §3).
- R3 out-of-box matrix accurate — PASS (built from registry.ts + registered_embedders.py).
- R4 ADR-009/010/011/012 cited — PASS (table row + inline rescue + production-default).
- R5 018 ADR-001 cited — PASS (commit `8f909d229` referenced for default flip + MPS patch).
- R6 cross-links — PASS (see above).
- R7 new user can swap without further reference — PASS (swap runbook in §4 per MCP; full env var + kill-switch documented in §3).

## Out-of-scope respected

- No hypothetical "if we add MCP tools to CocoIndex" — flagged explicitly at end of §3.
- No migration guides — pointed to 018/001 runbook.
- API-backed embedders mentioned only as out-of-scope escape hatch in §6.

## Risks / open items

- Doc rot: §7 appendix lists exact source paths + commit SHAs so a future drift-check can grep for SHA mismatches.
- Worked-example open question in spec.md (§7) — deferred; would push doc toward cap and is well-covered by §4 "Operating modes."
