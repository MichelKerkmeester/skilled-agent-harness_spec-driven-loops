# Review Resource Map

## Init State

The target spec folder did not contain `resource-map.md` at review initialization, so the Resource Map Coverage Gate was skipped.

## Reviewed Surfaces

| Surface | Files |
| --- | --- |
| Constitutional governance | `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md`, `.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md`, `.opencode/skills/system-spec-kit/constitutional/gate-enforcement.md` |
| Enforcement | `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh`, `.opencode/hooks/pre-commit`, `.github/workflows/comment-hygiene.yml` |
| sk-doc | `.opencode/skills/sk-doc/SKILL.md`, `.opencode/skills/sk-doc/references/global/core_standards.md`, `.opencode/skills/sk-doc/references/global/quick_reference.md`, `.opencode/skills/sk-doc/assets/template_rules.json`, `.opencode/skills/sk-doc/scripts/validate_document.py` |
| sk-code | `.opencode/skills/sk-code/SKILL.md`, `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md`, `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py`, `.opencode/skills/sk-code/assets/scripts/test_verify_alignment_drift.py` |

## Novel Logic Gaps

- F001: comment-hygiene regex coverage does not match constitutional forbidden examples.
- F002: `hygiene-ok` escape bypasses unconditional governance language.
- F003: semantic code-search fallback points to memory_search despite memory not indexing arbitrary code.
- F004: sk-doc command requirements drift between prose and machine validation.
- F005: sk-code default verifier can pass warning-only P0 checklist gaps.
