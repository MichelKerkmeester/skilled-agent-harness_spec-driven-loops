VERDICT: FIX

- [P2] `.skilled/skills/cli-external-orchestration/cli-hermes/ROUTER.md:84` | 2 | `render_bare_url` still fires at line 85 because the `~~~` fence is not tracked as code; the finding's fence fix was not applied. The three command lines are unchanged. | Replace the opening `~~~bash` and the closing `~~~` with:
````markdown
```bash
command -v hermes || echo "Not installed. See https://github.com/NousResearch/hermes-agent"
hermes config get providers.llmgateway.base_url </dev/null
```
````

- [P2] `.skilled/skills/cli-external-orchestration/cli-hermes/README.md:109` | 8 | The STRUCTURE tree still omits `hard-rules.json`, which the Path table now lists, so the tree no longer indexes every entry at the packet root. | Insert after line 109:
````markdown
+-- hard-rules.json             # Dispatch preflight checks read beside SKILL.md
````

- [P2] `.skilled/skills/cli-external-orchestration/cli-hermes/references/providers-and-models.md:50` | 9 | The applied replacement drops the third place the key must never appear, so the HEAD guarantee survives only by implication. | Replace `it never appears in a prompt or a repo file.` with `it never appears in a prompt, a repo file, or this skill's files.`

- [P2] `.skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md:20` | 3 | The changed intro drops the `live` qualifier HEAD attached to the contract pin, so the new intro does not keep every claim of the old one. | Replace `The evidence base is the research synthesis and the contract pin:` with `The evidence base is the research synthesis and the live contract pin:`

- [P2] `.skilled/skills/cli-external-orchestration/cli-hermes/references/agent-delegation.md:53` | 9 | The body still names the `005-hermes-runtime-folder` phase as what generated `.hermes/prompts/`, the same stale phase label the hook-contract finding removed. | Replace `The runtime-folder phase generates those templates with a sync script;` with `A sync script generates those templates;`
