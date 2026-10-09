---
description: Route /doctor:update check, align, apply, rollback, record-base or compat operations for a spec-kit release.
argument-hint: "[check|align|apply|rollback|record-base|compat] [--release=<tag>] [--scope=all|<unit,...>] [--remote=<name-or-url>] [--dry-run] [flags]"
allowed-tools: Read, Bash
---
<!-- skill_agent: system-spec-kit -->

# /doctor:update Router

This command routes release-aware check, align, apply, rollback, record-base and compat workflows. It parses and validates action flags before loading a workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing action errors, startup questions, dashboards, evidence cards, approval prompts, results or next steps. Bare `/doctor:update` runs the `check` action, which is read-only for the checkout. The command is confirm-only and has no `:auto` or `:confirm` suffix.

Reject an unknown action or any flag that is invalid for the selected action before loading that action's YAML. Normalize equals-form values such as `--release=<tag>`, `--scope=<value>`, `--decisions=<path>`, `--remote=<name-or-url>` and `--run=<runDir>` to the engine's separate flag and value form. Do not pass router-only arguments to the engine.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-update-presentation.txt` |
| Check workflow | `.skilled/commands/doctor/assets/doctor-update-check.yaml` |
| Align workflow | `.skilled/commands/doctor/assets/doctor-update-align.yaml` |
| Apply workflow | `.skilled/commands/doctor/assets/doctor-update-apply.yaml` |
| Rollback workflow | `.skilled/commands/doctor/assets/doctor-update-rollback.yaml` |
| Record-base workflow | `.skilled/commands/doctor/assets/doctor-update-record-base.yaml` |
| Compatibility workflow | `.skilled/commands/doctor/assets/doctor-update-compat-action.yaml` |

---

## 3. MODE ROUTING

- When no action is supplied, select `check`. Otherwise, resolve the first positional token as `check`, `align`, `apply`, `rollback`, `record-base` or `compat`.
- `check` accepts `--json`, `--release=<tag>`, `--scope=all|<unit,...>`, `--offline`, `--include-prerelease` and `--remote=<name-or-url>`.
- `align` accepts `--release=<tag>`, `--scope=all|<unit,...>`, `--offline`, `--dry-run`, `--include-prerelease` and `--remote=<name-or-url>`.
- `apply` accepts `--decisions=<path>`, `--dry-run`, `--release=<tag>`, `--scope=all|<unit,...>`, `--include-prerelease`, `--offline` and `--remote=<name-or-url>`.
- `rollback` accepts `--run=<runDir>` and `--dry-run`.
- `record-base` accepts `--release=<tag>`, `--remote=<name-or-url>`, `--scope=all|<unit,...>`, `--offline`, `--include-prerelease`, `--trust-release` and `--dry-run`.
- `compat` accepts `--dry-run` and `--offline`.
- A `--scope` unit is a plain name or a `<kind>:<name>` key such as `skill:hub-a` or `directory:hooks`. Use the kind-qualified form when two kinds share a name. The engine rejects a plain name in that case.
- Reject cross-action and unknown flags before loading a workflow YAML. Do not infer confirmation suffixes or modes.
- Follow the selected workflow's state-log schema and terminal-status rules. If an owned asset is missing, stop and report its path.
- The YAML owns workflow behavior. The presentation asset owns visible wording and layout.

---

## 4. EXECUTION TARGETS

1. Read `.skilled/commands/doctor/assets/doctor-update-presentation.txt`.
2. Parse `$ARGUMENTS`, select the action, normalize its values and reject unsupported or cross-action flags before loading YAML.
3. Bind only that action's inputs, then load its matching workflow YAML.
4. Execute the selected YAML phase by phase and pass only engine-supported flags to `release-update.cjs`.
5. Use the presentation asset for action errors, prompts, dashboards, evidence cards, plans, results and next steps.

---

## 5. PRESENTATION BOUNDARY

All visible text and layouts live only in `.skilled/commands/doctor/assets/doctor-update-presentation.txt`, including action and flag errors, the check dashboard, align decision batches, apply approval and recovery prompts, result templates and next steps.

---

## 6. WORKFLOW SUMMARY

`check` reports release position and per-unit status without changing checkout files. `align` gathers explicit decisions into an ignored run directory and never writes outside it. `apply` previews the plan, requests one approval before its first write, applies selected decisions and verifies the resulting checkout. When no unapplied alignment run exists at the current HEAD, it writes only update and new units. `rollback` previews a recorded rollback, then asks before restoring paths or clearing a stale lock. `record-base` previews the units for a release and asks before writing the recorded base. `compat` previews the v3-to-v4 layout move and the legacy upgrade, asks for the move and the upgrade as two separate approvals, and runs both outside the release engine's transaction. The other five actions share the release-update engine while retaining action-specific input and mutation boundaries.

Release policy: latest-upstream resolution takes stable tags only unless `--include-prerelease` is passed. Both orders compare version segments as numbers. A tag named with `--release` is used as given. Generated files (leaf manifests, the trigger index and its sidecars, compiled-route activation manifests, and graph-metadata `derived` blocks) never count as customizations. A copy the operator regenerated stays in place and apply names its generator, while a release change to a copy the operator never regenerated is applied like any other file.

A first run on a copied or freshly installed tree reports `baseRecording.needed`. The `record-base` action records the base, and the presentation's base-recording template owns what the operator is told.

---

## 7. EXTERNAL-USER COMPATIBILITY PATH

1. `/doctor:update` (read Spec Folder Compatibility).
2. `/doctor:update compat --dry-run` (it writes nothing; on a tree that still needs the move, it shows the path map and collisions only, and failing packets are previewed after the move; on a tree already in the v4 layout, it also shows failing packets).
3. Resolve collisions and leave `specs/` and `.opencode/specs` clean.
4. `/doctor:update compat` (approve the move, then approve the upgrade).
5. Undo with the presentation's Compatibility rollback block.

Warnings:

- The move refuses a dirty spec root because it keeps no before-image.
- On a dirty tree, `upgrade-legacy --apply` writes a before-image manifest at `<git-dir>/upgrade-legacy.manifest.json` before its first change, or refuses.
- Units with status update or new must go through `/doctor:update apply` first.
- The move log is at `<git-dir>/doctor-update-compat.log.jsonl`.
