# Resource Map

## Input Status

No `resource-map.md` existed in the target spec folder at phase init. This file is the lineage-local resource map generated for review traceability.

## Primary Scope

| Area | Files Reviewed | Notes |
| --- | --- | --- |
| Constitutional governance | `.opencode/skills/system-spec-kit/constitutional/*.md` | Focused on hard-rule claims, enforcement wording, direct-main workflow, and deep-review executor policy. |
| sk-code standards | `.opencode/skills/sk-code/SKILL.md`, `.opencode/skills/sk-code/references/universal/*.md`, `.opencode/skills/sk-code/assets/**` | Focused on comment hygiene, verification requirements, checklist drift, and version metadata. |
| sk-doc standards | `.opencode/skills/sk-doc/SKILL.md`, `.opencode/skills/sk-doc/assets/**`, `.opencode/skills/sk-doc/references/global/*.md` | Focused on validation standards and version metadata. |

## Connected Enforcement Surfaces

| Surface | Files Reviewed | Reason |
| --- | --- | --- |
| Comment hygiene checker | `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Constitutional and sk-code docs claim hard enforcement of comment hygiene. |
| Claude PostToolUse hook | `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` | Constitutional docs cite this as an automatic check. |
| Git hooks | `.opencode/hooks/pre-commit`, `.opencode/hooks/install-hooks.sh`, `.opencode/hooks/README.md` | Hook install and bypass semantics determine whether the hard-rule claim is true. |
| CI gate | `.github/workflows/comment-hygiene.yml` | The docs call CI one of the automatic comment-hygiene gates. |
| Deep-loop executor routing | `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml`, `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | Constitutional deep-review rule conflicts with current executor support. |
| Version traceability | `.opencode/skills/sk-doc/README.md`, `.opencode/skills/sk-doc/changelog/v1.7.0.0.md`, `.opencode/skills/sk-code/README.md`, `.opencode/skills/sk-code/changelog/v3.3.1.0.md` | SKILL frontmatter, README, and changelog versions diverge. |

## Verification Commands

- `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type skill .opencode/skills/sk-doc/SKILL.md`
- `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type skill .opencode/skills/sk-code/SKILL.md`
- `python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/sk-doc/SKILL.md`
- `python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/sk-code/SKILL.md`
- `git rev-parse --git-path hooks/pre-commit`

Both skill validation commands passed. The structure extraction commands succeeded without the unsupported `--json` flag. The Git hook path check showed the active worktree hook path resolves via Git, not via a literal `.git/hooks` directory in this worktree.
