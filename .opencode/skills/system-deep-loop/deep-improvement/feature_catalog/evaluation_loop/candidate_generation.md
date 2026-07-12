---
title: "Candidate generation"
description: "Generates one bounded packet-local candidate through the proposal-only deep-improvement subagent."
trigger_phrases:
  - "candidate generation"
  - "deep-improvement.md"
  - "generate candidate"
  - "proposal-only subagent"
  - "packet-local candidate"
version: 1.17.0.9
---

# Candidate generation

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Generates one bounded packet-local candidate through the proposal-only deep-improvement subagent.

This feature covers the proposal stage of the loop, where the evaluated agent can be changed only inside the packet-local runtime area and only after the control bundle has been read.

---

## 2. HOW IT WORKS

Candidate generation is delegated to `.opencode/agents/deep-improvement.md`. That subagent requires five concrete inputs, reads the copied charter and manifest before writing, reads the canonical target and integration report, writes one candidate under `improvement/candidates/`, returns structured JSON metadata, and stops before scoring, benchmarking, promotion, or mirror synchronization begins.

The YAML workflows own when candidate generation happens. Autonomous mode runs the proposal step whenever the loop continues, while confirm mode adds an approval gate before dispatching the candidate writer. The packet-local boundary is strict in the shipped agent: canonical targets and runtime mirrors are explicit never-edit surfaces.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/agents/deep-improvement.md` | Proposal agent | Defines the proposal-only contract, required inputs, and runtime-only write boundary. |
| `.opencode/commands/deep/assets/deep_agent-improvement_auto.yaml` | Workflow | Dispatches the candidate-generation step on each autonomous iteration. |
| `.opencode/commands/deep/assets/deep_agent-improvement_confirm.yaml` | Workflow | Gates candidate generation behind operator approval in interactive mode. |
| `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md` | Skill orchestration | Describes the bounded-candidate rule and the packet-local `candidates/` directory contract. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/references/shared/loop_protocol.md` | Reference | Documents the proposal-first sequence and runtime-only candidate path. |
| `.opencode/skills/system-deep-loop/deep-improvement/references/shared/promotion_rules.md` | Safety reference | Stops the loop when mutator and scorer boundaries blur or scope broadens. |

---

## 4. SOURCE METADATA

- Group: Evaluation loop
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `evaluation-loop/candidate-generation.md`
Related references:
- [initialization.md](initialization.md) — Initialization
- [scoring-dispatch.md](../evaluation_loop/scoring_dispatch.md) — Scoring dispatch
