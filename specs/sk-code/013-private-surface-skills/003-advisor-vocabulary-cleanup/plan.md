---
title: "Implementation Plan: Phase 3: advisor-vocabulary-cleanup"
description: "Strip the removed surfaces from the advisor's scorer, plugin and schemas, then make six directory scans treat a top-level local-* entry by design: two follow a symlink, four skip the name."
trigger_phrases:
  - "advisor vocabulary cleanup plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: advisor-vocabulary-cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor runtime, OpenCode plugin), Python 3 (graph compiler), Node CJS (Hermes sync, CI gate, doctor panel) |
| **Framework** | None; the advisor runtime is plain TS on `node:fs`, tested by vitest, the plugin and the CJS scripts by `node:test` |
| **Storage** | SQLite `skill-graph.sqlite` (gitignored, local) plus the tracked fallback `runtime/scripts/skill-graph.json` |
| **Testing** | vitest, `node --test`, `python3` script-style suite |

### Overview
Two sweeps. The vocabulary sweep deletes the `WEBFLOW` / `OBSIDIAN` surface from the advisor scorer, the OpenCode plugin's workspace detection, both tool-schema descriptions, the advisor README and the tests that name them. The scan sweep then makes the name `local-` decisive at the top level of `.skilled/skills/`: the advisor graph scan and the source-signature scan follow a `local-*` symlink that resolves to a directory, and the compiler, Hermes sync, CI root-metadata gate and doctor freshness panel skip the name outright. Each behavior change lands test-first.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered scan guards. One directory (`.skilled/skills/`) is read by six consumers, and each consumer gets the rule its own artifact needs rather than a shared helper: a local advisor may see a private skill, a tracked artifact may not.

### Key Components
- **Advisor scorer and schemas**: `lexical.ts` hint tokens, `skill-advisor-cli-manifest.ts` and `advisor-recommend.ts` option descriptions, `README.md` option prose.
- **OpenCode plugin**: `detectWorkspaceSurface` maps a workspace to a surface hint; only SKILLED survives.
- **Advisor graph scan** (`skill-graph-db.ts:727-744`): recursive walk from the skills root, `entry.isDirectory()` at line 733.
- **Advisor source signature** (`freshness.ts:138-146`): depth-1 slug list, `entry.isDirectory()` at line 143.
- **Tracked-artifact writers**: `skill_graph_compiler.py:200` (`--export-json` into the tracked fallback), `sync-skills-hermes.cjs:51-68` (mirror into `.hermes/skills/`), `ci-skill-root-metadata.cjs:143` (`findSkillRoots`), `skill-graph-freshness.cjs:146-148` (on-disk read).

### Data Flow
`readdirSync(skillsRoot, { withFileTypes: true })` yields a `Dirent`. For a symlink, `isDirectory()` is false and `isFile()` is false, so every one of these loops silently drops it today. The D4 change asks `statSync(entryPath).isDirectory()` for a top-level entry named `local-*`, which follows the link. The D5 change returns early on the name, so a real folder and a symlink are both excluded without a stat.

### Ordered Steps

| # | File and anchor | Change | Proof command |
|---|-----------------|--------|---------------|
| 1 | none | Build the local advisor database | `node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true --format text` prints `advisor_rebuild: rebuilt` |
| 2 | none | Capture the green baseline of the ten green suites and record the known-red ambiguity slice | the eleven commands in `tasks.md` T002: ten exit 0 and the eleventh reports `live=17/24 baseline=19` |
| 3 | `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph-db.vitest.ts` | Add the symlinked `local-*` indexing test | `vitest run tests/skill-graph-db.vitest.ts` fails on the new test |
| 4 | `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts:733` | Accept a top-level `local-*` symlink | the same command passes |
| 5 | `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | Add the `local-*` source-signature test | `vitest run tests/handlers/advisor-status.vitest.ts` fails on the new test |
| 6 | `.skilled/skills/system-skill-advisor/runtime/lib/freshness.ts:143` | Accept a top-level `local-*` symlink | the same command passes |
| 7 | `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py` | Add the compiler `local-*` skip case | `python3 tests/python/test_skill_advisor.py` reports the new case failing |
| 8 | `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:200` | Skip `local-*` in the discovery loop | the same command reports `pass=` with `fail=0` |
| 9 | `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` | Add the `local-*` mirror test | `node --test .../sync-skills-hermes.test.mjs` fails on the new test |
| 10 | `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs:55-60` | Skip a top-level `local-*` entry | the same command passes |
| 11 | `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs` | Add the `local-*` root-discovery case | `node .../skill-root-metadata-contract.test.cjs` fails on the new case |
| 12 | `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs:144` | Skip `local-*` in `findSkillRoots` | the same command passes |
| 13 | `.skilled/skills/system-skill-advisor/runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts` | Add the `local-*` panel case | `vitest run tests/doctor/skill-graph-freshness-panel.vitest.ts` fails on the new case |
| 14 | `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs:146-147` | Skip `local-*` in the on-disk read | the same command passes |
| 15 | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:37-39` | Delete the comment and the `obsidian plugin` token | `rg -n 'obsidian plugin' .../lanes/lexical.ts` prints nothing |
| 16 | `.opencode/plugins/system-skill-advisor.js:736-738` | Keep only the SKILLED branch | `rg -n "OBSIDIAN\|WEBFLOW" .opencode/plugins/system-skill-advisor.js` prints nothing |
| 17 | `.opencode/plugins/tests/system-skill-advisor.test.cjs:356,377,403` | Rename the `webflow` fixture target | `node --test .opencode/plugins/tests/system-skill-advisor.test.cjs` reports 42 passing |
| 18 | `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts:700-702` | Delete the three detection rows | `vitest run tests/system-skill-advisor-plugin.vitest.ts` reports 91 passing |
| 19 | `.skilled/skills/system-skill-advisor/runtime/tests/advisor-surface-hint.vitest.ts:16` | `SURFACE_HINT = 'SKILLED'` | `vitest run tests/advisor-surface-hint.vitest.ts` reports 3 passing |
| 20 | `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:58` | Example becomes SKILLED | `rg -n 'such as WEBFLOW'` prints nothing for the file |
| 21 | `.skilled/skills/system-skill-advisor/runtime/tools/advisor-recommend.ts:24` | Same text | the same command |
| 22 | `.skilled/skills/system-skill-advisor/README.md`, sentence containing `` `WEBFLOW` `` | Same text | `rg -n 'such as `WEBFLOW`' .skilled/skills/system-skill-advisor/README.md` prints nothing |
| 23 | `.skilled/skills/system-skill-advisor/runtime/tests/scorer/native-scorer.vitest.ts:387` | No edit; confirm the assertion is `toBe('sk-code')` | `sed -n '386,394p'` shows the assertion; `vitest run tests/scorer/native-scorer.vitest.ts` passes |
| 24 | `aliases.ts`, `leaf-aliases.json`, `scorer-calibration-baseline.json` | No edit; record the zero-hit re-check | `rg -n -i 'webflow\|obsidian'` over the three paths prints nothing |
| 25 | `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Regenerate the tracked fallback | `python3 .../skill_graph_compiler.py --export-json` then the sk-code signal grep prints nothing |
| 26 | none | Full sweep and packet validation | the ten green suites plus `validate.sh --strict` |
| 27 | none | Independent review, read-only, at most 2 rounds | the reviewer reports no unresolved finding |
| 28 | none | Final validation | `validate.sh --strict` prints `RESULT: PASSED` |
| 29 | none | Commit and push the phase on `deepseekpi`, staging files by name, then `HEAD:main` | `git status --porcelain` prints nothing and `git rev-parse HEAD` equals `git rev-parse origin/main` |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `skill-graph-db.ts` graph scan | producer of the local advisor index | update: follow a top-level `local-*` symlink | `rg -n "entry.isDirectory()" .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` names line 733; the new vitest case proves the symlink is indexed |
| `freshness.ts` source signature | producer of the advisor freshness hash | update: follow a top-level `local-*` symlink | `rg -n "entry.isDirectory()" .../lib/freshness.ts` names line 143; the advisor-status case proves the signature moves with the target |
| `skill_graph_compiler.py` discovery | producer of the tracked fallback graph | update: skip `local-*` | `rg -n "os.listdir(skills_dir)" .../scripts/skill_graph_compiler.py` names line 200; the Python case proves the entry is absent |
| `sync-skills-hermes.cjs` walk | producer of the tracked `.hermes/skills/` mirror | update: skip a top-level `local-*` entry | `rg -n "listSkillFiles" .../sync-skills-hermes.cjs` names lines 51 and 212; the node:test case proves no folder is written |
| `ci-skill-root-metadata.cjs` `findSkillRoots` | consumer that classifies every fleet root | update: skip `local-*` | `rg -n "findSkillRoots" .../ci-skill-root-metadata.cjs` names line 131; the contract test proves the entry is not a root |
| `skill-graph-freshness.cjs` `fromDisk` | consumer that diffs disk against the tracked graph | update: skip `local-*` | `rg -n "fromDisk" .skilled/commands/doctor/scripts/skill-graph-freshness.cjs` names lines 139 and 263; the panel case proves no ghost finding |
| `lexical.ts` hint table | producer of scorer hints | update: drop the `obsidian plugin` token | `rg -n -i "obsidian" .../lanes/lexical.ts` prints nothing |
| `.opencode/plugins/system-skill-advisor.js` `detectWorkspaceSurface` | producer of the surface hint | update: SKILLED only | `rg -n "detectWorkspaceSurface" .opencode/plugins/system-skill-advisor.js` names the function; the plugin suite stays green |
| `skill-advisor-cli-manifest.ts`, `advisor-recommend.ts`, advisor `README.md` | docs and schema descriptions of `surfaceHint` | update: example becomes SKILLED | `rg -n -i "webflow"` over the three files prints nothing |
| `native-scorer.vitest.ts:387` | consumer asserting the hub still owns frontend prompts | unchanged | the assertion is `expect(result.topSkill).toBe('sk-code')` and the suite passes |
| `runtime/data/trigger-index.json`, `runtime/cli/retrieval/fixtures/*.json` | generated retrieval data | not a consumer this phase edits | regenerated by CI after the push; `grep -c` proof belongs to phase 5 |

Required inventories:
- Same-class producers: `rg -n 'entry.isDirectory\(\)' .skilled/skills/system-skill-advisor/runtime/lib .skilled/commands/doctor/scripts` lists the three Dirent filters this phase touches; `rg -n 'os.listdir\(' .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py` lists the compiler's single listing.
- Consumers of changed symbols: `rg -n 'indexSkillMetadata|computeAdvisorSourceSignature|findSkillRoots|listSkillFiles' . --glob '*.ts' --glob '*.cjs' --glob '*.mjs' --glob '*.py'` covers the six call sites; no public signature changes, so no caller changes.
- Matrix axes: entry shape (real directory, symlink to directory, symlink to missing target, regular file) crossed with name (`local-*`, ordinary, dot-prefixed) crossed with depth (top level, nested). The required rows are the top-level `local-*` symlink for the two follow-scans and the top-level `local-*` directory for the four skip-scans; the remaining rows assert unchanged behavior.
- Algorithm invariant: the graph scan enters a symlink at most once and only from the root listing, so no cycle is reachable; the skip condition is depth-1 only, so a nested `local-*` folder keeps today's behavior.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The step table in §3 is the same order with the proof command attached to each file.

Three rules bind every step:

1. **Test first.** Steps 3, 5, 7, 9, 11 and 13 land a failing test before the matching code step. A red tree between a pair is expected and confined; the phase is not closeable while any of them is red.
2. **Branch.** Every step is a code change, including the one-line option description in the advisor README that must land with the code it describes, so every writer task runs on `deepseekpi`. `deepseekpihigh` is not used in this phase.
3. **No ephemeral labels in code.** A comment added by this phase states the durable reason (a private skill lives only in the operator's checkout; a symlink is not a `Dirent` directory) and never a packet, phase or spec path.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | graph scan through a symlink, source signature through a symlink, compiler discovery, root discovery, panel disk read | vitest, `python3`, `node:test` |
| Integration | Hermes sync end to end against a fixture source tree; panel spawned against a throwaway repo root | `node --test`, vitest `spawnSync` |
| Manual | none required; the advisor routing probe over a real private skill belongs to phase 5 | - |

Run from `.skilled/skills/system-skill-advisor/runtime` with `../../system-spec-kit/node_modules/.bin/vitest run <file>`; the CJS suites run from the repository root with `node --test <file>` or `node <file>`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-hub-surface-removal` | Internal | Red until merged | The regenerated fallback graph keeps the surfaces' signals and the plugin drops a hint the hub still declares |
| Local advisor database (`advisor_rebuild`) | Internal | Green once built | `advisor-surface-hint.vitest.ts` fails for a missing index, not for this phase's change |
| CI trigger-index rebuild | Internal | Green after the push | `trigger-index.json` keeps 200 surface mentions until CI regenerates it; phase 5 proves it |
| `better-sqlite3` in the runtime `node_modules` | External | Green | The vitest suites that open a database cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scan change regresses a suite outside its pair, the regenerated graph drops more than the sk-code surface signals, or the phase commit fails the authoritative gate on `main`.
- **Procedure**: Revert the phase commit and delete the local runtime state it produced.

```bash
git log --oneline -1                       # record the phase commit sha
git revert --no-edit <phase-commit-sha>    # restores every tracked file, including skill-graph.json
rm -f .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite \
      .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite-shm \
      .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite-wal
rm -f .skilled/skills/.state/advisor/skill-graph-generation.json
```

Every deleted path is gitignored local state, so the revert alone restores the repository; the two `rm` lines only stop a stale index from outliving the code that built it. If the revert conflicts because phase 4 already landed, revert the phase-3 commit alone with `git revert --no-commit <sha>` and resolve toward phase 4's tree.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: build the local DB, capture baseline) ──┐
                                                        ├──► Phase 2 (Scan guards) ──► Phase 3 (Vocabulary + regeneration) ──► Phase 4 (Verify)
Phase 1.5 (None: no config) ────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Scan guards, Vocabulary |
| Scan guards | Setup | Vocabulary, Verify |
| Vocabulary | Setup, Scan guards | Verify |
| Verify | Vocabulary | None |

The scan guards land before the vocabulary sweep because the vocabulary sweep regenerates the tracked graph, and the compiler must already skip `local-*` when it runs.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 15 minutes |
| Scan guards | Med | 3-4 hours |
| Vocabulary and regeneration | Med | 2-3 hours |
| Verification | Low | 1 hour |
| **Total** | | **7-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not applicable; no tracked data is migrated
- [ ] Feature flag configured - not applicable; the change is unconditional
- [x] Monitoring alerts set - the ten green suites and `validate.sh --strict` are the monitor

### Rollback Procedure
1. Revert the phase commit; every tracked file returns to the phase-2 tree.
2. Delete the gitignored advisor database and generation stamp so no index outlives its code.
3. Re-run the ten green suites and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict`.
4. Notify nobody: the change is internal and ships no user-facing surface.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The only data is the gitignored local advisor index, rebuilt from disk on demand.
<!-- /ANCHOR:enhanced-rollback -->

---
