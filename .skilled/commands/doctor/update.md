---
description: Route /doctor:update check, align or apply operations for a spec-kit release.
argument-hint: "[check|align|apply] [--json] [--release=<tag>] [--scope=all|<unit,...>] [--offline] [--dry-run] [--decisions=<path>] [--include-prerelease]"
allowed-tools: Read, Bash, Grep, Glob
---
<!-- skill_agent: system-spec-kit -->

# /doctor:update Router

This command routes release-aware check, align and apply workflows. It parses and validates action flags before loading a workflow YAML.

## 1. ROUTER CONTRACT

Do not dispatch agents from this Markdown file. Do not edit workflow YAML while executing this command.

Load the presentation contract before showing action errors, startup questions, dashboards, evidence cards, approval prompts, results or next steps. Bare `/doctor:update` runs the read-only `check` action. The command is confirm-only and has no `:auto` or `:confirm` suffix.

Reject an unknown action or any flag that is invalid for the selected action before loading that action's YAML. Normalize equals-form values such as `--release=<tag>`, `--scope=<value>` and `--decisions=<path>` to the engine's separate flag and value form. Do not pass router-only arguments to the engine.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation source of truth | `.skilled/commands/doctor/assets/doctor-update-presentation.txt` |
| Check workflow | `.skilled/commands/doctor/assets/doctor-update-check.yaml` |
| Align workflow | `.skilled/commands/doctor/assets/doctor-update-align.yaml` |
| Apply workflow | `.skilled/commands/doctor/assets/doctor-update-apply.yaml` |

---

## 3. MODE ROUTING

- Resolve the first positional token as `check`, `align` or `apply`; when absent, select `check`.
- `check` accepts `--json`, `--release=<tag>`, `--scope=all|<unit,...>`, `--offline` and `--include-prerelease`.
- `align` accepts `--release=<tag>`, `--scope=all|<unit,...>`, `--offline`, `--dry-run` and `--include-prerelease`.
- `apply` accepts `--decisions=<path>`, `--dry-run`, `--release=<tag>`, `--scope=all|<unit,...>` and `--include-prerelease`.
- A `--scope` unit is a plain name or a `<kind>:<name>` key such as `skill:hub-a` or `directory:hooks`; a name that two kinds share needs the key form, and the engine rejects it otherwise.
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

`check` reports release position and per-unit status without changing checkout files. `align` gathers explicit decisions into an ignored run directory and never writes outside it. `apply` previews the plan, requests one approval before its first write, applies selected decisions and verifies the resulting checkout; with no unapplied alignment run at the current HEAD it writes only update and new units. The three workflows share the release-update engine while retaining action-specific input and mutation boundaries.

Release policy: latest-upstream resolution takes stable tags only unless `--include-prerelease` is passed, and both orders compare version segments as numbers. Generated files (leaf manifests, the trigger index and its sidecars, and graph-metadata `derived` blocks) never count as customizations; apply names their generators instead of writing them.

First run after copying or installing `.skilled/`: `check` reports `baseRecording.needed` and names the engine's `record-base --release <installed-release>` action. With the operator's approval, run it once and commit `.skilled/release/base.json`, so later checks compare against a recorded base instead of an inferred one.
