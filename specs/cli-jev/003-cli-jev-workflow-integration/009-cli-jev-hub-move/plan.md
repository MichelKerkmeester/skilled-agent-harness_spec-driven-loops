---
title: "Implementation Plan: Move cli-jev into the cli-classifier Hub"
description: "Record a route replay of the 7 canary cases and 3 hub-routing scenarios, then in one commit git mv all 81 cli-jev hub files into the proposed cli-classifier hub, merge the hub-level files, register mode cli-jev over packet cli-usage and update every literal list. The replay must match the baseline, or the commit is reverted."
trigger_phrases:
  - "cli-jev hub move plan"
  - "cli-jev git mv plan"
  - "cli-classifier merge hub files"
  - "cli-jev route replay plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Move cli-jev into the cli-classifier Hub

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Git renames, JSON registries, CommonJS and ES module literal lists, one TypeScript list, Markdown skill docs |
| **Framework** | The compiled router (`.skilled/bin/compiled-route.cjs` and `.skilled/bin/lib/compiled-routing/`), the parent-hub checker `.skilled/commands/doctor/scripts/parent-skill-check.cjs` and the advisor and trigger-index generators |
| **Storage** | None. The baseline and post-move replays go to this phase's `scratch/` |
| **Testing** | A before and after route replay over 10 prompts, `parent-skill-check.cjs` on the merged hub, a staged-diff check for deletions and a stale-path `git grep` |

### Overview

The hub `cli-jev` moves under `cli-classifier` (proposed, phase 008) as mode `cli-jev` over its packet `cli-usage`, beside `cli-deem` (proposed, phase 008). system-deep-loop is the model: mode `research` runs over packet `deep-research`. The work is a routing identity change, so the plan guards against two failures, a lost file and a changed route. A baseline replay is taken first. Then one commit moves every file with `git mv`, merges the hub-level files into the `cli-classifier` root, updates each literal list and regenerates the derived artifacts. The post-move replay must match the baseline on every prompt, and any mismatch reverts the commit.

The source is `../007-classifier-deep-research/research/research.md` section 14 (`### 009-cli-jev-hub-move (new)`) and R23 in section 12.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [ ] 008-cli-classifier-hub is Complete and `parent-skill-check.cjs` passes on `.skilled/skills/cli-classifier`
- [ ] The operator keeps a Deem arm result (research open question 49)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The post-move replay matches the baseline on all 10 prompts
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A parent hub with one packet per mode, as system-deep-loop is built. The hub root owns `SKILL.md`, `README.md`, `ROUTER.md`, `mode-registry.json`, `hub-router.json`, `graph-metadata.json`, `description.json` and `leaf-manifest.json`. Each packet folder below it keeps its own `SKILL.md` and references. The advisor routes the hub identity, and the hub resolves the mode. Metadata-class modes have no advisor entry of their own (`skill-hub-routing.md:51`, ledger row 90).

### Key Components

- **Route replay**: the front door `node .skilled/bin/compiled-route.cjs --hub <hub> --prompt "<prompt>"`, the command the hub's own benchmark script `benchmark/reports/2026-09-26--manual-testing-playbook--hub-routing-phrasings/raw/hub-routing-run.sh` uses. Its prompts are the 7 canary cases in `009-parent-hub-rollout/008-cli-jev/fixtures/canary-cases.v1.json` (`jev-choice-single`, `jev-hub-name-single`, `jev-judgment-alias-single`, `jev-score-single`, `zero-signal-defer`, `jev-alias-narrowness` and `forbidden-reject`) and the 3 hub-routing scenarios CJ-001, CJ-002 and CJ-003 in `manual-testing-playbook/hub-routing/`.
- **Replay comparison**: per prompt, `action`, `selectionKind` and each target's `packetId` must be equal. Hub id `cli-jev` reads as `cli-classifier` and mode `cli-usage` as `cli-jev`, because the rename is the point of the phase. `effectivePolicyHash` and `generation` are ignored, because the merged registry changes them by construction.
- **Disposition table**: all 81 tracked files with their target. The 59 in `cli-usage/` move to `cli-classifier/cli-usage/`. The 14 in `benchmark/`, `manual-testing-playbook/`, `shared/` and `changelog/` move into the matching `cli-classifier` subtree. The 8 hub-root files merge into the `cli-classifier` root files 008 creates. A hub-level file whose path 008 already holds merges into that file or moves to a recorded free path.
- **Mode registration**: a `cli-jev` entry in the merged `mode-registry.json` with `workflowMode` `cli-jev`, `packet` and `packetSkillName` `cli-usage`, `packetKind` `transport`, `backendKind` `cli-dispatch`, `routingClass` `metadata`, today's aliases and tool surface, and membership in the `transport-axis` list. The merged `hub-router.json` carries today's `cli-usage-aliases` and `jev-dispatch` vocabulary under mode `cli-jev` and lists both modes in `tieBreak`.
- **Literal lists**: the seven files reopened on 2026-09-27. `compiled-route.cjs:35`, `compiled-route-sync.cjs:59`, `compiled-route-guard.cjs:47`, `compiled-routing-flag.ts:19` and `:37`, `resolve.cjs:36-44` (`cli-jev` at `:41`, comment at `:30`), `serving-closure.manifest.json:5-13` (`cli-jev` at `:10`) and `dispatch-audit.mjs:46`, `:234` and `:237`.
- **Rollout package**: `009-parent-hub-rollout/008-cli-jev/` (canary fixture, `harness/build-artifacts.cjs`, `lib/policy-card.cjs`, `lib/registry-compiler.cjs`, `lib/router.cjs`) compiles the two-mode registry and serves under the `cli-classifier` map entry.
- **Derived artifacts**: the advisor graph `skill-graph.json` and its parity fixture, the trigger index `trigger-index.json` and its retrieval fixtures, regenerated by their own tools.

### Data Flow

A prompt reaches the front door with `--hub cli-classifier`. `resolve.cjs` finds the hub in `DEFAULT_ON_HUBS` and serves it compiled. `compiled-route.cjs` maps the hub to its rollout package, whose router scores the prompt against the merged `hub-router.json` signals and returns mode `cli-jev` with packet `cli-usage`, or `cli-deem`, or a bundle, a deferral or a rejection. A `jev` dispatch seen by the dispatch hook is recorded by `dispatch-audit.mjs` under `cli-classifier` with packet path `cli-classifier/cli-usage`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### First Slice, in Order

1. Confirm the entry gate: 008 is Complete, `parent-skill-check.cjs` passes on `.skilled/skills/cli-classifier` and the operator has named the kept Deem arm result. Stop here otherwise.
2. Record the baseline replay of the 10 prompts through `--hub cli-jev` with each exit status, and recount the hub (81) and the naming files (48) at build HEAD.
3. Write the disposition table for all 81 files.
4. `git mv` every file per the table, merge the hub-level files, register mode `cli-jev` and update every literal list, mirror, agent and README. Regenerate the derived artifacts.
5. Check the staged diff for deletions, run `parent-skill-check.cjs` and the post-move replay, then commit once.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Commands run from the repository root.

| Check | Command | Expected output |
|-------|---------|-----------------|
| Hub before | `git ls-files .skilled/skills/cli-jev \| wc -l` | `81` |
| Baseline | `node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "<prompt>"` for each of the 10 prompts | Route JSON and exit status per prompt, saved in `scratch/route-baseline.txt`. Four canaries route `single` to `cli-usage`, two `defer` and one `reject`, as the fixture expects |
| No blind deletion | `git diff --cached -M --name-status` | `R` rows for every moved file. `D` rows only for hub-level files the disposition table names as merged |
| Hub after | `git ls-files .skilled/skills/cli-jev \| wc -l` | `0` |
| Hub check | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` | Exit 0, two modes |
| Replay | the 10 prompts through `--hub cli-classifier` | Equal `action`, `selectionKind` and `packetId` per prompt. Any difference triggers the kill criterion |
| Changelogs | `git diff --cached -M --stat -- '**/changelog/**'` | Renames at 100% similarity, no content lines |
| Stale paths | `git grep -l '\.skilled/skills/cli-jev/' -- . ':!specs' ':!**/changelog/**' ':!**/benchmark/reports/**'` | No output |
| Dispatch audit | the two dispatch tests under `.skilled/hooks/dispatch/lib/` | Pass with the new skill id and packet path |
| Phase docs | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

008-cli-classifier-hub must be Complete, with the `cli-classifier` root and `cli-deem` routed. The operator must keep a Deem arm result, which answers research open question 49. R23's keep rule retires `cli-deem` and cancels this phase when no Deem arm prints a result the operator keeps. No package is installed, and no Jev or Deem call is made.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The move, the merges, the literal lists and the regenerated artifacts land in one commit, so `git revert <move-commit>` restores the `cli-jev` hub, its 81 files and every list. After the revert, rerun the 10-prompt replay through `--hub cli-jev` and confirm it matches the baseline, then run `parent-skill-check.cjs .skilled/skills/cli-jev`. The kill criterion calls for this revert when any canary case or hub-routing scenario routes differently after the move.
<!-- /ANCHOR:rollback -->

---
