---
title: "Implementation Plan: Phase 4: agents-commands-config"
description: "Adds the browser deny key and runtime-neutral wording to the agents, moves the non-command files out of the command folder, syncs the mirrors and checks the shape of opencode.json."
trigger_phrases:
  - "agents commands config plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: agents-commands-config

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown for the agents, commands and docs. JSON for the contract manifests and `opencode.json`. JavaScript (CJS and MJS) and TypeScript for the consumers and tests. |
| **Framework** | OpenCode 1.19.3 (v1, `opencode`) and OpenCode 2.0.32 (v2, `opencode2`) |
| **Storage** | `scratch/` for captures. No repo database changes. |
| **Testing** | Vitest for the contract compiler and drift tests in `system-deep-loop/runtime`. Node built-in runner for the config shape test. The mirror checker runs as a script. |

### Overview
Phase 4 changes wording and file locations, and it changes no permission and no behaviour. It adds one key to ten agent frontmatters, makes the delegation wording runtime-neutral in the agent bodies, and extends one runtime table. It moves twelve non-command markdown files out of the command folder and points their consumers at the new paths. It syncs the mirror copies, and it adds a test that guards `opencode.json` against v2-only keys.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable (SC-001 to SC-003)
- [x] Dependencies identified in `spec.md` section 6

### Definition of Done
- [ ] All acceptance criteria met (`acceptance-criteria.md`)
- [ ] `check-agent-mirror-sync.cjs` exits 0 with 11 agents checked
- [ ] The contract tests match their baseline pass count from the new paths
- [ ] `validate.sh --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec, plan and tasks agree)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Decide, then edit, then sync, then move, then verify. The agent edits come before the mirror sync, so each mirror copies the final text. The moves come after the sync, so the consumers point at paths that exist. Each dispatch changes one folder of files.

### Key Components
- **Agent frontmatter**: a `browser: deny` line beside `chrome_devtools: deny` in ten agents. No other key changes.
- **Agent bodies**: runtime-neutral delegation wording in the eleven agents that name the `Task` tool.
- **`orchestrate.md` runtime table**: a row per runtime, with the delegation tool name or UNKNOWN.
- **Mirror copies**: `.claude/agents/*.md`, `.codex/agents/*.toml` and `.pi/agents/*`, synced by the repo's command. `.cursor/agents` and `.devin/agents` link to `.claude/agents`.
- **Moved files**: twelve markdown files that move from `.skilled/commands/` to the destination in T003.
- **Config shape test**: `.opencode/bin/tests/opencode-config-shape.test.cjs`, with a positive case on `opencode.json` and a negative case on a copy.

### Data Flow
The agent source in `.skilled/agents/` feeds the mirror copies. The command folder `.skilled/commands/` is read by both hosts through the `.opencode/commands` symlink, so a markdown file in that folder is a command candidate. Moving a file out of the folder removes it from both listings, and the consumers keep working when they point at the new path.

### Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Agent frontmatter, ten agents | Carries `chrome_devtools: deny` | Add `browser: deny` | `grep -l 'browser: deny' .skilled/agents/*.md` prints ten names (T014) |
| Agent bodies, eleven agents | Name the `Task` tool | Runtime-neutral wording | Review of each `Task` mention (T021) |
| `orchestrate.md` runtime table, line 35 | Lists four runtimes | Add Devin and UNKNOWN rows | `grep -n 'run_subagent' .skilled/agents/orchestrate.md` (T008) |
| Mirror copies | Synced from `.skilled/agents` | Sync after the agent edits | `check-agent-mirror-sync.cjs` (T013) |
| Command folder, twelve files | Read as command candidates through the symlink | Move out | `find .skilled/commands -name '*.md'` (T016) |
| v1 command listing and `api GET /api/command` | Lists the command folder | Unchanged, but must not list a moved file | Command listings before and after (T002, T016) |
| Contract compiler and drift tests | Read the moved files | Point at the new paths | Vitest against the baseline count (T015) |
| Sixteen consumers in `spec.md` section 3 | Cite old paths | Point at the new paths | Stale path grep (T019) |
| `opencode.json` | Uses `mcp.code_mode` and `permission` | No edit unless the D2 conflict is settled | `opencode debug config` (T017) and the shape test (T018) |

Required inventories:
- Same-class producers: `grep -l 'chrome_devtools: deny' .skilled/agents/*.md` lists the ten agents, and `grep -L` lists `orchestrate.md`.
- Consumers of the moved paths: `grep -rl -E 'compile-command-contracts|assets/compiled|assets/legacy|commands/scripts/' .skilled .opencode .claude .codex`, with the benchmark reports excluded as exceptions.
- Matrix axes: host (v1, v2) by listing (command, moved file) by check (listed, not listed). Each cell has one capture.
- Algorithm invariant: the moves change no file's content, except the path references that T011 updates. A move that changes a body fails the review.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Ordered steps and dispatch

Dispatches run one at a time. Each dispatch sets `AI_SESSION_CHILD=1` in its environment, as the cli-devin and cli-codex contracts require. Each dispatch names its model and flags in full. Before any cli-codex or cli-devin prompt, the composing agent reads that CLI's `SKILL.md`.

| Step | Who runs it | How | Produces |
|------|-------------|-----|----------|
| S1 Setup (T001 to T003) | Orchestrator | Shell from the worktree root | The baselines and the four decisions |
| S2 Desk checks (T004, T005) | DeepSeek through cli-devin | `devin -p --model deepseek-v4-1-flash-max --permission-mode auto`, read-only | The list of `Task` mentions and the runtime tool names |
| S3 Agent edits (T006 to T008) | T006 Luna. T007a to T007c and T008 DeepSeek with the markdown persona. | Luna: `codex exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast" --sandbox workspace-write`. DeepSeek: `devin -p --model deepseek-v4-1-flash-max --permission-mode dangerous`, with writes limited to the agent files. | The frontmatter key, the wording and the runtime table |
| S4 Mirror sync (T009) | Orchestrator | The sync command that T009 finds and records | The synced mirror copies |
| S5 Moves and consumers (T010, T011a to T011c) | T010 orchestrator. T011a to T011c Luna. | `mv` for the moves, and `codex exec` with `--sandbox workspace-write` for the consumer edits | The moved files and the updated paths |
| S6 Config test (T012) | Luna | The same codex flags | The shape test |
| S7 Verify (T013 to T020) | Orchestrator | The commands in the verification checklist | The captures for AC-001 to AC-013 |
| S8 Review (T021) | DeepSeek through cli-devin | `devin -p --model deepseek-v4-1-flash-max --permission-mode auto`, read-only | Findings first, with file and line citations |
| S9 Fix and rerun (T022) | Luna for fixes, orchestrator for the rerun | The same codex flags. The orchestrator reruns T013 to T020. | The fixed tree and the new captures |
| S10 Close (T023) | Orchestrator | The strict validator and the scratch clean-up | The closure evidence |

Rollback for steps that change repo files: the agent and consumer edits return with `git checkout -- <path>`. The moved files return with `mv` to their old paths. The mirror copies return by running the sync command again after the agents are restored. The shape test is removed by hand. After the rollback, the orchestrator reruns the mirror checker and the contract tests.

Verification by the orchestrator: the orchestrator reruns the mirror checker, the contract tests, the command listings and the config load, and compares each output with its capture. A verdict stands only when the output matches.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The config shape test in `.opencode/bin/tests/opencode-config-shape.test.cjs`, with a positive case and a negative case | Node built-in test runner |
| Contract | `compile-command-contracts`, `check-contract-drift` and `render-command-contract` vitest suites in `system-deep-loop/runtime/tests/unit/` | Vitest, with `--no-coverage` |
| Integration | The mirror checker, the v1 command listing, `opencode2 api GET /api/command` with the raw query and `opencode debug config </dev/null` | `check-agent-mirror-sync.cjs`, `opencode` 1.19.3, `opencode2` 2.0.32 |
| Review | Findings-first review of the wording and of the frontmatter diff | DeepSeek through cli-devin, read-only |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Orchestrator decisions in T003 | Internal | Yellow until T003 is recorded. | The moves, the `opencode.json` work and the `orchestrate.md` key wait. |
| The repo's mirror sync command | Internal | Yellow until T009 finds it. | The mirror copies cannot change, and REQ-001 stays open. |
| `system-deep-loop/runtime` vitest setup | Internal | Green if its `node_modules` exists. T001 checks. | The contract tests cannot run, and REQ-007 stays open. |
| `opencode` 1.19.3 and `opencode2` 2.0.32 | Internal binary | Green. Both versions were confirmed in phase 1. | The command listings and the config load cannot run. |
| DeepSeek V4.1 Flash max via cli-devin | External model | Green. | The desk checks and the review move to the orchestrator. |
| GPT-6 Luna max fast via cli-codex | External model | Yellow. The write sandbox blocks local sockets, so the orchestrator runs the tests. | The moves and consumer edits move to the orchestrator. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A mirror sync fails, a contract test fails from a new path, a moved file is still listed as a command on either version, `opencode.json` fails to load on v1, or a frontmatter change touches a permission other than `browser`.
- **Procedure**: Stop the dispatch. Compare `git status --porcelain` with `scratch/status-before.txt`. Restore each changed tracked file with `git checkout -- <path>`. Move each moved file back to its old path with `mv`. Run the sync command again, then run the mirror checker. Delete the shape test if it was created by this phase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Setup (S1) and the desk checks (S2) come first. The agent edits (S3) follow the decisions. The mirror sync (S4) follows the agent edits. The moves and consumers (S5) follow the sync, and the config test (S6) can run in parallel with them. Verification (S7) needs all of them. The review (S8) comes next, then the fixes (S9) and the close (S10).

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup and decisions | None | Agent edits, moves, config work |
| Desk checks | Setup | Agent edits |
| Agent edits | Desk checks, decisions | Mirror sync |
| Mirror sync | Agent edits | Verification |
| Moves and consumers | Decisions, mirror sync | Verification |
| Config test | Decisions | Verification |
| Verification | Mirror sync, moves and consumers, config test | Review |
| Review | Verification | Fixes |
| Fixes | Review | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Agent wording and frontmatter | Medium | Not estimated. No timing evidence exists yet. |
| Moves and consumers | Medium | Not estimated. No timing evidence exists yet. |
| Verification | Medium | Not estimated. No timing evidence exists yet. |
| **Total** | Medium | **Not estimated. No timing evidence exists yet.** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `scratch/status-before.txt` holds the sorted `git status --porcelain` output from before any change
- [ ] `scratch/command-listing-before.txt` holds the v1 and v2 command listings from before the move
- [ ] `scratch/contract-tests-before.txt` holds the contract test pass count
- [ ] No step calls `opencode2 service stop`, `opencode2 service start` or `opencode2 service restart`

### Rollback Procedure
1. Stop the dispatch that caused the problem.
2. Compare `git status --porcelain` with `scratch/status-before.txt`.
3. Restore each changed tracked file with `git checkout -- <path>`.
4. Move each moved file back to its old path with `mv`, using `scratch/move-map.txt`.
5. Run the sync command, then the mirror checker, and confirm that `git status --porcelain` matches the snapshot.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: The moves are file renames, and the rollback reverses them with `mv`.
<!-- /ANCHOR:enhanced-rollback -->
