---
title: "Model Benchmark Code-Task Fixture Template"
description: "Fillable scaffold for one model-benchmark tiered code-task oracle fixture (JSON) — the {fn_name, task, tests[], hidden_tests[]} contract the Lane B code-task scorer extracts, runs in isolation, and turns into a correctness pass rate."
trigger_phrases:
  - "model benchmark code task fixture template"
  - "code task oracle fixture scaffold"
  - "tiered fixture template"
  - "t-tier code fixture json"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

<!--
Copy-paste scaffold for ONE model-benchmark code-task oracle fixture:
  <deep-improvement>/assets/model-benchmark/benchmark-fixtures/<slug>.json

A SHIPPED FIXTURE IS A PURE .json FILE — no frontmatter, no markdown, no comments.
This .md is only the authoring scaffold. Copy the fenced json block below into a
new `<slug>.json`, NOT this whole file.

Usage:
  1. Pick a slug matching `^[a-z0-9]+(?:-[a-z0-9]+)*$` and create the fixture
     next to its siblings, for example:
     cp /dev/null \
        .opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/t3-my-new-task.json
     then paste the json scaffold below into it.
  2. Fill every {{PLACEHOLDER}}. Keep the real field names and their order. `args`
     and `expect` hold literal JSON values (numbers, strings, arrays, objects, null,
     booleans), NOT quoted placeholder tokens — replace the {{...}} inside them with
     real JSON.
  3. Ship at least 5 visible `tests[]` and enough held-out `hidden_tests[]` to
     separate "mostly right" from "fully right". Every `expect` MUST be generated
     from a verified reference implementation, never hand-guessed.
  4. Validate THIS template .md (structure): 0 issues required.
     python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py \
       .opencode/skills/sk-doc/create-benchmark/assets/model-benchmark/model-benchmark-code-task-fixture-template.md --type asset
     Validate the FILLED .json fixture by parsing it and running the scorer — the
     runner is the ultimate check; it fails a fixture it cannot parse or whose
     reference impl does not score 1.0.

Field definitions, the tier taxonomy, and the correctness-pass-rate contract are
normative in the fixtures README and scorer (see RELATED RESOURCES). Reviewer-prompt
fixtures use a DIFFERENT shape — see reviewer-schema.md; do not fill this template
for a reviewer fixture.
-->

## 1. OVERVIEW

This section documents the scaffold and is NOT part of a shipped fixture. A shipped
fixture is a pure JSON file with no frontmatter and no `## OVERVIEW` heading: it is
exactly the object in the fenced json block below with every `{{PLACEHOLDER}}`
replaced. The scorer parses that JSON, extracts the model's `fn_name` function from
its response, runs every `tests[]` and `hidden_tests[]` case in an isolated child
process, and returns a `correctness_pass_rate` fraction — so partially-correct
solutions separate from fully-correct ones instead of collapsing to pass/fail.

Keep the field order shown. The discriminating fixtures are invalid-dominant strict
validators (many adversarial-malformed inputs a lax-but-plausible solution wrongly
accepts), because raw computational difficulty saturates for frontier models. Bias
`hidden_tests[]` toward those held-out adversarial cases.

## 2. SCAFFOLD

```json
{
  "id": "{{FIXTURE_ID}}",
  "category": "{{CATEGORY}}",
  "tier": "{{TIER}}",
  "fn_name": "{{FUNCTION_NAME}}",
  "signature": "{{FUNCTION_SIGNATURE}}",
  "task": "{{TASK_PROMPT}}",
  "visibleSpec": "{{VISIBLE_SPEC}}",
  "scope": "{{SCOPE_CONSTRAINTS}}",
  "tests": [
    { "name": "{{VISIBLE_CASE_1_NAME}}", "args": [{{VISIBLE_CASE_1_ARGS}}], "expect": {{VISIBLE_CASE_1_EXPECT}} },
    { "name": "{{VISIBLE_CASE_2_NAME}}", "args": [{{VISIBLE_CASE_2_ARGS}}], "expect": {{VISIBLE_CASE_2_EXPECT}} },
    { "name": "{{VISIBLE_CASE_3_NAME}}", "args": [{{VISIBLE_CASE_3_ARGS}}], "expect": {{VISIBLE_CASE_3_EXPECT}} },
    { "name": "{{VISIBLE_CASE_4_NAME}}", "args": [{{VISIBLE_CASE_4_ARGS}}], "expect": {{VISIBLE_CASE_4_EXPECT}} },
    { "name": "{{VISIBLE_CASE_5_NAME}}", "args": [{{VISIBLE_CASE_5_ARGS}}], "expect": {{VISIBLE_CASE_5_EXPECT}} }
  ],
  "hidden_tests": [
    { "name": "{{HIDDEN_CASE_1_NAME}}", "args": [{{HIDDEN_CASE_1_ARGS}}], "expect": {{HIDDEN_CASE_1_EXPECT}} },
    { "name": "{{HIDDEN_CASE_2_NAME}}", "args": [{{HIDDEN_CASE_2_ARGS}}], "expect": {{HIDDEN_CASE_2_EXPECT}} }
  ],
  "expectedDifficulty": "{{EXPECTED_DIFFICULTY}}",
  "saturation": { "status": "{{SATURATION_STATUS}}" }
}
```

<!--
Inline guidance (the fixtures README + scorer are authoritative):
  tests / hidden_tests : each case is { "name": string, "args": [ ... ], "expect": value }.
                         `args` is the FULL positional argument list spread into the
                         function; a single-argument function still takes a one-element
                         array. `expect` is the exact reference return value (deep-equal),
                         which may be a number, string, boolean, null, array, or object.
                         Author 5+ visible cases and bias hidden cases to adversarial /
                         invalid-dominant inputs. Every `expect` comes from a verified
                         reference impl (reference scores 1.0; a lax impl scores < 1.0).
  Keep the whole object valid JSON once placeholders are replaced — no trailing commas,
  no comments in the shipped .json.
-->

## 3. FIELD REFERENCE

| Field | Type | Fill with |
|---|---|---|
| `id` | string | Stable kebab identifier for the fixture (e.g. `t3-lower-bound`); unique within the pack. |
| `category` | string | Task family, e.g. `bug-fix-in-context`, `strict-acceptance`, `format-adherence`. Match an existing pack category when one fits. |
| `tier` | string | Difficulty tier `T1`–`T4` (T1 smoke → T4 adversarial). Picks the discrimination level a profile can select. |
| `fn_name` | string | Exact function name the scorer extracts from the model's response (e.g. `lowerBound`). |
| `signature` | string | The declared signature, e.g. `function lowerBound(arr, target)`. Documents arity and parameter order. |
| `task` | string | The full prompt the model receives: what to implement, the rules, the traps, and any output constraint (e.g. "return ONLY the function source; do not write files"). |
| `visibleSpec` | string | The concise contract restated for the model — input/output types, invariants, and the sentinel for invalid input. |
| `scope` | string | Hard constraints, typically "Single pure function. No mutation, no extra parameters, no helper globals, no I/O, no external libraries." |
| `tests` | array | Visible oracle cases `{name, args[], expect}`. Ship 5+; these can appear in the prompt. |
| `hidden_tests` | array | Held-out oracle cases in the same shape; bias toward adversarial / invalid-dominant inputs that a lax solution wrongly accepts. |
| `expectedDifficulty` | string | Author's difficulty label, e.g. `trivial`, `hard`, `adversarial`. Aligns with `tier`. |
| `saturation` | object | `{ "status": "active" }`. `active` = discriminating; a fixture frontier models ace is a demote candidate and stops being quotable as signal. |

## 4. RELATED RESOURCES

- [`../../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/README.md`](../../../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/README.md) — normative fixture taxonomy: field set, tier taxonomy (T1–T4), pack layout, and the correctness-pass-rate design lesson.
- [`../../../system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs`](../../../../system-deep-loop/deep-improvement/scripts/model-benchmark/lib/code-task-scorer.cjs) — the scorer that extracts `fn_name`, runs every oracle case in isolation, and returns `correctness_pass_rate`; the ultimate check on a filled fixture.
- [`../../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md`](../../../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md) — the SEPARATE reviewer-prompt fixture shape (verdict oracle). Use it, not this template, for reviewer fixtures.
