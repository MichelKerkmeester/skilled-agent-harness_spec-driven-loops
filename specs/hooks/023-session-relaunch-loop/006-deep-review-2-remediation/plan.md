---
title: "Implementation Plan: Phase 6: deep-review-2-remediation"
description: "Fix the twelve confirmed round-2 review findings in five workstreams, one change per builder dispatch, tests first, then a fresh review, the full gate and the four live playbooks."
trigger_phrases:
  - "deep review 2 remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: deep-review-2-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (built-ins only), Pi TypeScript, bash |
| **Framework** | None; hook adapters for Claude, Codex, Hermes, OpenCode and Pi |
| **Storage** | Per-user relaunch state dir (`skilled-relaunch-<uid>` fallback) and `.skilled/skills/.state/session-relaunch/` |
| **Testing** | `node --test`, Pi vitest, pytest, shellcheck, tsc, live playbooks for four runtimes |

### Overview
Five workstreams fix the twelve confirmed findings. WS-A (core) and WS-B (killer) carry the behavior changes. WS-C (CLI) and WS-D (repo root) follow because both touch the core. WS-E updates the docs once the behavior is settled. WS-F verifies everything. Every code change is a dispatch of one change, and each starts with a named test that fails on the code before the fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria Met (or Waived or Superseded with an ADR)
- [x] Tests passing (node, pytest, Pi vitest, tsc, shellcheck)
- [x] Docs updated (spec, plan, tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Runtime-neutral core with thin per-runtime adapters. Behavior fixes land in the core, and each adapter consumes them.

### Key Components
- **`lib/relaunch-core.cjs`**: state dir, log append, lock liveness, the bounded process-table read and the single `findLoopChildPid` walk. It does not own a repo-root resolver.
- **`lib/killer.cjs`**: idle wait, lock takeover, record read and signalling of descendants only.
- **`bin/session-relaunch.cjs`**: the CLI that prepares notes, delegates the live-shell walk to `core.findLoopChildPid` and calls `nudge.resolveRepoRoot`.
- **`lib/nudge.cjs`**: owns the shared repo-root resolver `resolveRepoRoot` (`nudge.cjs:203`), which the CLI and the Pi adapter both call, plus the nudge text, the open-note reuse and `handoffPending`.
- **`pi/session-relaunch.ts`**: the Pi adapter, which calls `nudge.resolveRepoRoot` and decides at `message_end` before it delivers at `agent_end`.

### Data Flow
An adapter reads usage, nudges, and on stop arms the relaunch record and spawns the killer. The killer waits for idle, takes the lock, re-reads the record and signals the runtime child. The wrapper reads the record and relaunches with the seed. The repo root is resolved once by the shared helper for every reader.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `appendLog` in `relaunch-core.cjs` (line 573) | Only writer of `relaunch.log`; ignores the `fs.writeSync` return | Update: throw when the return is short | Short-write test with a stubbed write |
| State dir fallback in `relaunch-core.cjs` (`stateDir`, line 157; `ensureStateDir`, line 43) | Falls back to the shared `os.tmpdir()/skilled-relaunch` | Update: `skilled-relaunch-<uid>`; lstat, real dir, owned by the user, then chmod 0700 | Foreign-owned dir test; mode test |
| `targetIsRunning` in `killer.cjs` (line 114) | Rethrows EPERM | Update: EPERM returns false | EPERM probe test with a pid owned by another user |
| `recordTimeout` in `killer.cjs` (line 480) | Acts on the snapshot taken at spawn | Update: re-read the record; skip unarm and notify when the handoff changed | Handoff-changed test (K1 waits on A, B armed) |
| Ancestry check and record read in `killer.cjs` (lines 449 and 456) | Ancestry first, record read second | Update: record read first; document the residual pid-reuse window | Test that a mismatched record is not signalled |
| `acquireLock` in `killer.cjs` (line 347) and `liveKillerPid` in `relaunch-core.cjs` (line 710) | Treat pid existence as killer liveness | Update: the lock carries an expiry; stale after it | Lock pinned by a reused pid is taken over; two takeovers yield one winner |
| `session-relaunch.cjs` live-shell list (`LIVE_SHELL_NAMES`, line 19) | Knows zsh, bash and sh only | Update: add fish, dash, ksh, tcsh and nu; strip a leading `-` from `comm` | Per-shell detection test |
| `runtimePidFromLoop` in `session-relaunch.cjs` (line 238) and `readProcessTableWithCommands` (line 208) | Second process-tree walk duplicating `findLoopChildPid` (`relaunch-core.cjs` line 750) | Update: delegate to `core.findLoopChildPid`; keep the killer's fail-closed walk | Single-definition `rg`; CLI test |
| Repo root resolver: `resolveRepoRoot` in `nudge.cjs` (line 203), called by `session-relaunch.cjs` (line 129) and `pi/session-relaunch.ts` (line 188) | One shared resolver owns the rule; every reader calls it | Update: honors `SESSION_RELAUNCH_REPO_ROOT`, ignores `REPO_ROOT`, falls back to the install root | `resolveRepoRoot` tests in `nudge.test.cjs`; relative-root test per reader |
| Playbook and READMEs that quote `REPO_ROOT` | Document the old variable | Update to the new name and the new fallback | `rg -n "REPO_ROOT"` shows only the resolver and unrelated repo scripts |
| Parent `spec.md` and 005 `spec.md`, 005 `acceptance-criteria.md` | Cite the stale review path; state four children | Update in the owning folder (see Scope) | `rg` for `../review/review-report.md` finds no stale citation |

Required inventories:
- Same-class producers: `rg -n "REPO_ROOT|SESSION_RELAUNCH_REPO_ROOT" .skilled/hooks/session-relaunch .skilled/bin` and `rg -n "plannedNotePath|relaunchThreshold|notePathFromSeed|findLoopChildPid|readProcessTable" .skilled/hooks/session-relaunch`.
- Consumers of changed symbols: `rg -n "appendLog|ensureStateDir|targetIsRunning|liveKillerPid|acquireLock|runtimePidFromLoop" .skilled`.
- Matrix axes: runtime (Claude, Codex, Hermes, OpenCode, Pi) by repo-root reader (CLI, nudge, Pi); shell (zsh, bash, sh, fish, dash, ksh, tcsh, nu) by live-shell detection; killer state (free lock, stale lock, live lock, reused-pid lock) by takeover.
- Algorithm invariant: at most one killer holds the lock for a loop id, and it signals only descendants of the wrapper, with the record re-read before any signal.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:live-gap-surfaces -->
## FIX ADDENDUM 2: LIVE-GAP SURFACES

The live playbook runs found defects the static review could not: a host that drops a seed, an operator turn a nudge forced, a CLI whose silence read as failure. Each gap is a surface with its own owner and its own test, registered as G1 to G25 in `spec.md` section 4.1.

| Surface | Gap | Change | Verification |
|---------|-----|--------|--------------|
| `bin/session-relaunch.cjs` help and usage | G1, G25 | A `--help` listing, a per-command usage line on error, one prepared success line, and a usage line that names both exit-3 declines | Usage tests in `session-relaunch-cli.test.cjs` (line 1089 onwards) |
| `bin/session-relaunch.cjs` hop limit | G18 | `prepare` exits 3 and writes no record at the cap | `prepare declines at the hop limit without writing a relaunch record` |
| `lib/nudge.cjs` nudge and seed text | G2, G8, G11, G15, G22, G28 | Ratio wording past the window, an imperative opening, a finish-instead sentence, the real note path in the seed, no placeholder step, and no complete clause in the handoff text | `handoff text` and `seed text` tests in `nudge.test.cjs` |
| `lib/nudge.cjs` handoff state | G7, G14, G14b, G14c | Reuse the open note; no nudge while this session's record is pending or armed, with one max-age source and a staleness window | `plannedNotePath reuses the open note...`, `handoffPending ...` |
| `lib/nudge.cjs` resolver | G23 | Adversarial env tests: `REPO_ROOT` alone, an empty override, a relative root | `resolveRepoRoot ignores the generic REPO_ROOT and an empty override` |
| `opencode/session-relaunch.js` | G4, G24 | The seed persists until the note is claimed, then one completion reminder replaces it | `seed stays pending across later text parts`, `a claimed note pushes one completion reminder...` |
| `pi/session-relaunch.ts` | G5, G17 | Deliver as a follow-up that starts a turn; decide at `message_end`, deliver at `agent_end` after a re-check | `delivers the nudge without waiting for an operator turn`, `agent_end delivers the nudge held from message_end exactly once` |
| Codex registry rows and generated fallbacks | G9, G12, G13 | Drop `mkHookDrift` from the Codex envelopes, answer Stop and PreCompact with `systemMessage`, give the six `none` rows the neighbours' envelope fallback | `hook-adapter-path-parity.vitest.ts` (128 cases) |
| `frontmatter-version.mjs`, `post-edit-router.cjs` | G6, G6b | Version checks scope to tracked docs and keep `.state/<concern>/README.md` | `test-frontmatter-version.mjs` `.state` cases |
| `lib/killer.cjs`, `tests/killer.test.cjs` | G16, G19 | Check the hop limit before a signal; remove the test race between the pid write and the record publish | `killer unarms an armed record at the hop limit without signalling`, `stop-arm spawns exactly one killer...` |

Required inventories for this addendum:
- Same-class producers: `rg -n "handoffPending|hopLimitReached|completeCommandFor|resolveRepoRoot" .skilled/hooks/session-relaunch`.
- Consumers of changed text: `rg -n "handoff prepared|no output|claim --help" .skilled .opencode`.
- Matrix axes: runtime (Claude, Codex, Hermes, OpenCode, Pi) by gap surface (CLI, nudge text, seed, plugin, adapter fallback); run number by verdict in the benchmark run folders.
<!-- /ANCHOR:live-gap-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Core log and state dir, killer takeover, EPERM, record re-read, shell list, repo-root resolver | `node --test` on explicit files |
| Integration | Wrapper with a stub runtime; Pi adapter; CLI prepare with a relative root | `node --test`, Pi vitest, shellcheck |
| Type and lint | Pi TypeScript | `tsc --noEmit`, shellcheck |
| Live | One playbook run each for Pi, OpenCode, Claude and Codex from the final state; the phase closes only on a frozen-code round where all four finish with zero operator input | `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md` |
| Review | Fresh review of the changed code against sk-code-opencode | A fresh session, run by the orchestrator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-pi with DeepSeek V4.1 Flash max | External builder | Unverified at authoring time | Builds wait; the orchestrator re-dispatches one change |
| Parent `../spec.md` edit by another worker | Internal | In progress elsewhere | R3-P2-001 and the line-114 citation stay open until it lands |
| Live runtimes (Pi, OpenCode, Claude, Codex) | External | Unverified at authoring time | WS-F live runs wait; no run is claimed without its output |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix breaks the gate and three repair attempts fail on the same symptom.
- **Procedure**: the phase 005 closure is the baseline. Compare the changed file with its pre-phase state and re-dispatch one narrower change. Never use checkout, restore, reset or stash.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
WS-A core log and state dir ──► WS-B killer ──┐
                                              ├──► WS-C CLI ──► WS-D repo root ──► WS-E docs ──► WS-F verification
                                              │
                                  (WS-A and WS-D both touch the core, so they run in sequence)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| WS-A core | Setup | WS-B, WS-C, WS-D |
| WS-B killer | WS-A (core helpers) | WS-C |
| WS-C CLI | WS-B | WS-D |
| WS-D repo root | WS-C | WS-E |
| WS-E docs | WS-D | WS-F |
| WS-F verification | WS-E | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and baseline | Low | One session |
| WS-A to WS-D code | Med | Four builder dispatches plus one fresh review each |
| WS-E docs | Low | One sk-doc pass plus validators |
| WS-F verification | Med | Fresh review, full gate, four live runs |
| **Total** | | **Two to three working sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline counts captured before the first edit and compared at the end
- [x] Feature flag: `SYSTEM_SESSION_RELAUNCH_DISABLED` already disables the concern
- [x] Monitoring alerts: not applicable to a local hook

### Rollback Procedure
1. Set `SYSTEM_SESSION_RELAUNCH_DISABLED=1` to stop the loop.
2. Re-dispatch one narrower fix against the failing file.
3. Rerun the gate.
4. Report to the operator.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The state dir fallback changes where new state is written, not existing state.
<!-- /ANCHOR:enhanced-rollback -->
