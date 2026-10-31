---
title: "Implementation Plan: Phase 14: doctor-env"
description: "Build `/doctor:env` through sk-create-command as a thin router with a workflow and presentation asset. The command audits the live switch reference at run time, reports set or unset state per source, classifies each switch, and writes one confirmed preference to an eligible destination."
trigger_phrases:
  - "doctor env plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 14: doctor-env

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown router, YAML workflow, plain-text presentation asset |
| **Framework** | The sk-create-command thin-router pattern |
| **Storage** | None. A confirmed preference is one line in `.skilled/hooks/hook-flags.env` or the Claude settings env block. |
| **Testing** | Spec validators, catalog and route checks, mirror sync checks, and one recorded run in `scratch/doctor-env-run.md` |

### Overview

The phase audits first and applies second. The workflow reads `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` at every run, parses both table shapes, and classifies each switch as secret, per-invocation or preference. It reports set or unset state per source without printing a value. A write happens only for an eligible preference, only to a destination the operator picks, and only after the exact line is shown and the operator says yes.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Data-driven command: a thin router loads a workflow asset, and a presentation asset owns every visible string. This is the pattern the other doctor routers use.

### Key Components

- **Router** (`.skilled/commands/doctor/env.md`): parses arguments, loads the two assets, and holds no switch inventory of its own. It carries the six canonical sections and the `[list | <section> | <VARIABLE>] [--dry-run]` argument hint.
- **Workflow asset** (`.skilled/commands/doctor/assets/doctor-env.yaml`): owns the run-time parse, the secret and per-invocation classification, the read-only source inspection, the preference preview and the confirmation-gated write.
- **Presentation asset** (`.skilled/commands/doctor/assets/doctor-env-presentation.txt`): owns every prompt, menu, table, preview, error and status shown to the operator.
- **Live reference** (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`): the only source of the switch list. The command copies none of it.
- **Family wiring**: the `.claude` symlink, the doctor table in `.skilled/commands/README.txt`, the doctor family entry in the sk-create-command contract, and the generated runtime mirrors.

### Data Flow

The router parses the invocation, then hands it to the workflow. The workflow reads the reference, builds a deduplicated inventory, classifies each row, and inspects the supported sources for set or unset state. The operator selects a switch, the workflow explains it and collects a preference, and the presentation shows the exact proposed line, the destination and the effect. Only an explicit yes is followed by one write. The workflow re-reads the changed file and finishes with one status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Surfaces this phase touches, and the check that covered each.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Family contract (`.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`) | Owns the doctor family entry | Updated | The router document validated and the entry names the new router, its argument hint, its assets and its write policy |
| Live reference (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`) | Produces the switch inventory | Unchanged, read at run time | A copy with one added row parsed 159 unique variables against 158 in the committed file, with no edit to the command |
| Preference reader (`.skilled/hooks/hook-flags.cjs`) | Observes a written preference | Unchanged | The reader honoured the one-line write in a disposable copy, dist-freshness false with the file and true without it |
| Command catalog (`.skilled/commands/README.txt`, catalog mirror check) | Indexes the doctor family | Updated | The mirror check reported STATUS=OK with 35 of 35 commands listed and exited 0 |
| Runtime mirrors (`.codex`, `.pi`, `.hermes`, `.cursor`) | Expose the command per runtime | Created or linked | Prompt sync `--check` and mirror sync `--check` reported every mirror in sync |
| `.env` and shell profiles | Never a destination | Out of scope, untouched | The run record shows `.env` was never offered or written and profiles receive only a printed export line |

Required inventories:

- Same-class producers: the sibling doctor routers were read against the sk-create-command split, and the new router follows the same six sections.
- Consumers: `README.txt`, `command-contract.json` and the mirror checks were re-read after the edits, and each stayed green.
- Matrix axes: classification (secret, per-invocation, preference), destination (`hook-flags.env`, Claude settings, export line), and mode (dry run, confirmed). The recorded run covers the write path, the dry-run path and the added-row parse.
- Algorithm invariant: no write without a shown exact line and an explicit yes, no secret value displayed or written, and no per-invocation switch persisted. Adversarial cases: a `TOKEN` name followed by `THRESHOLD` is a count, not a secret; a forged git-hook example (`=ON` and `=OFF`) was replaced with the source hook's documented `=1`; a dry run leaves the destination absent.
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
| Unit | Inventory parse over both table shapes, the three classifications, and argument rejection | The recorded parse in `scratch/doctor-env-run.md` and the document validators |
| Integration | Router to workflow to presentation wiring, the catalog, the route manifest and the mirrors | `validate_document.py`, `command-catalog-mirror-check.cjs`, `route-validate.sh`, prompt and mirror sync checks |
| Manual | One run: live inventory, an added-row copy, a dry run and a confirmed write to a disposable copy | Orchestrator Bash and Node probes, recorded in `scratch/doctor-env-run.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Provisioned worktree | Internal | Green | The doctor scripts cannot run |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Internal | Green | There is no inventory to show |
| `hook-flags.cjs` reader and `hook-flags.env.example` | Internal | Green | A written preference cannot be verified |
| sk-create-command family contract | Internal | Green | The router cannot join the doctor family |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A written preference breaks a hook, or the router fails validation after later edits.
- **Procedure**: Remove the router and its two assets. Remove the `.claude` symlink and the generated mirrors. Revert the README doctor row and the family contract entry. Rerun `route-validate.sh` and the catalog mirror check. A value already written is reverted by editing the one confirmed line in its destination.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────► Phase 2 (Implementation) ──────► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation, Verify |
| Implementation | Setup | Verify |
| Verify | Setup, Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour: read the sibling routers and the family contract |
| Core Implementation | Med | One session for the router, the workflow and the presentation asset |
| Verification | Med | One session for the checks and the recorded run |
| **Total** | | **About two sessions across one day** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No migration and no data copy, because the only write is one operator-confirmed preference line
- [x] The operator sees the exact line, the destination and the effect before any write
- [x] Validation, catalog, route and mirror checks run before closure

### Rollback Procedure
1. Remove the router and its two assets.
2. Remove the `.claude` symlink and the generated runtime mirrors.
3. Revert the README doctor row and the family contract entry.
4. Rerun `route-validate.sh`, the catalog mirror check and the mirror sync checks.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Delete or edit the confirmed line in `.skilled/hooks/hook-flags.env` or the Claude settings env block.
<!-- /ANCHOR:enhanced-rollback -->

---
