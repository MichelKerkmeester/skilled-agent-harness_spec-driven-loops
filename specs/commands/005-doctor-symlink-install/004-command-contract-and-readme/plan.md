---
title: "Implementation Plan: Phase 4: command-contract-and-readme"
description: "This phase aligns the sk-create-command contract and the root README with the two commands that already ship: both commands enter the doctor family entry, the symlink argument hint drops under the soft budget, and the README gains a top-level setup section built on them."
trigger_phrases:
  - "command contract and readme plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: command-contract-and-readme

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and JSON, with the router frontmatter the repository already ships |
| **Framework** | The Skilled doctor command family and the sk-create-command contract asset |
| **Storage** | None |
| **Testing** | `validate_document.py`, the kebab name check, `node:test` and the router generator's `--check` |

### Overview

This phase adds no behavior. It edits one JSON contract as text, shortens two `argument-hint` values, and writes one README section with the renumbering that follows it. It is proved by the three document validators, the kebab name check, the JSON parse, the router generator's `--check`, the doctor suite and the catalog mirror check.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `python3 .skilled/skills/sk-doc/scripts/validate_document.py --type readme README.md` prints `Total issues: 0`, and `node .skilled/skills/system-spec-kit/runtime/cli/codex/generate-command-routers.cjs --check` prints `routers=41 clean=41 path-drift=0 shape-drift=0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Contract fan-out. One published asset states a family's shape, and every consumer reads it.

### Key Components
- **`.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`**: the doctor family entry a consumer walks to reach a target
- **`.skilled/commands/doctor/symlink.md` and `install.md`**: the routers whose `argument-hint` the contract repeats
- **`README.md`**: the reader's entry point, which now carries the setup path as its own numbered section

### Data Flow

The contract carries each family's router path, argument hint and execution targets, and the doctor entry names its target workflows, its assets, its loader requirements, its destructive operations and its invocation aliases. A consumer walks those fields to dispatch a target. Two contract tests read the invocation aliases and the loader requirements, so a field that stops naming a router fails a test. The router generator walks the router frontmatter, and the catalog mirror check walks the same files, so a router the contract describes stays the router an index lists.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

N/A. This phase fixes no reported finding and touches no bug surface, and it describes two commands that already ship in the contract a consumer reads and in the README a reader starts from.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup read the doctor family entry and the README's section order. Implementation edited the contract as text, shortened the two argument hints, and wrote the README section, the renumbering and the DOCTOR section rows. Verification ran the three document validators, the kebab check, the JSON parse, the router generator's `--check`, the doctor suite and the catalog mirror check.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Both routers and the contract asset | `validate_document.py --type command`, the kebab name check, the JSON parse |
| Integration | The two doctor contract tests, the router generator and the catalog index | `run-all.sh`, `generate-command-routers.cjs --check`, `command-catalog-mirror-check.cjs` |
| Manual | The README section read as a reader follows it | `validate_document.py --type readme`, plus a read of sections 5 and 12 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The sk-create-command contract asset | Internal | Green | A doctor target has no published field, so a consumer cannot dispatch it |
| The command router generator | Internal | Green | No census proves the contract's coverage sentence, and a router drift goes unreported |
| node, python3 and bash | Internal | Green | No document validator, router check or suite can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A consumer reads a field the contract states wrongly, or the README section sends a reader to a section number that no longer matches.
- **Procedure**: Undo the three edits. Put the doctor family entry back to its pre-phase fields, restore the longer `argument-hint`, and remove README section 5 while renumbering the sections after it back. Nothing else reads these three files, so the routers, their workflows and their presentations keep working and simply stop being described.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
003 routes ──► 004 contract entry ──► 004 README section ──► 004 verification
                        └──────────► 004 argument hint ────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 004 contract entry | 003 routes and both routers on disk | The README section, the contract tests |
| 004 argument hint | The contract's own `argument_hint` text | Verification |
| 004 README section | The contract entry, which states what each command does | Verification |
| 004 verification | The contract entry, the argument hint and the README section | Packet closure |
<!-- /ANCHOR:phase-deps -->

---
