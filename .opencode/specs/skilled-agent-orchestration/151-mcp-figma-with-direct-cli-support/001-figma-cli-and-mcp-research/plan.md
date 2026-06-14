---
title: "Implementation Plan: figma-cli-and-mcp-research"
description: "Plan for the five-iteration gpt-5.5-fast deep research into the silships figma-cli, the Figma MCP landscape, the mcp-figma skill architecture, and the install plus safety path. Research-only; the deliverable is a recommendation, not a build."
trigger_phrases:
  - "figma-cli research plan"
  - "figma mcp landscape plan"
  - "mcp-figma research plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/151-mcp-figma-with-direct-cli-support/001-figma-cli-and-mcp-research"
    last_updated_at: "2026-06-14T17:00:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Research complete; plan reflects the executed approach"
    next_safe_action: "Operator reviews research.md recommendation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-001-figma-cli-and-mcp-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: figma-cli-and-mcp-research

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Read-only deep research (CLI executor over local source and tool docs) |
| **Framework** | Spec Kit deep-research, five-iteration loop |
| **Storage** | Packet-local `research/` (iterations, prompts, raw, synthesis) |
| **Testing** | Convergence across iterations; orchestrator ground-truths live-observed facts |

### Overview
Run a five-iteration deep research into the silships figma-cli, the Figma MCP landscape, the `mcp-figma` skill architecture, and the install plus safety path. Each iteration sharpens the prior one toward a convergent recommendation, and the orchestrator authors the canonical synthesis from the iteration findings.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md)
- [x] Success criteria measurable (capability surface, MCP landscape, skill design, install path)
- [x] Inputs identified (figma-cli, the MCP landscape, sibling skills)

### Definition of Done
- [x] All five iterations completed and converged
- [x] `research/research.md` synthesized with a prioritized recommendation
- [x] Docs validate `--strict`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Five-iteration deep research, each iteration refining the prior, central synthesis.

### Key Components
- **Iterations 001-005**: progressive findings on the figma-cli capability surface, the MCP landscape, the skill architecture, the install and safety path, and the convergence.
- **Orchestrator verification**: ground-truthing of the live-observed facts against the iteration claims.

### Data Flow
figma-cli plus the MCP landscape to per-iteration findings, then orchestrator-authored `research.md` synthesis.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable. This is a read-only research packet. No code, skill, or app surface is modified. The only writes are packet-local research artifacts and this packet's control docs.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The silships figma-cli (figma-ds-cli) | Research input (external tool) | unchanged (read-only) | no install in this packet |
| The Figma MCP landscape | Research input | unchanged (read-only) | survey only |
| Sibling terminal-control skills | Structural models | unchanged (read-only) | no diff in skill dirs |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold the 001 research child (`research/` dir, iteration and prompt layout)
- [x] Frame the four research questions (capabilities, MCP landscape, skill design, install/safety)
- [x] Confirm the canonical binary name and the npm traps to test

### Phase 2: Core Implementation
- [x] Run the five-iteration loop on the figma-cli and the MCP landscape
- [x] Sharpen the skill architecture and the gating policy across iterations
- [x] Resolve the install and safety path (repo build, safe versus yolo)

### Phase 3: Verification
- [x] Ground-truth the live-observed capability and transport facts
- [x] Synthesize the canonical `research.md` recommendation with a convergence section
- [x] Validate docs `--strict`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence | Iteration-to-iteration agreement on the recommendation | manual synthesis |
| Ground-truth | Capability and transport claims vs the tool's real surface | orchestrator verification |
| Validation | Spec-folder doc structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The silships figma-cli docs and source | External | Green | No capability surface to read |
| The Figma MCP landscape | External | Green | No MCP option to recommend |
| cli-opencode `openai/gpt-5.5-fast` | External | Green | Lose the research executor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts invalid or all iterations failed.
- **Procedure**: Discard `research/`; nothing outside this packet is touched, so there is no external state to revert.
<!-- /ANCHOR:rollback -->
