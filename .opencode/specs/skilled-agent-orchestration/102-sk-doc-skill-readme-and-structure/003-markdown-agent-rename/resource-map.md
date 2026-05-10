---
title: "Resource Map: markdown agent rename"
description: "Path ledger for markdown agent rename."
trigger_phrases:
  - "markdown agent rename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/102-sk-doc-skill-readme-and-structure"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Prepared planning documentation"
    next_safe_action: "Run implementation phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-sk-doc-skill-readme-and-structure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Resource Map: markdown agent rename

## Expected Read Paths

- `.opencode/agents/create.md`
- `.claude/agents/create.md`
- `.codex/agents/create.md if present`
- `.gemini/agents/create.md`
- `.opencode/agents/orchestrate.md`
- `.opencode/skills/**`
- `.opencode/commands/**`
- `README.md`
- `AGENTS.md`

## Expected Write Paths

- `.opencode/agents/markdown.md`
- `.claude/agents/markdown.md`
- `.codex/agents/markdown.md if source exists`
- `.gemini/agents/markdown.md`
- `reference-bearing docs in requested scopes`

## Verification Commands

- `rg -n "@create|create.md|Create-Doc Agent|name: create" .opencode .claude .codex .gemini README.md AGENTS.md`
- `rg -n "/create:" .opencode/commands .opencode/skills README.md AGENTS.md`

## Risks

- Stale references can remain if exact searches are too narrow.
- Runtime or documentation mirrors can drift if only one surface is updated.

## Dependencies

- Follow the parent phase order unless the user explicitly changes sequencing.
