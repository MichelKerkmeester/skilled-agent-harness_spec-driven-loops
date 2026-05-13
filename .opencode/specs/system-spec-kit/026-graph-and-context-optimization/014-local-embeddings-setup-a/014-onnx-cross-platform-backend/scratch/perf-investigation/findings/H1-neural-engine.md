# H1 - Neural Engine Use

Verdict: REFUTED

The profiling run used CoreML EP with `CPUAndNeuralEngine` for 100 encode calls. The compute-unit sweep measured `CPUOnly`, `CPUAndGPU`, `CPUAndNeuralEngine`, and `All` with 100 measured iterations after 5 warmups.

## Profile Summary

- Profile path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/014-onnx-cross-platform-backend/scratch/perf-investigation/profiles/ort-coreml_2026-05-13_10-56-09_607.json`
- Provider event counts: `{"CPUExecutionProvider": 65600, "CoreMLExecutionProvider": 19400}`
- Compile/init event names: `["session_initialization"]`
- Kernel/name sample: `["/model/dynamic_position_ids/CumSum_kernel_time", "/model/attn_mask_reformat/Cast_kernel_time", "CoreMLExecutionProvider_1313090401036822169_CoreML_1313090401036822169_0_0_kernel_time", "/model/layers.0/input_layernorm/LayerNorm_kernel_time", "/model/dynamic_position_ids/get_seq_len/Gather_1_kernel_time", "/model/attn_mask_reformat/Shape_for_expand/Gather_1_kernel_time", "/model/attn_mask_reformat/Shape_for_expand/Gather_0_kernel_time", "CoreMLExecutionProvider_1313090401036822169_CoreML_1313090401036822169_1_1_kernel_time", "/model/layers.0/attn/k_norm/SimplifiedLayerNormalization_kernel_time", "/model/dynamic_position_ids/Slice_kernel_time", "/model/layers.0/attn/k_rotary/RotaryEmbedding_kernel_time", "/model/layers.0/attn/k_proj/repeat_kv/Reshape_1_kernel_time", "/model/layers.0/attn/v_proj/repeat_kv/Reshape_1_kernel_time", "CoreMLExecutionProvider_1313090401036822169_CoreML_1313090401036822169_2_2_kernel_time", "/model/layers.0/attn/k_proj/repeat_kv/Shape_1/Gather_2_kernel_time", "/model/layers.0/attn/k_proj/repeat_kv/Shape_1/Gather_0_kernel_time", "/model/layers.0/attn/v_proj/repeat_kv/Shape_1/Gather_2_kernel_time", "/model/layers.0/attn/v_proj/repeat_kv/Shape_1/Gather_0_kernel_time", "CoreMLExecutionProvider_1313090401036822169_CoreML_1313090401036822169_3_3_kernel_time", "/model/layers.0/attn/k_proj/repeat_kv/Equal_kernel_time", "/model/layers.0/attn/k_proj/repeat_kv/Where_kernel_time", "/model/layers.0/attn/k_proj/repeat_kv/Expand_kernel_time", "/model/layers.0/attn/k_proj/repeat_kv/Reshape_3_kernel_time", "/model/layers.0/attn/v_proj/repeat_kv/Equal_kernel_time", "/model/layers.0/attn/v_proj/repeat_kv/Where_kernel_time", "/model/layers.0/attn/v_proj/repeat_kv/Expand_kernel_time", "/model/layers.0/attn/v_proj/repeat_kv/Reshape_3_kernel_time", "CoreMLExecutionProvider_1313090401036822169_CoreML_1313090401036822169_4_4_kernel_time", "/model/layers.0/attn/k_proj/repeat_kv/Reshape_4_kernel_time", "/model/layers.0/attn/v_proj/repeat_kv/Reshape_4_kernel_time", "/model/layers.0/attn/q_norm/Reshape_1_kernel_time", "/model/layers.0/attn/q_norm/SimplifiedLayerNormalization_kernel_time", "/model/layers.0/attn/q_norm/Reshape_2_kernel_time", "/model/layers.0/attn/q_rotary/RotaryEmbedding_kernel_time", "/model/attn_mask_reformat/Expand_kernel_time", "/model/layers.0/attn/MultiHeadAttention_kernel_time", "CoreMLExecutionProvider_1313090401036822169_CoreML_1313090401036822169_5_5_kernel_time", "/model/layers.0/post_attention_layernorm/LayerNorm_kernel_time", "CoreMLExecutionProvider_1313090401036822169_CoreML_1313090401036822169_6_6_kernel_time", "/model/layers.0/pre_feedforward_layernorm/LayerNorm_kernel_time"]`

## Compute Unit Results

| MLComputeUnits | EP | p50 ms | p95 ms | p99 ms | Mean ms | Error |
|---|---:|---:|---:|---:|---:|---|
| CPUOnly | CoreMLExecutionProvider | 200.749 | 317.529 | 349.185 | 206.917 |  |
| CPUAndGPU | CoreMLExecutionProvider | 1418.834 | 1685.064 | 1789.439 | 1409.877 |  |
| CPUAndNeuralEngine | CoreMLExecutionProvider | 192.594 | 262.824 | 294.970 | 191.821 |  |
| All | CPUExecutionProvider | 66.113 | 98.704 | 107.708 | 66.456 |  |

## Power / Process Evidence

- `sudo -n powermetrics --samplers ane_power,gpu_power,cpu_power -i 500 -n 30`: `exit=1`
- Raw powermetrics capture: `findings/H1-powermetrics-output.txt`
- Raw `top` snapshots: `findings/H1-top-snapshots.txt`

Interpretation: if powermetrics is unavailable or lacks sudo, the profile provider counts and compute-unit sweep are the primary evidence.
