---
title: "Implementation Plan: Phase 2: skill-surface-reconciliation"
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
# Implementation Plan: Phase 2: skill-surface-reconciliation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->

## 1. SUMMARY

Rewrite the nine documents that describe the plugin surface so they match what phase 1 left on
disk, and add a changelog entry.

The load-bearing work is in `SKILL.md` §2. Its router holds twenty-two intents, a resource map
keyed by those intents, a tuple listing which intents count as plugin-specific, and a comment
stating how many intents exist. All four move together: an intent removed from one and left in
another produces a route that scores, wins, and loads nothing.

Everything else is prose that enumerates plugins, in known places listed in `spec.md` §3.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->

## 2. QUALITY GATES

| Gate | Command | Passing condition |
|------|---------|-------------------|
| Every routed path resolves | for each `RESOURCE_MAP` value, `test -f` | all exit 0 |
| No dangling plugin references | `grep -rn` the 12 removed names under the mode, excluding `changelog/` | no hits |
| Intent tuple agrees with the map | compare `INTENT_SIGNALS` keys against `RESOURCE_MAP` keys | identical sets |
| Intent count comment is true | count `INTENT_SIGNALS` keys, compare to the comment | equal |
| Changelog exists and matches | `SKILL.md` version field vs `changelog/` filename | equal |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->

## 3. ARCHITECTURE

`SKILL.md` §2 is a four-part router, and the parts are only correct together:

| Part | What it does | Failure if left stale |
|------|--------------|-----------------------|
| `INTENT_SIGNALS` | Scores a request into an intent by keyword | An orphaned intent still scores and can win |
| `RESOURCE_MAP` | Maps the winning intent to files to load | A removed path loads nothing, silently |
| `specific_plugin_intents` | Decides which intents outrank generic `PLUGINS` | A stale name in the tuple raises `KeyError` at scoring time or shadows a real intent |
| The resource loading list in prose | What a reader believes is available | A reader chases a doc set that is gone |

After the reduction the plugin-specific intents are `PLUGIN_ICONIC`, `PLUGIN_HEALTH` and
`THEME_SYSTEM`. `PLUGINS` stays as the generic fallback and must list only surviving resources.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->

## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Owner | Contract that must not break |
|---------|-------|------------------------------|
| `SKILL.md` §2 router | this mode | Every routed path resolves; retained intents keep working |
| `SKILL.md` frontmatter | this mode | `name` and `allowed-tools` unchanged; `description` and `version` change |
| `README.md` | this mode | Stays a description of the mode, not a changelog of what was removed |
| `references/notion-migration.md` | this mode | The 8-step method survives; only links into deleted doc sets go |
| `references/plugins/plugin-operation-logic.md` | this mode | Stays generic enough to extend to a future plugin |
| `feature-catalog/`, `manual-testing-playbook/` indexes | this mode | Every listed entry resolves |

Not touched, verified to stand alone: `references/mcp-tools.md`, `references/cli-versus-mcp.md`,
`references/troubleshooting.md` §6-§7, `INSTALL-GUIDE.md`, `examples/README.md`. Their Local REST
API content is the MCP transport prerequisite and survived the removal of that plugin's doc set.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->

## 4. IMPLEMENTATION PHASES

1. **Rewrite the `SKILL.md` router** as one edit: resource loading list, `INTENT_SIGNALS`,
   `RESOURCE_MAP`, `specific_plugin_intents`, and the intent-count comment.
2. **Rewrite the `SKILL.md` prose**: frontmatter description, keyword comment, §1 activation
   triggers, the §3 headline sentence, the §7 routing table row, the §8 reference list, and the
   version field.
3. **Rewrite `README.md`**: the use-it-for row, the knowledge-layer paragraph, the plugin table and
   the FAQ answer.
4. **Rewrite the three cross-plugin references**: `installed-plugins.md`, `plugin-operation-logic.md`,
   `assets/workflows.md`.
5. **Trim `references/notion-migration.md`** to drop links into deleted doc sets, keeping the method.
6. **Rewrite the two indexes**: `FEATURE-CATALOG.md` and `manual-testing-playbook.md`.
7. **Add `changelog/v0.24.0.0.md`** and set the `SKILL.md` version to match.
8. **Run the gates** in §2 and record their output.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->

## 5. TESTING STRATEGY

Two mechanical checks carry this phase, and neither is satisfied by reading the diff.

**Path resolution.** Extract every value in `RESOURCE_MAP` and `test -f` it. This is the check
that catches the silent failure, because a router pointing at a missing file returns an empty
load rather than an error.

**Residue scan.** Grep the twelve removed directory names across the mode, excluding `changelog/`.
A filter-and-transform task fails by leaving a variant nobody enumerated, so the scan runs over
the whole mode rather than over the files that were edited.

The negative control: run both checks before the phase. Path resolution must fail on twelve
entries and the residue scan must return hits. A check that passes before the work proves nothing
about the work.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->

## 6. DEPENDENCIES

| Dependency | Type | Why |
|------------|------|-----|
| Phase 1 complete | blocking | The reconciliation must describe a settled file set |
| git working tree | tooling | Rollback and evidence |
| `grep`, `test` | tooling | The two gates; no new tool is added |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->

## 7. ROLLBACK PLAN

To undo this phase: `git restore -- .opencode/skills/mcp-tooling/mcp-obsidian/` for the modified
files, and `rm .opencode/skills/mcp-tooling/mcp-obsidian/changelog/v0.24.0.0.md` for the one
created file, which is untracked until committed.

Restoring this phase alone leaves phase 1's deletions in place, which is the knowingly
inconsistent state phase 1 ends in. Roll back both phases together if the whole packet is abandoned.
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

Phase 3 validates the mode as a whole, so it cannot start while any document still names a removed
path.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->

## L2: EFFORT ESTIMATION

| Work item | Size | Note |
|-----------|------|------|
| `SKILL.md` router rewrite | M | Four parts that must move together |
| `SKILL.md` prose | S | Six known spots |
| `README.md` | S | Four known spots |
| Three cross-plugin references | M | Genuine rewrites, not deletions |
| Migration reference trim | S | Links only |
| Two indexes | S | Row removal |
| Changelog entry | S | One new file |
| **Total** | **M** | The router is the part that repays care |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->

## L2: ENHANCED ROLLBACK

| Trigger | Detection | Action |
|---------|-----------|--------|
| A routed path does not resolve | The path-resolution gate fails | Fix the map entry; do not recreate the deleted file |
| An intent survives with no map entry | Key sets differ | Remove the intent, then re-run both gates |
| A retained route stopped working | Replay an Iconic or Health.md request | `git restore -- SKILL.md` and redo the router edit as one change |
| Prose drifted into unrelated rewrites | The diff touches files outside `spec.md` §3 | `git restore` those files and record what was noticed instead |
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->

## L3: DEPENDENCY GRAPH

```
001 deletions
  v
002 SKILL.md router ---> README, roster, operation-logic, workflows
  |                        |
  |                        v
  |                      indexes + migration reference
  v
002 changelog entry + version bump
  v
003 hub routing + gates
```

The router is first inside this phase because every other document describes what it routes to.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->

## L3: CRITICAL PATH

`SKILL.md` §2 is the critical path. Its four parts are the only place where an error is invisible
at review time and shows up as a route that loads nothing. Everything downstream of it is prose
that a reader can spot-check.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->

## L3: MILESTONES

| Milestone | Definition of done |
|-----------|--------------------|
| M1 router reconciled | All four router parts agree and every path resolves |
| M2 prose reconciled | README, roster, operation-logic, workflows, migration and both indexes |
| M3 version recorded | Changelog entry present and the version field matches |
| M4 gates green | Path resolution and residue scan both run and read |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD


**ADR-003: Keep the generic `PLUGINS` intent.**

*Context.* With twelve plugin intents gone, the generic `PLUGINS` intent could go too, leaving
only `PLUGIN_ICONIC`, `PLUGIN_HEALTH` and `THEME_SYSTEM`.

*Decision.* Keep it, pointing at the operation-logic reference and the roster.

*Consequence.* A request that says "plugin" without naming one still lands somewhere useful: the
file-layer model and the list of what is installed. Removing it would send those requests to the
disambiguation checklist, which is a worse answer to a question the mode can actually answer.

**ADR-004: Leave Local REST API prose in the MCP documents.**

*Context.* The `obsidian-local-rest-api` doc set is removed, but the plugin is the transport the
cyanheads MCP rides on, and five surviving documents describe it.

*Decision.* Those documents keep their Local REST API content unchanged.

*Consequence.* The plugin loses its dedicated doc set, as instructed, and the MCP path keeps the
prerequisite knowledge it needs. This was verified before phase 1 ran: `INSTALL-GUIDE.md` carries
setup and the port, and `references/troubleshooting.md` §6 and §7 carry the failure modes, neither
sourced from the deleted doc set.


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
