# Deep Research Iteration 2 Prompt

## Route proof

- Mode: `research`
- Target agent: `deep-research`
- Resolved route: `Resolved route: mode=research target_agent=deep-research`
- Executor: `cli-codex model=gpt-5.6-luna`
- Session: `fanout-luna-1784196776045-jwfb3a`
- Artifact root: `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/research/lineages/luna`

## Focus

Broaden the review to Aside account selection, task/session continuation, local MCP process lifecycle, permission modes, profile binding, and unattended-automation limits. Treat convergence as telemetry only because `stopPolicy=max-iterations`; do not synthesize early.

## Required evidence

- Reconcile the documented `aside`, `aside exec`, `aside repl`, `aside mcp`, and `aside account` surfaces with installed CLI help.
- Separate account/profile authentication from MCP transport authentication.
- Describe the observable lifecycle of a fresh stdio MCP process, its persistent REPL, browser-profile binding, and idle behavior.
- Check for a documented daemon/session command or flag; report absence as an evidence boundary.
- Record permission, approval, MFA, CAPTCHA, password, and browser-profile constraints relevant to unattended execution.

## Safety and output constraints

- Do not open or mutate a user browser profile, credentials, or production website.
- Do not run `bdg` or change the parent spec/root `.utcp_config.json`.
- Write only the iteration file, delta JSONL, and state event under the lineage artifact root.
- Cite official Aside pages and exact local command/protocol observations; mark inferences explicitly.
