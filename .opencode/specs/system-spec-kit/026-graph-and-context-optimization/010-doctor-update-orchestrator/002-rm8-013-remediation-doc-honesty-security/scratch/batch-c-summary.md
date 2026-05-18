# Batch C Summary

## Counts

- OpenCode doctor markdown commands: 10
- Claude doctor markdown commands: 10
- Codex doctor TOML commands: 0 (BLOCKED - `.codex/commands/doctor` could not be created; `mkdir -p .codex/commands/doctor` returned `Operation not permitted`)
- Gemini doctor TOML commands: 10
- OpenCode doctor commands with skill_agent anchor: 10

## OpenCode Anchors Added

- .opencode/commands/doctor/causal-graph.md
- .opencode/commands/doctor/cocoindex.md
- .opencode/commands/doctor/code-graph.md
- .opencode/commands/doctor/deep-loop.md
- .opencode/commands/doctor/mcp_debug.md
- .opencode/commands/doctor/mcp_install.md
- .opencode/commands/doctor/memory.md
- .opencode/commands/doctor/skill-advisor.md
- .opencode/commands/doctor/skill-budget.md
- .opencode/commands/doctor/update.md

## Codex Files Intended

- .codex/commands/doctor/causal-graph.toml
- .codex/commands/doctor/cocoindex.toml
- .codex/commands/doctor/code-graph.toml
- .codex/commands/doctor/deep-loop.toml
- .codex/commands/doctor/mcp_debug.toml
- .codex/commands/doctor/mcp_install.toml
- .codex/commands/doctor/memory.toml
- .codex/commands/doctor/skill-advisor.toml
- .codex/commands/doctor/skill-budget.toml
- .codex/commands/doctor/update.toml

## Codex Blocker

- Attempted `mkdir -p .codex/commands/doctor` and received `Operation not permitted`.
- No Codex doctor TOML files were created.

## Gemini Files Created

- .gemini/commands/doctor/causal-graph.toml
- .gemini/commands/doctor/cocoindex.toml
- .gemini/commands/doctor/code-graph.toml
- .gemini/commands/doctor/deep-loop.toml
- .gemini/commands/doctor/memory.toml
- .gemini/commands/doctor/skill-advisor.toml
- .gemini/commands/doctor/skill-budget.toml
- .gemini/commands/doctor/update.toml

## Notes

- TOML mirrors follow the existing `.gemini/commands/doctor/mcp_debug.toml` convention: top-level `description` plus `prompt` string.
- Prompt bodies are sourced from the canonical `.opencode/commands/doctor/*.md` body after the YAML frontmatter and include the `skill_agent` anchor at the top.
- `.claude/commands/doctor/` was not modified.
- Verified generated Gemini doctor TOMLs match the expected two-key doctor TOML shape.
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/commands/doctor` passed with one existing warning in `.opencode/commands/doctor/scripts/mcp-doctor-lib.sh`.
- Spec folder strict validation was run and failed on existing template/frontmatter issues in the spec docs; those docs are outside Batch C's allowed write paths.
