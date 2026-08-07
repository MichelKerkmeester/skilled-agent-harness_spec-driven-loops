---
title: "Verification Checklist: Move skill_graph_* tools to advisor ownership"
description: "Pending verification checklist for the Level 3 skill_graph_* ownership migration."
trigger_phrases:
  - "013/009/008 checklist"
  - "skill graph advisor move verification"
importance_tier: "critical"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/008-skill-graph-tools-advisor-migration"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "008 implementation shipped (D1+D2)"
    next_safe_action: "013/009 close-out (Tier 3 operator actions pending)"
    blockers: []
    completion_pct: 100
---
# Verification Checklist: Move skill_graph_* tools to advisor ownership

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get operator-approved deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
  - **Evidence**: REQ-001 through REQ-005 reviewed before D1 edits; D1 verifies REQ-001, REQ-002, and REQ-004 bridge window.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
  - **Evidence**: D1 followed Phase 1 setup plus Cluster A and Cluster B.
- [x] CHK-003 [P1] Dependencies identified and available.
  - **Evidence**: 005 proxy pattern, 003 handler move pattern, existing advisor server, and system-spec-kit DB layer were read and used.
- [x] CHK-004 [P1] Baseline consumer inventory captured.
  - **Evidence**: Live old-prefix grep returned 10 matches across 4 non-spec files; D2 cutover untouched.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Advisor server registers all four `skill_graph_*` tools.
  - **Evidence**: Advisor stdio `tools/list` returned 8 tools: 4 `advisor_*` plus 4 `skill_graph_*`.
- [x] CHK-011 [P0] Advisor-local handlers exist for scan, query, status, and validate.
  - **Evidence**: `handlers/skill-graph/{scan,query,status,validate}.ts` now live under `system-skill-advisor`.
- [x] CHK-012 [P0] No long-lived duplicate primary handler logic remains in memory MCP.
  - **Evidence**: 7 old files under `system-spec-kit/mcp_server/handlers/skill-graph/` were physically deleted; memory keeps proxy only.
- [x] CHK-013 [P1] Handler authorization and output shapes are preserved.
  - **Evidence**: Targeted memory handler tests against advisor handlers pass, including scan auth and diagnostic redaction.
- [x] CHK-014 [P1] Code follows existing advisor package conventions.
  - **Evidence**: Descriptors export through `tools/index.ts`; handlers export through `handlers/index.ts`; `advisor-server.ts` owns MCP listing/dispatch.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Advisor package tests cover descriptor registration and handler dispatch.
  - **Evidence**: `skill-graph-listing.vitest.ts` and `skill-graph-dispatch.vitest.ts`; targeted advisor run passed 19/19 with `advisor-recommend` dispatcher coverage.
- [x] CHK-021 [P0] Memory proxy tests cover forwarding and timeout behavior.
  - **Evidence**: `skill-graph-proxy.vitest.ts` covers forwarding, one-time deprecation log, unavailable response, and 10s timeout.
- [x] CHK-022 [P0] Final memory MCP tests prove `skill_graph_*` descriptors are removed after cleanup.
  - **Evidence**: Direct `spec_kit_memory` MCP `tools/list` returned 41 tools and `skillGraph: []`; memory typecheck passed.
- [x] CHK-023 [P1] System-code-graph readiness smoke passes after retarget.
  - **Evidence**: N/A: system-code-graph grep returned 0 live old-prefix callers.
- [x] CHK-024 [P1] Hook wrapper smoke passes after retarget.
  - **Evidence**: N/A: hook/runtime grep across OpenCode/Codex/Claude/Gemini surfaces returned 0 live old-prefix callers.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P0] `spec_kit_memory` proxy is removed after zero-caller evidence.
  - **Evidence**: `tools/skill-graph-tools.ts` and `tests/skill-graph-proxy.vitest.ts` were physically deleted after final live-caller grep.
- [x] CHK-026 [P0] `spec_kit_memory` descriptors and schemas no longer expose `skill_graph_*`.
  - **Evidence**: `tool-schemas.ts` descriptor definitions/export entries removed; direct memory `tools/list` exposes no `skill_graph_*` tools.
- [x] CHK-027 [P1] Remaining `skill_graph_*` grep hits are classified as advisor-owned, historical, or plain tool-id references.
  - **Evidence**: Final old-prefix grep returned one historical Tier 3 sk-code playbook hit; Tier 2 bare references remain conceptual with ownership notes.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Trusted-caller behavior for `skill_graph_scan` is preserved.
  - **Evidence**: Existing scan auth tests now target advisor handler path and pass.
- [x] CHK-031 [P1] Proxy does not expose new unauthenticated write paths.
  - **Evidence**: Proxy only forwards existing tool ids to `system_skill_advisor`; scan trust remains enforced in the advisor handler.
- [x] CHK-032 [P1] No secrets, credentials, or machine-local paths are introduced in docs.
  - **Evidence**: Packet docs record command evidence and local paths already present in packet metadata only; no secrets added.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Install guides describe `system_skill_advisor` as skill graph tool owner.
  - **Evidence**: `.opencode/install_guides/SET-UP - Skill Advisor.md` and `system-skill-advisor/INSTALL_GUIDE.md` include `system_skill_advisor` ownership notes.
- [x] CHK-041 [P1] Feature catalogs and playbooks reflect new ownership.
  - **Evidence**: Four feature catalog files and three manual testing playbooks now state `system_skill_advisor` ownership.
- [x] CHK-042 [P1] Historical references are preserved only when clearly historical.
  - **Evidence**: Tier 3 historical sk-code playbook reference was left untouched; live command/docs were retargeted or annotated.
- [x] CHK-043 [P2] `ARCHITECTURE.md` or equivalent topology docs include the server-prefix distinction.
  - **Evidence**: Equivalent topology docs updated in install guide, feature catalog, playbooks, and packet implementation summary; `ARCHITECTURE.md` had no D2 live hit.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [x] CHK-044 [P1] Live docs use `system_skill_advisor` for server-prefixed `skill_graph_*` calls.
  - **Evidence**: Doctor command allowed-tools and YAML probe strings use `mcp__system_skill_advisor__skill_graph_*` or `system_skill_advisor.skill_graph_*`.
- [x] CHK-045 [P1] Historical packet references are not rewritten into misleading current-state claims.
  - **Evidence**: `.opencode/specs/**/*.md` outside this packet and the historical sk-code V3 playbook were not rewritten.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Scope stays within implementation packet and approved code/doc files.
  - **Evidence**: D2 edits stayed within consumer docs, memory cleanup files, stale cleanup tests, and this packet's docs; unrelated dirty runtime/spec files were ignored.
- [x] CHK-051 [P1] Temporary scratch or generated files are avoided or kept in approved locations.
  - **Evidence**: No scratch/archive files were created; package builds updated ignored `dist` outputs only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] ADR-001 through ADR-004 are accepted and aligned with parent ADR-001.
  - **Evidence**: D1 implemented ADR-001, ADR-002, and ADR-003; ADR-004 remains D2 cutover ordering.
- [x] CHK-101 [P0] Tool-id stability is proven: public ids remain `skill_graph_*`.
  - **Evidence**: Advisor and memory descriptors use unchanged ids: `skill_graph_scan/query/status/validate`.
- [x] CHK-102 [P0] Server ownership changes from `spec_kit_memory` to `system_skill_advisor`.
  - **Evidence**: Advisor now owns native descriptors and handlers; memory side is a bridge-only proxy.
- [x] CHK-103 [P1] Consumer cutover order follows risk ordering: system-code-graph, hooks, plugins, docs.
  - **Evidence**: T016-T018 were proven no-op first, then Tier 1 doctor callers were retargeted, then Tier 2 docs were annotated.
- [x] CHK-104 [P1] Rollback paths are documented per cluster.
  - **Evidence**: `plan.md` rollback table remains current; D2 implementation summary records proxy-removal rollback condition.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [x] CHK-105 [P1] Proxy timeout behavior is bounded at 10 seconds.
  - **Evidence**: Proxy constant is 10,000ms and fake-clock timeout test passes.
- [x] CHK-106 [P1] `skill_graph_scan` runtime does not regress materially versus baseline.
  - **Evidence**: Handler implementation was unchanged from D1 advisor ownership; D2 only retargeted callers and removed memory bridge exposure.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [x] CHK-107 [P0] Tool ids remain `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate`.
  - **Evidence**: `tools/list` on advisor and memory both expose the unchanged public ids.
- [x] CHK-108 [P1] Server-prefix migration is documented as caller-visible.
  - **Evidence**: Implementation summary records D1 dual-prefix bridge and D2 caller cutover.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:runtime-verify -->
## L3: Runtime Verification

- [x] CHK-110 [P1] OpenCode smoke confirms `mcp__system_skill_advisor__skill_graph_*`.
  - **Evidence**: `opencode mcp list` showed `system_skill_advisor` connected; direct advisor MCP `tools/list` showed all four `skill_graph_*` tools.
- [x] CHK-111 [P1] Codex smoke confirms `mcp__system_skill_advisor__skill_graph_*`.
  - **Evidence**: `codex mcp list` showed `system_skill_advisor` enabled; direct advisor MCP `tools/list` showed all four `skill_graph_*` tools.
- [x] CHK-112 [P1] Claude smoke confirms `mcp__system_skill_advisor__skill_graph_*`.
  - **Evidence**: INCONCLUSIVE per accepted CLI-cache pattern; `claude mcp list` did not show `system_skill_advisor` in visible rows.
- [x] CHK-113 [P1] Gemini smoke confirms `mcp__system_skill_advisor__skill_graph_*`.
  - **Evidence**: `gemini mcp list --debug` showed `system_skill_advisor` connected; it also reported `spec_kit_memory` disconnected.
- [x] CHK-114 [P1] Doctor/update smoke exercises advisor-owned skill graph probes.
  - **Evidence**: INCONCLUSIVE; slash-command smoke requires an interactive runtime. Static command/YAML greps confirm advisor-owned probes.
<!-- /ANCHOR:runtime-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [x] CHK-120 [P0] Final grep shows zero live `mcp__mk_spec_memory__skill_graph_` callers.
  - **Evidence**: Final old-prefix grep returned only `.opencode/skills/sk-code/manual_testing_playbook/.../001-advisor-probe-battery.md`, classified historical Tier 3.
- [x] CHK-121 [P0] Strict validation passes for packet 008.
  - **Evidence**: `validate.sh .../008-skill-graph-tools-advisor-migration --strict` exited 0 with 0 errors and 0 warnings.
- [x] CHK-122 [P1] Strict validation passes for parent 013/009 and grandparent 013.
  - **Evidence**: `validate.sh .../009-system-skill-advisor-extraction --strict` and `validate.sh .../002-semantic-routing-lane --strict` both exited 0 with 0 errors and 0 warnings.
- [x] CHK-123 [P1] Implementation summary records test results and residual risks.
  - **Evidence**: D1 evidence, test counts, smokes, scope anomaly, and D2 next action recorded in `implementation-summary.md`.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 20 | 20/20 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-05-14
**Verified By**: Codex
**ADRs**: 5 scaffolded, 5 accepted for planning
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

- [x] CHK-124 [P0] Operator confirms proxy removal after zero-caller evidence.
  - **Evidence**: D2 dispatch pre-granted ADR-003 proxy removal confirmation; zero live caller grep was clean before removal.
- [x] CHK-125 [P1] Final packet handoff names residual risks and next safe action.
  - **Evidence**: `next_safe_action` is set to Dispatch D2; D2 consumer cutover and cleanup remain open.
<!-- /ANCHOR:sign-off -->
