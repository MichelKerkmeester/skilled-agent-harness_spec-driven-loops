---
title: "Tasks: Phase 2: hub-two-mode-wiring"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hub two mode wiring tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 2: hub-two-mode-wiring

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

Shell variables used below. `S` is `.skilled/skills/system-deep-loop`. `R` is `.skilled/skills/system-deep-loop/runtime`. `A` is `.skilled/skills/system-skill-advisor/runtime`. `K` is `.skilled/skills/system-spec-kit/runtime/cli`. `C` is `.skilled/commands`. `P` is the phase parent `specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation`, which holds the shared `scratch/` files and the parent `goal.md`. `H` is this child folder. `Q` is the council prompt "convene an ai council to compare three migration plans". Run every command from the repository root. Task ids come from the task list this phase had before it was split, so a task keeps its id in the child that owns it. Ids from T090 up were added at the split.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T095 Confirm child 001 is Complete (`$P/001-standalone-agent-and-council-command/spec.md`). Verify: `rg -l -F '| **Status** | Complete' $P/001-standalone-agent-and-council-command/spec.md | wc -l` prints 1. Evidence: Observed: prints `1`, exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Deep command removal (D3)
- [x] T018 Delete the deep command doc (`$C/deep/ai-council.md`). Verify: `git ls-files $C/deep/ai-council.md` prints nothing. Evidence: Observed: prints nothing, exit 0.
- [x] T019 Delete both council workflow files and the presentation file (`$C/deep/assets/`). Verify: `git ls-files $C/deep/assets/deep-ai-council-auto.yaml $C/deep/assets/deep-ai-council-confirm.yaml $C/deep/assets/deep-ai-council-presentation.txt` prints nothing. Evidence: Observed: prints nothing, exit 0.
- [x] T020 Remove the `deep/ai-council` entry from the contract compiler (`$R/scripts/compile-command-contracts.cjs`). Verify: `rg -n 'ai-council' $R/scripts/compile-command-contracts.cjs` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T021 Delete the compiled and legacy council copies and their readme rows (`$C/deep/assets/compiled/`). Verify: `rg -l 'deep-ai-council' $C/deep/assets/compiled $C/deep/assets/legacy` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T022 Remove the council symlinks and generated prompts through the sync scripts (`$K/runtime-mirrors/sync-runtime-mirrors.cjs`). Verify: `find -L .claude/commands .cursor/commands .opencode/commands .codex/prompts .pi/prompts .dsh/prompts -maxdepth 2 \( -iname '*deep-ai-council*' -o -path '*/deep/ai-council.md' \) | wc -l` prints 0, and `bash $K/validate-command-tree-parity.sh`, `node $K/codex/sync-prompts.cjs --check`, `node $K/pi/sync-prompts-pi.cjs --check` and `node $K/dsh/sync-prompts-dsh.cjs --check` exit 0. Evidence: Observed: command 1 prints `0`, exit 0; command 2 prints 2 lines ending `[runtime-mirror-sync] PASS: 256 mirrors across 10 trees are in sync.`, exit 0; command 3 prints `[codex-prompt-sync] PASS: 45 prompts are in sync.`, exit 0; command 4 prints `[pi-prompt-sync] PASS: 45 prompts are in sync.`, exit 0; command 5 prints `[dsh-prompt-sync] PASS: 45 prompt stubs are in sync.`, exit 0.

### Hub wiring (D1, D6)
- [x] T023 Remove the mode and the `council` loop type (`$S/mode-registry.json`). Verify: `node -e 'const r=require("./.skilled/skills/system-deep-loop/mode-registry.json");console.log(r.modes.map(m=>m.workflowMode).join(" "), r.extensions["runtime-loop"].runtimeLoopTypes.join(" "))'` prints `research review research review`. Evidence: Observed: prints `research review research review`, exit 0.
- [x] T024 Remove the council tieBreak entry, routerSignals and vocabulary class (`$S/hub-router.json`). Verify: `rg -n -i 'council' $S/hub-router.json` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T025 Remove the `AI_COUNCIL` intent, its resource map and the three-mode prose (`$S/ROUTER.md`). Verify: `rg -n -i 'ai[-_ ]council' $S/ROUTER.md` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T026 Remove council keywords, phrases and the packet path (`$S/graph-metadata.json`). Verify: `rg -n -i 'council' $S/graph-metadata.json` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T027 Remove the command row and the sibling hint (`$S/command-metadata.json`). Verify: `rg -n -i 'council' $S/command-metadata.json` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T028 Remove council keywords from the doctor metadata (`$S/description.json`). Verify: `rg -n -i 'council' $S/description.json` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T029 Replace the tracked changelog symlink with a real folder holding the packet's changelog files, as the precedent did for `deep-improvement` (`.skilled/changelog/system-deep-loop/deep-ai-council`). Verify: `git ls-files -s .skilled/changelog/system-deep-loop/deep-ai-council | rg '^120000' | wc -l` prints 0 and `ls .skilled/changelog/system-deep-loop/deep-ai-council | wc -l` prints the same count as the packet's `changelog/` at the start commit. Evidence: Observed: command 1 prints `0`, exit 0; command 2 prints `20`, exit 0.
- [x] T030 Delete the mode packet (`$S/deep-ai-council/`). Verify: `git ls-files $S/deep-ai-council` prints nothing. Evidence: Observed: prints nothing, exit 0.
- [x] T031 Regenerate the leaf manifest (`$S/leaf-manifest.json`). Verify: `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs $S --check` exits 0 and `rg 'ai-council' $S/leaf-manifest.json | wc -l` prints 0. Evidence: Observed: command 1 prints `leaf-manifest.json OK (eae1c4aea9fd71652ccb85c163cc5115bbee0acf67e97b4bfdb5e4135245fdc0)`, exit 0; command 2 prints `0`, exit 0.
- [x] T032 Refresh the compiled routing artifacts and activation manifests for the hub, and regenerate the remaining compiled deep contracts (`.skilled/bin/compiled-route-sync.cjs`). Verify: `node .skilled/bin/compiled-route-guard.cjs` exits 0. Evidence: Observed: prints 8 lines ending `All hubs fresh or excused: serving matches inputs, and the runtime matches its source.`, exit 0.
- [x] T033 Describe a two-mode hub and point council readers at the agent (`$S/SKILL.md`). Verify: `rg -n 'deep-ai-council|/deep:ai-council' $S/SKILL.md` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T034 [P] Describe a two-mode hub (`$S/README.md`). Verify: `rg -n 'deep-ai-council|/deep:ai-council' $S/README.md` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T035 [P] Describe a two-mode hub (`$S/ARCHITECTURE.md`). Verify: `rg -n 'deep-ai-council|/deep:ai-council' $S/ARCHITECTURE.md` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T036 [P] Remove council entries from the hub catalog and playbook (`$S/manual-testing-playbook/`). Verify: `rg -l -i 'ai[-_ ]council' $S/feature-catalog $S/manual-testing-playbook` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T037 [P] Remove the council rollout key and the council mode from the shared benchmark contract (`$S/shared/`). Verify: `rg -n 'deep-ai-council|deep/ai-council' $S/shared -g '!**/node_modules/**'` prints nothing and `node --test $S/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs` exits 0. Evidence: Observed: command 1 prints nothing, exit 1; command 2 prints 10 lines ending `ℹ duration_ms 5618.095041`, exit 0.
- [x] T038 [P] Replace the council sibling lines in research and review prose (`$S/deep-research/README.md`). Verify: `rg -n 'deep-ai-council' $S/deep-research $S/deep-review -g '!**/changelog/**'` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T094 Point the workflow naming example at a file that still exists, add a changelog entry and bump the version (`.skilled/skills/sk-doc/sk-create-command/SKILL.md`). Verify: `rg -n 'deep-ai-council' .skilled/skills/sk-doc/sk-create-command/SKILL.md` prints nothing and the file the example names exists. Evidence: Observed: prints nothing, exit 1. The example now names `create-command-confirm.yaml`, and `ls .skilled/commands/create/assets/create-command-confirm.yaml` prints the path.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T078 Run the per-hub gate with the hub path (`$S/mode-registry.json`). Verify: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs $S` prints `INFO: Parent skill: .skilled/skills/system-deep-loop`, `declares 2 modes` and `OK: parent-skill-check`. Evidence: Observed: prints 61 lines ending `OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0.
- [x] T091 Validate this child folder (`$H/spec.md`). Verify: `bash $K/spec/validate.sh $H --strict` prints `RESULT: PASSED`. Evidence: Observed: prints 52 lines ending `RESULT: PASSED`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] Every focused check this child names was rerun from its final tree, with output and exit status read
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
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

A task stays `[B]` while the child before this one is not Complete. A `[B]` task blocks close. CHK ids below 060 come from the checklist this phase had before it was split. Ids from 060 up were added at the split.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-060 [P0] `rg -c '^\| REQ-' spec.md` prints 5. Evidence: Observed: prints `5`, exit 0.
- [x] CHK-061 [P0] `rg -c '^## 4. IMPLEMENTATION PHASES' plan.md` prints 1. Evidence: Observed: prints `1`, exit 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-069 [P0] `node --check .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` exits 0 and `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=2`. Evidence: Observed: command 1 prints nothing, exit 0; command 2 prints `[CONTRACT DRIFT] OK commands=2`, exit 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` ends with `OK: parent-skill-check` and prints `declares 2 modes`. Evidence: Observed: prints 61 lines ending `OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-009 [P1] N/A: the caller checks for removed runtime files belong to child 003 and the sweep to child 005. Evidence: N/A as stated.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-033 [P1] N/A: no auth surface changes. Evidence: N/A as stated.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-043 [P1] `rg -o 'REQ-0[0-9]+' spec.md | sort -u` and `rg -o 'REQ-0[0-9]+' acceptance-criteria.md | sort -u` print the same ids. Evidence: The requirement rows match: both files list REQ-001, REQ-002, REQ-003, REQ-010 and REQ-018. The command as written also prints REQ-011 for `spec.md`, from the REQ-018 row at line 138 that cites the packet half of REQ-011, which child 003 owns.
- [x] CHK-041 [P1] `rg -n 'deep-ai-council|/deep:ai-council' .skilled/skills/system-deep-loop/SKILL.md .skilled/skills/system-deep-loop/README.md .skilled/skills/system-deep-loop/ARCHITECTURE.md` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] CHK-042 [P2] `ls -t .skilled/skills/system-deep-loop/changelog | head -1` names a new hub entry that records the removal. Evidence: Observed: prints `v2.0.0.0.md`. The entry records the mode, packet and command removal under Breaking.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-053 [P1] `git status --porcelain` lists no new file outside the files this spec names, this folder and `../scratch/`. Evidence: Observed at close: prints nothing, exit 0. The work is committed in adbba5a06a.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 4 | 4/4 |
| P1 Items | 5 | 5/5 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
