---
title: "Implementation Plan: Phase 6: dual-root-code-and-contracts"
description: "Teach the 15 contract components that key on the literal .opencode name to resolve under .opencode, under .skilled and under an .opencode link. The plan extends the existing sentinel logic and proves each component with layout rows and a move rehearsal. DeepSeek drafts each one-file change for GPT-5.6 to review."
trigger_phrases:
  - "dual root implementation plan"
  - "source root layout matrix"
  - "skilled contract components plan"
  - "move rehearsal plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: dual-root-code-and-contracts

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM and CommonJS (`.mjs`, `.cjs`), TypeScript compiled to ignored `dist/` trees, Bash |
| **Framework** | None. Build-free scripts in `.opencode/bin` plus the `system-spec-kit` workspaces (`shared`, `runtime`, `runtime/cli`), `system-skill-advisor/runtime` and `system-deep-loop/runtime` |
| **Storage** | Filesystem only. Tests and the rehearsal write to temp directories, never to `~/.codex/hooks.json` |
| **Testing** | vitest (`system-spec-kit/vitest.config.ts` project `cli`, the advisor and deep-loop configs, `.opencode/vitest.config.bin.ts`), `node --test`, Bash test scripts and the legacy node runners |

### Overview
Every component keeps today's behavior and gains the second root name. Root discovery extends the existing sentinel module instead of adding one: `repo-root.mjs` exports the two names, tests its sentinel under each and hoists above either. Scripts that cannot import it resolve from their own directory. The legacy spec alias keeps its one spelling. A move rehearsal clones the rebuilt worktree into three layouts, plus `entry-links` when phase 004 selects it, because a unit fixture cannot prove a gate that reads the whole tree.

### Layouts

| ID | Layout | How it is built |
|----|--------|-----------------|
| `today` | Real `.opencode/` tree, `.skilled/` holds only the placeholder | Today's tree |
| `skilled-only` | Real `.skilled/` tree, no `.opencode` path | In a clone: `rm -rf .skilled && mv .opencode .skilled` |
| `whole-link` | Real `.skilled/` tree plus `.opencode -> .skilled` | `skilled-only`, then `ln -s .skilled .opencode` |
| `entry-links` | Real `.skilled/` tree, and `.opencode/` stays a real directory holding one relative link per moved entry | `skilled-only`, then `mkdir .opencode` and one `ln -s ../.skilled/<entry> .opencode/<entry>` per entry. Required only when phase 004 selects per-entry links (REQ-015) |

These are test layouts, not phase 004's layout options. In `../004-migration-design/decision-record.md` ADR-001 (Proposed at planning time), option L1 is `whole-link` and option L2 is `entry-links`.

Node reports the real path for `__dirname` and `import.meta.url` of a script launched through the `whole-link` link, and `existsSync` and `readdirSync` follow the link. Bash `cd` and `pwd` keep the logical path. All three were observed in a scratch probe on Node v26.8.2.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 005 prints `RESULT: PASSED` under `validate.sh --strict`, read by content
- [ ] Phase 004's recorded shape for `.opencode/` is copied into goal.md's log
- [ ] The REQ-014 decisions are recorded for the five root-discovery twins and for the work phase 004's plan assigns to this phase (`install-git-hooks.sh`, the `.gitignore` twins and the publish step)
- [ ] Baseline pass, fail and skip counts for every command in §5 are recorded at the phase's start commit

### Definition of Done
- [ ] All 15 rows in `acceptance-criteria.md` are Met with observed evidence
- [ ] Every command in §5 passes in `today`, and the rehearsal passes in `skilled-only` and `whole-link`
- [ ] `dist/` trees are rebuilt and the freshness checker reports `"stale":false` for each rebuilt package
- [ ] `check-comment-hygiene.sh` passes on every changed code file
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extend the existing root contract in place. One ordered list of source-root names (`.skilled`, `.opencode`) lives in `repo-root.mjs`. Resolvers test a sentinel under each name and hoist above either. Scripts locate their own tree from `__dirname`. Detectors, which must catch every spelling that exists on disk, list every spelling. Resolvers that feed writers do not widen the legacy spec alias (goal D2).

### Why these helpers and no others
- **`SOURCE_ROOT_NAMES`, exported from `repo-root.mjs`.** Four callers need it today: `repo-root.mjs` itself (sentinel and hoist), `runtime/cli/utils/workspace-identity.ts` (anchors), `runtime/cli/utils/path-utils.ts` (default bases) and `runtime/cli/loaders/data-loader.ts` (data-file bases). The runtime CLI already imports this module from TypeScript (`runtime/cli/continuity/backfill-frontmatter.ts:20`). It is one constant, not a new module.
- **No shared helper for the advisor.** It keeps its local walk because `runtime/schemas/advisor-tool-schemas.ts:44-46` already documents a lockstep twin, and a new runtime import in the advisor's `dist/` would widen the change.
- **No shared helper for bin scripts.** `.opencode/package.json` declares no `@spec-kit` dependency, so each script resolves from its own directory.

### Key Components

Each block gives current behavior with `file:line`, the planned change and its test. "Observed" means a fixture probe on commit `728c4f3efc` during planning, and "read" means code reading only. Paths under `runtime/` belong to the skill named in the heading.

#### C1. Repository root discovery (`system-spec-kit/shared/workspace/repo-root.mjs`, `repo-root.d.mts`)
- **Current (read):** the sentinel is `.opencode/skills/system-spec-kit/SKILL.md` (`:27`). `hoistAboveOpencodeTree` matches only a `.opencode` segment (`:38-46`). `findRepoRoot` tests one sentinel per directory, then hoists, then returns `resolve(start)` (`:59-70`). The hooks copy re-exports it (`runtime/hooks/lib/workspace/repo-root.mjs:7`).
- **Current (observed):** `today` returns the root. `skilled-only` returns the start directory for a full walk and for a capped walk. In `whole-link` a full walk reaches the root through the link, but a `maxDepth: 2` walk returns its start.
- **Change:** export `SOURCE_ROOT_NAMES = Object.freeze(['.skilled', '.opencode'])`. When a sentinel, default or caller-supplied, begins with one of the names, test it under each name at every level. Hoist above the outermost segment equal to either name. Keep `REPO_ROOT_SENTINEL`, `hoistAboveOpencodeTree` and `findRepoRoot` with their names and signatures, and declare the export in `repo-root.d.mts:7-9`.
- **Test:** `runtime/cli/tests/package-root-parity.vitest.ts:27-80` gains a layout axis (3 layouts x 3 trees, `SKILL_REL` built per layout) and hoist rows: a nested leak `.skilled/skills/x/.opencode/skills`, look-alike segments `skilled` and `055-skilled-source-root-migration`, a capped walk per layout, an explicit `.opencode` sentinel under `skilled-only` and a dangling `.opencode -> .skilled` link. `runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` runs as the consumer regression, since `spec-gate-core.mjs:48` imports `findRepoRoot`.
- **Consumers:** 37 tracked files outside `specs/` name these exports or the module path, the module and its READMEs included. None needs an edit.

#### C2. Spec-root family (`system-spec-kit/runtime/cli/core/`)
- **Current (read):** the legacy alias is `<workspace>/.opencode/specs` in `spec-root-canonical-resolver.ts:66`, `spec-root-write-guard.ts:25`, `spec-root-migration-manifest.ts:106` and `spec-root-migration.ts:221,275,312`. `isQualifiedSpecPath` accepts `specs/` and `.opencode/specs/` prefixes (`spec-root-canonical-resolver.ts:12-18`). An absent alias returns null or false (`spec-root-migration-manifest.ts:65-75`, `spec-root-migration.ts:65-82`). A same-inode alias classifies `same-inode-alias` (`spec-root-collision-classifier.ts:161-163`).
- **Expected (inferred from reading, confirmed or refuted by T026):** `today` and `whole-link` reach `specs/` through the alias, which is R3 behavior. `skilled-only` has no `.opencode/specs`, which is R1 behavior. A relative `.skilled/specs/<id>` argument is not a qualified path.
- **Change:** none planned (goal D2). A failing row goes to the orchestrator as a design question, never to a drafter.
- **Test:** `materializeRootFixture` in `spec-root-fixtures.ts:136-239` takes an optional layout. `today` keeps a real `.opencode` parent. `skilled-only` creates `.skilled/specs -> ../specs` with no `.opencode`, and `whole-link` adds `.opencode -> .skilled`. `tests/spec-root-validation-matrix.vitest.ts` runs R1, R3 and R7 per layout. `today` and `whole-link` must match the current rows, and `skilled-only` must classify canonical-only and never list `.skilled/specs` as a root.

#### C3. Folder detection (`system-spec-kit/runtime/cli/spec-folder/folder-detector.ts`)
- **Current (read):** the approved roots are `specs` and `.opencode/specs` (`:139-145`), checked through `validateFilePath`, which realpaths the candidate and each base (`shared/utils/path-security.ts:44-102`). Explicit `specs/` and `.opencode/specs/` arguments join the project root, and any other relative argument joins the active specs directory (`:1014-1029`, `:1137-1156`).
- **Change:** none planned (D2).
- **Test:** `tests/test-folder-detector-functional.js`, beside the `isUnderApprovedSpecsRoots` case at `:542`, gains per-layout rows: an absolute packet path through `specs/` (all layouts), through `.opencode/specs` (`today`, `whole-link`) and through `.skilled/specs` (`skilled-only`, `whole-link`, accepted because it realpaths into `specs/`). A relative `.skilled/specs/<id>` argument stays unsupported, and its row records the error. The runner loads `dist/` (`:24`), so it runs after the rebuild.

#### C4. Config (`system-spec-kit/runtime/cli/core/config.ts`)
- **Current (read):** `PROJECT_ROOT` sits five levels above the scripts root found by a `package.json` walk (`:77-91`, `:299`), so it never names the source root. `getSpecsDirectories` lists `specs` and `.opencode/specs` (`:321-326`), and `getAllExistingSpecsDirs` dedupes by realpath (`:338-361`).
- **Change:** none planned (D2).
- **Test:** `tests/spec-root-config-precedence.vitest.ts`, which sets `CONFIG.PROJECT_ROOT` at `:22-31`, gains per-layout rows. With the alias as a link, `today` and `whole-link` dedupe it to canonical, and `skilled-only` lists canonical only.

#### C5. Path sanitization (`system-spec-kit/runtime/cli/utils/path-utils.ts`, twin `runtime/cli/loaders/data-loader.ts`)
- **Current (read):** the default bases are the working directory, `specs` and `.opencode` (`path-utils.ts:55-59`), each realpathed (`:61-81`). `data-loader.ts:85-93` repeats the list for data files. A consumer whose `.opencode` links outside its working directory admits paths in the linked tree only through that base. `directory-setup.ts:25` passes its bases explicitly and is not affected.
- **Change:** add `<cwd>/.skilled` to both lists through `SOURCE_ROOT_NAMES`.
- **Test:** `tests/test-scripts-modules.js:201-226` gains consumer-fixture rows. A path inside `<cwd>/.skilled` linked to an external tree is accepted, as is one inside `<cwd>/.opencode` linked the same way. `/etc/passwd` and a path escaping through `..` are rejected. `tests/test-extractors-loaders.js:1338-1349` gains a data-file row under a linked `.skilled`.

#### C6. Workspace identity (`system-spec-kit/runtime/cli/utils/workspace-identity.ts`)
- **Current (read):** a directory named `.opencode`, or one holding a `.opencode` child, is the anchor (`:63-88`, `:90-115`). The anchor's parent becomes the root only for `.opencode` (`:144-149`). Candidates match by anchor path (`:185-186`).
- **Current (observed, built module):** `today` gives the root. `skilled-only` gives the root from the repository root but the start directory from a nested start. `whole-link` gives `<repo>/.skilled` from both.
- **Change:** either name anchors, and the root is the anchor's parent for either name. `isSameWorkspacePath` compares roots. The exported field `canonicalOpencodePath` keeps its name.
- **Test:** `tests/workspace-identity.vitest.ts:29-80` gains a `skilled-only` nested start, a `whole-link` root and nested start, a root holding a real `.opencode/` plus the `.skilled/` placeholder (today's tree) and two unrelated repositories with different anchor names that must not match.
- **Consumers:** `runtime/cli/utils/tool-sanitizer.ts:61,77` through `toWorkspaceRelativePath`, re-exported by `runtime/cli/utils/index.ts:14-17`.

#### C7. Advisor workspace root (`system-skill-advisor/runtime/lib/utils/workspace-root.ts`, twin `runtime/schemas/advisor-tool-schemas.ts`)
- **Current (read):** the sentinel is at `:26`, the hoist at `:46-56` and the walk at `:78-95`. The schema file repeats the walk and hoist at `:23-59`.
- **Current (observed, built module `dist/runtime/lib/utils/workspace-root.js`):** identical to C1, and an explicit `.opencode` sentinel under `skilled-only` also returns the start.
- **Change:** C1's semantics in both files, kept local. Five callers pass the explicit sentinel and gain both names without edits: `handlers/advisor-validate.ts:218-219`, `bench/scorer-bench.ts:26-27`, `bench/scorer-calibration.bench.ts:77-78`, `scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:52-53` and `scripts/routing-accuracy/derive-ambiguity-slice.mjs:59-60`.
- **Test:** `tests/utils/workspace-root.vitest.ts:42-90` gains `.skilled` nested starts, look-alike segments, a capped walk and an explicit sentinel per layout. `tests/schemas/advisor-tool-schemas.vitest.ts` gains a lockstep row that feeds `detectRepoRoot` and `findAdvisorWorkspaceRoot` the same trees. `isAllowedWorkspaceRoot` admits every temp path, so it cannot tell the two resolvers apart. The row therefore needs `detectRepoRoot` exported as a test seam, which the orchestrator approves or replaces in T005.
- **Rebuild:** `npm run build` in `system-skill-advisor/runtime`.

#### C8. MCP code-mode launcher (`.opencode/bin/mcp-code-mode-launcher.cjs`)
- **Current (read):** `REPOSITORY_ROOT` sits two levels above `__dirname` (`:19`), and the server directory joins `.opencode/skills/mcp-code-mode/mcp-server` to it (`:20-28`).
- **Current (observed):** `SERVER_MANIFEST_PATH` is `<root>/.opencode/...` in all three layouts. Under `skilled-only` that path is missing, the resolver returns `unreadable-manifest` (`lib/node-engine-resolver.cjs:376-380`) and the launcher words it as an interpreter-range failure (`:44-48`).
- **Change:** set the server directory to `path.resolve(__dirname, '..', 'skills', 'mcp-code-mode', 'mcp-server')`. `REPOSITORY_ROOT` stays exported (`:169-175`).
- **Test:** `.opencode/bin/mcp-code-mode-launcher.test.cjs` gains a case that copies the launcher and `lib/node-engine-resolver.cjs` into each layout fixture with a stub manifest whose `engines.node` the running Node satisfies. It asserts the manifest and entry paths sit under the real source root when loaded through `.opencode/bin` (`today`, `whole-link`) and `.skilled/bin` (`skilled-only`, `whole-link`). The live launch cases keep skipping where the vendored server is absent (`:77-83`), which includes worktree 055.

#### C9. MCP registrations (`.claude/mcp.json:3-11`, `.codex/config.toml:11-16`, `.cursor/mcp.json:3-11`, `.devin/mcp_config.json:3-11`, `.pi/mcp.json:3-11`)
- **Current (read):** each runs `node .opencode/bin/mcp-code-mode-launcher.cjs` from the project directory with `UTCP_CONFIG_FILE=.utcp_config.json`. `.mcp.json` is a link to `.claude/mcp.json`.
- **Change:** none (goal D3).
- **Test:** the rehearsal reads command, arguments and environment from each file (JSON directly, TOML through `.opencode/node_modules/toml`, present at `728c4f3efc` as a transitive package). It runs each one from the clone root with a stub server and closed stdin and records the exit. Expected: `today` and `whole-link` answer an initialize request, and `skilled-only` fails with `Cannot find module`, which is recorded against phase 004's shape.

#### C10. Codex hook installer (`.opencode/bin/install-codex-hooks.mjs`)
- **Current (read):** hook identity is the adapter path (`:65-70`). Ownership is the set of source identities (`:85-100`, `:155`), and an identity under `.opencode/` that is missing on disk is an orphan (`:102-109`). The repository anchor sits two levels above the module (`:367-368`), so it never names the source root.
- **Current (observed, `--dry-run` into a temp target):** in `whole-link` the installed `.opencode/hooks/x.js` entry lands in `kept` while `.skilled/hooks/x.js` is added. In `skilled-only` the old entry lands in `orphaned` and is removed.
- **Change:** an ownership key maps a leading `.opencode/` or `.skilled/` to one namespace. It applies to source identities, the owned check, the orphan test and owned occurrences (`:203-217`). Labels, command text and the `--check` report stay as they are, so an installed entry with the other spelling reports `command` drift until the next install.
- **Test:** new `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs` (`node --test`) with rows for layouts `today`, `skilled-only` and `whole-link` x installed spelling x source spelling. It asserts one owned entry per hook after an install into a temp target and `--check` exit 0 after that install. A third-party hook outside both namespaces must survive. Fixtures run `git init`, because `assertSafeRepoAnchor` (`:290-322`) requires a primary checkout.

#### C11. Worktree session launcher (`.opencode/bin/worktree-session.sh`)
- **Current (read):** the default shared paths are six `.opencode/skills/system-spec-kit/...` paths (`:80-89`). The database directory is `$WT_ABS/.opencode/skills/system-spec-kit/runtime/database` (`:225`). A path absent in main is skipped with a log line (`:358-363`).
- **Current (observed, `--dry-run` fixtures):** `skilled-only` lists every shared path as `absent in main, skip` and plans `SPEC_KIT_DB_DIR` under `<worktree>/.opencode/...`. `today` and `whole-link` link the paths present in main.
- **Change:** find the main checkout's source root by testing `<main>/.skilled/skills/system-spec-kit/SKILL.md` and then `<main>/.opencode/skills/system-spec-kit/SKILL.md`. Build the default shared paths and the dry-run `WT_DB_DIR` from it. After `git worktree add` (`:271`), find the new worktree's source root the same way and set `WT_DB_DIR` from that. When the two roots differ, log a warning and skip linking. `SPECKIT_WORKTREE_SHARED_PATHS` still overrides.
- **Test:** `.opencode/bin/tests/worktree-session.test.sh` gains one fixture per layout through its `make_fixture` (`:50-58`), asserting that the dry-run plan lists `+ <root>/skills/system-spec-kit/node_modules` and puts `SPEC_KIT_DB_DIR` under the real source root. A live `skilled-only` run asserts `test ! -e <worktree>/.opencode`. A fixture whose main checkout holds an uncommitted rename asserts the mismatch warning.

#### C12. Local specs relinker (`.opencode/bin/relink-local-specs.sh`)
- **Current (read):** `REPO_ROOT` sits two directories above the script's logical directory (`:16-17`), and the Code_Environment and Development roots sit above that (`:18-19`). The only `.opencode` text is the comment on `:17`.
- **Current (observed):** run from `.opencode/bin` (`today`, `whole-link`) and `.skilled/bin` (`skilled-only`, `whole-link`), it reports every target under the fixture's parent directory.
- **Change:** none. The comment text is phase 009's.
- **Test:** new `.opencode/bin/tests/relink-local-specs.test.sh` runs the script per layout with the three sibling targets present and asserts the links land under `<root>/specs/`.

#### C13. No-spec-import guard (`.opencode/bin/check-no-spec-imports.cjs`)
- **Current (read):** `REPO_ROOT` comes from `__dirname` (`:25`). The lexical spec roots are `specs` and `.opencode/specs` (`:30-33`). The default scan root is `<root>/.opencode/bin` (`:36`). The literal checks name `.opencode/specs` (`:95`, `:122`). A scan that read zero files prints ok and exits 0 (`:147`).
- **Current (observed):** `today` and `whole-link` flag a seeded `require('../specs/x/y.cjs')`. In `skilled-only`, run from `.skilled/bin`, the guard prints `ok: no spec-tree imports in 0 runtime file(s) across 1 dir(s)` and exits 0.
- **Change:** the default scan root is `__dirname`. `<root>/.skilled/specs` joins the spec roots, and `.skilled/specs` joins both literal checks. Any scan that read zero files exits 2 with a message. The code must differ from the violation exit 1: the CI step at `.github/workflows/runtime-no-spec-import.yml:37-40` treats any non-zero exit on the positive fixture as the expected failure, so a zero-file exit 1 would hide a moved fixture there. Phase 005 owns that step's exact-code check. The CI fixture directories hold one file each, so today's CI calls keep passing.
- **Test:** `.opencode/bin/compiled-routing-foundation.vitest.ts:278-288` gains `targetResolvesUnderSpecs` rows for `require('../specs')` from `<root>/.skilled/bin` and for each of the three spellings. A spawn row per layout runs a copied guard beside a seeded import and expects exit 1, and a zero-file row expects exit 2.

#### C14. Contract drift checker (`system-deep-loop/runtime/scripts/check-contract-drift.cjs`, paired functions in `compile-command-contracts.cjs`)
- **Current (read):** the path pattern takes candidates that start with `.opencode/` or `specs/` (`:68`), and the declared-mode pattern takes `.opencode/` or relative paths (`:69`). Only `.opencode/` paths can be authority sources (`:142-159`, `:165`, `:194`, `:236`). Sources resolve against `WORKSPACE_ROOT`, five levels above the scripts (`compile-command-contracts.cjs:8`, `:366-376`). Compiled contracts live under `.opencode/commands/deep/assets/compiled` (`compile-command-contracts.cjs:662-665`). The gap check flags derived sources missing from the recorded set, never the reverse (`:483-494`).
- **Current (observed):** with the `commands/deep/` documents rewritten in memory to `.skilled/`, `deriveAuthoritySources('deep/review')` returns 14 sources instead of 16 and raises no failure. The checker reports zero failures on today's tree.
- **Current (read, `skilled-only`):** every recorded `.opencode/...` digest path is missing, so the checker fails loudly with `STALE_SOURCE_DIGEST` (`:419-441`), and `readContract` cannot open the compiled contract (`:87-92`).
- **Change:** both patterns and the prefix predicates accept `.opencode/` or `.skilled/`. Recorded and derived sources compare by a root-normalized key. `absolutePath` in both files resolves a source under the other name when its own spelling is absent, and `outputPathFor` does the same for the compiled directory. Digests stay byte digests, so a pure rename changes none of them.
- **Test:** `runtime/tests/unit/check-contract-drift.vitest.ts`, which injects contract text through `checkCommand` options (`:41-48`), gains a header whose digest paths use `.skilled/`. On the `today` tree that row must raise neither `STALE_SOURCE_DIGEST` nor `ENUMERATED_SOURCE_GAP`. The planning probe becomes a regression row: the derived set stays unchanged when the command documents name `.skilled/`. The rehearsal runs the checker in `skilled-only` and `whole-link` clones and expects `[CONTRACT DRIFT] OK`.

#### C15. `opencode.json`
- **Current (read):** `:10-20` registers the launcher as `.opencode/bin/mcp-code-mode-launcher.cjs`. The opencode runtime reads its project namespace from the `.opencode/` directory by convention, not from a setting in this file (phase 001 research §4).
- **Change:** none (D3).
- **Test:** covered by the C9 launch probe. The namespace question belongs to phases 003 and 004.

### Data Flow
Each component reads its own location or a start directory, derives the source root and joins paths under it. The change makes that middle step name-agnostic in one of three ways: a sentinel tested under both names (C1, C6, C7, C11), resolution from the script's own directory (C8, C12, C13) or a root-normalized key for strings that name paths (C10, C14). C2 to C4 already resolve through depth or realpath and only gain proof. C9 and C15 are configuration strings proven by a launch probe.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repo-root.mjs` exports | Root for writers, mirror generators and the spec gate | update | C1 parity rows, `spec-gate-core.test.mjs` |
| Advisor walk and schema twin | Root for advisor handlers, daemon and benches | update | C7 rows and lockstep row |
| Five explicit-sentinel advisor callers | Pass `.opencode/skills/system-spec-kit/SKILL.md` | unchanged, both names through the sentinel rule | C7 explicit-sentinel row |
| `workspace-identity.ts` and `tool-sanitizer.ts:61,77` | Session capture matching | update producer, consumer unchanged | C6 rows, cli suite |
| `path-utils.ts`, `data-loader.ts` | Path allowlists | update | C5 legacy-runner rows |
| Spec-root family, `config.ts`, `folder-detector.ts` | Spec root resolution | unchanged | C2 to C4 layout rows |
| Launcher and six registrations | MCP code mode start | update launcher, verify registrations | C8 test, C9 rehearsal probe |
| `install-codex-hooks.mjs` and its six links (`.claude/hooks`, `.cursor/hooks`, `.devin/hooks`, `.opencode/hooks/hook-install/{claude,cursor,devin}`) | Codex hook ownership | update the one real file | C10 node test |
| `worktree-session.sh` | Worktree shared links and database directory | update | C11 shell test |
| `relink-local-specs.sh` | Machine-local spec links | unchanged | C12 shell test |
| `check-no-spec-imports.cjs` | Runtime import guard, run by `.github/workflows/runtime-no-spec-import.yml:35-42` | update the script, the workflow is phase 005's | C13 rows |
| `check-contract-drift.cjs`, `compile-command-contracts.cjs` | Compiled contract drift gate | update | C14 rows and rehearsal |

Required inventories:
- **Same-class producers.** `git grep -n -I -E "(===|==|!==) ?['\"]\.opencode['\"]" -- '*.ts' '*.js' '*.cjs' '*.mjs' '*.py' ':!specs' ':!**/dist/**' ':!**/node_modules/**'` returned 20 lines in 13 non-test files at `728c4f3efc`, and a search for the `system-spec-kit/SKILL.md` sentinel returned 11 lines in 9 non-test files. Dispositions: in scope here are `repo-root.mjs`, the advisor walk and schema twin, `workspace-identity.ts` and `spec-root-canonical-resolver.ts` (D2, unchanged). The five explicit-sentinel callers are covered by the sentinel rule. `post-edit-router.cjs:196,215,235` is phase 005's hook routing. The alias spellings in `check_no_new_snake_case.py:188`, `audit_readmes.py:272,577` and `spec-doc-paths.ts:311` keep `.opencode/specs` under D2. `sweep-memory-residue.mjs:305-307` classifies paths by a `.opencode/skills` prefix. All four go to phase 009. REQ-014 decides five walks that key on `.opencode` directly: `shared/gate-3-classifier.ts:349-372`, `system-skill-advisor/runtime/skill-advisor-cli.ts:189-215`, `runtime/lib/graph/graph-metadata-parser.ts:874-897`, `sk-create-skill/scripts/validate_skill_package.py:24-29` and `scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs:30`.
- **Consumers of changed symbols.** `REPO_ROOT_SENTINEL|hoistAboveOpencodeTree|findRepoRoot|workspace/repo-root` (37 files), `findAdvisorWorkspaceRoot|detectRepoRoot` (C7 list), `buildWorkspaceIdentity|isSameWorkspacePath|toWorkspaceRelativePath` (`utils/index.ts`, `utils/tool-sanitizer.ts`, their test) and `sanitizePath(` (`data-loader.ts:97`, `directory-setup.ts:25`, `test-scripts-modules.js`).
- **Matrix axes.** Layout (`today`, `skilled-only`, `whole-link`) x entry spelling (through `.opencode/`, through `.skilled/`, wherever it resolves) x walk depth (within the cap, capped fallback) for resolvers, plus each component's adversarial rows. Row counts per test file are recorded before completion (CHK-FIX-005).
- **Algorithm invariant.** For a tree whose root holds the sentinel under either name, every resolver returns that root from every start inside the tree. When no sentinel is reachable, the fallback never returns a path containing a `.opencode` or `.skilled` segment. The adversarial cases are a nested leak, a look-alike segment, a dangling link, an ancestor `.skilled` and both names present at once.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Component order: C1 first, because C5 and C6 import its export. Then C6, C5, C2 to C4, C7, C8, C10, C11, C12, C13 and C14. The C9 and C15 probe comes last. Each unit is verified by its own tests before the next one starts (parent D3).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:delegation -->
## DELEGATION

| Role | Executor | Invocation | Owns |
|------|----------|------------|------|
| Planner and verifier | Orchestrator (Claude Opus) | Direct | The baseline, every brief and design choice, the rehearsal script, test runs, commits and evidence |
| Drafter | DeepSeek V4.1 Flash, thinking `max`, on cli-pi through the LLM Gateway | Print mode with the provider-qualified `llmgateway/deepseek-v4.1-flash` and `--thinking max`, `AI_SESSION_CHILD=1` plus the child-dispatch preamble | One file per brief, source or test |
| Reviewer | GPT-5.6 on cli-codex | `codex exec --model gpt-5.6-sol` with a read-only sandbox and stdin closed. Sol is the variant phase 004's goal D4 names for contract-file review, and the orchestrator sets the effort at dispatch | One review per component of its drafts against the brief |

The cli-pi and cli-codex `SKILL.md` files own the flags, and the orchestrator reads them before composing the first dispatch of each kind.

**Brief contract.** Each brief stays short and literal:
- the one file to change and the lines it touches
- the behavior to add, as input and expected-output pairs
- for a test brief, the rows to add, with layout and expected result
- the rules: kebab-case names for new files, no spec paths, packet numbers or task ids in code comments, no edits outside the named file
- the command the orchestrator runs to verify

**Review contract.** GPT-5.6 reads the brief, the diff and the whole file, then returns PASS or findings with `file:line`. A finding returns to DeepSeek as a narrower brief. A unit still red after three repairs stops the phase (parent D2).

**Stays with the orchestrator.** The layout rows, the response to any failing spec-root row (D2), the REQ-014 decision and whether `detectRepoRoot` becomes a test seam. So do the wording of the zero-file failure and the C11 mismatch warning, and any review finding that reopens a design question.

**Per-unit verification.** Run the file's command from §5, `check-comment-hygiene.sh <file>` on each changed code file and `node --check` or `bash -n` on each script. Rebuild `dist/` after a TypeScript unit, then commit the unit on its own.
<!-- /ANCHOR:delegation -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | C1 to C4 and C6 | `cd .opencode/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/package-root-parity.vitest.ts tests/workspace-identity.vitest.ts tests/spec-root-validation-matrix.vitest.ts tests/spec-root-config-precedence.vitest.ts`, then the full `tests/spec-root-*.vitest.ts` set |
| Unit | C3 and C5 legacy runners | `npm run test:legacy` in `runtime/cli` (builds, then runs `test-scripts-modules.js` and `test-extractors-loaders.js`) and `node tests/test-folder-detector-functional.js` |
| Unit | C7 | `cd .opencode/skills/system-skill-advisor/runtime && npx vitest run tests/utils/workspace-root.vitest.ts tests/schemas/advisor-tool-schemas.vitest.ts` |
| Unit | C8 and C10 | `node --test .opencode/bin/mcp-code-mode-launcher.test.cjs .opencode/bin/tests/install-codex-hooks-source-root.test.cjs` |
| Unit | C13 | `cd .opencode && npx vitest run --config vitest.config.bin.ts bin/compiled-routing-foundation.vitest.ts` |
| Unit | C14 | `cd .opencode/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/check-contract-drift.vitest.ts` |
| Integration | C11 and C12 | `bash .opencode/bin/tests/worktree-session.test.sh` and `bash .opencode/bin/tests/relink-local-specs.test.sh` |
| Integration | C1 consumers | `node --test .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` |
| Rehearsal | C9, C13, C14 and C15 on the whole tree in `today`, `skilled-only` and `whole-link` | `bash scratch/layout-rehearsal.sh` |
| Build | TypeScript units | `npm run build` in `.opencode/skills/system-spec-kit` and in `.opencode/skills/system-skill-advisor/runtime`, then `node .opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check --package <id> --json` for `system-spec-kit/shared`, `system-spec-kit/runtime/cli` and `system-skill-advisor/runtime`, each reading `"stale":false`. The hook wrapper `sk-code/sk-code-quality/scripts/check-dist-staleness.sh --all` is not evidence: it always exits 0 and rebuilds a stale package on its own (`:153-182`) |
| Hygiene | Every changed code file | `.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh <file>` |

**Rehearsal steps.**
1. Build `dist/` and pass the `today` commands above in worktree 055.
2. For each layout, clone the worktree with `cp -Rc` (APFS clone, falling back to `cp -R`) into a temp directory outside the worktree, then delete the clone's `.git` pointer file before running anything in it.
3. Arrange `skilled-only` (`rm -rf .skilled && mv .opencode .skilled`) or `whole-link` (`skilled-only`, then `ln -s .skilled .opencode`). `today` stays as cloned. When phase 004 selects per-entry links, also arrange `entry-links` as the §1 table describes.
4. From the clone root, run the drift checker, the guard's default scan beside a seeded import, the C9 registration probes and a root-discovery probe from a start under the real tree.
5. In the `skilled-only` clone, assert `test ! -e .opencode` after step 4.
6. Record per-component results in `scratch/rehearsal-results.md`, then delete the clones.

Every result is read by content. An exit code alone never counts as a pass.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 005 gate-and-ci-readiness | Internal | Yellow (Draft) | Blocks the start of this phase (parent D1) |
| Phase 004's shape for `.opencode/` | Internal | Yellow (Draft) | Sets the `skilled-only` expectation for C9 and C15 |
| cli-pi with `llmgateway/deepseek-v4.1-flash` | External | Green (listed in `.pi/models.json`) | Blocks drafting. The orchestrator records a deviation before any substitute |
| cli-codex with GPT-5.6 | External | UNKNOWN (not probed during planning) | Blocks review. T001 runs the cli-codex readiness check |
| `.opencode/node_modules/toml` | External | Green (present, transitive) | The C9 probe reads the TOML `command` and `args` lines directly |
| APFS clone support for `cp -c` | External | UNKNOWN until T004 | The rehearsal falls back to `cp -R`, which is slower |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a unit's tests stay red after three repairs or a review finding voids its brief's design. The rehearsal showing a `today` regression is a trigger too.
- **Procedure**: each component lands in its own commit, so `git revert <unit-sha>` restores the files and tests of that unit. No data moves in this phase. Rebuild `dist/` after reverting a TypeScript unit. Rehearsal clones are temp directories and are deleted.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (T001-T005) ──► C1 root ──┬──► C6 identity ──► C5 paths ──► C2-C4 spec roots
                                └──► C7 advisor
C2-C4 ──► C8 launcher ──► C10 hooks ──► C11 worktree ──► C12 relink
      ──► C13 guard ──► C14 drift ──► C9/C15 probe ──► Verify (T058-T064)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 005 PASSED, phase 004 shape recorded | C1 |
| C1 root discovery | Setup | C5, C6, C7 |
| C5, C6 | C1 | C2 to C4 |
| C2 to C4, C7 to C14 | Their predecessor unit verified | The next unit |
| C9 and C15 probe | C8 verified, rehearsal script | Verify |
| Verify | Every unit verified | Phase 007 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup: baseline, decisions, rehearsal script, briefs | Med | 3-4 hours |
| Core Implementation: 15 components through draft, review and verify | High | 8-12 hours |
| Verification: rebuild, full rerun, rehearsal, evidence | Med | 2-3 hours |
| **Total** | | **13-19 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline counts recorded at the phase's start commit
- [ ] One commit per component, with no unit mixed into another's commit
- [ ] No test or rehearsal writes `~/.codex/hooks.json`: every installer run passes `--target` inside a temp directory

### Rollback Procedure
1. Stop delegation for the failing unit.
2. `git revert <unit-sha>`, or `git restore` the unit's files if it is not committed yet.
3. Rebuild `dist/` for a TypeScript unit, then rerun that unit's command and the baseline set.
4. Record the revert and the failing row in goal.md's log.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. Tests write only to temp directories, and the rehearsal deletes its clones.
<!-- /ANCHOR:enhanced-rollback -->

---
