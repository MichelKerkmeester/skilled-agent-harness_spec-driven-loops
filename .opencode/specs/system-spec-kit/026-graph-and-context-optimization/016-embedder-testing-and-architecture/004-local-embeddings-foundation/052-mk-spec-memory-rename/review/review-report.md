# Deep Review Report: 017 mk-spec-memory Rename

**Review Target:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/052-mk-spec-memory-rename/`
**Review Type:** Packet
**Commit:** `f91da9f1a` — `fix(026/017): rename spec-kit-memory MCP server → mk-spec-memory`
**Date:** 2026-05-15
**Executor:** cli-opencode / deepseek-v4-pro (high)
**Iterations:** 10 (converged at iter 004)

---

## 1. Scope Summary

The 017 packet renamed the Spec Kit Memory MCP server from `spec_kit_memory` to `mk-spec-memory` across the entire codebase: 4 runtime configs, server source code, launcher binary, state files, ~61 operational documents, ~14 targeted doc updates, test harnesses, and the vitest helper. Raw tool names (41 tools) were preserved unchanged. Historical spec packets (~90 files) were preserved as audit trail.

The review covered all 105 files in the rename commit (`f91da9f1a`), the packet's 7 spec documents, and 5 dimensions rotated across 10 iterations.

---

## 2. Iteration Summary

| Iter | Dimensions | Findings | New | P0 | P1 | P2 | Key Insight |
|------|-----------|----------|-----|----|----|----|-------------|
| 001 | correctness, completeness | 4 | 4 | 0 | 0 | 4 | Rename functionally sound; spec scope table has minor gaps |
| 002 | integration, documentation | 3 | 3 | 0 | 1 | 2 | REQ-005 changelog missing (P1); doc inconsistencies found |
| 003 | regression-risk, correctness | 1 | 1 | 0 | 0 | 1 | SelectClientForServer legacy fallback; otherwise low risk |
| 004 | completeness, integration | 0 | 0 | 0 | 0 | 0 | **Convergence reached** — all surfaces confirmed clean |
| 005 | documentation, regression-risk | 0 | 0 | 0 | 0 | 0 | Observation pass |
| 006 | correctness, integration | 0 | 0 | 0 | 0 | 0 | Observation pass |
| 007 | completeness, documentation | 0 | 0 | 0 | 0 | 0 | Observation pass |
| 008 | regression-risk, correctness | 0 | 0 | 0 | 0 | 0 | Observation pass |
| 009 | integration, completeness | 0 | 0 | 0 | 0 | 0 | Observation pass |
| 010 | SYNTHESIS | — | — | 0 | 1 | 7 | All findings deduped; 8 unique |

---

## 3. Final Findings

### P1 — Must Fix Soon (1)

| ID | Title | Location | Recommendation |
|----|-------|----------|----------------|
| 017-iter002-P1-001 | REQ-005 changelog entry not created | `changelog/` directory (missing); spec.md:91,165 | Create a changelog entry at `../026-graph-and-context-optimization/changelog/` documenting the 017 packet relocation from 027/001 and the namespace rename. Per spec.md Phase Context line 91 and REQ-005 (P1 requirement). |

### P2 — Nit/Polish (7)

| ID | Title | Location | Recommendation |
|----|-------|----------|----------------|
| 017-iter001-P2-001 | spec.md references CLAUDE.md section 6 but no such MCP section exists | spec.md:122 | The actual MCP routing update was in AGENTS.md only. Remove or correct the CLAUDE.md claim. |
| 017-iter001-P2-002 | `.mcp.json` and `.vscode/mcp.json` updated in commit but not listed in spec's scope table | spec.md:135-144 | Add both files to the "Files to Change" table for completeness. |
| 017-iter001-P2-003 | `plan.md` contains unfilled placeholder template text | plan.md:44-48, 76, 103 | Either populate or note: "Intentionally lightweight — rename is config-only." |
| 017-iter001-P2-004 | `graph-metadata.json` derived.status is "planned" but implementation is complete | graph-metadata.json:16 | Update to "shipped" or "complete." |
| 017-iter002-P2-005 | spec.md metadata table says Level 2 but SPECKIT_LEVEL comment and description.json say Level 1 | spec.md:38,47; description.json:17 | Align all level indicators to "1" (sufficient for this rename packet). |
| 017-iter002-P2-006 | `validate.sh` result documented as "Pending (run before commit)" but commit already landed | implementation-summary.md:141 | Run `validate.sh --strict` and update the result, or document that validation was deferred post-commit. |
| 017-iter003-P2-007 | `selectClientForServer` fallback `clients.memory` is a dead code path from pre-rename naming | run-substrate-stress-harness.mjs:148; run-mcp-direct.mjs:141 | Remove the `clients.memory` fallback or comment that it's intentionally retained. |

---

## 4. What Was Done Right

1. **Runtime config update**: All 4 runtime configs + 2 auxiliary MCP configs correctly updated with `mk-spec-memory`. Codex TOML quoting for hyphenated key is correct on all 3 TOML sections.
2. **Operational sweep**: 61 files swept from `mcp__spec_kit_memory__` → `mcp__mk_spec_memory__`. Zero old prefix remnants in any operational path.
3. **Server identity**: `context-server.ts:894` → `name: 'mk-spec-memory'`, dist rebuilt, smoke probe confirmed `serverInfo.name = "mk-spec-memory"` and full 41-tool surface.
4. **Harness dual-form support**: `selectClientForServer` correctly accepts both `mk_spec_memory` (JS identifier) and `mk-spec-memory` (display name). Vitest helper JS is syntactically valid.
5. **Historical preservation**: 90+ spec packet docs preserved with old prefix as audit trail — consistent with mk-code-index precedent.
6. **No-shim decision**: Well-documented in both spec (out of scope) and implementation-summary (key decisions + known limitations).
7. **Resource map**: Comprehensive 8-layer inventory accurately reflects what was changed.

---

## 5. Recommendations

### Immediate (P1)
- Create the REQ-005 changelog entry at `changelog-026-014-052-mk-spec-memory-rename.md`

### If Time Permits (P2)
- Fix spec.md line 122 (CLAUDE.md claim)
- Add `.mcp.json` and `.vscode/mcp.json` to spec scope table
- Populate or annotate plan.md
- Update graph-metadata.json status
- Align spec.md Level metadata
- Run validate.sh and update implementation-summary
- Clean up `clients.memory` fallback in harnesses (or comment it)

---

## 6. Resource Map Coverage Gate

`resource-map.md` was present at init (`resource_map_present: true`). All 8 layers were audited:

| Layer | Description | Coverage |
|-------|-------------|----------|
| 1 | Runtime configs (4 files) | Covered — all updated |
| 2 | MCP namespace prefix refs (61 op files) | Covered — all swept |
| 3 | Tool-name prefix variants (Gemini) | Covered — none found, as expected |
| 4 | Raw tool names (41 tools) | Covered — unchanged |
| 5 | Live MCP server source (context-server.ts) | Covered — name updated |
| 6 | Launcher binary | Covered — renamed + paths updated |
| 7 | Internal alias paths (mutex, tests, gemini script) | Covered — all updated |
| 8 | Substrate harness + sandbox runner | Covered — dual-form + dict keys |

No gaps found between resource-map.md claims and actual implementation.

---

## 7. Verdict

| Criterion | Value |
|-----------|-------|
| **P0** | 0 |
| **P1** | 1 |
| **P2** | 7 |
| **Verdict** | **CONDITIONAL** |

**Reasoning**: The rename implementation is functionally complete and correct. No `spec_kit_memory` references remain in any operational path. All 4 runtime configs, the launcher binary, server source code, state file paths, and all operational documents have been properly migrated. The single P1 finding (missing changelog entry) is a documentation artefact that does not affect correctness, integration, or regression-risk. The 7 P2 findings are minor documentation polish issues and one dead-code reference in test harnesses.

**Release Recommendation**: The packet is safe to ship. The P1 changelog entry should be created before the next packet under 026 is shipped, but does not block this packet's deployment.
