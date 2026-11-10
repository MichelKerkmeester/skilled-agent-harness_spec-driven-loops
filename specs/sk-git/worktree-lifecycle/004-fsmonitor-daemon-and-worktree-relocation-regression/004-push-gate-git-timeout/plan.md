---
title: "Implementation Plan: Phase 4: push-gate-git-timeout"
description: "Adds a 20 second timeout and the fsmonitor opt-out to the index-reading git calls on the pre-push skill gate path and its siblings, with a process latch and five regression tests."
trigger_phrases:
  - "push gate git timeout plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: push-gate-git-timeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) and ES modules (`.mjs`) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node:test` for the new files, and the existing test files named in `tasks.md` |

### Overview
This change gives each git call on the pre-push skill gate path a 20 second `timeout`. The four calls that read the index also get the `-c core.fsmonitor=false` opt-out. The four close siblings and the message helper get the same ceiling. A process latch stops a run from paying the timeout once per skill root. Proof comes from five new regression tests, a stopped-daemon run in a scratch clone, and a byte diff of manifests on a healthy daemon.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (`spec.md` sections 2 and 3)
- [x] Success criteria measurable (`spec.md` section 5 names AC-003 and AC-004)
- [x] Dependencies identified: none on phase 002 or phase 003 (`spec.md` Phase Context)
- [x] Open questions Q1, Q2 and Q3 answered by the operator (`spec.md` section 10)

### Definition of Done
- [x] All acceptance criteria met: no row in `acceptance-criteria.md` is `Unmet`
- [x] `node --test --test-reporter=tap <file>` prints `# fail 0` for each of the nine test files named in `tasks.md` (five new, four existing)
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <packet folder> --strict` prints `RESULT: PASSED`
- [x] Docs updated (spec, plan and tasks agree on the call sites and the opt-out)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a bounded subprocess call with an existing fallback.

### Key Components
- **Bounded git call sites**: six sites get a `timeout`. The four that read the index also get `-c core.fsmonitor=false`. They sit at `generate-leaf-manifest.cjs:111` and `:129`, `regenerate-skill-derived.cjs:73`, `verify-router-sync.cjs:168`, `behavior-bench-run.cjs:885`, and `validate-message.mjs:81` and `:88`.
- **Process latch**: one module flag in `generate-leaf-manifest.cjs`. It is set when any git call in that module returns `res.error`. Later calls in the same process skip git and use the name fallback.
- **Existing fallbacks**: `fallbackIgnored` at `generate-leaf-manifest.cjs:104`, the `!ignoreCheck.error` branch at `verify-router-sync.cjs:172`, and the `catch` at `behavior-bench-run.cjs:889`. The change adds no new fallback.

### Data Flow
`ci-skill-root-metadata.cjs` calls `buildManifestBytes` once per skill root (line 351). `buildManifestBytes` reaches `dropGitIgnoredLeaves` (line 118), which calls `gitToplevel` (line 110, `rev-parse` at line 111). Then it calls `check-ignore` (line 129). The result is either the ignored set, or the name fallback at line 136 when `res.error` is set or the exit status is neither 0 nor 1.

### Decisions
- **D1, timeout and opt-out together.** The timeout ends a hang. The opt-out removes the daemon from these calls, so a slow daemon stops adding time as well. Research section 5 Q4 asks for both.
- **D2, process latch in `generate-leaf-manifest.cjs`.** `checkRoot` calls `buildManifestBytes` once per root in one process. Without a latch, a stopped daemon costs one timeout per root. The brief names timeouts and opt-outs only, so this goes beyond that list. It needs the operator answer to Q1.
- **D3, `regenerate-skill-derived.cjs:73` does not use `res.error`.** The code tests `result.status === 0` (line 74). A timed-out call leaves `status` null, so the path becomes not ignored. The code caches that result (line 75) for the process. A wedged run therefore reports an absent gitignored artifact as missing. This site is not on the pre-push path. `ci-skill-derived-freshness.cjs` reaches it, not the skill gate.
- **D4, `verify-router-sync.cjs:168` uses the existing branch.** A timeout sets `ignoreCheck.error`. The branch at line 172 then skips the ignore filter, so ignored cache docs may count as routable. A wedge now fails the guard instead of hanging it.
- **D5, `behavior-bench-run.cjs` fails closed.** A timeout throws, and today the catch at line 889 returns an empty list, so the isolation check passes. The catch returns `null`, and the callers turn `null` into a git-status-unavailable violation (REQ-008).
- **D6, `validate-message.mjs:88` gets a timeout only.** `rev-list` and `log` do not read the index, and the message gate runs inside the push. A timed-out call throws into the outer handler at line 221. That handler exits 2 with `BLOCKED: the message validator failed`. The config reads at lines 144 and 149 sit in `try` blocks and would treat a timeout as unset. Config reads never contact the daemon, so that path is theoretical.
- **D7, `generate-leaf-manifest.cjs:111` gets a timeout only.** `rev-parse --show-toplevel` does not read the index. The research rule asks for a timeout alone on a gate command that does not read the index.
- **D8, `git-hook-gates.cjs:180` stays unchanged.** It runs `git config` writes from `doctor`. A config write never contacts the daemon, and it does not run inside a gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `generate-leaf-manifest.cjs` | Owns the manifest bytes and the git ignore filter | update | `tests/generate-leaf-manifest-git-timeout.test.cjs`, AC-001 and AC-002 |
| `ci-skill-root-metadata.cjs` | The pre-push skill gate. It calls `buildManifestBytes` at line 351 and inherits the bound | unchanged, not a consumer of the new option | AC-004 stopped-daemon run |
| `ci-leaf-manifest-freshness.cjs` | Calls `buildManifestBytes` at line 117, and inherits the bound | unchanged | Its existing test `ci-leaf-manifest-freshness.test.cjs` still prints `# fail 0` |
| `regenerate-skill-derived.cjs` | Sibling, reached from `ci-skill-derived-freshness.cjs` | update | `tests/regenerate-skill-derived-git-timeout.test.cjs`, D3 |
| `verify-router-sync.cjs` | Sibling, run by the drift guards | update | `tests/verify-router-sync-git-timeout.test.cjs`, D4 |
| `behavior-bench-run.cjs` | Sibling, isolation check | update | `tests/behavior-bench-run-git-timeout.test.cjs`, Q3 |
| `validate-message.mjs` | Message gate helper, runs inside the push | update, timeout only | `tests/validate-message-git-timeout.test.mjs`, D6 |
| `git-hook-gates.cjs` | `doctor` config writer | not a consumer, no change | D8 |
| `check-source-tags-helper.mjs` and `cite-drift-scan.mjs` | The existing opt-out convention | unchanged | Source for the shape of the opt-out |

Required inventories:
- Same-class producers: `rg -n "spawnSync\('git'|execFileSync\('git'|execFile\('git'" .skilled --glob '*.cjs' --glob '*.mjs' --glob '*.js' --glob '!**/node_modules/**'`. The result lists every git spawn. Phase 004 touches six of them.
- Consumers of changed symbols: `rg -n "buildManifestBytes|keyFileExists|gitStatusPaths|dropGitIgnoredLeaves" .skilled --glob '*.cjs' --glob '*.mjs' --glob '!**/node_modules/**'`
- Matrix axes: git answer (normal, timed out, non-zero exit), call site (the six named above), and root count (one root, many roots). Each site gets a normal row and a timed-out row. The non-zero exit path already has tests in the existing ignores file.
- Algorithm invariant: a timed-out git call never returns an ignore set. It returns the site's own existing fallback, and it never hangs.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- Setup: confirm the daemon answers the probe, capture the baseline bytes and the baseline test results (T001 to T004).
- Implementation: add the timeout, the opt-out and the latch to the six sites, and write the five new tests (T005 to T016).
- Verification: run the healthy byte diff, the stopped-daemon run, the wall-time comparison and the packet validator (T017 to T023).

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The five new `node:test` files, and the four existing test files named in `tasks.md` T004 | `node --test --test-reporter=tap <file>`, which must print `# fail 0` |
| Integration | The stopped-daemon run of `ci-skill-root-metadata.cjs` in a scratch clone, timed | `node`, `time`, `kill -STOP` on the clone's daemon only |
| Manual | The healthy-run byte diff of every skill root against the baseline, and the wall-time comparison | `diff -r`, `time` |

The unit tests replace `spawnSync` or `execFileSync` in the test process, or put a stub `git` on `PATH` that sleeps. They never call git in the live checkout. The two stub tests, for `verify-router-sync` and `validate-message`, take about 20 seconds each, because they wait for the real ceiling.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node `spawnSync` with `timeout` sets `res.error` to `ETIMEDOUT` | System | Green | Without it the fallback never fires. The test uses a synthetic error, and AC-004 proves the live path. |
| `perl`, for the probe ceiling `perl -e 'alarm 20; exec @ARGV'` | System | Green | macOS ships `perl` but not `timeout`. Without `perl` the probe cannot end a wedged call. |
| git 2.50.1 fsmonitor | External | Yellow | The wedge reproduces only with the daemon on. The opt-out is shown by argv in the unit tests, and by the stopped run in AC-004. |
| A scratch clone of this repository | Internal | Green | Holds the stopped daemon, so the main checkout's daemon stays untouched. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: AC-003 shows any byte difference on a healthy run, AC-004 runs past 40 seconds, or an existing test prints a failure after the change.
- **Procedure**: revert the phase commit with `git revert <phase-commit>`, after the operator says yes. The change touches six call sites, one message helper and five new test files. It writes no data and changes no config.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None. The probe must pass first. | Implementation |
| Implementation | Setup (Q1 to Q3 answered 2026-10-27) | Verification |
| Verification | Implementation | Phase close |

This phase depends on no other phase of this packet. It may ship before phase 002 or phase 003.
<!-- /ANCHOR:phase-deps -->

---
