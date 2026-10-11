---
title: "Implementation Plan: Phase 2: removal-plan"
description: "One ordered removal program built from the two research inventories: relocate the agent mirror checker, then delete both improvement modes, the deep-improvement agent and packet, their runtime libraries and every reference, then fix the stale issues the research found and prove zero live references."
trigger_phrases:
  - "removal plan plan"
  - "improvement modes removal program"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: removal-plan

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON, YAML, Markdown, TypeScript, CommonJS, ESM, Python, shell |
| **Framework** | `system-deep-loop` hub, `system-skill-advisor`, `sk-doc`, `system-spec-kit`, seven CLI runtimes |
| **Storage** | Tracked files only, plus the gitignored `BARTER.md` |
| **Testing** | Runtime vitest suite, advisor vitest and Python suites, plugin guard tests, git-hook tests, sk-doc tests, spec validator |

### Overview
Both modes and the `deep-improvement` packet go in one program. Removing them together removes the hardest seam the research found: the agent-improvement lane calls the model-benchmark lane's `run-benchmark.cjs` and default profile, which would need a carve-out if one mode stayed. The one outside dependency on the packet, the agent mirror checker, moves to `.skilled/bin/` first. Implementation runs in a git worktree. DeepSeek V4.1 Flash at max reasoning on DevPass implements each work unit, and the orchestrator verifies every diff and runs the gates.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Both inventories verified (`../001-removal-research/*/research/research.md`)
- [x] Every non-history file outside the packet assigned to exactly one phase (`../00*/scratch/files.txt`)
- [x] Decisions recorded in `decision-record.md`

### Definition of Done
- [ ] Phases 003 to 010 each validate and meet their acceptance criteria
- [ ] A repo-wide search outside `specs/` finds no live reference to either mode, the agent or the packet
- [ ] Every gate in §5 passes on the final state
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-first removal: delete or edit the authoritative sources, then regenerate every derived surface from them, never hand-edit a generated file.

### Key Components
- **`mode-registry.json`**: the hub's single source for modes. The advisor maps, the drift guard, the compiled-routing compiler and both plugin guards derive from it or assert against it.
- **`command-metadata.json`**: the source the advisor's command bridges regenerate from.
- **Runtime mirror generators**: `sync-prompts.cjs`, `sync-prompts-pi.cjs`, `sync-prompts-hermes.cjs` and `sync-agents.cjs` under `system-spec-kit/runtime/cli/`.
- **The agent mirror checker**: a repo-level guard that lives in the packet today and must move before the packet goes.

### Data Flow
Registry and command metadata change first. Generators then rebuild the runtime copies, the advisor bridges, the skill graph, the trigger index and the retrieval fixtures. The gates in §5 read the regenerated state.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-improvement/scripts/check-agent-mirror-sync.cjs` | Agent mirror guard called by both pre-commit hooks, CI and docs | Move to `.skilled/bin/` with its lib, tests and crosswalk doc; repoint every caller (phase 003) | Hook test suite, broken-move drill, `rg check-agent-mirror-sync` shows only the new path |
| Commands, agent and runtime copies | `/deep:agent-improvement`, `/deep:model-benchmark`, `deep-improvement` agent in seven runtimes | Delete sources, regenerate generated copies, delete hand copies (phase 004) | Runtime-mirror doctor, `ls` of each runtime |
| Hub registry, router, metadata, packet | Registers five modes; ships the packet | Remove two modes, delete the packet (phase 005) | Hub conformance checks, compiled-routing canaries |
| Runtime lane libraries and gateway | Ledger schema, reducers and sealed artifacts per lane; append gateway and authority order list both modes | Delete lane and common-improvement libraries; edit gateway, authority, census, adjudication (phase 006) | Runtime vitest suite, runtime validators |
| Advisor and other skills | Alias groups, default-mode fold, bridges, drift guard; sk-doc benchmark families; CLI docs | Remove entries, edit the drift guard, delete the two benchmark families (phase 007) | Advisor suites, sk-doc tests |
| Docs, READMEs, env examples, `BARTER.md` | Describe the modes as live | Remove or rewrite; history files untouched (phase 008) | Repo-wide search |

Required inventories: done in `../001-removal-research/`. The joined coverage check found 560 matching files; the per-phase lists assign every one outside the packet and the history classes.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Work | Files | Gate at phase end |
|-------|------|-------|-------------------|
| 003 agent-mirror-checker-relocation | Move the checker, its lib, two tests and the crosswalk doc to `.skilled/bin/`; repoint 9 callers | 5 moves, 9 edits | `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`, bin vitest, `check-agent-mirror-sync.cjs --all` |
| 004 commands-and-runtime-mirrors | Delete both commands and their 6 assets, the agent and its copies; edit command and agent indexes, the task-dispatch guard and create-command assets; regenerate prompt copies | 31 | Runtime-mirror doctor; task-dispatch tests |
| 005 skill-packet-and-registry | Delete `deep-improvement/` whole; remove both modes from 11 hub root files, hub catalog and playbook, `shared/`, sibling READMEs and compiled-routing stage 009 | 34 plus the packet | Hub checks, compiled-routing canary tests |
| 006 runtime-libraries-and-tests | Delete the six lane libraries and three common-improvement libraries with their tests; edit the gateway, authority order, census, adjudication, legacy projections, validators and remaining tests; drop the stale `skill-benchmark` rows from both plugin guard tests | 84 | Runtime vitest suite, runtime validators, plugin guard tests |
| 007 advisor-and-cross-skill-wiring | Advisor maps, aliases, fixtures and drift guard; sk-doc hub rows and the two benchmark families; CLI skill docs; sk-code; system-spec-kit docs and tests | 69 | Advisor vitest and Python suites, sk-doc tests |
| 008 docs-and-readmes | Root `README.md`, env examples, benchmark READMEs (history wording kept), `BARTER.md` on main with a backup | 18 plus `BARTER.md` | Repo-wide search |
| 009 existing-issue-fixes | `CITATION_RE` drops paths containing `+`; cli-opencode doc wrongly says the fan-out runner cannot use the Cline DeepSeek route | 2 plus a test | cite-drift tests, `check-source-tags.vitest.ts` |
| 010 verification-and-closeout | Regenerate Hermes skill mirrors, advisor bridges and skill graph, trigger index, retrieval fixtures, compiled dist; run every gate; zero-reference search | 17 generated | Full gate list below |

Each phase splits into work units of one mechanical change set, so a DeepSeek dispatch stays short and literal. The work units live in each phase's `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Deep-loop runtime, advisor scorer, bin, plugin guards, git hooks | `vitest` per package config, `node --test`, shell test scripts |
| Integration | Advisor routing parity and drift guard, compiled-routing canaries, command-bridge regeneration diff | Advisor Python suite, canary runner |
| Static | Runtime validators (`check-contract-drift`, `check-documentation-drift`, `check-projection-coverage`, `check-ledger-stem-producers`, `verify-authority`), runtime-mirror doctor, `validate.sh --strict` | Node scripts, doctor command |
| Search | Zero live references outside `specs/` and the history classes | `rg` |

The baseline for each suite is captured in the worktree before phase 003 so a failure can be told apart from one that already existed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| DevPass `llmgateway/deepseek-v4.1-flash` | External | Green | Fall back to `cline-pass/cline-pass/deepseek-v4.1-flash` at `xhigh`, then wait for the DevPass reset |
| sk-git numbered worktree, provisioned | Internal | Green once created | Implementation cannot start |
| Other sessions' uncommitted work on main | Internal | Isolated by the worktree | Merge may need a rebase |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a work unit writes outside its file list, or a gate fails and the fix is not obvious.
- **Procedure**: before each work unit the orchestrator records a tree snapshot with `git add -A && git write-tree` in the worktree. `git read-tree -u --reset <tree>` restores it. Abandoning the whole program is `git worktree remove` plus deleting the worktree branch.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
003 checker move ─► 004 commands+mirrors ─► 005 packet+registry ─► 006 runtime ─► 007 advisor+skills ─► 008 docs ─► 010 verify
                                                                  009 existing issues (independent) ──────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 003 | None | 005 (packet deletion) |
| 004 | 003 | 005 |
| 005 | 003, 004 | 006, 007 |
| 006 | 005 | 007 |
| 007 | 005, 006 | 008 |
| 008 | 007 | 010 |
| 009 | None | 010 |
| 010 | 003 to 009 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 003 | Low | 1 work unit, about 15 minutes |
| 004 to 006 | Medium | 3 to 6 work units each |
| 007 | High | 4 work units |
| 008 to 009 | Low | 1 to 2 work units each |
| 010 | Medium | Orchestrator-run regeneration and gates |
| **Total** | | **About 25 work units; at the 3 to 4 minutes per DeepSeek turn the research runs averaged, a few hours including verification. This is an assumption from those runs, not a measured implementation run.** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Worktree created through `worktree-naming.sh create` and provisioned
- [ ] Gate baselines captured in the worktree
- [ ] `BARTER.md` backed up before its edit

### Rollback Procedure
1. Restore the last good tree snapshot with `git read-tree -u --reset <tree>`.
2. Re-run the phase's gate to confirm the restore.
3. To abandon everything, remove the worktree and its branch; main never changed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. `BARTER.md` restores from its backup copy.
<!-- /ANCHOR:enhanced-rollback -->

---
