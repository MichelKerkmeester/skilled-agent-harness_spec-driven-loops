---
title: "Implementation Plan: deep-context workflow adoption (root-cause fix)"
description: "Consult the AI Council on the root cause, then implement the recommended PLAN-WORKFLOW LOCK plus two reinforcing secondaries."
trigger_phrases:
  - "deep-context workflow adoption plan"
importance_tier: "high"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/137-deep-context-workflow-adoption"
    last_updated_at: "2026-06-07T19:55:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Council verdict in; implemented PLAN-WORKFLOW LOCK + two secondaries"
    next_safe_action: "Validate and commit packet 137"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/deep-context/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-context-adoption-137"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: deep-context workflow adoption (root-cause fix)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (governance canon + skill doc) plus a spec-memory feedback entry |
| **Framework** | deep-ai-council deliberation, spec-kit memory |
| **Storage** | spec-kit memory (feedback), AGENTS.md, deep-context SKILL.md |
| **Testing** | grep-verifiable rule presence, validate.sh --strict |

### Overview

Dispatch the AI Council to confirm the root cause and recommend the durable fix, then implement the council's convergent plan: a PLAN-WORKFLOW LOCK governance mandate (primary), a cross-runtime feedback memory (secondary A), and a deep-context anti-pattern line (secondary B).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause hypothesized and evidence gathered (command contract read)
- [x] AI Council dispatched at Depth 1 into this packet

### Definition of Done
- [x] PLAN-WORKFLOW LOCK present in AGENTS.md (grep-verifiable, binds all runtimes via the CLAUDE.md symlink)
- [x] Cross-runtime feedback memory saved into this packet
- [x] Anti-pattern NEVER item present in deep-context SKILL.md
- [ ] validate.sh --strict PASS on the packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Council-advised governance fix. The council deliberates and recommends; the orchestrator implements (the council writes only `ai-council/**`).

### Key Components
- **ai-council/**: the diverse-lens deliberation and the converged recommendation.
- **AGENTS.md**: the PLAN-WORKFLOW LOCK hard blocker (CLAUDE.md symlinks to it).
- **deep-context SKILL.md**: the anti-pattern guardrail.

### Data Flow

Evidence and self-diagnosis to the council; the council returns a root-cause verdict and a ranked fix; the orchestrator writes the three artifacts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

`AGENTS.md` (governance canon, symlinked from `CLAUDE.md`) and `.opencode/skills/deep-context/SKILL.md` (symlink-shared across runtimes). No code or behavior change.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the deep-context command contract; confirm the assumed friction was false

### Phase 2: Core Implementation
- [x] Dispatch @ai-council (Depth 1) for the root-cause verdict and fix
- [x] Add PLAN-WORKFLOW LOCK to AGENTS.md
- [x] Save the cross-runtime feedback memory into this packet
- [x] Add the anti-pattern NEVER item to deep-context SKILL.md

### Phase 3: Verification
- [x] grep confirms the rule in AGENTS.md and via the CLAUDE.md symlink
- [ ] validate.sh --strict on the packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Presence | The rule and guardrail | `grep` on AGENTS.md, CLAUDE.md, deep-context SKILL.md |
| Structure | Packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| @ai-council agent | Internal | Green | No diverse-lens verdict |
| spec-kit memory | Internal | Green | No cross-runtime feedback binding |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The rule proves too broad or noisy.
- **Procedure**: Revert the AGENTS.md and SKILL.md edits with git; the feedback memory can be deprecated.
<!-- /ANCHOR:rollback -->
