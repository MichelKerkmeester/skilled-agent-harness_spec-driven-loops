# Compiled-Serving Admission Report

| Hub | Cohort | Verdict | Pass | Drift | Stale gold | n/a | Fitted | Holdout | Uncovered modes |
|-----|--------|---------|------|-------|------------|-----|--------|---------|-----------------|
| `cli-classifier` | admitted | pass | 4 | 0 | 0 | 0 | 3/3 | 0/0 | none |
| `cli-external-orchestration` | admitted | pass | 7 | 0 | 0 | 3 | 5/5 | 2/2 | `cli-codex`, `cli-cursor`, `cli-devin`, `cli-hermes`, `cli-pi` |
| `mcp-tooling` | admitted | pass | 16 | 0 | 0 | 0 | 9/9 | 7/7 | `mcp-notion` |
| `sk-code` | admitted | pass | 1 | 0 | 0 | 0 | 1/1 | 0/0 | `sk-code-obsidian`, `sk-code-skilled`, `sk-code-quality`, `sk-code-review` |
| `sk-design` | admitted | pass | 4 | 0 | 0 | 0 | 2/2 | 2/2 | `sk-design-chart`, `sk-design-fundamentals`, `sk-design-md-generator` |
| `sk-doc` | admitted | pass | 24 | 0 | 0 | 2 | 13/13 | 9/9 | `sk-create-benchmark`, `sk-create-diff`, `sk-create-frontmatter`, `sk-create-goal`, `sk-create-repo-rule`, `sk-create-skill-parent` |
| `system-deep-loop` | admitted | drift | 23 | 1 | 0 | 1 | 21/22 | 0/0 | none |

## cli-external-orchestration

| Scenario | Stage | Status | Reason | Detail |
|----------|-------|--------|--------|--------|
| `manual-testing-playbook/plugins-and-hooks/cli-dispatch-audit-trail.md` | fitted | n/a | no-prompt |  |
| `manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md` | fitted | n/a | no-prompt |  |
| `manual-testing-playbook/plugins-and-hooks/codex-hook-parity.md` | fitted | n/a | no-prompt |  |

## sk-doc

| Scenario | Stage | Status | Reason | Detail |
|----------|-------|--------|--------|--------|
| `manual-testing-playbook/agent-dispatch/markdown-agent-cli-claude-code.md` | fitted | n/a | no-prompt |  |
| `manual-testing-playbook/agent-dispatch/markdown-agent-cli-opencode.md` | fitted | n/a | no-prompt |  |

## system-deep-loop

| Scenario | Stage | Status | Reason | Detail |
|----------|-------|--------|--------|--------|
| `manual-testing-playbook/doctor-commands/README.md` | fitted | n/a | no-prompt |  |
| `manual-testing-playbook/doctor-commands/doctor-deep-loop-lazy-init.md` | fitted | drift | unsafe-route | routed to research |
