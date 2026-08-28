---
title: "COMM-010 -- Explain-visually selects modality"
description: "This scenario validates that invoking the command on a control-flow subject yields a call tree rather than prose, with protected spans reproduced byte-exact."
catalog_applicable: true
version: 1.0.0.0
---

# COMM-010 -- Explain-visually selects modality

This file is the canonical operator contract for the modality-selection dial of `/rewrite:explain-visually`.

---

## 1. OVERVIEW

This scenario verifies that a control-flow subject renders as a call tree, not prose, and that every protected identifier and path in the subject is reproduced byte-for-byte in the rendered output.

### Why This Matters

Modality selection has no value if a runtime control-flow subject renders as another paragraph of prose instead of a structural diagram, or if the rendered form silently renames, truncates, or paraphrases an identifier the operator needs to trust.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm that `/rewrite:explain-visually` selects a call tree for a runtime control-flow subject and reproduces every protected span byte-exact.
- Real user request: `/rewrite:explain-visually how does route_resources in .opencode/skills/sk-communication/SKILL.md decide the lane using select_lane, discover_markdown_resources, and EXPLANATION_SIGNALS`
- Prompt: `/rewrite:explain-visually how does route_resources in .opencode/skills/sk-communication/SKILL.md decide the lane using select_lane, discover_markdown_resources, and EXPLANATION_SIGNALS`
- Expected execution process: Invoke the slash command directly in an operator session, then inspect the rendered visual and the terminal `STATUS=` line.
- Expected signals: The rendered output is a structural call tree (indented function names joined by branch markers), not paragraph prose; a `STATUS=OK` line closes the reply; and `route_resources`, `select_lane`, `discover_markdown_resources`, `EXPLANATION_SIGNALS`, and `.opencode/skills/sk-communication/SKILL.md` appear in the output exactly as written in the prompt.
- Desired user-visible outcome: A call tree showing `route_resources` dispatching to `select_lane` and `discover_markdown_resources`, with `EXPLANATION_SIGNALS` and the source path reproduced byte-for-byte.
- Pass/fail: PASS if the output is a call tree or equivalent structural diagram and every protected identifier and path is byte-identical to the prompt; FAIL if the output is prose instead of a structural visual, or any identifier or path is altered, abbreviated, or paraphrased; SKIP only when the `/rewrite:explain-visually` slash command is unavailable in the current session, naming that missing runtime as the blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. In an operator session on a runtime that supports the command, invoke `/rewrite:explain-visually how does route_resources in .opencode/skills/sk-communication/SKILL.md decide the lane using select_lane, discover_markdown_resources, and EXPLANATION_SIGNALS`.
2. Record the rendered visual and the terminal `STATUS=` line from the reply.
3. Compare the rendered form against the modality table in `references/visual-explanation.md` and confirm the control-flow subject produced a call tree, not prose.
4. Diff every occurrence of `route_resources`, `select_lane`, `discover_markdown_resources`, `EXPLANATION_SIGNALS`, and `.opencode/skills/sk-communication/SKILL.md` in the output against the prompt text to confirm byte-exact reproduction.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| COMM-010 | Explain-visually selects modality | Prove a control-flow subject renders as a call tree, not prose, with protected spans byte-exact. | `/rewrite:explain-visually how does route_resources in .opencode/skills/sk-communication/SKILL.md decide the lane using select_lane, discover_markdown_resources, and EXPLANATION_SIGNALS` | 1. Invoke the prompt as a slash command in an operator session -> 2. Record the rendered visual and `STATUS=` line -> 3. Confirm the rendered form is a call tree per the modality table -> 4. Diff protected identifiers and the file path against the prompt. | Rendered output is a structural call tree, not prose; `STATUS=OK` present; `route_resources`, `select_lane`, `discover_markdown_resources`, `EXPLANATION_SIGNALS`, and the SKILL.md path are byte-identical to the prompt. | Rendered reply text, `STATUS=` line, and the identifier/path diff. | PASS if all signals match; FAIL if the output is prose or any protected span is altered; SKIP only when the slash command is unavailable in the current session, naming that runtime blocker. | 1. Confirm the runtime loaded `.opencode/commands/rewrite/explain-visually.md`; 2. re-check Step 3 ("Select The Modality") of the command against the rendered output; 3. compare the rendered form with the content-to-form table in `references/visual-explanation.md` Section 2; 4. rerun the command and capture the full reply text before rejudging. |

### Evidence Review

Do not treat a fenced code block alone as a pass. The rendered structure must trace the real call relationships among the cited `SKILL.md` functions, and every identifier and path must match the prompt exactly, with no renamed, truncated, or paraphrased token.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Modality selection catalog entry](../../feature-catalog/explanation/modality-selection.md) | Product behavior named by the routing prompt. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Explain Visually command](../../../../commands/rewrite/explain-visually.md) | Command contract: Step 3 selects the modality for the resolved subject. |
| [Visual explanation reference](../../references/visual-explanation.md) | Section 2 modality table and selection rules exercised by the prompt. |

---

## 5. SOURCE METADATA

- Group: Explanation
- Playbook ID: COMM-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `explanation/explain-visually-selects-modality.md`
- Catalog entry: `explanation/modality-selection.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
