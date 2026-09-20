---
title: "Playbook Validation — mcp-obsidian mode (phase parent)"
description: "Phase parent for the mcp-obsidian playbook validation run: execute every manual-testing-playbook scenario against a live throwaway vault (headless CLI, MCP, plugins) plus the mcp-tooling routing benchmark, across five phase children."
trigger_phrases:
  - "mcp-obsidian playbook validation"
  - "obsidian scenario run"
  - "playbook validation phases"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/010-playbook-validation"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Executed all playbook scenarios: 18/19 live PASS + routing benchmark PASS 98; no scenarios blocked"
    next_safe_action: "Execute phase 2 (headless) via cli-pi and phase 3-4 (MCP/plugins) via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/010-playbook-validation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->
# Playbook Validation — mcp-obsidian mode (phase parent)

<!-- SPECKIT_LEVEL: Phase Parent -->

This packet runs the mcp-obsidian mode's manual-testing-playbook end to end against a live throwaway Obsidian vault, plus the mcp-tooling routing benchmark. Executors: deepseek-v4-flash via cli-pi (headless) and cli-opencode (MCP + plugins).

---

## PHASE DOCUMENTATION MAP

| Child | Purpose | Executor |
|-------|---------|----------|
| 001-provisioning | Install notesmd-cli, register vault, activate Local REST API, configure .env | orchestrator |
| 002-headless-cli-scenarios | 8 headless notesmd-cli scenarios | deepseek via cli-pi |
| 003-mcp-scenarios | 6 MCP round-trip + verification scenarios | deepseek via cli-opencode |
| 004-plugin-tie-in-scenarios | 3 plugin file-layer scenarios (OBS-011/012/013) | deepseek via cli-opencode |
| 005-routing-skill-benchmark | 7-mode routing benchmark; official-CLI scenarios blocked | orchestrator |

The official `obsidian` CLI scenarios (2) are blocked pending in-app "Register CLI".
