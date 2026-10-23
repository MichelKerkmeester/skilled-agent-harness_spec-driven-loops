---
title: "Tasks: Phase 3: advisor-vocabulary-cleanup"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "advisor vocabulary cleanup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: advisor-vocabulary-cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Every task names its writer branch. `deepseekpi` is the code branch and carries every task here: even the one-line option description in the advisor README must land with the code it describes, so `deepseekpihigh` (docs-only) is not used in this phase. Anchors are line numbers read on commit `42b41dd286`; when a task says "read the file and locate", find the quoted text rather than trusting the number.

Run vitest from `.skilled/skills/system-skill-advisor/runtime` as `../../system-spec-kit/node_modules/.bin/vitest run <file>`; run the CJS suites from the repository root.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Build the local advisor database before any test run (no file). Run `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true --format text` from the repository root. Proof: it prints `advisor_rebuild: rebuilt` and a `skillCount:` line. The database it writes is gitignored; without it `tests/advisor-surface-hint.vitest.ts` fails on a missing projection, which is not this phase's change. Branch: `deepseekpi`.
- [ ] T002 Record the baseline, and do not edit anything yet (no file). Run all eleven commands and write the numbers into `implementation-summary.md` when the phase closes. Proof of a usable baseline: every command exits 0 except the last, which is expected red.
  1. `../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts` → 9 passing
  2. `../../system-spec-kit/node_modules/.bin/vitest run tests/handlers/advisor-status.vitest.ts` → passing
  3. `python3 tests/python/test_skill_advisor.py` → `fail=0`
  4. `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` → 4 passing
  5. `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` → prints `contract + fleet gate coverage passed`
  6. `../../system-spec-kit/node_modules/.bin/vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts` → passing
  7. `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` → 42 passing
  8. `../../system-spec-kit/node_modules/.bin/vitest run tests/system-skill-advisor-plugin.vitest.ts` → 94 passing
  9. `../../system-spec-kit/node_modules/.bin/vitest run tests/advisor-surface-hint.vitest.ts` → 3 passing
  10. `../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/native-scorer.vitest.ts` → 22 passing
  11. `../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/ambiguity-slice.vitest.ts` → **expected to fail at `live=17/24 baseline=19` on this commit**. Record the two numbers and do not fix it here; T026 records them again after the graph regeneration. Branch: `deepseekpi`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Scan guards, test first. Each pair leaves the tree red between its two tasks on purpose.

- [ ] T003 Add the symlinked private-skill indexing test (`.skilled/skills/system-skill-advisor/runtime/tests/skill-graph-db.vitest.ts`). Read the file and locate `describe('skill graph database indexing'`; add one `it` inside it: create a temp root, `writeGraphMetadata(skillRoot, 'alpha')`, make a second temp dir holding a `graph-metadata.json` with `skill_id: 'local-beta'`, `symlinkSync` that dir to `join(skillRoot, 'local-beta')`, call `indexSkillMetadata(skillRoot)`, and assert `getDb().prepare("SELECT id FROM skill_nodes WHERE id LIKE 'local-%'").all()` equals `[{ id: 'local-beta' }]`. Read the existing cases for the exact table, column and helper names before writing, and add `symlinkSync` to the `node:fs` import, which does not carry it today. Proof: `../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts` fails on the new test because the symlink is skipped. Branch: `deepseekpi`.
- [ ] T004 Let the graph scan follow a top-level `local-*` symlink (`.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts`, `entry.isDirectory()` at line 733 inside `discoverGraphMetadataFiles`, walk at 727-744). Add a module-level helper above `discoverGraphMetadataFiles`: `function isDirectoryTarget(targetPath: string): boolean { try { return statSync(targetPath).isDirectory(); } catch { return false; } }`. Then replace the bare `if (entry.isDirectory()) {` with:
  ```ts
  // Dirent.isDirectory() is false for a symlink, so a skill linked into the tree
  // would stay invisible to the index. A private skill is linked that way on
  // purpose, so resolve the link once, at the top level only.
  const linkedPrivateSkill = currentDir === skillDir
    && entry.name.startsWith('local-')
    && entry.isSymbolicLink()
    && isDirectoryTarget(entryPath);
  if (entry.isDirectory() || linkedPrivateSkill) {
  ```
  `statSync` is already imported. Proof: the T003 command passes with 10 passing. Branch: `deepseekpi`.
- [ ] T005 Add the private-skill source-signature test (`.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts`). Read the file and locate the `workspace(` helper and its `node:fs` import, which does not carry `symlinkSync` today; add that import. Add one `it` that builds a workspace, writes `.skilled/skills/local-beta/SKILL.md` into a separate temp dir with a `graph-metadata.json` beside it, `symlinkSync`s that dir to `join(root, '.skilled', 'skills', 'local-beta')`, then asserts `computeAdvisorSourceSignature(root)` changes after rewriting the linked `SKILL.md` with different content. Proof: `../../system-spec-kit/node_modules/.bin/vitest run tests/handlers/advisor-status.vitest.ts` fails on the new test because the symlink is never fingerprinted. Branch: `deepseekpi`.
- [ ] T006 Let the source signature follow a top-level `local-*` symlink (`.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts`, the `.filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))` at line 143 in `listSkillSlugs`). Add the same module-level `isDirectoryTarget` helper, then replace the filter with:
  ```ts
  .filter(entry => !entry.name.startsWith('.') && (entry.isDirectory()
    || (entry.name.startsWith('local-')
      && entry.isSymbolicLink()
      && isDirectoryTarget(join(skillRoot, entry.name)))))
  ```
  `statSync` and `join` are already imported. Proof: the T005 command passes. Branch: `deepseekpi`.
- [ ] T007 Add the compiler skip case (`.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`, `test_graph_compiler`, which starts at line 1620). Read the file and locate `def run_compiler(fixtures):`; add one case after the existing `T246-GC-*` cases that writes a `local-private` fixture alongside one valid skill through a new helper or by extending `run_compiler`, calls `compiler.discover_graph_metadata(tmpdir)` directly, and asserts the returned names are `["alpha"]` with `local-private` absent. Use the file's own `ok()` / `fail_test()` reporting, never bare asserts. Proof: `python3 tests/python/test_skill_advisor.py` reports the new case failing and `fail=1`. Branch: `deepseekpi`.
- [ ] T008 Skip private skills in the compiler's discovery loop (`.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py`, `for entry in sorted(os.listdir(skills_dir)):` at line 200 inside `discover_graph_metadata`). Insert immediately after the loop line:
  ```python
          # A private skill lives only in the operator's checkout, so compiling it
          # would write its signals into the tracked fallback graph.
          if entry.startswith("local-"):
              continue
  ```
  Proof: `python3 tests/python/test_skill_advisor.py` reports `fail=0`. Branch: `deepseekpi`.
- [ ] T009 Add the Hermes mirror test (`.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs`). Read the file and locate `function fixture()`; add one `test(...)` that builds the fixture, adds `local-webflow/SKILL.md` with valid frontmatter to `env.source`, runs the sync in write mode exactly as the existing tests do with their `run(env)` helper, and asserts the output matches `Wrote 4 of 4` and `existsSync(join(env.output, 'local-webflow'))` is false while the ordinary skills are still written. Before the change the same fixture writes five folders, so the count assertion is the failure. Proof: `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` fails on the new test with 5 tests, 1 failing. Branch: `deepseekpi`.
- [ ] T010 Skip a top-level private skill in the Hermes walk (`.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, `listSkillFiles` at 51-68, walk body at 55-60). Insert after `const absolute = path.join(current, entry.name);`:
  ```js
      // A private skill exists only in the operator's checkout; mirroring it would
      // commit its content into the tracked Hermes copy.
      if (current === directory && entry.name.startsWith('local-')) continue;
  ```
  Do not add a new parameter: `current === directory` is the top-level test. Proof: the T009 command passes with 5 passing. Branch: `deepseekpi`.
- [ ] T011 Add the root-discovery skip case (`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`). Read the file and locate `function makeRoot(skillsDir, skillId, files)`; add one `test` that builds a synthetic skills dir with a healthy root plus a `local-webflow` root, calls `gate.findSkillRoots(skillsDir)` and asserts the basenames equal `['alpha']` (name the healthy root `alpha`). Proof: `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` fails on the new case. Branch: `deepseekpi`.
- [ ] T012 Skip private skills in root discovery (`.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`, `findSkillRoots` filter at line 144). Add `&& !entry.name.startsWith('local-')` to the existing filter chain. A real folder and a symlink both stop being a fleet root; the fleet-conformance case in the same suite proves nothing else moved. Proof: the T011 command passes. Branch: `deepseekpi`.
- [ ] T013 Add the freshness-panel skip case (`.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts`). Read the file and locate `function writeSkill(`; add one `it` that builds a temp root with one healthy compiled skill plus `.skilled/skills/local-webflow/graph-metadata.json`, spawns the panel as the existing cases do, and asserts the report contains no `local-webflow` ghost, stale or missing row. Proof: `../../system-spec-kit/node_modules/.bin/vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts` fails on the new case. Branch: `deepseekpi`.
- [ ] T014 Skip private skills in the on-disk read (`.skilled/commands/doctor/scripts/skill-graph-freshness.cjs`, `fromDisk` loop at line 146 and `if (!entry.isDirectory()) continue;` at line 147). Insert after that line:
  ```js
      // A private skill is local-only, so it must not look like a node the tracked
      // graph is missing.
      if (entry.name.startsWith('local-')) continue;
  ```
  Proof: the T013 command passes. Branch: `deepseekpi`.
- [ ] T015 Delete the removed surface's hint token (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts`, comment at 37-38 and the `'obsidian plugin'` token on line 39). Remove the two comment lines that begin `// 'obsidian plugin' is the same mechanism used as intended:` and `// exact phrase and was losing it to a bare-token overlap by 0.004.`, and remove `, 'obsidian plugin'` from the end of the `'sk-code'` array. Leave every other token and comment untouched. Proof: `rg -n -i 'obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts` prints nothing, and `../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/lexical-candidate-dedup.vitest.ts tests/scorer/bm25-lexical-shadow.vitest.ts` reports 10 passing. Branch: `deepseekpi`.
- [ ] T016 Keep only the SKILLED workspace surface (`.opencode/plugins/system-skill-advisor.js`, `detectWorkspaceSurface`, comment at 722-725 and branches at 736-738). Delete the two `else if` branches (the `manifest.json`/`esbuild.config.mjs` OBSIDIAN branch and the `src/2_javascript`/`wrangler.toml` WEBFLOW branch), delete the now-unused `const manifestPath = join(real, 'manifest.json');` line, and rewrite the comment above to say only that the sk-code hub's own surface is detected and any other workspace sends no hint. Keep the SKILLED branch at 735, the cache, the `try`/`catch` and the `realpathSync` call. `existsSync`, `readFileSync`, `join` and `sep` stay imported because other functions use them. Proof: `rg -n 'OBSIDIAN|WEBFLOW' .opencode/plugins/system-skill-advisor.js` prints nothing and `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` reports 42 passing. Branch: `deepseekpi`.
- [ ] T017 Rename the fixture target in the plugin tests (`.opencode/plugins/tests/system-skill-advisor.test.cjs`, `'webflow'` inside the `compiledRouteSummary([...])` calls at lines 356, 377 and 403). Replace `'webflow'` with `'skilled'` in all three arrays and change nothing else; the `targets=quality,review,opencode,+2 more` expectation still holds because the target count is unchanged. Proof: `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` reports 42 passing. Branch: `deepseekpi`.
- [ ] T018 Delete the removed surface-detection rows (`.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts`, lines 700-702). Delete the three `it.each` rows for `'an Obsidian plugin'`, `'a Webflow project'` and `'a Cloudflare-deployed Webflow project'`; keep the `'a folder inside the hub'`, `'a .skilled folder outside the hub'` and `'a workspace with no surface markers'` rows and the rest of the test body. Proof: `../../system-spec-kit/node_modules/.bin/vitest run tests/system-skill-advisor-plugin.vitest.ts` reports 91 passing. Branch: `deepseekpi`.
- [ ] T019 Point the surface-hint test at a surface that still ships (`.skilled/skills/system-skill-advisor/runtime/tests/advisor-surface-hint.vitest.ts`, line 16). Change `const SURFACE_HINT = 'WEBFLOW';` to `const SURFACE_HINT = 'SKILLED';`. The comment above it about the prompt mapping to `sk-code` stays true, and the argv assertion reads `SURFACE_HINT` rather than a literal. Proof: `../../system-spec-kit/node_modules/.bin/vitest run tests/advisor-surface-hint.vitest.ts` reports 3 passing. Branch: `deepseekpi`.
- [ ] T020 Correct the CLI manifest description (`.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts`, line 58). In the `surfaceHint` description, change `such as WEBFLOW` to `such as SKILLED`. Change nothing else in the schema. Proof: `rg -n 'such as WEBFLOW' .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts` prints nothing. Branch: `deepseekpi`.
- [ ] T021 Correct the tool description (`.skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts`, line 24). Same one-word change: `such as WEBFLOW` becomes `such as SKILLED`. Proof: `rg -n 'such as WEBFLOW' .skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts` prints nothing. Branch: `deepseekpi`.
- [ ] T022 Correct the advisor README (`.skilled/skills/system-skill-advisor/README.md`). Read the file and locate the sentence containing `` such as `WEBFLOW` `` (line 117 on the base commit) and change the example to `` `SKILLED` ``; leave the length bound and the rest of the option list alone. Proof: `rg -n 'WEBFLOW' .skilled/skills/system-skill-advisor/README.md` prints nothing. Branch: `deepseekpi`.
- [ ] T023 Confirm the native-scorer prompt needs no edit (`.skilled/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts`, line 387). Read the file and locate `'implement a responsive webflow animation module'`; the assertion below it is `expect(result.topSkill).toBe('sk-code')`, which stays correct because the hub still owns frontend code. Make no edit. Proof: `sed -n '386,394p'` shows that assertion and `../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/native-scorer.vitest.ts` reports 22 passing. Record the confirmation in `implementation-summary.md`. Branch: `deepseekpi`.
- [ ] T024 Record the zero-hit surface-id re-check (no edit). Run `rg -n -i 'webflow|obsidian' .skilled/skills/system-skill-advisor/runtime/lib/scorer/aliases.ts .skilled/skills/system-skill-advisor/leaf-aliases.json .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json`. Proof: it prints nothing and exits 1. Record the command and the empty result in `implementation-summary.md`. Branch: `deepseekpi`.
- [ ] T025 Regenerate the tracked fallback graph (`.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`). Run `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --export-json` from the repository root. Review `git diff -- .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` and accept only removed sk-code surface signals plus the `generated_at` and `skill_count` lines; any other change means phase 2 has not landed, so stop and report. Proof: `node -e "const g=require('./.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json');console.log(JSON.stringify(g.signals['sk-code'].filter(x=>/webflow|obsidian/i.test(x))))"` prints `[]`, and `rg -c -i 'obsidian' .skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` still returns a non-zero count because the `mcp-tooling` signals keep their own Obsidian vocabulary, which D6 keeps. Branch: `deepseekpi`.
- [ ] T026 Re-run the ambiguity slice and record both numbers (no file). Run `../../system-spec-kit/node_modules/.bin/vitest run tests/scorer/ambiguity-slice.vitest.ts` and compare `live=` with the T002 number. It was already red at baseline (`live=17/24 baseline=19`); do not fix the gate in this phase. Proof: the run reports a `live=` value that is greater than or equal to the T002 value, and both numbers are written into `implementation-summary.md`. If the value dropped, stop and report it as a regression instead of completing the phase. Branch: `deepseekpi`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T027 Run the full sweep (no file). Re-run all ten green commands from T002 plus T026, then run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict`. Proof: every command matches its T002 expected count and the validator prints `RESULT: PASSED`. Branch: `deepseekpi`.
- [ ] T028 Independent review, read-only, at most two rounds (no file). Dispatch a separate DeepSeek session on branch `deepseekpi` with read-only access. It checks: every scan change is top-level only, every added comment states a durable reason and names no packet, phase or spec path, no tracked file in scope still names the removed surfaces, and each behavior change has a test that would fail without it. A finding is resolved in a follow-up task or recorded with its reason; two rounds without a new finding ends the review. Proof: the reviewer reports no unresolved finding, or every finding is recorded in `implementation-summary.md` with its disposition. Branch: `deepseekpi`.
- [ ] T029 Run the authoritative gate from the final state (no file). Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict`. Proof: the output contains `RESULT: PASSED`, read from the command's own output and not inferred from its exit status. Branch: `deepseekpi`.
- [ ] T030 Commit and push the phase (no file). Run this only after T029 passes. Stage the phase's files by name, never `git add -A`: the worktree also holds gitignored local state this phase must not publish. Include the code and test files, the regenerated `runtime/scripts/skill-graph.json` and the packet documents the phase updated. Commit with a prose body, then push `HEAD:main` and never a branch. Proof: `git status --porcelain` prints nothing, `git log --oneline -1` names the phase commit, and `git rev-parse HEAD` equals `git rev-parse origin/main` after the push. Branch: `deepseekpi`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 13 | [ ]/13 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-10-23
<!-- /ANCHOR:summary -->

---
