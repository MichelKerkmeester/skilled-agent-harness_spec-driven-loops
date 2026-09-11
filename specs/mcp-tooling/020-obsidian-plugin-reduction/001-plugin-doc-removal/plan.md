---
title: "Implementation Plan: Phase 1: plugin-doc-removal"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: plugin-doc-removal

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->

## 1. SUMMARY

Delete every file that belongs exclusively to one of the twelve removed plugins, across four
surfaces of `.opencode/skills/mcp-tooling/mcp-obsidian/`: the reference doc sets, the example assets, the feature-catalog entries and
the manual-testing-playbook tie-ins. Seventy-nine files in total.

The deletion list is frozen in `spec.md` §3 and is not to be re-derived. Deleting by explicit path
is the whole method; a wildcard over `references/plugins/*` would take the retained sets with it.

No surviving file is edited here. Phase 2 owns the reconciliation, so this phase deliberately ends
with dangling references in `SKILL.md`, `README.md` and the two indexes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->

## 2. QUALITY GATES

| Gate | Command | Passing condition |
|------|---------|-------------------|
| Retained sets intact | `ls references/plugins/` | prints exactly `health-md`, `iconic`, `installed-plugins.md`, `plugin-operation-logic.md` |
| Deletion count | `git status --porcelain -- <mode>` | 79 lines, every one a deletion |
| No collateral edits | `git status --porcelain -- <mode> \| grep -v '^ D'` | empty |
| Theme surface intact | `test -f feature-catalog/plugins/theme-system.md` | exit 0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->

## 3. ARCHITECTURE

The mode stores each dedicated plugin across four parallel surfaces, and a plugin is only fully
removed when all four are:

| Surface | Path shape | Per plugin |
|---------|-----------|-----------|
| Reference doc set | `references/plugins/<plugin>/` | 4 files: index, data-model, workflows, troubleshooting |
| Example assets | `assets/plugins/<plugin>/` | 0-3 files; only 7 plugins have any |
| Feature catalog | `feature-catalog/plugins/<plugin>.md` | 1 file |
| Testing playbook | `manual-testing-playbook/plugin-tie-ins/<scenario>.md` | 1-2 files, named per scenario rather than per plugin |

The playbook is the asymmetric one: its files are named after scenarios, so Notion Bases owns two
(`notion-bases-dataview-install.md`, `notion-bases-relation-rollup.md`) and the mapping cannot be
derived from the plugin name alone. `spec.md` §3 lists them literally for that reason.

Root: `.opencode/skills/mcp-tooling/mcp-obsidian/`
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->

## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Owner | Contract that must not break |
|---------|-------|------------------------------|
| `references/plugins/` | this mode | Iconic and Health.md doc sets stay byte-identical |
| `assets/plugins/` | this mode | Iconic and Health.md example assets stay |
| `feature-catalog/` | this mode | `theme-system.md` stays; the index is phase 2's problem |
| `manual-testing-playbook/` | this mode | `theme-activation.md`, `iconic-rules.md`, `health-md-data.md` stay |
| `../leaf-manifest.json` | the hub | Left stale on purpose; phase 3 reconciles it |

Callers left temporarily broken, all reconciled in phase 2: `SKILL.md` §2 resource map, `README.md`
plugin table, `feature-catalog/FEATURE-CATALOG.md`, `manual-testing-playbook/manual-testing-playbook.md`,
`references/notion-migration.md`, `assets/workflows.md`, `references/plugins/installed-plugins.md`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->

## 4. IMPLEMENTATION PHASES

1. **Record the baseline.** Capture `ls references/plugins/`, the file count under the mode, and
   `git status --porcelain` before any deletion.
2. **Delete the twelve reference doc sets** by explicit path.
3. **Delete the five asset directories and the BRAT root asset** by explicit path.
4. **Delete the eleven feature-catalog entries** by explicit path.
5. **Delete the eleven playbook tie-ins** by explicit path.
6. **Assert the retained set**, then re-run the baseline commands and diff against step 1.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->

## 5. TESTING STRATEGY

There is no test suite for a documentation tree, so the proof is filesystem assertion plus the
git diff. Three checks, all run from the final state:

- `ls references/plugins/` matches the expected four entries exactly.
- `git status --porcelain -- <mode>` contains 79 entries and every line starts with a deletion marker.
- The two retained doc sets still hold four files each, and their content is unchanged in the diff.

The negative control is cheap and worth running: before deleting, confirm `ls references/plugins/`
prints fourteen directories. A post-state that matches the expectation is only meaningful if the
pre-state did not.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->

## 6. DEPENDENCIES

| Dependency | Type | Why |
|------------|------|-----|
| git working tree | tooling | The rollback path, and the evidence surface for what changed |
| None else | - | The phase touches no runtime, no build, no package |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->

## 7. ROLLBACK PLAN

To undo this phase: `git restore -- .opencode/skills/mcp-tooling/mcp-obsidian/`

Every deleted file is tracked and committed, so the restore is complete and needs no backup copy.
If the phase is already committed, `git revert <sha>` is the equivalent.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->

## L2: PHASE DEPENDENCIES

| Phase | Depends on | Blocks | Parallelizable |
|-------|-----------|--------|----------------|
| 001 plugin-doc-removal | nothing | 002, 003 | no |
| 002 skill-surface-reconciliation | 001 | 003 | no |
| 003 hub-routing-and-validation | 002 | nothing | no |

The chain is strictly serial. Phase 2 rewrites documents that describe the file set phase 1
produces, and phase 3 validates the whole tree, so neither can start early on partial state.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->

## L2: EFFORT ESTIMATION

| Work item | Size | Note |
|-----------|------|------|
| Delete 79 files by explicit path | S | Mechanical; the list is frozen in spec.md |
| Baseline capture and post-state assertion | S | Four commands |
| **Total** | **S** | The risk is in precision, not in volume |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->

## L2: ENHANCED ROLLBACK

| Trigger | Detection | Action |
|---------|-----------|--------|
| A retained doc set went missing | `ls references/plugins/` lacks `iconic` or `health-md` | `git restore -- <path>`, then re-run the phase from the frozen list |
| A theme file went missing | `test -f feature-catalog/plugins/theme-system.md` fails | `git restore -- <path>` |
| Deletions outside the mode | `git status --porcelain` shows paths outside the mode root | `git restore` those paths; nothing outside the mode is in scope |
| The whole phase is wrong | any of the above repeats | `git restore -- .opencode/skills/mcp-tooling/mcp-obsidian/` and stop |

No step here is irreversible while the work is uncommitted, and it stays reversible by revert once
committed.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->

## L3: DEPENDENCY GRAPH

```
001-plugin-doc-removal
  |  produces: the reduced file set
  v
002-skill-surface-reconciliation
  |  produces: documents that describe the reduced file set truthfully
  v
003-hub-routing-and-validation
     produces: hub routing that carries no removed vocabulary, plus gate evidence
```

Nothing outside the packet depends on phase 1's output, and phase 1 depends on nothing.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->

## L3: CRITICAL PATH

The critical path is the whole packet, since the three phases are serial. Within this phase the
path is: baseline capture, four deletion batches, assertion. The only step that can invalidate the
rest is the baseline capture, because without a pre-state the post-state assertions prove nothing.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->

## L3: MILESTONES

| Milestone | Definition of done |
|-----------|--------------------|
| M1 baseline recorded | Pre-state listing and file count captured |
| M2 deletions applied | All four surfaces processed from the frozen list |
| M3 assertions pass | Retained set intact, 79 deletions, no modifications |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD


**ADR-001: Delete by explicit path, never by wildcard.**

*Context.* The retained and removed doc sets are siblings under one directory, distinguished only
by name.

*Decision.* Every deletion names its path literally, taken from the frozen list in `spec.md` §3.

*Consequence.* The command is long and repetitive, and it cannot take a retained set by accident.
A wildcard would be shorter and would put the whole phase one typo away from deleting Iconic.

**ADR-002: Leave dangling references for phase 2.**

*Context.* Deleting a doc set breaks every document that links to it.

*Decision.* This phase deletes only. It does not edit surviving files to keep them consistent.

*Consequence.* The tree is knowingly inconsistent between phases 1 and 2. The alternative, editing
as we delete, mixes two failure modes in one diff and makes the deletion set unreviewable.


---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] `spec.md` §3 read; the scope is the frozen list, not one re-derived at run time
- [ ] The negative control captured, so a passing check afterwards carries information
- [ ] The rollback sentence in §7 is real and runnable before the first mutation

### Task Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Work the tasks in order. Later tasks assume earlier ones landed. |
| TASK-SCOPE | Touch only the paths named in `spec.md` §3. Anything else is recorded, not fixed. |
| TASK-EVIDENCE | A task is done when a command's output was read, never when it was launched. |
| TASK-HALT | Stop on any mismatch between a named path and what is on disk. Report it. |

### Status Reporting Format

Report per task: the task id, the command run, what it printed, and the resulting state. Not
"done". A count, a path listing, or an exit status that was actually read.

### Blocked Task Protocol

When a task cannot proceed: stop at that task, leave the tree in its current state, and report
the task id, the exact command, its output, and what would unblock it. Do not skip ahead to a
later task, and do not substitute a different approach for a named one without saying so.
