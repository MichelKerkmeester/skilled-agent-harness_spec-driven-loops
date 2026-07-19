---
title: "Model Benchmark Pattern / Capability Fixture Template"
description: "Fillable JSON scaffold for the non-code-task discriminating fixture family a model benchmark sweep scores: the pattern evidence-contract shape and the reviewer-prompt capability shape, each distinct from the code-task oracle schema."
trigger_phrases:
  - "model benchmark pattern fixture template"
  - "capability fixture scaffold"
  - "pattern evidence contract fixture"
  - "reviewer-prompt fixture template"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

<!--
Copy-paste scaffold for ONE non-code-task model-benchmark fixture. These fixtures
live beside their sweep, in the model_benchmark benchmark-fixtures folder:
  .opencode/skills/system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/<slug>.json

Usage:
  1. Pick a lowercase-hyphen <slug> and create a NEW <slug>.json in that folder.
  2. Choose the shape that matches what you are measuring, then paste ONLY that
     fenced json block into the new file:
       - Section 2 PATTERN EVIDENCE-CONTRACT — the candidate artifact must contain
         required headings and patterns and stay clean of forbidden ones.
       - Section 3 REVIEWER-PROMPT CAPABILITY — a reviewer prompt must still return
         the expected verdict on a known bug class.
  3. Fill every {{PLACEHOLDER}}. JSON carries no comments, so the guidance blocks
     here stay in this .md — never paste an HTML comment or a // note into the .json.
  4. Delete any scaffold key you do not need only when it is optional below; keep
     the field order shown so a diff against the sibling fixtures stays legible.

Validate:
  - This template .md (auto-detects as an asset), must report 0 issues:
      python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py \
        .opencode/skills/sk-doc/create-benchmark/assets/model-benchmark/model-benchmark-pattern-fixture-template.md
  - The filled <slug>.json fixture (JSON has no schema validator here — parse it
    and let the runner be the final check):
      node -e "JSON.parse(require('fs').readFileSync('<slug>.json','utf8'))"

Normative source (do not restate these contracts — link them):
  - benchmark-fixtures/README.md  ../../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/README.md
    (§2 KEY FILES, §3 Reviewer Fixture Shape) — the fixture taxonomy and which
    scorer consumes which shape.
  - reviewer-schema.md  ../../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md
    — the authoritative reviewer-prompt field semantics, verdict contract, and
    deterministic-replay rules. Section 3 below is a fill-in scaffold only; that
    schema doc is the contract.
-->

# Model Benchmark Pattern / Capability Fixture Template

---

## 1. OVERVIEW

This scaffold covers the **non-code-task discriminating fixture family** — the
fixtures a model benchmark sweep scores by inspecting an artifact or a verdict
rather than by executing a function against oracle cases. Two real shapes live in
this family, and they do **not** share the code-task oracle schema:

| Shape | Discriminating fields | Scored by | Real seed fixtures |
| --- | --- | --- | --- |
| **Pattern evidence-contract** (Section 2) | `title`, `description`, `requiredHeadings[]`, `requiredPatterns[]`, `forbiddenPatterns[]`, `content[]` | pattern scorer (heading / required-pattern / forbidden-clean bands) | `fixture-baseline.json`, `fixture-edge.json`, `fixture-improved.json` |
| **Reviewer-prompt capability** (Section 3) | `kind`, `agent`, `prompt_template`, `input_kind`, `input{}`, `expectedVerdict`, `expectedFindings[]`, `tests[]`, `hidden_tests[]` | reviewer scorer (verdict extraction + finding tokens) | `reviewer-over-read.json`, `reviewer-softened-fail.json`, `reviewer-stale-verdict.json`, `reviewer-ac-coverage.json` |

**These are NOT the code-task oracle schema.** The code-task fixtures (`t*`,
`hard_*`, `harder_*`, `validate_*` — for example `hard-eval-expr.json` and
`t4-adversarial-tokenizer.json`) carry a disjoint field set — `fn_name`,
`signature`, `task`, `visibleSpec`, `scope`, `tier`, `expectedDifficulty`,
`saturation`, and `tests[]` / `hidden_tests[]` whose cases are
`{name, args[], expect}` value-oracles run in an isolated child process. That
family is scored by running the extracted function, so it is out of scope for this
template. Author a code-task fixture from those seeds directly; this template
templatizes only the two non-oracle shapes above. See
[`benchmark-fixtures/README.md`](../../../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/README.md)
for the full taxonomy.

Pick the section whose shape matches your measurement, fill its scaffold, and drop
it into a new `<slug>.json`.

---

## 2. PATTERN EVIDENCE-CONTRACT FIXTURE

Use this shape when the thing under test is whether a produced artifact carries the
required structure and evidence and stays free of banned markers. The scorer walks
the candidate output for each `requiredHeadings` literal (substring match), each
`requiredPatterns` entry (compiled to a regex), and each `forbiddenPatterns` entry
(must be absent). The three bands are scored independently and a fixture passes
only when nothing is missing and nothing forbidden appears; an empty band earns
full credit for that band. The exact weighting lives in the scorer at
[`run-benchmark.cjs`](../../../../system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs)
— do not restate it in the fixture.

```json
{
  "id": "{{FIXTURE_ID_KEBAB}}",
  "title": "{{ARTIFACT_TITLE}}",
  "description": "{{ONE_LINE_WHAT_THIS_CANDIDATE_ARTIFACT_MUST_PROVE}}",
  "requiredHeadings": ["{{HEADING_LITERAL_1}}", "{{HEADING_LITERAL_2}}"],
  "requiredPatterns": ["{{TOKEN_OR_REGEX_1}}", "{{TOKEN_OR_REGEX_2}}"],
  "forbiddenPatterns": ["{{BANNED_MARKER_1}}", "{{BANNED_MARKER_2}}"],
  "content": [
    "{{SEED_ARTIFACT_LINE_1}}",
    "{{SEED_ARTIFACT_LINE_2}}"
  ]
}
```

<!--
Field guidance (Section 2 — pattern evidence-contract):
  id                : lowercase-hyphen slug; keep it identical to the <slug>.json filename stem.
  title             : the artifact's expected H1 text. Usually also appears verbatim in requiredHeadings.
  description       : one line stating what a passing artifact demonstrates. Prose only, never scored.
  requiredHeadings  : exact heading literals (e.g. "# Baseline Evidence Contract", "## Evidence").
                      Matched as plain substrings, so include the leading "#"s exactly. Empty [] = full heading credit.
  requiredPatterns  : tokens or /regex/ the artifact must contain (e.g. "candidateId", "benchmark-pass").
                      Each entry is compiled to a regex against the candidate text. Empty [] = full pattern credit.
  forbiddenPatterns : markers a clean artifact must NOT contain (e.g. "TBD", "TODO", "placeholder").
                      Each match costs the clean band. Empty [] = full clean credit.
  content           : the seed artifact lines this fixture materializes as the candidate under test.
                      Author them so a correct artifact satisfies requiredHeadings + requiredPatterns and trips
                      no forbiddenPatterns; a regressed one visibly does not.
-->

---

## 3. REVIEWER-PROMPT CAPABILITY FIXTURE

Use this shape when the thing under test is whether a **reviewer prompt still
catches a known bug class**. The scorer composes `prompt_template`, extracts a
`PASS` / `FAIL` / `BLOCK` verdict from the reviewer output, and compares it to the
`expectedVerdict` oracle plus the `expectedFindings` tokens. Its full field
semantics, the verdict contract, and the deterministic-replay rules are normative
in
[`reviewer-schema.md`](../../../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md)
— this scaffold is a fill-in convenience, not a re-statement of that contract.

```json
{
  "id": "{{FIXTURE_ID_KEBAB}}",
  "kind": "reviewer-prompt",
  "agent": "{{REVIEWER_AGENT_OR_PROMPT_FAMILY}}",
  "prompt_template": "{{PROMPT_TEXT_WITH_RUNTIME_SUBSTITUTION_TOKENS}}",
  "input_kind": "{{DIFF_OR_STATE_REF}}",
  "input": {
    "repo_state": "{{SHORT_STATE_SUMMARY}}",
    "review_focus": "{{WHAT_THE_REVIEWER_MUST_DECIDE}}",
    "state_ref": "{{DIFF_OR_TRANSCRIPT_OR_STATE_MATERIAL}}"
  },
  "expectedVerdict": "{{PASS_FAIL_OR_BLOCK}}",
  "expectedFindings": [
    { "id": "{{FINDING_SLUG}}", "mustInclude": ["{{TOKEN_1}}", "{{TOKEN_2}}"] }
  ],
  "tests": [
    {
      "name": "{{VISIBLE_CASE_NAME}}",
      "reviewer_output": "{{DETERMINISTIC_VERDICT_LINE_PLUS_FINDING}}"
    }
  ],
  "hidden_tests": [
    {
      "name": "{{HIDDEN_CASE_NAME}}",
      "input": {
        "repo_state": "{{HIDDEN_STATE_SUMMARY}}",
        "review_focus": "{{HIDDEN_REVIEW_FOCUS}}",
        "state_ref": "{{HIDDEN_STATE_MATERIAL}}"
      },
      "expectedVerdict": "{{PASS_FAIL_OR_BLOCK}}",
      "expectedFindings": [
        { "id": "{{FINDING_SLUG}}", "mustInclude": ["{{TOKEN_1}}", "{{TOKEN_2}}"] }
      ],
      "reviewer_output": "{{DETERMINISTIC_VERDICT_LINE_PLUS_FINDING}}"
    }
  ]
}
```

<!--
Field guidance (Section 3 — reviewer-prompt capability; reviewer-schema.md is authoritative):
  kind            : must stay the literal "reviewer-prompt" — this is the shape detector.
  agent           : the reviewer agent or prompt family under test (e.g. "review").
  prompt_template : the prompt text. The scorer substitutes the runtime tokens {{input}}, {{diff}},
                    {{state_ref}}, and {{review_focus}} when present, so write those tokens literally
                    into the prompt string where the material should land.
  input_kind      : "diff" or "state_ref". Choose "diff" when input carries a unified diff (use a
                    "diff" key inside input instead of "state_ref"); choose "state_ref" for a
                    transcript or repo-state reference as shown.
  input           : the known buggy / blocking material. repo_state = short summary, review_focus =
                    what the reviewer must decide, state_ref (or diff) = the material itself.
  expectedVerdict : the hidden oracle verdict, one of "pass" | "fail" | "block" (lowercase).
  expectedFindings: finding expectations; each mustInclude is a token list the reviewer output must
                    contain. Keep tokens specific enough to reject a vague verdict-only answer.
  tests           : visible calibration case(s). hidden_tests: held-out overfit guard — a prompt that
                    passes the visible case but misses a hidden case fails the fixture. Each case may
                    override input, input_kind, expectedVerdict, and expectedFindings.
  reviewer_output : OPTIONAL per case. When present, the scorer replays this text deterministically
                    instead of dispatching a live model. OMIT it to force live model dispatch (opt-in;
                    keep live dispatch outside blocking CI unless deliberately enabled).
-->

---

## 4. RELATED RESOURCES

| Resource | Purpose |
| --- | --- |
| [`benchmark-fixtures/README.md`](../../../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/README.md) | The fixture taxonomy: pattern, code-task, validation, and reviewer families, and which scorer consumes each. |
| [`reviewer-schema.md`](../../../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md) | Authoritative reviewer-prompt schema, verdict contract, and deterministic-replay rules for Section 3. |
| [`run-benchmark.cjs`](../../../../system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs) | The scorer that consumes the Section 2 pattern fields — the source of truth for band weighting. |

For a code-task oracle fixture (the disjoint family this template does not cover),
copy one of the `hard_*` / `validate_*` seeds in the fixtures folder directly and
follow the README taxonomy.

---

*End of template — the reviewer contract is normative in [`reviewer-schema.md`](../../../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/reviewer-schema.md); the fixture taxonomy in [`benchmark-fixtures/README.md`](../../../../system-deep-loop/deep-improvement/assets/model-benchmark/benchmark-fixtures/README.md).*
