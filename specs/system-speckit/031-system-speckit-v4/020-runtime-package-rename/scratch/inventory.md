# Reference inventory and dependency audit

Taken before the move, on `skilled/v4.0.0.0` in the main checkout. `git grep` is the
authority rather than `rg`: a root `.gitignore` rule hides `package.json` and
`package-lock.json` from ripgrep even though git tracks them, so an `rg`-only sweep
silently missed the four manifests that carry the workspace wiring.

Excluded as historical evidence: `specs/**`, `changelog/**`, `benchmark/**`,
`z_archive/**`, `node_modules/**`, generated `dist/**`, and the separate
`.worktrees/022-012-runtime-enablement-build` checkout (gitignored, another branch).

## 1. Counts

| Group | Count | How it was taken |
|-------|------:|------------------|
| Tracked files naming `system-spec-kit/mcp-server` or `@spec-kit/mcp-server` | 230 | `git grep -l -E "system-spec-kit/mcp-server\|@spec-kit/mcp-server"` |
| — of those, inside the package itself | 46 | self-references |
| — of those, outside the package | 184 | see the area table |
| Tracked files under `system-spec-kit` naming `mcp-server` only relatively | 147 | `../mcp-server/…`, `'mcp-server'` segments, tsconfig paths, prose |
| Symlinks whose target enters the package | 83 | `find -type l -lname '*system-spec-kit/mcp-server*'` |
| Tracked symlink inside the package's sibling | 1 | `scripts/mcp-server -> ../mcp-server/dist` |

### Outside-the-package files by area

| Area | Files |
|------|------:|
| `.opencode/skills/system-spec-kit` (non-package) | 65 |
| `.opencode/skills/system-deep-loop` | 28 |
| `.opencode/skills/system-skill-advisor` | 22 |
| `.opencode/skills/cli-external-orchestration` | 15 |
| `.opencode/skills/sk-code` | 12 |
| `.opencode/hooks` | 8 |
| `.github` | 5 |
| `.opencode/plugins` | 5 |
| repo root (`AGENTS.md`, `README.md`, `.env.example`, `.gitignore`) | 4 |
| `.opencode/commands` | 4 |
| `.opencode/skills/sk-doc` | 3 |
| `.opencode/skills/.state` | 2 |
| `.pi` | 2 |
| `.opencode/bin` | 2 |
| `.claude`, `.codex`, `.cursor`, `.devin` | 1 each |
| `.opencode/install-guides` | 1 |
| other | 2 |

## 2. References a path/name grep does not reach

These carry the package's location without ever spelling it, and each one breaks
silently on the move.

| File | Line | Shape | Why the grep misses it |
|------|-----:|-------|------------------------|
| `.opencode/bin/hf-model-server.cjs` | 79 | `path.join(systemSpecKitRoot(), 'mcp-server', 'database')` | the segment is a separate string literal |
| `.opencode/skills/system-skill-advisor/mcp-server/advisor-server.ts` | 101 | `path.join(…, 'system-spec-kit', 'mcp-server', 'node_modules', 'chokidar', 'index.js')` | same, and it lives in the preserved advisor package |
| `.opencode/skills/system-spec-kit/scripts/mcp-server` | — | tracked symlink to `../mcp-server/dist` | a symlink's target is not file content |
| `.opencode/skills/system-spec-kit/scripts/evals/check-architecture-boundaries.ts` | 53, 153, 162, 404 | bare `'mcp-server'` directory-name literals | boundary rules keyed on the folder name |
| `.opencode/skills/system-spec-kit/package.json` | 8, 17, 20-23 | `workspaces` member, tsc project, workspace scripts | hidden from `rg` by a `.gitignore` rule |
| `.opencode/skills/system-spec-kit/scripts/package.json` | 14-15, 23 | `--config ../mcp-server/vitest.config.ts` | same |
| `.opencode/skills/system-spec-kit/tsconfig.json` | 19 | `{ "path": "./mcp-server" }` | relative project reference |
| `.opencode/skills/system-spec-kit/vitest.config.ts` | 15 | `path.resolve(__dirname, 'mcp-server', …)` | separate string literal |

`opencode.json` is **not** in scope: its only `mcp-server` mentions are the skill
advisor's database path. The dispatch expected a spec-kit registration there; there
is none.

## 3. The package is an npm workspace member, not a standalone package

`.opencode/skills/system-spec-kit/package.json` is a workspaces root over
`["shared", "mcp-server", "scripts"]`, and the single `package-lock.json` sits at
that root. The package has no lockfile of its own, so `npm ci` inside it cannot run;
the lockfile is regenerated from the workspace root instead. Hoisting follows from
this: `@huggingface/transformers` is installed at `system-spec-kit/node_modules`, not
in the package, and 15 non-hoistable packages live in the package's own tree.

## 4. Dependency audit by resolution

Every row was decided by tracing a consumer, not by reading the manifest. Import
traces cover all of `.opencode` outside `node_modules`; resolution traces were run
with `require.resolve` from the consumer's own root.

| Dependency | Live consumer | Decision |
|------------|---------------|----------|
| `@spec-kit/shared` | 8 source modules, 19 test modules import it | keep |
| `better-sqlite3` | `lib/extraction/entity-extractor.ts:10`, `lib/storage/transaction-manager.ts:6`, 3 test modules | keep |
| `zod` | `hooks/claude/hook-state.ts:16`, `lib/description/description-schema.ts:5`, `lib/graph/graph-metadata-parser.ts:9`, `lib/graph/graph-metadata-schema.ts:5` | keep |
| `chokidar` | no import; the skill advisor probes `…/system-spec-kit/mcp-server/node_modules/chokidar/index.js` as its second resolution candidate (`advisor-server.ts:101`) and that path exists today | keep — a resolution trace, so removal is not licensed |
| `@huggingface/transformers` | the HF model server resolves it through `createRequire(system-spec-kit/package.json)` (`hf-model-server.cjs:452`), which lands in `system-spec-kit/node_modules`; the workspace root declares it as a devDependency and `@spec-kit/shared` as a dependency, and the package's own `node_modules` has never held it | remove — this manifest is not what places it |
| `@modelcontextprotocol/sdk` | no import anywhere in the skill; `@spec-kit/shared` declares it independently | remove |
| `zod-to-json-schema` | no import anywhere | remove |
| `sqlite-vec` | no import; `@spec-kit/scripts` declares it independently | remove |
| `sqlite-vec-darwin-arm64` (optional) | follows `sqlite-vec`; `@spec-kit/scripts` declares it too | remove |
| `tree-sitter-wasms` | no import anywhere | remove |
| `web-tree-sitter` | no import anywhere | remove |
| `ignore` | no import anywhere | remove |

Eight of twelve entries go, and the two that a plain import grep would also have
removed — `chokidar` and `@huggingface/transformers` — are exactly the two the
resolution rule decides differently. Keeping `chokidar` is the conservative reading:
its consumer is a fallback the advisor never needs while its own copy is installed,
so the operator may still choose to drop it, but not on this packet's evidence.
