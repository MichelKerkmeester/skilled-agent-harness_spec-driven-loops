---
title: "Implementation Plan: terminal-control-and-integration-research"
description: "Plan for the wave-1 read-only research fleet assessing how to drive Open Design from the terminal, how to design mcp-open-design, and how to de-vendor plus integrate sk-interface-design. Research-only; the deliverable is a recommendation, not a build."
trigger_phrases:
  - "open design terminal research plan"
  - "mcp-open-design research plan"
  - "sk-interface-design de-vendor plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/001-terminal-control-and-integration-research"
    last_updated_at: "2026-06-14T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Research fleet complete; plan reflects the executed approach"
    next_safe_action: "Operator reviews research.md recommendation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-150-001-terminal-control-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: terminal-control-and-integration-research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Read-only research fleet (CLI executors over local source) |
| **Framework** | Spec Kit deep-research, wave-1 multi-seat fan-out |
| **Storage** | Packet-local `research/` (seats, iterations, synthesis) |
| **Testing** | Cross-seat reconciliation; orchestrator ground-truths live-observed facts |

### Overview
Run a read-only research fleet over the installed Open Design app and the two skills to determine how to drive Open Design from the terminal, how to design `mcp-open-design`, and how to de-vendor plus integrate `sk-interface-design`. Three seats produce independent findings that are reconciled and synthesized into one canonical recommendation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (terminal surface, skill design, de-vendor plan, cross-check)
- [x] Inputs identified (installed app, mcp-magicpath model, sk-interface-design target)

### Definition of Done
- [x] All seats completed and reconciled
- [x] `research/research.md` synthesized with a prioritized recommendation
- [x] Docs validate `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Wave-1 multi-seat fan-out (read-only), independent findings, central synthesis.

### Key Components
- **Seat A (claude2-opus)**: Open Design terminal control surface, by reading the bundled code.
- **Seat B (claude2-opus)**: sk-interface-design de-vendor, integration, and licensing.
- **Seat C (gpt-5.5-fast)**: mcp-open-design skill design plus adversarial cross-check of Seat A.

### Data Flow
Installed app plus both skills to per-seat findings, then orchestrator-authored `research.md` synthesis.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This is a read-only research packet. No code, skill, or app surface is modified. The only writes are packet-local research artifacts and this packet's control docs.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `/Applications/Open Design.app` | Research input (installed app) | unchanged (read-only) | no diff; bundled code only read |
| `.opencode/skills/sk-interface-design/` | De-vendor target under study | unchanged this packet | no diff in skill dir |
| `.opencode/skills/mcp-magicpath/` | Structural model | unchanged (read-only) | no diff in skill dir |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold the 001 research child (`research/` dir, seats layout)
- [x] Assign the three read-only seats (terminal surface, de-vendor, skill design plus cross-check)
- [x] Confirm the installed app path and bundled CLI entry

### Phase 2: Core Implementation
- [x] Run the wave-1 fleet over local source only
- [x] Reconcile Seat A and Seat C on the terminal surface (adversarial cross-check)
- [x] Resolve the de-vendor ordering and integration guardrails from Seat B

### Phase 3: Verification
- [x] Ground-truth the live-observed transport and tool-tier facts
- [x] Synthesize the canonical `research.md` recommendation
- [x] Validate docs `--strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Cross-check | Seat A vs Seat C terminal-surface reconciliation | manual synthesis |
| Ground-truth | Daemon transport and tool tiers vs `--help` claims | live `--help` / `--version`, socket check |
| Validation | Spec-folder doc structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Installed Open Design app (v0.9.0) | External | Green | No bundled code to read |
| cli-claude-code `claude2-opus` seats | External | Green | Lose the code-read lineage |
| cli-opencode `openai/gpt-5.5-fast` seat | External | Green | Lose the adversarial cross-check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts invalid or all seats failed.
- **Procedure**: Discard `research/`; nothing outside this packet is touched, so there is no external state to revert. The one live side effect (restoring the deleted license files) is a correction, not a rollback target.
<!-- /ANCHOR:rollback -->
