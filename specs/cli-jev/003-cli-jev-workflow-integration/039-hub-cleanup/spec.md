---
title: "Feature Specification: Phase 39: hub-cleanup"
description: "The cli-classifier hub names its Jev packet folder `cli-usage` although the mode is `cli-jev`, version fields across the hub still read 1.x although nothing here is released, and `cli-deem` has no testing playbook while the Jev packet has one. This phase renames the folder with `cli-usage` kept as a routing alias, continues every version field under `0.x` by the mapping in `scratch/context/context.md`, and adds a `cli-deem/manual-testing-playbook/` package whose scenarios run on stubs or a refused call. Paths, versions and generated artifacts only, with no change to how Jev or Deem is called."
trigger_phrases:
  - "cli classifier hub cleanup"
  - "rename cli usage to cli jev"
  - "cli classifier pre-release versions"
  - "cli deem testing playbook"
  - "jev packet folder rename"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 39: hub-cleanup

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-30 |
| **Branch** | `worktrees/071-cli-jev-sk-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 39 of 40 |
| **Predecessor** | 038-pi-classifier-transport-integration |
| **Successor** | 040-hard-rules-sidecar |
| **Handoff Criteria** | The five completion criteria in `goal.md` each run from the final state: `cli-jev/SKILL.md` exists, `cli-usage/` is gone and a `cli-usage` prompt still routes to mode `cli-jev`, the path grep prints no `cli-classifier/cli-usage` hit outside `specs/` and benchmark reports, the version grep finds no field at or above `1.0.0.0`, `validate-playbook-package.cjs` prints PASS on `cli-deem/manual-testing-playbook`, and the four generated-artifact gates plus `validate.sh --strict` pass. This phase runs before 038's build, so 038's Planned docs point at `cli-jev` when its build starts. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 39** of the cli-jev workflow integration specification. The operator asked on 2026-09-30: "its also missing cli-jev, I see cli-usage and cli-deem. Did we drop our custom jev cli because pi supports it? or what happened to it", "also all cli classifier skills nad modes should stay pre-release so 0.1 0.1.1 etc. dont reach v1.0.0.0" and "cli deem is also missing testing playbook". They then chose "Rename to cli-jev (Recommended)" and "Continue each line (Recommended)".

Nothing was dropped. `jev 0.6.2` is on `PATH` at `/Users/michelkerkmeester/.local/bin/jev`, and `mode-registry.json` maps workflowMode `cli-jev` to packet folder `cli-usage`. The names differ because the old standalone cli-jev hub held a nested packet named `cli-usage` in the 2026-09-20 restructure, and commit `ea883967d4` (2026-09-29, "move the Jev transport into the classifier hub") moved it under cli-classifier and kept the folder name.

**Scope Boundary**: three changes inside `.skilled/skills/cli-classifier/`: the folder rename with `cli-usage` kept as a routing alias, the version continuation under `0.x`, and the new `cli-deem/manual-testing-playbook/` package. The live references to the old path, the generated artifacts (compiled routing, leaf manifest, Hermes copies), the 038 Planned docs that cite the old path, and this phase folder are part of the work. Closed spec folders keep their history as written, recorded benchmark reports stay as written, phase 040 owns the `hard_rules` move, and how Jev or Deem is called does not change.

**Dependencies**:
- `scratch/context/context.md` and `scratch/context/refs.txt`, read at authoring. They are the source of every path, line and number in this folder.
- The compiled-routing build at `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs` and the Hermes sync at `.skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, both read in the design pass before any edit.
- The gates: `.skilled/bin/compiled-route-guard.cjs`, `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs`, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, `sync-skills-hermes.cjs --check`, the playbook validator at `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` and `validate.sh --strict`.
- The parent D5 roster: DeepSeek V4.1 Flash writes, MiMo v2.6 Pro reviews, no Claude workers.
- Phase 038 is Planned and cites `cli-usage/SKILL.md` paths. This phase runs before 038's build because both touch the same packet, and the repoint covers 038's docs.

**Deliverables**:
- `.skilled/skills/cli-classifier/cli-jev/` in place of `cli-usage/`, with `cli-usage` still routing as an alias.
- Every live reference repointed, each file read before its edit. Closed spec folders and recorded benchmark reports stay as written.
- Every version field in cli-classifier below `1.0.0.0`, with the changelog files renamed and retitled and their history kept.
- `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/`, a package the playbook validator passes.
- Regenerated compiled routing, leaf manifest and Hermes copies, never hand-edited.
- This phase folder's six docs and the derived metadata.

**Changelog**:
- The parent packet has no `../changelog/` folder. The cli-classifier changelog files in scope are renamed and retitled by this phase, and no other skill changelog changes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The hub says `cli-usage` where the mode is `cli-jev`. `mode-registry.json` maps workflowMode `cli-jev` to packet folder `cli-usage` (lines 60-61 and 76 carry `"packet": "cli-usage"` and `"packetSkillName": "cli-usage"`), `hub-router.json` routes the `cli-usage-aliases` and `jev-dispatch` classes to resource `cli-usage/SKILL.md` (lines 19-20), and `dispatch-audit.mjs:46` maps `jev noul|choice|score|run` and `jev-mcp` to `packetPath: 'cli-classifier/cli-usage'`. The authoring read counted 53 files outside `specs/` and benchmark reports that name `cli-usage`, and 13 of them carry the full path `cli-classifier/cli-usage`.

The version lines read released. The hub sits at `1.2.0.0` in `SKILL.md:5`, `mode-registry.json:4`, `description.json:4`, `ROUTER.md:12` and `hub-router.json:3`. The Jev packet sits at `1.0.2.0` in `cli-usage/SKILL.md:5`. cli-deem sits at `1.0.0.0` in `SKILL.md:5` and `README.md:8`. A read-only grep at authoring found 71 version fields at or above `1.0.0.0` under `.skilled/skills/cli-classifier/`. The operator wants every cli-classifier line to stay pre-release.

cli-deem has no testing playbook. The folder holds `changelog`, `feature-catalog`, `README.md`, `references`, `scripts` and `SKILL.md`, while the Jev packet holds `cli-usage/manual-testing-playbook/`, 23 files made of 22 scenarios and one root file. The only Deem scenario lives in the hub playbook at `manual-testing-playbook/hub-routing/deem-request-routes-to-transport.md`.

### Purpose

Make the cli-classifier hub say what it is: a `cli-jev` folder for the Jev mode, pre-release versions everywhere, and a testing playbook for each transport.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Rename and alias (goal D1).** `git mv .skilled/skills/cli-classifier/cli-usage .skilled/skills/cli-classifier/cli-jev`, the frontmatter `name:` to `cli-jev`, the `packet` and `packetSkillName` fields in `mode-registry.json` to `cli-jev`, the `hub-router.json` resources to `cli-jev/SKILL.md`, and the dispatch registry's `packetPath` to `cli-classifier/cli-jev`. `cli-usage` stays in the alias vocabulary and in the mode registry alias list, so a prompt that says `cli-usage` still routes to mode `cli-jev`.
- **Live reference repoint (goal D3).** Every file outside closed spec folders and recorded benchmark reports that names `cli-usage` is read first and classified as a path to repoint or an alias word to keep. `refs.txt` lists the 53 authoring hits: 32 in cli-classifier, 4 in cli-external-orchestration, 4 in system-spec-kit, 3 in hooks/dispatch, 2 in sk-doc, and one each in `.skilled/agents/orchestrate.md`, `.skilled/agents/prompt-improver.md`, `.skilled/bin/lib`, `.skilled/skills/README.txt`, sk-code, sk-prompt, system-deep-loop and the root `README.md`.
- **Pre-release versions (goal D2).** No version field in cli-classifier reads `1.0.0.0` or above. The hub line continues after its existing v0.1.0.0 and v0.2.0.0: 1.0.0.0 to 0.3.0.0, 1.1.0.0 to 0.4.0.0, 1.2.0.0 to 0.5.0.0. The Jev packet line continues 1.0.0.0 to 0.1.0.0, 1.0.1.0 to 0.1.1.0 and 1.0.2.0 to 0.1.2.0. cli-deem's 1.0.0.0 becomes 0.1.0.0. The design pass extends the same continuation rule to every other version field the version grep reads (71 at authoring) and fixes the full table before the first edit.
- **Changelog renames.** `git mv` each of the six 1.x changelog files to its 0.x name, retitle it and update the links that point at it, with the history kept. Precedent: `sk-code/sk-code-obsidian` carries `version: 0.1.0.0` and `changelog/v0.1.0.0.md`.
- **Deem playbook (goal D4).** Create `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/` through sk-doc's sk-create-manual-testing-playbook mode, modelled on the Jev packet's playbook, covering the health-check gate, each judgment type and the dormant path. Every scenario runs on a stub or a refused call, so no scenario needs a served model.
- **Regenerated artifacts (goal D5).** The compiled routing, the leaf manifest and the Hermes copies are regenerated by their own tools, never hand-edited. `.hermes/skills/cli-usage` becomes `.hermes/skills/cli-jev`.
- **Phase 038's Planned docs.** 038 cites `cli-usage/SKILL.md` in its spec, plan, tasks, implementation-summary and derived metadata. Those are live references and are repointed, so 038's build reads `cli-jev`.
- **This phase folder.** `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` and `implementation-summary.md`, plus the derived `description.json` and `graph-metadata.json` through `repair-derived.cjs`.

### Out of Scope

- **Closed spec folders.** Their `cli-usage` citations are history and stay as written (goal D3). The phase-map handoff rows in `../spec.md` are not edited here.
- **Recorded benchmark reports.** The old path inside a committed benchmark report is recorded evidence. The path grep excludes benchmark reports (goal criterion 2).
- **The `hard_rules` move.** Phase 040 owns the sidecar move. This phase only repoints the dispatch registry path it reads.
- **How Jev or Deem is called.** No call path, argument or result shape changes. `jev 0.6.2` and the Deem wire contract stay as they are.
- **Hand edits of generated artifacts.** D5 forbids them. A stale artifact is fixed by rerunning its generator.
- **The Pi transport.** 038's switch and transport work is not touched.

### Files to Change

One row per file or file family with an edit. Every path below was read from `refs.txt`, `context.md` or a read-only command at authoring. A file that appears in more than one group carries one row with all its changes.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/cli-usage/` | Rename | `git mv` the whole folder to `cli-jev/`, frontmatter `name: cli-jev`, every internal reference read then repointed (goal D1) |
| `.skilled/skills/cli-classifier/mode-registry.json` | Modify | `packet` and `packetSkillName` at lines 60-61 and 76 to `cli-jev` and version line 4 to `0.5.0.0`. The alias list keeps `cli-usage` |
| `.skilled/skills/cli-classifier/hub-router.json` | Modify | Resources at lines 19-20 to `cli-jev/SKILL.md`, the outcome text at line 9, version line 3 to `0.5.0.0`. The vocabulary at line 37 keeps `cli-usage` |
| `.skilled/skills/cli-classifier/SKILL.md` | Modify | Version line 5 to `0.5.0.0`, the changelog link at line 158 and any packet path reference |
| `.skilled/skills/cli-classifier/README.md` | Modify | Version line 8 to `0.4.0.0` (proposed), the table at lines 86-88 and any packet path reference |
| `.skilled/skills/cli-classifier/ROUTER.md` | Modify | Version line 12 to `0.5.0.0` and any packet path reference |
| `.skilled/skills/cli-classifier/description.json` | Modify | Version line 4 to `0.5.0.0` and any packet path reference |
| `.skilled/skills/cli-classifier/changelog/v1.0.0.0.md`, `v1.1.0.0.md`, `v1.2.0.0.md` | Rename | `git mv` to `v0.3.0.0.md`, `v0.4.0.0.md`, `v0.5.0.0.md`, retitled, links updated, history kept |
| `.skilled/skills/cli-classifier/cli-jev/SKILL.md` | Modify | Version line 5 to `0.1.2.0` |
| `.skilled/skills/cli-classifier/cli-jev/README.md` | Modify | Version line 15 to `0.1.0.3` (proposed) |
| `.skilled/skills/cli-classifier/cli-jev/benchmark/README.md`, `cli-jev/benchmark/reports/README.md` | Modify | Version lines 10 and 9 to `0.1.0.0` (proposed) |
| `.skilled/skills/cli-classifier/cli-jev/changelog/v1.0.0.0.md`, `v1.0.1.0.md`, `v1.0.2.0.md` | Rename | `git mv` to `v0.1.0.0.md`, `v0.1.1.0.md`, `v0.1.2.0.md`, retitled, links updated, history kept |
| `.skilled/skills/cli-classifier/cli-deem/SKILL.md` | Modify | Version line 5 to `0.1.0.0` and any packet path reference |
| `.skilled/skills/cli-classifier/cli-deem/README.md` | Modify | Version line 8 to `0.1.0.0` and the changelog link at line 150 |
| `.skilled/skills/cli-classifier/cli-deem/changelog/v1.0.0.0.md` | Rename | `git mv` to `v0.1.0.0.md`, retitled, history kept |
| `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/` | Create | The new package through sk-doc: health-check gate, judgment types, dormant path, stubs or a refused call only (goal D4) |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | The `packetPath` at line 46 to `cli-classifier/cli-jev` |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs`, `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` | Modify | The old path repointed where each test reads it |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs` | Modify | The source map at lines 66-70 repointed to `cli-classifier/cli-jev/SKILL.md` |
| The 17 remaining live references outside cli-classifier and hooks/dispatch | Modify | 4 cli-external-orchestration, 4 system-spec-kit, 2 sk-doc, sk-code, sk-prompt, system-deep-loop, `.skilled/agents/orchestrate.md`, `.skilled/agents/prompt-improver.md`, `.skilled/skills/README.txt` and the root `README.md`, each read and classified before its edit (goal D3) |
| `specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration/` | Modify | The Planned docs that cite `cli-usage/SKILL.md` repointed, so 038's build reads `cli-jev` |
| `.skilled/skills/cli-classifier/leaf-manifest.json` | Regenerate | The manifest names `cli-usage` once and is regenerated, never hand-edited (goal D5) |
| `.skilled/skills/cli-classifier/graph-metadata.json` | Regenerate | Derived metadata refreshed after the hub docs change |
| The compiled-routing artifacts | Regenerate | Built by `build-artifacts.cjs`, never hand-edited (goal D5) |
| `.hermes/skills/cli-usage` | Regenerate | The Hermes copy becomes `cli-jev` through `sync-skills-hermes.cjs`, never hand-edited (goal D5) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **Rename and alias (goal D1).** `.skilled/skills/cli-classifier/cli-usage/` moves to `cli-jev/` with `git mv`, its frontmatter `name:` reads `cli-jev`, `mode-registry.json` `packet` and `packetSkillName` read `cli-jev`, `hub-router.json` resources read `cli-jev/SKILL.md`, and `dispatch-audit.mjs:46` reads `packetPath: 'cli-classifier/cli-jev'`. `cli-usage` stays in the alias vocabulary and in the mode registry alias list, and a prompt that names `cli-usage` still routes to mode `cli-jev`. |
| REQ-002 | **Live reference repoint (goal D3).** Each of the 53 `refs.txt` hits is read and classified as a path or an alias before its edit. Paths are repointed. Alias words stay. Closed spec folders and recorded benchmark reports stay as written. Phase 038's Planned docs are repointed. After the build, no live file outside `specs/` and benchmark reports contains the string `cli-classifier/cli-usage`. |
| REQ-003 | **Pre-release versions (goal D2).** No version field in `.skilled/skills/cli-classifier/` reads `1.0.0.0` or above. The design pass fixes the full table before the first edit: hub 1.0.0.0 to 0.3.0.0, 1.1.0.0 to 0.4.0.0 and 1.2.0.0 to 0.5.0.0 after the existing v0.1.0.0 and v0.2.0.0, Jev packet 1.0.0.0 to 0.1.0.0, 1.0.1.0 to 0.1.1.0 and 1.0.2.0 to 0.1.2.0, and cli-deem 1.0.0.0 to 0.1.0.0. The proposed README lines follow: hub README 1.1.0.0 to 0.4.0.0, cli-usage README 1.0.0.3 to 0.1.0.3, the two benchmark READMEs and the cli-deem README 1.0.0.0 to 0.1.0.0. Every other version field the version grep reads takes the same continuation. Changelog files are renamed by `git mv` and retitled, and their history is kept. |
| REQ-004 | **Deem playbook (goal D4).** `.skilled/skills/cli-classifier/cli-deem/manual-testing-playbook/` is created through sk-doc's sk-create-manual-testing-playbook mode, modelled on the Jev packet's playbook. It covers the health-check gate, each judgment type and the dormant path. Every scenario runs on a stub or a refused call, so no scenario needs a served model. `validate-playbook-package.cjs` prints PASS on the package. |
| REQ-005 | **Regenerated artifacts (goal D5).** The compiled routing, the leaf manifest and the Hermes copies are regenerated by their tools and never hand-edited. The Hermes `cli-usage` copy becomes `cli-jev`. The compiled-route guard and the leaf-manifest freshness gate pass on the final tree. |
| REQ-006 | **Call paths and history unchanged.** How Jev and Deem are called does not change. `hard_rules` stay in place for phase 040. No closed spec folder and no recorded benchmark report is edited. |
| REQ-007 | **Gates and scope hygiene (goal criteria 1, 2, 3, 4 and 5).** `cli-jev/SKILL.md` exists, `cli-usage/` does not, the path grep prints nothing outside `specs/` and benchmark reports, the version grep finds no field at or above `1.0.0.0`, the playbook validator prints PASS, and `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `parent-skill-check.cjs` and `sync-skills-hermes.cjs --check` pass. Only the named scope changes. `validate.sh --strict` prints `RESULT: PASSED`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | **Review before commit (parent goal D5, this phase's D6).** MiMo v2.6 Pro reviews every DeepSeek V4.1 Flash diff, and DeepSeek reviews any MiMo fix. No Claude worker writes. P0 and P1 findings are fixed and rechecked, P2 findings are recorded. The session runs the proof commands, records the results and commits path-scoped. |
| REQ-009 | **Worked evidence for the phase docs.** Every tick, number and commit in this folder comes from `scratch/context/context.md`, `scratch/context/refs.txt` or from a command the session ran and read. Where a row has no evidence, it stays open and says why. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.skilled/skills/cli-classifier/cli-jev/SKILL.md` exists, `cli-usage/` does not, and a `cli-usage` prompt still routes to mode `cli-jev`.
- **SC-002**: A grep for `cli-classifier/cli-usage` outside `specs/` and benchmark reports finds nothing. The authoring grep printed 13 paths outside `specs/`, none under a `benchmark/` folder.
- **SC-003**: A grep over every cli-classifier version field finds no value at or above `1.0.0.0`. The authoring grep found 71 such fields.
- **SC-004**: `validate-playbook-package.cjs` prints PASS on `cli-deem/manual-testing-playbook`. The authoring run exited 2 with `package does not resolve to a manual-testing-playbook root`, because the package does not exist yet.
- **SC-005**: `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `parent-skill-check.cjs` and `sync-skills-hermes.cjs --check` pass, and `validate.sh --strict` passes for this phase.

### Proof Plan

1. Run the routing replay the design pass fixes for a prompt that names `cli-usage`, and read mode `cli-jev` back. Boundary: the mode registry maps workflowMode `cli-jev` to packet folder `cli-usage` today, so a replay that answers the packet name instead of the mode fails SC-001.
2. Run the path grep outside `specs/` and benchmark reports, and read no output. Boundary: the authoring baseline is 13 paths, so a hit means a live reference was missed. Aliases such as the mode registry's `cli-usage` entry are not hits, because the grep looks for the path string `cli-classifier/cli-usage`.
3. Run the version grep over `.skilled/skills/cli-classifier/`, and read no value at or above `1.0.0.0`. Boundary: the authoring baseline is 71 fields, and the design pass's table is the record of what each field becomes.
4. Run `validate-playbook-package.cjs --package .skilled/skills/cli-classifier/cli-deem/manual-testing-playbook`, and read status PASS. Boundary: the authoring run exits 2 because the package does not exist.
5. Run `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `parent-skill-check.cjs .skilled/skills/cli-classifier` and `sync-skills-hermes.cjs --check`, then `validate.sh --strict` on this phase. Boundary: each gate must print its own PASS line or exit 0, and `validate.sh` must print `RESULT: PASSED`, not merely lack a failure line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `context.md` and `refs.txt`, read at authoring | No classification of the 53 hits | The design pass re-reads each of the 53 files before any edit and records the classification |
| Dependency | The compiled-routing build and the Hermes sync | No regeneration, so the artifacts stay stale | The design pass reads both tools and fixes each regeneration command before the first edit |
| Dependency | The four artifact gates and the playbook validator | No proof that the artifacts are fresh | Each gate runs from the final state, and a failure stops the phase |
| Dependency | The parent D5 executors | No writer or no reviewer | DeepSeek V4.1 Flash writes and MiMo v2.6 Pro reviews, dispatched by Bash. No Claude workers |
| Dependency | Phase 038's Planned docs | 038's build would read a folder that no longer exists | The repoint covers 038's docs in the same pass as the other live references |
| Risk | A blind replace repoints an alias word | Old prompts stop routing | Each file is read first, and the design pass lists each hit as a path or an alias (goal D3) |
| Risk | A version field is missed, so the version grep still flags it | Criterion 3 fails | The design pass fixes the full table from the grep before the first edit, and the grep is the final check |
| Risk | A generated artifact is hand-edited | The guard or the freshness gate fails, or a stale manifest serves legacy | D5 forbids hand edits, and each generator reruns from the final tree |
| Risk | Another worker edits the same tree during the phase | The gates compare against a moving baseline | The session records the HEAD it read, reruns every gate from the final state and keeps its evidence under the phase's `scratch/` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No new process, network call or dependency at runtime. The changes are paths, versions, docs and generated artifacts.
- **NFR-P02**: The Deem playbook scenarios run on stubs or a refused call, so no scenario needs a served model or a network call (goal D4).

### Security
- **NFR-S01**: No key, token or `.env` file is read, written or printed. The Jev call path is unchanged.
- **NFR-S02**: No file outside the named scope changes, and no closed spec folder or recorded benchmark report is edited (goal D3).

### Reliability
- **NFR-R01**: `cli-usage` keeps routing as an alias after the rename, so an old prompt resolves the same mode.
- **NFR-R02**: Generated artifacts are reproducible from their tools, and a hand edit is detectable by the guard and the freshness gate.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A file that names `cli-usage` only as an alias word keeps it. A file that names the path `cli-classifier/cli-usage` is repointed. A file that carries both is read once and both edits apply.
- The mode registry alias list already holds `cli-jev` and `cli jev` beside `cli-usage`, so the rename adds nothing to the alias vocabulary and removes nothing from it.
- A version field whose line is not covered by the authoring mapping is not guessed. The design pass extends the table first and records the source line.

### Error Scenarios
- A `refs.txt` path that does not exist at read time stops the batch per Law 4, and the phase reports the mismatch rather than repointing a guess.
- The playbook validator failing after the package is written stops the phase until the package passes.
- A gate that reports a stale compiled manifest is fixed by rerunning the build, never by editing the manifest.

### State Transitions
- The rename, the version sweep and the playbook are independently revertible. A partial pass leaves the phase docs as the state record and the open tasks open.
- Rerunning a generator after a partial pass is safe, because each generator is idempotent and writes from the tree it reads.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | One hub, 53 reference files, 71 version fields, six changelog renames, one new playbook package |
| Risk | 10/25 | The rename can break routing, so the alias, the replay and the guard carry the risk |
| Research | 6/20 | The design pass reads the 53 files and the generation tools before the first edit |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which exact grep defines "every cli-classifier version field" for criterion 3, and whether recorded benchmark reports fall inside it. The design pass fixes the command and the full table before the first edit. UNKNOWN until then.
- Which command proves criterion 1's alias routing. The design pass fixes it from the compiled-routing build. UNKNOWN until then.
- Whether phase 038's scratch working notes are repointed with its Planned docs. Its docs are in scope, and its scratch notes are working files. The design pass lists them.
- Where the compiled-routing build installs its artifacts from the rollout root. The design pass reads the build. UNKNOWN until then.
<!-- /ANCHOR:questions -->

---
