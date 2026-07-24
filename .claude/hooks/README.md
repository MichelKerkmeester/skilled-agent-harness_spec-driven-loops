# .claude/hooks/ — discovery mirror, not the wiring source

Every file here is a symlink to the real hook script, which lives under `.opencode/`. This folder exists so the full Claude hook inventory is visible in one place; it has no functional role in what actually executes.

**`.claude/settings.json`'s `command` fields point at the real `.opencode/` paths, and must keep doing so.** Two of the 18 mirrored scripts do **not** behave identically when invoked through a symlink:

| Script | Through symlink | Via real path |
|---|---|---|
| `session-prime.js` | no output | full `## Session Context` brief |
| `install-codex-hooks.mjs` | differs | differs |

`session-prime.js` compiles from a `.ts` source whose entrypoint guard compares `process.argv[1]` (stays the symlink path) against `import.meta.url` (which Node's ESM loader resolves through the symlink to the real path); they never match through a symlink, so `main()` never runs.

`install-codex-hooks.mjs` is a CLI utility rather than a stdin-driven hook — `settings.json` invokes it as `--check`, and it resolves its own repo root relative to its file location. Its differing output was not traced to a single root cause here; treat the real path as authoritative for it too.

The other 16 — `check-dist-staleness.sh`, `check-git-hooks.sh`, `claude-posttooluse.cjs`, `code-graph-freshness.cjs`, `compact-inject.js`, `completion-evidence-stop.cjs`, `dispatch-audit-posttooluse.mjs`, `dispatch-preflight-lint.mjs`, `mcp-route-guard.cjs`, `session-cleanup.sh`, `session-stop.js`, `spec-gate-classify.mjs`, `spec-gate-enforce.mjs`, `task-dispatch-guard.cjs`, `user-prompt-submit.js`, `worktree-guard.sh` — produce byte-identical output through either path. Several correctly emit nothing on approve; that is their normal behavior, not a tripped guard (verified by comparing each against its own real-path invocation, not by assuming empty means broken).

Note that `user-prompt-submit.js` works fine through the symlink even though its Codex sibling does not — it is a thin process-boundary shim that does not use the entrypoint guard. Do not generalize per file extension; the affected set was determined empirically.
