---
title: "Implementation Plan: Phase 3: convert-legacy-skilled"
description: "Build sk-skill-convert.cjs plan and apply with pure V2 and V3(b) transforms, backups and exclusive creates. Prove it with a golden test on a pre-move framework skill copy: byte-equal machine section, equal parseRouter output, strict PASS and an idempotent second apply."
trigger_phrases:
  - "convert legacy skilled plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: convert-legacy-skilled

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None; `--apply` gate modelled on `sk-code-quality-config.cjs` |
| **Storage** | Backups under `.skilled/skills/.state/doctor-sk-skill/<name>/<timestamp>/` |
| **Testing** | `node --test` |

### Overview
Add `sk-skill-convert.cjs` with a default `plan` and an `apply` gated by `--apply`, and a pure transforms library for V2 and V3(b). Each overwrite backs up first and each create is exclusive. Prove it with a golden fixture whose converted `ROUTER.md` machine section is byte-equal to the post-move file and whose `parseRouter` output is unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `route-validate.sh` exits 0 with the `check` route (phase 002 closed)
- [ ] The golden fixture pair exists under `tests/fixtures/sk-skill-convert/`
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` exits 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Plan, gate, apply

### Key Components
- **`sk-skill-convert.cjs`**: runs V0 preflight through `sk-skill-surface.cjs`, builds the step list, prints the plan, and with `--apply` backs up, writes and proves.
- **`lib/sk-skill-convert-transforms.cjs`**: pure functions for the V2 frontmatter edit and the V3(b) section move; no file access, unit-tested without a repo.

### Data Flow
The script snapshots the skill, takes the machine section from `resolveMachineRouter(...).text`, and passes text through the transforms. `apply` backs up each file it will overwrite, writes new files with an exclusive create, then compares `parseRouter` on the snapshot with `parseRouter` on the result. Equal keeps the change; different restores the backup.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase adds new scripts and fixes no reported finding. The skill folder it converts is named in the plan output on every run.
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
| Unit | V2 and V3(b) transforms on strings | `node --test` |
| Integration | Golden conversion, second `apply`, no-replace, V0 refusals | `node --test .skilled/commands/doctor/scripts/tests/sk-skill-convert.test.cjs` |
| Manual | Strict gate on the converted fixture | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py <fixture> --check --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `router-file-resolver.cjs`, `router-replay-lib.cjs` | Internal | Green | No section text and no proof; exit 2 |
| `skill-router-template.md` | Internal | Green | No `ROUTER.md` frontmatter and heading |
| Phase 001 `sk-skill-surface.cjs` | Internal | Yellow | No V0 preflight |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `parseRouter` differs after the move, or the strict gate fails on the converted fixture.
- **Procedure**: inside a run, restore the pre-edit bytes from `.skilled/skills/.state/doctor-sk-skill/<name>/<timestamp>/` and delete files the run created; for the code, revert the phase commit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (golden fixture pair) | Phase 001 closed | Implementation |
| Implementation (transforms, plan/apply, backups) | Setup | Verification |
| Verification (golden, no-op, no-replace, strict) | Implementation | Phase 004 |
<!-- /ANCHOR:phase-deps -->

---
