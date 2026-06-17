---
title: "Research Specification: figma-cli and Figma MCP landscape"
description: "A 5-iteration gpt-5.5-fast deep research into the silships figma-cli (npm figma-ds-cli) capabilities, the Figma MCP landscape, the mcp-figma skill architecture, the install and safety path, and the convergence. Research-only: the deliverable is a synthesized recommendation; the skill build is a later phase."
trigger_phrases:
  - "figma-cli capabilities research"
  - "figma mcp landscape research"
  - "mcp-figma skill design research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/146-mcp-figma-with-direct-cli-support/001-figma-cli-and-mcp-research"
    last_updated_at: "2026-06-14T17:00:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Five-iteration research synthesized into research.md"
    next_safe_action: "Operator reviews research.md; phase 002 skill build follows"
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

# Research Specification: figma-cli and Figma MCP landscape

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-14 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Method** | Five-iteration deep research, `openai/gpt-5.5-fast` |
| **Type** | Deep-research (read-only). Recommend; NO skill change in this packet. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Figma Desktop holds a project's real design systems, tokens, variables, and components, but a coding agent could only reach them through the Figma UI or a remote-API workflow. Whether and how Figma can be driven from a terminal was unknown, and the npm registry carries a naming trap: the package literally named `figma-cli` is an unrelated tool (unic/figma-cli), while the capability the framework wanted lives in the silships figma-cli, published as `figma-ds-cli`. The Figma MCP landscape (first-party and community) also needed an honest survey before committing to a skill design.

### Purpose

Run a five-iteration deep research to produce a concrete recommendation covering four questions: what the silships figma-cli can actually do, what the Figma MCP landscape offers, how to architect the `mcp-figma` skill, and how to install it safely (the full repo build over the minimal npm build, plus the safe and yolo connect modes and their rollback). The build is a separate follow-up phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- DR-SEED:SCOPE -->

**In scope:**
- The silships figma-cli capability surface: the daemon model, the connect modes, the read, author, modify, and export commands, and the design-system extract and import.
- The Figma MCP landscape: the first-party and community options, and where the community Framelink `figma` manual already reachable through this project's Code Mode fits.
- A skill architecture for `mcp-figma` modeled on the sibling terminal-control skills, including a read-only, mutating, and destructive command gating policy.
- The install and safety path: choosing the full repo build over the minimal npm build, and the safe versus yolo connect trade-off with rollback.

**Out of scope:**
- Building the skill or editing the Figma app (no skill or app change in this packet).
- The unrelated npm `figma-cli` package, named only as a trap to avoid.
- Re-deriving or caching Figma content; the live session is read-only input.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->

- R1: The silships figma-cli capability surface documented: the daemon transport, the connect modes, and the read, author, modify, export, extract, and import commands.
- R2: The npm naming and version traps recorded: `figma-cli` (npm) is unrelated, and npm `figma-ds-cli` is a minimal 1.0.0 while the full surface needs the repo build.
- R3: The Figma MCP landscape surveyed, with the optional Code Mode `figma` (Framelink) manual placed in the recommendation.
- R4: An `mcp-figma` skill architecture fitted to house conventions, with a read-only, mutating, and destructive gating policy.
- R5: The install and safety path documented: the full repo build, and the safe versus yolo connect modes with rollback.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `research/research.md` synthesized from the five iterations with a convergence section.
- A clear capability answer: the figma-cli daemon model, connect modes, and the command surface, each sourced from an iteration finding.
- The npm naming and version traps stated as first-class warnings.
- An `mcp-figma` skill architecture with an explicit gating policy and the optional Code Mode MCP path.
- The install and safety path documented with the safe versus yolo trade-off and rollback.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Mitigation |
|-------------------|------------|
| The npm naming trap leads to installing the wrong `figma-cli` | The research records that npm `figma-cli` is unrelated and `figma-ds-cli` is the canonical binary |
| The minimal npm build is mistaken for the full surface | The research records that npm publishes only a minimal 1.0.0 and the full surface needs the repo build |
| The yolo connect mode patches Figma's app bundle without a clear rollback | The research records the safe (plugin) default and the yolo rollback path before recommending either |
| Live behavior cannot be fully confirmed read-only | Open items are carried into phase 002 for live install and verification |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The exact installed version, the live daemon behavior, and the Code Mode `figma` manual tool names are confirmed live in phase 002 rather than in this read-only packet.

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:research-context -->
## 8. RESEARCH CONTEXT

Deep-research is complete for this topic. `research/research.md` is the canonical synthesis output. Inputs assessed:

- The silships figma-cli (published to npm as `figma-ds-cli`) and its daemon, connect modes, and command surface.
- The Figma MCP landscape, including the community Framelink `figma` manual already reachable through this project's Code Mode.
- Sibling terminal-control skills (`mcp-open-design`, `mcp-chrome-devtools`, `mcp-magicpath`) as structural models.
- House skill standards: `sk-doc` templates and the SKILL.md structure and size conventions.

<!-- /ANCHOR:research-context -->
