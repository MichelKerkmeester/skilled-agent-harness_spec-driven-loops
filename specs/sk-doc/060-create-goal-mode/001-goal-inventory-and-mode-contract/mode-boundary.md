---
title: "Mode Boundary: What sk-create-goal Owns"
description: "Assigns packet-goal rendering, validation, authoring and session-state operations to their owners, and resolves the conformance-check boundary."
trigger_phrases:
  - "packet goal authoring boundary"
  - "goal template renderer ownership"
  - "phase binding completeness check"
  - "goal runtime binding and resend"
  - "goal conformance checker"
importance_tier: important
contextType: reference
version: 1.0.0.0
---
# Mode Boundary: What sk-create-goal Owns

---

## 1. OWNERS BY OPERATION

- **Render a goal file from the template — system-spec-kit.** Its scaffold resolves the requested `goal.md` add-on and sends the selected template through `copy_template`; the inline renderer gates template sections by packet level. The template, not this mode, defines the goal-file structure (`.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:461-464`; `.skilled/skills/system-spec-kit/runtime/cli/lib/template-utils.sh:67-106`; `.skilled/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.ts:184-241`; `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:46-106`). The system-spec-kit `HOOKS` intent includes `goal.md`, nested goals and the durable slice, and routes to its goal set-string playbook (`.skilled/skills/system-spec-kit/SKILL.md:159-161,237-240`).
- **Validate a goal file — system-spec-kit for the shared structural gate; sk-create-goal for its authoring conformance check.** `validateGoalDocument` checks the durable budget for packet roots and phase parents, then checks whether listed binding targets resolve. It returns when the binding anchor is absent and does not compare rows with every direct phase child (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080`). The goal template's three-to-seven criterion guidance and placeholder text are authoring requirements, not checks in that validator (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:49,57,99-105`).
- **Bind, inject and track a resend of a session goal — the goal hooks.** The hooks own per-session state, packet binding, injection and resend tracking; the adapters expose those operations by runtime. The packet file remains the source, while `goal.cjs packet` is a session-free read that prints its slices (`.skilled/hooks/goal/README.md:24-34,65-84`; `.skilled/hooks/goal/goal-plugin.md:151-170`).
- **Set the host's native session goal — that runtime's host goal command, with the existing Spec Kit handoff.** The `/speckit:plan` workflow renders the parent chat slice for the operator to set and describes native host goal commands; it does not author the packet's goal content (`.skilled/commands/speckit/assets/speckit-plan.yaml:188-200`; `.skilled/hooks/goal/goal-plugin.md:155-160`). **UNKNOWN:** repository documentation cannot verify live Claude Code or Codex host-command behavior; the goal hooks README says the host command is re-checkable only against a live host (`.skilled/hooks/goal/README.md:81-84`; `.skilled/hooks/goal/goal-plugin.md:159-160`).
- **Author packet goal content — sk-create-goal.** This is the missing content owner for top-level packet goals, phase-parent goals and nested child goals; it uses the shared template and leaves session binding with the hooks (`specs/sk-doc/060-create-goal-mode/spec.md:74-92`; `specs/sk-doc/060-create-goal-mode/goal.md:49-54`).

---

## 2. WHAT SK-CREATE-GOAL OWNS

- Author a top-level goal from that packet's own specification and acceptance criteria (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:73-75,106-107`).
- Author a phase-parent directive and binding table from the parent Phase Documentation Map, with one row for every direct phase-child directory on disk (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:75,107`; `specs/sk-doc/060-create-goal-mode/spec.md:119-129`).
- Derive each nested phase-child goal from that child's own specification and acceptance criteria (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:76,108`).
- Add a goal to an existing packet with none as a distinct retrofit operation (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:77,109,206`).
- Add one binding row and author the new child goal when a phase has been added to both the parent map and filesystem (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:78,110`).
- Cut an over-budget parent using the existing packet measurement and ordered trim rules, preserving every criterion (`specs/sk-doc/060-create-goal-mode/005-budget-and-chat-slice-handoff/spec.md:73-78,101-104`; `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:61-71`).
- Print the parent chat slice for the operator to paste. The slice is distinct from the objective projection used by a runtime bind (`specs/sk-doc/060-create-goal-mode/005-budget-and-chat-slice-handoff/spec.md:77-78,104`; `.skilled/hooks/goal/lib/goal-slice.cjs:66-79,96-118`).

---

## 3. WHAT SK-CREATE-GOAL NEVER DOES

- It never forks the system-spec-kit goal template or changes its renderer, `create.sh` or shared validator; those are system-spec-kit-owned and remain outside this packet's implementation scope (`specs/sk-doc/060-create-goal-mode/goal.md:49-54`; `specs/sk-doc/060-create-goal-mode/spec.md:94-98`).
- It never binds a packet to a session, sets an objective, injects runtime state or records a resend. Those operations belong to the goal hooks or the host command; the mode only prints the file-derived chat slice for the operator (`specs/sk-doc/060-create-goal-mode/goal.md:51`; `.skilled/hooks/goal/README.md:65-84`; `.skilled/commands/speckit/assets/speckit-plan.yaml:188-200`).
- It never owns the `/create:goal` command, hub routing, runtime command mirrors or the manual testing playbook. The parent assigns hub routing to phase 007 and the command and playbook to phase 008 (`specs/sk-doc/060-create-goal-mode/spec.md:100-109,127-129`).
- It does not rewrite the existing goal corpus. The sole real-packet authoring exercise is the separately scoped phase-009 acceptance proof (`specs/sk-doc/060-create-goal-mode/spec.md:97-98,127-129`).

---

## 4. EXISTING WORKFLOW AND SIBLING BOUNDARIES

`/speckit:plan` owns the planning-time handoff around the packet goal: it describes the parent and child read order, the native bind actions and the chat-slice resend payload. The mode supplies goal-file content and the printable slice; the workflow and runtime owners carry the session handoff (`.skilled/commands/speckit/assets/speckit-plan.yaml:182-200`).

The sk-doc hub resolves authoring work to separate registered workflow packets and keeps packet-specific authoring logic inside those packets (`.skilled/skills/sk-doc/SKILL.md:15,50-52,159-172`). Its registry binds `sk-create-repo-rule` to its own packet and `/create:repo-rule` command, while the published mode list assigns other artifact types to sibling packets (`.skilled/skills/sk-doc/mode-registry.json:488-524`; `.skilled/skills/sk-doc/SKILL.md:25-39`). `sk-create-command` authors the command surface, while `sk-create-readme` and `sk-create-manual-testing-playbook` own their respective documentation packages (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:78-82`). The parent decision assigns goal-file content to the new sk-create-goal packet, not a general-purpose sibling (`specs/sk-doc/060-create-goal-mode/goal.md:49-54`; `specs/sk-doc/060-create-goal-mode/spec.md:85-92`).

---

## 5. CONFORMANCE CHECKER AND VALIDATOR AMENDMENT

**Verdict: Ship both a mode-local conformance checker and a separately recorded system-spec-kit validator amendment request, with the checker enforcing the authoring path and the amendment extending the shared validation gate.**

The corpus scan processed 296 goal files and reports exit zero for all 296 `goal.cjs packet` calls; it found four over-budget parents, 17 goals with placeholders including 15 objective placeholders, 36 goals outside the three-to-seven criterion range, two phase parents without binding anchors and ten parents with children that lack a goal (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/goal-corpus-scan.json:2-21`). These are recurring structure and authoring failures, not a reason to put content generation into the shared validator.

The scan's zero `parentsWithUnboundChildren` result is not proof of complete bindings: its script computes unbound children only for `per-child-rows` tables, while the scan found 39 `rangeGlobOrProse` tables and 16 `perChildRows` tables (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/goal-corpus-scan.cjs:48-56,91-95`; `specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/goal-corpus-scan.json:17-20`). A row-level negative control and a comparison against direct phase directories are therefore necessary; phase 004 already defines that comparison for the authoring workflow (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:75,107`).

The mode-local checker can fail an authoring run for missing phase coverage, template placeholders, criterion counts outside three to seven and parent budget, with fixtures that prove each result. It cannot make unrelated manual edits pass through that mode, so it cannot replace a shared validator gate (`specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/spec.md:43,49-52,74-78,89-91`). The shared validator can apply structural rules wherever the normal spec-kit validation runs, but its current goal-specific function only measures the budget and resolves rows it finds (`.skilled/skills/system-spec-kit/runtime/lib/validation/spec-doc-structure.ts:1050-1080`). Semantic criterion quality still needs the mode's reader-applied authoring standard: the corpus includes a criterion whose answer depends on opening other files (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:42`; `specs/sk-doc/060-create-goal-mode/003-authoring-standards-and-exemplars/spec.md:75-79`).

Phase 006 must build `scripts/check-goal.cjs`, its test and fixture files, a positive fixture plus named negative controls, and a read-only corpus report; it must also record the shared-validator amendment request in its existing planning or closeout record and leave the validator itself unchanged (`specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/spec.md:43,49-52,74-91,117-118`; `specs/sk-doc/060-create-goal-mode/spec.md:94-99,126`). This follows D4 without expanding this mode packet into a system-spec-kit implementation (`specs/sk-doc/060-create-goal-mode/goal.md:49-54`).
