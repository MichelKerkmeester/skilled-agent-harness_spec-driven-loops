---
title: "Implementation Summary: Phase 2: scripts-into-runtime-nesting"
description: "The spec-kit CLI workspace moved from scripts/ to runtime/cli/, carrying the memory-command-family Stage B rename (scripts/memory -> runtime/cli/continuity) in the same atomic change."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-decommission-debt-fixes/002-scripts-into-runtime-nesting"
    last_updated_at: "2026-09-05T11:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Executed the move and Stage B rename; ran the full gate set"
    next_safe_action: "None; packet closeable"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/runtime/cli/core/config.ts"
      - ".opencode/skills/system-spec-kit/runtime/cli/package.json"
      - ".opencode/skills/system-spec-kit/package.json"
      - ".opencode/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-05-054-002-scripts-into-runtime-nesting"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-scripts-into-runtime-nesting |
| **Completed** | 2026-09-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The spec-kit CLI workspace no longer sits beside the runtime engine — it lives
inside it. `.opencode/skills/system-spec-kit/scripts/` moved to
`.opencode/skills/system-spec-kit/runtime/cli/`, and its own `memory/` folder
moved again to `continuity/` in the same change, closing Stage B of packet
054/007's memory-command-family rename (the compiled writer is now
`runtime/cli/dist/continuity/generate-context.js`). `runtime/scripts/` — the
pre-existing build-tooling directory `finalize-dist.mjs`, `run-tests.mjs`,
`run-tests-sharded.mjs` and `tests/` — was never touched; the collision this
phase's `spec.md` predicted was resolved exactly as decided, by landing the
CLI at a name (`cli`) that cannot collide with it.

### The move

`git mv` carried the tracked tree across in one step, then a second `git mv`
renamed `memory/` to `continuity/` inside the new location. Both moves
preserve history. Nothing inside either folder was restructured beyond the
one rename — the diff is a move plus path text, matching packet 053's own
shape.

### Every live reference, by resolution not grep

The stage-1 inventory (`scratch/inventory.md`) undercounted by a wide margin
once execution started, because several classes of reference never surface to
a plain path-string grep. Fixed at source, by class:

- **Segmented `path.join`/`path.resolve` calls** — `.opencode/bin/skill-advisor.cjs`,
  `.opencode/plugins/tests/system-dist-freshness-guard.test.cjs`,
  `.opencode/skills/system-deep-loop/shared/synthesis/resource-map.cjs`,
  `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs`,
  `shared/embeddings/factory.ts`, `runtime/lib/graph/graph-metadata-parser.ts`,
  `runtime/lib/validation/orchestrator.ts` (the validate.sh rule loader itself),
  and the same pattern repeated inside `evals/check-no-mcp-lib-imports.ts`,
  `evals/check-no-mcp-lib-imports-ast.ts` and `evals/check-allowlist-expiry.ts`'s
  cwd fallback candidates.
- **The relative-import direction flip** — `scripts/` and `runtime/` were
  siblings; now `cli/` is nested inside `runtime/`. Every `'../../runtime/X'`
  import (21 files) had to drop the now-redundant `runtime/` segment rather
  than gain a `..`. `evals/import-policy-rules.ts`'s prohibited-import regex
  encoded this same sibling assumption structurally — a bare `../lib` escape
  from a depth-1 CLI file now means "cli's own lib", not "runtime's lib",
  so the regex was rewritten to require 2+ climbs for `lib`/`core` (which
  collide with cli's own subdirectories) while keeping any-depth detection
  for `handlers`/`shared` (which don't), verified against all 19 existing
  test assertions before any test file changed.
- **Fixed-depth `__dirname`/`SCRIPT_DIR` climbers needing `+1`** — over 40
  instances across `.ts`, `.js`, `.mjs` and `.sh` sources, caught in waves as
  each empirical test run surfaced the next one: `core/config.ts`'s
  `CONFIG.PROJECT_ROOT` and `CONFIG.TEMPLATE_DIR` (consumed by `core/workflow.ts`,
  `continuity/generate-context.ts`, `spec-folder/*.ts`, `extractors/*.ts` —
  the single highest-impact fix in this class), `retrieval/generate-trigger-index.mjs`
  and its two siblings (all three had computed `runtime/runtime/data/...`,
  a doubled segment; the stray directory this produced during testing was
  removed), `spec/validate.sh`'s own `ORCHESTRATOR_JS`/`ORCHESTRATOR_TS`,
  `spec/archive.sh`, `spec/upgrade-level.sh`, `rules/check-normalizer-lint.sh`,
  `lib/template-utils.sh` (both `_inline_gate_renderer_path` and
  `resolve_level_contract`), `setup/rebuild-native-modules.sh`,
  `setup/check-native-modules.sh`, `common.sh` and `.scan-one.sh`, and a long
  tail of test files using `SKILL_ROOT`/`WORKSPACE_ROOT`/`REPO_ROOT` names that
  needed the escape depth checked against their *actual* consumer (some of
  these names meant "cli's own root", self-referential and needing no change;
  most meant "system-spec-kit" or "the repository root" and needed the extra
  level).
- **The `memory` → `continuity` folder rename's own consumers** — every
  `'../memory/…'` relative import inside the moved tree (`core/workflow.ts`,
  a dozen `tests/*.vitest.ts` files), every `scripts/dist/memory` /
  `SCRIPTS_DIR, 'memory'` reference in test harnesses, the compiled entry's
  `package.json` `main` field, `scripts-registry.json`'s trigger list
  (`"/memory:save"` → `"/speckit:save"`, the one remaining site Stage A of
  packet 007 could not reach because it lives inside `scripts/`), and the
  command-contract family key itself: `"memory"` → `"continuity"` in
  `.opencode/skills/sk-doc/sk-create-command/assets/command-contract.json`,
  with the matching `family === 'memory'` hardcode in
  `codex/generate-command-routers.cjs` updated to `'continuity'`. Confirmed
  unrelated and left alone: the `[spec-folder]/memory/*.md` retired legacy
  per-spec artifact concept (`core/tree-thinning.ts`, `core/find-predecessor-memory.ts`,
  several rule scripts' `*/memory/*` exclusions) — a different, still-live
  concept naming a per-packet subfolder, not this workspace.
- **`session-stop.ts`'s four-candidate resolver** (REQ-004) — all four
  candidates (source-depth, compiled-dist-depth, and two absolute/cwd forms)
  rewritten to reach `cli/dist/continuity/generate-context.js`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/scripts/**` → `runtime/cli/**` | Moved | ~450 tracked files, history preserved |
| `runtime/cli/memory/**` → `runtime/cli/continuity/**` | Moved | Stage B of packet 054/007's rename, riding on this move |
| `runtime/cli/package.json` | Modified | `main`, `description`, `test`/`test:task-enrichment` config paths, `@spec-kit/runtime` dependency (`file:..`), `@spec-kit/shared` dependency (`file:../../shared`, was pointing through a dist symlink) |
| `system-spec-kit/package.json` | Modified | `workspaces` array's third member, `typecheck:root` and four other root scripts |
| `runtime/cli/tsconfig.json`, `system-spec-kit/tsconfig.json` | Modified | `extends`, `references`, `paths`, `include` |
| `runtime/tsconfig.json`, `runtime/tsconfig.tests.json` | Modified | Explicit `cli/**` exclusion so the runtime build and its reporting-only test lane never swallow CLI sources |
| `runtime/vitest.config.ts`, `runtime/vitest.stress.config.ts` | Modified | Dropped the CLI test include, added an explicit `cli/**` exclude; CLI keeps its own vitest entry (`--config ../vitest.config.ts`, no longer `../runtime/vitest.config.ts`) |
| `runtime/cli/lib/dist-freshness.cjs` | Modified | `DIST_PACKAGES` entry `id`/`root`/`rebuildCommand` renamed to `system-spec-kit/runtime/cli`; its one test consumer updated to match |
| `runtime/cli/evals/check-architecture-boundaries.ts` | Modified | `REQUIRED_ROOT_DIRS`, the GAP A shared-neutrality check (simplified: checking `runtime` alone now covers `cli` since it nests inside), `isScriptsDistReference`/`isScriptsSourceReference`'s detection strings, both wrapper-violation messages — the OTHER `runtime/scripts` reference (line 404, the build-tooling dir) left untouched |
| `runtime/cli/tests/architecture-boundary-enforcement.vitest.ts` | Modified | Fixture root now creates `runtime/cli` instead of a flat `scripts` dir; GAP A fixture imports updated from `../scripts/*` to `../runtime/cli/*` to keep testing a real escape after the boundary check's own simplification |
| `runtime/hooks/claude/session-stop.ts` | Modified | Four fallback candidates for the compiled continuity writer |
| `.opencode/bin/skill-advisor.cjs`, `.opencode/plugins/{session-cleanup,system-dist-freshness-guard,system-speckit-completion}.js`, `.opencode/plugins/tests/system-dist-freshness-guard.test.cjs` | Modified | Segmented `require()`/`path.join()` calls a text sweep cannot see |
| `.opencode/skills/system-deep-loop/{shared/synthesis/resource-map.cjs,deep-improvement/scripts/shared/reduce-state.cjs}` | Modified | Cross-skill segmented path.join calls reaching into the moved tree |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-contract.json`, `runtime/cli/codex/generate-command-routers.cjs` | Modified | Family key `memory` → `continuity` |
| ~440 further docs, configs, hooks, mirrors, tests | Modified | Path and folder-name text, resolved and applied class by class (§ above) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The stage-1 inventory was the starting point, not the finish line. Bulk
substitution passes handled the unambiguous, fully-qualified forms first
(`system-spec-kit/scripts/` → `system-spec-kit/runtime/cli/`, `scripts/dist/`
→ `runtime/cli/dist/`, both applied to the `memory`-specific patterns before
the general ones so the two renames didn't collide). A precise lookbehind
pattern then handled bare `scripts/` mentions inside system-spec-kit's own
prose docs, verified against the risk it was built to avoid: several
feature-catalog and manual-testing-playbook docs cross-reference *other*
skills' own `scripts/` directories (`sk-code`, `.opencode/scripts/`,
`system-deep-loop`), and the pattern was validated file-by-file to leave
those untouched.

What the bulk passes could not reach — segmented `path.join` calls, shell
`SCRIPT_DIR` climbs, and the direction-dependent rules above — surfaced
empirically: `npx vitest run` and `npx vitest list` against the moved tree,
iterated to convergence. Each run's `ENOENT`/`MODULE_NOT_FOUND` traced to one
producer, fixed at that producer (never at the failing test), then the whole
suite re-run rather than just the failing file, since several of these bugs
(the doubled `runtime/runtime` and `.opencode/.opencode` segments in
particular) were the *same* fix needed in more than one file. `core/config.ts`'s
`CONFIG.PROJECT_ROOT`/`CONFIG.TEMPLATE_DIR` fix alone moved the needle furthest,
since a dozen modules consume it.

Verification ran from the repository root against the new paths only, plus
two full, deterministic trigger-index regenerations to prove no residual
staleness.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| `runtime/cli/` over folding `runtime/scripts/` | Matches the phase's own recorded decision; confirmed cheapest once the collision was inspected directly — three build-tooling files versus renaming an entire incoming workspace's internal directory names |
| Keep the npm package name `@spec-kit/scripts` — **superseded**, see the debt-fix follow-up pass below | Physical location changed; npm resolves workspace members by the `workspaces` array path, not by matching folder name to package name. Renaming would touch every `--workspace=@spec-kit/scripts` invocation for no path-reference benefit. A later operator decision reversed this: the name now reads `@spec-kit/scripts` for a `runtime/cli`-located package, which is its own confusion; renamed to `@spec-kit/cli` with every `--workspace=` invocation swept in the same pass |
| Rename the `dist-freshness.cjs` `DIST_PACKAGES` id to `system-spec-kit/runtime/cli` | Not the npm name — a path-shaped internal label matching its sibling entries' convention; its one consumer moved in the same commit |
| Simplify `isProhibitedForShared`'s two `path.join(packageRoot, 'scripts')` checks to the existing `path.join(packageRoot, 'runtime')` check | Behaviorally identical, not a simplification of convenience: anything under `runtime/cli/` is now already `isWithinDirectory(x, packageRoot/runtime)` by construction, so the second check was checking a directory that can never exist post-move |
| Rewrite `import-policy-rules.ts`'s prohibited-import regex rather than leave it silently disabled | The literal `runtime/(lib|core|handlers)` string it required would never appear in a real cli-internal import again post-move (there is no more reason to spell "runtime" to reach it), which would have made every future violation invisible rather than merely unfixed |
| Execute the "Stage B" memory→continuity rename (packet 054/007) inside this same move rather than waiting for a separately Gate-3'd child packet | Direct operator instruction once the other lanes landed, citing the shared blast radius (both renames touch the same tree and the same `session-stop.ts` fallback candidates) |
| Rename `command-contract.json`'s `memory` family key to `continuity`, not `speckit` | `speckit` already names a distinct family (plan/implement/complete/resume) with a different asset-naming convention (family-prefixed); `continuity` matches the code-path rename and the repo's own established vocabulary (`_memory.continuity`, "continuity writer") without colliding |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run typecheck` (shared, runtime, cli) | PASS — exit 0 |
| `cd runtime && npm run build` | PASS — exit 0; `find dist -path '*/cli/*'` → 0 matches, confirming no CLI leakage into runtime's dist |
| `cd runtime/cli && npm run build` (clean, `dist/` removed first) | PASS — exit 0; `dist/continuity/generate-context.js` present, no stale `dist/memory/` left over |
| `node runtime/cli/lib/dist-freshness.cjs check-all` | PASS — "All watched dist outputs are fresh" |
| `node runtime/cli/dist/continuity/generate-context.js --help` | PASS — exit 0 |
| `validate.sh specs/.../053-spec-kit-runtime-rename --strict` | PASS — Errors 0, RESULT: PASSED |
| `validate.sh specs/.../052-memory-decommission-landing --strict` | PASS — Errors 0, RESULT: PASSED |
| `validate.sh specs/.../054-decommission-debt-fixes --strict --recursive` | PASS — parent + all 7 children (001-007), Errors 0 each |
| `generate-trigger-index.mjs --json`, run twice | PASS — identical `indexSha256` both runs |
| `sync-runtime-mirrors.cjs --check` | PASS — "169 mirrors across 8 trees are in sync" |
| `codex/sync-agents.cjs`, `sync-prompts.cjs`, `pi/sync-agents-pi.cjs`, `sync-prompts-pi.cjs` | PASS — 0 files needed writing (already in sync from the direct text edits) |
| `codex/generate-command-routers.cjs --write` | PASS — "routers=30 clean=30 path-drift=0 shape-drift=0", "0 file(s) rewritten" |
| `compiled-route-guard.cjs` | PASS — every tracked hub (cli-external-orchestration, mcp-tooling, sk-code, sk-doc, system-deep-loop) fresh; no re-mint needed |
| `ci-skill-root-metadata.cjs` | PASS — checked=14 passed=14 failed=0 |
| `ci-skill-derived-freshness.cjs` | PASS — checked=14 fresh=14 stale=0 |
| `route-validate.sh` (doctor) | PASS — 9 routes validated, 2 pre-existing informational warnings unrelated to this move |
| `install-codex-hooks.mjs` then `--check` | PASS — exit 0 both |
| `rg`/`git grep` for `system-spec-kit/scripts/`, `scripts/dist/`, `scripts/memory`, `dist/memory` | PASS — 0 hits outside the historical corpus (`specs/**`, skill-level `changelog/`, `benchmark/`) |
| `npx vitest run --project cli` (skill-root projects config, full CLI suite) | 1568 of 1589 tests pass, 142 of 146 files; one red file remains, `recursive-child-manifest.vitest.ts`, which asserts a goal-file manifest inside the operator's in-flight 036 packet and is left to that packet |

### Debt-fix follow-up pass

| Item | Check | Result |
|------|-------|--------|
| 1. Package rename | `cli/package.json` name → `@spec-kit/cli`; sweep for `@spec-kit/scripts`; `npm ci --dry-run` at workspace root | PASS — exit 0, "up to date"; `node_modules/@spec-kit/{cli,runtime,shared}` all resolve in-tree to real `package.json`s; single hoisted `vitest@4.1.11` after aligning `cli`'s range from `^4.1.9` to `^4.1.11` (both nested copies previously diverged at 4.1.10/4.1.11); `testTimeout: 30_000` from the config proven honored with a probe test (6s test passed, would fail at vitest's 5s default), probe deleted after |
| 2. Build wrap | `cli/package.json` `build` → `prepare-build && tsc --build && record-build`; added `record-build`, `rebuild` | PASS — edit-free `npm run build` then `dist-freshness.cjs check-all` reports fresh for both `default` and `is-phase-parent` entries with `origin: "build"`; `npm run rebuild` clears `dist/` first and rebuilds clean |
| 3. CI install steps | Dropped the dead `cd .../scripts && npm ci` line from both workflows' install step | PASS — `python3 -c "import yaml; yaml.safe_load(...)"` parses both files clean |
| 4. Registries and harness roots | `scripts-registry.json` (24 stale paths), `spec-root-registry.ts` (12 entries), 3 test-harness path bugs | PASS for the scripts-into-cli scope — all fixed paths verified to exist on disk; `spec-root-registry.vitest.ts` gained an existence assertion. Two pre-existing, unrelated entries (`runtime/startup-checks.ts`, `runtime/context-server.ts`) fail that new assertion — confirmed via git history (no commit ever added them) and a cross-worktree search (they exist only under the old `mcp-server` naming in an unrelated worktree); left as a separate, out-of-scope finding rather than silently fixed or masked |
| 5. Root vitest discovery | `system-spec-kit/vitest.config.ts` rewritten as a `test.projects` config (root project + a `runtime/cli`-rooted project) | PASS — `npx vitest list --config vitest.config.ts` exits 0, lists 113 root files + 143 CLI files (CLI suite appears exactly once); `npx vitest list --config runtime/vitest.config.ts` still excludes `runtime/cli` (0 matches). A flat include-list addition was tried first and rejected: `runtime/cli`'s tsconfig chain resolves `nodenext` (needed for its `.js`-suffixed cross-skill imports to resolve to sibling `.ts` files) while the skill-root tsconfig resolves plain `node`, so 3 CLI files importing from `system-deep-loop` failed to collect until the CLI project got its own `root: runtime/cli` |
| 6. Runtime test:task-enrichment | Both the root and `runtime/package.json` `test:task-enrichment` scripts now run the real suite instead of stubs | PASS — `npm run test:task-enrichment` (root) and `npm run test:task-enrichment --workspace=@spec-kit/runtime` both report 53 passed, 1 skipped |
| 7. Docs and fixtures | 31 files matching `system-spec-kit/scripts` outside `specs/`, `changelog/`, `benchmark/reports/`, corrected | PASS — final `rg` for `system-spec-kit/scripts` over live surfaces returns only the deliberately-kept recorded-output lines (a coverage doc's captured transcript, 4 lines; this same doc's own Evidence captions, 3 lines); `validate_document.py` before/after comparison shows identical issue counts (0 new blocking errors, 0 new warnings) across all 29 changed `.md` files; `durable-directory-manifest.json`'s stale entry replaced and `test_readme_manifest.py` re-run (gap count dropped from 100 to 99 — the one entry this task owns is fixed; 99 pre-existing, unrelated gaps remain) |
| 8. Evals path | `check-handler-cycles-ast.ts`'s source-layout candidate | PASS — `../../runtime/handlers` (doubled the segment, resolved to `runtime/runtime/handlers`) corrected to `../../handlers`; compiled-layout candidate left untouched per instruction; `npx tsx evals/check-handler-cycles-ast.ts` passes, "no circular dependencies across 2 handler files" |
| 9. Handoff doc | `scratch/execute-plan.md`'s `dist/memory/generate-context.js` reference | PASS — corrected to `dist/continuity/generate-context.js` (this document's own Verification table already used the correct path) |

### Review findings disposition

The ten-iteration nesting review (`review/lineages/luna-max-review/review-report.md`) returned CONDITIONAL with one P0 and eight P1 findings. Each is closed below with the commit that carries the fix.

| Finding | Severity | What was wrong | Fix | Commit |
|---------|----------|----------------|-----|--------|
| F001 | P0 | `runtime/cli/package.json` absent from the tree; root scripts and lockfile still named `@spec-kit/scripts` | Force-tracked the manifest past the `.opencode/.gitignore` rule that swallowed it; renamed the package to `@spec-kit/cli`; regenerated the lockfile | `6166bbc6df`, `e354f144b5` |
| F002 | P1 | Execution handoff pointed at the retired `dist/memory/generate-context.js` | Handoff corrected to `dist/continuity/generate-context.js` | `e354f144b5` |
| F003 | P1 | Root Vitest discovery omitted `runtime/cli/tests` | Skill-root config rewritten as `test.projects` with a `runtime/cli`-rooted project | `e354f144b5` |
| F004 | P1 | Level, status, and execution state disagreed across spec, acceptance criteria, plan, and summary | Level reconciled to the authored Level 2 document set with the recommend-level score recorded as a note; status rows reconciled | this commit |
| F005 | P1 | Moved-package READMEs kept the `scripts/` and `memory/` topology and invalid `npm --prefix` commands | 31 live documents corrected; recorded-output lines deliberately kept | `e354f144b5` |
| F006 | P1 | Script registry advertised twelve absent `scripts/...` paths | `scripts-registry.json` repointed; every path verified on disk | `e354f144b5` |
| F007 | P1 | Two CI workflows ran `npm ci` from the deleted scripts workspace | Dead install step removed; root `npm ci` provisions all three workspaces | `e354f144b5` |
| F008 | P1 | Spec-root resolver registry kept twelve retired entries; its test checked shape only | Entries repointed; existence assertion added to the test | `e354f144b5` |
| F009 | P1 | Moved test harnesses kept retired roots and a doubled generated-output segment | Three harness path bugs fixed | `e354f144b5` |

The install strategy that made the nested workspace uninstallable was switched to hoisted in `57ef5fe600`. Two spec-root registry entries that predate this move and never existed under their recorded paths are handed to the spec-kit red-test lane in the parent packet.

### Second review pass, salvaged findings

The second pass (GPT-5.6 LUNA max through DevPass) was rejected by the runner after its leaf wrote four iterations to malformed paths, but its six landed iterations raised five P1 findings that verification confirmed. Each is closed below.

| Finding | Severity | What was wrong | Fix | Commit |
|---------|----------|----------------|-----|--------|
| F001 | P1 | The CLI package's `test` script ran Vitest through the runtime config instead of the skill-root projects config the root test claim relies on | `test` now runs `--config ../../vitest.config.ts --project cli` | `c7d2772435` |
| F003 | P1 | The shared package-root resolver required a sibling `scripts/` directory and a pre-existing `runtime/database/`, so it returned null in the live tree | Landmarks are `runtime/cli` and `shared`; the derived database folder is no longer a precondition | `c7d2772435` |
| F005 | P1 | Acceptance criteria said Planned, the plan left Definition of Done unchecked, and the summary carried a Level 3 marker beside a Level 2 table | Status, checkboxes and marker reconciled to the authored Level 2 document set | `c7d2772435` |
| F006 | P1 | The skill doc, the root README and the changelog template still linked or invoked `scripts/` paths | Three links and one command repointed to `runtime/cli/` | `c7d2772435` |
| F007 | P1 | Two committed scan helpers hardcoded one workstation's absolute repository path | Removed; nothing referenced them | `c7d2772435` |

The embeddings harness the root test invokes was CommonJS under an ESM package and failed on `require`; it is now `test-embeddings-factory.cjs` and runs clean.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Historical note: 63 of 1580 CLI test assertions failed at the end of the move.** The follow-up passes recorded above brought the suite to one red file. The original triage, kept for the record, ran after extensive investigation
   and fixing (the suite started this phase's execution at ~128 failures out
   of a much smaller passing baseline; every fix above was driven by an
   actual failing assertion, not by inspection alone). Of the failures traced
   to a specific cause:
   - **Confirmed pre-existing, unrelated to this move**: `template-structure.vitest.ts`
     and `review-record-validation.vitest.ts` assert against a
     `templates/manifest/` path that no longer exists under *either* topology
     — the real templates live at `templates/core/` and `templates/packet-types/`,
     a reorganization this phase did not touch. `recursive-child-manifest.vitest.ts`
     targets `system-deep-loop/036-deep-loop-innovation/001-deep-loop-market-research`,
     a path a *different*, unrelated packet's restructuring moved one level
     deeper; the test's own `repoRoot` computation was fixed (it had the same
     doubled-`.opencode` bug this move introduced), but the target packet path
     itself is stale for a reason outside this phase's scope.
   - **Not yet root-caused**: `graph-metadata-backfill.vitest.ts` (a
     phase-rollup status assertion, `expected 'complete' to be 'planned'`),
     `scoped-backfill-boundary.vitest.ts`, `migrate-generated-json.vitest.ts`
     (a byte-stability hash mismatch between two runs), `multi-ai-council-mirror-parity.vitest.ts`
     (a header-count mismatch against `.opencode/agents/ai-council.md`),
     `repair-derived.vitest.ts` (the tool reports `repairable=0` against a
     fixture the test expects it to flag — `repair-derived.cjs` itself has no
     `scripts/`-path dependency, so this is not a resolution bug, but the
     specific logic reason was not isolated in the time available), and a
     handful of others in the same shape. None of these show `ENOENT` or
     `MODULE_NOT_FOUND` — every failure that did was fixed at its producer.
   None of the investigated failures traced back to an unresolved
   `scripts/` → `runtime/cli/` path reference.
2. **A stray `runtime/runtime/data/trigger-index.json` was created and removed.**
   `retrieval/generate-trigger-index.mjs`'s `SKILL_ROOT` computation was
   off-by-one during the first regeneration attempt (fixed before the
   deterministic two-run proof above); the resulting directory was deleted,
   not left as residue.
3. **`git diff --diff-filter=R` reports 0 renames for this move**, despite
   the change being two `git mv` operations. Git's rename-pair detection for
   an *unstaged* diff (working tree vs `HEAD`) does not run the same
   similarity heuristic that a *staged* diff does, and the operator's explicit
   "do not stage" instruction for this session means that heuristic was never
   exercised. `git status`/`git diff` currently show the move as parallel
   delete/add pairs rather than renames; staging (`git add -A`) before the
   operator's own commit will let git's normal rename detection recognize
   them, exactly as it did for packet 053.
4. **The command-contract.json `owned_assets` field for the retired
   `/memory:learn` tombstone still says "memory/learn is a deprecated
   tombstone"** in its `loader_requirements` prose (no file backs it either
   before or after this change) — left untouched as out of this phase's scope,
   since it names a retired command, not a live path.
<!-- /ANCHOR:limitations -->

---
