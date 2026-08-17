---
title: "Feature Specification: Pi extension manual-testing playbooks"
description: "Phase parent for adding manual-testing playbooks and deterministic benchmark runs to the pi-cache-optimizer and deep-pi Pi extensions."
trigger_phrases:
  - "pi extension playbooks"
  - "cache-optimizer deep-pi manual testing"
  - "pi extension benchmark runs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/012-pi-extension-playbooks"
    last_updated_at: "2026-08-17T16:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Both children shipped: playbooks authored, harnesses green, benchmark runs recorded"
    next_safe_action: "Reconcile metadata and validate the packet"
    blockers: []
    key_files:
      - "001-cache-optimizer-playbook/spec.md"
      - "002-deep-pi-playbook/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-17-pi-extension-playbooks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: Pi extension manual-testing playbooks

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | Phase Parent |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-17 |
| **Branch** | `skilled/v4.0.0.0` |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `pi-cache-optimizer` and `deep-pi` Pi extensions ship unit tests but no operator-facing manual-testing playbook, unlike `pi-fast-mode-w-subagent-support`. There is no reproducible, evidence-backed way for an operator to validate their headline behavior, and no recorded benchmark run.

### Purpose
Give each extension a `manual-testing-playbook/` package authored to the `sk-create-manual-testing-playbook` contract, run its scenarios deterministically against the real extension code with no paid API calls, and record the outcomes in a canonical `benchmark/reports/` folder.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A manual-testing-playbook package for each extension.
- A deterministic in-process harness per extension that drives the real code.
- A canonical benchmark run folder per extension recording the verdicts.

### Out of Scope
- Changing extension production code.
- Any paid or live-API benchmark, including deep-pi's `benchmark:live`.
- Publishing the extensions.

<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## 4. PHASE DOCUMENTATION MAP

| Phase | Child | Purpose |
|-------|-------|---------|
| 1 | `001-cache-optimizer-playbook/` | Playbook, harness, and benchmark for pi-cache-optimizer |
| 2 | `002-deep-pi-playbook/` | Playbook, harness, and benchmark for deep-pi |

<!-- /ANCHOR:phase-map -->

## RELATED DOCUMENTS

- **Child 1:** `001-cache-optimizer-playbook/spec.md`
- **Child 2:** `002-deep-pi-playbook/spec.md`
- **Reference:** `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md`
