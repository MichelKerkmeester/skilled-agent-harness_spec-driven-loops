# Iter-9 — ADVERSARIAL second-order hypotheses

## Role
Senior deep-reviewer. Read-only. ADVERSARIAL — actively hunt for issues prior iters might have missed.

## Hypotheses to test
1. **H-A**: Some auto-generated tool still references old paths (skill-graph SQLite, indexer DBs, advisor cache).
2. **H-B**: 2 changelogs created for rename (sk-ai-small-model/v0.3.0.0.md + sk-ai-council/v1.2.0.0.md) — verify each documents the rename clearly and cites verification.
3. **H-C**: Memory files at `~/.claude/projects/.../memory/` have stale references (out of repo scope but referenced by repo).
4. **H-D**: Symlinks anywhere pointing at old paths (the prior `sk-ai-small-model/changelog/changelog` recursive symlink was found and fixed; are there others?).
5. **H-E**: TypeScript types or interfaces named after old skill (e.g., a `DeepAiCouncilFoo` type that survived sed because of CamelCase).
6. **H-F**: Markdown wikilinks `[[deep-ai-council]]` or `[[sk-small-model]]` anywhere in spec docs.
7. **H-G**: Open question: is the rename-pattern.md doc (system-spec-kit/references/) findable + helpful for a future similar rename?

### Checks
For each hypothesis, run grep / find / jq and report `verdict: no_findings | findings_detected`.

## Output
JSON FINDINGS (with explicit `hypothesis_results` block) + NARRATIVE. End.
