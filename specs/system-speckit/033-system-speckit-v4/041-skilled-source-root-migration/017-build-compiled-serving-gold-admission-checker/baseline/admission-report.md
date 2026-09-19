# Compiled-Serving Admission Report

| Hub | Cohort | Verdict | Pass | Drift | Stale gold | n/a | Fitted | Holdout | Uncovered modes |
|-----|--------|---------|------|-------|------------|-----|--------|---------|-----------------|
| `cli-external-orchestration` | admitted | pass | 7 | 0 | 0 | 3 | 5/5 | 2/2 | `cli-codex`, `cli-cursor`, `cli-devin`, `cli-hermes`, `cli-pi` |
| `mcp-tooling` | admitted | pass | 16 | 0 | 0 | 0 | 9/9 | 7/7 | `mcp-notion` |
| `sk-code` | admitted | pass | 1 | 0 | 0 | 0 | 1/1 | 0/0 | `sk-code-mobile-cli`, `sk-code-obsidian`, `sk-code-opencode`, `sk-code-quality`, `sk-code-review` |
| `sk-doc` | admitted | drift | 22 | 1 | 1 | 2 | 13/14 | 9/10 | `sk-create-frontmatter`, `sk-create-repo-rule` |
| `system-deep-loop` | admitted | drift | 18 | 2 | 0 | 0 | 16/18 | 0/0 | none |

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
| `manual-testing-playbook/holdout/doc-quality-natural.md` | holdout | drift | silent-defer | engine returned defer |
| `manual-testing-playbook/token-cost-baseline/max-load.md` | fitted | stale-gold | undeclared-mode | sk-design-diagram |

## system-deep-loop

| Scenario | Stage | Status | Reason | Detail |
|----------|-------|--------|--------|--------|
| `manual-testing-playbook/advisor-integration/command-bridge-guard.md` | fitted | drift | unsafe-route | routed to model-benchmark |
| `manual-testing-playbook/mode-routing/mode-hint-override.md` | fitted | drift | silent-defer | engine returned clarify |
