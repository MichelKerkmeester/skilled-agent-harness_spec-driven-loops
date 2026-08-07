---
title: "Local Embeddings Foundation Phase 044: Post-Wave Suite Revalidation"
description: "Ran scenarios 401-415 through a fresh codex exec runner after the substrate repair wave. All 15 child processes failed at startup before reaching scenario logic. Captured a TSV verdict record plus a per-scenario baseline delta table plus a 3-scenario spot-check plus an architectural analysis of the nested-MCP Metal-context race."
trigger_phrases:
  - "044 suite revalidation"
  - "post-wave scenario runner 401-415"
  - "nested codex exec startup failure"
  - "metal context race spec-kit-memory"
  - "24-- local llm query intelligence revalidation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/044-suite-revalidation` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Packets 037 through 041 repaired the worker, error propagation, chunking, V8 validation plus CocoIndex IPC layers after the 032/002 baseline recorded 2 PASS / 2 PARTIAL / 11 FAIL across scenarios 401-415. A fresh runner was authored to re-execute the same 15 scenarios through `codex exec` child processes and produce a TSV-backed comparison.

All 15 child processes failed before reaching scenario logic with `failed to initialize in-process app-server client: Operation not permitted`, yielding 0 PASS / 0 PARTIAL / 15 FAIL. The failure is a nested-launch sandbox restriction, not a substrate regression. A follow-up 3-scenario spot-check dispatched from a root bash session confirmed the repaired substrate is healthy: `memory_health` shows llama-cpp provider active. 4/4 code-intent queries hit top-5. `memory_save` indexed successfully at id=4435.

The architectural root cause was identified: each `codex exec` child spawns its own `spec-kit-memory-launcher.cjs`, which races for the Apple Metal GPU context already held by the main-session MCP daemon. Three revalidation patterns are documented for future use.

### Added

- Runner script `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.sh` dispatching scenarios 401-415 sequentially with a per-scenario watchdog timeout
- Summary TSV `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.summary.tsv` with 15 verdict rows and a startup-error classification in every detail cell
- Per-scenario raw logs under `_sandbox/24--local-llm-query-intelligence/evidence/per-scenario-logs-post-wave/`
- Level 2 packet docs for 044-suite-revalidation with the baseline-delta table, spot-check results plus architectural analysis of the Metal-context race

### Changed

- None. The runner and evidence are net-new. No existing playbook files or substrate source were modified.

### Fixed

- None. The substrate defects targeted by packets 037-041 were confirmed healthy via the spot-check. The 15 FAIL rows are a launch-environment restriction, not a substrate regression.

### Verification

| Check | Result |
|-------|--------|
| Playbook listing | PASS. Files 401-415 are present at `.opencode/skills/system-spec-kit/manual_testing_playbook/24--local-llm-query-intelligence/`. |
| Runner script executable | PASS. `chmod +x` applied and `bash -n run-2026-05-14-post-wave.sh` exited 0. |
| Scenario suite execution | FAIL. All 15 child processes exited before scenario logic with `failed to initialize in-process app-server client: Operation not permitted`. |
| Summary TSV row count | PASS. `run-2026-05-14-post-wave.summary.tsv` has 15 data rows. |
| Verdict distribution | FAIL result recorded: 0 PASS / 0 PARTIAL / 15 FAIL / 0 SKIP. |
| Baseline comparison | PASS. `implementation-summary.md` contains the per-scenario delta table against the 032/002 baseline. |
| Spot-check substrate health (3 scenarios, root bash) | PASS for substrate layer. `memory_health` provider healthy. 4/4 code-intent queries returned implementation hit in top-5. `memory_save` indexed at id=4435. |
| Strict validate | PASS. `validate.sh --strict` returned RESULT: PASSED with 0 errors and 0 warnings. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.sh` (NEW) | Created | Sequential `codex exec` runner for scenarios 401-415 with per-scenario watchdog. |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-post-wave.summary.tsv` (NEW) | Created | Aggregated scenario verdicts with 15 data rows. |
| `_sandbox/24--local-llm-query-intelligence/evidence/per-scenario-logs-post-wave/` (NEW) | Created | Raw child-process logs for scenarios 401-415. |
| `.opencode/specs/.../044-suite-revalidation/` (NEW) | Created | Level 2 packet docs with baseline-delta table, spot-check results plus architectural analysis. |

### Follow-Ups

- Rerun the full 15-scenario suite from a main-agent direct execution context where the shared MCP daemon eliminates the Metal-context race.
- Investigate single-daemon-shared codex execution so child processes can connect to an existing `spec-kit-memory` daemon rather than spawning their own.
- Confirm whether the 032/002 baseline figures (2 PASS / 2 PARTIAL / 11 FAIL) are also inflated by the same nested-daemon race before treating the post-wave comparison as a quality signal.
