VERDICT: FIX

- [P2] `.skilled/skills/cli-external-orchestration/cli-hermes/README.md:109` | 8 | The STRUCTURE tree still omits `hard-rules.json`, so the packet-root index is incomplete and the tree half of finding `README.md:102` was not applied. | Insert after `+-- README.md                   # This file`:
  ```
  +-- hard-rules.json            # Dispatch preflight checks read beside SKILL.md
  ```

- [P2] `.skilled/skills/cli-external-orchestration/cli-hermes/ROUTER.md:84` | 2 | `render_bare_url` still fires at line 85 because the block remains `~~~`-fenced, which the render check does not track as code. Finding `ROUTER.md:60` was not applied, so the render check is not at zero. | Replace the opening `~~~bash` and closing `~~~` with triple-backtick fences, leaving the content unchanged:
  ````
  ```bash
  command -v hermes || echo "Not installed. See https://github.com/NousResearch/hermes-agent"
  hermes config get providers.llmgateway.base_url </dev/null
  ```
  ````
