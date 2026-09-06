Review iteration 9 of the renamed system-spec-kit runtime package.

Target: .opencode/specs/system-speckit/053-spec-kit-runtime-rename
Dimension: correctness
Angle: public API, package manifests, TypeScript references, build ownership, and model-server import boundary
Executor: inline cli-codex, model gpt-5.6-luna

Read the runtime and scripts manifests, TypeScript project references, public API, validation front end, model-server import boundary, and lockfile entries. Recheck that the package rename is coherent and that every runtime dependency has a production consumer. Replay DR-001 and DR-004 with source evidence, preserve the distinction between installation evidence and consumer evidence, and write only lineage artifacts. Do not run repository tooling or synthesize before iteration 10.
