```text
cli-opencode/
  SKILL.md                                        # runtime instructions and the full rule set
  ROUTER.md                                       # machine router: intent map, resource map and loading levels
  README.md                                       # this orientation document
  hard-rules.json                                 # dispatch preflight rules read before a dispatch
  assets/                                         # dispatch templates and permissions-matrix configs
    permissions-matrix.example-packet-local.json  # example matrix: writes confined to the active packet
    permissions-matrix.example-readonly.json      # example matrix: read-only corpus inspection
    permissions-matrix.example-repo-wide.json     # example matrix: .skilled writes with explicit denials
    permissions-matrix.schema.json                # schema for permissions-matrix configs
    prompt-quality-card.md                        # executor-specific model overrides and the CLEAR check
    prompt-templates.md                           # copy-paste prompt templates per use case and agent
  benchmark/                                      # curated validation reports for manual testing playbook runs
  changelog/                                      # versioned release notes
  manual-testing-playbook/                        # per-feature test scenarios grouped by category
  references/                                     # intent-loaded deep-dive reference docs
    agent-delegation.md                           # agent roster, primary versus subagent routing, leaf-agent constraints
    cli-reference.md                              # subcommands, flags, provider auth and version drift
    context-budget.md                             # model context windows and the truncation marker
    destructive-scope-violations.md               # the RM-8 incident and the four-layer prevention playbook
    install-and-versions.md                       # version baselines, side-by-side layout and the capability delta
    integration-patterns.md                       # the use cases, the decision tree and the silent-stdin trap
    opencode-tools.md                             # unique value versus sibling cli-* skills
    permissions-matrix.md                         # matrix schema, resolution semantics and RM-8 replay reasoning
    providers-and-models.md                       # the provider, model and variant-effort roster
    self-invocation-guard.md                      # the layered guard and the parallel-detached exception
  scripts/                                        # setup helper and its tests
    opencode-setup.sh                             # builds the v2, side-by-side or v1 layout and reports version resolution
```

```text
INPUT: prompt + calling runtime
                |
                v
[ADR-001 SELF-INVOCATION GUARD]
- Layer 1: env var lookup (any OPENCODE_* env var present?)
- Layer 2: process ancestry (opencode in parent process tree?)
- Layer 3: best-effort lock-file probe (~/.opencode/state/<id>/lock present? -- heuristic, not guaranteed on every install)
                |
        +-------+-------+
        |               |
       NO              YES
        |               |
        v               v
[CALLING RUNTIME]   [PROMPT KEYWORDS]
        |               |
        |               +-- parallel words ......... USE CASE 2 (in-OpenCode parallel)
        |               +-- self-dispatch only ..... REFUSE (cycle — surface ADR-001 error)
        |
        +-- Anthropic (Claude Code) ............... USE CASE 1 (external to OpenCode)
        +-- Other (OpenCode Copilot)
                |
                v
        [PROJECT SUBSYSTEM NAMED?]
                +-- YES ........................... USE CASE 3 (cross-AI handback)
                +-- NO ............................ USE CASE 1 (external to OpenCode)
```

