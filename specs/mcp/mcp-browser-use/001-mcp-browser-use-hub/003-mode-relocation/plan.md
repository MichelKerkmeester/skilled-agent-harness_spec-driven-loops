---
title: "Implementation Plan: Phase 3: mode-relocation"
description: "Move two packets with git-aware moves, unregister them from mcp-tooling, register them in the new hub and update the referencing files per the research split."
trigger_phrases:
  - "mode-relocation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: mode-relocation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, JSONL, YAML and CommonJS tests |
| **Framework** | Skill hub registries |
| **Storage** | None |
| **Testing** | Old-path `rg` pair, both per-hub checks, the mutation-class test with its new-hub case and the installer test |

### Overview
Widen the mutation-guard hub pattern, move two packets with `git mv` and no rename, unregister them from `mcp-tooling`, register them in the new hub, and handle each referencing file by its class: rewrite the path, regenerate the generated file, or leave the id or history alone. The classes come from `../001-research/research/iterations/iteration-011.md`; the cluster view is `../001-research/research/research.md` §6.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] `../001-research/research/research.md` section for this phase read and this spec refined from it (§6, §7, §11, plus `iteration-011.md`)
- [x] The operator has answered the sibling-packet question in `spec.md` section 10 (2026-11-21: no sibling edits)

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `rg -l 'mcp-tooling/mcp-(chrome|aside)-devtools' .skilled -g '!**/changelog/**' -g '!**/benchmark/reports/**'` and `rg -l 'mcp-(chrome|aside)-devtools' .skilled/skills/mcp-tooling/{mode-registry.json,hub-router.json,leaf-manifest.json,ROUTER.md,SKILL.md,README.md}` print nothing
- [ ] `bash .skilled/commands/doctor/scripts/tests/check-mcp-mutation-class.test.sh` exits 0 with a case for a script under `skills/mcp-browser-use/mcp-*`, and `node --test .skilled/bin/tests/mcp-installers.test.cjs` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mode move between hubs, ids unchanged

### Key Components
- **Two hub registries**: the source of truth both hubs read
- **Mutation guard**: the pre-commit hook regex and the guard's `HOOK_PATTERN` and `DISCOVERY_GLOBS`, which decide which MCP scripts are sent to the guard
- **Rewrite-path files**: eight live files that spell the old `mcp-tooling/` path; the doctor mutation-class manifest leads
- **Generated files**: rebuilt by their generators from the new tree, never hand-edited
- **Id-only files**: 22 outside files that name the ids as route labels or owners and need no edit under KQ5

### Data Flow
The doctor manifest is re-pointed and the hook and guard patterns widened first, so the guard sees the scripts the moment they land. Then registries change, then routers, then the packets move, then the other path rewrites land, then every generator runs against the new tree, then the tests and checks run.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-runs the Measured Behavior commands and diffs the result against `spec.md` section 3. Implementation runs in the order of the data flow above. Verification runs the old-path `rg` pair, both per-hub checks and both tests. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The old-path `rg` pair prints nothing; `parent-skill-check.cjs` exits 0 for both hub paths; `check-mcp-mutation-class.test.sh` and `mcp-installers.test.cjs` exit 0; `generate-leaf-manifest.cjs` and `generate-trigger-index.mjs` with `--check`, where they support it, report no drift.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`git`, `rg`, `jq` and `node`. Bulk path edits go to the mechanical executor and are reviewed by Opus, per the parent decisions.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: either hub check or either test fails after the move and cannot be fixed in three rounds. Restore the uncommitted tree with `git restore --staged --worktree` on the touched paths; the packets move back with them, and the 002 stubs return.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The change touches a shared doctor guard and test couplings, so the surfaces are named here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml` | Doctor mutation-class guard; owns `skill_dir` per MCP packet | update | `check-mcp-mutation-class.test.sh` exits 0 |
| `.skilled/scripts/git-hooks/pre-commit` and `check-mcp-mutation-class.sh` | Decide which MCP scripts reach the guard | update | the test's new `mcp-browser-use/` case passes |
| `.skilled/bin/tests/mcp-installers.test.cjs` | Enforces the byte-identical `_utils.sh` pair | update | `node --test` exits 0 |
| Advisor golden and labeled fixtures | Assert `mcp-chrome-devtools` as a route label | unchanged | ids unchanged; 005 replays them |
| `cli-orca` routing docs | Name the ids as foreign owners | unchanged | `git diff --stat` shows no change |
| `.claude`, `.opencode`, `.pi` skill mirrors | Symlinks into `.skilled/skills` | not a consumer | they follow the move |

Required inventories:
- Same-class producers: the three Measured Behavior `rg` commands in `spec.md`.
- Consumers of changed paths: `rg -n 'mcp-tooling/mcp-(chrome|aside)-devtools|mcp-tooling.*mcp-(chrome|aside)-devtools' .skilled` to catch `path.join` forms the literal pattern misses.
<!-- /ANCHOR:affected-surfaces -->


<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | 002-hub-scaffold complete | Implementation |
| Implementation | Setup inventory matches `spec.md` section 3 | Verification |
| Verification | Every generator has run on the final tree | 004-bladebro-mode |
<!-- /ANCHOR:phase-deps -->

---
