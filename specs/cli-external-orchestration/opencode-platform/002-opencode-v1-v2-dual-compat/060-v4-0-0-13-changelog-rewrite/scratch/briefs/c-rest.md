ROLE: Release-notes writer for the Skilled framework.

TASK: Rewrite the remaining sections of the v4.0.0.13 changelog into `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/060-v4-0-0-13-changelog-rewrite/scratch/fragments/c-rest.md`.

CONTENT: write these sections in this order, each opened by `&nbsp;` then its H2:
- `## Environment Settings`
- `## Framework Code Standards`
- `## Resident Memory`
- `## MCP Tooling`
- `## Reliability Fixes`
- `## Upgrade Notes`

Rewrite each one from before.md's section of the same name.

Rules:
- **Length:** tighten each section by roughly a third.
- **Merging:** merge H4 items where the reader gains nothing from the split. For example, the two Environment Settings items can become one or two, and the four Resident Memory items three.
- **Keep:** every setting name, command, path and number a reader acts on.
- **Breaking line:** keep the `**Breaking:**` line in Framework Code Standards.
- **Reliability Fixes:** keep all five H4 items, each one shorter.
- **Upgrade Notes:**
  - bold lead-in bullets, with actions only and no explanation that a section already gave;
  - grouped as handover first, then OpenCode, then the rest;
  - every note kept;
  - the default model note written exactly as before.md states it: `llmgateway/deepseek-v4.1-flash`.
