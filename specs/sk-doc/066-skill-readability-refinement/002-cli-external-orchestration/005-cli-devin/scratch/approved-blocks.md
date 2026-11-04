```text
cli-devin/
+-- SKILL.md                       # Hard rules and the full rule set
+-- README.md                      # Overview and navigation front page
+-- ROUTER.md                      # Machine router: intent map, resource map and loading levels
+-- hard-rules.json                # Hard-rule checks the dispatch preflight reads
+-- assets/                        # Prompt resources loaded at routing time
|   +-- prompt-quality-card.md     # Fast-path prompt discipline and the CLEAR check, always loaded
|   `-- prompt-templates.md        # Copy-paste prompt templates for common tasks
+-- benchmark/                     # Benchmark reports derived from the manual-testing playbook
+-- changelog/                     # Versioned changelog entries, one file per release
+-- manual-testing-playbook/       # Devin-native manual validation scenarios
`-- references/                    # Deep-dive reference docs loaded by intent
    +-- agent-delegation.md        # Subagent profile roster, routing table and custom AGENT.md patterns
    +-- cli-reference.md           # CLI subcommands, flags, permission modes, auth pre-flight and troubleshooting
    +-- cloud-handoff.md           # /handoff mechanics, use cases and state transfer
    +-- devin-tools.md             # Built-in capabilities: run_subagent, /handoff, MCP and session management
    +-- integration-patterns.md    # Dispatch shapes and the failure-mode matrix
    `-- providers-and-models.md    # Single-source catalog of the curated model families, aliases and defaults
```

