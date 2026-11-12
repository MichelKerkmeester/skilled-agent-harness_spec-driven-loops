---
title: "Implementation Plan: Phase 16: local-test-timing-profile"
description: "Run each of the three runtimes' declared `npm test` once under `/usr/bin/time -p` and write the command, wall seconds and exit status into `scratch/local-test-timings.md`. The plan adds no code and no configuration: the only artifact is the record, and the proof is that its three rows match what the commands printed."
trigger_phrases:
  - "local test timing profile plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: local-test-timing-profile

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js 26.13.0 with npm |
| **Framework** | Vitest (declared `^4.1.12`), plus the spec-kit `scripts/run-tests.mjs` wrapper |
| **Storage** | None |
| **Testing** | `/usr/bin/time -p npm test` in each runtime; the exit status is the pass or fail result |

### Overview
Time one `npm test` run in each of the three runtimes and write the command, wall seconds and exit status into `scratch/local-test-timings.md`. The plan adds no code and no configuration, because the phase measures what exists today. Prove it with three rows whose command is `npm test`, the command that runs each `package.json`'s `test` script, and whose exit statuses are the ones the shells returned.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `rg -c '^\| \.skilled/skills/(system-spec-kit|system-skill-advisor|system-deep-loop)/runtime \| npm test \| [0-9]+(\.[0-9]+)? \| [0-9]+ \|$' specs/system-speckit/runtime-and-release/006-test-cycle-speed/016-local-test-timing-profile/scratch/local-test-timings.md` prints `3`
- [ ] `git status --porcelain --untracked-files=no -- .skilled/skills` prints the same six pre-existing modifications as at setup
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/006-test-cycle-speed/016-local-test-timing-profile --strict --quiet` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measurement only.

### Key Components
- **The three `package.json` test scripts**: the source of the exact command. The command timed is `npm test` in every case; reading the scripts first confirms what that resolves to: `node scripts/run-tests.mjs`, `vitest run` and `vitest run --no-coverage`.
- **`/usr/bin/time -p`**: the wall-clock source. Its `real` line includes npm and wrapper startup, which is the wait the operator feels.
- **`scratch/local-test-timings.md`**: one row per runtime, and the only artifact the phase creates.

No component is added to the product. A script that ran the three suites would be a new file with no caller after one use, so the runs are made and recorded by hand.

### Data Flow
The operator runs `cd <runtime> && /usr/bin/time -p npm test`, reads the `real` line and the shell's `$?`, and writes both into the row for that runtime. npm starts the declared script, the script runs the suite, and the exit status carries pass or fail. Nothing in the product changes.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup confirms the three declared commands and creates the record with its run conditions. Implementation runs each `npm test` once under `/usr/bin/time -p` and writes one row. Verification re-reads the three rows, confirms no tracked file changed, and records the numbers in `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

There is no product behavior to test; the measurement is the test. The proof is structural: each row's command cell must read `npm test`, the command that runs that runtime's `scripts.test` value; each wall figure must be the `real` line the run printed; and each exit must be the status the shell returned. A failing suite is recorded with its exit status and is not repaired, because a repair would change the subject of the measurement.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node 26.13.0 and npm, which start each declared script.
- `/usr/bin/time -p`, which supplies the wall-clock `real` line.
- The `node_modules` already installed in the three runtimes. No new package.
- `rg` and `git status`, used by the verification tasks.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a run exceeds a bound, the machine was loaded, or the wrong command ran. Rollback: delete `scratch/local-test-timings.md` and run the three commands again. No product file changes, so there is nothing else to revert.
<!-- /ANCHOR:rollback -->

---
