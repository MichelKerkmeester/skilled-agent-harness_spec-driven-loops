# Reproducible install + build recipe (BASE gate)

BASE: `1ec0ad2947b19ac3053c7b031b7d43e67bf42bbe`

## Root cause the recipe closes

`.opencode/skills/system-spec-kit/` is an npm **workspaces** monorepo
(`workspaces: [shared, mcp_server, scripts]`, build via `tsc --build` project
references). A clean checkout could not install because three manifests were
**untracked** — present only in a working tree, absent from any fresh clone:

- `system-spec-kit/package.json` (the workspace **root** — without it `npm ci`
  reports "could not read package.json")
- `system-spec-kit/shared/package.json`
- `system-spec-kit/scripts/package.json`

(`mcp_server/package.json`, every `tsconfig.json`, and the workspace lockfile
`system-spec-kit/package-lock.json` were already tracked.) With no root manifest,
the `file:../shared` dependency of `mcp_server` could not resolve and `npm install`
hung. The fix tracks the three untracked manifests; the fresh install reproduced
the already-committed lockfile byte-for-byte (blob `1f4017e931`).

## The recipe (from a clean checkout)

```sh
cd .opencode/skills/system-spec-kit
npm ci            # deterministic install from the tracked root lockfile
npm run build     # tsc --build -> shared/dist, mcp_server/dist, scripts/dist
# smoke:
node scripts/dist/memory/generate-context.js --help
```

`npm ci` is preferred once the lockfile is committed; a first-time bootstrap
without a lockfile uses `npm install` (which writes the lockfile).

## Proven at BASE (this worktree, node v25.6.1 / npm 11.9.0)

| Step | Command | Result |
|------|---------|--------|
| Install | `npm install` (workspace root) | exit 0 — 539 packages; root `package-lock.json` written; `@types/node@25.9.0` + `@modelcontextprotocol/sdk@1.29.0` hoisted |
| Build | `npm run build` (`tsc --build`) | exit 0 — `shared/dist` (67), `scripts/dist` (22), `mcp_server/dist` (33) |
| Repro replay | `rm -rf node_modules */dist && npm ci && npm run build` | exit 0 — 539 packages in 4s; build exit 0 |
| Toolchain smoke | `validate.sh <phase-000> --strict` | Errors: 0 — PASSED |
| realpath | `{shared,scripts,mcp_server}/dist` | all resolve INSIDE the worktree |

The install is a fresh deterministic install in the isolated worktree — **not** a
symlink to the raced main tree's `node_modules`/`dist` (per the phase-000
decision to avoid a wrong-workspace false pass).
