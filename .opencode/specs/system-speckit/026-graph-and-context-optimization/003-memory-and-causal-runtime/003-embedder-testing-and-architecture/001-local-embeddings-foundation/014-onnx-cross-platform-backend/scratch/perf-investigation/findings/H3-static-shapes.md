# H3 - Static vs Dynamic Input Shapes

Verdict: CONFIRMED

Measured 100 iterations after 5 warmups per config. `static-pad128` and `static-pad512` use `RequireStaticInputShapes=1` plus tokenizer padding to `max_length`.

| Config | Static flag | Max length | Fixed padding | EP | p50 ms | p95 ms | p99 ms | Mean ms | Error |
|---|---:|---:|---:|---|---:|---:|---:|---:|---|
| dynamic-max2048 | 0 | 2048 | False | CoreMLExecutionProvider | 214.056 | 261.363 | 279.569 | 210.542 |  |
| static-pad128 | 1 | 128 | True | CoreMLExecutionProvider | 40.968 | 49.257 | 51.434 | 42.038 |  |
| static-pad512 | 1 | 512 | True | CoreMLExecutionProvider | 123.076 | 165.184 | 194.054 | 128.976 |  |

Interpretation: a large static-shape win would mean dynamic shapes blocked the fast CoreML path.
