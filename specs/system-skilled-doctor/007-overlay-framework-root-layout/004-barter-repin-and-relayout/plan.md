---
title: "Implementation Plan: Phase 4: barter-repin-and-relayout"
description: "From one ai-speckit session, stage and run /doctor:overlay repin onto the Skilled commit carrying phases 1-3, verify it, then at once run /doctor:overlay apply --relayout and fix every old source path. Three commits: the re-pin, its changelog record, and the relayout with its path fixes."
trigger_phrases:
  - "barter repin and relayout plan"
  - "doctor overlay repin then apply relayout"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: barter-repin-and-relayout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js overlay engine (`overlay-engine.cjs`), JSON manifest, Node.js tests (CommonJS and ESM), bash, Markdown |
| **Framework** | `/doctor:overlay` command (`status`, `repin`, `apply --relayout`, `apply`) over the vendored engine |
| **Storage** | Files only: `BO/overlay-manifest.json`, `BO/sync-state.json`, the source copies under `BO/` |
| **Testing** | Engine `status` and `status --json`, a second `apply`, the manifest's verify steps, `node --test`, `bash tests/run-all.sh` |

### Overview
The ai-speckit session re-pins `ai-speckit/skilled/` from `b0a3b9f` to `<C>` through `/doctor:overlay repin`, staged first, and verifies the new pin. In the same session it runs `/doctor:overlay apply --relayout`, which moves every source onto `framework/` or `root/`, and then fixes the tests, `init-repository.sh` and docs that name old source paths. Status with an empty `offLayout`, a `0 changed` apply, the sibling-folder probe, the overlay tests and the CI suite prove it, and three commits record it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] `rg -n 'Target Skilled commit: [0-9a-f]{40}' spec.md` prints one line
- [ ] The baseline `status` in `ai-speckit/skilled` prints `RESULT: PASSED`
- [ ] `ls skilled/barter-overlays/framework skilled/barter-overlays/root skilled/barter-overlays/relayout-runs` fails for all three, so no move target is taken

### Definition of Done
- [ ] Every requirement in `spec.md` holds
- [ ] `(cd skilled && node .skilled/commands/doctor/scripts/overlay-engine.cjs status)` prints `RESULT: PASSED` and no `LAYOUT` line, `status --json` has an empty `offLayout`, and `bash tests/run-all.sh` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Stage, approve, apply, then engine-driven source rename. The engine re-pins a copy first and the live tree only after the operator's yes. The engine then moves the bytes and rewrites the manifest; the session edits only path strings outside it.

### Key Components
- **`/doctor:overlay repin`** (`.skilled/commands/doctor/overlay.md:110-116`): stages into a fresh temporary folder, stops on a blocked overlay, asks once, runs the live re-pin and re-reads through `status`. The route takes no `--stage` flag. It allows only `--root`, `--upstream`, `--to` and `--rollback` (`overlay.md:35`), and the stage is its own first step (`overlay.md:110`). After a clean re-pin the next command is `/doctor:update record-base` (`overlay.md:116`), because a base exists at `skilled/.skilled/skills/.state/doctor-update/base.json`.
- **Vendored engine** (`skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs`): does the copy, backup and re-apply. The re-pin runs this copy (`ENGINE_COMMAND`, `:86`), so the old engine moves the tree onto the new one. From then on, status reports every off-layout field: at most 20 `LAYOUT` lines plus one overflow line, with the full list in `status --json` `offLayout`. LAYOUT is advisory, so status still passes (`isInSync`, `:3569-3570`).
- **`/doctor:overlay apply --relayout`**: runs the engine's `relayoutUnderLock` (`overlay-engine.cjs:6215-6267`). It backs up under `BO/relayout-runs/<stamp>`, renames the copies, rewrites the manifest's `source`, `fragment` and `base`, retargets the links at `BO/overlay-manifest.json:146-153` (`relayoutLinkTargets`, `:6104-6120`), then runs `apply` itself (`overlay.md` step 11). A separate `apply` afterwards is the `0 changed` check.
- **`BO/sync-state.json`**: keyed by destination path, so a source rename needs no rewrite. Only the engine may change it.

### Data Flow
Upstream `<C>` from `/Users/michelkerkmeester/MEGA/Development/Skilled` is copied into `ai-speckit/skilled/`. The engine re-applies the 133 overlays from `BO`, writes `pin.commit` and `sync-state.json`, then runs the manifest's regenerate and verify steps, including `barter-overlays/checks/compiled-routing-byte-parity.cjs` and `barter-overlays/checks/repin-survival.cjs` (`overlay-manifest.json:1536-1560`). The relayout then moves each copy inside `BO` and points the manifest and the live links at the new path, and the apply copies each source to its unchanged destination. Tests and docs that climb from one source copy to another follow the new paths by hand.

### Engine Commands
Run from `ai-speckit/skilled`, as Barter's README shows (`BO/README.md:30-40`). Each `/doctor:overlay` target runs the same engine command behind the operator's yes.
- `node .skilled/commands/doctor/scripts/overlay-engine.cjs status` and `status --json`
- `node .skilled/commands/doctor/scripts/overlay-engine.cjs repin --upstream /Users/michelkerkmeester/MEGA/Development/Skilled --to <C> --stage <dir>`, and the same without `--stage <dir>`
- `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply --relayout`
- `node .skilled/commands/doctor/scripts/overlay-engine.cjs apply`

### Commit Convention
From ai-speckit's history: `e4292f39ab4 chore(overlays): re-pin Skilled to b0a3b9f`, then `be4b54a1863 docs(changelog): record the b0a3b9f re-pin in v4.1.0.0`, which touched only `BO/skilled/changelog/skilled-coder/v4.1.0.0.md`. This phase adds a third commit for the relayout and its path fixes, so each step reverts alone. The relayout and the path fixes share a commit because tests that climb to old source paths fail between them.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup checks that `<C>` is recorded and descends from `b0a3b9f`, records the baseline status, porcelain and tests, and runs the sibling-folder probe against the old engine.
Implementation stages the re-pin, rebases the `_routes.yaml` overlay, runs the live re-pin, records its decisions, verifies it, makes commits 1 and 2, then with no `--adopt` or overlay edit in between runs `apply --relayout`, the `0 changed` apply and every path fix.
Verification runs status with an empty `offLayout`, a second apply, the probe, every overlay test, `bash tests/run-all.sh` and the old-path grep, then makes commit 3 and deletes the relayout backup.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

- `(cd skilled && node .skilled/commands/doctor/scripts/overlay-engine.cjs status)` prints `RESULT: PASSED`. After the re-pin `offLayout` has at least 131 items; after the relayout it is empty and no line starts `LAYOUT`. Every mid-phase count uses `status --json`, never `grep -c '^LAYOUT'`, because the overflow line also starts with `LAYOUT`.
- A second `apply` prints `0 changed` (`BO/README.md:36`), after the re-pin and again after the relayout. The in-sync count after the relayout equals the count after the re-pin, because destinations are byte-identical.
- The overlay tests are not in CI (`tests/run-all.sh:26` runs only `tests/*.test.sh`). `BO` holds 19 test files, and a test the inventory does not name may also climb to a source path, so every one runs: `node --test $(find skilled/barter-overlays \( -name relayout-runs -o -name repin-runs \) -prune -o \( -name '*.test.cjs' -o -name '*.test.mjs' \) -print)` exits 0. The `find` picks up old and new paths alike, so the same command runs before and after the relayout.
- `bash tests/run-all.sh` exits 0. This is CI's command (`.github/workflows/root-tests.yml:71`), and it covers `tests/init-repository.test.sh` and `tests/node-version-policy.test.sh`.
- `rg -n '"source": "skilled/' skilled/barter-overlays/overlay-manifest.json` prints nothing.
- The sibling-folder probe calls the exported `resolveOverlayDir` on a throwaway tree, before and after the re-pin; the change between the two runs is the evidence.
- The hooks are untouched. They find the folder by its name (`../scratch/inventory/b-barter.md` section C), and the name does not change in this phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

- `node` at the version `ai-speckit` pins, `bash`, `rg` and `git`. No new package.
- The Skilled checkout at `/Users/michelkerkmeester/MEGA/Development/Skilled`, holding `b0a3b9f` and `<C>`. It is read only, and the re-pin writes nothing there.
- Phase 3 complete, with `<C>` on the spec's Target Skilled commit line.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: the live re-pin fails after its backup, status fails, a live edit or conflict state blocks the relayout, a destination differs after the relayout, or a test fails and the fix is not a path string.
- **Before the re-pin commit**: `/doctor:overlay repin --rollback <run-id>`, which runs `node .skilled/commands/doctor/scripts/overlay-engine.cjs repin --rollback <run-id>` from `skilled/` (usage at `overlay-engine.cjs:50-51` in the vendored copy). The run id is the one the live re-pin printed.
- **Before commit 3**: copy the old manifest back from `BO/relayout-runs/<stamp>/`, move each copy back, and run `/doctor:overlay apply`.
- **After the commits**: `git revert` of commit 3, then `/doctor:overlay apply` so the live links point at the old sources again. Revert commit 2 and then commit 1 only if the re-pin itself must go. A revert of commit 3 alone leaves Barter on the new pin with off-layout sources, which status reports as advisory LAYOUT lines and still passes.

### Compatibility
Destinations are byte-identical before and after the relayout, so the status in-sync count does not change across it. The two tracked layout links under `skilled/.skilled/changelog/` retarget to the moved copies and resolve to the same bytes. `skilled/.skilled-overlays.json` still names `barter-overlays`, an in-tree folder, which the new engine still accepts.
<!-- /ANCHOR:rollback -->

---
