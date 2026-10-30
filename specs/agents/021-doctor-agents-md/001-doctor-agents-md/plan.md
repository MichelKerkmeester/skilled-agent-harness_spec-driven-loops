---
title: "Implementation Plan: /doctor:agents-md"
description: "Sequencing across the five children: the manifest first, the check engine on top of it, the embed engine on top of the check, then the plumbing and the closing verification pass."
trigger_phrases:
  - "agents md phase plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: /doctor:agents-md

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts, JSON manifest, YAML workflows, Markdown routers |
| **Framework** | None; the scripts run under `node` and the family's own shell validators |
| **Storage** | One manifest under the doctor command's assets, plus a backup directory outside the tree |
| **Testing** | `node:test` per child, then the family runner and the spec-kit validator |

### Overview
The work is one chain: a manifest nobody can read until it exists, an engine that classifies against it, an engine that composes from that classification, plumbing that reaches both, and a pass that proves the pair together. Each child ends with its own suite passing, and the next child starts from that state.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `/doctor:sk-skill` is on `main` and the six baseline commands are recorded for this phase
- [ ] The approved design is read whole, not recalled
- [ ] Every child folder carries its spec, plan, tasks and acceptance criteria

### Definition of Done
- [ ] All five children pass `validate.sh --strict`
- [ ] `node .skilled/commands/doctor/scripts/agents-md-check.cjs` exits 0 with `STATUS=OK` on this repository
- [ ] `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` prints `NOTHING TO DO`
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with the three routes
- [ ] `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` still passes with the prefix inside its ceiling
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Data, then reader, then writer, then surface.

### Key Components
- **Manifest**: the authored keys and the generated derived bodies, owned by child 001.
- **Shared segmenter**: the one place a section boundary is decided, imported by both engines.
- **Check engine**: read-only classification with twelve rows, owned by child 002.
- **Embed engine**: composition, plan digest, apply, preservation proof and restore, owned by child 003.

### Data Flow
The root file is segmented once and hashed against the manifest, the check reports per row, the embed composes from that report, the plan shows the diff, and the post-write proof compares the new tree against the backups.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the cross-child sequencing and the aggregate verification checklist; each child owns its own task list.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Segmenter, generator, classifier, composer and the preservation function | `node:test` per child |
| Contract | Pins, fixtures, router shape and generated surfaces | `node:test` per child |
| End-to-end | Nine fixtures through the pair, with transcripts | Child 005 |

### Test Commands

- `node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs`
- `node --test .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs`
- `node --test .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs`
- `node --test .skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs`
- `bash .skilled/commands/doctor/scripts/tests/run-all.sh`

### Test Protocol

Each suite is committed before the code it exercises and its red run is recorded in the child's `scratch/`. A child is not started until the suite fails for the expected reason.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/doctor:sk-skill` on `main` | Internal | Yellow | No child starts; every shared count is stale |
| The rule-copy canary | Internal | Green | The budget row reports `UNKNOWN` |
| The update engine's exported classifier | Internal | Green | Edited sections fall back to adopt-and-carry |
| A live Devin session | External | Yellow | The last manual row closes as unknown |

### Phase Dependencies

```
001 manifest and block ──► 002 check engine ──► 003 embed engine ──► 004 plumbing ──► 005 verification
```
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The canary reports the delivery prefix past byte 16384, or the embed engine cannot hold the preservation invariant.
- **Procedure**: Revert the child's commit. The root file, the manifest and the generated key travel in one commit, so a revert restores all three together.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001-manifest-and-template-block | The doctor sk-skill command | 002 and everything after it |
| 002-check-engine | 001's manifest and segmenter | 003 |
| 003-embed-engine | 002's report | 004 |
| 004-command-plumbing | Both engines | 005 |
| 005-verification-and-docs | All four | Phase closure |
<!-- /ANCHOR:phase-deps -->

---
