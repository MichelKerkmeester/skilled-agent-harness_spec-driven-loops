---
title: "Implementation Plan: Phase 1: goal-inventory-and-mode-contract"
description: "This read-only phase turns the goal-system and mode-anatomy audits into a measured corpus report and a source-backed authoring contract. It uses the existing goal CLI for file measurements and records five analysis artifacts without changing skill files."
trigger_phrases:
  - "goal inventory plan"
  - "goal corpus measurement"
  - "goal ownership contract"
  - "goal defect reproduction commands"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: goal-inventory-and-mode-contract

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Bash, and the existing Node.js goal CLI (`.skilled/hooks/goal/bin/goal.cjs:203-216`) |
| **Framework** | None; the phase records evidence and decisions. |
| **Storage** | Existing repository files and five phase analysis artifacts (`specs/sk-doc/060-create-goal-mode/spec.md:121-129`). |
| **Testing** | `find`, `rg`, `awk`, `goal.cjs packet`, and strict `validate.sh`. |

### Overview
The phase enumerates every non-archive `goal.md`, measures each packet through `goal.cjs packet`, and reproduces the defect examples named by the audit (`.skilled/hooks/goal/bin/goal.cjs:203-216`; `specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:37,41-45`). It then records the goal anatomy, owner boundary, decision tests, checker decision, and mode target tree, following the inventory-to-contract pattern from 040 phase 002 (`specs/sk-doc/z_archive/040-create-repo-rules/002-inventory-and-skill-contract/decision-tests.md:17-23`; `specs/sk-doc/z_archive/040-create-repo-rules/002-inventory-and-skill-contract/mode-boundary.md:22-42`; `specs/sk-doc/z_archive/040-create-repo-rules/002-inventory-and-skill-contract/rule-anatomy.md:45-78`; `specs/sk-doc/z_archive/040-create-repo-rules/002-inventory-and-skill-contract/target-tree.md:30-69`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The frozen parent scope, D1-D6, both audits, and the goal contract sources are available (`specs/sk-doc/060-create-goal-mode/spec.md:90-99,119-143`; `specs/sk-doc/060-create-goal-mode/goal.md:49-54`).
- [ ] The five output paths are fixed in `spec.md` and no skill-file edits are planned (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/spec.md:68-85`).
- [ ] The goal CLI invocation is known to accept a packet directory and workspace (`.skilled/hooks/goal/bin/goal.cjs:203-216`).

### Definition of Done
- [ ] The five analysis artifacts exist and answer the phase requirements.
- [ ] Each in-scope goal path has a recorded `goal.cjs packet` result, and each audit-cited defect has a reproduction command and output (`specs/sk-doc/060-create-goal-mode/spec.md:138-143`).
- [ ] The mode boundary resolves the conformance-check question against D4 and the strict phase validator passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only source inventory followed by evidence-backed contract decisions.

### Key Components
- **Goal source set**: Template, slice helper, CLI, validator, phase scaffold, playbook, and plan workflow define the current contract and behavior (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:46-105`; `.skilled/hooks/goal/lib/goal-slice.cjs:52-118`; `.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080`; `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1275-1335`; `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-123`; `.skilled/commands/speckit/assets/speckit-plan.yaml:177-200`).
- **Five analysis artifacts**: `decision-tests.md`, `goal-anatomy.md`, `goal-corpus-audit.md`, `mode-boundary.md`, and `target-tree.md` carry the future phase outputs.

### Data Flow
The `find` census supplies packet directories to `goal.cjs packet`; commands and manual review classify the captured results; the five artifacts record measured evidence, ownership decisions, and the proposed tree. The CLI emits packet size, budget, hash, objective slice, and chat slice (`.skilled/hooks/goal/bin/goal.cjs:203-216`).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is not a code fix. These are the source surfaces it reads and the planned action for each.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Goal template and renderer | Define goal sections and level variants | Read only; include in `goal-anatomy.md` | `nl -ba .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl`; source range `:46-128` |
| Goal slice helper and CLI | Produce durable, chat, and objective projections and report packet size | Read only; measure goals with `packet` | `nl -ba .skilled/hooks/goal/lib/goal-slice.cjs`; `node .skilled/hooks/goal/bin/goal.cjs packet <packet-directory> --workspace "$PWD"` |
| Validator and phase scaffold | Enforce budget/listed binding targets and scaffold parent/child docs | Read only; record gaps for owner decision | `nl -ba .skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts`; `nl -ba .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` |
| Goal hooks and host command | Own runtime binding, injection, and session objective handling | Read only; do not mutate runtime state | `.skilled/hooks/goal/bin/goal.cjs:153-173,203-216,233-246`; `.skilled/commands/speckit/assets/speckit-plan.yaml:182-200` |
| `sk-create-goal` | Own packet-file authoring decisions and content | Define boundary only; do not build mode files in this phase | Parent scope: `specs/sk-doc/060-create-goal-mode/spec.md:90-99` |

The code-fix inventories do not apply because this phase changes no producer, consumer, or shared contract. Preserve the source-to-owner map and cite the exact evidence instead.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Command census | Every non-archive goal file and its goal projection | `find` loop and `node .skilled/hooks/goal/bin/goal.cjs packet` |
| Defect reproduction | Each concrete corpus defect cited by the audit | `goal.cjs packet`, `rg -nF`, `awk`, and `find` |
| Source trace | Goal structure, slices, owner responsibilities, and phase scaffold | `nl -ba` and cited `path:line` ranges |
| Document validation | Six current phase planning documents | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract --strict` |

Run the census and one `packet` report per file:

```bash
set -o pipefail
find specs -type f -name goal.md ! -path '*/z_archive/*' -print0 |
while IFS= read -r -d '' file; do
  printf '\n--- %s ---\n' "$file"
  node .skilled/hooks/goal/bin/goal.cjs packet "${file%/goal.md}" --workspace "$PWD" || exit 1
done
```

Reproduce the cited examples with exact text searches and packet measurements:

```bash
node .skilled/hooks/goal/bin/goal.cjs packet specs/sk-git/028-crawlable-commit-history --workspace "$PWD"
node .skilled/hooks/goal/bin/goal.cjs packet specs/sk-design/019-sk-design-diagram-upgrade --workspace "$PWD"
rg -n 'Objective:.*One sentence.*Not how.*progress' specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/030-mutation-suite/goal.md
rg -nF 'Every phase reports its acceptance criteria closeable' specs/system-speckit/033-system-speckit-v4/010-goal-file-addon/goal.md
rg -n 'all six children|^\| 00[1-8] \|' specs/sk-git/028-crawlable-commit-history/goal.md
rg -n '007' specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/spec.md specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/goal.md
find specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission -type f -path '*/007-*/goal.md' -print
```

Count completion bullets in each goal to classify values outside three to seven:

```bash
set -o pipefail
find specs -type f -name goal.md ! -path '*/z_archive/*' -print0 |
while IFS= read -r -d '' file; do
  awk '/<!-- ANCHOR:completion -->/{inside=1;next}/<!-- \/ANCHOR:completion -->/{inside=0} inside && /^- \[[ x]\] /{n++} END{printf "%s\t%d\n", FILENAME, n+0}' "$file"
done
```
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parent scope and D1-D6 | Internal source | Available | Stop if local interpretation conflicts with a frozen decision (`specs/sk-doc/060-create-goal-mode/goal.md:49-54`). |
| Two audits and goal source set | Internal source | Available for review | Mark missing or unverified claims UNKNOWN; do not infer corpus totals (`specs/sk-doc/060-create-goal-mode/spec.md:164-168`). |
| `goal.cjs packet` | Existing CLI | Available | Record command and exit status; do not present a substitute metric as CLI output (`.skilled/hooks/goal/bin/goal.cjs:203-216`). |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A planned command writes outside the five phase analysis artifacts, or a report cannot be reconciled to its cited source or command output.
- **Procedure**: Stop that command. Verify the exact path it created, remove only that unaccepted phase-produced artifact, preserve source audits and scaffolds, then rerun the affected read-only command. Record the deviation in the relevant report; do not edit `.skilled/` (`specs/sk-doc/060-create-goal-mode/spec.md:90-99`).
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Inventory and contract) ──────► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Inventory and contract |
| Inventory and contract | Setup | Verification |
| Verification | Inventory and contract | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Not estimated; no duration evidence. |
| Corpus inventory and contract | High | Not estimated; the complete goal corpus has not been measured in this planning dispatch. |
| Verification | Medium | Not estimated; command count is an execution result. |
| **Total** | | **Not estimated.** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Source line citations are reopened before handoff.
- [ ] Output paths are confirmed inside the phase folder.
- [ ] No mode, hook, host-command, or system-spec-kit edit is included (`specs/sk-doc/060-create-goal-mode/spec.md:90-99`).

### Rollback Procedure
1. Stop the unexpected writer and capture its command, path, output, and exit status.
2. Remove only the unaccepted artifact that command created after verifying its exact path.
3. Rerun the read-only census or source command that preceded the write.
4. Confirm the five planned artifacts and frozen source paths are the only phase outputs.

### Data Reversal
- **Has data migrations?** No; the phase is read-only against runtime state and source files (`specs/sk-doc/060-create-goal-mode/spec.md:90-99`).
- **Reversal procedure**: Not applicable; no data is written.
<!-- /ANCHOR:enhanced-rollback -->

---
