# Run-store and lifecycle contract v1

All derived history lives below `<project>/.supercov`; the reusable isolated
workspace lives at `<project>/supercov/workspace/<project-name>` because a dot
path changes application behavior in common web stacks. The outer `supercov/`
directory is tool-owned only when `.supercov-workspace-store` exists.

Published runs are immutable:

```text
.supercov/runs/<run-id>/run.json
.supercov/runs/<run-id>/evidence.raw.gz
```

Transient state is recoverable:

```text
.supercov/work/<run-id>/state.json
.supercov/evidence/<run-id>/...
.supercov/locks/project.lock
.supercov/.trash/...
```

Run IDs are UTC ISO timestamps with `:` and `.` replaced by `-`; merged runs
append `-merge`. A published directory becomes visible with one atomic rename
only after both required files are complete. Queries ignore staging data.

Lifecycle states are `preparing`, `building`, `testing`, `publishing`,
`complete`, `failed`, `interrupted`, and `abandoned`. The last four are
terminal. State includes run ID, owning PID, project root, workspace, start and
update timestamps, and may include signal/error. A dead owner is recoverable;
live work is never removed by retention.

The ordinary project source and build output are never modified. Isolation
uses clonefile/reflink where safe and ordinary copy as the semantic fallback.
Links escaping the project are rejected. Cache reuse requires an exact source,
test, dependency, configuration, and instrumenter fingerprint.

Large tree removal is an atomic rename into `.supercov/.trash`; unlinking is
deferred, single-owner, and recoverable after a crash. No foreground command
waits for recursive deletion. `prune` removes explicit history and terminal
work while preserving the shared workspace cache. `clean` additionally removes
current and legacy cache layouts. Neither command silently removes live runs or
history beyond its requested retention.
