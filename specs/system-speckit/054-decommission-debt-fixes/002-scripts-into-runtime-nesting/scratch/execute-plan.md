# Stage-2 execution plan (do not run until told the other lanes have landed)

This is the ordered command sequence for the execution phase (Level 3, per §11 of
`inventory.md`), mirroring packet 053's own atomic-commit shape (`git mv` plus
freshness/hook/workspace/CLAUDE.md updates in the same commit, then the full gate
set, then a ten-iteration review pass). Every step below cites the inventory section
that justifies it. Nothing here runs until the five in-flight lanes editing
`scripts/**` have landed and this phase's own Gate 3 answer has been confirmed for
the execution packet (REQ-003's Level 3 re-score already ran, §11).

## 0. Preconditions

1. Confirm no other lane still has uncommitted writes under
   `.opencode/skills/system-spec-kit/scripts/**` (`git status` clean at that path).
2. Re-run the `git grep` sweeps from `inventory.md` §1 once more immediately before
   starting — five lanes editing `scripts/**` concurrently means the file list may
   have shifted; regenerate `path-map.json`'s `string_replacements` file list if the
   count materially changed.
3. Create the execution packet via Gate 3 Option D under this same parent
   (`specs/system-speckit/054-decommission-debt-fixes/`), seeded with
   `inventory.md` and `path-map.json` as its starting `spec.md` scope (T010).

## 1. The move itself (one atomic commit)

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

# 1a. The directory move — history-preserving
git mv .opencode/skills/system-spec-kit/scripts .opencode/skills/system-spec-kit/runtime/cli

# 1b. Repoint the one symlink that moved with it (path-map.json "special_cases")
rm .opencode/skills/system-spec-kit/runtime/cli/runtime
ln -s ../dist .opencode/skills/system-spec-kit/runtime/cli/runtime
```

## 2. Text rewrites, by class (path-map.json is authoritative; this is the order)

1. **Bulk mechanical pass** — `path-map.json.string_replacements`, restricted to the
   447-file list `inventory.md` §1 names (recompute immediately before running per
   step 0.2). Exclude `dist/`, `node_modules/`, `specs/`, any `changelog/` or
   `benchmark/` directory, `z_archive/`, `.worktrees/`, `barter/`.
   ```bash
   git grep -l -F "system-spec-kit/scripts" -- . \
     ':!*/node_modules/*' ':!*/dist/*' ':!z_archive/*' ':!specs/*' \
     ':!*/changelog/*' ':!*/benchmark/*' ':!.worktrees/*' ':!barter/*' \
   | xargs sed -i '' 's#system-spec-kit/scripts#system-spec-kit/runtime/cli#g'

   git grep -l -F "scripts/dist" -- . \
     ':!*/node_modules/*' ':!*/dist/*' ':!z_archive/*' ':!specs/*' \
     ':!*/changelog/*' ':!*/benchmark/*' ':!.worktrees/*' ':!barter/*' \
   | xargs sed -i '' 's#scripts/dist#runtime/cli/dist#g'
   ```
   Read the diff before committing — this pass runs over the ALREADY-MOVED
   `runtime/cli/**` tree too (its own package.json, tsconfig.json, README.md, and
   any doc that self-references its old path), which is intended.

2. **`runtime_descend_class`** (path-map.json) — 21 files, 36 lines matching
   `'../../runtime` or deeper. For each: drop the `runtime/` segment, keep the same
   `..` count (inventory.md §4's rule). Handle
   `scripts/evals/check-handler-cycles-ast.ts` (now `runtime/cli/evals/...`) and
   `scripts/tests/import-policy-rules.vitest.ts` by hand — read them first, they are
   not uniform-rule cases. Skip the `confirmed_unaffected_lookalikes` list entirely.

3. **`dirname_climb_plus_one_class`** (path-map.json) — add exactly one `..` to each
   listed fixed-depth climber. Verify by running the specific check/test each file
   backs immediately after editing it (cheaper than waiting for the full suite to
   catch a wrong depth).

4. **`special_cases`** (path-map.json) — hand-apply each one individually:
   `.opencode/bin/skill-advisor.cjs:24`, `shared/embeddings/factory.ts:248`,
   `runtime/lib/graph/graph-metadata-parser.ts:966`,
   `runtime/lib/validation/orchestrator.ts:74-77,229`,
   `runtime/tests/env-reference-drift.vitest.ts:125`,
   `runtime/tests/validation-orchestrator-bridge.vitest.ts:100`,
   `check-architecture-boundaries.ts:53,154,163` (**not** line 404),
   `dist-freshness.cjs`'s `DIST_PACKAGES[1]` (`id`/`root`/`rebuildCommand`) plus its
   one test consumer, `session-stop.ts`'s four-candidate resolver,
   `package.json` workspaces array + the five affected `scripts` keys in both the
   workspace root and the moved package, both `tsconfig.json` files, both
   `vitest.config.ts` include globs, `.gitignore` lines 83-84.

5. **`sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`** — update
   any entry naming the old `system-spec-kit/scripts` path (inventory.md §3); this
   is data, not code, so a JSON value edit, not a sed pass.

## 3. Regenerate what must not be hand-edited

```bash
# 3a. Lockfile — workspace root, NOT the repository root, per packet-053 precedent.
# This is explicitly permitted: the constraint on this task is "no npm install at
# the repository root", and .opencode/skills/system-spec-kit/ is a nested workspace
# with its own lockfile, not the repository root.
cd .opencode/skills/system-spec-kit && npm install && cd -

# 3b. Confirm the nested-workspace-member placement actually works (path-map.json
# risk: no in-repo precedent for a workspace member path nested inside another
# member's own directory).
cd .opencode/skills/system-spec-kit && npm ci --dry-run && cd -

# 3c. Rebuild dist for both moved and adjacent packages.
cd .opencode/skills/system-spec-kit/shared && npm run build && cd -
cd .opencode/skills/system-spec-kit/runtime && npm run build && cd -
cd .opencode/skills/system-spec-kit/runtime/cli && npm run build && cd -

# 3d. Re-stamp dist-freshness now that sources and dist both reflect the new paths.
node .opencode/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs --check-all
```

## 4. Regenerate the runtime mirrors (inventory.md §2)

```bash
# The canonical .opencode/agents/*.md sources were rewritten in step 2's bulk pass.
# Regenerate the five per-runtime mirrors so they don't drift from the fixed source.
node .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs
node .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
```

## 5. Hook installer re-run (if the freshness guard reports stale)

```bash
# The dist-freshness guard plugin and completion plugin both require() the moved
# lib/dist-freshness.cjs and lib/completion-state.cjs by relative path (inventory.md
# §7) — no installer step relocates them, they were fixed by the bulk sed pass in
# step 2, but confirm the plugins actually load post-move:
node -e "require('./.opencode/plugins/system-dist-freshness-guard.js')" 2>&1 | head -5
node -e "require('./.opencode/plugins/system-speckit-completion.js')" 2>&1 | head -5
```

## 6. Compiled routing re-mint (only if the guard reports stale)

This move does not touch `.opencode/bin/lib/compiled-routing/**` or any
`leaf-manifest.json` (inventory.md's targeted search found zero hits in either), so
this step is expected to be a no-op. Run the guard to confirm rather than skip it:

```bash
node .opencode/bin/compiled-route-guard.cjs
# Only if it reports system-spec-kit as stale:
node .opencode/bin/compiled-route-manifest.cjs refresh --hub system-spec-kit
```

## 7. Verification gate list (from packet 053's implementation-summary.md, scoped to this move)

Run every one from the repository root; read output and exit status, don't infer:

| Check | Command |
|-------|---------|
| This packet's own validate | `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh <execution-packet-folder> --strict` |
| Parent + sibling phases, recursive | `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/054-decommission-debt-fixes --strict --recursive` |
| Typecheck: shared, runtime, cli | `cd .opencode/skills/system-spec-kit && npm run typecheck` |
| `npm test` at the workspace root | `cd .opencode/skills/system-spec-kit && npm test` |
| `generate-context.js --help` | `node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --help` |
| Trigger-index lookup | `node .opencode/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "spec folder question"` |
| Registered hook adapters, empty payload each | run every entry in `.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json`, `.cursor/hooks.json` once |
| `git grep` for the old path, repo-wide | `git grep -n "system-spec-kit/scripts" -- . ':!specs/*' ':!*/changelog/*' ':!*/benchmark/*' ':!*/node_modules/*' ':!*/dist/*'` — expect 0 hits outside the historical corpus |
| No dangling symlink | `find .opencode/skills/system-spec-kit -xtype l` |
| `doctor.sh --strict` | `bash .opencode/skills/system-spec-kit/runtime/cli/doctor.sh --strict` |
| `sweep-memory-residue.mjs` (if applicable to this repo state) | check for stray temp output the move itself created |
| Ten-iteration review pass | mirror packet 053's `scratch/launch-review.sh` shape, scoped to `runtime/cli/**` + every file in `path-map.json`'s `special_cases` and the two `_class` groups |

## 8. Rollback

Single `git revert` of the atomic commit (REQ-004/NFR-R01), since the entire move —
`git mv`, text rewrites, lockfile regen, dist rebuilds, mirror regen — lands as one
commit. No half-moved intermediate state should ever be pushed or left uncommitted.
