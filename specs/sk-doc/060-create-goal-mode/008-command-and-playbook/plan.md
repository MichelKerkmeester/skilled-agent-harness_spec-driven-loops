---
title: "Implementation Plan: Phase 8: command-and-playbook"
description: "Plan the /create:goal command surface and its eight-scenario goal-authoring playbook through the repository's command and manual-testing workflows."
trigger_phrases:
  - "create-goal command plan"
  - "goal command mirrors"
  - "goal-authoring playbook package"
  - "goal command argument hint"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: command-and-playbook

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML and JSON command and playbook documents. |
| **Framework** | `sk-create-command` and `sk-create-manual-testing-playbook` authoring workflows. |
| **Storage** | Repository files only; no runtime state or data store. |
| **Testing** | Shared command document checks, Node JSON parsing, mirror path checks, playbook package validator and strict spec-folder validator. |

### Overview

This phase adds `/create:goal` with its router, auto and confirm workflow assets, presentation contract, metadata entry, index row and four runtime mirrors. The command files must be authored through `sk-create-command`, and the playbook must use the root-index and per-feature scenario package contract (`.skilled/skills/sk-doc/sk-create-command/SKILL.md:170-181, 329-365`; `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:150-175, 216-263`).

The playbook has eight scenarios for the required goal shapes, validation boundaries and routing behavior. Each scenario needs exact prompts, command sequences, expected signals, evidence requirements and pass/fail criteria, and the package validator is the release gate (`.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:251-263, 352-360, 447-490`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004 has an accepted operation list that can be copied into the argument hint without guessing (specs/sk-doc/060-create-goal-mode/spec.md:157-159).
- [ ] Phase 007 has evidence for real requests reaching the mode through both routing stages (specs/sk-doc/060-create-goal-mode/spec.md:147-149).
- [ ] The command and playbook workflows are loaded before their artifacts are authored (.skilled/skills/sk-doc/sk-create-command/SKILL.md:96-115; .skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:316-337).

### Definition of Done
- [ ] All acceptance criteria have evidence from the named checks in `acceptance-criteria.md`.
- [ ] The four runtime mirror paths resolve, and the command metadata JSON parses.
- [ ] The playbook package validator reports `PASS` with eight scenarios.
- [ ] Strict validation of this phase has no errors beyond the three expected generated-metadata rules.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Use the existing split-router command shape: the router selects the workflow asset, while the presentation file owns user-facing prompts and results (.skilled/commands/create/repo-rule.md:11-28, 32-60; .skilled/commands/create/assets/create-repo-rule-auto.yaml:4-18; .skilled/commands/create/assets/create-repo-rule-confirm.yaml:4-17; .skilled/commands/create/assets/create-repo-rule-presentation.txt:1-3; .skilled/skills/sk-doc/sk-create-command/SKILL.md:329-365).

### Key Components
- **Command router and assets**: `.skilled/commands/create/goal.md` plus `create-goal-auto.yaml`, `create-goal-confirm.yaml` and `create-goal-presentation.txt`.
- **Command registration**: one `command-metadata.json` entry and one create-command README row (.skilled/skills/sk-doc/command-metadata.json:359-391; .skilled/commands/create/README.txt:28-40, 44-60).
- **Runtime mirrors**: `.claude/commands/create/goal.md`, `.codex/prompts/create-goal.md`, `.pi/prompts/create-goal.md` and `.cursor/commands/create-goal.md`.
- **Manual testing package**: `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/manual-testing-playbook.md` and eight files under `goal-authoring/`, matching the package's documented root-index and category layout (.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:150-175, 216-263): `top-level-goal.md`, `phase-parent-and-nested-child-goals.md`, `add-goal-to-packet-without-goal.md`, `cut-over-budget-parent.md`, `refuse-leftover-placeholder.md`, `detect-unbound-phase.md`, `route-session-goal-away.md` and `resend-parent-after-child-change.md`.

### Data Flow

The operator invokes `/create:goal` with an operation established by Phase 004. The router loads the mode contract and presentation contract, then maps `:auto` or `:confirm` to its matching YAML asset; the command authoring contract requires every advertised suffix to resolve to a wired workflow target (.skilled/skills/sk-doc/sk-create-command/SKILL.md:313-327, 329-365). The mode writes packet goal files and does not take over session-goal setting (specs/sk-doc/060-create-goal-mode/spec.md:94-98).

The root playbook indexes the eight canonical scenario files. The package validator checks the operator-scenario contract and reports the scenario count (.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:166-175, 470-490).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This phase plans documentation and command assets, not a code defect or a shared runtime policy change.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/commands/create/goal.md` and its three assets | Command router, execution workflows and presentation | Create through `sk-create-command` | Shared command document validation; inspect both mode targets (.skilled/skills/sk-doc/sk-create-command/SKILL.md:383-408). |
| `.skilled/skills/sk-doc/command-metadata.json` | Command owner and invocation metadata | Add one entry | Parse JSON with Node and inspect `/create:goal` entry. |
| `.skilled/commands/create/README.txt` | Human-facing command index | Add one row | `rg -n '/create:goal' .skilled/commands/create/README.txt` returns one row. |
| Four runtime command destinations | Runtime mirrors of the canonical command | Create mirrors | `test -f` succeeds for each exact destination. |
| Mode playbook package | Root index and per-feature manual scenarios | Create root and eight files | Package validator reports `PASS` and eight scenarios (.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:447-490). |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification task state.

### Phase 1: Resolve prerequisites and targets

Read the accepted Phase 004 operation decision and Phase 007 routing handoff. If either result is absent, do not invent a command operation or claim the mode is reachable. Confirm the command metadata entry and playbook destinations before authoring.

### Phase 2: Author the command and playbook

Invoke `/create:command` for `/create:goal` through `sk-create-command`. Then run `/create:manual-testing-playbook sk-create-goal create --path .skilled/skills/sk-doc :confirm` through `sk-create-manual-testing-playbook` with `manual-scenarios` as the source strategy and `spec_choice: D` to avoid its separate spec-tracking writes. The playbook workflow derives the package root from `skill_path` and `skill_name`; when `spec_path` is set, it also writes tracking documents and runs its continuity writer, which are outside this phase's six-document write scope (.skilled/commands/create/assets/create-manual-testing-playbook-presentation.txt:54-66, 82-101; .skilled/commands/create/assets/create-manual-testing-playbook-confirm.yaml:285-306, 377-407). The `:confirm` run retains its category and root-preview checkpoints (.skilled/commands/create/manual-testing-playbook.md:2-4, 30-50; .skilled/commands/create/assets/create-manual-testing-playbook-confirm.yaml:315-362). Add the metadata entry, README row and four runtime mirrors from the scoped file list in `spec.md`.

### Phase 3: Verify command, mirrors and package

Run the command-authoring checks, parse `command-metadata.json`, verify each mirror with `test -f`, and run the playbook package validator against its exact root. Finish with strict validation of this phase folder and read the result line and exit status.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Command structure | Router frontmatter, section shape and authored command name | `python3 .skilled/skills/sk-doc/shared/scripts/check_authored_name_kebab.py .skilled/commands/create/goal.md`; `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/commands/create/goal.md --type command`; `python3 .skilled/skills/sk-doc/shared/scripts/extract_structure.py .skilled/commands/create/goal.md` (.skilled/skills/sk-doc/sk-create-command/SKILL.md:383-408). |
| Metadata and index | JSON parses; one command entry has the correct owner and operation hint; README has one row | `node -e 'JSON.parse(require("node:fs").readFileSync(".skilled/skills/sk-doc/command-metadata.json","utf8"))'`; `rg -n '/create:goal' .skilled/commands/create/README.txt`; inspect the entry against Phase 004's accepted operation list. |
| Runtime mirrors | Each exact path resolves to a file | `for path in .claude/commands/create/goal.md .codex/prompts/create-goal.md .pi/prompts/create-goal.md .cursor/commands/create-goal.md; do test -f "$path" || exit 1; done` |
| Playbook package | Root and eight indexed scenarios satisfy the operator contract | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook` (.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:447-490). |
| Spec-folder structure | This Level 2 phase has no non-metadata validation errors | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/008-command-and-playbook --strict` (specs/sk-doc/060-create-goal-mode/spec.md:133-136). |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 operation decision | Internal, upstream | UNKNOWN in the current phase scaffold; parent assigns the decision to Phase 004 (specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:42-48, 89-103; specs/sk-doc/060-create-goal-mode/spec.md:157-159). | The argument hint cannot be finalized without inventing tokens. |
| Phase 007 routing handoff | Internal, upstream | Its current `spec.md` is Draft; verify the completed handoff evidence before execution (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:24-32; specs/sk-doc/060-create-goal-mode/spec.md:147-149). | Command packaging cannot establish mode reachability by itself. |
| `sk-create-command` | Internal authoring workflow | Available; contract requires a thin router, wired suffix targets and presentation separation (.skilled/skills/sk-doc/sk-create-command/SKILL.md:313-365). | Command assets must not be hand-authored as a substitute. |
| `sk-create-manual-testing-playbook` | Internal authoring workflow | Available; its package validator and file contract are documented (.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md:150-175, 447-490). | The playbook cannot pass its package gate. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A command validator fails after repair, a suffix targets the wrong workflow, a runtime mirror does not resolve, or the playbook package fails its validator.
- **Procedure**: Remove only the newly created router, three command assets, four runtime mirrors and playbook package. Remove only the `/create:goal` entry from `command-metadata.json` and its row from `README.txt`. Re-run the JSON parse, mirror checks and package validator to confirm the new surfaces are absent and the remaining command index still parses. Do not remove the `sk-create-goal` mode or alter hub routing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 004 operation decision and Phase 007 routing handoff | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

No hour estimate is recorded. The execution gate is completion of the named artifacts and checks, not a time budget.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Not estimated | Not tracked |
| Implementation | Not estimated | Not tracked |
| Verification | Not estimated | Not tracked |
| **Total** | | **Not tracked** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- No data backup is needed; the planned outputs are repository documents and command files.
- No feature flag is planned; command presence and runtime mirrors are the activation surfaces.
- Monitor the command validators, mirror checks and playbook package validator during implementation.

### Rollback Procedure
1. Remove only the new command router, assets, mirrors and playbook package.
2. Remove the `/create:goal` entry from `command-metadata.json` and the corresponding README row.
3. Re-run the command metadata JSON parse, four `test -f` checks and playbook package validator.
4. Confirm the parent mode and its routing entries remain unchanged.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable; no data store or migration is part of this phase.
<!-- /ANCHOR:enhanced-rollback -->

---
