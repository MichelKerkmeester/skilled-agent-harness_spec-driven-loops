---
title: "Implementation Plan: Phase 12: folder-architecture"
description: "Measure every .skilled root the build touched once the last file-adding units merge, write a move map with a reason per move, then land each move as a git mv with its references rewritten in the same change and prove that every gate still passes with the baseline counts."
trigger_phrases:
  - "folder architecture plan"
  - "move map plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: folder-architecture

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and CommonJS for the runtime and the CLI, Rust for the crate, Markdown for the skill docs |
| **Framework** | None. The moves are `git mv` and text edits |
| **Storage** | None |
| **Testing** | vitest through the runtime's `npm test`, `cargo test`, the deep-loop executor audit tests and the repository's own checkers |

### Overview
The phase changes where files live and nothing about what they do. It measures the tree once the last file-adding units have merged, writes a move map that gives each candidate a verdict and a reason, then lands the moves one group at a time as `git mv` plus every reference update. The proof is the baseline gate set rerun from the final state with the same counts, a rename for every move and an `rg` per old path that finds nothing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 011.007, 010.003 and every runtime unit in the parent wave schedule have merged on `main`, and `rg -c "\| Unmet \|"` finds no row in any of their `acceptance-criteria.md` files.
- [ ] `scratch/tree-baseline.md` and `scratch/gate-baseline.md` exist and name every in-scope root.
- [ ] `scratch/move-map.md` gives every row a verdict and a reason.

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` reads `Met`.
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints the baseline `Test Files` and `Tests` counts with no `failed`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/012-folder-architecture --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measured move map.

### Key Components
- **`scratch/tree-baseline.md`**: the counts and the one-file folders per root, so a move answers a number rather than a taste.
- **`scratch/move-map.md`**: one row per candidate with old path, verdict, new path, reason and the reference count `rg -c -F` found. It is the only list of moves.
- **`scratch/gate-baseline.md`**: every gate's output before the first move, so no regression claim rests on memory.

### Data Flow
The measure feeds the map and the map feeds one move group at a time. Each group's verify reruns the gates it can break before the next group starts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Runtime imports and test imports | Name each module by relative path | update for every moved module | `npm run typecheck` exits 0 and the suite counts match |
| `.skilled/bin/bots.cjs` | Requires the runtime and resolves the crate | update any path a move changes | `node .skilled/bin/bots.cjs --help` prints the baseline text apart from moved paths |
| `.github/workflows/bots-runtime.yml` | Path filters, manifests and the design diff guard | update any path a move changes | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` |
| Hub `mode-registry.json`, `hub-router.json` and `SKILL.md` | Route to the four mode packets | unchanged unless the map moves a packet path, which it keeps by default | `parent-skill-check.cjs` prints `OK` |
| Playbook root index and scenario files | Name scenario files and the paths each step runs | update every moved path | the playbook validator prints `scenarios=58 violations=0` |
| Phase docs under `specs/` | Name built paths in tables, tasks and evidence | update every moved path | the per-row `rg -n -F '<old path>'` prints nothing |

Required inventories:
- Same-class producers: for each move row, `rg -n -F '<old path>' .` lists every file that names it, and that count goes into the row.
- Consumers of changed symbols: none, because no symbol changes. A relative import is a path, so the same `rg` covers it.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup measures and records the baselines, Implementation writes the map and lands the move groups and Verification reruns every gate from the final state.
<!-- /ANCHOR:phases -->

---

## External orchestration

Every task in `tasks.md` is dispatched or run by the orchestrator, as the parent's EXTERNAL ORCHESTRATION section says. The parent's roster, tier rule and fallback ladder bind every wave here [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md, section "EXTERNAL ORCHESTRATION"]. The primary is `cli-mistral-vibe` at `deepseek-flash`, fixed at `max`, and the first fallback is `cli-pi`.

**The worker rule.** One worker per wave. A move rewrites every file that names the old path, and those files cross every group, so two move workers would write the same doc, the same test or the same workflow. The groups therefore run as sequential briefs in one slot.

### W0 Setup, orchestrator, no dispatch

Tasks T001 and T002. The orchestrator measures the tree and records every gate's baseline output. The wave writes only this phase's `scratch/` files.

### W1 Move map, `cli-mistral-vibe` at `deepseek-flash`, one worker

| Worker | Task ids | Files | Effort | Fallback if `cli-mistral-vibe` runs out |
|--------|----------|-------|--------|--------------------------------------|
| W1a | T003 | `scratch/move-map.md` | `max (fixed)`, fallback at `max` | `cli-pi` `--thinking max`, then `cli-opencode` `#max`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |

The map is design work, so its fallback tier is `max`.

### W2 Moves, `cli-mistral-vibe` at `deepseek-flash`, one worker

| Worker | Task ids | Files | Effort | Fallback if `cli-mistral-vibe` runs out |
|--------|----------|-------|--------|--------------------------------------|
| W2a | T004, T005, T006, T007, T008, T009 | The mapped paths and every file that names one | `max (fixed)`, fallback at `high` | `cli-pi` `--thinking high`, then `cli-opencode` `#high`, then `cli-devin` `deepseek-v4-1-flash-max` after a probe, then `cli-codex` `gpt-6-luna` `xhigh` `fast` |

Each task is one brief and one commit, so a failed group reverts alone. Each brief carries its group's rows from the map verbatim, and the worker moves only those rows.

### W3 Verification, orchestrator, no dispatch

Tasks T010 to T014. The orchestrator reruns every gate, writes `scratch/tree-after.md` and validates the packet.

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Every runtime and crate module, unchanged in behavior | `npm test` in the runtime and `cargo test --locked` |
| Integration | The CLI, the hub routing, the CI inputs and the playbook package | `parent-skill-check.cjs`, `check-gate-inputs.sh`, `validate-playbook-package.cjs` and the design diff guard |
| Manual | `node .skilled/bin/bots.cjs ui` refuses `ui-not-built` on a bare tree and opens on the built crate | A terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 011.005, 011.006, 011.007 and 010.003 merged | Internal | Yellow | The phase cannot measure the tree it restructures, so it does not open |
| Every runtime unit merged | Internal | Yellow | A runtime file still being written would move under its owner |
| `git`, `rg`, `node` and `cargo` | External | Green | None. No new package |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any gate in `scratch/gate-baseline.md` fails or changes its counts after a move group lands.
- **Procedure**: `git revert` that group's commit. Each group is one commit and every move in it is a rename, so the revert restores the old paths and their references together.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 011.007, 010.003 and every runtime unit merged | Implementation |
| Implementation | The baselines and the move map | Verification |
| Verification | Every move group landed | 013-manual-testing-scenarios |
<!-- /ANCHOR:phase-deps -->

---
