# Iteration 004 - sk-doc And sk-code Standards Drift

## Focus

This pass checked whether sk-code's own authoring resources and verification scripts conform to sk-doc and sk-code standards.

## Evidence Reviewed

- `.opencode/skills/sk-doc/assets/template_rules.json:303-307`
- `.opencode/skills/sk-code/assets/opencode/checklists/skill_authoring.md:8`
- `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code/assets/opencode/checklists/skill_authoring.md`
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh:1`
- `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh:1`
- `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py:31-42`
- `.opencode/skills/sk-code/assets/opencode/checklists/shell_checklist.md:32-52`

## Findings

### F005 - P2 - sk-code authoring checklist assets fail sk-doc asset validation

sk-doc's `asset` rules require an `overview` section. Representative sk-code checklist assets begin with `## 1. PURPOSE` instead, and the validator reports `missing_required_section: overview`.

Fix: add or rename the overview section in the affected checklist assets, or add an explicit sk-code checklist type to the sk-doc rule set.

### F006 - P2 - Python scripts named .sh trigger shell verifier warnings

The alignment verifier classifies files by extension, so `.sh` means shell. Two sk-code scripts named `.sh` start with `#!/usr/bin/env python3`. That creates shell-shebang and strict-mode warnings against files that are not shell scripts.

Fix: rename them to `.py` and update callers, or classify by shebang before extension.

## Claim Adjudication

Both findings are accepted as P2. They create noisy validation and standards drift, but do not independently block the release if the P1s are fixed separately.

Review verdict: PASS
