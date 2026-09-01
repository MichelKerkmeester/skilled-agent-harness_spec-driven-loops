---
title: "Implementation Plan: Phase 3: content-migration"
description: "Moves the frontmatter template spec and the versioning rules out of the hub's shared tier into the owning mode with git mv, then repoints all 34 consumer files the phase 001 inventory named. One substitution covers the bulk because both homes are direct children of the hub; six references written in other forms and five links inside the moved documents needed hand work."
trigger_phrases:
  - "frontmatter content migration"
  - "repoint frontmatter consumers"
  - "git mv frontmatter templates"
  - "sibling relative path rewrite"
  - "frontmatter link integrity delta"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: content-migration

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documents under `.opencode/skills/sk-doc/`, plus two Python scripts that carry the paths in docstrings and operator-facing strings |
| **Framework** | None. The move is `git mv` plus a path substitution; no runtime component changes |
| **Storage** | None |
| **Testing** | `quick_validate.py` and `package_skill.py --check --strict` against the new location, `resolve_skill_markdown_links.py` for the hub-wide link delta, a repo-wide scan for the old paths, and the existing vitest suite |

### Overview
`shared/assets/frontmatter-templates.md` (939 lines) and `shared/references/frontmatter-versioning.md`
(148 lines) move into `sk-create-frontmatter/assets/` and `sk-create-frontmatter/references/` with
`git mv`, and every consumer the phase 001 inventory named is repointed. The structural property that
made this cheap: `shared/` and `sk-create-frontmatter/` are both direct children of the hub, so every
relative reference keeps its existing `../` prefix and only the path segment changes. One substitution
over 28 files handled the bulk; six references written in other forms, and five links inside the moved
documents, needed hand work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented — spec.md §2 separates the loud failures (markdown links) from the quiet ones (paths inside scripts), and §3 freezes scope to the move plus the inventory's consumer list
- [x] Success criteria measurable — SC-001 is a repo scan, SC-002 is two named validator runs, SC-003 is a diff of one JSON file; all three are commands with readable output
- [x] Dependencies identified — the phase 001 inventory (`../001-inventory-and-contract/inventory/consumer-inventory.md`) and the phase 002 mode packet, which must exist before anything can move into it

### Definition of Done
- [x] All acceptance criteria met — AC-001 through AC-006 in acceptance-criteria.md are all `Met`
- [x] Tests passing (if applicable) — the vitest suite stayed at 54 files and 683 tests passing, unchanged across the move
- [x] Docs updated (spec/plan/tasks) — plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md all trace to spec.md's REQ-001/002/003 and SC-001/002/003
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A path migration governed by a pre-built inventory. The inventory decides the work; the phase executes
it and then proves the inventory was complete rather than assuming it.

### Key Components
- **The sibling-depth property** — `shared/` and `sk-create-frontmatter/` are both direct children of `.opencode/skills/sk-doc/`, and both documents keep the same `assets/` and `references/` subdirectory names. Any reference written as `../../shared/assets/frontmatter-templates.md` therefore needs only its middle segment changed, which is what makes a single substitution safe over 28 files.
- **The bulk substitution** — one path substitution applied across the 28 files whose references are written in the dominant form.
- **The six exceptions** — references written as a `shared/`-internal sibling (`../assets/...`), as a same-directory link (`./frontmatter-templates.md`), or as a skill-relative path inside a Python string. None of the three forms is reachable by the bulk substitution.
- **The outbound-link fix** — five lines inside the two moved documents that point at something else. The phase 001 probe could not see them, because it matched the two filenames and these links point away from them.

### Data Flow
`git mv` relocates the two files and preserves their history. The bulk substitution then rewrites every
consumer whose reference is in the dominant form. The six exceptions and the five outbound links are
edited individually. Verification runs in the opposite direction: a repo scan asks whether anything
still points at the old path, and the link resolver asks whether anything now points at nothing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The move touches paths inside scripts, which fail silently, so the surfaces are enumerated rather than
sampled.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-doc/shared/assets/frontmatter-templates.md` | The template spec, 939 lines | Moved to `sk-create-frontmatter/assets/` with `git mv` | The file exists at the new path and nowhere else |
| `.opencode/skills/sk-doc/shared/references/frontmatter-versioning.md` | The versioning rules, 148 lines | Moved to `sk-create-frontmatter/references/` with `git mv` | Same |
| 28 consumer files in the dominant reference form | Markdown links and bare relative paths across mode packets and the hub tier | Updated by one substitution | Repo scan for the old paths returns only frozen bundles |
| `shared/references/{validation.md:544,core-standards.md:337,quick-reference.md:351}` | Sibling references inside `shared/`, written `../assets/...` | Updated by hand to `../../sk-create-frontmatter/assets/...` | Link resolver reports zero frontmatter-related failures |
| `shared/assets/llmstxt-templates.md:850`, `sk-create-changelog/assets/changelog-template.md:286` | Same-directory form `./frontmatter-templates.md` | Updated by hand | The changelog-template link was already broken and is now resolvable |
| `shared/scripts/quick_validate.py:{12,254,261,266}`, `sk-create-skill/scripts/package_skill.py:334` | Skill-relative paths in docstrings and operator-facing strings | Updated by hand | Both scripts run clean and no longer print a path that leads nowhere |
| The two moved documents' own outbound links | 4 relative links plus 1 prose path pointing out of the moved files | Updated by hand | Found by scanning both documents for every relative link, not by the reference probe |
| `.opencode/skills/sk-doc/leaf-aliases.json` | The alias table | Not a consumer, deliberately unchanged | `git diff` is empty; the table still holds its original 5 entries, none of them frontmatter |
| The hub's compiled routing manifest | Derived from the disk tree | Not edited, but invalidated as a side effect | Dropped to `stale-manifest`; refreshed in phase 004 |

Required inventories:
- Same-class producers: the two moved documents are the only producers of these paths; every other line is a consumer.
- Consumers of changed symbols: `grep -ranI --exclude-dir=.git --exclude-dir=node_modules -E 'frontmatter-(templates|versioning)' .opencode/` is the producer-side probe the phase 001 inventory was built from, and the same command is the post-move check.
- Matrix axes: five written forms crossed with the two moved filenames. Sections 5a through 5e of the inventory list every cell.
- Algorithm invariant: a reference is correct when the number of `../` steps still lands on the hub root and the segment after it names the file's new home. The sibling-depth property is what keeps the first half of that invariant untouched.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.

### Phase 1: Confirm the inventory and capture baselines

Re-read the phase 001 handoff, confirm the sibling-depth property that the substitution strategy rests
on, and capture the pre-move link-integrity, test-suite and alias-table numbers so the after-state has
something to be compared against.

### Phase 2: Move and repoint

`git mv` both documents, run the bulk substitution, then hand-edit the six references written in other
forms and the five links inside the moved documents that point out of them.

### Phase 3: Prove nothing points at the old home, and nothing points at nothing

Scan the repository for the old paths, run both validators against the new location, diff the alias
table, and re-measure link integrity and the test suite against the captured baselines.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Residue scan | Every remaining mention of either old path across the repository | `grep -ranI --exclude-dir=.git --exclude-dir=node_modules -E 'shared/(assets/frontmatter-templates|references/frontmatter-versioning)'` |
| Validator smoke | Both scripts that name the documents in their output still run | `quick_validate.py` reports `Skill is valid!`; `package_skill.py --check --strict` reports `Result: PASS` |
| Link integrity | Every relative link across the whole sk-doc hub, before and after | `resolve_skill_markdown_links.py --repo-root . --scope .opencode/skills/sk-doc`: 113 failures before, 112 after, frontmatter-related 0 |
| Regression | The existing hub test suite | vitest: 54 files, 683 tests, passing before and after |
| Negative control | The alias table must not grow | `git diff .opencode/skills/sk-doc/leaf-aliases.json` is empty; the table holds 5 entries, none of them frontmatter |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../001-inventory-and-contract/inventory/consumer-inventory.md` | Internal, upstream | Green — its predicted count of 34 consumer files matched exactly | The move would proceed against a guessed consumer list |
| Phase 002's mode packet | Internal, upstream | Green — `sk-create-frontmatter/` existed with `assets/` and `references/` as siblings | Nothing to move into |
| `resolve_skill_markdown_links.py` | Internal | Green — ran before and after | No before-and-after link number, so REQ-001's proof weakens to a grep |
| `quick_validate.py`, `package_skill.py` | Internal | Green — both ran clean against the new location | Blocks REQ-002 and SC-002 |
| Phase 004 (routing integration) | Internal, downstream | Green — refreshed the compiled routing this phase invalidated | The hub's compiled routing stays at `stale-manifest` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The link-integrity total rises above the 112 ceiling, either validator fails against the new location, or the residue scan finds a live consumer still pointing at the old path.
- **Procedure**: `git checkout -- .opencode/skills/sk-doc/` restores both moved files to the shared tier and reverts all 34 consumer edits in one step, because the whole change is confined to that directory and nothing outside it was touched. Rerun `resolve_skill_markdown_links.py` and confirm the total returns to the pre-move 113.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Not applicable. No hour-level effort estimate was recorded for this phase; progress is tracked by
per-task completion in `tasks.md` (T001-T015), not against a time budget.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — Not applicable: git history is the recovery point, and `git mv` preserved both documents' history through the move
- [x] Feature flag configured — Not applicable: no runtime flag governs a document location. An alias entry would have been the closest equivalent, and adding one was rejected by REQ-003
- [x] Monitoring alerts set — Not applicable: the link resolver and the two validators are the monitoring, and all three were run before and after

### Rollback Procedure
1. `git checkout -- .opencode/skills/sk-doc/` to restore both files to `shared/` and revert every consumer edit at once.
2. Rerun `resolve_skill_markdown_links.py --repo-root . --scope .opencode/skills/sk-doc` and confirm the failure total returns to 113.
3. Rerun the vitest suite and confirm it still reports 54 files and 683 tests passing.
4. No stakeholder notification required: nothing user-facing or runtime-facing changed, and no route pointed at either document.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. Two files moved on disk and 34 files had a path string rewritten; no data store is involved.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │Implementation│    │ Verification │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (Setup) | Phase 001's inventory, phase 002's packet | The confirmed consumer list and the pre-move baselines | Phase 2 |
| Phase 2 (Implementation) | Phase 1 | Both documents at their new homes and 34 repointed consumer files | Phase 3 |
| Phase 3 (Verification) | Phase 2 | The residue scan, the two validator runs, the alias diff and the 113-to-112 link delta | Phase 004's routing work |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 (Confirm the inventory and capture baselines)** - Duration: not tracked - CRITICAL
2. **Phase 2 (Move and repoint)** - Duration: not tracked - CRITICAL
3. **Phase 3 (Prove the move)** - Duration: not tracked - CRITICAL

**Total Critical Path**: Not applicable. No duration estimates were recorded for this phase.

**Parallel Opportunities**:
- The six hand-edited references and the five outbound links inside the moved documents are independent of each other and of the bulk substitution once the `git mv` has happened. They were done in one pass because the set is small, not because they were ordered.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Baselines captured | 113 link failures, 54 vitest files and 683 tests, 5 alias entries recorded before the move | Complete |
| M2 | Move and repoint complete | Both documents at their new homes; 34 consumer files modified, matching the inventory's prediction exactly | Complete |
| M3 | Move proven | Residue scan clean outside frozen history; both validators clean; alias diff empty; link failures 113 to 112 with frontmatter-related at 0 | Complete |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Repoint every consumer rather than add an alias for the old path

**Status**: Accepted

**Context**: An alias entry in `leaf-aliases.json` would make both old paths keep resolving, and would
have reduced this phase to two `git mv` calls. The alternative is repointing 34 files by hand and by
substitution, and accepting that any reference the inventory missed breaks.

**Decision**: No alias. Every consumer is repointed to the document's real location, and
`leaf-aliases.json` is left byte-for-byte unchanged at its original 5 entries.

**Consequences**:
- The path a consumer reads is the path the file is at, so the next person to move either document sees every dependent in a grep instead of behind an indirection.
- Anything the phase 001 inventory missed fails visibly rather than silently. That is the point, and the link resolver plus the residue scan are what convert a miss into a visible failure.
- One pre-existing broken link was fixed as a side effect: `sk-create-changelog/assets/changelog-template.md:286` pointed at `./frontmatter-templates.md`, which never existed in that directory. Repointing it is what fixed it, and the hub's link-failure total went from 113 to 112.

**Alternatives Rejected**:
- An alias for each old path: rejected because aliasing is how the shared tier hid this ownership problem in the first place. A second indirection layered on top of the first would make the next move harder, not easier.
- Leaving the documents in `shared/` and pointing the mode at them: rejected because it is the current state, and it is the problem the packet exists to fix.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
