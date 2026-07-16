# Deep Review v4 Iteration 047 - 012 packet doc accuracy

## Focus

Check whether 012 describes what actually shipped rather than what was true before the final commit.

## Findings

| ID | Severity | Location | Evidence | Recommendation |
|----|----------|----------|----------|----------------|
| P1-V4-012-001 | P1 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/012-v3-remediation/implementation-summary.md:53` | 012 still says `.codex/config.toml` is blocked by sandbox EPERM and that only Claude/Gemini pass launcher grep. At commit `42aa114e3`, `.codex/config.toml:9-11` already routes through `.opencode/bin/spec-kit-memory-launcher.cjs`. The same stale blocker appears in 012 frontmatter and limitations. | Update 012 spec/plan/tasks/implementation-summary to mark Codex launcher parity resolved, leaving only PAT rotation as out of scope. |
| P1-V4-012-002 | P1 | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/012-v3-remediation/implementation-summary.md:51` | 012's example q8 filename uses `context-index__hf-local__onnx-community__embeddinggemma-300m-ONNX__768__q8.sqlite`, but `createProfileSlug()` lowercases and replaces slash with `_`, producing `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite`. | Replace literal filename examples with the actual sanitized basename or describe the derivation without a hard-coded path. |

## Notes

012 did land the code, but its own closeout text now misleads resume and verification flows.
