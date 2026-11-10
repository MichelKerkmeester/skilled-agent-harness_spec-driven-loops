```text
.skilled/skills/cli-external-orchestration/cli-hermes/
+-- SKILL.md                    # Hard rules, dispatch shape, gotchas
+-- ROUTER.md                   # Machine router: intent map, resource map and loading levels
+-- README.md                   # This file
+-- hard-rules.json             # Dispatch preflight checks read beside SKILL.md
+-- references/                 # CLI, providers, tools, patterns, delegation, hooks, MCP
+-- assets/                     # Prompt quality card and prompt templates
+-- manual-testing-playbook/    # Playbook root, symlinked into .hermes/
+-- benchmark/                  # Benchmark index for playbook-derived reports
+-- feature-catalog/            # Per-feature inventory of the shipped surface
|   +-- feature-catalog.md      # Canonical current-state inventory for the shipped surface
|   +-- dispatch-guards/        # Hard-rule preflight checks and dispatch-shape recognition
|   +-- fanout-dispatch/        # Executor kind, closed roster, run budget and toolset policy
|   +-- hub-registration/       # Hub mode registration
|   +-- prompt-contract/        # Prompt card and improver eligibility
|   `-- runtime-surface/        # The .hermes/ runtime folder and the repo-guards plugin
`-- changelog/                  # Packet-local changelog
```

```bash
command -v hermes || echo "Not installed. See https://github.com/NousResearch/hermes-agent"
hermes config get providers.llmgateway.base_url </dev/null
```

