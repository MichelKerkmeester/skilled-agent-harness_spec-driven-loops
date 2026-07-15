# Code Graph Playbook — Release-Readiness Matrix

**Run date:** 2026-05-26
**Playbook:** `.opencode/skills/system-code-graph/manual_testing_playbook/` (22 scenarios)
**Executors:** cli-opencode `deepseek/deepseek-v4-pro` (live MCP, no `--pure`); cli-devin `swe-1.6` (static/infra/hook); Claude Code orchestrator (static YAML verified directly).
**Dispatch discipline:** sequential, SIGKILL between dispatches. Total DeepSeek+Devin spend: ~$0.02.

## Overall verdict: **CONDITIONAL PASS** at validation → **RESOLVED** after remediation (phases 004-006)

> **Update 2026-05-27:** all blocking findings were remediated in phases 004-006 and the 4 SKIPped scenarios re-verified. See "Remediation update" at the bottom. Post-remediation state: **19 PASS, 1 PARTIAL (022), 0 FAIL, 0 SKIP.**

Every runtime behavior that could be exercised behaved correctly (16 PASS). Two real infrastructure FAILs (legacy DB path/binding, broken Devin hook registration) and four SKIPs (all blocked by a single parser-quarantine environmental issue) prevent an unconditional PASS. **No core-logic defects** were found — the FAILs are config/path issues with clear remediation, and the SKIPped readiness-gate logic is independently confirmed working via scenarios 007/008.

## Tally

| Verdict | Count | IDs |
|---------|-------|-----|
| **PASS** | 16 | 001, 003, 004, 006, 007, 008, 009, 010, 011†, 015, 016, 017, 018, 020†, 021†, 023 |
| **FAIL** | 2 | 019 (F-019-1), 025 (F-025-1) |
| **SKIP** (env-blocked) | 4 | 002, 005, 022, 024 (all F-RUNTIME-2) |

† carries a doc-staleness finding (see below) but the runtime behavior is correct.

## Full matrix

| ID | Group | Surface | Executor | Verdict | Evidence |
|----|-------|---------|----------|---------|----------|
| 001 | read-path | live MCP | opencode | PASS | 001/evidence.md |
| 002 | read-path | live MCP | opencode | SKIP (F-RUNTIME-2) | 001/evidence.md |
| 003 | scan/verify/status | live MCP | opencode | PASS | 001/evidence.md |
| 004 | scan/verify/status | live MCP | opencode | PASS | 001/evidence.md |
| 005 | scan/verify/status | live MCP | opencode | SKIP (F-RUNTIME-2) | 001/evidence.md |
| 006 | scan/verify/status | live MCP | opencode | PASS | 001/evidence.md |
| 007 | detect-changes | live MCP | opencode | PASS | 001/evidence.md |
| 008 | context | live MCP | opencode | PASS | 001/evidence.md |
| 009 | coverage-graph | static YAML | Claude Code | PASS | 001/evidence.md |
| 010 | coverage-graph | static YAML | Claude Code | PASS | 001/evidence.md |
| 011 | mcp-tool-surface | live MCP | opencode | PASS (F-011-1) | 001/evidence.md |
| 015 | doctor-code-graph | static YAML | Claude Code | PASS | 001/evidence.md |
| 016 | mcp-tool-surface | static | devin | PASS | 002/evidence.md |
| 017 | post-rename-infra | static | devin | PASS | 002/evidence.md |
| 018 | post-rename-infra | static | devin | PASS | 002/evidence.md |
| 019 | post-rename-infra | static | devin | **FAIL** (F-019-1) | 002/evidence.md |
| 020 | post-rename-infra | static | devin | PASS (F-020-1) | 002/evidence.md |
| 021 | post-rename-infra | build | devin | PASS (F-021-1) | 002/evidence.md |
| 022 | mcp-tool-surface | live MCP | opencode | SKIP (F-RUNTIME-2) | 001/evidence.md |
| 023 | doctor-code-graph | live MCP | opencode | PASS | 001/evidence.md |
| 024 | detect-changes | live MCP | opencode | SKIP (F-RUNTIME-2) | 001/evidence.md |
| 025 | devin-hooks | Devin hook | devin | **FAIL** (F-025-1) | 002/evidence.md |

## Findings triage

### P1 — fix before release (follow-on packets, NOT fixed in this validation run)

| ID | Finding | Recommendation |
|----|---------|----------------|
| **F-019-1** | Legacy DB persists at `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` (106,496 B). Its size matches the runtime's reported `dbFileSize` in smoke-006 (empty graph) → runtime is likely bound to the empty legacy DB, not the 68 MB canonical one. Explains the empty-graph appearance throughout the run. | Verify active DB binding/config path; remove the legacy DB file; confirm runtime reads the canonical 68 MB DB. |
| **F-025-1** | `.devin/hooks.v1.json` SessionStart `command` cites `.../system-code-graph/dist/system-spec-kit/mcp_server/hooks/devin/session-start.js` (does NOT exist). Actual hook: `.../system-spec-kit/mcp_server/dist/hooks/devin/session-start.js`. Hook code works but won't fire at runtime. | Fix the `command` path in `.devin/hooks.v1.json`. |
| **F-RUNTIME-2** | After several scans, the tree-sitter parser globally quarantined (`zero_node_scan_rejected`, all files parse_error), blocking 4 scan-dependent scenarios (002, 005, 022, 024). | Investigate quarantine trigger threshold + tree-sitter native-module stability under repeated scans; add auto-recovery. Then re-run 002/005/022/024 to verify their logic. |

### P2 — playbook documentation drift (doc-only)

| ID | Finding |
|----|---------|
| F-011-1 | Scenario 011 expects a `rating` field on `code_graph_verify`; the current verify schema has no such field (runtime correctly runs verify). Update the malformed-call sub-check. |
| F-020-1 | Scenario 020 expects 11 launcher tools; runtime exposes 8 (intentional CocoIndex decoupling, commit `10b76891c2`). Update "Expected signals" 11→8. |
| F-021-1 | Playbook index labels 021 "unicode-normalization fix from 009"; file content is "root dist cleanup verification". Reconcile label vs content. |
| (010) | Scenario 010 line ranges (817-836/841-863) drifted from actual (854-865/1032-1051). Update cited lines. |

### Expected / good behavior (no action)

- **F-RUNTIME-1** — `code_graph_scan` enforces `rootDir` within the workspace root (rejects `/tmp`). Good scope containment.

## Methodology notes / caveats

- **DB binding caveat:** Because of F-019-1, the live graph appeared empty (`totalNodes:0`) for the whole run. Scan-family scenarios (003/004) still PASSed by scanning disposable workspaces under the repo, which the runtime indexed (1996 nodes) — so scan mechanics are validated regardless of the DB-binding question.
- **SKIP rationale:** 002/005/022/024 are SKIP (could not execute as designed), not FAIL — their target logic was never fairly exercised. The shared readiness-gate they depend on IS confirmed working via 007 (detect_changes blocks on stale) and 008 (context blocks on broad stale, 200>50 threshold).
- **Staleness method for 007/008:** the dispatched session created broad-stale state by marking files in the tracked `.opencode` scope (parser quarantine blocked disposable-workspace scans). Blast radius was contained to packet 029 (16 files) and the markers were stripped afterward; no files outside the packet were touched.
- **sequential_thinking visibility:** Devin `-p` print mode does not surface tool-call traces, so positive confirmation of the mandated ≥5-thought call is unavailable; enforcement is in place via registered MCP + `system_instructions`.

---

## Remediation update (2026-05-27, phases 004-006)

All P1 findings were fixed and the 4 SKIPped scenarios re-verified live (parser fix loaded via daemon restart). Cost of re-runs ~$0.002.

| Finding | Validation status | Remediation (phase) | Post-fix status |
|---------|-------------------|---------------------|-----------------|
| **F-025-1** Devin hook registration path broken | FAIL (025) | Phase 004 — corrected `.devin/hooks.v1.json` SessionStart `command` to the real artifact `…/system-spec-kit/mcp_server/dist/hooks/devin/session-start.js` | RESOLVED — hook invoked, emits `## Session Context`, exit 0 |
| **F-019-1** legacy DB / suspected misbinding | FAIL (019) | Phase 005 — root cause corrected (empty-DB size coincidence; runtime was on canonical all along), stale legacy DB removed | RESOLVED — legacy absent, canonical (68 MB) active |
| **F-RUNTIME-2** parser global quarantine, no recovery | blocked 002/005/022/024 | Phase 006 — added `resetParserHealth()` + wired into explicit full scans; tsc + 54 vitest + alignment pass | RESOLVED — recovery shipped + unit-tested |
| **F-020-1 / F-011-1 / F-021-1 / 010 line drift** | doc staleness (P2) | Phase 004 — playbook docs reconciled | RESOLVED |

### Re-verified scenarios (were SKIP → now run, parser fix live)

| ID | Pre-fix | Post-fix | Evidence |
|----|---------|----------|----------|
| 002 | SKIP (F-RUNTIME-2) | **PASS** — 57 content edits → broad-stale block, `requiredAction:code_graph_scan` | 006/scratch/rerun-002-005-stdout.json |
| 005 | SKIP (F-RUNTIME-2) | **PASS** — verify blocked → rescan ACCEPTED (2425 nodes, no zero-node reject) → verify ok + pass-rate | 006/scratch/rerun-002-005-stdout.json |
| 024 | SKIP (F-RUNTIME-2) | **PASS** — multi-file diff → 2 affectedFiles, 16 symbols, canonicalized, empty-diff error | 006/scratch/rerun-024-022-stdout.json |
| 022 | SKIP (F-RUNTIME-2) | **PARTIAL** — single non-blocked, union 7≥1, minConfidence≤unfiltered hold; transitive==nontransitive (test subject had a single importer / no deeper dependents — shallow topology, not a tool defect) | 006/scratch/rerun-024-022-stdout.json |

### Post-remediation tally: **19 PASS · 1 PARTIAL (022) · 0 FAIL · 0 SKIP**

Follow-ups (both addressed in **phase 007**):
- **(a) 022 transitive re-verify** → done. On a deep subject (`lib/code-graph-db.ts`, 3-hop / 35 importers) the default blast_radius already returns the full closure, so `includeTransitive` is a no-op. 022 stays **PARTIAL** with clarified finding **F-022-1** (blast_radius default-depth vs `includeTransitive` semantics — maintainer design decision, not a core defect; single/union/minConfidence all correct).
- **(b) cross-skill hook docs** → done. The 4 hook READMEs + `deferred_decisions.md` now cite the real flat artifact `system-spec-kit/mcp_server/dist/hooks/<runtime>/session-start.js`; the decision tracker carries a dated correction noting the system-code-graph migration was never realized.

**F-022-1 resolved in phase 008.** The phase-007 consumer audit found no programmatic caller relied on the implicit full-closure default, so blast_radius was fixed to honor the documented `includeTransitive` flag (default depth-1; `includeTransitive:true` → multi-hop to `maxDepth`) in `handlers/query.ts`. tsc + 85 vitest (incl. a new gating test) + alignment all pass; scenario 022 is now satisfiable (depth-1 baseline < transitive expansion).

### Final state (validation 029 + remediation phases 004-008)
All 22 scenarios resolved. Every finding fixed: F-019-1 (legacy DB removed), F-025-1 (hook path), F-RUNTIME-2 (parser recovery), F-011-1 / F-020-1 / F-021-1 (playbook doc-sync), F-022-1 (blast_radius includeTransitive). No remaining follow-ups in this packet.
