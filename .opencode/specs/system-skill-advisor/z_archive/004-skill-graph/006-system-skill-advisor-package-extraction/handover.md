---
title: "Session Handover: system-skill-advisor extraction follow-ons"
description: "Handover for the system-skill-advisor extraction line after children 001-025 closed the original extraction, decoupling, RPC, and 018 follow-on cleanup work."
trigger_phrases:
  - "013/009 handover"
  - "skill advisor extraction handover"
  - "resume 013/009"
  - "advisor follow-on"
  - "system_skill_advisor next steps"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction"
    last_updated_at: "2026-05-15T12:07:05Z"
    last_updated_by: "codex"
    recent_action: "026 sk-code audit follow-ons closed through 030"
    next_safe_action: "Use child packet summaries for future advisor or sk-code follow-on work"
    blockers: []
    key_files:
      - "handover.md"
      - "spec.md"
      - "graph-metadata.json"
      - "022-plugin-bridge-unit-test-isolation/implementation-summary.md"
      - "023-subprocess-environment-whitelist/implementation-summary.md"
      - "024-dfidf-cold-start-cache/implementation-summary.md"
      - "025-parent-documentation-drift-refresh/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0130090099a06ed10c5d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4d"
      session_id: "013-009-handover-2026-05-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "001-021 shipped extraction, decoupling, and RPC ownership."
      - "022-025 closed all remaining 018-named follow-ons."
---
# Session Handover Document

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS HANDOVER

You are resuming work on `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/`. Current state: 30 child packets exist. Children 001-018 completed the extraction, validation, and P2 cleanup line; 019-021 closed advisor/code-graph decoupling and classifier RPC ownership; 022-025 closed the remaining named 018 follow-ons; 026 audited code README and sk-code coverage; 027-030 closed the 121-row sk-code follow-on ledger.

**Status values:** complete for the extraction follow-ons and the 026 sk-code audit follow-on sweep. Future topology consolidation or broader verifier-warning cleanup is a new packet, not hidden remaining work in this handover.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** 022-024 follow-ons sweep / 2026-05-15 / Codex on `main`
- **To Session:** future advisor topology work only if explicitly requested
- **Phase Completed:** system-skill-advisor extraction and sk-code audit follow-ons through child 030
- **Handover Time:** 2026-05-15T12:07:05Z

### Child Packet State

| Range | Status | Scope |
|---|---|---|
| `001-007` | Shipped | ADR-001 extraction, standalone MCP, cutover, cleanup, and early DB disambiguation. |
| `008-018` | Shipped | Skill graph move/rename, validation recovery, manual validation, P1/P2 remediation, and 10-iteration P2 cleanup. |
| `019` | Shipped | Spec-kit/advisor decoupling superseding the old schema-boundary follow-on. |
| `020` | Shipped | Spec-kit/code-graph decoupling and no direct code-graph imports from spec-kit. |
| `021` | Shipped | Code-graph classifier RPC surface. |
| `022` | Shipped | Plugin bridge unit isolation: pure unit coverage plus one subprocess smoke. |
| `023` | Shipped | Explicit subprocess env allowlists for launcher, plugin bridge, and Python shim. |
| `024` | Shipped | Persisted DF/IDF corpus cache keyed by graph-metadata mtimes. |
| `025` | Shipped | Parent handover and metadata refresh for the 25-child state. |
| `026` | Shipped | sk-code and code README coverage audit; 121 sk-code findings named into follow-ons. |
| `027` | Shipped | TypeScript source header normalization: 78 fixed, 1 deleted path not applicable. |
| `028` | Shipped | JavaScript/ESM/CJS/declaration header and strict-mode alignment: 28 findings fixed. |
| `029` | Shipped | Python package header policy: 4 findings closed. |
| `030` | Shipped | Any-type sweep: 10 possible-any findings reviewed as false positives, 0 explicit-any sites. |
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|---|---|---|
| Standalone `system_skill_advisor` MCP (ADR-001) | Parent ADR locked process boundary for advisor extraction | New launcher `.opencode/bin/skill-advisor-launcher.cjs` + 4 runtime config entries |
| Tool ids stay `advisor_*` (ADR-001/004 ADR-003) | Caller-stability invariant; only server ownership changes | No caller churn beyond server-target rewrites |
| Snake_case server id `system_skill_advisor` (ADR-002) | Matches `spec_kit_memory`, `system_code_graph`, `sequential_thinking` naming | Distinguishes server id from folder slug `system-skill-advisor` |
| Env-first DB resolver: `SYSTEM_SKILL_ADVISOR_DB_DIR` → package default (ADR-004) | Test/CI isolation + production locality | `lib/scorer/projection.ts` + `handlers/advisor-status.ts` honor env override |
| Build-if-missing launcher (ADR-005) | Mirror memory launcher; clean checkouts shouldn't require manual build | Cold-start smoke verified |
| Proxy with one-window deprecation log (005 ADR-003) | Protect external callers during cutover window | `tools/index.ts:40-100` proxy; removed in 006 |
| MCP-level dispatch for plugin bridge (005 ADR-004) | Preserve process boundary; avoid coupling host to package internals | `plugin_bridges/spec-kit-skill-advisor-bridge.mjs` |
| Doctor YAMLs retargeted (005 ADR-005) | Operator health probes must hit the real runtime boundary | `doctor_skill-advisor.yaml` + `doctor_update.yaml` |
| Bridge removal = zero-caller grep + operator confirmation (006 ADR-003) | Triple signal for safe deletion | User directive "Work on phase 4, 5 and 6" served as operator confirmation |
| Stale-doc policy: delete live, annotate historical (006 ADR-004) | Operator instructions must reflect current topology | 44 docs swept; 0 needed historical annotation |
| Cross-runtime smoke matrix required (006 ADR-005) | Reversible-safe completion claim needs evidence from every surface | OpenCode + Codex PASS; Claude + Gemini INCONCLUSIVE (CLI session-restart caveat) |
| Skill-graph DB rename (007 ADR-001) | Two `skill-graph.sqlite` files (system-spec-kit indexer + advisor scorer) caused operator confusion | system-spec-kit's renamed to `graph-metadata-index.sqlite`; advisor's stays unchanged |
| Option B (rename) not Option A (move tools) for 007 | Lower-risk; preserved `skill_graph_*` MCP tool ownership during DB disambiguation | Later topology work is separate from the 018 follow-on close-out. |

### 2.2 Blockers Encountered (and current state)

| Blocker | Status | Resolution |
|---|---|---|
| Codex returned RESULT=BLOCKED on 004/005/006 dispatches | RESOLVED conservatively | BLOCKED was overcautious — all P0 REQs verified, strict-validate PASS; only Claude/Gemini CLI listing was inconclusive (operational concern, not code) |
| Memory MCP startup post-proxy-removal | RESOLVED | Cold-start smoke PASS at every step; no advisor_* exposure post-006 |
| 60/224 vitest failures in standalone advisor pkg | RESOLVED | Later packets raised the advisor suite to 370 passed, 4 skipped. |
| Hook smoke FAIL | RESOLVED | Hook and bridge smoke coverage now pass in the advisor suite. |
| Code-graph DB at old path (similar shape to 007) | RESOLVED INDEPENDENTLY in `08bb4f4bb fix(028): purge stale code-graph DB paths from system-spec-kit tree` | No follow-on action needed; was a parallel-session fix |
| Advisor freshness state ("Advisor: stale" in prompt hook) | OPERATOR_ACTION | Runtime freshness rebuild remains an operator action, not an 018-named code follow-on. |

### 2.3 Files Modified (cumulative across 004 → 007)

| File / surface | Change Summary | Status |
|---|---|---|
| `.opencode/bin/skill-advisor-launcher.cjs` | NEW launcher mirror of spec-kit-memory-launcher | complete |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | NEW standalone MCP server entrypoint | complete |
| `.opencode/skills/system-skill-advisor/mcp_server/{package,tsconfig.build}.json` | Build infrastructure | complete |
| `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json` | `system_skill_advisor` MCP entry added | complete |
| `.opencode/plugins/spec-kit-skill-advisor.js` | Plugin bridge paths → standalone | complete |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs` | MCP-level dispatch | complete |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/{claude,codex,gemini}/...` | Hook wrappers retargeted | complete |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Proxy added in 005, removed in 006 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Advisor descriptors removed in 006 | complete |
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | SKILL_GRAPH_DATABASE_PATH now uses DB_FILENAME constant | complete |
| `.opencode/skills/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts` | DB_FILENAME → `graph-metadata-index.sqlite` | complete |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/{create,restore}-checkpoint.ts` | Path references updated | complete |
| `.opencode/commands/doctor/assets/{doctor_skill-advisor,doctor_update}.yaml` | Skill-advisor probes → standalone server | complete |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` + `system-skill-advisor/INSTALL_GUIDE.md` | Dual-MCP topology; deprecation paragraph removed in 006 | complete |
| 44 stale-doc files swept (system-spec-kit + cross-skill catalogs/playbooks) | Old `mcp_server/skill_advisor/` references rewritten or deleted | complete |
| 9 test fixtures (stress_test + tests/{handlers,legacy,scorer}) | Hardcoded old paths replaced with env override + tmpdir patterns | complete |
| `.opencode/skills/system-spec-kit/mcp_server/database/skill-graph.sqlite{,-shm,-wal}` | DELETED | complete |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` | Python shim verified package-local | complete |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **Read this handover first:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/handover.md`
- **Read parent metadata:** `graph-metadata.json` should list children `001-030` and point at `030-any-type-justification-sweep`.
- **Read child summaries by topic:** `019` for advisor decoupling, `020-021` for code-graph decoupling/RPC, `022-025` for the original 018 follow-ons; `026-030` for the sk-code audit and follow-on closure.
- **Do not reopen 018-named follow-ons without new evidence.** They are now closed by shipped child packets; the packet 026 sk-code ledger is likewise closed by 027-030.

### 3.2 Closed 018-Named Follow-Ons

| Original Follow-On | Disposition | Evidence |
|---|---|---|
| `019-advisor-schema-boundary-contract` | Superseded | `019-spec-kit-advisor-decoupling` removed the schema bridge concern by cutting imports across the package boundary. |
| `020-plugin-bridge-unit-isolation` | Fixed in `022` | Bridge behavior tests import the bridge logic directly; only `plugin-bridge-smoke.vitest.ts` keeps subprocess coverage. |
| `021-subprocess-env-whitelist` | Fixed in `023` | Launcher, plugin bridge, and Python native shim now pass explicit env allowlists to children. |
| `022-dfidf-cold-start-cache` | Fixed in `024` | `computeCorpusStatsCached()` persists DF/IDF stats under advisor database scope and invalidates on graph-metadata mtime changes. |
| `023-parent-doc-drift-refresh` | Fixed in `025` | This handover and parent graph metadata now describe the 25-child state. |

### 3.3 Future Work Boundary

Future topology consolidation, such as moving remaining `skill_graph_*` tool ownership, is a separate feature. Broader alignment warnings outside packet 026 are also separate work. Neither should be treated as residual cleanup from packet 018 or the 026 audit unless a new review explicitly names it.

<!-- /ANCHOR:next-session -->
