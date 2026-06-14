---
title: "ID-009 -- previewImageUrl fidelity check gated on the quality floor and anti-default critique"
description: "This scenario validates the previewImageUrl fidelity check for `ID-009`. It focuses on confirming the real render is judged against the quality floor and the anti-default critique, not a browser screenshot of the session-gated canvas."
---

# ID-009 -- previewImageUrl fidelity check gated on the quality floor and anti-default critique

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `ID-009`.

---

## 1. OVERVIEW

This scenario validates the `previewImageUrl` fidelity check for `ID-009`. It focuses on confirming the real render is judged against the quality floor and the anti-default critique, not a browser screenshot of the session-gated canvas.

### Why This Matters

ID-009 closes the gap between "compiles and is responsive" and "matches intent". The parity loop checks the real render through the backend-rendered `previewImageUrl`, which is already authenticated and needs no browser. The bar is the union of two gates: the render must clear the `ux_quality_reference.md` floor and survive the `design_principles.md` anti-default critique. Two failure modes make this scenario load-bearing. Driving a browser at the `view` or `share` canvas URL is wrong because that URL is session-gated and redirects to sign-in, so it is the negative control here. And "looks roughly like the brief" is a weaker bar than the skill already enforces, so a screenshot alone can never claim completion.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `ID-009` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the fidelity check fetches the backend-rendered `previewImageUrl` and judges it against the quality floor and the anti-default critique, without a browser screenshot of the session-gated canvas.
- Real user request: `Check whether the built canvas component actually matches the design intent before we hand it off.`
- Prompt: `Verify the built MagicPath component matches the design intent using its rendered preview, and tell me if it clears our quality bar.`
- Expected execution process: Follow `references/claude_design_parity.md` Section 5, fetch the latest revision's `previewImageUrl` with `scripts/design_fidelity.py`, judge the render against the `ux_quality_reference.md` floor and the anti-default critique, and do not drive a browser against the `view` or `share` canvas URL.
- Expected signals: Step 1: the helper fetches the backend-rendered `previewImageUrl` for the latest revision; Step 2: the verdict cites both the quality floor and the anti-default critique, not "looks roughly like the brief"; Step 3: no browser screenshot of the session-gated `view` or `share` canvas URL is used
- Desired user-visible outcome: a fidelity verdict over the real render that names the quality-floor result and the anti-default result, with no pixel-diff claim and no browser screenshot of the hosted canvas.
- Pass/fail: PASS if the verdict judges the fetched `previewImageUrl` against both gates per `references/claude_design_parity.md` Section 5; FAIL if completion is claimed from a screenshot alone, or if a browser is driven at the session-gated canvas URL

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain match-intent language.
2. Confirm a built revision exists so a render is available to judge.
3. Execute the deterministic steps exactly as written, including the negative control.
4. Compare the produced verdict against `references/claude_design_parity.md` Section 5 and the two cited gates.
5. Return a concise final verdict that flags any pixel-diff claim or session-gated browser screenshot when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| ID-009 | previewImageUrl fidelity check gated on the quality floor and anti-default critique | Confirm the fidelity check fetches the backend-rendered previewImageUrl and judges it against the quality floor and the anti-default critique, without a browser screenshot of the session-gated canvas. | `Verify the built MagicPath component matches the design intent using its rendered preview, and tell me if it clears our quality bar.` | bash: rg -n "previewImageUrl" references/claude_design_parity.md -> bash: python3 ../mcp-magicpath/scripts/design_fidelity.py --project <id> --component <name> -> agent: judge the render against ux_quality_reference.md and the anti-default critique | Step 1: the helper fetches the backend-rendered previewImageUrl for the latest revision; Step 2: the verdict cites both the quality floor and the anti-default critique, not "looks roughly like the brief"; Step 3: no browser screenshot of the session-gated view or share canvas URL is used | Terminal transcript, the fetched preview reference, and the two-gate verdict | PASS if the verdict judges the fetched previewImageUrl against both gates per references/claude_design_parity.md Section 5; FAIL if completion is claimed from a screenshot alone, or a browser is driven at the session-gated canvas URL | 1. Re-read references/claude_design_parity.md Section 5 on the fidelity mechanism and the pass/fail bar; 2. Confirm the verdict cites both ux_quality_reference.md and the design_principles.md anti-default critique; 3. Re-run the fetch via design_fidelity.py and judge the render without a browser screenshot |

### Optional Supplemental Checks

If the helper returns no `previewImageUrl` yet, confirm the protocol's self-heal path: run the build to `completed` first, then re-fetch, and keep retries capped at two per Section 5. Keep supplemental evidence separate from the primary verdict. This scenario records SKIP with the missing skill path if `mcp-magicpath` does not resolve on disk.

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
| `../../references/claude_design_parity.md` | Section 5 fidelity check: the `previewImageUrl` mechanism, the two-gate bar, and the no-browser-screenshot caveat |
| `../../references/ux_quality_reference.md` | The objective quality floor the render must clear |
| `../mcp-magicpath/scripts/design_fidelity.py` | Query-only helper that fetches the backend-rendered preview for judgment |

---

## 5. SOURCE METADATA

- Group: Claude Design Parity
- Playbook ID: ID-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `07--claude-design-parity/preview-image-fidelity-check.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
