# Review Resource Map

Generated from review delta evidence for lineage `gpt-fast-high`.

## Target Packet

| Path | Role | Review Status |
|---|---|---|
| `spec.md` | Feature scope and current status | Read; status drift found |
| `plan.md` | Implementation plan and DoD | Read; unchecked stale tasks found |
| `tasks.md` | Task completion ledger | Read; claims complete |
| `checklist.md` | Verification checklist | Read; claims complete |
| `implementation-summary.md` | Delivery and verification summary | Read; claims complete |
| `graph-metadata.json` | Graph/search metadata | Read; stale status/key_files found |

## Implementation Surfaces Sampled

| Path | Reason | Review Status |
|---|---|---|
| `.opencode/skills/cli-opencode/SKILL.md` | Current dispatch contract | Read |
| `.opencode/skills/cli-opencode/README.md` | User-facing dispatch contract | Read |
| `.opencode/skills/cli-opencode/references/agent_delegation.md` | Linked roster/routing reference | Read; F001 found |
| `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md` | Living playbook index | Read; F001 found |
| `.opencode/skills/cli-opencode/manual_testing_playbook/cli-invocation/base-non-interactive-invocation.md` | Living scenario | Read; F001 found |
| `.opencode/skills/cli-opencode/manual_testing_playbook/agent-routing/general-agent-default.md` | Living scenario | Read; F001 found |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/agent-improvement/scan-integration.cjs` | Scanner mirror model | Read; no finding |
| `.opencode/plugins/README.md` | Plugin entrypoint count/table | Read; no finding |

## Phase-5 Augmentation

Novel logic gaps found during review:

- F001: `cli-opencode` still contains living `--agent general` and direct subagent examples after the remediation updated the main contract to omit that flag.
- F002: The packet's own completion metadata is not reconciled after claimed completion.
- F003: Graph key-file coverage trails the implementation summary's expanded touched-file set.
