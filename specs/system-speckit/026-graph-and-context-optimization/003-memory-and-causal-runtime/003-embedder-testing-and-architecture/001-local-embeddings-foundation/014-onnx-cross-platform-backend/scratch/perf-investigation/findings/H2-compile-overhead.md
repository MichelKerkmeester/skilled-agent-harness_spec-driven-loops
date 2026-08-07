# H2 - Per-call Graph Compilation Overhead

Verdict: CONFIRMED

Call 1 latency was 1557.495 ms. Calls 2-10 averaged 182.785 ms, so the first-call ratio was 8.52x.

| Call | Latency ms |
|---:|---:|
| 1 | 1557.495 |
| 2 | 159.714 |
| 3 | 205.786 |
| 4 | 217.219 |
| 5 | 228.149 |
| 6 | 180.937 |
| 7 | 156.679 |
| 8 | 139.886 |
| 9 | 187.083 |
| 10 | 169.608 |

## Profile Evidence

- Profile path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/014-onnx-cross-platform-backend/scratch/perf-investigation/profiles/ort-coreml-h2_2026-05-13_11-02-01_422.json`
- Provider event counts: `{"CPUExecutionProvider": 6560, "CoreMLExecutionProvider": 1940}`
- Compile/init event names: `["session_initialization"]`

Interpretation: first-call-only slowness would point to compilation. Uniform slowness after the first call points elsewhere.
