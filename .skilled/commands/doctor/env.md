---
description: Inspect documented environment switches and confirm preference changes.
argument-hint: "[list | <section> | <VARIABLE>] [--dry-run]"
allowed-tools: Read, Bash
---
<!-- skill_agent: system-spec-kit -->

# Doctor Environment Switches

Thin router for inspecting the documented environment switches and changing a selected preference. Read the live reference and the owned presentation contract, then execute the workflow asset. Do not keep a switch inventory in this router.

## 1. ROUTER CONTRACT

Do not dispatch agents. This router owns argument parsing and asset loading only. Load the presentation asset before showing any prompt, menu, table, error, or status. The workflow owns inventory parsing, read-only inspection, operator questions, and any explicitly confirmed preference write.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Workflow | .skilled/commands/doctor/assets/doctor-env.yaml |
| Presentation source of truth | .skilled/commands/doctor/assets/doctor-env-presentation.txt |

---

## 3. MODE ROUTING

1. Parse $ARGUMENTS: accept list, one section heading, or one variable name, plus optional --dry-run.
2. Reject unknown flags, more than one selector, or extra positional arguments with the presentation contract's error.
3. With list, print the live inventory and source-state table, then stop.
4. With a section or variable selector, process that selection. With no selector, show the selection menu and wait.
5. A selector and --dry-run are workflow inputs, not execution modes.

---

## 4. EXECUTION TARGETS

| Selection | Target |
|-----------|--------|
| Any valid invocation | .skilled/commands/doctor/assets/doctor-env.yaml |
| All visible prompts, tables, errors, and statuses | .skilled/commands/doctor/assets/doctor-env-presentation.txt |

---

## 5. PRESENTATION BOUNDARY

Every user-visible prompt, menu, inventory or state table, preference display, destination choice, preview, confirmation, error, and terminal status is defined in the presentation asset. Keep those strings and layouts out of this router.

---

## 6. WORKFLOW SUMMARY

1. Read .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md at invocation time and parse both documented table shapes.
2. Display the deduplicated live switch inventory and read-only set/unset state for each supported source.
3. Resolve the requested section or variable, then explain secret and per-invocation switches without requesting or persisting their values.
4. For selected preferences, validate the requested value, show the exact proposed line and destination, and write only after an explicit yes. --dry-run shows the same preview without writing.
5. Re-read any file changed by an approved write and finish with one contract status.
