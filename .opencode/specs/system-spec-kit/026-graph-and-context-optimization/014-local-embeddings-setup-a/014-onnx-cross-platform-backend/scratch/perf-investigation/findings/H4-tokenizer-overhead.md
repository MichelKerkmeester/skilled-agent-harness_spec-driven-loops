# H4 - Tokenizer Overhead at Batch 1

Verdict: REFUTED

Fast-tokenizer p50 was 0.212 ms versus default end-to-end ONNX p50 182.005 ms, or 0.1% of total.
Slow tokenizer p50 / fast tokenizer p50 ratio was 1.00x.

| Row | use_fast | Backend | p50 ms | p95 ms | p99 ms | Mean ms |
|---|---:|---|---:|---:|---:|---:|
| tokenizer-use_fast-True | True | tokenizer | 0.212 | 0.272 | 0.435 | 0.215 |
| tokenizer-use_fast-False | False | tokenizer | 0.211 | 0.239 | 0.279 | 0.206 |
| total-use_fast-None | None | onnx | 182.005 | 226.425 | 254.856 | 178.462 |
| total-use_fast-True | True | onnx | 190.259 | 241.426 | 262.433 | 188.352 |
| total-use_fast-False | False | onnx | 177.977 | 225.612 | 239.938 | 172.486 |

Interpretation: tokenizer-bound means tokenizer time exceeds 30% of total encode latency.
