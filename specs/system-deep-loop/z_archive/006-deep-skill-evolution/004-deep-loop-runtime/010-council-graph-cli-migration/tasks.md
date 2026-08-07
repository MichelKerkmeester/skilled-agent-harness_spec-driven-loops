---
title: "Tasks: 010 — Council Graph CLI Migration"
description: "Granular task checklist for porting council graph persistence/query/convergence into deep-loop-runtime CLI scripts, deleting MCP tools, rewiring deep-ai-council, and migrating tests."
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
      fingerprint: "sha256:1310030100000000000000000000000000000000000000000000000000000003"
      session_id: "131-003-010-council-cli-scaffold"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
# Tasks: 010 — Council Graph CLI Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Migration Phase 1: Port Council DB + Query Lib

- [x] T001 Read `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-db.ts` and identify all exports, schema constants, and DB lifecycle hooks [20m]
  - Evidence: source read before port; exports/taxonomy/lifecycle mirrored in `deep-loop-runtime/lib/council/council-graph-db.ts`.
- [x] T002 Read `.opencode/skills/system-spec-kit/mcp_server/lib/council-graph/council-graph-query.ts` and identify prompt-safe query exports [20m]
  - Evidence: source read before port; prompt-safe query helpers mirrored in `deep-loop-runtime/lib/council/council-graph-query.ts`.
- [x] T003 Read `.opencode/skills/deep-loop-runtime/lib/council/README.md` and existing council `.cjs` files to match local module style [15m]
  - Evidence: `lib/council/README.md` updated to list the new graph modules beside existing council primitives.
- [x] T004 Create or port council graph DB module under `.opencode/skills/deep-loop-runtime/lib/council/` with a runtime-owned storage path [60m] {deps: T001, T003}
  - Evidence: `council-graph-db.ts` added with `COUNCIL_GRAPH_STORAGE_DIR` under `deep-loop-runtime/database`.
- [x] T005 Port query helpers under `.opencode/skills/deep-loop-runtime/lib/council/`, preserving metadata allowlist and truncation behavior [45m] {deps: T002, T004}
  - Evidence: `council-graph-query.ts` added; unit test verifies allowlisted metadata and 80-character string truncation.
- [x] T006 Add DB cleanup/open helpers suitable for runtime tests, mirroring existing `coverage-graph` test cleanup patterns [30m] {deps: T004}
  - Evidence: `initDb(dbDir)`, `closeDb()`, `getDbPath()`, and `cleanupNamespace()` added and exercised by tests.
- [x] T007 Add unit tests for taxonomy validation, weight clamping, namespace isolation, and prompt-safe metadata [60m] {deps: T004, T005}
  - Evidence: `node_modules/.bin/vitest run --no-coverage .../deep-loop-runtime/tests/unit/council-graph-query.vitest.ts` passed 5/5 tests.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Migration Phase 2: Add `loopType=council` to Four CLI Scripts

- [x] T008 Edit `.opencode/skills/deep-loop-runtime/scripts/upsert.cjs:107-109` to accept `council` in loop-type validation [15m] {deps: T004}
  - Evidence: `upsert.cjs` now accepts `--loop-type council`; `council-graph-script.vitest.ts` verifies empty no-op and populated council upserts.
- [x] T009 Add council branch in `upsert.cjs:137-191` so node/edge normalization uses council `VALID_KINDS`, `VALID_RELATIONS`, `artifactPath`, `contentHash`, and `roundId` [60m] {deps: T008}
  - Evidence: council branch normalizes nodes/edges to `council-graph-db.ts` and preserves artifact provenance fields; integration test verifies artifact path propagation.
- [x] T010 Edit `.opencode/skills/deep-loop-runtime/scripts/query.cjs:93-111` to accept council and dispatch council query modes [60m] {deps: T005}
  - Evidence: `query.cjs` supports `unresolved_disagreements`, `evidence_chain`, `decision_support`, `convergence_blockers`, and `hot_nodes` with `sourceOfTruth: "derived_from_ai_council_artifacts"`.
- [x] T011 Edit `.opencode/skills/deep-loop-runtime/scripts/status.cjs:92-106` to accept council and return council readiness/recovery/signals [45m] {deps: T004, T005}
  - Evidence: `status.cjs` returns council readiness, recovery payload, counts, schema version, DB file size, and signals; tests cover empty and ready states.
- [x] T012 Port `mcp_server/handlers/council-graph/convergence.ts` into `.opencode/skills/deep-loop-runtime/lib/council/convergence.cjs` [90m] {deps: T005}
  - Evidence: `lib/council/convergence.cjs` exports `computeCouncilSignals()` and preserves thresholds, blockers, trace, and stop decisions.
- [x] T013 Edit `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs:263-350` to dispatch council convergence via the new library [60m] {deps: T012}
  - Evidence: `convergence.cjs` dispatches council namespaces to the council convergence library and emits JSON bridge fields.
- [x] T014 Add script integration tests for `upsert/query/status/convergence --loop-type council` success and input-validation failures [90m] {deps: T008-T013}
  - Evidence: `node_modules/.bin/vitest run --no-coverage .../tests/integration/council-graph-script.vitest.ts` passed 7/7 tests.
- [x] T015 Run existing research/review script integration tests to prove no branch regression [30m] {deps: T014}
  - Evidence: targeted combined Vitest run passed `upsert`, `query`, `status`, `convergence`, council integration, and council unit tests: 6 files, 35 tests.
<!-- /ANCHOR:phase-2 -->

---

### Migration Phase 3: Delete the Four MCP Tool Entries

- [x] T016 Delete `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/upsert.ts` [5m] {deps: T014}
  - Evidence: handler file deleted; `tools/index.ts` no longer imports it.
- [x] T017 Delete `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/query.ts` [5m] {deps: T014}
  - Evidence: handler file deleted; `tools/index.ts` no longer imports it.
- [x] T018 Delete `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/status.ts` [5m] {deps: T014}
  - Evidence: handler file deleted; `tools/index.ts` no longer imports it.
- [x] T019 Delete `.opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/convergence.ts` [5m] {deps: T014}
  - Evidence: handler file deleted; `tools/index.ts` no longer imports it.
- [x] T020 Remove `council_graph_*` definitions from `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:650-740` [30m] {deps: T016-T019}
  - Evidence: `rg -n "council_graph_|CouncilGraph|councilGraph" .../tool-schemas.ts` returned no hits; `TOOL_DEFINITIONS` imports at count 35.
- [x] T021 Remove `council_graph_*` schema map rows from `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:607-610` [15m] {deps: T020}
  - Evidence: schema map rows and unreferenced council Zod schemas/enums were removed.
- [x] T022 Remove `council_graph_*` allowed-parameter rows from `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:660-663` [15m] {deps: T021}
  - Evidence: `rg -n "council_graph_|CouncilGraph|councilGraph" .../schemas/tool-input-schemas.ts` returned no hits.
- [x] T023 Remove council imports, `TOOL_NAMES`, switch cases, and schema-validation set entries from `.opencode/skills/system-spec-kit/mcp_server/tools/index.ts:12-50` [30m] {deps: T020}
  - Evidence: dispatcher imports/cases and the council-only validation set were removed; remaining dispatchers receive already validated args from existing tool modules/server boundary.
- [x] T024 Update `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts:162-202` expected tool list from 39 to 35 and remove council IDs [30m] {deps: T020-T023}
  - Evidence: context-server expected tool list, dispatch cases, and layer-prefix rows no longer enumerate council graph tools.
- [x] T025 Update `.opencode/skills/system-spec-kit/mcp_server/tests/layer-definitions.vitest.ts:15-21` and related layer mapping rows to remove council tools [30m] {deps: T020-T023}
  - Evidence: `COUNCIL_GRAPH_TOOLS` and the `L9:CouncilGraph` special case were removed.
- [x] T026 Update remaining count assertions, including `review-fixes.vitest.ts` if still expecting the old count [20m] {deps: T024, T025}
  - Evidence: `review-fixes.vitest.ts` tool-count assertion was updated to 35 after the focused schema test caught the stale 43 count.
- [x] T027 Verify `mcp tools list` no longer includes all four council IDs and total count drops by exactly 4 [15m] {deps: T020-T026}
  - Evidence: local shell has no standalone `mcp` binary; source-equivalent check via `node --import ./scripts/node_modules/tsx/dist/loader.mjs` imported `TOOL_DEFINITIONS` and returned `{ "count": 35, "council": [] }`.
### Migration Phase 4: Rewire `deep-ai-council`

- [x] T028 Update `.opencode/skills/deep-ai-council/scripts/replay-graph-from-artifacts.cjs:20-28` usage text from MCP payload pipe to runtime CLI replay [20m]
  - Evidence: usage text now describes `deep-loop-runtime/scripts/upsert.cjs --loop-type council` and `--dry-run` as JSON-only inspection.
- [x] T029 Extend `replay-graph-from-artifacts.cjs:341-370` main flow to optionally spawn `node .opencode/skills/deep-loop-runtime/scripts/upsert.cjs --loop-type council` with derived nodes/edges [60m]
  - Evidence: default `main()` path calls the runtime upsert script with derived nodes/edges and propagates child exit codes.
- [x] T030 Preserve a dry-run mode that emits the JSON payload without mutating derived graph rows [30m] {deps: T029}
  - Evidence: replay helper test verifies `--dry-run` emits the derived payload shape while default mode writes graph rows.
- [x] T031 Update `.opencode/skills/deep-ai-council/references/graph_support.md:15-116` from MCP tool surface wording to runtime CLI wording [45m]
  - Evidence: graph support now documents runtime CLI scripts, source-of-truth artifacts, recovery replay, and dry-run inspection.
- [x] T032 Update `.opencode/skills/deep-ai-council/SKILL.md:122-124,348-385,469` graph boundary references [30m]
  - Evidence: SKILL.md now points replay to the runtime upsert CLI and assigns graph updates to caller-owned runtime CLI reducers.
- [x] T033 Update `.opencode/skills/deep-ai-council/README.md:76,195,327-365` graph tool descriptions and FAQ [30m]
  - Evidence: README now describes the graph as a `deep-loop-runtime` CLI projection instead of an MCP tool projection.
- [x] T034 Update `.opencode/commands/deep/ask-ai-council.md:5` allowed-tool assumptions if graph MCP tools are mentioned indirectly; keep memory MCP as needed [20m]
  - Evidence: command entrypoint now records the graph boundary as `deep-loop-runtime` CLI with `--loop-type council`; memory MCP notes remain untouched.
- [x] T035 Update `.opencode/commands/deep/assets/deep_ask-ai-council_auto.yaml:35-48` and `deep_ask-ai-council_confirm.yaml:35-48` where MCP notes or graph runtime paths are stale [30m]
  - Evidence: both YAML assets now list replay graph and council graph runtime script paths under skill/runtime references.
- [x] T036 Update `.opencode/agents/ai-council.md:384-385` so graph updates belong to runtime CLI reducers, not `council_graph_*` MCP tooling [20m]
  - Evidence: agent mirror now states graph updates belong to caller-owned `deep-loop-runtime` CLI reducers.
- [x] T037 Run `rg -n "council_graph_|CouncilGraph|MCP projection|MCP tool surface" .opencode/skills/deep-ai-council .opencode/commands/deep .opencode/agents/ai-council.md` and classify every remaining hit as historical or stale [30m] {deps: T028-T036}
  - Evidence: live docs/scripts/commands/agent had zero hits after excluding changelog, manual playbook, and feature catalog; remaining 251 hits are historical or Phase 5 test/playbook migration content.
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Migration Phase 5: Migrate Tests + Mirror Docs + Tool Count

- [x] T038 Move or rewrite `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph.vitest.ts` into `.opencode/skills/deep-loop-runtime/tests/integration/council-graph-script.vitest.ts` [90m] {deps: T014}
  - Evidence: `council-graph-script.vitest.ts` now covers council JSON bridge shape, five query modes, empty/ready status, empty/blocked/allowed/continue convergence, hostile metadata redaction, and exit-code contracts.
- [x] T039 Move or rewrite `.opencode/skills/system-spec-kit/mcp_server/tests/council-graph-value-scenarios.vitest.ts` into runtime-owned value coverage [90m] {deps: T038}
  - Evidence: `deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts` migrated DAC-027 through DAC-032 and passed 6/6 tests.
- [x] T040 Move or adapt `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/council-value/seed-helpers.ts` to spawn CLI scripts instead of importing MCP handlers [90m] {deps: T039}
  - Evidence: migrated `tests/fixtures/council-value/seed-helpers.ts` uses `runScript()`, `namespaceArgs()`, and `--loop-type council`; old `mcpCalls` fixture semantics became `runtimeCalls`.
- [x] T041 Keep DAC-027 through DAC-032 scenario fixture data available from the migrated test location [45m] {deps: T039, T040}
  - Evidence: fixture data and README moved to `deep-loop-runtime/tests/fixtures/council-value/`; the old system-spec-kit fixture tree was deleted after migrated coverage passed.
- [x] T042 Run DAC-019 through DAC-024 `deep-ai-council` end-to-end scenarios or the closest automated equivalent [60m] {deps: T028-T037}
  - Evidence: closest automated equivalent passed: `deep-ai-council` replay helper Vitest passed 17 tests, and repaired `npm run test:council` passed 9 files / 34 tests including runtime parity, playbook anchors, helper smoke coverage, artifact persistence, and runtime council graph scenarios.
- [x] T043 Update feature catalog and manual playbook entries that state `council_graph_*` MCP is the shipped surface [60m] {deps: T031-T033}
  - Evidence: live feature catalog and manual playbook graph entries now describe `deep-loop-runtime` CLI derived projection; stale live-doc search returned no hits for `council_graph_`, `MCP projection`, `MCP tool surface`, old counts, old MCP test paths, or old fixture semantics.
- [x] T044 Update `opencode.json:29-30` `_NOTE_2_TOOLS` from 39 tools to 35 tools and remove council graph inventory text [20m] {deps: T020-T027}
  - Evidence: `opencode.json` now advertises 35 mk-spec-memory tools and excludes the council graph family from the MCP inventory/family list.
- [x] T045 Run `rg -n "council_graph_" .opencode/skills/system-spec-kit/mcp_server opencode.json` and confirm zero live MCP inventory hits [15m] {deps: T044}
  - Evidence: targeted live MCP inventory grep returned no hits; stale ignored `dist/**` council graph artifacts and old MCP-derived `database/council-graph.sqlite*` files were also removed after `npm run build`.
- [x] T046 Run runtime unit/integration tests for council, coverage-graph, and script entry points [45m] {deps: T038-T041}
  - Evidence: native-review remediation run passed council query unit, council script integration, DAC value coverage, and existing research/review `upsert`, `query`, `status`, and `convergence` suites together under default Vitest parallelism (6 files / 38 tests); DAC value scenarios then passed 6/6 with no tracked report mutation.
- [x] T047 Run system-spec-kit MCP tests affected by tool definitions, schemas, and layer definitions [45m] {deps: T024-T026}
  - Evidence: targeted MCP inventory/schema tests passed `context-server`, `layer-definitions`, `review-fixes`, and tool-input schema coverage (3 files / 424 tests), and `TOOL_DEFINITIONS` import returned `{ "count": 35, "council": [] }`.
- [x] T048 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/010-council-graph-cli-migration --strict` [10m]
  - Evidence: final strict validation passed with exit 0 after Phase 5 packet doc closure.
- [x] T049 Fill `implementation-summary.md` with actual files changed, verification output, limitations, and completion percentage 100 [30m] {deps: T046-T048}
  - Evidence: `implementation-summary.md` now records Phase 5 files, native-review remediation output, verification output, warnings, and completion status at 100%.
- [x] T050 Mark checklist items complete with evidence and update `spec.md` Status from `Scaffolded` to `Complete` [30m] {deps: T049}
  - Evidence: `checklist.md` marks all implementer-verifiable items complete with evidence; `spec.md` metadata status is `Complete`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 port tasks complete.
- [x] All four CLI scripts accept `--loop-type council`.
- [x] All four `council_graph_*` MCP tools removed from live tool surface.
- [x] `deep-ai-council` graph workflow uses direct CLI subprocess calls.
- [x] Migrated council graph tests and DAC scenarios pass.
- [x] `opencode.json` and MCP tool count tests agree on 35 tools.
- [x] This packet passes strict validation.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
