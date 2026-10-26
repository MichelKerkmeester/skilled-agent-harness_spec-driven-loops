---
title: "Implementation Plan: Phase 2: builtin-runner"
description: "One Node entry point over one Python hygiene call. It adds scope, built-in sensors, a syntax floor, layer probes, checklist resolution from hub declarations and three renderers, and it writes nothing."
trigger_phrases:
  - "builtin runner plan"
  - "quality gate runner plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 2: builtin-runner

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node 22 CommonJS (`.cjs`), plus Python 3 for the hygiene engine and the Python parse, run as `python3 -B -I` |
| **Framework** | None. Node built-in modules only: `node:test`, `child_process`, `fs`, `path`, `vm` and `crypto` |
| **Storage** | None. The runner writes nothing, and it keeps no state between runs |
| **Testing** | `node --test` over fixture repositories built in a temporary folder, plus the four quality shell suites |

### Overview
This phase adds one Node entry point and one spawn module under `sk-code-quality`. The entry point calls the Phase 1 checker once with `--json`, and it runs the syntax floor and the layer probes itself. It adds declared checklists to two hub registry entries and reads them through the existing `declaredSurfaces` reader. The change is proven by the seven criteria in `goal.md` section 3, a self-run on the checker, and a foreign smoke test on a temporary Go repository.

### Dependency on an earlier phase
This plan depends on `001-honest-checker`. Step 1 checks that Phase 1 has landed. Without its `--json` output and its narrowed patterns, F01 and F02 fail and the hygiene part of F03 to F05 fails.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `001-honest-checker` has landed. `rg -n -- '--json' .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` prints at least one line.
- [ ] Every design citation this plan repeats was re-checked at the current tree. The table in section 8 holds the results.
- [ ] Scope is frozen in `spec.md` section 3, and no file outside it changes.

### Definition of Done
- [ ] All seven criteria in `goal.md` section 3 pass on the branch head.
- [ ] `validate.sh --strict` on this folder prints `RESULT: PASSED`.
- [ ] Both changelog files exist, and both version fields carry the values `spec.md` names.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a single CLI that runs pure stages in order (scope, surfaces, checklists, sensors, verdict, render). Each stage returns data, and only the renderer writes to stdout.

### Key Components
- **`quality-gate.cjs`**: The CLI and the stages. It owns the exit precedence and the renderers.
- **`lib/run-check.cjs`**: Argv spawn, the per-check timeout, the tool probe and the content-hash guard. It is the only module that starts a process.
- **`assets/quality-defaults.json`**: The universal floor, the quality-owned checklist rows and the sensor defaults. It names no command.
- **`router-replay-lib.cjs` `surfaceEntry`**: Keeps the merged marker list and adds the per-kind lists that the runner reads.
- **`registry-compiler.cjs`**: Validates the `quality` declaration beside `surfaceDetection`.
- **`check-comment-hygiene.sh`**: The Phase 1 checker. The runner reads its `--json` output and never reimplements a pattern.

### Data Flow
1. The CLI resolves the repository root from `git rev-parse --show-toplevel` and the hub root from the real path of the runner file.
2. Scope resolves the file list and the changed lines from the diff against HEAD, or from `--files` when git is absent.
3. `declaredSurfaces` returns the hub surfaces in order. Each in-scope file resolves to its surfaces through the real-path guard.
4. Checklists resolve from the floor, the defaults and the surface rows for each file.
5. Built-in sensors and the syntax floor run over each file that has a comment family or a language map.
6. Hygiene runs once over all in-scope files through `check-comment-hygiene.sh --json`.
7. The layer probes read the hook and workflow files. The verdict combines every state.
8. The renderer prints `json`, `text` or `envelope`. Nothing is written to disk.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is not a fix. It changes a shared contract, the surface reader and the registry schema, so the surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `router-replay-lib.cjs` `surfaceEntry` and `declaredSurfaces` | Producer of the surface list. Every reader uses it | update: per-kind lists beside the merged list, names unchanged | Step 3 probe prints `true` (AC-012) |
| `registry-compiler.cjs` `validateSurfaceDetection` | Validates `surfaceDetection` only | update: adds a `quality` validator | `compiled-route-sync.cjs --check` exits 0 (AC-011) |
| `mode-registry.json` SKILLED and `sk-code-ci` entries | Declarations for the hub | update: `quality.checklists` | Step 3 probe lists the two modes (AC-011) |
| `shared/references/stack-detection.md` lines 121 to 125 | The reader contract | update: fourth row for the runner | `rg -n 'quality-gate' .skilled/skills/sk-code/shared/references/stack-detection.md` finds the row (AC-020) |
| `.skilled/plugins/system-skill-advisor.js` `declaredSurfaces` (line 747) | A second reader inside the advisor plugin | unchanged (ADR-016) | `rg -n 'function declaredSurfaces' .skilled/plugins/system-skill-advisor.js` still prints one line |
| `sk-code-review/SKILL.md` line 58 | A reader that keeps no markers of its own | unchanged in this phase | `rg -n 'shared detection contract' .skilled/skills/sk-code/sk-code-review/SKILL.md` prints one line |
| `post-edit-router.cjs` (lines 35 to 44 and 208) | Consumer of the checker path and its extension list | unchanged here. Phase 1 changes it | `rg -n 'check-comment-hygiene' .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` prints one line |
| `check-comment-hygiene.sh` | Hygiene engine | consumed with `--json`. Phase 1 changes it | Step 1 probe |
| `Q/SKILL.md` | Mode document | update: workflow, tree, loading table, target map, enforcement, envelope | `rg -c 'quality-gate.cjs' SKILL.md` prints 4 or more |

**Required inventories**
- Same-class producers: `rg -n 'surfaceEntry|declaredSurfaces' .skilled --glob '*.cjs' --glob '*.js'`.
- Consumers of changed symbols: `rg -n 'declaredSurfaces|surfaceEntry|surfaceDetection' .skilled --glob '*.cjs' --glob '*.js' --glob '*.md' --glob '*.json'`.
- Matrix axes: language family (JavaScript, TypeScript, Python, shell, JSON, YAML, Go, Rust, CSS), shebang present or absent, surface (SKILLED, `sk-code-ci`, UNKNOWN), git present or absent, `python3` present or absent, scope (`--worktree`, `--base`, `--files`). The fixture IDs in `spec.md` section 4 cover these rows.
- Algorithm invariant: a file counts as SKILLED only when its real path lies inside the hub's `.skilled/` directory. Adversarial cases are a symlink to another repository, a symlink to a `local-*` folder, a path with `..` segments and a path with spaces. The unit test named `unit: real-path guard` covers each one.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The four steps below group those tasks. Each step ends with a probe that proves it.

### Step 1: Build the runner core, after Phase 1 is confirmed

Build the entry point, the scope stage, the verdict and the three renderers. The runner must print a verdict for a plain folder with `--files` and write no file.

Acceptance: a verdict prints in `code-quality-run/v1` form for a file in a folder that is not a git repository, and the fixture snapshot is unchanged afterwards.
Verify: `node --test --test-reporter=tap --test-name-pattern='^F10|^F01' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.

### Step 2: Run the sensors, the hygiene call and the layer probes

Add the built-in sensors, the syntax floor, the single hygiene call, the layer probes and the python-absent path. Every spawn goes through `run-check.cjs`.

Acceptance: the fixtures for changed-line and touched-file hygiene, the sensors, the syntax floor, the layers and the python-absent path all pass.
Verify: `node --test --test-reporter=tap --test-name-pattern='^F0[3-5]|^F1[2-3]|^F17|^F18|unit: layers' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.

### Step 3: Declare the surfaces and resolve checklists

Add the `quality.checklists` declarations, the compiler validator, the per-kind marker lists and the checklist resolution. The registry must still compile.

Acceptance: `compiled-route-sync.cjs --check` exits 0, the two declared modes are listed, and the SKILLED and `sk-code-ci` checklists resolve for their files.
Verify: `node .skilled/bin/compiled-route-sync.cjs --check && node -p "require('./.skilled/skills/sk-code/mode-registry.json').modes.filter(m => m.quality).map(m => m.workflowMode).join(',')"` prints `sk-code-skilled,sk-code-ci` after exit 0.

### Step 4: Document, version and prove

Write `runner-contract.md`, update `Q/SKILL.md`, the stack-detection row and the lib pointer. Write both changelogs and bump the versions. Then run the two proofs.

Acceptance: the self-run and the foreign smoke test both pass, and the hub validators exit 0.
Verify: the self-run and foreign smoke commands in `goal.md` section 3 print `true` and `exit=1` with `true`, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` exits 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `unit:`-named cases for scope, exit precedence, argv spawn and guard, the real-path guard, the envelope renderer, the private-label rule, the target map, the flags, the dist adapter and the compiler rejection | `node:test` in `scripts/tests/quality-gate.test.cjs` |
| Integration | Fixtures F01 to F05, F10, F12 to F14 and F16 to F18. Each one builds a temporary git repository, runs the CLI, checks a JSON subset and asserts the snapshot is unchanged | `node:test` with `scripts/tests/fixtures.cjs` |
| Proof | The self-run on the checker and the foreign smoke test on a temporary Go repository | Shell, with `node -p` for the JSON check |
| Regression | The four quality shell suites and the hub validators | `bash` and `node` |

Fixture names carry the ID at the start of the test name, so `--test-name-pattern` selects them. Unit names start with `unit:`.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-honest-checker` outputs (`--json`, `comment-syntax.json`, narrowed patterns, URL span stripping) | Internal, earlier phase | Red until Phase 1 lands | F01 and F02 fail, and the hygiene parts of F03 to F05 fail. Nothing else in this phase is blocked |
| Node 22 (`node:test`, `--test-name-pattern`) | External | Green. The machine runs Node 26.8.2 | None |
| `python3` with `ast` and `-B -I` | External | Yellow. The machine runs Python 3.9.6, which has no `tomllib`, so TOML parsing reads SKIPPED_ABSENT here. PyYAML imports here | REQ-016 reports UNVERIFIED with exit 4 |
| git | External | Green | A non-git run needs `--files` and exits 3 without it |
| `router-replay-lib.cjs` `declaredSurfaces` | Internal | Green. Extended, not replaced | The advisor copy stays as it is (ADR-016) |
| `registry-compiler.cjs` | Internal | Green. One validator added | `compiled-route-sync.cjs --check` fails until the validator passes |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a goal criterion fails after landing, or a later phase cannot read `code-quality-run/v1`.
- **Procedure**: revert the phase's commits with `git revert`, newest first. Then run `node .skilled/bin/compiled-route-sync.cjs --check` and the four quality suites. Phase 1 stays in place, because its checker is useful without this runner.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:citations -->
## 8. DESIGN CITATION CHECK

The design this phase implements repeats file and line references. The table records the result of the check at the current tree. A row marked FIXED replaces the design's reference in this packet. A row marked NOT names the correct citation.

| Reference | Result at the current tree | Used in |
|-----------|----------------------------|---------|
| `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:15-23`, `.skilled/commands/doctor/scripts/sk-code-setup-check.cjs:1`, `.github/workflows/sk-code-script-tests.yml:48`, `.github/workflows/comment-hygiene.yml:42`, `.skilled/scripts/git-hooks/pre-commit:158` | Holds | ADR-001 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/ceiling-report.sh:153-163`, `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:94-100`, `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:35-42,208` | Holds | ADR-002 |
| `.skilled/skills/sk-git/SKILL.md:307` for the link entry-point rule | FIXED: the rule sits at `.skilled/skills/sk-git/references/worktree-workflows.md:537-539` and `.skilled/skills/sk-git/scripts/worktree-naming.sh:470-471` | ADR-002 |
| `.skilled/skills/sk-code/shared/references/stack-detection.md:109` (downstream symlinks) | Holds | ADR-002 |
| `.skilled/scripts/git-hooks/pre-commit:145-158`, `.github/workflows/comment-hygiene.yml:36-48`, `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:29` | Holds | ADR-003 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:13`, `:216-218`, `:219-224` | Holds | ADR-004 |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md:210-222`, `:217`, `:224`, `:245` | Holds | ADR-004, ADR-005 |
| `.skilled/skills/sk-code/mode-registry.json:46-52` (review tool surface) | Holds, with the block spanning lines 46 to 52 | ADR-005 |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/router-replay-lib.cjs:496-503`, `:516`, `:522-539`, `:527`, `:773` | Holds | ADR-006 |
| `.skilled/skills/sk-code/shared/references/stack-detection.md:42-50`, `:103`, `:105-115`, `:121-125`, `:124` | Holds | ADR-006 |
| `.skilled/skills/sk-code/shared/references/stack-detection.md:82` for the `local-example` name | FIXED: the name sits at line 86, and line 103 names the skip rule | ADR-006 |
| `.skilled/skills/sk-code/mode-registry.json:78-84`, `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/registry-compiler.cjs:250-278`, `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:87`, `:463` | Holds | ADR-006 |
| `.skilled/skills/sk-code/shared/README.md:26`, `.skilled/plugins/system-skill-advisor.js:747-772`, `.skilled/skills/system-skill-advisor/feature-catalog/auto-indexing/private-skill-containment.md:16` | Holds | ADR-006, ADR-016 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh:134-140`, `:139`, `:204-212`, and the runtime hook lines `.claude/settings.json:168`, `.codex/hooks.json:37`, `.cursor/hooks.json:26`, `.devin/hooks.v1.json:23` | Holds | ADR-007 |
| `.skilled/skills/sk-code/sk-code-quality/README.md:116` cited for the `.sh` Python claim | NOT the right citation: line 116 advises `--all`. The Python claim rests on `check-comment-hygiene.sh:1` alone | ADR-008 |
| `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:81` for commented-out code | Holds: the P0 item is at line 81 | ADR-009 |
| `AGENTS.md:32-34`, `:178`, `:245`, `:257` | Holds | ADR-010, ADR-013 |
| `.skilled/skills/sk-code/shared/references/phase-detection.md:108-109`, `:121` | Holds | ADR-011 |
| `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md:3,16,89,114` | Holds | ADR-012 |
| `.skilled/skills/sk-git/SKILL.md:261`, `.skilled/skills/sk-git/scripts/lib/message-contract.mjs:283-307` | Holds | ADR-013 |
| `.skilled/scripts/git-hooks/pre-commit:142-158` | Holds | ADR-014 |
| `.skilled/skills/sk-code/sk-code-quality/benchmark/reports/` | Holds: two report folders exist | ADR-015 |
| `specs/sk-code/014-code-modes-research/001-quality-mode-research/research/synthesis-v1.md:207` for rank 13 | Holds: line 207 records rank 13, the repository-relative root and the corpus | ADR-015 |

<!-- /ANCHOR:citations -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
001-honest-checker ──► 002-builtin-runner ──► 003-config-and-doctor
                              │
                              ├──► 004-doctrine
                              ├──► 005-consumers-and-routing
                              └──► 006-measurement
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001-honest-checker | None | 002-builtin-runner, through the `--json` output and the narrowed patterns |
| 002-builtin-runner | 001-honest-checker | 003 (the config layer reads the runner's checks), 004 (the doctrine names the runner), 005 (consumers read the verdict), 006 (the measurement runs the gate) |
| 003-config-and-doctor | 002-builtin-runner | 004 and 006 (the config and doctor routes) |
| 004-doctrine | 002-builtin-runner | 005 |
| 005-consumers-and-routing | 002-builtin-runner, 004-doctrine | 006 |
| 006-measurement | 003, 004 and 005 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Estimates are an assumption, made before any code exists.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (step 1) | Low | About half a day, including the Phase 1 check and the citation check |
| Core Implementation (steps 1 to 3) | High | About three to four days |
| Verification and documentation (step 4) | Medium | About one day |
| **Total** | | **About five days (assumption)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase 1 landed, and its four suites pass on the branch head
- [ ] The branch head is recorded before the first Phase 2 commit
- [ ] No feature flag applies. No caller invokes the runner until Phase 4 names it in the doctrine

### Rollback Procedure
1. Revert the Phase 2 commits with `git revert`, newest first.
2. Run `node .skilled/bin/compiled-route-sync.cjs --check`, and confirm it exits 0 on the reverted tree.
3. Run the four quality suites, and confirm each one prints its pass line.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. The runner writes no data, and the registry declarations revert with the commits.
<!-- /ANCHOR:enhanced-rollback -->

---

