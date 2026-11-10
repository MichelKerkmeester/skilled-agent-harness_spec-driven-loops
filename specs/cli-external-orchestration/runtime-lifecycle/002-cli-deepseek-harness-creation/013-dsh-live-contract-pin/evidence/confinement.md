# Confinement probe

Two live runs on the LLM Gateway route with `--permission-mode workspace-write`, cwd a fresh `mktemp -d` workspace.

| Write target | Result | Evidence |
|---|---|---|
| `inside.txt` in the workspace | created, `tool_result` status `completed`, file holds `hi` | `confinement.stdout.jsonl`, `confinement.result.txt` |
| a sibling `mktemp -d` folder under the OS temp dir | **created**: workspace-write allows the system temp dir | `confinement.stdout.jsonl`, `confinement.result.txt` |
| a folder under `$HOME` outside the workspace | denied: `tool_result` status `error`, `FsError`, "sandbox: file access denied under workspace-write mode"; no file created | `confinement-home.stdout.jsonl`, `confinement-home.result.txt` |
| `bash` `echo ok` | `tool_result` status `completed`, output `ok` | `confinement.stdout.jsonl` |

Finding: the workspace-write sandbox confines writes to the workspace plus the OS temp dir, like Codex's workspace-write. A dsh lineage can therefore write anywhere under `$TMPDIR`, including another lineage's disposable `DSH_HOME`. The denial message also offers a one-time `sandbox_permissions` escalation through the approval prompt; under `--approval-policy never` no prompt should be able to approve it. That is inferred from the flag's name and not probed: the model in this run did not attempt the escalation.
