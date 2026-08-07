# Iteration 16: Key Files And Last Active Child

## Focus

Check resume/discovery metadata adequacy.

## Findings

- Root graph `key_files` includes useful runtime files and prior research artifacts, but it still lists the stale native lock as a key file. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/graph-metadata.json:45] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/graph-metadata.json:49] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/graph-metadata.json:57]
- Phase 009 graph `key_files` omits its active child `002`, `003`, and `004` documents and still has `last_active_child_id: null`. [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/graph-metadata.json:37] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/graph-metadata.json:43] [SOURCE: .opencode/specs/deep-loops/030-agent-loops-improved/009-research-backlog-remediation/graph-metadata.json:124]

## Novelty

newInfoRatio: 0.48. Metadata backfill must include child discovery, not just root key files.
