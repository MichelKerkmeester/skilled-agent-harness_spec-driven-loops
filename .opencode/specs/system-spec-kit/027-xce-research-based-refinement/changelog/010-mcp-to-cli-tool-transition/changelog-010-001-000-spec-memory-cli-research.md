---
title: "Changelog: 001-spec-memory-cli / 000-spec-memory-cli-research"
description: "GO verdict for spec-memory CLI transition: 4-run research series produced a parity matrix, risk register, and implementation design with zero feature loss confirmed."
trigger_phrases:
  - "spec-memory cli research changelog"
  - "028 go verdict changelog"
  - "memory cli feasibility changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-06

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli`

### Summary

Four successive deep-research runs produced a decision-grade GO verdict for replacing the mk-spec-memory MCP with a daemon-backed CLI. The research confirmed zero feature loss is achievable across all 37 tools provided the daemon stays running, adjudicated lane disagreements on spawn strategy, and ran a final risk-closure pass leaving zero unresolved or unexamined items. The implementation design, parity matrix, and effort estimate (10-13 engineering days) landed here as the foundation for the 001-spec-memory-cli workstream.

### Added

- Run-1 multi-lane deep research: three heterogeneous lanes (DeepSeek-v4-pro, MiniMax-M3, MiMo-V2.5-Pro) each ran 5 forced iterations; merged synthesis includes a 37-tool parity matrix and go/no-go verdict with risk register (`research/research.md`)
- Run-2 CLI back-end design: codex lane (gpt-5.5 xhigh, 3 forced iterations) turned the GO verdict into a buildable design for `spec-memory-cli.ts` behind a `bin/spec-memory.cjs` shim with auto-spawn via the existing launcher (`research/cli-backend/lineages/gpt/research.md`)
- Run-3 risk resolution: two convergence-driven lanes (deepseek-v4-pro and mimo-v2.5-pro) classified all 11 risk register items as terminal; produced 8 design deltas and a consolidated 10-13 day estimate (`research/risk-resolution/`)
- Run-4 total risk closure: single convergence lane (gpt-5.5 xhigh, cap 20) converged at 4/20 iterations with all 8 items terminal, two run-3 deferrals resolved, and per-call overhead measured (~40-46ms p95 warm, ~150ms cold) (`research/risk-closure/`)
- Spec.md updated with generated findings fence (runs 1-4), answered questions, and Complete status

### Changed

- `spec.md` — added runs 1-4 findings fence and Complete status
- `tasks.md`, `plan.md`, `implementation-summary.md` — reconciled with run evidence

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| Pre-run `validate.sh --strict` | PASS (0 errors, 0 warnings) |
| Lane outcomes (3/3 run-1) | PASS — 3 lanes, 15 iterations, 0 failures |
| Run-2 lane outcome | PASS — 1/1, 3/3 forced iterations, design file:line-cited |
| Run-3 lane outcomes | PASS — 2/2, all items terminal |
| Run-4 convergence | PASS — 1/1, 4/20 iterations, score 0.97, 8/8 terminal |
| Post-writeback strict validation | PASS (0 errors, 0 warnings) |

### Files Changed

| File | Action | Purpose |
|------|---------|---------|
| `research/**` | Created | Run-1: 3 lane packets (15 iterations), merged registry, root synthesis |
| `research/cli-backend/**` | Created | Run-2: codex lane (3 iterations), buildable CLI design |
| `research/risk-resolution/**` | Created | Run-3: 2 risk lanes, 8 design deltas, effort estimate |
| `research/risk-closure/**` | Created | Run-4: closure lane, terminal classifications, overhead measurements |
| `spec.md` | Modified | Findings fence (runs 1-4), answered questions, Complete status |
| `tasks.md`, `plan.md`, `implementation-summary.md` | Modified | Reconciliation with run evidence |

### Follow-Ups

- None; all risk items terminal, implementation packet opened as 001-cli-core
