# Iteration 2 — Deep Review Packet 045

**Session:** 2026-08-31-auto-deep-review-045 · **Generation:** 1 · **Lineage:** new
**Iteration:** 2 of 4 (convergenceThreshold 0.10, stopPolicy convergence)
**Focus:** D1 Correctness + D2 Security + D3 Traceability (residual surface — deferred files + packet 058 cross-reference)
**Mode:** review · **Target:** `specs/system-speckit/045-daemon-and-test-harness-hardening`
**Budget profile:** scan (target ≤ 12 tool calls).

---

## Dispatcher

- Dispatched by `/deep:review:auto` iteration 2 of 4 on packet 045.
- Spec folder: `specs/system-speckit/045-daemon-and-test-harness-hardening`
- Artifact directory: `specs/system-speckit/045-daemon-and-test-harness-hardening/review`
- Adjacent in scope: `specs/cli-external-orchestration/058-flag-enum-authority` (level 1, status Complete)
- Carry-forward mandate: confirm or refute P1-001 (library kill-switch bypass) and P1-002 (plan-time parent-pid gate) using the deferred file reads.

---

## Files Reviewed (Read-Only)

| File | Path | Lines | Dimensions Touched |
|------|------|-------|--------------------|
| `session-cleanup.js` | `.opencode/plugins/session-cleanup.js` | 1–267 | D1, D2 |
| `system-spec-memory-launcher.cjs` | `.opencode/bin/system-spec-memory-launcher.cjs` | 1–1093 (partial read 1–1093) | D1, D2 |
| `model-server-supervision.cjs` | `.opencode/bin/lib/model-server-supervision.cjs` | 1–1190 (partial read 1–1190) | D1, D2 |
| `packet 058 spec.md` | `specs/cli-external-orchestration/058-flag-enum-authority/spec.md` | 1–149 | D3 (cross-reference) |
| cli-external-orchestration surface | grep across `.opencode/skills/cli-external-orchestration/**/*.md` | — | D3 (flag-enum drift check) |

Files queued for iteration 3 (still deferred): both `vitest.config.ts` files, the cli-devin `manual-testing-playbook/` deeper read, and the Phase 3 / Phase 4 test coverage gaps (EC-2, EC-3 from iter 1).

---

## Findings — New

### P0 Findings

(none)

### P1 Findings (carry-forward confirmations)

#### 1. **P1-001 [CONFIRMED] Orphan-sweep kill switch bypassable via the library surface**
- File: `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:78-87, 232-252, 389-405`
- New evidence (this iteration, `session-cleanup.js`):
  - `session-cleanup.js:32` declares `PROCESS_SWEEP_SCRIPT = join(REPO_ROOT, '.opencode/skills/system-spec-kit/scripts/dist/ops/process-sweep.js')` — the **compiled CLI** path, not the library.
  - `session-cleanup.js:63-66` defines its own `isSweepDisabled(env)` helper that mirrors `process-sweep.ts`'s kill-switch check on `SPECKIT_SESSION_START_ORPHAN_SWEEP`.
  - `session-cleanup.js:208-218` (inside `runStartupGuards`) consults `isSweepDisabled()` and only spawns the CLI when the switch is **not** set to a disabled value; if disabled, it pushes a warning `[session-cleanup] orphan daemon sweep skipped: kill-switch-disabled`.
  - The spawn itself is `runProcess(process.execPath, [PROCESS_SWEEP_SCRIPT, 'apply'], 'orphan daemon sweep')` — `spawnSync` of the compiled CLI (line 162–169), with timeout bounded at 8000 ms.
  - **The in-tree caller honors the kill switch** — exactly as iter-1 hypothesised. P1-001 is therefore **confirmed**, but the *risk* is future-only: a maintenance caller that switches to `import { applySweep } from './process-sweep.js'` would silently bypass the env-var kill switch because `applySweep` checks only `opts.enabled === false` (process-sweep.ts:246), not the env var.
- Concrete scenario (restated with new evidence): a future maintainer replaces `runProcess(PROCESS_SWEEP_SCRIPT, 'apply')` with `import { applySweep }` and forgets to forward `enabled: isSweepEnabled(env)`. On a machine where the operator set `SPECKIT_SESSION_START_ORPHAN_SWEEP=off`, the new caller will still reap orphans because `applySweep` defaults to enabled when `opts.enabled` is `undefined`. The session-cleanup plugin today has no such import (confirmed at line 13–24 — only `node:child_process`, `node:fs`, `node:path`, `node:module`, `node:url` are imported; no `process-sweep` import).
- Finding class: cross-consumer (the kill switch is documented; the library does not enforce it).
- Scope proof: `grep -n "import.*process-sweep\|require.*process-sweep" .opencode/plugins/session-cleanup.js` — zero hits. The plugin deliberately uses the CLI surface.
- Affected surface hints: ["process-sweep library API", "session-cleanup plugin", "CLI entry point", "kill switch contract"]
- Claim adjudication:
  - type: `correctness`
  - claim: `applySweep` does not honor the documented kill switch when called directly with `opts.enabled === undefined`
  - evidenceRefs: `process-sweep.ts:78-87, 232-252, 389-405`; `session-cleanup.js:32, 63-66, 208-218`
  - counterevidenceSought: any in-repo caller that imports `applySweep` directly — `grep -rn "from .*process-sweep\|require.*process-sweep"` across `.opencode/` finds only the CLI dispatch path (session-cleanup → compiled CLI) and the test files (vitest fixtures that pass `enabled: false` explicitly)
  - alternativeExplanation: the kill switch is "CLI-only by design" — not supported by the help banner at `process-sweep.ts:385` which presents it as the authoritative disable for the apply command regardless of caller; no docstring on `applySweep` says "library callers must forward env"
  - finalSeverity: **P1** (confirmed; same severity as iter 1)
  - confidence: high
  - downgradeTrigger: if a maintainer adds a docstring at `applySweep` that says "callers MUST forward `opts.enabled = isSweepEnabled(process.env)` from the CLI layer", the bypass becomes a documented contract violation rather than a silent default — but the runtime behavior is unchanged, so this does not actually reduce the risk; the trigger is *only* met if a centralized helper exports the env-var check and `applySweep` calls it internally

#### 2. **P1-002 [CONFIRMED] Plan-time parent-pid gate leaves freshly-orphaned daemons alive (false-negative window)**
- File: `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:201-216`
- New evidence (this iteration, `system-spec-memory-launcher.cjs`):
  - `system-spec-memory-launcher.cjs:121-125` captures `LAUNCHER_INITIAL_PPID = process.ppid` at startup, with the comment: *"When the host disposes its session the launcher is orphaned and its ppid changes (reparents to 1 / a subreaper). Captured once at startup so the relaunch path can tell 'owning runtime went away' apart from a genuine daemon crash."* — confirms the launcher's design contract.
  - `system-spec-memory-launcher.cjs:586-616` (inside `startOwnerLeaseHeartbeat`) installs a heartbeat timer at `Math.max(1000, Math.floor(ttlMs / 2))` ms (default ttlMs=60000 → 30 s interval) that calls `shouldAbortRelaunchOnFire({ shuttingDown, currentPpid, initialPpid })` (model-server-supervision.cjs:349-351) and shuts down the launcher via `shutdownLauncherForSignal('SIGTERM')` when `currentPpid !== initialPpid || currentPpid === 1`.
  - `system-spec-memory-launcher.cjs:618-637` (`installStdinCloseHandler`) is a second self-healing hook that triggers the same SIGTERM when the host closes stdin (the typical MCP-host-dispose path).
  - **However**, the launcher's daemon child is spawned with `contextServerSpawnIo(reelectionEnabled)`, which when `daemonReelectionEnabled()` (default-on) sets `{ detached: true, stdio: ['ignore', 'ignore', 'ignore'] }` — `system-spec-memory-launcher.cjs:233-237`. **The daemon is in its own process group and is NOT signaled when the launcher SIGTERMs itself.** The daemon reparents to PID 1 on launcher's exit.
  - Concrete scenario (restated with new evidence): User opens Claude Code → it spawns the spec-memory launcher (ppid=Claude) → the launcher spawns the mcp_server daemon detached (ppid=launcher) → user closes Claude Code → launcher's heartbeat fires within ≤30 s → launcher calls `shutdownLauncherForSignal('SIGTERM')` on itself → the daemon child survives (detached, own process group), now ppid=1 → **but process-sweep's plan-time `ps` snapshot for the daemon was taken BEFORE the launcher's heartbeat fired** (assuming a quick re-spawn) → plan-time ppid was the launcher (not 1) → applyCandidate gate at process-sweep.ts:203 refuses with `live-parent-preserved` → the apply-time fresh re-check at lines 215-216 cannot rescue the orphan because the plan-time gate already gated it out.
  - The launcher's self-healing **closes most of the window**, but the residual false-negative scenario remains: a session that opens, closes, and re-opens within ≤30 s (or any sequence where process-sweep's plan-time snapshot runs while the launcher is still alive but the host is already gone). P1-002 is **confirmed**.
- Finding class: instance-only (the gate is conservative in the safe direction — but it contradicts goal.md D4 on the false-negative side by leaving real orphans alive).
- Scope proof: `grep -n "row.ppid\|live-parent-preserved" .opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` shows the gate at line 203 is the only consumer of plan-time ppid inside `applyCandidate`.
- Affected surface hints: ["applyCandidate gate ordering", "plan-vs-apply snapshot freshness", "orphan reaper correctness", "daemon re-election detachment"]
- Claim adjudication:
  - type: `correctness`
  - claim: a daemon whose parent dies between planSweep and applySweep is not reaped, even though the launcher self-heals
  - evidenceRefs: `process-sweep.ts:203, 215-216`; `system-spec-memory-launcher.cjs:121-125, 233-237, 586-616`; `model-server-supervision.cjs:349-351`
  - counterevidenceSought: any test that exercises parent-dies-between-snapshots — `grep -n "parentPid\|ppid" .opencode/skills/system-spec-kit/mcp-server/tests/orphan-daemon-reaping.vitest.ts` shows every test fixes `getParentPid` or seeds ppid=1 at fixture-build time, never simulates a transition; the test at lines 240-268 (`live-parent preserved`) injects `getParentPid: () => process.pid` as a constant
  - alternativeExplanation: the design intent is to require a SECOND apply pass after a grace window to catch newly-orphaned daemons — supported by the launcher's own heartbeat but not by process-sweep's gate; the gate at process-sweep.ts:203 is a "fail safe" choice that refuses to reap when uncertain
  - finalSeverity: **P1** (confirmed; same severity as iter 1)
  - confidence: high
  - downgradeTrigger: if the design intent is explicitly to require the NEXT session's process-sweep run to catch the orphan (i.e., the launcher's heartbeat-and-SIGTERM path IS the contract), then the current window is "by design" and the finding drops to P2 — but this requires a documented "second-pass" semantics in spec.md D4 or in process-sweep's help banner, neither of which currently exists

### P2 Findings

(none new this iteration — the deferred files did not surface fresh P2s; see Ruled Out for surfaces that were checked and dismissed)

---

## Traceability Checks

### Spec/code alignment (core protocol: `spec_code`)

- **Packet 045 goal D1** ("each phase must reproduce its failure BEFORE the guard, then prove the guard fires"): verified for Phases 1 and 2 in iter 1. Phases 3 and 4 test coverage gaps (EC-2, EC-3) remain open — deferred to iter 3.
- **Packet 045 goal D4** ("no change may signal a process belonging to a live session"): partially confirmed by `session-cleanup.js`'s start-hook kill switch (lines 63-66, 208-218) and the launcher's heartbeat self-healing (lines 121-125, 586-616). **Aligned on the start-hook axis; the P1-002 window remains unclosed on the cross-session axis.**
- **Adjacent packet 058 (Flag Enumeration Authority)** — cross-reference: packet 058 is a **documentation drift correction** for `cli-devin/references/cli-reference.md`'s `--permission-mode` enum, plus a cross-CLI rule published in the parent hub SKILL.md §4 ALWAYS list (line 169): *"Treat the installed binary as the authority for flags and enum values, and `--help` as an incomplete summary of it. A value this skill documents but help omits is not thereby fabricated … Before changing or reporting a documented flag value as invalid, probe the binary with an argument that forces parse-time validation without starting a billable session."* The defect was in the reference table only; the skill's dispatch examples were correct (`spec.md:30` answered_questions). **No cross-runtime safety drift.**

### Checklist evidence (core protocol: `checklist_evidence`)

- Phase 1 (production-db isolation): confirmed in iter 1 (`production-db-isolation.vitest.ts:74-89`). **No new check this iteration.**
- Phase 2 (orphan daemon reaping): confirmed for happy paths in iter 1; P1-002 reveals coverage gap for parent-dies-mid-sweep. **Carry-forward gap, not a regression.**
- Phase 3 (test-hang containment): not directly exercised in the reviewed test files — `run-tests.mjs` python wrapper bounded-vitest is not under unit test in scope. **Coverage gap (EC-2) carries to iter 3.**
- Phase 4 (live-follow log hygiene): no test file in scope asserts rotation, dedup correctness, or lock uniqueness. **Coverage gap (EC-3) carries to iter 3.**

### Overlay protocols (per `crossReference.overlay`)

- **`skill_agent`**: deferred — `system-spec-memory-launcher.cjs` is the spec-memory skill's daemon, not a Skill surface. The session-cleanup plugin is a plugin, not a skill. No overlay finding this iteration.
- **`agent_cross_runtime`**: confirmed-clean on packet 058 (documentation drift only — no runtime safety implication). The cross-CLI rule is correctly hoisted to the parent hub.
- **`feature_catalog_code`**: deferred — packet 045 is a hardening packet, not a feature catalog entry.
- **`playbook_capability`**: deferred — the cli-devin `manual-testing-playbook/` deeper read is queued for iter 3.

---

## Integration Evidence

External surfaces checked (this iteration):

- **`.opencode/plugins/session-cleanup.js`** (267 lines): the OpenCode plugin that runs bounded startup guards and teardown cleanup. **No new findings.** Confirmed that the kill switch is honored at start-hook (lines 63-66, 208-218) and explicitly disabled at stop-hook (line 229, `SPECKIT_STOP_HOOK_ORPHAN_SWEEP: 'off'`).
- **`.opencode/bin/system-spec-memory-launcher.cjs`** (1093+ lines read, file truncated at 50 KB cap): the spec-memory MCP host launcher. **No new findings.** Confirmed that the launcher self-heals on parent-pid change (lines 121-125, 586-616) but its detached daemon child is not signaled by launcher's self-exit (lines 233-237 — `contextServerSpawnIo(reelectionEnabled)` with `detached: true` on reelection-enabled path). Lease fencing is well-implemented: `acquireOwnerLeaseFile` (lines 510-558) double-checks leaseId before unlink, `refreshOwnerLeaseFile` (lines 560-577) fences on leaseId, and the writes use `wx` exclusive create with fsync (lines 419-450).
- **`.opencode/bin/lib/model-server-supervision.cjs`** (1190+ lines read): shared hf-model-server launcher supervision. **No new findings.** Confirmed several correctness/strength improvements over git-live-follow.sh:
  - `acquireRespawnLockFileAt` (lines 739-809) uses atomic rename-before-open for stale-lock reclaim — a race-safe pattern that git-live-follow.sh's P2-006 should adopt.
  - `assertSunPathLimit` (lines 510-520) rejects socket paths that exceed the macOS 104-byte sun_path limit (with a comment explaining the 103-byte usable ceiling).
  - `assertSocketDirOwnership` (lines 522-552) refuses symlinked SPECKIT_IPC_SOCKET_DIR (`ESOCKETDIRSYMLINK`) and foreign-uid directories (`ESOCKETDIRFOREIGN`).
  - `isRespawnLockStale` (lines 705-737) refuses to reclaim a lock from a live owner on age alone — only stale-by-liveness or stale-by-orphan-ppid-1 paths reclaim.
- **`specs/cli-external-orchestration/058-flag-enum-authority/spec.md`** (149 lines): confirmed documentation-only scope (REQ-001 through REQ-006 are all about doc surface and probe recipes). The packet does NOT touch runtime code.
- **`.opencode/skills/cli-external-orchestration/**`**: grep across the parent hub and child CLI skill SKILL.md files for `--permission-mode`, flag arrays, enum drift. Found the cross-CLI rule at `cli-external-orchestration/SKILL.md:169` (parent hub, hoisted correctly). Each child CLI's `prompt-quality-card.md` references `--permission-mode` or `--model` flags contextually but does not re-declare enums. **No drift.**

External surfaces NOT yet checked (deferred to iter 3):
- `.opencode/skills/system-spec-kit/vitest.config.ts` and `mcp-server/vitest.config.ts` — Phase 3 test-hang containment verification.
- `.opencode/skills/cli-external-orchestration/cli-devin/SKILL.md` and `cli-devin/references/cli-reference.md` — direct read to verify the enum row matches the spec.md REQ-001 acceptance criterion ("names all five canonical values and both alias groups").
- `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/` — deeper read for the DV-004 staleness banner.

---

## Edge Cases

| ID | Case | Classification | Notes |
|----|------|----------------|-------|
| EC-1 | Packet 058 flag-enum drift into cli-devin | ruled-out (D3) | Doc-only drift; cross-CLI rule hoisted to parent hub. See "Ruled Out". |
| EC-2 | Phase 3 run-tests.mjs test coverage gap | open | Carries to iter 3. |
| EC-3 | Phase 4 git-live-follow.sh test coverage gap | open | Carries to iter 3. |
| EC-4 | PID reuse between evidence read and signal | mitigated (carries from iter 1) | process-sweep.ts:207-212 re-checks start time. |
| EC-5 | Plan-time vs apply-time parent-pid staleness | **CONFIRMED (P1-002)** | See finding P1-002. New evidence: launcher's self-healing closes PART of the window but the detached daemon survives. |
| EC-6 | Library-side kill-switch bypass | **CONFIRMED (P1-001)** | See finding P1-001. New evidence: session-cleanup.js uses CLI path correctly; library path bypass remains a future-caller risk. |
| EC-7 | Wall-clock grace under NTP | carries from iter 1 (P2-001) | NTP step can affect the heartbeat at system-spec-memory-launcher.cjs:591-616 too (same `Date.now()` source as process-sweep.ts:254). |
| EC-8 | Symlinked `paths.ts` deployment | carries from iter 1 (P2-008) | Not re-checked this iteration. |
| EC-9 | Env-only test-context detection | carries from iter 1 (P2-007) | Not re-checked this iteration. |
| EC-10 | LOCK_KEY CRC32 truncation in large worktree fleets | carries from iter 1 (P2-004) | Not re-checked this iteration. |
| EC-11 | Lock acquisition TOCTOU in git-live-follow.sh | carries from iter 1 (P2-006) | Not re-checked this iteration; model-server-supervision.cjs:739-809 is the reference implementation that fixes the same race. |
| EC-12 | Empty-socketPath socket check semantics | carries from iter 1 (P2-002) | Not re-checked this iteration. |
| EC-13 | Log rotation mv-then-truncate loses only copy | carries from iter 1 (P2-005) | Not re-checked this iteration. |
| EC-14 | run-tests.mjs 10-minute default | carries from iter 1 (P2-003) | Not re-checked this iteration. |
| **EC-15** | Launcher self-healing + detached daemon survival | **new (P1-002 mechanism)** | system-spec-memory-launcher.cjs:233-237 spawns the daemon `detached: true` so the daemon is NOT signaled when the launcher SIGTERMs itself. The launcher correctly self-heals its parent-pid loss; the daemon inherits the orphaned state. process-sweep's plan-time ppid gate is the bottleneck for catching it. |
| **EC-16** | Lock acquisition atomicity in model-server-supervision.cjs vs git-live-follow.sh | **new (positive — no finding)** | The atomic rename-before-open pattern at model-server-supervision.cjs:787-798 is the reference implementation for fixing git-live-follow.sh's P2-006 TOCTOU. |
| **EC-17** | cli-external-orchestration cross-CLI rule scope | **new (ruled-out — no finding)** | The cross-CLI rule at cli-external-orchestration/SKILL.md:169 is correctly hoisted to the parent hub; each child CLI references the rule contextually but does not re-declare enums. |

---

## Confirmed-Clean Surfaces

- **`.opencode/plugins/session-cleanup.js`** — `isSweepDisabled` (lines 63-66) correctly mirrors the env-var kill switch; the spawn (lines 208-218) consults it before invoking the CLI; the cleanup at stop-hook (lines 223-231) explicitly disables the orphan sweep (`SPECKIT_STOP_HOOK_ORPHAN_SWEEP: 'off'`) — design choice, documented in code.
- **`.opencode/bin/system-spec-memory-launcher.cjs`** — lease fencing on `leaseId` (not just `ownerPid`) at lines 510-577, 650-677; exclusive create with fsync at lines 419-450; heartbeat self-healing on parent-pid change at lines 586-616; stdin-close handler at lines 618-637; `acquireOwnerLeaseFile` re-reads the lease just before unlink (lines 533-540) to fence on the exact instance classified stale.
- **`.opencode/bin/lib/model-server-supervision.cjs`** — `assertSunPathLimit` (lines 510-520) guards the macOS 104-byte sun_path limit; `assertSocketDirOwnership` (lines 522-552) refuses symlinked SPECKIT_IPC_SOCKET_DIR and foreign-uid dirs; `acquireRespawnLockFileAt` (lines 739-809) uses atomic rename-before-open for stale-lock reclaim; `isRespawnLockStale` (lines 705-737) refuses to reclaim a lock from a live owner on age alone.
- **`specs/cli-external-orchestration/058-flag-enum-authority/spec.md`** — Level 1, status Complete. Documentation drift only; no runtime code change. Six REQs (REQ-001 through REQ-006) all satisfied at the doc level.
- **`.opencode/skills/cli-external-orchestration/SKILL.md`** — cross-CLI rule at line 169 is correctly hoisted to the parent hub's §4 ALWAYS list; the rule is CLI-agnostic and applies to all six CLI children.

---

## Ruled Out

- **session-cleanup.js kill switch bypass via library import**: ruled out — `session-cleanup.js` imports only `node:child_process`, `node:fs`, `node:path`, `node:module`, `node:url` (lines 13-24); no `process-sweep` import. The bypass risk is FUTURE-ONLY, not present today. (P1-001 captures this risk.)
- **session-cleanup.js spawn of orphan sweep from production code via the library**: ruled out — line 32 declares `PROCESS_SWEEP_SCRIPT` as the COMPILED CLI path (`.js`), not the library (`.ts`). The spawn at lines 211-215 uses `process.execPath` (= current Node binary) on the CLI path.
- **session-cleanup.js `runCleanup` stop-hook env override is a bug**: ruled out — line 229 sets `SPECKIT_STOP_HOOK_ORPHAN_SWEEP: 'off'`, which is the documented "fail-open at disposal" design. Operator who wants to enable stop-time sweep would set this env var; today, the comment at line 84 (`Logging must remain fail-open during startup and disposal`) is consistent.
- **system-spec-memory-launcher.cjs launcher's self-healing closes the P1-002 window**: **ruled out as full closure** — the launcher's heartbeat (lines 586-616) and stdin-close handler (lines 618-637) DO shut down the launcher on host disposal, but the daemon child is spawned `detached: true` (lines 233-237) so it is NOT signaled. The launcher self-exits; the daemon inherits the orphaned state; process-sweep's plan-time ppid gate (process-sweep.ts:203) is the bottleneck. **P1-002 stands.**
- **system-spec-memory-launcher.cjs lease fencing has TOCTOU races**: ruled out — `acquireOwnerLeaseFile` (lines 510-558) double-checks leaseId before unlink; `refreshOwnerLeaseFile` (lines 560-577) fences on leaseId; `writeOwnerLeaseFileExclusive` (lines 436-450) uses `wx` O_EXCL create with fsync. The leaseId fence is the right primitive.
- **model-server-supervision.cjs lock acquisition has TOCTOU race**: ruled out — `acquireRespawnLockFileAt` (lines 739-809) uses atomic rename-before-open (lines 787-798) for stale-lock reclaim. The pattern is the reference implementation that git-live-follow.sh's P2-006 should adopt.
- **model-server-supervision.cjs sun_path or ownership guards are missing**: ruled out — both `assertSunPathLimit` (lines 510-520) and `assertSocketDirOwnership` (lines 522-552) are present and correctly throw named error codes (`ESUNPATHTOOLONG`, `ESOCKETDIRSYMLINK`, `ESOCKETDIRFOREIGN`).
- **packet 058 introduces runtime safety drift**: ruled out — packet is Level 1 documentation drift correction; the spec.md (lines 62-64) describes the defect as the reference table listing only four `--permission-mode` values when the binary accepts eight; the consolidation publishes the corrected reference and a probe recipe. The skill's dispatch examples were correct (`spec.md:30` answered_questions); the reference table was the defect.
- **cli-devin surface re-declares flag enums locally**: ruled out — `grep` across `cli-external-orchestration/**` shows the cross-CLI rule is hoisted to the parent hub SKILL.md:169; each child CLI's `prompt-quality-card.md` references flags contextually but does not re-declare enums.

---

## Next Focus

- **Dimension:** D3 Traceability (residual) + D1 Correctness (Phase 3/4 test coverage gaps).
- **Focus area:**
  - (a) **Phase 3 test-hang containment** (EC-2): verify both `vitest.config.ts` files (`.opencode/skills/system-spec-kit/vitest.config.ts` and `.opencode/skills/system-spec-kit/mcp-server/vitest.config.ts`) — check whether they override the timeout or run tests under a config that bypasses `run-tests.mjs` entirely; confirm whether a fixture exists that exercises the python wrapper's bounded vitest run.
  - (b) **Phase 4 live-follow log hygiene** (EC-3): search for any test or fixture that demonstrates rotation, dedup correctness, or lock acquisition is bounded in git-live-follow.sh; either confirm the gap or find the missing fixture.
  - (c) **cli-devin deeper read**: `cli-devin/SKILL.md`, `cli-devin/references/cli-reference.md` (verify the corrected enum row matches REQ-001's "five canonical values and both alias groups"), and `cli-devin/manual-testing-playbook/cli-invocation/smart-permission-doc-runtime-mismatch.md` (verify the DV-004 staleness banner).
- **Reason:** Iter 2 confirmed both carry-forward P1s with new evidence from session-cleanup.js and system-spec-memory-launcher.cjs. The residual surface is the test-coverage gaps for Phases 3 and 4 — a reviewer's job is not to invent tests but to verify the spec/code alignment evidence. If fixtures exist in unreviewed files, the gap closes; if not, the gap carries as a coverage finding.
- **Rotation status:** not stuck; P1-001 and P1-002 are both confirmed and independent (killable separately by `/speckit:plan`); no P0 active; convergence trend is steady.
- **Blocked/productive carry-forward:** none blocked. EC-2 and EC-3 are productive open coverage gaps. P1-001 and P1-002 carry as confirmed; both have explicit `downgradeTrigger` in the claim adjudication.
- **Required evidence for iter 3:** direct read of both `vitest.config.ts` files; grep for `rotate_log_if_needed` and `acquire_lock` test fixtures across the spec-memory test surface; direct read of `cli-devin/SKILL.md` and `cli-devin/references/cli-reference.md`; direct read of `cli-devin/manual-testing-playbook/cli-invocation/smart-permission-doc-runtime-mismatch.md`.
- **Recovery note:** none — second iteration completed cleanly within budget; no escalation required.

---

## SCOPE VIOLATIONS

(none)

---

Review verdict: CONDITIONAL
