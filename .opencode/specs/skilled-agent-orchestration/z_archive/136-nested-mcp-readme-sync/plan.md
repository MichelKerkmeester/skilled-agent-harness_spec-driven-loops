---
title: "Implementation Plan: nested MCP README sync"
description: "Apply three targeted nested-README edits to match the live tool sets, then validate each."
trigger_phrases:
  - "nested mcp readme sync plan"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/136-nested-mcp-readme-sync"
    last_updated_at: "2026-06-07T18:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Applied and validated 3 nested-README edits"
    next_safe_action: "Return to packet 135 phase 024 (skills index README)"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tools/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "nested-readme-sync-136"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: nested MCP README sync

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (nested mcp_server READMEs) |
| **Framework** | sk-doc readme validation |
| **Storage** | None |
| **Testing** | `validate_document.py --type readme`, HVR scan |

### Overview

Apply the three edits the packet-135 QA audit identified, each adding a missing tool or handler entry to a nested README, then validate every file. Names are taken from the live descriptors and handlers the QA cross-checked.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The three stale listings identified and cross-checked against source

### Definition of Done
- [x] Each nested README lists its full tool set
- [x] `validate_document.py --type readme` passes (0 issues) on each
- [x] Added prose is HVR-clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Targeted documentation edits against verified source names.

### Key Components
- The three nested READMEs and their backing descriptor and handler files.

### Data Flow

The live descriptors and handlers are the source of truth; the READMEs are updated to match.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. Documentation-only change to three nested READMEs.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the live tool and handler names from source

### Phase 2: Core Implementation
- [x] Add `skill_graph_propagate_enhances` to the skill-advisor tools README
- [x] Add the `skill-graph/` subhandlers to the skill-advisor handlers README
- [x] Add `code_graph_classify_query_intent` to the code-graph handlers README

### Phase 3: Verification
- [x] `validate_document.py --type readme` passes on each
- [x] HVR scan of the added prose clean
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Three nested READMEs | `validate_document.py` |
| Accuracy | Tool and handler names | Live descriptors and handlers |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet-135 QA audit | Internal | Green | No identified stale listings |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An added name turns out wrong.
- **Procedure**: Revert the README edit with git. No runtime impact.
<!-- /ANCHOR:rollback -->
