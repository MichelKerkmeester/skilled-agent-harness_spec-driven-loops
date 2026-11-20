---
title: "Implementation Plan: Plan Text and Goal Closeout"
description: "The conductor fixes three false passages in the 002, 003 and 004 docs, adds a cited socket caveat to the delegation strategy, ticks the child goals from fresh runs, records the operator answers through the continuity writer and closes the parent after the finish sequence."
trigger_phrases:
  - "plan text and goal closeout plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Plan Text and Goal Closeout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs |
| **Framework** | system-spec-kit packet docs, its continuity writer and the sk-create-goal checker |
| **Storage** | None |
| **Testing** | `rg` text checks, `check-goal.cjs`, `validate.sh --strict` and the goal criteria commands |

### Overview
The conductor edits each doc in place with the replacement text below, pasted as written. Fresh runs of each child criterion supply the evidence for the ticks. The continuity writer creates the decision record. The parent closes after the D6 finish sequence.

`P` is the parent folder `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/`. `A` is `.skilled/skills/system-skill-advisor/`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `grep -c '^- \[ \] T[0-9]'` prints 0 for the `tasks.md` of 006 to 011 and 013
- [ ] `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0
- [ ] `sed -n 68p P/002-pasted-context-stripping/tasks.md` still shows the T009 line, and the other cited lines still hold the quoted text

### Definition of Done
- [ ] `check-goal.cjs` prints `RESULT: PASSED` for 002, 003 and 004
- [ ] `validate.sh P --recursive --strict --quiet` prints `RESULT: PASSED` for all fourteen folders
- [ ] `P/goal.md` and the 002, 003 and 004 goals hold no `- [ ]` line
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Conductor doc edits, then evidence ticks.

### Key Components
Each edit below replaces the description text only. Every `[x]` mark and every `  - Evidence:` line stays byte-identical.

- **002 rebuild order.**
  - `P/002-pasted-context-stripping/tasks.md:68` becomes: ``- [x] T009 Rebuild the runtime, then recapture the ratchet baseline (`A/scripts/routing-accuracy/scorer-eval-baseline.json`). The capture script loads the scorer from `dist/runtime` (`A/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs:47`, `:119`), so the build comes first. Verify: `npm --prefix A run build` exits 0. Then `node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs --write` exits 0, and `git diff` on the file shows the new corpus hash, totals up by one and `full_corpus_top1.correct` up by one, nothing else.`` The `A` there is that file's own `A`, the runtime folder.
  - `P/002-pasted-context-stripping/plan.md:92` replaces its third sentence with: "Verification rebuilds the runtime first, because the eval-baseline capture scores through `dist/`, then re-baselines the moved pins, runs the corpus gates and re-runs the probe pair against a daemon started after the build, with a semantic-lane check and a compiled-route probe."
  - `P/delegation-strategy.md:107` Tasks cell becomes: "Typecheck, then the build T009 needs because its capture scores through `dist/`, then T009 to T011 baseline recaptures, T012 corpus gates, T013 rebuild and the three probes, T014 comment hygiene, T015 summary".
- **003 bench reporter.** The default Vitest reporter hides a passing test's console output (Measured Behavior in `spec.md`).
  - `P/003-follow-up-routing-benchmark/tasks.md:28` `BENCH` becomes ``SPECKIT_RUN_BENCHES=true npx vitest run bench/scorer-calibration.bench.ts --reporter=verbose``, followed by the sentence "The default reporter hides a passing test's console output, so the bench lines print only with `--reporter=verbose`."
  - `P/003-follow-up-routing-benchmark/spec.md:138`, `plan.md:45` and `goal.md:59` each insert ` --reporter=verbose` after `bench/scorer-calibration.bench.ts` in the command.
  - `P/003-follow-up-routing-benchmark/implementation-summary.md:102` Result cell becomes: "`run-all-drift-guards.sh` exits 1 on 11 errors, all in ten review probes of the routing-and-scoring 008 packet. The `.vibe` repo-guard fixtures show WARN rows only. Primary `main` holds the same probes. Phase 013 fixes them".
- **004 diff scope.** The phase's own commits are `31469e5ee4e` and `cfad65c7c72`. `git show --name-only --format=` on both prints exactly the three planned paths.
  - `P/004-crash-path-fallback/spec.md:132` becomes: "- **SC-002**: The phase's own commits, `31469e5ee4e` and `cfad65c7c72`, change exactly the three files in Files to Change: `git show --name-only --format= 31469e5ee4e cfad65c7c72` prints only those three paths. A whole-worktree `git diff --stat` taken during the build also showed phase 002's uncommitted files, so it is not the check."
  - `P/004-crash-path-fallback/goal.md:61` becomes: "- [ ] `git show --name-only --format= 31469e5ee4e cfad65c7c72` prints only the three planned paths".
  - `P/004-crash-path-fallback/plan.md:45` becomes the same line as the goal criterion. `plan.md:73` replaces "checks the diff covers only the three files" with "checks that the phase's own commits change only the three files".
  - `P/004-crash-path-fallback/tasks.md:64` becomes: "- [x] T007 Confirm this phase's own changes touch only the three planned files (`git`). Verify: `git show --name-only --format= 31469e5ee4e cfad65c7c72` prints `user-prompt-submit.ts`, `claude-user-prompt-submit-hook.vitest.ts` and `ENV-REFERENCE.md` paths, and nothing else. A whole-worktree `git diff --stat` also lists phase 002's files while they are uncommitted."
  - `P/delegation-strategy.md:116` Tasks cell becomes: "T006 typecheck, T007 the phase's own changes hold three files, T008 hygiene, T009 summary".
- **Socket caveat.** A new bullet in `P/delegation-strategy.md` section 5, after the "After every wave" bullet at `:136`: "**Daemon socket.** Leave `SPECKIT_IPC_SOCKET_DIR` unset for probes. Unset, the CLI shim sets it to `/tmp/system-skill-advisor` (`.skilled/bin/skill-advisor.cjs:25`, `:88-89`), and the socket helper appends a 12-character hash of the advisor database folder (`.skilled/bin/lib/launcher-ipc-bridge.cjs:103-109`, `:139-154`). That folder is inside each checkout (`launcher-ipc-bridge.cjs:91-98`), so each checkout already gets its own daemon under `/tmp/system-skill-advisor/<hash>`. Pointing the variable elsewhere while a current-build daemon holds its lease drops the CLI to the local scorer: the launcher bridges to the lease holder instead of binding the new socket (`.skilled/bin/system-skill-advisor-launcher.cjs:989-993`), the 5-second cold-start wait closes (`.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:36`, `:1354-1357`) and the answer carries `source: local-scorer` (`:1574-1590`). The worktree wrapper sets the variable on purpose (`.skilled/bin/worktree-session.sh:496`), and its sessions are not affected." Task T009 checks the second claim live before this text lands.
- **Child goal ticks.** Each tick appends ` - evidence: <command result from this phase>` to its criterion line. 003's third criterion applies only on a ship decision. The rule took over-suppresses (`P/003-follow-up-routing-benchmark/implementation-summary.md:80`), so it is ticked as not applicable with that citation.
- **Decision record.** `/speckit:save` with `--full-auto` pipes JSON to `generate-context.js --stdin --full-auto --session-id <id> --runtime claude <this folder>` (`.skilled/commands/speckit/save.md:19`). The JSON carries one `operatorDecisions` entry per `answered_questions` line in `P/spec.md`, 9 at planning, each with `sourceKey`, `decided`, `carriedBy`, `question` and `answer` and `scope` left at `local`. A `cross-phase` entry would go to the phase parent (`.skilled/skills/system-spec-kit/references/memory/save-workflow.md:300`), which holds no heavy docs. The writer creates `decision-record.md` when it is absent (`save.md:26`).
- **Parent close.** Parent criteria 1 and 6 read `main` and `origin/main`, so the parent ticks, the parent Status and the phase-map rows land after the D6 merge and push.

### Data Flow
Fixed docs feed the ticks: 003's criterion reads the verbose command before it is run, and 004's criterion names the commits before it is run. The ticked child goals and the drift-guard gate feed the recursive validation. The merge, rebuild, restart and push feed parent criteria 1 and 6.

### Executors
The conductor edits every doc directly, because these are spec docs and the edits are pasted text. A Luna leaf lands only the tests and fixes for confirmed review findings, from prepared files the conductor writes. The conductor also runs the save, every check and the finish sequence. sk-git owns the merge and push mechanics.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup confirms 006 to 011 and 013 are done, the drift-guard gate is green and every cited line still holds its quoted text. Implementation applies the 002, 003 and 004 text fixes and the socket caveat, ticks the three child goals from fresh runs and records the operator answers. Verification validates the packet, runs the D6 finish sequence and ticks the parent. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each text fix has a before check that finds the false text and an after check that finds the true text, both with `rg`. Each goal tick quotes a command the conductor ran in this phase. `check-goal.cjs` runs on each edited goal, and `validate.sh --strict` runs on each edited phase and then on the packet with `--recursive`. Comment hygiene does not apply, because no code changes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`rg`, `node`, the advisor runtime build and vitest, the continuity writer `generate-context.js`, the Claude decision sweep and sk-git for the merge and push. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a tick turns out to rest on a check that did not pass. Revert the closeout commit, which restores the unticked goals and the old text, and rerun the failing check. The decision record is revertible the same way.
<!-- /ANCHOR:rollback -->

---
