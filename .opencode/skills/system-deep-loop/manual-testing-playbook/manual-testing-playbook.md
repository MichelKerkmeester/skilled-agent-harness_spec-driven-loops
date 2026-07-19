---
title: "system-deep-loop: Manual Testing Playbook"
description: "Operator-facing reference for manually validating system-deep-loop hub routing, advisor integration, backend discrimination, state discipline, and per-mode artifact ownership against the live skill registry."
version: "2.0.0.0"
---

# system-deep-loop: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `system-deep-loop` skill and its real `mode-registry.json` source of truth. No mocks, no stubs, and no invented routing behavior. Acceptable verdicts are PASS, PARTIAL, FAIL, or SKIP with a documented sandbox blocker.

This document combines the manual-validation contract for the `system-deep-loop` parent-skill hub into a single operator reference. The root playbook acts as the directory, review protocol, and orchestration guide. Per-feature files provide the deeper execution contract for each scenario, including the user request, expected mode, command, agent, backend, artifact root, registry evidence, and binary validation criteria.

---

This playbook package adopts the typed per-scenario split-document pattern. The root document acts as the directory, review surface, and orchestration guide; each per-scenario file in the category folders carries typed routing gold in its YAML frontmatter plus the full execution contract in its body.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `mode-routing/`
- `improvement-lane-routing/`
- `advisor-integration/`
- `runtime-and-backend/`
- `state-and-convergence-discipline/`

---

## 1. OVERVIEW

This playbook provides 20 deterministic scenarios across 5 categories validating the `system-deep-loop` parent-skill hub. Each scenario keeps its stable `{PREFIX}-NNN` ID in a dedicated per-scenario file whose YAML frontmatter carries the typed routing gold and whose body holds the full execution contract.

Coverage note: the playbook covers the hub's registry-driven routing at version `2.0.0.0`. It exercises:
- Dominant-intent routing for the lexical modes: `research`, `review`, and `ai-council`.
- Explicit mode-hint override routing, such as `research: <request>`.
- The three improvement lanes that share the `deep-improvement` packet: `agent-improvement`, `model-benchmark`, and `skill-benchmark`.
- Advisor integration: the single advisor identity `system-deep-loop`, lexical scoring, alias-fold default behavior, command-bridge behavior, and no false fire on ordinary code-edit prompts.
- The three-tier discriminator: `workflowMode`, `runtimeLoopType`, and `backendKind`.
- State and convergence discipline: externalized state, artifact-root writes, convergence stop behavior, and hub logic boundaries.

### Realistic Test Model

1. A realistic user request is given to an orchestrator that has the `system-deep-loop` skill registered.
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
2. The hub skill is present at `.opencode/skills/system-deep-loop/`.
3. `.opencode/skills/system-deep-loop/SKILL.md` states that `mode-registry.json` is the single source of truth and that the hub holds no per-mode convergence, state, or synthesis logic.
4. `.opencode/skills/system-deep-loop/mode-registry.json` contains exactly 7 active modes in its `modes` array.
5. The skill advisor at `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py` is callable when advisor scenarios are executed.
6. The orchestrator runtime can invoke `Skill(system-deep-loop)` and can run `/deep:*` command prompts, or the operator can capture equivalent dry-run routing transcripts.
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

- Skill advisor probe: `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py "<prompt>" --threshold 0.8`.
- Skill hub invocation: `Skill(system-deep-loop, "<prompt>")`.
- Command-surface invocation: enter the exact `/deep:*` command and prompt into the orchestrator runtime.
- Registry check: read `.opencode/skills/system-deep-loop/mode-registry.json` and compare the selected mode to the matching `modes[]` entry.
- Resource path notation: paths shown relative to `.opencode/skills/system-deep-loop/` unless explicitly stated otherwise.
- All evidence files live under `/tmp/dlw-<SCENARIO-ID>/`.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`.
2. Per-feature files under `manual-testing-playbook/{NN--category-name}/`.
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
2. All critical scenarios are PASS: MO-001, MO-002, MO-003, MO-005, IL-001, IL-002, IL-003, AI-001, AI-004, RB-001, RB-003, SC-001, SC-002, SC-004.
3. Coverage is 100% of playbook scenarios: 20 / 20.
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic and routing-architecture explanations in this root playbook. Put scenario-specific prompts, registry excerpts, acceptance caveats, artifact-root expectations, and triage in the matching per-feature files.

---

## 6. CATEGORY INDEX

### Mode Routing (`MO-001..MO-005`)

| Feature ID | Feature Name | Scenario Name / Objective | Per-Feature File | Critical Path |
|---|---|---|---|---|
| `MO-001` | Research Routing | Outward investigation request resolves to `research` | `mode-routing/research-routing.md` | Yes |
| `MO-002` | Review Routing | Iterative review request resolves to `review` | `mode-routing/review-routing.md` | Yes |
| `MO-003` | AI Council Routing | Multi-seat planning deliberation resolves to `ai-council` | `mode-routing/ai-council-routing.md` | Yes |
| `MO-004` | Mode-Hint Override | Explicit `research:` hint overrides ambiguous wording | `mode-routing/mode-hint-override.md` | No |
| `MO-005` | Alignment Routing | Read-only conformance audit against a named standard resolves to `alignment` | `mode-routing/alignment-routing.md` | Yes |

### Improvement Lane Routing (`IL-001..IL-003`)

| Feature ID | Feature Name | Scenario Name / Objective | Per-Feature File | Critical Path |
|---|---|---|---|---|
| `IL-001` | Agent Improvement | Alias-fold default routes agent evaluation to `agent-improvement` | `improvement-lane-routing/agent-improvement.md` | Yes |
| `IL-002` | Model Benchmark | `/deep:model-benchmark` command routes to `model-benchmark` | `improvement-lane-routing/model-benchmark.md` | Yes |
| `IL-003` | Skill Benchmark | `/deep:skill-benchmark` command routes to `skill-benchmark` | `improvement-lane-routing/skill-benchmark.md` | Yes |

### Advisor Integration (`AI-001..AI-004`)

| Feature ID | Feature Name | Scenario Name / Objective | Per-Feature File | Critical Path |
|---|---|---|---|---|
| `AI-001` | Single Advisor Identity | Positive deep-loop controls surface `system-deep-loop` as the hub identity | `advisor-integration/single-advisor-identity.md` | Yes |
| `AI-002` | Lexical Mode Scoring | Lexical modes are scored through their `legacyAdvisorId` entries | `advisor-integration/lexical-mode-scoring.md` | No |
| `AI-003` | Command-Bridge Guard | Command-bridge modes do not fire from bare advisor aliases | `advisor-integration/command-bridge-guard.md` | No |
| `AI-004` | No False Fire | Plain code-edit prompt routes to `sk-code`, not deep-loop | `advisor-integration/no-false-fire-code-edit.md` | Yes |

### Runtime and Backend (`RB-001..RB-004`)

| Feature ID | Feature Name | Scenario Name / Objective | Per-Feature File | Critical Path |
|---|---|---|---|---|
| `RB-001` | Runtime Loop Research | `research` resolves to `runtime-loop-type` and `runtimeLoopType: research` | `runtime-and-backend/runtime-loop-research.md` | Yes |
| `RB-002` | Runtime Loop Council | `ai-council` resolves to `runtime-loop-type` and `runtimeLoopType: council` | `runtime-and-backend/runtime-loop-council.md` | No |
| `RB-003` | Improvement Host | `agent-improvement` resolves to `improvement-host` and null runtime loop type | `runtime-and-backend/improvement-host.md` | Yes |
| `RB-004` | Retired Backend | Retired runtime-and-backend scenario; no active mode uses this backend (negative marker) | `runtime-and-backend/external-adapter.md` | No |

### State and Convergence Discipline (`SC-001..SC-004`)

| Feature ID | Feature Name | Scenario Name / Objective | Per-Feature File | Critical Path |
|---|---|---|---|---|
| `SC-001` | Externalized State | Runtime modes use packet-owned externalized state, not manual `/tmp` state | `state-and-convergence-discipline/externalized-state.md` | Yes |
| `SC-002` | Artifact Root Writes | Iterations write to the mode's registry artifact root | `state-and-convergence-discipline/artifact-root-writes.md` | Yes |
| `SC-003` | Convergence Stop | Convergence detection ends the loop rather than continuing indefinitely | `state-and-convergence-discipline/convergence-stop.md` | No |
| `SC-004` | Hub Logic Boundary | Hub holds no per-mode convergence, state, or synthesis logic | `state-and-convergence-discipline/hub-logic-boundary.md` | Yes |

---

## 7. AUTOMATED TEST CROSS-REFERENCE

Automated drift guards may exist for advisor projection maps, but this playbook is the manual validation surface for operator-observed routing behavior. Do not treat an automated guard as a substitute for the scenario transcripts unless the feature file explicitly allows the automated output as supporting evidence.

Tests NOT covered by automation here:
- End-to-end advisor prompt behavior for the 20 manual scenarios.
- Operator-visible command routing transcript quality.
- Runtime response shape proving the hub stayed routing-only.
- Artifact-root and state-discipline evidence from live iteration dry-runs.

---

## 8. SCENARIO DIRECTORY

Each scenario lives in its category folder as a typed per-scenario file: its YAML
frontmatter carries `id`, `stage`, `expected_workflow_mode`, and
`expected_leaf_resources` (packet-local `{workflow_mode, leaf_resource_id}` gold),
so the benchmark corpus loader reads it directly and the pre-dispatch topology
gate (`validate-playbook-topology.cjs`) can validate the gold against
`leaf-manifest.json`. This package therefore uses the typed per-scenario shape
(no root `Feature ID | file | Yes/No` cross-reference table); the surface router
that supplies the observed leaf addresses lives at
`shared/references/smart-routing.md`.

- **Mode Routing** (`mode-routing/`): `MO-001` research, `MO-002` review, `MO-003` ai-council, `MO-004` mode-hint override, `MO-005` alignment.
- **Improvement Lane Routing** (`improvement-lane-routing/`): `IL-001` agent-improvement (typed), `IL-002` model-benchmark, `IL-003` skill-benchmark.
- **Advisor Integration** (`advisor-integration/`): `AI-001` single advisor identity, `AI-002` lexical mode scoring, `AI-003` command-bridge guard, `AI-004` no false fire on code edit.
- **Runtime and Backend** (`runtime-and-backend/`): `RB-001` runtime-loop research, `RB-002` runtime-loop council, `RB-003` improvement host, `RB-004` retired backend.
- **State and Convergence Discipline** (`state-and-convergence-discipline/`): `SC-001` externalized state, `SC-002` artifact-root writes, `SC-003` convergence stop, `SC-004` hub logic boundary.

**Total scenarios**: 20
**Typed leaf-resource gold**: `MO-001`, `MO-002`, `MO-003`, `MO-005`, `IL-001` (the five distinct-packet modes). The three improvement lanes multiplex onto one `deep-improvement` packet, so only the first-declared lane (`agent-improvement`, `IL-001`) resolves to a distinct observed workflow mode; `IL-002`/`IL-003` carry empty typed gold by design (shared-packet fan-out).
**Categories**: 5
