# scripts/

Operational helpers for `mcp-webflow`. All scripts are read-only toward the repository
(verify-only — they never re-add or edit the registered manual) and never print token values.

| Script | Purpose |
|--------|---------|
| `doctor.sh` | Verifies node/npx versions, the registered `webflow` manual, config parse, and token **presence as a boolean** |
| `install.sh` | Prints the operator install steps (token creation, env export, version pin) and verifies prerequisites |

Run with `bash scripts/doctor.sh` from the packet root, or `bash
.opencode/skills/mcp-tooling/mcp-webflow/scripts/doctor.sh` from the repository root.
