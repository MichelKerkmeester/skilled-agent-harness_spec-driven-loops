---
title: "Feature Specification: Phase 11: ci-health-followups"
description: "Two flaky tests fail CI runs for reasons unrelated to the change under test, and Dependabot PR 91 asks for a pi-coding-agent bump in two pi extensions. This phase fixes both flakes at their cause and measures the bump against npm audit."
trigger_phrases:
  - "ci health followups"
  - "phase 11 ci health followups"
  - "goal-core statepath flake"
  - "watcher chokidar ready flake"
  - "pi-coding-agent 1.4.0 bump"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: ci-health-followups

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | The goal-core suite and the watcher suite pass, and both extensions pass their CI steps at pi-coding-agent 1.4.0 with `npm audit` at 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the CI workflow efficiency packet. It closes three CI-health items found after phase 010 closed.

**Scope Boundary**: `.skilled/hooks/goal/lib/goal-core.test.cjs`, the advisor watcher (`lib/daemon/watcher.ts`) and its new-root ingestion test, and the two `package-lock.json` files under `.pi/extensions/`. No workflow file changes.

**Dependencies**:
- The npm registry and its advisory database, for the version bump and `npm audit`.
- Real chokidar, resolved from the spec-kit runtime install, for the watcher test.

**Deliverables**:
- A goal-core assertion that no temp-directory name can break.
- A watcher test that writes its skill only after the watcher has proven event delivery.
- A measured answer on the pi-coding-agent bump.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The goal-core test `scope paths hash canonical workspace, runtime, and session identity` asserts that the whole state path holds no `pi`, but the path sits under a `mkdtemp` directory whose random suffix can contain `pi`, so it fails about one run in 750. The advisor test `discovers a newborn skill through real chokidar without a restart` writes its skill 150 ms after start and fails when the watcher is not yet delivering events. Separately, Dependabot PR 91 bumps `@earendil-works/pi-coding-agent` from 0.75.3 to 0.79.0 in two pi extensions to clear open alerts.

### Purpose
Both tests fail only when the code under test is wrong, and the extension lockfiles carry a pi-coding-agent version that `npm audit` reports clean.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ cd .skilled/skills/system-skill-advisor/runtime   # before the fix, 3 runs
$ npx vitest run tests/daemon-watcher-new-root-ingestion.vitest.ts
  run 1: × discovers a newborn skill through real chokidar without a restart 5181ms
  run 2: × discovers a newborn skill through real chokidar without a restart 5174ms
  run 3: Tests  5 passed (5)

# Traced failing run, awaiting chokidar 'ready' instead of the sleep:
2 ready
STATUS {"watchedPaths":2,"pendingEvents":0,"quarantinedSkills":0,"diagnostics":[]}
# no addDir and no raw event for the new skill in 5 s

# Probe directories created after 'ready' until one is reported, 15 runs:
# probes needed: 3,3,4,5,5,6,6,7,9,10,11,13,19,36,40 (100 ms each)

$ TMPDIR=<scratch>/pi-tmp node --test --test-name-pattern "scope paths hash" <HEAD copy of goal-core.test.cjs>
ℹ pass 0
ℹ fail 1

$ npm audit   # both extensions, lockfile at 0.75.3
1 high severity vulnerability
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Change the goal-core assertion to check `basename(scope.statePath)`, the part the code under test names.
- Expose chokidar's `ready` event as a `ready` promise on the skill-graph watcher.
- Make the real-chokidar test await `ready`, then prove delivery with hidden probe directories before it writes the skill.
- Move both extension lockfiles to pi-coding-agent 1.4.0, add an `undici` `^8.12.2` override to pi-fast-mode-w-subagent-support, and run each extension's CI steps and `npm audit`.

### Out of Scope
- The `pi-coding-agent` `*` ranges in both `package.json` files - they stay as they are; only the lockfiles pin 1.4.0.
- The watcher's production arming behavior - a daemon that misses a skill created within seconds of startup picks it up on the next event or restart.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/goal/lib/goal-core.test.cjs` | Modify | Assert on the state file's basename |
| `.skilled/skills/system-skill-advisor/runtime/lib/daemon/watcher.ts` | Modify | Add the `ready` promise |
| `.skilled/skills/system-skill-advisor/runtime/tests/daemon-watcher-new-root-ingestion.vitest.ts` | Modify | Await `ready` and the probe handshake instead of a fixed sleep |
| `.pi/extensions/pi-cache-optimizer/package-lock.json` | Modify | pi-coding-agent 0.75.3 to 1.4.0 |
| `.pi/extensions/pi-fast-mode-w-subagent-support/package-lock.json` | Modify | pi-coding-agent 0.75.3 to 1.4.0 |
| `.pi/extensions/pi-fast-mode-w-subagent-support/package.json` | Modify | Add `"overrides": {"undici": "^8.12.2"}` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node --test .skilled/hooks/goal/lib/goal-core.test.cjs` prints `fail 0`, and the `scope paths hash` test passes with a `TMPDIR` whose path contains `pi` |
| REQ-002 | `npx vitest run tests/daemon-watcher-new-root-ingestion.vitest.ts` passes 5 runs in a row, with no fixed sleep before the skill is written |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Both extension lockfiles resolve pi-coding-agent 1.4.0, the version the host `pi` runs, `npm test` and `npm run --if-present typecheck` pass, and `npm audit` reports 0 vulnerabilities |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The goal-core suite passes 98 of 98, including under a `pi`-bearing `TMPDIR`.
- **SC-002**: The watcher suite passes 5 of 5 runs in a row.
- **SC-003**: `npm audit` prints `found 0 vulnerabilities` in both extensions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | npm advisory database | The audit result for a version can change after the bump is chosen | Record the audit output with the date it was taken |
| Risk | pi-coding-agent pins `undici` exactly (8.3.0 at 0.79.0, 8.10.2 at 1.4.0) | High: the bump can add advisories instead of clearing them | Measured 0.79.0 (6 vulnerabilities) and chose 1.4.0 with an `undici` override; `npm audit` prints 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The probe handshake adds at most 10 s (100 probes of 100 ms) to the watcher test, inside its 30 s timeout.
- **NFR-P02**: N/A: no service throughput is involved.

### Security
- **NFR-S01**: No change reads or writes a credential.
- **NFR-S02**: The lockfiles land only when `npm audit` reports no new advisory.

### Reliability
- **NFR-R01**: Neither test depends on a temp-directory name or a fixed delay.
- **NFR-R02**: A watcher that never delivers a probe fails with `expect(probeSeen).toBe(true)`, not with a missing reindex.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a `mkdtemp` suffix with no `pi` passes before and after the fix.
- Maximum input: a watcher that needs all 100 probes still leaves 15 s of the 30 s test timeout for the three 5 s reindex waits.
- Failure path: a watcher that delivers no event at all fails on the probe assertion within 10 s.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 6 files, under 45 changed lines outside the lockfiles |
| Risk | 8/25 | One additive interface member; a dependency bump with audit impact |
| Research | 8/20 | The watcher flake needed a trace to find its cause |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. Which pi-coding-agent version should the extensions carry? Decision: 1.4.0, the version the host `pi` runs. 0.79.0 pins `undici` 8.3.0, `ws` 8.20.1, `zod` 3.25.76 and older `protobufjs` and `brace-expansion`, and `npm audit` reported 6 (5 high, 1 moderate) in each extension. 1.4.0 pins `undici` 8.10.2, so pi-fast-mode-w-subagent-support gets an `undici` `^8.12.2` override; pi-cache-optimizer's existing `^8.9.0` override already resolves 8.12.3.
<!-- /ANCHOR:questions -->

---
