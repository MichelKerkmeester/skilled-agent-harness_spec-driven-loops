---
title: "Implementation Plan: Phase 5: request-pipeline"
description: "Adds a file queue under the user-level state root with atomic enqueue, atomic claim, quarantine and a retry bound. It ships bots enqueue, a hand-run bots drain, bots answer and one opt-in, non-fatal enqueue leg in the git post-commit hook."
trigger_phrases:
  - "request pipeline plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: request-pipeline

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript for the queue modules, per phase 1 ADR-004 and its Code layout contract, bash for the hook leg |
| **Framework** | None. The CLI follows the thin-CLI shape of `.skilled/bin/compiled-route.cjs` (research.md §8) |
| **Storage** | Files under `${XDG_STATE_HOME:-$HOME/.local/state}/<tool>/<repository identity>/` (research.md §11) |
| **Testing** | vitest through `npm test` in the skill runtime, with `*.vitest.ts` files, and a bash fixture script for the hook leg |

### Overview
Three new modules under `.skilled/skills/system-skilled-bots/runtime/lib/` build the request record, move files between queue folders by `rename` and drain the queue through the phase 3 runner. One leg in `.skilled/scripts/git-hooks/post-commit` calls `bots enqueue` for opted-in repositories. Tests race two consumers, enqueue a duplicate event, force each quarantine reason and commit in trusted and untrusted fixture clones.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 1 has built the state-root layout and the `gitHookTrigger` reader its spec names (phase 1 ADR-009)
- [ ] Phase 3 `bots run <id>` works end to end and returns an outcome class
- [x] ADR-001 has an operator answer: Accepted, every checkout
- [x] ADR-002 to ADR-004 have an operator answer: Accepted by operator decision D11

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` exits 0, and `bash .skilled/scripts/git-hooks/tests/source-root-selection.test.sh`, `bash .skilled/scripts/git-hooks/tests/autostash-orphan-guard.test.sh` and `bash .skilled/scripts/git-hooks/tests/gate-config.test.sh` exit 0 after the hook edit
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
File queue, rename-claimed. Every state change of a request is one `rename` between sibling folders.

### Key Components
- **`request-record.ts`**: builds the §9 record and derives the key. Without it each producer would invent its own fields and dedupe would fail.
- **`request-queue.ts`**: owns the folder layout, the temp-and-rename enqueue, the exclusive seen-key marker, the claim rename and the retry and quarantine moves. Nothing in the repository does this today (research.md §9).
- **`request-drain.ts`**: claims each request, calls the phase 3 runner with it and routes the outcome. It is the only consumer until phase 6 adds the launchd agent.
- **`answer.ts`**: `bots answer` records the answer on the needs-you item, enqueues one `resume` request keyed by the item id and rewrites the generation stamp (operator decision D12). Without it an answer has no path back to the runner.
- **post-commit leg**: the only event producer in this phase that reacts to a repository event.

### Data Flow
A producer first resolves the repository identity and refuses when it is unknown (REQ-015). It builds a record of kind `run` or `resume` and writes it to `tmp/`. It creates `seen/<key hash>` with an exclusive create. If the marker already exists the temp file is removed and the producer reports `duplicate`. Otherwise it renames the file into `inbox/`, the watched folder. `bots drain` renames each `inbox/` file into `claimed/` and calls the runner. A run moves the file to `done/`. A failure under the bound moves it back into `inbox/` through `tmp/` with `attempts` raised by one. A refusal or a failure at the bound moves it to `quarantine/` with a reason file. A runner refusal `awaiting-decision-hold` lands there with reason `held-needs-you` (operator decision D9). `bots answer` first records the answer on the item, then enqueues its `resume` request, then rewrites the stamp, so the hold never refuses the resumed run.

Folder layout (ADR-003), all siblings under `<state root>/<repository identity>/requests/`: `inbox/` (watched), `tmp/`, `claimed/`, `done/`, `quarantine/`, `seen/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/scripts/git-hooks/post-commit` | Machine-wide hook: autostash guard and live-sync publish | update: add one leg between line 118 (end of the `SPECKIT_AUTOSYNC` branch) and `exit 0` at line 120 | `bash -n` exits 0. The three hook tests below exit 0 |
| `.skilled/scripts/install-git-hooks.sh` | Symlinks the hook at line 195 | unchanged | The symlink picks up the edit with no reinstall |
| `.skilled/scripts/git-hooks/tests/source-root-selection.test.sh` | Holds the source-root and trust blocks identical and runs post-commit end to end at lines 149, 152, 166, 189 and 198 | unchanged, rerun | Exits 0 after the edit |
| `.skilled/scripts/git-hooks/tests/autostash-orphan-guard.test.sh` | Copies post-commit into a fixture at line 47 and commits through it | unchanged, rerun | Exits 0 after the edit |
| `.skilled/scripts/git-hooks/tests/gate-config.test.sh` | Greps post-commit at lines 140-142 for `SPECKIT_SKIP_*` and `SPECKIT_ALLOW_*` names and requires a registry row for each | unchanged, rerun. The leg reads no new variable of either form | Exits 0 after the edit |
| `.skilled/scripts/git-hooks/lib/autostash-orphan-guard.sh` | Sourced by post-commit | not a consumer | The leg runs after it and does not read it |
| `.skilled/scripts/git-hooks/README.md:115` and `.skilled/skills/sk-git/references/continuous-integration.md:104` | Document what post-commit does | update the `post-commit` row only, with the operator's yes, since sk-git documents the hook | `rg -n 'bots' .skilled/scripts/git-hooks/README.md` prints the row |
| `.skilled/skills/sk-git/SKILL.md`, `.skilled/skills/sk-git/assets/commit-message-template.md`, `.skilled/skills/sk-git/changelog/v1.5.1.0.md`, `.skilled/skills/sk-git/feature-catalog/feature-catalog.md`, `.skilled/skills/sk-git/feature-catalog/session-lifecycle/continuous-integration-autosync.md`, `.skilled/scripts/git-hooks/tests/README.md`, `.skilled/scripts/git-hooks/lib/README.md` | Name the hook in prose | not a consumer. The `rg` inventory below lists them | None |
| `.skilled/hooks/shared/hook-flags.sh` | `hook_enabled` resolver, default on | unchanged, called as an off switch | `SYSTEM_BOTS_ENQUEUE_DISABLED=1` stops the leg in the hook test |

Required inventories:
- Same-class producers: `rg -n 'post-commit' .skilled/scripts .skilled/skills/sk-git` lists every file that names the hook. Run it before the edit and compare with the table.
- Consumers of changed symbols: the leg adds no symbol to the hook. The new symbols are the request fields, consumed only by `request-drain.ts` and the phase 3 runner.
- Matrix axes: repository trusted or not, `bots/config.json` present or not, opt-in on or off, inside a bot run or not, `node` on `PATH` or not, primary checkout or linked worktree, and a `bots` shim on `PATH` or not. Every row must exit 0. Only trusted, present, on, outside a run, with `node` enqueues. An untrusted clone with a `bots` shim on `PATH` must still enqueue nothing.
- Algorithm invariant: a request file is in exactly one folder at a time, and only `rename` moves it.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reads the phase 1 layout, the phase 3 runner entry and the post-commit hook, and records the baseline of the three hook tests. Implementation adds the record, queue, drain and answer modules, the three CLI verbs and the hook leg. Verification runs the race, duplicate, quarantine, retry and hook matrix tests and reruns the three existing hook tests.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Key derivation, record validation, each queue move, the retry counter | vitest |
| Integration | Two drains racing one request, a duplicate event with a changed prompt, a second `resume` for one needs-you item, `bots answer` on open, answered, expired and unknown items, the four refusal quarantines, the held-bot quarantine, the retry bound and enqueue with unknown identity, all against a temp state root | vitest with a stub runner |
| Manual | A commit in a trusted fixture repository, a commit in an untrusted clone, `bots drain` by hand | bash fixture script, then `ls -A` of each queue folder |

The one command: `npm --prefix .skilled/skills/system-skilled-bots/runtime test` exits 0, and `ls -A <state root>/<identity>/requests/inbox` prints nothing after each scenario.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 `001-contracts-and-state-root` | Internal | Red (not built) | No state-root path, no identity, no `gitHookTrigger` reader |
| Phase 3 `003-manual-runner` | Internal | Red (not built) | Drain has nothing to dispatch to |
| Node.js `fs.rename` and exclusive create (`wx`) | External | Green | None. Both are in the standard library |
| `.skilled/hooks/shared/hook-flags.sh` | Internal | Green (exists) | The leg loses its off switch and stays opt-in only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: any commit in any repository fails or slows visibly after the hook edit, or a hook test that passed at baseline fails.
- **Procedure**: revert the hook-leg commit alone. The symlinked hook returns to its 120-line form at once. The queue modules can stay, since nothing calls them without the leg or a hand-run drain. Queue files under the state root are not touched by the revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Packet phases 1 and 3 complete | Implementation |
| Implementation | Setup baseline recorded, ADR answers | Verification |
| Verification | Implementation | Close, and packet phase 6's queue-drain agent |
<!-- /ANCHOR:phase-deps -->

---
