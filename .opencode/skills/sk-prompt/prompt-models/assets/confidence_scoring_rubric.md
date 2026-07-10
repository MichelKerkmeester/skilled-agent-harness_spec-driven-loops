---
title: Confidence Scoring Rubric
description: Compact rubric for opt-in output verification of small-model dispatch results. Re-homed from cli-devin.
trigger_phrases:
  - "confidence scoring rubric"
  - "weighted output confidence score"
  - "accept retry thresholds"
  - "small model verification score"
importance_tier: normal
contextType: implementation
version: 0.8.0.7
---

# Confidence Scoring Rubric

> This reference was re-homed from cli-devin to prompt-models as part of the cli-devin deprecation. Content is executor-agnostic.

Weighted scoring rubric and thresholds for opt-in verification of small-model code and research output.

## 1. OVERVIEW

### Purpose

The confidence-scoring rubric for small-model output verification: it defines the weighted formula, per-stage definitions, and accept/retry thresholds used to judge whether a dispatched small-model result is trustworthy.

### Usage

The post-dispatch verifier applies the code-output formula (or the research-iteration adaptation when the output is markdown), runs the per-language verifier commands, clamps the score to `[0.0, 1.0]`, and compares it against the thresholds to accept, warn, mark degraded, or retry/escalate.

---

## 2. CODE OUTPUT FORMULA

Use the SmallCode-derived weighted score:

```text
score =
  compile_pass     * 0.35
+ execute_pass     * 0.25
+ smoke_test_pass  * 0.25
+ lint_clean       * 0.10
- auto_fixed       * 0.05
```

Clamp the result to `[0.0, 1.0]`.

---

## 3. THRESHOLDS

| Score | Meaning | Action |
| ---: | --- | --- |
| `>= 0.80` | Strong pass | Accept |
| `0.50 - 0.79` | Usable but weaker | Accept, optionally warn |
| `0.30 - 0.49` | Degraded | Mark iteration degraded |
| `< 0.30` | Hard-fail candidate | Retry, narrow scope, or escalate |

Default threshold: `0.50`.

---

## 4. PER-LANGUAGE VERIFIER COMMANDS

| Language | Compile / syntax | Execute | Lint / static check |
| --- | --- | --- | --- |
| Python | `python -m py_compile <file>` | `python <file>` | `python -m py_compile <file>` |
| JavaScript | `node --check <file>` | `node <file>` | `node --check <file>` |
| TypeScript | `npx tsc --noEmit` | `npx tsx <file>` | `npx tsc --noEmit` |
| Rust | `rustc --emit=metadata <file>` or `cargo check` | binary/test harness | `cargo check` |
| Go | `go vet <file>` | `go run <file>` | `go vet <file>` |

Commands that execute generated code must run only in a constrained sandbox with timeouts.

---

## 5. CODE STAGE DEFINITIONS

### Compile Pass

The output parses or compiles for its language.

Failure examples:

- unbalanced braces.
- Python block headers without colons.
- TypeScript type errors under `tsc --noEmit`.
- missing imports that prevent compilation.

### Execute Pass

The output can run without immediately crashing.

Failure examples:

- explicit `throw new Error`.
- `raise RuntimeError`.
- `panic!`.
- process exit with failure.

### Smoke Test Pass

The minimal behavior check passes.

Examples:

- exported functions are callable.
- module loads successfully.
- basic assertions pass.
- no placeholder-only test is counted.

### Lint Clean

The code has no basic static-quality failures.

Examples:

- no TODO placeholder.
- no truncation marker inside final code.
- no obvious placeholder body.
- no trailing whitespace in generated snippet.

### Auto-Fixed

Subtract `0.05` when the verifier had to repair the output before scoring.

The current static validator does not auto-fix; the field remains part of the rubric for future sandboxed verification.

---

## 6. RESEARCH-ITERATION ADAPTATION

Research iters often produce markdown rather than code. When compile is N/A, renormalize to:

```text
score =
  cite_accuracy                 * 0.40
+ structure_pass                * 0.30
+ recommendation_actionability  * 0.20
+ anti_hallucination            * 0.10
```

Use this adaptation for self-verification instructions and future research-output validators.

---

## 7. RESEARCH STAGE DEFINITIONS

### Cite Accuracy

Every material claim points to a real file and line range.

Failure examples:

- cited file does not exist.
- cited line does not contain the claim.
- citation points to a broad directory instead of evidence.

### Structure Pass

The required iter sections exist and are in the expected order.

Expected deep-research shape:

- `## Focus`
- `## Actions Taken`
- `## Findings`
- `## Questions Answered`
- `## Next Focus`

### Recommendation Actionability

Findings include concrete implementation artifacts.

Passing artifacts:

- target file paths.
- JSON snippets.
- TypeScript signatures.
- exact integration handshakes.
- verification commands.

### Anti-Hallucination

The output marks uncertainty honestly and does not invent unavailable evidence.

Failure examples:

- fabricated file paths.
- unsupported line numbers.
- "will work" claims without verification.
- recommendations that depend on uninspected code.

---

## 8. RECIPE CONTRACT

The verification fields are optional. When supplied through a supported channel, `verification_enabled` defaults false.

Intended shape:

```json
{
  "verification_enabled": false,
  "verification_languages": []
}
```

`verification_languages` is an allowlist of:

- `python`
- `typescript`
- `javascript`
- `rust`
- `go`

Empty means all supported fenced-code languages are eligible when verification is enabled.

---

## 9. IMPLEMENTATION NOTES

The current post-dispatch validator uses static scoring only.

It does not execute arbitrary generated code.

It appends `verification_degraded` to the JSONL state log when an enabled verification pass scores below threshold.

It skips verification when no supported code block exists.

It preserves backward compatibility when verification is absent or false.

---

## 10. RELATED RESOURCES

- [`output_verification.md`](../references/output_verification.md) — Output-verification pipeline reference that applies this rubric.
- [`../SKILL.md`](../SKILL.md) — Hub skill runtime instructions and dispatch matrix.
