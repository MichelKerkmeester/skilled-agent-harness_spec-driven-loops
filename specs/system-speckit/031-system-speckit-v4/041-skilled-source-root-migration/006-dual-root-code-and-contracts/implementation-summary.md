---
title: "Implementation Summary: Phase 6: dual-root-code-and-contracts"
description: "Every component that decides what .opencode means now resolves under a real .opencode/, a real .skilled/ and a .opencode -> .skilled link, proven by rows that fail on the start commit, a three-layout rehearsal and 23 reviews, and published at dadf2d19dd."
trigger_phrases:
  - "dual root implementation summary"
  - "skilled contract components shipped"
  - "dual-root-code-and-contracts results"
  - "either root verification evidence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/006-dual-root-code-and-contracts"
    last_updated_at: "2026-09-17T13:30:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Published dadf2d19dd and recorded the verification, reviews and publish checks"
    next_safe_action: "Validate the phase strictly, then start phase 007 per D1"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
      - "goal.md"
      - "scratch/rehearsal-results.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "041-006-implementation-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 004 chose L1, so entry-links was not required"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-dual-root-code-and-contracts |
| **Completed** | 2026-09-17, published to `skilled/v4.0.0.0` and `main` at `dadf2d19dd` |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Before this phase, every component that decides what `.opencode` means knew only that name. Moving the tree would have let writers plant state inside `.skilled`, let a guard pass on zero files, sent worktrees off without their shared dependencies, run Codex hooks twice and dropped sources from the drift check without a word. Now each of those components resolves one tree under a real `.opencode/`, under a real `.skilled/` and under `.skilled/` with `.opencode` linked to it, so phase 007 can move the tree as a pure rename.

### Root discovery

`findRepoRoot` tests its sentinel under both names and exports `SOURCE_ROOT_NAMES`, which the hooks re-export passes on to the runtime CLI. A walk that runs out of levels tests the start, then the parent of each source-root segment in the start path nearest first, and only then hoists above the outermost `.skilled` or `.opencode` segment, so a repository kept under a directory named `.skilled` keeps its own root. A caller's sentinel under `.skilled/` or `.opencode/` is tested under both names, except one under the legacy spec alias `.opencode/specs`, which keeps its one spelling. The advisor walk and its schema twin `detectRepoRoot`, now exported with a start parameter, follow the same rules, and a lockstep row feeds both the same trees.

### Workspace identity and path allowlists

Either name anchors a workspace, and two paths match when their workspace roots agree. Where the anchor is ambiguous, the source root whose tree carries the spec-kit skill wins, so today's real `.opencode/` beats the empty `.skilled/` placeholder and a checkout kept in a folder named `.skilled` stays its own root. Every spelling whose tree carries the skill is a match variant, which puts the linked `.opencode` beside `.skilled`. `sanitizePath` and the data loader admit a file inside a linked `.skilled/` the way they admit one inside a linked `.opencode/`.

### Spec roots

The resolver, write guard, collision classifier, configuration, migration manifest, migration and folder detector needed no change, and rows now prove it in every layout. `materializeRootFixture` takes a layout. Under the link a legacy root is listed and migrated through its `.opencode/specs` spelling exactly as today. In a `.skilled`-only workspace no legacy root exists, a packet under `.skilled/specs` stays where it is, and a real `.skilled/specs` directory is never approved.

### Launcher, installer and worktrees

The code-mode launcher finds its server under its own source tree. The Codex hook installer keys ownership by one spelling, so a reinstall replaces an entry written under the other name and removes an orphan under either. `worktree-session.sh` links shared dependencies from the main checkout's real source root, puts `SPEC_KIT_DB_DIR` under the new worktree's, and warns and links nothing when the two name different roots. The local specs relinker needed no change.

### Gates

The no-spec-import guard scans its own directory, knows the `.skilled/specs` spelling and exits 2 when a scan reads no file or cannot read one it found, which outranks a violation. Its CI step now requires exit 1 from the positive fixture, so a fixture that moved away fails the job. The contract drift checker counts sources under either prefix and compares them by one key, and the compiler resolves a source under the other name when its own spelling is absent, or under its own tree when neither exists.

### Twins, git hooks and ignore rules

Six walks that compared a path segment with `.opencode` accept `.skilled` too: the Gate 3 workspace walk, the advisor CLI's launcher lookup, the graph metadata specs-root walk, the skill package validator, the divergence ledger capture and the post-edit router's skill-document check. The graph walk keeps a nested specs root to `.opencode/specs`. `install-git-hooks.sh` owns links into either root's hooks, installs from `.skilled` when `.opencode` holds no hooks and fails when neither does. `.gitignore` carries a `.skilled` twin after each of its 60 rules and negations that name `.opencode`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `shared/workspace/repo-root.mjs`, `repo-root.d.mts`, `runtime/hooks/lib/workspace/repo-root.mjs`, `repo-root.d.mts` | Modified | Root discovery under either name and the exported name list |
| `system-skill-advisor/runtime/lib/utils/workspace-root.ts`, `schemas/advisor-tool-schemas.ts` | Modified | The advisor walk and its schema twin |
| `runtime/cli/utils/workspace-identity.ts`, `utils/path-utils.ts`, `loaders/data-loader.ts` | Modified | Workspace identity and path allowlists |
| `runtime/cli/core/spec-root-fixtures.ts` | Modified | Layout parameter and guarded setup |
| `.opencode/bin/mcp-code-mode-launcher.cjs`, `install-codex-hooks.mjs`, `worktree-session.sh`, `check-no-spec-imports.cjs` | Modified | Launcher, installer, worktree launcher and guard |
| `.github/workflows/runtime-no-spec-import.yml` | Modified | The positive fixture must exit 1 |
| `system-deep-loop/runtime/scripts/check-contract-drift.cjs`, `compile-command-contracts.cjs` | Modified | Drift sources under either prefix and root-aware paths |
| `shared/gate-3-classifier.ts`, `system-skill-advisor/runtime/skill-advisor-cli.ts`, `runtime/lib/graph/graph-metadata-parser.ts`, `sk-create-skill/scripts/validate_skill_package.py`, `capture-local-native-divergence-ledger.mjs`, `hooks/post-edit-quality/lib/post-edit-router.cjs` | Modified | The six twins |
| `.opencode/scripts/install-git-hooks.sh`, `.gitignore` | Modified | Git hook ownership and source fallback, ignore twins |
| `runtime/cli/tests/package-root-parity.vitest.ts`, `workspace-identity.vitest.ts`, `spec-root-validation-matrix.vitest.ts`, `spec-root-config-precedence.vitest.ts`, `spec-root-migration-manifest.vitest.ts`, `spec-root-migration.vitest.ts`, `test-folder-detector-functional.js`, `test-scripts-modules.js`, `test-extractors-loaders.js`, `gate-3-classifier.vitest.ts` | Modified | Layout, spelling and regression rows |
| `system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts`, `tests/schemas/advisor-tool-schemas.vitest.ts` | Modified | Advisor layout and lockstep rows |
| `system-skill-advisor/runtime/tests/skill-advisor-cli-repo-paths.vitest.ts`, `tests/parity/capture-ledger-workspace-root.vitest.ts`, `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs`, `.opencode/bin/tests/relink-local-specs.test.sh` | Created | Rows for walks and scripts no test covered |
| `.opencode/bin/mcp-code-mode-launcher.test.cjs`, `bin/tests/worktree-session.test.sh`, `bin/compiled-routing-foundation.vitest.ts`, `system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts`, `compile-command-contracts.vitest.ts`, `runtime/tests/graph-metadata-schema.vitest.ts`, `sk-doc/scripts/tests/test_create_skill_contract.py`, `plugins/tests/sk-code-post-edit-quality.test.cjs`, `scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh` | Modified | Rows for the launcher, worktrees, guard, drift checker, compiler and twins |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator wrote each unit's expected file first and checked the design against it outside the worktree, often against the parent code or a deliberate mutation. A builder turned the expected file into literal OLD and NEW blocks and replayed them against HEAD. DeepSeek V4.1 Flash applied each unit, and a unit counted only when the changed files matched the expected files byte for byte and nothing else changed. The component's suites then ran, and the component landed as its own commit with its briefs, payloads and returns. GPT-5.6 Luna reviewed every component read-only, every finding was reproduced before it was fixed or answered, and every fix was reviewed again.

On 2026-09-17 the operator widened the executor lanes for speed. From then on, units ran one worker per lane in the worktree, each on its own file, and a batch passed only when the changed set equaled the queued files and every file matched. Luna reviews ran several at once.

### Delegation

| Executor | Units | Result |
|----------|-------|--------|
| DeepSeek V4.1 Flash on cli-pi, LLM Gateway, `--thinking max` | 67 units before the lanes widened and 4 dispatches after | Every unit applied. The first parity-test dispatch spent eight minutes on OLD blocks that began with a blank line and wrote nothing, so the builder widened every block to non-blank boundaries and the retry applied. After the widening, one dispatch hit an upstream 429 on all three retries and wrote nothing, the batch check caught the unchanged file, and the unit went to the Cline lane |
| DeepSeek V4.1 Flash on cli-pi, Cline, `--thinking xhigh` (Cline's top tier) | 11 units, including the re-run of the unit the LLM Gateway lane missed | All applied |
| DeepSeek V4.1 Flash Max on cli-devin, `--permission-mode accept-edits` | 4 units | All applied. One return printed no edit lines, and its file matched |
| GPT-5.6 Luna, `xhigh`, fast tier, read-only | 23 reviews | Findings and dispositions are in the review table below |
| Orchestrator | Setup, expected files, the rehearsal script, every verification and commit | As assigned in the plan |

Briefs, payloads and returns are kept in `scratch/briefs/`.

### Commits

`1553cbbea5`, `4c8dd774f8` (root discovery), `f07b20bab8`, `20b83a2f4b`, `e02c7da037` (workspace identity), `23452e3b87`, `9de853871b` (path allowlists and their rows), `4b2664e339`, `ea8fd7e358` (spec roots), `b6f743a0a5`, `5abee9a3a6`, `ca1d6be398` (advisor walk and lockstep), `585af95feb` (launcher), `3cb9105fd3`, `0f744e8eb0` (Codex hook installer), `1c3c1936ce`, `576fd1f5c7`, `a1fa1730a7` (worktree launcher), `43bd90ca19`, `db6ff28e42` (relinker), `70750d59b3`, `7235b25091`, `dc9fcbb6e9` (guard and its workflow), `5eb7bcfbd2`, `a5ef12c973` (drift checker and compiler), `e7b5c29707`, `b14fe65a53`, `5aaf2b623f`, `ba5398eaf8` (twins, git hooks and ignore rules). `f50f234cd4` recorded the setup and baseline. `dadf2d19dd` is pushed to `skilled/v4.0.0.0` and `main`, and the main checkout sits on it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The legacy spec alias keeps `.opencode/specs` alone | Goal D2. A resolver that gained `.skilled/specs` would list a second legacy root after the move. The graph walk was narrowed back when its review found it accepting `.skilled/specs`, and a `.skilled/specs` sentinel tests the legacy spelling rather than adding a root |
| The spec-kit skill breaks anchor ties, and names decide otherwise | Today's checkout holds a real `.opencode/` beside an empty `.skilled/`, so a name alone picked the wrong anchor. Without the skill on either side, a directory named `.skilled` is a source root by its name, and a stray tree inside a skill folder anchors there exactly as the original module did |
| The Codex installer's labels name entries as installed | The plan keeps labels as they were, so a removed entry shows the spelling that was removed. The source file's `.opencode` literal is phase 009's |
| A path missing under both names resolves under the compiler's own tree | A first write in a `.skilled`-only checkout otherwise created a real `.opencode` |
| An unread file outranks a violation in the guard | A scan that could not read a file proves nothing about it, so the no-proof code wins and CI's exact-code check fails a damaged fixture |
| The git hook installer falls back to `.skilled` and fails when no hooks exist | Scanning an absent `.opencode` directory installed nothing and reported success. `.opencode` stays first, so today's links keep their spelling |
| Three items joined this phase after planning | The post-edit router's skill-document check (a sixth twin), the no-spec-import workflow's exact exit check and the manifest and migration layout rows. The plans had left the first two to phase 005, which closed without them, and REQ-009 named the last |
| `.skilled`-only registrations are recorded, not required | Phase 004 chose L1, one `.opencode -> .skilled` link, so the registrations resolve through the link and `entry-links` is not required |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Builds and freshness at `dadf2d19dd` | PASS: `npm run build` exits 0 in `system-spec-kit` and the advisor runtime, and `dist-freshness.cjs` reads `"stale":false` for `system-spec-kit/shared`, `system-spec-kit/runtime/cli` and `system-skill-advisor/runtime` |
| Root discovery (b01, b11) | PASS: 64 tests over the four files, against 21 at baseline, and the spec gate core 87 pass, 0 fail, 3 skipped, as at baseline |
| Spec roots (b02, b04) | PASS: `tests/spec-root-*.vitest.ts` 13 files and 74 tests (56), and the folder detector 28 passed, 0 failed (14) |
| Path allowlists (b03) | PASS: 266 passed, 0 failed, 5 skipped (262/0/5), and 268 passed, 0 failed, 6 skipped (267/0/6) |
| Advisor walk (b05) | PASS: 39 tests (26) |
| Launcher and Codex installer (b06) | PASS: 26 tests, 23 pass and 3 skipped where the vendored server is absent (1 pass and 3 skipped) |
| Guard (b07, b15) | PASS: 37 tests (25). The default scan reads 26 files and exits 0, the positive fixture exits 1 and the negative fixture exits 0 |
| Drift checker and compiler (b08, b14) | PASS: 23 tests over two files (8 over one), and `[CONTRACT DRIFT] OK commands=3` |
| Worktree launcher and relinker (b09, b10) | PASS: `PASS=41 FAIL=0` (25) and `PASS=21 FAIL=0` (new) |
| Twins | PASS: Gate 3 64, advisor CLI and ledger 6, graph metadata 42, post-edit router 41, git hook harness 8 PASS lines. The skill validator suite passes 23 and fails `test_parent_templates_carry_the_same_exact_directive`, as at the start commit |
| Typechecks (b12, b13) | PASS: both exit 0 |
| Workflow input check | PASS: `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` with 132 inputs and 167 twin pairs |
| Layout rehearsal | PASS: `scratch/rehearsal-results.md` at `dadf2d19dd`: 46 rows pass, 7 are recorded as planned and none fails, including `[CONTRACT DRIFT] OK` and the guard in the `skilled-only` and `whole-link` clones, `test ! -e .opencode` in `skilled-only`, 31 ignored entries in every layout, and all six registrations answering in `today` and `whole-link` |
| Fail-before evidence | PASS: a copy of the worktree with the start commit's 23 changed source files and today's tests fails 12 parity, 4 workspace identity, 7 advisor, 7 guard, 3 drift and compiler, 8 Codex installer, 7 worktree, 1 launcher, 1 Gate 3, 2 advisor CLI, 1 ledger, 1 graph, 2 router and 1 skill validator rows, plus T-003i and LOAD-003. The git hook harness fails its ownership row on the start commit's installer, and the new rows of the spec-root, auto-detect and guard review rounds fail on the commits they correct or under a mutation |
| Comment hygiene | PASS: 50 changed code files, 0 violations, 4 skipped by type with no id or spec path in their added comments |
| Home files | PASS: `~/.codex/hooks.json` keeps modification time 1788592466 through every run |
| Inventories at `dadf2d19dd` | The `.opencode` equality inventory returns 10 lines in 8 non-test files, down from 20 in 13: legacy alias checks kept under D2 in `post-edit-router.cjs`, `check_no_new_snake_case.py`, `audit_readmes.py`, `spec-root-canonical-resolver.ts` and `spec-doc-paths.ts`, the alias exemption in both resolvers, and `sweep-memory-residue.mjs`'s prefix classifier for phase 009. The sentinel inventory returns 11 lines in 9 files, each dual-spelled by the sentinel rule or a phase 009 recheck. `SOURCE_ROOT_NAMES` appears in 16 files, `findRepoRoot` in 47, `findAdvisorWorkspaceRoot` in 42, the workspace identity exports in 4 and `sanitizePath(` in 4 |
| Publish | PASS: `dadf2d19dd` reached `skilled/v4.0.0.0` and `main` as fast-forwards from `cfeba3e1fb`, and the main checkout sits on it with its 23 uncommitted files from other sessions untouched. A fresh `code_mode` launcher started from the main checkout through `.claude/mcp.json` answered `initialize` as `CodeMode-MCP 1.0.0` in 6.4 s. In a disposable clone at `7085ec3290`, the commit before phase 005, with the worktree launcher's shared dependencies linked in, a commit ran every global hook with no error line. Without those dependencies the mirror-parity gate blocked on `Cannot find module '@spec-kit/shared/workspace/repo-root.mjs'`, which an install gap in a bare clone explains |
| CI on the pushed tip | PASS against the baseline: all 17 runs for `dadf2d19dd` completed, 12 passed, including Gate Inputs and Runtime No-Spec-Import Guard. The three red workflows match their last runs line for line: Spec-Kit Check 12 of 12 failure lines on both branches against `c22d1b63c9`, Routing Registry Drift Guard 13 of 13 on both branches against `c22d1b63c9`, and Playbook Operator Contract's whole failure output against `cfeba3e1fb` |

### Rows per test file

| File | Rows |
|------|------|
| `runtime/cli/tests/package-root-parity.vitest.ts` | 28 |
| `runtime/cli/tests/workspace-identity.vitest.ts` | 11 |
| `runtime/cli/tests/spec-root-validation-matrix.vitest.ts` | 20 |
| `runtime/cli/tests/spec-root-config-precedence.vitest.ts` | 5 |
| `runtime/cli/tests/spec-root-migration-manifest.vitest.ts` | 8 |
| `runtime/cli/tests/spec-root-migration.vitest.ts` | 8 |
| `runtime/cli/tests/test-folder-detector-functional.js` | 28 |
| `runtime/cli/tests/gate-3-classifier.vitest.ts` | 64 |
| `system-skill-advisor/runtime/tests/utils/workspace-root.vitest.ts` | 23 |
| `system-skill-advisor/runtime/tests/schemas/advisor-tool-schemas.vitest.ts` | 16 |
| `system-skill-advisor/runtime/tests/skill-advisor-cli-repo-paths.vitest.ts` | 2 |
| `system-skill-advisor/runtime/tests/parity/capture-ledger-workspace-root.vitest.ts` | 4 |
| `.opencode/bin/compiled-routing-foundation.vitest.ts` | 37 |
| `.opencode/bin/mcp-code-mode-launcher.test.cjs` | 8, 3 skipped without the vendored server |
| `.opencode/bin/tests/install-codex-hooks-source-root.test.cjs` | 18 |
| `.opencode/bin/tests/worktree-session.test.sh` | 41 |
| `.opencode/bin/tests/relink-local-specs.test.sh` | 21 |
| `system-deep-loop/runtime/tests/unit/check-contract-drift.vitest.ts` | 10 |
| `system-deep-loop/runtime/tests/unit/compile-command-contracts.vitest.ts` | 13 |
| `runtime/tests/graph-metadata-schema.vitest.ts` | 42 |
| `plugins/tests/sk-code-post-edit-quality.test.cjs` | 41 |
| `sk-doc/scripts/tests/test_create_skill_contract.py` | 24, one failing as at the start commit |
| `scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh` | 8 |

### Finding classes

| Component | Class |
|-----------|-------|
| Root discovery, advisor walk and schema twin | class-of-bug, cross-consumer: every writer and handler inherits the walk |
| Workspace identity | cross-consumer, algorithmic: anchor choice and root comparison |
| Path allowlists | instance-only |
| Spec roots | matrix/evidence: no source change |
| Launcher | instance-only |
| Codex hook installer | algorithmic: one ownership key |
| Worktree launcher | instance-only, test-isolation |
| Relinker | matrix/evidence: no source change |
| Guard and its workflow | algorithmic: the exit contract and its CI reader |
| Drift checker and compiler | algorithmic: root-normalized keys and path fallback |
| Twins, git hooks and ignore rules | class-of-bug: six walks keyed on one segment |

### Contract reviews

| Component | Findings per round | Disposition |
|-----------|--------------------|-------------|
| Root discovery | 3 | F-001 reproduced, a capped walk under a `.skilled` ancestor hoisting past the repository, and fixed in `4c8dd774f8`. F-002 and F-003 tightened rows that passed on the parent |
| Workspace identity | 3, 4, 0 | Round one: a checkout named `.skilled` and today's placeholder anchor, fixed in `20b83a2f4b`. Round two: the linked `.opencode` variant, fixed in `e02c7da037`. A stray tree inside a skill folder and a bare directory named `.skilled` behave as the original module did and were answered, and the stray-tree row is labeled a control. Round three: no finding |
| Advisor walk and lockstep | 6, 3, 0 | F1, F2, F5 and F6 fixed in `5abee9a3a6`. F3 and F4 are phase 009 literals. Round two: the `.skilled/specs` sentinel and the schema comments, fixed in `ca1d6be398`, and the start-first fallback, unreachable through `detectRepoRoot`, answered. Round three: no finding |
| Path allowlists | 1 | LOAD-003 moved to `/var/tmp` in `9de853871b` |
| Spec roots | 5, 2, 0 | Round one fixed in `ea8fd7e358`: a thrown row fails, a `.skilled/specs` decoy, manifest and migration rows per layout, narrower comments and guarded setup. Round two: auto-detection rows in `dadf2d19dd`, and the hygiene claim answered with the checker's clean result. Round three: no finding |
| Launcher | 0 | No finding |
| Codex hook installer | 4 | F-003 and F-004 fixed in `0f744e8eb0`. F-001 behaves the same on the parent installer and F-002 follows the plan's label rule |
| Worktree launcher | 2, 2, 1 | Database directory and placeholder rows in `576fd1f5c7`, git environment cleared in `9de853871b` and `a1fa1730a7`, and usage comments left for phase 009 |
| Relinker | 1 | Placeholder row in `db6ff28e42` |
| Guard and workflow | 5, 2, 0 | F2, F3 and F5 fixed in `7235b25091`. F1 is a phase 009 literal and F4 a heuristic unchanged since the start commit. F6 and F7 fixed in `dc9fcbb6e9`. Round three: no finding |
| Drift checker and compiler | 4 | F2 fixed in `a5ef12c973`. F1 and F4 are phase 009 literals and F3 behaves the same on the parent |
| Twins, git hooks and ignore rules | 4, 3 | F-002 and F-003 fixed in `ba5398eaf8`. F-001 is a phase 009 literal and F-004 matches the original `.opencode` rule. Round two: F-005 concerns phase 005's check, which warns, F-006 behaves the same for `.opencode` on the start commit and F-007's rows fail on the start commit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Path literals wait for phase 009.** These name `.opencode`, fail only in a checkout with no `.opencode` path and resolve through L1's link: the skill-graph watcher's skills path, the advisor validator's and benches' sentinel rechecks, the guard workflow's script path, the contract renderer's constants and the compiler test's expectations, the divergence ledger's Python scorer path, the Codex hook source file, the installer and relinker usage comments, `check-git-hooks.sh`, which warns in that layout, and `runtime/hooks/lib/workspace/README.md`, which describes `hoistAboveOpencodeTree` and `REPO_ROOT_SENTINEL`.
2. **Behavior kept from before this phase.** The guard flags a line that holds both a `require` and a spec-tree string. The drift checker hashes a recorded digest path without bounding it to the workspace. A `specs` directory nested inside a source tree beside its own source tree reads as a specs root. Each behaves the same for `.opencode` on the start commit.
3. **`test_parent_templates_carry_the_same_exact_directive` fails.** It fails the same way at the start commit, so the validator twin is judged on its own new row.
4. **No changelog folder.** The phase context asks for a changelog refresh, and `../changelog/` does not exist in this packet.
5. **Operator item.** The shared `.pi/models.json` still needs `llmgateway.compat.supportsDeveloperRole: false`. Phase units run through agent directories that carry it.
<!-- /ANCHOR:limitations -->
