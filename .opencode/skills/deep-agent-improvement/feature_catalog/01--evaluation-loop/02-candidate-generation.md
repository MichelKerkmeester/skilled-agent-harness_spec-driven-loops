---
title: "Candidate generation"
description: "Generates one bounded packet-local candidate through the proposal-only deep-agent-improvement subagent."
---

# Candidate generation

## 1. OVERVIEW

Generates one bounded packet-local candidate through the proposal-only deep-agent-improvement subagent.

This feature covers the proposal stage of the loop, where the evaluated agent can be changed only inside the packet-local runtime area and only after the control bundle has been read.

---

## 2. CURRENT REALITY

Candidate generation is delegated to `.opencode/agents/deep-agent-improvement.md`. That subagent requires five concrete inputs, reads the copied charter and manifest before writing, reads the canonical target and integration report, writes one candidate under `improvement/candidates/`, returns structured JSON metadata, and stops before scoring, benchmarking, promotion, or mirror synchronization begins.

The YAML workflows own when candidate generation happens. Autonomous mode runs the proposal step whenever the loop continues, while confirm mode adds an approval gate before dispatching the candidate writer. The packet-local boundary is strict in the shipped agent: canonical targets and runtime mirrors are explicit never-edit surfaces.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/agents/deep-agent-improvement.md` | Proposal agent | Defines the proposal-only contract, required inputs, and runtime-only write boundary. |
| `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_auto.yaml` | Workflow | Dispatches the candidate-generation step on each autonomous iteration. |
| `.opencode/commands/deep/assets/deep_start-agent-improvement-loop_confirm.yaml` | Workflow | Gates candidate generation behind operator approval in interactive mode. |
| `.opencode/skills/deep-agent-improvement/SKILL.md` | Skill orchestration | Describes the bounded-candidate rule and the packet-local `candidates/` directory contract. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/deep-agent-improvement/references/workflow/loop_protocol.md` | Reference | Documents the proposal-first sequence and runtime-only candidate path. |
| `.opencode/skills/deep-agent-improvement/references/promotion-gates/promotion_rules.md` | Safety reference | Stops the loop when mutator and scorer boundaries blur or scope broadens. |

---

## 4. SOURCE METADATA

- Group: Evaluation loop
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--evaluation-loop/02-candidate-generation.md`
