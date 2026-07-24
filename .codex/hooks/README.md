# .codex/hooks/ — discovery mirror, not the wiring source

Every file here is a symlink to the real hook script, which lives under `.opencode/`. This folder exists so the full Codex hook inventory is visible in one place; it has no functional role in what actually executes.

**`.codex/hooks.json`'s `command` fields point at the real `.opencode/` paths, and must keep doing so.** Two of the 16 mirrored scripts do **not** behave identically when invoked through a symlink:

| Script | Through symlink | Via real path |
|---|---|---|
| `session-start.js` | no output | full `hookSpecificOutput` envelope |
| `user-prompt-submit.js` | no output | full `hookSpecificOutput` envelope |

Both compile from a `.ts` source whose entrypoint guard compares `process.argv[1]` (stays the symlink path) against `import.meta.url` (which Node's ESM loader resolves through the symlink to the real path). The two never match through a symlink, so `main()` never runs and the hook silently emits nothing.

The other 14 — `check-dist-staleness.sh`, `check-git-hooks.sh`, `code-graph-freshness.cjs`, `compact-inject.js`, `completion-evidence-stop.cjs`, `dispatch-audit-posttooluse.mjs`, `dispatch-preflight-lint.mjs`, `mcp-route-guard.cjs`, `post-edit-quality.cjs`, `session-cleanup.sh`, `session-stop.js`, `spec-gate-classify.mjs`, `spec-gate-enforce.mjs`, `worktree-guard.sh` — produce byte-identical output through either path. Several correctly emit nothing on approve; that is their normal behavior, not a tripped guard (verified by comparing each against its own real-path invocation, not by assuming empty means broken).

To smoke-test one of the two affected scripts, invoke it via its real path.
