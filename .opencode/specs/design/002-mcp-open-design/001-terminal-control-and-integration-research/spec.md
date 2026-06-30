---
title: "Research Specification: Open Design terminal control and skill integration"
description: "Wave-1 read-only research fleet (2x claude2-opus + 1x gpt-5.5-fast) into how to drive the installed Open Design desktop app from a terminal, how to design the mcp-open-design skill, and how to de-vendor plus integrate sk-design-interface with it. Research-only: the deliverable is a synthesized recommendation; the builds are later phases."
trigger_phrases:
  - "open design terminal control research"
  - "mcp-open-design skill design"
  - "sk-design-interface de-vendor research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/002-mcp-open-design/001-terminal-control-and-integration-research"
    last_updated_at: "2026-06-14T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Wave-1 fleet synthesized into research.md; license defect restored"
    next_safe_action: "Operator reviews research.md; start phase 002 skill build"
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

# Research Specification: Open Design terminal control and skill integration

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
| **Method** | Wave-1 read-only fleet: 2x `claude2-opus` (terminal surface, de-vendor/integration) + 1x `openai/gpt-5.5-fast` (skill design + adversarial cross-check) |
| **Type** | Deep-research (read-only). Recommend; NO skill or app change in this packet. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The installed Open Design desktop app (nexu-io/open-design, v0.9.0, Electron plus Next.js) holds rich local-first design systems and a generation engine, but the framework can only reach them through the in-app chat UI. Whether and how it can be driven from a terminal was unknown. In parallel, `sk-design-interface` still vendors data and scripts derived from the MIT `ui-ux-pro-max` repo, which carries license obligations and the AI-default patterns the skill is built to resist. The framework needed an evidence-backed answer that reads the app's actual bundled code rather than guessing.

### Purpose

Run a read-only research fleet to produce a concrete, cross-checked recommendation covering three questions: how to drive Open Design from the terminal (MCP plus CLI), how to design the new `mcp-open-design` skill, and how to de-vendor and integrate `sk-design-interface` with it under a clean license. The builds are separate follow-up phases.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- DR-SEED:SCOPE -->

**In scope:**
- Inventory of Open Design's terminal control surface: the `od` CLI entry, the stdio MCP server and its tool set, daemon transport, and headless verbs.
- A skill design for `mcp-open-design` modeled on `mcp-magicpath`, including a tool-exposure policy (surface, gate, omit).
- A de-vendor and integration plan for `sk-design-interface`: the CSV replacement map, the uniqueness it gains from live Open Design reads, the integration contract, and the ordered licensing cleanup.
- A cross-lineage reconciliation and a recorded set of ruled-out directions and live-verification items.

**Out of scope:**
- Building either skill or editing the Open Design app (no skill or app change in this packet).
- The standalone `mcp-magicpath` skill (packet `147-mcp-magicpath`), used only as a model.
- Re-deriving or caching Open Design content; the app is read-only input.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- DR-SEED:REQUIREMENTS -->

- R1: The Open Design terminal control surface documented from the bundled code: the real `od` CLI entry, the MCP tool set with read-only, mutating, and destructive tiers, the daemon transport, and the headless verb list.
- R2: A concrete `mcp-open-design` skill design fitted to house conventions, with a tool-exposure policy classifying every verb as surface, gate, or omit.
- R3: A de-vendor and integration plan for `sk-design-interface`: per-CSV disposition, the integration contract with guardrails, and the ordered licensing sequence (data first, MIT notices second, Apache-2.0 base kept).
- R4: The fleet cross-checked: agreements, divergences, and the resolved recommendation called out.
- R5: Negative knowledge (directions ruled out) and a live-verification list recorded as first-class output.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `research/research.md` synthesized from the wave-1 fleet, with a cross-lineage agreement and divergence section.
- A clear terminal control answer: the correct `od` entry, the MCP tool tiers, the socket-discovery transport, and the headless verbs, each sourced from a seat finding.
- A `mcp-open-design` skill design with an explicit surface, gate, and omit policy.
- A `sk-design-interface` de-vendor and integration plan with the ordered licensing sequence and surviving guardrails.
- Ruled-out directions and live-verification items documented.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Mitigation |
|-------------------|------------|
| Initial reads of the CLI and transport were wrong (no `od` shim, socket not a fixed port) | Seat A read the bundled code and ran `--help`; Seat C cross-checked adversarially; both reconciled in research.md |
| The de-vendor touches license files in the wrong order | The ordered sequence puts data deletion first and MIT notice removal second, keeping the Apache-2.0 base |
| Live behavior cannot be confirmed read-only (daemon lifecycle, per-verb auth) | Open items recorded in a live-verification list carried into phases 002 and 004 |
| A live license-deletion defect existed in the working tree | Found and restored to clean baseline this session; recorded in the implementation summary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The exact installer-written MCP entry, whether the daemon dies on app close, whether `od --no-open` gives a working headless daemon, and per-verb auth are confirmed live in phases 002 and 004 rather than in this read-only packet.

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:research-context -->
## 8. RESEARCH CONTEXT

Deep-research is complete for this topic. `research/research.md` is the canonical synthesis output. Inputs assessed:

- The installed app: `/Applications/Open Design.app` (v0.9.0) and its bundled `daemon-cli.mjs` plus `open-design-config.json`.
- Target skills: `.opencode/skills/mcp-magicpath/` (the structural model) and `.opencode/skills/sk-design-interface/` (the de-vendor target).
- House skill standards: `sk-doc` templates and the SKILL.md structure and size conventions.

<!-- /ANCHOR:research-context -->
