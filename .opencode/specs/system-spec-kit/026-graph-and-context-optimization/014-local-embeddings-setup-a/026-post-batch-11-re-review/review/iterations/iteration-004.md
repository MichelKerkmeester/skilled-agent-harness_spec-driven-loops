# Iteration 004 — Local-LLM Legacy Hunt

## Focus
This iteration scanned correctness-sensitive runtime scripts, command packs, config files, provider-resolution tests, eval helpers, and fixture generators for residue that would contradict the post-014/post-022 embedding defaults. I prioritized live code and command surfaces that can affect operator behavior, then filtered out the already-covered prior-iteration findings, frozen review/spec history, allowed test temp-file idioms, and intentional legacy model registries.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-004-001 | P1 | correctness | .opencode/commands/doctor/scripts/mcp-doctor.sh:204 | "Fallback: hf-local default profile (covers fresh-install case before any provider DB exists)" | confirmed-residue | Replace the shell fallback with the canonical local default profile (`llama-cpp` when GGUF runtime is installed) or call the shared profile resolver instead of hardcoding hf-local. |
| L-004-002 | P1 | correctness | .claude/commands/doctor/scripts/mcp-doctor.sh:204 | "Fallback: hf-local default profile (covers fresh-install case before any provider DB exists)" | confirmed-residue | Mirror the corrected doctor MCP database probe so Claude's command pack does not treat hf-local as the fresh-install default. |
| L-004-003 | P2 | correctness | .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:22 | "const REAL_DB_PATH = path.join(SKILL_ROOT, 'mcp_server/database/context-index.sqlite');" | confirmed-residue | Update the functional test to locate the active provider-keyed DB or inject a disposable `MEMORY_DB_PATH`; avoid the singleton production DB path. |
| L-004-004 | P2 | correctness | .opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts:609 | "MEMORY_DB_PATH points directly to the active hf-local default profile database (${DEFAULT_HF_LOCAL_DB_FILE}) for disposable fixtures." | confirmed-residue | Reword the generated fixture note to say it pins an explicit disposable hf-local fixture DB, not the active/default profile. |
| L-004-005 | P2 | correctness | .opencode/skills/system-spec-kit/mcp_server/lib/eval/ground-truth-generator.ts:100 | "IDs were mapped from the production context-index.sqlite DB via" | confirmed-residue | Make the eval comment provider-neutral, e.g. "active profile DB", so future eval maintenance does not chase the retired singleton filename. |

## Iteration summary
- Files scanned: 4435
- New findings: 5 (P0=0, P1=2, P2=3)
- Out-of-scope/historical noted but NOT flagged: 14
- Notes: Saturation is showing for the correctness dimension. I did not re-flag the prior `.vscode` config, `/doctor:update` Voyage/vector wording, 017 metadata, vitest temp-dir `context-index.sqlite` patterns, allowed legacy model registries, or frozen review/spec artifacts.
