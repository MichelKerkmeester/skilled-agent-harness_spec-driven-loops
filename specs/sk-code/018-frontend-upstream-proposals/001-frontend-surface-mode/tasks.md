---
title: "Tasks: Phase 1: frontend-surface-mode"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "frontend surface mode tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: frontend-surface-mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`H` is `.skilled/skills/sk-code`. `P` is `$H/sk-code-frontend`. `RCH` is `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`. `SRC` is the Barter set at `barter/ai-speckit/skilled/barter-overlays/sk-code/shared/references/frontend/` in the primary checkout.
<!-- /ANCHOR:notation -->

---
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture the reach baseline before any edit (`scratch/reach-baseline.txt`). Verify: `RCH --hub sk-code --concurrency 2`, then `--hub sk-design` and `--hub mcp-tooling`, each print a summary line saved to the file.
- [ ] T002 Get the operator's React Native ruling and record it as ADR-001 (`decision-record.md`). Verify: `rg -n "ADR-001" decision-record.md` prints the heading.
- [ ] T003 [P] Inventory `SRC` and mark each file port, rewrite or Barter-only (`scratch/source-inventory.md`). Verify: the inventory lists all 16 files, with `barter-design-tokens.md` marked Barter-only.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create the packet identity and reader entry (`$P/SKILL.md`, `$P/README.md`) modeled on `$H/sk-code-ci/`. Verify: `ls $P` lists both.
- [ ] T005 Port the core page with the layer model, the principles, the Frontend overrides contract and the stack-layer and topic index (`$P/references/frontend-practice.md`). Verify: `rg -n "Frontend overrides" $P/references/frontend-practice.md` prints the contract heading.
- [ ] T006 Port the web stack layer and the six web topic files, rewriting each Support line against web-features Baseline (`$P/references/web-*.md`). Verify: `rg -c "Baseline" $P/references/web-*.md` prints a count of 1 or more for every file.
- [ ] T007 Port the native stack layer and five native topic files, only if ADR-001 allows (`$P/references/react-native-*.md`, `native-*.md`). Verify: ADR-001 says yes and the files exist, or ADR-001 says web-only and no native file exists.
- [ ] T008 Write the five-pass check (`$P/references/figma-to-code.md`). Verify: `rg -n "INCOMPLETE|UNKNOWN" $P/references/figma-to-code.md` prints the verdict rule and the table cells.
- [ ] T009 Write the packet machine router with one intent per stack layer and the topic index as leaves (`$P/ROUTER.md`). Verify: `rg -n "## MACHINE ROUTER" $P/ROUTER.md` prints one line.
- [ ] T010 Register the surface (`$H/mode-registry.json`, `$H/leaf-manifest.json`). Verify: `rg -n "sk-code-frontend" $H/mode-registry.json` hits `modes[]` and `surfaces`.
- [ ] T011 Route the surface: hub vocabulary, resources, `tieBreak` slot before `sk-code-skilled`, stage-two map, section 6 sentence per ADR-001, mode table (`$H/hub-router.json`, `$H/ROUTER.md`, `$H/SKILL.md`). Verify: `rg -n "sk-code-frontend" $H/hub-router.json $H/ROUTER.md $H/SKILL.md` hits all three.
- [ ] T012 Add the reach-proven intent signals with multi-word phrases only (`$H/graph-metadata.json`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check` prints `RESULT: PASSED`.
- [ ] T013 Add the check pointer (`.skilled/skills/mcp-tooling/mcp-figma/SKILL.md`). Verify: `rg -n "sk-code-frontend" .skilled/skills/mcp-tooling/mcp-figma/SKILL.md` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Rerun reach on three hubs from the final state (`scratch/reach-final.txt`). Verify: each run prints `outranked=  0` and `wrong-hub=  0`. An outrank is fixed by renaming the phrase and rerunning all three.
- [ ] T015 Run each `bdg cdp` recipe once live (`scratch/recipe-runs.txt`). Verify: each recipe's command and output are saved; a failing recipe is cut from the stack layer.
- [ ] T016 Replay both stages with a real frontend prompt (`scratch/replay.txt`). Verify: the advisor picks sk-code and `leaf-route-replay.cjs` resolves `sk-code-frontend`.
- [ ] T017 Grep for Barter values (`$P`). Verify: `rg -n -i "barter|@barter-bv|ngx-translate|safari 18|firefox esr" $P` prints nothing.
- [ ] T018 Run the parent-skill checker with the sk-code hub path and the hub tests. Verify: both exit 0, and the checker's subject line names sk-code.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] `scratch/reach-final.txt` shows `outranked=  0` on all three hubs
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision record**: `decision-record.md`, created at T002 for ADR-001
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task blocked on the operator's React Native ruling is marked `[B]` with the date asked, and the web half proceeds.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
- [ ] CHK-004 [P0] `scratch/reach-baseline.txt` holds three summary lines from before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The registry compiler accepts the sk-code hub
- [ ] CHK-011 [P0] `jq . $H/mode-registry.json $H/hub-router.json $H/leaf-manifest.json $H/graph-metadata.json` exits 0
- [ ] CHK-012 [P1] Every topic file is 215 lines or fewer (`wc -l $P/references/*.md`)
- [ ] CHK-013 [P1] The packet follows the `sk-code-ci` packet shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Reach prints `outranked=  0` on sk-code, sk-design and mcp-tooling
- [ ] CHK-022 [P1] A bare-word prompt ("css") still routes as it did at baseline
- [ ] CHK-023 [P1] A check with a pass that cannot run returns `INCOMPLETE`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential or token in any new file
- [ ] CHK-031 [P0] `toolSurface.forbidden` lists `Write`, `Edit` and `Task` for the surface
- [ ] CHK-032 [P1] The check calls no mutating Figma verb
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] The hub `SKILL.md` mode table and `README.md` name the surface
- [ ] CHK-042 [P2] The sk-code changelog records the new surface
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion, keeping the reach, replay and recipe evidence files
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet verified
<!-- /ANCHOR:summary -->

---
