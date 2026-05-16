# Iteration 019 — system-code-graph: /doctor code-graph route + /doctor:mcp install/debug coverage parity for mk_code_index

## Summary

The /doctor code-graph route is properly configured with correct MCP tool references and trigger phrases. The /doctor:mcp install/debug workflows have strong coverage for mk_code_index, with one P1 coverage gap: the db_dir_missing repair action defined in doctor_mcp_debug.yaml is not implemented in mcp-doctor.sh fix mode. All other health checks from the install YAML are covered by the diagnostic script.

## Files Reviewed

- `.opencode/commands/doctor/_routes.yaml` (lines read: 201)
- `.opencode/commands/doctor/assets/doctor_code-graph.yaml` (lines read: 245)
- `.opencode/commands/doctor/scripts/mcp-doctor.sh` (lines read: 753)
- `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` (lines read: 401)
- `.opencode/commands/doctor/assets/doctor_mcp_debug.yaml` (lines read: 338)

## Findings

### P0 (release-blocking)

| ID | File:line | Finding | Why P0 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

### P1 (high priority)

| ID | File:line | Finding | Why P1 | Remediation |
|----|-----------|---------|--------|-------------|
| 001 | `.opencode/commands/doctor/scripts/mcp-doctor.sh:524-530` | mk_code_index fix mode does not create missing database directory despite debug YAML defining db_dir_missing repair action | Coverage gap between defined repair actions (doctor_mcp_debug.yaml:151-152) and implemented fix mode; users with missing db_dir must manually create it or the fix mode is incomplete | Add mkdir -p "$db_dir" to fix mode when database directory check failed, matching the repair_action definition in doctor_mcp_debug.yaml |

### P2 (nice-to-have)

| ID | File:line | Finding | Why P2 | Remediation |
|----|-----------|---------|--------|-------------|
| — | — | None | — | — |

## Convergence Signal

newInfoRatio 0.15 vs prior iterations — one targeted coverage gap identified between debug YAML repair definitions and mcp-doctor.sh fix mode implementation for mk_code_index.
