---
title: "Deep Review Strategy — 012 Causal Graph Channel Routing Utilization"
description: "Runtime strategy for the 10-iteration deep review of packet 012; dispatched via cli-opencode (deepseek/deepseek-v4-pro --variant high)."
session_id: "2026-05-11T05:42:00Z"
review_target: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-causal-graph-channel-routing"
review_target_type: "spec-folder"
executor: "cli-opencode deepseek/deepseek-v4-pro reasoning=high"
max_iterations: 10
convergence_threshold: 0.10
---

# Deep Review Strategy — 012 Causal Graph Channel Routing Utilization

## 1. OVERVIEW

### Purpose
Persistent brain for the 10-iteration deep review of packet `012-causal-graph-channel-routing`. Tracks which dimensions remain, what has been found (P0/P1/P2), what review approaches worked, and where the next focus sits. Read by the orchestrator and each per-iteration LEAF agent before any new pass starts.

### Usage
- **Init:** orchestrator copies this template into `review/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from the config and memory_context result.
- **Per iteration:** agent reads Next Focus, reviews the assigned dimension and files, updates findings, marks dimensions complete, and sets the new Next Focus.
- **Mutability:** mutable — updated by orchestrator and agents throughout the session.

---

## 2. TOPIC

Review the implementation, spec artifacts, tests, and telemetry for packet `012-causal-graph-channel-routing` (the channel-routing override that activates `graph` + optional `degree` channels for intent-driven and entity-rich short queries). Verify P0/P1/P2 requirements, security posture, traceability against spec/checklist/resource-map, and maintainability of the new modules.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- MACHINE-OWNED: START -->
- [ ] D1 Correctness — `shouldPreserveGraph`, `getEntityDensityScore`, `routeQuery` override, telemetry ring-buffer math, env-flag short-circuit, cold-start safety, integration with `routingReasons`
- [ ] D2 Security — SQL safety in entity-density cache build, env-flag enforcement, unbounded growth / DoS surfaces, log injection via reason strings, secret/PII exposure via telemetry snapshot
- [ ] D3 Traceability — spec.md REQ-001..REQ-008 ↔ code; checklist.md ↔ evidence; resource-map.md coverage of touched files; implementation-summary.md ↔ tests; cross-runtime skill/agent references; feature-catalog / playbook capability mapping
- [ ] D4 Maintainability — clarity of new modules, naming, documentation, surprising patterns, test readability, dead code, comment hygiene, error-handling consistency
<!-- MACHINE-OWNED: END -->

---

## 4. NON-GOALS
- Auditing the underlying graph-traversal algorithm in `graph-search-fn.ts`.
- Re-reviewing causal-edge creation pathways (010 wrapper territory).
- Reweighting `causal_boost.ts`.
- Re-baselining `graph_channel_invocation_rate` targets beyond what spec already declares.

---

## 5. STOP CONDITIONS
- 10 iterations exhausted.
- All 4 dimensions covered with no new P0/P1 findings for two consecutive iterations AND newFindingsRatio rolling-avg ≤ 0.08.
- Legal-stop gates pass (convergence, dimension coverage, p0 resolution, evidence density, hotspot saturation, claim adjudication, fix-completeness replay if security-sensitive).

---

## 6. COMPLETED DIMENSIONS
<!-- MACHINE-OWNED: START -->
[None yet — populated as iterations complete dimension reviews]

| Dimension | Verdict | Iteration | Summary |
|-----------|---------|-----------|---------|
<!-- MACHINE-OWNED: END -->

---

## 7. RUNNING FINDINGS
<!-- MACHINE-OWNED: START -->
- **P0 (Critical):** 0 active
- **P1 (Major):** 0 active
- **P2 (Minor):** 0 active
- **Delta this iteration:** +0 P0, +0 P1, +0 P2

Findings registry: `deep-review-findings-registry.json`.
<!-- MACHINE-OWNED: END -->

---

## 8. WHAT WORKED
[First iteration — populated after iteration 1 completes]

---

## 9. WHAT FAILED
[Populated as iterations encounter dead ends]

---

## 10. NEXT FOCUS
**Iteration 1:** inventory pass — build artifact map, classify every file in scope by type/owner, identify hotspots (LOC, complexity, novelty), surface obvious P0/P1 quick-wins before the dimension-ordered passes begin.

---

## 11. REVIEW CHARTER

### Scope Files
Spec artifacts:
- `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `handover.md`, `resource-map.md`, `changelog.md`

Implementation:
- `mcp_server/lib/search/query-router.ts` (396 LOC)
- `mcp_server/lib/search/entity-density.ts` (172 LOC, new)
- `mcp_server/lib/search/routing-telemetry.ts` (93 LOC, new)
- `mcp_server/handlers/memory-crud-health.ts` (678 LOC, modified)

Tests:
- `mcp_server/tests/query-router.vitest.ts` (658 LOC)
- `mcp_server/tests/entity-density.vitest.ts` (172 LOC, new)
- `mcp_server/tests/routing-telemetry-stress.vitest.ts` (275 LOC, new)

### Traceability Protocols
- **Core**: `spec_code` (REQ-001..REQ-008 ↔ implementation), `checklist_evidence` (checklist items ↔ test/file:line evidence).
- **Overlay**: `skill_agent`, `agent_cross_runtime` (skim only — this packet is runtime-scoped), `feature_catalog_code`, `playbook_capability`.

### Resource Map Coverage
`resource-map.md` is present at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-causal-graph-channel-routing/resource-map.md`. Cross-check target_files against actual `applied/T-*.md` records when traceability passes run; classify each touched file as `touched / expected-by-scope / gap / absent-from-map`.

### Quality Gates
- **Evidence:** every P0/P1 finding must include concrete file:line evidence (no pure inference).
- **Scope:** every finding lives within the review target — no out-of-scope drift.
- **Coverage:** all 4 dimensions reviewed; required traceability protocols (core: spec_code + checklist_evidence) cleared at least once.

---

## 12. KNOWN CONTEXT

### Prior Work / Memory Surface
- 012-causal-graph-channel-routing was implemented and verified on 2026-05-08 (commits not enumerated; implementation-summary.md and verification table reflect the final state).
- Live smoke test (2026-05-08T14:47Z): `graphChannelInvocationRate` moved from 0.714 (21 prior decisions) to 0.625 (40 routings), with intent path verified to add `graph` WITHOUT `degree` (parity broken cleanly: graph=0.625 vs degree=0.525).
- Stress test (`routing-telemetry-stress.vitest.ts` 012-S1..S4): ring-overflow ×4, 1000-iter latency ×2, cache invalidation ×2, env-flag live-path ×3 — all green.
- Known limitations (per implementation-summary.md): (1) entity-density cache TTL-only (60s lag worst case); (2) telemetry resets on restart; (3) playbook 272 query mix yields 2/5 graph hits, not 3/5 — playbook expectation issue, not code issue.

### Related Spec Folders (from memory_context)
- `system-spec-kit/024-compact-code-graph/020-query-routing-integration` (predecessor routing work).
- `system-spec-kit/024-compact-code-graph/009-code-graph-storage-query` (code graph storage layer).
- `system-spec-kit/024-compact-code-graph/019-code-graph-auto-trigger` (auto-trigger pattern).
- `00--ai-systems/001-global-shared/005-routing-review` (cross-cutting routing review precedent).

### Resource-Map Snapshot
Resource-map.md is present (5.8KB). Coverage gate active; traceability pass MUST cross-check.

---

## 13. ITERATION PLAN

| Iter | Dimension | Focus | Notes |
|------|-----------|-------|-------|
| 1 | inventory | Build artifact map, complexity hotspots | Read all scope files; record line counts, owners, surprises |
| 2 | correctness | `shouldPreserveGraph` + `routeQuery` override + env-flag short-circuit + cold-start | Verify REQ-001/REQ-002/REQ-006 with file:line evidence |
| 3 | security | Cache build SQL, env-flag, telemetry exposure, log injection via reason strings | Cross-check against memory-crud-health surface |
| 4 | traceability | spec_code + checklist_evidence + resource-map coverage gate | Map every REQ to implementation + test file:line |
| 5 | maintainability | Naming, comment hygiene, error handling, dead code, surprising patterns | Look at module boundaries |
| 6 | correctness (deep) | Entity-density cache rebuild correctness, TTL math, 60s lag risk | Verify `getEntityDensityScore` lookup math |
| 7 | security (deep) | Telemetry ring-buffer DoS surface, snapshot allocation, race on cache | Stress-test signal in production-style burst |
| 8 | traceability (replay) | Re-cover overlay protocols if missed; close resource-map gaps | Skill_agent + playbook_capability sweep |
| 9 | adversarial | Self-check on every P0/P1 — counterevidence, alternative explanation | claim adjudication; downgrade weak claims |
| 10 | final sweep | Dedup, severity escalation, P2→P1 upgrade scan, finalize verdict | Compile findings, mark dimensions complete |

---

## 14. EXECUTOR / DISPATCH CONTRACT

- **CLI:** `opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --format json --dangerously-skip-permissions --pure --dir <repo-root> "<prompt>" </dev/null`
- **Working dir:** repo root.
- **Self-invocation:** safe — main agent is Claude Code, dispatching cli-opencode.
- **MCP scope inside dispatch:** `--pure` disables MCP tools that fail DeepSeek's tool-name regex; LEAF agent uses Read/Write/Edit/Bash/Grep/Glob inside opencode's bundled tools.
- **Per-iteration timeout:** 900 s (15 min).
- **Prompt source:** `review/prompts/iteration-NNN.md` (rendered from `prompt_pack_iteration.md.tmpl` before each dispatch).
