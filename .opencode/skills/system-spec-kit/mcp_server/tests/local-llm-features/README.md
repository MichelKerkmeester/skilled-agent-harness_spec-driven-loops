# Local LLM Feature Tests

## Purpose

This suite validates the documented post-014 local embedding runtime behavior against executable Vitest checks. It covers the hf-local and llama-cpp provider cascade, default model/profile selection, profile-keyed sqlite filenames, prefix resolution, auto-migration behavior, native module readiness, cross-platform branches, offline degradation, and benchmark harnesses for local embedding performance.

## How To Run

Functional tests:

```bash
cd .opencode/skills/system-spec-kit
npx vitest run mcp_server/tests/local-llm-features
```

Performance benchmarks:

```bash
cd .opencode/skills/system-spec-kit
SPECKIT_RUN_BENCHMARKS=true npx vitest bench mcp_server/tests/local-llm-features/performance
```

## Test Groups

| Group | File | Summary |
| --- | --- | --- |
| Provider cascade | `cascade-resolution.vitest.ts` | Verifies Voyage, OpenAI, llama-cpp, hf-local, and explicit-provider resolution. |
| Default models | `default-model-selection.vitest.ts` | Checks provider-specific default model and dimension selection through startup profiles. |
| Embedding shape | `embedding-shape.vitest.ts` | Exercises real hf-local and optional llama-cpp vector generation when local models exist. |
| Prefix system | `prefix-system.vitest.ts` | Validates model-keyed prefixes plus environment overrides. |
| Auto-migration | `auto-migration.vitest.ts` | Uses isolated sqlite fixtures and migration test overrides. |
| Health reporting | `health-reporting.vitest.ts` | Checks provider metadata, health-check behavior, and health payload shape. |
| Native modules | `native-modules.vitest.ts` | Verifies optional native module resolution and dynamic imports. |
| Profile DB filename | `profile-db-filename.vitest.ts` | Asserts profile-keyed database filenames for all providers. |
| Cross-platform | `cross-platform.vitest.ts` | Gates Apple Silicon and non-Apple behavior with platform checks. |
| Offline degradation | `offline-degradation.vitest.ts` | Covers cache hits, keyword fallback, and retry backoff invariants. |
| Embedding latency | `performance/embedding-latency.bench.ts` | Captures per-text-length latency summaries. |
| Throughput | `performance/throughput.bench.ts` | Captures batch-size throughput summaries. |
| Cold start | `performance/cold-start.bench.ts` | Captures provider creation to first embedding. |
| Migration throughput | `performance/migration-throughput.bench.ts` | Captures simulated 100-row migration rows/sec. |

## Skip Conditions

Tests that need `onnx-community/embeddinggemma-300m-ONNX` skip when the local Transformers.js cache is absent at `~/.cache/huggingface/transformers/onnx-community/embeddinggemma-300m-ONNX`. llama-cpp tests skip unless `getLlamaCppAvailability()` reports the optional module and GGUF model are installed. Apple Silicon checks skip unless `process.platform === 'darwin' && process.arch === 'arm64'`; macOS Metal checks skip on non-Darwin hosts.

## Baseline Format

Benchmark runs write JSON files under `performance/baselines/` using this schema:

```json
{
  "provider": "hf-local",
  "model": "onnx-community/embeddinggemma-300m-ONNX",
  "dim": 768,
  "dtype": "q8",
  "samples": 10,
  "p50_ms": 12.3,
  "p95_ms": 20.1,
  "p99_ms": 25.0,
  "runs": [12.3, 13.1]
}
```

## Maintenance

When adding a feature test, cite the documented claim in a top-level comment, prefer exported runtime surfaces over private implementation details, isolate all filesystem writes in a temp directory, and restore environment variables after each test. Add the test beside the closest existing group, then run the functional command above. Add a benchmark only when the metric is stable enough to compare across intentional local runs.
