---
title: "Feature Specification: Phase 4: push-gate-git-timeout"
description: "Gives the git calls on the pre-push skill gate a 20 second ceiling and the fsmonitor opt-out, so a wedged daemon falls through to the existing fallback instead of blocking the push."
trigger_phrases:
  - "push gate git timeout"
  - "phase 4 push gate git timeout"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: push-gate-git-timeout

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-fsmonitor-daemon-lifecycle |
| **Successor** | 005-reaper-hardening |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, and the stopped-daemon run in AC-004 ends within 40 seconds. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the fsmonitor daemon leak and worktree relocation regression specification. It is Layer 1 of the fix design in `001-deep-research/research/research.md`, section 6. It bounds the index-reading git calls on the pre-push path and their close siblings, so a stalled fsmonitor daemon makes the existing fallback fire instead of stalling the push.

**Scope Boundary**: Timeouts and the fsmonitor opt-out for the git calls named in section 3. Daemon reaping belongs to phase 003. Worktree location belongs to phase 002.

**Dependencies**:
- No dependency on phase 002 or phase 003. The predecessor field records packet order only, so this phase may ship first.
- Node.js `spawnSync` with the `timeout` option. The existing fallback in `generate-leaf-manifest.cjs` tests `res.error` at line 135. Node's documented behavior sets that error with code `ETIMEDOUT` when the timeout fires. The branch was read in the code, and the `ETIMEDOUT` behavior comes from Node's documentation. Neither was run live. AC-004 is the live check.

**Deliverables**:
- A timeout and the opt-out on the `check-ignore` call in `generate-leaf-manifest.cjs`, plus a timeout on its `rev-parse` call, and a process latch that limits a run to one timeout.
- The same timeout and opt-out on `regenerate-skill-derived.cjs`, `verify-router-sync.cjs` and `behavior-bench-run.cjs`.
- A timeout on the `git()` helper in `validate-message.mjs`.
- Four regression tests, one per touched script.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The pre-push skill gate runs `git check-ignore` with no time limit and no opt-out from the file system monitor. When the main checkout's fsmonitor daemon stops answering, that call waits forever, and the fallback never runs because a hang returns no error. On 2026-10-27 one push sat in the pre-push hook for about 30 minutes for this reason.

### Purpose
With the main fsmonitor daemon unresponsive, the pre-push skill gate ends within its bound and reports through its normal path. With git answering normally, the manifest bytes do not change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Command, run read-only, and its verbatim output:

```text
$ grep -n "spawnSync('git'\|execFileSync('git'" .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs .skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs
.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:111:  const res = spawnSync('git', ['rev-parse', '--show-toplevel'], { cwd, encoding: 'utf8' });
.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:129:  const res = spawnSync('git', ['check-ignore', '-z', '--stdin'], {
.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:73:  const result = spawnSync('git', ['-C', REPO_ROOT, 'check-ignore', '-q', resolved]);
.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:168:  const ignoreCheck = spawnSync('git', ['-C', SKCODE, 'check-ignore', '--stdin', '-z'], {
.skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs:885:    out = execFileSync('git', ['-C', repoRoot, 'status', '--porcelain'], {

$ grep -c "timeout\|fsmonitor" .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs .skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs
.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:0
.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs:0
.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs:0
.skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs:7
```

Reading: none of the git spawns on lines 111, 129, 73, 168 and 885 sets a `timeout` option or the fsmonitor opt-out. The seven matches in `behavior-bench-run.cjs` belong to other spawns in that file. Lines 885 to 888 set no timeout.

Recorded observation, quoted from `scratch/findings.md` section 1 and not re-run here: `git push origin main` sat in the pre-push hook for about 30 minutes, and `git check-ignore -z --stdin` stayed in sleep state for more than 16 minutes.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a 20000 ms timeout and `-c core.fsmonitor=false` to the `check-ignore` call at `generate-leaf-manifest.cjs:129`, and a 20000 ms timeout to its `rev-parse` call at line 111.
- Make every later git call in the same process skip git after one call returns an error, so a run waits at most one timeout.
- Add the same timeout and opt-out to `regenerate-skill-derived.cjs:73`, `verify-router-sync.cjs:168` and `behavior-bench-run.cjs:885`.
- Add a timeout to the `git()` helper at `validate-message.mjs:88` and to its `rev-parse` at line 81.
- Add one regression test per touched script.

### Out of Scope
- Reaping stray fsmonitor daemons - phase 003 owns it, and this phase signals no process.
- Moving the worktree base out of the checkout - phase 002 owns it, and this phase changes no topology.
- `git-hook-gates.cjs:180` - it runs `git config` writes from `doctor`, never from a gate, and a config write does not contact the daemon.
- The other git-spawning files under `.skilled` - the research sampled them and did not audit them, so an exhaustive pass is a separate piece of work.
- Shell `git` lines in `.skilled/scripts/git-hooks/*` - not read in this phase. A wedge in one of those lines still hangs the push.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modify | Timeout and opt-out on `check-ignore` (line 129), timeout on `rev-parse` (line 111), process latch |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs` | Modify | Timeout and opt-out on `check-ignore` (line 73) |
| `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` | Modify | Timeout and opt-out on `check-ignore` (line 168) |
| `.skilled/skills/system-deep-loop/shared/behavior-benchmark/behavior-bench-run.cjs` | Modify | Timeout and opt-out on `git status` (line 885) |
| `.skilled/skills/sk-git/scripts/validate-message.mjs` | Modify | Timeout on the `git()` helper (line 88) and its `rev-parse` (line 81) |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-git-timeout.test.cjs` | Create | Argv, timeout, fallback and latch test |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/regenerate-skill-derived-git-timeout.test.cjs` | Create | Argv, timeout and not-ignored result test |
| `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync-git-timeout.test.cjs` | Create | Stub git that sleeps, and the run ends within its bound |
| `.skilled/skills/system-deep-loop/shared/behavior-benchmark/tests/behavior-bench-run-git-timeout.test.cjs` | Create | Argv and timeout test |
| `.skilled/skills/sk-git/scripts/tests/validate-message-git-timeout.test.mjs` | Create | Stub git that sleeps, and the message gate exits 2 with a clear message |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `generate-leaf-manifest.cjs` runs `git -c core.fsmonitor=false check-ignore -z --stdin` with a 20000 ms timeout, and its `rev-parse` call with a timeout. A call that returns `res.error` reaches the existing `fallbackIgnored` path. |
| REQ-002 | After one git call in a process returns `res.error`, every later git call in that process skips git and uses the name fallback, so a run waits at most one timeout. |
| REQ-003 | With git answering normally, the manifest bytes that `buildManifestBytes` returns for every skill root are byte-identical to the bytes captured before the change. |
| REQ-004 | With the main fsmonitor daemon stopped, `ci-skill-root-metadata.cjs` ends within 40 seconds and exits with its normal status code. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | `regenerate-skill-derived.cjs:73`, `verify-router-sync.cjs:168` and `behavior-bench-run.cjs:885` carry the same timeout and opt-out. `validate-message.mjs:81` and `:88` carry a timeout. |
| REQ-006 | Each of the five touched scripts has one new `node:test` file that prints `# fail 0`, and the existing test files for those scripts still print `# fail 0`. |
| REQ-007 | When any git call in the process timed out, `generate-leaf-manifest.cjs --write` refuses to write `leaf-manifest.json`, leaves the file on disk unchanged, names the timed-out call on stderr, and exits nonzero. |
| REQ-008 | When `git status` cannot answer before or after a run, `behavior-bench-run.cjs` records an isolation violation that says git status was unavailable, instead of treating the run as clean. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the main fsmonitor daemon stopped, the pre-push skill gate finishes in under 40 seconds (AC-004).
- **SC-002**: With git answering normally, the manifest bytes for every skill root match the baseline (AC-003).
- **SC-003**: Each touched script has one regression test that prints `# fail 0`, and the existing tests for those scripts still pass (AC-006).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Node `spawnSync` with `timeout`, which sets `res.error` to `ETIMEDOUT` | Without it the fallback never fires and the hang returns | Tests use a synthetic `ETIMEDOUT`. AC-004 proves the live path in a scratch clone. |
| Dependency | `perl` for the probe ceiling on macOS | `timeout` is not installed on macOS by default | Use `perl -e 'alarm 20; exec @ARGV'` |
| Risk | A `--write` run that times out writes manifest bytes computed from name rules | High. The manifest on disk may differ from git's answer. | REQ-007: refuse to write. |
| Risk | `behavior-bench-run.cjs` returns an empty path list when `git status` fails, so the isolation check passes | Medium. A silent pass on a guard. | REQ-008: fail closed. |
| Risk | `verify-router-sync.cjs` drops its ignore filter on timeout, so ignored cache docs may count as orphans | Medium. The guard fails instead of hanging. | The existing `!ignoreCheck.error` branch already does this. The test records the outcome. |
| Risk | `validate-message.mjs` exits 2 on timeout | Low. The push is blocked with a clear message. | Accepted. A hang becomes a stated block. |
| Risk | A cold daemon answers in about 10 seconds a call | Low. A slow daemon could add time to each call. | The opt-out removes the daemon from these calls, so the slow path does not run. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: With the main daemon stopped, a skill gate run ends within 40 seconds of wall time. That is one 20 second timeout plus the rest of the gate. AC-004 measures it.
- **NFR-P02**: With git answering normally, the gate's wall time changes by less than 10 percent. A healthy run adds no process, because the latch and the timeout only act after a failure. T018 records before and after.

### Security
- **NFR-S01**: N/A. The change runs local git calls only, with no credential read and no network access.
- **NFR-S02**: N/A. No data leaves the machine, and the git arguments stay literal strings.

### Reliability
- **NFR-R01**: With the main daemon stopped, no run of the skill gate waits more than 40 seconds, whatever the number of skill roots. AC-004 measures it.
- **NFR-R02**: With git answering normally, zero skill roots differ from the baseline. AC-003 measures it.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a root with no leaves returns before any git call, so it adds no wait.
- Maximum input: `find .skilled/skills -name SKILL.md` counts about 56 files on 2026-10-27. Without the latch, a stopped daemon would cost 56 timeouts, about 18 minutes 40 seconds. With the latch it costs one timeout.
- Failure path: a timed-out `check-ignore` returns `res.error` with code `ETIMEDOUT`. The name fallback runs, and the gate prints its normal report with its normal exit status.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Five scripts, four new test files, about 60 changed lines |
| Risk | 12/25 | Degraded runs can change output and write bytes from name rules. Two fail-open edges are open. |
| Research | 6/20 | The research is done. Open questions remain on degraded behavior. |
| **Total** | **27/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Q1: Should the process latch in REQ-002 ship in this phase? The brief names timeouts and opt-outs only. Answered 2026-10-27: yes.
- Q2: On a timed-out run, should `generate-leaf-manifest.cjs --write` refuse to write, instead of writing bytes from name rules? Answered 2026-10-27: yes.
- Q3: Should `behavior-bench-run.cjs` fail closed when `git status` cannot answer? Today its catch returns an empty list, so the isolation check passes. Answered 2026-10-27: yes, in this phase.
<!-- /ANCHOR:questions -->

---


