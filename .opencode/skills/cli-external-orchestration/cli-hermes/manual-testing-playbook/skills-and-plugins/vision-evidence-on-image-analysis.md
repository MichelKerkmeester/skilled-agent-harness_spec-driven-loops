---
title: "HERMES-029 -- Vision evidence appended to an image analysis"
description: "Confirm the sk-vision core runs when a Hermes session analyzes an image and its evidence block is appended to the vision tool's result, for `HERMES-029`."
version: 1.0.0.0
---

# HERMES-029 -- Vision evidence appended to an image analysis

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `HERMES-029`.

---

## 1. OVERVIEW

The `repo-guards` plugin runs the sk-vision core in `pre_tool_call` for `vision_analyze`, stages its `<SK-VISION EVIDENCE>` block under the image path, and appends it to the tool result. The tool only exists in the session when Hermes can resolve a vision provider (`auxiliary.vision.provider`), an operator setting.

### Why This Matters

The other six runtimes run this guard through their hook adapters; a Hermes session that skipped it would be the one place the rule does not hold. The proof is the guard's own text arriving in the session.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-029` and confirm the expected signals without contradictory evidence.

- Objective: Confirm an image analysis in a Hermes session returns the model's answer plus the repo's vision evidence block.
- Real user request: `Have Hermes look at this image and show me the vision guard's evidence came with it.`
- Prompt: `Call your vision_analyze tool on the image file specs/cli-external-orchestration/071-cli-hermes-creation/010-hermes-hook-parity/scratch/red.png with the question 'what color is it'. Then reply with exactly two lines: line 1 = EVIDENCE if the vision_analyze tool result contained the text '<SK-VISION EVIDENCE>' or NO_EVIDENCE otherwise; line 2 = the first 120 characters of the vision_analyze tool result.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on the dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; line 1 `EVIDENCE`; line 2 the model's description of a solid red rectangle; `session_id:` on stderr; the agent log shows `tool vision_analyze completed`.
- Evidence: stdout, exit code, elapsed seconds, the stderr session id, the log's tool line
- Desired user-visible outcome: a concise verdict naming the observed guard text and the evidence behind it.
- Pass/fail: PASS on `EVIDENCE`; FAIL on `NO_EVIDENCE` or a tool error; SKIP only on a named blocker (`auxiliary.vision.provider` unset hides the tool; record it verbatim).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes` and the plugin allowlist entry.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, exit code and elapsed seconds separately.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
hermes config get auxiliary.vision.provider </dev/null
HERMES_ENABLE_PROJECT_PLUGINS=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool \
  --provider llmgateway --model glm-5.3-flash --reasoning none -t vision,file,todo --max-turns 3 --run-budget 200 \
  -q "Call your vision_analyze tool on the image file specs/cli-external-orchestration/071-cli-hermes-creation/010-hermes-hook-parity/scratch/red.png with the question 'what color is it'. Then reply with exactly two lines: line 1 = EVIDENCE if the vision_analyze tool result contained the text '<SK-VISION EVIDENCE>' or NO_EVIDENCE otherwise; line 2 = the first 120 characters of the vision_analyze tool result." </dev/null >out.txt 2>err.txt
echo $?
cat out.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-029 | Vision evidence appended to an image analysis | Confirm an image analysis in a Hermes session returns the model's answer plus the repo's vision evidence block. | `Call your vision_analyze tool on the image file specs/cli-external-orchestration/071-cli-hermes-creation/010-hermes-hook-parity/scratch/red.png with the question 'what color is it'. Then reply with exactly two lines: line 1 = EVIDENCE if the vision_analyze tool result contained the text '<SK-VISION EVIDENCE>' or NO_EVIDENCE otherwise; line 2 = the first 120 characters of the vision_analyze tool result.` | the `hermes chat` dispatch in §3 | Exit code `0`; line 1 `EVIDENCE`; line 2 the model's description of a solid red rectangle; `session_id:` on stderr; the agent log shows `tool vision_analyze completed`. | stdout, exit code, elapsed seconds, the stderr session id, the log's tool line | PASS on `EVIDENCE`; FAIL on `NO_EVIDENCE` or a tool error; SKIP only on a named blocker (`auxiliary.vision.provider` unset hides the tool; record it verbatim). | Harness: plugin not loaded. Dependency: no vision provider resolves, the tool is hidden. Adapter: the evidence block never reaches the result |

### Recorded Result

**Executed 2026-09-15**: exit 0 after 87 s, `EVIDENCE` then `The image is a simple, solid rectangle of uniform color ...`, session `20260915_082637_0f75f1`, `vision_analyze completed (22.12s)`. Two earlier runs found no `vision_analyze` in the session because no vision provider resolved; setting `auxiliary.vision.provider` to the gateway fixed that.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `skills-and-plugins/vision-evidence-on-image-analysis.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SYNC.md](../../../../../../.hermes/SYNC.md) | What the plugin bridges and how |
| [hook-contract.md](../../references/hook-contract.md) | The plugin hook map |
| `.opencode/hooks/sk-vision/devin/sk-vision.mjs` | The core the bridge runs |

---

## 5. SOURCE METADATA

- Group: Skills And Plugins
- Playbook ID: HERMES-029
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `skills-and-plugins/vision-evidence-on-image-analysis.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
