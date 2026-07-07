---
title: "Resource Map: sk-doc reference relocation"
description: "Path ledger for sk-doc reference relocation."
trigger_phrases:
  - "sk-doc reference relocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/082-sk-doc-skill-readme-and-structure"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Relocated sk-doc creation references and updated stale paths"
    next_safe_action: "Continue with Phase 2 after reviewing Phase 1 handoff"
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
# Resource Map: sk-doc reference relocation

## Expected Read Paths

- `.opencode/skills/sk-doc/references/specific/`
- `.opencode/skills/sk-doc/SKILL.md`
- `.opencode/skills/sk-doc/README.md`
- `.opencode/commands/create/**`
- `.opencode/agents/**`

## Expected Write Paths

- `.opencode/skills/sk-doc/references/*.md`
- `.opencode/skills/sk-doc/SKILL.md`
- `.opencode/skills/sk-doc/README.md`
- `.opencode/skills/sk-doc/graph-metadata.json`
- `.opencode/commands/README.txt`
- `.opencode/commands/create/**`

## Verification Commands

- `rg -n "sk-doc/references/specific|references/specific" .opencode/skills/sk-doc .opencode/agents .opencode/commands`
- `rg -n "\.opencode/skill/sk-doc|\.\./\.\./skill/sk-doc|\.\./skill/sk-doc|/skill/sk-doc" .opencode/skills/sk-doc .opencode/agents .opencode/commands`
- `test ! -d .opencode/skills/sk-doc/references/specific`

## Risks

- Stale references can remain if exact searches are too narrow.
- Runtime or documentation mirrors can drift if only one surface is updated.

## Dependencies

- Follow the parent phase order unless the user explicitly changes sequencing.
