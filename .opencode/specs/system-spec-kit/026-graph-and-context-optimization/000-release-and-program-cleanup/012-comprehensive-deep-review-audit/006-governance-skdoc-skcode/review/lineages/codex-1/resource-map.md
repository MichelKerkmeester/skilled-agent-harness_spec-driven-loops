---
title: Deep Review Evidence Resource Map
description: Evidence map emitted from codex-1 review deltas.
---

# Deep Review Evidence Resource Map

`resource_map_present` was false at init for the target spec folder, so the Resource Map Coverage Gate is not part of the final verdict. This file maps the converged review evidence for merge and remediation.

## 1. Governance
- `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md`: F002, constitutional enforcement wording.
- `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md`: F002, authorized direct-push path.
- `.github/workflows/comment-hygiene.yml`: F002, PR-only CI trigger.
- `.opencode/scripts/git-hooks/pre-commit`: F002, client-side bypass surface.

## 2. sk-code
- `.opencode/skills/sk-code/SKILL.md`: F001, documented manual command.
- `.opencode/skills/sk-code/references/universal/code_quality_standards.md`: F001, F002, manual command and enforcement docs.
- `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md`: F001, checklist command.
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh`: F001, F005, Python shebang and `.sh` naming.
- `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh`: F002, F005, warn-only write-time hook and Python `.sh` naming.
- `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py`: F005, extension-to-language classification.

## 3. sk-doc
- `.opencode/skills/sk-doc/assets/frontmatter_templates.md`: F003, spec-frontmatter policy drift.
- `.opencode/skills/sk-doc/references/global/core_standards.md`: F004, filename convention drift.
- `.opencode/skills/sk-doc/SKILL.md`: F004, filename autofix claim.
- `.opencode/skills/sk-doc/manual_testing_playbook/06--agent-dispatch/markdown-agent-cli-codex.md`: F004, shipped hyphenated playbook file.

## 4. Spec Kit Templates
- `.opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl`: F003, current spec YAML frontmatter.
- `.opencode/skills/system-spec-kit/templates/examples/level_1/spec.md`: F003, current example spec YAML frontmatter.
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md`: F003, active target spec frontmatter.
