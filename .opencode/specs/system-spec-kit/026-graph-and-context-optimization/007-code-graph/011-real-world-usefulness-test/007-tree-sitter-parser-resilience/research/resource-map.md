---
title: "Resource map: Tree-sitter parser resilience research"
description: "Path ledger of every artifact touched, created, or referenced across the 7-iteration deep research loop."
trigger_phrases:
  - "tree-sitter resilience resource map"
  - "parser resilience artifacts"
importance_tier: "supplementary"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: level_contract_optional_resource-map | v1.0 -->

# Resource map: Tree-sitter parser resilience research

Lean ledger of every artifact touched, created, or referenced across the 7-iteration deep research loop. Companion to `research/research.md`. All paths are repo-root-relative unless otherwise noted.

---

## READMEs

- (none: this packet ships through the spec-folder template, not a standalone README)

---

## Documents

### Authored in this packet (research outputs)

- `research/research.md`: final 17-section synthesis (this iter 7 deliverable)
- `research/resource-map.md`: this file
- `research/deep-research-strategy.md`: analyst-owned + reducer-owned brain across 7 iterations
- `research/deep-research-config.json`: loop config (max_iterations 7, executor cli-codex/gpt-5.5/high/fast)
- `research/deep-research-state.jsonl`: append-only iteration ledger
- `research/iterations/iteration-001.md` ... `iteration-006.md`: per-iteration find-and-evidence reports
- `research/deltas/iter-001.jsonl` ... `iter-006.jsonl`: per-iteration finding registry deltas
- `research/deltas/iter-007.jsonl`: synthesis-iteration delta (this iter)

### Spec-folder canonical docs (already present, not edited by research)

- `spec.md`: packet specification
- `plan.md`: implementation plan (refinement targets in research.md §10)
- `tasks.md`: T001–T020 task list (refinement targets in research.md §10)
- `checklist.md`: Level 2 QA checklist
- `implementation-summary.md`: to be filled post-implementation per Rule 13
- `description.json`: packet description metadata
- `graph-metadata.json`: graph metadata

---

## Commands

- `/spec_kit:deep-research`: the workflow that drove this 7-iteration loop
- `/spec_kit:plan`: recommended next command (refines plan.md + tasks.md per research.md §10)
- `/spec_kit:implement`: Phase-2 execution after plan refinement
- `/memory:save`: final continuity update post-synthesis

---

## Agents

- `@deep-research`: LEAF agent dispatched once per iteration (iters 1–7)

---

## Skills

- `deep-research` (`.opencode/skills/deep-research/SKILL.md`): workflow + reducer + dashboard contracts
- `system-spec-kit` (`.opencode/skills/system-spec-kit/SKILL.md`): spec-folder + validation contracts
- `cli-codex`: executor lineage (gpt-5.5 high reasoning, fast service tier, workspace-write sandbox)

---

## Specs

### This packet

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/007-tree-sitter-parser-resilience/`

### Sibling packets cited

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/001-execution/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/002-native-rerun/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/003-deep-research-issues/`: surfaced this packet's source signal
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/004-remediation/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/005-scope-guard/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/011-real-world-usefulness-test/006-cluster-a-to-e/`: closed F-002/F-003/F-008/F-011/F-018/F-019

---

## Scripts (research fixtures)

- `scratch/fixtures/iter-003-isolation-test.mjs`: 5-probe isolation harness (iter 3)
- `scratch/fixtures/iter-003-isolation-output.txt`: output of above
- `scratch/fixtures/iter-004-cohort-replay.mjs`: 51-file singleton-replay harness (iter 4)
- `scratch/fixtures/iter-004-cohort-replay-output.txt`: output of above
- `scratch/fixtures/iter-004-026-probe-output.txt`: 0.26.8 dependency-bump swap probe (iter 4)
- `scratch/fixtures/iter-004-oob-cohort.txt`: 51-file ordered cohort enumeration
- `scratch/fixtures/iter-005-stress-loop.mjs`: 5,000-parse long-loop stress harness (iter 5)
- `scratch/fixtures/iter-005-stress-output.txt`: output of above
- `scratch/fixtures/iter-006-r1-reset-on-throw.mjs`: R-1 per-instance reset validation (iter 6)
- `scratch/fixtures/iter-006-r1-output.txt`: output of above
- `scratch/fixtures/iter-006-bash-isolation.mjs`: sh-only / sh-excluded discrimination harness (iter 6)
- `scratch/fixtures/iter-006-variant-a-sh-only-output.txt`: variant A output
- `scratch/fixtures/iter-006-variant-b-sh-excluded-output.txt`: variant B output

---

## Tests

- `mcp_server/code_graph/tests/parser-skip-list.vitest.ts`: to be authored at T015 (Phase-2 implementation)
- `mcp_server/code_graph/tests/parser-quarantine.vitest.ts`: to be authored at T017 (NEW Phase-2 task per research.md §10)

---

## Config

### Read-only references (no edits in this packet)

- `mcp_server/package.json`: tree-sitter dependency pins (web-tree-sitter@0.24.7 + tree-sitter-wasms@0.1.13)
- `mcp_server/node_modules/web-tree-sitter/package.json`: vendored 0.24.7 manifest
- `mcp_server/node_modules/web-tree-sitter/tree-sitter.js`: upstream throw site (line 1163), allowUndefined flag (line 1429), Parser.init (line 2024), Parser.setLanguage (line 2049)
- `mcp_server/node_modules/tree-sitter-wasms/out/tree-sitter-bash.wasm`: missing `external_scanner_reset` export
- `mcp_server/node_modules/tree-sitter-wasms/out/tree-sitter-typescript.wasm`: exports `external_scanner_reset` (control)
- `mcp_server/node_modules/tree-sitter-wasms/out/tree-sitter-javascript.wasm`: exports `external_scanner_reset` (control)
- `mcp_server/node_modules/tree-sitter-wasms/out/tree-sitter-python.wasm`: exports `external_scanner_reset` (control)
- `mcp_server/database/code-graph.sqlite`: live `parse_diagnostics` table (cohort source-of-truth)

### Phase-2 implementation targets (NOT edited by research)

- `mcp_server/code_graph/lib/tree-sitter-parser.ts` (lines 42, 78–94, 680–756: singleton + parse-site catch hook + R-1' sentinel)
- `mcp_server/code_graph/lib/code-graph-db.ts` (lines 209–216 schema migration. 561–593 diagnostics write pattern)
- `mcp_server/code_graph/lib/parser-skip-list.ts`: to be created at T009
- `mcp_server/code_graph/handlers/status.ts`: `parserSkipList` + `parser_health` fields
- `mcp_server/code_graph/handlers/scan.ts`: `parserSkipList.added` + `parserSkipList.healed` deltas
- `mcp_server/code_graph/lib/structural-indexer.ts` (lines 1219–1257 + 2131–2147: caller scan loop, audited read-only by research)

---

## Meta

- **Session ID:** `2026-05-06-parser-resilience-deep-research`
- **Lineage mode:** `new` (generation 1, no parent session)
- **Executor:** `cli-codex` (gpt-5.5, reasoning effort `high`, service tier `fast`, sandbox `workspace-write`, timeout 900 s)
- **Iterations:** 7 of 7 (max_iterations cap)
- **Convergence verdict:** CONVERGED with full mechanism resolution. stop reason `max_iterations_reached_with_full_convergence`
- **Total tool calls (rough estimate, iters 1–6):** ~70 (10–12 per iter average). iter 7 synthesis: ~10
- **Session duration (rough estimate):** ~70 minutes (start 13:50Z, last iter 19:55Z + iter 7 synthesis)
