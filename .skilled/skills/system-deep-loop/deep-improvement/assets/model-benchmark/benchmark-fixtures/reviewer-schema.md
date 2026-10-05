---
title: "reviewer fixture schema"
description: "Schema for reviewer-prompt regression fixtures with expected verdicts, visible and hidden cases, and deterministic replay support."
trigger_phrases:
  - "reviewer fixture schema"
  - "reviewer prompt regression"
  - "expected verdict fixture"
  - "deterministic fixture replay"
importance_tier: normal
contextType: implementation
version: 1.17.0.2
---

# Reviewer Fixture Schema

---

## 1. OVERVIEW

Reviewer fixtures let Lane B check whether a reviewer prompt still catches a known bug class. A fixture supplies a prompt template, a diff or repo-state input, and an expected verdict. The scorer reads the typed `verdict` field first, then accepts only a complete, anchored verdict line as a text fallback.

Reviewer fixtures are opt-in. Existing pattern and code-task fixtures keep their current scorers unless `SPECKIT_REVIEWER_BENCHMARKS` is enabled and the fixture has the reviewer shape.

---

## 2. REQUIRED SHAPE

```json
{
  "id": "reviewer-example",
  "kind": "reviewer-prompt",
  "agent": "review",
  "prompt_template": "Review this change. Return JSON with verdict set to PASS, FAIL, BLOCK, or ABSTAIN.",
  "input_kind": "diff",
  "input": {
    "repo_state": "short state summary",
    "diff": "unified diff or state reference",
    "review_focus": "what the reviewer must decide"
  },
  "expectedVerdict": "fail",
  "expectedFindings": [
    {
      "id": "finding-slug",
      "mustInclude": ["stale", "verification"]
    }
  ],
  "tests": [],
  "hidden_tests": []
}
```

Required fields:

- `kind`: must be `reviewer-prompt`.
- `agent`: reviewer agent or prompt family under test.
- `prompt_template`: prompt text. The scorer replaces `{{input}}`, `{{diff}}`, `{{state_ref}}`, and `{{review_focus}}` when present.
- `input_kind`: `diff` or `state_ref`.
- `input`: object or string carrying the repo-state/diff material.
- `expectedVerdict`: one of `pass`, `fail`, `block`, or `abstain`.
- `expectedFindings`: finding expectations checked against reviewer output.

---

## 3. VISIBLE AND HIDDEN CASES

Use `tests` for visible calibration cases and `hidden_tests` for held-out oracle cases. Each case may override `input`, `input_kind`, `expectedVerdict`, `expectedFindings`, and `reviewer_output`.

The scorer grades visible plus hidden cases, but hidden cases are the overfit guard: a prompt that passes the visible case and misses a hidden case fails the fixture.

---

## 4. DETERMINISTIC REPLAY

For deterministic CI or pre-commit replay, a case may include `reviewer_output`. When present, the scorer parses that output instead of dispatching a live model. When absent, the scorer writes the composed prompt to a temp file and calls `dispatch-model.cjs`.

Live model dispatch is opt-in and should stay outside blocking CI unless the operator deliberately enables it.

---

## 5. VERDICT CONTRACT

Reviewer output should use a typed JSON verdict:

```json
{"verdict":"FAIL","findings":[]}
```

Accepted typed values are `PASS`, `FAIL`, `BLOCK`, and `ABSTAIN` in any case. A typed field takes precedence; an invalid typed value stays unresolved. For legacy plain-text output, the parser accepts a complete verdict line, including markdown emphasis, a heading marker, a `Final verdict` label, or a short parenthetical qualifier. If no verdict is found, the default `--grader auto` asks Jev when a Jev credential is stored and `JEV_FEATURE_VERDICT_FALLBACK` is not off, and `--grader llm` or an explicitly opted-in `--grader jev` can classify the prose too. The `jev` grader can return `ABSTAIN` when the output states no decision; malformed or unknown choices remain unresolved.

On mismatch, the Lane B report surfaces one consequence line per fixture:

```text
REVIEWER_BENCHMARK: fixture reviewer-example expected FAIL, got PASS — rule not safe to promote
```

---

## 6. ADDING A FIXTURE

1. Copy one of the `reviewer-*.json` seed fixtures.
2. Keep `kind: "reviewer-prompt"` and choose `input_kind`.
3. Put the known buggy or blocking input in `input`.
4. Add one visible case and one hidden case.
5. Keep expected findings token-based and specific enough to reject vague verdict-only output.
6. Parse the JSON before committing.
