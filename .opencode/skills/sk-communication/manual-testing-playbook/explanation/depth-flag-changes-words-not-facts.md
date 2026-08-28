---
title: "COMM-011 -- Depth flag changes words, not facts"
description: "This scenario validates that running the same subject at --depth=expert and --depth=novice changes vocabulary and framing while every identifier, path, and number stays identical."
catalog_applicable: true
version: 1.0.0.0
---

# COMM-011 -- Depth flag changes words, not facts

This file is the canonical operator contract for the depth-calibration dial of `/rewrite:explain-visually`.

---

## 1. OVERVIEW

This scenario verifies that switching `--depth` between `expert` and `novice` on the same subject changes vocabulary and framing while every protected identifier, path, and number stays byte-identical across both runs.

### Why This Matters

Depth calibration has no value if a `novice` render can silently drop or alter a fact along with the jargon. The binding rule is that simplification changes words, never facts; a reader who cannot parse expert vocabulary must still receive a claim that is true.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm that `--depth=expert` and `--depth=novice` on the same subject differ in prose and framing but agree byte-for-byte on every protected span.
- Real user request: `/rewrite:explain-visually how does route_resources in .opencode/skills/sk-communication/SKILL.md decide the lane using select_lane, discover_markdown_resources, and EXPLANATION_SIGNALS`
- Prompt: `/rewrite:explain-visually how does route_resources in .opencode/skills/sk-communication/SKILL.md decide the lane using select_lane, discover_markdown_resources, and EXPLANATION_SIGNALS`
- Expected execution process: Run the prompt twice in the same operator session, once with `--depth=expert` and once with `--depth=novice` inserted immediately after the command name, then diff the two rendered replies.
- Expected signals: The two replies differ in vocabulary, glossing, and framing (the `novice` reply adds an analogy and plain-language labels the `expert` reply omits); both replies close with `STATUS=OK`; and `route_resources`, `select_lane`, `discover_markdown_resources`, `EXPLANATION_SIGNALS`, and `.opencode/skills/sk-communication/SKILL.md` appear byte-identical in both replies.
- Desired user-visible outcome: Two readable explanations of the same lane-selection logic, one dense and peer-level, one analogy-led and sparse, that never disagree on an identifier, a path, or a fact.
- Pass/fail: PASS if the prose differs between depths and every protected span is byte-identical across both replies; FAIL if the prose is unchanged between depths, or any identifier, path, or number differs, is dropped, or is altered between the two replies; SKIP only if the current session cannot execute the `/rewrite:explain-visually` slash command.

---

## 3. TEST EXECUTION

### Exact Command Sequence

1. In an operator session on a runtime that supports the command, invoke `/rewrite:explain-visually --depth=expert how does route_resources in .opencode/skills/sk-communication/SKILL.md decide the lane using select_lane, discover_markdown_resources, and EXPLANATION_SIGNALS`.
2. Record the rendered visual and the terminal `STATUS=` line.
3. In the same session, invoke `/rewrite:explain-visually --depth=novice how does route_resources in .opencode/skills/sk-communication/SKILL.md decide the lane using select_lane, discover_markdown_resources, and EXPLANATION_SIGNALS`.
4. Record the rendered visual and the terminal `STATUS=` line.
5. Diff the two replies: confirm the prose, glossing, and framing differ, and confirm `route_resources`, `select_lane`, `discover_markdown_resources`, `EXPLANATION_SIGNALS`, and `.opencode/skills/sk-communication/SKILL.md` are byte-identical between the two.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| COMM-011 | Depth flag changes words, not facts | Prove `--depth=expert` and `--depth=novice` on one subject differ in wording but agree byte-for-byte on every protected span. | `/rewrite:explain-visually how does route_resources in .opencode/skills/sk-communication/SKILL.md decide the lane using select_lane, discover_markdown_resources, and EXPLANATION_SIGNALS` | 1. Invoke the prompt with `--depth=expert` inserted after the command name -> 2. Record the reply and `STATUS=` line -> 3. Invoke the same prompt with `--depth=novice` inserted -> 4. Record the reply and `STATUS=` line -> 5. Diff both replies for wording and for protected-span equality. | Prose and framing differ between the two replies; both close with `STATUS=OK`; `route_resources`, `select_lane`, `discover_markdown_resources`, `EXPLANATION_SIGNALS`, and the SKILL.md path are byte-identical across both replies. | Both rendered replies, both `STATUS=` lines, and the protected-span diff between them. | PASS if wording differs and every protected span matches across runs; FAIL if wording is unchanged or any protected span differs between runs; SKIP only if the slash command cannot execute twice in the current session. | 1. Confirm `--depth` was accepted and not rejected with `STATUS=FAIL ERROR="unknown depth"`; 2. re-check Step 4 ("Apply The Depth Rubric") and Step 5 ("Identify Protected Spans") of the command against both replies; 3. compare each reply against the depth rubric and protected-span list in `references/visual-explanation.md` Sections 3-4; 4. rerun both invocations and capture the full reply text before rejudging. |

### Evidence Review

Do not treat two visually different replies alone as a pass. The wording and framing must actually change between depths, and separately, every protected identifier, path, and number must be provably identical between the two replies — a pass requires both, not either.

---

## 4. SOURCE FILES

### Playbook And Catalog Sources

| File | Role |
|---|---|
| [Root playbook](../manual-testing-playbook.md) | Package policy and scenario index. |
| [Depth-calibrated explanation catalog entry](../../feature-catalog/explanation/depth-calibrated-explanation.md) | Product behavior named by the routing prompt. |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [Explain Visually command](../../../../commands/rewrite/explain-visually.md) | Command contract: Steps 4-5 apply the depth rubric and identify protected spans. |
| [Visual explanation reference](../../references/visual-explanation.md) | Sections 3-4 hold the depth rubric and the protected-span list exercised by the prompt. |

---

## 5. SOURCE METADATA

- Group: Explanation
- Playbook ID: COMM-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `explanation/depth-flag-changes-words-not-facts.md`
- Catalog entry: `explanation/depth-calibrated-explanation.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
