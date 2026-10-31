---
title: "Target Tree for the sk-create-goal Packet"
description: "The phase-assigned mode packet tree, its conditional conformance checker, and every sk-doc hub, command and release surface planned for phases 002-009."
trigger_phrases:
  - "sk-create-goal target tree"
  - "goal mode packet files"
  - "sk-doc hub files for create goal"
  - "goal command runtime mirrors"
importance_tier: important
contextType: reference
version: 1.0.0.0
---
# Target Tree for the sk-create-goal Packet

The mode follows the nested sk-doc packet shape: a hub owns routing identity, and each mode packet owns its `SKILL.md`, reader-facing entry point, references, assets and packet changelog (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:27-50,59`; `.skilled/skills/sk-doc/SKILL.md:149-152`). The concrete shape precedent, `.skilled/skills/sk-doc/sk-create-repo-rule/`, contains `SKILL.md`, `README.md`, `assets/`, `references/`, `scripts/`, `manual-testing-playbook/` and `changelog/` (`ls .skilled/skills/sk-doc/sk-create-repo-rule`). The paths below are assigned to phases 002-009 by the goal-mode phase specifications (`specs/sk-doc/060-create-goal-mode/spec.md:119-129`).

---

## 1. MODE PACKET

- `.skilled/skills/sk-doc/sk-create-goal/` — Phase 002 creates the nested workflow packet root (`specs/sk-doc/060-create-goal-mode/002-mode-scaffold/spec.md:42,48-51,75-80`).
- `.skilled/skills/sk-doc/sk-create-goal/SKILL.md` — Phase 002 creates the workflow contract; phases 003 and 004 add the standards and parent/child authoring routes (`specs/sk-doc/060-create-goal-mode/002-mode-scaffold/spec.md:48-51,75-96`; `specs/sk-doc/060-create-goal-mode/003-authoring-standards-and-exemplars/spec.md:48-51,89-95`; `specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:48-50,91-94`).
- `.skilled/skills/sk-doc/sk-create-goal/README.md` — Phase 002 creates a short stub; phase 009 completes the mode README through `sk-create-readme` (`specs/sk-doc/060-create-goal-mode/002-mode-scaffold/spec.md:48-50,91-95`; `specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/spec.md:82-86,101-102`).
- `.skilled/skills/sk-doc/sk-create-goal/references/` — Phase 002 creates this packet-local reference directory through its index (`specs/sk-doc/060-create-goal-mode/002-mode-scaffold/spec.md:48-50,77,93`).
- `.skilled/skills/sk-doc/sk-create-goal/references/README.md` — Phase 002 creates the index; phases 003 and 004 add links to their references (`specs/sk-doc/060-create-goal-mode/002-mode-scaffold/spec.md:48-50,93`; `specs/sk-doc/060-create-goal-mode/003-authoring-standards-and-exemplars/spec.md:48-51,91-95`; `specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:48-50,91-93`).
- `.skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md` — Phase 003 defines the goal-content quality standards (`specs/sk-doc/060-create-goal-mode/003-authoring-standards-and-exemplars/spec.md:48-50,91-94`).
- `.skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md` — Phase 004 defines top-level, phase-parent, child, retrofit, phase-add and amendment workflows (`specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/spec.md:48-50,91-94`).
- `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md` — Phase 005 documents parent budget measurement, trimming order, the chat-slice handoff and runtime boundary (`specs/sk-doc/060-create-goal-mode/005-budget-and-chat-slice-handoff/spec.md:48-50,73-90`).
- `.skilled/skills/sk-doc/sk-create-goal/assets/` — Phase 002 reserves the directory for goal exemplars (`specs/sk-doc/060-create-goal-mode/002-mode-scaffold/spec.md:48-50,78,94`).
- `.skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md` — Phase 003 adds cited negative and positive examples (`specs/sk-doc/060-create-goal-mode/003-authoring-standards-and-exemplars/spec.md:48-51,92`).
- `.skilled/skills/sk-doc/sk-create-goal/scripts/` — Phase 002 creates this directory because the selected contract includes a mode-local checker (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/mode-boundary.md:59-67`; `specs/sk-doc/060-create-goal-mode/002-mode-scaffold/spec.md:48-50,78,94-96`).
- `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` — Phase 006 builds read-only binding-coverage, placeholder, criterion-count and budget checks (`specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/spec.md:43,49-52,74-89`).
- `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/check-goal.test.cjs` — Phase 006 tests a positive fixture and six named negative controls (`specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/spec.md:74-78,90`).
- `.skilled/skills/sk-doc/sk-create-goal/scripts/tests/fixtures/goal-fixtures.cjs` — Phase 006 defines the positive packet and isolated defect fixtures (`specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/spec.md:78,90-91`).
- `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/` — Phase 008 creates the mode playbook package (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:50-53,82`).
- `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/manual-testing-playbook.md` — Phase 008 creates the playbook root and scenario index (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:50-53,105`).
- `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/top-level-goal.md` — Phase 008 covers a top-level packet goal (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:105-106`).
- `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/phase-parent-and-nested-child-goals.md` — Phase 008 covers a phase parent and nested children (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:105,107`).
- `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/add-goal-to-packet-without-goal.md` — Phase 008 covers adding a goal to an existing packet with none (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:105,108`).
- `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/cut-over-budget-parent.md` — Phase 008 covers cutting an over-budget parent without losing a criterion (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:105,109`).
- `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder.md` — Phase 008 covers refusing a leftover placeholder (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:105,110`).
- `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/detect-unbound-phase.md` — Phase 008 covers detecting a phase missing from its parent binding (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:105,111`).
- `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/route-session-goal-away.md` — Phase 008 covers routing a session-goal request away from packet authoring (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:105,112`).
- `.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/resend-parent-after-child-change.md` — Phase 008 covers resending a parent after a child change (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:105,113`).
- `.skilled/skills/sk-doc/sk-create-goal/changelog/` — Phase 002 reserves the packet-local history directory (`specs/sk-doc/060-create-goal-mode/002-mode-scaffold/spec.md:48-50,95`).
- `.skilled/skills/sk-doc/sk-create-goal/changelog/v1.0.0.0.md` — Phase 009 creates the first mode release entry (`specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/spec.md:52-57,101-103`).

The mode uses the system-spec-kit goal template and does not carry a `goal.md.tmpl` copy (`specs/sk-doc/060-create-goal-mode/goal.md:49-54`; `specs/sk-doc/060-create-goal-mode/002-mode-scaffold/spec.md:79,131`). A nested packet has no packet-local `graph-metadata.json` or `description.json`; those are hub identity and doctor surfaces (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:27-50,59`; `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:62-77`).

---

## 2. SK-DOC HUB ROUTING SURFACES

Phase 007 touches seven hub files so the mode is registered and reachable through both routing stages. Those surfaces are separate and a registry entry alone does not prove reachability (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:42,49-50,75-77,89-95`; `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:212-238`).

- `.skilled/skills/sk-doc/mode-registry.json` — register `sk-create-goal`, its packet, command, aliases and metadata route (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:75,89`).
- `.skilled/skills/sk-doc/hub-router.json` — add stage-one signals, vocabulary class and tie-break (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:76,90`).
- `.skilled/skills/sk-doc/ROUTER.md` — add stage-two intent signals, resource map and full-inventory leaves (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:76,91`).
- `.skilled/skills/sk-doc/graph-metadata.json` — add advisor vocabulary for goal-file authoring (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:77,92`).
- `.skilled/skills/sk-doc/SKILL.md` — add the human-facing mode row and update the count (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:77,93`).
- `.skilled/skills/sk-doc/description.json` — advertise the mode and its narrow vocabulary (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:77,94`).
- `.skilled/skills/sk-doc/leaf-manifest.json` — regenerate the generated leaf inventory from the updated mode and references (`specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/spec.md:50,77,95`).

---

## 3. COMMAND AND RUNTIME SURFACES

Phase 008 creates the command through `sk-create-command`, records its ownership and index row, creates four runtime mirrors and adds the manual playbook (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:43,50-53,78-82`).

- `.skilled/commands/create/goal.md` — `/create:goal` router (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:95`).
- `.skilled/commands/create/assets/create-goal-auto.yaml`, `.skilled/commands/create/assets/create-goal-confirm.yaml` and `.skilled/commands/create/assets/create-goal-presentation.txt` — auto, confirm and presentation assets (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:95-98`).
- `.skilled/skills/sk-doc/command-metadata.json` — command metadata binding `/create:goal` to `sk-create-goal` (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:80,99`).
- `.skilled/commands/create/README.txt` — create-command index row (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:81,100`).
- `.claude/commands/create/goal.md`, `.codex/prompts/create-goal.md`, `.pi/prompts/create-goal.md` and `.cursor/commands/create-goal.md` — runtime mirrors (`specs/sk-doc/060-create-goal-mode/008-command-and-playbook/spec.md:81,101-104`).

---

## 4. RELEASE AND EXECUTION EVIDENCE

- `.skilled/changelog/sk-doc/create-goal` — Phase 009 creates the hub directory symlink to `../../skills/sk-doc/sk-create-goal/changelog`; the packet's versioned changelog remains a real file (`specs/sk-doc/060-create-goal-mode/spec.md:109`; `specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/spec.md:52-57,101-103`; `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:270-277`). That section's no-symlink rule governs the changelog files themselves, which stay real at hub and packet level; the `.skilled/changelog/sk-doc/` index is a separate pointer tree, and eleven sibling modes plus the hub are linked into it this way (`ls -la .skilled/changelog/sk-doc/`).
- `.skilled/skills/sk-doc/benchmark/reports/README.md` and `.skilled/skills/sk-doc/benchmark/reports/<run-label>/{README.md,results.csv,source.md}` — Phase 009 stores the eight observed playbook verdicts, reasons and evidence paths under the established playbook result contract (`specs/sk-doc/060-create-goal-mode/009-verification-and-closeout/spec.md:50-55,104-105`).
