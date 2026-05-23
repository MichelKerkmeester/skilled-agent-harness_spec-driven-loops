# Review Resource Map

## Entries Touched Or Verified

- `.opencode/agents/markdown.md`
- `.claude/agents/markdown.md`
- `.gemini/agents/markdown.md`
- `.codex/agents/markdown.toml`
- `.opencode/commands/create/*.md`
- `.opencode/commands/create/assets/*.yaml`
- `.opencode/skills/sk-doc/assets/agent_template.md`
- `AGENTS.md`
- Spec packet docs: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `resource-map.md`

## Entries Not Covered By Original Resource Map

- `.codex/config.toml` is a Codex registry consumer for `.codex/agents/*.toml`; post-review remediation updates it to `[agents.markdown]` and `agents/markdown.toml`.
- `.opencode/commands/speckit/assets/speckit_implement_auto.yaml` is a command workflow consumer; post-review remediation updates its component-authoring guard from `@create` to `@markdown`.

## Coverage Gate Result

Resource-map coverage is complete for review purposes. Original release readiness failed because the verification scope omitted `.codex/config.toml`; post-review remediation added that consumer to the Phase 3 resource map and verification command set.
