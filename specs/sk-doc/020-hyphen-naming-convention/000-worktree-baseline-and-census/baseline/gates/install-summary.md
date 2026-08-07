# Install gate

BASE: `1ec0ad2947b19ac3053c7b031b7d43e67bf42bbe`
HEAD: `e3fa05d2c9e0c7b730d6e5e9eedc0df3c0474f09` (phase-000 evidence only; no renames)

## Result: GREEN

The worktree is reproducibly installable and buildable, and the migration toolchain
runs. Full machine-readable detail in `baseline.json`; recipe in `reproducible-install.md`.

### Root cause fixed

`system-spec-kit/` is an npm **workspaces** monorepo. Three manifests were **untracked**
(present only in a working tree, absent from a clean checkout): the workspace-root
`package.json`, `shared/package.json`, and `scripts/package.json`. Without the root
manifest `npm ci` reported "could not read package.json" and `mcp_server`'s
`file:../shared` dependency could not resolve — the earlier install hung. Fix: track the
three manifests. The workspace lockfile `package-lock.json` was already committed, and the
fresh install reproduced it byte-for-byte (blob `1f4017e931`).

### Passed

- **Install** — `npm install` at `system-spec-kit` (workspace root): exit 0, 539 packages;
  root `package-lock.json` written; `@types/node@25.9.0` + `@modelcontextprotocol/sdk@1.29.0`
  hoisted.
- **Build** — `npm run build` (`tsc --build`): exit 0; `shared/dist` (67), `scripts/dist` (22),
  `mcp_server/dist` (33).
- **Reproducibility** — `rm -rf node_modules */dist && npm ci && npm run build`: `npm ci`
  exit 0 (539 pkgs, 4s), build exit 0.
- **realpath** — every `node_modules`/`dist` output resolves INSIDE the worktree
  (`realpath-proof.txt`); no symlink to the raced main tree.
- **Strict validation** — `validate.sh --strict` over all 177 nodes with `spec.md`: **Errors: 0**.
  34 nodes carry a single non-blocking PHASE_LINKS adjacency warning (pre-existing at BASE).
- **Typecheck** — `npm run typecheck`: exit 0, 0 TS errors.
- **Test discovery** — `*.test.ts`: 12, `*.vitest.ts`: 883, `scripts/tests/test-*.js`: 21
  (scope: `system-spec-kit/{scripts,mcp_server,shared}`, excluding node_modules + dist).
- **Lane C corpus** — sk-doc 32 scenarios, sk-code 30 scenarios (`lane-c-baseline.json`).
- **Census** — 3,882 candidates, 0 collisions (`../census/`).

### Notes

- `.node-version-marker` is written by the `postinstall` hook and is environment-specific;
  it is intentionally not tracked.
- Root (`.`) and `.opencode` installs were confirmed present with committed lockfiles in the
  earlier attempt; the migration toolchain lives entirely in the `system-spec-kit` workspace.
