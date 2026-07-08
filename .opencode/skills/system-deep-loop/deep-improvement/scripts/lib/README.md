---
title: "deep-improvement Scripts Library"
description: "CommonJS library helpers shared by deep-improvement CLI scripts: typed-error wrappers, promotion gate constants, 3-runtime mirror sync verifier."
trigger_phrases:
  - "shared lib"
  - "typed errors promotion gates mirror sync"
---

# deep-improvement Scripts Library

CommonJS helpers shared by sibling deep-improvement CLI scripts.

## 1. OVERVIEW

This directory holds reusable helper modules for the lane scripts under `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/` (`agent-improvement/`, `model-benchmark/`, `shared/`).
The modules are consumed by those sibling scripts only and are not a cross-skill import surface.

## 2. LIBRARY CONTENTS

| File | Purpose |
|---|---|
| `typed-errors.cjs` | Typed error wrappers for `FILE_NOT_FOUND`, `PARSE_ERROR`, and `SCRIPT_CRASH`, mirroring deep-loop-runtime's CLI guard pattern. |
| `promotion-gates.cjs` | Promotion thresholds and gate evaluators, including weighted score, benchmark aggregate, and per-dimension gate values. |
| `mirror-sync-verify.cjs` | Three-runtime agent mirror sync verifier for Claude, OpenCode, and OpenCode. It handles OpenCode TOML body-only token comparison while Markdown mirrors use extracted body equivalence. |
| `profile-resolve.cjs` | Single source of truth for the benchmark profiles-dir default and `fixturePathFor`, shared by `materialize-benchmark-fixtures.cjs` and `run-benchmark.cjs` so the F-P1-4b "resolves identically in both steps" invariant is structural, not a hand-aligned copy. |

## 2a. CLI ARGUMENT DIALECTS (F017-P2-05, intentionally NOT unified)

The lane scripts deliberately keep three separate `parseArgs` dialect families. A single shared parser is NOT extracted because no behavior-preserving superset exists across all of them, and the 017 review brief requires preferring divergence over a risky behavior-changing refactor.

| Dialect family | Scripts | Accepted forms | Notes |
|---|---|---|---|
| Equals-only, bare flag is boolean | `score-candidate.cjs`, `promote-candidate.cjs`, `generate-profile.cjs`, `scan-integration.cjs`, `rollback-candidate.cjs`, `check-mirror-drift.cjs` | `--key=value` only | A bare `--key` is `true`. All docs and YAML invoke these with the equals form, so adding space-form would change parsing semantics (`--key value` would bind the value instead of staying boolean) for no caller benefit. |
| Equals plus space, permissive key | `materialize-benchmark-fixtures.cjs`, `run-benchmark.cjs` | `--key=value` and `--key value` | The Lane B command surface passes space-form flags, so both bind a following non-flag token as the value. |
| Equals plus space, regex-restricted key | `loop-host.cjs` | `--key=value` and `--key value` | Keys are restricted to `[a-z][a-z0-9-]*` and non-matching `--TOKENS` are silently skipped, preserving the TST-1 byte-identity plan. |
| Allowlist plus positional | `dispatch-model.cjs` | Fixed `--executor=` style flags plus a positional `prompt-file` | Recognizes only a known flag set, supports a positional argument, and defaults `--mock` to `false`. A generic key/value parser cannot reproduce the positional capture or the boolean default. |

A superset that accepts both forms would change the equals-only family (it would bind space-form values where today they are boolean) and could not reproduce `dispatch-model.cjs`'s positional and allowlist behavior, so unification is recorded as a documented divergence rather than a code change. Keep each script's parser in sync with its own usage and do not copy one dialect into a script that does not already use it.

## 3. USAGE

Require these helpers from lane scripts with relative `../lib/` paths.

```js
const { makeTypedError } = require('../lib/typed-errors.cjs');
const { PROMOTION_GATES } = require('../lib/promotion-gates.cjs');
const { verifyMirrorSync } = require('../lib/mirror-sync-verify.cjs');
```

## 4. RELATED RESOURCES

- [Promotion Gate Contract](../../references/shared/promotion_gate_contract.md)
- [Score Dimensions](../../references/agent_improvement/score_dimensions.md)
- [Candidate Proposal Format](../../references/agent_improvement/candidate_proposal_format.md)
