# Local LLM Feature Tests

## Purpose

This suite validates the documented local embedding runtime behavior against executable Vitest checks. It covers default model/profile selection, profile-keyed sqlite filenames, prefix resolution, offline degradation, and benchmark harnesses for local embedding performance.

## How To Run

Functional tests:

```bash
cd .opencode/skills/system-spec-kit
npx vitest run mcp-server/tests/local-llm-features
```

Performance benchmarks:

```bash
cd .opencode/skills/system-spec-kit
SPECKIT_RUN_BENCHMARKS=true npx vitest bench mcp-server/tests/local-llm-features/performance
```

## Test Groups

| Group | File | Summary |
| --- | --- | --- |
| Default models | `default-model-selection.vitest.ts` | Checks provider-specific default model and dimension selection through startup profiles. |
| Prefix system | `prefix-system.vitest.ts` | Validates model-keyed prefixes plus environment overrides. |
| Health reporting | `health-reporting.vitest.ts` | Checks provider metadata, health-check behavior, and health payload shape. |
| Profile DB filename | `profile-db-filename.vitest.ts` | Asserts profile-keyed database filenames for all providers. |
| Offline degradation | `offline-degradation.vitest.ts` | Covers cache hits, keyword fallback, and retry backoff invariants. |
| Embedding latency | `performance/embedding-latency.bench.ts` | Captures per-text-length latency summaries. |
| Throughput | `performance/throughput.bench.ts` | Captures batch-size throughput summaries. |
| Cold start | `performance/cold-start.bench.ts` | Captures provider creation to first embedding. |

## Skip Conditions

Tests that need `BAAI/bge-base-en-v1.5` skip when the local model cache is absent. The bootstrap auto-selection suite covers cloud, Ollama, and hf-local precedence without requiring real network calls.

## Baseline Format

Benchmark runs write JSON files under `performance/baselines/` using this schema:

```json
{
  "provider": "hf-local",
  "model": "BAAI/bge-base-en-v1.5",
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
