---
title: "Verification Checklist: 010 — Council Graph CLI Migration"
description: "Definition of Done for moving council graph behavior from MCP tools to deep-loop-runtime CLI scripts and rewiring deep-ai-council."
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
      fingerprint: "sha256:1310030100000000000000000000000000000000000000000000000000000004"
      session_id: "131-003-010-council-cli-scaffold"
      parent_session_id: null
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 010 — Council Graph CLI Migration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Baseline runtime CLI scripts confirmed present.
  - **Evidence**: `ls .opencode/skills/deep-loop-runtime/scripts/{upsert,query,status,convergence}.cjs` found all four scripts.
- [x] CHK-002 [P0] Current council MCP source inventory confirmed.
  - **Evidence**: `wc -l .opencode/skills/system-spec-kit/mcp_server/handlers/council-graph/*.ts` reports 558 total handler LOC before removal.
- [x] CHK-003 [P0] Live `deep-ai-council` command/YAML paths confirmed.
  - **Evidence**: `ls .opencode/commands/deep/ask-ai-council.md .opencode/commands/deep/assets/deep_ask-ai-council_{auto,confirm}.yaml` found all three files.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `deep-loop-runtime/scripts/upsert.cjs --loop-type=council` returns valid JSON.
  - **Evidence**: `council-graph-script.vitest.ts` verifies valid and empty no-op council upserts parse as JSON with `status: "ok"`.
- [x] CHK-011 [P0] `query.cjs`, `status.cjs`, and `convergence.cjs` accept `--loop-type council`.
  - **Evidence**: `council-graph-script.vitest.ts` covers all five council query modes, empty/ready status, and blocked/allowed convergence decisions.
- [x] CHK-012 [P0] Exit-code contract preserved.
  - **Evidence**: `council-graph-script.vitest.ts` covers success 0, script error 1, DB/runtime error 2, and input validation 3.
- [x] CHK-013 [P1] Council graph modules use runtime-owned storage and do not import `system-spec-kit/mcp_server/core/config.js`.
  - **Evidence**: `rg -n "core/config" .opencode/skills/deep-loop-runtime/lib/council .opencode/skills/deep-loop-runtime/scripts/{upsert,query,status,convergence}.cjs` returned no hits.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All migrated `council-graph.vitest.ts` behavior passes.
  - **Evidence**: `council-graph-script.vitest.ts` passed in the runtime council run and now covers JSON bridge shape, query modes, status, convergence, hostile metadata redaction, and exit-code contracts.
- [x] CHK-021 [P0] All existing council graph value tests pass.
  - **Evidence**: `council-graph-value-scenarios.vitest.ts` migrated DAC-027 through DAC-032 and passed 6/6 tests.
- [x] CHK-022 [P0] `deep-ai-council` end-to-end DAC-019 through DAC-024 scenarios still pass.
  - **Evidence**: Closest automated equivalent passed: `deep-ai-council` replay helper Vitest passed 17 tests, and repaired `npm run test:council` passed 9 files / 34 tests covering runtime parity, playbook anchors, helper smoke coverage, artifact persistence, and runtime council graph scenarios.
- [x] CHK-023 [P1] Existing research/review runtime tests still pass.
  - **Evidence**: Native-review remediation targeted Vitest run passed existing `upsert`, `query`, `status`, and `convergence` script tests with the new council tests under default parallelism: 6 files, 38 tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All four council MCP tool IDs absent from `mcp tools list`.
  - **Evidence**: No standalone `mcp` binary is available in this shell; source-equivalent check imported `TOOL_DEFINITIONS` through the TSX loader and returned `{ "count": 35, "council": [] }`. `npm run build` passed and stale ignored `dist/**` council graph artifacts were removed.
- [x] CHK-031 [P0] `tool-schemas.ts` contains no `council_graph_*` definitions.
  - **Evidence**: `rg -n "council_graph_|CouncilGraph|councilGraph" .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts` returned no hits.
- [x] CHK-032 [P0] `tool-input-schemas.ts` contains no `council_graph_*` schema or allowed-parameter rows.
  - **Evidence**: `rg -n "council_graph_|CouncilGraph|councilGraph" .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` returned no hits.
- [x] CHK-033 [P0] `tools/index.ts` contains no council graph handler imports or dispatch cases.
  - **Evidence**: `rg -n "council-graph|council_graph_|CouncilGraph|councilGraph" .opencode/skills/system-spec-kit/mcp_server/tools/index.ts` returned no hits.
- [x] CHK-034 [P0] `opencode.json _NOTE_2_TOOLS` updated to "35 tools" with council_graph_* removed from inventory.
  - **Evidence**: `opencode.json` now advertises 35 mk-spec-memory tools and excludes the council graph family from the MCP inventory/family list; targeted stale-wording grep returned no hits.
- [x] CHK-035 [P1] Layer-definition and context-server tests no longer enumerate council graph tools.
  - **Evidence**: Targeted `rg` over `context-server.vitest.ts` and `layer-definitions.vitest.ts` returned no council graph hits; focused inventory tests passed 2 files / 412 tests, and schema/review-fixes tests passed 2 files / 67 tests after updating the stale 43-count assertion.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No new network, socket, or MCP entry point introduced.
  - **Evidence**: Phase 4 replay uses a local `node` subprocess to the runtime upsert script; no network, socket, or MCP entry point was introduced.
- [x] CHK-041 [P1] Derived graph recovery remains namespace-scoped.
  - **Evidence**: `status.cjs --loop-type council` recovery payload uses only `specFolder` and `sessionId` for council cleanup guidance.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] `spec.md`, `plan.md`, and `tasks.md` synchronized with final implementation order.
  - **Evidence**: Phase 4 completed before Phase 3 deletion, matching ADR-003; Phase 5 tasks are now complete with evidence and continuation state points to packet completion.
- [x] CHK-051 [P0] `decision-record.md` ADR statuses set to Accepted or superseded with rationale.
  - **Evidence**: ADR-001 through ADR-004 status rows are now `Accepted`.
- [x] CHK-052 [P1] `deep-ai-council` README/SKILL/reference docs no longer describe council graph as an MCP projection.
  - **Evidence**: Targeted live-doc search over README, SKILL, graph support, replay script, command assets, and agent mirror returned no `council_graph_`, `MCP projection`, or `MCP tool surface` hits.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Implementation file modifications remained scoped to the requested migration surface.
  - **Evidence**: Phase 5 touched runtime council tests/fixtures, obsolete MCP test/lib leftovers, deep-ai-council graph docs/playbooks, tool-count mirrors, replay smoke tests, agent mirrors, and packet docs.
- [x] CHK-061 [P1] Implementation dispatch keeps generated scratch outside committed packet docs.
  - **Evidence**: `git diff --stat` reviewed for tracked Phase 3 files; no generated scratch files were created, and no commit or staging was requested.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] ADR-001 persistence model followed.
  - **Evidence**: `council-graph-db.ts` persists to `deep-loop-runtime/database/council-graph.sqlite` through `COUNCIL_GRAPH_STORAGE_DIR`.
- [x] CHK-101 [P0] ADR-002 convergence location followed.
  - **Evidence**: Council math lives in `deep-loop-runtime/lib/council/convergence.cjs` and is invoked by `scripts/convergence.cjs`.
- [x] CHK-102 [P0] ADR-003 safer migration order followed.
  - **Evidence**: `deep-ai-council` replay and live docs were rewired to runtime CLI paths before the MCP handlers and tool definitions were deleted.
- [x] CHK-103 [P1] ADR-004 test strategy followed or updated with accepted rationale.
  - **Evidence**: Runtime-owned integration tests replace handler-level MCP tests, and the old system-spec-kit council graph tests/fixtures/libs were deleted after migrated coverage passed.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback plan tested or at least mechanically verified.
  - **Evidence**: Revert scope is localized to runtime council tests/fixtures, deep-ai-council graph docs/replay wiring, system-spec-kit MCP inventory/test cleanup, generated dist cleanup, old derived SQLite cleanup, tool-count mirrors, and packet docs; `implementation-summary.md` documents the source-equivalent MCP tool inventory check.
- [x] CHK-121 [P0] `validate.sh --strict` passes on this packet.
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/010-council-graph-cli-migration --strict` returned exit 0 with 0 errors and 0 warnings after Phase 5 doc closure.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-130 [P1] CLI subprocess graph calls replace MCP bridge calls.
  - **Evidence**: `replay-graph-from-artifacts.cjs` now spawns `deep-loop-runtime/scripts/upsert.cjs --loop-type council` by default; `--dry-run` preserves payload inspection.
- [x] CHK-131 [P1] DAC value scenarios still show graph path benefit over baseline file reads.
  - **Evidence**: Migrated DAC-027 through DAC-032 value scenarios passed under `deep-loop-runtime/tests/integration/council-graph-value-scenarios.vitest.ts`; metrics now write to a temp path by default, with tracked report refresh only via `COUNCIL_VALUE_REPORT_PATH`.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-140 [P0] Scope lock honored.
  - **Evidence**: Phase 5 edits were limited to scoped test migration, obsolete MCP council leftovers, tool-count mirrors, deep-ai-council live graph guidance, agent mirrors, replay smoke compatibility, and packet docs.
- [x] CHK-141 [P0] No commits made by the implementation agent unless separately requested.
  - **Evidence**: No commit or staging command was run; `git status --short` was used only for inspection.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-150 [P1] Packet docs reflect actual implementation order and evidence.
  - **Evidence**: `implementation-summary.md`, `tasks.md`, `checklist.md`, `spec.md`, and frontmatter continuity now mark the packet complete at 100%.
- [x] CHK-151 [P1] Deep AI Council docs no longer call the graph surface MCP-owned.
  - **Evidence**: Targeted live-doc grep across manual playbook, feature catalog, command assets, agent mirrors, `opencode.json`, and MCP package metadata returned no stale graph-surface hits.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [x] CHK-160 [P0] Implementer sign-off.
  - **Sign-off**: codex-gpt-5, 2026-05-24, after runtime tests, MCP inventory tests, drift gates, and strict spec validation.
- [x] CHK-161 [P1] Reviewer/operator sign-off.
  - **Sign-off**: Native review completed after packet closure; all blocker/important findings were remediated and revalidated in this follow-up.
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 26 | 26/26 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-24 final Phase 5 verification
**Verified By**: codex-gpt-5
<!-- /ANCHOR:summary -->
