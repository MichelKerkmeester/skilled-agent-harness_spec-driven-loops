# H6 - Batch Size Sensitivity

Verdict: REFUTED

Measured 100 iterations after 5 warmups for each batch size. ONNX config: `RequireStaticInputShapes=1`, `max_length=512`, `fixed_padding=True`. The table includes both per-call latency and per-item latency.

| Backend | Batch | EP | p50 call ms | p95 call ms | p99 call ms | p50/item ms | p95/item ms | Error |
|---|---:|---|---:|---:|---:|---:|---:|---|
| onnx | 1 | CoreMLExecutionProvider | 90.319 | 110.882 | 114.197 | 90.319 | 110.882 |  |
| onnx | 8 | CoreMLExecutionProvider | 826.482 | 875.636 | 890.663 | 103.310 | 109.455 |  |
| onnx | 32 | ERROR | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | no worker JSON; prior run did not complete, see scripts/H6-worker-onnx-batch-32-max512-static1.log |
| onnx | 128 | ERROR | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | no worker JSON; prior run did not complete, see scripts/H6-worker-onnx-batch-128-max512-static1.log |
| sbert | 1 | mps:0 | 38.073 | 65.698 | 72.371 | 38.073 | 65.698 |  |
| sbert | 8 | mps:0 | 119.518 | 154.083 | 217.844 | 14.940 | 19.260 |  |
| sbert | 32 | mps:0 | 510.858 | 539.941 | 544.003 | 15.964 | 16.873 |  |
| sbert | 128 | mps:0 | 2035.202 | 2103.075 | 2114.689 | 15.900 | 16.430 |  |

ONNX per-item p50 wins over sbert at matching batch sizes: `[]`.

Interpretation: if ONNX only wins at larger batches, it may still be viable for indexing but not for query latency.
