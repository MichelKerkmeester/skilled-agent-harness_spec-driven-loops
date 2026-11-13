---
title: "Tasks: Start the skill advisor on the Node its native database module was built for"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "advisor native node resolution tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Start the skill advisor on the Node its native database module was built for

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/system-skill-advisor/runtime`. `W` is `.skilled/bin/skill-advisor.cjs`. `N22` is `~/.nvm/versions/node/v22.23.4/bin/node`. `T` is `.skilled/bin/tests/skill-advisor-node.test.cjs`. `L` is `$(pwd)/.skilled/bin/system-skill-advisor-launcher.cjs`. `COLD` is `SPECKIT_IPC_SOCKET_DIR=$(mktemp -d /tmp/adv.XXXXXX) N22 W advisor_status --json "{\"workspaceRoot\":\"$(pwd)\"}"`. Run every task from the root of a worktree, never from the main checkout.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the bin tests pass before any edit (`.skilled/bin/tests`). Verify: `node --test .skilled/bin/tests/` reports `fail 0`.
- [x] T002 Record the advisor suite baseline (`specs/system-skill-advisor/runtime-lifecycle/006-advisor-native-node-resolution/scratch/baseline.txt`). Verify: `npx vitest run` in `R` exits 0, and `rg -c 'passed' specs/system-skill-advisor/runtime-lifecycle/006-advisor-native-node-resolution/scratch/baseline.txt` prints 1.
- [x] T003 Reproduce the cold-start failure under Node 22 (`.skilled/bin/skill-advisor.cjs`). Verify: `COLD` exits 75 and prints `daemon launcher exited with code 1`.
- [x] T004 Confirm nothing loads the wrapper as a module (`.skilled`). Verify: `rg -n "require\(.*skill-advisor\.cjs" .skilled --glob '!**/node_modules/**'` prints nothing and exits 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the test file from `plan.md` and watch it fail (`.skilled/bin/tests/skill-advisor-node.test.cjs`). Verify: `node --test T` exits with a non-zero status.
- [x] T006 Add `nodeRecordPath` and `advisorNode`, guard the entrypoint and export the function (`.skilled/bin/skill-advisor.cjs`). Verify: `node --test T` reports `pass 4` and `fail 0`.
- [x] T007 Add the `postinstall` script (`.skilled/skills/system-skill-advisor/runtime/package.json`). Verify: `node -p "require('./.skilled/skills/system-skill-advisor/runtime/package.json').scripts.postinstall.includes('.advisor-node')"` prints `true`.
- [x] T008 Reinstall the runtime so the script writes the record (`.skilled/skills/system-skill-advisor/runtime/node_modules/.advisor-node`). Verify: after `npm ci --no-audit --no-fund` in `R`, `node -p "JSON.parse(require('fs').readFileSync('.skilled/skills/system-skill-advisor/runtime/node_modules/.advisor-node','utf8')).modules === process.versions.modules"` prints `true`.
- [x] T009 Rebuild the runtime after the manifest edit (`.skilled/skills/system-skill-advisor/runtime/dist`). Verify: `npm run build` in `R` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Repeat the cold start under Node 22 (`.skilled/bin/skill-advisor.cjs`). Verify: `COLD` exits 0.
- [x] T011 Stop the launcher T010 started (`.skilled/bin/system-skill-advisor-launcher.cjs`). Verify: after `pkill -f L`, `pgrep -f L` prints nothing and exits 1.
- [x] T012 Run every bin test (`.skilled/bin/tests`). Verify: `node --test .skilled/bin/tests/` reports `fail 0`.
- [x] T013 Run the advisor suite (`.skilled/skills/system-skill-advisor/runtime/tests`). Verify: `npx vitest run` in `R` exits 0 and fails no test that passed in `scratch/baseline.txt`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `COLD` exits 0 where it exited 75
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
