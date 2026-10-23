---
title: "Implementation Plan: Phase 3: advisor-vocabulary-cleanup"
description: "Strip the removed surfaces from the advisor's scorer, plugin and schemas, then make seven directory scans treat a top-level local-* entry by design: three follow a trusted link or read it, four skip the name."
trigger_phrases:
  - "advisor vocabulary cleanup plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: advisor-vocabulary-cleanup

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (advisor runtime, OpenCode plugin), Python 3 (graph compiler, advisor script), Node CJS (Hermes sync, CI gate, doctor panel) |
| **Framework** | None; the advisor runtime is plain TS on `node:fs`, tested by vitest, the plugin and the CJS scripts by `node:test` |
| **Storage** | SQLite `skill-graph.sqlite` (gitignored, local) plus the tracked fallback `runtime/scripts/skill-graph.json` |
| **Testing** | vitest, `node --test`, `python3` script-style suite |

### Overview
Two sweeps. The vocabulary sweep deletes the `WEBFLOW` / `OBSIDIAN` surface from the advisor scorer, the OpenCode plugin's workspace detection, both tool-schema descriptions, the advisor README and the tests that name them. The scan sweep then makes the name `local-` decisive at the top level of `.skilled/skills/`: the advisor graph scan, the source-signature scan and the Python conflict-declaration reader see a private skill, and the compiler, Hermes sync, CI root-metadata gate and doctor freshness panel skip the name outright. The two follow-scans share one containment helper, so a `local-*` link is followed only when its realpath resolves inside the skills root or a root named in `SPECKIT_PRIVATE_SKILL_ROOTS`. Each behavior change lands test-first, and the tracked fallback graph is regenerated only after the compiler already skips the name. A third, smaller sweep updates the `@code` and `@review` agents so an UNKNOWN route falls back to the advisor's top `local-*` pick, with the `.claude`, `.codex` and `.pi` mirrors kept in step.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] Every anchor read on the working tree at `583316d083`

### Definition of Done
- [ ] All acceptance criteria met, or waived against a decision record (AC-035 under ADR-008)
- [ ] Twelve green commands pass and the ambiguity slice is no lower than its baseline
- [ ] Independent review reports no unresolved finding
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
- [ ] HEAD equals `origin/main` with an empty `git status --porcelain`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered scan guards. One directory (`.skilled/skills/`) is read by seven consumers, and each consumer gets the rule its own artifact needs rather than a shared policy: a local advisor may see a private skill, a tracked artifact may not. The two TypeScript consumers that follow a link share one containment helper, the Python conflict reader includes the name, and the four consumers that write or gate a tracked artifact skip the name before any filesystem probe.

### Key Components
- **Containment helper** (`runtime/lib/private-skill-target.ts`): `isTrustedPrivateSkillLink(entryPath, skillsRoot)` resolves the link with `realpathSync`, requires a directory, and checks containment against the resolved skills root plus every path in `SPECKIT_PRIVATE_SKILL_ROOTS` (path-delimiter separated).
- **Advisor scorer and schemas**: `lexical.ts:37-39` hint token and its comment, `skill-advisor-cli-manifest.ts:58` and `advisor-recommend.ts:24` option descriptions, `README.md:117` option prose.
- **OpenCode plugin**: `detectWorkspaceSurface` at `system-skill-advisor.js:722-738` maps a workspace to a surface hint; only SKILLED survives.
- **Advisor graph scan** (`skill-graph-db.ts:719` `discoverGraphMetadataFiles`, `entry.isDirectory()` at line 733): recursive walk from the skills root.
- **Advisor source signature** (`freshness.ts:138` `listSkillSlugs`, filter at line 143): depth-1 slug list.
- **Python conflict-declaration reader** (`skill_advisor.py:1250` `_load_source_conflict_declarations`, `os.scandir` at line 1266): reads per-skill `conflicts_with` arrays for the runtime conflict penalty.
- **Tracked-artifact writers**: `skill_graph_compiler.py:184` `discover_graph_metadata` (loop at line 200), `sync-skills-hermes.cjs:51` `listSkillFiles` (walk body at 55-60), `ci-skill-root-metadata.cjs:131` `findSkillRoots` (filter at line 144), `skill-graph-freshness.cjs:139` `fromDisk` (loop at 146, condition at 147).
- **Screened non-consumer**: `ci-leaf-manifest-freshness.cjs:81` `findManifestDirs` (manifest check at line 103). Neither private source tree at `42b41dd286` carries a `leaf-manifest.json`, so the gate finds 14 fleet manifests and none under `local-*`.

### Data Flow
`readdirSync(skillsRoot, { withFileTypes: true })` yields a `Dirent`. For a symlink, `isDirectory()` is false and `isFile()` is false, so every one of these loops silently drops it today. The follow path asks `isTrustedPrivateSkillLink`, which calls `realpathSync` and `statSync` on a top-level entry named `local-*`; the resolved target must sit inside a trusted root. The skip path returns early on the name, so a real folder and a symlink are both excluded without a stat. The Python reader uses `os.scandir`, whose `is_dir()` follows a link, and writes only an in-memory map.

### Ordered Steps

| # | Tasks | File | Change |
|---|-------|------|--------|
| 1 | T001 | none | Build the local advisor database |
| 2 | T002 | none | Prove phase 2 removed both surface folders |
| 3 | T003-T015 | none | Capture twelve baselines and record them |
| 4 | T016-T017 | `runtime/lib/private-skill-target.ts` (new), `runtime/tests/private-skill-target.vitest.ts` (new) | Add the containment helper and its five cases |
| 5 | T018-T020 | `runtime/tests/skill-graph-db.vitest.ts`, `runtime/lib/skill-graph/skill-graph-db.ts:733` | Add linked-inside and linked-outside cases, then follow a trusted link |
| 6 | T021-T024 | `runtime/tests/handlers/advisor-status.vitest.ts`, `runtime/lib/freshness.ts:143` | Add three signature cases, then follow a trusted link |
| 7 | T025-T027 | `runtime/tests/python/test_skill_advisor.py`, `runtime/scripts/skill_graph_compiler.py:200` | Add real-folder and symlink cases, then skip `local-*` |
| 8 | T028-T030 | `runtime/cli/tests/sync-skills-hermes.test.mjs`, `runtime/cli/hermes/sync-skills-hermes.cjs:56` | Add real-folder and symlink cases, then skip a top-level entry |
| 9 | T031-T032 | `sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`, `sk-create-skill/scripts/ci-skill-root-metadata.cjs:144` | Add the synthetic private root, then skip the name |
| 10 | T033-T034 | `runtime/tests/doctor/skill-graph-freshness-panel.vitest.ts`, `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs:147` | Add the panel case, then skip the name |
| 11 | T035 | `runtime/tests/python/test_skill_advisor.py` | Pin the conflict reader's inclusion of `local-*` |
| 12 | T036 | `runtime/lib/scorer/lanes/lexical.ts:37-39` | Delete the comment and the `obsidian plugin` token |
| 13 | T037 | `.opencode/plugins/system-skill-advisor.js:722-738` | Keep only the SKILLED branch |
| 14 | T038 | `.opencode/plugins/tests/system-skill-advisor.test.cjs:356,377,403` | Rename the `webflow` fixture target |
| 15 | T039 | `runtime/tests/system-skill-advisor-plugin.vitest.ts:700-702` | Delete the three detection rows |
| 16 | T040 | `runtime/tests/advisor-surface-hint.vitest.ts:16` | `SURFACE_HINT = 'SKILLED'` |
| 17 | T041 | `runtime/skill-advisor-cli-manifest.ts:58` | Example becomes SKILLED |
| 18 | T042 | `runtime/tools/advisor-recommend.ts:24` | Same text |
| 19 | T043 | `README.md:117` | Same text |
| 20 | T044-T047 | none, then `implementation-summary.md` | Confirm the native-scorer assertion, run the aliases and leaf-manifest screens, record all three |
| 21 | T048-T050 | `runtime/scripts/skill-graph.json` | Regenerate the tracked fallback and inspect the diff |
| 22 | T051-T068 | none | Run the twelve green commands, the known-red ambiguity slice and the five closure checks |
| 23 | T069-T070 | `implementation-summary.md` | Record the red-first evidence and the final counts |
| 24 | T070a-T070c, T070d1-T070d2 | `.skilled/agents/code.md`, `.skilled/agents/review.md`, `.claude/agents/code.md`, `.claude/agents/review.md` | Add the advisor `local-*` fallback to @code and @review, keeping the Claude twins identical |
| 25 | T070e1-T070e3 | `.codex/agents/code.toml`, `.codex/agents/review.toml`, `.pi/agents/code.md`, `.pi/agents/review.md` | Regenerate the Codex and Pi mirrors, then run the four drift checks |
| 26 | T070f | `implementation-summary.md` | Record the deferred phase-004 routing probe and prove the insertion now |
| 27 | T071 | none | Strict validation |
| 28 | T072 | none | Independent review through the `subagent` tool, read-only, at most two rounds |
| 29 | T073 | none | Final strict validation |
| 30 | T074-T076 | none | Commit by name, push `HEAD:main`, confirm the final state |

Each step's proof command is the `Proof` field of its first task in `tasks.md`. The two closure commands are repeated here because they decide the phase:

```bash
bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict
git status --porcelain
git rev-parse HEAD
git rev-parse origin/main
```

Expected: `RESULT: PASSED`, then no output from `git status --porcelain`, then two identical commit hashes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | AC |
|---------|--------------|--------|----|
| `private-skill-target.ts` (new) | trusted-root resolver for a followed `local-*` link | create: realpath + directory + containment | AC-019 |
| `skill-graph-db.ts` graph scan | producer of the local advisor index | update: follow a trusted top-level `local-*` symlink | AC-002, AC-020 |
| `freshness.ts` source signature | producer of the advisor freshness hash | update: follow a trusted top-level `local-*` symlink | AC-004, AC-021 |
| `skill_advisor.py` `_load_source_conflict_declarations` | reader of per-skill conflict declarations for the runtime penalty | keep: include `local-*`, matching the local graph | AC-024 |
| `skill_advisor.py` `_load_source_graph_signal_map` | reader of per-skill intent signals for the local scorer | keep: include `local-*`; writes no tracked file | none: screened, no change |
| `skill_graph_compiler.py` discovery | producer of the tracked fallback graph | update: skip `local-*` before any probe | AC-006, AC-022 |
| `sync-skills-hermes.cjs` walk | producer of the tracked `.hermes/skills/` mirror | update: skip a top-level `local-*` entry | AC-007, AC-023 |
| `ci-skill-root-metadata.cjs` `findSkillRoots` | consumer that classifies every fleet root | update: skip `local-*` | AC-008 |
| `skill-graph-freshness.cjs` `fromDisk` | consumer that diffs disk against the tracked graph | update: skip `local-*` | AC-009 |
| `ci-leaf-manifest-freshness.cjs` `findManifestDirs` | consumer that regenerates every committed leaf manifest | no change: screened, neither private tree carries a manifest | AC-025 |
| `lexical.ts` hint table | producer of scorer hints | update: drop the `obsidian plugin` token | AC-001 |
| `.opencode/plugins/system-skill-advisor.js` `detectWorkspaceSurface` | producer of the surface hint | update: SKILLED only | AC-001 |
| `skill-advisor-cli-manifest.ts`, `advisor-recommend.ts`, advisor `README.md` | docs and schema descriptions of `surfaceHint` | update: example becomes SKILLED | AC-015 |
| `.skilled/agents/code.md`, `.skilled/agents/review.md` | agent route fallback when `sk-code` returns UNKNOWN | update: advisor top `local-*` pick as overlay, otherwise escalate or baseline | AC-030 to AC-032 |
| `.claude/agents/{code,review}.md`, `.codex/agents/{code,review}.toml`, `.pi/agents/{code,review}.md` | runtime copies of the agent bodies | hand-edit `.claude`; regenerate `.codex` and `.pi` | AC-033, AC-034 |
| `native-scorer.vitest.ts:387` | consumer asserting the hub still owns frontend prompts | unchanged | AC-016 |
| `runtime/data/trigger-index.json`, `runtime/cli/retrieval/fixtures/*.json` | generated retrieval data | not a consumer this phase edits | phase 5 |

Every zero check for these surfaces lives in `acceptance-criteria.md`, where each one has a positive control and a fenced command. The line-number checks are:

```bash
rg -n "isTrustedPrivateSkillLink" .skilled/skills/system-skill-advisor/runtime/lib/private-skill-target.ts
rg -n "entry.isDirectory\(\)" .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts
rg -n "entry.isDirectory\(\)" .skilled/skills/system-skill-advisor/runtime/lib/freshness.ts
rg -n "_load_source_conflict_declarations" .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py
rg -n "os.listdir\(skills_dir\)" .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py
rg -n "listSkillFiles" .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs
rg -n "findSkillRoots" .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
rg -n "fromDisk" .skilled/commands/doctor/scripts/skill-graph-freshness.cjs
```

Expected: the export in the helper, `733` in the graph scan, `143` in the signature, `1250` and `1266` in the Python reader, `200` in the compiler, `51` and `212` in the Hermes walk, `131` and `144` in the CI gate, and `139` and `263` in the doctor panel.

Required inventories:
- Same-class producers: `rg -n 'entry.isDirectory\(\)' .skilled/skills/system-skill-advisor/runtime/lib .skilled/commands/doctor/scripts` lists 14 Dirent filters; this phase touches the four at `skill-graph-db.ts:733`, `freshness.ts:143`, `skill-graph-freshness.cjs:147` and the CI gate's filter at `ci-skill-root-metadata.cjs:144`. The other ten read a different root or a nested directory and keep today's behavior.
- Same-class Python readers: `rg -n 'os\.scandir\(SKILLS_DIR\)' .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` lists lines 1211 and 1266. Both include a `local-*` entry by design; neither writes a tracked file. Line 1211 is screened as no change, line 1266 gains a characterization test.
- Consumers of changed symbols: `rg -n 'indexSkillMetadata|computeAdvisorSourceSignature|findSkillRoots|listSkillFiles|isTrustedPrivateSkillLink' . --glob '*.ts' --glob '*.cjs' --glob '*.mjs' --glob '*.py'` covers the call sites; no public signature changes, so no caller changes.
- Matrix axes: entry shape (real directory, symlink to a directory inside a trusted root, symlink to a directory outside every trusted root, symlink to a missing target, regular file) crossed with name (`local-*`, ordinary, dot-prefixed) crossed with depth (top level, nested). The required rows are the trusted top-level `local-*` symlink for the two follow-scans, the untrusted top-level `local-*` symlink for the containment rejection, and the top-level `local-*` directory for the four skip-scans; the remaining rows assert unchanged behavior.
- Algorithm invariant: the graph scan enters a symlink at most once and only from the root listing, so no cycle is reachable; containment is tested on the fully resolved realpath, so a link chain cannot escape; the skip condition is depth-1 only, so a nested `local-*` folder keeps today's behavior.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. The step table in §3 is the same order with the proof command attached to each file.

Five rules bind every step:

1. **Test first.** T018, T019, T021, T022, T023, T025, T026, T028, T029, T031 and T033 land a failing or characterizing test before the matching code step. A red tree between a pair is expected and confined; the phase is not closeable while any of them is red.
2. **Containment before following.** T017 creates the helper before T020 and T024 call it. No follow path may use a bare `statSync` check.
3. **Executor.** Every step is a code change, including the one-line option description in the advisor README that must land with the code it describes, so the orchestrator or the `code` / `markdown` subagents write it in one OpenCode 2 session. No dispatch kit or executor branch name is used.
4. **No ephemeral labels in code.** A comment added by this phase states the durable reason (a private skill lives only in the operator's checkout; a symlink is not a `Dirent` directory; a followed link must stay inside a trusted root) and never a packet, phase or spec path.
5. **Agent fallback before validation.** T070a to T070e3 land the fallback and regenerate the `.codex` and `.pi` mirrors before T071, so the strict validator and the commit certify the final agent text. T070f records a probe that waits for phase 004 and proves the insertion now.

**Commit and push last.** T074 to T076 run only after T051 to T073 pass: every suite green, the independent review closed, and `validate.sh --strict` printing `RESULT: PASSED`. Stage the files by name, commit, push `HEAD:main`, then confirm `git status --porcelain` is empty and `git rev-parse HEAD` equals `git rev-parse origin/main`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | containment helper, graph scan through a trusted and an untrusted link, source signature through both, compiler discovery, root discovery, panel disk read | vitest, `python3`, `node:test` |
| Integration | Hermes sync end to end against a fixture source tree with a real and a linked `local-*` skill; panel spawned against a throwaway repo root | `node --test`, vitest `spawnSync` |
| Characterization | Python conflict-declaration reader includes a `local-*` skill | `python3` script-style suite |
| Manual | none required; the advisor routing probe over a real private skill belongs to phase 5 | - |

Run from `.skilled/skills/system-skill-advisor/runtime` with `../../system-spec-kit/node_modules/.bin/vitest run tests/skill-graph-db.vitest.ts`; the CJS suites run from the repository root with `node --test .skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-hermes.test.mjs` or `node .skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-hub-surface-removal` | Internal | Red until merged | The regenerated fallback graph keeps the surfaces' signals and the plugin drops a hint the hub still declares |
| Local advisor database (`advisor_rebuild`) | Internal | Green once built | `advisor-surface-hint.vitest.ts` fails for a missing index, not for this phase's change |
| `SPECKIT_PRIVATE_SKILL_ROOTS` | Internal (optional) | Unset by default | An external repository linked into the tree is skipped; a real folder under `.skilled/skills/local-*` still works |
| CI trigger-index rebuild | Internal | Green after the push | `trigger-index.json` keeps 200 surface mentions until CI regenerates it; phase 5 proves it |
| `better-sqlite3` in the runtime `node_modules` | External | Green | The vitest suites that open a database cannot run |
| Agent fallback before T071 | Internal | Green once T070a to T070e3 land | An authoritative validator run before the agents name the fallback would certify a tree that still hard-stops on an unknown route |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scan change regresses a suite outside its pair, the regenerated graph drops more than the sk-code surface signals, or the phase commit fails the authoritative gate on `main`.
- **Procedure**: Revert the phase commit and delete the local runtime state it produced.

```bash
git log --oneline -1                       # record the phase commit sha
git revert --no-edit "$(git rev-parse HEAD)"   # restores every tracked file, including skill-graph.json
rm -f .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite \
      .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite-shm \
      .skilled/skills/system-skill-advisor/runtime/database/skill-graph.sqlite-wal
rm -f .skilled/skills/.state/advisor/skill-graph-generation.json
```

Every deleted path is gitignored local state, so the revert alone restores the repository; the two `rm` lines only stop a stale index from outliving the code that built it. If the revert conflicts because phase 4 already landed, revert the phase-3 commit alone with `git revert --no-commit "$(git log --grep='advisor vocabulary cleanup' --format=%H -1)"` and resolve toward phase 4's tree.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: build the local DB, prove phase 2, capture baselines) ──┐
                                                                       ├──► Phase 2 (Containment helper) ──► Phase 3 (Follow-scans) ──► Phase 4 (Skip-scans) ──► Phase 5 (Python reader) ──► Phase 6 (Vocabulary) ──► Phase 7 (Screens + regeneration) ──► Phase 8 (Verify + deliver)
Phase 1.5 (None: no config) ───────────────────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Containment helper, every later phase |
| Containment helper | Setup | Follow-scans |
| Follow-scans | Containment helper | Skip-scans, Verify |
| Skip-scans | Follow-scans | Python reader, Vocabulary |
| Python reader | Skip-scans | Verify |
| Vocabulary | Skip-scans | Screens, regeneration |
| Screens and regeneration | Vocabulary | Verify |
| Verify and deliver | Every earlier phase | None |

The helper lands before either follow-scan because both call it. The skip-scans land before the vocabulary sweep because the vocabulary sweep regenerates the tracked graph, and the compiler must already skip `local-*` when it runs.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Containment helper | Med | 45 minutes |
| Follow-scans | Med | 2 hours |
| Skip-scans | Med | 2 hours |
| Python reader | Low | 30 minutes |
| Vocabulary | Med | 1.5 hours |
| Screens and regeneration | Low | 45 minutes |
| Verify and deliver | Med | 2 hours |
| **Total** | | **10-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not applicable; no tracked data is migrated
- [ ] Feature flag configured - not applicable; the change is unconditional
- [x] Monitoring alerts set - the twelve green commands and `validate.sh --strict` are the monitor

### Rollback Procedure
1. Revert the phase commit; every tracked file returns to the phase-2 tree.
2. Delete the gitignored advisor database and generation stamp so no index outlives its code.
3. Re-run the twelve green commands and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/013-private-surface-skills/003-advisor-vocabulary-cleanup --strict`.
4. Notify nobody: the change is internal and ships no user-facing surface.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The only data is the gitignored local advisor index, rebuilt from disk on demand.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
private-skill-target.ts (containment)
        │
        ├──► skill-graph-db.ts graph scan ──► local advisor DB (gitignored)
        └──► freshness.ts source signature ──► advisor freshness state

skill_graph_compiler.py ──► tracked fallback graph ──► runtime/scripts/skill-graph.json
sync-skills-hermes.cjs ──► .hermes/skills mirror ──► tracked mirror (no local-*)
ci-skill-root-metadata.cjs ──► fleet root list ──► CI gate
skill-graph-freshness.cjs ──► on-disk diff ──► doctor report
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Containment helper | None | `isTrustedPrivateSkillLink` | Graph scan, source signature |
| Graph scan | Containment helper | SQLite `skill_nodes` row for a trusted link | Local advisor routing |
| Source signature | Containment helper | freshness hash that moves with a trusted link | Advisor status |
| Compiler skip | None | tracked `skill-graph.json` without `local-*` | Graph regeneration |
| Hermes skip | None | `.hermes/skills/` without `local-*` | Fresh-clone proof |
| CI root skip | None | fleet root list without `local-*` | CI gate |
| Doctor skip | None | on-disk diff without a `local-*` ghost | Doctor report |
| Vocabulary sweep | None | surface-free scorer, plugin, schemas and tests | Closure sweep |
| Regeneration | Compiler skip, phase 2 | surface-free tracked graph | Closure |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001-T002 - Setup gates** - 15 minutes - CRITICAL: without the local database and the phase-2 proof, every later result is ambiguous.
2. **T016-T017 - Containment helper** - 45 minutes - CRITICAL: both follow-scans call it.
3. **T018-T024 - Follow-scans** - 2 hours - CRITICAL: the local advisor cannot see a private skill until these land.
4. **T025-T034 - Skip-scans** - 2 hours - CRITICAL: the compiler must skip `local-*` before the graph regeneration.
5. **T035 - Python reader** - 30 minutes - CRITICAL: the seventh scan's treatment must be pinned.
6. **T036-T043 - Vocabulary sweep** - 1.5 hours - CRITICAL: the closure sweep depends on it.
7. **T044-T050 - Screens and regeneration** - 45 minutes - CRITICAL: the tracked graph is the artifact the handoff names.
8. **T070a-T070c, T070d1-T070d2, T070e1-T070e3, T070f - Agent fallback** - 45 minutes - CRITICAL: the agents must name the fallback before the authoritative validator and the commit.
9. **T051-T073 - Verify and review** - 2 hours - CRITICAL: no completion claim without it.
10. **T074-T076 - Delivery** - 15 minutes - CRITICAL: phase 4 starts from the pushed commit.

**Total Critical Path**: 10-11 hours

**Parallel Opportunities**:
- None. One writer executes the tasks in order, because every test pair reads the file the previous task wrote.
- The vocabulary tasks T036-T043 touch files the scan tasks never read, so a second writer could take them after T035; this packet uses one writer to keep the red-first record linear.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | T001-T015 pass and the baseline table is recorded | Phase 1 |
| M2 | Containment and follow-scans done | The helper suite passes 5, skill-graph-db 11, advisor-status 21 | Phase 2-3 |
| M3 | Skip-scans and Python reader done | Python 72, Hermes 6, CI gate green, panel 19 | Phase 4-5 |
| M4 | Vocabulary and graph regenerated | The surface sweep returns 3 lines and the sk-code filter returns `[]` | Phase 6-7 |
| M5 | Release ready | Twelve green commands, review clean, `RESULT: PASSED`, HEAD equals `origin/main` | Phase 8 |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Containment by realpath against trusted roots

**Status**: Accepted

**Context**: A top-level `local-*` symlink is how a private skill enters the advisor's tree. A bare `statSync(target).isDirectory()` proves the target is a directory, not that it belongs to the operator's private skills, so a link could point at any readable directory.

**Decision**: Resolve the link with `realpathSync`, require a directory, and accept it only when the realpath sits inside the resolved skills root or a path listed in `SPECKIT_PRIVATE_SKILL_ROOTS`.

**Consequences**:
- A link outside every trusted root is skipped, and the scan stays green.
- An external repository needs one environment variable; a real folder needs none.
- Every follow path shares one helper, so the rule cannot drift between the graph scan and the signature.

**Alternatives Rejected**:
- `statSync` directory check only: proves shape, not location; rejected by the research synthesis.
- Repo root only: rejects a legitimate private checkout outside the repo.
- `$HOME` as the trust boundary: too broad, and it trusts unrelated directories.

### ADR-002: Three scans include `local-*`, four exclude it

**Status**: Accepted

**Context**: One directory feeds both the local advisor and four tracked-artifact writers. A single policy cannot serve both: the advisor must see the private skill, and the tracked graph, Hermes mirror, CI gate and doctor report must not.

**Decision**: The graph scan, the source signature and the Python conflict-declaration reader include a `local-*` entry; the compiler, the Hermes sync, the CI root gate and the doctor panel skip it by name before any filesystem probe.

**Consequences**:
- The local advisor routes the private skill and the tracked artifacts stay clean.
- The Python reader is included because it returns an in-memory map and the graph it cross-checks already contains the private node.

**Alternatives Rejected**:
- Exclude everywhere: the private skill would never route, defeating phase 4.
- Include everywhere: a private skill would enter the tracked graph and the Hermes mirror.
- One shared policy with a caller flag: hides the decision at each call site and makes an accidental include a one-character change.

### ADR-003: Skip by name before any filesystem probe

**Status**: Accepted

**Context**: The compiler, the Hermes walk, the CI gate and the doctor panel each write or gate a tracked artifact. A `local-*` entry is local-only, so none of them may read it.

**Decision**: Each skip tests `entry.name.startsWith('local-')` before a `statSync`, `realpathSync`, `isfile` or content read, and the Hermes skip also requires the top-level directory.

**Consequences**:
- A real folder and a symlink are both excluded, and no private content is read.
- The rule is independent of the ignore rules, so it holds even on a checkout where `.gitignore` is bypassed.

**Alternatives Rejected**:
- Rely on `.gitignore`: ignore rules govern staging, not a filesystem walk.
- Resolve first, then skip: reads the target before deciding, which is the leak path.
- Filter at the output: the private bytes are already in memory and may already be mirrored.

### ADR-004: Screen `ci-leaf-manifest-freshness.cjs` instead of changing it

**Status**: Accepted

**Context**: The gate walks the skills tree for every committed `leaf-manifest.json`. The two private source trees at `42b41dd286` carry none, so the walk finds nothing under `local-*` even after phase 4 restores them.

**Decision**: Make no change. Record the screen with the command that proves 14 fleet manifests and zero in either private tree, and keep the gate as it is.

**Consequences**:
- One less file in a phase that already touches 31.
- If a future private skill adds a leaf manifest, the gate would see it; phase 5's fresh-clone proof is the backstop.

**Alternatives Rejected**:
- Add a `local-*` filter anyway: unproven need, and it hides a future manifest rather than reporting it.
- Change the generator: outside this phase's scope and no evidence requires it.

### ADR-005: Regenerate the tracked fallback graph, never hand-edit it

**Status**: Accepted

**Context**: `runtime/scripts/skill-graph.json` is generated from per-skill `graph-metadata.json`. Phase 2 removes the surface folders and their signals; a hand edit would be overwritten by the next regeneration.

**Decision**: Run `python3 .../skill_graph_compiler.py --export-json` after the compiler skip lands, and accept only removed sk-code surface signals plus `generated_at` and `skill_count`.

**Consequences**:
- The artifact matches what CI would produce from the same tree.
- A diff beyond those fields stops the phase and points at phase 2 or at the skip.

**Alternatives Rejected**:
- Hand-edit the JSON: not reproducible, and the next compile restores the signals.
- Skip regeneration: the tracked graph keeps the removed surfaces' trigger phrases.

### ADR-006: The Python conflict reader keeps `local-*`

**Status**: Accepted

**Context**: `_load_source_conflict_declarations` replays per-skill `conflicts_with` arrays so the runtime can refuse to penalize a non-declaring skill. The graph scan indexes a trusted `local-*` skill, so excluding its declarations would make the graph and the penalty disagree.

**Decision**: Keep the reader's inclusion, and add a characterization test that a `local-*` declaration is read. The reader writes no file.

**Consequences**:
- A private skill's declared conflicts apply to the operator's local routing, as intended.
- The test pins the treatment so a future filter is a visible decision.

**Alternatives Rejected**:
- Filter `local-*`: the private node exists in the graph but its declarations vanish, producing a false asymmetry.
- Leave it untested: the treatment would be an accident rather than a decision.

### ADR-007: A phase-4 external link requires `SPECKIT_PRIVATE_SKILL_ROOTS`

**Status**: Accepted

**Context**: Phase 4 uses a symlink per private skill to a `local-skills/` folder in an external repository: Obsidian in a public repository by operator choice, Webflow in a private one. Containment rejects a link that leaves the checkout unless the operator declares the target root.

**Decision**: Document the variable as an inter-phase constraint: phase 4 sets `SPECKIT_PRIVATE_SKILL_ROOTS` to both external `local-skills/` parents, joined with `:`, in every advisor process.

**Consequences**:
- The default is safe with no configuration.
- Phase 4 records the symlink mode and both roots; an external link without the variable stays invisible to the advisor.

**Alternatives Rejected**:
- Trust every link: defeats the containment decision.
- Hard-code the operator's private path: environment-specific and wrong on any other checkout.

### ADR-008: Agents fall back to an advisor-named `local-*` skill when `sk-code` returns UNKNOWN

**Status**: Accepted

**Context**: After phase 2 removes the surfaces and this phase removes their vocabulary, `sk-code` has no route for the anobel.com Webflow tree or the Obsidian Plugin tree. `.skilled/agents/code.md` hard-stops with `UNKNOWN_ROUTE` at step 3 and `.skilled/agents/review.md` reviews only the baseline minimums. The advisor can still name `local-webflow` or `local-obsidian` once phase 004 links them.

**Decision**: When `sk-code` returns UNKNOWN or ambiguous routing, `@code` and `@review` run `skill-advisor.cjs advisor_recommend` on the task text. A top pick whose `skillId` starts with `local-` becomes the standards overlay and is cited; any other pick keeps the existing behavior. The twelve UNKNOWN-route statements in `code.md` and the review route statement carry the qualifier. `.claude` is hand-edited, and `.codex` and `.pi` are regenerated.

**Consequences**:
- Webflow and Obsidian work routes to the private skill once phase 004 links it.
- A non-local pick cannot replace sk-code's route or silence the existing escalation.
- Five statements (four in `code.md`, one in `review.md`) and three mirror families stay in step.

**Alternatives Rejected**:
- Keep the hard stop: private work escalates even when the skill is present.
- Accept any advisor pick: an unrelated pick would replace the route.
- Hard-code surface names: reintroduces the retired vocabulary into tracked agent files.
