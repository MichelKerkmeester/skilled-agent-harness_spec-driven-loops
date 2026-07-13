---
title: "Implementation Plan: Codex agent TOML sync"
description: "Planned schema probe, generator, and mirror check."
trigger_phrases: ["Codex agent sync plan"]
importance_tier: normal
contextType: planning
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-cli-codex-revival/005-codex-agent-toml-sync"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase stub for the .codex agents TOML sync"
    next_safe_action: "Implement after the cli-codex skill packet lands"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Codex agent TOML sync
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- ANCHOR:summary -->
## 1. SUMMARY
Probe one representative agent TOML, define deterministic field mapping, generate from every canonical OpenCode agent, and add a parity check.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- [ ] Codex accepts the representative schema.
- [ ] Generator output is deterministic.
- [ ] Mirror check catches count and content drift.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Canonical Markdown remains authoritative; generated TOML is a runtime adapter artifact, never an independent source.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
| Surface | Current Role | Action | Verification |
|---|---|---|---|
| `.opencode/agents` | Canonical source | Read only | Filename/body inventory |
| `.codex/agents` | Runtime adapter | Generate | Codex schema and parity check |
<!-- /ANCHOR:affected-surfaces -->
<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Setup
- [ ] Verify agent TOML schema and live canonical inventory.
### Phase 2: Core Implementation
- [ ] Implement generator and generated TOMLs.
### Phase 3: Verification
- [ ] Run Codex acceptance and mirror checks.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Golden fixtures, deterministic rerun diff, filename-set parity, and live Codex agent loading.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|---|---|---|---|
| Codex multi-agent schema | External | Yellow | Cannot freeze mapping. |
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Remove generated TOMLs and sync wiring; canonical OpenCode agents remain untouched.
<!-- /ANCHOR:rollback -->
