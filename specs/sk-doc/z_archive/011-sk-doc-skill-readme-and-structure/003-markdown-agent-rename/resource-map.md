---
title: "Resource Map: markdown agent rename"
description: "Path ledger for markdown agent rename."
trigger_phrases:
  - "markdown agent rename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/011-sk-doc-skill-readme-and-structure/003-markdown-agent-rename"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented markdown agent rename across runtime mirrors and create-command references"
    next_safe_action: "Run final verification and save continuity"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-sk-doc-skill-readme-and-structure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Resource Map: markdown agent rename

## Expected Read Paths

- `.opencode/agents/create.md`
- `.claude/agents/create.md`
- `.codex/agents/create.toml if present`
- `.codex/config.toml`
- `.gemini/agents/create.md`
- `.opencode/agents/orchestrate.md`
- `.opencode/agents/code.md`
- `.opencode/commands/create/*.md`
- `.opencode/commands/create/assets/*.yaml`
- `.opencode/skills/**`
- `.opencode/commands/**`
- `README.md`
- `AGENTS.md`
- `AGENTS_Barter`

## Expected Write Paths

- `.opencode/agents/markdown.md`
- `.claude/agents/markdown.md`
- `.codex/agents/markdown.toml if source exists`
- `.gemini/agents/markdown.md`
- `.opencode/agents/orchestrate.md`
- `.opencode/agents/code.md`
- `.claude/agents/orchestrate.md`
- `.claude/agents/code.md`
- `.gemini/agents/orchestrate.md`
- `.gemini/agents/code.md`
- `.codex/agents/orchestrate.toml`
- `.codex/agents/code.toml`
- `.codex/agents/markdown.toml`
- `.codex/config.toml`
- `.opencode/commands/speckit/assets/speckit_implement_auto.yaml`
- `.opencode/commands/create/*.md`
- `.opencode/commands/create/assets/*.yaml`
- `.opencode/skills/sk-doc/assets/agent_template.md`
- `AGENTS.md`
- `AGENTS_Barter`

## Verification Commands

- `rg -n "@create|create\.md|create\.toml|Create-Doc Agent|name: create|name = \"create\"|\[agents\.create\]|agents/create\.toml" .opencode/agents .claude/agents .codex/agents .codex/config.toml .gemini/agents .opencode/commands/create .opencode/commands/speckit/assets/speckit_implement_auto.yaml AGENTS.md AGENTS_Barter README.md`
- `rg -n "/create:" .opencode/commands .opencode/skills README.md AGENTS.md AGENTS_Barter`
- `test -f .opencode/agents/markdown.md && test -f .claude/agents/markdown.md && test -f .gemini/agents/markdown.md && test -f .codex/agents/markdown.toml`
- `test ! -e .opencode/agents/create.md && test ! -e .claude/agents/create.md && test ! -e .gemini/agents/create.md && test ! -e .codex/agents/create.toml`

## Risks

- Stale references can remain if exact searches are too narrow.
- Runtime or documentation mirrors can drift if only one surface is updated.

## Dependencies

- Follow the parent phase order unless the user explicitly changes sequencing.
