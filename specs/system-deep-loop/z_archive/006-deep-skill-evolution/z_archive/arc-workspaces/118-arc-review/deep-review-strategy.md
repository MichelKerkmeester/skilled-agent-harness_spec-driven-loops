---
title: "Deep Review Strategy — deep-loop-runtime"
description: "10-iter cli-devin SWE-1.6 review of the new deep-loop-runtime skill (118 arc output)."
---

# Deep Review Strategy

## Review Target

`.opencode/skills/deep-loop-runtime/` — the new peer skill shipped by arc 118 (FULL_ISOLATE_NO_MCP). Includes:
- SKILL.md (v1.0.0, sk-doc DQI 95) + README.md (DQI 98) + changelog/v1.0.0.md
- lib/deep-loop/ (10 .ts) + lib/coverage-graph/ (3 .ts)
- scripts/{convergence,upsert,query,status}.cjs
- storage/deep-loop-graph.sqlite
- tests/{unit,integration,lifecycle,_helpers}/ (21 vitest files + spawn-cjs helper)
- feature_catalog/ (18 files) + manual_testing_playbook/ (18 files) + references/ (4 files)
- graph-metadata.json

## Review Dimensions

<!-- ANCHOR:review-dimensions -->
- **Correctness**: lib semantics preserved through the move; .cjs scripts honor the contract documented in 118/003 ADR-001 (CLI args, JSON in/out, exit codes 0/1/2/3, DB lifecycle, finally-block-closes-DB); coverage-graph SQLite schema integrity; loop-lock + atomic-state invariants
- **Security**: no path traversal in script args; SQLite query parameterization; no secrets in code; permissions-gate.ts properly scopes access; sandbox boundaries honored
- **Traceability**: every lib function + script + test cited in the right feature_catalog entry; SKILL.md anchors match content; cross-references between skill artifacts + 118 ADRs are accurate; deep-review v1.4.0.0 changelog correctly cites the dependency switch
- **Maintainability**: TS MODULE headers present per sk-code OPENCODE rule; `'use strict';` on .cjs scripts; tsc --noEmit clean; alignment-drift verifier PASS; sk-doc validate_document.py PASS on all .md
<!-- /ANCHOR:review-dimensions -->

## Known Context

- 117 council deliberation ruled SPLIT (4-seat sk-ai-council via cli-codex gpt-5.5 xhigh + high; advocate split 3-way, Seat D independent SPLIT ruling 92/100). Superseded by user-directive FULL_ISOLATE_NO_MCP for 118.
- 118 arc shipped in 8 phases: scaffold → 001 skeleton → 002-005 bundled (lib mv + script shims + MCP removal + YAML cutover) → 006 collateral → 007 test split → 008 closeout → sk-doc canonical companions
- 8 commits on main: `bd77886d0a 71042e1a33 d485837718 14b40f23b3 be2e777a4f e590c12e19 107c522599 954702a8f4`
- Known caveat: full mcp_server vitest sweep hangs on unrelated infrastructure issue (not a deep-loop-runtime regression). Targeted vitest on deep-loop-runtime/tests/unit/loop-lock.vitest.ts PASS (7/7).

## Convergence Rule

- Max iterations: 10
- Convergence threshold: 0.10 (newFindingsRatio rolling average)
- P0 override: any new P0 in last iter blocks STOP regardless of threshold
- Three quality gates must pass before STOP: evidence (every finding cites file:line), scope (no findings outside review_target), coverage (all 4 dimensions hit ≥ 1 iter)

## Executor Profile

- CLI: cli-devin v1.0.6.3
- Model: swe-1.6 (Cognition coding-specialized)
- Permission mode: dangerous (write access in non-interactive --print mode; per cli-devin SKILL.md user-override table)
- Prompt structure: RCAF (Role / Context / Action / Format) per cli-devin SKILL.md SWE-1.6 Prompt-Quality Contract
- Pre-planning: medium-density (3-4 ordered steps with per-step acceptance) per cli-devin §3 composition guidance
- Bundle-gate language: standard (avoid strict bundle-gate wording — pushes SWE-1.6 to defensive output)
- Dispatch pattern: per-iter with explicit SIGKILL between (memory rule on this Mac)

## Per-Iter Output Contract

Each iter produces:
- `iterations/iteration-NNN.md` — narrative + findings list
- `deltas/iter-NNN.jsonl` — structured per-finding records
- `prompts/iteration-NNN.md` — the actual prompt sent to devin (for audit)
- `logs/iter-NNN-devin.log` — raw devin stdout/stderr
