---
title: "Implementation Plan: Remove the unused nested spec changelog generator, templates and docs"
description: "Delete the deprecated nested changelog generator, its test, templates and docs across system-spec-kit and sk-create-changelog, then rebuild the CLI, the trigger index and the sk-doc guards and prove nothing else breaks."
trigger_phrases:
  - "remove nested changelog plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Remove the unused nested spec changelog generator, templates and docs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (system-spec-kit `runtime/cli`), Markdown and JSON docs, Python guards in sk-doc |
| **Framework** | None. `tsc --build` compiles to a gitignored `dist/` |
| **Storage** | None |
| **Testing** | vitest `cli` project, the `test:legacy` and `test:validation` scripts, sk-doc pytest guards, `validate.sh` |

Unknowns: none needs `/deep:research`. The deprecation packet `specs/system-speckit/spec-authoring-and-continuity/003-weak-model-spec-authoring/025-deprecate-nested-changelogs` already removed every caller. Four read-only explorers mapped the rest on 2026-11-15.

### Overview
The change deletes the generator, its test and its templates, and removes every row that points at them. It then rebuilds the CLI, the trigger index and the sk-doc README guards. Before deleting anything, take a baseline of the vitest `cli` project and the sk-doc guards. The change is done when the same suites pass with only the deleted test file missing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Baseline captured: `npx vitest run --config ../../vitest.config.ts --project cli` from `runtime/cli`, plus `test:legacy`, `test:validation` and the sk-doc pytest suite, with counts saved in `scratch/baseline.txt`

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The vitest `cli` project passes with the baseline counts minus the 13 tests in `nested-changelog.vitest.ts` (12 cases, one `it.each` runs twice), and `test:legacy`, `test:validation` and sk-doc pytest match the baseline
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: dead-code removal. Nothing is added.

### Key Components
- **`runtime/cli/spec-folder/nested-changelog.ts`**: the generator. It is deleted, and the barrel `spec-folder/index.ts` drops its three re-exports.
- **`templates/changelog/`**: read only by the generator through `CONFIG.TEMPLATE_DIR`. It is deleted.
- **Pointer rows**: router, leaf manifest, leaf aliases, spec-root registry, catalog, playbook, READMEs and sk-doc guards. Each row is removed or reworded.

### Data Flow
`dist/continuity/generate-context.js` loads `core/workflow.js`, which loads the `spec-folder` barrel, which loads the generator. After the change the barrel no longer imports it. Its two consumers import only `detectSpecFolder` and `ensureSpecFolderExists`, so the save path keeps working.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/spec-folder/index.ts` | Re-exports three generator symbols | update | CLI build passes |
| `core/workflow.ts:21`, `extractors/collect-session-data.ts:22` | Import the barrel for two other functions | not a consumer | vitest `cli` passes, including the `vi.mock` tests |
| `core/spec-root-registry.ts:78-84` | Lists the generator as a consumer | update, drop the row | `tests/spec-root-registry.vitest.ts` checks that every listed path exists |
| `retrieval/fixtures/residue-allowlist.json:84-87` | Allowlists the deleted test file | update, drop the row | `sweep-memory-residue` tests pass |
| `ROUTER.md`, `leaf-manifest.json`, `leaf-aliases.json` | Route to `references/workflows/nested-changelog.md` | update | `tests/card-sync.vitest.ts` runs the guard on the real files |
| Playbook scenario 458 and catalog entry | Document the generator | delete with index rows | `validate-playbook-package.cjs` link checks in both directions |
| sk-create-changelog CHG-012 | Tests the generator's search phrase | delete with its index block and section 12 rows | sk-create-changelog playbook validation |
| sk-doc `durable-directory-manifest.json`, `baseline-readme-verdicts.json` | List `templates/changelog` | regenerate or drop the entry | `test_readme_manifest.py`, `test_readme_verdict_parity.py` |
| Local `dist/spec-folder/nested-changelog.*` | Untracked build output | delete by hand | `evals/check-source-dist-alignment.ts` reports no orphan |
| `runtime/data/trigger-index.json` and retrieval fixtures | Index the deleted docs | rebuild | trigger-index vitest files pass |

Required inventories:
- Same-class producers: `rg -n -i 'nested.?changelog|templates/changelog' .skilled` before and after.
- Consumers of changed symbols: `rg -n 'buildNestedChangelogData|generateNestedChangelogMarkdown|writeNestedChangelog|NESTED_CHANGELOG_DEPRECATION' .skilled --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: N/A, nothing takes input.
- Algorithm invariant: N/A, no parser or path logic changes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup captures the baseline and the reference inventory. Implementation deletes the code, then the docs, then regenerates the derived files. Verification reruns the baseline suites and the REQ-001 search.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The vitest `cli` project, run as `npx vitest run --config ../../vitest.config.ts --project cli` from `runtime/cli`, before and after | vitest |
| Integration | `npm run test:legacy` and `npm run test:validation` in `runtime/cli`, sk-doc pytest under `.skilled/skills/sk-doc/scripts/tests`, `validate-playbook-package.cjs` on both playbooks | npm, pytest, node |
| Manual | Run `node runtime/cli/dist/continuity/generate-context.js --help` after the rebuild and confirm it prints usage | node |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `tsc` and vitest in the system-spec-kit workspace | Internal | Green | No build proof. The change would wait |
| `generate-trigger-index.mjs` | Internal | Green | A stale index points at deleted files |
| sk-doc `audit_readmes.py` with `--write` | Internal | Green | The README guards fail on the deleted directory |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a suite fails beyond the removed test, or a command turns out to call the generator.
- **Procedure**: before commit, `git -c core.fsmonitor=false checkout HEAD -- <paths>` and rebuild the CLI. After commit, revert the one commit and rebuild. A revert also restores the earlier sk-doc activation manifest hash. Check it with `node .skilled/bin/tests/compiled-route-manifest.test.cjs`, and re-mint the hash when the voice-rewrite commit stays in place.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation, because the baseline must exist before anything is deleted |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
