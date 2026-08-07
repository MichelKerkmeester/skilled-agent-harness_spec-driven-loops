# Iteration 002 — Correctness: cli-opencode README and playbook

## Focus

Checked operator-facing docs and the CO-017 playbook for the same direct `ai-council` route.

## Findings

### F002 — P1 — README still permits direct `ai-council` as a primary route

The README says direct top-level `--agent` use is conditionally allowed for primary agents such as `plan`, `orchestrate`, or `ai-council`, and its troubleshooting table says to use `orchestrate` or `ai-council` when they are documented primary routes. Current `ai-council` frontmatter is `mode: subagent`. [SOURCE: .opencode/skills/cli-opencode/README.md:76] [SOURCE: .opencode/skills/cli-opencode/README.md:164] [SOURCE: .opencode/agents/ai-council.md:4]

### F003 — P1 — CO-017 still expects direct `--agent ai-council` to pass

The root playbook says `ai-council` is a repo-defined primary and CO-017 verifies `--agent ai-council`. The feature file's objective, request, RCAF prompt, process, and command row all require direct `--agent ai-council` and expect exit 0. That contradicts phase 010's current subagent-only state. [SOURCE: .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:362] [SOURCE: .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:417-423] [SOURCE: .opencode/skills/cli-opencode/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy.md:27-33] [SOURCE: .opencode/skills/cli-opencode/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy.md:43] [SOURCE: .opencode/agents/ai-council.md:4]

## Verdict Rationale

Both findings are P1 because they affect executable operator/testing guidance.

Review verdict: CONDITIONAL
