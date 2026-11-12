---
title: "Implementation Plan: Phase 12: advisor-suite-parallel-trial"
description: "Split the advisor vitest config into a parallel project and a serial project modelled on the deep-loop config. Measure one baseline and three trial runs of npm test, and keep the split only when all three pass and the median is at least 10 percent faster."
trigger_phrases:
  - "advisor suite parallel trial plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: advisor-suite-parallel-trial

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node (the version `package.json` allows) |
| **Framework** | Vitest 4.1.12 |
| **Storage** | SQLite through `better-sqlite3`, gitignored under `runtime/database/` |
| **Testing** | `npm test` in the advisor runtime, `/usr/bin/time -p`, `vitest list --filesOnly` |

### Overview
Replace the advisor runtime's single serial vitest config with a `parallel` project and a `serial` project, copying the `sequence.groupOrder` shape already used by `.skilled/skills/system-deep-loop/runtime/vitest.config.ts`. The serial project holds the 12 files that bind the daemon socket, spawn the launcher, take the lease or open the skill-graph database; the other 149 files run side by side. Prove the change with one baseline, three trial runs and a median that clears the parent's 10 percent rule.
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
- [ ] `cd .skilled/skills/system-skill-advisor/runtime && ./node_modules/.bin/vitest list --filesOnly | wc -l` prints `161`
- [ ] The three `Trial` rows in `scratch/trial-results.md` say `pass`
- [ ] The gate check prints `GATE CONSISTENT`
- [ ] The decision and config check prints `MATCH`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-project vitest split.

### Key Components
- **`parallel` project**: `fileParallelism: true`, `sequence.groupOrder: 0`, includes `tests/**/*.vitest.ts` minus `SERIAL_FILES`.
- **`serial` project**: `fileParallelism: false`, `sequence.groupOrder: 1`, includes only `SERIAL_FILES`, so it runs after the parallel group one file at a time.
- **`SERIAL_FILES`**: the one list both projects read. Twelve paths, each naming the shared surface it holds.
- **Trial log**: `scratch/trial-results.md`, the baseline, three runs, the median, the saving and the decision.

Without the serial project, the 12 files that bind a socket or start a launcher run beside each other and race on the shared surface. Without the parallel project, the 149 independent files stay in one queue and the suite keeps its 309 s step. The `SPECKIT_RUN_STRESS` branch keeps its current single-config, `fileParallelism: false` shape and is not part of the trial.

### Data Flow
Vitest loads the config and assigns each file to one project by its include and exclude lists. Files in the parallel project run in worker processes, each with its own module graph and its own `SPEC_KIT_DB_DIR` from the shared setup file. The serial group waits for the parallel group, then runs its 12 files one at a time with the same setup. The final summary aggregates both projects, so the file and test totals stay comparable with the baseline.

### Serial-File Inventory

The 12 files below are the ones whose setup names the launcher binary, the daemon socket, the lease or the skill-graph database module. The other 149 are the trial's parallel arm: the first run is what proves the classification, and any failure reverts.

| File | Shared surface it references |
|------|------------------------------|
| `tests/launcher-bootstrap.vitest.ts` | Launcher binary, socket and lease |
| `tests/launcher-install-guard.vitest.ts` | Launcher install path, spawned process |
| `tests/launcher-lease.vitest.ts` | Launcher binary and lease file |
| `tests/launcher-model-server-default.vitest.ts` | Launcher binary, socket and lease |
| `tests/launcher-reap-pid-reuse.vitest.ts` | Launcher binary, lease and child processes |
| `tests/launcher-stale-build-recycle.vitest.ts` | Launcher binary and lease |
| `tests/skill-advisor-launcher-orphan-reaping.vitest.ts` | Launcher binary, daemon socket and lease |
| `tests/skill-advisor-cli-dual-client.vitest.ts` | Daemon socket |
| `tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` | Daemon socket |
| `tests/daemon-freshness-foundation.vitest.ts` | Lease and sandbox database directory |
| `tests/skill-graph-db.vitest.ts` | Skill-graph SQLite index |
| `tests/state-containment.vitest.ts` | Skill-graph database directory and generation file |

The pure unit tests among the similarly named files stay parallel on purpose: `launcher-idle-timeout.vitest.ts` exercises a timer parser and monitor, `handlers/skill-graph-listing.vitest.ts` reads a tool list, `handlers/skill-graph-dispatch.vitest.ts` mocks every handler, `sqlite-integrity.vitest.ts` mocks `better-sqlite3`, and the two `daemon-watcher-*` files mock `chokidar` and the database module.

### Config Shape

The current file exports a plain object, not `defineConfig`, for the reason its header comment gives. Keep that and keep the stress branch exactly as it behaves today.

```ts
const SERIAL_FILES = [
  'tests/launcher-bootstrap.vitest.ts',
  'tests/launcher-install-guard.vitest.ts',
  'tests/launcher-lease.vitest.ts',
  'tests/launcher-model-server-default.vitest.ts',
  'tests/launcher-reap-pid-reuse.vitest.ts',
  'tests/launcher-stale-build-recycle.vitest.ts',
  'tests/skill-advisor-launcher-orphan-reaping.vitest.ts',
  'tests/skill-advisor-cli-dual-client.vitest.ts',
  'tests/skill-advisor-cli-stale-daemon-retry.vitest.ts',
  'tests/daemon-freshness-foundation.vitest.ts',
  'tests/skill-graph-db.vitest.ts',
  'tests/state-containment.vitest.ts',
];

const baseTest = {
  root: import.meta.dirname,
  setupFiles: [
    path.resolve(import.meta.dirname, '../../system-spec-kit/runtime/tests/_support/vitest-setup.ts'),
  ],
  globals: true,
  environment: 'node' as const,
  testTimeout: TEST_TIMEOUT_MS,
  teardownTimeout: TEARDOWN_TIMEOUT_MS,
  alias: {
    '@lib': path.resolve(import.meta.dirname, 'lib'),
  },
};

export default ({
  root: import.meta.dirname,
  test: INCLUDE_STRESS
    ? {
        ...baseTest,
        include: [
          'stress-test/**/*.vitest.ts',
          ...(INCLUDE_BENCHES ? ['bench/**/*.bench.ts'] : []),
        ],
        exclude: [
          'node_modules',
          'dist',
          ...(INCLUDE_BENCHES ? [] : ['bench/**/*.bench.ts']),
        ],
        fileParallelism: false,
      }
    : {
        projects: [
          {
            test: {
              ...baseTest,
              name: 'parallel',
              include: [
                'tests/**/*.vitest.ts',
                ...(INCLUDE_BENCHES ? ['bench/**/*.bench.ts'] : []),
              ],
              exclude: [
                'node_modules',
                'dist',
                ...SERIAL_FILES,
                ...(INCLUDE_BENCHES ? [] : ['bench/**/*.bench.ts']),
              ],
              fileParallelism: true,
              sequence: { groupOrder: 0 },
            },
          },
          {
            test: {
              ...baseTest,
              name: 'serial',
              include: SERIAL_FILES,
              fileParallelism: false,
              sequence: { groupOrder: 1 },
            },
          },
        ],
      },
});
```

### File Budget

| Project | Files |
|---------|-------|
| `parallel` | 149 |
| `serial` | 12 |
| Total | 161 |

The 149 is arithmetic from the 161 files `vitest list --filesOnly` reports today and the 12 named paths, not a second count.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup confirms the serial line at `vitest.config.ts:40`, creates the trial log, builds the runtime and refreshes the skill-graph database, then records one baseline run of `npm test`. Implementation replaces the single config with the two projects and confirms the census is 149 plus 12. Verification runs three timed trials, computes the median and the saving, applies the keep-or-revert decision to the config, and confirms the suite still collects 161 files.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The command under test is the one CI runs, from the runtime directory:

```text
cd .skilled/skills/system-skill-advisor/runtime
/usr/bin/time -p npm test
```

The baseline and every trial run that command on the same machine, back to back, with no other build running. Record `real` from `/usr/bin/time` as the gate number and vitest's own `Duration` line beside it. A run passes when its summary prints the same `Test Files` total as the baseline and no failing test.

The census check proves no file was dropped. Before the edit it prints `161`; after the edit the two projects print `149` and `12`, which must still total `161`.

```text
cd .skilled/skills/system-skill-advisor/runtime
./node_modules/.bin/vitest list --filesOnly | wc -l
./node_modules/.bin/vitest list --project parallel --filesOnly | wc -l
./node_modules/.bin/vitest list --project serial --filesOnly | wc -l
```

The gate is arithmetic over the recorded rows, with `Saved = (Baseline - Median) / Baseline * 100` to one decimal. The check below recomputes the saving and confirms the decision matches it and the three pass rows; it prints `GATE CONSISTENT` or `GATE INCONSISTENT`.

```text
awk -F': ' '/^\| Trial [123] \| projects \| pass \|/ { p++ } /^Baseline:/ { b=$2+0 } /^Median:/ { m=$2+0 } /^Saved:/ { s=$2+0 } /^Decision:/ { d=$2 } END { r=(b-m)/b*100; good=((p==3 && r>=10 && s>=10 && d=="Keep") || (!(p==3 && r>=10 && s>=10) && d=="Revert")); same=(s-r<0.05 && s-r>-0.05); print (good && same ? "GATE CONSISTENT" : "GATE INCONSISTENT") }' scratch/trial-results.md
```

The parent's rule is the only keep condition: three passes in a row and at least 10 percent faster. A failed run or a median below `10.0` percent reverts, and the numbers stay in the log either way.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node, npm and Vitest 4.1.12, already installed under `runtime/node_modules`.
- `npm run build` for the advisor runtime, because the stress step imports the built plugin and the default suite imports the runtime's built dist.
- `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format text`, because several default-suite tests read the skill-graph database a fresh checkout does not have.
- `/usr/bin/time -p` for wall-clock seconds. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: any of the three trial runs fails, or the median saving is below `10.0` percent.

Procedure: restore the single `fileParallelism: false` test option and delete the `projects` array from `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts`. That file is the only source file the phase changes, so no other revert is needed. Re-run `vitest list --filesOnly`; it prints `161`. Record the decision and the numbers in `scratch/trial-results.md`, then close the phase as reverted.
<!-- /ANCHOR:rollback -->

---
