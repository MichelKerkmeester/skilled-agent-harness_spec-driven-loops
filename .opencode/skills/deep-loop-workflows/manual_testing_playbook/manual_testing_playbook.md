---
title: "deep-loop-workflows: Manual Testing Playbook"
description: "Operator-facing reference for manually validating deep-loop-workflows hub routing, advisor integration, backend discrimination, state discipline, and per-mode artifact ownership against the live skill registry."
version: "1.1.0.0"
---

# deep-loop-workflows: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `deep-loop-workflows` skill and its real `mode-registry.json` source of truth. No mocks, no stubs, and no invented routing behavior. Acceptable verdicts are PASS, PARTIAL, FAIL, or SKIP with a documented sandbox blocker.

This document combines the manual-validation contract for the `deep-loop-workflows` parent-skill hub into a single operator reference. The root playbook acts as the directory, review protocol, and orchestration guide. Per-feature files provide the deeper execution contract for each scenario, including the user request, expected mode, command, agent, backend, artifact root, registry evidence, and binary validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern. The root document acts as the directory, review surface, and orchestration guide; per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--mode-routing/`
- `02--improvement-lane-routing/`
- `03--advisor-integration/`
- `04--runtime-and-backend/`
- `05--state-and-convergence-discipline/`

---

## 1. OVERVIEW

This playbook provides 20 deterministic scenarios across 5 categories validating the `deep-loop-workflows` parent-skill hub. Each feature keeps its stable `{PREFIX}-NNN` ID and links to a dedicated feature file with the full execution contract.

Coverage note: the playbook covers the hub's registry-driven routing at version `1.1.0.0`. It exercises:
- Dominant-intent routing for the lexical modes: `research`, `review`, and `ai-council`.
- Explicit mode-hint override routing, such as `research: <request>`.
- The four improvement lanes that share the `deep-improvement` packet: `agent-improvement`, `model-benchmark`, `skill-benchmark`, and `ai-system-improvement`.
- Advisor integration: the single advisor identity `deep-loop-workflows`, lexical scoring, alias-fold default behavior, command-bridge behavior, and no false fire on ordinary code-edit prompts.
- The three-tier discriminator: `workflowMode`, `runtimeLoopType`, and `backendKind`.
- State and convergence discipline: externalized state, artifact-root writes, convergence stop behavior, and hub logic boundaries.

### Realistic Test Model

1. A realistic user request is given to an orchestrator that has the `deep-loop-workflows` skill registered.
2. The orchestrator consults the skill advisor, command router, or explicit Skill invocation and decides whether to invoke the hub, a `/deep:*` command surface, another skill, or no deep-loop workflow.
3. The operator captures: which skill won the advisor vote, which `workflowMode` was selected, which command and agent surface would be used, which backend was resolved, which artifact root was named, and what the AI's response actually was.
4. The scenario passes only when the routing matches `mode-registry.json`, the source evidence is quoted or cited, and the user-visible outcome is sound for a real operator.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior.
- The expected mode, command, agent, backend, and artifact root.
- Why that route is expected, quoting the matching `aliases`, `advisorRouting`, `command`, `agent`, `runtimeLoopType`, `backendKind`, or `artifactRoot` fields from `mode-registry.json`.
- The expected packet and whether it owns mode behavior or the hub only routes to it.
- The pass/fail criteria with binary grading.
- Failure triage steps.

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. The hub skill is present at `.opencode/skills/deep-loop-workflows/`.
3. `.opencode/skills/deep-loop-workflows/SKILL.md` states that `mode-registry.json` is the single source of truth and that the hub holds no per-mode convergence, state, or synthesis logic.
4. `.opencode/skills/deep-loop-workflows/mode-registry.json` contains exactly 7 active modes in its `modes` array.
5. The skill advisor at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py` is callable when advisor scenarios are executed.
6. The orchestrator runtime can invoke `Skill(deep-loop-workflows)` and can run `/deep:*` command prompts, or the operator can capture equivalent dry-run routing transcripts.
7. Operator evidence is written under `/tmp/dlw-<SCENARIO-ID>/` and never into project source paths unless a scenario explicitly states the mode's real artifact-root contract.
8. Multi-scenario waves cap at 5 parallel advisor probes. Command-bridge and state-discipline checks that may create artifacts run serially.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact user prompt that was tested.
- The skill advisor output or command invocation transcript.
- The selected `workflowMode`.
- The registry fields used to justify the route.
- The resolved command, agent, packet, backend, and artifact root.
- The AI's user-visible response.
- The scenario verdict: PASS, PARTIAL, FAIL, or SKIP with one-line rationale.
- Output transcripts saved under `/tmp/dlw-<SCENARIO-ID>/`.

---

## 4. DETERMINISTIC COMMAND NOTATION

- Skill advisor probe: `python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "<prompt>" --threshold 0.8`.
- Skill hub invocation: `Skill(deep-loop-workflows, "<prompt>")`.
- Command-surface invocation: enter the exact `/deep:*` command and prompt into the orchestrator runtime.
- Registry check: read `.opencode/skills/deep-loop-workflows/mode-registry.json` and compare the selected mode to the matching `modes[]` entry.
- Resource path notation: paths shown relative to `.opencode/skills/deep-loop-workflows/` unless explicitly stated otherwise.
- All evidence files live under `/tmp/dlw-<SCENARIO-ID>/`.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`.
2. Per-feature files under `manual_testing_playbook/{NN--category-name}/`.
3. Scenario execution evidence: advisor outputs, command transcripts, registry excerpts, and AI responses.
4. Feature-to-scenario coverage map in this file.
5. Triage notes for all PARTIAL and FAIL outcomes.

### Scenario Acceptance Rules

For each executed scenario, check:
1. Preconditions were satisfied.
2. Exact prompt was used verbatim.
3. The observed route matched the expected registry entry.
4. The command, agent, packet, backend, and artifact root matched the registry.
5. Advisor behavior matched the declared `advisorRouting.routingClass` when the scenario exercises advisor routing.
6. The hub did not invent per-mode behavior outside the packet that owns it.
7. The user-visible outcome would satisfy a real operator with the originating request.

### Verdict Rules

- `PASS`: all 7 acceptance checks true.
- `PARTIAL`: selected mode is correct but secondary evidence is incomplete, such as missing artifact-root transcript.
- `FAIL`: wrong skill, wrong mode, wrong command, wrong agent, wrong backend, wrong artifact root, invented registry behavior, or flattened per-mode logic.
- `SKIP`: documented external blocker, such as advisor binary unavailable in the sandbox.

### Feature Verdict Rules

- `PASS`: all mapped scenarios for the feature are PASS.
- `PARTIAL`: at least one mapped scenario is PARTIAL, none are FAIL.
- `FAIL`: any mapped scenario is FAIL.

### Release Readiness Rule

Release is READY only when:
1. No feature verdict is FAIL.
2. All critical scenarios are PASS: MR-001, MR-002, MR-003, IL-001, IL-002, IL-003, IL-004, AI-001, AI-004, RB-001, RB-003, RB-004, SC-001, SC-002, SC-004.
3. Coverage is 100% of playbook scenarios: 20 / 20.
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic and routing-architecture explanations in this root playbook. Put scenario-specific prompts, registry excerpts, acceptance caveats, artifact-root expectations, and triage in the matching per-feature files.

---

## 6. CATEGORY INDEX

### Mode Routing (`MR-001..MR-004`)

| Feature ID | Feature Name | Scenario Name / Objective | Per-Feature File | Critical Path |
|---|---|---|---|---|
| `MR-001` | Research Routing | Outward investigation request resolves to `research` | `01--mode-routing/research-routing.md` | Yes |
| `MR-002` | Review Routing | Iterative code-audit request resolves to `review` | `01--mode-routing/review-routing.md` | Yes |
| `MR-003` | AI Council Routing | Multi-seat planning deliberation resolves to `ai-council` | `01--mode-routing/ai-council-routing.md` | Yes |
| `MR-004` | Mode-Hint Override | Explicit `research:` hint overrides ambiguous wording | `01--mode-routing/mode-hint-override.md` | No |

### Improvement Lane Routing (`IL-001..IL-004`)

| Feature ID | Feature Name | Scenario Name / Objective | Per-Feature File | Critical Path |
|---|---|---|---|---|
| `IL-001` | Agent Improvement | Alias-fold default routes agent evaluation to `agent-improvement` | `02--improvement-lane-routing/agent-improvement.md` | Yes |
| `IL-002` | Model Benchmark | `/deep:model-benchmark` command routes to `model-benchmark` | `02--improvement-lane-routing/model-benchmark.md` | Yes |
| `IL-003` | Skill Benchmark | `/deep:skill-benchmark` command routes to `skill-benchmark` | `02--improvement-lane-routing/skill-benchmark.md` | Yes |
| `IL-004` | AI System Improvement | `/deep:ai-system-improvement` command routes to `ai-system-improvement` | `02--improvement-lane-routing/ai-system-improvement.md` | Yes |

### Advisor Integration (`AI-001..AI-004`)

| Feature ID | Feature Name | Scenario Name / Objective | Per-Feature File | Critical Path |
|---|---|---|---|---|
| `AI-001` | Single Advisor Identity | Positive deep-loop controls surface `deep-loop-workflows` as the hub identity | `03--advisor-integration/single-advisor-identity.md` | Yes |
| `AI-002` | Lexical Mode Scoring | Lexical modes are scored through their `legacyAdvisorId` entries | `03--advisor-integration/lexical-mode-scoring.md` | No |
| `AI-003` | Command-Bridge Guard | Command-bridge modes do not fire from bare advisor aliases | `03--advisor-integration/command-bridge-guard.md` | No |
| `AI-004` | No False Fire | Plain code-edit prompt routes to `sk-code`, not deep-loop | `03--advisor-integration/no-false-fire-code-edit.md` | Yes |

### Runtime and Backend (`RB-001..RB-004`)

| Feature ID | Feature Name | Scenario Name / Objective | Per-Feature File | Critical Path |
|---|---|---|---|---|
| `RB-001` | Runtime Loop Research | `research` resolves to `runtime-loop-type` and `runtimeLoopType: research` | `04--runtime-and-backend/runtime-loop-research.md` | Yes |
| `RB-002` | Runtime Loop Council | `ai-council` resolves to `runtime-loop-type` and `runtimeLoopType: council` | `04--runtime-and-backend/runtime-loop-council.md` | No |
| `RB-003` | Improvement Host | `agent-improvement` resolves to `improvement-host` and null runtime loop type | `04--runtime-and-backend/improvement-host.md` | Yes |
| `RB-004` | External Adapter | `ai-system-improvement` resolves to `external-adapter` and null runtime loop type | `04--runtime-and-backend/external-adapter.md` | Yes |

### State and Convergence Discipline (`SC-001..SC-004`)

| Feature ID | Feature Name | Scenario Name / Objective | Per-Feature File | Critical Path |
|---|---|---|---|---|
| `SC-001` | Externalized State | Runtime modes use packet-owned externalized state, not manual `/tmp` state | `05--state-and-convergence-discipline/externalized-state.md` | Yes |
| `SC-002` | Artifact Root Writes | Iterations write to the mode's registry artifact root | `05--state-and-convergence-discipline/artifact-root-writes.md` | Yes |
| `SC-003` | Convergence Stop | Convergence detection ends the loop rather than continuing indefinitely | `05--state-and-convergence-discipline/convergence-stop.md` | No |
| `SC-004` | Hub Logic Boundary | Hub holds no per-mode convergence, state, or synthesis logic | `05--state-and-convergence-discipline/hub-logic-boundary.md` | Yes |

---

## 7. AUTOMATED TEST CROSS-REFERENCE

Automated drift guards may exist for advisor projection maps, but this playbook is the manual validation surface for operator-observed routing behavior. Do not treat an automated guard as a substitute for the scenario transcripts unless the feature file explicitly allows the automated output as supporting evidence.

Tests NOT covered by automation here:
- End-to-end advisor prompt behavior for the 20 manual scenarios.
- Operator-visible command routing transcript quality.
- Runtime response shape proving the hub stayed routing-only.
- Artifact-root and state-discipline evidence from live iteration dry-runs.

---

## 8. FEATURE CATALOG CROSS-REFERENCE INDEX

| Category | Scenario Range | Scenario Count |
|---|---:|---:|
| Mode Routing | `MR-001..MR-004` | 4 |
| Improvement Lane Routing | `IL-001..IL-004` | 4 |
| Advisor Integration | `AI-001..AI-004` | 4 |
| Runtime and Backend | `RB-001..RB-004` | 4 |
| State and Convergence Discipline | `SC-001..SC-004` | 4 |

**Total scenarios**: 20
**Critical-path scenarios**: 15
**Categories**: 5
