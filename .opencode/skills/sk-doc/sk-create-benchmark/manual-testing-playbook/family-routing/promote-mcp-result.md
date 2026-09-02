---
title: "BMR-001 -- Promote a completed MCP result"
description: "This scenario validates MCP promotion for BMR-001. A completed result with an accepted decision, stable fixture and replay commands becomes a skill-local benchmark report and source pointer."
version: 1.5.0.3
---

# BMR-001 -- Promote a completed MCP result

This document captures the operator contract for promoting a completed MCP benchmark into a consuming skill.

## 1. OVERVIEW

This scenario validates MCP promotion for `BMR-001`. It focuses on the adoption gate and the required report artifacts.

### Why This Matters

The promotion path is for a completed measurable MCP result that already has an accepted decision record. A report without a stable fixture or replay commands cannot be reproduced by the next operator. The skill should route the request to the `shared` family and preserve the source packet as the audit location.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BMR-001` and confirm the expected signals.

- Objective: route a completed MCP bake-off to the MCP promotion family and identify its required artifacts
- Realistic user request: `The retrieval bake-off is finished and the decision was accepted. Put the result where MCP operators will find it.`
- Prompt: `Promote this completed MCP bake-off into the consuming skill. Check that the decision is accepted, the fixture is stable and the replay commands are recorded.`
- Expected execution process: `SKILL.md` section 2 selects MCP promotion, the adoption gate is checked, the target skill and `mcp-server/` are confirmed, the dated folder is selected from the execution date and the report plus source pointer are authored from the shared templates.
- Expected signals: the reply names MCP promotion, lists `benchmark-report.md`, `source.md` and the required evidence files and refuses to compare unrelated MCP stacks. It does not claim that the benchmark was run by this skill.
- Desired user-visible outcome: a reproducible promotion plan with a clear source pointer and a report shape that an MCP operator can open first.
- Pass/fail: PASS if the promotion gate and artifacts are named with source evidence. FAIL if the family is misrouted, a scorer is authored or the run is promoted without a stable fixture.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Promote this completed MCP bake-off into the consuming skill. Check that the decision is accepted, the fixture is stable and the replay commands are recorded.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| BMR-001 | Promote a completed MCP result | Route a completed MCP bake-off to the promotion family | `Promote this completed MCP bake-off into the consuming skill. Check that the decision is accepted, the fixture is stable and the replay commands are recorded.` | 1. `agent: Read SKILL.md section 2 and identify the MCP promotion family` -> 2. `agent: Read SKILL.md section 3 and list the adoption gate` -> 3. `bash: test -d .opencode/skills/system-spec-kit/mcp-server` -> 4. `agent: State the report, source and copied-evidence artifacts` | Steps 1 and 2 select the `shared` family and name the accepted decision, stable fixture and replay commands. Step 3 exits 0. Step 4 names the ten-section report, source pointer and evidence files | Exact prompt, quoted adoption gate, command output and exit status, target check, artifact list and family decision | PASS if all gate inputs and artifacts are evidenced. FAIL if the run invents a winner, skips the target check or crosses into scoring | 1. Confirm the family table was read. 2. Recheck the adoption gate. 3. Confirm the run describes authoring only and does not claim execution |

### Commands

1. `agent: Read SKILL.md section 2 and identify the MCP promotion family`
2. `agent: Read SKILL.md section 3 and list the adoption gate`
3. `bash: test -d .opencode/skills/system-spec-kit/mcp-server`
4. `agent: State the report, source and copied-evidence artifacts`

### Expected

The family is MCP promotion. The adoption gate requires a measurable MCP surface, a completed benchmark inside a spec packet, an accepted decision, a stable fixture and replay commands. The target directory exists. The output names `benchmark-report.md`, `source.md`, `results.csv` and any applicable per-probe or runtime files. It keeps scoring and execution in the owning lane.

### Evidence

Capture the prompt, the relevant `SKILL.md` sections, the target-directory output and exit status, the gate decision and the artifact list.

### Pass / Fail

- **Pass**: MCP promotion is selected from the family table and every gate input and required artifact is named with evidence.
- **Fail**: the result is promoted without a stable fixture or accepted decision, the skill claims to run or score it or the wrong family is selected.

### Failure Triage

1. Re-read the family table and confirm the request describes a completed MCP result.
2. Check each adoption-gate input separately.
3. Confirm the report is curated and the source file points back to the packet.
4. Remove any claim that this authoring workflow runs a benchmark or owns scoring.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| No feature-catalog entry | This mode has no catalog package for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Family routing, adoption gate and MCP promotion package shape |
| [`README.md`](../../README.md) | MCP promotion overview and verification wording |
| [`references/shared/README.md`](../../references/shared/README.md) | MCP promotion reference map |

---

## 5. SOURCE METADATA

- Group: FAMILY ROUTING
- Playbook ID: BMR-001
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `family-routing/promote-mcp-result.md`
