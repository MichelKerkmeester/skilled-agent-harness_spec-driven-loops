# H5 - MLProgram vs NeuralNetwork Format

Verdict: REFUTED

Measured 100 iterations after 5 warmups per format.

| ModelFormat | EP | p50 ms | p95 ms | p99 ms | Mean ms | Error |
|---|---|---:|---:|---:|---:|---|
| MLProgram | CoreMLExecutionProvider | 174.370 | 224.678 | 245.708 | 173.971 |  |
| NeuralNetwork | ERROR | 0.000 | 0.000 | 0.000 | 0.000 | Fail: [ONNXRuntimeError] : 1 : FAIL : Exception during initialization: /Users/cloudtest/vss/_work/1/s/onnxruntime/core/optimizer/initializer.cc:45 onnxruntime::Initializer::Initializer(const onnx::TensorProto &, const std::filesystem::path &) !model_path.empty() was false. model_path must not be empty. Ensure that a path is provided when the model is created or loaded.
 |

Interpretation: a large NeuralNetwork win would make `ModelFormat` a plausible fix.
