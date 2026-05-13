# Deep Review Resource Map

| Surface | Files Scanned | P0 | P1 | P2 | Notes |
|---------|---------------|----|----|----|-------|
| Correctness: provider/runtime defaults, profile construction, package/config surfaces, MCP/CocoIndex default-sensitive tests | 17,528 pass-scans | 0 | 1 | 0 | Iterations 001, 004, 007, and 010 reported live resolver/profile behavior aligned with Voyage -> OpenAI -> llama-cpp -> hf-local. One stale 384-dimensional health provider-info assertion remained. |
| Traceability: user-facing markdown, SKILL.md files, install guides, references, templates, prompt/config assets, JSON/YAML/TOML metadata | 11,811 pass-scans | 0 | 0 | 0 | Iterations 002, 005, and 008 reported saturation with no confirmed live traceability residue. Historical/changelog/spec metadata and intentional compatibility docs were excluded. |
| Maintainability: active test fixtures, behavioral checks, script-level schemas, reference/config examples, committed runtime examples | 13,832 pass-scans | 0 | 0 | 9 | Iterations 003, 006, and 009 found nine active fixture advisories: eight stale 384-dimensional fixture usages and one old model-name fixture. |
