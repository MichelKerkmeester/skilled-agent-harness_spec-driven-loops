# Iteration 007 — Local-LLM Legacy Hunt

## Focus
This correctness pass scanned live embedding/runtime code, package metadata, MCP command/config surfaces, and focused tests for residue that would contradict the clarified post-014 defaults. I treated the Voyage -> OpenAI -> llama-cpp -> hf-local cascade, llama-cpp auto-selection when installed, Voyage auto-pick with `VOYAGE_API_KEY`, legacy model registries, and temp-test `context-index.sqlite` filenames as intentional unless the line asserted a current production default or install/runtime behavior that conflicts with the canonical state.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-007-001 | P1 | correctness | .opencode/skills/system-spec-kit/package-lock.json:7470 | `"onnxruntime-node": "1.21.0",` | confirmed-residue | Regenerate or repair the lockfile so the rejected ONNX runtime package is not still installed through the committed dependency graph, or explicitly document why this transitive runtime remains unavoidable. |
| L-007-002 | P2 | correctness | .opencode/skills/system-spec-kit/scripts/evals/run-bm25-baseline.ts:10 | `// Live production context-index.sqlite and record results in the` | confirmed-residue | Update the script comment to say it runs against the active provider-profile database resolved by `resolveActiveProfileDbPath`. |
| L-007-003 | P2 | correctness | .opencode/skills/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:169 | `` `${toTimestampId(now)}__pre-restore-context-index.sqlite`, `` | confirmed-residue | Make the backup filename derive from the actual target DB basename so checkpoint restores do not keep emitting singleton-style artifact names. |

## Iteration summary
- Files scanned: 4530
- New findings: 3 (P0=0, P1=1, P2=2)
- Out-of-scope/historical noted but NOT flagged: 14
- Notes: Saturation. The clarified cascade itself looks clean in the current live docs/configs I checked; most remaining hits were prior-iteration duplicates, allowed temp-test filenames, legacy model lookup registries, or frozen forensic/history content. CocoIndex semantic search was unavailable in this session, so this pass used `rg` plus direct reads.
