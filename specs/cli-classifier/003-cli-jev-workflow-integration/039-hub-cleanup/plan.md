---
title: "Implementation Plan: Phase 39: hub-cleanup"
description: "Make the cli-classifier hub say what it is, in seven phases: a read-only design pass over the 53 reference hits and the two generation tools, the `cli-usage` to `cli-jev` rename with the alias kept, the version continuation under `0.x`, the `cli-deem/manual-testing-playbook/` package, the artifact regeneration and four gates, a cross-family review, and closure. DeepSeek V4.1 Flash writes, MiMo v2.6 Pro reviews, and no call path changes."
trigger_phrases:
  - "cli classifier hub cleanup plan"
  - "cli usage to cli jev rename plan"
  - "pre-release version sweep plan"
  - "cli deem playbook plan"
  - "artifact regeneration plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 39: hub-cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON and Node scripts. No new dependency |
| **Framework** | sk-doc's manual-testing-playbook authoring and validators, and the compiled-routing and Hermes generators |
| **Storage** | None |
| **Testing** | The routing replay, the path and version greps, the playbook validator, the four artifact gates and `validate.sh --strict` |

### Overview

The operator asked why `cli-jev` was missing and found `cli-usage` and `cli-deem` instead, asked that every cli-classifier line stay pre-release, and asked for a Deem testing playbook. Nothing was dropped: `mode-registry.json` simply maps workflowMode `cli-jev` to the packet folder `cli-usage`, and the version fields read 1.x although nothing here is released. This plan renames the packet folder to `cli-jev` with `cli-usage` kept as a routing alias, continues every version field under `0.x` by the mapping in `scratch/context/context.md`, and adds a `cli-deem/manual-testing-playbook/` package whose scenarios run on stubs or a refused call. DeepSeek V4.1 Flash writes each batch, MiMo v2.6 Pro reviews every diff, and the session runs the proof commands and commits path-scoped (parent goal D5, this phase's D6).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The operator's ask is recorded: 2026-09-30, "its also missing cli-jev, I see cli-usage and cli-deem", "also all cli classifier skills nad modes should stay pre-release so 0.1 0.1.1 etc. dont reach v1.0.0.0" and "cli deem is also missing testing playbook", then the choices "Rename to cli-jev (Recommended)" and "Continue each line (Recommended)"
- [ ] `scratch/context/context.md` and `scratch/context/refs.txt` are present and read
- [ ] The 53 `refs.txt` paths are on disk at the phase's start HEAD, and the design pass has classified each one as a path or an alias
- [ ] The generation tools are present: the compiled-routing build at `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs`, the leaf-manifest generator at `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` and the Hermes sync at `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`
- [ ] The gates are present: `.skilled/bin/compiled-route-guard.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs` and the playbook validator at `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs`
- [ ] The executors are available under the parent D5 roster: DeepSeek V4.1 Flash to write, MiMo v2.6 Pro to review

### Definition of Done
- [ ] The five completion criteria in `goal.md` pass from the final state
- [ ] Every row of `acceptance-criteria.md` is `Met` with its observed command output, or left `Unmet` with the reason
- [ ] MiMo reviewed every DeepSeek diff and DeepSeek reviewed any MiMo fix, with no open P0 or P1 finding (parent D5)
- [ ] `cli-usage` still routes as an alias, and no live file outside `specs/` and benchmark reports carries the old path
- [ ] No version field in `.skilled/skills/cli-classifier/` reads `1.0.0.0` or above
- [ ] The four artifact gates and the playbook validator pass, `validate.sh --strict` prints `RESULT: PASSED`, `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`, and `goal.cjs packet` prints `packet_durable_chars` at or under 4000
- [ ] Only the files in `spec.md` section 3 changed, and no generated artifact was hand-edited
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A cleanup pass over one hub. Three bounded changes (rename, versions, playbook) plus regenerated artifacts, each closing on its own check. Nothing new is built beyond the Deem playbook package, and no call path moves.

### Key Components

- **Design note (phase 1)**: reads every `refs.txt` hit at the start HEAD and records one verdict per file, a path to repoint or an alias to keep. It also fixes the full version table from the version grep, outlines the Deem scenarios, and names each regeneration command. The note is the batch manifest for phases 2 to 5.
- **Rename and alias (phase 2)**: `git mv` the packet folder to `cli-jev`, set its frontmatter `name:`, repoint `mode-registry.json` `packet` and `packetSkillName`, `hub-router.json` resources and `dispatch-audit.mjs:46`, and repoint each live reference the design note marked as a path. `cli-usage` stays in the alias vocabulary and in the mode registry alias list.
- **Version sweep (phase 3)**: applies the design note's table to every version field in the hub, renames the six 1.x changelog files with `git mv`, retitles them and updates the links. The check is the version grep.
- **Deem playbook (phase 4)**: authors `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/` through sk-doc's sk-create-manual-testing-playbook mode, modelled on the Jev packet's playbook, covering the health-check gate, each judgment type and the dormant path, with stubs or a refused call only.
- **Regenerators (phase 5)**: the compiled-routing build, the leaf-manifest generator and the Hermes sync produce their artifacts from the edited tree. No artifact is hand-edited (goal D5).
- **Proof set (phases 2 to 5)**: the routing replay, the path and version greps, the playbook validator, the four artifact gates and `validate.sh --strict`.
- **Review loop (phase 6, parent D5)**: MiMo reviews every DeepSeek diff, DeepSeek reviews any MiMo fix, P0 and P1 findings close, P2 findings are recorded.

### Data Flow

`context.md` and `refs.txt` feed the design note. The note's path verdicts drive phase 2's edits, its version table drives phase 3 and its scenario outline drives phase 4. Phase 5 runs the generators from the edited tree, then the gates read the generated artifacts. Phase 6 reads the diffs only. Phase 7 records each result line in `goal.md`'s log and `acceptance-criteria.md`, refreshes the derived metadata with `repair-derived.cjs --apply` and closes.

### Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` | Maps workflowMode `cli-jev` to packet folder `cli-usage` at lines 60-61 and 76 | Both fields become `cli-jev`. The alias list keeps `cli-usage` | A `cli-usage` prompt routes to mode `cli-jev` |
| `hub-router.json` | Routes the `cli-usage-aliases` and `jev-dispatch` classes to `cli-usage/SKILL.md` at lines 19-20 | Resources become `cli-jev/SKILL.md`. The vocabulary at line 37 keeps `cli-usage` | The routing replay and the compiled-route guard pass |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Maps `jev noul\|choice\|score\|run` and `jev-mcp` to `packetPath: 'cli-classifier/cli-usage'` at line 46 | The path becomes `cli-classifier/cli-jev` | The two dispatch tests pass |
| The packet folder | `cli-usage/` with 23 playbook scenarios and the Jev SKILL.md at version `1.0.2.0` | `git mv` to `cli-jev/`, frontmatter `name: cli-jev`, version `0.1.2.0` | `cli-jev/SKILL.md` exists and `cli-usage/` does not |
| The version fields | 71 fields at or above `1.0.0.0` under `.skilled/skills/cli-classifier/` | Each takes the design note's continuation | The version grep finds nothing at or above `1.0.0.0` |
| The six 1.x changelogs | History under 1.x names | `git mv` to their 0.x names, retitled, links updated | The renamed files exist and the links resolve |
| `cli-deem/` | `changelog`, `feature-catalog`, `README.md`, `references`, `scripts` and `SKILL.md`, no playbook | Add `manual-testing-playbook/` | `validate-playbook-package.cjs` prints PASS |
| The compiled-routing artifacts | Built from a source map that names `cli-usage/SKILL.md` | The source map is repointed and the artifacts are rebuilt | `compiled-route-guard.cjs` passes |
| `leaf-manifest.json` | Names `cli-usage` once | Regenerated by the generator | `ci-leaf-manifest-freshness.cjs` passes |
| `.hermes/skills/cli-usage` | A generated Hermes copy | Regenerated as `cli-jev` by the sync | `sync-skills-hermes.cjs --check` prints its PASS line |
| Closed spec folders and benchmark reports | History that cites the old path | Unchanged | No closed folder and no benchmark report is in the diff |
| Jev and Deem call paths | `jev 0.6.2` and the Deem wire contract | Unchanged | No call-path file is in the diff |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The rename touches path handling and generated artifacts, so every producer and consumer of the old path is inventoried before the first edit.

- Same-class producers of the old path: `rg -n 'cli-classifier/cli-usage' --glob '!specs/**'` printed 13 paths at authoring: the compiled-routing build, `dispatch-audit.mjs` and its two tests, the hub changelog `v1.1.0.0.md`, the packet playbook's `dispatch-resolves-from-command.md`, the hub `graph-metadata.json`, two sk-doc test baselines, the deep-loop `fanout-merge.vitest.ts`, two spec-kit retrieval fixtures and the trigger index.
- Same-class producers of the alias word: `rg -n 'cli-usage' --glob '!specs/**'` printed 53 paths at authoring, listed in `refs.txt`. The design note classifies each one, because an alias word must stay and a path must move.
- Consumers of the changed routing inputs: `mode-registry.json`, `hub-router.json`, `leaf-manifest.json`, the compiled-routing build, the compiled-route guard and the Hermes sync. Each is either edited or regenerated, never both.
- Consumers of the version fields: the mode registry, the hub router, the skill docs, the feature catalogs and the playbooks. The version grep is the single check over all of them.
- Consumers of the changelog names: the hub `SKILL.md:158` link, the cli-deem `README.md:150` link and the hub README's table at lines 86-88. Each link is updated in the same step as its `git mv`.
- Matrix axes: three changes (rename, versions, playbook), two executors (write and review), and two artifact classes (regenerated routing and regenerated Hermes copies). The required totals are the authoring baselines: 53 reference hits, 71 version fields, 13 full-path hits and one missing playbook package.
- Algorithm invariant: a rename preserves every byte of the moved files except the repointed lines, and an alias keeps the routing answer unchanged. The routing replay and the byte-level diff are the adversarial cases. The playbook runs no model call, so a served-model dependency cannot appear.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the task checkboxes and state. The seven phases below are the plan of record.

**Who builds (parent goal D5, this phase's D6).** DeepSeek V4.1 Flash writes every batch, dispatched by Bash through the external orchestration route. MiMo v2.6 Pro reviews every DeepSeek diff, and DeepSeek reviews any MiMo fix. No Claude worker writes or reviews. The session runs the proof commands, records the results and commits path-scoped. P0 and P1 findings are fixed and rechecked, P2 findings are recorded.

Each phase's observable check:

1. **Design.** Read every file in `refs.txt` at the start HEAD and classify each `cli-usage` hit as a path to repoint or an alias to keep. Read the compiled-routing build and the Hermes sync. Fix the version table from the version grep, naming the source line and the target for every field. Outline the Deem scenarios. Write the note under `scratch/` (proposed: `scratch/design/notes.md` and `scratch/design/version-table.md`). Check: the note lists all 53 paths with a verdict, the table covers every version field the grep reads, the scenario outline names the health-check gate, each judgment type and the dormant path, and the read-only sources are unchanged.
2. **Rename and repoint.** `git mv` the packet folder to `cli-jev`, set its frontmatter `name:`, repoint `mode-registry.json` lines 60-61 and 76, `hub-router.json` lines 19-20, `dispatch-audit.mjs:46` and the routing build's source map at lines 66-70, then repoint each live reference the design note marked as a path, including the 038 Planned docs. Keep `cli-usage` in the alias vocabulary and the mode registry alias list. Check: `cli-jev/SKILL.md` exists, `cli-usage/` does not, the routing replay answers mode `cli-jev` for a `cli-usage` prompt, and the path grep prints nothing outside `specs/` and benchmark reports once phase 5 has regenerated the artifacts.
3. **Versions.** Apply the design note's table to every version field in the hub, `git mv` the six 1.x changelog files to their 0.x names, retitle them and update the links that point at them. Check: the version grep over `.skilled/skills/cli-classifier/` finds no value at or above `1.0.0.0`, the renamed changelog files exist and every link resolves.
4. **Deem playbook.** Author `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/` through sk-doc's sk-create-manual-testing-playbook mode, modelled on the Jev packet's playbook, covering the health-check gate, each judgment type and the dormant path. Check: `validate-playbook-package.cjs --package .skilled/skills/cli-classifier/cli-deem/manual-testing-playbook` prints status PASS, and no scenario needs a served model.
5. **Regenerate and gate.** Run the compiled-routing build, the leaf-manifest generator and the Hermes sync from the edited tree. Run `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `parent-skill-check.cjs .skilled/skills/cli-classifier` and `sync-skills-hermes.cjs --check`. Check: each gate prints its own PASS line or exits 0, the path grep prints nothing outside `specs/` and benchmark reports, and `validate.sh --strict` prints `RESULT: PASSED` for this phase.
6. **Cross-family review.** MiMo reviews every DeepSeek diff read-only, and DeepSeek reviews any MiMo fix. Check: one review file with a verdict, every P0 and P1 finding named with file and line, each review's file hashes equal before and after, and P2 findings are recorded.
7. **Closure.** The session runs the five proof commands from the final state, records each result line in `goal.md`'s log and `acceptance-criteria.md`, ticks each criterion from its evidence, rewrites `implementation-summary.md` with the results, and refreshes the derived metadata with `repair-derived.cjs --apply`. Check: the five criteria in `goal.md` pass from the final state, `check-goal.cjs` prints `RESULT: PASSED (5/5 checks)`, `goal.cjs packet` prints `packet_durable_chars` at or under 4000, and the commit is path-scoped.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Routing | The `cli-usage` alias and the renamed packet folder | The routing replay the design pass fixes, plus `compiled-route-guard.cjs` |
| Static | The old path outside `specs/` and benchmark reports, and every cli-classifier version field | `rg` for `cli-classifier/cli-usage`, `rg` for version fields at or above `1.0.0.0` |
| Doc gates | The new Deem playbook package, the changed skill docs and this phase folder | `validate-playbook-package.cjs`, `validate.sh --strict` |
| Artifact gates | The compiled-routing artifacts, the leaf manifest and the Hermes copies | `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `sync-skills-hermes.cjs --check` |
| Manual | Read each `refs.txt` hit before its edit, and read each staged diff for an alias turned into a path or a version line missed | Terminal, `git diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `scratch/context/context.md` and `scratch/context/refs.txt` | Internal | Read at authoring | No classification of the 53 hits and no version mapping |
| The compiled-routing build and the Hermes sync | Internal | Present in the tree | No regeneration, so the artifacts stay stale |
| The leaf-manifest generator | Internal | Present in sk-doc | The freshness gate fails |
| The playbook validator and the four artifact gates | Internal | Present in the tree | No proof that the package and the artifacts are fresh |
| DeepSeek V4.1 Flash and MiMo v2.6 Pro | External, dispatched by Bash | Under the parent D5 roster | A batch waits or the phase reports the blocker |
| Phase 038's Planned docs | Internal, the same packet | Planned, and this phase runs first | 038's build would read a folder that no longer exists, so the repoint covers them |
| The parent spec's phase-map handoff rows for 038 and 039 | Internal | Not edited here | No impact on this phase's criteria |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate fails, a version field stays at or above `1.0.0.0`, the routing replay answers the old packet name, an artifact shows hand-edit drift, or a file outside the named scope changed.
- **Procedure**: Stop the batch. Revert the phase's path-scoped commit with `git revert` on that commit only. The rename reverses with `git mv`, the version sweep and the changelog renames reverse in the same revert, and the generators rerun from the reverted tree. No data migration and no call-path change is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Design) ──► Phase 2 (Rename) ──► Phase 3 (Versions) ──► Phase 4 (Playbook) ──► Phase 5 (Gates) ──► Phase 6 (Review) ──► Phase 7 (Closure)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1. Design | `context.md` and `refs.txt`, read at the start HEAD | Phases 2, 3, 4 |
| 2. Rename and repoint | Phase 1's path verdicts | Phase 3, Phase 5 |
| 3. Versions | Phase 1's version table | Phase 5 |
| 4. Deem playbook | Phase 1's scenario outline | Phase 5 |
| 5. Regenerate and gate | Phases 2, 3 and 4 | Phase 6 |
| 6. Cross-family review | Phases 2 to 5 | Phase 7 |
| 7. Closure | Phase 6 and the five proof commands | Nothing |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1. Design | Med | One read-only pass over 53 files and the two generation tools |
| 2. Rename and repoint | Med | One `git mv` plus the live reference edits |
| 3. Versions | Med | The version table, six changelog renames and their links |
| 4. Deem playbook | Med | One playbook package through sk-doc |
| 5. Regenerate and gate | Low | Three regenerators and four gates |
| 6. Cross-family review | Med | One review round plus one fix round |
| 7. Closure | Low | The five proof commands and the phase docs |
| **Total** | | The seven phases above |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Start HEAD recorded, and the 53 `refs.txt` paths exist at it
- [ ] The path grep and the version grep baselines recorded (13 paths and 71 fields at authoring)
- [ ] Each regeneration command fixed by the design pass
- [ ] The playbook validator's baseline recorded (exit 2, package does not resolve)

### Rollback Procedure
1. Stop the batch at its failing check.
2. Revert the batch's path-scoped commit with `git revert`, paths only.
3. Rerun the generators, then the batch's check and the authoring baselines.
4. Record the revert and the reason in `goal.md`'s log.

### Data Reversal
- **Has data migrations?** No. The changes are paths, versions, docs and generated artifacts.
- **Reversal procedure**: Not applicable. A `git revert` of the path-scoped commit restores the old folder name, the version fields and the changelogs, and the generators rerun from the reverted tree.
<!-- /ANCHOR:enhanced-rollback -->

---
