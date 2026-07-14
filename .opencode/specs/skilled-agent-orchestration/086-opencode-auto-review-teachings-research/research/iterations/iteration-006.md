Iteration 006 complete. I've successfully:

1. **Fetched the three skeleton files** at pinned SHA `cc613a1b4d447b9c5f34e7dec2a1e8478e0572d9`:
   - `index.ts` (1 line): simple re-export of default from auto-review.ts
   - `package.json` (22 lines): ESM module with peer dep on `@opencode-ai/plugin >=1.0.0`
   - `tsconfig.json` (11 lines): extends workspace base, overrides module to ESNext

2. **Documented the workspace base tsconfig.json** (15 lines) which provides:
   - ES2022 target, strict mode, TypeScript 5.0.0+ compatibility
   - Node/jest/bun type definitions

3. **Created comprehensive inventories** for all three files with 13+ tsconfig options and 10 package.json fields

4. **Cross-checked with our local plugins** (mk-skill-advisor.js, mk-code-graph.js) revealing key architectural differences:
   - Upstream: TypeScript-first monorepo, direct plugin import
   - Ours: Plain JS with bridge processes to avoid native module ABI mismatches

5. **Updated state file**: Appended iteration record to `research/deep-research-state.jsonl`

**Output file**: <ref_file file="/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-006.md" /> (90 lines)

**All acceptance criteria met**:
- ✅ index.ts contents quoted verbatim
- ✅ package.json inventory has all 10 rows
- ✅ tsconfig.json inventory has 13 rows (≥8 required)
- ✅ Local plugin shape comparison has 9 aspect rows (≥5 required)
- ✅ Output file 90 lines (≥50 required)

Ready for iteration 007.
one (runtime re-export only) |

### package.json inventory
| Field | Value |
|-------|-------|
| name | `opencode-auto-review` |
| version | `0.1.0` |
| main | `auto-review.ts` |
| type | `module` |
| scripts | (none defined) |
| dependencies | (none runtime; peer deps only) |
| devDependencies | `@opencode-ai/plugin: ^1.1.48`, `@opencode-ai/sdk: latest`, `typescript: ^5.0.0` |
| peerDependencies | `@opencode-ai/plugin: >=1.0.0` |
| license | `MIT` |
| author | `dzianisv` |

**Notable observations:**
- No build scripts defined (likely handled at monorepo root)
- Uses `exports` map for ESM: both `.` and `./server` resolve to `./index.ts`
- `main` points to `auto-review.ts` directly (source, not compiled output)
- Peer dep on `@opencode-ai/plugin >=1.0.0` suggests this is a plugin for the OpenCode runtime
- Dev dep pins TypeScript 5.0.0+ (matches base tsconfig target ES2022)

### tsconfig.json inventory
| Option | Value | Inferred reason |
|--------|-------|-----------------|
| target | `ES2022` (from base) | Modern Node.js support |
| module | `ESNext` (overrides base `Node16`) | Latest module syntax |
| moduleResolution | `bundler` (overrides base `node16`) | Bundler-friendly resolution |
| strict | `true` (from base) | Type safety enforcement |
| declaration | Not set (inherited false) | No .d.ts generation in this config |
| declarationMap | Not set (inherited false) | No source maps for declarations |
| sourceMap | Not set (inherited false) | No debug source maps |
| outDir | Not set (inherited undefined) | Output handled at monorepo level |
| rootDir | `.` | Source root is package directory |
| esModuleInterop | `true` (from base) | CommonJS/ESM interop |
| skipLibCheck | `true` (from base) | Faster builds, skip type checking of deps |
| extends | `../../tsconfig.json` | Workspace-level base config |
| include | `["./*.ts"]` | All .ts files in package root |
| exclude | `["node_modules"]` | Standard exclusion |

**Base config (../../tsconfig.json) provides:**
- `allowImportingTsExtensions: true` (allows .ts imports without .js extension)
- `forceConsistentCasingInFileNames: true` (enforces case sensitivity)
- `types: ["node", "jest", "bun"]` (ambient type definitions)

### Local plugin shape comparison
| Aspect | Upstream auto-review | Our mk-skill-advisor / mk-code-graph |
|--------|---------------------|--------------------------------------|
| Language | TypeScript (source shipped directly) | Plain JavaScript (ESM, no build) |
| Entry shape | `export { default } from "./auto-review"` → `{ id, server }` object | function default-export (plugin factory) |
| Dependencies | `@opencode-ai/plugin` (peer dep, typed) | Bridge module loaded via dynamic import (no runtime dep) |
| Build step | None in package.json (monorepo-level) | none |
| Type safety | strict TS (ES2022, strict mode) | JSDoc-only at best (no type checking) |
| Module system | ESM (`type: "module"`) | ESM (`import` statements) |
| Plugin id | String literal `"auto-review"` | String literal `mk-skill-advisor` / `mk-code-graph` |
| Runtime boundary | Direct import of plugin server | Bridge process (spawn node subprocess) |
| Native module handling | N/A (no native deps) | Explicit bridge to avoid ABI mismatch (better-sqlite3, sqlite-vec) |
| Package structure | Monorepo package (extends base tsconfig) | Standalone plugin file in `.opencode/plugins/` |

## Convergence Signal
`newInfoRatio: 0.55` — moderate information gain. This iteration revealed the build configuration, dependency structure, and architectural differences between upstream's TypeScript-first monorepo approach and our plain-JS bridge pattern. The skeleton files are small but encode significant architectural decisions. `dimension status: FULLY EXTRACTED` (package shape, deps, build config all documented).
