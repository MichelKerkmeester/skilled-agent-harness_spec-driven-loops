# Goal Prompt: Continue cli-devin Revival

Continue the phased `cli-devin` revival from `.opencode/specs/cli-external-orchestration/029-cli-devin-revival/`.

Read `handover.md`, `spec.md`, and `011-hook-truth-and-runtime-readmes/implementation-summary.md` first. Phase 011 is complete: current hook documentation is reconciled to the corrected top-level `.devin/hooks.v1.json` schema, eleven runtime READMEs validate, the Cursor MCP route-guard discovery symlink resolves, and obsolete secret-bearing Zed MCP registrations have been removed. Six lifecycle events are observed live; `PermissionRequest`, `PostCompaction`, `run_subagent`, the deny branch, and true interactive mode retain explicit evidence limits.

Before new implementation, the operator must revoke and rotate the credentials removed from Zed in the affected provider dashboards. Local cleanup cannot prove remote revocation.

Completed phases: 001, 004, 008 and 011. Planned phases: 002, 003, 005, 006, 007, 009 and 010. Choose work from the dependency map in `spec.md`; numeric order is not dependency order.

Hard rules:

1. Ask whether to use a worktree or the current branch before starting a new implementation phase.
2. Read the selected child spec and preserve its frozen scope.
3. Treat `.devin/hooks.v1.json` and `hook-testing-results.md` tests 10-14 as current hook authority; preserve tests 1-9 as superseded history.
4. Never infer failure from a non-event unless both the triggering event and the instrument are proven.
5. Preserve unrelated dirty work and use explicit target paths for any staging request.
6. Refresh generated metadata only after authored docs settle.
7. Run the selected child strict gate and the recursive parent strict gate before claiming completion.
8. Do not commit or push unless the operator explicitly requests it.
