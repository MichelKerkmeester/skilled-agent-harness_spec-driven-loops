---
title: "Doctor commands overview"
description: "The doctor routers split by owner (`/doctor:speckit`, `/doctor:skill-advisor`, `/doctor:deep-loop`, `/doctor:runtime-mirrors`) and the subsystem routes they dispatch to."
trigger_phrases:
  - "doctor commands"
  - "/doctor"
  - "run doctor subsystem diagnostic"
  - "skill advisor rebuild doctor"
  - "how do I diagnose and repair a spec-kit subsystem"
version: 1.7.4.0
---

# Doctor commands

## 1. OVERVIEW

Category covering the doctor routers split by owner: `/doctor:speckit` for spec-kit retrieval, `/doctor:skill-advisor <target>` with six targets, `/doctor:deep-loop` and `/doctor:runtime-mirrors`, plus `/doctor:setup`, the read-only onboarding check across all of them, and standalone `/doctor:update`, `/doctor:mcp install|debug`, `/doctor:env`, `/doctor:sk-code` and `/doctor:git <hooks|standards|setup>` commands.

This category documents the doctor command surface that diagnoses and repairs spec-kit subsystems. Each router owns the routes of one subsystem, and all of them read one route manifest checked by one CI assertion. Each command has manual testing scenarios in the playbook of the skill it checks.

---

## 2. HOW IT WORKS

The shipped surface splits by owner. `/doctor:speckit` takes no target and diagnoses spec-kit retrieval: the trigger index, its lookup and the ripgrep recipes. `/doctor:skill-advisor <target>` owns six targets: `tune`, `rebuild`, `skill-graph-freshness`, `router-reach`, `skill-budget` and `parent-skill`. The `rebuild` target rebuilds `skill-graph.sqlite` through the advisor CLI behind a backup. `/doctor:deep-loop` takes only `--scope`, and `/doctor:runtime-mirrors` takes no arguments. `/doctor:setup` takes no target: it lists every doctor command and runs the sk-code setup, sk-git setup, trigger index, runtime mirror and skill advisor status checks read-only, naming one repair command per failing check. Standalone `/doctor:update` carries check, align, gated apply, rollback, record-base and compat actions and owns release migration. `/doctor:mcp install|debug`, `/doctor:env`, `/doctor:sk-code` and `/doctor:git <hooks|standards|setup>` complete the set.

The route manifest declares every target's location and mutation class so Gate 3 can be answered per-route before execution. Routes marked `read-only` may inspect and report without a spec-folder write path. `add-only` routes may create scoped logs, snapshots, or evidence after Gate 3 is satisfied. `mutates` routes follow the same spec-folder discipline as any other file or database mutation. A CI assertion verifies the manifest against the router source.

The playbook peer at `manual-testing-playbook/doctor-commands/` holds the scenarios for the four commands this skill owns: `/doctor:speckit`, `/doctor:runtime-mirrors`, `/doctor:env` and `/doctor:update` (DOC-349 through DOC-361 and DOC-381). The other commands are tested where they belong: `/doctor:skill-advisor` and `/doctor:setup` in the system-skill-advisor playbook, `/doctor:deep-loop` in the system-deep-loop playbook, `/doctor:git` in the sk-git playbook and `/doctor:mcp` in the mcp-code-mode playbook, each under its own `doctor-commands/` category.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/commands/doctor/speckit.md` | Router | `/doctor:speckit` spec-kit retrieval diagnostic, no target |
| `.skilled/commands/doctor/skill-advisor.md` | Router | `/doctor:skill-advisor <target>` argv-positional dispatch for the six advisor targets |
| `.skilled/commands/doctor/deep-loop.md` | Router | `/doctor:deep-loop` coverage-graph and convergence diagnostic |
| `.skilled/commands/doctor/runtime-mirrors.md` | Router | `/doctor:runtime-mirrors` mirror-parity diagnostic |
| `.skilled/commands/doctor/setup.md` | Router | `/doctor:setup` read-only onboarding check that lists every doctor target and runs five setup checks |
| `.skilled/commands/doctor/_routes.yaml` | Manifest | Route manifest exposing each target's location and mutation class |
| `.skilled/commands/doctor/update.md` | Command | `/doctor:update` release-aware check, align, apply, rollback, record-base and compat workflows |
| `.skilled/commands/doctor/mcp.md` | Command | `/doctor:mcp install\|debug` MCP infra surface |
| `.skilled/commands/doctor/env.md` | Command | `/doctor:env` guided environment switches |
| `.skilled/commands/doctor/git.md` | Command | `/doctor:git <hooks\|standards\|setup>` hook gate settings, `.sk-git/` rule changes and a read-only setup check |
| `manual-testing-playbook/doctor-commands/README.md` | Playbook | Scope of the doctor scenarios and the DOC- ID series across playbooks |
| `manual-testing-playbook/doctor-commands/*.md` | Playbook | Per-scenario Markdown specs (DOC-349 through DOC-361 and DOC-381) |

### Validation

| File | Layer | Role |
|------|-------|------|
| `.skilled/commands/doctor/scripts/route-validate.sh` | Validator | CI assertion that verifies the route manifest against the router source |
| `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Validator | Operator-scenario contract check for each playbook that holds doctor scenarios |
| `.skilled/skills/sk-doc/scripts/validate_document.py` | Validator | Markdown structure and HVR validator for the playbook README and category overview |

---

## 4. SOURCE METADATA
- Group: Doctor commands
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `doctor-commands/category-overview.md`
