---
title: "create-benchmark: Manual Testing Playbook"
description: "Operator playbook for the create-benchmark workflow across MCP promotion, behavior, skill-benchmark, model-benchmark and agent-improvement inputs."
version: 1.0.0.0
---

# create-benchmark: Manual Testing Playbook

This playbook validates the `sk-create-benchmark` workflow as an authoring tool. It checks family routing, package shape, lane boundaries and evidence storage guidance. It does not run a benchmark or score a model.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into the skill benchmark reports folder. Generated report Markdown is renderer-owned.

## 1. OVERVIEW

The package covers family routing, benchmark package authoring and evidence boundaries. Scenarios use the shipped `SKILL.md`, README, references and scripts as sources. There is no feature catalog for this mode. Each scenario carries its full execution contract in one category file.

The key negative checks are refusal and boundary checks. A correct run leaves an in-flight benchmark in the spec packet. It leaves scoring, runners and renderer-owned reports in their owning lane. It also keeps model fixtures and profiles as data-only inputs.

---

## 2. GLOBAL PRECONDITIONS

1. Run commands from the repository root.
2. Read the family table in `SKILL.md` before selecting a package shape.
3. Use a completed benchmark only when testing MCP promotion. The promotion gate requires an accepted decision, a stable fixture and replay commands.
4. Do not write into the playbook package during scenario execution. If a scenario creates a draft elsewhere, record the recovery path before running it.
5. Treat `skill-benchmark-report.md` as renderer-owned. Do not edit it by hand.
6. A `SKIP` verdict is valid only when a named sandbox or runtime blocker prevents the command from running.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact user request and exact operator prompt.
- The family selected and the source rule that selected it.
- The files and commands read during the run.
- The expected package shape or lane boundary.
- The observed output and command exit status.
- The working-tree status for any path the run could write.
- A `PASS`, `FAIL` or `SKIP` verdict with a reason.

An answer without source evidence does not pass. A plausible package with the wrong family does not pass. A package that crosses into scoring or renderer ownership does not pass.

---

## 4. DETERMINISTIC COMMAND NOTATION

- `bash:` marks a shell command.
- `agent:` marks a read or reasoning step.
- `->` separates sequential steps.
- Paths are repository-relative.
- Commands are read-only unless the scenario states a recovery path.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

For each scenario, confirm that the prompt was used as written, every expected source was read, the expected family or refusal was observed and the evidence is complete. A scenario passes only when its output matches the named contract.

The package is releasable when all mapped scenarios pass, no family boundary is crossed and no unresolved triage item remains. A failure in family routing or in a lane-owned boundary blocks the package review.

---

## 6. ORCHESTRATION AND WAVE PLANNING

Run the family-routing scenarios first. They decide which references the later checks should use. Run package-shape scenarios next. Run storage and boundary scenarios last because they depend on the selected family. Keep renderer-owned report checks separate from authored index checks. Record the selected family, the scenario file and the evidence path for every wave.

---

## 7. FAMILY ROUTING (`BMR-001..BMR-002`)

### BMR-001 | Promote a completed MCP result

Verify that an accepted MCP bake-off routes to a skill-local promotion folder with a report, source pointer and copied evidence.

> **Scenario:** [BMR-001](family-routing/promote-mcp-result.md)

### BMR-002 | Leave an in-flight benchmark in the packet

Verify that an unfinished or unreplayable result is not promoted into a live skill tree.

> **Scenario:** [BMR-002](family-routing/leave-in-flight-benchmark.md)

---

## 8. BENCHMARK FAMILY PACKAGES (`BMR-003..BMR-005`)

### BMR-003 | Author a behavior benchmark package

Verify the behavior package shape and the boundary between scenario contracts and run evidence.

> **Scenario:** [BMR-003](benchmark-families/author-behavior-package.md)

### BMR-004 | Author a Lane C index

Verify that a skill-benchmark request creates or updates `benchmark/README.md` and leaves rendered reports to the Lane C harness.

> **Scenario:** [BMR-004](benchmark-families/author-lane-c-index.md)

### BMR-005 | Match a Lane B fixture to its scorer

Verify that model-benchmark inputs are data-only and that a profile uses a scorer that matches the fixture shape.

> **Scenario:** [BMR-005](benchmark-families/match-lane-b-fixture.md)

---

## 9. EVIDENCE AND LANE BOUNDARIES (`BMR-006..BMR-007`)

### BMR-006 | Archive compiled-routing evidence safely

Verify the serving snapshot schema and fail-closed compiled-routing archive rules.

> **Scenario:** [BMR-006](evidence-and-boundaries/archive-compiled-routing-safely.md)

### BMR-007 | Prepare Lane A inputs without scoring

Verify that agent-improvement authoring fills setup inputs and candidates while the deep-improvement lane owns scoring and promotion.

> **Scenario:** [BMR-007](evidence-and-boundaries/prepare-lane-a-inputs.md)

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Check | Coverage | Playbook overlap |
|---|---|---|
| `validate_document.py` | Markdown structure for authored benchmark docs | Confirms document shape but not family selection |
| `render-serving-snapshot.cjs` | Serving snapshot schema and live manifest capture | Direct on BMR-006 |
| `archive-compiled-routing.cjs` | Fail-closed archive labels and provenance | Direct on BMR-006 |
| Lane C renderer and runner | Run reports and scoring | Deliberately outside this authoring packet. BMR-004 checks the boundary |

This playbook records operator-visible authoring behavior. It does not duplicate the Lane C scoring contract, the Lane B evaluator or the behavior-benchmark framework.
