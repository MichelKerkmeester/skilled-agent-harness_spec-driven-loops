# .cursor/hooks/ — discovery mirror, not the wiring source

This folder exists purely so every Cursor hook script is visible in one place at the path Cursor's own docs name as conventional (`.cursor/hooks/<script>`). Every file here is a symlink to the real source, which still lives under `.opencode/skills/system-spec-kit/` (or `.opencode/bin/`, `.opencode/scripts/`, `.opencode/skills/sk-code/`) — see each link's target.

**`.cursor/hooks.json`'s `command` fields still point at the original real paths, not these symlinks — do not repoint them.** Two independent reasons:

1. **Silent entrypoint-guard break, confirmed by testing.** `session-start.js`, `session-end.js`, `user-prompt-submit.js`, and `precompact.js` each compile from a `.ts` source that ends with `runCursorHook(import.meta.url, main)` (`shared.ts`). That guard compares `process.argv[1]` (the path Node was invoked with) against `fileURLToPath(import.meta.url)` (which Node's ESM loader resolves through symlinks to the real file). Invoked via a symlink, `process.argv[1]` stays the symlink path while `import.meta.url` resolves to the real path — the two never match, `main()` never runs, and the hook produces **zero output** (not even the documented fail-open `{"permission":"allow"}`). Verified directly: all 4 files return nothing through `.cursor/hooks/`, and work normally via their real path.
2. **The plain `.mjs` files (`spec-gate-enforce.mjs`, `spec-gate-classify.mjs`, `post-tool-use.mjs`, `task-dispatch-guard.mjs`) don't have that guard and work fine through either path** — but keeping every entry pointed at one consistent, already-tested location (the real path) avoids a mixed, easy-to-get-wrong config.

If you need to manually smoke-test one of the 4 guarded hooks, invoke it via its real path, never via `.cursor/hooks/<name>`.
