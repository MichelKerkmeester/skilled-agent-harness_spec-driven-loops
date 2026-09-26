---
title: "Implementation Plan: Phase 2: mode-scaffold"
description: "Scaffold the unregistered sk-create-goal packet from the create-skill nested-packet pattern and phase 001's target tree. Verify the package shape while preserving the expected single parent-skill 6a failure."
trigger_phrases:
  - "sk-create-goal scaffold plan"
  - "nested goal packet files"
  - "goal mode package check"
  - "expected parent-skill 6a"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: mode-scaffold

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill packet with optional checker directory, selected by phase 001 (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`). |
| **Framework** | Nested workflow packet under the sk-doc hub (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:297-318`). |
| **Storage** | None. The phase authors packet files and directories only (`specs/sk-doc/060-create-goal-mode/spec.md:85-109`). |
| **Testing** | Strict package check, parent-skill check, phase validator and final tree scan (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:370-391`) (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:242-255`) (`specs/sk-doc/060-create-goal-mode/spec.md:131-136`). |

### Overview

Build the nested packet from the create-skill packet pattern after phase 001 supplies its final tree and checker choice (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/spec.md:85-94`) (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:307-318`). Keep it unregistered until phase 007. Then verify package PASS and the one expected `6a` parent-skill failure (`specs/sk-doc/060-create-goal-mode/spec.md:127,142-143,148`).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001's final `mode-boundary.md` records the checker owner and `target-tree.md` lists the packet contents (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/spec.md:85-94`).
- [ ] The target mode directory is absent. If it exists, stop before writing (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:27-50`).
- [ ] The baseline parent-skill check output and exit status are recorded before the new child directory appears (`specs/sk-doc/049-sk-create-frontmatter/002-mode-scaffold/implementation-summary.md:127-134`).
- [ ] The nested packet scaffold and sibling mode example have been read before writing (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:216-243`) (`.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md:163-171`).

### Definition of Done
- [ ] The packet matches phase 001's target tree and conditionally includes `scripts/` (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/spec.md:89-94`).
- [ ] The strict package check prints `Result: PASS` and the parent-skill check reports only invariant `6a` (`specs/sk-doc/049-sk-create-frontmatter/README.md:168-171` and `specs/sk-doc/060-create-goal-mode/spec.md:143`).
- [ ] The phase validator prints `RESULT: PASSED` after generated metadata is reconciled (`specs/sk-doc/060-create-goal-mode/spec.md:131-136`).
- [ ] The mode root contains no goal-template copy or nested hub identity metadata (`specs/sk-doc/060-create-goal-mode/goal.md:50`) and (`.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:62-72`).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A nested workflow packet whose hub identity remains sk-doc's. Nested packets do not carry their own `graph-metadata.json` or `description.json` (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:38-41,273-275`) (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:59`). The verified mode-anatomy audit records the hub-plus-packet shape (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:25-36`). The `sk-create-repo-rule` packet supplies a sibling workflow example (`.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md:163-171`) (`specs/sk-doc/z_archive/040-create-repo-rules/003-skill-scaffold-and-template/implementation-summary.md:67-70,90-97`).

### Key Components
- **`SKILL.md`**: Runtime contract for packet-goal authoring, renderer ownership and request boundaries (`specs/sk-doc/060-create-goal-mode/goal.md:49-54`) (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:49-53`).
- **`README.md` and `references/README.md`**: Short reader entry point and reference index, following the nested-packet pattern (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:40-49`) (`specs/sk-doc/z_archive/040-create-repo-rules/003-skill-scaffold-and-template/spec.md:77-83,93-104`).
- **Resource directories**: Reserve `assets/` for phase 003 exemplars and `changelog/` for later release notes. Create `scripts/` only if phase 001 selects a local checker (`specs/sk-doc/060-create-goal-mode/spec.md:123,126,129`) (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`).

### Data Flow

The future workflow accepts a goal-file authoring request and reads packet-local guidance. It then renders the system-spec-kit goal template for the requested level. It must not treat session-goal management as file authoring because the goal hooks own runtime state (`specs/sk-doc/060-create-goal-mode/goal.md:49-54`) (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:14-18,49-53`). The future `SKILL.md` should name `create.sh --with-goal` or the inline renderer command `bash .skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh --level phase --out-dir "$GOAL_PACKET_DIR" .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl` (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:14-15`) (`.skilled/skills/system-spec-kit/runtime/cli/templates/README.md:28-49`) (`.skilled/skills/system-spec-kit/references/templates/template-guide.md:81-85`). Do not rely on `create.sh --phase --with-goal` alone for a phase parent because the audit found that path creates child goals but no parent goal (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:14,70`).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet scaffold does not change either existing owner. System-spec-kit remains the template and renderer owner, while phase 007 owns hub registration (`specs/sk-doc/060-create-goal-mode/goal.md:49-54`) (`specs/sk-doc/060-create-goal-mode/spec.md:127,142-143`).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| System-spec-kit goal template and renderer | Render level-gated goal documents (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:10-18`). | Reference only. Do not edit or copy. | Inspect mode `SKILL.md` for renderer references and confirm no local `goal.md.tmpl` exists. |
| sk-doc hub registration | Selects and registers modes (`specs/sk-doc/060-create-goal-mode/spec.md:127,142-143,148`). | Leave unchanged until phase 007. | Run `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc`. Expect only `6a` for `sk-create-goal` (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:242-255`). |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Use `Read` to inspect phase 001's contract, target tree and source templates. Use `Write` to author packet files. Use `Bash` for preflight and validation commands, then use `rg` and `find` to inspect renderer references and the final packet tree (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:216-243`) (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/spec.md:85-94`). First record the parent-check baseline. Then create only the packet files and directories allowed by its target tree. Finish with the strict package check, parent-skill check and this phase's strict validator (`specs/sk-doc/060-create-goal-mode/spec.md:131-143`).

| Target path | Action | Observable check |
|-------------|--------|------------------|
| `.skilled/skills/sk-doc/sk-create-goal/SKILL.md` | Create from the nested packet scaffold. | `rg -n 'create.sh --with-goal|inline-gate-renderer.sh' .skilled/skills/sk-doc/sk-create-goal/SKILL.md` finds the renderer contract (`specs/sk-doc/060-create-goal-mode/goal.md:50`). |
| `.skilled/skills/sk-doc/sk-create-goal/README.md` | Create a short reader stub. | `test -f .skilled/skills/sk-doc/sk-create-goal/README.md`. |
| `.skilled/skills/sk-doc/sk-create-goal/references/README.md` | Create the reference index. | `test -f .skilled/skills/sk-doc/sk-create-goal/references/README.md`. |
| `.skilled/skills/sk-doc/sk-create-goal/assets/` | Create the directory reserved for phase 003 exemplars. | `test -d .skilled/skills/sk-doc/sk-create-goal/assets/` (`specs/sk-doc/060-create-goal-mode/spec.md:123`). |
| `.skilled/skills/sk-doc/sk-create-goal/changelog/` | Create the packet history directory. | `test -d .skilled/skills/sk-doc/sk-create-goal/changelog/` (`specs/sk-doc/060-create-goal-mode/spec.md:129`). |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/` | Create only for a phase 001 local-checker choice. | `test -d .skilled/skills/sk-doc/sk-create-goal/scripts/` only when that choice is recorded (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`). |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Package | Validate the new nested packet in strict mode. | `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/sk-doc/sk-create-goal --check --strict`. Require `Result: PASS` (`specs/sk-doc/049-sk-create-frontmatter/README.md:168-171`). |
| Parent integration | Confirm the unregistered child causes only invariant `6a`. | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc`. Require the named `6a` failure and no other failure (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:242-255`) (`specs/sk-doc/060-create-goal-mode/spec.md:143`). |
| Phase documents | Validate the complete planning packet. | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode/002-mode-scaffold --strict`. Require `RESULT: PASSED` after generated metadata is current (`specs/sk-doc/060-create-goal-mode/spec.md:131-136`). |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 ownership contract, target tree and checker decision | Internal | Pending. Phase 001 summary says its execution and checker decision remain open (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`). | Do not create the packet until its final tree and checker owner are known. |
| sk-create-skill nested-packet pattern | Internal | Available (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:297-318`). | Use its packet shape and metadata boundary. |
| Package and parent-skill checkers | Internal | Available (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:370-391`) (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:242-255`). | The outgoing handoff cannot be proven. |
| System-spec-kit goal renderer | Internal | Available (`.skilled/skills/system-spec-kit/runtime/cli/templates/README.md:28-49`). | Do not substitute a local goal template. Record the blocker. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The mode directory exists before the phase starts, a phase-created file falls outside the predecessor's target tree, or either packet gate reports an unexpected result (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/spec.md:89-94`) (`specs/sk-doc/060-create-goal-mode/spec.md:143`).
- **Procedure**: Halt before overwriting an existing mode directory. If a rollback is requested after a first-time scaffold, preserve any pre-existing path and obtain explicit approval before deleting task-created untracked files. Remove only the new `.skilled/skills/sk-doc/sk-create-goal/` tree, then rerun the parent-skill check. Do not edit hub registration or suppress invariant `6a` (`specs/sk-doc/060-create-goal-mode/spec.md:127,142-143`) (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:242-248`).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup: phase 001 handoff and baseline)
                    |
                    v
Phase 2 (Implementation: nested packet scaffold)
                    |
                    v
Phase 3 (Verification: package gate, parent gate, phase validator and tree comparison)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 contract, target tree and checker decision | Implementation |
| Implementation | Setup complete and mode root absent | Verification |
| Verification | Packet files and conditional directories present | Phase 003 handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Read predecessor outputs and record the gate baseline. |
| Core Implementation | Medium | Create packet documents and conditional resource directories. |
| Verification | Low | Run package, parent-skill and phase validators. |
| **Total** | | **Relative effort only. Duration UNKNOWN.** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No registry, router, command or runtime files are changed in this phase (`specs/sk-doc/060-create-goal-mode/spec.md:104-109,127-129`).
- [ ] The target mode root is absent before scaffold begins. The future preflight command is `test ! -e .skilled/skills/sk-doc/sk-create-goal` (`specs/sk-doc/060-create-goal-mode/spec.md:104`).
- [ ] Explicit approval is obtained before deleting any task-created untracked packet files (`.skilled/repo-rules/blast-radius.md:61-68,84-95`).
- [ ] Read the package command output and exit status before handing off (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:370-391`).

### Rollback Procedure
1. Stop if the mode directory exists before the phase begins.
2. If an unexpected gate result appears, leave the mode unregistered and record the exact output.
3. If rollback is requested, obtain explicit approval before removing the new packet tree.
4. After an approved rollback, rerun `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` and read its output and exit status (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:242-248`).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable. This phase creates documentation files and directories only (`specs/sk-doc/060-create-goal-mode/spec.md:85-109`).
<!-- /ANCHOR:enhanced-rollback -->
