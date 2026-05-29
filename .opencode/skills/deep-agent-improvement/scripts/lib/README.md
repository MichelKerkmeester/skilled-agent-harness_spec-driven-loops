---
title: "deep-agent-improvement Scripts Library"
description: "CommonJS library helpers shared by deep-agent-improvement CLI scripts: typed-error wrappers, promotion gate constants, 4-runtime mirror sync verifier."
trigger_phrases:
  - "shared lib"
  - "typed errors promotion gates mirror sync"
---

# deep-agent-improvement Scripts Library

CommonJS helpers shared by sibling deep-agent-improvement CLI scripts.

## 1. OVERVIEW

This directory holds reusable helper modules for the lane scripts under `.opencode/skills/deep-agent-improvement/scripts/` (`agent-improvement/`, `model-benchmark/`, `shared/`).
The modules are consumed by those sibling scripts only and are not a cross-skill import surface.

## 2. LIBRARY CONTENTS

| File | Purpose |
|---|---|
| `typed-errors.cjs` | Typed error wrappers for `FILE_NOT_FOUND`, `PARSE_ERROR`, and `SCRIPT_CRASH`, mirroring deep-loop-runtime's CLI guard pattern. |
| `promotion-gates.cjs` | Promotion thresholds and gate evaluators, including weighted score, benchmark aggregate, and per-dimension gate values. |
| `mirror-sync-verify.cjs` | Four-runtime agent mirror sync verifier for Claude, Codex, Gemini, and OpenCode. It handles Codex TOML body-only token comparison while Markdown mirrors use extracted body equivalence. |

## 3. USAGE

Require these helpers from lane scripts with relative `../lib/` paths.

```js
const { makeTypedError } = require('../lib/typed-errors.cjs');
const { PROMOTION_GATES } = require('../lib/promotion-gates.cjs');
const { verifyMirrorSync } = require('../lib/mirror-sync-verify.cjs');
```

## 4. RELATED RESOURCES

- [Promotion Gate Contract](../../references/shared/promotion_gate_contract.md)
- [Score Dimensions](../../references/agent-improvement/score_dimensions.md)
- [Candidate Proposal Format](../../references/agent-improvement/candidate_proposal_format.md)
