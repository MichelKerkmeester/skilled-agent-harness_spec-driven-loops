# Review Lineage Resource Map

Scope folder resource-map.md was not present at init, so the formal resource-map coverage gate was skipped.

## Files Sampled In This Lineage
| Path | Role | Iteration |
|------|------|-----------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/C-rest-of-server/spec.md` | Scope definition | 1 |
| `.opencode/skills/system-spec-kit/shared/ipc/socket-server.ts` | Canonical daemon IPC socket server | 1 |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs` | Launcher/client IPC path resolver and bridge probe | 1 |
| `.opencode/bin/lib/model-server-supervision.cjs` | HF model-server socket resolver and lazy listener | 1 |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | mk-spec-memory daemon launcher and sidecar startup | 1 |
| `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` | Daemon-backed CLI front door | 1 |

## Phase-5 Augmentation
- Novel logic gaps: F001 shows incompatible TCP endpoint handling across MCP daemon, launcher/CLI, and HF model-server resolver.
