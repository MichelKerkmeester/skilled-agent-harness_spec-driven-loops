---
title: "Implementation Plan: Phase 5: consumers-and-routing"
description: "Plan for the Phase 5 readers, quality rows, routing vocabulary, agent mirrors, outside validators, versions and changelogs of the sk-code quality gate program."
trigger_phrases:
  - "consumers and routing plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 5: consumers-and-routing

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON and Node CommonJS, with the existing Python validators |
| **Framework** | None. The sk-code hub and the sk-doc validators ship in this repository |
| **Storage** | Files only. No database and no cache |
| **Testing** | `node --test`, the bash drift guards, `check-agent-mirror-sync.cjs --all`, `validate.sh --strict` and `validate_document.py` |

### Overview
This phase makes three workflows read the quality run verdict, and it gives the routing layers the same restraint vocabulary. It edits shared references, two packet documents, the hub registries, the @code agent with its mirrors, and two outside validators, then regenerates the derived metadata. Each change is proved by the drift guards, the metadata gate, the mirror check, the stage-two replay test and the routing canaries in section 5.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 2 (`002-builtin-runner`) landed, and its verdict fields and runner-contract resource exist on disk
- [ ] Phase 4 (`004-doctrine`) landed, and `rg -n 'universal floor' .skilled/skills/sk-code/shared/references/phase-detection.md` prints a line
- [ ] Baselines in section 5 were re-run on the branch head, and the outputs match or the difference is recorded

### Definition of Done
- [ ] All acceptance criteria in `acceptance-criteria.md` are Met or Waived by an ADR that exists
- [ ] The drift guards, the metadata gate, the mirror check and the stage-two test pass with the outputs named in tasks.md
- [ ] Docs updated (spec, plan, tasks, acceptance criteria, decision record, goal, implementation summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declaration and reader pairs. Each producer field has a named reader, and each reader names the field it consumes. A declaration lives in one registry or one outside `graph-metadata.json` block, and a validator rejects a malformed declaration.

### Key Components
- **Run verdict readers**: `workflow-verify.md` step 2, the @code RETURN `Quality Gate` field and `sk-code-review` evidence input. They read the verdict but never produce it.
- **Quality declarations**: `quality.checklists[]` rows in `mode-registry.json` (SKILLED and sk-code-ci) and in an outside skill's `graph-metadata.json`. Rows carry checklists only, never commands.
- **Validators**: `ci-skill-root-metadata.cjs` for outside blocks, and the registry compiler for hub rows. Each names one violation code.
- **Routing vocabulary**: `ROUTER.md` INTENT_SIGNALS and RESOURCE_MAP (stage two), `hub-router.json` vocabulary classes, `mode-registry.json` aliases, `graph-metadata.json` `intent_signals` and `description.json` keywords (stage one).
- **Agent mirrors**: `.skilled/agents/code.md` is canonical. `.claude/agents/code.md` is hand-synced. `.codex/agents/code.toml` and `.pi/agents/code.md` are generated.

### Data Flow
A request enters stage one, where the advisor scores the hub from `graph-metadata.json`. The hub's `ROUTER.md` then picks the intent and the resources at stage two. A quality run produces a verdict in Phase 2. The @code agent records the verdict in its RETURN, `sk-code-review` reads it as evidence, and `workflow-verify.md` hands any unverified id to verification. The validators run at the metadata gate and the registry compile, before any of this runs.

### Design Citation Check
The design line numbers were re-checked against the tree on the branch head. Corrections are listed here so the reviewer sees each one.

| Design citation | Finding at this tree | Action |
|-----------------|----------------------|--------|
| 5.5 `ci-skill-root-metadata.cjs:80-88` "allows `quality`" | Lines 80 to 88 allow `surface_detection` at line 87. `quality` is not allowed | Add `quality` to the allowed top-level keys. The design statement was wrong |
| 5.5 `skill-root-metadata-contract.md:130,147` | The file lives at `references/shared/skill-root-metadata-contract.md`. Lines 130 and 147 are the right rows | Path corrected in tasks |
| 5.5 `ROUTER.md:268-280` CODE_QUALITY resources | The CODE_QUALITY resource list spans lines 268 to 282 | Use 268 to 282 |
| 5.5 hub version at `SKILL.md:5`, `hub-router.json:3`, `mode-registry.json:3` | `description.json:4` carries the same hub version, as `SKILL.md` line 17 requires | Added `description.json` to the bump |
| 5.5 `ROUTER.md` version | ROUTER.md keeps its own document version, `2.2.21.0` at line 17 | Added the ROUTER.md bump |
| 5.5 `mode-registry.json:37` and `:74` aliases | Confirmed. Line 37 is the sk-code-quality aliases, line 74 the sk-code-skilled aliases | None |
| 5.5 `hub-router.json:50` and `:71` | Confirmed. Line 50 is the quality-gates keywords and line 71 the code-skilled-runtime keywords | None |
| 5.5 SKILLED entry `:61-85`, sk-code-ci entry `:86-103` | Confirmed | None |
| 5.5 `ROUTER.md:242` | Confirmed. The CODE_QUALITY INTENT_SIGNALS line | None |
| 5.5 `graph-metadata.json` signals | Confirmed. None of "comment hygiene", "yagni", "over-engineering" is present today | None |
| 5.6 `.skilled/agents/code.md:64-69`, `:145`, `:184`, `:302-313`, `:330`, `:360` | Confirmed. Line 145 is the Mode 1 RETURN signals column that holds "quality-gate result" | None |
| 5.6 mirrors "`.claude` and `.codex`" | Six trees exist. `.pi/agents/code.md` is generated too, and `.cursor` and `.devin` link to `.claude` | Added `.pi` to the regeneration step |
| 5.6 `check-agent-mirror-sync.cjs:6-12` | Confirmed. The header describes the mirror layout | None |
| 5.3 `workflow-verify.md:47,55,56,58`, `workflow-implement.md:41,119`, `workflow-debug.md:41,147` | Confirmed | None |
| 5.4 `verify-doc-claims.cjs:58` | Confirmed. The reason reads "a versioned schema id that other tools consume" | None |
| 5.4 `sk-code-review/SKILL.md:22,29` | Confirmed. Line 22 lists "quality gate" in the activation triggers and line 29 in the keyword triggers | None |
| 5.4 `sk-code-ci/SKILL.md:109` | Confirmed | None |
| 5.5 `registry-compiler.cjs:250-278` | Confirmed. `validateSurfaceDetection` spans that range | None |
| 1.3 `router-replay-lib.cjs:773` exports | Confirmed. The export list names `routeSkillResources` | None |
| 6.5 "hub benchmark replay shows no regression" | The Lane C harness is retired. `benchmark/README.md` says no new run can start from it | Replaced by the successor gate and the canaries. ADR-006 |
| 6.5 second canary expects `sk-code-ci` as a surface bundle | Stage one returns `single` today. Stage two returns `CI_WORKFLOW` in `surfaceIntents` | Recorded as AC-018, Unmet until decided. ADR-006 |
| 6.5 stage-two test for "apply yagni to this change" | Baseline `surfaceIntents` is empty, so the test starts red | AC-006 |

### Design Judgements in This Phase
- The design asks Phase 5 to drop the SKILLED language checklists from ROUTER CODE_QUALITY. This phase keeps them. The benchmark the design used to judge the drop is retired, and the language overlay alone is not measured. ADR-003 records the choice.
- The design places the sk-code-ci quality row in Phase 5, but fixture F14 in Phase 2 needs that row. This phase treats the row as Phase 2 output and confirms it. Only a missing row is added here.
- The design lists `QUALITY_DECLARATION_INVALID` under Phase 5 and "compiler validation" under Phase 2. This phase adds the rule only if Phase 2 left it out.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A. This phase adds consumers and declarations. It fixes no defect, so the fix inventories do not apply. The surface inventory is the table in section 3 and the file list in spec.md section 3.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`.

### Phase 1: Setup
Confirms the Phase 2 and Phase 4 dependencies and records the baselines. It edits no file. Tasks T001 to T006.

### Phase 2: Implementation
Makes the readers, declarations, validators, vocabulary, mirrors, versions and tests. Tasks T007 to T040.

### Phase 3: Verification
Runs the gates and the canaries, then records their exact output. Tasks T041 to T057.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the commands from the repository root. Each row names the command and the line it must print.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The stage-two restraint replay in `router-stage-two-quality.test.cjs`, the metadata gate cases in `skill-root-metadata-contract.test.cjs`, and the compiler rule in `quality-declaration.test.cjs` | `node --test` |
| Integration | Fixture F15 in the Phase 2 runner test, and the drift guards, the metadata gate, the derived and leaf freshness gates, the mirror check and the intent carry check | `node --test`, bash, node |
| Routing | The canaries below, run once before edits and once after, with exact output recorded | `compiled-route.cjs`, `skill-advisor.cjs`, `routeSkillResources` |
| Manual | Read the three reader lines, the @code QUALITY step and the review trigger line once each | Editor read |

### Baseline observed in the authoring pass, before any edit

These outputs were read on the branch head during the authoring pass. The tasks repeat the check, so a later run can show any drift.

- `node .skilled/bin/check-agent-mirror-sync.cjs --all` printed `11 agent(s) checked, all mirrors in sync`, exit 0.
- `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` printed `checked=14 passed=14 failed=0 fixed=0`, exit 0.
- `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs --format json` printed `"stale": 0`, exit 0.
- `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check` printed `checked=7 hub(s), missing=0`, exit 0.
- `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check` and `node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check` each printed `PASS: 11 agents are in sync.`, exit 0.
- `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` printed `run-all-drift-guards: all 4 guards PASSED`, exit 0.
- `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-doc-claims.cjs` printed `doc-claims: 4/4 checks passed`, exit 0.
- `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/sk-code` printed `leaf-manifest.json OK`, exit 0.
- `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-code` printed `OK: parent-skill-check`, exit 0.

### Routing canaries

Each canary is run after the edits. The baseline column is what the branch printed before any edit.

| # | Command | Baseline | Expected after this phase |
|---|---------|----------|---------------------------|
| 1 | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on the agent file I edited under .skilled/agents"` | `selectionKind` single, target `sk-code-quality` | Target `sk-code-quality` |
| 2 | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "run the quality gate on my edited .github/workflows/ci.yml"` | `selectionKind` single, target `sk-code-quality`. Stage two carries `CI_WORKFLOW` | `sk-code-quality` first, with `sk-code-ci` as a surface. Measured result goes to ADR-006 |
| 3 | `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "quality gate for my rails app before I claim done"` | Target `sk-code-quality` | Target `sk-code-quality` |
| 4 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"check comment hygiene on these files"}' --format json` | `"recommendations": []` | `sk-code` at confidence 0.8 or above |
| 5 | `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"simplify this README paragraph"}' --format json` | `"recommendations": []` | `sk-code` below 0.8 or absent |
| 6 | Stage-two replay of "apply yagni to this change" through `routeSkillResources` | `surfaceIntents` empty | `surfaceIntents` includes `CODE_QUALITY` |
| 7 | Out-of-domain replays of "over-engineering", "yagni" and "comment hygiene" in prose, as the hub routing rule requires for each new alias | Not measured before the edit | `sk-code` below 0.8 for each phrase |

Canary 2 is the open gap. Its stage-one result decides ADR-006 and AC-018.

### Targets carried from Phase 6

These targets belong to Phase 6. This phase records the canary and replay numbers so that Phase 6 can compare against them. They are not gates for this phase.

- Recall of 1.0 on the seeded exact labels in fixture F01.
- Zero findings on the false-positive set in fixture F02.
- Under 2 seconds of built-in checks for 50 changed files.
- No passing claim in any live transcript.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node CommonJS runtime (`node --test`, `node -e`) | Internal | Green. Present on this machine | The validators and the tests cannot run |
| Python 3 for the Python validators in `validate_document.py` and the skill-graph compiler | Internal | Green. Present on this machine | The document checks and the graph compile cannot run |
| `system-spec-kit/shared/dist/frontmatter/parse-frontmatter.js` build output for the mirror check | Internal | Green. The file exists | The mirror check reports not checkable |
| 002-builtin-runner verdict, envelope grammar, runner-contract resource and F14 and F16 rows | Internal phase | Yellow. Not yet built | The readers have nothing to read, and F14 and F16 cannot pass |
| 004-doctrine Iron Law 3 wording | Internal phase | Yellow. Not yet amended | The unknown-surface lines quote the old rule |
| `validate.sh` and `validate_document.py` | Internal | Green | The packet cannot close |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a drift guard, the metadata gate or the mirror check fails and cannot be fixed inside this phase's scope, or the stage-two replay or a canary moves a route that was correct before the edit.
- **Procedure**: this phase commits nothing. Restore each file in the table in spec.md section 3 to the branch head that the phase started on, using `git diff` to list the changed paths first. Rerun the baselines in section 5 and confirm they match the baseline outputs. A committed phase reverts with `git revert <phase commit>` once the operator approves the commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
002-builtin-runner ──────┐
                         ├──► 005-consumers-and-routing ──► 006-measurement
004-doctrine ────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (this packet) | 002-builtin-runner and 004-doctrine landed | Implementation |
| Implementation (this packet) | Setup | Verification |
| Verification (this packet) | Implementation | 006-measurement |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Assumption: these are planning estimates, not measured times.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | About 30 minutes |
| Core Implementation | Med | About 4 to 6 hours |
| Verification | Low | About 1 hour |
| **Total** | | **About 6 to 8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
N/A. This phase ships markdown, JSON and validator code. It deploys no service and holds no feature flag.

### Rollback Procedure
N/A for a service. The file-level rollback is section 7 above.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The phase changes no stored data.
<!-- /ANCHOR:enhanced-rollback -->

---
