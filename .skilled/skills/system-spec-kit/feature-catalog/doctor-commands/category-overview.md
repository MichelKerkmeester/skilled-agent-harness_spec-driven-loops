---
title: "Doctor commands"
description: "Category covering the spec-kit /doctor:speckit argv-positional router and its nine subsystem routes, plus standalone /doctor:rebuild, /doctor:update, /doctor:mcp install|debug and /doctor:env commands and version-migration flows."
trigger_phrases:
  - "doctor commands"
  - "/doctor"
  - "run doctor subsystem diagnostic"
  - "cross-subsystem aligner doctor rebuild"
  - "how do I diagnose and repair a spec-kit subsystem"
version: 1.6.0.6
---

# Doctor commands

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Category covering the spec-kit `/doctor:speckit` argv-positional router and its nine subsystem routes, plus standalone `/doctor:rebuild`, `/doctor:update`, `/doctor:mcp install|debug` and `/doctor:env` commands and version-migration flows.

This category documents the consolidated `/doctor:speckit <target>` command surface that diagnoses and repairs spec-kit subsystems. The legacy colon-form commands were consolidated into this router during the hard cutover. It now has one route manifest and one CI assertion. The manual testing playbook has a harness layout that exercises every route end to end.

---

## 2. HOW IT WORKS

The shipped surface includes nine subsystem routes under `/doctor:speckit <target>` (speckit-retrieval, deep-loop, skill-advisor, skill-budget, parent-skill, skill-graph-freshness, router-reach, fable-mode, runtime-mirrors). It also includes standalone `/doctor:rebuild`, `/doctor:update` with check, align and gated apply actions, `/doctor:mcp install|debug` and `/doctor:env`, plus a version-migration flow that moves the spec-kit MCP through point releases.

The route manifest declares every target's location and mutation class so Gate 3 can be answered per-route before execution. Routes marked `read-only` may inspect and report without a spec-folder write path; `add-only` routes may create scoped logs, snapshots, or evidence after Gate 3 is satisfied; `mutates` routes follow the same spec-folder discipline as any other file or database mutation. A CI assertion verifies the manifest against the router source.

The playbook peer at `manual-testing-playbook/doctor-commands/` covers twenty-five scenarios (DOC-323 through DOC-347, with gaps at 337 and 343) across the subsystem routes, the cross-subsystem aligner, the MCP infra surface, and the version-migration flow. Each scenario has a Markdown spec and a sandbox shell wrapper, with evidence collected under `_sandbox/doctor-commands/evidence/DOC-NNN/`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/commands/doctor/speckit.md` | Router | `/doctor:speckit <target>` argv-positional dispatch source |
| `.skilled/commands/doctor/_routes.yaml` | Manifest | Route manifest exposing each target's location and mutation class |
| `.skilled/commands/doctor/rebuild.md` | Command | `/doctor:rebuild` cross-subsystem aligner with snapshot, validate, rollback, run-log |
| `.skilled/commands/doctor/update.md` | Command | `/doctor:update` release-aware check, align and apply workflows |
| `.skilled/commands/doctor/mcp.md` | Command | `/doctor:mcp install\|debug` MCP infra surface |
| `manual-testing-playbook/doctor-commands/README.md` | Playbook | Scope and harness guide for twenty-five manual scenarios |
| `manual-testing-playbook/doctor-commands/*.md` | Playbook | Per-scenario Markdown specs (DOC-323 through DOC-347, with gaps at 337 and 343) |
| `manual-testing-playbook/_sandbox/doctor-commands/scenarios/` | Harness | Per-scenario shell wrappers, one per DOC-NNN entry |
| `manual-testing-playbook/_sandbox/doctor-commands/harness/` | Harness | `run-all.sh`, `fetch-fixtures.sh`, and shared harness scaffolding |

### Validation

| File | Layer | Role |
|------|-------|------|
| `.skilled/commands/doctor/scripts/route-validate.sh` | Validator | CI assertion that verifies the route manifest against the router source |
| `manual-testing-playbook/_sandbox/doctor-commands/harness/run_all.sh` | Harness | Aggregate runner that executes every scenario in sequence |
| `.skilled/skills/sk-doc/scripts/validate_document.py` | Validator | Markdown structure and HVR validator for the playbook README and category overview |

---

## 4. SOURCE METADATA
- Group: Doctor commands
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `doctor-commands/category-overview.md`
