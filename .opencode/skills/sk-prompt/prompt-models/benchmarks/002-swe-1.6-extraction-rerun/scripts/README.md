---
title: "002-swe-1.6-extraction-rerun/scripts: extraction, live-grader and confirmation rerun scripts"
description: "Scripts that add markdown-to-disk extraction and a live grader to the SWE 1.6 eval loop, plus reproducibility and version-comparison analysis."
---

# 002-swe-1.6-extraction-rerun/scripts

---

## 1. OVERVIEW

`scripts/` reruns the SWE 1.6 eval loop from `001-swe-1.6-eval-loop/` with two additions: a code-extraction layer that writes SWE 1.6's markdown output to disk and a live grader in place of the mocked one. It also holds a reproducibility check and the analysis scripts that compare the resulting v1, v2 and v3 rankings.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `loop-v2.cjs` | Thin wrapper that reruns the sibling eval loop's `loop.cjs` with extraction and the live grader enabled, then mirrors the new state rows into this package's `state/` |
| `extract-files-from-markdown.cjs` | Regex and heuristic extraction layer: infers a file path for each fenced code block in SWE 1.6 output (header, leading comment or backticked path) and writes it into the fixture's working directory, skipping ambiguous blocks |
| `extract-with-grader.cjs` | Second-pass extraction for blocks the regex extractor skipped: asks a small claude-sonnet call to infer the file path, cached by `sha256(block + fixture_id)` so reruns are free |
| `confirm-variant.cjs` | Reproducibility check that dispatches N fresh SWE 1.6 runs per fixture for one variant, bypassing the loop cache. Reports whether the reproduced score stays within tolerance |
| `per-fixture-analysis.cjs` | Computes per-fixture v1-vs-v2 score deltas to surface cases where a variant dominates a single fixture even though it loses the aggregate ranking |
| `synthesize-v2.cjs` | Ranks the v2 (extraction plus live grader) results and compares them against the v1 synthesis |
| `synthesize-v3.cjs` | Three-way ranking comparison across v1 (text-only, mocked), v2 (extraction plus live grader) and v3 (deeper mutation depth) |

## 3. VALIDATION

Run from `002-swe-1.6-extraction-rerun/`:

```bash
node scripts/confirm-variant.cjs --variant <variant-id> --runs 3 --mock
```

This command currently fails before dispatching anything. `confirm-variant.cjs` resolves its eval-loop and rig dependencies to sibling `../003-eval-loop` and `../002-eval-rig` directories, and neither exists at those paths anymore. The eval loop this package reruns is `001-swe-1.6-eval-loop/`, and the shared eval-rig now lives at `003-minimax-prompt-framework/eval-rig/`. Once those module paths resolve, the script is designed to write `state/confirm/confirmation-results.jsonl` plus `confirmation-report.md`.

## 4. RELATED

- [`SKILL.md`](../../../SKILL.md)
