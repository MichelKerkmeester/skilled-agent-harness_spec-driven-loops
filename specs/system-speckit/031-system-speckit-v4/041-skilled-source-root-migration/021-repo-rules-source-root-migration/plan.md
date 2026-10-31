---
title: "Implementation Plan: Phase 21: repo-rules-source-root-migration"
description: "Move the rule corpus to .skilled/repo-rules in a rename-only commit, leave a tracked per-entry farm at the root, then re-point every live reference and make the corpus checker layout-aware."
trigger_phrases:
  - "repo rules source migration plan"
  - "phase 21 plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 21: repo-rules-source-root-migration

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS, bash, YAML |
| **Framework** | The `.skilled` source-root layout settled in phase 004 |
| **Storage** | Tracked symlinks, git history |
| **Testing** | The corpus checker, the markdown-link checker, the mirror gates, `check-gate-inputs.sh` |

### Overview

Reuse the shape phase 008 settled for `.opencode`: real files in `.skilled/`, a compatibility root
made of per-entry tracked symlinks. Move the 13 rule files, build the farm, re-point the router,
the backlinks and every live consumer, then make the skill-owned checker probe both layouts so it
stays portable to repositories without a `.skilled/` tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Dual-root with a canonical side. Real files live once, under `.skilled/`; the root path is a farm
of individual tracked symlinks, never one whole-directory link, because a directory link collapses
in the GitHub web view and degrades to a single text file in a clone without symlink support.

### Key Components

- `.skilled/repo-rules/` — the canonical corpus, 13 files.
- `repo-rules/` — 13 tracked symlinks, one per rule file, plus nothing else.
- `REPO RULES.md` — the router, at the repository root, because `AGENTS.md` Gate 5, the corpus
  checker's sentinel probe and the CI trigger filter all key on that path.
- `.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` — the corpus checker,
  made layout-aware.

### Data Flow

A consumer reads `repo-rules/<rule>.md` → the symlink resolves → `.skilled/repo-rules/<rule>.md`.
A reader who follows the canonical path reaches the same file directly. A router row resolves
inside the chosen rules directory, which is how the checker tells a rule row from any other link.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `repo-rules/*.md` | Canonical corpus | Move to `.skilled/repo-rules/`, leave the farm | `git log --follow` per rule, farm-integrity check |
| `REPO RULES.md` | Root router, 26 row links | Re-point rows | Checker checks 1, 2 and 9 |
| `AGENTS.md` | Universal template, 5 links | Re-point | `check-markdown-links.cjs` |
| Rule bodies | 13 backlinks to `../REPO%20RULES.md` | Re-point one level up | Checker check 7 |
| Checker | Hardcoded root layout | Probe both layouts | The 9/9 verdict in this repo and in a fixture with no `.skilled/` |
| Skill, command and playbook surfaces | Name the root path | Canonical path, portable wording | `check-markdown-links.cjs`, manual inspection |
| Agents and their mirrors | Authored plus generated copies | Edit the authored pair, regenerate the rest | Every `--check` exits 0 |
| CI filters and `GUARD` | Root path only | Canonical path added, root retained | `check-gate-inputs.sh` |
| Benchmark harness | Root path in both lanes | Historical lane keeps the root path at the base commit | The generator's own `--check` |

Required inventories:
- Every tracked file outside `specs/` that names `repo-rules`: the phase's rescan, with a
  disposition per remaining hit.
- Every generated mirror whose source names the path: the `--check` runs on both sides of the change.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase
checkboxes and task state. The procedures those tasks run are below.

### 5.1 Shared Variables

```bash
W=/Users/michelkerkmeester/worktrees/public/056-repo-rules-source-root-migration
P=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
PKT=specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/021-repo-rules-source-root-migration
ARCH="$PKT/scratch/baseline"
```

### 5.2 Layout Decision

Frozen by the operator's answer, with the rejected alternatives recorded.

| Question | Answer | Rejected alternative |
|----------|--------|----------------------|
| Canonical home | `.skilled/repo-rules/` | Keep the corpus at the root and make `.skilled` the compat side |
| Root path | 13 per-entry tracked symlinks | One whole-directory symlink (collapses in the GitHub web view); deleting the root path (breaks three sibling repositories) |
| Router | `REPO RULES.md` stays at the repository root | Move it under `.skilled` (Gate 5, the checker sentinel and the CI filter all key on the root file) |
| `AGENTS.md` links | Canonical path | Root path (they are a reader surface, not a compatibility surface) |
| Checker portability | Probe both directories, canonical preferred | Hardcode `.skilled/repo-rules` (breaks the documented plain-`repo-rules/` layout) |

### 5.3 Move Procedure

```bash
cd "$W"
git mv repo-rules/*.md .skilled/repo-rules/          # rename-only commit
for f in .skilled/repo-rules/*.md; do
  n=$(basename "$f"); ln -s "../.skilled/repo-rules/$n" "repo-rules/$n"; git add "repo-rules/$n"
done                                                  # farm commit, same unit as the move
```

`git log --follow` must still walk each rule's history after the move. A rename-only commit keeps
that, and the farm entries are new files, not renames.

### 5.4 Checker Contract

The checker resolves its rules directory by probing `.skilled/repo-rules` and then `repo-rules`, and
fails with both probed paths named when neither exists. Router rows are identified by resolving each
link and requiring it to land inside the chosen rules directory, not by string prefix. The nine
checks and their output format stay unchanged, so the phase's claim is a verdict delta on the same
instrument.

### 5.5 Verification Commands

```bash
cd "$W"
node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs
bash .github/scripts/check-gate-inputs.sh
node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs
bash "$PKT/scratch/verify.sh"                          # farm integrity, rescan, derivation freshness
```
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The checker's dual-root probe and router-row resolution | The portability fixture |
| Integration | Farm integrity, router links, rule-body links | The corpus checker, `check-markdown-links.cjs` |
| Manual | A sibling repository still resolves its rules after merge | `ls -L` in each sibling, by the operator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 008's compatibility shape | Internal | Settled | The farm shape would be re-decided |
| The three sibling repositories' checkout layouts | External | Live | The farm is what keeps them resolving; no write is made there |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A consumer that cannot resolve a rule file, or a checker that reports a new failure.
- **Procedure**: `git revert` the phase commits, or delete the farm and move the files back with
  `git mv`; the rule files return to `repo-rules/` with their history intact.
- **Reversibility**: Every step is a commit on one branch, so no step is irreversible.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (worktree, baselines, packet) ──► Research (cited consumer census) ──► Build (move, farm,
references, checker, mirrors, CI) ──► Verify (checker, portability, farm, gates, frozen set)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Research |
| Research | Setup | Build |
| Build | Research | Verify |
| Verify | Build | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Research | Low | Half a day, one bounded loop |
| Build | Med | One day |
| Verify | Low | Half a day |
| **Total** | | **About two days** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baselines recorded from the clean worktree
- [ ] The frozen-set digest recorded at the phase base commit
- [ ] Rollback steps read by the operator

### Rollback Procedure
1. Revert the phase commits, or delete the farm and `git mv` the files back.
2. Rerun the corpus checker and confirm it returns to its HEAD baseline.
3. Confirm the sibling repositories still resolve, since they were never written to.
4. No notice is needed unless a consumer resolution changed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
