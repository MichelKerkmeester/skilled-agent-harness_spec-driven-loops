---
title: "Build Phase: Move cli-jev into the cli-classifier Hub"
description: "Move the cli-jev hub into the proposed cli-classifier hub as mode cli-jev over its unchanged cli-usage packet, beside cli-deem, with one git mv of every hub file, one commit and a route replay that must match its pre-move baseline. The phase waits on 008 and on a Deem arm result the operator keeps."
trigger_phrases:
  - "cli-jev hub move"
  - "cli-jev into cli-classifier"
  - "mode cli-jev over cli-usage"
  - "cli-jev canary replay baseline"
  - "cli-jev git mv whole hub"
  - "cli-classifier two modes"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Build Phase: Move cli-jev into the cli-classifier Hub

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-09-27 |
| **Source** | `../007-classifier-deep-research/research/research.md` section 14, `### 009-cli-jev-hub-move (new)`, with R23 in section 12 |
| **Branch** | `worktrees/069-cli-jev-workflow-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-cli-classifier-hub |
| **Successor** | None |
| **Handoff Criteria** | `parent-skill-check.cjs` passes on `.skilled/skills/cli-classifier` with two modes, the post-move route replay matches the recorded baseline on all 10 prompts, and `git grep` finds no stale `.skilled/skills/cli-jev/` path outside `specs/`, changelogs and dated benchmark reports |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the cli-jev workflow integration specification. It builds the second half of recommendation R23 and carries out decision D2 of the parent goal: the new hub `cli-classifier` (proposed, phase 008) holds `cli-jev` (moved) and `cli-deem` (proposed, phase 008). The source is the round-3 synthesis, `../007-classifier-deep-research/research/research.md`: section 14 (`### 009-cli-jev-hub-move (new)`), section 12 (`### R23.`), the What Not To Build row 104 and the citation ledger rows 79 to 94.

**Scope Boundary**: A routing identity change. `cli-jev` becomes mode `cli-jev` of `cli-classifier` over its packet folder `cli-usage`, whose name and transport contract stay as they are. system-deep-loop is the precedent: its mode `research` runs over packet `deep-research`. No feature gains a switch, and no Jev or Deem call is part of the phase.

**Dependencies**:
- 008-cli-classifier-hub is Complete: the hub root exists with `cli-deem` routed and `parent-skill-check.cjs` passes on it
- The operator keeps a result from a Deem arm, which is research open question 49. R23's keep rule says to retire `cli-deem` and never build 009 when no Deem arm prints a result the operator keeps

**Deliverables**:
- A route-replay baseline of the 7 canary cases and the 3 hub-routing scenarios, recorded before any file moves
- One commit that moves all 81 hub files, merges the hub-level files into the `cli-classifier` root and updates every literal list, generated artifact, mirror, agent and README that names the old hub
- A post-move replay that matches the baseline, with the comparison in `implementation-summary.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Decision D2 of the parent goal puts both classifier transports under one hub, but `cli-jev` is its own hub today with one mode. Its registry maps mode `cli-usage` over packet `cli-usage` (`.skilled/skills/cli-jev/mode-registry.json`), and its `hub-router.json` marks the ordered bundle unreachable while the hub registers one mode (`hub-router.json:10`). The hub name is written into seven literal lists that the compiled router and the dispatch audit read, reopened on 2026-09-27:

- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:35` maps `cli-jev` to `009-parent-hub-rollout/008-cli-jev`
- `.skilled/bin/compiled-route-sync.cjs:59` and `.skilled/bin/compiled-route-guard.cjs:47` list it among the hubs
- `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts:19` and `:37` list it twice
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:36-44` holds it in `DEFAULT_ON_HUBS` at `:41`
- `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json:5-13` lists it in `hubs` at `:10`
- `.skilled/hooks/dispatch/lib/dispatch-audit.mjs:46` maps a `jev` dispatch to skill `cli-jev` and packet path `cli-jev/cli-usage`, and `:234` and `:237` return `cli-jev`

The footprint is larger than the lists. The hub holds 81 tracked files, 59 of them in `cli-usage` and 22 at hub level. 48 tracked files outside `specs/` name `cli-jev` (both counts by `git ls-files` and `git grep -l`, 2026-09-27, matching ledger row 94). A partial move fails badly here. A lineage proposed `git mv` of `cli-usage` alone followed by `rm -rf .skilled/skills/cli-jev`, which deletes the other 22 hub files, among them `manual-testing-playbook/`, `benchmark/`, `changelog/` and `shared/` (What Not To Build row 104).

### Purpose

`cli-jev` routes as mode `cli-jev` of `cli-classifier` beside `cli-deem`, every one of its 81 files is accounted for, and every canary case and hub-routing scenario routes as it did before the move.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Recording the baseline route replay of the 7 canary cases in `009-parent-hub-rollout/008-cli-jev/fixtures/canary-cases.v1.json` and the 3 hub-routing scenarios CJ-001, CJ-002 and CJ-003 before any file moves
- `git mv` of all 81 hub files into `.skilled/skills/cli-classifier/`: the 59 files of `cli-usage/` to `cli-classifier/cli-usage/`, and each of the 22 hub-level files to a free path or into the `cli-classifier` counterpart it merges with
- Registering mode `cli-jev` in the `cli-classifier` `mode-registry.json`: `workflowMode` `cli-jev`, `packet` and `packetSkillName` `cli-usage`, `packetKind` `transport`, `routingClass` `metadata`, with the aliases and router signals of today's `cli-usage` mode
- Updating every literal list named in the problem statement, the rollout package `009-parent-hub-rollout/008-cli-jev`, the `.hermes` mirrors, the agents that name the hub, the advisor graph and fixtures, the trigger index and the READMEs
- One commit for the move, the merges, the edits and the regenerated artifacts, so one revert undoes it

### Out of Scope

- Any change to the `cli-usage` transport contract, its folder name or its packet identity. It moves as a packet, as `deep-research` sits under `system-deep-loop`
- Editing any changelog. Changelogs stay as written, including the four outside the hub that name `cli-jev` and the four inside it, which move byte-identical
- Editing a dated benchmark report. `cli-usage/benchmark/reports/2026-09-20-post-migration-reverification/skill-benchmark-report.md:15` records where a past run happened, and it stays a record
- Building or changing `cli-deem`, the hub root minting or the advisor entry of `cli-classifier`. Those are 008's
- Any switch, gate or model call. The move is a routing identity change, so D1's two-backend gate has nothing to govern here
- Historical spec folders under `specs/` that name the old path. They record past work

### Files to Change

Counts are from `git ls-files` and `git grep -l` on 2026-09-27. Every path under `cli-classifier/` is proposed until 008 lands.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-jev/cli-usage/` (59 files) | Move | `git mv` to `.skilled/skills/cli-classifier/cli-usage/`. Only prose that names the packet's hub changes, such as `SKILL.md:282` |
| `.skilled/skills/cli-jev/benchmark/` (7), `manual-testing-playbook/` (4), `shared/` (1), `changelog/` (2) | Move | `git mv` into the matching `cli-classifier` subtree, merging a file only where 008 already placed a file at the same path. Changelogs move byte-identical |
| `.skilled/skills/cli-jev/SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `description.json`, `leaf-manifest.json` | Merge | Content merged into the `cli-classifier` root file of the same name that 008 creates. A second skill-shaped `graph-metadata.json` below a hub root is rejected (`parent-skill-check.cjs:268-275`, ledger row 89) |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs` | Modify | `:35` maps `cli-classifier` to its rollout package in place of `cli-jev` |
| `.skilled/bin/compiled-route-sync.cjs`, `.skilled/bin/compiled-route-guard.cjs` | Modify | `:59` and `:47`: `cli-jev` leaves the hub list, and `cli-classifier` is in it once |
| `.skilled/skills/system-skill-advisor/runtime/lib/compiled-routing-flag.ts` | Modify | `:19` and `:37`, the same replacement |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs` | Modify | `DEFAULT_ON_HUBS` at `:36-44`, and the comment at `:30` that names `cli-jev` |
| `.skilled/bin/lib/compiled-routing/serving-closure.manifest.json` | Modify | `hubs` at `:5-13`, then the file list the manifest records |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` and its two tests | Modify | `:46` skill and packet path become `cli-classifier` and `cli-classifier/cli-usage`, `:234` and `:237` return `cli-classifier`. `dispatch-audit.test.mjs` and `dispatch-rule-checks.test.mjs` follow |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/008-cli-jev/` (5 files) | Modify | Fixture, harness and `lib/` compile the two-mode `cli-classifier` registry. The canary cases expect mode `cli-jev` where they expect `cli-usage` today |
| `.hermes/skills/cli-jev/SKILL.md`, `.hermes/skills/cli-usage/SKILL.md` and the agent mirrors under `.hermes/skills/` | Modify | Mirrors of the moved hub and of the agents |
| `orchestrate` and `prompt-improver` agents in `.skilled/agents/`, `.claude/agents/`, `.codex/agents/` and `.pi/agents/` | Modify | Hub name and path references |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`, `runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Regenerate | The advisor graph lists `cli-jev` as a skill of family `cli` today |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and the three retrieval fixtures | Regenerate | The trigger index names the old path |
| `README.md`, `.skilled/skills/README.txt` | Modify | Skill inventory lines |
| Remaining files that name `cli-jev` (`cli-external-orchestration` registry, graph, SKILL and feature catalog, the `sk-doc` code-folder fixtures, the `sk-prompt` card, the `004-cli-external-orchestration` canary fixture) | Review | Edited where a line names the live hub or path. A line that records history stays |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The build starts only when 008 is Complete and the operator keeps a Deem arm result (research open question 49) | `008-cli-classifier-hub` shows Complete, `parent-skill-check.cjs` passes on `.skilled/skills/cli-classifier` before the move, and the kept result is named in `implementation-summary.md`. Without a kept result the phase stays Planned and is never built (R23 keep rule) |
| REQ-002 | The route replay baseline is recorded before any file moves | For each of the 7 canary prompts and the 3 hub-routing scenario prompts, `node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "<prompt>"` output with its exit status is saved in this phase's `scratch/route-baseline.txt`, at a HEAD where `git ls-files .skilled/skills/cli-jev` still prints 81 lines |
| REQ-003 | The whole hub moves with `git mv`. No partial move is followed by a deletion | A disposition table in `implementation-summary.md` lists all 81 files with their target. `git diff --cached -M --name-status` shows a rename row for every moved file, and its only `D` rows are hub-level files named in the table as merged into a `cli-classifier` counterpart. `git ls-files .skilled/skills/cli-jev` prints 0 lines |
| REQ-004 | `cli-jev` is a mode of `cli-classifier` over the packet `cli-usage` | `mode-registry.json` in `cli-classifier` lists two modes, and the `cli-jev` entry has `packet` `cli-usage`, `packetKind` `transport` and `routingClass` `metadata`. `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0 |
| REQ-005 | Every literal list names `cli-classifier` and no longer names `cli-jev` | `git grep -n "'cli-jev'"` over the seven files named in section 2 prints no hub-list or hub-map line, and each list holds `cli-classifier` once |
| REQ-006 | Kill criterion: any canary case or hub-routing scenario that routes differently after the move reverts the move commit | The post-move replay through `--hub cli-classifier` matches the baseline on `action`, `selectionKind` and each target's `packetId` for all 10 prompts, with mode `cli-usage` read as `cli-jev` and hub `cli-jev` as `cli-classifier`. One mismatch means `git revert` of the move commit and a record of the case in `implementation-summary.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The move, merges, edits and regenerated artifacts land in one commit | `git show --stat HEAD` holds the renames, the literal lists and the regenerated advisor graph and trigger index. `git status --porcelain` is clean for those paths afterward |
| REQ-008 | No stale hub path survives outside records | `git grep -l '\.skilled/skills/cli-jev/' -- . ':!specs' ':!**/changelog/**' ':!**/benchmark/reports/**'` prints nothing. Today it prints 15 files outside the hub, plus `graph-metadata.json` and `manual-testing-playbook.md` inside it |
| REQ-009 | The ordered bundle becomes reachable | The merged `hub-router.json` lists both modes in `tieBreak`, and its `orderedBundle` outcome no longer reads "unreachable while the hub registers one mode" |
| REQ-010 | Changelogs stay as written | `git diff --cached` over every `changelog/` path shows renames at 100% similarity and no content change |
| REQ-011 | The generated artifacts are regenerated by their own tools, not edited by hand | The advisor graph, the trigger index and the rollout package artifacts differ from HEAD only in lines their generators wrote, and each generator's run is recorded in `implementation-summary.md` |

### Edge Cases

- **A hub-level path collides.** 008 may already hold `manual-testing-playbook/manual-testing-playbook.md`, `benchmark/README.md`, `shared/README.md` or a changelog version. The moved file then merges into that file, or moves to a non-colliding path that the build records, and the disposition table names which
- **A canary moves to `orderedBundle` or `defer`.** A prompt that also matches a `cli-deem` signal can stop routing `single`. That is a routing change, and REQ-006 reverts the move
- **Serving authority drops to legacy.** When `cli-classifier` is missing from `DEFAULT_ON_HUBS`, the front door prints `"servingAuthority":"legacy"` and the replay differs from the baseline. REQ-006 catches it
- **The `004-cli-external-orchestration` canary fixture expects a mode `cli-jev`** (`canary-cases.v1.json:200-214`) from that hub, a remnant of the time the transport lived there. It is reviewed, and its expected route stays whatever that hub routes today
- **008 already added `cli-classifier` to a literal list.** Then only `cli-jev` leaves that list
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `parent-skill-check.cjs .skilled/skills/cli-classifier` exits 0 with two modes, `cli-deem` and `cli-jev`
- **SC-002**: The post-move replay matches the baseline on all 7 canary cases and all 3 hub-routing scenarios
- **SC-003**: `git ls-files .skilled/skills/cli-jev` prints 0 lines, and no file of the 81 was deleted without a named merge target
- **SC-004**: The stale-path `git grep` of REQ-008 prints nothing

### Proof Plan

| Check | Command | Expected output |
|-------|---------|-----------------|
| Entry gate | read `../008-cli-classifier-hub/spec.md` status, then `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` | Complete, exit 0 |
| Baseline | `node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "<prompt>"` for each of the 10 prompts | 10 JSON route lines, each with exit status, saved before the move |
| Hub count | `git ls-files .skilled/skills/cli-jev \| wc -l` before and after | `81`, then `0` |
| No blind deletion | `git diff --cached -M --name-status` | Renames for moved files, `D` only for merged hub-level files named in the disposition table |
| Hub check | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` | Exit 0 with two modes |
| Replay | the same 10 prompts through `--hub cli-classifier` | `action`, `selectionKind` and `packetId` equal the baseline for each |
| Stale paths | the REQ-008 `git grep` | No output |
| Phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 008-cli-classifier-hub | The move has no target hub | REQ-001 blocks the build until 008 is Complete |
| Dependency | A Deem arm result the operator keeps | Without it, R23 retires `cli-deem` and the move has no reason to run | REQ-001 keeps the phase Planned. Question 49 in `research.md` section 13 asks the operator when 008 lands |
| Risk | A partial move followed by `rm -rf` deletes 22 hub files | High | REQ-003: one `git mv` of every file, a disposition table and a staged-diff check that allows `D` rows only for named merges |
| Risk | A literal list is missed and the hub serves through legacy or not at all | High | REQ-005 and the replay of REQ-006. The seven files were reopened line by line on 2026-09-27 |
| Risk | Merging two `graph-metadata.json` or two `mode-registry.json` files drops a field | Med | `parent-skill-check.cjs` checks 5 to 11 on the merged root, and the replay |
| Risk | The replay normalization hides a real change | Med | Only the hub id, the mode id and `effectivePolicyHash` are normalized. `action`, `selectionKind` and `packetId` must be equal |
| Risk | The footprint count grows between this plan and the build | Low | T004 recounts the 81 and 48 at build HEAD and the disposition table uses the recount |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Research open question 49: should the move wait on a Deem result the operator keeps? The synthesis recommends yes, and this phase assumes yes until the operator answers when 008 lands.
- Where do the hub's two changelog files, `v0.1.0.0.md` and `v0.2.0.0.md`, land if 008's `cli-classifier/changelog/` already holds those versions? They move byte-identical, and the path is decided at build so the changelog-shape check still passes.
- Should the dispatch audit report a `jev` dispatch as skill `cli-classifier` or keep a per-mode label? This phase plans `cli-classifier`, the hub id, as every other hub reports.
<!-- /ANCHOR:questions -->

---
