---
title: "ID-009 -- previewUrl fidelity check gated on the quality floor and anti-default critique"
description: "This scenario validates the previewUrl fidelity check for `ID-009`. It focuses on confirming the completed Open Design run's render is judged against the quality floor and the anti-default critique, never claimed from a run still awaiting input."
---

# ID-009 -- previewUrl fidelity check gated on the quality floor and anti-default critique

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-009`.

---

## 1. OVERVIEW

This scenario validates the `previewUrl` fidelity check for `ID-009`. It focuses on confirming the completed Open Design run's render is judged against the quality floor and the anti-default critique, never claimed from a run still awaiting input.

### Why This Matters

ID-009 closes the gap between "compiles and is responsive" and "matches intent". The parity loop checks the real render through Open Design's `previewUrl` and the build's written files, read via `get_artifact` once `get_run` reports the run completed. Because Open Design is local-first, that preview is local and needs no remote sign-in. The bar is the union of two gates: the render must clear the `ux_quality_reference.md` floor and survive the `design_principles.md` anti-default critique. Two failure modes make this scenario load-bearing. Claiming a finished design from a run left `awaiting_input` with zero files, or from an `od artifacts create` file-add that never renders, is wrong, so it is the negative control here. And "looks roughly like the brief" is a weaker bar than the skill already enforces, so a screenshot alone can never claim completion.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-009` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the fidelity check inspects the completed run's `previewUrl` and written files and judges them against the quality floor and the anti-default critique, never claiming a design from a run still awaiting input.
- Real user request: `Check whether the Open Design generation actually matches the design intent before we hand it off.`
- Prompt: `Verify the Open Design generation actually rendered a design that matches the intent, and tell me if it clears our quality bar.`
- Expected execution process: Use the runId of a completed Open Design generation run (for example one produced by the RUN-001 recipe `od run start --agent opencode --model <explicit>`, or a prior ID-008 build). Follow `references/claude_design_parity.md` Section 5, confirm via `mcp-open-design` `get_run` that the run completed rather than sitting `awaiting_input`, fetch the `previewUrl` and the written files with `get_artifact`, and judge the render against the `ux_quality_reference.md` floor and the anti-default critique.
- Expected signals: Step 1: the run is confirmed completed, not left `awaiting_input` with zero files; Step 2: the `previewUrl` and the written files are fetched via `mcp-open-design`; Step 3: the verdict cites both the quality floor and the anti-default critique, not "looks roughly like the brief"
- Desired user-visible outcome: a fidelity verdict over the real render that names the quality-floor result and the anti-default result, with no pixel-diff claim and no design claimed from an unfinished run or a file-add.
- Pass/fail: PASS if the verdict judges the completed run's render against both gates per `references/claude_design_parity.md` Section 5; FAIL if completion is claimed from a run left `awaiting_input`, from an `od artifacts create` file-add, or from a screenshot alone

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain match-intent language.
2. Confirm the run reached a completed state so a real render exists to judge.
3. Execute the deterministic steps exactly as written, including the negative control.
4. Compare the produced verdict against `references/claude_design_parity.md` Section 5 and the two cited gates.
5. Return a concise final verdict that flags any pixel-diff claim or any design claimed from an unfinished run when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-009 | previewUrl fidelity check gated on the quality floor and anti-default critique | Confirm the fidelity check inspects the completed run's previewUrl and written files and judges them against the quality floor and the anti-default critique, never claiming a design from a run still awaiting input. | `Verify the Open Design generation actually rendered a design that matches the intent, and tell me if it clears our quality bar.` | bash: rg -n "previewUrl" references/claude_design_parity.md -> agent: confirm via mcp-open-design get_run that the run completed rather than awaiting_input with zero files, then fetch the previewUrl and written files with get_artifact -> agent: judge the render against ux_quality_reference.md and the anti-default critique | Step 1: the run is confirmed completed, not left awaiting_input with zero files; Step 2: the previewUrl and written files are fetched via mcp-open-design; Step 3: the verdict cites both the quality floor and the anti-default critique, not "looks roughly like the brief" | Terminal transcript, the fetched previewUrl and file reference, and the two-gate verdict | PASS if the verdict judges the completed run's render against both gates per references/claude_design_parity.md Section 5; FAIL if completion is claimed from a run left awaiting_input, from an od artifacts create file-add, or from a screenshot alone | 1. Re-read references/claude_design_parity.md Section 5 on the fidelity mechanism and the pass/fail bar; 2. Confirm the run reached completed via get_run before judging; 3. Confirm the verdict cites both ux_quality_reference.md and the design_principles.md anti-default critique |

### Optional Supplemental Checks

If `get_run` shows the run still `awaiting_input` with zero files, confirm the protocol's self-heal path: answer the discovery form to fire the build, poll until the run completes, then re-fetch, and keep retries capped at two per Section 5. Keep supplemental evidence separate from the primary verdict. This scenario records SKIP with the missing path if `mcp-open-design` does not resolve on disk.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../references/claude_design_parity.md` | Section 5 fidelity check: the `previewUrl` mechanism, the two-gate bar, and the no-screenshot-alone caveat |
| `../../references/ux_quality_reference.md` | The objective quality floor the render must clear |
| `../../../mcp-open-design/references/tool_surface.md` | The mcp-open-design run and `previewUrl` surface the fidelity check inspects |

---

## 5. SOURCE METADATA

- Group: Claude Design Parity
- Playbook ID: ID-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--claude-design-parity/preview-image-fidelity-check.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
