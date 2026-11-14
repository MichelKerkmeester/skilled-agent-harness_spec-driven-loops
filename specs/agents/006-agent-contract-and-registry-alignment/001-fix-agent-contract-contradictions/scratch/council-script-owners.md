# Council script owners

Each script `.skilled/agents/ai-council.md` names, and what runs it. Read at commit 0d6afbafc4.

| Script | Named in ai-council.md | Runner |
|---|---|---|
| `runtime/scripts/append-mode-event.cjs --mode ai-council` | ALWAYS rule, sections 12, 13 and 16 | `.skilled/commands/deep/assets/deep-ai-council-auto.yaml` line 66, `state_write_protocol.command` |
| `deep-ai-council/scripts/persist-artifacts.cjs` | Section 16, Memory-Save Payload Routing | The same workflow, line 169 (`persist-artifacts.cjs --seat`), and `.skilled/agents/orchestrate.md` Agent Files row for `@ai-council` at Depth 1 |
| `deep-ai-council/scripts/lib/persist-artifacts.cjs` named writers | ALWAYS rule, sections 9, 13 and 16 | Not runnable by the agent: `bash: deny`. The agent writes the same shapes with Write and Edit |
| `runtime/cli/dist/continuity/generate-context.js` | Section 16, Memory-Save Payload Routing | The same workflow, line 212 |

The agent's frontmatter grants read, write, edit, grep, glob, webfetch, task and list. It denies bash and patch.
