---
title: "Implementation Plan: Phase 3: update"
description: "Audit `/doctor:update` against this checkout, redesign it as the release-aware updater with `/doctor:rebuild` carrying the database rebuild, then apply and verify both."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: update

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command assets, YAML workflows, a CommonJS Node engine |
| **Framework** | The doctor route family over `.skilled/commands/doctor/` (subaction-route-manifest) |
| **Storage** | Files and git; `.skilled/release/base.json` and `.skilled/release/divergence.json` are git-tracked, run directories under `.skilled/release/runs/` are gitignored, and the SQLite databases remain the rebuild's concern |
| **Testing** | `node --test` for the engine, `route-validate.sh`, `command-catalog-mirror-check.cjs`, `validate_document.py`, YAML parsing, and the mirror and prompt sync checks |

### Overview

Audit first, then redesign and apply. The audit ran the safe read-only probes, kept them in `scratch/doctor-run.log`, and inventoried every path the old workflow names in `scratch/reality-check.md`. The verdict it supported is `fix, by redesign`: the rebuild's mutation boundary forbids skill writes and its rollback is a VACUUM snapshot, so the release updater cannot live inside it. The split keeps the rebuild as `/doctor:rebuild` and rebuilds `/doctor:update` as the release family's front door over one engine that never overwrites a locally changed file without a recorded decision.
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

Other: audit → research and design → split and build → verify, over two commands and one engine. The release updater never writes a skill body without a recorded decision, and the database rebuild keeps its own mutation class and rollback discipline.

### Key Components

- **`.skilled/commands/doctor/scripts/release-update.cjs`**: the engine — `check`, `align`, `decide`, `apply`, `rollback` — with per-unit file classes and a fingerprint-guarded, git-based transaction.
- **`.skilled/commands/doctor/update.md` and the three `doctor-update-*.yaml` assets**: the release updater's thin router, its read-only check, its add-only align and its mutating apply, with one shared presentation.
- **`.skilled/commands/doctor/rebuild.md` and `doctor-rebuild.yaml`**: today's database rebuild under its new name, unchanged in behaviour apart from the held rebuild fixes.
- **`_routes.yaml`, the catalog, the command contract and the mirrors**: the registration and consumer surfaces that keep both routes reachable.

### Data Flow

`check` reads the local tags, the remote tags and the checkout position and reports every unit's status without writes. `align` freezes the plan, the evidence cards and the merge proposals into a gitignored run directory. `decide` records one per-file decision or defers one unit inside that run. `apply` takes the lock, writes `rollback.json` before its first file write, applies only decided files and uncustomized units, updates the base manifest and the divergence ledger, runs the post-apply battery, and hands off to `/doctor:rebuild` for the reindex with `reindex rebuilt|skipped|failed`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/doctor/update.md` (producer) | The rebuild router before the split; the release updater's router after it | rewrite — thin router for `check`, `align` and `apply`; a bare invocation selects the read-only `check` | `validate_document.py update.md --type command` → `VALID`, 0 issues; `update.md:16,35` states the bare-command routing |
| `.skilled/commands/doctor/assets/doctor-update.yaml` → `doctor-rebuild.yaml` (producer) | The database rebuild workflow; its forbidden targets ban skill writes | rename and keep behaviour, with the held rebuild fixes applied; state files move to `.doctor-rebuild.*` | YAML parses; the `forbidden_targets` block is at `doctor-rebuild.yaml:123-131` |
| `.skilled/commands/doctor/assets/doctor-update-check.yaml`, `doctor-update-align.yaml`, `doctor-update-apply.yaml` (producers) | Absent before the split | create — read-only check, add-only align, mutating apply under the sk-create-command contract | YAML parse `YAML_OK` for all three; `route-validate.sh` → exit 0 |
| `.skilled/commands/doctor/scripts/release-update.cjs` (producer) | Absent before the split | create — the engine, Node built-ins and git plumbing only | `node --test tests/release-update.test.cjs` → 16 pass / 0 fail; `--help` exits 0, an unknown subcommand exits 2 |
| `.skilled/commands/doctor/_routes.yaml` (consumer) | Held the rebuild's standalone row | update — standalone entries for `/doctor:rebuild` and `/doctor:update`, the latter with an actions map (check read-only, align add-only, apply mutates) | `route-validate.sh` → "9 routes validated", exit 0 |
| `.skilled/commands/README.txt`, `README.md`, feature catalog, playbook, `command-contract.json` (consumers) | Catalog rows, command counts, playbook scenarios and the doctor family contract | update — both command names, the 4-to-5 count and the six renamed rebuild scenarios | catalog mirror check → `STATUS=OK` over 36 commands |
| `.claude/` and `.cursor/` symlinks; the codex, pi and hermes prompt trees (consumers) | Runtime mirrors of the command tree | update — regenerated by the sync scripts | `sync-prompts*.cjs --check` → PASS 34 prompts each; `sync-runtime-mirrors.cjs --check` → PASS 174 mirrors across 8 trees |

Required inventories:
- Same-class producers: every reference to the old command and asset names was swept in the rename commit (`b0be233a6b`); `command-catalog-mirror-check.cjs` reports `STATUS=OK`, and `route-validate.sh` confirms `_routes.yaml`, the router table and the presentations agree.
- Consumers of changed symbols: `.skilled/commands/README.txt`, the hub metadata files, `command-contract.json`, the feature catalog, the playbook scenarios, the root `README.md` and the runtime mirror trees; the catalog, route, prompt and mirror checks above are the evidence they agree.
- Matrix axes: engine subcommands (check, align, decide, apply, rollback) × update-unit statuses (current, update, new, customized, local, conflict, removed, blocked) × file classes (same, take-release, local-only, conflict). The 16-case suite covers the subcommands and the refusal paths, and the live `check` run covers the status axis on this checkout.
- Algorithm invariant: a locally changed file is never overwritten. `apply` refuses a target with staged or unstaged changes, refuses drift recorded since align, refuses a proposal whose markers or hash changed, and writes merged text only after an explicit `merge` or `use-proposal` decision.
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
| Unit | Engine subcommands, unit statuses, file classes, decision validation, drift refusals, apply and rollback against disposable repositories | `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` → tests 16, pass 16, fail 0 |
| Integration | One read-only release check against this checkout | `node .skilled/commands/doctor/scripts/release-update.cjs check --json` → exit 0 |
| Route, catalog and documents | Both routers, the route manifest, the catalog, the workflow YAMLs and the engine file | `route-validate.sh` → exit 0; catalog mirror check → `STATUS=OK`; `validate_document.py` → 0 issues each; YAML parse → `YAML_OK` |
| Mirrors and prompts | Runtime mirror trees and the codex, pi and hermes prompt trees | `sync-prompts*.cjs --check` and `sync-runtime-mirrors.cjs --check` → PASS |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| git CLI | External | Green | The engine reads tags, objects and the working tree through it; without git there is no base, no release and no rollback |
| Node.js | External | Green | The engine and its tests do not run |
| `.skilled/commands/doctor/_routes.yaml` and `route-validate.sh` | Internal | Green | The registration cannot be validated |
| Remote upstream (`origin`) | External | Green | With no network the check reports upstream `unknown`, never `current` |
| A provisioned worktree | Internal | Green | The doctor scripts cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the split's routing or the updater's apply path proves wrong for the operator's checkout.
- **Procedure**: the three commits are local and unpushed, so `git revert` them in reverse order (`8215a33a7b`, `b853457597`, `b0be233a6b`) or restore the pre-split tree at their parent; for an applied release, `node .skilled/commands/doctor/scripts/release-update.cjs rollback --run <dir>` restores every path in the run's `rollback.json` and the base and divergence records.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Audit and verdict ──► Research and design ──► Split, engine and workflows ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Audit and verdict | None | Research and design |
| Research and design | Audit and verdict | Split, engine and workflows |
| Split, engine and workflows | Research and design | Verify |
| Verify | Split, engine and workflows | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Audit and verdict | Low | Source reads plus the safe read-only probe run |
| Research and design | High | Ten deep-research iterations plus the settled design |
| Split, engine and workflows | High | Rename sweep, engine and tests, three workflows, registration and mirrors |
| Verification | Med | Engine tests plus the route, catalog, document, YAML and sync gates |
| **Total** | | **One continuous session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — N/A; every changed file is tracked in git
- [x] Feature flag configured — N/A
- [x] Monitoring alerts set — N/A

### Rollback Procedure
1. `node .skilled/commands/doctor/scripts/release-update.cjs rollback --run <dir>` for an applied release run; it restores the `rollback.json` paths and reports any path it skipped.
2. `git revert` the three local commits (`8215a33a7b`, `b853457597`, `b0be233a6b`) to return the pre-split command set.
3. Re-run `bash .skilled/commands/doctor/scripts/route-validate.sh` and the engine test suite to confirm the restored state.

### Data Reversal
- **Has data migrations?** No; the rebuild's own migration manifest travels with it unchanged
- **Reversal procedure**: `apply` writes `rollback.json` before its first file write, and `rollback --run <dir>` restores `base.json` and `divergence.json` alongside the file tree
<!-- /ANCHOR:enhanced-rollback -->

---

