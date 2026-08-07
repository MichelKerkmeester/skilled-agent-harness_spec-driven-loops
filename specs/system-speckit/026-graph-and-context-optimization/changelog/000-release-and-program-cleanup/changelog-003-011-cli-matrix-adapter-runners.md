---
title: "CLI Matrix Adapter Runners: External CLI Adapter Layer for Packet 030 Matrix"
description: "Adds a shared adapter contract with five per-CLI adapters, a 70-cell manifest, a manifest-driven meta-runner, five mocked smoke tests plus runner docs to make packet 030 external CLI cells executable."
trigger_phrases:
  - "CLI matrix adapter runners"
  - "matrix_runners adapter"
  - "adapter-common.ts shared contract"
  - "70-cell CLI manifest"
  - "matrix meta-runner"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/011-cli-matrix-adapter-runners` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass`

### Summary

Packet 035's runtime matrix execution validation returned a CONDITIONAL verdict because 42 of 70 external CLI cells had no runner. No complete manifest, no per-CLI adapter tree. No meta-aggregator existed. This left packet 030's F1-F14 feature matrix design unexecutable for five external CLI executors.

This packet built the full external CLI adapter layer from scratch. A shared adapter contract handles process spawn, timeout, stdout capture, expected-signal detection plus typed result normalization. Five thin CLI adapters wrap `codex`, `copilot`, `gemini`, `claude` plus `opencode`. A 70-cell manifest enumerates every F1-F14 cell for those five executors. A manifest-driven meta-runner loads cells, routes adapters, writes per-cell JSONL plus a `summary.tsv`, then prints aggregated pass rates. Five mocked Vitest smoke tests pin the PASS and timeout paths without invoking real CLIs.

Operators can now route any of the 69 applicable external CLI cells through typed adapters and resolve them to one of five outcomes (`PASS`, `FAIL`, `TIMEOUT_CELL`, `NA`, `BLOCKED`) without conversation context.

### Added

- Shared adapter contract in `adapter-common.ts` exposing `AdapterStatus`, `AdapterInput` plus `AdapterResult` types. A `runCliAdapter` function owns spawn, timeout, capture plus PASS detection.
- Five per-CLI adapters (`adapter-cli-codex.ts`, `adapter-cli-copilot.ts`, `adapter-cli-gemini.ts`, `adapter-cli-claude-code.ts`, `adapter-cli-opencode.ts`) each owning only their command shape
- `matrix-manifest.json` enumerating 70 cells across F1-F14 and five executors with F11 cli-gemini marked `NA`
- `run-matrix.ts` manifest-driven meta-runner with concurrency-3 dispatch, per-cell JSONL output plus `summary.tsv` writing. Prints aggregate pass-rate reporting.
- Feature prompt templates under `matrix_runners/templates/` that emit `MATRIX_CELL_PASS F#` for deterministic stdout detection
- Five mocked Vitest smoke tests covering PASS parsing plus timeout behavior without real CLI invocations
- Runner quickstart docs in `matrix_runners/README.md`

### Changed

- `mcp_server/README.md` updated to list the new `matrix_runners/` directory and its files

### Fixed

- 42 `RUNNER_MISSING` cells in the packet 030 external CLI matrix now have typed adapters and can resolve to a concrete outcome

### Verification

| Command | Result |
|---------|--------|
| `node -e "<manifest sanity check>"` | `70`, `14`, `5`, `F11-cli-gemini` confirmed |
| `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` | Exit 0 |
| `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run matrix-adapter` | Exit 0. 5 files passed. 10 tests passed. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh ... --strict` | Exit 0 |
| CHK-001 Packet 030 design read | PASS. `spec.md` cites `030.../spec.md:48` and `030.../plan.md:54`. |
| CHK-002 Packet 035 findings read | PASS. `spec.md` cites `035.../findings.md:15`, `:73`, `:75`. |
| CHK-003 CLI invocation patterns read | PASS. Adapter argv shapes match CLI docs and existing deep-loop tests. |
| CHK-010 Shared contract is typed | PASS. `adapter-common.ts:14`, `:16`, `:24` define the three exported types. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts` (NEW) | Created | Shared adapter contract. Owns spawn, timeout, stdout capture, expected-signal detection, result normalization. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-codex.ts` (NEW) | Created | Codex adapter. Provides `codex` argv and model defaults. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-copilot.ts` (NEW) | Created | Copilot adapter. Provides `copilot` argv and concurrency note. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-gemini.ts` (NEW) | Created | Gemini adapter. Provides `gemini` argv. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-claude-code.ts` (NEW) | Created | Claude Code adapter. Provides `claude` argv and model defaults. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-cli-opencode.ts` (NEW) | Created | OpenCode adapter. Provides `opencode` argv and model defaults. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/matrix-manifest.json` (NEW) | Created | 70-cell external CLI manifest. F11 cli-gemini is `NA`. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/run-matrix.ts` (NEW) | Created | Manifest-driven meta-runner. Concurrency 3. Writes per-cell JSONL and `summary.tsv`. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/README.md` (NEW) | Created | Runner quickstart. Documents manifest fields, cell outcomes plus verification steps. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-codex.vitest.ts` (NEW) | Created | Mocked smoke tests for the codex adapter. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-gemini.vitest.ts` (NEW) | Created | Mocked smoke tests for the gemini adapter. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-claude-code.vitest.ts` (NEW) | Created | Mocked smoke tests for the claude-code adapter. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/matrix-adapter-opencode.vitest.ts` (NEW) | Created | Mocked smoke tests for the opencode adapter. |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Updated | Structure reference now lists `matrix_runners/` directory. |

### Follow-Ups

- Run real external CLI smoke checks with auth configured. Packet 037 owns this work.
- Fix F11 Copilot hook parity. Packet 038 owns this work.
- Split and harden the F12 progressive validator timeout. Packet 039 owns this work.
- Create the F13 native/inline stress-cycle runner. Packet 040 owns this work.
- Update packet 035 findings once real adapter runs produce outcomes. A later verification packet should consume these runners and publish new findings.
