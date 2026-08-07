# Review Resource Map

## Artifact Files

- `deep-review-config.json` - lineage configuration and direct artifact binding.
- `deep-review-state.jsonl` - append-only loop state, iteration records, adjudication events, and synthesis event.
- `deep-review-findings-registry.json` - canonical finding registry.
- `deep-review-strategy.md` - review strategy and stop rule.
- `deep-review-dashboard.md` - current dashboard view.
- `review-report.md` - synthesis report.
- `iterations/iteration-001.md` through `iterations/iteration-005.md` - iteration audit trail.
- `logs/executor-audit.log` - requested executor and self-invocation audit.

## Source Surfaces Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/006-governance-skdoc-skcode/spec.md`
- `AGENTS.md`
- `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`
- `.opencode/skills/system-spec-kit/scripts/rules/check-files.sh`
- `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md`
- `.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md`
- `.github/workflows/comment-hygiene.yml`
- `.opencode/scripts/git-hooks/pre-commit`
- `.opencode/hooks/README.md`
- `.opencode/skills/sk-doc/assets/template_rules.json`
- `.opencode/skills/sk-doc/scripts/validate_document.py`
- `.opencode/skills/sk-code/assets/opencode/checklists/`
- `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py`
- `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh`
- `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh`

## Validation Commands Used

- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <target-spec> --strict`
- `node .opencode/skills/system-spec-kit/scripts/utils/template-structure.js docs 1`
- `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code/assets/opencode/checklists/skill_authoring.md`
- `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/sk-code`
