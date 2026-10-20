# Failed Runs

_Derived after the fact from this run's stored record, not written at run time._

> cli-opencode · live · opencode · llmgateway/deepseek-v4.1-flash · high

7 of 34 checked behaviors recorded FAIL. Every FAIL is on OpenCode 2.0.32; all 17 plugins passed on OpenCode 1.19.3.

## CO-041-V2 `cli-dispatch-audit`

- **Reason**: the shell tool is named shell on OpenCode 2; the command ran unblocked and no audit record was written
- **Evidence**: `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/scratch/live-runs/dispatch-guard.v2.txt`, `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/scratch/live-runs/dispatch-audit.v2.txt`

## CO-042-V2 `codex-hooks-watchdog`

- **Reason**: opencode2 run delivers no session.created for its own session; nothing logged
- **Evidence**: `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/scratch/live-runs/baseline.v2.txt`

## CO-045-V2 `session-cleanup`

- **Reason**: startup guards never run because the run session gets no session.created; dispose still logs
- **Evidence**: `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/scratch/live-runs/baseline.v2.txt`

## CO-046-V2 `session-relaunch`

- **Reason**: bridged message.updated has no properties.sessionID or info.time.completed, so usage is never recorded
- **Evidence**: `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/scratch/live-runs/session-relaunch.v2.txt`

## CO-048-V2 `sk-git-message-gate`

- **Reason**: the shell tool is named shell; only the git commit-msg hook refused; HEAD unchanged
- **Evidence**: `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/scratch/live-runs/git-message-gate.v2.txt`

## CO-049-V2 `sk-git-preflight-advisory`

- **Reason**: the shell tool is named shell; no advisory
- **Evidence**: `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/scratch/live-runs/git-preflight.v2.txt`

## CO-052-V2 `system-deep-loop-guard`

- **Reason**: the subagent tool is named subagent with argument agent; the guard never ran
- **Evidence**: `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/scratch/live-runs/deep-loop-guard.v2.txt`

