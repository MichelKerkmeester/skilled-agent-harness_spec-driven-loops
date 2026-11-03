---
title: "Implementation Plan: Phase 8: project-scoped-state"
description: "Moves each project's decision-capture queue and consumed log into a subfolder named by a 12-character hash of the project's canonical root, with the same token code in the ESM hook core and the TypeScript writer. Every reader also reads the old root files, and only the subfolder is written. Code goes to Luna workers one change per brief; the orchestrator verifies each diff, runs the suites and edits the docs."
trigger_phrases:
  - "project scoped state plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 8: project-scoped-state

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM (`.mjs`) for the hook core, TypeScript for the runtime writer and matcher CLI, Markdown docs |
| **Framework** | None |
| **Storage** | The gitignored folder `.skilled/skills/.state/decision-capture/`, which gains one `<projectToken>/` subfolder per project; `.gitignore:132` (`.skilled/skills/.state/*/*`) already covers it |
| **Testing** | `node --test` for the hooks, vitest for the runtime CLI suites and the Pi extension, a two-project run in the session scratchpad |

### Overview
Three files learn one rule: the state folder is `<root>/.skilled/skills/.state/decision-capture/<projectToken>/`, where the root is the git top-level of the given directory through `realpath`, or the `realpath` of the directory outside git, and the token is the first 12 hex characters of its SHA-256. `capture-core.mjs` owns `projectToken` and `queueDir`, `decision-record-writer.ts` exports `stateDirPath`, and the matcher calls `stateDirPath` instead of keeping its own copy. Every reader also reads the old root files, only the subfolder is written, and a parity test, a two-project test and a migration test prove it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/hooks/decision-capture/lib/*.test.mjs .skilled/hooks/decision-capture/bin/*.test.mjs` reports `fail 0` with more tests than the baseline 99
- [ ] From `.skilled/skills/system-spec-kit`, `npx vitest run runtime/cli/tests/decision-record-writer.vitest.ts runtime/cli/tests/match-decision-table.vitest.ts --config vitest.config.ts` reports no failure with more tests than the baseline 27
- [ ] The scratch two-project run prints `false`, `false` and `no session queues with pending records`
- [ ] `validate.sh specs/system-speckit/043-decision-capture/008-project-scoped-state --strict` prints RESULT: PASSED
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
One rule, two runtimes. The ESM hook core and the TypeScript writer each compute the same path, and a test holds them together. The runtime cannot import the hook module statically (its one import of it is the dynamic one in `session-stop.ts`), so a shared module would need a build step that a cross-runtime test avoids.

### Key Components
- **`capture-core.mjs`**: a private `canonicalRoot(dir)` runs `git rev-parse --show-toplevel` with `GIT_DIR` and `GIT_WORK_TREE` removed from its environment and a 5 second timeout, passes the result through `realpathSync`, and falls back to `realpathSync(dir)`, then to `resolve(dir)`. It memoizes per input. `projectToken(dir)` hashes that root. `queueDir(dir)` returns `join(root, QUEUE_RELATIVE_DIR, token)`. A private legacy path, `join(root, QUEUE_RELATIVE_DIR)`, serves the dual reads.
- **`decision-record-writer.ts`**: the same root rule and token in TypeScript. Exports `stateDirPath(projectRoot)` and the legacy consumed-log path. `consumedLogPath` uses `stateDirPath`; `readConsumedRows` reads the project log, then the legacy log, deduplicated by key; `recordConsumedKeys` appends only to the project log.
- **`runtime/api/index.ts`**: re-exports `stateDirPath` and the legacy log path beside `consumedLogPath`.
- **`match-decision-table.ts`**: drops `STATE_DIR_SEGMENTS` and `stateDir`. `queuePath` uses `stateDirPath`. `readQueueRecords` unions the project and legacy queue files for the session. `runScan` reads only `stateDirPath`. `runRelease` rewrites each log that holds the key.

### Data Flow
An adapter or sweep passes whatever directory it has to `appendRecords`, which writes into `<root>/.../decision-capture/<token>/`. At save time the matcher and the writer compute the same folder from their root, read it and the legacy root, and append consumed keys only to the subfolder. The queue row and key formats do not change.

### Decision: hashed subfolder under `.skilled`, not a project-local folder

- **Context**: `.skilled` is one symlink in every linked project, so anything under it is shared. The review asked whether a folder outside `.skilled`, such as `<project>/.decision-capture/`, would be safer (`../research/synthesis-review.md` P2-5).
- **Decision**: keep the state under `.skilled/skills/.state/decision-capture/` and add a `<projectToken>/` subfolder. Chosen by the operator on 2026-11-03.
- **Rejected**: a project-local folder outside `.skilled`. It would close the symlink-escape finding and need only one implementation, but it adds an untracked folder to every linked project, and each project would need its own ignore rule. Keying by basename was also rejected: two checkouts named `app` would share a folder.
- **Consequence**: the state folder still resolves outside the project through the sanctioned `.skilled` link. The review's P2 `symlinked_queue_path_escape` (`../review/review-report.md:124-132`) stays open as a sanctioned-link exception, and the state README says so.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `capture-core.mjs` `queueDir`, `queueFile`, nudge and lock paths | Producer of every queue path | update | `capture-core.test.mjs` two-project and token cases |
| `capture-core.mjs` `readQueue`, `readConsumedKeys`, `pendingRecords` | Readers the five sweeps and three adapters call | update: dual-read | Migration case in `capture-core.test.mjs` |
| Five sweeps in `bin/`, Claude and Devin adapters, Pi extension, OpenCode plugin | Pass a project directory to the core | unchanged; the core canonicalizes | Their existing suites pass |
| `session-stop.ts` `decisionCaptureNudge` | Imports the core and calls `takeNudge` | unchanged | `hook-session-stop.vitest.ts` 19 of 19 |
| `decision-record-writer.ts` `consumedLogPath`, `readConsumedRows`, `recordConsumedKeys` | Save-time consumed log | update | `decision-record-writer.vitest.ts` |
| `workflow.ts` call to `recordConsumedKeys` | Passes the resolved project root | unchanged signature | Writer suite |
| `match-decision-table.ts` `stateDir`, `queuePath`, `runScan`, `runRelease` | Matcher CLI the save step runs | update | `match-decision-table.vitest.ts` |
| Six `decision-capture-*` playbooks | Read the flat root with `*.jsonl`, `find -maxdepth 1` or `cat .../*` | update: resolve the folder through `queueDir` | `rg -n 'decision-capture/\*\|decision-capture/consumed\|maxdepth 1' <playbooks>` prints nothing |
| State README, hooks README, feature catalog | Describe the layout | update | `rg -n 'project-token' .skilled/skills/.state/decision-capture/README.md` prints a line |
| `run-conversation-scenario.cjs` snapshot | Hashes the watched folder | not a consumer of the layout: `walkFiles` recurses | none needed |
| `.gitignore:132` | Ignores state files | unchanged: `.skilled/skills/.state/*/*` matches a token subfolder | `git check-ignore -v` on a subfolder path prints `.gitignore:132` |

Inventories run for this plan:
- Same-class producers: `rg -n 'QUEUE_RELATIVE_DIR|STATE_DIR_SEGMENTS'` finds three copies of the path (Measured Behavior); this phase leaves one per runtime.
- Consumers: `rg -l 'QUEUE_RELATIVE_DIR|queueDir\(|queueFile\(|STATE_DIR_SEGMENTS|consumedLogPath|readConsumedRows|readConsumedKeys|\.state/decision-capture'` outside `specs/`, every hit listed above or a test that calls the same helpers.
- Matrix axes for the token: directory shape (root, subfolder, symlinked path, outside git, missing) by runtime (ESM, TypeScript), plus a hostile `GIT_DIR`. Ten parity rows and one hostile row.
- Matrix axes for the migration: file (queue, consumed) by location (root only, subfolder only, both) by reader (core, matcher, writer). Every reader sees the union, and a key in both locations appears once.
- Invariant: for any directory a producer passes and any directory the save resolves for the same project, `queueDir` and `stateDirPath` return the same real path. Adversarial cases: a trailing slash, a relative `.`, a symlinked path, a subfolder, a non-git folder and an exported `GIT_DIR`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the shared-state baseline and the suite counts. Implementation goes core, then writer, then matcher, then docs. Verification reruns the suites, the scratch two-project run and the Measured Behavior commands.

The three code tasks go to separate workers, one change per brief, per parent goal D6: `gpt-6-luna` at reasoning `xhigh` on service tier `fast` through cli-codex. When Luna's quota is used up, the fallback is `llmgateway/deepseek-v4.1-flash-1017` at thinking `max` through cli-pi; Luna never runs through a gateway. Each brief names its files and test, carries the agent persona the cli contract asks for, and forbids any write under this repository's `.skilled/skills/.state/`. The orchestrator lists the changed files after each return, reads the diff, reruns the suite, and edits the docs itself.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Token value and fallbacks, dual-read in the core, writer and matcher, `--release` on the legacy log, `--scan-orphans` scope | `node --test`, vitest |
| Integration | ESM and TypeScript token parity for root, subfolder, symlinked path, non-git folder and hostile `GIT_DIR`; two linked projects in temp folders | vitest importing `capture-core.mjs`; `node --test` |
| Manual | The Measured Behavior two-project run, rerun in the session scratchpad | `node demo.mjs app-a app-b` and the built matcher's `--scan-orphans` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git` on the PATH | External | Green | Producers fall back to `realpath`; a subfolder run would get its own token |
| `node:crypto`, `node:child_process` | Internal | Green | None; both ship with Node, no new package |
| cli-codex with `gpt-6-luna` | External | Green | Fallback `llmgateway/deepseek-v4.1-flash-1017` through cli-pi, per parent goal D6 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a save stops offering an answer a hook captured, the matcher and a hook disagree on the folder, or a linked project still sees another project's sessions.
- **Procedure**: run a full-auto save in each project first, so its subfolder holds no pending answer, then revert this phase's commit. Answers captured after the change and not yet saved can be kept by moving `<token>/*.jsonl` up to the root folder and appending `<token>/consumed.jsonl` to the root `consumed.jsonl`; queue filenames are per session, so they do not collide.
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
| Setup | `../research/research.md` §13 and the operator's design choices | Implementation |
| Implementation | Setup; the core lands before the writer, because the parity test imports it | Verification |
| Verification | Implementation | Close-out, and 009's candidate evidence, which plans against the scoped queue |
<!-- /ANCHOR:phase-deps -->

---
