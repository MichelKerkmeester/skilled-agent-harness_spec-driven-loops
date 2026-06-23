---
title: "Epistemic baseline capture (task_preflight)"
description: "Covers the preflight tool that records knowledge, uncertainty and context completeness baselines before task execution."
trigger_phrases:
  - "epistemic baseline capture"
  - "task_preflight"
  - "preflight baseline"
  - "knowledge baseline before task"
  - "record uncertainty before starting"
version: 3.6.0.20
---

# Epistemic baseline capture (task_preflight)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Covers the preflight tool that records knowledge, uncertainty and context completeness baselines before task execution.

Before starting a task, this tool records how much you know, how uncertain you are and how complete your context is. It is like taking a "before" photo at the start of a home renovation. Later, you can compare against the "after" to measure how much progress you made and what you learned along the way.

## 2. HOW IT WORKS

Before starting implementation work, this tool records how much the agent knows, how uncertain it is and how complete the context is. All three scores are on a 0-100 scale. You can optionally list identified knowledge gaps as an array of strings.

Records are stored in the `session_learning` table with a `UNIQUE` constraint on `(spec_folder, task_id)`. If a preflight record already exists for the same combination and is still in the "preflight" phase, calling preflight again updates the existing record rather than creating a duplicate. Completed records (where postflight has already run) cannot be overwritten. That guard prevents accidental resets of finished learning cycles.

The purpose of preflight is establishing a baseline for learning measurement. Without knowing where you started, you cannot measure how much you learned. The postflight tool completes the measurement.

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `mcp_server/handlers/session-learning.ts` | Session learning handler: preflight baseline capture, UNIQUE constraint on (spec_folder, task_id) |
| `mcp_server/core/db-state.ts` | Database state management for `session_learning` table |
| `mcp_server/lib/response/envelope.ts` | MCP success/error envelope helpers |
| `mcp_server/schemas/tool-input-schemas.ts` | Zod input schemas for `task_preflight` arguments |
| `mcp_server/tool-schemas.ts` | MCP-visible JSON schema for `task_preflight` |
| `mcp_server/tools/lifecycle-tools.ts` | Lifecycle tool dispatcher for learning tools |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/handler-session-learning.vitest.ts` | Automated test | Session learning handler validation |
| `mcp_server/tests/integration-learning-history.vitest.ts` | Automated test | Learning history integration |
| `mcp_server/tests/learning-stats-filters.vitest.ts` | Automated test | Learning stats filter tests |

## 4. SOURCE METADATA
- Group: Analysis
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `06--analysis/epistemic-baseline-capture-taskpreflight.md`

### MANUAL PLAYBOOK COVERAGE

| Scenario | Role |
|----------|------|
| `EX-023` | Direct manual validation for creating the task preflight baseline |
Related references:
- [causal-chain-tracing-memorydriftwhy.md](causal-chain-tracing-memorydriftwhy.md) — Causal chain tracing (memory_drift_why)
- [post-task-learning-measurement-taskpostflight.md](post-task-learning-measurement-taskpostflight.md) — Post-task learning measurement (task_postflight)
