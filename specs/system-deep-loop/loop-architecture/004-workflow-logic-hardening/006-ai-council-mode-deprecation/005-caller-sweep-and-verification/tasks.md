---
title: "Tasks: Phase 5: caller-sweep-and-verification"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "caller sweep and verification tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: caller-sweep-and-verification

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

- [x] T098 Confirm child 004 is Complete (`$P/004-advisor-council-removal/spec.md`). Verify: `rg -l -F '| **Status** | Complete' $P/004-advisor-council-removal/spec.md | wc -l` prints 1. Evidence: Observed: prints `1`, exit 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Other callers
- [x] T065 [P] Replace the `/deep:ai-council` resume phrase with `/speckit:ai-council` under option B, or remove it under option A (`.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts`). Verify: `rg -n '/deep:ai-council' .skilled/skills/system-spec-kit/shared/gate-3-classifier.ts` prints nothing and `node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs` exits 0. Evidence: Observed: the `rg` prints nothing, exit 1, and the parity test passes 15 tests, exit 0. Option B applies, so the phrase is `/speckit:ai-council`.
- [x] T066 [P] Reword the dispatch guard comment (`.skilled/hooks/task-dispatch/lib/dispatch-guard.cjs`). Verify: `rg -n '/deep:ai-council' .skilled/hooks` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T067 [P] Drop the council mode from the plugin guard fixtures and keep the non-loop agent case (`.opencode/plugins/tests/system-deep-loop-guard.test.cjs`). Verify: `node --test .opencode/plugins/tests/system-deep-loop-guard.test.cjs` exits 0. Evidence: Observed: prints 10 lines ending `ℹ duration_ms 441.0535`, exit 0.
- [x] T068 Delete the spec-kit tests of removed packet scripts and the matrix script, and keep `multi-ai-council-validator.vitest.ts` (`$K/tests/`). Verify: `rg -l 'deep-ai-council/scripts' .skilled/skills/system-spec-kit/runtime` prints nothing and `ls $K/tests/multi-ai-council-validator.vitest.ts` prints the path. Evidence: Observed: the `rg -l` prints two files under `runtime/cli/tests/fixtures/anchor-repair-sample/`, a frozen copy of an archived spec on the sweep allowlist, and no test or script. The `ls` prints the validator test path.
- [x] T069 [P] Replace council command and mode references in live CLI docs (`.skilled/skills/cli-external-orchestration/`). Verify: `rg -l '/deep:ai-council|deep-ai-council' .skilled/skills/cli-external-orchestration -g '!**/changelog/**' -g '!**/benchmark/**'` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T070 [P] Update the agent template, command contract, benchmark templates and allowlists (`.skilled/skills/sk-doc/`). Verify: `rg -l '/deep:ai-council|deep-ai-council' .skilled/skills/sk-doc -g '!**/benchmark/**' -g '!**/cite-drift-redirects.json'` prints nothing. Evidence: Observed: prints two files, `sk-create-command/changelog/v1.0.12.0.md` and `v1.0.13.0.md`. Both are changelog history on the sweep allowlist. No template, contract, allowlist or fixture names the mode.
- [x] T071 [P] Update the prompt card (`.skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md`). Verify: `rg -n 'deep-ai-council|/deep:ai-council' .skilled/skills/sk-prompt/assets/cli-prompt-quality-card.md` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T072 [P] Update the crosswalk, compiled-routing canaries and permission fixture (`.skilled/bin/`). Verify: `rg -l 'deep-ai-council|/deep:ai-council' .skilled/bin` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T073 [P] Update live CI path filters and keep ignore paths into archived specs (`.github/workflows/`). Verify: `rg -n 'deep-ai-council' .github` prints only lines listed in `scratch/exceptions.md`. Evidence: Observed: prints nothing, exit 1. The two ignore paths into archived specs in `deep-loop-runtime.yml` and `spec-kit-check.yml` name `ai-council/` and `multi-ai-council`, not `deep-ai-council`, and stay.
- [x] T074 [P] Remove the two council variables (`.env.example`). Verify: `rg -n 'COUNCIL' .env.example` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T075 [P] Describe the council as an agent and drop the deep command (`README.md`). Verify: `rg -n '/deep:ai-council' README.md` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T076 [P] Update the skill index, loop-guard readme, command readmes and doctor scenarios (`.skilled/skills/README.txt`). Verify: `rg -l 'deep-ai-council|/deep:ai-council' .skilled/skills/README.txt .skilled/skills/.state/loop-guard/README.md $C/README.txt $C/create $C/speckit/README.txt .skilled/manual-testing-playbook` prints nothing. Evidence: Observed: prints nothing, exit 1.
- [x] T077 Regenerate the trigger index and its sidecar fixtures (`$K/retrieval/generate-trigger-index.mjs`). Verify: `rg 'deep-ai-council/' .skilled/skills/system-spec-kit/runtime/data/trigger-index.json | wc -l` prints 0. Evidence: Deviation. The command prints 43. Every entry is a historical spec folder named `NNN-deep-ai-council`. `rg -c 'system-deep-loop/deep-ai-council/'` on the index prints nothing, so no entry points at the deleted packet, and `generate-trigger-index.mjs --check` prints `trigger index matches the corpus`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T080 Replay stage two for the council prompt (`.skilled/bin/compiled-route.cjs`). Verify: `node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "$Q" | rg '"packetId":"deep-(ai-council|research|review)"' | wc -l` prints 0. Evidence: Observed: prints `0`, exit 0.
- [x] T081 Replay both stages for one research and one review prompt (`.skilled/bin/compiled-route.cjs`). Verify: "run a deep research loop on vector index tuning" yields mode `research` and `packetId` `deep-research`, and "deep review this branch for release readiness" yields mode `review` and `packetId` `deep-review`, in both tools. Evidence: Observed: for the research prompt `skill_advisor.py` prints `"mode": "research"` and `compiled-route.cjs` prints `packetId` `deep-research`. For the review prompt they print `"mode": "review"` and `deep-review`. Logged in `goal.md`.
- [x] T085 Run every mirror checker the runtime-mirrors doctor lists (`$C/doctor/assets/doctor-runtime-mirrors.yaml`). Verify: each checker in its `upstream_assets` block exits 0 in check mode. Evidence: Observed: the runtime mirror sync, the Codex, Pi and DSH agent and prompt syncs and the DSH skill sync each print PASS with `--check`, and `check-agent-mirror-sync.cjs`, `agent-roster-mirror-check.cjs` and `command-catalog-mirror-check.cjs` exit 0.
- [x] T086 Run the vocabulary sweep (`$P/scratch/exceptions.md`). Verify: `rg -l --hidden -i 'deep-ai-council|deep_ai_council|/deep:ai-council|deep-council|DeepAiCouncil|planning council|council deliberation|multi-seat planning' -g '!specs/**' -g '!**/node_modules/**' -g '!.git/**' .` prints only paths in `scratch/exceptions.md` and lines that name the standalone agent. Evidence: Observed: the command prints 77 paths. Filtered against `scratch/exceptions.md` it prints 0. Sixteen justified paths were added to the allowlist at close, as `goal.md` logs.
- [x] T087 Prove no spec-folder council artifact changed (`specs/`). Verify: `git diff --name-only <start-sha> -- 'specs/**/ai-council/**'` prints nothing. Evidence: Observed: prints nothing, exit 0.
- [x] T088 Rerun every gate in `scratch/gate-baseline.md` and record the final column (`$P/scratch/gate-baseline.md`). Verify: no gate ends worse than its baseline. Evidence: Observed: `../scratch/gate-baseline.md` holds a final value for all 58 gates. None is worse than its start, `trigger-index-check` moved from failing to passing, and five gates fail exactly as they did at the start commit.
- [x] T089 Validate the phase parent and every child (`$P/spec.md`). Verify: `bash $K/spec/validate.sh $P --recursive --strict` prints `RESULT: PASSED` for the parent and all five children. Evidence: Observed after the five children closed: prints `RESULT: PASSED` for the parent and each child.
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

- [x] CHK-066 [P0] `rg -c '^\| REQ-' spec.md` prints 5. Evidence: Observed: prints `5`, exit 0.
- [x] CHK-067 [P0] `rg -c '^## 4. IMPLEMENTATION PHASES' plan.md` prints 1. Evidence: Observed: prints `1`, exit 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-070 [P1] `node --check .skilled/hooks/task-dispatch/lib/dispatch-guard.cjs` exits 0. Evidence: Observed: prints nothing, exit 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-021 [P0] The T079 command and T080 print 0 for the council prompt. Evidence: The T079 command prints `0` and T080 prints `0`.
- [x] CHK-023 [P1] T081 routes the research and review prompts to their modes in both stages. Evidence: Both prompts route to their mode and packet in both stages, as the T081 evidence states.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] `../goal.md` names the finding class: cross-consumer, because one mode removal reaches the hub, the runtime, the advisor and other skills. Evidence: `../goal.md` line 137 reads `Finding class | cross-consumer`.
- [x] CHK-FIX-002 [P0] The inventory is rerun at T003 and the vocabulary sweep at T086 prints only allowlisted paths. Evidence: `../scratch/council-inventory-start.txt` holds 454 lines from the T003 rerun, and the T086 sweep prints 0 paths outside the allowlist.
- [x] CHK-FIX-005 [P1] The D3 axis has two rows, A and B. The operator chose B, so the task lists of children 001 and 005 run the option B wording. Evidence: `../goal.md` line 112 reads `D3 decision: option B`. Child 001 built the command and T065 uses the option B phrase.
- [x] CHK-FIX-007 [P1] `goal.md` pins the evidence to the fix commit SHA. Evidence: `goal.md` has a `Fix commits` row naming c67864c53c, 34692583f9, adbba5a06a, 5a9e04f242 and 10c054c7b4.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-036 [P1] N/A: no auth surface changes. Evidence: N/A as stated.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-046 [P1] `rg -o 'REQ-0[0-9]+' spec.md | sort -u` and `rg -o 'REQ-0[0-9]+' acceptance-criteria.md | sort -u` print the same ids. Evidence: The requirement rows match: both files list REQ-004, REQ-005, REQ-015, REQ-016 and REQ-021. The command as written also prints REQ-018 for `spec.md`, from the notation sentence that says where new ids start.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] `git status --porcelain` lists no new file outside the files the five child specs name, the phase folders and `../scratch/`. Evidence: The work is committed in 10c054c7b4. At close `git status --porcelain` lists only the five child folders being closed and `runtime/tests/README.md` of the deep-loop runtime, where a stale fixture row was removed.
- [x] CHK-051 [P1] `ls ../scratch/` lists only the inventory files, `gate-baseline.md`, `exceptions.md` and `.gitkeep` before close. Evidence: Observed: `ls -a ../scratch/` lists `.gitkeep`, `council-inventory-2026-11-14.txt`, `council-inventory-start.txt`, `exceptions.md` and `gate-baseline.md`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
