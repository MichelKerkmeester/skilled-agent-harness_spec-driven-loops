Research-only task. I’m loading the requested slices and sibling asset list, then I’ll return only the requested deliverable sections.
The review command slice shows the presentation asset is loaded at `review.md:15`, but mode routing only says “use the consolidated setup prompt” at `review.md:95-96`; it does not define verbatim rendering.
I’m checking the referenced benchmark/evidence IDs so the verification note cites the actual files instead of relying on the brief.
The benchmark references exist in the deep-loop behavior benchmark area and the current research packet. I’m reading just those narrowed references for line-accurate citations.
The 033 evidence confirms this is a presentation-contract fix: RVB-002/CXB-002 expect a single halt prompt, and the research registry already names the marker solution as F-007.
I’m only using the narrowed benchmark and research references; no repository files are being changed.
The setup block continues past line 210, so I’m reading the next small slice to place the END marker at the actual fenced-block boundary.
One more narrowed lookup: I’m checking the benchmark scoring dimension names so the IMB-003 D2 note uses the benchmark’s wording.
The shared framework names `D2` as `presentation-fidelity`, scored by observed `expected_presentation_markers`, so the new assertion should be a marker pair rather than another semantic regex.
## DELIVERABLE 1

Target: `.opencode/commands/deep/assets/deep_review_presentation.txt:90-97`, closing at `.opencode/commands/deep/assets/deep_review_presentation.txt:217-224`.

Before:

````text
### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode

Use this block only when `execution_mode = "INTERACTIVE"` or when no suffix was supplied and Q2 must ask for the execution mode.

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:
````

After:

````text
### Consolidated Setup Prompt for `:confirm` and No-Suffix Mode

Use this block only when `execution_mode = "INTERACTIVE"` or when no suffix was supplied and Q2 must ask for the execution mode.

When halting for setup, render only the marked block verbatim after applying the stated omissions; do not paraphrase, summarize, or reorder.

SETUP_PROMPT_START

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:
````

Closing before:

````text
9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER split questions into multiple prompts
```
````

Closing after:

````text
9. SET STATUS: PASSED

STOP HERE - Wait for user answers before continuing.

DO NOT proceed until user explicitly answers
NEVER auto-create spec folders without confirmation
NEVER split questions into multiple prompts
```

SETUP_PROMPT_END
````

## DELIVERABLE 2

Target: `.opencode/commands/deep/review.md:90-97`.

Before:

```text
4. If `:confirm` is present, set `execution_mode = INTERACTIVE` and use the presentation contract's consolidated setup prompt before loading YAML.
5. If no mode suffix is present, set `execution_mode = ASK` and use the presentation contract's consolidated setup prompt to ask for execution mode.
6. Load the selected workflow asset only after `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `stop_policy`, and `lineage_mode` are bound.
```

After:

```text
4. If `:confirm` is present, set `execution_mode = INTERACTIVE` and use the presentation contract's consolidated setup prompt before loading YAML.
5. If no mode suffix is present, set `execution_mode = ASK` and use the presentation contract's consolidated setup prompt to ask for execution mode.

If halting for setup: output the marked block from the presentation asset verbatim after applying the stated omissions; do not paraphrase, summarize, or reorder; stop.

6. Load the selected workflow asset only after `review_target`, `review_target_type`, `review_dimensions`, `spec_folder`, `execution_mode`, `maxIterations`, `convergenceThreshold`, `stop_policy`, and `lineage_mode` are bound.
```

## DELIVERABLE 3

Sibling presentation assets found under `.opencode/commands/deep/assets/`:

| Surface | Presentation target | Command-doc target | Mechanical edits |
|---|---|---|---|
| agent-improvement | `.opencode/commands/deep/assets/deep_agent-improvement_presentation.txt` | `.opencode/commands/deep/agent-improvement.md` | Add the render-only instruction plus `SETUP_PROMPT_START`/`SETUP_PROMPT_END` around the consolidated setup block; insert the halt-render paragraph in `## 3. MODE ROUTING`. |
| ai-council | `.opencode/commands/deep/assets/deep_ai-council_presentation.txt` | `.opencode/commands/deep/ai-council.md` | Same two edits. |
| context | `.opencode/commands/deep/assets/deep_context_presentation.txt` | `.opencode/commands/deep/context.md` | Same two edits. |
| model-benchmark | `.opencode/commands/deep/assets/deep_model-benchmark_presentation.txt` | `.opencode/commands/deep/model-benchmark.md` | Same two edits. |
| research | `.opencode/commands/deep/assets/deep_research_presentation.txt` | `.opencode/commands/deep/research.md` | Same two edits. |

Review itself is covered by Deliverables 1-2: `.opencode/commands/deep/assets/deep_review_presentation.txt` and `.opencode/commands/deep/review.md`.

## DELIVERABLE 4

Verification note:

| Cell | Evidence |
|---|---|
| RVB-002 | Expects `question_halt` and presentation markers at `.opencode/skills/deep-loop-workflows/deep-review/behavior_benchmark/scenarios/RVB-002-bare-command-halt.md:16-20`; pass shape requires one consolidated setup question and no dispatch at `.opencode/skills/deep-loop-workflows/deep-review/behavior_benchmark/scenarios/RVB-002-bare-command-halt.md:32-36`; Claude baseline already passes at `.opencode/skills/deep-loop-workflows/deep-review/behavior_benchmark/baselines/claude-baseline.md:16-20`. |
| CXB-002 | Expects `question_halt` and presentation markers at `.opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/scenarios/CXB-002-bare-command-halt.md:16-20`; pass shape requires one consolidated setup question and hard halt at `.opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/scenarios/CXB-002-bare-command-halt.md:32-36`; Claude baseline already passes at `.opencode/skills/deep-loop-workflows/deep-context/behavior_benchmark/baselines/claude-baseline.md:19-23`. |
| IMB-003 D2 gap | `D2` is presentation-fidelity, scored by observed `expected_presentation_markers`, at `.opencode/skills/deep-loop-workflows/shared/behavior-benchmark/framework.md:113-119`; IMB-003 has expected presentation markers at `.opencode/skills/deep-loop-workflows/deep-improvement/behavior_benchmark/scenarios/IMB-003-vague-natural-ask.md:13-19`; baseline is partial with no candidate/score at `.opencode/skills/deep-loop-workflows/deep-improvement/behavior_benchmark/baselines/claude-baseline.md:23-29`. |

Benchmark marker assertions to add as literal `expected_presentation_markers`:

```json
[
  "SETUP_PROMPT_START",
  "EXECUTE THIS SINGLE CONSOLIDATED PROMPT:",
  "SETUP_PROMPT_END"
]
```
