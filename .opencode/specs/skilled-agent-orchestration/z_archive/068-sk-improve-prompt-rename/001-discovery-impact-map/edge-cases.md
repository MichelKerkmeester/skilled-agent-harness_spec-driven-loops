# Phase 001 Edge Cases

1. **Filename embeds.** `find . -name "*sk-improve-prompt*" -not -path "./.git/*"` found active embeds at `.opencode/skills/sk-improve-prompt` and `.opencode/changelog/sk-improve-prompt`; the packet's own `.opencode/specs/skilled-agent-orchestration/z_archive/068-sk-improve-prompt-rename` is excluded by scope. It also found nested-copy paths under `barter/coder/.opencode/...`; those are outside the canonical root `.opencode/` surfaces and are not in `inventory.tsv`.

2. **JSON keys in skill graph.** `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` has 5 refs:
   - line 29: `hub_skills`
   - line 137: weighted relation value
   - line 140: node key
   - line 168: adjacency edge
   - line 335: family list entry

3. **Changelog symlink.** `.opencode/changelog/sk-improve-prompt` exists as a symlink to `../skill/sk-improve-prompt/changelog`, despite the prompt saying it is currently deleted. Phase 002 should rename or recreate it as `.opencode/changelog/sk-prompt` pointing to `../skill/sk-prompt/changelog`.

4. **URL and path links.** Docs and command bodies link to `.opencode/skills/sk-improve-prompt/` or `.opencode/skills/sk-improve-prompt/SKILL.md`, including `.opencode/commands/prompt.md` (10 refs), `.opencode/commands/README.txt` (2 refs), `.gemini/commands/create/prompt.toml` (2 refs), and runtime agent mirrors (9 refs each).

5. **Hardcoded skill IDs.** Python and TypeScript literals appear in `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` (31 refs), `lib/scorer/lanes/explicit.ts` (9 refs), `lib/scorer/lanes/lexical.ts` (1 ref), and `lib/scorer/fusion.ts` (1 ref).

6. **Test fixtures and regression cases.** `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/routing-accuracy/labeled-prompts.jsonl` has 10 expected skill refs. `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` has 2 expected skill refs.

7. **Smart-router observability.** `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` has 15 forward-facing IDs and `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-report.md` has 1. Ignored telemetry and dist shadow logs also contain old IDs when searched with `--no-ignore`, but those are generated history and excluded from the canonical inventory.

8. **Memory database.** `context-index.sqlite` may contain embeddings or metadata for the old skill ID. Defer to Phase 006 re-index instead of editing binary state.

9. **Code-graph node IDs.** CocoIndex or code-graph SQLite state may contain old node IDs for the skill path. Defer to Phase 006 re-index instead of editing binary state.

10. **Root instruction docs.** `AGENTS.md` has 1 active ref at line 325. `CLAUDE.md` is a symlink to `AGENTS.md` and reports the same line when searched directly, so it should not be counted as a separate source file.

11. **Hidden runtime mirrors.** The final sanity command misses `.claude`, `.codex`, `.gemini`, and root `AGENTS.md` unless those paths are searched explicitly. Canonical active count is 58; the exact provided sanity command returns 52.
