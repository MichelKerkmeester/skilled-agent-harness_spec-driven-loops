---
title: "Changelog: 022/012 Remove llama-cpp Residue from Live Surface"
description: "11 live files cleaned of llama-cpp references across source comments, scripts, docs. Runtime code was already purged in arc 016. This packet completed the narrative and documentation tail so the codebase no longer mentions llama-cpp as a supported provider."
trigger_phrases:
  - "022/012 remove llama-cpp residue"
  - "llama-cpp purge residue"
  - "remove llama-cpp references"
  - "NODE_LLAMA_CPP_GPU cleanup"
  - "embedder residue cleanup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/012-remove-llama-cpp-residue`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

Arc 016 phases 003/006/007 had already removed llama-cpp from all runtime code paths (factory, profile, auto-select, providers, types). However 11 live files outside those runtime paths still contained residue: historical comments documenting the prior purge, install-guide sections listing llama-cpp as a supported provider, a dead `NODE_LLAMA_CPP_GPU` env var setter in a repair script, two test-fixture strings, doctor-command examples, an embedder architecture table column, plus two manual-testing-playbook scenario files using `llama-cpp.ts` as the example subject path.

A single-pass surgical edit across all 11 files removed every remaining live reference. Source-code comment blocks were rewritten to describe the current state rather than the historical purge. Scripts had the dead env-var setter and its explanatory comment removed. Install-guide sections were updated to reflect the actual cascade order (`ollama` then `hf-local` then Voyage then OpenAI) that `auto-select.ts` already implemented. Manual-testing-playbook scenario paths were redirected to the real existing `hf-local.ts` provider. All five verification checks passed with zero remaining hits in non-archived non-benchmark paths.

### Added

None.

### Changed

- `.opencode/skills/system-spec-kit/shared/embeddings/types.ts`: 6-line historical-purge comment block rewritten to a 2-line current-state comment
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/index.ts`: 7-line `LlamaCppBaselineAdapter`-removal block simplified to 4 lines describing the current cascade (Ollama, hf-local, OpenAI, Voyage)
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`: 2 test-workload string replacements (`'llama cpp'` to `'ollama embed'` and natural-language probe rewritten to reference Ollama)
- `.opencode/install_guides/README.md`: 7 surgical section edits updating provider list, cascade priority, model size, env vars, validation checklist, troubleshooting to match `auto-select.ts`
- `.opencode/commands/doctor/assets/doctor_memory.yaml`: `"llama-cpp"` dropped from the invariant profile list
- `.opencode/commands/doctor/update.md`: example `snapshot_path` renamed from `context-index__llama-cpp__...` to `context-index__hf-local__...`
- `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md`: routing-table column header trimmed from `"Future sentence-transformers / llama-cpp"` to `"Future sentence-transformers"`
- `.opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/detect-changes-multi-file-diff.md`: 4 path references `shared/embeddings/providers/llama-cpp.ts` replaced with `shared/embeddings/providers/hf-local.ts`. Class name `LlamaCppProvider` replaced with `HfLocalProvider`
- `.opencode/skills/system-code-graph/manual_testing_playbook/06--mcp-tool-surface/code-graph-query-blast-radius.md`: 1 path substitution `llama-cpp.ts` replaced with `hf-local.ts`

### Fixed

- `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs`: dead `process.env.NODE_LLAMA_CPP_GPU ??= 'false'` env-var setter and its 2-line explanatory comment removed
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts`: 3-line llama-cpp purge reference dropped from shim header

### Verification

| Requirement | Check | Result |
|-------------|-------|--------|
| R1 | `rg -i "llama.?cpp\|LLAMA_CPP" .opencode/ -g '!z_archive/**' -g '!*/scratch/**' -g '!benchmarks/**' -g '!*/specs/**'` | Empty. PASS |
| R2 | `npx tsc --noEmit -p .opencode/skills/system-skill-advisor/mcp_server/tsconfig.json` | No new errors. Pre-existing `TS5101 baseUrl deprecation` warning unrelated. PASS |
| R3 | `node --check` on both modified `.mjs` files | Both exit 0. PASS |
| R4 | Manual read of `install_guides/README.md` cascade narrative | Cascade reads `ollama` (if reachable), `hf-local` default, `VOYAGE_API_KEY`, `OPENAI_API_KEY` consistently across sections 7, 9, 10.2, 13. PASS |
| R5 | Manual read of 2 manual-testing-playbook scenarios | Both reference `shared/embeddings/providers/hf-local.ts` (a real current file). PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/shared/embeddings/types.ts` | Modified | 6-line historical-purge comment block rewritten to 2-line current-state comment |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts` | Modified | 3-line llama-cpp purge reference dropped from shim header |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/index.ts` | Modified | 7-line removal block simplified to 4-line current cascade description |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs` | Modified | Dead `NODE_LLAMA_CPP_GPU` env-var setter and 2-line comment removed |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` | Modified | 2 test-fixture strings replaced with Ollama equivalents |
| `.opencode/install_guides/README.md` | Modified | 7 surgical section edits: provider list, cascade priority, env vars, validation checklist, troubleshooting |
| `.opencode/commands/doctor/assets/doctor_memory.yaml` | Modified | `"llama-cpp"` dropped from invariant profile list |
| `.opencode/commands/doctor/update.md` | Modified | Example `snapshot_path` renamed to `hf-local` variant |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Modified | Routing-table column header trimmed to remove `/ llama-cpp` suffix |
| `.opencode/skills/system-code-graph/manual_testing_playbook/03--detect-changes/detect-changes-multi-file-diff.md` | Modified | 4 path refs + 1 class name replaced from llama-cpp to hf-local equivalents |
| `.opencode/skills/system-code-graph/manual_testing_playbook/06--mcp-tool-surface/code-graph-query-blast-radius.md` | Modified | 1 path substitution: `llama-cpp.ts` to `hf-local.ts` |

### Follow-Ups

- Remaining llama-cpp hits in `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20/` reference a `z_archive/` spec path. These are frozen historical benchmark artifacts per sk-doc benchmark template convention. Do not modify.
- All hits in `z_archive/`, `/scratch/`, `iteration-*.md`, plus old commit history are intentionally preserved as historical record. No action needed.
- Confirm whether `node-llama-cpp` still appears as a dependency in `package.json` or `package-lock.json`. A separate dep-prune pass would be needed to fully remove it. Verify that no transitive consumer remains before pruning.
- Confirm whether any runtime code still respects `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA`. The env var was removed from documentation only. Arc 018 was expected to be the last consumer. No action expected but confirm before closing.
