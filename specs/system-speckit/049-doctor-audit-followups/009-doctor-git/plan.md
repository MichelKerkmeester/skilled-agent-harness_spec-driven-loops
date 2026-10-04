---
title: "Implementation Plan: Phase 9: doctor-git"
description: "Add a gate registry and a git config reader to the three hooks with optional gates, then a /doctor:git router whose hooks workflow saves gate settings and whose standards workflow edits the repository's own .sk-git/ copies of the sk-git templates."
trigger_phrases:
  - "doctor git plan"
  - "gate config helper plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: doctor-git

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash hooks and helper, Node scripts, Markdown router, YAML workflows |
| **Framework** | The sk-create-command router contract and sk-git's message contract |
| **Storage** | Git config keys `speckit.hooks.<key>`; template files under `.sk-git/` |
| **Testing** | `gate-config.test.sh` and the other hook suites, two node:test suites, the doctor `run-all.sh`, `route-validate.sh` |

### Overview
Register every switchable gate once in `lib/gates.tsv` and let one sourced helper map a saved off value to the gate's existing variable, so no gate's own code changes. Build `/doctor:git` as a routed doctor command with two targets. `hooks` calls a script that reads the same registry and writes git config. `standards` calls a script that uses sk-git's own contract module to resolve, validate and edit the rules, writing only `.sk-git/`.
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
One registry, two readers: the hooks read `gates.tsv` through `gate-config.sh` at run time, and `git-hook-gates.cjs` reads it to list and change settings. For standards, sk-git's `message-contract.mjs` stays the only parser and validator; the doctor script only locates, edits and rechecks.

### Key Components
- **`lib/gates.tsv`**: hook, config key, bypass variable, persistable flag and description per gate
- **`lib/gate-config.sh`**: `gate_config_apply <hook>` exports a gate's variable when local or global config holds off
- **`git-hook-gates.cjs`**: `list` and `set`, a dry run until `--apply`
- **`git-standards.cjs`**: `status`, `init`, `set`, `disable` and `check`, each mutating mode a dry run until `--apply`

### Data Flow
A hook resolves its real directory, sources the helper in a trusted toolchain repository and calls it for its own name; each gate then reads its variable as before. The standards script resolves the contract directory with sk-git's lookup, refuses the shipped assets, applies one change to a parsed copy of the block, validates it with `contractShapeErrors`, writes it back in the block's own layout, and reports drift with `templateDriftErrors`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `pre-commit`, `prepare-commit-msg`, `pre-push` | Read `SPECKIT_SKIP_*` per run | Also read saved settings | `gate-config.test.sh` and the existing hook suites |
| `gates.tsv` | New registry | Create | Parity cases in `gate-config.test.sh` |
| `_routes.yaml`, router, presentation | Route the doctor commands | Add `/doctor:git` | `route-validate.sh`, `validate_document.py --type command` |
| Command contract | Declares the doctor routers | Update | Ajv against the schema, router generator `--check` |
| Runtime mirrors | Derived copies of each router | Regenerate | The sync `--check` runs and the catalog check |
| `/doctor:env`, `ENV-REFERENCE.md`, READMEs | Describe hook switches and doctor commands | Update | Link checker, catalog check |

Required inventories:
- Same-class producers: every `SPECKIT_(SKIP|ALLOW)_*` variable read by a hook script, 12 in all, each given a registry row.
- Consumers of changed symbols: the hooks that read those variables, and `/doctor:env`, which classifies them as one-run switches.
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
| Unit | The helper's scope, value and refusal rules; each script mode | `gate-config.test.sh`, `git-hook-gates.test.cjs`, `git-standards.test.cjs` |
| Integration | A real commit through the linked hook; each rules change checked with sk-git's validator | `gate-config.test.sh` case 11, `git-standards.test.cjs` |
| Regression | Every existing hook and doctor suite | The nine hook suites, `run-all.sh` |
| Manual | The integration case without the helper call | A scratch copy of the hooks folder with the call removed |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-git `message-contract.mjs` exports | Internal | Green | The standards script could not resolve or validate rules |
| Runtime mirror and prompt sync scripts | Internal | Green | Per-runtime copies would miss the new command |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A hook misbehaves or `/doctor:git` fails to dispatch after the change.
- **Procedure**: Revert the phase commit. Saved `speckit.hooks.*` keys then do nothing; remove them with `git config --unset-all` if wanted. `.sk-git/` copies stay in force because sk-git reads them itself.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Registry + helper ──► Hook wiring + tests ──► Doctor scripts + tests ──► Router, workflows, contract, docs ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Registry and helper | None | Hook wiring |
| Hook wiring and tests | Helper | Doctor scripts |
| Doctor scripts and tests | Registry | Router |
| Router, workflows, contract, docs | Scripts | Verify |
| Verify | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Gate variable and contract lookup inventory |
| Core Implementation | Med | Helper, two scripts, router, two workflows, presentation |
| Verification | Med | Hook and doctor suites, mirrors, contract, links |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not applicable, no data changes; each `set` prints its undo command
- [x] Feature flag configured: not applicable, a saved setting is itself the opt-in
- [x] Monitoring alerts set: not applicable

### Rollback Procedure
1. Revert the phase commit.
2. Rerun the mirror sync scripts so per-runtime copies match.
3. Rerun `route-validate.sh`, `run-all.sh` and the hook suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
