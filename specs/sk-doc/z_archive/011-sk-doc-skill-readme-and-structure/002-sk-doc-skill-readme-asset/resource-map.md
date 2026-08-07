---
title: "Resource Map: sk-doc skill README asset"
description: "Path ledger for sk-doc skill README asset."
trigger_phrases:
  - "sk-doc skill README asset"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/011-sk-doc-skill-readme-and-structure/002-sk-doc-skill-readme-asset"
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
# Resource Map: sk-doc skill README asset

## Expected Read Paths

- `.opencode/skills/*/README.md`
- `.opencode/skills/sk-doc/assets/readme/readme_template.md`
- `.opencode/skills/sk-doc/assets/readme/readme_code_template.md`
- `.opencode/skills/sk-doc/SKILL.md`
- `.opencode/skills/sk-doc/references/skill_creation.md`

## Expected Write Paths

- `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md`
- `.opencode/skills/sk-doc/SKILL.md`
- `.opencode/skills/sk-doc/references/skill_creation.md`
- `.opencode/skills/sk-doc/manual_testing_playbook*/**`

## Verification Commands

- `rg -n "skill_readme|assets/skill/.*readme" .opencode/skills/sk-doc`
- `test -f .opencode/skills/sk-doc/assets/skill/skill_readme_template.md`
- `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-doc --check`
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/sk-doc`
- `grep` check for stale playbook text: `3 resources`, `both skill asset templates`, `all 21 enumerated`, `SKILL_CREATION query, 3`, `median (3 resources)`.
- `grep` check for old template section: `## 1\. WHEN TO USE` in `skill_readme_template.md`.

## Risks

- Stale references can remain if exact searches are too narrow.
- Runtime or documentation mirrors can drift if only one surface is updated.

## Dependencies

- Follow the parent phase order unless the user explicitly changes sequencing.
