# Phase 001 Inventory

Measured with `rg -c 'sk-improve-prompt' <path>` after excluding frozen historical scopes and the packet's own docs. The canonical inventory includes hidden runtime mirrors and root `AGENTS.md`; the provided final sanity command counts 52 files because it does not surface those hidden/runtime/root instruction paths.

## Phase 002

- `.opencode/skills/sk-improve-prompt/README.md` (4 refs) - path embeds plus skill name refs
- `.opencode/skills/sk-improve-prompt/SKILL.md` (1 refs) - frontmatter name ref and filename embed
- `.opencode/skills/sk-improve-prompt/assets/cli_prompt_quality_card.md` (3 refs) - asset refs and filename embed through folder
- `.opencode/skills/sk-improve-prompt/changelog/v1.0.0.0.md` (1 refs) - changelog ref and filename embed through folder
- `.opencode/skills/sk-improve-prompt/changelog/v1.1.0.0.md` (7 refs) - changelog refs and filename embed through folder
- `.opencode/skills/sk-improve-prompt/changelog/v1.2.0.0.md` (7 refs) - changelog refs and filename embed through folder
- `.opencode/skills/sk-improve-prompt/graph-metadata.json` (15 refs) - metadata title trigger path refs and filename embed
- `.opencode/skills/sk-improve-prompt/references/depth_framework.md` (1 refs) - reference doc self-ref and filename embed through folder
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` (5 refs) - JSON key and graph edge refs

## Phase 003

- `.opencode/agents/improve-prompt.md` (9 refs) - agent filename unchanged body refs only
- `.opencode/commands/README.txt` (2 refs) - dispatcher README table and link refs
- `.opencode/commands/prompt.md` (10 refs) - dispatcher command body refs
- `.opencode/skills/cli-claude-code/SKILL.md` (1 refs) - parent skill routing table ref
- `.opencode/skills/cli-claude-code/assets/prompt_quality_card.md` (1 refs) - mirrored prompt quality card ref
- `.opencode/skills/cli-claude-code/manual_testing_playbook/07--prompt-templates/002-clear-quality-card-5-check.md` (1 refs) - manual playbook ref
- `.opencode/skills/cli-codex/SKILL.md` (1 refs) - parent skill routing table ref
- `.opencode/skills/cli-codex/assets/prompt_quality_card.md` (1 refs) - mirrored prompt quality card ref
- `.opencode/skills/cli-gemini/SKILL.md` (1 refs) - parent skill routing table ref
- `.opencode/skills/cli-gemini/assets/prompt_quality_card.md` (1 refs) - mirrored prompt quality card ref
- `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` (1 refs) - mirrored prompt quality card ref
- `.opencode/skills/cli-opencode/manual_testing_playbook/07--prompt-templates/002-clear-quality-card.md` (2 refs) - manual playbook refs
- `.opencode/skills/deep-agent-improvement/SKILL.md` (1 refs) - cross-skill reference to prompt skill
- `.opencode/skills/deep-agent-improvement/changelog/v1.1.0.0.md` (1 refs) - cross-skill changelog reference
- `.opencode/skills/deep-agent-improvement/graph-metadata.json` (1 refs) - cross-skill graph metadata reference
- `.opencode/skills/sk-code/assets/opencode/checklists/mcp_server_authoring.md` (2 refs) - advisor authoring checklist refs
- `.opencode/skills/sk-code/manual_testing_playbook/04--skill-advisor-integration/001-advisor-probe-battery.md` (1 refs) - advisor probe playbook ref
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/graph-metadata.json` (1 refs) - advisor graph metadata ref
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts` (1 refs) - hardcoded skill ID literal
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` (9 refs) - hardcoded skill ID literals
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/lexical.ts` (1 refs) - hardcoded skill ID key
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/check-prompt-quality-card-sync.sh` (1 refs) - sync script source path
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` (2 refs) - regression expected_top_any refs
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/routing-accuracy/labeled-prompts.jsonl` (10 refs) - routing accuracy expected skill refs
- `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py` (31 refs) - TOKEN PHRASE and command bridge literals

## Phase 004

- `.claude/agents/improve-prompt.md` (9 refs) - hidden runtime mirror body refs
- `.codex/agents/improve-prompt.toml` (9 refs) - hidden runtime mirror body refs
- `.gemini/agents/improve-prompt.md` (9 refs) - hidden runtime mirror body refs
- `.gemini/commands/create/prompt.toml` (2 refs) - hidden Gemini create command embeds skill path in TOML prompt
- `.gemini/commands/deep/start-agent-improvement-loop.toml` (2 refs) - hidden Gemini command README link refs

## Phase 005

- `.opencode/changelog/agent-orchestration/v2.4.0.0.md` (4 refs) - active changelog refs
- `.opencode/install_guides/README.md` (3 refs) - install guide catalog refs
- `.opencode/install_guides/SET-UP - AGENTS.md` (2 refs) - install guide skill table refs
- `.opencode/skills/README.md` (4 refs) - skill catalog README refs
- `.opencode/skills/system-spec-kit/changelog/v3.4.0.0.md` (1 refs) - active system-spec-kit changelog ref
- `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-report.md` (1 refs) - forward-facing measurement report ID
- `.opencode/skills/system-spec-kit/scripts/observability/smart-router-measurement-results.jsonl` (15 refs) - forward-facing measurement result IDs
- `.opencode/specs/descriptions.json` (4 refs) - generated spec index refs
- `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/deltas/iter-004.jsonl` (1 refs) - active research delta ref
- `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/findings-registry.json` (1 refs) - active research findings ref
- `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/iterations/iteration-004.md` (1 refs) - active research iteration ref
- `.opencode/specs/skilled-agent-orchestration/059-agent-implement-code/research/stream-03-internal-agent-inventory/research/prompts/iteration-4.md` (1 refs) - active research prompt ref
- `.opencode/specs/skilled-agent-orchestration/081-cli-copilot-deprecation-due-to-price-hike/checklist.md` (1 refs) - active predecessor packet ref
- `.opencode/specs/skilled-agent-orchestration/081-cli-copilot-deprecation-due-to-price-hike/plan.md` (1 refs) - active predecessor packet ref
- `.opencode/specs/skilled-agent-orchestration/081-cli-copilot-deprecation-due-to-price-hike/resource-map.md` (1 refs) - active predecessor packet ref
- `.opencode/specs/skilled-agent-orchestration/081-cli-copilot-deprecation-due-to-price-hike/spec.md` (2 refs) - active predecessor packet refs
- `.opencode/specs/skilled-agent-orchestration/081-cli-copilot-deprecation-due-to-price-hike/tasks.md` (1 refs) - active predecessor packet ref
- `AGENTS.md` (1 refs) - root instruction doc ref
- `README.md` (4 refs) - root README refs

## Count Reconciliation

- Canonical inventory rows: 58.
- Exact final sanity command rows: 52.
- Difference: `.claude/agents/improve-prompt.md`, `.codex/agents/improve-prompt.toml`, `.gemini/agents/improve-prompt.md`, `.gemini/commands/create/prompt.toml`, `.gemini/commands/deep/start-agent-improvement-loop.toml`, and `AGENTS.md`.
- `CLAUDE.md` is a symlink to `AGENTS.md`, so it is tracked as an edge case rather than a separate inventory row.
