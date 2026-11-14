---
title: "Feature Specification: Phase 6: ai-council-mode-deprecation"
description: "The system-deep-loop hub registers ai-council as a third workflow mode with its own packet, command, runtime loop type and advisor entries. The operator decided to retire it as a deep mode and keep the council as a standalone agent. This phase removes the mode from every routing surface, keeps the divergent Council pivot working and decides whether one command survives beside the agent."
trigger_phrases:
  - "ai council mode deprecation"
  - "phase 6 ai council mode deprecation"
  - "retire deep-ai-council mode"
  - "standalone ai-council agent"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: ai-council-mode-deprecation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-command-and-skill-doc-alignment |
| **Successor** | None |
| **Handoff Criteria** | The parent packet closes when all six children print `RESULT: PASSED` under `validate.sh --recursive --strict`, the phase 005 doc drift guard exits 0 and the per-hub gate for `system-deep-loop` passes with two modes on the final tree. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the deep-research and deep-review workflow logic hardening specification. It retires `deep-ai-council` as a deep-loop mode and re-homes the council as a standalone agent.

**Scope Boundary**: Every live surface that registers, routes, documents or tests the `ai-council` workflow mode, the `/deep:ai-council` command and the `council` runtime loop type. The `ai-council` agent stays and is rewritten so it depends on no deep-loop file. The divergent Council pivot inside research and review stays. Existing `ai-council/**` artifacts inside spec folders are never touched.

**Dependencies**:
- Phase 004 sets the one-workflow-file-per-command rule that a kept council command follows.
- Phase 005 finishes its research and review doc edits first, so this phase does not collide with them. Several research and review docs name the council as a sibling and this phase edits those lines after phase 005 lands.

**Deliverables**:
- A two-mode `system-deep-loop` hub on every routing surface, with its per-hub gate green.
- A self-contained `ai-council` agent in all eight agent folders, carried through the existing mirror generators.
- Under the recommended D3 option, one council command with one workflow file and one presentation file outside the `deep` family.
- Removal of the council packet, command assets, runtime council code the pivot does not need, advisor entries and their tests, each with a caller check.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On 2026-11-14 the operator decided, in these words: "let's deprecate deep-ai-council completely as a deep mode and instead make it a isolated .agents file maybe with a command workflow and presentation asset for all runtimes". Today the hub still registers `ai-council` as a full workflow mode with its own packet, two workflow files, a `council` loop type in the shared runtime and lexical advisor entries, so a council request routes into the deep-loop hub. The `ai-council` agent body depends on scripts and references inside that packet and tells the agent to run `node` while its frontmatter denies `bash`, so the agent cannot stand alone as it is.

### Purpose
The council runs as one self-contained agent outside `system-deep-loop`, the hub routes only research and review, and the divergent Council pivot keeps working.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Read-only command, run from the repository root on 2026-11-14, with its verbatim output:

```text
$ rg -l --hidden -i 'ai[-_ ]council|aiCouncil|deep-council' -g '!specs/**' -g '!**/node_modules/**' -g '!.git/**' . | wc -l; rg -l --hidden -i 'ai[-_ ]council|aiCouncil|deep-council' -g '!specs/**' -g '!**/node_modules/**' -g '!.git/**' . | awk -F/ '{ if ($2==".skilled" && $3=="skills" && $4=="system-deep-loop") print "hub/" $5; else if ($2==".skilled" && $3=="skills") print "skill/" $4; else if ($2==".skilled") print ".skilled/" $3; else print $2 }' | sort | uniq -c | sort -rn | awk '$1>=3'; node -e 'console.log(require("./.skilled/skills/system-deep-loop/mode-registry.json").modes.map(m=>m.workflowMode).join(" "))'; find -L .skilled/agents .claude/agents .codex/agents .cursor/agents .devin/agents .dsh/agents .opencode/agents .pi/agents -maxdepth 1 -name 'ai-council*' | wc -l; find -L .claude/commands .cursor/commands .opencode/commands .codex/prompts .pi/prompts .dsh/prompts -maxdepth 2 -iname '*council*' | wc -l; rg -l -i 'council' .skilled/skills/system-deep-loop/runtime -g '!node_modules' | wc -l; ls .skilled/skills/system-deep-loop/runtime/lib/council | wc -l; rg -n "require\('\.\./council/" .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts
     451
 139 hub/deep-ai-council
  73 hub/runtime
  41 skill/cli-external-orchestration
  34 skill/system-spec-kit
  22 skill/system-skill-advisor
  18 skill/sk-doc
  17 .skilled/commands
  10 hub/changelog
   9 hub/manual-testing-playbook
   6 hub/shared
   6 hub/benchmark
   6 .skilled/changelog
   5 hub/deep-research
   5 .skilled/agents
   5 .pi
   5 .dsh
   5 .codex
   5 .claude
   4 hub/deep-review
   4 .github
   3 .skilled/hooks
   3 .skilled/bin
research review ai-council
       8
       6
     143
       9
273:const { dispatchCouncilSeats } = require('../council/multi-seat-dispatch.cjs') as {
```

The output reads as follows. 451 files outside `specs/` name the council. The registry holds three modes. 8 agent entries exist across the eight agent folders. 6 runtime command or prompt entries mirror `/deep:ai-council`. 143 runtime files name `council`. `runtime/lib/council/` holds 9 entries. The divergent pivot reads exactly one of them, `multi-seat-dispatch.cjs`. Groups with fewer than three files are left out of the table and listed in `plan.md`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `ai-council` from the hub registry, router, root `ROUTER.md`, graph metadata, command metadata, description, leaf manifest, hub docs, catalogs and playbooks so the hub routes two modes.
- Rewrite the `ai-council` agent so it names no `system-deep-loop` path and runs no script, then carry it to every agent folder through the existing mirror generators.
- Settle D3. The recommended option adds one council command, one workflow file and one presentation file in the `speckit` family and deletes the `/deep:ai-council` command, its assets and its six mirrors.
- Delete the `deep-ai-council` packet and the runtime council code the pivot does not read. Remove only the council members from shared runtime libraries.
- Remove the council from advisor maps, scorer lanes, command bridges, fixtures and tests, and from callers in other skills, hooks, plugins, CI and root docs.

### Out of Scope
- `ai-council/**` artifacts inside any spec folder - D5 protects them, and the validator tolerance test for them stays.
- The divergent pivot logic in `runtime/lib/deep-loop/divergent-pivot.ts` - D4 keeps it, including its `ai-council` path guard.
- Research and review workflow behavior - phases 001 to 005 own it. This phase edits only the prose lines in their docs that name the council.
- Changelog files, dated benchmark reports and spec-copy test fixtures - they record history and stay as written. The packet's own `changelog/` moves to a real folder at `.skilled/changelog/system-deep-loop/deep-ai-council/` before the packet is deleted, because that path is a tracked symlink into the packet today.
- Untracked council graph databases on disk - this phase never deletes an untracked file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/mode-registry.json`, `hub-router.json`, `ROUTER.md`, `graph-metadata.json`, `command-metadata.json`, `description.json` | Modify | Two modes |
| `.skilled/skills/system-deep-loop/leaf-manifest.json` | Regenerate | Two modes |
| `.skilled/skills/system-deep-loop/SKILL.md`, `README.md`, `ARCHITECTURE.md`, `feature-catalog/`, `manual-testing-playbook/`, `shared/` | Modify | Two modes |
| `.skilled/skills/system-deep-loop/deep-ai-council/` | Delete | The mode packet |
| `.skilled/commands/deep/ai-council.md` and its five assets plus compiled and legacy copies | Delete | The deep command |
| `.skilled/commands/speckit/ai-council.md`, `assets/speckit-ai-council.yaml`, `assets/speckit-ai-council-presentation.txt` | Create | The kept command, under the recommended D3 option only |
| `.skilled/agents/ai-council.md`, `.claude/agents/ai-council.md` | Modify | Self-contained agent |
| `.codex/agents/ai-council.toml`, `.pi/agents/ai-council.md`, `.dsh/agents/ai-council.patch.yml` | Regenerate | Mirrors of the agent |
| `.skilled/skills/system-deep-loop/runtime/` council libraries, scripts and tests | Delete/Modify | The D4 removal list in `plan.md` |
| `.skilled/skills/system-skill-advisor/runtime/` maps, lanes, bridges, fixtures and tests | Modify/Regenerate | No deep council mode |
| Callers in other skills, `.skilled/hooks/`, `.opencode/plugins/`, `.github/`, `.env.example`, `README.md` | Modify | The plan inventory |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | D1: `node -e 'console.log(require("./.skilled/skills/system-deep-loop/mode-registry.json").modes.map(m=>m.workflowMode).join(" "))'` prints `research review`. |
| REQ-002 | D1 and D6 stage two: `hub-router.json` `routerPolicy.tieBreak` is `["research", "review"]`, no `routerSignals` or vocabulary class names the council, and root `ROUTER.md` holds no `AI_COUNCIL` key in `INTENT_SIGNALS` or `RESOURCE_MAP`. |
| REQ-003 | D1 and D6: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` exits 0, its `INFO: Parent skill:` line names `.skilled/skills/system-deep-loop`, it prints `PASS: 3b: mode-registry.json declares 2 modes` and it ends with `OK: parent-skill-check`. |
| REQ-004 | D6 replay: for the prompt "convene an ai council to compare three migration plans", `skill_advisor.py` prints no `"mode": "ai-council"`, `"mode": "research"` or `"mode": "review"` row, and `compiled-route.cjs --hub system-deep-loop` prints no `packetId` of `deep-ai-council`, `deep-research` or `deep-review`. |
| REQ-005 | D6 replay: "run a deep research loop on vector index tuning" still routes to mode `research` and "deep review this branch for release readiness" still routes to mode `review`, in both `skill_advisor.py` and `compiled-route.cjs --hub system-deep-loop`. |
| REQ-006 | D4: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts` exits 0 on the final tree. |
| REQ-007 | D2: the agent exists in all eight agent folders and `node .skilled/bin/check-agent-mirror-sync.cjs --all`, `node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs` and the Codex, Pi and DSH agent generators with `--check` each exit 0. |
| REQ-008 | D2: `rg -n 'system-deep-loop|deep-ai-council|/deep:ai-council|append-mode-event|persist-artifacts|node ' .skilled/agents/ai-council.md .claude/agents/ai-council.md` prints nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-009 | D3: `goal.md` holds one line `D3 decision: option A` or `D3 decision: option B`. Under option B, `ls .skilled/commands/speckit/assets/speckit-ai-council*.yaml \| wc -l` prints 1, the command reaches all six runtime command and prompt folders, and the advisor offers `/speckit:ai-council` for the council prompt. Under option A no council command file exists outside `specs/`. |
| REQ-010 | D3: `ls .skilled/commands/deep/ai-council.md .skilled/commands/deep/assets/deep-ai-council-*` fails for every path, and no runtime command or prompt folder holds an entry named `*deep-ai-council*` or `deep/ai-council.md`. The command mirror checkers exit 0. |
| REQ-011 | D4: `git ls-files .skilled/skills/system-deep-loop/deep-ai-council .skilled/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema .skilled/skills/system-deep-loop/runtime/lib/deep-ai-council-reducers .skilled/skills/system-deep-loop/runtime/lib/deep-ai-council-sealed-artifacts` prints nothing, and `ls .skilled/skills/system-deep-loop/runtime/lib/council` lists only `multi-seat-dispatch.cjs` and `README.md`. |
| REQ-012 | D4: each removed runtime file has a caller check in `tasks.md`, and the combined check prints nothing outside changelogs and benchmark reports on the final tree. |
| REQ-013 | D4: `node .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` with `--spec-folder`, `--session-id` and `--loop-type council` prints an `INPUT_VALIDATION` error starting `loopType must be` that no longer names `council`, and the full runtime suite `cd .skilled/skills/system-deep-loop/runtime && npm test` and `npm run typecheck` exit 0. |
| REQ-014 | Advisor: the routing registry drift guard and both deep parity suites pass with two modes, and `cd .skilled/skills/system-skill-advisor/runtime && npm test` and `npm run typecheck` exit 0, with any recaptured baseline recorded in `goal.md` at unchanged thresholds. |
| REQ-015 | Sweep: `rg -l --hidden 'deep-ai-council|deep_ai_council|/deep:ai-council|deep-council|DeepAiCouncil' -g '!specs/**' -g '!**/node_modules/**' -g '!.git/**' -g '!**/changelog/**' -g '!**/benchmark/**' .` prints only files on the allowlist in `scratch/exceptions.md`. |
| REQ-016 | D5: `git diff --name-only <start-sha> -- 'specs/**/ai-council/**'` prints nothing, and `plan.md` names the revert path for every deleted tracked file. |
| REQ-017 | D7: work starts only when phases 004 and 005 show Status Complete, checked by `rg -l -F '\| **Status** \| Complete' ../004-*/spec.md ../005-*/spec.md \| wc -l` printing 2. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The registry prints `research review` and `parent-skill-check.cjs .skilled/skills/system-deep-loop` exits 0 with two modes.
- **SC-002**: A council prompt reaches neither research nor review in either routing stage, and research and review prompts still route to their modes.
- **SC-003**: The divergent pivot tests, the full runtime suite and the full advisor suite exit 0 on the final tree.
- **SC-004**: The agent mirror checks exit 0 and the agent body names no deep-loop path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 004 and 005 at Status Complete | Phase 005 edits research and review docs that also name the council. Running first would collide. | REQ-017 blocks the start. |
| Risk | A council prompt falls through to research or review once the council class is gone | High: the hub routes planning work into a loop that cannot serve it | REQ-004 replays both stages and fails on either mode. |
| Risk | A name-based sweep misses council vocabulary, as the precedent's phase 012 found | Med: dead routing phrases survive in advisor boosters or hub metadata | The sweep task searches vocabulary such as "planning council" and "council deliberation", not only names. |
| Risk | The advisor corpus baseline pins counts that include council prompts | Med: the drift workflow fails before scoring, as the precedent's phase 013 found | Recapture at unchanged thresholds and record the delta in `goal.md`. |
| Risk | The phase is larger than one pass | Med: 451 files outside `specs/` name the council | `goal.md` asks whether to turn this phase into a phase parent. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The runtime suite takes no longer than its start-commit duration, recorded in `goal.md`, since this phase only removes tests.

### Security
- **NFR-S01**: The rewritten agent keeps `bash: deny` and its writes stay limited to `ai-council/**` inside the bound spec folder.

### Reliability
- **NFR-R01**: Every gate the precedent baseline lists exits with the same or better status than at the start commit, with the baseline and final tables in `goal.md`.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a spec folder with no `ai-council/` folder still validates, and one with an old `ai-council/` tree still validates under `multi-ai-council-validator.vitest.ts`.
- Maximum input: the sweep covers all 451 files the inventory lists, and every one ends as edited, deleted or allowlisted.
- Failure path: `convergence.cjs --loop-type council` exits with its input error naming the accepted loop types, instead of loading a deleted module.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | 451 files across the hub, the runtime, the advisor, six other skills and eight agent folders. |
| Risk | 16/25 | Shared runtime libraries, advisor routing and a public command change. Divergent pivot must keep working. |
| Research | 10/20 | The inventory is measured. The D3 choice and the shared library edits need reading at implementation time. |
| **Total** | **48/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- D3: keep a council command, and under which name and family? Recommended: agent plus `/speckit:ai-council` owned by `system-spec-kit`, single round, one workflow file and one presentation file. The alternative is agent only.
- Should this phase become a phase parent with children for wiring, runtime removal and advisor work, as the precedent needed 13 phases? Recommended: keep one phase unless setup shows the runtime removal alone exceeds one pass.
- Should the multi-topic session loop survive in any form? This spec drops it, because it needs the `council` loop type, the council graph and the session scripts that D4 removes.
<!-- /ANCHOR:questions -->

---
