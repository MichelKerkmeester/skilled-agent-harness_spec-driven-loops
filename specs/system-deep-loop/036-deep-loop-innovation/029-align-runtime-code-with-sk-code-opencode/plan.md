---
title: "Implementation Plan: Phase 29: align system-deep-loop runtime code with sk-code-opencode"
description: "Build the checker flags, the ARCHITECTURE template and a DeepSeek loop driver, then run the loop over the deep-loop runtime one file or folder per brief, with a comment-only diff filter, typecheck and checker after each batch."
trigger_phrases:
  - "deepseek alignment loop driver"
  - "comment-only diff filter"
  - "one file per brief loop"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 29: align system-deep-loop runtime code with sk-code-opencode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and CommonJS runtime; Python checker; bash loop driver |
| **Framework** | Node.js, vitest |
| **Storage** | None; loop state is a plain-text done list in `scratch/` |
| **Testing** | vitest suite per runtime, `pytest` for the checker, `tsc --noEmit` per batch |

### Overview
Prerequisites first: the checker learns to see section and README drift, sk-create-readme gains an ARCHITECTURE template, and a bash driver runs DeepSeek V4.1 Flash at `high` through cli-pi one small brief at a time. The driver keeps a batch only when its diff touches comments alone and the typecheck and checker pass. The same driver then serves the skill-advisor and spec-kit packets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (census counts recorded in spec.md)
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] vitest pass count equals the pre-edit baseline
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Orchestrator plus cheap leaf workers. Opus builds the prerequisites and verifies; DeepSeek does the repetitive comment and README edits; SWE-2 MAX through cli-devin fact-checks every folder-merge claim before anything moves.

### Key Components
- **Checker flags**: `--check-sections` and `--check-folders` on `verify_alignment_drift.py`, the loop's done signal and the permanent guard.
- **ARCHITECTURE template**: in `sk-create-readme/assets/`, lifted from the shared 8-section skeleton (OVERVIEW, PACKAGE TOPOLOGY, CANONICAL FLOWS, RUNTIME SUBSYSTEMS, HOOK AND PLUGIN INTEGRATION, ENFORCEMENT AND VERIFICATION, DECISION RECORDS, RELATED).
- **Loop driver**: `scratch/align-loop.sh <runtime-root> <mode>` where mode is `header`, `sections` or `readme`.

### Data Flow
1. The driver asks the checker for the failing files or folders in one mode.
2. For each target not in `scratch/done-<mode>.txt`, it sends one brief:
   - `header`: "In <file>, add the MODULE header block from the template below as the first lines, after any shebang. Change nothing else."
   - `sections`: "In <file>, add numbered section dividers in Format A from the template below around the existing code, in the standard order. Replace any other divider style. Change no code line."
   - `readme`: "Create <folder>/README.md from the code README template below, describing only the files in that folder."
3. Each brief inlines the template text and the child-dispatch preamble, and runs as `pi -p --model opencode-go/deepseek-v4.1-flash --thinking high --offline --mode text </dev/null`, with `PI_BLACKHOLE_PASSIVE=true AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0`.
4. Checks: every added or removed line in `git diff` is a comment or blank line (for `header` and `sections`); `tsc --noEmit` for the owning package; the checker in that mode on the target.
5. Pass: append the target to the done list. Fail: `git checkout -- <target>` and log the reason.
6. Every 25 kept edits the package typecheck runs, and the full vitest suite runs once when the mode finishes; a failure or a count below baseline stops the loop. Deviation from the first plan, which ran the suite every 25: the supervised run showed about 20 seconds per edit against 22 minutes per deep-loop suite, and the per-file comment-only proof already rules out behavior change.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The checker flags get a passing and a failing fixture each in `test_verify_alignment_drift.py`. The loop is tested by its own gates: the diff filter, the typecheck, the checker and the periodic vitest run against the recorded baseline.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`pi` on PATH with the `opencode-go` credential; `cline-pass/cline-pass/deepseek-v4.1-flash` at `--thinking xhigh` as fallback when opencode-go reports a quota error. `devin` on PATH for the SWE-2 MAX fact-check.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each batch is a single-file diff and is reverted on failure by the driver. Nothing is committed during the loop; the whole run is undone with `git checkout -- <runtime-root>` until it is committed.
<!-- /ANCHOR:rollback -->

---


<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `verify_alignment_drift.py` | Shared drift checker for every skill | Add two opt-in flags; default path unchanged | Default-mode output diffed before and after on all three runtimes |
| Runtime source files | Executed code | Comment-only edits | Diff filter plus `tsc --noEmit` per batch |
| Folder merges | Import paths | Move and rewrite importers, CONFIRMED rows only | `rg` for the old path returns nothing; vitest at baseline |

Required inventories:
- Consumers of a moved folder: `rg -n '<folder-name>' .skilled/skills/<skill>` over code, `package.json`, `tsconfig*.json`, vitest configs and `.md` links.
<!-- /ANCHOR:affected-surfaces -->


<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Checker flags ──┐
Template ───────┼──► Loop on deep-loop ──► Merges ──► ARCHITECTURE.md
Loop driver ────┘         │
                          └──► unblocks skill-advisor 031 and spec-kit 046
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Prerequisites | None | Every loop |
| Deep-loop loop | Prerequisites | Merges |
| Merges | Fact-check, loop | ARCHITECTURE.md topology |
| Verify | All | None |
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Prerequisites | Med | Opus-built; checker flags carry most of the risk |
| Core loop | Low per target | About 210 DeepSeek briefs on this runtime (131 header, 68 sections, 9 README), plus re-runs |
| Verification | Low | Checker, tsc, vitest |
| **Total** | | **Dominated by the loop's brief count** |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] vitest baseline recorded for each runtime before the first edit
- [ ] Checker default-mode output captured before the flag change

### Rollback Procedure
1. Stop the driver.
2. `git checkout -- <runtime-root>` for uncommitted work, or `git revert` the loop commit.
3. Rerun vitest and confirm the baseline count.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
