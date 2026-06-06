# Deep-Review Iteration 008 — commands frontmatter + body path refs

**Executor:** DeepSeek-v4-pro (cli-opencode, --pure, read-only)
**Findings:** P0=2 P1=6 P2=1 (total 9)

## Summary
Audited 26 command files across .opencode/commands/ (no .claude/ or .codex/ commands exist). Found 9 broken references: 2 P0 (missing YAML assets that break /create:skill auto/confirm modes), 6 P1 (5 dist/*.js build artifacts that were never compiled, 1 wrong template path), and 1 P2 (typo with space in filename). None caused by #133 de-numbering — these are pre-existing build-gap and path-drift issues.

## Findings
| Sev | Classification | Source | Reference | 133-caused | Recommendation |
|-----|----------------|--------|-----------|-----------|----------------|
| P0 | TARGET_DELETED | `.opencode/commands/create/skill.md` | `.opencode/commands/create/assets/create_skill_auto.yaml` | no | Replace with create_sk_skill_auto.yaml (the actual existing YAML asset for /create:sk-skill) or create the missing YAML |
| P0 | TARGET_DELETED | `.opencode/commands/create/skill.md` | `.opencode/commands/create/assets/create_skill_confirm.yaml` | no | Replace with create_sk_skill_confirm.yaml (the actual existing YAML asset for /create:sk-skill) or create the missing YAML |
| P1 | REAL_BROKEN | `.opencode/commands/memory/save.md` | `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js` | no | No compiled dist/ exists; run the TypeScript build or update all 12+ command references to point to a build step or the TS source |
| P1 | REAL_BROKEN | `.opencode/commands/memory/manage.md` | `.opencode/skills/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js` | no | dist/ not built; reference the TS source or run build |
| P1 | REAL_BROKEN | `.opencode/commands/memory/manage.md` | `.opencode/skills/system-spec-kit/scripts/dist/memory/cleanup-index-scope-violations.js` | no | dist/ not built; reference the TS source or run build |
| P1 | REAL_BROKEN | `.opencode/commands/memory/manage.md` | `.opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js` | no | dist/ not built; reference the TS source or run build |
| P1 | REAL_BROKEN | `.opencode/commands/speckit/complete.md` | `.opencode/skills/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js` | no | dist/ not built; reference the TS source or run build |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/commands/memory/save.md` | `.opencode/skills/system-spec-kit/templates/handover.md` | no | Update path to templates/manifest/handover.md.tmpl |
| P2 | WRONG_SLUG_TARGET_EXISTS | `.opencode/commands/deep/start-review-loop.md` | `.opencode/skills/system-spec-kit/scripts/optimizer/optimizer-control file.json` | no | Filename contains a space; change to optimizer-manifest.json or create optimizer-control-file.json |

Review verdict: FAIL