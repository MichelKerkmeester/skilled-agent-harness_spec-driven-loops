---
title: "Feature Specification: Session relaunch hooks off by default, opt in with SYSTEM_SESSION_RELAUNCH_ENABLED"
description: "Every clone of the repo runs the session-relaunch hooks today, because the shared hook resolver treats every concern as on unless a kill switch is set. This phase makes session-relaunch the one default-off concern: it runs only when SYSTEM_SESSION_RELAUNCH_ENABLED is truthy and no kill switch is set."
trigger_phrases:
  - "session relaunch default off"
  - "SYSTEM_SESSION_RELAUNCH_ENABLED"
  - "session relaunch opt in"
  - "default-off hook concern"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Session relaunch hooks off by default, opt in with SYSTEM_SESSION_RELAUNCH_ENABLED

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/225-session-relaunch-default-off` |
| **Parent Spec** | ../spec.md |
| **Phase** | 34 |
| **Predecessor** | 033-research-remediation |
| **Successor** | None |
| **Handoff Criteria** | The failing-first resolver tests pass on all four readers, the relaunch suites are green with their tests opted in, the docs name the opt-in switch and `validate.sh --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`isHookEnabled` in `.skilled/hooks/shared/hook-flags.cjs` returns true unless the master switch or one of the concern's kill switches resolves truthy. Every hook concern is therefore on for anyone who clones the repo, session-relaunch included. A fresh clone gets context nudges, Stop arming and the Claude compact pointer before its owner has chosen the in-session handover. The `.mjs`, `.ts` and `.sh` readers copy the same rule, so the default lives in four places.

About ten session-relaunch adapters ask `isHookEnabled('session-relaunch')`, so a change in the resolver reaches them all. One caller bypasses the config file: `hermes/session-end-arm.mjs:80` passes `dependencies.env` with no config, and an explicit `env` makes the resolver skip `hook-flags.env`. An operator who opts in through the file would see that path stay off when an env object is injected.

### Purpose
The session-relaunch hooks run only for an operator who sets `SYSTEM_SESSION_RELAUNCH_ENABLED`, and every other hook concern keeps running by default.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A default-off concern map in the shared resolver with one entry, `session-relaunch` to `SYSTEM_SESSION_RELAUNCH_ENABLED`, in all four readers
- The Hermes `session-end-arm.mjs` caller that passes an env with no config
- Failing-first resolver tests and the opt-in for the existing relaunch tests
- Silent-when-not-enabled tests for the Claude context nudge and the CLI prepare path
- The operator docs and templates that name the switch

### Out of Scope
- Any other concern's default - each stays on unless its kill switch is set
- The kill switch names and aliases - `SYSTEM_SESSION_RELAUNCH_DISABLED` and the master switch keep their meaning and still win
- The relaunch protocol, thresholds and wrapper behavior - nothing changes once the concern is enabled
- The operator's own gitignored `.skilled/hooks/hook-flags.env` - the operator adds the line by hand

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/shared/hook-flags.cjs` | Modify | Default-off concern map; the concern is enabled only when its enable flag resolves truthy and no kill switch is set |
| `.skilled/hooks/shared/hook-flags.mjs` | Modify | Same rule as the `.cjs` reader |
| `.skilled/hooks/shared/hook-flags.ts` | Modify | Same rule as the `.cjs` reader |
| `.skilled/hooks/shared/hook-flags.sh` | Modify | Same rule as the `.cjs` reader |
| `.skilled/hooks/shared/hook-flags.test.cjs` | Modify | Resolver tests: default off, on from env, on from file, kill switch beats enable, other concerns unchanged, cross-reader parity |
| `.skilled/hooks/session-relaunch/hermes/session-end-arm.mjs` | Verify (unchanged) | Planned as a change; the entrypoint calls `armPendingRecord(payload)` with no env seam, so the resolver already reads the config file there. Only an injected `env` skips the file |
| `.skilled/hooks/session-relaunch/tests/*.test.cjs` | Modify | Opt in once per file or through a shared helper; add the context-nudge and prepare silent tests |
| `.opencode/plugins/tests/session-relaunch.test.cjs` | Modify | Opt in |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Modify | Opt in |
| `README.md` | Modify | Switch-off lines near 233 and 1016 and the Turn On Endless Sessions setup |
| `.env.example` | Modify | Sections 8 and 18 name the enable flag |
| `.skilled/hooks/hook-flags.env.example` | Modify | The enable line |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | New row for `SYSTEM_SESSION_RELAUNCH_ENABLED`, read by `/doctor:env` at run time |
| `.skilled/commands/doctor/assets/doctor-env.yaml` | Modify | `hook-flags.env` destination eligibility covers the enable flag |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Switches table and the disable lines |
| `.skilled/hooks/shared/README.md` | Modify | The default-off concern rule |
| `.skilled/hooks/README.md` | Modify | The concern row's default |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-*.md` | Modify | The three playbooks set the enable flag in every live command and name it as a precondition |
| `specs/hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh` | Modify | The sender launch line and the `prepare` call set `SYSTEM_SESSION_RELAUNCH_ENABLED=1`, so the live harness keeps hopping once the hooks ship off |
| `specs/hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-codex.sh` | Modify | The sender launch line sets `SYSTEM_SESSION_RELAUNCH_ENABLED=1` for the same reason |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | With no enable flag and no kill switch, `isHookEnabled('session-relaunch')` returns false in every reader. |
| REQ-002 | `SYSTEM_SESSION_RELAUNCH_ENABLED` set truthy in the environment or in `hook-flags.env` enables the concern, and the environment value wins over the file value for the same key. |
| REQ-003 | `SYSTEM_SESSION_RELAUNCH_DISABLED` or the master switch, when truthy, disables the concern even with the enable flag set. |
| REQ-004 | Every concern other than session-relaunch keeps its current answer for the same inputs. |
| REQ-005 | The `.cjs`, `.mjs`, `.ts` and `.sh` readers return the same answer for the same env and file inputs. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | The Hermes arm path honours a file opt-in in production, as the other session-relaunch callers do. |
| REQ-007 | With the concern not enabled, the Claude context nudge emits no nudge and `prepare` inside the loop writes no relaunch record. |
| REQ-008 | The existing relaunch suites pass with their tests opted in, with no assertion weakened. |
| REQ-009 | Every doc and template that tells an operator how to switch the concern names `SYSTEM_SESSION_RELAUNCH_ENABLED` as the way on and the kill switch as the way off. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new resolver tests fail on the code before the change and pass after it, on all four readers.
- **SC-002**: The three relaunch suites and the hook-flags tests exit 0 after the change.
- **SC-003**: A grep over the doc surfaces in scope finds no line that says the concern is on by default.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The four resolver copies | One copy left default-on gives a runtime the old behavior | A cross-reader parity test over the same input table |
| Risk | Existing relaunch tests assume the concern is on | The suites go red for the wrong reason | Opt in once per file or through one helper, then rerun the whole suite |
| Risk | Hermes arm path passes an env with no config | A file opt-in never reaches the arm, so Hermes never hops | Read the config file there, with a test that opts in through the file |
| Risk | The operator's own checkout turns off on merge | The operator loses the handover until the line is added | The README and the env examples carry the one line to add |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The resolver still reads the config file at most once per process.

### Security
- **NFR-S01**: A missing or unreadable config file leaves session-relaunch off and every default-on concern on.

### Reliability
- **NFR-R01**: A truthy value means `1`, `true`, `yes` or `on`, case-insensitive, the same set the kill switches use.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty enable value: treated as not set, so the concern stays off.
- Enable set to `0` or `false` in the environment and `1` in the file: the environment wins and the concern stays off.

### Error Scenarios
- Config file absent or unreadable: the concern stays off.
- Enable and kill switch both truthy: the kill switch wins.

### State Transitions
- A record armed while enabled, then the flag removed: the next hook call is silent and the wrapper behaves as it does today for a disabled concern.
- A test that injects `env` with no `config`: the file is skipped, so the test must opt in through the injected env.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 20 files: four readers, one caller, five test files, about ten docs |
| Risk | 12/25 | A shared resolver contract that every hook reads |
| Research | 4/20 | The callers are already inventoried |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `prepare` outside the loop also check the concern? Today it prints the manual claim command before the enabled check (`session-relaunch.cjs:484-492`), and this phase leaves that order as it is.
<!-- /ANCHOR:questions -->

---
