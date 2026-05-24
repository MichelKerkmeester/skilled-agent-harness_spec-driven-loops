---
title: "cli-devin Confidence Scoring Rubric"
description: "Compact rubric for opt-in cli-devin output verification."
---

# cli-devin Confidence Scoring Rubric

## Code Output Formula

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

## Thresholds

| Score | Meaning | Action |
| ---: | --- | --- |
| `>= 0.80` | Strong pass | Accept |
| `0.50 - 0.79` | Usable but weaker | Accept, optionally warn |
| `0.30 - 0.49` | Degraded | Mark iteration degraded |
| `< 0.30` | Hard-fail candidate | Retry, narrow scope, or escalate |

Phase 004 default threshold: `0.50`.

## Per-Language Verifier Commands

| Language | Compile / syntax | Execute | Lint / static check |
| --- | --- | --- | --- |
| Python | `python -m py_compile <file>` | `python <file>` | `python -m py_compile <file>` |
| JavaScript | `node --check <file>` | `node <file>` | `node --check <file>` |
| TypeScript | `npx tsc --noEmit` | `npx tsx <file>` | `npx tsc --noEmit` |
| Rust | `rustc --emit=metadata <file>` or `cargo check` | binary/test harness | `cargo check` |
| Go | `go vet <file>` | `go run <file>` | `go vet <file>` |

Commands that execute generated code must run only in a constrained sandbox with timeouts.

## Code Stage Definitions

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

Phase 004's static validator does not auto-fix; the field remains part of the rubric for future sandboxed verification.

## Research-Iteration Adaptation

Research iters often produce markdown rather than code. When compile is N/A, renormalize to:

```text
score =
  cite_accuracy                 * 0.40
+ structure_pass                * 0.30
+ recommendation_actionability  * 0.20
+ anti_hallucination            * 0.10
```

Use this adaptation for self-verification instructions and future research-output validators.

## Research Stage Definitions

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

## Recipe Contract

The shipped `--agent-config` recipes do NOT carry `verification_enabled` / `verification_languages` fields. Devin's strict `--agent-config` parser rejects unknown top-level fields (the same constraint that defers `mcp_servers`), so recipe-level opt-in is deferred until Devin supports custom agent-config fields. The intended shape was:

```json
{
  "verification_enabled": false,
  "verification_languages": []
}
```

When supplied through a Devin-supported channel, `verification_enabled` defaults false.

`verification_languages` is an allowlist of:

- `python`
- `typescript`
- `javascript`
- `rust`
- `go`

Empty means all supported fenced-code languages are eligible when verification is enabled.

## Phase 004 Implementation Notes

The current post-dispatch validator uses static scoring only.

It does not execute arbitrary generated code.

It appends `verification_degraded` to the JSONL state log when an enabled verification pass scores below threshold.

It skips verification when no supported code block exists.

It preserves backward compatibility when verification is absent or false.
