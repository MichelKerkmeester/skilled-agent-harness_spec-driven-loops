---
title: "Feature Specification: Phase 6: dual-root-code-and-contracts"
description: "The components that define what .opencode means resolve only that one name, so moving the tree to .skilled would silently misplace state, skip shared dependencies, double-run Codex hooks and let a gate pass on zero files. This phase makes each of them resolve under .opencode, under .skilled and under an .opencode link, so the move itself can be a pure rename."
trigger_phrases:
  - "dual root contracts"
  - "skilled root discovery"
  - "source root sentinel either root"
  - "opencode skilled layout matrix"
  - "dual-root-code-and-contracts"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: dual-root-code-and-contracts

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-16 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 11 |
| **Predecessor** | 005-gate-and-ci-readiness |
| **Successor** | 007-source-root-move |
| **Handoff Criteria** | Every in-scope component passes its tests in three layouts (real `.opencode/`, real `.skilled/`, real `.skilled/` with `.opencode -> .skilled`) and with per-entry links if phase 004 selects them. A move rehearsal on the rebuilt tree runs green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Plan and execute the .skilled source-root migration specification.

**Scope Boundary**: The contract components that decide what `.opencode` means (root discovery, the spec-root family, workspace identity, path allowlists, the MCP launcher and its registrations, the Codex hook installer, the worktree launcher, the local specs relinker, the no-spec-import guard, the contract drift checker and `opencode.json`), plus the tests that prove each one under three layouts. No file moves, no link retargets, no regeneration of derived artifacts and no bulk path rewrite happen here.

**Dependencies**:
- Phase 005 validates PASSED, so hooks and CI already accept both roots (parent D1).
- Phase 004's decision record fixes what `.opencode/` becomes. At planning time its ADR-001 was Proposed: one `.opencode -> .skilled` link, or per-entry links when the probes rule out the first (`../004-migration-design/decision-record.md`). This phase proves three layouts either way and adds the per-entry layout if 004 selects it (REQ-015). 004's choice also decides whether the MCP registration strings must change before phase 009.
- Phase 004's plan, also Proposed, assigns three more items to this phase: `install-git-hooks.sh` ownership of links into either root, `.gitignore` twins and publishing the phase to `skilled/v4.0.0.0` and `main`. The orchestrator's REQ-014 decision placed all three here.
- The reconciled reference map from phase 002 (`../002-per-runtime-reference-map/research/maps/map-c-references.tsv`, rows classed `manual` under `rule:contract-or-ci`).

**Deliverables**:
- Source changes in 24 files, each drafted from a one-file brief, reviewed by a second model family and verified by its own tests.
- Layout rows in 26 test files and test-support modules, four of them new.
- A move rehearsal script in `scratch/` that builds the three layouts from a clone of the rebuilt worktree and runs the whole-tree checks.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Root discovery, installers, launchers and two gates recognise the source root by the literal name `.opencode`. A script launched through a `.opencode -> .skilled` link sees its own location as `.skilled/...`, because Node reports the real path for `__dirname` and `import.meta.url` (observed in a scratch probe on Node v26.8.2). Probes against fixture trees on commit `728c4f3efc` showed silent failures in both post-move layouts.

With the tree under `.skilled/` and no `.opencode` path:

- `findRepoRoot` in `shared/workspace/repo-root.mjs:59-70` returns the starting directory inside `.skilled/` as the repository root, so a writer would plant state there. The advisor twin in `runtime/lib/utils/workspace-root.ts:78-95` does the same.
- `check-no-spec-imports.cjs:36` scans a `.opencode/bin` that no longer exists, prints `ok: no spec-tree imports in 0 runtime file(s)` and exits 0 beside a seeded spec import.
- `worktree-session.sh:80-89` skips every shared dependency path as "absent in main" and plans the database directory under a new real `.opencode/` tree.

With `.opencode -> .skilled` in place:

- `install-codex-hooks.mjs:102-109` keeps the installed `.opencode/...` hook as third-party while adding the `.skilled/...` one, so the hook runs twice.
- `workspace-identity.ts:139-149` reports `<repo>/.skilled` as the workspace root, and a capped `findRepoRoot` walk still returns its start.

In any layout, once documents name `.skilled/` paths, `check-contract-drift.cjs:142-159` stops counting them as authority sources. `deriveAuthoritySources('deep/review')` fell from 16 to 14 in a probe, and no failure was raised.

### Purpose
Every component that defines what `.opencode` means resolves under either root name before the tree moves, so phase 007 can be a pure rename.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Repository root discovery in `repo-root.mjs` and its typing, with every consumer inheriting the change.
- The advisor's workspace root walk and its lockstep twin in `advisor-tool-schemas.ts`.
- Workspace identity, the `sanitizePath` default bases and their `data-loader.ts` twin.
- The spec-root resolver, write guard, migration manifest, migration, `config.ts` and `folder-detector.ts`, proven under three layouts with the legacy alias still spelled `.opencode/specs`.
- The MCP code-mode launcher and a launch probe for its six registrations (`opencode.json` and five runtime MCP configs).
- The Codex hook installer, the worktree session launcher and the local specs relinker.
- The no-spec-import guard and the contract drift checker, with the two path functions of the contract compiler it imports.
- A move rehearsal that clones the rebuilt worktree into three layouts and runs the whole-tree checks.
- The five root-discovery twins that compare a path segment with `.opencode`: `shared/gate-3-classifier.ts:349-372`, `system-skill-advisor/runtime/skill-advisor-cli.ts:189-215`, `runtime/lib/graph/graph-metadata-parser.ts:874-897`, `sk-create-skill/scripts/validate_skill_package.py:24-29` and `routing-accuracy/capture-local-native-divergence-ledger.mjs:30`.
- A sixth twin, the post-edit router's skill-document check (`hooks/post-edit-quality/lib/post-edit-router.cjs:196`). This plan left it to phase 005, which closed without it. The orchestrator placed it here on 2026-09-17 for the same reason as the other five.
- The hooks re-export of the root resolver (`runtime/hooks/lib/workspace/repo-root.mjs` and its declaration), which the runtime CLI imports, so the name list reaches its TypeScript callers.
- `install-git-hooks.sh` treating a link into either root's `scripts/git-hooks/` as its own, so a reinstall replaces the seven `.opencode` links instead of skipping them (phase 004 step 6).
- `.gitignore` twins: every rule and negation naming `.opencode/` gains the same line under `.skilled/` (phase 004 step 7).
- The no-spec-import workflow's positive-fixture step, which must require the violation exit 1 once a scan that reads no file exits 2. The plan left that exact exit check to phase 005, which closed without it. The orchestrator placed it here on 2026-09-17, after the guard's review showed a moved fixture passing CI.
- Layout rows for the migration manifest and migration, which REQ-009 names and the first rows never reached, added on 2026-09-17 after their review.
- Publishing this phase to `skilled/v4.0.0.0` and `main`, fast-forwarding the main checkout and restarting the `code_mode` launcher (phase 004 step 8, parent D2).

### Out of Scope
- Git hooks, `check-git-hooks.sh`, `check-agent-mirror-sync.cjs` and the 19 CI workflows. Phase 005 teaches hooks and CI the new root; only `install-git-hooks.sh`, the post-edit router's skill-document check and the no-spec-import workflow's positive-fixture exit check are in scope here.
- Moving the tree and dealing with the `.skilled/` placeholder. Phase 007 owns the rename commits.
- Retargeting hand-made links and regenerating mirrors, compiled contracts, the trigger index and `dist/` output for the move. Phase 008 owns them.
- The roughly 2,938 mechanical path constants and doc references, including the 13 non-test files that name `.opencode/skills/.state` and the Hermes plugin constants in `.hermes/plugins/repo-guards/__init__.py:31-48`. Phase 009 rewrites them.
- Home configs, global hooks and the consumer promise in `PUBLIC-RELEASE.md:10-36`. Phase 010 owns the machine and consumer cutover.
- Whether opencode can read a project namespace other than `.opencode/`. Phases 003 and 004 settle it by probe and decision.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/shared/workspace/repo-root.mjs` | Modify | Sentinel under either root name, hoist above either name, export the name list |
| `.opencode/skills/system-spec-kit/shared/workspace/repo-root.d.mts` | Modify | Declare the new export |
| `.opencode/skills/system-spec-kit/runtime/hooks/lib/workspace/repo-root.mjs`, `repo-root.d.mts` | Modify | Re-export and declare the name list for the runtime CLI, which imports the resolver through this path |
| `.opencode/skills/system-spec-kit/runtime/cli/utils/workspace-identity.ts` | Modify | Either name anchors a workspace, compare workspace roots |
| `.opencode/skills/system-spec-kit/runtime/cli/utils/path-utils.ts` | Modify | `.skilled` joins the default bases |
| `.opencode/skills/system-spec-kit/runtime/cli/loaders/data-loader.ts` | Modify | `.skilled` joins the data-file bases |
| `.opencode/skills/system-skill-advisor/runtime/lib/utils/workspace-root.ts` | Modify | Same root semantics as `repo-root.mjs`, kept local |
| `.opencode/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts` | Modify | Lockstep twin of the advisor walk, plus a test seam |
| `.opencode/bin/mcp-code-mode-launcher.cjs` | Modify | Server directory from the launcher's own source root |
| `.opencode/bin/install-codex-hooks.mjs` | Modify | One ownership namespace for `.opencode/` and `.skilled/` |
| `.opencode/bin/worktree-session.sh` | Modify | Shared paths and database directory under the checkout's real source root |
| `.opencode/bin/check-no-spec-imports.cjs` | Modify | Scan its own directory, add the `.skilled/specs` spelling, exit 2 when a scan reads no file or cannot read one |
| `.github/workflows/runtime-no-spec-import.yml` | Modify | The positive-fixture step requires exit 1, so a fixture that moved away fails the job |
| `.opencode/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` | Modify | Either prefix counts as an authority source, root-normalized comparison |
| `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Modify | `absolutePath` and `outputPathFor` resolve under either root name, and a path missing under both resolves under the compiler's own tree |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts` | Modify | Row for a compiled directory missing under both names |
| `.opencode/skills/system-spec-kit/runtime/cli/core/spec-root-fixtures.ts` | Modify | Layout parameter for fixtures |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/package-root-parity.vitest.ts` | Modify | Layout axis and hoist rows |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/workspace-identity.vitest.ts` | Modify | Layout rows |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/test-scripts-modules.js` | Modify | `sanitizePath` rows for a linked `.skilled` |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/test-extractors-loaders.js` | Modify | `data-loader` base row |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-validation-matrix.vitest.ts` | Modify | R1, R3 and R7 per layout |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/spec-root-config-precedence.vitest.ts` | Modify | Layout rows |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/test-folder-detector-functional.js` | Modify | Approved-root rows per layout |
| `.opencode/skills/system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts` | Modify | Layout and look-alike rows |
| `.opencode/skills/system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts` | Modify | Lockstep rows |
| `.opencode/bin/mcp-code-mode-launcher.test.cjs` | Modify | Stub-server layout case |
| `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs` | Create | Reconcile rows across spellings and layouts |
| `.opencode/bin/tests/worktree-session.test.sh` | Modify | One fixture per layout |
| `.opencode/bin/tests/relink-local-specs.test.sh` | Create | Root resolution per layout |
| `.opencode/skills/system-spec-kit/shared/gate-3-classifier.ts`, `.opencode/skills/system-skill-advisor/runtime/skill-advisor-cli.ts`, `.opencode/skills/system-spec-kit/runtime/lib/graph/graph-metadata-parser.ts`, `.opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py`, the routing-accuracy `capture-local-native-divergence-ledger.mjs`, `.opencode/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modify | Accept either root segment where each compares a path segment with `.opencode` |
| `runtime/cli/tests/gate-3-classifier.vitest.ts`, `runtime/tests/graph-metadata-schema.vitest.ts`, `sk-doc/scripts/tests/test_create_skill_contract.py`, `.opencode/plugins/tests/sk-code-post-edit-quality.test.cjs` | Modify | Twin rows that fail on the old code |
| `system-skill-advisor/runtime/tests/skill-advisor-cli-repo-paths.vitest.ts`, `system-skill-advisor/runtime/tests/parity/capture-ledger-workspace-root.vitest.ts` | Create | Twin rows for the two walks no existing test covered |
| `.opencode/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh` | Modify | Ownership rows for links written through either root |
| `.opencode/scripts/install-git-hooks.sh` | Modify | A link into either root's `scripts/git-hooks/` counts as owned, and hooks install from `.skilled` when `.opencode` holds none |
| `runtime/cli/tests/spec-root-migration-manifest.vitest.ts`, `runtime/cli/tests/spec-root-migration.vitest.ts` | Modify | Manifest and migration rows per layout |
| `.gitignore` | Modify | `.skilled/` twin for every rule and negation naming `.opencode/` |
| `.opencode/bin/compiled-routing-foundation.vitest.ts` | Modify | Spelling rows for the guard |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts` | Modify | Mixed-spelling rows |
| `runtime/cli/core/spec-root-{canonical-resolver,write-guard,migration-manifest,migration}.ts`, `spec-folder/folder-detector.ts`, `core/config.ts`, `.opencode/bin/relink-local-specs.sh` | Verify | No edit planned, proven by the rows above |
| `opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.cursor/mcp.json`, `.devin/mcp_config.json`, `.pi/mcp.json` | Verify | No edit, proven by the rehearsal launch probe |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `findRepoRoot` returns the repository root from any start inside the tree in all three layouts, including a capped walk, and its fallback never returns a path that contains a `.opencode` or `.skilled` segment. |
| REQ-002 | `findAdvisorWorkspaceRoot` and the schema's `detectRepoRoot` return the same root as REQ-001 in all three layouts, including callers that pass the explicit `.opencode/skills/system-spec-kit/SKILL.md` sentinel. |
| REQ-003 | The MCP code-mode launcher resolves its server manifest and entry point under the source root it was launched from, in all three layouts. |
| REQ-004 | The Codex hook installer treats `.opencode/<path>` and `.skilled/<path>` as one owned hook, so a reinstall leaves exactly one entry per owned hook and keeps hooks outside both namespaces. |
| REQ-005 | `worktree-session.sh` links shared dependencies and compiled output from the main checkout's real source root and sets `SPEC_KIT_DB_DIR` under the worktree's real source root. It never creates a real `.opencode/` directory in a `.skilled`-only checkout. |
| REQ-006 | The no-spec-import guard scans its own directory in all three layouts and exits 2, not 0 or the violation code 1, when a scan reads zero files or cannot read a file it found. It flags imports through `specs/`, `.opencode/specs` and `.skilled/specs`. |
| REQ-007 | The contract drift checker reports no drift on an unchanged tree in all three layouts, and derives the same authority sources whether documents spell a path `.opencode/` or `.skilled/`. |
| REQ-008 | Workspace identity gives one workspace root for a `.opencode` anchor, a `.skilled` anchor and a `.opencode -> .skilled` link, and still separates unrelated repositories. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | The spec-root resolver, write guard, migration manifest, migration, `config.ts` and `folder-detector.ts` keep canonical-first resolution in all three layouts with the legacy alias spelled `.opencode/specs` only. R1, R3 and R7 run per layout. |
| REQ-010 | `sanitizePath` default bases and the `data-loader.ts` bases admit a path inside a symlinked `.skilled/` the way they admit one inside a symlinked `.opencode/`, and still reject outside paths and `..` segments. |
| REQ-011 | `relink-local-specs.sh` resolves the repository root and its sibling targets in all three layouts with no source change. |
| REQ-012 | The six MCP registrations start the launcher from the repository root under real `.opencode/` and under the link, and the `.skilled`-only result is recorded against phase 004's chosen shape. |
| REQ-013 | After the TypeScript changes, rebuilt `dist/` trees pass the staleness check, and the three-layout rehearsal runs against those rebuilt trees. |
| REQ-014 | The five root-discovery twins, the `install-git-hooks.sh` ownership change, the `.gitignore` twins and the publish step land in this phase, each with a test or check that fails before its change and passes after. Decided by the orchestrator on 2026-09-16: a twin left for phase 009 would misresolve under the link between the move and the rewrite, and phase 004's cutover order places the other three here. The post-edit router's skill-document check joined as a sixth twin on 2026-09-17, for the same reason. |
| REQ-015 | When phase 004 selects per-entry links, every component also passes its tests with `.opencode/` as a real directory holding one relative link per moved entry. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the 15 components listed in `plan.md` §3 passes its tests in all three layouts, with pass counts equal to the recorded baseline plus the added rows.
- **SC-002**: The six silent failures seen during planning each have a test row that fails on `728c4f3efc` and passes after the change: a root resolved to the start directory, a zero-file guard pass, skipped shared paths, a duplicated Codex hook, a workspace root at `.skilled` and authority sources lost when documents name `.skilled/`.
- **SC-003**: The move rehearsal runs the drift checker, the guard's default scan and the launcher probe green in the `.skilled`-only and link layouts, and `test ! -e .opencode` holds in the `.skilled`-only copy after the suites run.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 005 validated PASSED | This phase cannot start (parent D1) | T001 reads 005's validate result by content before any draft |
| Dependency | Phase 004's recorded shape for `.opencode/` | Decides whether the registration strings must change before phase 009 | All three layouts are proven regardless, and T001 records the shape |
| Risk | `validate.sh` exited 0 while crashing in a fresh worktree that lacked `dist/` | High | Require the `RESULT: PASSED` line by content, and rebuild `dist/` before any suite counts |
| Risk | A TypeScript change runs against a stale `dist/`, and the staleness hook hides it because `check-dist-staleness.sh --all` always exits 0 and rebuilds on its own | High | `npm run build` in `system-spec-kit` and `system-skill-advisor/runtime`, then read `"stale":false` from `dist-freshness.cjs check --package <id> --json` before any suite counts |
| Risk | A rehearsal clone keeps the worktree's `.git` pointer file, so git commands in the clone act on worktree 055 | High | The rehearsal deletes the copied `.git` file before any command runs in the clone |
| Risk | A `.skilled`-only layout lets writers that join a literal `.opencode/skills/.state` path (13 non-test files) recreate a real `.opencode/` | Med | The rehearsal asserts `test ! -e .opencode` after the suites, and phase 009 owns the constants |
| Risk | The wider hoist matches a `.skilled` segment above the repository when the sentinel walk fails | Low | The sentinel wins whenever it is found, and look-alike and ancestor rows pin the fallback |
| Risk | A delegated draft drifts from its brief | Med | One file per brief, GPT-5.6 review against the brief, orchestrator runs the file's tests before the next unit |
| Risk | A code comment carries a spec path or task id | Med | `check-comment-hygiene.sh <file>` on every changed code file |
| Risk | Fixture commits trip the machine's global commit-msg hook (seen while probing) | Low | Fixtures set `core.hooksPath` to an empty directory, as `tests/worktree-session.test.sh:52-54` does |
| Risk | `.pytest_cache` left in a skill folder stales leaf manifests | Low | No Python runs in scope, and T064 removes any `.pytest_cache` the rehearsal leaves |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Root discovery tests at most two sentinel paths per directory level, one per source-root name.
- **NFR-P02**: `worktree-session.sh` adds at most four file tests before allocating a worktree.

### Security
- **NFR-S01**: `sanitizePath` with the added base still rejects `/etc/passwd`, null bytes and a path that escapes through `..`.
- **NFR-S02**: The no-spec-import guard never exits 0 on a default scan that read zero files.

### Reliability
- **NFR-R01**: Every suite named in `plan.md` §5 passes in each layout with no new failures against the baseline taken at the phase's start commit.
- **NFR-R02**: No run in the `.skilled`-only rehearsal creates a real `.opencode` path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: `findRepoRoot` from the filesystem root returns the start unchanged, the same as today.
- Maximum length: a walk capped by `maxDepth` falls back to the hoist, and the hoist lands above the outermost `.opencode` or `.skilled` segment.
- Invalid format: look-alike segments such as `skilled` and `055-skilled-source-root-migration` never match, and a nested leak such as `.skilled/skills/x/.opencode/skills` hoists to the real root.

### Error Scenarios
- External service failure: a dangling `.opencode -> .skilled` link fails the sentinel test and falls back to the hoist, never to the start directory.
- Network timeout: not applicable, since every component reads the local filesystem. A launcher that cannot read its manifest still exits 1 with the resolver's reason.
- Concurrent access: a root holding both a real `.opencode/` tree and the `.skilled/` placeholder, which is today's tree, keeps resolving to one workspace root.

### State Transitions
- Partial completion: a worktree whose base predates the move while the main checkout is post-move gets a warning and no shared links, not links planted into the placeholder.
- Session expiry: `~/.codex/hooks.json` entries installed under the old spelling are replaced on the next install instead of duplicated.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 13 source files and 16 test files across `system-spec-kit`, `system-skill-advisor`, `system-deep-loop` and `.opencode/bin` |
| Risk | 20/25 | Root discovery serves every writer and session. The hook installer edits a machine-global file, and two gates can pass silently |
| Research | 12/20 | Planning probes observed current behavior, and phase 004's shape decision is still an input |
| **Total** | **52/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Answered: phase 004 recorded L1, one `.opencode -> .skilled` link, so the `.skilled`-only row of REQ-012 is recorded rather than required to pass.
- Answered: the five twins, the `install-git-hooks.sh` change, the `.gitignore` twins and the publish step all joined this phase (REQ-014), and the post-edit router joined as a sixth twin.
- Answered: `detectRepoRoot` is exported with an optional start directory, whose default keeps reading `process.cwd()`, so the lockstep row feeds it and the advisor walk the same trees.
<!-- /ANCHOR:questions -->

---
