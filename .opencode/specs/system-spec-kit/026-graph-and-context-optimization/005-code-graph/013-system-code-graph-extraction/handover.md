---
title: "Handover: 014 system-code-graph extraction — post-deep-review remediation + restart playbook"
description: "Detailed handover covering the 7-phase code-graph extraction shipping state, all deep-review findings (status: closed), post-restart cleanup steps, end-to-end test plan, rollback paths, follow-up packet candidates, and known residual risks."
trigger_phrases:
  - "014 handover"
  - "code-graph extraction handover"
  - "system-code-graph handover"
  - "post-mcp-restart cleanup"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/013-system-code-graph-extraction"
    last_updated_at: "2026-05-14T13:25:00Z"
    last_updated_by: "claude"
    recent_action: "Repaired build; fixed 014-scoped vitest regressions; reconciled docs"
    next_safe_action: "Commit 014 slice to main; then user runtime restart"
    blockers: []
    completion_pct: 100
---

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->
# Session Handover Document — 014 system-code-graph extraction

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

This handover is the **canonical resume surface** for any future session continuing or auditing the 014 extraction. Use when:
- Restarting the MCP children to land the new `system_code_graph` server registration
- Cleaning up the held-open stub DB files in `system-spec-kit/mcp_server/database/`
- Running the post-restart smoke/integration tests in §7
- Investigating a code-graph regression after this migration
- Scoping a follow-up packet (see §9)

**Status:** complete (with one operational follow-through pending — see §6.1)
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

| Field | Value |
|-------|-------|
| **From Session** | 2026-05-14 (single autonomous session, ~6 hours wall clock) |
| **To Session** | next maintainer session (after MCP child restart) |
| **Phase Completed** | All 7 sub-phases shipped (research+ADR-001 → ADR-002 standalone MCP); deep-review remediation closed |
| **Handover Time** | 2026-05-14T11:45:00Z |
| **Verdict** | Strict-validate PASSED 0E/0W recursive; deep-review CONDITIONAL → PASS after 4 remediations landed |
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made (ADR-locked)

| Decision | Rationale | Source |
|----------|-----------|--------|
| **DB extraction (Q2)** — move with `SPECKIT_CODE_GRAPH_DB_DIR` env fallback | Clean ownership; shared dir would couple two skills on same SQLite directory | ADR-001 Q2 |
| **MCP topology (Q3) — STANDALONE** | User direction 2026-05-14 reversed initial co-resident decision; ownership-clarity benefit outweighs 2-5s extra startup | ADR-002 (014/007/decision-record.md) supersedes ADR-001 Q3 |
| **Tool-id stability (Q4)** — preserve `code_graph_*`/`ccc_*`/`detect_changes` | 80+ consumer references would break on rename; namespace-prefix changes (server name) instead | ADR-001 Q4 (still in force) |
| **Cross-subsystem imports (Q5)** — sibling-skill direct imports (NOT MCP round-trips) | Hooks/handlers stay in-process function calls; shared SQLite WAL reader model; scan-loop remains single writer | ADR-001 Q5 (still in force) |
| **Plugin bridge (Q6)** — code-graph-specific bridge moves; shared message schema stays | `spec-kit-compact-code-graph-bridge.mjs` moved to system-code-graph; `spec-kit-opencode-message-schema.mjs` stays in system-spec-kit | ADR-001 Q6 |
| **Path flattening** (post-ADR-001) | User manual reorg removed the `code_graph/` parent subdir; all 30+ import paths in handlers/hooks/tests align with the flatter layout | Documented in 014/007/decision-record.md §Consequences |
| **INDEX env defaults** — all five `SPECKIT_CODE_GRAPH_INDEX_*` ship as `"false"` | End-user safe default; maintainer overrides locally via shell env or `.env.local` | ADR-002 + opencode.json |

### 2.2 Blockers Encountered (all resolved)

| Blocker | Status | Resolution |
|---------|--------|------------|
| `codex exec` model name `gpt-5.5-codex` rejected | resolved | Correct identifier is `gpt-5.5` (memory: `feedback_codex_cli_fast_mode`) |
| `opencode run` model name `deepseek-v4-pro` rejected | resolved | Correct identifier is `deepseek/deepseek-v4-pro` (provider-prefixed) |
| User reversed ADR-001 Q3 mid-implementation (Phase 006 already shipped under co-resident) | resolved | Phase 007 scaffolded with ADR-002 superseding only Q3; ADR-001 Q1/Q2/Q4-Q8 unchanged |
| User manual file flattening diverged from ADR-001 resource-map layout | resolved | Recalibration in 007 dispatch updated import paths everywhere; ADR-002 documents the deviation in §Consequences |
| Deep-review surfaced 4 findings (1 P0 + 1 P1 + 2 P2) | resolved | All four remediated; see §3 |

### 2.3 Files Modified — Net Changeset

**Created in this session (≈285 files net):**

| Bucket | Count | Path |
|--------|-------|------|
| Spec packet (014 phase parent + 7 children) | 56 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/013-system-code-graph-extraction/` |
| New skill `system-code-graph/` core | ≈15 | `.opencode/skills/system-code-graph/` (SKILL.md, README.md, package.json, tsconfig.json, vitest.config.ts, .gitignore, ARCHITECTURE.md, …) |
| Skill code (flattened) | ≈73 | `mcp_server/{lib,handlers,tools,tests,core,stress_test/code-graph,plugin_bridges,database}/` |
| Skill docs (cat-22 split) | 14 | `feature_catalog/01-08/` (6) + `manual_testing_playbook/01-08/` (8) |
| Standalone MCP infra | 3 | `.opencode/bin/system-code-graph-launcher.cjs`, `mcp_server/index.ts`, `mcp_server/tool-schemas.ts` |
| Database | 3 | `mcp_server/database/code-graph.sqlite{,-wal,-shm}` (live, 53 MB) |

**Updated in system-spec-kit (≈30 files):**
- 5 cross-subsystem handlers (memory-search, session-resume, session-bootstrap, session-health, memory-context) — imports rewired to flattened sibling-skill paths
- 6 hooks (memory-surface, claude/{compact-inject,session-prime}, gemini/{session-prime,compact-cache}, codex/lib/freshness-smoke-check) — same
- `context-server.ts` — kept in-process lib imports; removed MCP-tool routing hints
- `tool-schemas.ts` — 10 code-graph tool schemas removed (replaced with ADR-002 comment marker)
- `tools/index.ts:10` — code-graph dispatch removed (replaced with comment marker)
- `vitest.config.ts` — code-graph test patterns removed
- 2 stress tests (search-quality, session) — import paths fixed (P1 remediation)

**Updated at repo root:**
- `opencode.json` — new `system_code_graph` MCP server entry; `SPECKIT_CODE_GRAPH_INDEX_*=false`; `_NOTE_8` rewritten
- `README.md`, `CLAUDE.md`, `AGENTS.md` — code-graph path references → new skill
- `.opencode/commands/doctor/update.md` — MUTATION BOUNDARIES + SUBSYSTEM CONTRACT path consistency (P2-1 remediation)
- 9 agent files + 3 skill cross-refs + constitutional rule + 8 commands updated

**Moved with git mv (history preserved):**
- 108 code-graph source files (lib, handlers, tools, tests + READMEs)
- 13 stress-test files
- 1 plugin bridge `.mjs` (the bridge; the shared schema sibling stayed)
- 7 external tests reclassified as code-graph-internal
- 14 category-22 docs (6 catalog + 8 playbook) — codex's per-file judgment: pure code-graph internals move, shared context/hook docs stay

**Deleted:**
- nothing yet — 3 stub DB files at old location await MCP child restart (see §6.1)
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:findings-status -->
## 3. Deep-Review Findings — All Closed

Deep-review ran via `cli-opencode + deepseek/deepseek-v4-pro` (10-iter cap, converged at iter 4, newInfoRatio < 0.05).

Full report: `review/review-report.md` at this packet root.

| ID | Severity | What it was | Resolution | Verification |
|----|----------|-------------|------------|--------------|
| **P0-1** | ship-blocker | `007/implementation-summary.md` claimed `STUB_DB_DELETED=yes` but 3 files (4 KB + 32 KB + 180 KB) still existed at `system-spec-kit/mcp_server/database/code-graph.sqlite{,-shm,-wal}` | Two-pass: (1) deep-review remediation corrected the claim to `STUB_DB_DELETED=no` and rewrote prose to describe the live-holder state; (2) post-handover follow-up confirmed via `ls` that the 3 stub files no longer exist on disk (removed by some intervening action between handover write-time and follow-up session); claim flipped back to `STUB_DB_DELETED=yes` with the verification method noted in the implementation-summary prose and markers block. | `ls system-spec-kit/mcp_server/database/code-graph.sqlite*` → "no such file or directory"; `grep STUB_DB_DELETED ...summary.md` → `yes (files removed before this session; verified via ls)` |
| **P1-1** | must-fix | 4 stale import paths in 2 stress tests referenced the pre-flattening `mcp_server/code_graph/lib/` and `mcp_server/code_graph/handlers/` paths that no longer exist | All 4 paths rewritten to flattened layout (`mcp_server/lib/`, `mcp_server/handlers/`). Files: `w10-degraded-readiness-integration.vitest.ts:11-12`, `gate-d-benchmark-session-resume.vitest.ts:17,31` | `grep -rn "code_graph/lib\|code_graph/handlers" stress_test/` → 0 matches |
| **P2-1** | advisory | `doctor/update.md:214` SUBSYSTEM CONTRACT row for code-graph used wrong path (`.opencode/skills/system-code-graph/database/...` — missing `mcp_server/`) | Full path corrected to `.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` | `grep "^| code-graph" doctor/update.md` → updated path |
| **P2-2** | advisory | `002-scaffold-skill/graph-metadata.json` `derived.causal_summary` still claimed "co-resident under spec_kit_memory per ADR-001 Q3" (pre-supersession language) | Summary now notes "later superseded by ADR-002 (014/007-mcp-topology-pivot) which moved code-graph onto its own standalone system_code_graph MCP server" | `grep ADR-002 002/.../graph-metadata.json` → present |

**Post-remediation validation:** `bash validate.sh 014 --strict --recursive` → 0 errors, 0 warnings, **PASSED**.

**Effective verdict promoted: CONDITIONAL → PASS for ship-readiness.**
<!-- /ANCHOR:findings-status -->

---

<!-- ANCHOR:next-session -->
## 4. For Next Session

### 4.1 Recommended Starting Point

- **Doc to read first:** this handover (§5 priorities, §6 post-restart steps, §7 test plan)
- **Key reference:** `007-mcp-topology-pivot/decision-record.md` for the final architecture (standalone MCP)
- **Resource map:** `001-extraction-design-and-adr/resource-map.md` for the full touchpoint catalog
- **Recovery surface:** `/spec_kit:resume system-spec-kit/026-graph-and-context-optimization/005-code-graph/013-system-code-graph-extraction/`

### 4.2 Priority Tasks Remaining

1. **HIGH — Restart MCP children** so the new `system_code_graph` MCP server registers and the legacy `spec_kit_memory` child stops holding stale DB handles (§6.1)
2. **HIGH — Run post-restart smoke tests** to confirm code-graph tools work via the new namespace (§7.1)
3. **MEDIUM — Delete 3 stub DB files** at `system-spec-kit/mcp_server/database/code-graph.sqlite{,-wal,-shm}` after restart confirms handles released (§6.2)
4. **MEDIUM — Commit + PR** the changeset (≈285 files; large but mechanically structured)
5. **LOW — Consider follow-up packets** for residual cleanup (§9)

### 4.3 Critical Context to Load

- [ ] `_memory.continuity` in this handover + each child packet's `implementation-summary.md`
- [ ] `spec.md` of phase parent (Sub-Phase Manifest, Out of Scope, Dependencies)
- [ ] `decision-record.md` of 014/001 (ADR-001: Q1/Q2/Q4-Q8) and 014/007 (ADR-002: Q3 supersession)
- [ ] `review/review-report.md` for the closed findings detail
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:remediation-status -->
## 5. Remediation Status Snapshot

| Item | Status | Action Owner | Action Required |
|------|--------|--------------|-----------------|
| P0-1 stub-DB claim mismatch | closed | (was: codex) | none (claim now reflects truth: stubs were removed before the follow-up session — see §3 P0-1 row) |
| P1-1 stress test import paths | closed | (was: codex) | none |
| P2-1 doctor/update.md SUBSYSTEM CONTRACT row | closed | (was: codex) | none |
| P2-2 002 causal_summary stale wording | closed | (was: codex) | none |
| Post-handover P1 — broken TS build (sibling node_modules missing SDK; launcher first-spawn failed) | **closed** | claude (follow-up) | SDK direct-copy from `mcp-code-mode/mcp_server/node_modules/@modelcontextprotocol/sdk` v1.27.1 → sibling's `mcp_server/node_modules/@modelcontextprotocol/`; both typechecks now exit 0; dist built; launcher redirect stub written at `mcp_server/dist/index.js` |
| Post-handover P1 — 6 stale-path vitest regressions in system-code-graph | **closed** | claude (follow-up) | 6 path constants fixed across 5 test files; full vitest passes 395/0/9 (passed/failed/skipped) |
| Post-handover P1 — sibling tool-schema test drift (12 stale describe-cases + tool count) | **closed** | claude (follow-up) | 3 dead describe blocks removed from sibling tests (code_graph, ccc, single code_graph_verify it); review-fixes tool count 55→49 to match current source state |
| MCP child restart | **OPEN** | user / next session | §6.1 — build is now repaired; runtime relaunch (quit + reopen Claude Code/OpenCode) loads the new `system_code_graph` entry |
| Stub DB file cleanup | closed | n/a | files already absent — verified via `ls` (see §3 P0-1) |
| Post-restart smoke tests | **OPEN** | user / next session | §7 |
| Commit + PR | **in progress** | claude → main | committing 014 slice directly to `main` per memory `feedback_stay_on_main_no_feature_branches` |
| Follow-up packet candidates | **OPTIONAL** | future | §9 |
<!-- /ANCHOR:remediation-status -->

---

<!-- ANCHOR:operational-followups -->
## 6. Operational Follow-Ups (Post-Ship)

### 6.1 MCP Child Restart Procedure

The new `system_code_graph` MCP server is registered in `opencode.json` but the running OpenCode runtime started before this change, so it has not loaded the new server yet. The legacy `spec_kit_memory` child still holds open file descriptors on the stub DB at `system-spec-kit/mcp_server/database/code-graph.sqlite` (confirmed via `lsof` PID 31648 at audit time).

**Step-by-step:**

```bash
# 1. Find current MCP children
ps aux | grep -E "spec-kit-memory-launcher|node.*context-server" | grep -v grep

# 2. Note the spec_kit_memory child PID (was 31648 at audit; may differ now)
SPEC_KIT_PID=<PID from above>

# 3. (Optional) Inspect what files it holds before kill
lsof -p $SPEC_KIT_PID 2>/dev/null | grep code-graph

# 4. Gracefully signal the runtime to restart the MCP servers
#    Option A — full OpenCode runtime restart (simplest):
#       Quit OpenCode (Cmd-Q or close terminal), relaunch
#    Option B — targeted MCP child kill (OpenCode auto-respawns):
kill -TERM $SPEC_KIT_PID
#    Wait 5s; runtime should respawn from opencode.json (which now includes system_code_graph)

# 5. Verify both servers are up after restart
ps aux | grep -E "spec-kit-memory-launcher|system-code-graph-launcher" | grep -v grep
# Expect 2 launcher processes; both should be running

# 6. Verify new MCP tools are registered
#    From a fresh Claude Code / OpenCode session in this repo:
#    Type a turn that should surface MCP tools; check that mcp__system_code_graph__code_graph_*
#    tools appear in the deferred-tools list (ToolSearch "select:mcp__system_code_graph__code_graph_status" should resolve)
```

**Expected after restart:**
- Two launcher processes running (`spec-kit-memory-launcher.cjs` + `system-code-graph-launcher.cjs`)
- `mcp__system_code_graph__*` tools available (10: 6 code_graph_* + 3 ccc_* + detect_changes)
- `mcp__mk_spec_memory__code_graph_*` tools NO LONGER appear (they migrated)
- No process holds open handles on `system-spec-kit/mcp_server/database/code-graph.sqlite{,-wal,-shm}`

### 6.2 Stub DB File Cleanup (after §6.1)

Only after restart confirms no live holders:

```bash
# Verify no holders
lsof 2>/dev/null | grep "system-spec-kit/mcp_server/database/code-graph"
# Expect: 0 lines

# If 0 lines, safe to delete:
rm -f .opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite
rm -f .opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite-wal
rm -f .opencode/skills/system-spec-kit/mcp_server/database/code-graph.sqlite-shm

# Update 007 implementation-summary to flip STUB_DB_DELETED=no → yes if you do this step
```

**If `lsof` still shows a holder after restart:** Something is misconfigured. Inspect:
- `system-code-graph/mcp_server/core/config.ts` `DATABASE_DIR` resolution — should resolve to `system-code-graph/mcp_server/database/`, NOT `system-spec-kit/mcp_server/database/`
- `code-graph-db.ts` import of `DATABASE_DIR` — should be from the new core/config.ts
- New launcher's spawn target — should be `.opencode/skills/system-code-graph/mcp_server/dist/index.js`

### 6.3 Commit + PR

```bash
git status   # ~285 files changed
git diff --stat   # eyeball the scope
git log --oneline -5  # confirm no unexpected commits

# Recommended commit chunking:
#   commit 1: Phase parent + 001-006 packet scaffolds + metadata recalibration
#   commit 2: Standalone MCP infra (launcher, entrypoint, opencode.json, tool-schemas migration)
#   commit 3: File moves (stress_test, plugin bridge, external tests, cat-22 docs)
#   commit 4: Cross-subsystem rewires (handlers, hooks, context-server)
#   commit 5: doctor/update.md path fixes + agent grant updates + skill cross-ref updates
#   commit 6: ADR-002 packet (007) + recalibration of 002 causal_summary
#   commit 7: Deep-review remediation (P0 + P1 + P2)

# Or — single squashed commit if you prefer one PR with a multi-section description.
```
<!-- /ANCHOR:operational-followups -->

---

<!-- ANCHOR:test-plan -->
## 7. Test Plan

### 7.1 Smoke Tests (run immediately after §6.1 restart)

| Test | Command | Pass Criteria |
|------|---------|---------------|
| New launcher boots | `node .opencode/bin/system-code-graph-launcher.cjs --version` (or check `ps`) | Process starts; logs `[system-code-graph-launcher] …` |
| MCP `tools/list` includes 10 code-graph tools | From a fresh session, surface MCP tool list | 10 `code_graph_*` / `ccc_*` / `detect_changes` under `system_code_graph` namespace |
| `code_graph_status` returns valid response | Call `mcp__system_code_graph__code_graph_status({})` | Returns JSON with `readiness`, `nodeCount`, `freshness` fields |
| `detect_changes` works on small diff | `mcp__system_code_graph__detect_changes({diff: "…"})` | Returns symbol impact preview |
| Memory tools still work (no regression on spec_kit_memory) | `mcp__mk_spec_memory__memory_search({query: "test"})` | Returns valid memory hits |
| `session_bootstrap` payload includes graph state | Fresh session start; inspect startup brief | `graphQualitySummary` populated; freshness `live` or `stale` (not `unavailable`) |
| Hook startup brief surfaces graph highlights | Open a new Claude Code session in repo root | Startup payload includes `Highlights:` rows from code-graph |
| `code-graph.sqlite` lives at new location | `ls -la .opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` | 53 MB; recent mtime |

### 7.2 TypeScript + Build (pre-merge)

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# system-spec-kit
cd .opencode/skills/system-spec-kit && npx tsc --noEmit -p mcp_server/tsconfig.json && cd -

# system-code-graph
cd .opencode/skills/system-code-graph && npx tsc --noEmit -p tsconfig.json && cd -

# Both build clean (also produces dist/ that the launchers reference)
cd .opencode/skills/system-spec-kit && npx tsc -p mcp_server/tsconfig.json && cd -
cd .opencode/skills/system-code-graph && npx tsc -p tsconfig.json && cd -
```

**Pass criteria:** both typecheck and build exit 0; no missing module errors.

### 7.3 Vitest Suite (pre-merge)

```bash
# Code-graph internal tests (at new location)
cd .opencode/skills/system-code-graph && npx vitest run --reporter=default 2>&1 | tail -50

# system-spec-kit (post-rewire — handlers/hooks should still pass against new imports)
cd .opencode/skills/system-spec-kit && npx vitest run mcp_server/tests/ --reporter=default 2>&1 | tail -50

# Cross-subsystem stress tests
cd .opencode/skills/system-spec-kit && npx vitest run mcp_server/stress_test/search-quality/w10-degraded-readiness-integration.vitest.ts && cd -
cd .opencode/skills/system-spec-kit && npx vitest run mcp_server/stress_test/session/gate-d-benchmark-session-resume.vitest.ts && cd -
```

**Pass criteria:** baseline pass-count preserved (no regressions); the 2 stress tests we patched (P1-1) should now load and pass.

**Known pre-existing failures to ignore:** any test that was failing before this migration (run on a clean `main` for baseline if uncertain).

### 7.4 Gold-Query Battery (data integrity)

```bash
cd .opencode/skills/system-code-graph && npx vitest run mcp_server/tests/code-graph-verify.vitest.ts --reporter=default
```

**Pass criteria:** all gold queries return expected results against the migrated DB at the new location.

### 7.5 Doctor End-to-End

```bash
# From inside a fresh Claude Code / OpenCode session in this repo:
/doctor code-graph
```

**Pass criteria:**
- Diagnostic resolves the right DB path (`.opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite` per the SUBSYSTEM CONTRACT we corrected)
- Reports current readiness state without error
- (If apply-mode enabled) Can perform a no-op rescan

### 7.6 Plugin Bridge End-to-End

The OpenCode plugin `.opencode/plugins/spec-kit-compact-code-graph.js` loads the bridge at runtime via a `BRIDGE_PATH` resolution. After §6.1 restart:

```bash
# From an OpenCode session in this repo
# Trigger a compaction or session-start event
# Inspect plugin output for "spec-kit-compact-code-graph" mentions
```

**Pass criteria:** plugin loads without "module not found" or "bridge path missing"; compaction event produces expected payload.

### 7.7 Cross-Runtime Hook Validation

Spawn a fresh session in each runtime and verify startup-brief includes code-graph data:

| Runtime | Validation |
|---------|------------|
| Claude Code | SessionStart hook payload includes `graphQualitySummary`, `Highlights:` rows |
| OpenCode | Same; plugin compaction message includes graph state |
| Codex CLI | `freshness-smoke-check` hook runs without error |
| Gemini CLI | session-prime hook surfaces graph state |

**Pass criteria:** all 4 runtimes display code-graph data without `unavailable` / `error` states.

### 7.8 Recursive Strict Validate (pre-merge, after any further edits)

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/013-system-code-graph-extraction \
  --strict --recursive
```

**Pass criteria:** 0 errors, 0 warnings; RESULT: PASSED.

(Already PASSED at handover write-time; re-run after any subsequent edits.)
<!-- /ANCHOR:test-plan -->

---

<!-- ANCHOR:rollback-paths -->
## 8. Rollback Paths

If any post-restart test fails materially:

### 8.1 Quick Reversal (revert one commit / commit-set)

If the migration was committed as one squashed commit or a small commit-set, revert restores the pre-migration state cleanly:

```bash
git revert <commit-sha-range>
# OR
git reset --hard <pre-migration-commit-sha>   # destructive; only on local
```

**Effect:** code-graph code returns to `system-spec-kit/mcp_server/code_graph/` (legacy path); MCP tools re-register under `spec_kit_memory`; live 53 MB DB regenerated on next scan.

### 8.2 Restore Live DB from System-spec-kit Stub (if data loss suspected)

The system-spec-kit stub at `system-spec-kit/mcp_server/database/code-graph.sqlite` is currently only 4 KB (regenerated stub), so it's NOT a viable rollback DB. The live 53 MB index at the new location is the canonical source.

**If the live DB at new location is corrupted:** re-run `code_graph_scan` from a fresh empty DB — full re-index takes ~30-60s on this repo.

### 8.3 Selective Rollback of ADR-002 (revert standalone-MCP topology)

If standalone MCP turns out to be wrong (e.g., performance regression in startup-brief), revert just the 007 topology changes:

1. Remove `system_code_graph` entry from `opencode.json`
2. Restore code-graph tool schemas to `system-spec-kit/mcp_server/tool-schemas.ts` (from git history at the pre-007 commit)
3. Restore code-graph tool dispatch to `system-spec-kit/mcp_server/tools/index.ts:10`
4. Update agent grants to use `mcp__mk_spec_memory__code_graph_*` namespace again
5. Document the revert in a new ADR-003 that supersedes ADR-002

This reverts to ADR-001 Q3 (co-resident) behavior. Files at `system-code-graph/` stay where they are (Q5 sibling imports still work co-resident or standalone).

### 8.4 Selective Rollback of Cat-22 Doc Move (rare)

The 14 doc files moved from `system-spec-kit/feature_catalog/22--*/` and `manual_testing_playbook/22--*/` to `system-code-graph/feature_catalog/01-08/` and `manual_testing_playbook/01-08/`. If the split judgment was wrong on any file:

```bash
git mv .opencode/skills/system-code-graph/feature_catalog/<NN>--<slug>/<file>.md \
       .opencode/skills/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/<file>.md
```

History preserved via `git mv` chain.
<!-- /ANCHOR:rollback-paths -->

---

<!-- ANCHOR:follow-up-packets -->
## 9. Follow-Up Packet Candidates (Optional / Future)

These are NOT blockers for 014's PASS verdict; they're future cleanup or enhancement work that the deep-review surfaced or that came up during execution.

### 9.1 New packet: `014/008-mcp-restart-and-cleanup-verification` (LOW PRIORITY)

**Goal:** verifiable evidence that §6.1 + §6.2 ran cleanly. Captures `lsof` before/after, log output, post-cleanup file listing.

**When to scaffold:** when you actually perform the restart. Keep as a thin Level 1 packet — just record the operational outcome.

### 9.2 New packet: `014/009-system-code-graph-skill-docs` (MEDIUM PRIORITY)

**Goal:** flesh out `system-code-graph/SKILL.md` §2 SMART ROUTING and §5 REFERENCES (currently minimal placeholders from Phase 002 scaffold). Now that all docs migrated in Phase 005, SKILL.md can route correctly between the in-skill catalog/playbook entries.

**Scope:** SKILL.md SMART ROUTING block (cover the 10 MCP tools' intent-signal map), REFERENCES section (link to all 14 moved docs + relevant ADRs), README.md feature-summary update.

### 9.3 New packet: `014/010-deep-review-iteration-2` (LOW PRIORITY)

**Goal:** Once §6.1-§7 complete, re-run deep-review (10-iter cap) to confirm the post-restart state validates and no new findings surface.

**Why low priority:** the current review converged at iter 4 with all material findings remediated. A second pass would mostly confirm stability.

### 9.4 Possible coordination with 015/009 (skill-advisor extraction)

The skill-advisor extraction (`015-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/`) is in_progress with only its 001 ADR shipped. Now that 014 has shipped the standalone-MCP pattern end-to-end, 015/009 can mirror this packet's approach directly. Consider:
- Cross-link 015/009's spec to 014's ADR-002 and 014/001-extraction-design-and-adr/
- Lift the launcher pattern from `.opencode/bin/system-code-graph-launcher.cjs` for `system-skill-advisor-launcher.cjs`
- Apply the same path-flattening lesson (don't keep the inner `skill_advisor/` subdir if not needed)

### 9.5 system-spec-kit `tool-schemas.ts` line-count audit

The migration left a comment marker where 10 schemas were removed. Verify no dead helper functions / unused imports remain. Low risk but a one-grep cleanup pass would be tidy.

### 9.6 Maintainer-mode INDEX env workflow doc

The `SPECKIT_CODE_GRAPH_INDEX_*` flags now default to `"false"`. Maintainers (you) need to opt back in locally. Suggest adding a brief note to the project root README "Maintainer Mode" section explaining how to set these via `.env.local` (per `.opencode/bin/system-code-graph-launcher.cjs` env loading logic).
<!-- /ANCHOR:follow-up-packets -->

---

<!-- ANCHOR:known-risks -->
## 10. Known Risks Not Addressed (Documented for Future)

These risks were surfaced by ADR-001's risk catalog (R1-R6) and ADR-002 mitigations, but their post-migration validation is operational — not testable in the spec-folder review:

| Risk | Status | Mitigation | When to Re-evaluate |
|------|--------|-----------|---------------------|
| **R1 — Startup-brief regression from import rewiring** | mitigation in place; not exhaustively tested | Phase 004 ran full hook test battery; staged rewiring respected | After §6.1 restart, observe 5+ session starts for graph readiness |
| **R2 — Gold-query verifier drift** | tests passing at new location | Battery JSON path resolved at test time | Run §7.4 after any code-graph algorithm change |
| **R3 — Doctor-command path-resolution break** | doctor/update.md SUBSYSTEM CONTRACT + MUTATION BOUNDARIES corrected; not end-to-end tested | YAML uses skill-root variable | Run §7.5 |
| **R4 — Stress-test discovery break** | vitest.config.ts pattern updated | Test discovery covers both old (legacy) and new patterns | Run §7.3 with `--listTests` to inspect coverage |
| **R5 — Plugin bridge ABI risk** | code-graph-specific bridge moved; shared schema kept | `BRIDGE_PATH` import path updated | Run §7.6 |
| **R6 — Live-index migration data-loss risk** | live DB (53 MB) confirmed at new location; stub (4 KB) is regenerated, not original data | Verify node count + gold queries match baseline | Run `code_graph_status` + §7.4 after restart |

**No new risks discovered** during the deep-review.

### Residual operational risks (post-merge)

- **Launcher race conditions on heavy parallel sessions** — the new `system-code-graph-launcher.cjs` mirrors the spec-kit pattern but hasn't been stress-tested under high session-spawn load. If observed, instrument with extra logging.
- **WAL co-existence with concurrent readers** — the live DB uses WAL mode (good for concurrent readers from system-spec-kit handlers AND the standalone MCP server's own queries). If observed deadlocks or stale reads, check `getOpsHardenedGraphState()` behavior under concurrent load.
- **opencode.json drift between maintainers** — the `SPECKIT_CODE_GRAPH_INDEX_*=false` defaults are correct for end-users but maintainers must remember to set `=true` locally. Consider adding a check script that warns if env defaults look like end-user mode while repo state looks like maintainer mode.
<!-- /ANCHOR:known-risks -->

---

<!-- ANCHOR:validation-checklist -->
## 11. Validation Checklist (this handover)

- [x] All in-progress work committed conceptually (handover + 007 implementation-summary reconciled to current truth)
- [x] Current context saved in `_memory.continuity` (this handover + each child packet's implementation-summary.md)
- [x] No breaking changes left mid-implementation (typecheck 0 both skills; full system-code-graph vitest 395/0/9; sibling 014-touching vitest 74/0/0; recursive strict 0E/0W)
- [x] Tests passing baseline established truthfully (see §3 + §5 closed rows; pre-existing sibling failures in skill-advisor 015-in-progress tests are NOT part of 014's scope)
- [x] This handover document is complete
- [ ] MCP children restarted (post-handover; §6.1 — required for the new `system_code_graph` entry to load)
- [x] Stub DB files removed (verified absent via `ls`)
- [x] Pre-merge test plan executed for 014-scoped surfaces (§7.3 + §7.4 + §7.8); post-restart in-environment tests (§7.1, §7.5, §7.6, §7.7) deferred to user session
- [ ] Commit + PR opened (commit pending in this session; no PR — direct to `main` per memory rule)
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 12. Session Notes

### Tools used (timeline)
- **Phase 1-6**: cli-codex `gpt-5.5 high fast` (4 dispatches, mechanical work)
- **Deep-research (014/001)**: cli-opencode + `deepseek/deepseek-v4-pro`, 10-iter cap → converged iter-3, produced ADR-001 + resource-map
- **Recalibration + 007**: cli-codex `gpt-5.5 xhigh fast` (1 dispatch, comprehensive — ADR-002 + standalone MCP + opencode.json + tool migration + agent grants)
- **Deep-review (014)**: cli-opencode + `deepseek/deepseek-v4-pro`, 10-iter cap → converged iter-4, CONDITIONAL verdict, 4 findings
- **Remediation**: direct Edit calls (small targeted fixes — P0/P1/P2)

### Lessons captured

| Lesson | Memory entry |
|--------|--------------|
| `codex exec --model` rejects `gpt-5.5-codex`; use `gpt-5.5` | `feedback_codex_cli_fast_mode` |
| `opencode run --model` rejects `deepseek-v4-pro`; use `deepseek/deepseek-v4-pro` | (new — recommend memory save) |
| User reorgs can flatten paths during migrations; always re-verify import paths post-reorg | (new — recommend memory save) |
| cli-codex sometimes claims operations succeeded that failed silently (e.g., `STUB_DB_DELETED=yes` when `lsof` blocked deletion); deep-review catches these | (new — recommend memory save) |
| Deep-research convergence often happens well before max-iterations (3 of 10 for research, 4 of 10 for review) — workflow's `all_questions_answered` stop is the desired outcome | (existing pattern documented in deep-research SKILL.md) |

### Non-obvious decisions

- **Why ADR-002 only supersedes Q3, not Q1/Q2/Q4-Q8**: Q3 was the only decision the user flipped. Other Q's (touchpoint inventory, DB shape, tool-id stability, import direction, plugin bridge, phase decomposition, risk catalog) were all confirmed by the migration's execution and remain in force. Granular supersession preserves design integrity.

- **Why the stub DB wasn't force-deleted**: the running spec_kit_memory MCP child still holds open file descriptors. `rm` would unlink the file (it disappears from listings) but the child keeps writing to the now-orphaned inode until restart — wasted I/O and confusing post-mortem state. Better to wait for natural restart.

- **Why category-22 docs were split 6+8 / 27+22**: codex's per-file judgment correctly distinguished code-graph internals (move) from shared context/hook docs (stay). The split is conservative — most cat-22 content is shared infrastructure that memory + advisor + code-graph all consume, not code-graph-exclusive.
<!-- /ANCHOR:session-notes -->

---

## Related Documents

| Document | Path |
|----------|------|
| Phase parent spec | `spec.md` (this folder) |
| ADR-001 (Q1, Q2, Q4-Q8) | `001-extraction-design-and-adr/decision-record.md` |
| ADR-002 (Q3 supersession) | `007-mcp-topology-pivot/decision-record.md` |
| Resource map (280+ touchpoints) | `001-extraction-design-and-adr/resource-map.md` |
| Research synthesis | `001-extraction-design-and-adr/research/research.md` |
| Deep-review report | `review/review-report.md` |
| Per-phase implementation summaries | `001-007/*/implementation-summary.md` |
| Plan file (this session, historical) | `/Users/michelkerkmeester/.claude/plans/analyze-the-code-graph-synchronous-adleman.md` |
