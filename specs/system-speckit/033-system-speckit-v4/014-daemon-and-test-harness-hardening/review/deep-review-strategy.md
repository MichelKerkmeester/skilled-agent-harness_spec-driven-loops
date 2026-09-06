---
title: Deep Review Strategy - 045 Daemon-and-Test-Harness-Hardening
description: Strategy and runtime tracking for deep review of packet 045 (four phases) plus cli-external-orchestration 058 flag-enum-authority.
trigger_phrases:
  - "deep review strategy 045"
  - "045 hardening review"
  - "process-sweep review"
  - "production-db isolation review"
importance_tier: high
contextType: planning
---

# Deep Review Strategy - Packet 045 (Daemon and Test-Harness Hardening)

## 1. OVERVIEW

### Purpose

Reviews packet 045 (phase parent: Daemon Lifecycle and Test-Harness Hardening, four sub-phases, all marked Complete) plus the adjacent cli-external-orchestration packet 058 (Flag Enumeration Authority). The packet's stated acceptance criterion (goal.md D1) is that **presence in source is not acceptance**: each phase must first reproduce its failure and then prove the guard fires on that same reproduction. This review takes that posture literally and treats every guard in the listed implementation files as load-bearing until proven reachable.

### Usage

- **Init:** This file is the live strategy for the deep-review session. Read it before every iteration.
- **Per iteration:** LEAF agent updates Next Focus, Files Under Review, Running Findings, and Cross-Reference Status.
- **Mutability:** Mutable, updated by both orchestrator and LEAFs across iterations.

---

## 2. TOPIC

**Review target:** `specs/system-speckit/045-daemon-and-test-harness-hardening` (spec-folder)
**Branch:** `skilled/v4.0.0.0`
**Adjacent in scope:** `specs/cli-external-orchestration/058-flag-enum-authority`

The packet hardens four production-observed failure classes:
1. **Production-database isolation** — `paths.ts` must fail closed when reached from a vitest process.
2. **Orphan daemon reaping** — `process-sweep.ts` must terminate truly orphaned launcher processes, never live ones.
3. **Test-hang containment** — `run-tests.mjs` must bound vitest execution and name the retaining handle on kill.
4. **Live-follow log hygiene** — `git-live-follow.sh` must log state transitions exactly once and cap the follower log.

Adjacent packet 058 collapses parallel flag-enumeration arrays across the six CLI dispatchers; this reviewer must catch any drift introduced into the cli-external-orchestration SKILL.md / cli-devin (SKILL.md, cli-reference.md, manual-testing-playbook) from the consolidation.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Re-classifying orphan processes (predecessor packet 035 settled classification).
- Inventing new tests for behavior the guards already cover.
- Refactoring for style or convention.
- Implementation fixes (report-only; fixes route through `/speckit:plan`).

---

## 5. STOP CONDITIONS

- Convergence: weighted newFindingsRatio ≤ 0.10 over the rolling window AND all four dimensions reviewed.
- Hard ceiling: 4 iterations.
- Manual pause via `.deep-review-pause` sentinel.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 10
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->

## 10. FINAL ADJUDICATION (ITERATION 4)

- P1-001 remains confirmed: the exported apply boundary does not enforce the orphan-sweep kill switch when `enabled` is omitted. Smallest fix is a fail-closed API boundary plus a direct-call regression test. Worth fixing: yes.
- P1-002 remains confirmed: plan-time classification and parent evidence can defer a daemon that becomes orphaned between inventory and apply. Smallest fix is fresh apply-time reclassification or an explicit second pass plus a transition test. Worth fixing: yes.
- P1-003 remains confirmed: the cli-devin root playbook still contradicts the installed-binary authority rule on `smart`; version-scope and reconcile the root precondition/table. Worth fixing: yes.
- P1-004 is resolved: Phase 3 goal criteria are checked and its log records the bound, exit code, named handle, healthy run, and margin. A replayable fixture remains optional P2 work.
- P1-005 is resolved: Phase 4 goal criteria are checked and its log records deduplication, re-entry, cap, rotation, and lock outcomes. A replayable synthetic harness remains optional P2 work.

Final verdict: CONDITIONAL (three active P1 findings, no P0 findings).

<!-- /ANCHOR:final-adjudication -->
## 8. WHAT WORKED

- **Predicate-focused iteration:** focusing on the four operator-named predicate-bearing files (`process-sweep.ts`, `paths.ts`, `run-tests.mjs`, `git-live-follow.sh`) yielded two P1s in one pass without exhausting the budget.
- **TOCTOU lens:** asking "what is the predicate at the moment of the kill, vs the moment of evidence collection" surfaced both P1-001 (kill-switch not re-evaluated at apply time) and P1-002 (plan-time ppid used as a hard gate).
- **Test-file triangulation:** cross-reading `orphan-daemon-reaping.vitest.ts` revealed that the live-parent test injects `getParentPid` as a constant — the parent-dies-mid-sweep window is NOT exercised (this is what makes P1-002 a real finding, not a hypothetical).
- **Confirmed-clean sections:** the predicate-bearing files have several genuinely correct surfaces (realpath comparison in `paths.ts`, process-group containment in `run-tests.mjs`, --ff-only safety in `git-live-follow.sh`, self/ancestor refusal in `process-sweep.ts`). Recording these prevents re-finding them in iter 2.

---

## 9. WHAT FAILED

- (none — first iteration completed within budget and surfaced actionable findings on the highest-risk surfaces.)

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`agent_cross_runtime`**: confirmed-clean on packet 058 (documentation drift only — no runtime safety implication). The cross-CLI rule is correctly hoisted to the parent hub. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`agent_cross_runtime`**: confirmed-clean on packet 058 (documentation drift only — no runtime safety implication). The cross-CLI rule is correctly hoisted to the parent hub.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`agent_cross_runtime`**: confirmed-clean on packet 058 (documentation drift only — no runtime safety implication). The cross-CLI rule is correctly hoisted to the parent hub.

### **`feature_catalog_code`**: deferred — packet 045 is a hardening packet, not a feature catalog entry. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`feature_catalog_code`**: deferred — packet 045 is a hardening packet, not a feature catalog entry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`feature_catalog_code`**: deferred — packet 045 is a hardening packet, not a feature catalog entry.

### **`git-live-follow.sh` clobbering a dirty tree**: ruled out by `--ff-only` refusal on dirty tracked files (line 221) plus the explicit warning at line 224. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`git-live-follow.sh` clobbering a dirty tree**: ruled out by `--ff-only` refusal on dirty tracked files (line 221) plus the explicit warning at line 224.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`git-live-follow.sh` clobbering a dirty tree**: ruled out by `--ff-only` refusal on dirty tracked files (line 221) plus the explicit warning at line 224.

### **`git-live-follow.sh` rebasing/merging/resetting**: ruled out by `--ff-only` at line 221 and the explicit diverged warning at line 235. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`git-live-follow.sh` rebasing/merging/resetting**: ruled out by `--ff-only` at line 221 and the explicit diverged warning at line 235.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`git-live-follow.sh` rebasing/merging/resetting**: ruled out by `--ff-only` at line 221 and the explicit diverged warning at line 235.

### **`paths.ts` bind-mount defeat**: realpath resolves bind mounts to the same physical directory, so `===` comparison catches it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`paths.ts` bind-mount defeat**: realpath resolves bind mounts to the same physical directory, so `===` comparison catches it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`paths.ts` bind-mount defeat**: realpath resolves bind mounts to the same physical directory, so `===` comparison catches it.

### **`paths.ts` symlink defeat of production-DB detection**: ruled out by `realpathSync` at line 75. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`paths.ts` symlink defeat of production-DB detection**: ruled out by `realpathSync` at line 75.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`paths.ts` symlink defeat of production-DB detection**: ruled out by `realpathSync` at line 75.

### **`playbook_capability`**: deferred — the cli-devin `manual-testing-playbook/` deeper read is queued for iter 3. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`playbook_capability`**: deferred — the cli-devin `manual-testing-playbook/` deeper read is queued for iter 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`playbook_capability`**: deferred — the cli-devin `manual-testing-playbook/` deeper read is queued for iter 3.

### **`process-sweep.ts` killing an ancestor process**: ruled out by `ancestorPids.has(row.pid)` check at line 311. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`process-sweep.ts` killing an ancestor process**: ruled out by `ancestorPids.has(row.pid)` check at line 311.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`process-sweep.ts` killing an ancestor process**: ruled out by `ancestorPids.has(row.pid)` check at line 311.

### **`process-sweep.ts` killing an unknown-owner process**: ruled out by classification checks at line 319-321 and the project-identity check at line 324-326. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`process-sweep.ts` killing an unknown-owner process**: ruled out by classification checks at line 319-321 and the project-identity check at line 324-326.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`process-sweep.ts` killing an unknown-owner process**: ruled out by classification checks at line 319-321 and the project-identity check at line 324-326.

### **`process-sweep.ts` killing self**: ruled out by `row.pid === opts.selfPid` check at line 307. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`process-sweep.ts` killing self**: ruled out by `row.pid === opts.selfPid` check at line 307.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`process-sweep.ts` killing self**: ruled out by `row.pid === opts.selfPid` check at line 307.

### **`run-tests.mjs` killing its own caller's process group**: ruled out by `start_new_session=True` and `killpg(child_pid, ...)` — the runner is in a different group. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`run-tests.mjs` killing its own caller's process group**: ruled out by `start_new_session=True` and `killpg(child_pid, ...)` — the runner is in a different group.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`run-tests.mjs` killing its own caller's process group**: ruled out by `start_new_session=True` and `killpg(child_pid, ...)` — the runner is in a different group.

### **`skill_agent`**: deferred — `system-spec-memory-launcher.cjs` is the spec-memory skill's daemon, not a Skill surface. The session-cleanup plugin is a plugin, not a skill. No overlay finding this iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`skill_agent`**: deferred — `system-spec-memory-launcher.cjs` is the spec-memory skill's daemon, not a Skill surface. The session-cleanup plugin is a plugin, not a skill. No overlay finding this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`skill_agent`**: deferred — `system-spec-memory-launcher.cjs` is the spec-memory skill's daemon, not a Skill surface. The session-cleanup plugin is a plugin, not a skill. No overlay finding this iteration.

### **Adjacent packet 058 (Flag Enumeration Authority)** — cross-reference: packet 058 is a **documentation drift correction** for `cli-devin/references/cli-reference.md`'s `--permission-mode` enum, plus a cross-CLI rule published in the parent hub SKILL.md §4 ALWAYS list (line 169): *"Treat the installed binary as the authority for flags and enum values, and `--help` as an incomplete summary of it. A value this skill documents but help omits is not thereby fabricated … Before changing or reporting a documented flag value as invalid, probe the binary with an argument that forces parse-time validation without starting a billable session."* The defect was in the reference table only; the skill's dispatch examples were correct (`spec.md:30` answered_questions). **No cross-runtime safety drift.** -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Adjacent packet 058 (Flag Enumeration Authority)** — cross-reference: packet 058 is a **documentation drift correction** for `cli-devin/references/cli-reference.md`'s `--permission-mode` enum, plus a cross-CLI rule published in the parent hub SKILL.md §4 ALWAYS list (line 169): *"Treat the installed binary as the authority for flags and enum values, and `--help` as an incomplete summary of it. A value this skill documents but help omits is not thereby fabricated … Before changing or reporting a documented flag value as invalid, probe the binary with an argument that forces parse-time validation without starting a billable session."* The defect was in the reference table only; the skill's dispatch examples were correct (`spec.md:30` answered_questions). **No cross-runtime safety drift.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adjacent packet 058 (Flag Enumeration Authority)** — cross-reference: packet 058 is a **documentation drift correction** for `cli-devin/references/cli-reference.md`'s `--permission-mode` enum, plus a cross-CLI rule published in the parent hub SKILL.md §4 ALWAYS list (line 169): *"Treat the installed binary as the authority for flags and enum values, and `--help` as an incomplete summary of it. A value this skill documents but help omits is not thereby fabricated … Before changing or reporting a documented flag value as invalid, probe the binary with an argument that forces parse-time validation without starting a billable session."* The defect was in the reference table only; the skill's dispatch examples were correct (`spec.md:30` answered_questions). **No cross-runtime safety drift.**

### **Adjacent packet 058 (Flag Enumeration Authority)**: deferred this iteration per operator brief — predicate-bearing files have priority. Surface evidence will be sampled in iter 2. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Adjacent packet 058 (Flag Enumeration Authority)**: deferred this iteration per operator brief — predicate-bearing files have priority. Surface evidence will be sampled in iter 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adjacent packet 058 (Flag Enumeration Authority)**: deferred this iteration per operator brief — predicate-bearing files have priority. Surface evidence will be sampled in iter 2.

### **cli-devin surface re-declares flag enums locally**: ruled out — `grep` across `cli-external-orchestration/**` shows the cross-CLI rule is hoisted to the parent hub SKILL.md:169; each child CLI's `prompt-quality-card.md` references flags contextually but does not re-declare enums. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **cli-devin surface re-declares flag enums locally**: ruled out — `grep` across `cli-external-orchestration/**` shows the cross-CLI rule is hoisted to the parent hub SKILL.md:169; each child CLI's `prompt-quality-card.md` references flags contextually but does not re-declare enums.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **cli-devin surface re-declares flag enums locally**: ruled out — `grep` across `cli-external-orchestration/**` shows the cross-CLI rule is hoisted to the parent hub SKILL.md:169; each child CLI's `prompt-quality-card.md` references flags contextually but does not re-declare enums.

### **model-server-supervision.cjs lock acquisition has TOCTOU race**: ruled out — `acquireRespawnLockFileAt` (lines 739-809) uses atomic rename-before-open (lines 787-798) for stale-lock reclaim. The pattern is the reference implementation that git-live-follow.sh's P2-006 should adopt. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **model-server-supervision.cjs lock acquisition has TOCTOU race**: ruled out — `acquireRespawnLockFileAt` (lines 739-809) uses atomic rename-before-open (lines 787-798) for stale-lock reclaim. The pattern is the reference implementation that git-live-follow.sh's P2-006 should adopt.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **model-server-supervision.cjs lock acquisition has TOCTOU race**: ruled out — `acquireRespawnLockFileAt` (lines 739-809) uses atomic rename-before-open (lines 787-798) for stale-lock reclaim. The pattern is the reference implementation that git-live-follow.sh's P2-006 should adopt.

### **model-server-supervision.cjs sun_path or ownership guards are missing**: ruled out — both `assertSunPathLimit` (lines 510-520) and `assertSocketDirOwnership` (lines 522-552) are present and correctly throw named error codes (`ESUNPATHTOOLONG`, `ESOCKETDIRSYMLINK`, `ESOCKETDIRFOREIGN`). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **model-server-supervision.cjs sun_path or ownership guards are missing**: ruled out — both `assertSunPathLimit` (lines 510-520) and `assertSocketDirOwnership` (lines 522-552) are present and correctly throw named error codes (`ESUNPATHTOOLONG`, `ESOCKETDIRSYMLINK`, `ESOCKETDIRFOREIGN`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **model-server-supervision.cjs sun_path or ownership guards are missing**: ruled out — both `assertSunPathLimit` (lines 510-520) and `assertSocketDirOwnership` (lines 522-552) are present and correctly throw named error codes (`ESUNPATHTOOLONG`, `ESOCKETDIRSYMLINK`, `ESOCKETDIRFOREIGN`).

### **Packet 045 goal D1** ("each phase must reproduce its failure BEFORE the guard, then prove the guard fires"): verified for Phases 1 and 2 in iter 1. Phases 3 and 4 test coverage gaps (EC-2, EC-3) remain open — deferred to iter 3. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Packet 045 goal D1** ("each phase must reproduce its failure BEFORE the guard, then prove the guard fires"): verified for Phases 1 and 2 in iter 1. Phases 3 and 4 test coverage gaps (EC-2, EC-3) remain open — deferred to iter 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Packet 045 goal D1** ("each phase must reproduce its failure BEFORE the guard, then prove the guard fires"): verified for Phases 1 and 2 in iter 1. Phases 3 and 4 test coverage gaps (EC-2, EC-3) remain open — deferred to iter 3.

### **Packet 045 goal D1** ("each phase must reproduce its failure BEFORE the guard, then prove the guard fires"): verified per phase — `production-db-isolation.vitest.ts:74-89` reproduces a non-test-context call against the production dir and asserts the named error; `orphan-daemon-reaping.vitest.ts:203-238` reproduces an aged orphan with exact ownership and asserts reap; both negative-control reproductions precede the guard assertion in the test body. **Aligned.** -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Packet 045 goal D1** ("each phase must reproduce its failure BEFORE the guard, then prove the guard fires"): verified per phase — `production-db-isolation.vitest.ts:74-89` reproduces a non-test-context call against the production dir and asserts the named error; `orphan-daemon-reaping.vitest.ts:203-238` reproduces an aged orphan with exact ownership and asserts reap; both negative-control reproductions precede the guard assertion in the test body. **Aligned.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Packet 045 goal D1** ("each phase must reproduce its failure BEFORE the guard, then prove the guard fires"): verified per phase — `production-db-isolation.vitest.ts:74-89` reproduces a non-test-context call against the production dir and asserts the named error; `orphan-daemon-reaping.vitest.ts:203-238` reproduces an aged orphan with exact ownership and asserts reap; both negative-control reproductions precede the guard assertion in the test body. **Aligned.**

### **Packet 045 goal D4** ("no change may signal a process belonging to a live session"): `orphan-daemon-reaping.vitest.ts:240-268` covers the live-parent case. **Aligned but** the test injects `getParentPid: () => process.pid` as a constant — the parent-dies-mid-sweep window (see P1-002) is NOT exercised. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Packet 045 goal D4** ("no change may signal a process belonging to a live session"): `orphan-daemon-reaping.vitest.ts:240-268` covers the live-parent case. **Aligned but** the test injects `getParentPid: () => process.pid` as a constant — the parent-dies-mid-sweep window (see P1-002) is NOT exercised.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Packet 045 goal D4** ("no change may signal a process belonging to a live session"): `orphan-daemon-reaping.vitest.ts:240-268` covers the live-parent case. **Aligned but** the test injects `getParentPid: () => process.pid` as a constant — the parent-dies-mid-sweep window (see P1-002) is NOT exercised.

### **Packet 045 goal D4** ("no change may signal a process belonging to a live session"): partially confirmed by `session-cleanup.js`'s start-hook kill switch (lines 63-66, 208-218) and the launcher's heartbeat self-healing (lines 121-125, 586-616). **Aligned on the start-hook axis; the P1-002 window remains unclosed on the cross-session axis.** -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Packet 045 goal D4** ("no change may signal a process belonging to a live session"): partially confirmed by `session-cleanup.js`'s start-hook kill switch (lines 63-66, 208-218) and the launcher's heartbeat self-healing (lines 121-125, 586-616). **Aligned on the start-hook axis; the P1-002 window remains unclosed on the cross-session axis.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Packet 045 goal D4** ("no change may signal a process belonging to a live session"): partially confirmed by `session-cleanup.js`'s start-hook kill switch (lines 63-66, 208-218) and the launcher's heartbeat self-healing (lines 121-125, 586-616). **Aligned on the start-hook axis; the P1-002 window remains unclosed on the cross-session axis.**

### **packet 058 introduces runtime safety drift**: ruled out — packet is Level 1 documentation drift correction; the spec.md (lines 62-64) describes the defect as the reference table listing only four `--permission-mode` values when the binary accepts eight; the consolidation publishes the corrected reference and a probe recipe. The skill's dispatch examples were correct (`spec.md:30` answered_questions); the reference table was the defect. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **packet 058 introduces runtime safety drift**: ruled out — packet is Level 1 documentation drift correction; the spec.md (lines 62-64) describes the defect as the reference table listing only four `--permission-mode` values when the binary accepts eight; the consolidation publishes the corrected reference and a probe recipe. The skill's dispatch examples were correct (`spec.md:30` answered_questions); the reference table was the defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **packet 058 introduces runtime safety drift**: ruled out — packet is Level 1 documentation drift correction; the spec.md (lines 62-64) describes the defect as the reference table listing only four `--permission-mode` values when the binary accepts eight; the consolidation publishes the corrected reference and a probe recipe. The skill's dispatch examples were correct (`spec.md:30` answered_questions); the reference table was the defect.

### **session-cleanup.js `runCleanup` stop-hook env override is a bug**: ruled out — line 229 sets `SPECKIT_STOP_HOOK_ORPHAN_SWEEP: 'off'`, which is the documented "fail-open at disposal" design. Operator who wants to enable stop-time sweep would set this env var; today, the comment at line 84 (`Logging must remain fail-open during startup and disposal`) is consistent. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **session-cleanup.js `runCleanup` stop-hook env override is a bug**: ruled out — line 229 sets `SPECKIT_STOP_HOOK_ORPHAN_SWEEP: 'off'`, which is the documented "fail-open at disposal" design. Operator who wants to enable stop-time sweep would set this env var; today, the comment at line 84 (`Logging must remain fail-open during startup and disposal`) is consistent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **session-cleanup.js `runCleanup` stop-hook env override is a bug**: ruled out — line 229 sets `SPECKIT_STOP_HOOK_ORPHAN_SWEEP: 'off'`, which is the documented "fail-open at disposal" design. Operator who wants to enable stop-time sweep would set this env var; today, the comment at line 84 (`Logging must remain fail-open during startup and disposal`) is consistent.

### **session-cleanup.js kill switch bypass via library import**: ruled out — `session-cleanup.js` imports only `node:child_process`, `node:fs`, `node:path`, `node:module`, `node:url` (lines 13-24); no `process-sweep` import. The bypass risk is FUTURE-ONLY, not present today. (P1-001 captures this risk.) -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **session-cleanup.js kill switch bypass via library import**: ruled out — `session-cleanup.js` imports only `node:child_process`, `node:fs`, `node:path`, `node:module`, `node:url` (lines 13-24); no `process-sweep` import. The bypass risk is FUTURE-ONLY, not present today. (P1-001 captures this risk.)
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **session-cleanup.js kill switch bypass via library import**: ruled out — `session-cleanup.js` imports only `node:child_process`, `node:fs`, `node:path`, `node:module`, `node:url` (lines 13-24); no `process-sweep` import. The bypass risk is FUTURE-ONLY, not present today. (P1-001 captures this risk.)

### **session-cleanup.js spawn of orphan sweep from production code via the library**: ruled out — line 32 declares `PROCESS_SWEEP_SCRIPT` as the COMPILED CLI path (`.js`), not the library (`.ts`). The spawn at lines 211-215 uses `process.execPath` (= current Node binary) on the CLI path. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **session-cleanup.js spawn of orphan sweep from production code via the library**: ruled out — line 32 declares `PROCESS_SWEEP_SCRIPT` as the COMPILED CLI path (`.js`), not the library (`.ts`). The spawn at lines 211-215 uses `process.execPath` (= current Node binary) on the CLI path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **session-cleanup.js spawn of orphan sweep from production code via the library**: ruled out — line 32 declares `PROCESS_SWEEP_SCRIPT` as the COMPILED CLI path (`.js`), not the library (`.ts`). The spawn at lines 211-215 uses `process.execPath` (= current Node binary) on the CLI path.

### **system-spec-memory-launcher.cjs launcher's self-healing closes the P1-002 window**: **ruled out as full closure** — the launcher's heartbeat (lines 586-616) and stdin-close handler (lines 618-637) DO shut down the launcher on host disposal, but the daemon child is spawned `detached: true` (lines 233-237) so it is NOT signaled. The launcher self-exits; the daemon inherits the orphaned state; process-sweep's plan-time ppid gate (process-sweep.ts:203) is the bottleneck. **P1-002 stands.** -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **system-spec-memory-launcher.cjs launcher's self-healing closes the P1-002 window**: **ruled out as full closure** — the launcher's heartbeat (lines 586-616) and stdin-close handler (lines 618-637) DO shut down the launcher on host disposal, but the daemon child is spawned `detached: true` (lines 233-237) so it is NOT signaled. The launcher self-exits; the daemon inherits the orphaned state; process-sweep's plan-time ppid gate (process-sweep.ts:203) is the bottleneck. **P1-002 stands.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **system-spec-memory-launcher.cjs launcher's self-healing closes the P1-002 window**: **ruled out as full closure** — the launcher's heartbeat (lines 586-616) and stdin-close handler (lines 618-637) DO shut down the launcher on host disposal, but the daemon child is spawned `detached: true` (lines 233-237) so it is NOT signaled. The launcher self-exits; the daemon inherits the orphaned state; process-sweep's plan-time ppid gate (process-sweep.ts:203) is the bottleneck. **P1-002 stands.**

### **system-spec-memory-launcher.cjs lease fencing has TOCTOU races**: ruled out — `acquireOwnerLeaseFile` (lines 510-558) double-checks leaseId before unlink; `refreshOwnerLeaseFile` (lines 560-577) fences on leaseId; `writeOwnerLeaseFileExclusive` (lines 436-450) uses `wx` O_EXCL create with fsync. The leaseId fence is the right primitive. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **system-spec-memory-launcher.cjs lease fencing has TOCTOU races**: ruled out — `acquireOwnerLeaseFile` (lines 510-558) double-checks leaseId before unlink; `refreshOwnerLeaseFile` (lines 560-577) fences on leaseId; `writeOwnerLeaseFileExclusive` (lines 436-450) uses `wx` O_EXCL create with fsync. The leaseId fence is the right primitive.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **system-spec-memory-launcher.cjs lease fencing has TOCTOU races**: ruled out — `acquireOwnerLeaseFile` (lines 510-558) double-checks leaseId before unlink; `refreshOwnerLeaseFile` (lines 560-577) fences on leaseId; `writeOwnerLeaseFileExclusive` (lines 436-450) uses `wx` O_EXCL create with fsync. The leaseId fence is the right primitive.

### agent_cross_runtime: partial — cross-CLI authority is hoisted, but the Devin playbook exposes stale guidance. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: agent_cross_runtime: partial — cross-CLI authority is hoisted, but the Devin playbook exposes stale guidance.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: agent_cross_runtime: partial — cross-CLI authority is hoisted, but the Devin playbook exposes stale guidance.

### checklist_evidence: fail — no checklist.md or tracked Phase 3/4 negative-control artifact; tasks and summaries are unlinked claims while both goals remain unchecked. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: checklist_evidence: fail — no checklist.md or tracked Phase 3/4 negative-control artifact; tasks and summaries are unlinked claims while both goals remain unchecked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: checklist_evidence: fail — no checklist.md or tracked Phase 3/4 negative-control artifact; tasks and summaries are unlinked claims while both goals remain unchecked.

### Core `checklist_evidence`: partial. Tasks and goal criteria are reconciled for Phases 3 and 4, but the evidence is prose-log based rather than replayable artifacts. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Core `checklist_evidence`: partial. Tasks and goal criteria are reconciled for Phases 3 and 4, but the evidence is prose-log based rather than replayable artifacts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: partial. Tasks and goal criteria are reconciled for Phases 3 and 4, but the evidence is prose-log based rather than replayable artifacts.

### Core `spec_code`: partial. P1-001 through P1-003 still trace to implementation/consumer seams; Phase 3 and Phase 4 completion claims now have durable goal-log measurements and checked criteria. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Core `spec_code`: partial. P1-001 through P1-003 still trace to implementation/consumer seams; Phase 3 and Phase 4 completion claims now have durable goal-log measurements and checked criteria.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: partial. P1-001 through P1-003 still trace to implementation/consumer seams; Phase 3 and Phase 4 completion claims now have durable goal-log measurements and checked criteria.

### feature_catalog_code: not_applicable. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: feature_catalog_code: not_applicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: feature_catalog_code: not_applicable.

### Graph/semantic search: unavailable; graphless fallback used direct reads, exact searches, inventory, and carry-forward adjudication. `resource-map.md` is absent. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Graph/semantic search: unavailable; graphless fallback used direct reads, exact searches, inventory, and carry-forward adjudication. `resource-map.md` is absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Graph/semantic search: unavailable; graphless fallback used direct reads, exact searches, inventory, and carry-forward adjudication. `resource-map.md` is absent.

### Overlay `agent_cross_runtime`: partial. The authority rule is hoisted correctly, while the Devin playbook still exposes historical contradictory guidance. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Overlay `agent_cross_runtime`: partial. The authority rule is hoisted correctly, while the Devin playbook still exposes historical contradictory guidance.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `agent_cross_runtime`: partial. The authority rule is hoisted correctly, while the Devin playbook still exposes historical contradictory guidance.

### Overlay `feature_catalog_code`: not applicable. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Overlay `feature_catalog_code`: not applicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `feature_catalog_code`: not applicable.

### Overlay `playbook_capability`: fail for the stale permission guidance; pass for the newly recorded Phase 3/4 capability results. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Overlay `playbook_capability`: fail for the stale permission guidance; pass for the newly recorded Phase 3/4 capability results.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `playbook_capability`: fail for the stale permission guidance; pass for the newly recorded Phase 3/4 capability results.

### Overlay `skill_agent`: partial. The parent skill's installed-binary authority is correct, but the cli-devin root precondition and table remain stale. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Overlay `skill_agent`: partial. The parent skill's installed-binary authority is correct, but the cli-devin root precondition and table remain stale.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `skill_agent`: partial. The parent skill's installed-binary authority is correct, but the cli-devin root precondition and table remain stale.

### Phase 1 (negative control): the test at line 66-72 establishes that a normal vitest call lands under `os.tmpdir()` — but the assertion `isWithinDirectory(fs.realpathSync(resolvedDatabaseDir), resolvedTempDir)` does NOT verify that the resolved path is NOT inside any other sensitive tree (e.g., the skill's own `database/`). The production-DB-realpath comparison at line 70 catches it; **OK.** -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Phase 1 (negative control): the test at line 66-72 establishes that a normal vitest call lands under `os.tmpdir()` — but the assertion `isWithinDirectory(fs.realpathSync(resolvedDatabaseDir), resolvedTempDir)` does NOT verify that the resolved path is NOT inside any other sensitive tree (e.g., the skill's own `database/`). The production-DB-realpath comparison at line 70 catches it; **OK.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 1 (negative control): the test at line 66-72 establishes that a normal vitest call lands under `os.tmpdir()` — but the assertion `isWithinDirectory(fs.realpathSync(resolvedDatabaseDir), resolvedTempDir)` does NOT verify that the resolved path is NOT inside any other sensitive tree (e.g., the skill's own `database/`). The production-DB-realpath comparison at line 70 catches it; **OK.**

### Phase 1 (production-db isolation): checklist row `fails-closed-with-named-error` is exercised at `production-db-isolation.vitest.ts:74-89` (asserts `ProductionDatabaseResolutionError` instance + name + databaseDir). **Proven.** -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Phase 1 (production-db isolation): checklist row `fails-closed-with-named-error` is exercised at `production-db-isolation.vitest.ts:74-89` (asserts `ProductionDatabaseResolutionError` instance + name + databaseDir). **Proven.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 1 (production-db isolation): checklist row `fails-closed-with-named-error` is exercised at `production-db-isolation.vitest.ts:74-89` (asserts `ProductionDatabaseResolutionError` instance + name + databaseDir). **Proven.**

### Phase 1 (production-db isolation): confirmed in iter 1 (`production-db-isolation.vitest.ts:74-89`). **No new check this iteration.** -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Phase 1 (production-db isolation): confirmed in iter 1 (`production-db-isolation.vitest.ts:74-89`). **No new check this iteration.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 1 (production-db isolation): confirmed in iter 1 (`production-db-isolation.vitest.ts:74-89`). **No new check this iteration.**

### Phase 2 (connected socket peer): exercised at `orphan-daemon-reaping.vitest.ts:270-296`. **Proven** (note: uses `evidenceByPid` injection, not live `lsof` — see P2-002). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Phase 2 (connected socket peer): exercised at `orphan-daemon-reaping.vitest.ts:270-296`. **Proven** (note: uses `evidenceByPid` injection, not live `lsof` — see P2-002).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 2 (connected socket peer): exercised at `orphan-daemon-reaping.vitest.ts:270-296`. **Proven** (note: uses `evidenceByPid` injection, not live `lsof` — see P2-002).

### Phase 2 (kill switch): exercised at `orphan-daemon-reaping.vitest.ts:298-318`. **Proven** for the CLI path; **NOT proven** for the library path (see P1-001). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Phase 2 (kill switch): exercised at `orphan-daemon-reaping.vitest.ts:298-318`. **Proven** for the CLI path; **NOT proven** for the library path (see P1-001).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 2 (kill switch): exercised at `orphan-daemon-reaping.vitest.ts:298-318`. **Proven** for the CLI path; **NOT proven** for the library path (see P1-001).

### Phase 2 (live-parent preserved): exercised at `orphan-daemon-reaping.vitest.ts:240-268`. **Proven.** -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Phase 2 (live-parent preserved): exercised at `orphan-daemon-reaping.vitest.ts:240-268`. **Proven.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 2 (live-parent preserved): exercised at `orphan-daemon-reaping.vitest.ts:240-268`. **Proven.**

### Phase 2 (orphan daemon reaping): checklist row `reaps-only-aged-exactly-owned-orphan` exercised at `orphan-daemon-reaping.vitest.ts:203-238`. **Proven**, but see P1-002 for the parent-pid staleness gap. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Phase 2 (orphan daemon reaping): checklist row `reaps-only-aged-exactly-owned-orphan` exercised at `orphan-daemon-reaping.vitest.ts:203-238`. **Proven**, but see P1-002 for the parent-pid staleness gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 2 (orphan daemon reaping): checklist row `reaps-only-aged-exactly-owned-orphan` exercised at `orphan-daemon-reaping.vitest.ts:203-238`. **Proven**, but see P1-002 for the parent-pid staleness gap.

### Phase 2 (orphan daemon reaping): confirmed for happy paths in iter 1; P1-002 reveals coverage gap for parent-dies-mid-sweep. **Carry-forward gap, not a regression.** -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Phase 2 (orphan daemon reaping): confirmed for happy paths in iter 1; P1-002 reveals coverage gap for parent-dies-mid-sweep. **Carry-forward gap, not a regression.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 2 (orphan daemon reaping): confirmed for happy paths in iter 1; P1-002 reveals coverage gap for parent-dies-mid-sweep. **Carry-forward gap, not a regression.**

### Phase 3 (test-hang containment): not directly exercised in the reviewed test files — `run-tests.mjs` python wrapper bounded-vitest is not under unit test in scope. **Coverage gap (EC-2) carries to iter 3.** -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Phase 3 (test-hang containment): not directly exercised in the reviewed test files — `run-tests.mjs` python wrapper bounded-vitest is not under unit test in scope. **Coverage gap (EC-2) carries to iter 3.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 3 (test-hang containment): not directly exercised in the reviewed test files — `run-tests.mjs` python wrapper bounded-vitest is not under unit test in scope. **Coverage gap (EC-2) carries to iter 3.**

### Phase 3 (test-hang containment): not directly exercised in the reviewed test files — the tests in `production-db-isolation.vitest.ts` and `orphan-daemon-reaping.vitest.ts` run via vitest directly, not via `run-tests.mjs`. **Coverage gap** (no test in scope demonstrates that the python wrapper actually bounds a hung vitest). Logged for iter 3. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Phase 3 (test-hang containment): not directly exercised in the reviewed test files — the tests in `production-db-isolation.vitest.ts` and `orphan-daemon-reaping.vitest.ts` run via vitest directly, not via `run-tests.mjs`. **Coverage gap** (no test in scope demonstrates that the python wrapper actually bounds a hung vitest). Logged for iter 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 3 (test-hang containment): not directly exercised in the reviewed test files — the tests in `production-db-isolation.vitest.ts` and `orphan-daemon-reaping.vitest.ts` run via vitest directly, not via `run-tests.mjs`. **Coverage gap** (no test in scope demonstrates that the python wrapper actually bounds a hung vitest). Logged for iter 3.

### Phase 4 (live-follow log hygiene): no test file in scope asserts rotation, dedup correctness, or lock uniqueness. **Coverage gap (EC-3) carries to iter 3.** -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Phase 4 (live-follow log hygiene): no test file in scope asserts rotation, dedup correctness, or lock uniqueness. **Coverage gap (EC-3) carries to iter 3.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 4 (live-follow log hygiene): no test file in scope asserts rotation, dedup correctness, or lock uniqueness. **Coverage gap (EC-3) carries to iter 3.**

### Phase 4 (live-follow log hygiene): no test file in scope asserts rotation, dedup correctness, or lock uniqueness. **Coverage gap.** Logged for iter 3. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Phase 4 (live-follow log hygiene): no test file in scope asserts rotation, dedup correctness, or lock uniqueness. **Coverage gap.** Logged for iter 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 4 (live-follow log hygiene): no test file in scope asserts rotation, dedup correctness, or lock uniqueness. **Coverage gap.** Logged for iter 3.

### playbook_capability: fail — stale enum guidance and absent retained Phase 3/4 capability evidence remain reachable. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: playbook_capability: fail — stale enum guidance and absent retained Phase 3/4 capability evidence remain reachable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: playbook_capability: fail — stale enum guidance and absent retained Phase 3/4 capability evidence remain reachable.

### skill_agent: partial — cli-devin gotcha and parent rule direct probing, but the playbook precondition and environment table remain contradictory. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: skill_agent: partial — cli-devin gotcha and parent rule direct probing, but the playbook precondition and environment table remain contradictory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: skill_agent: partial — cli-devin gotcha and parent rule direct probing, but the playbook precondition and environment table remain contradictory.

### spec_code: partial — guards exist, but Phase 3/4 completion metadata and retained acceptance evidence do not align; packet 058 primary reference and hub rule are correct while the playbook retains stale guidance. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: spec_code: partial — guards exist, but Phase 3/4 completion metadata and retained acceptance evidence do not align; packet 058 primary reference and hub rule are correct while the playbook retains stale guidance.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: spec_code: partial — guards exist, but Phase 3/4 completion metadata and retained acceptance evidence do not align; packet 058 primary reference and hub rule are correct while the playbook retains stale guidance.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Review angles that were investigated and definitively eliminated]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- **Dimension:** D3 Traceability (residual) + D1 Correctness (Phase 3/4 test coverage gaps). - **Focus area:** - (a) **Phase 3 test-hang containment** (EC-2): verify both `vitest.config.ts` files (`.opencode/skills/system-spec-kit/vitest.config.ts` and `.opencode/skills/system-spec-kit/mcp-server/vitest.config.ts`) — check whether they override the timeout or run tests under a config that bypasses `run-tests.mjs` entirely; confirm whether a fixture exists that exercises the python wrapper's bounded vitest run. - (b) **Phase 4 live-follow log hygiene** (EC-3): search for any test or fixture that demonstrates rotation, dedup correctness, or lock acquisition is bounded in git-live-follow.sh; either confirm the gap or find the missing fixture. - (c) **cli-devin deeper read**: `cli-devin/SKILL.md`, `cli-devin/references/cli-reference.md` (verify the corrected enum row matches REQ-001's "five canonical values and both alias groups"), and `cli-devin/manual-testing-playbook/cli-invocation/smart-permission-doc-runtime-mismatch.md` (verify the DV-004 staleness banner). - **Reason:** Iter 2 confirmed both carry-forward P1s with new evidence from session-cleanup.js and system-spec-memory-launcher.cjs. The residual surface is the test-coverage gaps for Phases 3 and 4 — a reviewer's job is not to invent tests but to verify the spec/code alignment evidence. If fixtures exist in unreviewed files, the gap closes; if not, the gap carries as a coverage finding. - **Rotation status:** not stuck; P1-001 and P1-002 are both confirmed and independent (killable separately by `/speckit:plan`); no P0 active; convergence trend is steady. - **Blocked/productive carry-forward:** none blocked. EC-2 and EC-3 are productive open coverage gaps. P1-001 and P1-002 carry as confirmed; both have explicit `downgradeTrigger` in the claim adjudication. - **Required evidence for iter 3:** direct read of both `vitest.config.ts` files; grep for `rotate_log_if_needed` and `acquire_lock` test fixtures across the spec-memory test surface; direct read of `cli-devin/SKILL.md` and `cli-devin/references/cli-reference.md`; direct read of `cli-devin/manual-testing-playbook/cli-invocation/smart-permission-doc-runtime-mismatch.md`. - **Recovery note:** none — second iteration completed cleanly within budget; no escalation required. ---

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers:**
  - `.opencode/skills/system-spec-kit/shared/paths.ts`
  - `.opencode/skills/system-spec-kit/vitest.config.ts`
  - `.opencode/skills/system-spec-kit/mcp-server/tests/production-db-isolation.vitest.ts`
  - `.opencode/bin/system-spec-memory-launcher.cjs`
  - `.opencode/bin/lib/model-server-supervision.cjs`
  - `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts`
  - `.opencode/plugins/session-cleanup.js`
  - `.opencode/skills/system-spec-kit/mcp-server/tests/orphan-daemon-reaping.vitest.ts`
  - `.opencode/skills/system-spec-kit/mcp-server/scripts/run-tests.mjs`
  - `.opencode/skills/system-spec-kit/mcp-server/vitest.config.ts`
  - `.opencode/bin/git-live-follow.sh`
  - `specs/cli-external-orchestration/058-flag-enum-authority`
  - `.opencode/skills/cli-external-orchestration/SKILL.md`
  - `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md`
  - `.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md`
  - `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/`

- **Behavior claims to verify (per packet 045 goal.md D1):**
  - D1: Each phase must reproduce its failure BEFORE the guard, then prove the guard fires on that reproduction.
  - D4: No change may signal a process belonging to a live session.

- **Risk focus (per operator brief):**
  - `process-sweep.ts` predicate must require ALL of: exact ownership evidence, no live parent, no connected socket peer, age past startup grace window.
  - `paths.ts` fails closed only in a test context.
  - `run-tests.mjs` must not kill its own caller's process group.
  - `git-live-follow.sh` must not swallow genuinely changed conditions.

- **Out-of-scope:** re-classification, style refactors, new test creation, implementation fixes.

---

## 14. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pending | — | packet 045 four phases spec ↔ implementation files |
| `checklist_evidence` | core | pending | — | per-phase checklist.md ↔ negative-control evidence |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` | D1, D2 | 1 | P1-001, P1-002, P2-001, P2-002 | reviewed |
| `.opencode/skills/system-spec-kit/shared/paths.ts` | D1, D2 | 1 | P2-007, P2-008 | reviewed |
| `.opencode/skills/system-spec-kit/mcp-server/scripts/run-tests.mjs` | D1, D2 | 1 | P2-003 | reviewed |
| `.opencode/bin/git-live-follow.sh` | D1, D2, D4 | 1 | P2-004, P2-005, P2-006 | reviewed |
| `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts` | D2 | 1 | none (grep-only) | confirmed clean |
| `.opencode/skills/system-spec-kit/mcp-server/tests/production-db-isolation.vitest.ts` | D3 | 1 | none (coverage adequate for Phase 1) | reviewed |
| `.opencode/skills/system-spec-kit/mcp-server/tests/orphan-daemon-reaping.vitest.ts` | D3 | 1 | none (coverage adequate for Phase 2 happy paths; P1-002 reveals coverage gap for parent-dies-mid-sweep) | reviewed |
| `.opencode/bin/system-spec-memory-launcher.cjs` | — | — | — | queued iter 2 |
| `.opencode/bin/lib/model-server-supervision.cjs` | — | — | — | queued iter 2 |
| `.opencode/plugins/session-cleanup.js` | — | — | — | queued iter 2 |
| `.opencode/skills/system-spec-kit/vitest.config.ts` | — | — | — | queued iter 2 |
| `.opencode/skills/system-spec-kit/mcp-server/vitest.config.ts` | — | — | — | queued iter 2 |
| `specs/cli-external-orchestration/058-flag-enum-authority` + cli-devin surface | — | — | — | queued iter 2 |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 4
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-08-31-auto-deep-review-045, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-08-31T00:00:00Z
- Executor: cli-cursor (model=cursor-grok-4.6-xhigh, timeout=900s)
- Stop policy: convergence
- Convergence mode: default
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

[Reserved for future mid-review snapshot]
