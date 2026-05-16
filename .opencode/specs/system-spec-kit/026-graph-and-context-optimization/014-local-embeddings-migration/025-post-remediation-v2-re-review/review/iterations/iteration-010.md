# Iteration 010 — Local-LLM Legacy Hunt

## Focus
This iteration scanned the live correctness surfaces for post-014 embedding-default residue: hardcoded singleton memory DB paths, dtype-less Voyage DB literals, ONNX runtime references, stale local-default model names, and Voyage Code 3 marketing/default claims. After excluding the review packet itself, frozen history, test-only temp DB idioms, legacy model registries, and prior 001-009 findings, the remaining new residue is concentrated in the Claude command mirror for `/doctor` and `/doctor:update`, where runtime mutation boundaries and probes still point at obsolete DB filenames.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-010-001 | P1 | correctness | .claude/commands/doctor.md:43 | "`mcp_server/database/context-index.sqlite` + voyage embedding DB" | confirmed-residue | Regenerate the Claude `/doctor` mirror so the memory mutation boundary names the active profile-keyed DB contract instead of singleton + vague Voyage sidecar. |
| L-010-002 | P1 | correctness | .claude/commands/doctor.md:44 | "`mcp_server/database/context-index.sqlite` causal_edges table" | confirmed-residue | Update the causal-graph location to resolve the active profile-keyed memory DB that hosts `causal_edges`. |
| L-010-003 | P1 | correctness | .claude/commands/doctor/update.md:213 | "`mcp_server/database/context-index.sqlite`" | confirmed-residue | Replace the `/doctor:update` context-index contract with `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite` or a resolver-backed active DB path. |
| L-010-004 | P1 | correctness | .claude/commands/doctor/update.md:214 | "`mcp_server/database/context-index__voyage__voyage-4__1024.sqlite`" | confirmed-residue | Replace the dtype-less hardcoded Voyage vector DB with the profile-keyed pattern, including the dtype segment. |
| L-010-005 | P1 | correctness | .claude/commands/doctor/update.md:268 | "`mcp_server/database/context-index.sqlite` and `mcp_server/database/context-index.sqlite.pre-doctor-update.*.bak`" | confirmed-residue | Snapshot/rollback boundaries should be derived from the resolved active profile filename, not the removed singleton DB. |
| L-010-006 | P1 | correctness | .claude/commands/doctor/update.md:269 | "`mcp_server/database/context-index__voyage__voyage-4__1024.sqlite` and `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite.pre-doctor-update.*.bak`" | confirmed-residue | Use a dtype-bearing profile-keyed vector DB boundary or runtime-resolved active DB example. |
| L-010-007 | P1 | correctness | .claude/commands/doctor/update.md:323 | "`snapshot_path\": \"mcp_server/database/context-index.sqlite.pre-doctor-update.3.4.1.0.20260509T130100Z.bak`" | confirmed-residue | Regenerate the state-log example from an active profile-keyed DB snapshot path. |
| L-010-008 | P1 | correctness | .claude/commands/doctor/assets/doctor_update.yaml:102 | `"mcp_server/database/context-index.sqlite"  # memory FTS/metadata DB` | confirmed-residue | Change the Claude YAML allowed target to the active profile-keyed memory DB contract or resolve the concrete DB at runtime. |
| L-010-009 | P1 | correctness | .claude/commands/doctor/assets/doctor_update.yaml:104 | `"mcp_server/database/context-index__voyage__voyage-4__1024.sqlite"  # memory vector DB` | confirmed-residue | Replace the stale Voyage literal with `context-index__<provider>__<safe-model>__<dim>__<dtype>.sqlite`. |
| L-010-010 | P1 | correctness | .claude/commands/doctor/assets/doctor_update.yaml:416 | `const db = new Database('.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite');` | confirmed-residue | Use `resolveActiveProfileDbPath` or the same shared profile resolver used by the runtime before counting indexed specs. |
| L-010-011 | P1 | correctness | .claude/commands/doctor/assets/doctor_causal-graph.yaml:78 | `"mcp_server/database/context-index.sqlite"  # host DB for causal_edges table` | confirmed-residue | Resolve the causal-graph host DB through the active embedding profile instead of whitelisting the singleton filename. |
| L-010-012 | P1 | correctness | .claude/commands/doctor/assets/doctor_causal-graph.yaml:161 | `"Bash: stat -f '%m %z' mcp_server/database/context-index.sqlite"` | confirmed-residue | Probe the resolved active profile DB path so Claude `/doctor causal-graph` does not report the live DB as missing. |

## Iteration summary
- Files scanned: 4508
- New findings: 12 (P0=0, P1=12, P2=0)
- Out-of-scope/historical noted but NOT flagged: 154
- Notes: No new disagreement with the clarified Voyage -> OpenAI -> llama-cpp -> hf-local cascade was found. ONNX hits were limited to already-covered docs or dependency-lock/transitive contexts, and MiniLM/Nomic hits were either already covered, intentional backward-compat tests, or legacy model registry support.
