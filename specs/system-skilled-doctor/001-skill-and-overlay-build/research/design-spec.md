---
title: "Feature Specification: Vendored Skilled overlays and safe re-pin in a system-skilled-doctor skill"
description: "A project that vendors Skilled by archive keeps its local changes only through a private overlay engine, a manual re-pin runbook and scratch scripts, as Barter does. This packet records how Barter's overlay, sync and re-pin work and fail, and designs a system-skilled-doctor skill that owns every doctor command about supporting and integrating Skilled into a project, with a new overlay command among them."
trigger_phrases:
  - "vendored overlays and repin"
  - "vendored skilled overlays and safe re pin"
  - "system skilled doctor skill design"
  - "doctor overlay command design"
  - "overlay replay sync repin"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Vendored Skilled overlays and safe re-pin in a system-skilled-doctor skill

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft (research and design complete, revised to the operator's rulings, build not started) |
| **Created** | 2026-11-06 |
| **Branch** | `main` (no branch was created; the operator commits) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skilled has no way for a project that vendors it to keep local changes across a new pin. Barter built its own overlay engine, edit guards in seven runtimes, a seven-step runbook and per-re-pin scratch scripts, and each re-pin still hits the same traps: no rollback for an untracked tree, a lock nothing enforces, a blocked replay that needs a hand-written restore script, and upstream fixes made in place that the next copy reverts. Separately, nine doctor commands, including those that put Skilled into a project, are credited to `system-spec-kit`, a spec-folder skill whose purpose does not cover installing, linking or updating Skilled.

### Purpose
A new standalone skill, `system-skilled-doctor`, owns eleven doctor commands about supporting and integrating Skilled into a project. One of them is a new `/doctor:overlay` command that lets any vendoring project record its divergences, apply and check them, and re-pin in one guarded run with a backup and a rollback. Barter's private copy then shrinks to its manifest and its canonical files.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Read-only commands run on 2026-11-06 against the Barter tree at `ai-speckit/skilled/` while re-pin packet 034 was running. The lock line was read at 07:43 and was gone by 07:50.

```text
$ cat barter-overlays/.build-lock
orchestrator repin-034-phase1-resume pid=77663 2026-11-06T06:43:08Z
$ grep -rn "build-lock" barter-overlays/*.cjs .skilled/hooks/overlay-sync .opencode/plugins/barter-overlay-sync.js .hermes/plugins/barter-overlay-sync | wc -l
0
$ git ls-files skilled | wc -l        # run from the ai-speckit root
0
$ grep -n "retainedPaths.has(rel)) continue" barter-overlays/replay.cjs
847:    if (wanted.kind !== 'file' || retainedPaths.has(rel)) continue;
$ grep -n "planOverlay(entry, root)" barter-overlays/replay.cjs
1190:  const plans = manifest.overlays.map((entry) => planOverlay(entry, root));
1242:  const plans = manifest.overlays.map((entry) => planOverlay(entry, root));
$ grep -n "acceptedSha256: state.files" barter-overlays/sync.cjs
241:  const plans = manifest.overlays.map((entry) => replay.planOverlay(entry, root, { acceptedSha256: state.files }));
$ node -e '<count overlays by scope in overlay-manifest.json>'
count 116 { file: 88, directory: 16, 'marked-section': 1, 'json-entry': 8, 'skill-root': 1, 'remove-root': 2 }
guarded files 76
sk-git-root replace∩retained [ 'SKILL.md' ] retained 14 remove 16
```

Skilled side, run in the Skilled checkout:

```text
$ for f in .skilled/commands/doctor/*.md; do echo "$f $(grep -m1 skill_agent $f)"; done
agents-md.md <!-- skill_agent: sk-doc -->
ci.md <!-- skill_agent: sk-code -->
deep-loop.md <!-- skill_agent: system-deep-loop -->
env.md <!-- skill_agent: system-spec-kit -->
git.md <!-- skill_agent: sk-git -->
helper.md <!-- skill_agent: system-spec-kit -->
install.md <!-- skill_agent: system-spec-kit -->
mcp.md <!-- skill_agent: system-spec-kit -->
runtime-mirrors.md <!-- skill_agent: system-spec-kit -->
setup.md <!-- skill_agent: system-spec-kit -->
sk-code.md <!-- skill_agent: sk-code -->
sk-skill.md <!-- skill_agent: sk-doc -->
skill-advisor.md <!-- skill_agent: system-skill-advisor -->
speckit.md <!-- skill_agent: system-spec-kit -->
symlink.md <!-- skill_agent: system-spec-kit -->
update.md <!-- skill_agent: system-spec-kit -->
```

The paths are shortened to file names above. The manifest held 116 overlays at pin `ef8e79f85a` when read. The first brief for this packet said 158. The manifest had been rewritten at 07:43 by the running re-pin, so the count is a snapshot. Between two reads a minute apart, `sync.cjs` changed content (the token-name allowance appeared) while its mtime stayed at Nov 5 22:59, which fits an `rsync -a` copy that keeps mtimes.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Map Barter's overlay manifest, replay, sync, lock, hooks, rules and re-pin procedure, with each failure mode tied to a file and line. This is in `research/research.md`.
- Design `system-skilled-doctor`: its shape, the doctor commands it owns and leaves, how it routes to them, and the overlay command inside it.
- Name, for each piece, the Barter failure or routing need it answers, and what was dropped.
- Name what Barter's own copy shrinks to once the ability is upstream.

### Out of Scope
- Writing any Skilled skill, command, script or doc. The design proposes and a later approved packet builds.
- Touching `ai-speckit/skilled/` in any way. A real re-pin was running there and holds its lock.
- Barter's cutover to the new command. That is an ai-speckit packet after the Skilled build lands.

### Files to Change

This packet writes only its own docs. The build packet that follows would add or change these Skilled files.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-doctor/SKILL.md` | Create | Standalone skill: owned-command table, when to use each, the overlay-first rule |
| `.skilled/skills/system-skilled-doctor/ROUTER.md` | Create | Sibling router: one intent per owned-command group, loading `SKILL.md` or `references/overlays.md` |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Create | The overlay states and their fixes, the edit-the-overlay rule, the re-pin steps and the rollback |
| `.skilled/skills/system-skilled-doctor/README.md`, `graph-metadata.json`, `leaf-manifest.config.json`, `changelog/`, `manual-testing-playbook/`, `benchmark/` | Create | The required standalone shape from `sk-create-skill` |
| `.skilled/skills/system-skilled-doctor/leaf-manifest.json`, `leaf-aliases.json` | Generate | Written by the leaf-manifest generator, never by hand |
| `.skilled/commands/doctor/overlay.md` | Create | Router for `/doctor:overlay` with the targets `status`, `apply` and `repin`, tagged `skill_agent: system-skilled-doctor` |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Create | Visible wording: the state table, refusals, the re-pin plan and the rollback line |
| `.skilled/commands/doctor/assets/doctor-overlay-status.yaml`, `doctor-overlay-apply.yaml`, `doctor-overlay-repin.yaml` | Create | The three target workflows |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Create | One engine from Barter's `replay.cjs` and `sync.cjs`, with one state source, an owned lock and the one reader of the overlay-folder setting |
| `.skilled/commands/doctor/scripts/tests/overlay-engine.test.cjs` | Create | Ported Barter tests plus one test per fixed failure |
| `.skilled/commands/doctor/{install,symlink,update,setup,helper,runtime-mirrors,env,speckit,mcp}.md` | Modify | Nine files, one line each: the `skill_agent` tag goes from `system-spec-kit` to `system-skilled-doctor`. No file moves |
| `.skilled/commands/doctor/agents-md.md` | Modify | One line: the `skill_agent` tag goes from `sk-doc` to `system-skilled-doctor` |
| `.skilled/commands/doctor/scripts/tests/doctor-{install,helper,symlink}-contract.test.cjs` | Modify | Each pins `skill_agent: system-spec-kit` (lines 170, 122 and 263) and changes to the new tag |
| `.skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` | Modify | Pins `skill_agent: sk-doc` at line 224 and changes to the new tag. The speckit and mcp contract tests pin no tag |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json`, `runtime/lib/scorer/projection.ts`, `runtime/scripts/skill_advisor.py`, `runtime/lib/render.ts` | Generate | The four outputs `derive-command-bridges.cjs` writes (lines 25-47). Rerun it so the ten moved bridges and the new overlay bridge credit `system-skilled-doctor`. `skill_advisor.py` today names `skill_id: system-spec-kit` per moved command |
| `.skilled/commands/doctor/_routes.yaml` | Modify | Three overlay routes, and the router count in the header goes from 16 to 17 |
| `.skilled/skills/system-spec-kit/README.md` | Modify | Its doctor table (section 7, "Seven doctor commands wrap the checks this skill owns", lines 564-574) moves whole to the new skill's README. One sentence stays, saying `/doctor:speckit` and `/doctor:env` check this skill's trigger index and environment switches and are documented in `system-skilled-doctor` |
| `.skilled/skills/system-skilled-doctor/README.md` | Create | Gains the moved table, with rows added for `/doctor:helper`, `/doctor:mcp`, `/doctor:agents-md` and `/doctor:overlay` |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | One pre-write guard hook, inert when no overlay manifest exists |
| `.skilled/hooks/overlay-guard/` | Create | Guard adapters ported from Barter's `.skilled/hooks/overlay-sync/`, pre-write only, calling `overlay-engine.cjs --guard` |
| `doctor-setup-presentation.txt`, `.skilled/commands/README.txt`, `.skilled/manual-testing-playbook/manual-testing-playbook.md`, `.skilled/manual-testing-playbook/doctor-commands/README.md`, `system-spec-kit/feature-catalog/doctor-commands/category-overview.md`, `sk-create-command/assets/command-contract.json` | Modify | Six surfaces that list every doctor command gain `/doctor:overlay`. `README.txt` and `command-contract.json` also name `system-spec-kit` and need their owner text checked |

**Count.** The build modifies or regenerates 27 existing files: 10 command routers, 4 contract tests, 4 deriver outputs, `_routes.yaml`, the `system-spec-kit` README, `hook-registry.json` and 6 listing surfaces. It creates about 29 new files: 12 in the skill folder (two of them generated), 5 for the overlay command, the engine and its test, and about 10 guard adapters. The count of adapters depends on the port, so it is an estimate. Runtime mirror copies and rendered hook files that existing generators write are not counted.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

These requirements bind the build packet. This packet meets REQ-001 and REQ-002 only.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every proposed piece names a failure seen in the Barter evidence or a real routing need | Each row of plan.md section 3 cites a Barter file and line, a packet fact or a Skilled file and line |
| REQ-002 | The design gives the skill's shape, the commands it owns and leaves, and how it routes to them | plan.md section 3 holds the shape choice under the `sk-create-skill` rules and a one-line reason per doctor command |
| REQ-003 | Apply and check read the same accepted-hash state | A pinned overlay whose source changed and whose destination holds the last applied copy applies with no restore script; the test reproduces the 034 trap |
| REQ-004 | A retained path that the overlay also writes is a sync output and is guarded | A fixture with `SKILL.md` in both `replace` and `retained` reports `overlay-edited` after the overlay changes, and the guard refuses a live edit to it |
| REQ-005 | The engine owns its lock | `apply`, `capture` and `repin` take the lock themselves and refuse while it is held, naming its owner line and the lock file to remove by hand |
| REQ-006 | `repin` backs up every path it will overwrite or delete before its first write | `repin --rollback <run>` restores the backed-up bytes and the tree passes `status` again |
| REQ-007 | `repin` refuses while any unowned file in the copied roots differs from the old pin | A fixture with a hand-edited vendored router not owned by any overlay makes `repin` stop and name the path |
| REQ-008 | Every existing `/doctor:*` command keeps its name and behavior | After the tag change, the doctor contract tests and `command-bridges-drift-guard.vitest.ts` pass, and each moved bridge names `system-skilled-doctor` |
| REQ-009 | The overlay folder is read from one setting by one function | With no setting file the engine uses `skilled-overlays/`. With `{"overlayDir": "barter-overlays"}` in the setting file it uses that folder. `rg -n "overlayDir"` over the build finds one reader |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | `repin --stage <dir>` builds the re-pinned tree in a copy and reports blocked overlays and overlays that now equal upstream | The report lists both groups, and the live tree is byte-identical before and after |
| REQ-011 | The operations of one json-entry set apply in order | A `setKeyOnItem` on an item that the same set's `insertItems` adds succeeds |
| REQ-012 | The protected-name guard passes only paths a manifest entry names exactly | An exact `file` entry for a `tokens.css` destination applies. A `tokens.css` met while walking a `directory` or `skill-root` entry is still refused, as are `.env` files |
| REQ-013 | No hook applies overlays after an edit | `rg -n "post-edit\|--apply" .skilled/hooks/overlay-guard` finds no apply call |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Barter re-pins with one `repin --stage` run, overlay rebases in the stage, then one `repin` run, with no scratch restore script and no second lock wrapper.
- **SC-002**: After the cutover, Barter's private copy holds only its manifest, its canonical sources, its state file, its overlay-folder setting, its rule and its pre-commit line. The engine, its tests, the hook adapters and the plugins are gone from `barter-overlays/` and the runtime folders.
- **SC-003**: `advisor_recommend` for "put Skilled into my project repo" and "re-pin my vendored Skilled" ranks `system-skilled-doctor` first.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Barter's `replay.cjs` and `sync.cjs` as the port source | The engine is a port, so a Barter fix made after the port is lost | Port from a frozen copy after re-pin 034 closes, and record its SHA-256 in the build packet |
| Dependency | A local Skilled checkout for `git archive` of the old and new pins | `repin` cannot stage or scan without it | `repin` takes `--upstream <dir>` and refuses when either commit is missing there |
| Risk | The port changes behavior Barter depends on | High: 116 overlays and 9 regeneration steps run through it | Run Barter's three test files against the port, then `status` and `check` on a copy of Barter's tree before the cutover |
| Risk | Moving ten `skill_agent` tags shifts advisor routing for prompts `system-spec-kit` won before | Medium | Run the command-bridge drift guard and an `advisor_recommend` check on each moved command's trigger phrases before and after |
| Risk | The guard hook fires in projects with no overlays | Low | The hook exits at once when no overlay manifest is found |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Every question is decided. None stays open.

### Decided by the operator (2026-11-06)

- **Home: a new skill, `system-skilled-doctor`.** Operator's words: "new skill might be better as it could also include all doctor commands regarding support and integration but skill is better called system-skilled-doctor". It owns every doctor command about supporting and integrating Skilled into a project, and the overlay ability is one of its commands.
- **Shape: a standalone skill.** Ruled by the operator as recommended. The overlay ability is one owned command with one reference, `references/overlays.md`, not a mode packet. The reasons are in plan.md section 3.
- **Commands: "Nine plus speckit".** Operator's words. The skill also owns `/doctor:speckit`.
- **`/doctor:mcp`: "Into the new skill".** Operator's words. The skill owns `/doctor:mcp`, so it does not go to `mcp-code-mode`. The skill owns 11 commands: install, symlink, update, overlay (new), agents-md, runtime-mirrors, env, setup, helper, speckit and mcp. Domain ownership stays with `sk-code` (sk-code, ci), `sk-git` (git), `sk-doc` (sk-skill), `system-skill-advisor` (skill-advisor) and `system-deep-loop` (deep-loop).
- **Consequence: `system-spec-kit` owns no doctor command.** Its README doctor table moves whole to `system-skilled-doctor`'s README, and one sentence stays to point there. The scripts those commands call, such as the trigger-index lookup and `ENV-REFERENCE.md`, stay in `system-spec-kit`.
- **Overlay folder: a configurable path.** Ruled by the operator as "a configurable path". The setting is `.skilled-overlays.json` at the vendored tree root, holding `{"overlayDir": "<path relative to the tree root>"}`. The default when the file is absent is `skilled-overlays/`. The one reader is `resolveOverlayDir(root)` in `overlay-engine.cjs`, and the commands, the guard hook and a pre-commit line reach the folder only through the engine.
- **The automatic apply after each edit is dropped.** Ruled by the operator: status plus pre-commit catch an unapplied overlay.
- **The token guard passes exact manifest paths only.** Ruled by the operator. A walked path is still refused.

- **Defaults: "keep both".** Operator's ruling on the two defaults:
  - **Re-pin copy split.** `repin` copies only the changed paths for `.skilled` and whole folders for the runtime folders, with a manifest `repin.exclude` list for paths such as Barter's `.opencode/scripts`.
  - **The overlay-first rule stays Barter-local.** `references/overlays.md` in the new skill carries the state table, and the guard's refusal names the overlay file, so Skilled ships no repository rule.
<!-- /ANCHOR:questions -->

---
