---
title: "Doctor commands"
description: "Category covering the spec-kit /doctor argv-positional router and its subsystem routes (memory, causal-graph, deep-loop, cocoindex), plus the /doctor:update cross-subsystem aligner, /doctor:mcp infra surface, and version-migration flows."
---

# Doctor commands

## 1. OVERVIEW

Category covering the spec-kit `/doctor` argv-positional router and its subsystem routes (memory, causal-graph, deep-loop, cocoindex), plus the `/doctor:update` cross-subsystem aligner, `/doctor:mcp` infra surface, and version-migration flows.

This category documents the consolidated `/doctor <target>` command surface that diagnoses and repairs spec-kit subsystems. It replaced the legacy `/doctor:<name>` colon-form commands after the 013 Phase 5 hard cutover, and it now exposes one route manifest, one CI assertion, and one harness layout that exercises every route end-to-end through the manual testing playbook.

---

## 2. CURRENT REALITY

The shipped surface now includes five subsystem routes under `/doctor <target>` (memory, causal-graph, deep-loop, cocoindex, skill-advisor, skill-budget, code-graph), a standalone `/doctor:update` cross-subsystem aligner with snapshot, validate, rollback, and run-log behavior, a standalone `/doctor:mcp install|debug` infra surface, and a version-migration flow that moves the spec-kit MCP through point releases.

The route manifest declares every target's location and mutation class so Gate 3 can be answered per-route before execution. Routes marked `read-only` may inspect and report without a spec-folder write path; `add-only` routes may create scoped logs, snapshots, or evidence after Gate 3 is satisfied; `mutates` routes follow the same spec-folder discipline as any other file or database mutation. A CI assertion verifies the manifest against the router source.

The playbook peer at `manual_testing_playbook/23--doctor-commands/` covers twenty-five scenarios (DOC-323 through DOC-347, with gaps at 337 and 343) across the subsystem routes, the cross-subsystem aligner, the MCP infra surface, and the version-migration flow. Each scenario has a Markdown spec and a sandbox shell wrapper, with evidence collected under `_sandbox/23--doctor-commands/evidence/DOC-NNN/`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/commands/doctor.md` | Router | `/doctor <target>` argv-positional dispatch source |
| `.opencode/commands/doctor/_routes.yaml` | Manifest | Route manifest exposing each target's location and mutation class |
| `.opencode/commands/doctor-update.md` | Command | `/doctor:update` cross-subsystem aligner with snapshot, validate, rollback, run-log |
| `.opencode/commands/doctor-mcp.md` | Command | `/doctor:mcp install\|debug` MCP infra surface |
| `manual_testing_playbook/23--doctor-commands/README.md` | Playbook | Scope and harness guide for twenty-five manual scenarios |
| `manual_testing_playbook/23--doctor-commands/*.md` | Playbook | Per-scenario Markdown specs (DOC-323 through DOC-347, with gaps at 337 and 343) |
| `manual_testing_playbook/_sandbox/23--doctor-commands/scenarios/` | Harness | Per-scenario shell wrappers, one per DOC-NNN entry |
| `manual_testing_playbook/_sandbox/23--doctor-commands/harness/` | Harness | `run-all.sh`, `fetch-fixtures.sh`, and shared harness scaffolding |

### Validation

| File | Layer | Role |
|------|-------|------|
| `.opencode/commands/doctor/scripts/route-validate.sh` | Validator | CI assertion that verifies the route manifest against the router source |
| `manual_testing_playbook/_sandbox/23--doctor-commands/harness/run-all.sh` | Harness | Aggregate runner that executes every scenario in sequence |
| `.opencode/skills/sk-doc/scripts/validate_document.py` | Validator | Markdown structure and HVR validator for the playbook README and category overview |

---

## 4. SOURCE METADATA
- Group: Doctor commands
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `23--doctor-commands/01-category-overview.md`
