---
title: "Feature Specification: Phase 6: deep-review-2-remediation"
description: "Fix the twelve confirmed P2 findings of the round-2 fan-out deep review of the session relaunch loop, then rerun a fresh review, the full gate and the four live runtime playbooks."
trigger_phrases:
  - "deep review 2 remediation"
  - "phase 6 deep review 2 remediation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: deep-review-2-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-18 |
| **Branch** | `worktrees/142-session-relaunch-loop` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 6 |
| **Predecessor** | 005-deep-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met (or Waived or Superseded with an ADR), and recursive strict validation of the parent passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Session relaunch loop specification.

**Scope Boundary**: The twelve confirmed P2 findings in `../review/review-report.md` and its verification table (`/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/5820adf5-6b90-452d-9421-385ec95d7f40/scratchpad/rv2/verification.md`). R1-P2-003 is disproved and out of scope. Three findings are duplicates and fold into their primaries: LUNA-005 into R3-P2-001, R2-P2-001 into LUNA-003, and R3-P2-002 into LUNA-004. No new runtime, trigger or live feature.

**Dependencies**:
- `../review/review-report.md`, the round-2 fan-out deep review of phases 001 to 005.
- `../005-deep-review-remediation/`, the round-1 remediation, whose closed code is the baseline this phase changes.
- The parent `../spec.md`. A parallel worker landed the six-children count, the phase 005 and 006 scope bullets and the files rows; this phase closed the phase-map row and replaced the 006 files row with the real paths.

**Deliverables**:
- A named test and a fix for every confirmed code finding, with the test failing before the fix.
- A corrected line for every confirmed doc finding.
- A fresh review of the changed code that confirms none of the twelve findings remains open.
- A full gate rerun at or above the phase 005 closure counts, and a live playbook run for each of Pi, OpenCode, Claude and Codex.

**Scope amendment (2026-10-19)**: after the first four live playbook runs the operator directed "We fix all gaps". The gaps those runs found are hook defects this phase now fixes, so they join the scope as WS-G and REQ-007 with their own acceptance criterion. The two findings that belong to the framework gates rather than the hook, and the OpenCode default-model failure, stay outside the scope and are recorded as known limitations.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The round-2 deep review passed the session relaunch loop with twelve confirmed P2 advisories and no P0 or P1. They fall into five groups. The core log and state path can truncate a line silently on a short write, and it falls back to a shared temp directory that another user can own. The killer has four gaps: EPERM is read as "our target is alive", a timeout acts on a stale record, the ancestry check runs before the record read, and a lock with a reused pid pins the loop forever. The CLI's shell list misses fish, dash, ksh, tcsh and nu, and it duplicates a process-tree walk that the core already owns. Repo-root resolution uses a generic `REPO_ROOT` variable that other repository scripts also set, and the CLI and nudge resolve it differently. The parent spec and two phase references cite a stale review path, and the parent spec still says four children where there are five.

### Purpose
Every confirmed finding is fixed with a test that fails before the fix, one shared repo-root resolver serves every reader, the docs match the code, and a fresh review plus the four live runtime playbooks confirm the loop still works end to end.

The live playbooks then found gaps no static review could see: a receiver that guessed the CLI syntax, a nudge the operator had to answer by hand, a seed the host dropped once the note was claimed. Each gap was reproduced in a live session, fixed with its own test, and re-run. The final-code round has all four runtimes finishing hands-free, which is the bar this phase closes on.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- WS-A core library: LUNA-001 (short write must throw), LUNA-002 (per-user fallback state dir with an ownership check), and the lock expiry read in `liveKillerPid` (part of R1-P2-004).
- WS-B killer: R1-P2-001 (EPERM is not our target), R1-P2-002 (re-read the record at timeout), LUNA-003 (record read above the ancestry check, residual pid-reuse window documented), and R1-P2-004 (the lock carries an expiry and is stale after it).
- WS-C CLI: R2-P2-003 (wider live-shell list) and R3-P2-003 (use `core.findLoopChildPid`, reword 005 AC-002).
- WS-D repo root: NEW-001 and R2-P2-002, one shared resolver, the override renamed `SESSION_RELAUNCH_REPO_ROOT`, the fallback is the install root, and every reader and test updated.
- WS-E docs: the parent spec drift (R3-P2-001), the archived-report links (LUNA-004), the 005 AC-002 wording, and the docs for the env rename.
- WS-F verification: a fresh review, the full gate, and the live playbooks for Pi, OpenCode, Claude and Codex.
- WS-G live gaps (registered as REQ-007 in section 4.1): every gap the live playbook runs found in the hook, its CLI, its adapters and its plugins, each fixed with a test, plus a final-code live round on all four runtimes with zero operator input.

### Out of Scope
- R1-P2-003 (session id path traversal): disproved. Every caller runs `validSessionId` first, so no input reaches the path.
- Duplicates LUNA-005, R2-P2-001 and R3-P2-002: they fold into R3-P2-001, LUNA-003 and LUNA-004 and get no separate work.
- The frozen parent decisions D2 (80% trigger), D3 (seed carry) and D4 (command-only runtimes). They are decisions, not findings.
- New runtimes, triggers or features. No finding needs one.
- Code outside the session relaunch paths and the docs this list names. Scope lock applies.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Throw on a short `fs.writeSync`; per-user fallback state dir with an ownership check; lock expiry read in `liveKillerPid`; a `ps` read bounded by a timeout; the single process-tree walk (`findLoopChildPid`) the CLI delegates to |
| `.skilled/hooks/session-relaunch/lib/killer.cjs` | Modify | EPERM means not our target; re-read the record at timeout; record read above the ancestry check; lock expiry and atomic takeover in `acquireLock`; hop-limit check before a signal |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | Wider live-shell list; `runtimePidFromLoop` delegates to `core.findLoopChildPid`; calls `nudge.resolveRepoRoot` (`session-relaunch.cjs:129`); a `--help` listing and a usage line for every subcommand; the prepared-handoff success line; the hop-limit decline |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | Owns the shared repo-root resolver `resolveRepoRoot` (`nudge.cjs:203`), which the CLI and the Pi adapter both call; also the open-note reuse, the ratio wording, the seed text, the completion reminder and `handoffPending` |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modify | Calls `nudge.resolveRepoRoot` and honors `SESSION_RELAUNCH_REPO_ROOT`; decides at `message_end` and delivers at `agent_end`; delivers its nudge as a follow-up so no operator turn is needed |
| `.skilled/hooks/session-relaunch/claude|codex|hermes/*.mjs` | Modify | Claude, Codex and Hermes adapters follow the nudge state, the Codex fallback envelopes and the hop-limit silence |
| `.opencode/plugins/session-relaunch.js` | Modify | Keeps the seed text active until the note is claimed, then swaps it for a completion reminder |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, `.claude/settings.json`, `.codex/hooks.json` | Modify | Registry rows carry the neighbours' envelope fallback; the generated registrations follow |
| `.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs`, `.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` | Modify | Version checks skip the gitignored `.state` runtime files and keep the tracked `.state/<concern>/README.md` |
| `.skilled/hooks/session-relaunch/tests/*.test.cjs`, `pi/session-relaunch.test.ts` | Modify | One named test per finding; env rename in fixtures |
| `.skilled/hooks/session-relaunch/README.md`, `.skilled/bin/README.md` | Modify | Document `SESSION_RELAUNCH_REPO_ROOT`, the fallback to the install root, and that non-shell runtime children are not detected |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md` | Modify | Env rename and repo-root resolution, only where a changed behavior is described; the live results move to a benchmark run folder |
| `.skilled/skills/system-spec-kit/benchmark/reports/2026-10-19--manual-testing-playbook--session-relaunch-live-four-cli/`, `...--session-relaunch-final-code/` | Create | Dated live-run results, evidence class and verdict per run |
| `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/evidence/live-runs-2026-10-19/` | Create | Pane captures, relaunch logs and the launch commands for the live runs |
| `specs/hooks/023-session-relaunch-loop/006-deep-review-2-remediation/` | Modify | This folder only: five authored docs and the derived files |
| `specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/acceptance-criteria.md` | Modify (builder, explicit scope needed) | AC-002 wording: the Skip and walk helpers are defined once in the core |
| `specs/hooks/023-session-relaunch-loop/spec.md` | Modify (owned by the parallel worker) | R3-P2-001 five-children drift and the review-report path at line 114 |
| `specs/hooks/023-session-relaunch-loop/005-deep-review-remediation/spec.md` | Modify (builder, explicit scope needed) | Review-report path at lines 40 and 43 (LUNA-004) |

Parent-spec and sibling-phase rows are outside this folder. The orchestrator must name them in scope before a builder writes to them.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | WS-A: a short write to `relaunch.log` throws instead of reporting success, and the fallback state directory is per-user (`skilled-relaunch-<uid>`), created 0700, and refused unless it is a real directory owned by the current user. Each has a test that fails before the fix. |
| REQ-002 | WS-B: EPERM from a signal probe means the pid is not our target; the killer re-reads the record before it acts on a timeout; the record read runs above the ancestry check; the lock carries an expiry and is stale after it, in both `acquireLock` and `liveKillerPid`. The residual pid-reuse window is written down in the killer. |
| REQ-003 | WS-C: the live-shell list covers fish, dash, ksh, tcsh and nu with a leading `-` stripped from `comm`; `runtimePidFromLoop` delegates to `core.findLoopChildPid`, and 005 AC-002 names the single definition. |
| REQ-004 | WS-D: one repo-root resolver, `resolveRepoRoot` in `lib/nudge.cjs`, serves the CLI (`session-relaunch.cjs:129`), itself and the Pi adapter (`pi/session-relaunch.ts:188`). It honors `SESSION_RELAUNCH_REPO_ROOT`, not `REPO_ROOT`, and falls back to the install root, not the session cwd. `relaunch-core.cjs` does not own a resolver. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | WS-E: the parent spec says five children and carries the 005 scope bullet and files row; the three review-report citations point at `review-archive/20261018T184826Z/review-report.md`; the env rename is documented wherever the old name was. |
| REQ-006 | WS-F: a fresh review of the changed code confirms no open finding among the twelve; the full gate reruns at or above the phase 005 closure counts; live playbook runs pass for Pi, OpenCode, Claude and Codex; `repair-derived.cjs` and `validate.sh --strict` pass on this folder. |
| REQ-007 | WS-G: every gap the live playbook runs found in the hook is fixed with a test (G1 to G25, registered in section 4.1), and the four runtimes pass a final-code live round with zero operator input. The framework-gate findings G20 and G21 and the OpenCode default-model failure are out of scope and recorded as known limitations. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.

### 4.1 Live-gap register (REQ-007)

Each row is one gap a live playbook run found, the behavior that closes it and the test that holds it. A gap number is a dispatch label, not a finding id; gaps ran as lanes `g<N>` on disjoint files.

| Gap | Gap observed in a live session | Fix | Test |
|-----|-------------------------------|-----|------|
| G1 | A receiver guessed the CLI syntax (`claim --help`, `complete --handoff`) | `--help`, a per-subcommand usage line on error, and a usage line naming every error exit | `claim --help prints the claim usage on stdout and exits zero`, `-h after a subcommand prints the full usage listing`, `an unknown subcommand exits two and lists the commands on stderr` |
| G2, G8, G28 | The nudge printed a raw percentage above 100 and asked for a handoff where finishing was cheaper | Ratio wording past the configured window, an imperative opening, a finish-instead sentence, and the exception last | `handoff text names a ratio past the configured window instead of the raw percentage`, `handoff text opens the ratio nudge imperatively and keeps the exception last` |
| G4 | OpenCode dropped the seed text after the first turn and the receiver never claimed | The seed stays active until the note is claimed, then yields to the completion reminder | `seed stays pending across later text parts`, `the seed repeats on every transform until the note is closed` |
| G5 | Pi needed an operator "Continue" before it acted on the nudge | The nudge is delivered as a follow-up that starts a turn | `delivers the nudge without waiting for an operator turn` |
| G6, G6b | The version checker demanded frontmatter from gitignored `.state` runtime files | The check scopes to tracked docs and keeps the `.state/<concern>/README.md` files | `test-frontmatter-version.mjs` `.state` scope cases (`.state/fixt-concern/README.md`, `gate --skill .state`) |
| G7 | A re-nudge planned a second timestamped note and orphaned the open one | `plannedNotePath` reuses the session's open note | `plannedNotePath reuses the open note of the session for every later nudge`, `a restarted nudge reuses a matching handoff note` |
| G9 | Codex rejected the SessionStart fallback JSON (`invalid session start JSON output`) | The Codex fallback omits `mkHookDrift` and keeps the stderr drift line | `keeps every codex fallback off the rejected drift marker` |
| G11 | The seed instructions named a placeholder, not the note path the sender had just written | The seed carries the real absolute note path | `UserPromptSubmit seed claims the absolute note path it carries` |
| G12 | Six registry rows carried fallback `none`, so a failed adapter went silent | The rows carry the neighbours' envelope fallback | `hook-adapter-path-parity.vitest.ts` parity run (128 cases), registry rows read `"fallback": "envelope"` |
| G13 | Codex rejected the Stop and PreCompact `hookSpecificOutput` fallbacks | Those two events answer with a plain `systemMessage` | `answers codex Stop and PreCompact fallbacks with a systemMessage envelope` |
| G14, G14b, G14c | A re-nudge started an extra turn while the record was pending or armed | No nudge while this session's record is pending or armed, with a staleness window and one max-age source | `handoffPending is false for an armed record past the max age`, `handoffPending honors a max age saved in the hook config file, with the environment winning` |
| G15 | The handoff text told the receiver to complete a note it had not claimed | The complete clause leaves the handoff text and the seed keeps it | `handoff text leaves the complete instruction to the seed text` |
| G16 | A killer test raced its own pid write (1 failure in 9) | The test writes the pid before it publishes the record | `stop-arm spawns exactly one killer across repeated Stop payloads on a pending record` |
| G17 | Pi decided the nudge at `message_end` and delivered it after the session had already prepared | Decide at `message_end`, re-check and deliver at `agent_end` | `agent_end delivers the nudge held from message_end exactly once`, `retires a held nudge once the hop count reaches the cap before delivery` |
| G18 | A receiver at the hop cap still prepared, armed and was ended with no relaunch | `prepare` declines at the cap with exit 3 and no record; the adapters stop nudging there | `prepare declines at the hop limit without writing a relaunch record`, `context nudge stays quiet at the hop limit` |
| G19 | The killer signalled a session at the hop cap, which the wrapper then declined | The killer checks the hop limit before it signals | `killer unarms an armed record at the hop limit without signalling` |
| G22 | Seed step 1 still explained a `<handoff-path>` placeholder | Step 1 runs the claim command and says what it prints | `seed text runs the real claim command with no placeholder explanation` |
| G23 | No test set `REPO_ROOT` alone or an empty override, so the hostile env was unproven | Adversarial resolver tests over the process-wide env | `resolveRepoRoot ignores the generic REPO_ROOT and an empty override` |
| G24 | OpenCode dropped the complete step once the note left `open`, so the receiver never closed it | The claimed note keeps one reminder line with the complete command | `a claimed note pushes one completion reminder instead of the claim text` |
| G25 | A successful `prepare` printed nothing, so the receiver read the CLI source to confirm it worked | One line says the handoff is prepared and the session should stop | `prepare under the loop prints the prepared handoff and the stop instruction` |

Not hook defects, recorded for the operator: **G20** the framework Gate 3 question reached a read-only live session that had never answered it, and **G21** the Gate 2 artifact trigger routed the handoff note through sk-doc, which answered with a clarify. Both live in the framework's gate rules and the sk-doc router, not in this phase's code. The OpenCode default model (MiMo through the LLM Gateway) fails with "Direct provider routing is not available", so the live runs select `openai/gpt-6-luna` explicitly.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All twelve confirmed finding ids are fixed, each code fix with a named test that failed before the fix.
- **SC-002**: The full gate is at or above the phase 005 closure counts (node 375, pytest 62, Pi relaunch vitest 21, registration vitest 7, tsc 0, shellcheck 0, drift guards 4/4).
- **SC-003**: Each of the four runtimes passes its live playbook from the final state.
- **SC-004**: Every live-playbook gap in section 4.1 is closed with a test, and the final-code live round has all four runtimes finish with zero operator input.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Parent `../spec.md` is being edited by another worker | Med: R3-P2-001 and the line-114 citation cannot land from this folder | Record them as open in `tasks.md` and in AC-010; the orchestrator closes them after the other worker finishes |
| Dependency | Builder is cli-pi with DeepSeek V4.1 Flash max | Builds stop if the lane is down | One change per dispatch, so a stopped lane loses one change, not the phase |
| Risk | Lock expiry lets a second killer signal while the first still runs | High | Test two takeovers at once and assert one winner; expiry is longer than the killer's maximum lifetime |
| Risk | Repo-root rename breaks a shell that exports only `REPO_ROOT` | Med | Document the rename in both READMEs and cover the fallback path with a test |
| Risk | Narrowing the core's fallback state dir changes where existing state is read | Med | Keep the old path readable only when it is owned by the user; test both |
| Risk | Pid-reuse window in LUNA-003 cannot be closed in Node without pidfd | Low | Document the window in the killer; it is not a closable finding |
| Risk | The live gaps are open-ended: each run can reveal a new one | Med | Register every gap as it is found, fix it with a test, and close on a frozen-code round where all four runtimes pass with zero operator input |
| Risk | A live run needs the operator only because a framework gate fires (G20, G21) | Low | Record those as framework limitations, not hook defects, so a repeat run's prompts are not read as a regression |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: The killer signals only descendants of the wrapper, and only one killer holds the lock for a loop id. A lock older than the killer's maximum lifetime is stale.
- **NFR-S02**: The state directory is mode 0700 and owned by the current user. A directory owned by another user is refused, never chmod-ed.

### Reliability
- **NFR-R01**: No `relaunch.log` line is reported written when a short write truncated it.
- **NFR-R02**: The repo-root resolver gives the same answer for the CLI, `nudge.cjs` and the Pi adapter in every shell the live-shell list covers.
- **NFR-R03**: A live session reached through the hook completes the hop, the claim, the answer and the completion without an operator prompt.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A `fs.writeSync` that writes fewer bytes than the line: throw, do not report success.
- `SESSION_RELAUNCH_REPO_ROOT` set to a relative path, or to an empty value: resolve or fall back, never read `REPO_ROOT`.

### Error Scenarios
- The fallback state dir exists and is owned by another user: refuse it and use `skilled-relaunch-<uid>`.
- The signal probe returns EPERM: the pid is not our target.
- The killer's transcript vanishes while it waits: give up, un-arm, notify.

### State Transitions
- The record changes from A to B between the killer's spawn and its timeout: skip unarm and notify for A, leave B armed.
- A lock's pid is reused by a live process after the killer dies: the lock is stale after expiry, and one takeover wins when two race.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 12 code and test files, three READMEs and the playbook, plus two out-of-folder docs that need explicit scope |
| Risk | 16/25 | Process signalling, lock takeover and the state dir mode |
| Research | 6/20 | Every finding is located and verified in the review verification table; the lock expiry value still needs a read of `killer.cjs` |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Closed**: the parent `spec.md` drift. A parallel worker landed the six-children handoff criteria, the phase 005 and 006 scope bullets and the files rows; this phase closed the phase-map row and replaced the 006 files row with the real paths.
- **Closed**: the lock's maximum lifetime. `relaunch-core.cjs` keeps a legacy lock without an expiry field alive for `LEGACY_LOCK_MAX_AGE_MS` (ten minutes), which is longer than a killer's own lock hold, and a lock that carries an expiry is stale once it passes.
- **Open for the operator**: G20 and G21 are framework-gate findings and the OpenCode default model fails provider routing. All three sit outside this phase's code and are recorded as known limitations in `implementation-summary.md`.
<!-- /ANCHOR:questions -->
