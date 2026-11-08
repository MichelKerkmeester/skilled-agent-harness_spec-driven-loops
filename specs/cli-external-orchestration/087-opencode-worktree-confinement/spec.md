---
title: "Feature Specification: Keep cli-opencode workers inside the git worktree they are started in"
description: "An OpenCode 2 worker started inside a linked git worktree read and wrote files in the main checkout instead. This packet finds why and makes a worktree start stay in the worktree."
trigger_phrases:
  - "opencode worktree confinement"
  - "keep cli opencode workers inside the git worktree"
  - "opencode worker wrote into the main checkout"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Keep cli-opencode workers inside the git worktree they are started in

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-08 |
| **Branch** | `worktrees/324-overlay-repin-barter-parity` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An OpenCode 2 worker started inside a linked git worktree read and wrote files in the main checkout instead. The cli-opencode skill counts a fresh worktree as a containment layer (its rule 16, layer L2), so a worker that leaves the worktree breaks that layer without any warning and can edit the operator's live tree.

### Purpose
A worker started in a linked worktree reads and writes only inside that worktree, and the skill documents only containment that a test has shown to hold.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Four DeepSeek V4.1 Flash workers ran on 2026-11-08, one at a time, each spawned from Node with `cwd` set to the worktree `/Users/michelkerkmeester/worktrees/public/324-overlay-repin-barter-parity`, using `opencode run --standalone -m opencode-go/deepseek-v4.1-flash#max --format json`, with stdin closed, against OpenCode `v2.2.5`. The main checkout is `/Users/michelkerkmeester/MEGA/Development/Skilled`. Tool-call paths counted from each worker's JSON event stream:

```text
w1  main paths 8 read, 1 workdir   worktree paths 18 read, 11 workdir   writes to main: 0
w2  main paths 9 read, 19 workdir  worktree paths 6 read, 5 workdir     writes to main: 0
w3  first tool call: read /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/commands/doctor/assets/doctor-overlay-repin.yaml
    writes to main: edit doctor-overlay-repin.yaml x3, edit doctor-overlay-apply.yaml x1
w4  every path under the worktree (its prompt named the absolute worktree root and forbade the main path)
```

The w3 prompt contains the main path zero times (`grep -c "MEGA/Development/Skilled" w3.prompt.txt` prints `0`). `opencode debug config --standalone` with `cwd` at the worktree lists only worktree paths, whether `PWD` is set to the main checkout or to the worktree, so an inherited `PWD` is not the cause. The binary was run directly, not through the `opencode` shell function. The w3 edits were moved to the worktree with `git apply` and reversed in main with `git apply -R`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Find where OpenCode 2 gets the main checkout path for a session started in a linked worktree. The leading hypothesis is that it resolves the project through `git rev-parse --git-common-dir` and gives the model that checkout as its root.
- Write a repeatable probe that starts a worker in a throwaway linked worktree and reports every tool path outside it.
- Fix the dispatch shape so a worktree start stays in the worktree, with an OpenCode flag or setting if one exists, or with an absolute-root line that the shared child-dispatch preamble always carries.
- Correct cli-opencode's rule 16 layer L2 so it claims only the containment the probe shows.

### Out of Scope
- Patching OpenCode itself. The fix is on the dispatch side. A defect upstream gets reported, not forked.
- Other cli runtimes. Each runtime gets checked by its own packet if the probe shows the same leak.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Rule 16 layer L2 and the dispatch shape state the confinement that holds |
| `.skilled/skills/cli-external-orchestration/shared/references/child-dispatch-preamble.md` | Modify | Carries the absolute repository root if the probe shows it is needed |
| `.skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md` | Modify | The worktree dispatch pattern names the fix |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A probe reproduces the leak | Started in a throwaway linked worktree with the current dispatch shape, the probe prints each tool path outside the worktree and exits 1 when there is one |
| REQ-002 | The fixed dispatch shape stays inside | The same probe with the fixed shape prints no outside path and exits 0, on three runs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The skill claims only proven containment | `rg -n "L2" .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` shows a layer that names the fix and the probe |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The probe with the current shape reports at least one main-checkout path, which confirms the leak is reproduced and not a one-off.
- **SC-002**: The probe with the fixed shape reports zero outside paths on three runs.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | An OpenCode provider with credit (`opencode-go` today) | No probe runs without one | Use the cheapest model on any working route. The probe needs paths, not quality |
| Risk | The probe writes into the main checkout while reproducing the leak | High | The probe task only reads, and it runs with permissions on, without `--dangerously-skip-permissions` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does OpenCode 2 offer a flag or setting that fixes the project root to the start directory? If it does, the fix is that flag. If not, it is the preamble line.
<!-- /ANCHOR:questions -->

---
