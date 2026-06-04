---
title: "Feature Specification: Interconnected MCPs Review Slice"
description: "Deep-review slice auditing code-graph, skill-advisor, and deep-loop-runtime integration seams and contract drift with system-spec-kit."
trigger_phrases:
  - "interconnected mcp audit"
  - "code-graph skill-advisor review"
  - "deep-loop-runtime review"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Interconnected MCPs Review Slice

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-04 |
| **Branch** | `wt/0006-deep-review-audit` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
system-spec-kit interconnects with the code-graph MCP, the skill-advisor MCP, and the deep-loop-runtime. These seams changed across 026. This slice audits the interconnected skills for correctness and contract drift with system-spec-kit.

### Purpose
Audit the interconnected MCP skills and the deep-loop runtime for correctness, integration-contract drift, and concurrency/lifecycle bugs, reporting P0/P1/P2 findings with evidence. READ-ONLY review.


<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
Review these skills and their key runtime modules:

- `.opencode/skills/system-code-graph/SKILL.md` + its mcp_server/scripts entrypoints
- `.opencode/skills/system-skill-advisor/SKILL.md` + its advisor/skill-graph scripts
- `.opencode/skills/deep-loop-runtime/SKILL.md`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`
- `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs`
- `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts`
- `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` and `reduce-state.cjs`

### Review Focus
- Integration-contract drift: do the interconnected MCP tool IDs/contracts match what system-spec-kit and the commands expect?
- Concurrency correctness: `fanout-pool.cjs` exposes a `concurrency` cap, but `fanout-run.cjs`'s worker uses synchronous `spawnSync`, which blocks the event loop and serializes lineages regardless of the cap (observed: `concurrency=5` ran one codex at a time). Assess severity + scope of this concurrency mismatch.
- Executor config validation correctness (`executor-config.ts`): per-lineage `iterations` only sizes the timeout, not the internal loop bound, and the sandbox defaults to `workspace-write`. Assess whether these defaults/contracts are safe and documented.
- Graceful degradation when an interconnected MCP is unavailable.

### Out of Scope
- Modifying any reviewed file (read-only review)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-code-graph/**` | Review | Audit contract + readiness correctness |
| `system-skill-advisor/**` | Review | Audit advisor/skill-graph correctness |
| `deep-loop-runtime/**` | Review | Audit fan-out concurrency + executor-config contracts |


<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit interconnected MCP integration seams | Contract drift flagged with evidence |
| REQ-002 | Assess the fan-out concurrency mismatch | Severity + scope of the spawnSync serialization recorded with evidence |


<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Interconnected MCP + deep-loop runtime audited with a recorded verdict, including the concurrency mismatch assessment


<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent audit packet**: See `../spec.md`

<!-- /ANCHOR:related-docs -->

---
