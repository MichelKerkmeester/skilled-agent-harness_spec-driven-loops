---
title: "Tasks: Phase 15: hook-suite-job-split"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hook suite job split tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: hook-suite-job-split

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

Two shell variables keep the verify commands short. Set both from the repository root before running a task: `W=.github/workflows` and `H=.github/workflows/hook-vitest-suites.yml`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the guard workflow owns two jobs before the split (`$W/dispatch-enforcement-guard.yml`). Verify: `node -e "const Y=require('./.skilled/node_modules/yaml'),fs=require('fs');console.log(Object.keys(Y.parse(fs.readFileSync(process.argv[1],'utf8')).jobs).join(','))" "$W/dispatch-enforcement-guard.yml"` prints `dispatch-enforcement-guard,hooks-vitest`.
- [ ] T002 Confirm the hook vitest command lives in one workflow before the split (`$W`). Verify: `rg -l 'hooks/vitest\.config\.ts' "$W"` prints `.github/workflows/dispatch-enforcement-guard.yml`.
- [ ] T003 Confirm the workflow file count before the split (`$W`). Verify: `ls "$W"/*.yml | wc -l` prints `32`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Create the new workflow with `name: Hook Vitest Suites`, a copy of the guard file's `on`, `permissions`, `concurrency` and `env` blocks, and the `hooks-vitest` job moved verbatim (`$H`). Verify: `node -e "const Y=require('./.skilled/node_modules/yaml'),fs=require('fs');const d=Y.parse(fs.readFileSync(process.argv[1],'utf8'));console.log(d.name,Object.keys(d.jobs).join(','))" "$H"` prints `Hook Vitest Suites hooks-vitest`.
- [ ] T005 Remove the `hooks-vitest` job and keep the dispatch job, its comments and the workflow-level blocks (`$W/dispatch-enforcement-guard.yml`). Verify: `node -e "const Y=require('./.skilled/node_modules/yaml'),fs=require('fs');console.log(Object.keys(Y.parse(fs.readFileSync(process.argv[1],'utf8')).jobs).join(','))" "$W/dispatch-enforcement-guard.yml"` prints `dispatch-enforcement-guard`.
- [ ] T006 [P] Add the new file to the contents table, the push-versus-pull-request coverage table and the `SKILLED_CI_FRESHNESS` row (`$W/README.md`). Verify: `rg -c 'hook-vitest-suites\.yml' "$W/README.md"` prints `3`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Confirm the new workflow kept the guard's triggers and workflow-level blocks and the job condition (`$H`). Verify: `node -e "const Y=require('./.skilled/node_modules/yaml'),fs=require('fs');const g=Y.parse(fs.readFileSync(process.argv[1],'utf8')),h=Y.parse(fs.readFileSync(process.argv[2],'utf8'));const blocks=['on','permissions','concurrency','env'].map(k=>JSON.stringify(g[k])===JSON.stringify(h[k])?k+'-same':k+'-DIFF');console.log(blocks.join(' '),g.jobs['dispatch-enforcement-guard'].if===h.jobs['hooks-vitest'].if?'switch-same':'switch-DIFF')" "$W/dispatch-enforcement-guard.yml" "$H"` prints `on-same permissions-same concurrency-same env-same switch-same`.
- [ ] T008 Confirm the run line is byte-identical to the measured baseline (`$H`). Verify: `rg -c -F 'run: .skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts' "$H"` prints `1`.
- [ ] T009 Confirm the hook vitest command appears in exactly one workflow (`$W`). Verify: `rg -l 'hooks/vitest\.config\.ts' "$W"` prints one line, `.github/workflows/hook-vitest-suites.yml`.
- [ ] T010 Confirm both workflow files parse and the directory carries no drift flag (`$W`). Verify: `node .skilled/commands/doctor/scripts/ci-report.cjs --json --no-gh | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const r=JSON.parse(s);console.log(r.workflowCount,r.errors.length,r.workflows.flatMap(w=>w.flags).length)})"` prints `33 0 0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/006-test-cycle-speed/015-hook-suite-job-split --strict --quiet` prints `RESULT: PASSED`
- [ ] `implementation-summary.md` names the three changed files and the two proof commands
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
