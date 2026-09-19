---
title: Orca CLI Troubleshooting
description: Fail-closed recovery for missing binaries, runtime errors, stale browser refs, terminal receipts, and publishing gates.
version: 1.0.0.0
trigger_phrases:
  - "orca troubleshooting"
  - "orca command failed"
  - "orca browser host unavailable"
  - "orca archive hook failed"
importance_tier: important
contextType: general
---

# Orca CLI Troubleshooting

| Symptom | Meaning | Recovery |
|---|---|---|
| `orca` is not found | No selected default executable is on `PATH` | Re-run the documented resolution order. Ask the operator whether to install or configure Orca. Do not inspect source or install silently. |
| `ORCA_CLI_COMMAND` fails | The explicitly selected executable is unusable | Report its path, output, and exit status. Do not fall through to another executable. |
| `skills get` or a reference flag is unknown | The installed CLI predates the guide option or has drifted | Use the full guide or the command's own help. Do not guess flags. |
| `agent-context --json` works but a runtime command fails | Local schema is available but the Orca app/runtime is not ready or reachable | Report the runtime error and use only an authorized read-only recovery path. |
| Worktree removal returns `worktree_archive_hook_failed` | Archive protection blocked deletion | Preserve the archive result. `--force` does not bypass it. Ask before using the explicit failed-hook override. |
| Terminal send returns only `input_accepted` | The request was accepted but a turn is not proven | Do not resend. Use the same request's wait or inspect the reported receipt. |
| Terminal transport failure includes a retry request | Delivery is ambiguous but replay is supported | Repeat the exact command with the reported retry request. Do not compose a new prompt. |
| Bulk terminal close returns `unverifiable` | The host cannot confirm every PTY stopped | Report `unverifiable`; do not claim exit and do not retry on another host. |
| Browser ref is stale | Navigation, tab change, or state-changing interaction invalidated the ref | Snapshot again and use a fresh ref. |
| `browser_host_unavailable` | The desktop hosting a client-hosted page is offline or disconnected | Restore the paired desktop or recreate the page with server placement when appropriate. |
| Publishing returns `artifact_sharing_disabled` or `agent_skill_sharing_disabled` | A human-only desktop permission is off | Tell the operator which permission is required. Do not retry automatically. |
| A command appears to be an MCP route | Documentation or an app integration was mistaken for a CLI callable | Re-check `orca agent-context --json`; the current packet is CLI-only unless a live callable is verified. |

Keep the original JSON or text result, exit status, selected executable, and guide version with any escalation. Do not redact away the error code that explains the recovery, but redact credentials, tokens, private page content, and sensitive terminal output.
