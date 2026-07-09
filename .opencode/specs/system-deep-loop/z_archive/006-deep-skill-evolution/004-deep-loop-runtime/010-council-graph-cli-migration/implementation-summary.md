---
title: "Implementation Summary: 010 — Council Graph CLI Migration"
description: "Implementation summary for the completed council graph MCP-to-CLI migration."
trigger_phrases:
  - "council graph CLI migration"
  - "council_graph_ MCP removal"
  - "deep-loop-runtime council loopType"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/004-deep-loop-runtime/010-council-graph-cli-migration"
    last_updated_at: "2026-05-24T09:35:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Remediated native review findings and revalidated council matrix"
    next_safe_action: "Complete; none unless follow-up cleanup is requested"
    blockers: []
    completion_pct: 100
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:1310030100000000000000000000000000000000000000000000000000000006"
      session_id: "131-003-010-council-cli-scaffold"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
# Implementation Summary: 010 — Council Graph CLI Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> **Status**: Complete. Phase 1 DB/query library port, Phase 2 CLI script wiring, Phase 4 consumer rewire, Phase 3 MCP deletion, and Phase 5 test/mirror cleanup are complete.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `010-council-graph-cli-migration` |
| **Status** | Complete |
| **Level** | 3 |
| **Completion** | 100% |
| **Recent Action** | Remediated native review findings and revalidated council matrix |
| **Next Safe Action** | Complete; none unless follow-up cleanup is requested |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 1 moved the council graph persistence and prompt-safe query helpers into `deep-loop-runtime/lib/council/`. Phase 2 extended the runtime CLI scripts so `loopType=council` now uses those modules directly. Phase 4 rewired `deep-ai-council` replay and live graph references to the runtime CLI path before MCP deletion. Phase 3 removed the old council graph MCP handlers, schemas, dispatcher registration, and live inventory-test expectations. Phase 5 migrated the remaining executable council graph coverage, removed obsolete MCP-owned council graph leftovers, updated tool-count mirrors, and closed the packet.

| File | Change |
|------|--------|
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-db.ts` | Added runtime-owned SQLite projection with council taxonomy, artifact provenance fields, WAL/foreign-key setup, weight clamping, batch upsert, stats, snapshots, and namespace cleanup helpers. |
| `.opencode/skills/deep-loop-runtime/lib/council/council-graph-query.ts` | Added prompt-safe query helpers for unresolved disagreements, decision support, evidence chains, convergence blockers, hot nodes, confidence, and criticality checks. |
| `.opencode/skills/deep-loop-runtime/lib/council/convergence.cjs` | Ported council-specific convergence thresholds, signal math, blockers, trace generation, and JSON bridge payload helpers. |
| `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs` | Added `--loop-type council`, council node/edge normalization, artifact provenance handling, and explicit empty-upsert no-op success. |
| `.opencode/skills/deep-loop-runtime/scripts/query.cjs` | Routed council query types to prompt-safe council query helpers and included `sourceOfTruth: "derived_from_ai_council_artifacts"`. |
| `.opencode/skills/deep-loop-runtime/scripts/status.cjs` | Added council readiness, recovery payload, counts, schema version, DB file size, and populated-graph signals. |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Added council convergence dispatch and JSON bridge output fields. |
| `.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts` | Extended test helper typing and cleanup to support `loopType: "council"`. |
| `.opencode/skills/deep-loop-runtime/tests/unit/council-graph-query.vitest.ts` | Added unit coverage for taxonomy validation, DB path lifecycle, weight clamping, namespace isolation, prompt-safe provenance/metadata, and namespace cleanup. |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` | Added script-level integration coverage for council upsert, query, status, convergence, and exit-code contracts. |
| `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` | Migrated DAC-027 through DAC-032 value scenarios to runtime CLI coverage. |
| `.opencode/skills/deep-loop-runtime/tests/fixtures/council-value/` | Moved council value fixture data and helpers; helper semantics now use `runtimeCalls` and `runScript() --loop-type council`. |
| `.opencode/skills/deep-loop-runtime/tests/council-graph-value-report.json` | Kept as the explicit opt-in DAC metrics report target; normal value scenario tests now write metrics to a temp path unless `COUNCIL_VALUE_REPORT_PATH` is set. |
| `.opencode/skills/deep-loop-runtime/lib/council/README.md` | Documented the new council graph modules and unit test. |
| `.opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs` | Rewired replay to call `deep-loop-runtime/scripts/upsert.cjs --loop-type council` by default while preserving `--dry-run` JSON payload output. |
| `.opencode/skills/deep-ai-council/scripts/tests/replay-graph-from-artifacts.vitest.ts` | Added coverage for dry-run payload output, default runtime graph writes, missing state, and child failure propagation. |
| `.opencode/skills/deep-ai-council/references/graph_support.md` | Updated graph ownership, recovery, and replay guidance from MCP tool surface to runtime CLI surface. |
| `.opencode/skills/deep-ai-council/SKILL.md` and `README.md` | Updated live skill docs to describe the graph as a `deep-loop-runtime` CLI projection. |
| `.opencode/skills/deep-ai-council/feature_catalog/**` and `manual_testing_playbook/**` | Updated live graph entries from council MCP calls to runtime CLI derived projection and dry-run replay guidance. |
| `.opencode/commands/deep/ask-ai-council.md` and `deep_ask-ai-council_{auto,confirm}.yaml` | Added graph boundary/runtime path references, corrected live YAML filenames, and replaced scaffold-era activation wording while leaving memory MCP notes intact. |
| `.opencode/agents/ai-council.md`, `.claude/agents/ai-council.md`, `.gemini/agents/ai-council.md` | Updated agent mirrors so graph updates belong to caller-owned runtime CLI reducers. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/{upsert,query,status,convergence}.ts` | Deleted the obsolete council graph MCP handlers after the runtime CLI consumer path was live. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/README.md` | Deleted the orphaned handler README after MCP handler removal. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/` | Deleted the obsolete MCP-owned council graph DB/query source after runtime migration. |
| `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` | Removed the four `council_graph_*` tool definitions from the exported MCP tool registry. |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` | Removed council graph Zod schemas, schema-map rows, and allowed-parameter rows. |
| `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts` | Removed council graph handler imports, dispatcher object, switch cases, and the council-only validation set. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Updated live tool inventory expectations from 39 tools to 35 and removed council graph dispatch/layer expectations. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts` | Removed the `L9:CouncilGraph` special case now that council graph is no longer a live MCP layer. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts` | Updated the remaining live tool-count assertion from 43 to 35 after focused schema tests exposed the stale expectation. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph*.vitest.ts`, `tests/fixtures/council-value/`, and `tests/council-graph-value-report.json` | Deleted obsolete MCP-owned council graph tests/fixtures after migrated runtime coverage passed. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/**/council-graph*`, `dist/**/council-value*`, and `database/council-graph.sqlite*` | Removed stale ignored generated artifacts and old derived MCP council graph SQLite files after `npm run build` left deleted-source outputs behind. |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Updated `test:council` to target runtime council CLI tests, the live skill-advisor scorer path, and the 35-tool package description. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/council-playbook-anchor-integrity.vitest.ts` and `council-helpers-smoke.vitest.ts` | Updated helper/playbook tests for deep-ai-council paths and runtime CLI replay dry-run behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/multi-ai-council-*.vitest.ts` and `scripts/tests/multi-ai-council-*.vitest.ts` | Updated stale `sk-ai-council` paths to the live `deep-ai-council` helper locations. |
| `opencode.json` | Updated mk-spec-memory inventory to 35 tools and removed council graph from the MCP family list. |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json` | Reconciled packet status, completion metadata, and final evidence to 100%. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase 1 was delivered as a narrow library port. The new DB module follows the existing `coverage-graph` runtime pattern: TypeScript ESM loaded through the runtime script TSX bridge, `better-sqlite3` imported from the installed system-spec-kit dependency, and SQLite storage under `.opencode/skills/deep-loop-runtime/database/`.

The port deliberately keeps the council graph separate from `coverage-graph`: council uses no `loop_type` discriminator inside its tables because the database is council-specific, while namespace isolation remains keyed by `specFolder` and `sessionId`.

Phase 2 kept the four script entry points as thin bridges. `upsert.cjs`, `query.cjs`, `status.cjs`, and `convergence.cjs` now branch on `loopType=council`, import the council DB/query/convergence modules, and preserve the existing JSON/exit-code contract. Research and review branches still use the existing coverage graph implementation.

Phase 4 changed only the consumer boundary. `deep-ai-council` still treats packet-local `ai-council/**` artifacts as authoritative, but replay now writes derived graph rows by spawning the runtime upsert script. `--dry-run` remains the non-mutating payload inspection mode.

Phase 3 then deleted the old MCP tool surface. `ListToolsRequestSchema` still returns `TOOL_DEFINITIONS`, and that registry now imports at 35 tools with no `council_graph_*` entries. The remaining tool modules keep their existing in-module validation; `tools/index.ts` no longer carries a council-only schema-validation branch.

Phase 5 completed the migration boundary. The old MCP handler tests and value fixtures moved to runtime CLI integration tests, `system-spec-kit` no longer contains executable council graph source/tests/fixtures, and `opencode.json` now matches the 35-tool MCP surface.

Native-review remediation then closed the follow-up findings: command YAML references now resolve, council prompt-safe query output preserves `contentHash`, writer lock acquisition retries transient contention, DAC value reports are hermetic by default, and the council validation matrix targets live paths.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use runtime-owned SQLite for the council graph projection | Subprocess CLI calls need coordinated, indexed state; packet JSONL remains source-of-truth but is not the best derived index. |
| Place convergence math in `deep-loop-runtime/lib/council/convergence.cjs` | Council thresholds and blockers are domain-specific and should not be mixed into a generic switchboard yet. |
| Rewire consumers before deleting MCP tools | It avoids an unnecessary break window and gives the operator a cleaner rollback path. |
| Migrate tests to CLI integration coverage | The CLI becomes the supported contract after MCP removal. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted council graph unit test | PASS — `node_modules/.bin/vitest run --no-coverage /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/unit/council-graph-query.vitest.ts` (5 tests passed) |
| Council script integration test | PASS — `node_modules/.bin/vitest run --no-coverage /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` (7 tests passed) |
| Runtime script regression suite | PASS — targeted combined Vitest run for council unit/integration plus existing upsert/query/status/convergence integration tests (6 files, 35 tests passed) |
| Pre-implementation inventory | PASS — runtime scripts present, council MCP handlers still total 558 LOC, and live deep-ai-council command/YAML paths exist |
| OpenCode alignment drift | PASS — `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/deep-loop-runtime/lib/council` |
| Runtime storage ownership grep | PASS — `rg -n "core/config" .opencode/skills/deep-loop-runtime/lib/council .opencode/skills/deep-loop-runtime/scripts/{upsert,query,status,convergence}.cjs` returned no hits |
| OpenCode alignment drift after Phase 2 | PASS — `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/deep-loop-runtime` scanned 59 files with 0 findings |
| Devin SWE-1.6 read-only review | PASS — `devin --prompt-file /tmp/devin-phase2-council-review.md --model swe-1.6 --permission-mode auto -p --respect-workspace-trust` reported no blocker findings |
| Deep AI Council replay helper | PASS — `.opencode/skills/system-spec-kit/mcp_server/node_modules/.bin/vitest run --no-coverage --config /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/vitest.config.ts --root .opencode/skills/deep-ai-council scripts/tests/replay-graph-from-artifacts.vitest.ts` (17 tests passed) |
| Council runtime integration after rewire | PASS — `.opencode/skills/system-spec-kit/mcp_server/node_modules/.bin/vitest run --no-coverage --config .opencode/skills/system-spec-kit/mcp_server/vitest.config.ts ../deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` (7 tests passed) |
| Deep AI Council alignment drift | PASS — `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/deep-ai-council` scanned 20 files with 0 findings |
| Live deep-ai-council graph wording | PASS — targeted live-doc/script/command/agent `rg` returned no `council_graph_`, `MCP projection`, or `MCP tool surface` hits; remaining 251 hits are changelog/manual playbook/feature catalog history or Phase 5 migration material |
| Phase 3 live MCP source grep | PASS — `rg -n "council_graph_\|CouncilGraph\|councilGraph" mcp_server/tools/index.ts mcp_server/tool-schemas.ts mcp_server/schemas/tool-input-schemas.ts mcp_server/tests/context-server.vitest.ts mcp_server/tests/layer-definitions.vitest.ts` returned no hits |
| Phase 3 tool registry import | PASS — `node --import ./scripts/node_modules/tsx/dist/loader.mjs` imported `TOOL_DEFINITIONS` and returned `{ "count": 35, "council": [] }` |
| Phase 3 MCP inventory tests | PASS — `mcp_server/node_modules/.bin/vitest run --no-coverage --config mcp_server/vitest.config.ts mcp_server/tests/context-server.vitest.ts mcp_server/tests/layer-definitions.vitest.ts` passed 2 files / 412 tests |
| Phase 3 schema/count tests | PASS — `mcp_server/node_modules/.bin/vitest run --no-coverage --config mcp_server/vitest.config.ts mcp_server/tests/tool-input-schema.vitest.ts mcp_server/tests/review-fixes.vitest.ts` passed 2 files / 67 tests after updating the stale `review-fixes.vitest.ts` count from 43 to 35 |
| Native-review runtime remediation | PASS — targeted Vitest run passed council query unit, council script integration, DAC value coverage, and existing research/review `upsert`, `query`, `status`, and `convergence` suites under default parallelism (6 files / 38 tests) |
| Native-review DAC report hermeticity | PASS — DAC value scenarios passed 6/6 and `git status` showed no tracked report mutation afterward |
| Phase 5 migrated council package matrix | PASS — repaired `npm run test:council` passed 9 files / 34 tests after path, replay dry-run compatibility, and live skill-advisor path updates |
| Phase 5 full council matrix | PASS — `npm run test:council:full` passed Vitest, `sk-doc` quick validation for `deep-ai-council`, and strict validation for packet 010 |
| MCP server build | PASS — `npm run build` completed successfully; stale generated council graph artifacts from deleted TS sources were then removed because the TypeScript build does not clean removed outputs |
| Deep AI Council replay helper after runtime rewire | PASS — replay helper Vitest passed 17 tests, covering dry-run payload output, default runtime upsert, missing state, and child failure propagation |
| Phase 5 live MCP inventory grep | PASS — targeted `rg` over `system-spec-kit/mcp_server` and `opencode.json` returned no live `council_graph_` inventory hits |
| Phase 5 generated/runtime council leftovers grep | PASS — targeted `rg`/`find` over `mcp_server/dist` and `mcp_server/database` returned no `council-graph`, `council_graph_`, `CouncilGraph`, `councilGraph`, or `council-value` leftovers |
| Phase 5 live doc stale-wording grep | PASS — targeted `rg` over deep-ai-council playbook/catalog, command assets, agent mirrors, `opencode.json`, and package metadata returned no stale graph-surface hits |
| Phase 5 OpenCode alignment drift — deep-loop-runtime | PASS — scanned 69 files with 0 findings |
| Phase 5 OpenCode alignment drift — deep-ai-council | PASS — scanned 22 files with 0 findings |
| Phase 5 OpenCode alignment drift — system-spec-kit | PASS — scanned 1469 files with 0 findings, 0 errors, and 0 warnings after native-review remediation |
| System-spec-kit alignment drift after Phase 3 | PASS — `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit` exited 0 with 0 findings, 0 errors, and 0 warnings |
| Phase 3 `mcp tools list` equivalent | PARTIAL — no standalone `mcp` binary is available in this shell; `TOOL_DEFINITIONS` is the source returned by `ListToolsRequestSchema` and shows 35 tools with no council IDs |
| Static TypeScript CLI | BLOCKED — local `node_modules/.bin/tsc` symlink exists in `mcp_server` but its `node_modules/typescript/bin/tsc` target is missing |
| CocoIndex semantic search | BLOCKED — daemon search required home lock access, then hung without output and was terminated |
| `validate.sh --strict` | PASS — final strict packet validation returned 0 errors and 0 warnings after Phase 5 doc updates |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No standalone `mcp` CLI in this shell.** The migration verified the same source list used by the MCP `ListToolsRequestSchema` response instead.
<!-- /ANCHOR:limitations -->

---

## Continuation Prompt

Packet complete. No next safe action is required unless a follow-up cleanup is requested.
