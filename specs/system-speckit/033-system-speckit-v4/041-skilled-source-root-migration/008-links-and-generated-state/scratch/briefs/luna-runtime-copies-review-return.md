## Verdict

Not safe to run as edited: Hermes agent copies retain the wrong provenance path, and the command-surface checker will report every regenerated Codex prompt as mirror drift.

## Findings

| ID | Severity | File:line | Scenario | Suggested fix |
|---|---|---|---|---|
| F-001 | P1 must fix before the write run | `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:114` | With default sources, `review.md` is read from `.skilled/agents` (`:25-27`, `:152-158`), but the generated `.hermes/skills/agent-review/SKILL.md` header says `.hermes/agents/review.md`. | Emit `.skilled/agents/${fileName}` in the agent header and add a test assertion. |
| F-002 | P1 must fix before the write run | `.skilled/commands/scripts/validate-command-references.cjs:185-203,255-269` | After `sync-prompts.cjs` writes `.skilled/commands/...` headers (`sync-prompts.cjs:86-91`), `inspectCommandSurface()` still inventories `.opencode/commands` and expects `.opencode` in lines 1 and 6, reporting `mirror-drift` at `:338-350` for every Codex prompt. | Make the inventory and expected-header identity use `.skilled/commands`, or normalize both source spellings before comparison. |
Codex exit 0, 2026-09-17T14:16:12Z to 2026-09-17T14:21:10Z, --model gpt-5.6-luna, reasoning xhigh, service tier fast, --sandbox read-only.
